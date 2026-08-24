import { describe, expect, it } from 'vitest';
import {
  ASSET_MANIFEST_VERSION,
  DIALOGUE_SCRIPT_VERSION,
  DialogueScriptSchema,
  getRuntimeContract,
  LOCALE_BUNDLE_VERSION,
  QUEST_DEF_VERSION,
  QuestDefSchema,
  RUNTIME_CONTRACTS,
} from '../index.js';

describe('RUNTIME_CONTRACTS registry', () => {
  it('lists the five neutral runtime contracts', () => {
    expect(RUNTIME_CONTRACTS.map((c) => c.id)).toEqual([
      'asset-manifest',
      'dialogue-script',
      'quest-def',
      'locale-bundle',
      'qa-wire',
    ]);
  });

  it('each contract references its version constant', () => {
    expect(getRuntimeContract('asset-manifest')?.version).toBe(
      ASSET_MANIFEST_VERSION,
    );
    expect(getRuntimeContract('dialogue-script')?.version).toBe(
      DIALOGUE_SCRIPT_VERSION,
    );
    expect(getRuntimeContract('quest-def')?.version).toBe(QUEST_DEF_VERSION);
    expect(getRuntimeContract('locale-bundle')?.version).toBe(
      LOCALE_BUNDLE_VERSION,
    );
  });

  it('every contract names a schema, artifact, and direction', () => {
    for (const c of RUNTIME_CONTRACTS) {
      expect(c.schema.length).toBeGreaterThan(0);
      expect(c.artifact.length).toBeGreaterThan(0);
      expect(['engine-to-runtime', 'bidirectional']).toContain(c.direction);
    }
  });

  it('getRuntimeContract returns undefined for an unknown id', () => {
    // @ts-expect-error — not a valid contract id.
    expect(getRuntimeContract('nope')).toBeUndefined();
  });
});

describe('narrative artifacts carry an optional contract version', () => {
  it('DialogueScript accepts a version but does not require one', () => {
    // Existing / hand-authored scripts (no version) still parse.
    expect(
      DialogueScriptSchema.parse({
        id: 's',
        startNodeId: 'n',
        nodes: { n: { id: 'n', text: 'k', choices: [] } },
      }).version,
    ).toBeUndefined();
    // A stamped script round-trips the version.
    expect(
      DialogueScriptSchema.parse({
        version: DIALOGUE_SCRIPT_VERSION,
        id: 's',
        startNodeId: 'n',
        nodes: { n: { id: 'n', text: 'k', choices: [] } },
      }).version,
    ).toBe(DIALOGUE_SCRIPT_VERSION);
  });

  it('QuestDef accepts a version but does not require one', () => {
    const base = {
      id: 'q',
      displayName: 'k',
      description: 'k',
      steps: [{ kind: 'dialogue-completed', description: 'k', dialogueId: 'd' }],
    };
    expect(QuestDefSchema.parse(base).version).toBeUndefined();
    expect(
      QuestDefSchema.parse({ ...base, version: QUEST_DEF_VERSION }).version,
    ).toBe(QUEST_DEF_VERSION);
  });
});
