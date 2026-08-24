// Tests for the Phase 2026-Q2 BuildPlan schema additions:
//   - Blocker.id (deterministic) + Blocker.allowedResolutions.
//   - 'extend-existing' classification on WorkItem + parseBuildPlan
//     refinement around outcome-field exclusivity.
// Pre-existing surface is exercised through the skill-builder
// golden test against bullet-time.

import { describe, expect, it } from 'vitest';
import { blockerIdFor, BlockerSchema, parseBuildPlan } from './buildPlan.js';

function basePlan(overrides: {
  workItems?: unknown[];
  roundCount?: number;
}): unknown {
  return {
    schemaVersion: 1,
    generatedAt: '2026-06-13T00:00:00.000Z',
    featureId: 'test',
    decompositionPath: './decomposition.json',
    drift: {
      contentHashAtResearch: 'h1',
      contentHashAtBuild: 'h1',
      drifted: false,
      invalidatedCapabilities: [],
    },
    workItems: overrides.workItems ?? [],
    roundCount: overrides.roundCount ?? 0,
    blockers: [],
  };
}

describe('blockerIdFor', () => {
  it('builds a stable id from kind + sorted capability ids', () => {
    expect(blockerIdFor('uncertain-capability', ['foo'])).toBe(
      'uncertain-capability--foo',
    );
    expect(blockerIdFor('uncertain-capability', ['b', 'a'])).toBe(
      'uncertain-capability--a-b',
    );
  });

  it('uses `--global` suffix for blockers without capability ids', () => {
    expect(blockerIdFor('dependency-cycle', [])).toBe(
      'dependency-cycle--global',
    );
  });

  it('produces identical ids across re-invocations (deterministic)', () => {
    const id1 = blockerIdFor('drift-invalidated', ['cap-a', 'cap-b']);
    const id2 = blockerIdFor('drift-invalidated', ['cap-b', 'cap-a']);
    expect(id1).toBe(id2);
  });
});

describe('BlockerSchema', () => {
  it('parses with allowedResolutions whitelist', () => {
    const parsed = BlockerSchema.parse({
      id: 'uncertain-capability--cap-a',
      kind: 'uncertain-capability',
      capabilityIds: ['cap-a'],
      detail: 'Why',
      suggestedAction: 'Action',
      allowedResolutions: ['existing', 'extend-existing', 'package'],
    });
    expect(parsed.allowedResolutions).toEqual([
      'existing',
      'extend-existing',
      'package',
    ]);
  });

  it('parses without allowedResolutions (undefined = any permitted)', () => {
    const parsed = BlockerSchema.parse({
      id: 'dependency-cycle--global',
      kind: 'dependency-cycle',
      capabilityIds: [],
      detail: 'Cycle',
      suggestedAction: 'Break',
    });
    expect(parsed.allowedResolutions).toBeUndefined();
  });

  it('rejects when id is missing', () => {
    expect(() =>
      BlockerSchema.parse({
        kind: 'uncertain-capability',
        capabilityIds: ['cap-a'],
        detail: 'd',
        suggestedAction: 's',
      }),
    ).toThrow();
  });
});

describe('parseBuildPlan — extend-existing classification', () => {
  function makeExtendItem(overrides: Record<string, unknown> = {}): unknown {
    return {
      id: 'ext-features',
      capabilityName: 'Extend @unsupervised/features',
      classification: 'extend-existing',
      coveredCapabilityIds: ['cap-a'],
      round: 1,
      dependsOn: [],
      packageId: '@unsupervised/features',
      existingPackageId: null,
      authoringConfigPath: null,
      resultDir: null,
      status: 'pending',
      note: null,
      packageOutcome: null,
      skillOutcome: null,
      ...overrides,
    };
  }

  it('accepts an extend-existing work item with a packageOutcome', () => {
    const plan = basePlan({
      workItems: [
        makeExtendItem({
          packageOutcome: {
            pass: true,
            startedAt: '2026-06-13T00:00:00.000Z',
            completedAt: '2026-06-13T00:01:00.000Z',
            durationMs: 60000,
            authoringExitCode: 0,
            assertionsPassed: 4,
            assertionsFailed: 0,
            assertionsErrored: 0,
            assertionsNotImplemented: 0,
            assertionsLoadError: 0,
            assertionsTotal: 4,
            harnessSummaryPath: null,
            note: 'ok',
          },
        }),
      ],
      roundCount: 1,
    });
    const parsed = parseBuildPlan(plan);
    expect(parsed.workItems[0]?.classification).toBe('extend-existing');
  });

  it('rejects extend-existing work item carrying skillOutcome', () => {
    const plan = basePlan({
      workItems: [
        makeExtendItem({
          skillOutcome: {
            pass: false,
            startedAt: '2026-06-13T00:00:00.000Z',
            completedAt: '2026-06-13T00:01:00.000Z',
            durationMs: 60000,
            exitCode: 0,
            bestIteration: 0,
            internalDelta: 0.5,
            genericDelta: 0,
            totalCostUsd: 1,
            note: 'wrong track',
          },
        }),
      ],
      roundCount: 1,
    });
    expect(() => parseBuildPlan(plan)).toThrow(/skillOutcome/);
  });

  it('allows extend-existing to cover multiple capabilities (same posture as package)', () => {
    const plan = basePlan({
      workItems: [
        makeExtendItem({
          coveredCapabilityIds: ['cap-a', 'cap-b'],
        }),
      ],
      roundCount: 1,
    });
    expect(() => parseBuildPlan(plan)).not.toThrow();
  });
});

