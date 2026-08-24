// Asset-review result shapes — the Verify arm for the asset-gen
// (2D image) pipeline. Mirrors the FLAT, versioned shape of the
// audio L3 `AudioReviewResult` so both pipelines' verify arms read
// alike. The producer lives in `@unsupervised/asset-gen` (`review/`); this
// file is the data contract the producer + consumers (CLI, workbench)
// share.
//
// (These are named `AssetReview*` — asset-generic — deliberately:
// they are the intended shared shapes for the future `@unsupervised/ai-
// review` extraction, at which point audio's `AudioReview*` folds
// onto them.)

import { z } from 'zod';
import { MeasurementValueSchema } from '../research/harnessResult.js';

/** How a criterion arrives at its verdict:
 *    - `gate`       — deterministic pixel measurement (dimensions,
 *      alpha, tiling). Pure + cheap.
 *    - `perceptual` — the Claude-vision judge scoring prompt +
 *      Art Bible adherence. The expensive one. */
export const AssetReviewShapeSchema = z.enum(['gate', 'perceptual']);
export type AssetReviewShape = z.infer<typeof AssetReviewShapeSchema>;

export const AssetReviewOutcomeSchema = z.enum([
  'pass',
  'concern',
  'fail',
  'error',
  'not-applicable',
]);
export type AssetReviewOutcome = z.infer<typeof AssetReviewOutcomeSchema>;

/** The perceptual judge's STRUCTURED read of an image's adherence,
 *  emitted alongside free-text issues. Three axes, each mapping
 *  onto a future param-inference lever (cfg / steps / LoRA
 *  strength / reference). Optional end-to-end: absent ⇒ no param
 *  inference for that image. */
export const ArtStyleMatchSchema = z.enum(['off', 'partial', 'on']);
export const ArtPaletteMatchSchema = z.enum(['off', 'partial', 'on']);
export const ArtSubjectClaritySchema = z.enum(['unclear', 'ok', 'clear']);

export const ArtAdherenceDiagnosisSchema = z.object({
  /** Does the rendering style match the Art Bible (line, shading,
   *  form)? */
  styleMatch: ArtStyleMatchSchema,
  /** Do the colors sit within the Bible palette? */
  paletteMatch: ArtPaletteMatchSchema,
  /** Is the subject legible + well-composed for its role
   *  (single centered sprite, clean silhouette)? */
  subjectClarity: ArtSubjectClaritySchema,
});
export type ArtAdherenceDiagnosis = z.infer<
  typeof ArtAdherenceDiagnosisSchema
>;

export const AssetReviewVerdictSchema = z.enum(['pass', 'concern', 'fail']);
export type AssetReviewVerdict = z.infer<typeof AssetReviewVerdictSchema>;

/** One juror's vote in an N-vote perceptual panel. The `lens` names
 *  the failure-mode the juror was told to focus on (silhouette /
 *  palette / style-fidelity / …) so a split can be read for WHICH
 *  axis the panel disagreed on, not just THAT it disagreed. */
export const AssetPanelVoteSchema = z.object({
  lens: z.string(),
  verdict: AssetReviewVerdictSchema,
  /** 0..100 (the juror's raw score). */
  score: z.number().min(0).max(100),
});
export type AssetPanelVote = z.infer<typeof AssetPanelVoteSchema>;

/** The per-juror breakdown behind an aggregated perceptual verdict.
 *  Attached to the perceptual `AssetReviewResult` when the judge was
 *  a panel (jurors > 1); absent for a single-vote judge. */
export const AssetPanelBreakdownSchema = z.object({
  jurorCount: z.number().int().positive(),
  votes: z.array(AssetPanelVoteSchema),
  /** Fraction of jurors whose verdict matched the aggregated
   *  (majority) verdict — 1 = unanimous, → 1/jurorCount as the panel
   *  splits. The escalation signal. */
  agreement: z.number().min(0).max(1),
});
export type AssetPanelBreakdown = z.infer<typeof AssetPanelBreakdownSchema>;

/** Why a review was flagged for a human's eyes rather than trusted
 *  unattended. The confidence-gated escalation signal: an
 *  uncalibrated LLM's `pass` is not a shippable approval, and a split
 *  panel or a bare `concern` is exactly where an automated gate is
 *  least trustworthy. Null ⇒ no human needed. */
