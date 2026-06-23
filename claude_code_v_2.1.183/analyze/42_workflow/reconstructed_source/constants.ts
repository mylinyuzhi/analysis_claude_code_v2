/**
 * Workflow caps & shared constants — readable-source restoration (Claude Code v2.1.183)
 *
 * Subsystem: the canonical home for every numeric cap and shared string constant that bounds a
 * Dynamic-Workflow / `ultracode` run. These values are the *truth* of the resource model: a
 * deterministic JS workflow script can trivially write an unbounded loop, and each `agent()`
 * iteration spends real tokens, so the runtime enforces a hard agent-count ceiling, a per-agent
 * stall watchdog (with a bounded retry budget), a CPU-derived concurrency limit, and a script
 * size cap. Sibling reconstructed modules import these from `./constants.js` rather than
 * re-declaring them, so this file is the single source of truth for the numbers.
 *
 * NOTE on scope: in the v2.1.183 bundle these caps are NOT all co-located — they are split
 * across the workflow-runtime module (the `_Wa`/`X0p`/`AWa`/`rLp`/`gWa` initializer block at
 * @417717-417740, and the `K0p` formula at @416892) and the script-source module (`A2` at
 * @152140). This reconstruction gathers them into one `constants.ts` per the 2.1.88 convention
 * (a tool's numeric/string constants live in a small `constants.ts` beside the tool, e.g.
 * `src/tools/AgentTool/constants.ts`). The *values and behavior* are faithful to those exact
 * 183 lines; only the file grouping is a convention choice.
 *
 * ── Evidence tiers (see _conventions.md) ─────────────────────────────────────────────
 * PRIMARY (truth) — v2.1.183 obfuscated bundle
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *   Regions reconstructed here (every line below was read directly):
 *     - WORKFLOW_REMOTE_DEFAULT      X0p  @417717  (= 50)      semaphore width for the remote executor
 *     - WORKFLOW_AGENT_CAP           _Wa  @417718  (= 1000)    hard ceiling on agent() calls per run
 *     - AGENT_PREVIEW_MAX            AWa  @417722  (= 400)     prompt/result preview truncation length
 *     - WORKFLOW_STALL_MS_DEFAULT    rLp  @417739  (= 180000)  per-agent "no progress" timeout (3 min)
 *     - WORKFLOW_STALL_RETRY         gWa  @417740  (= 5)       per-agent stall-retry ceiling
 *     - WORKFLOW_SCRIPT_MAX_BYTES    A2   @152140  (= 524288)  512 KiB script size cap
 *     - computeWorkflowConcurrency   K0p  @416892-416894       = min(16, max(2, cpus-2))  [defined in runtime.ts]
 *     - WORKFLOW_TOOL_NAME           zk   @221550  ("Workflow")           [defined in toolName.ts]
 *     - CODE_REVIEW_WORKFLOW_NAME    Utt  @221551  ("code-review")        [defined in toolName.ts]
 *     - TASK_STOP_TOOL_NAME          uP   @220834  ("TaskStop")
 *   Usage sites that pin each value's meaning (also read directly):
 *     - _Wa: cap check `if (c < _Wa) return` @416934; cap-error message uses `${_Wa}` @417782
 *     - X0p: `D = nst(X0p, W)` @416966 wraps the REMOTE executor `W` in a width-50 semaphore
 *     - AWa: `t.length > AWa ? t.slice(0, AWa) + "…"` @416899 (resultPreview XGe)
 *     - rLp: `te?.stallMs != null ? Number(te.stallMs) : rLp` @416993 (default stallMs)
 *     - gWa: stall-retry loop `for (let dt = 1; ...; dt <= gWa; dt++)` @417456, label `(${dt}/${gWa})` @417472
 *     - A2 : `readFileBytes(t, A2 + 1)` @152130, `n.byteLength > A2` @152131 (oversize reject)
 *     - K0p: seeded ONCE `Y0p = K0p(hWa.cpus().length)` @417780 (hWa = require("os"))
 *
 * 2.1.88 convention mirror (shape only; feature gated-out there):
 *   /lyz/codespace/3rd/claude-code/src/tools/AgentTool/constants.ts
 *     — exported, documented numeric/string consts beside the tool; comments explain each cap's
 *       rationale. The WorkflowTool's own constants file is stripped behind `feature('WORKFLOW_SCRIPTS')`,
 *       so there is no implementation to copy — only this layout.
 *
 * 2.1.156 baseline scaffold (readable logic + names):
 *   /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/
 *     gate_caps_lifecycle_relations.md — Part 3 "Runtime Resource Caps".
 *     (The 156 obf names — F74/tG_/lG_/dG_ — re-mangled to _Wa/rLp/X0p/K0p in 183; values unchanged.)
 *
 * Cross-validation note (what was re-verified in the 183 bundle, NOT trusted from 156):
 *   Every numeric literal here was read at its exact 183 line: X0p=50 @417717, _Wa=1000 @417718,
 *   AWa=400 @417722, rLp=180000 @417739, gWa=5 @417740, A2=524288 @152140. The concurrency formula
 *   `min(16, max(2, cpus-2))` was re-read at K0p @416892-416894 (and its single seeding at @417780).
 *   The tool name `zk = "Workflow"` was re-read at @221550. Each value's *meaning* was confirmed
 *   from its usage site (listed above), not inferred from the constant name.
 *
 * English only.
 *
 * Module role: this is a LEAF module — it imports no sibling reconstruction file, so both
 * `runtime.ts` and `subagents.ts` can import the caps, the cap message, and the two error
 * classes from here without an import cycle. (The derived `DEFAULT_WORKFLOW_CONCURRENCY` —
 * which needs the `computeWorkflowConcurrency` formula — lives in `runtime.ts`, where the
 * source seeds it once as `Y0p` @417780, so this file stays dependency-free.)
 */

