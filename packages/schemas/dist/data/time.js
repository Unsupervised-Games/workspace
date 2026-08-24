// Time + scheduling data shapes.
//
// `@unsupervised/features/time` consumes these to model an in-game clock,
// six-phase day/night thresholds, NPC schedule descriptors, and
// the at/daily/every scheduler primitives. All shapes are JSON-
// serializable so save/load round-trips through the existing save
// bundle without special handling.
//
// Units: time is in GAME seconds (a per-day cycle is some
// configurable count of game seconds, default 1200 for a 20-minute
// real-time day). Phase thresholds are normalized 0..1 fractions
// of a day. Hours / minutes appear in human-facing entry windows
// (`fromHour`, `fromMinute`) — converted to fractions internally
// when the schedule resolver runs.
import { z } from 'zod';
// ---------------------------------------------------------------------------
// Day/night phases — six conventional buckets, configurable thresholds.
//
// Order matters: it's the cycle order through a single day. The
// thresholds object below maps each phase NAME to the time-of-day
// at which entering that phase BEGINS. So `dawn = 0.208` (≈05:00
// of a 24h day) means "from 05:00 until the next phase's start,
// the world is in dawn." The night phase wraps midnight.
// ---------------------------------------------------------------------------
export const DayNightPhaseSchema = z.enum([
    'dawn',
    'morning',
    'noon',
    'afternoon',
    'dusk',
    'night',
]);
/** Map of phase name → `0..1` time-of-day at which the phase
 *  STARTS. Phase ordering is fixed by the enum; only the start
 *  fractions are configurable. Apps build "long days" or
 *  "perpetual night" by tweaking these. */
export const PhaseThresholdsSchema = z.object({
    dawn: z.number().min(0).max(1),
    morning: z.number().min(0).max(1),
    noon: z.number().min(0).max(1),
    afternoon: z.number().min(0).max(1),
    dusk: z.number().min(0).max(1),
    night: z.number().min(0).max(1),
});
/** Stardew-ish defaults: dawn 05:00, morning 07:00, noon 11:00,
 *  afternoon 14:00, dusk 18:00, night 21:00. Apps override at
 *  clock-builder time. */
export const DEFAULT_PHASE_THRESHOLDS = {
    dawn: 5 / 24,
    morning: 7 / 24,
    noon: 11 / 24,
    afternoon: 14 / 24,
    dusk: 18 / 24,
    night: 21 / 24,
};
// ---------------------------------------------------------------------------
// NPC schedules — entries describe time-of-day windows + optional
// location/activity tags. The slot only stores the schedule's id
// + the active entry's index; the full def lives in a registry.
// ---------------------------------------------------------------------------
/** Day-of-week filter for a schedule entry. `'every'` = every day;
 *  `'weekday'` / `'weekend'` use the standard Mon-Fri / Sat-Sun
 *  split; an explicit array narrows to specific days
 *  (`0` = Monday … `6` = Sunday). */
export const ScheduleDayPatternSchema = z.union([
    z.enum(['every', 'weekday', 'weekend']),
    z.array(z.number().int().min(0).max(6)),
]);
/** A single time-of-day window in an NPC's schedule. Entries are
 *  half-open `[from, to)`; if `toHour < fromHour` the entry wraps
 *  midnight. Apps tag entries with a `locationId` (waypoint /
 *  region the NPC should be at) and / or `activityId` (gameplay
 *  state, e.g. `'sleeping'` / `'shopping'`) — both are opaque
 *  strings consumed by app-side wiring. */
export const ScheduleEntrySchema = z.object({
    id: z.string().min(1),
    fromHour: z.number().int().min(0).max(23),
    fromMinute: z.number().int().min(0).max(59),
    toHour: z.number().int().min(0).max(23),
    toMinute: z.number().int().min(0).max(59),
    locationId: z.string().optional(),
    activityId: z.string().optional(),
    dayPattern: ScheduleDayPatternSchema.default('every'),
});
/** A named schedule registered globally and referenced by id from
 *  entity `schedule` slots. Entries don't need to cover every
 *  hour — gaps are valid (the NPC has no active entry during
 *  them, app-side BT decides the idle behavior). */
export const ScheduleDefSchema = z.object({
    id: z.string().min(1),
    entries: z.array(ScheduleEntrySchema),
});
// ---------------------------------------------------------------------------
// Scheduler handles — `at`, `daily`, `every`. Saved to a slot on
// the singleton clock entity so save/load round-trips fire-state
// (in particular, one-shot `at` handles must not re-fire after
// reload).
// ---------------------------------------------------------------------------
export const ScheduledHandleKindSchema = z.enum(['at', 'daily', 'every']);
export const ScheduledHandleSchema = z.object({
    /** Stable id supplied by the registering call site. Used for
     *  upsert (re-registering an existing id is a no-op so apps can
     *  call `scheduleDaily(...)` unconditionally at boot without
     *  re-introducing already-fired one-shots). */
    id: z.string().min(1),
    kind: ScheduledHandleKindSchema,
    /** Id of the callback registered via
     *  `registerScheduleCallback(...)`. Saves never round-trip
     *  the function itself — apps re-bind on boot. */
    callbackId: z.string().min(1),
    /** Absolute game-time seconds at which this handle next fires.
     *  For `at` this is the one fixed boundary; for `daily` /
     *  `every` it advances each tick after a fire. */
    nextFireAt: z.number(),
    /** For `every`: the recurrence interval in game seconds. For
     *  `daily`: typically `secondsPerDay` (advanced one full day
     *  per fire). Unused for `at`. */
    intervalSeconds: z.number().optional(),
    /** True only for `at` handles after they've fired once.
     *  Persists across save/load so reload doesn't re-fire. */
    fired: z.boolean(),
});
//# sourceMappingURL=time.js.map