// QA bridge — Rust half of `@unsupervised/qa-input-ws`.
//
// PROBLEM. The game's webview JS can't open a server socket
// (browser WebSocket API is client-only). The QA pipeline
// needs a localhost WebSocket the workbench process can connect
// to — that has to live on the Rust side of the Tauri shell.
//
// THIS MODULE. A Tauri plugin exposing three commands +
// emitting two events. Bind a 127.0.0.1 TCP listener, accept
// WebSocket upgrades, run a typed auth handshake, fan-out
// outbound frames to the connected client, forward inbound
// envelopes to the webview JS via Tauri events. The JS-side
// (`@unsupervised/qa-input-ws`) bridges those events into the
// existing `@unsupervised/qa-input` dispatch path.
//
// LIFECYCLE. `start` is idempotent-after-stop — calling it
// twice without an intervening `stop` returns an error. The
// JS-side bridge handles the dev hot-reload case by calling
// `stop` before re-`start`-ing.
//
// AUTHORIZATION. 32-byte random token generated at `start`,
// published in the discovery file workbench reads, presented in
// the WS handshake. Constant-time compared (`subtle`) so the
// server doesn't leak token bytes via timing. v1 caps the
// active connection count at 1; a second connect during an
// existing session is rejected with `'already-connected'` +
// the current client's name.
//
// SECURITY. The TCP listener binds ONLY to 127.0.0.1 — never
// 0.0.0.0. This is a localhost-only contract; remote QA
// requires a different design (TLS + a different auth model)
// that's out of scope for v1.
//
// GATING. This entire module is `#[cfg(debug_assertions)]` at
// the call site — the plugin is registered only in dev /
// debug builds. Production binaries built with `--release` /
// `tauri build` never link the plugin into `main.rs` (the
// dependencies in Cargo.toml remain unconditional, but the
// linker eliminates the unused code path).

use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;

use futures_util::stream::{SplitSink, SplitStream};
use futures_util::{SinkExt, StreamExt};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use subtle::ConstantTimeEq;
use tauri::{AppHandle, Emitter, Manager, Runtime, State};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{broadcast, oneshot, Mutex};
use tokio::task::JoinHandle;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::{accept_async, WebSocketStream};

// ─────────────────────────────────────────────────────────
// Constants — match the @unsupervised/qa-input-ws JS contract
// ─────────────────────────────────────────────────────────

/// Handshake protocol version. Must match
/// `HANDSHAKE_PROTOCOL_VERSION` in `packages/qa-input-ws/src/handshake.ts`.
const PROTOCOL_VERSION: u32 = 1;

/// How long to wait for the handshake request after the WS
/// upgrade succeeds before dropping the connection. The JS
/// client's default is 5s; we match.
const HANDSHAKE_TIMEOUT: Duration = Duration::from_secs(5);

/// v1 caps active clients at 1. See `packages/qa-input-ws/CLAUDE.md`
/// — "Connection multiplicity" question 1 resolved as
/// single-client.
const MAX_CONNECTIONS: usize = 1;

/// Tokio broadcast buffer size. Bigger means more memory but
/// fewer Lagged drops under heavy telemetry bursts. 256 covers
/// ~10s of 30Hz snapshots plus headroom for ack frames.
const BROADCAST_BUFFER: usize = 256;

/// Discovery file subdirectory under the user's home dir.
/// Must match `DEFAULT_DISCOVERY_DIRNAME` in
/// `packages/qa-input-ws/src/discovery.ts`.
///
/// HOME vs. APPLOCALDATA: Tauri's `app_local_data_dir()` is
/// **per-bundle** on every platform (e.g., macOS:
/// `~/Library/Application Support/<bundle-id>/`). Two
/// different Atelier binaries — komorebi (the game) + workbench
/// (the QA harness) — resolve `app_local_data_dir()` to
/// different roots, so a discovery file written by one is
/// not visible to the other. The rendezvous needs a path
/// they BOTH agree on. `$HOME` works across all platforms
/// the engine targets + sits outside any Tauri-bundle's
/// private data tree.
const DISCOVERY_DIRNAME: &str = ".atelier-qa-bridge";

