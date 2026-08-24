import { z } from 'zod';
export declare const PackageLayerSchema: z.ZodEnum<["strict-headless", "render-aware", "sibling", "tooling"]>;
export type PackageLayer = z.infer<typeof PackageLayerSchema>;
export declare const PackageTierSchema: z.ZodEnum<["game", "tooling", "shared", "unknown"]>;
export type PackageTier = z.infer<typeof PackageTierSchema>;
export declare const PackageEcosystemSchema: z.ZodEnum<["npm", "cargo", "raw"]>;
export type PackageEcosystem = z.infer<typeof PackageEcosystemSchema>;
export declare const CapabilityEntrySchema: z.ZodObject<{
    /** Stable kebab-case slug derived from the capability name.
     *  Stable across regenerations (same capability text →
     *  same slug). Used by the decomposition schema's
     *  ExistingPackageMatch.subCapability field. */
    id: z.ZodString;
    /** Human-readable name from the root CLAUDE.md row's
     *  "Looking for" column. */
    name: z.ZodString;
    /** First paragraph of the row's "Look at" cell, plain text
     *  (markdown stripped). Plain text because this gets
     *  embedded in LLM prompts where markdown noise tokens
     *  hurt. */
    description: z.ZodString;
    /** Which package owns this capability. References
     *  `PackageEntry.id`. */
    packageId: z.ZodString;
    /** Workspace-relative file paths the LLM should consult for
     *  the canonical example. Typically a validator page +
     *  the implementing package source. From the row's
     *  markdown links. */
    referenceFiles: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Validators that exercise this capability (under
     *  apps/dex/app/validators/). The skill builder reads
     *  these as reference implementations. */
    validators: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    name: string;
    packageId: string;
    referenceFiles: string[];
    validators: string[];
}, {
    description: string;
    id: string;
    name: string;
    packageId: string;
    referenceFiles?: string[] | undefined;
    validators?: string[] | undefined;
}>;
export type CapabilityEntry = z.infer<typeof CapabilityEntrySchema>;
export declare const PackageEntrySchema: z.ZodObject<{
    /** Scoped package id — `@<scope>/<name>`. Stable. `@unsupervised/…` in this
     *  monorepo; the scope is parameterized so an arbitrary workspace
     *  (e.g. `@studio/…`) indexes too. */
    id: z.ZodString;
    /** Workspace-relative directory. */
    path: z.ZodString;
    /** Layer in the engine's contract. The extractor infers this
     *  from the root CLAUDE.md's "Package map" section, falling
     *  back to file-path heuristics for new packages not yet
     *  documented there. */
    layer: z.ZodEnum<["strict-headless", "render-aware", "sibling", "tooling"]>;
    /** game / tooling / shared classification, read from the package's
     *  own `package.json` `atelier.tier` (workspace-portable). `unknown`
     *  when the package carries no tag. */
    tier: z.ZodDefault<z.ZodEnum<["game", "tooling", "shared", "unknown"]>>;
    /** The package's distribution ecosystem — DERIVED by the scanner from
     *  the manifest kind (a `package.json` package is `npm`), overridable
     *  via `atelier.ecosystem`. Flows into the directory record's install
     *  recipe; the projection dispatches on it (npm today, cargo/raw when
     *  a non-node package + adapter exist). Default `npm` — the only kind
     *  the scanner produces so far. */
    ecosystem: z.ZodDefault<z.ZodEnum<["npm", "cargo", "raw"]>>;
    /** First paragraph of the package's own CLAUDE.md — the
     *  "what this package owns" summary. Plain text. Capped at
     *  500 chars for prompt-budget reasons. */
    summary: z.ZodString;
    /** Full path to the package's CLAUDE.md for the skill
     *  builder to fetch when it needs more context than the
     *  summary. */
    claudeMdPath: z.ZodString;
    /** Public exports + their kind (function, class, type,
     *  schema, component). Extracted from the package's
     *  src/index.ts by parsing exported identifiers. The skill
     *  builder uses this to detect "this exists already" without
     *  re-reading every file. */
    publicExports: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        kind: z.ZodEnum<["function", "class", "type", "schema", "component", "const", "enum", "other"]>;
    }, "strip", z.ZodTypeAny, {
        kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
        name: string;
    }, {
        kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
        name: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    path: string;
    id: string;
    layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
    summary: string;
    tier: "unknown" | "tooling" | "game" | "shared";
    ecosystem: "npm" | "cargo" | "raw";
    claudeMdPath: string;
    publicExports: {
        kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
        name: string;
    }[];
}, {
    path: string;
    id: string;
    layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
    summary: string;
    claudeMdPath: string;
    tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
    ecosystem?: "npm" | "cargo" | "raw" | undefined;
    publicExports?: {
        kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
        name: string;
    }[] | undefined;
}>;
export type PackageEntry = z.infer<typeof PackageEntrySchema>;
export declare const PackageRegistrySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    generatedAt: z.ZodString;
    /** Hash of all CLAUDE.md files + package.json files the
     *  extractor read, in path-sorted order. Embedded in
     *  FeatureDecomposition's RegistrySnapshot for drift
     *  detection. */
    contentHash: z.ZodString;
    /** Absolute path to the workspace root at extraction
     *  time. The skill builder validates this matches the
     *  current workspace before consuming. */
    workspaceRoot: z.ZodString;
    /** Every engine package. */
    packages: z.ZodArray<z.ZodObject<{
        /** Scoped package id — `@<scope>/<name>`. Stable. `@unsupervised/…` in this
         *  monorepo; the scope is parameterized so an arbitrary workspace
         *  (e.g. `@studio/…`) indexes too. */
        id: z.ZodString;
        /** Workspace-relative directory. */
        path: z.ZodString;
        /** Layer in the engine's contract. The extractor infers this
         *  from the root CLAUDE.md's "Package map" section, falling
         *  back to file-path heuristics for new packages not yet
         *  documented there. */
        layer: z.ZodEnum<["strict-headless", "render-aware", "sibling", "tooling"]>;
        /** game / tooling / shared classification, read from the package's
         *  own `package.json` `atelier.tier` (workspace-portable). `unknown`
         *  when the package carries no tag. */
        tier: z.ZodDefault<z.ZodEnum<["game", "tooling", "shared", "unknown"]>>;
        /** The package's distribution ecosystem — DERIVED by the scanner from
         *  the manifest kind (a `package.json` package is `npm`), overridable
         *  via `atelier.ecosystem`. Flows into the directory record's install
         *  recipe; the projection dispatches on it (npm today, cargo/raw when
         *  a non-node package + adapter exist). Default `npm` — the only kind
         *  the scanner produces so far. */
        ecosystem: z.ZodDefault<z.ZodEnum<["npm", "cargo", "raw"]>>;
        /** First paragraph of the package's own CLAUDE.md — the
         *  "what this package owns" summary. Plain text. Capped at
         *  500 chars for prompt-budget reasons. */
        summary: z.ZodString;
        /** Full path to the package's CLAUDE.md for the skill
         *  builder to fetch when it needs more context than the
         *  summary. */
        claudeMdPath: z.ZodString;
        /** Public exports + their kind (function, class, type,
         *  schema, component). Extracted from the package's
         *  src/index.ts by parsing exported identifiers. The skill
         *  builder uses this to detect "this exists already" without
         *  re-reading every file. */
        publicExports: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodEnum<["function", "class", "type", "schema", "component", "const", "enum", "other"]>;
        }, "strip", z.ZodTypeAny, {
            kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
            name: string;
        }, {
            kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
            name: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        id: string;
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
        summary: string;
        tier: "unknown" | "tooling" | "game" | "shared";
        ecosystem: "npm" | "cargo" | "raw";
        claudeMdPath: string;
        publicExports: {
            kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
            name: string;
        }[];
    }, {
        path: string;
        id: string;
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
        summary: string;
        claudeMdPath: string;
        tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
        ecosystem?: "npm" | "cargo" | "raw" | undefined;
        publicExports?: {
            kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
            name: string;
        }[] | undefined;
    }>, "many">;
    /** Every capability indexed in the root CLAUDE.md
     *  capability table, augmented with the owning package. */
    capabilities: z.ZodArray<z.ZodObject<{
        /** Stable kebab-case slug derived from the capability name.
         *  Stable across regenerations (same capability text →
         *  same slug). Used by the decomposition schema's
         *  ExistingPackageMatch.subCapability field. */
        id: z.ZodString;
        /** Human-readable name from the root CLAUDE.md row's
         *  "Looking for" column. */
        name: z.ZodString;
        /** First paragraph of the row's "Look at" cell, plain text
         *  (markdown stripped). Plain text because this gets
         *  embedded in LLM prompts where markdown noise tokens
         *  hurt. */
        description: z.ZodString;
        /** Which package owns this capability. References
         *  `PackageEntry.id`. */
        packageId: z.ZodString;
        /** Workspace-relative file paths the LLM should consult for
         *  the canonical example. Typically a validator page +
         *  the implementing package source. From the row's
         *  markdown links. */
        referenceFiles: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Validators that exercise this capability (under
         *  apps/dex/app/validators/). The skill builder reads
         *  these as reference implementations. */
        validators: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        id: string;
        name: string;
        packageId: string;
        referenceFiles: string[];
        validators: string[];
    }, {
        description: string;
        id: string;
        name: string;
        packageId: string;
        referenceFiles?: string[] | undefined;
        validators?: string[] | undefined;
    }>, "many">;
    /** Soft rules + hard rules surfaced from the root
     *  CLAUDE.md. The skill builder embeds these in its
     *  authorship system prompt so generated code respects
     *  layering + naming conventions out of the gate. */
    rules: z.ZodObject<{
        hard: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        soft: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        hard: string[];
        soft: string[];
    }, {
        hard?: string[] | undefined;
        soft?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    generatedAt: string;
    contentHash: string;
    capabilities: {
        description: string;
        id: string;
        name: string;
        packageId: string;
        referenceFiles: string[];
        validators: string[];
    }[];
    workspaceRoot: string;
    packages: {
        path: string;
        id: string;
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
        summary: string;
        tier: "unknown" | "tooling" | "game" | "shared";
        ecosystem: "npm" | "cargo" | "raw";
        claudeMdPath: string;
        publicExports: {
            kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
            name: string;
        }[];
    }[];
    rules: {
        hard: string[];
        soft: string[];
    };
}, {
    schemaVersion: 1;
    generatedAt: string;
    contentHash: string;
    capabilities: {
        description: string;
        id: string;
        name: string;
        packageId: string;
        referenceFiles?: string[] | undefined;
        validators?: string[] | undefined;
    }[];
    workspaceRoot: string;
    packages: {
        path: string;
        id: string;
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
        summary: string;
        claudeMdPath: string;
        tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
        ecosystem?: "npm" | "cargo" | "raw" | undefined;
        publicExports?: {
            kind: "function" | "type" | "enum" | "other" | "class" | "schema" | "component" | "const";
            name: string;
        }[] | undefined;
    }[];
    rules: {
        hard?: string[] | undefined;
        soft?: string[] | undefined;
    };
}>;
export type PackageRegistry = z.infer<typeof PackageRegistrySchema>;
//# sourceMappingURL=registry.d.ts.map