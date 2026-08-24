import { z } from 'zod';
/** A human's decision on a generated audio asset. `approved` ⇒ locked
 *  (shipped); `rejected` ⇒ sent back for rework, with a note. */
export declare const AudioApprovalStateSchema: z.ZodEnum<["approved", "rejected"]>;
export type AudioApprovalState = z.infer<typeof AudioApprovalStateSchema>;
export declare const AudioApprovalEntrySchema: z.ZodObject<{
    /** `<kind>/<slot>` id (e.g. `voice/sora-opening`). */
    slot: z.ZodString;
    kind: z.ZodEnum<["voice", "sfx", "music"]>;
    state: z.ZodEnum<["approved", "rejected"]>;
    decidedAt: z.ZodString;
    /** Reviewer rationale — required for `rejected`, optional for
     *  `approved`. */
    note: z.ZodOptional<z.ZodString>;
    /** The RECIPE hash at decision time. Audio has one content hash
     *  (`computeHash`, package-version-baked), so `recipeHash` +
     *  `fullHash` carry it identically until a version-stripped recipe
     *  hash lands with pinning; the queue compares it to the current
     *  hash to flag a STALE approval. */
    recipeHash: z.ZodString;
    fullHash: z.ZodString;
    /** Optional reviewer identity (email / handle). */
    by: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "music" | "sfx" | "voice";
    slot: string;
    state: "approved" | "rejected";
    decidedAt: string;
    recipeHash: string;
    fullHash: string;
    note?: string | undefined;
    by?: string | undefined;
}, {
    kind: "music" | "sfx" | "voice";
    slot: string;
    state: "approved" | "rejected";
    decidedAt: string;
    recipeHash: string;
    fullHash: string;
    note?: string | undefined;
    by?: string | undefined;
}>;
export type AudioApprovalEntry = z.infer<typeof AudioApprovalEntrySchema>;
/** The whole ledger. One entry per slot (latest decision wins — the
 *  store upserts by slot). */
export declare const AudioApprovalLedgerSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    entries: z.ZodArray<z.ZodObject<{
        /** `<kind>/<slot>` id (e.g. `voice/sora-opening`). */
        slot: z.ZodString;
        kind: z.ZodEnum<["voice", "sfx", "music"]>;
        state: z.ZodEnum<["approved", "rejected"]>;
        decidedAt: z.ZodString;
        /** Reviewer rationale — required for `rejected`, optional for
         *  `approved`. */
        note: z.ZodOptional<z.ZodString>;
        /** The RECIPE hash at decision time. Audio has one content hash
         *  (`computeHash`, package-version-baked), so `recipeHash` +
         *  `fullHash` carry it identically until a version-stripped recipe
         *  hash lands with pinning; the queue compares it to the current
         *  hash to flag a STALE approval. */
        recipeHash: z.ZodString;
        fullHash: z.ZodString;
        /** Optional reviewer identity (email / handle). */
        by: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "music" | "sfx" | "voice";
        slot: string;
        state: "approved" | "rejected";
        decidedAt: string;
        recipeHash: string;
        fullHash: string;
        note?: string | undefined;
        by?: string | undefined;
    }, {
        kind: "music" | "sfx" | "voice";
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
        kind: "music" | "sfx" | "voice";
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
        kind: "music" | "sfx" | "voice";
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
export type AudioApprovalLedger = z.infer<typeof AudioApprovalLedgerSchema>;
//# sourceMappingURL=audioApproval.d.ts.map