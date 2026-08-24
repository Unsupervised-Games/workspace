// Asset-generation pipeline shapes — `PromptSidecar` (the
// recipe authored next to where the asset wants to live) and
// `StyleConfig` (the project-wide prompt-baking + budget
// surface).
//
// Two discriminated unions on `kind`:
//
//   1. `PromptSidecar` — `'model'` for now; `'sprite'` / `'audio'`
//      land when the second + third vendors slot in.
//   2. `ServiceConfig` per kind — `'meshy'` for `'model'`;
//      future vendors register their per-service params here.
//
// The forge `assetGenPipeline` discovers `*.prompt.json` files
// under `assets-raw/`, validates each via `PromptSidecarSchema`,
// and dispatches by `(kind, service)` to the matching client.
import { z } from 'zod';
// ---------------------------------------------------------------------------
// Meshy (model service)
// ---------------------------------------------------------------------------
/** Meshy's text-to-3D parameter surface. Mirrors Meshy's
 *  public API shape; the runtime client maps these through to
 *  the HTTP layer 1:1.
 *
 *  ART-DIRECTION CHANNEL: the load-bearing styling vector is
 *  the project-wide `stylePrefix` in `asset-gen.config.ts`
 *  (prepended to every prompt). The `artStyle` API parameter
 *  is supplementary — at time of writing Meshy's v2 endpoint
 *  REJECTS values other than `'realistic'` with HTTP 400
 *  (`"ArtStyle must be one of [realistic]"`). Omit the field
 *  to let Meshy default; set it explicitly only when you've
 *  verified your account / plan supports the value. */
export const MeshyModelParamsSchema = z.object({
    /** Visual style preset. OPTIONAL — omit unless your Meshy
     *  plan supports values beyond `'realistic'`. Defaults to
     *  unset (no field sent on the request). */
    artStyle: z.enum(['realistic', 'stylized', 'cartoon']).optional(),
    /** Mesh topology. `'quad'` is friendlier to downstream
     *  Blender editing; `'triangle'` is what runtime renderers
     *  consume anyway after Meshopt re-encoding. Default
     *  `'quad'` to keep the source asset author-friendly. */
    topology: z.enum(['triangle', 'quad']).optional().default('quad'),
    /** Target polygon budget. Meshy honors as a hint; the
     *  result is approximate. Common values: 4_000 (background
     *  prop), 8_000 (hero character), 16_000 (cinematic). */
    targetPolycount: z
        .number()
        .int()
        .positive()
        .optional()
        .default(8_000),
});
/** Meshy rig-task parameters. Meshy's auto-rigging is
 *  humanoid-only and auto-detects body structure — no
 *  `rigType` parameter exists. The only tunable knob is
 *  `heightMeters` for proportional rigging accuracy
 *  (default 1.7). */
export const MeshyRigParamsSchema = z.object({
    /** Character height in meters. Default 1.7 (average human).
     *  Tune for non-default-scale characters (chibi /
     *  giant boss / etc.). */
    heightMeters: z.number().positive().optional(),
});
// ---------------------------------------------------------------------------
// CivitAI (concept-art service)
// ---------------------------------------------------------------------------
/** CivitAI Z-Image generation parameters. Per-sidecar
 *  overrides on top of the project-wide `civitai` block in
 *  `asset-gen.config.ts`. All fields optional; the orchestrator
 *  folds in config defaults at dispatch time. */
