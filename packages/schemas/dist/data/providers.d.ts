import { z } from 'zod';
/** Per-capability provider + model selection, shared by the asset + audio
 *  generation pipelines. The load-bearing rule: provider/model are
 *  RESOLUTION, not IDENTITY — each pipeline EXCLUDES them from its cache
 *  fingerprint, so switching a vendor (CivitAI ⇄ NIM, ElevenLabs ⇄ Riva)
 *  never invalidates or re-rolls an existing asset. Switching changes only
 *  what a FRESH generation uses; getting a different provider's output for an
 *  already-cached asset is an explicit regenerate (`forceFresh`).
 *  See docs/specs/multi-provider-generation.md. */
export declare const ProviderSelectionSchema: z.ZodObject<{
    /** Provider id — the registry key (`'civitai'`, `'nim'`, `'elevenlabs'`,
     *  `'riva'`, …). */
    provider: z.ZodString;
    /** Model / voice id within the provider (`'flux.1-dev'`, `'z-image'`, an
     *  ElevenLabs model, a Riva voice, …). Omitted ⇒ the provider's default or
     *  the sidecar's own params. */
    model: z.ZodOptional<z.ZodString>;
    /** Endpoint base URL — for NIM, the NVIDIA API Catalog invoke URL (free
     *  tier) now or a self-hosted container URL later. Provider default when
     *  omitted. */
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
export type ProviderSelection = z.infer<typeof ProviderSelectionSchema>;
//# sourceMappingURL=providers.d.ts.map