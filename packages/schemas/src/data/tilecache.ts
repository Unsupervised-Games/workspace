// TileCache NavMesh shapes — forge-emitted bundle manifest +
// runtime obstacle specs + result types.
//
// TileCache is recast-navigation's runtime-modifiable navmesh:
// per-cell compressed layer data plus a queue of obstacle
// add / remove requests that re-bake affected cells on
// `tileCache.update(navMesh)`. Unlike the streaming variant,
// the whole world's bake lives in ONE serialized bundle —
// the recast library's `exportTileCache` / `importTileCache`
// pair operates on a single `Uint8Array`. Per-cell access
// happens through the live `TileCache` handle at runtime, not
// through per-cell network fetches.
//
// Two distinct shapes live here:
//
//   1. MANIFEST — forge emits `TileCacheManifestSchema` as a
//      typed const literal in `lib/generated/assets.ts` under
//      `TILECACHE_MANIFESTS[<worldId>]`. Apps construct
//      `TileCacheNavMesh.fromManifest(...)` from it.
//
//   2. OBSTACLE SPEC — `TileCacheObstacleSpecSchema` is the
//      runtime add-obstacle request shape. Save / load
//      serializers persist this array; replay logs record
//      add / remove pairs against the obstacle handle.
//
// The author-time SOURCE shape lives in `./navmesh.ts` — the
// same `NavMeshSourceSchema` (now with an optional
// `format: 'solo' | 'tilecache'` discriminant) drives both
// pipelines. Apps that need runtime obstacles set
// `format: 'tilecache'`; everything else inherits the solo /
// streaming path.

import { z } from 'zod';
import { NavMeshBakeConfigSchema } from './navmesh.js';

/** Author-time obstacle shape discriminant. v1 supports
 *  cylinder + box because that's what recast's TileCache
 *  natively handles; arbitrary convex hulls need V-HACD
 *  decomposition upstream (deferred to OUT_OF_SCOPE). */
export const TileCacheObstacleKindSchema = z.enum(['cylinder', 'box']);
export type TileCacheObstacleKind = z.infer<typeof TileCacheObstacleKindSchema>;

/** Discriminated obstacle spec. Apps construct these for
 *  `tileCacheNavMesh.addObstacle(spec)` calls; save /
 *  load + replay both round-trip this shape. */
export const TileCacheObstacleSpecSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('cylinder'),
    /** World-space center (XZ); y is the obstacle's bottom. */
    position: z.tuple([z.number(), z.number(), z.number()]),
    /** Cylinder radius in world units. */
    radius: z.number().positive(),
    /** Cylinder height in world units. The obstacle extends
     *  from `position.y` to `position.y + height`. */
    height: z.number().positive(),
  }),
  z.object({
    kind: z.literal('box'),
    /** World-space center of the box. */
    position: z.tuple([z.number(), z.number(), z.number()]),
    /** Half-extents along each axis. Box spans
     *  `position ± halfExtents`. */
    halfExtents: z.tuple([
      z.number().positive(),
      z.number().positive(),
      z.number().positive(),
    ]),
    /** Y-axis rotation in radians. Recast's TileCache
     *  supports rotated boxes natively; cylinder rotation
     *  is rotationally symmetric and ignored. */
    rotationY: z.number().default(0),
  }),
]);
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
export const TileCacheManifestSchema = z.object({
  /** App-defined world id. Forge derives this from the
   *  source directory name. */
  worldId: z.string().min(1),
  /** Cell size in world units (same for X and Z; recast's
   *  TileCache uses square cells). */
  tileSize: z.number().positive(),
  /** World-space bounds of the tiled region. */
  boundsMin: z.tuple([z.number(), z.number(), z.number()]),
  boundsMax: z.tuple([z.number(), z.number(), z.number()]),
  /** Public-relative path to the serialized bundle. Apps
   *  fetch this once at construction; obstacle add /
   *  remove modifies the in-memory bundle, never the
   *  on-disk file. */
  bundlePath: z.string().min(1),
  /** dtNavMesh capacity hints captured at bake time. */
  maxTiles: z.number().int().positive(),
  /** dtTileCache capacity hint — the maximum number of
   *  obstacles the runtime can hold at once. Apps that
   *  need more re-bake with a higher value. */
  maxObstacles: z.number().int().positive(),
  /** How many "floors" each cell is expected to have at
   *  bake time. v1 always 1 (flat worlds). */
  expectedLayersPerTile: z.number().int().positive(),
  /** Recast bake config snapshot (diagnostics + agent-
   *  vs-bake size compat). Identical shape to the solo /
   *  streaming manifest. */
  config: NavMeshBakeConfigSchema,
  /** Tile-grid enumeration. Each entry is a (tx, tz) cell
   *  the bake produced walkable data for — used for HUD
   *  overlays + boundary computations. The actual cell
   *  data lives in `bundlePath`. */
  tiles: z.array(
    z.object({
      tx: z.number().int(),
      tz: z.number().int(),
    }),
  ),
});
export type TileCacheManifest = z.infer<typeof TileCacheManifestSchema>;

/** Reasons an `addObstacle` call can be rejected. */
export const TileCacheObstacleRejectionSchema = z.enum([
  'navmesh-disposed',
  'recast-rejected',
  'capacity-exceeded',
]);
export type TileCacheObstacleRejection = z.infer<
  typeof TileCacheObstacleRejectionSchema
>;

/** Discriminated result for `TileCacheNavMesh.addObstacle`.
 *  Mirrors `TileLoadResult` / `BindingChangeResult` /
 *  `AchievementUnlockResult`. */
export const TileCacheObstacleResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** Stable handle for `removeObstacle(handle)`. Numeric
     *  for cheap save-game serialization. Handles are
     *  monotonically issued and re-used after eviction. */
    handle: z.number().int().nonnegative(),
  }),
  z.object({
    ok: z.literal(false),
    reason: TileCacheObstacleRejectionSchema,
    message: z.string(),
  }),
]);
export type TileCacheObstacleResult = z.infer<
  typeof TileCacheObstacleResultSchema
>;
