import { z } from 'zod';
/** PUBLIC (vendor-published, everyone) vs PRIVATE (org-scoped). Same enum the
 *  package directory uses. */
export declare const SkillVisibilitySchema: z.ZodEnum<["public", "private"]>;
export type SkillVisibility = z.infer<typeof SkillVisibilitySchema>;
export declare const PublishedSkillSchema: z.ZodObject<{
    slug: z.ZodString;
    /** `name` from the SKILL.md frontmatter (usually equals the slug). */
    name: z.ZodString;
    /** `description` from the SKILL.md frontmatter — the full trigger / context
     *  guidance Claude reads to decide when the skill applies. The catalog card's
     *  body + the primary search field. Skill descriptions run long (the whole
     *  when-to-use spec on one logical line) — the cap is generous on purpose. */
    description: z.ZodString;
    /** First sentence of `description` (derived by the scanner) — the one-line
     *  the search list shows per card. */
    summary: z.ZodString;
    /** PUBLIC (everyone) vs PRIVATE (org-scoped). */
    visibility: z.ZodDefault<z.ZodEnum<["public", "private"]>>;
    /** The org that owns a PRIVATE skill; absent for PUBLIC. When set, only that
     *  org's members may see / resolve the record. */
    orgId: z.ZodOptional<z.ZodString>;
    /** Capability slugs this skill helps with — what the AI pipeline / search
     *  filters by ("narrative", "audio", "review"). */
    capabilityTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** True when the skill folder carries files besides SKILL.md (reference
     *  docs, prompts, scripts) — so an installer copies the whole folder, not
     *  just the markdown. */
    hasResources: z.ZodDefault<z.ZodBoolean>;
    /** SHA-256 hex of the skill folder's content (canonical over SKILL.md +
     *  every resource). Integrity check + the staleness/drift key: a re-publish
     *  of identical content is a no-op; a changed hash means "update available". */
    contentHash: z.ZodString;
    /** ISO-8601 publish timestamp. */
    publishedAt: z.ZodString;
    /** Publisher identity — the vendor for PUBLIC, an org member for PRIVATE.
     *  Advisory; the directory does authz, not this field. */
    publishedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    contentHash: string;
    summary: string;
    slug: string;
    visibility: "public" | "private";
    capabilityTags: string[];
    publishedAt: string;
    hasResources: boolean;
    orgId?: string | undefined;
    publishedBy?: string | undefined;
}, {
    description: string;
    name: string;
    contentHash: string;
    summary: string;
    slug: string;
    publishedAt: string;
    orgId?: string | undefined;
    visibility?: "public" | "private" | undefined;
    capabilityTags?: string[] | undefined;
    publishedBy?: string | undefined;
    hasResources?: boolean | undefined;
}>;
export type PublishedSkill = z.infer<typeof PublishedSkillSchema>;
export declare const SkillQuerySchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    /** Exact capability slug the skill must carry. */
    capability: z.ZodOptional<z.ZodString>;
    visibility: z.ZodOptional<z.ZodEnum<["public", "private"]>>;
    /** Caller's org — required to include that org's PRIVATE skills; absent ⇒
     *  PUBLIC-only results. */
    orgId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    text?: string | undefined;
    orgId?: string | undefined;
    visibility?: "public" | "private" | undefined;
    capability?: string | undefined;
}, {
    text?: string | undefined;
    orgId?: string | undefined;
    visibility?: "public" | "private" | undefined;
    capability?: string | undefined;
    limit?: number | undefined;
}>;
export type SkillQuery = z.infer<typeof SkillQuerySchema>;
export declare const SkillSearchResultSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodObject<{
        slug: z.ZodString;
        /** `name` from the SKILL.md frontmatter (usually equals the slug). */
        name: z.ZodString;
        /** `description` from the SKILL.md frontmatter — the full trigger / context
         *  guidance Claude reads to decide when the skill applies. The catalog card's
         *  body + the primary search field. Skill descriptions run long (the whole
         *  when-to-use spec on one logical line) — the cap is generous on purpose. */
        description: z.ZodString;
        /** First sentence of `description` (derived by the scanner) — the one-line
         *  the search list shows per card. */
        summary: z.ZodString;
        /** PUBLIC (everyone) vs PRIVATE (org-scoped). */
        visibility: z.ZodDefault<z.ZodEnum<["public", "private"]>>;
        /** The org that owns a PRIVATE skill; absent for PUBLIC. When set, only that
         *  org's members may see / resolve the record. */
        orgId: z.ZodOptional<z.ZodString>;
        /** Capability slugs this skill helps with — what the AI pipeline / search
         *  filters by ("narrative", "audio", "review"). */
        capabilityTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** True when the skill folder carries files besides SKILL.md (reference
         *  docs, prompts, scripts) — so an installer copies the whole folder, not
         *  just the markdown. */
        hasResources: z.ZodDefault<z.ZodBoolean>;
        /** SHA-256 hex of the skill folder's content (canonical over SKILL.md +
         *  every resource). Integrity check + the staleness/drift key: a re-publish
         *  of identical content is a no-op; a changed hash means "update available". */
        contentHash: z.ZodString;
        /** ISO-8601 publish timestamp. */
        publishedAt: z.ZodString;
        /** Publisher identity — the vendor for PUBLIC, an org member for PRIVATE.
         *  Advisory; the directory does authz, not this field. */
        publishedBy: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        visibility: "public" | "private";
        capabilityTags: string[];
        publishedAt: string;
        hasResources: boolean;
        orgId?: string | undefined;
        publishedBy?: string | undefined;
    }, {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        publishedAt: string;
        orgId?: string | undefined;
        visibility?: "public" | "private" | undefined;
        capabilityTags?: string[] | undefined;
        publishedBy?: string | undefined;
        hasResources?: boolean | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    skills: {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        visibility: "public" | "private";
        capabilityTags: string[];
        publishedAt: string;
        hasResources: boolean;
        orgId?: string | undefined;
        publishedBy?: string | undefined;
    }[];
}, {
    total: number;
    skills: {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        publishedAt: string;
        orgId?: string | undefined;
        visibility?: "public" | "private" | undefined;
        capabilityTags?: string[] | undefined;
        publishedBy?: string | undefined;
        hasResources?: boolean | undefined;
    }[];
}>;
export type SkillSearchResult = z.infer<typeof SkillSearchResultSchema>;
export declare const PublishedSkillCatalogSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    /** ISO-8601 timestamp of when the catalog was generated (optional). */
    generatedAt: z.ZodOptional<z.ZodString>;
    skills: z.ZodArray<z.ZodObject<{
        slug: z.ZodString;
        /** `name` from the SKILL.md frontmatter (usually equals the slug). */
        name: z.ZodString;
        /** `description` from the SKILL.md frontmatter — the full trigger / context
         *  guidance Claude reads to decide when the skill applies. The catalog card's
         *  body + the primary search field. Skill descriptions run long (the whole
         *  when-to-use spec on one logical line) — the cap is generous on purpose. */
        description: z.ZodString;
        /** First sentence of `description` (derived by the scanner) — the one-line
         *  the search list shows per card. */
        summary: z.ZodString;
        /** PUBLIC (everyone) vs PRIVATE (org-scoped). */
        visibility: z.ZodDefault<z.ZodEnum<["public", "private"]>>;
        /** The org that owns a PRIVATE skill; absent for PUBLIC. When set, only that
         *  org's members may see / resolve the record. */
        orgId: z.ZodOptional<z.ZodString>;
        /** Capability slugs this skill helps with — what the AI pipeline / search
         *  filters by ("narrative", "audio", "review"). */
        capabilityTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** True when the skill folder carries files besides SKILL.md (reference
         *  docs, prompts, scripts) — so an installer copies the whole folder, not
         *  just the markdown. */
        hasResources: z.ZodDefault<z.ZodBoolean>;
        /** SHA-256 hex of the skill folder's content (canonical over SKILL.md +
         *  every resource). Integrity check + the staleness/drift key: a re-publish
         *  of identical content is a no-op; a changed hash means "update available". */
        contentHash: z.ZodString;
        /** ISO-8601 publish timestamp. */
        publishedAt: z.ZodString;
        /** Publisher identity — the vendor for PUBLIC, an org member for PRIVATE.
         *  Advisory; the directory does authz, not this field. */
        publishedBy: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        visibility: "public" | "private";
        capabilityTags: string[];
        publishedAt: string;
        hasResources: boolean;
        orgId?: string | undefined;
        publishedBy?: string | undefined;
    }, {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        publishedAt: string;
        orgId?: string | undefined;
        visibility?: "public" | "private" | undefined;
        capabilityTags?: string[] | undefined;
        publishedBy?: string | undefined;
        hasResources?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: 1;
    skills: {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        visibility: "public" | "private";
        capabilityTags: string[];
        publishedAt: string;
        hasResources: boolean;
        orgId?: string | undefined;
        publishedBy?: string | undefined;
    }[];
    generatedAt?: string | undefined;
}, {
    version: 1;
    skills: {
        description: string;
        name: string;
        contentHash: string;
        summary: string;
        slug: string;
        publishedAt: string;
        orgId?: string | undefined;
        visibility?: "public" | "private" | undefined;
        capabilityTags?: string[] | undefined;
        publishedBy?: string | undefined;
        hasResources?: boolean | undefined;
    }[];
    generatedAt?: string | undefined;
}>;
export type PublishedSkillCatalog = z.infer<typeof PublishedSkillCatalogSchema>;
//# sourceMappingURL=skillDirectory.d.ts.map