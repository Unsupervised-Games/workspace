import { z } from 'zod';

// The MAINTAIN arm for the code pipeline.
//
// Art has `detectDrift` ("has this shipped asset drifted from the narrative card
// it was grounded in?"). Localization has `status` + `prune` (coverage, stale,
// orphan keys). Code had NOTHING: assertions ran exactly once, at authoring
// time, and were never looked at again. A package could be authored, pass, and
// then rot — its assertions broken by a later refactor — with nothing in the
// system that would ever notice.
//
// `skill-builder maintain` closes that. It is $0: the compile gates and the
// assertion harness cost nothing (no LLM, no vendor, no judge), which is
// precisely why there was never an excuse not to run them.
//
// The one thing it will NOT do automatically is re-run **skill-gym**, because
// that IS billed (~$10-15). A stale skill is reported with the command to
// re-gym it; the spend stays the operator's.

/** What kind of artifact the pipeline shipped. */
export const CodeArtifactKindSchema = z.enum(['package', 'skill']);
export type CodeArtifactKind = z.infer<typeof CodeArtifactKindSchema>;

export const CodeArtifactStatusSchema = z.enum([
  /** Source is unchanged since it last verified — or it was re-verified and
   *  still passes. Nothing to do. */
  'current',
  /** The source changed since it was verified. Its recorded pass no longer
   *  describes what's on disk. (For a skill: re-gym is BILLED, so this is
   *  reported, never auto-fixed.) */
  'stale',
  /** RE-VERIFIED AND FAILED. It passed at authoring time and does not pass now:
   *  a later change broke it. This is the state the whole arm exists to find. */
  'regressed',
  /** It was recorded as "passed" but nothing was actually verified — accepted
   *  under the old gate that counted `not-implemented` assertions as passes.
   *  A vacuous pass is not a pass; these need real assertions. */
  'unverified',
  /** The artifact is gone from disk, but a build plan still claims it shipped. */
  'missing',
]);
export type CodeArtifactStatus = z.infer<typeof CodeArtifactStatusSchema>;

export const CodeArtifactReportSchema = z.object({
  /** The build that produced it (`builds/<featureId>/`). */
  buildId: z.string(),
  workItemId: z.string(),
  kind: CodeArtifactKindSchema,
  /** `@unsupervised/timescale`, or the skill name. */
  name: z.string(),
  /** Workspace-relative path to the artifact. */
  path: z.string(),
  status: CodeArtifactStatusSchema,
  /** Operator-facing explanation. Empty when `current`. */
  reasons: z.array(z.string()).default([]),
  /** Current fingerprint of the artifact's source (null when missing). */
  fingerprint: z.string().nullable().default(null),
  /** The fingerprint recorded when it last verified (null for artifacts that
   *  predate fingerprinting — those are always re-verified). */
  recordedFingerprint: z.string().nullable().default(null),
  /** Whether it was actually re-verified this run (vs. skipped as unchanged). */
  reverified: z.boolean().default(false),
  /** Re-verification detail, when it ran. */
  gatesPassed: z.boolean().nullable().default(null),
  assertionsVerified: z.number().int().nonnegative().nullable().default(null),
  assertionsUnverified: z.number().int().nonnegative().nullable().default(null),
});
export type CodeArtifactReport = z.infer<typeof CodeArtifactReportSchema>;

export const CodeMaintainReportSchema = z.object({
  ranAt: z.string(),
  workspaceRoot: z.string(),
  artifacts: z.array(CodeArtifactReportSchema),
  counts: z.object({
    current: z.number().int().nonnegative(),
    stale: z.number().int().nonnegative(),
    regressed: z.number().int().nonnegative(),
    unverified: z.number().int().nonnegative(),
    missing: z.number().int().nonnegative(),
  }),
  /** True ⇔ nothing is regressed, unverified, or missing.
   *
   *  `stale` does NOT fail the run: a source change is expected and only means
   *  the recorded verification is out of date. A REGRESSION is a real failure —
   *  something that used to work doesn't. */
  ok: z.boolean(),
});
export type CodeMaintainReport = z.infer<typeof CodeMaintainReportSchema>;
