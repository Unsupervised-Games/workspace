import { z } from 'zod';
/** Author-time obstacle shape discriminant. v1 supports
 *  cylinder + box because that's what recast's TileCache
 *  natively handles; arbitrary convex hulls need V-HACD
 *  decomposition upstream (deferred to OUT_OF_SCOPE). */
export declare const TileCacheObstacleKindSchema: z.ZodEnum<["cylinder", "box"]>;
export type TileCacheObstacleKind = z.infer<typeof TileCacheObstacleKindSchema>;
/** Discriminated obstacle spec. Apps construct these for
 *  `tileCacheNavMesh.addObstacle(spec)` calls; save /
 *  load + replay both round-trip this shape. */
export declare const TileCacheObstacleSpecSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"cylinder">;
    /** World-space center (XZ); y is the obstacle's bottom. */
    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    /** Cylinder radius in world units. */
    radius: z.ZodNumber;
    /** Cylinder height in world units. The obstacle extends
     *  from `position.y` to `position.y + height`. */
    height: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: "cylinder";
    position: [number, number, number];
    radius: number;
    height: number;
}, {
    kind: "cylinder";
    position: [number, number, number];
    radius: number;
    height: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"box">;
    /** World-space center of the box. */
    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    /** Half-extents along each axis. Box spans
     *  `position ± halfExtents`. */
    halfExtents: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    /** Y-axis rotation in radians. Recast's TileCache
     *  supports rotated boxes natively; cylinder rotation
     *  is rotationally symmetric and ignored. */
    rotationY: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    kind: "box";
    position: [number, number, number];
    halfExtents: [number, number, number];
    rotationY: number;
}, {
    kind: "box";
    position: [number, number, number];
    halfExtents: [number, number, number];
    rotationY?: number | undefined;
}>]>;
export type TileCacheObstacleSpec = z.infer<typeof TileCacheObstacleSpecSchema>;
/** Forge-emitted manifest for a TileCache-format world.
 *
 *  Unlike `NavMeshTileManifestSchema` (per-tile binary
 *  paths), TileCache serialization is bundled — the whole
 *  world's navmesh + tile cache lives in one `bundlePath`
 *  binary. The `tiles` array enumerates which (tx, tz)
 *  cells the bundle contains walkable data for, kept here
 *  for HUD / debug overlays + sanity checks against the
 *  cell grid. */
export declare const TileCacheManifestSchema: z.ZodObject<{
    /** App-defined world id. Forge derives this from the
     *  source directory name. */
    worldId: z.ZodString;
    /** Cell size in world units (same for X and Z; recast's
     *  TileCache uses square cells). */
    tileSize: z.ZodNumber;
    /** World-space bounds of the tiled region. */
    boundsMin: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    boundsMax: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    /** Public-relative path to the serialized bundle. Apps
     *  fetch this once at construction; obstacle add /
     *  remove modifies the in-memory bundle, never the
     *  on-disk file. */
    bundlePath: z.ZodString;
    /** dtNavMesh capacity hints captured at bake time. */
    maxTiles: z.ZodNumber;
    /** dtTileCache capacity hint — the maximum number of
     *  obstacles the runtime can hold at once. Apps that
     *  need more re-bake with a higher value. */
    maxObstacles: z.ZodNumber;
    /** How many "floors" each cell is expected to have at
     *  bake time. v1 always 1 (flat worlds). */
    expectedLayersPerTile: z.ZodNumber;
    /** Recast bake config snapshot (diagnostics + agent-
     *  vs-bake size compat). Identical shape to the solo /
     *  streaming manifest. */
    config: z.ZodObject<{
        walkableRadius: z.ZodNumber;
        walkableHeight: z.ZodNumber;
        walkableClimb: z.ZodNumber;
        walkableSlopeAngle: z.ZodNumber;
        cellSize: z.ZodNumber;
        cellHeight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        cellSize: number;
        walkableRadius: number;
        walkableHeight: number;
        walkableClimb: number;
        walkableSlopeAngle: number;
        cellHeight: number;
    }, {
        cellSize: number;
        walkableRadius: number;
        walkableHeight: number;
        walkableClimb: number;
        walkableSlopeAngle: number;
        cellHeight: number;
    }>;
    /** Tile-grid enumeration. Each entry is a (tx, tz) cell
     *  the bake produced walkable data for — used for HUD
     *  overlays + boundary computations. The actual cell
     *  data lives in `bundlePath`. */
    tiles: z.ZodArray<z.ZodObject<{
        tx: z.ZodNumber;
        tz: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tx: number;
        tz: number;
    }, {
        tx: number;
        tz: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tiles: {
        tx: number;
        tz: number;
    }[];
    worldId: string;
    tileSize: number;
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
    maxTiles: number;
    config: {
        cellSize: number;
        walkableRadius: number;
        walkableHeight: number;
        walkableClimb: number;
        walkableSlopeAngle: number;
        cellHeight: number;
    };
    maxObstacles: number;
    expectedLayersPerTile: number;
    bundlePath: string;
}, {
    tiles: {
        tx: number;
        tz: number;
    }[];
    worldId: string;
    tileSize: number;
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
    maxTiles: number;
    config: {
        cellSize: number;
        walkableRadius: number;
        walkableHeight: number;
        walkableClimb: number;
        walkableSlopeAngle: number;
        cellHeight: number;
    };
    maxObstacles: number;
    expectedLayersPerTile: number;
    bundlePath: string;
}>;
export type TileCacheManifest = z.infer<typeof TileCacheManifestSchema>;
/** Reasons an `addObstacle` call can be rejected. */
export declare const TileCacheObstacleRejectionSchema: z.ZodEnum<["navmesh-disposed", "recast-rejected", "capacity-exceeded"]>;
export type TileCacheObstacleRejection = z.infer<typeof TileCacheObstacleRejectionSchema>;
/** Discriminated result for `TileCacheNavMesh.addObstacle`.
 *  Mirrors `TileLoadResult` / `BindingChangeResult` /
 *  `AchievementUnlockResult`. */
export declare const TileCacheObstacleResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** Stable handle for `removeObstacle(handle)`. Numeric
     *  for cheap save-game serialization. Handles are
     *  monotonically issued and re-used after eviction. */
    handle: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    ok: true;
    handle: number;
}, {
    ok: true;
    handle: number;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["navmesh-disposed", "recast-rejected", "capacity-exceeded"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "navmesh-disposed" | "recast-rejected" | "capacity-exceeded";
}, {
    message: string;
    ok: false;
    reason: "navmesh-disposed" | "recast-rejected" | "capacity-exceeded";
}>]>;
export type TileCacheObstacleResult = z.infer<typeof TileCacheObstacleResultSchema>;
//# sourceMappingURL=tilecache.d.ts.map