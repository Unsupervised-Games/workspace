// Feature decomposition — the structured artifact a deep-research run
// emits alongside its human-readable report.md. Consumed by the skill
// builder (downstream) to make package-vs-game-code classification
// decisions, build a topologically-ordered DAG of authorship work,
// queue gym tests against the named assertions, and avoid hallucinating
// engine APIs (the package_registry_consulted snapshot tells the
// builder what existed at research time).
//
// Identity rule: one decomposition per research run. If a research run
// surfaces multiple coherent features (e.g., a souls-like combat
// investigation yields stamina + hitstun + parry as distinct features),
// emit them as sibling runs via augment. Keeps the schema flat and the
// downstream DAG legible.
//
// Schema versioning: every consumer must check `schemaVersion` before
// reading. Bumping is a breaking change.
import { z } from 'zod';
// ────────────────────────────────────────────────────────────────
// Capability — one piece of the feature, individually classified.
// ────────────────────────────────────────────────────────────────
/** Where this capability should land in the codebase. */
export const CapabilityClassificationSchema = z.enum([
    /** Reusable infrastructure. Author as a new @unsupervised/<name> package.
     *  The proposed_api_sketches block describes the surface. */
    'package',
    /** The capability is mostly covered by an existing @unsupervised/* package
     *  BUT requires adding new surface (a schema field, an exported
     *  function, an event type) to the package before the feature can
     *  consume it. Set extensionTarget with the package id + sub-
     *  capability + an extensionSketch (TypeScript declaration block
     *  describing the new surface). Use when the extension is small +
     *  naturally belongs in the existing package. Prefer 'existing'
     *  when the current surface already covers the capability; prefer
     *  'package' when authoring a wholly new package makes more sense
     *  than extending. */
    'extend-existing',
    /** One-off, game-specific code. Author inline in the game's app
     *  directory under games/<game>/lib or games/<game>/components. */
    'game-code',
    /** A matching capability already exists in the engine. The
     *  existing_package_match block names it; the skill builder
     *  consumes it directly with no authorship work. */
    'existing',
    /** Research couldn't classify. Surfaces a follow-up question to
     *  the operator; the builder must not proceed without resolution. */
    'uncertain',
]);
/** Names the existing package an extension capability targets +
 *  the TypeScript-shaped surface diff the agent must add. The
 *  extension authoring track modifies the existing package's source
 *  rather than authoring a new package; the assertion harness then
 *  verifies the new surface in the same way it verifies wholly-new
 *  package work items. */
export const ExtensionTargetSchema = z.object({
    /** Workspace package id of the package being extended
     *  (`@unsupervised/features`, `@unsupervised/audio`, etc.). */
    packageId: z.string().regex(/^@unsupervised\/[a-z][a-z0-9-]*$/, {
        message: '@unsupervised/<kebab-case>',
    }),
    /** Sub-capability name within the package the extension lives
     *  inside (e.g., `grid`, `combat`, `turn`). Optional when the
     *  package is single-purpose. */
    subCapability: z.string().optional(),
    /** TypeScript declaration block describing the new surface to
     *  add. Includes function signatures, type declarations, brief
     *  comments. Embedded verbatim in the extension authoring prompt.
     *  Must be substantive — empty stubs reject. */
    extensionSketch: z
        .string()
        .min(50, 'extensionSketch must describe the surface diff (≥ 50 chars)'),
});
/** Records that an operator manually resolved a blocker (typically
 *  an `'uncertain'` capability) into a concrete classification. The
 *  audit trail lives in the decomposition itself so future re-runs
 *  see the decision; the `resolve-blocker` CLI subcommand writes
 *  this field. */
