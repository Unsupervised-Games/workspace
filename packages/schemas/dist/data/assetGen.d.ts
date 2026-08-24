import { z } from 'zod';
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
export declare const MeshyModelParamsSchema: z.ZodObject<{
    /** Visual style preset. OPTIONAL — omit unless your Meshy
     *  plan supports values beyond `'realistic'`. Defaults to
     *  unset (no field sent on the request). */
    artStyle: z.ZodOptional<z.ZodEnum<["realistic", "stylized", "cartoon"]>>;
    /** Mesh topology. `'quad'` is friendlier to downstream
     *  Blender editing; `'triangle'` is what runtime renderers
     *  consume anyway after Meshopt re-encoding. Default
     *  `'quad'` to keep the source asset author-friendly. */
    topology: z.ZodDefault<z.ZodOptional<z.ZodEnum<["triangle", "quad"]>>>;
    /** Target polygon budget. Meshy honors as a hint; the
     *  result is approximate. Common values: 4_000 (background
     *  prop), 8_000 (hero character), 16_000 (cinematic). */
    targetPolycount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    topology: "triangle" | "quad";
    targetPolycount: number;
    artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
}, {
    topology?: "triangle" | "quad" | undefined;
    artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
    targetPolycount?: number | undefined;
}>;
export type MeshyModelParams = z.infer<typeof MeshyModelParamsSchema>;
/** Meshy rig-task parameters. Meshy's auto-rigging is
 *  humanoid-only and auto-detects body structure — no
 *  `rigType` parameter exists. The only tunable knob is
 *  `heightMeters` for proportional rigging accuracy
 *  (default 1.7). */
export declare const MeshyRigParamsSchema: z.ZodObject<{
    /** Character height in meters. Default 1.7 (average human).
     *  Tune for non-default-scale characters (chibi /
     *  giant boss / etc.). */
    heightMeters: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    heightMeters?: number | undefined;
}, {
    heightMeters?: number | undefined;
}>;
export type MeshyRigParams = z.infer<typeof MeshyRigParamsSchema>;
/** CivitAI Z-Image generation parameters. Per-sidecar
 *  overrides on top of the project-wide `civitai` block in
 *  `asset-gen.config.ts`. All fields optional; the orchestrator
 *  folds in config defaults at dispatch time. */
