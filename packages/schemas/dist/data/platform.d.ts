import { z } from 'zod';
/** One org, as the platform owner sees it across the whole tenant base. */
export declare const AdminOrgSummarySchema: z.ZodObject<{
    orgId: z.ZodString;
    name: z.ZodString;
    /** The owner's email (joined from profiles). */
    ownerEmail: z.ZodOptional<z.ZodString>;
    memberCount: z.ZodNumber;
    plan: z.ZodString;
    status: z.ZodEnum<["none", "active", "trialing", "past_due", "canceled", "incomplete"]>;
    seats: z.ZodNumber;
    /** Recurring amount this org pays per period, in cents (0 when free). */
    amountCents: z.ZodNumber;
    suspended: z.ZodBoolean;
    /** Vendor-granted content-moderation exemption: a trusted (adult/mature-rated)
     *  org bypasses the `sexual` prompt block + L2. CSAM is never exemptable. */
    moderationExempt: z.ZodBoolean;
    createdAt: z.ZodString;
    /** The org's vendor-set spend-velocity ceiling (null ⇒ the proxy default) —
     *  shown + editable per org in the console. */
    maxCreditsPerHour: z.ZodNullable<z.ZodNumber>;
    maxCreditsPerDay: z.ZodNullable<z.ZodNumber>;
    /** Credits this org has burned in the last 24h — the ops outlier signal
     *  (surfaces a fast burner before its velocity cap even trips). */
    spend24hCredits: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "active" | "none" | "trialing" | "past_due" | "canceled" | "incomplete";
    name: string;
    createdAt: string;
    orgId: string;
    plan: string;
    seats: number;
    maxCreditsPerHour: number | null;
    maxCreditsPerDay: number | null;
    memberCount: number;
    amountCents: number;
    suspended: boolean;
    moderationExempt: boolean;
    spend24hCredits: number;
    ownerEmail?: string | undefined;
}, {
    status: "active" | "none" | "trialing" | "past_due" | "canceled" | "incomplete";
    name: string;
    createdAt: string;
    orgId: string;
    plan: string;
    seats: number;
    maxCreditsPerHour: number | null;
    maxCreditsPerDay: number | null;
    memberCount: number;
    amountCents: number;
    suspended: boolean;
    moderationExempt: boolean;
    spend24hCredits: number;
    ownerEmail?: string | undefined;
}>;
export type AdminOrgSummary = z.infer<typeof AdminOrgSummarySchema>;
/** One vendor's realized unit-economics over a window — the credits customers
 *  consumed against it (revenue at the sell price) vs the raw vendor cost. The
 *  `vendor` `'all'` row is the summed total. */
export declare const VendorMarginSchema: z.ZodObject<{
    vendor: z.ZodString;
    debitCredits: z.ZodNumber;
    revenueUsd: z.ZodNumber;
    vendorCostUsd: z.ZodNumber;
    marginUsd: z.ZodNumber;
    /** marginUsd / revenueUsd, in [.., 1]; 0 when there's no revenue. */
    marginPct: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    vendorCostUsd: number;
    vendor: string;
    debitCredits: number;
    revenueUsd: number;
    marginUsd: number;
    marginPct: number;
}, {
    vendorCostUsd: number;
    vendor: string;
    debitCredits: number;
    revenueUsd: number;
    marginUsd: number;
    marginPct: number;
}>;
export type VendorMargin = z.infer<typeof VendorMarginSchema>;
/** The platform-wide credit scoreboard: per-vendor margin + the total + the
 *  outstanding-credit liability (paid-for but unspent credits = deferred
 *  revenue). Cross-tenant — platform-admin only. */
export declare const CreditEconomicsSchema: z.ZodObject<{
    /** ISO lower bound of the margin window (liability is point-in-time). */
    since: z.ZodString;
    vendors: z.ZodArray<z.ZodObject<{
        vendor: z.ZodString;
        debitCredits: z.ZodNumber;
        revenueUsd: z.ZodNumber;
        vendorCostUsd: z.ZodNumber;
        marginUsd: z.ZodNumber;
        /** marginUsd / revenueUsd, in [.., 1]; 0 when there's no revenue. */
        marginPct: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    }, {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    }>, "many">;
    total: z.ZodObject<{
        vendor: z.ZodString;
        debitCredits: z.ZodNumber;
        revenueUsd: z.ZodNumber;
        vendorCostUsd: z.ZodNumber;
        marginUsd: z.ZodNumber;
        /** marginUsd / revenueUsd, in [.., 1]; 0 when there's no revenue. */
        marginPct: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    }, {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    }>;
    liabilityCredits: z.ZodNumber;
    liabilityUsd: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    };
    since: string;
    vendors: {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    }[];
    liabilityCredits: number;
    liabilityUsd: number;
}, {
    total: {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    };
    since: string;
    vendors: {
        vendorCostUsd: number;
        vendor: string;
        debitCredits: number;
        revenueUsd: number;
        marginUsd: number;
        marginPct: number;
    }[];
    liabilityCredits: number;
    liabilityUsd: number;
}>;
export type CreditEconomics = z.infer<typeof CreditEconomicsSchema>;
/** One proxy-recorded charge: a successful vendor call that SHOULD be debited,
 *  keyed by the run id shared with the ledger debit. */
