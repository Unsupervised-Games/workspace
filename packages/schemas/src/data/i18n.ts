// i18n catalog + locale-config shapes.
//
// Two schemas paired by the locale id string:
//
//   1. `LocaleConfig` — per-locale metadata: display label,
//      text direction, fallback chain, BCP-47 tag used for
//      `Intl.PluralRules` / `Intl.NumberFormat` /
//      `Intl.DateTimeFormat`. Authored once per locale; the
//      forge i18n pipeline bundles every config into the
//      generated registry.
//
//   2. `TranslationCatalog` — flat dotted-key map of message
//      strings, ICU MessageFormat subset. Authored as
//      `assets-raw/i18n/<locale>.json`; forge validates the
//      shape via this schema before codegen.
//
// The runtime store (`@unsupervised/features/i18n`) consumes both:
// `LocaleConfig.direction` drives the `dir` attribute applied
// at the React provider; `TranslationCatalog` powers the `t()`
// lookup with `Intl.PluralRules`-driven category selection.

import { z } from 'zod';

/** Canonical locale id. BCP-47 region-and-script tags are
 *  permitted (`en-US`, `pt-BR`, `zh-Hans-CN`). The runtime
 *  passes this string straight through to Intl APIs, so
 *  whatever the platform accepts is acceptable here. */
export const LocaleIdSchema = z
  .string()
  .min(2, 'locale id must be at least 2 characters (BCP-47)')
  .regex(
    /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/,
    'locale id must be a BCP-47 tag (e.g. `en`, `en-US`, `zh-Hans-CN`)',
  );
export type LocaleId = z.infer<typeof LocaleIdSchema>;

/** Text direction. `'auto'` defers to the platform — only useful
 *  for mixed-direction content the engine itself doesn't author;
 *  apps shipping ar / he / fa / ur explicitly set `'rtl'`. */
export const TextDirectionSchema = z.enum(['ltr', 'rtl', 'auto']);
export type TextDirection = z.infer<typeof TextDirectionSchema>;

/** Per-locale config registered at boot. The forge pipeline
 *  emits one of these per locale found under
 *  `assets-raw/i18n/`. Apps may register more at runtime via
 *  `registerLocale(world, config)` for hot-reload / DLC
 *  scenarios. */
export const LocaleConfigSchema = z.object({
  id: LocaleIdSchema,
  /** Human-readable label shown in the locale picker. Always
   *  authored in the locale's own language (`'日本語'`,
   *  `'العربية'`) — never in English. */
  label: z.string().min(1),
  direction: TextDirectionSchema,
  /** Fallback locales tried in order before falling back to
   *  the runtime's global `fallbackLocale`. Empty array =
   *  fall through directly to the global default. Useful for
   *  `pt-BR` → `pt` → `en` chains. */
  fallbacks: z.array(LocaleIdSchema).default([]),
});
export type LocaleConfig = z.infer<typeof LocaleConfigSchema>;

/** Flat dotted-key catalog. Values are ICU MessageFormat
 *  subset strings:
 *
 *    - Interpolation:  `Hello, {name}!`
 *    - Plural:         `{count, plural, one {1 apple} other {# apples}}`
 *    - Select:         `{gender, select, female {she} male {he} other {they}}`
 *    - Number:         `Price: {value, number}`
 *    - Currency:       `Price: {value, number, currency}`  (uses locale's currency convention)
 *    - Date short:     `{when, date, short}`
 *    - Date long:      `{when, date, long}`
 *
 *  Keys are arbitrary dotted strings; the forge codegen folds
 *  them into a `TranslationKey` union for autocomplete. The
 *  runtime is a flat object access — namespaces are an
 *  authoring convention, not a runtime hierarchy.
 *
 *  Missing keys fall through the locale's `fallbacks` chain,
 *  then the global fallback, then to the key string itself
 *  with a single dev-mode console warn per `(locale, key)`. */
export const TranslationCatalogSchema = z.record(z.string(), z.string());
export type TranslationCatalog = z.infer<typeof TranslationCatalogSchema>;

/** Combined locale entry: config + catalog. Forge codegen
 *  emits one bundle per locale that the runtime consumes
 *  whole. */
export const LocaleBundleSchema = z.object({
  config: LocaleConfigSchema,
  catalog: TranslationCatalogSchema,
});
export type LocaleBundle = z.infer<typeof LocaleBundleSchema>;

/** The runtime-contract version of the locale-bundle shape + the ICU
 *  MessageFormat subset a runtime must render (see
 *  docs/specs/runtime-conformance.md). Tracked as a constant rather than a
 *  payload field because bundles are inlined into the generated asset
 *  registry (`LOCALE_BUNDLES`) — adding a field would churn every localized
 *  game's `assets.ts`. Bump when the bundle shape OR the supported ICU subset
 *  changes. */
export const LOCALE_BUNDLE_VERSION = 1;
