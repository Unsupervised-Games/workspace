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
export declare const ItemInstanceSchema: z.ZodObject<{
    /** Look up against the registered item definition by id. Must
     *  match the id of a definition registered via `registerItem`
     *  before any operation reads this instance. */
    defId: z.ZodString;
    /** Stack size. Always >= 1; empty slots use `null`, not
     *  `{ count: 0 }`. Operations that would drive a stack to 0
     *  delete the slot's contents instead. */
    count: z.ZodNumber;
    /** Optional per-instance state (durability, enchantments,
     *  custom-roll stats, …). The inventory layer treats this as
     *  opaque — it's preserved across moves / splits / merges, but
     *  never inspected. JSON-shaped so save / load works. */
    customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    defId: string;
    count: number;
    customData?: Record<string, unknown> | undefined;
}, {
    defId: string;
    count: number;
    customData?: Record<string, unknown> | undefined;
}>;
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
export declare const BaseItemDefinitionSchema: z.ZodObject<{
    /** Stable registry key. Persisted in save data and referenced
     *  by every `ItemInstance` with this defId. Must be unique
     *  across the registered item set. Hyphenated kebab-case
     *  conventional ('health-potion', not 'HealthPotion'). */
    id: z.ZodString;
    /** Human-readable display name. UI / tooltips read this. */
    displayName: z.ZodString;
    /** Optional flavor / mechanical description for tooltips. */
    description: z.ZodOptional<z.ZodString>;
    /** Asset-registry key for the icon (sprite or UI image). The
     *  inventory layer doesn't resolve this — passed through to the
     *  consumer's UI. */
    iconAssetId: z.ZodOptional<z.ZodString>;
    /** Maximum stack size. `1` means non-stackable (each pickup
     *  takes a whole slot). Default `1` because most distinct
     *  game items are unique by default; consumables / resources
     *  override to a higher value. */
    maxStack: z.ZodDefault<z.ZodNumber>;
    /** Weight per stack count, in app-defined units. Optional
     *  because not every game has a carry-weight system. */
    weight: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    displayName: string;
    maxStack: number;
    description?: string | undefined;
    iconAssetId?: string | undefined;
    weight?: number | undefined;
}, {
    id: string;
    displayName: string;
    description?: string | undefined;
    iconAssetId?: string | undefined;
    maxStack?: number | undefined;
    weight?: number | undefined;
}>;
export type BaseItemDefinition = z.infer<typeof BaseItemDefinitionSchema>;
//# sourceMappingURL=item.d.ts.map