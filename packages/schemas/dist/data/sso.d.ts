import { z } from 'zod';
export declare const SsoConnectionSchema: z.ZodObject<{
    orgId: z.ZodString;
    /** The org's email domain (lowercased, no `@`) — e.g. `acme.com`. A user
     *  signing in with `alice@acme.com` resolves to this org's provider. */
    domain: z.ZodString;
    /** The Supabase SSO provider id (a uuid) the operator created when they
     *  registered the org's SAML IdP. Opaque to the app. */
    providerId: z.ZodString;
    /** When false the connection is stored but sign-in won't resolve to it (lets an
     *  admin stage a connection, or disable it without deleting the mapping). */
    enabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    domain: string;
    providerId: string;
    enabled: boolean;
}, {
    orgId: string;
    domain: string;
    providerId: string;
    enabled: boolean;
}>;
export type SsoConnection = z.infer<typeof SsoConnectionSchema>;
/** The admin-set input to `setConnection` (server owns nothing else on this row). */
export declare const NewSsoConnectionSchema: z.ZodObject<{
    domain: z.ZodString;
    providerId: z.ZodString;
    enabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    domain: string;
    providerId: string;
    enabled: boolean;
}, {
    domain: string;
    providerId: string;
    enabled: boolean;
}>;
export type NewSsoConnection = z.infer<typeof NewSsoConnectionSchema>;
//# sourceMappingURL=sso.d.ts.map