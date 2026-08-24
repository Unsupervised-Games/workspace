// `schema-gen` CLI entry point.
//
// Splits the engine-wide and app-level Zod schemas into per-domain
// `.d.ts` files plus an `AI_MANIFEST.md` routing table. The CLI is
// installed as a bin of `@unsupervised/schemas`, so any consuming app can
// invoke it from its own directory:
//
//   schema-gen --app-schemas ./schemas --out-dir ./lib/generated/ai-context
//
// Multi-tenant safety: every path (input + output) is derived from
// CLI arguments resolved against `process.cwd()`. There are no
// hardcoded references to `apps/dex` or any specific game.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import fse from 'fs-extra';
import { generate } from './generator/index.js';
import { error, info, warn } from './generator/log.js';

interface RawAssetsCommandOptions {
  appSchemas: string;
  outDir: string;
  engineSchemas: string;
}

/** Default --engine-schemas path resolves to the schemas package's
 *  source directory. The CLI binary lives at `<schemas-pkg>/dist/cli.js`,
 *  so `../src` from there is the canonical schema source tree.
 *
 *  Why source (.ts) and not `dist` (.d.ts):
 *  ts-morph's type checker resolves `z.infer<typeof XSchema>`
 *  correctly against zod's full source-level types, which produces
 *  a cleaner expansion than reading the already-emitted `.d.ts`
 *  (where the type is preserved verbatim as `z.infer<...>`). */
function defaultEngineSchemasPath(): string {
  const cliDir = dirname(fileURLToPath(import.meta.url));
  return resolve(cliDir, '..', 'src');
}

const program = new Command();

program
  .name('schema-gen')
  .description(
    'Split engine + app Zod schemas into AI-friendly .d.ts dictionaries with a routing manifest.',
  )
  .version('0.0.0');

program
  .option(
    '--app-schemas <path>',
    "consuming app's custom schemas directory",
    './schemas',
  )
  .option(
    '--out-dir <path>',
    'output directory for generated AI context',
    './lib/generated/ai-context',
  )
  .option(
    '--engine-schemas <path>',
    "override path to @unsupervised/schemas's engine schemas",
    defaultEngineSchemasPath(),
  )
  .action(async (rawOpts: RawAssetsCommandOptions) => {
    const appRoot = process.cwd();
    const appSchemas = resolve(appRoot, rawOpts.appSchemas);
    const outDir = resolve(appRoot, rawOpts.outDir);
    const engineSchemas = resolve(appRoot, rawOpts.engineSchemas);

    info(`engine → ${engineSchemas}`);
    info(`app    → ${appSchemas}`);
    info(`out    → ${outDir}`);

    if (!(await fse.pathExists(engineSchemas))) {
      error(
        `Engine schemas not found at ${engineSchemas}. Pass --engine-schemas if the default doesn't apply.`,
      );
      process.exit(1);
    }

    const appExists = await fse.pathExists(appSchemas);
    if (!appExists) {
      warn(
        `No app schemas found at ${appSchemas}; engine domain will still be generated.`,
      );
    }

    await generate({
      engineDir: engineSchemas,
      appDir: appExists ? appSchemas : null,
      outDir,
      appRoot,
    });
  });

program.parseAsync(process.argv).catch((cause: unknown) => {
  error(cause instanceof Error ? (cause.stack ?? cause.message) : String(cause));
  process.exit(1);
});
