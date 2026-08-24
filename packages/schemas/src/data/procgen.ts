// Procgen schemas.
//
// Three independent primitives, all replay-deterministic via a
// seeded RNG, all pure-function input → output:
//
//   1. **Wave Function Collapse** (`waveFunctionCollapse`) —
//      fills a 2D tile grid by per-direction adjacency rules.
//      Used for terrain biomes, dungeon walls/floors, sky
//      decoration.
//   2. **Room graph** (`generateRoomGraph`) — stitches room
//      templates into a top-level dungeon layout with
//      door-matching constraints. Used for Hades chambers,
//      classic dungeon crawlers, metroidvania room maps.
//   3. **BSP dungeon** (`generateBspDungeon`) — binary space
//      partition for classic roguelike dungeons. Used for
//      Rogue / Brogue / ADOM / Cogmind-shape layouts.
//
// All three produce plain JSON-shaped output that downstream
// systems consume. Composition helpers in
// `@unsupervised/features/procgen` bridge to `@unsupervised/features/grid`
// (`populateGridFromWfc`) and `@unsupervised/features/ai`-shape
// NavMesh sources (`navMeshSourceFromBsp`).

import { z } from 'zod';

// ───────────────────────────────────────────────────────────
// Wave Function Collapse
// ───────────────────────────────────────────────────────────

/** Per-direction adjacency rules for one tile. Each list
 *  enumerates tile ids that MAY be placed adjacent to this
 *  tile in that direction.
 *
 *  **Pair semantics:** A and B are compatible neighbors in
 *  direction D iff BOTH `B ∈ A.edges[D]` AND `A ∈ B.edges[~D]`
 *  (where `~D` is the opposite direction). The WFC algorithm
 *  intersects the two views at setup, so authoring only one
 *  side of a pair effectively removes the pair from the
 *  permitted set. Apps that want a pair allowed MUST author
 *  it on BOTH tiles' edges. */
export const WfcEdgesSchema = z.object({
  north: z.array(z.string()),
  south: z.array(z.string()),
  east: z.array(z.string()),
  west: z.array(z.string()),
});
export type WfcEdges = z.infer<typeof WfcEdgesSchema>;

/** One tile in a WFC set. */
export const WfcTileSchema = z.object({
  /** Stable id. Surfaces in the result grid + propagation
   *  events. */
  id: z.string().min(1),
  /** Adjacency rules — see `WfcEdges`. */
  edges: WfcEdgesSchema,
  /** Selection weight. Higher = more frequent placement when
   *  multiple tiles remain valid for a cell. Default 1. */
  weight: z.number().nonnegative().default(1),
});
export type WfcTile = z.infer<typeof WfcTileSchema>;

/** A complete WFC tile set. The set is the algorithm's
 *  authoritative input — apps tweak adjacency rules + weights
 *  in this shape and re-roll. */
export const WfcSetSchema = z.object({
  tiles: z.array(WfcTileSchema).min(1),
});
export type WfcSet = z.infer<typeof WfcSetSchema>;

/** Discriminated result of `waveFunctionCollapse`. Apps
 *  pattern-match on `ok` to distinguish success from
 *  contradiction-fallback. The contradiction branch carries a
 *  partial grid for diagnostic rendering ("here's where the
 *  algorithm gave up"). */
export const WfcResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** 2D grid of tile ids, indexed `[y][x]`. */
    grid: z.array(z.array(z.string())),
    /** Number of propagation iterations the algorithm ran.
     *  Useful for performance diagnostics. */
    iterations: z.number().int().nonnegative(),
  }),
  z.object({
    ok: z.literal(false),
    reason: z.literal('contradiction'),
    /** Partial grid with `null` for cells that didn't collapse
     *  before the contradiction. */
    partialGrid: z.array(z.array(z.string().nullable())),
    /** Coordinates of the cell where the contradiction was
     *  detected (its possibility set went empty during
     *  propagation). */
    contradictionAt: z.object({ x: z.number().int(), y: z.number().int() }),
    /** Iteration count before failure. */
    iterations: z.number().int().nonnegative(),
  }),
]);
export type WfcResult = z.infer<typeof WfcResultSchema>;

// ───────────────────────────────────────────────────────────
// Room Graph
// ───────────────────────────────────────────────────────────

