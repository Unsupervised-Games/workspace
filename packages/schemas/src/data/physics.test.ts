// Tests for the Phase 1 + Phase 2 physics schemas: new collider variants,
// JointSlot kinds, character-controller tuning, grab state, and the
// bus / query data shapes in this file.

import { describe, expect, it } from 'vitest';
import {
  CharacterControllerSchema,
  ColliderSchema,
  CompoundChildSchema,
  CompoundColliderSchema,
  ConvexHullColliderSchema,
  CylinderColliderSchema,
  DistanceJointSlotSchema,
  FixedJointSlotSchema,
  AscendStateSchema,
  BuoyantSchema,
  GrabStateSchema,
  HeightfieldColliderSchema,
  JointSlotSchema,
  PrismaticJointSlotSchema,
  RecallableSchema,
  RevoluteJointSlotSchema,
  SphericalJointSlotSchema,
  TrimeshColliderSchema,
  WaterVolumeSchema,
} from '../ecs/components.js';
import {
  PhysicsCollisionEventSchema,
  PhysicsSensorEventSchema,
  RaycastHitSchema,
  ShapeCastHitSchema,
} from './physics.js';

describe('CylinderColliderSchema', () => {
  it('accepts positive halfHeight + radius', () => {
    expect(() =>
      CylinderColliderSchema.parse({
        shape: 'cylinder',
        halfHeight: 0.5,
        radius: 0.3,
      }),
    ).not.toThrow();
  });
  it('rejects non-positive dimensions', () => {
    expect(() =>
      CylinderColliderSchema.parse({
        shape: 'cylinder',
        halfHeight: 0,
        radius: 0.3,
      }),
    ).toThrow();
    expect(() =>
      CylinderColliderSchema.parse({
        shape: 'cylinder',
        halfHeight: 0.5,
        radius: -1,
      }),
    ).toThrow();
  });
});

describe('ConvexHullColliderSchema', () => {
  it('accepts a 4-point hull (12 floats)', () => {
    expect(() =>
      ConvexHullColliderSchema.parse({
        shape: 'convex-hull',
        // tetrahedron corners
        points: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      }),
    ).not.toThrow();
  });
  it('rejects fewer than 4 vertices', () => {
    expect(() =>
      ConvexHullColliderSchema.parse({
        shape: 'convex-hull',
        points: [0, 0, 0, 1, 0, 0, 0, 1, 0], // only 3 vertices
      }),
    ).toThrow();
  });
  it('rejects non-multiple-of-3 length', () => {
    expect(() =>
      ConvexHullColliderSchema.parse({
        shape: 'convex-hull',
        points: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], // 11
      }),
    ).toThrow();
  });
});

describe('TrimeshColliderSchema', () => {
  it('accepts a single-triangle mesh', () => {
    expect(() =>
      TrimeshColliderSchema.parse({
        shape: 'trimesh',
        vertices: [0, 0, 0, 1, 0, 0, 0, 0, 1],
        indices: [0, 1, 2],
      }),
    ).not.toThrow();
  });
  it('rejects negative indices', () => {
    expect(() =>
      TrimeshColliderSchema.parse({
        shape: 'trimesh',
        vertices: [0, 0, 0, 1, 0, 0, 0, 0, 1],
        indices: [0, -1, 2],
      }),
    ).toThrow();
  });
});

describe('HeightfieldColliderSchema', () => {
  it('accepts a 2x2-cell heightfield (3x3 corners → 9 heights)', () => {
    // `nrows` / `ncols` are cell counts; Rapier wants
    // `(nrows + 1) * (ncols + 1)` corner samples.
    expect(() =>
      HeightfieldColliderSchema.parse({
        shape: 'heightfield',
        heights: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        nrows: 2,
        ncols: 2,
        scale: { x: 10, y: 1, z: 10 },
      }),
    ).not.toThrow();
  });
  it('rejects non-positive grid dimensions', () => {
    expect(() =>
      HeightfieldColliderSchema.parse({
        shape: 'heightfield',
        heights: [],
        nrows: 0,
        ncols: 2,
        scale: { x: 1, y: 1, z: 1 },
      }),
    ).toThrow();
  });
});

