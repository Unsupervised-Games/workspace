// Fabula Art Bible — a singleton document per project defining
// the game's consistent VISUAL direction, the way `overview.md`
// defines its narrative pitch. Where cards are the SUBJECT of a
// generated asset ("draw Sora"), the Art Bible is the STYLE
// ("flat cel-shading, Mononoke palette, 2px outline") — the two
// axes the art pipeline composes into every prompt.
//
// Identity is implicit: one file per project at
// `<project>/narrative/art-bible.md`. No id/slug — the path is
// the identity, mirroring the `overview.md` singleton. The same
// markdown-plus-frontmatter codec + fabula rendering surfaces
// work over it, and the drift detector fingerprints it as a
// grounding source (revise the palette → every asset grounded in
// it goes stale).
//
// The Bible is load-bearing in THREE of the art pipeline's five
// steps: it GROUNDS the prompt (its prose + palette), it is the
// RUBRIC the perceptual judge scores style-consistency against,
// and it is a DRIFT source. The hard machine constraints
// (resolutions, format) are distilled OUT of the Bible into
// `asset-gen.config.ts`; the Bible carries direction, the config
// enforces it.
import { z } from 'zod';
import { AssetRefSchema } from './cards.js';
/** One named palette entry. Grounds prompts ("use kodama-green
 *  for foliage") AND becomes the target set for the palette-
 *  adherence gate at verify time. */
export const PaletteSwatchSchema = z.object({
    /** Human-readable name referenced in the Bible body + prompts. */
    name: z.string().min(1),
    /** Six-digit hex. */
    hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
        message: 'hex must be a 6-digit #RRGGBB value',
    }),
    /** Where this color is allowed to appear. */
    role: z.enum(['core', 'accent', 'ui', 'neutral']).default('core'),
    /** Usage note — 'foliage + spirits only', 'never on UI chrome'. */
    note: z.string().optional(),
});
export const ArtBibleSchema = z.object({
    /** Display title. */
    title: z.string().min(1),
    /** One-line "what this game looks like". */
    summary: z.string().default(''),
    /** 3–5 direction adjectives. Prepended into the distilled
     *  style prefix + read by the judge as style intent. */
    pillars: z.array(z.string().min(1)).default([]),
    /** Influences / references in prose — 'Mononoke by way of
     *  Hyper Light Drifter'. */
    influences: z.string().default(''),
    /** Named palette. Grounds prompts AND targets the palette gate. */
    palette: z.array(PaletteSwatchSchema).default([]),
    /** Visual do-nots — the 'banned terms' analog for art
     *  ('no gradients', 'no lens flare', 'no visible text').
     *  Distilled into `asset-gen.config.ts` bannedTerms + the
     *  vendor negative prompt. */
    negatives: z.array(z.string().min(1)).default([]),
    /** Long-form markdown: rendering model, form language, per-
     *  domain rules (character / world / UI), the silhouette
     *  rule. The primary human-authored surface + the judge's
     *  rubric. */
    body: z.string().default(''),
    /** Reference board — same AssetRef shape as cards / overview.
     *  Feeds a future img2img / style-reference path. */
    assets: z.array(AssetRefSchema).default([]),
    /** Path to a cover / key-art image, relative to project root. */
    cover: z.string().min(1).nullable().default(null),
    /** ISO-8601 timestamps. createdAt stamped when art-bible.md
     *  is created; updatedAt rolls on every patch. */
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
});
//# sourceMappingURL=artBible.js.map