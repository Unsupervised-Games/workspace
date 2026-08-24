import { z } from 'zod';
/** A cited source an answer / tool result points at — the "knows where to find
 *  it" made concrete. `kind` discriminates the pointer's meaning. */
export declare const CaptainSourceRefSchema: z.ZodObject<{
    kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
    /** The pointer: a path, narrative card id, commit sha, member email, etc. */
    ref: z.ZodString;
    /** Optional line / section / range within the ref (a file line, a doc heading). */
    locator: z.ZodOptional<z.ZodString>;
    /** Human label ("art review state", "reiska.md — the corruption arc"). */
    label: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
    ref: string;
    locator?: string | undefined;
    label?: string | undefined;
}, {
    kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
    ref: string;
    locator?: string | undefined;
    label?: string | undefined;
}>;
export type CaptainSourceRef = z.infer<typeof CaptainSourceRefSchema>;
/** One who-to-ask candidate + WHY (the basis) — the "knows who to ask". */
export declare const OwnerCandidateSchema: z.ZodObject<{
    /** Member email / handle. */
    member: z.ZodString;
    /** Where the signal came from. `explicit` = declared in `.atelier/owners`. */
    source: z.ZodEnum<["explicit", "git", "review", "task", "role"]>;
    /** Human-readable basis ("authored 8 of 10 combat cards; last reviewed by …"). */
    basis: z.ZodString;
    /** Ranking strength 0..1 (explicit ⇒ 1). */
    weight: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    member: string;
    source: "explicit" | "git" | "review" | "task" | "role";
    basis: string;
    weight: number;
}, {
    member: string;
    source: "explicit" | "git" | "review" | "task" | "role";
    basis: string;
    weight: number;
}>;
export type OwnerCandidate = z.infer<typeof OwnerCandidateSchema>;
/** The resolved ownership for an area (a domain or path glob). */
export declare const OwnershipResolutionSchema: z.ZodObject<{
    area: z.ZodString;
    /** Best candidate, or null when no signal (honest "no owner declared"). */
    owner: z.ZodNullable<z.ZodObject<{
        /** Member email / handle. */
        member: z.ZodString;
        /** Where the signal came from. `explicit` = declared in `.atelier/owners`. */
        source: z.ZodEnum<["explicit", "git", "review", "task", "role"]>;
        /** Human-readable basis ("authored 8 of 10 combat cards; last reviewed by …"). */
        basis: z.ZodString;
        /** Ranking strength 0..1 (explicit ⇒ 1). */
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    }, {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    }>>;
    /** Ranked alternates (excludes `owner`). */
    candidates: z.ZodArray<z.ZodObject<{
        /** Member email / handle. */
        member: z.ZodString;
        /** Where the signal came from. `explicit` = declared in `.atelier/owners`. */
        source: z.ZodEnum<["explicit", "git", "review", "task", "role"]>;
        /** Human-readable basis ("authored 8 of 10 combat cards; last reviewed by …"). */
        basis: z.ZodString;
        /** Ranking strength 0..1 (explicit ⇒ 1). */
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    }, {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    }>, "many">;
    /** Present when `owner` is null — the honest note ("no owner; nearest is …"). */
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    area: string;
    owner: {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    } | null;
    candidates: {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    }[];
    note?: string | undefined;
}, {
    area: string;
    owner: {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    } | null;
    candidates: {
        member: string;
        source: "explicit" | "git" | "review" | "task" | "role";
        basis: string;
        weight: number;
    }[];
    note?: string | undefined;
}>;
export type OwnershipResolution = z.infer<typeof OwnershipResolutionSchema>;
/** One bounded, cited item a knowledge tool returns. */
export declare const CaptainToolItemSchema: z.ZodObject<{
    text: z.ZodString;
    source: z.ZodObject<{
        kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
        /** The pointer: a path, narrative card id, commit sha, member email, etc. */
        ref: z.ZodString;
        /** Optional line / section / range within the ref (a file line, a doc heading). */
        locator: z.ZodOptional<z.ZodString>;
        /** Human label ("art review state", "reiska.md — the corruption arc"). */
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    source: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    };
    text: string;
}, {
    source: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    };
    text: string;
}>;
export type CaptainToolItem = z.infer<typeof CaptainToolItemSchema>;
/** A knowledge tool's result — a short summary + cited items. */
export declare const CaptainToolResultSchema: z.ZodObject<{
    tool: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        source: z.ZodObject<{
            kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
            /** The pointer: a path, narrative card id, commit sha, member email, etc. */
            ref: z.ZodString;
            /** Optional line / section / range within the ref (a file line, a doc heading). */
            locator: z.ZodOptional<z.ZodString>;
            /** Human label ("art review state", "reiska.md — the corruption arc"). */
            label: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
    }, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tool: string;
    items: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
    }[];
    summary?: string | undefined;
}, {
    tool: string;
    items: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
    }[];
    summary?: string | undefined;
}>;
export type CaptainToolResult = z.infer<typeof CaptainToolResultSchema>;
/** One line of the proactive brief — a cited observation with a priority. The
 *  same trust posture as an answer: every brief line points at its source. */