export declare const CivitAIImageParamsSchema: z.ZodObject<{
    /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
     *  vs `base` (production quality). Default `base` for
     *  character / environment concepts; turbo is fine for
     *  props / iteration loops. */
    model: z.ZodOptional<z.ZodEnum<["turbo", "base"]>>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    cfgScale: z.ZodOptional<z.ZodNumber>;
    steps: z.ZodOptional<z.ZodNumber>;
    /** LoRA URN → strength. Z-Image ecosystem URNs only
     *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
    loras: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    steps?: number | undefined;
    height?: number | undefined;
    width?: number | undefined;
    model?: "turbo" | "base" | undefined;
    cfgScale?: number | undefined;
    loras?: Record<string, number> | undefined;
}, {
    steps?: number | undefined;
    height?: number | undefined;
    width?: number | undefined;
    model?: "turbo" | "base" | undefined;
    cfgScale?: number | undefined;
    loras?: Record<string, number> | undefined;
}>;
export type CivitAIImageParams = z.infer<typeof CivitAIImageParamsSchema>;
/** Per-view concept-art prompt + downloaded image path. Apps
 *  authoring sidecars supply ONLY the `prompt`; the path is
 *  filled in by the pipeline after generation. */
export declare const ConceptArtViewSchema: z.ZodObject<{
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
    prompt: z.ZodString;
    /** Stable label for filesystem layout: `concept/<asset>/<label>.png`.
     *  Convention: kebab-case (`front`, `side`, `back`, `hero`,
     *  `plan`, `detail-1`). */
    label: z.ZodString;
}, "strip", z.ZodTypeAny, {
    label: string;
    prompt: string;
}, {
    label: string;
    prompt: string;
}>;
export type ConceptArtView = z.infer<typeof ConceptArtViewSchema>;
/** Concept-art config block — present on sidecars that use the
 *  `'concept-art'` pipeline. Authors specify the view set +
 *  optional CivitAI param overrides; the pipeline runs CivitAI
 *  per-view + feeds the bytes into Meshy multi-image-to-3D. */
export declare const ConceptArtConfigSchema: z.ZodObject<{
    /** 1-4 views to generate. Meshy multi-image-to-3D accepts
     *  1-4 reference images; passing fewer reduces cost but
     *  also reduces 3D fidelity for complex subjects. */
    views: z.ZodArray<z.ZodObject<{
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
        prompt: z.ZodString;
        /** Stable label for filesystem layout: `concept/<asset>/<label>.png`.
         *  Convention: kebab-case (`front`, `side`, `back`, `hero`,
         *  `plan`, `detail-1`). */
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        prompt: string;
    }, {
        label: string;
        prompt: string;
    }>, "many">;
    /** Optional CivitAI param overrides — fold over the
     *  project-wide config defaults. */
    civitai: z.ZodOptional<z.ZodObject<{
        /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
         *  vs `base` (production quality). Default `base` for
         *  character / environment concepts; turbo is fine for
         *  props / iteration loops. */
        model: z.ZodOptional<z.ZodEnum<["turbo", "base"]>>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        cfgScale: z.ZodOptional<z.ZodNumber>;
        steps: z.ZodOptional<z.ZodNumber>;
        /** LoRA URN → strength. Z-Image ecosystem URNs only
         *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
        loras: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    views: {
        label: string;
        prompt: string;
    }[];
    civitai?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
}, {
    views: {
        label: string;
        prompt: string;
    }[];
    civitai?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
}>;
export type ConceptArtConfig = z.infer<typeof ConceptArtConfigSchema>;
/** One narrative card an asset's prompt was grounded in — the
 *  SUBJECT source. Machine-readable twin of the prose link. */
export declare const AssetGroundingCardRefSchema: z.ZodObject<{
    /** `type:slug` — `character:reiska`, `item:moon-blade`,
     *  `location:shrine`. */
    cardId: z.ZodString;
    /** True when a card resolved (GROUNDED); false when the skill
     *  INFERRED with no card present (still records the intended id
     *  so drift can flag "a card now exists"). */
    resolved: z.ZodBoolean;
    /** SHA-256 of the card content at grounding time. Null until
     *  the drift detector stamps the baseline. */
    fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    cardId: string;
    resolved: boolean;
    fingerprint: string | null;
}, {
    cardId: string;
    resolved: boolean;
    fingerprint?: string | null | undefined;
}>;
export type AssetGroundingCardRef = z.infer<typeof AssetGroundingCardRefSchema>;
/** The structured grounding record on an asset sidecar. Written
 *  by the `art-direction` skill (fingerprints null), baseline-
 *  stamped by the drift detector. Grounds on TWO axes — the
 *  narrative cards (SUBJECT) and the Art Bible (STYLE) — so an
 *  asset goes stale when EITHER its card OR the Art Bible
 *  changes. Provenance-shape: does NOT participate in the cache
 *  hash. */
export declare const AssetGroundingSchema: z.ZodObject<{
    /** When the asset was last grounded. Bumping it (a re-ground)
     *  signals the detector to RE-baseline rather than report drift. */
    groundedAt: z.ZodString;
    /** Which sidecar fields derive from the grounding: images/models
     *  ground `prompt` (+ `negativePrompt`); a character model's MOTION
     *  is grounded via `motionKit` / `motionAdd` (the `animation-
     *  direction` skill). A model grounded for BOTH art + motion carries
     *  the UNION here. */
    fields: z.ZodDefault<z.ZodArray<z.ZodEnum<["prompt", "negativePrompt", "motionKit", "motionAdd"]>, "many">>;
    /** The SUBJECT cards this asset depends on. */
    cards: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** `type:slug` — `character:reiska`, `item:moon-blade`,
         *  `location:shrine`. */
        cardId: z.ZodString;
        /** True when a card resolved (GROUNDED); false when the skill
         *  INFERRED with no card present (still records the intended id
         *  so drift can flag "a card now exists"). */
        resolved: z.ZodBoolean;
        /** SHA-256 of the card content at grounding time. Null until
         *  the drift detector stamps the baseline. */
        fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        cardId: string;
        resolved: boolean;
        fingerprint: string | null;
    }, {
        cardId: string;
        resolved: boolean;
        fingerprint?: string | null | undefined;
    }>, "many">>;
    /** The Art Bible (STYLE) fingerprint at grounding time. Null
     *  until stamped; a Bible edit → every asset carrying a stale
     *  fingerprint drifts. */
    artBibleFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    groundedAt: string;
    fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
    cards: {
        cardId: string;
        resolved: boolean;
        fingerprint: string | null;
    }[];
    artBibleFingerprint: string | null;
}, {
    groundedAt: string;
    fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
    cards?: {
        cardId: string;
        resolved: boolean;
        fingerprint?: string | null | undefined;
    }[] | undefined;
    artBibleFingerprint?: string | null | undefined;
}>;
export type AssetGrounding = z.infer<typeof AssetGroundingSchema>;
/** Validation gates that fire AFTER generation completes. The
 *  caller can override per-asset; defaults live in the style
 *  config. */
export declare const ModelValidationOptionsSchema: z.ZodObject<{
    /** Reject if vertex count falls outside this band. Lower
     *  bound catches empty / degenerate outputs; upper bound
     *  catches polycount overruns. */
    minVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    /** Require the model to have a skeleton with ≥ this many
     *  bones. Disable by setting to 0. */
    minBones: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    /** Reject if any of these named animation clips are missing.
     *  Empty array disables the check. */
    requiredAnimations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    minVertices: number;
    maxVertices: number;
    minBones: number;
    requiredAnimations: string[];
}, {
    minVertices?: number | undefined;
    maxVertices?: number | undefined;
    minBones?: number | undefined;
    requiredAnimations?: string[] | undefined;
}>;
export type ModelValidationOptions = z.infer<typeof ModelValidationOptionsSchema>;
export declare const AssetTakeRecordSchema: z.ZodObject<{
    /** Cache-key content hash for THIS take's bytes — unique per take, so two
     *  takes of identical inputs at different timestamps don't collide.
     *  `SHA256(inputHash || '\\0' || takenAt)` via `computeTakeHash` in
     *  @unsupervised/asset-gen. The bytes live at `.asset-gen-cache/<kind>/<hash>.<ext>`. */
    hash: z.ZodString;
    /** Deterministic input-fingerprint (the pipeline's `fullHash`). Two takes of
     *  the SAME sidecar inputs share it; editing the prompt/params changes it. The
     *  value `lockedHash` validates against. */
    inputHash: z.ZodString;
    /** ISO-8601 generation timestamp — chronological ordering + UI display. */
    takenAt: z.ZodString;
    /** USD cost charged for this take. The kept take's cost mirrors to the
     *  sidecar-level `lastCostUsd`. */
    costUsd: z.ZodNumber;
    /** Byte size of the generated asset. */
    bytes: z.ZodNumber;
    /** File extension (`'glb'` for models, `'png'` for images). */
    extension: z.ZodString;
    /** Exactly one take per sidecar has `kept: true` — its bytes are the active
     *  output. */
    kept: z.ZodBoolean;
    /** Free-form author note. Does NOT participate in the cache hash. */
    notes: z.ZodOptional<z.ZodString>;
    /** The seed a model take was generated with (models track `lastGeneratedSeed`);
     *  lets the drawer show + a re-roll reuse it. */
    seed: z.ZodOptional<z.ZodNumber>;
    /** Provider + model that produced this take (`'civitai'` / `'z-image'`,
     *  `'nim'` / `'flux.1-dev'`). Provenance only — provider/model are NOT
     *  in the cache hash. Lets the version-history drawer show which
     *  provider made each swappable version. Undefined on legacy takes. */
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    /** Present when the generation FAILED (no usable bytes, never `kept: true`). */
    error: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        message: z.ZodString;
        issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    hash: string;
    inputHash: string;
    takenAt: string;
    costUsd: number;
    bytes: number;
    extension: string;
    kept: boolean;
    seed?: number | undefined;
    model?: string | undefined;
    notes?: string | undefined;
    provider?: string | undefined;
    error?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
}, {
    hash: string;
    inputHash: string;
    takenAt: string;
    costUsd: number;
    bytes: number;
    extension: string;
    kept: boolean;
    seed?: number | undefined;
    model?: string | undefined;
    notes?: string | undefined;
    provider?: string | undefined;
    error?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
}>;
export type AssetTakeRecord = z.infer<typeof AssetTakeRecordSchema>;
declare const ModelSidecarSchema: z.ZodObject<{
    kind: z.ZodLiteral<"model">;
    /** Active vendor for this sidecar. v1 supports `'meshy'`. */
    service: z.ZodLiteral<"meshy">;
    /** Provenance marker for a BROUGHT-IN asset. When `'imported'`, the
     *  bytes beside this sidecar were supplied by the author (not
     *  vendor-generated): the generation pipeline SKIPS it — never
     *  dispatches to a vendor, never re-bills, never overwrites the
     *  bytes. The forge raw-asset pipeline still encodes those bytes
     *  into the typed runtime registry, so an imported asset is a
     *  first-class asset identical at runtime to a generated one.
     *  Absent ⇒ a normal generated sidecar. See `importedFrom`. */
    source: z.ZodOptional<z.ZodLiteral<"imported">>;
    /** Original file name the asset was imported from — display
     *  provenance only; not part of the cache hash. Meaningful only
     *  when `source === 'imported'`. */
    importedFrom: z.ZodOptional<z.ZodString>;
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
    pipeline: z.ZodOptional<z.ZodEnum<["text-to-3d", "concept-art"]>>;
    /** Concept-art config — REQUIRED when `pipeline:
     *  'concept-art'`, ignored otherwise. The pipeline guards
     *  the dispatch with a runtime check; the schema-level
     *  enforcement is via the orchestrator (not refine() —
     *  refines break .optional() composition per the
     *  @unsupervised/schemas conventions). */
    conceptArt: z.ZodOptional<z.ZodObject<{
        /** 1-4 views to generate. Meshy multi-image-to-3D accepts
         *  1-4 reference images; passing fewer reduces cost but
         *  also reduces 3D fidelity for complex subjects. */
        views: z.ZodArray<z.ZodObject<{
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
            prompt: z.ZodString;
            /** Stable label for filesystem layout: `concept/<asset>/<label>.png`.
             *  Convention: kebab-case (`front`, `side`, `back`, `hero`,
             *  `plan`, `detail-1`). */
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            prompt: string;
        }, {
            label: string;
            prompt: string;
        }>, "many">;
        /** Optional CivitAI param overrides — fold over the
         *  project-wide config defaults. */
        civitai: z.ZodOptional<z.ZodObject<{
            /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
             *  vs `base` (production quality). Default `base` for
             *  character / environment concepts; turbo is fine for
             *  props / iteration loops. */
            model: z.ZodOptional<z.ZodEnum<["turbo", "base"]>>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            cfgScale: z.ZodOptional<z.ZodNumber>;
            steps: z.ZodOptional<z.ZodNumber>;
            /** LoRA URN → strength. Z-Image ecosystem URNs only
             *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
            loras: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        }, {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    }, {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    }>>;
    /** User-authored prompt. The style config's `prefix` is
     *  prepended at runtime; the hash key includes the baked
     *  prompt + a style fingerprint. */
    prompt: z.ZodString;
    /** Vendor-honored negative prompt. Optional. */
    negativePrompt: z.ZodOptional<z.ZodString>;
    /** Deterministic seed. Optional — when omitted the vendor
     *  picks one and persists it back to the sidecar via
     *  `lastGeneratedSeed`. */
    seed: z.ZodOptional<z.ZodNumber>;
    /** Meshy-specific knobs. Falls back to schema defaults
     *  when omitted. */
    params: z.ZodOptional<z.ZodObject<{
        /** Visual style preset. OPTIONAL — omit unless your Meshy
         *  plan supports values beyond `'realistic'`. Defaults to
         *  unset (no field sent on the request). */
        artStyle: z.ZodOptional<z.ZodEnum<["realistic", "stylized", "cartoon"]>>;
        /** Mesh topology. `'quad'` is friendlier to downstream
         *  Blender editing; `'triangle'` is what runtime renderers
         *  consume anyway after Meshopt re-encoding. Default
         *  `'quad'` to keep the source asset author-friendly. */
        topology: z.ZodDefault<z.ZodOptional<z.ZodEnum<["triangle", "quad"]>>>;
        /** Target polygon budget. Meshy honors as a hint; the
         *  result is approximate. Common values: 4_000 (background
         *  prop), 8_000 (hero character), 16_000 (cinematic). */
        targetPolycount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        topology: "triangle" | "quad";
        targetPolycount: number;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
    }, {
        topology?: "triangle" | "quad" | undefined;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
        targetPolycount?: number | undefined;
    }>>;
    /** Auto-rigging step. When true, the model task's output is
     *  passed to Meshy's rigging endpoint, producing a rigged
     *  GLB suitable for animation. HUMANOID-ONLY — quadrupeds,
     *  flying creatures, and abstract spirits CANNOT be
     *  auto-rigged by Meshy; ship those as static GLBs and
     *  hand-rig in Blender post-hoc if animation is needed. */
    withRig: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** Meshy rig parameters; only consulted when
     *  `withRig: true`. */
    rigParams: z.ZodOptional<z.ZodObject<{
        /** Character height in meters. Default 1.7 (average human).
         *  Tune for non-default-scale characters (chibi /
         *  giant boss / etc.). */
        heightMeters: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        heightMeters?: number | undefined;
    }, {
        heightMeters?: number | undefined;
    }>>;
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
    animations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>>;
    /** Motion kit name (from `motionKits` in asset-gen.config.ts) —
     *  resolves to a set of named clips generated for this character.
     *  Supersedes the legacy numeric `animations` array; requires
     *  `withRig: true`. */
    motionKit: z.ZodOptional<z.ZodString>;
    /** Extra `motionLibrary` clip names appended to the kit —
     *  per-character additions beyond the role bundle (e.g. a boss's
     *  signature attack on top of `humanoid-basic`). */
    motionAdd: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Validation gates that fire after generation. Defaults
     *  fold in from the style config. */
    validation: z.ZodOptional<z.ZodObject<{
        /** Reject if vertex count falls outside this band. Lower
         *  bound catches empty / degenerate outputs; upper bound
         *  catches polycount overruns. */
        minVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Require the model to have a skeleton with ≥ this many
         *  bones. Disable by setting to 0. */
        minBones: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Reject if any of these named animation clips are missing.
         *  Empty array disables the check. */
        requiredAnimations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        minVertices: number;
        maxVertices: number;
        minBones: number;
        requiredAnimations: string[];
    }, {
        minVertices?: number | undefined;
        maxVertices?: number | undefined;
        minBones?: number | undefined;
        requiredAnimations?: string[] | undefined;
    }>>;
    /** Narrative + Art-Bible grounding record (Ground + Maintain).
     *  Written by the `art-direction` skill; the drift detector
     *  fingerprints the card (subject) + the Art Bible (style) so a
     *  model goes stale when either changes — the same two-axis
     *  grounding as 2D images. Provenance-shape; not hashed. */
    grounding: z.ZodOptional<z.ZodObject<{
        /** When the asset was last grounded. Bumping it (a re-ground)
         *  signals the detector to RE-baseline rather than report drift. */
        groundedAt: z.ZodString;
        /** Which sidecar fields derive from the grounding: images/models
         *  ground `prompt` (+ `negativePrompt`); a character model's MOTION
         *  is grounded via `motionKit` / `motionAdd` (the `animation-
         *  direction` skill). A model grounded for BOTH art + motion carries
         *  the UNION here. */
        fields: z.ZodDefault<z.ZodArray<z.ZodEnum<["prompt", "negativePrompt", "motionKit", "motionAdd"]>, "many">>;
        /** The SUBJECT cards this asset depends on. */
        cards: z.ZodDefault<z.ZodArray<z.ZodObject<{
            /** `type:slug` — `character:reiska`, `item:moon-blade`,
             *  `location:shrine`. */
            cardId: z.ZodString;
            /** True when a card resolved (GROUNDED); false when the skill
             *  INFERRED with no card present (still records the intended id
             *  so drift can flag "a card now exists"). */
            resolved: z.ZodBoolean;
            /** SHA-256 of the card content at grounding time. Null until
             *  the drift detector stamps the baseline. */
            fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }, {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }>, "many">>;
        /** The Art Bible (STYLE) fingerprint at grounding time. Null
         *  until stamped; a Bible edit → every asset carrying a stale
         *  fingerprint drifts. */
        artBibleFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    }, {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    }>>;
    /** Cache lock — when set, regeneration is BLOCKED until
     *  removed. The hash committed here MUST match the current
     *  computed hash; mismatch surfaces as a clear error
     *  (someone edited the prompt while it was locked). */
    lockedHash: z.ZodOptional<z.ZodString>;
    /** Provenance fields appended by the pipeline; read-only
     *  from the author's perspective. */
    lastGeneratedAt: z.ZodOptional<z.ZodString>;
    lastGeneratedSeed: z.ZodOptional<z.ZodNumber>;
    lastCostUsd: z.ZodOptional<z.ZodNumber>;
    lastError: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        message: z.ZodString;
        issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }>>;
    /** Per-view paths of the generated concept-art images
     *  (relative to the app root). Populated on sidecars using
     *  the `'concept-art'` pipeline after the first successful
     *  run. Useful for the author to inspect what the vendor
     *  produced + for the audit log. */
    lastConceptArt: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        label: string;
    }, {
        path: string;
        label: string;
    }>, "many">>;
    /** Version history — every generation is an immutable take; exactly ONE has
     *  `kept: true` (its bytes are the active output). Absent on legacy sidecars
     *  (synthesized from the `last*` fields by @unsupervised/asset-gen `getTakes`). */
    takes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Cache-key content hash for THIS take's bytes — unique per take, so two
         *  takes of identical inputs at different timestamps don't collide.
         *  `SHA256(inputHash || '\\0' || takenAt)` via `computeTakeHash` in
         *  @unsupervised/asset-gen. The bytes live at `.asset-gen-cache/<kind>/<hash>.<ext>`. */
        hash: z.ZodString;
        /** Deterministic input-fingerprint (the pipeline's `fullHash`). Two takes of
         *  the SAME sidecar inputs share it; editing the prompt/params changes it. The
         *  value `lockedHash` validates against. */
        inputHash: z.ZodString;
        /** ISO-8601 generation timestamp — chronological ordering + UI display. */
        takenAt: z.ZodString;
        /** USD cost charged for this take. The kept take's cost mirrors to the
         *  sidecar-level `lastCostUsd`. */
        costUsd: z.ZodNumber;
        /** Byte size of the generated asset. */
        bytes: z.ZodNumber;
        /** File extension (`'glb'` for models, `'png'` for images). */
        extension: z.ZodString;
        /** Exactly one take per sidecar has `kept: true` — its bytes are the active
         *  output. */
        kept: z.ZodBoolean;
        /** Free-form author note. Does NOT participate in the cache hash. */
        notes: z.ZodOptional<z.ZodString>;
        /** The seed a model take was generated with (models track `lastGeneratedSeed`);
         *  lets the drawer show + a re-roll reuse it. */
        seed: z.ZodOptional<z.ZodNumber>;
        /** Provider + model that produced this take (`'civitai'` / `'z-image'`,
         *  `'nim'` / `'flux.1-dev'`). Provenance only — provider/model are NOT
         *  in the cache hash. Lets the version-history drawer show which
         *  provider made each swappable version. Undefined on legacy takes. */
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        /** Present when the generation FAILED (no usable bytes, never `kept: true`). */
        error: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            message: z.ZodString;
            issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    kind: "model";
    prompt: string;
    service: "meshy";
    withRig: boolean;
    animations: number[];
    params?: {
        topology: "triangle" | "quad";
        targetPolycount: number;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
    } | undefined;
    validation?: {
        minVertices: number;
        maxVertices: number;
        minBones: number;
        requiredAnimations: string[];
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    motionKit?: string | undefined;
    motionAdd?: string[] | undefined;
    importedFrom?: string | undefined;
    pipeline?: "text-to-3d" | "concept-art" | undefined;
    conceptArt?: {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    } | undefined;
    rigParams?: {
        heightMeters?: number | undefined;
    } | undefined;
    grounding?: {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    lastConceptArt?: {
        path: string;
        label: string;
    }[] | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
}, {
    kind: "model";
    prompt: string;
    service: "meshy";
    params?: {
        topology?: "triangle" | "quad" | undefined;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
        targetPolycount?: number | undefined;
    } | undefined;
    validation?: {
        minVertices?: number | undefined;
        maxVertices?: number | undefined;
        minBones?: number | undefined;
        requiredAnimations?: string[] | undefined;
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    motionKit?: string | undefined;
    motionAdd?: string[] | undefined;
    importedFrom?: string | undefined;
    pipeline?: "text-to-3d" | "concept-art" | undefined;
    conceptArt?: {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    } | undefined;
    withRig?: boolean | undefined;
    rigParams?: {
        heightMeters?: number | undefined;
    } | undefined;
    animations?: number[] | undefined;
    grounding?: {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    lastConceptArt?: {
        path: string;
        label: string;
    }[] | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
}>;
/** The 2D asset role. Drives BOTH the validation gates and the
 *  downstream forge routing:
 *    - `sprite`  → spritePipeline → SpriteId (alpha required)
 *    - `texture` → material / terrain slots (seamless when tiling)
 *    - `ui`      → uiPipeline → UiImageId (alpha required, crisp)
 *    - `concept` → reference-only (no runtime id; feeds the model
 *      concept-art path or the Art Bible board) */
export declare const ImageRoleSchema: z.ZodEnum<["sprite", "texture", "ui", "concept"]>;
export type ImageRole = z.infer<typeof ImageRoleSchema>;
/** Deterministic pixel-level gates that fire AFTER generation.
 *  Structural only — the aesthetic / Art-Bible-adherence checks
 *  are the perceptual judge's job (Verify, Phase 2). */
export declare const ImageValidationOptionsSchema: z.ZodObject<{
    /** Reject if width / height fall outside these bands (px). */
    minWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    minHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    /** Require a real alpha channel with transparent pixels
     *  (sprites / UI). Catches an opaque-background cutout that
     *  didn't take. */
    requireAlpha: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** Reject a near-empty / mostly-transparent image (the "empty
     *  canvas" failure). Fraction of fully-transparent pixels above
     *  which the image is rejected. */
    maxTransparentFraction: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    maxHeight: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    requireAlpha: boolean;
    maxTransparentFraction: number;
}, {
    maxHeight?: number | undefined;
    minWidth?: number | undefined;
    maxWidth?: number | undefined;
    minHeight?: number | undefined;
    requireAlpha?: boolean | undefined;
    maxTransparentFraction?: number | undefined;
}>;
export type ImageValidationOptions = z.infer<typeof ImageValidationOptionsSchema>;
/** Post-processing applied between the raw vendor bytes (cache)
 *  and the shipped PNG (public) — the 2D analog of the audio
 *  post-chain. Editing it re-emits public output WITHOUT
 *  re-billing the vendor. */
export declare const ImagePostSchema: z.ZodObject<{
    /** Remove the background → transparent alpha cutout (sprites /
     *  UI). */
    removeBackground: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** Crop to the non-transparent content bounds. */
    cropToContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** Quantize every pixel to the nearest Art Bible palette
     *  swatch (hard palette enforcement). */
    quantizeToPalette: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    removeBackground: boolean;
    cropToContent: boolean;
    quantizeToPalette: boolean;
}, {
    removeBackground?: boolean | undefined;
    cropToContent?: boolean | undefined;
    quantizeToPalette?: boolean | undefined;
}>;
export type ImagePost = z.infer<typeof ImagePostSchema>;
declare const ImageSidecarSchema: z.ZodObject<{
    kind: z.ZodLiteral<"image">;
    /** v1 vendor — CivitAI Z-Image (already shipped as the 3D
     *  concept-art feeder; here it produces first-class 2D). */
    service: z.ZodLiteral<"civitai">;
    /** Provenance marker for a BROUGHT-IN asset — see the identical
     *  field on `ModelSidecarSchema`. `'imported'` ⇒ author-supplied
     *  bytes; the generation pipeline skips it (no vendor call, no
     *  re-bill, no overwrite); forge still encodes the bytes into the
     *  typed registry. Absent ⇒ a normal generated sidecar. */
    source: z.ZodOptional<z.ZodLiteral<"imported">>;
    /** Original file name the asset was imported from — display
     *  provenance only; not hashed. Meaningful only when imported. */
    importedFrom: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["sprite", "texture", "ui", "concept"]>;
    /** User-authored SUBJECT prompt. The style prefix (distilled
     *  from the Art Bible) is prepended at runtime; the hash key
     *  includes the baked prompt + a style fingerprint. */
    prompt: z.ZodString;
    /** Vendor negative prompt. The Art Bible's `negatives` fold in
     *  via the config; per-asset negatives extend them. */
    negativePrompt: z.ZodOptional<z.ZodString>;
    /** Deterministic seed. Omit → vendor picks + persists it back
     *  via `lastGeneratedSeed`. */
    seed: z.ZodOptional<z.ZodNumber>;
    /** Require seamless edge-wrap (textures). Drives a tiling gate
     *  at verify time + a tiling hint in the baked prompt. */
    tiling: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** CivitAI knobs (model / size / cfg / steps / loras). Falls
     *  back to the project `civitai` config block. */
    params: z.ZodOptional<z.ZodObject<{
        /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
         *  vs `base` (production quality). Default `base` for
         *  character / environment concepts; turbo is fine for
         *  props / iteration loops. */
        model: z.ZodOptional<z.ZodEnum<["turbo", "base"]>>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        cfgScale: z.ZodOptional<z.ZodNumber>;
        steps: z.ZodOptional<z.ZodNumber>;
        /** LoRA URN → strength. Z-Image ecosystem URNs only
         *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
        loras: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }>>;
    /** 2D post-processing (bg-removal / crop / palette-quantize). */
    post: z.ZodOptional<z.ZodObject<{
        /** Remove the background → transparent alpha cutout (sprites /
         *  UI). */
        removeBackground: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** Crop to the non-transparent content bounds. */
        cropToContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** Quantize every pixel to the nearest Art Bible palette
         *  swatch (hard palette enforcement). */
        quantizeToPalette: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        removeBackground: boolean;
        cropToContent: boolean;
        quantizeToPalette: boolean;
    }, {
        removeBackground?: boolean | undefined;
        cropToContent?: boolean | undefined;
        quantizeToPalette?: boolean | undefined;
    }>>;
    /** Validation gates; defaults fold in from the style config. */
    validation: z.ZodOptional<z.ZodObject<{
        /** Reject if width / height fall outside these bands (px). */
        minWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        minHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Require a real alpha channel with transparent pixels
         *  (sprites / UI). Catches an opaque-background cutout that
         *  didn't take. */
        requireAlpha: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** Reject a near-empty / mostly-transparent image (the "empty
         *  canvas" failure). Fraction of fully-transparent pixels above
         *  which the image is rejected. */
        maxTransparentFraction: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        maxHeight: number;
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        requireAlpha: boolean;
        maxTransparentFraction: number;
    }, {
        maxHeight?: number | undefined;
        minWidth?: number | undefined;
        maxWidth?: number | undefined;
        minHeight?: number | undefined;
        requireAlpha?: boolean | undefined;
        maxTransparentFraction?: number | undefined;
    }>>;
    /** Narrative + Art-Bible grounding record (Maintain). Written
     *  by the `art-direction` skill; fingerprints stamped by the
     *  drift detector. Provenance-shape — see AssetGroundingSchema. */
    grounding: z.ZodOptional<z.ZodObject<{
        /** When the asset was last grounded. Bumping it (a re-ground)
         *  signals the detector to RE-baseline rather than report drift. */
        groundedAt: z.ZodString;
        /** Which sidecar fields derive from the grounding: images/models
         *  ground `prompt` (+ `negativePrompt`); a character model's MOTION
         *  is grounded via `motionKit` / `motionAdd` (the `animation-
         *  direction` skill). A model grounded for BOTH art + motion carries
         *  the UNION here. */
        fields: z.ZodDefault<z.ZodArray<z.ZodEnum<["prompt", "negativePrompt", "motionKit", "motionAdd"]>, "many">>;
        /** The SUBJECT cards this asset depends on. */
        cards: z.ZodDefault<z.ZodArray<z.ZodObject<{
            /** `type:slug` — `character:reiska`, `item:moon-blade`,
             *  `location:shrine`. */
            cardId: z.ZodString;
            /** True when a card resolved (GROUNDED); false when the skill
             *  INFERRED with no card present (still records the intended id
             *  so drift can flag "a card now exists"). */
            resolved: z.ZodBoolean;
            /** SHA-256 of the card content at grounding time. Null until
             *  the drift detector stamps the baseline. */
            fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }, {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }>, "many">>;
        /** The Art Bible (STYLE) fingerprint at grounding time. Null
         *  until stamped; a Bible edit → every asset carrying a stale
         *  fingerprint drifts. */
        artBibleFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    }, {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    }>>;
    /** Cache lock — regeneration BLOCKED until removed. */
    lockedHash: z.ZodOptional<z.ZodString>;
    /** Provenance appended by the pipeline; read-only to authors. */
    lastGeneratedAt: z.ZodOptional<z.ZodString>;
    lastGeneratedSeed: z.ZodOptional<z.ZodNumber>;
    lastCostUsd: z.ZodOptional<z.ZodNumber>;
    lastError: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        message: z.ZodString;
        issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }>>;
    /** Version history — see ModelSidecar.takes. */
    takes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Cache-key content hash for THIS take's bytes — unique per take, so two
         *  takes of identical inputs at different timestamps don't collide.
         *  `SHA256(inputHash || '\\0' || takenAt)` via `computeTakeHash` in
         *  @unsupervised/asset-gen. The bytes live at `.asset-gen-cache/<kind>/<hash>.<ext>`. */
        hash: z.ZodString;
        /** Deterministic input-fingerprint (the pipeline's `fullHash`). Two takes of
         *  the SAME sidecar inputs share it; editing the prompt/params changes it. The
         *  value `lockedHash` validates against. */
        inputHash: z.ZodString;
        /** ISO-8601 generation timestamp — chronological ordering + UI display. */
        takenAt: z.ZodString;
        /** USD cost charged for this take. The kept take's cost mirrors to the
         *  sidecar-level `lastCostUsd`. */
        costUsd: z.ZodNumber;
        /** Byte size of the generated asset. */
        bytes: z.ZodNumber;
        /** File extension (`'glb'` for models, `'png'` for images). */
        extension: z.ZodString;
        /** Exactly one take per sidecar has `kept: true` — its bytes are the active
         *  output. */
        kept: z.ZodBoolean;
        /** Free-form author note. Does NOT participate in the cache hash. */
        notes: z.ZodOptional<z.ZodString>;
        /** The seed a model take was generated with (models track `lastGeneratedSeed`);
         *  lets the drawer show + a re-roll reuse it. */
        seed: z.ZodOptional<z.ZodNumber>;
        /** Provider + model that produced this take (`'civitai'` / `'z-image'`,
         *  `'nim'` / `'flux.1-dev'`). Provenance only — provider/model are NOT
         *  in the cache hash. Lets the version-history drawer show which
         *  provider made each swappable version. Undefined on legacy takes. */
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        /** Present when the generation FAILED (no usable bytes, never `kept: true`). */
        error: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            message: z.ZodString;
            issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    kind: "image";
    prompt: string;
    service: "civitai";
    role: "ui" | "sprite" | "texture" | "concept";
    tiling: boolean;
    params?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
    validation?: {
        maxHeight: number;
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        requireAlpha: boolean;
        maxTransparentFraction: number;
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    importedFrom?: string | undefined;
    grounding?: {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
    post?: {
        removeBackground: boolean;
        cropToContent: boolean;
        quantizeToPalette: boolean;
    } | undefined;
}, {
    kind: "image";
    prompt: string;
    service: "civitai";
    role: "ui" | "sprite" | "texture" | "concept";
    params?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
    validation?: {
        maxHeight?: number | undefined;
        minWidth?: number | undefined;
        maxWidth?: number | undefined;
        minHeight?: number | undefined;
        requireAlpha?: boolean | undefined;
        maxTransparentFraction?: number | undefined;
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    importedFrom?: string | undefined;
    grounding?: {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
    tiling?: boolean | undefined;
    post?: {
        removeBackground?: boolean | undefined;
        cropToContent?: boolean | undefined;
        quantizeToPalette?: boolean | undefined;
    } | undefined;
}>;
export declare const PromptSidecarSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"model">;
    /** Active vendor for this sidecar. v1 supports `'meshy'`. */
    service: z.ZodLiteral<"meshy">;
    /** Provenance marker for a BROUGHT-IN asset. When `'imported'`, the
     *  bytes beside this sidecar were supplied by the author (not
     *  vendor-generated): the generation pipeline SKIPS it — never
     *  dispatches to a vendor, never re-bills, never overwrites the
     *  bytes. The forge raw-asset pipeline still encodes those bytes
     *  into the typed runtime registry, so an imported asset is a
     *  first-class asset identical at runtime to a generated one.
     *  Absent ⇒ a normal generated sidecar. See `importedFrom`. */
    source: z.ZodOptional<z.ZodLiteral<"imported">>;
    /** Original file name the asset was imported from — display
     *  provenance only; not part of the cache hash. Meaningful only
     *  when `source === 'imported'`. */
    importedFrom: z.ZodOptional<z.ZodString>;
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
    pipeline: z.ZodOptional<z.ZodEnum<["text-to-3d", "concept-art"]>>;
    /** Concept-art config — REQUIRED when `pipeline:
     *  'concept-art'`, ignored otherwise. The pipeline guards
     *  the dispatch with a runtime check; the schema-level
     *  enforcement is via the orchestrator (not refine() —
     *  refines break .optional() composition per the
     *  @unsupervised/schemas conventions). */
    conceptArt: z.ZodOptional<z.ZodObject<{
        /** 1-4 views to generate. Meshy multi-image-to-3D accepts
         *  1-4 reference images; passing fewer reduces cost but
         *  also reduces 3D fidelity for complex subjects. */
        views: z.ZodArray<z.ZodObject<{
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
            prompt: z.ZodString;
            /** Stable label for filesystem layout: `concept/<asset>/<label>.png`.
             *  Convention: kebab-case (`front`, `side`, `back`, `hero`,
             *  `plan`, `detail-1`). */
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            prompt: string;
        }, {
            label: string;
            prompt: string;
        }>, "many">;
        /** Optional CivitAI param overrides — fold over the
         *  project-wide config defaults. */
        civitai: z.ZodOptional<z.ZodObject<{
            /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
             *  vs `base` (production quality). Default `base` for
             *  character / environment concepts; turbo is fine for
             *  props / iteration loops. */
            model: z.ZodOptional<z.ZodEnum<["turbo", "base"]>>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            cfgScale: z.ZodOptional<z.ZodNumber>;
            steps: z.ZodOptional<z.ZodNumber>;
            /** LoRA URN → strength. Z-Image ecosystem URNs only
             *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
            loras: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        }, {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    }, {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    }>>;
    /** User-authored prompt. The style config's `prefix` is
     *  prepended at runtime; the hash key includes the baked
     *  prompt + a style fingerprint. */
    prompt: z.ZodString;
    /** Vendor-honored negative prompt. Optional. */
    negativePrompt: z.ZodOptional<z.ZodString>;
    /** Deterministic seed. Optional — when omitted the vendor
     *  picks one and persists it back to the sidecar via
     *  `lastGeneratedSeed`. */
    seed: z.ZodOptional<z.ZodNumber>;
    /** Meshy-specific knobs. Falls back to schema defaults
     *  when omitted. */
    params: z.ZodOptional<z.ZodObject<{
        /** Visual style preset. OPTIONAL — omit unless your Meshy
         *  plan supports values beyond `'realistic'`. Defaults to
         *  unset (no field sent on the request). */
        artStyle: z.ZodOptional<z.ZodEnum<["realistic", "stylized", "cartoon"]>>;
        /** Mesh topology. `'quad'` is friendlier to downstream
         *  Blender editing; `'triangle'` is what runtime renderers
         *  consume anyway after Meshopt re-encoding. Default
         *  `'quad'` to keep the source asset author-friendly. */
        topology: z.ZodDefault<z.ZodOptional<z.ZodEnum<["triangle", "quad"]>>>;
        /** Target polygon budget. Meshy honors as a hint; the
         *  result is approximate. Common values: 4_000 (background
         *  prop), 8_000 (hero character), 16_000 (cinematic). */
        targetPolycount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        topology: "triangle" | "quad";
        targetPolycount: number;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
    }, {
        topology?: "triangle" | "quad" | undefined;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
        targetPolycount?: number | undefined;
    }>>;
    /** Auto-rigging step. When true, the model task's output is
     *  passed to Meshy's rigging endpoint, producing a rigged
     *  GLB suitable for animation. HUMANOID-ONLY — quadrupeds,
     *  flying creatures, and abstract spirits CANNOT be
     *  auto-rigged by Meshy; ship those as static GLBs and
     *  hand-rig in Blender post-hoc if animation is needed. */
    withRig: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** Meshy rig parameters; only consulted when
     *  `withRig: true`. */
    rigParams: z.ZodOptional<z.ZodObject<{
        /** Character height in meters. Default 1.7 (average human).
         *  Tune for non-default-scale characters (chibi /
         *  giant boss / etc.). */
        heightMeters: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        heightMeters?: number | undefined;
    }, {
        heightMeters?: number | undefined;
    }>>;
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
    animations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>>;
    /** Motion kit name (from `motionKits` in asset-gen.config.ts) —
     *  resolves to a set of named clips generated for this character.
     *  Supersedes the legacy numeric `animations` array; requires
     *  `withRig: true`. */
    motionKit: z.ZodOptional<z.ZodString>;
    /** Extra `motionLibrary` clip names appended to the kit —
     *  per-character additions beyond the role bundle (e.g. a boss's
     *  signature attack on top of `humanoid-basic`). */
    motionAdd: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Validation gates that fire after generation. Defaults
     *  fold in from the style config. */
    validation: z.ZodOptional<z.ZodObject<{
        /** Reject if vertex count falls outside this band. Lower
         *  bound catches empty / degenerate outputs; upper bound
         *  catches polycount overruns. */
        minVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Require the model to have a skeleton with ≥ this many
         *  bones. Disable by setting to 0. */
        minBones: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Reject if any of these named animation clips are missing.
         *  Empty array disables the check. */
        requiredAnimations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        minVertices: number;
        maxVertices: number;
        minBones: number;
        requiredAnimations: string[];
    }, {
        minVertices?: number | undefined;
        maxVertices?: number | undefined;
        minBones?: number | undefined;
        requiredAnimations?: string[] | undefined;
    }>>;
    /** Narrative + Art-Bible grounding record (Ground + Maintain).
     *  Written by the `art-direction` skill; the drift detector
     *  fingerprints the card (subject) + the Art Bible (style) so a
     *  model goes stale when either changes — the same two-axis
     *  grounding as 2D images. Provenance-shape; not hashed. */
    grounding: z.ZodOptional<z.ZodObject<{
        /** When the asset was last grounded. Bumping it (a re-ground)
         *  signals the detector to RE-baseline rather than report drift. */
        groundedAt: z.ZodString;
        /** Which sidecar fields derive from the grounding: images/models
         *  ground `prompt` (+ `negativePrompt`); a character model's MOTION
         *  is grounded via `motionKit` / `motionAdd` (the `animation-
         *  direction` skill). A model grounded for BOTH art + motion carries
         *  the UNION here. */
        fields: z.ZodDefault<z.ZodArray<z.ZodEnum<["prompt", "negativePrompt", "motionKit", "motionAdd"]>, "many">>;
        /** The SUBJECT cards this asset depends on. */
        cards: z.ZodDefault<z.ZodArray<z.ZodObject<{
            /** `type:slug` — `character:reiska`, `item:moon-blade`,
             *  `location:shrine`. */
            cardId: z.ZodString;
            /** True when a card resolved (GROUNDED); false when the skill
             *  INFERRED with no card present (still records the intended id
             *  so drift can flag "a card now exists"). */
            resolved: z.ZodBoolean;
            /** SHA-256 of the card content at grounding time. Null until
             *  the drift detector stamps the baseline. */
            fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }, {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }>, "many">>;
        /** The Art Bible (STYLE) fingerprint at grounding time. Null
         *  until stamped; a Bible edit → every asset carrying a stale
         *  fingerprint drifts. */
        artBibleFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    }, {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    }>>;
    /** Cache lock — when set, regeneration is BLOCKED until
     *  removed. The hash committed here MUST match the current
     *  computed hash; mismatch surfaces as a clear error
     *  (someone edited the prompt while it was locked). */
    lockedHash: z.ZodOptional<z.ZodString>;
    /** Provenance fields appended by the pipeline; read-only
     *  from the author's perspective. */
    lastGeneratedAt: z.ZodOptional<z.ZodString>;
    lastGeneratedSeed: z.ZodOptional<z.ZodNumber>;
    lastCostUsd: z.ZodOptional<z.ZodNumber>;
    lastError: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        message: z.ZodString;
        issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }>>;
    /** Per-view paths of the generated concept-art images
     *  (relative to the app root). Populated on sidecars using
     *  the `'concept-art'` pipeline after the first successful
     *  run. Useful for the author to inspect what the vendor
     *  produced + for the audit log. */
    lastConceptArt: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        label: string;
    }, {
        path: string;
        label: string;
    }>, "many">>;
    /** Version history — every generation is an immutable take; exactly ONE has
     *  `kept: true` (its bytes are the active output). Absent on legacy sidecars
     *  (synthesized from the `last*` fields by @unsupervised/asset-gen `getTakes`). */
    takes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Cache-key content hash for THIS take's bytes — unique per take, so two
         *  takes of identical inputs at different timestamps don't collide.
         *  `SHA256(inputHash || '\\0' || takenAt)` via `computeTakeHash` in
         *  @unsupervised/asset-gen. The bytes live at `.asset-gen-cache/<kind>/<hash>.<ext>`. */
        hash: z.ZodString;
        /** Deterministic input-fingerprint (the pipeline's `fullHash`). Two takes of
         *  the SAME sidecar inputs share it; editing the prompt/params changes it. The
         *  value `lockedHash` validates against. */
        inputHash: z.ZodString;
        /** ISO-8601 generation timestamp — chronological ordering + UI display. */
        takenAt: z.ZodString;
        /** USD cost charged for this take. The kept take's cost mirrors to the
         *  sidecar-level `lastCostUsd`. */
        costUsd: z.ZodNumber;
        /** Byte size of the generated asset. */
        bytes: z.ZodNumber;
        /** File extension (`'glb'` for models, `'png'` for images). */
        extension: z.ZodString;
        /** Exactly one take per sidecar has `kept: true` — its bytes are the active
         *  output. */
        kept: z.ZodBoolean;
        /** Free-form author note. Does NOT participate in the cache hash. */
        notes: z.ZodOptional<z.ZodString>;
        /** The seed a model take was generated with (models track `lastGeneratedSeed`);
         *  lets the drawer show + a re-roll reuse it. */
        seed: z.ZodOptional<z.ZodNumber>;
        /** Provider + model that produced this take (`'civitai'` / `'z-image'`,
         *  `'nim'` / `'flux.1-dev'`). Provenance only — provider/model are NOT
         *  in the cache hash. Lets the version-history drawer show which
         *  provider made each swappable version. Undefined on legacy takes. */
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        /** Present when the generation FAILED (no usable bytes, never `kept: true`). */
        error: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            message: z.ZodString;
            issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    kind: "model";
    prompt: string;
    service: "meshy";
    withRig: boolean;
    animations: number[];
    params?: {
        topology: "triangle" | "quad";
        targetPolycount: number;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
    } | undefined;
    validation?: {
        minVertices: number;
        maxVertices: number;
        minBones: number;
        requiredAnimations: string[];
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    motionKit?: string | undefined;
    motionAdd?: string[] | undefined;
    importedFrom?: string | undefined;
    pipeline?: "text-to-3d" | "concept-art" | undefined;
    conceptArt?: {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    } | undefined;
    rigParams?: {
        heightMeters?: number | undefined;
    } | undefined;
    grounding?: {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    lastConceptArt?: {
        path: string;
        label: string;
    }[] | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
}, {
    kind: "model";
    prompt: string;
    service: "meshy";
    params?: {
        topology?: "triangle" | "quad" | undefined;
        artStyle?: "realistic" | "stylized" | "cartoon" | undefined;
        targetPolycount?: number | undefined;
    } | undefined;
    validation?: {
        minVertices?: number | undefined;
        maxVertices?: number | undefined;
        minBones?: number | undefined;
        requiredAnimations?: string[] | undefined;
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    motionKit?: string | undefined;
    motionAdd?: string[] | undefined;
    importedFrom?: string | undefined;
    pipeline?: "text-to-3d" | "concept-art" | undefined;
    conceptArt?: {
        views: {
            label: string;
            prompt: string;
        }[];
        civitai?: {
            steps?: number | undefined;
            height?: number | undefined;
            width?: number | undefined;
            model?: "turbo" | "base" | undefined;
            cfgScale?: number | undefined;
            loras?: Record<string, number> | undefined;
        } | undefined;
    } | undefined;
    withRig?: boolean | undefined;
    rigParams?: {
        heightMeters?: number | undefined;
    } | undefined;
    animations?: number[] | undefined;
    grounding?: {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    lastConceptArt?: {
        path: string;
        label: string;
    }[] | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"image">;
    /** v1 vendor — CivitAI Z-Image (already shipped as the 3D
     *  concept-art feeder; here it produces first-class 2D). */
    service: z.ZodLiteral<"civitai">;
    /** Provenance marker for a BROUGHT-IN asset — see the identical
     *  field on `ModelSidecarSchema`. `'imported'` ⇒ author-supplied
     *  bytes; the generation pipeline skips it (no vendor call, no
     *  re-bill, no overwrite); forge still encodes the bytes into the
     *  typed registry. Absent ⇒ a normal generated sidecar. */
    source: z.ZodOptional<z.ZodLiteral<"imported">>;
    /** Original file name the asset was imported from — display
     *  provenance only; not hashed. Meaningful only when imported. */
    importedFrom: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["sprite", "texture", "ui", "concept"]>;
    /** User-authored SUBJECT prompt. The style prefix (distilled
     *  from the Art Bible) is prepended at runtime; the hash key
     *  includes the baked prompt + a style fingerprint. */
    prompt: z.ZodString;
    /** Vendor negative prompt. The Art Bible's `negatives` fold in
     *  via the config; per-asset negatives extend them. */
    negativePrompt: z.ZodOptional<z.ZodString>;
    /** Deterministic seed. Omit → vendor picks + persists it back
     *  via `lastGeneratedSeed`. */
    seed: z.ZodOptional<z.ZodNumber>;
    /** Require seamless edge-wrap (textures). Drives a tiling gate
     *  at verify time + a tiling hint in the baked prompt. */
    tiling: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** CivitAI knobs (model / size / cfg / steps / loras). Falls
     *  back to the project `civitai` config block. */
    params: z.ZodOptional<z.ZodObject<{
        /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
         *  vs `base` (production quality). Default `base` for
         *  character / environment concepts; turbo is fine for
         *  props / iteration loops. */
        model: z.ZodOptional<z.ZodEnum<["turbo", "base"]>>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        cfgScale: z.ZodOptional<z.ZodNumber>;
        steps: z.ZodOptional<z.ZodNumber>;
        /** LoRA URN → strength. Z-Image ecosystem URNs only
         *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
        loras: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }>>;
    /** 2D post-processing (bg-removal / crop / palette-quantize). */
    post: z.ZodOptional<z.ZodObject<{
        /** Remove the background → transparent alpha cutout (sprites /
         *  UI). */
        removeBackground: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** Crop to the non-transparent content bounds. */
        cropToContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** Quantize every pixel to the nearest Art Bible palette
         *  swatch (hard palette enforcement). */
        quantizeToPalette: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        removeBackground: boolean;
        cropToContent: boolean;
        quantizeToPalette: boolean;
    }, {
        removeBackground?: boolean | undefined;
        cropToContent?: boolean | undefined;
        quantizeToPalette?: boolean | undefined;
    }>>;
    /** Validation gates; defaults fold in from the style config. */
    validation: z.ZodOptional<z.ZodObject<{
        /** Reject if width / height fall outside these bands (px). */
        minWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        minHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        /** Require a real alpha channel with transparent pixels
         *  (sprites / UI). Catches an opaque-background cutout that
         *  didn't take. */
        requireAlpha: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** Reject a near-empty / mostly-transparent image (the "empty
         *  canvas" failure). Fraction of fully-transparent pixels above
         *  which the image is rejected. */
        maxTransparentFraction: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        maxHeight: number;
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        requireAlpha: boolean;
        maxTransparentFraction: number;
    }, {
        maxHeight?: number | undefined;
        minWidth?: number | undefined;
        maxWidth?: number | undefined;
        minHeight?: number | undefined;
        requireAlpha?: boolean | undefined;
        maxTransparentFraction?: number | undefined;
    }>>;
    /** Narrative + Art-Bible grounding record (Maintain). Written
     *  by the `art-direction` skill; fingerprints stamped by the
     *  drift detector. Provenance-shape — see AssetGroundingSchema. */
    grounding: z.ZodOptional<z.ZodObject<{
        /** When the asset was last grounded. Bumping it (a re-ground)
         *  signals the detector to RE-baseline rather than report drift. */
        groundedAt: z.ZodString;
        /** Which sidecar fields derive from the grounding: images/models
         *  ground `prompt` (+ `negativePrompt`); a character model's MOTION
         *  is grounded via `motionKit` / `motionAdd` (the `animation-
         *  direction` skill). A model grounded for BOTH art + motion carries
         *  the UNION here. */
        fields: z.ZodDefault<z.ZodArray<z.ZodEnum<["prompt", "negativePrompt", "motionKit", "motionAdd"]>, "many">>;
        /** The SUBJECT cards this asset depends on. */
        cards: z.ZodDefault<z.ZodArray<z.ZodObject<{
            /** `type:slug` — `character:reiska`, `item:moon-blade`,
             *  `location:shrine`. */
            cardId: z.ZodString;
            /** True when a card resolved (GROUNDED); false when the skill
             *  INFERRED with no card present (still records the intended id
             *  so drift can flag "a card now exists"). */
            resolved: z.ZodBoolean;
            /** SHA-256 of the card content at grounding time. Null until
             *  the drift detector stamps the baseline. */
            fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }, {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }>, "many">>;
        /** The Art Bible (STYLE) fingerprint at grounding time. Null
         *  until stamped; a Bible edit → every asset carrying a stale
         *  fingerprint drifts. */
        artBibleFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    }, {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    }>>;
    /** Cache lock — regeneration BLOCKED until removed. */
    lockedHash: z.ZodOptional<z.ZodString>;
    /** Provenance appended by the pipeline; read-only to authors. */
    lastGeneratedAt: z.ZodOptional<z.ZodString>;
    lastGeneratedSeed: z.ZodOptional<z.ZodNumber>;
    lastCostUsd: z.ZodOptional<z.ZodNumber>;
    lastError: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        message: z.ZodString;
        issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }, {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    }>>;
    /** Version history — see ModelSidecar.takes. */
    takes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Cache-key content hash for THIS take's bytes — unique per take, so two
         *  takes of identical inputs at different timestamps don't collide.
         *  `SHA256(inputHash || '\\0' || takenAt)` via `computeTakeHash` in
         *  @unsupervised/asset-gen. The bytes live at `.asset-gen-cache/<kind>/<hash>.<ext>`. */
        hash: z.ZodString;
        /** Deterministic input-fingerprint (the pipeline's `fullHash`). Two takes of
         *  the SAME sidecar inputs share it; editing the prompt/params changes it. The
         *  value `lockedHash` validates against. */
        inputHash: z.ZodString;
        /** ISO-8601 generation timestamp — chronological ordering + UI display. */
        takenAt: z.ZodString;
        /** USD cost charged for this take. The kept take's cost mirrors to the
         *  sidecar-level `lastCostUsd`. */
        costUsd: z.ZodNumber;
        /** Byte size of the generated asset. */
        bytes: z.ZodNumber;
        /** File extension (`'glb'` for models, `'png'` for images). */
        extension: z.ZodString;
        /** Exactly one take per sidecar has `kept: true` — its bytes are the active
         *  output. */
        kept: z.ZodBoolean;
        /** Free-form author note. Does NOT participate in the cache hash. */
        notes: z.ZodOptional<z.ZodString>;
        /** The seed a model take was generated with (models track `lastGeneratedSeed`);
         *  lets the drawer show + a re-roll reuse it. */
        seed: z.ZodOptional<z.ZodNumber>;
        /** Provider + model that produced this take (`'civitai'` / `'z-image'`,
         *  `'nim'` / `'flux.1-dev'`). Provenance only — provider/model are NOT
         *  in the cache hash. Lets the version-history drawer show which
         *  provider made each swappable version. Undefined on legacy takes. */
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        /** Present when the generation FAILED (no usable bytes, never `kept: true`). */
        error: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            message: z.ZodString;
            issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }, {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }, {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    kind: "image";
    prompt: string;
    service: "civitai";
    role: "ui" | "sprite" | "texture" | "concept";
    tiling: boolean;
    params?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
    validation?: {
        maxHeight: number;
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        requireAlpha: boolean;
        maxTransparentFraction: number;
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    importedFrom?: string | undefined;
    grounding?: {
        groundedAt: string;
        fields: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[];
        cards: {
            cardId: string;
            resolved: boolean;
            fingerprint: string | null;
        }[];
        artBibleFingerprint: string | null;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
    post?: {
        removeBackground: boolean;
        cropToContent: boolean;
        quantizeToPalette: boolean;
    } | undefined;
}, {
    kind: "image";
    prompt: string;
    service: "civitai";
    role: "ui" | "sprite" | "texture" | "concept";
    params?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
    validation?: {
        maxHeight?: number | undefined;
        minWidth?: number | undefined;
        maxWidth?: number | undefined;
        minHeight?: number | undefined;
        requireAlpha?: boolean | undefined;
        maxTransparentFraction?: number | undefined;
    } | undefined;
    source?: "imported" | undefined;
    seed?: number | undefined;
    negativePrompt?: string | undefined;
    importedFrom?: string | undefined;
    grounding?: {
        groundedAt: string;
        fields?: ("prompt" | "negativePrompt" | "motionKit" | "motionAdd")[] | undefined;
        cards?: {
            cardId: string;
            resolved: boolean;
            fingerprint?: string | null | undefined;
        }[] | undefined;
        artBibleFingerprint?: string | null | undefined;
    } | undefined;
    lockedHash?: string | undefined;
    lastGeneratedAt?: string | undefined;
    lastGeneratedSeed?: number | undefined;
    lastCostUsd?: number | undefined;
    lastError?: {
        message: string;
        at: string;
        kind: string;
        issues?: string[] | undefined;
    } | undefined;
    takes?: {
        hash: string;
        inputHash: string;
        takenAt: string;
        costUsd: number;
        bytes: number;
        extension: string;
        kept: boolean;
        seed?: number | undefined;
        model?: string | undefined;
        notes?: string | undefined;
        provider?: string | undefined;
        error?: {
            message: string;
            at: string;
            kind: string;
            issues?: string[] | undefined;
        } | undefined;
    }[] | undefined;
    tiling?: boolean | undefined;
    post?: {
        removeBackground?: boolean | undefined;
        cropToContent?: boolean | undefined;
        quantizeToPalette?: boolean | undefined;
    } | undefined;
}>]>;
export type PromptSidecar = z.infer<typeof PromptSidecarSchema>;
export type ModelSidecar = z.infer<typeof ModelSidecarSchema>;
export type ImageSidecar = z.infer<typeof ImageSidecarSchema>;
/** Art-review config. Opt-in per game via a `review` block on the
 *  style config. When absent, review never runs. */
export declare const AssetReviewConfigSchema: z.ZodObject<{
    /** Master switch. Default OFF — review is opt-in. */
    enabled: z.ZodDefault<z.ZodBoolean>;
    /** In-forge posture on a `fail` verdict:
     *    - `'flag'`   — record + warn, change nothing (default).
     *    - `'retry'`  — re-roll with a new seed up to
     *      `maxAttemptsPerSlot` (vendor nondeterminism).
     *    - `'retune'` — infer a bounded param delta (cfg / steps /
     *      model) from the judge's adherence diagnosis, apply +
     *      regenerate; fall back to a blind re-roll when no delta
     *      applies. Strict superset of `retry`. */
    failVerdictAction: z.ZodDefault<z.ZodEnum<["flag", "retry", "retune"]>>;
    /** Max generation attempts per slot the loop may make (incl.
     *  the first). Bounds the loop alongside the budget cap. */
    maxAttemptsPerSlot: z.ZodDefault<z.ZodNumber>;
    /** Vision model for the perceptual judge. Default
     *  `claude-sonnet-5` — the cost/quality sweet spot. */
    judgeModel: z.ZodDefault<z.ZodString>;
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
    judgeProvider: z.ZodDefault<z.ZodEnum<["auto", "api", "claude-cli"]>>;
    /** Path to the `claude` binary. Empty = resolve `claude` from
     *  PATH. Only used by the `claude-cli` provider. */
    claudeCliPath: z.ZodOptional<z.ZodString>;
    /** N-vote perceptual panel. The perceptual judge is a single,
     *  uncalibrated, non-deterministic LLM — for hero assets that gate
     *  is too thin to trust unattended. A panel runs `jurors`
     *  independent judges (each nudged onto a distinct failure-mode
     *  lens when `diverseLenses`), takes the majority verdict, and
     *  escalates to human review when they disagree past
     *  `escalateBelowAgreement`. `jurors: 1` (default) is the exact
     *  single-vote behavior — zero cost/behavior change until opted
     *  in. Never affects generated bytes (Verify-only). */
    panel: z.ZodDefault<z.ZodObject<{
        /** Independent jurors per perceptual review. 1 = single vote. */
        jurors: z.ZodDefault<z.ZodNumber>;
        /** Rotate each juror onto a distinct lens (silhouette / palette
         *  / style-fidelity / subject-adherence / overall) so they
         *  catch different failure modes instead of voting
         *  redundantly. Ignored when `jurors` is 1. */
        diverseLenses: z.ZodDefault<z.ZodBoolean>;
        /** Escalate to human review when the fraction of jurors
         *  agreeing with the majority verdict is BELOW this. 0.67 ⇒ a
         *  3-juror panel escalates on any 2-1 (or worse) split. Set to
         *  0 to never escalate on a split. */
        escalateBelowAgreement: z.ZodDefault<z.ZodNumber>;
        /** Also escalate a bare `concern` verdict (the usable-but-off
         *  band where automated judgment is weakest) to human review.
         *  Independent of the panel — applies to single-vote too. */
        escalateConcern: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        jurors: number;
        diverseLenses: boolean;
        escalateBelowAgreement: number;
        escalateConcern: boolean;
    }, {
        jurors?: number | undefined;
        diverseLenses?: boolean | undefined;
        escalateBelowAgreement?: number | undefined;
        escalateConcern?: boolean | undefined;
    }>>;
    /** Content-SAFETY output scan (distinct from art-adherence). The
     *  prompt gate (L1 + the proxy's L2) can't see what a vendor actually
     *  RENDERED, and the vendors' own output moderation is imperfect —
     *  so an opt-in vision pass over the generated image flags
     *  policy-violating OUTPUT (sexual / gore / hate-symbol / real-person
     *  likeness; CSAM is always the hardest fail). Advisory / flag-only —
     *  it records a `content-safety` criterion + escalates on a fail; it
     *  never mutates or deletes bytes (the operator decides). Reuses the
     *  same vision transport + `judgeProvider` as the perceptual judge. */
    safety: z.ZodDefault<z.ZodObject<{
        /** Master switch for the output safety scan. Default OFF. */
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
    }, {
        enabled?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    failVerdictAction: "flag" | "retry" | "retune";
    maxAttemptsPerSlot: number;
    judgeModel: string;
    judgeProvider: "auto" | "api" | "claude-cli";
    panel: {
        jurors: number;
        diverseLenses: boolean;
        escalateBelowAgreement: number;
        escalateConcern: boolean;
    };
    safety: {
        enabled: boolean;
    };
    claudeCliPath?: string | undefined;
}, {
    enabled?: boolean | undefined;
    failVerdictAction?: "flag" | "retry" | "retune" | undefined;
    maxAttemptsPerSlot?: number | undefined;
    judgeModel?: string | undefined;
    judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
    claudeCliPath?: string | undefined;
    panel?: {
        jurors?: number | undefined;
        diverseLenses?: boolean | undefined;
        escalateBelowAgreement?: number | undefined;
        escalateConcern?: boolean | undefined;
    } | undefined;
    safety?: {
        enabled?: boolean | undefined;
    } | undefined;
}>;
export type AssetReviewConfig = z.infer<typeof AssetReviewConfigSchema>;
/** Project-level asset-gen config. Authored at
 *  `apps/<game>/asset-gen.config.ts`; one per app.
 *
 *  The `stylePrefix` is the load-bearing field — it's
 *  prepended to every prompt before the vendor sees it, AND
 *  its hash participates in the cache key (so changing the
 *  style invalidates every cached asset deliberately —
 *  coherence is project-level). */
/** Where a motion clip comes from — the pluggable Generate backend
 *  seam. Backend 1 (`meshy-library`) picks a clip from Meshy's
 *  ~530-motion catalog by action id. Backend 2 (`mocap`, backlog)
 *  adds a variant here (prompt → video → markerless mocap →
 *  retarget) behind the SAME Verify / Integrate / Maintain
 *  downstream. Discriminated on `backend` so the resolver + the
 *  generator narrow without casts. */
export declare const MotionClipSourceSchema: z.ZodDiscriminatedUnion<"backend", [z.ZodObject<{
    backend: z.ZodLiteral<"meshy-library">;
    /** Integer action id from Meshy's animation library
     *  (https://docs.meshy.ai/en/api/animation-library). */
    actionId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    actionId: number;
    backend: "meshy-library";
}, {
    actionId: number;
    backend: "meshy-library";
}>]>;
export type MotionClipSource = z.infer<typeof MotionClipSourceSchema>;
/** One canonical motion clip in the project motion library.
 *  Authored ONCE against the shared Meshy auto-rig topology, then
 *  retargeted (channel-copied) onto each character (Phase 2). */
export declare const MotionClipSchema: z.ZodObject<{
    /** Delivery intent — what the motion should read as. Drives clip
     *  selection, the perceptual legibility judge, and the
     *  root-motion-direction gate. e.g. `"walk forward, steady"` /
     *  `"overhead heavy swing"`. */
    intent: z.ZodString;
    /** Looping clip (idle / walk / run) — drives the loop-cleanliness
     *  gate (Phase 3). Non-looping = one-shot (attack / death). */
    loop: z.ZodDefault<z.ZodBoolean>;
    source: z.ZodDiscriminatedUnion<"backend", [z.ZodObject<{
        backend: z.ZodLiteral<"meshy-library">;
        /** Integer action id from Meshy's animation library
         *  (https://docs.meshy.ai/en/api/animation-library). */
        actionId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        actionId: number;
        backend: "meshy-library";
    }, {
        actionId: number;
        backend: "meshy-library";
    }>]>;
}, "strip", z.ZodTypeAny, {
    loop: boolean;
    source: {
        actionId: number;
        backend: "meshy-library";
    };
    intent: string;
}, {
    source: {
        actionId: number;
        backend: "meshy-library";
    };
    intent: string;
    loop?: boolean | undefined;
}>;
export type MotionClip = z.infer<typeof MotionClipSchema>;
/** Project motion library — canonical clips keyed by SEMANTIC name
 *  (`idle`, `walk`, `attack-heavy`). The name becomes the runtime
 *  clip id in the merged GLB's `<Name>Animations` union (Phase 2),
 *  so the runtime drives `clipId: 'attack-heavy'`, never a numeric
 *  action id. The `voiceCast` / `loraCast` analog for motion. */
export declare const MotionLibrarySchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    /** Delivery intent — what the motion should read as. Drives clip
     *  selection, the perceptual legibility judge, and the
     *  root-motion-direction gate. e.g. `"walk forward, steady"` /
     *  `"overhead heavy swing"`. */
    intent: z.ZodString;
    /** Looping clip (idle / walk / run) — drives the loop-cleanliness
     *  gate (Phase 3). Non-looping = one-shot (attack / death). */
    loop: z.ZodDefault<z.ZodBoolean>;
    source: z.ZodDiscriminatedUnion<"backend", [z.ZodObject<{
        backend: z.ZodLiteral<"meshy-library">;
        /** Integer action id from Meshy's animation library
         *  (https://docs.meshy.ai/en/api/animation-library). */
        actionId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        actionId: number;
        backend: "meshy-library";
    }, {
        actionId: number;
        backend: "meshy-library";
    }>]>;
}, "strip", z.ZodTypeAny, {
    loop: boolean;
    source: {
        actionId: number;
        backend: "meshy-library";
    };
    intent: string;
}, {
    source: {
        actionId: number;
        backend: "meshy-library";
    };
    intent: string;
    loop?: boolean | undefined;
}>>;
export type MotionLibrary = z.infer<typeof MotionLibrarySchema>;
/** Motion kits — role-keyed bundles of clip names from the library
 *  (`humanoid-basic: ['idle','walk','run','turn-left','turn-right']`).
 *  A character sidecar references a kit by name via `motionKit`; the
 *  pipeline resolves it (+ any per-character `motionAdd`) to the
 *  ordered clip set it generates. */
export declare const MotionKitsSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
export type MotionKits = z.infer<typeof MotionKitsSchema>;
export declare const StyleConfigSchema: z.ZodObject<{
    /** Project-wide style fragment prepended to every prompt.
     *  Example: `"hand-painted PBR, Wind Waker palette, soft
     *  cel-shading, no photorealism"`. */
    stylePrefix: z.ZodDefault<z.ZodString>;
    /** Per-kind style sub-fragments. Appended AFTER `stylePrefix`
     *  when the matching kind generates. Future-friendly seam
     *  for "weapons look one way, characters another" without a
     *  schema bump. */
    styleByKind: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        /** 2D style fragment — distilled from the Art Bible
         *  (rendering model + palette summary + line treatment).
         *  Prepended to every `image` prompt. */
        image: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        image?: string | undefined;
    }, {
        model?: string | undefined;
        image?: string | undefined;
    }>>;
    /** Soft cap on per-pipeline-run spend (USD). Warns when
     *  exceeded; does NOT block. */
    budgetSoftUsd: z.ZodDefault<z.ZodNumber>;
    /** Hard cap on per-pipeline-run spend (USD). Aborts the
     *  pipeline when a new task's projected cost would push the
     *  session past this. In-flight tasks complete. */
    budgetHardUsd: z.ZodDefault<z.ZodNumber>;
    /** LIFETIME spend ceiling (USD) — cumulative across EVERY run,
     *  summed from the audit log. The per-run caps above reset each
     *  `forge runOnce`, so an agent that loops forge could spend N× the
     *  hard cap; this bounds total spend no matter how many runs. A
     *  generation whose projected cost would push all-time spend past
     *  this is rejected (`budget-exceeded`). Undefined ⇒ no lifetime
     *  cap (default; today's behavior). The AI-pilot backstop. */
    budgetLifetimeUsd: z.ZodOptional<z.ZodNumber>;
    /** Require an explicit, bounded, unexpired spend AUTHORIZATION
     *  before any vendor call (the propose-approve gate). When true, a
     *  billed generation is rejected (`spend-unauthorized`) unless
     *  `.asset-gen-spend-authorization.json` grants enough headroom —
     *  written by `asset-gen authorize --up-to <usd>` after a human
     *  reviews `asset-gen forecast`. Off by default (human-driven runs
     *  spend freely); turn on for autonomous / CI contexts so an agent
     *  can drive generation but can't run up an unapproved bill. */
    requireSpendAuthorization: z.ZodDefault<z.ZodBoolean>;
    /** Default validation gates folded in when a sidecar omits
     *  its own `validation` block. */
    defaultValidation: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodObject<{
            /** Reject if vertex count falls outside this band. Lower
             *  bound catches empty / degenerate outputs; upper bound
             *  catches polycount overruns. */
            minVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            maxVertices: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            /** Require the model to have a skeleton with ≥ this many
             *  bones. Disable by setting to 0. */
            minBones: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            /** Reject if any of these named animation clips are missing.
             *  Empty array disables the check. */
            requiredAnimations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            minVertices: number;
            maxVertices: number;
            minBones: number;
            requiredAnimations: string[];
        }, {
            minVertices?: number | undefined;
            maxVertices?: number | undefined;
            minBones?: number | undefined;
            requiredAnimations?: string[] | undefined;
        }>>;
        image: z.ZodOptional<z.ZodObject<{
            /** Reject if width / height fall outside these bands (px). */
            minWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            maxWidth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            minHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            maxHeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            /** Require a real alpha channel with transparent pixels
             *  (sprites / UI). Catches an opaque-background cutout that
             *  didn't take. */
            requireAlpha: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            /** Reject a near-empty / mostly-transparent image (the "empty
             *  canvas" failure). Fraction of fully-transparent pixels above
             *  which the image is rejected. */
            maxTransparentFraction: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            maxHeight: number;
            minWidth: number;
            maxWidth: number;
            minHeight: number;
            requireAlpha: boolean;
            maxTransparentFraction: number;
        }, {
            maxHeight?: number | undefined;
            minWidth?: number | undefined;
            maxWidth?: number | undefined;
            minHeight?: number | undefined;
            requireAlpha?: boolean | undefined;
            maxTransparentFraction?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model?: {
            minVertices: number;
            maxVertices: number;
            minBones: number;
            requiredAnimations: string[];
        } | undefined;
        image?: {
            maxHeight: number;
            minWidth: number;
            maxWidth: number;
            minHeight: number;
            requireAlpha: boolean;
            maxTransparentFraction: number;
        } | undefined;
    }, {
        model?: {
            minVertices?: number | undefined;
            maxVertices?: number | undefined;
            minBones?: number | undefined;
            requiredAnimations?: string[] | undefined;
        } | undefined;
        image?: {
            maxHeight?: number | undefined;
            minWidth?: number | undefined;
            maxWidth?: number | undefined;
            minHeight?: number | undefined;
            requireAlpha?: boolean | undefined;
            maxTransparentFraction?: number | undefined;
        } | undefined;
    }>>;
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
    bannedTerms: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
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
    loraCast: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        /** Z-Image LoRA URN
         *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
        urn: z.ZodString;
        /** Strength 0..2; default 0.8. */
        strength: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        urn: string;
        strength: number;
    }, {
        urn: string;
        strength?: number | undefined;
    }>>>;
    /** Project-wide CivitAI defaults — folded into per-sidecar
     *  conceptArt.civitai overrides at dispatch. The load-
     *  bearing field for "any style" support: this is where
     *  the project's LoRA URNs + per-style tokens live. Each
     *  game's `asset-gen.config.ts` picks its own LoRAs;
     *  recipes never hardcode style. */
    civitai: z.ZodOptional<z.ZodObject<{
        /** `turbo` (fast, cheap, cfg=1 — negative prompts ineffective)
         *  vs `base` (production quality). Default `base` for
         *  character / environment concepts; turbo is fine for
         *  props / iteration loops. */
        model: z.ZodOptional<z.ZodEnum<["turbo", "base"]>>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        cfgScale: z.ZodOptional<z.ZodNumber>;
        steps: z.ZodOptional<z.ZodNumber>;
        /** LoRA URN → strength. Z-Image ecosystem URNs only
         *  (`urn:air:zImage:lora:civitai:<id>@<version>`). */
        loras: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }, {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    }>>;
    /** Project motion library — canonical clips (authored once,
     *  retargeted to all characters) keyed by semantic name. The
     *  animation pipeline's authoring surface; the motion analog of
     *  `loraCast` / audio's `voiceCast`. Participates in the style
     *  fingerprint, so editing a clip's action id invalidates the
     *  relevant caches (deliberate). */
    motionLibrary: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        /** Delivery intent — what the motion should read as. Drives clip
         *  selection, the perceptual legibility judge, and the
         *  root-motion-direction gate. e.g. `"walk forward, steady"` /
         *  `"overhead heavy swing"`. */
        intent: z.ZodString;
        /** Looping clip (idle / walk / run) — drives the loop-cleanliness
         *  gate (Phase 3). Non-looping = one-shot (attack / death). */
        loop: z.ZodDefault<z.ZodBoolean>;
        source: z.ZodDiscriminatedUnion<"backend", [z.ZodObject<{
            backend: z.ZodLiteral<"meshy-library">;
            /** Integer action id from Meshy's animation library
             *  (https://docs.meshy.ai/en/api/animation-library). */
            actionId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            actionId: number;
            backend: "meshy-library";
        }, {
            actionId: number;
            backend: "meshy-library";
        }>]>;
    }, "strip", z.ZodTypeAny, {
        loop: boolean;
        source: {
            actionId: number;
            backend: "meshy-library";
        };
        intent: string;
    }, {
        source: {
            actionId: number;
            backend: "meshy-library";
        };
        intent: string;
        loop?: boolean | undefined;
    }>>>;
    /** Motion kits — role-keyed bundles of `motionLibrary` clip names.
     *  A character sidecar's `motionKit` references one. */
    motionKits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
    /** Deterministic motion Verify (animation Phase 3). When enabled,
     *  `pnpm forge` runs the temporal gates (loop-cleanliness / jitter /
     *  duration / root-motion) on each generated character's merged
     *  multi-clip GLB after generation. Flag-only — records the verdict
     *  to `.asset-gen-review.json`, never regenerates. Default OFF. */
    motionReview: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        /** Phase 5 — the opt-in perceptual legibility judge. Renders each
         *  clip to a skeleton contact sheet and asks a vision model whether
         *  the MOTION reads (legible + natural). BILLED. Concern-capped (a
         *  bones-only preview is advisory). Off by default. */
        legibility: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            /** How the vision judge reaches Claude — same vocabulary as the
             *  art / audio review: `'claude-cli'` (subscription, no key),
             *  `'api'` (ANTHROPIC_API_KEY), `'auto'` (CLI when on PATH else
             *  the key). */
            judgeProvider: z.ZodDefault<z.ZodEnum<["auto", "api", "claude-cli"]>>;
            judgeModel: z.ZodDefault<z.ZodString>;
            claudeCliPath: z.ZodOptional<z.ZodString>;
            /** Frames sampled into the contact sheet. */
            frames: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            judgeModel: string;
            judgeProvider: "auto" | "api" | "claude-cli";
            frames: number;
            claudeCliPath?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            judgeModel?: string | undefined;
            judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
            claudeCliPath?: string | undefined;
            frames?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        legibility?: {
            enabled: boolean;
            judgeModel: string;
            judgeProvider: "auto" | "api" | "claude-cli";
            frames: number;
            claudeCliPath?: string | undefined;
        } | undefined;
    }, {
        enabled?: boolean | undefined;
        legibility?: {
            enabled?: boolean | undefined;
            judgeModel?: string | undefined;
            judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
            claudeCliPath?: string | undefined;
            frames?: number | undefined;
        } | undefined;
    }>>;
    /** Art-review (Verify) config. Optional + opt-in; when omitted,
     *  the pipeline's verify arm never runs. See
     *  `AssetReviewConfigSchema`. */
    review: z.ZodOptional<z.ZodObject<{
        /** Master switch. Default OFF — review is opt-in. */
        enabled: z.ZodDefault<z.ZodBoolean>;
        /** In-forge posture on a `fail` verdict:
         *    - `'flag'`   — record + warn, change nothing (default).
         *    - `'retry'`  — re-roll with a new seed up to
         *      `maxAttemptsPerSlot` (vendor nondeterminism).
         *    - `'retune'` — infer a bounded param delta (cfg / steps /
         *      model) from the judge's adherence diagnosis, apply +
         *      regenerate; fall back to a blind re-roll when no delta
         *      applies. Strict superset of `retry`. */
        failVerdictAction: z.ZodDefault<z.ZodEnum<["flag", "retry", "retune"]>>;
        /** Max generation attempts per slot the loop may make (incl.
         *  the first). Bounds the loop alongside the budget cap. */
        maxAttemptsPerSlot: z.ZodDefault<z.ZodNumber>;
        /** Vision model for the perceptual judge. Default
         *  `claude-sonnet-5` — the cost/quality sweet spot. */
        judgeModel: z.ZodDefault<z.ZodString>;
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
        judgeProvider: z.ZodDefault<z.ZodEnum<["auto", "api", "claude-cli"]>>;
        /** Path to the `claude` binary. Empty = resolve `claude` from
         *  PATH. Only used by the `claude-cli` provider. */
        claudeCliPath: z.ZodOptional<z.ZodString>;
        /** N-vote perceptual panel. The perceptual judge is a single,
         *  uncalibrated, non-deterministic LLM — for hero assets that gate
         *  is too thin to trust unattended. A panel runs `jurors`
         *  independent judges (each nudged onto a distinct failure-mode
         *  lens when `diverseLenses`), takes the majority verdict, and
         *  escalates to human review when they disagree past
         *  `escalateBelowAgreement`. `jurors: 1` (default) is the exact
         *  single-vote behavior — zero cost/behavior change until opted
         *  in. Never affects generated bytes (Verify-only). */
        panel: z.ZodDefault<z.ZodObject<{
            /** Independent jurors per perceptual review. 1 = single vote. */
            jurors: z.ZodDefault<z.ZodNumber>;
            /** Rotate each juror onto a distinct lens (silhouette / palette
             *  / style-fidelity / subject-adherence / overall) so they
             *  catch different failure modes instead of voting
             *  redundantly. Ignored when `jurors` is 1. */
            diverseLenses: z.ZodDefault<z.ZodBoolean>;
            /** Escalate to human review when the fraction of jurors
             *  agreeing with the majority verdict is BELOW this. 0.67 ⇒ a
             *  3-juror panel escalates on any 2-1 (or worse) split. Set to
             *  0 to never escalate on a split. */
            escalateBelowAgreement: z.ZodDefault<z.ZodNumber>;
            /** Also escalate a bare `concern` verdict (the usable-but-off
             *  band where automated judgment is weakest) to human review.
             *  Independent of the panel — applies to single-vote too. */
            escalateConcern: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            jurors: number;
            diverseLenses: boolean;
            escalateBelowAgreement: number;
            escalateConcern: boolean;
        }, {
            jurors?: number | undefined;
            diverseLenses?: boolean | undefined;
            escalateBelowAgreement?: number | undefined;
            escalateConcern?: boolean | undefined;
        }>>;
        /** Content-SAFETY output scan (distinct from art-adherence). The
         *  prompt gate (L1 + the proxy's L2) can't see what a vendor actually
         *  RENDERED, and the vendors' own output moderation is imperfect —
         *  so an opt-in vision pass over the generated image flags
         *  policy-violating OUTPUT (sexual / gore / hate-symbol / real-person
         *  likeness; CSAM is always the hardest fail). Advisory / flag-only —
         *  it records a `content-safety` criterion + escalates on a fail; it
         *  never mutates or deletes bytes (the operator decides). Reuses the
         *  same vision transport + `judgeProvider` as the perceptual judge. */
        safety: z.ZodDefault<z.ZodObject<{
            /** Master switch for the output safety scan. Default OFF. */
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
        }, {
            enabled?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        failVerdictAction: "flag" | "retry" | "retune";
        maxAttemptsPerSlot: number;
        judgeModel: string;
        judgeProvider: "auto" | "api" | "claude-cli";
        panel: {
            jurors: number;
            diverseLenses: boolean;
            escalateBelowAgreement: number;
            escalateConcern: boolean;
        };
        safety: {
            enabled: boolean;
        };
        claudeCliPath?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        failVerdictAction?: "flag" | "retry" | "retune" | undefined;
        maxAttemptsPerSlot?: number | undefined;
        judgeModel?: string | undefined;
        judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
        claudeCliPath?: string | undefined;
        panel?: {
            jurors?: number | undefined;
            diverseLenses?: boolean | undefined;
            escalateBelowAgreement?: number | undefined;
            escalateConcern?: boolean | undefined;
        } | undefined;
        safety?: {
            enabled?: boolean | undefined;
        } | undefined;
    }>>;
    /** Narrative-drift check (Maintain). When true, `pnpm forge`
     *  runs `detectAssetDrift` after generating — baseline-stamping
     *  freshly-grounded sidecars + WARNING on any image whose
     *  grounded narrative card OR the Art Bible has since changed.
     *  Warn-only; never blocks. Default OFF. */
    driftCheck: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    stylePrefix: string;
    budgetSoftUsd: number;
    budgetHardUsd: number;
    requireSpendAuthorization: boolean;
    bannedTerms: string[];
    driftCheck: boolean;
    civitai?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
    styleByKind?: {
        model?: string | undefined;
        image?: string | undefined;
    } | undefined;
    budgetLifetimeUsd?: number | undefined;
    defaultValidation?: {
        model?: {
            minVertices: number;
            maxVertices: number;
            minBones: number;
            requiredAnimations: string[];
        } | undefined;
        image?: {
            maxHeight: number;
            minWidth: number;
            maxWidth: number;
            minHeight: number;
            requireAlpha: boolean;
            maxTransparentFraction: number;
        } | undefined;
    } | undefined;
    loraCast?: Record<string, {
        urn: string;
        strength: number;
    }> | undefined;
    motionLibrary?: Record<string, {
        loop: boolean;
        source: {
            actionId: number;
            backend: "meshy-library";
        };
        intent: string;
    }> | undefined;
    motionKits?: Record<string, string[]> | undefined;
    motionReview?: {
        enabled: boolean;
        legibility?: {
            enabled: boolean;
            judgeModel: string;
            judgeProvider: "auto" | "api" | "claude-cli";
            frames: number;
            claudeCliPath?: string | undefined;
        } | undefined;
    } | undefined;
    review?: {
        enabled: boolean;
        failVerdictAction: "flag" | "retry" | "retune";
        maxAttemptsPerSlot: number;
        judgeModel: string;
        judgeProvider: "auto" | "api" | "claude-cli";
        panel: {
            jurors: number;
            diverseLenses: boolean;
            escalateBelowAgreement: number;
            escalateConcern: boolean;
        };
        safety: {
            enabled: boolean;
        };
        claudeCliPath?: string | undefined;
    } | undefined;
}, {
    civitai?: {
        steps?: number | undefined;
        height?: number | undefined;
        width?: number | undefined;
        model?: "turbo" | "base" | undefined;
        cfgScale?: number | undefined;
        loras?: Record<string, number> | undefined;
    } | undefined;
    stylePrefix?: string | undefined;
    styleByKind?: {
        model?: string | undefined;
        image?: string | undefined;
    } | undefined;
    budgetSoftUsd?: number | undefined;
    budgetHardUsd?: number | undefined;
    budgetLifetimeUsd?: number | undefined;
    requireSpendAuthorization?: boolean | undefined;
    defaultValidation?: {
        model?: {
            minVertices?: number | undefined;
            maxVertices?: number | undefined;
            minBones?: number | undefined;
            requiredAnimations?: string[] | undefined;
        } | undefined;
        image?: {
            maxHeight?: number | undefined;
            minWidth?: number | undefined;
            maxWidth?: number | undefined;
            minHeight?: number | undefined;
            requireAlpha?: boolean | undefined;
            maxTransparentFraction?: number | undefined;
        } | undefined;
    } | undefined;
    bannedTerms?: string[] | undefined;
    loraCast?: Record<string, {
        urn: string;
        strength?: number | undefined;
    }> | undefined;
    motionLibrary?: Record<string, {
        source: {
            actionId: number;
            backend: "meshy-library";
        };
        intent: string;
        loop?: boolean | undefined;
    }> | undefined;
    motionKits?: Record<string, string[]> | undefined;
    motionReview?: {
        enabled?: boolean | undefined;
        legibility?: {
            enabled?: boolean | undefined;
            judgeModel?: string | undefined;
            judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
            claudeCliPath?: string | undefined;
            frames?: number | undefined;
        } | undefined;
    } | undefined;
    review?: {
        enabled?: boolean | undefined;
        failVerdictAction?: "flag" | "retry" | "retune" | undefined;
        maxAttemptsPerSlot?: number | undefined;
        judgeModel?: string | undefined;
        judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
        claudeCliPath?: string | undefined;
        panel?: {
            jurors?: number | undefined;
            diverseLenses?: boolean | undefined;
            escalateBelowAgreement?: number | undefined;
            escalateConcern?: boolean | undefined;
        } | undefined;
        safety?: {
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    driftCheck?: boolean | undefined;
}>;
export type StyleConfig = z.infer<typeof StyleConfigSchema>;
/** Input variant — every default-bearing field is optional.
 *  Authors writing `apps/<game>/asset-gen.config.ts` annotate
 *  with this type so they can omit unset fields without
 *  TypeScript complaining about missing defaults. The runtime
 *  parses to `StyleConfig` (defaults filled in) before any
 *  consumer reads the values. */
export type StyleConfigInput = z.input<typeof StyleConfigSchema>;
export {};
//# sourceMappingURL=assetGen.d.ts.map