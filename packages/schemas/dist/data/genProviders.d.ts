import { z } from 'zod';
/** One capability's provider + model + endpoint selection. */
export declare const GenProviderSelectionSchema: z.ZodObject<{
    /** Provider id — `'civitai'` / `'nim'` (image), `'elevenlabs'` / `'riva'`
     *  (voice), `'meshy'` / `'trellis'` (3D). Free-form so new providers don't
     *  need a schema bump. */
    provider: z.ZodString;
    /** Model / voice id within the provider (`'flux.1-dev'`,
     *  `'magpie-tts-multilingual'`, …). */
    model: z.ZodOptional<z.ZodString>;
    /** Endpoint invoke URL — the NVIDIA API Catalog URL (free tier) or a
     *  self-hosted container URL. */
    baseUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    provider: string;
    model?: string | undefined;
    baseUrl?: string | undefined;
}, {
    provider: string;
    model?: string | undefined;
    baseUrl?: string | undefined;
}>;
export type GenProviderSelection = z.infer<typeof GenProviderSelectionSchema>;
/** Per-capability platform provider config. A capability omitted ⇒ that
 *  capability's historical default vendor (image ⇒ CivitAI, voice ⇒ ElevenLabs,
 *  model ⇒ Meshy). */
export declare const GenProviderConfigSchema: z.ZodObject<{
    image: z.ZodOptional<z.ZodObject<{
        /** Provider id — `'civitai'` / `'nim'` (image), `'elevenlabs'` / `'riva'`
         *  (voice), `'meshy'` / `'trellis'` (3D). Free-form so new providers don't
         *  need a schema bump. */
        provider: z.ZodString;
        /** Model / voice id within the provider (`'flux.1-dev'`,
         *  `'magpie-tts-multilingual'`, …). */
        model: z.ZodOptional<z.ZodString>;
        /** Endpoint invoke URL — the NVIDIA API Catalog URL (free tier) or a
         *  self-hosted container URL. */
        baseUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    }, {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    }>>;
    voice: z.ZodOptional<z.ZodObject<{
        /** Provider id — `'civitai'` / `'nim'` (image), `'elevenlabs'` / `'riva'`
         *  (voice), `'meshy'` / `'trellis'` (3D). Free-form so new providers don't
         *  need a schema bump. */
        provider: z.ZodString;
        /** Model / voice id within the provider (`'flux.1-dev'`,
         *  `'magpie-tts-multilingual'`, …). */
        model: z.ZodOptional<z.ZodString>;
        /** Endpoint invoke URL — the NVIDIA API Catalog URL (free tier) or a
         *  self-hosted container URL. */
        baseUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    }, {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    }>>;
    model: z.ZodOptional<z.ZodObject<{
        /** Provider id — `'civitai'` / `'nim'` (image), `'elevenlabs'` / `'riva'`
         *  (voice), `'meshy'` / `'trellis'` (3D). Free-form so new providers don't
         *  need a schema bump. */
        provider: z.ZodString;
        /** Model / voice id within the provider (`'flux.1-dev'`,
         *  `'magpie-tts-multilingual'`, …). */
        model: z.ZodOptional<z.ZodString>;
        /** Endpoint invoke URL — the NVIDIA API Catalog URL (free tier) or a
         *  self-hosted container URL. */
        baseUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    }, {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    model?: {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
    image?: {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
    voice?: {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
}, {
    model?: {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
    image?: {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
    voice?: {
        provider: string;
        model?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
}>;
export type GenProviderConfig = z.infer<typeof GenProviderConfigSchema>;
/** The capabilities, in display order. */
export declare const GEN_PROVIDER_CAPABILITIES: readonly ["image", "voice", "model"];
export type GenProviderCapability = (typeof GEN_PROVIDER_CAPABILITIES)[number];
//# sourceMappingURL=genProviders.d.ts.map