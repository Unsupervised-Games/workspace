import { z } from 'zod';
/** A language label — FREE-FORM. The system is not limited to a fixed set;
 *  a game may target any language. `typescript` is the built-in reference,
 *  everything else is supplied as an external emitter (below). */
export declare const TargetLanguageSchema: z.ZodString;
export type TargetLanguage = z.infer<typeof TargetLanguageSchema>;
/** An EXTERNAL registry emitter: a command that renders the neutral
 *  `asset-manifest.json` into a binding in any language. forge invokes it as
 *  `<command> --manifest <path> --out <path>` (the emitter ABI). The emitter
 *  is a user- or community-authored package — forge never learns the
 *  language's syntax. */
export declare const CommandRegistryEmitterSchema: z.ZodObject<{
    /** A label for this emitter (e.g. `'rust'`, `'cpp'`). */
    id: z.ZodString;
    /** The command forge runs. `--manifest <path> --out <path>` are appended. */
    command: z.ZodString;
    /** Where the binding is written, relative to the game root. */
    output: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    command: string;
    output: string;
}, {
    id: string;
    command: string;
    output: string;
}>;
export type CommandRegistryEmitter = z.infer<typeof CommandRegistryEmitterSchema>;
/** A registry-emitter spec: either the NAME of a built-in emitter (a string
 *  — today only `'typescript'`, which writes to `--types`), or an external
 *  emitter command. */
export declare const RegistryEmitterSpecSchema: z.ZodUnion<[z.ZodString, z.ZodObject<{
    /** A label for this emitter (e.g. `'rust'`, `'cpp'`). */
    id: z.ZodString;
    /** The command forge runs. `--manifest <path> --out <path>` are appended. */
    command: z.ZodString;
    /** Where the binding is written, relative to the game root. */
    output: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    command: string;
    output: string;
}, {
    id: string;
    command: string;
    output: string;
}>]>;
export type RegistryEmitterSpec = z.infer<typeof RegistryEmitterSpecSchema>;
/** The build backend: `next-web` is the reference (forge → `next build`
 *  static export); `native` runs the game's own toolchain command. */
export declare const BuildBackendIdSchema: z.ZodEnum<["next-web", "native"]>;
export type BuildBackendId = z.infer<typeof BuildBackendIdSchema>;
/** The native build step — the command the `native` backend runs, plus
 *  where its artifact lands (for Build & Release to pick up). Ignored by
 *  `next-web`. */
export declare const GameTargetBuildSchema: z.ZodObject<{
    command: z.ZodString;
    artifact: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    command: string;
    artifact?: string | undefined;
}, {
    command: string;
    artifact?: string | undefined;
}>;
export type GameTargetBuild = z.infer<typeof GameTargetBuildSchema>;
/** How to launch the built game for QA/playtest — the command + which QA
 *  transport it speaks (`qa-input-ws` for a native game). */
export declare const GameTargetRunSchema: z.ZodObject<{
    command: z.ZodString;
    qa: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    command: string;
    qa?: string | undefined;
}, {
    command: string;
    qa?: string | undefined;
}>;
export type GameTargetRun = z.infer<typeof GameTargetRunSchema>;
export declare const GameTargetSchema: z.ZodObject<{
    language: z.ZodDefault<z.ZodString>;
    /** Which registry bindings forge emits from the manifest. Each entry is a
     *  built-in name (`'typescript'`) or an external emitter command. A game
     *  may request several (e.g. `['typescript', { id: 'rust', … }]`). */
    registryEmitters: z.ZodDefault<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        /** A label for this emitter (e.g. `'rust'`, `'cpp'`). */
        id: z.ZodString;
        /** The command forge runs. `--manifest <path> --out <path>` are appended. */
        command: z.ZodString;
        /** Where the binding is written, relative to the game root. */
        output: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        command: string;
        output: string;
    }, {
        id: string;
        command: string;
        output: string;
    }>]>, "many">>;
    buildBackend: z.ZodDefault<z.ZodEnum<["next-web", "native"]>>;
    build: z.ZodOptional<z.ZodObject<{
        command: z.ZodString;
        artifact: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        artifact?: string | undefined;
    }, {
        command: string;
        artifact?: string | undefined;
    }>>;
    run: z.ZodOptional<z.ZodObject<{
        command: z.ZodString;
        qa: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        qa?: string | undefined;
    }, {
        command: string;
        qa?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    language: string;
    registryEmitters: (string | {
        id: string;
        command: string;
        output: string;
    })[];
    buildBackend: "next-web" | "native";
    build?: {
        command: string;
        artifact?: string | undefined;
    } | undefined;
    run?: {
        command: string;
        qa?: string | undefined;
    } | undefined;
}, {
    language?: string | undefined;
    registryEmitters?: (string | {
        id: string;
        command: string;
        output: string;
    })[] | undefined;
    buildBackend?: "next-web" | "native" | undefined;
    build?: {
        command: string;
        artifact?: string | undefined;
    } | undefined;
    run?: {
        command: string;
        qa?: string | undefined;
    } | undefined;
}>;
export type GameTarget = z.infer<typeof GameTargetSchema>;
/** The TypeScript/web default — what an absent descriptor resolves to, so
 *  today's games build exactly as before. */
export declare const DEFAULT_GAME_TARGET: GameTarget;
/**
 * Normalize a raw `.atelier/target.json` value (already `JSON.parse`d, or
 * `null`/`undefined` when the file is absent) into a full `GameTarget`.
 * Pure — the fs read lives in each tool. A present-but-partial descriptor
 * has its omitted fields filled from the defaults; a malformed one throws
 * (a broken target descriptor is a build-time bug, not a silent fallback).
 */
export declare function resolveGameTarget(raw: unknown): GameTarget;
//# sourceMappingURL=gameTarget.d.ts.map