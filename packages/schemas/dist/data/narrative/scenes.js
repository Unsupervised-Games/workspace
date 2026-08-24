// Narrative scene schema — the next layer up from cards.
//
// A Scene composes Cards into a sequential narrative unit
// (a chapter, an episode, a sequence). Scenes share most of
// the Card envelope (title, summary, body, tags, related,
// assets, cover, timestamps) but drop the type/subtype
// discriminator and add a `cards: string[]` field — an
// ordered list of card-id references.
//
// Identity: `scene:<slug>` — slug-based + type-prefixed for
// symmetry with cards (`character:sora`, `scene:opening`).
// The shared `<prefix>:<slug>` shape means cards' `related`
// field can reference scenes and vice versa without any
// schema change.
//
// Storage: one scene → one file at `<project>/scenes/<slug>.md`,
// markdown + YAML frontmatter via the same codec cards use.
import { z } from 'zod';
import { AssetRefSchema, RelationSchema } from './cards.js';
/** A card-id reference inside a scene's `cards` array.
 *  Order in the array IS the order in the scene; reorder
 *  via the editor's up/down controls writes back the
 *  shuffled array. Matches the same `type:slug` regex used
 *  for the `related` field; nothing prevents a scene from
 *  containing another scene's id (e.g., a "framing" scene
 *  wrapping a flashback scene). */
const SceneCardIdSchema = z.string().min(1).regex(/^[a-z]+:[a-z0-9-]+$/, {
    message: "scene card reference must be of form 'type:slug'",
});
export const SceneSchema = z.object({
    /** Globally unique id of form `scene:<slug>`. Stable for
     *  the scene's lifetime — renaming the title leaves the
     *  id (and on-disk filename) untouched so card → scene
     *  references via `related` stay valid. */
    id: z.string().min(1).regex(/^scene:[a-z0-9-]+$/, {
        message: "scene id must be of form 'scene:<slug>'",
    }),
    /** Filename slug (the portion of `id` after the colon).
     *  Equals the on-disk filename without extension. */
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    /** Display name. Freely editable; doesn't affect the slug. */
    title: z.string().min(1),
    /** Short one-line summary. Surfaced in the sidebar row
     *  and search previews. */
    summary: z.string().default(''),
    /** Free-form tags. Cross-cuts the scene catalog by themes
     *  / acts / locations / mood. */
    tags: z.array(z.string().min(1)).default([]),
    /** Long-form markdown body. Establishing notes, pacing,
     *  mood, transitions, anything that isn't card content. */
    body: z.string().default(''),
    /** Typed, one-way relationships to other entities.
     *  Schema-shared with cards (`Relation = { targetId,
     *  type }`). Use cases: sequel-of / parallel-to / mirror-
     *  of for scene-to-scene; references-event / features-
     *  faction for scene-to-card. v1 UI scopes targets to
     *  cards; the schema accepts any entity-shaped id so
     *  future cross-entity edges don't need a migration. */
    relationships: z.array(RelationSchema).default([]),
    /** Asset references — concept art / storyboards / audio
     *  cues attached to the scene itself (vs. the cards in
     *  it). Same shape + storage convention as on Card. */
    assets: z.array(AssetRefSchema).default([]),
    /** Ordered list of card ids that make up the scene. The
     *  array's order IS the scene's order. Cards can be the
     *  same id more than once (a "callback" scene that
     *  surfaces the same location twice). */
    cards: z.array(SceneCardIdSchema).default([]),
    /** Path to a cover image (relative to the project root).
     *  Null when no cover is set. */
    cover: z.string().min(1).nullable().default(null),
    /** ISO-8601 timestamps. */
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
});
//# sourceMappingURL=scenes.js.map