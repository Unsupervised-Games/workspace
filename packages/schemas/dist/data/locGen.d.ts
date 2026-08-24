import { z } from 'zod';
/** How a single term is handled during translation. The glossary is
 *  the lever for domain vocabulary an LLM would otherwise "helpfully"
 *  translate or mistranslate — proper nouns (`Komorebi`, `Kodama`),
 *  coined game terms, and words that must render a specific way in a
 *  given locale for consistency with UI already shipped. */
export declare const GlossaryEntrySchema: z.ZodObject<{
    /** Leave this term verbatim in every locale. Proper nouns, brand
     *  names, coined terms. When true, `translations` is ignored. */
    doNotTranslate: z.ZodDefault<z.ZodBoolean>;
    /** Forced per-locale renderings. `{ ja: '巫女', fr: 'prêtresse' }`
     *  pins how `shrine maiden` MUST read in each locale. Locales
     *  absent from this map are translated normally (subject to the
     *  style guide). */
    translations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    /** Author note surfaced to the translator model as guidance —
     *  e.g. "keep the reverent register; this is a sacred title." */
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    doNotTranslate: boolean;
    translations: Record<string, string>;
    note?: string | undefined;
}, {
    note?: string | undefined;
    doNotTranslate?: boolean | undefined;
    translations?: Record<string, string> | undefined;
}>;
export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
/** L3 translation-review config. Optional + opt-in; when omitted the
 *  verification arm never runs. Mirrors `AudioReviewConfigSchema` —
 *  same `judgeProvider` / panel / escalation vocabulary, shared with
 *  the audio + asset pipelines via `@unsupervised/ai-review`.
 *
 *  Note: the DETERMINISTIC placeholder gate (asserting a translation
 *  preserves the source's ICU argument set) always runs regardless of
 *  this config — it needs no model and catches the highest-risk
 *  failure for free. This config governs only the INTERPRETIVE judge
 *  (meaning fidelity + naturalness of register). */
