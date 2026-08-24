// Status-effect shapes used by `@unsupervised/features/status`.
//
// Two distinct concerns, deliberately split:
//
//   1. StatusEffectInstance — per-entity runtime state on the
//      `statusEffects` ECS slot. JSON-shaped, references a
//      definition by string id, round-trips through save/load.
//
//   2. BaseStatusEffectDefinition — static authoring metadata for a
//      status type (display name, duration, stack behavior, tick
//      cadence). Lives in a global registry, registered at game
//      boot with paired callbacks (onApply / onTick / onExpire).
//      Apps EXTEND this base with their own discriminated-union
//      fields (damage-per-tick for DOTs, slow-multiplier for
//      slows, etc.).
//
// Why the split mirrors items / abilities / BTs:
// definitions are static and shared; instances are tiny and
// per-entity. Saves round-trip the IDS, never the callbacks; the
// registry rebuilds from code at boot. Same model the rest of
// the engine uses.
import { z } from 'zod';
/**
 * Stack behavior when `applyStatusEffect` is called against a
 * target that already has the effect.
 *
 *   - 'refresh' (default): reset the duration to the def's full
 *     duration; stackCount stays at 1. The most common shape —
 *     re-applying a 5s burn just keeps it burning.
 *
 *   - 'stack': increment stackCount + refresh duration. Apps
 *     interpret stackCount however they like (damage-per-tick
 *     scaled by stacks, or just visual indicator). The framework
 *     just bumps the counter.
 *
 *   - 'reject': re-apply is a no-op when already affected.
 *     Useful for "petrify" or "can't apply if already petrified"
 *     immunity-shape semantics.
 */
export const StatusStackBehaviorSchema = z.enum(['refresh', 'stack', 'reject']);
/**
 * Per-entity instance of a status effect. One element of the
 * `statusEffects` ECS slot's array. Multiple effects can coexist
 * on one entity, including multiple stacks of the same effect
 * when `stackable: true`.
 *
 * `lastTickAt` is the world-time of the LAST onTick fire (or the
 * application time, for effects that haven't ticked yet). The
 * system uses this plus the def's `tickInterval` to decide when
 * the next tick should fire. Saving mid-cycle preserves cadence
 * (a burn that ticked 0.3s ago resumes at 0.7s remaining until
 * next tick after load).
 */
export const StatusEffectInstanceSchema = z.object({
    /** Look up against `registerStatusEffect(...)` by id. Must
     *  match a registered def before the system ticks. */
    defId: z.string().min(1),
    /** Seconds remaining until expiry. Decremented every frame by
     *  `statusEffectSystem`; on hitting 0, onExpire fires and the
     *  instance is spliced out. */
    remainingSeconds: z.number().nonnegative(),
    /** Stack count, >= 1 (never 0 — an effect at 0 stacks is just
     *  not applied). Apps interpret this however they like. */
    stackCount: z.number().int().positive(),
    /** Optional id of the entity that applied this effect. Used by
     *  damage-attribution paths (a burn's tick damage reports
     *  `source` so kill credit goes to the original caster). */
    sourceEntityId: z.string().optional(),
    /** World-time at application. Lets UIs show "applied 3s ago"
     *  and helps with debugging ordering. */
    appliedAt: z.number().nonnegative(),
    /** World-time of the last onTick fire (or applicationtime if
     *  no tick has fired yet). Drives the `worldTime - lastTickAt
     *  >= tickInterval` check. */
    lastTickAt: z.number().nonnegative(),
});
/**
 * Universal fields every status-effect definition must declare.
 * Apps extend with their own game-specific shape — same pattern
 * as `BaseAbilityDefinition` / `BaseItemDefinition`.
 *
 * Apps register defs at boot via `registerStatusEffect({ ...def,
 * onApply, onTick, onExpire })`. Callbacks are code; defs are
 * data. Saves don't round-trip callbacks.
 */
export const BaseStatusEffectDefinitionSchema = z.object({
    /** Stable registry key. Persisted in save data via
     *  `StatusEffectInstance.defId`. Must be unique. Hyphen-case
     *  by convention ('burn', 'stun', 'attack-speed-up'). */
    id: z.string().min(1),
    /** Human-readable label for HUD badges / tooltips. */
    displayName: z.string().min(1),
    /** Effect duration in seconds. The system decrements
     *  `remainingSeconds` from this value down to 0; on 0 the
     *  effect expires. Pass 0 for "instant" effects (fire onApply,
     *  expire same tick) — though those are usually better
     *  authored as direct calls without going through the status
     *  layer. */
    duration: z.number().nonnegative(),
    /** Stack behavior on re-apply. See `StatusStackBehaviorSchema`. */
    stackBehavior: StatusStackBehaviorSchema.default('refresh'),
    /** Optional periodic-tick cadence in seconds. When set, the
     *  system fires `onTick` every `tickInterval` seconds while
     *  the effect is active. Common values: 1 (DOTs), 0.5 (rapid
     *  bleed). Unset means "no periodic ticks" — the effect just
     *  expires after its duration. */
    tickInterval: z.number().positive().optional(),
});
//# sourceMappingURL=statusEffect.js.map