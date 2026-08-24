// L3 audio-review result shapes — the verification arm for the
// audio-gen pipeline. Mirrors the FLAT, versioned shape of
// `HarnessResultSchema` (research/harnessResult.ts) so the
// audio verifier reads like the assertion harness: a per-
// criterion result + a per-take summary that rolls the criteria
// up into one verdict.
//
// Two levels:
//   1. AudioReviewResult  — one criterion's verdict on one take
//      (flat, like HarnessResult).
//   2. AudioReviewSummary — every criterion's results for a
//      single take + the rolled-up verdict (like
//      HarnessRunSummary).
//
// The runtime that produces these lives in `@unsupervised/audio-gen`
// (the `review/` module); this file is the data contract both
// the producer (forge / CLI) and future consumers (workbench's
// Audio pane) share.
import { z } from 'zod';
import { MeasurementValueSchema } from '../research/harnessResult.js';
/** How a criterion arrives at its verdict. Parallels the
 *  assertion harness's `AssertionTestShape`
 *  (structural / behavioral / perceptual):
 *    - `gate`          — deterministic acoustic measurement
 *      (loudness / silence / duration). Pure + cheap.
 *    - `transcription` — STT round-trip → word-error-rate
 *      against the sidecar's `text`. Voice only.
 *    - `perceptual`    — waveform + LLM judge against the
 *      prompt intent (Phase 2). The expensive one. */
export const AudioReviewShapeSchema = z.enum([
    'gate',
    'transcription',
    'perceptual',
]);
/** Per-criterion outcome. Mirrors the harness's outcome enum
 *  adapted for audio's three-tier verdict:
 *    - `pass`           — criterion satisfied.
 *    - `concern`        — borderline; surfaced + tolerated, not
 *      a hard failure (the audio analog of `not-implemented`
 *      being tolerated by the harness rollup).
 *    - `fail`           — criterion violated.
 *    - `error`          — the criterion impl threw.
 *    - `not-applicable` — criterion doesn't apply to this kind
 *      (e.g. `transcription` on music) or couldn't run for a
 *      benign reason (STT key absent). Ignored by the rollup. */
export const AudioReviewOutcomeSchema = z.enum([
    'pass',
    'concern',
    'fail',
    'error',
    'not-applicable',
]);
// ---------------------------------------------------------------------------
// Delivery diagnosis (Part C — param inference)
// ---------------------------------------------------------------------------
/** The perceptual judge's STRUCTURED read of a take's delivery,
 *  emitted alongside the free-text `issues`. Three axes, each
 *  mapping onto exactly one tunable vendor knob, so a pure,
 *  deterministic function (`inferParamAdjustment` in
 *  `@unsupervised/audio-gen`) can turn the diagnosis into a bounded
 *  param delta. Anything the judge flags that DOESN'T reduce to
 *  these axes (wrong words, wrong pace, vocal-in-instrumental)
 *  stays in `issues` and is, by construction, not a param
 *  problem — the inference function returns null and the loop
 *  escalates to a text / prompt rewrite (the skill's job).
 *
 *  OPTIONAL end-to-end: the judge may omit it, legacy artifacts
 *  lack it, and music never carries it. Absent ⇒ no param
 *  inference for that take (degrade, don't error). */
export const DeliveryExpressivenessSchema = z.enum([
    'flat', // under-delivered — needs more range / character
    'balanced',
    'overacted', // over-styled — needs reining in toward composure
]);
export const DeliveryConsistencySchema = z.enum([
    'unstable', // warble / artifacts — needs more stability
    'balanced',
    'robotic', // monotone / lifeless — needs loosening
]);
export const DeliveryCharacterMatchSchema = z.enum([
    'off', // timbre drifts from the intended character
    'on',
]);
export const DeliveryDiagnosisSchema = z.object({
    expressiveness: DeliveryExpressivenessSchema,
    consistency: DeliveryConsistencySchema,
    /** Voice only — SFX has no character to match; omitted for
     *  SFX diagnoses. */
    characterMatch: DeliveryCharacterMatchSchema.optional(),
});
/** One juror's vote in an N-vote perceptual panel. The `lens` names
 *  the delivery axis the juror focused on (emotion / clarity / pacing
 *  / naturalness), so a split reads for WHICH axis disagreed. */
export const AudioPanelVoteSchema = z.object({
    lens: z.string(),
    verdict: z.enum(['pass', 'concern', 'fail']),
    /** 0..100 raw score. */
    score: z.number().min(0).max(100),
});
/** The per-juror breakdown behind an aggregated perceptual verdict —
 *  attached to the `delivery-intent` result when the judge was an
 *  N-vote panel (jurors > 1); absent for a single-vote judge. Drives
 *  `panel-split` escalation. */
export const AudioPanelBreakdownSchema = z.object({
    jurorCount: z.number().int().positive(),
    votes: z.array(AudioPanelVoteSchema),
    /** Fraction of jurors matching the aggregated verdict — 1 =
     *  unanimous, → 1/jurorCount as the panel splits. */
    agreement: z.number().min(0).max(1),
});
/** One criterion's verdict on one take. FLAT — no nested
 *  verdict/score/artifacts objects, matching `HarnessResult`. */