export declare const CaptainBriefItemSchema: z.ZodObject<{
    text: z.ZodString;
    /** `urgent` = act now, `attention` = worth a look, `info` = FYI / activity. */
    severity: z.ZodEnum<["urgent", "attention", "info"]>;
    source: z.ZodObject<{
        kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
        /** The pointer: a path, narrative card id, commit sha, member email, etc. */
        ref: z.ZodString;
        /** Optional line / section / range within the ref (a file line, a doc heading). */
        locator: z.ZodOptional<z.ZodString>;
        /** Human label ("art review state", "reiska.md — the corruption arc"). */
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    source: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    };
    text: string;
    severity: "urgent" | "attention" | "info";
}, {
    source: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    };
    text: string;
    severity: "urgent" | "attention" | "info";
}>;
export type CaptainBriefItem = z.infer<typeof CaptainBriefItemSchema>;
/** The Informed Captain's proactive brief for one game — the "living captain's
 *  brief": what needs attention, what changed recently, and the recommended
 *  next moves. Computed deterministically from project state (no LLM), so it's
 *  always available + $0; every line is cited. */
export declare const CaptainBriefSchema: z.ZodObject<{
    /** One-line status ("2 urgent · 3 to watch" / "All clear"). */
    headline: z.ZodString;
    /** Flagged items, most-severe first. */
    attention: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        /** `urgent` = act now, `attention` = worth a look, `info` = FYI / activity. */
        severity: z.ZodEnum<["urgent", "attention", "info"]>;
        source: z.ZodObject<{
            kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
            /** The pointer: a path, narrative card id, commit sha, member email, etc. */
            ref: z.ZodString;
            /** Optional line / section / range within the ref (a file line, a doc heading). */
            locator: z.ZodOptional<z.ZodString>;
            /** Human label ("art review state", "reiska.md — the corruption arc"). */
            label: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }>, "many">;
    /** Recent activity (commits, new cards / bugs / tasks). */
    changed: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        /** `urgent` = act now, `attention` = worth a look, `info` = FYI / activity. */
        severity: z.ZodEnum<["urgent", "attention", "info"]>;
        source: z.ZodObject<{
            kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
            /** The pointer: a path, narrative card id, commit sha, member email, etc. */
            ref: z.ZodString;
            /** Optional line / section / range within the ref (a file line, a doc heading). */
            locator: z.ZodOptional<z.ZodString>;
            /** Human label ("art review state", "reiska.md — the corruption arc"). */
            label: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }>, "many">;
    /** Recommended next moves, derived from the attention items. */
    recommendations: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        /** `urgent` = act now, `attention` = worth a look, `info` = FYI / activity. */
        severity: z.ZodEnum<["urgent", "attention", "info"]>;
        source: z.ZodObject<{
            kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
            /** The pointer: a path, narrative card id, commit sha, member email, etc. */
            ref: z.ZodString;
            /** Optional line / section / range within the ref (a file line, a doc heading). */
            locator: z.ZodOptional<z.ZodString>;
            /** Human label ("art review state", "reiska.md — the corruption arc"). */
            label: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }, {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    attention: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }[];
    headline: string;
    changed: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }[];
    recommendations: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }[];
}, {
    attention: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }[];
    headline: string;
    changed: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }[];
    recommendations: {
        source: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        };
        text: string;
        severity: "urgent" | "attention" | "info";
    }[];
}>;
export type CaptainBrief = z.infer<typeof CaptainBriefSchema>;
/** Where/who the IC routes you to when it can't (or shouldn't) answer directly. */
export declare const CaptainRouteSchema: z.ZodObject<{
    kind: z.ZodEnum<["source", "person"]>;
    /** A source ref (file/doc/manifest) or a member (email/handle). */
    ref: z.ZodString;
    basis: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "person" | "source";
    ref: string;
    basis?: string | undefined;
}, {
    kind: "person" | "source";
    ref: string;
    basis?: string | undefined;
}>;
export type CaptainRoute = z.infer<typeof CaptainRouteSchema>;
/** The specialist an orchestration step is dispatched to — an AI agent, a
 *  pipeline, a teammate, or the operator. `operator` = a manual step the human
 *  driving the workbench performs (or a `person` step with no resolved owner). */