describe('CompoundColliderSchema', () => {
  const VALID_CHILD: import('../ecs/components.js').CompoundChild = {
    shape: 'box',
    halfExtents: { x: 1, y: 0.1, z: 0.5 },
    localOffset: { x: 0, y: 0, z: 0 },
    localRotation: { x: 0, y: 0, z: 0, w: 1 },
  };

  it('accepts a single-child compound', () => {
    expect(() =>
      CompoundColliderSchema.parse({
        shape: 'compound',
        children: [VALID_CHILD],
      }),
    ).not.toThrow();
  });

  it('rejects empty children array', () => {
    expect(() =>
      CompoundColliderSchema.parse({ shape: 'compound', children: [] }),
    ).toThrow();
  });

  it('rejects compound-of-compound (no nesting)', () => {
    expect(() =>
      CompoundChildSchema.parse({
        shape: 'compound',
        children: [VALID_CHILD],
        localOffset: { x: 0, y: 0, z: 0 },
        localRotation: { x: 0, y: 0, z: 0, w: 1 },
      } as never),
    ).toThrow();
  });

  it('rejects trimesh + heightfield in compound children', () => {
    expect(() =>
      CompoundChildSchema.parse({
        shape: 'trimesh',
        vertices: [0, 0, 0, 1, 0, 0, 0, 0, 1],
        indices: [0, 1, 2],
        localOffset: { x: 0, y: 0, z: 0 },
        localRotation: { x: 0, y: 0, z: 0, w: 1 },
      } as never),
    ).toThrow();
  });

  it('CompoundChildSchema accepts cylinder + convex-hull', () => {
    expect(() =>
      CompoundChildSchema.parse({
        shape: 'cylinder',
        halfHeight: 0.5,
        radius: 0.2,
        localOffset: { x: 0.3, y: 0, z: 0 },
        localRotation: { x: 0, y: 0, z: 0, w: 1 },
      }),
    ).not.toThrow();
    expect(() =>
      CompoundChildSchema.parse({
        shape: 'convex-hull',
        points: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
        localOffset: { x: 0, y: 0, z: 0 },
        localRotation: { x: 0, y: 0, z: 0, w: 1 },
      }),
    ).not.toThrow();
  });
});

describe('ColliderSchema discrimination', () => {
  it("narrows on 'shape' across all 9 variants", () => {
    const variants = [
      { shape: 'box', halfExtents: { x: 1, y: 1, z: 1 } },
      { shape: 'sphere', radius: 1 },
      { shape: 'capsule', halfHeight: 0.5, radius: 0.3 },
      { shape: 'mesh', meshId: 'rock' },
      { shape: 'cylinder', halfHeight: 0.5, radius: 0.3 },
      {
        shape: 'convex-hull',
        points: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      },
      {
        shape: 'trimesh',
        vertices: [0, 0, 0, 1, 0, 0, 0, 0, 1],
        indices: [0, 1, 2],
      },
      {
        shape: 'heightfield',
        heights: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        nrows: 2,
        ncols: 2,
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        shape: 'compound',
        children: [
          {
            shape: 'box',
            halfExtents: { x: 1, y: 1, z: 1 },
            localOffset: { x: 0, y: 0, z: 0 },
            localRotation: { x: 0, y: 0, z: 0, w: 1 },
          },
        ],
      },
    ];
    for (const v of variants) {
      expect(() => ColliderSchema.parse(v)).not.toThrow();
    }
  });

  it('accepts isSensor + emitCollisionEvents on every variant', () => {
    const c = ColliderSchema.parse({
      shape: 'box',
      halfExtents: { x: 1, y: 1, z: 1 },
      isSensor: true,
      emitCollisionEvents: true,
    });
    expect(c.isSensor).toBe(true);
    expect(c.emitCollisionEvents).toBe(true);
  });
});

