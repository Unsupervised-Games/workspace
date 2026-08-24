import { z } from 'zod';
/** Membership roles, most- to least-privileged. Owner is unique per org. */
export declare const RoleSchema: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
export type Role = z.infer<typeof RoleSchema>;
/** An organization — the tenant. The signer-up is the initial owner. */
export declare const OrganizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    /** auth user id of the owner. */
    ownerId: z.ZodString;
    /** The org's plan tier — mirrors `org_subscriptions.plan` (kept in sync by the
     *  Stripe webhook). Read app-wide for feature gating (`planCan`). */
    plan: z.ZodDefault<z.ZodEnum<["free", "pro", "team", "enterprise"]>>;
    /** The GitHub organization the org's repos are created under (null ⇒ the
     *  owner's personal GitHub account). Set at workspace setup. */
    githubOrg: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    /** The org's shared WORKSPACE repo URL — engine packages + house skills +
     *  config (games are their own repos). Set when the first member creates the
     *  workspace + pushes it; teammates clone it to get the shared set. Null/absent
     *  until then. */
    workspaceRepoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: string;
    plan: "team" | "free" | "pro" | "enterprise";
    ownerId: string;
    githubOrg?: string | null | undefined;
    workspaceRepoUrl?: string | null | undefined;
}, {
    id: string;
    name: string;
    createdAt: string;
    ownerId: string;
    plan?: "team" | "free" | "pro" | "enterprise" | undefined;
    githubOrg?: string | null | undefined;
    workspaceRepoUrl?: string | null | undefined;
}>;
export type Organization = z.infer<typeof OrganizationSchema>;
/** A user profile — the joinable mirror of the auth user (Supabase's
 *  `auth.users` isn't directly selectable across tenants). */
export declare const ProfileSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    displayName?: string | undefined;
}, {
    id: string;
    email: string;
    displayName?: string | undefined;
}>;
export type Profile = z.infer<typeof ProfileSchema>;
/** A user's membership in one org, with their role. The join row that makes
 *  a user a tenant of an org. */
export declare const MembershipSchema: z.ZodObject<{
    orgId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    role: "owner" | "admin" | "member" | "viewer";
    orgId: string;
    userId: string;
}, {
    createdAt: string;
    role: "owner" | "admin" | "member" | "viewer";
    orgId: string;
    userId: string;
}>;
export type Membership = z.infer<typeof MembershipSchema>;
/** A membership joined to the member's profile (for the members list). */
export declare const MemberSchema: z.ZodObject<{
    orgId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
    createdAt: z.ZodString;
} & {
    profile: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        displayName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        displayName?: string | undefined;
    }, {
        id: string;
        email: string;
        displayName?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    role: "owner" | "admin" | "member" | "viewer";
    orgId: string;
    userId: string;
    profile: {
        id: string;
        email: string;
        displayName?: string | undefined;
    };
}, {
    createdAt: string;
    role: "owner" | "admin" | "member" | "viewer";
    orgId: string;
    userId: string;
    profile: {
        id: string;
        email: string;
        displayName?: string | undefined;
    };
}>;
export type Member = z.infer<typeof MemberSchema>;
export declare const InvitationStatusSchema: z.ZodEnum<["pending", "accepted", "revoked", "expired"]>;
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;
/** An email invitation to join an org at a given role. Redeemed via its
 *  token once the invitee signs in with the matching email. */
export declare const InvitationSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
    /** Opaque redemption token (random; carried in the invite link). */
    token: z.ZodString;
    /** auth user id of the inviter. */
    invitedBy: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["pending", "accepted", "revoked", "expired"]>>;
    createdAt: z.ZodString;
    expiresAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "accepted" | "revoked" | "expired";
    id: string;
    createdAt: string;
    email: string;
    role: "owner" | "admin" | "member" | "viewer";
    orgId: string;
    expiresAt: string;
    token: string;
    invitedBy: string;
}, {
    id: string;
    createdAt: string;
    email: string;
    role: "owner" | "admin" | "member" | "viewer";
    orgId: string;
    expiresAt: string;
    token: string;
    invitedBy: string;
    status?: "pending" | "accepted" | "revoked" | "expired" | undefined;
}>;
export type Invitation = z.infer<typeof InvitationSchema>;
/** A signed-in session (the tokens the desktop client holds; refresh token
 *  lives only in the secure token store, never persisted in app state). */
