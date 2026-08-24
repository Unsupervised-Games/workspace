// Achievement definition + unlock-result shapes.
//
// `@unsupervised/features/achievements` consumes these. Defs are JSON-
// shaped descriptors registered globally at boot; per-entity
// stats + unlocked ids live on the `achievements` ECS slot.
//
// Steam-shape: stats are reusable counters, achievements are
// criterion-based unlock conditions over those stats (or via
// direct triggers / composite of other achievements). Apps tick
// stats from their own bus subscribers; the framework checks
// pending achievements when stats change, subscribes to event-
// fired criteria's named events lazily, and watches its own
// `'achievement:unlocked'` for meta-achievement cascades.

import { z } from 'zod';

/** Discriminated criterion for unlocking an achievement. Four
 *  kinds — see `@unsupervised/features/achievements` rules for the
 *  composition hierarchy. */
export const AchievementCriterionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('stat-threshold'),
    statId: z.string().min(1),
    threshold: z.number(),
    /** Default `'gte'` (most achievements: "kill at LEAST N").
     *  `'eq'` for exact-count achievements (rare); `'lte'` for
     *  "no more than N" achievements (e.g. "complete level
     *  taking ≤3 damage" via a damage-taken stat). */
    comparison: z.enum(['gte', 'eq', 'lte']).optional(),
  }),
  z.object({
    kind: z.literal('event-fired'),
    eventName: z.string().min(1),
    /** Optional registered predicate id. When omitted, ANY
     *  emit of the event unlocks the achievement. Apps use
     *  predicates to filter (e.g. "boss kill on hard
     *  difficulty only"). */
    predicateId: z.string().optional(),
  }),
  z.object({
    kind: z.literal('one-shot'),
    /** No auto-trigger. Apps call
     *  `unlockAchievement(world, entity, id)` directly. */
  }),
  z.object({
    kind: z.literal('meta'),
    /** Auto-unlocks when EVERY id in this list is unlocked
     *  on the same entity. Self-references are silently
     *  ignored (would never unlock). */
    requiredIds: z.array(z.string().min(1)).min(1),
  }),
]);
export type AchievementCriterion = z.infer<typeof AchievementCriterionSchema>;

/** A registered achievement definition. */
export const AchievementDefSchema = z.object({
  id: z.string().min(1),
  displayName: z.string(),
  description: z.string(),
  /** When true, the achievement is excluded from the profile
   *  UI until the player makes ANY progress on it (Steam-
   *  shape; the framework adds the id to `achievements.hiddenSeen`
   *  on first progress). Apps with strict
   *  hidden-until-unlocked semantics ignore the `hiddenSeen`
   *  set and only show unlocked. */
  hidden: z.boolean().default(false),
  criterion: AchievementCriterionSchema,
  /** Optional reward data — pure JSON; apps interpret. The
   *  framework doesn't auto-deliver. Same posture as quest
   *  rewards. */
  rewards: z
    .object({
      points: z.number().nonnegative().optional(),
      items: z
        .array(
          z.object({
            defId: z.string(),
            count: z.number().int().positive(),
          }),
        )
        .optional(),
      currency: z.number().nonnegative().optional(),
      custom: z.record(z.unknown()).optional(),
    })
    .optional(),
  /** App-defined category tag (e.g. `'combat'`, `'story'`,
   *  `'collection'`). Framework treats as opaque; UIs group
   *  by it. */
  category: z.string().optional(),
});
export type AchievementDef = z.infer<typeof AchievementDefSchema>;

/** Reasons an unlock can be rejected. */
export const AchievementUnlockRejectionSchema = z.enum([
  'unknown-achievement',
  'already-unlocked',
  'no-tracker',
]);
export type AchievementUnlockRejection = z.infer<
  typeof AchievementUnlockRejectionSchema
>;

/** Discriminated result for `unlockAchievement`. The success
 *  variant's `fresh` field distinguishes "first unlock" from
 *  "already unlocked, idempotent path." Mirrors
 *  `applyStatusEffect`'s `fresh` semantics. */
export const AchievementUnlockResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** Wall-clock or app-defined timestamp at unlock. */
    unlockedAt: z.number().nonnegative(),
    /** True when this call transitioned the achievement from
     *  locked to unlocked. False on the idempotent re-unlock
     *  path (already-unlocked is success, not rejection). */
    fresh: z.boolean(),
  }),
  z.object({
    ok: z.literal(false),
    reason: AchievementUnlockRejectionSchema,
    message: z.string(),
  }),
]);
export type AchievementUnlockResult = z.infer<
  typeof AchievementUnlockResultSchema
>;
