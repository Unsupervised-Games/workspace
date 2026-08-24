# Tauri scaffold template

Canonical Tauri 2 scaffold owned by `@unsupervised/packager`. The
packager synthesizes `<app>/.tauri/` from this directory each
time `packager dev --target tauri` or `packager build --target
tauri` runs.

**Apps never copy this directory.** The whole point: zero
boilerplate in apps. Apps that need overrides ship a
`tauri.config.json` at the app root; the packager merges it
over the defaults derived from `package.json`.

Files here are templated — `{{NAME}}`, `{{PRODUCT_NAME}}`,
`{{IDENTIFIER}}`, `{{VERSION}}`, `{{TITLE}}`, etc. — and
substituted at synthesis time. See
`packages/packager/src/pipelines/tauriPipeline.ts` for the
templating logic.

## Files

- `Cargo.toml.tpl` — Rust crate manifest. Tauri 2.x deps + the
  crate name templated from the app's `package.json`.
- `tauri.conf.json.tpl` — Tauri 2 schema config. Window title,
  product name, identifier, frontendDist (always `../out`),
  devUrl (always `http://localhost:3000`), bundle targets.
- `src/main.rs` — entry point. Pure boilerplate; no templating.
- `build.rs` — build script. Pure boilerplate.
- `capabilities/default.json` — Tauri 2 ACL. Default permissions
  for the main window (core + shell:open).
- `gitignore.tpl` — git-ignore patterns; copied to `.tauri/.gitignore`
  on synthesis so generated artifacts under `.tauri/target/` don't
  pollute commits even if the user mistakenly stages the cache dir.
- `icons/icon.png` — placeholder 1024×1024 source. On first build
  the packager runs `tauri icon` against this (or the app's
  override at `<app>/public/app-icon.png`) to generate the
  platform-specific binaries.
