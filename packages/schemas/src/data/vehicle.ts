// Vehicle schemas — JSON-shaped tuning + per-wheel descriptions
// for `@unsupervised/features/vehicle`'s raycast-suspension controller.
//
// Apps write `compact-car.json`, `truck.json`, `motorcycle.json`
// tuning files; live-tune during development; ship-time the
// forge pipeline emits typed constants.
//
// Per-wheel data is REQUIRED (not derived from a chassis shape).
// Realistic feel needs front-vs-rear weight distribution,
// steerable-vs-driven flags, per-wheel friction — all chosen
// by the author. The system below applies these as Rapier's
// `DynamicRayCastVehicleController` settings.
//
// Coordinate convention: per-wheel `position` is the chassis-
// LOCAL position of the wheel's hub (suspension attachment
// point). `directionDown` is the local-space downward
// direction the suspension ray-casts along (typically
// `(0, -1, 0)` on a Y-up vehicle). `axleAxis` is the wheel's
// rotation axis in local space (typically `(-1, 0, 0)` for
// left-facing wheels or `(1, 0, 0)` for right-facing). Apps
// using non-Y-up chassis override these axes per-wheel.

import { z } from 'zod';
import { Vec3Schema } from '../ecs/components.js';

/** Per-wheel description. The vehicle controller installs one
 *  raycast suspension per entry. */
export const WheelSchema = z.object({
  /** Chassis-local position of the wheel's hub (the suspension
   *  ray's start point). */
  position: Vec3Schema,
  /** Wheel radius in meters. Wheel-ground contact lies along
   *  `position + directionDown × suspensionLength + radius`. */
  radius: z.number().positive(),
  /** Local-space direction the suspension ray-casts along.
   *  Default `{ x: 0, y: -1, z: 0 }` (down on a Y-up chassis). */
  directionDown: Vec3Schema.default(() => ({ x: 0, y: -1, z: 0 })),
  /** Local-space wheel-axle axis. Default `{ x: -1, y: 0, z: 0 }`
   *  for wheels mounted on the left side of the chassis. */
  axleAxis: Vec3Schema.default(() => ({ x: -1, y: 0, z: 0 })),
  /** Suspension rest length (the spring's natural length, in
   *  meters). The system reads this as Rapier's
   *  `wheelSuspensionRestLength`. */
  suspensionRestLength: z.number().positive(),
  /** Maximum distance the wheel can travel up or down from
   *  the rest length before clamping. */
  suspensionMaxTravel: z.number().positive(),
  /** When true, this wheel turns with steering input. Typically
   *  front wheels. */
  steerable: z.boolean().default(false),
  /** When true, engine torque applies to this wheel. Front-
   *  wheel-drive = front wheels driven; rear-wheel-drive =
   *  rear; all-wheel-drive = both. */
  driven: z.boolean().default(false),
  /** Per-wheel friction coefficient (sticktion / traction).
   *  Maps to Rapier's `wheelFrictionSlip`. Higher = more grip.
   *  Realistic values are in the 5-15 range; arcade games
   *  bump higher. */
  friction: z.number().nonnegative().default(8),
  /** Side-friction multiplier (lateral grip — how much the
   *  wheel resists sliding sideways). Maps to Rapier's
   *  `wheelSideFrictionStiffness`. Higher = grippier corners,
   *  less drift. Realistic 1-2 range. */
  sideFriction: z.number().nonnegative().default(1),
});
export type Wheel = z.infer<typeof WheelSchema>;

/** Vehicle tuning configuration. Lives on the entity's
 *  `vehicle` slot. Read by
 *  `@unsupervised/features/vehicle`'s system to drive Rapier's
 *  `DynamicRayCastVehicleController`. */
