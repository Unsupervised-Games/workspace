// Fabula card schemas — the canonical narrative-entry types
// authored in fabula projects.
//
// A "card" is the atomic unit of a fabula project: one
// character, one location, one piece of lore, one event. All
// cards share a common envelope (id, title, summary, body,
// tags, related, cover, timestamps) and discriminate on
// `type`. Types with multiple flavors carry an additional
// `subtype` field; types without (`character`) omit the
// field entirely so the discriminated narrow tells you
// statically whether a subtype is in play.
//
// Storage: one card → one file on disk at
// `<project>/<type-plural>/<slug>.md`, encoded as markdown
// with YAML frontmatter. Human-readable, Obsidian-compatible,
// pipeable through any markdown tool. Persistence layer lives
// in `apps/kosmos/lib/fabula/cardStorage.ts`.
//
// Identity: `id` is a globally-unique, type-prefixed slug
// (`location:the-arena`). The slug is derived from the title
// at creation and is STABLE for the card's lifetime — renaming
// the title doesn't change the id (so `related: [...]` links
// don't break). v2 will add a rename gesture that migrates
// references atomically.
import { z } from 'zod';
// ────────────────────────────────────────────────────────────────
// Asset references — paths into the referencing project
// ────────────────────────────────────────────────────────────────
/** What kind of file an asset reference points at. Drives
 *  the in-editor renderer (thumbnail vs. icon-card vs.
 *  future model viewer) without re-sniffing the extension
 *  at render time. */
export const AssetKindSchema = z.enum([
    'image',
    'model',
    'audio',
    'data',
]);
export const AssetRefSchema = z.object({
    /** Path RELATIVE to the project root. Stored as POSIX-
     *  style ('/' separators) so projects sync cleanly across
     *  machines + survive moves. Resolved to an absolute path
     *  at read time by joining with the active project's path. */
    path: z.string().min(1),
    /** Inferred kind. Pinned at pick time so a renamed file
     *  doesn't silently change category. */
    kind: AssetKindSchema,
    /** Optional human label. Falls back to the basename when
     *  absent. */
    label: z.string().optional(),
});
// ────────────────────────────────────────────────────────────────
// Relationships — typed edges between entities
// ────────────────────────────────────────────────────────────────
/** A typed, one-way relationship from this card to another
 *  entity. `type` is free-form lowercase string — users
 *  define their own taxonomy ("sister", "home", "mentor",
 *  "founded-by", whatever fits the world).
 *
 *  Directionality: ONE-WAY. Adding "Sora → Elara: sister"
 *  does NOT auto-add "Elara → Sora: sister". The user adds
 *  the reciprocal explicitly. Auto-mirroring asymmetric
 *  types ("parent" ↔ "child") needs an inverse-type
 *  registry — deferred to v2. */
export const RelationSchema = z.object({
    /** Id of the related entity. Same `type:slug` regex used
     *  by card ids; the schema accepts any entity-shaped id
     *  (card or scene) so the future cross-entity case
     *  doesn't need a schema migration. */
    targetId: z.string().min(1).regex(/^[a-z]+:[a-z0-9-]+$/),
    /** Free-form relation label. Trimmed + lowercased at the
     *  UI layer; the schema only enforces "at least one
     *  character". */
    type: z.string().min(1),
});
// ────────────────────────────────────────────────────────────────
// Card kinds + subtypes
// ────────────────────────────────────────────────────────────────
/** The seven card kinds. Every card discriminates on this
 *  field. Adding a new kind = adding a new variant to the
 *  union below + an entry to SUBTYPES_BY_TYPE. */
export const CardTypeSchema = z.enum([
    'character',
    'location',
    'faction',
    'item',
    'event',
    'lore',
    'ecology',
]);
export const LocationSubtypeSchema = z.enum([
    'city',
    'town',
    'landmark',
    'country',
]);
export const FactionSubtypeSchema = z.enum([
    'company',
    'agency',
    'gang',
    'guild',
    'organization',
]);
export const ItemSubtypeSchema = z.enum([
    'weapon',
    'vehicle',
    'device',
    'document',
]);
export const EventSubtypeSchema = z.enum([
    'incident',
    'meeting',
    'festival',
]);
export const LoreSubtypeSchema = z.enum([
    'history',
    'culture',
    'law',
    'technology',
]);
export const EcologySubtypeSchema = z.enum([
    'flora',
    'fauna',
]);
// ────────────────────────────────────────────────────────────────
// Shared envelope — every card variant extends this
// ────────────────────────────────────────────────────────────────
/** Base shape shared by all card variants. Discriminated
 *  unions in Zod want each variant to be a fresh ZodObject
 *  with the literal discriminator, so we factor the common
 *  shape here and `.extend()` it per type. */