export const AudioReviewResultSchema = z.object({
    schemaVersion: z.literal(1),
    /** Sidecar-relative slot (`voice/sora-death-cry`). */
    slot: z.string(),
    /** Which take was judged (the kept take's cache hash). */
    takeHash: z.string(),
    /** Criterion id — stable kebab-case, like an assertion id. */
    criterionId: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    reviewShape: AudioReviewShapeSchema,
    outcome: AudioReviewOutcomeSchema,
    /** Normalized 0..1 quality (WER → `1 - wer`; judge → score/100).
     *  Null for pure gates that report a raw measurement instead. */
    score: z.number().min(0).max(1).nullable(),
    /** Operator-facing rationale — the judge's prose, or the
     *  gate's measured numbers. */
    evidence: z.string(),
    /** Raw measured value the outcome derived from (WER, LUFS,
     *  max-volume dB, duration seconds). Null when nothing was
     *  measured. */
    measurement: MeasurementValueSchema,
    /** Which byte surface was scored. `public` = post-processed
     *  (shipped) bytes — the default + the locked project
     *  decision; `cache` = raw vendor bytes. */
    bytesJudged: z.enum(['public', 'cache']),
    /** STT / judge spend attributed to this criterion (USD). 0
     *  for pure gates. */
    costUsd: z.number().nonnegative(),
    durationMs: z.number().nonnegative(),
    /** Set when `outcome` is `error`; null otherwise. */
    error: z.string().nullable(),
    /** The perceptual judge's STRUCTURED delivery read (Part C),
     *  when this criterion produced one (`delivery-intent` on
     *  voice / SFX). Carried onto the result so the `retune` loop
     *  can feed it to `inferParamAdjustment` without re-invoking
     *  the judge. Null for gates, transcription, music, and any
     *  judge that didn't emit it. */
    delivery: DeliveryDiagnosisSchema.nullable().optional(),
    /** The per-juror breakdown when the perceptual judge was an N-vote
     *  panel (`delivery-intent` only; absent for a single-vote judge).
     *  Read by `reviewSidecar` for `panel-split` escalation. */
    panel: AudioPanelBreakdownSchema.nullable().optional(),
    generatedAt: z.string(),
});
/** Rolled-up verdict for a take. */
export const AudioReviewVerdictSchema = z.enum(['pass', 'concern', 'fail']);
/** Why a review was flagged for a human's eyes rather than trusted
 *  unattended (the confidence-gated escalation — matches asset-gen's
 *  reasons; `panel-split` reserved for when the N-vote panel lands). */
export const AudioEscalationReasonSchema = z.enum([
    'panel-split',
    'concern-verdict',
    'judge-error',
]);
export const AudioEscalationSchema = z.object({
    reason: AudioEscalationReasonSchema,
    detail: z.string(),
    /** Panel agreement fraction for a `panel-split`; null otherwise. */
    agreement: z.number().min(0).max(1).nullable(),
});
/** Every criterion's results for one take + the rolled-up
 *  verdict. Parallels `HarnessRunSummary`.
 *
 *  ROLLUP CONTRACT (mirrors `harnessAllPassed`): `fail` if any
 *  criterion is `fail`/`error`; `concern` if any is `concern`
 *  (and none fail); else `pass`. `not-applicable` is ignored. */
export const AudioReviewSummarySchema = z.object({
    schemaVersion: z.literal(1),
    slot: z.string(),
    kind: z.enum(['voice', 'sfx', 'music']),
    takeHash: z.string(),
    /** The kept take's input fingerprint — consumers detect a
     *  stale review by comparing this to the sidecar's current
     *  kept-take `inputHash`. */
    inputHash: z.string(),
    verdict: AudioReviewVerdictSchema,
    results: z.array(AudioReviewResultSchema),
    totalCostUsd: z.number().nonnegative(),
    /** Set when this review should not be trusted unattended — a bare
     *  `concern` or a degraded judge (a split panel once the N-vote
     *  panel lands). The approval queue's `needs-review` state reads
     *  this; null ⇒ safe to trust. Optional for pre-escalation
     *  artifacts. */
    escalation: AudioEscalationSchema.nullable().optional(),
    generatedAt: z.string(),
});
// ---------------------------------------------------------------------------
// Judge calibration — the human-labeled ground-truth manifest
// ---------------------------------------------------------------------------
/** One human-labeled sample in the audio calibration manifest. `slot`
 *  is the `<kind>/<slot>` id; `humanVerdict` is the ground truth the
 *  L3 review is measured against. */
export const AudioCalibrationSampleSchema = z.object({
    slot: z.string().min(1),
    humanVerdict: AudioReviewVerdictSchema,
    note: z.string().optional(),
});
/** The author-maintained ground-truth set the `calibrate` command
 *  measures the L3 review against. Lives at
 *  `.audio-gen-calibration.json`. */
export const AudioCalibrationManifestSchema = z.object({
    schemaVersion: z.literal(1),
    samples: z.array(AudioCalibrationSampleSchema),
});
//# sourceMappingURL=audioReview.js.map