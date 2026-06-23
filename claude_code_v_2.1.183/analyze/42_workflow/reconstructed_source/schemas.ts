/**
 * schemas.ts — Workflow tool input/output Zod schemas + the dispatch error results.
 *
 * Readable-source-level restoration of the v2.1.183 Workflow-tool *contract layer*:
 *   - `workflowInputSchema`  — the strict input the model must pass (script | name | scriptPath,
 *     plus optional args / resumeFromRunId, with a one-of `.refine`).
 *   - `workflowOutputSchema` — the fire-and-forget result the tool returns immediately
 *     (a launched task id, never a `completed` status). In v2.1.183 this gains two new
 *     optional fields: `taskType` and `workflowName` (the 156→183 delta).
 *   - `WorkflowInputError`   — the `Error` subclass `call()` throws on source/parse failure.
 *   - `serverFallbackRetraction` — the canned `{result:false, errorCode:7}` returned by
 *     `validateInput` when the in-flight dispatch was retracted by a server fallback.
 *   - `abortedByServerFallback` — the predicate that detects that retraction on an
 *     `AbortSignal` (signal.aborted && reason === the server-fallback tombstone sentinel).
 *
 * ── Evidence tiers (do not confuse them) ──────────────────────────────────────────────
 *
 * PRIMARY (truth — every line below was read in this exact bundle):
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *     workflowInputSchema     CLp  @cli_inner_pretty.js:419334-419371
 *     workflowOutputSchema    ILp  @cli_inner_pretty.js:419372-419408
 *     WorkflowInputError      Vjn  @cli_inner_pretty.js:419409-419414
 *     serverFallbackRetraction r5a @cli_inner_pretty.js:419415-419419
 *     abortedByServerFallback zCe  @cli_inner_pretty.js:227026-227028
 *       unwrapAbortReason     uMt  @cli_inner_pretty.js:227020-227022 (DOMException AbortError → .message)
 *       SERVER_FALLBACK_SENTINEL Hqr @cli_inner_pretty.js:227080 = "server-fallback-tombstone"
 *     Helpers / constants re-verified:
 *       lazy memoizer         we   @cli_inner_pretty.js:35809-35812  (() => (cached ??= factory()))
 *       Zod v4 namespace      H    (bundle-inlined zod/v4; H.strictObject/H.object/H.enum/H.string/H.unknown)
 *       WORKFLOW_SCRIPT_MAX_BYTES A2 @cli_inner_pretty.js:152140 = 524288 (512 KiB script cap)
 *       TaskStop tool name    uP   @cli_inner_pretty.js:220834 = "TaskStop"
 *                                  (interpolated into the resumeFromRunId describe text @419367)
 *
 * 2.1.88 CONVENTION MIRROR (shape only — Workflow is stripped behind feature('WORKFLOW_SCRIPTS')):
 *   /lyz/codespace/3rd/claude-code/src/entrypoints/sdk/coreSchemas.ts
 *     — `import { z } from 'zod/v4'`; every schema wrapped in `lazySchema(() => z....)` and
 *       exported as a thunk (the readable shape of the bundle's `we(() => H....)`).
 *   /lyz/codespace/3rd/claude-code/src/Tool.ts:95-101
 *     — the canonical `ValidationResult = {result:true} | {result:false; message; errorCode}`
 *       union that `serverFallbackRetraction` satisfies.
 *
 * 2.1.156 SCAFFOLD (readable logic + established names; re-verified line-by-line against 183):
 *   /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/
 *     workflow_tool_definition.md §3 — input schema `Q0_`, output schema `g0_`, the `.refine`
 *     one-of rule, and the field-by-field describe() rationale.
 *
 * ── Cross-validation note ─────────────────────────────────────────────────────────────
 *   Re-read every assigned 183 region and confirmed each anchor literally contains the claimed
 *   code. The input schema's 7 fields + `...!1` dead-spread + `.refine` message are byte-identical
 *   to v2.1.156 `Q0_` — only obf names re-mangled (`Q0_→CLp`, `yH→we`, `y→H`, `jI→A2`). The
 *   `.max(A2)` cap resolves to 524288 (re-verified @152140). The 156→183 OUTPUT delta is exactly
 *   two NEW optional fields — `taskType: enum(["local_workflow","remote_agent"]).optional()`
 *   @419376 and `workflowName: string().optional()` @419381 — plus the `warning` describe text
 *   reworded ("cloud session" phrasing) @419404; their describe() strings are copied verbatim
 *   from source below. `serverFallbackRetraction` (r5a) is NEW in v2.1.183 (no Workflow ancestor)
 *   and carries `errorCode: 7` @419418; it is returned by `validateInput` at the pre-check
 *   (@419442) and a mid-check (@419457), both guarded by `abortedByServerFallback(signal)`. The
 *   abort predicate compares the *unwrapped* reason against the literal "server-fallback-tombstone"
 *   (@227080), NOT a free-standing constant elsewhere. No invented behavior.
 *
 * Mapping (obf → readable), this file:
 *   CLp→workflowInputSchema, ILp→workflowOutputSchema, Vjn→WorkflowInputError,
 *   r5a→serverFallbackRetraction, zCe→abortedByServerFallback, uMt→unwrapAbortReason,
 *   Hqr→SERVER_FALLBACK_SENTINEL, we→memoize, H→z (Zod v4), A2→WORKFLOW_SCRIPT_MAX_BYTES,
 *   uP→TASK_STOP_TOOL_NAME.
 *
 * NOTE: the project symbol index also tracks `zCe` under the alias `isRetractedByServerFallback`
 * (symbol_additions_v2_1_183_workflow.md). This file uses the primer's project-wide name
 * `abortedByServerFallback` (and re-exports the alias) so cross-file references stay consistent.
 */