export declare const PlanActorSchema: z.ZodEnum<["dev-agent", "qa-pilot", "bug-fix", "gen-pipeline", "person", "skill", "operator"]>;
export type PlanActor = z.infer<typeof PlanActorSchema>;
/** Where a plan step is in its lifecycle.
 *
 *  `skipped` and `failed` are deliberately distinct terminal states because
 *  they mean opposite things to the steps waiting on this one: skipping is a
 *  DECISION (dependents proceed), failing is an OUTCOME (dependents block). */
export declare const PlanStepStatusSchema: z.ZodEnum<["pending", "dispatched", "done", "failed", "skipped"]>;
export type PlanStepStatus = z.infer<typeof PlanStepStatusSchema>;
/** What a dispatched step became in the surface that owns it. The plan LINKS
 *  to that thing; it never copies its state (the copy would go stale, and the
 *  plan would become a second source of truth). */
export declare const PlanDispatchRefSchema: z.ZodObject<{
    kind: z.ZodEnum<["task", "session", "bug"]>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "task" | "session" | "bug";
    id: string;
}, {
    kind: "task" | "session" | "bug";
    id: string;
}>;
export type PlanDispatchRef = z.infer<typeof PlanDispatchRefSchema>;
/** Rollup of a plan's step statuses. Stored on the record so a plan LIST can
 *  render without walking every step graph; the steps remain authoritative
 *  (see `rollupPlanStatus`). */
export declare const PlanStatusSchema: z.ZodEnum<["active", "done", "abandoned"]>;
export type PlanStatus = z.infer<typeof PlanStatusSchema>;
/** One dispatchable step in an orchestration plan — an action assigned to an
 *  actor, grounded in cited sources, ordered by `dependsOn`. */
