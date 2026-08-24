import { describe, expect, it } from 'vitest';
import {
  TileCacheManifestSchema,
  TileCacheObstacleKindSchema,
  TileCacheObstacleRejectionSchema,
  TileCacheObstacleResultSchema,
  TileCacheObstacleSpecSchema,
} from './tilecache.js';
import { NavMeshSourceSchema } from './navmesh.js';

describe('TileCacheManifestSchema', () => {
  const VALID = {
    worldId: 'dex-tilecache',
    tileSize: 8,
    boundsMin: [-20, -1, -20] as [number, number, number],
    boundsMax: [20, 5, 20] as [number, number, number],
    bundlePath: '/navmesh/dex-tilecache/world.bin',
    maxTiles: 64,
    maxObstacles: 128,
    expectedLayersPerTile: 1,
    config: {
      walkableRadius: 0.6,
      walkableHeight: 2,
      walkableClimb: 0.9,
      walkableSlopeAngle: 45,
      cellSize: 0.3,
      cellHeight: 0.2,
    },
    tiles: [
      { tx: 0, tz: 0 },
      { tx: -1, tz: 2 },
    ],
  };

  it('accepts a valid manifest', () => {
    expect(() => TileCacheManifestSchema.parse(VALID)).not.toThrow();
  });

  it('rejects empty worldId', () => {
    expect(() =>
      TileCacheManifestSchema.parse({ ...VALID, worldId: '' }),
    ).toThrow();
  });

  it('rejects empty bundlePath', () => {
    expect(() =>
      TileCacheManifestSchema.parse({ ...VALID, bundlePath: '' }),
    ).toThrow();
  });

  it('rejects non-positive maxObstacles', () => {
    expect(() =>
      TileCacheManifestSchema.parse({ ...VALID, maxObstacles: 0 }),
    ).toThrow();
  });

  it('preserves negative tile coords', () => {
    const parsed = TileCacheManifestSchema.parse(VALID);
    expect(parsed.tiles[1]?.tx).toBe(-1);
    expect(parsed.tiles[1]?.tz).toBe(2);
  });
});

describe('TileCacheObstacleSpecSchema', () => {
  it('accepts a cylinder', () => {
    const parsed = TileCacheObstacleSpecSchema.parse({
      kind: 'cylinder',
      position: [0, 0, 0],
      radius: 1,
      height: 2,
    });
    expect(parsed.kind).toBe('cylinder');
  });

  it('accepts a box with default rotationY', () => {
    const parsed = TileCacheObstacleSpecSchema.parse({
      kind: 'box',
      position: [0, 0, 0],
      halfExtents: [1, 1, 1],
    });
    if (parsed.kind === 'box') expect(parsed.rotationY).toBe(0);
  });

  it('rejects non-positive cylinder radius', () => {
    expect(() =>
      TileCacheObstacleSpecSchema.parse({
        kind: 'cylinder',
        position: [0, 0, 0],
        radius: 0,
        height: 2,
      }),
    ).toThrow();
  });

  it('rejects unknown kind', () => {
    expect(() =>
      TileCacheObstacleSpecSchema.parse({
        kind: 'sphere',
        position: [0, 0, 0],
        radius: 1,
      }),
    ).toThrow();
  });
});

describe('TileCacheObstacleResultSchema', () => {
  it('accepts a success', () => {
    const parsed = TileCacheObstacleResultSchema.parse({ ok: true, handle: 0 });
    expect(parsed.ok).toBe(true);
  });

  it('accepts a rejection', () => {
    const parsed = TileCacheObstacleResultSchema.parse({
      ok: false,
      reason: 'capacity-exceeded',
      message: 'queue full',
    });
    expect(parsed.ok).toBe(false);
  });

  it('rejects negative handle', () => {
    expect(() =>
      TileCacheObstacleResultSchema.parse({ ok: true, handle: -1 }),
    ).toThrow();
  });
});

describe('TileCacheObstacleRejectionSchema', () => {
  it('accepts the documented values', () => {
    expect(TileCacheObstacleRejectionSchema.parse('navmesh-disposed')).toBe(
      'navmesh-disposed',
    );
    expect(TileCacheObstacleRejectionSchema.parse('recast-rejected')).toBe(
      'recast-rejected',
    );
    expect(TileCacheObstacleRejectionSchema.parse('capacity-exceeded')).toBe(
      'capacity-exceeded',
    );
  });
});

describe('TileCacheObstacleKindSchema', () => {
  it('accepts cylinder and box', () => {
    expect(TileCacheObstacleKindSchema.parse('cylinder')).toBe('cylinder');
    expect(TileCacheObstacleKindSchema.parse('box')).toBe('box');
  });
});

describe('NavMeshSourceSchema (format discriminant)', () => {
  const BASE = {
    tileSize: 10,
    boundsMin: [-25, -1, -25] as [number, number, number],
    boundsMax: [25, 5, 25] as [number, number, number],
    geometry: {
      ground: { kind: 'box' as const, min: [-25, -1, -25], max: [25, 0, 25] },
    },
  };

  it("defaults format to 'solo' when omitted", () => {
    const parsed = NavMeshSourceSchema.parse(BASE);
    expect(parsed.format).toBe('solo');
  });

  it("accepts format: 'tilecache'", () => {
    const parsed = NavMeshSourceSchema.parse({ ...BASE, format: 'tilecache' });
    expect(parsed.format).toBe('tilecache');
  });

  it('rejects unknown format', () => {
    expect(() =>
      NavMeshSourceSchema.parse({ ...BASE, format: 'solo-tiled' }),
    ).toThrow();
  });

  it('exposes default maxObstacles + expectedLayersPerTile', () => {
    const parsed = NavMeshSourceSchema.parse({ ...BASE, format: 'tilecache' });
    expect(parsed.maxObstacles).toBe(128);
    expect(parsed.expectedLayersPerTile).toBe(1);
  });
});
