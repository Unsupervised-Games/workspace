// BuildPlan — the artifact emitted by @unsupervised/skill-builder
// when it consumes a FeatureDecomposition. Records:
//
//   1. The topologically-ordered work plan (rounds).
//   2. Drift-detection result (did the registry change
//      between research and build?).
//   3. Per-work-item status — one item per authorship
//      unit (a 'package' work item may COVER multiple
//      capabilities that share the same proposedPackageId).
//   4. Blockers that prevent the plan from being executed
//      end-to-end.
//
// Two verification tracks live on each work item:
//
//   - 'package' items run direct authorship + the
//     assertion harness. Result lands in `packageOutcome`.
//   - 'game-code' items go through the skill-gym A/B
//     pipeline. Result lands in `skillOutcome`.
//
// `existing` items have neither — the registry already
// covers them.
import { z } from 'zod';
import { CapabilityClassificationSchema } from './decomposition.js';
// ────────────────────────────────────────────────────────────────
// Classification routing — same enum as the decomposition
// but `'uncertain'` doesn't appear in work items (uncertain
// rows become blockers, not items).
//
// `'extend-existing'` work items mirror `'package'` work items but
// target an existing package's source tree rather than authoring a
// new package. The verification track is the same — assertion
// harness against the authored impls — but the authoring prompt
// embeds the existing package's CLAUDE.md + index.ts as context.
// ────────────────────────────────────────────────────────────────
export const WorkItemClassificationSchema = z.enum([
    'package',
    'extend-existing',
    'game-code',
    'existing',
]);
// ────────────────────────────────────────────────────────────────
// Status — classification-agnostic. A 'package' work item
// goes through authorship + harness; a 'game-code' work
// item goes through skill-gym A/B. Both share the same
// state machine: pending → in-progress → passed | failed.
// ────────────────────────────────────────────────────────────────
export const WorkItemStatusSchema = z.enum([
    /** Default; nothing has happened yet. */
    'pending',
    /** Verification track currently running for this work
     *  item (authorship for package items, skill-gym for
     *  game-code items). */
    'in-progress',
    /** Verification passed. Artifact is ready. */
    'passed',
    /** Verification failed. Needs re-authoring or operator
     *  intervention. */
    'failed',
    /** Capability is `existing` — no authorship needed,
     *  registry covers it. */
    'skipped-existing',
    /** Blocked because a dependency hasn't passed yet. The
     *  skill builder advances this when deps complete. */
    'blocked-on-deps',
    /** Drift invalidated an `existing` match; needs
     *  re-classification before authorship. */
    'drift-invalidated',
]);
// ────────────────────────────────────────────────────────────────
// PackageOutcome — populated for 'package' work items.
// Surfaces the authoring subprocess result + the assertion
// harness summary. Null while the work item hasn't run.
// ────────────────────────────────────────────────────────────────
export const PackageOutcomeSchema = z.object({
    pass: z.boolean(),
    startedAt: z.string(),
    completedAt: z.string(),
    durationMs: z.number().nonnegative(),
    /** Authorship subprocess exit code. -1 when skipped or
     *  killed; 0 = clean exit; non-zero doesn't necessarily
     *  mean fail — the assertion harness has the final say. */
    authoringExitCode: z.number().int(),
    /** Harness summary counts. Null when the harness didn't
     *  run (authorship failed before harness phase). */
    assertionsPassed: z.number().int().nonnegative().nullable(),
    assertionsFailed: z.number().int().nonnegative().nullable(),
    assertionsErrored: z.number().int().nonnegative().nullable(),
    assertionsNotImplemented: z.number().int().nonnegative().nullable(),
    assertionsLoadError: z.number().int().nonnegative().nullable(),
    assertionsTotal: z.number().int().nonnegative().nullable(),
    /** Workspace-relative path to the harness's written
     *  HarnessRunSummary. Null when the harness didn't
     *  produce one. */
    harnessSummaryPath: z.string().nullable(),
    /** Fingerprint of the package's SOURCE at the moment it verified.
     *
     *  `skill-builder maintain` recomputes it: unchanged ⇒ the recorded pass still
     *  describes what's on disk, and re-verification is skipped (free). Changed ⇒
     *  the source moved on and must be re-verified. Null for artifacts authored
     *  before fingerprinting existed — those are always re-verified. */
    sourceFingerprint: z.string().nullable().default(null),
    /** Operator-facing prose explaining the outcome. */
    note: z.string(),
});
// ────────────────────────────────────────────────────────────────
// SkillOutcome — populated for 'game-code' work items.
// Surfaces the skill-gym A/B deltas + iteration the gym
// picked as best. Null while the work item hasn't run.
// ────────────────────────────────────────────────────────────────
export const SkillOutcomeSchema = z.object({
    pass: z.boolean(),
    startedAt: z.string(),
    completedAt: z.string(),
    durationMs: z.number().nonnegative(),
    /** Subprocess exit code from the final gym script (0 =
     *  clean exit). */
    exitCode: z.number().int(),
    /** skill-gym summary.json fields the skill builder
     *  uses for pass/fail classification. */
    bestIteration: z.number().int().nonnegative().nullable(),
    /** Internal-practice delta (J_I_B - J_I_A) from the
     *  gym's 2x2 matrix. Positive = skill drives
     *  Atelier-internal knowledge. */
    internalDelta: z.number().nullable(),
    /** Generic-practice delta (J_G_B - J_G_A) from the
     *  gym's 2x2 matrix. Should be near zero — a large
     *  positive value indicates eval contamination. */
    genericDelta: z.number().nullable(),
    /** Total cost in USD if the gym recorded one. */
    totalCostUsd: z.number().nonnegative().nullable(),
    /** Operator-facing prose explaining the outcome. */
    note: z.string(),
});
// ────────────────────────────────────────────────────────────────
// DemoOutcome — populated when --with-demo runs the dex
// validator authoring step after a game-code item lands
// passed. Third verification track parallel to the assertion
// harness (packageOutcome) and skill-gym A/B (skillOutcome).
// Independent of skillOutcome — a failed demo does NOT flip
// the work item's status (the skill is independently
// validated); the demo is advisory.
// ────────────────────────────────────────────────────────────────
export const DemoOutcomeSchema = z.object({
    pass: z.boolean(),
    startedAt: z.string(),
    completedAt: z.string(),
    durationMs: z.number().nonnegative(),
    /** Authoring subprocess exit code. -1 when skipped or
     *  killed. 0 = clean exit. */
    authoringExitCode: z.number().int(),
    /** Workspace-relative path to the authored validator
     *  page.tsx. Null when authoring failed before producing
     *  a file. */
    validatorPath: z.string().nullable(),
    /** `pnpm --filter dex check-types` exit code. Null when
     *  the check didn't run (authoring failed before, or
     *  the runner was configured to skip). */
    checkTypesExitCode: z.number().int().nullable(),
    /** `pnpm --filter dex build` exit code. Null when the
     *  build didn't run (typecheck failed, or the runner was
     *  configured to skip). */
    buildExitCode: z.number().int().nullable(),
    /** Total cost in USD if the authoring subprocess
     *  reported one. */
    totalCostUsd: z.number().nonnegative().nullable(),
    /** Operator-facing prose explaining the outcome. */
    note: z.string(),
});
// ────────────────────────────────────────────────────────────────
// Work item — one authorship unit the skill builder is
// tracking. A 'package' work item may cover multiple
// capabilities that share an apiSketch; 'game-code' and
// 'existing' work items cover exactly one capability.
// ────────────────────────────────────────────────────────────────
export const WorkItemSchema = z.object({
    /** Stable unique id for the work item.
     *   - 'package'         → `pkg-<packageId>` (after stripping
     *                         any leading `@unsupervised/` namespace).
     *   - 'extend-existing' → `ext-<packageId>` (after stripping
     *                         any leading `@unsupervised/` namespace).
     *   - 'game-code'       → capability.id (1:1 with a single
     *                         capability).
     *   - 'existing'        → capability.id.
     *  Kebab-case lowercase. */
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    /** Display name. For collapsed package items, derived
     *  from the package name (e.g., "Package @unsupervised/timescale"). */
    capabilityName: z.string().min(1),
    /** Routed classification. Mapped from the decomposition's
     *  classification field; `'uncertain'` rows are NOT
     *  emitted as work items (they go in blockers). */
    classification: WorkItemClassificationSchema,
    /** Capability ids this work item covers. Single element
     *  for game-code / existing; multi-element when multiple
     *  capabilities share an apiSketch (collapsed package
     *  work item). */
    coveredCapabilityIds: z.array(z.string()).min(1),
    /** Topological round, 1-indexed. Round 1 has no deps;
     *  round N depends on rounds < N. */
    round: z.number().int().positive(),
    /** Other WORK ITEM ids this depends on. Translated from
     *  capability ids by the skill builder so the gate logic
     *  in executeBuild operates on a uniform id-space. */
    dependsOn: z.array(z.string()).default([]),
    /** For `package` work, the proposed package id from the
     *  apiSketch that satisfies this capability. Format
     *  matches what apiSketches emit (typically '@unsupervised/<name>'). */
    packageId: z.string().nullable().default(null),
    /** For `existing` work, the matched package id from the
     *  decomposition's existingPackageMatch. */
    existingPackageId: z.string().nullable().default(null),
    /** Workspace-relative path to the authoring config the
     *  skill builder wrote for this work item.
     *   - 'package'   → pkg/<package-name>/authoring-config.json
     *   - 'game-code' → gym/<skill-name>/config.json
     *   - 'existing'  → null
     */
    authoringConfigPath: z.string().nullable().default(null),
    /** Workspace-relative path to where the verification
     *  track writes its output for this work item — the
     *  package source dir, or the skill-gym output dir. Null
     *  until the track populates it. */
    resultDir: z.string().nullable().default(null),
    status: WorkItemStatusSchema.default('pending'),
    /** Free-form notes — failure message, drift detail, etc. */
    note: z.string().nullable().default(null),
    /** Populated by Phase 2 execute step for 'package' work
     *  items. Null for game-code / existing. */
    packageOutcome: PackageOutcomeSchema.nullable().default(null),
    /** Populated by Phase 2 execute step for 'game-code'
     *  work items. Null for package / existing. */
    skillOutcome: SkillOutcomeSchema.nullable().default(null),
    /** Populated by the optional --with-demo execute path
     *  for 'game-code' work items (v1 scope). Null when
     *  --with-demo wasn't set, the item is not game-code,
     *  or the skill hasn't passed yet. Advisory — a failed
     *  demoOutcome does NOT flip the item's status. */
    demoOutcome: DemoOutcomeSchema.nullable().default(null),
});
// ────────────────────────────────────────────────────────────────
// Drift detection result.
// ────────────────────────────────────────────────────────────────
export const DriftCheckSchema = z.object({
    /** Hash recorded in the decomposition's
     *  registrySnapshot at research time. */
    contentHashAtResearch: z.string(),
    /** Hash re-computed at build time. */
    contentHashAtBuild: z.string(),
    /** True when the two hashes differ — every `existing`
     *  classification needs re-verification. */
    drifted: z.boolean(),
    /** Capabilities whose `existing` classification was
     *  invalidated because the matched package /
     *  sub-capability no longer exists in the live registry.
     *  These get `status: 'drift-invalidated'` in the work
     *  items array. */
    invalidatedCapabilities: z.array(z.string()).default([]),
});
// ────────────────────────────────────────────────────────────────
// Blocker — anything that prevents end-to-end execution.
// ────────────────────────────────────────────────────────────────
export const BlockerKindSchema = z.enum([
    /** Capability has `classification: 'uncertain'` in the
     *  decomposition. The skill builder cannot proceed until
     *  it's reclassified — typically via a focused
     *  research augment run OR an operator `resolve-blocker`
     *  invocation. */
    'uncertain-capability',
    /** The capability DAG contains a cycle. Indicates a
     *  malformed decomposition. */
    'dependency-cycle',
    /** Drift invalidated an `existing` match. Needs
     *  re-classification (could be the same package under
     *  a different sub-capability id, or could be that
     *  the capability is now `package`/`game-code`). */
    'drift-invalidated',
    /** Multiple capabilities map to the same apiSketch but
     *  the apiSketch's `providesCapabilities` list is
     *  internally inconsistent (e.g., references unknown
     *  capabilities). */
    'api-sketch-malformed',
]);
export const BlockerSchema = z.object({
    /** Stable deterministic identifier built from the blocker's kind +
     *  capability ids. Format: `${kind}--${sortedCapabilityIds.join('-')}`.
     *  Used by the `resolve-blocker` CLI subcommand to address a
     *  specific blocker; survives re-builds because the input shape
     *  determines the id. Global blockers (no capabilityIds, e.g.
     *  `dependency-cycle`) get `${kind}--global`. */
    id: z.string().min(1),
    kind: BlockerKindSchema,
    /** Capability ids this blocker is about. May be empty for
     *  global blockers like `'dependency-cycle'` (where the
     *  detail message names the cycle members). */
    capabilityIds: z.array(z.string()).default([]),
    /** Operator-facing prose describing what to resolve. */
    detail: z.string().min(1),
    /** Suggested next action (start a research augment
     *  run, edit the decomposition, etc.). */
    suggestedAction: z.string().min(1),
    /** Optional whitelist of classifications the `resolve-blocker`
     *  CLI subcommand will accept as a resolution. Undefined means
     *  "any non-`uncertain` classification is permitted" (no
     *  restriction). The `routeCapabilities` step sets this per
     *  blocker kind: uncertain-capability blockers allow
     *  ['package', 'extend-existing', 'game-code', 'existing'];
     *  drift-invalidated allows the same set; dependency-cycle and
     *  api-sketch-malformed leave it undefined (require manual
     *  decomposition edit, not CLI resolution). */
    allowedResolutions: z.array(CapabilityClassificationSchema).optional(),
});
/** Build a deterministic blocker id from the kind + capability ids.
 *  Used both at routing time (when creating blockers) and at resolve
 *  time (when looking them up via the CLI). */