const CardBaseSchema = z.object({
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.string().min(1).regex(/^[a-z]+:[a-z0-9-]+$/, {
        message: "id must be of form 'type:slug' (lowercase letters, digits, hyphens)",
    }),
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.string().min(1),
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.string().default(''),
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.array(z.string().min(1)).default([]),
    /** Long-form markdown body. The primary writing surface. */
    body: z.string().default(''),
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.array(RelationSchema).default([]),
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.array(AssetRefSchema).default([]),
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.string().min(1).nullable().default(null),
    /** ISO-8601 timestamps. */
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
});
// ────────────────────────────────────────────────────────────────
// Per-type variants
// ────────────────────────────────────────────────────────────────
export const CharacterCardSchema = CardBaseSchema.extend({
    type: z.literal('character'),
    // Characters have no subtype. The field is intentionally
    // absent — the discriminated narrow on type === 'character'
    // yields a card shape WITHOUT a subtype field, so consumers
    // can't accidentally pass an invalid subtype here.
});
export const LocationCardSchema = CardBaseSchema.extend({
    type: z.literal('location'),
    subtype: LocationSubtypeSchema.nullable().default(null),
});
export const FactionCardSchema = CardBaseSchema.extend({
    type: z.literal('faction'),
    subtype: FactionSubtypeSchema.nullable().default(null),
});
export const ItemCardSchema = CardBaseSchema.extend({
    type: z.literal('item'),
    subtype: ItemSubtypeSchema.nullable().default(null),
});
export const EventCardSchema = CardBaseSchema.extend({
    type: z.literal('event'),
    subtype: EventSubtypeSchema.nullable().default(null),
});
export const LoreCardSchema = CardBaseSchema.extend({
    type: z.literal('lore'),
    subtype: LoreSubtypeSchema.nullable().default(null),
});
export const EcologyCardSchema = CardBaseSchema.extend({
    type: z.literal('ecology'),
    subtype: EcologySubtypeSchema.nullable().default(null),
});
export const CardSchema = z.discriminatedUnion('type', [
    CharacterCardSchema,
    LocationCardSchema,
    FactionCardSchema,
    ItemCardSchema,
    EventCardSchema,
    LoreCardSchema,
    EcologyCardSchema,
]);
// ────────────────────────────────────────────────────────────────
// Catalogs (for UI dropdowns + iteration)
// ────────────────────────────────────────────────────────────────
/** All card types in canonical order — for dropdowns,
 *  sidebar nav, iteration. */
export const CARD_TYPES = [
    'character',
    'location',
    'faction',
    'item',
    'event',
    'lore',
    'ecology',
];
/** Subtypes available per type. Empty tuple for types without
 *  subtypes (`character`). Use this to populate per-type
 *  subtype dropdowns. */
export const SUBTYPES_BY_TYPE = {
    character: [],
    location: ['city', 'town', 'landmark', 'country'],
    faction: ['company', 'agency', 'gang', 'guild', 'organization'],
    item: ['weapon', 'vehicle', 'device', 'document'],
    event: ['incident', 'meeting', 'festival'],
    lore: ['history', 'culture', 'law', 'technology'],
    ecology: ['flora', 'fauna'],
};
/** Pluralized directory name per type — matches the on-disk
 *  layout (`<project>/<plural>/<slug>.md`). */
export const PLURAL_BY_TYPE = {
    character: 'characters',
    location: 'locations',
    faction: 'factions',
    item: 'items',
    event: 'events',
    lore: 'lore',
    ecology: 'ecology',
};
/** Humanized display label per type — for sidebar headers,
 *  UI copy. */
export const LABEL_BY_TYPE = {
    character: 'Character',
    location: 'Location',
    faction: 'Faction',
    item: 'Item',
    event: 'Event',
    lore: 'Lore',
    ecology: 'Ecology',
};
//# sourceMappingURL=cards.js.map