export declare const CaptainPlanStepSchema: z.ZodObject<{
    /** Stable id within the plan; referenced by other steps' `dependsOn`. */
    id: z.ZodString;
    title: z.ZodString;
    actor: z.ZodEnum<["dev-agent", "qa-pilot", "bug-fix", "gen-pipeline", "person", "skill", "operator"]>;
    /** The concrete action for the actor (a dev-agent task prompt, a pilot
     *  mission, a bug id to fix, a pipeline command, a request to a teammate). */
    action: z.ZodString;
    /** Why this step — grounds it in the project state. */
    rationale: z.ZodString;
    /** For a `person` step: the teammate (email/handle) it's routed to. */
    owner: z.ZodOptional<z.ZodString>;
    /** Ids of steps that must complete first. */
    dependsOn: z.ZodArray<z.ZodString, "many">;
    /** Sources grounding the step (the bug, task, card, commit it addresses). */
    sources: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
        /** The pointer: a path, narrative card id, commit sha, member email, etc. */
        ref: z.ZodString;
        /** Optional line / section / range within the ref (a file line, a doc heading). */
        locator: z.ZodOptional<z.ZodString>;
        /** Human label ("art review state", "reiska.md — the corruption arc"). */
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }>, "many">;
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
    status: z.ZodOptional<z.ZodEnum<["pending", "dispatched", "done", "failed", "skipped"]>>;
    /** What the step became once dispatched — the Task / pilot session / bug.
     *  Without it a finished plan is a list of checkmarks with nothing behind
     *  them. */
    dispatchRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodEnum<["task", "session", "bug"]>;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "task" | "session" | "bug";
        id: string;
    }, {
        kind: "task" | "session" | "bug";
        id: string;
    }>>;
    /** Free-text: why it was skipped, or what a manual step actually did. */
    note: z.ZodOptional<z.ZodString>;
    dispatchedAt: z.ZodOptional<z.ZodString>;
    completedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    actor: "person" | "dev-agent" | "qa-pilot" | "bug-fix" | "gen-pipeline" | "skill" | "operator";
    action: string;
    rationale: string;
    dependsOn: string[];
    sources: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }[];
    status?: "pending" | "dispatched" | "done" | "failed" | "skipped" | undefined;
    owner?: string | undefined;
    note?: string | undefined;
    dispatchRef?: {
        kind: "task" | "session" | "bug";
        id: string;
    } | undefined;
    dispatchedAt?: string | undefined;
    completedAt?: string | undefined;
}, {
    id: string;
    title: string;
    actor: "person" | "dev-agent" | "qa-pilot" | "bug-fix" | "gen-pipeline" | "skill" | "operator";
    action: string;
    rationale: string;
    dependsOn: string[];
    sources: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }[];
    status?: "pending" | "dispatched" | "done" | "failed" | "skipped" | undefined;
    owner?: string | undefined;
    note?: string | undefined;
    dispatchRef?: {
        kind: "task" | "session" | "bug";
        id: string;
    } | undefined;
    dispatchedAt?: string | undefined;
    completedAt?: string | undefined;
}>;
export type CaptainPlanStep = z.infer<typeof CaptainPlanStepSchema>;
/** The Informed Captain's orchestration plan (mode 3) — an intent decomposed
 *  into ordered, actor-assigned, cited dispatch steps. The Captain PROPOSES;
 *  the operator dispatches each step (nothing billed/mutating runs unprompted).
 *  The plan trust gate (apps/workbench/lib/captain) drops ungrounded citations,
 *  turns an unresolvable `person` step into an `operator` step, and prunes
 *  dangling dependencies. */
