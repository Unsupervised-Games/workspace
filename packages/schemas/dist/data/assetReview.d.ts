import { z } from 'zod';
/** How a criterion arrives at its verdict:
 *    - `gate`       — deterministic pixel measurement (dimensions,
 *      alpha, tiling). Pure + cheap.
 *    - `perceptual` — the Claude-vision judge scoring prompt +
 *      Art Bible adherence. The expensive one. */
export declare const AssetReviewShapeSchema: z.ZodEnum<["gate", "perceptual"]>;
export type AssetReviewShape = z.infer<typeof AssetReviewShapeSchema>;
export declare const AssetReviewOutcomeSchema: z.ZodEnum<["pass", "concern", "fail", "error", "not-applicable"]>;
export type AssetReviewOutcome = z.infer<typeof AssetReviewOutcomeSchema>;
/** The perceptual judge's STRUCTURED read of an image's adherence,
 *  emitted alongside free-text issues. Three axes, each mapping
 *  onto a future param-inference lever (cfg / steps / LoRA
 *  strength / reference). Optional end-to-end: absent ⇒ no param
 *  inference for that image. */
export declare const ArtStyleMatchSchema: z.ZodEnum<["off", "partial", "on"]>;
export declare const ArtPaletteMatchSchema: z.ZodEnum<["off", "partial", "on"]>;
export declare const ArtSubjectClaritySchema: z.ZodEnum<["unclear", "ok", "clear"]>;
export declare const ArtAdherenceDiagnosisSchema: z.ZodObject<{
    /** Does the rendering style match the Art Bible (line, shading,
     *  form)? */
    styleMatch: z.ZodEnum<["off", "partial", "on"]>;
    /** Do the colors sit within the Bible palette? */
    paletteMatch: z.ZodEnum<["off", "partial", "on"]>;
    /** Is the subject legible + well-composed for its role
     *  (single centered sprite, clean silhouette)? */
    subjectClarity: z.ZodEnum<["unclear", "ok", "clear"]>;
}, "strip", z.ZodTypeAny, {
    styleMatch: "partial" | "off" | "on";
    paletteMatch: "partial" | "off" | "on";
    subjectClarity: "ok" | "unclear" | "clear";
}, {
    styleMatch: "partial" | "off" | "on";
    paletteMatch: "partial" | "off" | "on";
    subjectClarity: "ok" | "unclear" | "clear";
}>;
export type ArtAdherenceDiagnosis = z.infer<typeof ArtAdherenceDiagnosisSchema>;
export declare const AssetReviewVerdictSchema: z.ZodEnum<["pass", "concern", "fail"]>;
export type AssetReviewVerdict = z.infer<typeof AssetReviewVerdictSchema>;
/** One juror's vote in an N-vote perceptual panel. The `lens` names
 *  the failure-mode the juror was told to focus on (silhouette /
 *  palette / style-fidelity / …) so a split can be read for WHICH
 *  axis the panel disagreed on, not just THAT it disagreed. */
export declare const AssetPanelVoteSchema: z.ZodObject<{
    lens: z.ZodString;
    verdict: z.ZodEnum<["pass", "concern", "fail"]>;
    /** 0..100 (the juror's raw score). */
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lens: string;
    verdict: "pass" | "concern" | "fail";
    score: number;
}, {
    lens: string;
    verdict: "pass" | "concern" | "fail";
    score: number;
}>;
export type AssetPanelVote = z.infer<typeof AssetPanelVoteSchema>;
/** The per-juror breakdown behind an aggregated perceptual verdict.
 *  Attached to the perceptual `AssetReviewResult` when the judge was
 *  a panel (jurors > 1); absent for a single-vote judge. */