/// Tauri event names. Must match `QA_BRIDGE_EVENTS` in
/// `packages/qa-input-ws/src/server.ts`. Hyphenated (not
/// underscored) because Tauri 2's permission system enforces
/// `lowercase ASCII + hyphens + single colon` for the plugin
/// identifier, and aligning event names with that convention
/// keeps the wire predictable.
const ENVELOPE_EVENT: &str = "qa-bridge://envelope";
const CONNECTION_COUNT_EVENT: &str = "qa-bridge://connection-count";

// ─────────────────────────────────────────────────────────
// Top-level Tauri commands
//
// Registered directly on the app's Builder via
// `.invoke_handler(tauri::generate_handler![...])` from main.rs,
// NOT wrapped in a `Builder::new("qa-bridge").build()` plugin.
//
// Why not a plugin: Tauri 2 expects plugin-namespaced
// permissions to come from the plugin's OWN crate's
// `permissions/` directory. For an INLINE plugin defined in
// the app's own crate, the permission discovery doesn't
// auto-prefix with the plugin name + the capability system
// rejects `qa-bridge:allow-start`-style identifiers. Top-level
// commands sidestep this — their permissions live in the app's
// `permissions/` directory + the capability grants them by
// bare name (`allow-qa-bridge-start`). Same security outcome,
// simpler integration.
//
// COMMAND NAMING. `qa_bridge_*` (underscore prefix in Rust;
// hyphen-styled `allow-qa-bridge-*` in TOML permissions; same
// `qa_bridge_*` on the JS-side `invoke()` call). The prefix
// keeps the command namespace honest — collisions with future
// app-level commands are impossible.
// ─────────────────────────────────────────────────────────

#[derive(Default)]
pub struct QaBridgeState {
    inner: Mutex<Option<RunningServer>>,
}

