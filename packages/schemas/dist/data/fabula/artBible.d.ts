import { z } from 'zod';
/** One named palette entry. Grounds prompts ("use kodama-green
 *  for foliage") AND becomes the target set for the palette-
 *  adherence gate at verify time. */
export declare const PaletteSwatchSchema: z.ZodObject<{
    /** Human-readable name referenced in the Bible body + prompts. */
    name: z.ZodString;
    /** Six-digit hex. */
    hex: z.ZodString;
    /** Where this color is allowed to appear. */
    role: z.ZodDefault<z.ZodEnum<["core", "accent", "ui", "neutral"]>>;
    /** Usage note — 'foliage + spirits only', 'never on UI chrome'. */
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    role: "ui" | "core" | "accent" | "neutral";
    name: string;
    hex: string;
    note?: string | undefined;
}, {
    name: string;
    hex: string;
    role?: "ui" | "core" | "accent" | "neutral" | undefined;
    note?: string | undefined;
}>;
export type PaletteSwatch = z.infer<typeof PaletteSwatchSchema>;
export declare const ArtBibleSchema: z.ZodObject<{
    /** Display title. */
    title: z.ZodString;
    /** One-line "what this game looks like". */
    summary: z.ZodDefault<z.ZodString>;
    /** 3–5 direction adjectives. Prepended into the distilled
     *  style prefix + read by the judge as style intent. */
    pillars: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Influences / references in prose — 'Mononoke by way of
     *  Hyper Light Drifter'. */
    influences: z.ZodDefault<z.ZodString>;
    /** Named palette. Grounds prompts AND targets the palette gate. */
    palette: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Human-readable name referenced in the Bible body + prompts. */
        name: z.ZodString;
        /** Six-digit hex. */
        hex: z.ZodString;
        /** Where this color is allowed to appear. */
        role: z.ZodDefault<z.ZodEnum<["core", "accent", "ui", "neutral"]>>;
        /** Usage note — 'foliage + spirits only', 'never on UI chrome'. */
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        role: "ui" | "core" | "accent" | "neutral";
        name: string;
        hex: string;
        note?: string | undefined;
    }, {
        name: string;
        hex: string;
        role?: "ui" | "core" | "accent" | "neutral" | undefined;
        note?: string | undefined;
    }>, "many">>;
    /** Visual do-nots — the 'banned terms' analog for art
     *  ('no gradients', 'no lens flare', 'no visible text').
     *  Distilled into `asset-gen.config.ts` bannedTerms + the
     *  vendor negative prompt. */
    negatives: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown: rendering model, form language, per-
     *  domain rules (character / world / UI), the silhouette
     *  rule. The primary human-authored surface + the judge's
     *  rubric. */
    body: z.ZodDefault<z.ZodString>;
    /** Reference board — same AssetRef shape as cards / overview.
     *  Feeds a future img2img / style-reference path. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "model" | "image" | "audio" | "data";
        label?: string | undefined;
    }, {
        path: string;
        kind: "model" | "image" | "audio" | "data";
        label?: string | undefined;
    }>, "many">>;
    /** Path to a cover / key-art image, relative to project root. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. createdAt stamped when art-bible.md
     *  is created; updatedAt rolls on every patch. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    summary: string;
    pillars: string[];
    influences: string;
    palette: {
        role: "ui" | "core" | "accent" | "neutral";
        name: string;
        hex: string;
        note?: string | undefined;
    }[];
    negatives: string[];
    body: string;
    assets: {
        path: string;
        kind: "model" | "image" | "audio" | "data";
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
    pillars?: string[] | undefined;
    influences?: string | undefined;
    palette?: {
        name: string;
        hex: string;
        role?: "ui" | "core" | "accent" | "neutral" | undefined;
        note?: string | undefined;
    }[] | undefined;
    negatives?: string[] | undefined;
    body?: string | undefined;
    assets?: {
        path: string;
        kind: "model" | "image" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
}>;
export type ArtBible = z.infer<typeof ArtBibleSchema>;
//# sourceMappingURL=artBible.d.ts.map