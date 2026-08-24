// ECS component schemas.
//
// Each exported schema is (a) a runtime Zod validator used at system
// boundaries — JSON asset loading, network messages, persistence — and
// (b) the shape that the engine's systems consume via `z.infer`. Keeping
// one definition prevents the inferred type from ever drifting away from
// what the validator accepts.
//
// Conventions used throughout this file, and assumed by every downstream
// package:
//   - Units are SI: meters, kilograms, seconds, radians.
//   - World is right-handed with +Y up (Three.js / Rapier default).
//   - Rotations are quaternions; Euler angles only appear at UI boundaries
//     to avoid gimbal-lock bugs creeping into the simulation.
//   - Component field names are lowerCamelCase; schemas are PascalCase
//     with a `Schema` suffix; inferred types drop the suffix.
import { z } from 'zod';
import { GridTopologySchema, TileCoordSchema, TileDataSchema, TurnModeSchema, TurnPhaseSchema, } from '../data/grid.js';
import { ItemInstanceSchema } from '../data/item.js';
import { StatusEffectInstanceSchema } from '../data/statusEffect.js';
import { ActiveQuestSchema } from '../data/quest.js';
import { DayNightPhaseSchema, PhaseThresholdsSchema, ScheduledHandleSchema, } from '../data/time.js';
/**
 * Two-dimensional vector. Used for 2D-native data that has no meaningful
 * depth axis — sprite anchors, 2D UI positions, 2D screen-space offsets.
 * For world-space positions in a 2D simulation we still use Vec3 (with
 * z left at 0 or used as a depth layer) to keep Transform uniform across
 * the 2D and 3D engines. See Vec3Schema for the distinction.
 */
export const Vec2Schema = z.object({
    x: z.number(),
    y: z.number(),
});
/**
 * Three-dimensional vector. Used for positions, scales, linear/angular
 * velocities, and any other {x,y,z} quantity. Always in world-local units
 * appropriate to the field (meters for position, m/s for linear velocity,
 * etc.) — document units at the USE site, not here.
 */
export const Vec3Schema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
});
/**
 * Unit quaternion representing a 3D rotation. Callers are expected to
 * normalize; the schema does NOT enforce ||q|| == 1 because strict
 * equality on floats is a trap. If a system requires a normalized
 * quaternion it should normalize on read.
 */
export const QuaternionSchema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    w: z.number(),
});
// ---------------------------------------------------------------------------
// Transform — spatial component attached to anything that exists in the world.
// Written by: physics integration, animation systems, authoring tools.
// Read by:    renderer, physics (to seed bodies), queries / spatial indexes.
// ---------------------------------------------------------------------------
export const TransformSchema = z.object({
    /** World-space position, meters. */
    position: Vec3Schema,
    /** World-space orientation as a unit quaternion. */
    rotation: QuaternionSchema,
    /** Per-axis scale multiplier; (1,1,1) is identity. Non-uniform scale is
     *  allowed but tends to fight physics — prefer uniform where possible. */
    scale: Vec3Schema,
});
// ---------------------------------------------------------------------------
// Velocity — kinematic state. Present on dynamic or kinematic entities;
// omit on static geometry. Physics owns this component on dynamic bodies;
// gameplay may write it on kinematic bodies.
// ---------------------------------------------------------------------------
export const VelocitySchema = z.object({
    /** Linear velocity in m/s. */
    linear: Vec3Schema,
    /** Angular velocity in rad/s, per world axis. */
    angular: Vec3Schema,
});
// ---------------------------------------------------------------------------
// Renderable — the ONLY bridge from headless simulation to the rendering
// layer. Two dimensional variants (2D / 3D) share a single discriminant
// field so downstream renderers can switch on `type` and get the full
// narrow shape with no casts.
//
// Strict separation is intentional: a 2D scene rendered by PixiJS has no
// meaningful concept of `castShadow`, and a 3D scene rendered by
// ThreeJS has no meaningful concept of `zIndex`. Sharing one flat type
// with both sets of fields would let callers pick invalid combinations
// and defer the error to runtime. Discriminated unions make the invalid
// states unrepresentable.
//
// The asset-registry contract still holds: geometry / sprites / models
// / materials are referenced by string ID; the renderer resolves the
// IDs against its own registry. Simulation code never touches GPU or
// canvas resources directly.
// ---------------------------------------------------------------------------
/** Sprite composition mode — a renderer-neutral subset. 2D renderers
 *  map each literal onto their native blend primitive ('normal' is
 *  source-over, 'add' is linear-add, etc.). The set is deliberately
 *  small; most games never need more. */
export const BlendModeSchema = z.enum([
    'normal',
    'add',
    'multiply',
    'screen',
]);
/** 2D renderable — consumed by a 2D renderer (PixiJS and friends).
 *  `zIndex` is the painter's-algorithm draw order; `tint` is a
 *  renderer-neutral 0xRRGGBB multiplier applied to the sprite. */
export const Renderable2DSchema = z.object({
    type: z.literal('2d'),
    /** Asset-registry key for the sprite / texture. */
    spriteId: z.string().min(1),
    /** Optional 0xRRGGBB tint multiplied into the sprite color. */
    tint: z.number().int().nonnegative().optional(),
    /** Optional painter's-algorithm layer index. Higher draws on top. */
    zIndex: z.number().int().optional(),
    /** Whether the renderer should draw this entity. Renderer default
     *  is `true`; set to `false` to hide an entity without removing it
     *  from the world (stealth, culling, debug toggles). */
    visible: z.boolean().optional(),
    /** Sprite anchor (pivot) as a 0–1 fraction of the sprite's bounds.
     *  (0, 0) is top-left; (0.5, 0.5) is center; (1, 1) is bottom-right.
     *  Renderer default is (0.5, 0.5) — rotations pivot around the
     *  sprite's center, which is the standard game-sprite convention. */
    anchor: Vec2Schema.optional(),
    /** Multiplicative alpha, 0 = fully transparent, 1 = fully opaque.
     *  Renderer default is 1. */
    opacity: z.number().min(0).max(1).optional(),
    /** Composition mode. Renderer default is 'normal'. Useful values:
     *  'add' for glows / lasers / particles; 'multiply' for shadows. */
    blendMode: BlendModeSchema.optional(),
});
/** 3D renderable — consumed by a 3D renderer (ThreeJS and friends).
 *  `materialId` is optional because the renderer can supply a default
 *  material when none is specified. */
export const Renderable3DSchema = z.object({
    type: z.literal('3d'),
    /** Asset-registry key for the mesh / model. */
    modelId: z.string().min(1),
    /** Asset-registry key for the material. Optional — the renderer
     *  substitutes a default when absent. */
    materialId: z.string().min(1).optional(),
    /** Whether this entity contributes to the shadow map. */
    castShadow: z.boolean().optional(),
    /** Whether shadows from other casters fall on this entity. Renderer
     *  default is `true`; set `false` for skyboxes, self-lit HUD
     *  elements, and anything that shouldn't receive scene lighting
     *  occlusion. */
    receiveShadow: z.boolean().optional(),
    /** Whether the renderer should draw this entity. Renderer default
     *  is `true`; see the 2D variant for the same semantics. */
    visible: z.boolean().optional(),
});
/** Discriminated union over both renderable variants. The `type` literal
 *  is the discriminant — callers can `switch (r.type)` and TypeScript
 *  narrows to the correct variant with no runtime instanceof checks. */
export const RenderableUnionSchema = z.discriminatedUnion('type', [
    Renderable2DSchema,
    Renderable3DSchema,
]);
// ---------------------------------------------------------------------------
// PhysicsBody — description handed to the physics engine (Rapier) when an
// entity's body is instantiated. Not the live runtime body; that lives in
// the physics world. This is the declarative spec.
// ---------------------------------------------------------------------------
/** Motion class of the rigid body. */
export const BodyTypeSchema = z.enum(['dynamic', 'static', 'kinematic']);
// --- Collider variants ------------------------------------------------------
// A discriminated union on `shape` so each primitive carries only the
// parameters it actually needs. A 2D engine will ignore the `z` component
// of a box's `halfExtents` — same contract as the shared 3D Transform.
/** Axis-aligned box collider. `halfExtents` are half of the full size per
 *  axis — a 2×4×2 box has halfExtents `{ x: 1, y: 2, z: 1 }`. */
export const BoxColliderSchema = z.object({
    shape: z.literal('box'),
    halfExtents: Vec3Schema,
});
/** Uniform sphere collider (3D) / disk collider (2D). */
export const SphereColliderSchema = z.object({
    shape: z.literal('sphere'),
    radius: z.number().positive(),
});
/** Capsule — cylindrical section plus hemispherical caps. Total height
 *  along the local Y axis is `2 * (halfHeight + radius)`. 2D engines
 *  treat this as a capsule in the XY plane. */
export const CapsuleColliderSchema = z.object({
    shape: z.literal('capsule'),
    halfHeight: z.number().positive(),
    radius: z.number().positive(),
});
/** Pre-baked triangle-soup collider. `meshId` is an asset-registry key
 *  resolved to vertex/index arrays by the physics system. Expensive —
 *  reserved for static level geometry, never for dynamic bodies. */
export const MeshColliderSchema = z.object({
    shape: z.literal('mesh'),
    meshId: z.string().min(1),
});
/** Cylinder collider (Phase 1). Total height along local Y is
 *  `2 * halfHeight`; radius is in the XZ plane. Useful for legs of
 *  compound bodies, pillars, props with a barrel-like profile. */
export const CylinderColliderSchema = z.object({
    shape: z.literal('cylinder'),
    halfHeight: z.number().positive(),
    radius: z.number().positive(),
});
/** Convex-hull collider (Phase 1). Apps pass authored vertex
 *  positions as a flat `[x, y, z, x, y, z, …]` Float32 array; the
 *  physics system feeds them to Rapier's hull computation. Use for
 *  irregular rigid props (rocks, debris) where a box / sphere is too
 *  crude but a trimesh is overkill. Minimum 4 unique non-coplanar
 *  points; Rapier rejects degenerate inputs internally. */
export const ConvexHullColliderSchema = z.object({
    shape: z.literal('convex-hull'),
    points: z
        .array(z.number())
        .refine((p) => p.length % 3 === 0 && p.length >= 12, {
        message: 'convex-hull points must be a flat [x,y,z,...] array with at least 4 vertices (length divisible by 3, >= 12)',
    }),
});
/** Trimesh collider (Phase 1). Triangle-soup geometry — vertex
 *  positions in a flat `[x, y, z, …]` array, plus triangle indices
 *  in a flat `[i0, i1, i2, …]` array. STATIC ONLY. Dynamic trimesh is
 *  an order of magnitude slower than primitive shapes AND
 *  trimesh-trimesh collision doesn't exist; the physics system
 *  rejects dynamic + trimesh with a clear error at body creation. */
export const TrimeshColliderSchema = z.object({
    shape: z.literal('trimesh'),
    vertices: z.array(z.number()),
    indices: z.array(z.number().int().nonnegative()),
});
/** Heightfield collider (Phase 1). Rapier reads `nrows` / `ncols`
 *  as the number of *cells* (quad subdivisions) along the X / Z axes,
 *  so `heights.length` MUST equal `(nrows + 1) * (ncols + 1)` — one
 *  sample per cell corner. Mismatching dimensions is a WASM panic
 *  ("unreachable") inside Rapier; the body-creation system guards
 *  this with a clean error before construction. `scale.x` spans
 *  `ncols` cells, `scale.z` spans `nrows`, `scale.y` multiplies the
 *  height values. STATIC ONLY for the same reasons as trimesh. */
export const HeightfieldColliderSchema = z.object({
    shape: z.literal('heightfield'),
    heights: z.array(z.number()),
    nrows: z.number().int().positive(),
    ncols: z.number().int().positive(),
    scale: Vec3Schema,
});
/** Compound-child variants (Phase 1). A subset of collider shapes
 *  that can live as children of a `CompoundColliderSchema`. Each
 *  carries its own local offset + rotation relative to the parent
 *  body's origin. Compound children are NOT allowed to be compound
 *  themselves (one level of nesting), and trimesh / heightfield are
 *  excluded — those primitives are too heavy / static-only to
 *  compose into a single rigid body. Apps that need that shape parent
 *  entities + use fixed joints instead.
 *
 *  Each variant is spelled out as a separate schema (rather than
 *  reusing the top-level collider schemas via `.and(...)`) because
 *  Zod discriminated unions don't compose with intersection types
 *  cleanly. */
export const CompoundChildBoxSchema = z.object({
    shape: z.literal('box'),
    halfExtents: Vec3Schema,
    localOffset: Vec3Schema,
    localRotation: QuaternionSchema,
});
export const CompoundChildSphereSchema = z.object({
    shape: z.literal('sphere'),
    radius: z.number().positive(),
    localOffset: Vec3Schema,
    localRotation: QuaternionSchema,
});
export const CompoundChildCapsuleSchema = z.object({
    shape: z.literal('capsule'),
    halfHeight: z.number().positive(),
    radius: z.number().positive(),
    localOffset: Vec3Schema,
    localRotation: QuaternionSchema,
});
export const CompoundChildCylinderSchema = z.object({
    shape: z.literal('cylinder'),
    halfHeight: z.number().positive(),
    radius: z.number().positive(),
    localOffset: Vec3Schema,
    localRotation: QuaternionSchema,
});
export const CompoundChildConvexHullSchema = z.object({
    shape: z.literal('convex-hull'),
    points: z
        .array(z.number())
        .refine((p) => p.length % 3 === 0 && p.length >= 12, {
        message: 'convex-hull points must be a flat [x,y,z,...] array with at least 4 vertices',
    }),
    localOffset: Vec3Schema,
    localRotation: QuaternionSchema,
});
export const CompoundChildSchema = z.discriminatedUnion('shape', [
    CompoundChildBoxSchema,
    CompoundChildSphereSchema,
    CompoundChildCapsuleSchema,
    CompoundChildCylinderSchema,
    CompoundChildConvexHullSchema,
]);
/** Compound collider (Phase 1) — one rigid body with N attached
 *  child colliders. Mass + inertia are computed by Rapier from the
 *  union of children's volumes. Use for shapes a single primitive
 *  can't represent: a "table" (box top + 4 cylinder legs), a "rock
 *  pile" (multiple spheres + boxes), a vehicle chassis assembled
 *  from box parts. */
export const CompoundColliderSchema = z.object({
    shape: z.literal('compound'),
    children: z.array(CompoundChildSchema).min(1),
});
/** Common collider event-opt-in flags shared by every variant.
 *
 *  - `isSensor` — sensor (no contact force) vs. solid (default).
 *  - `emitCollisionEvents` — opt-in to `'physics:collision-started'`
 *    / `'physics:collision-stopped'` bus events. Sensors auto-emit
 *    intersection events; solid bodies are silent until this flag
 *    is set. Cost is per-step bookkeeping in the Rapier event
 *    queue — leave undefined unless the app needs the event.
 *  - `contactForceEventThreshold` — opt-in to
 *    `'physics:contact-force'` bus events. Rapier fires the event
 *    when the total contact-force magnitude exceeds this threshold
 *    (Newtons — Rapier's unit; same SI scale as `applyForce`). The
 *    value doubles as opt-in (undefined or 0 = off) AND noise
 *    filter.
 *
 *    **Resting-weight gotcha (production-critical):** an object
 *    resting on a surface under gravity produces a continuous
 *    normal force equal to `mass × |gravity|` Newtons. With the
 *    default gravity of 9.81 m/s², a 2 kg box on the ground
 *    contributes 19.62 N to the contact-force pair *every tick*.
 *    A threshold below that value means the resting contact fires
 *    events at 60 Hz forever — your damage subscriber will obliterate
 *    every resting body in milliseconds. **Set the threshold ABOVE
 *    every interacting body's static normal force.** Rule of thumb:
 *    `threshold > 1.5 × max(mass × |gravity|)` across all
 *    expected resting pairs.
 *
 *    Pair semantics: Rapier fires when EITHER collider's threshold
 *    is exceeded by the contact-force magnitude. For symmetric
 *    "both must opt in" behavior, set matching thresholds on both
 *    bodies; for "everything that hits this fragile thing fires
 *    events" set the threshold on the fragile side only.
 *
 *    Compound children inherit the parent's threshold (per-child
 *    override is out of scope; reach for `body.collider(i)
 *    .setContactForceEventThreshold(...)` post-spawn if needed). */
