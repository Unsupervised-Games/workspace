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
export declare const StatusStackBehaviorSchema: z.ZodEnum<["refresh", "stack", "reject"]>;
export type StatusStackBehavior = z.infer<typeof StatusStackBehaviorSchema>;
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
export declare const StatusEffectInstanceSchema: z.ZodObject<{
    /** Look up against `registerStatusEffect(...)` by id. Must
     *  match a registered def before the system ticks. */
    defId: z.ZodString;
    /** Seconds remaining until expiry. Decremented every frame by
     *  `statusEffectSystem`; on hitting 0, onExpire fires and the
     *  instance is spliced out. */
    remainingSeconds: z.ZodNumber;
    /** Stack count, >= 1 (never 0 — an effect at 0 stacks is just
     *  not applied). Apps interpret this however they like. */
    stackCount: z.ZodNumber;
    /** Optional id of the entity that applied this effect. Used by
     *  damage-attribution paths (a burn's tick damage reports
     *  `source` so kill credit goes to the original caster). */
    sourceEntityId: z.ZodOptional<z.ZodString>;
    /** World-time at application. Lets UIs show "applied 3s ago"
     *  and helps with debugging ordering. */
    appliedAt: z.ZodNumber;
    /** World-time of the last onTick fire (or applicationtime if
     *  no tick has fired yet). Drives the `worldTime - lastTickAt
     *  >= tickInterval` check. */
    lastTickAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    defId: string;
    remainingSeconds: number;
    stackCount: number;
    appliedAt: number;
    lastTickAt: number;
    sourceEntityId?: string | undefined;
}, {
    defId: string;
    remainingSeconds: number;
    stackCount: number;
    appliedAt: number;
    lastTickAt: number;
    sourceEntityId?: string | undefined;
}>;
export type StatusEffectInstance = z.infer<typeof StatusEffectInstanceSchema>;
/**
 * Universal fields every status-effect definition must declare.
 * Apps extend with their own game-specific shape — same pattern
 * as `BaseAbilityDefinition` / `BaseItemDefinition`.
 *
 * Apps register defs at boot via `registerStatusEffect({ ...def,
 * onApply, onTick, onExpire })`. Callbacks are code; defs are
 * data. Saves don't round-trip callbacks.
 */
export declare const BaseStatusEffectDefinitionSchema: z.ZodObject<{
    /** Stable registry key. Persisted in save data via
     *  `StatusEffectInstance.defId`. Must be unique. Hyphen-case
     *  by convention ('burn', 'stun', 'attack-speed-up'). */
    id: z.ZodString;
    /** Human-readable label for HUD badges / tooltips. */
    displayName: z.ZodString;
    /** Effect duration in seconds. The system decrements
     *  `remainingSeconds` from this value down to 0; on 0 the
     *  effect expires. Pass 0 for "instant" effects (fire onApply,
     *  expire same tick) — though those are usually better
     *  authored as direct calls without going through the status
     *  layer. */
    duration: z.ZodNumber;
    /** Stack behavior on re-apply. See `StatusStackBehaviorSchema`. */
    stackBehavior: z.ZodDefault<z.ZodEnum<["refresh", "stack", "reject"]>>;
    /** Optional periodic-tick cadence in seconds. When set, the
     *  system fires `onTick` every `tickInterval` seconds while
     *  the effect is active. Common values: 1 (DOTs), 0.5 (rapid
     *  bleed). Unset means "no periodic ticks" — the effect just
     *  expires after its duration. */
    tickInterval: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    displayName: string;
    duration: number;
    stackBehavior: "refresh" | "stack" | "reject";
    tickInterval?: number | undefined;
}, {
    id: string;
    displayName: string;
    duration: number;
    stackBehavior?: "refresh" | "stack" | "reject" | undefined;
    tickInterval?: number | undefined;
}>;
export type BaseStatusEffectDefinition = z.infer<typeof BaseStatusEffectDefinitionSchema>;
//# sourceMappingURL=statusEffect.d.ts.map