import { z } from 'zod';

// Market-validation (Geeklab-shape) pipeline shapes — the demand-side
// mirror of the generation pipelines. Where asset-gen / audio-gen /
// loc-gen GENERATE a game's content, this pipeline generates a game's
// STORE PRESENCE (icon / screenshots / title / description as a store
// listing) in A/B variants and scores their appeal — so a concept is
// validated for demand BEFORE it is built.
//
// Phase 1 (this schema): the GENERATE arm (store-spec-correct copy
// variants + a variant matrix) + the SYNTHETIC-AUDIENCE verify arm (an
// LLM persona panel that ranks variants + predicts relative appeal).
// Phase 2 (deferred): real hosted mock pages + ad traffic + A/B stats.
//
// The load-bearing FREE gate is store-spec COMPLIANCE (`STORE_SPECS`):
// every generated field must fit its target store's real constraints
// (title/description char limits, screenshot counts, icon dimensions).
// A variant that violates a spec can't be tested — caught deterministic-
// ally, for free, before any billed judge runs. Mirrors loc-gen's ICU
// gate + asset-gen's validation gates.

// ────────────────────────────────────────────────────────────────
// Stores + their creative specs
// ────────────────────────────────────────────────────────────────

export const StoreTargetSchema = z.enum(['steam', 'google-play', 'apple-app-store']);
export type StoreTarget = z.infer<typeof StoreTargetSchema>;

/** A single dimension constraint (character or count limit). */
const LimitSchema = z.object({ max: z.number().int().positive(), min: z.number().int().nonnegative().default(0) });

/** The real creative constraints for one store. The compliance gate
 *  reads these; a generated field outside them is rejected. */
export const StoreSpecSchema = z.object({
  store: StoreTargetSchema,
  /** Human label for reports. */
  label: z.string(),
  /** Store name / app title character budget. */
  title: LimitSchema,
  /** Subtitle (App Store) — null when the store has none. */
  subtitle: LimitSchema.nullable(),
  /** Short / promo description (Play 80, Steam short 300) — null when none. */
  shortDescription: LimitSchema.nullable(),
  /** Full description character budget. */
  longDescription: LimitSchema,
  /** Number of tags / keywords allowed. */
  tags: LimitSchema,
  /** Allowed screenshot count range. */
  screenshots: LimitSchema,
  /** Icon / primary-capsule pixel dimensions `[w, h]` (null = store uses
   *  a capsule rather than a square icon; Steam). */
  icon: z.tuple([z.number().int().positive(), z.number().int().positive()]).nullable(),
  /** Feature graphic / hero capsule dimensions `[w, h]` (null = none). */
  featureGraphic: z.tuple([z.number().int().positive(), z.number().int().positive()]).nullable(),
});
export type StoreSpec = z.infer<typeof StoreSpecSchema>;

/** Curated real-world store specs (2026). The single source of truth
 *  for the compliance gate + the copy-generation length budgets. */
export const STORE_SPECS: Record<StoreTarget, StoreSpec> = {
  steam: {
    store: 'steam',
    label: 'Steam',
    title: { max: 100, min: 0 },
    subtitle: null,
    shortDescription: { max: 300, min: 0 }, // the "short description" blurb
    longDescription: { max: 5000, min: 0 },
    tags: { max: 20, min: 1 },
    screenshots: { max: 20, min: 5 },
    icon: null, // Steam uses capsules, not a square icon
    featureGraphic: [616, 353], // main capsule
  },
  'google-play': {
    store: 'google-play',
    label: 'Google Play',
    title: { max: 30, min: 0 },
    subtitle: null,
    shortDescription: { max: 80, min: 0 },
    longDescription: { max: 4000, min: 0 },
    tags: { max: 5, min: 1 },
    screenshots: { max: 8, min: 2 },
    icon: [512, 512],
    featureGraphic: [1024, 500],
  },
  'apple-app-store': {
    store: 'apple-app-store',
    label: 'Apple App Store',
    title: { max: 30, min: 0 },
    subtitle: { max: 30, min: 0 },
    shortDescription: { max: 170, min: 0 }, // promotional text
    longDescription: { max: 4000, min: 0 },
    tags: { max: 100, min: 0 }, // keyword field is a 100-CHAR budget (treated as chars below)
    screenshots: { max: 10, min: 1 },
    icon: [1024, 1024],
    featureGraphic: null,
  },
};

