import { z } from 'zod';
export declare const CreditWalletSchema: z.ZodObject<{
    orgId: z.ZodString;
    /** Current balance in credits (never negative — the debit RPC is atomic). */
    balance: z.ZodNumber;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    balance: number;
    updatedAt: string;
}, {
    orgId: string;
    balance: number;
    updatedAt: string;
}>;
export type CreditWallet = z.infer<typeof CreditWalletSchema>;
export declare const CreditLedgerKindSchema: z.ZodEnum<["purchase", "debit", "adjustment"]>;
export type CreditLedgerKind = z.infer<typeof CreditLedgerKindSchema>;
export declare const CreditLedgerEntrySchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    kind: z.ZodEnum<["purchase", "debit", "adjustment"]>;
    /** Signed credit delta: + for a purchase / adjustment-up, − for a debit. */
    credits: z.ZodNumber;
    /** The generation pipeline a debit paid for (`asset` / `audio` / `loc` /
     *  `art` / `code` / `market`). Absent on purchases. */
    pipeline: z.ZodOptional<z.ZodString>;
    /** The metered RAW vendor cost in USD for a debit — surfaced for transparency
     *  (the marked-up credit charge is `credits`). */
    vendorCostUsd: z.ZodOptional<z.ZodNumber>;
    /** The member who triggered a debit; the system for a purchase. */
    userId: z.ZodOptional<z.ZodString>;
    /** Free-form detail — the model/op for a debit, the Stripe payment id for a
     *  purchase. */
    detail: z.ZodDefault<z.ZodString>;
    /** Dedup key — the generation run id (debit) or Stripe event id (purchase),
     *  so a retry never double-charges / double-credits. */
    idempotencyKey: z.ZodString;
    occurredAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    id: string;
    kind: "purchase" | "debit" | "adjustment";
    credits: number;
    detail: string;
    idempotencyKey: string;
    occurredAt: string;
    pipeline?: string | undefined;
    vendorCostUsd?: number | undefined;
    userId?: string | undefined;
}, {
    orgId: string;
    id: string;
    kind: "purchase" | "debit" | "adjustment";
    credits: number;
    idempotencyKey: string;
    occurredAt: string;
    pipeline?: string | undefined;
    vendorCostUsd?: number | undefined;
    userId?: string | undefined;
    detail?: string | undefined;
}>;
export type CreditLedgerEntry = z.infer<typeof CreditLedgerEntrySchema>;
/** The input to a debit (the metering proxy performs it after a vendor call). */
export declare const NewCreditDebitSchema: z.ZodObject<{
    credits: z.ZodNumber;
    pipeline: z.ZodOptional<z.ZodString>;
    vendorCostUsd: z.ZodOptional<z.ZodNumber>;
    userId: z.ZodOptional<z.ZodString>;
    detail: z.ZodDefault<z.ZodString>;
    idempotencyKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    credits: number;
    detail: string;
    idempotencyKey: string;
    pipeline?: string | undefined;
    vendorCostUsd?: number | undefined;
    userId?: string | undefined;
}, {
    credits: number;
    idempotencyKey: string;
    pipeline?: string | undefined;
    vendorCostUsd?: number | undefined;
    userId?: string | undefined;
    detail?: string | undefined;
}>;
export type NewCreditDebit = z.infer<typeof NewCreditDebitSchema>;
/** The input to a purchase / adjustment (the Stripe webhook, or the operator). */
export declare const NewCreditPurchaseSchema: z.ZodObject<{
    credits: z.ZodNumber;
    detail: z.ZodDefault<z.ZodString>;
    idempotencyKey: z.ZodString;
    /** `purchase` (Stripe) by default; `adjustment` for a manual grant/refund. */
    kind: z.ZodDefault<z.ZodEnum<["purchase", "adjustment"]>>;
}, "strip", z.ZodTypeAny, {
    kind: "purchase" | "adjustment";
    credits: number;
    detail: string;
    idempotencyKey: string;
}, {
    credits: number;
    idempotencyKey: string;
    kind?: "purchase" | "adjustment" | undefined;
    detail?: string | undefined;
}>;
export type NewCreditPurchase = z.infer<typeof NewCreditPurchaseSchema>;
export declare const CreditPricingSchema: z.ZodObject<{
    /** USD value of one credit (e.g. 0.01 ⇒ a credit is a cent). */
    creditUnitUsd: z.ZodNumber;
    /** Margin multiplier over raw vendor cost (e.g. 1.3 ⇒ 30% markup). */
    markup: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    creditUnitUsd: number;
    markup: number;
}, {
    creditUnitUsd: number;
    markup: number;
}>;
export type CreditPricing = z.infer<typeof CreditPricingSchema>;
export declare const CreditQuoteSchema: z.ZodObject<{
    vendorCostUsd: z.ZodNumber;
    markedUpUsd: z.ZodNumber;
    credits: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    credits: number;
    vendorCostUsd: number;
    markedUpUsd: number;
}, {
    credits: number;
    vendorCostUsd: number;
    markedUpUsd: number;
}>;
export type CreditQuote = z.infer<typeof CreditQuoteSchema>;
export declare const CreditAutoReloadSchema: z.ZodObject<{
    orgId: z.ZodString;
    /** Master switch. Off ⇒ the proxy never triggers a reload. */
    enabled: z.ZodBoolean;
    /** Low-water mark in USD — a reload fires as the balance drops below it. */
    thresholdUsd: z.ZodNumber;
    /** USD to charge per reload (converted to credits at grant time). */
    amountUsd: z.ZodNumber;
    /** True once a card is saved (via the setup checkout). A reload can't fire
     *  without one — the client shows a "save a card" prompt while false. */
    cardOnFile: z.ZodBoolean;
    /** ISO of the last successful reload grant. */
    lastReloadAt: z.ZodOptional<z.ZodString>;
    /** ISO of the last failed off-session charge (decline / SCA). */
    lastFailureAt: z.ZodOptional<z.ZodString>;
    /** The Stripe decline reason for the last failure — surfaced in the banner. */
    lastFailureReason: z.ZodOptional<z.ZodString>;
    /** ISO until which no further reload is attempted (debounce after a failure
     *  or a just-completed reload). The proxy skips firing while this is future. */
    cooldownUntil: z.ZodOptional<z.ZodString>;
    /** Consecutive failed reloads since the last success (absent ⇒ 0). At the
     *  server threshold auto-reload is DISABLED (a dead card stops retrying every
     *  cooldown forever); a success or an owner edit resets it. */
    failureCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    enabled: boolean;
    thresholdUsd: number;
    amountUsd: number;
    cardOnFile: boolean;
    lastReloadAt?: string | undefined;
    lastFailureAt?: string | undefined;
    lastFailureReason?: string | undefined;
    cooldownUntil?: string | undefined;
    failureCount?: number | undefined;
}, {
    orgId: string;
    enabled: boolean;
    thresholdUsd: number;
    amountUsd: number;
    cardOnFile: boolean;
    lastReloadAt?: string | undefined;
    lastFailureAt?: string | undefined;
    lastFailureReason?: string | undefined;
    cooldownUntil?: string | undefined;
    failureCount?: number | undefined;
}>;
export type CreditAutoReload = z.infer<typeof CreditAutoReloadSchema>;
/** The owner-set input to `setAutoReload` (the server owns the rest of the
 *  state — card, last-attempt, cooldown). */
export declare const NewAutoReloadConfigSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    thresholdUsd: z.ZodNumber;
    amountUsd: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    thresholdUsd: number;
    amountUsd: number;
}, {
    enabled: boolean;
    thresholdUsd: number;
    amountUsd: number;
}>;
export type NewAutoReloadConfig = z.infer<typeof NewAutoReloadConfigSchema>;
//# sourceMappingURL=credits.d.ts.map