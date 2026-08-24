import { z } from 'zod';
/** The target a build runs on. `console` is generic for v1 (specific consoles
 *  can be added without a data migration — it's just another enum member). */
export declare const BuildPlatformSchema: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
export type BuildPlatform = z.infer<typeof BuildPlatformSchema>;
/** The release environment. Builds are PROMOTED left-to-right. */
export declare const BuildEnvironmentSchema: z.ZodEnum<["develop", "staging", "production"]>;
export type BuildEnvironment = z.infer<typeof BuildEnvironmentSchema>;
/** An uploaded build binary — recorded once, referenced by every release that
 *  promotes it through the environments. The bytes live at `storagePath` in the
 *  org-scoped bucket; `contentHash` is the SHA-256 of the binary (dedupe +
 *  integrity). */
export declare const BuildArtifactSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    gameSlug: z.ZodString;
    platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
    /** Build version / label, e.g. "1.4.0" or "1.4.0-rc2+build.317". */
    version: z.ZodString;
    filename: z.ZodString;
    sizeBytes: z.ZodNumber;
    /** SHA-256 hex of the binary. */
    contentHash: z.ZodString;
    /** Object-storage path (org-scoped: `<orgId>/<gameSlug>/…`). */
    storagePath: z.ZodString;
    /** Member (user id / email) who pushed it. */
    uploadedBy: z.ZodString;
    uploadedAt: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    contentHash: string;
    orgId: string;
    gameSlug: string;
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    filename: string;
    sizeBytes: number;
    storagePath: string;
    uploadedBy: string;
    uploadedAt: string;
    notes?: string | undefined;
}, {
    id: string;
    version: string;
    contentHash: string;
    orgId: string;
    gameSlug: string;
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    filename: string;
    sizeBytes: number;
    storagePath: string;
    uploadedBy: string;
    uploadedAt: string;
    notes?: string | undefined;
}>;
export type BuildArtifact = z.infer<typeof BuildArtifactSchema>;
/** The upload input (the store assigns id / storagePath / uploadedBy / uploadedAt). */
export declare const NewBuildArtifactSchema: z.ZodObject<{
    gameSlug: z.ZodString;
    platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
    version: z.ZodString;
    filename: z.ZodString;
    sizeBytes: z.ZodNumber;
    contentHash: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: string;
    contentHash: string;
    gameSlug: string;
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    filename: string;
    sizeBytes: number;
    notes?: string | undefined;
}, {
    version: string;
    contentHash: string;
    gameSlug: string;
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    filename: string;
    sizeBytes: number;
    notes?: string | undefined;
}>;
export type NewBuildArtifact = z.infer<typeof NewBuildArtifactSchema>;
/** An artifact's placement in one environment. Uploading an artifact creates its
 *  initial `develop` release; promoting creates a new release in the next
 *  environment referencing the SAME artifact (`promotedFrom` names the source). */
export declare const BuildReleaseSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    gameSlug: z.ZodString;
    artifactId: z.ZodString;
    /** Denormalized from the artifact so the matrix can group by platform. */
    platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
    environment: z.ZodEnum<["develop", "staging", "production"]>;
    releasedBy: z.ZodString;
    releasedAt: z.ZodString;
    /** The environment it was promoted FROM (absent for the initial develop upload). */
    promotedFrom: z.ZodOptional<z.ZodEnum<["develop", "staging", "production"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    environment: "develop" | "staging" | "production";
    orgId: string;
    gameSlug: string;
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    artifactId: string;
    releasedBy: string;
    releasedAt: string;
    promotedFrom?: "develop" | "staging" | "production" | undefined;
}, {
    id: string;
    environment: "develop" | "staging" | "production";
    orgId: string;
    gameSlug: string;
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    artifactId: string;
    releasedBy: string;
    releasedAt: string;
    promotedFrom?: "develop" | "staging" | "production" | undefined;
}>;
export type BuildRelease = z.infer<typeof BuildReleaseSchema>;
/** One cell of the build matrix — the current (latest) release + its artifact for
 *  a (platform, environment), or null when nothing has shipped there. */
