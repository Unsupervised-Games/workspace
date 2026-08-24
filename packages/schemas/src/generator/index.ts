// Generator orchestrator. Glues the extractor and the writers
// together so `cli.ts` stays focused on argument plumbing.

import { extractDomains } from './extractor.js';
import { info, success } from './log.js';
import { writeOutput } from './writers.js';

export interface GenerateArgs {
  /** Absolute path to the engine's canonical schema sources. */
  engineDir: string;
  /** Absolute path to the consuming app's custom schemas dir, or
   *  null when the app has no schemas/ folder. */
  appDir: string | null;
  /** Absolute path to the directory receiving per-domain `.d.ts`
   *  + `schema-map.json`. */
  outDir: string;
  /** Absolute path to the consuming app's root (for AI_MANIFEST.md). */
  appRoot: string;
}

export async function generate(args: GenerateArgs): Promise<void> {
  const startedAt = Date.now();

  const domains = extractDomains({
    engineDir: args.engineDir,
    appDir: args.appDir,
  });

  const totalTypes = domains.reduce((acc, d) => acc + d.types.length, 0);
  info(
    `extracted ${totalTypes} type${totalTypes === 1 ? '' : 's'} across ${domains.length} domain${domains.length === 1 ? '' : 's'}`,
  );

  await writeOutput({
    domains,
    outDir: args.outDir,
    appRoot: args.appRoot,
  });

  success(`Done in ${Date.now() - startedAt}ms.`);
}
