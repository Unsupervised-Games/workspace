// Audio-generation pipeline shapes — `AudioSidecar` (the
// recipe authored next to where the audio file wants to live)
// and `AudioStyleConfig` (the project-wide budget + style
// surface). Sibling to `assetGen.ts`; same authoring shape
// (`*.audio.prompt.json` sidecars) and same architectural
// invariants (content-hash cache, locked-hash, budget caps,
// per-vendor service params, banned-term filter).
//
// Two discriminated unions on `kind`:
//
//   1. `AudioSidecar` — `'voice'` (Phase 1, ElevenLabs),
//      `'sfx'` (Phase 2, ElevenLabs), `'music'` (Phase 3, Suno).
//   2. Per-kind `ServiceConfig` — `'elevenlabs'` for voice +
//      sfx; `'suno'` for music. Future vendors register their
//      per-service params here.
//
// The forge `audioGenPipeline` discovers `*.audio.prompt.json`
// files under `assets-raw/audio/`, validates each via
// `AudioSidecarSchema`, and dispatches by `(kind, service)`
// to the matching client in `@unsupervised/audio-gen`.
//
// SIDECAR FILE-NAMING DISTINCTION. Asset-gen sidecars are
// `<slot>.prompt.json` (model only at v1). Audio sidecars are
// `<slot>.audio.prompt.json` — the `.audio.` infix
// disambiguates the forge watchers + lets a single
// `assets-raw/audio/` directory hold both binary inputs
// (`.wav` source files for the audioPipeline) and generation
// recipes (`.audio.prompt.json` for audioGenPipeline) without
// collision.

import { z } from 'zod';
import { LocaleIdSchema } from './i18n.js';

// ---------------------------------------------------------------------------
// ElevenLabs (voice + SFX service)
// ---------------------------------------------------------------------------

/** ElevenLabs voice generation parameters. Mirrors the
 *  text-to-speech endpoint's surface; the runtime client maps
 *  these to the HTTP layer 1:1.
 *
 *  AUTHORING NOTE: the `voiceId` is the load-bearing field — it
 *  determines whose voice the line is spoken in. ElevenLabs
 *  offers a public library of curated voices (each with a
 *  stable id like `21m00Tcm4TlvDq8ikWAM` for Rachel) plus the
 *  account's cloned voices. Pick voices at the project level
 *  (e.g., Sora gets one fixed voice id across every line);
 *  swap mid-project invalidates every cached line. */
export const ElevenLabsVoiceParamsSchema = z.object({
  /** ElevenLabs voice id (stable hash, NOT the display name).
   *  REQUIRED — there's no sensible default since voice
   *  selection is per-character art direction. Authors pick
   *  from the project's voice cast (typically declared in
   *  `audio-gen.config.ts` and referenced by alias). */
  voiceId: z.string().min(1),
  /** ElevenLabs model id. Defaults to `eleven_multilingual_v2`
   *  — the highest-quality multilingual model. `eleven_turbo_v2_5`
   *  is the cheap/fast option for iteration loops. */
  modelId: z
    .enum([
      'eleven_multilingual_v2',
      'eleven_turbo_v2_5',
      'eleven_monolingual_v1',
      'eleven_flash_v2_5',
    ])
    .optional()
    .default('eleven_multilingual_v2'),
  /** Voice stability (0..1). Higher = more consistent across
   *  inferences but less expressive. ElevenLabs default 0.5
   *  works for dialogue; combat-line variants use 0.3-0.4 for
   *  more emotional range. */
  stability: z.number().min(0).max(1).optional().default(0.5),
  /** Voice similarity boost (0..1). Higher = closer to the
   *  reference voice with sharper artifacts. ElevenLabs default
   *  0.75 — fine for most cases. */
  similarityBoost: z.number().min(0).max(1).optional().default(0.75),
  /** Style exaggeration (0..1). Multilingual v2 only; ignored
   *  by other models. 0 = neutral delivery; 1 = maximum styled.
   *  Higher values increase character but reduce stability. */
  style: z.number().min(0).max(1).optional().default(0),
  /** Use speaker boost. Multilingual v2 only. Sharpens vocal
   *  presence — useful for narrator-shape voice work, can
   *  over-process casual dialogue. */
  useSpeakerBoost: z.boolean().optional().default(true),
  /** Output container + bitrate. ElevenLabs offers MP3 at
   *  various bitrates + PCM at sample rates. MP3 44.1kHz/128kbps
   *  is the safe default for game dialogue — small file,
   *  perceptually transparent. PCM 44.1kHz is uncompressed
   *  source quality for downstream mixing pipelines. */
  outputFormat: z
    .enum([
      'mp3_22050_32',
      'mp3_44100_32',
      'mp3_44100_64',
      'mp3_44100_96',
      'mp3_44100_128',
      'mp3_44100_192',
      'pcm_16000',
      'pcm_22050',
      'pcm_24000',
      'pcm_44100',
    ])
    .optional()
    .default('mp3_44100_128'),
});
export type ElevenLabsVoiceParams = z.infer<typeof ElevenLabsVoiceParamsSchema>;

/** ElevenLabs sound-effects parameters. Same `service:
 *  'elevenlabs'` but different endpoint (`/v1/sound-generation`).
 *  Phase 2 — schema declared now so apps can pre-write SFX
 *  sidecars while the Phase 1 voice client ships; the runtime
 *  client lands when the Phase 2 work begins. */
export const ElevenLabsSfxParamsSchema = z.object({
  /** Target duration in seconds. ElevenLabs SFX supports 0.5
   *  to 22 seconds. Default 2.0s — covers most impact /
   *  one-shot effects. */
  durationSeconds: z
    .number()
    .min(0.5)
    .max(22)
    .optional()
    .default(2.0),
  /** Prompt influence (0..1). Higher = closer adherence to the
   *  prompt at the cost of variety. ElevenLabs recommends 0.3
   *  for general SFX, 0.7+ when the prompt names a specific
   *  instrument / source. */
  promptInfluence: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .default(0.3),
  /** Output container. MP3 only for SFX endpoint; ElevenLabs
   *  doesn't expose PCM for sound-effects output. */
  outputFormat: z
    .enum(['mp3_44100_128', 'mp3_44100_192'])
    .optional()
    .default('mp3_44100_128'),
});
export type ElevenLabsSfxParams = z.infer<typeof ElevenLabsSfxParamsSchema>;

// ---------------------------------------------------------------------------
// Suno (music service)
// ---------------------------------------------------------------------------

/** Suno music generation parameters. Phase 3 — schema declared
 *  now so the discriminated union is complete; runtime client
 *  lands with Phase 3.
 *
 *  COST NOTE: Suno generations are SLOW (60-120s polling) and
 *  EXPENSIVE relative to voice / SFX. The project-wide budget
 *  caps should account for this — a single music track can
 *  cost 5-10× a voice line of the same length. */