// ────────────────────────────────────────────────────────────────
// The concept being validated + the config
// ────────────────────────────────────────────────────────────────

/** The game concept the store page sells — the grounding. Drawn from the
 *  narrative overview + design brief; hand-authored or skill-grounded. */
export const GameConceptSchema = z.object({
  name: z.string().min(1),
  /** One-line hook / logline. */
  pitch: z.string().min(1),
  /** Longer premise the copy can draw on. */
  premise: z.string().default(''),
  /** Genre / positioning tags (Souls-like, roguelite, cozy…). */
  genres: z.array(z.string().min(1)).default([]),
  /** Comparable titles ("for fans of …"). */
  comparables: z.array(z.string().min(1)).default([]),
  /** Tone words for the copy register. */
  tone: z.array(z.string().min(1)).default([]),
});
export type GameConcept = z.infer<typeof GameConceptSchema>;

/** A synthetic-audience persona — one juror in the panel. */
export const AudiencePersonaSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** Who they are + what they buy + what turns them off. */
  description: z.string().min(1),
  /** Genres they lean toward (weights the score). */
  genreAffinity: z.array(z.string().min(1)).default([]),
});
export type AudiencePersona = z.infer<typeof AudiencePersonaSchema>;

export const MarketGenConfigSchema = z.object({
  concept: GameConceptSchema,
  /** Stores to build variants for. */
  stores: z.array(StoreTargetSchema).min(1),
  /** How many copy variants to generate per store (the A/B breadth). */
  variantsPerStore: z.number().int().min(2).max(24).default(6),
  /** The synthetic audience panel. */
  personas: z.array(AudiencePersonaSchema).min(1),
  /** LLM model for copy generation. */
  copyModel: z.string().min(1).default('claude-sonnet-5'),
  /** LLM model for the audience judge. */
  judgeModel: z.string().min(1).default('claude-sonnet-5'),
  /** How the judge/copy calls reach Claude. */
  provider: z.enum(['auto', 'api', 'claude-cli']).default('auto'),
  claudeCliPath: z.string().optional(),
  /** Governance — same shape as the sibling pipelines. */
  budgetSoftUsd: z.number().nonnegative().default(1),
  budgetHardUsd: z.number().nonnegative().default(5),
  budgetLifetimeUsd: z.number().nonnegative().optional(),
  requireSpendAuthorization: z.boolean().default(false),
  /** L1 banned-term filter over generated copy. */
  bannedTerms: z.array(z.string().min(1)).default([]),
  /** Genre benchmark CTR (CTA clicks ÷ impressions, 0–1) the Phase-2a
   *  go/no-go decision compares the measured winner against. Undefined ⇒
   *  the report ranks + tests significance but makes no go/no-go call. */
  benchmarkCtr: z.number().min(0).max(1).optional(),
});
export type MarketGenConfig = z.infer<typeof MarketGenConfigSchema>;
export type MarketGenConfigInput = z.input<typeof MarketGenConfigSchema>;

// ────────────────────────────────────────────────────────────────
// Variants + scores + report
// ────────────────────────────────────────────────────────────────

/** The generated copy fields for one store-page variant. Art (icon /
 *  screenshots) is referenced by asset-gen SLOT id — the operator
 *  generates the images via asset-gen; this pipeline composes + tests
 *  the listing around them. */
export const StorePageVariantSchema = z.object({
  id: z.string().min(1),
  store: StoreTargetSchema,
  title: z.string(),
  subtitle: z.string().nullable().default(null),
  shortDescription: z.string().nullable().default(null),
  longDescription: z.string(),
  tags: z.array(z.string()).default([]),
  /** asset-gen slot references for the visual creative (optional in
   *  Phase 1 — copy can be tested before art exists). */
  iconSlot: z.string().nullable().default(null),
  screenshotSlots: z.array(z.string()).default([]),
  featureGraphicSlot: z.string().nullable().default(null),
});
export type StorePageVariant = z.infer<typeof StorePageVariantSchema>;