describe('JointSlot schemas', () => {
  const ANCHOR_A = { x: 0, y: 0, z: 0 };
  const ANCHOR_B = { x: 1, y: 0, z: 0 };

  it('accepts a fixed-weld joint', () => {
    expect(() =>
      FixedJointSlotSchema.parse({
        kind: 'fixed',
        otherEntityId: 'box-b',
        handle: 0,
        localAnchorA: ANCHOR_A,
        localAnchorB: ANCHOR_B,
      }),
    ).not.toThrow();
  });

  it('accepts a revolute joint with limits + motor', () => {
    expect(() =>
      RevoluteJointSlotSchema.parse({
        kind: 'revolute',
        otherEntityId: 'wall',
        handle: 1,
        localAnchorA: ANCHOR_A,
        localAnchorB: ANCHOR_B,
        axis: { x: 0, y: 1, z: 0 },
        limits: [-Math.PI / 2, Math.PI / 2],
        motor: { targetVel: 1.5, maxForce: 100 },
      }),
    ).not.toThrow();
  });

  it('accepts a prismatic joint', () => {
    expect(() =>
      PrismaticJointSlotSchema.parse({
        kind: 'prismatic',
        otherEntityId: 'piston-base',
        handle: 2,
        localAnchorA: ANCHOR_A,
        localAnchorB: ANCHOR_B,
        axis: { x: 1, y: 0, z: 0 },
        limits: [-2, 2],
      }),
    ).not.toThrow();
  });

  it('accepts a spherical joint', () => {
    expect(() =>
      SphericalJointSlotSchema.parse({
        kind: 'spherical',
        otherEntityId: 'anchor',
        handle: 3,
        localAnchorA: ANCHOR_A,
        localAnchorB: ANCHOR_B,
      }),
    ).not.toThrow();
  });

  it('accepts a distance joint with stiffness + damping', () => {
    expect(() =>
      DistanceJointSlotSchema.parse({
        kind: 'distance',
        otherEntityId: 'anchor',
        handle: 4,
        localAnchorA: ANCHOR_A,
        localAnchorB: ANCHOR_B,
        length: 3,
        stiffness: 10,
        damping: 1,
      }),
    ).not.toThrow();
  });

  it("JointSlotSchema narrows on 'kind'", () => {
    const slot = JointSlotSchema.parse({
      kind: 'fixed',
      otherEntityId: 'b',
      handle: 0,
      localAnchorA: ANCHOR_A,
      localAnchorB: ANCHOR_B,
    });
    if (slot.kind === 'fixed') {
      expect(slot.otherEntityId).toBe('b');
    } else {
      throw new Error('expected fixed kind');
    }
  });

  it('rejects negative handle', () => {
    expect(() =>
      FixedJointSlotSchema.parse({
        kind: 'fixed',
        otherEntityId: 'b',
        handle: -1,
        localAnchorA: ANCHOR_A,
        localAnchorB: ANCHOR_B,
      }),
    ).toThrow();
  });

  it('rejects empty otherEntityId', () => {
    expect(() =>
      FixedJointSlotSchema.parse({
        kind: 'fixed',
        otherEntityId: '',
        handle: 0,
        localAnchorA: ANCHOR_A,
        localAnchorB: ANCHOR_B,
      }),
    ).toThrow();
  });
});

describe('Physics event + hit shapes', () => {
  it('PhysicsCollisionEventSchema accepts unknown entities', () => {
    expect(() =>
      PhysicsCollisionEventSchema.parse({
        a: { id: 'a' },
        b: { id: 'b' },
      }),
    ).not.toThrow();
  });
  it('PhysicsSensorEventSchema accepts unknown entities', () => {
    expect(() =>
      PhysicsSensorEventSchema.parse({
        sensor: { id: 'sensor' },
        other: { id: 'player' },
      }),
    ).not.toThrow();
  });
  it('RaycastHitSchema requires non-negative distance', () => {
    const p = { x: 0, y: 0, z: 0 };
    expect(() =>
      RaycastHitSchema.parse({
        entity: {},
        point: p,
        normal: p,
        distance: 0,
      }),
    ).not.toThrow();
    expect(() =>
      RaycastHitSchema.parse({
        entity: {},
        point: p,
        normal: p,
        distance: -1,
      }),
    ).toThrow();
  });
  it('ShapeCastHitSchema extends RaycastHit with witness', () => {
    const p = { x: 0, y: 0, z: 0 };
    expect(() =>
      ShapeCastHitSchema.parse({
        entity: {},
        point: p,
        normal: p,
        distance: 1.5,
        witness: p,
      }),
    ).not.toThrow();
  });
});