export declare const SessionSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodOptional<z.ZodString>;
    /** ISO expiry of the access token. */
    expiresAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    userId: string;
    accessToken: string;
    expiresAt?: string | undefined;
    refreshToken?: string | undefined;
}, {
    email: string;
    userId: string;
    accessToken: string;
    expiresAt?: string | undefined;
    refreshToken?: string | undefined;
}>;
export type Session = z.infer<typeof SessionSchema>;
/** The local link file (`.atelier/workspace.json`) that ties this checkout
 *  on disk to an org + project in the cloud. Written once at sign-in; the
 *  join between "my local repo" and "the org's collaboration data". */
export declare const WorkspaceLinkSchema: z.ZodObject<{
    orgId: z.ZodString;
    /** Stable project id within the org (a linked game/repo). */
    projectId: z.ZodString;
    /** Cached for display; the org row is the source of truth. */
    orgName: z.ZodOptional<z.ZodString>;
    linkedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    projectId: string;
    linkedAt: string;
    orgName?: string | undefined;
}, {
    orgId: string;
    projectId: string;
    linkedAt: string;
    orgName?: string | undefined;
}>;
export type WorkspaceLink = z.infer<typeof WorkspaceLinkSchema>;
/** One game the org shares, as recorded in the workspace registry. A game is
 *  its OWN git repo (per the org model), so the registry is a pointer — `slug`
 *  (the `games/<slug>` directory) → `repoUrl` (clone source). */
export declare const GameRegistryEntrySchema: z.ZodObject<{
    /** Directory name under `games/` + the game's stable id within the workspace. */
    slug: z.ZodString;
    /** Git remote the game's repo is cloned from / pushed to. */
    repoUrl: z.ZodString;
    /** Human-facing name, cached for display (the repo is the source of truth). */
    name: z.ZodOptional<z.ZodString>;
    /** ISO time the game was added to the registry. */
    addedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    repoUrl: string;
    name?: string | undefined;
    addedAt?: string | undefined;
}, {
    slug: string;
    repoUrl: string;
    name?: string | undefined;
    addedAt?: string | undefined;
}>;
export type GameRegistryEntry = z.infer<typeof GameRegistryEntrySchema>;
/** The git-synced game registry (`.atelier/games.json`) in the org's SHARED
 *  workspace repo. Games are separate repos gitignored out of the workspace, so
 *  this file is how a teammate DISCOVERS the org's games + clones each one. */
export declare const GameRegistrySchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    games: z.ZodArray<z.ZodObject<{
        /** Directory name under `games/` + the game's stable id within the workspace. */
        slug: z.ZodString;
        /** Git remote the game's repo is cloned from / pushed to. */
        repoUrl: z.ZodString;
        /** Human-facing name, cached for display (the repo is the source of truth). */
        name: z.ZodOptional<z.ZodString>;
        /** ISO time the game was added to the registry. */
        addedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        slug: string;
        repoUrl: string;
        name?: string | undefined;
        addedAt?: string | undefined;
    }, {
        slug: string;
        repoUrl: string;
        name?: string | undefined;
        addedAt?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: 1;
    games: {
        slug: string;
        repoUrl: string;
        name?: string | undefined;
        addedAt?: string | undefined;
    }[];
}, {
    version: 1;
    games: {
        slug: string;
        repoUrl: string;
        name?: string | undefined;
        addedAt?: string | undefined;
    }[];
}>;
export type GameRegistry = z.infer<typeof GameRegistrySchema>;
//# sourceMappingURL=teams.d.ts.map