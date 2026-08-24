import { describe, expect, it } from 'vitest';
import { SceneSchema } from './scenes.js';

const validBase = {
  id: 'scene:opening',
  slug: 'opening',
  title: 'The Opening',
  summary: 'Sora descends into the bamboo grove for the first time.',
  body: 'The mist rises off the moss-covered ground...',
  tags: ['act-1', 'intro'],
  relationships: [],
  assets: [],
  cards: ['character:sora', 'location:bamboo-grove', 'ecology:kodama'],
  cover: null,
  createdAt: '2026-06-07T00:00:00.000Z',
  updatedAt: '2026-06-07T00:00:00.000Z',
};

describe('SceneSchema', () => {
  it('accepts a valid scene with a cards array', () => {
    const parsed = SceneSchema.parse(validBase);
    expect(parsed.cards).toEqual([
      'character:sora',
      'location:bamboo-grove',
      'ecology:kodama',
    ]);
  });

  it('defaults cards to an empty array when omitted', () => {
    const { cards: _omit, ...withoutCards } = validBase;
    void _omit;
    const parsed = SceneSchema.parse(withoutCards);
    expect(parsed.cards).toEqual([]);
  });

  it('rejects an id without the scene: prefix', () => {
    const result = SceneSchema.safeParse({
      ...validBase,
      id: 'character:sora',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a card reference that does not match type:slug', () => {
    const result = SceneSchema.safeParse({
      ...validBase,
      cards: ['just-a-slug-no-type'],
    });
    expect(result.success).toBe(false);
  });

  it('accepts scene-to-scene card references (framing scenes)', () => {
    const result = SceneSchema.safeParse({
      ...validBase,
      cards: ['scene:framing-narrator', 'character:sora'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = SceneSchema.safeParse({ ...validBase, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a slug with uppercase letters', () => {
    const result = SceneSchema.safeParse({
      ...validBase,
      id: 'scene:Opening',
      slug: 'Opening',
    });
    expect(result.success).toBe(false);
  });

  it('defaults summary / tags / relationships / assets / body / cover when omitted', () => {
    const parsed = SceneSchema.parse({
      id: 'scene:bare',
      slug: 'bare',
      title: 'Bare',
      createdAt: '2026-06-07T00:00:00.000Z',
      updatedAt: '2026-06-07T00:00:00.000Z',
    });
    expect(parsed.summary).toBe('');
    expect(parsed.tags).toEqual([]);
    expect(parsed.relationships).toEqual([]);
    expect(parsed.assets).toEqual([]);
    expect(parsed.body).toBe('');
    expect(parsed.cover).toBeNull();
    expect(parsed.cards).toEqual([]);
  });

  it('accepts typed relationships on a scene (sequel-of, mirror-of, etc.)', () => {
    const parsed = SceneSchema.parse({
      ...validBase,
      relationships: [
        { targetId: 'scene:framing', type: 'sequel-of' },
        { targetId: 'character:sora', type: 'features' },
      ],
    });
    expect(parsed.relationships).toHaveLength(2);
  });
});
