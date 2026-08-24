// Headless-layer ESLint preset.
//
// Apply to packages that must NOT depend on rendering libraries or
// React. Per ARCHITECTURE_AUDIT.md §1, the strict-headless layer is:
//
//   - @unsupervised/core      — Miniplex ECS, XState machines, SceneManager.
//   - @unsupervised/schemas   — Zod schemas. Pure data definitions.
//   - @unsupervised/engine-2d — Rapier2D + ECS systems. Browser-bundled, but
//                       must not import Pixi or React directly.
//   - @unsupervised/engine-3d — Rapier3D + ECS systems. Browser-bundled, but
//                       must not import Three or @react-three/* or
//                       React directly.
//
// Why enforce by lint and not just by docstring:
//   The audit's headless invariant ("no rendering deps in @unsupervised/core")
//   was previously a convention. A single mistaken `import { Vector3 }
//   from 'three'` in a system file would compile and only surface as
//   a bundle-bloat / circular-dep problem downstream. Lint makes the
//   layer boundary unrepresentable in the source tree.
//
// What's banned:
//   Three.js (and its three/* paths), Pixi (pixi.js + @pixi/*),
//   React + ReactDOM, @react-three/* (R3F + drei + postprocessing),
//   recast-navigation. These are the libraries that constitute the
//   rendering / React layer above headless.
//
// What's allowed:
//   Everything else, including @dimforge/rapier{2,3}d-compat (physics
//   is part of the engine, not the renderer), miniplex (ECS),
//   xstate (state), zod (schemas), and any other pure JS lib.
//   `globalThis` casts are allowed at runtime so the engines can
//   reach for `requestAnimationFrame` from inside their boot helper
//   without widening the package's TypeScript lib config.
//
// Why this is layered ON TOP of base, not woven into it:
//   `no-restricted-imports` does NOT merge across ESLint flat-config
//   blocks — the most specific declaration wins entirely. So a single
//   file using both the base ban (sub-paths) and the headless ban
//   (renderer libs) needs both pattern groups in the SAME rule call.
//   We solve that by importing the base sub-path pattern and listing
//   it alongside the headless-specific patterns here.

import { baseConfig, subpathImportPattern } from './eslint.base.js';

/**
 * Renderer / React import ban. Lives in this file because it only
 * applies to the strict-headless layer; renderers themselves are the
 * intended consumers of these libraries.
 */
const headlessRendererBanPattern = {
  group: [
    // Three.js
    'three',
    'three/**',
    // R3F + sibling React-Three packages
    '@react-three/**',
    // Pixi
    'pixi.js',
    'pixi.js/**',
    '@pixi/**',
    // React itself (engines must not depend on React rendering)
    'react',
    'react/**',
    'react-dom',
    'react-dom/**',
    // Recast navigation lives in @unsupervised/ai, not in core/engines
    'recast-navigation',
    'recast-navigation/**',
    // postprocessing — paired with @react-three/postprocessing
    'postprocessing',
    'postprocessing/**',
  ],
  message:
    'This package is in the HEADLESS layer (core / schemas / ' +
    'engine-2d / engine-3d). It must not import rendering or React ' +
    'libraries — those belong in `@unsupervised/renderer-2d`, `@unsupervised/renderer-3d`, ' +
    '`@unsupervised/ui`, `@unsupervised/vfx`, or app code. If a thin usage (a Vector3 ' +
    'type, a single React hook) seems unavoidable, the right fix is ' +
    'almost always to move the surrounding logic OUT of the headless ' +
    'package — not to add the dependency. See ARCHITECTURE_AUDIT.md §1.',
};

/** @type {import('eslint').Linter.Config[]} */
export const headlessConfig = [
  ...baseConfig,
  {
    rules: {
      // Re-declares the rule to merge BOTH pattern groups in one call.
      // The base preset's declaration of this rule (with only the
      // sub-path pattern) is fully overridden here.
      'no-restricted-imports': [
        'error',
        {
          patterns: [subpathImportPattern, headlessRendererBanPattern],
        },
      ],
    },
  },
];

export default headlessConfig;