import { z } from 'zod/v4' // 2.1.88 convention (coreSchemas.ts); bundle-inlined Zod v4 namespace `H`
import { lazySchema } from './lazySchema.js' // readable shape of the bundle memoizer `we` @35809
import type { ValidationResult } from './Tool.js' // {result:true} | {result:false; message; errorCode} @Tool.ts:95
import { WORKFLOW_SCRIPT_MAX_BYTES } from './constants.js' // A2 @152140 = 524288 (512 KiB)
import { TASK_STOP_TOOL_NAME } from './constants.js' // uP @220834 = "TaskStop"

// ──────────────────────────────────────────────────────────────────────────────
// Input schema — `workflowInputSchema` (CLp)
// ──────────────────────────────────────────────────────────────────────────────
//
// strictObject so unknown keys are rejected outright: the payload can be a 512 KiB
// program, and rejecting stray keys early stops the model from inventing fields
// (e.g. `parallelism`, `maxAgents`) the runtime would silently ignore — fail loud.
// A `.refine` then enforces the cross-field "one-of {script, name, scriptPath}"
// invariant that `strictObject` alone cannot express.
//
// Wrapped in `lazySchema` (bundle `we`) so the Zod object is built once on first
// access (via the tool's `get inputSchema()` getter), not at module load.