export declare const LocReviewConfigSchema: z.ZodObject<{
    /** Master switch for the interpretive judge. Default OFF. */
    enabled: z.ZodDefault<z.ZodBoolean>;
    /** In-forge posture on a `fail` verdict:
     *    - `'flag'`  — record the verdict, change nothing (default).
     *    - `'retry'` — re-translate the SAME key up to
     *      `maxAttemptsPerKey`, feeding the judge's rationale back as
     *      guidance (for non-deterministic model output). */
    failVerdictAction: z.ZodDefault<z.ZodEnum<["flag", "retry"]>>;
    /** Max translation attempts per key the retry loop may make.
     *  Bounds the loop alongside the budget cap. */
    maxAttemptsPerKey: z.ZodDefault<z.ZodNumber>;
    /** Judge model for the perceptual criterion. Defaults to
     *  `claude-sonnet-5` — the cost/quality sweet spot for a
     *  high-volume text-classify task. */
    judgeModel: z.ZodDefault<z.ZodString>;
    /** How the judge reaches Claude — matches audio-gen:
     *    - `'claude-cli'` — spawn the `claude` CLI (subscription-billed,
     *      no api key).
     *    - `'api'` — direct Anthropic call (needs `ANTHROPIC_API_KEY`).
     *    - `'auto'` (default) — CLI when `claude` resolves on PATH, else
     *      the API key. */
    judgeProvider: z.ZodDefault<z.ZodEnum<["auto", "api", "claude-cli"]>>;
    /** Path to the `claude` binary. Empty = resolve from PATH. */
    claudeCliPath: z.ZodOptional<z.ZodString>;
    /** Flag a bare `concern` verdict (or a degraded judge) for human
     *  review — the confidence-gated escalation surfaced in the
     *  approval `queue` as `needs-review`. Shared with the audio + asset
     *  pipelines via `@unsupervised/ai-review`'s `computeEscalation`. */
    escalateConcern: z.ZodDefault<z.ZodBoolean>;
    /** N-vote judge panel. A single judge is uncalibrated; a panel runs
     *  `jurors` independent votes (each on a distinct lens when
     *  `diverseLenses`), takes the majority, and escalates a split
     *  below `escalateBelowAgreement`. `jurors: 1` (default) is the
     *  single-vote behavior. Billed per juror. Aggregation shared via
     *  `@unsupervised/ai-review`. */
    panel: z.ZodDefault<z.ZodObject<{
        jurors: z.ZodDefault<z.ZodNumber>;
        diverseLenses: z.ZodDefault<z.ZodBoolean>;
        escalateBelowAgreement: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        jurors: number;
        diverseLenses: boolean;
        escalateBelowAgreement: number;
    }, {
        jurors?: number | undefined;
        diverseLenses?: boolean | undefined;
        escalateBelowAgreement?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    failVerdictAction: "flag" | "retry";
    judgeModel: string;
    judgeProvider: "auto" | "api" | "claude-cli";
    escalateConcern: boolean;
    panel: {
        jurors: number;
        diverseLenses: boolean;
        escalateBelowAgreement: number;
    };
    maxAttemptsPerKey: number;
    claudeCliPath?: string | undefined;
}, {
    enabled?: boolean | undefined;
    failVerdictAction?: "flag" | "retry" | undefined;
    judgeModel?: string | undefined;
    judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
    claudeCliPath?: string | undefined;
    escalateConcern?: boolean | undefined;
    panel?: {
        jurors?: number | undefined;
        diverseLenses?: boolean | undefined;
        escalateBelowAgreement?: number | undefined;
    } | undefined;
    maxAttemptsPerKey?: number | undefined;
}>;
export type LocReviewConfig = z.infer<typeof LocReviewConfigSchema>;
/** One target locale to generate. Carries the runtime `LocaleConfig`
 *  the emitted bundle needs (label, direction, fallbacks) plus an
 *  optional per-locale style guide layered on top of the project one. */
export declare const TargetLocaleSchema: z.ZodObject<{
    config: z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        direction: z.ZodEnum<["ltr", "rtl", "auto"]>;
        fallbacks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        direction: "ltr" | "rtl" | "auto";
        fallbacks: string[];
    }, {
        id: string;
        label: string;
        direction: "ltr" | "rtl" | "auto";
        fallbacks?: string[] | undefined;
    }>;
    /** Per-locale translation art-direction, appended AFTER the
     *  project-wide `styleGuide`. The place to encode formality /
     *  register decisions specific to one language — e.g. for `ja`:
     *  "use 敬語 for shrine dialogue; plain form for combat barks." */
    styleGuide: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    config: {
        id: string;
        label: string;
        direction: "ltr" | "rtl" | "auto";
        fallbacks: string[];
    };
    styleGuide?: string | undefined;
}, {
    config: {
        id: string;
        label: string;
        direction: "ltr" | "rtl" | "auto";
        fallbacks?: string[] | undefined;
    };
    styleGuide?: string | undefined;
}>;
export type TargetLocale = z.infer<typeof TargetLocaleSchema>;
/** Per-game loc-gen config. Authored as `games/<game>/loc-gen.config.ts`
 *  and annotated with `LocGenConfigInput` so defaults may be omitted.
 *  Mirrors `AudioStyleConfig`'s governance fields exactly (budget caps,
 *  lifetime ceiling, spend authorization, banned terms) so a
 *  `budgetLifetimeUsd` cap + an `authorize --up-to` grant bound this
 *  pipeline the same way they bound the other two — one implementation
 *  in `@unsupervised/gen-core`. */