/** One persona's read on one variant. */
export const VariantScoreSchema = z.object({
  variantId: z.string(),
  personaId: z.string(),
  /** 0–100 predicted appeal for this persona. */
  appeal: z.number().min(0).max(100),
  /** Would this persona click the CTA (Wishlist / Get)? */
  wouldClick: z.boolean(),
  rationale: z.string(),
});
export type VariantScore = z.infer<typeof VariantScoreSchema>;

/** A variant's aggregated standing across the whole panel. */
export const VariantRankingSchema = z.object({
  variantId: z.string(),
  meanAppeal: z.number(),
  medianAppeal: z.number(),
  /** Fraction of personas who would click (a synthetic CTR proxy). */
  clickRate: z.number().min(0).max(1),
  rank: z.number().int().positive(),
});
export type VariantRanking = z.infer<typeof VariantRankingSchema>;

export const MarketValidationReportSchema = z.object({
  /** The A/B test run this synthetic prediction belongs to (present once
   *  minted by `generate`; older reports may omit it). */
  experimentId: z.string().optional(),
  game: z.string().optional(),
  store: StoreTargetSchema,
  personaCount: z.number().int().nonnegative(),
  rankings: z.array(VariantRankingSchema),
  /** Winning variant id (highest rank), or null when no variant scored. */
  winnerId: z.string().nullable(),
  costUsd: z.number(),
});
export type MarketValidationReport = z.infer<typeof MarketValidationReportSchema>;

// ────────────────────────────────────────────────────────────────
// Phase 2a — real-signal shapes (deployable pages consume these; the
// analysis is pure, headless, $0). The event COLLECTOR + hosting + ads
// are Phase 2b/2c (the backend on-ramp), deferred.
// ────────────────────────────────────────────────────────────────

/** The manifest for one A/B test run — written by `generate` (or minted
 *  standalone), read by `render` (to stamp `data-mkt-experiment` into each
 *  page) + `report` / `calibrate` (to scope the event query to this test).
 *  This is what makes "which A/B test is running" a first-class, queryable
 *  fact rather than an inference from filenames. */
export const MarketExperimentSchema = z.object({
  /** Stable id for this run — default `<game>-<YYYYMMDD>` (a same-day
   *  re-run gets a `-N` suffix so it never silently merges). */
  experimentId: z.string().min(1),
  game: z.string().min(1),
  createdAt: z.string(),
  stores: z.array(StoreTargetSchema),
});
export type MarketExperiment = z.infer<typeof MarketExperimentSchema>;

/** The funnel events a hosted mock page reports back. */
export const MarketTestEventKindSchema = z.enum([
  'impression', // an ad was shown (the denominator for end-to-end CTR)
  'page-view', // the store page loaded
  'scroll-50', // scrolled at least halfway (engagement)
  'cta-click', // tapped Wishlist / Get / Pre-register (the intent signal)
  'wishlist-capture', // left an email / confirmed intent
]);
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
export const MarketTestEventSchema = z.object({
  /** The A/B test run this event belongs to. Minted at `generate` time,
   *  injected into each page, echoed back on every event. */
  experimentId: z.string().min(1),
  /** Game slug — convenience for cross-test rollups ("all komorebi tests"). */
  game: z.string().min(1),
  /** Which store's A/B group (its own significance test). */
  store: StoreTargetSchema,
  variantId: z.string().min(1),
  kind: MarketTestEventKindSchema,
  /** Client-observed ISO timestamp (the report windows over this). */
  at: z.string(),
  /** Anonymous per-visitor id (funnel stitching + dedup). */
  sessionId: z.string().min(1),
  /** UTM `utm_source` — which ad network drove the click (per-source CTR). */
  source: z.string().optional(),
  /** UTM `utm_campaign` — the campaign the visitor came from (topic-1 attribution). */
  campaign: z.string().optional(),
  /** UTM `utm_medium` — cpc / social / referral. */
  medium: z.string().optional(),
});
export type MarketTestEvent = z.infer<typeof MarketTestEventSchema>;

