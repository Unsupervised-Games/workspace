// Grid + turn-action data shapes.
//
// `@unsupervised/features/grid` consumes the grid types (TileCoord,
// TileData, GridTopology) for square-tile pathfinding + line of
// sight. `@unsupervised/features/turn` consumes the turn types
// (TurnActionResult, TurnPhase) for the turn FSM.
//
// All shapes are JSON-serializable so save/load round-trips
// through the existing save bundle without special handling.
// Tile costs use a sentinel large number for "blocked" rather
// than `Infinity` because `JSON.stringify(Infinity) === 'null'`,
// which would round-trip wrong; the framework's `findPath`
// treats anything `>= BLOCKED_COST_SENTINEL` as unwalkable.

import { z } from 'zod';

/** Sentinel used to encode "unwalkable" in `TileData.cost`. Any
 *  value >= this is treated as blocked by `findPath`. Picked to
 *  be JSON-safe and visually obvious in dev logs. */
export const BLOCKED_COST_SENTINEL = 1e9;

/** Integer 2D coord. (0,0) is the grid's origin tile. The grid's
 *  world position of this tile's CENTER is computed by
 *  `tileToWorld(grid, coord)`. */
export const TileCoordSchema = z.object({
  x: z.number().int(),
  y: z.number().int(),
});
export type TileCoord = z.infer<typeof TileCoordSchema>;

/** Per-tile gameplay data. The framework reads `cost` (for A*)
 *  and `opaque` (for LOS); everything else is app-defined. */
export const TileDataSchema = z.object({
  /** Movement cost for entering this tile. `>= BLOCKED_COST_SENTINEL`
   *  = unwalkable. Default 1 (uniform cost). Apps tag terrain
   *  variation here (water=3, road=0.5, etc.). */
  cost: z.number().nonnegative(),
  /** True = blocks line of sight. Default false. Independent of
   *  walkability — a low wall might be walkable but opaque (or
   *  vice-versa: glass = walkable=false, opaque=false). */
  opaque: z.boolean(),
  /** App-defined terrain id (for biome / texture / cover lookup).
   *  Framework treats it as opaque string. */
  terrainId: z.string().optional(),
  /** 0..1 cover bonus for ranged attacks. App-side combat math
   *  reads this; framework doesn't auto-apply. */
  cover: z.number().min(0).max(1).optional(),
});
export type TileData = z.infer<typeof TileDataSchema>;

/** Neighbor / distance topology. `'4-way'` is Manhattan
 *  (cardinal directions only); `'8-way'` includes diagonals
 *  (Chebyshev distance, uniform cost). Picked at grid creation
 *  and stored on the slot so `findPath` defaults match. */
export const GridTopologySchema = z.enum(['4-way', '8-way']);
export type GridTopology = z.infer<typeof GridTopologySchema>;

// ---------------------------------------------------------------------------
// Turn-action result shape — what an action handler returns.
// ---------------------------------------------------------------------------

/** Reasons an action can be rejected. `'app-defined'` is the
 *  escape hatch for game-specific failure modes; the handler
 *  fills `message` with the human-readable description. */
export const TurnActionRejectionSchema = z.enum([
  'insufficient-ap',
  'entity-not-found',
  'invalid-target',
  'out-of-range',
  'blocked',
  'not-your-turn',
  'no-handler',
  'app-defined',
]);
export type TurnActionRejection = z.infer<typeof TurnActionRejectionSchema>;

/** Discriminated result returned by `commitTurnAction` and the
 *  registered handlers. `apCost` is deducted on success. */
export const TurnActionResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    apCost: z.number().nonnegative(),
    /** Optional human-readable description for log entries. */
    description: z.string().optional(),
  }),
  z.object({
    ok: z.literal(false),
    reason: TurnActionRejectionSchema,
    message: z.string(),
  }),
]);
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
export const TurnPhaseSchema = z.enum([
  'idle',
  'awaiting-input',
  'resolving-action',
  'ended',
]);
export type TurnPhase = z.infer<typeof TurnPhaseSchema>;

/** Two top-level turn modes ship at v1. `'individual'` is
 *  initiative-ordered single-entity turns (DCSS, classical D&D);
 *  `'team'` is full-team-acts-then-rotates (XCOM, FFT). */
export const TurnModeSchema = z.enum(['individual', 'team']);
export type TurnMode = z.infer<typeof TurnModeSchema>;
