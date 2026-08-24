[package]
name = "{{CRATE_NAME}}"
version = "{{VERSION}}"
description = "{{PRODUCT_NAME}}"
edition = "2021"

# The Tauri CLI compiles src/main.rs as a regular binary.
# `main` is the conventional entry point.
[[bin]]
name = "{{CRATE_NAME}}"
path = "src/main.rs"

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-shell = "2"
# fs + http + dialog plugins are INCLUDED in every Tauri-built
# app's binary so engine-tooling apps (assets, narrative, future
# asset / save / dev-tools viewers) can read + write workspace
# files, call external APIs (CivitAI, ElevenLabs, Meshy, ...)
# without hitting the webview's CORS layer, and surface native
# Open / Save dialogs. Combined they add ~120 KB + ZERO
# permissions by default — apps that don't grant scope in their
# capabilities can't reach the filesystem, the network, or the
# dialog APIs at all. Games keep the safe-by-default posture;
# tooling opts in via its own `tauri-capabilities/<name>.json`.
# See packager CLAUDE.md.
tauri-plugin-fs = "2"
tauri-plugin-http = "2"
tauri-plugin-dialog = "2"
# Deep-link plugin — enables custom URL schemes (e.g. `atelier://`) so
# an OAuth / magic-link redirect can reach the app. Registered in every
# binary; harmless with no scheme configured. An app opts in by setting
# `deepLinkSchemes` in its tauri.config.json (→ the tauri.conf plugins
# block) + granting the capability. Only the workbench uses it today.
tauri-plugin-deep-link = "2"
# Notification plugin — native OS notifications ("your build finished").
# Registered in every binary but INERT without the capability: an app that
# grants no `notification:*` permission cannot post one, and the OS-level
# permission prompt only appears the first time an app actually requests it.
# The workbench uses it for agent-run / build completion; games may use it for
# their own long-running tooling.
tauri-plugin-notification = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"

# Keychain (keychain feature) — the OS credential-vault backend for
# the workbench's secure TokenStore (see src/keychain.rs). `optional`
# + behind the `keychain` feature so it's pulled ONLY when the packager
# builds with `--features keychain` (apps that set `"keychain": true`
# in tauri.config.json — only the workbench). Games never enable the
# feature, so they never take on keyring's platform build deps (notably
# libsecret / Secret Service on Linux). Explicit per-platform native
# backends: Keychain (macOS), Credential Manager (Windows), Secret
# Service (Linux) — all persistent across restarts.
keyring = { version = "3", optional = true, default-features = false, features = ["apple-native", "windows-native", "sync-secret-service"] }

# QA bridge (qa_bridge plugin) — localhost WebSocket server
# bridging workbench's QA pipeline to desktop-built Atelier games.
# The qa_bridge module is `#[cfg(debug_assertions)]`-gated so
# release builds tree-shake the bridge entirely + never bind
# a localhost port. The dependencies stay in every build's
# Cargo.toml because Cargo doesn't support `debug_assertions`-
# conditional deps; the linker drops the dead code in release
# (~300-500 KB binary-size hit which is acceptable for v1, can
# be moved to a Cargo feature later if a game targets a
# tighter binary). See
# [packages/qa-input-ws/CLAUDE.md](../../qa-input-ws/CLAUDE.md)
# for the wire contract + lifecycle.
tokio = { version = "1", features = ["rt-multi-thread", "macros", "net", "sync", "time", "fs"] }
tokio-tungstenite = "0.24"
futures-util = "0.3"
subtle = "2.6"
rand = "0.8"
time = { version = "0.3", features = ["formatting"] }

[features]
# `custom-protocol` is needed so the production build serves
# the frontendDist files via Tauri's custom asset protocol
# rather than expecting a dev-mode HTTP server. Wired by the
# Tauri 2 CLI automatically when `tauri build` runs.
custom-protocol = ["tauri/custom-protocol"]
# `keychain` pulls in the `keyring` dependency + compiles the
# src/keychain.rs commands. Enabled by the packager via
# `--features keychain` for apps that set `"keychain": true` in
# tauri.config.json (the workbench). Off by default → games don't
# compile the keychain surface or its deps.
keychain = ["dep:keyring"]
