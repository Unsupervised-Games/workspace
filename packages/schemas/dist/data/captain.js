import { z } from 'zod';
// Informed Captain (IC) — the per-(game, org) knowledge-oracle agent in the
// workbench. These are the shapes for its cited answers, the who-to-ask
// ownership resolution, and its knowledge-tool results. Logic lives in
// apps/workbench/lib/captain/. See docs/specs/informed-captain.md.
/** A cited source an answer / tool result points at — the "knows where to find
 *  it" made concrete. `kind` discriminates the pointer's meaning. */
export const CaptainSourceRefSchema = z.object({
    kind: z.enum(['file', 'card', 'manifest', 'commit', 'doc', 'person', 'pipeline']),
    /** The pointer: a path, narrative card id, commit sha, member email, etc. */
    ref: z.string().min(1),
    /** Optional line / section / range within the ref (a file line, a doc heading). */
    locator: z.string().optional(),
    /** Human label ("art review state", "reiska.md — the corruption arc"). */
    label: z.string().optional(),
});
/** One who-to-ask candidate + WHY (the basis) — the "knows who to ask". */
export const OwnerCandidateSchema = z.object({
    /** Member email / handle. */
    member: z.string().min(1),
    /** Where the signal came from. `explicit` = declared in `.atelier/owners`. */
    source: z.enum(['explicit', 'git', 'review', 'task', 'role']),
    /** Human-readable basis ("authored 8 of 10 combat cards; last reviewed by …"). */
    basis: z.string().min(1),
    /** Ranking strength 0..1 (explicit ⇒ 1). */
    weight: z.number().min(0).max(1),
});
/** The resolved ownership for an area (a domain or path glob). */
export const OwnershipResolutionSchema = z.object({
    area: z.string().min(1),
    /** Best candidate, or null when no signal (honest "no owner declared"). */
    owner: OwnerCandidateSchema.nullable(),
    /** Ranked alternates (excludes `owner`). */
    candidates: z.array(OwnerCandidateSchema),
    /** Present when `owner` is null — the honest note ("no owner; nearest is …"). */
    note: z.string().optional(),
});
/** One bounded, cited item a knowledge tool returns. */
export const CaptainToolItemSchema = z.object({
    text: z.string().min(1),
    source: CaptainSourceRefSchema,
});
/** A knowledge tool's result — a short summary + cited items. */
export const CaptainToolResultSchema = z.object({
    tool: z.string().min(1),
    summary: z.string().optional(),
    items: z.array(CaptainToolItemSchema),
});
/** One line of the proactive brief — a cited observation with a priority. The
 *  same trust posture as an answer: every brief line points at its source. */
export const CaptainBriefItemSchema = z.object({
    text: z.string().min(1),
    /** `urgent` = act now, `attention` = worth a look, `info` = FYI / activity. */
    severity: z.enum(['urgent', 'attention', 'info']),
    source: CaptainSourceRefSchema,
});
/** The Informed Captain's proactive brief for one game — the "living captain's
 *  brief": what needs attention, what changed recently, and the recommended
 *  next moves. Computed deterministically from project state (no LLM), so it's
 *  always available + $0; every line is cited. */
export const CaptainBriefSchema = z.object({
    /** One-line status ("2 urgent · 3 to watch" / "All clear"). */
    headline: z.string().min(1),
    /** Flagged items, most-severe first. */
    attention: z.array(CaptainBriefItemSchema),
    /** Recent activity (commits, new cards / bugs / tasks). */
    changed: z.array(CaptainBriefItemSchema),
    /** Recommended next moves, derived from the attention items. */
    recommendations: z.array(CaptainBriefItemSchema),
});
/** Where/who the IC routes you to when it can't (or shouldn't) answer directly. */
export const CaptainRouteSchema = z.object({
    kind: z.enum(['source', 'person']),
    /** A source ref (file/doc/manifest) or a member (email/handle). */
    ref: z.string().min(1),
    basis: z.string().optional(),
});
/** The specialist an orchestration step is dispatched to — an AI agent, a
 *  pipeline, a teammate, or the operator. `operator` = a manual step the human
 *  driving the workbench performs (or a `person` step with no resolved owner). */
export const PlanActorSchema = z.enum([
    'dev-agent', // the workbench Development agent (code work)
    'qa-pilot', // an automated playtest run
    'bug-fix', // the self-healing bug→plan→apply loop, on a specific bug
    'gen-pipeline', // a generation pipeline (art / audio / loc / forge) — operator CLI
    'person', // routed to a teammate (a human), resolved via ownership
    'skill', // a Claude Code direction skill (operator, outside the app)
    'operator', // a manual step the workbench operator performs
]);
/** Where a plan step is in its lifecycle.
 *
 *  `skipped` and `failed` are deliberately distinct terminal states because
 *  they mean opposite things to the steps waiting on this one: skipping is a
 *  DECISION (dependents proceed), failing is an OUTCOME (dependents block). */
export const PlanStepStatusSchema = z.enum([
    'pending',
    'dispatched',
    'done',
    'failed',
    'skipped',
]);
/** What a dispatched step became in the surface that owns it. The plan LINKS
 *  to that thing; it never copies its state (the copy would go stale, and the
 *  plan would become a second source of truth). */
