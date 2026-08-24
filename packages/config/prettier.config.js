// Shared Prettier config. Re-exports .prettierrc.json so consumers can wire it
// up via package.json: "prettier": "@unsupervised/config/prettier".
//
// A single source of formatting truth is critical for an AI-first workflow:
// without it, every generation round-trip can silently rewrite whitespace and
// produce noisy diffs that obscure real changes.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(join(__dirname, '.prettierrc.json'), 'utf8'),
);

export default config;
