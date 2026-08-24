import { z } from 'zod';
/** Canonical locale id. BCP-47 region-and-script tags are
 *  permitted (`en-US`, `pt-BR`, `zh-Hans-CN`). The runtime
 *  passes this string straight through to Intl APIs, so
 *  whatever the platform accepts is acceptable here. */
export declare const LocaleIdSchema: z.ZodString;
export type LocaleId = z.infer<typeof LocaleIdSchema>;
/** Text direction. `'auto'` defers to the platform — only useful
 *  for mixed-direction content the engine itself doesn't author;
 *  apps shipping ar / he / fa / ur explicitly set `'rtl'`. */
export declare const TextDirectionSchema: z.ZodEnum<["ltr", "rtl", "auto"]>;
export type TextDirection = z.infer<typeof TextDirectionSchema>;
/** Per-locale config registered at boot. The forge pipeline
 *  emits one of these per locale found under
 *  `assets-raw/i18n/`. Apps may register more at runtime via
 *  `registerLocale(world, config)` for hot-reload / DLC
 *  scenarios. */
export declare const LocaleConfigSchema: z.ZodObject<{
    id: z.ZodString;
    /** Human-readable label shown in the locale picker. Always
     *  authored in the locale's own language (`'日本語'`,
     *  `'العربية'`) — never in English. */
    label: z.ZodString;
    direction: z.ZodEnum<["ltr", "rtl", "auto"]>;
    /** Fallback locales tried in order before falling back to
     *  the runtime's global `fallbackLocale`. Empty array =
     *  fall through directly to the global default. Useful for
     *  `pt-BR` → `pt` → `en` chains. */
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
export declare const TranslationCatalogSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export type TranslationCatalog = z.infer<typeof TranslationCatalogSchema>;
/** Combined locale entry: config + catalog. Forge codegen
 *  emits one bundle per locale that the runtime consumes
 *  whole. */
export declare const LocaleBundleSchema: z.ZodObject<{
    config: z.ZodObject<{
        id: z.ZodString;
        /** Human-readable label shown in the locale picker. Always
         *  authored in the locale's own language (`'日本語'`,
         *  `'العربية'`) — never in English. */
        label: z.ZodString;
        direction: z.ZodEnum<["ltr", "rtl", "auto"]>;
        /** Fallback locales tried in order before falling back to
         *  the runtime's global `fallbackLocale`. Empty array =
         *  fall through directly to the global default. Useful for
         *  `pt-BR` → `pt` → `en` chains. */
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
    catalog: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    config: {
        id: string;
        label: string;
        direction: "ltr" | "rtl" | "auto";
        fallbacks: string[];
    };
    catalog: Record<string, string>;
}, {
    config: {
        id: string;
        label: string;
        direction: "ltr" | "rtl" | "auto";
        fallbacks?: string[] | undefined;
    };
    catalog: Record<string, string>;
}>;
export type LocaleBundle = z.infer<typeof LocaleBundleSchema>;
/** The runtime-contract version of the locale-bundle shape + the ICU
 *  MessageFormat subset a runtime must render (see
 *  docs/specs/runtime-conformance.md). Tracked as a constant rather than a
 *  payload field because bundles are inlined into the generated asset
 *  registry (`LOCALE_BUNDLES`) — adding a field would churn every localized
 *  game's `assets.ts`. Bump when the bundle shape OR the supported ICU subset
 *  changes. */
export declare const LOCALE_BUNDLE_VERSION = 1;
//# sourceMappingURL=i18n.d.ts.map