const colliderEventFlags = {
    isSensor: z.boolean().optional(),
    emitCollisionEvents: z.boolean().optional(),
    contactForceEventThreshold: z.number().positive().optional(),
};
/** Discriminated union of every collider variant. Callers switch
 *  on `collider.shape` and get the narrow shape with no casts.
 *  Event-opt-in flags are inlined on each variant rather than
 *  added via intersection — keeps the schema composable with
 *  Zod's `EntitySchema.shape.physics.optional()` pattern. */
export const ColliderSchema = z.discriminatedUnion('shape', [
    BoxColliderSchema.extend(colliderEventFlags),
    SphereColliderSchema.extend(colliderEventFlags),
    CapsuleColliderSchema.extend(colliderEventFlags),
    MeshColliderSchema.extend(colliderEventFlags),
    CylinderColliderSchema.extend(colliderEventFlags),
    ConvexHullColliderSchema.extend(colliderEventFlags),
    TrimeshColliderSchema.extend(colliderEventFlags),
    HeightfieldColliderSchema.extend(colliderEventFlags),
    CompoundColliderSchema.extend(colliderEventFlags),
]);
// --- PhysicsBody -----------------------------------------------------------
export const PhysicsBodySchema = z.object({
    bodyType: BodyTypeSchema,
    /** Mass in kg. 0 is only valid for static bodies; dynamic bodies with
     *  mass == 0 are an engine-level error. Not enforced here because the
     *  combined invariant spans two fields — validate at the entity level
     *  or at the physics-system boundary. */
    mass: z.number().nonnegative(),
    /** The collider primitive to build. Each variant carries its own
     *  dimensions, so the physics system can spawn a Rapier collider
     *  without consulting an external registry for simple primitives. */
    collider: ColliderSchema,
    /** Bounciness, 0–1. 0 = perfectly inelastic (sticks on contact),
     *  1 = lossless elastic. Default when omitted is engine-specific
     *  (Rapier: 0). */
    restitution: z.number().min(0).max(1).optional(),
    /** Surface friction coefficient. 0 = ice, ~1 = rubber. Default
     *  engine-specific (Rapier: 0.5). */
    friction: z.number().nonnegative().optional(),
    /** Linear velocity damping, applied each second. Models air drag;
     *  0 = none, higher values bleed off velocity faster. */
    linearDamping: z.number().nonnegative().optional(),
    /** Angular velocity damping, applied each second. Slows spin. */
    angularDamping: z.number().nonnegative().optional(),
    /**
     * Per-axis locks for translation and rotation. `true` on an axis
     * means "this axis is FROZEN" — Rapier won't integrate forces or
     * torques along/around it. Both inner objects are independently
     * optional, so a typical 3D character only needs
     * `lockedAxes: { rotation: { x: true, z: true } }` to stay
     * upright while still rotating to face direction (y).
     *
     * Axis semantics:
     *   - 3D: all six fields apply directly to Rapier's
     *     `setEnabledTranslations(x, y, z)` and
     *     `setEnabledRotations(x, y, z)`.
     *   - 2D: only `translation.x`, `translation.y`, and `rotation.z`
     *     are physically meaningful. The 2D engine ignores
     *     `translation.z` and `rotation.{x,y}` — they correspond to
     *     axes that don't exist in 2D physics.
     *
     * Rationale for the split (vs. a flat `{x, y, z}`): the previous
     * shape had different meanings in 2D vs. 3D — the same `z: true`
     * would lock rotation in 2D but translation in 3D. That's an
     * engine-specific semantic leak in a schema that's supposed to
     * be headless. Splitting translation from rotation makes the
     * authoring intent unambiguous in both engines.
     */
    lockedAxes: z
        .object({
        translation: z
            .object({
            x: z.boolean().optional(),
            y: z.boolean().optional(),
            z: z.boolean().optional(),
        })
            .optional(),
        rotation: z
            .object({
            x: z.boolean().optional(),
            y: z.boolean().optional(),
            z: z.boolean().optional(),
        })
            .optional(),
    })
        .optional(),
});
// ---------------------------------------------------------------------------
// Joints (Phase 1) — entity-side joint references for the physics
// engine. A joint connects TWO entities; the slot lives on the
// entity holding "side A" (apps choose which side; the joint system
// reconciles either way). The other endpoint is referenced by stable
// `entity.id` so joints survive save/load round-trips and replay.
//
// Five joint kinds map directly to Rapier's `JointData` factories:
//   - fixed    — weld (no relative motion; Ultrahand assembly)
//   - revolute — hinge (rotation around an axis; doors, wheels)
//   - prismatic — slider (translation along an axis; pistons)
//   - spherical — ball-socket (3 rotational DoF; pendulums)
//   - distance — rope/spring (held to a distance; tethers)
//
// `handle` is assigned at joint creation by the engine's joint
// system + threaded back into the slot. Apps reference the handle
// to call `destroyJoint(handle)`. Saves round-trip the handle; on
// load, the joint system re-creates the Rapier joint and assigns a
// fresh handle (the slot's old handle becomes the new one).
// ---------------------------------------------------------------------------
const JointMotorSchema = z.object({
    /** Target velocity at the joint (rad/s for revolute, m/s for
     *  prismatic). */
    targetVel: z.number(),
    /** Maximum force the motor can apply to reach `targetVel`.
     *  Higher = stiffer follow; lower = motor "slips" under load. */
    maxForce: z.number().nonnegative(),
});
/** Fixed-weld joint. Locks all 6 DoF between two entities;
 *  Ultrahand-style assembly uses this. */
export const FixedJointSlotSchema = z.object({
    kind: z.literal('fixed'),
    /** Stable id of the OTHER endpoint entity. */
    otherEntityId: z.string().min(1),
    /** Stable numeric handle assigned by the joint system at
     *  creation time. Apps pass this to `destroyJoint`. */
    handle: z.number().int().nonnegative(),
    localAnchorA: Vec3Schema,
    localAnchorB: Vec3Schema,
    localFrameA: QuaternionSchema.optional(),
    localFrameB: QuaternionSchema.optional(),
});
/** Revolute (hinge) joint. One rotational DoF around `axis`. */
export const RevoluteJointSlotSchema = z.object({
    kind: z.literal('revolute'),
    otherEntityId: z.string().min(1),
    handle: z.number().int().nonnegative(),
    localAnchorA: Vec3Schema,
    localAnchorB: Vec3Schema,
    axis: Vec3Schema,
    /** Optional angular limits in radians. `[min, max]`; angles
     *  outside the range are constrained. */
    limits: z.tuple([z.number(), z.number()]).optional(),
    motor: JointMotorSchema.optional(),
});
/** Prismatic (slider) joint. One translational DoF along
 *  `axis`. */
export const PrismaticJointSlotSchema = z.object({
    kind: z.literal('prismatic'),
    otherEntityId: z.string().min(1),
    handle: z.number().int().nonnegative(),
    localAnchorA: Vec3Schema,
    localAnchorB: Vec3Schema,
    axis: Vec3Schema,
    /** Optional translation limits along the axis. */
    limits: z.tuple([z.number(), z.number()]).optional(),
    motor: JointMotorSchema.optional(),
});
/** Spherical (ball-socket) joint. 3 rotational DoF. */
export const SphericalJointSlotSchema = z.object({
    kind: z.literal('spherical'),
    otherEntityId: z.string().min(1),
    handle: z.number().int().nonnegative(),
    localAnchorA: Vec3Schema,
    localAnchorB: Vec3Schema,
});
/** Distance (rope / spring) joint. Constrains the bodies to a
 *  specific distance apart. `stiffness === 0` (default) is a
 *  rigid rope; positive values produce a damped spring. */
export const DistanceJointSlotSchema = z.object({
    kind: z.literal('distance'),
    otherEntityId: z.string().min(1),
    handle: z.number().int().nonnegative(),
    localAnchorA: Vec3Schema,
    localAnchorB: Vec3Schema,
    /** Rest length in world units. */
    length: z.number().nonnegative(),
    /** Spring stiffness. 0 = rigid; positive values = spring. */
    stiffness: z.number().nonnegative().optional(),
    damping: z.number().nonnegative().optional(),
});
/** Discriminated union of every joint kind. Apps switch on
 *  `slot.kind` for typed narrowing. */
export const JointSlotSchema = z.discriminatedUnion('kind', [
    FixedJointSlotSchema,
    RevoluteJointSlotSchema,
    PrismaticJointSlotSchema,
    SphericalJointSlotSchema,
    DistanceJointSlotSchema,
]);
// ---------------------------------------------------------------------------
// Health — gameplay component. Not all entities have health; enemies,
// players, destructibles do. Invariant: 0 <= current <= max. Enforcement
// is deferred to systems that mutate these fields so that composing
// Health into EntitySchema via `.optional()` stays a plain ZodObject
// (refinements would turn it into a ZodEffects and complicate the
// partial-entity composition).
// ---------------------------------------------------------------------------
export const HealthSchema = z.object({
    current: z.number().nonnegative(),
    max: z.number().positive(),
});
// ---------------------------------------------------------------------------
// Persist — flag component that exempts an entity from scene-level purges.
//
// The mere PRESENCE of the `persist` slot on an entity is the signal —
// SceneManager's "deep clean" iterates the world during a LOADING_SCENE
// transition and skips anything carrying this component. Typical use: the
// player avatar, a Hub-world NPC, or a global audio listener that should
// outlive level boundaries.
//
// The optional `reason` field exists purely for debug overlays — it lets a
// dev tool render "why is this entity sticking around across scene loads?"
// without us having to invent a separate tagging system.
// ---------------------------------------------------------------------------
export const PersistSchema = z.object({
    /** Optional human-readable label shown in debug overlays. Has no
     *  runtime effect — the SceneManager only checks for the slot's
     *  presence, not its contents. */
    reason: z.string().optional(),
});
// ---------------------------------------------------------------------------
// SceneOwner — INTERNAL bookkeeping component.
//
// Managed exclusively by `SceneManager` via the `SceneSpawner` wrapper that
// it passes into every scene's `setup()`. Consumer code should NEVER write
// this slot directly — the spawner injects it on `add()` so it's correct by
// construction. (Reading the slot for debug overlays / dev tooling is fine.)
//
// What it powers:
//   - `unloadScene(sceneId)` performs targeted destruction by querying for
//     entities whose `sceneOwner.sceneId` matches. That's how additive
//     scenes (an Inventory overlay layered over Level One) can be torn
//     down without disturbing the base scene's entities.
//   - `executeLoad`'s interstitial loading screen reuses the same machinery
//     to clean up the temporary `DefaultLoadingScene` entities once the
//     target scene's preload resolves.
//
// Layering with `persist`:
//   - During the global purge inside `executeLoad`, `persist` trumps
//     `sceneOwner` — entities marked persist survive the purge regardless
//     of which scene tagged them.
//   - During a targeted `unloadScene`, `sceneOwner` wins: an additive
//     scene's entities are torn down even if they happen to carry persist
//     (which would be unusual but is the contract).
// ---------------------------------------------------------------------------
export const SceneOwnerSchema = z.object({
    /** ID of the scene that spawned this entity. Set by the
     *  SceneSpawner wrapper that SceneManager passes into setup(). */
    sceneId: z.string().min(1),
});
// ---------------------------------------------------------------------------
// Emitter — particle source. Drives `@unsupervised/vfx`'s GPU-instanced
// particle system without spawning per-particle ECS entities.
//
// Key architectural rule (Phase 17): individual particles are NOT
// ECS entities. The ECS only knows about emitters; the GPU does
// the per-particle simulation against a pre-allocated Float32Array
// ring buffer inside ParticleSystem. Putting tens of thousands of
// particles in Miniplex would smoke the per-tick query iteration
// and the JS GC; this component is the boundary between gameplay
// (one Emitter entity per source) and rendering (10k+ instances).
//
// The emitter's spawn position comes from the entity's Transform
// component every frame — VFXSystem queries `world.with('transform',
// 'emitter')` and reads `transform.position` at emission time, so
// gameplay can move the emitter freely (sweeping a flame-thrower,
// chasing a rocket trail) and particles will be born at the
// instantaneous coordinates while flying off independently.
// ---------------------------------------------------------------------------
/** RGB color in 0..1 space, matching THREE.Color's normalized
 *  range. Kept separate from BlendMode-style enums because per-
 *  emitter color tinting is variable, not a fixed renderer mode. */
