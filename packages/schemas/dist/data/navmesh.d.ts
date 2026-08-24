import { z } from 'zod';
/** Recast bake config snapshot. The runtime stores this for
 *  diagnostics + version-compat checks ("does the streaming
 *  navmesh's walkableRadius match the agent's radius?"). */
export declare const NavMeshBakeConfigSchema: z.ZodObject<{
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
export type NavMeshBakeConfig = z.infer<typeof NavMeshBakeConfigSchema>;
/** Per-tile binary asset reference, forge-emitted. */
export declare const NavMeshTileEntrySchema: z.ZodObject<{
    /** Tile grid X. Integer; can be negative. */
    tx: z.ZodNumber;
    /** Tile grid Z. Integer; can be negative. (Y is up; tiles
     *  span the XZ plane.) */
    tz: z.ZodNumber;
    /** Public-relative path to the per-tile binary, e.g.
     *  `'/navmesh/grassland/0_0.bin'`. Apps fetch this at
     *  runtime; the path is server-side relative-to-public so
     *  it works in both Next.js dev and static-export builds. */
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    tx: number;
    tz: number;
}, {
    path: string;
    tx: number;
    tz: number;
}>;
export type NavMeshTileEntry = z.infer<typeof NavMeshTileEntrySchema>;
/** Forge-emitted manifest for a tiled world. The `tiles`
 *  array enumerates ONLY tiles that have walkable surfaces
 *  (forge skips empty tiles); apps that ask for an unbaked
 *  tile coord get an `unknown-tile` rejection from
 *  `loadTile`. */
export declare const NavMeshTileManifestSchema: z.ZodObject<{
    /** App-defined world id (e.g. `'grassland'`). Forge derives
     *  this from the source directory name. */
    worldId: z.ZodString;
    /** Tile size in world units. Same for X and Z. */
    tileSize: z.ZodNumber;
    /** World-space bounds of the tiled region. Used by the
     *  streaming system to clip view-distance computations. */
    boundsMin: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    boundsMax: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    /** dtNavMesh capacity hints. Forge picks safe values based
     *  on tile count + per-tile poly count. */
    maxTiles: z.ZodNumber;
    maxPolys: z.ZodNumber;
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
    tiles: z.ZodArray<z.ZodObject<{
        /** Tile grid X. Integer; can be negative. */
        tx: z.ZodNumber;
        /** Tile grid Z. Integer; can be negative. (Y is up; tiles
         *  span the XZ plane.) */
        tz: z.ZodNumber;
        /** Public-relative path to the per-tile binary, e.g.
         *  `'/navmesh/grassland/0_0.bin'`. Apps fetch this at
         *  runtime; the path is server-side relative-to-public so
         *  it works in both Next.js dev and static-export builds. */
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        tx: number;
        tz: number;
    }, {
        path: string;
        tx: number;
        tz: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tiles: {
        path: string;
        tx: number;
        tz: number;
    }[];
    worldId: string;
    tileSize: number;
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
    maxTiles: number;
    maxPolys: number;
    config: {
        cellSize: number;
        walkableRadius: number;
        walkableHeight: number;
        walkableClimb: number;
        walkableSlopeAngle: number;
        cellHeight: number;
    };
}, {
    tiles: {
        path: string;
        tx: number;
        tz: number;
    }[];
    worldId: string;
    tileSize: number;
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
    maxTiles: number;
    maxPolys: number;
    config: {
        cellSize: number;
        walkableRadius: number;
        walkableHeight: number;
        walkableClimb: number;
        walkableSlopeAngle: number;
        cellHeight: number;
    };
}>;
export type NavMeshTileManifest = z.infer<typeof NavMeshTileManifestSchema>;
/** Reasons a `loadTile` call can be rejected. */
export declare const TileLoadRejectionSchema: z.ZodEnum<["unknown-tile", "fetch-failed", "parse-failed", "add-tile-failed", "navmesh-disposed"]>;
export type TileLoadRejection = z.infer<typeof TileLoadRejectionSchema>;
/** Discriminated result for `StreamingNavMesh.loadTile`.
 *  Mirrors `BindingChangeResult` / `AchievementUnlockResult` /
 *  `SettingsApplyResult`. */
export declare const TileLoadResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    tx: z.ZodNumber;
    tz: z.ZodNumber;
    /** True when this call actually loaded the tile. False on
     *  the idempotent already-loaded path. */
    fresh: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    ok: true;
    fresh: boolean;
    tx: number;
    tz: number;
}, {
    ok: true;
    fresh: boolean;
    tx: number;
    tz: number;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    tx: z.ZodNumber;
    tz: z.ZodNumber;
    reason: z.ZodEnum<["unknown-tile", "fetch-failed", "parse-failed", "add-tile-failed", "navmesh-disposed"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "unknown-tile" | "fetch-failed" | "parse-failed" | "add-tile-failed" | "navmesh-disposed";
    tx: number;
    tz: number;
}, {
    message: string;
    ok: false;
    reason: "unknown-tile" | "fetch-failed" | "parse-failed" | "add-tile-failed" | "navmesh-disposed";
    tx: number;
    tz: number;
}>]>;
export type TileLoadResult = z.infer<typeof TileLoadResultSchema>;
/** AABB triangle source — what apps put in `world.json`.
 *  Forge converts this into the positions / indices arrays
 *  Recast's bake helpers expect. v1 supports only axis-aligned
 *  boxes; non-axis-aligned geometry needs a GLB-source path
 *  (deferred to OUT_OF_SCOPE). */
export declare const NavMeshGeometryShapeSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"box">;
    /** World-space min corner. */
    min: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    /** World-space max corner. */
    max: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
}, "strip", z.ZodTypeAny, {
    kind: "box";
    max: [number, number, number];
    min: [number, number, number];
}, {
    kind: "box";
    max: [number, number, number];
    min: [number, number, number];
}>]>;
export type NavMeshGeometryShape = z.infer<typeof NavMeshGeometryShapeSchema>;
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
export declare const NavMeshBakeFormatSchema: z.ZodEnum<["solo", "tilecache"]>;
export type NavMeshBakeFormat = z.infer<typeof NavMeshBakeFormatSchema>;
/** A single world's source description. Lives at
 *  `assets-raw/navmeshes/<world-id>/world.json`. Forge derives
 *  `worldId` from the directory name. */
