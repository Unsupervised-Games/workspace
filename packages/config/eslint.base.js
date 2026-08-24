// Shared ESLint flat config (v9) for every TypeScript package in the monorepo.
//
// Design notes for an AI-first workflow:
//   - Flat config so consumers compose presets with plain `import` instead of
//     fragile string-based `extends` chains.
//   - Prettier is layered via `eslint-config-prettier` to turn off all stylistic
//     rules; formatting is owned entirely by Prettier, lint is owned by ESLint.
//     We deliberately do NOT run Prettier through ESLint — that couples two
//     slow tools and produces noisy diffs that confuse code generation.
//   - `no-explicit-any` and `no-unused-vars` are warnings, not errors, because
//     mid-generation code commonly trips them; they should nag, not block.
//   - No React here. React rules live in ./eslint.react.js so that headless /
//     Node-only packages never load the React plugins.
//
// Architectural-boundary enforcement:
//   `no-restricted-imports` is the workhorse for converting our layering
//   conventions into hard errors. Two cross-cutting bans live here in the
//   base preset (so every package inherits them):
//
//     1. Sub-path imports of any `@unsupervised/*` workspace package — callers
//        must go through the package root, never reach into internals.
//        The lone exception is `@unsupervised/config`, whose `package.json#exports`
//        intentionally publishes preset paths (eslint, tsconfig, vitest)
//        that consumers reference by sub-path from THEIR config files.
//
//     2. (Layered in `eslint.headless.js`, not here): a renderer / React
//        ban for the strict-headless layer. Adding it to base would
//        forbid those imports from the renderers themselves — wrong
//        target.
//
//   The patterns are exported (not just inlined) so the headless preset
//   can re-include the sub-path pattern when it overrides this rule —
//   ESLint flat config does NOT merge `no-restricted-imports` patterns
//   across config blocks; the most specific declaration wins entirely.
//   Sharing the pattern object keeps both presets in sync without
//   redeclaration drift.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/**
 * Sub-path import ban. Forbids reaching into a workspace package's
 * TypeScript internals while allowing three deliberate exceptions:
 *   1. The package root itself  (the canonical import form).
 *   2. The @unsupervised/config package  (preset paths are sub-path-exported).
 *   3. CSS sub-paths             (published stylesheets, e.g. ui/styles.css).
 *
 * Asset sub-paths (CSS today; images / shaders / GLB plausibly
 * tomorrow) are a separate publishing surface that packages
 * intentionally expose via their `package.json#exports`. Adding new
 * asset extensions to the negation list is the right call — adding
 * TypeScript paths is a smell.
 *
 * Exported so `eslint.headless.js` can reuse this pattern alongside
 * its own renderer-library ban — both must live in the same
 * `no-restricted-imports` rule call, since the rule does not merge.
 */
