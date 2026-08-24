import { z } from 'zod';
/** A single transaction operation. Six variants, one per
 *  existing inventory primitive. */
export declare const TransactionOpSchema: z.ZodDiscriminatedUnion<"op", [z.ZodObject<{
    op: z.ZodLiteral<"add">;
    defId: z.ZodString;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "add";
    defId: string;
    count: number;
}, {
    op: "add";
    defId: string;
    count: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"remove">;
    defId: z.ZodString;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "remove";
    defId: string;
    count: number;
}, {
    op: "remove";
    defId: string;
    count: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"move">;
    fromSlot: z.ZodNumber;
    toSlot: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "move";
    fromSlot: number;
    toSlot: number;
}, {
    op: "move";
    fromSlot: number;
    toSlot: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"splitStack">;
    fromSlot: z.ZodNumber;
    toSlot: z.ZodNumber;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "splitStack";
    count: number;
    fromSlot: number;
    toSlot: number;
}, {
    op: "splitStack";
    count: number;
    fromSlot: number;
    toSlot: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"equip">;
    fromSlot: z.ZodNumber;
    equipSlot: z.ZodString;
}, "strip", z.ZodTypeAny, {
    op: "equip";
    fromSlot: number;
    equipSlot: string;
}, {
    op: "equip";
    fromSlot: number;
    equipSlot: string;
}>, z.ZodObject<{
    op: z.ZodLiteral<"unequip">;
    equipSlot: z.ZodString;
    toSlot: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "unequip";
    toSlot: number;
    equipSlot: string;
}, {
    op: "unequip";
    toSlot: number;
    equipSlot: string;
}>]>;
export type TransactionOp = z.infer<typeof TransactionOpSchema>;
/** Ordered list of ops that compose into a single transaction.
 *  Empty list is allowed (returns the input inventory
 *  unchanged). */
export declare const TransactionOpsSchema: z.ZodArray<z.ZodDiscriminatedUnion<"op", [z.ZodObject<{
    op: z.ZodLiteral<"add">;
    defId: z.ZodString;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "add";
    defId: string;
    count: number;
}, {
    op: "add";
    defId: string;
    count: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"remove">;
    defId: z.ZodString;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "remove";
    defId: string;
    count: number;
}, {
    op: "remove";
    defId: string;
    count: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"move">;
    fromSlot: z.ZodNumber;
    toSlot: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "move";
    fromSlot: number;
    toSlot: number;
}, {
    op: "move";
    fromSlot: number;
    toSlot: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"splitStack">;
    fromSlot: z.ZodNumber;
    toSlot: z.ZodNumber;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "splitStack";
    count: number;
    fromSlot: number;
    toSlot: number;
}, {
    op: "splitStack";
    count: number;
    fromSlot: number;
    toSlot: number;
}>, z.ZodObject<{
    op: z.ZodLiteral<"equip">;
    fromSlot: z.ZodNumber;
    equipSlot: z.ZodString;
}, "strip", z.ZodTypeAny, {
    op: "equip";
    fromSlot: number;
    equipSlot: string;
}, {
    op: "equip";
    fromSlot: number;
    equipSlot: string;
}>, z.ZodObject<{
    op: z.ZodLiteral<"unequip">;
    equipSlot: z.ZodString;
    toSlot: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    op: "unequip";
    toSlot: number;
    equipSlot: string;
}, {
    op: "unequip";
    toSlot: number;
    equipSlot: string;
}>]>, "many">;
export type TransactionOps = z.infer<typeof TransactionOpsSchema>;
//# sourceMappingURL=inventoryTransaction.d.ts.map