describe('CharacterControllerSchema', () => {
  it('accepts an empty config (every field optional)', () => {
    expect(() => CharacterControllerSchema.parse({})).not.toThrow();
  });
  it('accepts a fully-specified config', () => {
    expect(() =>
      CharacterControllerSchema.parse({
        offset: 0.01,
        maxSlopeClimbAngle: Math.PI / 4,
        minSlopeSlideAngle: Math.PI / 4,
        autostep: { maxHeight: 0.3, minWidth: 0.1, includeDynamicBodies: false },
        snapToGroundDistance: 0.2,
        applyImpulsesToDynamics: true,
        characterMass: 2.5,
        grounded: false,
      }),
    ).not.toThrow();
  });
  it('accepts null for autostep + snapToGroundDistance (explicit disable)', () => {
    expect(() =>
      CharacterControllerSchema.parse({
        autostep: null,
        snapToGroundDistance: null,
      }),
    ).not.toThrow();
  });
  it('rejects zero/negative offset', () => {
    expect(() =>
      CharacterControllerSchema.parse({ offset: 0 }),
    ).toThrow();
    expect(() =>
      CharacterControllerSchema.parse({ offset: -0.01 }),
    ).toThrow();
  });
  it('rejects zero/negative characterMass', () => {
    expect(() =>
      CharacterControllerSchema.parse({ characterMass: 0 }),
    ).toThrow();
  });
  it('rejects autostep with zero/negative dimensions', () => {
    expect(() =>
      CharacterControllerSchema.parse({
        autostep: { maxHeight: 0, minWidth: 0.1, includeDynamicBodies: false },
      }),
    ).toThrow();
  });
});

describe('GrabStateSchema', () => {
  const IDENTITY_QUAT = { x: 0, y: 0, z: 0, w: 1 };
  it('accepts the empty-handed initial state', () => {
    expect(() =>
      GrabStateSchema.parse({
        heldEntityId: null,
        holdDistance: 2.5,
        rotationOffset: IDENTITY_QUAT,
      }),
    ).not.toThrow();
  });
  it('accepts a populated grab with previousBodyType', () => {
    expect(() =>
      GrabStateSchema.parse({
        heldEntityId: 'crate-3',
        holdDistance: 3.5,
        rotationOffset: IDENTITY_QUAT,
        previousBodyType: 'dynamic',
      }),
    ).not.toThrow();
  });
  it('rejects zero/negative holdDistance', () => {
    expect(() =>
      GrabStateSchema.parse({
        heldEntityId: null,
        holdDistance: 0,
        rotationOffset: IDENTITY_QUAT,
      }),
    ).toThrow();
  });
  it('rejects invalid previousBodyType', () => {
    expect(() =>
      GrabStateSchema.parse({
        heldEntityId: 'x',
        holdDistance: 2,
        rotationOffset: IDENTITY_QUAT,
        previousBodyType: 'ragdoll',
      }),
    ).toThrow();
  });
  it('accepts undefined previousBodyType (transient)', () => {
    const parsed = GrabStateSchema.parse({
      heldEntityId: null,
      holdDistance: 2,
      rotationOffset: IDENTITY_QUAT,
    });
    expect(parsed.previousBodyType).toBeUndefined();
  });
});

