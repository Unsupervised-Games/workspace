import { z } from 'zod';
/** Reference to a registered condition / action by id +
 *  app-supplied opaque args. The framework treats `args` as
 *  unknown; the registered callback narrows. */
export declare const DialogueRefSchema: z.ZodObject<{
    id: z.ZodString;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    args?: Record<string, unknown> | undefined;
}, {
    id: string;
    args?: Record<string, unknown> | undefined;
}>;
export type DialogueRef = z.infer<typeof DialogueRefSchema>;
/** A single choice in a dialogue node. `nextNodeId === null`
 *  ends the dialogue; otherwise it transitions to that node. */
export declare const DialogueChoiceSchema: z.ZodObject<{
    text: z.ZodString;
    /** App-defined condition id; choice is hidden / disabled
     *  when the predicate returns false. UI chooses semantics
     *  (the framework just exposes visible choices via
     *  `getVisibleChoices`). */
    condition: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        args?: Record<string, unknown> | undefined;
    }, {
        id: string;
        args?: Record<string, unknown> | undefined;
    }>>;
    /** App-defined action id; runs when the choice is committed
     *  (after node bookkeeping, before transitioning). */
    action: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        args?: Record<string, unknown> | undefined;
    }, {
        id: string;
        args?: Record<string, unknown> | undefined;
    }>>;
    /** Next node id, or `null` to end the dialogue. */
    nextNodeId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    text: string;
    nextNodeId: string | null;
    condition?: {
        id: string;
        args?: Record<string, unknown> | undefined;
    } | undefined;
    action?: {
        id: string;
        args?: Record<string, unknown> | undefined;
    } | undefined;
}, {
    text: string;
    nextNodeId: string | null;
    condition?: {
        id: string;
        args?: Record<string, unknown> | undefined;
    } | undefined;
    action?: {
        id: string;
        args?: Record<string, unknown> | undefined;
    } | undefined;
}>;
export type DialogueChoice = z.infer<typeof DialogueChoiceSchema>;
/** A dialogue node — speaker + text + choices + optional
 *  on-enter action that fires before choices render. */
export declare const DialogueNodeSchema: z.ZodObject<{
    id: z.ZodString;
    /** App-defined speaker id (mapped to portrait / name /
     *  voice in the UI layer). Framework treats it as opaque. */
    speaker: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        /** App-defined condition id; choice is hidden / disabled
         *  when the predicate returns false. UI chooses semantics
         *  (the framework just exposes visible choices via
         *  `getVisibleChoices`). */
        condition: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            args?: Record<string, unknown> | undefined;
        }, {
            id: string;
            args?: Record<string, unknown> | undefined;
        }>>;
        /** App-defined action id; runs when the choice is committed
         *  (after node bookkeeping, before transitioning). */
        action: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            args?: Record<string, unknown> | undefined;
        }, {
            id: string;
            args?: Record<string, unknown> | undefined;
        }>>;
        /** Next node id, or `null` to end the dialogue. */
        nextNodeId: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        nextNodeId: string | null;
        condition?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
        action?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }, {
        text: string;
        nextNodeId: string | null;
        condition?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
        action?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }>, "many">;
    /** Optional auto-action that fires on entering the node,
     *  before choices render. Useful for "give the player the
     *  item now" without requiring a click. Save/load round-trips
     *  the slot's `currentNodeId`; on reload the node is
     *  considered already entered (onEnterAction does NOT re-fire
     *  — same semantics as cast-handle `fired` flag). */
    onEnterAction: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        args?: Record<string, unknown> | undefined;
    }, {
        id: string;
        args?: Record<string, unknown> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    text: string;
    choices: {
        text: string;
        nextNodeId: string | null;
        condition?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
        action?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }[];
    speaker?: string | undefined;
    onEnterAction?: {
        id: string;
        args?: Record<string, unknown> | undefined;
    } | undefined;
}, {
    id: string;
    text: string;
    choices: {
        text: string;
        nextNodeId: string | null;
        condition?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
        action?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }[];
    speaker?: string | undefined;
    onEnterAction?: {
        id: string;
        args?: Record<string, unknown> | undefined;
    } | undefined;
}>;
export type DialogueNode = z.infer<typeof DialogueNodeSchema>;
/** The runtime-contract version of the DialogueScript shape — bump when
 *  the SHAPE changes (a new node/choice field), not when a script's content
 *  changes. `narrative compile` stamps it into emitted `.dialogue.json` so a
 *  non-TS runtime can check what it's loading. See
 *  docs/specs/runtime-conformance.md. */