/** Aggregated funnel counts for one variant. */
export const VariantTallySchema = z.object({
  variantId: z.string(),
  impressions: z.number().int().nonnegative(),
  pageViews: z.number().int().nonnegative(),
  scrolls: z.number().int().nonnegative(),
  ctaClicks: z.number().int().nonnegative(),
  captures: z.number().int().nonnegative(),
});
export type VariantTally = z.infer<typeof VariantTallySchema>;

/** One variant's measured performance with a confidence interval. */
export const AbVariantResultSchema = z.object({
  variantId: z.string(),
  impressions: z.number().int().nonnegative(),
  ctaClicks: z.number().int().nonnegative(),
  /** Primary metric — CTA clicks ÷ impressions. */
  ctr: z.number(),
  /** Wilson-score 95% interval on the CTR. */
  ctrLow: z.number(),
  ctrHigh: z.number(),
  /** Whether this variant is significantly ahead of the runner-up. */
  significantlyBest: z.boolean(),
});
export type AbVariantResult = z.infer<typeof AbVariantResultSchema>;

export const MarketTestDecisionSchema = z.enum(['go', 'no-go', 'inconclusive', 'underpowered']);
export type MarketTestDecision = z.infer<typeof MarketTestDecisionSchema>;

/** The measured A/B outcome for one store. The real-data mirror of
 *  `MarketValidationReport` (which was the synthetic prediction). */
export const MarketTestReportSchema = z.object({
  /** The A/B test run this measured report belongs to. */
  experimentId: z.string().optional(),
  game: z.string().optional(),
  store: StoreTargetSchema,
  results: z.array(AbVariantResultSchema),
  winnerId: z.string().nullable(),
  /** The winner is significantly ahead of the field. */
  significant: z.boolean(),
  /** Go / no-go vs the genre benchmark CTR (when supplied). */
  decision: MarketTestDecisionSchema,
  benchmarkCtr: z.number().nullable(),
});
export type MarketTestReport = z.infer<typeof MarketTestReportSchema>;

/** How well the synthetic panel PREDICTED the real signal — the
 *  load-bearing differentiator. Over time, a high correlation means more
 *  validation can stay synthetic ($0) with measured confidence. */
export const CalibrationResultSchema = z.object({
  n: z.number().int().nonnegative(),
  /** Pearson correlation of predicted appeal vs measured CTR. */
  pearson: z.number(),
  /** Spearman rank correlation — did the panel ORDER them right? */
  spearman: z.number(),
  /** Did the synthetic winner also win for real? */
  top1Match: z.boolean(),
  pairs: z.array(z.object({ variantId: z.string(), predictedAppeal: z.number(), measuredCtr: z.number() })),
});
export type CalibrationResult = z.infer<typeof CalibrationResultSchema>;

// ────────────────────────────────────────────────────────────────
// Phase 2c — the CAMPAIGN manifest + attribution ledger. The demand-
// side "deploy" layer: a declarative campaign definition → a per-network
// operator brief (fields to paste + UTM-tagged landing URLs) → an
// attribution report (operator-recorded ad spend joined to beacon-measured
// on-page outcomes → cost-per-outcome). Deploy stays the MANUAL click; this
// arm owns define + track + attribute. Ad-API automation is later still.
// ────────────────────────────────────────────────────────────────

/** The paid-acquisition networks a campaign can target. Steam is
 *  deliberately absent — it has no paid-acquisition ad product (its
 *  "campaign" is wishlist velocity + visibility rounds), so Steam variants
 *  are validated by driving OTHER networks' traffic to the Steam page. */
export const AdNetworkSchema = z.enum(['meta', 'google-ads', 'tiktok', 'reddit', 'apple-search-ads']);
export type AdNetwork = z.infer<typeof AdNetworkSchema>;

/** What the campaign is buying. Networks name these differently; the gate
 *  maps each to what a given network supports. */
export const CampaignObjectiveSchema = z.enum(['awareness', 'traffic', 'wishlist', 'installs']);
export type CampaignObjective = z.infer<typeof CampaignObjectiveSchema>;

