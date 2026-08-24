import { z } from 'zod';
// CODE GENERATION SPEND — the audit contract.
//
// Art, audio, localization and market-validation each keep an append-only
// `.{pipeline}-gen-log.jsonl` audit log, and `@unsupervised/gen-core`'s unified
// governance sums them into one cross-pipeline ceiling + one propose-approve
// grant. Code generation — the dev-agent and `skill-builder execute` — was the
// ONLY LLM spend surface in the monorepo with none of that:
//
//   - no budget, no lifetime ceiling, no approval grant;
//   - no audit log (the dev-agent's cost was rendered in the panel and then
//     THROWN AWAY — not even persisted to the task);
//   - no cache, so every re-run re-bills from zero.
//
// And it is the surface that spawns Claude CLI subprocesses IN A LOOP across
// N work items × M rounds. `unifiedGovernance.ts`'s own header names the threat
// model it was built for — "a gap an autonomous AI pilot can drive a truck
// through" — and code was sitting in it, billing the user's Claude Code
// subscription, where the spend is least visible.
//
// This is the row those two writers append. Its `ts` / `costUsd` / `source`
// fields match the shape `normalizeAuditRow` already understands, so the
// existing unified reader, the `gen-governance` CLI, and the spend view pick
// code up with no special-casing.
//
// SCOPE NOTE: unlike the content pipelines, code is WORKSPACE-scoped, not
// game-scoped — skill-builder authors packages and the dev-agent may edit
// anything. So the log lives at the workspace root, and the governance policy
// that binds it is the `gen-governance.config.json` at the workspace root.
/** What was billed. Every kind here spawns a Claude CLI subprocess. */
export const CodeSpendKindSchema = z.enum([
    'package-author', // skill-builder: authoring a new package
    'package-extend', // skill-builder: extending an existing package
    'skill-gym', // skill-builder: the game-code A/B pipeline
    'demo', // skill-builder: authoring a dex validator
    'dev-agent', // workbench: a Development-section agent turn
    'bug-fix-plan', // workbench: the self-healing loop's plan step
    'bug-fix-apply', // workbench: the self-healing loop's apply step
    'code-review', // skill-builder: the L3 interpretive code judge (authorship)
    'dev-code-review', // workbench: the pre-PR review assist (dev-task diff)
    'informed-captain', // workbench: the per-(game, org) knowledge-oracle agent
    'articulate', // workbench: the Articulate pillar's spec-authoring volley
    'narrative-studio', // workbench: the conversational narrative editor (live card/scene editing)
    'harness-judge', // assertion-harness: perceptual/agent LLM calls during verification
]);
/** One row of `.code-gen-log.jsonl` at the workspace root. */
export const CodeGenAuditRowSchema = z.object({
    /** ISO timestamp. Named `ts` to match the asset/audio row shape that
     *  `normalizeAuditRow` already reads. */
    ts: z.string(),
    kind: CodeSpendKindSchema,
    /** What it was spent on — a work-item id, bug id, or task id. */
    ref: z.string().default(''),
    /** USD, as reported by the Claude CLI (`total_cost_usd`) or skill-gym's
     *  `cost.json`. The CLI's number is authoritative; we never estimate here. */
    costUsd: z.number().nonnegative(),
    model: z.string().optional(),
    /** Always `fresh` today — code generation has no content-hash cache, so
     *  nothing is ever free. Kept for shape-parity with the other pipelines
     *  (and so a future code cache can mark rows `cache`). */
    source: z.string().default('fresh'),
});
/** The audit log's filename, at the WORKSPACE root. */
export const CODE_GEN_LOG_FILENAME = '.code-gen-log.jsonl';
//# sourceMappingURL=codeGen.js.map