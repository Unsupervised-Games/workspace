import { z } from 'zod';
/** What was billed. Every kind here spawns a Claude CLI subprocess. */
export declare const CodeSpendKindSchema: z.ZodEnum<["package-author", "package-extend", "skill-gym", "demo", "dev-agent", "bug-fix-plan", "bug-fix-apply", "code-review", "dev-code-review", "informed-captain", "articulate", "narrative-studio", "harness-judge"]>;
export type CodeSpendKind = z.infer<typeof CodeSpendKindSchema>;
/** One row of `.code-gen-log.jsonl` at the workspace root. */
export declare const CodeGenAuditRowSchema: z.ZodObject<{
    /** ISO timestamp. Named `ts` to match the asset/audio row shape that
     *  `normalizeAuditRow` already reads. */
    ts: z.ZodString;
    kind: z.ZodEnum<["package-author", "package-extend", "skill-gym", "demo", "dev-agent", "bug-fix-plan", "bug-fix-apply", "code-review", "dev-code-review", "informed-captain", "articulate", "narrative-studio", "harness-judge"]>;
    /** What it was spent on — a work-item id, bug id, or task id. */
    ref: z.ZodDefault<z.ZodString>;
    /** USD, as reported by the Claude CLI (`total_cost_usd`) or skill-gym's
     *  `cost.json`. The CLI's number is authoritative; we never estimate here. */
    costUsd: z.ZodNumber;
    model: z.ZodOptional<z.ZodString>;
    /** Always `fresh` today — code generation has no content-hash cache, so
     *  nothing is ever free. Kept for shape-parity with the other pipelines
     *  (and so a future code cache can mark rows `cache`). */
    source: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "package-author" | "package-extend" | "skill-gym" | "demo" | "dev-agent" | "bug-fix-plan" | "bug-fix-apply" | "code-review" | "dev-code-review" | "informed-captain" | "articulate" | "narrative-studio" | "harness-judge";
    source: string;
    costUsd: number;
    ts: string;
    ref: string;
    model?: string | undefined;
}, {
    kind: "package-author" | "package-extend" | "skill-gym" | "demo" | "dev-agent" | "bug-fix-plan" | "bug-fix-apply" | "code-review" | "dev-code-review" | "informed-captain" | "articulate" | "narrative-studio" | "harness-judge";
    costUsd: number;
    ts: string;
    source?: string | undefined;
    model?: string | undefined;
    ref?: string | undefined;
}>;
export type CodeGenAuditRow = z.infer<typeof CodeGenAuditRowSchema>;
/** The audit log's filename, at the WORKSPACE root. */
export declare const CODE_GEN_LOG_FILENAME = ".code-gen-log.jsonl";
//# sourceMappingURL=codeGen.d.ts.map