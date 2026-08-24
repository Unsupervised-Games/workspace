import { z } from 'zod';
/** The stable action vocabulary. Each maps to one security-relevant mutation the
 *  database triggers capture. Grouped by category in the pure `auditCategory`. */
export declare const AuditActionSchema: z.ZodEnum<["member.added", "member.role_changed", "member.removed", "invitation.created", "invitation.revoked", "invitation.redeemed", "org.created", "org.renamed", "org.deleted", "org.suspended", "subscription.changed", "autoreload.changed", "budget.changed", "spend_limit.changed", "data.exported"]>;
export type AuditAction = z.infer<typeof AuditActionSchema>;
export declare const AuditEntrySchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    /** The user who performed the action; absent for a system / service-role
     *  action (a webhook), or once the actor's account has been deleted. */
    actorId: z.ZodOptional<z.ZodString>;
    /** A denormalized snapshot of the actor's email at action time, so the trail
     *  stays readable after the account is deleted (legitimate-interest retention).
     *  Absent for system actions. */
    actorEmail: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<["member.added", "member.role_changed", "member.removed", "invitation.created", "invitation.revoked", "invitation.redeemed", "org.created", "org.renamed", "org.deleted", "org.suspended", "subscription.changed", "autoreload.changed", "budget.changed", "spend_limit.changed", "data.exported"]>;
    /** The kind of entity affected (`member` / `invitation` / `organization` /
     *  `subscription` / `budget` / …) — for grouping + the target link. */
    targetType: z.ZodOptional<z.ZodString>;
    /** The affected entity's id (a user id, invitation id, …). */
    targetId: z.ZodOptional<z.ZodString>;
    /** A human-readable one-liner describing what happened. */
    summary: z.ZodDefault<z.ZodString>;
    /** Structured before/after detail (e.g. `{ from: 'member', to: 'admin' }`). */
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    occurredAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    orgId: string;
    action: "member.added" | "member.role_changed" | "member.removed" | "invitation.created" | "invitation.revoked" | "invitation.redeemed" | "org.created" | "org.renamed" | "org.deleted" | "org.suspended" | "subscription.changed" | "autoreload.changed" | "budget.changed" | "spend_limit.changed" | "data.exported";
    summary: string;
    occurredAt: string;
    actorId?: string | undefined;
    actorEmail?: string | undefined;
    targetType?: string | undefined;
    targetId?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    id: string;
    orgId: string;
    action: "member.added" | "member.role_changed" | "member.removed" | "invitation.created" | "invitation.revoked" | "invitation.redeemed" | "org.created" | "org.renamed" | "org.deleted" | "org.suspended" | "subscription.changed" | "autoreload.changed" | "budget.changed" | "spend_limit.changed" | "data.exported";
    occurredAt: string;
    actorId?: string | undefined;
    actorEmail?: string | undefined;
    targetType?: string | undefined;
    targetId?: string | undefined;
    summary?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type AuditEntry = z.infer<typeof AuditEntrySchema>;
//# sourceMappingURL=audit.d.ts.map