export declare const CaptainPlanSchema: z.ZodObject<{
    intent: z.ZodString;
    summary: z.ZodString;
    steps: z.ZodArray<z.ZodObject<{
        /** Stable id within the plan; referenced by other steps' `dependsOn`. */
        id: z.ZodString;
        title: z.ZodString;
        actor: z.ZodEnum<["dev-agent", "qa-pilot", "bug-fix", "gen-pipeline", "person", "skill", "operator"]>;
        /** The concrete action for the actor (a dev-agent task prompt, a pilot
         *  mission, a bug id to fix, a pipeline command, a request to a teammate). */
        action: z.ZodString;
        /** Why this step — grounds it in the project state. */
        rationale: z.ZodString;
        /** For a `person` step: the teammate (email/handle) it's routed to. */
        owner: z.ZodOptional<z.ZodString>;
        /** Ids of steps that must complete first. */
        dependsOn: z.ZodArray<z.ZodString, "many">;
        /** Sources grounding the step (the bug, task, card, commit it addresses). */
        sources: z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
            /** The pointer: a path, narrative card id, commit sha, member email, etc. */
            ref: z.ZodString;
            /** Optional line / section / range within the ref (a file line, a doc heading). */
            locator: z.ZodOptional<z.ZodString>;
            /** Human label ("art review state", "reiska.md — the corruption arc"). */
            label: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }, {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }>, "many">;
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
        status: z.ZodOptional<z.ZodEnum<["pending", "dispatched", "done", "failed", "skipped"]>>;
        /** What the step became once dispatched — the Task / pilot session / bug.
         *  Without it a finished plan is a list of checkmarks with nothing behind
         *  them. */
        dispatchRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodEnum<["task", "session", "bug"]>;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "task" | "session" | "bug";
            id: string;
        }, {
            kind: "task" | "session" | "bug";
            id: string;
        }>>;
        /** Free-text: why it was skipped, or what a manual step actually did. */
        note: z.ZodOptional<z.ZodString>;
        dispatchedAt: z.ZodOptional<z.ZodString>;
        completedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        actor: "person" | "dev-agent" | "qa-pilot" | "bug-fix" | "gen-pipeline" | "skill" | "operator";
        action: string;
        rationale: string;
        dependsOn: string[];
        sources: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }[];
        status?: "pending" | "dispatched" | "done" | "failed" | "skipped" | undefined;
        owner?: string | undefined;
        note?: string | undefined;
        dispatchRef?: {
            kind: "task" | "session" | "bug";
            id: string;
        } | undefined;
        dispatchedAt?: string | undefined;
        completedAt?: string | undefined;
    }, {
        id: string;
        title: string;
        actor: "person" | "dev-agent" | "qa-pilot" | "bug-fix" | "gen-pipeline" | "skill" | "operator";
        action: string;
        rationale: string;
        dependsOn: string[];
        sources: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }[];
        status?: "pending" | "dispatched" | "done" | "failed" | "skipped" | undefined;
        owner?: string | undefined;
        note?: string | undefined;
        dispatchRef?: {
            kind: "task" | "session" | "bug";
            id: string;
        } | undefined;
        dispatchedAt?: string | undefined;
        completedAt?: string | undefined;
    }>, "many">;
    /** What the Captain could NOT plan and is handing back to the operator. */
    unresolved: z.ZodOptional<z.ZodString>;
    /** Stable id; assigned at persist time. Also the spend-correlation key. */
    id: z.ZodOptional<z.ZodString>;
    /** The game this plan belongs to. */
    gameSlug: z.ZodOptional<z.ZodString>;
    /** Rollup of the step statuses — DERIVED, stored only so a list view can
     *  render cheaply. On disagreement the steps win. */
    status: z.ZodOptional<z.ZodEnum<["active", "done", "abandoned"]>>;
    /** Optional grouping anchor — "vertical slice", "alpha", "Thursday build".
     *  Free text with no mechanics in v1; a game project is run as
     *  cross-discipline work converging on a date, and this is the cheapest
     *  honest acknowledgement of that. */
    milestone: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    completedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    intent: string;
    steps: {
        id: string;
        title: string;
        actor: "person" | "dev-agent" | "qa-pilot" | "bug-fix" | "gen-pipeline" | "skill" | "operator";
        action: string;
        rationale: string;
        dependsOn: string[];
        sources: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }[];
        status?: "pending" | "dispatched" | "done" | "failed" | "skipped" | undefined;
        owner?: string | undefined;
        note?: string | undefined;
        dispatchRef?: {
            kind: "task" | "session" | "bug";
            id: string;
        } | undefined;
        dispatchedAt?: string | undefined;
        completedAt?: string | undefined;
    }[];
    status?: "done" | "active" | "abandoned" | undefined;
    id?: string | undefined;
    completedAt?: string | undefined;
    unresolved?: string | undefined;
    gameSlug?: string | undefined;
    milestone?: string | undefined;
    createdAt?: string | undefined;
}, {
    summary: string;
    intent: string;
    steps: {
        id: string;
        title: string;
        actor: "person" | "dev-agent" | "qa-pilot" | "bug-fix" | "gen-pipeline" | "skill" | "operator";
        action: string;
        rationale: string;
        dependsOn: string[];
        sources: {
            kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
            ref: string;
            locator?: string | undefined;
            label?: string | undefined;
        }[];
        status?: "pending" | "dispatched" | "done" | "failed" | "skipped" | undefined;
        owner?: string | undefined;
        note?: string | undefined;
        dispatchRef?: {
            kind: "task" | "session" | "bug";
            id: string;
        } | undefined;
        dispatchedAt?: string | undefined;
        completedAt?: string | undefined;
    }[];
    status?: "done" | "active" | "abandoned" | undefined;
    id?: string | undefined;
    completedAt?: string | undefined;
    unresolved?: string | undefined;
    gameSlug?: string | undefined;
    milestone?: string | undefined;
    createdAt?: string | undefined;
}>;
export type CaptainPlan = z.infer<typeof CaptainPlanSchema>;
/** A plan that has been persisted — every durability field present. The store
 *  hands these to the UI, so components don't null-check what storage
 *  guarantees. */
