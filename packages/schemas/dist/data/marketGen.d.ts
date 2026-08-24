import { z } from 'zod';
export declare const StoreTargetSchema: z.ZodEnum<["steam", "google-play", "apple-app-store"]>;
export type StoreTarget = z.infer<typeof StoreTargetSchema>;
/** The real creative constraints for one store. The compliance gate
 *  reads these; a generated field outside them is rejected. */
export declare const StoreSpecSchema: z.ZodObject<{
    store: z.ZodEnum<["steam", "google-play", "apple-app-store"]>;
    /** Human label for reports. */
    label: z.ZodString;
    /** Store name / app title character budget. */
    title: z.ZodObject<{
        max: z.ZodNumber;
        min: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
    }, {
        max: number;
        min?: number | undefined;
    }>;
    /** Subtitle (App Store) — null when the store has none. */
    subtitle: z.ZodNullable<z.ZodObject<{
        max: z.ZodNumber;
        min: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
    }, {
        max: number;
        min?: number | undefined;
    }>>;
    /** Short / promo description (Play 80, Steam short 300) — null when none. */
    shortDescription: z.ZodNullable<z.ZodObject<{
        max: z.ZodNumber;
        min: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
    }, {
        max: number;
        min?: number | undefined;
    }>>;
    /** Full description character budget. */
    longDescription: z.ZodObject<{
        max: z.ZodNumber;
        min: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
    }, {
        max: number;
        min?: number | undefined;
    }>;
    /** Number of tags / keywords allowed. */
    tags: z.ZodObject<{
        max: z.ZodNumber;
        min: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
    }, {
        max: number;
        min?: number | undefined;
    }>;
    /** Allowed screenshot count range. */
    screenshots: z.ZodObject<{
        max: z.ZodNumber;
        min: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
    }, {
        max: number;
        min?: number | undefined;
    }>;
    /** Icon / primary-capsule pixel dimensions `[w, h]` (null = store uses
     *  a capsule rather than a square icon; Steam). */
    icon: z.ZodNullable<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    /** Feature graphic / hero capsule dimensions `[w, h]` (null = none). */
    featureGraphic: z.ZodNullable<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, "strip", z.ZodTypeAny, {
    tags: {
        max: number;
        min: number;
    };
    label: string;
    title: {
        max: number;
        min: number;
    };
    store: "steam" | "google-play" | "apple-app-store";
    subtitle: {
        max: number;
        min: number;
    } | null;
    shortDescription: {
        max: number;
        min: number;
    } | null;
    longDescription: {
        max: number;
        min: number;
    };
    screenshots: {
        max: number;
        min: number;
    };
    icon: [number, number] | null;
    featureGraphic: [number, number] | null;
}, {
    tags: {
        max: number;
        min?: number | undefined;
    };
    label: string;
    title: {
        max: number;
        min?: number | undefined;
    };
    store: "steam" | "google-play" | "apple-app-store";
    subtitle: {
        max: number;
        min?: number | undefined;
    } | null;
    shortDescription: {
        max: number;
        min?: number | undefined;
    } | null;
    longDescription: {
        max: number;
        min?: number | undefined;
    };
    screenshots: {
        max: number;
        min?: number | undefined;
    };
    icon: [number, number] | null;
    featureGraphic: [number, number] | null;
}>;
export type StoreSpec = z.infer<typeof StoreSpecSchema>;
/** Curated real-world store specs (2026). The single source of truth
 *  for the compliance gate + the copy-generation length budgets. */
export declare const STORE_SPECS: Record<StoreTarget, StoreSpec>;
/** The game concept the store page sells — the grounding. Drawn from the
 *  narrative overview + design brief; hand-authored or skill-grounded. */
export declare const GameConceptSchema: z.ZodObject<{
    name: z.ZodString;
    /** One-line hook / logline. */
    pitch: z.ZodString;
    /** Longer premise the copy can draw on. */
    premise: z.ZodDefault<z.ZodString>;
    /** Genre / positioning tags (Souls-like, roguelite, cozy…). */
    genres: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Comparable titles ("for fans of …"). */
    comparables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Tone words for the copy register. */
    tone: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    pitch: string;
    premise: string;
    genres: string[];
    comparables: string[];
    tone: string[];
}, {
    name: string;
    pitch: string;
    premise?: string | undefined;
    genres?: string[] | undefined;
    comparables?: string[] | undefined;
    tone?: string[] | undefined;
}>;
export type GameConcept = z.infer<typeof GameConceptSchema>;
/** A synthetic-audience persona — one juror in the panel. */
export declare const AudiencePersonaSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    /** Who they are + what they buy + what turns them off. */
    description: z.ZodString;
    /** Genres they lean toward (weights the score). */
    genreAffinity: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    label: string;
    genreAffinity: string[];
}, {
    description: string;
    id: string;
    label: string;
    genreAffinity?: string[] | undefined;
}>;
export type AudiencePersona = z.infer<typeof AudiencePersonaSchema>;
export declare const MarketGenConfigSchema: z.ZodObject<{
    concept: z.ZodObject<{
        name: z.ZodString;
        /** One-line hook / logline. */
        pitch: z.ZodString;
        /** Longer premise the copy can draw on. */
        premise: z.ZodDefault<z.ZodString>;
        /** Genre / positioning tags (Souls-like, roguelite, cozy…). */
        genres: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Comparable titles ("for fans of …"). */
        comparables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Tone words for the copy register. */
        tone: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        pitch: string;
        premise: string;
        genres: string[];
        comparables: string[];
        tone: string[];
    }, {
        name: string;
        pitch: string;
        premise?: string | undefined;
        genres?: string[] | undefined;
        comparables?: string[] | undefined;
        tone?: string[] | undefined;
    }>;
    /** Stores to build variants for. */
    stores: z.ZodArray<z.ZodEnum<["steam", "google-play", "apple-app-store"]>, "many">;
    /** How many copy variants to generate per store (the A/B breadth). */
    variantsPerStore: z.ZodDefault<z.ZodNumber>;
    /** The synthetic audience panel. */
    personas: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        /** Who they are + what they buy + what turns them off. */
        description: z.ZodString;
        /** Genres they lean toward (weights the score). */
        genreAffinity: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        id: string;
        label: string;
        genreAffinity: string[];
    }, {
        description: string;
        id: string;
        label: string;
        genreAffinity?: string[] | undefined;
    }>, "many">;
    /** LLM model for copy generation. */
    copyModel: z.ZodDefault<z.ZodString>;
    /** LLM model for the audience judge. */
    judgeModel: z.ZodDefault<z.ZodString>;
    /** How the judge/copy calls reach Claude. */
    provider: z.ZodDefault<z.ZodEnum<["auto", "api", "claude-cli"]>>;
    claudeCliPath: z.ZodOptional<z.ZodString>;
    /** Governance — same shape as the sibling pipelines. */
    budgetSoftUsd: z.ZodDefault<z.ZodNumber>;
    budgetHardUsd: z.ZodDefault<z.ZodNumber>;
    budgetLifetimeUsd: z.ZodOptional<z.ZodNumber>;
    requireSpendAuthorization: z.ZodDefault<z.ZodBoolean>;
    /** L1 banned-term filter over generated copy. */
    bannedTerms: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Genre benchmark CTR (CTA clicks ÷ impressions, 0–1) the Phase-2a
     *  go/no-go decision compares the measured winner against. Undefined ⇒
     *  the report ranks + tests significance but makes no go/no-go call. */
    benchmarkCtr: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    provider: "auto" | "api" | "claude-cli";
    concept: {
        name: string;
        pitch: string;
        premise: string;
        genres: string[];
        comparables: string[];
        tone: string[];
    };
    judgeModel: string;
    budgetSoftUsd: number;
    budgetHardUsd: number;
    requireSpendAuthorization: boolean;
    bannedTerms: string[];
    stores: ("steam" | "google-play" | "apple-app-store")[];
    variantsPerStore: number;
    personas: {
        description: string;
        id: string;
        label: string;
        genreAffinity: string[];
    }[];
    copyModel: string;
    claudeCliPath?: string | undefined;
    budgetLifetimeUsd?: number | undefined;
    benchmarkCtr?: number | undefined;
}, {
    concept: {
        name: string;
        pitch: string;
        premise?: string | undefined;
        genres?: string[] | undefined;
        comparables?: string[] | undefined;
        tone?: string[] | undefined;
    };
    stores: ("steam" | "google-play" | "apple-app-store")[];
    personas: {
        description: string;
        id: string;
        label: string;
        genreAffinity?: string[] | undefined;
    }[];
    provider?: "auto" | "api" | "claude-cli" | undefined;
    judgeModel?: string | undefined;
    claudeCliPath?: string | undefined;
    budgetSoftUsd?: number | undefined;
    budgetHardUsd?: number | undefined;
    budgetLifetimeUsd?: number | undefined;
    requireSpendAuthorization?: boolean | undefined;
    bannedTerms?: string[] | undefined;
    variantsPerStore?: number | undefined;
    copyModel?: string | undefined;
    benchmarkCtr?: number | undefined;
}>;
export type MarketGenConfig = z.infer<typeof MarketGenConfigSchema>;
export type MarketGenConfigInput = z.input<typeof MarketGenConfigSchema>;
/** The generated copy fields for one store-page variant. Art (icon /
 *  screenshots) is referenced by asset-gen SLOT id — the operator
 *  generates the images via asset-gen; this pipeline composes + tests
 *  the listing around them. */
