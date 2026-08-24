import { z } from 'zod';
// The platform-owner generation-provider config — the shape the vendor console
// edits and the AdminStore persists (platform-admin-gated). It is the
// OWNER-facing counterpart to the runner's env selection
// (`ATELIER_<CAP>_PROVIDER`, gen-core `readProviderSelection`): the owner sets
// it here, the console shows the env to apply on the generation runner, and the
// runner reads that env. NEVER exposed to a customer org. See
// docs/specs/multi-provider-generation.md.
/** One capability's provider + model + endpoint selection. */
export const GenProviderSelectionSchema = z.object({
    /** Provider id — `'civitai'` / `'nim'` (image), `'elevenlabs'` / `'riva'`
     *  (voice), `'meshy'` / `'trellis'` (3D). Free-form so new providers don't
     *  need a schema bump. */
    provider: z.string().min(1),
    /** Model / voice id within the provider (`'flux.1-dev'`,
     *  `'magpie-tts-multilingual'`, …). */
    model: z.string().min(1).optional(),
    /** Endpoint invoke URL — the NVIDIA API Catalog URL (free tier) or a
     *  self-hosted container URL. */
    baseUrl: z.string().url().optional(),
});
/** Per-capability platform provider config. A capability omitted ⇒ that
 *  capability's historical default vendor (image ⇒ CivitAI, voice ⇒ ElevenLabs,
 *  model ⇒ Meshy). */
export const GenProviderConfigSchema = z.object({
    image: GenProviderSelectionSchema.optional(),
    voice: GenProviderSelectionSchema.optional(),
    model: GenProviderSelectionSchema.optional(),
});
/** The capabilities, in display order. */
export const GEN_PROVIDER_CAPABILITIES = ['image', 'voice', 'model'];
//# sourceMappingURL=genProviders.js.map