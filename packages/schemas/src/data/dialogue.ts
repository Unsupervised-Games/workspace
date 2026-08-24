// Dialogue script + state shapes.
//
// `@unsupervised/features/dialogue` consumes these. Scripts are
// JSON-shaped node graphs registered globally at boot; per-entity
// state lives on the `dialogue` ECS slot.
//
// The framework is headless — it tracks state and fires bus
// events. Speech-bubble UIs / portraits / typewriter animations
// are entirely app-side. Conditions + actions referenced by
// choices are paired-at-boot strings (the registry-paired-by-id
// pattern shared with abilities, schedule callbacks, turn
// actions).

import { z } from 'zod';

/** Reference to a registered condition / action by id +
 *  app-supplied opaque args. The framework treats `args` as
 *  unknown; the registered callback narrows. */
export const DialogueRefSchema = z.object({
  id: z.string().min(1),
  args: z.record(z.unknown()).optional(),
});
export type DialogueRef = z.infer<typeof DialogueRefSchema>;

/** A single choice in a dialogue node. `nextNodeId === null`
 *  ends the dialogue; otherwise it transitions to that node. */
export const DialogueChoiceSchema = z.object({
  text: z.string(),
  /** App-defined condition id; choice is hidden / disabled
   *  when the predicate returns false. UI chooses semantics
   *  (the framework just exposes visible choices via
   *  `getVisibleChoices`). */
  condition: DialogueRefSchema.optional(),
  /** App-defined action id; runs when the choice is committed
   *  (after node bookkeeping, before transitioning). */
  action: DialogueRefSchema.optional(),
  /** Next node id, or `null` to end the dialogue. */
  nextNodeId: z.string().nullable(),
});
export type DialogueChoice = z.infer<typeof DialogueChoiceSchema>;

/** A dialogue node — speaker + text + choices + optional
 *  on-enter action that fires before choices render. */
export const DialogueNodeSchema = z.object({
  id: z.string().min(1),
  /** App-defined speaker id (mapped to portrait / name /
   *  voice in the UI layer). Framework treats it as opaque. */
  speaker: z.string().optional(),
  text: z.string(),
  choices: z.array(DialogueChoiceSchema),
  /** Optional auto-action that fires on entering the node,
   *  before choices render. Useful for "give the player the
   *  item now" without requiring a click. Save/load round-trips
   *  the slot's `currentNodeId`; on reload the node is
   *  considered already entered (onEnterAction does NOT re-fire
   *  — same semantics as cast-handle `fired` flag). */
  onEnterAction: DialogueRefSchema.optional(),
});
export type DialogueNode = z.infer<typeof DialogueNodeSchema>;

/** The runtime-contract version of the DialogueScript shape — bump when
 *  the SHAPE changes (a new node/choice field), not when a script's content
 *  changes. `narrative compile` stamps it into emitted `.dialogue.json` so a
 *  non-TS runtime can check what it's loading. See
 *  docs/specs/runtime-conformance.md. */
export const DIALOGUE_SCRIPT_VERSION = 1;

/** A dialogue script — id + start node + node graph. */
export const DialogueScriptSchema = z.object({
  /** Contract version (`DIALOGUE_SCRIPT_VERSION`). Optional so hand-authored
   *  scripts + existing data parse unchanged; `narrative compile` stamps it. */
  version: z.number().int().optional(),
  id: z.string().min(1),
  startNodeId: z.string().min(1),
  /** Map of node id → DialogueNode. Object-shaped (not array)
   *  so transitions are O(1). */
  nodes: z.record(z.string(), DialogueNodeSchema),
});
export type DialogueScript = z.infer<typeof DialogueScriptSchema>;

/** Reasons a `chooseDialogue` call can be rejected. */
export const DialogueRejectionSchema = z.enum([
  'not-active',
  'invalid-choice',
  'condition-failed',
  'unknown-action',
  'unknown-condition',
  'unknown-script',
  'unknown-node',
]);
export type DialogueRejection = z.infer<typeof DialogueRejectionSchema>;

/** Result of `startDialogue` / `chooseDialogue` — discriminated,
 *  mirrors `TurnActionResult` shape. */
export const DialogueChoiceResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** New current node id, or `null` if the dialogue ended. */
    nextNodeId: z.string().nullable(),
  }),
  z.object({
    ok: z.literal(false),
    reason: DialogueRejectionSchema,
    message: z.string(),
  }),
]);
export type DialogueChoiceResult = z.infer<typeof DialogueChoiceResultSchema>;