export declare const StorePageVariantSchema: z.ZodObject<{
    id: z.ZodString;
    store: z.ZodEnum<["steam", "google-play", "apple-app-store"]>;
    title: z.ZodString;
    subtitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    shortDescription: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    longDescription: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** asset-gen slot references for the visual creative (optional in
     *  Phase 1 — copy can be tested before art exists). */
    iconSlot: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    screenshotSlots: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    featureGraphicSlot: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tags: string[];
    title: string;
    store: "steam" | "google-play" | "apple-app-store";
    subtitle: string | null;
    shortDescription: string | null;
    longDescription: string;
    iconSlot: string | null;
    screenshotSlots: string[];
    featureGraphicSlot: string | null;
}, {
    id: string;
    title: string;
    store: "steam" | "google-play" | "apple-app-store";
    longDescription: string;
    tags?: string[] | undefined;
    subtitle?: string | null | undefined;
    shortDescription?: string | null | undefined;
    iconSlot?: string | null | undefined;
    screenshotSlots?: string[] | undefined;
    featureGraphicSlot?: string | null | undefined;
}>;
export type StorePageVariant = z.infer<typeof StorePageVariantSchema>;
/** One persona's read on one variant. */
export declare const VariantScoreSchema: z.ZodObject<{
    variantId: z.ZodString;
    personaId: z.ZodString;
    /** 0–100 predicted appeal for this persona. */
    appeal: z.ZodNumber;
    /** Would this persona click the CTA (Wishlist / Get)? */
    wouldClick: z.ZodBoolean;
    rationale: z.ZodString;
}, "strip", z.ZodTypeAny, {
    variantId: string;
    personaId: string;
    appeal: number;
    wouldClick: boolean;
    rationale: string;
}, {
    variantId: string;
    personaId: string;
    appeal: number;
    wouldClick: boolean;
    rationale: string;
}>;
export type VariantScore = z.infer<typeof VariantScoreSchema>;
/** A variant's aggregated standing across the whole panel. */
export declare const VariantRankingSchema: z.ZodObject<{
    variantId: z.ZodString;
    meanAppeal: z.ZodNumber;
    medianAppeal: z.ZodNumber;
    /** Fraction of personas who would click (a synthetic CTR proxy). */
    clickRate: z.ZodNumber;
    rank: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    variantId: string;
    meanAppeal: number;
    medianAppeal: number;
    clickRate: number;
    rank: number;
}, {
    variantId: string;
    meanAppeal: number;
    medianAppeal: number;
    clickRate: number;
    rank: number;
}>;
export type VariantRanking = z.infer<typeof VariantRankingSchema>;
export declare const MarketValidationReportSchema: z.ZodObject<{
    /** The A/B test run this synthetic prediction belongs to (present once
     *  minted by `generate`; older reports may omit it). */
    experimentId: z.ZodOptional<z.ZodString>;
    game: z.ZodOptional<z.ZodString>;
    store: z.ZodEnum<["steam", "google-play", "apple-app-store"]>;
    personaCount: z.ZodNumber;
    rankings: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        meanAppeal: z.ZodNumber;
        medianAppeal: z.ZodNumber;
        /** Fraction of personas who would click (a synthetic CTR proxy). */
        clickRate: z.ZodNumber;
        rank: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        variantId: string;
        meanAppeal: number;
        medianAppeal: number;
        clickRate: number;
        rank: number;
    }, {
        variantId: string;
        meanAppeal: number;
        medianAppeal: number;
        clickRate: number;
        rank: number;
    }>, "many">;
    /** Winning variant id (highest rank), or null when no variant scored. */
    winnerId: z.ZodNullable<z.ZodString>;
    costUsd: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    costUsd: number;
    store: "steam" | "google-play" | "apple-app-store";
    personaCount: number;
    rankings: {
        variantId: string;
        meanAppeal: number;
        medianAppeal: number;
        clickRate: number;
        rank: number;
    }[];
    winnerId: string | null;
    experimentId?: string | undefined;
    game?: string | undefined;
}, {
    costUsd: number;
    store: "steam" | "google-play" | "apple-app-store";
    personaCount: number;
    rankings: {
        variantId: string;
        meanAppeal: number;
        medianAppeal: number;
        clickRate: number;
        rank: number;
    }[];
    winnerId: string | null;
    experimentId?: string | undefined;
    game?: string | undefined;
}>;
export type MarketValidationReport = z.infer<typeof MarketValidationReportSchema>;
/** The manifest for one A/B test run — written by `generate` (or minted
 *  standalone), read by `render` (to stamp `data-mkt-experiment` into each
 *  page) + `report` / `calibrate` (to scope the event query to this test).
 *  This is what makes "which A/B test is running" a first-class, queryable
 *  fact rather than an inference from filenames. */
