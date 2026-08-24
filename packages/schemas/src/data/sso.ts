// SSO connection — the org → email-domain → Supabase SAML provider mapping that
// makes "Sign in with SSO" resolve to the right identity provider (SaaS #6 Phase
// 3, enterprise-tier). The app owns THIS mapping + the sign-in flow + the tier
// gate; Supabase owns the SAML federation itself (the operator registers the IdP
// via Supabase's SSO admin, which yields the `providerId` stored here). One row
// per org.
//
// Schema names PascalCaseSchema; inferred types drop the suffix.

import { z } from 'zod';

export const SsoConnectionSchema = z.object({
  orgId: z.string().min(1),
  /** The org's email domain (lowercased, no `@`) — e.g. `acme.com`. A user
   *  signing in with `alice@acme.com` resolves to this org's provider. */
  domain: z.string().min(1),
  /** The Supabase SSO provider id (a uuid) the operator created when they
   *  registered the org's SAML IdP. Opaque to the app. */
  providerId: z.string().min(1),
  /** When false the connection is stored but sign-in won't resolve to it (lets an
   *  admin stage a connection, or disable it without deleting the mapping). */
  enabled: z.boolean(),
});
export type SsoConnection = z.infer<typeof SsoConnectionSchema>;

/** The admin-set input to `setConnection` (server owns nothing else on this row). */
export const NewSsoConnectionSchema = z.object({
  domain: z.string().min(1),
  providerId: z.string().min(1),
  enabled: z.boolean(),
});
export type NewSsoConnection = z.infer<typeof NewSsoConnectionSchema>;
