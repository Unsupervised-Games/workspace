// Tests for the Phase 2026-Q2 schema additions:
//   - 'extend-existing' classification + ExtensionTargetSchema +
//     the cross-reference refinement in parseFeatureDecomposition.
//   - OperatorResolutionSchema with the reasoning-length floor.
// The pre-existing decomposition surface is exercised by the
// skill-builder golden test against bullet-time.

import { describe, expect, it } from 'vitest';
import {
  ExtensionTargetSchema,
  OperatorResolutionSchema,
  parseFeatureDecomposition,
} from './decomposition.js';

function baseDecomposition(overrides: { capabilities?: unknown[] }): unknown {
  return {
    schemaVersion: 1,
    featureId: 'test-feature',
    featureName: 'Test feature',
    researchRunId: 'test-run',
    originatingPrompt: 'p',
    reportPath: './report.md',
    generatedAt: '2026-06-13T00:00:00.000Z',
    summary: 's',
    capabilities: overrides.capabilities ?? [
      {
        id: 'cap-a',
        name: 'Capability A',
        purpose: 'p',
        classification: 'game-code',
        classificationReasoning: 'r',
        reusabilitySignals: [],
        existingPackageMatch: null,
        dependsOn: [],
      },
    ],
    assertions: [],
    apiSketches: [],
    citedSources: [],
    openQuestions: [],
    registrySnapshot: {
      registryPath: '/r.json',
      contentHash: 'h',
      packageIds: [],
      generatedAt: '2026-06-13T00:00:00.000Z',
    },
  };
}

describe('ExtensionTargetSchema', () => {
  it('parses a minimal extension target', () => {
    const parsed = ExtensionTargetSchema.parse({
      packageId: '@unsupervised/features',
      extensionSketch:
        'export function setAvoidBonus(world: World, tile: Tile, bonus: number): void;',
    });
    expect(parsed.packageId).toBe('@unsupervised/features');
    expect(parsed.subCapability).toBeUndefined();
  });

  it('parses with optional subCapability', () => {
    const parsed = ExtensionTargetSchema.parse({
      packageId: '@unsupervised/features',
      subCapability: 'grid',
      extensionSketch:
        'export interface TileMetadataExtension { avoidBonus?: number; defenseBonus?: number; }',
    });
    expect(parsed.subCapability).toBe('grid');
  });

  it('rejects extensionSketch shorter than 50 chars', () => {
    expect(() =>
      ExtensionTargetSchema.parse({
        packageId: '@unsupervised/features',
        extensionSketch: 'too short',
      }),
    ).toThrow(/extensionSketch/);
  });

  it('rejects malformed packageId (missing @unsupervised prefix)', () => {
    expect(() =>
      ExtensionTargetSchema.parse({
        packageId: 'features',
        extensionSketch:
          'export function setAvoidBonus(world: World, tile: Tile, bonus: number): void;',
      }),
    ).toThrow();
  });
});

describe('OperatorResolutionSchema', () => {
  it('parses a minimal resolution', () => {
    const parsed = OperatorResolutionSchema.parse({
      resolvedAt: '2026-06-13T12:00:00.000Z',
      decision: 'existing',
      reasoning:
        'Operator confirmed multiple SRPGs expected; standardise on grid schema extension.',
    });
    expect(parsed.decision).toBe('existing');
    expect(parsed.operatorIdentity).toBeUndefined();
  });

  it('preserves operatorIdentity when provided', () => {
    const parsed = OperatorResolutionSchema.parse({
      resolvedAt: '2026-06-13T12:00:00.000Z',
      decision: 'existing',
      reasoning:
        'Operator confirmed multiple SRPGs expected; standardise on grid schema.',
      operatorIdentity: 'ren',
    });
    expect(parsed.operatorIdentity).toBe('ren');
  });

  it('rejects reasoning shorter than 30 chars', () => {
    expect(() =>
      OperatorResolutionSchema.parse({
        resolvedAt: '2026-06-13T12:00:00.000Z',
        decision: 'existing',
        reasoning: 'too short',
      }),
    ).toThrow(/reasoning/);
  });

  it('rejects non-ISO timestamps', () => {
    expect(() =>
      OperatorResolutionSchema.parse({
        resolvedAt: 'yesterday',
        decision: 'existing',
        reasoning:
          'Operator confirmed multiple SRPGs expected; standardise on grid schema.',
      }),
    ).toThrow();
  });
});

describe('parseFeatureDecomposition — extend-existing refinement', () => {
  it('accepts an extend-existing capability with extensionTarget', () => {
    const decomp = baseDecomposition({
      capabilities: [
        {
          id: 'cap-terrain',
          name: 'Terrain effects',
          purpose: 'extend grid',
          classification: 'extend-existing',
          classificationReasoning: 'r',
          reusabilitySignals: [],
          existingPackageMatch: null,
          extensionTarget: {
            packageId: '@unsupervised/features',
            subCapability: 'grid',
            extensionSketch:
              'export interface TileEffects { avoidBonus?: number; defenseBonus?: number; }',
          },
          dependsOn: [],
        },
      ],
    });
    const parsed = parseFeatureDecomposition(decomp);
    expect(parsed.capabilities[0]?.classification).toBe('extend-existing');
    expect(parsed.capabilities[0]?.extensionTarget?.packageId).toBe(
      '@unsupervised/features',
    );
  });

  it('rejects an extend-existing capability missing extensionTarget', () => {
    const decomp = baseDecomposition({
      capabilities: [
        {
          id: 'cap-terrain',
          name: 'Terrain effects',
          purpose: 'extend grid',
          classification: 'extend-existing',
          classificationReasoning: 'r',
          reusabilitySignals: [],
          existingPackageMatch: null,
          // no extensionTarget
          dependsOn: [],
        },
      ],
    });
    expect(() => parseFeatureDecomposition(decomp)).toThrow(
      /extensionTarget/,
    );
  });

  it('accepts a capability with operatorResolution attached', () => {
    const decomp = baseDecomposition({
      capabilities: [
        {
          id: 'cap-resolved',
          name: 'Was uncertain',
          purpose: 'p',
          classification: 'existing',
          classificationReasoning: 'r',
          reusabilitySignals: [],
          existingPackageMatch: {
            packageId: '@unsupervised/features',
            subCapability: 'grid',
            confidence: 0.7,
          },
          operatorResolution: {
            resolvedAt: '2026-06-13T12:00:00.000Z',
            decision: 'existing',
            reasoning:
              'Operator confirmed multiple SRPGs expected; extension tracked as separate engine work.',
            operatorIdentity: 'ren',
          },
          dependsOn: [],
        },
      ],
    });
    const parsed = parseFeatureDecomposition(decomp);
    expect(parsed.capabilities[0]?.operatorResolution?.decision).toBe(
      'existing',
    );
  });

  it('accepts an existing-shape decomposition WITHOUT new fields (backward compat)', () => {
    const parsed = parseFeatureDecomposition(baseDecomposition({}));
    expect(parsed.capabilities[0]?.extensionTarget).toBeUndefined();
    expect(parsed.capabilities[0]?.operatorResolution).toBeUndefined();
  });
});