describe('parseBuildPlan — demoOutcome', () => {
  function makeGameCodeItem(
    overrides: Record<string, unknown> = {},
  ): unknown {
    return {
      id: 'gc-item',
      capabilityName: 'Game code',
      classification: 'game-code',
      coveredCapabilityIds: ['cap-a'],
      round: 1,
      dependsOn: [],
      packageId: null,
      existingPackageId: null,
      authoringConfigPath: null,
      resultDir: null,
      status: 'passed',
      note: null,
      packageOutcome: null,
      skillOutcome: {
        pass: true,
        startedAt: '2026-06-13T15:00:00.000Z',
        completedAt: '2026-06-13T15:15:00.000Z',
        durationMs: 900000,
        exitCode: 0,
        bestIteration: 0,
        internalDelta: 0.5,
        genericDelta: 0,
        totalCostUsd: 8,
        note: 'ok',
      },
      demoOutcome: null,
      ...overrides,
    };
  }

  const fullDemoOutcome = {
    pass: true,
    startedAt: '2026-06-13T15:30:00.000Z',
    completedAt: '2026-06-13T15:35:00.000Z',
    durationMs: 300000,
    authoringExitCode: 0,
    validatorPath: 'apps/dex/app/validators/gc-item/page.tsx',
    checkTypesExitCode: 0,
    buildExitCode: 0,
    totalCostUsd: 4,
    note: 'demo passed',
  };

  it('accepts a game-code item with a populated demoOutcome', () => {
    const plan = basePlan({
      workItems: [makeGameCodeItem({ demoOutcome: fullDemoOutcome })],
      roundCount: 1,
    });
    const parsed = parseBuildPlan(plan);
    expect(parsed.workItems[0]?.demoOutcome?.pass).toBe(true);
    expect(parsed.workItems[0]?.demoOutcome?.validatorPath).toBe(
      'apps/dex/app/validators/gc-item/page.tsx',
    );
  });

  it('accepts demoOutcome=null (default)', () => {
    const plan = basePlan({
      workItems: [makeGameCodeItem({ demoOutcome: null })],
      roundCount: 1,
    });
    const parsed = parseBuildPlan(plan);
    expect(parsed.workItems[0]?.demoOutcome).toBeNull();
  });

  it('allows demoOutcome on a package item (forward-compat for v2 scope)', () => {
    const plan = basePlan({
      workItems: [
        {
          id: 'pkg-item',
          capabilityName: 'Package',
          classification: 'package',
          coveredCapabilityIds: ['cap-a'],
          round: 1,
          dependsOn: [],
          packageId: '@unsupervised/foo',
          existingPackageId: null,
          authoringConfigPath: null,
          resultDir: null,
          status: 'passed',
          note: null,
          packageOutcome: {
            pass: true,
            startedAt: '2026-06-13T15:00:00.000Z',
            completedAt: '2026-06-13T15:10:00.000Z',
            durationMs: 600000,
            authoringExitCode: 0,
            assertionsPassed: 1,
            assertionsFailed: 0,
            assertionsErrored: 0,
            assertionsNotImplemented: 0,
            assertionsLoadError: 0,
            assertionsTotal: 1,
            harnessSummaryPath: null,
            note: 'ok',
          },
          skillOutcome: null,
          demoOutcome: fullDemoOutcome,
        },
      ],
      roundCount: 1,
    });
    expect(() => parseBuildPlan(plan)).not.toThrow();
  });

  it('records partial demoOutcome when typecheck failed before build', () => {
    const partial = {
      ...fullDemoOutcome,
      pass: false,
      checkTypesExitCode: 1,
      buildExitCode: null,
      note: 'typecheck failed',
    };
    const plan = basePlan({
      workItems: [makeGameCodeItem({ demoOutcome: partial })],
      roundCount: 1,
    });
    const parsed = parseBuildPlan(plan);
    expect(parsed.workItems[0]?.demoOutcome?.pass).toBe(false);
    expect(parsed.workItems[0]?.demoOutcome?.checkTypesExitCode).toBe(1);
    expect(parsed.workItems[0]?.demoOutcome?.buildExitCode).toBeNull();
  });
});
