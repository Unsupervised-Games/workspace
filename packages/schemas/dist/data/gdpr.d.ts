import { z } from 'zod';
export declare const UserDataExportSchema: z.ZodObject<{
    exportedAt: z.ZodString;
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
    /** The user's memberships (org id + role). */
    memberships: z.ZodArray<z.ZodObject<{
        orgId: z.ZodString;
        role: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
        orgId: string;
    }, {
        role: string;
        orgId: string;
    }>, "many">;
    spendRows: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        userId: z.ZodString;
        pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
        costUsd: z.ZodNumber;
        occurredAt: z.ZodString;
        detail: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        localKey: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }, {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }>, "many">;
    creditLedger: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        kind: z.ZodEnum<["purchase", "debit", "adjustment"]>;
        credits: z.ZodNumber;
        pipeline: z.ZodOptional<z.ZodString>;
        vendorCostUsd: z.ZodOptional<z.ZodNumber>;
        userId: z.ZodOptional<z.ZodString>;
        detail: z.ZodDefault<z.ZodString>;
        idempotencyKey: z.ZodString;
        occurredAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        detail: string;
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }, {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        detail?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }>, "many">;
    reviewComments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        targetKey: z.ZodString;
        authorId: z.ZodString;
        body: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }, {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }>, "many">;
    reviewApprovals: z.ZodArray<z.ZodObject<{
        orgId: z.ZodString;
        targetKey: z.ZodString;
        userId: z.ZodString;
        verdict: z.ZodEnum<["approved", "changes-requested"]>;
        note: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }, {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }>, "many">;
    productEvents: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        orgId: z.ZodNullable<z.ZodString>;
        event: z.ZodEnum<["signin", "org.created", "member.invited", "generation.run", "plan.upgraded"]>;
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
    }>, "many">;
    /** Invitations this user sent. */
    sentInvitations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
        token: z.ZodString;
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
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    profile: {
        id: string;
        email: string;
        displayName?: string | undefined;
    };
    exportedAt: string;
    memberships: {
        role: string;
        orgId: string;
    }[];
    spendRows: {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }[];
    creditLedger: {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        detail: string;
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }[];
    reviewComments: {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }[];
    reviewApprovals: {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }[];
    productEvents: {
        at: string;
        orgId: string | null;
        userId: string;
        event: "signin" | "org.created" | "member.invited" | "generation.run" | "plan.upgraded";
        props?: Record<string, string | number | boolean> | undefined;
    }[];
    sentInvitations: {
        status: "pending" | "accepted" | "revoked" | "expired";
        id: string;
        createdAt: string;
        email: string;
        role: "owner" | "admin" | "member" | "viewer";
        orgId: string;
        expiresAt: string;
        token: string;
        invitedBy: string;
    }[];
}, {
    profile: {
        id: string;
        email: string;
        displayName?: string | undefined;
    };
    exportedAt: string;
    memberships: {
        role: string;
        orgId: string;
    }[];
    spendRows: {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }[];
    creditLedger: {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        detail?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }[];
    reviewComments: {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }[];
    reviewApprovals: {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }[];
    productEvents: {
        at: string;
        orgId: string | null;
        userId: string;
        event: "signin" | "org.created" | "member.invited" | "generation.run" | "plan.upgraded";
        props?: Record<string, string | number | boolean> | undefined;
    }[];
    sentInvitations: {
        id: string;
        createdAt: string;
        email: string;
        role: "owner" | "admin" | "member" | "viewer";
        orgId: string;
        expiresAt: string;
        token: string;
        invitedBy: string;
        status?: "pending" | "accepted" | "revoked" | "expired" | undefined;
    }[];
}>;
export type UserDataExport = z.infer<typeof UserDataExportSchema>;
export declare const OrgDataExportSchema: z.ZodObject<{
    exportedAt: z.ZodString;
    organization: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        ownerId: z.ZodString;
        plan: z.ZodDefault<z.ZodEnum<["free", "pro", "team", "enterprise"]>>;
        githubOrg: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
    members: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    invitations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
        token: z.ZodString;
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
    }>, "many">;
    budget: z.ZodOptional<z.ZodObject<{
        orgId: z.ZodString;
        lifetimeUsd: z.ZodOptional<z.ZodNumber>;
        requireAuthorization: z.ZodDefault<z.ZodBoolean>;
        updatedBy: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        requireAuthorization: boolean;
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
    }, {
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
        requireAuthorization?: boolean | undefined;
    }>>;
    /** The org's credit balance (integer credits — the saved card is NOT included). */
    creditBalance: z.ZodOptional<z.ZodNumber>;
    spendLedger: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        userId: z.ZodString;
        pipeline: z.ZodEnum<["asset", "audio", "loc", "code"]>;
        costUsd: z.ZodNumber;
        occurredAt: z.ZodString;
        detail: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        localKey: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }, {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }>, "many">;
    creditLedger: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        kind: z.ZodEnum<["purchase", "debit", "adjustment"]>;
        credits: z.ZodNumber;
        pipeline: z.ZodOptional<z.ZodString>;
        vendorCostUsd: z.ZodOptional<z.ZodNumber>;
        userId: z.ZodOptional<z.ZodString>;
        detail: z.ZodDefault<z.ZodString>;
        idempotencyKey: z.ZodString;
        occurredAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        detail: string;
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }, {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        detail?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }>, "many">;
    spendLimit: z.ZodOptional<z.ZodObject<{
        maxCreditsPerHour: z.ZodNullable<z.ZodNumber>;
        maxCreditsPerDay: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxCreditsPerHour: number | null;
        maxCreditsPerDay: number | null;
    }, {
        maxCreditsPerHour: number | null;
        maxCreditsPerDay: number | null;
    }>>;
    /** Plan + seats + status only — the Stripe ids are redacted. */
    subscription: z.ZodOptional<z.ZodObject<{
        plan: z.ZodString;
        seats: z.ZodNumber;
        status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        plan: string;
        seats: number;
    }, {
        status: string;
        plan: string;
        seats: number;
    }>>;
    reviewComments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        targetKey: z.ZodString;
        authorId: z.ZodString;
        body: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }, {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }>, "many">;
    reviewApprovals: z.ZodArray<z.ZodObject<{
        orgId: z.ZodString;
        targetKey: z.ZodString;
        userId: z.ZodString;
        verdict: z.ZodEnum<["approved", "changes-requested"]>;
        note: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }, {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }>, "many">;
    auditLog: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        actorId: z.ZodOptional<z.ZodString>;
        actorEmail: z.ZodOptional<z.ZodString>;
        action: z.ZodEnum<["member.added", "member.role_changed", "member.removed", "invitation.created", "invitation.revoked", "invitation.redeemed", "org.created", "org.renamed", "org.deleted", "org.suspended", "subscription.changed", "autoreload.changed", "budget.changed", "spend_limit.changed", "data.exported"]>;
        targetType: z.ZodOptional<z.ZodString>;
        targetId: z.ZodOptional<z.ZodString>;
        summary: z.ZodDefault<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        occurredAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        action: "org.created" | "member.added" | "member.role_changed" | "member.removed" | "invitation.created" | "invitation.revoked" | "invitation.redeemed" | "org.renamed" | "org.deleted" | "org.suspended" | "subscription.changed" | "autoreload.changed" | "budget.changed" | "spend_limit.changed" | "data.exported";
        summary: string;
        orgId: string;
        occurredAt: string;
        targetType?: string | undefined;
        actorId?: string | undefined;
        actorEmail?: string | undefined;
        targetId?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, {
        id: string;
        action: "org.created" | "member.added" | "member.role_changed" | "member.removed" | "invitation.created" | "invitation.revoked" | "invitation.redeemed" | "org.renamed" | "org.deleted" | "org.suspended" | "subscription.changed" | "autoreload.changed" | "budget.changed" | "spend_limit.changed" | "data.exported";
        orgId: string;
        occurredAt: string;
        targetType?: string | undefined;
        summary?: string | undefined;
        actorId?: string | undefined;
        actorEmail?: string | undefined;
        targetId?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    exportedAt: string;
    creditLedger: {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        detail: string;
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }[];
    reviewComments: {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }[];
    reviewApprovals: {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }[];
    organization: {
        id: string;
        name: string;
        createdAt: string;
        plan: "team" | "free" | "pro" | "enterprise";
        ownerId: string;
        githubOrg?: string | null | undefined;
        workspaceRepoUrl?: string | null | undefined;
    };
    members: {
        createdAt: string;
        role: "owner" | "admin" | "member" | "viewer";
        orgId: string;
        userId: string;
        profile: {
            id: string;
            email: string;
            displayName?: string | undefined;
        };
    }[];
    invitations: {
        status: "pending" | "accepted" | "revoked" | "expired";
        id: string;
        createdAt: string;
        email: string;
        role: "owner" | "admin" | "member" | "viewer";
        orgId: string;
        expiresAt: string;
        token: string;
        invitedBy: string;
    }[];
    spendLedger: {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }[];
    auditLog: {
        id: string;
        action: "org.created" | "member.added" | "member.role_changed" | "member.removed" | "invitation.created" | "invitation.revoked" | "invitation.redeemed" | "org.renamed" | "org.deleted" | "org.suspended" | "subscription.changed" | "autoreload.changed" | "budget.changed" | "spend_limit.changed" | "data.exported";
        summary: string;
        orgId: string;
        occurredAt: string;
        targetType?: string | undefined;
        actorId?: string | undefined;
        actorEmail?: string | undefined;
        targetId?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }[];
    budget?: {
        requireAuthorization: boolean;
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
    } | undefined;
    creditBalance?: number | undefined;
    spendLimit?: {
        maxCreditsPerHour: number | null;
        maxCreditsPerDay: number | null;
    } | undefined;
    subscription?: {
        status: string;
        plan: string;
        seats: number;
    } | undefined;
}, {
    exportedAt: string;
    creditLedger: {
        id: string;
        kind: "purchase" | "debit" | "adjustment";
        orgId: string;
        occurredAt: string;
        credits: number;
        idempotencyKey: string;
        pipeline?: string | undefined;
        detail?: string | undefined;
        userId?: string | undefined;
        vendorCostUsd?: number | undefined;
    }[];
    reviewComments: {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
    }[];
    reviewApprovals: {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        note?: string | undefined;
    }[];
    organization: {
        id: string;
        name: string;
        createdAt: string;
        ownerId: string;
        plan?: "team" | "free" | "pro" | "enterprise" | undefined;
        githubOrg?: string | null | undefined;
        workspaceRepoUrl?: string | null | undefined;
    };
    members: {
        createdAt: string;
        role: "owner" | "admin" | "member" | "viewer";
        orgId: string;
        userId: string;
        profile: {
            id: string;
            email: string;
            displayName?: string | undefined;
        };
    }[];
    invitations: {
        id: string;
        createdAt: string;
        email: string;
        role: "owner" | "admin" | "member" | "viewer";
        orgId: string;
        expiresAt: string;
        token: string;
        invitedBy: string;
        status?: "pending" | "accepted" | "revoked" | "expired" | undefined;
    }[];
    spendLedger: {
        id: string;
        costUsd: number;
        pipeline: "code" | "audio" | "asset" | "loc";
        detail: string;
        orgId: string;
        userId: string;
        occurredAt: string;
        localKey: string;
        source?: string | undefined;
    }[];
    auditLog: {
        id: string;
        action: "org.created" | "member.added" | "member.role_changed" | "member.removed" | "invitation.created" | "invitation.revoked" | "invitation.redeemed" | "org.renamed" | "org.deleted" | "org.suspended" | "subscription.changed" | "autoreload.changed" | "budget.changed" | "spend_limit.changed" | "data.exported";
        orgId: string;
        occurredAt: string;
        targetType?: string | undefined;
        summary?: string | undefined;
        actorId?: string | undefined;
        actorEmail?: string | undefined;
        targetId?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }[];
    budget?: {
        orgId: string;
        updatedAt: string;
        updatedBy: string;
        lifetimeUsd?: number | undefined;
        requireAuthorization?: boolean | undefined;
    } | undefined;
    creditBalance?: number | undefined;
    spendLimit?: {
        maxCreditsPerHour: number | null;
        maxCreditsPerDay: number | null;
    } | undefined;
    subscription?: {
        status: string;
        plan: string;
        seats: number;
    } | undefined;
}>;
export type OrgDataExport = z.infer<typeof OrgDataExportSchema>;
//# sourceMappingURL=gdpr.d.ts.map