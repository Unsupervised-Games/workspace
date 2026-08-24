import { z } from 'zod';
/** Primitive value a setting can store. The framework doesn't
 *  enforce per-item type membership at runtime — apps that
 *  want strict typing branch on `kind` and narrow at the read
 *  site via `getSetting<number>(world, 'audio.master')`. */
export declare const SettingValueSchema: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>;
export type SettingValue = z.infer<typeof SettingValueSchema>;
/** Discriminated item kind. Five built-ins; apps that need a
 *  control the framework doesn't ship use `'custom'` and
 *  register a renderer paired by `customKind`. */
export declare const SettingItemSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"slider">;
    id: z.ZodString;
    label: z.ZodString;
    /** Inclusive minimum. */
    min: z.ZodNumber;
    /** Inclusive maximum. Cross-field invariants like `max > min`
     *  are validated at register time, not at parse time —
     *  Zod refines complicate `.optional()` composition with
     *  the parent SettingItem schema. */
    max: z.ZodNumber;
    /** Step granularity. Must be > 0; UIs snap to this. */
    step: z.ZodNumber;
    defaultValue: z.ZodNumber;
    /** Optional helper text rendered under the control. */
    description: z.ZodOptional<z.ZodString>;
    /** Optional unit suffix ("%", "ms", "px"). Cosmetic. */
    unit: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "slider";
    max: number;
    min: number;
    step: number;
    label: string;
    defaultValue: number;
    description?: string | undefined;
    unit?: string | undefined;
}, {
    id: string;
    kind: "slider";
    max: number;
    min: number;
    step: number;
    label: string;
    defaultValue: number;
    description?: string | undefined;
    unit?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"toggle">;
    id: z.ZodString;
    label: z.ZodString;
    defaultValue: z.ZodBoolean;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "toggle";
    label: string;
    defaultValue: boolean;
    description?: string | undefined;
}, {
    id: string;
    kind: "toggle";
    label: string;
    defaultValue: boolean;
    description?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"select">;
    id: z.ZodString;
    label: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">;
    defaultValue: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    options: {
        value: string;
        label: string;
    }[];
    id: string;
    kind: "select";
    label: string;
    defaultValue: string;
    description?: string | undefined;
}, {
    options: {
        value: string;
        label: string;
    }[];
    id: string;
    kind: "select";
    label: string;
    defaultValue: string;
    description?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"keybind-link">;
    id: z.ZodString;
    label: z.ZodString;
    /** Action id this link drives; clicking it requests the
     *  rebind dialog open for this action. The framework
     *  doesn't store a value here — bindings live in the
     *  input-profile registry from `@unsupervised/features/input`. */
    actionId: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "keybind-link";
    label: string;
    actionId: string;
    description?: string | undefined;
}, {
    id: string;
    kind: "keybind-link";
    label: string;
    actionId: string;
    description?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"custom">;
    id: z.ZodString;
    label: z.ZodString;
    /** App-defined kind tag. Apps register a renderer at boot
     *  via `registerSettingCustomRenderer(customKind, fn)`.
     *  The schema is JSON-trivial; the renderer is code. */
    customKind: z.ZodString;
    /** Free-form metadata the renderer reads (slider variants,
     *  preview-image refs, presets). Pure data; the framework
     *  treats it as opaque. */
    payload: z.ZodOptional<z.ZodUnknown>;
    /** Optional default value the framework stores on first
     *  registration; the renderer is responsible for the
     *  actual control. */
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "custom";
    customKind: string;
    label: string;
    description?: string | undefined;
    payload?: unknown;
    defaultValue?: string | number | boolean | undefined;
}, {
    id: string;
    kind: "custom";
    customKind: string;
    label: string;
    description?: string | undefined;
    payload?: unknown;
    defaultValue?: string | number | boolean | undefined;
}>]>;
export type SettingItem = z.infer<typeof SettingItemSchema>;
export declare const SettingsSectionSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    /** Optional helper text rendered above the section. */
    description: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"slider">;
        id: z.ZodString;
        label: z.ZodString;
        /** Inclusive minimum. */
        min: z.ZodNumber;
        /** Inclusive maximum. Cross-field invariants like `max > min`
         *  are validated at register time, not at parse time —
         *  Zod refines complicate `.optional()` composition with
         *  the parent SettingItem schema. */
        max: z.ZodNumber;
        /** Step granularity. Must be > 0; UIs snap to this. */
        step: z.ZodNumber;
        defaultValue: z.ZodNumber;
        /** Optional helper text rendered under the control. */
        description: z.ZodOptional<z.ZodString>;
        /** Optional unit suffix ("%", "ms", "px"). Cosmetic. */
        unit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "slider";
        max: number;
        min: number;
        step: number;
        label: string;
        defaultValue: number;
        description?: string | undefined;
        unit?: string | undefined;
    }, {
        id: string;
        kind: "slider";
        max: number;
        min: number;
        step: number;
        label: string;
        defaultValue: number;
        description?: string | undefined;
        unit?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"toggle">;
        id: z.ZodString;
        label: z.ZodString;
        defaultValue: z.ZodBoolean;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "toggle";
        label: string;
        defaultValue: boolean;
        description?: string | undefined;
    }, {
        id: string;
        kind: "toggle";
        label: string;
        defaultValue: boolean;
        description?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"select">;
        id: z.ZodString;
        label: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">;
        defaultValue: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        options: {
            value: string;
            label: string;
        }[];
        id: string;
        kind: "select";
        label: string;
        defaultValue: string;
        description?: string | undefined;
    }, {
        options: {
            value: string;
            label: string;
        }[];
        id: string;
        kind: "select";
        label: string;
        defaultValue: string;
        description?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"keybind-link">;
        id: z.ZodString;
        label: z.ZodString;
        /** Action id this link drives; clicking it requests the
         *  rebind dialog open for this action. The framework
         *  doesn't store a value here — bindings live in the
         *  input-profile registry from `@unsupervised/features/input`. */
        actionId: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "keybind-link";
        label: string;
        actionId: string;
        description?: string | undefined;
    }, {
        id: string;
        kind: "keybind-link";
        label: string;
        actionId: string;
        description?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"custom">;
        id: z.ZodString;
        label: z.ZodString;
        /** App-defined kind tag. Apps register a renderer at boot
         *  via `registerSettingCustomRenderer(customKind, fn)`.
         *  The schema is JSON-trivial; the renderer is code. */
        customKind: z.ZodString;
        /** Free-form metadata the renderer reads (slider variants,
         *  preview-image refs, presets). Pure data; the framework
         *  treats it as opaque. */
        payload: z.ZodOptional<z.ZodUnknown>;
        /** Optional default value the framework stores on first
         *  registration; the renderer is responsible for the
         *  actual control. */
        defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "custom";
        customKind: string;
        label: string;
        description?: string | undefined;
        payload?: unknown;
        defaultValue?: string | number | boolean | undefined;
    }, {
        id: string;
        kind: "custom";
        customKind: string;
        label: string;
        description?: string | undefined;
        payload?: unknown;
        defaultValue?: string | number | boolean | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    items: ({
        id: string;
        kind: "slider";
        max: number;
        min: number;
        step: number;
        label: string;
        defaultValue: number;
        description?: string | undefined;
        unit?: string | undefined;
    } | {
        id: string;
        kind: "toggle";
        label: string;
        defaultValue: boolean;
        description?: string | undefined;
    } | {
        options: {
            value: string;
            label: string;
        }[];
        id: string;
        kind: "select";
        label: string;
        defaultValue: string;
        description?: string | undefined;
    } | {
        id: string;
        kind: "keybind-link";
        label: string;
        actionId: string;
        description?: string | undefined;
    } | {
        id: string;
        kind: "custom";
        customKind: string;
        label: string;
        description?: string | undefined;
        payload?: unknown;
        defaultValue?: string | number | boolean | undefined;
    })[];
    label: string;
    description?: string | undefined;
}, {
    id: string;
    items: ({
        id: string;
        kind: "slider";
        max: number;
        min: number;
        step: number;
        label: string;
        defaultValue: number;
        description?: string | undefined;
        unit?: string | undefined;
    } | {
        id: string;
        kind: "toggle";
        label: string;
        defaultValue: boolean;
        description?: string | undefined;
    } | {
        options: {
            value: string;
            label: string;
        }[];
        id: string;
        kind: "select";
        label: string;
        defaultValue: string;
        description?: string | undefined;
    } | {
        id: string;
        kind: "keybind-link";
        label: string;
        actionId: string;
        description?: string | undefined;
    } | {
        id: string;
        kind: "custom";
        customKind: string;
        label: string;
        description?: string | undefined;
        payload?: unknown;
        defaultValue?: string | number | boolean | undefined;
    })[];
    label: string;
    description?: string | undefined;
}>;
export type SettingsSection = z.infer<typeof SettingsSectionSchema>;
export declare const SettingsTreeSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        /** Optional helper text rendered above the section. */
        description: z.ZodOptional<z.ZodString>;
        items: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"slider">;
            id: z.ZodString;
            label: z.ZodString;
            /** Inclusive minimum. */
            min: z.ZodNumber;
            /** Inclusive maximum. Cross-field invariants like `max > min`
             *  are validated at register time, not at parse time —
             *  Zod refines complicate `.optional()` composition with
             *  the parent SettingItem schema. */
            max: z.ZodNumber;
            /** Step granularity. Must be > 0; UIs snap to this. */
            step: z.ZodNumber;
            defaultValue: z.ZodNumber;
            /** Optional helper text rendered under the control. */
            description: z.ZodOptional<z.ZodString>;
            /** Optional unit suffix ("%", "ms", "px"). Cosmetic. */
            unit: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kind: "slider";
            max: number;
            min: number;
            step: number;
            label: string;
            defaultValue: number;
            description?: string | undefined;
            unit?: string | undefined;
        }, {
            id: string;
            kind: "slider";
            max: number;
            min: number;
            step: number;
            label: string;
            defaultValue: number;
            description?: string | undefined;
            unit?: string | undefined;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"toggle">;
            id: z.ZodString;
            label: z.ZodString;
            defaultValue: z.ZodBoolean;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kind: "toggle";
            label: string;
            defaultValue: boolean;
            description?: string | undefined;
        }, {
            id: string;
            kind: "toggle";
            label: string;
            defaultValue: boolean;
            description?: string | undefined;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"select">;
            id: z.ZodString;
            label: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>, "many">;
            defaultValue: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            options: {
                value: string;
                label: string;
            }[];
            id: string;
            kind: "select";
            label: string;
            defaultValue: string;
            description?: string | undefined;
        }, {
            options: {
                value: string;
                label: string;
            }[];
            id: string;
            kind: "select";
            label: string;
            defaultValue: string;
            description?: string | undefined;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"keybind-link">;
            id: z.ZodString;
            label: z.ZodString;
            /** Action id this link drives; clicking it requests the
             *  rebind dialog open for this action. The framework
             *  doesn't store a value here — bindings live in the
             *  input-profile registry from `@unsupervised/features/input`. */
            actionId: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kind: "keybind-link";
            label: string;
            actionId: string;
            description?: string | undefined;
        }, {
            id: string;
            kind: "keybind-link";
            label: string;
            actionId: string;
            description?: string | undefined;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"custom">;
            id: z.ZodString;
            label: z.ZodString;
            /** App-defined kind tag. Apps register a renderer at boot
             *  via `registerSettingCustomRenderer(customKind, fn)`.
             *  The schema is JSON-trivial; the renderer is code. */
            customKind: z.ZodString;
            /** Free-form metadata the renderer reads (slider variants,
             *  preview-image refs, presets). Pure data; the framework
             *  treats it as opaque. */
            payload: z.ZodOptional<z.ZodUnknown>;
            /** Optional default value the framework stores on first
             *  registration; the renderer is responsible for the
             *  actual control. */
            defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kind: "custom";
            customKind: string;
            label: string;
            description?: string | undefined;
            payload?: unknown;
            defaultValue?: string | number | boolean | undefined;
        }, {
            id: string;
            kind: "custom";
            customKind: string;
            label: string;
            description?: string | undefined;
            payload?: unknown;
            defaultValue?: string | number | boolean | undefined;
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        items: ({
            id: string;
            kind: "slider";
            max: number;
            min: number;
            step: number;
            label: string;
            defaultValue: number;
            description?: string | undefined;
            unit?: string | undefined;
        } | {
            id: string;
            kind: "toggle";
            label: string;
            defaultValue: boolean;
            description?: string | undefined;
        } | {
            options: {
                value: string;
                label: string;
            }[];
            id: string;
            kind: "select";
            label: string;
            defaultValue: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "keybind-link";
            label: string;
            actionId: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "custom";
            customKind: string;
            label: string;
            description?: string | undefined;
            payload?: unknown;
            defaultValue?: string | number | boolean | undefined;
        })[];
        label: string;
        description?: string | undefined;
    }, {
        id: string;
        items: ({
            id: string;
            kind: "slider";
            max: number;
            min: number;
            step: number;
            label: string;
            defaultValue: number;
            description?: string | undefined;
            unit?: string | undefined;
        } | {
            id: string;
            kind: "toggle";
            label: string;
            defaultValue: boolean;
            description?: string | undefined;
        } | {
            options: {
                value: string;
                label: string;
            }[];
            id: string;
            kind: "select";
            label: string;
            defaultValue: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "keybind-link";
            label: string;
            actionId: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "custom";
            customKind: string;
            label: string;
            description?: string | undefined;
            payload?: unknown;
            defaultValue?: string | number | boolean | undefined;
        })[];
        label: string;
        description?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    label: string;
    sections: {
        id: string;
        items: ({
            id: string;
            kind: "slider";
            max: number;
            min: number;
            step: number;
            label: string;
            defaultValue: number;
            description?: string | undefined;
            unit?: string | undefined;
        } | {
            id: string;
            kind: "toggle";
            label: string;
            defaultValue: boolean;
            description?: string | undefined;
        } | {
            options: {
                value: string;
                label: string;
            }[];
            id: string;
            kind: "select";
            label: string;
            defaultValue: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "keybind-link";
            label: string;
            actionId: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "custom";
            customKind: string;
            label: string;
            description?: string | undefined;
            payload?: unknown;
            defaultValue?: string | number | boolean | undefined;
        })[];
        label: string;
        description?: string | undefined;
    }[];
    description?: string | undefined;
}, {
    id: string;
    label: string;
    sections: {
        id: string;
        items: ({
            id: string;
            kind: "slider";
            max: number;
            min: number;
            step: number;
            label: string;
            defaultValue: number;
            description?: string | undefined;
            unit?: string | undefined;
        } | {
            id: string;
            kind: "toggle";
            label: string;
            defaultValue: boolean;
            description?: string | undefined;
        } | {
            options: {
                value: string;
                label: string;
            }[];
            id: string;
            kind: "select";
            label: string;
            defaultValue: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "keybind-link";
            label: string;
            actionId: string;
            description?: string | undefined;
        } | {
            id: string;
            kind: "custom";
            customKind: string;
            label: string;
            description?: string | undefined;
            payload?: unknown;
            defaultValue?: string | number | boolean | undefined;
        })[];
        label: string;
        description?: string | undefined;
    }[];
    description?: string | undefined;
}>;
export type SettingsTree = z.infer<typeof SettingsTreeSchema>;
/** Per-world value store. Keys are fully-qualified
 *  `'<treeId>.<settingId>'`; values are JSON-trivial. */
