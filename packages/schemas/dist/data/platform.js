import { z } from 'zod';
import { BillingStatusSchema } from './billing.js';
// Platform-owner (vendor) admin shapes — the cross-tenant view of every customer
// org (Vendor admin console). This is the ONE surface that deliberately spans
// tenants; RLS hides orgs from each other and from the vendor, so these are
// populated only by the platform-admin-gated SECURITY DEFINER RPCs
// (`admin_list_orgs`) — never raw table reads. Consumed by `apps/console`, never
// by the customer-facing Workbench.
/** One org, as the platform owner sees it across the whole tenant base. */
export const AdminOrgSummarySchema = z.object({
    orgId: z.string().min(1),
    name: z.string(),
    /** The owner's email (joined from profiles). */
    ownerEmail: z.string().optional(),
    memberCount: z.number().int().nonnegative(),
    plan: z.string(),
    status: BillingStatusSchema,
    seats: z.number().int().nonnegative(),
    /** Recurring amount this org pays per period, in cents (0 when free). */
    amountCents: z.number().int().nonnegative(),
    suspended: z.boolean(),
    /** Vendor-granted content-moderation exemption: a trusted (adult/mature-rated)
     *  org bypasses the `sexual` prompt block + L2. CSAM is never exemptable. */
    moderationExempt: z.boolean(),
    createdAt: z.string(),
    /** The org's vendor-set spend-velocity ceiling (null ⇒ the proxy default) —
     *  shown + editable per org in the console. */
    maxCreditsPerHour: z.number().int().positive().nullable(),
    maxCreditsPerDay: z.number().int().positive().nullable(),
    /** Credits this org has burned in the last 24h — the ops outlier signal
     *  (surfaces a fast burner before its velocity cap even trips). */
    spend24hCredits: z.number().int().nonnegative(),
});
/** One vendor's realized unit-economics over a window — the credits customers
 *  consumed against it (revenue at the sell price) vs the raw vendor cost. The
 *  `vendor` `'all'` row is the summed total. */
export const VendorMarginSchema = z.object({
    vendor: z.string(),
    debitCredits: z.number().int().nonnegative(),
    revenueUsd: z.number(),
    vendorCostUsd: z.number(),
    marginUsd: z.number(),
    /** marginUsd / revenueUsd, in [.., 1]; 0 when there's no revenue. */
    marginPct: z.number(),
});
/** The platform-wide credit scoreboard: per-vendor margin + the total + the
 *  outstanding-credit liability (paid-for but unspent credits = deferred
 *  revenue). Cross-tenant — platform-admin only. */
export const CreditEconomicsSchema = z.object({
    /** ISO lower bound of the margin window (liability is point-in-time). */
    since: z.string(),
    vendors: z.array(VendorMarginSchema),
    total: VendorMarginSchema,
    liabilityCredits: z.number().int().nonnegative(),
    liabilityUsd: z.number(),
});
/** One proxy-recorded charge: a successful vendor call that SHOULD be debited,
 *  keyed by the run id shared with the ledger debit. */
export const ProxyChargeRecordSchema = z.object({
    idempotencyKey: z.string(),
    orgId: z.string(),
    vendor: z.string(),
    credits: z.number().int().nonnegative(),
    createdAt: z.string(),
});
/** Money-path integrity report: proxy charges with no matching ledger debit —
 *  the vendor-charged-but-not-debited LEAK — summed + grouped by vendor. A clean
 *  run has `unmatchedCount` 0. Cross-tenant — platform-admin only. */
export const ReconciliationReportSchema = z.object({
    since: z.string(),
    unmatchedCount: z.number().int().nonnegative(),
    leakCredits: z.number().int().nonnegative(),
    leakUsd: z.number(),
    byVendor: z.array(z.object({
        vendor: z.string(),
        count: z.number().int().nonnegative(),
        credits: z.number().int().nonnegative(),
    })),
    /** A bounded sample of the offending charges, newest-first, for the drill-in. */
    samples: z.array(ProxyChargeRecordSchema),
});
/** One blocked generation prompt (content moderation) — the abuse signal the
 *  vendor console surfaces per org. Cross-tenant; platform-admin only. */
