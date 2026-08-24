import { z } from 'zod';

// The COMPILE GATE — the cheapest, most definitive verification the code
// pipeline has, and the one it was not running.
//
// The content pipelines (art / audio / loc) spend real money on vision judges
// and STT gates because their artifacts are hard to verify. Code is the
// opposite: `tsc` either exits 0 or it doesn't. Yet until now the code track
// only ASKED the agent, in prose, to "run builds and tests when relevant" —
// nothing read an exit code, and nothing blocked on failure.
//
// These shapes are what a gate run records. Two consumers:
//   - @unsupervised/skill-builder — after authoring a package, before accepting it.
//   - apps/workbench      — after the dev-agent applies a bug fix, so the
//                           self-healing loop can't mark a build-breaking
//                           change `confirmed`.

/** The gates we run. Ordered by cost: a type error makes lint + test noise, so
 *  a failing earlier gate short-circuits the later ones. */
export const QualityGateNameSchema = z.enum(['check-types', 'lint', 'test']);
export type QualityGateName = z.infer<typeof QualityGateNameSchema>;

export const QualityGateResultSchema = z.object({
  gate: QualityGateNameSchema,
  /** The exact command run — operator-facing, so a failure is reproducible. */
  command: z.string(),
  /** Subprocess exit code. -1 when the gate was skipped or the spawn failed. */
  exitCode: z.number().int(),
  passed: z.boolean(),
  durationMs: z.number().nonnegative(),
  /** Tail of combined stdout+stderr — enough to diagnose without persisting
   *  megabytes of build log into a bug record. */
  outputTail: z.string().default(''),
  /** True when the gate never ran (an earlier gate failed, or the scope has no
   *  such script). A skipped gate is NOT a passing gate. */
  skipped: z.boolean().default(false),
});
export type QualityGateResult = z.infer<typeof QualityGateResultSchema>;

export const QualityGateReportSchema = z.object({
  /** What was gated — a package name (`@unsupervised/timescale`) or a game slug. */
  scope: z.string().min(1),
  ranAt: z.string(),
  results: z.array(QualityGateResultSchema),
  /** The verdict. True ⇔ at least one gate RAN and every gate that ran passed.
   *
   *  "At least one" is load-bearing: a report where every gate was skipped
   *  proves nothing, and must not read as success. This is the same class of
   *  bug as the assertion harness counting `not-implemented` as a pass — an
   *  artifact that was never checked is not an artifact that passed. */
  passed: z.boolean(),
});
export type QualityGateReport = z.infer<typeof QualityGateReportSchema>;

/** PURE — the verdict for a set of gate results. Shared by every consumer so
 *  "did the gates pass" means exactly one thing across the monorepo. */
export function evaluateQualityGates(results: readonly QualityGateResult[]): boolean {
  const ran = results.filter((r) => !r.skipped);
  if (ran.length === 0) return false; // nothing was verified — not a pass
  return ran.every((r) => r.passed);
}
