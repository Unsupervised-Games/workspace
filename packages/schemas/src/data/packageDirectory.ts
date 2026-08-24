// Package directory — the hosted, multi-source catalog of publishable
// packages (project_package_marketplace Tier 1). The hosted evolution
// of `packages.registry.json`: where the registry SNAPSHOT is a LOCAL,
// single-workspace extract, the DIRECTORY is a REMOTE, versioned,
// multi-package index the workbench + AI pipeline search and install
// from.
//
// ECOSYSTEM-NEUTRAL BY DESIGN. The catalog (this metadata) is
// language-agnostic — a search index doesn't care whether a package is
// TypeScript, Rust, or C++. Only the ARTIFACT adapter that fetches +
// installs the bytes is ecosystem-specific. `npm` is the first (and,
// today, only) adapter — the engine is 100% TypeScript — but `cargo` /
// `raw` join the same seam without touching this schema. That split is
// the whole point: the directory admits a polyglot future while the
// concrete host (Verdaccio / npm / GitHub Packages) stays a swappable
// adapter detail.
//
// Schema names: `PascalCaseSchema`; inferred types drop the suffix.
// This module declares zod; consumer packages (@unsupervised/registry-cloud,
// apps/workbench) import the inferred TYPES and never redeclare them.

import { z } from 'zod';
// PackageEcosystem lives in research/registry.ts (co-located with the other
// package-classification enums + the PackageEntry it now tags) to avoid a
// data↔research import cycle; it's still re-exported from the package barrel.
import { PackageEcosystemSchema, PackageTierSchema } from '../research/registry.js';

// ────────────────────────────────────────────────────────────────
// PackageVisibility — PUBLIC (vendor-published, readable by everyone)
// vs PRIVATE (org-scoped, visible only to org members). Mirrors the
// two directories in the marketplace roadmap. PUBLIC is the whole of
// Tier 1; PRIVATE is Tier 3 — the field exists now so the catalog is
// forward-compatible, but the org-gating lands later. Extends the
// per-package `atelier` object in package.json (`atelier.visibility`).
// ────────────────────────────────────────────────────────────────

export const PackageVisibilitySchema = z.enum(['public', 'private']);
export type PackageVisibility = z.infer<typeof PackageVisibilitySchema>;

/** Scoped package id — `@<scope>/<name>`. Matches the registry's
 *  relaxed, scope-agnostic id shape so a directory record and a local
 *  registry entry reference packages identically. */
const PackageIdSchema = z.string().regex(/^@[a-z0-9-]+\/[a-z][a-z0-9-]*$/);

/** A dotted version — permissive on purpose (semver core + optional
 *  pre-release / build), so a cargo `0.1.0-alpha.1` and an npm
 *  `1.2.0` both validate without a full semver grammar. */
const VersionSchema = z.string().regex(/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/);

// ────────────────────────────────────────────────────────────────
// PackageInstallRecipe — how a consumer materializes a package once
// it's chosen from the catalog. Discriminated on `ecosystem` so the
// seam stays neutral while each ecosystem carries exactly the pointer
// its installer needs: npm → a registry URL + a package spec (native
// `pnpm add`); cargo → a crate ref; raw → a download URL + an unpack
// hint. The seam treats this as OPAQUE — it never interprets the
// recipe, only hands it to the matching artifact adapter.
// ────────────────────────────────────────────────────────────────

export const PackageInstallRecipeSchema = z.discriminatedUnion('ecosystem', [
  z.object({
    ecosystem: z.literal('npm'),
    /** The npm-protocol registry that serves the tarball. One of
     *  Verdaccio / npm / GitHub Packages — all speak this protocol, so
     *  the concrete host stays un-committed. */
    registryUrl: z.string().url(),
    /** The install spec a package manager resolves, e.g.
     *  `@unsupervised/core@1.2.0`. */
    spec: z.string().min(1),
  }),
  z.object({
    ecosystem: z.literal('cargo'),
    crate: z.string().min(1),
    version: VersionSchema,
    /** Optional alternate cargo registry (absent ⇒ crates.io). */
    registry: z.string().url().optional(),
  }),
  z.object({
    ecosystem: z.literal('raw'),
    /** Direct artifact download (object storage, release asset, …). */
    downloadUrl: z.string().url(),
    /** How to expand the fetched artifact, when it isn't a plain file. */
    unpack: z.enum(['none', 'tar', 'zip']).default('none'),
  }),
]);
export type PackageInstallRecipe = z.infer<typeof PackageInstallRecipeSchema>;

// ────────────────────────────────────────────────────────────────
// PublishedPackage — one versioned catalog record. The unit the
// directory stores, the workbench renders in search, and the AI
// pipeline resolves before install. Metadata only: the code +
// artifact live in the ecosystem's registry (git stays the source of
// truth), exactly as workbench-cloud holds collaboration metadata and
// never the code itself.
// ────────────────────────────────────────────────────────────────

