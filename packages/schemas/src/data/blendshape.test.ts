import { describe, expect, it } from 'vitest';
import {
  BlendshapeClipSchema,
  BlendshapeKeyframeSchema,
  BlendshapeSlotSchema,
} from './blendshape.js';
import { EntitySchema } from '../ecs/entity.js';

describe('BlendshapeKeyframeSchema', () => {
  it('accepts a valid keyframe', () => {
    expect(BlendshapeKeyframeSchema.parse({ time: 0.5, weight: 0.7 })).toEqual(
      { time: 0.5, weight: 0.7 },
    );
  });

  it('rejects negative time', () => {
    expect(() => BlendshapeKeyframeSchema.parse({ time: -0.1, weight: 0.5 })).toThrow();
  });

  it('accepts over-pose weights past 1.0 (apps using HDR-driven shapes)', () => {
    expect(BlendshapeKeyframeSchema.parse({ time: 0, weight: 1.5 }).weight).toBe(1.5);
  });
});

describe('BlendshapeClipSchema', () => {
  it('accepts a clip with one track', () => {
    const clip = BlendshapeClipSchema.parse({
      clipId: 'hero:smile',
      duration: 1,
      tracks: {
        smile: [
          { time: 0, weight: 0 },
          { time: 0.5, weight: 1 },
          { time: 1, weight: 0 },
        ],
      },
    });
    expect(clip.clipId).toBe('hero:smile');
    expect(clip.tracks.smile).toHaveLength(3);
  });

  it('accepts a multi-track clip', () => {
    const clip = BlendshapeClipSchema.parse({
      clipId: 'hero:angry',
      duration: 0.5,
      tracks: {
        browDown: [{ time: 0, weight: 1 }],
        frown: [{ time: 0, weight: 1 }],
      },
    });
    expect(Object.keys(clip.tracks)).toEqual(['browDown', 'frown']);
  });

  it('rejects empty clipId', () => {
    expect(() =>
      BlendshapeClipSchema.parse({
        clipId: '',
        duration: 1,
        tracks: { smile: [{ time: 0, weight: 1 }] },
      }),
    ).toThrow();
  });

  it('rejects non-positive duration', () => {
    expect(() =>
      BlendshapeClipSchema.parse({
        clipId: 'hero:smile',
        duration: 0,
        tracks: { smile: [{ time: 0, weight: 1 }] },
      }),
    ).toThrow();
  });

  it('rejects a track with zero keyframes', () => {
    expect(() =>
      BlendshapeClipSchema.parse({
        clipId: 'hero:smile',
        duration: 1,
        tracks: { smile: [] },
      }),
    ).toThrow();
  });
});

describe('BlendshapeSlotSchema', () => {
  it('parses an empty slot', () => {
    const slot = BlendshapeSlotSchema.parse({ playing: [], liveTargets: {} });
    expect(slot.playing).toEqual([]);
    expect(slot.liveTargets).toEqual({});
  });

  it('parses a slot with playing entries + liveTargets', () => {
    const slot = BlendshapeSlotSchema.parse({
      playing: [
        { clipId: 'hero:smile', elapsed: 0.3, loop: false, weight: 1 },
        { clipId: 'hero:blink', elapsed: 0.0, loop: true, weight: 0.5 },
      ],
      liveTargets: { browFurrow: 0.4 },
    });
    expect(slot.playing).toHaveLength(2);
    expect(slot.liveTargets.browFurrow).toBe(0.4);
  });

  it('integrates as an optional EntitySchema slot', () => {
    const input = {
      id: 'hero',
      blendshape: {
        playing: [{ clipId: 'hero:smile', elapsed: 0, loop: false, weight: 1 }],
        liveTargets: {},
      },
    };
    expect(EntitySchema.parse(input)).toEqual(input);
    expect(EntitySchema.parse({ id: 'hero' })).toEqual({ id: 'hero' });
  });
});