export declare const BuildMatrixCellSchema: z.ZodObject<{
    environment: z.ZodEnum<["develop", "staging", "production"]>;
    release: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        gameSlug: z.ZodString;
        artifactId: z.ZodString;
        /** Denormalized from the artifact so the matrix can group by platform. */
        platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
        environment: z.ZodEnum<["develop", "staging", "production"]>;
        releasedBy: z.ZodString;
        releasedAt: z.ZodString;
        /** The environment it was promoted FROM (absent for the initial develop upload). */
        promotedFrom: z.ZodOptional<z.ZodEnum<["develop", "staging", "production"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        environment: "develop" | "staging" | "production";
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        artifactId: string;
        releasedBy: string;
        releasedAt: string;
        promotedFrom?: "develop" | "staging" | "production" | undefined;
    }, {
        id: string;
        environment: "develop" | "staging" | "production";
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        artifactId: string;
        releasedBy: string;
        releasedAt: string;
        promotedFrom?: "develop" | "staging" | "production" | undefined;
    }>>;
    artifact: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        gameSlug: z.ZodString;
        platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
        /** Build version / label, e.g. "1.4.0" or "1.4.0-rc2+build.317". */
        version: z.ZodString;
        filename: z.ZodString;
        sizeBytes: z.ZodNumber;
        /** SHA-256 hex of the binary. */
        contentHash: z.ZodString;
        /** Object-storage path (org-scoped: `<orgId>/<gameSlug>/…`). */
        storagePath: z.ZodString;
        /** Member (user id / email) who pushed it. */
        uploadedBy: z.ZodString;
        uploadedAt: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        version: string;
        contentHash: string;
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        filename: string;
        sizeBytes: number;
        storagePath: string;
        uploadedBy: string;
        uploadedAt: string;
        notes?: string | undefined;
    }, {
        id: string;
        version: string;
        contentHash: string;
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        filename: string;
        sizeBytes: number;
        storagePath: string;
        uploadedBy: string;
        uploadedAt: string;
        notes?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    environment: "develop" | "staging" | "production";
    release: {
        id: string;
        environment: "develop" | "staging" | "production";
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        artifactId: string;
        releasedBy: string;
        releasedAt: string;
        promotedFrom?: "develop" | "staging" | "production" | undefined;
    } | null;
    artifact: {
        id: string;
        version: string;
        contentHash: string;
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        filename: string;
        sizeBytes: number;
        storagePath: string;
        uploadedBy: string;
        uploadedAt: string;
        notes?: string | undefined;
    } | null;
}, {
    environment: "develop" | "staging" | "production";
    release: {
        id: string;
        environment: "develop" | "staging" | "production";
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        artifactId: string;
        releasedBy: string;
        releasedAt: string;
        promotedFrom?: "develop" | "staging" | "production" | undefined;
    } | null;
    artifact: {
        id: string;
        version: string;
        contentHash: string;
        orgId: string;
        gameSlug: string;
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        filename: string;
        sizeBytes: number;
        storagePath: string;
        uploadedBy: string;
        uploadedAt: string;
        notes?: string | undefined;
    } | null;
}>;
export type BuildMatrixCell = z.infer<typeof BuildMatrixCellSchema>;
/** One platform's row across every environment. */
export declare const BuildMatrixRowSchema: z.ZodObject<{
    platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
    cells: z.ZodArray<z.ZodObject<{
        environment: z.ZodEnum<["develop", "staging", "production"]>;
        release: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            orgId: z.ZodString;
            gameSlug: z.ZodString;
            artifactId: z.ZodString;
            /** Denormalized from the artifact so the matrix can group by platform. */
            platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
            environment: z.ZodEnum<["develop", "staging", "production"]>;
            releasedBy: z.ZodString;
            releasedAt: z.ZodString;
            /** The environment it was promoted FROM (absent for the initial develop upload). */
            promotedFrom: z.ZodOptional<z.ZodEnum<["develop", "staging", "production"]>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            environment: "develop" | "staging" | "production";
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            artifactId: string;
            releasedBy: string;
            releasedAt: string;
            promotedFrom?: "develop" | "staging" | "production" | undefined;
        }, {
            id: string;
            environment: "develop" | "staging" | "production";
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            artifactId: string;
            releasedBy: string;
            releasedAt: string;
            promotedFrom?: "develop" | "staging" | "production" | undefined;
        }>>;
        artifact: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            orgId: z.ZodString;
            gameSlug: z.ZodString;
            platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
            /** Build version / label, e.g. "1.4.0" or "1.4.0-rc2+build.317". */
            version: z.ZodString;
            filename: z.ZodString;
            sizeBytes: z.ZodNumber;
            /** SHA-256 hex of the binary. */
            contentHash: z.ZodString;
            /** Object-storage path (org-scoped: `<orgId>/<gameSlug>/…`). */
            storagePath: z.ZodString;
            /** Member (user id / email) who pushed it. */
            uploadedBy: z.ZodString;
            uploadedAt: z.ZodString;
            notes: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            contentHash: string;
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            filename: string;
            sizeBytes: number;
            storagePath: string;
            uploadedBy: string;
            uploadedAt: string;
            notes?: string | undefined;
        }, {
            id: string;
            version: string;
            contentHash: string;
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            filename: string;
            sizeBytes: number;
            storagePath: string;
            uploadedBy: string;
            uploadedAt: string;
            notes?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        environment: "develop" | "staging" | "production";
        release: {
            id: string;
            environment: "develop" | "staging" | "production";
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            artifactId: string;
            releasedBy: string;
            releasedAt: string;
            promotedFrom?: "develop" | "staging" | "production" | undefined;
        } | null;
        artifact: {
            id: string;
            version: string;
            contentHash: string;
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            filename: string;
            sizeBytes: number;
            storagePath: string;
            uploadedBy: string;
            uploadedAt: string;
            notes?: string | undefined;
        } | null;
    }, {
        environment: "develop" | "staging" | "production";
        release: {
            id: string;
            environment: "develop" | "staging" | "production";
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            artifactId: string;
            releasedBy: string;
            releasedAt: string;
            promotedFrom?: "develop" | "staging" | "production" | undefined;
        } | null;
        artifact: {
            id: string;
            version: string;
            contentHash: string;
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            filename: string;
            sizeBytes: number;
            storagePath: string;
            uploadedBy: string;
            uploadedAt: string;
            notes?: string | undefined;
        } | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    cells: {
        environment: "develop" | "staging" | "production";
        release: {
            id: string;
            environment: "develop" | "staging" | "production";
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            artifactId: string;
            releasedBy: string;
            releasedAt: string;
            promotedFrom?: "develop" | "staging" | "production" | undefined;
        } | null;
        artifact: {
            id: string;
            version: string;
            contentHash: string;
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            filename: string;
            sizeBytes: number;
            storagePath: string;
            uploadedBy: string;
            uploadedAt: string;
            notes?: string | undefined;
        } | null;
    }[];
}, {
    platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
    cells: {
        environment: "develop" | "staging" | "production";
        release: {
            id: string;
            environment: "develop" | "staging" | "production";
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            artifactId: string;
            releasedBy: string;
            releasedAt: string;
            promotedFrom?: "develop" | "staging" | "production" | undefined;
        } | null;
        artifact: {
            id: string;
            version: string;
            contentHash: string;
            orgId: string;
            gameSlug: string;
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
            filename: string;
            sizeBytes: number;
            storagePath: string;
            uploadedBy: string;
            uploadedAt: string;
            notes?: string | undefined;
        } | null;
    }[];
}>;
export type BuildMatrixRow = z.infer<typeof BuildMatrixRowSchema>;
/** The whole per-game build matrix the Releases section renders. */
export declare const BuildMatrixSchema: z.ZodObject<{
    gameSlug: z.ZodString;
    rows: z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
        cells: z.ZodArray<z.ZodObject<{
            environment: z.ZodEnum<["develop", "staging", "production"]>;
            release: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                orgId: z.ZodString;
                gameSlug: z.ZodString;
                artifactId: z.ZodString;
                /** Denormalized from the artifact so the matrix can group by platform. */
                platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
                environment: z.ZodEnum<["develop", "staging", "production"]>;
                releasedBy: z.ZodString;
                releasedAt: z.ZodString;
                /** The environment it was promoted FROM (absent for the initial develop upload). */
                promotedFrom: z.ZodOptional<z.ZodEnum<["develop", "staging", "production"]>>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            }, {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            }>>;
            artifact: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                orgId: z.ZodString;
                gameSlug: z.ZodString;
                platform: z.ZodEnum<["ios", "android", "web", "windows", "macos", "linux", "console"]>;
                /** Build version / label, e.g. "1.4.0" or "1.4.0-rc2+build.317". */
                version: z.ZodString;
                filename: z.ZodString;
                sizeBytes: z.ZodNumber;
                /** SHA-256 hex of the binary. */
                contentHash: z.ZodString;
                /** Object-storage path (org-scoped: `<orgId>/<gameSlug>/…`). */
                storagePath: z.ZodString;
                /** Member (user id / email) who pushed it. */
                uploadedBy: z.ZodString;
                uploadedAt: z.ZodString;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            }, {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            environment: "develop" | "staging" | "production";
            release: {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            } | null;
            artifact: {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            } | null;
        }, {
            environment: "develop" | "staging" | "production";
            release: {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            } | null;
            artifact: {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            } | null;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        cells: {
            environment: "develop" | "staging" | "production";
            release: {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            } | null;
            artifact: {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            } | null;
        }[];
    }, {
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        cells: {
            environment: "develop" | "staging" | "production";
            release: {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            } | null;
            artifact: {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            } | null;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    gameSlug: string;
    rows: {
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        cells: {
            environment: "develop" | "staging" | "production";
            release: {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            } | null;
            artifact: {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            } | null;
        }[];
    }[];
}, {
    gameSlug: string;
    rows: {
        platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
        cells: {
            environment: "develop" | "staging" | "production";
            release: {
                id: string;
                environment: "develop" | "staging" | "production";
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                artifactId: string;
                releasedBy: string;
                releasedAt: string;
                promotedFrom?: "develop" | "staging" | "production" | undefined;
            } | null;
            artifact: {
                id: string;
                version: string;
                contentHash: string;
                orgId: string;
                gameSlug: string;
                platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "console";
                filename: string;
                sizeBytes: number;
                storagePath: string;
                uploadedBy: string;
                uploadedAt: string;
                notes?: string | undefined;
            } | null;
        }[];
    }[];
}>;
export type BuildMatrix = z.infer<typeof BuildMatrixSchema>;
//# sourceMappingURL=builds.d.ts.map