export const SunoMusicParamsSchema = z.object({
  /** Suno model id. `v4` is current production; `v3_5` is
   *  cheaper / faster but lower-fidelity. */
  modelId: z
    .enum(['v4', 'v3_5', 'v4_5'])
    .optional()
    .default('v4'),
  /** Whether to produce an instrumental track (no vocals).
   *  Most game music wants `true` — vocals fight with dialogue
   *  + SFX in the mix. */
  makeInstrumental: z.boolean().optional().default(true),
  /** Target duration in seconds. Suno's max output length
   *  varies by model; v4 supports up to ~240s. The runtime
   *  client clamps to model limits. */
  durationSeconds: z
    .number()
    .min(10)
    .max(240)
    .optional()
    .default(60),
});
export type SunoMusicParams = z.infer<typeof SunoMusicParamsSchema>;

// ---------------------------------------------------------------------------
// Validation gates
// ---------------------------------------------------------------------------

/** Validation gates that fire AFTER generation completes.
 *  Sidecar can override per-asset; defaults fold in from the
 *  style config. Audio validation is intentionally lightweight
 *  in v1 — we check file presence + minimal byte size +
 *  declared output format compatibility. Audio-content
 *  validation (peak loudness, silence detection, language
 *  match) is deferred to a Layer-3 vision-equivalent pass
 *  later in the roadmap. */
export const AudioValidationOptionsSchema = z.object({
  /** Reject if the generated audio is smaller than this (bytes).
   *  Catches "empty MP3 header" failure mode where the vendor
   *  returned a valid file structure but zero audio data.
   *  Default 256 bytes — well above any valid MP3 frame header
   *  alone. */
  minBytes: z.number().int().positive().optional().default(256),
  /** Reject if the generated audio exceeds this (bytes). Catches
   *  runaway-cost protection in case a vendor billing changes
   *  the output budget. Default 50 MB — generous; a 4-minute
   *  music track at 192kbps MP3 is ~5.7 MB. */
  maxBytes: z.number().int().positive().optional().default(50 * 1024 * 1024),
});
export type AudioValidationOptions = z.infer<typeof AudioValidationOptionsSchema>;

// ---------------------------------------------------------------------------
// Post-processing chain (Phase 5 — ship-ready audio)
// ---------------------------------------------------------------------------

/** A single EQ band in the post chain. Maps 1:1 to ffmpeg's
 *  `highpass` / `lowpass` / `highshelf` / `lowshelf` /
 *  `equalizer` (peaking) filters.
 *
 *  TYPICAL USES:
 *    - `highpass @ 80Hz`   — voice de-rumble (remove HVAC + plosive thump)
 *    - `highpass @ 35Hz`   — music sub-rumble cleanup
 *    - `lowpass @ 12kHz`   — soften vendor-side hiss on synthesis artifacts
 *    - `highshelf @ 8kHz +2dB` — add air to voice
 *    - `peaking @ 200Hz Q=1 -3dB` — tame mud on close-mic voice
 *
 *  Frequencies are in Hz, gain in dB, Q (quality / bandwidth)
 *  is dimensionless and only used by peaking / shelf bands. */
export const AudioEqBandSchema = z.object({
  type: z.enum(['highpass', 'lowpass', 'highshelf', 'lowshelf', 'peaking']),
  frequencyHz: z.number().positive(),
  /** dB cut/boost. Required for shelf + peaking; ignored for
   *  highpass / lowpass (those don't take gain). */
  gainDb: z.number().min(-24).max(24).optional(),
  /** Filter quality / bandwidth. Higher Q = narrower band.
   *  Typical range 0.5 (wide) to 4.0 (narrow). Only used by
   *  peaking + shelf bands. */
  q: z.number().positive().max(20).optional(),
});
export type AudioEqBand = z.infer<typeof AudioEqBandSchema>;

/** Per-sidecar post-processing chain. Applied AFTER the vendor
 *  generation succeeds + validation passes, BETWEEN the cache
 *  write (raw vendor bytes) and the public-output write
 *  (processed bytes the game-side audio bank reads).
 *
 *  TWO-PHASE STORAGE INVARIANT:
 *    - Cache  = raw vendor bytes (never post-processed). Stays
 *               keyed by takeHash; re-tuning the post chain
 *               doesn't invalidate the cache. Take auditions
 *               in workbench play these bytes.
 *    - Public = post-processed bytes. The game reads these.
 *               Re-tuning the post chain re-emits public
 *               output without re-billing the vendor.
 *
 *  ALL FIELDS ARE OPTIONAL. Omitting the field altogether
 *  means "no post chain — emit raw vendor bytes to public
 *  output." Per-kind defaults in `AudioStyleConfig.defaultPost`
 *  fold in when a sidecar omits its own `post` block.
 *
 *  FILTER ORDER (canonical mastering chain):
 *    1. EQ bands (clean the source)
 *    2. LUFS normalization (loudness-equalize)
 *    3. Fades (envelope shape)
 *    4. True-peak limiter (broadcast-safety guard) — built into
 *       loudnorm when `normalizeLufs` is set; standalone via
 *       `truePeakDb` when not.
 *
 *  Apps that want a different order should compose explicit
 *  EQ bands before/after normalization by splitting the chain
 *  across two sidecars (rare; the canonical order covers most
 *  use cases). */
