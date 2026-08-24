import { z } from 'zod';
/** What kind of file an asset reference points at. Drives
 *  the in-editor renderer (thumbnail vs. icon-card vs.
 *  future model viewer) without re-sniffing the extension
 *  at render time. */
export declare const AssetKindSchema: z.ZodEnum<["image", "model", "audio", "data"]>;
export type AssetKind = z.infer<typeof AssetKindSchema>;
export declare const AssetRefSchema: z.ZodObject<{
    /** Path RELATIVE to the project root. Stored as POSIX-
     *  style ('/' separators) so projects sync cleanly across
     *  machines + survive moves. Resolved to an absolute path
     *  at read time by joining with the active project's path. */
    path: z.ZodString;
    /** Inferred kind. Pinned at pick time so a renamed file
     *  doesn't silently change category. */
    kind: z.ZodEnum<["image", "model", "audio", "data"]>;
    /** Optional human label. Falls back to the basename when
     *  absent. */
    label: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    kind: "image" | "model" | "audio" | "data";
    label?: string | undefined;
}, {
    path: string;
    kind: "image" | "model" | "audio" | "data";
    label?: string | undefined;
}>;
export type AssetRef = z.infer<typeof AssetRefSchema>;
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
export declare const RelationSchema: z.ZodObject<{
    /** Id of the related entity. Same `type:slug` regex used
     *  by card ids; the schema accepts any entity-shaped id
     *  (card or scene) so the future cross-entity case
     *  doesn't need a schema migration. */
    targetId: z.ZodString;
    /** Free-form relation label. Trimmed + lowercased at the
     *  UI layer; the schema only enforces "at least one
     *  character". */
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    targetId: string;
}, {
    type: string;
    targetId: string;
}>;
export type Relation = z.infer<typeof RelationSchema>;
/** The seven card kinds. Every card discriminates on this
 *  field. Adding a new kind = adding a new variant to the
 *  union below + an entry to SUBTYPES_BY_TYPE. */