export declare const MarketExperimentSchema: z.ZodObject<{
    /** Stable id for this run — default `<game>-<YYYYMMDD>` (a same-day
     *  re-run gets a `-N` suffix so it never silently merges). */
    experimentId: z.ZodString;
    game: z.ZodString;
    createdAt: z.ZodString;
    stores: z.ZodArray<z.ZodEnum<["steam", "google-play", "apple-app-store"]>, "many">;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    stores: ("steam" | "google-play" | "apple-app-store")[];
    experimentId: string;
    game: string;
}, {
    createdAt: string;
    stores: ("steam" | "google-play" | "apple-app-store")[];
    experimentId: string;
    game: string;
}>;
export type MarketExperiment = z.infer<typeof MarketExperimentSchema>;
/** The funnel events a hosted mock page reports back. */
export declare const MarketTestEventKindSchema: z.ZodEnum<["impression", "page-view", "scroll-50", "cta-click", "wishlist-capture"]>;
export type MarketTestEventKind = z.infer<typeof MarketTestEventKindSchema>;
/** One collected event, attributed to an A/B TEST + a variant + traffic
 *  source. The identity tuple is `(experimentId, store, variantId)`:
 *  `experimentId` scopes the whole test run so two concurrent tests — or
 *  a re-run of the same game months later — never contaminate each
 *  other's tallies; `store` is part of the key because each store is its
 *  own A/B group; `variantId` is only unique WITHIN an experiment+store.
 *  The `@unsupervised/analytics` beacon stamps every field from the page's
 *  `data-mkt-*` attributes + the landing URL's UTM params, so the
 *  visitor's browser never chooses any of them. */
