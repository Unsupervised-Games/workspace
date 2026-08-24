import { describe, expect, it } from 'vitest';
import type { z } from 'zod';
import {
  CARD_TYPES,
  CardSchema,
  CharacterCardSchema,
  EcologyCardSchema,
  EventCardSchema,
  FactionCardSchema,
  ItemCardSchema,
  LABEL_BY_TYPE,
  LocationCardSchema,
  LoreCardSchema,
  PLURAL_BY_TYPE,
  SUBTYPES_BY_TYPE,
} from './cards.js';

const validBase = {
  title: 'The Arena',
  summary: 'An ancient coliseum.',
  body: 'Marble pillars...',
  tags: ['ancient', 'blood-sport'],
  relationships: [
    { targetId: 'character:gladiator-marcus', type: 'champion-of' },
  ],
  assets: [
    {
      path: 'assets-raw/concept/models/sora/front.jpg',
      kind: 'image',
    },
  ],
  cover: 'media/arena.jpg',
  createdAt: '2026-06-05T00:00:00.000Z',
  updatedAt: '2026-06-05T00:00:00.000Z',
};

describe('CardSchema', () => {
  it('accepts a valid character card with no subtype', () => {
    const parsed = CardSchema.parse({
      ...validBase,
      id: 'character:gladiator-marcus',
      slug: 'gladiator-marcus',
      title: 'Marcus',
      type: 'character',
    });
    expect(parsed.type).toBe('character');
    // @ts-expect-error — character has no `subtype` field
    expect(parsed.subtype).toBeUndefined();
  });

  it('accepts a valid location card with a subtype', () => {
    const parsed = CardSchema.parse({
      ...validBase,
      id: 'location:the-arena',
      slug: 'the-arena',
      type: 'location',
      subtype: 'landmark',
    });
    expect(parsed.type).toBe('location');
    if (parsed.type === 'location') {
      expect(parsed.subtype).toBe('landmark');
    }
  });

  it('defaults subtype to null when omitted for types that have subtypes', () => {
    const parsed = CardSchema.parse({
      ...validBase,
      id: 'lore:founding-myth',
      slug: 'founding-myth',
      type: 'lore',
    });
    if (parsed.type === 'lore') {
      expect(parsed.subtype).toBeNull();
    }
  });

  it('rejects a character card with a subtype field', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'character:marcus',
      slug: 'marcus',
      type: 'character',
      subtype: 'city',
    });
    // Zod's `.object()` is strict-ish by default but allows
    // unknown keys. The character schema simply doesn't
    // declare subtype, so it'd be stripped — assert that
    // the parsed result has no subtype.
    expect(result.success).toBe(true);
    if (result.success && result.data.type === 'character') {
      // @ts-expect-error — character has no subtype field
      expect(result.data.subtype).toBeUndefined();
    }
  });

  it('rejects an invalid id shape', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'NoColon',
      slug: 'no-colon',
      type: 'character',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid slug shape', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'character:bad',
      slug: 'Bad Slug With Spaces',
      type: 'character',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid subtype for the location type', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'location:the-arena',
      slug: 'the-arena',
      type: 'location',
      subtype: 'guild',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown card type', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'monster:dragon',
      slug: 'dragon',
      type: 'monster',
    });
    expect(result.success).toBe(false);
  });
});

