import { z } from 'zod';
/** The Art Bible (STYLE) fingerprint comparison behind a drift
 *  entry. Present when the sidecar was grounded in a Bible. */
export declare const BibleComparisonSchema: z.ZodObject<{
    /** Stored fingerprint (grounding record); null when un-stamped. */
    was: z.ZodNullable<z.ZodString>;
    /** Current fingerprint; null when the Bible is absent. */
    now: z.ZodNullable<z.ZodString>;
    changed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    changed: boolean;
    was: string | null;
    now: string | null;
}, {
    changed: boolean;
    was: string | null;
    now: string | null;
}>;
export type BibleComparison = z.infer<typeof BibleComparisonSchema>;
export declare const AssetDriftEntrySchema: z.ZodObject<{
    slot: z.ZodString;
    role: z.ZodEnum<["sprite", "texture", "ui", "concept", "model"]>;
    status: z.ZodEnum<["fresh", "drifted", "groundable", "orphaned", "ungrounded"]>;
    /** Per-card (SUBJECT) comparisons. */
    cards: z.ZodArray<z.ZodObject<{
        cardId: z.ZodString;
        resolved: z.ZodBoolean;
        was: z.ZodNullable<z.ZodString>;
        now: z.ZodNullable<z.ZodString>;
        changed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        changed: boolean;
        cardId: string;
        resolved: boolean;
        was: string | null;
        now: string | null;
    }, {
        changed: boolean;
        cardId: string;
        resolved: boolean;
        was: string | null;
        now: string | null;
    }>, "many">;
    /** Art Bible (STYLE) comparison; null when the image wasn't
     *  grounded in a Bible. */
    bible: z.ZodNullable<z.ZodObject<{
        /** Stored fingerprint (grounding record); null when un-stamped. */
        was: z.ZodNullable<z.ZodString>;
        /** Current fingerprint; null when the Bible is absent. */
        now: z.ZodNullable<z.ZodString>;
        changed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        changed: boolean;
        was: string | null;
        now: string | null;
    }, {
        changed: boolean;
        was: string | null;
        now: string | null;
    }>>;
    groundedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
    groundedAt: string | null;
    cards: {
        changed: boolean;
        cardId: string;
        resolved: boolean;
        was: string | null;
        now: string | null;
    }[];
    role: "ui" | "model" | "sprite" | "texture" | "concept";
    slot: string;
    bible: {
        changed: boolean;
        was: string | null;
        now: string | null;
    } | null;
}, {
    status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
    groundedAt: string | null;
    cards: {
        changed: boolean;
        cardId: string;
        resolved: boolean;
        was: string | null;
        now: string | null;
    }[];
    role: "ui" | "model" | "sprite" | "texture" | "concept";
    slot: string;
    bible: {
        changed: boolean;
        was: string | null;
        now: string | null;
    } | null;
}>;
export type AssetDriftEntry = z.infer<typeof AssetDriftEntrySchema>;
export declare const AssetDriftReportSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    generatedAt: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        slot: z.ZodString;
        role: z.ZodEnum<["sprite", "texture", "ui", "concept", "model"]>;
        status: z.ZodEnum<["fresh", "drifted", "groundable", "orphaned", "ungrounded"]>;
        /** Per-card (SUBJECT) comparisons. */
        cards: z.ZodArray<z.ZodObject<{
            cardId: z.ZodString;
            resolved: z.ZodBoolean;
            was: z.ZodNullable<z.ZodString>;
            now: z.ZodNullable<z.ZodString>;
            changed: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }, {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }>, "many">;
        /** Art Bible (STYLE) comparison; null when the image wasn't
         *  grounded in a Bible. */
        bible: z.ZodNullable<z.ZodObject<{
            /** Stored fingerprint (grounding record); null when un-stamped. */
            was: z.ZodNullable<z.ZodString>;
            /** Current fingerprint; null when the Bible is absent. */
            now: z.ZodNullable<z.ZodString>;
            changed: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            changed: boolean;
            was: string | null;
            now: string | null;
        }, {
            changed: boolean;
            was: string | null;
            now: string | null;
        }>>;
        groundedAt: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
        groundedAt: string | null;
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        role: "ui" | "model" | "sprite" | "texture" | "concept";
        slot: string;
        bible: {
            changed: boolean;
            was: string | null;
            now: string | null;
        } | null;
    }, {
        status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
        groundedAt: string | null;
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        role: "ui" | "model" | "sprite" | "texture" | "concept";
        slot: string;
        bible: {
            changed: boolean;
            was: string | null;
            now: string | null;
        } | null;
    }>, "many">;
    counts: z.ZodObject<{
        fresh: z.ZodNumber;
        drifted: z.ZodNumber;
        groundable: z.ZodNumber;
        orphaned: z.ZodNumber;
        ungrounded: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        fresh: number;
        drifted: number;
        groundable: number;
        orphaned: number;
        ungrounded: number;
    }, {
        fresh: number;
        drifted: number;
        groundable: number;
        orphaned: number;
        ungrounded: number;
    }>;
}, "strip", z.ZodTypeAny, {
    entries: {
        status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
        groundedAt: string | null;
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        role: "ui" | "model" | "sprite" | "texture" | "concept";
        slot: string;
        bible: {
            changed: boolean;
            was: string | null;
            now: string | null;
        } | null;
    }[];
    schemaVersion: 1;
    generatedAt: string;
    counts: {
        fresh: number;
        drifted: number;
        groundable: number;
        orphaned: number;
        ungrounded: number;
    };
}, {
    entries: {
        status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
        groundedAt: string | null;
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        role: "ui" | "model" | "sprite" | "texture" | "concept";
        slot: string;
        bible: {
            changed: boolean;
            was: string | null;
            now: string | null;
        } | null;
    }[];
    schemaVersion: 1;
    generatedAt: string;
    counts: {
        fresh: number;
        drifted: number;
        groundable: number;
        orphaned: number;
        ungrounded: number;
    };
}>;
export type AssetDriftReport = z.infer<typeof AssetDriftReportSchema>;
//# sourceMappingURL=assetDrift.d.ts.map