import { z } from 'zod';
/** What kind of artifact the pipeline shipped. */
export declare const CodeArtifactKindSchema: z.ZodEnum<["package", "skill"]>;
export type CodeArtifactKind = z.infer<typeof CodeArtifactKindSchema>;
export declare const CodeArtifactStatusSchema: z.ZodEnum<["current", "stale", "regressed", "unverified", "missing"]>;
export type CodeArtifactStatus = z.infer<typeof CodeArtifactStatusSchema>;
export declare const CodeArtifactReportSchema: z.ZodObject<{
    /** The build that produced it (`builds/<featureId>/`). */
    buildId: z.ZodString;
    workItemId: z.ZodString;
    kind: z.ZodEnum<["package", "skill"]>;
    /** `@unsupervised/timescale`, or the skill name. */
    name: z.ZodString;
    /** Workspace-relative path to the artifact. */
    path: z.ZodString;
    status: z.ZodEnum<["current", "stale", "regressed", "unverified", "missing"]>;
    /** Operator-facing explanation. Empty when `current`. */
    reasons: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Current fingerprint of the artifact's source (null when missing). */
    fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** The fingerprint recorded when it last verified (null for artifacts that
     *  predate fingerprinting — those are always re-verified). */
    recordedFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    /** Whether it was actually re-verified this run (vs. skipped as unchanged). */
    reverified: z.ZodDefault<z.ZodBoolean>;
    /** Re-verification detail, when it ran. */
    gatesPassed: z.ZodDefault<z.ZodNullable<z.ZodBoolean>>;
    assertionsVerified: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    assertionsUnverified: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    path: string;
    status: "current" | "missing" | "stale" | "regressed" | "unverified";
    kind: "package" | "skill";
    name: string;
    fingerprint: string | null;
    gatesPassed: boolean | null;
    buildId: string;
    workItemId: string;
    reasons: string[];
    recordedFingerprint: string | null;
    reverified: boolean;
    assertionsVerified: number | null;
    assertionsUnverified: number | null;
}, {
    path: string;
    status: "current" | "missing" | "stale" | "regressed" | "unverified";
    kind: "package" | "skill";
    name: string;
    buildId: string;
    workItemId: string;
    fingerprint?: string | null | undefined;
    gatesPassed?: boolean | null | undefined;
    reasons?: string[] | undefined;
    recordedFingerprint?: string | null | undefined;
    reverified?: boolean | undefined;
    assertionsVerified?: number | null | undefined;
    assertionsUnverified?: number | null | undefined;
}>;
export type CodeArtifactReport = z.infer<typeof CodeArtifactReportSchema>;
export declare const CodeMaintainReportSchema: z.ZodObject<{
    ranAt: z.ZodString;
    workspaceRoot: z.ZodString;
    artifacts: z.ZodArray<z.ZodObject<{
        /** The build that produced it (`builds/<featureId>/`). */
        buildId: z.ZodString;
        workItemId: z.ZodString;
        kind: z.ZodEnum<["package", "skill"]>;
        /** `@unsupervised/timescale`, or the skill name. */
        name: z.ZodString;
        /** Workspace-relative path to the artifact. */
        path: z.ZodString;
        status: z.ZodEnum<["current", "stale", "regressed", "unverified", "missing"]>;
        /** Operator-facing explanation. Empty when `current`. */
        reasons: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** Current fingerprint of the artifact's source (null when missing). */
        fingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        /** The fingerprint recorded when it last verified (null for artifacts that
         *  predate fingerprinting — those are always re-verified). */
        recordedFingerprint: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        /** Whether it was actually re-verified this run (vs. skipped as unchanged). */
        reverified: z.ZodDefault<z.ZodBoolean>;
        /** Re-verification detail, when it ran. */
        gatesPassed: z.ZodDefault<z.ZodNullable<z.ZodBoolean>>;
        assertionsVerified: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
        assertionsUnverified: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        status: "current" | "missing" | "stale" | "regressed" | "unverified";
        kind: "package" | "skill";
        name: string;
        fingerprint: string | null;
        gatesPassed: boolean | null;
        buildId: string;
        workItemId: string;
        reasons: string[];
        recordedFingerprint: string | null;
        reverified: boolean;
        assertionsVerified: number | null;
        assertionsUnverified: number | null;
    }, {
        path: string;
        status: "current" | "missing" | "stale" | "regressed" | "unverified";
        kind: "package" | "skill";
        name: string;
        buildId: string;
        workItemId: string;
        fingerprint?: string | null | undefined;
        gatesPassed?: boolean | null | undefined;
        reasons?: string[] | undefined;
        recordedFingerprint?: string | null | undefined;
        reverified?: boolean | undefined;
        assertionsVerified?: number | null | undefined;
        assertionsUnverified?: number | null | undefined;
    }>, "many">;
    counts: z.ZodObject<{
        current: z.ZodNumber;
        stale: z.ZodNumber;
        regressed: z.ZodNumber;
        unverified: z.ZodNumber;
        missing: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        current: number;
        missing: number;
        stale: number;
        regressed: number;
        unverified: number;
    }, {
        current: number;
        missing: number;
        stale: number;
        regressed: number;
        unverified: number;
    }>;
    /** True ⇔ nothing is regressed, unverified, or missing.
     *
     *  `stale` does NOT fail the run: a source change is expected and only means
     *  the recorded verification is out of date. A REGRESSION is a real failure —
     *  something that used to work doesn't. */
    ok: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    ok: boolean;
    counts: {
        current: number;
        missing: number;
        stale: number;
        regressed: number;
        unverified: number;
    };
    workspaceRoot: string;
    ranAt: string;
    artifacts: {
        path: string;
        status: "current" | "missing" | "stale" | "regressed" | "unverified";
        kind: "package" | "skill";
        name: string;
        fingerprint: string | null;
        gatesPassed: boolean | null;
        buildId: string;
        workItemId: string;
        reasons: string[];
        recordedFingerprint: string | null;
        reverified: boolean;
        assertionsVerified: number | null;
        assertionsUnverified: number | null;
    }[];
}, {
    ok: boolean;
    counts: {
        current: number;
        missing: number;
        stale: number;
        regressed: number;
        unverified: number;
    };
    workspaceRoot: string;
    ranAt: string;
    artifacts: {
        path: string;
        status: "current" | "missing" | "stale" | "regressed" | "unverified";
        kind: "package" | "skill";
        name: string;
        buildId: string;
        workItemId: string;
        fingerprint?: string | null | undefined;
        gatesPassed?: boolean | null | undefined;
        reasons?: string[] | undefined;
        recordedFingerprint?: string | null | undefined;
        reverified?: boolean | undefined;
        assertionsVerified?: number | null | undefined;
        assertionsUnverified?: number | null | undefined;
    }[];
}>;
export type CodeMaintainReport = z.infer<typeof CodeMaintainReportSchema>;
//# sourceMappingURL=codeMaintain.d.ts.map