// ─────────────────────────────────────────────────────────────────────────────────────
// Agent-count cap
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Hard ceiling on the total number of `agent()` calls a single workflow run may issue.
 *
 * Checked at the top of every `agent()` invocation: `if (agentCount < WORKFLOW_AGENT_CAP) return`
 * (@416934). When `agentCount` reaches the cap the run throws `WorkflowAgentCapError` (`bWa`, whose
 * `this.name = "WorkflowAgentCapError"` @417788), after emitting the `tengu_workflow_agent_cap_exceeded`
 * telemetry event (@416935). Its message (`J0p`) is built from this same constant (@417782): *"Workflow agent() call cap reached (1000).
 * This usually means a loop using budget.remaining() never terminates because no token budget was
 * set — remaining() returns Infinity when budget.total is null."* So the cap is a failure-mode
 * guard for the common `while (budget.remaining() > 0)` infinite loop when no budget was supplied.
 */
// 2.1.183: WORKFLOW_AGENT_CAP = _Wa @417718
export const WORKFLOW_AGENT_CAP = 1000

/**
 * Message shown when a workflow run hits {@link WORKFLOW_AGENT_CAP}. The diagnosis is baked
 * into the message because the overwhelmingly common cause is an unbounded `budget.remaining()`
 * loop (remaining() is `Infinity` when `budget.total` is null).
 */
// 2.1.183: WORKFLOW_AGENT_CAP_MESSAGE = J0p @417781
export const WORKFLOW_AGENT_CAP_MESSAGE =
  `Workflow agent() call cap reached (${WORKFLOW_AGENT_CAP}). This usually means a loop using budget.remaining() never terminates because ` +
  'no token budget was set — remaining() returns Infinity when budget.total is null. ' +
  'Add a hard iteration cap to the loop, or pass a token budget.'

/**
 * Thrown when the per-run `agent()` call count reaches {@link WORKFLOW_AGENT_CAP}. Single home for
 * the class so `runtime.ts` (which throws it from `enforceAgentCap`, S @416933) and any other
 * consumer share one identity. `this.name` matches the obfuscated class verbatim (@417788).
 */
// 2.1.183: WorkflowAgentCapError = bWa @417785   (v2.1.156 Q74)
export class WorkflowAgentCapError extends Error {
  constructor() {
    super(WORKFLOW_AGENT_CAP_MESSAGE)
    this.name = 'WorkflowAgentCapError'        // @417788
  }
}

/**
 * Thrown when cumulative output tokens exceed the run's token budget. In-flight agents are
 * allowed to finish and their results are preserved; only *new* `agent()` calls are stopped.
 * Thrown by `runtime.ts`'s `enforceTokenBudget` (T @416938). `this.name` matches @417796.
 */