export const AudioPostChainSchema = z.object({
  /** EBU R128 LUFS normalization target (integrated loudness).
   *  Common targets:
   *    - `-23` LUFS — broadcast (EBU R128 default, conservative)
   *    - `-16` LUFS — web video / podcasts (YouTube, Spotify)
   *    - `-14` LUFS — streaming music (Spotify, Apple Music)
   *  Game audio typically lands `-23` for voice (mixes against
   *  music + SFX without fighting) and `-16` for stand-alone
   *  music tracks. Two-pass loudnorm for accuracy. */
  normalizeLufs: z.number().min(-70).max(-5).optional(),
  /** Loudness range target in LU (EBU R128). Default 7 LU is
   *  the EBU recommendation for tight broadcast loudness;
   *  higher values preserve more dynamics. Only honored when
   *  `normalizeLufs` is set. */
  loudnessRangeLu: z.number().min(1).max(20).optional().default(7),
  /** Fade-in duration in milliseconds. 0 = no fade (default).
   *  Typical voice fades: 20-50ms (just enough to soften the
   *  vendor's hard onset). Music intros: 200-2000ms. */
  fadeInMs: z.number().int().min(0).max(10_000).optional().default(0),
  /** Fade-out duration in milliseconds. 0 = no fade (default).
   *  Typical voice fades: 50-200ms. Music tails: 500-3000ms. */
  fadeOutMs: z.number().int().min(0).max(10_000).optional().default(0),
  /** Sequential EQ band chain. Empty (default) = bypass EQ.
   *  Bands are applied IN ORDER, so a typical voice chain is
   *  `[{ highpass @ 80Hz }, { peaking @ 200Hz -3dB Q=1 }]`. */
  eq: z.array(AudioEqBandSchema).optional().default([]),
  /** True-peak ceiling in dBTP (decibels true-peak). Default
   *  -1.0 = -1 dBTP, the broadcast-safety standard that
   *  prevents inter-sample peaks from clipping in lossy
   *  re-encodes. Only honored when `normalizeLufs` is NOT
   *  set — when LUFS normalization runs, its built-in
   *  limiter handles true-peak. */
  truePeakDb: z.number().min(-12).max(0).optional(),
});
/** Output type — what consumers see AFTER zod validation. Has
 *  every defaulted field populated (`loudnessRangeLu` defaults
 *  to 7, `eq` defaults to `[]`, etc.). Forge + workbench action
 *  layers receive this shape from parsed sidecars. */
export type AudioPostChain = z.infer<typeof AudioPostChainSchema>;

/** Input type — what AUTHORS see when constructing a chain in
 *  TypeScript (sidecar JSON or `audio-gen.config.ts`). Every
 *  defaulted field is optional. Use this when hand-building a
 *  chain in a test or ad-hoc tooling. */
export type AudioPostChainInput = z.input<typeof AudioPostChainSchema>;

// ---------------------------------------------------------------------------
// Post-chain presets — curated starting points
// ---------------------------------------------------------------------------

/** A named, ready-to-apply post-processing chain. Presets are
 *  the cheap-to-author entry point: instead of hand-tuning
 *  LUFS / fades / EQ for every sidecar, operators pick a preset
 *  that matches the asset's role (broadcast voice / streaming
 *  music / UI SFX / ambient bed / etc.) and tweak from there.
 *
 *  Stored as DATA in `@unsupervised/schemas` so workbench's editor + the
 *  forge CLI + future tooling all consume from one canonical
 *  source. Apps can extend by spreading these into their own
 *  per-game preset libraries:
 *
 *  ```ts
 *  import { POST_CHAIN_PRESETS } from '@unsupervised/schemas';
 *  export const GAME_PRESETS = [
 *    ...POST_CHAIN_PRESETS,
 *    { id: 'komorebi-shrine-bell', name: 'Shrine bell SFX', ... },
 *  ];
 *  ```
 *
 *  Preset IDs are stable kebab-case slugs. New presets land at
 *  the END of the array so saved selections by id stay
 *  resolvable across releases. */
export interface PostChainPreset {
  /** Stable kebab-case id. Saved on the sidecar as a hint when
   *  the operator picked the preset (separate from the actual
   *  `post` block — apps that want a "did the author start
   *  from a preset" trace can persist this).  */
  id: string;
  /** Human-readable display name for the picker. */
  name: string;
  /** One-line description of the preset's intent + when to
   *  use it. Surfaces as a tooltip / hint under the picker. */
  description: string;
  /** Which sidecar kinds this preset makes sense for. The
   *  workbench editor filters the dropdown by the current
   *  sidecar's kind, so a voice card only shows voice
   *  presets. */
  appliesTo: ReadonlyArray<'voice' | 'sfx' | 'music'>;
  /** The chain spec. Schema-validated at module load time so
   *  malformed presets fail loudly during dev rather than at
   *  runtime in a user's authoring session. */
  chain: AudioPostChainInput;
}

/** Curated v1 preset library — 12 presets across the three
 *  asset kinds. Coverage targets:
 *
 *    VOICE (4): broadcast-conservative (-23 LUFS, low fades,
 *      voice de-rumble), podcast (-16 LUFS, presence boost),
 *      cinematic (-20 LUFS, wide dynamics, air shelf), radio
 *      (-16 LUFS, tight, presence-forward).
 *    MUSIC (4): game loop (-16 LUFS, modest fades), streaming
 *      master (-14 LUFS, long fades), ambient bed (-23 LUFS,
 *      multi-second fades, sub cleanup), stinger (-12 LUFS,
 *      punchy bass).
 *    SFX (4): default (-16 LUFS + true-peak guard), punchy
 *      (-12 LUFS, bass + presence boost), UI (-16 LUFS,
 *      micro-fades, sub-rumble cleanup), ambient loop
 *      (-23 LUFS, long fades).
 *
 *  Add to this list, never re-order; the workbench editor saves
 *  the preset id on selection so re-ordering would break
 *  existing project libraries. */
