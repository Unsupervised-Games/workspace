import { z } from 'zod';
/** A single time-weight keyframe within a track. `time` is the
 *  per-clip elapsed seconds; `weight` is the morph-target
 *  influence at that time. The runtime linearly interpolates
 *  between adjacent keyframes; keyframes must be sorted ascending
 *  by `time` (the system doesn't sort — authoring bug if
 *  unsorted). */
export declare const BlendshapeKeyframeSchema: z.ZodObject<{
    /** Time in seconds within the clip. Must be in [0, duration]. */
    time: z.ZodNumber;
    /** Morph-target influence at this time. Typically [0, 1] but
     *  apps with HDR-driven shapes (over-pose for stylization)
     *  pass values up to 2 — Three's `morphTargetInfluences`
     *  accepts any float. */
    weight: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    weight: number;
    time: number;
}, {
    weight: number;
    time: number;
}>;
export type BlendshapeKeyframe = z.infer<typeof BlendshapeKeyframeSchema>;
/** A named clip — duration + per-target keyframe tracks.
 *
 *  Tracks keyed by morph-target name. Targets the clip doesn't
 *  mention are left UNCHANGED (apps layer multiple clips by
 *  partitioning targets — e.g., one clip drives the mouth, a
 *  second drives the brow; play both together, the targets don't
 *  collide). When two playing clips reference the SAME target,
 *  the driver sums their weighted contributions (per-clip
 *  `weight` × per-keyframe `weight`).
 *
 *  Apps register clips at boot via
 *  `registerBlendshapeClip(clip)`. Gameplay code plays by id via
 *  `playBlendshapeClip(world, entity, { clipId })`. */
export declare const BlendshapeClipSchema: z.ZodObject<{
    /** App-defined unique id. Convention: `<character>:<expression>`
     *  (e.g., `'hero:smile'`, `'boss:roar'`). Treated as an opaque
     *  string by the framework; apps narrow with their own union. */
    clipId: z.ZodString;
    /** Clip duration in seconds. Used to clamp `elapsed` for non-
     *  looping clips and to detect end-of-clip for removal from
     *  `playing`. Keyframe times past `duration` are clamped at
     *  evaluation time (apps shouldn't author those, but the
     *  runtime tolerates them). */
    duration: z.ZodNumber;
    /** Track map keyed by morph-target name. The key is the SAME
     *  string Three exposes in `mesh.morphTargetDictionary`. */
    tracks: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        /** Time in seconds within the clip. Must be in [0, duration]. */
        time: z.ZodNumber;
        /** Morph-target influence at this time. Typically [0, 1] but
         *  apps with HDR-driven shapes (over-pose for stylization)
         *  pass values up to 2 — Three's `morphTargetInfluences`
         *  accepts any float. */
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        weight: number;
        time: number;
    }, {
        weight: number;
        time: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    clipId: string;
    tracks: Record<string, {
        weight: number;
        time: number;
    }[]>;
}, {
    duration: number;
    clipId: string;
    tracks: Record<string, {
        weight: number;
        time: number;
    }[]>;
}>;
export type BlendshapeClip = z.infer<typeof BlendshapeClipSchema>;
/** A currently-playing clip entry inside the per-entity slot.
 *  Multiple `BlendshapeSlotPlaying` entries may share the same
 *  `clipId` (e.g. a re-trigger before the prior playthrough
 *  finished) — the framework treats each entry as independent. */
export declare const BlendshapeSlotPlayingSchema: z.ZodObject<{
    /** Clip id referencing the global registry. */
    clipId: z.ZodString;
    /** Elapsed time within the clip in seconds. The system
     *  advances this by `dt` each tick; on reaching `duration`,
     *  non-looping clips are removed from `playing`. */
    elapsed: z.ZodNumber;
    /** When true, `elapsed` wraps modulo `duration` on overflow.
     *  When false (default), the entry is removed once `elapsed
     *  >= duration`. */
    loop: z.ZodBoolean;
    /** Multiplicative weight applied to all of this clip's tracks
     *  during resolution. Apps cross-fade by ramping `weight` 0→1
     *  on the new clip while ramping 1→0 on the previous one. */
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
}>;
export type BlendshapeSlotPlaying = z.infer<typeof BlendshapeSlotPlayingSchema>;
/** Per-entity blendshape state.
 *
 *  Read by:
 *   - `blendshapeSystem(world, dt)` (advances `playing[*].elapsed`,
 *     removes finished non-loop clips).
 *   - `<BlendshapeDriver>` in `@unsupervised/renderer-3d` (resolves
 *     weights from `playing` + `liveTargets`, writes to
 *     `mesh.morphTargetInfluences`).
 *
 *  Written by:
 *   - `playBlendshapeClip` / `stopBlendshapeClip` (manage
 *     `playing`).
 *   - `setLiveBlendshape` / `clearLiveBlendshapes` (manage
 *     `liveTargets`).
 *   - The system (advances `elapsed`, removes finished). */
export declare const BlendshapeSlotSchema: z.ZodObject<{
    /** Currently playing clips. Multiple entries are summed at
     *  resolution time (per-target accumulation). Entries with
     *  `weight: 0` are kept but contribute nothing — useful for
     *  cross-fade ramps. */
    playing: z.ZodArray<z.ZodObject<{
        /** Clip id referencing the global registry. */
        clipId: z.ZodString;
        /** Elapsed time within the clip in seconds. The system
         *  advances this by `dt` each tick; on reaching `duration`,
         *  non-looping clips are removed from `playing`. */
        elapsed: z.ZodNumber;
        /** When true, `elapsed` wraps modulo `duration` on overflow.
         *  When false (default), the entry is removed once `elapsed
         *  >= duration`. */
        loop: z.ZodBoolean;
        /** Multiplicative weight applied to all of this clip's tracks
         *  during resolution. Apps cross-fade by ramping `weight` 0→1
         *  on the new clip while ramping 1→0 on the previous one. */
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
    /** Per-frame live overrides. Apps write here each frame
     *  (lip-sync from audio analysis, AI inference, ad-hoc
     *  imperative facial expressions). The driver SUMS these on
     *  top of the resolved clip output, then clamps the final
     *  per-target weight to [0, 1] (Three accepts unclamped but
     *  the framework's contract is "weights are in the unit
     *  range; over-pose via per-clip `weight > 1` if needed").
     *
     *  Apps that set live targets at frame N and want them
     *  cleared at frame N+1 call `clearLiveBlendshapes` between
     *  ticks; otherwise the map persists until rewritten. */
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
}>;
export type BlendshapeSlot = z.infer<typeof BlendshapeSlotSchema>;
//# sourceMappingURL=blendshape.d.ts.map