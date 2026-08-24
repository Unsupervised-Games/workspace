// Tiny ANSI-color console helpers for the `schema-gen` CLI.
//
// Inlined here on purpose — `chalk`-style libraries would add a
// multi-MB dependency for what amounts to a handful of escape codes.
// Output is short, structured, and easy to read in a terminal.

const ESC = '';
const RESET = `${ESC}[0m`;
const DIM = `${ESC}[2m`;
const CYAN = `${ESC}[36m`;
const GREEN = `${ESC}[32m`;
const YELLOW = `${ESC}[33m`;
const RED = `${ESC}[31m`;

const PREFIX = `${CYAN}[schema-gen]${RESET}`;

export function info(message: string): void {
  console.log(`${PREFIX} ${message}`);
}

export function success(message: string): void {
  console.log(`${PREFIX} ${GREEN}${message}${RESET}`);
}

export function warn(message: string): void {
  console.warn(`${PREFIX} ${YELLOW}${message}${RESET}`);
}

export function error(message: string): void {
  console.error(`${PREFIX} ${RED}${message}${RESET}`);
}

export function dim(message: string): void {
  console.log(`${PREFIX} ${DIM}${message}${RESET}`);
}
