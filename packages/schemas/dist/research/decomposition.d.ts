import { z } from 'zod';
/** Where this capability should land in the codebase. */
export declare const CapabilityClassificationSchema: z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>;
export type CapabilityClassification = z.infer<typeof CapabilityClassificationSchema>;
/** Names the existing package an extension capability targets +
 *  the TypeScript-shaped surface diff the agent must add. The
 *  extension authoring track modifies the existing package's source
 *  rather than authoring a new package; the assertion harness then
 *  verifies the new surface in the same way it verifies wholly-new
 *  package work items. */
export declare const ExtensionTargetSchema: z.ZodObject<{
    /** Workspace package id of the package being extended
     *  (`@unsupervised/features`, `@unsupervised/audio`, etc.). */
    packageId: z.ZodString;
    /** Sub-capability name within the package the extension lives
     *  inside (e.g., `grid`, `combat`, `turn`). Optional when the
     *  package is single-purpose. */
    subCapability: z.ZodOptional<z.ZodString>;
    /** TypeScript declaration block describing the new surface to
     *  add. Includes function signatures, type declarations, brief
     *  comments. Embedded verbatim in the extension authoring prompt.
     *  Must be substantive — empty stubs reject. */
    extensionSketch: z.ZodString;
}, "strip", z.ZodTypeAny, {
    packageId: string;
    extensionSketch: string;
    subCapability?: string | undefined;
}, {
    packageId: string;
    extensionSketch: string;
    subCapability?: string | undefined;
}>;
export type ExtensionTarget = z.infer<typeof ExtensionTargetSchema>;
/** Records that an operator manually resolved a blocker (typically
 *  an `'uncertain'` capability) into a concrete classification. The
 *  audit trail lives in the decomposition itself so future re-runs
 *  see the decision; the `resolve-blocker` CLI subcommand writes
 *  this field. */