export const PublishedPackageSchema = z.object({
  id: PackageIdSchema,
  version: VersionSchema,
  /** Artifact protocol — the install-recipe discriminant, surfaced at
   *  the top level so a query can filter by ecosystem without decoding
   *  the recipe. */
  ecosystem: PackageEcosystemSchema.default('npm'),
  /** game / tooling / shared — carried through from the source
   *  package's `atelier.tier` so the directory can scope a search to
   *  "engine packages only". */
  tier: PackageTierSchema.default('unknown'),
  /** PUBLIC (everyone) vs PRIVATE (org-scoped). */
  visibility: PackageVisibilitySchema.default('public'),
  /** The org that owns a PRIVATE package; absent for PUBLIC. When set,
   *  only that org's members may see / resolve the record (Tier 3). */
  orgId: z.string().optional(),
  /** First paragraph of the package's CLAUDE.md — the catalog card's
   *  body. Plain text, capped for search-index budget. */
  description: z.string().max(500),
  /** Capability slugs this package provides (from the local registry's
   *  capability index). What the AI pipeline searches by when it needs
   *  a capability and checks whether a package already covers it. */
  capabilityTags: z.array(z.string()).default([]),
  /** Scoped ids of packages this one depends on — so a resolver can
   *  order a transitive install. */
  dependencies: z.array(PackageIdSchema).default([]),
  /** SHA-256 hex of the published artifact tarball. Integrity check +
   *  cache key; a re-publish of identical bytes is a no-op. */
  artifactDigest: z.string().regex(/^[0-9a-f]{64}$/),
  /** Ecosystem-specific install pointer (opaque to the seam). */
  install: PackageInstallRecipeSchema,
  /** ISO-8601 publish timestamp. */
  publishedAt: z.string(),
  /** Identity of the publisher — the vendor for PUBLIC packages, an org
   *  member for PRIVATE. Free-form; the directory does authz, not this
   *  field. */
  publishedBy: z.string().optional(),
});
export type PublishedPackage = z.infer<typeof PublishedPackageSchema>;

// ────────────────────────────────────────────────────────────────
// PackageQuery — the search request. Every field is an AND filter;
// `text` is a free-text match over id + description + capability tags.
// `visibility` + `orgId` scope PRIVATE results to a caller's org (the
// directory adapter is responsible for never leaking another org's
// private packages regardless of what a query asks for).
// ────────────────────────────────────────────────────────────────

export const PackageQuerySchema = z.object({
  text: z.string().optional(),
  tier: PackageTierSchema.optional(),
  ecosystem: PackageEcosystemSchema.optional(),
  /** Exact capability slug the package must provide. */
  capability: z.string().optional(),
  visibility: PackageVisibilitySchema.optional(),
  /** Caller's org — required to include that org's PRIVATE packages;
   *  absent ⇒ PUBLIC-only results. */
  orgId: z.string().optional(),
  /** Max records to return. */
  limit: z.number().int().positive().max(200).default(50),
});
export type PackageQuery = z.infer<typeof PackageQuerySchema>;

// ────────────────────────────────────────────────────────────────
// PackageSearchResult — a page of catalog records + the unpaged total
// (so a UI can show "showing 50 of 213").
// ────────────────────────────────────────────────────────────────

export const PackageSearchResultSchema = z.object({
  packages: z.array(PublishedPackageSchema),
  total: z.number().int().nonnegative(),
});
export type PackageSearchResult = z.infer<typeof PackageSearchResultSchema>;

// ────────────────────────────────────────────────────────────────
// InstallStep / InstallPlan — the output of the Tier 2 resolve →
// check → plan loop. A plan is a topologically-ordered list of steps
// (dependencies before dependents), each carrying the ecosystem's
// install recipe + a rendered command. `alreadyInstalled` steps stay
// in the plan (so the DAG is legible) but are excluded from
// `commands`. The actual byte-fetch is deferred — a plan is the
// verified INTENT; executing it against a live artifact host is the
// operator / workspace-generation step.
// ────────────────────────────────────────────────────────────────

export const InstallStepSchema = z.object({
  id: PackageIdSchema,
  version: VersionSchema,
  ecosystem: PackageEcosystemSchema,
  /** The ecosystem's install pointer for this package. */
  install: PackageInstallRecipeSchema,
  /** The rendered install command (e.g. `pnpm add @unsupervised/core@1.2.0
   *  --registry <url>`). Ecosystem-specific; a `raw` step renders a
   *  manual-download note. */
  command: z.string(),
  /** Already present in the target workspace's manifest — kept in the
   *  plan for a legible DAG but not re-installed. */
  alreadyInstalled: z.boolean(),
  /** Why the step is here: directly asked for, or pulled in as a
   *  transitive dependency of a requested package. */
  reason: z.enum(['requested', 'dependency']),
});
export type InstallStep = z.infer<typeof InstallStepSchema>;

export const InstallPlanSchema = z.object({
  /** The workspace manifest the plan installs INTO (a path or id — the
   *  planner treats it opaquely). */
  target: z.string(),
  /** Steps in install order: a package's dependencies precede it. */
  steps: z.array(InstallStepSchema),
  /** De-duplicated commands for the not-already-installed steps, in
   *  order — what the operator (or a live executor) runs. */
  commands: z.array(z.string()),
  /** Requested ids the directory could not resolve (absent from the
   *  catalog) — surfaced, never silently dropped. */
  missing: z.array(z.string()),
});
export type InstallPlan = z.infer<typeof InstallPlanSchema>;
