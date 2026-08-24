import { z } from 'zod';
/** Information carried with an `entity:damaged` event. Subscribers
 *  read this to drive UI floaters, audio cues, achievements,
 *  threat tables, and on-hit VFX. The pre/post-mitigation pair is
 *  intentional — most subscribers want post-mitigation ("how much
 *  did this hurt?"), but some (achievements: "deal 10k raw
 *  damage") want raw. */
export declare const DamageInfoSchema: z.ZodObject<{
    /** Pre-mitigation amount the caller passed to `applyDamage`.
     *  Useful for "this attack hits for X regardless of armor"
     *  display, raw-damage achievements, dmg-amplification stats. */
    rawAmount: z.ZodNumber;
    /** Post-mitigation amount actually subtracted from `health.current`.
     *  This is what a "X damage!" floater should display. Always
     *  `<= rawAmount`; a fully-immune target sees `amount: 0`. */
    amount: z.ZodNumber;
    /** Damage type tag — opaque to the framework, narrowed by
     *  apps. Matches keys in `combat.resistances` /
     *  `combat.immunities` for mitigation lookup. */
    type: z.ZodString;
    /** Optional id of the entity that dealt the damage. We carry
     *  the id (not a live entity reference) so events round-trip
     *  through any future replay / netcode layer cleanly — same
     *  rationale as the `spawnedBy.spawnerId` slot uses. */
    source: z.ZodOptional<z.ZodString>;
    /** Optional flag signalling a critical hit. Game code computes
     *  the crit roll BEFORE calling `applyDamage` and passes the
     *  flag through; the framework just ferries it to subscribers
     *  (UI floaters use it to render a yellow / oversized number). */
    critical: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: string;
    rawAmount: number;
    amount: number;
    source?: string | undefined;
    critical?: boolean | undefined;
}, {
    type: string;
    rawAmount: number;
    amount: number;
    source?: string | undefined;
    critical?: boolean | undefined;
}>;
export type DamageInfo = z.infer<typeof DamageInfoSchema>;
//# sourceMappingURL=damage.d.ts.map