export declare const LocGenConfigSchema: z.ZodObject<{
    /** The hand-authored catalog every target translates FROM. */
    sourceLocale: z.ZodDefault<z.ZodString>;
    /** The locales to generate. Empty = the pipeline no-ops. */
    targetLocales: z.ZodDefault<z.ZodArray<z.ZodObject<{
        config: z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            direction: z.ZodEnum<["ltr", "rtl", "auto"]>;
            fallbacks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks: string[];
        }, {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks?: string[] | undefined;
        }>;
        /** Per-locale translation art-direction, appended AFTER the
         *  project-wide `styleGuide`. The place to encode formality /
         *  register decisions specific to one language — e.g. for `ja`:
         *  "use 敬語 for shrine dialogue; plain form for combat barks." */
        styleGuide: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks: string[];
        };
        styleGuide?: string | undefined;
    }, {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks?: string[] | undefined;
        };
        styleGuide?: string | undefined;
    }>, "many">>;
    /** Translation model id. Defaults to `claude-sonnet-5` — strong
     *  multilingual quality at a high-volume-friendly output cost. */
    model: z.ZodDefault<z.ZodString>;
    /** Project-wide translation art-direction, prepended to every
     *  translation request (the loc-gen analogue of audio's
     *  `stylePrefix`). Participates in the cache hash — editing it
     *  re-translates every unlocked key deliberately. Example for
     *  komorebi: "Preserve the melancholic, folkloric register.
     *  Period-appropriate diction; no modern slang or loanwords." */
    styleGuide: z.ZodDefault<z.ZodString>;
    /** Domain vocabulary handling, keyed by the source term. */
    glossary: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        /** Leave this term verbatim in every locale. Proper nouns, brand
         *  names, coined terms. When true, `translations` is ignored. */
        doNotTranslate: z.ZodDefault<z.ZodBoolean>;
        /** Forced per-locale renderings. `{ ja: '巫女', fr: 'prêtresse' }`
         *  pins how `shrine maiden` MUST read in each locale. Locales
         *  absent from this map are translated normally (subject to the
         *  style guide). */
        translations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
        /** Author note surfaced to the translator model as guidance —
         *  e.g. "keep the reverent register; this is a sacred title." */
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        doNotTranslate: boolean;
        translations: Record<string, string>;
        note?: string | undefined;
    }, {
        note?: string | undefined;
        doNotTranslate?: boolean | undefined;
        translations?: Record<string, string> | undefined;
    }>>>;
    /** Soft cap on per-run spend (USD). Projected cost crossing it
     *  WARNS but continues. */
    budgetSoftUsd: z.ZodDefault<z.ZodNumber>;
    /** Hard cap on per-run spend (USD). Aborts the run when a key's
     *  projected cost would push the session past it. */
    budgetHardUsd: z.ZodDefault<z.ZodNumber>;
    /** LIFETIME spend ceiling (USD) — cumulative across every run,
     *  summed from the audit log. Undefined ⇒ no lifetime cap. The
     *  AI-pilot backstop; shared via `@unsupervised/gen-core`'s spend
     *  guardrails. */
    budgetLifetimeUsd: z.ZodOptional<z.ZodNumber>;
    /** Require an explicit, bounded, unexpired spend authorization
     *  before any translation call (the propose-approve gate). Off by
     *  default (human-driven runs spend freely); turn on for
     *  autonomous / CI contexts. Granted via
     *  `loc-gen authorize --up-to <usd>`. */
    requireSpendAuthorization: z.ZodDefault<z.ZodBoolean>;
    /** Project-wide banned-term list. A translated string containing
     *  any of these is rejected (`translation-rejected`) before it
     *  reaches the output — the L1 content gate. Checked on OUTPUT (the
     *  translation), since the source is author-controlled. */
    bannedTerms: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** L3-review config. Optional + opt-in; omitted ⇒ the interpretive
     *  judge never runs (the deterministic placeholder gate still
     *  does). See `LocReviewConfigSchema`. */
    review: z.ZodOptional<z.ZodObject<{
        /** Master switch for the interpretive judge. Default OFF. */
        enabled: z.ZodDefault<z.ZodBoolean>;
        /** In-forge posture on a `fail` verdict:
         *    - `'flag'`  — record the verdict, change nothing (default).
         *    - `'retry'` — re-translate the SAME key up to
         *      `maxAttemptsPerKey`, feeding the judge's rationale back as
         *      guidance (for non-deterministic model output). */
        failVerdictAction: z.ZodDefault<z.ZodEnum<["flag", "retry"]>>;
        /** Max translation attempts per key the retry loop may make.
         *  Bounds the loop alongside the budget cap. */
        maxAttemptsPerKey: z.ZodDefault<z.ZodNumber>;
        /** Judge model for the perceptual criterion. Defaults to
         *  `claude-sonnet-5` — the cost/quality sweet spot for a
         *  high-volume text-classify task. */
        judgeModel: z.ZodDefault<z.ZodString>;
        /** How the judge reaches Claude — matches audio-gen:
         *    - `'claude-cli'` — spawn the `claude` CLI (subscription-billed,
         *      no api key).
         *    - `'api'` — direct Anthropic call (needs `ANTHROPIC_API_KEY`).
         *    - `'auto'` (default) — CLI when `claude` resolves on PATH, else
         *      the API key. */
        judgeProvider: z.ZodDefault<z.ZodEnum<["auto", "api", "claude-cli"]>>;
        /** Path to the `claude` binary. Empty = resolve from PATH. */
        claudeCliPath: z.ZodOptional<z.ZodString>;
        /** Flag a bare `concern` verdict (or a degraded judge) for human
         *  review — the confidence-gated escalation surfaced in the
         *  approval `queue` as `needs-review`. Shared with the audio + asset
         *  pipelines via `@unsupervised/ai-review`'s `computeEscalation`. */
        escalateConcern: z.ZodDefault<z.ZodBoolean>;
        /** N-vote judge panel. A single judge is uncalibrated; a panel runs
         *  `jurors` independent votes (each on a distinct lens when
         *  `diverseLenses`), takes the majority, and escalates a split
         *  below `escalateBelowAgreement`. `jurors: 1` (default) is the
         *  single-vote behavior. Billed per juror. Aggregation shared via
         *  `@unsupervised/ai-review`. */
        panel: z.ZodDefault<z.ZodObject<{
            jurors: z.ZodDefault<z.ZodNumber>;
            diverseLenses: z.ZodDefault<z.ZodBoolean>;
            escalateBelowAgreement: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            jurors: number;
            diverseLenses: boolean;
            escalateBelowAgreement: number;
        }, {
            jurors?: number | undefined;
            diverseLenses?: boolean | undefined;
            escalateBelowAgreement?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        failVerdictAction: "flag" | "retry";
        judgeModel: string;
        judgeProvider: "auto" | "api" | "claude-cli";
        escalateConcern: boolean;
        panel: {
            jurors: number;
            diverseLenses: boolean;
            escalateBelowAgreement: number;
        };
        maxAttemptsPerKey: number;
        claudeCliPath?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        failVerdictAction?: "flag" | "retry" | undefined;
        judgeModel?: string | undefined;
        judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
        claudeCliPath?: string | undefined;
        escalateConcern?: boolean | undefined;
        panel?: {
            jurors?: number | undefined;
            diverseLenses?: boolean | undefined;
            escalateBelowAgreement?: number | undefined;
        } | undefined;
        maxAttemptsPerKey?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    model: string;
    budgetSoftUsd: number;
    budgetHardUsd: number;
    requireSpendAuthorization: boolean;
    bannedTerms: string[];
    styleGuide: string;
    sourceLocale: string;
    targetLocales: {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks: string[];
        };
        styleGuide?: string | undefined;
    }[];
    glossary: Record<string, {
        doNotTranslate: boolean;
        translations: Record<string, string>;
        note?: string | undefined;
    }>;
    budgetLifetimeUsd?: number | undefined;
    review?: {
        enabled: boolean;
        failVerdictAction: "flag" | "retry";
        judgeModel: string;
        judgeProvider: "auto" | "api" | "claude-cli";
        escalateConcern: boolean;
        panel: {
            jurors: number;
            diverseLenses: boolean;
            escalateBelowAgreement: number;
        };
        maxAttemptsPerKey: number;
        claudeCliPath?: string | undefined;
    } | undefined;
}, {
    model?: string | undefined;
    budgetSoftUsd?: number | undefined;
    budgetHardUsd?: number | undefined;
    budgetLifetimeUsd?: number | undefined;
    requireSpendAuthorization?: boolean | undefined;
    bannedTerms?: string[] | undefined;
    review?: {
        enabled?: boolean | undefined;
        failVerdictAction?: "flag" | "retry" | undefined;
        judgeModel?: string | undefined;
        judgeProvider?: "auto" | "api" | "claude-cli" | undefined;
        claudeCliPath?: string | undefined;
        escalateConcern?: boolean | undefined;
        panel?: {
            jurors?: number | undefined;
            diverseLenses?: boolean | undefined;
            escalateBelowAgreement?: number | undefined;
        } | undefined;
        maxAttemptsPerKey?: number | undefined;
    } | undefined;
    styleGuide?: string | undefined;
    sourceLocale?: string | undefined;
    targetLocales?: {
        config: {
            id: string;
            label: string;
            direction: "ltr" | "rtl" | "auto";
            fallbacks?: string[] | undefined;
        };
        styleGuide?: string | undefined;
    }[] | undefined;
    glossary?: Record<string, {
        note?: string | undefined;
        doNotTranslate?: boolean | undefined;
        translations?: Record<string, string> | undefined;
    }> | undefined;
}>;
export type LocGenConfig = z.infer<typeof LocGenConfigSchema>;
/** Input variant — every default-bearing field optional. Authors
 *  annotate `games/<game>/loc-gen.config.ts` with this. */
