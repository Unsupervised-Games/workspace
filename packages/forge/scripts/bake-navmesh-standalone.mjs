#!/usr/bin/env node
// Standalone navmesh bake script.
//
// The forge CLI's bundled `dist/cli.js` aborts when it tries
// to initialize recast-navigation alongside Sharp + Draco +
// ffmpeg modules in the same process (proven by experiment;
// `Aborted()` from inside `init()` even with --max-old-space=4096).
// Plain `node` running this script works fine because only
// recast WASM is loaded.
//
// Usage: invoked from the host app's `pnpm forge:navmesh`
// script:
//
//   node node_modules/@unsupervised/forge/scripts/bake-navmesh-standalone.mjs \
//     <input-dir> <output-dir>
//
// Where:
//   <input-dir> = e.g. ./assets-raw  (we walk navmeshes/* under it)
//   <output-dir> = e.g. ./public     (we write navmesh/<world>/ under it)
//
// On success, writes per-tile binaries + emits a JSON
// manifest snapshot to stderr the host can capture for type
// generation. v1: types are written by re-running the
// regular `pnpm forge` after this; manifest serialization
// into `lib/generated/assets.ts` is done by the standard
// type generator on the next run.

import { readdir, readFile, mkdir, rm, writeFile, stat } from 'node:fs/promises';
import { join, posix } from 'node:path';
import {
  exportTileCache,
  init,
  RecastChunkyTriMesh,
  TrianglesArray,
  VerticesArray,
} from 'recast-navigation';
import {
  buildTiledNavMeshRcConfig,
  generateTileCache,
  generateTileNavMeshData,
  tileCacheGeneratorConfigDefaults,
  tiledNavMeshGeneratorConfigDefaults,
} from 'recast-navigation/generators';

const inputDir = process.argv[2];
const outputDir = process.argv[3];
if (!inputDir || !outputDir) {
  console.error('Usage: bake-navmesh-standalone.mjs <input-dir> <output-dir>');
  process.exit(1);
}

const navMeshInputRoot = join(inputDir, 'navmeshes');
const navMeshOutputRoot = join(outputDir, 'navmesh');

let dirs;
try {
  dirs = await readdir(navMeshInputRoot, { withFileTypes: true });
} catch {
  console.error(`[bake-navmesh] No navmeshes directory under ${inputDir}`);
  process.exit(0);
}

await init();

const manifests = [];
const tileCacheManifests = [];
for (const dirent of dirs) {
  if (!dirent.isDirectory()) continue;
  const worldId = dirent.name;
  const sourcePath = join(navMeshInputRoot, worldId, 'world.json');
  try {
    await stat(sourcePath);
  } catch {
    continue;
  }
  let source;
  try {
    source = JSON.parse(await readFile(sourcePath, 'utf-8'));
  } catch (cause) {
    console.error(
      `[bake-navmesh] '${worldId}' world.json is not valid JSON: ${cause.message ?? cause}`,
    );
    continue;
  }

  // Pre-flight validation. Missing required fields would
  // otherwise crash inside the recast bake with a much
  // less actionable error.
  if (
    !source ||
    typeof source !== 'object' ||
    !source.geometry ||
    !source.geometry.ground ||
    !Array.isArray(source.boundsMin) ||
    !Array.isArray(source.boundsMax) ||
    typeof source.tileSize !== 'number'
  ) {
    console.error(
      `[bake-navmesh] '${worldId}' world.json missing required fields (geometry.ground, boundsMin, boundsMax, tileSize); skipping.`,
    );
    continue;
  }

  const format = source.format ?? 'solo';

  try {
    if (format === 'tilecache') {
      const result = bakeTileCacheWorld(worldId, source);
      if (result) {
        const worldOutDir = join(navMeshOutputRoot, worldId);
        await rm(worldOutDir, { recursive: true, force: true });
        await mkdir(worldOutDir, { recursive: true });
        await writeFile(join(worldOutDir, 'world.bin'), result.bundleBytes);
        await writeFile(
          join(worldOutDir, 'manifest.json'),
          JSON.stringify(result.manifest, null, 2),
        );
        tileCacheManifests.push(result.manifest);
        console.log(
          `[bake-navmesh] '${worldId}' (tilecache) → ${result.manifest.tiles.length} tile${result.manifest.tiles.length === 1 ? '' : 's'}, ${result.bundleBytes.length} bytes`,
        );
      }
      continue;
    }

    // Default: solo (per-tile streaming binaries) — original path.
    const manifest = await bakeSoloWorld(worldId, source);
    if (manifest) {
      manifests.push(manifest);
      console.log(
        `[bake-navmesh] '${worldId}' → ${manifest.tiles.length} non-empty tile${manifest.tiles.length === 1 ? '' : 's'}`,
      );
    }
  } catch (cause) {
    console.error(
      `[bake-navmesh] '${worldId}' bake failed: ${cause?.message ?? cause}`,
    );
  }
}

