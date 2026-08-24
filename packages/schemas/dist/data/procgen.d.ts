import { z } from 'zod';
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
export declare const WfcEdgesSchema: z.ZodObject<{
    north: z.ZodArray<z.ZodString, "many">;
    south: z.ZodArray<z.ZodString, "many">;
    east: z.ZodArray<z.ZodString, "many">;
    west: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    north: string[];
    south: string[];
    east: string[];
    west: string[];
}, {
    north: string[];
    south: string[];
    east: string[];
    west: string[];
}>;
export type WfcEdges = z.infer<typeof WfcEdgesSchema>;
/** One tile in a WFC set. */
export declare const WfcTileSchema: z.ZodObject<{
    /** Stable id. Surfaces in the result grid + propagation
     *  events. */
    id: z.ZodString;
    /** Adjacency rules — see `WfcEdges`. */
    edges: z.ZodObject<{
        north: z.ZodArray<z.ZodString, "many">;
        south: z.ZodArray<z.ZodString, "many">;
        east: z.ZodArray<z.ZodString, "many">;
        west: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        north: string[];
        south: string[];
        east: string[];
        west: string[];
    }, {
        north: string[];
        south: string[];
        east: string[];
        west: string[];
    }>;
    /** Selection weight. Higher = more frequent placement when
     *  multiple tiles remain valid for a cell. Default 1. */
    weight: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    weight: number;
    edges: {
        north: string[];
        south: string[];
        east: string[];
        west: string[];
    };
}, {
    id: string;
    edges: {
        north: string[];
        south: string[];
        east: string[];
        west: string[];
    };
    weight?: number | undefined;
}>;
export type WfcTile = z.infer<typeof WfcTileSchema>;
/** A complete WFC tile set. The set is the algorithm's
 *  authoritative input — apps tweak adjacency rules + weights
 *  in this shape and re-roll. */
export declare const WfcSetSchema: z.ZodObject<{
    tiles: z.ZodArray<z.ZodObject<{
        /** Stable id. Surfaces in the result grid + propagation
         *  events. */
        id: z.ZodString;
        /** Adjacency rules — see `WfcEdges`. */
        edges: z.ZodObject<{
            north: z.ZodArray<z.ZodString, "many">;
            south: z.ZodArray<z.ZodString, "many">;
            east: z.ZodArray<z.ZodString, "many">;
            west: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            north: string[];
            south: string[];
            east: string[];
            west: string[];
        }, {
            north: string[];
            south: string[];
            east: string[];
            west: string[];
        }>;
        /** Selection weight. Higher = more frequent placement when
         *  multiple tiles remain valid for a cell. Default 1. */
        weight: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        weight: number;
        edges: {
            north: string[];
            south: string[];
            east: string[];
            west: string[];
        };
    }, {
        id: string;
        edges: {
            north: string[];
            south: string[];
            east: string[];
            west: string[];
        };
        weight?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tiles: {
        id: string;
        weight: number;
        edges: {
            north: string[];
            south: string[];
            east: string[];
            west: string[];
        };
    }[];
}, {
    tiles: {
        id: string;
        edges: {
            north: string[];
            south: string[];
            east: string[];
            west: string[];
        };
        weight?: number | undefined;
    }[];
}>;
export type WfcSet = z.infer<typeof WfcSetSchema>;
/** Discriminated result of `waveFunctionCollapse`. Apps
 *  pattern-match on `ok` to distinguish success from
 *  contradiction-fallback. The contradiction branch carries a
 *  partial grid for diagnostic rendering ("here's where the
 *  algorithm gave up"). */
export declare const WfcResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** 2D grid of tile ids, indexed `[y][x]`. */
    grid: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    /** Number of propagation iterations the algorithm ran.
     *  Useful for performance diagnostics. */
    iterations: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    ok: true;
    iterations: number;
    grid: string[][];
}, {
    ok: true;
    iterations: number;
    grid: string[][];
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodLiteral<"contradiction">;
    /** Partial grid with `null` for cells that didn't collapse
     *  before the contradiction. */
    partialGrid: z.ZodArray<z.ZodArray<z.ZodNullable<z.ZodString>, "many">, "many">;
    /** Coordinates of the cell where the contradiction was
     *  detected (its possibility set went empty during
     *  propagation). */
    contradictionAt: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
    /** Iteration count before failure. */
    iterations: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    ok: false;
    reason: "contradiction";
    iterations: number;
    partialGrid: (string | null)[][];
    contradictionAt: {
        x: number;
        y: number;
    };
}, {
    ok: false;
    reason: "contradiction";
    iterations: number;
    partialGrid: (string | null)[][];
    contradictionAt: {
        x: number;
        y: number;
    };
}>]>;
export type WfcResult = z.infer<typeof WfcResultSchema>;
/** Per-side door offsets. Each list contains tile-coord
 *  offsets along that side (0 = the corner closest to the
 *  template's origin). E.g., a 5-wide room with `north: [2]`
 *  has one north door at the third column. */
