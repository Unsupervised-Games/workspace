import { z } from 'zod';
/** The org's cross-pipeline generation budget — the shared, owner-set twin of
 *  `gen-governance.config.json`. Raisable by any holder of the `spend:authorize`
 *  capability (owner / admin); enforced server-side by RLS + the
 *  `set_org_budget` RPC. A raisable ceiling is the team primitive — there is no
 *  org-level expiring propose-approve grant (that stays a per-workspace CLI
 *  concern). */
export declare const OrgBudgetSchema: z.ZodObject<{
    orgId: z.ZodString;
    /** Cross-pipeline lifetime ceiling (USD) — cumulative across every member's
     *  every run of every pipeline. Undefined ⇒ no ceiling (visibility only). */
    lifetimeUsd: z.ZodOptional<z.ZodNumber>;
    /** Sync this flag down into each member's local config so billed generation
     *  requires a per-workspace authorization grant. Off by default. */
    requireAuthorization: z.ZodDefault<z.ZodBoolean>;
    /** auth user id of whoever last set the budget. */
    updatedBy: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    requireAuthorization: boolean;
    orgId: string;
    updatedAt: string;
    updatedBy: string;
    lifetimeUsd?: number | undefined;
}, {
    orgId: string;
    updatedAt: string;
    updatedBy: string;
    lifetimeUsd?: number | undefined;
    requireAuthorization?: boolean | undefined;
}>;
export type OrgBudget = z.infer<typeof OrgBudgetSchema>;
/** One normalized spend record in the shared org ledger — a single member's
 *  single billed generation, reconciled up from their local audit log. */
