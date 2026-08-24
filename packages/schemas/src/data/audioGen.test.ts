// Preset library invariants. Every entry in POST_CHAIN_PRESETS
// must:
//   1. Schema-validate as an AudioPostChain (catches typos in
//      enum values, out-of-range gains, etc.).
//   2. Carry a non-empty id + name + description.
//   3. List at least one applicable kind.
//   4. Have a unique id within the array (lookups by id assume
//      uniqueness).

import { describe, expect, it } from 'vitest';
import {
  AudioPostChainSchema,
  POST_CHAIN_PRESETS,
  findPostChainPreset,
  postChainPresetsFor,
} from './audioGen.js';

describe('POST_CHAIN_PRESETS invariants', () => {
  it('has at least one preset per kind', () => {
    for (const kind of ['voice', 'sfx', 'music'] as const) {
      const matches = POST_CHAIN_PRESETS.filter((p) =>
        p.appliesTo.includes(kind),
      );
      expect(
        matches.length,
        `expected at least one preset for kind '${kind}'`,
      ).toBeGreaterThan(0);
    }
  });

  it('has unique ids', () => {
    const ids = POST_CHAIN_PRESETS.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it.each(POST_CHAIN_PRESETS)(
    'preset $id has valid metadata',
    (preset) => {
      expect(preset.id).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      expect(preset.name.length).toBeGreaterThan(0);
      expect(preset.description.length).toBeGreaterThan(0);
      expect(preset.appliesTo.length).toBeGreaterThan(0);
    },
  );

  it.each(POST_CHAIN_PRESETS)(
    'preset $id chain validates against AudioPostChainSchema',
    (preset) => {
      const result = AudioPostChainSchema.safeParse(preset.chain);
      expect(
        result.success,
        result.success
          ? ''
          : `preset ${preset.id} failed validation: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
      ).toBe(true);
    },
  );
});

describe('findPostChainPreset', () => {
  it('returns the matching preset', () => {
    const preset = findPostChainPreset('voice-broadcast');
    expect(preset?.id).toBe('voice-broadcast');
  });

  it('returns null on unknown id', () => {
    expect(findPostChainPreset('does-not-exist')).toBeNull();
  });
});

describe('postChainPresetsFor', () => {
  it('returns only voice presets when asked', () => {
    const presets = postChainPresetsFor('voice');
    expect(presets.length).toBeGreaterThan(0);
    for (const p of presets) {
      expect(p.appliesTo).toContain('voice');
    }
  });

  it('returns only music presets when asked', () => {
    const presets = postChainPresetsFor('music');
    for (const p of presets) {
      expect(p.appliesTo).toContain('music');
    }
  });

  it('returns only sfx presets when asked', () => {
    const presets = postChainPresetsFor('sfx');
    for (const p of presets) {
      expect(p.appliesTo).toContain('sfx');
    }
  });
});