export type LocGenConfigInput = z.input<typeof LocGenConfigSchema>;
/** Shared review verdict vocabulary, re-declared here so the schema
 *  layer doesn't depend on `@unsupervised/ai-review`. Identical values. */
export declare const LocVerdictSchema: z.ZodEnum<["pass", "concern", "fail"]>;
export type LocVerdict = z.infer<typeof LocVerdictSchema>;
/** Per-key provenance record on the sidecar. One entry per
 *  translated key. */
export declare const LocGenKeyRecordSchema: z.ZodObject<{
    /** The cache hash this translation was produced under. Stale when
     *  the recomputed hash differs (source / style / glossary drift). */
    sourceHash: z.ZodString;
    /** ISO timestamp of the generation that produced the shipped text. */
    translatedAt: z.ZodString;
    /** Cost in USD attributed to this key's most recent translation.
     *  Zero for cache hits. */
    costUsd: z.ZodDefault<z.ZodNumber>;
    /** When true, this key is PINNED: the pipeline will not
     *  re-translate it even if the source drifts — the analogue of an
     *  audio sidecar's `lockedHash`. Set by `loc-gen approve`. */
    locked: z.ZodDefault<z.ZodBoolean>;
    /** Most recent L3 verdict for this key, when the interpretive judge
     *  ran. */
    verdict: z.ZodOptional<z.ZodEnum<["pass", "concern", "fail"]>>;
}, "strip", z.ZodTypeAny, {
    costUsd: number;
    sourceHash: string;
    translatedAt: string;
    locked: boolean;
    verdict?: "pass" | "concern" | "fail" | undefined;
}, {
    sourceHash: string;
    translatedAt: string;
    costUsd?: number | undefined;
    verdict?: "pass" | "concern" | "fail" | undefined;
    locked?: boolean | undefined;
}>;
export type LocGenKeyRecord = z.infer<typeof LocGenKeyRecordSchema>;
/** The generation sidecar written alongside each emitted
 *  `<locale>.json`. Provenance + lock ledger; NOT consumed by the
 *  runtime (the runtime reads only the emitted `LocaleBundle`). */
