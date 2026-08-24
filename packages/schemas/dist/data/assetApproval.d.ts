import { z } from 'zod';
/** A human's decision on a generated asset. `approved` ⇒ pinned +
 *  locked (shipped); `rejected` ⇒ sent back for rework, with a note. */
export declare const AssetApprovalStateSchema: z.ZodEnum<["approved", "rejected"]>;
export type AssetApprovalState = z.infer<typeof AssetApprovalStateSchema>;
export declare const AssetApprovalEntrySchema: z.ZodObject<{
    /** Full assets-raw-relative slot (`models/characters/sora`). */
    slot: z.ZodString;
    kind: z.ZodEnum<["model", "image"]>;
    state: z.ZodEnum<["approved", "rejected"]>;
    /** ISO timestamp the decision was recorded. */
    decidedAt: z.ZodString;
    /** Reviewer rationale — required for `rejected` (what to fix),
     *  optional for `approved`. */
    note: z.ZodOptional<z.ZodString>;
    /** The RECIPE hash at decision time (intended-appearance inputs,
     *  no package version — same key the pin store uses). The queue
     *  compares this to the current recipe to flag a STALE approval:
     *  approved bytes whose recipe has since changed. */
    recipeHash: z.ZodString;
    /** The full cache hash at decision time (provenance). */
    fullHash: z.ZodString;
    /** Optional reviewer identity (email / handle). Free-form; the CLI
     *  fills it from `--by` or the git user when available. */
    by: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "model" | "image";
    slot: string;
    state: "approved" | "rejected";
    decidedAt: string;
    recipeHash: string;
    fullHash: string;
    note?: string | undefined;
    by?: string | undefined;
}, {
    kind: "model" | "image";
    slot: string;
    state: "approved" | "rejected";
    decidedAt: string;
    recipeHash: string;
    fullHash: string;
    note?: string | undefined;
    by?: string | undefined;
}>;
export type AssetApprovalEntry = z.infer<typeof AssetApprovalEntrySchema>;
/** The whole ledger. One entry per slot (latest decision wins — the
 *  store upserts by slot). */
export declare const AssetApprovalLedgerSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    entries: z.ZodArray<z.ZodObject<{
        /** Full assets-raw-relative slot (`models/characters/sora`). */
        slot: z.ZodString;
        kind: z.ZodEnum<["model", "image"]>;
        state: z.ZodEnum<["approved", "rejected"]>;
        /** ISO timestamp the decision was recorded. */
        decidedAt: z.ZodString;
        /** Reviewer rationale — required for `rejected` (what to fix),
         *  optional for `approved`. */
        note: z.ZodOptional<z.ZodString>;
        /** The RECIPE hash at decision time (intended-appearance inputs,
         *  no package version — same key the pin store uses). The queue
         *  compares this to the current recipe to flag a STALE approval:
         *  approved bytes whose recipe has since changed. */
        recipeHash: z.ZodString;
        /** The full cache hash at decision time (provenance). */
        fullHash: z.ZodString;
        /** Optional reviewer identity (email / handle). Free-form; the CLI
         *  fills it from `--by` or the git user when available. */
        by: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "model" | "image";
        slot: string;
        state: "approved" | "rejected";
        decidedAt: string;
        recipeHash: string;
        fullHash: string;
        note?: string | undefined;
        by?: string | undefined;
    }, {
        kind: "model" | "image";
        slot: string;
        state: "approved" | "rejected";
        decidedAt: string;
        recipeHash: string;
        fullHash: string;
        note?: string | undefined;
        by?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    entries: {
        kind: "model" | "image";
        slot: string;
        state: "approved" | "rejected";
        decidedAt: string;
        recipeHash: string;
        fullHash: string;
        note?: string | undefined;
        by?: string | undefined;
    }[];
    schemaVersion: 1;
}, {
    entries: {
        kind: "model" | "image";
        slot: string;
        state: "approved" | "rejected";
        decidedAt: string;
        recipeHash: string;
        fullHash: string;
        note?: string | undefined;
        by?: string | undefined;
    }[];
    schemaVersion: 1;
}>;
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
export declare const AssetSpendAuthorizationSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    /** USD ceiling this grant authorizes for a single run's cumulative
     *  spend. */
    maxUsd: z.ZodNumber;
    grantedAt: z.ZodString;
    /** ISO timestamp after which the grant is void. */
    expiresAt: z.ZodString;
    /** Who granted it (email / handle). */
    grantedBy: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    maxUsd: number;
    grantedAt: string;
    expiresAt: string;
    note?: string | undefined;
    grantedBy?: string | undefined;
}, {
    schemaVersion: 1;
    maxUsd: number;
    grantedAt: string;
    expiresAt: string;
    note?: string | undefined;
    grantedBy?: string | undefined;
}>;
export type AssetSpendAuthorization = z.infer<typeof AssetSpendAuthorizationSchema>;
//# sourceMappingURL=assetApproval.d.ts.map