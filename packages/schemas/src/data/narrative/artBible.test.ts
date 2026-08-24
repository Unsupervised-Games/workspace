import { describe, expect, it } from 'vitest';
import { ArtBibleSchema, PaletteSwatchSchema } from './artBible.js';

describe('ArtBibleSchema', () => {
  const base = { title: 'Komorebi — Art Bible', createdAt: 'x', updatedAt: 'y' };

  it('parses a minimal bible with empty defaults', () => {
    const b = ArtBibleSchema.parse(base);
    expect(b.pillars).toEqual([]);
    expect(b.palette).toEqual([]);
    expect(b.negatives).toEqual([]);
    expect(b.cover).toBeNull();
  });

  it('carries pillars, palette, and negatives', () => {
    const b = ArtBibleSchema.parse({
      ...base,
      pillars: ['serene', 'melancholy'],
      palette: [{ name: 'kodama-green', hex: '#6b8f6a', role: 'core' }],
      negatives: ['no lens flare'],
    });
    expect(b.pillars).toHaveLength(2);
    expect(b.palette[0]?.name).toBe('kodama-green');
    expect(b.negatives[0]).toBe('no lens flare');
  });
});

describe('PaletteSwatchSchema', () => {
  it('defaults role to core', () => {
    expect(PaletteSwatchSchema.parse({ name: 'x', hex: '#112233' }).role).toBe(
      'core',
    );
  });

  it('rejects a non-hex color', () => {
    expect(() => PaletteSwatchSchema.parse({ name: 'x', hex: 'green' })).toThrow();
    expect(() =>
      PaletteSwatchSchema.parse({ name: 'x', hex: '#12345' }),
    ).toThrow();
  });
});
