import { z } from 'zod';
/** A teammate's verdict on a branch. Advisory — the counts inform, they don't
 *  gate. */
export declare const ReviewVerdictSchema: z.ZodEnum<["approved", "changes-requested"]>;
export type ReviewVerdict = z.infer<typeof ReviewVerdictSchema>;
/** One comment on a branch thread. */
export declare const ReviewCommentSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    /** The branch name the thread is anchored on. */
    targetKey: z.ZodString;
    /** auth user id of the comment's author. */
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
}>;
export type ReviewComment = z.infer<typeof ReviewCommentSchema>;
/** A new comment as posted by a member (the store assigns `id` / `authorId`). */
export declare const NewReviewCommentSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    orgId: z.ZodString;
    /** The branch name the thread is anchored on. */
    targetKey: z.ZodString;
    /** auth user id of the comment's author. */
    authorId: z.ZodString;
    body: z.ZodString;
    createdAt: z.ZodString;
}, "id" | "orgId" | "authorId">, "strip", z.ZodTypeAny, {
    createdAt: string;
    targetKey: string;
    body: string;
}, {
    createdAt: string;
    targetKey: string;
    body: string;
}>;
export type NewReviewComment = z.infer<typeof NewReviewCommentSchema>;
/** One teammate's current verdict on a branch — one row per (target, user); a
 *  later `setApproval` replaces it. */
export declare const ReviewApprovalSchema: z.ZodObject<{
    orgId: z.ZodString;
    targetKey: z.ZodString;
    /** auth user id of the reviewer. */
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
}>;
export type ReviewApproval = z.infer<typeof ReviewApprovalSchema>;
/** A comment with the author's display email resolved (for the panel). */
export declare const ReviewCommentViewSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    /** The branch name the thread is anchored on. */
    targetKey: z.ZodString;
    /** auth user id of the comment's author. */
    authorId: z.ZodString;
    body: z.ZodString;
    createdAt: z.ZodString;
} & {
    authorEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    orgId: string;
    targetKey: string;
    authorId: string;
    body: string;
    authorEmail?: string | undefined;
}, {
    id: string;
    createdAt: string;
    orgId: string;
    targetKey: string;
    authorId: string;
    body: string;
    authorEmail?: string | undefined;
}>;
export type ReviewCommentView = z.infer<typeof ReviewCommentViewSchema>;
/** An approval with the reviewer's display email resolved. */
export declare const ReviewApprovalViewSchema: z.ZodObject<{
    orgId: z.ZodString;
    targetKey: z.ZodString;
    /** auth user id of the reviewer. */
    userId: z.ZodString;
    verdict: z.ZodEnum<["approved", "changes-requested"]>;
    note: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodString;
} & {
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    verdict: "approved" | "changes-requested";
    orgId: string;
    updatedAt: string;
    userId: string;
    targetKey: string;
    email?: string | undefined;
    note?: string | undefined;
}, {
    verdict: "approved" | "changes-requested";
    orgId: string;
    updatedAt: string;
    userId: string;
    targetKey: string;
    email?: string | undefined;
    note?: string | undefined;
}>;
export type ReviewApprovalView = z.infer<typeof ReviewApprovalViewSchema>;
/** The computed thread view the Task-view panel renders. */
export declare const ReviewThreadSchema: z.ZodObject<{
    targetKey: z.ZodString;
    comments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        /** The branch name the thread is anchored on. */
        targetKey: z.ZodString;
        /** auth user id of the comment's author. */
        authorId: z.ZodString;
        body: z.ZodString;
        createdAt: z.ZodString;
    } & {
        authorEmail: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
        authorEmail?: string | undefined;
    }, {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
        authorEmail?: string | undefined;
    }>, "many">;
    approvals: z.ZodArray<z.ZodObject<{
        orgId: z.ZodString;
        targetKey: z.ZodString;
        /** auth user id of the reviewer. */
        userId: z.ZodString;
        verdict: z.ZodEnum<["approved", "changes-requested"]>;
        note: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodString;
    } & {
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        email?: string | undefined;
        note?: string | undefined;
    }, {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        email?: string | undefined;
        note?: string | undefined;
    }>, "many">;
    approvedCount: z.ZodNumber;
    changesRequestedCount: z.ZodNumber;
    /** The current user's own verdict, when they've cast one. */
    myVerdict: z.ZodOptional<z.ZodEnum<["approved", "changes-requested"]>>;
}, "strip", z.ZodTypeAny, {
    targetKey: string;
    comments: {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
        authorEmail?: string | undefined;
    }[];
    approvals: {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        email?: string | undefined;
        note?: string | undefined;
    }[];
    approvedCount: number;
    changesRequestedCount: number;
    myVerdict?: "approved" | "changes-requested" | undefined;
}, {
    targetKey: string;
    comments: {
        id: string;
        createdAt: string;
        orgId: string;
        targetKey: string;
        authorId: string;
        body: string;
        authorEmail?: string | undefined;
    }[];
    approvals: {
        verdict: "approved" | "changes-requested";
        orgId: string;
        updatedAt: string;
        userId: string;
        targetKey: string;
        email?: string | undefined;
        note?: string | undefined;
    }[];
    approvedCount: number;
    changesRequestedCount: number;
    myVerdict?: "approved" | "changes-requested" | undefined;
}>;
export type ReviewThread = z.infer<typeof ReviewThreadSchema>;
//# sourceMappingURL=review.d.ts.map