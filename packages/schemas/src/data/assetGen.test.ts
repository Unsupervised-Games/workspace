import { describe, expect, it } from 'vitest';
import {
  AssetGroundingSchema,
  ImagePostSchema,
  ImageValidationOptionsSchema,
  PromptSidecarSchema,
  StyleConfigSchema,
} from './assetGen.js';

describe('ImageSidecar (via PromptSidecar union)', () => {
  const base = {
    kind: 'image' as const,
    service: 'civitai' as const,
    role: 'sprite' as const,
    prompt: 'a shrine maiden, front idle',
  };

  it('parses a minimal image sidecar with defaults', () => {
    const s = PromptSidecarSchema.parse(base);
    expect(s.kind).toBe('image');
    if (s.kind !== 'image') throw new Error('narrowing');
    expect(s.role).toBe('sprite');
    expect(s.tiling).toBe(false);
  });

  it('discriminates image vs model on kind', () => {
    const img = PromptSidecarSchema.parse(base);
    expect(img.kind).toBe('image');
    const model = PromptSidecarSchema.parse({
      kind: 'model',
      service: 'meshy',
      prompt: 'a sword',
    });
    expect(model.kind).toBe('model');
  });

  it('rejects an unknown role', () => {
    expect(() =>
      PromptSidecarSchema.parse({ ...base, role: 'banner' }),
    ).toThrow();
  });

  it('carries a grounding record with null fingerprints by default', () => {
    const s = PromptSidecarSchema.parse({
      ...base,
      grounding: {
        groundedAt: '2026-07-08T00:00:00.000Z',
        cards: [{ cardId: 'character:reiska', resolved: true }],
      },
    });
    if (s.kind !== 'image') throw new Error('narrowing');
    expect(s.grounding?.cards[0]?.fingerprint).toBeNull();
    expect(s.grounding?.artBibleFingerprint).toBeNull();
    expect(s.grounding?.fields).toEqual(['prompt']);
  });
});

describe('AssetGroundingSchema', () => {
  it('defaults fields to [prompt] and fingerprints to null', () => {
    const g = AssetGroundingSchema.parse({ groundedAt: 't' });
    expect(g.fields).toEqual(['prompt']);
    expect(g.cards).toEqual([]);
    expect(g.artBibleFingerprint).toBeNull();
  });

  it('rejects a malformed card id', () => {
    expect(() =>
      AssetGroundingSchema.parse({
        groundedAt: 't',
        cards: [{ cardId: 'Reiska', resolved: true }],
      }),
    ).toThrow();
  });
});

describe('ImageValidationOptions + ImagePost defaults', () => {
  it('validation defaults are conservative', () => {
    const v = ImageValidationOptionsSchema.parse({});
    expect(v.requireAlpha).toBe(false);
    expect(v.maxTransparentFraction).toBe(0.98);
    expect(v.minWidth).toBe(16);
  });

  it('post defaults are all off', () => {
    const p = ImagePostSchema.parse({});
    expect(p.removeBackground).toBe(false);
    expect(p.cropToContent).toBe(false);
    expect(p.quantizeToPalette).toBe(false);
  });
});

describe('StyleConfig — image extensions', () => {
  it('accepts styleByKind.image + defaultValidation.image', () => {
    const c = StyleConfigSchema.parse({
      stylePrefix: 'flat cel-shading',
      styleByKind: { image: 'Mononoke palette, 2px outline' },
      defaultValidation: { image: { requireAlpha: true } },
    });
    expect(c.styleByKind?.image).toContain('outline');
    expect(c.defaultValidation?.image?.requireAlpha).toBe(true);
  });

  it('accepts a loraCast with default strength (Phase 5)', () => {
    const c = StyleConfigSchema.parse({
      loraCast: {
        reiska: { urn: 'urn:air:zImage:lora:civitai:123@456' },
        wisp: { urn: 'urn:air:zImage:lora:civitai:789@012', strength: 1.2 },
      },
    });
    expect(c.loraCast?.reiska?.strength).toBe(0.8); // default
    expect(c.loraCast?.wisp?.strength).toBe(1.2);
    expect(c.review).toBeUndefined();
  });
});

describe('StyleConfig — motion library (animation Phase 1)', () => {
  it('parses a motion library + kits and defaults loop=false', () => {
    const c = StyleConfigSchema.parse({
      motionLibrary: {
        idle: { intent: 'idle breathing', loop: true, source: { backend: 'meshy-library', actionId: 0 } },
        attack: { intent: 'heavy swing', source: { backend: 'meshy-library', actionId: 4 } },
      },
      motionKits: { 'humanoid-basic': ['idle'] },
    });
    expect(c.motionLibrary?.idle?.loop).toBe(true);
    expect(c.motionLibrary?.attack?.loop).toBe(false); // default
    expect(c.motionLibrary?.attack?.source.backend).toBe('meshy-library');
    expect(c.motionKits?.['humanoid-basic']).toEqual(['idle']);
  });

  it('rejects an unknown motion backend', () => {
    const r = StyleConfigSchema.safeParse({
      motionLibrary: {
        x: { intent: 'x', source: { backend: 'mocap', actionId: 1 } },
      },
    });
    expect(r.success).toBe(false);
  });

  it('rejects an empty kit', () => {
    const r = StyleConfigSchema.safeParse({ motionKits: { empty: [] } });
    expect(r.success).toBe(false);
  });
});

describe('ModelSidecar — motion kit fields', () => {
  it('parses motionKit + motionAdd alongside the legacy animations array', () => {
    const s = PromptSidecarSchema.parse({
      kind: 'model',
      service: 'meshy',
      prompt: 'stone guardian',
      withRig: true,
      motionKit: 'humanoid-basic',
      motionAdd: ['attack-heavy', 'death'],
    });
    expect(s.kind).toBe('model');
    if (s.kind !== 'model') return;
    expect(s.motionKit).toBe('humanoid-basic');
    expect(s.motionAdd).toEqual(['attack-heavy', 'death']);
    expect(s.animations).toEqual([]); // legacy default preserved
  });

  it('grounds motion via the shared grounding record (fields union)', () => {
    // A character grounded for BOTH art (prompt) and motion (kit).
    const g = AssetGroundingSchema.parse({
      groundedAt: '2026-07-09T00:00:00.000Z',
      fields: ['prompt', 'motionKit', 'motionAdd'],
      cards: [{ cardId: 'character:guardian', resolved: true }],
    });
    expect(g.fields).toContain('motionKit');
    expect(g.fields).toContain('motionAdd');
    expect(g.cards[0]?.fingerprint).toBeNull(); // detector stamps it
    expect(g.artBibleFingerprint).toBeNull();
  });
});