export function blockerIdFor(kind, capabilityIds) {
    if (capabilityIds.length === 0) {
        return `${kind}--global`;
    }
    const sorted = [...capabilityIds].sort();
    return `${kind}--${sorted.join('-')}`;
}
// ────────────────────────────────────────────────────────────────
// Build plan — the top-level artifact.
// ────────────────────────────────────────────────────────────────
export const BuildPlanSchema = z.object({
    schemaVersion: z.literal(1),
    /** ISO timestamp when the plan was generated. */
    generatedAt: z.string(),
    /** Mirrors decomposition.featureId for cross-reference. */
    featureId: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    /** Path the decomposition was loaded from. */
    decompositionPath: z.string(),
    /** Drift detection result. */
    drift: DriftCheckSchema,
    /** Topologically-ordered work items. Within a round,
     *  order is alphabetic by id for determinism. */
    workItems: z.array(WorkItemSchema),
    /** Total number of rounds the work splits into. */
    roundCount: z.number().int().nonnegative(),
    /** Anything preventing end-to-end execution. Non-empty
     *  blockers ⇒ the plan is informational only; some
     *  intervention is required before progress. */
    blockers: z.array(BlockerSchema).default([]),
});
// ────────────────────────────────────────────────────────────────
// Internal-reference validator — same posture as
// FeatureDecomposition's parseFeatureDecomposition.
// ────────────────────────────────────────────────────────────────
/** Stricter parser that validates every dependency
 *  reference resolves to a known work item AND that each
 *  work item's classification is consistent with its
 *  outcome fields. Catches malformed plans before
 *  downstream consumers see them. */