export const CivitAIImageParamsSchema = z.object({
    /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
     *  vs `base` (production quality). Default `base` for
     *  character / environment concepts; turbo is fine for
     *  props / iteration loops. */
    model: z.enum(['turbo', 'base']).optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    cfgScale: z.number().nonnegative().optional(),
    steps: z.number().int().positive().optional(),
    /** LoRA URN → strength. Z-Image ecosystem URNs only
     *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
    loras: z.record(z.string().min(1), z.number()).optional(),
});
/** Per-view concept-art prompt + downloaded image path. Apps
 *  authoring sidecars supply ONLY the `prompt`; the path is
 *  filled in by the pipeline after generation. */
export const ConceptArtViewSchema = z.object({
    /** Per-view prompt fragment. The pipeline composes:
     *  `<style prefix> <sidecar prompt> <view prompt>` and
     *  sends to CivitAI. Examples:
     *    - "front view, T-pose, orthographic"
     *    - "side view, T-pose, orthographic"
     *    - "back view, T-pose, orthographic"
     *    - "hero shot, low camera, dramatic lighting"     (env)
     *    - "top-down floor plan, isometric"               (env)
     *  Keep these terse — concept verbal direction lives on
     *  the main `prompt` field. */
    prompt: z.string().min(1),
    /** Stable label for filesystem layout: `concept/<asset>/<label>.png`.
     *  Convention: kebab-case (`front`, `side`, `back`, `hero`,
     *  `plan`, `detail-1`). */
    label: z.string().min(1),
});
/** Concept-art config block — present on sidecars that use the
 *  `'concept-art'` pipeline. Authors specify the view set +
 *  optional CivitAI param overrides; the pipeline runs CivitAI
 *  per-view + feeds the bytes into Meshy multi-image-to-3D. */
export const ConceptArtConfigSchema = z.object({
    /** 1-4 views to generate. Meshy multi-image-to-3D accepts
     *  1-4 reference images; passing fewer reduces cost but
     *  also reduces 3D fidelity for complex subjects. */
    views: z.array(ConceptArtViewSchema).min(1).max(4),
    /** Optional CivitAI param overrides — fold over the
     *  project-wide config defaults. */
    civitai: CivitAIImageParamsSchema.optional(),
});
// ---------------------------------------------------------------------------
// Grounding record (Ground + Maintain)
// ---------------------------------------------------------------------------
/** One narrative card an asset's prompt was grounded in — the
 *  SUBJECT source. Machine-readable twin of the prose link. */
export const AssetGroundingCardRefSchema = z.object({
    /** `type:slug` — `character:reiska`, `item:moon-blade`,
     *  `location:shrine`. */
    cardId: z.string().regex(/^[a-z]+:[a-z0-9-]+$/),
    /** True when a card resolved (GROUNDED); false when the skill
     *  INFERRED with no card present (still records the intended id
     *  so drift can flag "a card now exists"). */
    resolved: z.boolean(),
    /** SHA-256 of the card content at grounding time. Null until
     *  the drift detector stamps the baseline. */
    fingerprint: z.string().nullable().default(null),
});
/** The structured grounding record on an asset sidecar. Written
 *  by the `art-direction` skill (fingerprints null), baseline-
 *  stamped by the drift detector. Grounds on TWO axes — the
 *  narrative cards (SUBJECT) and the Art Bible (STYLE) — so an
 *  asset goes stale when EITHER its card OR the Art Bible
 *  changes. Provenance-shape: does NOT participate in the cache
 *  hash. */
export const AssetGroundingSchema = z.object({
    /** When the asset was last grounded. Bumping it (a re-ground)
     *  signals the detector to RE-baseline rather than report drift. */
    groundedAt: z.string(),
    /** Which sidecar fields derive from the grounding: images/models
     *  ground `prompt` (+ `negativePrompt`); a character model's MOTION
     *  is grounded via `motionKit` / `motionAdd` (the `animation-
     *  direction` skill). A model grounded for BOTH art + motion carries
     *  the UNION here. */
    fields: z
        .array(z.enum(['prompt', 'negativePrompt', 'motionKit', 'motionAdd']))
        .default(['prompt']),
    /** The SUBJECT cards this asset depends on. */
    cards: z.array(AssetGroundingCardRefSchema).default([]),
    /** The Art Bible (STYLE) fingerprint at grounding time. Null
     *  until stamped; a Bible edit → every asset carrying a stale
     *  fingerprint drifts. */
    artBibleFingerprint: z.string().nullable().default(null),
});
// ---------------------------------------------------------------------------
// Prompt sidecar (model kind — first shipped)
// ---------------------------------------------------------------------------
/** Validation gates that fire AFTER generation completes. The
 *  caller can override per-asset; defaults live in the style
 *  config. */
export const ModelValidationOptionsSchema = z.object({
    /** Reject if vertex count falls outside this band. Lower
     *  bound catches empty / degenerate outputs; upper bound
     *  catches polycount overruns. */
    minVertices: z.number().int().positive().optional().default(50),
    maxVertices: z.number().int().positive().optional().default(50_000),
    /** Require the model to have a skeleton with ≥ this many
     *  bones. Disable by setting to 0. */
    minBones: z.number().int().nonnegative().optional().default(0),
    /** Reject if any of these named animation clips are missing.
     *  Empty array disables the check. */
    requiredAnimations: z.array(z.string()).optional().default([]),
});
// ---------------------------------------------------------------------------
// Asset take history (versioning) — the asset twin of AudioTakeRecord.
// Every generation is an immutable take; exactly one carries `kept: true`
// (its bytes are the shipped/active output). Because the content-addressed
// @unsupervised/asset-store retains every take's blob, an OLD take can be swapped
// back in as the active version — the "versioning the assets" feature. The
// SEMANTICS (append / promote / retire / legacy synthesis + the kept
// invariant) live in @unsupervised/asset-gen `takes.ts`, exactly like audio-gen.
// ---------------------------------------------------------------------------
export const AssetTakeRecordSchema = z.object({
    /** Cache-key content hash for THIS take's bytes — unique per take, so two
     *  takes of identical inputs at different timestamps don't collide.
     *  `SHA256(inputHash || '\\0' || takenAt)` via `computeTakeHash` in
     *  @unsupervised/asset-gen. The bytes live at `.asset-gen-cache/<kind>/<hash>.<ext>`. */
    hash: z.string().min(1),
    /** Deterministic input-fingerprint (the pipeline's `fullHash`). Two takes of
     *  the SAME sidecar inputs share it; editing the prompt/params changes it. The
     *  value `lockedHash` validates against. */
    inputHash: z.string().min(1),
    /** ISO-8601 generation timestamp — chronological ordering + UI display. */
    takenAt: z.string().min(1),
    /** USD cost charged for this take. The kept take's cost mirrors to the
     *  sidecar-level `lastCostUsd`. */
    costUsd: z.number().nonnegative(),
    /** Byte size of the generated asset. */
    bytes: z.number().int().nonnegative(),
    /** File extension (`'glb'` for models, `'png'` for images). */
    extension: z.string().min(1),
    /** Exactly one take per sidecar has `kept: true` — its bytes are the active
     *  output. */
    kept: z.boolean(),
    /** Free-form author note. Does NOT participate in the cache hash. */
    notes: z.string().optional(),
    /** The seed a model take was generated with (models track `lastGeneratedSeed`);
     *  lets the drawer show + a re-roll reuse it. */
    seed: z.number().int().optional(),
    /** Provider + model that produced this take (`'civitai'` / `'z-image'`,
     *  `'nim'` / `'flux.1-dev'`). Provenance only — provider/model are NOT
     *  in the cache hash. Lets the version-history drawer show which
     *  provider made each swappable version. Undefined on legacy takes. */
    provider: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    /** Present when the generation FAILED (no usable bytes, never `kept: true`). */
    error: z
        .object({
        kind: z.string(),
        message: z.string(),
        issues: z.array(z.string()).optional(),
        at: z.string(),
    })
        .optional(),
});
const ModelSidecarSchema = z.object({
    kind: z.literal('model'),
    /** Active vendor for this sidecar. v1 supports `'meshy'`. */
    service: z.literal('meshy'),
    /** Provenance marker for a BROUGHT-IN asset. When `'imported'`, the
     *  bytes beside this sidecar were supplied by the author (not
     *  vendor-generated): the generation pipeline SKIPS it — never
     *  dispatches to a vendor, never re-bills, never overwrites the
     *  bytes. The forge raw-asset pipeline still encodes those bytes
     *  into the typed runtime registry, so an imported asset is a
     *  first-class asset identical at runtime to a generated one.
     *  Absent ⇒ a normal generated sidecar. See `importedFrom`. */
    source: z.literal('imported').optional(),
    /** Original file name the asset was imported from — display
     *  provenance only; not part of the cache hash. Meaningful only
     *  when `source === 'imported'`. */
    importedFrom: z.string().optional(),
    /** Generation pipeline. `'text-to-3d'` (default) is the
     *  Day-1-3 path — Meshy text-to-3D + remesh + optional rig
     *  + optional anims. `'concept-art'` is the v2 path —
     *  CivitAI Z-Image generates multi-view concept art, Meshy
     *  multi-image-to-3D consumes the references, then the
     *  same downstream rig + anims chain. Concept-art produces
     *  higher-fidelity output on complex subjects at a similar
     *  cost; `text-to-3d` stays available for legacy sidecars
     *  + simple assets where the extra concept-art step
     *  isn't worth the latency. */
    pipeline: z.enum(['text-to-3d', 'concept-art']).optional(),
    /** Concept-art config — REQUIRED when `pipeline:
     *  'concept-art'`, ignored otherwise. The pipeline guards
     *  the dispatch with a runtime check; the schema-level
     *  enforcement is via the orchestrator (not refine() —
     *  refines break .optional() composition per the
     *  @unsupervised/schemas conventions). */
    conceptArt: ConceptArtConfigSchema.optional(),
    /** User-authored prompt. The style config's `prefix` is
     *  prepended at runtime; the hash key includes the baked
     *  prompt + a style fingerprint. */
    prompt: z.string().min(1),
    /** Vendor-honored negative prompt. Optional. */
    negativePrompt: z.string().optional(),
    /** Deterministic seed. Optional — when omitted the vendor
     *  picks one and persists it back to the sidecar via
     *  `lastGeneratedSeed`. */
    seed: z.number().int().optional(),
    /** Meshy-specific knobs. Falls back to schema defaults
     *  when omitted. */
    params: MeshyModelParamsSchema.optional(),
    /** Auto-rigging step. When true, the model task's output is
     *  passed to Meshy's rigging endpoint, producing a rigged
     *  GLB suitable for animation. HUMANOID-ONLY — quadrupeds,
     *  flying creatures, and abstract spirits CANNOT be
     *  auto-rigged by Meshy; ship those as static GLBs and
     *  hand-rig in Blender post-hoc if animation is needed. */
    withRig: z.boolean().optional().default(false),
    /** Meshy rig parameters; only consulted when
     *  `withRig: true`. */
    rigParams: MeshyRigParamsSchema.optional(),
    /** Animation action IDs from Meshy's library (see
     *  https://docs.meshy.ai/en/api/animation-library). Each
     *  ID produces a separate GLB containing the rigged
     *  character with that one clip applied; the pipeline
     *  downloads the LAST animation's GLB as the final output
     *  (clip-merging across multiple GLBs is deferred —
     *  apps wanting multi-clip characters either pick the
     *  most-used animation as primary OR layer a Blender
     *  merge step post-hoc).
     *
     *  Common action IDs:
     *    - 0   Idle
     *    - 1   Walking_Woman
     *    - 4   Attack
     *    - 8   Dead
     *    - 30  Casual_Walk
     *    - 156-170  Dodging variants
     *
     *  Requires `withRig: true`. Empty array (default) = no
     *  animation step; output is the rigged or bare GLB.
     *
     *  LEGACY ESCAPE HATCH. Prefer `motionKit` + the project
     *  `motionLibrary` (semantic named clips, resolved + merged by
     *  the animation pipeline). This raw numeric array stays for
     *  one-off action ids not worth naming; it's consulted only when
     *  no `motionKit` / `motionAdd` resolves. */
    animations: z.array(z.number().int().nonnegative()).optional().default([]),
    /** Motion kit name (from `motionKits` in asset-gen.config.ts) —
     *  resolves to a set of named clips generated for this character.
     *  Supersedes the legacy numeric `animations` array; requires
     *  `withRig: true`. */
    motionKit: z.string().min(1).optional(),
    /** Extra `motionLibrary` clip names appended to the kit —
     *  per-character additions beyond the role bundle (e.g. a boss's
     *  signature attack on top of `humanoid-basic`). */
    motionAdd: z.array(z.string().min(1)).optional(),
    /** Validation gates that fire after generation. Defaults
     *  fold in from the style config. */
    validation: ModelValidationOptionsSchema.optional(),
    /** Narrative + Art-Bible grounding record (Ground + Maintain).
     *  Written by the `art-direction` skill; the drift detector
     *  fingerprints the card (subject) + the Art Bible (style) so a
     *  model goes stale when either changes — the same two-axis
     *  grounding as 2D images. Provenance-shape; not hashed. */
    grounding: AssetGroundingSchema.optional(),
    /** Cache lock — when set, regeneration is BLOCKED until
     *  removed. The hash committed here MUST match the current
     *  computed hash; mismatch surfaces as a clear error
     *  (someone edited the prompt while it was locked). */
    lockedHash: z.string().optional(),
    /** Provenance fields appended by the pipeline; read-only
     *  from the author's perspective. */
    lastGeneratedAt: z.string().optional(),
    lastGeneratedSeed: z.number().int().optional(),
    lastCostUsd: z.number().nonnegative().optional(),
    lastError: z
        .object({
        kind: z.string(),
        message: z.string(),
        issues: z.array(z.string()).optional(),
        at: z.string(),
    })
        .optional(),
    /** Per-view paths of the generated concept-art images
     *  (relative to the app root). Populated on sidecars using
     *  the `'concept-art'` pipeline after the first successful
     *  run. Useful for the author to inspect what the vendor
     *  produced + for the audit log. */
    lastConceptArt: z
        .array(z.object({
        label: z.string(),
        path: z.string(),
    }))
        .optional(),
    /** Version history — every generation is an immutable take; exactly ONE has
     *  `kept: true` (its bytes are the active output). Absent on legacy sidecars
     *  (synthesized from the `last*` fields by @unsupervised/asset-gen `getTakes`). */
    takes: z.array(AssetTakeRecordSchema).optional(),
});
// ---------------------------------------------------------------------------
// Image sidecar (2D — sprite / texture / ui / concept)
// ---------------------------------------------------------------------------
/** The 2D asset role. Drives BOTH the validation gates and the
 *  downstream forge routing:
 *    - `sprite`  → spritePipeline → SpriteId (alpha required)
 *    - `texture` → material / terrain slots (seamless when tiling)
 *    - `ui`      → uiPipeline → UiImageId (alpha required, crisp)
 *    - `concept` → reference-only (no runtime id; feeds the model
 *      concept-art path or the Art Bible board) */
export const ImageRoleSchema = z.enum(['sprite', 'texture', 'ui', 'concept']);
/** Deterministic pixel-level gates that fire AFTER generation.
 *  Structural only — the aesthetic / Art-Bible-adherence checks
 *  are the perceptual judge's job (Verify, Phase 2). */
export const ImageValidationOptionsSchema = z.object({
    /** Reject if width / height fall outside these bands (px). */
    minWidth: z.number().int().positive().optional().default(16),
    maxWidth: z.number().int().positive().optional().default(4096),
    minHeight: z.number().int().positive().optional().default(16),
    maxHeight: z.number().int().positive().optional().default(4096),
    /** Require a real alpha channel with transparent pixels
     *  (sprites / UI). Catches an opaque-background cutout that
     *  didn't take. */
    requireAlpha: z.boolean().optional().default(false),
    /** Reject a near-empty / mostly-transparent image (the "empty
     *  canvas" failure). Fraction of fully-transparent pixels above
     *  which the image is rejected. */
    maxTransparentFraction: z.number().min(0).max(1).optional().default(0.98),
});
/** Post-processing applied between the raw vendor bytes (cache)
 *  and the shipped PNG (public) — the 2D analog of the audio
 *  post-chain. Editing it re-emits public output WITHOUT
 *  re-billing the vendor. */
export const ImagePostSchema = z.object({
    /** Remove the background → transparent alpha cutout (sprites /
     *  UI). */
    removeBackground: z.boolean().optional().default(false),
    /** Crop to the non-transparent content bounds. */
    cropToContent: z.boolean().optional().default(false),
    /** Quantize every pixel to the nearest Art Bible palette
     *  swatch (hard palette enforcement). */
    quantizeToPalette: z.boolean().optional().default(false),
});
const ImageSidecarSchema = z.object({
    kind: z.literal('image'),
    /** v1 vendor — CivitAI Z-Image (already shipped as the 3D
     *  concept-art feeder; here it produces first-class 2D). */
    service: z.literal('civitai'),
    /** Provenance marker for a BROUGHT-IN asset — see the identical
     *  field on `ModelSidecarSchema`. `'imported'` ⇒ author-supplied
     *  bytes; the generation pipeline skips it (no vendor call, no
     *  re-bill, no overwrite); forge still encodes the bytes into the
     *  typed registry. Absent ⇒ a normal generated sidecar. */
    source: z.literal('imported').optional(),
    /** Original file name the asset was imported from — display
     *  provenance only; not hashed. Meaningful only when imported. */
    importedFrom: z.string().optional(),
    role: ImageRoleSchema,
    /** User-authored SUBJECT prompt. The style prefix (distilled
     *  from the Art Bible) is prepended at runtime; the hash key
     *  includes the baked prompt + a style fingerprint. */
    prompt: z.string().min(1),
    /** Vendor negative prompt. The Art Bible's `negatives` fold in
     *  via the config; per-asset negatives extend them. */
    negativePrompt: z.string().optional(),
    /** Deterministic seed. Omit → vendor picks + persists it back
     *  via `lastGeneratedSeed`. */
    seed: z.number().int().optional(),
    /** Require seamless edge-wrap (textures). Drives a tiling gate
     *  at verify time + a tiling hint in the baked prompt. */
    tiling: z.boolean().optional().default(false),
    /** CivitAI knobs (model / size / cfg / steps / loras). Falls
     *  back to the project `civitai` config block. */
    params: CivitAIImageParamsSchema.optional(),
    /** 2D post-processing (bg-removal / crop / palette-quantize). */
    post: ImagePostSchema.optional(),
    /** Validation gates; defaults fold in from the style config. */
    validation: ImageValidationOptionsSchema.optional(),
    /** Narrative + Art-Bible grounding record (Maintain). Written
     *  by the `art-direction` skill; fingerprints stamped by the
     *  drift detector. Provenance-shape — see AssetGroundingSchema. */
    grounding: AssetGroundingSchema.optional(),
    /** Cache lock — regeneration BLOCKED until removed. */
    lockedHash: z.string().optional(),
    /** Provenance appended by the pipeline; read-only to authors. */
    lastGeneratedAt: z.string().optional(),
    lastGeneratedSeed: z.number().int().optional(),
    lastCostUsd: z.number().nonnegative().optional(),
    lastError: z
        .object({
        kind: z.string(),
        message: z.string(),
        issues: z.array(z.string()).optional(),
        at: z.string(),
    })
        .optional(),
    /** Version history — see ModelSidecar.takes. */
    takes: z.array(AssetTakeRecordSchema).optional(),
});
// ---------------------------------------------------------------------------
// PromptSidecar discriminated union
// ---------------------------------------------------------------------------
export const PromptSidecarSchema = z.discriminatedUnion('kind', [
    ModelSidecarSchema,
    ImageSidecarSchema,
]);
// ---------------------------------------------------------------------------
// Verify config (art review — Phase 2)
// ---------------------------------------------------------------------------
/** Art-review config. Opt-in per game via a `review` block on the
 *  style config. When absent, review never runs. */
export const AssetReviewConfigSchema = z.object({
    /** Master switch. Default OFF — review is opt-in. */
    enabled: z.boolean().default(false),
    /** In-forge posture on a `fail` verdict:
     *    - `'flag'`   — record + warn, change nothing (default).
     *    - `'retry'`  — re-roll with a new seed up to
     *      `maxAttemptsPerSlot` (vendor nondeterminism).
     *    - `'retune'` — infer a bounded param delta (cfg / steps /
     *      model) from the judge's adherence diagnosis, apply +
     *      regenerate; fall back to a blind re-roll when no delta
     *      applies. Strict superset of `retry`. */
    failVerdictAction: z.enum(['flag', 'retry', 'retune']).default('flag'),
    /** Max generation attempts per slot the loop may make (incl.
     *  the first). Bounds the loop alongside the budget cap. */
    maxAttemptsPerSlot: z.number().int().min(1).max(6).default(3),
    /** Vision model for the perceptual judge. Default
     *  `claude-sonnet-5` — the cost/quality sweet spot. */
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
    /** N-vote perceptual panel. The perceptual judge is a single,
     *  uncalibrated, non-deterministic LLM — for hero assets that gate
     *  is too thin to trust unattended. A panel runs `jurors`
     *  independent judges (each nudged onto a distinct failure-mode
     *  lens when `diverseLenses`), takes the majority verdict, and
     *  escalates to human review when they disagree past
     *  `escalateBelowAgreement`. `jurors: 1` (default) is the exact
     *  single-vote behavior — zero cost/behavior change until opted
     *  in. Never affects generated bytes (Verify-only). */
    panel: z
        .object({
        /** Independent jurors per perceptual review. 1 = single vote. */
        jurors: z.number().int().min(1).max(5).default(1),
        /** Rotate each juror onto a distinct lens (silhouette / palette
         *  / style-fidelity / subject-adherence / overall) so they
         *  catch different failure modes instead of voting
         *  redundantly. Ignored when `jurors` is 1. */
        diverseLenses: z.boolean().default(true),
        /** Escalate to human review when the fraction of jurors
         *  agreeing with the majority verdict is BELOW this. 0.67 ⇒ a
         *  3-juror panel escalates on any 2-1 (or worse) split. Set to
         *  0 to never escalate on a split. */
        escalateBelowAgreement: z.number().min(0).max(1).default(0.67),
        /** Also escalate a bare `concern` verdict (the usable-but-off
         *  band where automated judgment is weakest) to human review.
         *  Independent of the panel — applies to single-vote too. */
        escalateConcern: z.boolean().default(true),
    })
        .default({}),
    /** Content-SAFETY output scan (distinct from art-adherence). The
     *  prompt gate (L1 + the proxy's L2) can't see what a vendor actually
     *  RENDERED, and the vendors' own output moderation is imperfect —
     *  so an opt-in vision pass over the generated image flags
     *  policy-violating OUTPUT (sexual / gore / hate-symbol / real-person
     *  likeness; CSAM is always the hardest fail). Advisory / flag-only —
     *  it records a `content-safety` criterion + escalates on a fail; it
     *  never mutates or deletes bytes (the operator decides). Reuses the
     *  same vision transport + `judgeProvider` as the perceptual judge. */
    safety: z
        .object({
        /** Master switch for the output safety scan. Default OFF. */
        enabled: z.boolean().default(false),
    })
        .default({}),
});
// ---------------------------------------------------------------------------
// Project-wide style config
// ---------------------------------------------------------------------------
/** Project-level asset-gen config. Authored at
 *  `apps/<game>/asset-gen.config.ts`; one per app.
 *
 *  The `stylePrefix` is the load-bearing field — it's
 *  prepended to every prompt before the vendor sees it, AND
 *  its hash participates in the cache key (so changing the
 *  style invalidates every cached asset deliberately —
 *  coherence is project-level). */
// ---------------------------------------------------------------------------
// Motion library (animation pipeline — Phase 1)
// ---------------------------------------------------------------------------
/** Where a motion clip comes from — the pluggable Generate backend
 *  seam. Backend 1 (`meshy-library`) picks a clip from Meshy's
 *  ~530-motion catalog by action id. Backend 2 (`mocap`, backlog)
 *  adds a variant here (prompt → video → markerless mocap →
 *  retarget) behind the SAME Verify / Integrate / Maintain
 *  downstream. Discriminated on `backend` so the resolver + the
 *  generator narrow without casts. */
export const MotionClipSourceSchema = z.discriminatedUnion('backend', [
    z.object({
        backend: z.literal('meshy-library'),
        /** Integer action id from Meshy's animation library
         *  (https://docs.meshy.ai/en/api/animation-library). */
        actionId: z.number().int().nonnegative(),
    }),
]);
/** One canonical motion clip in the project motion library.
 *  Authored ONCE against the shared Meshy auto-rig topology, then
 *  retargeted (channel-copied) onto each character (Phase 2). */
export const MotionClipSchema = z.object({
    /** Delivery intent — what the motion should read as. Drives clip
     *  selection, the perceptual legibility judge, and the
     *  root-motion-direction gate. e.g. `"walk forward, steady"` /
     *  `"overhead heavy swing"`. */
    intent: z.string().min(1),
    /** Looping clip (idle / walk / run) — drives the loop-cleanliness
     *  gate (Phase 3). Non-looping = one-shot (attack / death). */
    loop: z.boolean().default(false),
    source: MotionClipSourceSchema,
});
/** Project motion library — canonical clips keyed by SEMANTIC name
 *  (`idle`, `walk`, `attack-heavy`). The name becomes the runtime
 *  clip id in the merged GLB's `<Name>Animations` union (Phase 2),
 *  so the runtime drives `clipId: 'attack-heavy'`, never a numeric
 *  action id. The `voiceCast` / `loraCast` analog for motion. */
export const MotionLibrarySchema = z.record(z.string().min(1), MotionClipSchema);
/** Motion kits — role-keyed bundles of clip names from the library
 *  (`humanoid-basic: ['idle','walk','run','turn-left','turn-right']`).
 *  A character sidecar references a kit by name via `motionKit`; the
 *  pipeline resolves it (+ any per-character `motionAdd`) to the
 *  ordered clip set it generates. */
export const MotionKitsSchema = z.record(z.string().min(1), z.array(z.string().min(1)).min(1));
export const StyleConfigSchema = z.object({
    /** Project-wide style fragment prepended to every prompt.
     *  Example: `"hand-painted PBR, Wind Waker palette, soft
     *  cel-shading, no photorealism"`. */
    stylePrefix: z.string().default(''),
    /** Per-kind style sub-fragments. Appended AFTER `stylePrefix`
     *  when the matching kind generates. Future-friendly seam
     *  for "weapons look one way, characters another" without a
     *  schema bump. */
    styleByKind: z
        .object({
        model: z.string().optional(),
        /** 2D style fragment — distilled from the Art Bible
         *  (rendering model + palette summary + line treatment).
         *  Prepended to every `image` prompt. */
        image: z.string().optional(),
    })
        .optional(),
    /** Soft cap on per-pipeline-run spend (USD). Warns when
     *  exceeded; does NOT block. */
    budgetSoftUsd: z.number().nonnegative().default(10),
    /** Hard cap on per-pipeline-run spend (USD). Aborts the
     *  pipeline when a new task's projected cost would push the
     *  session past this. In-flight tasks complete. */
    budgetHardUsd: z.number().nonnegative().default(50),
    /** LIFETIME spend ceiling (USD) — cumulative across EVERY run,
     *  summed from the audit log. The per-run caps above reset each
     *  `forge runOnce`, so an agent that loops forge could spend N× the
     *  hard cap; this bounds total spend no matter how many runs. A
     *  generation whose projected cost would push all-time spend past
     *  this is rejected (`budget-exceeded`). Undefined ⇒ no lifetime
     *  cap (default; today's behavior). The AI-pilot backstop. */
    budgetLifetimeUsd: z.number().nonnegative().optional(),
    /** Require an explicit, bounded, unexpired spend AUTHORIZATION
     *  before any vendor call (the propose-approve gate). When true, a
     *  billed generation is rejected (`spend-unauthorized`) unless
     *  `.asset-gen-spend-authorization.json` grants enough headroom —
     *  written by `asset-gen authorize --up-to <usd>` after a human
     *  reviews `asset-gen forecast`. Off by default (human-driven runs
     *  spend freely); turn on for autonomous / CI contexts so an agent
     *  can drive generation but can't run up an unapproved bill. */
    requireSpendAuthorization: z.boolean().default(false),
    /** Default validation gates folded in when a sidecar omits
     *  its own `validation` block. */
    defaultValidation: z
        .object({
        model: ModelValidationOptionsSchema.optional(),
        image: ImageValidationOptionsSchema.optional(),
    })
        .optional(),
    /** Project-wide banned-term list. Sidecar prompts are
     *  checked against this list (case-insensitive, word-
     *  boundary aware) BEFORE dispatching to any vendor. A
     *  match yields a `'prompt-rejected'` GenerationError and
     *  the offending sidecar is left untouched — no API call,
     *  no spend.
     *
     *  The list is intentionally a project-level concern: each
     *  game's setting + audience implies a different banned set.
     *  A fantasy game banning "modern weapons" vs. a children's
     *  game banning a broader profanity set. The starter list
     *  in `games/komorebi/asset-gen.config.ts` is a sane baseline
     *  for stylized fantasy; extend per project.
     *
     *  Banned terms are checked against the BAKED prompt (style
     *  prefix + per-kind suffix + user prompt). Negative
     *  prompts are NOT checked — those carry concepts the
     *  author is asking the vendor to AVOID, which is the
     *  opposite of generation intent.
     *
     *  Empty array (default) disables the filter. */
    bannedTerms: z.array(z.string().min(1)).default([]),
    /** Per-character LoRA cast (Phase 5 — cross-asset consistency).
     *  Maps a character alias (the card slug, or a slug of its
     *  title — same join as `voiceCast` in audio) to a LoRA URN +
     *  strength. The `art-direction` skill, when grounding an asset
     *  in a character card, attaches that character's LoRA to the
     *  sidecar's `params.loras` — so every sprite / model of a
     *  character trains on the SAME identity, tighter than prose +
     *  palette alone. The cast is applied via the skill (not read at
     *  generation time), so it is NOT in the style fingerprint;
     *  editing the cast takes effect by re-running `art-direction`
     *  (which rewrites `params.loras` → the affected sidecars' hashes
     *  change → they regenerate), scoping the re-bill to just those
     *  characters. */
    loraCast: z
        .record(z.string().min(1), z.object({
        /** Z-Image LoRA URN
         *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
        urn: z.string().min(1),
        /** Strength 0..2; default 0.8. */
        strength: z.number().min(0).max(2).default(0.8),
    }))
        .optional(),
    /** Project-wide CivitAI defaults — folded into per-sidecar
     *  conceptArt.civitai overrides at dispatch. The load-
     *  bearing field for "any style" support: this is where
     *  the project's LoRA URNs + per-style tokens live. Each
     *  game's `asset-gen.config.ts` picks its own LoRAs;
     *  recipes never hardcode style. */
    civitai: CivitAIImageParamsSchema.optional(),
    /** Project motion library — canonical clips (authored once,
     *  retargeted to all characters) keyed by semantic name. The
     *  animation pipeline's authoring surface; the motion analog of
     *  `loraCast` / audio's `voiceCast`. Participates in the style
     *  fingerprint, so editing a clip's action id invalidates the
     *  relevant caches (deliberate). */
    motionLibrary: MotionLibrarySchema.optional(),
    /** Motion kits — role-keyed bundles of `motionLibrary` clip names.
     *  A character sidecar's `motionKit` references one. */
    motionKits: MotionKitsSchema.optional(),
    /** Deterministic motion Verify (animation Phase 3). When enabled,
     *  `pnpm forge` runs the temporal gates (loop-cleanliness / jitter /
     *  duration / root-motion) on each generated character's merged
     *  multi-clip GLB after generation. Flag-only — records the verdict
     *  to `.asset-gen-review.json`, never regenerates. Default OFF. */
    motionReview: z
        .object({
        enabled: z.boolean().default(false),
        /** Phase 5 — the opt-in perceptual legibility judge. Renders each
         *  clip to a skeleton contact sheet and asks a vision model whether
         *  the MOTION reads (legible + natural). BILLED. Concern-capped (a
         *  bones-only preview is advisory). Off by default. */
        legibility: z
            .object({
            enabled: z.boolean().default(false),
            /** How the vision judge reaches Claude — same vocabulary as the
             *  art / audio review: `'claude-cli'` (subscription, no key),
             *  `'api'` (ANTHROPIC_API_KEY), `'auto'` (CLI when on PATH else
             *  the key). */
            judgeProvider: z.enum(['auto', 'api', 'claude-cli']).default('auto'),
            judgeModel: z.string().min(1).default('claude-sonnet-5'),
            claudeCliPath: z.string().optional(),
            /** Frames sampled into the contact sheet. */
            frames: z.number().int().min(2).max(16).default(6),
        })
            .optional(),
    })
        .optional(),
    /** Art-review (Verify) config. Optional + opt-in; when omitted,
     *  the pipeline's verify arm never runs. See
     *  `AssetReviewConfigSchema`. */
    review: AssetReviewConfigSchema.optional(),
    /** Narrative-drift check (Maintain). When true, `pnpm forge`
     *  runs `detectAssetDrift` after generating — baseline-stamping
     *  freshly-grounded sidecars + WARNING on any image whose
     *  grounded narrative card OR the Art Bible has since changed.
     *  Warn-only; never blocks. Default OFF. */
    driftCheck: z.boolean().default(false),
    // NB: generation PROVIDER selection (CivitAI ⇄ NIM, model, endpoint) is NOT
    // here — it's an Atelier-OWNER concern read from the environment
    // (`ATELIER_IMAGE_PROVIDER` / `ATELIER_MODEL_PROVIDER`), so a customer's game
    // config can never point generation at a provider. See gen-core
    // `readProviderSelection` + docs/specs/multi-provider-generation.md.
});
//# sourceMappingURL=assetGen.js.map