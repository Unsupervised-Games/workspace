// Quest definition + active-state shapes.
//
// `@unsupervised/features/quests` consumes these. Defs are JSON-shaped
// descriptors registered globally at boot; per-entity active
// quests + completed ids live on the `quests` ECS slot.
//
// The framework's auto-progression layer subscribes to the bus
// and matches active steps against incoming events. Five built-in
// step kinds cover the canonical 80%; `'app-defined'` is the
// escape hatch — apps register a per-customKind handler via
// `registerQuestStepHandler(...)`.

import { z } from 'zod';

/** Step kinds. The first four are auto-progressed by the
 *  quest module's bus subscriptions; `'app-defined'` is the
 *  escape hatch. */
export const QuestStepSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('collect-items'),
    description: z.string(),
    /** Item def id to collect. Counted via
     *  `'inventory:transaction-applied'`; only ADD ops increment
     *  (REMOVE / MOVE don't decrement — the bookkeeping would
     *  oscillate against player loot management). */
    itemDefId: z.string().min(1),
    targetCount: z.number().int().positive(),
  }),
  z.object({
    kind: z.literal('kill-targets'),
    description: z.string(),
    /** Tag matched against the killed entity. Apps register a
     *  per-tag matcher predicate via `registerKillTargetMatcher`
     *  (e.g., "this kill counts toward 'goblin' tag if
     *  `entity.spawnedBy?.spawnerId === 'goblin-spawner'`"). */
    targetTag: z.string().min(1),
    targetCount: z.number().int().positive(),
  }),
  z.object({
    kind: z.literal('reach-tile'),
    description: z.string(),
    coord: z.object({ x: z.number().int(), y: z.number().int() }),
  }),
  z.object({
    kind: z.literal('dialogue-completed'),
    description: z.string(),
    dialogueId: z.string().min(1),
  }),
  z.object({
    kind: z.literal('event-fired'),
    description: z.string(),
    /** Bus event name to subscribe to. */
    eventName: z.string().min(1),
    /** Optional registered predicate id; the system invokes the
     *  predicate against the event payload + entity. If absent,
     *  ANY emit of the event progresses the step. */
    predicateId: z.string().optional(),
    targetCount: z.number().int().positive().default(1),
  }),
  z.object({
    kind: z.literal('app-defined'),
    description: z.string(),
    /** Custom kind tag — apps register a handler via
     *  `registerQuestStepHandler(customKind, fn)`. */
    customKind: z.string().min(1),
    payload: z.unknown(),
  }),
]);
export type QuestStep = z.infer<typeof QuestStepSchema>;

/** The runtime-contract version of the QuestDef shape — bump when the SHAPE
 *  changes (a new step kind / field), not when a quest's content changes.
 *  `narrative compile` stamps it into emitted `.quest.json`. See
 *  docs/specs/runtime-conformance.md. */
export const QUEST_DEF_VERSION = 1;

/** A quest definition. Multi-step linear progression for v1
 *  (branching is in OUT_OF_SCOPE). Steps progress in order;
 *  the next step becomes active when the current one
 *  completes. */
export const QuestDefSchema = z.object({
  /** Contract version (`QUEST_DEF_VERSION`). Optional so existing data parses
   *  unchanged; `narrative compile` stamps it. */
  version: z.number().int().optional(),
  id: z.string().min(1),
  displayName: z.string(),
  description: z.string(),
  steps: z.array(QuestStepSchema).min(1),
  /** Optional rewards — pure data; apps interpret. The framework
   *  doesn't auto-deliver (apps wire that via a
   *  `'quest:completed'` subscriber that calls inventory ops). */
  rewards: z
    .object({
      items: z
        .array(
          z.object({
            defId: z.string(),
            count: z.number().int().positive(),
          }),
        )
        .optional(),
      currency: z.number().nonnegative().optional(),
      /** Free-form app data (XP, faction reputation, etc.). */
      custom: z.record(z.unknown()).optional(),
    })
    .optional(),
});
export type QuestDef = z.infer<typeof QuestDefSchema>;

export const QuestStatusSchema = z.enum([
  'active',
  'completed',
  'failed',
  'abandoned',
]);
export type QuestStatus = z.infer<typeof QuestStatusSchema>;

/** Per-entity active quest tracking. `currentStepIndex` points
 *  into the registered def's `steps`. `progress` is the per-
 *  step counter (kills counted, items collected, etc.). */
export const ActiveQuestSchema = z.object({
  questId: z.string().min(1),
  currentStepIndex: z.number().int().nonnegative(),
  /** Counter for the current step. Reset to 0 when advancing
   *  to the next step. Apps reading per-step total inspect the
   *  registered def. */
  progress: z.number().int().nonnegative(),
  /** Wall-clock timestamp at start. Apps decide units (Date.now
   *  ms vs game-clock seconds); framework treats it opaquely. */
  startedAt: z.number().nonnegative(),
});
export type ActiveQuest = z.infer<typeof ActiveQuestSchema>;

/** Reasons a quest operation can be rejected. */
export const QuestRejectionSchema = z.enum([
  'unknown-quest',
  'already-active',
  'not-active',
  'wrong-step',
  'unknown-step-handler',
  'no-quest-tracker',
]);
export type QuestRejection = z.infer<typeof QuestRejectionSchema>;

/** Discriminated result for `startQuest` / `progressStep` /
 *  related operations. Mirrors the `TurnActionResult` /
 *  `DialogueChoiceResult` shape. */
export const QuestProgressResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** True when this operation transitioned the quest into the
     *  `'completed'` status (final step crossed). */
    completed: z.boolean(),
    /** Set when `progressStep` advanced to a new step. */
    nextStepIndex: z.number().int().nonnegative().optional(),
  }),
  z.object({
    ok: z.literal(false),
    reason: QuestRejectionSchema,
    message: z.string(),
  }),
]);
export type QuestProgressResult = z.infer<typeof QuestProgressResultSchema>;