export declare const CardTypeSchema: z.ZodEnum<["character", "location", "faction", "item", "event", "lore", "ecology"]>;
export type CardType = z.infer<typeof CardTypeSchema>;
export declare const LocationSubtypeSchema: z.ZodEnum<["city", "town", "landmark", "country"]>;
export type LocationSubtype = z.infer<typeof LocationSubtypeSchema>;
export declare const FactionSubtypeSchema: z.ZodEnum<["company", "agency", "gang", "guild", "organization"]>;
export type FactionSubtype = z.infer<typeof FactionSubtypeSchema>;
export declare const ItemSubtypeSchema: z.ZodEnum<["weapon", "vehicle", "device", "document"]>;
export type ItemSubtype = z.infer<typeof ItemSubtypeSchema>;
export declare const EventSubtypeSchema: z.ZodEnum<["incident", "meeting", "festival"]>;
export type EventSubtype = z.infer<typeof EventSubtypeSchema>;
export declare const LoreSubtypeSchema: z.ZodEnum<["history", "culture", "law", "technology"]>;
export type LoreSubtype = z.infer<typeof LoreSubtypeSchema>;
export declare const EcologySubtypeSchema: z.ZodEnum<["flora", "fauna"]>;
export type EcologySubtype = z.infer<typeof EcologySubtypeSchema>;
export declare const CharacterCardSchema: z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"character">;
}, "strip", z.ZodTypeAny, {
    type: "character";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
}, {
    type: "character";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
}>;
export declare const LocationCardSchema: z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"location">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["city", "town", "landmark", "country"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "location";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "city" | "town" | "landmark" | "country" | null;
}, {
    type: "location";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "city" | "town" | "landmark" | "country" | null | undefined;
}>;
export declare const FactionCardSchema: z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"faction">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["company", "agency", "gang", "guild", "organization"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "faction";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "company" | "agency" | "gang" | "guild" | "organization" | null;
}, {
    type: "faction";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "company" | "agency" | "gang" | "guild" | "organization" | null | undefined;
}>;
export declare const ItemCardSchema: z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"item">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["weapon", "vehicle", "device", "document"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "item";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "weapon" | "vehicle" | "device" | "document" | null;
}, {
    type: "item";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "weapon" | "vehicle" | "device" | "document" | null | undefined;
}>;
export declare const EventCardSchema: z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"event">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["incident", "meeting", "festival"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "event";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "incident" | "meeting" | "festival" | null;
}, {
    type: "event";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "incident" | "meeting" | "festival" | null | undefined;
}>;
export declare const LoreCardSchema: z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"lore">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["history", "culture", "law", "technology"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "lore";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "history" | "culture" | "law" | "technology" | null;
}, {
    type: "lore";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "history" | "culture" | "law" | "technology" | null | undefined;
}>;
export declare const EcologyCardSchema: z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"ecology">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["flora", "fauna"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "ecology";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "flora" | "fauna" | null;
}, {
    type: "ecology";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "flora" | "fauna" | null | undefined;
}>;
export declare const CardSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"character">;
}, "strip", z.ZodTypeAny, {
    type: "character";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
}, {
    type: "character";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
}>, z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"location">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["city", "town", "landmark", "country"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "location";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "city" | "town" | "landmark" | "country" | null;
}, {
    type: "location";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "city" | "town" | "landmark" | "country" | null | undefined;
}>, z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"faction">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["company", "agency", "gang", "guild", "organization"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "faction";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "company" | "agency" | "gang" | "guild" | "organization" | null;
}, {
    type: "faction";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "company" | "agency" | "gang" | "guild" | "organization" | null | undefined;
}>, z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"item">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["weapon", "vehicle", "device", "document"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "item";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "weapon" | "vehicle" | "device" | "document" | null;
}, {
    type: "item";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "weapon" | "vehicle" | "device" | "document" | null | undefined;
}>, z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"event">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["incident", "meeting", "festival"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "event";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "incident" | "meeting" | "festival" | null;
}, {
    type: "event";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "incident" | "meeting" | "festival" | null | undefined;
}>, z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"lore">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["history", "culture", "law", "technology"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "lore";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "history" | "culture" | "law" | "technology" | null;
}, {
    type: "lore";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "history" | "culture" | "law" | "technology" | null | undefined;
}>, z.ZodObject<{
    /** Globally-unique, type-prefixed slug
     *  (e.g., `location:the-arena`). Stable for the card's
     *  lifetime; renaming `title` does NOT change the id. */
    id: z.ZodString;
    /** Type-scoped slug derived from the title. Equals the
     *  filename on disk (e.g., `the-arena` for the file at
     *  `locations/the-arena.md`). The portion of `id` after
     *  the colon. */
    slug: z.ZodString;
    /** Display name. Free-form; can be edited without breaking
     *  the slug / id / filename. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in card lists + search
     *  previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Used for cross-cutting groupings that
     *  don't fit the type/subtype taxonomy. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. The primary writing surface. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities. Each
     *  entry is `{ targetId, type }` where `type` is a free-
     *  form lowercase string. v2's graph view will render
     *  edges from this field. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Id of the related entity. Same `type:slug` regex used
         *  by card ids; the schema accepts any entity-shaped id
         *  (card or scene) so the future cross-entity case
         *  doesn't need a schema migration. */
        targetId: z.ZodString;
        /** Free-form relation label. Trimmed + lowercased at the
         *  UI layer; the schema only enforces "at least one
         *  character". */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Associated production assets from the referencing
     *  project — concept art, models, audio, data files.
     *  Each entry stores a project-relative POSIX path + a
     *  pinned kind so the editor can render the right surface
     *  without re-sniffing the extension. The picker in fabula
     *  surfaces files under `assets-raw/` and `public/`. */
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** Path RELATIVE to the project root. Stored as POSIX-
         *  style ('/' separators) so projects sync cleanly across
         *  machines + survive moves. Resolved to an absolute path
         *  at read time by joining with the active project's path. */
        path: z.ZodString;
        /** Inferred kind. Pinned at pick time so a renamed file
         *  doesn't silently change category. */
        kind: z.ZodEnum<["image", "model", "audio", "data"]>;
        /** Optional human label. Falls back to the basename when
         *  absent. */
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
    /** Path to a cover image, relative to the project root.
     *  `null` when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"ecology">;
    subtype: z.ZodDefault<z.ZodNullable<z.ZodEnum<["flora", "fauna"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "ecology";
    id: string;
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    body: string;
    relationships: {
        type: string;
        targetId: string;
    }[];
    assets: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[];
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    subtype: "flora" | "fauna" | null;
}, {
    type: "ecology";
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    summary?: string | undefined;
    tags?: string[] | undefined;
    body?: string | undefined;
    relationships?: {
        type: string;
        targetId: string;
    }[] | undefined;
    assets?: {
        path: string;
        kind: "image" | "model" | "audio" | "data";
        label?: string | undefined;
    }[] | undefined;
    cover?: string | null | undefined;
    subtype?: "flora" | "fauna" | null | undefined;
}>]>;
export type Card = z.infer<typeof CardSchema>;
export type CharacterCard = z.infer<typeof CharacterCardSchema>;
export type LocationCard = z.infer<typeof LocationCardSchema>;
export type FactionCard = z.infer<typeof FactionCardSchema>;
export type ItemCard = z.infer<typeof ItemCardSchema>;
export type EventCard = z.infer<typeof EventCardSchema>;
export type LoreCard = z.infer<typeof LoreCardSchema>;
export type EcologyCard = z.infer<typeof EcologyCardSchema>;
/** All card types in canonical order — for dropdowns,
 *  sidebar nav, iteration. */
export declare const CARD_TYPES: readonly ["character", "location", "faction", "item", "event", "lore", "ecology"];
/** Subtypes available per type. Empty tuple for types without
 *  subtypes (`character`). Use this to populate per-type
 *  subtype dropdowns. */
export declare const SUBTYPES_BY_TYPE: {
    readonly character: readonly [];
    readonly location: readonly ["city", "town", "landmark", "country"];
    readonly faction: readonly ["company", "agency", "gang", "guild", "organization"];
    readonly item: readonly ["weapon", "vehicle", "device", "document"];
    readonly event: readonly ["incident", "meeting", "festival"];
    readonly lore: readonly ["history", "culture", "law", "technology"];
    readonly ecology: readonly ["flora", "fauna"];
};
/** Pluralized directory name per type — matches the on-disk
 *  layout (`<project>/<plural>/<slug>.md`). */
export declare const PLURAL_BY_TYPE: {
    readonly character: "characters";
    readonly location: "locations";
    readonly faction: "factions";
    readonly item: "items";
    readonly event: "events";
    readonly lore: "lore";
    readonly ecology: "ecology";
};
/** Humanized display label per type — for sidebar headers,
 *  UI copy. */
export declare const LABEL_BY_TYPE: {
    readonly character: "Character";
    readonly location: "Location";
    readonly faction: "Faction";
    readonly item: "Item";
    readonly event: "Event";
    readonly lore: "Lore";
    readonly ecology: "Ecology";
};
//# sourceMappingURL=cards.d.ts.map