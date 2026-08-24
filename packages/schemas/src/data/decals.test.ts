import { describe, expect, it } from 'vitest';
import { DecalSchema, DecalTargetSchema } from '../ecs/components.js';

describe('DecalSchema', () => {
  it('accepts the minimum required fields', () => {
    const parsed = DecalSchema.parse({
      textureUrl: '/decals/bullet-hole.png',
      targetEntityId: 'wall-01',
      projectorPosition: { x: 1, y: 1.5, z: 0 },
      projectorRotation: { x: 0, y: 0, z: 0 },
      size: { x: 0.4, y: 0.4, z: 0.4 },
    });
    expect(parsed.textureUrl).toBe('/decals/bullet-hole.png');
    expect(parsed.opacity).toBeUndefined();
    expect(parsed.lifetime).toBeUndefined();
    expect(parsed.fadeOut).toBeUndefined();
    expect(parsed.spawnedAt).toBeUndefined();
  });

  it('accepts the full optional set including lifetime + fade', () => {
    const parsed = DecalSchema.parse({
      textureUrl: '/decals/blood.png',
      targetEntityId: 'enemy-12',
      projectorPosition: { x: 0, y: 1, z: 0 },
      projectorRotation: { x: 0, y: Math.PI, z: 0 },
      size: { x: 1, y: 1, z: 1 },
      opacity: 0.8,
      lifetime: 5,
      fadeOut: true,
      spawnedAt: 1234.5,
    });
    expect(parsed.opacity).toBe(0.8);
    expect(parsed.lifetime).toBe(5);
    expect(parsed.fadeOut).toBe(true);
    expect(parsed.spawnedAt).toBe(1234.5);
  });

  it('rejects when textureUrl is missing', () => {
    expect(() =>
      DecalSchema.parse({
        targetEntityId: 'wall-01',
        projectorPosition: { x: 0, y: 0, z: 0 },
        projectorRotation: { x: 0, y: 0, z: 0 },
        size: { x: 1, y: 1, z: 1 },
      }),
    ).toThrow();
  });

  it('rejects when lifetime is zero or negative', () => {
    const base = {
      textureUrl: '/decals/x.png',
      targetEntityId: 'wall-01',
      projectorPosition: { x: 0, y: 0, z: 0 },
      projectorRotation: { x: 0, y: 0, z: 0 },
      size: { x: 1, y: 1, z: 1 },
    };
    expect(() => DecalSchema.parse({ ...base, lifetime: 0 })).toThrow();
    expect(() => DecalSchema.parse({ ...base, lifetime: -1 })).toThrow();
  });

  it('rejects opacity outside [0, 1]', () => {
    const base = {
      textureUrl: '/decals/x.png',
      targetEntityId: 'wall-01',
      projectorPosition: { x: 0, y: 0, z: 0 },
      projectorRotation: { x: 0, y: 0, z: 0 },
      size: { x: 1, y: 1, z: 1 },
    };
    expect(() => DecalSchema.parse({ ...base, opacity: -0.1 })).toThrow();
    expect(() => DecalSchema.parse({ ...base, opacity: 1.5 })).toThrow();
  });
});

describe('DecalTargetSchema', () => {
  it('accepts true', () => {
    expect(DecalTargetSchema.parse(true)).toBe(true);
  });

  it('accepts false (the marker is still typed)', () => {
    expect(DecalTargetSchema.parse(false)).toBe(false);
  });

  it('rejects non-boolean values', () => {
    expect(() => DecalTargetSchema.parse('yes')).toThrow();
    expect(() => DecalTargetSchema.parse(1)).toThrow();
    expect(() => DecalTargetSchema.parse(null)).toThrow();
  });
});