export declare const LocGenSidecarSchema: z.ZodObject<{
    locale: z.ZodString;
    sourceLocale: z.ZodString;
    /** Per-key provenance, keyed by translation key. */
    keys: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        /** The cache hash this translation was produced under. Stale when
         *  the recomputed hash differs (source / style / glossary drift). */
        sourceHash: z.ZodString;
        /** ISO timestamp of the generation that produced the shipped text. */
        translatedAt: z.ZodString;
        /** Cost in USD attributed to this key's most recent translation.
         *  Zero for cache hits. */
        costUsd: z.ZodDefault<z.ZodNumber>;
        /** When true, this key is PINNED: the pipeline will not
         *  re-translate it even if the source drifts — the analogue of an
         *  audio sidecar's `lockedHash`. Set by `loc-gen approve`. */
        locked: z.ZodDefault<z.ZodBoolean>;
        /** Most recent L3 verdict for this key, when the interpretive judge
         *  ran. */
        verdict: z.ZodOptional<z.ZodEnum<["pass", "concern", "fail"]>>;
    }, "strip", z.ZodTypeAny, {
        costUsd: number;
        sourceHash: string;
        translatedAt: string;
        locked: boolean;
        verdict?: "pass" | "concern" | "fail" | undefined;
    }, {
        sourceHash: string;
        translatedAt: string;
        costUsd?: number | undefined;
        verdict?: "pass" | "concern" | "fail" | undefined;
        locked?: boolean | undefined;
    }>>>;
    /** ISO timestamp of the most recent generation touching this
     *  locale. */
    lastGeneratedAt: z.ZodOptional<z.ZodString>;
    /** Cumulative USD spent generating this locale across all runs. */
    totalCostUsd: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    keys: Record<string, {
        costUsd: number;
        sourceHash: string;
        translatedAt: string;
        locked: boolean;
        verdict?: "pass" | "concern" | "fail" | undefined;
    }>;
    totalCostUsd: number;
    sourceLocale: string;
    locale: string;
    lastGeneratedAt?: string | undefined;
}, {
    sourceLocale: string;
    locale: string;
    keys?: Record<string, {
        sourceHash: string;
        translatedAt: string;
        costUsd?: number | undefined;
        verdict?: "pass" | "concern" | "fail" | undefined;
        locked?: boolean | undefined;
    }> | undefined;
    lastGeneratedAt?: string | undefined;
    totalCostUsd?: number | undefined;
}>;
export type LocGenSidecar = z.infer<typeof LocGenSidecarSchema>;
/** Approval-ledger entry — the human sign-off record, per locale.
 *  Mirrors the audio / asset approval shape. `slot` is the locale id
 *  (approval is per-locale: you review a locale's translations
 *  together and sign the whole set off, which pins every non-rejected
 *  key on the sidecar). Shared ledger machinery via `@unsupervised/gen-core`. */
