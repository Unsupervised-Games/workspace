import { z } from 'zod';
/** Easing applied to camera tweens (and any future tweened track
 *  kind). The four named curves cover 95% of authoring needs;
 *  arbitrary curves are out of scope for v1 (deferred to a curve
 *  schema). */
export declare const CutsceneEaseSchema: z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out"]>;
export type CutsceneEase = z.infer<typeof CutsceneEaseSchema>;
/** Camera pose target — a position to place the camera and a point
 *  to look at, with optional FOV override. */
export declare const CutscenePoseSchema: z.ZodObject<{
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
    /** Optional vertical FOV in degrees. When omitted, the active
     *  camera's FOV is unchanged across the tween. */
    fov: z.ZodOptional<z.ZodNumber>;
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
    fov?: number | undefined;
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
    fov?: number | undefined;
}>;
export type CutscenePose = z.infer<typeof CutscenePoseSchema>;
/** Camera track — drives the singleton `cinematicCamera` ECS slot.
 *  `duration === 0` snaps; positive values tween via the renderer-3d
 *  `<CinematicCameraDriver>` using exponential-damping easing. */
declare const CameraTrackSchema: z.ZodObject<{
    kind: z.ZodLiteral<"camera">;
    atSeconds: z.ZodNumber;
    pose: z.ZodObject<{
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
        /** Optional vertical FOV in degrees. When omitted, the active
         *  camera's FOV is unchanged across the tween. */
        fov: z.ZodOptional<z.ZodNumber>;
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
        fov?: number | undefined;
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
        fov?: number | undefined;
    }>;
    /** 0 = snap; > 0 = tween from the previous active pose to this
     *  one over `duration` seconds. */
    duration: z.ZodNumber;
    ease: z.ZodOptional<z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out"]>>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    kind: "camera";
    atSeconds: number;
    pose: {
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
        fov?: number | undefined;
    };
    ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
}, {
    duration: number;
    kind: "camera";
    atSeconds: number;
    pose: {
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
        fov?: number | undefined;
    };
    ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
}>;
export type CameraTrack = z.infer<typeof CameraTrackSchema>;
/** Audio track — fires a one-shot SFX or a music swap on the
 *  configured bus. Asset ids are resolved against the host's
 *  `AudioBank`; missing assets surface as
 *  `'asset-missing'` on the player rejection path. */
declare const AudioTrackSchema: z.ZodObject<{
    kind: z.ZodLiteral<"audio">;
    atSeconds: z.ZodNumber;
    /** Forge-emitted audio asset id (e.g. `'church-bell'`) or
     *  app-defined string the resolver understands. */
    assetId: z.ZodString;
    /** Which mixer bus to route through. Music swaps stop the
     *  current music track and play the new one; sfx are one-shot
     *  fire-and-forget; environment is for ambient loops. */
    bus: z.ZodEnum<["music", "sfx", "environment"]>;
    /** 0..1 multiplier on the bus's voice volume. Defaults to 1. */
    volume: z.ZodOptional<z.ZodNumber>;
    loop: z.ZodOptional<z.ZodBoolean>;
    /** Optional fade-in seconds (only meaningful for music /
     *  environment buses). */
    fadeInSeconds: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    kind: "audio";
    bus: "music" | "sfx" | "environment";
    atSeconds: number;
    assetId: string;
    loop?: boolean | undefined;
    volume?: number | undefined;
    fadeInSeconds?: number | undefined;
}, {
    kind: "audio";
    bus: "music" | "sfx" | "environment";
    atSeconds: number;
    assetId: string;
    loop?: boolean | undefined;
    volume?: number | undefined;
    fadeInSeconds?: number | undefined;
}>;
export type AudioTrack = z.infer<typeof AudioTrackSchema>;
/** Animation track — mutates a target entity's `animation` slot,
 *  which the existing `useEntityAnimation` hook reacts to. The
 *  cinematic system owns the slot mutation, NOT a parallel
 *  AnimationMixer. Target entity is resolved via `id` lookup. */