export declare const MarketTestEventSchema: z.ZodObject<{
    /** The A/B test run this event belongs to. Minted at `generate` time,
     *  injected into each page, echoed back on every event. */
    experimentId: z.ZodString;
    /** Game slug — convenience for cross-test rollups ("all komorebi tests"). */
    game: z.ZodString;
    /** Which store's A/B group (its own significance test). */
    store: z.ZodEnum<["steam", "google-play", "apple-app-store"]>;
    variantId: z.ZodString;
    kind: z.ZodEnum<["impression", "page-view", "scroll-50", "cta-click", "wishlist-capture"]>;
    /** Client-observed ISO timestamp (the report windows over this). */
    at: z.ZodString;
    /** Anonymous per-visitor id (funnel stitching + dedup). */
    sessionId: z.ZodString;
    /** UTM `utm_source` — which ad network drove the click (per-source CTR). */
    source: z.ZodOptional<z.ZodString>;
    /** UTM `utm_campaign` — the campaign the visitor came from (topic-1 attribution). */
    campaign: z.ZodOptional<z.ZodString>;
    /** UTM `utm_medium` — cpc / social / referral. */
    medium: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    at: string;
    kind: "impression" | "page-view" | "scroll-50" | "cta-click" | "wishlist-capture";
    store: "steam" | "google-play" | "apple-app-store";
    variantId: string;
    experimentId: string;
    game: string;
    sessionId: string;
    source?: string | undefined;
    campaign?: string | undefined;
    medium?: string | undefined;
}, {
    at: string;
    kind: "impression" | "page-view" | "scroll-50" | "cta-click" | "wishlist-capture";
    store: "steam" | "google-play" | "apple-app-store";
    variantId: string;
    experimentId: string;
    game: string;
    sessionId: string;
    source?: string | undefined;
    campaign?: string | undefined;
    medium?: string | undefined;
}>;
export type MarketTestEvent = z.infer<typeof MarketTestEventSchema>;
/** Aggregated funnel counts for one variant. */
export declare const VariantTallySchema: z.ZodObject<{
    variantId: z.ZodString;
    impressions: z.ZodNumber;
    pageViews: z.ZodNumber;
    scrolls: z.ZodNumber;
    ctaClicks: z.ZodNumber;
    captures: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    variantId: string;
    impressions: number;
    pageViews: number;
    scrolls: number;
    ctaClicks: number;
    captures: number;
}, {
    variantId: string;
    impressions: number;
    pageViews: number;
    scrolls: number;
    ctaClicks: number;
    captures: number;
}>;
export type VariantTally = z.infer<typeof VariantTallySchema>;
/** One variant's measured performance with a confidence interval. */
export declare const AbVariantResultSchema: z.ZodObject<{
    variantId: z.ZodString;
    impressions: z.ZodNumber;
    ctaClicks: z.ZodNumber;
    /** Primary metric — CTA clicks ÷ impressions. */
    ctr: z.ZodNumber;
    /** Wilson-score 95% interval on the CTR. */
    ctrLow: z.ZodNumber;
    ctrHigh: z.ZodNumber;
    /** Whether this variant is significantly ahead of the runner-up. */
    significantlyBest: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    variantId: string;
    impressions: number;
    ctaClicks: number;
    ctr: number;
    ctrLow: number;
    ctrHigh: number;
    significantlyBest: boolean;
}, {
    variantId: string;
    impressions: number;
    ctaClicks: number;
    ctr: number;
    ctrLow: number;
    ctrHigh: number;
    significantlyBest: boolean;
}>;
export type AbVariantResult = z.infer<typeof AbVariantResultSchema>;
export declare const MarketTestDecisionSchema: z.ZodEnum<["go", "no-go", "inconclusive", "underpowered"]>;
export type MarketTestDecision = z.infer<typeof MarketTestDecisionSchema>;
/** The measured A/B outcome for one store. The real-data mirror of
 *  `MarketValidationReport` (which was the synthetic prediction). */
export declare const MarketTestReportSchema: z.ZodObject<{
    /** The A/B test run this measured report belongs to. */
    experimentId: z.ZodOptional<z.ZodString>;
    game: z.ZodOptional<z.ZodString>;
    store: z.ZodEnum<["steam", "google-play", "apple-app-store"]>;
    results: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        impressions: z.ZodNumber;
        ctaClicks: z.ZodNumber;
        /** Primary metric — CTA clicks ÷ impressions. */
        ctr: z.ZodNumber;
        /** Wilson-score 95% interval on the CTR. */
        ctrLow: z.ZodNumber;
        ctrHigh: z.ZodNumber;
        /** Whether this variant is significantly ahead of the runner-up. */
        significantlyBest: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        variantId: string;
        impressions: number;
        ctaClicks: number;
        ctr: number;
        ctrLow: number;
        ctrHigh: number;
        significantlyBest: boolean;
    }, {
        variantId: string;
        impressions: number;
        ctaClicks: number;
        ctr: number;
        ctrLow: number;
        ctrHigh: number;
        significantlyBest: boolean;
    }>, "many">;
    winnerId: z.ZodNullable<z.ZodString>;
    /** The winner is significantly ahead of the field. */
    significant: z.ZodBoolean;
    /** Go / no-go vs the genre benchmark CTR (when supplied). */
    decision: z.ZodEnum<["go", "no-go", "inconclusive", "underpowered"]>;
    benchmarkCtr: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    decision: "go" | "no-go" | "inconclusive" | "underpowered";
    results: {
        variantId: string;
        impressions: number;
        ctaClicks: number;
        ctr: number;
        ctrLow: number;
        ctrHigh: number;
        significantlyBest: boolean;
    }[];
    store: "steam" | "google-play" | "apple-app-store";
    benchmarkCtr: number | null;
    winnerId: string | null;
    significant: boolean;
    experimentId?: string | undefined;
    game?: string | undefined;
}, {
    decision: "go" | "no-go" | "inconclusive" | "underpowered";
    results: {
        variantId: string;
        impressions: number;
        ctaClicks: number;
        ctr: number;
        ctrLow: number;
        ctrHigh: number;
        significantlyBest: boolean;
    }[];
    store: "steam" | "google-play" | "apple-app-store";
    benchmarkCtr: number | null;
    winnerId: string | null;
    significant: boolean;
    experimentId?: string | undefined;
    game?: string | undefined;
}>;
export type MarketTestReport = z.infer<typeof MarketTestReportSchema>;
/** How well the synthetic panel PREDICTED the real signal — the
 *  load-bearing differentiator. Over time, a high correlation means more
 *  validation can stay synthetic ($0) with measured confidence. */
