// The audit log — an immutable trail of security-relevant org actions (member /
// role / invite / billing / budget / governance changes), for an enterprise
// buyer's security review (SaaS #6 Phase 1). Written ONLY by database triggers
// (SECURITY DEFINER) so a member can neither forge nor suppress a row; read by
// org admins. The `actor` is whoever performed the action (null ⇒ a system /
// service-role action, e.g. the Stripe webhook syncing a subscription).
//
// Schema names PascalCaseSchema; inferred types drop the suffix.

import { z } from 'zod';

/** The stable action vocabulary. Each maps to one security-relevant mutation the
 *  database triggers capture. Grouped by category in the pure `auditCategory`. */
export const AuditActionSchema = z.enum([
  // membership
  'member.added',
  'member.role_changed',
  'member.removed',
  'invitation.created',
  'invitation.revoked',
  'invitation.redeemed',
  // org lifecycle
  'org.created',
  'org.renamed',
  'org.deleted',
  'org.suspended',
  // billing
  'subscription.changed',
  'autoreload.changed',
  // governance
  'budget.changed',
  'spend_limit.changed',
  'data.exported',
]);
export type AuditAction = z.infer<typeof AuditActionSchema>;

export const AuditEntrySchema = z.object({
  id: z.string(),
  orgId: z.string().min(1),
  /** The user who performed the action; absent for a system / service-role
   *  action (a webhook), or once the actor's account has been deleted. */
  actorId: z.string().optional(),
  /** A denormalized snapshot of the actor's email at action time, so the trail
   *  stays readable after the account is deleted (legitimate-interest retention).
   *  Absent for system actions. */
  actorEmail: z.string().optional(),
  action: AuditActionSchema,
  /** The kind of entity affected (`member` / `invitation` / `organization` /
   *  `subscription` / `budget` / …) — for grouping + the target link. */
  targetType: z.string().optional(),
  /** The affected entity's id (a user id, invitation id, …). */
  targetId: z.string().optional(),
  /** A human-readable one-liner describing what happened. */
  summary: z.string().default(''),
  /** Structured before/after detail (e.g. `{ from: 'member', to: 'admin' }`). */
  metadata: z.record(z.unknown()).optional(),
  occurredAt: z.string(),
});
export type AuditEntry = z.infer<typeof AuditEntrySchema>;
