// Public API. Consuming packages should ONLY import from `@unsupervised/schemas`,
// never reach into subpaths — this file is the contract. Adding a new
// schema means adding a line here; removing one is a breaking change.
//
// `export *` re-exports both values (Zod schemas) and types together;
// TypeScript's `verbatimModuleSyntax` mode does not require the `type`
// modifier on star re-exports because it can always tell values from
// types by the original declaration.

export * from './ecs/components.js';
export * from './ecs/entity.js';
export * from './data/weapon.js';
export * from './data/level.js';
export * from './data/item.js';
export * from './data/ability.js';
export * from './data/damage.js';
export * from './data/statusEffect.js';
export * from './data/inventoryTransaction.js';
export * from './data/achievement.js';
export * from './data/animationEvent.js';
export * from './data/blendshape.js';
export * from './data/crowd.js';
export * from './data/cutscene.js';
export * from './data/dialogue.js';
export * from './data/grid.js';
export * from './data/input.js';
export * from './data/navmesh.js';
export * from './data/physics.js';
export * from './data/tilecache.js';
export * from './data/procgen.js';
export * from './data/quest.js';
export * from './data/vehicle.js';
export * from './data/settings.js';
export * from './data/i18n.js';
export * from './data/genProviders.js';
export * from './data/assetGen.js';
export * from './data/audioCue.js';
export * from './data/assetApproval.js';
export * from './data/assetDrift.js';
export * from './data/assetReview.js';
export * from './data/audioApproval.js';
export * from './data/audioDrift.js';
export * from './data/audioGen.js';
export * from './data/audioReview.js';
export * from './data/locGen.js';
export * from './data/genGovernance.js';
 export * from './data/marketGen.js';
export * from './data/teams.js';
export * from './data/orgSpend.js';
export * from './data/review.js';
export * from './data/builds.js';
export * from './data/assetManifest.js';
export * from './data/gameTarget.js';
export * from './data/runtimeContracts.js';
export * from './data/billing.js';
export * from './data/credits.js';
export * from './data/productAnalytics.js';
export * from './data/audit.js';
export * from './data/gdpr.js';
export * from './data/sso.js';
export * from './data/platform.js';
export * from './data/packageDirectory.js';
export * from './data/skillDirectory.js';
export * from './data/codeGen.js';
export * from './data/captain.js';
export * from './data/articulate.js';
export * from './data/codeReview.js';
export * from './data/time.js';
export * from './data/narrative/index.js';
export * from './research/index.js';
export * from './state/gameLoop.js';