export const POST_CHAIN_PRESETS: ReadonlyArray<PostChainPreset> = [
  // ── Voice ──────────────────────────────────────────────
  {
    id: 'voice-broadcast',
    name: 'Voice — broadcast',
    description:
      'EBU R128 broadcast loudness. Mixes cleanly under music + SFX. Conservative dynamics; voice de-rumble at 80Hz.',
    appliesTo: ['voice'],
    chain: {
      normalizeLufs: -23,
      fadeInMs: 20,
      fadeOutMs: 80,
      eq: [{ type: 'highpass', frequencyHz: 80 }],
    },
  },
  {
    id: 'voice-podcast',
    name: 'Voice — podcast / web',
    description:
      'YouTube / Spotify-style web target. Punchier presence; tames 200Hz mud.',
    appliesTo: ['voice'],
    chain: {
      normalizeLufs: -16,
      fadeInMs: 50,
      fadeOutMs: 200,
      eq: [
        { type: 'highpass', frequencyHz: 80 },
        { type: 'peaking', frequencyHz: 200, gainDb: -2, q: 1 },
      ],
    },
  },
  {
    id: 'voice-cinematic',
    name: 'Voice — cinematic',
    description:
      'Wide-dynamics cinematic dialogue. Preserves breath + room sense; subtle 8kHz air.',
    appliesTo: ['voice'],
    chain: {
      normalizeLufs: -20,
      loudnessRangeLu: 11,
      fadeInMs: 100,
      fadeOutMs: 400,
      eq: [
        { type: 'highpass', frequencyHz: 60 },
        { type: 'highshelf', frequencyHz: 8000, gainDb: 1 },
      ],
    },
  },
  {
    id: 'voice-radio',
    name: 'Voice — radio / announcer',
    description:
      'Tight, intelligibility-first. Aggressive de-rumble; 3kHz presence boost cuts through busy mixes.',
    appliesTo: ['voice'],
    chain: {
      normalizeLufs: -16,
      eq: [
        { type: 'highpass', frequencyHz: 120 },
        { type: 'peaking', frequencyHz: 3000, gainDb: 3, q: 2 },
      ],
    },
  },

  // ── Music ──────────────────────────────────────────────
  {
    id: 'music-game-loop',
    name: 'Music — game loop',
    description:
      'Standard game-music master. Modest fades for scene crossfade safety.',
    appliesTo: ['music'],
    chain: {
      normalizeLufs: -16,
      fadeInMs: 100,
      fadeOutMs: 500,
    },
  },
  {
    id: 'music-streaming-master',
    name: 'Music — streaming master',
    description:
      'Spotify / Apple Music loud master. Long fades for menu / cinematic intros.',
    appliesTo: ['music'],
    chain: {
      normalizeLufs: -14,
      fadeInMs: 200,
      fadeOutMs: 1000,
    },
  },
  {
    id: 'music-ambient-bed',
    name: 'Music — ambient bed',
    description:
      'Quiet bed that sits under dialogue + SFX without fighting. Multi-second fades; 35Hz sub cleanup.',
    appliesTo: ['music'],
    chain: {
      normalizeLufs: -23,
      fadeInMs: 2000,
      fadeOutMs: 3000,
      eq: [{ type: 'highpass', frequencyHz: 35 }],
    },
  },
  {
    id: 'music-stinger',
    name: 'Music — stinger / cue',
    description:
      'Short punchy cue (boss reveal, item pickup). Loud, fast in / fast out, sub-bass thump emphasis.',
    appliesTo: ['music'],
    chain: {
      normalizeLufs: -12,
      fadeInMs: 0,
      fadeOutMs: 200,
      eq: [{ type: 'peaking', frequencyHz: 80, gainDb: 1, q: 0.7 }],
    },
  },

  // ── SFX ────────────────────────────────────────────────
  {
    id: 'sfx-default',
    name: 'SFX — default',
    description:
      'Safe game-SFX default. Loudness-normalized to -16 LUFS with -1 dBTP true-peak guard.',
    appliesTo: ['sfx'],
    chain: {
      normalizeLufs: -16,
      truePeakDb: -1.0,
    },
  },
  {
    id: 'sfx-punchy',
    name: 'SFX — punchy impact',
    description:
      'Aggressive impact (hit / explode / crash). Loud, bass + presence boosts for "weight" + "crack".',
    appliesTo: ['sfx'],
    chain: {
      normalizeLufs: -12,
      truePeakDb: -1.0,
      eq: [
        { type: 'peaking', frequencyHz: 100, gainDb: 2, q: 0.7 },
        { type: 'peaking', frequencyHz: 4000, gainDb: 3, q: 1.5 },
      ],
    },
  },
  {
    id: 'sfx-ui',
    name: 'SFX — UI (click / hover)',
    description:
      'UI sound that fires constantly. Micro-fades for click safety; sub-rumble removed (200Hz highpass) so the asset stays small + crisp.',
    appliesTo: ['sfx'],
    chain: {
      normalizeLufs: -16,
      fadeInMs: 5,
      fadeOutMs: 30,
      eq: [{ type: 'highpass', frequencyHz: 200 }],
    },
  },
  {
    id: 'sfx-ambient-loop',
    name: 'SFX — ambient loop',
    description:
      'Background ambient loop (wind / forest / city hum). Quiet so it doesn\'t fight dialogue; long fades for layering.',
    appliesTo: ['sfx'],
    chain: {
      normalizeLufs: -23,
      fadeInMs: 500,
      fadeOutMs: 1000,
    },
  },
];

/** Find a preset by id. Returns null when unknown — apps that
 *  persist a preset id on the sidecar can detect "the preset
 *  was removed between releases" by null-checking the lookup. */
export function findPostChainPreset(id: string): PostChainPreset | null {
  return POST_CHAIN_PRESETS.find((p) => p.id === id) ?? null;
}

/** Filter presets by sidecar kind. Used by the workbench editor's
 *  preset dropdown to show only relevant entries. */
export function postChainPresetsFor(
  kind: 'voice' | 'sfx' | 'music',
): ReadonlyArray<PostChainPreset> {
  return POST_CHAIN_PRESETS.filter((p) => p.appliesTo.includes(kind));
}

// ---------------------------------------------------------------------------
// Take history (Phase 4 — iteration on takes)
// ---------------------------------------------------------------------------

/** A single TAKE — one generation cycle's worth of bytes,
 *  attached to the cache by content hash.
 *
 *  Audio design is fundamentally iterative: a voice director
 *  records 4 takes of a line, picks one, asks for 4 more with
 *  notes ("less breath, more weight at the end"), picks
 *  another, marks one as the FINAL take. The `takes` array on
 *  each sidecar carries that history.
 *
 *  INVARIANTS:
 *
 *    1. Order is CHRONOLOGICAL (oldest first). Authors never
 *       reorder; appending is the only mutation.
 *    2. AT MOST ONE take has `kept: true`. The kept take is
 *       the one whose bytes are copied to the public output
 *       path; promoting another take rewrites the file.
 *    3. A take with a non-null `error` represents a failed
 *       generation. Its `hash` is still recorded (for cache
 *       lookups + audit-log correlation) but the bytes are NOT
 *       written to the public output. Failed takes are never
 *       `kept: true`.
 *    4. `hash` matches the cache entry at
 *       `.audio-gen-cache/<kind>/<hash>.<extension>`. The
 *       same-hash cache entry is shared across sidecars that
 *       happen to bake identical inputs — the cache is keyed
 *       by hash, not by slot.
 *
 *  PROMOTING vs. APPENDING:
 *
 *    - `appendTake`: add a new take, leave the kept flag alone
 *      unless the array was previously empty (first take is
 *      auto-kept).
 *    - `promoteTake`: flip `kept: true` on a target take + flip
 *      it false on every other take + rewrite the public output
 *      from the new kept take's cache bytes.
 *
 *  RETIREMENT vs. DELETION:
 *
 *    - A take with `kept: false` is "retired" — present in the
 *      history, audible from the takes pane, but not the
 *      current shipped output. Retired takes stay in the cache;
 *      a future `--prune` CLI flag can drop their bytes after
 *      a retention window. */
