import { z } from 'zod';
/**
 * Two-dimensional vector. Used for 2D-native data that has no meaningful
 * depth axis — sprite anchors, 2D UI positions, 2D screen-space offsets.
 * For world-space positions in a 2D simulation we still use Vec3 (with
 * z left at 0 or used as a depth layer) to keep Transform uniform across
 * the 2D and 3D engines. See Vec3Schema for the distinction.
 */
export declare const Vec2Schema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>;
export type Vec2 = z.infer<typeof Vec2Schema>;
/**
 * Three-dimensional vector. Used for positions, scales, linear/angular
 * velocities, and any other {x,y,z} quantity. Always in world-local units
 * appropriate to the field (meters for position, m/s for linear velocity,
 * etc.) — document units at the USE site, not here.
 */
export declare const Vec3Schema: z.ZodObject<{
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
export type Vec3 = z.infer<typeof Vec3Schema>;
/**
 * Unit quaternion representing a 3D rotation. Callers are expected to
 * normalize; the schema does NOT enforce ||q|| == 1 because strict
 * equality on floats is a trap. If a system requires a normalized
 * quaternion it should normalize on read.
 */
export declare const QuaternionSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    z: z.ZodNumber;
    w: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    z: number;
    w: number;
}, {
    x: number;
    y: number;
    z: number;
    w: number;
}>;
export type Quaternion = z.infer<typeof QuaternionSchema>;
export declare const TransformSchema: z.ZodObject<{
    /** World-space position, meters. */
    position: z.ZodObject<{
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
    /** World-space orientation as a unit quaternion. */
    rotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
    /** Per-axis scale multiplier; (1,1,1) is identity. Non-uniform scale is
     *  allowed but tends to fight physics — prefer uniform where possible. */
    scale: z.ZodObject<{
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
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    scale: {
        x: number;
        y: number;
        z: number;
    };
}, {
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    scale: {
        x: number;
        y: number;
        z: number;
    };
}>;
export type Transform = z.infer<typeof TransformSchema>;
export declare const VelocitySchema: z.ZodObject<{
    /** Linear velocity in m/s. */
    linear: z.ZodObject<{
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
    /** Angular velocity in rad/s, per world axis. */
    angular: z.ZodObject<{
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
    linear: {
        x: number;
        y: number;
        z: number;
    };
    angular: {
        x: number;
        y: number;
        z: number;
    };
}, {
    linear: {
        x: number;
        y: number;
        z: number;
    };
    angular: {
        x: number;
        y: number;
        z: number;
    };
}>;
export type Velocity = z.infer<typeof VelocitySchema>;
/** Sprite composition mode — a renderer-neutral subset. 2D renderers
 *  map each literal onto their native blend primitive ('normal' is
 *  source-over, 'add' is linear-add, etc.). The set is deliberately
 *  small; most games never need more. */
export declare const BlendModeSchema: z.ZodEnum<["normal", "add", "multiply", "screen"]>;
export type BlendMode = z.infer<typeof BlendModeSchema>;
/** 2D renderable — consumed by a 2D renderer (PixiJS and friends).
 *  `zIndex` is the painter's-algorithm draw order; `tint` is a
 *  renderer-neutral 0xRRGGBB multiplier applied to the sprite. */
export declare const Renderable2DSchema: z.ZodObject<{
    type: z.ZodLiteral<"2d">;
    /** Asset-registry key for the sprite / texture. */
    spriteId: z.ZodString;
    /** Optional 0xRRGGBB tint multiplied into the sprite color. */
    tint: z.ZodOptional<z.ZodNumber>;
    /** Optional painter's-algorithm layer index. Higher draws on top. */
    zIndex: z.ZodOptional<z.ZodNumber>;
    /** Whether the renderer should draw this entity. Renderer default
     *  is `true`; set to `false` to hide an entity without removing it
     *  from the world (stealth, culling, debug toggles). */
    visible: z.ZodOptional<z.ZodBoolean>;
    /** Sprite anchor (pivot) as a 0–1 fraction of the sprite's bounds.
     *  (0, 0) is top-left; (0.5, 0.5) is center; (1, 1) is bottom-right.
     *  Renderer default is (0.5, 0.5) — rotations pivot around the
     *  sprite's center, which is the standard game-sprite convention. */
    anchor: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>;
    /** Multiplicative alpha, 0 = fully transparent, 1 = fully opaque.
     *  Renderer default is 1. */
    opacity: z.ZodOptional<z.ZodNumber>;
    /** Composition mode. Renderer default is 'normal'. Useful values:
     *  'add' for glows / lasers / particles; 'multiply' for shadows. */
    blendMode: z.ZodOptional<z.ZodEnum<["normal", "add", "multiply", "screen"]>>;
}, "strip", z.ZodTypeAny, {
    type: "2d";
    spriteId: string;
    tint?: number | undefined;
    zIndex?: number | undefined;
    visible?: boolean | undefined;
    anchor?: {
        x: number;
        y: number;
    } | undefined;
    opacity?: number | undefined;
    blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
}, {
    type: "2d";
    spriteId: string;
    tint?: number | undefined;
    zIndex?: number | undefined;
    visible?: boolean | undefined;
    anchor?: {
        x: number;
        y: number;
    } | undefined;
    opacity?: number | undefined;
    blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
}>;
export type Renderable2D = z.infer<typeof Renderable2DSchema>;
/** 3D renderable — consumed by a 3D renderer (ThreeJS and friends).
 *  `materialId` is optional because the renderer can supply a default
 *  material when none is specified. */
export declare const Renderable3DSchema: z.ZodObject<{
    type: z.ZodLiteral<"3d">;
    /** Asset-registry key for the mesh / model. */
    modelId: z.ZodString;
    /** Asset-registry key for the material. Optional — the renderer
     *  substitutes a default when absent. */
    materialId: z.ZodOptional<z.ZodString>;
    /** Whether this entity contributes to the shadow map. */
    castShadow: z.ZodOptional<z.ZodBoolean>;
    /** Whether shadows from other casters fall on this entity. Renderer
     *  default is `true`; set `false` for skyboxes, self-lit HUD
     *  elements, and anything that shouldn't receive scene lighting
     *  occlusion. */
    receiveShadow: z.ZodOptional<z.ZodBoolean>;
    /** Whether the renderer should draw this entity. Renderer default
     *  is `true`; see the 2D variant for the same semantics. */
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "3d";
    modelId: string;
    visible?: boolean | undefined;
    materialId?: string | undefined;
    castShadow?: boolean | undefined;
    receiveShadow?: boolean | undefined;
}, {
    type: "3d";
    modelId: string;
    visible?: boolean | undefined;
    materialId?: string | undefined;
    castShadow?: boolean | undefined;
    receiveShadow?: boolean | undefined;
}>;
export type Renderable3D = z.infer<typeof Renderable3DSchema>;
/** Discriminated union over both renderable variants. The `type` literal
 *  is the discriminant — callers can `switch (r.type)` and TypeScript
 *  narrows to the correct variant with no runtime instanceof checks. */
export declare const RenderableUnionSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"2d">;
    /** Asset-registry key for the sprite / texture. */
    spriteId: z.ZodString;
    /** Optional 0xRRGGBB tint multiplied into the sprite color. */
    tint: z.ZodOptional<z.ZodNumber>;
    /** Optional painter's-algorithm layer index. Higher draws on top. */
    zIndex: z.ZodOptional<z.ZodNumber>;
    /** Whether the renderer should draw this entity. Renderer default
     *  is `true`; set to `false` to hide an entity without removing it
     *  from the world (stealth, culling, debug toggles). */
    visible: z.ZodOptional<z.ZodBoolean>;
    /** Sprite anchor (pivot) as a 0–1 fraction of the sprite's bounds.
     *  (0, 0) is top-left; (0.5, 0.5) is center; (1, 1) is bottom-right.
     *  Renderer default is (0.5, 0.5) — rotations pivot around the
     *  sprite's center, which is the standard game-sprite convention. */
    anchor: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>;
    /** Multiplicative alpha, 0 = fully transparent, 1 = fully opaque.
     *  Renderer default is 1. */
    opacity: z.ZodOptional<z.ZodNumber>;
    /** Composition mode. Renderer default is 'normal'. Useful values:
     *  'add' for glows / lasers / particles; 'multiply' for shadows. */
    blendMode: z.ZodOptional<z.ZodEnum<["normal", "add", "multiply", "screen"]>>;
}, "strip", z.ZodTypeAny, {
    type: "2d";
    spriteId: string;
    tint?: number | undefined;
    zIndex?: number | undefined;
    visible?: boolean | undefined;
    anchor?: {
        x: number;
        y: number;
    } | undefined;
    opacity?: number | undefined;
    blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
}, {
    type: "2d";
    spriteId: string;
    tint?: number | undefined;
    zIndex?: number | undefined;
    visible?: boolean | undefined;
    anchor?: {
        x: number;
        y: number;
    } | undefined;
    opacity?: number | undefined;
    blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"3d">;
    /** Asset-registry key for the mesh / model. */
    modelId: z.ZodString;
    /** Asset-registry key for the material. Optional — the renderer
     *  substitutes a default when absent. */
    materialId: z.ZodOptional<z.ZodString>;
    /** Whether this entity contributes to the shadow map. */
    castShadow: z.ZodOptional<z.ZodBoolean>;
    /** Whether shadows from other casters fall on this entity. Renderer
     *  default is `true`; set `false` for skyboxes, self-lit HUD
     *  elements, and anything that shouldn't receive scene lighting
     *  occlusion. */
    receiveShadow: z.ZodOptional<z.ZodBoolean>;
    /** Whether the renderer should draw this entity. Renderer default
     *  is `true`; see the 2D variant for the same semantics. */
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "3d";
    modelId: string;
    visible?: boolean | undefined;
    materialId?: string | undefined;
    castShadow?: boolean | undefined;
    receiveShadow?: boolean | undefined;
}, {
    type: "3d";
    modelId: string;
    visible?: boolean | undefined;
    materialId?: string | undefined;
    castShadow?: boolean | undefined;
    receiveShadow?: boolean | undefined;
}>]>;
export type RenderableUnion = z.infer<typeof RenderableUnionSchema>;
/** Motion class of the rigid body. */
export declare const BodyTypeSchema: z.ZodEnum<["dynamic", "static", "kinematic"]>;
export type BodyType = z.infer<typeof BodyTypeSchema>;
/** Axis-aligned box collider. `halfExtents` are half of the full size per
 *  axis — a 2×4×2 box has halfExtents `{ x: 1, y: 2, z: 1 }`. */
export declare const BoxColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"box">;
    halfExtents: z.ZodObject<{
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
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
}, {
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
}>;
export type BoxCollider = z.infer<typeof BoxColliderSchema>;
/** Uniform sphere collider (3D) / disk collider (2D). */
export declare const SphereColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"sphere">;
    radius: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    shape: "sphere";
    radius: number;
}, {
    shape: "sphere";
    radius: number;
}>;
export type SphereCollider = z.infer<typeof SphereColliderSchema>;
/** Capsule — cylindrical section plus hemispherical caps. Total height
 *  along the local Y axis is `2 * (halfHeight + radius)`. 2D engines
 *  treat this as a capsule in the XY plane. */
export declare const CapsuleColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"capsule">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
}, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
}>;
export type CapsuleCollider = z.infer<typeof CapsuleColliderSchema>;
/** Pre-baked triangle-soup collider. `meshId` is an asset-registry key
 *  resolved to vertex/index arrays by the physics system. Expensive —
 *  reserved for static level geometry, never for dynamic bodies. */
export declare const MeshColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"mesh">;
    meshId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    shape: "mesh";
    meshId: string;
}, {
    shape: "mesh";
    meshId: string;
}>;
export type MeshCollider = z.infer<typeof MeshColliderSchema>;
/** Cylinder collider (Phase 1). Total height along local Y is
 *  `2 * halfHeight`; radius is in the XZ plane. Useful for legs of
 *  compound bodies, pillars, props with a barrel-like profile. */
export declare const CylinderColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"cylinder">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
}, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
}>;
export type CylinderCollider = z.infer<typeof CylinderColliderSchema>;
/** Convex-hull collider (Phase 1). Apps pass authored vertex
 *  positions as a flat `[x, y, z, x, y, z, …]` Float32 array; the
 *  physics system feeds them to Rapier's hull computation. Use for
 *  irregular rigid props (rocks, debris) where a box / sphere is too
 *  crude but a trimesh is overkill. Minimum 4 unique non-coplanar
 *  points; Rapier rejects degenerate inputs internally. */
export declare const ConvexHullColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"convex-hull">;
    points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
}, "strip", z.ZodTypeAny, {
    shape: "convex-hull";
    points: number[];
}, {
    shape: "convex-hull";
    points: number[];
}>;
export type ConvexHullCollider = z.infer<typeof ConvexHullColliderSchema>;
/** Trimesh collider (Phase 1). Triangle-soup geometry — vertex
 *  positions in a flat `[x, y, z, …]` array, plus triangle indices
 *  in a flat `[i0, i1, i2, …]` array. STATIC ONLY. Dynamic trimesh is
 *  an order of magnitude slower than primitive shapes AND
 *  trimesh-trimesh collision doesn't exist; the physics system
 *  rejects dynamic + trimesh with a clear error at body creation. */
export declare const TrimeshColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"trimesh">;
    vertices: z.ZodArray<z.ZodNumber, "many">;
    indices: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    shape: "trimesh";
    vertices: number[];
    indices: number[];
}, {
    shape: "trimesh";
    vertices: number[];
    indices: number[];
}>;
export type TrimeshCollider = z.infer<typeof TrimeshColliderSchema>;
/** Heightfield collider (Phase 1). Rapier reads `nrows` / `ncols`
 *  as the number of *cells* (quad subdivisions) along the X / Z axes,
 *  so `heights.length` MUST equal `(nrows + 1) * (ncols + 1)` — one
 *  sample per cell corner. Mismatching dimensions is a WASM panic
 *  ("unreachable") inside Rapier; the body-creation system guards
 *  this with a clean error before construction. `scale.x` spans
 *  `ncols` cells, `scale.z` spans `nrows`, `scale.y` multiplies the
 *  height values. STATIC ONLY for the same reasons as trimesh. */