export declare const LocApprovalEntrySchema: z.ZodObject<{
    /** The locale id being signed off. */
    slot: z.ZodString;
    status: z.ZodEnum<["approved", "rejected"]>;
    /** Who signed off (optional attribution). */
    who: z.ZodOptional<z.ZodString>;
    at: z.ZodString;
    /** Rationale — required by convention on a `reject`. */
    note: z.ZodOptional<z.ZodString>;
    /** Count of keys locked at approval time (provenance). */
    keyCount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    at: string;
    status: "approved" | "rejected";
    slot: string;
    keyCount: number;
    note?: string | undefined;
    who?: string | undefined;
}, {
    at: string;
    status: "approved" | "rejected";
    slot: string;
    note?: string | undefined;
    who?: string | undefined;
    keyCount?: number | undefined;
}>;
export type LocApprovalEntry = z.infer<typeof LocApprovalEntrySchema>;
/** The on-disk ledger wrapper (`.loc-gen-approvals.json`). Shape
 *  matches `@unsupervised/gen-core`'s `ApprovalLedger<E>`. */
export declare const LocApprovalLedgerSchema: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<1>>;
    entries: z.ZodDefault<z.ZodArray<z.ZodObject<{
        /** The locale id being signed off. */
        slot: z.ZodString;
        status: z.ZodEnum<["approved", "rejected"]>;
        /** Who signed off (optional attribution). */
        who: z.ZodOptional<z.ZodString>;
        at: z.ZodString;
        /** Rationale — required by convention on a `reject`. */
        note: z.ZodOptional<z.ZodString>;
        /** Count of keys locked at approval time (provenance). */
        keyCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        at: string;
        status: "approved" | "rejected";
        slot: string;
        keyCount: number;
        note?: string | undefined;
        who?: string | undefined;
    }, {
        at: string;
        status: "approved" | "rejected";
        slot: string;
        note?: string | undefined;
        who?: string | undefined;
        keyCount?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    entries: {
        at: string;
        status: "approved" | "rejected";
        slot: string;
        keyCount: number;
        note?: string | undefined;
        who?: string | undefined;
    }[];
    schemaVersion: 1;
}, {
    entries?: {
        at: string;
        status: "approved" | "rejected";
        slot: string;
        note?: string | undefined;
        who?: string | undefined;
        keyCount?: number | undefined;
    }[] | undefined;
    schemaVersion?: 1 | undefined;
}>;
export type LocApprovalLedger = z.infer<typeof LocApprovalLedgerSchema>;
//# sourceMappingURL=locGen.d.ts.map