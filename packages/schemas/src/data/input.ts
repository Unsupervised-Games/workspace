// Input rebinding shapes — action bindings, profiles, and the
// result type returned by the rebind operations.
//
// The `@unsupervised/input` package consumes the structural types
// (ActionBindings is what InputManager.setBindings(...) accepts);
// `@unsupervised/features/input` consumes the bundle + result shapes for
// per-world profile management and persistence; `@unsupervised/ui/keybinds`
// consumes BindingId / labels for the rebind dialog.

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
export const BindingIdSchema = z.string().min(1);
export type BindingId = z.infer<typeof BindingIdSchema>;

/** Action id → ordered list of bindings. Multiple bindings
 *  per action are OR-ed (any can trigger). Empty array = the
 *  action is unbound. Matches the shape `InputManager.setBindings`
 *  accepts, with one tweak: `ActionBindings` here is mutable
 *  for the rebind operations; the input package's `Readonly<...>`
 *  variant is structurally compatible. */
export const ActionBindingsSchema = z.record(
  z.string().min(1),
  z.array(BindingIdSchema),
);
export type ActionBindings = z.infer<typeof ActionBindingsSchema>;

/** A named controls profile (Default / Southpaw / accessibility
 *  preset / user-saved). */
export const InputProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  bindings: ActionBindingsSchema,
  /** Wall-clock or app-defined timestamp at profile creation. */
  createdAt: z.number().nonnegative(),
  /** True for the profile currently driving
   *  `InputManager.setBindings(...)`. Exactly one profile in a
   *  bundle should have `isActive: true`; the registry enforces
   *  on switch. */
  isActive: z.boolean(),
  /** True for built-in profiles (factory defaults, accessibility
   *  presets). UIs disable "Delete" / "Rename" on builtins to
   *  keep the player's escape-hatch always available. */
  builtIn: z.boolean().default(false),
});
export type InputProfile = z.infer<typeof InputProfileSchema>;

/** Versioned envelope of all profiles + which one is active.
 *  Persisted as a single JSON blob via `StorageAdapter.saveToSlot`. */
export const InputProfileBundleSchema = z.object({
  /** Schema version for forward-only migrations. v1 ships at 1. */
  version: z.number().int().nonnegative(),
  activeProfileId: z.string().min(1),
  profiles: z.array(InputProfileSchema),
});
export type InputProfileBundle = z.infer<typeof InputProfileBundleSchema>;

/** Reasons a binding-change call can be rejected. */
export const BindingChangeRejectionSchema = z.enum([
  'unknown-action',
  'invalid-binding',
  'profile-locked',
  'no-such-profile',
  'conflict-rejected',
]);
export type BindingChangeRejection = z.infer<
  typeof BindingChangeRejectionSchema
>;

/** Discriminated result for `applyBindingChange` / `setActionBinding`.
 *  Mirrors the shape used by `TurnActionResult` /
 *  `DialogueChoiceResult` / `AchievementUnlockResult`. */
export const BindingChangeResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** The action that previously held this binding (auto-
     *  cleared in `'displace'` mode). Null if no conflict was
     *  found. */
    displacedAction: z.string().nullable(),
    /** True when this call mutated state. False on the
     *  idempotent no-op path (binding was already in this
     *  slot). */
    changed: z.boolean(),
  }),
  z.object({
    ok: z.literal(false),
    reason: BindingChangeRejectionSchema,
    message: z.string(),
  }),
]);
export type BindingChangeResult = z.infer<typeof BindingChangeResultSchema>;