export const AudioTakeRecordSchema = z.object({
  /** Cache-key content hash for THIS take's bytes. Unique per
   *  take — two takes of identical inputs at different
   *  timestamps have different `hash` values so they don't
   *  collide in the cache.
   *
   *  Constructed as `SHA256(inputHash || '\\0' || takenAt)`
   *  via `computeTakeHash` in `@unsupervised/audio-gen`. The take's
   *  bytes live at `.audio-gen-cache/<kind>/<hash>.<extension>`. */
  hash: z.string().min(1),
  /** Deterministic input-fingerprint hash. Two takes of the
   *  SAME sidecar inputs share `inputHash`; tweaking the
   *  prompt / params / text produces a different value. The
   *  UI uses this to group takes (e.g., "takes from the
   *  current prompt" vs. "takes from prior prompts the
   *  author has since edited"). Also the value `lockedHash`
   *  validates against. */
  inputHash: z.string().min(1),
  /** ISO-8601 timestamp the take was generated. Used for
   *  chronological ordering + UI display. */
  takenAt: z.string().min(1),
  /** USD cost charged for this take. Mirrors what the audit
   *  log records; the kept take's cost surfaces as the
   *  sidecar-level `lastCostUsd` for backwards compatibility. */
  costUsd: z.number().nonnegative(),
  /** Byte size of the generated audio. */
  bytes: z.number().int().nonnegative(),
  /** File extension (`'mp3'` / `'wav'` / `'ogg'`). Cache and
   *  public-output paths both use this. Recorded per-take
   *  because vendor-output formats can shift across takes
   *  (voice MP3 → PCM tuning iteration). */
  extension: z.string().min(1),
  /** Exactly one take per sidecar has `kept: true`. The kept
   *  take's bytes are copied to the public output path. */
  kept: z.boolean(),
  /** Free-form author note ("more melancholy", "use for
   *  cinematic A only"). Does NOT participate in the cache
   *  hash. Surfaced in the workbench takes pane. */
  notes: z.string().optional(),
  /** When the generation that produced this entry FAILED.
   *  Present → take is a failure record (no usable bytes,
   *  never `kept: true`); absent → take is successful. */
  error: z
    .object({
      kind: z.string(),
      message: z.string(),
      issues: z.array(z.string()).optional(),
      at: z.string(),
    })
    .optional(),
  /** Numeric generation-param snapshot (Part C). Written when a
   *  `retune` iteration appends a take, so the oscillation guard
   *  in `inferParamAdjustment` can read the knob path across
   *  takes and the workbench Takes drawer can show which knobs
   *  produced each take. Numeric knobs only (`stability`,
   *  `style`, `similarityBoost`, `promptInfluence`, …) — all the
   *  inference reads. Absent on pre-retune / legacy takes → the
   *  guard treats that take's knobs as unknown and stays
   *  conservative. Does NOT participate in the cache hash. */
  params: z.record(z.string(), z.number()).optional(),
  /** Provider + model/voice that produced this take (`'elevenlabs'` /
   *  a model id, `'riva'` / a Riva voice). Provenance only — provider is
   *  NOT in the cache hash. Lets the takes drawer show which vendor made
   *  each swappable version. Undefined on legacy takes. */
  provider: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
});
export type AudioTakeRecord = z.infer<typeof AudioTakeRecordSchema>;

// ---------------------------------------------------------------------------
// Narrative grounding record (narrative-drift detection)
// ---------------------------------------------------------------------------

/** One card this sidecar's prompt / text was grounded in by the
 *  `narrative-audio-direction` skill. The machine-readable twin of
 *  the `context` prose ("Grounded in character:reiska"). */
export const GroundingCardRefSchema = z.object({
  /** The card this line was grounded in, `type:slug`
   *  (`character:reiska`, `location:shrine`, `scene:opening`). */
  cardId: z.string().regex(/^[a-z]+:[a-z0-9-]+$/),
  /** True when a card actually resolved (GROUNDED); false when the
   *  skill INFERRED with no card present. An unresolved ref carries
   *  the cardId the line WOULD ground in, so drift can flag "a card
   *  now exists — re-ground for higher fidelity." */
  resolved: z.boolean(),
  /** SHA-256 of the card's content at grounding time. Null until
   *  the detector stamps the baseline; null forever for an
   *  unresolved ref (no card to fingerprint). */
  fingerprint: z.string().nullable().default(null),
});
export type GroundingCardRef = z.infer<typeof GroundingCardRefSchema>;

/** The structured narrative-dependency record on a sidecar. Written
 *  by the skill (fingerprints null), baseline-stamped by the drift
 *  detector. Provenance-shape — does NOT participate in the cache
 *  hash (stripped by `normalizeSidecarForHash`), so stamping a
 *  fingerprint never re-bills a regen. */
export const AudioGroundingSchema = z.object({
  /** When narrative-audio-direction last grounded this sidecar.
   *  Bumping it (a re-ground) signals the detector to RE-baseline
   *  rather than report drift. */
  groundedAt: z.string(),
  /** Which sidecar fields were grounded — what a re-ground rewrites. */
  fields: z.array(z.enum(['prompt', 'text'])).default([]),
  /** The cards this line depends on (character + scene, a location,
   *  …). Empty is legal (INFERRED-from-tone, no specific card). */
  cards: z.array(GroundingCardRefSchema).default([]),
});
export type AudioGrounding = z.infer<typeof AudioGroundingSchema>;

// ---------------------------------------------------------------------------
// Voice sidecar (Phase 1 — shipped)
// ---------------------------------------------------------------------------

