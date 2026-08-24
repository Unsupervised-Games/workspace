import { z } from 'zod';
/** Per-wheel description. The vehicle controller installs one
 *  raycast suspension per entry. */
export declare const WheelSchema: z.ZodObject<{
    /** Chassis-local position of the wheel's hub (the suspension
     *  ray's start point). */
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>;
    /** Wheel radius in meters. Wheel-ground contact lies along
     *  `position + directionDown × suspensionLength + radius`. */
    radius: z.ZodNumber;
    /** Local-space direction the suspension ray-casts along.
     *  Default `{ x: 0, y: -1, z: 0 }` (down on a Y-up chassis). */
    directionDown: z.ZodDefault<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>>;
    /** Local-space wheel-axle axis. Default `{ x: -1, y: 0, z: 0 }`
     *  for wheels mounted on the left side of the chassis. */
    axleAxis: z.ZodDefault<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
    }, {
        x: number;
        y: number;
        z: number;
    }>>;
    /** Suspension rest length (the spring's natural length, in
     *  meters). The system reads this as Rapier's
     *  `wheelSuspensionRestLength`. */
    suspensionRestLength: z.ZodNumber;
    /** Maximum distance the wheel can travel up or down from
     *  the rest length before clamping. */
    suspensionMaxTravel: z.ZodNumber;
    /** When true, this wheel turns with steering input. Typically
     *  front wheels. */
    steerable: z.ZodDefault<z.ZodBoolean>;
    /** When true, engine torque applies to this wheel. Front-
     *  wheel-drive = front wheels driven; rear-wheel-drive =
     *  rear; all-wheel-drive = both. */
    driven: z.ZodDefault<z.ZodBoolean>;
    /** Per-wheel friction coefficient (sticktion / traction).
     *  Maps to Rapier's `wheelFrictionSlip`. Higher = more grip.
     *  Realistic values are in the 5-15 range; arcade games
     *  bump higher. */
    friction: z.ZodDefault<z.ZodNumber>;
    /** Side-friction multiplier (lateral grip — how much the
     *  wheel resists sliding sideways). Maps to Rapier's
     *  `wheelSideFrictionStiffness`. Higher = grippier corners,
     *  less drift. Realistic 1-2 range. */
    sideFriction: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    position: {
        x: number;
        y: number;
        z: number;
    };
    radius: number;
    friction: number;
    directionDown: {
        x: number;
        y: number;
        z: number;
    };
    axleAxis: {
        x: number;
        y: number;
        z: number;
    };
    suspensionRestLength: number;
    suspensionMaxTravel: number;
    steerable: boolean;
    driven: boolean;
    sideFriction: number;
}, {
    position: {
        x: number;
        y: number;
        z: number;
    };
    radius: number;
    suspensionRestLength: number;
    suspensionMaxTravel: number;
    friction?: number | undefined;
    directionDown?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
    axleAxis?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
    steerable?: boolean | undefined;
    driven?: boolean | undefined;
    sideFriction?: number | undefined;
}>;
export type Wheel = z.infer<typeof WheelSchema>;
/** Vehicle tuning configuration. Lives on the entity's
 *  `vehicle` slot. Read by
 *  `@unsupervised/features/vehicle`'s system to drive Rapier's
 *  `DynamicRayCastVehicleController`. */
