// Recast Crowd shapes — bus event payload enums.
//
// The `crowdAgent` ECS slot lives in `ecs/components.ts`
// alongside `navAgent`; this file only holds the data-shaped
// types that bus payloads narrow on. Keeping the enum in
// `@unsupervised/schemas` (not in `@unsupervised/ai`) lets bus subscribers
// narrow without pulling the recast WASM dep transitively.
import { z } from 'zod';
/** Reason the system fires `'crowd:agent-stuck'`. Apps narrow
 *  on the value in their subscribers — e.g., teleport on
 *  `'invalid-state'`, re-route on `'no-path'`. */
export const CrowdStuckReasonSchema = z.enum([
    'no-path',
    'off-mesh',
    'invalid-state',
]);
/** Per-pair interaction policy for multi-crowd setups.
 *
 *  - `cooperative` — agents share avoidance via the SAME
 *    dtCrowd; this is the "same team, same crowd" case. The
 *    matrix doesn't actually need this entry — same-crowd
 *    pairs are always cooperative because they live in one
 *    `dtCrowd`. Listed for completeness + future-proofing
 *    if cross-crowd cooperative ever ships.
 *
 *  - `opaque` — cross-crowd agents push each other apart via
 *    the `applyCrossCrowdSeparation` post-step helper.
 *    Mount & Blade / Total War shape (red team blocks blue
 *    team).
 *
 *  - `transparent` — no cross-crowd interaction (the
 *    default for unlisted pairs). Civilians phasing through
 *    soldiers is the canonical use case. */
export const CrowdInteractionPolicySchema = z.enum([
    'cooperative',
    'opaque',
    'transparent',
]);
/** Cross-crowd interaction matrix.
 *
 *  Shape: `matrix[crowdIdA]?.[crowdIdB]` = the policy crowd
 *  A applies WHEN seeing crowd B's agents. The matrix is
 *  not required to be symmetric — `red ↔ civilian` could be
 *  `transparent` while `civilian ↔ red` is `opaque` (one-way
 *  blocking is unusual but supported).
 *
 *  Unlisted pairs default to `transparent` (no interaction).
 *  Self-pairs (e.g. `red ↔ red`) are ignored — same-crowd
 *  avoidance is always handled inside dtCrowd, not via this
 *  matrix.
 *
 *  Apps construct this object at boot and pass it once to
 *  `applyCrossCrowdSeparation`; the helper resolves the
 *  policy per (system, peer-system) pair each tick. */
export const CrowdInteractionMatrixSchema = z.record(z.string(), z.record(z.string(), CrowdInteractionPolicySchema));
//# sourceMappingURL=crowd.js.map