const VoiceSidecarSchema = z.object({
  kind: z.literal('voice'),
  /** Active vendor. Phase 1 ships `'elevenlabs'`. */
  service: z.literal('elevenlabs'),
  /** Provenance marker for a BROUGHT-IN audio file. `'imported'` ⇒
   *  author-supplied bytes: the generation pipeline SKIPS it (no
   *  vendor call, no re-bill, no overwrite); forge's raw audio
   *  pipeline still encodes the bytes into the typed registry, so an
   *  imported clip is a first-class asset. Absent ⇒ generated. */
  source: z.literal('imported').optional(),
  /** Original file name the clip was imported from — display
   *  provenance only; not hashed. Meaningful only when imported. */
  importedFrom: z.string().optional(),
  /** Authoring direction — short prose describing the line's
   *  emotional tone, character context, or mix posture. The
   *  style prefix from `audio-gen.config.ts` is prepended to
   *  this and BOTH participate in the cache hash (style
   *  changes invalidate everything).
   *
   *  EXAMPLES:
   *    - "Sora speaks softly, quiet determination."
   *    - "Tired narrator, end of a long day."
   *    - "Shocked discovery, breath caught."
   *
   *  This is NOT the spoken text — that's `text` below.
   *  ElevenLabs uses the prompt indirectly via voice +
   *  stability tuning; for tone we lean on the chosen voiceId
   *  and `params.stability` / `params.style` knobs. */
  prompt: z.string().min(1),
  /** The actual text spoken. ElevenLabs reads this verbatim.
   *  Limit 5000 characters per request (ElevenLabs cap). For
   *  longer monologues, split into multiple sidecars +
   *  concatenate at runtime. */
  text: z.string().min(1).max(5000),
  /** Per-locale translated spoken line — the localization Phase 2
   *  axis. When present, forge generates one ADDITIONAL voice output
   *  per locale (`<slot>.<locale>.<ext>`) from the translated text +
   *  the locale's voice (see `voiceCast[alias].localeVoices`, else the
   *  base voice — a multilingual model speaks the target language from
   *  the text alone). Filled by `@unsupervised/loc-gen`'s `translate-voice`
   *  bridge or by hand. The `text` field above stays the SOURCE-locale
   *  line. Does NOT participate in the base line's cache hash (stripped
   *  in `normalizeSidecarForHash`) — each locale's DERIVED sidecar
   *  hashes independently via its own `text` + `voiceId`, so adding a
   *  localization never re-bills the source line. */
  localizedText: z.record(LocaleIdSchema, z.string().min(1).max(5000)).optional(),
  /** Vendor parameters. */
  params: ElevenLabsVoiceParamsSchema,
  /** Validation gates. Falls back to style-config defaults. */
  validation: AudioValidationOptionsSchema.optional(),
  /** Free-form prose describing WHERE in the game this asset
   *  is used. Author-declared intent; does NOT participate in
   *  the cache hash (editing it doesn't invalidate cached
   *  audio). Examples:
   *    - "Sora's opening voice line at the torii gate"
   *    - "Plays on enter-room when a boon is offered"
   *    - "Shrine hub ambient loop, layered with bird SFX"
   *  Surfaced in workbench's Audio pane alongside the
   *  auto-discovered code references. Authors maintain this
   *  by hand; workbench's edit mode persists changes back to the
   *  sidecar file. */
  context: z.string().optional(),
  /** Narrative grounding record — the machine-readable dependency
   *  on the narrative cards this prompt / text was grounded in.
   *  Written by `narrative-audio-direction`, baseline-stamped by
   *  the drift detector. Provenance-shape — does NOT participate in
   *  the cache hash. */
  grounding: AudioGroundingSchema.optional(),
  /** Cache lock — when set, regeneration is BLOCKED until
   *  removed. The hash committed here MUST match the current
   *  computed hash; mismatch surfaces as a clear error. */
  lockedHash: z.string().optional(),
  /** Post-processing chain applied between cache write (raw
   *  vendor bytes) and public-output write (shipped bytes).
   *  Optional — when omitted, falls back to the project-wide
   *  `defaultPost.voice` from `audio-gen.config.ts`. Editing
   *  this field does NOT invalidate the cache; the next forge
   *  run re-emits the public output with the new chain
   *  without re-billing the vendor. */
  post: AudioPostChainSchema.optional(),
  /** Take history — every successful + failed generation
   *  attempt for this slot, chronologically ordered. AT MOST
   *  ONE entry has `kept: true`; that take's bytes are the
   *  current shipped output. Optional for backwards
   *  compatibility with v1 sidecars that predate the take-
   *  history schema — readers synthesize a single-entry takes
   *  array from `lastGeneratedAt` / `lastCostUsd` / `lastBytes`
   *  when this field is absent. */
  takes: z.array(AudioTakeRecordSchema).optional(),
  /** Provenance fields appended by the pipeline. Mirror the
   *  kept take's fields for backwards compatibility with v1
   *  consumers (forge cache-parity check, workbench quick-glance
   *  meta chips). The take-history schema is the source of
   *  truth; these are derived. */
  lastGeneratedAt: z.string().optional(),
  lastCostUsd: z.number().nonnegative().optional(),
  lastBytes: z.number().int().nonnegative().optional(),
  lastError: z
    .object({
      kind: z.string(),
      message: z.string(),
      issues: z.array(z.string()).optional(),
      at: z.string(),
    })
    .optional(),
});

// ---------------------------------------------------------------------------
// SFX + Music sidecar schemas — Phases 2 + 3
// ---------------------------------------------------------------------------

const SfxSidecarSchema = z.object({
  kind: z.literal('sfx'),
  service: z.literal('elevenlabs'),
  /** Provenance marker for a BROUGHT-IN audio file — see the
   *  identical field on `VoiceSidecarSchema`. `'imported'` ⇒ the
   *  pipeline skips generation (no vendor call, no re-bill, no
   *  overwrite); forge still encodes the bytes. */
  source: z.literal('imported').optional(),
  /** Original file name — display provenance only; not hashed. */
  importedFrom: z.string().optional(),
  prompt: z.string().min(1),
  params: ElevenLabsSfxParamsSchema,
  validation: AudioValidationOptionsSchema.optional(),
  /** Free-form prose describing WHERE in the game this asset
   *  is used. Provenance-shape — does NOT participate in the
   *  cache hash. Edit via workbench's Audio pane. */
  context: z.string().optional(),
  /** Narrative grounding record — see VoiceSidecarSchema.grounding.
   *  Provenance-shape; does NOT participate in the cache hash. */
  grounding: AudioGroundingSchema.optional(),
  lockedHash: z.string().optional(),
  /** Post-processing chain — see VoiceSidecarSchema.post. */
  post: AudioPostChainSchema.optional(),
  /** Take history — see VoiceSidecarSchema.takes for full
   *  semantics. */
  takes: z.array(AudioTakeRecordSchema).optional(),
  lastGeneratedAt: z.string().optional(),
  lastCostUsd: z.number().nonnegative().optional(),
  lastBytes: z.number().int().nonnegative().optional(),
  lastError: z
    .object({
      kind: z.string(),
      message: z.string(),
      issues: z.array(z.string()).optional(),
      at: z.string(),
    })
    .optional(),
});

const MusicSidecarSchema = z.object({
  kind: z.literal('music'),
  service: z.literal('suno'),
  /** Provenance marker for a BROUGHT-IN audio file — see the
   *  identical field on `VoiceSidecarSchema`. `'imported'` ⇒ the
   *  pipeline skips generation (no vendor call, no re-bill, no
   *  overwrite); forge still encodes the bytes. */
  source: z.literal('imported').optional(),
  /** Original file name — display provenance only; not hashed. */
  importedFrom: z.string().optional(),
  prompt: z.string().min(1),
  params: SunoMusicParamsSchema,
  validation: AudioValidationOptionsSchema.optional(),
  /** Free-form prose describing WHERE in the game this asset
   *  is used. Provenance-shape — does NOT participate in the
   *  cache hash. Edit via workbench's Audio pane. */
  context: z.string().optional(),
  /** Narrative grounding record — see VoiceSidecarSchema.grounding.
   *  Provenance-shape; does NOT participate in the cache hash. */
  grounding: AudioGroundingSchema.optional(),
  lockedHash: z.string().optional(),
  /** Post-processing chain — see VoiceSidecarSchema.post. */
  post: AudioPostChainSchema.optional(),
  /** Take history — see VoiceSidecarSchema.takes for full
   *  semantics. */
  takes: z.array(AudioTakeRecordSchema).optional(),
  lastGeneratedAt: z.string().optional(),
  lastCostUsd: z.number().nonnegative().optional(),
  lastBytes: z.number().int().nonnegative().optional(),
  lastError: z
    .object({
      kind: z.string(),
      message: z.string(),
      issues: z.array(z.string()).optional(),
      at: z.string(),
    })
    .optional(),
});

