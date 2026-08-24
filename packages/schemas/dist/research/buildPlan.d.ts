import { z } from 'zod';
export declare const WorkItemClassificationSchema: z.ZodEnum<["package", "extend-existing", "game-code", "existing"]>;
export type WorkItemClassification = z.infer<typeof WorkItemClassificationSchema>;
export declare const WorkItemStatusSchema: z.ZodEnum<["pending", "in-progress", "passed", "failed", "skipped-existing", "blocked-on-deps", "drift-invalidated"]>;
export type WorkItemStatus = z.infer<typeof WorkItemStatusSchema>;
export declare const PackageOutcomeSchema: z.ZodObject<{
    pass: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    durationMs: z.ZodNumber;
    /** Authorship subprocess exit code. -1 when skipped or
     *  killed; 0 = clean exit; non-zero doesn't necessarily
     *  mean fail — the assertion harness has the final say. */
    authoringExitCode: z.ZodNumber;
    /** Harness summary counts. Null when the harness didn't
     *  run (authorship failed before harness phase). */
    assertionsPassed: z.ZodNullable<z.ZodNumber>;
    assertionsFailed: z.ZodNullable<z.ZodNumber>;
    assertionsErrored: z.ZodNullable<z.ZodNumber>;
    assertionsNotImplemented: z.ZodNullable<z.ZodNumber>;
    assertionsLoadError: z.ZodNullable<z.ZodNumber>;
    assertionsTotal: z.ZodNullable<z.ZodNumber>;
    /** Workspace-relative path to the harness's written
     *  HarnessRunSummary. Null when the harness didn't
     *  produce one. */
    harnessSummaryPath: z.ZodNullable<z.ZodString>;
    /** Fingerprint of the package's SOURCE at the moment it verified.
     *
     *  `skill-builder maintain` recomputes it: unchanged ⇒ the recorded pass still
     *  describes what's on disk, and re-verification is skipped (free). Changed ⇒
     *  the source moved on and must be re-verified. Null for artifacts authored
     *  before fingerprinting existed — those are always re-verified. */
    sourceFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** Operator-facing prose explaining the outcome. */
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startedAt: string;
    durationMs: number;
    pass: boolean;
    note: string;
    completedAt: string;
    authoringExitCode: number;
    assertionsPassed: number | null;
    assertionsFailed: number | null;
    assertionsErrored: number | null;
    assertionsNotImplemented: number | null;
    assertionsLoadError: number | null;
    assertionsTotal: number | null;
    harnessSummaryPath: string | null;
    sourceFingerprint: string | null;
}, {
    startedAt: string;
    durationMs: number;
    pass: boolean;
    note: string;
    completedAt: string;
    authoringExitCode: number;
    assertionsPassed: number | null;
    assertionsFailed: number | null;
    assertionsErrored: number | null;
    assertionsNotImplemented: number | null;
    assertionsLoadError: number | null;
    assertionsTotal: number | null;
    harnessSummaryPath: string | null;
    sourceFingerprint?: string | null | undefined;
}>;
export type PackageOutcome = z.infer<typeof PackageOutcomeSchema>;
export declare const SkillOutcomeSchema: z.ZodObject<{
    pass: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    durationMs: z.ZodNumber;
    /** Subprocess exit code from the final gym script (0 =
     *  clean exit). */
    exitCode: z.ZodNumber;
    /** skill-gym summary.json fields the skill builder
     *  uses for pass/fail classification. */
    bestIteration: z.ZodNullable<z.ZodNumber>;
    /** Internal-practice delta (J_I_B - J_I_A) from the
     *  gym's 2x2 matrix. Positive = skill drives
     *  Atelier-internal knowledge. */
    internalDelta: z.ZodNullable<z.ZodNumber>;
    /** Generic-practice delta (J_G_B - J_G_A) from the
     *  gym's 2x2 matrix. Should be near zero — a large
     *  positive value indicates eval contamination. */
    genericDelta: z.ZodNullable<z.ZodNumber>;
    /** Total cost in USD if the gym recorded one. */
    totalCostUsd: z.ZodNullable<z.ZodNumber>;
    /** Operator-facing prose explaining the outcome. */
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startedAt: string;
    durationMs: number;
    pass: boolean;
    totalCostUsd: number | null;
    note: string;
    completedAt: string;
    exitCode: number;
    bestIteration: number | null;
    internalDelta: number | null;
    genericDelta: number | null;
}, {
    startedAt: string;
    durationMs: number;
    pass: boolean;
    totalCostUsd: number | null;
    note: string;
    completedAt: string;
    exitCode: number;
    bestIteration: number | null;
    internalDelta: number | null;
    genericDelta: number | null;
}>;
export type SkillOutcome = z.infer<typeof SkillOutcomeSchema>;
export declare const DemoOutcomeSchema: z.ZodObject<{
    pass: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    durationMs: z.ZodNumber;
    /** Authoring subprocess exit code. -1 when skipped or
     *  killed. 0 = clean exit. */
    authoringExitCode: z.ZodNumber;
    /** Workspace-relative path to the authored validator
     *  page.tsx. Null when authoring failed before producing
     *  a file. */
    validatorPath: z.ZodNullable<z.ZodString>;
    /** `pnpm --filter dex check-types` exit code. Null when
     *  the check didn't run (authoring failed before, or
     *  the runner was configured to skip). */
    checkTypesExitCode: z.ZodNullable<z.ZodNumber>;
    /** `pnpm --filter dex build` exit code. Null when the
     *  build didn't run (typecheck failed, or the runner was
     *  configured to skip). */
    buildExitCode: z.ZodNullable<z.ZodNumber>;
    /** Total cost in USD if the authoring subprocess
     *  reported one. */
    totalCostUsd: z.ZodNullable<z.ZodNumber>;
    /** Operator-facing prose explaining the outcome. */
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startedAt: string;
    durationMs: number;
    pass: boolean;
    totalCostUsd: number | null;
    note: string;
    completedAt: string;
    authoringExitCode: number;
    validatorPath: string | null;
    checkTypesExitCode: number | null;
    buildExitCode: number | null;
}, {
    startedAt: string;
    durationMs: number;
    pass: boolean;
    totalCostUsd: number | null;
    note: string;
    completedAt: string;
    authoringExitCode: number;
    validatorPath: string | null;
    checkTypesExitCode: number | null;
    buildExitCode: number | null;
}>;
export type DemoOutcome = z.infer<typeof DemoOutcomeSchema>;
export declare const WorkItemSchema: z.ZodObject<{
    /** Stable unique id for the work item.
     *   - 'package'         → `pkg-<packageId>` (after stripping
     *                         any leading `@unsupervised/` namespace).
     *   - 'extend-existing' → `ext-<packageId>` (after stripping
     *                         any leading `@unsupervised/` namespace).
     *   - 'game-code'       → capability.id (1:1 with a single
     *                         capability).
     *   - 'existing'        → capability.id.
     *  Kebab-case lowercase. */
    id: z.ZodString;
    /** Display name. For collapsed package items, derived
     *  from the package name (e.g., "Package @unsupervised/timescale"). */
    capabilityName: z.ZodString;
    /** Routed classification. Mapped from the decomposition's
     *  classification field; `'uncertain'` rows are NOT
     *  emitted as work items (they go in blockers). */
    classification: z.ZodEnum<["package", "extend-existing", "game-code", "existing"]>;
    /** Capability ids this work item covers. Single element
     *  for game-code / existing; multi-element when multiple
     *  capabilities share an apiSketch (collapsed package
     *  work item). */
    coveredCapabilityIds: z.ZodArray<z.ZodString, "many">;
    /** Topological round, 1-indexed. Round 1 has no deps;
     *  round N depends on rounds < N. */
    round: z.ZodNumber;
    /** Other WORK ITEM ids this depends on. Translated from
     *  capability ids by the skill builder so the gate logic
     *  in executeBuild operates on a uniform id-space. */
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** For `package` work, the proposed package id from the
     *  apiSketch that satisfies this capability. Format
     *  matches what apiSketches emit (typically '@unsupervised/<name>'). */
    packageId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** For `existing` work, the matched package id from the
     *  decomposition's existingPackageMatch. */
    existingPackageId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** Workspace-relative path to the authoring config the
     *  skill builder wrote for this work item.
     *   - 'package'   → pkg/<package-name>/authoring-config.json
     *   - 'game-code' → gym/<skill-name>/config.json
     *   - 'existing'  → null
     */
    authoringConfigPath: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** Workspace-relative path to where the verification
     *  track writes its output for this work item — the
     *  package source dir, or the skill-gym output dir. Null
     *  until the track populates it. */
    resultDir: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<["pending", "in-progress", "passed", "failed", "skipped-existing", "blocked-on-deps", "drift-invalidated"]>>;
    /** Free-form notes — failure message, drift detail, etc. */
    note: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** Populated by Phase 2 execute step for 'package' work
     *  items. Null for game-code / existing. */
    packageOutcome: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        pass: z.ZodBoolean;
        startedAt: z.ZodString;
        completedAt: z.ZodString;
        durationMs: z.ZodNumber;
        /** Authorship subprocess exit code. -1 when skipped or
         *  killed; 0 = clean exit; non-zero doesn't necessarily
         *  mean fail — the assertion harness has the final say. */
        authoringExitCode: z.ZodNumber;
        /** Harness summary counts. Null when the harness didn't
         *  run (authorship failed before harness phase). */
        assertionsPassed: z.ZodNullable<z.ZodNumber>;
        assertionsFailed: z.ZodNullable<z.ZodNumber>;
        assertionsErrored: z.ZodNullable<z.ZodNumber>;
        assertionsNotImplemented: z.ZodNullable<z.ZodNumber>;
        assertionsLoadError: z.ZodNullable<z.ZodNumber>;
        assertionsTotal: z.ZodNullable<z.ZodNumber>;
        /** Workspace-relative path to the harness's written
         *  HarnessRunSummary. Null when the harness didn't
         *  produce one. */
        harnessSummaryPath: z.ZodNullable<z.ZodString>;
        /** Fingerprint of the package's SOURCE at the moment it verified.
         *
         *  `skill-builder maintain` recomputes it: unchanged ⇒ the recorded pass still
         *  describes what's on disk, and re-verification is skipped (free). Changed ⇒
         *  the source moved on and must be re-verified. Null for artifacts authored
         *  before fingerprinting existed — those are always re-verified. */
        sourceFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        /** Operator-facing prose explaining the outcome. */
        note: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        assertionsPassed: number | null;
        assertionsFailed: number | null;
        assertionsErrored: number | null;
        assertionsNotImplemented: number | null;
        assertionsLoadError: number | null;
        assertionsTotal: number | null;
        harnessSummaryPath: string | null;
        sourceFingerprint: string | null;
    }, {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        assertionsPassed: number | null;
        assertionsFailed: number | null;
        assertionsErrored: number | null;
        assertionsNotImplemented: number | null;
        assertionsLoadError: number | null;
        assertionsTotal: number | null;
        harnessSummaryPath: string | null;
        sourceFingerprint?: string | null | undefined;
    }>>>;
    /** Populated by Phase 2 execute step for 'game-code'
     *  work items. Null for package / existing. */
    skillOutcome: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        pass: z.ZodBoolean;
        startedAt: z.ZodString;
        completedAt: z.ZodString;
        durationMs: z.ZodNumber;
        /** Subprocess exit code from the final gym script (0 =
         *  clean exit). */
        exitCode: z.ZodNumber;
        /** skill-gym summary.json fields the skill builder
         *  uses for pass/fail classification. */
        bestIteration: z.ZodNullable<z.ZodNumber>;
        /** Internal-practice delta (J_I_B - J_I_A) from the
         *  gym's 2x2 matrix. Positive = skill drives
         *  Atelier-internal knowledge. */
        internalDelta: z.ZodNullable<z.ZodNumber>;
        /** Generic-practice delta (J_G_B - J_G_A) from the
         *  gym's 2x2 matrix. Should be near zero — a large
         *  positive value indicates eval contamination. */
        genericDelta: z.ZodNullable<z.ZodNumber>;
        /** Total cost in USD if the gym recorded one. */
        totalCostUsd: z.ZodNullable<z.ZodNumber>;
        /** Operator-facing prose explaining the outcome. */
        note: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        exitCode: number;
        bestIteration: number | null;
        internalDelta: number | null;
        genericDelta: number | null;
    }, {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        exitCode: number;
        bestIteration: number | null;
        internalDelta: number | null;
        genericDelta: number | null;
    }>>>;
    /** Populated by the optional --with-demo execute path
     *  for 'game-code' work items (v1 scope). Null when
     *  --with-demo wasn't set, the item is not game-code,
     *  or the skill hasn't passed yet. Advisory — a failed
     *  demoOutcome does NOT flip the item's status. */
    demoOutcome: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        pass: z.ZodBoolean;
        startedAt: z.ZodString;
        completedAt: z.ZodString;
        durationMs: z.ZodNumber;
        /** Authoring subprocess exit code. -1 when skipped or
         *  killed. 0 = clean exit. */
        authoringExitCode: z.ZodNumber;
        /** Workspace-relative path to the authored validator
         *  page.tsx. Null when authoring failed before producing
         *  a file. */
        validatorPath: z.ZodNullable<z.ZodString>;
        /** `pnpm --filter dex check-types` exit code. Null when
         *  the check didn't run (authoring failed before, or
         *  the runner was configured to skip). */
        checkTypesExitCode: z.ZodNullable<z.ZodNumber>;
        /** `pnpm --filter dex build` exit code. Null when the
         *  build didn't run (typecheck failed, or the runner was
         *  configured to skip). */
        buildExitCode: z.ZodNullable<z.ZodNumber>;
        /** Total cost in USD if the authoring subprocess
         *  reported one. */
        totalCostUsd: z.ZodNullable<z.ZodNumber>;
        /** Operator-facing prose explaining the outcome. */
        note: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        validatorPath: string | null;
        checkTypesExitCode: number | null;
        buildExitCode: number | null;
    }, {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        validatorPath: string | null;
        checkTypesExitCode: number | null;
        buildExitCode: number | null;
    }>>>;
}, "strip", z.ZodTypeAny, {
    status: "failed" | "pending" | "in-progress" | "passed" | "skipped-existing" | "blocked-on-deps" | "drift-invalidated";
    id: string;
    packageId: string | null;
    classification: "package" | "extend-existing" | "game-code" | "existing";
    dependsOn: string[];
    note: string | null;
    capabilityName: string;
    coveredCapabilityIds: string[];
    round: number;
    existingPackageId: string | null;
    authoringConfigPath: string | null;
    resultDir: string | null;
    packageOutcome: {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        assertionsPassed: number | null;
        assertionsFailed: number | null;
        assertionsErrored: number | null;
        assertionsNotImplemented: number | null;
        assertionsLoadError: number | null;
        assertionsTotal: number | null;
        harnessSummaryPath: string | null;
        sourceFingerprint: string | null;
    } | null;
    skillOutcome: {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        exitCode: number;
        bestIteration: number | null;
        internalDelta: number | null;
        genericDelta: number | null;
    } | null;
    demoOutcome: {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        validatorPath: string | null;
        checkTypesExitCode: number | null;
        buildExitCode: number | null;
    } | null;
}, {
    id: string;
    classification: "package" | "extend-existing" | "game-code" | "existing";
    capabilityName: string;
    coveredCapabilityIds: string[];
    round: number;
    status?: "failed" | "pending" | "in-progress" | "passed" | "skipped-existing" | "blocked-on-deps" | "drift-invalidated" | undefined;
    packageId?: string | null | undefined;
    dependsOn?: string[] | undefined;
    note?: string | null | undefined;
    existingPackageId?: string | null | undefined;
    authoringConfigPath?: string | null | undefined;
    resultDir?: string | null | undefined;
    packageOutcome?: {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        assertionsPassed: number | null;
        assertionsFailed: number | null;
        assertionsErrored: number | null;
        assertionsNotImplemented: number | null;
        assertionsLoadError: number | null;
        assertionsTotal: number | null;
        harnessSummaryPath: string | null;
        sourceFingerprint?: string | null | undefined;
    } | null | undefined;
    skillOutcome?: {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        exitCode: number;
        bestIteration: number | null;
        internalDelta: number | null;
        genericDelta: number | null;
    } | null | undefined;
    demoOutcome?: {
        startedAt: string;
        durationMs: number;
        pass: boolean;
        totalCostUsd: number | null;
        note: string;
        completedAt: string;
        authoringExitCode: number;
        validatorPath: string | null;
        checkTypesExitCode: number | null;
        buildExitCode: number | null;
    } | null | undefined;
}>;
export type WorkItem = z.infer<typeof WorkItemSchema>;
export declare const DriftCheckSchema: z.ZodObject<{
    /** Hash recorded in the decomposition's
     *  registrySnapshot at research time. */
    contentHashAtResearch: z.ZodString;
    /** Hash re-computed at build time. */
    contentHashAtBuild: z.ZodString;
    /** True when the two hashes differ — every `existing`
     *  classification needs re-verification. */
    drifted: z.ZodBoolean;
    /** Capabilities whose `existing` classification was
     *  invalidated because the matched package /
     *  sub-capability no longer exists in the live registry.
     *  These get `status: 'drift-invalidated'` in the work
     *  items array. */
    invalidatedCapabilities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    drifted: boolean;
    contentHashAtResearch: string;
    contentHashAtBuild: string;
    invalidatedCapabilities: string[];
}, {
    drifted: boolean;
    contentHashAtResearch: string;
    contentHashAtBuild: string;
    invalidatedCapabilities?: string[] | undefined;
}>;
export type DriftCheck = z.infer<typeof DriftCheckSchema>;
export declare const BlockerKindSchema: z.ZodEnum<["uncertain-capability", "dependency-cycle", "drift-invalidated", "api-sketch-malformed"]>;
export type BlockerKind = z.infer<typeof BlockerKindSchema>;
export declare const BlockerSchema: z.ZodObject<{
    /** Stable deterministic identifier built from the blocker's kind +
     *  capability ids. Format: `${kind}--${sortedCapabilityIds.join('-')}`.
     *  Used by the `resolve-blocker` CLI subcommand to address a
     *  specific blocker; survives re-builds because the input shape
     *  determines the id. Global blockers (no capabilityIds, e.g.
     *  `dependency-cycle`) get `${kind}--global`. */
    id: z.ZodString;
    kind: z.ZodEnum<["uncertain-capability", "dependency-cycle", "drift-invalidated", "api-sketch-malformed"]>;
    /** Capability ids this blocker is about. May be empty for
     *  global blockers like `'dependency-cycle'` (where the
     *  detail message names the cycle members). */
    capabilityIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Operator-facing prose describing what to resolve. */
    detail: z.ZodString;
    /** Suggested next action (start a research augment
     *  run, edit the decomposition, etc.). */
    suggestedAction: z.ZodString;
    /** Optional whitelist of classifications the `resolve-blocker`
     *  CLI subcommand will accept as a resolution. Undefined means
     *  "any non-`uncertain` classification is permitted" (no
     *  restriction). The `routeCapabilities` step sets this per
     *  blocker kind: uncertain-capability blockers allow
     *  ['package', 'extend-existing', 'game-code', 'existing'];
     *  drift-invalidated allows the same set; dependency-cycle and
     *  api-sketch-malformed leave it undefined (require manual
     *  decomposition edit, not CLI resolution). */
    allowedResolutions: z.ZodOptional<z.ZodArray<z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "drift-invalidated" | "uncertain-capability" | "dependency-cycle" | "api-sketch-malformed";
    detail: string;
    capabilityIds: string[];
    suggestedAction: string;
    allowedResolutions?: ("package" | "extend-existing" | "game-code" | "existing" | "uncertain")[] | undefined;
}, {
    id: string;
    kind: "drift-invalidated" | "uncertain-capability" | "dependency-cycle" | "api-sketch-malformed";
    detail: string;
    suggestedAction: string;
    capabilityIds?: string[] | undefined;
    allowedResolutions?: ("package" | "extend-existing" | "game-code" | "existing" | "uncertain")[] | undefined;
}>;
export type Blocker = z.infer<typeof BlockerSchema>;
/** Build a deterministic blocker id from the kind + capability ids.
 *  Used both at routing time (when creating blockers) and at resolve
 *  time (when looking them up via the CLI). */
