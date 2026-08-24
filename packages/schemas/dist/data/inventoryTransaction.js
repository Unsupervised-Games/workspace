// Inventory transaction op shapes.
//
// A transaction is an ordered list of these ops; the framework
// validates them in sequence against a clone of the target
// inventory, commits all-or-nothing. The shape is JSON-
// serializable — transactions round-trip through the structured
// log payload, the replay file's command stream, and any
// telemetry sink an app wires up.
//
// Each op shape mirrors a single existing inventory operation
// (`addItem`, `removeItem`, `moveItem`, `splitStack`,
// `equipItem`, `unequipItem`). The transaction layer composes
// them under the hood; the strict, all-or-nothing semantics are
// the new behavior the transaction adds — no per-op "partial
// success" the way bare `addItem` allows. Apps that want
// partial-success behavior continue to use the bare ops;
// transactions are for atomic, multi-step recipes.
//
// Schema validation runs at the transaction boundary (apps that
// build ops from JSON should `TransactionOpsSchema.parse(...)`
// first); apps that build ops in TypeScript get the same shape
// from the inferred types and skip the runtime parse cost.
import { z } from 'zod';
/** A single transaction operation. Six variants, one per
 *  existing inventory primitive. */
export const TransactionOpSchema = z.discriminatedUnion('op', [
    /** Add `count` units of `defId`. Mirrors `addItem`, but the
     *  transaction layer treats `remaining > 0` (couldn't fit
     *  everything) as an atomic `'no-space'` failure. */
    z.object({
        op: z.literal('add'),
        defId: z.string().min(1),
        count: z.number().int().positive(),
    }),
    /** Remove `count` units of `defId`. Mirrors `removeItem`, but
     *  the transaction layer treats `removed < count` as
     *  `'insufficient-quantity'`. */
    z.object({
        op: z.literal('remove'),
        defId: z.string().min(1),
        count: z.number().int().positive(),
    }),
    /** Move (or merge / swap) source-slot contents into target.
     *  Mirrors `moveItem`. Failure modes: out-of-range slot,
     *  empty source. */
    z.object({
        op: z.literal('move'),
        fromSlot: z.number().int().nonnegative(),
        toSlot: z.number().int().nonnegative(),
    }),
    /** Split `count` items off the stack at `fromSlot` into the
     *  empty slot at `toSlot`. Mirrors `splitStack`. */
    z.object({
        op: z.literal('splitStack'),
        fromSlot: z.number().int().nonnegative(),
        toSlot: z.number().int().nonnegative(),
        count: z.number().int().positive(),
    }),
    /** Move the item at `fromSlot` into the equip slot named
     *  `equipSlot`. Existing equipped item swaps back into the
     *  source slot (matches `equipItem` semantics). */
    z.object({
        op: z.literal('equip'),
        fromSlot: z.number().int().nonnegative(),
        equipSlot: z.string().min(1),
    }),
    /** Move the item from `equipSlot` back into main slot
     *  `toSlot`. Target slot must be empty (otherwise
     *  `'no-space'`). Mirrors `unequipItem`. */
    z.object({
        op: z.literal('unequip'),
        equipSlot: z.string().min(1),
        toSlot: z.number().int().nonnegative(),
    }),
]);
/** Ordered list of ops that compose into a single transaction.
 *  Empty list is allowed (returns the input inventory
 *  unchanged). */
export const TransactionOpsSchema = z.array(TransactionOpSchema);
//# sourceMappingURL=inventoryTransaction.js.map