// ---------------------------------------------------------------------------
// AudioSidecar discriminated union
// ---------------------------------------------------------------------------

export const AudioSidecarSchema = z.discriminatedUnion('kind', [
  VoiceSidecarSchema,
  SfxSidecarSchema,
  MusicSidecarSchema,
]);
export type AudioSidecar = z.infer<typeof AudioSidecarSchema>;
export type VoiceSidecar = z.infer<typeof VoiceSidecarSchema>;
export type SfxSidecar = z.infer<typeof SfxSidecarSchema>;
export type MusicSidecar = z.infer<typeof MusicSidecarSchema>;

// ---------------------------------------------------------------------------
// Project-wide audio style config
// ---------------------------------------------------------------------------

/** Project-level audio-gen config. Authored at
 *  `apps/<game>/audio-gen.config.ts`; one per app, sibling to
 *  `asset-gen.config.ts`.
 *
 *  The `stylePrefix` participates in the cache hash so style
 *  changes invalidate every cached audio asset deliberately.
 *  Audio style is per-kind in practice (voice direction differs
 *  from SFX direction differs from music direction); the
 *  `styleByKind` map handles the per-kind specialization. */
/** L3-review config. Opt-in per game via the `review` block on
 *  `audio-gen.config.ts`. When absent, review never runs — the
 *  pipeline behaves exactly as before.
 *
 *  `failVerdictAction` governs the in-forge posture on a `fail`
 *  verdict: `'flag'` (default) records the verdict + logs it,
 *  never regenerating; `'retry'` opts into deterministic
 *  mechanical re-rolls (Phase 3). The judgement-driven retry
 *  (rewrite prompt/params from the rationale) is the
 *  `audio-l3-review` skill's job, not this flag's. */
export const AudioReviewConfigSchema = z.object({
  /** Master switch. Default OFF — review is opt-in. */
  enabled: z.boolean().default(false),
  /** In-forge posture on a `fail` verdict:
   *    - `'flag'`   — record the verdict, change nothing (default).
   *    - `'retry'`  — blind re-roll of the SAME recipe up to
   *      `maxTakesPerSlot` (Phase 3; for vendor nondeterminism).
   *    - `'retune'` — Part C: on a fail, infer a BOUNDED param
   *      delta from the judge's structured `delivery` diagnosis
   *      (`inferParamAdjustment`), apply it + regenerate; when no
   *      delta applies (music, a non-delivery problem, or a bound
   *      hit) fall back to ONE blind re-roll for that attempt — so
   *      `retune` is a strict superset of `retry`. Bounded by the
   *      same `maxTakesPerSlot` + budget. */
  failVerdictAction: z.enum(['flag', 'retry', 'retune']).default('flag'),
  /** Max takes per slot the deterministic retry / retune loop may
   *  append (Phase 3 / Part C). Bounds the loop alongside the
   *  budget cap. */
  maxTakesPerSlot: z.number().int().min(1).max(10).default(3),
  /** Judge model for the perceptual criterion (Phase 2).
   *  Defaults to `claude-sonnet-5` — the cost/quality sweet spot
   *  for a high-volume vision-classify task (near-Opus reasoning
   *  at a fraction of the output cost). Set `claude-haiku-4-5`
   *  for cheapest, or `claude-opus-4-8` when a line keeps getting
   *  misjudged and you want the ceiling. */
  judgeModel: z.string().min(1).default('claude-sonnet-5'),
  /** How the perceptual judge reaches Claude:
   *    - `'claude-cli'` — spawn the `claude` CLI (reuses the
   *      developer's Claude Code login; billed to the
   *      subscription; NO api key needed; heavier per call since
   *      each invocation carries the CLI's agent context).
   *    - `'api'` — direct Anthropic vision call (needs
   *      `ANTHROPIC_API_KEY`; metered per-token; lighter + faster;
   *      best for CI / bulk).
   *    - `'auto'` (default) — prefer the CLI when `claude`
   *      resolves on PATH, else fall back to the API key. */
  judgeProvider: z.enum(['auto', 'api', 'claude-cli']).default('auto'),
  /** Path to the `claude` binary. Empty = resolve `claude` from
   *  PATH. Only used by the `claude-cli` provider. */
  claudeCliPath: z.string().optional(),
  /** Word-error-rate at/below which a voice line PASSES content
   *  fidelity. */
  werConcernThreshold: z.number().min(0).max(1).default(0.1),
  /** Word-error-rate at/below which a voice line is a CONCERN
   *  (above it → `fail`). */
  werFailThreshold: z.number().min(0).max(1).default(0.25),
  /** Flag a bare `concern` verdict (or a degraded judge) for human
   *  review — the confidence-gated escalation. Sets
   *  `AudioReviewSummary.escalation`, which the approval `queue`
   *  surfaces as `needs-review`. Shared with asset-gen via
   *  `@unsupervised/ai-review`'s `computeEscalation`. */
  escalateConcern: z.boolean().default(true),
  /** N-vote perceptual panel for the `delivery-intent` criterion.
   *  A single LLM judge is uncalibrated + non-deterministic; a panel
   *  runs `jurors` independent jurors (each on a distinct delivery
   *  lens when `diverseLenses`), takes the majority verdict, and
   *  escalates a split below `escalateBelowAgreement`. `jurors: 1`
   *  (default) is the exact single-vote behavior. Billed per juror.
   *  The aggregation math is shared with asset-gen via
   *  `@unsupervised/ai-review`. */
  panel: z
    .object({
      jurors: z.number().int().min(1).max(5).default(1),
      diverseLenses: z.boolean().default(true),
      escalateBelowAgreement: z.number().min(0).max(1).default(0.67),
    })
    .default({}),
});
export type AudioReviewConfig = z.infer<typeof AudioReviewConfigSchema>;
export type AudioReviewConfigInput = z.input<typeof AudioReviewConfigSchema>;

