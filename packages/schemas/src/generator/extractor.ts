// ts-morph extractor.
//
// Walks every TypeScript source file in the given directories,
// finds the canonical pair:
//
//     export const FooSchema = z.object({...});
//     export type Foo = z.infer<typeof FooSchema>;
//
// and resolves `Foo` to its fully-expanded, AI-readable shape
// (`{ id: string; damage: number; ... }`). Files that don't follow
// the convention contribute nothing — there's no manual filter list,
// the convention IS the filter.
//
// Why ts-morph and not raw `typescript`:
// ts-morph's `Project` wraps the TS compiler with an ergonomic AST
// API, exposing the type checker through the same node objects we
// walk. Building a Project with just `compilerOptions` (no tsconfig)
// gives us a clean, deterministic resolution context independent of
// whatever the consuming app's tsconfig happens to look like.

import { basename, extname, sep } from 'node:path';
import {
  Project,
  ScriptTarget,
  ModuleKind,
  ModuleResolutionKind,
  TypeFormatFlags,
  type SourceFile,
  type TypeAliasDeclaration,
} from 'ts-morph';
import { warn } from './log.js';

/** A single resolved type alias ready to render into a `.d.ts`. */
export interface ExtractedType {
  /** TypeScript identifier — e.g. `WeaponConfig`. */
  name: string;
  /** Fully-expanded type body — e.g. `{ id: string; damage: number; ... }`.
   *  Already self-contained: no `z.infer<...>`, no Zod runtime. */
  text: string;
}

/** A bucket of types written to one `.d.ts` file. */
export interface ExtractedDomain {
  /** Slug used in the schema-map JSON and the manifest table. */
  name: string;
  /** Filename written under `<outDir>/`, e.g. `engine-primitives.d.ts`. */
  outputFile: string;
  /** Source-of-origin (engine / app), shown in the manifest header. */
  origin: 'engine' | 'app';
  types: ExtractedType[];
}

export interface ExtractDomainsArgs {
  /** Directory holding the engine's canonical schema sources. */
  engineDir: string;
  /** Directory holding the consuming app's custom schemas. May be
   *  null if the app has no schemas/ folder yet. */
  appDir: string | null;
}

/**
 * Walk both schema directories and produce a flat list of extracted
 * domains:
 *   - One monolithic `engine-primitives` domain for everything under
 *     `engineDir`.
 *   - One per-file domain for each `.ts` under `appDir`.
 *
 * Resolution flags:
 *   - `NoTruncation` so deep schemas don't print as `...`
 *   - `InTypeAlias` so we get the value-side body of `z.infer<...>`
 *     instead of the alias text.
 *   - `UseStructuralFallback` so types that don't have a clean alias
 *     still serialize structurally rather than as opaque references.
 */
export function extractDomains(args: ExtractDomainsArgs): ExtractedDomain[] {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
      strict: true,
      skipLibCheck: true,
      // Schemas import each other via `.js` extensions to satisfy the
      // ESM emit; ts-morph needs `allowImportingTsExtensions` off and
      // bundler resolution to follow them through.
    },
  });

  const domains: ExtractedDomain[] = [];

  // ── Engine: monolithic bucket ─────────────────────────────────
  const engineFiles = collectSchemaFiles(project, args.engineDir);
  const engineTypes: ExtractedType[] = [];
  for (const file of engineFiles) {
    engineTypes.push(...extractFromFile(file));
  }
  // Stable order → stable diffs.
  engineTypes.sort((a, b) => a.name.localeCompare(b.name));
  domains.push({
    name: 'engine-primitives',
    outputFile: 'engine-primitives.d.ts',
    origin: 'engine',
    types: engineTypes,
  });

  // ── App: one domain per source file ───────────────────────────
  if (args.appDir) {
    const appFiles = collectSchemaFiles(project, args.appDir);
    for (const file of appFiles) {
      const types = extractFromFile(file);
      if (types.length === 0) continue;
      types.sort((a, b) => a.name.localeCompare(b.name));
      const slug = fileToDomainSlug(file.getFilePath());
      domains.push({
        name: slug,
        outputFile: `${slug}.d.ts`,
        origin: 'app',
        types,
      });
    }
    // Sort app domains alphabetically; engine stays first.
    const appDomains = domains.slice(1);
    appDomains.sort((a, b) => a.name.localeCompare(b.name));
    domains.splice(1, domains.length - 1, ...appDomains);
  }

  return domains;
}

/** Add every `.ts` (or `.d.ts`) file under `dir` to the project,
 *  skipping anything obviously not a schema source — tests, the CLI
 *  itself, the package barrel, the generator subtree. */
function collectSchemaFiles(project: Project, dir: string): SourceFile[] {
  const files = project.addSourceFilesAtPaths([
    `${dir}/**/*.ts`,
    `${dir}/**/*.d.ts`,
  ]);
  return files.filter((file) => {
    const path = file.getFilePath();
    if (path.endsWith('.test.ts') || path.endsWith('.test.d.ts')) return false;
    const fileName = basename(path);
    if (fileName === 'cli.ts' || fileName === 'cli.d.ts') return false;
    if (fileName === 'index.ts' || fileName === 'index.d.ts') return false;
    if (path.includes(`${sep}generator${sep}`)) return false;
    return true;
  });
}

/**
 * Extract every Zod-derived type alias from a single source file.
 *
 * The convention we look for:
 *
 *     export const FooSchema = z.object({...});
 *     export type Foo = z.infer<typeof FooSchema>;
 *
 * A type alias is included only if a sibling `${aliasName}Schema`
 * value exists and is exported in the same file. This filters out
 * unrelated `export type X` aliases that happen to live next door.
 */
function extractFromFile(file: SourceFile): ExtractedType[] {
  // Build an index of exported `XxxSchema` value declarations in
  // this file. We use it to gate type aliases — only `Foo` whose
  // sibling `FooSchema` exists qualifies as Zod-derived.
  const schemaConsts = new Set<string>();
  for (const varDecl of file.getVariableDeclarations()) {
    if (!varDecl.isExported()) continue;
    const name = varDecl.getName();
    if (name.endsWith('Schema')) schemaConsts.add(name);
  }

  const formatFlags =
    TypeFormatFlags.NoTruncation |
    TypeFormatFlags.InTypeAlias |
    TypeFormatFlags.UseStructuralFallback;

  const out: ExtractedType[] = [];
  for (const alias of file.getTypeAliases()) {
    if (!alias.isExported()) continue;
    const aliasName = alias.getName();
    if (!schemaConsts.has(`${aliasName}Schema`)) continue;

    try {
      const text = alias.getType().getText(alias, formatFlags);
      out.push({ name: aliasName, text });
    } catch (cause) {
      warn(
        `Failed to resolve type ${aliasName} in ${file.getFilePath()} — ${
          cause instanceof Error ? cause.message : String(cause)
        }`,
      );
    }
  }
  return out;
}

/**
 * Path → URL-safe domain slug. `apps/dex/schemas/inventory/items.ts`
 * → `inventory_items`. Only the path RELATIVE to the schemas dir
 * matters in principle, but using the full filename keeps the slug
 * stable when files move within the directory.
 */
function fileToDomainSlug(absPath: string): string {
  const noExt = absPath.slice(0, absPath.length - extname(absPath).length);
  const fileName = basename(noExt);
  return sanitizeSlug(fileName);
}

function sanitizeSlug(value: string): string {
  return value
    .replace(/[\s\-./\\]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .toLowerCase();
}

/** Re-exported so tests can poke at the AST node directly. */
export type { TypeAliasDeclaration };