// 2.1.183: workflowInputSchema = CLp = we(() => H.strictObject({...}).refine(...)) @419334-419371
export const workflowInputSchema = lazySchema(() =>
  z
    .strictObject({
      // @419336-419341 — inline source, capped at WORKFLOW_SCRIPT_MAX_BYTES (A2 = 524288, 512 KiB).
      script: z
        .string()
        .max(WORKFLOW_SCRIPT_MAX_BYTES) // .max(A2) @419337
        .optional()
        .describe(
          'Self-contained workflow script. Must begin with `export const meta = { name, description, phases }` (pure literal, no computed values) followed by the script body using agent()/parallel()/pipeline()/phase().',
        ),
      // @419342-419346 — a built-in or .claude/workflows/ saved workflow, resolved to a script.
      name: z
        .string()
        .optional()
        .describe(
          'Name of a predefined workflow (built-in or from .claude/workflows/). Resolves to a self-contained script.',
        ),
      // @419347-419349 — accepted but ignored; describe steers the model to set it in `meta`.
      description: z
        .string()
        .optional()
        .describe("Ignored — set the workflow description in the script's `meta` block."),
      // @419350 — accepted but ignored; describe steers the model to set it in `meta`.
      title: z
        .string()
        .optional()
        .describe("Ignored — set the workflow title in the script's `meta` block."),
      // @419351-419357 — z.unknown() so any JSON value flows verbatim to the VM global `args`.
      // The describe() warns NOT to JSON-encode arrays/objects (a stringified list breaks
      // `args.filter`/`args.map` inside the script).
      args: z
        .unknown()
        .optional()
        .describe(
          'Optional input value exposed to the script as the global `args`, verbatim. Pass arrays/objects as actual JSON values, NOT as a ' +
            'JSON-encoded string — a stringified list breaks `args.filter`/' +
            '`args.map` in the script. Use for parameterized named workflows (e.g. a research question).',
        ),
      // @419358-419362 — a file on disk; TAKES PRECEDENCE over `script` and `name`. The
      // iterate-in-place handle: each invocation persists its script and returns this path.
      scriptPath: z
        .string()
        .optional()
        .describe(
          'Path to a workflow script file on disk. Every Workflow invocation persists its script under the session directory and returns the path in the tool result. To iterate, edit that file with Write/Edit and re-invoke Workflow with the same `scriptPath` instead of re-sending the full script. Takes precedence over `script` and `name`.',
        ),
      // @419363-419368 — regex-pinned to the minted run-ID format. Resuming replays cached
      // agent() results for unchanged (prompt, opts) and re-runs only edited/new calls.
      // Same-session only. The describe() interpolates the TaskStop tool name (uP @220834)
      // to tell the model to stop the prior run before resuming.
      resumeFromRunId: z
        .string()
        .regex(/^wf_[a-z0-9-]{6,}$/) // @419364
        .optional()
        .describe(
          `Run ID of a prior Workflow invocation to resume from. Completed agent() calls with unchanged (prompt, opts) return their cached results instantly; only edited or new calls re-run. Same-session only. Stop the prior run first (${TASK_STOP_TOOL_NAME}) before resuming.`,
        ),
      // @419369 — `...!1` in the bundle: `...false` spreads nothing (false has no own enumerable
      // keys). Build-time residue of `...(SOME_FLAG && {extraField})` collapsed when the flag is
      // statically false. Preserved as a no-op for fidelity.
      ...(false as unknown as Record<string, never>),
    })
    // @419370 — cross-field one-of guard; strictObject cannot express "at least one of".
    .refine((input) => input.script || input.name || input.scriptPath, {
      message: 'Must provide script, name, or scriptPath',
    }),
)

// ──────────────────────────────────────────────────────────────────────────────
// Output schema — `workflowOutputSchema` (ILp)
// ──────────────────────────────────────────────────────────────────────────────
//
// Fire-and-forget: `status` is only ever `async_launched` (local background run) or
// `remote_launched` (CCR cloud session). There is NO `completed` status — the tool
// returns immediately with a task id and the real result arrives later as a
// <task-notification>. Even a compile failure returns a normal object with `error`
// set (a soft error the model can read and fix), not a thrown exception.
//
// v2.1.183 delta vs v2.1.156 `g0_`: two NEW optional fields — `taskType` @419376 and
// `workflowName` @419381 — and the `warning` describe text reworded @419404.

// 2.1.183: workflowOutputSchema = ILp = we(() => H.object({...})) @419372-419408
export const workflowOutputSchema = lazySchema(() =>
  z.object({
    // @419374 — local background run vs remote CCR cloud session.
    status: z.enum(['async_launched', 'remote_launched']),
    // @419375 — the registered background task handle.
    taskId: z.string(),
    // @419376-419380 — NEW in v2.1.183. Distinguishes the task class so consumers don't
    // have to infer it from `status`/`sessionUrl`. Optional for transcript back-compat.
    taskType: z
      .enum(['local_workflow', 'remote_agent'])
      .optional()
      .describe(
        "TaskType of the registered background task — 'local_workflow' for in-process runs, 'remote_agent' when remote:true dispatches to CCR. Set on all new writes; absent only on transcripts written before this field existed.",
      ),
    // @419381-419385 — NEW in v2.1.183. Echoes meta.name (same value as task_started.workflow_name).
    // Optional for transcript back-compat.
    workflowName: z
      .string()
      .optional()
      .describe(
        'meta.name from the workflow script — same value as task_started.workflow_name. Set on all new writes; absent only on transcripts written before this field existed.',
      ),
    // @419386-419390 — the resume handle for LOCAL runs. Absent for remote_launched (there the
    // CCR session URL is the resume handle) and on pre-field transcripts.
    runId: z
      .string()
      .optional()
      .describe(
        'Local workflow run identifier for resumeFromRunId. Absent for remote_launched (the CCR session URL is the resume handle there) and on transcripts written before this field existed.',
      ),
    // @419391 — meta.description echo (no describe in source).
    summary: z.string().optional(),
    // @419392-419394 — where subagent transcripts land during execution.
    transcriptDir: z
      .string()
      .optional()
      .describe('Directory where subagent transcripts are written during execution'),
    // @419395-419399 — the persisted-script handle for iterate-in-place.
    scriptPath: z
      .string()
      .optional()
      .describe(
        'Path to the persisted workflow script for this invocation. Editable via Write/Edit; pass back as `scriptPath` to re-run without resending the script.',
      ),
    // @419400 — CCR session URL, present only when status is remote_launched.
    sessionUrl: z.string().optional().describe('CCR session URL when status is remote_launched'),
    // @419401-419405 — non-blocking heads-up; describe text reworded in v2.1.183.
    warning: z
      .string()
      .optional()
      .describe(
        'Non-blocking heads-up (e.g. local git state diverges from the pushed branch the cloud session will clone)',
      ),
    // @419406 — set when the up-front syntax check failed (soft error, not a thrown exception).
    error: z.string().optional().describe('Set if syntax check failed'),
  }),
)