export const OperatorResolutionSchema = z.object({
    /** ISO timestamp of the resolution. */
    resolvedAt: z.string().datetime(),
    /** Classification the operator chose. Mirrors the capability's
     *  current `classification` field — kept on the resolution record
     *  for completeness (the capability could be re-resolved later;
     *  this captures THIS resolution's decision). */
    decision: CapabilityClassificationSchema,
    /** Operator-provided prose explaining WHY this resolution was
     *  chosen. Short reasoning gets rejected at parse time. */
    reasoning: z
        .string()
        .min(30, 'reasoning must explain WHY this resolution (≥ 30 chars)'),
    /** Optional shell-user identity captured at resolution time.
     *  Defaults to `process.env.USER ?? 'unknown'` from the CLI. */
    operatorIdentity: z.string().optional(),
});
export const ExistingPackageMatchSchema = z.object({
    /** Workspace package id (`@unsupervised/audio`, `@unsupervised/features`, etc.). */
    packageId: z.string().min(1),
    /** Optional sub-capability name when the package exposes many
     *  (e.g., `@unsupervised/features` provides 'screenShake', 'triggers',
     *  'blendshape' — name the one that matches). */
    subCapability: z.string().optional(),
    /** Workspace-relative file path the skill builder should read
     *  for the canonical example of using this capability. Mirrors
     *  the root CLAUDE.md "Where to look for canonical examples"
     *  table entries. */
    referenceFile: z.string().optional(),
    /** Confidence the research has that this match is correct.
     *  Below 0.8 the skill builder should re-verify before
     *  committing. */
    confidence: z.number().min(0).max(1).default(1),
});
export const CapabilitySchema = z.object({
    /** Stable kebab-case slug. Referenced by assertions, api
     *  sketches, and dependency edges. Must be unique within the
     *  decomposition. */
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, {
        message: 'kebab-case, alphanumeric + hyphens',
    }),
    /** Human-readable name for UI. */
    name: z.string().min(1),
    /** What this capability does, in one sentence. */
    purpose: z.string().min(1),
    /** Where it should land in the codebase. */
    classification: CapabilityClassificationSchema,
    /** Prose explaining the classification call. The skill builder
     *  surfaces this when an operator reviews the DAG. */
    classificationReasoning: z.string().min(1),
    /** Other use cases that would benefit from the same capability.
     *  >= 2 entries is a strong package signal; <= 1 leans toward
     *  game-code. Concrete: list other genres / features by name. */
    reusabilitySignals: z.array(z.string()).default([]),
    /** When classification is `'existing'`, names the match. */
    existingPackageMatch: ExistingPackageMatchSchema.nullable().default(null),
    /** When classification is `'extend-existing'`, names the package
     *  being extended + the surface diff. Required by a refinement
     *  on the top-level decomposition schema. */
    extensionTarget: ExtensionTargetSchema.optional(),
    /** When an operator manually resolved this capability from a
     *  prior `'uncertain'` classification via the `resolve-blocker`
     *  command, records the decision + reasoning + audit trail. Not
     *  populated by research; written only by the operator path. */
    operatorResolution: OperatorResolutionSchema.optional(),
    /** Other capabilities in this decomposition that must be
     *  satisfied before this one can be authored. DAG edges. */
    dependsOn: z.array(z.string()).default([]),
});
// ────────────────────────────────────────────────────────────────
// Machine-checkable assertion — the gym's invariant input.
// ────────────────────────────────────────────────────────────────
/** Hint for the gym about how to test this assertion. The gym
 *  picks the matching test harness. */
