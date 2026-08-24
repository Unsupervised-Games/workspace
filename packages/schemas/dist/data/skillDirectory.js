// Skill directory — the hosted catalog of publishable Claude SKILLS, the
// sibling of the package directory (see data/packageDirectory.ts). Where the
// package directory catalogs engine PACKAGES (code + npm bytes), this catalogs
// SKILLS (a `.claude/skills/<slug>/` folder: SKILL.md + optional resources —
// instructions the agent follows, not code it links).
//
// The org story mirrors packages exactly, split by visibility:
//   • PUBLIC  — the official Atelier skills (the direction skills, code-review,
//     audio-cue-bind …), vendor-published, readable by everyone.
//   • PRIVATE — an org's HOUSE skills (its narrative voice, its review bar, its
//     naming conventions), visible only to that org's members. Under the
//     GitHub-backed distribution model these live workspace-local in the org's
//     shared monorepo (`.claude/skills/`) and sync by `git pull`, exactly as
//     private packages do — so the org catalog is the local scan re-tagged as
//     the org's, and the Supabase private path is vestigial.
//
// Where skills DIFFER from packages (why this is a sibling, not a package
// ecosystem): no semver + no dependency graph (a content hash + "updated since
// installed" is enough), the artifact is a FOLDER copied into `.claude/skills/`
// (not an npm tarball edited into package.json), and installing a third-party
// skill runs someone's prompt + bash — so the model is org-private + vendor-
// public, NO community (mirrors the marketplace decision).
//
// Schema names: `PascalCaseSchema`; inferred types drop the suffix. This module
// declares zod; consumer packages (@unsupervised/skills-cloud, apps/workbench) import
// the inferred TYPES and never redeclare them.
import { z } from 'zod';
// One visibility enum for the whole marketplace — reuse the package directory's
// rather than mint a second copy that could drift.
import { PackageVisibilitySchema } from './packageDirectory.js';
/** PUBLIC (vendor-published, everyone) vs PRIVATE (org-scoped). Same enum the
 *  package directory uses. */
export const SkillVisibilitySchema = PackageVisibilitySchema;
/** A skill slug — the directory name under `.claude/skills/`. Lowercase,
 *  hyphen-separated (e.g. `narrative-audio-direction`). Doubles as the catalog
 *  id and the install target path segment. */
const SkillSlugSchema = z.string().regex(/^[a-z][a-z0-9-]*$/);
// ────────────────────────────────────────────────────────────────
// PublishedSkill — one catalog record. Metadata only: the SKILL.md +
// resources stay in git (the org's monorepo for PRIVATE, the official
// repo for PUBLIC), exactly as the package directory holds metadata
// and never the bytes. Identity is (slug, orgId) — a PUBLIC skill has
// no orgId; a PRIVATE one is scoped to its owning org. There is NO
// version: a re-publish with a new `contentHash` replaces the record
// (staleness is "the hash moved since you installed", not semver).
// ────────────────────────────────────────────────────────────────
export const PublishedSkillSchema = z.object({
    slug: SkillSlugSchema,
    /** `name` from the SKILL.md frontmatter (usually equals the slug). */
    name: z.string().min(1),
    /** `description` from the SKILL.md frontmatter — the full trigger / context
     *  guidance Claude reads to decide when the skill applies. The catalog card's
     *  body + the primary search field. Skill descriptions run long (the whole
     *  when-to-use spec on one logical line) — the cap is generous on purpose. */
    description: z.string().max(8000),
    /** First sentence of `description` (derived by the scanner) — the one-line
     *  the search list shows per card. */
    summary: z.string().max(500),
    /** PUBLIC (everyone) vs PRIVATE (org-scoped). */
    visibility: SkillVisibilitySchema.default('public'),
    /** The org that owns a PRIVATE skill; absent for PUBLIC. When set, only that
     *  org's members may see / resolve the record. */
    orgId: z.string().optional(),
    /** Capability slugs this skill helps with — what the AI pipeline / search
     *  filters by ("narrative", "audio", "review"). */
    capabilityTags: z.array(z.string()).default([]),
    /** True when the skill folder carries files besides SKILL.md (reference
     *  docs, prompts, scripts) — so an installer copies the whole folder, not
     *  just the markdown. */
    hasResources: z.boolean().default(false),
    /** SHA-256 hex of the skill folder's content (canonical over SKILL.md +
     *  every resource). Integrity check + the staleness/drift key: a re-publish
     *  of identical content is a no-op; a changed hash means "update available". */
    contentHash: z.string().regex(/^[0-9a-f]{64}$/),
    /** ISO-8601 publish timestamp. */
    publishedAt: z.string(),
    /** Publisher identity — the vendor for PUBLIC, an org member for PRIVATE.
     *  Advisory; the directory does authz, not this field. */
    publishedBy: z.string().optional(),
});
// ────────────────────────────────────────────────────────────────
// SkillQuery — the search request. Every field is an AND filter;
// `text` is a free-text match over slug + name + description +
// capability tags. `visibility` + `orgId` scope PRIVATE results to a
// caller's org (the adapter never leaks another org's private skill
// regardless of what a query asks for).
// ────────────────────────────────────────────────────────────────
export const SkillQuerySchema = z.object({
    text: z.string().optional(),
    /** Exact capability slug the skill must carry. */
    capability: z.string().optional(),
    visibility: SkillVisibilitySchema.optional(),
    /** Caller's org — required to include that org's PRIVATE skills; absent ⇒
     *  PUBLIC-only results. */
    orgId: z.string().optional(),
    limit: z.number().int().positive().max(200).default(50),
});
// ────────────────────────────────────────────────────────────────
// SkillSearchResult — a page of catalog records + the unpaged total.
// ────────────────────────────────────────────────────────────────
export const SkillSearchResultSchema = z.object({
    skills: z.array(PublishedSkillSchema),
    total: z.number().int().nonnegative(),
});
// ────────────────────────────────────────────────────────────────
// PublishedSkillCatalog — the PUBLISHED catalog file an official repo
// commits at `skills.registry.json` (CI runs `skills-cloud catalog` on
// merge to main). The GitHubSkillDirectory fetches + validates it, the
// same way the package directory reads a repo's packages.registry.json.
// "Registered" = merge to main + CI regenerates this file.
// ────────────────────────────────────────────────────────────────
export const PublishedSkillCatalogSchema = z.object({
    version: z.literal(1),
    /** ISO-8601 timestamp of when the catalog was generated (optional). */
    generatedAt: z.string().optional(),
    skills: z.array(PublishedSkillSchema),
});
//# sourceMappingURL=skillDirectory.js.map