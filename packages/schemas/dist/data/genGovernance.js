import { z } from 'zod';
// Unified, game-level generation-governance shapes — the typed mirror
// of the structural shapes @unsupervised/gen-core reads from disk
// (`unifiedGovernance.ts`). gen-core stays schema-free (it's the inner
// shared lib); these schemas exist for the `gen-governance` CLI, the
// forge/workbench readers, and anywhere the config or spend report needs
// validation. Structurally identical to the gen-core interfaces.
//
// See the per-pipeline siblings in assetApproval.ts /
// audioApproval.ts — the unified layer bounds all three pipelines'
// combined spend with ONE ceiling + ONE grant, where each pipeline
// otherwise governs only itself.
/** The generation pipelines a game-/workspace-level layer aggregates.
 *  Mirrors gen-core's `GEN_PIPELINES` registry ids — `code` (the
 *  dev-agent + `skill-builder execute`) is workspace-scoped, the other
 *  three are game-scoped, but the unified spend view spans all four. */
export const GenPipelineIdSchema = z.enum(['asset', 'audio', 'loc', 'code']);
/** The committed cross-pipeline POLICY, at
 *  `<gameRoot>/gen-governance.config.json`. Sets the game-wide
 *  lifetime ceiling + whether the unified authorization gate is on.
 *  Both are opt-in; an absent file means no unified layer (each
 *  pipeline governs only itself, today's behavior). */
export const GenGovernanceConfigSchema = z.object({
    schemaVersion: z.literal(1),
    /** Cross-pipeline lifetime ceiling (USD) — cumulative across every
     *  run of art + audio + localization. The per-pipeline hard caps
     *  reset each run; this bounds total generation spend for the game
     *  no matter how many runs of how many pipelines. Undefined ⇒ no
     *  unified ceiling. */
    lifetimeUsd: z.number().nonnegative().optional(),
    /** Require a valid unified authorization grant before any billed
     *  generation in ANY pipeline — the propose-approve gate for
     *  autonomous / CI contexts, applied game-wide. A single
     *  `gen-governance authorize --up-to <usd>` then bounds all three
     *  pipelines at once. Off by default. */
    requireAuthorization: z.boolean().optional(),
    /** Set when this file is SYNCED DOWN from an org's shared budget (the
     *  workbench writes it on org-select — Teams Phase 2). It marks the
     *  ceiling as org-managed so the workbench may safely overwrite it on
     *  the next sync, and never clobbers a hand-authored config (which
     *  lacks the flag). gen-core's structural reader ignores these two
     *  fields, so forge honors the synced ceiling with no code change. */
    managedByOrg: z.boolean().optional(),
    /** The org id this ceiling was synced from (present iff `managedByOrg`). */
    orgId: z.string().optional(),
});
/** A bounded, expiring authorization to SPEND on generation,
 *  game-wide. Identical shape to each pipeline's own grant (see
 *  `AssetSpendAuthorizationSchema`), but bounds cumulative
 *  CROSS-pipeline spend since `grantedAt`. Lives at
 *  `<gameRoot>/.gen-governance-authorization.json`; written by
 *  `gen-governance authorize --up-to <usd>`. */
export const GenGovernanceAuthorizationSchema = z.object({
    schemaVersion: z.literal(1),
    /** USD ceiling this grant authorizes for cumulative cross-pipeline
     *  spend measured from `grantedAt`. */
    maxUsd: z.number().nonnegative(),
    grantedAt: z.string(),
    /** ISO timestamp after which the grant is void. */
    expiresAt: z.string(),
    grantedBy: z.string().optional(),
    note: z.string().optional(),
});
/** Per-pipeline spend rollup within the unified report. */
export const PipelineSpendSummarySchema = z.object({
    pipeline: GenPipelineIdSchema,
    label: z.string(),
    totalUsd: z.number(),
    billedEntries: z.number().int().nonnegative(),
    totalEntries: z.number().int().nonnegative(),
});
/** One normalized cross-pipeline spend record. */
export const UnifiedSpendRecordSchema = z.object({
    pipeline: GenPipelineIdSchema,
    at: z.string(),
    costUsd: z.number(),
    detail: z.string(),
    source: z.string().optional(),
});
/** The cross-pipeline spend view for one game. */
export const UnifiedSpendReportSchema = z.object({
    totalUsd: z.number(),
    byPipeline: z.array(PipelineSpendSummarySchema),
    records: z.array(UnifiedSpendRecordSchema),
});
//# sourceMappingURL=genGovernance.js.map