export declare const CalibrationResultSchema: z.ZodObject<{
    n: z.ZodNumber;
    /** Pearson correlation of predicted appeal vs measured CTR. */
    pearson: z.ZodNumber;
    /** Spearman rank correlation — did the panel ORDER them right? */
    spearman: z.ZodNumber;
    /** Did the synthetic winner also win for real? */
    top1Match: z.ZodBoolean;
    pairs: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        predictedAppeal: z.ZodNumber;
        measuredCtr: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        variantId: string;
        predictedAppeal: number;
        measuredCtr: number;
    }, {
        variantId: string;
        predictedAppeal: number;
        measuredCtr: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    n: number;
    pearson: number;
    spearman: number;
    top1Match: boolean;
    pairs: {
        variantId: string;
        predictedAppeal: number;
        measuredCtr: number;
    }[];
}, {
    n: number;
    pearson: number;
    spearman: number;
    top1Match: boolean;
    pairs: {
        variantId: string;
        predictedAppeal: number;
        measuredCtr: number;
    }[];
}>;
export type CalibrationResult = z.infer<typeof CalibrationResultSchema>;
/** The paid-acquisition networks a campaign can target. Steam is
 *  deliberately absent — it has no paid-acquisition ad product (its
 *  "campaign" is wishlist velocity + visibility rounds), so Steam variants
 *  are validated by driving OTHER networks' traffic to the Steam page. */
export declare const AdNetworkSchema: z.ZodEnum<["meta", "google-ads", "tiktok", "reddit", "apple-search-ads"]>;
export type AdNetwork = z.infer<typeof AdNetworkSchema>;
/** What the campaign is buying. Networks name these differently; the gate
 *  maps each to what a given network supports. */
export declare const CampaignObjectiveSchema: z.ZodEnum<["awareness", "traffic", "wishlist", "installs"]>;
export type CampaignObjective = z.infer<typeof CampaignObjectiveSchema>;
/** How a network's audiences are addressed — drives what the deploy brief
 *  asks the operator to fill in. */
export declare const AdTargetingKindSchema: z.ZodEnum<["interest", "keyword", "subreddit"]>;
export type AdTargetingKind = z.infer<typeof AdTargetingKindSchema>;
/** Per-network metadata — the "what a campaign entails on this network"
 *  knowledge, the campaign-side mirror of `STORE_SPECS`. The gate reads
 *  `objectives` (is this objective buyable here?) + `utmSource` (the value
 *  the beacon will see) + `targeting` (what the brief prompts for). */
export declare const AdNetworkSpecSchema: z.ZodObject<{
    network: z.ZodEnum<["meta", "google-ads", "tiktok", "reddit", "apple-search-ads"]>;
    label: z.ZodString;
    /** The `utm_source` value ads on this network must tag (matches beacon). */
    utmSource: z.ZodString;
    /** Objectives this network can actually buy. */
    objectives: z.ZodArray<z.ZodEnum<["awareness", "traffic", "wishlist", "installs"]>, "many">;
    /** How audiences are addressed on this network. */
    targeting: z.ZodEnum<["interest", "keyword", "subreddit"]>;
    /** Which stores this network can send traffic to (`'any'` = web/all). */
    drivesTo: z.ZodUnion<[z.ZodArray<z.ZodEnum<["steam", "google-play", "apple-app-store"]>, "many">, z.ZodLiteral<"any">]>;
    /** Operator-facing note (quirks, review lead time). */
    note: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    label: string;
    note: string;
    network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
    utmSource: string;
    objectives: ("awareness" | "traffic" | "wishlist" | "installs")[];
    targeting: "interest" | "keyword" | "subreddit";
    drivesTo: ("steam" | "google-play" | "apple-app-store")[] | "any";
}, {
    label: string;
    network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
    utmSource: string;
    objectives: ("awareness" | "traffic" | "wishlist" | "installs")[];
    targeting: "interest" | "keyword" | "subreddit";
    drivesTo: ("steam" | "google-play" | "apple-app-store")[] | "any";
    note?: string | undefined;
}>;
export type AdNetworkSpec = z.infer<typeof AdNetworkSpecSchema>;
/** Curated real-world network specs (2026). Single source of truth for the
 *  campaign gate + the deploy brief. */
export declare const AD_NETWORK_SPECS: Record<AdNetwork, AdNetworkSpec>;
/** Extra targeting the operator sets on an ad set, beyond the personas. */
export declare const AdTargetingSchema: z.ZodObject<{
    interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    subreddits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    geos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    ageMin: z.ZodOptional<z.ZodNumber>;
    ageMax: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    interests: string[];
    keywords: string[];
    subreddits: string[];
    geos: string[];
    ageMin?: number | undefined;
    ageMax?: number | undefined;
}, {
    interests?: string[] | undefined;
    keywords?: string[] | undefined;
    subreddits?: string[] | undefined;
    geos?: string[] | undefined;
    ageMin?: number | undefined;
    ageMax?: number | undefined;
}>;
export type AdTargeting = z.infer<typeof AdTargetingSchema>;
/** One ad set — a single (network → variant) cell of a campaign, with the
 *  audience it targets + its daily budget. This is the unit the operator
 *  creates in the ad manager + records spend against. */