export declare const NavMeshSourceSchema: z.ZodObject<{
    /** Bake format — `'solo'` (per-tile streaming) or
     *  `'tilecache'` (single-bundle with runtime obstacles).
     *  Defaults to `'solo'` so existing world.json sources
     *  continue to bake unchanged. */
    format: z.ZodDefault<z.ZodEnum<["solo", "tilecache"]>>;
    /** Tile size in world units. Same for X and Z. */
    tileSize: z.ZodNumber;
    /** World-space bounds of the tiled region. */
    boundsMin: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    boundsMax: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    /** Walkable geometry (ground plane + obstacles). */
    geometry: z.ZodObject<{
        /** Required ground shape (the floor agents walk on). */
        ground: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"box">;
            /** World-space min corner. */
            min: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            /** World-space max corner. */
            max: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        }, "strip", z.ZodTypeAny, {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }, {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }>]>;
        /** Optional obstacles that block walkability. */
        obstacles: z.ZodDefault<z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"box">;
            /** World-space min corner. */
            min: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            /** World-space max corner. */
            max: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        }, "strip", z.ZodTypeAny, {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }, {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }>]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        ground: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        };
        obstacles: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }[];
    }, {
        ground: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        };
        obstacles?: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }[] | undefined;
    }>;
    /** Optional bake config; forge fills in defaults per-field
     *  when omitted (see `NavMeshBakeConfigSchema`). */
    config: z.ZodOptional<z.ZodObject<{
        walkableRadius: z.ZodOptional<z.ZodNumber>;
        walkableHeight: z.ZodOptional<z.ZodNumber>;
        walkableClimb: z.ZodOptional<z.ZodNumber>;
        walkableSlopeAngle: z.ZodOptional<z.ZodNumber>;
        cellSize: z.ZodOptional<z.ZodNumber>;
        cellHeight: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        cellSize?: number | undefined;
        walkableRadius?: number | undefined;
        walkableHeight?: number | undefined;
        walkableClimb?: number | undefined;
        walkableSlopeAngle?: number | undefined;
        cellHeight?: number | undefined;
    }, {
        cellSize?: number | undefined;
        walkableRadius?: number | undefined;
        walkableHeight?: number | undefined;
        walkableClimb?: number | undefined;
        walkableSlopeAngle?: number | undefined;
        cellHeight?: number | undefined;
    }>>;
    /** Maximum number of runtime obstacles the TileCache can
     *  hold at once. Only used when `format: 'tilecache'`.
     *  Defaults to 128. */
    maxObstacles: z.ZodDefault<z.ZodNumber>;
    /** How many "floors" each cell should accommodate.
     *  Only used when `format: 'tilecache'`. Defaults to 1
     *  (flat worlds); apps with overlapping walkable
     *  surfaces (catwalks, multi-storey interiors) bump
     *  this higher. */
    expectedLayersPerTile: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    tileSize: number;
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
    format: "solo" | "tilecache";
    geometry: {
        ground: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        };
        obstacles: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }[];
    };
    maxObstacles: number;
    expectedLayersPerTile: number;
    config?: {
        cellSize?: number | undefined;
        walkableRadius?: number | undefined;
        walkableHeight?: number | undefined;
        walkableClimb?: number | undefined;
        walkableSlopeAngle?: number | undefined;
        cellHeight?: number | undefined;
    } | undefined;
}, {
    tileSize: number;
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
    geometry: {
        ground: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        };
        obstacles?: {
            kind: "box";
            max: [number, number, number];
            min: [number, number, number];
        }[] | undefined;
    };
    config?: {
        cellSize?: number | undefined;
        walkableRadius?: number | undefined;
        walkableHeight?: number | undefined;
        walkableClimb?: number | undefined;
        walkableSlopeAngle?: number | undefined;
        cellHeight?: number | undefined;
    } | undefined;
    format?: "solo" | "tilecache" | undefined;
    maxObstacles?: number | undefined;
    expectedLayersPerTile?: number | undefined;
}>;
export type NavMeshSource = z.infer<typeof NavMeshSourceSchema>;
//# sourceMappingURL=navmesh.d.ts.map