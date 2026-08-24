import { z } from 'zod';
export declare const AnimationEventSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    /** Clip name within the model's animation set. Matches the
     *  same string used in `entity.animation.clipId`. */
    clipName: z.ZodString;
    /** Trigger time in absolute seconds from clip start. Either
     *  this or `atFraction` is required (not both). */
    atTime: z.ZodOptional<z.ZodNumber>;
    /** Trigger time as a 0..1 fraction of clip duration. Either
     *  this or `atTime` is required (not both). */
    atFraction: z.ZodOptional<z.ZodNumber>;
    /** Stable name fired on the bus. Apps subscribing to
     *  `'animation:event'` filter on this. */
    eventName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}>, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}>, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}>;
export type AnimationEvent = z.infer<typeof AnimationEventSchema>;
/** A list of animation events for a single (modelId, clipName)
 *  pair. The registry stores these grouped by model; lookups
 *  filter by clip. */
export declare const AnimationEventListSchema: z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodObject<{
    /** Clip name within the model's animation set. Matches the
     *  same string used in `entity.animation.clipId`. */
    clipName: z.ZodString;
    /** Trigger time in absolute seconds from clip start. Either
     *  this or `atFraction` is required (not both). */
    atTime: z.ZodOptional<z.ZodNumber>;
    /** Trigger time as a 0..1 fraction of clip duration. Either
     *  this or `atTime` is required (not both). */
    atFraction: z.ZodOptional<z.ZodNumber>;
    /** Stable name fired on the bus. Apps subscribing to
     *  `'animation:event'` filter on this. */
    eventName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}>, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}>, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}, {
    eventName: string;
    clipName: string;
    atTime?: number | undefined;
    atFraction?: number | undefined;
}>, "many">;
export type AnimationEventList = z.infer<typeof AnimationEventListSchema>;
//# sourceMappingURL=animationEvent.d.ts.map