export declare const AssetPanelBreakdownSchema: z.ZodObject<{
    jurorCount: z.ZodNumber;
    votes: z.ZodArray<z.ZodObject<{
        lens: z.ZodString;
        verdict: z.ZodEnum<["pass", "concern", "fail"]>;
        /** 0..100 (the juror's raw score). */
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lens: string;
        verdict: "pass" | "concern" | "fail";
        score: number;
    }, {
        lens: string;
        verdict: "pass" | "concern" | "fail";
        score: number;
    }>, "many">;
    /** Fraction of jurors whose verdict matched the aggregated
     *  (majority) verdict — 1 = unanimous, → 1/jurorCount as the panel
     *  splits. The escalation signal. */
    agreement: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    jurorCount: number;
    votes: {
        lens: string;
        verdict: "pass" | "concern" | "fail";
        score: number;
    }[];
    agreement: number;
}, {
    jurorCount: number;
    votes: {
        lens: string;
        verdict: "pass" | "concern" | "fail";
        score: number;
    }[];
    agreement: number;
}>;
export type AssetPanelBreakdown = z.infer<typeof AssetPanelBreakdownSchema>;
/** Why a review was flagged for a human's eyes rather than trusted
 *  unattended. The confidence-gated escalation signal: an
 *  uncalibrated LLM's `pass` is not a shippable approval, and a split
 *  panel or a bare `concern` is exactly where an automated gate is
 *  least trustworthy. Null ⇒ no human needed. */
export declare const AssetEscalationReasonSchema: z.ZodEnum<["panel-split", "concern-verdict", "judge-error"]>;
export type AssetEscalationReason = z.infer<typeof AssetEscalationReasonSchema>;
export declare const AssetEscalationSchema: z.ZodObject<{
    reason: z.ZodEnum<["panel-split", "concern-verdict", "judge-error"]>;
    /** Human-readable one-liner (which lenses split, which axis, etc.). */
    detail: z.ZodString;
    /** Panel agreement fraction when the escalation came from a panel;
     *  null for non-panel reasons (concern / error). */
    agreement: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    reason: "panel-split" | "concern-verdict" | "judge-error";
    agreement: number | null;
    detail: string;
}, {
    reason: "panel-split" | "concern-verdict" | "judge-error";
    agreement: number | null;
    detail: string;
}>;
export type AssetEscalation = z.infer<typeof AssetEscalationSchema>;
/** One criterion's verdict on one generated image. FLAT. */
export declare const AssetReviewResultSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    slot: z.ZodString;
    hash: z.ZodString;
    criterionId: z.ZodString;
    reviewShape: z.ZodEnum<["gate", "perceptual"]>;
    outcome: z.ZodEnum<["pass", "concern", "fail", "error", "not-applicable"]>;
    /** Normalized 0..1 (judge score/100); null for pure gates. */
    score: z.ZodNullable<z.ZodNumber>;
    evidence: z.ZodString;
    measurement: z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodNull]>;
    costUsd: z.ZodNumber;
    durationMs: z.ZodNumber;
    error: z.ZodNullable<z.ZodString>;
    /** The perceptual judge's structured adherence read, when this
     *  criterion produced one (perceptual only). */
    adherence: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        /** Does the rendering style match the Art Bible (line, shading,
         *  form)? */
        styleMatch: z.ZodEnum<["off", "partial", "on"]>;
        /** Do the colors sit within the Bible palette? */
        paletteMatch: z.ZodEnum<["off", "partial", "on"]>;
        /** Is the subject legible + well-composed for its role
         *  (single centered sprite, clean silhouette)? */
        subjectClarity: z.ZodEnum<["unclear", "ok", "clear"]>;
    }, "strip", z.ZodTypeAny, {
        styleMatch: "partial" | "off" | "on";
        paletteMatch: "partial" | "off" | "on";
        subjectClarity: "ok" | "unclear" | "clear";
    }, {
        styleMatch: "partial" | "off" | "on";
        paletteMatch: "partial" | "off" | "on";
        subjectClarity: "ok" | "unclear" | "clear";
    }>>>;
    /** The per-juror breakdown when the perceptual judge was an N-vote
     *  panel (perceptual only; absent for a single-vote judge). */
    panel: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        jurorCount: z.ZodNumber;
        votes: z.ZodArray<z.ZodObject<{
            lens: z.ZodString;
            verdict: z.ZodEnum<["pass", "concern", "fail"]>;
            /** 0..100 (the juror's raw score). */
            score: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }, {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }>, "many">;
        /** Fraction of jurors whose verdict matched the aggregated
         *  (majority) verdict — 1 = unanimous, → 1/jurorCount as the panel
         *  splits. The escalation signal. */
        agreement: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        jurorCount: number;
        votes: {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }[];
        agreement: number;
    }, {
        jurorCount: number;
        votes: {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }[];
        agreement: number;
    }>>>;
    generatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    durationMs: number;
    hash: string;
    costUsd: number;
    error: string | null;
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    score: number | null;
    criterionId: string;
    reviewShape: "perceptual" | "gate";
    outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
    evidence: string;
    measurement: string | number | boolean | null;
    panel?: {
        jurorCount: number;
        votes: {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }[];
        agreement: number;
    } | null | undefined;
    adherence?: {
        styleMatch: "partial" | "off" | "on";
        paletteMatch: "partial" | "off" | "on";
        subjectClarity: "ok" | "unclear" | "clear";
    } | null | undefined;
}, {
    durationMs: number;
    hash: string;
    costUsd: number;
    error: string | null;
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    score: number | null;
    criterionId: string;
    reviewShape: "perceptual" | "gate";
    outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
    evidence: string;
    measurement: string | number | boolean | null;
    panel?: {
        jurorCount: number;
        votes: {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }[];
        agreement: number;
    } | null | undefined;
    adherence?: {
        styleMatch: "partial" | "off" | "on";
        paletteMatch: "partial" | "off" | "on";
        subjectClarity: "ok" | "unclear" | "clear";
    } | null | undefined;
}>;
export type AssetReviewResult = z.infer<typeof AssetReviewResultSchema>;
/** Every criterion's results for one image + the rolled-up
 *  verdict. Rollup: `fail` if any criterion is `fail`/`error`;
 *  `concern` if any is `concern` (and none fail); else `pass`.
 *  `not-applicable` ignored. */