/** How a network's audiences are addressed — drives what the deploy brief
 *  asks the operator to fill in. */
export const AdTargetingKindSchema = z.enum(['interest', 'keyword', 'subreddit']);
export type AdTargetingKind = z.infer<typeof AdTargetingKindSchema>;

/** Per-network metadata — the "what a campaign entails on this network"
 *  knowledge, the campaign-side mirror of `STORE_SPECS`. The gate reads
 *  `objectives` (is this objective buyable here?) + `utmSource` (the value
 *  the beacon will see) + `targeting` (what the brief prompts for). */
export const AdNetworkSpecSchema = z.object({
  network: AdNetworkSchema,
  label: z.string(),
  /** The `utm_source` value ads on this network must tag (matches beacon). */
  utmSource: z.string(),
  /** Objectives this network can actually buy. */
  objectives: z.array(CampaignObjectiveSchema),
  /** How audiences are addressed on this network. */
  targeting: AdTargetingKindSchema,
  /** Which stores this network can send traffic to (`'any'` = web/all). */
  drivesTo: z.union([z.array(StoreTargetSchema), z.literal('any')]),
  /** Operator-facing note (quirks, review lead time). */
  note: z.string().default(''),
});
export type AdNetworkSpec = z.infer<typeof AdNetworkSpecSchema>;

/** Curated real-world network specs (2026). Single source of truth for the
 *  campaign gate + the deploy brief. */
export const AD_NETWORK_SPECS: Record<AdNetwork, AdNetworkSpec> = {
  meta: {
    network: 'meta',
    label: 'Meta (Facebook / Instagram)',
    utmSource: 'meta',
    objectives: ['awareness', 'traffic', 'installs'],
    targeting: 'interest',
    drivesTo: 'any',
    note: 'Interest + lookalike audiences; derive interests from the persona genre-affinity.',
  },
  'google-ads': {
    network: 'google-ads',
    label: 'Google Ads',
    utmSource: 'google',
    objectives: ['awareness', 'traffic', 'installs'],
    targeting: 'keyword',
    drivesTo: 'any',
    note: 'Search = keyword intent; UAC = app installs (Play). Provide seed keywords.',
  },
  tiktok: {
    network: 'tiktok',
    label: 'TikTok',
    utmSource: 'tiktok',
    objectives: ['awareness', 'traffic', 'installs'],
    targeting: 'interest',
    drivesTo: 'any',
    note: 'Video creative required; interest + behavior targeting.',
  },
  reddit: {
    network: 'reddit',
    label: 'Reddit',
    utmSource: 'reddit',
    objectives: ['awareness', 'traffic'],
    targeting: 'subreddit',
    drivesTo: 'any',
    note: 'Subreddit + interest targeting; strong for genre-niche communities.',
  },
  'apple-search-ads': {
    network: 'apple-search-ads',
    label: 'Apple Search Ads',
    utmSource: 'apple_search_ads',
    objectives: ['installs'],
    targeting: 'keyword',
    drivesTo: ['apple-app-store'],
    note: 'App Store keyword ads only; drives installs to the App Store listing.',
  },
};

/** Extra targeting the operator sets on an ad set, beyond the personas. */
export const AdTargetingSchema = z.object({
  interests: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  subreddits: z.array(z.string()).default([]),
  geos: z.array(z.string()).default([]),
  ageMin: z.number().int().min(13).optional(),
  ageMax: z.number().int().max(120).optional(),
});
export type AdTargeting = z.infer<typeof AdTargetingSchema>;

/** One ad set — a single (network → variant) cell of a campaign, with the
 *  audience it targets + its daily budget. This is the unit the operator
 *  creates in the ad manager + records spend against. */
export const AdSetSchema = z.object({
  id: z.string().min(1),
  network: AdNetworkSchema,
  /** The store-page variant this ad set drives to (id from the generated
   *  variants; the beacon's `data-mkt-variant` echoes it back). */
  variantId: z.string().min(1),
  /** Personas this ad set targets — traceability to the synthetic panel; the
   *  brief expands them into suggested interests/keywords. */
  personaIds: z.array(z.string()).default([]),
  /** Daily budget in USD. */
  dailyBudgetUsd: z.number().positive(),
  targeting: AdTargetingSchema.default({}),
});
export type AdSet = z.infer<typeof AdSetSchema>;

