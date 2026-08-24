// Asset-approval ledger — the durable record of a HUMAN's ship /
// no-ship decision on a generated asset. The automated Verify arm
// (gates + the perceptual panel judge) can flag an asset for review
// (`AssetReviewSummary.escalation`) and pinning can make approved
// bytes durable, but neither records WHO decided WHAT and WHY. This
// ledger closes that: it's the audit trail behind the approval queue,
// and the only piece of queue state that isn't derivable from the
// pin store + review artifacts (a rejection + its rationale).
//
// Lives at `<rootDir>/.asset-gen-approvals.json`. Keyed by the full
// assets-raw-relative slot — the same key review + drift + pins use.

import { z } from 'zod';

/** A human's decision on a generated asset. `approved` ⇒ pinned +
 *  locked (shipped); `rejected` ⇒ sent back for rework, with a note. */
export const AssetApprovalStateSchema = z.enum(['approved', 'rejected']);
export type AssetApprovalState = z.infer<typeof AssetApprovalStateSchema>;

export const AssetApprovalEntrySchema = z.object({
  /** Full assets-raw-relative slot (`models/characters/sora`). */
  slot: z.string().min(1),
  kind: z.enum(['model', 'image']),
  state: AssetApprovalStateSchema,
  /** ISO timestamp the decision was recorded. */
  decidedAt: z.string(),
  /** Reviewer rationale — required for `rejected` (what to fix),
   *  optional for `approved`. */
  note: z.string().optional(),
  /** The RECIPE hash at decision time (intended-appearance inputs,
   *  no package version — same key the pin store uses). The queue
   *  compares this to the current recipe to flag a STALE approval:
   *  approved bytes whose recipe has since changed. */
  recipeHash: z.string(),
  /** The full cache hash at decision time (provenance). */
  fullHash: z.string(),
  /** Optional reviewer identity (email / handle). Free-form; the CLI
   *  fills it from `--by` or the git user when available. */
  by: z.string().optional(),
});
export type AssetApprovalEntry = z.infer<typeof AssetApprovalEntrySchema>;

/** The whole ledger. One entry per slot (latest decision wins — the
 *  store upserts by slot). */
export const AssetApprovalLedgerSchema = z.object({
  schemaVersion: z.literal(1),
  entries: z.array(AssetApprovalEntrySchema),
});
export type AssetApprovalLedger = z.infer<typeof AssetApprovalLedgerSchema>;

/** A bounded, expiring authorization to SPEND on generation — the
 *  propose-approve gate for AI-piloted runs. When
 *  `StyleConfig.requireSpendAuthorization` is on, a billed generation
 *  is refused unless a valid one of these grants enough headroom.
 *  Lives at `<rootDir>/.asset-gen-spend-authorization.json`; written by
 *  `asset-gen authorize --up-to <usd>` after a human reviews the
 *  forecast. `maxUsd` bounds the whole batch (a run's cumulative spend
 *  must stay under it); `expiresAt` forces a fresh grant per session so
 *  a stale authorization can't silently green-light a later run. */
export const AssetSpendAuthorizationSchema = z.object({
  schemaVersion: z.literal(1),
  /** USD ceiling this grant authorizes for a single run's cumulative
   *  spend. */
  maxUsd: z.number().nonnegative(),
  grantedAt: z.string(),
  /** ISO timestamp after which the grant is void. */
  expiresAt: z.string(),
  /** Who granted it (email / handle). */
  grantedBy: z.string().optional(),
  note: z.string().optional(),
});
export type AssetSpendAuthorization = z.infer<
  typeof AssetSpendAuthorizationSchema
>;