export declare const AssetReviewSummarySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    slot: z.ZodString;
    role: z.ZodEnum<["sprite", "texture", "ui", "concept", "model"]>;
    hash: z.ZodString;
    verdict: z.ZodEnum<["pass", "concern", "fail"]>;
    results: z.ZodArray<z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        slot: z.ZodString;
        hash: z.ZodString;
        criterionId: z.ZodString;
        reviewShape: z.ZodEnum<["gate", "perceptual"]>;
        outcome: z.ZodEnum<["pass", "concern", "fail", "error", "not-applicable"]>;
        /** Normalized 0..1 (judge score/100); null for pure gates. */
        score: z.ZodNullable<z.ZodNumber>;
        evidence: z.ZodString;
        measurement: z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodNull]>;
        costUsd: z.ZodNumber;
        durationMs: z.ZodNumber;
        error: z.ZodNullable<z.ZodString>;
        /** The perceptual judge's structured adherence read, when this
         *  criterion produced one (perceptual only). */
        adherence: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            /** Does the rendering style match the Art Bible (line, shading,
             *  form)? */
            styleMatch: z.ZodEnum<["off", "partial", "on"]>;
            /** Do the colors sit within the Bible palette? */
            paletteMatch: z.ZodEnum<["off", "partial", "on"]>;
            /** Is the subject legible + well-composed for its role
             *  (single centered sprite, clean silhouette)? */
            subjectClarity: z.ZodEnum<["unclear", "ok", "clear"]>;
        }, "strip", z.ZodTypeAny, {
            styleMatch: "partial" | "off" | "on";
            paletteMatch: "partial" | "off" | "on";
            subjectClarity: "ok" | "unclear" | "clear";
        }, {
            styleMatch: "partial" | "off" | "on";
            paletteMatch: "partial" | "off" | "on";
            subjectClarity: "ok" | "unclear" | "clear";
        }>>>;
        /** The per-juror breakdown when the perceptual judge was an N-vote
         *  panel (perceptual only; absent for a single-vote judge). */
        panel: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            jurorCount: z.ZodNumber;
            votes: z.ZodArray<z.ZodObject<{
                lens: z.ZodString;
                verdict: z.ZodEnum<["pass", "concern", "fail"]>;
                /** 0..100 (the juror's raw score). */
                score: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }, {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }>, "many">;
            /** Fraction of jurors whose verdict matched the aggregated
             *  (majority) verdict — 1 = unanimous, → 1/jurorCount as the panel
             *  splits. The escalation signal. */
            agreement: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        }, {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        }>>>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        durationMs: number;
        hash: string;
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        adherence?: {
            styleMatch: "partial" | "off" | "on";
            paletteMatch: "partial" | "off" | "on";
            subjectClarity: "ok" | "unclear" | "clear";
        } | null | undefined;
    }, {
        durationMs: number;
        hash: string;
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        adherence?: {
            styleMatch: "partial" | "off" | "on";
            paletteMatch: "partial" | "off" | "on";
            subjectClarity: "ok" | "unclear" | "clear";
        } | null | undefined;
    }>, "many">;
    totalCostUsd: z.ZodNumber;
    /** Set when this review should not be trusted unattended — a split
     *  panel, a bare `concern`, or a degraded judge. The operator's
     *  approval queue reads this; null ⇒ safe to trust the verdict.
     *  Optional for backward-compat with pre-panel review artifacts. */
    escalation: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        reason: z.ZodEnum<["panel-split", "concern-verdict", "judge-error"]>;
        /** Human-readable one-liner (which lenses split, which axis, etc.). */
        detail: z.ZodString;
        /** Panel agreement fraction when the escalation came from a panel;
         *  null for non-panel reasons (concern / error). */
        agreement: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        reason: "panel-split" | "concern-verdict" | "judge-error";
        agreement: number | null;
        detail: string;
    }, {
        reason: "panel-split" | "concern-verdict" | "judge-error";
        agreement: number | null;
        detail: string;
    }>>>;
    generatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    hash: string;
    role: "ui" | "model" | "sprite" | "texture" | "concept";
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    verdict: "pass" | "concern" | "fail";
    results: {
        durationMs: number;
        hash: string;
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        adherence?: {
            styleMatch: "partial" | "off" | "on";
            paletteMatch: "partial" | "off" | "on";
            subjectClarity: "ok" | "unclear" | "clear";
        } | null | undefined;
    }[];
    totalCostUsd: number;
    escalation?: {
        reason: "panel-split" | "concern-verdict" | "judge-error";
        agreement: number | null;
        detail: string;
    } | null | undefined;
}, {
    hash: string;
    role: "ui" | "model" | "sprite" | "texture" | "concept";
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    verdict: "pass" | "concern" | "fail";
    results: {
        durationMs: number;
        hash: string;
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        adherence?: {
            styleMatch: "partial" | "off" | "on";
            paletteMatch: "partial" | "off" | "on";
            subjectClarity: "ok" | "unclear" | "clear";
        } | null | undefined;
    }[];
    totalCostUsd: number;
    escalation?: {
        reason: "panel-split" | "concern-verdict" | "judge-error";
        agreement: number | null;
        detail: string;
    } | null | undefined;
}>;
export type AssetReviewSummary = z.infer<typeof AssetReviewSummarySchema>;
/** One human-labeled sample in the calibration manifest. The `slot`
 *  points at a generated asset (same key as review artifacts); the
 *  `humanVerdict` is the ground truth the judge is measured against. */