export declare const RoomDoorsSchema: z.ZodObject<{
    north: z.ZodArray<z.ZodNumber, "many">;
    south: z.ZodArray<z.ZodNumber, "many">;
    east: z.ZodArray<z.ZodNumber, "many">;
    west: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    north: number[];
    south: number[];
    east: number[];
    west: number[];
}, {
    north: number[];
    south: number[];
    east: number[];
    west: number[];
}>;
export type RoomDoors = z.infer<typeof RoomDoorsSchema>;
/** One room template. The graph generator places rotated
 *  copies of these templates into a layout, matching doors. */
export declare const RoomTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    width: z.ZodNumber;
    height: z.ZodNumber;
    doors: z.ZodObject<{
        north: z.ZodArray<z.ZodNumber, "many">;
        south: z.ZodArray<z.ZodNumber, "many">;
        east: z.ZodArray<z.ZodNumber, "many">;
        west: z.ZodArray<z.ZodNumber, "many">;
    }, "strip", z.ZodTypeAny, {
        north: number[];
        south: number[];
        east: number[];
        west: number[];
    }, {
        north: number[];
        south: number[];
        east: number[];
        west: number[];
    }>;
    /** Optional tags for app-side filtering. The generator
     *  ignores these; apps post-process the result to mark
     *  certain rooms as "boss" / "treasure" / "entry". */
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    height: number;
    width: number;
    doors: {
        north: number[];
        south: number[];
        east: number[];
        west: number[];
    };
    tags?: string[] | undefined;
}, {
    id: string;
    height: number;
    width: number;
    doors: {
        north: number[];
        south: number[];
        east: number[];
        west: number[];
    };
    tags?: string[] | undefined;
}>;
export type RoomTemplate = z.infer<typeof RoomTemplateSchema>;
/** Graph specification — the high-level shape the generator
 *  targets. */
export declare const RoomGraphSpecSchema: z.ZodObject<{
    /** Template id placed at the root. Must exist in the
     *  templates list. */
    rootTemplateId: z.ZodString;
    /** Maximum number of additional rooms to place. The
     *  generator stops when this is hit OR when no valid
     *  placement exists. */
    maxRooms: z.ZodNumber;
    /** Maximum branching factor per room (how many neighbors
     *  to attempt placing). */
    maxBranches: z.ZodDefault<z.ZodNumber>;
    /** Optional list of template ids to prefer for non-root
     *  rooms. Empty = all templates eligible. */
    branchTemplates: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    rootTemplateId: string;
    maxRooms: number;
    maxBranches: number;
    branchTemplates?: string[] | undefined;
}, {
    rootTemplateId: string;
    maxRooms: number;
    maxBranches?: number | undefined;
    branchTemplates?: string[] | undefined;
}>;
export type RoomGraphSpec = z.infer<typeof RoomGraphSpecSchema>;
/** A placed room in the result graph. */
export declare const PlacedRoomSchema: z.ZodObject<{
    /** Template id from the input set. */
    templateId: z.ZodString;
    /** World-space tile origin (top-left of the rotated room's
     *  bounding box). */
    x: z.ZodNumber;
    y: z.ZodNumber;
    /** Rotation in 90° increments. 0 = identity, 1 = 90° CW,
     *  2 = 180°, 3 = 270° CW. */
    rotation: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
    /** Effective width AFTER rotation. For rotation 1/3 this is
     *  the template's `height`; for 0/2 it's `width`. */
    width: z.ZodNumber;
    /** Effective height AFTER rotation. */
    height: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    rotation: 0 | 1 | 2 | 3;
    height: number;
    width: number;
    templateId: string;
}, {
    x: number;
    y: number;
    rotation: 0 | 1 | 2 | 3;
    height: number;
    width: number;
    templateId: string;
}>;
export type PlacedRoom = z.infer<typeof PlacedRoomSchema>;
/** A connection between two placed rooms via a matched door
 *  pair. */
