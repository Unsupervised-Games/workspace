import { z } from 'zod';

// Build & release — the org-shared, per-game build matrix (platform ×
// environment) surfaced in the workbench's Releases section. An ARTIFACT is a
// binary uploaded once (via the `builds` CLI push) into org-scoped storage; a
// RELEASE places an artifact into an environment (Develop → Staging →
// Production) via a promotion workflow. The "current build" in a matrix cell is
// the latest release for that (platform, environment). Metadata lives in the
// workbench-cloud backend (RLS-isolated per org); the bytes live in org-scoped
// object storage. Logic lives in @unsupervised/workbench-cloud. See
// packages/workbench-cloud/CLAUDE.md.

/** The target a build runs on. `console` is generic for v1 (specific consoles
 *  can be added without a data migration — it's just another enum member). */
export const BuildPlatformSchema = z.enum(['ios', 'android', 'web', 'windows', 'macos', 'linux', 'console']);
export type BuildPlatform = z.infer<typeof BuildPlatformSchema>;

/** The release environment. Builds are PROMOTED left-to-right. */
export const BuildEnvironmentSchema = z.enum(['develop', 'staging', 'production']);
export type BuildEnvironment = z.infer<typeof BuildEnvironmentSchema>;

/** An uploaded build binary — recorded once, referenced by every release that
 *  promotes it through the environments. The bytes live at `storagePath` in the
 *  org-scoped bucket; `contentHash` is the SHA-256 of the binary (dedupe +
 *  integrity). */
export const BuildArtifactSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  gameSlug: z.string().min(1),
  platform: BuildPlatformSchema,
  /** Build version / label, e.g. "1.4.0" or "1.4.0-rc2+build.317". */
  version: z.string().min(1),
  filename: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  /** SHA-256 hex of the binary. */
  contentHash: z.string().min(1),
  /** Object-storage path (org-scoped: `<orgId>/<gameSlug>/…`). */
  storagePath: z.string().min(1),
  /** Member (user id / email) who pushed it. */
  uploadedBy: z.string().min(1),
  uploadedAt: z.string().min(1),
  notes: z.string().optional(),
});
export type BuildArtifact = z.infer<typeof BuildArtifactSchema>;

/** The upload input (the store assigns id / storagePath / uploadedBy / uploadedAt). */
export const NewBuildArtifactSchema = z.object({
  gameSlug: z.string().min(1),
  platform: BuildPlatformSchema,
  version: z.string().min(1),
  filename: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  contentHash: z.string().min(1),
  notes: z.string().optional(),
});
export type NewBuildArtifact = z.infer<typeof NewBuildArtifactSchema>;

/** An artifact's placement in one environment. Uploading an artifact creates its
 *  initial `develop` release; promoting creates a new release in the next
 *  environment referencing the SAME artifact (`promotedFrom` names the source). */
export const BuildReleaseSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  gameSlug: z.string().min(1),
  artifactId: z.string().min(1),
  /** Denormalized from the artifact so the matrix can group by platform. */
  platform: BuildPlatformSchema,
  environment: BuildEnvironmentSchema,
  releasedBy: z.string().min(1),
  releasedAt: z.string().min(1),
  /** The environment it was promoted FROM (absent for the initial develop upload). */
  promotedFrom: BuildEnvironmentSchema.optional(),
});
export type BuildRelease = z.infer<typeof BuildReleaseSchema>;

/** One cell of the build matrix — the current (latest) release + its artifact for
 *  a (platform, environment), or null when nothing has shipped there. */
export const BuildMatrixCellSchema = z.object({
  environment: BuildEnvironmentSchema,
  release: BuildReleaseSchema.nullable(),
  artifact: BuildArtifactSchema.nullable(),
});
export type BuildMatrixCell = z.infer<typeof BuildMatrixCellSchema>;

/** One platform's row across every environment. */
export const BuildMatrixRowSchema = z.object({
  platform: BuildPlatformSchema,
  cells: z.array(BuildMatrixCellSchema),
});
export type BuildMatrixRow = z.infer<typeof BuildMatrixRowSchema>;

/** The whole per-game build matrix the Releases section renders. */
export const BuildMatrixSchema = z.object({
  gameSlug: z.string().min(1),
  rows: z.array(BuildMatrixRowSchema),
});
export type BuildMatrix = z.infer<typeof BuildMatrixSchema>;
