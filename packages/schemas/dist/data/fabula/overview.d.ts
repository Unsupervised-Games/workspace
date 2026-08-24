import { z } from 'zod';
export declare const OverviewSchema: z.ZodObject<{
    /** Display title. Defaults to the project's folder name
     *  at first edit (the OverviewEditor pre-fills the field)
     *  but the user can freely rewrite it. */
    title: z.ZodString;
    /** Short pitch / logline. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. Premise, themes, world rules,
     *  story arc, anything the writer wants top-level. */
    body: z.ZodDefault<z.ZodString>;
    /** Asset references — cover art, pitch deck pages, tone
     *  references. Same shape + storage convention as on
     *  Card / Scene. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }, {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }>, "many">>;
    /** Path to a cover image, relative to the project root. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. createdAt is stamped at first
     *  save (when overview.md is created); updatedAt rolls
     *  on every patch. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    summary: string;
    tags: string[];
    body: string;
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
}, {
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
}>;
export type Overview = z.infer<typeof OverviewSchema>;
//# sourceMappingURL=overview.d.ts.map