export declare const SettingsValuesSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
export type SettingsValues = z.infer<typeof SettingsValuesSchema>;
/** Persisted bundle — what `saveSettings` writes. */
export declare const SettingsBundleSchema: z.ZodObject<{
    /** Schema version for forward-only migrations. v1 ships at 1. */
    version: z.ZodNumber;
    values: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
}, "strip", z.ZodTypeAny, {
    values: Record<string, string | number | boolean>;
    version: number;
}, {
    values: Record<string, string | number | boolean>;
    version: number;
}>;
export type SettingsBundle = z.infer<typeof SettingsBundleSchema>;
/** Reasons a `setSetting` / `setPendingSetting` / `resetSetting`
 *  call can be rejected. */
export declare const SettingsApplyRejectionSchema: z.ZodEnum<["unknown-tree", "unknown-setting", "invalid-value-type", "out-of-range", "unknown-option"]>;
export type SettingsApplyRejection = z.infer<typeof SettingsApplyRejectionSchema>;
/** Discriminated result for the value-mutation API. Mirrors
 *  the shape used by `BindingChangeResult` /
 *  `AchievementUnlockResult` / `TurnActionResult`. */
export declare const SettingsApplyResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** True when the call mutated state. False on the
     *  idempotent no-op path (value was already equal). */
    changed: z.ZodBoolean;
    /** The previous value, or null when no value was set
     *  (first-set path). */
    oldValue: z.ZodNullable<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    changed: boolean;
    oldValue: string | number | boolean | null;
}, {
    ok: true;
    changed: boolean;
    oldValue: string | number | boolean | null;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["unknown-tree", "unknown-setting", "invalid-value-type", "out-of-range", "unknown-option"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "out-of-range" | "unknown-tree" | "unknown-setting" | "invalid-value-type" | "unknown-option";
}, {
    message: string;
    ok: false;
    reason: "out-of-range" | "unknown-tree" | "unknown-setting" | "invalid-value-type" | "unknown-option";
}>]>;
export type SettingsApplyResult = z.infer<typeof SettingsApplyResultSchema>;
//# sourceMappingURL=settings.d.ts.map