export const VehicleSchema = z.object({
  /** Engine torque applied to driven wheels at full throttle,
   *  in Newtons (force units — Rapier's
   *  `setWheelEngineForce`). Compact car ~1500; truck ~3500;
   *  motorcycle ~1200. */
  enginePower: z.number().nonnegative(),
  /** Brake force applied to all wheels at full brake. Newtons.
   *  Compact car ~80; truck ~140; motorcycle ~60. */
  brakeForce: z.number().nonnegative(),
  /** Handbrake force — applied additively on top of `brakeForce`
   *  when the handbrake action is held. Typically 2-3× brake. */
  handbrakeForce: z.number().nonnegative().default(0),
  /** Maximum steering angle (radians) the front wheels can
   *  turn. Compact car ~0.5 (≈ 29°); truck ~0.4; motorcycle
   *  ~0.6 (motorcycles steer sharper). */
  maxSteerAngle: z.number().positive(),
  /** Steering response — how fast steering input ramps from
   *  0 to `maxSteerAngle` (1 / seconds). Higher = snappier.
   *  Compact car ~4; truck ~2.5; motorcycle ~6. */
  steerResponseRate: z.number().positive(),
  /** Per-wheel description. v1 expects 2-4 wheels (2 for a
   *  motorcycle, 4 for cars). */
  wheels: z.array(WheelSchema).min(2),
  /** Suspension stiffness (Hooke's-law spring constant). Maps
   *  to Rapier's `wheelSuspensionStiffness`. Realistic 30-60;
   *  trucks ~50; sports cars ~40; motorcycles ~35. */
  suspensionStiffness: z.number().positive(),
  /** Suspension damping when compressing (the spring is being
   *  squeezed downward). Maps to
   *  `wheelSuspensionCompression`. Realistic 0.5-3. */
  suspensionDampingCompression: z.number().nonnegative(),
  /** Suspension damping when extending (the spring is rebounding
   *  back to rest). Maps to `wheelSuspensionRelaxation`. Higher
   *  = less bounce. Realistic 1-5. */
  suspensionDampingRebound: z.number().nonnegative(),
  /** Maximum suspension force (Newtons). Caps how hard the
   *  suspension can push back. Realistic 5000-20000 — tune up
   *  for heavy vehicles. */
  suspensionMaxForce: z.number().positive().default(8000),
  /** Action ids the system reads from the input mapper. Defaults
   *  use the conventional prefix; apps override to namespace
   *  per-vehicle when wiring multi-player gamepads. */
  actions: z
    .object({
      accelerate: z.string().default('vehicle:accelerate'),
      brake: z.string().default('vehicle:brake'),
      steerLeft: z.string().default('vehicle:steer-left'),
      steerRight: z.string().default('vehicle:steer-right'),
      steerAxis: z.string().default('vehicle:steer-axis'),
      handbrake: z.string().default('vehicle:handbrake'),
    })
    .default(() => ({
      accelerate: 'vehicle:accelerate',
      brake: 'vehicle:brake',
      steerLeft: 'vehicle:steer-left',
      steerRight: 'vehicle:steer-right',
      steerAxis: 'vehicle:steer-axis',
      handbrake: 'vehicle:handbrake',
    })),
  /** Arcade-feel auto-uprighting torque applied to the chassis
   *  while ANY wheel is in ground contact. 0 = no assist
   *  (simulation feel); 5-15 = noticeable righting on bumpy
   *  terrain; 30+ = strong arcade arcade. Apps that DON'T want
   *  a Pacific-Drive-style "the player can't get stuck flipped
   *  on a rock" affordance leave at default 0. */
  autoLevelStiffness: z.number().nonnegative().default(0),
  /** When true, the chassis cannot ROLL (rotate around its
   *  forward axis) or PITCH (rotate around its lateral axis).
   *  Yaw (steering) still works. Required for stable single-
   *  track vehicles — Rapier's raycast vehicle controller has
   *  no lateral support between two centerline wheels, so any
   *  lateral grip force during a turn creates a torque around
   *  the (higher) center of mass that tips the bike over. The
   *  system calls Rapier's `setEnabledRotations(false, true,
   *  false)` on first observation of the entity. Apps that
   *  want simulation-grade two-wheel physics (counter-steering,
   *  lean-to-turn) leave this false and implement their own
   *  balance — that path is OUT_OF_SCOPE for v1. */
  lockRollPitch: z.boolean().default(false),
  /** System-maintained: the current per-frame steering angle in
   *  radians. Lerps toward the target derived from input ×
   *  `steerResponseRate`. Apps don't write this; the system
   *  ticks it. */
  currentSteer: z.number().default(0),
  /** System-maintained: current throttle in [-1, 1] for HUD
   *  + observability. Positive = accelerate, negative =
   *  reverse. */
  currentThrottle: z.number().default(0),
  /** System-maintained: current brake in [0, 1]. */
  currentBrake: z.number().default(0),
});
export type Vehicle = z.infer<typeof VehicleSchema>;
