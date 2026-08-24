// Game-loop state machine context.
//
// This defines the data carried by the top-level XState machine that
// drives the overall game flow (menu → playing → paused → dead →
// game-over). The state values (the node names) belong to the engine
// package where the machine is actually wired up; this file owns only
// the context shape that every state transition operates on.
import { z } from 'zod';
/**
 * Lifecycle status of the player avatar. Orthogonal to the game's
 * top-level mode — a player can be 'alive' while the game is paused.
 */
export const PlayerLifecycleStatusSchema = z.enum([
    'idle', // pre-game, player not yet spawned
    'alive',
    'dying', // death animation playing, input suppressed
    'dead',
    'respawning', // respawn animation playing
]);
/**
 * Persistent context for the game-loop machine. Survives state
 * transitions; mutated by XState `assign` actions only. Anything that
 * needs to survive a save/load round trip goes here.
 */
export const GameLoopContextSchema = z.object({
    /** Cumulative player score for the current run. */
    score: z.number().int().nonnegative(),
    /** Level id currently loaded; null on the main menu / between levels. */
    activeLevelId: z.string().min(1).nullable(),
    /** Current player lifecycle state. */
    playerStatus: PlayerLifecycleStatusSchema,
    /** Seconds since the current run started. Monotonic; not affected by
     *  pause. (If pause-aware elapsed time is needed, add a second field.) */
    elapsedSeconds: z.number().nonnegative(),
    /** Index of the wave the level's wave scheduler is currently running,
     *  or null if no wave is active (between waves, pre-game, etc.). */
    currentWaveIndex: z.number().int().nonnegative().nullable(),
});
//# sourceMappingURL=gameLoop.js.map