import { z } from 'zod';

// Articulate — the sixth pipeline pillar. These are the shapes for the
// user-authored input SPEC each generation pipeline consumes: the articulation
// artifact (per-field values + provenance), and the per-pipeline SpecShape that
// declares what a complete spec looks like. Logic lives in @unsupervised/articulate.
// See docs/specs/articulate-pillar.md.

/** How a spec field's value was decided — the CONTROL PRIMITIVE. `pinned` = the
 *  user locked it (Generate must honor it exactly); `proposed` = the AI suggested
 *  it and it awaits the user's decision; `delegated` = the user handed the choice
 *  to Generate (the field is dropped from the emitted config so Generate uses its
 *  own default). */
export const SpecProvenanceSchema = z.enum(['pinned', 'proposed', 'delegated']);
export type SpecProvenance = z.infer<typeof SpecProvenanceSchema>;

/** One field of an articulation — a value plus how it was decided. The value is
 *  JSON (per-pipeline typed by its SpecShape); the pillar core stays generic. */
export const SpecFieldSchema = z.object({
  value: z.unknown(),
  provenance: SpecProvenanceSchema,
  /** Optional free-form note (a rationale, an open question). */
  note: z.string().optional(),
});
export type SpecField = z.infer<typeof SpecFieldSchema>;

/** The articulation artifact — the durable, user-owned spec a pipeline's Generate
 *  step is held to. Lives at
 *  `games/<game>/articulate/<pipeline>/<target>.articulation.json`. */
export const ArticulationSpecSchema = z.object({
  /** The pipeline this articulates for (art / narrative / audio / …). */
  pipeline: z.string().min(1),
  /** What is being articulated (a game slug, a scene id, an asset slot). */
  target: z.string().min(1),
  /** Bumped on every accepted change — the revision the operator approved. */
  revision: z.number().int().nonnegative(),
  status: z.enum(['drafting', 'approved']),
  /** fieldId → the authored field. */
  fields: z.record(z.string(), SpecFieldSchema),
});
export type ArticulationSpec = z.infer<typeof ArticulationSpecSchema>;

/** The input kind of a SpecShape field — drives the UI control + the volley's
 *  question phrasing. */
export const SpecFieldKindSchema = z.enum(['text', 'longtext', 'choice', 'list', 'number', 'boolean']);
export type SpecFieldKind = z.infer<typeof SpecFieldKindSchema>;

/** A field descriptor in a SpecShape — simultaneously the volley's QUESTION BANK
 *  and the COMPLETENESS CONTRACT. */
export const SpecFieldDescriptorSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: SpecFieldKindSchema,
  /** A required field must be pinned or delegated before the spec is complete. */
  required: z.boolean(),
  /** Prompt hint the volley uses when eliciting this field. */
  hint: z.string().optional(),
  examples: z.array(z.string()).default([]),
  /** For `kind: 'choice'` — the allowed values. */
  choices: z.array(z.string()).optional(),
});
export type SpecFieldDescriptor = z.infer<typeof SpecFieldDescriptorSchema>;

/** A pipeline's spec shape — the fields Articulate elicits + which are required.
 *  Registered in @unsupervised/articulate's shape registry (like `GEN_PIPELINES`). */
export const SpecShapeSchema = z.object({
  pipeline: z.string().min(1),
  label: z.string().min(1),
  fields: z.array(SpecFieldDescriptorSchema),
});
export type SpecShape = z.infer<typeof SpecShapeSchema>;