declare const AnimationTrackSchema: z.ZodObject<{
    kind: z.ZodLiteral<"animation">;
    atSeconds: z.ZodNumber;
    /** Stable `entity.id` of the target; resolved per-fire by the
     *  player's `resolveEntity` hook (defaults to a `world.with('id')`
     *  scan). */
    targetEntityId: z.ZodString;
    /** Clip id resolved against the entity's model bank entry. */
    clipId: z.ZodString;
    loop: z.ZodOptional<z.ZodBoolean>;
    /** Playback speed multiplier; 1 = normal. */
    speed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    kind: "animation";
    clipId: string;
    targetEntityId: string;
    atSeconds: number;
    speed?: number | undefined;
    loop?: boolean | undefined;
}, {
    kind: "animation";
    clipId: string;
    targetEntityId: string;
    atSeconds: number;
    speed?: number | undefined;
    loop?: boolean | undefined;
}>;
export type AnimationTrack = z.infer<typeof AnimationTrackSchema>;
/** Dialogue track — composes the existing `@unsupervised/features/dialogue`
 *  feature. Fires `startDialogue(world, anchor, scriptId)`; the
 *  player listens for `'dialogue:completed'` to know when to
 *  resume any cinematic-clock-paired UX (the cinematic clock
 *  itself does NOT pause for dialogue — apps wanting that wire
 *  it explicitly). */
declare const DialogueTrackSchema: z.ZodObject<{
    kind: z.ZodLiteral<"dialogue">;
    atSeconds: z.ZodNumber;
    /** Registered dialogue script id — must already be registered
     *  via `registerDialogueScript(...)` before the cutscene plays.
     *  Missing script surfaces as `'asset-missing'`. */
    scriptId: z.ZodString;
    /** Optional anchor entity (the `dialogue` slot host). When
     *  omitted, the player creates a transient anchor entity for
     *  the duration of the dialogue and removes it on
     *  `'dialogue:completed'`. */
    anchorEntityId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "dialogue";
    atSeconds: number;
    scriptId: string;
    anchorEntityId?: string | undefined;
}, {
    kind: "dialogue";
    atSeconds: number;
    scriptId: string;
    anchorEntityId?: string | undefined;
}>;
export type DialogueTrack = z.infer<typeof DialogueTrackSchema>;
/** Fade track — drives the singleton `cinematic.fadeAlpha` value
 *  the renderer-side `<CutsceneOverlay>` reads. Use for fade-to-
 *  black between cutscene phases or for the final fade-out
 *  before returning to gameplay. */
declare const FadeTrackSchema: z.ZodObject<{
    kind: z.ZodLiteral<"fade">;
    atSeconds: z.ZodNumber;
    /** Starting alpha (0 = transparent, 1 = fully opaque). */
    from: z.ZodNumber;
    /** Ending alpha. */
    to: z.ZodNumber;
    /** Tween duration in seconds. 0 = snap. */
    duration: z.ZodNumber;
    /** CSS color hex consumed by the overlay. */
    color: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    kind: "fade";
    color: string;
    from: number;
    to: number;
    atSeconds: number;
}, {
    duration: number;
    kind: "fade";
    from: number;
    to: number;
    atSeconds: number;
    color?: string | undefined;
}>;
export type FadeTrack = z.infer<typeof FadeTrackSchema>;
/** Marker track — generic bus event at time T. The extension hook
 *  for game-specific moments (camera shake, vfx spawn, ability
 *  cast) without expanding the schema. App code subscribes to
 *  `'cutscene:marker'` and switches on `eventName`. */
