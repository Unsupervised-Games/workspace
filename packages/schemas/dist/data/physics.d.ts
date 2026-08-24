import { z } from 'zod';
/** Bus event payload for `'physics:collision-started'` /
 *  `'physics:collision-stopped'`. Apps wire the engine's boot
 *  callbacks → `bus.emit('physics:collision-started', payload)`.
 *  Entity references are LIVE Miniplex objects, NOT serialized;
 *  the schema treats them as opaque (`z.unknown()`) to keep this
 *  module pure-data without dragging in Entity's full type. */
export declare const PhysicsCollisionEventSchema: z.ZodObject<{
    /** One endpoint's entity (live ref). */
    a: z.ZodUnknown;
    /** The other endpoint's entity (live ref). */
    b: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    b?: unknown;
    a?: unknown;
}, {
    b?: unknown;
    a?: unknown;
}>;
export type PhysicsCollisionEvent = z.infer<typeof PhysicsCollisionEventSchema>;
/** Bus event payload for `'physics:sensor-entered'` /
 *  `'physics:sensor-exited'`. A sensor doesn't apply contact
 *  forces; it just reports intersection. Both endpoints are
 *  carried so apps can decide "is this the sensor or the
 *  intruder?" by checking schema fields on each. By convention
 *  the sensor is `a` and the intruding body is `b`, but apps
 *  shouldn't rely on the order — check `entity.physics.collider
 *  .isSensor` to disambiguate. */
export declare const PhysicsSensorEventSchema: z.ZodObject<{
    sensor: z.ZodUnknown;
    other: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    sensor?: unknown;
    other?: unknown;
}, {
    sensor?: unknown;
    other?: unknown;
}>;
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
export declare const PhysicsContactForceEventSchema: z.ZodObject<{
    a: z.ZodUnknown;
    b: z.ZodUnknown;
    totalForce: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    totalForceMagnitude: z.ZodNumber;
    maxForceDirection: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    maxForceMagnitude: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalForce: {
        x: number;
        y: number;
        z: number;
    };
    totalForceMagnitude: number;
    maxForceDirection: {
        x: number;
        y: number;
        z: number;
    };
    maxForceMagnitude: number;
    b?: unknown;
    a?: unknown;
}, {
    totalForce: {
        x: number;
        y: number;
        z: number;
    };
    totalForceMagnitude: number;
    maxForceDirection: {
        x: number;
        y: number;
        z: number;
    };
    maxForceMagnitude: number;
    b?: unknown;
    a?: unknown;
}>;
export type PhysicsContactForceEvent = z.infer<typeof PhysicsContactForceEventSchema>;
/** Raycast hit reported by `raycast(...)`. `entity` is a LIVE
 *  Miniplex Entity reference — runtime-only, never serialized. */
export declare const RaycastHitSchema: z.ZodObject<{
    entity: z.ZodUnknown;
    /** World-space hit point. */
    point: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    /** Surface normal at the hit, world-space. */
    normal: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    /** Distance from the ray origin to the hit point. */
    distance: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    normal: {
        x: number;
        y: number;
        z: number;
    };
    distance: number;
    point: {
        x: number;
        y: number;
        z: number;
    };
    entity?: unknown;
}, {
    normal: {
        x: number;
        y: number;
        z: number;
    };
    distance: number;
    point: {
        x: number;
        y: number;
        z: number;
    };
    entity?: unknown;
}>;
export type RaycastHit = z.infer<typeof RaycastHitSchema>;
/** Shape-cast hit. Extends RaycastHit with the witness point on
 *  the swept shape side (where the shape stops). Useful for
 *  "how far can this character capsule move before contact". */
export declare const ShapeCastHitSchema: z.ZodObject<{
    entity: z.ZodUnknown;
    /** World-space hit point. */
    point: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    /** Surface normal at the hit, world-space. */
    normal: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    /** Distance from the ray origin to the hit point. */
    distance: z.ZodNumber;
} & {
    /** Witness on the swept shape — the point on the shape
     *  surface that contacted the target. */
    witness: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
}, "strip", z.ZodTypeAny, {
    normal: {
        x: number;
        y: number;
        z: number;
    };
    distance: number;
    point: {
        x: number;
        y: number;
        z: number;
    };
    witness: {
        x: number;
        y: number;
        z: number;
    };
    entity?: unknown;
}, {
    normal: {
        x: number;
        y: number;
        z: number;
    };
    distance: number;
    point: {
        x: number;
        y: number;
        z: number;
    };
    witness: {
        x: number;
        y: number;
        z: number;
    };
    entity?: unknown;
}>;
export type ShapeCastHit = z.infer<typeof ShapeCastHitSchema>;
//# sourceMappingURL=physics.d.ts.map