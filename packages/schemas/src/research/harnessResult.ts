// HarnessResult — the artifact a single assertion run
// produces. One per Assertion × per verification pass.
// For 'package' work items, the skill-builder ingests
// these via the in-process assertion harness to mark
// WorkItem.status as 'passed' / 'failed' (alongside the
// authorship subprocess exit code). The operator UI
// surfaces individual results for debugging.
//
// Versioned (`schemaVersion: 1`). Cross-references the
// Assertion schema via assertionId — no shape duplication.

import { z } from 'zod';
import { AssertionTestShapeSchema } from './decomposition.js';

// ────────────────────────────────────────────────────────────────
// Outcome of a single assertion run.
// ────────────────────────────────────────────────────────────────

export const HarnessOutcomeSchema = z.enum([
  /** The assertion ran to completion and the check
   *  returned true. */
  'pass',
  /** The assertion ran to completion and the check
   *  returned false. */
  'fail',
  /** The assertion's test implementation threw an
   *  unhandled error. */
  'error',
  /** The harness recognized the testShape but the runner
   *  isn't implemented yet (e.g., 'perceptual' in Phase 1).
   *  Surfaces as a pass/fail-neutral signal — the gym
   *  treats it as a known gap, not a regression. */
  'not-implemented',
  /** The test impl couldn't load (missing export,
   *  syntax error, module resolution failure). Treated
   *  the same as 'error' for pass/fail counting but
   *  distinct for debugging. */
  'load-error',
]);
export type HarnessOutcome = z.infer<typeof HarnessOutcomeSchema>;

// ────────────────────────────────────────────────────────────────
// Measurement — the value the test impl recorded. Mirrors
// the shape Assertion.measurableTarget accepts so the
// harness can directly compare.
// ────────────────────────────────────────────────────────────────

export const MeasurementValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.string(),
  z.null(),
]);
export type MeasurementValue = z.infer<typeof MeasurementValueSchema>;

// ────────────────────────────────────────────────────────────────
// HarnessResult — the artifact.
// ────────────────────────────────────────────────────────────────

export const HarnessResultSchema = z.object({
  schemaVersion: z.literal(1),
  /** Mirrors Assertion.id. */
  assertionId: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  /** Mirrors Assertion.testShape. */
  testShape: AssertionTestShapeSchema,
  outcome: HarnessOutcomeSchema,
  /** Operator-facing prose explaining the result. For
   *  'pass' this is typically empty or a one-line
   *  confirmation; for 'fail' / 'error' this is the
   *  diagnostic. */
  evidence: z.string(),
  /** What the test impl recorded. Compared against
   *  Assertion.measurableTarget when both are present. */
  measurement: MeasurementValueSchema,
  /** True when measurement matches the target. Null when
   *  no target was specified on the assertion. */
  targetMatched: z.boolean().nullable(),
  /** Wall-clock for the assertion in ms. Useful for the
   *  gym's perf budget tracking + spotting flaky tests. */
  durationMs: z.number().nonnegative(),
  /** Set when outcome is 'error' or 'load-error'. The
   *  error message; not the full stack trace. */
  error: z.string().nullable(),
  /** USD this assertion billed — the sum of any perceptual vision-judge
   *  or agent-playthrough LLM calls the impl made via its run context.
   *  0 for the free shapes (structural / behavioral / pixel-diff /
   *  scripted playthrough). Audited so a billed verification call during
   *  authorship shows up in `.code-gen-log.jsonl` like every other spend. */
  costUsd: z.number().nonnegative().default(0),
  generatedAt: z.string(),
});
export type HarnessResult = z.infer<typeof HarnessResultSchema>;

// ────────────────────────────────────────────────────────────────
// HarnessRunSummary — aggregate when running many
// assertions at once (typical gym pass).
// ────────────────────────────────────────────────────────────────

export const HarnessRunSummarySchema = z.object({
  schemaVersion: z.literal(1),
  generatedAt: z.string(),
  /** Number of test impls discovered. */
  discovered: z.number().int().nonnegative(),
  /** Per-outcome counts. */
  counts: z.object({
    pass: z.number().int().nonnegative(),
    fail: z.number().int().nonnegative(),
    error: z.number().int().nonnegative(),
    'not-implemented': z.number().int().nonnegative(),
    'load-error': z.number().int().nonnegative(),
  }),
  /** Total wall-clock across all assertions, in ms. */
  totalDurationMs: z.number().nonnegative(),
  /** Total USD billed across all assertions — the sum of every result's
   *  `costUsd`. The number skill-builder audits as `harness-judge` spend. */
  totalCostUsd: z.number().nonnegative().default(0),
  /** Per-result detail. Ordered by assertionId
   *  alphabetically for determinism. */
  results: z.array(HarnessResultSchema),
});
export type HarnessRunSummary = z.infer<typeof HarnessRunSummarySchema>;
