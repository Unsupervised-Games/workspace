import { z } from 'zod';
/** The gates we run. Ordered by cost: a type error makes lint + test noise, so
 *  a failing earlier gate short-circuits the later ones. */
export declare const QualityGateNameSchema: z.ZodEnum<["check-types", "lint", "test"]>;
export type QualityGateName = z.infer<typeof QualityGateNameSchema>;
export declare const QualityGateResultSchema: z.ZodObject<{
    gate: z.ZodEnum<["check-types", "lint", "test"]>;
    /** The exact command run — operator-facing, so a failure is reproducible. */
    command: z.ZodString;
    /** Subprocess exit code. -1 when the gate was skipped or the spawn failed. */
    exitCode: z.ZodNumber;
    passed: z.ZodBoolean;
    durationMs: z.ZodNumber;
    /** Tail of combined stdout+stderr — enough to diagnose without persisting
     *  megabytes of build log into a bug record. */
    outputTail: z.ZodDefault<z.ZodString>;
    /** True when the gate never ran (an earlier gate failed, or the scope has no
     *  such script). A skipped gate is NOT a passing gate. */
    skipped: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    durationMs: number;
    gate: "check-types" | "lint" | "test";
    command: string;
    passed: boolean;
    exitCode: number;
    outputTail: string;
    skipped: boolean;
}, {
    durationMs: number;
    gate: "check-types" | "lint" | "test";
    command: string;
    passed: boolean;
    exitCode: number;
    outputTail?: string | undefined;
    skipped?: boolean | undefined;
}>;
export type QualityGateResult = z.infer<typeof QualityGateResultSchema>;
export declare const QualityGateReportSchema: z.ZodObject<{
    /** What was gated — a package name (`@unsupervised/timescale`) or a game slug. */
    scope: z.ZodString;
    ranAt: z.ZodString;
    results: z.ZodArray<z.ZodObject<{
        gate: z.ZodEnum<["check-types", "lint", "test"]>;
        /** The exact command run — operator-facing, so a failure is reproducible. */
        command: z.ZodString;
        /** Subprocess exit code. -1 when the gate was skipped or the spawn failed. */
        exitCode: z.ZodNumber;
        passed: z.ZodBoolean;
        durationMs: z.ZodNumber;
        /** Tail of combined stdout+stderr — enough to diagnose without persisting
         *  megabytes of build log into a bug record. */
        outputTail: z.ZodDefault<z.ZodString>;
        /** True when the gate never ran (an earlier gate failed, or the scope has no
         *  such script). A skipped gate is NOT a passing gate. */
        skipped: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        durationMs: number;
        gate: "check-types" | "lint" | "test";
        command: string;
        passed: boolean;
        exitCode: number;
        outputTail: string;
        skipped: boolean;
    }, {
        durationMs: number;
        gate: "check-types" | "lint" | "test";
        command: string;
        passed: boolean;
        exitCode: number;
        outputTail?: string | undefined;
        skipped?: boolean | undefined;
    }>, "many">;
    /** The verdict. True ⇔ at least one gate RAN and every gate that ran passed.
     *
     *  "At least one" is load-bearing: a report where every gate was skipped
     *  proves nothing, and must not read as success. This is the same class of
     *  bug as the assertion harness counting `not-implemented` as a pass — an
     *  artifact that was never checked is not an artifact that passed. */
    passed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    results: {
        durationMs: number;
        gate: "check-types" | "lint" | "test";
        command: string;
        passed: boolean;
        exitCode: number;
        outputTail: string;
        skipped: boolean;
    }[];
    passed: boolean;
    scope: string;
    ranAt: string;
}, {
    results: {
        durationMs: number;
        gate: "check-types" | "lint" | "test";
        command: string;
        passed: boolean;
        exitCode: number;
        outputTail?: string | undefined;
        skipped?: boolean | undefined;
    }[];
    passed: boolean;
    scope: string;
    ranAt: string;
}>;
export type QualityGateReport = z.infer<typeof QualityGateReportSchema>;
/** PURE — the verdict for a set of gate results. Shared by every consumer so
 *  "did the gates pass" means exactly one thing across the monorepo. */
export declare function evaluateQualityGates(results: readonly QualityGateResult[]): boolean;
//# sourceMappingURL=qualityGate.d.ts.map