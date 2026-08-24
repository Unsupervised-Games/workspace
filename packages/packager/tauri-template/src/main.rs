// Tauri 2 entry point. Auto-synthesized into `<app>/.tauri/src/main.rs`
// by `@unsupervised/packager`. Do not edit here or in the cache directory;
// changes are blown away on every packager invocation.
//
// The `windows_subsystem = "windows"` attribute suppresses the
// extra console window on Windows release builds. Required by
// Tauri's release configuration.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// QA bridge module — see ./qa_bridge.rs. Gated by
// debug_assertions so release builds never link the WS server
// code path. Dev / playtest builds register the commands
// automatically; production binaries don't carry them.
#[cfg(debug_assertions)]
mod qa_bridge;

// Keychain module — see ./keychain.rs. Gated by the `keychain`
// Cargo feature (unlike qa_bridge, this is needed in RELEASE — the
// shipped workbench stores its session in the OS credential vault).
// The packager enables the feature via `--features keychain` for apps
// that set `"keychain": true` in tauri.config.json; games never do, so
// the module + the `keyring` dependency don't compile for them.
#[cfg(feature = "keychain")]
mod keychain;

fn main() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        // fs + http + dialog plugins are registered in every binary;
        // default-capability apps still can't read, write, fetch, or
        // open dialogs (no scope granted). Tooling apps grant explicit
        // scope via `<app>/tauri-capabilities/<name>.json` — see
        // packager CLAUDE.md.
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        // Deep-link plugin — custom URL schemes (e.g. `atelier://`). No
        // scheme is registered unless the app configures one in its
        // tauri.conf `plugins.deep-link` block, so this is a no-op for
        // games; the workbench uses it for the OAuth / magic-link callback.
        .plugin(tauri_plugin_deep_link::init())
        // Notification plugin — native OS notifications. Same posture as the
        // others: registered everywhere, inert until an app grants
        // `notification:default` in its own capability file. No OS permission
        // prompt appears until something actually posts one.
        .plugin(tauri_plugin_notification::init());

    // Always-on setup: register the app's custom URL scheme(s) at runtime.
    // On macOS the Info.plist (generated from the tauri.conf schemes)
    // handles it; Linux + Windows need the runtime registration.
    let builder = builder.setup(|_app| {
        #[cfg(any(windows, target_os = "linux"))]
        {
            use tauri_plugin_deep_link::DeepLinkExt;
            let _ = _app.deep_link().register_all();
        }
        // QA bridge state — dev/debug only. Its three commands
        // (`qa_bridge_start` / `qa_bridge_stop` / `qa_bridge_push`) are
        // registered below under the same cfg gate; production binaries
        // never link the WS server code path.
        #[cfg(debug_assertions)]
        {
            use tauri::Manager;
            _app.manage(qa_bridge::QaBridgeState::default());
        }
        Ok(())
    });

    // One invoke_handler for every command axis — Tauri panics if
    // invoke_handler is called more than once, so the two independent
    // gates (qa_bridge under debug_assertions, keychain under the
    // feature) are expressed as per-entry `#[cfg]` attributes inside a
    // single `generate_handler!`. When both are stripped (a release
    // game with no keychain feature) this is an empty, harmless handler.
    let builder = builder.invoke_handler(tauri::generate_handler![
        #[cfg(debug_assertions)]
        qa_bridge::qa_bridge_start,
        #[cfg(debug_assertions)]
        qa_bridge::qa_bridge_stop,
        #[cfg(debug_assertions)]
        qa_bridge::qa_bridge_push,
        #[cfg(feature = "keychain")]
        keychain::keychain_get,
        #[cfg(feature = "keychain")]
        keychain::keychain_set,
        #[cfg(feature = "keychain")]
        keychain::keychain_delete,
    ]);

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
