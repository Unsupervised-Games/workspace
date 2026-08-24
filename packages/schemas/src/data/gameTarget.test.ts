import { describe, expect, it } from 'vitest';
import {
  DEFAULT_GAME_TARGET,
  GameTargetSchema,
  resolveGameTarget,
} from './gameTarget.js';

describe('resolveGameTarget', () => {
  it('absent descriptor → the TS/web default', () => {
    expect(resolveGameTarget(null)).toEqual(DEFAULT_GAME_TARGET);
    expect(resolveGameTarget(undefined)).toEqual(DEFAULT_GAME_TARGET);
    expect(resolveGameTarget(null).buildBackend).toBe('next-web');
    expect(resolveGameTarget(null).registryEmitters).toEqual(['typescript']);
  });

  it('fills omitted fields from the defaults (partial descriptor)', () => {
    const t = resolveGameTarget({ language: 'cpp' });
    expect(t.language).toBe('cpp');
    // Omitted → defaults, not dropped.
    expect(t.registryEmitters).toEqual(['typescript']);
    expect(t.buildBackend).toBe('next-web');
  });

  it('parses a full native descriptor with an external emitter command', () => {
    const t = resolveGameTarget({
      language: 'rust',
      registryEmitters: [
        {
          id: 'rust',
          command: 'cargo run -q -p asset-codegen --',
          output: 'src/generated/assets.rs',
        },
      ],
      buildBackend: 'native',
      build: { command: 'cargo build --release', artifact: 'target/release/game' },
      run: { command: 'target/release/game', qa: 'qa-input-ws' },
    });
    expect(t.language).toBe('rust');
    expect(t.buildBackend).toBe('native');
    const emitter = t.registryEmitters[0];
    expect(typeof emitter).toBe('object');
    expect(emitter).toMatchObject({ id: 'rust', output: 'src/generated/assets.rs' });
    expect(t.build?.artifact).toBe('target/release/game');
    expect(t.run?.qa).toBe('qa-input-ws');
  });

  it('accepts any language label (open, not a fixed set)', () => {
    expect(resolveGameTarget({ language: 'zig' }).language).toBe('zig');
    expect(resolveGameTarget({ language: 'some-future-lang' }).language).toBe(
      'some-future-lang',
    );
  });

  it('throws on a malformed descriptor (not a silent fallback)', () => {
    // buildBackend stays a closed enum.
    expect(() => resolveGameTarget({ buildBackend: 'unreal' })).toThrow();
    // registryEmitters must be an array, not a bare string.
    expect(() => resolveGameTarget({ registryEmitters: 'typescript' })).toThrow();
    // an external emitter missing `command`/`output` is malformed.
    expect(() =>
      resolveGameTarget({ registryEmitters: [{ id: 'rust' }] }),
    ).toThrow();
  });

  it('the default is a valid GameTarget', () => {
    expect(() => GameTargetSchema.parse(DEFAULT_GAME_TARGET)).not.toThrow();
  });
});