// 2.1.183: WorkflowBudgetExceededError = SWa @417791   (v2.1.156 fW8)
export class WorkflowBudgetExceededError extends Error {
  constructor(usedOutputTokens: number, totalOutputTokens: number) {
    super(
      `Workflow token budget exceeded (${usedOutputTokens.toLocaleString()} / ${totalOutputTokens.toLocaleString()} output tokens). Stopping further agent() calls. In-flight agents will complete; their results are preserved.`,
    )
    this.name = 'WorkflowBudgetExceededError'   // @417796
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Per-agent stall watchdog
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Default per-agent "no progress" timeout, in milliseconds (180000 = 3 minutes).
 *
 * Each `agent()` call resolves its watchdog window from `opts.stallMs` if provided, else this
 * default: `te?.stallMs != null ? Number(te.stallMs) : rLp` (@416993). If a single subagent makes
 * no progress within the window it is aborted (and retried — see WORKFLOW_STALL_RETRY); the whole
 * run is not aborted, only the stalled slot is reclaimed.
 */
// 2.1.183: WORKFLOW_STALL_MS_DEFAULT = rLp @417739
export const WORKFLOW_STALL_MS_DEFAULT = 180_000

/**
 * Maximum number of stall retries for a single agent before the run gives up on that agent.
 *
 * The retry loop runs while the agent is still stalled and the attempt counter is `<= WORKFLOW_STALL_RETRY`
 * (`for (let dt = 1; Ue.stalled && !Ct && dt <= gWa; dt++)`, @417456); each retry emits a
 * `workflow_log` line of the form `... retrying (${dt}/${gWa})` (@417472). The same loop also
 * services `user-retry` requests and re-arms the stall window each attempt.
 */
// 2.1.183: WORKFLOW_STALL_RETRY = gWa @417740
export const WORKFLOW_STALL_RETRY = 5

// ─────────────────────────────────────────────────────────────────────────────────────
// Remote-executor concurrency  (remote isolation is disabled in this build)
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Semaphore width for the REMOTE agent executor — `agent({ isolation: 'remote' })`.
 *
 * Wires up as `D = nst(X0p, W)` (@416966), where `nst` is the FIFO concurrency limiter and `W` is
 * the remote executor closure. In this build the remote isolation path throws as unavailable before
 * the `D`/`W` semaphore is ever exercised, so this width has no observable runtime effect here — it
 * is the configured-but-dormant remote knob, NOT a `pipeline()`/`parallel()` tuning value. The
 * effective parallelism for all local fan-out is `computeWorkflowConcurrency` below.
 */
// 2.1.183: WORKFLOW_REMOTE_DEFAULT = X0p @417717
export const WORKFLOW_REMOTE_DEFAULT = 50

// NOTE: the derived default LOCAL-executor concurrency, `DEFAULT_WORKFLOW_CONCURRENCY`
// (= `computeWorkflowConcurrency(os.cpus().length)`, the source's `Y0p` seeded once @417780),
// lives in `runtime.ts` together with the `computeWorkflowConcurrency` formula it depends on
// (`K0p` @416892). It is intentionally NOT here so this constants module stays a dependency-free
// leaf. Import `DEFAULT_WORKFLOW_CONCURRENCY` / `computeWorkflowConcurrency` from `./runtime.js`.

// ─────────────────────────────────────────────────────────────────────────────────────
// Progress-UI preview truncation
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Maximum number of characters kept when previewing an agent prompt/result in the progress UI.
 *
 * The preview helper (`resultPreview`, `XGe` @416895-416900) trims the value and, if still longer
 * than this cap, slices to this length and appends an ellipsis: `t.length > AWa ? t.slice(0, AWa) + "…"`
 * (@416899). Used for the `resultPreview` field in `workflow_agent` progress events, including the
 * cached-replay event, so the progress tree stays legible and bounded.
 */
// 2.1.183: AGENT_PREVIEW_MAX = AWa @417722
export const AGENT_PREVIEW_MAX = 400

// ─────────────────────────────────────────────────────────────────────────────────────
// Script size cap
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Hard size cap (in bytes) on a workflow script — inline, named, or read from a `scriptPath`
 * file. 524288 = 512 KiB. The inline `script` field also restates this as a Zod `.max(...)`
 * (see schemas.ts); this constant additionally bounds the disk read so a `scriptPath` pointing
 * at a huge file cannot exhaust memory: the loader reads at most `A2 + 1` bytes
 * (`readFileBytes(t, A2 + 1)` @152130) and rejects when `byteLength > A2` (@152131).
 */
// 2.1.183: WORKFLOW_SCRIPT_MAX_BYTES = A2 @152140
export const WORKFLOW_SCRIPT_MAX_BYTES = 524288

// ─────────────────────────────────────────────────────────────────────────────────────
// Shared tool-name constants
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Wire name of the TaskStop tool, used by the Monitor/background-task surface and referenced by
 * the workflow input/output schemas (schemas.ts imports this). Re-exported here as a shared
 * cross-module constant.
 */
// 2.1.183: TASK_STOP_TOOL_NAME = uP @220834
export const TASK_STOP_TOOL_NAME = 'TaskStop'
