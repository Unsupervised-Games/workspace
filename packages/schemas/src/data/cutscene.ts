// Cutscene timeline + player state shapes.
//
// `@unsupervised/features/cinematic` consumes these. v1 ships TWO cutscene
// shapes under one discriminated union:
//
//   - `kind: 'video'`     — a pre-rendered <video> overlay. Time is
//                           browser-owned; the player only mounts +
//                           dismisses + tracks fade pre/post-roll.
//   - `kind: 'timeline'`  — a track-based timeline of typed entries
//                           (camera / audio / animation / dialogue /
//                           fade / marker). Time is engine-owned;
//                           the player accumulates `clockSeconds`
//                           from `deltaTime` and fires entries at
//                           their `atSeconds` boundaries.
//
// The runtime player state lives on a singleton `cinematic` ECS slot
// (one per world, mirrors `gameClock` / `turnState`); the camera
// handoff lives on a sibling singleton `cinematicCamera` ECS slot
// the renderer-3d's camera presets self-yield to.

import { z } from 'zod';
import { Vec3Schema } from '../ecs/components.js';

// ---------------------------------------------------------------------------
// Per-track entries — discriminated by `kind`. All carry `atSeconds`.
// ---------------------------------------------------------------------------

/** Easing applied to camera tweens (and any future tweened track
 *  kind). The four named curves cover 95% of authoring needs;
 *  arbitrary curves are out of scope for v1 (deferred to a curve
 *  schema). */
export const CutsceneEaseSchema = z.enum([
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
]);
export type CutsceneEase = z.infer<typeof CutsceneEaseSchema>;

/** Camera pose target — a position to place the camera and a point
 *  to look at, with optional FOV override. */
export const CutscenePoseSchema = z.object({
  position: Vec3Schema,
  lookAt: Vec3Schema,
  /** Optional vertical FOV in degrees. When omitted, the active
   *  camera's FOV is unchanged across the tween. */
  fov: z.number().positive().optional(),
});
export type CutscenePose = z.infer<typeof CutscenePoseSchema>;

/** Camera track — drives the singleton `cinematicCamera` ECS slot.
 *  `duration === 0` snaps; positive values tween via the renderer-3d
 *  `<CinematicCameraDriver>` using exponential-damping easing. */
const CameraTrackSchema = z.object({
  kind: z.literal('camera'),
  atSeconds: z.number().nonnegative(),
  pose: CutscenePoseSchema,
  /** 0 = snap; > 0 = tween from the previous active pose to this
   *  one over `duration` seconds. */
  duration: z.number().nonnegative(),
  ease: CutsceneEaseSchema.optional(),
});
export type CameraTrack = z.infer<typeof CameraTrackSchema>;

/** Audio track — fires a one-shot SFX or a music swap on the
 *  configured bus. Asset ids are resolved against the host's
 *  `AudioBank`; missing assets surface as
 *  `'asset-missing'` on the player rejection path. */
const AudioTrackSchema = z.object({
  kind: z.literal('audio'),
  atSeconds: z.number().nonnegative(),
  /** Forge-emitted audio asset id (e.g. `'church-bell'`) or
   *  app-defined string the resolver understands. */
  assetId: z.string().min(1),
  /** Which mixer bus to route through. Music swaps stop the
   *  current music track and play the new one; sfx are one-shot
   *  fire-and-forget; environment is for ambient loops. */
  bus: z.enum(['music', 'sfx', 'environment']),
  /** 0..1 multiplier on the bus's voice volume. Defaults to 1. */
  volume: z.number().min(0).max(1).optional(),
  loop: z.boolean().optional(),
  /** Optional fade-in seconds (only meaningful for music /
   *  environment buses). */
  fadeInSeconds: z.number().nonnegative().optional(),
});
export type AudioTrack = z.infer<typeof AudioTrackSchema>;

/** Animation track — mutates a target entity's `animation` slot,
 *  which the existing `useEntityAnimation` hook reacts to. The
 *  cinematic system owns the slot mutation, NOT a parallel
 *  AnimationMixer. Target entity is resolved via `id` lookup. */
const AnimationTrackSchema = z.object({
  kind: z.literal('animation'),
  atSeconds: z.number().nonnegative(),
  /** Stable `entity.id` of the target; resolved per-fire by the
   *  player's `resolveEntity` hook (defaults to a `world.with('id')`
   *  scan). */
  targetEntityId: z.string().min(1),
  /** Clip id resolved against the entity's model bank entry. */
  clipId: z.string().min(1),
  loop: z.boolean().optional(),
  /** Playback speed multiplier; 1 = normal. */
  speed: z.number().positive().optional(),
});
export type AnimationTrack = z.infer<typeof AnimationTrackSchema>;

/** Dialogue track — composes the existing `@unsupervised/features/dialogue`
 *  feature. Fires `startDialogue(world, anchor, scriptId)`; the
 *  player listens for `'dialogue:completed'` to know when to
 *  resume any cinematic-clock-paired UX (the cinematic clock
 *  itself does NOT pause for dialogue — apps wanting that wire
 *  it explicitly). */
const DialogueTrackSchema = z.object({
  kind: z.literal('dialogue'),
  atSeconds: z.number().nonnegative(),
  /** Registered dialogue script id — must already be registered
   *  via `registerDialogueScript(...)` before the cutscene plays.
   *  Missing script surfaces as `'asset-missing'`. */
  scriptId: z.string().min(1),
  /** Optional anchor entity (the `dialogue` slot host). When
   *  omitted, the player creates a transient anchor entity for
   *  the duration of the dialogue and removes it on
   *  `'dialogue:completed'`. */
  anchorEntityId: z.string().optional(),
});
export type DialogueTrack = z.infer<typeof DialogueTrackSchema>;

