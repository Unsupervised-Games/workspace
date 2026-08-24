// GDPR data export bundles (SaaS #6 Phase 2) — the shapes a data-export returns.
// Records of the EXISTING row types (no new row shapes): an org's data, or a
// person's cross-org data, gathered into one JSON bundle for portability /
// subject-access. Financial secrets (Stripe ids, saved payment method) are never
// included — the assemblers redact them. The account/org DELETION side has no
// data shape (it's an action), so it lives only in the store seam.

import { z } from 'zod';
import { ProfileSchema, MemberSchema, InvitationSchema, OrganizationSchema } from './teams.js';
import { SpendLedgerRowSchema, OrgBudgetSchema } from './orgSpend.js';
import { CreditLedgerEntrySchema } from './credits.js';
import { ReviewCommentSchema, ReviewApprovalSchema } from './review.js';
import { ProductEventSchema } from './productAnalytics.js';
import { AuditEntrySchema } from './audit.js';

// ────────────────────────────────────────────────────────────────
// UserDataExport — one person's data across every org they belong to.
// ────────────────────────────────────────────────────────────────

export const UserDataExportSchema = z.object({
  exportedAt: z.string(),
  profile: ProfileSchema,
  /** The user's memberships (org id + role). */
  memberships: z.array(z.object({ orgId: z.string(), role: z.string() })),
  spendRows: z.array(SpendLedgerRowSchema),
  creditLedger: z.array(CreditLedgerEntrySchema),
  reviewComments: z.array(ReviewCommentSchema),
  reviewApprovals: z.array(ReviewApprovalSchema),
  productEvents: z.array(ProductEventSchema),
  /** Invitations this user sent. */
  sentInvitations: z.array(InvitationSchema),
});
export type UserDataExport = z.infer<typeof UserDataExportSchema>;

// ────────────────────────────────────────────────────────────────
// OrgDataExport — a whole organization's data (owner-only). Stripe /
// payment-method fields are redacted by the assembler, never included.
// ────────────────────────────────────────────────────────────────

export const OrgDataExportSchema = z.object({
  exportedAt: z.string(),
  organization: OrganizationSchema,
  members: z.array(MemberSchema),
  invitations: z.array(InvitationSchema),
  budget: OrgBudgetSchema.optional(),
  /** The org's credit balance (integer credits — the saved card is NOT included). */
  creditBalance: z.number().int().nonnegative().optional(),
  spendLedger: z.array(SpendLedgerRowSchema),
  creditLedger: z.array(CreditLedgerEntrySchema),
  spendLimit: z
    .object({ maxCreditsPerHour: z.number().nullable(), maxCreditsPerDay: z.number().nullable() })
    .optional(),
  /** Plan + seats + status only — the Stripe ids are redacted. */
  subscription: z.object({ plan: z.string(), seats: z.number(), status: z.string() }).optional(),
  reviewComments: z.array(ReviewCommentSchema),
  reviewApprovals: z.array(ReviewApprovalSchema),
  auditLog: z.array(AuditEntrySchema),
});
export type OrgDataExport = z.infer<typeof OrgDataExportSchema>;