export declare const OperatorResolutionSchema: z.ZodObject<{
    /** ISO timestamp of the resolution. */
    resolvedAt: z.ZodString;
    /** Classification the operator chose. Mirrors the capability's
     *  current `classification` field — kept on the resolution record
     *  for completeness (the capability could be re-resolved later;
     *  this captures THIS resolution's decision). */
    decision: z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>;
    /** Operator-provided prose explaining WHY this resolution was
     *  chosen. Short reasoning gets rejected at parse time. */
    reasoning: z.ZodString;
    /** Optional shell-user identity captured at resolution time.
     *  Defaults to `process.env.USER ?? 'unknown'` from the CLI. */
    operatorIdentity: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    resolvedAt: string;
    decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
    reasoning: string;
    operatorIdentity?: string | undefined;
}, {
    resolvedAt: string;
    decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
    reasoning: string;
    operatorIdentity?: string | undefined;
}>;
export type OperatorResolution = z.infer<typeof OperatorResolutionSchema>;
export declare const ExistingPackageMatchSchema: z.ZodObject<{
    /** Workspace package id (`@unsupervised/audio`, `@unsupervised/features`, etc.). */
    packageId: z.ZodString;
    /** Optional sub-capability name when the package exposes many
     *  (e.g., `@unsupervised/features` provides 'screenShake', 'triggers',
     *  'blendshape' — name the one that matches). */
    subCapability: z.ZodOptional<z.ZodString>;
    /** Workspace-relative file path the skill builder should read
     *  for the canonical example of using this capability. Mirrors
     *  the root CLAUDE.md "Where to look for canonical examples"
     *  table entries. */
    referenceFile: z.ZodOptional<z.ZodString>;
    /** Confidence the research has that this match is correct.
     *  Below 0.8 the skill builder should re-verify before
     *  committing. */
    confidence: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    packageId: string;
    confidence: number;
    subCapability?: string | undefined;
    referenceFile?: string | undefined;
}, {
    packageId: string;
    subCapability?: string | undefined;
    referenceFile?: string | undefined;
    confidence?: number | undefined;
}>;
export type ExistingPackageMatch = z.infer<typeof ExistingPackageMatchSchema>;
export declare const CapabilitySchema: z.ZodObject<{
    /** Stable kebab-case slug. Referenced by assertions, api
     *  sketches, and dependency edges. Must be unique within the
     *  decomposition. */
    id: z.ZodString;
    /** Human-readable name for UI. */
    name: z.ZodString;
    /** What this capability does, in one sentence. */
    purpose: z.ZodString;
    /** Where it should land in the codebase. */
    classification: z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>;
    /** Prose explaining the classification call. The skill builder
     *  surfaces this when an operator reviews the DAG. */
    classificationReasoning: z.ZodString;
    /** Other use cases that would benefit from the same capability.
     *  >= 2 entries is a strong package signal; <= 1 leans toward
     *  game-code. Concrete: list other genres / features by name. */
    reusabilitySignals: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** When classification is `'existing'`, names the match. */
    existingPackageMatch: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        /** Workspace package id (`@unsupervised/audio`, `@unsupervised/features`, etc.). */
        packageId: z.ZodString;
        /** Optional sub-capability name when the package exposes many
         *  (e.g., `@unsupervised/features` provides 'screenShake', 'triggers',
         *  'blendshape' — name the one that matches). */
        subCapability: z.ZodOptional<z.ZodString>;
        /** Workspace-relative file path the skill builder should read
         *  for the canonical example of using this capability. Mirrors
         *  the root CLAUDE.md "Where to look for canonical examples"
         *  table entries. */
        referenceFile: z.ZodOptional<z.ZodString>;
        /** Confidence the research has that this match is correct.
         *  Below 0.8 the skill builder should re-verify before
         *  committing. */
        confidence: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        packageId: string;
        confidence: number;
        subCapability?: string | undefined;
        referenceFile?: string | undefined;
    }, {
        packageId: string;
        subCapability?: string | undefined;
        referenceFile?: string | undefined;
        confidence?: number | undefined;
    }>>>;
    /** When classification is `'extend-existing'`, names the package
     *  being extended + the surface diff. Required by a refinement
     *  on the top-level decomposition schema. */
    extensionTarget: z.ZodOptional<z.ZodObject<{
        /** Workspace package id of the package being extended
         *  (`@unsupervised/features`, `@unsupervised/audio`, etc.). */
        packageId: z.ZodString;
        /** Sub-capability name within the package the extension lives
         *  inside (e.g., `grid`, `combat`, `turn`). Optional when the
         *  package is single-purpose. */
        subCapability: z.ZodOptional<z.ZodString>;
        /** TypeScript declaration block describing the new surface to
         *  add. Includes function signatures, type declarations, brief
         *  comments. Embedded verbatim in the extension authoring prompt.
         *  Must be substantive — empty stubs reject. */
        extensionSketch: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        packageId: string;
        extensionSketch: string;
        subCapability?: string | undefined;
    }, {
        packageId: string;
        extensionSketch: string;
        subCapability?: string | undefined;
    }>>;
    /** When an operator manually resolved this capability from a
     *  prior `'uncertain'` classification via the `resolve-blocker`
     *  command, records the decision + reasoning + audit trail. Not
     *  populated by research; written only by the operator path. */
    operatorResolution: z.ZodOptional<z.ZodObject<{
        /** ISO timestamp of the resolution. */
        resolvedAt: z.ZodString;
        /** Classification the operator chose. Mirrors the capability's
         *  current `classification` field — kept on the resolution record
         *  for completeness (the capability could be re-resolved later;
         *  this captures THIS resolution's decision). */
        decision: z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>;
        /** Operator-provided prose explaining WHY this resolution was
         *  chosen. Short reasoning gets rejected at parse time. */
        reasoning: z.ZodString;
        /** Optional shell-user identity captured at resolution time.
         *  Defaults to `process.env.USER ?? 'unknown'` from the CLI. */
        operatorIdentity: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        resolvedAt: string;
        decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        reasoning: string;
        operatorIdentity?: string | undefined;
    }, {
        resolvedAt: string;
        decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        reasoning: string;
        operatorIdentity?: string | undefined;
    }>>;
    /** Other capabilities in this decomposition that must be
     *  satisfied before this one can be authored. DAG edges. */
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    purpose: string;
    classification: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
    classificationReasoning: string;
    reusabilitySignals: string[];
    existingPackageMatch: {
        packageId: string;
        confidence: number;
        subCapability?: string | undefined;
        referenceFile?: string | undefined;
    } | null;
    dependsOn: string[];
    extensionTarget?: {
        packageId: string;
        extensionSketch: string;
        subCapability?: string | undefined;
    } | undefined;
    operatorResolution?: {
        resolvedAt: string;
        decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        reasoning: string;
        operatorIdentity?: string | undefined;
    } | undefined;
}, {
    id: string;
    name: string;
    purpose: string;
    classification: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
    classificationReasoning: string;
    reusabilitySignals?: string[] | undefined;
    existingPackageMatch?: {
        packageId: string;
        subCapability?: string | undefined;
        referenceFile?: string | undefined;
        confidence?: number | undefined;
    } | null | undefined;
    extensionTarget?: {
        packageId: string;
        extensionSketch: string;
        subCapability?: string | undefined;
    } | undefined;
    operatorResolution?: {
        resolvedAt: string;
        decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        reasoning: string;
        operatorIdentity?: string | undefined;
    } | undefined;
    dependsOn?: string[] | undefined;
}>;
export type Capability = z.infer<typeof CapabilitySchema>;
/** Hint for the gym about how to test this assertion. The gym
 *  picks the matching test harness. */
