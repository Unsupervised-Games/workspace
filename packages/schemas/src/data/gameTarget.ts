import { z } from 'zod';

// The per-game TARGET descriptor — `.atelier/target.json`, sibling to
// `.atelier/workspace.json`. It declares the language/toolchain a game
// builds with, so the two build-time seams route correctly:
//
//   - @unsupervised/forge picks its REGISTRY EMITTERS from `registryEmitters`
//     (which `lib/generated/assets.ts` — or a C++ `assets.h` — to render
//     from the neutral AssetManifest);
//   - @unsupervised/packager picks its BUILD BACKEND from `buildBackend` (Next.js
//     static export vs. a native `cmake`/`msbuild` invocation).
//
// ABSENT descriptor ⇒ the TypeScript/web default (today's behavior), so
// every existing game is unchanged with zero migration.
//
// This is the canonical contract. @unsupervised/forge imports it directly;
// @unsupervised/packager reads the same file through a narrow local mirror (it
// keeps its commander/execa/fs-extra-only charter). See
// docs/specs/language-agnostic-targets.md.

/** A language label — FREE-FORM. The system is not limited to a fixed set;
 *  a game may target any language. `typescript` is the built-in reference,
 *  everything else is supplied as an external emitter (below). */
export const TargetLanguageSchema = z.string().min(1);
export type TargetLanguage = z.infer<typeof TargetLanguageSchema>;

/** An EXTERNAL registry emitter: a command that renders the neutral
 *  `asset-manifest.json` into a binding in any language. forge invokes it as
 *  `<command> --manifest <path> --out <path>` (the emitter ABI). The emitter
 *  is a user- or community-authored package — forge never learns the
 *  language's syntax. */
export const CommandRegistryEmitterSchema = z.object({
  /** A label for this emitter (e.g. `'rust'`, `'cpp'`). */
  id: z.string().min(1),
  /** The command forge runs. `--manifest <path> --out <path>` are appended. */
  command: z.string().min(1),
  /** Where the binding is written, relative to the game root. */
  output: z.string().min(1),
});
export type CommandRegistryEmitter = z.infer<
  typeof CommandRegistryEmitterSchema
>;

/** A registry-emitter spec: either the NAME of a built-in emitter (a string
 *  — today only `'typescript'`, which writes to `--types`), or an external
 *  emitter command. */
export const RegistryEmitterSpecSchema = z.union([
  z.string().min(1),
  CommandRegistryEmitterSchema,
]);
export type RegistryEmitterSpec = z.infer<typeof RegistryEmitterSpecSchema>;

/** The build backend: `next-web` is the reference (forge → `next build`
 *  static export); `native` runs the game's own toolchain command. */
export const BuildBackendIdSchema = z.enum(['next-web', 'native']);
export type BuildBackendId = z.infer<typeof BuildBackendIdSchema>;

/** The native build step — the command the `native` backend runs, plus
 *  where its artifact lands (for Build & Release to pick up). Ignored by
 *  `next-web`. */
export const GameTargetBuildSchema = z.object({
  command: z.string().min(1),
  artifact: z.string().optional(),
});
export type GameTargetBuild = z.infer<typeof GameTargetBuildSchema>;

/** How to launch the built game for QA/playtest — the command + which QA
 *  transport it speaks (`qa-input-ws` for a native game). */
export const GameTargetRunSchema = z.object({
  command: z.string().min(1),
  qa: z.string().optional(),
});
export type GameTargetRun = z.infer<typeof GameTargetRunSchema>;

export const GameTargetSchema = z.object({
  language: TargetLanguageSchema.default('typescript'),
  /** Which registry bindings forge emits from the manifest. Each entry is a
   *  built-in name (`'typescript'`) or an external emitter command. A game
   *  may request several (e.g. `['typescript', { id: 'rust', … }]`). */
  registryEmitters: z.array(RegistryEmitterSpecSchema).default(['typescript']),
  buildBackend: BuildBackendIdSchema.default('next-web'),
  build: GameTargetBuildSchema.optional(),
  run: GameTargetRunSchema.optional(),
});
export type GameTarget = z.infer<typeof GameTargetSchema>;

/** The TypeScript/web default — what an absent descriptor resolves to, so
 *  today's games build exactly as before. */
export const DEFAULT_GAME_TARGET: GameTarget = {
  language: 'typescript',
  registryEmitters: ['typescript'],
  buildBackend: 'next-web',
};

/**
 * Normalize a raw `.atelier/target.json` value (already `JSON.parse`d, or
 * `null`/`undefined` when the file is absent) into a full `GameTarget`.
 * Pure — the fs read lives in each tool. A present-but-partial descriptor
 * has its omitted fields filled from the defaults; a malformed one throws
 * (a broken target descriptor is a build-time bug, not a silent fallback).
 */
export function resolveGameTarget(raw: unknown): GameTarget {
  if (raw === null || raw === undefined) return { ...DEFAULT_GAME_TARGET };
  return GameTargetSchema.parse(raw);
}