export const AudioStyleConfigSchema = z.object({
  /** Project-wide style fragment prepended to every prompt.
   *  Example for komorebi: `"Japanese folklore atmosphere,
   *  serene yet ominous, period-appropriate vocal tones"`. */
  stylePrefix: z.string().default(''),
  /** Per-kind style sub-fragments. Appended AFTER `stylePrefix`
   *  when the matching kind generates. Authors typically set
   *  voice / sfx / music to different art-direction phrases. */
  styleByKind: z
    .object({
      voice: z.string().optional(),
      sfx: z.string().optional(),
      music: z.string().optional(),
    })
    .optional(),
  /** Voice cast — named aliases that map to ElevenLabs voice
   *  ids. Sidecars can reference voices by alias OR by raw
   *  id; aliases stay stable across vendor reshuffles. */
  voiceCast: z
    .record(
      z.string().min(1),
      z.object({
        voiceId: z.string().min(1),
        /** Optional default model / stability per character.
         *  Sidecar params override these. */
        defaultModelId: z
          .enum([
            'eleven_multilingual_v2',
            'eleven_turbo_v2_5',
            'eleven_monolingual_v1',
            'eleven_flash_v2_5',
          ])
          .optional(),
        defaultStability: z.number().min(0).max(1).optional(),
        /** Per-locale voice overrides (localization Phase 2). When a
         *  voice sidecar carries `localizedText[locale]`, forge picks
         *  the voice for that locale here — a NATIVE voice for the
         *  language. A locale absent from this map reuses the base
         *  `voiceId` above (a multilingual model still speaks the
         *  translated text correctly; the override only matters when
         *  you want a locale-native performer). Swapping a locale's
         *  voice invalidates only that locale's cached lines. */
        localeVoices: z
          .record(
            LocaleIdSchema,
            z.object({
              voiceId: z.string().min(1),
              defaultModelId: z
                .enum([
                  'eleven_multilingual_v2',
                  'eleven_turbo_v2_5',
                  'eleven_monolingual_v1',
                  'eleven_flash_v2_5',
                ])
                .optional(),
              defaultStability: z.number().min(0).max(1).optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
  /** Soft cap on per-pipeline-run spend (USD). Warns when
   *  exceeded; does NOT block. */
  budgetSoftUsd: z.number().nonnegative().default(2),
  /** Hard cap on per-pipeline-run spend (USD). Aborts the
   *  pipeline when a new task's projected cost would push the
   *  session past this. */
  budgetHardUsd: z.number().nonnegative().default(10),
  /** LIFETIME spend ceiling (USD) — cumulative across EVERY run,
   *  summed from the audit log. The per-run caps reset each
   *  `forge runOnce`; this bounds total spend no matter how many
   *  runs. A generation whose projected cost would push all-time
   *  spend past this is rejected. Undefined ⇒ no lifetime cap
   *  (default). The AI-pilot backstop; shared with `@unsupervised/asset-gen`
   *  via `@unsupervised/gen-core`'s spend guardrails. */
  budgetLifetimeUsd: z.number().nonnegative().optional(),
  /** Require an explicit, bounded, unexpired spend AUTHORIZATION
   *  before any vendor call (the propose-approve gate). When true, a
   *  billed generation is rejected (`spend-unauthorized`) unless
   *  `.audio-gen-spend-authorization.json` grants enough headroom —
   *  written by `audio-gen authorize --up-to <usd>`. Off by default
   *  (human-driven runs spend freely); turn on for autonomous / CI
   *  contexts. */
  requireSpendAuthorization: z.boolean().default(false),
  /** Default validation gates folded in when a sidecar omits
   *  its own `validation` block. */
  defaultValidation: z
    .object({
      voice: AudioValidationOptionsSchema.optional(),
      sfx: AudioValidationOptionsSchema.optional(),
      music: AudioValidationOptionsSchema.optional(),
    })
    .optional(),
  /** Per-kind default post-processing chains. Folded in when
   *  a sidecar omits its own `post` block. Recommended
   *  starting point for game audio (apps override per-game):
   *
   *  ```ts
   *  defaultPost: {
   *    voice: { normalizeLufs: -23, fadeInMs: 20, fadeOutMs: 80,
   *             eq: [{ type: 'highpass', frequencyHz: 80 }] },
   *    sfx:   { normalizeLufs: -16, truePeakDb: -1.0 },
   *    music: { normalizeLufs: -16, fadeInMs: 100, fadeOutMs: 500 },
   *  }
   *  ```
   *
   *  Editing this map re-emits public outputs on the next forge
   *  run without re-billing the vendor (the cache holds raw
   *  vendor bytes; only the post-chain step re-runs). */
  defaultPost: z
    .object({
      voice: AudioPostChainSchema.optional(),
      sfx: AudioPostChainSchema.optional(),
      music: AudioPostChainSchema.optional(),
    })
    .optional(),
  /** Project-wide banned-term list. Sidecar `prompt` AND
   *  (for voice) `text` are checked against this list before
   *  dispatching. Match → `'prompt-rejected'` GenerationError,
   *  no API call, no spend.
   *
   *  Voice generation is the most sensitive content path:
   *  ElevenLabs (and most vendors) prohibit hate speech,
   *  threats, sexually explicit lines, real-person likenesses,
   *  and children-in-harmful-contexts content. Banned terms
   *  here are the FIRST gate; vendor TOS enforcement is the
   *  second. */
  bannedTerms: z.array(z.string().min(1)).default([]),
  /** L3-review config. Optional + opt-in; when omitted, the
   *  pipeline's verification arm never runs. See
   *  `AudioReviewConfigSchema`. */
  review: AudioReviewConfigSchema.optional(),
  /** Narrative-drift check. When true, `pnpm forge` runs
   *  `detectNarrativeDrift` after generating audio — stamping
   *  baseline fingerprints on freshly-grounded sidecars and
   *  WARNING on any line whose grounded narrative card has since
   *  changed. Warn-only; never blocks the build or regenerates.
   *  Default OFF (opt-in per game). See
   *  [docs/specs/narrative-drift-detection.md]. */
  driftCheck: z.boolean().default(false),
  // NB: generation PROVIDER selection (ElevenLabs ⇄ NIM Riva, model, endpoint)
  // is NOT here — it's an Atelier-OWNER concern read from the environment
  // (`ATELIER_VOICE_PROVIDER`), so a customer's game config can never point
  // generation at a provider. See gen-core `readProviderSelection` +
  // docs/specs/multi-provider-generation.md.
});
export type AudioStyleConfig = z.infer<typeof AudioStyleConfigSchema>;

/** Input variant — every default-bearing field optional. Authors
 *  writing `apps/<game>/audio-gen.config.ts` annotate with this
 *  type so they can omit defaults. */
export type AudioStyleConfigInput = z.input<typeof AudioStyleConfigSchema>;