export declare const AssertionTestShapeSchema: z.ZodEnum<["structural", "behavioral", "agent-playthrough", "perceptual"]>;
export type AssertionTestShape = z.infer<typeof AssertionTestShapeSchema>;
export declare const AssertionSchema: z.ZodObject<{
    /** Stable kebab-case slug. Referenced by api sketches and
     *  source citations. Unique within the decomposition. */
    id: z.ZodString;
    /** Which capability this assertion tests. References
     *  `Capability.id`. An assertion may belong to a capability that
     *  doesn't exist yet (one being proposed) — the gym still
     *  consumes it once authorship completes. */
    capabilityId: z.ZodString;
    /** Plain-language statement of the invariant. Must be
     *  observable from outside the system. "Bullet-time easing
     *  from 1.0 → 0.3 completes in <120ms with no perceptible
     *  per-frame jump." Good assertion. "Time dilation feels
     *  smooth." Bad — unobservable. */
    statement: z.ZodString;
    /** How the gym should test it. */
    testShape: z.ZodEnum<["structural", "behavioral", "agent-playthrough", "perceptual"]>;
    /** Optional numeric / boolean target the test must hit. The
     *  gym compares against this directly. */
    measurableTarget: z.ZodDefault<z.ZodNullable<z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString]>>>;
    /** When this assertion was inspired by a specific game,
     *  reference the source by id (see CitedSource.id). */
    derivedFromSources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    capabilityId: string;
    statement: string;
    testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
    measurableTarget: string | number | boolean | null;
    derivedFromSources: string[];
}, {
    id: string;
    capabilityId: string;
    statement: string;
    testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
    measurableTarget?: string | number | boolean | null | undefined;
    derivedFromSources?: string[] | undefined;
}>;
export type Assertion = z.infer<typeof AssertionSchema>;
export declare const ApiSketchSchema: z.ZodObject<{
    /** Suggested workspace package id, kebab-case under
     *  `@unsupervised/`. e.g., `@unsupervised/timescale`. The skill builder may
     *  rename. */
    proposedPackageId: z.ZodString;
    /** One-line purpose. */
    purpose: z.ZodString;
    /** TypeScript-shaped surface sketch. Function signatures +
     *  inline types + brief comments. Free-form string so it
     *  round-trips through markdown without escape pain. The
     *  skill builder uses it as a starting point for package
     *  authorship, not the final API. */
    surface: z.ZodString;
    /** Capability ids this package would satisfy. References
     *  `Capability.id`. A package may satisfy multiple
     *  capabilities — that's expected; it's why we package. */
    providesCapabilities: z.ZodArray<z.ZodString, "many">;
    /** Assertion ids this package must pass before the gym
     *  promotes it. References `Assertion.id`. */
    assertionsRequired: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Layer in the engine's strict-headless / render-aware /
     *  sibling layering contract (see root CLAUDE.md). Lets the
     *  skill builder enforce the lint rules at authorship time. */
    layer: z.ZodEnum<["strict-headless", "render-aware", "sibling", "tooling"]>;
}, "strip", z.ZodTypeAny, {
    purpose: string;
    proposedPackageId: string;
    surface: string;
    providesCapabilities: string[];
    assertionsRequired: string[];
    layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
}, {
    purpose: string;
    proposedPackageId: string;
    surface: string;
    providesCapabilities: string[];
    layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
    assertionsRequired?: string[] | undefined;
}>;
export type ApiSketch = z.infer<typeof ApiSketchSchema>;
export declare const SourceKindSchema: z.ZodEnum<["gdc-talk", "postmortem", "patent", "designer-interview", "book", "academic-paper", "designer-blog", "official-docs", "press-coverage", "wiki", "community-thread", "other"]>;
export type SourceKind = z.infer<typeof SourceKindSchema>;
/** Evidence ranking from the research's perspective. Primary
 *  sources are designer-direct (talks, interviews, patents);
 *  secondary are journalists / critics with track records;
 *  tertiary is wiki / fan-curated. The skill builder weights
 *  decisions by evidence strength. */
