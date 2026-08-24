import { z } from 'zod';
/** A UI image: a typed id + the public path its bytes live at. */
export declare const AssetManifestUiEntrySchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    id: string;
}, {
    path: string;
    id: string;
}>;
export type AssetManifestUiEntry = z.infer<typeof AssetManifestUiEntrySchema>;
/** A 3D model: id, public path, and the clip names baked into the glb. */
export declare const AssetManifestModelEntrySchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodString;
    animations: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    id: string;
    animations: string[];
}, {
    path: string;
    id: string;
    animations: string[];
}>;
export type AssetManifestModelEntry = z.infer<typeof AssetManifestModelEntrySchema>;
/** A data domain (one `<domain>.json`): the domain slug, its record ids, and
 *  the public path of the validated + minified payload. */
export declare const AssetManifestDataEntrySchema: z.ZodObject<{
    domain: z.ZodString;
    ids: z.ZodArray<z.ZodString, "many">;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    domain: string;
    ids: string[];
}, {
    path: string;
    domain: string;
    ids: string[];
}>;
export type AssetManifestDataEntry = z.infer<typeof AssetManifestDataEntrySchema>;
/** An audio clip: a typed id + the public path of the encoded output. */
export declare const AssetManifestAudioEntrySchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    id: string;
}, {
    path: string;
    id: string;
}>;
export type AssetManifestAudioEntry = z.infer<typeof AssetManifestAudioEntrySchema>;
/** The three audio buckets, each a list of clips. */
export declare const AssetManifestAudioSchema: z.ZodObject<{
    sfx: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        id: string;
    }, {
        path: string;
        id: string;
    }>, "many">;
    music: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        id: string;
    }, {
        path: string;
        id: string;
    }>, "many">;
    environment: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        id: string;
    }, {
        path: string;
        id: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    music: {
        path: string;
        id: string;
    }[];
    sfx: {
        path: string;
        id: string;
    }[];
    environment: {
        path: string;
        id: string;
    }[];
}, {
    music: {
        path: string;
        id: string;
    }[];
    sfx: {
        path: string;
        id: string;
    }[];
    environment: {
        path: string;
        id: string;
    }[];
}>;
export type AssetManifestAudio = z.infer<typeof AssetManifestAudioSchema>;
/** A streaming (solo-format) navmesh world + its full tile manifest. */
export declare const AssetManifestNavMeshEntrySchema: z.ZodObject<{
    id: z.ZodString;
    manifest: z.ZodObject<{
        worldId: z.ZodString;
        tileSize: z.ZodNumber;
        boundsMin: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        boundsMax: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
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
            tx: z.ZodNumber;
            tz: z.ZodNumber;
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
}, "strip", z.ZodTypeAny, {
    id: string;
    manifest: {
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
    };
}, {
    id: string;
    manifest: {
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
    };
}>;
export type AssetManifestNavMeshEntry = z.infer<typeof AssetManifestNavMeshEntrySchema>;
/** A tilecache-format navmesh world + its full manifest. */
export declare const AssetManifestTileCacheEntrySchema: z.ZodObject<{
    id: z.ZodString;
    manifest: z.ZodObject<{
        worldId: z.ZodString;
        tileSize: z.ZodNumber;
        boundsMin: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        boundsMax: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        bundlePath: z.ZodString;
        maxTiles: z.ZodNumber;
        maxObstacles: z.ZodNumber;
        expectedLayersPerTile: z.ZodNumber;
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
            tx: z.ZodNumber;
            tz: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tx: number;
            tz: number;
        }, {
            tx: number;
            tz: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        tiles: {
            tx: number;
            tz: number;
        }[];
        worldId: string;
        tileSize: number;
        boundsMin: [number, number, number];
        boundsMax: [number, number, number];
        maxTiles: number;
        config: {
            cellSize: number;
            walkableRadius: number;
            walkableHeight: number;
            walkableClimb: number;
            walkableSlopeAngle: number;
            cellHeight: number;
        };
        maxObstacles: number;
        expectedLayersPerTile: number;
        bundlePath: string;
    }, {
        tiles: {
            tx: number;
            tz: number;
        }[];
        worldId: string;
        tileSize: number;
        boundsMin: [number, number, number];
        boundsMax: [number, number, number];
        maxTiles: number;
        config: {
            cellSize: number;
            walkableRadius: number;
            walkableHeight: number;
            walkableClimb: number;
            walkableSlopeAngle: number;
            cellHeight: number;
        };
        maxObstacles: number;
        expectedLayersPerTile: number;
        bundlePath: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    manifest: {
        tiles: {
            tx: number;
            tz: number;
        }[];
        worldId: string;
        tileSize: number;
        boundsMin: [number, number, number];
        boundsMax: [number, number, number];
        maxTiles: number;
        config: {
            cellSize: number;
            walkableRadius: number;
            walkableHeight: number;
            walkableClimb: number;
            walkableSlopeAngle: number;
            cellHeight: number;
        };
        maxObstacles: number;
        expectedLayersPerTile: number;
        bundlePath: string;
    };
}, {
    id: string;
    manifest: {
        tiles: {
            tx: number;
            tz: number;
        }[];
        worldId: string;
        tileSize: number;
        boundsMin: [number, number, number];
        boundsMax: [number, number, number];
        maxTiles: number;
        config: {
            cellSize: number;
            walkableRadius: number;
            walkableHeight: number;
            walkableClimb: number;
            walkableSlopeAngle: number;
            cellHeight: number;
        };
        maxObstacles: number;
        expectedLayersPerTile: number;
        bundlePath: string;
    };
}>;
export type AssetManifestTileCacheEntry = z.infer<typeof AssetManifestTileCacheEntrySchema>;
/** A locale: its id + the full validated bundle (config + catalog). */
export declare const AssetManifestLocaleEntrySchema: z.ZodObject<{
    id: z.ZodString;
    bundle: z.ZodObject<{
        config: z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            direction: z.ZodEnum<["ltr", "rtl", "auto"]>;
            fallbacks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks: string[];
        }, {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks?: string[] | undefined;
        }>;
        catalog: z.ZodRecord<z.ZodString, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks: string[];
        };
        catalog: Record<string, string>;
    }, {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks?: string[] | undefined;
        };
        catalog: Record<string, string>;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    bundle: {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks: string[];
        };
        catalog: Record<string, string>;
    };
}, {
    id: string;
    bundle: {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks?: string[] | undefined;
        };
        catalog: Record<string, string>;
    };
}>;
export type AssetManifestLocaleEntry = z.infer<typeof AssetManifestLocaleEntrySchema>;
/** The whole manifest — one build run's worth of every asset the pipelines
 *  produce, in a language-neutral shape. */
