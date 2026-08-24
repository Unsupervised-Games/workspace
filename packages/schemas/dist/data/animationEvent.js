// Animation event shapes used by `@unsupervised/features/animationEvents`
// (the registry) + `@unsupervised/renderer-3d`'s `useEntityAnimation`
// hook (the firing logic).
//
// An animation event is a NAMED moment within a clip — "the hit
// frame of a swing", "the foot-down moment of a step", "the
// glow-peak of a charge spell". The renderer detects when the
// AnimationMixer's clip time crosses the event's trigger time
// and fires `'animation:event'` on the world's bus, carrying
// the entity + event name + clip context.
//
// Game code subscribes to that bus event for VFX, audio, gameplay
// hooks (the casting system listens for `activeOnEvent` matches
// to drive cast phase advancement). The event payload itself
// flows through the standard observability + replay surface.
//
// Time-based registration with two ergonomic shapes:
//
//   - `atTime`     — absolute seconds from clip start. Use when
//                    the timing is precise + author-known.
//   - `atFraction` — 0..1 normalized along clip duration. Use when
//                    the clip's duration may change (re-export at
//                    different speeds, slow-mo variants); fraction
//                    survives.
//
// Exactly one of `atTime` / `atFraction` must be set; the schema
// rejects events with neither or both.
import { z } from 'zod';
export const AnimationEventSchema = z
    .object({
    /** Clip name within the model's animation set. Matches the
     *  same string used in `entity.animation.clipId`. */
    clipName: z.string().min(1),
    /** Trigger time in absolute seconds from clip start. Either
     *  this or `atFraction` is required (not both). */
    atTime: z.number().nonnegative().optional(),
    /** Trigger time as a 0..1 fraction of clip duration. Either
     *  this or `atTime` is required (not both). */
    atFraction: z.number().min(0).max(1).optional(),
    /** Stable name fired on the bus. Apps subscribing to
     *  `'animation:event'` filter on this. */
    eventName: z.string().min(1),
})
    .refine((e) => e.atTime !== undefined || e.atFraction !== undefined, {
    message: 'AnimationEvent needs either atTime or atFraction',
})
    .refine((e) => e.atTime === undefined || e.atFraction === undefined, {
    message: 'AnimationEvent must specify atTime XOR atFraction, not both',
});
/** A list of animation events for a single (modelId, clipName)
 *  pair. The registry stores these grouped by model; lookups
 *  filter by clip. */
export const AnimationEventListSchema = z.array(AnimationEventSchema);
//# sourceMappingURL=animationEvent.js.map