export declare const EvidenceStrengthSchema: z.ZodEnum<["primary", "secondary", "tertiary"]>;
export type EvidenceStrength = z.infer<typeof EvidenceStrengthSchema>;
export declare const CitedSourceSchema: z.ZodObject<{
    /** Stable id used by assertions / capabilities to reference
     *  back. Kebab-case. */
    id: z.ZodString;
    kind: z.ZodEnum<["gdc-talk", "postmortem", "patent", "designer-interview", "book", "academic-paper", "designer-blog", "official-docs", "press-coverage", "wiki", "community-thread", "other"]>;
    /** Title or descriptive name. e.g., "Mark Brown — Game Maker's
     *  Toolkit: Coyote Time". */
    title: z.ZodString;
    /** Canonical URL. Prefer the original source over an
     *  aggregator. */
    url: z.ZodString;
    /** Who said it. Designer name, studio, or org. */
    attribution: z.ZodString;
    /** ISO date when the source was published, if known. */
    publishedDate: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    evidenceStrength: z.ZodEnum<["primary", "secondary", "tertiary"]>;
    /** Which game(s) this source describes. Optional —
     *  pattern-level sources (e.g., a survey paper on
     *  procedural generation) may have no specific game. */
    games: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Capability / assertion / api-sketch ids this source
     *  supports. The downstream consumer renders provenance
     *  next to each claim. */
    supports: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "other" | "gdc-talk" | "postmortem" | "patent" | "designer-interview" | "book" | "academic-paper" | "designer-blog" | "official-docs" | "press-coverage" | "wiki" | "community-thread";
    url: string;
    title: string;
    attribution: string;
    publishedDate: string | null;
    evidenceStrength: "primary" | "secondary" | "tertiary";
    games: string[];
    supports: string[];
}, {
    id: string;
    kind: "other" | "gdc-talk" | "postmortem" | "patent" | "designer-interview" | "book" | "academic-paper" | "designer-blog" | "official-docs" | "press-coverage" | "wiki" | "community-thread";
    url: string;
    title: string;
    attribution: string;
    evidenceStrength: "primary" | "secondary" | "tertiary";
    publishedDate?: string | null | undefined;
    games?: string[] | undefined;
    supports?: string[] | undefined;
}>;
export type CitedSource = z.infer<typeof CitedSourceSchema>;
/** Frozen view of the package registry the research consulted.
 *  Lets the skill builder detect drift: if a package landed
 *  between research and authorship, the builder re-verifies
 *  existing-match decisions. */
