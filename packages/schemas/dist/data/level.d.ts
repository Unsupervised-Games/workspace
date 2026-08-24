import { z } from 'zod';
/**
 * A marked location in the level where something can be spawned — the
 * player, an enemy, a pickup, a checkpoint. `tag` lets the spawn system
 * query for the right kind of point; untagged points are assumed to be
 * generic.
 */
export declare const SpawnPointSchema: z.ZodObject<{
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    rotation: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        w: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        w: number;
    }, {
        x: number;
        y: number;
        z: number;
        w: number;
    }>;
    /** Logical role: 'player', 'enemy', 'checkpoint', 'prop', ... */
    tag: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    tag?: string | undefined;
}, {
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    tag?: string | undefined;
}>;
export type SpawnPoint = z.infer<typeof SpawnPointSchema>;
/** A single enemy group that shares a spawn time within a wave. */
export declare const EnemyGroupSchema: z.ZodObject<{
    /** Template id — references an entity prefab the engine knows how to
     *  instantiate. Templates live in a registry keyed by this string. */
    entityTemplateId: z.ZodString;
    /** How many enemies of this template to spawn in the group. */
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    count: number;
    entityTemplateId: string;
}, {
    count: number;
    entityTemplateId: string;
}>;
export type EnemyGroup = z.infer<typeof EnemyGroupSchema>;
/**
 * One wave in the level's spawn schedule. Waves fire in order; each
 * wave waits `delaySeconds` after the prior wave completes before it
 * begins spawning.
 */
export declare const EnemyWaveSchema: z.ZodObject<{
    /** Monotonically increasing, starting at 0. */
    waveIndex: z.ZodNumber;
    /** Seconds to wait before this wave starts spawning. */
    delaySeconds: z.ZodNumber;
    /** At least one group is required — an empty wave is almost always a
     *  content-authoring error and should fail validation loudly. */
    enemies: z.ZodArray<z.ZodObject<{
        /** Template id — references an entity prefab the engine knows how to
         *  instantiate. Templates live in a registry keyed by this string. */
        entityTemplateId: z.ZodString;
        /** How many enemies of this template to spawn in the group. */
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        count: number;
        entityTemplateId: string;
    }, {
        count: number;
        entityTemplateId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    waveIndex: number;
    delaySeconds: number;
    enemies: {
        count: number;
        entityTemplateId: string;
    }[];
}, {
    waveIndex: number;
    delaySeconds: number;
    enemies: {
        count: number;
        entityTemplateId: string;
    }[];
}>;
export type EnemyWave = z.infer<typeof EnemyWaveSchema>;
export declare const LevelConfigSchema: z.ZodObject<{
    /** Stable registry key for the level. Used by save data and the
     *  level-select UI. */
    levelId: z.ZodString;
    /** At least one spawn point is required, conventionally tagged
     *  'player' so the game has somewhere to put the player on load. */
    spawnPoints: z.ZodArray<z.ZodObject<{
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>;
        rotation: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            w: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            w: number;
        }, {
            x: number;
            y: number;
            z: number;
            w: number;
        }>;
        /** Logical role: 'player', 'enemy', 'checkpoint', 'prop', ... */
        tag: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        tag?: string | undefined;
    }, {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        tag?: string | undefined;
    }>, "many">;
    /** Wave schedule. An empty array means a sandbox / non-combat level. */
    enemyWaves: z.ZodArray<z.ZodObject<{
        /** Monotonically increasing, starting at 0. */
        waveIndex: z.ZodNumber;
        /** Seconds to wait before this wave starts spawning. */
        delaySeconds: z.ZodNumber;
        /** At least one group is required — an empty wave is almost always a
         *  content-authoring error and should fail validation loudly. */
        enemies: z.ZodArray<z.ZodObject<{
            /** Template id — references an entity prefab the engine knows how to
             *  instantiate. Templates live in a registry keyed by this string. */
            entityTemplateId: z.ZodString;
            /** How many enemies of this template to spawn in the group. */
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            count: number;
            entityTemplateId: string;
        }, {
            count: number;
            entityTemplateId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        waveIndex: number;
        delaySeconds: number;
        enemies: {
            count: number;
            entityTemplateId: string;
        }[];
    }, {
        waveIndex: number;
        delaySeconds: number;
        enemies: {
            count: number;
            entityTemplateId: string;
        }[];
    }>, "many">;
    /** Asset-registry key for the environment bundle (geometry, skybox,
     *  baked lighting). Resolved by the renderer. */
    environmentMapId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    levelId: string;
    spawnPoints: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        tag?: string | undefined;
    }[];
    enemyWaves: {
        waveIndex: number;
        delaySeconds: number;
        enemies: {
            count: number;
            entityTemplateId: string;
        }[];
    }[];
    environmentMapId: string;
}, {
    levelId: string;
    spawnPoints: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        tag?: string | undefined;
    }[];
    enemyWaves: {
        waveIndex: number;
        delaySeconds: number;
        enemies: {
            count: number;
            entityTemplateId: string;
        }[];
    }[];
    environmentMapId: string;
}>;
export type LevelConfig = z.infer<typeof LevelConfigSchema>;
//# sourceMappingURL=level.d.ts.map