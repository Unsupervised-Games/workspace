import { describe, expect, it } from 'vitest';
import { CrowdAgentSchema } from '../ecs/components.js';
import {
  CrowdInteractionMatrixSchema,
  CrowdInteractionPolicySchema,
  CrowdStuckReasonSchema,
} from './crowd.js';

describe('CrowdAgentSchema', () => {
  it('accepts the minimum required fields', () => {
    const parsed = CrowdAgentSchema.parse({
      maxSpeed: 4,
      radius: 0.4,
      height: 1.6,
    });
    expect(parsed.maxSpeed).toBe(4);
    expect(parsed.radius).toBe(0.4);
    expect(parsed.height).toBe(1.6);
    expect(parsed.target).toBeUndefined();
  });

  it('accepts the full optional set', () => {
    const parsed = CrowdAgentSchema.parse({
      maxSpeed: 6,
      radius: 0.5,
      height: 2,
      maxAcceleration: 25,
      arrivalRadius: 0.75,
      separationWeight: 4,
      obstacleAvoidanceType: 3,
      target: { x: 10, y: 0, z: 5 },
    });
    expect(parsed.separationWeight).toBe(4);
    expect(parsed.obstacleAvoidanceType).toBe(3);
    expect(parsed.target).toEqual({ x: 10, y: 0, z: 5 });
  });

  it('rejects non-positive radius / height / maxSpeed', () => {
    expect(() =>
      CrowdAgentSchema.parse({ maxSpeed: 0, radius: 1, height: 1 }),
    ).toThrow();
    expect(() =>
      CrowdAgentSchema.parse({ maxSpeed: 1, radius: -0.1, height: 1 }),
    ).toThrow();
  });

  it('rejects obstacleAvoidanceType outside [0, 4]', () => {
    expect(() =>
      CrowdAgentSchema.parse({
        maxSpeed: 4,
        radius: 0.4,
        height: 1.6,
        obstacleAvoidanceType: 5,
      }),
    ).toThrow();
  });
});

describe('CrowdStuckReasonSchema', () => {
  it('accepts the three documented reasons', () => {
    expect(CrowdStuckReasonSchema.parse('no-path')).toBe('no-path');
    expect(CrowdStuckReasonSchema.parse('off-mesh')).toBe('off-mesh');
    expect(CrowdStuckReasonSchema.parse('invalid-state')).toBe('invalid-state');
  });

  it('rejects unknown reasons', () => {
    expect(() => CrowdStuckReasonSchema.parse('unknown')).toThrow();
  });
});

describe('CrowdAgentSchema.crowdId', () => {
  it("defaults to 'default' when omitted (single-crowd back-compat)", () => {
    const parsed = CrowdAgentSchema.parse({
      maxSpeed: 4,
      radius: 0.4,
      height: 1.6,
    });
    expect(parsed.crowdId).toBe('default');
  });

  it('round-trips a custom crowdId', () => {
    const parsed = CrowdAgentSchema.parse({
      crowdId: 'red-team',
      maxSpeed: 4,
      radius: 0.4,
      height: 1.6,
    });
    expect(parsed.crowdId).toBe('red-team');
  });

  it('rejects empty crowdId', () => {
    expect(() =>
      CrowdAgentSchema.parse({
        crowdId: '',
        maxSpeed: 4,
        radius: 0.4,
        height: 1.6,
      }),
    ).toThrow();
  });
});

describe('CrowdInteractionPolicySchema', () => {
  it('accepts the three documented policies', () => {
    expect(CrowdInteractionPolicySchema.parse('cooperative')).toBe('cooperative');
    expect(CrowdInteractionPolicySchema.parse('opaque')).toBe('opaque');
    expect(CrowdInteractionPolicySchema.parse('transparent')).toBe('transparent');
  });

  it('rejects unknown policies', () => {
    expect(() => CrowdInteractionPolicySchema.parse('hostile')).toThrow();
  });
});

describe('CrowdInteractionMatrixSchema', () => {
  it('parses an empty matrix (every pair defaults to transparent)', () => {
    expect(CrowdInteractionMatrixSchema.parse({})).toEqual({});
  });

  it('parses a symmetric opaque pair', () => {
    const m = {
      red: { blue: 'opaque' as const },
      blue: { red: 'opaque' as const },
    };
    expect(CrowdInteractionMatrixSchema.parse(m)).toEqual(m);
  });

  it('parses an asymmetric matrix (red sees blue but not vice versa)', () => {
    const m = {
      red: { blue: 'opaque' as const },
      blue: { red: 'transparent' as const },
    };
    expect(CrowdInteractionMatrixSchema.parse(m)).toEqual(m);
  });

  it('rejects nested policies with invalid enum values', () => {
    expect(() =>
      CrowdInteractionMatrixSchema.parse({
        red: { blue: 'enemy' },
      }),
    ).toThrow();
  });
});
