import { z } from 'zod';
/** Shared review verdict vocabulary, re-declared here so the schema
 *  layer doesn't depend on `@unsupervised/ai-review`. Identical values to the
 *  audio / asset / loc pipelines' `'pass' | 'concern' | 'fail'`. */
export declare const CodeVerdictSchema: z.ZodEnum<["pass", "concern", "fail"]>;
export type CodeVerdict = z.infer<typeof CodeVerdictSchema>;
/** The judge's structured, knob-shaped diagnosis — the code analogue
 *  of audio's `DeliveryDiagnosis` (expressiveness / consistency) and
 *  loc's FIDELITY / REGISTER / FLUENCY axes. Each axis is a small
 *  enum so a panel can aggregate them and a human reading the report
 *  gets a fixed vocabulary, not free prose. Specific findings still go
 *  in `issues`; these axes summarize the SHAPE of the concern.
 *
 *  Degrades to `null` when the model omits or malforms the block — the
 *  verdict + issues still stand. */
export declare const CodeReviewDiagnosisSchema: z.ZodObject<{
    /** Does the code do what the decomposition asked — the right
     *  behavior, the stated API surface, the assertions' intent? This is
     *  the adherence axis; the compiler proves it PARSES, the judge
     *  weighs whether it's RIGHT. */
    correctness: z.ZodEnum<["sound", "suspect", "broken"]>;
    /** Is it legible + modular — the "a future AI session can extend
     *  this without confusion" bar? Naming, decomposition, dead code,
     *  needless complexity. */
    maintainability: z.ZodEnum<["clean", "acceptable", "tangled"]>;
    /** Does it follow the engine's conventions — schema-first types,
     *  builders over inline literals, the layering contract, importing
     *  from package roots? Off-pattern code compiles but rots. */
    conventionFit: z.ZodEnum<["idiomatic", "neutral", "off-pattern"]>;
}, "strip", z.ZodTypeAny, {
    correctness: "sound" | "suspect" | "broken";
    maintainability: "clean" | "acceptable" | "tangled";
    conventionFit: "idiomatic" | "neutral" | "off-pattern";
}, {
    correctness: "sound" | "suspect" | "broken";
    maintainability: "clean" | "acceptable" | "tangled";
    conventionFit: "idiomatic" | "neutral" | "off-pattern";
}>;
export type CodeReviewDiagnosis = z.infer<typeof CodeReviewDiagnosisSchema>;
/** L3 code-review config. Optional + opt-in; when omitted the
 *  interpretive judge never runs and authorship acceptance is
 *  byte-for-byte what it was (compile ∧ assertions). Mirrors
 *  `LocReviewConfigSchema` — same `judgeProvider` / panel / escalation
 *  vocabulary, shared with the content pipelines via `@unsupervised/ai-review`.
 *
 *  Note: the FREE deterministic gates (compile + assertion harness)
 *  always run regardless of this config and run BEFORE the judge — a
 *  package that doesn't build or whose assertions fail never reaches
 *  the review, exactly as it never reaches the harness when it doesn't
 *  compile. This config governs only the INTERPRETIVE arm. */