export declare function blockerIdFor(kind: BlockerKind, capabilityIds: ReadonlyArray<string>): string;
export declare const BuildPlanSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    /** ISO timestamp when the plan was generated. */
    generatedAt: z.ZodString;
    /** Mirrors decomposition.featureId for cross-reference. */
    featureId: z.ZodString;
    /** Path the decomposition was loaded from. */
    decompositionPath: z.ZodString;
    /** Drift detection result. */
    drift: z.ZodObject<{
        /** Hash recorded in the decomposition's
         *  registrySnapshot at research time. */
        contentHashAtResearch: z.ZodString;
        /** Hash re-computed at build time. */
        contentHashAtBuild: z.ZodString;
        /** True when the two hashes differ — every `existing`
         *  classification needs re-verification. */
        drifted: z.ZodBoolean;
        /** Capabilities whose `existing` classification was
         *  invalidated because the matched package /
         *  sub-capability no longer exists in the live registry.
         *  These get `status: 'drift-invalidated'` in the work
         *  items array. */
        invalidatedCapabilities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        drifted: boolean;
        contentHashAtResearch: string;
        contentHashAtBuild: string;
        invalidatedCapabilities: string[];
    }, {
        drifted: boolean;
        contentHashAtResearch: string;
        contentHashAtBuild: string;
        invalidatedCapabilities?: string[] | undefined;
    }>;
    /** Topologically-ordered work items. Within a round,
     *  order is alphabetic by id for determinism. */
    workItems: z.ZodArray<z.ZodObject<{
        /** Stable unique id for the work item.
         *   - 'package'         → `pkg-<packageId>` (after stripping
         *                         any leading `@unsupervised/` namespace).
         *   - 'extend-existing' → `ext-<packageId>` (after stripping
         *                         any leading `@unsupervised/` namespace).
         *   - 'game-code'       → capability.id (1:1 with a single
         *                         capability).
         *   - 'existing'        → capability.id.
         *  Kebab-case lowercase. */
        id: z.ZodString;
        /** Display name. For collapsed package items, derived
         *  from the package name (e.g., "Package @unsupervised/timescale"). */
        capabilityName: z.ZodString;
        /** Routed classification. Mapped from the decomposition's
         *  classification field; `'uncertain'` rows are NOT
         *  emitted as work items (they go in blockers). */
        classification: z.ZodEnum<["package", "extend-existing", "game-code", "existing"]>;
        /** Capability ids this work item covers. Single element
         *  for game-code / existing; multi-element when multiple
         *  capabilities share an apiSketch (collapsed package
         *  work item). */
        coveredCapabilityIds: z.ZodArray<z.ZodString, "many">;
        /** Topological round, 1-indexed. Round 1 has no deps;
         *  round N depends on rounds < N. */
        round: z.ZodNumber;
        /** Other WORK ITEM ids this depends on. Translated from
         *  capability ids by the skill builder so the gate logic
         *  in executeBuild operates on a uniform id-space. */
        dependsOn: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** For `package` work, the proposed package id from the
         *  apiSketch that satisfies this capability. Format
         *  matches what apiSketches emit (typically '@unsupervised/<name>'). */
        packageId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        /** For `existing` work, the matched package id from the
         *  decomposition's existingPackageMatch. */
        existingPackageId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        /** Workspace-relative path to the authoring config the
         *  skill builder wrote for this work item.
         *   - 'package'   → pkg/<package-name>/authoring-config.json
         *   - 'game-code' → gym/<skill-name>/config.json
         *   - 'existing'  → null
         */
        authoringConfigPath: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        /** Workspace-relative path to where the verification
         *  track writes its output for this work item — the
         *  package source dir, or the skill-gym output dir. Null
         *  until the track populates it. */
        resultDir: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<["pending", "in-progress", "passed", "failed", "skipped-existing", "blocked-on-deps", "drift-invalidated"]>>;
        /** Free-form notes — failure message, drift detail, etc. */
        note: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        /** Populated by Phase 2 execute step for 'package' work
         *  items. Null for game-code / existing. */
        packageOutcome: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            pass: z.ZodBoolean;
            startedAt: z.ZodString;
            completedAt: z.ZodString;
            durationMs: z.ZodNumber;
            /** Authorship subprocess exit code. -1 when skipped or
             *  killed; 0 = clean exit; non-zero doesn't necessarily
             *  mean fail — the assertion harness has the final say. */
            authoringExitCode: z.ZodNumber;
            /** Harness summary counts. Null when the harness didn't
             *  run (authorship failed before harness phase). */
            assertionsPassed: z.ZodNullable<z.ZodNumber>;
            assertionsFailed: z.ZodNullable<z.ZodNumber>;
            assertionsErrored: z.ZodNullable<z.ZodNumber>;
            assertionsNotImplemented: z.ZodNullable<z.ZodNumber>;
            assertionsLoadError: z.ZodNullable<z.ZodNumber>;
            assertionsTotal: z.ZodNullable<z.ZodNumber>;
            /** Workspace-relative path to the harness's written
             *  HarnessRunSummary. Null when the harness didn't
             *  produce one. */
            harnessSummaryPath: z.ZodNullable<z.ZodString>;
            /** Fingerprint of the package's SOURCE at the moment it verified.
             *
             *  `skill-builder maintain` recomputes it: unchanged ⇒ the recorded pass still
             *  describes what's on disk, and re-verification is skipped (free). Changed ⇒
             *  the source moved on and must be re-verified. Null for artifacts authored
             *  before fingerprinting existed — those are always re-verified. */
            sourceFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            /** Operator-facing prose explaining the outcome. */
            note: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            assertionsPassed: number | null;
            assertionsFailed: number | null;
            assertionsErrored: number | null;
            assertionsNotImplemented: number | null;
            assertionsLoadError: number | null;
            assertionsTotal: number | null;
            harnessSummaryPath: string | null;
            sourceFingerprint: string | null;
        }, {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            assertionsPassed: number | null;
            assertionsFailed: number | null;
            assertionsErrored: number | null;
            assertionsNotImplemented: number | null;
            assertionsLoadError: number | null;
            assertionsTotal: number | null;
            harnessSummaryPath: string | null;
            sourceFingerprint?: string | null | undefined;
        }>>>;
        /** Populated by Phase 2 execute step for 'game-code'
         *  work items. Null for package / existing. */
        skillOutcome: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            pass: z.ZodBoolean;
            startedAt: z.ZodString;
            completedAt: z.ZodString;
            durationMs: z.ZodNumber;
            /** Subprocess exit code from the final gym script (0 =
             *  clean exit). */
            exitCode: z.ZodNumber;
            /** skill-gym summary.json fields the skill builder
             *  uses for pass/fail classification. */
            bestIteration: z.ZodNullable<z.ZodNumber>;
            /** Internal-practice delta (J_I_B - J_I_A) from the
             *  gym's 2x2 matrix. Positive = skill drives
             *  Atelier-internal knowledge. */
            internalDelta: z.ZodNullable<z.ZodNumber>;
            /** Generic-practice delta (J_G_B - J_G_A) from the
             *  gym's 2x2 matrix. Should be near zero — a large
             *  positive value indicates eval contamination. */
            genericDelta: z.ZodNullable<z.ZodNumber>;
            /** Total cost in USD if the gym recorded one. */
            totalCostUsd: z.ZodNullable<z.ZodNumber>;
            /** Operator-facing prose explaining the outcome. */
            note: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            exitCode: number;
            bestIteration: number | null;
            internalDelta: number | null;
            genericDelta: number | null;
        }, {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            exitCode: number;
            bestIteration: number | null;
            internalDelta: number | null;
            genericDelta: number | null;
        }>>>;
        /** Populated by the optional --with-demo execute path
         *  for 'game-code' work items (v1 scope). Null when
         *  --with-demo wasn't set, the item is not game-code,
         *  or the skill hasn't passed yet. Advisory — a failed
         *  demoOutcome does NOT flip the item's status. */
        demoOutcome: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            pass: z.ZodBoolean;
            startedAt: z.ZodString;
            completedAt: z.ZodString;
            durationMs: z.ZodNumber;
            /** Authoring subprocess exit code. -1 when skipped or
             *  killed. 0 = clean exit. */
            authoringExitCode: z.ZodNumber;
            /** Workspace-relative path to the authored validator
             *  page.tsx. Null when authoring failed before producing
             *  a file. */
            validatorPath: z.ZodNullable<z.ZodString>;
            /** `pnpm --filter dex check-types` exit code. Null when
             *  the check didn't run (authoring failed before, or
             *  the runner was configured to skip). */
            checkTypesExitCode: z.ZodNullable<z.ZodNumber>;
            /** `pnpm --filter dex build` exit code. Null when the
             *  build didn't run (typecheck failed, or the runner was
             *  configured to skip). */
            buildExitCode: z.ZodNullable<z.ZodNumber>;
            /** Total cost in USD if the authoring subprocess
             *  reported one. */
            totalCostUsd: z.ZodNullable<z.ZodNumber>;
            /** Operator-facing prose explaining the outcome. */
            note: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            validatorPath: string | null;
            checkTypesExitCode: number | null;
            buildExitCode: number | null;
        }, {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            validatorPath: string | null;
            checkTypesExitCode: number | null;
            buildExitCode: number | null;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        status: "failed" | "pending" | "in-progress" | "passed" | "skipped-existing" | "blocked-on-deps" | "drift-invalidated";
        id: string;
        packageId: string | null;
        classification: "package" | "extend-existing" | "game-code" | "existing";
        dependsOn: string[];
        note: string | null;
        capabilityName: string;
        coveredCapabilityIds: string[];
        round: number;
        existingPackageId: string | null;
        authoringConfigPath: string | null;
        resultDir: string | null;
        packageOutcome: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            assertionsPassed: number | null;
            assertionsFailed: number | null;
            assertionsErrored: number | null;
            assertionsNotImplemented: number | null;
            assertionsLoadError: number | null;
            assertionsTotal: number | null;
            harnessSummaryPath: string | null;
            sourceFingerprint: string | null;
        } | null;
        skillOutcome: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            exitCode: number;
            bestIteration: number | null;
            internalDelta: number | null;
            genericDelta: number | null;
        } | null;
        demoOutcome: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            validatorPath: string | null;
            checkTypesExitCode: number | null;
            buildExitCode: number | null;
        } | null;
    }, {
        id: string;
        classification: "package" | "extend-existing" | "game-code" | "existing";
        capabilityName: string;
        coveredCapabilityIds: string[];
        round: number;
        status?: "failed" | "pending" | "in-progress" | "passed" | "skipped-existing" | "blocked-on-deps" | "drift-invalidated" | undefined;
        packageId?: string | null | undefined;
        dependsOn?: string[] | undefined;
        note?: string | null | undefined;
        existingPackageId?: string | null | undefined;
        authoringConfigPath?: string | null | undefined;
        resultDir?: string | null | undefined;
        packageOutcome?: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            assertionsPassed: number | null;
            assertionsFailed: number | null;
            assertionsErrored: number | null;
            assertionsNotImplemented: number | null;
            assertionsLoadError: number | null;
            assertionsTotal: number | null;
            harnessSummaryPath: string | null;
            sourceFingerprint?: string | null | undefined;
        } | null | undefined;
        skillOutcome?: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            exitCode: number;
            bestIteration: number | null;
            internalDelta: number | null;
            genericDelta: number | null;
        } | null | undefined;
        demoOutcome?: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            validatorPath: string | null;
            checkTypesExitCode: number | null;
            buildExitCode: number | null;
        } | null | undefined;
    }>, "many">;
    /** Total number of rounds the work splits into. */
    roundCount: z.ZodNumber;
    /** Anything preventing end-to-end execution. Non-empty
     *  blockers ⇒ the plan is informational only; some
     *  intervention is required before progress. */
    blockers: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Stable deterministic identifier built from the blocker's kind +
         *  capability ids. Format: `${kind}--${sortedCapabilityIds.join('-')}`.
         *  Used by the `resolve-blocker` CLI subcommand to address a
         *  specific blocker; survives re-builds because the input shape
         *  determines the id. Global blockers (no capabilityIds, e.g.
         *  `dependency-cycle`) get `${kind}--global`. */
        id: z.ZodString;
        kind: z.ZodEnum<["uncertain-capability", "dependency-cycle", "drift-invalidated", "api-sketch-malformed"]>;
        /** Capability ids this blocker is about. May be empty for
         *  global blockers like `'dependency-cycle'` (where the
         *  detail message names the cycle members). */
        capabilityIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Operator-facing prose describing what to resolve. */
        detail: z.ZodString;
        /** Suggested next action (start a research augment
         *  run, edit the decomposition, etc.). */
        suggestedAction: z.ZodString;
        /** Optional whitelist of classifications the `resolve-blocker`
         *  CLI subcommand will accept as a resolution. Undefined means
         *  "any non-`uncertain` classification is permitted" (no
         *  restriction). The `routeCapabilities` step sets this per
         *  blocker kind: uncertain-capability blockers allow
         *  ['package', 'extend-existing', 'game-code', 'existing'];
         *  drift-invalidated allows the same set; dependency-cycle and
         *  api-sketch-malformed leave it undefined (require manual
         *  decomposition edit, not CLI resolution). */
        allowedResolutions: z.ZodOptional<z.ZodArray<z.ZodEnum<["package", "extend-existing", "game-code", "existing", "uncertain"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "drift-invalidated" | "uncertain-capability" | "dependency-cycle" | "api-sketch-malformed";
        detail: string;
        capabilityIds: string[];
        suggestedAction: string;
        allowedResolutions?: ("package" | "extend-existing" | "game-code" | "existing" | "uncertain")[] | undefined;
    }, {
        id: string;
        kind: "drift-invalidated" | "uncertain-capability" | "dependency-cycle" | "api-sketch-malformed";
        detail: string;
        suggestedAction: string;
        capabilityIds?: string[] | undefined;
        allowedResolutions?: ("package" | "extend-existing" | "game-code" | "existing" | "uncertain")[] | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    generatedAt: string;
    featureId: string;
    decompositionPath: string;
    drift: {
        drifted: boolean;
        contentHashAtResearch: string;
        contentHashAtBuild: string;
        invalidatedCapabilities: string[];
    };
    workItems: {
        status: "failed" | "pending" | "in-progress" | "passed" | "skipped-existing" | "blocked-on-deps" | "drift-invalidated";
        id: string;
        packageId: string | null;
        classification: "package" | "extend-existing" | "game-code" | "existing";
        dependsOn: string[];
        note: string | null;
        capabilityName: string;
        coveredCapabilityIds: string[];
        round: number;
        existingPackageId: string | null;
        authoringConfigPath: string | null;
        resultDir: string | null;
        packageOutcome: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            assertionsPassed: number | null;
            assertionsFailed: number | null;
            assertionsErrored: number | null;
            assertionsNotImplemented: number | null;
            assertionsLoadError: number | null;
            assertionsTotal: number | null;
            harnessSummaryPath: string | null;
            sourceFingerprint: string | null;
        } | null;
        skillOutcome: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            exitCode: number;
            bestIteration: number | null;
            internalDelta: number | null;
            genericDelta: number | null;
        } | null;
        demoOutcome: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            validatorPath: string | null;
            checkTypesExitCode: number | null;
            buildExitCode: number | null;
        } | null;
    }[];
    roundCount: number;
    blockers: {
        id: string;
        kind: "drift-invalidated" | "uncertain-capability" | "dependency-cycle" | "api-sketch-malformed";
        detail: string;
        capabilityIds: string[];
        suggestedAction: string;
        allowedResolutions?: ("package" | "extend-existing" | "game-code" | "existing" | "uncertain")[] | undefined;
    }[];
}, {
    schemaVersion: 1;
    generatedAt: string;
    featureId: string;
    decompositionPath: string;
    drift: {
        drifted: boolean;
        contentHashAtResearch: string;
        contentHashAtBuild: string;
        invalidatedCapabilities?: string[] | undefined;
    };
    workItems: {
        id: string;
        classification: "package" | "extend-existing" | "game-code" | "existing";
        capabilityName: string;
        coveredCapabilityIds: string[];
        round: number;
        status?: "failed" | "pending" | "in-progress" | "passed" | "skipped-existing" | "blocked-on-deps" | "drift-invalidated" | undefined;
        packageId?: string | null | undefined;
        dependsOn?: string[] | undefined;
        note?: string | null | undefined;
        existingPackageId?: string | null | undefined;
        authoringConfigPath?: string | null | undefined;
        resultDir?: string | null | undefined;
        packageOutcome?: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            assertionsPassed: number | null;
            assertionsFailed: number | null;
            assertionsErrored: number | null;
            assertionsNotImplemented: number | null;
            assertionsLoadError: number | null;
            assertionsTotal: number | null;
            harnessSummaryPath: string | null;
            sourceFingerprint?: string | null | undefined;
        } | null | undefined;
        skillOutcome?: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            exitCode: number;
            bestIteration: number | null;
            internalDelta: number | null;
            genericDelta: number | null;
        } | null | undefined;
        demoOutcome?: {
            startedAt: string;
            durationMs: number;
            pass: boolean;
            totalCostUsd: number | null;
            note: string;
            completedAt: string;
            authoringExitCode: number;
            validatorPath: string | null;
            checkTypesExitCode: number | null;
            buildExitCode: number | null;
        } | null | undefined;
    }[];
    roundCount: number;
    blockers?: {
        id: string;
        kind: "drift-invalidated" | "uncertain-capability" | "dependency-cycle" | "api-sketch-malformed";
        detail: string;
        suggestedAction: string;
        capabilityIds?: string[] | undefined;
        allowedResolutions?: ("package" | "extend-existing" | "game-code" | "existing" | "uncertain")[] | undefined;
    }[] | undefined;
}>;
export type BuildPlan = z.infer<typeof BuildPlanSchema>;
/** Stricter parser that validates every dependency
 *  reference resolves to a known work item AND that each
 *  work item's classification is consistent with its
 *  outcome fields. Catches malformed plans before
 *  downstream consumers see them. */
export declare function parseBuildPlan(raw: unknown): BuildPlan;
//# sourceMappingURL=buildPlan.d.ts.map