export const ColorRGBSchema = z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
});
// ---------------------------------------------------------------------------
// NavAgent — pathfinding intent. Drives `@unsupervised/ai`'s NavSystem.
//
// The schema is the INTENT layer: gameplay code mutates `target`
// ("go to that point") and the renderer-adjacent NavSystem
// computes the path via Recast/Detour and feeds desired velocity
// into `entity.velocity.linear`. The AI never touches transform
// directly when a physics body is present — physics owns spatial
// truth; the AI just expresses intent.
//
// Architectural rule (Tier 1 #5):
//   - With a physics body: NavSystem writes velocity; Rapier
//     integrates position with collision detection. Recommended
//     bodyType is `kinematic` so stray impacts don't push the
//     agent off its path, but `dynamic` is supported too for
//     "ragdoll-able" agents.
//   - Without a physics body: NavSystem falls back to direct
//     transform integration. Documented as the exception path.
//
// Internal path state (the computed waypoint sequence and the
// current pathIndex) is intentionally NOT in the schema — it
// lives in NavSystem's per-entity side-table. Putting derived
// state in the schema would invite gameplay code to mutate it
// and create races; the side-table is owned exclusively by the
// NavSystem.
// ---------------------------------------------------------------------------
export const NavAgentSchema = z.object({
    /** Movement speed in world units / second along the path. */
    speed: z.number().nonnegative(),
    /** Distance threshold (world units) for "arrived at the next
     *  waypoint" — when within this radius of `path[pathIndex]`,
     *  the agent advances to the next point. Default 0.5. */
    arrivalRadius: z.number().nonnegative().optional(),
    /** Current target world position. Setting this triggers a
     *  path replan on the next tick. Set null to halt the agent
     *  (NavSystem clears the path and zeroes velocity). */
    target: Vec3Schema.nullable().optional(),
});
// ---------------------------------------------------------------------------
// CrowdAgent — multi-agent pathfinding intent. Drives `@unsupervised/ai`'s
// CrowdSystem via `dtCrowd` batched updates.
//
// The schema is the INTENT layer (mirrors NavAgent): gameplay code
// mutates `target` ("go to that point") and the CrowdSystem
// registers / updates / batch-steps the dtCrowd agent, writing
// results into `entity.transform.position` + `entity.velocity.linear`.
// The dtCrowd `agentIndex` is runtime-only state owned by the
// system; saves round-trip the intent + params, agents re-register
// on the first tick after load.
//
// Pointer-compare reactivity: assign a NEW object reference to
// `target` to trigger a `requestMoveTarget` call. Mutating fields
// in place doesn't replan. Same convention as NavAgent.
//
// NavAgent vs CrowdAgent: an entity has EITHER slot, never both.
// NavAgent is the deterministic single-agent path (replay-safe);
// CrowdAgent is the dtCrowd-driven swarm (avoidance + steering,
// not bit-identical under replay).
// ---------------------------------------------------------------------------
export const CrowdAgentSchema = z.object({
    /** Identifier of the dtCrowd instance this agent belongs to.
     *  Apps running multiple crowds (red team / blue team /
     *  civilians) tag each agent with the id of its owning crowd;
     *  the per-`crowdId` CrowdSystem filters its query by this
     *  field. Single-crowd setups (the common case) leave it at
     *  the default and don't need to think about it. */
    crowdId: z.string().min(1).default('default'),
    /** Maximum movement speed in world units / second. */
    maxSpeed: z.number().positive(),
    /** Agent collision radius. dtCrowd uses this for steering;
     *  should match the entity's physical radius if a kinematic
     *  body is present. */
    radius: z.number().positive(),
    /** Vertical clearance the agent needs (head height). */
    height: z.number().positive(),
    /** Maximum acceleration in world units / second^2. Higher =
     *  agent reaches max speed faster. Default 20. */
    maxAcceleration: z.number().nonnegative().optional(),
    /** Distance (world units) for "arrived at target" — fires
     *  `'crowd:agent-arrived'` and stops re-firing until target
     *  changes. Default 0.5. */
    arrivalRadius: z.number().nonnegative().optional(),
    /** dtCrowd separation weight (0..20 typical). Higher values
     *  push neighboring agents apart more aggressively. Default 0
     *  (rely on radius alone). */
    separationWeight: z.number().nonnegative().optional(),
    /** dtCrowd obstacle-avoidance preset index (0..4). 0 = no
     *  avoidance; higher values sample more candidate velocities.
     *  Default 0. */
    obstacleAvoidanceType: z.number().int().min(0).max(4).optional(),
    /** Current target world position. Setting this (a NEW object
     *  reference) triggers a move request next tick. Set null to
     *  halt. */
    target: Vec3Schema.nullable().optional(),
});
// ---------------------------------------------------------------------------
// BehaviorTree — decision-making intent. Drives `@unsupervised/ai-bt`'s
// per-tick tree evaluation.
//
// The actual tree definition (the graph of composites, decorators,
// and leaves) is registered globally by string id at game boot, so
// a thousand goblins can all reference 'goblin' without each entity
// carrying a copy of the same graph. The entity holds:
//
//   - `rootId`    — the registry lookup key.
//   - `blackboard` — per-entity scratch space. Game code writes
//                    domain state ("playerPos", "lastSeenAt"); the
//                    library writes its own running-node state
//                    under reserved `__bt`-prefixed keys. The
//                    blackboard is JSON-serialisable so save/load
//                    persists tree-resume state for free.
//
// Why this lives in @unsupervised/schemas (not in @unsupervised/ai-bt itself):
// the entity slot must be declared in the canonical EntitySchema
// for Miniplex's `world.with('behaviorTree')` queries to work
// across packages, and the slot type must be portable to consumers
// that don't import the ai-bt package directly (e.g., the save
// serializer in @unsupervised/state). Same pattern as NavAgent / Animation.
// ---------------------------------------------------------------------------
export const BehaviorTreeSchema = z.object({
    /** Lookup key in `@unsupervised/ai-bt`'s tree registry. Must match an
     *  id passed to `registerTree(id, root)` before the first tick
     *  that reads this slot. */
    rootId: z.string().min(1),
    /** Per-entity scratch space. Free-form game state plus
     *  library-internal running-node tracking under keys prefixed
     *  with `__bt`. JSON-shaped so the save layer can round-trip it. */
    blackboard: z.record(z.string(), z.unknown()),
});
// ---------------------------------------------------------------------------
// Inventory — slot-based item container. Driven by
// `@unsupervised/features/inventory`'s pure operations + global item-
// definition registry.
//
// Why slots-as-array vs. flat list:
//   Games render inventory grids; UIs care about position. A
//   fixed-size `(ItemInstance | null)[]` makes "slot 3 is the
//   helmet, slot 7 is the potion" trivially representable. A flat
//   list would force callers to invent their own grid mapping.
//
// Why equipped is a separate map vs. flagged slots:
//   Mirrors the Diablo / Hades model where worn equipment is
//   distinct from bag space — equipping a sword doesn't displace
//   a bag slot. App-defined equip-slot names ('weapon', 'armor',
//   'trinket') keyed against ItemInstance | null. Stardew-style
//   "equipped items still in bag" is achievable on top of this if
//   a game wants it; the inverse is not.
//
// Save / load: the entire slot is JSON-shaped (instances are
// `{ defId, count, customData? }`, equipped is a string-keyed
// record), so `@unsupervised/features/save`'s freeze layer round-trips
// inventories without per-component migration code.
//
// Definitions live in code: an ItemInstance's `defId` is a key
// into the global registry that the consuming game populates
// from forge-emitted typed data at boot. Renames break saves —
// document the implication, defer migrations to a future feature
// when game data starts churning.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Resources — named pools (mana, stamina, focus, heat, …) that
// abilities consume on activation. Drives `@unsupervised/features/abilities`
// cost checks + regen ticking.
//
// Why a separate slot from `health`:
//   HP is conceptually distinct — "are you alive?" rather than
//   "can you afford a cast?" The existing `health` slot is
//   already consumed by combat / AI HP-low conditions and by
//   `useEntityAnimation`-adjacent logic. Widening it to a generic
//   resource pool would force every existing reader to handle a
//   collection. Keep them separate; gameplay code that wants
//   "spend HP to cast" can include `health` as a resource-name
//   key by convention.
//
// Why a record keyed by string:
//   Resource names are app-defined (one game has mana + stamina;
//   another has focus + heat + concentration). The abilities
//   layer treats them as opaque keys against
//   `entity.resources[name]`. The cost on an ability definition
//   is a parallel `Record<string, number>` that names the same
//   keys the entity exposes.
//
// `regen` is optional because not every resource regenerates
// (a one-time pool of "souls" or "favor" might be authored as
// non-regenerating). The abilities system only touches
// resources that have `regen` set; absent regen means the value
// stays put until something else changes it.
// ---------------------------------------------------------------------------
export const ResourcePoolSchema = z.object({
    /** Current amount, 0..max. Decremented by `tryActivate` on
     *  successful activation; tickled up by `abilitySystem` if
     *  `regen` is set. */
    current: z.number().nonnegative(),
    /** Maximum. Regen clamps at this value. */
    max: z.number().positive(),
    /** Optional units-per-second regen rate. Omit for non-
     *  regenerating pools. */
    regen: z.number().nonnegative().optional(),
});
export const ResourcesSchema = z.record(z.string().min(1), ResourcePoolSchema);
// ---------------------------------------------------------------------------
// Abilities — the entity's known + currently-cooling abilities.
// Driven by `@unsupervised/features/abilities`'s registry + tryActivate +
// abilitySystem.
//
// `active` is an unordered set of ability ids the entity has
// available. UIs map array indices to hotbar slots however they
// like (Q/W/E/R, 1-4, gamepad face buttons). `cooldowns` is a
// per-id timer in seconds, ticked down by `abilitySystem`. An
// ability id with no cooldowns entry, or one whose value is <= 0,
// is ready to fire.
//
// Save / load: the slot is JSON-shaped (string array + numeric
// record). Cooldowns persist correctly through save / restore —
// a player who saves mid-fight and reloads sees the same
// remaining cooldowns. Items work the same way.
// ---------------------------------------------------------------------------
export const AbilitiesSchema = z.object({
    /** Ability ids the entity has available. Must each be
     *  registered with `registerAbility(...)` before
     *  `abilitySystem` ticks. Adding an ability mid-game (skill
     *  unlock, equipped weapon granting an ability) is a normal
     *  app-level mutation: assign a new array. */
    active: z.array(z.string().min(1)),
    /** Per-id cooldown timer, seconds. Absent or 0 means ready.
     *  `tryActivate` writes the ability's full cooldown here on
     *  success; `abilitySystem` decrements by `delta` each frame
     *  and clamps at 0. */
    cooldowns: z.record(z.string().min(1), z.number().nonnegative()),
});
export const InventorySchema = z.object({
    /** Fixed-size slot array. Index = grid position. `null` = empty
     *  slot. The array length is authoritative; `capacity` is the
     *  intended ceiling for UI rendering and validation. */
    slots: z.array(ItemInstanceSchema.nullable()),
    /** Maximum number of slots. UI / authoring should respect this
     *  even if `slots.length` differs (e.g., during a temporary
     *  transient where slots have been pre-sized). */
    capacity: z.number().int().nonnegative(),
    /** Equipped items keyed by app-defined equip-slot name (e.g.
     *  'weapon', 'armor', 'trinket'). Map only contains keys for
     *  currently-equipped slots; absence == empty. Equip slot names
     *  are stringly-typed at this layer; consuming games typically
     *  declare their own typed wrapper. */
    equipped: z.record(z.string(), ItemInstanceSchema.nullable()).optional(),
});
// ---------------------------------------------------------------------------
// AnimationState — drives Three.js's AnimationMixer from ECS data.
//
// The schema is the INTENT layer: gameplay code mutates these
// fields ("set the player to clipId='walk'") and the renderer's
// `useEntityAnimation` hook executes the visual side effect
// (resolves the AnimationClip via ModelBank, builds an
// AnimationAction, drives the mixer).
//
// Why this lives in @unsupervised/schemas (not in renderer-3d):
// schema dictates intent, renderer executes visuals. The headless
// engine has zero Three.js knowledge; gameplay can author
// `entity.animation = { clipId: 'walk', ... }` from any layer
// (XState transitions, behavior trees, network replication) and
// the renderer reacts. This is the same pattern Renderable3D
// already follows.
//
// Crossfading model:
//   - Single clip:  `clipId` only. Action plays at weight 1.0.
//   - Crossfade:    `clipId` + `blendToClipId` + `blendWeight`.
//                   Primary plays at (1 - blendWeight), secondary
//                   at blendWeight, both simultaneously. Driving
//                   `blendWeight` from 0 to 1 over time produces
//                   a smooth animation transition.
//
// Speed and loop semantics:
//   - `speed` is a multiplier on the clip's authored duration.
//     `speed: 2.0` plays at 2× speed; `0.5` at half. Negative
//     values would reverse, but the schema clamps to non-negative
//     because reverse playback breaks crossfade math (consumers
//     who want reverse should re-author the clip).
//   - `loop: true` (default) wraps at clip end via `LoopRepeat`.
//     `loop: false` clamps via `LoopOnce` — the action stops on
//     the final frame.
// ---------------------------------------------------------------------------
export const AnimationStateSchema = z.object({
    /** Primary animation clip name (must exist in the model's
     *  `.animations` array — resolved at runtime via
     *  `ModelBank.getClip(modelId, clipId)`). */
    clipId: z.string().min(1),
    /** Optional second clip for crossfading. When present, both
     *  clips play simultaneously with weights summed via
     *  `blendWeight`. */
    blendToClipId: z.string().min(1).optional(),
    /** Crossfade ratio. 0 = pure `clipId`, 1 = pure `blendToClipId`.
     *  Only meaningful when `blendToClipId` is set. */
    blendWeight: z.number().min(0).max(1).optional(),
    /** Playback rate multiplier on the clip's authored duration.
     *  1.0 = real time. Defaults to 1.0 when omitted. */
    speed: z.number().nonnegative().default(1.0),
    /** Whether the clip wraps at end (`true`, default) or clamps
     *  to the final frame (`false`). */
    loop: z.boolean().default(true),
});
export const EmitterSchema = z.object({
    /** Particles spawned per second. Fractional values are honored
     *  via VFXSystem's accumulator — `particleCountPerSecond: 0.5`
     *  emits one particle every two seconds, on average. */
    particleCountPerSecond: z.number().nonnegative(),
    /** Half-angle of the velocity cone, in radians. 0 = perfectly
     *  collimated jet along the emitter's local +Y axis; π/2 = full
     *  hemisphere; π = full sphere (omnidirectional explosion). */
    velocityCone: z.number().min(0).max(Math.PI),
    /** Initial speed of each particle along its randomly-chosen
     *  cone direction, in world units per second. */
    speed: z.number().nonnegative(),
    /** Particle lifetime in seconds. Each particle is born with this
     *  remaining lifetime; the GPU simulation kills it when the
     *  countdown hits zero. */
    lifespan: z.number().positive(),
    /** Per-particle base color. The GPU writes this into the
     *  InstancedMesh's per-instance color attribute at spawn. */
    color: ColorRGBSchema,
    /** Whether the emitter is currently producing particles. Set
     *  `false` to keep the entity around (its existing particles
     *  will continue to simulate until their lifespans expire) but
     *  stop new emission. */
    enabled: z.boolean(),
});
// ---------------------------------------------------------------------------
// AudioSource — gameplay component. Drives the audio system in
// @unsupervised/audio. The `playing` flag is intentionally bidirectional: gameplay
// code flips it to `true` to start a sound; the audio system flips it back
// to `false` when the sample finishes. That keeps the boolean a faithful
// snapshot of "is this entity making noise right now" without forcing us
// to synthesize event channels for one-shot SFX.
// ---------------------------------------------------------------------------
/** Bus a sound is routed through.
 *
 *    - `'music'` — soundtrack. Routes directly to MasterBus; gets
 *      ducked under cinematics / dialogue / heavy SFX via
 *      `mixer.ducking()`.
 *    - `'sfx'` — gameplay sound effects (footsteps, weapons,
 *      impacts). Routes through SfxBus → MasterBus.
 *    - `'environment'` — world ambience that should bleed through
 *      reverb (rain, machinery, distant crowds). Routes through
 *      SfxBus → MasterBus, so the SFX volume slider attenuates
 *      ambient + spot SFX together.
 *    - `'ui'` — menu sounds (button clicks, notification chirps,
 *      confirmation tones). Sibling of music / sfx — routes
 *      directly to MasterBus, NOT through SfxBus, because UI
 *      audio is meta-game and shouldn't be ducked when a
 *      cinematic ducks the SFX bus. */
export const AudioBusSchema = z.enum(['music', 'sfx', 'environment', 'ui']);
/** Optional 3D-positional knob set. Omit to play the sound as flat
 *  stereo through the bus's gain — appropriate for music, UI clicks,
 *  and 2D HUD feedback. Include to spawn a `PannerNode` whose
 *  position the audio system tracks against the entity's Transform. */
export const AudioSpatial3DSchema = z.object({
    /** Distance at which the source is fully attenuated. Beyond this,
     *  Rapier's `inverse` distance model still emits faint signal; use
     *  it as a "cull at" hint, not a hard cutoff. */
    maxDistance: z.number().positive(),
    /** Rolloff factor. Higher → louder up close, faster fade. The 1.0
     *  default for `inverse` works for most outdoor scenes. */
    rolloff: z.number().nonnegative(),
});
export const AudioSourceSchema = z.object({
    /** Asset-registry key — looked up against `AudioBank.get(soundId)`
     *  by the audio system. Must be unique across the audio registry. */
    soundId: z.string().min(1),
    bus: AudioBusSchema,
    /** Per-source volume, 0..1, applied through a local `GainNode`
     *  before the sound reaches its bus. Adjust this for relative
     *  loudness between sources sharing a bus. */
    volume: z.number().min(0).max(1),
    /** Whether the underlying `AudioBufferSourceNode` should loop. */
    loop: z.boolean(),
    spatial3D: AudioSpatial3DSchema.optional(),
    /** State + intent flag. Gameplay code sets `true` to start; the
     *  audio system sets `false` when the source's `onended` fires. */
    playing: z.boolean(),
});
// ---------------------------------------------------------------------------
// Spawner — entity-authored "things that spawn other things." Driven by
// `@unsupervised/features/spawn`'s `spawnerSystem`, archetype registry, and
// per-spawner-id callback registry.
//
// Why a real ECS slot (not a free-standing object): a Spawner has a
// position in the world, can be enabled/disabled, gets purged on scene
// transitions via `sceneOwner`, round-trips through save/load like any
// other entity, and can be queried alongside other gameplay state
// (`world.with('spawner', 'transform')`). Treating it as an entity
// unlocks all the shipped infrastructure (save, scene-purge, persist)
// without bespoke wiring.
//
// Save/load: every field on the slot is JSON-shaped. Mid-wave state
// (currentWaveIndex, waveState, accumulators) round-trips automatically
// — a player who saves mid-fight and reloads sees exactly the wave
// progression they left.
//
// Authoring contract:
//   - `pool` entries reference archetype IDs registered via
//     `registerSpawnArchetype(...)`. Unregistered IDs raise a clear
//     error at spawn time (game-author bug — fail loud).
//   - `mode.kind` is the discriminator for tick behavior. The non-
//     timing fields of each variant (intervalSeconds, waves[], …) are
//     intent; the timing fields (timeUntilNext, currentWaveIndex,
//     waveState, waveTimeAccumulator) are mutable bookkeeping the
//     system writes.
//   - `rngSeed` opts into determinism. When set, the system builds a
//     `mulberry32(seed)` once at observe-time and reuses it for all
//     pool rolls + position jitter. When unset, defaults to
//     `Math.random` per-roll.
//   - Lifecycle callbacks (`onSpawn`, `onDespawn`) are NOT on the slot —
//     they're registered against the spawner's `id` via
//     `registerSpawnerCallbacks(...)`, same code-paired-at-boot model
//     as ability effects.
// ---------------------------------------------------------------------------
/** A weighted reference to an archetype id that the system will pass
 *  to its registered factory at spawn time. Same shape as
 *  `LootEntry<string>` from `@unsupervised/features/loot` — the spawn system
 *  treats the pool as a loot table internally. `condition` lets a
 *  pool gate entries on app-side context (player level, quest flag,
 *  difficulty). */