describe('RecallableSchema', () => {
  it('accepts the empty {} default form', () => {
    expect(() => RecallableSchema.parse({})).not.toThrow();
  });
  it('accepts a fully-specified slot', () => {
    expect(() =>
      RecallableSchema.parse({
        capacity: 600,
        phase: 'idle',
        previousBodyType: 'dynamic',
      }),
    ).not.toThrow();
  });
  it('rejects zero/negative/non-integer capacity', () => {
    expect(() => RecallableSchema.parse({ capacity: 0 })).toThrow();
    expect(() => RecallableSchema.parse({ capacity: -10 })).toThrow();
    expect(() => RecallableSchema.parse({ capacity: 100.5 })).toThrow();
  });
  it('rejects invalid phase enum', () => {
    expect(() => RecallableSchema.parse({ phase: 'rewinding' })).toThrow();
  });
});

describe('AscendStateSchema', () => {
  it('accepts the idle initial state', () => {
    expect(() => AscendStateSchema.parse({ phase: 'idle' })).not.toThrow();
  });
  it('accepts a rising state with targetY + tuning', () => {
    expect(() =>
      AscendStateSchema.parse({
        phase: 'rising',
        targetY: 5.2,
        riseSpeed: 6,
        maxAscendHeight: 10,
        previousBodyType: 'dynamic',
      }),
    ).not.toThrow();
  });
  it('rejects missing phase (the only required field)', () => {
    expect(() => AscendStateSchema.parse({})).toThrow();
  });
  it('rejects zero/negative riseSpeed', () => {
    expect(() =>
      AscendStateSchema.parse({ phase: 'idle', riseSpeed: 0 }),
    ).toThrow();
    expect(() =>
      AscendStateSchema.parse({ phase: 'idle', riseSpeed: -1 }),
    ).toThrow();
  });
  it('rejects zero maxAscendHeight', () => {
    expect(() =>
      AscendStateSchema.parse({ phase: 'idle', maxAscendHeight: 0 }),
    ).toThrow();
  });
});

describe('WaterVolumeSchema', () => {
  const BOUNDS = {
    min: { x: -10, y: -2, z: -10 },
    max: { x: 10, y: 0, z: 10 },
  };
  it('accepts bounds-only default form', () => {
    expect(() => WaterVolumeSchema.parse({ bounds: BOUNDS })).not.toThrow();
  });
  it('accepts a fully-tuned volume', () => {
    expect(() =>
      WaterVolumeSchema.parse({
        bounds: BOUNDS,
        density: 1000,
        linearDrag: 0.8,
        angularDrag: 0.5,
      }),
    ).not.toThrow();
  });
  it('rejects missing bounds', () => {
    expect(() => WaterVolumeSchema.parse({ density: 1000 })).toThrow();
  });
  it('rejects zero/negative density', () => {
    expect(() =>
      WaterVolumeSchema.parse({ bounds: BOUNDS, density: 0 }),
    ).toThrow();
    expect(() =>
      WaterVolumeSchema.parse({ bounds: BOUNDS, density: -500 }),
    ).toThrow();
  });
  it('rejects negative drag (zero is fine)', () => {
    expect(() =>
      WaterVolumeSchema.parse({ bounds: BOUNDS, linearDrag: 0 }),
    ).not.toThrow();
    expect(() =>
      WaterVolumeSchema.parse({ bounds: BOUNDS, linearDrag: -0.1 }),
    ).toThrow();
  });
});

describe('BuoyantSchema', () => {
  it('accepts the empty default form', () => {
    expect(() => BuoyantSchema.parse({})).not.toThrow();
  });
  it('accepts a fully-tuned body', () => {
    expect(() =>
      BuoyantSchema.parse({ density: 400, dragMultiplier: 2 }),
    ).not.toThrow();
  });
  it('rejects zero/negative density', () => {
    expect(() => BuoyantSchema.parse({ density: 0 })).toThrow();
    expect(() => BuoyantSchema.parse({ density: -100 })).toThrow();
  });
  it('rejects negative dragMultiplier (zero is fine for "no drag")', () => {
    expect(() => BuoyantSchema.parse({ dragMultiplier: 0 })).not.toThrow();
    expect(() => BuoyantSchema.parse({ dragMultiplier: -1 })).toThrow();
  });
});