async function bakeSoloWorld(worldId, source) {
  const positions = [];
  const indices = [];
  appendBox(source.geometry.ground, positions, indices);
  for (const obs of source.geometry.obstacles ?? []) {
    appendBox(obs, positions, indices);
  }

  const posBuf = new ArrayBuffer(positions.length * 4);
  const posArr = new Float32Array(posBuf);
  for (let i = 0; i < positions.length; i++) posArr[i] = positions[i];
  const idxBuf = new ArrayBuffer(indices.length * 4);
  const idxArr = new Int32Array(idxBuf);
  for (let i = 0; i < indices.length; i++) idxArr[i] = indices[i];

  const va = new VerticesArray();
  va.copy(posArr);
  const ta = new TrianglesArray();
  ta.copy(idxArr);

  const cfg = {
    ...tiledNavMeshGeneratorConfigDefaults,
    tileSize: source.tileSize,
    cs: source.config?.cellSize ?? tiledNavMeshGeneratorConfigDefaults.cs,
    ch: source.config?.cellHeight ?? tiledNavMeshGeneratorConfigDefaults.ch,
    walkableRadius:
      source.config?.walkableRadius ??
      tiledNavMeshGeneratorConfigDefaults.walkableRadius,
    walkableHeight:
      source.config?.walkableHeight ??
      tiledNavMeshGeneratorConfigDefaults.walkableHeight,
    walkableClimb:
      source.config?.walkableClimb ??
      tiledNavMeshGeneratorConfigDefaults.walkableClimb,
    walkableSlopeAngle:
      source.config?.walkableSlopeAngle ??
      tiledNavMeshGeneratorConfigDefaults.walkableSlopeAngle,
  };

  const built = buildTiledNavMeshRcConfig({
    recastConfig: cfg,
    navMeshBounds: [source.boundsMin, source.boundsMax],
  });

  const chunky = new RecastChunkyTriMesh();
  chunky.init(va, ta, idxArr.length / 3, 256);

  const worldOutDir = join(navMeshOutputRoot, worldId);
  await rm(worldOutDir, { recursive: true, force: true });
  await mkdir(worldOutDir, { recursive: true });

  const tileEntries = [];
  for (let ty = 0; ty < built.tileHeight; ty++) {
    for (let tx = 0; tx < built.tileWidth; tx++) {
      const bmin = [
        source.boundsMin[0] + tx * built.tcs,
        source.boundsMin[1],
        source.boundsMin[2] + ty * built.tcs,
      ];
      const bmax = [
        source.boundsMin[0] + (tx + 1) * built.tcs,
        source.boundsMax[1],
        source.boundsMin[2] + (ty + 1) * built.tcs,
      ];
      const r = generateTileNavMeshData(va, ta, built.config, chunky, {
        x: tx,
        y: ty,
        bmin,
        bmax,
      });
      if (r.success && r.data) {
        const view = r.data.getHeapView();
        const bytes = new Uint8Array(r.data.size);
        bytes.set(view.subarray(0, r.data.size));
        r.data.destroy();
        const filename = `${tx}_${ty}.bin`;
        await writeFile(join(worldOutDir, filename), bytes);
        tileEntries.push({
          tx,
          tz: ty,
          path: posix.join('/navmesh', worldId, filename),
        });
      }
    }
  }
  va.destroy();
  ta.destroy();

  const manifest = {
    worldId,
    tileSize: built.tcs,
    boundsMin: source.boundsMin,
    boundsMax: source.boundsMax,
    maxTiles: built.maxTiles,
    maxPolys: 65536,
    config: {
      walkableRadius: cfg.walkableRadius,
      walkableHeight: cfg.walkableHeight,
      walkableClimb: cfg.walkableClimb,
      walkableSlopeAngle: cfg.walkableSlopeAngle,
      cellSize: cfg.cs,
      cellHeight: cfg.ch,
    },
    tiles: tileEntries.sort((a, b) => a.tx - b.tx || a.tz - b.tz),
  };

  await writeFile(
    join(worldOutDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
  );
  return manifest;
}

/** Bake a TileCache-format world. Produces ONE bundle binary
 *  ("world.bin") containing the navmesh + tile cache for the
 *  whole world. The runtime imports the bundle via
 *  `importTileCache(bytes, meshProcess)` and supports
 *  `addObstacle` / `removeObstacle` at runtime. */
function bakeTileCacheWorld(worldId, source) {
  const positions = [];
  const indices = [];
  appendBox(source.geometry.ground, positions, indices);
  for (const obs of source.geometry.obstacles ?? []) {
    appendBox(obs, positions, indices);
  }
  const posArr = new Float32Array(positions);
  const idxArr = new Int32Array(indices);

  const cfg = {
    ...tileCacheGeneratorConfigDefaults,
    tileSize: source.tileSize,
    cs: source.config?.cellSize ?? tileCacheGeneratorConfigDefaults.cs,
    ch: source.config?.cellHeight ?? tileCacheGeneratorConfigDefaults.ch,
    walkableRadius:
      source.config?.walkableRadius ??
      tileCacheGeneratorConfigDefaults.walkableRadius,
    walkableHeight:
      source.config?.walkableHeight ??
      tileCacheGeneratorConfigDefaults.walkableHeight,
    walkableClimb:
      source.config?.walkableClimb ??
      tileCacheGeneratorConfigDefaults.walkableClimb,
    walkableSlopeAngle:
      source.config?.walkableSlopeAngle ??
      tileCacheGeneratorConfigDefaults.walkableSlopeAngle,
    expectedLayersPerTile: source.expectedLayersPerTile ?? 1,
    maxObstacles: source.maxObstacles ?? 128,
    bounds: [source.boundsMin, source.boundsMax],
  };

  const result = generateTileCache(posArr, idxArr, cfg);
  if (!result.success) {
    console.error(
      `[bake-navmesh] '${worldId}' (tilecache) generateTileCache failed: ${result.error}`,
    );
    return null;
  }

  // Walk the freshly-built navmesh's tile list so the
  // manifest enumerates which (tx, tz) cells have walkable
  // data. The runtime imports cells from the bundle
  // itself; this enumeration is for HUD + boundary
  // computations only.
  const tileEntries = [];
  const navMesh = result.navMesh;
  const tileCount = navMesh.getMaxTiles();
  for (let i = 0; i < tileCount; i++) {
    const tile = navMesh.getTile(i);
    const header = tile.header();
    if (!header || header.polyCount() === 0) continue;
    tileEntries.push({ tx: header.x(), tz: header.y() });
  }

  // Serialize the navmesh + tile cache into a single
  // binary blob via recast's bundled exporter. The
  // runtime's `importTileCache` reconstructs both sides
  // from this single blob.
  const bundleBytes = exportTileCache(result.navMesh, result.tileCache);
  // Copy into a Node Buffer-friendly Uint8Array so the
  // upstream `writeFile` is happy regardless of whether
  // recast's array is shared-buffer-backed.
  const outBytes = new Uint8Array(bundleBytes.length);
  outBytes.set(bundleBytes);

  // Capacity hint snapshot: recast computes the tile
  // count internally; we read it back via `getMaxTiles`.
  const maxTiles = navMesh.getMaxTiles();

  // Free the build-time handles. The runtime side
  // re-imports a fresh pair from the bundle bytes.
  result.tileCache.destroy();
  navMesh.destroy();

  const manifest = {
    worldId,
    tileSize: source.tileSize,
    boundsMin: source.boundsMin,
    boundsMax: source.boundsMax,
    bundlePath: posix.join('/navmesh', worldId, 'world.bin'),
    maxTiles,
    maxObstacles: cfg.maxObstacles,
    expectedLayersPerTile: cfg.expectedLayersPerTile,
    config: {
      walkableRadius: cfg.walkableRadius,
      walkableHeight: cfg.walkableHeight,
      walkableClimb: cfg.walkableClimb,
      walkableSlopeAngle: cfg.walkableSlopeAngle,
      cellSize: cfg.cs,
      cellHeight: cfg.ch,
    },
    tiles: tileEntries.sort((a, b) => a.tx - b.tx || a.tz - b.tz),
  };

  return { manifest, bundleBytes: outBytes };
}

console.log(
  `[bake-navmesh] baked ${manifests.length} solo world${manifests.length === 1 ? '' : 's'} + ${tileCacheManifests.length} tilecache world${tileCacheManifests.length === 1 ? '' : 's'}`,
);

function appendBox(shape, positions, indices) {
  if (shape.kind !== 'box') return;
  const min = shape.min;
  const max = shape.max;
  const baseIndex = positions.length / 3;
  const corners = [
    [min[0], min[1], min[2]],
    [max[0], min[1], min[2]],
    [max[0], max[1], min[2]],
    [min[0], max[1], min[2]],
    [min[0], min[1], max[2]],
    [max[0], min[1], max[2]],
    [max[0], max[1], max[2]],
    [min[0], max[1], max[2]],
  ];
  for (const c of corners) positions.push(c[0], c[1], c[2]);
  const tris = [
    [3, 2, 6], [3, 6, 7],
    [0, 4, 5], [0, 5, 1],
    [0, 1, 2], [0, 2, 3],
    [1, 5, 6], [1, 6, 2],
    [5, 4, 7], [5, 7, 6],
    [4, 0, 3], [4, 3, 7],
  ];
  for (const t of tris) {
    indices.push(baseIndex + t[0], baseIndex + t[1], baseIndex + t[2]);
  }
}
