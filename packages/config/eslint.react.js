// React preset. Import this ONLY from packages that actually render to the
// DOM (ui, renderer, game-client, Next.js apps). The plugins below hard-depend
// on React being installed in the consumer, which is why we isolate them from
// the base preset.
//
// Usage in a consumer's eslint.config.js:
//
//   import reactConfig from '@unsupervised/config/eslint/react';
//   export default [...reactConfig];

import { baseConfig } from './eslint.base.js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export const reactConfig = [
  ...baseConfig,

  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // New JSX transform — no need to import React in every file.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // TypeScript owns prop validation.
    },
  },
];

export default reactConfig;