export declare const AdSetSchema: z.ZodObject<{
    id: z.ZodString;
    network: z.ZodEnum<["meta", "google-ads", "tiktok", "reddit", "apple-search-ads"]>;
    /** The store-page variant this ad set drives to (id from the generated
     *  variants; the beacon's `data-mkt-variant` echoes it back). */
    variantId: z.ZodString;
    /** Personas this ad set targets — traceability to the synthetic panel; the
     *  brief expands them into suggested interests/keywords. */
    personaIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Daily budget in USD. */
    dailyBudgetUsd: z.ZodNumber;
    targeting: z.ZodDefault<z.ZodObject<{
        interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        subreddits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        geos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        ageMin: z.ZodOptional<z.ZodNumber>;
        ageMax: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        interests: string[];
        keywords: string[];
        subreddits: string[];
        geos: string[];
        ageMin?: number | undefined;
        ageMax?: number | undefined;
    }, {
        interests?: string[] | undefined;
        keywords?: string[] | undefined;
        subreddits?: string[] | undefined;
        geos?: string[] | undefined;
        ageMin?: number | undefined;
        ageMax?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    variantId: string;
    network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
    targeting: {
        interests: string[];
        keywords: string[];
        subreddits: string[];
        geos: string[];
        ageMin?: number | undefined;
        ageMax?: number | undefined;
    };
    personaIds: string[];
    dailyBudgetUsd: number;
}, {
    id: string;
    variantId: string;
    network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
    dailyBudgetUsd: number;
    targeting?: {
        interests?: string[] | undefined;
        keywords?: string[] | undefined;
        subreddits?: string[] | undefined;
        geos?: string[] | undefined;
        ageMin?: number | undefined;
        ageMax?: number | undefined;
    } | undefined;
    personaIds?: string[] | undefined;
}>;
export type AdSet = z.infer<typeof AdSetSchema>;
/** One campaign — an objective + a set of ad sets driving to the deployed
 *  pages, over a flight window. */
export declare const CampaignSchema: z.ZodObject<{
    id: z.ZodString;
    objective: z.ZodEnum<["awareness", "traffic", "wishlist", "installs"]>;
    /** Base URL of the deployed pages (Vercel), e.g. `https://x.vercel.app`.
     *  The tagged landing URL per ad set is built from this + the variant. */
    landingBaseUrl: z.ZodString;
    adSets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        network: z.ZodEnum<["meta", "google-ads", "tiktok", "reddit", "apple-search-ads"]>;
        /** The store-page variant this ad set drives to (id from the generated
         *  variants; the beacon's `data-mkt-variant` echoes it back). */
        variantId: z.ZodString;
        /** Personas this ad set targets — traceability to the synthetic panel; the
         *  brief expands them into suggested interests/keywords. */
        personaIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Daily budget in USD. */
        dailyBudgetUsd: z.ZodNumber;
        targeting: z.ZodDefault<z.ZodObject<{
            interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            subreddits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            geos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            ageMin: z.ZodOptional<z.ZodNumber>;
            ageMax: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            interests: string[];
            keywords: string[];
            subreddits: string[];
            geos: string[];
            ageMin?: number | undefined;
            ageMax?: number | undefined;
        }, {
            interests?: string[] | undefined;
            keywords?: string[] | undefined;
            subreddits?: string[] | undefined;
            geos?: string[] | undefined;
            ageMin?: number | undefined;
            ageMax?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        variantId: string;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        targeting: {
            interests: string[];
            keywords: string[];
            subreddits: string[];
            geos: string[];
            ageMin?: number | undefined;
            ageMax?: number | undefined;
        };
        personaIds: string[];
        dailyBudgetUsd: number;
    }, {
        id: string;
        variantId: string;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        dailyBudgetUsd: number;
        targeting?: {
            interests?: string[] | undefined;
            keywords?: string[] | undefined;
            subreddits?: string[] | undefined;
            geos?: string[] | undefined;
            ageMin?: number | undefined;
            ageMax?: number | undefined;
        } | undefined;
        personaIds?: string[] | undefined;
    }>, "many">;
    /** ISO flight dates (informational; the gate sanity-checks ordering). */
    flightStart: z.ZodOptional<z.ZodString>;
    flightEnd: z.ZodOptional<z.ZodString>;
    note: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    note: string;
    objective: "awareness" | "traffic" | "wishlist" | "installs";
    landingBaseUrl: string;
    adSets: {
        id: string;
        variantId: string;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        targeting: {
            interests: string[];
            keywords: string[];
            subreddits: string[];
            geos: string[];
            ageMin?: number | undefined;
            ageMax?: number | undefined;
        };
        personaIds: string[];
        dailyBudgetUsd: number;
    }[];
    flightStart?: string | undefined;
    flightEnd?: string | undefined;
}, {
    id: string;
    objective: "awareness" | "traffic" | "wishlist" | "installs";
    landingBaseUrl: string;
    adSets: {
        id: string;
        variantId: string;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        dailyBudgetUsd: number;
        targeting?: {
            interests?: string[] | undefined;
            keywords?: string[] | undefined;
            subreddits?: string[] | undefined;
            geos?: string[] | undefined;
            ageMin?: number | undefined;
            ageMax?: number | undefined;
        } | undefined;
        personaIds?: string[] | undefined;
    }[];
    note?: string | undefined;
    flightStart?: string | undefined;
    flightEnd?: string | undefined;
}>;
export type Campaign = z.infer<typeof CampaignSchema>;
/** The per-game campaign manifest (`campaign.config.ts`). */
export declare const CampaignConfigSchema: z.ZodObject<{
    campaigns: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        objective: z.ZodEnum<["awareness", "traffic", "wishlist", "installs"]>;
        /** Base URL of the deployed pages (Vercel), e.g. `https://x.vercel.app`.
         *  The tagged landing URL per ad set is built from this + the variant. */
        landingBaseUrl: z.ZodString;
        adSets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            network: z.ZodEnum<["meta", "google-ads", "tiktok", "reddit", "apple-search-ads"]>;
            /** The store-page variant this ad set drives to (id from the generated
             *  variants; the beacon's `data-mkt-variant` echoes it back). */
            variantId: z.ZodString;
            /** Personas this ad set targets — traceability to the synthetic panel; the
             *  brief expands them into suggested interests/keywords. */
            personaIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            /** Daily budget in USD. */
            dailyBudgetUsd: z.ZodNumber;
            targeting: z.ZodDefault<z.ZodObject<{
                interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                subreddits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                geos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                ageMin: z.ZodOptional<z.ZodNumber>;
                ageMax: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interests: string[];
                keywords: string[];
                subreddits: string[];
                geos: string[];
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            }, {
                interests?: string[] | undefined;
                keywords?: string[] | undefined;
                subreddits?: string[] | undefined;
                geos?: string[] | undefined;
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            variantId: string;
            network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
            targeting: {
                interests: string[];
                keywords: string[];
                subreddits: string[];
                geos: string[];
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            };
            personaIds: string[];
            dailyBudgetUsd: number;
        }, {
            id: string;
            variantId: string;
            network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
            dailyBudgetUsd: number;
            targeting?: {
                interests?: string[] | undefined;
                keywords?: string[] | undefined;
                subreddits?: string[] | undefined;
                geos?: string[] | undefined;
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            } | undefined;
            personaIds?: string[] | undefined;
        }>, "many">;
        /** ISO flight dates (informational; the gate sanity-checks ordering). */
        flightStart: z.ZodOptional<z.ZodString>;
        flightEnd: z.ZodOptional<z.ZodString>;
        note: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        note: string;
        objective: "awareness" | "traffic" | "wishlist" | "installs";
        landingBaseUrl: string;
        adSets: {
            id: string;
            variantId: string;
            network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
            targeting: {
                interests: string[];
                keywords: string[];
                subreddits: string[];
                geos: string[];
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            };
            personaIds: string[];
            dailyBudgetUsd: number;
        }[];
        flightStart?: string | undefined;
        flightEnd?: string | undefined;
    }, {
        id: string;
        objective: "awareness" | "traffic" | "wishlist" | "installs";
        landingBaseUrl: string;
        adSets: {
            id: string;
            variantId: string;
            network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
            dailyBudgetUsd: number;
            targeting?: {
                interests?: string[] | undefined;
                keywords?: string[] | undefined;
                subreddits?: string[] | undefined;
                geos?: string[] | undefined;
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            } | undefined;
            personaIds?: string[] | undefined;
        }[];
        note?: string | undefined;
        flightStart?: string | undefined;
        flightEnd?: string | undefined;
    }>, "many">;
    /** UTM `medium` to tag (default `cpc`). */
    medium: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    medium: string;
    campaigns: {
        id: string;
        note: string;
        objective: "awareness" | "traffic" | "wishlist" | "installs";
        landingBaseUrl: string;
        adSets: {
            id: string;
            variantId: string;
            network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
            targeting: {
                interests: string[];
                keywords: string[];
                subreddits: string[];
                geos: string[];
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            };
            personaIds: string[];
            dailyBudgetUsd: number;
        }[];
        flightStart?: string | undefined;
        flightEnd?: string | undefined;
    }[];
}, {
    campaigns: {
        id: string;
        objective: "awareness" | "traffic" | "wishlist" | "installs";
        landingBaseUrl: string;
        adSets: {
            id: string;
            variantId: string;
            network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
            dailyBudgetUsd: number;
            targeting?: {
                interests?: string[] | undefined;
                keywords?: string[] | undefined;
                subreddits?: string[] | undefined;
                geos?: string[] | undefined;
                ageMin?: number | undefined;
                ageMax?: number | undefined;
            } | undefined;
            personaIds?: string[] | undefined;
        }[];
        note?: string | undefined;
        flightStart?: string | undefined;
        flightEnd?: string | undefined;
    }[];
    medium?: string | undefined;
}>;
export type CampaignConfig = z.infer<typeof CampaignConfigSchema>;
export type CampaignConfigInput = z.input<typeof CampaignConfigSchema>;
/** One operator-recorded ledger row — network-reported spend + funnel-top
 *  numbers for one ad set on one day. The beacon can't see ad spend or ad
 *  impressions (those live in the ad manager); the operator records them
 *  here, and the report joins them to the beacon-measured on-page outcomes. */