export declare const RoomConnectionSchema: z.ZodObject<{
    fromRoomIndex: z.ZodNumber;
    toRoomIndex: z.ZodNumber;
    /** Direction from the FROM room. The TO room is reached
     *  by walking through this side's door. */
    fromSide: z.ZodEnum<["north", "south", "east", "west"]>;
}, "strip", z.ZodTypeAny, {
    fromRoomIndex: number;
    toRoomIndex: number;
    fromSide: "north" | "south" | "east" | "west";
}, {
    fromRoomIndex: number;
    toRoomIndex: number;
    fromSide: "north" | "south" | "east" | "west";
}>;
export type RoomConnection = z.infer<typeof RoomConnectionSchema>;
export declare const RoomGraphResultSchema: z.ZodObject<{
    rooms: z.ZodArray<z.ZodObject<{
        /** Template id from the input set. */
        templateId: z.ZodString;
        /** World-space tile origin (top-left of the rotated room's
         *  bounding box). */
        x: z.ZodNumber;
        y: z.ZodNumber;
        /** Rotation in 90° increments. 0 = identity, 1 = 90° CW,
         *  2 = 180°, 3 = 270° CW. */
        rotation: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
        /** Effective width AFTER rotation. For rotation 1/3 this is
         *  the template's `height`; for 0/2 it's `width`. */
        width: z.ZodNumber;
        /** Effective height AFTER rotation. */
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        rotation: 0 | 1 | 2 | 3;
        height: number;
        width: number;
        templateId: string;
    }, {
        x: number;
        y: number;
        rotation: 0 | 1 | 2 | 3;
        height: number;
        width: number;
        templateId: string;
    }>, "many">;
    connections: z.ZodArray<z.ZodObject<{
        fromRoomIndex: z.ZodNumber;
        toRoomIndex: z.ZodNumber;
        /** Direction from the FROM room. The TO room is reached
         *  by walking through this side's door. */
        fromSide: z.ZodEnum<["north", "south", "east", "west"]>;
    }, "strip", z.ZodTypeAny, {
        fromRoomIndex: number;
        toRoomIndex: number;
        fromSide: "north" | "south" | "east" | "west";
    }, {
        fromRoomIndex: number;
        toRoomIndex: number;
        fromSide: "north" | "south" | "east" | "west";
    }>, "many">;
    /** Bounding box of the full layout in tile coords. Useful
     *  for renderer / pathfinder sizing. */
    bounds: z.ZodObject<{
        minX: z.ZodNumber;
        minY: z.ZodNumber;
        maxX: z.ZodNumber;
        maxY: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }, {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }>;
}, "strip", z.ZodTypeAny, {
    bounds: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
    rooms: {
        x: number;
        y: number;
        rotation: 0 | 1 | 2 | 3;
        height: number;
        width: number;
        templateId: string;
    }[];
    connections: {
        fromRoomIndex: number;
        toRoomIndex: number;
        fromSide: "north" | "south" | "east" | "west";
    }[];
}, {
    bounds: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
    rooms: {
        x: number;
        y: number;
        rotation: 0 | 1 | 2 | 3;
        height: number;
        width: number;
        templateId: string;
    }[];
    connections: {
        fromRoomIndex: number;
        toRoomIndex: number;
        fromSide: "north" | "south" | "east" | "west";
    }[];
}>;
export type RoomGraphResult = z.infer<typeof RoomGraphResultSchema>;
export declare const BspBoundsSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    height: number;
    width: number;
}, {
    height: number;
    width: number;
}>;
export type BspBounds = z.infer<typeof BspBoundsSchema>;
/** Axis-aligned rectangle in tile coords. Used for both rooms
 *  + corridors in the BSP result. */
export declare const BspRectSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    w: z.ZodNumber;
    h: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    w: number;
    h: number;
}, {
    x: number;
    y: number;
    w: number;
    h: number;
}>;
export type BspRect = z.infer<typeof BspRectSchema>;
export declare const BspDungeonResultSchema: z.ZodObject<{
    /** Placed rooms in BSP-leaf order. */
    rooms: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        x: number;
        y: number;
        w: number;
        h: number;
    }>, "many">;
    /** Corridor segments (each a rectangle of `corridorWidth`
     *  thickness) that connect siblings + cousins back up the
     *  BSP tree. */
    corridors: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        x: number;
        y: number;
        w: number;
        h: number;
    }>, "many">;
    /** The original bounds (echo for renderer convenience). */
    bounds: z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        height: number;
        width: number;
    }, {
        height: number;
        width: number;
    }>;
}, "strip", z.ZodTypeAny, {
    bounds: {
        height: number;
        width: number;
    };
    rooms: {
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
    corridors: {
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}, {
    bounds: {
        height: number;
        width: number;
    };
    rooms: {
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
    corridors: {
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}>;
export type BspDungeonResult = z.infer<typeof BspDungeonResultSchema>;
//# sourceMappingURL=procgen.d.ts.map