export const SpawnPoolEntrySchema = z.object({
    /** Archetype lookup id — must have been passed to
     *  `registerSpawnArchetype(id, factory)` before the system ticks
     *  this spawner. */
    archetypeId: z.string().min(1),
    /** Selection weight. Zero or negative weights are treated as 0
     *  (entry effectively absent for this roll) — same fail-quiet
     *  policy as the loot package. */
    weight: z.number(),
});
/** Spatial primitive for spawn position selection. Each variant
 *  carries the parameters it needs; the system samples a position
 *  inside the shape (jittered for non-point shapes) and uses it as
 *  the spawned entity's transform.position.
 *
 *  Why a discriminated union (vs. a single "shape with optional
 *  radius / dimensions" object): each shape's params are different,
 *  and games tend to pick a shape statically per-spawner. Naming the
 *  shape in the discriminant makes spawn-site code skimmable. */
export const SpawnShapeSchema = z.discriminatedUnion('kind', [
    /** Spawn at the origin every time. Useful for door / portal
     *  spawners, scripted ambushes, and tests. */
    z.object({ kind: z.literal('point') }),
    /** Spawn within a horizontal disk of `radius` meters around the
     *  origin (XZ plane, Y unchanged). The most common shape for
     *  open-world ambient spawners and arena waves. */
    z.object({ kind: z.literal('circle'), radius: z.number().nonnegative() }),
    /** Spawn at a random point along the segment from `from` to `to`
     *  (parameterized t ∈ [0, 1]). Useful for path patrol seeds,
     *  racing pickup placement. The segment is interpreted in world
     *  space; the spawner's `origin` is ignored for this shape. */
    z.object({
        kind: z.literal('line'),
        from: Vec3Schema,
        to: Vec3Schema,
    }),
    /** Spawn inside an axis-aligned box of `halfExtents` around the
     *  origin. Useful for rectangular zones (rooms, bands of terrain). */
    z.object({
        kind: z.literal('box'),
        halfExtents: Vec3Schema,
    }),
]);
/** Trigger that decides when a wave starts. `previous-cleared` waits
 *  for the prior wave's spawned entities to all despawn; `delay`
 *  waits a fixed number of seconds after the prior wave's last spawn
 *  (or, for wave 0, after the spawner enables). */
export const WaveStartTriggerSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('previous-cleared') }),
    z.object({ kind: z.literal('delay'), seconds: z.number().nonnegative() }),
]);
/** A single wave inside a wave-mode spawner's sequence. Each wave
 *  has its own count + intra-wave spacing + start trigger; an
 *  optional pool override lets later waves spawn rarer archetypes
 *  without rewriting the parent pool. */
export const WaveSchema = z.object({
    /** Number of entities to spawn during this wave. 0 is allowed
     *  (skipped immediately to next-wave transition); negative is
     *  treated as 0. */
    count: z.number().int(),
    /** Seconds between consecutive spawns within this wave. 0 spawns
     *  the whole count on the wave-start frame. */
    intervalSeconds: z.number().nonnegative(),
    /** Optional pool override for this wave. When omitted, the wave
     *  inherits the spawner's parent pool. When provided, completely
     *  replaces it for this wave (no merge — append-merge semantics
     *  would be surprising). */
    pool: z.array(SpawnPoolEntrySchema).optional(),
    /** When this wave should start. `previous-cleared` is the
     *  default-feeling choice for arena waves; `delay` is for
     *  scripted, time-based escalation. */
    startTrigger: WaveStartTriggerSchema,
});
/** Wave-mode runtime state. The system advances through these
 *  states linearly per wave: idle → spawning → awaiting-clear →
 *  between-waves → idle (next wave) → … → complete. */
export const WaveStateSchema = z.enum([
    /** Wave hasn't started yet. Holds in this state until the wave's
     *  `startTrigger` fires (previous wave cleared OR delay elapsed). */
    'idle',
    /** Currently emitting this wave's `count` spawns at
     *  `intervalSeconds` cadence. Transitions to `awaiting-clear`
     *  after the last spawn fires. */
    'spawning',
    /** All of this wave's spawns have fired; waiting for them to all
     *  despawn before the next wave's trigger evaluates. (For
     *  triggers other than `previous-cleared`, transitions
     *  immediately to `between-waves`.) */
    'awaiting-clear',
    /** Wave finished and cleared (or timed out into); now waiting
     *  through the spawner's `betweenWaveDelay` before advancing the
     *  wave index. */
    'between-waves',
    /** All waves finished. Spawner is inert — it stays in the world
     *  (so save/load is stable) but produces no further spawns. */
    'complete',
]);
/** Discriminated union over the three spawn modes. Each variant
 *  carries its own non-timing intent fields (intervalSeconds, waves)
 *  AND its own timing-bookkeeping fields (timeUntilNext,
 *  currentWaveIndex, waveState, waveTimeAccumulator). Keeping intent
 *  + bookkeeping in the same variant means save/load round-trips the
 *  full mode state with no extra side-tables. */
export const SpawnerModeSchema = z.discriminatedUnion('kind', [
    /** Ambient refill: spawn every `intervalSeconds` while under
     *  capacity caps. The workhorse for Hades grunt waves, ARPG
     *  dungeon refills, ambient swarms.
     *
     *  `timeUntilNext` is decremented each frame; on hitting 0 the
     *  system queues a spawn and resets to `intervalSeconds`. Saving
     *  mid-interval preserves the partial countdown. */
    z.object({
        kind: z.literal('interval'),
        intervalSeconds: z.number().positive(),
        timeUntilNext: z.number().nonnegative(),
    }),
    /** Scripted progression: a finite sequence of waves with explicit
     *  triggers between them. The workhorse for tower defense,
     *  Hades-arena bosses, scripted set pieces.
     *
     *  Mutable bookkeeping fields (`currentWaveIndex`, `waveState`,
     *  `waveTimeAccumulator`, `spawnedThisWave`) carry mid-wave state
     *  through save/load. */
    z.object({
        kind: z.literal('wave'),
        waves: z.array(WaveSchema),
        /** Wave currently in flight or just-finished. Bumped on each
         *  between-waves → idle transition. Equals `waves.length` when
         *  the spawner has run all waves; pairs with
         *  `waveState === 'complete'`. */
        currentWaveIndex: z.number().int().nonnegative(),
        waveState: WaveStateSchema,
        /** Accumulator for the current wave-state's timing. In
         *  `spawning`: time since last intra-wave spawn. In
         *  `between-waves`: time since wave cleared. In `idle` with a
         *  delay trigger: time since previous wave finished or spawner
         *  enabled. */
        waveTimeAccumulator: z.number().nonnegative(),
        /** Count of spawns fired so far during the current wave. Resets
         *  to 0 on each idle → spawning transition. Compared against
         *  the wave's `count` to know when to transition out of
         *  `spawning`. */
        spawnedThisWave: z.number().int().nonnegative(),
        /** Seconds to hold in `between-waves` before advancing wave
         *  index. 0 is fine — moves immediately to next wave's idle. */
        betweenWaveDelay: z.number().nonnegative(),
    }),
    /** No automatic spawning — the system never produces a spawn for
     *  a `manual` spawner. Game code calls `forceSpawn(world, id)` to
     *  produce a spawn, respecting capacity caps. The workhorse for
     *  monster-closet-on-trigger, scripted ambushes, dialogue-driven
     *  encounters. */
    z.object({ kind: z.literal('manual') }),
]);
export const SpawnerSchema = z.object({
    /** Stable identifier. Must be unique across all spawners in the
     *  world; `getSpawnerStatus(world, id)` and
     *  `forceSpawn(world, id)` look up by this key, and the
     *  callback registry pairs callbacks with this id. */
    id: z.string().min(1),
    /** When false, the system skips this spawner entirely (no tick
     *  advance, no spawns). Toggle to pause/resume. */
    enabled: z.boolean(),
    /** Default pool used when a wave doesn't override it (and the
     *  only pool in interval/manual modes). Empty pool is allowed —
     *  the spawner simply produces no entities, with a
     *  `getSpawnerStatus` field that surfaces the empty-pool state
     *  for debugging. */
    pool: z.array(SpawnPoolEntrySchema),
    mode: SpawnerModeSchema,
    shape: SpawnShapeSchema,
    /** World-space spawn-shape origin (meters). Ignored for `line`
     *  shape (the line carries its own world coords). */
    origin: Vec3Schema,
    /** Concurrent ceiling — system queries `world.with('spawnedBy')`
     *  each frame, groups by spawnerId, blocks new spawns when the
     *  count would exceed this. Undefined means no ceiling. */
    maxActive: z.number().int().nonnegative().optional(),
    /** Lifetime ceiling — once `totalSpawned >= maxTotal`, no more
     *  spawns regardless of mode. Undefined means no ceiling. */
    maxTotal: z.number().int().nonnegative().optional(),
    /** Total entities this spawner has produced across its lifetime.
     *  Mutated in place by the system; round-trips through save/load. */
    totalSpawned: z.number().int().nonnegative(),
    /** Optional 32-bit integer seed. When set, the system builds a
     *  `mulberry32(seed)` ONCE on first observation and reuses it
     *  for every pool roll + position jitter from this spawner.
     *  Replay-stable. When unset, every roll uses `Math.random`. */
    rngSeed: z.number().int().optional(),
});
// ---------------------------------------------------------------------------
// Modifier — a single stat-altering entry on the `modifiers` ECS
// slot. Driven by `@unsupervised/features/modifiers`'s pure operations:
// `addModifier`, `removeModifier`, `removeModifiersBySource`,
// `resolveStat(entity, stat, base)`.
//
// Resolution order (one canonical formula, documented as THE
// formula so apps don't get surprised):
//
//     finalValue = (base + sum_of_add) × product_of_multiply
//
//   …unless any modifier has `op === 'override'`, in which case
//   the highest-priority override's value short-circuits the
//   math.
//
// Identity is by `id` — `addModifier` upserts: if a modifier with
// the same id already exists on the entity, it's replaced. Apps
// build ids as `'<source>:<stat>'` so re-applying the same status
// effect (e.g. the slow re-applies its `'slow:nav-speed'`
// modifier) collides correctly.
//
// `source` is the attribution tag shared across modifiers from
// one logical origin. A "Curse" status that touches three
// stats sets `source: 'status:curse'` on all three; on expiry
// the cleanup is one call: `removeModifiersBySource(target,
// 'status:curse')`.
// ---------------------------------------------------------------------------
/** How a modifier combines with the base value during
 *  `resolveStat`. Three operators by design — `add`, `multiply`,
 *  `override` — because every other shape (clamp, min, max)
 *  composes from those three. Resists scope creep. */
export const ModifierOpSchema = z.enum(['add', 'multiply', 'override']);
export const ModifierSchema = z.object({
    /** Stable identifier; upsert key for `addModifier`. Apps
     *  conventionally build it as `'<source>:<stat>'` so re-apply
     *  collides with the existing entry instead of stacking. */
    id: z.string().min(1),
    /** App-defined stat name. The framework treats this as opaque;
     *  apps narrow with their own union (e.g.
     *  `'nav-speed' | 'damage-out' | 'damage-in' |
     *  'cooldown-rate'`). The combat layer auto-reads two reserved
     *  stat names: `'damage-out'` (multiplies outgoing damage from
     *  the source) and `'damage-in'` (multiplies incoming damage
     *  on the target). Apps should not use those names for
     *  unrelated purposes. */
    stat: z.string().min(1),
    op: ModifierOpSchema,
    /** Operand. `add` is summed against the base (negatives
     *  subtract). `multiply` is an absolute multiplier — `1.5` is
     *  `+50%`, `0.5` is `-50%`, `0` zeroes the stat. `override`
     *  replaces the resolved value entirely. */
    value: z.number(),
    /** Attribution tag. Modifiers from one logical source share
     *  this; `removeModifiersBySource` drops them all in one
     *  call. */
    source: z.string().optional(),
    /** Tiebreaker among `override` modifiers — highest wins.
     *  Ignored for `add` / `multiply` (they all sum / product). */
    priority: z.number().int().optional(),
});
/** The `modifiers` ECS slot — an array of modifier entries.
 *  Iteration order is preserved (insertion order); the
 *  resolution algorithm doesn't depend on order for `add` /
 *  `multiply` (sum / product are commutative) but `override`
 *  ties break by the higher `priority`, then by insertion
 *  order. */
