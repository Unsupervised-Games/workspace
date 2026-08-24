// Fabula project overview — a singleton document per
// project describing the game / world / book as a whole.
// Where cards are atoms and scenes are compositions, the
// overview is the writer's "what is this project about"
// document — pitch, premise, tone, sources of inspiration,
// recurring themes.
//
// Identity is implicit: one file per project at
// `<project>/overview.md`. No id/slug field — the file path
// is the identity. The schema mirrors the Card / Scene
// envelope (sans type/subtype/cards) so the same codec +
// rendering surfaces work over it.
import { z } from 'zod';
import { AssetRefSchema } from './cards.js';
export const OverviewSchema = z.object({
    /** Display title. Defaults to the project's folder name
     *  at first edit (the OverviewEditor pre-fills the field)
     *  but the user can freely rewrite it. */
    title: z.string().min(1),
    /** Short pitch / logline. */
    summary: z.string().default(''),
    /** Free-form tags. */
    tags: z.array(z.string().min(1)).default([]),
    /** Long-form markdown body. Premise, themes, world rules,
     *  story arc, anything the writer wants top-level. */
    body: z.string().default(''),
    /** Asset references — cover art, pitch deck pages, tone
     *  references. Same shape + storage convention as on
     *  Card / Scene. */
    assets: z.array(AssetRefSchema).default([]),
    /** Path to a cover image, relative to the project root. */
    cover: z.string().min(1).nullable().default(null),
    /** ISO-8601 timestamps. createdAt is stamped at first
     *  save (when overview.md is created); updatedAt rolls
     *  on every patch. */
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
});
//# sourceMappingURL=overview.js.map