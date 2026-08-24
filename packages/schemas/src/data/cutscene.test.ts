import { describe, expect, it } from 'vitest';
import {
  CutsceneEaseSchema,
  CutscenePhaseSchema,
  CutscenePlayResultSchema,
  CutscenePoseSchema,
  CutsceneSchema,
  CutsceneSkipResultSchema,
  CutsceneTrackSchema,
} from './cutscene.js';

const POSE = {
  position: { x: 0, y: 5, z: 10 },
  lookAt: { x: 0, y: 0, z: 0 },
};

describe('CutscenePoseSchema', () => {
  it('accepts position + lookAt + optional fov', () => {
    expect(CutscenePoseSchema.parse(POSE)).toEqual(POSE);
    expect(
      CutscenePoseSchema.parse({ ...POSE, fov: 60 }),
    ).toMatchObject({ fov: 60 });
  });

  it('rejects non-positive fov', () => {
    expect(() =>
      CutscenePoseSchema.parse({ ...POSE, fov: 0 }),
    ).toThrow();
  });
});

describe('CutsceneEaseSchema', () => {
  it('accepts the four named curves', () => {
    for (const ease of ['linear', 'ease-in', 'ease-out', 'ease-in-out']) {
      expect(CutsceneEaseSchema.parse(ease)).toBe(ease);
    }
  });

  it('rejects arbitrary strings', () => {
    expect(() => CutsceneEaseSchema.parse('bezier')).toThrow();
  });
});

describe('CutsceneTrackSchema', () => {
  it('parses a camera track', () => {
    const track = CutsceneTrackSchema.parse({
      kind: 'camera',
      atSeconds: 0,
      pose: POSE,
      duration: 2,
      ease: 'ease-in-out',
    });
    expect(track.kind).toBe('camera');
    if (track.kind === 'camera') expect(track.duration).toBe(2);
  });

  it('parses an audio track with default volume omitted', () => {
    const track = CutsceneTrackSchema.parse({
      kind: 'audio',
      atSeconds: 1.5,
      assetId: 'church-bell',
      bus: 'environment',
    });
    expect(track.kind).toBe('audio');
  });

  it('parses an animation track requiring targetEntityId', () => {
    expect(() =>
      CutsceneTrackSchema.parse({
        kind: 'animation',
        atSeconds: 5,
        clipId: 'wave',
      }),
    ).toThrow();
    const track = CutsceneTrackSchema.parse({
      kind: 'animation',
      atSeconds: 5,
      targetEntityId: 'hero',
      clipId: 'wave',
    });
    expect(track.kind).toBe('animation');
  });

  it('parses a marker track with optional payload', () => {
    const track = CutsceneTrackSchema.parse({
      kind: 'marker',
      atSeconds: 3,
      eventName: 'spawn-fireworks',
      payload: { count: 12 },
    });
    if (track.kind === 'marker') {
      expect(track.payload).toEqual({ count: 12 });
    }
  });

  it('parses a fade track applying default color', () => {
    const track = CutsceneTrackSchema.parse({
      kind: 'fade',
      atSeconds: 9,
      from: 0,
      to: 1,
      duration: 1,
    });
    if (track.kind === 'fade') expect(track.color).toBe('#000');
  });

  it('rejects negative atSeconds', () => {
    expect(() =>
      CutsceneTrackSchema.parse({
        kind: 'fade',
        atSeconds: -1,
        from: 0,
        to: 1,
        duration: 1,
      }),
    ).toThrow();
  });

  it('rejects unknown discriminant', () => {
    expect(() =>
      CutsceneTrackSchema.parse({ kind: 'particle', atSeconds: 0 }),
    ).toThrow();
  });
});

describe('CutsceneSchema (top-level discriminated union)', () => {
  it('parses a timeline cutscene with skippable defaulting to true', () => {
    const cs = CutsceneSchema.parse({
      kind: 'timeline',
      id: 'intro-village',
      durationSeconds: 10,
      tracks: [
        {
          kind: 'camera',
          atSeconds: 0,
          pose: POSE,
          duration: 0,
        },
      ],
    });
    if (cs.kind === 'timeline') {
      expect(cs.skippable).toBe(true);
      expect(cs.tracks).toHaveLength(1);
    }
  });

  it('parses a video cutscene with optional fades', () => {
    const cs = CutsceneSchema.parse({
      kind: 'video',
      id: 'studio-logo',
      src: '/cutscenes/studio.webm',
      fadeOutSeconds: 0.5,
    });
    if (cs.kind === 'video') {
      expect(cs.skippable).toBe(true);
      expect(cs.fadeOutSeconds).toBe(0.5);
      expect(cs.fadeInSeconds).toBeUndefined();
    }
  });

  it('rejects timeline cutscene with zero duration', () => {
    expect(() =>
      CutsceneSchema.parse({
        kind: 'timeline',
        id: 'x',
        durationSeconds: 0,
        tracks: [],
      }),
    ).toThrow();
  });

  it('rejects video cutscene with empty src', () => {
    expect(() =>
      CutsceneSchema.parse({ kind: 'video', id: 'x', src: '' }),
    ).toThrow();
  });
});

describe('CutscenePhaseSchema', () => {
  it('accepts all five phase strings', () => {
    for (const phase of [
      'idle',
      'preparing',
      'playing',
      'completing',
      'completed',
    ]) {
      expect(CutscenePhaseSchema.parse(phase)).toBe(phase);
    }
  });
});

describe('CutscenePlayResultSchema', () => {
  it('parses a success', () => {
    const r = CutscenePlayResultSchema.parse({
      ok: true,
      cutsceneId: 'intro',
    });
    expect(r.ok).toBe(true);
  });

  it('parses each rejection reason', () => {
    for (const reason of [
      'unknown-cutscene-id',
      'invalid-track-spec',
      'asset-missing',
      'preempted-by-newer-cutscene',
      'cinematic-disposed',
      'video-decode-failed',
      'audio-context-suspended',
    ] as const) {
      const r = CutscenePlayResultSchema.parse({
        ok: false,
        reason,
        message: 'x',
      });
      if (!r.ok) expect(r.reason).toBe(reason);
    }
  });
});

describe('CutsceneSkipResultSchema', () => {
  it('parses a success with fastForwardedTracks', () => {
    const r = CutsceneSkipResultSchema.parse({
      ok: true,
      fastForwardedTracks: 4,
    });
    if (r.ok) expect(r.fastForwardedTracks).toBe(4);
  });

  it('parses a no-active-cutscene rejection', () => {
    const r = CutsceneSkipResultSchema.parse({
      ok: false,
      reason: 'no-active-cutscene',
      message: 'no cutscene playing',
    });
    if (!r.ok) expect(r.reason).toBe('no-active-cutscene');
  });

  it('parses a not-skippable rejection', () => {
    const r = CutsceneSkipResultSchema.parse({
      ok: false,
      reason: 'not-skippable',
      message: 'studio logo cannot be skipped',
    });
    if (!r.ok) expect(r.reason).toBe('not-skippable');
  });
});
