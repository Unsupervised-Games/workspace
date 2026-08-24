// Streaming NavMesh shapes — forge-emitted tile manifest +
// runtime load result types + author-time geometry source.
//
// Two distinct shapes live here:
//
//   1. SOURCE — what apps put under
//      `assets-raw/navmeshes/<world>/world.json`:
//      `NavMeshSourceSchema` (geometry + bake config).
//      Forge reads this to drive `generateTileNavMeshData`.
//
//   2. MANIFEST — what forge emits as a typed const literal in
//      `lib/generated/assets.ts`: `NavMeshTileManifestSchema`.
//      Apps construct `StreamingNavMesh.fromManifest(...)` from
//      this at runtime.
//
// The MANIFEST is the runtime contract — `@unsupervised/ai` consumes it
// to init the tiled `NavMesh` and load tiles lazily as the
// camera streams across the world.
import { z } from 'zod';
/** Recast bake config snapshot. The runtime stores this for
 *  diagnostics + version-compat checks ("does the streaming
 *  navmesh's walkableRadius match the agent's radius?"). */
export const NavMeshBakeConfigSchema = z.object({
    walkableRadius: z.number().positive(),
    walkableHeight: z.number().positive(),
    walkableClimb: z.number().nonnegative(),
    walkableSlopeAngle: z.number().nonnegative().max(90),
    cellSize: z.number().positive(),
    cellHeight: z.number().positive(),
});
/** Per-tile binary asset reference, forge-emitted. */
export const NavMeshTileEntrySchema = z.object({
    /** Tile grid X. Integer; can be negative. */
    tx: z.number().int(),
    /** Tile grid Z. Integer; can be negative. (Y is up; tiles
     *  span the XZ plane.) */
    tz: z.number().int(),
    /** Public-relative path to the per-tile binary, e.g.
     *  `'/navmesh/grassland/0_0.bin'`. Apps fetch this at
     *  runtime; the path is server-side relative-to-public so
     *  it works in both Next.js dev and static-export builds. */
    path: z.string().min(1),
});
/** Forge-emitted manifest for a tiled world. The `tiles`
 *  array enumerates ONLY tiles that have walkable surfaces
 *  (forge skips empty tiles); apps that ask for an unbaked
 *  tile coord get an `unknown-tile` rejection from
 *  `loadTile`. */
export const NavMeshTileManifestSchema = z.object({
    /** App-defined world id (e.g. `'grassland'`). Forge derives
     *  this from the source directory name. */
    worldId: z.string().min(1),
    /** Tile size in world units. Same for X and Z. */
    tileSize: z.number().positive(),
    /** World-space bounds of the tiled region. Used by the
     *  streaming system to clip view-distance computations. */
    boundsMin: z.tuple([z.number(), z.number(), z.number()]),
    boundsMax: z.tuple([z.number(), z.number(), z.number()]),
    /** dtNavMesh capacity hints. Forge picks safe values based
     *  on tile count + per-tile poly count. */
    maxTiles: z.number().int().positive(),
    maxPolys: z.number().int().positive(),
    config: NavMeshBakeConfigSchema,
    tiles: z.array(NavMeshTileEntrySchema),
});
// ---------------------------------------------------------------------------
// Runtime result types
// ---------------------------------------------------------------------------
/** Reasons a `loadTile` call can be rejected. */
export const TileLoadRejectionSchema = z.enum([
    'unknown-tile', // (tx, tz) not in the manifest
    'fetch-failed', // network or 404 on the binary path
    'parse-failed', // bytes corrupted / not a valid recast tile
    'add-tile-failed', // recast rejected addTile (capacity, conflict)
    'navmesh-disposed', // navmesh was disposed before/during the load
]);
/** Discriminated result for `StreamingNavMesh.loadTile`.
 *  Mirrors `BindingChangeResult` / `AchievementUnlockResult` /
 *  `SettingsApplyResult`. */
