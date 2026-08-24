import { z } from 'zod';

// First-party PRODUCT-analytics event shapes (SaaS direction #3) — the vendor's
// own activation-funnel / usage telemetry across customer orgs. Distinct from
// `MarketTestEvent` (a game's A/B store funnel): these are org-tenant events the
// Workbench + the server (gen-proxy / stripe-webhook) emit, read cross-tenant by
// the platform admin in the console. Data only — the store seam + the funnel math
// live in `@unsupervised/workbench-cloud`.

/** The activation-funnel event set (Phase 1). A typed enum + a free-form `props`
 *  bag: extensible (a new feature event is one entry) but schema-checked. There's
 *  no separate `signup` — it's derived in the funnel as a user's first-ever
 *  event, so first-timers and returning users both emit `signin`. */
export const ProductEventNameSchema = z.enum([
  'signin',
  'org.created',
  'member.invited',
  'generation.run',
  'plan.upgraded',
]);
export type ProductEventName = z.infer<typeof ProductEventNameSchema>;

/** Free-form event properties (e.g. `{ method: 'oauth' }`, `{ vendor: 'meshy' }`,
 *  `{ plan: 'team' }`). Primitive values only. */
export const ProductEventPropsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);
export type ProductEventProps = z.infer<typeof ProductEventPropsSchema>;

/** One product-analytics event. `orgId` is null for the pre-org `signin` (a user
 *  who has signed in but not yet joined/created an org). */
export const ProductEventSchema = z.object({
  userId: z.string().min(1),
  orgId: z.string().nullable(),
  event: ProductEventNameSchema,
  /** Client- or server-observed ISO timestamp. */
  at: z.string(),
  props: ProductEventPropsSchema.optional(),
});
export type ProductEvent = z.infer<typeof ProductEventSchema>;