struct RunningServer {
    /// 32-byte hex token clients must present in the
    /// handshake. Held in the struct for diagnostic /
    /// future-introspection use; the active checker lives
    /// in the per-connection handler which gets a clone at
    /// spawn time.
    #[allow(dead_code)]
    token: String,
    /// Absolute path of the discovery file. Cleared on stop.
    discovery_file_path: String,
    /// Channel used to signal the accept loop to exit. Wrapped
    /// in Option so we can take it on stop without owning the
    /// whole struct.
    shutdown_tx: Option<oneshot::Sender<()>>,
    /// Broadcast tx for outbound frames. Each client task
    /// subscribes with `subscribe()`.
    broadcast_tx: broadcast::Sender<String>,
    /// Handle for the accept loop task. Awaited on stop so we
    /// don't return before the loop exits.
    accept_handle: JoinHandle<()>,
    /// Number of currently-connected clients. Incremented on
    /// handshake-accept, decremented on close. Capped at
    /// MAX_CONNECTIONS by the handshake. Held here so the
    /// state stays alive across the accept-loop spawn; the
    /// per-connection handlers receive Arc clones.
    #[allow(dead_code)]
    connection_count: Arc<Mutex<usize>>,
    /// Name of the currently-connected client, used in
    /// `'already-connected'` rejections. None when no client.
    /// Held here for the same Arc-lifetime reason as
    /// `connection_count`.
    #[allow(dead_code)]
    current_client_name: Arc<Mutex<Option<String>>>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StartResult {
    port: u16,
    token: String,
    discovery_file_path: String,
}

// ─────────────────────────────────────────────────────────
// Tauri commands
// ─────────────────────────────────────────────────────────

#[tauri::command]
pub async fn qa_bridge_start<R: Runtime>(
    app: AppHandle<R>,
    state: State<'_, QaBridgeState>,
    game_slug: String,
    port: u16,
) -> Result<StartResult, String> {
    if !is_valid_slug(&game_slug) {
        return Err(format!(
            "invalid gameSlug '{game_slug}' — must be alphanumeric + '-' / '_', starting with alphanumeric"
        ));
    }

    let mut guard = state.inner.lock().await;
    if guard.is_some() {
        return Err(
            "qa_bridge already running — call stop before restart".to_string(),
        );
    }

    let token = generate_token();

    // Bind 127.0.0.1 only — never 0.0.0.0. Localhost-only
    // contract.
    let bind_addr: SocketAddr = format!("127.0.0.1:{port}")
        .parse()
        .map_err(|e| format!("invalid bind address: {e}"))?;
    let listener = TcpListener::bind(bind_addr)
        .await
        .map_err(|e| format!("TCP bind failed: {e}"))?;
    let actual_port = listener
        .local_addr()
        .map_err(|e| format!("local_addr failed: {e}"))?
        .port();

    let home_dir = app
        .path()
        .home_dir()
        .map_err(|e| format!("home_dir failed: {e}"))?;
    let discovery_dir = home_dir.join(DISCOVERY_DIRNAME);
    tokio::fs::create_dir_all(&discovery_dir)
        .await
        .map_err(|e| format!("create discovery dir failed: {e}"))?;
    let discovery_path = discovery_dir.join(format!("{game_slug}.json"));

    let pid = std::process::id();
    let started_at = format_rfc3339_now();
    let record = json!({
        "schemaVersion": 1,
        "gameSlug": game_slug,
        "port": actual_port,
        "token": token,
        "pid": pid,
        "startedAt": started_at,
    });
    let body = serde_json::to_string_pretty(&record)
        .map_err(|e| format!("serialize discovery record: {e}"))?;
    tokio::fs::write(&discovery_path, body)
        .await
        .map_err(|e| format!("write discovery file: {e}"))?;
    let discovery_path_str = discovery_path.to_string_lossy().into_owned();

    let (shutdown_tx, shutdown_rx) = oneshot::channel();
    let (broadcast_tx, _) = broadcast::channel::<String>(BROADCAST_BUFFER);
    let connection_count = Arc::new(Mutex::new(0usize));
    let current_client_name = Arc::new(Mutex::new(None::<String>));

    let accept_ctx = AcceptContext {
        listener,
        shutdown_rx,
        app: app.clone(),
        token: token.clone(),
        game_slug: game_slug.clone(),
        broadcast_tx: broadcast_tx.clone(),
        connection_count: Arc::clone(&connection_count),
        current_client_name: Arc::clone(&current_client_name),
    };
    let accept_handle = tokio::spawn(run_accept_loop(accept_ctx));

    *guard = Some(RunningServer {
        token: token.clone(),
        discovery_file_path: discovery_path_str.clone(),
        shutdown_tx: Some(shutdown_tx),
        broadcast_tx,
        accept_handle,
        connection_count,
        current_client_name,
    });

    Ok(StartResult {
        port: actual_port,
        token,
        discovery_file_path: discovery_path_str,
    })
}

#[tauri::command]
pub async fn qa_bridge_stop<R: Runtime>(
    app: AppHandle<R>,
    state: State<'_, QaBridgeState>,
) -> Result<(), String> {
    let mut guard = state.inner.lock().await;
    let mut server = match guard.take() {
        Some(s) => s,
        None => return Ok(()),
    };

    // Best-effort: signal accept loop to exit + wait for it.
    if let Some(tx) = server.shutdown_tx.take() {
        let _ = tx.send(());
    }
    // Drop the broadcast tx — clients receiving outbound see
    // RecvError::Closed and exit their loop.
    drop(server.broadcast_tx);
    // Wait for the accept loop to actually exit. Bounded by
    // the shutdown signal — should complete quickly.
    let _ = server.accept_handle.await;
    // Best-effort cleanup of the discovery file.
    let _ = tokio::fs::remove_file(&server.discovery_file_path).await;
    // Tell the webview the connection count is 0.
    let _ = app.emit(CONNECTION_COUNT_EVENT, 0_usize);
    Ok(())
}

#[tauri::command]
pub async fn qa_bridge_push(
    state: State<'_, QaBridgeState>,
    frame: Value,
) -> Result<(), String> {
    let guard = state.inner.lock().await;
    let server = match guard.as_ref() {
        Some(s) => s,
        None => return Err("qa_bridge not running".to_string()),
    };
    let serialized = serde_json::to_string(&frame)
        .map_err(|e| format!("frame serialize failed: {e}"))?;
    // Ignore SendError — `push` is a successful no-op when
    // there are no receivers (no client connected). The
    // JS-side bridge fires push for every telemetry event
    // regardless of connection state; that's by design.
    let _ = server.broadcast_tx.send(serialized);
    Ok(())
}

// ─────────────────────────────────────────────────────────
// Accept loop
// ─────────────────────────────────────────────────────────

struct AcceptContext<R: Runtime> {
    listener: TcpListener,
    shutdown_rx: oneshot::Receiver<()>,
    app: AppHandle<R>,
    token: String,
    game_slug: String,
    broadcast_tx: broadcast::Sender<String>,
    connection_count: Arc<Mutex<usize>>,
    current_client_name: Arc<Mutex<Option<String>>>,
}

async fn run_accept_loop<R: Runtime>(mut ctx: AcceptContext<R>) {
    loop {
        tokio::select! {
            _ = &mut ctx.shutdown_rx => {
                break;
            }
            accept_result = ctx.listener.accept() => {
                match accept_result {
                    Ok((stream, _peer_addr)) => {
                        let conn_ctx = ConnectionContext {
                            app: ctx.app.clone(),
                            expected_token: ctx.token.clone(),
                            game_slug: ctx.game_slug.clone(),
                            broadcast_tx: ctx.broadcast_tx.clone(),
                            connection_count: Arc::clone(&ctx.connection_count),
                            current_client_name: Arc::clone(&ctx.current_client_name),
                        };
                        tokio::spawn(async move {
                            if let Err(e) = handle_connection(stream, conn_ctx).await {
                                eprintln!("[qa_bridge] connection error: {e}");
                            }
                        });
                    }
                    Err(e) => {
                        // Listener errors are rare — log and back
                        // off briefly before retrying so a transient
                        // OS-level fault doesn't burn CPU.
                        eprintln!("[qa_bridge] accept failed: {e}");
                        tokio::time::sleep(Duration::from_millis(100)).await;
                    }
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────
// Per-connection handler
// ─────────────────────────────────────────────────────────

struct ConnectionContext<R: Runtime> {
    app: AppHandle<R>,
    expected_token: String,
    game_slug: String,
    broadcast_tx: broadcast::Sender<String>,
    connection_count: Arc<Mutex<usize>>,
    current_client_name: Arc<Mutex<Option<String>>>,
}

type WsSink = SplitSink<WebSocketStream<TcpStream>, Message>;
type WsSource = SplitStream<WebSocketStream<TcpStream>>;

async fn handle_connection<R: Runtime>(
    stream: TcpStream,
    ctx: ConnectionContext<R>,
) -> Result<(), String> {
    let ws_stream = accept_async(stream)
        .await
        .map_err(|e| format!("WS upgrade failed: {e}"))?;
    let (mut sink, mut source) = ws_stream.split();

    // ── Handshake ──
    let request = read_handshake_request(&mut source).await?;
    if !validate_handshake_kind(&request) {
        send_reject(&mut sink, "protocol-version-mismatch", None).await;
        return Ok(());
    }
    if request.protocol_version != PROTOCOL_VERSION {
        send_reject(&mut sink, "protocol-version-mismatch", None).await;
        return Ok(());
    }
    if !token_matches(&request.token, &ctx.expected_token) {
        send_reject(&mut sink, "bad-token", None).await;
        return Ok(());
    }

    // Check + reserve the connection slot. v1 caps at 1.
    {
        let mut cnt = ctx.connection_count.lock().await;
        if *cnt >= MAX_CONNECTIONS {
            let other_name = ctx.current_client_name.lock().await.clone();
            drop(cnt);
            send_reject(&mut sink, "already-connected", other_name).await;
            return Ok(());
        }
        *cnt += 1;
    }
    *ctx.current_client_name.lock().await = Some(request.client_name.clone());

    // Send accept frame.
    let accept_body = json!({
        "kind": "qa-ws-handshake-accept",
        "gameSlug": ctx.game_slug,
        "serverFeatures": ["acks", "reactions"],
    });
    if let Err(e) = sink
        .send(Message::Text(accept_body.to_string()))
        .await
    {
        eprintln!("[qa_bridge] accept send failed: {e}");
        release_slot(&ctx).await;
        return Ok(());
    }

    // Announce the new connection count to the webview.
    let count_after_accept = *ctx.connection_count.lock().await;
    let _ = ctx.app.emit(CONNECTION_COUNT_EVENT, count_after_accept);

    // ── Post-handshake loop ──
    let mut outbound_rx = ctx.broadcast_tx.subscribe();
    run_post_handshake_loop(&mut sink, &mut source, &mut outbound_rx, &ctx.app).await;

    // ── Cleanup ──
    release_slot(&ctx).await;
    Ok(())
}

async fn release_slot<R: Runtime>(ctx: &ConnectionContext<R>) {
    {
        let mut cnt = ctx.connection_count.lock().await;
        if *cnt > 0 {
            *cnt -= 1;
        }
    }
    *ctx.current_client_name.lock().await = None;
    let count = *ctx.connection_count.lock().await;
    let _ = ctx.app.emit(CONNECTION_COUNT_EVENT, count);
}

// ─────────────────────────────────────────────────────────
// Handshake helpers
// ─────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct HandshakeRequest {
    kind: String,
    #[serde(rename = "protocolVersion")]
    protocol_version: u32,
    token: String,
    #[serde(rename = "clientName")]
    client_name: String,
    // The handshake also carries clientId (UUID) which the
    // server doesn't currently use — the slug-collision /
    // namespace concerns are workbench-side. We accept + ignore.
    #[serde(rename = "clientId", default)]
    #[allow(dead_code)]
    client_id: String,
}

fn validate_handshake_kind(req: &HandshakeRequest) -> bool {
    req.kind == "qa-ws-handshake-request"
}

async fn read_handshake_request(
    source: &mut WsSource,
) -> Result<HandshakeRequest, String> {
    let msg = tokio::time::timeout(HANDSHAKE_TIMEOUT, source.next())
        .await
        .map_err(|_| "handshake timed out".to_string())?
        .ok_or_else(|| "connection closed before handshake".to_string())?
        .map_err(|e| format!("handshake read failed: {e}"))?;
    let text = match msg {
        Message::Text(t) => t,
        Message::Binary(_) => return Err("handshake: binary not accepted".to_string()),
        _ => return Err("handshake: control frame not accepted".to_string()),
    };
    serde_json::from_str::<HandshakeRequest>(&text)
        .map_err(|e| format!("handshake parse failed: {e}"))
}

async fn send_reject(
    sink: &mut WsSink,
    reason: &str,
    current_client_name: Option<String>,
) {
    let mut body = HashMap::new();
    body.insert("kind".to_string(), json!("qa-ws-handshake-reject"));
    body.insert("reason".to_string(), json!(reason));
    if let Some(name) = current_client_name {
        body.insert("currentClientName".to_string(), json!(name));
    }
    let serialized = match serde_json::to_string(&body) {
        Ok(s) => s,
        Err(_) => return,
    };
    let _ = sink.send(Message::Text(serialized)).await;
    let _ = sink.close().await;
}

// ─────────────────────────────────────────────────────────
// Post-handshake loop
// ─────────────────────────────────────────────────────────

async fn run_post_handshake_loop<R: Runtime>(
    sink: &mut WsSink,
    source: &mut WsSource,
    outbound_rx: &mut broadcast::Receiver<String>,
    app: &AppHandle<R>,
) {
    loop {
        tokio::select! {
            outbound = outbound_rx.recv() => {
                match outbound {
                    Ok(payload) => {
                        if sink.send(Message::Text(payload)).await.is_err() {
                            return;
                        }
                    }
                    Err(broadcast::error::RecvError::Lagged(_)) => {
                        // Best-effort: drop lagged frames rather
                        // than block. A snapshot tick lost to lag
                        // is recoverable; an unresponsive sink
                        // isn't.
                        continue;
                    }
                    Err(broadcast::error::RecvError::Closed) => return,
                }
            }
            inbound = source.next() => {
                match inbound {
                    Some(Ok(Message::Text(text))) => {
                        handle_inbound_frame(&text, app);
                    }
                    Some(Ok(Message::Ping(payload))) => {
                        let _ = sink.send(Message::Pong(payload)).await;
                    }
                    Some(Ok(Message::Close(_))) => return,
                    Some(Ok(_)) => {
                        // Pong / Frame / Binary — ignore.
                    }
                    Some(Err(e)) => {
                        eprintln!("[qa_bridge] inbound read error: {e}");
                        return;
                    }
                    None => return,
                }
            }
        }
    }
}

fn handle_inbound_frame<R: Runtime>(text: &str, app: &AppHandle<R>) {
    let frame: Value = match serde_json::from_str(text) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("[qa_bridge] dropped malformed frame: {e}");
            return;
        }
    };
    let kind = match frame.get("kind").and_then(|k| k.as_str()) {
        Some(k) => k,
        None => return,
    };
    match kind {
        "qa-input.envelope" | "qa-input.reactions" => {
            if let Some(envelope) = frame.get("envelope") {
                let _ = app.emit(ENVELOPE_EVENT, envelope.clone());
            }
        }
        _ => {
            // Wrong-direction or unknown frame — drop with a
            // log line. The workbench client side has the same
            // guard and logs verbatim.
            eprintln!("[qa_bridge] dropped wrong-direction frame: {kind}");
        }
    }
}

// ─────────────────────────────────────────────────────────
// Utilities — token, slug, timestamp
// ─────────────────────────────────────────────────────────

fn generate_token() -> String {
    let mut bytes = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut bytes);
    let mut hex = String::with_capacity(64);
    for b in bytes.iter() {
        hex.push_str(&format!("{b:02x}"));
    }
    hex
}

fn is_valid_slug(s: &str) -> bool {
    if s.is_empty() || s.len() > 120 {
        return false;
    }
    let mut chars = s.chars();
    let first = match chars.next() {
        Some(c) => c,
        None => return false,
    };
    if !first.is_ascii_alphanumeric() {
        return false;
    }
    chars.all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
}

fn token_matches(supplied: &str, expected: &str) -> bool {
    // Constant-time comparison. Different-length tokens
    // short-circuit (the length itself isn't secret), but
    // same-length tokens go through subtle's ct_eq so token
    // bytes don't leak via timing.
    if supplied.len() != expected.len() {
        return false;
    }
    supplied.as_bytes().ct_eq(expected.as_bytes()).into()
}

fn format_rfc3339_now() -> String {
    use time::format_description::well_known::Rfc3339;
    let now = time::OffsetDateTime::now_utc();
    now.format(&Rfc3339)
        .unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string())
}

// ─────────────────────────────────────────────────────────
// Tests — for the pure helpers. The async server path
// requires an integration test against a real WebSocket
// client; deferred to a separate Cargo test crate that the
// packager can opt into in a future iteration.
// ─────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generate_token_is_64_hex_chars() {
        let t = generate_token();
        assert_eq!(t.len(), 64);
        assert!(t.chars().all(|c| c.is_ascii_hexdigit()));
    }

    #[test]
    fn generate_token_produces_distinct_values() {
        let a = generate_token();
        let b = generate_token();
        assert_ne!(a, b);
    }

    #[test]
    fn token_matches_accepts_equal_tokens() {
        assert!(token_matches("abc123", "abc123"));
    }

    #[test]
    fn token_matches_rejects_mismatched_tokens() {
        assert!(!token_matches("abc123", "abc456"));
    }

    #[test]
    fn token_matches_rejects_different_lengths() {
        assert!(!token_matches("abc", "abcdef"));
        assert!(!token_matches("abcdef", "abc"));
    }

    #[test]
    fn is_valid_slug_accepts_normal_slugs() {
        assert!(is_valid_slug("komorebi"));
        assert!(is_valid_slug("test-game"));
        assert!(is_valid_slug("test_game_1"));
        assert!(is_valid_slug("a"));
    }

    #[test]
    fn is_valid_slug_rejects_path_traversal() {
        assert!(!is_valid_slug("../etc/passwd"));
        assert!(!is_valid_slug("../"));
        assert!(!is_valid_slug("test/game"));
    }

    #[test]
    fn is_valid_slug_rejects_empty() {
        assert!(!is_valid_slug(""));
    }

    #[test]
    fn is_valid_slug_rejects_leading_punctuation() {
        assert!(!is_valid_slug("-test"));
        assert!(!is_valid_slug("_test"));
    }

    #[test]
    fn format_rfc3339_now_produces_valid_iso() {
        let s = format_rfc3339_now();
        // 2026-06-18T14:23:01.000000Z shape
        assert!(s.len() >= 20);
        assert!(s.contains('T'));
        assert!(s.ends_with('Z') || s.contains('+'));
    }
}