export const TileLoadResultSchema = z.discriminatedUnion('ok', [
    z.object({
        ok: z.literal(true),
        tx: z.number().int(),
        tz: z.number().int(),
        /** True when this call actually loaded the tile. False on
         *  the idempotent already-loaded path. */
        fresh: z.boolean(),
    }),
    z.object({
        ok: z.literal(false),
        tx: z.number().int(),
        tz: z.number().int(),
        reason: TileLoadRejectionSchema,
        message: z.string(),
    }),
]);
// ---------------------------------------------------------------------------
// Author-time source schema
// ---------------------------------------------------------------------------
/** AABB triangle source — what apps put in `world.json`.
 *  Forge converts this into the positions / indices arrays
 *  Recast's bake helpers expect. v1 supports only axis-aligned
 *  boxes; non-axis-aligned geometry needs a GLB-source path
 *  (deferred to OUT_OF_SCOPE). */
export const NavMeshGeometryShapeSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('box'),
        /** World-space min corner. */
        min: z.tuple([z.number(), z.number(), z.number()]),
        /** World-space max corner. */
        max: z.tuple([z.number(), z.number(), z.number()]),
    }),
]);
/** Bake-format discriminant. Determines which forge pipeline
 *  branch + which runtime navmesh class consumes the output:
 *
 *   - `'solo'` (default) — per-tile binaries baked via
 *     `generateTileNavMeshData`; runtime constructs a
 *     `StreamingNavMesh` and streams tiles in / out by view
 *     distance. The world is STATIC after bake — no runtime
 *     obstacle support.
 *   - `'tilecache'` — single bundle baked via
 *     `generateTileCache` + `exportTileCache`; runtime
 *     constructs a `TileCacheNavMesh` and supports
 *     `addObstacle` / `removeObstacle` with per-tick
 *     re-bake. Required for Skyrim-style "destroyed wall
 *     opens new path" gameplay.
 *
 *  Apps that don't set `format` get `'solo'` for backwards
 *  compatibility with the original streaming pipeline. */
export const NavMeshBakeFormatSchema = z.enum(['solo', 'tilecache']);
/** A single world's source description. Lives at
 *  `assets-raw/navmeshes/<world-id>/world.json`. Forge derives
 *  `worldId` from the directory name. */
export const NavMeshSourceSchema = z.object({
    /** Bake format — `'solo'` (per-tile streaming) or
     *  `'tilecache'` (single-bundle with runtime obstacles).
     *  Defaults to `'solo'` so existing world.json sources
     *  continue to bake unchanged. */
    format: NavMeshBakeFormatSchema.default('solo'),
    /** Tile size in world units. Same for X and Z. */
    tileSize: z.number().positive(),
    /** World-space bounds of the tiled region. */
    boundsMin: z.tuple([z.number(), z.number(), z.number()]),
    boundsMax: z.tuple([z.number(), z.number(), z.number()]),
    /** Walkable geometry (ground plane + obstacles). */
    geometry: z.object({
        /** Required ground shape (the floor agents walk on). */
        ground: NavMeshGeometryShapeSchema,
        /** Optional obstacles that block walkability. */
        obstacles: z.array(NavMeshGeometryShapeSchema).default([]),
    }),
    /** Optional bake config; forge fills in defaults per-field
     *  when omitted (see `NavMeshBakeConfigSchema`). */
    config: NavMeshBakeConfigSchema.partial().optional(),
    /** Maximum number of runtime obstacles the TileCache can
     *  hold at once. Only used when `format: 'tilecache'`.
     *  Defaults to 128. */
    maxObstacles: z.number().int().positive().default(128),
    /** How many "floors" each cell should accommodate.
     *  Only used when `format: 'tilecache'`. Defaults to 1
     *  (flat worlds); apps with overlapping walkable
     *  surfaces (catwalks, multi-storey interiors) bump
     *  this higher. */
    expectedLayersPerTile: z.number().int().positive().default(1),
});
//# sourceMappingURL=navmesh.js.map