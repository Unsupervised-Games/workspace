import { z } from 'zod';
export declare const HarnessOutcomeSchema: z.ZodEnum<["pass", "fail", "error", "not-implemented", "load-error"]>;
export type HarnessOutcome = z.infer<typeof HarnessOutcomeSchema>;
export declare const MeasurementValueSchema: z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodNull]>;
export type MeasurementValue = z.infer<typeof MeasurementValueSchema>;
export declare const HarnessResultSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    /** Mirrors Assertion.id. */
    assertionId: z.ZodString;
    /** Mirrors Assertion.testShape. */
    testShape: z.ZodEnum<["structural", "behavioral", "agent-playthrough", "perceptual"]>;
    outcome: z.ZodEnum<["pass", "fail", "error", "not-implemented", "load-error"]>;
    /** Operator-facing prose explaining the result. For
     *  'pass' this is typically empty or a one-line
     *  confirmation; for 'fail' / 'error' this is the
     *  diagnostic. */
    evidence: z.ZodString;
    /** What the test impl recorded. Compared against
     *  Assertion.measurableTarget when both are present. */
    measurement: z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodNull]>;
    /** True when measurement matches the target. Null when
     *  no target was specified on the assertion. */
    targetMatched: z.ZodNullable<z.ZodBoolean>;
    /** Wall-clock for the assertion in ms. Useful for the
     *  gym's perf budget tracking + spotting flaky tests. */
    durationMs: z.ZodNumber;
    /** Set when outcome is 'error' or 'load-error'. The
     *  error message; not the full stack trace. */
    error: z.ZodNullable<z.ZodString>;
    /** USD this assertion billed — the sum of any perceptual vision-judge
     *  or agent-playthrough LLM calls the impl made via its run context.
     *  0 for the free shapes (structural / behavioral / pixel-diff /
     *  scripted playthrough). Audited so a billed verification call during
     *  authorship shows up in `.code-gen-log.jsonl` like every other spend. */
    costUsd: z.ZodDefault<z.ZodNumber>;
    generatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    durationMs: number;
    costUsd: number;
    error: string | null;
    schemaVersion: 1;
    generatedAt: string;
    testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
    outcome: "error" | "pass" | "fail" | "not-implemented" | "load-error";
    evidence: string;
    measurement: string | number | boolean | null;
    assertionId: string;
    targetMatched: boolean | null;
}, {
    durationMs: number;
    error: string | null;
    schemaVersion: 1;
    generatedAt: string;
    testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
    outcome: "error" | "pass" | "fail" | "not-implemented" | "load-error";
    evidence: string;
    measurement: string | number | boolean | null;
    assertionId: string;
    targetMatched: boolean | null;
    costUsd?: number | undefined;
}>;
export type HarnessResult = z.infer<typeof HarnessResultSchema>;
export declare const HarnessRunSummarySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    generatedAt: z.ZodString;
    /** Number of test impls discovered. */
    discovered: z.ZodNumber;
    /** Per-outcome counts. */
    counts: z.ZodObject<{
        pass: z.ZodNumber;
        fail: z.ZodNumber;
        error: z.ZodNumber;
        'not-implemented': z.ZodNumber;
        'load-error': z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        error: number;
        pass: number;
        fail: number;
        'not-implemented': number;
        'load-error': number;
    }, {
        error: number;
        pass: number;
        fail: number;
        'not-implemented': number;
        'load-error': number;
    }>;
    /** Total wall-clock across all assertions, in ms. */
    totalDurationMs: z.ZodNumber;
    /** Total USD billed across all assertions — the sum of every result's
     *  `costUsd`. The number skill-builder audits as `harness-judge` spend. */
    totalCostUsd: z.ZodDefault<z.ZodNumber>;
    /** Per-result detail. Ordered by assertionId
     *  alphabetically for determinism. */
    results: z.ZodArray<z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        /** Mirrors Assertion.id. */
        assertionId: z.ZodString;
        /** Mirrors Assertion.testShape. */
        testShape: z.ZodEnum<["structural", "behavioral", "agent-playthrough", "perceptual"]>;
        outcome: z.ZodEnum<["pass", "fail", "error", "not-implemented", "load-error"]>;
        /** Operator-facing prose explaining the result. For
         *  'pass' this is typically empty or a one-line
         *  confirmation; for 'fail' / 'error' this is the
         *  diagnostic. */
        evidence: z.ZodString;
        /** What the test impl recorded. Compared against
         *  Assertion.measurableTarget when both are present. */
        measurement: z.ZodUnion<[z.ZodNumber, z.ZodBoolean, z.ZodString, z.ZodNull]>;
        /** True when measurement matches the target. Null when
         *  no target was specified on the assertion. */
        targetMatched: z.ZodNullable<z.ZodBoolean>;
        /** Wall-clock for the assertion in ms. Useful for the
         *  gym's perf budget tracking + spotting flaky tests. */
        durationMs: z.ZodNumber;
        /** Set when outcome is 'error' or 'load-error'. The
         *  error message; not the full stack trace. */
        error: z.ZodNullable<z.ZodString>;
        /** USD this assertion billed — the sum of any perceptual vision-judge
         *  or agent-playthrough LLM calls the impl made via its run context.
         *  0 for the free shapes (structural / behavioral / pixel-diff /
         *  scripted playthrough). Audited so a billed verification call during
         *  authorship shows up in `.code-gen-log.jsonl` like every other spend. */
        costUsd: z.ZodDefault<z.ZodNumber>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        durationMs: number;
        costUsd: number;
        error: string | null;
        schemaVersion: 1;
        generatedAt: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        outcome: "error" | "pass" | "fail" | "not-implemented" | "load-error";
        evidence: string;
        measurement: string | number | boolean | null;
        assertionId: string;
        targetMatched: boolean | null;
    }, {
        durationMs: number;
        error: string | null;
        schemaVersion: 1;
        generatedAt: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        outcome: "error" | "pass" | "fail" | "not-implemented" | "load-error";
        evidence: string;
        measurement: string | number | boolean | null;
        assertionId: string;
        targetMatched: boolean | null;
        costUsd?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    generatedAt: string;
    counts: {
        error: number;
        pass: number;
        fail: number;
        'not-implemented': number;
        'load-error': number;
    };
    results: {
        durationMs: number;
        costUsd: number;
        error: string | null;
        schemaVersion: 1;
        generatedAt: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        outcome: "error" | "pass" | "fail" | "not-implemented" | "load-error";
        evidence: string;
        measurement: string | number | boolean | null;
        assertionId: string;
        targetMatched: boolean | null;
    }[];
    totalCostUsd: number;
    discovered: number;
    totalDurationMs: number;
}, {
    schemaVersion: 1;
    generatedAt: string;
    counts: {
        error: number;
        pass: number;
        fail: number;
        'not-implemented': number;
        'load-error': number;
    };
    results: {
        durationMs: number;
        error: string | null;
        schemaVersion: 1;
        generatedAt: string;
        testShape: "structural" | "behavioral" | "agent-playthrough" | "perceptual";
        outcome: "error" | "pass" | "fail" | "not-implemented" | "load-error";
        evidence: string;
        measurement: string | number | boolean | null;
        assertionId: string;
        targetMatched: boolean | null;
        costUsd?: number | undefined;
    }[];
    discovered: number;
    totalDurationMs: number;
    totalCostUsd?: number | undefined;
}>;
export type HarnessRunSummary = z.infer<typeof HarnessRunSummarySchema>;
//# sourceMappingURL=harnessResult.d.ts.map