export declare const VehicleSchema: z.ZodObject<{
    /** Engine torque applied to driven wheels at full throttle,
     *  in Newtons (force units — Rapier's
     *  `setWheelEngineForce`). Compact car ~1500; truck ~3500;
     *  motorcycle ~1200. */
    enginePower: z.ZodNumber;
    /** Brake force applied to all wheels at full brake. Newtons.
     *  Compact car ~80; truck ~140; motorcycle ~60. */
    brakeForce: z.ZodNumber;
    /** Handbrake force — applied additively on top of `brakeForce`
     *  when the handbrake action is held. Typically 2-3× brake. */
    handbrakeForce: z.ZodDefault<z.ZodNumber>;
    /** Maximum steering angle (radians) the front wheels can
     *  turn. Compact car ~0.5 (≈ 29°); truck ~0.4; motorcycle
     *  ~0.6 (motorcycles steer sharper). */
    maxSteerAngle: z.ZodNumber;
    /** Steering response — how fast steering input ramps from
     *  0 to `maxSteerAngle` (1 / seconds). Higher = snappier.
     *  Compact car ~4; truck ~2.5; motorcycle ~6. */
    steerResponseRate: z.ZodNumber;
    /** Per-wheel description. v1 expects 2-4 wheels (2 for a
     *  motorcycle, 4 for cars). */
    wheels: z.ZodArray<z.ZodObject<{
        /** Chassis-local position of the wheel's hub (the suspension
         *  ray's start point). */
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>;
        /** Wheel radius in meters. Wheel-ground contact lies along
         *  `position + directionDown × suspensionLength + radius`. */
        radius: z.ZodNumber;
        /** Local-space direction the suspension ray-casts along.
         *  Default `{ x: 0, y: -1, z: 0 }` (down on a Y-up chassis). */
        directionDown: z.ZodDefault<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>>;
        /** Local-space wheel-axle axis. Default `{ x: -1, y: 0, z: 0 }`
         *  for wheels mounted on the left side of the chassis. */
        axleAxis: z.ZodDefault<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>>;
        /** Suspension rest length (the spring's natural length, in
         *  meters). The system reads this as Rapier's
         *  `wheelSuspensionRestLength`. */
        suspensionRestLength: z.ZodNumber;
        /** Maximum distance the wheel can travel up or down from
         *  the rest length before clamping. */
        suspensionMaxTravel: z.ZodNumber;
        /** When true, this wheel turns with steering input. Typically
         *  front wheels. */
        steerable: z.ZodDefault<z.ZodBoolean>;
        /** When true, engine torque applies to this wheel. Front-
         *  wheel-drive = front wheels driven; rear-wheel-drive =
         *  rear; all-wheel-drive = both. */
        driven: z.ZodDefault<z.ZodBoolean>;
        /** Per-wheel friction coefficient (sticktion / traction).
         *  Maps to Rapier's `wheelFrictionSlip`. Higher = more grip.
         *  Realistic values are in the 5-15 range; arcade games
         *  bump higher. */
        friction: z.ZodDefault<z.ZodNumber>;
        /** Side-friction multiplier (lateral grip — how much the
         *  wheel resists sliding sideways). Maps to Rapier's
         *  `wheelSideFrictionStiffness`. Higher = grippier corners,
         *  less drift. Realistic 1-2 range. */
        sideFriction: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        position: {
            x: number;
            y: number;
            z: number;
        };
        radius: number;
        friction: number;
        directionDown: {
            x: number;
            y: number;
            z: number;
        };
        axleAxis: {
            x: number;
            y: number;
            z: number;
        };
        suspensionRestLength: number;
        suspensionMaxTravel: number;
        steerable: boolean;
        driven: boolean;
        sideFriction: number;
    }, {
        position: {
            x: number;
            y: number;
            z: number;
        };
        radius: number;
        suspensionRestLength: number;
        suspensionMaxTravel: number;
        friction?: number | undefined;
        directionDown?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        axleAxis?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        steerable?: boolean | undefined;
        driven?: boolean | undefined;
        sideFriction?: number | undefined;
    }>, "many">;
    /** Suspension stiffness (Hooke's-law spring constant). Maps
     *  to Rapier's `wheelSuspensionStiffness`. Realistic 30-60;
     *  trucks ~50; sports cars ~40; motorcycles ~35. */
    suspensionStiffness: z.ZodNumber;
    /** Suspension damping when compressing (the spring is being
     *  squeezed downward). Maps to
     *  `wheelSuspensionCompression`. Realistic 0.5-3. */
    suspensionDampingCompression: z.ZodNumber;
    /** Suspension damping when extending (the spring is rebounding
     *  back to rest). Maps to `wheelSuspensionRelaxation`. Higher
     *  = less bounce. Realistic 1-5. */
    suspensionDampingRebound: z.ZodNumber;
    /** Maximum suspension force (Newtons). Caps how hard the
     *  suspension can push back. Realistic 5000-20000 — tune up
     *  for heavy vehicles. */
    suspensionMaxForce: z.ZodDefault<z.ZodNumber>;
    /** Action ids the system reads from the input mapper. Defaults
     *  use the conventional prefix; apps override to namespace
     *  per-vehicle when wiring multi-player gamepads. */
    actions: z.ZodDefault<z.ZodObject<{
        accelerate: z.ZodDefault<z.ZodString>;
        brake: z.ZodDefault<z.ZodString>;
        steerLeft: z.ZodDefault<z.ZodString>;
        steerRight: z.ZodDefault<z.ZodString>;
        steerAxis: z.ZodDefault<z.ZodString>;
        handbrake: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        accelerate: string;
        brake: string;
        steerLeft: string;
        steerRight: string;
        steerAxis: string;
        handbrake: string;
    }, {
        accelerate?: string | undefined;
        brake?: string | undefined;
        steerLeft?: string | undefined;
        steerRight?: string | undefined;
        steerAxis?: string | undefined;
        handbrake?: string | undefined;
    }>>;
    /** Arcade-feel auto-uprighting torque applied to the chassis
     *  while ANY wheel is in ground contact. 0 = no assist
     *  (simulation feel); 5-15 = noticeable righting on bumpy
     *  terrain; 30+ = strong arcade arcade. Apps that DON'T want
     *  a Pacific-Drive-style "the player can't get stuck flipped
     *  on a rock" affordance leave at default 0. */
    autoLevelStiffness: z.ZodDefault<z.ZodNumber>;
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
    lockRollPitch: z.ZodDefault<z.ZodBoolean>;
    /** System-maintained: the current per-frame steering angle in
     *  radians. Lerps toward the target derived from input ×
     *  `steerResponseRate`. Apps don't write this; the system
     *  ticks it. */
    currentSteer: z.ZodDefault<z.ZodNumber>;
    /** System-maintained: current throttle in [-1, 1] for HUD
     *  + observability. Positive = accelerate, negative =
     *  reverse. */
    currentThrottle: z.ZodDefault<z.ZodNumber>;
    /** System-maintained: current brake in [0, 1]. */
    currentBrake: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    actions: {
        accelerate: string;
        brake: string;
        steerLeft: string;
        steerRight: string;
        steerAxis: string;
        handbrake: string;
    };
    enginePower: number;
    brakeForce: number;
    handbrakeForce: number;
    maxSteerAngle: number;
    steerResponseRate: number;
    wheels: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        radius: number;
        friction: number;
        directionDown: {
            x: number;
            y: number;
            z: number;
        };
        axleAxis: {
            x: number;
            y: number;
            z: number;
        };
        suspensionRestLength: number;
        suspensionMaxTravel: number;
        steerable: boolean;
        driven: boolean;
        sideFriction: number;
    }[];
    suspensionStiffness: number;
    suspensionDampingCompression: number;
    suspensionDampingRebound: number;
    suspensionMaxForce: number;
    autoLevelStiffness: number;
    lockRollPitch: boolean;
    currentSteer: number;
    currentThrottle: number;
    currentBrake: number;
}, {
    enginePower: number;
    brakeForce: number;
    maxSteerAngle: number;
    steerResponseRate: number;
    wheels: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        radius: number;
        suspensionRestLength: number;
        suspensionMaxTravel: number;
        friction?: number | undefined;
        directionDown?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        axleAxis?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        steerable?: boolean | undefined;
        driven?: boolean | undefined;
        sideFriction?: number | undefined;
    }[];
    suspensionStiffness: number;
    suspensionDampingCompression: number;
    suspensionDampingRebound: number;
    actions?: {
        accelerate?: string | undefined;
        brake?: string | undefined;
        steerLeft?: string | undefined;
        steerRight?: string | undefined;
        steerAxis?: string | undefined;
        handbrake?: string | undefined;
    } | undefined;
    handbrakeForce?: number | undefined;
    suspensionMaxForce?: number | undefined;
    autoLevelStiffness?: number | undefined;
    lockRollPitch?: boolean | undefined;
    currentSteer?: number | undefined;
    currentThrottle?: number | undefined;
    currentBrake?: number | undefined;
}>;
export type Vehicle = z.infer<typeof VehicleSchema>;
//# sourceMappingURL=vehicle.d.ts.map