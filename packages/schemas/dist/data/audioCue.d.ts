import { z } from 'zod';
/** Optional ducking dispatch — when this cue fires, attenuate
 *  another bus for `durationMs` by `depthDb`. Implementation
 *  delegates to the existing `DuckingController` in
 *  `@unsupervised/audio`; the schema just declares intent. */
export declare const AudioCueDuckingSchema: z.ZodObject<{
    /** Which bus to attenuate. Typically `'music'` (drop music
     *  under dialogue / cinematic SFX) or `'sfx'` (drop spot SFX
     *  under a dialogue line). */
    target: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
    /** Hold duration in milliseconds before the bus returns to
     *  full volume. */
    durationMs: z.ZodNumber;
    /** Attenuation depth in dB. Negative numbers attenuate;
     *  positive values are clamped to 0 (no boost). -6 dB halves
     *  perceived loudness; -12 dB is a typical cinematic ducking
     *  depth. */
    depthDb: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    target: "music" | "sfx" | "environment" | "ui";
    durationMs: number;
    depthDb: number;
}, {
    target: "music" | "sfx" | "environment" | "ui";
    durationMs: number;
    depthDb: number;
}>;
export type AudioCueDucking = z.infer<typeof AudioCueDuckingSchema>;
/** A named cue binding one or more events to a single audio
 *  playback configuration.
 *
 *  CONVENTION: id starts with `cue:` so log lines + telemetry
 *  events are self-identifying. Not enforced by the regex —
 *  authors can name freely — but recommended for grep-ability.
 *
 *  ASSET RESOLUTION: `audioId` is the key the cue runtime
 *  passes to `AudioBank.get(...)`. Apps preload the assets via
 *  the typed `AUDIO_PATHS` registry forge emits; the cue layer
 *  does NOT know about generated registries directly. When the
 *  asset isn't loaded, the cue's fire emits telemetry with
 *  `played: false, reason: 'missing-asset'` and returns
 *  silently — never throws. */
export declare const AudioCueSchema: z.ZodObject<{
    /** Stable cue id. Use a `cue:` prefix by convention so logs
     *  + the workbench dashboard surface it cleanly. */
    id: z.ZodString;
    /** Audio asset key — passed to `AudioBank.get(audioId)`.
     *  Typically matches a forge-generated id (`'sfx/explosion'`
     *  / `'voice/sora-death-cry'`). The cue layer stays string-
     *  typed so apps can compose their own type-safe wrapper
     *  around `registry.register({ ... })`. */
    audioId: z.ZodString;
    /** Bus the cue routes through. Composes with the bus's
     *  current volume + the `volume` field below; both apply
     *  multiplicatively. */
    bus: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
    /** Per-cue volume 0..1. Multiplies the bus volume. Defaults
     *  to 1.0. */
    volume: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    /** Whether to loop the source. Defaults to false (one-shot).
     *  Looping cues stay playing until the host explicitly stops
     *  them via the runtime API (an entity slot is the
     *  alternative path for entity-attached loops). */
    loop: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** Optional ducking config — see AudioCueDuckingSchema. When
     *  set, every fire of this cue dispatches the duck. */
    ducking: z.ZodOptional<z.ZodObject<{
        /** Which bus to attenuate. Typically `'music'` (drop music
         *  under dialogue / cinematic SFX) or `'sfx'` (drop spot SFX
         *  under a dialogue line). */
        target: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
        /** Hold duration in milliseconds before the bus returns to
         *  full volume. */
        durationMs: z.ZodNumber;
        /** Attenuation depth in dB. Negative numbers attenuate;
         *  positive values are clamped to 0 (no boost). -6 dB halves
         *  perceived loudness; -12 dB is a typical cinematic ducking
         *  depth. */
        depthDb: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        target: "music" | "sfx" | "environment" | "ui";
        durationMs: number;
        depthDb: number;
    }, {
        target: "music" | "sfx" | "environment" | "ui";
        durationMs: number;
        depthDb: number;
    }>>;
    /** Minimum milliseconds between fires of this cue id.
     *  Prevents spam when the bound event is bursty (e.g.,
     *  collision events firing many times per frame). Cooldown
     *  rejections emit telemetry with `played: false, reason:
     *  'cooldown'`. Defaults to 0 (no rate-limit). */
    cooldownMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    /** Optional free-form note surfaced in the workbench dashboard.
     *  Useful for "what does this cue model" annotations when the
     *  id alone doesn't say. */
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    loop: boolean;
    bus: "music" | "sfx" | "environment" | "ui";
    volume: number;
    audioId: string;
    cooldownMs: number;
    description?: string | undefined;
    ducking?: {
        target: "music" | "sfx" | "environment" | "ui";
        durationMs: number;
        depthDb: number;
    } | undefined;
}, {
    id: string;
    bus: "music" | "sfx" | "environment" | "ui";
    audioId: string;
    description?: string | undefined;
    loop?: boolean | undefined;
    volume?: number | undefined;
    ducking?: {
        target: "music" | "sfx" | "environment" | "ui";
        durationMs: number;
        depthDb: number;
    } | undefined;
    cooldownMs?: number | undefined;
}>;
export type AudioCue = z.infer<typeof AudioCueSchema>;
export type AudioCueInput = z.input<typeof AudioCueSchema>;
/** A complete cue manifest — what an app ships as its
 *  authoritative cue list. AI-authored skills produce this
 *  shape; humans inspect it; the runtime registers from it
 *  at boot. */
