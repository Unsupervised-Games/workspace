import { z } from 'zod';
import { GenPipelineIdSchema } from './genGovernance.js';

// Org-scoped generation-spend shapes — the shared, team-level twin of the
// per-workspace `gen-governance` model (Teams Phase 2). Where
// `gen-governance.config.json` + the audit JSONL logs govern ONE developer's
// disk, these shapes live in the org's backing store so an owner can set ONE
// budget that binds the whole team, and every member's generation spend rolls
// up into ONE shared ledger.
//
// These cross the workbench ↔ Supabase boundary. @unsupervised/workbench-cloud parses
// via these schema values (it declares no zod of its own), and the pure
// aggregation there computes the report the Team → Spend panel renders.

/** The org's cross-pipeline generation budget — the shared, owner-set twin of
 *  `gen-governance.config.json`. Raisable by any holder of the `spend:authorize`
 *  capability (owner / admin); enforced server-side by RLS + the
 *  `set_org_budget` RPC. A raisable ceiling is the team primitive — there is no
 *  org-level expiring propose-approve grant (that stays a per-workspace CLI
 *  concern). */
export const OrgBudgetSchema = z.object({
  orgId: z.string().min(1),
  /** Cross-pipeline lifetime ceiling (USD) — cumulative across every member's
   *  every run of every pipeline. Undefined ⇒ no ceiling (visibility only). */
  lifetimeUsd: z.number().nonnegative().optional(),
  /** Sync this flag down into each member's local config so billed generation
   *  requires a per-workspace authorization grant. Off by default. */
  requireAuthorization: z.boolean().default(false),
  /** auth user id of whoever last set the budget. */
  updatedBy: z.string().min(1),
  updatedAt: z.string(),
});
export type OrgBudget = z.infer<typeof OrgBudgetSchema>;

/** One normalized spend record in the shared org ledger — a single member's
 *  single billed generation, reconciled up from their local audit log. */
export const SpendLedgerRowSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  /** auth user id of the member who incurred the spend. */
  userId: z.string().min(1),
  pipeline: GenPipelineIdSchema,
  costUsd: z.number(),
  /** ISO timestamp the generation occurred (the source row's `ts` / `at`). */
  occurredAt: z.string(),
  /** One-line human label (`model · goblin`, `ja · 12 keys`). */
  detail: z.string(),
  /** The source row's `source` (`fresh` / `cache` / `locked` / …). */
  source: z.string().optional(),
  /** Idempotency key `"<logFilename>#<lineIndex>"` — audit logs are
   *  append-only, so the (member, localKey) pair is stable across
   *  re-reconciliation. The backing store dedups on `(orgId, userId, localKey)`. */
  localKey: z.string().min(1),
});
export type SpendLedgerRow = z.infer<typeof SpendLedgerRowSchema>;

/** A new ledger row as reported by a member (the store assigns `id` / `userId`). */
export const NewSpendRowSchema = SpendLedgerRowSchema.omit({ id: true, orgId: true, userId: true });
export type NewSpendRow = z.infer<typeof NewSpendRowSchema>;

/** Per-pipeline rollup within the org report. */
export const OrgPipelineSpendSchema = z.object({
  pipeline: GenPipelineIdSchema,
  label: z.string(),
  totalUsd: z.number(),
  billedEntries: z.number().int().nonnegative(),
});
export type OrgPipelineSpend = z.infer<typeof OrgPipelineSpendSchema>;

/** Per-member rollup within the org report. */
export const OrgMemberSpendSchema = z.object({
  userId: z.string().min(1),
  /** Resolved display email when a profile is known. */
  email: z.string().optional(),
  totalUsd: z.number(),
  billedEntries: z.number().int().nonnegative(),
});
export type OrgMemberSpend = z.infer<typeof OrgMemberSpendSchema>;

/** The aggregate team-spend view for one org. */
export const OrgSpendReportSchema = z.object({
  totalUsd: z.number(),
  byPipeline: z.array(OrgPipelineSpendSchema),
  byMember: z.array(OrgMemberSpendSchema),
  budget: OrgBudgetSchema.nullable(),
  /** Headroom under the budget (`lifetimeUsd - totalUsd`, floored at 0), when a
   *  ceiling is set. */
  remainingUsd: z.number().optional(),
});
export type OrgSpendReport = z.infer<typeof OrgSpendReportSchema>;
