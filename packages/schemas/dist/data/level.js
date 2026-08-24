// Level config — the shape of a level file. A level is a list of spawn
// points, a schedule of enemy waves, and a reference to the environment
// asset (geometry + skybox + lighting). The renderer resolves the
// environment map; the gameplay layer drives spawns using this config.
import { z } from 'zod';
import { QuaternionSchema, Vec3Schema } from '../ecs/components.js';
/**
 * A marked location in the level where something can be spawned — the
 * player, an enemy, a pickup, a checkpoint. `tag` lets the spawn system
 * query for the right kind of point; untagged points are assumed to be
 * generic.
 */
export const SpawnPointSchema = z.object({
    position: Vec3Schema,
    rotation: QuaternionSchema,
    /** Logical role: 'player', 'enemy', 'checkpoint', 'prop', ... */
    tag: z.string().min(1).optional(),
});
/** A single enemy group that shares a spawn time within a wave. */
export const EnemyGroupSchema = z.object({
    /** Template id — references an entity prefab the engine knows how to
     *  instantiate. Templates live in a registry keyed by this string. */
    entityTemplateId: z.string().min(1),
    /** How many enemies of this template to spawn in the group. */
    count: z.number().int().positive(),
});
/**
 * One wave in the level's spawn schedule. Waves fire in order; each
 * wave waits `delaySeconds` after the prior wave completes before it
 * begins spawning.
 */
export const EnemyWaveSchema = z.object({
    /** Monotonically increasing, starting at 0. */
    waveIndex: z.number().int().nonnegative(),
    /** Seconds to wait before this wave starts spawning. */
    delaySeconds: z.number().nonnegative(),
    /** At least one group is required — an empty wave is almost always a
     *  content-authoring error and should fail validation loudly. */
    enemies: z.array(EnemyGroupSchema).min(1),
});
export const LevelConfigSchema = z.object({
    /** Stable registry key for the level. Used by save data and the
     *  level-select UI. */
    levelId: z.string().min(1),
    /** At least one spawn point is required, conventionally tagged
     *  'player' so the game has somewhere to put the player on load. */
    spawnPoints: z.array(SpawnPointSchema).min(1),
    /** Wave schedule. An empty array means a sandbox / non-combat level. */
    enemyWaves: z.array(EnemyWaveSchema),
    /** Asset-registry key for the environment bundle (geometry, skybox,
     *  baked lighting). Resolved by the renderer. */
    environmentMapId: z.string().min(1),
});
//# sourceMappingURL=level.js.map