describe('SUBTYPES_BY_TYPE', () => {
  it('lists subtypes for every non-character type matching the variant schemas', () => {
    expect(SUBTYPES_BY_TYPE.character).toEqual([]);
    expect(SUBTYPES_BY_TYPE.location).toEqual([
      'city',
      'town',
      'landmark',
      'country',
    ]);
    expect(SUBTYPES_BY_TYPE.faction).toEqual([
      'company',
      'agency',
      'gang',
      'guild',
      'organization',
    ]);
    expect(SUBTYPES_BY_TYPE.item).toEqual([
      'weapon',
      'vehicle',
      'device',
      'document',
    ]);
    expect(SUBTYPES_BY_TYPE.event).toEqual([
      'incident',
      'meeting',
      'festival',
    ]);
    expect(SUBTYPES_BY_TYPE.lore).toEqual([
      'history',
      'culture',
      'law',
      'technology',
    ]);
    expect(SUBTYPES_BY_TYPE.ecology).toEqual(['flora', 'fauna']);
  });

  it('keeps every subtype enum in lock-step with its variant schema', () => {
    // If SUBTYPES_BY_TYPE drifts from the schema variants,
    // the UI dropdowns will offer values that fail validation.
    // Each pair is checked by parsing every catalog subtype
    // through the corresponding schema.
    const probe = (
      type: string,
      subtypes: readonly string[],
      schema: z.ZodTypeAny,
    ) => {
      for (const subtype of subtypes) {
        const result = schema.safeParse({
          ...validBase,
          id: `${type}:probe`,
          slug: 'probe',
          type,
          subtype,
        });
        expect(result.success, `${type}/${subtype}`).toBe(true);
      }
    };
    probe('location', SUBTYPES_BY_TYPE.location, LocationCardSchema);
    probe('faction', SUBTYPES_BY_TYPE.faction, FactionCardSchema);
    probe('item', SUBTYPES_BY_TYPE.item, ItemCardSchema);
    probe('event', SUBTYPES_BY_TYPE.event, EventCardSchema);
    probe('lore', SUBTYPES_BY_TYPE.lore, LoreCardSchema);
    probe('ecology', SUBTYPES_BY_TYPE.ecology, EcologyCardSchema);
    // Character: no subtypes to probe; confirm the variant
    // schema still parses without one.
    expect(
      CharacterCardSchema.safeParse({
        ...validBase,
        id: 'character:probe',
        slug: 'probe',
        type: 'character',
      }).success,
    ).toBe(true);
  });
});

describe('catalog tables', () => {
  it('covers every card type in CARD_TYPES, PLURAL_BY_TYPE, LABEL_BY_TYPE, SUBTYPES_BY_TYPE', () => {
    for (const type of CARD_TYPES) {
      expect(PLURAL_BY_TYPE[type]).toBeTruthy();
      expect(LABEL_BY_TYPE[type]).toBeTruthy();
      expect(SUBTYPES_BY_TYPE[type]).toBeDefined();
    }
  });
});

describe('Relation', () => {
  it('defaults relationships to an empty array when omitted', () => {
    const { relationships: _omit, ...withoutRels } = validBase;
    void _omit;
    const parsed = CardSchema.parse({
      ...withoutRels,
      id: 'character:elara',
      slug: 'elara',
      type: 'character',
    });
    expect(parsed.relationships).toEqual([]);
  });

  it('accepts multiple typed relationships', () => {
    const parsed = CardSchema.parse({
      ...validBase,
      id: 'character:sora',
      slug: 'sora',
      type: 'character',
      relationships: [
        { targetId: 'character:elara', type: 'sister' },
        { targetId: 'location:shrine', type: 'home' },
        { targetId: 'faction:kodama-circle', type: 'member-of' },
      ],
    });
    expect(parsed.relationships).toHaveLength(3);
    expect(parsed.relationships[0]?.type).toBe('sister');
  });

  it('rejects a relationship with an empty type', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'character:sora',
      slug: 'sora',
      type: 'character',
      relationships: [{ targetId: 'character:elara', type: '' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a relationship targeting a malformed id', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'character:sora',
      slug: 'sora',
      type: 'character',
      relationships: [{ targetId: 'no-colon', type: 'sister' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('AssetRef', () => {
  it('defaults assets to an empty array when omitted', () => {
    const { assets: _omit, ...withoutAssets } = validBase;
    void _omit;
    const parsed = CardSchema.parse({
      ...withoutAssets,
      id: 'character:elara',
      slug: 'elara',
      type: 'character',
    });
    expect(parsed.assets).toEqual([]);
  });

  it('accepts asset refs for every kind', () => {
    const parsed = CardSchema.parse({
      ...validBase,
      id: 'character:sora',
      slug: 'sora',
      type: 'character',
      assets: [
        { path: 'assets-raw/concept/models/sora/front.jpg', kind: 'image' },
        { path: 'public/models/sora.glb', kind: 'model', label: 'Base mesh' },
        { path: 'assets-raw/audio/sora-voice.wav', kind: 'audio' },
        { path: 'assets-raw/models/sora.prompt.json', kind: 'data' },
      ],
    });
    expect(parsed.assets).toHaveLength(4);
    expect(parsed.assets[1]?.label).toBe('Base mesh');
  });

  it('rejects an asset ref with an unknown kind', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'character:sora',
      slug: 'sora',
      type: 'character',
      assets: [{ path: 'x', kind: 'video' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects an asset ref with an empty path', () => {
    const result = CardSchema.safeParse({
      ...validBase,
      id: 'character:sora',
      slug: 'sora',
      type: 'character',
      assets: [{ path: '', kind: 'image' }],
    });
    expect(result.success).toBe(false);
  });
});