export const ModifiersSchema = z.array(ModifierSchema);
// ---------------------------------------------------------------------------
// Combat — damage-mitigation knobs read by `@unsupervised/features/combat`'s
// `applyDamage`. All fields are optional; entities without a
// `combat` slot take damage at 100% (sensible default — most
// enemies aren't armored).
//
// Resistances are keyed by app-defined damage type strings (the
// framework treats them as opaque). Values are -1..1 multipliers
// where 0 = no resistance, 0.5 = take 50% less, 1.0 = fully
// resist (matches an entry in `immunities`). Negative resistances
// are vulnerabilities (-0.5 = take 50% more — useful for
// "vulnerable to fire while wet" mechanics).
//
// Armor is flat post-percentage reduction. Order:
//   final = max(0, raw * (1 - resist[type]) - armor)
//
// Immunities short-circuit the math entirely — listed types take
// 0 damage AND don't fire `entity:damaged` events. (If a game
// wants "tried to damage immune target" feedback, it subscribes
// to `ability:activated` and checks the target's immunities
// itself.)
// ---------------------------------------------------------------------------
export const CombatSchema = z.object({
    /** Per-type damage multiplier. Keys are app-defined damage
     *  type strings; values in [-1, 1]. Resistance 1.0 ≡ entry in
     *  `immunities` (both block all damage of that type), but
     *  immunities are cheaper to check (the framework
     *  short-circuits before computing any math). */
    resistances: z.record(z.string(), z.number().min(-1).max(1)).optional(),
    /** Flat damage reduction applied after percentage mitigation.
     *  Clamped at 0 — no negative damage (armor doesn't heal). */
    armor: z.number().nonnegative().optional(),
    /** Damage types that bypass health entirely. Listed types take
     *  0 damage AND skip the `entity:damaged` event firing. */
    immunities: z.array(z.string().min(1)).optional(),
});
// ---------------------------------------------------------------------------
// StatusEffects — array of currently-active effects on the entity.
// Driven by `@unsupervised/features/status`'s registry + system tick.
//
// Why an array (not a record): multiple stacks of the same effect
// can coexist when `stackable: true`, and a stable insertion order
// makes "earliest applied first" UI display trivial. JSON-shaped
// for save/load.
//
// The effect DEFINITIONS (with onApply / onTick / onExpire
// callbacks) live in the global registry; this slot holds only
// the per-entity instance state — same model as items / abilities
// / BTs.
// ---------------------------------------------------------------------------
export const StatusEffectsSchema = z.array(StatusEffectInstanceSchema);
// ---------------------------------------------------------------------------
// Casting — in-progress ability cast state. Driven by
// `@unsupervised/features/casting`'s `castingSystem`.
//
// The slot exists ONLY while an entity is mid-cast. `startCast`
// (or `tryActivate` of a phase-timed ability) creates it; the
// system tick advances phases; cast completion or interruption
// removes it. Mutual exclusion: an entity with the slot rejects
// new `tryActivate` calls with reason `'casting'`.
//
// Phases:
//
//   windup   — pre-effect commitment. Cast bar fills here; UI
//              shows the upcoming hit. Effect has NOT fired.
//              Interrupt during windup → cancel without effect,
//              without setting cooldown. Subscribers can refund
//              cost on `'ability:cast-interrupted'` if their
//              gameplay wants.
//
//   active   — the moment the effect fires. Triggered at the
//              windup→active boundary: effect callback runs,
//              `'ability:cast-active'` event emits, cooldown
//              gets set. Active phase itself is usually short
//              (`0.05s` is typical) but stays in this state for
//              the authored duration so a subscriber can implement
//              "active window for hit detection."
//
//   recovery — post-effect lockout. Animation finishes; effect
//              already fired; cooldown already set. New casts
//              still gated. At recovery end, slot clears +
//              `'ability:cast-completed'` event.
//
// `phaseTimings` is a SNAPSHOT of the def's `phaseTimings`
// (after applying the `'cast-speed'` modifier). It's persisted
// on the slot so:
//   - Save/load round-trip preserves mid-cast timing exactly.
//   - Mid-cast modifier changes (a "Haste" buff applied while
//     already casting) don't retroactively shift the phase
//     boundary the cast is currently in. The next cast picks
//     up the new modifier; the current one finishes on its
//     authored timing.
//
// `activeOnEvent` mirrors the def's same field. When set, the
// system DOESN'T auto-advance windup at the timing boundary —
// it waits for a matching `'animation:event'` bus emit on this
// entity. Fallback: after `windup × 2` seconds without the
// event firing, the system advances anyway with a warn log.
// ---------------------------------------------------------------------------
export const CastingPhaseSchema = z.enum(['windup', 'active', 'recovery']);
export const CastingSchema = z.object({
    /** Ability id this cast is firing. Looked up against the
     *  abilities registry to retrieve the effect callback at the
     *  active-phase boundary. */
    abilityId: z.string().min(1),
    /** Current phase. */
    phase: CastingPhaseSchema,
    /** Seconds remaining in the CURRENT phase. Decremented every
     *  frame by the casting system; on hitting 0, advances. */
    timeRemainingInPhase: z.number().nonnegative(),
    /** Snapshot of phase durations AFTER modifier application,
     *  taken at cast start. Persisted so save/load + mid-cast
     *  modifier changes behave correctly (see slot doctop). */
    phaseTimings: z.object({
        windup: z.number().nonnegative(),
        active: z.number().nonnegative(),
        recovery: z.number().nonnegative(),
    }),
    /** Optional animation-event-name gate. When set, the windup
     *  phase doesn't auto-advance at its timing boundary — the
     *  system waits for a matching `'animation:event'` emit. */
    activeOnEvent: z.string().optional(),
    /** Whether this cast can be interrupted by `interruptCast`.
     *  Snapshotted from the def at cast start. */
    interruptible: z.boolean(),
    /** Wall time in the windup phase. Used to detect the
     *  fallback timeout when `activeOnEvent` is set but the
     *  event never fires (after `windup × 2` seconds, system
     *  auto-advances + logs a warn). */
    windupElapsed: z.number().nonnegative(),
    /** Optional snapshot of the cast's target — the entity the
     *  effect should fire against, regardless of mid-cast
     *  retargeting. Stored as id (entity ref) or position. */
    targetEntityId: z.string().optional(),
    targetPosition: Vec3Schema.optional(),
});
// ---------------------------------------------------------------------------
// SpawnedBy — provenance tag on entities produced by a Spawner.
//
// The system writes this slot at spawn time; the per-frame
// `spawnerSystem` queries `world.with('spawnedBy')` to derive
// alive-counts per spawnerId (no event bus required) and to detect
// despawned entities via frame-diff against the previous tick.
//
// `spawnedAt` is for age queries — "kill anything alive >30s" — and
// for audit / debug overlays. The system itself doesn't read it.
// ---------------------------------------------------------------------------
export const SpawnedBySchema = z.object({
    /** ID of the spawner that produced this entity. Matches a
     *  `spawner.id` somewhere in the world (or did at spawn time —
     *  the originating spawner may have been removed since). */
    spawnerId: z.string().min(1),
    /** World time in seconds at spawn. The system passes its
     *  accumulated tick time; game code can compare against the
     *  current world time for age queries. */
    spawnedAt: z.number().nonnegative(),
});
// ---------------------------------------------------------------------------
// GameClock — singleton ECS slot owning the in-game clock.
//
// Convention: lives on a single entity (typically `id: 'world-clock'`).
// `gameClockSystem` finds it via `world.with('gameClock').first` and
// advances `currentSeconds` each tick by `dt × speedMultiplier` when
// not paused. JSON-shaped → save/load round-trips through the existing
// save bundle without special handling.
//
// `secondsPerDay` controls cycle length (default 1200 = 20-minute day).
// Phase thresholds are configurable per-game.
// ---------------------------------------------------------------------------
export const GameClockSchema = z.object({
    /** Game-time seconds since `dayNumber=1, 00:00`. Monotonic, bounded
     *  only by Number.MAX_SAFE_INTEGER (~285M years at 1 game-second
     *  per real-second; not a concern). */
    currentSeconds: z.number().nonnegative(),
    /** How many game seconds make up one day. Default 1200 (20-min day);
     *  apps tune for "60-min day" feel by setting `3600`. */
    secondsPerDay: z.number().positive(),
    /** When true, `gameClockSystem` does NOT advance the clock or fire
     *  any time-driven handlers. Pause is a game-time concept; physics
     *  and rendering continue. */
    paused: z.boolean(),
    /** Multiplier applied to `dt` when advancing. `1` = real-time;
     *  `60` = 1 minute real → 1 hour game. Sleep-to-morning typically
     *  bumps to a high multiplier briefly. */
    speedMultiplier: z.number().positive(),
    /** Cached current phase. Maintained by the system (recomputed each
     *  tick from `currentSeconds`). Saved so reload skips a transition
     *  detection on the first tick. */
    currentPhase: DayNightPhaseSchema,
    /** Per-phase start-of-day fractions; see PhaseThresholdsSchema. */
    phaseThresholds: PhaseThresholdsSchema,
    /** Day-of-week index (0 = Monday … 6 = Sunday). The system advances
     *  this on day rollover. Used by schedule entries with `dayPattern`
     *  filters (`'weekday'`, `'weekend'`, or explicit day arrays). */
    dayOfWeek: z.number().int().min(0).max(6),
});
// ---------------------------------------------------------------------------
// ScheduledHandlers — registry of `at` / `daily` / `every` handles.
//
// Lives alongside the GameClock on the same singleton entity (no
// requirement, but the convention keeps "everything time-related" on
// one entity). Object-shaped (id → handle) so registration is
// idempotent and upsert-on-conflict; arrays would force linear scans.
// ---------------------------------------------------------------------------
export const ScheduledHandlersSchema = z.object({
    handles: z.record(z.string(), ScheduledHandleSchema),
});
// ---------------------------------------------------------------------------
// Schedule — NPC schedule slot.
//
// Holds the schedule's id (looked up against the global schedule
// registry to retrieve entries) and the system-maintained
// `activeEntryIndex` — the index into the registered entries that's
// currently active given the world's clock + day-of-week. Apps wire
// behavior on top: BT conditions read the active entry, a tween
// system pushes the NPC toward `entries[activeEntryIndex].locationId`,
// etc.
//
// Schedule definitions themselves rebuild from code at boot via
// `registerSchedule(...)`; saves only round-trip the slot — same
// pattern as ability defs / spawn archetypes.
// ---------------------------------------------------------------------------
export const ScheduleSchema = z.object({
    scheduleId: z.string().min(1),
    /** `undefined` when no entry covers the current time-of-day
     *  (a gap). Apps decide idle behavior in that case. */
    activeEntryIndex: z.number().int().nonnegative().optional(),
});
// ---------------------------------------------------------------------------
// Grid — singleton tile-grid slot for tactics / roguelike games.
//
// Convention: lives on a single entity (typically `id: 'world-grid'`).
// `@unsupervised/features/grid` operations look it up via
// `world.with('grid').first`. Width × height tiles, stored row-major
// in a flat `tiles` array (`tiles[y * width + x]`).
//
// World-space conversion: tile `(x, y)`'s CENTER is at
// `origin + (x + 0.5, 0, y + 0.5) * cellSize`. The Y axis stays
// vertical (worldspace up), so the grid lives in the X-Z plane —
// natural for top-down + isometric rendering.
// ---------------------------------------------------------------------------
export const GridSchema = z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    /** World units per tile. Default 1 in the builder. */
    cellSize: z.number().positive(),
    /** World position of the (0,0)-tile's lower-left CORNER (not
     *  center). Tile centers offset by `(0.5, 0, 0.5) * cellSize`. */
    origin: Vec3Schema,
    topology: GridTopologySchema,
    /** Flat row-major tile data: `tiles[y * width + x]`. Length =
     *  `width * height`. */
    tiles: z.array(TileDataSchema),
});
// ---------------------------------------------------------------------------
// TilePosition — per-entity tile coordinate.
//
// THE GAMEPLAY SOURCE OF TRUTH for entities living on a grid.
// `transform.position` is the rendered position (lerped toward the
// tile center each frame by `tileMoverSystem`). Game code mutates
// `tilePosition.coord` instantly; visuals catch up over animation
// duration. Don't invert — writing to `transform.position`
// directly fights the mover system.
// ---------------------------------------------------------------------------
export const TilePositionSchema = z.object({
    coord: TileCoordSchema,
});
// ---------------------------------------------------------------------------
// TurnParticipant — per-entity turn-economy slot.
//
// Tags an entity as a participant in a turn-based encounter.
// Stores team membership (for team-mode), initiative score (for
// individual-mode tie-breaking + queue ordering), AP economy, and
// the per-turn flag `hasActedThisTurn` (cleared each cycle by the
// turn manager).
// ---------------------------------------------------------------------------
export const TurnParticipantSchema = z.object({
    /** App-defined team id. Conventional values: `'player'`,
     *  `'enemy'`, `'neutral'`. Apps with more sides
     *  (`'guild-blue'`, `'guild-red'`) coin their own. */
    team: z.string().min(1),
    /** Higher = acts first in `'individual'` mode; ties broken by
     *  insertion order. Unused in `'team'` mode (within-team order
     *  is free). Default 0. */
    initiative: z.number(),
    apMax: z.number().nonnegative(),
    apCurrent: z.number().nonnegative(),
    /** Set by the manager on turn-start; cleared on turn-end.
     *  Apps query this to grey out moved units in UI. */
    hasActedThisTurn: z.boolean(),
});
// ---------------------------------------------------------------------------
// TurnState — singleton FSM state.
//
// Convention: lives on a single entity (typically `id:
// 'world-turn-state'`). The XState turn machine in
// `@unsupervised/features/turn` reads + writes this slot; save/load
// round-trips for free since the slot is JSON-shaped.
// ---------------------------------------------------------------------------
export const TurnStateSchema = z.object({
    mode: TurnModeSchema,
    phase: TurnPhaseSchema,
    /** 1-indexed turn counter. Each completed cycle of the queue
     *  increments. */
    turnNumber: z.number().int().positive(),
    /** Active entity id (in `'individual'` mode) — the one whose
     *  turn it currently is. `undefined` when phase is `'idle'`
     *  or `'ended'`. */
    activeEntityId: z.string().optional(),
    /** Active team id (in `'team'` mode) — the team currently
     *  acting. `undefined` outside `'team'` mode. */
    activeTeam: z.string().optional(),
    /** Order of upcoming turns. In `'individual'` mode: entity
     *  ids sorted by initiative. In `'team'` mode: team-id
     *  rotation. The head is the active participant; the tail
     *  rolls back to the front when the cycle completes. */
    queue: z.array(z.string()),
    /** Optional battle id — apps that run multiple encounters
     *  (arena 1, arena 2) tag each so save-pickers can show
     *  which is in flight. */
    battleId: z.string().optional(),
});
// ---------------------------------------------------------------------------
// DialogueState — per-entity dialogue runner state.
//
// The framework is headless: this slot tracks WHICH script is
// active and WHICH node the entity is currently sitting on.
// UIs (speech bubbles, portrait boxes, typewriter) read this
// + the registered script def to render. `activeScriptId` and
// `currentNodeId` are both `null` between conversations.
//
// Convention: per-entity. Single-PC games put it on the player;
// party-RPG games put it on each PC; cinematic dialogue ("the
// world says X") puts it on a designated narrator entity.
// ---------------------------------------------------------------------------
export const DialogueStateSchema = z.object({
    /** Currently-active dialogue script id. `null` between
     *  conversations. */
    activeScriptId: z.string().min(1).nullable(),
    /** Current node id within the active script. `null` when
     *  no dialogue is active. */
    currentNodeId: z.string().min(1).nullable(),
    /** Optional history of `(nodeId, choiceIndex)` pairs for
     *  back-navigation / log display. Capped to a reasonable
     *  length (apps configure). When omitted, history isn't
     *  recorded — keeps the slot tiny for games that don't need it. */
    history: z
        .array(z.object({
        nodeId: z.string(),
        choiceIndex: z.number().int().nonnegative(),
    }))
        .optional(),
});
// ---------------------------------------------------------------------------
// QuestTracker — per-entity quest journal.
//
// Active quests carry their step index + per-step counter; on
// final step completion they move to `completed`. Apps display
// the journal by reading `active` (with the registered def for
// step descriptions) plus `completed` / `failed` / `abandoned`
// for history.
// ---------------------------------------------------------------------------
export const QuestTrackerSchema = z.object({
    /** Quests currently in progress. */
    active: z.array(ActiveQuestSchema),
    /** Quest ids that completed. */
    completed: z.array(z.string()),
    /** Quest ids that failed (an objective became unreachable —
     *  protected NPC died, time ran out, etc.). */
    failed: z.array(z.string()),
    /** Quest ids the player explicitly abandoned. Separate from
     *  `failed` so apps can display "tried and gave up" UIs
     *  distinctly from "tried and lost." */
    abandoned: z.array(z.string()),
});
// ---------------------------------------------------------------------------
// Achievements — per-entity Steam-shape tracker.
//
// Stats are reusable counters (`enemies_killed`, `gold_collected`,
// `play_time_seconds`); achievements are unlock conditions over
// those stats (or via direct triggers / composite of other
// achievements). The `'app-defined'` escape hatch from the quest
// shape isn't needed here — the four built-in criterion kinds
// (stat-threshold / event-fired / one-shot / meta) cover the
// canonical 100% of achievement use cases.
//
// Convention: per-entity. Single-PC games put it on the
// player; party-RPG games either put it on each PC (per-
// character trophies) or on a singleton `'world-achievements'`
// entity (shared cross-character progress). Save/load
// round-trips the slot; the registry rebuilds from code at boot.
// ---------------------------------------------------------------------------
export const AchievementsSchema = z.object({
    /** Ids of achievements unlocked on this entity. */
    unlocked: z.array(z.string()),
    /** Per-id unlock timestamps (matches `unlocked` membership;
     *  apps display "unlocked at day 12, 14:32" UIs). */
    unlockTimes: z.record(z.string(), z.number()),
    /** For `stat-threshold` achievements: snapshot of progress
     *  at last evaluation. The framework recomputes from `stats`
     *  on every `incrementStat` / `setStat` call; this field
     *  primarily serves UIs that want progress bars without
     *  re-running the criterion check. */
    progress: z.record(z.string(), z.number()),
    /** Stat counters (Steam-shape). Apps tick via
     *  `incrementStat` / `setStat`. Floats allowed — apps that
     *  want integer-only enforce via their own setters. */
    stats: z.record(z.string(), z.number()),
    /** Hidden achievements that have been "discovered" via any
     *  progress. UI shows "??? — locked" for these instead of
     *  hiding entirely. Steam-shape. */
    hiddenSeen: z.array(z.string()),
});
// ---------------------------------------------------------------------------
// Cinematic — singleton player-state slot for the cutscene system.
//
// Convention: lives on a single entity (typically `id:
// 'world-cinematic'`). `@unsupervised/features/cinematic`'s system locates
// it via `world.with('cinematic').first` and reconciles state each
// tick. Sibling systems (casting, abilities, spawn, save) read the
// slot via `isCinematicGating(world)` to suspend their work while
// `phase === 'playing'`.
//
// Runtime-only: this slot is intentionally NOT included in save
// bundles. A save mid-cutscene is almost always a bug; the runtime
// boots clean and the player starts in `'idle'` state on load.
// `firedIndices` is a track-index set, NOT a poly ref, so it has no
// meaning across rebuilt cutscene definitions either.
// ---------------------------------------------------------------------------
export const CinematicSchema = z.object({
    /** Active cutscene id, or `null` while idle. */
    activeCutsceneId: z.string().nullable(),
    /** Coarse FSM phase. `'preparing'` covers async asset preload
     *  before tracks fire; `'playing'` is the per-frame tick phase;
     *  `'completing'` runs the post-roll fade for video cutscenes;
     *  `'completed'` is a one-tick latch before transition back to
     *  `'idle'`. */
    phase: z.enum(['idle', 'preparing', 'playing', 'completing', 'completed']),
    /** Player's accumulated time since `play()`. Pause-aware,
     *  deltaTime-only — never reads wall-clock so replays stay
     *  bit-identical for timeline cutscenes. Resets to 0 on each
     *  `play()`. */
    clockSeconds: z.number().nonnegative(),
    /** Indices into the active timeline cutscene's `tracks[]` array
     *  that have already fired. Used to dedupe firing across frames
     *  and to compute the fast-forward set on `skip()`. Empty for
     *  video cutscenes. */
    firedIndices: z.array(z.number().int().nonnegative()),
    /** Latched flag; the next tick fast-forwards remaining tracks
     *  with `skipped: true` context and transitions to
     *  `'completed'`. */
    skipRequested: z.boolean(),
    /** Player-local pause flag, INDEPENDENT of `gameClock.paused`
     *  and SceneManager pause. Apps that want game-pause to suspend
     *  cutscenes wire that explicitly. */
    paused: z.boolean(),
    /** Active overlay alpha (0 = transparent, 1 = opaque). Driven
     *  by `fade` tracks + video pre-roll/post-roll fades. The UI
     *  layer reads this for the `<CutsceneOverlay>` darkness. */
    fadeAlpha: z.number().min(0).max(1),
    /** CSS color hex backing the fade overlay. Updated when a fade
     *  track fires so cutscenes can fade to white / red / etc. */
    fadeColor: z.string(),
});
// ---------------------------------------------------------------------------
// CinematicCamera — singleton handoff slot for camera tracks.
//
// When a `camera` track fires, the cinematic system writes this
// slot. The renderer-3d's `<CinematicCameraDriver>` (mounted next
// to the existing camera presets) reads the slot per frame and
// drives the active camera; the existing presets each have a
// one-line "yield `makeDefault` when this slot is present" check
// so the swap is automatic.
//
// On cutscene completion the slot is removed and the prior preset
// retakes `makeDefault` automatically (R3F handles the swap; same
// mechanism the camera-presets validator already exercises).
// ---------------------------------------------------------------------------
export const CinematicCameraSchema = z.object({
    /** Target pose for snap (when `tweenFromSeconds === tweenToSeconds`)
     *  or the END pose of an in-flight tween. */
    position: Vec3Schema,
    lookAt: Vec3Schema,
    /** Optional FOV override in degrees. */
    fov: z.number().positive().optional(),
    /** Pose to tween FROM. Snapshotted at tween start so re-evaluations
     *  (frame-rate jitter, pause/resume) don't drift. */
    tweenSourcePosition: Vec3Schema,
    tweenSourceLookAt: Vec3Schema,
    /** Source FOV for the in-flight tween (paired with `fov`). */
    tweenSourceFov: z.number().positive().optional(),
    /** `cinematic.clockSeconds` value at tween start. */
    tweenFromSeconds: z.number().nonnegative(),
    /** `cinematic.clockSeconds` value at tween end. When equal to
     *  `tweenFromSeconds`, the slot is treated as a snap (driver
     *  jumps the camera to `position` / `lookAt` immediately). */
    tweenToSeconds: z.number().nonnegative(),
    /** Easing curve applied to the normalized [0..1] tween param. */
    ease: z.enum(['linear', 'ease-in', 'ease-out', 'ease-in-out']),
});
// ---------------------------------------------------------------------------
// BeatClock — singleton ECS slot owning the rhythm clock.
//
// Convention: lives on a single entity (typically `id: 'world-beat'`).
// `rhythmSystem` finds it via `world.with('beatClock').first` and
// advances `currentSeconds` each tick by `dt` while running. JSON-
// shaped — save/load round-trips through the existing save bundle
// without special handling, but apps typically rebuild the beat
// clock at battle start rather than persisting it across sessions.
//
// Time domain is real-time seconds accumulated from `dt` — same
// posture as the cinematic system. Replay-deterministic via the
// engine's fixed-timestep accumulator. Apps using
// `bootEngine{2,3}D({ fixedTimestep })` get bit-identical replay
// automatically.
// ---------------------------------------------------------------------------
export const BeatClockSchema = z.object({
    /** Beats per minute. Mutable at runtime via `setBpm`; the system
     *  re-derives the per-beat duration on the fly from this. */
    bpm: z.number().positive(),
    /** Hit-window radius in seconds. An ability flagged `onBeat`
     *  activates when `Math.abs(currentSeconds - beatBoundary) <=
     *  hitWindowSeconds`. Half-window each side; total window is 2×
     *  this value. Set 0 for "must hit exactly on the beat" (only
     *  a single-frame slice per beat). */
    hitWindowSeconds: z.number().nonnegative(),
    /** Beats per measure. Default 4 (4/4 time). Used by
     *  `getBeatProgress` to derive `measureIndex` for UI grouping;
     *  no gameplay logic depends on it. */
    beatsPerMeasure: z.number().int().positive(),
    /** True while the clock advances. `false` freezes
     *  `currentSeconds` (and thus beat firing) without resetting
     *  state — pause / resume preserves phase. `startBeatClock`
     *  sets true; `stopBeatClock` sets false. */
    running: z.boolean(),
    /** Accumulated seconds since the clock started. Advances by
     *  `dt` each tick while `running`. Apps can override via
     *  `setBeatTime(world, seconds)` to nudge the clock back into
     *  sync with an external audio reference (typically
     *  `audioMixer.context().currentTime - songStartTime`). */
    currentSeconds: z.number().nonnegative(),
    /** Bookkeeping — last fired beat index. The system uses this
     *  to detect crossings + fire `'rhythm:beat'` events exactly
     *  once per beat boundary even when dt spans multiple beats.
     *  Initial value is `-1` so the first beat at index 0 fires
     *  on the first tick after the boundary is crossed. */
    lastFiredBeatIndex: z.number().int(),
    /** Bookkeeping — whether the most-recently-crossed hit window
     *  is currently OPEN. The system uses this to fire
     *  `'rhythm:hit-window-open'` exactly once per crossing
     *  (when window-edge transitions from outside → inside) and
     *  `'rhythm:hit-window-close'` once per crossing in the
     *  reverse direction. Initial value is `false`. */
    inHitWindow: z.boolean(),
});
// ---------------------------------------------------------------------------
// PlatformerTuning — feel parameters for the platformer controller.
//
// Pure data; lives on the per-entity `platformerState` slot. Apps
// build per-archetype `easy.json` / `precise.json` / `floaty.json`
// tuning files and load them at archetype-spawn time. The system
// reads these fields each tick to derive the per-frame velocity
// contributions.
// ---------------------------------------------------------------------------
export const PlatformerTuningSchema = z.object({
    /** Peak jump height in world units. The controller computes the
     *  initial jump velocity from this + gravity:
     *  `vJump = sqrt(2 × gravity × jumpHeight)`. */
    jumpHeight: z.number().positive(),
    /** Horizontal speed in world units / second when grounded.
     *  Diagonal movement is normalized so combined moves don't
     *  exceed this magnitude. */
    groundSpeed: z.number().positive(),
    /** Air control fraction (0 = no horizontal influence in air,
     *  1 = full ground control). Most games tune 0.3–0.8. */
    airControl: z.number().min(0).max(1),
    /** Gravity in world units / second² applied to the character
     *  while airborne ascending. Sign convention: positive value =
     *  downward acceleration. */
    gravity: z.number().positive(),
    /** Multiplier on `gravity` applied while airborne falling
     *  (velocity.y < 0). Bigger = snappier fall (Mario-like).
     *  Default 1.5. */
    fallGravityMultiplier: z.number().positive(),
    /** Coyote time in seconds — late jump after walking off a
     *  ledge. Default 0.1s. */
    coyoteTime: z.number().nonnegative(),
    /** Jump buffer in seconds — early jump press registers if you
     *  land within this window. Default 0.15s. */
    jumpBuffer: z.number().nonnegative(),
    /** Horizontal damping in world units / second² applied when
     *  no input is pressed (and the character is grounded). Higher
     *  = faster stop. Set 0 for ice-physics. Default 40. */
    groundFriction: z.number().nonnegative(),
});
// ---------------------------------------------------------------------------
// PlatformerActionMap — input action ids the controller reads from
// the InputManager. Apps map these to keys / buttons / sticks via
// the input rebinding layer; the controller stays opaque to the
// physical bindings.
// ---------------------------------------------------------------------------
export const PlatformerActionMapSchema = z.object({
    moveForward: z.string(),
    moveBack: z.string(),
    moveLeft: z.string(),
    moveRight: z.string(),
    jump: z.string(),
});
// ---------------------------------------------------------------------------
// PlatformerState — per-character ECS slot. Tuning + action map +
// system-maintained bookkeeping (lastGroundedAt, lastJumpPressedAt,
// grounded, accumulatedSeconds for coyote / buffer math).
//
// Save/load round-trips: resuming mid-jump-buffer is a deliberate
// behavior — the system continues consuming the buffer on the next
// tick. Apps that want strict "no-mid-air-on-load" semantics reset
// `accumulatedSeconds` to 0 themselves on load.
// ---------------------------------------------------------------------------
export const PlatformerStateSchema = z.object({
    tuning: PlatformerTuningSchema,
    actions: PlatformerActionMapSchema,
    /** System-maintained: real-time seconds accumulated since the
     *  controller started. Used as the time-base for coyote-window
     *  + jump-buffer comparisons. */
    accumulatedSeconds: z.number().nonnegative(),
    /** System-maintained: `accumulatedSeconds` of the last frame the
     *  character was grounded. Set to a large negative value
     *  initially so the first jump from rest doesn't accidentally
     *  fire via coyote time. */
    lastGroundedAt: z.number(),
    /** System-maintained: `accumulatedSeconds` of the last
     *  jump-press input event. Set to a large negative initially so
     *  the buffered-jump check fails until the player actually
     *  presses jump. */
    lastJumpPressedAt: z.number(),
    /** System-maintained: was the character grounded LAST tick.
     *  Apps read this for animation routing (idle vs falling). */
    grounded: z.boolean(),
    /** System-maintained: did the character jump on the last tick.
     *  Latches true for the frame jump fires; cleared next tick.
     *  Apps subscribe via per-tick polling for jump-VFX cues. */
    jumpedThisTick: z.boolean(),
});
// ---------------------------------------------------------------------------
// SquadFormation — per-follower ECS slot. Points at a leader
// entity (by stable id, not reference, so save/load round-trips
// across miniplex internal-id renumbering) and an offset in
// LEADER-LOCAL space. The squad system writes velocity each tick
// to seek the formation slot.
//
// Reactive behaviors (attack / regroup / disperse) live OUTSIDE
// this slot — apps wire a behavior tree on the same entity that
// mutates this slot's `offset` (or removes it entirely while in
// "attack" mode and re-adds on "regroup").
// ---------------------------------------------------------------------------
export const SquadFormationSchema = z.object({
    /** Stable id of the leader entity. The squad system locates
     *  the leader via `world.where(e => e.id === leaderEntityId)`
     *  each tick (the cost is negligible for typical squad sizes
     *  ≤ 16; apps with larger squads cache the reference
     *  themselves). */
    leaderEntityId: z.string().min(1),
    /** Local offset from leader, world space. The system computes
     *  `desired = leader.transform.position + offset` and seeks
     *  toward it. Apps that want leader-local-yaw rotation of the
     *  formation rotate the offset themselves before writing. */
    offset: Vec3Schema,
    /** Damping rate — controls how fast the squad member catches
     *  up to its formation slot. Higher = faster (1 = sluggish, 5
     *  = snappy, 10 = teleport-feel). Default 5. */
    followDamping: z.number().positive(),
    /** Cap on the desired velocity magnitude written each tick.
     *  Prevents runaway followers when the leader teleports.
     *  Default 8 world units / second. */
    maxSpeed: z.number().positive(),
    /** Distance threshold at which the system clamps velocity to
     *  zero (member is "in formation"). Default 0.1 world units.
     *  Avoids jittery micro-corrections at the formation slot. */
    arrivalRadius: z.number().nonnegative(),
});
// ---------------------------------------------------------------------------
// IkChain — per-entity IK chain referencing skeleton bones by NAME.
//
// Used by `@unsupervised/renderer-3d/ik`'s `<IkSolver>`. The renderer
// resolves bone names against the entity's rendered skeleton at
// mount + frame time (skeleton may not be present on the first
// frame if the GLTF is still loading; the solver no-ops until
// the resolution succeeds).
//
// Authoring convention: the chain array is end-effector FIRST,
// root LAST. For a foot-IK chain on a Mixamo rig:
//   ['mixamorig:LeftFoot', 'mixamorig:LeftLeg', 'mixamorig:LeftUpLeg']
// For a head-look chain:
//   ['mixamorig:Head', 'mixamorig:Neck', 'mixamorig:Spine2']
//
// Multiple chains per entity (via `ikChains: IkChain[]`) cover
// foot-left + foot-right + head-look + arm + arm without per-
// chain ECS state.
// ---------------------------------------------------------------------------
export const IkChainSchema = z.object({
    /** Stable id for this chain. Used by the solver to keep
     *  internal helper bones (one per chain) stable across
     *  ticks; also surfaces in debug tooling. Apps name them
     *  `'foot-l'` / `'foot-r'` / `'head-look'` etc. */
    id: z.string().min(1),
    /** Bone names from end-effector toward root. The solver
     *  needs at least 2 entries (effector + 1 link); typical
     *  chains are 3 (effector + 2 links). */
    chain: z.array(z.string().min(1)).min(2),
    /** World-space position the end effector should reach. Apps
     *  mutate this each frame (raycast hit point for foot IK,
     *  cursor world-position for look IK). */
    target: Vec3Schema,
    /** 0 = pure animation (IK off), 1 = pure IK. v1 supports
     *  the 0 / 1 endpoints; intermediate values are CLAMPED to
     *  0 or 1 (no per-bone weight blending — see CLAUDE.md). */
    weight: z.number().min(0).max(1),
    /** CCD iterations per frame. Default 10. Higher = more
     *  accurate, more cost. Apps tune per chain length:
     *  3-bone foot chain: 8–12; 4-bone arm chain: 12–18. */
    iterations: z.number().int().positive(),
});
// ---------------------------------------------------------------------------
// BoneAttachment — visually attach this entity to a bone on
// another (skinned) entity.
//
// Used by `@unsupervised/renderer-3d/attachments`'s
// `<BoneAttachmentDriver>`. Each frame, the driver:
//   1. Locates the parent entity by `parentEntityId`.
//   2. Looks up the bone by `boneName` on the parent's skeleton
//      (registered via the skinned-mesh registry context).
//   3. Reads the bone's world transform (position + quaternion).
//   4. Writes the local entity's `transform.position` /
//      `transform.rotation` to the bone transform composed with
//      the per-attachment local `offset`.
//
// The local entity carries its own `model3D` (sword GLB, shield
// GLB, hat primitive, etc.) — the attachment slot only drives
// where it lives in world space.
// ---------------------------------------------------------------------------
export const BoneAttachmentSchema = z.object({
    /** Stable id of the parent (skinned-character) entity. The
     *  driver looks this up in the skinned-mesh registry; missing
     *  parent → driver no-ops + warn-once. Save/load round-trips
     *  the id (NOT the runtime entity reference). */
    parentEntityId: z.string().min(1),
    /** Bone name on the parent's skeleton. Same naming
     *  convention as IkChain (Mixamo: `'mixamorig:RightHand'`,
     *  etc.). Missing bone → driver no-ops + warn-once. */
    boneName: z.string().min(1),
    /** Local offset transform applied AFTER the bone's world
     *  transform. Use this to align a sword grip to the hand
     *  bone's coordinate frame, or to add a vertical offset for
     *  a hat sitting on the head bone. */
    offset: TransformSchema,
});
// ---------------------------------------------------------------------------
// TriggerVolume — world-space AABB that fires bus events when
// entities carrying `triggerActor` enter or exit it.
//
// Read by `@unsupervised/features/triggers`'s
// `createTriggerVolumeSystem`. Each tick, the system checks
// every entity with a `triggerActor` + `transform` slot against
// every entity with a `triggerVolume` slot; transitions
// (outside → inside, inside → outside) fire `'trigger:entered'`
// / `'trigger:exited'` on the world's event bus.
//
// Two fire modes:
//   - 'multi' (default): every enter / exit fires its event;
//     the trigger remains live forever. Music biomes, day/night
//     biomes, damage zones, dwell-time tutorials.
//   - 'once': the first enter fires `'trigger:entered'` AND
//     flips `consumed` to `true`. Subsequent ticks skip the
//     trigger entirely (no exit fires either). JRPG encounter
//     triggers, one-shot tutorial popups, "open this door
//     once" affordances.
//
// `min` / `max` are ABSOLUTE world coordinates — apps that
// need moving triggers update `min` / `max` themselves each
// tick (the system reads, never writes). The volume's own
// entity does NOT need a `transform` slot; placing it via a
// `transform` is for visualization / debug tooling.
//
// `payload` is opaque — apps stuff arbitrary metadata in here
// (encounter ids, dialogue script ids, ambient SFX track ids)
// and read it from the event payload.
// ---------------------------------------------------------------------------
export const TriggerVolumeSchema = z.object({
    /** Stable id surfaced in event payloads. App-defined; the
     *  framework treats it as opaque. Convention: prefix with
     *  intent (`'encounter:forest-1'`, `'biome:cave'`,
     *  `'tutorial:first-jump'`). */
    id: z.string().min(1),
    /** World-space min corner of the AABB. */
    min: Vec3Schema,
    /** World-space max corner of the AABB. Each axis must be
     *  >= the corresponding `min` axis; the system asserts this
     *  cheaply and skips degenerate volumes with a warn-once. */
    max: Vec3Schema,
    /** Fire mode. Default `'multi'` — the trigger lives forever
     *  and fires enter/exit on every transition. `'once'` —
     *  the trigger fires `'trigger:entered'` once on the first
     *  enter, flips `consumed: true`, and never fires again. */
    fireMode: z.enum(['multi', 'once']).default('multi'),
    /** System-maintained flag. `true` means a `'once'` trigger
     *  has already fired and is now inert. Apps that want to
     *  re-arm a consumed trigger flip this back to `false`. */
    consumed: z.boolean().default(false),
    /** Optional category for app-side filtering. Subscribers
     *  often only care about one kind of trigger (encounters,
     *  biomes, tutorials) and dispatch on this field. */
    category: z.string().optional(),
    /** Optional filter: only `triggerActor`s with a matching
     *  `tag` field fire this volume. When unset, any actor
     *  with a `triggerActor` slot fires it (most common for
     *  music biomes — the player and pets alike re-trigger). */
    filter: z.string().optional(),
    /** Opaque app payload. Echoed in the fired event so
     *  subscribers don't need a side-channel id → metadata
     *  lookup table. Stays JSON-shaped for save/load. */
    payload: z.record(z.string(), z.unknown()).optional(),
});
// ---------------------------------------------------------------------------
// TriggerActor — opt-in tag marking an entity as a trigger
// participant. Required for the trigger system to consider an
// entity for AABB overlap.
//
// Without this slot, an entity is invisible to the trigger
// system regardless of its transform / velocity. That keeps
// the per-tick cost of the system at O(triggers × actors)
// instead of O(triggers × all-entities) — most entities
// (scenery, projectiles, particle anchors) don't need
// trigger interaction.
// ---------------------------------------------------------------------------
export const TriggerActorSchema = z.object({
    /** Optional discriminator. `triggerVolume.filter` matches
     *  against this; mismatched tag means the volume ignores
     *  this actor. Convention: `'player'` for the controllable
     *  character, `'enemy'` for hostiles, app-defined for
     *  game-specific kinds. */
    tag: z.string().optional(),
    /** Half-extent in world units used for AABB overlap. The
     *  actor's effective bounding box is
     *  `[position - halfExtents, position + halfExtents]`.
     *  Apps using point-only detection set [0,0,0] (or omit
     *  for the default 0 point). Apps using avatar-shaped
     *  detection pass the character's capsule radius / half-
     *  height. */
    halfExtents: Vec3Schema.optional(),
});
// ---------------------------------------------------------------------------
// TopDownCharacter — opinionated kinematic controller for
// top-down games (JRPG overworld, dungeon crawler, twin-stick
// shooter). Apps write per-frame `intent` (movement axes in
// world XZ space, [-1, 1]); the system reads `intent`, scales
// by `speed`, writes the result to `entity.velocity.linear` (or
// integrates `transform.position` directly when the entity has
// no `velocity` slot — the no-physics path).
//
// Optional `rotateToFacing`: when true, the system slerps
// `transform.rotation` toward the movement direction with
// `rotationDamping` (exponential — higher = snappier; default
// 10). Set false for shooters where the character faces the
// cursor independent of movement.
//
// This is the SISTER recipe to `@unsupervised/features/platformer`'s
// jump-focused controller. Use platformer for 3D platformers
// (jump arc, coyote time); use topDownCharacter for JRPGs /
// ARPGs / top-down shooters.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ScreenShake — singleton trauma-style camera shake.
//
// One per world (lives on the `world-screen-shake` singleton by
// convention). Read by `@unsupervised/renderer-3d`'s `<ScreenShakeDriver>`,
// which samples deterministic noise from `seed + sampleIndex` each
// frame and adds the result to the active camera's position +
// orientation. Read AND written by
// `@unsupervised/features/screenShake`'s `screenShakeSystem(world, dt)`,
// which decays `intensity` per tick + bumps `sampleIndex`.
//
// `triggerScreenShake(world, { intensity, ... })` is the imperative
// trigger — sets the intensity to max(current, requested) so
// successive small shakes don't override a big one mid-decay.
//
// Trauma model: per-frame perturbation = `intensity² × maxOffset
// × noise()`. The square gives organic falloff — a half-decayed
// intensity reads as 1/4 the visible motion rather than half,
// which feels right for "the punch lands" cinematic feedback.
//
// Replay-deterministic via the seed + sampleIndex pair: the same
// sequence of triggers reproduces the same per-frame offsets.
// Apps drive trigger calls from recorded commands; the system's
// per-tick decay + sampleIndex bump is deterministic.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ImpactFrame — singleton freeze + full-screen color flash.
//
// One per world (lives on the `world-impact-frame` singleton by
// convention). The "punch lands" cinematic primitive — when a
// fast attack connects, freeze game systems for 50-200ms while a
// full-screen white (or character-themed) flash washes the screen.
// The most cinematic single moment in any anime fight scene.
//
// Read by `@unsupervised/renderer-3d`'s `<ImpactFrameFlash>` post-pass,
// which mixes `color` over the rendered scene by the per-frame
// flash alpha derived from `remainingSeconds / totalDurationSeconds`
// + the hold-then-fade curve gated by `holdRatio`.
//
// Read AND written by `@unsupervised/features/impactFrame`'s
// `createImpactFrameSystem(world)`, which decrements
// `remainingSeconds` per tick (REAL-time dt, not gameClock), fires
// `'impactFrame:ended'` when the timer hits zero, and clears
// `active` so siblings stop gating.
//
// Read by gameplay systems via `isImpactFrameActive(world)` — apps
// gate ability ticks, animation mixers, AI, particles, etc. on this
// check to produce the freeze semantic. Auto-modification of
// shipped systems is INTENTIONALLY NOT done: impact frames are
// short (~100ms) and an interrupt to mid-cast windups would break
// gameplay; apps decide which systems pause.
//
// Replay-deterministic via real-time dt under the engine's fixed-
// timestep accumulator. Save/load: RUNTIME-ONLY (matches
// screenShake / cinematic). A save mid-impact loads with no active
// freeze.
// ---------------------------------------------------------------------------
export const ImpactFrameSchema = z.object({
    /** True while the impact frame is in flight. Sibling systems
     *  read via `isImpactFrameActive(world)`. */
    active: z.boolean().default(false),
    /** Real-time seconds remaining. Decrements each tick via the
     *  raw frame dt. When it hits zero, `'impactFrame:ended'` fires
     *  and `active` flips to false. */
    remainingSeconds: z.number().nonnegative().default(0),
    /** The total requested duration (snapshot at trigger time). The
     *  flash-sample helper uses this to compute normalized progress
     *  0..1 for the hold-then-fade curve. */
    totalDurationSeconds: z.number().nonnegative().default(0),
    /** Pre-parsed flash color in RGB, each channel in [0, 1]. Stored
     *  pre-parsed so the renderer's per-frame sample doesn't have
     *  to call `new Color()` on every read. */
    color: z
        .object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
    })
        .default({ r: 1, g: 1, b: 1 }),
    /** Peak flash multiplier in [0, 1]. 1.0 = full white-out at
     *  peak intensity; 0.5 = "half flash" for subtler hits.
     *  Default 1.0. */
    flashIntensity: z.number().min(0).max(1).default(1),
    /** Fraction in [0, 1] of `totalDurationSeconds` spent at peak
     *  flash before the ease-out fade begins. 0 = pure linear fade
     *  from peak; 0.3 (default) = canonical anime hold-then-fade. */
    holdRatio: z.number().min(0).max(1).default(0.3),
});
export const ScreenShakeSchema = z.object({
    /** Current trauma value in [0, 1]. Decays toward 0 per tick at
     *  `decay` rate; the renderer multiplies this squared by
     *  `maxOffset` / `maxRotation` to derive per-frame perturbation. */
    intensity: z.number().min(0).max(1).default(0),
    /** Max world-space position offset (meters) at intensity = 1.
     *  Apps tune per camera distance: 0.1 for a tight follow cam at
     *  offset [0, 4, 6], 0.3 for a fixed-angle cam at distance 16. */
    maxOffset: z.number().nonnegative().default(0.15),
    /** Max rotational perturbation (radians, applied to yaw + pitch)
     *  at intensity = 1. ~0.03 rad ≈ 1.7°. Combined with `maxOffset`
     *  the visible effect is a punchy jolt with directional bias. */
    maxRotation: z.number().nonnegative().default(0.03),
    /** Decay rate per second. 4 = trauma falls to ~e⁻⁴ ≈ 0.018 in
     *  one second (snappy). Lower = longer-lasting shake. */
    decay: z.number().nonnegative().default(4),
    /** Seed for the per-frame noise. Apps that want bit-identical
     *  replay use a stable seed; default 0 is fine for visual-only
     *  shake. */
    seed: z.number().int().default(0),
    /** System-incremented frame counter for deterministic noise
     *  sampling. Driver-side `mulberry32(seed + sampleIndex)`
     *  produces the per-frame XYZ offset. INTERNAL — apps don't
     *  write this. */
    sampleIndex: z.number().int().nonnegative().default(0),
});
// ---------------------------------------------------------------------------
// CharacterController — Phase 2 KCC tuning slot.
// Applied to a kinematic-capsule entity to enable slope-aware locomotion via
// Rapier's `KinematicCharacterController`. The slot describes WHAT obstacles
// the controller resolves (max slope angle, autostep size, snap-to-ground
// distance); the engine-3d system constructs the Rapier controller, ticks
// it each frame against the entity's `velocity.linear × dt` desired delta,
// and writes the resolved motion via `body.setNextKinematicTranslation`.
// `grounded` is system-written and apps READ for jump gates / landing VFX.
// ---------------------------------------------------------------------------
export const CharacterControllerAutostepSchema = z.object({
    /** Max step height (meters) the character auto-climbs. */
    maxHeight: z.number().positive(),
    /** Min free space (meters) required above the stepped-onto
     *  surface — prevents climbing into a low ceiling. */
    minWidth: z.number().positive(),
    /** Whether the controller will also step over dynamic bodies.
     *  Usually false: dynamic obstacles should be pushed, not
     *  climbed. */
    includeDynamicBodies: z.boolean(),
});
export const CharacterControllerSchema = z.object({
    /** Numerical-stability gap maintained between collider and
     *  obstacles. Rapier docs recommend ~0.01 (1 cm). */
    offset: z.number().positive().optional(),
    /** Max slope angle (radians) the character can climb. Above
     *  this, the controller slides off the slope.
     *  Default π/4 (45°). */
    maxSlopeClimbAngle: z.number().nonnegative().optional(),
    /** Min slope angle (radians) before sliding starts even when
     *  trying to stand still. Default π/4. */
    minSlopeSlideAngle: z.number().nonnegative().optional(),
    /** Auto-step config — null to disable explicitly. When
     *  undefined, the engine uses a sensible default
     *  ({ maxHeight: 0.3, minWidth: 0.1, includeDynamicBodies: false }). */
    autostep: CharacterControllerAutostepSchema.nullable().optional(),
    /** Snap-to-ground distance (meters) — when the character is
     *  grounded but lifts off briefly (running off a small lip),
     *  the controller pulls it back down if the gap is below this
     *  threshold. null disables explicitly. Default 0.2. */
    snapToGroundDistance: z.number().positive().nullable().optional(),
    /** When true, the controller pushes dynamic obstacles instead
     *  of stopping at them. Set true for "the character kicks the
     *  box" feel. Default false. */
    applyImpulsesToDynamics: z.boolean().optional(),
    /** Mass used for impulse resolution when
     *  `applyImpulsesToDynamics` is true. Default 1.0. */
    characterMass: z.number().positive().optional(),
    /** Runtime-written (system-set, NOT author-set): true when the
     *  KCC computed `grounded` on the LAST tick. Apps READ this
     *  for HUD readouts, jump gates, landing VFX. Authors who set
     *  it lose the write on the first tick. */
    grounded: z.boolean().optional(),
});
// ---------------------------------------------------------------------------
// GrabState — Phase 2 Ultrahand pickup slot, lives on the GRABBER entity.
// Holds the runtime reference (by stable id) to the currently-held entity
// plus the guide-point + rotation parameters. `heldEntityId === null` means
// the slot is installed but nothing is currently held (zero-allocation
// re-grab between pickups). Apps mutate via the imperative grab system; the
// system reconciles per-tick (target-lost / distance-exceeded auto-release).
// ---------------------------------------------------------------------------
export const GrabStateSchema = z.object({
    /** Stable id of the currently-held entity, or null when empty. */
    heldEntityId: z.string().nullable(),
    /** Distance (meters) from the grabber's facing-forward origin
     *  to the guide point. Apps mutate via the imperative
     *  `adjustHoldDistance` op (clamped at system level). */
    holdDistance: z.number().positive(),
    /** Quaternion offset applied to the held body's rotation,
     *  relative to the grabber's transform. Identity on
     *  grab-start; apps mutate via `rotateHeld`. */
    rotationOffset: QuaternionSchema,
    /** Snapshot of the held body's PRE-GRAB Rapier body type. The
     *  system restores this on release / weld. The field is
     *  `.optional()` so saves mid-grab serialize cleanly, but
     *  apps should treat it as transient — the system reconciles
     *  on the first post-load tick. */
    previousBodyType: z
        .enum(['dynamic', 'static', 'kinematic'])
        .optional(),
});
// ---------------------------------------------------------------------------
// Recallable — Phase 3 TotK Recall trajectory rewind slot.
// Installed on dynamic bodies that opt in. The system records position +
// rotation + linear/angular velocity samples into a side-table ring buffer
// at the fixed timestep. `startRecall(entity)` swaps the body to kinematic
// and plays back the buffer head → tail; at completion the system restores
// the prior body type AND re-applies the tail-sample velocity so the object
// resumes its original motion at the rewind start (TotK semantics — not "at
// rest after rewind"). Schema carries config + transient runtime fields
// only; the ring buffer itself is system-owned (not save-round-tripped, so
// a save mid-recall loads with an empty buffer and `startRecall` rejects
// until 2 fresh samples accumulate).
// ---------------------------------------------------------------------------
export const RecallableSchema = z.object({
    /** Ring buffer capacity in samples (one sample per fixed tick).
     *  Default 360 (~6 s @ 60Hz). Larger = longer rewind window but
     *  more memory (13 floats × 4 bytes × capacity per entity, so
     *  default ≈ 18.7 KB). */
    capacity: z.number().int().positive().optional(),
    /** Runtime-written: `'idle'` while recording forward,
     *  `'playing'` while rewinding. Apps READ for HUD indicators
     *  ("Recall ready" / "Rewinding"). Authors who set the field
     *  lose the write on the first tick. */
    phase: z.enum(['idle', 'playing']).optional(),
    /** Runtime-written snapshot of pre-recall body type. Restored
     *  at playback end via `restoreBodyTypeSafely`. */
    previousBodyType: z
        .enum(['dynamic', 'static', 'kinematic'])
        .optional(),
});
// ---------------------------------------------------------------------------
// AscendState — Phase 3 TotK Ascend kinematic-rise slot. Apps install on a
// player entity; `startAscend(player)` shape-casts the player's capsule
// upward to find a ceiling, computes the landing Y at that ceiling's slab
// top + capsule clearance, swaps body to kinematic, and ticks the body
// upward at `riseSpeed` until arrival. On arrival the system restores the
// body type and clears velocity. Apps READ `phase` for VFX cues + KCC
// gating (KCC MUST skip ascending entities — see ascend/CLAUDE.md).
// ---------------------------------------------------------------------------
export const AscendStateSchema = z.object({
    /** `'idle'` until `startAscend` succeeds; `'rising'` while the
     *  body is being ticked upward. */
    phase: z.enum(['idle', 'rising']),
    /** Runtime-written: world-Y the entity is rising toward.
     *  Undefined when `phase === 'idle'`. */
    targetY: z.number().optional(),
    /** Vertical speed (m/s) during rise. Default 5. */
    riseSpeed: z.number().positive().optional(),
    /** Max upward shape-cast probe distance. Above this,
     *  `startAscend` fails with reason `'no-ceiling'`. Default 8. */
    maxAscendHeight: z.number().positive().optional(),
    /** Runtime-written snapshot for restore-on-arrival. */
    previousBodyType: z
        .enum(['dynamic', 'static', 'kinematic'])
        .optional(),
});
// ---------------------------------------------------------------------------
// WaterVolume — Phase 3 fluid region. Axis-aligned bounding region (in
// world space when the entity has no transform; otherwise transform.position
// translates the AABB). Buoyant bodies whose AABB overlaps this volume get
// upward buoyancy force + linear/angular drag applied each prePhysics tick
// by the buoyancy system. v1 water surface is flat; wave buoyancy is
// deferred to Phase 3.5.
// ---------------------------------------------------------------------------
export const WaterVolumeSchema = z.object({
    /** AABB bounds in the volume's local frame. When the entity
     *  also has a `transform`, the system offsets these by
     *  `transform.position`. Authors typically place the volume
     *  centred at the world origin with min.y < 0 < max.y so the
     *  water surface sits at y=0. */
    bounds: z.object({
        min: Vec3Schema,
        max: Vec3Schema,
    }),
    /** Fluid density (kg/m³). Default 1000 (real water). Apps
     *  tweak to ~700 for dense fluids (lava feel without the
     *  heat), ~50 for low-buoyancy mist. */
    density: z.number().positive().optional(),
    /** Linear drag coefficient. Default 0.5. Higher = more
     *  viscous; bodies decelerate faster while submerged. */
    linearDrag: z.number().nonnegative().optional(),
    /** Angular drag coefficient. Default 0.5. */
    angularDrag: z.number().nonnegative().optional(),
});
// ---------------------------------------------------------------------------
// Buoyant — Phase 3 fluid opt-in slot. Installed on dynamic bodies that
// should be affected by overlapping water volumes. Body density relative
// to fluid determines float/sink behaviour: density < fluid floats with
// submerged ratio = body/fluid; density > fluid sinks.
// ---------------------------------------------------------------------------
export const BuoyantSchema = z.object({
    /** Body density (kg/m³). Default 600 (typical wood —
     *  comfortably floats in 1000 kg/m³ water at ~60% submerged). */
    density: z.number().positive().optional(),
    /** Per-body multiplier on the water volume's drag
     *  coefficients. Default 1.0. Apps tune for "slippery" feel
     *  (0.2) or "sticky mud" (3.0). */
    dragMultiplier: z.number().nonnegative().optional(),
});
// -------------------------------------------------------------- //
// Renderer Tier 3b — decals                                      //
// -------------------------------------------------------------- //
/** Decal projector. Stamps a texture onto a target entity's mesh
 *  via Three's `DecalGeometry`. The decal renders as a CHILD of
 *  the target Mesh (mounted via R3F's `createPortal`), so Three's
 *  transform inheritance carries the decal along with moving
 *  targets automatically — no per-frame re-projection.
 *
 *  Lifecycle:
 *    - Apps spawn a decal entity via `world.add({ ...decal({...}) })`.
 *    - `EntityRenderer3D` auto-mounts `<DecalDriver>` on first sight.
 *    - DecalDriver resolves the target Mesh via
 *      `DecalTargetRegistry` (per-canvas), builds the geometry, and
 *      mounts the decal as a child of the target Mesh.
 *    - When `lifetime` is set, `createDecalLifetimeSystem` (features
 *      layer) auto-removes the entity after `now - spawnedAt >=
 *      lifetime` and fires `decal:expired` on the bus.
 *
 *  Authoring conventions:
 *    - `targetEntityId` must point at an entity carrying
 *      `decalTarget: true`. Mismatched references warn-once + the
 *      decal renders nothing.
 *    - The projector volume is a box; geometry of the target intersecting
 *      this volume receives the stamp. Size 0.4 m³ is a sensible
 *      bullet-hole; 1-2 m³ for blood pools / footprints.
 *    - `projectorRotation` is Euler XYZ in radians (matching Three's
 *      default Euler order). Apps computing rotation from a hit
 *      normal use `Object3D.lookAt(...)` and read `rotation` out. */
