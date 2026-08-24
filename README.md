# {{WORKSPACE_NAME}}

A Turborepo holding this studio's games and the Atelier build pipeline.

```sh
pnpm install
pnpm build          # builds the pipeline, then every game
```

## Layout

| Path | What |
| --- | --- |
| `games/` | One directory per game. Created by the Workbench. |
| `packages/` | The Atelier pipeline, **vendored** — see below. Your own shared code goes here too. |

`pnpm-workspace.yaml` also globs `apps/*`, for anything that is neither a game
nor a library — a level editor, a build dashboard, a companion site. Create the
directory when you want one; nothing depends on it existing.

## The pipeline is vendored, not installed

`packages/config`, `packages/forge`, and `packages/packager` are checked into
this repo rather than pulled from a registry. Two consequences worth knowing:

**It works offline, and needs no registry account.** `pnpm install` resolves
every `@unsupervised/*` package from this repo.

**Updates arrive by replacing these directories**, not by bumping a version.
They are a copy taken when this workspace was created. If you edit them, note
what you changed — an update overwrites the directory.

Everything else — `@unsupervised/schemas`, `telemetry`, `qa-input` — is an
ordinary dependency a game declares when it uses it.
