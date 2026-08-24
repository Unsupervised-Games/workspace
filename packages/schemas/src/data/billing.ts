import { z } from 'zod';

// Org billing shapes — a Stripe subscription per org, priced by seat (Teams
// Phase 4). Orgs are free by default with a small seat allotment; buying seats
// raises the cap on member count. The subscription state is synced from Stripe
// into the org's backing store by the webhook Edge Function; the workbench reads
// it and gates invites on seat availability.
//
// These cross the workbench ↔ Supabase boundary; @unsupervised/workbench-cloud parses
// via them (it declares no zod of its own). The seat LOGIC (FREE_SEATS,
// availability) lives in that package, not here (schemas is data, not logic).

/** Subscription status — Stripe's lifecycle states, plus a synthetic `none` for
 *  an org that has never subscribed (still on the free allotment). */
/** The plan tier an org is on — the axis feature-gating keys off (`planCan`).
 *  Cumulative: `team ⊇ pro ⊇ free`. Written by the Stripe webhook (from the
 *  price's `metadata.tier`); `free` is the default for any org with no live
 *  paid subscription. Enterprise is deferred until its differentiators exist. */
export const PlanSchema = z.enum(['free', 'pro', 'team', 'enterprise']);
export type Plan = z.infer<typeof PlanSchema>;

export const BillingStatusSchema = z.enum([
  'none',
  'active',
  'trialing',
  'past_due',
  'canceled',
  'incomplete',
]);
export type BillingStatus = z.infer<typeof BillingStatusSchema>;

/** An org's billing state, synced from Stripe by the webhook. Absent row ⇒ the
 *  org is free on the default seat allotment. */
export const OrgSubscriptionSchema = z.object({
  orgId: z.string().min(1),
  /** The plan tier (`free` / `pro` / `team`). Mirrors `organizations.plan`;
   *  the axis `planCan` gates on. */
  plan: PlanSchema.default('free'),
  /** Purchased seats — the cap on the org's member count. */
  seats: z.number().int().nonnegative(),
  status: BillingStatusSchema,
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  /** ISO end of the current paid period (when the plan renews / lapses). */
  currentPeriodEnd: z.string().optional(),
  /** ISO end of a free trial while `status === 'trialing'` — the conversion date
   *  + the countdown source. Absent when there's no trial. */
  trialEnd: z.string().optional(),
  /** True when the subscription is set to cancel at the period end (still live
   *  until `currentPeriodEnd`, then lapses to free). */
  cancelAtPeriodEnd: z.boolean().optional(),
  updatedAt: z.string(),
});
export type OrgSubscription = z.infer<typeof OrgSubscriptionSchema>;

/** Computed seat usage for the UI: how many of the org's seats are taken
 *  (members + pending invitations) vs. how many it has. */
export const SeatUsageSchema = z.object({
  used: z.number().int().nonnegative(),
  seats: z.number().int().nonnegative(),
  available: z.number().int(),
});
export type SeatUsage = z.infer<typeof SeatUsageSchema>;