export type StoredCaptainPlan = CaptainPlan & Required<Pick<CaptainPlan, 'id' | 'gameSlug' | 'status' | 'createdAt'>>;
/** The IC's final structured answer. The trust gate
 *  (apps/workbench/lib/captain) ENFORCES: a non-`unknown` answer carries ≥1
 *  citation grounded in what the tools actually returned; an `unknown` answer
 *  carries a `routedTo`. Cite-or-route — never a bare guess. */
export declare const CaptainAnswerSchema: z.ZodObject<{
    answer: z.ZodString;
    /** Sources backing the answer. Empty ONLY when `unknown` is true. */
    citations: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["file", "card", "manifest", "commit", "doc", "person", "pipeline"]>;
        /** The pointer: a path, narrative card id, commit sha, member email, etc. */
        ref: z.ZodString;
        /** Optional line / section / range within the ref (a file line, a doc heading). */
        locator: z.ZodOptional<z.ZodString>;
        /** Human label ("art review state", "reiska.md — the corruption arc"). */
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }, {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }>, "many">;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    /** True when the IC doesn't know — MUST then carry `routedTo`. */
    unknown: z.ZodBoolean;
    /** Where/who to go to. Required when `unknown`; optional otherwise. */
    routedTo: z.ZodOptional<z.ZodObject<{
        kind: z.ZodEnum<["source", "person"]>;
        /** A source ref (file/doc/manifest) or a member (email/handle). */
        ref: z.ZodString;
        basis: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "person" | "source";
        ref: string;
        basis?: string | undefined;
    }, {
        kind: "person" | "source";
        ref: string;
        basis?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    unknown: boolean;
    answer: string;
    citations: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }[];
    confidence: "high" | "medium" | "low";
    routedTo?: {
        kind: "person" | "source";
        ref: string;
        basis?: string | undefined;
    } | undefined;
}, {
    unknown: boolean;
    answer: string;
    citations: {
        kind: "file" | "card" | "manifest" | "commit" | "doc" | "person" | "pipeline";
        ref: string;
        locator?: string | undefined;
        label?: string | undefined;
    }[];
    confidence: "high" | "medium" | "low";
    routedTo?: {
        kind: "person" | "source";
        ref: string;
        basis?: string | undefined;
    } | undefined;
}>;
export type CaptainAnswer = z.infer<typeof CaptainAnswerSchema>;
//# sourceMappingURL=captain.d.ts.map