export declare const SpendLedgerRowSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    /** auth user id of the member who incurred the spend. */
    userId: z.ZodString;
    pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
    costUsd: z.ZodNumber;
    /** ISO timestamp the generation occurred (the source row's `ts` / `at`). */
    occurredAt: z.ZodString;
    /** One-line human label (`model · goblin`, `ja · 12 keys`). */
    detail: z.ZodString;
    /** The source row's `source` (`fresh` / `cache` / `locked` / …). */
    source: z.ZodOptional<z.ZodString>;
    /** Idempotency key `"<logFilename>#<lineIndex>"` — audit logs are
     *  append-only, so the (member, localKey) pair is stable across
     *  re-reconciliation. The backing store dedups on `(orgId, userId, localKey)`. */
    localKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    costUsd: number;
    pipeline: "code" | "audio" | "asset" | "loc";
    detail: string;
    orgId: string;
    userId: string;
    occurredAt: string;
    localKey: string;
    source?: string | undefined;
}, {
    id: string;
    costUsd: number;
    pipeline: "code" | "audio" | "asset" | "loc";
    detail: string;
    orgId: string;
    userId: string;
    occurredAt: string;
    localKey: string;
    source?: string | undefined;
}>;
export type SpendLedgerRow = z.infer<typeof SpendLedgerRowSchema>;
/** A new ledger row as reported by a member (the store assigns `id` / `userId`). */
export declare const NewSpendRowSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    orgId: z.ZodString;
    /** auth user id of the member who incurred the spend. */
    userId: z.ZodString;
    pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
    costUsd: z.ZodNumber;
    /** ISO timestamp the generation occurred (the source row's `ts` / `at`). */
    occurredAt: z.ZodString;
    /** One-line human label (`model · goblin`, `ja · 12 keys`). */
    detail: z.ZodString;
    /** The source row's `source` (`fresh` / `cache` / `locked` / …). */
    source: z.ZodOptional<z.ZodString>;
    /** Idempotency key `"<logFilename>#<lineIndex>"` — audit logs are
     *  append-only, so the (member, localKey) pair is stable across
     *  re-reconciliation. The backing store dedups on `(orgId, userId, localKey)`. */
    localKey: z.ZodString;
}, "id" | "orgId" | "userId">, "strip", z.ZodTypeAny, {
    costUsd: number;
    pipeline: "code" | "audio" | "asset" | "loc";
    detail: string;
    occurredAt: string;
    localKey: string;
    source?: string | undefined;
}, {
    costUsd: number;
    pipeline: "code" | "audio" | "asset" | "loc";
    detail: string;
    occurredAt: string;
    localKey: string;
    source?: string | undefined;
}>;
export type NewSpendRow = z.infer<typeof NewSpendRowSchema>;
/** Per-pipeline rollup within the org report. */
export declare const OrgPipelineSpendSchema: z.ZodObject<{
    pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
    label: z.ZodString;
    totalUsd: z.ZodNumber;
    billedEntries: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    label: string;
    pipeline: "code" | "audio" | "asset" | "loc";
    totalUsd: number;
    billedEntries: number;
}, {
    label: string;
    pipeline: "code" | "audio" | "asset" | "loc";
    totalUsd: number;
    billedEntries: number;
}>;
export type OrgPipelineSpend = z.infer<typeof OrgPipelineSpendSchema>;
/** Per-member rollup within the org report. */
export declare const OrgMemberSpendSchema: z.ZodObject<{
    userId: z.ZodString;
    /** Resolved display email when a profile is known. */
    email: z.ZodOptional<z.ZodString>;
    totalUsd: z.ZodNumber;
    billedEntries: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalUsd: number;
    billedEntries: number;
    userId: string;
    email?: string | undefined;
}, {
    totalUsd: number;
    billedEntries: number;
    userId: string;
    email?: string | undefined;
}>;
export type OrgMemberSpend = z.infer<typeof OrgMemberSpendSchema>;
/** The aggregate team-spend view for one org. */
export declare const OrgSpendReportSchema: z.ZodObject<{
    totalUsd: z.ZodNumber;
    byPipeline: z.ZodArray<z.ZodObject<{
        pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
        label: z.ZodString;
        totalUsd: z.ZodNumber;
        billedEntries: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
    }, {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
    }>, "many">;
    byMember: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        /** Resolved display email when a profile is known. */
        email: z.ZodOptional<z.ZodString>;
        totalUsd: z.ZodNumber;
        billedEntries: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalUsd: number;
        billedEntries: number;
        userId: string;
        email?: string | undefined;
    }, {
        totalUsd: number;
        billedEntries: number;
        userId: string;
        email?: string | undefined;
    }>, "many">;
    budget: z.ZodNullable<z.ZodObject<{
        orgId: z.ZodString;
        /** Cross-pipeline lifetime ceiling (USD) — cumulative across every member's
         *  every run of every pipeline. Undefined ⇒ no ceiling (visibility only). */
        lifetimeUsd: z.ZodOptional<z.ZodNumber>;
        /** Sync this flag down into each member's local config so billed generation
         *  requires a per-workspace authorization grant. Off by default. */
        requireAuthorization: z.ZodDefault<z.ZodBoolean>;
        /** auth user id of whoever last set the budget. */
        updatedBy: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        requireAuthorization: boolean;
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
    }, {
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
        requireAuthorization?: boolean | undefined;
    }>>;
    /** Headroom under the budget (`lifetimeUsd - totalUsd`, floored at 0), when a
     *  ceiling is set. */
    remainingUsd: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    totalUsd: number;
    byPipeline: {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
    }[];
    byMember: {
        totalUsd: number;
        billedEntries: number;
        userId: string;
        email?: string | undefined;
    }[];
    budget: {
        requireAuthorization: boolean;
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
    } | null;
    remainingUsd?: number | undefined;
}, {
    totalUsd: number;
    byPipeline: {
        label: string;
        pipeline: "code" | "audio" | "asset" | "loc";
        totalUsd: number;
        billedEntries: number;
    }[];
    byMember: {
        totalUsd: number;
        billedEntries: number;
        userId: string;
        email?: string | undefined;
    }[];
    budget: {
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
        requireAuthorization?: boolean | undefined;
    } | null;
    remainingUsd?: number | undefined;
}>;
export type OrgSpendReport = z.infer<typeof OrgSpendReportSchema>;
//# sourceMappingURL=orgSpend.d.ts.map