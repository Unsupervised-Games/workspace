import { describe, expect, it } from 'vitest';
import { LodLevelSchema, LodSchema } from '../ecs/components.js';

describe('LodLevelSchema', () => {
  it('accepts a basic level', () => {
    const parsed = LodLevelSchema.parse({
      distance: 100,
      modelId: 'tree_high',
    });
    expect(parsed.distance).toBe(100);
    expect(parsed.modelId).toBe('tree_high');
  });

  it('rejects negative distance', () => {
    expect(() =>
      LodLevelSchema.parse({ distance: -1, modelId: 'x' }),
    ).toThrow();
  });

  it('rejects missing modelId', () => {
    expect(() => LodLevelSchema.parse({ distance: 10 })).toThrow();
  });
});

describe('LodSchema', () => {
  it('accepts a single-level config', () => {
    const parsed = LodSchema.parse({
      levels: [{ distance: 0, modelId: 'only' }],
    });
    expect(parsed.levels).toHaveLength(1);
    expect(parsed.hysteresis).toBeUndefined();
    expect(parsed.activeIndex).toBeUndefined();
  });

  it('accepts a multi-level config + hysteresis + runtime activeIndex', () => {
    const parsed = LodSchema.parse({
      levels: [
        { distance: 0, modelId: 'high' },
        { distance: 100, modelId: 'mid' },
        { distance: 625, modelId: 'low' },
      ],
      hysteresis: 0.05,
      activeIndex: 1,
    });
    expect(parsed.levels).toHaveLength(3);
    expect(parsed.hysteresis).toBe(0.05);
    expect(parsed.activeIndex).toBe(1);
  });

  it('rejects an empty levels array', () => {
    expect(() => LodSchema.parse({ levels: [] })).toThrow();
  });

  it('rejects out-of-bounds hysteresis', () => {
    const base = { levels: [{ distance: 0, modelId: 'a' }] };
    expect(() => LodSchema.parse({ ...base, hysteresis: -0.1 })).toThrow();
    expect(() => LodSchema.parse({ ...base, hysteresis: 0.6 })).toThrow();
  });

  it('rejects negative activeIndex', () => {
    expect(() =>
      LodSchema.parse({
        levels: [{ distance: 0, modelId: 'a' }],
        activeIndex: -1,
      }),
    ).toThrow();
  });

  // NOTE: the "levels sorted ascending" invariant is enforced by
  // the `lod()` builder, NOT the schema — per the schemas package
  // CLAUDE.md, refinements on Entity-slot schemas break
  // EntitySchema.shape.foo.optional() composition. The schema
  // accepts unsorted level arrays; the builder rejects them at
  // construction time, and the LOD system documents undefined
  // behavior for apps that bypass the builder.
  it('does NOT enforce ascending-distance invariant at the schema layer', () => {
    const parsed = LodSchema.parse({
      levels: [
        { distance: 100, modelId: 'mid' },
        { distance: 0, modelId: 'high' },
      ],
    });
    expect(parsed.levels[0]!.distance).toBe(100);
  });
});