export declare const ProxyChargeRecordSchema: z.ZodObject<{
    idempotencyKey: z.ZodString;
    orgId: z.ZodString;
    vendor: z.ZodString;
    credits: z.ZodNumber;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    orgId: string;
    credits: number;
    idempotencyKey: string;
    vendor: string;
}, {
    createdAt: string;
    orgId: string;
    credits: number;
    idempotencyKey: string;
    vendor: string;
}>;
export type ProxyChargeRecord = z.infer<typeof ProxyChargeRecordSchema>;
/** Money-path integrity report: proxy charges with no matching ledger debit —
 *  the vendor-charged-but-not-debited LEAK — summed + grouped by vendor. A clean
 *  run has `unmatchedCount` 0. Cross-tenant — platform-admin only. */
export declare const ReconciliationReportSchema: z.ZodObject<{
    since: z.ZodString;
    unmatchedCount: z.ZodNumber;
    leakCredits: z.ZodNumber;
    leakUsd: z.ZodNumber;
    byVendor: z.ZodArray<z.ZodObject<{
        vendor: z.ZodString;
        count: z.ZodNumber;
        credits: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        count: number;
        credits: number;
        vendor: string;
    }, {
        count: number;
        credits: number;
        vendor: string;
    }>, "many">;
    /** A bounded sample of the offending charges, newest-first, for the drill-in. */
    samples: z.ZodArray<z.ZodObject<{
        idempotencyKey: z.ZodString;
        orgId: z.ZodString;
        vendor: z.ZodString;
        credits: z.ZodNumber;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        createdAt: string;
        orgId: string;
        credits: number;
        idempotencyKey: string;
        vendor: string;
    }, {
        createdAt: string;
        orgId: string;
        credits: number;
        idempotencyKey: string;
        vendor: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    samples: {
        createdAt: string;
        orgId: string;
        credits: number;
        idempotencyKey: string;
        vendor: string;
    }[];
    since: string;
    unmatchedCount: number;
    leakCredits: number;
    leakUsd: number;
    byVendor: {
        count: number;
        credits: number;
        vendor: string;
    }[];
}, {
    samples: {
        createdAt: string;
        orgId: string;
        credits: number;
        idempotencyKey: string;
        vendor: string;
    }[];
    since: string;
    unmatchedCount: number;
    leakCredits: number;
    leakUsd: number;
    byVendor: {
        count: number;
        credits: number;
        vendor: string;
    }[];
}>;
export type ReconciliationReport = z.infer<typeof ReconciliationReportSchema>;
/** One blocked generation prompt (content moderation) — the abuse signal the
 *  vendor console surfaces per org. Cross-tenant; platform-admin only. */
export declare const ModerationEventSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    vendor: z.ZodString;
    /** Which layer blocked it: the deterministic L1 gate or the semantic L2 classifier. */
    layer: z.ZodEnum<["l1", "l2"]>;
    categories: z.ZodArray<z.ZodString, "many">;
    /** A short, truncated excerpt of the offending prompt (context for review — not
     *  the full text). */
    excerpt: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    layer: "l1" | "l2";
    orgId: string;
    vendor: string;
    categories: string[];
    excerpt: string;
    userId?: string | undefined;
}, {
    id: string;
    createdAt: string;
    layer: "l1" | "l2";
    orgId: string;
    vendor: string;
    categories: string[];
    excerpt: string;
    userId?: string | undefined;
}>;
export type ModerationEvent = z.infer<typeof ModerationEventSchema>;
/** A vendor's ACTUAL billed cost over a period, from its real usage/invoice
 *  export — the ground truth the ledger's metered estimate is checked against. */
export declare const VendorActualCostSchema: z.ZodObject<{
    vendor: z.ZodString;
    actualUsd: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    vendor: string;
    actualUsd: number;
}, {
    vendor: string;
    actualUsd: number;
}>;
export type VendorActualCost = z.infer<typeof VendorActualCostSchema>;
/** One vendor's estimate-vs-actual cost variance. `varianceUsd` = actual −
 *  estimated: POSITIVE means the ledger UNDER-metered (the real vendor bill
 *  exceeds what was charged for → margin erosion); negative means it
 *  over-metered. This corrects Phase 2's estimate-based margin to actual. */
export declare const VendorCostVarianceSchema: z.ZodObject<{
    vendor: z.ZodString;
    estimatedUsd: z.ZodNumber;
    actualUsd: z.ZodNumber;
    varianceUsd: z.ZodNumber;
    variancePct: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    vendor: string;
    actualUsd: number;
    estimatedUsd: number;
    varianceUsd: number;
    variancePct: number;
}, {
    vendor: string;
    actualUsd: number;
    estimatedUsd: number;
    varianceUsd: number;
    variancePct: number;
}>;
export type VendorCostVariance = z.infer<typeof VendorCostVarianceSchema>;
/** Estimate-vs-actual across every vendor + an `'all'` total. Vendors present in
 *  only one side surface too (an actual-only vendor = untracked spend). */
