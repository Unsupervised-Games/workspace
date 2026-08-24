// code-review — build-time config + verdict shapes for the L3
// interpretive CODE judge in @unsupervised/skill-builder.
//
// The code track already has two FREE, deterministic verify gates:
// the compile gates (`tsc` / `lint` — exit 0 or not) and the
// assertion harness (machine-checkable invariants). What it lacked is
// the INTERPRETIVE arm every content pipeline has — a judge that reads
// the authored source against the spec (the FeatureDecomposition) and
// asks the questions a compiler can't: does this actually do what was
// asked, is it legible, does it fit the engine's conventions.
//
// This mirrors `LocReviewConfigSchema` (a TEXT judge — code review is
// text, not vision) and reuses `@unsupervised/ai-review`'s shared verdict math
// (panel aggregation, escalation, calibration). What's code-specific
// is only the diagnosis axes + the system prompt, which live in
// skill-builder's `codeReview/` subsystem.
import { z } from 'zod';
/** Shared review verdict vocabulary, re-declared here so the schema
 *  layer doesn't depend on `@unsupervised/ai-review`. Identical values to the
 *  audio / asset / loc pipelines' `'pass' | 'concern' | 'fail'`. */
export const CodeVerdictSchema = z.enum(['pass', 'concern', 'fail']);
/** The judge's structured, knob-shaped diagnosis — the code analogue
 *  of audio's `DeliveryDiagnosis` (expressiveness / consistency) and
 *  loc's FIDELITY / REGISTER / FLUENCY axes. Each axis is a small
 *  enum so a panel can aggregate them and a human reading the report
 *  gets a fixed vocabulary, not free prose. Specific findings still go
 *  in `issues`; these axes summarize the SHAPE of the concern.
 *
 *  Degrades to `null` when the model omits or malforms the block — the
 *  verdict + issues still stand. */
export const CodeReviewDiagnosisSchema = z.object({
    /** Does the code do what the decomposition asked — the right
     *  behavior, the stated API surface, the assertions' intent? This is
     *  the adherence axis; the compiler proves it PARSES, the judge
     *  weighs whether it's RIGHT. */
    correctness: z.enum(['sound', 'suspect', 'broken']),
    /** Is it legible + modular — the "a future AI session can extend
     *  this without confusion" bar? Naming, decomposition, dead code,
     *  needless complexity. */
    maintainability: z.enum(['clean', 'acceptable', 'tangled']),
    /** Does it follow the engine's conventions — schema-first types,
     *  builders over inline literals, the layering contract, importing
     *  from package roots? Off-pattern code compiles but rots. */
    conventionFit: z.enum(['idiomatic', 'neutral', 'off-pattern']),
});
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
export const CodeReviewConfigSchema = z.object({
    /** Master switch for the interpretive judge. Default OFF. */
    enabled: z.boolean().default(false),
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
    failVerdictAction: z.enum(['flag', 'block']).default('flag'),
    /** Judge model for the review. Defaults to `claude-sonnet-5` — the
     *  cost/quality sweet spot for reading a bounded source tree. */
    judgeModel: z.string().min(1).default('claude-sonnet-5'),
    /** How the judge reaches Claude — matches the content pipelines:
     *    - `'claude-cli'` — spawn the `claude` CLI (subscription-billed,
     *      no api key). The natural default for skill-builder, which is
     *      already a Claude-CLI-driven pipeline.
     *    - `'api'` — direct Anthropic call (needs `ANTHROPIC_API_KEY`).
     *    - `'auto'` (default) — CLI when `claude` resolves on PATH, else
     *      the API key. */
    judgeProvider: z.enum(['auto', 'api', 'claude-cli']).default('auto'),
    /** Path to the `claude` binary. Empty = resolve from PATH. */
    claudeCliPath: z.string().optional(),
    /** Flag a bare `concern` verdict (or a degraded judge) for human
     *  review — the confidence-gated escalation shared with the content
     *  pipelines via `@unsupervised/ai-review`'s `computeEscalation`. */
    escalateConcern: z.boolean().default(true),
    /** Cap on how much authored source (in characters) is sent to the
     *  judge. A large package is truncated per-file to fit; the judge is
     *  told when it saw a truncated view so it doesn't fail code it
     *  couldn't fully read. Bounds the billed token count. */
    maxSourceChars: z.number().int().min(1000).default(60000),
    /** N-vote judge panel. A single judge is uncalibrated; a panel runs
     *  `jurors` independent votes (each on a distinct lens when
     *  `diverseLenses`), takes the majority, and escalates a split below
     *  `escalateBelowAgreement`. `jurors: 1` (default) is single-vote.
     *  Billed per juror. Aggregation shared via `@unsupervised/ai-review`. */
    panel: z
        .object({
        jurors: z.number().int().min(1).max(5).default(1),
        diverseLenses: z.boolean().default(true),
        escalateBelowAgreement: z.number().min(0).max(1).default(0.67),
    })
        .default({}),
});
/** How a review attempt resolved:
 *    - `reviewed`     — the judge ran and returned a verdict.
 *    - `gates-failed` — the free tsc/lint gates failed; the diff doesn't
 *      build, so the judge was NOT run (no spend). Fix it first.
 *    - `unavailable`  — no AI backend is configured, or the spend ceiling
 *      is exhausted; the judge could not run (no spend).
 *    - `error`        — the judge ran but its response didn't parse
 *      (degraded). Re-run. */
export const CodeReviewOutcomeSchema = z.enum(['reviewed', 'gates-failed', 'unavailable', 'error']);
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
export const CodeReviewRecordSchema = z.object({
    /** Which of the four outcomes this attempt reached. */
    outcome: CodeReviewOutcomeSchema,
    /** The judge's verdict — present only when `outcome === 'reviewed'`. */
    verdict: CodeVerdictSchema.optional(),
    /** 0..100 score the judge returned (when reviewed). */
    score: z.number().min(0).max(100).optional(),
    /** The structured axis diagnosis, or null when the judge omitted it. */
    diagnosis: CodeReviewDiagnosisSchema.nullable().default(null),
    /** Specific, actionable findings (when reviewed). */
    issues: z.array(z.string()).default([]),
    /** One or two sentences of prose from the judge (when reviewed). */
    notes: z.string().default(''),
    /** Human-readable explanation for a non-`reviewed` outcome — the gate
     *  summary (`gates-failed`), the reason no backend ran (`unavailable`),
     *  or the parse error (`error`). Empty when reviewed cleanly. */
    detail: z.string().default(''),
    /** Whether the free compile gates (tsc / lint) passed. */
    gatesPassed: z.boolean(),
    /** ISO timestamp the attempt ran. */
    reviewedAt: z.string(),
    /** The base branch the diff was taken against (e.g. `main`). */
    base: z.string(),
    /** The task branch reviewed. */
    branch: z.string(),
    /** A cheap fingerprint of the reviewed diff (base + file/line counts).
     *  Lets the UI mark a verdict STALE when the branch moved since — the
     *  review describes an older change set. */
    diffFingerprint: z.string(),
    /** USD the judge call cost, as reported by the CLI / API
     *  (`total_cost_usd`). Audited under the `dev-code-review` spend kind. */
    costUsd: z.number().nonnegative().default(0),
});
//# sourceMappingURL=codeReview.js.map