export declare const CodeReviewConfigSchema: z.ZodObject<{
    /** Master switch for the interpretive judge. Default OFF. */
    enabled: z.ZodDefault<z.ZodBoolean>;
    /** What a `fail` verdict does to authorship acceptance:
     *    - `'flag'`  — record the verdict + escalation, change NOTHING
     *      (advisory; `verificationPassed` is unaffected). The default,
     *      and the right posture until the judge is CALIBRATED against
     *      labeled samples — an interpretive verdict shouldn't gate a
     *      package the compiler + harness accepted until its kappa is
     *      trusted.
     *    - `'block'` — a `fail` makes `verificationPassed` false, the
     *      same way a compile failure or a failing assertion does. Turn
     *      this on once `calibrate` shows the judge agrees with a human.
     *  A `concern` NEVER blocks under either setting — it escalates for
     *  human review. */
    failVerdictAction: z.ZodDefault<z.ZodEnum<["flag", "block"]>>;
    /** Judge model for the review. Defaults to `claude-sonnet-5` — the
     *  cost/quality sweet spot for reading a bounded source tree. */
    judgeModel: z.ZodDefault<z.ZodString>;
    /** How the judge reaches Claude — matches the content pipelines:
     *    - `'claude-cli'` — spawn the `claude` CLI (subscription-billed,
     *      no api key). The natural default for skill-builder, which is
     *      already a Claude-CLI-driven pipeline.
     *    - `'api'` — direct Anthropic call (needs `ANTHROPIC_API_KEY`).
     *    - `'auto'` (default) — CLI when `claude` resolves on PATH, else
     *      the API key. */
    judgeProvider: z.ZodDefault<z.ZodEnum<["auto", "api", "claude-cli"]>>;
    /** Path to the `claude` binary. Empty = resolve from PATH. */
    claudeCliPath: z.ZodOptional<z.ZodString>;
    /** Flag a bare `concern` verdict (or a degraded judge) for human
     *  review — the confidence-gated escalation shared with the content
     *  pipelines via `@unsupervised/ai-review`'s `computeEscalation`. */
    escalateConcern: z.ZodDefault<z.ZodBoolean>;
    /** Cap on how much authored source (in characters) is sent to the
     *  judge. A large package is truncated per-file to fit; the judge is
     *  told when it saw a truncated view so it doesn't fail code it
     *  couldn't fully read. Bounds the billed token count. */
    maxSourceChars: z.ZodDefault<z.ZodNumber>;
    /** N-vote judge panel. A single judge is uncalibrated; a panel runs
     *  `jurors` independent votes (each on a distinct lens when
     *  `diverseLenses`), takes the majority, and escalates a split below
     *  `escalateBelowAgreement`. `jurors: 1` (default) is single-vote.
     *  Billed per juror. Aggregation shared via `@unsupervised/ai-review`. */
    panel: z.ZodDefault<z.ZodObject<{
        jurors: z.ZodDefault<z.ZodNumber>;
        diverseLenses: z.ZodDefault<z.ZodBoolean>;
        escalateBelowAgreement: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        jurors: number;
        diverseLenses: boolean;
        escalateBelowAgreement: number;
    }, {
        jurors?: number | undefined;
        diverseLenses?: boolean | undefined;
        escalateBelowAgreement?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    failVerdictAction: "flag" | "block";
    judgeModel: string;
    judgeProvider: "auto" | "api" | "claude-cli";
    escalateConcern: boolean;
    panel: {
        jurors: number;
        diverseLenses: boolean;
        escalateBelowAgreement: number;
    };
    maxSourceChars: number;
    claudeCliPath?: string | undefined;
}, {
    enabled?: boolean | undefined;
    failVerdictAction?: "flag" | "block" | undefined;
    judgeModel?: string | undefined;
    judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
    claudeCliPath?: string | undefined;
    escalateConcern?: boolean | undefined;
    panel?: {
        jurors?: number | undefined;
        diverseLenses?: boolean | undefined;
        escalateBelowAgreement?: number | undefined;
    } | undefined;
    maxSourceChars?: number | undefined;
}>;
export type CodeReviewConfig = z.infer<typeof CodeReviewConfigSchema>;
/** Input variant — every default-bearing field optional. */
export type CodeReviewConfigInput = z.input<typeof CodeReviewConfigSchema>;
/** How a review attempt resolved:
 *    - `reviewed`     — the judge ran and returned a verdict.
 *    - `gates-failed` — the free tsc/lint gates failed; the diff doesn't
 *      build, so the judge was NOT run (no spend). Fix it first.
 *    - `unavailable`  — no AI backend is configured, or the spend ceiling
 *      is exhausted; the judge could not run (no spend).
 *    - `error`        — the judge ran but its response didn't parse
 *      (degraded). Re-run. */
export declare const CodeReviewOutcomeSchema: z.ZodEnum<["reviewed", "gates-failed", "unavailable", "error"]>;
export type CodeReviewOutcome = z.infer<typeof CodeReviewOutcomeSchema>;
/** A persisted code-review attempt for one change set.
 *
 *  Written by the workbench's pre-PR review assist: when a developer
 *  clicks "Review changes" on a task, the free gates run and (if they
 *  pass) the judge grades the task's branch diff; the result is stored
 *  on the `Task` record so it survives navigation. It is ADVISORY — a
 *  report the developer reads before opening a PR — never a gate. Shares
 *  the verdict + diagnosis vocabulary with skill-builder's authorship
 *  judge (both on `CodeVerdict` + `CodeReviewDiagnosis`); the two differ
 *  only in what they ground on (a spec vs. a task + diff). */
export declare const CodeReviewRecordSchema: z.ZodObject<{
    /** Which of the four outcomes this attempt reached. */
    outcome: z.ZodEnum<["reviewed", "gates-failed", "unavailable", "error"]>;
    /** The judge's verdict — present only when `outcome === 'reviewed'`. */
    verdict: z.ZodOptional<z.ZodEnum<["pass", "concern", "fail"]>>;
    /** 0..100 score the judge returned (when reviewed). */
    score: z.ZodOptional<z.ZodNumber>;
    /** The structured axis diagnosis, or null when the judge omitted it. */
    diagnosis: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        /** Does the code do what the decomposition asked — the right
         *  behavior, the stated API surface, the assertions' intent? This is
         *  the adherence axis; the compiler proves it PARSES, the judge
         *  weighs whether it's RIGHT. */
        correctness: z.ZodEnum<["sound", "suspect", "broken"]>;
        /** Is it legible + modular — the "a future AI session can extend
         *  this without confusion" bar? Naming, decomposition, dead code,
         *  needless complexity. */
        maintainability: z.ZodEnum<["clean", "acceptable", "tangled"]>;
        /** Does it follow the engine's conventions — schema-first types,
         *  builders over inline literals, the layering contract, importing
         *  from package roots? Off-pattern code compiles but rots. */
        conventionFit: z.ZodEnum<["idiomatic", "neutral", "off-pattern"]>;
    }, "strip", z.ZodTypeAny, {
        correctness: "sound" | "suspect" | "broken";
        maintainability: "clean" | "acceptable" | "tangled";
        conventionFit: "idiomatic" | "neutral" | "off-pattern";
    }, {
        correctness: "sound" | "suspect" | "broken";
        maintainability: "clean" | "acceptable" | "tangled";
        conventionFit: "idiomatic" | "neutral" | "off-pattern";
    }>>>;
    /** Specific, actionable findings (when reviewed). */
    issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** One or two sentences of prose from the judge (when reviewed). */
    notes: z.ZodDefault<z.ZodString>;
    /** Human-readable explanation for a non-`reviewed` outcome — the gate
     *  summary (`gates-failed`), the reason no backend ran (`unavailable`),
     *  or the parse error (`error`). Empty when reviewed cleanly. */
    detail: z.ZodDefault<z.ZodString>;
    /** Whether the free compile gates (tsc / lint) passed. */
    gatesPassed: z.ZodBoolean;
    /** ISO timestamp the attempt ran. */
    reviewedAt: z.ZodString;
    /** The base branch the diff was taken against (e.g. `main`). */
    base: z.ZodString;
    /** The task branch reviewed. */
    branch: z.ZodString;
    /** A cheap fingerprint of the reviewed diff (base + file/line counts).
     *  Lets the UI mark a verdict STALE when the branch moved since — the
     *  review describes an older change set. */
    diffFingerprint: z.ZodString;
    /** USD the judge call cost, as reported by the CLI / API
     *  (`total_cost_usd`). Audited under the `dev-code-review` spend kind. */
    costUsd: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    issues: string[];
    base: string;
    costUsd: number;
    notes: string;
    detail: string;
    outcome: "error" | "reviewed" | "gates-failed" | "unavailable";
    diagnosis: {
        correctness: "sound" | "suspect" | "broken";
        maintainability: "clean" | "acceptable" | "tangled";
        conventionFit: "idiomatic" | "neutral" | "off-pattern";
    } | null;
    gatesPassed: boolean;
    reviewedAt: string;
    branch: string;
    diffFingerprint: string;
    verdict?: "pass" | "concern" | "fail" | undefined;
    score?: number | undefined;
}, {
    base: string;
    outcome: "error" | "reviewed" | "gates-failed" | "unavailable";
    gatesPassed: boolean;
    reviewedAt: string;
    branch: string;
    diffFingerprint: string;
    issues?: string[] | undefined;
    costUsd?: number | undefined;
    notes?: string | undefined;
    verdict?: "pass" | "concern" | "fail" | undefined;
    score?: number | undefined;
    detail?: string | undefined;
    diagnosis?: {
        correctness: "sound" | "suspect" | "broken";
        maintainability: "clean" | "acceptable" | "tangled";
        conventionFit: "idiomatic" | "neutral" | "off-pattern";
    } | null | undefined;
}>;
export type CodeReviewRecord = z.infer<typeof CodeReviewRecordSchema>;
//# sourceMappingURL=codeReview.d.ts.map