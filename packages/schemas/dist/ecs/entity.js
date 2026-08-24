// Master entity shape.
//
// The engine will type its Miniplex World as `World<Entity>`. Miniplex
// entities are plain objects whose keys are optional component slots —
// queries select entities by which slots are populated. That means every
// component field on this schema MUST be `.optional()` at the type level;
// a required field would make the entity unqueryable for the "does not
// have X" case that drives most ECS logic.
//
// Relative imports use explicit `.js` extensions because the emitted
// output is ESM and Node's ESM loader requires the extension at runtime.
// TypeScript resolves `./components.js` to `./components.ts` during
// compilation under moduleResolution:bundler.
import { z } from 'zod';
import { BlendshapeSlotSchema } from '../data/blendshape.js';
import { VehicleSchema } from '../data/vehicle.js';
import { AbilitiesSchema, AchievementsSchema, AnimationStateSchema, AudioSourceSchema, BeatClockSchema, BehaviorTreeSchema, BoneAttachmentSchema, AscendStateSchema, BuoyantSchema, DecalSchema, DecalTargetSchema, LodSchema, CharacterControllerSchema, GrabStateSchema, RecallableSchema, WaterVolumeSchema, IkChainSchema, PlatformerStateSchema, SquadFormationSchema, TriggerActorSchema, TriggerVolumeSchema, TopDownCharacterSchema, ImpactFrameSchema, ScreenShakeSchema, CastingSchema, CinematicSchema, CinematicCameraSchema, CombatSchema, DialogueStateSchema, EmitterSchema, GameClockSchema, WorldTimescaleSchema, TimeDecoupledSchema, GridSchema, HealthSchema, InventorySchema, JointSlotSchema, ModifiersSchema, CrowdAgentSchema, NavAgentSchema, PersistSchema, PhysicsBodySchema, QuestTrackerSchema, RenderableUnionSchema, ResourcesSchema, SceneOwnerSchema, ScheduleSchema, ScheduledHandlersSchema, SpawnedBySchema, SpawnerSchema, StatusEffectsSchema, TilePositionSchema, TransformSchema, TurnParticipantSchema, TurnStateSchema, VelocitySchema, } from './components.js';
export const EntitySchema = z.object({
    /** Stable identifier. Miniplex assigns its own numeric id on create;
     *  this field is for entities that need a serialization-stable key
     *  (save games, networked replication, spawn templates). */
    id: z.string().min(1).optional(),
    transform: TransformSchema.optional(),
    velocity: VelocitySchema.optional(),
    renderable: RenderableUnionSchema.optional(),
    physics: PhysicsBodySchema.optional(),
    /** Physics joints anchored on this entity. Each entry references
     *  the OTHER endpoint by stable `id`; the engine-3d `jointSystem`
     *  reconciles per-tick (creates missing Rapier joints, destroys
     *  orphans when either endpoint leaves the world). Apps that want
     *  transient welds use the imperative `weldEntities(a, b)` API —
     *  it creates the joint AND appends to this slot in one call. */
    joints: z.array(JointSlotSchema).optional(),
    health: HealthSchema.optional(),
    audio: AudioSourceSchema.optional(),
    /** Survive scene-level purges. SceneManager's deep-clean iterates
     *  the world during a LOADING_SCENE transition and skips any
     *  entity carrying this slot. */
    persist: PersistSchema.optional(),
    /** Scene-attribution slot. INTERNAL — written by SceneManager's
     *  SceneSpawner wrapper, never by consumer code. Powers
     *  targeted destruction in `unloadScene(sceneId)` and the
     *  interstitial loading-scene cleanup. */
    sceneOwner: SceneOwnerSchema.optional(),
    /** Particle source. Read by `@unsupervised/vfx`'s VFXSystem to drive
     *  GPU-instanced particle emission. The emitter's spawn
     *  coordinates come from this entity's `transform` component
     *  every frame; individual particles are NOT ECS entities. */
    emitter: EmitterSchema.optional(),
    /** Animation intent. Read by `@unsupervised/renderer-3d`'s
     *  `useEntityAnimation` hook, which resolves clip names via
     *  ModelBank and drives a Three.js AnimationMixer bound to the
     *  entity's rendered Object3D. Mutating fields on this slot
     *  (clipId / blendWeight / speed) is how gameplay code
     *  triggers visual transitions. */
    animation: AnimationStateSchema.optional(),
    /** Pathfinding intent. Read by `@unsupervised/ai`'s NavSystem, which
     *  computes a Recast/Detour path from `transform.position` to
     *  `target` and writes desired velocity into `velocity.linear`
     *  each tick. Authors set `target` (or null to halt); the
     *  computed path lives in NavSystem's side-table, not on the
     *  entity. */
    navAgent: NavAgentSchema.optional(),
    /** Multi-agent pathfinding intent. Read by `@unsupervised/ai`'s
     *  CrowdSystem, which registers the agent with `dtCrowd`,
     *  batch-steps the whole crowd in one `crowd.update(dt)`
     *  call, and writes the agent's resolved position +
     *  velocity back into `transform` + `velocity.linear`.
     *  Mutually exclusive with `navAgent`. */
    crowdAgent: CrowdAgentSchema.optional(),
    /** Decision-making intent. Read by `@unsupervised/ai-bt`'s
     *  `behaviorTreeSystem`, which looks up the registered tree
     *  by `rootId` and ticks it once per frame against this slot's
     *  blackboard. Tree-internal running-node state lives in the
     *  blackboard under reserved `__bt` keys; game state lives in
     *  free-form keys the author chooses. */
    behaviorTree: BehaviorTreeSchema.optional(),
    /** Slot-based item container. Mutated by
     *  `@unsupervised/features/inventory`'s pure operations — callers
     *  assign the result of each op back to the slot. Definitions
     *  referenced by `defId` must be registered globally via
     *  `registerItem(...)` before the first read. JSON-shaped, so
     *  the save layer round-trips inventory state for free. */
    inventory: InventorySchema.optional(),
    /** Abilities the entity has + per-id cooldown timers. Read /
     *  written by `@unsupervised/features/abilities`'s `tryActivate` (sets
     *  cooldown on successful cast) and `abilitySystem` (ticks
     *  timers down by `delta` each frame). Ids must be registered
     *  via `registerAbility(...)` before the first activation. */
    abilities: AbilitiesSchema.optional(),
    /** Named resource pools (mana / stamina / focus / heat / …)
     *  consumed by ability activation. Each pool tracks
     *  `current / max` and an optional `regen` rate that
     *  `abilitySystem` ticks up to `max` each frame. Resource
     *  names are app-defined; ability `cost` keys must match the
     *  names this slot exposes. */
    resources: ResourcesSchema.optional(),
    /** "Things that spawn other things." Read / written by
     *  `@unsupervised/features/spawn`'s `spawnerSystem`. The slot carries
     *  the spawner's mode (interval / wave / manual), pool,
     *  spatial shape, capacity caps, and mid-wave bookkeeping —
     *  all JSON-shaped, so save/load round-trips full state.
     *  Archetype factories + per-spawner-id callbacks are
     *  registered globally; this slot only stores ids. */
    spawner: SpawnerSchema.optional(),
    /** Provenance tag on entities produced by a `spawner`. Written
     *  by the system at spawn time; queried each tick to derive
     *  alive-counts (`world.with('spawnedBy')`) and to detect
     *  despawns via frame-diff. Never written by game code
     *  directly — call `forceSpawn(...)` instead of `world.add({
     *  ...spawnedBy(...) })`. */
    spawnedBy: SpawnedBySchema.optional(),
    /** Damage-mitigation knobs (resistances, armor, immunities)
     *  read by `@unsupervised/features/combat`'s `applyDamage`. Optional;
     *  entities without this slot take damage at 100%. App-defined
     *  damage type strings serve as keys into the resistance and
     *  immunity collections. */
    combat: CombatSchema.optional(),
    /** Active status effects on this entity. Mutated by
     *  `@unsupervised/features/status`: `applyStatusEffect` adds entries,
     *  `removeStatusEffect` splices them out, `statusEffectSystem`
     *  ticks `remainingSeconds` down each frame and fires onTick /
     *  onExpire callbacks. Effect DEFINITIONS (with their
     *  callbacks) live in the global registry — this slot holds
     *  only per-entity instance state. */
    statusEffects: StatusEffectsSchema.optional(),
    /** Stat-altering modifiers. Read by
     *  `@unsupervised/features/modifiers`'s `resolveStat(entity, stat,
     *  base)` to compute final stat values from a base + the sum
     *  of additive modifiers + the product of multiplicative
     *  modifiers (overrides short-circuit to a fixed value when
     *  present). Status effects, equipment hooks, and BT-driven
     *  buffs all push into this slot via `addModifier`; cleanup
     *  is by `source` tag via `removeModifiersBySource`.
     *
     *  The combat layer auto-reads two reserved stat names from
     *  this slot: `'damage-out'` (on the source) and
     *  `'damage-in'` (on the target). The casting layer
     *  auto-reads `'cast-speed'` (multiplies windup duration
     *  at cast start). Other stats are app-defined and read
     *  manually from game code. */
    modifiers: ModifiersSchema.optional(),
    /** In-progress ability cast. Mutated by
     *  `@unsupervised/features/casting`: `startCast` creates the slot,
     *  `castingSystem` ticks `timeRemainingInPhase` down each
     *  frame and advances at phase boundaries, `interruptCast`
     *  clears the slot on stun. The slot's PRESENCE means the
     *  entity is mid-cast — `tryActivate` rejects with reason
     *  `'casting'` while it exists. Effect fires at the
     *  windup→active boundary; cooldown is set there too. */
    casting: CastingSchema.optional(),
    /** Singleton in-game clock state. Read / written by
     *  `@unsupervised/features/time`'s `gameClockSystem`. By convention
     *  lives on a single entity (e.g. `id: 'world-clock'`); the
     *  system locates it via a Miniplex `with('gameClock').first`
     *  query. Pausing this slot freezes scheduled handlers and
     *  NPC schedule progression. */
    gameClock: GameClockSchema.optional(),
    /** Singleton engine-wide time-dilation slot. Read / written by
     *  `@unsupervised/timescale`'s `setGlobalScale` / `easeGlobalScale` /
     *  `tickTimescale`. By convention lives on a single entity
     *  (`id: 'world-timescale'`); helpers locate it via
     *  `world.with('worldTimescale').first`. Consumers multiply their
     *  per-tick dt by `scale` (or use `effectiveScaleFor` to respect
     *  per-entity decoupling). The package auto-spawns the singleton
     *  via `ensureWorldTimescale`; apps don't need to spawn it
     *  themselves. */
    worldTimescale: WorldTimescaleSchema.optional(),
    /** Per-entity opt-out from the global timescale. Carries an
     *  override `scale` that `effectiveScaleFor` returns instead of
     *  the world's global value. Bullet-time's canonical use: the
     *  player entity carries `timeDecoupled({ scale: 1 })` so it
     *  stays at real-time while the world slows. */
    timeDecoupled: TimeDecoupledSchema.optional(),
    /** Companion slot to `gameClock`: at / daily / every handles
     *  registered via `@unsupervised/features/time`'s scheduler. The
     *  system fires their callbacks (paired by `callbackId` at
     *  boot) when `gameClock.currentSeconds` crosses each
     *  handle's `nextFireAt`. JSON-shaped so save/load
     *  round-trips fired-state for one-shot handles. */
    scheduledHandlers: ScheduledHandlersSchema.optional(),
    /** NPC schedule slot. Holds the registered schedule's id +
     *  the system-maintained `activeEntryIndex` (which entry's
     *  time window covers the world's current time-of-day, or
     *  undefined for a gap). Apps wire behavior on top
     *  (BT conditions, waypoint movers); the time package
     *  doesn't depend on `@unsupervised/ai` / `@unsupervised/ai-bt`. */
    schedule: ScheduleSchema.optional(),
    /** Singleton tile-grid slot. Read / written by
     *  `@unsupervised/features/grid`'s pathfinding + LOS helpers. By
     *  convention lives on a single entity (e.g. `id:
     *  'world-grid'`); operations locate it via a Miniplex
     *  `with('grid').first` query. Holds width × height tiles
     *  in a flat row-major array. */
    grid: GridSchema.optional(),
    /** Per-entity tile coordinate. The GAMEPLAY source of truth
     *  for entities living on a grid; `transform.position` is
     *  the rendered position lerped toward the tile center each
     *  frame by `tileMoverSystem`. Game code mutates `coord`
     *  instantly; visuals catch up. */
    tilePosition: TilePositionSchema.optional(),
    /** Tags an entity as a participant in a turn-based
     *  encounter. Read / written by `@unsupervised/features/turn`'s
     *  manager: AP economy, team membership, initiative, and
     *  the per-turn `hasActedThisTurn` flag. Add this slot via
     *  the `turnParticipant({...})` builder when spawning
     *  combatants; remove when an entity routs / dies. */
    turnParticipant: TurnParticipantSchema.optional(),
    /** Singleton turn FSM state. Read / written by
     *  `@unsupervised/features/turn`'s manager. By convention lives on
     *  a single entity (`id: 'world-turn-state'`); the manager
     *  locates it via `world.with('turnState').first`. Phase /
     *  queue / active entity / battle id all round-trip through
     *  save/load since the slot is JSON-shaped. */
    turnState: TurnStateSchema.optional(),
    /** Per-entity dialogue runner state. Read / written by
     *  `@unsupervised/features/dialogue`'s `startDialogue` /
     *  `chooseDialogue` / `endDialogue`. The slot's
     *  PRESENCE-AND-NON-NULL `activeScriptId` indicates the
     *  entity is mid-conversation; UIs query
     *  `getCurrentDialogueNode` + `getVisibleChoices` to render. */
    dialogue: DialogueStateSchema.optional(),
    /** Per-entity quest journal. Read / written by
     *  `@unsupervised/features/quests`'s `startQuest` / `progressStep` /
     *  `completeQuest` / `failQuest` / `abandonQuest`. Active
     *  quests track their step index + counter; the auto-
     *  progression bus bridge increments counters as relevant
     *  events fire. Save/load round-trips for free. */
    quests: QuestTrackerSchema.optional(),
    /** Per-entity Steam-shape achievement tracker. Read /
     *  written by `@unsupervised/features/achievements`'s
     *  `incrementStat` / `setStat` / `unlockAchievement`. Tracks
     *  reusable stat counters + unlocked achievement ids +
     *  per-stat-threshold progress snapshots + the hiddenSeen
     *  set. Per-entity so party-RPG games can have per-PC
     *  trophies; single-PC games put the slot on the player. */
    achievements: AchievementsSchema.optional(),
    /** IK chains attached to this entity's rendered skeleton.
     *  Read by `@unsupervised/renderer-3d/ik`'s `<IkSolver>`, which
     *  resolves each chain's bone names against the live
     *  skeleton, runs CCD per frame after the animation mixer
     *  ticks, and pulls the end-effector toward the chain's
     *  target. Multiple chains per entity (foot-left + foot-right
     *  + head-look) are common; the array preserves authoring
     *  order which the solver ticks left-to-right (later chains
     *  see earlier chains' bone updates). */
    ikChains: z.array(IkChainSchema).optional(),
    /** Bone-attachment slot. Read by `@unsupervised/renderer-3d/attachments`'s
     *  `<BoneAttachmentDriver>`, which looks up the parent skinned
     *  entity in a per-world skinned-mesh registry, finds the named
     *  bone, and writes this entity's `transform` each frame to the
     *  bone's world transform composed with the per-attachment
     *  local `offset`. Apps wire model + collider + audio + physics
     *  on the SAME entity — the driver only writes transform; the
     *  rest stays orthogonal. */
    boneAttachment: BoneAttachmentSchema.optional(),
    /** Per-character platformer-controller state. Read / written
     *  by `@unsupervised/features/platformer`'s `platformerSystem(world,
     *  dt, input)`. Carries the feel-tuning (jump height, ground
     *  speed, coyote time, jump buffer, air control, gravity,
     *  fall-gravity multiplier, ground friction) + the action map
     *  + system-maintained bookkeeping (grounded flag, last-
     *  grounded time, last-jump-pressed time, accumulated seconds,
     *  jumpedThisTick). The system writes `entity.velocity.linear`
     *  each tick; apps wire either `movementSystem` (for
     *  no-physics characters — apps that want simple Y-collision
     *  via the `isGrounded` callback) OR a Rapier kinematic
     *  integrator (engine-3d follow-on; not shipped in v1). */
    platformerState: PlatformerStateSchema.optional(),
    /** Per-follower squad formation slot. Read by
     *  `@unsupervised/features/platformer`'s `squadFormationSystem(world,
     *  dt)`, which writes `entity.velocity.linear` to seek a
     *  desired formation slot computed as `leader.transform.position
     *  + offset` with exponential damping. Reactive behaviors
     *  (attack / regroup / disperse) live in a separate behavior
     *  tree — the BT mutates this slot's `offset` or removes the
     *  slot entirely while a member is in attack mode. */
    squadFormation: SquadFormationSchema.optional(),
    /** Singleton beat-clock slot. Read / written by
     *  `@unsupervised/features/rhythm`'s `rhythmSystem`. Lives on a single
     *  entity (typically `id: 'world-beat'`); the system locates
     *  it via `world.with('beatClock').first`. The clock advances
     *  in real-time seconds from per-tick `dt`; apps drive BPM-
     *  aligned hit windows for ability gating, score combos, and
     *  beat-synced VFX off this slot. Apps using
     *  `bootEngine{2,3}D({ fixedTimestep })` get bit-identical
     *  replay automatically. */
    beatClock: BeatClockSchema.optional(),
    /** Singleton cutscene player state. Read / written by
     *  `@unsupervised/features/cinematic`'s `createCinematicSystem`.
     *  Lives on a single entity (typically `id:
     *  'world-cinematic'`); the system locates it via
     *  `world.with('cinematic').first`. Sibling systems
     *  (casting, abilities, spawn, save) read this slot via
     *  `isCinematicGating(world)` to suspend their work while
     *  `phase === 'playing'`. Runtime-only — NOT persisted
     *  across save/load. */
    cinematic: CinematicSchema.optional(),
    /** Singleton camera-handoff slot for cinematic camera tracks.
     *  Written by `@unsupervised/features/cinematic` when a `camera`
     *  track fires; read by `@unsupervised/renderer-3d`'s
     *  `<CinematicCameraDriver>`. The three camera presets
     *  (`<FollowCamera>` / `<OrbitCamera>` / `<FixedAngleCamera>`)
     *  yield `makeDefault` while this slot is present and retake
     *  it on slot removal. Runtime-only — NOT persisted. */
    cinematicCamera: CinematicCameraSchema.optional(),
    /** World-space AABB trigger zone. Read by
     *  `@unsupervised/features/triggers`'s
     *  `createTriggerVolumeSystem`, which compares every
     *  `triggerActor`-tagged entity's `transform` (offset by
     *  the actor's `halfExtents`) against this volume's
     *  `[min, max]` each tick and fires `'trigger:entered'`
     *  / `'trigger:exited'` on the world's event bus. The
     *  `fireMode: 'once'` mode auto-consumes after the first
     *  enter; saves round-trip the consumed flag for free. */
    triggerVolume: TriggerVolumeSchema.optional(),
    /** Opt-in tag making an entity visible to the trigger
     *  system. Without this slot, the entity is excluded
     *  from AABB overlap checks regardless of its transform —
     *  most entities (scenery, projectiles, particle anchors)
     *  don't need trigger interaction so the opt-in keeps the
     *  per-tick cost at O(triggers × actors) instead of
     *  O(triggers × all-entities). Carries an optional `tag`
     *  matched against `triggerVolume.filter` and an optional
     *  `halfExtents` for avatar-shaped overlap. */
    triggerActor: TriggerActorSchema.optional(),
    /** Top-down kinematic character controller (JRPG /
     *  ARPG / top-down shooter shape). Read by
     *  `@unsupervised/features/character`'s
     *  `topDownCharacterSystem`. Apps write the per-frame
     *  `intent` vector each tick from input / AI / scripted
     *  control; the system scales by `speed` and writes the
     *  result to `entity.velocity.linear`, or integrates
     *  `transform.position` directly when no `velocity` slot
     *  exists (no-physics path). Optional rotate-to-facing
     *  with exponential damping. SISTER recipe to the
     *  jump-focused `platformerState` slot. */
    topDownCharacter: TopDownCharacterSchema.optional(),
    /** Phase 2: Rapier KinematicCharacterController tuning slot.
     *  Applied to a kinematic-capsule entity to enable slope-aware
     *  locomotion (slope-climb, autostep, snap-to-ground,
     *  ceiling-slide). The engine-3d `createCharacterControllerSystem`
     *  factory builds the per-tick driver; apps wire it into
     *  `bootEngine3D({ prePhysicsSystems })`. The system reads
     *  `entity.velocity.linear` as the desired translation delta and
     *  writes `body.setNextKinematicTranslation` with the resolved
     *  motion. `grounded` is system-written; apps READ for jump
     *  gates / landing VFX. */
    characterController: CharacterControllerSchema.optional(),
    /** Phase 2: Ultrahand pickup state on a grabber entity. The
     *  `@unsupervised/features/grab` system reconciles per-tick: held body
     *  follows the guide point (camera-forward × holdDistance),
     *  rotates relative to the grabber, auto-releases on
     *  target-lost / distance-exceeded. Apps drive via the
     *  imperative `createGrabSystem(...).{startGrab, releaseGrab,
     *  weldHeldTo, adjustHoldDistance, rotateHeld, setGuide}` API.
     *  The held body is temporarily kinematic-position-based and
     *  restores to its prior body type on release/weld. */
    grabState: GrabStateSchema.optional(),
    /** Phase 3: TotK Recall trajectory rewind opt-in slot. The
     *  `@unsupervised/features/recall` system records position + rotation
     *  + linear/angular velocity samples each fixed tick into a
     *  side-table ring buffer. `startRecall(entity)` swaps the
     *  body to kinematic and plays back head → tail; on completion
     *  the prior body type is restored AND the tail-sample velocity
     *  is re-applied so the object resumes its original motion at
     *  the rewind start. The ring buffer is system-owned and NOT
     *  save-round-tripped; saves mid-recall load with an empty
     *  buffer. */
    recallable: RecallableSchema.optional(),
    /** Phase 3: TotK Ascend kinematic-rise slot. The
     *  `@unsupervised/features/ascend` system probes upward via shape-cast,
     *  computes the landing Y at the ceiling slab top, swaps body
     *  to kinematic, and ticks upward at `riseSpeed` until arrival.
     *  KCC MUST skip ascending entities (see ascend/CLAUDE.md). */
    ascendState: AscendStateSchema.optional(),
    /** Phase 3: Fluid region. The `@unsupervised/features/buoyancy` system
     *  detects AABB overlap between this volume and `buoyant`
     *  bodies, then applies upward buoyancy force + linear/angular
     *  drag each prePhysics tick. v1 water surface is flat. */
    waterVolume: WaterVolumeSchema.optional(),
    /** Phase 3: Opt-in fluid-affected dynamic body. Pairs with
     *  one or more `waterVolume` entities. The system computes
     *  submerged volume via AABB intersection and applies buoyancy
     *  force = `up × waterDensity × submergedVolume × gravity`. */
    buoyant: BuoyantSchema.optional(),
    /** Renderer Tier 3b: Projector-based decal. Stamps a texture
     *  onto a target entity's mesh (`targetEntityId` → `decalTarget`).
     *  `<DecalDriver>` materializes `DecalGeometry` on first sight +
     *  mounts the result as a child of the target Mesh; transform
     *  inheritance carries decals along when targets move. Optional
     *  `lifetime` + `fadeOut` for bullet holes / blood / footprints
     *  with a finite shelf life. */
    decal: DecalSchema.optional(),
    /** Renderer Tier 3b: Marker slot. Entities with this set auto-
     *  register their renderable Mesh in the per-canvas
     *  `DecalTargetRegistry` so decals can resolve them. */
    decalTarget: DecalTargetSchema.optional(),
    // (DecalTargetSchema is a plain z.boolean, so .optional() is
    // valid; no schema-side refinement is involved.)
    /** Renderer Tier 3b: Distance-based LOD configuration.
     *  `createLodSystem` rewrites `renderable.modelId` (3D variant)
     *  per tick to match the active level for the entity's camera
     *  distance. */
    lod: LodSchema.optional(),
    /** Singleton trauma-style camera shake. Lives on a single
     *  entity (typically `id: 'world-screen-shake'`); the
     *  system locates it via
     *  `world.with('screenShake').first`. Ticked by
     *  `@unsupervised/features/screenShake`'s
     *  `screenShakeSystem(world, dt)` (decays intensity per
     *  tick + bumps sampleIndex); read each frame by
     *  `@unsupervised/renderer-3d`'s `<ScreenShakeDriver>` which
     *  samples deterministic noise and mutates the active
     *  camera. Composes cleanly with both the gameplay
     *  cameras (`<FollowCamera>` / `<FixedAngleCamera>` /
     *  `<OrbitCamera>`) and the `<CinematicCameraDriver>`. */
    screenShake: ScreenShakeSchema.optional(),
    /** Singleton impact-frame freeze + flash. Lives on a single
     *  entity (typically `id: 'world-impact-frame'`); the system
     *  locates it via `world.with('impactFrame').first`. Ticked by
     *  `@unsupervised/features/impactFrame`'s `createImpactFrameSystem`
     *  (decrements `remainingSeconds` per tick, fires
     *  `'impactFrame:ended'` at zero); read each frame by
     *  `@unsupervised/renderer-3d`'s `<ImpactFrameFlash>` post-pass which
     *  mixes `color` over the rendered scene by the hold-then-fade
     *  alpha curve. Apps gate sibling systems (animation, AI,
     *  physics) on `isImpactFrameActive(world)` to produce the
     *  freeze semantic. The "punch lands" anime primitive —
     *  pairs naturally with `screenShake` for the canonical
     *  hit-impact composition. */
    impactFrame: ImpactFrameSchema.optional(),
    /** Per-entity vehicle slot. Read + written by
     *  `@unsupervised/features/vehicle`'s system, which composes
     *  Rapier's `DynamicRayCastVehicleController` against the
     *  entity's bound Rapier body. Carries per-wheel
     *  descriptions, engine + brake force, suspension tuning,
     *  steering response, and the input action ids to read each
     *  tick. Co-author with a `physics` slot (the chassis
     *  body) — vehicles without a Rapier body silently no-op.
     *  The `currentSteer` / `currentThrottle` / `currentBrake`
     *  fields are system-maintained per-tick state useful for
     *  HUD readouts + animation-clip selection. */
    vehicle: VehicleSchema.optional(),
    /** Per-entity blendshape (morph-target) animation state. Read by
     *  `@unsupervised/features/blendshape`'s `blendshapeSystem` (advances
     *  per-clip `elapsed`, removes finished non-looping clips) and
     *  by `@unsupervised/renderer-3d`'s `<BlendshapeDriver>` (resolves
     *  weights from `playing` + `liveTargets`, writes to every
     *  descendant SkinnedMesh's `morphTargetInfluences`). Mutated
     *  via `playBlendshapeClip` / `stopBlendshapeClip` /
     *  `setLiveBlendshape` / `clearLiveBlendshapes` operations.
     *  The slot is JSON-shaped — save / load round-trips
     *  mid-clip state including elapsed times. */
    blendshape: BlendshapeSlotSchema.optional(),
});
//# sourceMappingURL=entity.js.map