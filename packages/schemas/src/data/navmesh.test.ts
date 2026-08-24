import { describe, expect, it } from 'vitest';
import {
  NavMeshBakeConfigSchema,
  NavMeshGeometryShapeSchema,
  NavMeshSourceSchema,
  NavMeshTileEntrySchema,
  NavMeshTileManifestSchema,
  TileLoadRejectionSchema,
  TileLoadResultSchema,
} from './navmesh.js';

describe('NavMeshTileManifestSchema', () => {
  const VALID_MANIFEST = {
    worldId: 'grassland',
    tileSize: 64,
    boundsMin: [-256, 0, -256] as [number, number, number],
    boundsMax: [256, 32, 256] as [number, number, number],
    maxTiles: 64,
    maxPolys: 65536,
    config: {
      walkableRadius: 0.6,
      walkableHeight: 2,
      walkableClimb: 0.9,
      walkableSlopeAngle: 45,
      cellSize: 0.3,
      cellHeight: 0.2,
    },
    tiles: [
      { tx: 0, tz: 0, path: '/navmesh/grassland/0_0.bin' },
      { tx: -1, tz: 2, path: '/navmesh/grassland/-1_2.bin' },
    ],
  };

  it('accepts a valid manifest', () => {
    expect(() => NavMeshTileManifestSchema.parse(VALID_MANIFEST)).not.toThrow();
  });

  it('rejects empty worldId', () => {
    expect(() =>
      NavMeshTileManifestSchema.parse({ ...VALID_MANIFEST, worldId: '' }),
    ).toThrow();
  });

  it('rejects non-positive tileSize', () => {
    expect(() =>
      NavMeshTileManifestSchema.parse({ ...VALID_MANIFEST, tileSize: 0 }),
    ).toThrow();
  });

  it('rejects bounds with wrong arity', () => {
    expect(() =>
      NavMeshTileManifestSchema.parse({
        ...VALID_MANIFEST,
        boundsMin: [0, 0] as unknown,
      }),
    ).toThrow();
  });

  it('preserves negative tile coords', () => {
    const parsed = NavMeshTileManifestSchema.parse(VALID_MANIFEST);
    expect(parsed.tiles[1]?.tx).toBe(-1);
  });

  it('rejects empty tile path', () => {
    expect(() =>
      NavMeshTileEntrySchema.parse({ tx: 0, tz: 0, path: '' }),
    ).toThrow();
  });
});

describe('NavMeshSourceSchema', () => {
  const VALID_SOURCE = {
    tileSize: 10,
    boundsMin: [-25, -1, -25] as [number, number, number],
    boundsMax: [25, 5, 25] as [number, number, number],
    geometry: {
      ground: { kind: 'box' as const, min: [-25, -1, -25], max: [25, 0, 25] },
      obstacles: [
        { kind: 'box' as const, min: [-3, 0, -2], max: [-1, 1.5, 1] },
      ],
    },
  };

  it('accepts valid source with empty obstacles default', () => {
    const minimal = {
      tileSize: 10,
      boundsMin: [-25, 0, -25] as [number, number, number],
      boundsMax: [25, 5, 25] as [number, number, number],
      geometry: {
        ground: { kind: 'box' as const, min: [-25, -1, -25], max: [25, 0, 25] },
      },
    };
    const parsed = NavMeshSourceSchema.parse(minimal);
    expect(parsed.geometry.obstacles).toEqual([]);
  });

  it('accepts source with obstacles', () => {
    expect(() => NavMeshSourceSchema.parse(VALID_SOURCE)).not.toThrow();
  });

  it('accepts partial bake config (defaults applied at bake time)', () => {
    const parsed = NavMeshSourceSchema.parse({
      ...VALID_SOURCE,
      config: { walkableRadius: 0.4 },
    });
    expect(parsed.config?.walkableRadius).toBe(0.4);
    expect(parsed.config?.walkableHeight).toBeUndefined();
  });
});

describe('NavMeshGeometryShapeSchema', () => {
  it('accepts a box', () => {
    expect(() =>
      NavMeshGeometryShapeSchema.parse({
        kind: 'box',
        min: [0, 0, 0],
        max: [1, 1, 1],
      }),
    ).not.toThrow();
  });

  it('rejects unknown kind', () => {
    expect(() =>
      NavMeshGeometryShapeSchema.parse({
        kind: 'sphere',
        min: [0, 0, 0],
        max: [1, 1, 1],
      }),
    ).toThrow();
  });
});

describe('NavMeshBakeConfigSchema', () => {
  it('accepts valid config', () => {
    expect(() =>
      NavMeshBakeConfigSchema.parse({
        walkableRadius: 0.6,
        walkableHeight: 2,
        walkableClimb: 0.9,
        walkableSlopeAngle: 45,
        cellSize: 0.3,
        cellHeight: 0.2,
      }),
    ).not.toThrow();
  });

  it('rejects walkableSlopeAngle > 90', () => {
    expect(() =>
      NavMeshBakeConfigSchema.parse({
        walkableRadius: 0.6,
        walkableHeight: 2,
        walkableClimb: 0.9,
        walkableSlopeAngle: 95,
        cellSize: 0.3,
        cellHeight: 0.2,
      }),
    ).toThrow();
  });
});

describe('TileLoadResultSchema', () => {
  it('accepts a success', () => {
    const parsed = TileLoadResultSchema.parse({
      ok: true,
      tx: 0,
      tz: 0,
      fresh: true,
    });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.fresh).toBe(true);
  });

  it('accepts a rejection', () => {
    const parsed = TileLoadResultSchema.parse({
      ok: false,
      tx: 1,
      tz: 2,
      reason: 'fetch-failed',
      message: 'HTTP 404',
    });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.reason).toBe('fetch-failed');
  });

  it('rejects an unknown rejection reason', () => {
    expect(() =>
      TileLoadResultSchema.parse({
        ok: false,
        tx: 0,
        tz: 0,
        reason: 'mystery',
        message: 'unknown',
      }),
    ).toThrow();
  });
});

describe('TileLoadRejectionSchema', () => {
  it('accepts the documented values', () => {
    expect(TileLoadRejectionSchema.parse('unknown-tile')).toBe('unknown-tile');
    expect(TileLoadRejectionSchema.parse('fetch-failed')).toBe('fetch-failed');
    expect(TileLoadRejectionSchema.parse('parse-failed')).toBe('parse-failed');
    expect(TileLoadRejectionSchema.parse('add-tile-failed')).toBe('add-tile-failed');
    expect(TileLoadRejectionSchema.parse('navmesh-disposed')).toBe(
      'navmesh-disposed',
    );
  });
});
