// Keychain bridge — the Rust half of the workbench's secure TokenStore.
//
// PROBLEM. A signed-in session (access + refresh token) must survive
// app restarts, but a Tauri webview has no secure place to keep it:
// `localStorage` and a plaintext app-data file are both readable by
// anything running as the user. The OS credential vault — macOS
// Keychain, Windows Credential Manager, Linux Secret Service — is the
// right home, and it's only reachable from the Rust side.
//
// THIS MODULE. Three top-level Tauri commands wrapping the `keyring`
// crate, one per `TokenStore` operation. The JS side
// (`apps/workbench/lib/auth/keychainTokenStore.ts`) invokes them with a
// `service` (the app's bundle id) + a `key` (the token slot). The
// `service`/`key` pair maps to one keyring `Entry`; the secret is the
// stored value. The JS owns the service constant so this stays generic.
//
// FEATURE-GATED. This module + its `keyring` dependency compile ONLY
// when the `keychain` Cargo feature is enabled (see Cargo.toml.tpl). The
// packager passes `--features keychain` for apps that declare
// `"keychain": true` in their tauri.config.json (only the workbench
// does). Games never pull `keyring` — so they never take on its
// platform build deps (e.g. libsecret on Linux). This mirrors the
// qa_bridge module's "shipped in the template, compiled only where
// wanted" posture, but gated by a feature (needed in RELEASE) rather
// than `debug_assertions`.
//
// THREADING. keyring calls are blocking OS syscalls, and the first
// access on macOS can raise a modal keychain prompt. Running them on
// the webview's main thread would freeze the UI for the duration, so
// each command hops onto a blocking thread via
// `tauri::async_runtime::spawn_blocking`.
//
// COMMAND NAMING. `keychain_*` (underscore in Rust + on the JS
// `invoke()` call; hyphen-styled `allow-keychain-*` in the TOML
// permissions). Same convention as qa_bridge — see its header for why
// these are top-level commands, not an inline plugin.

use keyring::{Entry, Error as KeyringError};

/// Read a secret. Returns `None` when no entry exists for the
/// `service`/`key` pair (a signed-out slot), so the JS `TokenStore.get`
/// contract (`string | null`) maps directly.
#[tauri::command]
pub async fn keychain_get(service: String, key: String) -> Result<Option<String>, String> {
    run_blocking(move || {
        let entry = Entry::new(&service, &key).map_err(|e| e.to_string())?;
        match entry.get_password() {
            Ok(value) => Ok(Some(value)),
            Err(KeyringError::NoEntry) => Ok(None),
            Err(e) => Err(e.to_string()),
        }
    })
    .await
}

/// Write (create or overwrite) a secret.
#[tauri::command]
pub async fn keychain_set(service: String, key: String, value: String) -> Result<(), String> {
    run_blocking(move || {
        let entry = Entry::new(&service, &key).map_err(|e| e.to_string())?;
        entry.set_password(&value).map_err(|e| e.to_string())
    })
    .await
}

/// Delete a secret. Idempotent — deleting an absent entry is a success,
/// so a sign-out that runs twice (or on a never-persisted slot) doesn't
/// error.
#[tauri::command]
pub async fn keychain_delete(service: String, key: String) -> Result<(), String> {
    run_blocking(move || {
        let entry = Entry::new(&service, &key).map_err(|e| e.to_string())?;
        match entry.delete_credential() {
            Ok(()) => Ok(()),
            Err(KeyringError::NoEntry) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    })
    .await
}

/// Run a blocking keyring closure off the main thread + normalize the
/// join error into the command's `Result<_, String>` error channel.
async fn run_blocking<T, F>(f: F) -> Result<T, String>
where
    T: Send + 'static,
    F: FnOnce() -> Result<T, String> + Send + 'static,
{
    tauri::async_runtime::spawn_blocking(f)
        .await
        .map_err(|e| format!("keychain task failed to join: {e}"))?
}