export const ModerationEventSchema = z.object({
    id: z.string(),
    orgId: z.string(),
    userId: z.string().optional(),
    vendor: z.string(),
    /** Which layer blocked it: the deterministic L1 gate or the semantic L2 classifier. */
    layer: z.enum(['l1', 'l2']),
    categories: z.array(z.string()),
    /** A short, truncated excerpt of the offending prompt (context for review — not
     *  the full text). */
    excerpt: z.string(),
    createdAt: z.string(),
});
/** A vendor's ACTUAL billed cost over a period, from its real usage/invoice
 *  export — the ground truth the ledger's metered estimate is checked against. */
export const VendorActualCostSchema = z.object({
    vendor: z.string(),
    actualUsd: z.number(),
});
/** One vendor's estimate-vs-actual cost variance. `varianceUsd` = actual −
 *  estimated: POSITIVE means the ledger UNDER-metered (the real vendor bill
 *  exceeds what was charged for → margin erosion); negative means it
 *  over-metered. This corrects Phase 2's estimate-based margin to actual. */
export const VendorCostVarianceSchema = z.object({
    vendor: z.string(),
    estimatedUsd: z.number(),
    actualUsd: z.number(),
    varianceUsd: z.number(),
    variancePct: z.number(),
});
/** Estimate-vs-actual across every vendor + an `'all'` total. Vendors present in
 *  only one side surface too (an actual-only vendor = untracked spend). */
export const VendorInvoiceReconciliationSchema = z.object({
    vendors: z.array(VendorCostVarianceSchema),
    total: VendorCostVarianceSchema,
});
/** One activation stage: total events + the distinct-entity count (distinct
 *  USERS for `signin`, distinct ORGS for the rest) + its share of signed-in
 *  users. A participation view across the funnel, not strict sequential
 *  conversion (a user may invite before generating). */
export const ProductFunnelStageSchema = z.object({
    event: z.string(),
    label: z.string(),
    total: z.number().int().nonnegative(),
    distinct: z.number().int().nonnegative(),
    /** `distinct / signin-distinct` (signin itself = 1). 0 when there are no signins. */
    shareOfSignins: z.number(),
});
/** The vendor's activation funnel over a window — ordered stages (signin →
 *  org.created → generation.run → member.invited → plan.upgraded) + the count of
 *  orgs that actually ran a generation. Cross-tenant, platform-admin only. */
export const ProductFunnelSchema = z.object({
    since: z.string(),
    stages: z.array(ProductFunnelStageSchema),
    activeOrgs: z.number().int().nonnegative(),
});
/** An org's vendor-set spend-velocity ceiling — a HARD cap on credits burned
 *  per rolling window, enforced pre-flight by the metering proxy. A null field
 *  means "no override" ⇒ the proxy's env default applies. Set only by a platform
 *  admin (`admin_set_org_spend_limit`); the org reads it but can't raise it. */
export const OrgSpendLimitSchema = z.object({
    orgId: z.string().min(1),
    maxCreditsPerHour: z.number().int().positive().nullable(),
    maxCreditsPerDay: z.number().int().positive().nullable(),
    updatedAt: z.string(),
});
/** The platform-wide roll-up shown at the top of the console. */
export const PlatformSummarySchema = z.object({
    orgCount: z.number().int().nonnegative(),
    memberCount: z.number().int().nonnegative(),
    /** Orgs on a live (billed) subscription. */
    activeSubscriptions: z.number().int().nonnegative(),
    /** Monthly recurring revenue across all active orgs, in cents. */
    mrrCents: z.number().int().nonnegative(),
});
//# sourceMappingURL=platform.js.map