export declare const DIALOGUE_SCRIPT_VERSION = 1;
/** A dialogue script — id + start node + node graph. */
export declare const DialogueScriptSchema: z.ZodObject<{
    /** Contract version (`DIALOGUE_SCRIPT_VERSION`). Optional so hand-authored
     *  scripts + existing data parse unchanged; `narrative compile` stamps it. */
    version: z.ZodOptional<z.ZodNumber>;
    id: z.ZodString;
    startNodeId: z.ZodString;
    /** Map of node id → DialogueNode. Object-shaped (not array)
     *  so transitions are O(1). */
    nodes: z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        /** App-defined speaker id (mapped to portrait / name /
         *  voice in the UI layer). Framework treats it as opaque. */
        speaker: z.ZodOptional<z.ZodString>;
        text: z.ZodString;
        choices: z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            /** App-defined condition id; choice is hidden / disabled
             *  when the predicate returns false. UI chooses semantics
             *  (the framework just exposes visible choices via
             *  `getVisibleChoices`). */
            condition: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                args?: Record<string, unknown> | undefined;
            }, {
                id: string;
                args?: Record<string, unknown> | undefined;
            }>>;
            /** App-defined action id; runs when the choice is committed
             *  (after node bookkeeping, before transitioning). */
            action: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                args?: Record<string, unknown> | undefined;
            }, {
                id: string;
                args?: Record<string, unknown> | undefined;
            }>>;
            /** Next node id, or `null` to end the dialogue. */
            nextNodeId: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            text: string;
            nextNodeId: string | null;
            condition?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
            action?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
        }, {
            text: string;
            nextNodeId: string | null;
            condition?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
            action?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
        }>, "many">;
        /** Optional auto-action that fires on entering the node,
         *  before choices render. Useful for "give the player the
         *  item now" without requiring a click. Save/load round-trips
         *  the slot's `currentNodeId`; on reload the node is
         *  considered already entered (onEnterAction does NOT re-fire
         *  — same semantics as cast-handle `fired` flag). */
        onEnterAction: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            args?: Record<string, unknown> | undefined;
        }, {
            id: string;
            args?: Record<string, unknown> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        text: string;
        choices: {
            text: string;
            nextNodeId: string | null;
            condition?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
            action?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
        }[];
        speaker?: string | undefined;
        onEnterAction?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }, {
        id: string;
        text: string;
        choices: {
            text: string;
            nextNodeId: string | null;
            condition?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
            action?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
        }[];
        speaker?: string | undefined;
        onEnterAction?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    startNodeId: string;
    nodes: Record<string, {
        id: string;
        text: string;
        choices: {
            text: string;
            nextNodeId: string | null;
            condition?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
            action?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
        }[];
        speaker?: string | undefined;
        onEnterAction?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }>;
    version?: number | undefined;
}, {
    id: string;
    startNodeId: string;
    nodes: Record<string, {
        id: string;
        text: string;
        choices: {
            text: string;
            nextNodeId: string | null;
            condition?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
            action?: {
                id: string;
                args?: Record<string, unknown> | undefined;
            } | undefined;
        }[];
        speaker?: string | undefined;
        onEnterAction?: {
            id: string;
            args?: Record<string, unknown> | undefined;
        } | undefined;
    }>;
    version?: number | undefined;
}>;
export type DialogueScript = z.infer<typeof DialogueScriptSchema>;
/** Reasons a `chooseDialogue` call can be rejected. */
export declare const DialogueRejectionSchema: z.ZodEnum<["not-active", "invalid-choice", "condition-failed", "unknown-action", "unknown-condition", "unknown-script", "unknown-node"]>;
export type DialogueRejection = z.infer<typeof DialogueRejectionSchema>;
/** Result of `startDialogue` / `chooseDialogue` — discriminated,
 *  mirrors `TurnActionResult` shape. */
export declare const DialogueChoiceResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** New current node id, or `null` if the dialogue ended. */
    nextNodeId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    nextNodeId: string | null;
}, {
    ok: true;
    nextNodeId: string | null;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["not-active", "invalid-choice", "condition-failed", "unknown-action", "unknown-condition", "unknown-script", "unknown-node"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "not-active" | "invalid-choice" | "condition-failed" | "unknown-action" | "unknown-condition" | "unknown-script" | "unknown-node";
}, {
    message: string;
    ok: false;
    reason: "not-active" | "invalid-choice" | "condition-failed" | "unknown-action" | "unknown-condition" | "unknown-script" | "unknown-node";
}>]>;
export type DialogueChoiceResult = z.infer<typeof DialogueChoiceResultSchema>;
//# sourceMappingURL=dialogue.d.ts.map