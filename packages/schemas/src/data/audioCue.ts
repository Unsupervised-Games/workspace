// Audio cue — a named, fire-and-forget sound binding.
//
// Cues bridge GAME EVENTS to AUDIO PLAYBACK. Game code emits a
// semantic event ("player:died", "ui:button-click") via its
// event bus; the cue registry maps that event kind to a named
// cue, looks up the audio asset, applies bus routing + per-cue
// volume + optional ducking, and fires playback.
//
// AUTHORING POSTURE. Cues are SCHEMA-DRIVEN, not GUI-driven.
// AI agents (and humans) author cue manifests as JSON / TS
// constants:
//
//   const CUES: AudioCue[] = [
//     {
//       id: 'cue:player-death',
//       audioId: 'voice/sora-death-cry',
//       bus: 'sfx',
//       volume: 0.9,
//       ducking: { target: 'music', durationMs: 1500, depthDb: -6 },
//     },
//     {
//       id: 'cue:ui-click',
//       audioId: 'sfx/ui-click',
//       bus: 'ui',
//       cooldownMs: 50,
//     },
//   ];
//   const registry = createCueRegistry({ bank, mixer });
//   for (const cue of CUES) registry.register(cue);
//   registry.bindToBus(gameEventBus, {
//     'player:died': 'cue:player-death',
//     'ui:button-click': 'cue:ui-click',
//   });
//
// The runtime (in `@unsupervised/audio/cue`) consumes this schema; the
// workbench dashboard reads + displays it; future Claude skills
// author + maintain it. The schema lives here so all three
// agree on one source of truth.

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Bus + ducking
// ---------------------------------------------------------------------------

/** Bus targets. Mirrors `@unsupervised/audio`'s entity-facing tetrad —
 *  the cue layer routes through the same bus tree the rest of
 *  the engine uses. */
const AudioBusEnum = z.enum(['music', 'sfx', 'environment', 'ui']);

/** Optional ducking dispatch — when this cue fires, attenuate
 *  another bus for `durationMs` by `depthDb`. Implementation
 *  delegates to the existing `DuckingController` in
 *  `@unsupervised/audio`; the schema just declares intent. */
export const AudioCueDuckingSchema = z.object({
  /** Which bus to attenuate. Typically `'music'` (drop music
   *  under dialogue / cinematic SFX) or `'sfx'` (drop spot SFX
   *  under a dialogue line). */
  target: AudioBusEnum,
  /** Hold duration in milliseconds before the bus returns to
   *  full volume. */
  durationMs: z.number().positive().max(60_000),
  /** Attenuation depth in dB. Negative numbers attenuate;
   *  positive values are clamped to 0 (no boost). -6 dB halves
   *  perceived loudness; -12 dB is a typical cinematic ducking
   *  depth. */
  depthDb: z.number().min(-60).max(0),
});
export type AudioCueDucking = z.infer<typeof AudioCueDuckingSchema>;

// ---------------------------------------------------------------------------
// Cue
// ---------------------------------------------------------------------------

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
export const AudioCueSchema = z.object({
  /** Stable cue id. Use a `cue:` prefix by convention so logs
   *  + the workbench dashboard surface it cleanly. */
  id: z.string().min(1),
  /** Audio asset key — passed to `AudioBank.get(audioId)`.
   *  Typically matches a forge-generated id (`'sfx/explosion'`
   *  / `'voice/sora-death-cry'`). The cue layer stays string-
   *  typed so apps can compose their own type-safe wrapper
   *  around `registry.register({ ... })`. */
  audioId: z.string().min(1),
  /** Bus the cue routes through. Composes with the bus's
   *  current volume + the `volume` field below; both apply
   *  multiplicatively. */
  bus: AudioBusEnum,
  /** Per-cue volume 0..1. Multiplies the bus volume. Defaults
   *  to 1.0. */
  volume: z.number().min(0).max(1).optional().default(1.0),
  /** Whether to loop the source. Defaults to false (one-shot).
   *  Looping cues stay playing until the host explicitly stops
   *  them via the runtime API (an entity slot is the
   *  alternative path for entity-attached loops). */
  loop: z.boolean().optional().default(false),
  /** Optional ducking config — see AudioCueDuckingSchema. When
   *  set, every fire of this cue dispatches the duck. */
  ducking: AudioCueDuckingSchema.optional(),
  /** Minimum milliseconds between fires of this cue id.
   *  Prevents spam when the bound event is bursty (e.g.,
   *  collision events firing many times per frame). Cooldown
   *  rejections emit telemetry with `played: false, reason:
   *  'cooldown'`. Defaults to 0 (no rate-limit). */
  cooldownMs: z.number().nonnegative().max(60_000).optional().default(0),
  /** Optional free-form note surfaced in the workbench dashboard.
   *  Useful for "what does this cue model" annotations when the
   *  id alone doesn't say. */
  description: z.string().optional(),
});
export type AudioCue = z.infer<typeof AudioCueSchema>;
export type AudioCueInput = z.input<typeof AudioCueSchema>;

// ---------------------------------------------------------------------------
// Manifest — apps that ship a static cue config
// ---------------------------------------------------------------------------

/** A complete cue manifest — what an app ships as its
 *  authoritative cue list. AI-authored skills produce this
 *  shape; humans inspect it; the runtime registers from it
 *  at boot. */
export const AudioCueManifestSchema = z.object({
  /** Schema version. Bumps when the manifest shape changes
   *  incompatibly (rare; cue records are append-only). */
  version: z.literal(1).default(1),
  /** Ordered list of cues. Order is not load-bearing for
   *  playback (the registry is a map keyed by id) but the
   *  workbench dashboard preserves order when surfacing the
   *  list. */
  cues: z.array(AudioCueSchema),
  /** Event-to-cue bindings. Each entry says "when event K
   *  fires, fire cue V." The same cue id may appear under
   *  multiple events (one cue → many triggers); the same event
   *  may map to multiple cues (one trigger → layered cues) —
   *  encoded as `{ kind: 'event:K', cueId: 'cue:V' }` rather
   *  than `Record<event, cueId>` so the multi-cue case is
   *  natural. */
  bindings: z.array(
    z.object({
      eventKind: z.string().min(1),
      cueId: z.string().min(1),
    }),
  ),
});
export type AudioCueManifest = z.infer<typeof AudioCueManifestSchema>;
export type AudioCueManifestInput = z.input<typeof AudioCueManifestSchema>;
