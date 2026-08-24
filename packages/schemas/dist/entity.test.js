import { describe, expect, it } from 'vitest';
import { EntitySchema } from './ecs/entity.js';
describe('EntitySchema', () => {
    it('accepts an empty entity (all component slots optional)', () => {
        expect(EntitySchema.parse({})).toEqual({});
    });
    it('round-trips a fully-populated entity', () => {
        const input = {
            id: 'player-1',
            transform: {
                position: { x: 1, y: 2, z: 3 },
                rotation: { x: 0, y: 0, z: 0, w: 1 },
                scale: { x: 1, y: 1, z: 1 },
            },
            health: { current: 80, max: 100 },
        };
        expect(EntitySchema.parse(input)).toEqual(input);
    });
    it('rejects negative health (nonnegative constraint)', () => {
        expect(() => EntitySchema.parse({ health: { current: -1, max: 100 } })).toThrow();
    });
});
//# sourceMappingURL=entity.test.js.map