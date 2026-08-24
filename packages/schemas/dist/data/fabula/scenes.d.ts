import { z } from 'zod';
export declare const SceneSchema: z.ZodObject<{
    /** Globally unique id of form `scene:<slug>`. Stable for
     *  the scene's lifetime — renaming the title leaves the
     *  id (and on-disk filename) untouched so card → scene
     *  references via `related` stay valid. */
    id: z.ZodString;
    /** Filename slug (the portion of `id` after the colon).
     *  Equals the on-disk filename without extension. */
    slug: z.ZodString;
    /** Display name. Freely editable; doesn't affect the slug. */
    title: z.ZodString;
    /** Short one-line summary. Surfaced in the sidebar row
     *  and search previews. */
    summary: z.ZodDefault<z.ZodString>;
    /** Free-form tags. Cross-cuts the scene catalog by themes
     *  / acts / locations / mood. */
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Long-form markdown body. Establishing notes, pacing,
     *  mood, transitions, anything that isn't card content. */
    body: z.ZodDefault<z.ZodString>;
    /** Typed, one-way relationships to other entities.
     *  Schema-shared with cards (`Relation = { targetId,
     *  type }`). Use cases: sequel-of / parallel-to / mirror-
     *  of for scene-to-scene; references-event / features-
     *  faction for scene-to-card. v1 UI scopes targets to
     *  cards; the schema accepts any entity-shaped id so
     *  future cross-entity edges don't need a migration. */
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        targetId: z.ZodString;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        targetId: string;
    }, {
        type: string;
        targetId: string;
    }>, "many">>;
    /** Asset references — concept art / storyboards / audio
     *  cues attached to the scene itself (vs. the cards in
     *  it). Same shape + storage convention as on Card. */
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
    /** Ordered list of card ids that make up the scene. The
     *  array's order IS the scene's order. Cards can be the
     *  same id more than once (a "callback" scene that
     *  surfaces the same location twice). */
    cards: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Path to a cover image (relative to the project root).
     *  Null when no cover is set. */
    cover: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** ISO-8601 timestamps. */
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
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
    cards: string[];
}, {
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
    cards?: string[] | undefined;
}>;
export type Scene = z.infer<typeof SceneSchema>;
//# sourceMappingURL=scenes.d.ts.map