/** Per-side door offsets. Each list contains tile-coord
 *  offsets along that side (0 = the corner closest to the
 *  template's origin). E.g., a 5-wide room with `north: [2]`
 *  has one north door at the third column. */
export const RoomDoorsSchema = z.object({
  north: z.array(z.number().int().nonnegative()),
  south: z.array(z.number().int().nonnegative()),
  east: z.array(z.number().int().nonnegative()),
  west: z.array(z.number().int().nonnegative()),
});
export type RoomDoors = z.infer<typeof RoomDoorsSchema>;

/** One room template. The graph generator places rotated
 *  copies of these templates into a layout, matching doors. */
export const RoomTemplateSchema = z.object({
  id: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  doors: RoomDoorsSchema,
  /** Optional tags for app-side filtering. The generator
   *  ignores these; apps post-process the result to mark
   *  certain rooms as "boss" / "treasure" / "entry". */
  tags: z.array(z.string()).optional(),
});
export type RoomTemplate = z.infer<typeof RoomTemplateSchema>;

/** Graph specification — the high-level shape the generator
 *  targets. */
export const RoomGraphSpecSchema = z.object({
  /** Template id placed at the root. Must exist in the
   *  templates list. */
  rootTemplateId: z.string().min(1),
  /** Maximum number of additional rooms to place. The
   *  generator stops when this is hit OR when no valid
   *  placement exists. */
  maxRooms: z.number().int().positive(),
  /** Maximum branching factor per room (how many neighbors
   *  to attempt placing). */
  maxBranches: z.number().int().positive().default(4),
  /** Optional list of template ids to prefer for non-root
   *  rooms. Empty = all templates eligible. */
  branchTemplates: z.array(z.string()).optional(),
});
export type RoomGraphSpec = z.infer<typeof RoomGraphSpecSchema>;

/** A placed room in the result graph. */
export const PlacedRoomSchema = z.object({
  /** Template id from the input set. */
  templateId: z.string(),
  /** World-space tile origin (top-left of the rotated room's
   *  bounding box). */
  x: z.number().int(),
  y: z.number().int(),
  /** Rotation in 90° increments. 0 = identity, 1 = 90° CW,
   *  2 = 180°, 3 = 270° CW. */
  rotation: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  /** Effective width AFTER rotation. For rotation 1/3 this is
   *  the template's `height`; for 0/2 it's `width`. */
  width: z.number().int().positive(),
  /** Effective height AFTER rotation. */
  height: z.number().int().positive(),
});
export type PlacedRoom = z.infer<typeof PlacedRoomSchema>;

/** A connection between two placed rooms via a matched door
 *  pair. */
export const RoomConnectionSchema = z.object({
  fromRoomIndex: z.number().int().nonnegative(),
  toRoomIndex: z.number().int().nonnegative(),
  /** Direction from the FROM room. The TO room is reached
   *  by walking through this side's door. */
  fromSide: z.enum(['north', 'south', 'east', 'west']),
});
export type RoomConnection = z.infer<typeof RoomConnectionSchema>;

export const RoomGraphResultSchema = z.object({
  rooms: z.array(PlacedRoomSchema),
  connections: z.array(RoomConnectionSchema),
  /** Bounding box of the full layout in tile coords. Useful
   *  for renderer / pathfinder sizing. */
  bounds: z.object({
    minX: z.number().int(),
    minY: z.number().int(),
    maxX: z.number().int(),
    maxY: z.number().int(),
  }),
});
export type RoomGraphResult = z.infer<typeof RoomGraphResultSchema>;

// ───────────────────────────────────────────────────────────
// BSP Dungeon
// ───────────────────────────────────────────────────────────

export const BspBoundsSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type BspBounds = z.infer<typeof BspBoundsSchema>;

/** Axis-aligned rectangle in tile coords. Used for both rooms
 *  + corridors in the BSP result. */
export const BspRectSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
});
export type BspRect = z.infer<typeof BspRectSchema>;

export const BspDungeonResultSchema = z.object({
  /** Placed rooms in BSP-leaf order. */
  rooms: z.array(BspRectSchema),
  /** Corridor segments (each a rectangle of `corridorWidth`
   *  thickness) that connect siblings + cousins back up the
   *  BSP tree. */
  corridors: z.array(BspRectSchema),
  /** The original bounds (echo for renderer convenience). */
  bounds: BspBoundsSchema,
});
export type BspDungeonResult = z.infer<typeof BspDungeonResultSchema>;