/** Statically-inferred input/output types (consumers import these instead of re-deriving). */
export type WorkflowInput = z.infer<ReturnType<typeof workflowInputSchema>>
export type WorkflowOutput = z.infer<ReturnType<typeof workflowOutputSchema>>

// ──────────────────────────────────────────────────────────────────────────────
// Error class — `WorkflowInputError` (Vjn)
// ──────────────────────────────────────────────────────────────────────────────
//
// Thrown by the tool's `call()` when source resolution or meta-parse fails
// (e.g. `throw new WorkflowInputError(...)` / `throw new WorkflowInputError(\`Invalid
// workflow script: ${reason}\`)`). A distinct subclass so the dispatch layer can tell
// an input-shaped failure apart from an arbitrary runtime throw.

// 2.1.183: WorkflowInputError = Vjn @419409-419414
export class WorkflowInputError extends Error {
  constructor(message: string) {
    super(message) // @419411
    this.name = 'WorkflowInputError' // @419412
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Dispatch error result — `serverFallbackRetraction` (r5a)
// ──────────────────────────────────────────────────────────────────────────────
//
// NEW in v2.1.183. The canned ValidationResult returned by `validateInput` when the
// in-flight tool dispatch was retracted by a server-side fallback — in that case the
// input the model sent may have been truncated, so the tool refuses rather than acting
// on a partial 512 KiB script. `validateInput` returns this at a pre-check (@419442) and
// again at a mid-check (@419457), each guarded by `abortedByServerFallback(signal)` below.
// `errorCode: 7` is the dedicated server-fallback failure class.

// 2.1.183: serverFallbackRetraction = r5a @419415-419419
export const serverFallbackRetraction: ValidationResult = {
  result: false, // @419416  (!1)
  message: 'Tool dispatch was retracted by a server fallback; the input may be truncated.', // @419417
  errorCode: 7, // @419418
}

// ──────────────────────────────────────────────────────────────────────────────
// Abort-reason predicates — `abortedByServerFallback` (zCe) + helpers
// ──────────────────────────────────────────────────────────────────────────────
//
// The sentinel placed on an AbortSignal's `reason` when a request is cancelled because
// the server is falling back to a different dispatch path. `unwrapAbortReason` strips the
// DOMException wrapper (a DOMException with name "AbortError" carries the original reason
// as its `.message`), then `abortedByServerFallback` compares the unwrapped reason against
// the literal sentinel. These live in the shared abort module in the bundle and are
// imported by `validateInput`; reconstructed here alongside the result they gate.

// 2.1.183: SERVER_FALLBACK_SENTINEL = Hqr @227080
const SERVER_FALLBACK_SENTINEL = 'server-fallback-tombstone'

// 2.1.183: unwrapAbortReason = uMt @227020-227022
// A DOMException named "AbortError" stores the human reason in `.message`; everything
// else passes through untouched.
function unwrapAbortReason(reason: unknown): unknown {
  return reason instanceof DOMException && reason.name === 'AbortError' ? reason.message : reason // @227021
}

// 2.1.183: abortedByServerFallback = zCe @227026-227028
// (symbol index alias: isRetractedByServerFallback)
export function abortedByServerFallback(signal: AbortSignal): boolean {
  return signal.aborted && unwrapAbortReason(signal.reason) === SERVER_FALLBACK_SENTINEL // @227027
}

/** Symbol-index alias for `abortedByServerFallback` (zCe); see header note. */
export { abortedByServerFallback as isRetractedByServerFallback }
