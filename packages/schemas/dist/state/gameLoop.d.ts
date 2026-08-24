import { z } from 'zod';
/**
 * Lifecycle status of the player avatar. Orthogonal to the game's
 * top-level mode — a player can be 'alive' while the game is paused.
 */
export declare const PlayerLifecycleStatusSchema: z.ZodEnum<["idle", "alive", "dying", "dead", "respawning"]>;
export type PlayerLifecycleStatus = z.infer<typeof PlayerLifecycleStatusSchema>;
/**
 * Persistent context for the game-loop machine. Survives state
 * transitions; mutated by XState `assign` actions only. Anything that
 * needs to survive a save/load round trip goes here.
 */
export declare const GameLoopContextSchema: z.ZodObject<{
    /** Cumulative player score for the current run. */
    score: z.ZodNumber;
    /** Level id currently loaded; null on the main menu / between levels. */
    activeLevelId: z.ZodNullable<z.ZodString>;
    /** Current player lifecycle state. */
    playerStatus: z.ZodEnum<["idle", "alive", "dying", "dead", "respawning"]>;
    /** Seconds since the current run started. Monotonic; not affected by
     *  pause. (If pause-aware elapsed time is needed, add a second field.) */
    elapsedSeconds: z.ZodNumber;
    /** Index of the wave the level's wave scheduler is currently running,
     *  or null if no wave is active (between waves, pre-game, etc.). */
    currentWaveIndex: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    score: number;
    activeLevelId: string | null;
    playerStatus: "idle" | "alive" | "dying" | "dead" | "respawning";
    elapsedSeconds: number;
    currentWaveIndex: number | null;
}, {
    score: number;
    activeLevelId: string | null;
    playerStatus: "idle" | "alive" | "dying" | "dead" | "respawning";
    elapsedSeconds: number;
    currentWaveIndex: number | null;
}>;
export type GameLoopContext = z.infer<typeof GameLoopContextSchema>;
//# sourceMappingURL=gameLoop.d.ts.map