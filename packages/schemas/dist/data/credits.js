// Prepaid CREDITS — the org's wallet for vendor generation (Meshy / ElevenLabs
// / Suno / Anthropic / CivitAI). The vendor (platform owner) holds the API keys;
// members buy credits and generation debits them through the metering proxy.
// This is the demand-side complement of the org SPEND governance
// (`data/orgSpend.ts`): spend MEASURES cost against a ceiling; credits DEBIT a
// prepaid balance. Org-scoped, like every other collaboration resource.
//
// Credits are INTEGER units — one credit is worth a fixed `creditUnitUsd` (the
// operator sets it, e.g. $0.01), so the balance + ledger never carry float
// drift. A debit rounds UP so rounding never costs the vendor money.
//
// Schema names PascalCaseSchema; inferred types drop the suffix. Consumer
// packages import the TYPES and never redeclare them.
import { z } from 'zod';
// ────────────────────────────────────────────────────────────────
// CreditWallet — the org's current prepaid balance (integer credits).
// ────────────────────────────────────────────────────────────────
export const CreditWalletSchema = z.object({
    orgId: z.string().min(1),
    /** Current balance in credits (never negative — the debit RPC is atomic). */
    balance: z.number().int().nonnegative(),
    updatedAt: z.string(),
});
// ────────────────────────────────────────────────────────────────
// CreditLedgerEntry — one immutable line. A `purchase` (+, a Stripe
// top-up), a `debit` (−, a metered vendor call), or an `adjustment`
// (± , a manual credit/refund by the operator). `credits` is the
// SIGNED delta so the ledger sums to the balance.
// ────────────────────────────────────────────────────────────────
export const CreditLedgerKindSchema = z.enum(['purchase', 'debit', 'adjustment']);
export const CreditLedgerEntrySchema = z.object({
    id: z.string(),
    orgId: z.string().min(1),
    kind: CreditLedgerKindSchema,
    /** Signed credit delta: + for a purchase / adjustment-up, − for a debit. */
    credits: z.number().int(),
    /** The generation pipeline a debit paid for (`asset` / `audio` / `loc` /
     *  `art` / `code` / `market`). Absent on purchases. */
    pipeline: z.string().optional(),
    /** The metered RAW vendor cost in USD for a debit — surfaced for transparency
     *  (the marked-up credit charge is `credits`). */
    vendorCostUsd: z.number().nonnegative().optional(),
    /** The member who triggered a debit; the system for a purchase. */
    userId: z.string().optional(),
    /** Free-form detail — the model/op for a debit, the Stripe payment id for a
     *  purchase. */
    detail: z.string().default(''),
    /** Dedup key — the generation run id (debit) or Stripe event id (purchase),
     *  so a retry never double-charges / double-credits. */
    idempotencyKey: z.string().min(1),
    occurredAt: z.string(),
});
/** The input to a debit (the metering proxy performs it after a vendor call). */
export const NewCreditDebitSchema = z.object({
    credits: z.number().int().positive(),
    pipeline: z.string().optional(),
    vendorCostUsd: z.number().nonnegative().optional(),
    userId: z.string().optional(),
    detail: z.string().default(''),
    idempotencyKey: z.string().min(1),
});
/** The input to a purchase / adjustment (the Stripe webhook, or the operator). */
export const NewCreditPurchaseSchema = z.object({
    credits: z.number().int().positive(),
    detail: z.string().default(''),
    idempotencyKey: z.string().min(1),
    /** `purchase` (Stripe) by default; `adjustment` for a manual grant/refund. */
    kind: z.enum(['purchase', 'adjustment']).default('purchase'),
});
// ────────────────────────────────────────────────────────────────
// CreditPricing — how a metered vendor cost becomes a credit debit.
// `creditUnitUsd` is what one credit is worth; `markup` is the margin
// multiplier over the raw vendor cost. Both are the operator's knobs.
// ────────────────────────────────────────────────────────────────
export const CreditPricingSchema = z.object({
    /** USD value of one credit (e.g. 0.01 ⇒ a credit is a cent). */
    creditUnitUsd: z.number().positive(),
    /** Margin multiplier over raw vendor cost (e.g. 1.3 ⇒ 30% markup). */
    markup: z.number().positive(),
});
// ────────────────────────────────────────────────────────────────
// CreditQuote — the result of pricing a metered vendor cost.
// ────────────────────────────────────────────────────────────────
export const CreditQuoteSchema = z.object({
    vendorCostUsd: z.number().nonnegative(),
    markedUpUsd: z.number().nonnegative(),
    credits: z.number().int().nonnegative(),
});
// ────────────────────────────────────────────────────────────────
// CreditAutoReload — the org's auto-top-up policy. When the wallet
// balance crosses `thresholdUsd`, the metering proxy charges the
// owner's saved card off-session for `amountUsd` and grants credits,
// so generation never stalls on an empty wallet. Owner-configured
// (`org:billing`); the saved-card token (`pm_…`) lives ONLY server-
// side — the client sees `cardOnFile` and the last-attempt state.
// ────────────────────────────────────────────────────────────────
export const CreditAutoReloadSchema = z.object({
    orgId: z.string().min(1),
    /** Master switch. Off ⇒ the proxy never triggers a reload. */
    enabled: z.boolean(),
    /** Low-water mark in USD — a reload fires as the balance drops below it. */
    thresholdUsd: z.number().nonnegative(),
    /** USD to charge per reload (converted to credits at grant time). */
    amountUsd: z.number().nonnegative(),
    /** True once a card is saved (via the setup checkout). A reload can't fire
     *  without one — the client shows a "save a card" prompt while false. */
    cardOnFile: z.boolean(),
    /** ISO of the last successful reload grant. */
    lastReloadAt: z.string().optional(),
    /** ISO of the last failed off-session charge (decline / SCA). */
    lastFailureAt: z.string().optional(),
    /** The Stripe decline reason for the last failure — surfaced in the banner. */
    lastFailureReason: z.string().optional(),
    /** ISO until which no further reload is attempted (debounce after a failure
     *  or a just-completed reload). The proxy skips firing while this is future. */
    cooldownUntil: z.string().optional(),
    /** Consecutive failed reloads since the last success (absent ⇒ 0). At the
     *  server threshold auto-reload is DISABLED (a dead card stops retrying every
     *  cooldown forever); a success or an owner edit resets it. */
    failureCount: z.number().int().nonnegative().optional(),
});
/** The owner-set input to `setAutoReload` (the server owns the rest of the
 *  state — card, last-attempt, cooldown). */
export const NewAutoReloadConfigSchema = z.object({
    enabled: z.boolean(),
    thresholdUsd: z.number().nonnegative(),
    amountUsd: z.number().positive(),
});
//# sourceMappingURL=credits.js.map