export const AssertionTestShapeSchema = z.enum([
    /** Pure: assert on function return values / data shapes.
     *  Cheap; no engine boot. */
    'structural',
    /** Spin up an ECS world, advance N ticks, assert on
     *  component state. */
    'behavioral',
    /** Run a scripted agent through gameplay, assert on
     *  measurable outcomes (completion rate, time-to-failure,
     *  state coverage). Most expensive; most predictive of
     *  real-world feel. */
    'agent-playthrough',
    /** Visual / audio / haptic — gym renders a frame or a clip
     *  and pipes through an LLM judge or a perceptual diff.
     *  Used sparingly; expensive + noisy. */
    'perceptual',
]);
export const AssertionSchema = z.object({
    /** Stable kebab-case slug. Referenced by api sketches and
     *  source citations. Unique within the decomposition. */
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    /** Which capability this assertion tests. References
     *  `Capability.id`. An assertion may belong to a capability that
     *  doesn't exist yet (one being proposed) — the gym still
     *  consumes it once authorship completes. */
    capabilityId: z.string(),
    /** Plain-language statement of the invariant. Must be
     *  observable from outside the system. "Bullet-time easing
     *  from 1.0 → 0.3 completes in <120ms with no perceptible
     *  per-frame jump." Good assertion. "Time dilation feels
     *  smooth." Bad — unobservable. */
    statement: z.string().min(1),
    /** How the gym should test it. */
    testShape: AssertionTestShapeSchema,
    /** Optional numeric / boolean target the test must hit. The
     *  gym compares against this directly. */
    measurableTarget: z
        .union([z.number(), z.boolean(), z.string()])
        .nullable()
        .default(null),
    /** When this assertion was inspired by a specific game,
     *  reference the source by id (see CitedSource.id). */
    derivedFromSources: z.array(z.string()).default([]),
});
// ────────────────────────────────────────────────────────────────
// Proposed API sketch — surface for a capability classified as
// `package`. The skill builder uses this as the seed for package
// authorship; bytes here are advisory, not binding.
// ────────────────────────────────────────────────────────────────
export const ApiSketchSchema = z.object({
    /** Suggested workspace package id, kebab-case under
     *  `@unsupervised/`. e.g., `@unsupervised/timescale`. The skill builder may
     *  rename. */
    proposedPackageId: z.string().regex(/^@unsupervised\/[a-z][a-z0-9-]*$/, {
        message: '@unsupervised/<kebab-case>',
    }),
    /** One-line purpose. */
    purpose: z.string().min(1),
    /** TypeScript-shaped surface sketch. Function signatures +
     *  inline types + brief comments. Free-form string so it
     *  round-trips through markdown without escape pain. The
     *  skill builder uses it as a starting point for package
     *  authorship, not the final API. */
    surface: z.string().min(1),
    /** Capability ids this package would satisfy. References
     *  `Capability.id`. A package may satisfy multiple
     *  capabilities — that's expected; it's why we package. */
    providesCapabilities: z.array(z.string()).min(1),
    /** Assertion ids this package must pass before the gym
     *  promotes it. References `Assertion.id`. */
    assertionsRequired: z.array(z.string()).default([]),
    /** Layer in the engine's strict-headless / render-aware /
     *  sibling layering contract (see root CLAUDE.md). Lets the
     *  skill builder enforce the lint rules at authorship time. */
    layer: z.enum([
        'strict-headless',
        'render-aware',
        'sibling',
        'tooling',
    ]),
});
// ────────────────────────────────────────────────────────────────
// Cited source — provenance for every claim.
// ────────────────────────────────────────────────────────────────
export const SourceKindSchema = z.enum([
    'gdc-talk',
    'postmortem',
    'patent',
    'designer-interview',
    'book',
    'academic-paper',
    'designer-blog',
    'official-docs',
    'press-coverage',
    'wiki',
    'community-thread',
    'other',
]);
/** Evidence ranking from the research's perspective. Primary
 *  sources are designer-direct (talks, interviews, patents);
 *  secondary are journalists / critics with track records;
 *  tertiary is wiki / fan-curated. The skill builder weights
 *  decisions by evidence strength. */
export const EvidenceStrengthSchema = z.enum([
    'primary',
    'secondary',
    'tertiary',
]);
export const CitedSourceSchema = z.object({
    /** Stable id used by assertions / capabilities to reference
     *  back. Kebab-case. */
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    kind: SourceKindSchema,
    /** Title or descriptive name. e.g., "Mark Brown — Game Maker's
     *  Toolkit: Coyote Time". */
    title: z.string().min(1),
    /** Canonical URL. Prefer the original source over an
     *  aggregator. */
    url: z.string().url(),
    /** Who said it. Designer name, studio, or org. */
    attribution: z.string().min(1),
    /** ISO date when the source was published, if known. */
    publishedDate: z.string().nullable().default(null),
    evidenceStrength: EvidenceStrengthSchema,
    /** Which game(s) this source describes. Optional —
     *  pattern-level sources (e.g., a survey paper on
     *  procedural generation) may have no specific game. */
    games: z.array(z.string()).default([]),
    /** Capability / assertion / api-sketch ids this source
     *  supports. The downstream consumer renders provenance
     *  next to each claim. */
    supports: z.array(z.string()).default([]),
});
// ────────────────────────────────────────────────────────────────
// Package-registry snapshot — what the research stage saw at
// research time. (The `researchRunId` field below keeps its
// legacy name — the standalone research app was retired
// 2026-07-11; renaming the field would break existing artifacts.)
// ────────────────────────────────────────────────────────────────
/** Frozen view of the package registry the research consulted.
 *  Lets the skill builder detect drift: if a package landed
 *  between research and authorship, the builder re-verifies
 *  existing-match decisions. */
