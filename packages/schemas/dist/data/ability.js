// Ability shapes used by `@unsupervised/features/abilities`.
//
// Same data/code split as items: definitions hold the JSON-shaped
// metadata (cooldown, cost, range, target type) and live in a
// global registry; effect callbacks are code, registered alongside
// the definition at game-boot time. Saves round-trip through the
// definition id, not the def itself.
//
// `cost` is a record of resource-name → amount. Resource names are
// app-defined strings (mana / stamina / focus / heat); the
// abilities layer treats them as opaque keys against the entity's
// `resources` slot. A game with a single mana pool typically uses
// one key; a game with multiple pools (mana + stamina) uses two
// or more.
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
export const AbilityTargetTypeSchema = z.enum(['self', 'point', 'entity']);
/**
 * The minimal ability-definition contract every game must
 * satisfy. Apps EXTEND this with `BaseAbilityDefinitionSchema.extend({...})`
 * to add game-specific fields (damage, restoreAmount, vfxId,
 * audioId, animationClipId, …) before passing the resulting
 * schema to forge for validation. The abilities layer reads only
 * the universal fields below; everything else is opaque
 * authoring metadata that the effect callback consumes.
 */
export const BaseAbilityDefinitionSchema = z.object({
    /** Stable registry key. Persisted in save data and referenced
     *  by every entity that has the ability in its `active` array.
     *  Hyphenated kebab-case conventional ('fireball', 'heavy-strike'). */
    id: z.string().min(1),
    /** Human-readable display name for UI / tooltips. */
    displayName: z.string().min(1),
    /** Optional flavor / mechanical description. */
    description: z.string().optional(),
    /** Asset-registry key for the icon. The abilities layer doesn't
     *  resolve this — passed through to consumer UI. */
    iconAssetId: z.string().optional(),
    /** Cooldown in seconds. After successful activation, the entity's
     *  cooldown timer for this ability is set to this value; the
     *  abilities system ticks it down by `delta` each frame. While
     *  > 0, `tryActivate` rejects with reason `'cooldown'`. */
    cooldown: z.number().nonnegative(),
    /** Resource costs, keyed by resource-name. On successful
     *  activation, each named resource's `current` is decremented
     *  by the listed amount. If any resource is short, activation
     *  rejects with reason `'cost'` BEFORE invoking the effect.
     *  Optional: a free-cast ability omits the field entirely. */
    cost: z.record(z.string(), z.number().nonnegative()).optional(),
    /** Optional max-range hint, in world units. The abilities layer
     *  doesn't enforce range (callers gate at the UI / AI layer);
     *  this is metadata for tooltips and aim cursors. */
    range: z.number().nonnegative().optional(),
    /** Target type the ability expects. See `AbilityTargetTypeSchema`. */
    targetType: AbilityTargetTypeSchema.optional(),
    // ─── Casting state ──────────────────────────────────────
    // When `phaseTimings` is set, `tryActivate` routes through
    // the casting system (windup → active → recovery) instead of
    // firing the effect immediately. Without it, the ability is
    // instant — the existing path. Backward-compatible by absence.
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
    phaseTimings: z
        .object({
        windup: z.number().nonnegative(),
        active: z.number().nonnegative(),
        recovery: z.number().nonnegative(),
    })
        .optional(),
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
    activeOnEvent: z.string().optional(),
    /** Whether stuns / status-effect interrupts can cancel an
     *  in-progress cast. Default `true`. Set `false` for
     *  uninterruptible casts (boss "this attack cannot be
     *  stopped" mechanics). */
    interruptible: z.boolean().optional(),
    // ─── Rhythm gating ──────────────────────────────────────
    // When `onBeat: true`, `tryActivate` rejects activations that
    // happen outside the hit window of the singleton `beatClock`
    // entity (rejection reason: `'off-beat'`). Without a
    // `beatClock` entity, the gate is skipped — apps that don't
    // use the rhythm layer pay zero cost.
    /** Gate activation on the beat-clock hit window. When `true`,
     *  `tryActivate` checks the singleton `beatClock` and rejects
     *  with reason `'off-beat'` if `currentSeconds` is more than
     *  `hitWindowSeconds` away from the nearest beat boundary.
     *  Default `false` (instant abilities are always on-beat by
     *  virtue of having no rhythm constraint). */
    onBeat: z.boolean().optional(),
});
//# sourceMappingURL=ability.js.map