export declare const HeightfieldColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"heightfield">;
    heights: z.ZodArray<z.ZodNumber, "many">;
    nrows: z.ZodNumber;
    ncols: z.ZodNumber;
    scale: z.ZodObject<{
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
    shape: "heightfield";
    scale: {
        x: number;
        y: number;
        z: number;
    };
    heights: number[];
    nrows: number;
    ncols: number;
}, {
    shape: "heightfield";
    scale: {
        x: number;
        y: number;
        z: number;
    };
    heights: number[];
    nrows: number;
    ncols: number;
}>;
export type HeightfieldCollider = z.infer<typeof HeightfieldColliderSchema>;
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
export declare const CompoundChildBoxSchema: z.ZodObject<{
    shape: z.ZodLiteral<"box">;
    halfExtents: z.ZodObject<{
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
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>;
export declare const CompoundChildSphereSchema: z.ZodObject<{
    shape: z.ZodLiteral<"sphere">;
    radius: z.ZodNumber;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "sphere";
    radius: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "sphere";
    radius: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>;
export declare const CompoundChildCapsuleSchema: z.ZodObject<{
    shape: z.ZodLiteral<"capsule">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>;
export declare const CompoundChildCylinderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"cylinder">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>;
export declare const CompoundChildConvexHullSchema: z.ZodObject<{
    shape: z.ZodLiteral<"convex-hull">;
    points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "convex-hull";
    points: number[];
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "convex-hull";
    points: number[];
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>;
export declare const CompoundChildSchema: z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
    shape: z.ZodLiteral<"box">;
    halfExtents: z.ZodObject<{
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
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>, z.ZodObject<{
    shape: z.ZodLiteral<"sphere">;
    radius: z.ZodNumber;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "sphere";
    radius: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "sphere";
    radius: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>, z.ZodObject<{
    shape: z.ZodLiteral<"capsule">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>, z.ZodObject<{
    shape: z.ZodLiteral<"cylinder">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>, z.ZodObject<{
    shape: z.ZodLiteral<"convex-hull">;
    points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
    localOffset: z.ZodObject<{
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
    localRotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
}, "strip", z.ZodTypeAny, {
    shape: "convex-hull";
    points: number[];
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}, {
    shape: "convex-hull";
    points: number[];
    localOffset: {
        x: number;
        y: number;
        z: number;
    };
    localRotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}>]>;
export type CompoundChild = z.infer<typeof CompoundChildSchema>;
/** Compound collider (Phase 1) — one rigid body with N attached
 *  child colliders. Mass + inertia are computed by Rapier from the
 *  union of children's volumes. Use for shapes a single primitive
 *  can't represent: a "table" (box top + 4 cylinder legs), a "rock
 *  pile" (multiple spheres + boxes), a vehicle chassis assembled
 *  from box parts. */
export declare const CompoundColliderSchema: z.ZodObject<{
    shape: z.ZodLiteral<"compound">;
    children: z.ZodArray<z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
        shape: z.ZodLiteral<"box">;
        halfExtents: z.ZodObject<{
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
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"sphere">;
        radius: z.ZodNumber;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"capsule">;
        halfHeight: z.ZodNumber;
        radius: z.ZodNumber;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"cylinder">;
        halfHeight: z.ZodNumber;
        radius: z.ZodNumber;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"convex-hull">;
        points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    shape: "compound";
    children: ({
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    })[];
}, {
    shape: "compound";
    children: ({
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    })[];
}>;
export type CompoundCollider = z.infer<typeof CompoundColliderSchema>;
/** Discriminated union of every collider variant. Callers switch
 *  on `collider.shape` and get the narrow shape with no casts.
 *  Event-opt-in flags are inlined on each variant rather than
 *  added via intersection — keeps the schema composable with
 *  Zod's `EntitySchema.shape.physics.optional()` pattern. */
export declare const ColliderSchema: z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
    shape: z.ZodLiteral<"box">;
    halfExtents: z.ZodObject<{
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
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"sphere">;
    radius: z.ZodNumber;
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "sphere";
    radius: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "sphere";
    radius: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"capsule">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "capsule";
    radius: number;
    halfHeight: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"mesh">;
    meshId: z.ZodString;
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "mesh";
    meshId: string;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "mesh";
    meshId: string;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"cylinder">;
    halfHeight: z.ZodNumber;
    radius: z.ZodNumber;
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "cylinder";
    radius: number;
    halfHeight: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"convex-hull">;
    points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "convex-hull";
    points: number[];
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "convex-hull";
    points: number[];
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"trimesh">;
    vertices: z.ZodArray<z.ZodNumber, "many">;
    indices: z.ZodArray<z.ZodNumber, "many">;
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "trimesh";
    vertices: number[];
    indices: number[];
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "trimesh";
    vertices: number[];
    indices: number[];
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"heightfield">;
    heights: z.ZodArray<z.ZodNumber, "many">;
    nrows: z.ZodNumber;
    ncols: z.ZodNumber;
    scale: z.ZodObject<{
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
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "heightfield";
    scale: {
        x: number;
        y: number;
        z: number;
    };
    heights: number[];
    nrows: number;
    ncols: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "heightfield";
    scale: {
        x: number;
        y: number;
        z: number;
    };
    heights: number[];
    nrows: number;
    ncols: number;
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>, z.ZodObject<{
    shape: z.ZodLiteral<"compound">;
    children: z.ZodArray<z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
        shape: z.ZodLiteral<"box">;
        halfExtents: z.ZodObject<{
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
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"sphere">;
        radius: z.ZodNumber;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"capsule">;
        halfHeight: z.ZodNumber;
        radius: z.ZodNumber;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"cylinder">;
        halfHeight: z.ZodNumber;
        radius: z.ZodNumber;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"convex-hull">;
        points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
        localOffset: z.ZodObject<{
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
        localRotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }, {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    }>]>, "many">;
} & {
    readonly isSensor: z.ZodOptional<z.ZodBoolean>;
    readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
    readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: "compound";
    children: ({
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    })[];
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}, {
    shape: "compound";
    children: ({
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "sphere";
        radius: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    } | {
        shape: "convex-hull";
        points: number[];
        localOffset: {
            x: number;
            y: number;
            z: number;
        };
        localRotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
    })[];
    isSensor?: boolean | undefined;
    emitCollisionEvents?: boolean | undefined;
    contactForceEventThreshold?: number | undefined;
}>]>;
export type Collider = z.infer<typeof ColliderSchema>;
export declare const PhysicsBodySchema: z.ZodObject<{
    bodyType: z.ZodEnum<["dynamic", "static", "kinematic"]>;
    /** Mass in kg. 0 is only valid for static bodies; dynamic bodies with
     *  mass == 0 are an engine-level error. Not enforced here because the
     *  combined invariant spans two fields — validate at the entity level
     *  or at the physics-system boundary. */
    mass: z.ZodNumber;
    /** The collider primitive to build. Each variant carries its own
     *  dimensions, so the physics system can spawn a Rapier collider
     *  without consulting an external registry for simple primitives. */
    collider: z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
        shape: z.ZodLiteral<"box">;
        halfExtents: z.ZodObject<{
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
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"sphere">;
        radius: z.ZodNumber;
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "sphere";
        radius: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "sphere";
        radius: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"capsule">;
        halfHeight: z.ZodNumber;
        radius: z.ZodNumber;
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"mesh">;
        meshId: z.ZodString;
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "mesh";
        meshId: string;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "mesh";
        meshId: string;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"cylinder">;
        halfHeight: z.ZodNumber;
        radius: z.ZodNumber;
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"convex-hull">;
        points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "convex-hull";
        points: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "convex-hull";
        points: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"trimesh">;
        vertices: z.ZodArray<z.ZodNumber, "many">;
        indices: z.ZodArray<z.ZodNumber, "many">;
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "trimesh";
        vertices: number[];
        indices: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "trimesh";
        vertices: number[];
        indices: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"heightfield">;
        heights: z.ZodArray<z.ZodNumber, "many">;
        nrows: z.ZodNumber;
        ncols: z.ZodNumber;
        scale: z.ZodObject<{
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
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "heightfield";
        scale: {
            x: number;
            y: number;
            z: number;
        };
        heights: number[];
        nrows: number;
        ncols: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "heightfield";
        scale: {
            x: number;
            y: number;
            z: number;
        };
        heights: number[];
        nrows: number;
        ncols: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>, z.ZodObject<{
        shape: z.ZodLiteral<"compound">;
        children: z.ZodArray<z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
            shape: z.ZodLiteral<"box">;
            halfExtents: z.ZodObject<{
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
            localOffset: z.ZodObject<{
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
            localRotation: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodNumber;
                w: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z: number;
                w: number;
            }, {
                x: number;
                y: number;
                z: number;
                w: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }, {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"sphere">;
            radius: z.ZodNumber;
            localOffset: z.ZodObject<{
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
            localRotation: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodNumber;
                w: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z: number;
                w: number;
            }, {
                x: number;
                y: number;
                z: number;
                w: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            shape: "sphere";
            radius: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }, {
            shape: "sphere";
            radius: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"capsule">;
            halfHeight: z.ZodNumber;
            radius: z.ZodNumber;
            localOffset: z.ZodObject<{
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
            localRotation: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodNumber;
                w: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z: number;
                w: number;
            }, {
                x: number;
                y: number;
                z: number;
                w: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }, {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"cylinder">;
            halfHeight: z.ZodNumber;
            radius: z.ZodNumber;
            localOffset: z.ZodObject<{
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
            localRotation: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodNumber;
                w: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z: number;
                w: number;
            }, {
                x: number;
                y: number;
                z: number;
                w: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }, {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"convex-hull">;
            points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
            localOffset: z.ZodObject<{
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
            localRotation: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodNumber;
                w: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z: number;
                w: number;
            }, {
                x: number;
                y: number;
                z: number;
                w: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            shape: "convex-hull";
            points: number[];
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }, {
            shape: "convex-hull";
            points: number[];
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        }>]>, "many">;
    } & {
        readonly isSensor: z.ZodOptional<z.ZodBoolean>;
        readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
        readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: "compound";
        children: ({
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "sphere";
            radius: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "convex-hull";
            points: number[];
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        })[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }, {
        shape: "compound";
        children: ({
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "sphere";
            radius: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "convex-hull";
            points: number[];
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        })[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    }>]>;
    /** Bounciness, 0–1. 0 = perfectly inelastic (sticks on contact),
     *  1 = lossless elastic. Default when omitted is engine-specific
     *  (Rapier: 0). */
    restitution: z.ZodOptional<z.ZodNumber>;
    /** Surface friction coefficient. 0 = ice, ~1 = rubber. Default
     *  engine-specific (Rapier: 0.5). */
    friction: z.ZodOptional<z.ZodNumber>;
    /** Linear velocity damping, applied each second. Models air drag;
     *  0 = none, higher values bleed off velocity faster. */
    linearDamping: z.ZodOptional<z.ZodNumber>;
    /** Angular velocity damping, applied each second. Slows spin. */
    angularDamping: z.ZodOptional<z.ZodNumber>;
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
    lockedAxes: z.ZodOptional<z.ZodObject<{
        translation: z.ZodOptional<z.ZodObject<{
            x: z.ZodOptional<z.ZodBoolean>;
            y: z.ZodOptional<z.ZodBoolean>;
            z: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        }, {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        }>>;
        rotation: z.ZodOptional<z.ZodObject<{
            x: z.ZodOptional<z.ZodBoolean>;
            y: z.ZodOptional<z.ZodBoolean>;
            z: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        }, {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        rotation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
        translation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
    }, {
        rotation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
        translation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    bodyType: "dynamic" | "static" | "kinematic";
    mass: number;
    collider: {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "sphere";
        radius: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "mesh";
        meshId: string;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "convex-hull";
        points: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "trimesh";
        vertices: number[];
        indices: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "heightfield";
        scale: {
            x: number;
            y: number;
            z: number;
        };
        heights: number[];
        nrows: number;
        ncols: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "compound";
        children: ({
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "sphere";
            radius: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "convex-hull";
            points: number[];
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        })[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    };
    restitution?: number | undefined;
    friction?: number | undefined;
    linearDamping?: number | undefined;
    angularDamping?: number | undefined;
    lockedAxes?: {
        rotation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
        translation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
    } | undefined;
}, {
    bodyType: "dynamic" | "static" | "kinematic";
    mass: number;
    collider: {
        shape: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "sphere";
        radius: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "capsule";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "mesh";
        meshId: string;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "cylinder";
        radius: number;
        halfHeight: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "convex-hull";
        points: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "trimesh";
        vertices: number[];
        indices: number[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "heightfield";
        scale: {
            x: number;
            y: number;
            z: number;
        };
        heights: number[];
        nrows: number;
        ncols: number;
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    } | {
        shape: "compound";
        children: ({
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "sphere";
            radius: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        } | {
            shape: "convex-hull";
            points: number[];
            localOffset: {
                x: number;
                y: number;
                z: number;
            };
            localRotation: {
                x: number;
                y: number;
                z: number;
                w: number;
            };
        })[];
        isSensor?: boolean | undefined;
        emitCollisionEvents?: boolean | undefined;
        contactForceEventThreshold?: number | undefined;
    };
    restitution?: number | undefined;
    friction?: number | undefined;
    linearDamping?: number | undefined;
    angularDamping?: number | undefined;
    lockedAxes?: {
        rotation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
        translation?: {
            x?: boolean | undefined;
            y?: boolean | undefined;
            z?: boolean | undefined;
        } | undefined;
    } | undefined;
}>;
export type PhysicsBody = z.infer<typeof PhysicsBodySchema>;
/** Fixed-weld joint. Locks all 6 DoF between two entities;
 *  Ultrahand-style assembly uses this. */
export declare const FixedJointSlotSchema: z.ZodObject<{
    kind: z.ZodLiteral<"fixed">;
    /** Stable id of the OTHER endpoint entity. */
    otherEntityId: z.ZodString;
    /** Stable numeric handle assigned by the joint system at
     *  creation time. Apps pass this to `destroyJoint`. */
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    localFrameA: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>>;
    localFrameB: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    kind: "fixed";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    localFrameA?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
    localFrameB?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
}, {
    kind: "fixed";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    localFrameA?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
    localFrameB?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
}>;
export type FixedJointSlot = z.infer<typeof FixedJointSlotSchema>;
/** Revolute (hinge) joint. One rotational DoF around `axis`. */
export declare const RevoluteJointSlotSchema: z.ZodObject<{
    kind: z.ZodLiteral<"revolute">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    axis: z.ZodObject<{
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
    /** Optional angular limits in radians. `[min, max]`; angles
     *  outside the range are constrained. */
    limits: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    motor: z.ZodOptional<z.ZodObject<{
        /** Target velocity at the joint (rad/s for revolute, m/s for
         *  prismatic). */
        targetVel: z.ZodNumber;
        /** Maximum force the motor can apply to reach `targetVel`.
         *  Higher = stiffer follow; lower = motor "slips" under load. */
        maxForce: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        targetVel: number;
        maxForce: number;
    }, {
        targetVel: number;
        maxForce: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    kind: "revolute";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}, {
    kind: "revolute";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}>;
export type RevoluteJointSlot = z.infer<typeof RevoluteJointSlotSchema>;
/** Prismatic (slider) joint. One translational DoF along
 *  `axis`. */
export declare const PrismaticJointSlotSchema: z.ZodObject<{
    kind: z.ZodLiteral<"prismatic">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    axis: z.ZodObject<{
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
    /** Optional translation limits along the axis. */
    limits: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    motor: z.ZodOptional<z.ZodObject<{
        /** Target velocity at the joint (rad/s for revolute, m/s for
         *  prismatic). */
        targetVel: z.ZodNumber;
        /** Maximum force the motor can apply to reach `targetVel`.
         *  Higher = stiffer follow; lower = motor "slips" under load. */
        maxForce: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        targetVel: number;
        maxForce: number;
    }, {
        targetVel: number;
        maxForce: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    kind: "prismatic";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}, {
    kind: "prismatic";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}>;
export type PrismaticJointSlot = z.infer<typeof PrismaticJointSlotSchema>;
/** Spherical (ball-socket) joint. 3 rotational DoF. */
export declare const SphericalJointSlotSchema: z.ZodObject<{
    kind: z.ZodLiteral<"spherical">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    kind: "spherical";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
}, {
    kind: "spherical";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
}>;
export type SphericalJointSlot = z.infer<typeof SphericalJointSlotSchema>;
/** Distance (rope / spring) joint. Constrains the bodies to a
 *  specific distance apart. `stiffness === 0` (default) is a
 *  rigid rope; positive values produce a damped spring. */
export declare const DistanceJointSlotSchema: z.ZodObject<{
    kind: z.ZodLiteral<"distance">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    /** Rest length in world units. */
    length: z.ZodNumber;
    /** Spring stiffness. 0 = rigid; positive values = spring. */
    stiffness: z.ZodOptional<z.ZodNumber>;
    damping: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    length: number;
    kind: "distance";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    stiffness?: number | undefined;
    damping?: number | undefined;
}, {
    length: number;
    kind: "distance";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    stiffness?: number | undefined;
    damping?: number | undefined;
}>;
export type DistanceJointSlot = z.infer<typeof DistanceJointSlotSchema>;
/** Discriminated union of every joint kind. Apps switch on
 *  `slot.kind` for typed narrowing. */
export declare const JointSlotSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"fixed">;
    /** Stable id of the OTHER endpoint entity. */
    otherEntityId: z.ZodString;
    /** Stable numeric handle assigned by the joint system at
     *  creation time. Apps pass this to `destroyJoint`. */
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    localFrameA: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>>;
    localFrameB: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    kind: "fixed";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    localFrameA?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
    localFrameB?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
}, {
    kind: "fixed";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    localFrameA?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
    localFrameB?: {
        x: number;
        y: number;
        z: number;
        w: number;
    } | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"revolute">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    axis: z.ZodObject<{
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
    /** Optional angular limits in radians. `[min, max]`; angles
     *  outside the range are constrained. */
    limits: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    motor: z.ZodOptional<z.ZodObject<{
        /** Target velocity at the joint (rad/s for revolute, m/s for
         *  prismatic). */
        targetVel: z.ZodNumber;
        /** Maximum force the motor can apply to reach `targetVel`.
         *  Higher = stiffer follow; lower = motor "slips" under load. */
        maxForce: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        targetVel: number;
        maxForce: number;
    }, {
        targetVel: number;
        maxForce: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    kind: "revolute";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}, {
    kind: "revolute";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"prismatic">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    axis: z.ZodObject<{
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
    /** Optional translation limits along the axis. */
    limits: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    motor: z.ZodOptional<z.ZodObject<{
        /** Target velocity at the joint (rad/s for revolute, m/s for
         *  prismatic). */
        targetVel: z.ZodNumber;
        /** Maximum force the motor can apply to reach `targetVel`.
         *  Higher = stiffer follow; lower = motor "slips" under load. */
        maxForce: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        targetVel: number;
        maxForce: number;
    }, {
        targetVel: number;
        maxForce: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    kind: "prismatic";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}, {
    kind: "prismatic";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    axis: {
        x: number;
        y: number;
        z: number;
    };
    limits?: [number, number] | undefined;
    motor?: {
        targetVel: number;
        maxForce: number;
    } | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"spherical">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    kind: "spherical";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
}, {
    kind: "spherical";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
}>, z.ZodObject<{
    kind: z.ZodLiteral<"distance">;
    otherEntityId: z.ZodString;
    handle: z.ZodNumber;
    localAnchorA: z.ZodObject<{
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
    localAnchorB: z.ZodObject<{
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
    /** Rest length in world units. */
    length: z.ZodNumber;
    /** Spring stiffness. 0 = rigid; positive values = spring. */
    stiffness: z.ZodOptional<z.ZodNumber>;
    damping: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    length: number;
    kind: "distance";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    stiffness?: number | undefined;
    damping?: number | undefined;
}, {
    length: number;
    kind: "distance";
    otherEntityId: string;
    handle: number;
    localAnchorA: {
        x: number;
        y: number;
        z: number;
    };
    localAnchorB: {
        x: number;
        y: number;
        z: number;
    };
    stiffness?: number | undefined;
    damping?: number | undefined;
}>]>;
export type JointSlot = z.infer<typeof JointSlotSchema>;
export declare const HealthSchema: z.ZodObject<{
    current: z.ZodNumber;
    max: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    current: number;
    max: number;
}, {
    current: number;
    max: number;
}>;
export type Health = z.infer<typeof HealthSchema>;
export declare const PersistSchema: z.ZodObject<{
    /** Optional human-readable label shown in debug overlays. Has no
     *  runtime effect — the SceneManager only checks for the slot's
     *  presence, not its contents. */
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
export type Persist = z.infer<typeof PersistSchema>;
export declare const SceneOwnerSchema: z.ZodObject<{
    /** ID of the scene that spawned this entity. Set by the
     *  SceneSpawner wrapper that SceneManager passes into setup(). */
    sceneId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sceneId: string;
}, {
    sceneId: string;
}>;
export type SceneOwner = z.infer<typeof SceneOwnerSchema>;
/** RGB color in 0..1 space, matching THREE.Color's normalized
 *  range. Kept separate from BlendMode-style enums because per-
 *  emitter color tinting is variable, not a fixed renderer mode. */
export declare const ColorRGBSchema: z.ZodObject<{
    r: z.ZodNumber;
    g: z.ZodNumber;
    b: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    r: number;
    g: number;
    b: number;
}, {
    r: number;
    g: number;
    b: number;
}>;
export type ColorRGB = z.infer<typeof ColorRGBSchema>;
export declare const NavAgentSchema: z.ZodObject<{
    /** Movement speed in world units / second along the path. */
    speed: z.ZodNumber;
    /** Distance threshold (world units) for "arrived at the next
     *  waypoint" — when within this radius of `path[pathIndex]`,
     *  the agent advances to the next point. Default 0.5. */
    arrivalRadius: z.ZodOptional<z.ZodNumber>;
    /** Current target world position. Setting this triggers a
     *  path replan on the next tick. Set null to halt the agent
     *  (NavSystem clears the path and zeroes velocity). */
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
    }>>>;
}, "strip", z.ZodTypeAny, {
    speed: number;
    arrivalRadius?: number | undefined;
    target?: {
        x: number;
        y: number;
        z: number;
    } | null | undefined;
}, {
    speed: number;
    arrivalRadius?: number | undefined;
    target?: {
        x: number;
        y: number;
        z: number;
    } | null | undefined;
}>;
export type NavAgent = z.infer<typeof NavAgentSchema>;
export declare const CrowdAgentSchema: z.ZodObject<{
    /** Identifier of the dtCrowd instance this agent belongs to.
     *  Apps running multiple crowds (red team / blue team /
     *  civilians) tag each agent with the id of its owning crowd;
     *  the per-`crowdId` CrowdSystem filters its query by this
     *  field. Single-crowd setups (the common case) leave it at
     *  the default and don't need to think about it. */
    crowdId: z.ZodDefault<z.ZodString>;
    /** Maximum movement speed in world units / second. */
    maxSpeed: z.ZodNumber;
    /** Agent collision radius. dtCrowd uses this for steering;
     *  should match the entity's physical radius if a kinematic
     *  body is present. */
    radius: z.ZodNumber;
    /** Vertical clearance the agent needs (head height). */
    height: z.ZodNumber;
    /** Maximum acceleration in world units / second^2. Higher =
     *  agent reaches max speed faster. Default 20. */
    maxAcceleration: z.ZodOptional<z.ZodNumber>;
    /** Distance (world units) for "arrived at target" — fires
     *  `'crowd:agent-arrived'` and stops re-firing until target
     *  changes. Default 0.5. */
    arrivalRadius: z.ZodOptional<z.ZodNumber>;
    /** dtCrowd separation weight (0..20 typical). Higher values
     *  push neighboring agents apart more aggressively. Default 0
     *  (rely on radius alone). */
    separationWeight: z.ZodOptional<z.ZodNumber>;
    /** dtCrowd obstacle-avoidance preset index (0..4). 0 = no
     *  avoidance; higher values sample more candidate velocities.
     *  Default 0. */
    obstacleAvoidanceType: z.ZodOptional<z.ZodNumber>;
    /** Current target world position. Setting this (a NEW object
     *  reference) triggers a move request next tick. Set null to
     *  halt. */
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
    }>>>;
}, "strip", z.ZodTypeAny, {
    radius: number;
    crowdId: string;
    maxSpeed: number;
    height: number;
    arrivalRadius?: number | undefined;
    target?: {
        x: number;
        y: number;
        z: number;
    } | null | undefined;
    maxAcceleration?: number | undefined;
    separationWeight?: number | undefined;
    obstacleAvoidanceType?: number | undefined;
}, {
    radius: number;
    maxSpeed: number;
    height: number;
    arrivalRadius?: number | undefined;
    target?: {
        x: number;
        y: number;
        z: number;
    } | null | undefined;
    crowdId?: string | undefined;
    maxAcceleration?: number | undefined;
    separationWeight?: number | undefined;
    obstacleAvoidanceType?: number | undefined;
}>;
export type CrowdAgent = z.infer<typeof CrowdAgentSchema>;
export declare const BehaviorTreeSchema: z.ZodObject<{
    /** Lookup key in `@unsupervised/ai-bt`'s tree registry. Must match an
     *  id passed to `registerTree(id, root)` before the first tick
     *  that reads this slot. */
    rootId: z.ZodString;
    /** Per-entity scratch space. Free-form game state plus
     *  library-internal running-node tracking under keys prefixed
     *  with `__bt`. JSON-shaped so the save layer can round-trip it. */
    blackboard: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    rootId: string;
    blackboard: Record<string, unknown>;
}, {
    rootId: string;
    blackboard: Record<string, unknown>;
}>;
export type BehaviorTreeState = z.infer<typeof BehaviorTreeSchema>;
export declare const ResourcePoolSchema: z.ZodObject<{
    /** Current amount, 0..max. Decremented by `tryActivate` on
     *  successful activation; tickled up by `abilitySystem` if
     *  `regen` is set. */
    current: z.ZodNumber;
    /** Maximum. Regen clamps at this value. */
    max: z.ZodNumber;
    /** Optional units-per-second regen rate. Omit for non-
     *  regenerating pools. */
    regen: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    current: number;
    max: number;
    regen?: number | undefined;
}, {
    current: number;
    max: number;
    regen?: number | undefined;
}>;
export type ResourcePool = z.infer<typeof ResourcePoolSchema>;
export declare const ResourcesSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    /** Current amount, 0..max. Decremented by `tryActivate` on
     *  successful activation; tickled up by `abilitySystem` if
     *  `regen` is set. */
    current: z.ZodNumber;
    /** Maximum. Regen clamps at this value. */
    max: z.ZodNumber;
    /** Optional units-per-second regen rate. Omit for non-
     *  regenerating pools. */
    regen: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    current: number;
    max: number;
    regen?: number | undefined;
}, {
    current: number;
    max: number;
    regen?: number | undefined;
}>>;
export type Resources = z.infer<typeof ResourcesSchema>;
export declare const AbilitiesSchema: z.ZodObject<{
    /** Ability ids the entity has available. Must each be
     *  registered with `registerAbility(...)` before
     *  `abilitySystem` ticks. Adding an ability mid-game (skill
     *  unlock, equipped weapon granting an ability) is a normal
     *  app-level mutation: assign a new array. */
    active: z.ZodArray<z.ZodString, "many">;
    /** Per-id cooldown timer, seconds. Absent or 0 means ready.
     *  `tryActivate` writes the ability's full cooldown here on
     *  success; `abilitySystem` decrements by `delta` each frame
     *  and clamps at 0. */
    cooldowns: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    active: string[];
    cooldowns: Record<string, number>;
}, {
    active: string[];
    cooldowns: Record<string, number>;
}>;
export type Abilities = z.infer<typeof AbilitiesSchema>;
export declare const InventorySchema: z.ZodObject<{
    /** Fixed-size slot array. Index = grid position. `null` = empty
     *  slot. The array length is authoritative; `capacity` is the
     *  intended ceiling for UI rendering and validation. */
    slots: z.ZodArray<z.ZodNullable<z.ZodObject<{
        defId: z.ZodString;
        count: z.ZodNumber;
        customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    }, {
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    }>>, "many">;
    /** Maximum number of slots. UI / authoring should respect this
     *  even if `slots.length` differs (e.g., during a temporary
     *  transient where slots have been pre-sized). */
    capacity: z.ZodNumber;
    /** Equipped items keyed by app-defined equip-slot name (e.g.
     *  'weapon', 'armor', 'trinket'). Map only contains keys for
     *  currently-equipped slots; absence == empty. Equip slot names
     *  are stringly-typed at this layer; consuming games typically
     *  declare their own typed wrapper. */
    equipped: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodObject<{
        defId: z.ZodString;
        count: z.ZodNumber;
        customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    }, {
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    }>>>>;
}, "strip", z.ZodTypeAny, {
    slots: ({
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    } | null)[];
    capacity: number;
    equipped?: Record<string, {
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    } | null> | undefined;
}, {
    slots: ({
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    } | null)[];
    capacity: number;
    equipped?: Record<string, {
        defId: string;
        count: number;
        customData?: Record<string, unknown> | undefined;
    } | null> | undefined;
}>;
export type Inventory = z.infer<typeof InventorySchema>;
export declare const AnimationStateSchema: z.ZodObject<{
    /** Primary animation clip name (must exist in the model's
     *  `.animations` array — resolved at runtime via
     *  `ModelBank.getClip(modelId, clipId)`). */
    clipId: z.ZodString;
    /** Optional second clip for crossfading. When present, both
     *  clips play simultaneously with weights summed via
     *  `blendWeight`. */
    blendToClipId: z.ZodOptional<z.ZodString>;
    /** Crossfade ratio. 0 = pure `clipId`, 1 = pure `blendToClipId`.
     *  Only meaningful when `blendToClipId` is set. */
    blendWeight: z.ZodOptional<z.ZodNumber>;
    /** Playback rate multiplier on the clip's authored duration.
     *  1.0 = real time. Defaults to 1.0 when omitted. */
    speed: z.ZodDefault<z.ZodNumber>;
    /** Whether the clip wraps at end (`true`, default) or clamps
     *  to the final frame (`false`). */
    loop: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    speed: number;
    clipId: string;
    loop: boolean;
    blendToClipId?: string | undefined;
    blendWeight?: number | undefined;
}, {
    clipId: string;
    speed?: number | undefined;
    blendToClipId?: string | undefined;
    blendWeight?: number | undefined;
    loop?: boolean | undefined;
}>;
export type AnimationState = z.infer<typeof AnimationStateSchema>;
export declare const EmitterSchema: z.ZodObject<{
    /** Particles spawned per second. Fractional values are honored
     *  via VFXSystem's accumulator — `particleCountPerSecond: 0.5`
     *  emits one particle every two seconds, on average. */
    particleCountPerSecond: z.ZodNumber;
    /** Half-angle of the velocity cone, in radians. 0 = perfectly
     *  collimated jet along the emitter's local +Y axis; π/2 = full
     *  hemisphere; π = full sphere (omnidirectional explosion). */
    velocityCone: z.ZodNumber;
    /** Initial speed of each particle along its randomly-chosen
     *  cone direction, in world units per second. */
    speed: z.ZodNumber;
    /** Particle lifetime in seconds. Each particle is born with this
     *  remaining lifetime; the GPU simulation kills it when the
     *  countdown hits zero. */
    lifespan: z.ZodNumber;
    /** Per-particle base color. The GPU writes this into the
     *  InstancedMesh's per-instance color attribute at spawn. */
    color: z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        r: number;
        g: number;
        b: number;
    }, {
        r: number;
        g: number;
        b: number;
    }>;
    /** Whether the emitter is currently producing particles. Set
     *  `false` to keep the entity around (its existing particles
     *  will continue to simulate until their lifespans expire) but
     *  stop new emission. */
    enabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    speed: number;
    particleCountPerSecond: number;
    velocityCone: number;
    lifespan: number;
    color: {
        r: number;
        g: number;
        b: number;
    };
    enabled: boolean;
}, {
    speed: number;
    particleCountPerSecond: number;
    velocityCone: number;
    lifespan: number;
    color: {
        r: number;
        g: number;
        b: number;
    };
    enabled: boolean;
}>;
export type Emitter = z.infer<typeof EmitterSchema>;
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
export declare const AudioBusSchema: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
export type AudioBus = z.infer<typeof AudioBusSchema>;
/** Optional 3D-positional knob set. Omit to play the sound as flat
 *  stereo through the bus's gain — appropriate for music, UI clicks,
 *  and 2D HUD feedback. Include to spawn a `PannerNode` whose
 *  position the audio system tracks against the entity's Transform. */
export declare const AudioSpatial3DSchema: z.ZodObject<{
    /** Distance at which the source is fully attenuated. Beyond this,
     *  Rapier's `inverse` distance model still emits faint signal; use
     *  it as a "cull at" hint, not a hard cutoff. */
    maxDistance: z.ZodNumber;
    /** Rolloff factor. Higher → louder up close, faster fade. The 1.0
     *  default for `inverse` works for most outdoor scenes. */
    rolloff: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    maxDistance: number;
    rolloff: number;
}, {
    maxDistance: number;
    rolloff: number;
}>;
export type AudioSpatial3D = z.infer<typeof AudioSpatial3DSchema>;
export declare const AudioSourceSchema: z.ZodObject<{
    /** Asset-registry key — looked up against `AudioBank.get(soundId)`
     *  by the audio system. Must be unique across the audio registry. */
    soundId: z.ZodString;
    bus: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
    /** Per-source volume, 0..1, applied through a local `GainNode`
     *  before the sound reaches its bus. Adjust this for relative
     *  loudness between sources sharing a bus. */
    volume: z.ZodNumber;
    /** Whether the underlying `AudioBufferSourceNode` should loop. */
    loop: z.ZodBoolean;
    spatial3D: z.ZodOptional<z.ZodObject<{
        /** Distance at which the source is fully attenuated. Beyond this,
         *  Rapier's `inverse` distance model still emits faint signal; use
         *  it as a "cull at" hint, not a hard cutoff. */
        maxDistance: z.ZodNumber;
        /** Rolloff factor. Higher → louder up close, faster fade. The 1.0
         *  default for `inverse` works for most outdoor scenes. */
        rolloff: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        maxDistance: number;
        rolloff: number;
    }, {
        maxDistance: number;
        rolloff: number;
    }>>;
    /** State + intent flag. Gameplay code sets `true` to start; the
     *  audio system sets `false` when the source's `onended` fires. */
    playing: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    loop: boolean;
    soundId: string;
    bus: "music" | "sfx" | "environment" | "ui";
    volume: number;
    playing: boolean;
    spatial3D?: {
        maxDistance: number;
        rolloff: number;
    } | undefined;
}, {
    loop: boolean;
    soundId: string;
    bus: "music" | "sfx" | "environment" | "ui";
    volume: number;
    playing: boolean;
    spatial3D?: {
        maxDistance: number;
        rolloff: number;
    } | undefined;
}>;
export type AudioSource = z.infer<typeof AudioSourceSchema>;
/** A weighted reference to an archetype id that the system will pass
 *  to its registered factory at spawn time. Same shape as
 *  `LootEntry<string>` from `@unsupervised/features/loot` — the spawn system
 *  treats the pool as a loot table internally. `condition` lets a
 *  pool gate entries on app-side context (player level, quest flag,
 *  difficulty). */
export declare const SpawnPoolEntrySchema: z.ZodObject<{
    /** Archetype lookup id — must have been passed to
     *  `registerSpawnArchetype(id, factory)` before the system ticks
     *  this spawner. */
    archetypeId: z.ZodString;
    /** Selection weight. Zero or negative weights are treated as 0
     *  (entry effectively absent for this roll) — same fail-quiet
     *  policy as the loot package. */
    weight: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    weight: number;
    archetypeId: string;
}, {
    weight: number;
    archetypeId: string;
}>;
export type SpawnPoolEntry = z.infer<typeof SpawnPoolEntrySchema>;
/** Spatial primitive for spawn position selection. Each variant
 *  carries the parameters it needs; the system samples a position
 *  inside the shape (jittered for non-point shapes) and uses it as
 *  the spawned entity's transform.position.
 *
 *  Why a discriminated union (vs. a single "shape with optional
 *  radius / dimensions" object): each shape's params are different,
 *  and games tend to pick a shape statically per-spawner. Naming the
 *  shape in the discriminant makes spawn-site code skimmable. */
export declare const SpawnShapeSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"point">;
}, "strip", z.ZodTypeAny, {
    kind: "point";
}, {
    kind: "point";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"circle">;
    radius: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: "circle";
    radius: number;
}, {
    kind: "circle";
    radius: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"line">;
    from: z.ZodObject<{
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
    to: z.ZodObject<{
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
    kind: "line";
    from: {
        x: number;
        y: number;
        z: number;
    };
    to: {
        x: number;
        y: number;
        z: number;
    };
}, {
    kind: "line";
    from: {
        x: number;
        y: number;
        z: number;
    };
    to: {
        x: number;
        y: number;
        z: number;
    };
}>, z.ZodObject<{
    kind: z.ZodLiteral<"box">;
    halfExtents: z.ZodObject<{
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
    kind: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
}, {
    kind: "box";
    halfExtents: {
        x: number;
        y: number;
        z: number;
    };
}>]>;
export type SpawnShape = z.infer<typeof SpawnShapeSchema>;
/** Trigger that decides when a wave starts. `previous-cleared` waits
 *  for the prior wave's spawned entities to all despawn; `delay`
 *  waits a fixed number of seconds after the prior wave's last spawn
 *  (or, for wave 0, after the spawner enables). */
export declare const WaveStartTriggerSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"previous-cleared">;
}, "strip", z.ZodTypeAny, {
    kind: "previous-cleared";
}, {
    kind: "previous-cleared";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"delay">;
    seconds: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: "delay";
    seconds: number;
}, {
    kind: "delay";
    seconds: number;
}>]>;
export type WaveStartTrigger = z.infer<typeof WaveStartTriggerSchema>;
/** A single wave inside a wave-mode spawner's sequence. Each wave
 *  has its own count + intra-wave spacing + start trigger; an
 *  optional pool override lets later waves spawn rarer archetypes
 *  without rewriting the parent pool. */
export declare const WaveSchema: z.ZodObject<{
    /** Number of entities to spawn during this wave. 0 is allowed
     *  (skipped immediately to next-wave transition); negative is
     *  treated as 0. */
    count: z.ZodNumber;
    /** Seconds between consecutive spawns within this wave. 0 spawns
     *  the whole count on the wave-start frame. */
    intervalSeconds: z.ZodNumber;
    /** Optional pool override for this wave. When omitted, the wave
     *  inherits the spawner's parent pool. When provided, completely
     *  replaces it for this wave (no merge — append-merge semantics
     *  would be surprising). */
    pool: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Archetype lookup id — must have been passed to
         *  `registerSpawnArchetype(id, factory)` before the system ticks
         *  this spawner. */
        archetypeId: z.ZodString;
        /** Selection weight. Zero or negative weights are treated as 0
         *  (entry effectively absent for this roll) — same fail-quiet
         *  policy as the loot package. */
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        weight: number;
        archetypeId: string;
    }, {
        weight: number;
        archetypeId: string;
    }>, "many">>;
    /** When this wave should start. `previous-cleared` is the
     *  default-feeling choice for arena waves; `delay` is for
     *  scripted, time-based escalation. */
    startTrigger: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"previous-cleared">;
    }, "strip", z.ZodTypeAny, {
        kind: "previous-cleared";
    }, {
        kind: "previous-cleared";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"delay">;
        seconds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "delay";
        seconds: number;
    }, {
        kind: "delay";
        seconds: number;
    }>]>;
}, "strip", z.ZodTypeAny, {
    count: number;
    intervalSeconds: number;
    startTrigger: {
        kind: "previous-cleared";
    } | {
        kind: "delay";
        seconds: number;
    };
    pool?: {
        weight: number;
        archetypeId: string;
    }[] | undefined;
}, {
    count: number;
    intervalSeconds: number;
    startTrigger: {
        kind: "previous-cleared";
    } | {
        kind: "delay";
        seconds: number;
    };
    pool?: {
        weight: number;
        archetypeId: string;
    }[] | undefined;
}>;
export type Wave = z.infer<typeof WaveSchema>;
/** Wave-mode runtime state. The system advances through these
 *  states linearly per wave: idle → spawning → awaiting-clear →
 *  between-waves → idle (next wave) → … → complete. */
export declare const WaveStateSchema: z.ZodEnum<["idle", "spawning", "awaiting-clear", "between-waves", "complete"]>;
export type WaveState = z.infer<typeof WaveStateSchema>;
/** Discriminated union over the three spawn modes. Each variant
 *  carries its own non-timing intent fields (intervalSeconds, waves)
 *  AND its own timing-bookkeeping fields (timeUntilNext,
 *  currentWaveIndex, waveState, waveTimeAccumulator). Keeping intent
 *  + bookkeeping in the same variant means save/load round-trips the
 *  full mode state with no extra side-tables. */
export declare const SpawnerModeSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"interval">;
    intervalSeconds: z.ZodNumber;
    timeUntilNext: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: "interval";
    intervalSeconds: number;
    timeUntilNext: number;
}, {
    kind: "interval";
    intervalSeconds: number;
    timeUntilNext: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"wave">;
    waves: z.ZodArray<z.ZodObject<{
        /** Number of entities to spawn during this wave. 0 is allowed
         *  (skipped immediately to next-wave transition); negative is
         *  treated as 0. */
        count: z.ZodNumber;
        /** Seconds between consecutive spawns within this wave. 0 spawns
         *  the whole count on the wave-start frame. */
        intervalSeconds: z.ZodNumber;
        /** Optional pool override for this wave. When omitted, the wave
         *  inherits the spawner's parent pool. When provided, completely
         *  replaces it for this wave (no merge — append-merge semantics
         *  would be surprising). */
        pool: z.ZodOptional<z.ZodArray<z.ZodObject<{
            /** Archetype lookup id — must have been passed to
             *  `registerSpawnArchetype(id, factory)` before the system ticks
             *  this spawner. */
            archetypeId: z.ZodString;
            /** Selection weight. Zero or negative weights are treated as 0
             *  (entry effectively absent for this roll) — same fail-quiet
             *  policy as the loot package. */
            weight: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            weight: number;
            archetypeId: string;
        }, {
            weight: number;
            archetypeId: string;
        }>, "many">>;
        /** When this wave should start. `previous-cleared` is the
         *  default-feeling choice for arena waves; `delay` is for
         *  scripted, time-based escalation. */
        startTrigger: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"previous-cleared">;
        }, "strip", z.ZodTypeAny, {
            kind: "previous-cleared";
        }, {
            kind: "previous-cleared";
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"delay">;
            seconds: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: "delay";
            seconds: number;
        }, {
            kind: "delay";
            seconds: number;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        count: number;
        intervalSeconds: number;
        startTrigger: {
            kind: "previous-cleared";
        } | {
            kind: "delay";
            seconds: number;
        };
        pool?: {
            weight: number;
            archetypeId: string;
        }[] | undefined;
    }, {
        count: number;
        intervalSeconds: number;
        startTrigger: {
            kind: "previous-cleared";
        } | {
            kind: "delay";
            seconds: number;
        };
        pool?: {
            weight: number;
            archetypeId: string;
        }[] | undefined;
    }>, "many">;
    /** Wave currently in flight or just-finished. Bumped on each
     *  between-waves → idle transition. Equals `waves.length` when
     *  the spawner has run all waves; pairs with
     *  `waveState === 'complete'`. */
    currentWaveIndex: z.ZodNumber;
    waveState: z.ZodEnum<["idle", "spawning", "awaiting-clear", "between-waves", "complete"]>;
    /** Accumulator for the current wave-state's timing. In
     *  `spawning`: time since last intra-wave spawn. In
     *  `between-waves`: time since wave cleared. In `idle` with a
     *  delay trigger: time since previous wave finished or spawner
     *  enabled. */
    waveTimeAccumulator: z.ZodNumber;
    /** Count of spawns fired so far during the current wave. Resets
     *  to 0 on each idle → spawning transition. Compared against
     *  the wave's `count` to know when to transition out of
     *  `spawning`. */
    spawnedThisWave: z.ZodNumber;
    /** Seconds to hold in `between-waves` before advancing wave
     *  index. 0 is fine — moves immediately to next wave's idle. */
    betweenWaveDelay: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: "wave";
    waves: {
        count: number;
        intervalSeconds: number;
        startTrigger: {
            kind: "previous-cleared";
        } | {
            kind: "delay";
            seconds: number;
        };
        pool?: {
            weight: number;
            archetypeId: string;
        }[] | undefined;
    }[];
    currentWaveIndex: number;
    waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
    waveTimeAccumulator: number;
    spawnedThisWave: number;
    betweenWaveDelay: number;
}, {
    kind: "wave";
    waves: {
        count: number;
        intervalSeconds: number;
        startTrigger: {
            kind: "previous-cleared";
        } | {
            kind: "delay";
            seconds: number;
        };
        pool?: {
            weight: number;
            archetypeId: string;
        }[] | undefined;
    }[];
    currentWaveIndex: number;
    waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
    waveTimeAccumulator: number;
    spawnedThisWave: number;
    betweenWaveDelay: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"manual">;
}, "strip", z.ZodTypeAny, {
    kind: "manual";
}, {
    kind: "manual";
}>]>;
export type SpawnerMode = z.infer<typeof SpawnerModeSchema>;
export declare const SpawnerSchema: z.ZodObject<{
    /** Stable identifier. Must be unique across all spawners in the
     *  world; `getSpawnerStatus(world, id)` and
     *  `forceSpawn(world, id)` look up by this key, and the
     *  callback registry pairs callbacks with this id. */
    id: z.ZodString;
    /** When false, the system skips this spawner entirely (no tick
     *  advance, no spawns). Toggle to pause/resume. */
    enabled: z.ZodBoolean;
    /** Default pool used when a wave doesn't override it (and the
     *  only pool in interval/manual modes). Empty pool is allowed —
     *  the spawner simply produces no entities, with a
     *  `getSpawnerStatus` field that surfaces the empty-pool state
     *  for debugging. */
    pool: z.ZodArray<z.ZodObject<{
        /** Archetype lookup id — must have been passed to
         *  `registerSpawnArchetype(id, factory)` before the system ticks
         *  this spawner. */
        archetypeId: z.ZodString;
        /** Selection weight. Zero or negative weights are treated as 0
         *  (entry effectively absent for this roll) — same fail-quiet
         *  policy as the loot package. */
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        weight: number;
        archetypeId: string;
    }, {
        weight: number;
        archetypeId: string;
    }>, "many">;
    mode: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"interval">;
        intervalSeconds: z.ZodNumber;
        timeUntilNext: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "interval";
        intervalSeconds: number;
        timeUntilNext: number;
    }, {
        kind: "interval";
        intervalSeconds: number;
        timeUntilNext: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"wave">;
        waves: z.ZodArray<z.ZodObject<{
            /** Number of entities to spawn during this wave. 0 is allowed
             *  (skipped immediately to next-wave transition); negative is
             *  treated as 0. */
            count: z.ZodNumber;
            /** Seconds between consecutive spawns within this wave. 0 spawns
             *  the whole count on the wave-start frame. */
            intervalSeconds: z.ZodNumber;
            /** Optional pool override for this wave. When omitted, the wave
             *  inherits the spawner's parent pool. When provided, completely
             *  replaces it for this wave (no merge — append-merge semantics
             *  would be surprising). */
            pool: z.ZodOptional<z.ZodArray<z.ZodObject<{
                /** Archetype lookup id — must have been passed to
                 *  `registerSpawnArchetype(id, factory)` before the system ticks
                 *  this spawner. */
                archetypeId: z.ZodString;
                /** Selection weight. Zero or negative weights are treated as 0
                 *  (entry effectively absent for this roll) — same fail-quiet
                 *  policy as the loot package. */
                weight: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                weight: number;
                archetypeId: string;
            }, {
                weight: number;
                archetypeId: string;
            }>, "many">>;
            /** When this wave should start. `previous-cleared` is the
             *  default-feeling choice for arena waves; `delay` is for
             *  scripted, time-based escalation. */
            startTrigger: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
                kind: z.ZodLiteral<"previous-cleared">;
            }, "strip", z.ZodTypeAny, {
                kind: "previous-cleared";
            }, {
                kind: "previous-cleared";
            }>, z.ZodObject<{
                kind: z.ZodLiteral<"delay">;
                seconds: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                kind: "delay";
                seconds: number;
            }, {
                kind: "delay";
                seconds: number;
            }>]>;
        }, "strip", z.ZodTypeAny, {
            count: number;
            intervalSeconds: number;
            startTrigger: {
                kind: "previous-cleared";
            } | {
                kind: "delay";
                seconds: number;
            };
            pool?: {
                weight: number;
                archetypeId: string;
            }[] | undefined;
        }, {
            count: number;
            intervalSeconds: number;
            startTrigger: {
                kind: "previous-cleared";
            } | {
                kind: "delay";
                seconds: number;
            };
            pool?: {
                weight: number;
                archetypeId: string;
            }[] | undefined;
        }>, "many">;
        /** Wave currently in flight or just-finished. Bumped on each
         *  between-waves → idle transition. Equals `waves.length` when
         *  the spawner has run all waves; pairs with
         *  `waveState === 'complete'`. */
        currentWaveIndex: z.ZodNumber;
        waveState: z.ZodEnum<["idle", "spawning", "awaiting-clear", "between-waves", "complete"]>;
        /** Accumulator for the current wave-state's timing. In
         *  `spawning`: time since last intra-wave spawn. In
         *  `between-waves`: time since wave cleared. In `idle` with a
         *  delay trigger: time since previous wave finished or spawner
         *  enabled. */
        waveTimeAccumulator: z.ZodNumber;
        /** Count of spawns fired so far during the current wave. Resets
         *  to 0 on each idle → spawning transition. Compared against
         *  the wave's `count` to know when to transition out of
         *  `spawning`. */
        spawnedThisWave: z.ZodNumber;
        /** Seconds to hold in `between-waves` before advancing wave
         *  index. 0 is fine — moves immediately to next wave's idle. */
        betweenWaveDelay: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "wave";
        waves: {
            count: number;
            intervalSeconds: number;
            startTrigger: {
                kind: "previous-cleared";
            } | {
                kind: "delay";
                seconds: number;
            };
            pool?: {
                weight: number;
                archetypeId: string;
            }[] | undefined;
        }[];
        currentWaveIndex: number;
        waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
        waveTimeAccumulator: number;
        spawnedThisWave: number;
        betweenWaveDelay: number;
    }, {
        kind: "wave";
        waves: {
            count: number;
            intervalSeconds: number;
            startTrigger: {
                kind: "previous-cleared";
            } | {
                kind: "delay";
                seconds: number;
            };
            pool?: {
                weight: number;
                archetypeId: string;
            }[] | undefined;
        }[];
        currentWaveIndex: number;
        waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
        waveTimeAccumulator: number;
        spawnedThisWave: number;
        betweenWaveDelay: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"manual">;
    }, "strip", z.ZodTypeAny, {
        kind: "manual";
    }, {
        kind: "manual";
    }>]>;
    shape: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"point">;
    }, "strip", z.ZodTypeAny, {
        kind: "point";
    }, {
        kind: "point";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"circle">;
        radius: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "circle";
        radius: number;
    }, {
        kind: "circle";
        radius: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"line">;
        from: z.ZodObject<{
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
        to: z.ZodObject<{
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
        kind: "line";
        from: {
            x: number;
            y: number;
            z: number;
        };
        to: {
            x: number;
            y: number;
            z: number;
        };
    }, {
        kind: "line";
        from: {
            x: number;
            y: number;
            z: number;
        };
        to: {
            x: number;
            y: number;
            z: number;
        };
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"box">;
        halfExtents: z.ZodObject<{
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
        kind: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
    }, {
        kind: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
    }>]>;
    /** World-space spawn-shape origin (meters). Ignored for `line`
     *  shape (the line carries its own world coords). */
    origin: z.ZodObject<{
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
    /** Concurrent ceiling — system queries `world.with('spawnedBy')`
     *  each frame, groups by spawnerId, blocks new spawns when the
     *  count would exceed this. Undefined means no ceiling. */
    maxActive: z.ZodOptional<z.ZodNumber>;
    /** Lifetime ceiling — once `totalSpawned >= maxTotal`, no more
     *  spawns regardless of mode. Undefined means no ceiling. */
    maxTotal: z.ZodOptional<z.ZodNumber>;
    /** Total entities this spawner has produced across its lifetime.
     *  Mutated in place by the system; round-trips through save/load. */
    totalSpawned: z.ZodNumber;
    /** Optional 32-bit integer seed. When set, the system builds a
     *  `mulberry32(seed)` ONCE on first observation and reuses it
     *  for every pool roll + position jitter from this spawner.
     *  Replay-stable. When unset, every roll uses `Math.random`. */
    rngSeed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shape: {
        kind: "point";
    } | {
        kind: "circle";
        radius: number;
    } | {
        kind: "line";
        from: {
            x: number;
            y: number;
            z: number;
        };
        to: {
            x: number;
            y: number;
            z: number;
        };
    } | {
        kind: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
    };
    id: string;
    enabled: boolean;
    pool: {
        weight: number;
        archetypeId: string;
    }[];
    mode: {
        kind: "interval";
        intervalSeconds: number;
        timeUntilNext: number;
    } | {
        kind: "wave";
        waves: {
            count: number;
            intervalSeconds: number;
            startTrigger: {
                kind: "previous-cleared";
            } | {
                kind: "delay";
                seconds: number;
            };
            pool?: {
                weight: number;
                archetypeId: string;
            }[] | undefined;
        }[];
        currentWaveIndex: number;
        waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
        waveTimeAccumulator: number;
        spawnedThisWave: number;
        betweenWaveDelay: number;
    } | {
        kind: "manual";
    };
    origin: {
        x: number;
        y: number;
        z: number;
    };
    totalSpawned: number;
    maxActive?: number | undefined;
    maxTotal?: number | undefined;
    rngSeed?: number | undefined;
}, {
    shape: {
        kind: "point";
    } | {
        kind: "circle";
        radius: number;
    } | {
        kind: "line";
        from: {
            x: number;
            y: number;
            z: number;
        };
        to: {
            x: number;
            y: number;
            z: number;
        };
    } | {
        kind: "box";
        halfExtents: {
            x: number;
            y: number;
            z: number;
        };
    };
    id: string;
    enabled: boolean;
    pool: {
        weight: number;
        archetypeId: string;
    }[];
    mode: {
        kind: "interval";
        intervalSeconds: number;
        timeUntilNext: number;
    } | {
        kind: "wave";
        waves: {
            count: number;
            intervalSeconds: number;
            startTrigger: {
                kind: "previous-cleared";
            } | {
                kind: "delay";
                seconds: number;
            };
            pool?: {
                weight: number;
                archetypeId: string;
            }[] | undefined;
        }[];
        currentWaveIndex: number;
        waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
        waveTimeAccumulator: number;
        spawnedThisWave: number;
        betweenWaveDelay: number;
    } | {
        kind: "manual";
    };
    origin: {
        x: number;
        y: number;
        z: number;
    };
    totalSpawned: number;
    maxActive?: number | undefined;
    maxTotal?: number | undefined;
    rngSeed?: number | undefined;
}>;
export type Spawner = z.infer<typeof SpawnerSchema>;
/** How a modifier combines with the base value during
 *  `resolveStat`. Three operators by design — `add`, `multiply`,
 *  `override` — because every other shape (clamp, min, max)
 *  composes from those three. Resists scope creep. */
export declare const ModifierOpSchema: z.ZodEnum<["add", "multiply", "override"]>;
export type ModifierOp = z.infer<typeof ModifierOpSchema>;
export declare const ModifierSchema: z.ZodObject<{
    /** Stable identifier; upsert key for `addModifier`. Apps
     *  conventionally build it as `'<source>:<stat>'` so re-apply
     *  collides with the existing entry instead of stacking. */
    id: z.ZodString;
    /** App-defined stat name. The framework treats this as opaque;
     *  apps narrow with their own union (e.g.
     *  `'nav-speed' | 'damage-out' | 'damage-in' |
     *  'cooldown-rate'`). The combat layer auto-reads two reserved
     *  stat names: `'damage-out'` (multiplies outgoing damage from
     *  the source) and `'damage-in'` (multiplies incoming damage
     *  on the target). Apps should not use those names for
     *  unrelated purposes. */
    stat: z.ZodString;
    op: z.ZodEnum<["add", "multiply", "override"]>;
    /** Operand. `add` is summed against the base (negatives
     *  subtract). `multiply` is an absolute multiplier — `1.5` is
     *  `+50%`, `0.5` is `-50%`, `0` zeroes the stat. `override`
     *  replaces the resolved value entirely. */
    value: z.ZodNumber;
    /** Attribution tag. Modifiers from one logical source share
     *  this; `removeModifiersBySource` drops them all in one
     *  call. */
    source: z.ZodOptional<z.ZodString>;
    /** Tiebreaker among `override` modifiers — highest wins.
     *  Ignored for `add` / `multiply` (they all sum / product). */
    priority: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number;
    id: string;
    stat: string;
    op: "add" | "multiply" | "override";
    source?: string | undefined;
    priority?: number | undefined;
}, {
    value: number;
    id: string;
    stat: string;
    op: "add" | "multiply" | "override";
    source?: string | undefined;
    priority?: number | undefined;
}>;
export type Modifier = z.infer<typeof ModifierSchema>;
/** The `modifiers` ECS slot — an array of modifier entries.
 *  Iteration order is preserved (insertion order); the
 *  resolution algorithm doesn't depend on order for `add` /
 *  `multiply` (sum / product are commutative) but `override`
 *  ties break by the higher `priority`, then by insertion
 *  order. */
export declare const ModifiersSchema: z.ZodArray<z.ZodObject<{
    /** Stable identifier; upsert key for `addModifier`. Apps
     *  conventionally build it as `'<source>:<stat>'` so re-apply
     *  collides with the existing entry instead of stacking. */
    id: z.ZodString;
    /** App-defined stat name. The framework treats this as opaque;
     *  apps narrow with their own union (e.g.
     *  `'nav-speed' | 'damage-out' | 'damage-in' |
     *  'cooldown-rate'`). The combat layer auto-reads two reserved
     *  stat names: `'damage-out'` (multiplies outgoing damage from
     *  the source) and `'damage-in'` (multiplies incoming damage
     *  on the target). Apps should not use those names for
     *  unrelated purposes. */
    stat: z.ZodString;
    op: z.ZodEnum<["add", "multiply", "override"]>;
    /** Operand. `add` is summed against the base (negatives
     *  subtract). `multiply` is an absolute multiplier — `1.5` is
     *  `+50%`, `0.5` is `-50%`, `0` zeroes the stat. `override`
     *  replaces the resolved value entirely. */
    value: z.ZodNumber;
    /** Attribution tag. Modifiers from one logical source share
     *  this; `removeModifiersBySource` drops them all in one
     *  call. */
    source: z.ZodOptional<z.ZodString>;
    /** Tiebreaker among `override` modifiers — highest wins.
     *  Ignored for `add` / `multiply` (they all sum / product). */
    priority: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number;
    id: string;
    stat: string;
    op: "add" | "multiply" | "override";
    source?: string | undefined;
    priority?: number | undefined;
}, {
    value: number;
    id: string;
    stat: string;
    op: "add" | "multiply" | "override";
    source?: string | undefined;
    priority?: number | undefined;
}>, "many">;
export type Modifiers = z.infer<typeof ModifiersSchema>;
export declare const CombatSchema: z.ZodObject<{
    /** Per-type damage multiplier. Keys are app-defined damage
     *  type strings; values in [-1, 1]. Resistance 1.0 ≡ entry in
     *  `immunities` (both block all damage of that type), but
     *  immunities are cheaper to check (the framework
     *  short-circuits before computing any math). */
    resistances: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    /** Flat damage reduction applied after percentage mitigation.
     *  Clamped at 0 — no negative damage (armor doesn't heal). */
    armor: z.ZodOptional<z.ZodNumber>;
    /** Damage types that bypass health entirely. Listed types take
     *  0 damage AND skip the `entity:damaged` event firing. */
    immunities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    resistances?: Record<string, number> | undefined;
    armor?: number | undefined;
    immunities?: string[] | undefined;
}, {
    resistances?: Record<string, number> | undefined;
    armor?: number | undefined;
    immunities?: string[] | undefined;
}>;
export type Combat = z.infer<typeof CombatSchema>;
export declare const StatusEffectsSchema: z.ZodArray<z.ZodObject<{
    defId: z.ZodString;
    remainingSeconds: z.ZodNumber;
    stackCount: z.ZodNumber;
    sourceEntityId: z.ZodOptional<z.ZodString>;
    appliedAt: z.ZodNumber;
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
}>, "many">;
export type StatusEffects = z.infer<typeof StatusEffectsSchema>;
export declare const CastingPhaseSchema: z.ZodEnum<["windup", "active", "recovery"]>;
export type CastingPhase = z.infer<typeof CastingPhaseSchema>;
export declare const CastingSchema: z.ZodObject<{
    /** Ability id this cast is firing. Looked up against the
     *  abilities registry to retrieve the effect callback at the
     *  active-phase boundary. */
    abilityId: z.ZodString;
    /** Current phase. */
    phase: z.ZodEnum<["windup", "active", "recovery"]>;
    /** Seconds remaining in the CURRENT phase. Decremented every
     *  frame by the casting system; on hitting 0, advances. */
    timeRemainingInPhase: z.ZodNumber;
    /** Snapshot of phase durations AFTER modifier application,
     *  taken at cast start. Persisted so save/load + mid-cast
     *  modifier changes behave correctly (see slot doctop). */
    phaseTimings: z.ZodObject<{
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
    }>;
    /** Optional animation-event-name gate. When set, the windup
     *  phase doesn't auto-advance at its timing boundary — the
     *  system waits for a matching `'animation:event'` emit. */
    activeOnEvent: z.ZodOptional<z.ZodString>;
    /** Whether this cast can be interrupted by `interruptCast`.
     *  Snapshotted from the def at cast start. */
    interruptible: z.ZodBoolean;
    /** Wall time in the windup phase. Used to detect the
     *  fallback timeout when `activeOnEvent` is set but the
     *  event never fires (after `windup × 2` seconds, system
     *  auto-advances + logs a warn). */
    windupElapsed: z.ZodNumber;
    /** Optional snapshot of the cast's target — the entity the
     *  effect should fire against, regardless of mid-cast
     *  retargeting. Stored as id (entity ref) or position. */
    targetEntityId: z.ZodOptional<z.ZodString>;
    targetPosition: z.ZodOptional<z.ZodObject<{
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
    }>>;
}, "strip", z.ZodTypeAny, {
    abilityId: string;
    phase: "active" | "windup" | "recovery";
    timeRemainingInPhase: number;
    phaseTimings: {
        active: number;
        windup: number;
        recovery: number;
    };
    interruptible: boolean;
    windupElapsed: number;
    activeOnEvent?: string | undefined;
    targetEntityId?: string | undefined;
    targetPosition?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
}, {
    abilityId: string;
    phase: "active" | "windup" | "recovery";
    timeRemainingInPhase: number;
    phaseTimings: {
        active: number;
        windup: number;
        recovery: number;
    };
    interruptible: boolean;
    windupElapsed: number;
    activeOnEvent?: string | undefined;
    targetEntityId?: string | undefined;
    targetPosition?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
}>;
export type Casting = z.infer<typeof CastingSchema>;
export declare const SpawnedBySchema: z.ZodObject<{
    /** ID of the spawner that produced this entity. Matches a
     *  `spawner.id` somewhere in the world (or did at spawn time —
     *  the originating spawner may have been removed since). */
    spawnerId: z.ZodString;
    /** World time in seconds at spawn. The system passes its
     *  accumulated tick time; game code can compare against the
     *  current world time for age queries. */
    spawnedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    spawnerId: string;
    spawnedAt: number;
}, {
    spawnerId: string;
    spawnedAt: number;
}>;
export type SpawnedBy = z.infer<typeof SpawnedBySchema>;
export declare const GameClockSchema: z.ZodObject<{
    /** Game-time seconds since `dayNumber=1, 00:00`. Monotonic, bounded
     *  only by Number.MAX_SAFE_INTEGER (~285M years at 1 game-second
     *  per real-second; not a concern). */
    currentSeconds: z.ZodNumber;
    /** How many game seconds make up one day. Default 1200 (20-min day);
     *  apps tune for "60-min day" feel by setting `3600`. */
    secondsPerDay: z.ZodNumber;
    /** When true, `gameClockSystem` does NOT advance the clock or fire
     *  any time-driven handlers. Pause is a game-time concept; physics
     *  and rendering continue. */
    paused: z.ZodBoolean;
    /** Multiplier applied to `dt` when advancing. `1` = real-time;
     *  `60` = 1 minute real → 1 hour game. Sleep-to-morning typically
     *  bumps to a high multiplier briefly. */
    speedMultiplier: z.ZodNumber;
    /** Cached current phase. Maintained by the system (recomputed each
     *  tick from `currentSeconds`). Saved so reload skips a transition
     *  detection on the first tick. */
    currentPhase: z.ZodEnum<["dawn", "morning", "noon", "afternoon", "dusk", "night"]>;
    /** Per-phase start-of-day fractions; see PhaseThresholdsSchema. */
    phaseThresholds: z.ZodObject<{
        dawn: z.ZodNumber;
        morning: z.ZodNumber;
        noon: z.ZodNumber;
        afternoon: z.ZodNumber;
        dusk: z.ZodNumber;
        night: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        dawn: number;
        morning: number;
        noon: number;
        afternoon: number;
        dusk: number;
        night: number;
    }, {
        dawn: number;
        morning: number;
        noon: number;
        afternoon: number;
        dusk: number;
        night: number;
    }>;
    /** Day-of-week index (0 = Monday … 6 = Sunday). The system advances
     *  this on day rollover. Used by schedule entries with `dayPattern`
     *  filters (`'weekday'`, `'weekend'`, or explicit day arrays). */
    dayOfWeek: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    currentSeconds: number;
    secondsPerDay: number;
    paused: boolean;
    speedMultiplier: number;
    currentPhase: "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
    phaseThresholds: {
        dawn: number;
        morning: number;
        noon: number;
        afternoon: number;
        dusk: number;
        night: number;
    };
    dayOfWeek: number;
}, {
    currentSeconds: number;
    secondsPerDay: number;
    paused: boolean;
    speedMultiplier: number;
    currentPhase: "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
    phaseThresholds: {
        dawn: number;
        morning: number;
        noon: number;
        afternoon: number;
        dusk: number;
        night: number;
    };
    dayOfWeek: number;
}>;
export type GameClock = z.infer<typeof GameClockSchema>;
export declare const ScheduledHandlersSchema: z.ZodObject<{
    handles: z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["at", "daily", "every"]>;
        callbackId: z.ZodString;
        nextFireAt: z.ZodNumber;
        intervalSeconds: z.ZodOptional<z.ZodNumber>;
        fired: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "every" | "at" | "daily";
        callbackId: string;
        nextFireAt: number;
        fired: boolean;
        intervalSeconds?: number | undefined;
    }, {
        id: string;
        kind: "every" | "at" | "daily";
        callbackId: string;
        nextFireAt: number;
        fired: boolean;
        intervalSeconds?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    handles: Record<string, {
        id: string;
        kind: "every" | "at" | "daily";
        callbackId: string;
        nextFireAt: number;
        fired: boolean;
        intervalSeconds?: number | undefined;
    }>;
}, {
    handles: Record<string, {
        id: string;
        kind: "every" | "at" | "daily";
        callbackId: string;
        nextFireAt: number;
        fired: boolean;
        intervalSeconds?: number | undefined;
    }>;
}>;
export type ScheduledHandlers = z.infer<typeof ScheduledHandlersSchema>;
export declare const ScheduleSchema: z.ZodObject<{
    scheduleId: z.ZodString;
    /** `undefined` when no entry covers the current time-of-day
     *  (a gap). Apps decide idle behavior in that case. */
    activeEntryIndex: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    scheduleId: string;
    activeEntryIndex?: number | undefined;
}, {
    scheduleId: string;
    activeEntryIndex?: number | undefined;
}>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export declare const GridSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    /** World units per tile. Default 1 in the builder. */
    cellSize: z.ZodNumber;
    /** World position of the (0,0)-tile's lower-left CORNER (not
     *  center). Tile centers offset by `(0.5, 0, 0.5) * cellSize`. */
    origin: z.ZodObject<{
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
    topology: z.ZodEnum<["4-way", "8-way"]>;
    /** Flat row-major tile data: `tiles[y * width + x]`. Length =
     *  `width * height`. */
    tiles: z.ZodArray<z.ZodObject<{
        cost: z.ZodNumber;
        opaque: z.ZodBoolean;
        terrainId: z.ZodOptional<z.ZodString>;
        cover: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        cost: number;
        opaque: boolean;
        terrainId?: string | undefined;
        cover?: number | undefined;
    }, {
        cost: number;
        opaque: boolean;
        terrainId?: string | undefined;
        cover?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    height: number;
    origin: {
        x: number;
        y: number;
        z: number;
    };
    width: number;
    cellSize: number;
    topology: "4-way" | "8-way";
    tiles: {
        cost: number;
        opaque: boolean;
        terrainId?: string | undefined;
        cover?: number | undefined;
    }[];
}, {
    height: number;
    origin: {
        x: number;
        y: number;
        z: number;
    };
    width: number;
    cellSize: number;
    topology: "4-way" | "8-way";
    tiles: {
        cost: number;
        opaque: boolean;
        terrainId?: string | undefined;
        cover?: number | undefined;
    }[];
}>;
export type Grid = z.infer<typeof GridSchema>;
export declare const TilePositionSchema: z.ZodObject<{
    coord: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
}, "strip", z.ZodTypeAny, {
    coord: {
        x: number;
        y: number;
    };
}, {
    coord: {
        x: number;
        y: number;
    };
}>;
export type TilePosition = z.infer<typeof TilePositionSchema>;
export declare const TurnParticipantSchema: z.ZodObject<{
    /** App-defined team id. Conventional values: `'player'`,
     *  `'enemy'`, `'neutral'`. Apps with more sides
     *  (`'guild-blue'`, `'guild-red'`) coin their own. */
    team: z.ZodString;
    /** Higher = acts first in `'individual'` mode; ties broken by
     *  insertion order. Unused in `'team'` mode (within-team order
     *  is free). Default 0. */
    initiative: z.ZodNumber;
    apMax: z.ZodNumber;
    apCurrent: z.ZodNumber;
    /** Set by the manager on turn-start; cleared on turn-end.
     *  Apps query this to grey out moved units in UI. */
    hasActedThisTurn: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    team: string;
    initiative: number;
    apMax: number;
    apCurrent: number;
    hasActedThisTurn: boolean;
}, {
    team: string;
    initiative: number;
    apMax: number;
    apCurrent: number;
    hasActedThisTurn: boolean;
}>;
export type TurnParticipant = z.infer<typeof TurnParticipantSchema>;
export declare const TurnStateSchema: z.ZodObject<{
    mode: z.ZodEnum<["individual", "team"]>;
    phase: z.ZodEnum<["idle", "awaiting-input", "resolving-action", "ended"]>;
    /** 1-indexed turn counter. Each completed cycle of the queue
     *  increments. */
    turnNumber: z.ZodNumber;
    /** Active entity id (in `'individual'` mode) — the one whose
     *  turn it currently is. `undefined` when phase is `'idle'`
     *  or `'ended'`. */
    activeEntityId: z.ZodOptional<z.ZodString>;
    /** Active team id (in `'team'` mode) — the team currently
     *  acting. `undefined` outside `'team'` mode. */
    activeTeam: z.ZodOptional<z.ZodString>;
    /** Order of upcoming turns. In `'individual'` mode: entity
     *  ids sorted by initiative. In `'team'` mode: team-id
     *  rotation. The head is the active participant; the tail
     *  rolls back to the front when the cycle completes. */
    queue: z.ZodArray<z.ZodString, "many">;
    /** Optional battle id — apps that run multiple encounters
     *  (arena 1, arena 2) tag each so save-pickers can show
     *  which is in flight. */
    battleId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    mode: "individual" | "team";
    phase: "idle" | "awaiting-input" | "resolving-action" | "ended";
    turnNumber: number;
    queue: string[];
    activeEntityId?: string | undefined;
    activeTeam?: string | undefined;
    battleId?: string | undefined;
}, {
    mode: "individual" | "team";
    phase: "idle" | "awaiting-input" | "resolving-action" | "ended";
    turnNumber: number;
    queue: string[];
    activeEntityId?: string | undefined;
    activeTeam?: string | undefined;
    battleId?: string | undefined;
}>;
export type TurnState = z.infer<typeof TurnStateSchema>;
export declare const DialogueStateSchema: z.ZodObject<{
    /** Currently-active dialogue script id. `null` between
     *  conversations. */
    activeScriptId: z.ZodNullable<z.ZodString>;
    /** Current node id within the active script. `null` when
     *  no dialogue is active. */
    currentNodeId: z.ZodNullable<z.ZodString>;
    /** Optional history of `(nodeId, choiceIndex)` pairs for
     *  back-navigation / log display. Capped to a reasonable
     *  length (apps configure). When omitted, history isn't
     *  recorded — keeps the slot tiny for games that don't need it. */
    history: z.ZodOptional<z.ZodArray<z.ZodObject<{
        nodeId: z.ZodString;
        choiceIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        nodeId: string;
        choiceIndex: number;
    }, {
        nodeId: string;
        choiceIndex: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    activeScriptId: string | null;
    currentNodeId: string | null;
    history?: {
        nodeId: string;
        choiceIndex: number;
    }[] | undefined;
}, {
    activeScriptId: string | null;
    currentNodeId: string | null;
    history?: {
        nodeId: string;
        choiceIndex: number;
    }[] | undefined;
}>;
export type DialogueState = z.infer<typeof DialogueStateSchema>;
export declare const QuestTrackerSchema: z.ZodObject<{
    /** Quests currently in progress. */
    active: z.ZodArray<z.ZodObject<{
        questId: z.ZodString;
        currentStepIndex: z.ZodNumber;
        progress: z.ZodNumber;
        startedAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        questId: string;
        currentStepIndex: number;
        progress: number;
        startedAt: number;
    }, {
        questId: string;
        currentStepIndex: number;
        progress: number;
        startedAt: number;
    }>, "many">;
    /** Quest ids that completed. */
    completed: z.ZodArray<z.ZodString, "many">;
    /** Quest ids that failed (an objective became unreachable —
     *  protected NPC died, time ran out, etc.). */
    failed: z.ZodArray<z.ZodString, "many">;
    /** Quest ids the player explicitly abandoned. Separate from
     *  `failed` so apps can display "tried and gave up" UIs
     *  distinctly from "tried and lost." */
    abandoned: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    active: {
        questId: string;
        currentStepIndex: number;
        progress: number;
        startedAt: number;
    }[];
    completed: string[];
    failed: string[];
    abandoned: string[];
}, {
    active: {
        questId: string;
        currentStepIndex: number;
        progress: number;
        startedAt: number;
    }[];
    completed: string[];
    failed: string[];
    abandoned: string[];
}>;
export type QuestTracker = z.infer<typeof QuestTrackerSchema>;
export declare const AchievementsSchema: z.ZodObject<{
    /** Ids of achievements unlocked on this entity. */
    unlocked: z.ZodArray<z.ZodString, "many">;
    /** Per-id unlock timestamps (matches `unlocked` membership;
     *  apps display "unlocked at day 12, 14:32" UIs). */
    unlockTimes: z.ZodRecord<z.ZodString, z.ZodNumber>;
    /** For `stat-threshold` achievements: snapshot of progress
     *  at last evaluation. The framework recomputes from `stats`
     *  on every `incrementStat` / `setStat` call; this field
     *  primarily serves UIs that want progress bars without
     *  re-running the criterion check. */
    progress: z.ZodRecord<z.ZodString, z.ZodNumber>;
    /** Stat counters (Steam-shape). Apps tick via
     *  `incrementStat` / `setStat`. Floats allowed — apps that
     *  want integer-only enforce via their own setters. */
    stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    /** Hidden achievements that have been "discovered" via any
     *  progress. UI shows "??? — locked" for these instead of
     *  hiding entirely. Steam-shape. */
    hiddenSeen: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    progress: Record<string, number>;
    unlocked: string[];
    unlockTimes: Record<string, number>;
    stats: Record<string, number>;
    hiddenSeen: string[];
}, {
    progress: Record<string, number>;
    unlocked: string[];
    unlockTimes: Record<string, number>;
    stats: Record<string, number>;
    hiddenSeen: string[];
}>;
export type Achievements = z.infer<typeof AchievementsSchema>;
export declare const CinematicSchema: z.ZodObject<{
    /** Active cutscene id, or `null` while idle. */
    activeCutsceneId: z.ZodNullable<z.ZodString>;
    /** Coarse FSM phase. `'preparing'` covers async asset preload
     *  before tracks fire; `'playing'` is the per-frame tick phase;
     *  `'completing'` runs the post-roll fade for video cutscenes;
     *  `'completed'` is a one-tick latch before transition back to
     *  `'idle'`. */
    phase: z.ZodEnum<["idle", "preparing", "playing", "completing", "completed"]>;
    /** Player's accumulated time since `play()`. Pause-aware,
     *  deltaTime-only — never reads wall-clock so replays stay
     *  bit-identical for timeline cutscenes. Resets to 0 on each
     *  `play()`. */
    clockSeconds: z.ZodNumber;
    /** Indices into the active timeline cutscene's `tracks[]` array
     *  that have already fired. Used to dedupe firing across frames
     *  and to compute the fast-forward set on `skip()`. Empty for
     *  video cutscenes. */
    firedIndices: z.ZodArray<z.ZodNumber, "many">;
    /** Latched flag; the next tick fast-forwards remaining tracks
     *  with `skipped: true` context and transitions to
     *  `'completed'`. */
    skipRequested: z.ZodBoolean;
    /** Player-local pause flag, INDEPENDENT of `gameClock.paused`
     *  and SceneManager pause. Apps that want game-pause to suspend
     *  cutscenes wire that explicitly. */
    paused: z.ZodBoolean;
    /** Active overlay alpha (0 = transparent, 1 = opaque). Driven
     *  by `fade` tracks + video pre-roll/post-roll fades. The UI
     *  layer reads this for the `<CutsceneOverlay>` darkness. */
    fadeAlpha: z.ZodNumber;
    /** CSS color hex backing the fade overlay. Updated when a fade
     *  track fires so cutscenes can fade to white / red / etc. */
    fadeColor: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phase: "idle" | "completed" | "playing" | "preparing" | "completing";
    paused: boolean;
    activeCutsceneId: string | null;
    clockSeconds: number;
    firedIndices: number[];
    skipRequested: boolean;
    fadeAlpha: number;
    fadeColor: string;
}, {
    phase: "idle" | "completed" | "playing" | "preparing" | "completing";
    paused: boolean;
    activeCutsceneId: string | null;
    clockSeconds: number;
    firedIndices: number[];
    skipRequested: boolean;
    fadeAlpha: number;
    fadeColor: string;
}>;
export type Cinematic = z.infer<typeof CinematicSchema>;
export declare const CinematicCameraSchema: z.ZodObject<{
    /** Target pose for snap (when `tweenFromSeconds === tweenToSeconds`)
     *  or the END pose of an in-flight tween. */
    position: z.ZodObject<{
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
    lookAt: z.ZodObject<{
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
    /** Optional FOV override in degrees. */
    fov: z.ZodOptional<z.ZodNumber>;
    /** Pose to tween FROM. Snapshotted at tween start so re-evaluations
     *  (frame-rate jitter, pause/resume) don't drift. */
    tweenSourcePosition: z.ZodObject<{
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
    tweenSourceLookAt: z.ZodObject<{
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
    /** Source FOV for the in-flight tween (paired with `fov`). */
    tweenSourceFov: z.ZodOptional<z.ZodNumber>;
    /** `cinematic.clockSeconds` value at tween start. */
    tweenFromSeconds: z.ZodNumber;
    /** `cinematic.clockSeconds` value at tween end. When equal to
     *  `tweenFromSeconds`, the slot is treated as a snap (driver
     *  jumps the camera to `position` / `lookAt` immediately). */
    tweenToSeconds: z.ZodNumber;
    /** Easing curve applied to the normalized [0..1] tween param. */
    ease: z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out"]>;
}, "strip", z.ZodTypeAny, {
    position: {
        x: number;
        y: number;
        z: number;
    };
    lookAt: {
        x: number;
        y: number;
        z: number;
    };
    tweenSourcePosition: {
        x: number;
        y: number;
        z: number;
    };
    tweenSourceLookAt: {
        x: number;
        y: number;
        z: number;
    };
    tweenFromSeconds: number;
    tweenToSeconds: number;
    ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
    fov?: number | undefined;
    tweenSourceFov?: number | undefined;
}, {
    position: {
        x: number;
        y: number;
        z: number;
    };
    lookAt: {
        x: number;
        y: number;
        z: number;
    };
    tweenSourcePosition: {
        x: number;
        y: number;
        z: number;
    };
    tweenSourceLookAt: {
        x: number;
        y: number;
        z: number;
    };
    tweenFromSeconds: number;
    tweenToSeconds: number;
    ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
    fov?: number | undefined;
    tweenSourceFov?: number | undefined;
}>;
export type CinematicCamera = z.infer<typeof CinematicCameraSchema>;
export declare const BeatClockSchema: z.ZodObject<{
    /** Beats per minute. Mutable at runtime via `setBpm`; the system
     *  re-derives the per-beat duration on the fly from this. */
    bpm: z.ZodNumber;
    /** Hit-window radius in seconds. An ability flagged `onBeat`
     *  activates when `Math.abs(currentSeconds - beatBoundary) <=
     *  hitWindowSeconds`. Half-window each side; total window is 2×
     *  this value. Set 0 for "must hit exactly on the beat" (only
     *  a single-frame slice per beat). */
    hitWindowSeconds: z.ZodNumber;
    /** Beats per measure. Default 4 (4/4 time). Used by
     *  `getBeatProgress` to derive `measureIndex` for UI grouping;
     *  no gameplay logic depends on it. */
    beatsPerMeasure: z.ZodNumber;
    /** True while the clock advances. `false` freezes
     *  `currentSeconds` (and thus beat firing) without resetting
     *  state — pause / resume preserves phase. `startBeatClock`
     *  sets true; `stopBeatClock` sets false. */
    running: z.ZodBoolean;
    /** Accumulated seconds since the clock started. Advances by
     *  `dt` each tick while `running`. Apps can override via
     *  `setBeatTime(world, seconds)` to nudge the clock back into
     *  sync with an external audio reference (typically
     *  `audioMixer.context().currentTime - songStartTime`). */
    currentSeconds: z.ZodNumber;
    /** Bookkeeping — last fired beat index. The system uses this
     *  to detect crossings + fire `'rhythm:beat'` events exactly
     *  once per beat boundary even when dt spans multiple beats.
     *  Initial value is `-1` so the first beat at index 0 fires
     *  on the first tick after the boundary is crossed. */
    lastFiredBeatIndex: z.ZodNumber;
    /** Bookkeeping — whether the most-recently-crossed hit window
     *  is currently OPEN. The system uses this to fire
     *  `'rhythm:hit-window-open'` exactly once per crossing
     *  (when window-edge transitions from outside → inside) and
     *  `'rhythm:hit-window-close'` once per crossing in the
     *  reverse direction. Initial value is `false`. */
    inHitWindow: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    currentSeconds: number;
    bpm: number;
    hitWindowSeconds: number;
    beatsPerMeasure: number;
    running: boolean;
    lastFiredBeatIndex: number;
    inHitWindow: boolean;
}, {
    currentSeconds: number;
    bpm: number;
    hitWindowSeconds: number;
    beatsPerMeasure: number;
    running: boolean;
    lastFiredBeatIndex: number;
    inHitWindow: boolean;
}>;
export type BeatClock = z.infer<typeof BeatClockSchema>;
export declare const PlatformerTuningSchema: z.ZodObject<{
    /** Peak jump height in world units. The controller computes the
     *  initial jump velocity from this + gravity:
     *  `vJump = sqrt(2 × gravity × jumpHeight)`. */
    jumpHeight: z.ZodNumber;
    /** Horizontal speed in world units / second when grounded.
     *  Diagonal movement is normalized so combined moves don't
     *  exceed this magnitude. */
    groundSpeed: z.ZodNumber;
    /** Air control fraction (0 = no horizontal influence in air,
     *  1 = full ground control). Most games tune 0.3–0.8. */
    airControl: z.ZodNumber;
    /** Gravity in world units / second² applied to the character
     *  while airborne ascending. Sign convention: positive value =
     *  downward acceleration. */
    gravity: z.ZodNumber;
    /** Multiplier on `gravity` applied while airborne falling
     *  (velocity.y < 0). Bigger = snappier fall (Mario-like).
     *  Default 1.5. */
    fallGravityMultiplier: z.ZodNumber;
    /** Coyote time in seconds — late jump after walking off a
     *  ledge. Default 0.1s. */
    coyoteTime: z.ZodNumber;
    /** Jump buffer in seconds — early jump press registers if you
     *  land within this window. Default 0.15s. */
    jumpBuffer: z.ZodNumber;
    /** Horizontal damping in world units / second² applied when
     *  no input is pressed (and the character is grounded). Higher
     *  = faster stop. Set 0 for ice-physics. Default 40. */
    groundFriction: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    jumpHeight: number;
    groundSpeed: number;
    airControl: number;
    gravity: number;
    fallGravityMultiplier: number;
    coyoteTime: number;
    jumpBuffer: number;
    groundFriction: number;
}, {
    jumpHeight: number;
    groundSpeed: number;
    airControl: number;
    gravity: number;
    fallGravityMultiplier: number;
    coyoteTime: number;
    jumpBuffer: number;
    groundFriction: number;
}>;
export type PlatformerTuning = z.infer<typeof PlatformerTuningSchema>;
export declare const PlatformerActionMapSchema: z.ZodObject<{
    moveForward: z.ZodString;
    moveBack: z.ZodString;
    moveLeft: z.ZodString;
    moveRight: z.ZodString;
    jump: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moveForward: string;
    moveBack: string;
    moveLeft: string;
    moveRight: string;
    jump: string;
}, {
    moveForward: string;
    moveBack: string;
    moveLeft: string;
    moveRight: string;
    jump: string;
}>;
export type PlatformerActionMap = z.infer<typeof PlatformerActionMapSchema>;
export declare const PlatformerStateSchema: z.ZodObject<{
    tuning: z.ZodObject<{
        /** Peak jump height in world units. The controller computes the
         *  initial jump velocity from this + gravity:
         *  `vJump = sqrt(2 × gravity × jumpHeight)`. */
        jumpHeight: z.ZodNumber;
        /** Horizontal speed in world units / second when grounded.
         *  Diagonal movement is normalized so combined moves don't
         *  exceed this magnitude. */
        groundSpeed: z.ZodNumber;
        /** Air control fraction (0 = no horizontal influence in air,
         *  1 = full ground control). Most games tune 0.3–0.8. */
        airControl: z.ZodNumber;
        /** Gravity in world units / second² applied to the character
         *  while airborne ascending. Sign convention: positive value =
         *  downward acceleration. */
        gravity: z.ZodNumber;
        /** Multiplier on `gravity` applied while airborne falling
         *  (velocity.y < 0). Bigger = snappier fall (Mario-like).
         *  Default 1.5. */
        fallGravityMultiplier: z.ZodNumber;
        /** Coyote time in seconds — late jump after walking off a
         *  ledge. Default 0.1s. */
        coyoteTime: z.ZodNumber;
        /** Jump buffer in seconds — early jump press registers if you
         *  land within this window. Default 0.15s. */
        jumpBuffer: z.ZodNumber;
        /** Horizontal damping in world units / second² applied when
         *  no input is pressed (and the character is grounded). Higher
         *  = faster stop. Set 0 for ice-physics. Default 40. */
        groundFriction: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        jumpHeight: number;
        groundSpeed: number;
        airControl: number;
        gravity: number;
        fallGravityMultiplier: number;
        coyoteTime: number;
        jumpBuffer: number;
        groundFriction: number;
    }, {
        jumpHeight: number;
        groundSpeed: number;
        airControl: number;
        gravity: number;
        fallGravityMultiplier: number;
        coyoteTime: number;
        jumpBuffer: number;
        groundFriction: number;
    }>;
    actions: z.ZodObject<{
        moveForward: z.ZodString;
        moveBack: z.ZodString;
        moveLeft: z.ZodString;
        moveRight: z.ZodString;
        jump: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        moveForward: string;
        moveBack: string;
        moveLeft: string;
        moveRight: string;
        jump: string;
    }, {
        moveForward: string;
        moveBack: string;
        moveLeft: string;
        moveRight: string;
        jump: string;
    }>;
    /** System-maintained: real-time seconds accumulated since the
     *  controller started. Used as the time-base for coyote-window
     *  + jump-buffer comparisons. */
    accumulatedSeconds: z.ZodNumber;
    /** System-maintained: `accumulatedSeconds` of the last frame the
     *  character was grounded. Set to a large negative value
     *  initially so the first jump from rest doesn't accidentally
     *  fire via coyote time. */
    lastGroundedAt: z.ZodNumber;
    /** System-maintained: `accumulatedSeconds` of the last
     *  jump-press input event. Set to a large negative initially so
     *  the buffered-jump check fails until the player actually
     *  presses jump. */
    lastJumpPressedAt: z.ZodNumber;
    /** System-maintained: was the character grounded LAST tick.
     *  Apps read this for animation routing (idle vs falling). */
    grounded: z.ZodBoolean;
    /** System-maintained: did the character jump on the last tick.
     *  Latches true for the frame jump fires; cleared next tick.
     *  Apps subscribe via per-tick polling for jump-VFX cues. */
    jumpedThisTick: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    tuning: {
        jumpHeight: number;
        groundSpeed: number;
        airControl: number;
        gravity: number;
        fallGravityMultiplier: number;
        coyoteTime: number;
        jumpBuffer: number;
        groundFriction: number;
    };
    actions: {
        moveForward: string;
        moveBack: string;
        moveLeft: string;
        moveRight: string;
        jump: string;
    };
    accumulatedSeconds: number;
    lastGroundedAt: number;
    lastJumpPressedAt: number;
    grounded: boolean;
    jumpedThisTick: boolean;
}, {
    tuning: {
        jumpHeight: number;
        groundSpeed: number;
        airControl: number;
        gravity: number;
        fallGravityMultiplier: number;
        coyoteTime: number;
        jumpBuffer: number;
        groundFriction: number;
    };
    actions: {
        moveForward: string;
        moveBack: string;
        moveLeft: string;
        moveRight: string;
        jump: string;
    };
    accumulatedSeconds: number;
    lastGroundedAt: number;
    lastJumpPressedAt: number;
    grounded: boolean;
    jumpedThisTick: boolean;
}>;
export type PlatformerState = z.infer<typeof PlatformerStateSchema>;
export declare const SquadFormationSchema: z.ZodObject<{
    /** Stable id of the leader entity. The squad system locates
     *  the leader via `world.where(e => e.id === leaderEntityId)`
     *  each tick (the cost is negligible for typical squad sizes
     *  ≤ 16; apps with larger squads cache the reference
     *  themselves). */
    leaderEntityId: z.ZodString;
    /** Local offset from leader, world space. The system computes
     *  `desired = leader.transform.position + offset` and seeks
     *  toward it. Apps that want leader-local-yaw rotation of the
     *  formation rotate the offset themselves before writing. */
    offset: z.ZodObject<{
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
    /** Damping rate — controls how fast the squad member catches
     *  up to its formation slot. Higher = faster (1 = sluggish, 5
     *  = snappy, 10 = teleport-feel). Default 5. */
    followDamping: z.ZodNumber;
    /** Cap on the desired velocity magnitude written each tick.
     *  Prevents runaway followers when the leader teleports.
     *  Default 8 world units / second. */
    maxSpeed: z.ZodNumber;
    /** Distance threshold at which the system clamps velocity to
     *  zero (member is "in formation"). Default 0.1 world units.
     *  Avoids jittery micro-corrections at the formation slot. */
    arrivalRadius: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    arrivalRadius: number;
    maxSpeed: number;
    leaderEntityId: string;
    offset: {
        x: number;
        y: number;
        z: number;
    };
    followDamping: number;
}, {
    arrivalRadius: number;
    maxSpeed: number;
    leaderEntityId: string;
    offset: {
        x: number;
        y: number;
        z: number;
    };
    followDamping: number;
}>;
export type SquadFormation = z.infer<typeof SquadFormationSchema>;
export declare const IkChainSchema: z.ZodObject<{
    /** Stable id for this chain. Used by the solver to keep
     *  internal helper bones (one per chain) stable across
     *  ticks; also surfaces in debug tooling. Apps name them
     *  `'foot-l'` / `'foot-r'` / `'head-look'` etc. */
    id: z.ZodString;
    /** Bone names from end-effector toward root. The solver
     *  needs at least 2 entries (effector + 1 link); typical
     *  chains are 3 (effector + 2 links). */
    chain: z.ZodArray<z.ZodString, "many">;
    /** World-space position the end effector should reach. Apps
     *  mutate this each frame (raycast hit point for foot IK,
     *  cursor world-position for look IK). */
    target: z.ZodObject<{
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
    /** 0 = pure animation (IK off), 1 = pure IK. v1 supports
     *  the 0 / 1 endpoints; intermediate values are CLAMPED to
     *  0 or 1 (no per-bone weight blending — see CLAUDE.md). */
    weight: z.ZodNumber;
    /** CCD iterations per frame. Default 10. Higher = more
     *  accurate, more cost. Apps tune per chain length:
     *  3-bone foot chain: 8–12; 4-bone arm chain: 12–18. */
    iterations: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    weight: number;
    target: {
        x: number;
        y: number;
        z: number;
    };
    chain: string[];
    iterations: number;
}, {
    id: string;
    weight: number;
    target: {
        x: number;
        y: number;
        z: number;
    };
    chain: string[];
    iterations: number;
}>;
export type IkChain = z.infer<typeof IkChainSchema>;
export declare const BoneAttachmentSchema: z.ZodObject<{
    /** Stable id of the parent (skinned-character) entity. The
     *  driver looks this up in the skinned-mesh registry; missing
     *  parent → driver no-ops + warn-once. Save/load round-trips
     *  the id (NOT the runtime entity reference). */
    parentEntityId: z.ZodString;
    /** Bone name on the parent's skeleton. Same naming
     *  convention as IkChain (Mixamo: `'mixamorig:RightHand'`,
     *  etc.). Missing bone → driver no-ops + warn-once. */
    boneName: z.ZodString;
    /** Local offset transform applied AFTER the bone's world
     *  transform. Use this to align a sword grip to the hand
     *  bone's coordinate frame, or to add a vertical offset for
     *  a hat sitting on the head bone. */
    offset: z.ZodObject<{
        /** World-space position, meters. */
        position: z.ZodObject<{
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
        /** World-space orientation as a unit quaternion. */
        rotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
        /** Per-axis scale multiplier; (1,1,1) is identity. Non-uniform scale is
         *  allowed but tends to fight physics — prefer uniform where possible. */
        scale: z.ZodObject<{
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
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        scale: {
            x: number;
            y: number;
            z: number;
        };
    }, {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        scale: {
            x: number;
            y: number;
            z: number;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    offset: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        scale: {
            x: number;
            y: number;
            z: number;
        };
    };
    parentEntityId: string;
    boneName: string;
}, {
    offset: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        scale: {
            x: number;
            y: number;
            z: number;
        };
    };
    parentEntityId: string;
    boneName: string;
}>;
export type BoneAttachment = z.infer<typeof BoneAttachmentSchema>;
export declare const TriggerVolumeSchema: z.ZodObject<{
    /** Stable id surfaced in event payloads. App-defined; the
     *  framework treats it as opaque. Convention: prefix with
     *  intent (`'encounter:forest-1'`, `'biome:cave'`,
     *  `'tutorial:first-jump'`). */
    id: z.ZodString;
    /** World-space min corner of the AABB. */
    min: z.ZodObject<{
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
    /** World-space max corner of the AABB. Each axis must be
     *  >= the corresponding `min` axis; the system asserts this
     *  cheaply and skips degenerate volumes with a warn-once. */
    max: z.ZodObject<{
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
    /** Fire mode. Default `'multi'` — the trigger lives forever
     *  and fires enter/exit on every transition. `'once'` —
     *  the trigger fires `'trigger:entered'` once on the first
     *  enter, flips `consumed: true`, and never fires again. */
    fireMode: z.ZodDefault<z.ZodEnum<["multi", "once"]>>;
    /** System-maintained flag. `true` means a `'once'` trigger
     *  has already fired and is now inert. Apps that want to
     *  re-arm a consumed trigger flip this back to `false`. */
    consumed: z.ZodDefault<z.ZodBoolean>;
    /** Optional category for app-side filtering. Subscribers
     *  often only care about one kind of trigger (encounters,
     *  biomes, tutorials) and dispatch on this field. */
    category: z.ZodOptional<z.ZodString>;
    /** Optional filter: only `triggerActor`s with a matching
     *  `tag` field fire this volume. When unset, any actor
     *  with a `triggerActor` slot fires it (most common for
     *  music biomes — the player and pets alike re-trigger). */
    filter: z.ZodOptional<z.ZodString>;
    /** Opaque app payload. Echoed in the fired event so
     *  subscribers don't need a side-channel id → metadata
     *  lookup table. Stays JSON-shaped for save/load. */
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    max: {
        x: number;
        y: number;
        z: number;
    };
    min: {
        x: number;
        y: number;
        z: number;
    };
    fireMode: "multi" | "once";
    consumed: boolean;
    filter?: string | undefined;
    payload?: Record<string, unknown> | undefined;
    category?: string | undefined;
}, {
    id: string;
    max: {
        x: number;
        y: number;
        z: number;
    };
    min: {
        x: number;
        y: number;
        z: number;
    };
    filter?: string | undefined;
    payload?: Record<string, unknown> | undefined;
    fireMode?: "multi" | "once" | undefined;
    consumed?: boolean | undefined;
    category?: string | undefined;
}>;
export type TriggerVolume = z.infer<typeof TriggerVolumeSchema>;
export declare const TriggerActorSchema: z.ZodObject<{
    /** Optional discriminator. `triggerVolume.filter` matches
     *  against this; mismatched tag means the volume ignores
     *  this actor. Convention: `'player'` for the controllable
     *  character, `'enemy'` for hostiles, app-defined for
     *  game-specific kinds. */
    tag: z.ZodOptional<z.ZodString>;
    /** Half-extent in world units used for AABB overlap. The
     *  actor's effective bounding box is
     *  `[position - halfExtents, position + halfExtents]`.
     *  Apps using point-only detection set [0,0,0] (or omit
     *  for the default 0 point). Apps using avatar-shaped
     *  detection pass the character's capsule radius / half-
     *  height. */
    halfExtents: z.ZodOptional<z.ZodObject<{
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
    }>>;
}, "strip", z.ZodTypeAny, {
    halfExtents?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
    tag?: string | undefined;
}, {
    halfExtents?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
    tag?: string | undefined;
}>;
export type TriggerActor = z.infer<typeof TriggerActorSchema>;
export declare const ImpactFrameSchema: z.ZodObject<{
    /** True while the impact frame is in flight. Sibling systems
     *  read via `isImpactFrameActive(world)`. */
    active: z.ZodDefault<z.ZodBoolean>;
    /** Real-time seconds remaining. Decrements each tick via the
     *  raw frame dt. When it hits zero, `'impactFrame:ended'` fires
     *  and `active` flips to false. */
    remainingSeconds: z.ZodDefault<z.ZodNumber>;
    /** The total requested duration (snapshot at trigger time). The
     *  flash-sample helper uses this to compute normalized progress
     *  0..1 for the hold-then-fade curve. */
    totalDurationSeconds: z.ZodDefault<z.ZodNumber>;
    /** Pre-parsed flash color in RGB, each channel in [0, 1]. Stored
     *  pre-parsed so the renderer's per-frame sample doesn't have
     *  to call `new Color()` on every read. */
    color: z.ZodDefault<z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        r: number;
        g: number;
        b: number;
    }, {
        r: number;
        g: number;
        b: number;
    }>>;
    /** Peak flash multiplier in [0, 1]. 1.0 = full white-out at
     *  peak intensity; 0.5 = "half flash" for subtler hits.
     *  Default 1.0. */
    flashIntensity: z.ZodDefault<z.ZodNumber>;
    /** Fraction in [0, 1] of `totalDurationSeconds` spent at peak
     *  flash before the ease-out fade begins. 0 = pure linear fade
     *  from peak; 0.3 (default) = canonical anime hold-then-fade. */
    holdRatio: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    remainingSeconds: number;
    active: boolean;
    color: {
        r: number;
        g: number;
        b: number;
    };
    totalDurationSeconds: number;
    flashIntensity: number;
    holdRatio: number;
}, {
    remainingSeconds?: number | undefined;
    active?: boolean | undefined;
    color?: {
        r: number;
        g: number;
        b: number;
    } | undefined;
    totalDurationSeconds?: number | undefined;
    flashIntensity?: number | undefined;
    holdRatio?: number | undefined;
}>;
export type ImpactFrame = z.infer<typeof ImpactFrameSchema>;
export declare const ScreenShakeSchema: z.ZodObject<{
    /** Current trauma value in [0, 1]. Decays toward 0 per tick at
     *  `decay` rate; the renderer multiplies this squared by
     *  `maxOffset` / `maxRotation` to derive per-frame perturbation. */
    intensity: z.ZodDefault<z.ZodNumber>;
    /** Max world-space position offset (meters) at intensity = 1.
     *  Apps tune per camera distance: 0.1 for a tight follow cam at
     *  offset [0, 4, 6], 0.3 for a fixed-angle cam at distance 16. */
    maxOffset: z.ZodDefault<z.ZodNumber>;
    /** Max rotational perturbation (radians, applied to yaw + pitch)
     *  at intensity = 1. ~0.03 rad ≈ 1.7°. Combined with `maxOffset`
     *  the visible effect is a punchy jolt with directional bias. */
    maxRotation: z.ZodDefault<z.ZodNumber>;
    /** Decay rate per second. 4 = trauma falls to ~e⁻⁴ ≈ 0.018 in
     *  one second (snappy). Lower = longer-lasting shake. */
    decay: z.ZodDefault<z.ZodNumber>;
    /** Seed for the per-frame noise. Apps that want bit-identical
     *  replay use a stable seed; default 0 is fine for visual-only
     *  shake. */
    seed: z.ZodDefault<z.ZodNumber>;
    /** System-incremented frame counter for deterministic noise
     *  sampling. Driver-side `mulberry32(seed + sampleIndex)`
     *  produces the per-frame XYZ offset. INTERNAL — apps don't
     *  write this. */
    sampleIndex: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    intensity: number;
    maxOffset: number;
    maxRotation: number;
    decay: number;
    seed: number;
    sampleIndex: number;
}, {
    intensity?: number | undefined;
    maxOffset?: number | undefined;
    maxRotation?: number | undefined;
    decay?: number | undefined;
    seed?: number | undefined;
    sampleIndex?: number | undefined;
}>;
export type ScreenShake = z.infer<typeof ScreenShakeSchema>;
export declare const CharacterControllerAutostepSchema: z.ZodObject<{
    /** Max step height (meters) the character auto-climbs. */
    maxHeight: z.ZodNumber;
    /** Min free space (meters) required above the stepped-onto
     *  surface — prevents climbing into a low ceiling. */
    minWidth: z.ZodNumber;
    /** Whether the controller will also step over dynamic bodies.
     *  Usually false: dynamic obstacles should be pushed, not
     *  climbed. */
    includeDynamicBodies: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    maxHeight: number;
    minWidth: number;
    includeDynamicBodies: boolean;
}, {
    maxHeight: number;
    minWidth: number;
    includeDynamicBodies: boolean;
}>;
export type CharacterControllerAutostep = z.infer<typeof CharacterControllerAutostepSchema>;
export declare const CharacterControllerSchema: z.ZodObject<{
    /** Numerical-stability gap maintained between collider and
     *  obstacles. Rapier docs recommend ~0.01 (1 cm). */
    offset: z.ZodOptional<z.ZodNumber>;
    /** Max slope angle (radians) the character can climb. Above
     *  this, the controller slides off the slope.
     *  Default π/4 (45°). */
    maxSlopeClimbAngle: z.ZodOptional<z.ZodNumber>;
    /** Min slope angle (radians) before sliding starts even when
     *  trying to stand still. Default π/4. */
    minSlopeSlideAngle: z.ZodOptional<z.ZodNumber>;
    /** Auto-step config — null to disable explicitly. When
     *  undefined, the engine uses a sensible default
     *  ({ maxHeight: 0.3, minWidth: 0.1, includeDynamicBodies: false }). */
    autostep: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        /** Max step height (meters) the character auto-climbs. */
        maxHeight: z.ZodNumber;
        /** Min free space (meters) required above the stepped-onto
         *  surface — prevents climbing into a low ceiling. */
        minWidth: z.ZodNumber;
        /** Whether the controller will also step over dynamic bodies.
         *  Usually false: dynamic obstacles should be pushed, not
         *  climbed. */
        includeDynamicBodies: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        maxHeight: number;
        minWidth: number;
        includeDynamicBodies: boolean;
    }, {
        maxHeight: number;
        minWidth: number;
        includeDynamicBodies: boolean;
    }>>>;
    /** Snap-to-ground distance (meters) — when the character is
     *  grounded but lifts off briefly (running off a small lip),
     *  the controller pulls it back down if the gap is below this
     *  threshold. null disables explicitly. Default 0.2. */
    snapToGroundDistance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    /** When true, the controller pushes dynamic obstacles instead
     *  of stopping at them. Set true for "the character kicks the
     *  box" feel. Default false. */
    applyImpulsesToDynamics: z.ZodOptional<z.ZodBoolean>;
    /** Mass used for impulse resolution when
     *  `applyImpulsesToDynamics` is true. Default 1.0. */
    characterMass: z.ZodOptional<z.ZodNumber>;
    /** Runtime-written (system-set, NOT author-set): true when the
     *  KCC computed `grounded` on the LAST tick. Apps READ this
     *  for HUD readouts, jump gates, landing VFX. Authors who set
     *  it lose the write on the first tick. */
    grounded: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    grounded?: boolean | undefined;
    offset?: number | undefined;
    maxSlopeClimbAngle?: number | undefined;
    minSlopeSlideAngle?: number | undefined;
    autostep?: {
        maxHeight: number;
        minWidth: number;
        includeDynamicBodies: boolean;
    } | null | undefined;
    snapToGroundDistance?: number | null | undefined;
    applyImpulsesToDynamics?: boolean | undefined;
    characterMass?: number | undefined;
}, {
    grounded?: boolean | undefined;
    offset?: number | undefined;
    maxSlopeClimbAngle?: number | undefined;
    minSlopeSlideAngle?: number | undefined;
    autostep?: {
        maxHeight: number;
        minWidth: number;
        includeDynamicBodies: boolean;
    } | null | undefined;
    snapToGroundDistance?: number | null | undefined;
    applyImpulsesToDynamics?: boolean | undefined;
    characterMass?: number | undefined;
}>;
export type CharacterController = z.infer<typeof CharacterControllerSchema>;
export declare const GrabStateSchema: z.ZodObject<{
    /** Stable id of the currently-held entity, or null when empty. */
    heldEntityId: z.ZodNullable<z.ZodString>;
    /** Distance (meters) from the grabber's facing-forward origin
     *  to the guide point. Apps mutate via the imperative
     *  `adjustHoldDistance` op (clamped at system level). */
    holdDistance: z.ZodNumber;
    /** Quaternion offset applied to the held body's rotation,
     *  relative to the grabber's transform. Identity on
     *  grab-start; apps mutate via `rotateHeld`. */
    rotationOffset: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
    /** Snapshot of the held body's PRE-GRAB Rapier body type. The
     *  system restores this on release / weld. The field is
     *  `.optional()` so saves mid-grab serialize cleanly, but
     *  apps should treat it as transient — the system reconciles
     *  on the first post-load tick. */
    previousBodyType: z.ZodOptional<z.ZodEnum<["dynamic", "static", "kinematic"]>>;
}, "strip", z.ZodTypeAny, {
    heldEntityId: string | null;
    holdDistance: number;
    rotationOffset: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
}, {
    heldEntityId: string | null;
    holdDistance: number;
    rotationOffset: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
}>;
export type GrabState = z.infer<typeof GrabStateSchema>;
export declare const RecallableSchema: z.ZodObject<{
    /** Ring buffer capacity in samples (one sample per fixed tick).
     *  Default 360 (~6 s @ 60Hz). Larger = longer rewind window but
     *  more memory (13 floats × 4 bytes × capacity per entity, so
     *  default ≈ 18.7 KB). */
    capacity: z.ZodOptional<z.ZodNumber>;
    /** Runtime-written: `'idle'` while recording forward,
     *  `'playing'` while rewinding. Apps READ for HUD indicators
     *  ("Recall ready" / "Rewinding"). Authors who set the field
     *  lose the write on the first tick. */
    phase: z.ZodOptional<z.ZodEnum<["idle", "playing"]>>;
    /** Runtime-written snapshot of pre-recall body type. Restored
     *  at playback end via `restoreBodyTypeSafely`. */
    previousBodyType: z.ZodOptional<z.ZodEnum<["dynamic", "static", "kinematic"]>>;
}, "strip", z.ZodTypeAny, {
    capacity?: number | undefined;
    phase?: "idle" | "playing" | undefined;
    previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
}, {
    capacity?: number | undefined;
    phase?: "idle" | "playing" | undefined;
    previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
}>;
export type Recallable = z.infer<typeof RecallableSchema>;
export declare const AscendStateSchema: z.ZodObject<{
    /** `'idle'` until `startAscend` succeeds; `'rising'` while the
     *  body is being ticked upward. */
    phase: z.ZodEnum<["idle", "rising"]>;
    /** Runtime-written: world-Y the entity is rising toward.
     *  Undefined when `phase === 'idle'`. */
    targetY: z.ZodOptional<z.ZodNumber>;
    /** Vertical speed (m/s) during rise. Default 5. */
    riseSpeed: z.ZodOptional<z.ZodNumber>;
    /** Max upward shape-cast probe distance. Above this,
     *  `startAscend` fails with reason `'no-ceiling'`. Default 8. */
    maxAscendHeight: z.ZodOptional<z.ZodNumber>;
    /** Runtime-written snapshot for restore-on-arrival. */
    previousBodyType: z.ZodOptional<z.ZodEnum<["dynamic", "static", "kinematic"]>>;
}, "strip", z.ZodTypeAny, {
    phase: "idle" | "rising";
    previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    targetY?: number | undefined;
    riseSpeed?: number | undefined;
    maxAscendHeight?: number | undefined;
}, {
    phase: "idle" | "rising";
    previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    targetY?: number | undefined;
    riseSpeed?: number | undefined;
    maxAscendHeight?: number | undefined;
}>;
export type AscendState = z.infer<typeof AscendStateSchema>;
export declare const WaterVolumeSchema: z.ZodObject<{
    /** AABB bounds in the volume's local frame. When the entity
     *  also has a `transform`, the system offsets these by
     *  `transform.position`. Authors typically place the volume
     *  centred at the world origin with min.y < 0 < max.y so the
     *  water surface sits at y=0. */
    bounds: z.ZodObject<{
        min: z.ZodObject<{
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
        max: z.ZodObject<{
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
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
    }, {
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
    }>;
    /** Fluid density (kg/m³). Default 1000 (real water). Apps
     *  tweak to ~700 for dense fluids (lava feel without the
     *  heat), ~50 for low-buoyancy mist. */
    density: z.ZodOptional<z.ZodNumber>;
    /** Linear drag coefficient. Default 0.5. Higher = more
     *  viscous; bodies decelerate faster while submerged. */
    linearDrag: z.ZodOptional<z.ZodNumber>;
    /** Angular drag coefficient. Default 0.5. */
    angularDrag: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    bounds: {
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
    };
    density?: number | undefined;
    linearDrag?: number | undefined;
    angularDrag?: number | undefined;
}, {
    bounds: {
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
    };
    density?: number | undefined;
    linearDrag?: number | undefined;
    angularDrag?: number | undefined;
}>;
export type WaterVolume = z.infer<typeof WaterVolumeSchema>;
export declare const BuoyantSchema: z.ZodObject<{
    /** Body density (kg/m³). Default 600 (typical wood —
     *  comfortably floats in 1000 kg/m³ water at ~60% submerged). */
    density: z.ZodOptional<z.ZodNumber>;
    /** Per-body multiplier on the water volume's drag
     *  coefficients. Default 1.0. Apps tune for "slippery" feel
     *  (0.2) or "sticky mud" (3.0). */
    dragMultiplier: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    density?: number | undefined;
    dragMultiplier?: number | undefined;
}, {
    density?: number | undefined;
    dragMultiplier?: number | undefined;
}>;
export type Buoyant = z.infer<typeof BuoyantSchema>;
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
export declare const DecalSchema: z.ZodObject<{
    /** URL or path to the decal texture. Apps pass forge-emitted
     *  ids or raw URLs; the driver fetches via Three's TextureLoader
     *  with per-URL caching. */
    textureUrl: z.ZodString;
    /** Stable entity id of the target whose mesh receives the
     *  projection. */
    targetEntityId: z.ZodString;
    /** Projector origin in world-space. */
    projectorPosition: z.ZodObject<{
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
    /** Projector orientation as Euler XYZ in radians. */
    projectorRotation: z.ZodObject<{
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
    /** Box dimensions of the projector volume (world units). */
    size: z.ZodObject<{
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
    /** Opacity 0..1 applied uniformly. Default 1. */
    opacity: z.ZodOptional<z.ZodNumber>;
    /** When set, the decal auto-removes `lifetime` seconds after
     *  `spawnedAt`. */
    lifetime: z.ZodOptional<z.ZodNumber>;
    /** When true + `lifetime` is set, opacity ramps from `opacity`
     *  to 0 over the LAST 20% of the lifetime window. Default false
     *  (instant pop-out). */
    fadeOut: z.ZodOptional<z.ZodBoolean>;
    /** Runtime-written by `createDecalLifetimeSystem` on first tick
     *  after the decal entity appears. Apps should not author this. */
    spawnedAt: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    targetEntityId: string;
    textureUrl: string;
    projectorPosition: {
        x: number;
        y: number;
        z: number;
    };
    projectorRotation: {
        x: number;
        y: number;
        z: number;
    };
    size: {
        x: number;
        y: number;
        z: number;
    };
    opacity?: number | undefined;
    spawnedAt?: number | undefined;
    lifetime?: number | undefined;
    fadeOut?: boolean | undefined;
}, {
    targetEntityId: string;
    textureUrl: string;
    projectorPosition: {
        x: number;
        y: number;
        z: number;
    };
    projectorRotation: {
        x: number;
        y: number;
        z: number;
    };
    size: {
        x: number;
        y: number;
        z: number;
    };
    opacity?: number | undefined;
    spawnedAt?: number | undefined;
    lifetime?: number | undefined;
    fadeOut?: boolean | undefined;
}>;
export type Decal = z.infer<typeof DecalSchema>;
/** Marker slot — entities with `decalTarget: true` auto-register
 *  their renderable Mesh in the per-canvas `DecalTargetRegistry`
 *  so decals can resolve them. Apps mark walls / floors / props /
 *  static characters that should accept decals. */
export declare const DecalTargetSchema: z.ZodBoolean;
export type DecalTarget = z.infer<typeof DecalTargetSchema>;
/** One LOD level. `distance` is the SQUARED distance from camera
 *  at which this level activates. Squared distance avoids per-frame
 *  `sqrt`; apps authoring in meters multiply by themselves
 *  (`10² = 100`, `25² = 625`). */
export declare const LodLevelSchema: z.ZodObject<{
    distance: z.ZodNumber;
    modelId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    modelId: string;
    distance: number;
}, {
    modelId: string;
    distance: number;
}>;
export type LodLevel = z.infer<typeof LodLevelSchema>;
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
export declare const LodSchema: z.ZodObject<{
    levels: z.ZodArray<z.ZodObject<{
        distance: z.ZodNumber;
        modelId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        modelId: string;
        distance: number;
    }, {
        modelId: string;
        distance: number;
    }>, "many">;
    /** Hysteresis fraction in [0, 0.5]. Prevents level-boundary
     *  thrashing when an entity sits exactly on a transition. */
    hysteresis: z.ZodOptional<z.ZodNumber>;
    /** Runtime-written by the LOD system each tick. Apps should
     *  treat as read-only. */
    activeIndex: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    levels: {
        modelId: string;
        distance: number;
    }[];
    hysteresis?: number | undefined;
    activeIndex?: number | undefined;
}, {
    levels: {
        modelId: string;
        distance: number;
    }[];
    hysteresis?: number | undefined;
    activeIndex?: number | undefined;
}>;
export type Lod = z.infer<typeof LodSchema>;
export declare const TopDownCharacterSchema: z.ZodObject<{
    /** Move speed in meters/second. Apps tune per character
     *  archetype: 5 for a JRPG overworld walker, 8 for an
     *  ARPG, 12+ for a top-down shooter. */
    speed: z.ZodDefault<z.ZodNumber>;
    /** When true, the system rotates the entity's transform to
     *  face the movement direction (smoothed via `rotationDamping`).
     *  When false, transform.rotation is left untouched — typical
     *  for shooters that aim independent of movement. */
    rotateToFacing: z.ZodDefault<z.ZodBoolean>;
    /** Exponential rotation smoothing factor. Higher = snappier;
     *  lower = laggier. 10 reads "ARPG-snappy" for most movement
     *  speeds. */
    rotationDamping: z.ZodDefault<z.ZodNumber>;
    /** Per-frame movement intent in world XZ. Apps write this
     *  every frame from input, AI, or scripted control. The
     *  system reads, never writes. Magnitudes > 1 are clamped
     *  via vector normalization so diagonal input doesn't
     *  exceed `speed`. */
    intent: z.ZodDefault<z.ZodObject<{
        x: z.ZodDefault<z.ZodNumber>;
        z: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        z: number;
    }, {
        x?: number | undefined;
        z?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    speed: number;
    rotateToFacing: boolean;
    rotationDamping: number;
    intent: {
        x: number;
        z: number;
    };
}, {
    speed?: number | undefined;
    rotateToFacing?: boolean | undefined;
    rotationDamping?: number | undefined;
    intent?: {
        x?: number | undefined;
        z?: number | undefined;
    } | undefined;
}>;
export type TopDownCharacter = z.infer<typeof TopDownCharacterSchema>;
export declare const TimescaleEasingCurveSchema: z.ZodEnum<["linear", "easeInQuad", "easeOutQuad", "easeInOutCubic"]>;
export type TimescaleEasingCurve = z.infer<typeof TimescaleEasingCurveSchema>;
export declare const TimescaleEaseStateSchema: z.ZodObject<{
    /** Scale at the moment the ease was started. */
    fromScale: z.ZodNumber;
    /** Scale the ease is interpolating toward. */
    toScale: z.ZodNumber;
    /** Real-time milliseconds elapsed since the ease started. Advanced
     *  by `tickTimescale(world, realDtSeconds)` with REAL dt, not
     *  scaled dt — the ramp finishes in wall-clock time, not in
     *  world-time. */
    currentMs: z.ZodNumber;
    /** Total real-time milliseconds the ease occupies. */
    durationMs: z.ZodNumber;
    /** Interpolation curve. `'easeOutQuad'` is the canonical bullet-
     *  time choice (fast snap into slow-mo, gentle settle). */
    curve: z.ZodEnum<["linear", "easeInQuad", "easeOutQuad", "easeInOutCubic"]>;
}, "strip", z.ZodTypeAny, {
    fromScale: number;
    toScale: number;
    currentMs: number;
    durationMs: number;
    curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
}, {
    fromScale: number;
    toScale: number;
    currentMs: number;
    durationMs: number;
    curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
}>;
export type TimescaleEaseState = z.infer<typeof TimescaleEaseStateSchema>;
export declare const WorldTimescaleSchema: z.ZodObject<{
    /** Currently applied global time-dilation factor. Apps multiply
     *  their per-tick dt by this when advancing time-coupled
     *  simulation. `1` = real-time; `0.3` = slo-mo; `2` = fast-
     *  forward. Strictly positive — the package rejects `0` (which
     *  would freeze the world forever) and negative values. */
    scale: z.ZodNumber;
    /** In-flight ease metadata, present only while an `easeGlobalScale`
     *  call is animating toward its target. `tickTimescale` clears it
     *  on completion. */
    ease: z.ZodOptional<z.ZodObject<{
        /** Scale at the moment the ease was started. */
        fromScale: z.ZodNumber;
        /** Scale the ease is interpolating toward. */
        toScale: z.ZodNumber;
        /** Real-time milliseconds elapsed since the ease started. Advanced
         *  by `tickTimescale(world, realDtSeconds)` with REAL dt, not
         *  scaled dt — the ramp finishes in wall-clock time, not in
         *  world-time. */
        currentMs: z.ZodNumber;
        /** Total real-time milliseconds the ease occupies. */
        durationMs: z.ZodNumber;
        /** Interpolation curve. `'easeOutQuad'` is the canonical bullet-
         *  time choice (fast snap into slow-mo, gentle settle). */
        curve: z.ZodEnum<["linear", "easeInQuad", "easeOutQuad", "easeInOutCubic"]>;
    }, "strip", z.ZodTypeAny, {
        fromScale: number;
        toScale: number;
        currentMs: number;
        durationMs: number;
        curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
    }, {
        fromScale: number;
        toScale: number;
        currentMs: number;
        durationMs: number;
        curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
    }>>;
}, "strip", z.ZodTypeAny, {
    scale: number;
    ease?: {
        fromScale: number;
        toScale: number;
        currentMs: number;
        durationMs: number;
        curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
    } | undefined;
}, {
    scale: number;
    ease?: {
        fromScale: number;
        toScale: number;
        currentMs: number;
        durationMs: number;
        curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
    } | undefined;
}>;
export type WorldTimescale = z.infer<typeof WorldTimescaleSchema>;
export declare const TimeDecoupledSchema: z.ZodObject<{
    /** Multiplier applied INSTEAD OF the global scale for the
     *  carrying entity. Default `1.0` (full real-time during
     *  dilation). Strictly positive. */
    scale: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    scale: number;
}, {
    scale?: number | undefined;
}>;
export type TimeDecoupled = z.infer<typeof TimeDecoupledSchema>;
//# sourceMappingURL=components.d.ts.map