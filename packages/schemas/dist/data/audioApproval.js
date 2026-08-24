// Audio-approval ledger — the durable record of a HUMAN's ship /
// no-ship decision on a generated audio asset. The audio sibling of
// `assetApproval.ts`; both feed the shared `@unsupervised/gen-core`
// approval-ledger store (only the `kind` enum + the on-disk filename
// differ). Lives at `<rootDir>/.audio-gen-approvals.json`, keyed by
// the `<kind>/<slot>` id review + drift already use.
import { z } from 'zod';
/** A human's decision on a generated audio asset. `approved` ⇒ locked
 *  (shipped); `rejected` ⇒ sent back for rework, with a note. */
export const AudioApprovalStateSchema = z.enum(['approved', 'rejected']);
export const AudioApprovalEntrySchema = z.object({
    /** `<kind>/<slot>` id (e.g. `voice/sora-opening`). */
    slot: z.string().min(1),
    kind: z.enum(['voice', 'sfx', 'music']),
    state: AudioApprovalStateSchema,
    decidedAt: z.string(),
    /** Reviewer rationale — required for `rejected`, optional for
     *  `approved`. */
    note: z.string().optional(),
    /** The RECIPE hash at decision time. Audio has one content hash
     *  (`computeHash`, package-version-baked), so `recipeHash` +
     *  `fullHash` carry it identically until a version-stripped recipe
     *  hash lands with pinning; the queue compares it to the current
     *  hash to flag a STALE approval. */
    recipeHash: z.string(),
    fullHash: z.string(),
    /** Optional reviewer identity (email / handle). */
    by: z.string().optional(),
});
/** The whole ledger. One entry per slot (latest decision wins — the
 *  store upserts by slot). */
export const AudioApprovalLedgerSchema = z.object({
    schemaVersion: z.literal(1),
    entries: z.array(AudioApprovalEntrySchema),
});
//# sourceMappingURL=audioApproval.js.map