import { z } from 'zod';
/** The generation pipelines a game-/workspace-level layer aggregates.
 *  Mirrors gen-core's `GEN_PIPELINES` registry ids — `code` (the
 *  dev-agent + `skill-builder execute`) is workspace-scoped, the other
 *  three are game-scoped, but the unified spend view spans all four. */
export declare const GenPipelineIdSchema: z.ZodEnum<["asset", "audio", "loc", "code"]>;
export type GenPipelineId = z.infer<typeof GenPipelineIdSchema>;
/** The committed cross-pipeline POLICY, at
 *  `<gameRoot>/gen-governance.config.json`. Sets the game-wide
 *  lifetime ceiling + whether the unified authorization gate is on.
 *  Both are opt-in; an absent file means no unified layer (each
 *  pipeline governs only itself, today's behavior). */
export declare const GenGovernanceConfigSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    /** Cross-pipeline lifetime ceiling (USD) — cumulative across every
     *  run of art + audio + localization. The per-pipeline hard caps
     *  reset each run; this bounds total generation spend for the game
     *  no matter how many runs of how many pipelines. Undefined ⇒ no
     *  unified ceiling. */
    lifetimeUsd: z.ZodOptional<z.ZodNumber>;
    /** Require a valid unified authorization grant before any billed
     *  generation in ANY pipeline — the propose-approve gate for
     *  autonomous / CI contexts, applied game-wide. A single
     *  `gen-governance authorize --up-to <usd>` then bounds all three
     *  pipelines at once. Off by default. */
    requireAuthorization: z.ZodOptional<z.ZodBoolean>;
    /** Set when this file is SYNCED DOWN from an org's shared budget (the
     *  workbench writes it on org-select — Teams Phase 2). It marks the
     *  ceiling as org-managed so the workbench may safely overwrite it on
     *  the next sync, and never clobbers a hand-authored config (which
     *  lacks the flag). gen-core's structural reader ignores these two
     *  fields, so forge honors the synced ceiling with no code change. */
    managedByOrg: z.ZodOptional<z.ZodBoolean>;
    /** The org id this ceiling was synced from (present iff `managedByOrg`). */
    orgId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    lifetimeUsd?: number | undefined;
    requireAuthorization?: boolean | undefined;
    managedByOrg?: boolean | undefined;
    orgId?: string | undefined;
}, {
    schemaVersion: 1;
    lifetimeUsd?: number | undefined;
    requireAuthorization?: boolean | undefined;
    managedByOrg?: boolean | undefined;
    orgId?: string | undefined;
}>;
export type GenGovernanceConfig = z.infer<typeof GenGovernanceConfigSchema>;
/** A bounded, expiring authorization to SPEND on generation,
 *  game-wide. Identical shape to each pipeline's own grant (see
 *  `AssetSpendAuthorizationSchema`), but bounds cumulative
 *  CROSS-pipeline spend since `grantedAt`. Lives at
 *  `<gameRoot>/.gen-governance-authorization.json`; written by
 *  `gen-governance authorize --up-to <usd>`. */
export declare const GenGovernanceAuthorizationSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    /** USD ceiling this grant authorizes for cumulative cross-pipeline
     *  spend measured from `grantedAt`. */
    maxUsd: z.ZodNumber;
    grantedAt: z.ZodString;
    /** ISO timestamp after which the grant is void. */
    expiresAt: z.ZodString;
    grantedBy: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    maxUsd: number;
    grantedAt: string;
    expiresAt: string;
    note?: string | undefined;
    grantedBy?: string | undefined;
}, {
    schemaVersion: 1;
    maxUsd: number;
    grantedAt: string;
    expiresAt: string;
    note?: string | undefined;
    grantedBy?: string | undefined;
}>;
export type GenGovernanceAuthorization = z.infer<typeof GenGovernanceAuthorizationSchema>;
/** Per-pipeline spend rollup within the unified report. */
export declare const PipelineSpendSummarySchema: z.ZodObject<{
    pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
    label: z.ZodString;
    totalUsd: z.ZodNumber;
    billedEntries: z.ZodNumber;
    totalEntries: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    label: string;
    pipeline: "code" | "audio" | "asset" | "loc";
    totalUsd: number;
    billedEntries: number;
    totalEntries: number;
}, {
    label: string;
    pipeline: "code" | "audio" | "asset" | "loc";
    totalUsd: number;
    billedEntries: number;
    totalEntries: number;
}>;
export type PipelineSpendSummary = z.infer<typeof PipelineSpendSummarySchema>;
/** One normalized cross-pipeline spend record. */
export declare const UnifiedSpendRecordSchema: z.ZodObject<{
    pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
    at: z.ZodString;
    costUsd: z.ZodNumber;
    detail: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    at: string;
    costUsd: number;
    pipeline: "code" | "audio" | "asset" | "loc";
    detail: string;
    source?: string | undefined;
}, {
    at: string;
    costUsd: number;
    pipeline: "code" | "audio" | "asset" | "loc";
    detail: string;
    source?: string | undefined;
}>;
export type UnifiedSpendRecord = z.infer<typeof UnifiedSpendRecordSchema>;
/** The cross-pipeline spend view for one game. */
export declare const UnifiedSpendReportSchema: z.ZodObject<{
    totalUsd: z.ZodNumber;
    byPipeline: z.ZodArray<z.ZodObject<{
        pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
        label: z.ZodString;
        totalUsd: z.ZodNumber;
        billedEntries: z.ZodNumber;
        totalEntries: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
        totalEntries: number;
    }, {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
        totalEntries: number;
    }>, "many">;
    records: z.ZodArray<z.ZodObject<{
        pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
        at: z.ZodString;
        costUsd: z.ZodNumber;
        detail: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        at: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        source?: string | undefined;
    }, {
        at: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        source?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    totalUsd: number;
    byPipeline: {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
        totalEntries: number;
    }[];
    records: {
        at: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        source?: string | undefined;
    }[];
}, {
    totalUsd: number;
    byPipeline: {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
        totalEntries: number;
    }[];
    records: {
        at: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        source?: string | undefined;
    }[];
}>;
export type UnifiedSpendReport = z.infer<typeof UnifiedSpendReportSchema>;
//# sourceMappingURL=genGovernance.d.ts.map