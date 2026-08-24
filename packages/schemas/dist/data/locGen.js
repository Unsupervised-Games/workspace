// loc-gen — build-time translation-generation config + provenance.
//
// Sibling to `audioGen.ts` (voice / sfx / music) and `assetGen.ts`
// (3D models). Where those pipelines synthesize NEW assets from a
// prompt, this one TRANSLATES an existing, hand-authored source
// catalog into the game's other locales.
//
// The division of labour:
//
//   1. SOURCE (hand-authored, the single source of truth)
//        assets-raw/i18n/<sourceLocale>.json   — a `LocaleBundle`
//      The author writes `en.json` (or whatever `sourceLocale` is)
//      by hand. loc-gen never touches it.
//
//   2. CONFIG (per-game, hand-authored)
//        games/<game>/loc-gen.config.ts         — a `LocGenConfig`
//      Declares the target locales, the translation model, the
//      project style guide + glossary, and the same budget / policy
//      governance the audio + asset pipelines use.
//
//   3. GENERATED OUTPUT (emitted by forge's locGenPipeline)
//        assets-raw/i18n/<locale>.json          — a `LocaleBundle`
//      The translated catalog for each target locale. Emitted BEFORE
//      the existing i18nPipeline runs, so the typed `LOCALE_BUNDLES`
//      / `LocaleId` / `TranslationKey` codegen consumes it unchanged.
//
//   4. SIDECAR (emitted alongside each output, the provenance ledger)
//        assets-raw/i18n/<locale>.locgen.json   — a `LocGenSidecar`
//      Per-key provenance + the lock flag that pins a shipped
//      translation against accidental regeneration — the loc-gen
//      analogue of an audio sidecar's `lockedHash`.
//
// The cache key for one key's translation is
// `hash(sourceString, targetLocale, projectStyleGuide,
//       localeStyleGuide, relevantGlossary, packageVersion)` — so a
// source-string edit, a glossary change, or a style-guide change
// re-translates ONLY the affected keys, and nothing else re-bills.
import { z } from 'zod';
import { LocaleConfigSchema, LocaleIdSchema } from './i18n.js';
/** How a single term is handled during translation. The glossary is
 *  the lever for domain vocabulary an LLM would otherwise "helpfully"
 *  translate or mistranslate — proper nouns (`Komorebi`, `Kodama`),
 *  coined game terms, and words that must render a specific way in a
 *  given locale for consistency with UI already shipped. */
export const GlossaryEntrySchema = z.object({
    /** Leave this term verbatim in every locale. Proper nouns, brand
     *  names, coined terms. When true, `translations` is ignored. */
    doNotTranslate: z.boolean().default(false),
    /** Forced per-locale renderings. `{ ja: '巫女', fr: 'prêtresse' }`
     *  pins how `shrine maiden` MUST read in each locale. Locales
     *  absent from this map are translated normally (subject to the
     *  style guide). */
    translations: z.record(LocaleIdSchema, z.string().min(1)).default({}),
    /** Author note surfaced to the translator model as guidance —
     *  e.g. "keep the reverent register; this is a sacred title." */
    note: z.string().optional(),
});
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
export const LocReviewConfigSchema = z.object({
    /** Master switch for the interpretive judge. Default OFF. */
    enabled: z.boolean().default(false),
    /** In-forge posture on a `fail` verdict:
     *    - `'flag'`  — record the verdict, change nothing (default).
     *    - `'retry'` — re-translate the SAME key up to
     *      `maxAttemptsPerKey`, feeding the judge's rationale back as
     *      guidance (for non-deterministic model output). */
    failVerdictAction: z.enum(['flag', 'retry']).default('flag'),
    /** Max translation attempts per key the retry loop may make.
     *  Bounds the loop alongside the budget cap. */
    maxAttemptsPerKey: z.number().int().min(1).max(5).default(2),
    /** Judge model for the perceptual criterion. Defaults to
     *  `claude-sonnet-5` — the cost/quality sweet spot for a
     *  high-volume text-classify task. */
    judgeModel: z.string().min(1).default('claude-sonnet-5'),
    /** How the judge reaches Claude — matches audio-gen:
     *    - `'claude-cli'` — spawn the `claude` CLI (subscription-billed,
     *      no api key).
     *    - `'api'` — direct Anthropic call (needs `ANTHROPIC_API_KEY`).
     *    - `'auto'` (default) — CLI when `claude` resolves on PATH, else
     *      the API key. */
    judgeProvider: z.enum(['auto', 'api', 'claude-cli']).default('auto'),
    /** Path to the `claude` binary. Empty = resolve from PATH. */
    claudeCliPath: z.string().optional(),
    /** Flag a bare `concern` verdict (or a degraded judge) for human
     *  review — the confidence-gated escalation surfaced in the
     *  approval `queue` as `needs-review`. Shared with the audio + asset
     *  pipelines via `@unsupervised/ai-review`'s `computeEscalation`. */
    escalateConcern: z.boolean().default(true),
    /** N-vote judge panel. A single judge is uncalibrated; a panel runs
     *  `jurors` independent votes (each on a distinct lens when
     *  `diverseLenses`), takes the majority, and escalates a split
     *  below `escalateBelowAgreement`. `jurors: 1` (default) is the
     *  single-vote behavior. Billed per juror. Aggregation shared via
     *  `@unsupervised/ai-review`. */
    panel: z
        .object({
        jurors: z.number().int().min(1).max(5).default(1),
        diverseLenses: z.boolean().default(true),
        escalateBelowAgreement: z.number().min(0).max(1).default(0.67),
    })
        .default({}),
});
/** One target locale to generate. Carries the runtime `LocaleConfig`
 *  the emitted bundle needs (label, direction, fallbacks) plus an
 *  optional per-locale style guide layered on top of the project one. */
