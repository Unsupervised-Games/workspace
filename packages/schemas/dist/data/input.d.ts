import { z } from 'zod';
/** Physical button id. The input package treats this as an
 *  opaque string — device variety (gamepad vendor strings,
 *  touch slots) is open-ended. The schema rejects empty
 *  strings; apps that want to enforce membership in a fixed
 *  set narrow further in their own code. Examples:
 *    - keyboard: `'KeyA'`, `'Space'`, `'ArrowUp'`
 *    - mouse:    `'Mouse_0'` (left), `'Mouse_2'` (right)
 *    - gamepad:  `'Gamepad_0'`–`'Gamepad_15'`,
 *                `'Gamepad_Axis_Left_X'`, etc.
 *    - touch:    `'Touch_0'`–`'Touch_7'`
 */
export declare const BindingIdSchema: z.ZodString;
export type BindingId = z.infer<typeof BindingIdSchema>;
/** Action id → ordered list of bindings. Multiple bindings
 *  per action are OR-ed (any can trigger). Empty array = the
 *  action is unbound. Matches the shape `InputManager.setBindings`
 *  accepts, with one tweak: `ActionBindings` here is mutable
 *  for the rebind operations; the input package's `Readonly<...>`
 *  variant is structurally compatible. */
export declare const ActionBindingsSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
export type ActionBindings = z.infer<typeof ActionBindingsSchema>;
/** A named controls profile (Default / Southpaw / accessibility
 *  preset / user-saved). */
export declare const InputProfileSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    bindings: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
    /** Wall-clock or app-defined timestamp at profile creation. */
    createdAt: z.ZodNumber;
    /** True for the profile currently driving
     *  `InputManager.setBindings(...)`. Exactly one profile in a
     *  bundle should have `isActive: true`; the registry enforces
     *  on switch. */
    isActive: z.ZodBoolean;
    /** True for built-in profiles (factory defaults, accessibility
     *  presets). UIs disable "Delete" / "Rename" on builtins to
     *  keep the player's escape-hatch always available. */
    builtIn: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    bindings: Record<string, string[]>;
    createdAt: number;
    isActive: boolean;
    builtIn: boolean;
}, {
    id: string;
    name: string;
    bindings: Record<string, string[]>;
    createdAt: number;
    isActive: boolean;
    builtIn?: boolean | undefined;
}>;
export type InputProfile = z.infer<typeof InputProfileSchema>;
/** Versioned envelope of all profiles + which one is active.
 *  Persisted as a single JSON blob via `StorageAdapter.saveToSlot`. */
export declare const InputProfileBundleSchema: z.ZodObject<{
    /** Schema version for forward-only migrations. v1 ships at 1. */
    version: z.ZodNumber;
    activeProfileId: z.ZodString;
    profiles: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        bindings: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
        /** Wall-clock or app-defined timestamp at profile creation. */
        createdAt: z.ZodNumber;
        /** True for the profile currently driving
         *  `InputManager.setBindings(...)`. Exactly one profile in a
         *  bundle should have `isActive: true`; the registry enforces
         *  on switch. */
        isActive: z.ZodBoolean;
        /** True for built-in profiles (factory defaults, accessibility
         *  presets). UIs disable "Delete" / "Rename" on builtins to
         *  keep the player's escape-hatch always available. */
        builtIn: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        bindings: Record<string, string[]>;
        createdAt: number;
        isActive: boolean;
        builtIn: boolean;
    }, {
        id: string;
        name: string;
        bindings: Record<string, string[]>;
        createdAt: number;
        isActive: boolean;
        builtIn?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: number;
    activeProfileId: string;
    profiles: {
        id: string;
        name: string;
        bindings: Record<string, string[]>;
        createdAt: number;
        isActive: boolean;
        builtIn: boolean;
    }[];
}, {
    version: number;
    activeProfileId: string;
    profiles: {
        id: string;
        name: string;
        bindings: Record<string, string[]>;
        createdAt: number;
        isActive: boolean;
        builtIn?: boolean | undefined;
    }[];
}>;
export type InputProfileBundle = z.infer<typeof InputProfileBundleSchema>;
/** Reasons a binding-change call can be rejected. */
export declare const BindingChangeRejectionSchema: z.ZodEnum<["unknown-action", "invalid-binding", "profile-locked", "no-such-profile", "conflict-rejected"]>;
export type BindingChangeRejection = z.infer<typeof BindingChangeRejectionSchema>;
/** Discriminated result for `applyBindingChange` / `setActionBinding`.
 *  Mirrors the shape used by `TurnActionResult` /
 *  `DialogueChoiceResult` / `AchievementUnlockResult`. */
export declare const BindingChangeResultSchema: z.ZodDiscriminatedUnion<"ok", [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    /** The action that previously held this binding (auto-
     *  cleared in `'displace'` mode). Null if no conflict was
     *  found. */
    displacedAction: z.ZodNullable<z.ZodString>;
    /** True when this call mutated state. False on the
     *  idempotent no-op path (binding was already in this
     *  slot). */
    changed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    ok: true;
    displacedAction: string | null;
    changed: boolean;
}, {
    ok: true;
    displacedAction: string | null;
    changed: boolean;
}>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<["unknown-action", "invalid-binding", "profile-locked", "no-such-profile", "conflict-rejected"]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    ok: false;
    reason: "unknown-action" | "invalid-binding" | "profile-locked" | "no-such-profile" | "conflict-rejected";
}, {
    message: string;
    ok: false;
    reason: "unknown-action" | "invalid-binding" | "profile-locked" | "no-such-profile" | "conflict-rejected";
}>]>;
export type BindingChangeResult = z.infer<typeof BindingChangeResultSchema>;
//# sourceMappingURL=input.d.ts.map