/** One campaign — an objective + a set of ad sets driving to the deployed
 *  pages, over a flight window. */
export const CampaignSchema = z.object({
  id: z.string().min(1),
  objective: CampaignObjectiveSchema,
  /** Base URL of the deployed pages (Vercel), e.g. `https://x.vercel.app`.
   *  The tagged landing URL per ad set is built from this + the variant. */
  landingBaseUrl: z.string().url(),
  adSets: z.array(AdSetSchema).min(1),
  /** ISO flight dates (informational; the gate sanity-checks ordering). */
  flightStart: z.string().optional(),
  flightEnd: z.string().optional(),
  note: z.string().default(''),
});
export type Campaign = z.infer<typeof CampaignSchema>;

/** The per-game campaign manifest (`campaign.config.ts`). */
export const CampaignConfigSchema = z.object({
  campaigns: z.array(CampaignSchema).min(1),
  /** UTM `medium` to tag (default `cpc`). */
  medium: z.string().default('cpc'),
});
export type CampaignConfig = z.infer<typeof CampaignConfigSchema>;
export type CampaignConfigInput = z.input<typeof CampaignConfigSchema>;

/** One operator-recorded ledger row — network-reported spend + funnel-top
 *  numbers for one ad set on one day. The beacon can't see ad spend or ad
 *  impressions (those live in the ad manager); the operator records them
 *  here, and the report joins them to the beacon-measured on-page outcomes. */
export const CampaignResultEntrySchema = z.object({
  campaignId: z.string().min(1),
  adSetId: z.string().min(1),
  /** ISO date (day granularity is fine). */
  date: z.string(),
  spendUsd: z.number().nonnegative(),
  /** Ad impressions the network reported (denominator for CPM). */
  adImpressions: z.number().int().nonnegative().optional(),
  /** Ad clicks the network reported (clicks to the landing page). */
  adClicks: z.number().int().nonnegative().optional(),
  note: z.string().optional(),
});
export type CampaignResultEntry = z.infer<typeof CampaignResultEntrySchema>;

/** The computed attribution for one ad set — operator spend joined to
 *  beacon-measured outcomes → cost-per-outcome. */
export const AdSetReportSchema = z.object({
  adSetId: z.string(),
  network: AdNetworkSchema,
  variantId: z.string(),
  spendUsd: z.number(),
  /** Network-reported (from the ledger). */
  adImpressions: z.number().int().nonnegative(),
  adClicks: z.number().int().nonnegative(),
  /** Beacon-measured (from the event store, scoped to this campaign). */
  pageViews: z.number().int().nonnegative(),
  ctaClicks: z.number().int().nonnegative(),
  wishlistCaptures: z.number().int().nonnegative(),
  /** Cost metrics (null when the denominator is 0). */
  cpmUsd: z.number().nullable(),
  costPerAdClickUsd: z.number().nullable(),
  costPerCtaUsd: z.number().nullable(),
  costPerWishlistUsd: z.number().nullable(),
  /** Funnel rates. */
  landingRate: z.number().nullable(), // pageViews / adClicks (did the click load?)
  ctaRate: z.number().nullable(), // ctaClicks / pageViews (on-page conversion)
});
export type AdSetReport = z.infer<typeof AdSetReportSchema>;

export const CampaignReportSchema = z.object({
  campaignId: z.string(),
  objective: CampaignObjectiveSchema,
  adSets: z.array(AdSetReportSchema),
  /** Totals across the campaign. */
  totalSpendUsd: z.number(),
  totalCtaClicks: z.number().int().nonnegative(),
  totalWishlistCaptures: z.number().int().nonnegative(),
  /** Blended cost per CTA click across the campaign (null if 0 clicks). */
  blendedCostPerCtaUsd: z.number().nullable(),
  /** The ad set with the lowest cost-per-CTA (the efficient channel). */
  bestAdSetId: z.string().nullable(),
});
export type CampaignReport = z.infer<typeof CampaignReportSchema>;
