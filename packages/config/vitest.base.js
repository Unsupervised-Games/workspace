// Shared Vitest base config. Written as plain .js rather than .ts because
// Vitest's config loader delegates cross-package imports to Node's ESM
// resolver, which cannot load .ts files from node_modules (workspace
// symlinks count). Exporting .js sidesteps that entirely and also removes
// the need for a build step on @unsupervised/config.
//
// Consumer packages:
//
//   import { mergeConfig, defineConfig } from 'vitest/config';
//   import base from '@unsupervised/config/vitest/base';
//   export default mergeConfig(base, defineConfig({ test: { ... } }));
//
// Design notes:
//   - `environment: 'node'` — headless packages (engine, schemas, pipeline)
//     run tests in Node. UI packages override to `jsdom`.
//   - `globals: false` — tests explicitly import { describe, it, expect }
//     from 'vitest'. Explicit imports keep the set of test-scope identifiers
//     stable across packages.
//   - `typecheck.tsconfig` is wired so consumers can opt into strict type
//     checking of test files with `vitest --typecheck`. Not enabled by
//     default — every package runs `tsc --noEmit` via `check-types`, which
//     already covers test files under `src/**` with full strict mode.

import { defineConfig } from 'vitest/config';

/** @type {import('vitest/config').UserConfig} */
export const vitestBaseConfig = defineConfig({
  test: {
    environment: 'node',
    globals: false,
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    typecheck: {
      tsconfig: './tsconfig.json',
    },
  },
});

export default vitestBaseConfig;
