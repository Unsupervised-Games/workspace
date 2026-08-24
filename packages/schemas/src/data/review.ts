import { z } from 'zod';

// Teammate review shapes — threaded comments + a lightweight approve /
// changes-requested verdict on a dev task's branch (Teams Phase 3). The
// in-workbench "teammate reviews the AI's work before the PR" step, sitting
// beside the solo AI code-review; advisory, never a merge gate (GitHub owns
// merge).
//
// The thread anchors on a CROSS-MACHINE key: `targetKey = task.branchName`
// (tasks themselves are local + per-machine, but the branch is shared via git,
// so every teammate on the repo resolves the same thread). These shapes cross
// the workbench ↔ Supabase boundary; @unsupervised/workbench-cloud parses via them (it
// declares no zod of its own).

/** A teammate's verdict on a branch. Advisory — the counts inform, they don't
 *  gate. */
export const ReviewVerdictSchema = z.enum(['approved', 'changes-requested']);
export type ReviewVerdict = z.infer<typeof ReviewVerdictSchema>;

/** One comment on a branch thread. */
export const ReviewCommentSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  /** The branch name the thread is anchored on. */
  targetKey: z.string().min(1),
  /** auth user id of the comment's author. */
  authorId: z.string().min(1),
  body: z.string().min(1),
  createdAt: z.string(),
});
export type ReviewComment = z.infer<typeof ReviewCommentSchema>;

/** A new comment as posted by a member (the store assigns `id` / `authorId`). */
export const NewReviewCommentSchema = ReviewCommentSchema.omit({ id: true, orgId: true, authorId: true });
export type NewReviewComment = z.infer<typeof NewReviewCommentSchema>;

/** One teammate's current verdict on a branch — one row per (target, user); a
 *  later `setApproval` replaces it. */
export const ReviewApprovalSchema = z.object({
  orgId: z.string().min(1),
  targetKey: z.string().min(1),
  /** auth user id of the reviewer. */
  userId: z.string().min(1),
  verdict: ReviewVerdictSchema,
  note: z.string().optional(),
  updatedAt: z.string(),
});
export type ReviewApproval = z.infer<typeof ReviewApprovalSchema>;

/** A comment with the author's display email resolved (for the panel). */
export const ReviewCommentViewSchema = ReviewCommentSchema.extend({ authorEmail: z.string().optional() });
export type ReviewCommentView = z.infer<typeof ReviewCommentViewSchema>;

/** An approval with the reviewer's display email resolved. */
export const ReviewApprovalViewSchema = ReviewApprovalSchema.extend({ email: z.string().optional() });
export type ReviewApprovalView = z.infer<typeof ReviewApprovalViewSchema>;

/** The computed thread view the Task-view panel renders. */
export const ReviewThreadSchema = z.object({
  targetKey: z.string().min(1),
  comments: z.array(ReviewCommentViewSchema),
  approvals: z.array(ReviewApprovalViewSchema),
  approvedCount: z.number().int().nonnegative(),
  changesRequestedCount: z.number().int().nonnegative(),
  /** The current user's own verdict, when they've cast one. */
  myVerdict: ReviewVerdictSchema.optional(),
});
export type ReviewThread = z.infer<typeof ReviewThreadSchema>;
