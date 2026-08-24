// Damage event shape. Carried in `entity:damaged` bus payloads
// and supplied by callers of `applyDamage` from
// `@unsupervised/features/combat`.
//
// Why DamageType is a plain string at this layer:
//   No two games agree on the elemental palette ('physical' /
//   'fire' / 'ice' / 'lightning' / 'poison' for one game;
//   'kinetic' / 'plasma' / 'thermal' / 'corrosive' for another).
//   Apps narrow with their own union: `type DamageType =
//   'physical' | 'fire' | ...` and use it everywhere they call
//   into the combat layer. The framework treats damage types as
//   opaque keys against `combat.resistances` / `combat.immunities`.

import { z } from 'zod';

/** Information carried with an `entity:damaged` event. Subscribers
 *  read this to drive UI floaters, audio cues, achievements,
 *  threat tables, and on-hit VFX. The pre/post-mitigation pair is
 *  intentional — most subscribers want post-mitigation ("how much
 *  did this hurt?"), but some (achievements: "deal 10k raw
 *  damage") want raw. */
export const DamageInfoSchema = z.object({
  /** Pre-mitigation amount the caller passed to `applyDamage`.
   *  Useful for "this attack hits for X regardless of armor"
   *  display, raw-damage achievements, dmg-amplification stats. */
  rawAmount: z.number().nonnegative(),
  /** Post-mitigation amount actually subtracted from `health.current`.
   *  This is what a "X damage!" floater should display. Always
   *  `<= rawAmount`; a fully-immune target sees `amount: 0`. */
  amount: z.number().nonnegative(),
  /** Damage type tag — opaque to the framework, narrowed by
   *  apps. Matches keys in `combat.resistances` /
   *  `combat.immunities` for mitigation lookup. */
  type: z.string().min(1),
  /** Optional id of the entity that dealt the damage. We carry
   *  the id (not a live entity reference) so events round-trip
   *  through any future replay / netcode layer cleanly — same
   *  rationale as the `spawnedBy.spawnerId` slot uses. */
  source: z.string().optional(),
  /** Optional flag signalling a critical hit. Game code computes
   *  the crit roll BEFORE calling `applyDamage` and passes the
   *  flag through; the framework just ferries it to subscribers
   *  (UI floaters use it to render a yellow / oversized number). */
  critical: z.boolean().optional(),
});
export type DamageInfo = z.infer<typeof DamageInfoSchema>;
