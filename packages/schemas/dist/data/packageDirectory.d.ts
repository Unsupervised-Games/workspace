import { z } from 'zod';
export declare const PackageVisibilitySchema: z.ZodEnum<["public", "private"]>;
export type PackageVisibility = z.infer<typeof PackageVisibilitySchema>;
export declare const PackageInstallRecipeSchema: z.ZodDiscriminatedUnion<"ecosystem", [z.ZodObject<{
    ecosystem: z.ZodLiteral<"npm">;
    /** The npm-protocol registry that serves the tarball. One of
     *  Verdaccio / npm / GitHub Packages — all speak this protocol, so
     *  the concrete host stays un-committed. */
    registryUrl: z.ZodString;
    /** The install spec a package manager resolves, e.g.
     *  `@unsupervised/core@1.2.0`. */
    spec: z.ZodString;
}, "strip", z.ZodTypeAny, {
    ecosystem: "npm";
    registryUrl: string;
    spec: string;
}, {
    ecosystem: "npm";
    registryUrl: string;
    spec: string;
}>, z.ZodObject<{
    ecosystem: z.ZodLiteral<"cargo">;
    crate: z.ZodString;
    version: z.ZodString;
    /** Optional alternate cargo registry (absent ⇒ crates.io). */
    registry: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: string;
    ecosystem: "cargo";
    crate: string;
    registry?: string | undefined;
}, {
    version: string;
    ecosystem: "cargo";
    crate: string;
    registry?: string | undefined;
}>, z.ZodObject<{
    ecosystem: z.ZodLiteral<"raw">;
    /** Direct artifact download (object storage, release asset, …). */
    downloadUrl: z.ZodString;
    /** How to expand the fetched artifact, when it isn't a plain file. */
    unpack: z.ZodDefault<z.ZodEnum<["none", "tar", "zip"]>>;
}, "strip", z.ZodTypeAny, {
    ecosystem: "raw";
    downloadUrl: string;
    unpack: "none" | "tar" | "zip";
}, {
    ecosystem: "raw";
    downloadUrl: string;
    unpack?: "none" | "tar" | "zip" | undefined;
}>]>;
export type PackageInstallRecipe = z.infer<typeof PackageInstallRecipeSchema>;
export declare const PublishedPackageSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    /** Artifact protocol — the install-recipe discriminant, surfaced at
     *  the top level so a query can filter by ecosystem without decoding
     *  the recipe. */
    ecosystem: z.ZodDefault<z.ZodEnum<["npm", "cargo", "raw"]>>;
    /** game / tooling / shared — carried through from the source
     *  package's `atelier.tier` so the directory can scope a search to
     *  "engine packages only". */
    tier: z.ZodDefault<z.ZodEnum<["game", "tooling", "shared", "unknown"]>>;
    /** PUBLIC (everyone) vs PRIVATE (org-scoped). */
    visibility: z.ZodDefault<z.ZodEnum<["public", "private"]>>;
    /** The org that owns a PRIVATE package; absent for PUBLIC. When set,
     *  only that org's members may see / resolve the record (Tier 3). */
    orgId: z.ZodOptional<z.ZodString>;
    /** First paragraph of the package's CLAUDE.md — the catalog card's
     *  body. Plain text, capped for search-index budget. */
    description: z.ZodString;
    /** Capability slugs this package provides (from the local registry's
     *  capability index). What the AI pipeline searches by when it needs
     *  a capability and checks whether a package already covers it. */
    capabilityTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Scoped ids of packages this one depends on — so a resolver can
     *  order a transitive install. */
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** SHA-256 hex of the published artifact tarball. Integrity check +
     *  cache key; a re-publish of identical bytes is a no-op. */
    artifactDigest: z.ZodString;
    /** Ecosystem-specific install pointer (opaque to the seam). */
    install: z.ZodDiscriminatedUnion<"ecosystem", [z.ZodObject<{
        ecosystem: z.ZodLiteral<"npm">;
        /** The npm-protocol registry that serves the tarball. One of
         *  Verdaccio / npm / GitHub Packages — all speak this protocol, so
         *  the concrete host stays un-committed. */
        registryUrl: z.ZodString;
        /** The install spec a package manager resolves, e.g.
         *  `@unsupervised/core@1.2.0`. */
        spec: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    }, {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    }>, z.ZodObject<{
        ecosystem: z.ZodLiteral<"cargo">;
        crate: z.ZodString;
        version: z.ZodString;
        /** Optional alternate cargo registry (absent ⇒ crates.io). */
        registry: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    }, {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    }>, z.ZodObject<{
        ecosystem: z.ZodLiteral<"raw">;
        /** Direct artifact download (object storage, release asset, …). */
        downloadUrl: z.ZodString;
        /** How to expand the fetched artifact, when it isn't a plain file. */
        unpack: z.ZodDefault<z.ZodEnum<["none", "tar", "zip"]>>;
    }, "strip", z.ZodTypeAny, {
        ecosystem: "raw";
        downloadUrl: string;
        unpack: "none" | "tar" | "zip";
    }, {
        ecosystem: "raw";
        downloadUrl: string;
        unpack?: "none" | "tar" | "zip" | undefined;
    }>]>;
    /** ISO-8601 publish timestamp. */
    publishedAt: z.ZodString;
    /** Identity of the publisher — the vendor for PUBLIC packages, an org
     *  member for PRIVATE. Free-form; the directory does authz, not this
     *  field. */
    publishedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    version: string;
    tier: "unknown" | "tooling" | "game" | "shared";
    ecosystem: "npm" | "cargo" | "raw";
    visibility: "public" | "private";
    capabilityTags: string[];
    dependencies: string[];
    artifactDigest: string;
    install: {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    } | {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    } | {
        ecosystem: "raw";
        downloadUrl: string;
        unpack: "none" | "tar" | "zip";
    };
    publishedAt: string;
    orgId?: string | undefined;
    publishedBy?: string | undefined;
}, {
    description: string;
    id: string;
    version: string;
    artifactDigest: string;
    install: {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    } | {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    } | {
        ecosystem: "raw";
        downloadUrl: string;
        unpack?: "none" | "tar" | "zip" | undefined;
    };
    publishedAt: string;
    orgId?: string | undefined;
    tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
    ecosystem?: "npm" | "cargo" | "raw" | undefined;
    visibility?: "public" | "private" | undefined;
    capabilityTags?: string[] | undefined;
    dependencies?: string[] | undefined;
    publishedBy?: string | undefined;
}>;
export type PublishedPackage = z.infer<typeof PublishedPackageSchema>;
export declare const PackageQuerySchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    tier: z.ZodOptional<z.ZodEnum<["game", "tooling", "shared", "unknown"]>>;
    ecosystem: z.ZodOptional<z.ZodEnum<["npm", "cargo", "raw"]>>;
    /** Exact capability slug the package must provide. */
    capability: z.ZodOptional<z.ZodString>;
    visibility: z.ZodOptional<z.ZodEnum<["public", "private"]>>;
    /** Caller's org — required to include that org's PRIVATE packages;
     *  absent ⇒ PUBLIC-only results. */
    orgId: z.ZodOptional<z.ZodString>;
    /** Max records to return. */
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    text?: string | undefined;
    orgId?: string | undefined;
    tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
    ecosystem?: "npm" | "cargo" | "raw" | undefined;
    visibility?: "public" | "private" | undefined;
    capability?: string | undefined;
}, {
    text?: string | undefined;
    orgId?: string | undefined;
    tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
    ecosystem?: "npm" | "cargo" | "raw" | undefined;
    visibility?: "public" | "private" | undefined;
    capability?: string | undefined;
    limit?: number | undefined;
}>;
export type PackageQuery = z.infer<typeof PackageQuerySchema>;
export declare const PackageSearchResultSchema: z.ZodObject<{
    packages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        version: z.ZodString;
        /** Artifact protocol — the install-recipe discriminant, surfaced at
         *  the top level so a query can filter by ecosystem without decoding
         *  the recipe. */
        ecosystem: z.ZodDefault<z.ZodEnum<["npm", "cargo", "raw"]>>;
        /** game / tooling / shared — carried through from the source
         *  package's `atelier.tier` so the directory can scope a search to
         *  "engine packages only". */
        tier: z.ZodDefault<z.ZodEnum<["game", "tooling", "shared", "unknown"]>>;
        /** PUBLIC (everyone) vs PRIVATE (org-scoped). */
        visibility: z.ZodDefault<z.ZodEnum<["public", "private"]>>;
        /** The org that owns a PRIVATE package; absent for PUBLIC. When set,
         *  only that org's members may see / resolve the record (Tier 3). */
        orgId: z.ZodOptional<z.ZodString>;
        /** First paragraph of the package's CLAUDE.md — the catalog card's
         *  body. Plain text, capped for search-index budget. */
        description: z.ZodString;
        /** Capability slugs this package provides (from the local registry's
         *  capability index). What the AI pipeline searches by when it needs
         *  a capability and checks whether a package already covers it. */
        capabilityTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Scoped ids of packages this one depends on — so a resolver can
         *  order a transitive install. */
        dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** SHA-256 hex of the published artifact tarball. Integrity check +
         *  cache key; a re-publish of identical bytes is a no-op. */
        artifactDigest: z.ZodString;
        /** Ecosystem-specific install pointer (opaque to the seam). */
        install: z.ZodDiscriminatedUnion<"ecosystem", [z.ZodObject<{
            ecosystem: z.ZodLiteral<"npm">;
            /** The npm-protocol registry that serves the tarball. One of
             *  Verdaccio / npm / GitHub Packages — all speak this protocol, so
             *  the concrete host stays un-committed. */
            registryUrl: z.ZodString;
            /** The install spec a package manager resolves, e.g.
             *  `@unsupervised/core@1.2.0`. */
            spec: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        }, {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        }>, z.ZodObject<{
            ecosystem: z.ZodLiteral<"cargo">;
            crate: z.ZodString;
            version: z.ZodString;
            /** Optional alternate cargo registry (absent ⇒ crates.io). */
            registry: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        }, {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        }>, z.ZodObject<{
            ecosystem: z.ZodLiteral<"raw">;
            /** Direct artifact download (object storage, release asset, …). */
            downloadUrl: z.ZodString;
            /** How to expand the fetched artifact, when it isn't a plain file. */
            unpack: z.ZodDefault<z.ZodEnum<["none", "tar", "zip"]>>;
        }, "strip", z.ZodTypeAny, {
            ecosystem: "raw";
            downloadUrl: string;
            unpack: "none" | "tar" | "zip";
        }, {
            ecosystem: "raw";
            downloadUrl: string;
            unpack?: "none" | "tar" | "zip" | undefined;
        }>]>;
        /** ISO-8601 publish timestamp. */
        publishedAt: z.ZodString;
        /** Identity of the publisher — the vendor for PUBLIC packages, an org
         *  member for PRIVATE. Free-form; the directory does authz, not this
         *  field. */
        publishedBy: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        id: string;
        version: string;
        tier: "unknown" | "tooling" | "game" | "shared";
        ecosystem: "npm" | "cargo" | "raw";
        visibility: "public" | "private";
        capabilityTags: string[];
        dependencies: string[];
        artifactDigest: string;
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack: "none" | "tar" | "zip";
        };
        publishedAt: string;
        orgId?: string | undefined;
        publishedBy?: string | undefined;
    }, {
        description: string;
        id: string;
        version: string;
        artifactDigest: string;
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack?: "none" | "tar" | "zip" | undefined;
        };
        publishedAt: string;
        orgId?: string | undefined;
        tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
        ecosystem?: "npm" | "cargo" | "raw" | undefined;
        visibility?: "public" | "private" | undefined;
        capabilityTags?: string[] | undefined;
        dependencies?: string[] | undefined;
        publishedBy?: string | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    packages: {
        description: string;
        id: string;
        version: string;
        tier: "unknown" | "tooling" | "game" | "shared";
        ecosystem: "npm" | "cargo" | "raw";
        visibility: "public" | "private";
        capabilityTags: string[];
        dependencies: string[];
        artifactDigest: string;
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack: "none" | "tar" | "zip";
        };
        publishedAt: string;
        orgId?: string | undefined;
        publishedBy?: string | undefined;
    }[];
    total: number;
}, {
    packages: {
        description: string;
        id: string;
        version: string;
        artifactDigest: string;
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack?: "none" | "tar" | "zip" | undefined;
        };
        publishedAt: string;
        orgId?: string | undefined;
        tier?: "unknown" | "tooling" | "game" | "shared" | undefined;
        ecosystem?: "npm" | "cargo" | "raw" | undefined;
        visibility?: "public" | "private" | undefined;
        capabilityTags?: string[] | undefined;
        dependencies?: string[] | undefined;
        publishedBy?: string | undefined;
    }[];
    total: number;
}>;
export type PackageSearchResult = z.infer<typeof PackageSearchResultSchema>;
export declare const InstallStepSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    ecosystem: z.ZodEnum<["npm", "cargo", "raw"]>;
    /** The ecosystem's install pointer for this package. */
    install: z.ZodDiscriminatedUnion<"ecosystem", [z.ZodObject<{
        ecosystem: z.ZodLiteral<"npm">;
        /** The npm-protocol registry that serves the tarball. One of
         *  Verdaccio / npm / GitHub Packages — all speak this protocol, so
         *  the concrete host stays un-committed. */
        registryUrl: z.ZodString;
        /** The install spec a package manager resolves, e.g.
         *  `@unsupervised/core@1.2.0`. */
        spec: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    }, {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    }>, z.ZodObject<{
        ecosystem: z.ZodLiteral<"cargo">;
        crate: z.ZodString;
        version: z.ZodString;
        /** Optional alternate cargo registry (absent ⇒ crates.io). */
        registry: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    }, {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    }>, z.ZodObject<{
        ecosystem: z.ZodLiteral<"raw">;
        /** Direct artifact download (object storage, release asset, …). */
        downloadUrl: z.ZodString;
        /** How to expand the fetched artifact, when it isn't a plain file. */
        unpack: z.ZodDefault<z.ZodEnum<["none", "tar", "zip"]>>;
    }, "strip", z.ZodTypeAny, {
        ecosystem: "raw";
        downloadUrl: string;
        unpack: "none" | "tar" | "zip";
    }, {
        ecosystem: "raw";
        downloadUrl: string;
        unpack?: "none" | "tar" | "zip" | undefined;
    }>]>;
    /** The rendered install command (e.g. `pnpm add @unsupervised/core@1.2.0
     *  --registry <url>`). Ecosystem-specific; a `raw` step renders a
     *  manual-download note. */
    command: z.ZodString;
    /** Already present in the target workspace's manifest — kept in the
     *  plan for a legible DAG but not re-installed. */
    alreadyInstalled: z.ZodBoolean;
    /** Why the step is here: directly asked for, or pulled in as a
     *  transitive dependency of a requested package. */
    reason: z.ZodEnum<["requested", "dependency"]>;
}, "strip", z.ZodTypeAny, {
    reason: "requested" | "dependency";
    id: string;
    version: string;
    command: string;
    ecosystem: "npm" | "cargo" | "raw";
    install: {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    } | {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    } | {
        ecosystem: "raw";
        downloadUrl: string;
        unpack: "none" | "tar" | "zip";
    };
    alreadyInstalled: boolean;
}, {
    reason: "requested" | "dependency";
    id: string;
    version: string;
    command: string;
    ecosystem: "npm" | "cargo" | "raw";
    install: {
        ecosystem: "npm";
        registryUrl: string;
        spec: string;
    } | {
        version: string;
        ecosystem: "cargo";
        crate: string;
        registry?: string | undefined;
    } | {
        ecosystem: "raw";
        downloadUrl: string;
        unpack?: "none" | "tar" | "zip" | undefined;
    };
    alreadyInstalled: boolean;
}>;
export type InstallStep = z.infer<typeof InstallStepSchema>;
export declare const InstallPlanSchema: z.ZodObject<{
    /** The workspace manifest the plan installs INTO (a path or id — the
     *  planner treats it opaquely). */
    target: z.ZodString;
    /** Steps in install order: a package's dependencies precede it. */
    steps: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        version: z.ZodString;
        ecosystem: z.ZodEnum<["npm", "cargo", "raw"]>;
        /** The ecosystem's install pointer for this package. */
        install: z.ZodDiscriminatedUnion<"ecosystem", [z.ZodObject<{
            ecosystem: z.ZodLiteral<"npm">;
            /** The npm-protocol registry that serves the tarball. One of
             *  Verdaccio / npm / GitHub Packages — all speak this protocol, so
             *  the concrete host stays un-committed. */
            registryUrl: z.ZodString;
            /** The install spec a package manager resolves, e.g.
             *  `@unsupervised/core@1.2.0`. */
            spec: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        }, {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        }>, z.ZodObject<{
            ecosystem: z.ZodLiteral<"cargo">;
            crate: z.ZodString;
            version: z.ZodString;
            /** Optional alternate cargo registry (absent ⇒ crates.io). */
            registry: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        }, {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        }>, z.ZodObject<{
            ecosystem: z.ZodLiteral<"raw">;
            /** Direct artifact download (object storage, release asset, …). */
            downloadUrl: z.ZodString;
            /** How to expand the fetched artifact, when it isn't a plain file. */
            unpack: z.ZodDefault<z.ZodEnum<["none", "tar", "zip"]>>;
        }, "strip", z.ZodTypeAny, {
            ecosystem: "raw";
            downloadUrl: string;
            unpack: "none" | "tar" | "zip";
        }, {
            ecosystem: "raw";
            downloadUrl: string;
            unpack?: "none" | "tar" | "zip" | undefined;
        }>]>;
        /** The rendered install command (e.g. `pnpm add @unsupervised/core@1.2.0
         *  --registry <url>`). Ecosystem-specific; a `raw` step renders a
         *  manual-download note. */
        command: z.ZodString;
        /** Already present in the target workspace's manifest — kept in the
         *  plan for a legible DAG but not re-installed. */
        alreadyInstalled: z.ZodBoolean;
        /** Why the step is here: directly asked for, or pulled in as a
         *  transitive dependency of a requested package. */
        reason: z.ZodEnum<["requested", "dependency"]>;
    }, "strip", z.ZodTypeAny, {
        reason: "requested" | "dependency";
        id: string;
        version: string;
        command: string;
        ecosystem: "npm" | "cargo" | "raw";
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack: "none" | "tar" | "zip";
        };
        alreadyInstalled: boolean;
    }, {
        reason: "requested" | "dependency";
        id: string;
        version: string;
        command: string;
        ecosystem: "npm" | "cargo" | "raw";
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack?: "none" | "tar" | "zip" | undefined;
        };
        alreadyInstalled: boolean;
    }>, "many">;
    /** De-duplicated commands for the not-already-installed steps, in
     *  order — what the operator (or a live executor) runs. */
    commands: z.ZodArray<z.ZodString, "many">;
    /** Requested ids the directory could not resolve (absent from the
     *  catalog) — surfaced, never silently dropped. */
    missing: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    steps: {
        reason: "requested" | "dependency";
        id: string;
        version: string;
        command: string;
        ecosystem: "npm" | "cargo" | "raw";
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack: "none" | "tar" | "zip";
        };
        alreadyInstalled: boolean;
    }[];
    target: string;
    commands: string[];
    missing: string[];
}, {
    steps: {
        reason: "requested" | "dependency";
        id: string;
        version: string;
        command: string;
        ecosystem: "npm" | "cargo" | "raw";
        install: {
            ecosystem: "npm";
            registryUrl: string;
            spec: string;
        } | {
            version: string;
            ecosystem: "cargo";
            crate: string;
            registry?: string | undefined;
        } | {
            ecosystem: "raw";
            downloadUrl: string;
            unpack?: "none" | "tar" | "zip" | undefined;
        };
        alreadyInstalled: boolean;
    }[];
    target: string;
    commands: string[];
    missing: string[];
}>;
export type InstallPlan = z.infer<typeof InstallPlanSchema>;
//# sourceMappingURL=packageDirectory.d.ts.map