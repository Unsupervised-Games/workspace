import { z } from 'zod';
/** The activation-funnel event set (Phase 1). A typed enum + a free-form `props`
 *  bag: extensible (a new feature event is one entry) but schema-checked. There's
 *  no separate `signup` — it's derived in the funnel as a user's first-ever
 *  event, so first-timers and returning users both emit `signin`. */
export declare const ProductEventNameSchema: z.ZodEnum<["signin", "org.created", "member.invited", "generation.run", "plan.upgraded"]>;
export type ProductEventName = z.infer<typeof ProductEventNameSchema>;
/** Free-form event properties (e.g. `{ method: 'oauth' }`, `{ vendor: 'meshy' }`,
 *  `{ plan: 'team' }`). Primitive values only. */
export declare const ProductEventPropsSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
export type ProductEventProps = z.infer<typeof ProductEventPropsSchema>;
/** One product-analytics event. `orgId` is null for the pre-org `signin` (a user
 *  who has signed in but not yet joined/created an org). */
export declare const ProductEventSchema: z.ZodObject<{
    userId: z.ZodString;
    orgId: z.ZodNullable<z.ZodString>;
    event: z.ZodEnum<["signin", "org.created", "member.invited", "generation.run", "plan.upgraded"]>;
    /** Client- or server-observed ISO timestamp. */
    at: z.ZodString;
    props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
}, "strip", z.ZodTypeAny, {
    at: string;
    orgId: string | null;
    userId: string;
    event: "signin" | "org.created" | "member.invited" | "generation.run" | "plan.upgraded";
    props?: Record<string, string | number | boolean> | undefined;
}, {
    at: string;
    orgId: string | null;
    userId: string;
    event: "signin" | "org.created" | "member.invited" | "generation.run" | "plan.upgraded";
    props?: Record<string, string | number | boolean> | undefined;
}>;
export type ProductEvent = z.infer<typeof ProductEventSchema>;
//# sourceMappingURL=productAnalytics.d.ts.map