export const AssetEscalationReasonSchema = z.enum([
  /** The panel jurors disagreed past the configured agreement floor. */
  'panel-split',
  /** The aggregated verdict was `concern` — usable-but-off, the band
   *  where automated judgment is weakest. */
  'concern-verdict',
  /** The perceptual judge threw / degraded (no trustworthy verdict). */
  'judge-error',
]);
export type AssetEscalationReason = z.infer<typeof AssetEscalationReasonSchema>;

export const AssetEscalationSchema = z.object({
  reason: AssetEscalationReasonSchema,
  /** Human-readable one-liner (which lenses split, which axis, etc.). */
  detail: z.string(),
  /** Panel agreement fraction when the escalation came from a panel;
   *  null for non-panel reasons (concern / error). */
  agreement: z.number().min(0).max(1).nullable(),
});
export type AssetEscalation = z.infer<typeof AssetEscalationSchema>;

/** One criterion's verdict on one generated image. FLAT. */
export const AssetReviewResultSchema = z.object({
  schemaVersion: z.literal(1),
  slot: z.string(),
  hash: z.string(),
  criterionId: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  reviewShape: AssetReviewShapeSchema,
  outcome: AssetReviewOutcomeSchema,
  /** Normalized 0..1 (judge score/100); null for pure gates. */
  score: z.number().min(0).max(1).nullable(),
  evidence: z.string(),
  measurement: MeasurementValueSchema,
  costUsd: z.number().nonnegative(),
  durationMs: z.number().nonnegative(),
  error: z.string().nullable(),
  /** The perceptual judge's structured adherence read, when this
   *  criterion produced one (perceptual only). */
  adherence: ArtAdherenceDiagnosisSchema.nullable().optional(),
  /** The per-juror breakdown when the perceptual judge was an N-vote
   *  panel (perceptual only; absent for a single-vote judge). */
  panel: AssetPanelBreakdownSchema.nullable().optional(),
  generatedAt: z.string(),
});
export type AssetReviewResult = z.infer<typeof AssetReviewResultSchema>;

/** Every criterion's results for one image + the rolled-up
 *  verdict. Rollup: `fail` if any criterion is `fail`/`error`;
 *  `concern` if any is `concern` (and none fail); else `pass`.
 *  `not-applicable` ignored. */
export const AssetReviewSummarySchema = z.object({
  schemaVersion: z.literal(1),
  slot: z.string(),
  role: z.enum(['sprite', 'texture', 'ui', 'concept', 'model']),
  hash: z.string(),
  verdict: AssetReviewVerdictSchema,
  results: z.array(AssetReviewResultSchema),
  totalCostUsd: z.number().nonnegative(),
  /** Set when this review should not be trusted unattended — a split
   *  panel, a bare `concern`, or a degraded judge. The operator's
   *  approval queue reads this; null ⇒ safe to trust the verdict.
   *  Optional for backward-compat with pre-panel review artifacts. */
  escalation: AssetEscalationSchema.nullable().optional(),
  generatedAt: z.string(),
});
export type AssetReviewSummary = z.infer<typeof AssetReviewSummarySchema>;

// ---------------------------------------------------------------------------
// Judge calibration — the human-labeled ground-truth manifest
// ---------------------------------------------------------------------------

/** One human-labeled sample in the calibration manifest. The `slot`
 *  points at a generated asset (same key as review artifacts); the
 *  `humanVerdict` is the ground truth the judge is measured against. */
export const AssetCalibrationSampleSchema = z.object({
  slot: z.string().min(1),
  humanVerdict: AssetReviewVerdictSchema,
  /** Optional labeler rationale (surfaced in the disagreement queue). */
  note: z.string().optional(),
});
export type AssetCalibrationSample = z.infer<
  typeof AssetCalibrationSampleSchema
>;

/** The author-maintained ground-truth set the `calibrate` command
 *  measures the judge against. Lives at `.asset-gen-calibration.json`.
 *  Hand-label ~30-50 representative assets across pass / concern /
 *  fail, then `asset-gen calibrate` reports the judge's agreement +
 *  kappa + false-pass/fail rates so "the judge said pass" carries a
 *  measured reliability instead of blind trust. */
export const AssetCalibrationManifestSchema = z.object({
  schemaVersion: z.literal(1),
  samples: z.array(AssetCalibrationSampleSchema),
});
export type AssetCalibrationManifest = z.infer<
  typeof AssetCalibrationManifestSchema
>;
