import { z } from 'zod';
/** Step kinds. The first four are auto-progressed by the
 *  quest module's bus subscriptions; `'app-defined'` is the
 *  escape hatch. */
export declare const QuestStepSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"collect-items">;
    description: z.ZodString;
    /** Item def id to collect. Counted via
     *  `'inventory:transaction-applied'`; only ADD ops increment
     *  (REMOVE / MOVE don't decrement — the bookkeeping would
     *  oscillate against player loot management). */
    itemDefId: z.ZodString;
    targetCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    description: string;
    kind: "collect-items";
    itemDefId: string;
    targetCount: number;
}, {
    description: string;
    kind: "collect-items";
    itemDefId: string;
    targetCount: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"kill-targets">;
    description: z.ZodString;
    /** Tag matched against the killed entity. Apps register a
     *  per-tag matcher predicate via `registerKillTargetMatcher`
     *  (e.g., "this kill counts toward 'goblin' tag if
     *  `entity.spawnedBy?.spawnerId === 'goblin-spawner'`"). */
    targetTag: z.ZodString;
    targetCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    description: string;
    kind: "kill-targets";
    targetCount: number;
    targetTag: string;
}, {
    description: string;
    kind: "kill-targets";
    targetCount: number;
    targetTag: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"reach-tile">;
    description: z.ZodString;
    coord: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
}, "strip", z.ZodTypeAny, {
    description: string;
    kind: "reach-tile";
    coord: {
        x: number;
        y: number;
    };
}, {
    description: string;
    kind: "reach-tile";
    coord: {
        x: number;
        y: number;
    };
}>, z.ZodObject<{
    kind: z.ZodLiteral<"dialogue-completed">;
    description: z.ZodString;
    dialogueId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    kind: "dialogue-completed";
    dialogueId: string;
}, {
    description: string;
    kind: "dialogue-completed";
    dialogueId: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"event-fired">;
    description: z.ZodString;
    /** Bus event name to subscribe to. */
    eventName: z.ZodString;
    /** Optional registered predicate id; the system invokes the
     *  predicate against the event payload + entity. If absent,
     *  ANY emit of the event progresses the step. */
    predicateId: z.ZodOptional<z.ZodString>;
    targetCount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    description: string;
    kind: "event-fired";
    targetCount: number;
    eventName: string;
    predicateId?: string | undefined;
}, {
    description: string;
    kind: "event-fired";
    eventName: string;
    targetCount?: number | undefined;
    predicateId?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"app-defined">;
    description: z.ZodString;
    /** Custom kind tag — apps register a handler via
     *  `registerQuestStepHandler(customKind, fn)`. */
    customKind: z.ZodString;
    payload: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    description: string;
    kind: "app-defined";
    customKind: string;
    payload?: unknown;
}, {
    description: string;
    kind: "app-defined";
    customKind: string;
    payload?: unknown;
}>]>;
export type QuestStep = z.infer<typeof QuestStepSchema>;
/** The runtime-contract version of the QuestDef shape — bump when the SHAPE
 *  changes (a new step kind / field), not when a quest's content changes.
 *  `narrative compile` stamps it into emitted `.quest.json`. See
 *  docs/specs/runtime-conformance.md. */
export declare const QUEST_DEF_VERSION = 1;
/** A quest definition. Multi-step linear progression for v1
 *  (branching is in OUT_OF_SCOPE). Steps progress in order;
 *  the next step becomes active when the current one
 *  completes. */
