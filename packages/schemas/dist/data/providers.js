import { z } from 'zod';
/** Per-capability provider + model selection, shared by the asset + audio
 *  generation pipelines. The load-bearing rule: provider/model are
 *  RESOLUTION, not IDENTITY — each pipeline EXCLUDES them from its cache
 *  fingerprint, so switching a vendor (CivitAI ⇄ NIM, ElevenLabs ⇄ Riva)
 *  never invalidates or re-rolls an existing asset. Switching changes only
 *  what a FRESH generation uses; getting a different provider's output for an
 *  already-cached asset is an explicit regenerate (`forceFresh`).
 *  See docs/specs/multi-provider-generation.md. */
export const ProviderSelectionSchema = z.object({
    /** Provider id — the registry key (`'civitai'`, `'nim'`, `'elevenlabs'`,
     *  `'riva'`, …). */
    provider: z.string().min(1),
    /** Model / voice id within the provider (`'flux.1-dev'`, `'z-image'`, an
     *  ElevenLabs model, a Riva voice, …). Omitted ⇒ the provider's default or
     *  the sidecar's own params. */
    model: z.string().min(1).optional(),
    /** Endpoint base URL — for NIM, the NVIDIA API Catalog invoke URL (free
     *  tier) now or a self-hosted container URL later. Provider default when
     *  omitted. */
    baseUrl: z.string().url().optional(),
});
//# sourceMappingURL=providers.js.map