export declare const AssetManifestSchema: z.ZodObject<{
    version: z.ZodNumber;
    /** Sprite ids (the spritesheet is a single fixed-path atlas, so ids only). */
    sprites: z.ZodArray<z.ZodString, "many">;
    ui: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        id: string;
    }, {
        path: string;
        id: string;
    }>, "many">;
    models: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        animations: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string;
        id: string;
        animations: string[];
    }, {
        path: string;
        id: string;
        animations: string[];
    }>, "many">;
    data: z.ZodArray<z.ZodObject<{
        domain: z.ZodString;
        ids: z.ZodArray<z.ZodString, "many">;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        domain: string;
        ids: string[];
    }, {
        path: string;
        domain: string;
        ids: string[];
    }>, "many">;
    audio: z.ZodObject<{
        sfx: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            id: string;
        }, {
            path: string;
            id: string;
        }>, "many">;
        music: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            id: string;
        }, {
            path: string;
            id: string;
        }>, "many">;
        environment: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            id: string;
        }, {
            path: string;
            id: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        music: {
            path: string;
            id: string;
        }[];
        sfx: {
            path: string;
            id: string;
        }[];
        environment: {
            path: string;
            id: string;
        }[];
    }, {
        music: {
            path: string;
            id: string;
        }[];
        sfx: {
            path: string;
            id: string;
        }[];
        environment: {
            path: string;
            id: string;
        }[];
    }>;
    navmesh: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        manifest: z.ZodObject<{
            worldId: z.ZodString;
            tileSize: z.ZodNumber;
            boundsMin: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            boundsMax: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
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
                tx: z.ZodNumber;
                tz: z.ZodNumber;
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
    }, "strip", z.ZodTypeAny, {
        id: string;
        manifest: {
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
        };
    }, {
        id: string;
        manifest: {
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
        };
    }>, "many">;
    tileCache: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        manifest: z.ZodObject<{
            worldId: z.ZodString;
            tileSize: z.ZodNumber;
            boundsMin: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            boundsMax: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            bundlePath: z.ZodString;
            maxTiles: z.ZodNumber;
            maxObstacles: z.ZodNumber;
            expectedLayersPerTile: z.ZodNumber;
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
                tx: z.ZodNumber;
                tz: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                tx: number;
                tz: number;
            }, {
                tx: number;
                tz: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            tiles: {
                tx: number;
                tz: number;
            }[];
            worldId: string;
            tileSize: number;
            boundsMin: [number, number, number];
            boundsMax: [number, number, number];
            maxTiles: number;
            config: {
                cellSize: number;
                walkableRadius: number;
                walkableHeight: number;
                walkableClimb: number;
                walkableSlopeAngle: number;
                cellHeight: number;
            };
            maxObstacles: number;
            expectedLayersPerTile: number;
            bundlePath: string;
        }, {
            tiles: {
                tx: number;
                tz: number;
            }[];
            worldId: string;
            tileSize: number;
            boundsMin: [number, number, number];
            boundsMax: [number, number, number];
            maxTiles: number;
            config: {
                cellSize: number;
                walkableRadius: number;
                walkableHeight: number;
                walkableClimb: number;
                walkableSlopeAngle: number;
                cellHeight: number;
            };
            maxObstacles: number;
            expectedLayersPerTile: number;
            bundlePath: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        manifest: {
            tiles: {
                tx: number;
                tz: number;
            }[];
            worldId: string;
            tileSize: number;
            boundsMin: [number, number, number];
            boundsMax: [number, number, number];
            maxTiles: number;
            config: {
                cellSize: number;
                walkableRadius: number;
                walkableHeight: number;
                walkableClimb: number;
                walkableSlopeAngle: number;
                cellHeight: number;
            };
            maxObstacles: number;
            expectedLayersPerTile: number;
            bundlePath: string;
        };
    }, {
        id: string;
        manifest: {
            tiles: {
                tx: number;
                tz: number;
            }[];
            worldId: string;
            tileSize: number;
            boundsMin: [number, number, number];
            boundsMax: [number, number, number];
            maxTiles: number;
            config: {
                cellSize: number;
                walkableRadius: number;
                walkableHeight: number;
                walkableClimb: number;
                walkableSlopeAngle: number;
                cellHeight: number;
            };
            maxObstacles: number;
            expectedLayersPerTile: number;
            bundlePath: string;
        };
    }>, "many">;
    locales: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        bundle: z.ZodObject<{
            config: z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                direction: z.ZodEnum<["ltr", "rtl", "auto"]>;
                fallbacks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks: string[];
            }, {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks?: string[] | undefined;
            }>;
            catalog: z.ZodRecord<z.ZodString, z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            config: {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks: string[];
            };
            catalog: Record<string, string>;
        }, {
            config: {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks?: string[] | undefined;
            };
            catalog: Record<string, string>;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        bundle: {
            config: {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks: string[];
            };
            catalog: Record<string, string>;
        };
    }, {
        id: string;
        bundle: {
            config: {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks?: string[] | undefined;
            };
            catalog: Record<string, string>;
        };
    }>, "many">;
    /** Sorted union of every key across every locale catalog. */
    translationKeys: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    version: number;
    ui: {
        path: string;
        id: string;
    }[];
    audio: {
        music: {
            path: string;
            id: string;
        }[];
        sfx: {
            path: string;
            id: string;
        }[];
        environment: {
            path: string;
            id: string;
        }[];
    };
    sprites: string[];
    models: {
        path: string;
        id: string;
        animations: string[];
    }[];
    data: {
        path: string;
        domain: string;
        ids: string[];
    }[];
    navmesh: {
        id: string;
        manifest: {
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
        };
    }[];
    tileCache: {
        id: string;
        manifest: {
            tiles: {
                tx: number;
                tz: number;
            }[];
            worldId: string;
            tileSize: number;
            boundsMin: [number, number, number];
            boundsMax: [number, number, number];
            maxTiles: number;
            config: {
                cellSize: number;
                walkableRadius: number;
                walkableHeight: number;
                walkableClimb: number;
                walkableSlopeAngle: number;
                cellHeight: number;
            };
            maxObstacles: number;
            expectedLayersPerTile: number;
            bundlePath: string;
        };
    }[];
    locales: {
        id: string;
        bundle: {
            config: {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks: string[];
            };
            catalog: Record<string, string>;
        };
    }[];
    translationKeys: string[];
}, {
    version: number;
    ui: {
        path: string;
        id: string;
    }[];
    audio: {
        music: {
            path: string;
            id: string;
        }[];
        sfx: {
            path: string;
            id: string;
        }[];
        environment: {
            path: string;
            id: string;
        }[];
    };
    sprites: string[];
    models: {
        path: string;
        id: string;
        animations: string[];
    }[];
    data: {
        path: string;
        domain: string;
        ids: string[];
    }[];
    navmesh: {
        id: string;
        manifest: {
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
        };
    }[];
    tileCache: {
        id: string;
        manifest: {
            tiles: {
                tx: number;
                tz: number;
            }[];
            worldId: string;
            tileSize: number;
            boundsMin: [number, number, number];
            boundsMax: [number, number, number];
            maxTiles: number;
            config: {
                cellSize: number;
                walkableRadius: number;
                walkableHeight: number;
                walkableClimb: number;
                walkableSlopeAngle: number;
                cellHeight: number;
            };
            maxObstacles: number;
            expectedLayersPerTile: number;
            bundlePath: string;
        };
    }[];
    locales: {
        id: string;
        bundle: {
            config: {
                id: string;
                label: string;
                direction: "ltr" | "rtl" | "auto";
                fallbacks?: string[] | undefined;
            };
            catalog: Record<string, string>;
        };
    }[];
    translationKeys: string[];
}>;
export type AssetManifest = z.infer<typeof AssetManifestSchema>;
/** The manifest schema version. Bump when the SHAPE changes (a new bucket, a
 *  renamed field) — not when a game's assets change. */
export declare const ASSET_MANIFEST_VERSION = 1;
//# sourceMappingURL=assetManifest.d.ts.map