export declare const QuestDefSchema: z.ZodObject<{
    /** Contract version (`QUEST_DEF_VERSION`). Optional so existing data parses
     *  unchanged; `narrative compile` stamps it. */
    version: z.ZodOptional<z.ZodNumber>;
    id: z.ZodString;
    displayName: z.ZodString;
    description: z.ZodString;
    steps: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"collect-items">;
        description: z.ZodString;
        /** Item def id to collect. Counted via
         *  `'inventory:transaction-applied'`; only ADD ops increment
         *  (REMOVE / MOVE don't decrement — the bookkeeping would
         *  oscillate against player loot management). */
        itemDefId: z.ZodString;
        targetCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        description: string;
        kind: "collect-items";
        itemDefId: string;
        targetCount: number;
    }, {
        description: string;
        kind: "collect-items";
        itemDefId: string;
        targetCount: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"kill-targets">;
        description: z.ZodString;
        /** Tag matched against the killed entity. Apps register a
         *  per-tag matcher predicate via `registerKillTargetMatcher`
         *  (e.g., "this kill counts toward 'goblin' tag if
         *  `entity.spawnedBy?.spawnerId === 'goblin-spawner'`"). */
        targetTag: z.ZodString;
        targetCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        description: string;
        kind: "kill-targets";
        targetCount: number;
        targetTag: string;
    }, {
        description: string;
        kind: "kill-targets";
        targetCount: number;
        targetTag: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"reach-tile">;
        description: z.ZodString;
        coord: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        kind: "reach-tile";
        coord: {
            x: number;
            y: number;
        };
    }, {
        description: string;
        kind: "reach-tile";
        coord: {
            x: number;
            y: number;
        };
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"dialogue-completed">;
        description: z.ZodString;
        dialogueId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        kind: "dialogue-completed";
        dialogueId: string;
    }, {
        description: string;
        kind: "dialogue-completed";
        dialogueId: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"event-fired">;
        description: z.ZodString;
        /** Bus event name to subscribe to. */
        eventName: z.ZodString;
        /** Optional registered predicate id; the system invokes the
         *  predicate against the event payload + entity. If absent,
         *  ANY emit of the event progresses the step. */
        predicateId: z.ZodOptional<z.ZodString>;
        targetCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        kind: "event-fired";
        targetCount: number;
        eventName: string;
        predicateId?: string | undefined;
    }, {
        description: string;
        kind: "event-fired";
        eventName: string;
        targetCount?: number | undefined;
        predicateId?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"app-defined">;
        description: z.ZodString;
        /** Custom kind tag — apps register a handler via
         *  `registerQuestStepHandler(customKind, fn)`. */
        customKind: z.ZodString;
        payload: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        description: string;
        kind: "app-defined";
        customKind: string;
        payload?: unknown;
    }, {
        description: string;
        kind: "app-defined";
        customKind: string;
        payload?: unknown;
    }>]>, "many">;
    /** Optional rewards — pure data; apps interpret. The framework
     *  doesn't auto-deliver (apps wire that via a
     *  `'quest:completed'` subscriber that calls inventory ops). */
    rewards: z.ZodOptional<z.ZodObject<{
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
        /** Free-form app data (XP, faction reputation, etc.). */
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
    }, {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    displayName: string;
    steps: ({
        description: string;
        kind: "collect-items";
        itemDefId: string;
        targetCount: number;
    } | {
        description: string;
        kind: "kill-targets";
        targetCount: number;
        targetTag: string;
    } | {
        description: string;
        kind: "reach-tile";
        coord: {
            x: number;
            y: number;
        };
    } | {
        description: string;
        kind: "dialogue-completed";
        dialogueId: string;
    } | {
        description: string;
        kind: "event-fired";
        targetCount: number;
        eventName: string;
        predicateId?: string | undefined;
    } | {
        description: string;
        kind: "app-defined";
        customKind: string;
        payload?: unknown;
    })[];
    version?: number | undefined;
    rewards?: {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
    } | undefined;
}, {
    description: string;
    id: string;
    displayName: string;
    steps: ({
        description: string;
        kind: "collect-items";
        itemDefId: string;
        targetCount: number;
    } | {
        description: string;
        kind: "kill-targets";
        targetCount: number;
        targetTag: string;
    } | {
        description: string;
        kind: "reach-tile";
        coord: {
            x: number;
            y: number;
        };
    } | {
        description: string;
        kind: "dialogue-completed";
        dialogueId: string;
    } | {
        description: string;
        kind: "event-fired";
        eventName: string;
        targetCount?: number | undefined;
        predicateId?: string | undefined;
    } | {
        description: string;
        kind: "app-defined";
        customKind: string;
        payload?: unknown;
    })[];
    version?: number | undefined;
    rewards?: {
        custom?: Record<string, unknown> | undefined;
        items?: {
            defId: string;
            count: number;
        }[] | undefined;
        currency?: number | undefined;
    } | undefined;
}>;
export type QuestDef = z.infer<typeof QuestDefSchema>;
export declare const QuestStatusSchema: z.ZodEnum<["active", "completed", "failed", "abandoned"]>;
export type QuestStatus = z.infer<typeof QuestStatusSchema>;
/** Per-entity active quest tracking. `currentStepIndex` points
 *  into the registered def's `steps`. `progress` is the per-
 *  step counter (kills counted, items collected, etc.). */
export declare const ActiveQuestSchema: z.ZodObject<{
    questId: z.ZodString;
    currentStepIndex: z.ZodNumber;
    /** Counter for the current step. Reset to 0 when advancing
     *  to the next step. Apps reading per-step total inspect the
     *  registered def. */
    progress: z.ZodNumber;
    /** Wall-clock timestamp at start. Apps decide units (Date.now
     *  ms vs game-clock seconds); framework treats it opaquely. */
    startedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    questId: string;
    currentStepIndex: number;
    progress: number;
    startedAt: number;
}, {
    questId: string;
    currentStepIndex: number;
    progress: number;
    startedAt: number;
}>;
export type ActiveQuest = z.infer<typeof ActiveQuestSchema>;
/** Reasons a quest operation can be rejected. */
export declare const QuestRejectionSchema: z.ZodEnum<["unknown-quest", "already-active", "not-active", "wrong-step", "unknown-step-handler", "no-quest-tracker"]>;
export type QuestRejection = z.infer<typeof QuestRejectionSchema>;
/** Discriminated result for `startQuest` / `progressStep` /
 *  related operations. Mirrors the `TurnActionResult` /
 *  `DialogueChoiceResult` shape. */
export declare const QuestProgressResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** True when this operation transitioned the quest into the
     *  `'completed'` status (final step crossed). */
    completed: z.ZodBoolean;
    /** Set when `progressStep` advanced to a new step. */
    nextStepIndex: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    completed: boolean;
    nextStepIndex?: number | undefined;
}, {
    ok: true;
    completed: boolean;
    nextStepIndex?: number | undefined;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["unknown-quest", "already-active", "not-active", "wrong-step", "unknown-step-handler", "no-quest-tracker"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "unknown-quest" | "already-active" | "not-active" | "wrong-step" | "unknown-step-handler" | "no-quest-tracker";
}, {
    message: string;
    ok: false;
    reason: "unknown-quest" | "already-active" | "not-active" | "wrong-step" | "unknown-step-handler" | "no-quest-tracker";
}>]>;
export type QuestProgressResult = z.infer<typeof QuestProgressResultSchema>;
//# sourceMappingURL=quest.d.ts.map