export declare const AssetCalibrationSampleSchema: z.ZodObject<{
    slot: z.ZodString;
    humanVerdict: z.ZodEnum<["pass", "concern", "fail"]>;
    /** Optional labeler rationale (surfaced in the disagreement queue). */
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    slot: string;
    humanVerdict: "pass" | "concern" | "fail";
    note?: string | undefined;
}, {
    slot: string;
    humanVerdict: "pass" | "concern" | "fail";
    note?: string | undefined;
}>;
export type AssetCalibrationSample = z.infer<typeof AssetCalibrationSampleSchema>;
/** The author-maintained ground-truth set the `calibrate` command
 *  measures the judge against. Lives at `.asset-gen-calibration.json`.
 *  Hand-label ~30-50 representative assets across pass / concern /
 *  fail, then `asset-gen calibrate` reports the judge's agreement +
 *  kappa + false-pass/fail rates so "the judge said pass" carries a
 *  measured reliability instead of blind trust. */
export declare const AssetCalibrationManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    samples: z.ZodArray<z.ZodObject<{
        slot: z.ZodString;
        humanVerdict: z.ZodEnum<["pass", "concern", "fail"]>;
        /** Optional labeler rationale (surfaced in the disagreement queue). */
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        slot: string;
        humanVerdict: "pass" | "concern" | "fail";
        note?: string | undefined;
    }, {
        slot: string;
        humanVerdict: "pass" | "concern" | "fail";
        note?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    samples: {
        slot: string;
        humanVerdict: "pass" | "concern" | "fail";
        note?: string | undefined;
    }[];
}, {
    schemaVersion: 1;
    samples: {
        slot: string;
        humanVerdict: "pass" | "concern" | "fail";
        note?: string | undefined;
    }[];
}>;
export type AssetCalibrationManifest = z.infer<typeof AssetCalibrationManifestSchema>;
//# sourceMappingURL=assetReview.d.ts.map