/** Fade track — drives the singleton `cinematic.fadeAlpha` value
 *  the renderer-side `<CutsceneOverlay>` reads. Use for fade-to-
 *  black between cutscene phases or for the final fade-out
 *  before returning to gameplay. */
const FadeTrackSchema = z.object({
  kind: z.literal('fade'),
  atSeconds: z.number().nonnegative(),
  /** Starting alpha (0 = transparent, 1 = fully opaque). */
  from: z.number().min(0).max(1),
  /** Ending alpha. */
  to: z.number().min(0).max(1),
  /** Tween duration in seconds. 0 = snap. */
  duration: z.number().nonnegative(),
  /** CSS color hex consumed by the overlay. */
  color: z.string().default('#000'),
});
export type FadeTrack = z.infer<typeof FadeTrackSchema>;

/** Marker track — generic bus event at time T. The extension hook
 *  for game-specific moments (camera shake, vfx spawn, ability
 *  cast) without expanding the schema. App code subscribes to
 *  `'cutscene:marker'` and switches on `eventName`. */
const MarkerTrackSchema = z.object({
  kind: z.literal('marker'),
  atSeconds: z.number().nonnegative(),
  /** Free-form sub-event identifier. App-defined; the cinematic
   *  system treats it as opaque. */
  eventName: z.string().min(1),
  /** Optional opaque payload forwarded on the bus event. */
  payload: z.record(z.string(), z.unknown()).optional(),
});
export type MarkerTrack = z.infer<typeof MarkerTrackSchema>;

/** Discriminated union of every supported track kind. */
export const CutsceneTrackSchema = z.discriminatedUnion('kind', [
  CameraTrackSchema,
  AudioTrackSchema,
  AnimationTrackSchema,
  DialogueTrackSchema,
  FadeTrackSchema,
  MarkerTrackSchema,
]);
export type CutsceneTrack = z.infer<typeof CutsceneTrackSchema>;

// ---------------------------------------------------------------------------
// Top-level cutscene shapes — discriminated by `kind`.
// ---------------------------------------------------------------------------

const TimelineCutsceneSchema = z.object({
  kind: z.literal('timeline'),
  id: z.string().min(1),
  /** Total duration. Tracks with `atSeconds > durationSeconds`
   *  are valid (the player just won't reach them in normal
   *  playback) but registry validation surfaces a warning. */
  durationSeconds: z.number().positive(),
  /** Track entries. Order is irrelevant — the player sorts by
   *  `atSeconds` at register time. */
  tracks: z.array(CutsceneTrackSchema),
  /** When false, `skip()` rejects with `'not-skippable'`. Apps
   *  ship `false` for studio-logo intros where skipping defeats
   *  the purpose. Defaults to true. */
  skippable: z.boolean().default(true),
});
export type TimelineCutscene = z.infer<typeof TimelineCutsceneSchema>;

const VideoCutsceneSchema = z.object({
  kind: z.literal('video'),
  id: z.string().min(1),
  /** Resolved URL for the `<video>` element's `src`. Apps that
   *  emit videos through forge pass the forge-emitted URL; apps
   *  with external CDN videos pass the absolute URL. */
  src: z.string().min(1),
  /** Optional poster image URL shown before playback starts. */
  poster: z.string().optional(),
  skippable: z.boolean().default(true),
  /** Optional pre-roll fade from black on play (seconds). */
  fadeInSeconds: z.number().nonnegative().optional(),
  /** Optional post-roll fade to black on completion (seconds). */
  fadeOutSeconds: z.number().nonnegative().optional(),
});
export type VideoCutscene = z.infer<typeof VideoCutsceneSchema>;

export const CutsceneSchema = z.discriminatedUnion('kind', [
  TimelineCutsceneSchema,
  VideoCutsceneSchema,
]);
export type Cutscene = z.infer<typeof CutsceneSchema>;

// ---------------------------------------------------------------------------
// Runtime player state — surfaced via the singleton `cinematic` ECS slot.
// ---------------------------------------------------------------------------

/** Coarse phases the cinematic player transitions through. */
export const CutscenePhaseSchema = z.enum([
  'idle',
  'preparing',
  'playing',
  'completing',
  'completed',
]);
export type CutscenePhase = z.infer<typeof CutscenePhaseSchema>;

// ---------------------------------------------------------------------------
// Discriminated results.
// ---------------------------------------------------------------------------

/** Reasons `play(...)` can be rejected. */
export const CutscenePlayRejectionSchema = z.enum([
  'unknown-cutscene-id',
  'invalid-track-spec',
  'asset-missing',
  'preempted-by-newer-cutscene',
  'cinematic-disposed',
  'video-decode-failed',
  'audio-context-suspended',
]);
export type CutscenePlayRejection = z.infer<typeof CutscenePlayRejectionSchema>;

export const CutscenePlayResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    cutsceneId: z.string(),
  }),
  z.object({
    ok: z.literal(false),
    reason: CutscenePlayRejectionSchema,
    message: z.string(),
  }),
]);
export type CutscenePlayResult = z.infer<typeof CutscenePlayResultSchema>;

/** Reasons `skip()` can be rejected. */
export const CutsceneSkipRejectionSchema = z.enum([
  'no-active-cutscene',
  'not-skippable',
]);
export type CutsceneSkipRejection = z.infer<typeof CutsceneSkipRejectionSchema>;

export const CutsceneSkipResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** Number of un-fired track entries that were fast-forwarded.
     *  0 for video cutscenes (no tracks). */
    fastForwardedTracks: z.number().int().nonnegative(),
  }),
  z.object({
    ok: z.literal(false),
    reason: CutsceneSkipRejectionSchema,
    message: z.string(),
  }),
]);
export type CutsceneSkipResult = z.infer<typeof CutsceneSkipResultSchema>;
