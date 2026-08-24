// Research-pipeline schema barrel. Two artifacts:
//
// - FeatureDecomposition  — what a deep-research run emits for
//                           the skill builder to consume.
// - PackageRegistry       — queryable engine snapshot the
//                           research and the builder both
//                           consult to avoid hallucinating
//                           APIs / re-authoring existing
//                           packages.
//
// Both are versioned (`schemaVersion: 1`). Both are zod-
// validated at the boundary; downstream consumers should
// never trust raw JSON.
export * from './decomposition.js';
export * from './registry.js';
export * from './buildPlan.js';
export * from './harnessResult.js';
export * from './qualityGate.js';
export * from './codeMaintain.js';
//# sourceMappingURL=index.js.map