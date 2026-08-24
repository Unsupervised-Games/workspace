import { z } from 'zod';
/** Discriminated criterion for unlocking an achievement. Four
 *  kinds — see `@unsupervised/features/achievements` rules for the
 *  composition hierarchy. */
export declare const AchievementCriterionSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"stat-threshold">;
    statId: z.ZodString;
    threshold: z.ZodNumber;
    /** Default `'gte'` (most achievements: "kill at LEAST N").
     *  `'eq'` for exact-count achievements (rare); `'lte'` for
     *  "no more than N" achievements (e.g. "complete level
     *  taking ≤3 damage" via a damage-taken stat). */
    comparison: z.ZodOptional<z.ZodEnum<["gte", "eq", "lte"]>>;
}, "strip", z.ZodTypeAny, {
    kind: "stat-threshold";
    statId: string;
    threshold: number;
    comparison?: "gte" | "lte" | "eq" | undefined;
}, {
    kind: "stat-threshold";
    statId: string;
    threshold: number;
    comparison?: "gte" | "lte" | "eq" | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"event-fired">;
    eventName: z.ZodString;
    /** Optional registered predicate id. When omitted, ANY
     *  emit of the event unlocks the achievement. Apps use
     *  predicates to filter (e.g. "boss kill on hard
     *  difficulty only"). */
    predicateId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "event-fired";
    eventName: string;
    predicateId?: string | undefined;
}, {
    kind: "event-fired";
    eventName: string;
    predicateId?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"one-shot">;
}, "strip", z.ZodTypeAny, {
    kind: "one-shot";
}, {
    kind: "one-shot";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"meta">;
    /** Auto-unlocks when EVERY id in this list is unlocked
     *  on the same entity. Self-references are silently
     *  ignored (would never unlock). */
    requiredIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    kind: "meta";
    requiredIds: string[];
}, {
    kind: "meta";
    requiredIds: string[];
}>]>;
export type AchievementCriterion = z.infer<typeof AchievementCriterionSchema>;
/** A registered achievement definition. */
export declare const AchievementDefSchema: z.ZodObject<{
    id: z.ZodString;
    displayName: z.ZodString;
    description: z.ZodString;
    /** When true, the achievement is excluded from the profile
     *  UI until the player makes ANY progress on it (Steam-
     *  shape; the framework adds the id to `achievements.hiddenSeen`
     *  on first progress). Apps with strict
     *  hidden-until-unlocked semantics ignore the `hiddenSeen`
     *  set and only show unlocked. */
    hidden: z.ZodDefault<z.ZodBoolean>;
    criterion: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"stat-threshold">;
        statId: z.ZodString;
        threshold: z.ZodNumber;
        /** Default `'gte'` (most achievements: "kill at LEAST N").
         *  `'eq'` for exact-count achievements (rare); `'lte'` for
         *  "no more than N" achievements (e.g. "complete level
         *  taking ≤3 damage" via a damage-taken stat). */
        comparison: z.ZodOptional<z.ZodEnum<["gte", "eq", "lte"]>>;
    }, "strip", z.ZodTypeAny, {
        kind: "stat-threshold";
        statId: string;
        threshold: number;
        comparison?: "gte" | "lte" | "eq" | undefined;
    }, {
        kind: "stat-threshold";
        statId: string;
        threshold: number;
        comparison?: "gte" | "lte" | "eq" | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"event-fired">;
        eventName: z.ZodString;
        /** Optional registered predicate id. When omitted, ANY
         *  emit of the event unlocks the achievement. Apps use
         *  predicates to filter (e.g. "boss kill on hard
         *  difficulty only"). */
        predicateId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "event-fired";
        eventName: string;
        predicateId?: string | undefined;
    }, {
        kind: "event-fired";
        eventName: string;
        predicateId?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"one-shot">;
    }, "strip", z.ZodTypeAny, {
        kind: "one-shot";
    }, {
        kind: "one-shot";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"meta">;
        /** Auto-unlocks when EVERY id in this list is unlocked
         *  on the same entity. Self-references are silently
         *  ignored (would never unlock). */
        requiredIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        kind: "meta";
        requiredIds: string[];
    }, {
        kind: "meta";
        requiredIds: string[];
    }>]>;
    /** Optional reward data — pure JSON; apps interpret. The
     *  framework doesn't auto-deliver. Same posture as quest
     *  rewards. */
    rewards: z.ZodOptional<z.ZodObject<{
        points: z.ZodOptional<z.ZodNumber>;
        items: z.ZodOptional<z.ZodArray<z.ZodObject<{
            defId: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            defId: string;
            count: number;
        }, {
            defId: string;
            count: number;
        }>, "many">>;
        currency: z.ZodOptional<z.ZodNumber>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
        points?: number | undefined;
    }, {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
        points?: number | undefined;
    }>>;
    /** App-defined category tag (e.g. `'combat'`, `'story'`,
     *  `'collection'`). Framework treats as opaque; UIs group
     *  by it. */
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    displayName: string;
    hidden: boolean;
    criterion: {
        kind: "stat-threshold";
        statId: string;
        threshold: number;
        comparison?: "gte" | "lte" | "eq" | undefined;
    } | {
        kind: "event-fired";
        eventName: string;
        predicateId?: string | undefined;
    } | {
        kind: "one-shot";
    } | {
        kind: "meta";
        requiredIds: string[];
    };
    rewards?: {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
        points?: number | undefined;
    } | undefined;
    category?: string | undefined;
}, {
    description: string;
    id: string;
    displayName: string;
    criterion: {
        kind: "stat-threshold";
        statId: string;
        threshold: number;
        comparison?: "gte" | "lte" | "eq" | undefined;
    } | {
        kind: "event-fired";
        eventName: string;
        predicateId?: string | undefined;
    } | {
        kind: "one-shot";
    } | {
        kind: "meta";
        requiredIds: string[];
    };
    rewards?: {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
        points?: number | undefined;
    } | undefined;
    category?: string | undefined;
    hidden?: boolean | undefined;
}>;
export type AchievementDef = z.infer<typeof AchievementDefSchema>;
/** Reasons an unlock can be rejected. */
export declare const AchievementUnlockRejectionSchema: z.ZodEnum<["unknown-achievement", "already-unlocked", "no-tracker"]>;
export type AchievementUnlockRejection = z.infer<typeof AchievementUnlockRejectionSchema>;
/** Discriminated result for `unlockAchievement`. The success
 *  variant's `fresh` field distinguishes "first unlock" from
 *  "already unlocked, idempotent path." Mirrors
 *  `applyStatusEffect`'s `fresh` semantics. */
export declare const AchievementUnlockResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** Wall-clock or app-defined timestamp at unlock. */
    unlockedAt: z.ZodNumber;
    /** True when this call transitioned the achievement from
     *  locked to unlocked. False on the idempotent re-unlock
     *  path (already-unlocked is success, not rejection). */
    fresh: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    ok: true;
    unlockedAt: number;
    fresh: boolean;
}, {
    ok: true;
    unlockedAt: number;
    fresh: boolean;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["unknown-achievement", "already-unlocked", "no-tracker"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "unknown-achievement" | "already-unlocked" | "no-tracker";
}, {
    message: string;
    ok: false;
    reason: "unknown-achievement" | "already-unlocked" | "no-tracker";
}>]>;
export type AchievementUnlockResult = z.infer<typeof AchievementUnlockResultSchema>;
//# sourceMappingURL=achievement.d.ts.map