export declare const CampaignResultEntrySchema: z.ZodObject<{
    campaignId: z.ZodString;
    adSetId: z.ZodString;
    /** ISO date (day granularity is fine). */
    date: z.ZodString;
    spendUsd: z.ZodNumber;
    /** Ad impressions the network reported (denominator for CPM). */
    adImpressions: z.ZodOptional<z.ZodNumber>;
    /** Ad clicks the network reported (clicks to the landing page). */
    adClicks: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    campaignId: string;
    adSetId: string;
    spendUsd: number;
    note?: string | undefined;
    adImpressions?: number | undefined;
    adClicks?: number | undefined;
}, {
    date: string;
    campaignId: string;
    adSetId: string;
    spendUsd: number;
    note?: string | undefined;
    adImpressions?: number | undefined;
    adClicks?: number | undefined;
}>;
export type CampaignResultEntry = z.infer<typeof CampaignResultEntrySchema>;
/** The computed attribution for one ad set — operator spend joined to
 *  beacon-measured outcomes → cost-per-outcome. */
export declare const AdSetReportSchema: z.ZodObject<{
    adSetId: z.ZodString;
    network: z.ZodEnum<["meta", "google-ads", "tiktok", "reddit", "apple-search-ads"]>;
    variantId: z.ZodString;
    spendUsd: z.ZodNumber;
    /** Network-reported (from the ledger). */
    adImpressions: z.ZodNumber;
    adClicks: z.ZodNumber;
    /** Beacon-measured (from the event store, scoped to this campaign). */
    pageViews: z.ZodNumber;
    ctaClicks: z.ZodNumber;
    wishlistCaptures: z.ZodNumber;
    /** Cost metrics (null when the denominator is 0). */
    cpmUsd: z.ZodNullable<z.ZodNumber>;
    costPerAdClickUsd: z.ZodNullable<z.ZodNumber>;
    costPerCtaUsd: z.ZodNullable<z.ZodNumber>;
    costPerWishlistUsd: z.ZodNullable<z.ZodNumber>;
    /** Funnel rates. */
    landingRate: z.ZodNullable<z.ZodNumber>;
    ctaRate: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    variantId: string;
    pageViews: number;
    ctaClicks: number;
    network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
    adSetId: string;
    spendUsd: number;
    adImpressions: number;
    adClicks: number;
    wishlistCaptures: number;
    cpmUsd: number | null;
    costPerAdClickUsd: number | null;
    costPerCtaUsd: number | null;
    costPerWishlistUsd: number | null;
    landingRate: number | null;
    ctaRate: number | null;
}, {
    variantId: string;
    pageViews: number;
    ctaClicks: number;
    network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
    adSetId: string;
    spendUsd: number;
    adImpressions: number;
    adClicks: number;
    wishlistCaptures: number;
    cpmUsd: number | null;
    costPerAdClickUsd: number | null;
    costPerCtaUsd: number | null;
    costPerWishlistUsd: number | null;
    landingRate: number | null;
    ctaRate: number | null;
}>;
export type AdSetReport = z.infer<typeof AdSetReportSchema>;
export declare const CampaignReportSchema: z.ZodObject<{
    campaignId: z.ZodString;
    objective: z.ZodEnum<["awareness", "traffic", "wishlist", "installs"]>;
    adSets: z.ZodArray<z.ZodObject<{
        adSetId: z.ZodString;
        network: z.ZodEnum<["meta", "google-ads", "tiktok", "reddit", "apple-search-ads"]>;
        variantId: z.ZodString;
        spendUsd: z.ZodNumber;
        /** Network-reported (from the ledger). */
        adImpressions: z.ZodNumber;
        adClicks: z.ZodNumber;
        /** Beacon-measured (from the event store, scoped to this campaign). */
        pageViews: z.ZodNumber;
        ctaClicks: z.ZodNumber;
        wishlistCaptures: z.ZodNumber;
        /** Cost metrics (null when the denominator is 0). */
        cpmUsd: z.ZodNullable<z.ZodNumber>;
        costPerAdClickUsd: z.ZodNullable<z.ZodNumber>;
        costPerCtaUsd: z.ZodNullable<z.ZodNumber>;
        costPerWishlistUsd: z.ZodNullable<z.ZodNumber>;
        /** Funnel rates. */
        landingRate: z.ZodNullable<z.ZodNumber>;
        ctaRate: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        variantId: string;
        pageViews: number;
        ctaClicks: number;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        adSetId: string;
        spendUsd: number;
        adImpressions: number;
        adClicks: number;
        wishlistCaptures: number;
        cpmUsd: number | null;
        costPerAdClickUsd: number | null;
        costPerCtaUsd: number | null;
        costPerWishlistUsd: number | null;
        landingRate: number | null;
        ctaRate: number | null;
    }, {
        variantId: string;
        pageViews: number;
        ctaClicks: number;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        adSetId: string;
        spendUsd: number;
        adImpressions: number;
        adClicks: number;
        wishlistCaptures: number;
        cpmUsd: number | null;
        costPerAdClickUsd: number | null;
        costPerCtaUsd: number | null;
        costPerWishlistUsd: number | null;
        landingRate: number | null;
        ctaRate: number | null;
    }>, "many">;
    /** Totals across the campaign. */
    totalSpendUsd: z.ZodNumber;
    totalCtaClicks: z.ZodNumber;
    totalWishlistCaptures: z.ZodNumber;
    /** Blended cost per CTA click across the campaign (null if 0 clicks). */
    blendedCostPerCtaUsd: z.ZodNullable<z.ZodNumber>;
    /** The ad set with the lowest cost-per-CTA (the efficient channel). */
    bestAdSetId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    objective: "awareness" | "traffic" | "wishlist" | "installs";
    adSets: {
        variantId: string;
        pageViews: number;
        ctaClicks: number;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        adSetId: string;
        spendUsd: number;
        adImpressions: number;
        adClicks: number;
        wishlistCaptures: number;
        cpmUsd: number | null;
        costPerAdClickUsd: number | null;
        costPerCtaUsd: number | null;
        costPerWishlistUsd: number | null;
        landingRate: number | null;
        ctaRate: number | null;
    }[];
    campaignId: string;
    totalSpendUsd: number;
    totalCtaClicks: number;
    totalWishlistCaptures: number;
    blendedCostPerCtaUsd: number | null;
    bestAdSetId: string | null;
}, {
    objective: "awareness" | "traffic" | "wishlist" | "installs";
    adSets: {
        variantId: string;
        pageViews: number;
        ctaClicks: number;
        network: "meta" | "google-ads" | "tiktok" | "reddit" | "apple-search-ads";
        adSetId: string;
        spendUsd: number;
        adImpressions: number;
        adClicks: number;
        wishlistCaptures: number;
        cpmUsd: number | null;
        costPerAdClickUsd: number | null;
        costPerCtaUsd: number | null;
        costPerWishlistUsd: number | null;
        landingRate: number | null;
        ctaRate: number | null;
    }[];
    campaignId: string;
    totalSpendUsd: number;
    totalCtaClicks: number;
    totalWishlistCaptures: number;
    blendedCostPerCtaUsd: number | null;
    bestAdSetId: string | null;
}>;
export type CampaignReport = z.infer<typeof CampaignReportSchema>;
//# sourceMappingURL=marketGen.d.ts.map