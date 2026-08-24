import { z } from 'zod';
/** Subscription status — Stripe's lifecycle states, plus a synthetic `none` for
 *  an org that has never subscribed (still on the free allotment). */
/** The plan tier an org is on — the axis feature-gating keys off (`planCan`).
 *  Cumulative: `team ⊇ pro ⊇ free`. Written by the Stripe webhook (from the
 *  price's `metadata.tier`); `free` is the default for any org with no live
 *  paid subscription. Enterprise is deferred until its differentiators exist. */
export declare const PlanSchema: z.ZodEnum<["free", "pro", "team", "enterprise"]>;
export type Plan = z.infer<typeof PlanSchema>;
export declare const BillingStatusSchema: z.ZodEnum<["none", "active", "trialing", "past_due", "canceled", "incomplete"]>;
export type BillingStatus = z.infer<typeof BillingStatusSchema>;
/** An org's billing state, synced from Stripe by the webhook. Absent row ⇒ the
 *  org is free on the default seat allotment. */
export declare const OrgSubscriptionSchema: z.ZodObject<{
    orgId: z.ZodString;
    /** The plan tier (`free` / `pro` / `team`). Mirrors `organizations.plan`;
     *  the axis `planCan` gates on. */
    plan: z.ZodDefault<z.ZodEnum<["free", "pro", "team", "enterprise"]>>;
    /** Purchased seats — the cap on the org's member count. */
    seats: z.ZodNumber;
    status: z.ZodEnum<["none", "active", "trialing", "past_due", "canceled", "incomplete"]>;
    stripeCustomerId: z.ZodOptional<z.ZodString>;
    stripeSubscriptionId: z.ZodOptional<z.ZodString>;
    /** ISO end of the current paid period (when the plan renews / lapses). */
    currentPeriodEnd: z.ZodOptional<z.ZodString>;
    /** ISO end of a free trial while `status === 'trialing'` — the conversion date
     *  + the countdown source. Absent when there's no trial. */
    trialEnd: z.ZodOptional<z.ZodString>;
    /** True when the subscription is set to cancel at the period end (still live
     *  until `currentPeriodEnd`, then lapses to free). */
    cancelAtPeriodEnd: z.ZodOptional<z.ZodBoolean>;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "active" | "none" | "trialing" | "past_due" | "canceled" | "incomplete";
    orgId: string;
    plan: "team" | "free" | "pro" | "enterprise";
    seats: number;
    updatedAt: string;
    stripeCustomerId?: string | undefined;
    stripeSubscriptionId?: string | undefined;
    currentPeriodEnd?: string | undefined;
    trialEnd?: string | undefined;
    cancelAtPeriodEnd?: boolean | undefined;
}, {
    status: "active" | "none" | "trialing" | "past_due" | "canceled" | "incomplete";
    orgId: string;
    seats: number;
    updatedAt: string;
    plan?: "team" | "free" | "pro" | "enterprise" | undefined;
    stripeCustomerId?: string | undefined;
    stripeSubscriptionId?: string | undefined;
    currentPeriodEnd?: string | undefined;
    trialEnd?: string | undefined;
    cancelAtPeriodEnd?: boolean | undefined;
}>;
export type OrgSubscription = z.infer<typeof OrgSubscriptionSchema>;
/** Computed seat usage for the UI: how many of the org's seats are taken
 *  (members + pending invitations) vs. how many it has. */
export declare const SeatUsageSchema: z.ZodObject<{
    used: z.ZodNumber;
    seats: z.ZodNumber;
    available: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    seats: number;
    used: number;
    available: number;
}, {
    seats: number;
    used: number;
    available: number;
}>;
export type SeatUsage = z.infer<typeof SeatUsageSchema>;
//# sourceMappingURL=billing.d.ts.map