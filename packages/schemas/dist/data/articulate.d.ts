import { z } from 'zod';
/** How a spec field's value was decided — the CONTROL PRIMITIVE. `pinned` = the
 *  user locked it (Generate must honor it exactly); `proposed` = the AI suggested
 *  it and it awaits the user's decision; `delegated` = the user handed the choice
 *  to Generate (the field is dropped from the emitted config so Generate uses its
 *  own default). */
export declare const SpecProvenanceSchema: z.ZodEnum<["pinned", "proposed", "delegated"]>;
export type SpecProvenance = z.infer<typeof SpecProvenanceSchema>;
/** One field of an articulation — a value plus how it was decided. The value is
 *  JSON (per-pipeline typed by its SpecShape); the pillar core stays generic. */
export declare const SpecFieldSchema: z.ZodObject<{
    value: z.ZodUnknown;
    provenance: z.ZodEnum<["pinned", "proposed", "delegated"]>;
    /** Optional free-form note (a rationale, an open question). */
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    provenance: "pinned" | "proposed" | "delegated";
    value?: unknown;
    note?: string | undefined;
}, {
    provenance: "pinned" | "proposed" | "delegated";
    value?: unknown;
    note?: string | undefined;
}>;
export type SpecField = z.infer<typeof SpecFieldSchema>;
/** The articulation artifact — the durable, user-owned spec a pipeline's Generate
 *  step is held to. Lives at
 *  `games/<game>/articulate/<pipeline>/<target>.articulation.json`. */
export declare const ArticulationSpecSchema: z.ZodObject<{
    /** The pipeline this articulates for (art / narrative / audio / …). */
    pipeline: z.ZodString;
    /** What is being articulated (a game slug, a scene id, an asset slot). */
    target: z.ZodString;
    /** Bumped on every accepted change — the revision the operator approved. */
    revision: z.ZodNumber;
    status: z.ZodEnum<["drafting", "approved"]>;
    /** fieldId → the authored field. */
    fields: z.ZodRecord<z.ZodString, z.ZodObject<{
        value: z.ZodUnknown;
        provenance: z.ZodEnum<["pinned", "proposed", "delegated"]>;
        /** Optional free-form note (a rationale, an open question). */
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provenance: "pinned" | "proposed" | "delegated";
        value?: unknown;
        note?: string | undefined;
    }, {
        provenance: "pinned" | "proposed" | "delegated";
        value?: unknown;
        note?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "approved" | "drafting";
    target: string;
    fields: Record<string, {
        provenance: "pinned" | "proposed" | "delegated";
        value?: unknown;
        note?: string | undefined;
    }>;
    pipeline: string;
    revision: number;
}, {
    status: "approved" | "drafting";
    target: string;
    fields: Record<string, {
        provenance: "pinned" | "proposed" | "delegated";
        value?: unknown;
        note?: string | undefined;
    }>;
    pipeline: string;
    revision: number;
}>;
export type ArticulationSpec = z.infer<typeof ArticulationSpecSchema>;
/** The input kind of a SpecShape field — drives the UI control + the volley's
 *  question phrasing. */
export declare const SpecFieldKindSchema: z.ZodEnum<["text", "longtext", "choice", "list", "number", "boolean"]>;
export type SpecFieldKind = z.infer<typeof SpecFieldKindSchema>;
/** A field descriptor in a SpecShape — simultaneously the volley's QUESTION BANK
 *  and the COMPLETENESS CONTRACT. */
export declare const SpecFieldDescriptorSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    kind: z.ZodEnum<["text", "longtext", "choice", "list", "number", "boolean"]>;
    /** A required field must be pinned or delegated before the spec is complete. */
    required: z.ZodBoolean;
    /** Prompt hint the volley uses when eliciting this field. */
    hint: z.ZodOptional<z.ZodString>;
    examples: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** For `kind: 'choice'` — the allowed values. */
    choices: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "number" | "boolean" | "text" | "longtext" | "choice" | "list";
    required: boolean;
    label: string;
    examples: string[];
    choices?: string[] | undefined;
    hint?: string | undefined;
}, {
    id: string;
    kind: "number" | "boolean" | "text" | "longtext" | "choice" | "list";
    required: boolean;
    label: string;
    choices?: string[] | undefined;
    hint?: string | undefined;
    examples?: string[] | undefined;
}>;
export type SpecFieldDescriptor = z.infer<typeof SpecFieldDescriptorSchema>;
/** A pipeline's spec shape — the fields Articulate elicits + which are required.
 *  Registered in @unsupervised/articulate's shape registry (like `GEN_PIPELINES`). */
export declare const SpecShapeSchema: z.ZodObject<{
    pipeline: z.ZodString;
    label: z.ZodString;
    fields: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        kind: z.ZodEnum<["text", "longtext", "choice", "list", "number", "boolean"]>;
        /** A required field must be pinned or delegated before the spec is complete. */
        required: z.ZodBoolean;
        /** Prompt hint the volley uses when eliciting this field. */
        hint: z.ZodOptional<z.ZodString>;
        examples: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** For `kind: 'choice'` — the allowed values. */
        choices: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "number" | "boolean" | "text" | "longtext" | "choice" | "list";
        required: boolean;
        label: string;
        examples: string[];
        choices?: string[] | undefined;
        hint?: string | undefined;
    }, {
        id: string;
        kind: "number" | "boolean" | "text" | "longtext" | "choice" | "list";
        required: boolean;
        label: string;
        choices?: string[] | undefined;
        hint?: string | undefined;
        examples?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    label: string;
    fields: {
        id: string;
        kind: "number" | "boolean" | "text" | "longtext" | "choice" | "list";
        required: boolean;
        label: string;
        examples: string[];
        choices?: string[] | undefined;
        hint?: string | undefined;
    }[];
    pipeline: string;
}, {
    label: string;
    fields: {
        id: string;
        kind: "number" | "boolean" | "text" | "longtext" | "choice" | "list";
        required: boolean;
        label: string;
        choices?: string[] | undefined;
        hint?: string | undefined;
        examples?: string[] | undefined;
    }[];
    pipeline: string;
}>;
export type SpecShape = z.infer<typeof SpecShapeSchema>;
//# sourceMappingURL=articulate.d.ts.map