export declare const AudioCueManifestSchema: z.ZodObject<{
    /** Schema version. Bumps when the manifest shape changes
     *  incompatibly (rare; cue records are append-only). */
    version: z.ZodDefault<z.ZodLiteral<1>>;
    /** Ordered list of cues. Order is not load-bearing for
     *  playback (the registry is a map keyed by id) but the
     *  workbench dashboard preserves order when surfacing the
     *  list. */
    cues: z.ZodArray<z.ZodObject<{
        /** Stable cue id. Use a `cue:` prefix by convention so logs
         *  + the workbench dashboard surface it cleanly. */
        id: z.ZodString;
        /** Audio asset key — passed to `AudioBank.get(audioId)`.
         *  Typically matches a forge-generated id (`'sfx/explosion'`
         *  / `'voice/sora-death-cry'`). The cue layer stays string-
         *  typed so apps can compose their own type-safe wrapper
         *  around `registry.register({ ... })`. */
        audioId: z.ZodString;
        /** Bus the cue routes through. Composes with the bus's
         *  current volume + the `volume` field below; both apply
         *  multiplicatively. */
        bus: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
        /** Per-cue volume 0..1. Multiplies the bus volume. Defaults
         *  to 1.0. */
        volume: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Whether to loop the source. Defaults to false (one-shot).
         *  Looping cues stay playing until the host explicitly stops
         *  them via the runtime API (an entity slot is the
         *  alternative path for entity-attached loops). */
        loop: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** Optional ducking config — see AudioCueDuckingSchema. When
         *  set, every fire of this cue dispatches the duck. */
        ducking: z.ZodOptional<z.ZodObject<{
            /** Which bus to attenuate. Typically `'music'` (drop music
             *  under dialogue / cinematic SFX) or `'sfx'` (drop spot SFX
             *  under a dialogue line). */
            target: z.ZodEnum<["music", "sfx", "environment", "ui"]>;
            /** Hold duration in milliseconds before the bus returns to
             *  full volume. */
            durationMs: z.ZodNumber;
            /** Attenuation depth in dB. Negative numbers attenuate;
             *  positive values are clamped to 0 (no boost). -6 dB halves
             *  perceived loudness; -12 dB is a typical cinematic ducking
             *  depth. */
            depthDb: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            target: "music" | "sfx" | "environment" | "ui";
            durationMs: number;
            depthDb: number;
        }, {
            target: "music" | "sfx" | "environment" | "ui";
            durationMs: number;
            depthDb: number;
        }>>;
        /** Minimum milliseconds between fires of this cue id.
         *  Prevents spam when the bound event is bursty (e.g.,
         *  collision events firing many times per frame). Cooldown
         *  rejections emit telemetry with `played: false, reason:
         *  'cooldown'`. Defaults to 0 (no rate-limit). */
        cooldownMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Optional free-form note surfaced in the workbench dashboard.
         *  Useful for "what does this cue model" annotations when the
         *  id alone doesn't say. */
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        loop: boolean;
        bus: "music" | "sfx" | "environment" | "ui";
        volume: number;
        audioId: string;
        cooldownMs: number;
        description?: string | undefined;
        ducking?: {
            target: "music" | "sfx" | "environment" | "ui";
            durationMs: number;
            depthDb: number;
        } | undefined;
    }, {
        id: string;
        bus: "music" | "sfx" | "environment" | "ui";
        audioId: string;
        description?: string | undefined;
        loop?: boolean | undefined;
        volume?: number | undefined;
        ducking?: {
            target: "music" | "sfx" | "environment" | "ui";
            durationMs: number;
            depthDb: number;
        } | undefined;
        cooldownMs?: number | undefined;
    }>, "many">;
    /** Event-to-cue bindings. Each entry says "when event K
     *  fires, fire cue V." The same cue id may appear under
     *  multiple events (one cue → many triggers); the same event
     *  may map to multiple cues (one trigger → layered cues) —
     *  encoded as `{ kind: 'event:K', cueId: 'cue:V' }` rather
     *  than `Record<event, cueId>` so the multi-cue case is
     *  natural. */
    bindings: z.ZodArray<z.ZodObject<{
        eventKind: z.ZodString;
        cueId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        eventKind: string;
        cueId: string;
    }, {
        eventKind: string;
        cueId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: 1;
    bindings: {
        eventKind: string;
        cueId: string;
    }[];
    cues: {
        id: string;
        loop: boolean;
        bus: "music" | "sfx" | "environment" | "ui";
        volume: number;
        audioId: string;
        cooldownMs: number;
        description?: string | undefined;
        ducking?: {
            target: "music" | "sfx" | "environment" | "ui";
            durationMs: number;
            depthDb: number;
        } | undefined;
    }[];
}, {
    bindings: {
        eventKind: string;
        cueId: string;
    }[];
    cues: {
        id: string;
        bus: "music" | "sfx" | "environment" | "ui";
        audioId: string;
        description?: string | undefined;
        loop?: boolean | undefined;
        volume?: number | undefined;
        ducking?: {
            target: "music" | "sfx" | "environment" | "ui";
            durationMs: number;
            depthDb: number;
        } | undefined;
        cooldownMs?: number | undefined;
    }[];
    version?: 1 | undefined;
}>;
export type AudioCueManifest = z.infer<typeof AudioCueManifestSchema>;
export type AudioCueManifestInput = z.input<typeof AudioCueManifestSchema>;
//# sourceMappingURL=audioCue.d.ts.map