export const DecalSchema = z.object({
    /** URL or path to the decal texture. Apps pass forge-emitted
     *  ids or raw URLs; the driver fetches via Three's TextureLoader
     *  with per-URL caching. */
    textureUrl: z.string(),
    /** Stable entity id of the target whose mesh receives the
     *  projection. */
    targetEntityId: z.string(),
    /** Projector origin in world-space. */
    projectorPosition: Vec3Schema,
    /** Projector orientation as Euler XYZ in radians. */
    projectorRotation: Vec3Schema,
    /** Box dimensions of the projector volume (world units). */
    size: Vec3Schema,
    /** Opacity 0..1 applied uniformly. Default 1. */
    opacity: z.number().min(0).max(1).optional(),
    /** When set, the decal auto-removes `lifetime` seconds after
     *  `spawnedAt`. */
    lifetime: z.number().positive().optional(),
    /** When true + `lifetime` is set, opacity ramps from `opacity`
     *  to 0 over the LAST 20% of the lifetime window. Default false
     *  (instant pop-out). */
    fadeOut: z.boolean().optional(),
    /** Runtime-written by `createDecalLifetimeSystem` on first tick
     *  after the decal entity appears. Apps should not author this. */
    spawnedAt: z.number().optional(),
});
/** Marker slot — entities with `decalTarget: true` auto-register
 *  their renderable Mesh in the per-canvas `DecalTargetRegistry`
 *  so decals can resolve them. Apps mark walls / floors / props /
 *  static characters that should accept decals. */
