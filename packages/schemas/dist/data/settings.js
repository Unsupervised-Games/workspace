// Settings UI shapes — declarative tree, value store, persisted
// bundle, apply-result envelope.
//
// `@unsupervised/features/settings` consumes these for the per-world
// value store + paired-by-id handler registry; `@unsupervised/ui`'s
// settings components consume them for rendering. Apps register
// `SettingsTree` instances at boot (one per area: audio /
// graphics / gameplay / controls — or a single combined tree)
// and drive `<SettingsPanel>` from them.
import { z } from 'zod';
/** Primitive value a setting can store. The framework doesn't
 *  enforce per-item type membership at runtime — apps that
 *  want strict typing branch on `kind` and narrow at the read
 *  site via `getSetting<number>(world, 'audio.master')`. */
export const SettingValueSchema = z.union([
    z.number(),
    z.string(),
    z.boolean(),
]);
/** Discriminated item kind. Five built-ins; apps that need a
 *  control the framework doesn't ship use `'custom'` and
 *  register a renderer paired by `customKind`. */
export const SettingItemSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('slider'),
        id: z.string().min(1),
        label: z.string(),
        /** Inclusive minimum. */
        min: z.number(),
        /** Inclusive maximum. Cross-field invariants like `max > min`
         *  are validated at register time, not at parse time —
         *  Zod refines complicate `.optional()` composition with
         *  the parent SettingItem schema. */
        max: z.number(),
        /** Step granularity. Must be > 0; UIs snap to this. */
        step: z.number().positive(),
        defaultValue: z.number(),
        /** Optional helper text rendered under the control. */
        description: z.string().optional(),
        /** Optional unit suffix ("%", "ms", "px"). Cosmetic. */
        unit: z.string().optional(),
    }),
    z.object({
        kind: z.literal('toggle'),
        id: z.string().min(1),
        label: z.string(),
        defaultValue: z.boolean(),
        description: z.string().optional(),
    }),
    z.object({
        kind: z.literal('select'),
        id: z.string().min(1),
        label: z.string(),
        options: z
            .array(z.object({
            value: z.string().min(1),
            label: z.string(),
        }))
            .min(1),
        defaultValue: z.string().min(1),
        description: z.string().optional(),
    }),
    z.object({
        kind: z.literal('keybind-link'),
        id: z.string().min(1),
        label: z.string(),
        /** Action id this link drives; clicking it requests the
         *  rebind dialog open for this action. The framework
         *  doesn't store a value here — bindings live in the
         *  input-profile registry from `@unsupervised/features/input`. */
        actionId: z.string().min(1),
        description: z.string().optional(),
    }),
    z.object({
        kind: z.literal('custom'),
        id: z.string().min(1),
        label: z.string(),
        /** App-defined kind tag. Apps register a renderer at boot
         *  via `registerSettingCustomRenderer(customKind, fn)`.
         *  The schema is JSON-trivial; the renderer is code. */
        customKind: z.string().min(1),
        /** Free-form metadata the renderer reads (slider variants,
         *  preview-image refs, presets). Pure data; the framework
         *  treats it as opaque. */
        payload: z.unknown().optional(),
        /** Optional default value the framework stores on first
         *  registration; the renderer is responsible for the
         *  actual control. */
        defaultValue: SettingValueSchema.optional(),
        description: z.string().optional(),
    }),
]);
export const SettingsSectionSchema = z.object({
    id: z.string().min(1),
    label: z.string(),
    /** Optional helper text rendered above the section. */
    description: z.string().optional(),
    items: z.array(SettingItemSchema).min(1),
});
export const SettingsTreeSchema = z.object({
    id: z.string().min(1),
    label: z.string(),
    description: z.string().optional(),
    sections: z.array(SettingsSectionSchema).min(1),
});
/** Per-world value store. Keys are fully-qualified
 *  `'<treeId>.<settingId>'`; values are JSON-trivial. */
export const SettingsValuesSchema = z.record(z.string().min(1), SettingValueSchema);
/** Persisted bundle — what `saveSettings` writes. */
export const SettingsBundleSchema = z.object({
    /** Schema version for forward-only migrations. v1 ships at 1. */
    version: z.number().int().nonnegative(),
    values: SettingsValuesSchema,
});
/** Reasons a `setSetting` / `setPendingSetting` / `resetSetting`
 *  call can be rejected. */
export const SettingsApplyRejectionSchema = z.enum([
    'unknown-tree',
    'unknown-setting',
    'invalid-value-type',
    'out-of-range',
    'unknown-option',
]);
/** Discriminated result for the value-mutation API. Mirrors
 *  the shape used by `BindingChangeResult` /
 *  `AchievementUnlockResult` / `TurnActionResult`. */
export const SettingsApplyResultSchema = z.discriminatedUnion('ok', [
    z.object({
        ok: z.literal(true),
        /** True when the call mutated state. False on the
         *  idempotent no-op path (value was already equal). */
        changed: z.boolean(),
        /** The previous value, or null when no value was set
         *  (first-set path). */
        oldValue: SettingValueSchema.nullable(),
    }),
    z.object({
        ok: z.literal(false),
        reason: SettingsApplyRejectionSchema,
        message: z.string(),
    }),
]);
//# sourceMappingURL=settings.js.map