declare const MarkerTrackSchema: z.ZodObject<{
    kind: z.ZodLiteral<"marker">;
    atSeconds: z.ZodNumber;
    /** Free-form sub-event identifier. App-defined; the cinematic
     *  system treats it as opaque. */
    eventName: z.ZodString;
    /** Optional opaque payload forwarded on the bus event. */
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    kind: "marker";
    eventName: string;
    atSeconds: number;
    payload?: Record<string, unknown> | undefined;
}, {
    kind: "marker";
    eventName: string;
    atSeconds: number;
    payload?: Record<string, unknown> | undefined;
}>;
export type MarkerTrack = z.infer<typeof MarkerTrackSchema>;
/** Discriminated union of every supported track kind. */
export declare const CutsceneTrackSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"camera">;
    atSeconds: z.ZodNumber;
    pose: z.ZodObject<{
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
        /** Optional vertical FOV in degrees. When omitted, the active
         *  camera's FOV is unchanged across the tween. */
        fov: z.ZodOptional<z.ZodNumber>;
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
        fov?: number | undefined;
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
        fov?: number | undefined;
    }>;
    /** 0 = snap; > 0 = tween from the previous active pose to this
     *  one over `duration` seconds. */
    duration: z.ZodNumber;
    ease: z.ZodOptional<z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out"]>>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    kind: "camera";
    atSeconds: number;
    pose: {
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
        fov?: number | undefined;
    };
    ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
}, {
    duration: number;
    kind: "camera";
    atSeconds: number;
    pose: {
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
        fov?: number | undefined;
    };
    ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"audio">;
    atSeconds: z.ZodNumber;
    /** Forge-emitted audio asset id (e.g. `'church-bell'`) or
     *  app-defined string the resolver understands. */
    assetId: z.ZodString;
    /** Which mixer bus to route through. Music swaps stop the
     *  current music track and play the new one; sfx are one-shot
     *  fire-and-forget; environment is for ambient loops. */
    bus: z.ZodEnum<["music", "sfx", "environment"]>;
    /** 0..1 multiplier on the bus's voice volume. Defaults to 1. */
    volume: z.ZodOptional<z.ZodNumber>;
    loop: z.ZodOptional<z.ZodBoolean>;
    /** Optional fade-in seconds (only meaningful for music /
     *  environment buses). */
    fadeInSeconds: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    kind: "audio";
    bus: "music" | "sfx" | "environment";
    atSeconds: number;
    assetId: string;
    loop?: boolean | undefined;
    volume?: number | undefined;
    fadeInSeconds?: number | undefined;
}, {
    kind: "audio";
    bus: "music" | "sfx" | "environment";
    atSeconds: number;
    assetId: string;
    loop?: boolean | undefined;
    volume?: number | undefined;
    fadeInSeconds?: number | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"animation">;
    atSeconds: z.ZodNumber;
    /** Stable `entity.id` of the target; resolved per-fire by the
     *  player's `resolveEntity` hook (defaults to a `world.with('id')`
     *  scan). */
    targetEntityId: z.ZodString;
    /** Clip id resolved against the entity's model bank entry. */
    clipId: z.ZodString;
    loop: z.ZodOptional<z.ZodBoolean>;
    /** Playback speed multiplier; 1 = normal. */
    speed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    kind: "animation";
    clipId: string;
    targetEntityId: string;
    atSeconds: number;
    speed?: number | undefined;
    loop?: boolean | undefined;
}, {
    kind: "animation";
    clipId: string;
    targetEntityId: string;
    atSeconds: number;
    speed?: number | undefined;
    loop?: boolean | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"dialogue">;
    atSeconds: z.ZodNumber;
    /** Registered dialogue script id — must already be registered
     *  via `registerDialogueScript(...)` before the cutscene plays.
     *  Missing script surfaces as `'asset-missing'`. */
    scriptId: z.ZodString;
    /** Optional anchor entity (the `dialogue` slot host). When
     *  omitted, the player creates a transient anchor entity for
     *  the duration of the dialogue and removes it on
     *  `'dialogue:completed'`. */
    anchorEntityId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "dialogue";
    atSeconds: number;
    scriptId: string;
    anchorEntityId?: string | undefined;
}, {
    kind: "dialogue";
    atSeconds: number;
    scriptId: string;
    anchorEntityId?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"fade">;
    atSeconds: z.ZodNumber;
    /** Starting alpha (0 = transparent, 1 = fully opaque). */
    from: z.ZodNumber;
    /** Ending alpha. */
    to: z.ZodNumber;
    /** Tween duration in seconds. 0 = snap. */
    duration: z.ZodNumber;
    /** CSS color hex consumed by the overlay. */
    color: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    kind: "fade";
    color: string;
    from: number;
    to: number;
    atSeconds: number;
}, {
    duration: number;
    kind: "fade";
    from: number;
    to: number;
    atSeconds: number;
    color?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"marker">;
    atSeconds: z.ZodNumber;
    /** Free-form sub-event identifier. App-defined; the cinematic
     *  system treats it as opaque. */
    eventName: z.ZodString;
    /** Optional opaque payload forwarded on the bus event. */
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    kind: "marker";
    eventName: string;
    atSeconds: number;
    payload?: Record<string, unknown> | undefined;
}, {
    kind: "marker";
    eventName: string;
    atSeconds: number;
    payload?: Record<string, unknown> | undefined;
}>]>;
export type CutsceneTrack = z.infer<typeof CutsceneTrackSchema>;
declare const TimelineCutsceneSchema: z.ZodObject<{
    kind: z.ZodLiteral<"timeline">;
    id: z.ZodString;
    /** Total duration. Tracks with `atSeconds > durationSeconds`
     *  are valid (the player just won't reach them in normal
     *  playback) but registry validation surfaces a warning. */
    durationSeconds: z.ZodNumber;
    /** Track entries. Order is irrelevant — the player sorts by
     *  `atSeconds` at register time. */
    tracks: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"camera">;
        atSeconds: z.ZodNumber;
        pose: z.ZodObject<{
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
            /** Optional vertical FOV in degrees. When omitted, the active
             *  camera's FOV is unchanged across the tween. */
            fov: z.ZodOptional<z.ZodNumber>;
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
            fov?: number | undefined;
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
            fov?: number | undefined;
        }>;
        /** 0 = snap; > 0 = tween from the previous active pose to this
         *  one over `duration` seconds. */
        duration: z.ZodNumber;
        ease: z.ZodOptional<z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out"]>>;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    }, {
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"audio">;
        atSeconds: z.ZodNumber;
        /** Forge-emitted audio asset id (e.g. `'church-bell'`) or
         *  app-defined string the resolver understands. */
        assetId: z.ZodString;
        /** Which mixer bus to route through. Music swaps stop the
         *  current music track and play the new one; sfx are one-shot
         *  fire-and-forget; environment is for ambient loops. */
        bus: z.ZodEnum<["music", "sfx", "environment"]>;
        /** 0..1 multiplier on the bus's voice volume. Defaults to 1. */
        volume: z.ZodOptional<z.ZodNumber>;
        loop: z.ZodOptional<z.ZodBoolean>;
        /** Optional fade-in seconds (only meaningful for music /
         *  environment buses). */
        fadeInSeconds: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    }, {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"animation">;
        atSeconds: z.ZodNumber;
        /** Stable `entity.id` of the target; resolved per-fire by the
         *  player's `resolveEntity` hook (defaults to a `world.with('id')`
         *  scan). */
        targetEntityId: z.ZodString;
        /** Clip id resolved against the entity's model bank entry. */
        clipId: z.ZodString;
        loop: z.ZodOptional<z.ZodBoolean>;
        /** Playback speed multiplier; 1 = normal. */
        speed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    }, {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"dialogue">;
        atSeconds: z.ZodNumber;
        /** Registered dialogue script id — must already be registered
         *  via `registerDialogueScript(...)` before the cutscene plays.
         *  Missing script surfaces as `'asset-missing'`. */
        scriptId: z.ZodString;
        /** Optional anchor entity (the `dialogue` slot host). When
         *  omitted, the player creates a transient anchor entity for
         *  the duration of the dialogue and removes it on
         *  `'dialogue:completed'`. */
        anchorEntityId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    }, {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"fade">;
        atSeconds: z.ZodNumber;
        /** Starting alpha (0 = transparent, 1 = fully opaque). */
        from: z.ZodNumber;
        /** Ending alpha. */
        to: z.ZodNumber;
        /** Tween duration in seconds. 0 = snap. */
        duration: z.ZodNumber;
        /** CSS color hex consumed by the overlay. */
        color: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        kind: "fade";
        color: string;
        from: number;
        to: number;
        atSeconds: number;
    }, {
        duration: number;
        kind: "fade";
        from: number;
        to: number;
        atSeconds: number;
        color?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"marker">;
        atSeconds: z.ZodNumber;
        /** Free-form sub-event identifier. App-defined; the cinematic
         *  system treats it as opaque. */
        eventName: z.ZodString;
        /** Optional opaque payload forwarded on the bus event. */
        payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    }, {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    }>]>, "many">;
    /** When false, `skip()` rejects with `'not-skippable'`. Apps
     *  ship `false` for studio-logo intros where skipping defeats
     *  the purpose. Defaults to true. */
    skippable: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "timeline";
    tracks: ({
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    } | {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    } | {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    } | {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    } | {
        duration: number;
        kind: "fade";
        color: string;
        from: number;
        to: number;
        atSeconds: number;
    } | {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    })[];
    durationSeconds: number;
    skippable: boolean;
}, {
    id: string;
    kind: "timeline";
    tracks: ({
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    } | {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    } | {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    } | {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    } | {
        duration: number;
        kind: "fade";
        from: number;
        to: number;
        atSeconds: number;
        color?: string | undefined;
    } | {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    })[];
    durationSeconds: number;
    skippable?: boolean | undefined;
}>;
export type TimelineCutscene = z.infer<typeof TimelineCutsceneSchema>;
declare const VideoCutsceneSchema: z.ZodObject<{
    kind: z.ZodLiteral<"video">;
    id: z.ZodString;
    /** Resolved URL for the `<video>` element's `src`. Apps that
     *  emit videos through forge pass the forge-emitted URL; apps
     *  with external CDN videos pass the absolute URL. */
    src: z.ZodString;
    /** Optional poster image URL shown before playback starts. */
    poster: z.ZodOptional<z.ZodString>;
    skippable: z.ZodDefault<z.ZodBoolean>;
    /** Optional pre-roll fade from black on play (seconds). */
    fadeInSeconds: z.ZodOptional<z.ZodNumber>;
    /** Optional post-roll fade to black on completion (seconds). */
    fadeOutSeconds: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "video";
    skippable: boolean;
    src: string;
    fadeInSeconds?: number | undefined;
    poster?: string | undefined;
    fadeOutSeconds?: number | undefined;
}, {
    id: string;
    kind: "video";
    src: string;
    fadeInSeconds?: number | undefined;
    skippable?: boolean | undefined;
    poster?: string | undefined;
    fadeOutSeconds?: number | undefined;
}>;
export type VideoCutscene = z.infer<typeof VideoCutsceneSchema>;
export declare const CutsceneSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"timeline">;
    id: z.ZodString;
    /** Total duration. Tracks with `atSeconds > durationSeconds`
     *  are valid (the player just won't reach them in normal
     *  playback) but registry validation surfaces a warning. */
    durationSeconds: z.ZodNumber;
    /** Track entries. Order is irrelevant — the player sorts by
     *  `atSeconds` at register time. */
    tracks: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"camera">;
        atSeconds: z.ZodNumber;
        pose: z.ZodObject<{
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
            /** Optional vertical FOV in degrees. When omitted, the active
             *  camera's FOV is unchanged across the tween. */
            fov: z.ZodOptional<z.ZodNumber>;
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
            fov?: number | undefined;
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
            fov?: number | undefined;
        }>;
        /** 0 = snap; > 0 = tween from the previous active pose to this
         *  one over `duration` seconds. */
        duration: z.ZodNumber;
        ease: z.ZodOptional<z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out"]>>;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    }, {
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"audio">;
        atSeconds: z.ZodNumber;
        /** Forge-emitted audio asset id (e.g. `'church-bell'`) or
         *  app-defined string the resolver understands. */
        assetId: z.ZodString;
        /** Which mixer bus to route through. Music swaps stop the
         *  current music track and play the new one; sfx are one-shot
         *  fire-and-forget; environment is for ambient loops. */
        bus: z.ZodEnum<["music", "sfx", "environment"]>;
        /** 0..1 multiplier on the bus's voice volume. Defaults to 1. */
        volume: z.ZodOptional<z.ZodNumber>;
        loop: z.ZodOptional<z.ZodBoolean>;
        /** Optional fade-in seconds (only meaningful for music /
         *  environment buses). */
        fadeInSeconds: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    }, {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"animation">;
        atSeconds: z.ZodNumber;
        /** Stable `entity.id` of the target; resolved per-fire by the
         *  player's `resolveEntity` hook (defaults to a `world.with('id')`
         *  scan). */
        targetEntityId: z.ZodString;
        /** Clip id resolved against the entity's model bank entry. */
        clipId: z.ZodString;
        loop: z.ZodOptional<z.ZodBoolean>;
        /** Playback speed multiplier; 1 = normal. */
        speed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    }, {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"dialogue">;
        atSeconds: z.ZodNumber;
        /** Registered dialogue script id — must already be registered
         *  via `registerDialogueScript(...)` before the cutscene plays.
         *  Missing script surfaces as `'asset-missing'`. */
        scriptId: z.ZodString;
        /** Optional anchor entity (the `dialogue` slot host). When
         *  omitted, the player creates a transient anchor entity for
         *  the duration of the dialogue and removes it on
         *  `'dialogue:completed'`. */
        anchorEntityId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    }, {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"fade">;
        atSeconds: z.ZodNumber;
        /** Starting alpha (0 = transparent, 1 = fully opaque). */
        from: z.ZodNumber;
        /** Ending alpha. */
        to: z.ZodNumber;
        /** Tween duration in seconds. 0 = snap. */
        duration: z.ZodNumber;
        /** CSS color hex consumed by the overlay. */
        color: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        duration: number;
        kind: "fade";
        color: string;
        from: number;
        to: number;
        atSeconds: number;
    }, {
        duration: number;
        kind: "fade";
        from: number;
        to: number;
        atSeconds: number;
        color?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"marker">;
        atSeconds: z.ZodNumber;
        /** Free-form sub-event identifier. App-defined; the cinematic
         *  system treats it as opaque. */
        eventName: z.ZodString;
        /** Optional opaque payload forwarded on the bus event. */
        payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    }, {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    }>]>, "many">;
    /** When false, `skip()` rejects with `'not-skippable'`. Apps
     *  ship `false` for studio-logo intros where skipping defeats
     *  the purpose. Defaults to true. */
    skippable: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "timeline";
    tracks: ({
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    } | {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    } | {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    } | {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    } | {
        duration: number;
        kind: "fade";
        color: string;
        from: number;
        to: number;
        atSeconds: number;
    } | {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    })[];
    durationSeconds: number;
    skippable: boolean;
}, {
    id: string;
    kind: "timeline";
    tracks: ({
        duration: number;
        kind: "camera";
        atSeconds: number;
        pose: {
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
            fov?: number | undefined;
        };
        ease?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | undefined;
    } | {
        kind: "audio";
        bus: "music" | "sfx" | "environment";
        atSeconds: number;
        assetId: string;
        loop?: boolean | undefined;
        volume?: number | undefined;
        fadeInSeconds?: number | undefined;
    } | {
        kind: "animation";
        clipId: string;
        targetEntityId: string;
        atSeconds: number;
        speed?: number | undefined;
        loop?: boolean | undefined;
    } | {
        kind: "dialogue";
        atSeconds: number;
        scriptId: string;
        anchorEntityId?: string | undefined;
    } | {
        duration: number;
        kind: "fade";
        from: number;
        to: number;
        atSeconds: number;
        color?: string | undefined;
    } | {
        kind: "marker";
        eventName: string;
        atSeconds: number;
        payload?: Record<string, unknown> | undefined;
    })[];
    durationSeconds: number;
    skippable?: boolean | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"video">;
    id: z.ZodString;
    /** Resolved URL for the `<video>` element's `src`. Apps that
     *  emit videos through forge pass the forge-emitted URL; apps
     *  with external CDN videos pass the absolute URL. */
    src: z.ZodString;
    /** Optional poster image URL shown before playback starts. */
    poster: z.ZodOptional<z.ZodString>;
    skippable: z.ZodDefault<z.ZodBoolean>;
    /** Optional pre-roll fade from black on play (seconds). */
    fadeInSeconds: z.ZodOptional<z.ZodNumber>;
    /** Optional post-roll fade to black on completion (seconds). */
    fadeOutSeconds: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "video";
    skippable: boolean;
    src: string;
    fadeInSeconds?: number | undefined;
    poster?: string | undefined;
    fadeOutSeconds?: number | undefined;
}, {
    id: string;
    kind: "video";
    src: string;
    fadeInSeconds?: number | undefined;
    skippable?: boolean | undefined;
    poster?: string | undefined;
    fadeOutSeconds?: number | undefined;
}>]>;
export type Cutscene = z.infer<typeof CutsceneSchema>;
/** Coarse phases the cinematic player transitions through. */
export declare const CutscenePhaseSchema: z.ZodEnum<["idle", "preparing", "playing", "completing", "completed"]>;
export type CutscenePhase = z.infer<typeof CutscenePhaseSchema>;
/** Reasons `play(...)` can be rejected. */
export declare const CutscenePlayRejectionSchema: z.ZodEnum<["unknown-cutscene-id", "invalid-track-spec", "asset-missing", "preempted-by-newer-cutscene", "cinematic-disposed", "video-decode-failed", "audio-context-suspended"]>;
export type CutscenePlayRejection = z.infer<typeof CutscenePlayRejectionSchema>;
export declare const CutscenePlayResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    cutsceneId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    ok: true;
    cutsceneId: string;
}, {
    ok: true;
    cutsceneId: string;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["unknown-cutscene-id", "invalid-track-spec", "asset-missing", "preempted-by-newer-cutscene", "cinematic-disposed", "video-decode-failed", "audio-context-suspended"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "unknown-cutscene-id" | "invalid-track-spec" | "asset-missing" | "preempted-by-newer-cutscene" | "cinematic-disposed" | "video-decode-failed" | "audio-context-suspended";
}, {
    message: string;
    ok: false;
    reason: "unknown-cutscene-id" | "invalid-track-spec" | "asset-missing" | "preempted-by-newer-cutscene" | "cinematic-disposed" | "video-decode-failed" | "audio-context-suspended";
}>]>;
export type CutscenePlayResult = z.infer<typeof CutscenePlayResultSchema>;
/** Reasons `skip()` can be rejected. */
export declare const CutsceneSkipRejectionSchema: z.ZodEnum<["no-active-cutscene", "not-skippable"]>;
export type CutsceneSkipRejection = z.infer<typeof CutsceneSkipRejectionSchema>;
export declare const CutsceneSkipResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** Number of un-fired track entries that were fast-forwarded.
     *  0 for video cutscenes (no tracks). */
    fastForwardedTracks: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    ok: true;
    fastForwardedTracks: number;
}, {
    ok: true;
    fastForwardedTracks: number;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["no-active-cutscene", "not-skippable"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "no-active-cutscene" | "not-skippable";
}, {
    message: string;
    ok: false;
    reason: "no-active-cutscene" | "not-skippable";
}>]>;
export type CutsceneSkipResult = z.infer<typeof CutsceneSkipResultSchema>;
export {};
//# sourceMappingURL=cutscene.d.ts.map