export const RegistrySnapshotSchema = z.object({
    /** Path to the live registry file at research time. */
    registryPath: z.string(),
    /** Hash of the registry file's contents. Skill builder
     *  re-reads + re-hashes to detect drift. */
    contentHash: z.string(),
    /** Package ids the research observed. Stored explicitly even
     *  though they're derivable from the registry — so a
     *  drifted registry doesn't silently break the decomposition. */
    packageIds: z.array(z.string()),
    generatedAt: z.string(),
});
// ────────────────────────────────────────────────────────────────
// Top-level — one decomposition per research run.
// ────────────────────────────────────────────────────────────────
export const FeatureDecompositionSchema = z.object({
    /** Schema version. Bump on breaking changes. */
    schemaVersion: z.literal(1),
    /** Stable kebab-case id for the feature. Matches the
     *  research run id's slug component when sensible. */
    featureId: z.string().regex(/^[a-z][a-z0-9-]*$/),
    /** Human-readable feature name. e.g., "Bullet time
     *  character movement". */
    featureName: z.string().min(1),
    /** Pointer back to the originating research run id. */
    researchRunId: z.string(),
    /** The user's research prompt, captured verbatim. */
    originatingPrompt: z.string(),
    /** Relative path to the run's report.md from the
     *  decomposition file's location. The skill builder reads
     *  the report for human context. */
    reportPath: z.string(),
    /** ISO timestamp of decomposition generation. */
    generatedAt: z.string(),
    /** Top-level synopsis the skill builder can show in queue
     *  views without loading every nested array. Capped at
     *  300 chars. */
    summary: z.string().max(300),
    /** Capabilities that constitute the feature. Order is
     *  informational; the dependency graph (via
     *  `Capability.dependsOn`) is authoritative for topological
     *  ordering. */
    capabilities: z.array(CapabilitySchema).min(1),
    /** Testable invariants. Each references a capability via
     *  `Assertion.capabilityId`. */
    assertions: z.array(AssertionSchema).default([]),
    /** Suggested API surfaces for capabilities classified as
     *  `package`. */
    apiSketches: z.array(ApiSketchSchema).default([]),
    /** Provenance — every cited source. */
    citedSources: z.array(CitedSourceSchema).default([]),
    /** Snapshot of the engine's package registry consulted
     *  during research. Detects drift between research time
     *  and authorship time. */
    registrySnapshot: RegistrySnapshotSchema,
    /** Open questions the research couldn't answer. The skill
     *  builder must resolve these — typically by spawning a
     *  follow-up research augment-run — before authoring. */
    openQuestions: z.array(z.string()).default([]),
});
// ────────────────────────────────────────────────────────────────
// Cross-reference invariants. Zod's `.refine` lets us catch
// dangling references at parse time — far cheaper than at
// authorship time.
// ────────────────────────────────────────────────────────────────
/** Stricter parser that validates every internal id reference
 *  resolves. The base schema accepts arbitrary strings; this
 *  variant catches "assertion A references capability X but
 *  capability X doesn't exist." */
export function parseFeatureDecomposition(raw) {
    const parsed = FeatureDecompositionSchema.parse(raw);
    const capabilityIds = new Set(parsed.capabilities.map((c) => c.id));
    const assertionIds = new Set(parsed.assertions.map((a) => a.id));
    const sourceIds = new Set(parsed.citedSources.map((s) => s.id));
    for (const c of parsed.capabilities) {
        for (const dep of c.dependsOn) {
            if (!capabilityIds.has(dep)) {
                throw new Error(`Capability '${c.id}' depends on unknown capability '${dep}'.`);
            }
        }
        if (c.classification === 'extend-existing' &&
            c.extensionTarget === undefined) {
            throw new Error(`Capability '${c.id}' is classified 'extend-existing' but has no extensionTarget. Set extensionTarget with packageId + extensionSketch.`);
        }
    }
    for (const a of parsed.assertions) {
        if (!capabilityIds.has(a.capabilityId)) {
            throw new Error(`Assertion '${a.id}' references unknown capability '${a.capabilityId}'.`);
        }
        for (const sid of a.derivedFromSources) {
            if (!sourceIds.has(sid)) {
                throw new Error(`Assertion '${a.id}' cites unknown source '${sid}'.`);
            }
        }
    }
    for (const sketch of parsed.apiSketches) {
        for (const cid of sketch.providesCapabilities) {
            if (!capabilityIds.has(cid)) {
                throw new Error(`API sketch '${sketch.proposedPackageId}' references unknown capability '${cid}'.`);
            }
        }
        for (const aid of sketch.assertionsRequired) {
            if (!assertionIds.has(aid)) {
                throw new Error(`API sketch '${sketch.proposedPackageId}' references unknown assertion '${aid}'.`);
            }
        }
    }
    for (const s of parsed.citedSources) {
        for (const ref of s.supports) {
            if (!capabilityIds.has(ref) &&
                !assertionIds.has(ref)) {
                throw new Error(`Source '${s.id}' supports unknown target '${ref}'.`);
            }
        }
    }
    return parsed;
}
//# sourceMappingURL=decomposition.js.map