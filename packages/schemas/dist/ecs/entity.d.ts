import { z } from 'zod';
export declare const EntitySchema: z.ZodObject<{
    /** Stable identifier. Miniplex assigns its own numeric id on create;
     *  this field is for entities that need a serialization-stable key
     *  (save games, networked replication, spawn templates). */
    id: z.ZodOptional<z.ZodString>;
    transform: z.ZodOptional<z.ZodObject<{
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
        scale: z.ZodObject<{
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
        scale: {
            x: number;
            y: number;
            z: number;
        };
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
        scale: {
            x: number;
            y: number;
            z: number;
        };
    }>>;
    velocity: z.ZodOptional<z.ZodObject<{
        linear: z.ZodObject<{
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
        angular: z.ZodObject<{
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
    }, "strip", z.ZodTypeAny, {
        linear: {
            x: number;
            y: number;
            z: number;
        };
        angular: {
            x: number;
            y: number;
            z: number;
        };
    }, {
        linear: {
            x: number;
            y: number;
            z: number;
        };
        angular: {
            x: number;
            y: number;
            z: number;
        };
    }>>;
    renderable: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"2d">;
        spriteId: z.ZodString;
        tint: z.ZodOptional<z.ZodNumber>;
        zIndex: z.ZodOptional<z.ZodNumber>;
        visible: z.ZodOptional<z.ZodBoolean>;
        anchor: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
        opacity: z.ZodOptional<z.ZodNumber>;
        blendMode: z.ZodOptional<z.ZodEnum<["normal", "add", "multiply", "screen"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "2d";
        spriteId: string;
        tint?: number | undefined;
        zIndex?: number | undefined;
        visible?: boolean | undefined;
        anchor?: {
            x: number;
            y: number;
        } | undefined;
        opacity?: number | undefined;
        blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
    }, {
        type: "2d";
        spriteId: string;
        tint?: number | undefined;
        zIndex?: number | undefined;
        visible?: boolean | undefined;
        anchor?: {
            x: number;
            y: number;
        } | undefined;
        opacity?: number | undefined;
        blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"3d">;
        modelId: z.ZodString;
        materialId: z.ZodOptional<z.ZodString>;
        castShadow: z.ZodOptional<z.ZodBoolean>;
        receiveShadow: z.ZodOptional<z.ZodBoolean>;
        visible: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "3d";
        modelId: string;
        visible?: boolean | undefined;
        materialId?: string | undefined;
        castShadow?: boolean | undefined;
        receiveShadow?: boolean | undefined;
    }, {
        type: "3d";
        modelId: string;
        visible?: boolean | undefined;
        materialId?: string | undefined;
        castShadow?: boolean | undefined;
        receiveShadow?: boolean | undefined;
    }>]>>;
    physics: z.ZodOptional<z.ZodObject<{
        bodyType: z.ZodEnum<["dynamic", "static", "kinematic"]>;
        mass: z.ZodNumber;
        collider: z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
            shape: z.ZodLiteral<"box">;
            halfExtents: z.ZodObject<{
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
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"sphere">;
            radius: z.ZodNumber;
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "sphere";
            radius: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "sphere";
            radius: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"capsule">;
            halfHeight: z.ZodNumber;
            radius: z.ZodNumber;
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"mesh">;
            meshId: z.ZodString;
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "mesh";
            meshId: string;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "mesh";
            meshId: string;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"cylinder">;
            halfHeight: z.ZodNumber;
            radius: z.ZodNumber;
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"convex-hull">;
            points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "convex-hull";
            points: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "convex-hull";
            points: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"trimesh">;
            vertices: z.ZodArray<z.ZodNumber, "many">;
            indices: z.ZodArray<z.ZodNumber, "many">;
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "trimesh";
            vertices: number[];
            indices: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "trimesh";
            vertices: number[];
            indices: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"heightfield">;
            heights: z.ZodArray<z.ZodNumber, "many">;
            nrows: z.ZodNumber;
            ncols: z.ZodNumber;
            scale: z.ZodObject<{
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
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "heightfield";
            scale: {
                x: number;
                y: number;
                z: number;
            };
            heights: number[];
            nrows: number;
            ncols: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "heightfield";
            scale: {
                x: number;
                y: number;
                z: number;
            };
            heights: number[];
            nrows: number;
            ncols: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>, z.ZodObject<{
            shape: z.ZodLiteral<"compound">;
            children: z.ZodArray<z.ZodDiscriminatedUnion<"shape", [z.ZodObject<{
                shape: z.ZodLiteral<"box">;
                halfExtents: z.ZodObject<{
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
                localOffset: z.ZodObject<{
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
                localRotation: z.ZodObject<{
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
            }, "strip", z.ZodTypeAny, {
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }, {
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }>, z.ZodObject<{
                shape: z.ZodLiteral<"sphere">;
                radius: z.ZodNumber;
                localOffset: z.ZodObject<{
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
                localRotation: z.ZodObject<{
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
            }, "strip", z.ZodTypeAny, {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }, {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }>, z.ZodObject<{
                shape: z.ZodLiteral<"capsule">;
                halfHeight: z.ZodNumber;
                radius: z.ZodNumber;
                localOffset: z.ZodObject<{
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
                localRotation: z.ZodObject<{
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
            }, "strip", z.ZodTypeAny, {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }, {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }>, z.ZodObject<{
                shape: z.ZodLiteral<"cylinder">;
                halfHeight: z.ZodNumber;
                radius: z.ZodNumber;
                localOffset: z.ZodObject<{
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
                localRotation: z.ZodObject<{
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
            }, "strip", z.ZodTypeAny, {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }, {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }>, z.ZodObject<{
                shape: z.ZodLiteral<"convex-hull">;
                points: z.ZodEffects<z.ZodArray<z.ZodNumber, "many">, number[], number[]>;
                localOffset: z.ZodObject<{
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
                localRotation: z.ZodObject<{
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
            }, "strip", z.ZodTypeAny, {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }, {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            }>]>, "many">;
        } & {
            readonly isSensor: z.ZodOptional<z.ZodBoolean>;
            readonly emitCollisionEvents: z.ZodOptional<z.ZodBoolean>;
            readonly contactForceEventThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            shape: "compound";
            children: ({
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            })[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }, {
            shape: "compound";
            children: ({
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            })[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        }>]>;
        restitution: z.ZodOptional<z.ZodNumber>;
        friction: z.ZodOptional<z.ZodNumber>;
        linearDamping: z.ZodOptional<z.ZodNumber>;
        angularDamping: z.ZodOptional<z.ZodNumber>;
        lockedAxes: z.ZodOptional<z.ZodObject<{
            translation: z.ZodOptional<z.ZodObject<{
                x: z.ZodOptional<z.ZodBoolean>;
                y: z.ZodOptional<z.ZodBoolean>;
                z: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            }, {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            }>>;
            rotation: z.ZodOptional<z.ZodObject<{
                x: z.ZodOptional<z.ZodBoolean>;
                y: z.ZodOptional<z.ZodBoolean>;
                z: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            }, {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            rotation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
            translation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
        }, {
            rotation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
            translation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        bodyType: "dynamic" | "static" | "kinematic";
        mass: number;
        collider: {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "sphere";
            radius: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "mesh";
            meshId: string;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "convex-hull";
            points: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "trimesh";
            vertices: number[];
            indices: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "heightfield";
            scale: {
                x: number;
                y: number;
                z: number;
            };
            heights: number[];
            nrows: number;
            ncols: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "compound";
            children: ({
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            })[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        };
        restitution?: number | undefined;
        friction?: number | undefined;
        linearDamping?: number | undefined;
        angularDamping?: number | undefined;
        lockedAxes?: {
            rotation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
            translation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
        } | undefined;
    }, {
        bodyType: "dynamic" | "static" | "kinematic";
        mass: number;
        collider: {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "sphere";
            radius: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "mesh";
            meshId: string;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "convex-hull";
            points: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "trimesh";
            vertices: number[];
            indices: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "heightfield";
            scale: {
                x: number;
                y: number;
                z: number;
            };
            heights: number[];
            nrows: number;
            ncols: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "compound";
            children: ({
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            })[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        };
        restitution?: number | undefined;
        friction?: number | undefined;
        linearDamping?: number | undefined;
        angularDamping?: number | undefined;
        lockedAxes?: {
            rotation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
            translation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
        } | undefined;
    }>>;
    /** Physics joints anchored on this entity. Each entry references
     *  the OTHER endpoint by stable `id`; the engine-3d `jointSystem`
     *  reconciles per-tick (creates missing Rapier joints, destroys
     *  orphans when either endpoint leaves the world). Apps that want
     *  transient welds use the imperative `weldEntities(a, b)` API —
     *  it creates the joint AND appends to this slot in one call. */
    joints: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"fixed">;
        otherEntityId: z.ZodString;
        handle: z.ZodNumber;
        localAnchorA: z.ZodObject<{
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
        localAnchorB: z.ZodObject<{
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
        localFrameA: z.ZodOptional<z.ZodObject<{
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
        }>>;
        localFrameB: z.ZodOptional<z.ZodObject<{
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
        }>>;
    }, "strip", z.ZodTypeAny, {
        kind: "fixed";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        localFrameA?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
        localFrameB?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
    }, {
        kind: "fixed";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        localFrameA?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
        localFrameB?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"revolute">;
        otherEntityId: z.ZodString;
        handle: z.ZodNumber;
        localAnchorA: z.ZodObject<{
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
        localAnchorB: z.ZodObject<{
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
        axis: z.ZodObject<{
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
        limits: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        motor: z.ZodOptional<z.ZodObject<{
            targetVel: z.ZodNumber;
            maxForce: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            targetVel: number;
            maxForce: number;
        }, {
            targetVel: number;
            maxForce: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        kind: "revolute";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    }, {
        kind: "revolute";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"prismatic">;
        otherEntityId: z.ZodString;
        handle: z.ZodNumber;
        localAnchorA: z.ZodObject<{
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
        localAnchorB: z.ZodObject<{
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
        axis: z.ZodObject<{
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
        limits: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        motor: z.ZodOptional<z.ZodObject<{
            targetVel: z.ZodNumber;
            maxForce: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            targetVel: number;
            maxForce: number;
        }, {
            targetVel: number;
            maxForce: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        kind: "prismatic";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    }, {
        kind: "prismatic";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"spherical">;
        otherEntityId: z.ZodString;
        handle: z.ZodNumber;
        localAnchorA: z.ZodObject<{
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
        localAnchorB: z.ZodObject<{
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
    }, "strip", z.ZodTypeAny, {
        kind: "spherical";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
    }, {
        kind: "spherical";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"distance">;
        otherEntityId: z.ZodString;
        handle: z.ZodNumber;
        localAnchorA: z.ZodObject<{
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
        localAnchorB: z.ZodObject<{
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
        length: z.ZodNumber;
        stiffness: z.ZodOptional<z.ZodNumber>;
        damping: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        length: number;
        kind: "distance";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        stiffness?: number | undefined;
        damping?: number | undefined;
    }, {
        length: number;
        kind: "distance";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        stiffness?: number | undefined;
        damping?: number | undefined;
    }>]>, "many">>;
    health: z.ZodOptional<z.ZodObject<{
        current: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        current: number;
        max: number;
    }, {
        current: number;
        max: number;
    }>>;
    audio: z.ZodOptional<z.ZodObject<{
        soundId: z.ZodString;
        bus: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
        volume: z.ZodNumber;
        loop: z.ZodBoolean;
        spatial3D: z.ZodOptional<z.ZodObject<{
            maxDistance: z.ZodNumber;
            rolloff: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            maxDistance: number;
            rolloff: number;
        }, {
            maxDistance: number;
            rolloff: number;
        }>>;
        playing: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        loop: boolean;
        soundId: string;
        bus: "music" | "sfx" | "environment" | "ui";
        volume: number;
        playing: boolean;
        spatial3D?: {
            maxDistance: number;
            rolloff: number;
        } | undefined;
    }, {
        loop: boolean;
        soundId: string;
        bus: "music" | "sfx" | "environment" | "ui";
        volume: number;
        playing: boolean;
        spatial3D?: {
            maxDistance: number;
            rolloff: number;
        } | undefined;
    }>>;
    /** Survive scene-level purges. SceneManager's deep-clean iterates
     *  the world during a LOADING_SCENE transition and skips any
     *  entity carrying this slot. */
    persist: z.ZodOptional<z.ZodObject<{
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        reason?: string | undefined;
    }, {
        reason?: string | undefined;
    }>>;
    /** Scene-attribution slot. INTERNAL — written by SceneManager's
     *  SceneSpawner wrapper, never by consumer code. Powers
     *  targeted destruction in `unloadScene(sceneId)` and the
     *  interstitial loading-scene cleanup. */
    sceneOwner: z.ZodOptional<z.ZodObject<{
        sceneId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sceneId: string;
    }, {
        sceneId: string;
    }>>;
    /** Particle source. Read by `@unsupervised/vfx`'s VFXSystem to drive
     *  GPU-instanced particle emission. The emitter's spawn
     *  coordinates come from this entity's `transform` component
     *  every frame; individual particles are NOT ECS entities. */
    emitter: z.ZodOptional<z.ZodObject<{
        particleCountPerSecond: z.ZodNumber;
        velocityCone: z.ZodNumber;
        speed: z.ZodNumber;
        lifespan: z.ZodNumber;
        color: z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
        }, {
            r: number;
            g: number;
            b: number;
        }>;
        enabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        speed: number;
        particleCountPerSecond: number;
        velocityCone: number;
        lifespan: number;
        color: {
            r: number;
            g: number;
            b: number;
        };
        enabled: boolean;
    }, {
        speed: number;
        particleCountPerSecond: number;
        velocityCone: number;
        lifespan: number;
        color: {
            r: number;
            g: number;
            b: number;
        };
        enabled: boolean;
    }>>;
    /** Animation intent. Read by `@unsupervised/renderer-3d`'s
     *  `useEntityAnimation` hook, which resolves clip names via
     *  ModelBank and drives a Three.js AnimationMixer bound to the
     *  entity's rendered Object3D. Mutating fields on this slot
     *  (clipId / blendWeight / speed) is how gameplay code
     *  triggers visual transitions. */
    animation: z.ZodOptional<z.ZodObject<{
        clipId: z.ZodString;
        blendToClipId: z.ZodOptional<z.ZodString>;
        blendWeight: z.ZodOptional<z.ZodNumber>;
        speed: z.ZodDefault<z.ZodNumber>;
        loop: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        speed: number;
        clipId: string;
        loop: boolean;
        blendToClipId?: string | undefined;
        blendWeight?: number | undefined;
    }, {
        clipId: string;
        speed?: number | undefined;
        blendToClipId?: string | undefined;
        blendWeight?: number | undefined;
        loop?: boolean | undefined;
    }>>;
    /** Pathfinding intent. Read by `@unsupervised/ai`'s NavSystem, which
     *  computes a Recast/Detour path from `transform.position` to
     *  `target` and writes desired velocity into `velocity.linear`
     *  each tick. Authors set `target` (or null to halt); the
     *  computed path lives in NavSystem's side-table, not on the
     *  entity. */
    navAgent: z.ZodOptional<z.ZodObject<{
        speed: z.ZodNumber;
        arrivalRadius: z.ZodOptional<z.ZodNumber>;
        target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
        }>>>;
    }, "strip", z.ZodTypeAny, {
        speed: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
    }, {
        speed: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
    }>>;
    /** Multi-agent pathfinding intent. Read by `@unsupervised/ai`'s
     *  CrowdSystem, which registers the agent with `dtCrowd`,
     *  batch-steps the whole crowd in one `crowd.update(dt)`
     *  call, and writes the agent's resolved position +
     *  velocity back into `transform` + `velocity.linear`.
     *  Mutually exclusive with `navAgent`. */
    crowdAgent: z.ZodOptional<z.ZodObject<{
        crowdId: z.ZodDefault<z.ZodString>;
        maxSpeed: z.ZodNumber;
        radius: z.ZodNumber;
        height: z.ZodNumber;
        maxAcceleration: z.ZodOptional<z.ZodNumber>;
        arrivalRadius: z.ZodOptional<z.ZodNumber>;
        separationWeight: z.ZodOptional<z.ZodNumber>;
        obstacleAvoidanceType: z.ZodOptional<z.ZodNumber>;
        target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
        }>>>;
    }, "strip", z.ZodTypeAny, {
        radius: number;
        crowdId: string;
        maxSpeed: number;
        height: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
        maxAcceleration?: number | undefined;
        separationWeight?: number | undefined;
        obstacleAvoidanceType?: number | undefined;
    }, {
        radius: number;
        maxSpeed: number;
        height: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
        crowdId?: string | undefined;
        maxAcceleration?: number | undefined;
        separationWeight?: number | undefined;
        obstacleAvoidanceType?: number | undefined;
    }>>;
    /** Decision-making intent. Read by `@unsupervised/ai-bt`'s
     *  `behaviorTreeSystem`, which looks up the registered tree
     *  by `rootId` and ticks it once per frame against this slot's
     *  blackboard. Tree-internal running-node state lives in the
     *  blackboard under reserved `__bt` keys; game state lives in
     *  free-form keys the author chooses. */
    behaviorTree: z.ZodOptional<z.ZodObject<{
        rootId: z.ZodString;
        blackboard: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        rootId: string;
        blackboard: Record<string, unknown>;
    }, {
        rootId: string;
        blackboard: Record<string, unknown>;
    }>>;
    /** Slot-based item container. Mutated by
     *  `@unsupervised/features/inventory`'s pure operations — callers
     *  assign the result of each op back to the slot. Definitions
     *  referenced by `defId` must be registered globally via
     *  `registerItem(...)` before the first read. JSON-shaped, so
     *  the save layer round-trips inventory state for free. */
    inventory: z.ZodOptional<z.ZodObject<{
        slots: z.ZodArray<z.ZodNullable<z.ZodObject<{
            defId: z.ZodString;
            count: z.ZodNumber;
            customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        }, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        }>>, "many">;
        capacity: z.ZodNumber;
        equipped: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodObject<{
            defId: z.ZodString;
            count: z.ZodNumber;
            customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        }, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        }>>>>;
    }, "strip", z.ZodTypeAny, {
        slots: ({
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null)[];
        capacity: number;
        equipped?: Record<string, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null> | undefined;
    }, {
        slots: ({
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null)[];
        capacity: number;
        equipped?: Record<string, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null> | undefined;
    }>>;
    /** Abilities the entity has + per-id cooldown timers. Read /
     *  written by `@unsupervised/features/abilities`'s `tryActivate` (sets
     *  cooldown on successful cast) and `abilitySystem` (ticks
     *  timers down by `delta` each frame). Ids must be registered
     *  via `registerAbility(...)` before the first activation. */
    abilities: z.ZodOptional<z.ZodObject<{
        active: z.ZodArray<z.ZodString, "many">;
        cooldowns: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        active: string[];
        cooldowns: Record<string, number>;
    }, {
        active: string[];
        cooldowns: Record<string, number>;
    }>>;
    /** Named resource pools (mana / stamina / focus / heat / …)
     *  consumed by ability activation. Each pool tracks
     *  `current / max` and an optional `regen` rate that
     *  `abilitySystem` ticks up to `max` each frame. Resource
     *  names are app-defined; ability `cost` keys must match the
     *  names this slot exposes. */
    resources: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        current: z.ZodNumber;
        max: z.ZodNumber;
        regen: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        current: number;
        max: number;
        regen?: number | undefined;
    }, {
        current: number;
        max: number;
        regen?: number | undefined;
    }>>>;
    /** "Things that spawn other things." Read / written by
     *  `@unsupervised/features/spawn`'s `spawnerSystem`. The slot carries
     *  the spawner's mode (interval / wave / manual), pool,
     *  spatial shape, capacity caps, and mid-wave bookkeeping —
     *  all JSON-shaped, so save/load round-trips full state.
     *  Archetype factories + per-spawner-id callbacks are
     *  registered globally; this slot only stores ids. */
    spawner: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        enabled: z.ZodBoolean;
        pool: z.ZodArray<z.ZodObject<{
            archetypeId: z.ZodString;
            weight: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            weight: number;
            archetypeId: string;
        }, {
            weight: number;
            archetypeId: string;
        }>, "many">;
        mode: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"interval">;
            intervalSeconds: z.ZodNumber;
            timeUntilNext: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: "interval";
            intervalSeconds: number;
            timeUntilNext: number;
        }, {
            kind: "interval";
            intervalSeconds: number;
            timeUntilNext: number;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"wave">;
            waves: z.ZodArray<z.ZodObject<{
                count: z.ZodNumber;
                intervalSeconds: z.ZodNumber;
                pool: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    archetypeId: z.ZodString;
                    weight: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    weight: number;
                    archetypeId: string;
                }, {
                    weight: number;
                    archetypeId: string;
                }>, "many">>;
                startTrigger: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
                    kind: z.ZodLiteral<"previous-cleared">;
                }, "strip", z.ZodTypeAny, {
                    kind: "previous-cleared";
                }, {
                    kind: "previous-cleared";
                }>, z.ZodObject<{
                    kind: z.ZodLiteral<"delay">;
                    seconds: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    kind: "delay";
                    seconds: number;
                }, {
                    kind: "delay";
                    seconds: number;
                }>]>;
            }, "strip", z.ZodTypeAny, {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }, {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }>, "many">;
            currentWaveIndex: z.ZodNumber;
            waveState: z.ZodEnum<["idle", "spawning", "awaiting-clear", "between-waves", "complete"]>;
            waveTimeAccumulator: z.ZodNumber;
            spawnedThisWave: z.ZodNumber;
            betweenWaveDelay: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: "wave";
            waves: {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }[];
            currentWaveIndex: number;
            waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
            waveTimeAccumulator: number;
            spawnedThisWave: number;
            betweenWaveDelay: number;
        }, {
            kind: "wave";
            waves: {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }[];
            currentWaveIndex: number;
            waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
            waveTimeAccumulator: number;
            spawnedThisWave: number;
            betweenWaveDelay: number;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"manual">;
        }, "strip", z.ZodTypeAny, {
            kind: "manual";
        }, {
            kind: "manual";
        }>]>;
        shape: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"point">;
        }, "strip", z.ZodTypeAny, {
            kind: "point";
        }, {
            kind: "point";
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"circle">;
            radius: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: "circle";
            radius: number;
        }, {
            kind: "circle";
            radius: number;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"line">;
            from: z.ZodObject<{
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
            to: z.ZodObject<{
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
        }, "strip", z.ZodTypeAny, {
            kind: "line";
            from: {
                x: number;
                y: number;
                z: number;
            };
            to: {
                x: number;
                y: number;
                z: number;
            };
        }, {
            kind: "line";
            from: {
                x: number;
                y: number;
                z: number;
            };
            to: {
                x: number;
                y: number;
                z: number;
            };
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"box">;
            halfExtents: z.ZodObject<{
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
        }, "strip", z.ZodTypeAny, {
            kind: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
        }, {
            kind: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
        }>]>;
        origin: z.ZodObject<{
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
        maxActive: z.ZodOptional<z.ZodNumber>;
        maxTotal: z.ZodOptional<z.ZodNumber>;
        totalSpawned: z.ZodNumber;
        rngSeed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        shape: {
            kind: "point";
        } | {
            kind: "circle";
            radius: number;
        } | {
            kind: "line";
            from: {
                x: number;
                y: number;
                z: number;
            };
            to: {
                x: number;
                y: number;
                z: number;
            };
        } | {
            kind: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
        };
        id: string;
        enabled: boolean;
        pool: {
            weight: number;
            archetypeId: string;
        }[];
        mode: {
            kind: "interval";
            intervalSeconds: number;
            timeUntilNext: number;
        } | {
            kind: "wave";
            waves: {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }[];
            currentWaveIndex: number;
            waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
            waveTimeAccumulator: number;
            spawnedThisWave: number;
            betweenWaveDelay: number;
        } | {
            kind: "manual";
        };
        origin: {
            x: number;
            y: number;
            z: number;
        };
        totalSpawned: number;
        maxActive?: number | undefined;
        maxTotal?: number | undefined;
        rngSeed?: number | undefined;
    }, {
        shape: {
            kind: "point";
        } | {
            kind: "circle";
            radius: number;
        } | {
            kind: "line";
            from: {
                x: number;
                y: number;
                z: number;
            };
            to: {
                x: number;
                y: number;
                z: number;
            };
        } | {
            kind: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
        };
        id: string;
        enabled: boolean;
        pool: {
            weight: number;
            archetypeId: string;
        }[];
        mode: {
            kind: "interval";
            intervalSeconds: number;
            timeUntilNext: number;
        } | {
            kind: "wave";
            waves: {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }[];
            currentWaveIndex: number;
            waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
            waveTimeAccumulator: number;
            spawnedThisWave: number;
            betweenWaveDelay: number;
        } | {
            kind: "manual";
        };
        origin: {
            x: number;
            y: number;
            z: number;
        };
        totalSpawned: number;
        maxActive?: number | undefined;
        maxTotal?: number | undefined;
        rngSeed?: number | undefined;
    }>>;
    /** Provenance tag on entities produced by a `spawner`. Written
     *  by the system at spawn time; queried each tick to derive
     *  alive-counts (`world.with('spawnedBy')`) and to detect
     *  despawns via frame-diff. Never written by game code
     *  directly — call `forceSpawn(...)` instead of `world.add({
     *  ...spawnedBy(...) })`. */
    spawnedBy: z.ZodOptional<z.ZodObject<{
        spawnerId: z.ZodString;
        spawnedAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        spawnerId: string;
        spawnedAt: number;
    }, {
        spawnerId: string;
        spawnedAt: number;
    }>>;
    /** Damage-mitigation knobs (resistances, armor, immunities)
     *  read by `@unsupervised/features/combat`'s `applyDamage`. Optional;
     *  entities without this slot take damage at 100%. App-defined
     *  damage type strings serve as keys into the resistance and
     *  immunity collections. */
    combat: z.ZodOptional<z.ZodObject<{
        resistances: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        armor: z.ZodOptional<z.ZodNumber>;
        immunities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        resistances?: Record<string, number> | undefined;
        armor?: number | undefined;
        immunities?: string[] | undefined;
    }, {
        resistances?: Record<string, number> | undefined;
        armor?: number | undefined;
        immunities?: string[] | undefined;
    }>>;
    /** Active status effects on this entity. Mutated by
     *  `@unsupervised/features/status`: `applyStatusEffect` adds entries,
     *  `removeStatusEffect` splices them out, `statusEffectSystem`
     *  ticks `remainingSeconds` down each frame and fires onTick /
     *  onExpire callbacks. Effect DEFINITIONS (with their
     *  callbacks) live in the global registry — this slot holds
     *  only per-entity instance state. */
    statusEffects: z.ZodOptional<z.ZodArray<z.ZodObject<{
        defId: z.ZodString;
        remainingSeconds: z.ZodNumber;
        stackCount: z.ZodNumber;
        sourceEntityId: z.ZodOptional<z.ZodString>;
        appliedAt: z.ZodNumber;
        lastTickAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        defId: string;
        remainingSeconds: number;
        stackCount: number;
        appliedAt: number;
        lastTickAt: number;
        sourceEntityId?: string | undefined;
    }, {
        defId: string;
        remainingSeconds: number;
        stackCount: number;
        appliedAt: number;
        lastTickAt: number;
        sourceEntityId?: string | undefined;
    }>, "many">>;
    /** Stat-altering modifiers. Read by
     *  `@unsupervised/features/modifiers`'s `resolveStat(entity, stat,
     *  base)` to compute final stat values from a base + the sum
     *  of additive modifiers + the product of multiplicative
     *  modifiers (overrides short-circuit to a fixed value when
     *  present). Status effects, equipment hooks, and BT-driven
     *  buffs all push into this slot via `addModifier`; cleanup
     *  is by `source` tag via `removeModifiersBySource`.
     *
     *  The combat layer auto-reads two reserved stat names from
     *  this slot: `'damage-out'` (on the source) and
     *  `'damage-in'` (on the target). The casting layer
     *  auto-reads `'cast-speed'` (multiplies windup duration
     *  at cast start). Other stats are app-defined and read
     *  manually from game code. */
    modifiers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        stat: z.ZodString;
        op: z.ZodEnum<["add", "multiply", "override"]>;
        value: z.ZodNumber;
        source: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        id: string;
        stat: string;
        op: "add" | "multiply" | "override";
        source?: string | undefined;
        priority?: number | undefined;
    }, {
        value: number;
        id: string;
        stat: string;
        op: "add" | "multiply" | "override";
        source?: string | undefined;
        priority?: number | undefined;
    }>, "many">>;
    /** In-progress ability cast. Mutated by
     *  `@unsupervised/features/casting`: `startCast` creates the slot,
     *  `castingSystem` ticks `timeRemainingInPhase` down each
     *  frame and advances at phase boundaries, `interruptCast`
     *  clears the slot on stun. The slot's PRESENCE means the
     *  entity is mid-cast — `tryActivate` rejects with reason
     *  `'casting'` while it exists. Effect fires at the
     *  windup→active boundary; cooldown is set there too. */
    casting: z.ZodOptional<z.ZodObject<{
        abilityId: z.ZodString;
        phase: z.ZodEnum<["windup", "active", "recovery"]>;
        timeRemainingInPhase: z.ZodNumber;
        phaseTimings: z.ZodObject<{
            windup: z.ZodNumber;
            active: z.ZodNumber;
            recovery: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            active: number;
            windup: number;
            recovery: number;
        }, {
            active: number;
            windup: number;
            recovery: number;
        }>;
        activeOnEvent: z.ZodOptional<z.ZodString>;
        interruptible: z.ZodBoolean;
        windupElapsed: z.ZodNumber;
        targetEntityId: z.ZodOptional<z.ZodString>;
        targetPosition: z.ZodOptional<z.ZodObject<{
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
        }>>;
    }, "strip", z.ZodTypeAny, {
        abilityId: string;
        phase: "active" | "windup" | "recovery";
        timeRemainingInPhase: number;
        phaseTimings: {
            active: number;
            windup: number;
            recovery: number;
        };
        interruptible: boolean;
        windupElapsed: number;
        activeOnEvent?: string | undefined;
        targetEntityId?: string | undefined;
        targetPosition?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    }, {
        abilityId: string;
        phase: "active" | "windup" | "recovery";
        timeRemainingInPhase: number;
        phaseTimings: {
            active: number;
            windup: number;
            recovery: number;
        };
        interruptible: boolean;
        windupElapsed: number;
        activeOnEvent?: string | undefined;
        targetEntityId?: string | undefined;
        targetPosition?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    }>>;
    /** Singleton in-game clock state. Read / written by
     *  `@unsupervised/features/time`'s `gameClockSystem`. By convention
     *  lives on a single entity (e.g. `id: 'world-clock'`); the
     *  system locates it via a Miniplex `with('gameClock').first`
     *  query. Pausing this slot freezes scheduled handlers and
     *  NPC schedule progression. */
    gameClock: z.ZodOptional<z.ZodObject<{
        currentSeconds: z.ZodNumber;
        secondsPerDay: z.ZodNumber;
        paused: z.ZodBoolean;
        speedMultiplier: z.ZodNumber;
        currentPhase: z.ZodEnum<["dawn", "morning", "noon", "afternoon", "dusk", "night"]>;
        phaseThresholds: z.ZodObject<{
            dawn: z.ZodNumber;
            morning: z.ZodNumber;
            noon: z.ZodNumber;
            afternoon: z.ZodNumber;
            dusk: z.ZodNumber;
            night: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            dawn: number;
            morning: number;
            noon: number;
            afternoon: number;
            dusk: number;
            night: number;
        }, {
            dawn: number;
            morning: number;
            noon: number;
            afternoon: number;
            dusk: number;
            night: number;
        }>;
        dayOfWeek: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        currentSeconds: number;
        secondsPerDay: number;
        paused: boolean;
        speedMultiplier: number;
        currentPhase: "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
        phaseThresholds: {
            dawn: number;
            morning: number;
            noon: number;
            afternoon: number;
            dusk: number;
            night: number;
        };
        dayOfWeek: number;
    }, {
        currentSeconds: number;
        secondsPerDay: number;
        paused: boolean;
        speedMultiplier: number;
        currentPhase: "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
        phaseThresholds: {
            dawn: number;
            morning: number;
            noon: number;
            afternoon: number;
            dusk: number;
            night: number;
        };
        dayOfWeek: number;
    }>>;
    /** Singleton engine-wide time-dilation slot. Read / written by
     *  `@unsupervised/timescale`'s `setGlobalScale` / `easeGlobalScale` /
     *  `tickTimescale`. By convention lives on a single entity
     *  (`id: 'world-timescale'`); helpers locate it via
     *  `world.with('worldTimescale').first`. Consumers multiply their
     *  per-tick dt by `scale` (or use `effectiveScaleFor` to respect
     *  per-entity decoupling). The package auto-spawns the singleton
     *  via `ensureWorldTimescale`; apps don't need to spawn it
     *  themselves. */
    worldTimescale: z.ZodOptional<z.ZodObject<{
        scale: z.ZodNumber;
        ease: z.ZodOptional<z.ZodObject<{
            fromScale: z.ZodNumber;
            toScale: z.ZodNumber;
            currentMs: z.ZodNumber;
            durationMs: z.ZodNumber;
            curve: z.ZodEnum<["linear", "easeInQuad", "easeOutQuad", "easeInOutCubic"]>;
        }, "strip", z.ZodTypeAny, {
            fromScale: number;
            toScale: number;
            currentMs: number;
            durationMs: number;
            curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
        }, {
            fromScale: number;
            toScale: number;
            currentMs: number;
            durationMs: number;
            curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
        }>>;
    }, "strip", z.ZodTypeAny, {
        scale: number;
        ease?: {
            fromScale: number;
            toScale: number;
            currentMs: number;
            durationMs: number;
            curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
        } | undefined;
    }, {
        scale: number;
        ease?: {
            fromScale: number;
            toScale: number;
            currentMs: number;
            durationMs: number;
            curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
        } | undefined;
    }>>;
    /** Per-entity opt-out from the global timescale. Carries an
     *  override `scale` that `effectiveScaleFor` returns instead of
     *  the world's global value. Bullet-time's canonical use: the
     *  player entity carries `timeDecoupled({ scale: 1 })` so it
     *  stays at real-time while the world slows. */
    timeDecoupled: z.ZodOptional<z.ZodObject<{
        scale: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        scale: number;
    }, {
        scale?: number | undefined;
    }>>;
    /** Companion slot to `gameClock`: at / daily / every handles
     *  registered via `@unsupervised/features/time`'s scheduler. The
     *  system fires their callbacks (paired by `callbackId` at
     *  boot) when `gameClock.currentSeconds` crosses each
     *  handle's `nextFireAt`. JSON-shaped so save/load
     *  round-trips fired-state for one-shot handles. */
    scheduledHandlers: z.ZodOptional<z.ZodObject<{
        handles: z.ZodRecord<z.ZodString, z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<["at", "daily", "every"]>;
            callbackId: z.ZodString;
            nextFireAt: z.ZodNumber;
            intervalSeconds: z.ZodOptional<z.ZodNumber>;
            fired: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kind: "every" | "at" | "daily";
            callbackId: string;
            nextFireAt: number;
            fired: boolean;
            intervalSeconds?: number | undefined;
        }, {
            id: string;
            kind: "every" | "at" | "daily";
            callbackId: string;
            nextFireAt: number;
            fired: boolean;
            intervalSeconds?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        handles: Record<string, {
            id: string;
            kind: "every" | "at" | "daily";
            callbackId: string;
            nextFireAt: number;
            fired: boolean;
            intervalSeconds?: number | undefined;
        }>;
    }, {
        handles: Record<string, {
            id: string;
            kind: "every" | "at" | "daily";
            callbackId: string;
            nextFireAt: number;
            fired: boolean;
            intervalSeconds?: number | undefined;
        }>;
    }>>;
    /** NPC schedule slot. Holds the registered schedule's id +
     *  the system-maintained `activeEntryIndex` (which entry's
     *  time window covers the world's current time-of-day, or
     *  undefined for a gap). Apps wire behavior on top
     *  (BT conditions, waypoint movers); the time package
     *  doesn't depend on `@unsupervised/ai` / `@unsupervised/ai-bt`. */
    schedule: z.ZodOptional<z.ZodObject<{
        scheduleId: z.ZodString;
        activeEntryIndex: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        scheduleId: string;
        activeEntryIndex?: number | undefined;
    }, {
        scheduleId: string;
        activeEntryIndex?: number | undefined;
    }>>;
    /** Singleton tile-grid slot. Read / written by
     *  `@unsupervised/features/grid`'s pathfinding + LOS helpers. By
     *  convention lives on a single entity (e.g. `id:
     *  'world-grid'`); operations locate it via a Miniplex
     *  `with('grid').first` query. Holds width × height tiles
     *  in a flat row-major array. */
    grid: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        cellSize: z.ZodNumber;
        origin: z.ZodObject<{
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
        topology: z.ZodEnum<["4-way", "8-way"]>;
        tiles: z.ZodArray<z.ZodObject<{
            cost: z.ZodNumber;
            opaque: z.ZodBoolean;
            terrainId: z.ZodOptional<z.ZodString>;
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
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        height: number;
        origin: {
            x: number;
            y: number;
            z: number;
        };
        width: number;
        cellSize: number;
        topology: "4-way" | "8-way";
        tiles: {
            cost: number;
            opaque: boolean;
            terrainId?: string | undefined;
            cover?: number | undefined;
        }[];
    }, {
        height: number;
        origin: {
            x: number;
            y: number;
            z: number;
        };
        width: number;
        cellSize: number;
        topology: "4-way" | "8-way";
        tiles: {
            cost: number;
            opaque: boolean;
            terrainId?: string | undefined;
            cover?: number | undefined;
        }[];
    }>>;
    /** Per-entity tile coordinate. The GAMEPLAY source of truth
     *  for entities living on a grid; `transform.position` is
     *  the rendered position lerped toward the tile center each
     *  frame by `tileMoverSystem`. Game code mutates `coord`
     *  instantly; visuals catch up. */
    tilePosition: z.ZodOptional<z.ZodObject<{
        coord: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        coord: {
            x: number;
            y: number;
        };
    }, {
        coord: {
            x: number;
            y: number;
        };
    }>>;
    /** Tags an entity as a participant in a turn-based
     *  encounter. Read / written by `@unsupervised/features/turn`'s
     *  manager: AP economy, team membership, initiative, and
     *  the per-turn `hasActedThisTurn` flag. Add this slot via
     *  the `turnParticipant({...})` builder when spawning
     *  combatants; remove when an entity routs / dies. */
    turnParticipant: z.ZodOptional<z.ZodObject<{
        team: z.ZodString;
        initiative: z.ZodNumber;
        apMax: z.ZodNumber;
        apCurrent: z.ZodNumber;
        hasActedThisTurn: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        team: string;
        initiative: number;
        apMax: number;
        apCurrent: number;
        hasActedThisTurn: boolean;
    }, {
        team: string;
        initiative: number;
        apMax: number;
        apCurrent: number;
        hasActedThisTurn: boolean;
    }>>;
    /** Singleton turn FSM state. Read / written by
     *  `@unsupervised/features/turn`'s manager. By convention lives on
     *  a single entity (`id: 'world-turn-state'`); the manager
     *  locates it via `world.with('turnState').first`. Phase /
     *  queue / active entity / battle id all round-trip through
     *  save/load since the slot is JSON-shaped. */
    turnState: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<["individual", "team"]>;
        phase: z.ZodEnum<["idle", "awaiting-input", "resolving-action", "ended"]>;
        turnNumber: z.ZodNumber;
        activeEntityId: z.ZodOptional<z.ZodString>;
        activeTeam: z.ZodOptional<z.ZodString>;
        queue: z.ZodArray<z.ZodString, "many">;
        battleId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mode: "individual" | "team";
        phase: "idle" | "awaiting-input" | "resolving-action" | "ended";
        turnNumber: number;
        queue: string[];
        activeEntityId?: string | undefined;
        activeTeam?: string | undefined;
        battleId?: string | undefined;
    }, {
        mode: "individual" | "team";
        phase: "idle" | "awaiting-input" | "resolving-action" | "ended";
        turnNumber: number;
        queue: string[];
        activeEntityId?: string | undefined;
        activeTeam?: string | undefined;
        battleId?: string | undefined;
    }>>;
    /** Per-entity dialogue runner state. Read / written by
     *  `@unsupervised/features/dialogue`'s `startDialogue` /
     *  `chooseDialogue` / `endDialogue`. The slot's
     *  PRESENCE-AND-NON-NULL `activeScriptId` indicates the
     *  entity is mid-conversation; UIs query
     *  `getCurrentDialogueNode` + `getVisibleChoices` to render. */
    dialogue: z.ZodOptional<z.ZodObject<{
        activeScriptId: z.ZodNullable<z.ZodString>;
        currentNodeId: z.ZodNullable<z.ZodString>;
        history: z.ZodOptional<z.ZodArray<z.ZodObject<{
            nodeId: z.ZodString;
            choiceIndex: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            nodeId: string;
            choiceIndex: number;
        }, {
            nodeId: string;
            choiceIndex: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        activeScriptId: string | null;
        currentNodeId: string | null;
        history?: {
            nodeId: string;
            choiceIndex: number;
        }[] | undefined;
    }, {
        activeScriptId: string | null;
        currentNodeId: string | null;
        history?: {
            nodeId: string;
            choiceIndex: number;
        }[] | undefined;
    }>>;
    /** Per-entity quest journal. Read / written by
     *  `@unsupervised/features/quests`'s `startQuest` / `progressStep` /
     *  `completeQuest` / `failQuest` / `abandonQuest`. Active
     *  quests track their step index + counter; the auto-
     *  progression bus bridge increments counters as relevant
     *  events fire. Save/load round-trips for free. */
    quests: z.ZodOptional<z.ZodObject<{
        active: z.ZodArray<z.ZodObject<{
            questId: z.ZodString;
            currentStepIndex: z.ZodNumber;
            progress: z.ZodNumber;
            startedAt: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            questId: string;
            currentStepIndex: number;
            progress: number;
            startedAt: number;
        }, {
            questId: string;
            currentStepIndex: number;
            progress: number;
            startedAt: number;
        }>, "many">;
        completed: z.ZodArray<z.ZodString, "many">;
        failed: z.ZodArray<z.ZodString, "many">;
        abandoned: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        active: {
            questId: string;
            currentStepIndex: number;
            progress: number;
            startedAt: number;
        }[];
        completed: string[];
        failed: string[];
        abandoned: string[];
    }, {
        active: {
            questId: string;
            currentStepIndex: number;
            progress: number;
            startedAt: number;
        }[];
        completed: string[];
        failed: string[];
        abandoned: string[];
    }>>;
    /** Per-entity Steam-shape achievement tracker. Read /
     *  written by `@unsupervised/features/achievements`'s
     *  `incrementStat` / `setStat` / `unlockAchievement`. Tracks
     *  reusable stat counters + unlocked achievement ids +
     *  per-stat-threshold progress snapshots + the hiddenSeen
     *  set. Per-entity so party-RPG games can have per-PC
     *  trophies; single-PC games put the slot on the player. */
    achievements: z.ZodOptional<z.ZodObject<{
        unlocked: z.ZodArray<z.ZodString, "many">;
        unlockTimes: z.ZodRecord<z.ZodString, z.ZodNumber>;
        progress: z.ZodRecord<z.ZodString, z.ZodNumber>;
        stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
        hiddenSeen: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        progress: Record<string, number>;
        unlocked: string[];
        unlockTimes: Record<string, number>;
        stats: Record<string, number>;
        hiddenSeen: string[];
    }, {
        progress: Record<string, number>;
        unlocked: string[];
        unlockTimes: Record<string, number>;
        stats: Record<string, number>;
        hiddenSeen: string[];
    }>>;
    /** IK chains attached to this entity's rendered skeleton.
     *  Read by `@unsupervised/renderer-3d/ik`'s `<IkSolver>`, which
     *  resolves each chain's bone names against the live
     *  skeleton, runs CCD per frame after the animation mixer
     *  ticks, and pulls the end-effector toward the chain's
     *  target. Multiple chains per entity (foot-left + foot-right
     *  + head-look) are common; the array preserves authoring
     *  order which the solver ticks left-to-right (later chains
     *  see earlier chains' bone updates). */
    ikChains: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        chain: z.ZodArray<z.ZodString, "many">;
        target: z.ZodObject<{
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
        weight: z.ZodNumber;
        iterations: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        weight: number;
        target: {
            x: number;
            y: number;
            z: number;
        };
        chain: string[];
        iterations: number;
    }, {
        id: string;
        weight: number;
        target: {
            x: number;
            y: number;
            z: number;
        };
        chain: string[];
        iterations: number;
    }>, "many">>;
    /** Bone-attachment slot. Read by `@unsupervised/renderer-3d/attachments`'s
     *  `<BoneAttachmentDriver>`, which looks up the parent skinned
     *  entity in a per-world skinned-mesh registry, finds the named
     *  bone, and writes this entity's `transform` each frame to the
     *  bone's world transform composed with the per-attachment
     *  local `offset`. Apps wire model + collider + audio + physics
     *  on the SAME entity — the driver only writes transform; the
     *  rest stays orthogonal. */
    boneAttachment: z.ZodOptional<z.ZodObject<{
        parentEntityId: z.ZodString;
        boneName: z.ZodString;
        offset: z.ZodObject<{
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
            scale: z.ZodObject<{
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
            scale: {
                x: number;
                y: number;
                z: number;
            };
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
            scale: {
                x: number;
                y: number;
                z: number;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        offset: {
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
            scale: {
                x: number;
                y: number;
                z: number;
            };
        };
        parentEntityId: string;
        boneName: string;
    }, {
        offset: {
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
            scale: {
                x: number;
                y: number;
                z: number;
            };
        };
        parentEntityId: string;
        boneName: string;
    }>>;
    /** Per-character platformer-controller state. Read / written
     *  by `@unsupervised/features/platformer`'s `platformerSystem(world,
     *  dt, input)`. Carries the feel-tuning (jump height, ground
     *  speed, coyote time, jump buffer, air control, gravity,
     *  fall-gravity multiplier, ground friction) + the action map
     *  + system-maintained bookkeeping (grounded flag, last-
     *  grounded time, last-jump-pressed time, accumulated seconds,
     *  jumpedThisTick). The system writes `entity.velocity.linear`
     *  each tick; apps wire either `movementSystem` (for
     *  no-physics characters — apps that want simple Y-collision
     *  via the `isGrounded` callback) OR a Rapier kinematic
     *  integrator (engine-3d follow-on; not shipped in v1). */
    platformerState: z.ZodOptional<z.ZodObject<{
        tuning: z.ZodObject<{
            jumpHeight: z.ZodNumber;
            groundSpeed: z.ZodNumber;
            airControl: z.ZodNumber;
            gravity: z.ZodNumber;
            fallGravityMultiplier: z.ZodNumber;
            coyoteTime: z.ZodNumber;
            jumpBuffer: z.ZodNumber;
            groundFriction: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            jumpHeight: number;
            groundSpeed: number;
            airControl: number;
            gravity: number;
            fallGravityMultiplier: number;
            coyoteTime: number;
            jumpBuffer: number;
            groundFriction: number;
        }, {
            jumpHeight: number;
            groundSpeed: number;
            airControl: number;
            gravity: number;
            fallGravityMultiplier: number;
            coyoteTime: number;
            jumpBuffer: number;
            groundFriction: number;
        }>;
        actions: z.ZodObject<{
            moveForward: z.ZodString;
            moveBack: z.ZodString;
            moveLeft: z.ZodString;
            moveRight: z.ZodString;
            jump: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            moveForward: string;
            moveBack: string;
            moveLeft: string;
            moveRight: string;
            jump: string;
        }, {
            moveForward: string;
            moveBack: string;
            moveLeft: string;
            moveRight: string;
            jump: string;
        }>;
        accumulatedSeconds: z.ZodNumber;
        lastGroundedAt: z.ZodNumber;
        lastJumpPressedAt: z.ZodNumber;
        grounded: z.ZodBoolean;
        jumpedThisTick: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        tuning: {
            jumpHeight: number;
            groundSpeed: number;
            airControl: number;
            gravity: number;
            fallGravityMultiplier: number;
            coyoteTime: number;
            jumpBuffer: number;
            groundFriction: number;
        };
        actions: {
            moveForward: string;
            moveBack: string;
            moveLeft: string;
            moveRight: string;
            jump: string;
        };
        accumulatedSeconds: number;
        lastGroundedAt: number;
        lastJumpPressedAt: number;
        grounded: boolean;
        jumpedThisTick: boolean;
    }, {
        tuning: {
            jumpHeight: number;
            groundSpeed: number;
            airControl: number;
            gravity: number;
            fallGravityMultiplier: number;
            coyoteTime: number;
            jumpBuffer: number;
            groundFriction: number;
        };
        actions: {
            moveForward: string;
            moveBack: string;
            moveLeft: string;
            moveRight: string;
            jump: string;
        };
        accumulatedSeconds: number;
        lastGroundedAt: number;
        lastJumpPressedAt: number;
        grounded: boolean;
        jumpedThisTick: boolean;
    }>>;
    /** Per-follower squad formation slot. Read by
     *  `@unsupervised/features/platformer`'s `squadFormationSystem(world,
     *  dt)`, which writes `entity.velocity.linear` to seek a
     *  desired formation slot computed as `leader.transform.position
     *  + offset` with exponential damping. Reactive behaviors
     *  (attack / regroup / disperse) live in a separate behavior
     *  tree — the BT mutates this slot's `offset` or removes the
     *  slot entirely while a member is in attack mode. */
    squadFormation: z.ZodOptional<z.ZodObject<{
        leaderEntityId: z.ZodString;
        offset: z.ZodObject<{
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
        followDamping: z.ZodNumber;
        maxSpeed: z.ZodNumber;
        arrivalRadius: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        arrivalRadius: number;
        maxSpeed: number;
        leaderEntityId: string;
        offset: {
            x: number;
            y: number;
            z: number;
        };
        followDamping: number;
    }, {
        arrivalRadius: number;
        maxSpeed: number;
        leaderEntityId: string;
        offset: {
            x: number;
            y: number;
            z: number;
        };
        followDamping: number;
    }>>;
    /** Singleton beat-clock slot. Read / written by
     *  `@unsupervised/features/rhythm`'s `rhythmSystem`. Lives on a single
     *  entity (typically `id: 'world-beat'`); the system locates
     *  it via `world.with('beatClock').first`. The clock advances
     *  in real-time seconds from per-tick `dt`; apps drive BPM-
     *  aligned hit windows for ability gating, score combos, and
     *  beat-synced VFX off this slot. Apps using
     *  `bootEngine{2,3}D({ fixedTimestep })` get bit-identical
     *  replay automatically. */
    beatClock: z.ZodOptional<z.ZodObject<{
        bpm: z.ZodNumber;
        hitWindowSeconds: z.ZodNumber;
        beatsPerMeasure: z.ZodNumber;
        running: z.ZodBoolean;
        currentSeconds: z.ZodNumber;
        lastFiredBeatIndex: z.ZodNumber;
        inHitWindow: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        currentSeconds: number;
        bpm: number;
        hitWindowSeconds: number;
        beatsPerMeasure: number;
        running: boolean;
        lastFiredBeatIndex: number;
        inHitWindow: boolean;
    }, {
        currentSeconds: number;
        bpm: number;
        hitWindowSeconds: number;
        beatsPerMeasure: number;
        running: boolean;
        lastFiredBeatIndex: number;
        inHitWindow: boolean;
    }>>;
    /** Singleton cutscene player state. Read / written by
     *  `@unsupervised/features/cinematic`'s `createCinematicSystem`.
     *  Lives on a single entity (typically `id:
     *  'world-cinematic'`); the system locates it via
     *  `world.with('cinematic').first`. Sibling systems
     *  (casting, abilities, spawn, save) read this slot via
     *  `isCinematicGating(world)` to suspend their work while
     *  `phase === 'playing'`. Runtime-only — NOT persisted
     *  across save/load. */
    cinematic: z.ZodOptional<z.ZodObject<{
        activeCutsceneId: z.ZodNullable<z.ZodString>;
        phase: z.ZodEnum<["idle", "preparing", "playing", "completing", "completed"]>;
        clockSeconds: z.ZodNumber;
        firedIndices: z.ZodArray<z.ZodNumber, "many">;
        skipRequested: z.ZodBoolean;
        paused: z.ZodBoolean;
        fadeAlpha: z.ZodNumber;
        fadeColor: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        phase: "idle" | "completed" | "playing" | "preparing" | "completing";
        paused: boolean;
        activeCutsceneId: string | null;
        clockSeconds: number;
        firedIndices: number[];
        skipRequested: boolean;
        fadeAlpha: number;
        fadeColor: string;
    }, {
        phase: "idle" | "completed" | "playing" | "preparing" | "completing";
        paused: boolean;
        activeCutsceneId: string | null;
        clockSeconds: number;
        firedIndices: number[];
        skipRequested: boolean;
        fadeAlpha: number;
        fadeColor: string;
    }>>;
    /** Singleton camera-handoff slot for cinematic camera tracks.
     *  Written by `@unsupervised/features/cinematic` when a `camera`
     *  track fires; read by `@unsupervised/renderer-3d`'s
     *  `<CinematicCameraDriver>`. The three camera presets
     *  (`<FollowCamera>` / `<OrbitCamera>` / `<FixedAngleCamera>`)
     *  yield `makeDefault` while this slot is present and retake
     *  it on slot removal. Runtime-only — NOT persisted. */
    cinematicCamera: z.ZodOptional<z.ZodObject<{
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
        lookAt: z.ZodObject<{
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
        fov: z.ZodOptional<z.ZodNumber>;
        tweenSourcePosition: z.ZodObject<{
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
        tweenSourceLookAt: z.ZodObject<{
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
        tweenSourceFov: z.ZodOptional<z.ZodNumber>;
        tweenFromSeconds: z.ZodNumber;
        tweenToSeconds: z.ZodNumber;
        ease: z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out"]>;
    }, "strip", z.ZodTypeAny, {
        position: {
            x: number;
            y: number;
            z: number;
        };
        lookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourcePosition: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourceLookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenFromSeconds: number;
        tweenToSeconds: number;
        ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
        fov?: number | undefined;
        tweenSourceFov?: number | undefined;
    }, {
        position: {
            x: number;
            y: number;
            z: number;
        };
        lookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourcePosition: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourceLookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenFromSeconds: number;
        tweenToSeconds: number;
        ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
        fov?: number | undefined;
        tweenSourceFov?: number | undefined;
    }>>;
    /** World-space AABB trigger zone. Read by
     *  `@unsupervised/features/triggers`'s
     *  `createTriggerVolumeSystem`, which compares every
     *  `triggerActor`-tagged entity's `transform` (offset by
     *  the actor's `halfExtents`) against this volume's
     *  `[min, max]` each tick and fires `'trigger:entered'`
     *  / `'trigger:exited'` on the world's event bus. The
     *  `fireMode: 'once'` mode auto-consumes after the first
     *  enter; saves round-trip the consumed flag for free. */
    triggerVolume: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        min: z.ZodObject<{
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
        max: z.ZodObject<{
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
        fireMode: z.ZodDefault<z.ZodEnum<["multi", "once"]>>;
        consumed: z.ZodDefault<z.ZodBoolean>;
        category: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodString>;
        payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
        fireMode: "multi" | "once";
        consumed: boolean;
        filter?: string | undefined;
        payload?: Record<string, unknown> | undefined;
        category?: string | undefined;
    }, {
        id: string;
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
        filter?: string | undefined;
        payload?: Record<string, unknown> | undefined;
        fireMode?: "multi" | "once" | undefined;
        consumed?: boolean | undefined;
        category?: string | undefined;
    }>>;
    /** Opt-in tag making an entity visible to the trigger
     *  system. Without this slot, the entity is excluded
     *  from AABB overlap checks regardless of its transform —
     *  most entities (scenery, projectiles, particle anchors)
     *  don't need trigger interaction so the opt-in keeps the
     *  per-tick cost at O(triggers × actors) instead of
     *  O(triggers × all-entities). Carries an optional `tag`
     *  matched against `triggerVolume.filter` and an optional
     *  `halfExtents` for avatar-shaped overlap. */
    triggerActor: z.ZodOptional<z.ZodObject<{
        tag: z.ZodOptional<z.ZodString>;
        halfExtents: z.ZodOptional<z.ZodObject<{
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
        }>>;
    }, "strip", z.ZodTypeAny, {
        halfExtents?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        tag?: string | undefined;
    }, {
        halfExtents?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        tag?: string | undefined;
    }>>;
    /** Top-down kinematic character controller (JRPG /
     *  ARPG / top-down shooter shape). Read by
     *  `@unsupervised/features/character`'s
     *  `topDownCharacterSystem`. Apps write the per-frame
     *  `intent` vector each tick from input / AI / scripted
     *  control; the system scales by `speed` and writes the
     *  result to `entity.velocity.linear`, or integrates
     *  `transform.position` directly when no `velocity` slot
     *  exists (no-physics path). Optional rotate-to-facing
     *  with exponential damping. SISTER recipe to the
     *  jump-focused `platformerState` slot. */
    topDownCharacter: z.ZodOptional<z.ZodObject<{
        speed: z.ZodDefault<z.ZodNumber>;
        rotateToFacing: z.ZodDefault<z.ZodBoolean>;
        rotationDamping: z.ZodDefault<z.ZodNumber>;
        intent: z.ZodDefault<z.ZodObject<{
            x: z.ZodDefault<z.ZodNumber>;
            z: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            z: number;
        }, {
            x?: number | undefined;
            z?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        speed: number;
        rotateToFacing: boolean;
        rotationDamping: number;
        intent: {
            x: number;
            z: number;
        };
    }, {
        speed?: number | undefined;
        rotateToFacing?: boolean | undefined;
        rotationDamping?: number | undefined;
        intent?: {
            x?: number | undefined;
            z?: number | undefined;
        } | undefined;
    }>>;
    /** Phase 2: Rapier KinematicCharacterController tuning slot.
     *  Applied to a kinematic-capsule entity to enable slope-aware
     *  locomotion (slope-climb, autostep, snap-to-ground,
     *  ceiling-slide). The engine-3d `createCharacterControllerSystem`
     *  factory builds the per-tick driver; apps wire it into
     *  `bootEngine3D({ prePhysicsSystems })`. The system reads
     *  `entity.velocity.linear` as the desired translation delta and
     *  writes `body.setNextKinematicTranslation` with the resolved
     *  motion. `grounded` is system-written; apps READ for jump
     *  gates / landing VFX. */
    characterController: z.ZodOptional<z.ZodObject<{
        offset: z.ZodOptional<z.ZodNumber>;
        maxSlopeClimbAngle: z.ZodOptional<z.ZodNumber>;
        minSlopeSlideAngle: z.ZodOptional<z.ZodNumber>;
        autostep: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            maxHeight: z.ZodNumber;
            minWidth: z.ZodNumber;
            includeDynamicBodies: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            maxHeight: number;
            minWidth: number;
            includeDynamicBodies: boolean;
        }, {
            maxHeight: number;
            minWidth: number;
            includeDynamicBodies: boolean;
        }>>>;
        snapToGroundDistance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        applyImpulsesToDynamics: z.ZodOptional<z.ZodBoolean>;
        characterMass: z.ZodOptional<z.ZodNumber>;
        grounded: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        grounded?: boolean | undefined;
        offset?: number | undefined;
        maxSlopeClimbAngle?: number | undefined;
        minSlopeSlideAngle?: number | undefined;
        autostep?: {
            maxHeight: number;
            minWidth: number;
            includeDynamicBodies: boolean;
        } | null | undefined;
        snapToGroundDistance?: number | null | undefined;
        applyImpulsesToDynamics?: boolean | undefined;
        characterMass?: number | undefined;
    }, {
        grounded?: boolean | undefined;
        offset?: number | undefined;
        maxSlopeClimbAngle?: number | undefined;
        minSlopeSlideAngle?: number | undefined;
        autostep?: {
            maxHeight: number;
            minWidth: number;
            includeDynamicBodies: boolean;
        } | null | undefined;
        snapToGroundDistance?: number | null | undefined;
        applyImpulsesToDynamics?: boolean | undefined;
        characterMass?: number | undefined;
    }>>;
    /** Phase 2: Ultrahand pickup state on a grabber entity. The
     *  `@unsupervised/features/grab` system reconciles per-tick: held body
     *  follows the guide point (camera-forward × holdDistance),
     *  rotates relative to the grabber, auto-releases on
     *  target-lost / distance-exceeded. Apps drive via the
     *  imperative `createGrabSystem(...).{startGrab, releaseGrab,
     *  weldHeldTo, adjustHoldDistance, rotateHeld, setGuide}` API.
     *  The held body is temporarily kinematic-position-based and
     *  restores to its prior body type on release/weld. */
    grabState: z.ZodOptional<z.ZodObject<{
        heldEntityId: z.ZodNullable<z.ZodString>;
        holdDistance: z.ZodNumber;
        rotationOffset: z.ZodObject<{
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
        previousBodyType: z.ZodOptional<z.ZodEnum<["dynamic", "static", "kinematic"]>>;
    }, "strip", z.ZodTypeAny, {
        heldEntityId: string | null;
        holdDistance: number;
        rotationOffset: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    }, {
        heldEntityId: string | null;
        holdDistance: number;
        rotationOffset: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    }>>;
    /** Phase 3: TotK Recall trajectory rewind opt-in slot. The
     *  `@unsupervised/features/recall` system records position + rotation
     *  + linear/angular velocity samples each fixed tick into a
     *  side-table ring buffer. `startRecall(entity)` swaps the
     *  body to kinematic and plays back head → tail; on completion
     *  the prior body type is restored AND the tail-sample velocity
     *  is re-applied so the object resumes its original motion at
     *  the rewind start. The ring buffer is system-owned and NOT
     *  save-round-tripped; saves mid-recall load with an empty
     *  buffer. */
    recallable: z.ZodOptional<z.ZodObject<{
        capacity: z.ZodOptional<z.ZodNumber>;
        phase: z.ZodOptional<z.ZodEnum<["idle", "playing"]>>;
        previousBodyType: z.ZodOptional<z.ZodEnum<["dynamic", "static", "kinematic"]>>;
    }, "strip", z.ZodTypeAny, {
        capacity?: number | undefined;
        phase?: "idle" | "playing" | undefined;
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    }, {
        capacity?: number | undefined;
        phase?: "idle" | "playing" | undefined;
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    }>>;
    /** Phase 3: TotK Ascend kinematic-rise slot. The
     *  `@unsupervised/features/ascend` system probes upward via shape-cast,
     *  computes the landing Y at the ceiling slab top, swaps body
     *  to kinematic, and ticks upward at `riseSpeed` until arrival.
     *  KCC MUST skip ascending entities (see ascend/CLAUDE.md). */
    ascendState: z.ZodOptional<z.ZodObject<{
        phase: z.ZodEnum<["idle", "rising"]>;
        targetY: z.ZodOptional<z.ZodNumber>;
        riseSpeed: z.ZodOptional<z.ZodNumber>;
        maxAscendHeight: z.ZodOptional<z.ZodNumber>;
        previousBodyType: z.ZodOptional<z.ZodEnum<["dynamic", "static", "kinematic"]>>;
    }, "strip", z.ZodTypeAny, {
        phase: "idle" | "rising";
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
        targetY?: number | undefined;
        riseSpeed?: number | undefined;
        maxAscendHeight?: number | undefined;
    }, {
        phase: "idle" | "rising";
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
        targetY?: number | undefined;
        riseSpeed?: number | undefined;
        maxAscendHeight?: number | undefined;
    }>>;
    /** Phase 3: Fluid region. The `@unsupervised/features/buoyancy` system
     *  detects AABB overlap between this volume and `buoyant`
     *  bodies, then applies upward buoyancy force + linear/angular
     *  drag each prePhysics tick. v1 water surface is flat. */
    waterVolume: z.ZodOptional<z.ZodObject<{
        bounds: z.ZodObject<{
            min: z.ZodObject<{
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
            max: z.ZodObject<{
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
        }, "strip", z.ZodTypeAny, {
            max: {
                x: number;
                y: number;
                z: number;
            };
            min: {
                x: number;
                y: number;
                z: number;
            };
        }, {
            max: {
                x: number;
                y: number;
                z: number;
            };
            min: {
                x: number;
                y: number;
                z: number;
            };
        }>;
        density: z.ZodOptional<z.ZodNumber>;
        linearDrag: z.ZodOptional<z.ZodNumber>;
        angularDrag: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        bounds: {
            max: {
                x: number;
                y: number;
                z: number;
            };
            min: {
                x: number;
                y: number;
                z: number;
            };
        };
        density?: number | undefined;
        linearDrag?: number | undefined;
        angularDrag?: number | undefined;
    }, {
        bounds: {
            max: {
                x: number;
                y: number;
                z: number;
            };
            min: {
                x: number;
                y: number;
                z: number;
            };
        };
        density?: number | undefined;
        linearDrag?: number | undefined;
        angularDrag?: number | undefined;
    }>>;
    /** Phase 3: Opt-in fluid-affected dynamic body. Pairs with
     *  one or more `waterVolume` entities. The system computes
     *  submerged volume via AABB intersection and applies buoyancy
     *  force = `up × waterDensity × submergedVolume × gravity`. */
    buoyant: z.ZodOptional<z.ZodObject<{
        density: z.ZodOptional<z.ZodNumber>;
        dragMultiplier: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        density?: number | undefined;
        dragMultiplier?: number | undefined;
    }, {
        density?: number | undefined;
        dragMultiplier?: number | undefined;
    }>>;
    /** Renderer Tier 3b: Projector-based decal. Stamps a texture
     *  onto a target entity's mesh (`targetEntityId` → `decalTarget`).
     *  `<DecalDriver>` materializes `DecalGeometry` on first sight +
     *  mounts the result as a child of the target Mesh; transform
     *  inheritance carries decals along when targets move. Optional
     *  `lifetime` + `fadeOut` for bullet holes / blood / footprints
     *  with a finite shelf life. */
    decal: z.ZodOptional<z.ZodObject<{
        textureUrl: z.ZodString;
        targetEntityId: z.ZodString;
        projectorPosition: z.ZodObject<{
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
        projectorRotation: z.ZodObject<{
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
        size: z.ZodObject<{
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
        opacity: z.ZodOptional<z.ZodNumber>;
        lifetime: z.ZodOptional<z.ZodNumber>;
        fadeOut: z.ZodOptional<z.ZodBoolean>;
        spawnedAt: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        targetEntityId: string;
        textureUrl: string;
        projectorPosition: {
            x: number;
            y: number;
            z: number;
        };
        projectorRotation: {
            x: number;
            y: number;
            z: number;
        };
        size: {
            x: number;
            y: number;
            z: number;
        };
        opacity?: number | undefined;
        spawnedAt?: number | undefined;
        lifetime?: number | undefined;
        fadeOut?: boolean | undefined;
    }, {
        targetEntityId: string;
        textureUrl: string;
        projectorPosition: {
            x: number;
            y: number;
            z: number;
        };
        projectorRotation: {
            x: number;
            y: number;
            z: number;
        };
        size: {
            x: number;
            y: number;
            z: number;
        };
        opacity?: number | undefined;
        spawnedAt?: number | undefined;
        lifetime?: number | undefined;
        fadeOut?: boolean | undefined;
    }>>;
    /** Renderer Tier 3b: Marker slot. Entities with this set auto-
     *  register their renderable Mesh in the per-canvas
     *  `DecalTargetRegistry` so decals can resolve them. */
    decalTarget: z.ZodOptional<z.ZodBoolean>;
    /** Renderer Tier 3b: Distance-based LOD configuration.
     *  `createLodSystem` rewrites `renderable.modelId` (3D variant)
     *  per tick to match the active level for the entity's camera
     *  distance. */
    lod: z.ZodOptional<z.ZodObject<{
        levels: z.ZodArray<z.ZodObject<{
            distance: z.ZodNumber;
            modelId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            modelId: string;
            distance: number;
        }, {
            modelId: string;
            distance: number;
        }>, "many">;
        hysteresis: z.ZodOptional<z.ZodNumber>;
        activeIndex: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        levels: {
            modelId: string;
            distance: number;
        }[];
        hysteresis?: number | undefined;
        activeIndex?: number | undefined;
    }, {
        levels: {
            modelId: string;
            distance: number;
        }[];
        hysteresis?: number | undefined;
        activeIndex?: number | undefined;
    }>>;
    /** Singleton trauma-style camera shake. Lives on a single
     *  entity (typically `id: 'world-screen-shake'`); the
     *  system locates it via
     *  `world.with('screenShake').first`. Ticked by
     *  `@unsupervised/features/screenShake`'s
     *  `screenShakeSystem(world, dt)` (decays intensity per
     *  tick + bumps sampleIndex); read each frame by
     *  `@unsupervised/renderer-3d`'s `<ScreenShakeDriver>` which
     *  samples deterministic noise and mutates the active
     *  camera. Composes cleanly with both the gameplay
     *  cameras (`<FollowCamera>` / `<FixedAngleCamera>` /
     *  `<OrbitCamera>`) and the `<CinematicCameraDriver>`. */
    screenShake: z.ZodOptional<z.ZodObject<{
        intensity: z.ZodDefault<z.ZodNumber>;
        maxOffset: z.ZodDefault<z.ZodNumber>;
        maxRotation: z.ZodDefault<z.ZodNumber>;
        decay: z.ZodDefault<z.ZodNumber>;
        seed: z.ZodDefault<z.ZodNumber>;
        sampleIndex: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        intensity: number;
        maxOffset: number;
        maxRotation: number;
        decay: number;
        seed: number;
        sampleIndex: number;
    }, {
        intensity?: number | undefined;
        maxOffset?: number | undefined;
        maxRotation?: number | undefined;
        decay?: number | undefined;
        seed?: number | undefined;
        sampleIndex?: number | undefined;
    }>>;
    /** Singleton impact-frame freeze + flash. Lives on a single
     *  entity (typically `id: 'world-impact-frame'`); the system
     *  locates it via `world.with('impactFrame').first`. Ticked by
     *  `@unsupervised/features/impactFrame`'s `createImpactFrameSystem`
     *  (decrements `remainingSeconds` per tick, fires
     *  `'impactFrame:ended'` at zero); read each frame by
     *  `@unsupervised/renderer-3d`'s `<ImpactFrameFlash>` post-pass which
     *  mixes `color` over the rendered scene by the hold-then-fade
     *  alpha curve. Apps gate sibling systems (animation, AI,
     *  physics) on `isImpactFrameActive(world)` to produce the
     *  freeze semantic. The "punch lands" anime primitive —
     *  pairs naturally with `screenShake` for the canonical
     *  hit-impact composition. */
    impactFrame: z.ZodOptional<z.ZodObject<{
        active: z.ZodDefault<z.ZodBoolean>;
        remainingSeconds: z.ZodDefault<z.ZodNumber>;
        totalDurationSeconds: z.ZodDefault<z.ZodNumber>;
        color: z.ZodDefault<z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
        }, {
            r: number;
            g: number;
            b: number;
        }>>;
        flashIntensity: z.ZodDefault<z.ZodNumber>;
        holdRatio: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        remainingSeconds: number;
        active: boolean;
        color: {
            r: number;
            g: number;
            b: number;
        };
        totalDurationSeconds: number;
        flashIntensity: number;
        holdRatio: number;
    }, {
        remainingSeconds?: number | undefined;
        active?: boolean | undefined;
        color?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        totalDurationSeconds?: number | undefined;
        flashIntensity?: number | undefined;
        holdRatio?: number | undefined;
    }>>;
    /** Per-entity vehicle slot. Read + written by
     *  `@unsupervised/features/vehicle`'s system, which composes
     *  Rapier's `DynamicRayCastVehicleController` against the
     *  entity's bound Rapier body. Carries per-wheel
     *  descriptions, engine + brake force, suspension tuning,
     *  steering response, and the input action ids to read each
     *  tick. Co-author with a `physics` slot (the chassis
     *  body) — vehicles without a Rapier body silently no-op.
     *  The `currentSteer` / `currentThrottle` / `currentBrake`
     *  fields are system-maintained per-tick state useful for
     *  HUD readouts + animation-clip selection. */
    vehicle: z.ZodOptional<z.ZodObject<{
        enginePower: z.ZodNumber;
        brakeForce: z.ZodNumber;
        handbrakeForce: z.ZodDefault<z.ZodNumber>;
        maxSteerAngle: z.ZodNumber;
        steerResponseRate: z.ZodNumber;
        wheels: z.ZodArray<z.ZodObject<{
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
            radius: z.ZodNumber;
            directionDown: z.ZodDefault<z.ZodObject<{
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
            }>>;
            axleAxis: z.ZodDefault<z.ZodObject<{
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
            }>>;
            suspensionRestLength: z.ZodNumber;
            suspensionMaxTravel: z.ZodNumber;
            steerable: z.ZodDefault<z.ZodBoolean>;
            driven: z.ZodDefault<z.ZodBoolean>;
            friction: z.ZodDefault<z.ZodNumber>;
            sideFriction: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            position: {
                x: number;
                y: number;
                z: number;
            };
            radius: number;
            friction: number;
            directionDown: {
                x: number;
                y: number;
                z: number;
            };
            axleAxis: {
                x: number;
                y: number;
                z: number;
            };
            suspensionRestLength: number;
            suspensionMaxTravel: number;
            steerable: boolean;
            driven: boolean;
            sideFriction: number;
        }, {
            position: {
                x: number;
                y: number;
                z: number;
            };
            radius: number;
            suspensionRestLength: number;
            suspensionMaxTravel: number;
            friction?: number | undefined;
            directionDown?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
            axleAxis?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
            steerable?: boolean | undefined;
            driven?: boolean | undefined;
            sideFriction?: number | undefined;
        }>, "many">;
        suspensionStiffness: z.ZodNumber;
        suspensionDampingCompression: z.ZodNumber;
        suspensionDampingRebound: z.ZodNumber;
        suspensionMaxForce: z.ZodDefault<z.ZodNumber>;
        actions: z.ZodDefault<z.ZodObject<{
            accelerate: z.ZodDefault<z.ZodString>;
            brake: z.ZodDefault<z.ZodString>;
            steerLeft: z.ZodDefault<z.ZodString>;
            steerRight: z.ZodDefault<z.ZodString>;
            steerAxis: z.ZodDefault<z.ZodString>;
            handbrake: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            accelerate: string;
            brake: string;
            steerLeft: string;
            steerRight: string;
            steerAxis: string;
            handbrake: string;
        }, {
            accelerate?: string | undefined;
            brake?: string | undefined;
            steerLeft?: string | undefined;
            steerRight?: string | undefined;
            steerAxis?: string | undefined;
            handbrake?: string | undefined;
        }>>;
        autoLevelStiffness: z.ZodDefault<z.ZodNumber>;
        lockRollPitch: z.ZodDefault<z.ZodBoolean>;
        currentSteer: z.ZodDefault<z.ZodNumber>;
        currentThrottle: z.ZodDefault<z.ZodNumber>;
        currentBrake: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        actions: {
            accelerate: string;
            brake: string;
            steerLeft: string;
            steerRight: string;
            steerAxis: string;
            handbrake: string;
        };
        enginePower: number;
        brakeForce: number;
        handbrakeForce: number;
        maxSteerAngle: number;
        steerResponseRate: number;
        wheels: {
            position: {
                x: number;
                y: number;
                z: number;
            };
            radius: number;
            friction: number;
            directionDown: {
                x: number;
                y: number;
                z: number;
            };
            axleAxis: {
                x: number;
                y: number;
                z: number;
            };
            suspensionRestLength: number;
            suspensionMaxTravel: number;
            steerable: boolean;
            driven: boolean;
            sideFriction: number;
        }[];
        suspensionStiffness: number;
        suspensionDampingCompression: number;
        suspensionDampingRebound: number;
        suspensionMaxForce: number;
        autoLevelStiffness: number;
        lockRollPitch: boolean;
        currentSteer: number;
        currentThrottle: number;
        currentBrake: number;
    }, {
        enginePower: number;
        brakeForce: number;
        maxSteerAngle: number;
        steerResponseRate: number;
        wheels: {
            position: {
                x: number;
                y: number;
                z: number;
            };
            radius: number;
            suspensionRestLength: number;
            suspensionMaxTravel: number;
            friction?: number | undefined;
            directionDown?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
            axleAxis?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
            steerable?: boolean | undefined;
            driven?: boolean | undefined;
            sideFriction?: number | undefined;
        }[];
        suspensionStiffness: number;
        suspensionDampingCompression: number;
        suspensionDampingRebound: number;
        actions?: {
            accelerate?: string | undefined;
            brake?: string | undefined;
            steerLeft?: string | undefined;
            steerRight?: string | undefined;
            steerAxis?: string | undefined;
            handbrake?: string | undefined;
        } | undefined;
        handbrakeForce?: number | undefined;
        suspensionMaxForce?: number | undefined;
        autoLevelStiffness?: number | undefined;
        lockRollPitch?: boolean | undefined;
        currentSteer?: number | undefined;
        currentThrottle?: number | undefined;
        currentBrake?: number | undefined;
    }>>;
    /** Per-entity blendshape (morph-target) animation state. Read by
     *  `@unsupervised/features/blendshape`'s `blendshapeSystem` (advances
     *  per-clip `elapsed`, removes finished non-looping clips) and
     *  by `@unsupervised/renderer-3d`'s `<BlendshapeDriver>` (resolves
     *  weights from `playing` + `liveTargets`, writes to every
     *  descendant SkinnedMesh's `morphTargetInfluences`). Mutated
     *  via `playBlendshapeClip` / `stopBlendshapeClip` /
     *  `setLiveBlendshape` / `clearLiveBlendshapes` operations.
     *  The slot is JSON-shaped — save / load round-trips
     *  mid-clip state including elapsed times. */
    blendshape: z.ZodOptional<z.ZodObject<{
        playing: z.ZodArray<z.ZodObject<{
            clipId: z.ZodString;
            elapsed: z.ZodNumber;
            loop: z.ZodBoolean;
            weight: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            weight: number;
            clipId: string;
            loop: boolean;
            elapsed: number;
        }, {
            weight: number;
            clipId: string;
            loop: boolean;
            elapsed: number;
        }>, "many">;
        liveTargets: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        playing: {
            weight: number;
            clipId: string;
            loop: boolean;
            elapsed: number;
        }[];
        liveTargets: Record<string, number>;
    }, {
        playing: {
            weight: number;
            clipId: string;
            loop: boolean;
            elapsed: number;
        }[];
        liveTargets: Record<string, number>;
    }>>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    transform?: {
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
        scale: {
            x: number;
            y: number;
            z: number;
        };
    } | undefined;
    velocity?: {
        linear: {
            x: number;
            y: number;
            z: number;
        };
        angular: {
            x: number;
            y: number;
            z: number;
        };
    } | undefined;
    renderable?: {
        type: "2d";
        spriteId: string;
        tint?: number | undefined;
        zIndex?: number | undefined;
        visible?: boolean | undefined;
        anchor?: {
            x: number;
            y: number;
        } | undefined;
        opacity?: number | undefined;
        blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
    } | {
        type: "3d";
        modelId: string;
        visible?: boolean | undefined;
        materialId?: string | undefined;
        castShadow?: boolean | undefined;
        receiveShadow?: boolean | undefined;
    } | undefined;
    physics?: {
        bodyType: "dynamic" | "static" | "kinematic";
        mass: number;
        collider: {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "sphere";
            radius: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "mesh";
            meshId: string;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "convex-hull";
            points: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "trimesh";
            vertices: number[];
            indices: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "heightfield";
            scale: {
                x: number;
                y: number;
                z: number;
            };
            heights: number[];
            nrows: number;
            ncols: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "compound";
            children: ({
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            })[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        };
        restitution?: number | undefined;
        friction?: number | undefined;
        linearDamping?: number | undefined;
        angularDamping?: number | undefined;
        lockedAxes?: {
            rotation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
            translation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    joints?: ({
        kind: "fixed";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        localFrameA?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
        localFrameB?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
    } | {
        kind: "revolute";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    } | {
        kind: "prismatic";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    } | {
        kind: "spherical";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
    } | {
        length: number;
        kind: "distance";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        stiffness?: number | undefined;
        damping?: number | undefined;
    })[] | undefined;
    health?: {
        current: number;
        max: number;
    } | undefined;
    audio?: {
        loop: boolean;
        soundId: string;
        bus: "music" | "sfx" | "environment" | "ui";
        volume: number;
        playing: boolean;
        spatial3D?: {
            maxDistance: number;
            rolloff: number;
        } | undefined;
    } | undefined;
    persist?: {
        reason?: string | undefined;
    } | undefined;
    sceneOwner?: {
        sceneId: string;
    } | undefined;
    emitter?: {
        speed: number;
        particleCountPerSecond: number;
        velocityCone: number;
        lifespan: number;
        color: {
            r: number;
            g: number;
            b: number;
        };
        enabled: boolean;
    } | undefined;
    animation?: {
        speed: number;
        clipId: string;
        loop: boolean;
        blendToClipId?: string | undefined;
        blendWeight?: number | undefined;
    } | undefined;
    navAgent?: {
        speed: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
    } | undefined;
    crowdAgent?: {
        radius: number;
        crowdId: string;
        maxSpeed: number;
        height: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
        maxAcceleration?: number | undefined;
        separationWeight?: number | undefined;
        obstacleAvoidanceType?: number | undefined;
    } | undefined;
    behaviorTree?: {
        rootId: string;
        blackboard: Record<string, unknown>;
    } | undefined;
    inventory?: {
        slots: ({
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null)[];
        capacity: number;
        equipped?: Record<string, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null> | undefined;
    } | undefined;
    abilities?: {
        active: string[];
        cooldowns: Record<string, number>;
    } | undefined;
    resources?: Record<string, {
        current: number;
        max: number;
        regen?: number | undefined;
    }> | undefined;
    spawner?: {
        shape: {
            kind: "point";
        } | {
            kind: "circle";
            radius: number;
        } | {
            kind: "line";
            from: {
                x: number;
                y: number;
                z: number;
            };
            to: {
                x: number;
                y: number;
                z: number;
            };
        } | {
            kind: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
        };
        id: string;
        enabled: boolean;
        pool: {
            weight: number;
            archetypeId: string;
        }[];
        mode: {
            kind: "interval";
            intervalSeconds: number;
            timeUntilNext: number;
        } | {
            kind: "wave";
            waves: {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }[];
            currentWaveIndex: number;
            waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
            waveTimeAccumulator: number;
            spawnedThisWave: number;
            betweenWaveDelay: number;
        } | {
            kind: "manual";
        };
        origin: {
            x: number;
            y: number;
            z: number;
        };
        totalSpawned: number;
        maxActive?: number | undefined;
        maxTotal?: number | undefined;
        rngSeed?: number | undefined;
    } | undefined;
    spawnedBy?: {
        spawnerId: string;
        spawnedAt: number;
    } | undefined;
    combat?: {
        resistances?: Record<string, number> | undefined;
        armor?: number | undefined;
        immunities?: string[] | undefined;
    } | undefined;
    statusEffects?: {
        defId: string;
        remainingSeconds: number;
        stackCount: number;
        appliedAt: number;
        lastTickAt: number;
        sourceEntityId?: string | undefined;
    }[] | undefined;
    modifiers?: {
        value: number;
        id: string;
        stat: string;
        op: "add" | "multiply" | "override";
        source?: string | undefined;
        priority?: number | undefined;
    }[] | undefined;
    casting?: {
        abilityId: string;
        phase: "active" | "windup" | "recovery";
        timeRemainingInPhase: number;
        phaseTimings: {
            active: number;
            windup: number;
            recovery: number;
        };
        interruptible: boolean;
        windupElapsed: number;
        activeOnEvent?: string | undefined;
        targetEntityId?: string | undefined;
        targetPosition?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    } | undefined;
    gameClock?: {
        currentSeconds: number;
        secondsPerDay: number;
        paused: boolean;
        speedMultiplier: number;
        currentPhase: "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
        phaseThresholds: {
            dawn: number;
            morning: number;
            noon: number;
            afternoon: number;
            dusk: number;
            night: number;
        };
        dayOfWeek: number;
    } | undefined;
    worldTimescale?: {
        scale: number;
        ease?: {
            fromScale: number;
            toScale: number;
            currentMs: number;
            durationMs: number;
            curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
        } | undefined;
    } | undefined;
    timeDecoupled?: {
        scale: number;
    } | undefined;
    scheduledHandlers?: {
        handles: Record<string, {
            id: string;
            kind: "every" | "at" | "daily";
            callbackId: string;
            nextFireAt: number;
            fired: boolean;
            intervalSeconds?: number | undefined;
        }>;
    } | undefined;
    schedule?: {
        scheduleId: string;
        activeEntryIndex?: number | undefined;
    } | undefined;
    grid?: {
        height: number;
        origin: {
            x: number;
            y: number;
            z: number;
        };
        width: number;
        cellSize: number;
        topology: "4-way" | "8-way";
        tiles: {
            cost: number;
            opaque: boolean;
            terrainId?: string | undefined;
            cover?: number | undefined;
        }[];
    } | undefined;
    tilePosition?: {
        coord: {
            x: number;
            y: number;
        };
    } | undefined;
    turnParticipant?: {
        team: string;
        initiative: number;
        apMax: number;
        apCurrent: number;
        hasActedThisTurn: boolean;
    } | undefined;
    turnState?: {
        mode: "individual" | "team";
        phase: "idle" | "awaiting-input" | "resolving-action" | "ended";
        turnNumber: number;
        queue: string[];
        activeEntityId?: string | undefined;
        activeTeam?: string | undefined;
        battleId?: string | undefined;
    } | undefined;
    dialogue?: {
        activeScriptId: string | null;
        currentNodeId: string | null;
        history?: {
            nodeId: string;
            choiceIndex: number;
        }[] | undefined;
    } | undefined;
    quests?: {
        active: {
            questId: string;
            currentStepIndex: number;
            progress: number;
            startedAt: number;
        }[];
        completed: string[];
        failed: string[];
        abandoned: string[];
    } | undefined;
    achievements?: {
        progress: Record<string, number>;
        unlocked: string[];
        unlockTimes: Record<string, number>;
        stats: Record<string, number>;
        hiddenSeen: string[];
    } | undefined;
    ikChains?: {
        id: string;
        weight: number;
        target: {
            x: number;
            y: number;
            z: number;
        };
        chain: string[];
        iterations: number;
    }[] | undefined;
    boneAttachment?: {
        offset: {
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
            scale: {
                x: number;
                y: number;
                z: number;
            };
        };
        parentEntityId: string;
        boneName: string;
    } | undefined;
    platformerState?: {
        tuning: {
            jumpHeight: number;
            groundSpeed: number;
            airControl: number;
            gravity: number;
            fallGravityMultiplier: number;
            coyoteTime: number;
            jumpBuffer: number;
            groundFriction: number;
        };
        actions: {
            moveForward: string;
            moveBack: string;
            moveLeft: string;
            moveRight: string;
            jump: string;
        };
        accumulatedSeconds: number;
        lastGroundedAt: number;
        lastJumpPressedAt: number;
        grounded: boolean;
        jumpedThisTick: boolean;
    } | undefined;
    squadFormation?: {
        arrivalRadius: number;
        maxSpeed: number;
        leaderEntityId: string;
        offset: {
            x: number;
            y: number;
            z: number;
        };
        followDamping: number;
    } | undefined;
    beatClock?: {
        currentSeconds: number;
        bpm: number;
        hitWindowSeconds: number;
        beatsPerMeasure: number;
        running: boolean;
        lastFiredBeatIndex: number;
        inHitWindow: boolean;
    } | undefined;
    cinematic?: {
        phase: "idle" | "completed" | "playing" | "preparing" | "completing";
        paused: boolean;
        activeCutsceneId: string | null;
        clockSeconds: number;
        firedIndices: number[];
        skipRequested: boolean;
        fadeAlpha: number;
        fadeColor: string;
    } | undefined;
    cinematicCamera?: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        lookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourcePosition: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourceLookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenFromSeconds: number;
        tweenToSeconds: number;
        ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
        fov?: number | undefined;
        tweenSourceFov?: number | undefined;
    } | undefined;
    triggerVolume?: {
        id: string;
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
        fireMode: "multi" | "once";
        consumed: boolean;
        filter?: string | undefined;
        payload?: Record<string, unknown> | undefined;
        category?: string | undefined;
    } | undefined;
    triggerActor?: {
        halfExtents?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        tag?: string | undefined;
    } | undefined;
    topDownCharacter?: {
        speed: number;
        rotateToFacing: boolean;
        rotationDamping: number;
        intent: {
            x: number;
            z: number;
        };
    } | undefined;
    characterController?: {
        grounded?: boolean | undefined;
        offset?: number | undefined;
        maxSlopeClimbAngle?: number | undefined;
        minSlopeSlideAngle?: number | undefined;
        autostep?: {
            maxHeight: number;
            minWidth: number;
            includeDynamicBodies: boolean;
        } | null | undefined;
        snapToGroundDistance?: number | null | undefined;
        applyImpulsesToDynamics?: boolean | undefined;
        characterMass?: number | undefined;
    } | undefined;
    grabState?: {
        heldEntityId: string | null;
        holdDistance: number;
        rotationOffset: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    } | undefined;
    recallable?: {
        capacity?: number | undefined;
        phase?: "idle" | "playing" | undefined;
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    } | undefined;
    ascendState?: {
        phase: "idle" | "rising";
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
        targetY?: number | undefined;
        riseSpeed?: number | undefined;
        maxAscendHeight?: number | undefined;
    } | undefined;
    waterVolume?: {
        bounds: {
            max: {
                x: number;
                y: number;
                z: number;
            };
            min: {
                x: number;
                y: number;
                z: number;
            };
        };
        density?: number | undefined;
        linearDrag?: number | undefined;
        angularDrag?: number | undefined;
    } | undefined;
    buoyant?: {
        density?: number | undefined;
        dragMultiplier?: number | undefined;
    } | undefined;
    decal?: {
        targetEntityId: string;
        textureUrl: string;
        projectorPosition: {
            x: number;
            y: number;
            z: number;
        };
        projectorRotation: {
            x: number;
            y: number;
            z: number;
        };
        size: {
            x: number;
            y: number;
            z: number;
        };
        opacity?: number | undefined;
        spawnedAt?: number | undefined;
        lifetime?: number | undefined;
        fadeOut?: boolean | undefined;
    } | undefined;
    decalTarget?: boolean | undefined;
    lod?: {
        levels: {
            modelId: string;
            distance: number;
        }[];
        hysteresis?: number | undefined;
        activeIndex?: number | undefined;
    } | undefined;
    screenShake?: {
        intensity: number;
        maxOffset: number;
        maxRotation: number;
        decay: number;
        seed: number;
        sampleIndex: number;
    } | undefined;
    impactFrame?: {
        remainingSeconds: number;
        active: boolean;
        color: {
            r: number;
            g: number;
            b: number;
        };
        totalDurationSeconds: number;
        flashIntensity: number;
        holdRatio: number;
    } | undefined;
    vehicle?: {
        actions: {
            accelerate: string;
            brake: string;
            steerLeft: string;
            steerRight: string;
            steerAxis: string;
            handbrake: string;
        };
        enginePower: number;
        brakeForce: number;
        handbrakeForce: number;
        maxSteerAngle: number;
        steerResponseRate: number;
        wheels: {
            position: {
                x: number;
                y: number;
                z: number;
            };
            radius: number;
            friction: number;
            directionDown: {
                x: number;
                y: number;
                z: number;
            };
            axleAxis: {
                x: number;
                y: number;
                z: number;
            };
            suspensionRestLength: number;
            suspensionMaxTravel: number;
            steerable: boolean;
            driven: boolean;
            sideFriction: number;
        }[];
        suspensionStiffness: number;
        suspensionDampingCompression: number;
        suspensionDampingRebound: number;
        suspensionMaxForce: number;
        autoLevelStiffness: number;
        lockRollPitch: boolean;
        currentSteer: number;
        currentThrottle: number;
        currentBrake: number;
    } | undefined;
    blendshape?: {
        playing: {
            weight: number;
            clipId: string;
            loop: boolean;
            elapsed: number;
        }[];
        liveTargets: Record<string, number>;
    } | undefined;
}, {
    id?: string | undefined;
    transform?: {
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
        scale: {
            x: number;
            y: number;
            z: number;
        };
    } | undefined;
    velocity?: {
        linear: {
            x: number;
            y: number;
            z: number;
        };
        angular: {
            x: number;
            y: number;
            z: number;
        };
    } | undefined;
    renderable?: {
        type: "2d";
        spriteId: string;
        tint?: number | undefined;
        zIndex?: number | undefined;
        visible?: boolean | undefined;
        anchor?: {
            x: number;
            y: number;
        } | undefined;
        opacity?: number | undefined;
        blendMode?: "normal" | "add" | "multiply" | "screen" | undefined;
    } | {
        type: "3d";
        modelId: string;
        visible?: boolean | undefined;
        materialId?: string | undefined;
        castShadow?: boolean | undefined;
        receiveShadow?: boolean | undefined;
    } | undefined;
    physics?: {
        bodyType: "dynamic" | "static" | "kinematic";
        mass: number;
        collider: {
            shape: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "sphere";
            radius: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "capsule";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "mesh";
            meshId: string;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "cylinder";
            radius: number;
            halfHeight: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "convex-hull";
            points: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "trimesh";
            vertices: number[];
            indices: number[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "heightfield";
            scale: {
                x: number;
                y: number;
                z: number;
            };
            heights: number[];
            nrows: number;
            ncols: number;
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        } | {
            shape: "compound";
            children: ({
                shape: "box";
                halfExtents: {
                    x: number;
                    y: number;
                    z: number;
                };
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "sphere";
                radius: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "capsule";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "cylinder";
                radius: number;
                halfHeight: number;
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            } | {
                shape: "convex-hull";
                points: number[];
                localOffset: {
                    x: number;
                    y: number;
                    z: number;
                };
                localRotation: {
                    x: number;
                    y: number;
                    z: number;
                    w: number;
                };
            })[];
            isSensor?: boolean | undefined;
            emitCollisionEvents?: boolean | undefined;
            contactForceEventThreshold?: number | undefined;
        };
        restitution?: number | undefined;
        friction?: number | undefined;
        linearDamping?: number | undefined;
        angularDamping?: number | undefined;
        lockedAxes?: {
            rotation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
            translation?: {
                x?: boolean | undefined;
                y?: boolean | undefined;
                z?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    joints?: ({
        kind: "fixed";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        localFrameA?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
        localFrameB?: {
            x: number;
            y: number;
            z: number;
            w: number;
        } | undefined;
    } | {
        kind: "revolute";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    } | {
        kind: "prismatic";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        axis: {
            x: number;
            y: number;
            z: number;
        };
        limits?: [number, number] | undefined;
        motor?: {
            targetVel: number;
            maxForce: number;
        } | undefined;
    } | {
        kind: "spherical";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
    } | {
        length: number;
        kind: "distance";
        otherEntityId: string;
        handle: number;
        localAnchorA: {
            x: number;
            y: number;
            z: number;
        };
        localAnchorB: {
            x: number;
            y: number;
            z: number;
        };
        stiffness?: number | undefined;
        damping?: number | undefined;
    })[] | undefined;
    health?: {
        current: number;
        max: number;
    } | undefined;
    audio?: {
        loop: boolean;
        soundId: string;
        bus: "music" | "sfx" | "environment" | "ui";
        volume: number;
        playing: boolean;
        spatial3D?: {
            maxDistance: number;
            rolloff: number;
        } | undefined;
    } | undefined;
    persist?: {
        reason?: string | undefined;
    } | undefined;
    sceneOwner?: {
        sceneId: string;
    } | undefined;
    emitter?: {
        speed: number;
        particleCountPerSecond: number;
        velocityCone: number;
        lifespan: number;
        color: {
            r: number;
            g: number;
            b: number;
        };
        enabled: boolean;
    } | undefined;
    animation?: {
        clipId: string;
        speed?: number | undefined;
        blendToClipId?: string | undefined;
        blendWeight?: number | undefined;
        loop?: boolean | undefined;
    } | undefined;
    navAgent?: {
        speed: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
    } | undefined;
    crowdAgent?: {
        radius: number;
        maxSpeed: number;
        height: number;
        arrivalRadius?: number | undefined;
        target?: {
            x: number;
            y: number;
            z: number;
        } | null | undefined;
        crowdId?: string | undefined;
        maxAcceleration?: number | undefined;
        separationWeight?: number | undefined;
        obstacleAvoidanceType?: number | undefined;
    } | undefined;
    behaviorTree?: {
        rootId: string;
        blackboard: Record<string, unknown>;
    } | undefined;
    inventory?: {
        slots: ({
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null)[];
        capacity: number;
        equipped?: Record<string, {
            defId: string;
            count: number;
            customData?: Record<string, unknown> | undefined;
        } | null> | undefined;
    } | undefined;
    abilities?: {
        active: string[];
        cooldowns: Record<string, number>;
    } | undefined;
    resources?: Record<string, {
        current: number;
        max: number;
        regen?: number | undefined;
    }> | undefined;
    spawner?: {
        shape: {
            kind: "point";
        } | {
            kind: "circle";
            radius: number;
        } | {
            kind: "line";
            from: {
                x: number;
                y: number;
                z: number;
            };
            to: {
                x: number;
                y: number;
                z: number;
            };
        } | {
            kind: "box";
            halfExtents: {
                x: number;
                y: number;
                z: number;
            };
        };
        id: string;
        enabled: boolean;
        pool: {
            weight: number;
            archetypeId: string;
        }[];
        mode: {
            kind: "interval";
            intervalSeconds: number;
            timeUntilNext: number;
        } | {
            kind: "wave";
            waves: {
                count: number;
                intervalSeconds: number;
                startTrigger: {
                    kind: "previous-cleared";
                } | {
                    kind: "delay";
                    seconds: number;
                };
                pool?: {
                    weight: number;
                    archetypeId: string;
                }[] | undefined;
            }[];
            currentWaveIndex: number;
            waveState: "idle" | "spawning" | "awaiting-clear" | "between-waves" | "complete";
            waveTimeAccumulator: number;
            spawnedThisWave: number;
            betweenWaveDelay: number;
        } | {
            kind: "manual";
        };
        origin: {
            x: number;
            y: number;
            z: number;
        };
        totalSpawned: number;
        maxActive?: number | undefined;
        maxTotal?: number | undefined;
        rngSeed?: number | undefined;
    } | undefined;
    spawnedBy?: {
        spawnerId: string;
        spawnedAt: number;
    } | undefined;
    combat?: {
        resistances?: Record<string, number> | undefined;
        armor?: number | undefined;
        immunities?: string[] | undefined;
    } | undefined;
    statusEffects?: {
        defId: string;
        remainingSeconds: number;
        stackCount: number;
        appliedAt: number;
        lastTickAt: number;
        sourceEntityId?: string | undefined;
    }[] | undefined;
    modifiers?: {
        value: number;
        id: string;
        stat: string;
        op: "add" | "multiply" | "override";
        source?: string | undefined;
        priority?: number | undefined;
    }[] | undefined;
    casting?: {
        abilityId: string;
        phase: "active" | "windup" | "recovery";
        timeRemainingInPhase: number;
        phaseTimings: {
            active: number;
            windup: number;
            recovery: number;
        };
        interruptible: boolean;
        windupElapsed: number;
        activeOnEvent?: string | undefined;
        targetEntityId?: string | undefined;
        targetPosition?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    } | undefined;
    gameClock?: {
        currentSeconds: number;
        secondsPerDay: number;
        paused: boolean;
        speedMultiplier: number;
        currentPhase: "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
        phaseThresholds: {
            dawn: number;
            morning: number;
            noon: number;
            afternoon: number;
            dusk: number;
            night: number;
        };
        dayOfWeek: number;
    } | undefined;
    worldTimescale?: {
        scale: number;
        ease?: {
            fromScale: number;
            toScale: number;
            currentMs: number;
            durationMs: number;
            curve: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutCubic";
        } | undefined;
    } | undefined;
    timeDecoupled?: {
        scale?: number | undefined;
    } | undefined;
    scheduledHandlers?: {
        handles: Record<string, {
            id: string;
            kind: "every" | "at" | "daily";
            callbackId: string;
            nextFireAt: number;
            fired: boolean;
            intervalSeconds?: number | undefined;
        }>;
    } | undefined;
    schedule?: {
        scheduleId: string;
        activeEntryIndex?: number | undefined;
    } | undefined;
    grid?: {
        height: number;
        origin: {
            x: number;
            y: number;
            z: number;
        };
        width: number;
        cellSize: number;
        topology: "4-way" | "8-way";
        tiles: {
            cost: number;
            opaque: boolean;
            terrainId?: string | undefined;
            cover?: number | undefined;
        }[];
    } | undefined;
    tilePosition?: {
        coord: {
            x: number;
            y: number;
        };
    } | undefined;
    turnParticipant?: {
        team: string;
        initiative: number;
        apMax: number;
        apCurrent: number;
        hasActedThisTurn: boolean;
    } | undefined;
    turnState?: {
        mode: "individual" | "team";
        phase: "idle" | "awaiting-input" | "resolving-action" | "ended";
        turnNumber: number;
        queue: string[];
        activeEntityId?: string | undefined;
        activeTeam?: string | undefined;
        battleId?: string | undefined;
    } | undefined;
    dialogue?: {
        activeScriptId: string | null;
        currentNodeId: string | null;
        history?: {
            nodeId: string;
            choiceIndex: number;
        }[] | undefined;
    } | undefined;
    quests?: {
        active: {
            questId: string;
            currentStepIndex: number;
            progress: number;
            startedAt: number;
        }[];
        completed: string[];
        failed: string[];
        abandoned: string[];
    } | undefined;
    achievements?: {
        progress: Record<string, number>;
        unlocked: string[];
        unlockTimes: Record<string, number>;
        stats: Record<string, number>;
        hiddenSeen: string[];
    } | undefined;
    ikChains?: {
        id: string;
        weight: number;
        target: {
            x: number;
            y: number;
            z: number;
        };
        chain: string[];
        iterations: number;
    }[] | undefined;
    boneAttachment?: {
        offset: {
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
            scale: {
                x: number;
                y: number;
                z: number;
            };
        };
        parentEntityId: string;
        boneName: string;
    } | undefined;
    platformerState?: {
        tuning: {
            jumpHeight: number;
            groundSpeed: number;
            airControl: number;
            gravity: number;
            fallGravityMultiplier: number;
            coyoteTime: number;
            jumpBuffer: number;
            groundFriction: number;
        };
        actions: {
            moveForward: string;
            moveBack: string;
            moveLeft: string;
            moveRight: string;
            jump: string;
        };
        accumulatedSeconds: number;
        lastGroundedAt: number;
        lastJumpPressedAt: number;
        grounded: boolean;
        jumpedThisTick: boolean;
    } | undefined;
    squadFormation?: {
        arrivalRadius: number;
        maxSpeed: number;
        leaderEntityId: string;
        offset: {
            x: number;
            y: number;
            z: number;
        };
        followDamping: number;
    } | undefined;
    beatClock?: {
        currentSeconds: number;
        bpm: number;
        hitWindowSeconds: number;
        beatsPerMeasure: number;
        running: boolean;
        lastFiredBeatIndex: number;
        inHitWindow: boolean;
    } | undefined;
    cinematic?: {
        phase: "idle" | "completed" | "playing" | "preparing" | "completing";
        paused: boolean;
        activeCutsceneId: string | null;
        clockSeconds: number;
        firedIndices: number[];
        skipRequested: boolean;
        fadeAlpha: number;
        fadeColor: string;
    } | undefined;
    cinematicCamera?: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        lookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourcePosition: {
            x: number;
            y: number;
            z: number;
        };
        tweenSourceLookAt: {
            x: number;
            y: number;
            z: number;
        };
        tweenFromSeconds: number;
        tweenToSeconds: number;
        ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
        fov?: number | undefined;
        tweenSourceFov?: number | undefined;
    } | undefined;
    triggerVolume?: {
        id: string;
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
        filter?: string | undefined;
        payload?: Record<string, unknown> | undefined;
        fireMode?: "multi" | "once" | undefined;
        consumed?: boolean | undefined;
        category?: string | undefined;
    } | undefined;
    triggerActor?: {
        halfExtents?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        tag?: string | undefined;
    } | undefined;
    topDownCharacter?: {
        speed?: number | undefined;
        rotateToFacing?: boolean | undefined;
        rotationDamping?: number | undefined;
        intent?: {
            x?: number | undefined;
            z?: number | undefined;
        } | undefined;
    } | undefined;
    characterController?: {
        grounded?: boolean | undefined;
        offset?: number | undefined;
        maxSlopeClimbAngle?: number | undefined;
        minSlopeSlideAngle?: number | undefined;
        autostep?: {
            maxHeight: number;
            minWidth: number;
            includeDynamicBodies: boolean;
        } | null | undefined;
        snapToGroundDistance?: number | null | undefined;
        applyImpulsesToDynamics?: boolean | undefined;
        characterMass?: number | undefined;
    } | undefined;
    grabState?: {
        heldEntityId: string | null;
        holdDistance: number;
        rotationOffset: {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    } | undefined;
    recallable?: {
        capacity?: number | undefined;
        phase?: "idle" | "playing" | undefined;
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
    } | undefined;
    ascendState?: {
        phase: "idle" | "rising";
        previousBodyType?: "dynamic" | "static" | "kinematic" | undefined;
        targetY?: number | undefined;
        riseSpeed?: number | undefined;
        maxAscendHeight?: number | undefined;
    } | undefined;
    waterVolume?: {
        bounds: {
            max: {
                x: number;
                y: number;
                z: number;
            };
            min: {
                x: number;
                y: number;
                z: number;
            };
        };
        density?: number | undefined;
        linearDrag?: number | undefined;
        angularDrag?: number | undefined;
    } | undefined;
    buoyant?: {
        density?: number | undefined;
        dragMultiplier?: number | undefined;
    } | undefined;
    decal?: {
        targetEntityId: string;
        textureUrl: string;
        projectorPosition: {
            x: number;
            y: number;
            z: number;
        };
        projectorRotation: {
            x: number;
            y: number;
            z: number;
        };
        size: {
            x: number;
            y: number;
            z: number;
        };
        opacity?: number | undefined;
        spawnedAt?: number | undefined;
        lifetime?: number | undefined;
        fadeOut?: boolean | undefined;
    } | undefined;
    decalTarget?: boolean | undefined;
    lod?: {
        levels: {
            modelId: string;
            distance: number;
        }[];
        hysteresis?: number | undefined;
        activeIndex?: number | undefined;
    } | undefined;
    screenShake?: {
        intensity?: number | undefined;
        maxOffset?: number | undefined;
        maxRotation?: number | undefined;
        decay?: number | undefined;
        seed?: number | undefined;
        sampleIndex?: number | undefined;
    } | undefined;
    impactFrame?: {
        remainingSeconds?: number | undefined;
        active?: boolean | undefined;
        color?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        totalDurationSeconds?: number | undefined;
        flashIntensity?: number | undefined;
        holdRatio?: number | undefined;
    } | undefined;
    vehicle?: {
        enginePower: number;
        brakeForce: number;
        maxSteerAngle: number;
        steerResponseRate: number;
        wheels: {
            position: {
                x: number;
                y: number;
                z: number;
            };
            radius: number;
            suspensionRestLength: number;
            suspensionMaxTravel: number;
            friction?: number | undefined;
            directionDown?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
            axleAxis?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
            steerable?: boolean | undefined;
            driven?: boolean | undefined;
            sideFriction?: number | undefined;
        }[];
        suspensionStiffness: number;
        suspensionDampingCompression: number;
        suspensionDampingRebound: number;
        actions?: {
            accelerate?: string | undefined;
            brake?: string | undefined;
            steerLeft?: string | undefined;
            steerRight?: string | undefined;
            steerAxis?: string | undefined;
            handbrake?: string | undefined;
        } | undefined;
        handbrakeForce?: number | undefined;
        suspensionMaxForce?: number | undefined;
        autoLevelStiffness?: number | undefined;
        lockRollPitch?: boolean | undefined;
        currentSteer?: number | undefined;
        currentThrottle?: number | undefined;
        currentBrake?: number | undefined;
    } | undefined;
    blendshape?: {
        playing: {
            weight: number;
            clipId: string;
            loop: boolean;
            elapsed: number;
        }[];
        liveTargets: Record<string, number>;
    } | undefined;
}>;
/**
 * The canonical entity type for the whole monorepo. The engine uses
 * `World<Entity>`; systems accept `With<Entity, 'transform' | ...>` to
 * narrow to entities that have the slots they require.
 */
export type Entity = z.infer<typeof EntitySchema>;
//# sourceMappingURL=entity.d.ts.map