export function parseBuildPlan(raw) {
    const parsed = BuildPlanSchema.parse(raw);
    const ids = new Set(parsed.workItems.map((w) => w.id));
    for (const item of parsed.workItems) {
        for (const dep of item.dependsOn) {
            if (!ids.has(dep)) {
                throw new Error(`WorkItem '${item.id}' depends on unknown work item '${dep}'.`);
            }
        }
        if (item.round < 1) {
            throw new Error(`WorkItem '${item.id}' has invalid round ${item.round}.`);
        }
        if ((item.classification === 'package' ||
            item.classification === 'extend-existing') &&
            item.skillOutcome !== null) {
            throw new Error(`WorkItem '${item.id}' is classified '${item.classification}' but carries a skillOutcome. Package + extend-existing items use packageOutcome.`);
        }
        if (item.classification === 'game-code' &&
            item.packageOutcome !== null) {
            throw new Error(`WorkItem '${item.id}' is classified 'game-code' but carries a packageOutcome. Game-code items use skillOutcome.`);
        }
        if (item.coveredCapabilityIds.length === 0) {
            throw new Error(`WorkItem '${item.id}' has no coveredCapabilityIds; every work item must cover ≥1 capability.`);
        }
        if (item.classification !== 'package' &&
            item.classification !== 'extend-existing' &&
            item.coveredCapabilityIds.length > 1) {
            throw new Error(`WorkItem '${item.id}' is classified '${item.classification}' but covers ${item.coveredCapabilityIds.length} capabilities. Only 'package' + 'extend-existing' items may collapse multiple capabilities.`);
        }
    }
    return parsed;
}
//# sourceMappingURL=buildPlan.js.map