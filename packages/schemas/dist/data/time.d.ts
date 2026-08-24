import { z } from 'zod';
export declare const DayNightPhaseSchema: z.ZodEnum<["dawn", "morning", "noon", "afternoon", "dusk", "night"]>;
export type DayNightPhase = z.infer<typeof DayNightPhaseSchema>;
/** Map of phase name → `0..1` time-of-day at which the phase
 *  STARTS. Phase ordering is fixed by the enum; only the start
 *  fractions are configurable. Apps build "long days" or
 *  "perpetual night" by tweaking these. */
export declare const PhaseThresholdsSchema: z.ZodObject<{
    dawn: z.ZodNumber;
    morning: z.ZodNumber;
    noon: z.ZodNumber;
    afternoon: z.ZodNumber;
    dusk: z.ZodNumber;
    night: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    dawn: number;
    morning: number;
    noon: number;
    afternoon: number;
    dusk: number;
    night: number;
}, {
    dawn: number;
    morning: number;
    noon: number;
    afternoon: number;
    dusk: number;
    night: number;
}>;
export type PhaseThresholds = z.infer<typeof PhaseThresholdsSchema>;
/** Stardew-ish defaults: dawn 05:00, morning 07:00, noon 11:00,
 *  afternoon 14:00, dusk 18:00, night 21:00. Apps override at
 *  clock-builder time. */
export declare const DEFAULT_PHASE_THRESHOLDS: PhaseThresholds;
/** Day-of-week filter for a schedule entry. `'every'` = every day;
 *  `'weekday'` / `'weekend'` use the standard Mon-Fri / Sat-Sun
 *  split; an explicit array narrows to specific days
 *  (`0` = Monday … `6` = Sunday). */
export declare const ScheduleDayPatternSchema: z.ZodUnion<[z.ZodEnum<["every", "weekday", "weekend"]>, z.ZodArray<z.ZodNumber, "many">]>;
export type ScheduleDayPattern = z.infer<typeof ScheduleDayPatternSchema>;
/** A single time-of-day window in an NPC's schedule. Entries are
 *  half-open `[from, to)`; if `toHour < fromHour` the entry wraps
 *  midnight. Apps tag entries with a `locationId` (waypoint /
 *  region the NPC should be at) and / or `activityId` (gameplay
 *  state, e.g. `'sleeping'` / `'shopping'`) — both are opaque
 *  strings consumed by app-side wiring. */
export declare const ScheduleEntrySchema: z.ZodObject<{
    id: z.ZodString;
    fromHour: z.ZodNumber;
    fromMinute: z.ZodNumber;
    toHour: z.ZodNumber;
    toMinute: z.ZodNumber;
    locationId: z.ZodOptional<z.ZodString>;
    activityId: z.ZodOptional<z.ZodString>;
    dayPattern: z.ZodDefault<z.ZodUnion<[z.ZodEnum<["every", "weekday", "weekend"]>, z.ZodArray<z.ZodNumber, "many">]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    fromHour: number;
    fromMinute: number;
    toHour: number;
    toMinute: number;
    dayPattern: "every" | "weekday" | "weekend" | number[];
    locationId?: string | undefined;
    activityId?: string | undefined;
}, {
    id: string;
    fromHour: number;
    fromMinute: number;
    toHour: number;
    toMinute: number;
    locationId?: string | undefined;
    activityId?: string | undefined;
    dayPattern?: "every" | "weekday" | "weekend" | number[] | undefined;
}>;
export type ScheduleEntry = z.infer<typeof ScheduleEntrySchema>;
/** A named schedule registered globally and referenced by id from
 *  entity `schedule` slots. Entries don't need to cover every
 *  hour — gaps are valid (the NPC has no active entry during
 *  them, app-side BT decides the idle behavior). */
export declare const ScheduleDefSchema: z.ZodObject<{
    id: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        fromHour: z.ZodNumber;
        fromMinute: z.ZodNumber;
        toHour: z.ZodNumber;
        toMinute: z.ZodNumber;
        locationId: z.ZodOptional<z.ZodString>;
        activityId: z.ZodOptional<z.ZodString>;
        dayPattern: z.ZodDefault<z.ZodUnion<[z.ZodEnum<["every", "weekday", "weekend"]>, z.ZodArray<z.ZodNumber, "many">]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        fromHour: number;
        fromMinute: number;
        toHour: number;
        toMinute: number;
        dayPattern: "every" | "weekday" | "weekend" | number[];
        locationId?: string | undefined;
        activityId?: string | undefined;
    }, {
        id: string;
        fromHour: number;
        fromMinute: number;
        toHour: number;
        toMinute: number;
        locationId?: string | undefined;
        activityId?: string | undefined;
        dayPattern?: "every" | "weekday" | "weekend" | number[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    entries: {
        id: string;
        fromHour: number;
        fromMinute: number;
        toHour: number;
        toMinute: number;
        dayPattern: "every" | "weekday" | "weekend" | number[];
        locationId?: string | undefined;
        activityId?: string | undefined;
    }[];
    id: string;
}, {
    entries: {
        id: string;
        fromHour: number;
        fromMinute: number;
        toHour: number;
        toMinute: number;
        locationId?: string | undefined;
        activityId?: string | undefined;
        dayPattern?: "every" | "weekday" | "weekend" | number[] | undefined;
    }[];
    id: string;
}>;
export type ScheduleDef = z.infer<typeof ScheduleDefSchema>;
export declare const ScheduledHandleKindSchema: z.ZodEnum<["at", "daily", "every"]>;
export type ScheduledHandleKind = z.infer<typeof ScheduledHandleKindSchema>;
export declare const ScheduledHandleSchema: z.ZodObject<{
    /** Stable id supplied by the registering call site. Used for
     *  upsert (re-registering an existing id is a no-op so apps can
     *  call `scheduleDaily(...)` unconditionally at boot without
     *  re-introducing already-fired one-shots). */
    id: z.ZodString;
    kind: z.ZodEnum<["at", "daily", "every"]>;
    /** Id of the callback registered via
     *  `registerScheduleCallback(...)`. Saves never round-trip
     *  the function itself — apps re-bind on boot. */
    callbackId: z.ZodString;
    /** Absolute game-time seconds at which this handle next fires.
     *  For `at` this is the one fixed boundary; for `daily` /
     *  `every` it advances each tick after a fire. */
    nextFireAt: z.ZodNumber;
    /** For `every`: the recurrence interval in game seconds. For
     *  `daily`: typically `secondsPerDay` (advanced one full day
     *  per fire). Unused for `at`. */
    intervalSeconds: z.ZodOptional<z.ZodNumber>;
    /** True only for `at` handles after they've fired once.
     *  Persists across save/load so reload doesn't re-fire. */
    fired: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "every" | "at" | "daily";
    callbackId: string;
    nextFireAt: number;
    fired: boolean;
    intervalSeconds?: number | undefined;
}, {
    id: string;
    kind: "every" | "at" | "daily";
    callbackId: string;
    nextFireAt: number;
    fired: boolean;
    intervalSeconds?: number | undefined;
}>;
export type ScheduledHandle = z.infer<typeof ScheduledHandleSchema>;
//# sourceMappingURL=time.d.ts.map