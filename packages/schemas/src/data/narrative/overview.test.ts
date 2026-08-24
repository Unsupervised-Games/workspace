import { describe, expect, it } from 'vitest';
import { OverviewSchema } from './overview.js';

const validBase = {
  title: 'Komorebi',
  summary: 'A shrine maiden descends through corrupted forest tiers.',
  body: 'A Mononoke-shape roguelike...',
  tags: ['roguelike', 'mononoke'],
  assets: [],
  cover: null,
  createdAt: '2026-06-07T00:00:00.000Z',
  updatedAt: '2026-06-07T00:00:00.000Z',
};

describe('OverviewSchema', () => {
  it('accepts a valid overview', () => {
    const parsed = OverviewSchema.parse(validBase);
    expect(parsed.title).toBe('Komorebi');
    expect(parsed.tags).toEqual(['roguelike', 'mononoke']);
  });

  it('defaults summary / tags / body / assets / cover when omitted', () => {
    const parsed = OverviewSchema.parse({
      title: 'Bare',
      createdAt: '2026-06-07T00:00:00.000Z',
      updatedAt: '2026-06-07T00:00:00.000Z',
    });
    expect(parsed.summary).toBe('');
    expect(parsed.tags).toEqual([]);
    expect(parsed.body).toBe('');
    expect(parsed.assets).toEqual([]);
    expect(parsed.cover).toBeNull();
  });

  it('rejects an empty title', () => {
    const result = OverviewSchema.safeParse({ ...validBase, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing title', () => {
    const result = OverviewSchema.safeParse({
      createdAt: '2026-06-07T00:00:00.000Z',
      updatedAt: '2026-06-07T00:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('accepts asset references on the overview', () => {
    const parsed = OverviewSchema.parse({
      ...validBase,
      assets: [
        { path: 'public/cover.jpg', kind: 'image' },
        { path: 'assets-raw/pitch.pdf', kind: 'data' },
      ],
    });
    expect(parsed.assets).toHaveLength(2);
  });
});
