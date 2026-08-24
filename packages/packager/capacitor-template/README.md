# capacitor-template

Packager-owned Capacitor scaffold. Synthesized into
`<app>/.capacitor/` by
[`src/pipelines/capacitorPipeline.ts`](../src/pipelines/capacitorPipeline.ts)
on every `packager --target capacitor|ios|android` invocation.
Apps don't edit anything here — and don't edit anything in the
synthesized `.capacitor/` either; the directory is regenerated
each build.

## Files

| File | Purpose |
| --- | --- |
| `capacitor.config.json.tpl` | Capacitor 6 runtime config. Substituted placeholders: `{{APP_ID}}`, `{{APP_NAME}}`, `{{BACKGROUND_HEX}}`. |
| `package.json.tpl` | Self-contained dependency manifest for the `.capacitor/` shell. Substituted: `{{PROJECT_NAME}}`, `{{APP_NAME}}`, `{{VERSION}}`. |
| `gitignore.tpl` | Ignore-all-files gitignore copied into the synthesized cache so apps that accidentally `git add .capacitor/` see no contents to stage. |
| `icons/icon.png` | Default 1024×1024 placeholder icon. Apps that drop `<app>/public/app-icon.png` (square PNG ≥ 1024×1024) override it. |

## Capacitor version pin

The shell's `package.json.tpl` pins `@capacitor/cli` /
`@capacitor/core` / `@capacitor/ios` / `@capacitor/android` to
matching minor versions. Bumping any one of them requires
bumping ALL four to a compatible matched set — Capacitor's CLI
will refuse a mismatched `core`/`ios`/`android` combination
with a clear error.

When upgrading Capacitor:
1. Bump all four `^6.X.Y` entries in `package.json.tpl` together.
2. Test the pipeline on a known-working app (the
   `games/_template-3d/` scaffold is the canonical target).
3. Update [`packages/packager/CLAUDE.md`](../CLAUDE.md) if the
   minor bump changes the `cap` CLI's flag surface or the
   `capacitor.config.json` shape.

## Why a separate `.capacitor/` and not the app's node_modules

Capacitor's native projects (`ios/`, `android/`) contain
relative path references to `@capacitor/ios` and
`@capacitor/android` inside the SAME directory's `node_modules`.
Synthesizing a self-contained shell at `.capacitor/` keeps the
app's `node_modules` clean and locks the Capacitor version to
the packager. Apps that switch the packager version don't need
a parallel Capacitor upgrade in their own dependencies.
