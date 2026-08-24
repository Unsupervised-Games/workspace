import { z } from 'zod';
/** How a criterion arrives at its verdict. Parallels the
 *  assertion harness's `AssertionTestShape`
 *  (structural / behavioral / perceptual):
 *    - `gate`          — deterministic acoustic measurement
 *      (loudness / silence / duration). Pure + cheap.
 *    - `transcription` — STT round-trip → word-error-rate
 *      against the sidecar's `text`. Voice only.
 *    - `perceptual`    — waveform + LLM judge against the
 *      prompt intent (Phase 2). The expensive one. */
export declare const AudioReviewShapeSchema: z.ZodEnum<["gate", "transcription", "perceptual"]>;
export type AudioReviewShape = z.infer<typeof AudioReviewShapeSchema>;
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
export declare const AudioReviewOutcomeSchema: z.ZodEnum<["pass", "concern", "fail", "error", "not-applicable"]>;
export type AudioReviewOutcome = z.infer<typeof AudioReviewOutcomeSchema>;
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
export declare const DeliveryExpressivenessSchema: z.ZodEnum<["flat", "balanced", "overacted"]>;
export type DeliveryExpressiveness = z.infer<typeof DeliveryExpressivenessSchema>;
export declare const DeliveryConsistencySchema: z.ZodEnum<["unstable", "balanced", "robotic"]>;
export type DeliveryConsistency = z.infer<typeof DeliveryConsistencySchema>;
export declare const DeliveryCharacterMatchSchema: z.ZodEnum<["off", "on"]>;
export type DeliveryCharacterMatch = z.infer<typeof DeliveryCharacterMatchSchema>;
export declare const DeliveryDiagnosisSchema: z.ZodObject<{
    expressiveness: z.ZodEnum<["flat", "balanced", "overacted"]>;
    consistency: z.ZodEnum<["unstable", "balanced", "robotic"]>;
    /** Voice only — SFX has no character to match; omitted for
     *  SFX diagnoses. */
    characterMatch: z.ZodOptional<z.ZodEnum<["off", "on"]>>;
}, "strip", z.ZodTypeAny, {
    expressiveness: "flat" | "balanced" | "overacted";
    consistency: "balanced" | "unstable" | "robotic";
    characterMatch?: "off" | "on" | undefined;
}, {
    expressiveness: "flat" | "balanced" | "overacted";
    consistency: "balanced" | "unstable" | "robotic";
    characterMatch?: "off" | "on" | undefined;
}>;
export type DeliveryDiagnosis = z.infer<typeof DeliveryDiagnosisSchema>;
/** One juror's vote in an N-vote perceptual panel. The `lens` names
 *  the delivery axis the juror focused on (emotion / clarity / pacing
 *  / naturalness), so a split reads for WHICH axis disagreed. */