export const PlanDispatchRefSchema = z.object({
    kind: z.enum(['task', 'session', 'bug']),
    id: z.string().min(1),
});
/** Rollup of a plan's step statuses. Stored on the record so a plan LIST can
 *  render without walking every step graph; the steps remain authoritative
 *  (see `rollupPlanStatus`). */
export const PlanStatusSchema = z.enum(['active', 'done', 'abandoned']);
/** One dispatchable step in an orchestration plan — an action assigned to an
 *  actor, grounded in cited sources, ordered by `dependsOn`. */
export const CaptainPlanStepSchema = z.object({
    /** Stable id within the plan; referenced by other steps' `dependsOn`. */
    id: z.string().min(1),
    title: z.string().min(1),
    actor: PlanActorSchema,
    /** The concrete action for the actor (a dev-agent task prompt, a pilot
     *  mission, a bug id to fix, a pipeline command, a request to a teammate). */
    action: z.string().min(1),
    /** Why this step — grounds it in the project state. */
    rationale: z.string().min(1),
    /** For a `person` step: the teammate (email/handle) it's routed to. */
    owner: z.string().optional(),
    /** Ids of steps that must complete first. */
    dependsOn: z.array(z.string()),
    /** Sources grounding the step (the bug, task, card, commit it addresses). */
    sources: z.array(CaptainSourceRefSchema),
    // ── execution state (added when the plan became durable) ─────────────
    //
    // All optional with defaults: a plan persisted before this shipped, and a
    // plan fresh from the planner (which proposes steps, not their progress),
    // both parse cleanly and read as `pending`.
    /** Where this step is. `dispatched` = handed to a surface and in flight;
     *  `skipped` = deliberately not doing it, which SATISFIES dependents (a
     *  decision, not a failure); `failed` = it ran and didn't work, which
     *  BLOCKS them.
     *
     *  OPTIONAL rather than `.default('pending')` on purpose: a zod default lands
     *  on the OUTPUT type, which would make `status` required on every step
     *  literal — including the planner's own tool output, which proposes steps
     *  and knows nothing about execution. Absent means pending, and
     *  `planCore.statusOf` is the one place that says so. */
    status: PlanStepStatusSchema.optional(),
    /** What the step became once dispatched — the Task / pilot session / bug.
     *  Without it a finished plan is a list of checkmarks with nothing behind
     *  them. */
    dispatchRef: PlanDispatchRefSchema.optional(),
    /** Free-text: why it was skipped, or what a manual step actually did. */
    note: z.string().optional(),
    dispatchedAt: z.string().optional(),
    completedAt: z.string().optional(),
});
/** The Informed Captain's orchestration plan (mode 3) — an intent decomposed
 *  into ordered, actor-assigned, cited dispatch steps. The Captain PROPOSES;
 *  the operator dispatches each step (nothing billed/mutating runs unprompted).
 *  The plan trust gate (apps/workbench/lib/captain) drops ungrounded citations,
 *  turns an unresolvable `person` step into an `operator` step, and prunes
 *  dangling dependencies. */
export const CaptainPlanSchema = z.object({
    intent: z.string().min(1),
    summary: z.string().min(1),
    steps: z.array(CaptainPlanStepSchema),
    /** What the Captain could NOT plan and is handing back to the operator. */
    unresolved: z.string().optional(),
    // ── durability (added when the plan became a persisted object) ───────
    //
    // Optional so the PLANNER's tool output — which proposes intent / summary /
    // steps and knows nothing about storage — still validates against this same
    // schema. The store stamps these on the way to disk.
    /** Stable id; assigned at persist time. Also the spend-correlation key. */
    id: z.string().min(1).optional(),
    /** The game this plan belongs to. */
    gameSlug: z.string().min(1).optional(),
    /** Rollup of the step statuses — DERIVED, stored only so a list view can
     *  render cheaply. On disagreement the steps win. */
    status: PlanStatusSchema.optional(),
    /** Optional grouping anchor — "vertical slice", "alpha", "Thursday build".
     *  Free text with no mechanics in v1; a game project is run as
     *  cross-discipline work converging on a date, and this is the cheapest
     *  honest acknowledgement of that. */
    milestone: z.string().optional(),
    createdAt: z.string().optional(),
    completedAt: z.string().optional(),
});
/** The IC's final structured answer. The trust gate
 *  (apps/workbench/lib/captain) ENFORCES: a non-`unknown` answer carries ≥1
 *  citation grounded in what the tools actually returned; an `unknown` answer
 *  carries a `routedTo`. Cite-or-route — never a bare guess. */
export const CaptainAnswerSchema = z.object({
    answer: z.string().min(1),
    /** Sources backing the answer. Empty ONLY when `unknown` is true. */
    citations: z.array(CaptainSourceRefSchema),
    confidence: z.enum(['high', 'medium', 'low']),
    /** True when the IC doesn't know — MUST then carry `routedTo`. */
    unknown: z.boolean(),
    /** Where/who to go to. Required when `unknown`; optional otherwise. */
    routedTo: CaptainRouteSchema.optional(),
});
//# sourceMappingURL=captain.js.map