export const DecalTargetSchema = z.boolean();
// -------------------------------------------------------------- //
// Renderer Tier 3b — LOD                                         //
// -------------------------------------------------------------- //
/** One LOD level. `distance` is the SQUARED distance from camera
 *  at which this level activates. Squared distance avoids per-frame
 *  `sqrt`; apps authoring in meters multiply by themselves
 *  (`10² = 100`, `25² = 625`). */
export const LodLevelSchema = z.object({
    distance: z.number().nonnegative(),
    modelId: z.string(),
});
/** Distance-based LOD configuration. `createLodSystem` reads each
 *  entity's `transform.position`, computes squared distance to the
 *  camera, walks `levels` ascending, picks the highest-index level
 *  whose `distance` is below distSq, and rewrites the entity's
 *  `renderable.modelId` (3D variant) to match. The existing
 *  renderable pipeline + ModelBank lookup picks up the swap.
 *
 *  Authoring conventions:
 *    - `levels` must be sorted ascending by `distance`. The `lod()`
 *      builder enforces this at construction; bypassing the builder
 *      produces undefined system behavior. Following the package
 *      `CLAUDE.md` rule, cross-field invariants do NOT live in the
 *      schema (refinements break `EntitySchema.shape.foo.optional()`
 *      composition).
 *    - Level 0 = closest / highest detail.
 *    - `hysteresis` of 0.05 (5%) is the default — high enough to
 *      eliminate boundary thrash, low enough to feel responsive. */