export declare const RegistrySnapshotSchema: z.ZodObject<{
    /** Path to the live registry file at research time. */
    registryPath: z.ZodString;
    /** Hash of the registry file's contents. Skill builder
     *  re-reads + re-hashes to detect drift. */
    contentHash: z.ZodString;
    /** Package ids the research observed. Stored explicitly even
     *  though they're derivable from the registry — so a
     *  drifted registry doesn't silently break the decomposition. */
    packageIds: z.ZodArray<z.ZodString, "many">;
    generatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    generatedAt: string;
    registryPath: string;
    contentHash: string;
    packageIds: string[];
}, {
    generatedAt: string;
    registryPath: string;
    contentHash: string;
    packageIds: string[];
}>;
export type RegistrySnapshot = z.infer<typeof RegistrySnapshotSchema>;
export declare const FeatureDecompositionSchema: z.ZodObject<{
    /** Schema version. Bump on breaking changes. */
    schemaVersion: z.ZodLiteral<1>;
    /** Stable kebab-case id for the feature. Matches the
     *  research run id's slug component when sensible. */
    featureId: z.ZodString;
    /** Human-readable feature name. e.g., "Bullet time
     *  character movement". */
    featureName: z.ZodString;
    /** Pointer back to the originating research run id. */
    researchRunId: z.ZodString;
    /** The user's research prompt, captured verbatim. */
    originatingPrompt: z.ZodString;
    /** Relative path to the run's report.md from the
     *  decomposition file's location. The skill builder reads
     *  the report for human context. */
    reportPath: z.ZodString;
    /** ISO timestamp of decomposition generation. */
    generatedAt: z.ZodString;
    /** Top-level synopsis the skill builder can show in queue
     *  views without loading every nested array. Capped at
     *  300 chars. */
    summary: z.ZodString;
    /** Capabilities that constitute the feature. Order is
     *  informational; the dependency graph (via
     *  `Capability.dependsOn`) is authoritative for topological
     *  ordering. */
    capabilities: z.ZodArray<z.ZodObject<{
        /** Stable kebab-case slug. Referenced by assertions, api
         *  sketches, and dependency edges. Must be unique within the
         *  decomposition. */
        id: z.ZodString;
        /** Human-readable name for UI. */
        name: z.ZodString;
        /** What this capability does, in one sentence. */
        purpose: z.ZodString;
        /** Where it should land in the codebase. */
        classification: z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>;
        /** Prose explaining the classification call. The skill builder
         *  surfaces this when an operator reviews the DAG. */
        classificationReasoning: z.ZodString;
        /** Other use cases that would benefit from the same capability.
         *  >= 2 entries is a strong package signal; <= 1 leans toward
         *  game-code. Concrete: list other genres / features by name. */
        reusabilitySignals: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** When classification is `'existing'`, names the match. */
        existingPackageMatch: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            /** Workspace package id (`@unsupervised/audio`, `@unsupervised/features`, etc.). */
            packageId: z.ZodString;
            /** Optional sub-capability name when the package exposes many
             *  (e.g., `@unsupervised/features` provides 'screenShake', 'triggers',
             *  'blendshape' — name the one that matches). */
            subCapability: z.ZodOptional<z.ZodString>;
            /** Workspace-relative file path the skill builder should read
             *  for the canonical example of using this capability. Mirrors
             *  the root CLAUDE.md "Where to look for canonical examples"
             *  table entries. */
            referenceFile: z.ZodOptional<z.ZodString>;
            /** Confidence the research has that this match is correct.
             *  Below 0.8 the skill builder should re-verify before
             *  committing. */
            confidence: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            packageId: string;
            confidence: number;
            subCapability?: string | undefined;
            referenceFile?: string | undefined;
        }, {
            packageId: string;
            subCapability?: string | undefined;
            referenceFile?: string | undefined;
            confidence?: number | undefined;
        }>>>;
        /** When classification is `'extend-existing'`, names the package
         *  being extended + the surface diff. Required by a refinement
         *  on the top-level decomposition schema. */
        extensionTarget: z.ZodOptional<z.ZodObject<{
            /** Workspace package id of the package being extended
             *  (`@unsupervised/features`, `@unsupervised/audio`, etc.). */
            packageId: z.ZodString;
            /** Sub-capability name within the package the extension lives
             *  inside (e.g., `grid`, `combat`, `turn`). Optional when the
             *  package is single-purpose. */
            subCapability: z.ZodOptional<z.ZodString>;
            /** TypeScript declaration block describing the new surface to
             *  add. Includes function signatures, type declarations, brief
             *  comments. Embedded verbatim in the extension authoring prompt.
             *  Must be substantive — empty stubs reject. */
            extensionSketch: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            packageId: string;
            extensionSketch: string;
            subCapability?: string | undefined;
        }, {
            packageId: string;
            extensionSketch: string;
            subCapability?: string | undefined;
        }>>;
        /** When an operator manually resolved this capability from a
         *  prior `'uncertain'` classification via the `resolve-blocker`
         *  command, records the decision + reasoning + audit trail. Not
         *  populated by research; written only by the operator path. */
        operatorResolution: z.ZodOptional<z.ZodObject<{
            /** ISO timestamp of the resolution. */
            resolvedAt: z.ZodString;
            /** Classification the operator chose. Mirrors the capability's
             *  current `classification` field — kept on the resolution record
             *  for completeness (the capability could be re-resolved later;
             *  this captures THIS resolution's decision). */
            decision: z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>;
            /** Operator-provided prose explaining WHY this resolution was
             *  chosen. Short reasoning gets rejected at parse time. */
            reasoning: z.ZodString;
            /** Optional shell-user identity captured at resolution time.
             *  Defaults to `process.env.USER ?? 'unknown'` from the CLI. */
            operatorIdentity: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resolvedAt: string;
            decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
            reasoning: string;
            operatorIdentity?: string | undefined;
        }, {
            resolvedAt: string;
            decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
            reasoning: string;
            operatorIdentity?: string | undefined;
        }>>;
        /** Other capabilities in this decomposition that must be
         *  satisfied before this one can be authored. DAG edges. */
        dependsOn: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        purpose: string;
        classification: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        classificationReasoning: string;
        reusabilitySignals: string[];
        existingPackageMatch: {
            packageId: string;
            confidence: number;
            subCapability?: string | undefined;
            referenceFile?: string | undefined;
        } | null;
        dependsOn: string[];
        extensionTarget?: {
            packageId: string;
            extensionSketch: string;
            subCapability?: string | undefined;
        } | undefined;
        operatorResolution?: {
            resolvedAt: string;
            decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
            reasoning: string;
            operatorIdentity?: string | undefined;
        } | undefined;
    }, {
        id: string;
        name: string;
        purpose: string;
        classification: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        classificationReasoning: string;
        reusabilitySignals?: string[] | undefined;
        existingPackageMatch?: {
            packageId: string;
            subCapability?: string | undefined;
            referenceFile?: string | undefined;
            confidence?: number | undefined;
        } | null | undefined;
        extensionTarget?: {
            packageId: string;
            extensionSketch: string;
            subCapability?: string | undefined;
        } | undefined;
        operatorResolution?: {
            resolvedAt: string;
            decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
            reasoning: string;
            operatorIdentity?: string | undefined;
        } | undefined;
        dependsOn?: string[] | undefined;
    }>, "many">;
    /** Testable invariants. Each references a capability via
     *  `Assertion.capabilityId`. */
    assertions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Stable kebab-case slug. Referenced by api sketches and
         *  source citations. Unique within the decomposition. */
        id: z.ZodString;
        /** Which capability this assertion tests. References
         *  `Capability.id`. An assertion may belong to a capability that
         *  doesn't exist yet (one being proposed) — the gym still
         *  consumes it once authorship completes. */
        capabilityId: z.ZodString;
        /** Plain-language statement of the invariant. Must be
         *  observable from outside the system. "Bullet-time easing
         *  from 1.0 → 0.3 completes in <120ms with no perceptible
         *  per-frame jump." Good assertion. "Time dilation feels
         *  smooth." Bad — unobservable. */
        statement: z.ZodString;
        /** How the gym should test it. */
        testShape: z.ZodEnum<["structural", "behavioral", "agent-playthrough", "perceptual"]>;
        /** Optional numeric / boolean target the test must hit. The
         *  gym compares against this directly. */
        measurableTarget: z.ZodDefault<z.ZodNullable<z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString]>>>;
        /** When this assertion was inspired by a specific game,
         *  reference the source by id (see CitedSource.id). */
        derivedFromSources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        capabilityId: string;
        statement: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        measurableTarget: string | number | boolean | null;
        derivedFromSources: string[];
    }, {
        id: string;
        capabilityId: string;
        statement: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        measurableTarget?: string | number | boolean | null | undefined;
        derivedFromSources?: string[] | undefined;
    }>, "many">>;
    /** Suggested API surfaces for capabilities classified as
     *  `package`. */
    apiSketches: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Suggested workspace package id, kebab-case under
         *  `@unsupervised/`. e.g., `@unsupervised/timescale`. The skill builder may
         *  rename. */
        proposedPackageId: z.ZodString;
        /** One-line purpose. */
        purpose: z.ZodString;
        /** TypeScript-shaped surface sketch. Function signatures +
         *  inline types + brief comments. Free-form string so it
         *  round-trips through markdown without escape pain. The
         *  skill builder uses it as a starting point for package
         *  authorship, not the final API. */
        surface: z.ZodString;
        /** Capability ids this package would satisfy. References
         *  `Capability.id`. A package may satisfy multiple
         *  capabilities — that's expected; it's why we package. */
        providesCapabilities: z.ZodArray<z.ZodString, "many">;
        /** Assertion ids this package must pass before the gym
         *  promotes it. References `Assertion.id`. */
        assertionsRequired: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Layer in the engine's strict-headless / render-aware /
         *  sibling layering contract (see root CLAUDE.md). Lets the
         *  skill builder enforce the lint rules at authorship time. */
        layer: z.ZodEnum<["strict-headless", "render-aware", "sibling", "tooling"]>;
    }, "strip", z.ZodTypeAny, {
        purpose: string;
        proposedPackageId: string;
        surface: string;
        providesCapabilities: string[];
        assertionsRequired: string[];
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
    }, {
        purpose: string;
        proposedPackageId: string;
        surface: string;
        providesCapabilities: string[];
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
        assertionsRequired?: string[] | undefined;
    }>, "many">>;
    /** Provenance — every cited source. */
    citedSources: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Stable id used by assertions / capabilities to reference
         *  back. Kebab-case. */
        id: z.ZodString;
        kind: z.ZodEnum<["gdc-talk", "postmortem", "patent", "designer-interview", "book", "academic-paper", "designer-blog", "official-docs", "press-coverage", "wiki", "community-thread", "other"]>;
        /** Title or descriptive name. e.g., "Mark Brown — Game Maker's
         *  Toolkit: Coyote Time". */
        title: z.ZodString;
        /** Canonical URL. Prefer the original source over an
         *  aggregator. */
        url: z.ZodString;
        /** Who said it. Designer name, studio, or org. */
        attribution: z.ZodString;
        /** ISO date when the source was published, if known. */
        publishedDate: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        evidenceStrength: z.ZodEnum<["primary", "secondary", "tertiary"]>;
        /** Which game(s) this source describes. Optional —
         *  pattern-level sources (e.g., a survey paper on
         *  procedural generation) may have no specific game. */
        games: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Capability / assertion / api-sketch ids this source
         *  supports. The downstream consumer renders provenance
         *  next to each claim. */
        supports: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "other" | "gdc-talk" | "postmortem" | "patent" | "designer-interview" | "book" | "academic-paper" | "designer-blog" | "official-docs" | "press-coverage" | "wiki" | "community-thread";
        url: string;
        title: string;
        attribution: string;
        publishedDate: string | null;
        evidenceStrength: "primary" | "secondary" | "tertiary";
        games: string[];
        supports: string[];
    }, {
        id: string;
        kind: "other" | "gdc-talk" | "postmortem" | "patent" | "designer-interview" | "book" | "academic-paper" | "designer-blog" | "official-docs" | "press-coverage" | "wiki" | "community-thread";
        url: string;
        title: string;
        attribution: string;
        evidenceStrength: "primary" | "secondary" | "tertiary";
        publishedDate?: string | null | undefined;
        games?: string[] | undefined;
        supports?: string[] | undefined;
    }>, "many">>;
    /** Snapshot of the engine's package registry consulted
     *  during research. Detects drift between research time
     *  and authorship time. */
    registrySnapshot: z.ZodObject<{
        /** Path to the live registry file at research time. */
        registryPath: z.ZodString;
        /** Hash of the registry file's contents. Skill builder
         *  re-reads + re-hashes to detect drift. */
        contentHash: z.ZodString;
        /** Package ids the research observed. Stored explicitly even
         *  though they're derivable from the registry — so a
         *  drifted registry doesn't silently break the decomposition. */
        packageIds: z.ZodArray<z.ZodString, "many">;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        registryPath: string;
        contentHash: string;
        packageIds: string[];
    }, {
        generatedAt: string;
        registryPath: string;
        contentHash: string;
        packageIds: string[];
    }>;
    /** Open questions the research couldn't answer. The skill
     *  builder must resolve these — typically by spawning a
     *  follow-up research augment-run — before authoring. */
    openQuestions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    generatedAt: string;
    featureId: string;
    featureName: string;
    researchRunId: string;
    originatingPrompt: string;
    reportPath: string;
    summary: string;
    capabilities: {
        id: string;
        name: string;
        purpose: string;
        classification: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        classificationReasoning: string;
        reusabilitySignals: string[];
        existingPackageMatch: {
            packageId: string;
            confidence: number;
            subCapability?: string | undefined;
            referenceFile?: string | undefined;
        } | null;
        dependsOn: string[];
        extensionTarget?: {
            packageId: string;
            extensionSketch: string;
            subCapability?: string | undefined;
        } | undefined;
        operatorResolution?: {
            resolvedAt: string;
            decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
            reasoning: string;
            operatorIdentity?: string | undefined;
        } | undefined;
    }[];
    assertions: {
        id: string;
        capabilityId: string;
        statement: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        measurableTarget: string | number | boolean | null;
        derivedFromSources: string[];
    }[];
    apiSketches: {
        purpose: string;
        proposedPackageId: string;
        surface: string;
        providesCapabilities: string[];
        assertionsRequired: string[];
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
    }[];
    citedSources: {
        id: string;
        kind: "other" | "gdc-talk" | "postmortem" | "patent" | "designer-interview" | "book" | "academic-paper" | "designer-blog" | "official-docs" | "press-coverage" | "wiki" | "community-thread";
        url: string;
        title: string;
        attribution: string;
        publishedDate: string | null;
        evidenceStrength: "primary" | "secondary" | "tertiary";
        games: string[];
        supports: string[];
    }[];
    registrySnapshot: {
        generatedAt: string;
        registryPath: string;
        contentHash: string;
        packageIds: string[];
    };
    openQuestions: string[];
}, {
    schemaVersion: 1;
    generatedAt: string;
    featureId: string;
    featureName: string;
    researchRunId: string;
    originatingPrompt: string;
    reportPath: string;
    summary: string;
    capabilities: {
        id: string;
        name: string;
        purpose: string;
        classification: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
        classificationReasoning: string;
        reusabilitySignals?: string[] | undefined;
        existingPackageMatch?: {
            packageId: string;
            subCapability?: string | undefined;
            referenceFile?: string | undefined;
            confidence?: number | undefined;
        } | null | undefined;
        extensionTarget?: {
            packageId: string;
            extensionSketch: string;
            subCapability?: string | undefined;
        } | undefined;
        operatorResolution?: {
            resolvedAt: string;
            decision: "package" | "extend-existing" | "game-code" | "existing" | "uncertain";
            reasoning: string;
            operatorIdentity?: string | undefined;
        } | undefined;
        dependsOn?: string[] | undefined;
    }[];
    registrySnapshot: {
        generatedAt: string;
        registryPath: string;
        contentHash: string;
        packageIds: string[];
    };
    assertions?: {
        id: string;
        capabilityId: string;
        statement: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        measurableTarget?: string | number | boolean | null | undefined;
        derivedFromSources?: string[] | undefined;
    }[] | undefined;
    apiSketches?: {
        purpose: string;
        proposedPackageId: string;
        surface: string;
        providesCapabilities: string[];
        layer: "strict-headless" | "render-aware" | "sibling" | "tooling";
        assertionsRequired?: string[] | undefined;
    }[] | undefined;
    citedSources?: {
        id: string;
        kind: "other" | "gdc-talk" | "postmortem" | "patent" | "designer-interview" | "book" | "academic-paper" | "designer-blog" | "official-docs" | "press-coverage" | "wiki" | "community-thread";
        url: string;
        title: string;
        attribution: string;
        evidenceStrength: "primary" | "secondary" | "tertiary";
        publishedDate?: string | null | undefined;
        games?: string[] | undefined;
        supports?: string[] | undefined;
    }[] | undefined;
    openQuestions?: string[] | undefined;
}>;
export type FeatureDecomposition = z.infer<typeof FeatureDecompositionSchema>;
/** Stricter parser that validates every internal id reference
 *  resolves. The base schema accepts arbitrary strings; this
 *  variant catches "assertion A references capability X but
 *  capability X doesn't exist." */
export declare function parseFeatureDecomposition(raw: unknown): FeatureDecomposition;
//# sourceMappingURL=decomposition.d.ts.map