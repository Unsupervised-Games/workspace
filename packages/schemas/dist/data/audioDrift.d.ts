import { z } from 'zod';
/** Per-sidecar drift status. Two directions of staleness:
 *    - `drifted`    — a card this line was GROUNDED in has changed
 *      since (its content fingerprint no longer matches).
 *    - `groundable` — a card this line INFERRED (no card at
 *      grounding time) now exists on disk — re-ground for fidelity.
 *  Plus the terminal / neutral states:
 *    - `fresh`      — every resolved card's fingerprint matches.
 *    - `orphaned`   — a grounded card was deleted / renamed away.
 *    - `ungrounded` — the sidecar has no grounding record (never
 *      run through `narrative-audio-direction`). Informational. */
export declare const DriftStatusSchema: z.ZodEnum<["fresh", "drifted", "groundable", "orphaned", "ungrounded"]>;
export type DriftStatus = z.infer<typeof DriftStatusSchema>;
/** Per-card comparison detail behind a drift entry. */
export declare const DriftCardComparisonSchema: z.ZodObject<{
    cardId: z.ZodString;
    /** Whether a card was resolved at grounding time. */
    resolved: z.ZodBoolean;
    /** Stored fingerprint (from the grounding record); null when
     *  un-stamped or unresolved. */
    was: z.ZodNullable<z.ZodString>;
    /** Current fingerprint; null when the card file is absent. */
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
}>;
export type DriftCardComparison = z.infer<typeof DriftCardComparisonSchema>;
/** One sidecar's drift verdict + the per-card detail behind it. */
export declare const DriftEntrySchema: z.ZodObject<{
    slot: z.ZodString;
    kind: z.ZodEnum<["voice", "sfx", "music"]>;
    status: z.ZodEnum<["fresh", "drifted", "groundable", "orphaned", "ungrounded"]>;
    cards: z.ZodArray<z.ZodObject<{
        cardId: z.ZodString;
        /** Whether a card was resolved at grounding time. */
        resolved: z.ZodBoolean;
        /** Stored fingerprint (from the grounding record); null when
         *  un-stamped or unresolved. */
        was: z.ZodNullable<z.ZodString>;
        /** Current fingerprint; null when the card file is absent. */
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
    /** Which fields the grounding record marked (what a re-ground
     *  would rewrite). */
    fields: z.ZodArray<z.ZodEnum<["prompt", "text"]>, "many">;
    /** When the sidecar was last grounded; null when ungrounded. */
    groundedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
    kind: "music" | "sfx" | "voice";
    groundedAt: string | null;
    fields: ("text" | "prompt")[];
    cards: {
        changed: boolean;
        cardId: string;
        resolved: boolean;
        was: string | null;
        now: string | null;
    }[];
    slot: string;
}, {
    status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
    kind: "music" | "sfx" | "voice";
    groundedAt: string | null;
    fields: ("text" | "prompt")[];
    cards: {
        changed: boolean;
        cardId: string;
        resolved: boolean;
        was: string | null;
        now: string | null;
    }[];
    slot: string;
}>;
export type DriftEntry = z.infer<typeof DriftEntrySchema>;
/** The full report — every discovered sidecar + a status rollup.
 *  Persisted to `<game>/.audio-gen-drift.json`. */
export declare const DriftReportSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    generatedAt: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        slot: z.ZodString;
        kind: z.ZodEnum<["voice", "sfx", "music"]>;
        status: z.ZodEnum<["fresh", "drifted", "groundable", "orphaned", "ungrounded"]>;
        cards: z.ZodArray<z.ZodObject<{
            cardId: z.ZodString;
            /** Whether a card was resolved at grounding time. */
            resolved: z.ZodBoolean;
            /** Stored fingerprint (from the grounding record); null when
             *  un-stamped or unresolved. */
            was: z.ZodNullable<z.ZodString>;
            /** Current fingerprint; null when the card file is absent. */
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
        /** Which fields the grounding record marked (what a re-ground
         *  would rewrite). */
        fields: z.ZodArray<z.ZodEnum<["prompt", "text"]>, "many">;
        /** When the sidecar was last grounded; null when ungrounded. */
        groundedAt: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
        kind: "music" | "sfx" | "voice";
        groundedAt: string | null;
        fields: ("text" | "prompt")[];
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        slot: string;
    }, {
        status: "fresh" | "drifted" | "groundable" | "orphaned" | "ungrounded";
        kind: "music" | "sfx" | "voice";
        groundedAt: string | null;
        fields: ("text" | "prompt")[];
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        slot: string;
    }>, "many">;
    /** Count per status, for a quick summary line. Every status is
     *  always present (0 when none) so consumers needn't guard. */
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
        kind: "music" | "sfx" | "voice";
        groundedAt: string | null;
        fields: ("text" | "prompt")[];
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        slot: string;
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
        kind: "music" | "sfx" | "voice";
        groundedAt: string | null;
        fields: ("text" | "prompt")[];
        cards: {
            changed: boolean;
            cardId: string;
            resolved: boolean;
            was: string | null;
            now: string | null;
        }[];
        slot: string;
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
export type DriftReport = z.infer<typeof DriftReportSchema>;
//# sourceMappingURL=audioDrift.d.ts.map