export const LodSchema = z.object({
    levels: z.array(LodLevelSchema).min(1),
    /** Hysteresis fraction in [0, 0.5]. Prevents level-boundary
     *  thrashing when an entity sits exactly on a transition. */
    hysteresis: z.number().min(0).max(0.5).optional(),
    /** Runtime-written by the LOD system each tick. Apps should
     *  treat as read-only. */
    activeIndex: z.number().int().nonnegative().optional(),
});
export const TopDownCharacterSchema = z.object({
    /** Move speed in meters/second. Apps tune per character
     *  archetype: 5 for a JRPG overworld walker, 8 for an
     *  ARPG, 12+ for a top-down shooter. */
    speed: z.number().nonnegative().default(5),
    /** When true, the system rotates the entity's transform to
     *  face the movement direction (smoothed via `rotationDamping`).
     *  When false, transform.rotation is left untouched — typical
     *  for shooters that aim independent of movement. */
    rotateToFacing: z.boolean().default(true),
    /** Exponential rotation smoothing factor. Higher = snappier;
     *  lower = laggier. 10 reads "ARPG-snappy" for most movement
     *  speeds. */
    rotationDamping: z.number().nonnegative().default(10),
    /** Per-frame movement intent in world XZ. Apps write this
     *  every frame from input, AI, or scripted control. The
     *  system reads, never writes. Magnitudes > 1 are clamped
     *  via vector normalization so diagonal input doesn't
     *  exceed `speed`. */
    intent: z
        .object({
        x: z.number().default(0),
        z: z.number().default(0),
    })
        .default(() => ({ x: 0, z: 0 })),
});
// ---------------------------------------------------------------------------
// WorldTimescale — singleton ECS slot owning the engine-wide time
// dilation factor. Written by `@unsupervised/timescale`'s `setGlobalScale` /
// `easeGlobalScale`; read by every consumer that needs to multiply its
// per-tick dt (movement, casting, animation mixers, VFX, audio
// pitch-ramps). One slot per world, hence the singleton convention.
//
// The slot also stores the in-flight ease's `from` / `to` / `startMs`
// / `durationMs` / `curve` so save/load round-trips a paused-mid-ramp
// state without snapping. `currentMs` advances by REAL dt (not scaled)
// so the dilation itself doesn't slow the ramp toward its target.
// ---------------------------------------------------------------------------
export const TimescaleEasingCurveSchema = z.enum([
    'linear',
    'easeInQuad',
    'easeOutQuad',
    'easeInOutCubic',
]);
export const TimescaleEaseStateSchema = z.object({
    /** Scale at the moment the ease was started. */
    fromScale: z.number().positive(),
    /** Scale the ease is interpolating toward. */
    toScale: z.number().positive(),
    /** Real-time milliseconds elapsed since the ease started. Advanced
     *  by `tickTimescale(world, realDtSeconds)` with REAL dt, not
     *  scaled dt — the ramp finishes in wall-clock time, not in
     *  world-time. */
    currentMs: z.number().nonnegative(),
    /** Total real-time milliseconds the ease occupies. */
    durationMs: z.number().positive(),
    /** Interpolation curve. `'easeOutQuad'` is the canonical bullet-
     *  time choice (fast snap into slow-mo, gentle settle). */
    curve: TimescaleEasingCurveSchema,
});
export const WorldTimescaleSchema = z.object({
    /** Currently applied global time-dilation factor. Apps multiply
     *  their per-tick dt by this when advancing time-coupled
     *  simulation. `1` = real-time; `0.3` = slo-mo; `2` = fast-
     *  forward. Strictly positive — the package rejects `0` (which
     *  would freeze the world forever) and negative values. */
    scale: z.number().positive(),
    /** In-flight ease metadata, present only while an `easeGlobalScale`
     *  call is animating toward its target. `tickTimescale` clears it
     *  on completion. */
    ease: TimescaleEaseStateSchema.optional(),
});
// ---------------------------------------------------------------------------
// TimeDecoupled — per-entity opt-out from the global timescale.
//
// The bullet-time use case: when global scale is `0.3`, the player
// entity carries a `timeDecoupled` slot with `scale: 1` so it advances
// at full speed against a slowed world. Generalizes to UI cinematics
// (camera operator stays responsive while game world freezes) and
// casting animations (a wind-up plays at 1× while a hit-stop pauses
// everyone else).
//
// `scale` is the multiplier APPLIED INSTEAD OF the global scale, not
// in addition to it. An entity with `timeDecoupled.scale === 2` runs
// at 2× real-time regardless of global dilation; the package's
// `effectiveScaleFor(world, entity)` returns the override directly.
// ---------------------------------------------------------------------------
export const TimeDecoupledSchema = z.object({
    /** Multiplier applied INSTEAD OF the global scale for the
     *  carrying entity. Default `1.0` (full real-time during
     *  dilation). Strictly positive. */
    scale: z.number().positive().default(1),
});
//# sourceMappingURL=components.js.map