export const TargetLocaleSchema = z.object({
    config: LocaleConfigSchema,
    /** Per-locale translation art-direction, appended AFTER the
     *  project-wide `styleGuide`. The place to encode formality /
     *  register decisions specific to one language — e.g. for `ja`:
     *  "use 敬語 for shrine dialogue; plain form for combat barks." */
    styleGuide: z.string().optional(),
});
/** Per-game loc-gen config. Authored as `games/<game>/loc-gen.config.ts`
 *  and annotated with `LocGenConfigInput` so defaults may be omitted.
 *  Mirrors `AudioStyleConfig`'s governance fields exactly (budget caps,
 *  lifetime ceiling, spend authorization, banned terms) so a
 *  `budgetLifetimeUsd` cap + an `authorize --up-to` grant bound this
 *  pipeline the same way they bound the other two — one implementation
 *  in `@unsupervised/gen-core`. */
export const LocGenConfigSchema = z.object({
    /** The hand-authored catalog every target translates FROM. */
    sourceLocale: LocaleIdSchema.default('en'),
    /** The locales to generate. Empty = the pipeline no-ops. */
    targetLocales: z.array(TargetLocaleSchema).default([]),
    /** Translation model id. Defaults to `claude-sonnet-5` — strong
     *  multilingual quality at a high-volume-friendly output cost. */
    model: z.string().min(1).default('claude-sonnet-5'),
    /** Project-wide translation art-direction, prepended to every
     *  translation request (the loc-gen analogue of audio's
     *  `stylePrefix`). Participates in the cache hash — editing it
     *  re-translates every unlocked key deliberately. Example for
     *  komorebi: "Preserve the melancholic, folkloric register.
     *  Period-appropriate diction; no modern slang or loanwords." */
    styleGuide: z.string().default(''),
    /** Domain vocabulary handling, keyed by the source term. */
    glossary: z.record(z.string().min(1), GlossaryEntrySchema).default({}),
    /** Soft cap on per-run spend (USD). Projected cost crossing it
     *  WARNS but continues. */
    budgetSoftUsd: z.number().nonnegative().default(1),
    /** Hard cap on per-run spend (USD). Aborts the run when a key's
     *  projected cost would push the session past it. */
    budgetHardUsd: z.number().nonnegative().default(5),
    /** LIFETIME spend ceiling (USD) — cumulative across every run,
     *  summed from the audit log. Undefined ⇒ no lifetime cap. The
     *  AI-pilot backstop; shared via `@unsupervised/gen-core`'s spend
     *  guardrails. */
    budgetLifetimeUsd: z.number().nonnegative().optional(),
    /** Require an explicit, bounded, unexpired spend authorization
     *  before any translation call (the propose-approve gate). Off by
     *  default (human-driven runs spend freely); turn on for
     *  autonomous / CI contexts. Granted via
     *  `loc-gen authorize --up-to <usd>`. */
    requireSpendAuthorization: z.boolean().default(false),
    /** Project-wide banned-term list. A translated string containing
     *  any of these is rejected (`translation-rejected`) before it
     *  reaches the output — the L1 content gate. Checked on OUTPUT (the
     *  translation), since the source is author-controlled. */
    bannedTerms: z.array(z.string().min(1)).default([]),
    /** L3-review config. Optional + opt-in; omitted ⇒ the interpretive
     *  judge never runs (the deterministic placeholder gate still
     *  does). See `LocReviewConfigSchema`. */
    review: LocReviewConfigSchema.optional(),
});
/** Shared review verdict vocabulary, re-declared here so the schema
 *  layer doesn't depend on `@unsupervised/ai-review`. Identical values. */
