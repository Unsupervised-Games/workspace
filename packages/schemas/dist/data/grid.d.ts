import { z } from 'zod';
/** Sentinel used to encode "unwalkable" in `TileData.cost`. Any
 *  value >= this is treated as blocked by `findPath`. Picked to
 *  be JSON-safe and visually obvious in dev logs. */
export declare const BLOCKED_COST_SENTINEL = 1000000000;
/** Integer 2D coord. (0,0) is the grid's origin tile. The grid's
 *  world position of this tile's CENTER is computed by
 *  `tileToWorld(grid, coord)`. */
export declare const TileCoordSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>;
export type TileCoord = z.infer<typeof TileCoordSchema>;
/** Per-tile gameplay data. The framework reads `cost` (for A*)
 *  and `opaque` (for LOS); everything else is app-defined. */
export declare const TileDataSchema: z.ZodObject<{
    /** Movement cost for entering this tile. `>= BLOCKED_COST_SENTINEL`
     *  = unwalkable. Default 1 (uniform cost). Apps tag terrain
     *  variation here (water=3, road=0.5, etc.). */
    cost: z.ZodNumber;
    /** True = blocks line of sight. Default false. Independent of
     *  walkability — a low wall might be walkable but opaque (or
     *  vice-versa: glass = walkable=false, opaque=false). */
    opaque: z.ZodBoolean;
    /** App-defined terrain id (for biome / texture / cover lookup).
     *  Framework treats it as opaque string. */
    terrainId: z.ZodOptional<z.ZodString>;
    /** 0..1 cover bonus for ranged attacks. App-side combat math
     *  reads this; framework doesn't auto-apply. */
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
}>;
export type TileData = z.infer<typeof TileDataSchema>;
/** Neighbor / distance topology. `'4-way'` is Manhattan
 *  (cardinal directions only); `'8-way'` includes diagonals
 *  (Chebyshev distance, uniform cost). Picked at grid creation
 *  and stored on the slot so `findPath` defaults match. */
export declare const GridTopologySchema: z.ZodEnum<["4-way", "8-way"]>;
export type GridTopology = z.infer<typeof GridTopologySchema>;
/** Reasons an action can be rejected. `'app-defined'` is the
 *  escape hatch for game-specific failure modes; the handler
 *  fills `message` with the human-readable description. */
export declare const TurnActionRejectionSchema: z.ZodEnum<["insufficient-ap", "entity-not-found", "invalid-target", "out-of-range", "blocked", "not-your-turn", "no-handler", "app-defined"]>;
export type TurnActionRejection = z.infer<typeof TurnActionRejectionSchema>;
/** Discriminated result returned by `commitTurnAction` and the
 *  registered handlers. `apCost` is deducted on success. */
export declare const TurnActionResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    apCost: z.ZodNumber;
    /** Optional human-readable description for log entries. */
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    apCost: number;
    description?: string | undefined;
}, {
    ok: true;
    apCost: number;
    description?: string | undefined;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["insufficient-ap", "entity-not-found", "invalid-target", "out-of-range", "blocked", "not-your-turn", "no-handler", "app-defined"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "insufficient-ap" | "entity-not-found" | "invalid-target" | "out-of-range" | "blocked" | "not-your-turn" | "no-handler" | "app-defined";
}, {
    message: string;
    ok: false;
    reason: "insufficient-ap" | "entity-not-found" | "invalid-target" | "out-of-range" | "blocked" | "not-your-turn" | "no-handler" | "app-defined";
}>]>;
export type TurnActionResult = z.infer<typeof TurnActionResultSchema>;
/** Phases the turn FSM cycles through.
 *
 *  - `'idle'` — no battle in flight. `startBattle` transitions
 *    out of this.
 *  - `'awaiting-input'` — the active entity (or team) is
 *    deciding; UIs can show their move overlay.
 *  - `'resolving-action'` — an action handler is mutating the
 *    world. Brief; UIs can ignore.
 *  - `'ended'` — battle is over (win or lose). `endBattle`
 *    transitions to `'idle'`.
 */
export declare const TurnPhaseSchema: z.ZodEnum<["idle", "awaiting-input", "resolving-action", "ended"]>;
export type TurnPhase = z.infer<typeof TurnPhaseSchema>;
/** Two top-level turn modes ship at v1. `'individual'` is
 *  initiative-ordered single-entity turns (DCSS, classical D&D);
 *  `'team'` is full-team-acts-then-rotates (XCOM, FFT). */
export declare const TurnModeSchema: z.ZodEnum<["individual", "team"]>;
export type TurnMode = z.infer<typeof TurnModeSchema>;
//# sourceMappingURL=grid.d.ts.map