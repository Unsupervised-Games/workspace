import { z } from 'zod';
import { NavMeshTileManifestSchema } from './navmesh.js';
import { TileCacheManifestSchema } from './tilecache.js';
import { LocaleBundleSchema } from './i18n.js';
// The neutral asset manifest — @unsupervised/forge's language-agnostic source of
// truth. A build run emits this JSON first; the per-language registry
// bindings (the TypeScript `lib/generated/assets.ts`, a C++ `assets.h`, …)
// are EMITTERS that consume it. So "what assets exist, where their bytes
// live, and what ids/animations/keys they expose" is stated once, in a form
// no runtime language is baked into.
//
// Every field is a faithful reprojection of what the forge pipelines already
// compute (the tuple that used to feed `generateAssetTypes` directly) — ids +
// public paths + the nested navmesh / tilecache / locale manifests, which
// keep their existing schemas. Editing this shape changes the cross-language
// contract; bump `version` when the shape (not the data) changes.
//
// See docs/specs/language-agnostic-targets.md.
/** A UI image: a typed id + the public path its bytes live at. */
export const AssetManifestUiEntrySchema = z.object({
    id: z.string(),
    path: z.string(),
});
/** A 3D model: id, public path, and the clip names baked into the glb. */
export const AssetManifestModelEntrySchema = z.object({
    id: z.string(),
    path: z.string(),
    animations: z.array(z.string()),
});
/** A data domain (one `<domain>.json`): the domain slug, its record ids, and
 *  the public path of the validated + minified payload. */
export const AssetManifestDataEntrySchema = z.object({
    domain: z.string(),
    ids: z.array(z.string()),
    path: z.string(),
});
/** An audio clip: a typed id + the public path of the encoded output. */
export const AssetManifestAudioEntrySchema = z.object({
    id: z.string(),
    path: z.string(),
});
/** The three audio buckets, each a list of clips. */
export const AssetManifestAudioSchema = z.object({
    sfx: z.array(AssetManifestAudioEntrySchema),
    music: z.array(AssetManifestAudioEntrySchema),
    environment: z.array(AssetManifestAudioEntrySchema),
});
/** A streaming (solo-format) navmesh world + its full tile manifest. */
export const AssetManifestNavMeshEntrySchema = z.object({
    id: z.string(),
    manifest: NavMeshTileManifestSchema,
});
/** A tilecache-format navmesh world + its full manifest. */
export const AssetManifestTileCacheEntrySchema = z.object({
    id: z.string(),
    manifest: TileCacheManifestSchema,
});
/** A locale: its id + the full validated bundle (config + catalog). */
export const AssetManifestLocaleEntrySchema = z.object({
    id: z.string(),
    bundle: LocaleBundleSchema,
});
/** The whole manifest — one build run's worth of every asset the pipelines
 *  produce, in a language-neutral shape. */
export const AssetManifestSchema = z.object({
    version: z.number().int(),
    /** Sprite ids (the spritesheet is a single fixed-path atlas, so ids only). */
    sprites: z.array(z.string()),
    ui: z.array(AssetManifestUiEntrySchema),
    models: z.array(AssetManifestModelEntrySchema),
    data: z.array(AssetManifestDataEntrySchema),
    audio: AssetManifestAudioSchema,
    navmesh: z.array(AssetManifestNavMeshEntrySchema),
    tileCache: z.array(AssetManifestTileCacheEntrySchema),
    locales: z.array(AssetManifestLocaleEntrySchema),
    /** Sorted union of every key across every locale catalog. */
    translationKeys: z.array(z.string()),
});
/** The manifest schema version. Bump when the SHAPE changes (a new bucket, a
 *  renamed field) — not when a game's assets change. */
export const ASSET_MANIFEST_VERSION = 1;
//# sourceMappingURL=assetManifest.js.map