export declare const VendorInvoiceReconciliationSchema: z.ZodObject<{
    vendors: z.ZodArray<z.ZodObject<{
        vendor: z.ZodString;
        estimatedUsd: z.ZodNumber;
        actualUsd: z.ZodNumber;
        varianceUsd: z.ZodNumber;
        variancePct: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    }, {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    }>, "many">;
    total: z.ZodObject<{
        vendor: z.ZodString;
        estimatedUsd: z.ZodNumber;
        actualUsd: z.ZodNumber;
        varianceUsd: z.ZodNumber;
        variancePct: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    }, {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    }>;
}, "strip", z.ZodTypeAny, {
    total: {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    };
    vendors: {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    }[];
}, {
    total: {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    };
    vendors: {
        vendor: string;
        actualUsd: number;
        estimatedUsd: number;
        varianceUsd: number;
        variancePct: number;
    }[];
}>;
export type VendorInvoiceReconciliation = z.infer<typeof VendorInvoiceReconciliationSchema>;
/** One activation stage: total events + the distinct-entity count (distinct
 *  USERS for `signin`, distinct ORGS for the rest) + its share of signed-in
 *  users. A participation view across the funnel, not strict sequential
 *  conversion (a user may invite before generating). */
export declare const ProductFunnelStageSchema: z.ZodObject<{
    event: z.ZodString;
    label: z.ZodString;
    total: z.ZodNumber;
    distinct: z.ZodNumber;
    /** `distinct / signin-distinct` (signin itself = 1). 0 when there are no signins. */
    shareOfSignins: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    label: string;
    event: string;
    total: number;
    distinct: number;
    shareOfSignins: number;
}, {
    label: string;
    event: string;
    total: number;
    distinct: number;
    shareOfSignins: number;
}>;
export type ProductFunnelStage = z.infer<typeof ProductFunnelStageSchema>;
/** The vendor's activation funnel over a window — ordered stages (signin →
 *  org.created → generation.run → member.invited → plan.upgraded) + the count of
 *  orgs that actually ran a generation. Cross-tenant, platform-admin only. */
export declare const ProductFunnelSchema: z.ZodObject<{
    since: z.ZodString;
    stages: z.ZodArray<z.ZodObject<{
        event: z.ZodString;
        label: z.ZodString;
        total: z.ZodNumber;
        distinct: z.ZodNumber;
        /** `distinct / signin-distinct` (signin itself = 1). 0 when there are no signins. */
        shareOfSignins: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        event: string;
        total: number;
        distinct: number;
        shareOfSignins: number;
    }, {
        label: string;
        event: string;
        total: number;
        distinct: number;
        shareOfSignins: number;
    }>, "many">;
    activeOrgs: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    since: string;
    stages: {
        label: string;
        event: string;
        total: number;
        distinct: number;
        shareOfSignins: number;
    }[];
    activeOrgs: number;
}, {
    since: string;
    stages: {
        label: string;
        event: string;
        total: number;
        distinct: number;
        shareOfSignins: number;
    }[];
    activeOrgs: number;
}>;
export type ProductFunnel = z.infer<typeof ProductFunnelSchema>;
/** An org's vendor-set spend-velocity ceiling — a HARD cap on credits burned
 *  per rolling window, enforced pre-flight by the metering proxy. A null field
 *  means "no override" ⇒ the proxy's env default applies. Set only by a platform
 *  admin (`admin_set_org_spend_limit`); the org reads it but can't raise it. */
export declare const OrgSpendLimitSchema: z.ZodObject<{
    orgId: z.ZodString;
    maxCreditsPerHour: z.ZodNullable<z.ZodNumber>;
    maxCreditsPerDay: z.ZodNullable<z.ZodNumber>;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    updatedAt: string;
    maxCreditsPerHour: number | null;
    maxCreditsPerDay: number | null;
}, {
    orgId: string;
    updatedAt: string;
    maxCreditsPerHour: number | null;
    maxCreditsPerDay: number | null;
}>;
export type OrgSpendLimit = z.infer<typeof OrgSpendLimitSchema>;
/** The platform-wide roll-up shown at the top of the console. */
export declare const PlatformSummarySchema: z.ZodObject<{
    orgCount: z.ZodNumber;
    memberCount: z.ZodNumber;
    /** Orgs on a live (billed) subscription. */
    activeSubscriptions: z.ZodNumber;
    /** Monthly recurring revenue across all active orgs, in cents. */
    mrrCents: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    memberCount: number;
    orgCount: number;
    activeSubscriptions: number;
    mrrCents: number;
}, {
    memberCount: number;
    orgCount: number;
    activeSubscriptions: number;
    mrrCents: number;
}>;
export type PlatformSummary = z.infer<typeof PlatformSummarySchema>;
//# sourceMappingURL=platform.d.ts.map