export const LocVerdictSchema = z.enum(['pass', 'concern', 'fail']);
/** Per-key provenance record on the sidecar. One entry per
 *  translated key. */
export const LocGenKeyRecordSchema = z.object({
    /** The cache hash this translation was produced under. Stale when
     *  the recomputed hash differs (source / style / glossary drift). */
    sourceHash: z.string().min(1),
    /** ISO timestamp of the generation that produced the shipped text. */
    translatedAt: z.string().min(1),
    /** Cost in USD attributed to this key's most recent translation.
     *  Zero for cache hits. */
    costUsd: z.number().nonnegative().default(0),
    /** When true, this key is PINNED: the pipeline will not
     *  re-translate it even if the source drifts — the analogue of an
     *  audio sidecar's `lockedHash`. Set by `loc-gen approve`. */
    locked: z.boolean().default(false),
    /** Most recent L3 verdict for this key, when the interpretive judge
     *  ran. */
    verdict: LocVerdictSchema.optional(),
});
/** The generation sidecar written alongside each emitted
 *  `<locale>.json`. Provenance + lock ledger; NOT consumed by the
 *  runtime (the runtime reads only the emitted `LocaleBundle`). */
export const LocGenSidecarSchema = z.object({
    locale: LocaleIdSchema,
    sourceLocale: LocaleIdSchema,
    /** Per-key provenance, keyed by translation key. */
    keys: z.record(z.string(), LocGenKeyRecordSchema).default({}),
    /** ISO timestamp of the most recent generation touching this
     *  locale. */
    lastGeneratedAt: z.string().optional(),
    /** Cumulative USD spent generating this locale across all runs. */
    totalCostUsd: z.number().nonnegative().default(0),
});
/** Approval-ledger entry — the human sign-off record, per locale.
 *  Mirrors the audio / asset approval shape. `slot` is the locale id
 *  (approval is per-locale: you review a locale's translations
 *  together and sign the whole set off, which pins every non-rejected
 *  key on the sidecar). Shared ledger machinery via `@unsupervised/gen-core`. */
export const LocApprovalEntrySchema = z.object({
    /** The locale id being signed off. */
    slot: LocaleIdSchema,
    status: z.enum(['approved', 'rejected']),
    /** Who signed off (optional attribution). */
    who: z.string().optional(),
    at: z.string().min(1),
    /** Rationale — required by convention on a `reject`. */
    note: z.string().optional(),
    /** Count of keys locked at approval time (provenance). */
    keyCount: z.number().int().nonnegative().default(0),
});
/** The on-disk ledger wrapper (`.loc-gen-approvals.json`). Shape
 *  matches `@unsupervised/gen-core`'s `ApprovalLedger<E>`. */
export const LocApprovalLedgerSchema = z.object({
    schemaVersion: z.literal(1).default(1),
    entries: z.array(LocApprovalEntrySchema).default([]),
});
//# sourceMappingURL=locGen.js.map