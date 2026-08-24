import { ASSET_MANIFEST_VERSION } from './assetManifest.js';
import { DIALOGUE_SCRIPT_VERSION } from './dialogue.js';
import { QUEST_DEF_VERSION } from './quest.js';
import { LOCALE_BUNDLE_VERSION } from './i18n.js';

// The RUNTIME-CONTRACT registry — the single source of truth for the
// language-neutral data a game RUNTIME consumes, so a game in ANY language
// (not just TypeScript) can implement against a precise, versioned surface.
//
// The build-side neutral contract is the asset manifest
// (docs/specs/language-agnostic-targets.md). This is its RUNTIME sibling:
// narrative (dialogue/quest), localization (locale bundles), and the QA drive
// channel are all neutral JSON with defined BEHAVIORAL obligations. The shapes
// live as zod schemas elsewhere in @unsupervised/schemas; this registry names them,
// versions them, and points at where each artifact is exchanged. The behavior
// a runtime must implement (dialogue traversal, the ICU subset, the QA
// handshake) is specified in docs/specs/runtime-conformance.md.
//
// Versioning follows the asset-manifest rule: bump a contract's version when
// its SHAPE (or, for the locale bundle, the supported ICU subset) changes —
// never when a game's content changes.

/** The QA wire protocol version. Mirror of @unsupervised/qa-input-ws'
 *  `HANDSHAKE_PROTOCOL_VERSION` — kept as a local constant because
 *  @unsupervised/schemas is the innermost layer and can't import the transport.
 *  Keep the two in sync; a mismatch is a contract bug. */
export const QA_WIRE_PROTOCOL_VERSION = 1;

export type RuntimeContractDirection =
  /** The engine emits it; the game's runtime loads it. */
  | 'engine-to-runtime'
  /** Exchanged both ways between the game and its QA parent. */
  | 'bidirectional';

export interface RuntimeContract {
  /** Stable id. */
  id:
    | 'asset-manifest'
    | 'dialogue-script'
    | 'quest-def'
    | 'locale-bundle'
    | 'qa-wire';
  /** Current contract version. */
  version: number;
  /** The @unsupervised/schemas symbol(s) that define the shape. */
  schema: string;
  /** Where the artifact lives / how it's exchanged. */
  artifact: string;
  direction: RuntimeContractDirection;
  /** One-line description of what a runtime does with it. */
  summary: string;
}

export const RUNTIME_CONTRACTS: readonly RuntimeContract[] = [
  {
    id: 'asset-manifest',
    version: ASSET_MANIFEST_VERSION,
    schema: 'AssetManifestSchema',
    artifact: 'lib/generated/asset-manifest.json',
    direction: 'engine-to-runtime',
    summary:
      'Every asset id → public path, plus the nested navmesh / tilecache / locale manifests.',
  },
  {
    id: 'dialogue-script',
    version: DIALOGUE_SCRIPT_VERSION,
    schema: 'DialogueScriptSchema',
    artifact: 'assets-raw/data/dialogue/<scene>.dialogue.json',
    direction: 'engine-to-runtime',
    summary:
      'A dialogue node graph (object-keyed by id); every node/choice text field is an i18n key.',
  },
  {
    id: 'quest-def',
    version: QUEST_DEF_VERSION,
    schema: 'QuestDefSchema',
    artifact: 'assets-raw/data/quests/<scene>.quest.json',
    direction: 'engine-to-runtime',
    summary:
      'A linear multi-step quest (six step kinds); displayName / description / step text are i18n keys.',
  },
  {
    id: 'locale-bundle',
    version: LOCALE_BUNDLE_VERSION,
    schema: 'LocaleBundleSchema',
    artifact: 'assets-raw/i18n/<locale>.json',
    direction: 'engine-to-runtime',
    summary:
      'Locale config + a flat dotted-key catalog of ICU-subset message strings the runtime renders.',
  },
  {
    id: 'qa-wire',
    version: QA_WIRE_PROTOCOL_VERSION,
    schema: 'QaWsFrameSchema / QaInputCommandSchema / TelemetryEventWire',
    artifact: 'postMessage frames, or a localhost ws:// bridge',
    direction: 'bidirectional',
    summary:
      'The QA drive channel: input commands + state injection in, telemetry out; handshake + acks.',
  },
] as const;

/** Look up a contract by id. */
export function getRuntimeContract(
  id: RuntimeContract['id'],
): RuntimeContract | undefined {
  return RUNTIME_CONTRACTS.find((c) => c.id === id);
}
