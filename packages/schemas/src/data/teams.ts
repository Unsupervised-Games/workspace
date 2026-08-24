import { z } from 'zod';
import { PlanSchema } from './billing.js';

// Team / organization shapes for the Workbench's hosted-SaaS backend.
//
// Atelier is a PURE HOSTED SaaS: one vendor-run backend, many customer orgs as
// RLS-isolated tenants. Signing into an ORGANIZATION is the product; its backing
// store (Supabase) holds only COLLABORATION METADATA — code + assets stay in git.
// (The engine itself needs no login — that's apps/dex + games + packages.) These
// are the shapes that cross the client↔backend boundary.
//
// Multi-tenancy is org-scoped: a user belongs to N organizations via a
// membership row; every collaboration row carries an `orgId` and is isolated
// by row-level security. Collaboration is further scoped to a PROJECT (a
// linked game/repo) via `WorkspaceLink`.
//
// @unsupervised/workbench-cloud declares NO zod of its own — it parses via these
// schema values (single zod copy). The capability/role LOGIC (which role can
// do what) lives in that package, not here (schemas is data, not logic).

/** Membership roles, most- to least-privileged. Owner is unique per org. */
export const RoleSchema = z.enum(['owner', 'admin', 'member', 'viewer']);
export type Role = z.infer<typeof RoleSchema>;

/** An organization — the tenant. The signer-up is the initial owner. */
export const OrganizationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** auth user id of the owner. */
  ownerId: z.string().min(1),
  /** The org's plan tier — mirrors `org_subscriptions.plan` (kept in sync by the
   *  Stripe webhook). Read app-wide for feature gating (`planCan`). */
  plan: PlanSchema.default('free'),
  /** The GitHub organization the org's repos are created under (null ⇒ the
   *  owner's personal GitHub account). Set at workspace setup. */
  githubOrg: z.string().nullable().optional(),
  /** The org's shared WORKSPACE repo URL — engine packages + house skills +
   *  config (games are their own repos). Set when the first member creates the
   *  workspace + pushes it; teammates clone it to get the shared set. Null/absent
   *  until then. */
  workspaceRepoUrl: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type Organization = z.infer<typeof OrganizationSchema>;

/** A user profile — the joinable mirror of the auth user (Supabase's
 *  `auth.users` isn't directly selectable across tenants). */
export const ProfileSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

/** A user's membership in one org, with their role. The join row that makes
 *  a user a tenant of an org. */
export const MembershipSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
  role: RoleSchema,
  createdAt: z.string(),
});
export type Membership = z.infer<typeof MembershipSchema>;

/** A membership joined to the member's profile (for the members list). */
export const MemberSchema = MembershipSchema.extend({ profile: ProfileSchema });
export type Member = z.infer<typeof MemberSchema>;

export const InvitationStatusSchema = z.enum(['pending', 'accepted', 'revoked', 'expired']);
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

/** An email invitation to join an org at a given role. Redeemed via its
 *  token once the invitee signs in with the matching email. */
export const InvitationSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  email: z.string().email(),
  role: RoleSchema,
  /** Opaque redemption token (random; carried in the invite link). */
  token: z.string().min(1),
  /** auth user id of the inviter. */
  invitedBy: z.string().min(1),
  status: InvitationStatusSchema.default('pending'),
  createdAt: z.string(),
  expiresAt: z.string(),
});
export type Invitation = z.infer<typeof InvitationSchema>;

/** A signed-in session (the tokens the desktop client holds; refresh token
 *  lives only in the secure token store, never persisted in app state). */
export const SessionSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  /** ISO expiry of the access token. */
  expiresAt: z.string().optional(),
});
export type Session = z.infer<typeof SessionSchema>;

/** The local link file (`.atelier/workspace.json`) that ties this checkout
 *  on disk to an org + project in the cloud. Written once at sign-in; the
 *  join between "my local repo" and "the org's collaboration data". */
export const WorkspaceLinkSchema = z.object({
  orgId: z.string().min(1),
  /** Stable project id within the org (a linked game/repo). */
  projectId: z.string().min(1),
  /** Cached for display; the org row is the source of truth. */
  orgName: z.string().optional(),
  linkedAt: z.string(),
});
export type WorkspaceLink = z.infer<typeof WorkspaceLinkSchema>;

/** One game the org shares, as recorded in the workspace registry. A game is
 *  its OWN git repo (per the org model), so the registry is a pointer — `slug`
 *  (the `games/<slug>` directory) → `repoUrl` (clone source). */
export const GameRegistryEntrySchema = z.object({
  /** Directory name under `games/` + the game's stable id within the workspace. */
  slug: z.string().min(1),
  /** Git remote the game's repo is cloned from / pushed to. */
  repoUrl: z.string().min(1),
  /** Human-facing name, cached for display (the repo is the source of truth). */
  name: z.string().optional(),
  /** ISO time the game was added to the registry. */
  addedAt: z.string().optional(),
});
export type GameRegistryEntry = z.infer<typeof GameRegistryEntrySchema>;

/** The git-synced game registry (`.atelier/games.json`) in the org's SHARED
 *  workspace repo. Games are separate repos gitignored out of the workspace, so
 *  this file is how a teammate DISCOVERS the org's games + clones each one. */
export const GameRegistrySchema = z.object({
  version: z.literal(1),
  games: z.array(GameRegistryEntrySchema),
});
export type GameRegistry = z.infer<typeof GameRegistrySchema>;
