// Item shapes used by `@unsupervised/features/inventory`.
//
// Two distinct concerns live here, deliberately split into two
// schemas so they can layer cleanly:
//
//   1. ItemInstance — the per-stack runtime state that lives on
//      an entity's inventory slot. Tiny, JSON-shaped, references
//      a definition by string id. This is what save / load
//      round-trips through localStorage.
//
//   2. BaseItemDefinition — the static authoring metadata for an
//      item type (display name, max stack, icon, weight). Lives
//      in a global registry, registered at game-boot time. Apps
//      EXTEND this base with their own game-specific fields
//      (damage, defense, mana cost, equip slot, etc.); the
//      inventory layer treats those extra fields as opaque.
//
// Why the split:
// Definitions are static and shared across hundreds of stacks; an
// instance only needs to remember "I'm a stack of 5 health potions"
// (defId='health-potion', count=5), not a copy of every health-
// potion field. This mirrors `@unsupervised/ai-bt`'s tree registry: trees
// are registered once globally, entities reference them by id,
// per-entity state stays small and serialisable.

import { z } from 'zod';

/**
 * Per-stack item state. Stored on the entity's inventory slot
 * array; absent slots are `null`.
 *
 * `count` is constrained to be positive (>= 1) — a count of 0
 * MUST be represented as `null` in the slot array, never as an
 * instance with `count: 0`. This invariant simplifies the
 * operations layer (no "is this slot really empty?" checks).
 *
 * `customData` is free-form for game code: per-instance
 * sharpness, durability, enchantment ids, etc. The inventory
 * layer never reads or modifies it — it travels with the instance
 * through stack splits / merges / equipment moves verbatim.
 */
export const ItemInstanceSchema = z.object({
  /** Look up against the registered item definition by id. Must
   *  match the id of a definition registered via `registerItem`
   *  before any operation reads this instance. */
  defId: z.string().min(1),
  /** Stack size. Always >= 1; empty slots use `null`, not
   *  `{ count: 0 }`. Operations that would drive a stack to 0
   *  delete the slot's contents instead. */
  count: z.number().int().positive(),
  /** Optional per-instance state (durability, enchantments,
   *  custom-roll stats, …). The inventory layer treats this as
   *  opaque — it's preserved across moves / splits / merges, but
   *  never inspected. JSON-shaped so save / load works. */
  customData: z.record(z.string(), z.unknown()).optional(),
});
export type ItemInstance = z.infer<typeof ItemInstanceSchema>;

/**
 * The minimal item-definition contract every game must satisfy.
 * Apps EXTEND this with `BaseItemDefinitionSchema.extend({ ... })`
 * to add game-specific fields (damage, defense, equipSlot, etc.)
 * before passing the resulting schema to forge for validation.
 *
 * Universal fields that the inventory layer itself reads:
 *   - `id`         — registry key
 *   - `maxStack`   — stacking ceiling for `addItem` / merge ops
 *
 * Authoring-only fields that the inventory layer carries through
 * but doesn't otherwise consume (UI does):
 *   - `displayName`, `description`, `iconAssetId`, `weight`
 */
export const BaseItemDefinitionSchema = z.object({
  /** Stable registry key. Persisted in save data and referenced
   *  by every `ItemInstance` with this defId. Must be unique
   *  across the registered item set. Hyphenated kebab-case
   *  conventional ('health-potion', not 'HealthPotion'). */
  id: z.string().min(1),
  /** Human-readable display name. UI / tooltips read this. */
  displayName: z.string().min(1),
  /** Optional flavor / mechanical description for tooltips. */
  description: z.string().optional(),
  /** Asset-registry key for the icon (sprite or UI image). The
   *  inventory layer doesn't resolve this — passed through to the
   *  consumer's UI. */
  iconAssetId: z.string().optional(),
  /** Maximum stack size. `1` means non-stackable (each pickup
   *  takes a whole slot). Default `1` because most distinct
   *  game items are unique by default; consumables / resources
   *  override to a higher value. */
  maxStack: z.number().int().positive().default(1),
  /** Weight per stack count, in app-defined units. Optional
   *  because not every game has a carry-weight system. */
  weight: z.number().nonnegative().optional(),
});
export type BaseItemDefinition = z.infer<typeof BaseItemDefinitionSchema>;
