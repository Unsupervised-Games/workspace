// Physics shapes shared across modules — bus event payloads,
// query result types. These are runtime-shape contracts only; the
// ECS-side joint slot schemas live in `../ecs/components.ts`
// alongside the other entity slots.
//
// Why a separate file: bus events + query hits aren't ECS slots
// — they don't live on entities. They DO need to be type-stable
// across the engine ↔ features ↔ app boundaries, which is what
// `@unsupervised/schemas` is for. Mirrors the pattern set by
// `data/blendshape.ts` (slots in ecs/, events in data/).

import { z } from 'zod';
import { Vec3Schema } from '../ecs/components.js';

/** Bus event payload for `'physics:collision-started'` /
 *  `'physics:collision-stopped'`. Apps wire the engine's boot
 *  callbacks → `bus.emit('physics:collision-started', payload)`.
 *  Entity references are LIVE Miniplex objects, NOT serialized;
 *  the schema treats them as opaque (`z.unknown()`) to keep this
 *  module pure-data without dragging in Entity's full type. */
export const PhysicsCollisionEventSchema = z.object({
  /** One endpoint's entity (live ref). */
  a: z.unknown(),
  /** The other endpoint's entity (live ref). */
  b: z.unknown(),
});
export type PhysicsCollisionEvent = z.infer<
  typeof PhysicsCollisionEventSchema
>;

/** Bus event payload for `'physics:sensor-entered'` /
 *  `'physics:sensor-exited'`. A sensor doesn't apply contact
 *  forces; it just reports intersection. Both endpoints are
 *  carried so apps can decide "is this the sensor or the
 *  intruder?" by checking schema fields on each. By convention
 *  the sensor is `a` and the intruding body is `b`, but apps
 *  shouldn't rely on the order — check `entity.physics.collider
 *  .isSensor` to disambiguate. */
export const PhysicsSensorEventSchema = z.object({
  sensor: z.unknown(),
  other: z.unknown(),
});
export type PhysicsSensorEvent = z.infer<typeof PhysicsSensorEventSchema>;

/** Bus event payload for `'physics:contact-force'`. Fires when
 *  the total contact-force magnitude between two colliders exceeds
 *  EITHER collider's `contactForceEventThreshold` (Newtons —
 *  Rapier's force unit, same SI scale as `applyForce`).
 *
 *  Apps tune the threshold per-collider to filter resting / micro
 *  contacts. **Critical:** the threshold MUST exceed every
 *  interacting body's `mass × |gravity|` (≈ 9.81 × mass for
 *  default gravity), otherwise a resting body's normal force
 *  fires the event at 60 Hz forever. See
 *  [ColliderSchema.contactForceEventThreshold](../ecs/components.ts)
 *  for the full gotcha doc.
 *
 *  All four magnitude / vector fields are exposed because they
 *  are semantically distinct (Rapier docs: "totalForceMagnitude
 *  is NOT the same as the magnitude of totalForce — here we are
 *  summing magnitudes of each contact-point force, not taking
 *  the magnitude of their sum"). Pick the field your damage /
 *  knockback formula needs:
 *
 *  - `totalForceMagnitude` — sum-of-magnitudes across every
 *    contact point in this pair. Best for "total impact energy"
 *    semantics (impact damage, fall damage).
 *  - `maxForceMagnitude` — largest single contact-point force.
 *    Best for "did this exceed a breaking threshold?" semantics
 *    (destructible surfaces, glass-shatter checks).
 *  - `totalForce` — vector sum across contact points. Reliable
 *    for *magnitude* use cases (audio impact-velocity, screen-
 *    shake intensity). **Caveat:** Rapier's docs don't specify
 *    whether the vector is reported with respect to collider `a`
 *    or `b`, so the sign / direction is implementation-defined.
 *    For directional effects prefer `maxForceDirection`; for
 *    "game-feel" knockback (non-physical projectile recoil)
 *    drive `applyImpulse` from your projectile's own velocity
 *    rather than this vector. Rapier's solver has already applied
 *    the physically-correct contact impulse to both bodies before
 *    this event fires.
 *  - `maxForceDirection` — world-space unit direction of the
 *    strongest contact point. Best for surface-normal-aware
 *    effects (sparks emit along this vector).
 *
 *  Entity references are LIVE Miniplex objects — runtime-only,
 *  never serialized. The schema treats them as opaque
 *  (`z.unknown()`) so this module stays pure-data without
 *  dragging in Entity's full type. */
export const PhysicsContactForceEventSchema = z.object({
  a: z.unknown(),
  b: z.unknown(),
  totalForce: Vec3Schema,
  totalForceMagnitude: z.number().nonnegative(),
  maxForceDirection: Vec3Schema,
  maxForceMagnitude: z.number().nonnegative(),
});
export type PhysicsContactForceEvent = z.infer<
  typeof PhysicsContactForceEventSchema
>;

/** Raycast hit reported by `raycast(...)`. `entity` is a LIVE
 *  Miniplex Entity reference — runtime-only, never serialized. */
export const RaycastHitSchema = z.object({
  entity: z.unknown(),
  /** World-space hit point. */
  point: Vec3Schema,
  /** Surface normal at the hit, world-space. */
  normal: Vec3Schema,
  /** Distance from the ray origin to the hit point. */
  distance: z.number().nonnegative(),
});
export type RaycastHit = z.infer<typeof RaycastHitSchema>;

/** Shape-cast hit. Extends RaycastHit with the witness point on
 *  the swept shape side (where the shape stops). Useful for
 *  "how far can this character capsule move before contact". */
export const ShapeCastHitSchema = RaycastHitSchema.extend({
  /** Witness on the swept shape — the point on the shape
   *  surface that contacted the target. */
  witness: Vec3Schema,
});
export type ShapeCastHit = z.infer<typeof ShapeCastHitSchema>;