export const subpathImportPattern = {
  group: [
    '@unsupervised/*/**',
    '!@unsupervised/config/**',
    // CSS imports — both top-level (`@unsupervised/ui/styles.css`) and
    // nested (`@unsupervised/ui/dist/styles.css`). Two patterns because
    // minimatch's `**` is sometimes "one or more" depending on
    // the implementation; both forms are explicit.
    '!@unsupervised/*/*.css',
    '!@unsupervised/*/**/*.css',
    // `@unsupervised/asset-gen` + `@unsupervised/audio-gen` ship runtime-
    // agnostic vendor clients (CivitAI, Meshy, ElevenLabs voice
    // / sfx / stt, Suno) and pure helper modules (audio-gen's
    // take-history operations) as dedicated sub-path exports
    // so workbench's + assets's Tauri webviews can pull them in
    // without bundling the rest of the Node-only orchestration
    // code. The package's exports map enforces these; the lint
    // rule grants the matching exceptions so engine-tooling
    // apps can consume them cleanly.
    '!@unsupervised/asset-gen/civitai',
    '!@unsupervised/asset-gen/meshy',
    '!@unsupervised/asset-gen/takes',
    '!@unsupervised/asset-gen/pure-cache',
    '!@unsupervised/audio-gen/elevenlabs-voice',
    '!@unsupervised/audio-gen/elevenlabs-sfx',
    '!@unsupervised/audio-gen/elevenlabs-stt',
    '!@unsupervised/audio-gen/suno',
    '!@unsupervised/audio-gen/takes',
    '!@unsupervised/audio-gen/judgeCore',
    '!@unsupervised/audio-gen/pure-cache',
    // `@unsupervised/analytics/browser` is the browser-safe entry (beacon +
    // fetch-only Supabase sink; no fs). Pages + browser views import it so
    // a client bundle never pulls in the Node File sink. Same rationale as
    // the vendor clients above.
    '!@unsupervised/analytics/browser',
    // `@unsupervised/workbench-cloud/browser` — same story: the browser-safe surface
    // (seams, Supabase adapters, pure role/invite/PKCE logic; no fs) the Tauri
    // webview imports without pulling in the Node workspace-link store.
    '!@unsupervised/workbench-cloud/browser',
    // `@unsupervised/registry-cloud/browser` — same story: the browser-safe surface
    // (the PackageDirectory seam, InMemory + Supabase catalog adapters, the
    // pure install planner; no fs / child_process / crypto) the workbench
    // Packages pane imports without pulling in the Node publish + npm adapter.
    '!@unsupervised/registry-cloud/browser',
    // `@unsupervised/skills-cloud/browser` — same story: the browser-safe surface (the
    // SkillDirectory seam, InMemory + GitHub + Supabase catalog adapters, the
    // pure install planner + folder-source seam; no fs / crypto) the workbench
    // Skills pane imports without pulling in the Node scanner / fs install.
    '!@unsupervised/skills-cloud/browser',
    // `@unsupervised/asset-store/browser` — the browser-safe surface (the AssetStore
    // seam, InMemory + Supabase adapters, the pure reconcile + hash; no fs) the
    // workbench asset-store status view imports without pulling in the Node
    // FileAssetStore / sync.
    '!@unsupervised/asset-store/browser',
    // `@unsupervised/workspace-gen/browser` — the pure `buildWorkspacePlan` + scaffold
    // generators (no fs) the workbench New Workspace pane imports; it writes the
    // computed files via Tauri fs itself, so the Node writer stays excluded.
    '!@unsupervised/workspace-gen/browser',
  ],
  message:
    'Cross-package imports must use the package root, e.g. ' +
    "`import { x } from '@unsupervised/core'` — never reach into a sub-path " +
    "like `import { x } from '@unsupervised/core/ecs/world'`. If you need " +
    "something that isn't exported, add it to that package's " +
    '`src/index.ts`. Exceptions: `@unsupervised/config` (preset paths), ' +
    '`*.css` (published stylesheets), `@unsupervised/asset-gen/{civitai,meshy,takes,pure-cache}`, ' +
    'and `@unsupervised/audio-gen/{elevenlabs-voice,elevenlabs-sfx,elevenlabs-stt,' +
    'suno,takes,judgeCore,pure-cache}` (runtime-agnostic vendor clients + ' +
    'helper modules) + `@unsupervised/analytics/browser` (the browser-safe beacon ' +
    'entry) are intentionally sub-path-exported.',
};

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  {
    // Aggressive ignore patterns — the linter never crawls build artefacts,
    // vendored output, or raw JS (we are TS-first).
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Warnings, not errors — keep iterative generation unblocked.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // These hurt more than they help for a codebase under active generation.
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        { 'ts-expect-error': 'allow-with-description' },
      ],

      // Genuine correctness issues — keep as errors.
      'no-undef': 'off', // TS handles this; the eslint rule misfires on globals.
      '@typescript-eslint/no-floating-promises': 'off', // requires type-aware linting; enable per-package.

      // Architectural-boundary enforcement. See file header for why.
      'no-restricted-imports': [
        'error',
        {
          patterns: [subpathImportPattern],
        },
      ],
    },
  },

  // Prettier must be last so it can override any stylistic rule a prior preset
  // turned on.
  prettier,
];

export default baseConfig;
