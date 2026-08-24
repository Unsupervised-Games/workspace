import { z } from 'zod';
/** Target type the ability accepts. UI / input layers use this to
 *  decide how to gather the target before calling `tryActivate`:
 *
 *    - `self`     — no target needed (e.g., Heal). UI can fire on
 *                   click without aim input.
 *    - `point`    — a world-space position (e.g., Fireball at
 *                   ground-aim).
 *    - `entity`   — a specific other entity (e.g., a friendly
 *                   buff or a single-target debuff).
 *
 *  The abilities layer doesn't validate that the provided target
 *  matches `targetType` — that's a UI / activation-site concern.
 *  The field is metadata for callers, not a runtime gate. */
export declare const AbilityTargetTypeSchema: z.ZodEnum<["self", "point", "entity"]>;
export type AbilityTargetType = z.infer<typeof AbilityTargetTypeSchema>;
/**
 * The minimal ability-definition contract every game must
 * satisfy. Apps EXTEND this with `BaseAbilityDefinitionSchema.extend({...})`
 * to add game-specific fields (damage, restoreAmount, vfxId,
 * audioId, animationClipId, …) before passing the resulting
 * schema to forge for validation. The abilities layer reads only
 * the universal fields below; everything else is opaque
 * authoring metadata that the effect callback consumes.
 */
export declare const BaseAbilityDefinitionSchema: z.ZodObject<{
    /** Stable registry key. Persisted in save data and referenced
     *  by every entity that has the ability in its `active` array.
     *  Hyphenated kebab-case conventional ('fireball', 'heavy-strike'). */
    id: z.ZodString;
    /** Human-readable display name for UI / tooltips. */
    displayName: z.ZodString;
    /** Optional flavor / mechanical description. */
    description: z.ZodOptional<z.ZodString>;
    /** Asset-registry key for the icon. The abilities layer doesn't
     *  resolve this — passed through to consumer UI. */
    iconAssetId: z.ZodOptional<z.ZodString>;
    /** Cooldown in seconds. After successful activation, the entity's
     *  cooldown timer for this ability is set to this value; the
     *  abilities system ticks it down by `delta` each frame. While
     *  > 0, `tryActivate` rejects with reason `'cooldown'`. */
    cooldown: z.ZodNumber;
    /** Resource costs, keyed by resource-name. On successful
     *  activation, each named resource's `current` is decremented
     *  by the listed amount. If any resource is short, activation
     *  rejects with reason `'cost'` BEFORE invoking the effect.
     *  Optional: a free-cast ability omits the field entirely. */
    cost: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    /** Optional max-range hint, in world units. The abilities layer
     *  doesn't enforce range (callers gate at the UI / AI layer);
     *  this is metadata for tooltips and aim cursors. */
    range: z.ZodOptional<z.ZodNumber>;
    /** Target type the ability expects. See `AbilityTargetTypeSchema`. */
    targetType: z.ZodOptional<z.ZodEnum<["self", "point", "entity"]>>;
    /** Optional phase timing decomposition for cast-time
     *  abilities. Effect fires at the windup→active boundary
     *  (the "moment of impact"); cooldown is set there too.
     *
     *  Set all three to numbers (seconds). Use `0` for any phase
     *  the ability doesn't have:
     *
     *    - "Heavy swing" (long windup, instant strike, brief
     *      follow-through): `{ windup: 0.8, active: 0.05,
     *      recovery: 0.4 }`.
     *    - "Quick channel" (no windup, fixed channel duration,
     *      no recovery): `{ windup: 0, active: 1.5, recovery: 0 }`.
     *      Effect fires immediately, but the entity is still
     *      "in cast" until active expires (locks new casts).
     *    - "Telegraphed slow strike": `{ windup: 1.2, active:
     *      0.05, recovery: 0.3 }`.
     *
     *  Modifier integration: the runtime windup duration is
     *  `phaseTimings.windup × resolveStat(caster, 'cast-speed', 1)`.
     *  A "Haste" status with `'cast-speed': × 0.5` modifier
     *  halves the windup. The multiplier is captured at cast
     *  start; mid-cast modifier changes don't retroactively
     *  shift the boundary. */
    phaseTimings: z.ZodOptional<z.ZodObject<{
        windup: z.ZodNumber;
        active: z.ZodNumber;
        recovery: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        active: number;
        windup: number;
        recovery: number;
    }, {
        active: number;
        windup: number;
        recovery: number;
    }>>;
    /** Optional animation event name. When set on a cast-time
     *  ability, the windup phase doesn't auto-advance at the
     *  timing boundary — instead the casting system waits for
     *  an `'animation:event'` bus emit on the casting entity
     *  whose `eventName` matches this value. Sword swings + hit
     *  frames sync this way: the animator authors a `'hit-frame'`
     *  event on the swing clip via `registerAnimationEvent`,
     *  and the ability def references that event name here.
     *
     *  Fallback: if the named event never fires within
     *  `windup × 2` seconds, the cast advances to active anyway
     *  with a `warn` log entry. Bug-shape protection. */
    activeOnEvent: z.ZodOptional<z.ZodString>;
    /** Whether stuns / status-effect interrupts can cancel an
     *  in-progress cast. Default `true`. Set `false` for
     *  uninterruptible casts (boss "this attack cannot be
     *  stopped" mechanics). */
    interruptible: z.ZodOptional<z.ZodBoolean>;
    /** Gate activation on the beat-clock hit window. When `true`,
     *  `tryActivate` checks the singleton `beatClock` and rejects
     *  with reason `'off-beat'` if `currentSeconds` is more than
     *  `hitWindowSeconds` away from the nearest beat boundary.
     *  Default `false` (instant abilities are always on-beat by
     *  virtue of having no rhythm constraint). */
    onBeat: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    displayName: string;
    cooldown: number;
    cost?: Record<string, number> | undefined;
    description?: string | undefined;
    iconAssetId?: string | undefined;
    phaseTimings?: {
        active: number;
        windup: number;
        recovery: number;
    } | undefined;
    activeOnEvent?: string | undefined;
    interruptible?: boolean | undefined;
    range?: number | undefined;
    targetType?: "point" | "self" | "entity" | undefined;
    onBeat?: boolean | undefined;
}, {
    id: string;
    displayName: string;
    cooldown: number;
    cost?: Record<string, number> | undefined;
    description?: string | undefined;
    iconAssetId?: string | undefined;
    phaseTimings?: {
        active: number;
        windup: number;
        recovery: number;
    } | undefined;
    activeOnEvent?: string | undefined;
    interruptible?: boolean | undefined;
    range?: number | undefined;
    targetType?: "point" | "self" | "entity" | undefined;
    onBeat?: boolean | undefined;
}>;
export type BaseAbilityDefinition = z.infer<typeof BaseAbilityDefinitionSchema>;
//# sourceMappingURL=ability.d.ts.map