export declare const AudioPanelVoteSchema: z.ZodObject<{
    lens: z.ZodString;
    verdict: z.ZodEnum<["pass", "concern", "fail"]>;
    /** 0..100 raw score. */
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
export type AudioPanelVote = z.infer<typeof AudioPanelVoteSchema>;
/** The per-juror breakdown behind an aggregated perceptual verdict —
 *  attached to the `delivery-intent` result when the judge was an
 *  N-vote panel (jurors > 1); absent for a single-vote judge. Drives
 *  `panel-split` escalation. */
export declare const AudioPanelBreakdownSchema: z.ZodObject<{
    jurorCount: z.ZodNumber;
    votes: z.ZodArray<z.ZodObject<{
        lens: z.ZodString;
        verdict: z.ZodEnum<["pass", "concern", "fail"]>;
        /** 0..100 raw score. */
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
    /** Fraction of jurors matching the aggregated verdict — 1 =
     *  unanimous, → 1/jurorCount as the panel splits. */
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
export type AudioPanelBreakdown = z.infer<typeof AudioPanelBreakdownSchema>;
/** One criterion's verdict on one take. FLAT — no nested
 *  verdict/score/artifacts objects, matching `HarnessResult`. */
export declare const AudioReviewResultSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    /** Sidecar-relative slot (`voice/sora-death-cry`). */
    slot: z.ZodString;
    /** Which take was judged (the kept take's cache hash). */
    takeHash: z.ZodString;
    /** Criterion id — stable kebab-case, like an assertion id. */
    criterionId: z.ZodString;
    reviewShape: z.ZodEnum<["gate", "transcription", "perceptual"]>;
    outcome: z.ZodEnum<["pass", "concern", "fail", "error", "not-applicable"]>;
    /** Normalized 0..1 quality (WER → `1 - wer`; judge → score/100).
     *  Null for pure gates that report a raw measurement instead. */
    score: z.ZodNullable<z.ZodNumber>;
    /** Operator-facing rationale — the judge's prose, or the
     *  gate's measured numbers. */
    evidence: z.ZodString;
    /** Raw measured value the outcome derived from (WER, LUFS,
     *  max-volume dB, duration seconds). Null when nothing was
     *  measured. */
    measurement: z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodNull]>;
    /** Which byte surface was scored. `public` = post-processed
     *  (shipped) bytes — the default + the locked project
     *  decision; `cache` = raw vendor bytes. */
    bytesJudged: z.ZodEnum<["public", "cache"]>;
    /** STT / judge spend attributed to this criterion (USD). 0
     *  for pure gates. */
    costUsd: z.ZodNumber;
    durationMs: z.ZodNumber;
    /** Set when `outcome` is `error`; null otherwise. */
    error: z.ZodNullable<z.ZodString>;
    /** The perceptual judge's STRUCTURED delivery read (Part C),
     *  when this criterion produced one (`delivery-intent` on
     *  voice / SFX). Carried onto the result so the `retune` loop
     *  can feed it to `inferParamAdjustment` without re-invoking
     *  the judge. Null for gates, transcription, music, and any
     *  judge that didn't emit it. */
    delivery: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        expressiveness: z.ZodEnum<["flat", "balanced", "overacted"]>;
        consistency: z.ZodEnum<["unstable", "balanced", "robotic"]>;
        /** Voice only — SFX has no character to match; omitted for
         *  SFX diagnoses. */
        characterMatch: z.ZodOptional<z.ZodEnum<["off", "on"]>>;
    }, "strip", z.ZodTypeAny, {
        expressiveness: "flat" | "balanced" | "overacted";
        consistency: "balanced" | "unstable" | "robotic";
        characterMatch?: "off" | "on" | undefined;
    }, {
        expressiveness: "flat" | "balanced" | "overacted";
        consistency: "balanced" | "unstable" | "robotic";
        characterMatch?: "off" | "on" | undefined;
    }>>>;
    /** The per-juror breakdown when the perceptual judge was an N-vote
     *  panel (`delivery-intent` only; absent for a single-vote judge).
     *  Read by `reviewSidecar` for `panel-split` escalation. */
    panel: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        jurorCount: z.ZodNumber;
        votes: z.ZodArray<z.ZodObject<{
            lens: z.ZodString;
            verdict: z.ZodEnum<["pass", "concern", "fail"]>;
            /** 0..100 raw score. */
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
        /** Fraction of jurors matching the aggregated verdict — 1 =
         *  unanimous, → 1/jurorCount as the panel splits. */
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
    costUsd: number;
    error: string | null;
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    score: number | null;
    criterionId: string;
    reviewShape: "perceptual" | "gate" | "transcription";
    outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
    evidence: string;
    measurement: string | number | boolean | null;
    takeHash: string;
    bytesJudged: "public" | "cache";
    panel?: {
        jurorCount: number;
        votes: {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }[];
        agreement: number;
    } | null | undefined;
    delivery?: {
        expressiveness: "flat" | "balanced" | "overacted";
        consistency: "balanced" | "unstable" | "robotic";
        characterMatch?: "off" | "on" | undefined;
    } | null | undefined;
}, {
    durationMs: number;
    costUsd: number;
    error: string | null;
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    score: number | null;
    criterionId: string;
    reviewShape: "perceptual" | "gate" | "transcription";
    outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
    evidence: string;
    measurement: string | number | boolean | null;
    takeHash: string;
    bytesJudged: "public" | "cache";
    panel?: {
        jurorCount: number;
        votes: {
            lens: string;
            verdict: "pass" | "concern" | "fail";
            score: number;
        }[];
        agreement: number;
    } | null | undefined;
    delivery?: {
        expressiveness: "flat" | "balanced" | "overacted";
        consistency: "balanced" | "unstable" | "robotic";
        characterMatch?: "off" | "on" | undefined;
    } | null | undefined;
}>;
export type AudioReviewResult = z.infer<typeof AudioReviewResultSchema>;
/** Rolled-up verdict for a take. */
export declare const AudioReviewVerdictSchema: z.ZodEnum<["pass", "concern", "fail"]>;
export type AudioReviewVerdict = z.infer<typeof AudioReviewVerdictSchema>;
/** Why a review was flagged for a human's eyes rather than trusted
 *  unattended (the confidence-gated escalation — matches asset-gen's
 *  reasons; `panel-split` reserved for when the N-vote panel lands). */
export declare const AudioEscalationReasonSchema: z.ZodEnum<["panel-split", "concern-verdict", "judge-error"]>;
export type AudioEscalationReason = z.infer<typeof AudioEscalationReasonSchema>;
export declare const AudioEscalationSchema: z.ZodObject<{
    reason: z.ZodEnum<["panel-split", "concern-verdict", "judge-error"]>;
    detail: z.ZodString;
    /** Panel agreement fraction for a `panel-split`; null otherwise. */
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
export type AudioEscalation = z.infer<typeof AudioEscalationSchema>;
/** Every criterion's results for one take + the rolled-up
 *  verdict. Parallels `HarnessRunSummary`.
 *
 *  ROLLUP CONTRACT (mirrors `harnessAllPassed`): `fail` if any
 *  criterion is `fail`/`error`; `concern` if any is `concern`
 *  (and none fail); else `pass`. `not-applicable` is ignored. */
export declare const AudioReviewSummarySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    slot: z.ZodString;
    kind: z.ZodEnum<["voice", "sfx", "music"]>;
    takeHash: z.ZodString;
    /** The kept take's input fingerprint — consumers detect a
     *  stale review by comparing this to the sidecar's current
     *  kept-take `inputHash`. */
    inputHash: z.ZodString;
    verdict: z.ZodEnum<["pass", "concern", "fail"]>;
    results: z.ZodArray<z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        /** Sidecar-relative slot (`voice/sora-death-cry`). */
        slot: z.ZodString;
        /** Which take was judged (the kept take's cache hash). */
        takeHash: z.ZodString;
        /** Criterion id — stable kebab-case, like an assertion id. */
        criterionId: z.ZodString;
        reviewShape: z.ZodEnum<["gate", "transcription", "perceptual"]>;
        outcome: z.ZodEnum<["pass", "concern", "fail", "error", "not-applicable"]>;
        /** Normalized 0..1 quality (WER → `1 - wer`; judge → score/100).
         *  Null for pure gates that report a raw measurement instead. */
        score: z.ZodNullable<z.ZodNumber>;
        /** Operator-facing rationale — the judge's prose, or the
         *  gate's measured numbers. */
        evidence: z.ZodString;
        /** Raw measured value the outcome derived from (WER, LUFS,
         *  max-volume dB, duration seconds). Null when nothing was
         *  measured. */
        measurement: z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodNull]>;
        /** Which byte surface was scored. `public` = post-processed
         *  (shipped) bytes — the default + the locked project
         *  decision; `cache` = raw vendor bytes. */
        bytesJudged: z.ZodEnum<["public", "cache"]>;
        /** STT / judge spend attributed to this criterion (USD). 0
         *  for pure gates. */
        costUsd: z.ZodNumber;
        durationMs: z.ZodNumber;
        /** Set when `outcome` is `error`; null otherwise. */
        error: z.ZodNullable<z.ZodString>;
        /** The perceptual judge's STRUCTURED delivery read (Part C),
         *  when this criterion produced one (`delivery-intent` on
         *  voice / SFX). Carried onto the result so the `retune` loop
         *  can feed it to `inferParamAdjustment` without re-invoking
         *  the judge. Null for gates, transcription, music, and any
         *  judge that didn't emit it. */
        delivery: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            expressiveness: z.ZodEnum<["flat", "balanced", "overacted"]>;
            consistency: z.ZodEnum<["unstable", "balanced", "robotic"]>;
            /** Voice only — SFX has no character to match; omitted for
             *  SFX diagnoses. */
            characterMatch: z.ZodOptional<z.ZodEnum<["off", "on"]>>;
        }, "strip", z.ZodTypeAny, {
            expressiveness: "flat" | "balanced" | "overacted";
            consistency: "balanced" | "unstable" | "robotic";
            characterMatch?: "off" | "on" | undefined;
        }, {
            expressiveness: "flat" | "balanced" | "overacted";
            consistency: "balanced" | "unstable" | "robotic";
            characterMatch?: "off" | "on" | undefined;
        }>>>;
        /** The per-juror breakdown when the perceptual judge was an N-vote
         *  panel (`delivery-intent` only; absent for a single-vote judge).
         *  Read by `reviewSidecar` for `panel-split` escalation. */
        panel: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            jurorCount: z.ZodNumber;
            votes: z.ZodArray<z.ZodObject<{
                lens: z.ZodString;
                verdict: z.ZodEnum<["pass", "concern", "fail"]>;
                /** 0..100 raw score. */
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
            /** Fraction of jurors matching the aggregated verdict — 1 =
             *  unanimous, → 1/jurorCount as the panel splits. */
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
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate" | "transcription";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        takeHash: string;
        bytesJudged: "public" | "cache";
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        delivery?: {
            expressiveness: "flat" | "balanced" | "overacted";
            consistency: "balanced" | "unstable" | "robotic";
            characterMatch?: "off" | "on" | undefined;
        } | null | undefined;
    }, {
        durationMs: number;
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate" | "transcription";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        takeHash: string;
        bytesJudged: "public" | "cache";
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        delivery?: {
            expressiveness: "flat" | "balanced" | "overacted";
            consistency: "balanced" | "unstable" | "robotic";
            characterMatch?: "off" | "on" | undefined;
        } | null | undefined;
    }>, "many">;
    totalCostUsd: z.ZodNumber;
    /** Set when this review should not be trusted unattended — a bare
     *  `concern` or a degraded judge (a split panel once the N-vote
     *  panel lands). The approval queue's `needs-review` state reads
     *  this; null ⇒ safe to trust. Optional for pre-escalation
     *  artifacts. */
    escalation: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        reason: z.ZodEnum<["panel-split", "concern-verdict", "judge-error"]>;
        detail: z.ZodString;
        /** Panel agreement fraction for a `panel-split`; null otherwise. */
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
    kind: "music" | "sfx" | "voice";
    inputHash: string;
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    verdict: "pass" | "concern" | "fail";
    results: {
        durationMs: number;
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate" | "transcription";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        takeHash: string;
        bytesJudged: "public" | "cache";
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        delivery?: {
            expressiveness: "flat" | "balanced" | "overacted";
            consistency: "balanced" | "unstable" | "robotic";
            characterMatch?: "off" | "on" | undefined;
        } | null | undefined;
    }[];
    totalCostUsd: number;
    takeHash: string;
    escalation?: {
        reason: "panel-split" | "concern-verdict" | "judge-error";
        agreement: number | null;
        detail: string;
    } | null | undefined;
}, {
    kind: "music" | "sfx" | "voice";
    inputHash: string;
    slot: string;
    schemaVersion: 1;
    generatedAt: string;
    verdict: "pass" | "concern" | "fail";
    results: {
        durationMs: number;
        costUsd: number;
        error: string | null;
        slot: string;
        schemaVersion: 1;
        generatedAt: string;
        score: number | null;
        criterionId: string;
        reviewShape: "perceptual" | "gate" | "transcription";
        outcome: "error" | "pass" | "concern" | "fail" | "not-applicable";
        evidence: string;
        measurement: string | number | boolean | null;
        takeHash: string;
        bytesJudged: "public" | "cache";
        panel?: {
            jurorCount: number;
            votes: {
                lens: string;
                verdict: "pass" | "concern" | "fail";
                score: number;
            }[];
            agreement: number;
        } | null | undefined;
        delivery?: {
            expressiveness: "flat" | "balanced" | "overacted";
            consistency: "balanced" | "unstable" | "robotic";
            characterMatch?: "off" | "on" | undefined;
        } | null | undefined;
    }[];
    totalCostUsd: number;
    takeHash: string;
    escalation?: {
        reason: "panel-split" | "concern-verdict" | "judge-error";
        agreement: number | null;
        detail: string;
    } | null | undefined;
}>;
export type AudioReviewSummary = z.infer<typeof AudioReviewSummarySchema>;
/** One human-labeled sample in the audio calibration manifest. `slot`
 *  is the `<kind>/<slot>` id; `humanVerdict` is the ground truth the
 *  L3 review is measured against. */
export declare const AudioCalibrationSampleSchema: z.ZodObject<{
    slot: z.ZodString;
    humanVerdict: z.ZodEnum<["pass", "concern", "fail"]>;
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
export type AudioCalibrationSample = z.infer<typeof AudioCalibrationSampleSchema>;
/** The author-maintained ground-truth set the `calibrate` command
 *  measures the L3 review against. Lives at
 *  `.audio-gen-calibration.json`. */
export declare const AudioCalibrationManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    samples: z.ZodArray<z.ZodObject<{
        slot: z.ZodString;
        humanVerdict: z.ZodEnum<["pass", "concern", "fail"]>;
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
export type AudioCalibrationManifest = z.infer<typeof AudioCalibrationManifestSchema>;
//# sourceMappingURL=audioReview.d.ts.map