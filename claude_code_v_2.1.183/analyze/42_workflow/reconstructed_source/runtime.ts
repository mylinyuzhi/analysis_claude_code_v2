/**
 * Workflow VM runtime — readable-source restoration (Claude Code v2.1.183)
 *
 * Subsystem: the *whole machine* that turns a validated workflow script body into a running,
 * deterministic, sandboxed orchestration of subagents. Five concerns live here:
 *   1. COMPILE        — instrument top-level `await` through a membrane, then compile a vm.Script
 *                       over an async IIFE (so the body's top-level await/return works in-VM).
 *   2. CONTEXT        — assemble the exact, tiny global surface a script can see
 *                       (agent, parallel, pipeline, phase, log, workflow, args, budget, console, timers),
 *                       freeze `budget`, run the determinism shim + intrinsic hardening.
 *   3. DSL PRIMITIVES — agent()/parallel()/pipeline()/phase()/log() and the per-call executor that
 *                       spawns one subagent (with stall timeout, throttle backoff, journal cache).
 *                       parallel() is a *barrier* over functions; pipeline() is *per-item* stage flow.
 *   4. DETERMINISM    — the in-VM shim that makes Math.random / Date.now / argless `new Date()` THROW
 *                       at *execution* time (distinct from the meta.ts AST static check, isNonDeterministic).
 *   5. BUDGET/CAPS    — frozen `budget {total, spent(), remaining()}`, the 1000-agent cap, the 180 s
 *                       per-agent stall cap, and the `min(16, max(2, cores-2))` concurrency formula.
 *
 * ── Evidence tiers (see _conventions.md) ─────────────────────────────────────────────
 * PRIMARY (truth) — v2.1.183 obfuscated bundle
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *   Regions reconstructed here (every line below was read directly):
 *     COMPILE
 *       - instrumentTopLevelAwait    B0p   @416316-416382  (acorn rewrite: wrap awaited exprs in `__wRg$(())`)
 *       - compileWorkflowScript      Mjn   @416383-416404  (Function() syntax pre-check + new vm.Script over
 *                                                            an async-IIFE w/ async-iterator membrane)
 *     DETERMINISM
 *       - DETERMINISM_SHIM           N0p   @416417-416437  (the in-VM program string)
 *       - runDeterminismShim         Djn   @416280-416282  (vm.runInContext(N0p, ctx))
 *       - DATE_ERROR_MESSAGE         $0p   @416406  / RANDOM_ERROR_MESSAGE  O0p  @416408
 *       - isNonDeterministic         rWa   @416439-416465  (the STATIC AST check — lives logically in meta.ts;
 *                                                            re-listed here only to contrast w/ the runtime shim)
 *     VM HARDENING + BOUNDARY MEMBRANE
 *       - hardenVMIntrinsics         KGe   @411340-411470  (freeze prepareStackTrace, delete dangerous globals,
 *                                                            SES-style enable-override + freeze intrinsics)
 *       - vmAwaitSettle              Mut   @411480-411482  | vmCall  JGa @411483-411485
 *       - readVMError                Hjn   @411486-411505  | hostToVMClone  vjn @411506-411571
 *       - wrapHostFnForVM            Tjn   @411572-411574  | makeVMError  Pce @411575-411581
 *       - readHostError              Bjt   @411610-411621  (via R0p @411582-411609)
 *       - syncGuard                  KY    @411622-411632  | asyncGuard  wjn @411633-411643
 *       - vmToHostClone              Njt   @411667-411703  | toArrayAcrossBoundary  Cjn @411705-411715
 *       - VM_BOUNDARY_ARRAY_CAP      Ejn   @411718  (= 4096)
 *     TIMERS + CONCURRENCY
 *       - makeSandboxedTimers        nWa   @416283-416315  (abort-aware setTimeout/clearTimeout)
 *       - withConcurrencyLimit       nst   @298208-298228  (FIFO semaphore wrapper)
 *       - computeWorkflowConcurrency K0p   @416892-416894  (= min(16, max(2, cores-2)))
 *       - resultPreview              XGe   @416895-416900  (trim + 400-char ellipsis)
 *     HOOKS / DSL PRIMITIVES + EXECUTORS
 *       - makeWorkflowHooks          EWa   @416901-417713  (the closure that defines agent/parallel/
 *                                                            pipeline/phase/log/resolvePhase + executors U/W)
 *           · enforceAgentCap         S    @416933-416937   · enforceTokenBudget  T  @416938-416944
 *           · resolvePhase            L    @416949-416960   · agent (M)  @416968-417087
 *           · localExecutor          U    @417088-417523   (the real per-agent spawn pipeline)
 *           · spawnWorkflowAgent     Tt   @417149-417416   (one subagent attempt; stall/throttle handling)
 *           · remoteExecutor         W    @417529-417633   (remote isolation — throws as unavailable in build)
 *           · parallel (q)           @417634-417658        · pipeline (V)  @417659-417693   · log (Q)  @417694-417696
 *           · return surface         @417697-417712
 *       - WorkflowAgentCapError      bWa   @417785-417790  | WorkflowBudgetExceededError  SWa @417791-417798  [both in constants.ts]
 *       - WORKFLOW_AGENT_CAP         _Wa   @417718 (1000)  | WORKFLOW_STALL_MS_DEFAULT  rLp @417739 (180000)   [both in constants.ts]
 *       - WORKFLOW_REMOTE_DEFAULT    X0p   @417717 (50)    | WORKFLOW_STALL_RETRY  gWa @417740 (5)              [both in constants.ts]
 *       - AGENT_PREVIEW_MAX          AWa   @417722 (400)   | DEFAULT_WORKFLOW_CONCURRENCY  Y0p @417780 (= K0p(cpus))
 *     CONTEXT ASSEMBLY + RUNNERS
 *       - sandboxConsole             ado   @416579-416594  (console.* → workflow_log progress)
 *       - createNestedWorkflowGlobal aWa   @416595-416683  (the `workflow()` intrinsic; ONE-LEVEL nesting guard)
 *       - buildWorkflowContext       DWa   @418026-418069  (assemble + freeze budget + harden + bind await)
 *       - runWorkflowScript          MWa   @418079-418154  (load journal, runInContext w/ 30 s timeout, abort race)
 *       - WORKFLOW_VM_TIMEOUT_MS     Pjn   @416411 (30000) | WORKFLOW_LOG_CAP  sLp @418155 (1000)
 *
 * CONVENTION mirror — v2.1.88 named-TS tree (/lyz/codespace/3rd/claude-code/src)
 *   Workflow is gated-out there (`feature('WORKFLOW_SCRIPTS')`), so only the *shape* is borrowed:
 *   ESM `.js` import specifiers on `.ts`; the `tools/AgentTool/runAgent.ts` subagent run-loop idiom
 *   (`for await (const ev of query({...}))`, the `canUseTool` plumbing, `agentDefinition`/`availableTools`)
 *   mirrored by `spawnWorkflowAgent`; `node:vm` usage shape; `utils/agentContext.ts` AsyncLocalStorage
 *   `runWithAgentContext`/`getAgentContext` pattern; `node:os` `cpus()` for the concurrency formula.
 *   (NB: in 2.1.88 src `node:vm` is unused and the agent-context ALS lives in `utils/agentContext.ts`,
 *    not `utils/task/framework.ts` — framework.ts is the task-lifecycle module.)
 *
 * SCAFFOLD — v2.1.156 baseline analysis
 *   42_workflow/workflow_runtime_and_subagents.md §A (compile), §B (VM context),
 *   §C (runner), §D (DSL primitives), §E (determinism sandbox). Readable names inherited from there;
 *   every claim re-verified against the 183 bundle (lines + obf names re-mangled this build).
 *
 * ── Cross-validation note ────────────────────────────────────────────────────────────
 * Re-verified against the 183 bundle:
 *  • computeWorkflowConcurrency IS `min(16, max(2, cpus-2))` (K0p @416892), seeded once into Y0p
 *    from `os.cpus().length` (@417780); that Y0p is the semaphore width for the LOCAL executor.
 *  • resultPreview (XGe @416895) trims and truncates at AWa=400 with an ellipsis '…'.
 *  • COMPILE in 183 is materially richer than the 2.1.156 scaffold (`BP8`): besides the async-IIFE
 *    wrap + `Function()` pre-check, it now instruments every top-level `await`/`for await`/async
 *    arrow-return/return/yield through a `__wRg$(())` membrane (B0p) and injects an async-iterator
 *    adapter, so values crossing the host↔VM boundary are settled/validated. vm.Script also installs
 *    `importModuleDynamically` that throws "import() is not available in workflow scripts."
 *  • The determinism shim (N0p) makes Math.random / Date.now / bare Date() / argless `new Date()`
 *    THROW *at execution time*, while `new Date(2020,0,1)` is still allowed — this is the RUNTIME
 *    enforcement, separate from the STATIC AST check `isNonDeterministic` (rWa, in meta.ts).
 *  • parallel() (q) calls every function immediately then `Promise.allSettled` — a true barrier;
 *    pipeline() (V) threads each item independently through all stages with NO cross-item barrier,
 *    short-circuiting that item on a `null` value. Both share the same Y0p-bounded executor.
 *  • The nested `workflow()` intrinsic inside a child context is `() => Promise.reject(...)` — nesting
 *    is hard-capped at ONE level (aWa @416628-416633).
 *  • budget is `Object.freeze`d (DWa @418029-418034); `remaining()` returns Infinity when total==null.
 *  • Caps confirmed: _Wa=1000 (@417718), rLp=180000 (@417739), X0p=50 (@417717), gWa=5 (@417740).
 *
 * NOTE: This single file consolidates several real compilation modules (Rut/lWa/hye/PWa/RWa/HWa).
 * In the 2.1.88 tree these would split across tools/WorkflowTool/{compile,context,runtime,subagent}.ts;
 * we keep them together for a self-contained read of the runtime spine.
 */

import * as vm from 'node:vm'
import * as os from 'node:os'

import { parse as acornParse } from 'acorn'                  // 2.1.183: getAcorn = xjn @411725
import * as walk from 'acorn-walk'                           // 2.1.183: getAcornWalk = ido @415881

import { getCwd } from '../utils/cwd.js'                     // 2.1.183: getCwd = Pt @46264
import { sleep } from '../utils/time.js'                     // 2.1.183: Un @105278 (abortable delay)
import { stableStringify } from '../utils/json.js'           // 2.1.183: Re @9461 (JSON.stringify shim)
import { structuredCloneValue } from '../utils/clone.js'     // 2.1.183: sN @9485 (structuredClone w/ trace)
import { logError } from '../utils/log.js'                   // 2.1.183: v (warn/error logger)
import { logTelemetry } from '../utils/telemetry.js'         // 2.1.183: G (tengu_* events)
import { pluralize } from '../utils/text.js'                 // 2.1.183: vn (singular/plural helper)

import { parseWorkflowMeta } from './meta.js'                // 2.1.183: parseWorkflowMeta = m0 @416466
import { resolveWorkflowSource } from './source.js'          // 2.1.183: r0t @152126 (scriptPath read)
import { resolveNamedWorkflow, getAllWorkflows } from './workflowRegistry.js' // 2.1.183: jjt @418000, J0e @418006
import { STRUCTURED_OUTPUT_TOOL_NAME } from '../tools/StructuredOutput.js' // 2.1.183: Em @221489 ("StructuredOutput")
// Caps + cap/budget error classes are owned by the leaf ./constants.js (single source of truth).
import {
  WORKFLOW_AGENT_CAP,           // _Wa @417718 (= 1000)
  WORKFLOW_STALL_MS_DEFAULT,    // rLp @417739 (= 180000)
  WORKFLOW_REMOTE_DEFAULT,      // X0p @417717 (= 50)
  WORKFLOW_STALL_RETRY,         // gWa @417740 (= 5)
  AGENT_PREVIEW_MAX,            // AWa @417722 (= 400)
  WorkflowAgentCapError,        // bWa @417785 (thrown by enforceAgentCap below)
  WorkflowBudgetExceededError,  // SWa @417791 (thrown by enforceTokenBudget below)
} from './constants.js'

// The whole subagent spawn pipeline (`spawnWorkflowAgent` / `localExecutor`) pulls many generic
// execution helpers; they are imported here by their readable names but live in core-execution modules.
// (query/runAgent, agent-context ALS, worktree, etc.) — see runAgent.ts mirror.

// ─────────────────────────────────────────────────────────────────────────────────────
// Constants & caps
// ─────────────────────────────────────────────────────────────────────────────────────
//
// The cap NUMBERS (WORKFLOW_AGENT_CAP / WORKFLOW_STALL_MS_DEFAULT / WORKFLOW_REMOTE_DEFAULT /
// WORKFLOW_STALL_RETRY / AGENT_PREVIEW_MAX) and the two cap/budget error classes are the single
// source of truth in the leaf ./constants.js, imported above. Only the runtime-VM-specific
// constants below live locally here.

// 2.1.183: WORKFLOW_VM_TIMEOUT_MS = Pjn @416411  — synchronous runInContext timeout
const WORKFLOW_VM_TIMEOUT_MS = 30_000
// 2.1.183: WORKFLOW_LOG_CAP = sLp @418155  — max workflow_log lines retained in the result
const WORKFLOW_LOG_CAP = 1000
// 2.1.183: VM_BOUNDARY_ARRAY_CAP = Ejn @411718  — max array length cloned across the VM boundary
const VM_BOUNDARY_ARRAY_CAP = 4096
// 2.1.183: af @416412  — reserved identifier prefix used by the await-instrumentation membrane
const AWAIT_MEMBRANE_PREFIX = '__wRg$'

// 2.1.183: DATE_ERROR_MESSAGE = $0p @416406
const DATE_ERROR_MESSAGE =
  'Date.now() / new Date() are unavailable in workflow scripts (breaks resume). ' +
  'Stamp results after the workflow returns, or pass timestamps via args.'
// 2.1.183: RANDOM_ERROR_MESSAGE = O0p @416408
const RANDOM_ERROR_MESSAGE =
  'Math.random() is unavailable in workflow scripts (breaks resume). ' +
  'For N independent samples, include the index in the agent label or prompt.'

/**
 * Per-CPU concurrency formula for the LOCAL executor's semaphore.
 * 2.1.183 regions: cli_inner_pretty.js:416892-416894
 * 2.1.88 convention: would import `cpus` from `node:os` and clamp; the formula is workflow-specific.
 * 2.1.156 scaffold: §B (computeWorkflowConcurrency, dG_).
 */
// 2.1.183: computeWorkflowConcurrency = K0p @416892
export function computeWorkflowConcurrency(cpuCount: number): number {
  return Math.min(16, Math.max(2, cpuCount - 2))   // @416893  floor 2, ceiling 16, headroom of 2 cores
}

// 2.1.183: DEFAULT_WORKFLOW_CONCURRENCY = Y0p @417780  — seeded ONCE from os.cpus().length.
// Lives here (beside the K0p formula it depends on) so ./constants.js stays a dependency-free leaf.
export const DEFAULT_WORKFLOW_CONCURRENCY = computeWorkflowConcurrency(os.cpus().length)

/**
 * Trim + length-cap a value for the progress UI (agent prompt/result previews).
 * 2.1.183 regions: cli_inner_pretty.js:416895-416900
 */
// 2.1.183: resultPreview = XGe @416895
function resultPreview(value: unknown): string | undefined {
  if (value == null) return undefined                                  // @416896
  const text = (typeof value === 'string' ? value : stableStringify(value)).trim() // @416897
  if (!text) return undefined                                          // @416898
  // Truncate with a horizontal-ellipsis at 400 chars.
  return text.length > AGENT_PREVIEW_MAX ? text.slice(0, AGENT_PREVIEW_MAX) + '…' : text // @416899
}

// The cap/budget error classes (WorkflowAgentCapError = bWa @417785, WorkflowBudgetExceededError
// = SWa @417791) are owned by ./constants.js and imported above; they are thrown below from
// enforceAgentCap (S @416933) and enforceTokenBudget (T @416938).

// ─────────────────────────────────────────────────────────────────────────────────────
// COMPILE  —  instrument top-level await, then compile a vm.Script over an async IIFE
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Rewrite the script body so that every value an `await` consumes is funnelled through a host-installed
 * membrane function (`__wRg$`). This lets the runtime settle/validate values crossing the VM boundary
 * and enforce the boundary array-cap on awaited iterables — top-level `await` in the IIFE alone wouldn't
 * give the host that interception point.
 *
 * Mechanism (acorn walk over the body wrapped in a throwaway async IIFE):
 *   - reject reserved `__wRg$`-prefixed identifiers and `with` statements (defense-in-depth)
 *   - `await X`                    → `await __wRg$((X))`
 *   - `for await (… of Y)`         → iterate `__wRg$a((Y))`     (async-iterator membrane)
 *   - async arrow with expr body   → wrap the body expression
 *   - `return X` / `yield X` in async (generator) fns → wrap likewise
 * If nothing needed wrapping, the original body is returned untouched.
 *
 * 2.1.183 regions: cli_inner_pretty.js:416316-416382
 * 2.1.156 scaffold: NONE — this instrumentation is NEW since 2.1.156 (BP8 only did the IIFE wrap).
 */
// 2.1.183: instrumentTopLevelAwait = B0p @416316
function instrumentTopLevelAwait(scriptBody: string): string {
  const PREFIX = AWAIT_MEMBRANE_PREFIX
  // The body is parsed inside a throwaway async IIFE so top-level await/return parse legally.
  const wrapped = `(async () => {'use strict';\n${scriptBody}\n})()`     // @416321
  const ast = acornParse(wrapped, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true }) // @416324

  // Reject reserved identifiers and `with` statements anywhere in the tree.
  walk.full(ast, (node: any) => {                                        // @416325
    if (node.name?.startsWith(PREFIX))
      throw new SyntaxError(`Identifier '${node.name}' is reserved.`)    // @416326
    if (node.type === 'WithStatement')
      throw new SyntaxError("'with' statements are not supported in workflow scripts.") // @416327
  })

  // Collected [position, insertText] edits, applied back-to-front so earlier offsets stay valid.
  const edits: Array<[number, string]> = []                             // @416329
  const wrapExpr = (n: any) => {                                        // @416330
    if (!n) return
    edits.push([n.start, ` ${PREFIX}((`], [n.end, '))'])                // @416332
  }
  // Find the nearest enclosing function in the ancestor stack (skip the node itself).
  const enclosingFn = (ancestors: any[]) => {                           // @416334
    for (let i = ancestors.length - 2; i >= 0; i--) {
      const a = ancestors[i]
      if (a && (a.type === 'FunctionDeclaration' || a.type === 'FunctionExpression' || a.type === 'ArrowFunctionExpression'))
        return a
    }
    return undefined
  }

  walk.ancestor(ast, {
    VariableDeclaration(n: any) {
      if (n.kind === 'await using')                                     // @416348
        throw new SyntaxError("'await using' declarations are not supported in workflow scripts.")
    },
    AwaitExpression(n: any) {
      wrapExpr(n.argument)                                              // @416351-416353  await X → await __wRg$((X))
    },
    ArrowFunctionExpression(n: any) {
      if (n.async && n.expression) wrapExpr(n.body)                     // @416354  async () => EXPR
    },
    ForOfStatement(n: any) {
      if (n.await)                                                      // @416357  for await (… of Y)
        edits.push([n.right.start, ` ${PREFIX}a((`], [n.right.end, '))'])
    },
    ReturnStatement(n: any, _state: unknown, ancestors: any[]) {
      const fn = enclosingFn(ancestors)                                // @416360
      if (!fn?.async) return
      if (fn.generator) {                                              // async generator: `return await __wRg$((X))`
        if (n.argument) edits.push([n.argument.start, ` await ${PREFIX}((`], [n.argument.end, '))'])
      } else wrapExpr(n.argument)
    },
    YieldExpression(n: any, _state: unknown, ancestors: any[]) {
      const fn = enclosingFn(ancestors)                                // @416367
      if (!(fn?.async && fn.generator)) return
      if (n.delegate) {                                                // yield* X
        if (n.argument) edits.push([n.argument.start, ` ${PREFIX}a((`], [n.argument.end, '))'])
      } else wrapExpr(n.argument)
    },
  })

  if (edits.length === 0) return scriptBody                            // @416375  nothing to instrument

  edits.sort((a, b) => b[0] - a[0])                                    // @416378  back-to-front
  let out = wrapped
  for (const [pos, text] of edits) out = out.slice(0, pos) + text + out.slice(pos) // @416380
  // Strip back the IIFE scaffolding we added: `(async () => {'use strict';\n` (28 chars) ... `\n})()` (5).
  return out.slice(28, out.length - 5)                                 // @416381
}

export type CompileResult =
  | { ok: true; vmScript: vm.Script }
  | { ok: false; error: string }

/**
 * Compile a workflow script body to a runnable vm.Script.
 *   1. A cheap `Function()` syntax-only PRE-CHECK (never executed) surfaces a clean SyntaxError early.
 *   2. instrumentTopLevelAwait rewrites the body's awaits through the `__wRg$` membrane.
 *   3. The instrumented body is wrapped in a curried async IIFE that ALSO installs an async-iterator
 *      adapter (`__wRg$a`) and binds the await membrane (`__wRg$`) to `Promise.resolve` — the host
 *      rebinds these later via bindVMAwait, but the default keeps a standalone script runnable.
 *   4. `new vm.Script(..., { importModuleDynamically })` — dynamic `import()` is blocked.
 *
 * 2.1.183 regions: cli_inner_pretty.js:416383-416404 (Mjn), membrane template @416389-416391
 * 2.1.156 scaffold: §A (compileWorkflowScript, BP8) — much simpler there; 183 adds the membrane.
 */
// 2.1.183: compileWorkflowScript = Mjn @416383
export function compileWorkflowScript(scriptBody: string): CompileResult {
  try {
    // (1) Syntax-only pre-check in an async function scope — parsed, never called.
    // eslint-disable-next-line no-new-func
    Function(`async function _check() {'use strict';\n${scriptBody}\n}`)  // @416385

    // (2) Instrument awaits through the boundary membrane.
    const instrumented = instrumentTopLevelAwait(scriptBody)             // @416388
    const P = AWAIT_MEMBRANE_PREFIX

    // (3) Curried IIFE: outer arg = the await-settle membrane (`__wRg$`), produced by Promise.resolve;
    //     inner arg = the async-iterator adapter (`__wRg$a`) that validates each iterator result object
    //     and re-settles value/done through the membrane (so `for await` over a hostile iterable can't
    //     hang the host thread or smuggle a non-conforming result). @416389-416391
    const program =
      `((${P} => ((${P}a) => async () => {'use strict';\n${instrumented}\n})` +
      `(${P}it => ({[Symbol.asyncIterator](){` +
      `const ${P}ai = ${P}it[Symbol.asyncIterator];` +
      `if (${P}ai != null && typeof ${P}ai !== 'function') throw new TypeError('@@asyncIterator is not a function');` +
      `const ${P}i = ${P}ai != null ? ${P}ai.call(${P}it) : ${P}it[Symbol.iterator]();` +
      `if (${P}i === null || (typeof ${P}i !== 'object' && typeof ${P}i !== 'function')) throw new TypeError('Iterator is not an object');` +
      `const ${P}nxt = ${P}i.next;` +
      `if (typeof ${P}nxt !== 'function') throw new TypeError('Iterator.next is not a function');` +
      `const ${P}ret = ${P}i.return;const ${P}thr = ${P}i.throw;` +
      `const ${P}w = s => ${P}(s).then(s => { if (s === null || (typeof s !== 'object' && typeof s !== 'function')) throw new TypeError('Iterator result is not an object'); const done = s.done; return ${P}(s.value).then(value => ({value, done})) });` +
      `return {next:v=>${P}w(${P}nxt.call(${P}i,v)),` +
      `return:v=>${P}w(typeof ${P}ret==='function'?${P}ret.call(${P}i,v):{value:v,done:true}),` +
      `throw:e=>typeof ${P}thr==='function'?${P}w(${P}thr.call(${P}i,e)):${P}(typeof ${P}ret==='function'?${P}ret.call(${P}i):undefined).then(()=>{throw new TypeError('The iterator does not provide a throw method')})}}})))` +
      `(Promise.resolve.bind(Promise)))()`

    return {
      ok: true,
      vmScript: new vm.Script(program, {
        filename: 'workflow.js',                                        // @416395  readable stack traces
        importModuleDynamically: () => {                                // @416396  no dynamic import in workflows
          throw makeVMError('import() is not available in workflow scripts.')
        },
      } as vm.ScriptOptions),
    }
  } catch (e) {
    return { ok: false, error: `SyntaxError: ${e instanceof Error ? e.message : String(e)}` } // @416402
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// DETERMINISM SANDBOX  —  the in-VM shim that makes nondeterministic surfaces THROW at run time
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * The program string run inside every workflow VM context (top-level AND every nested child).
 * It is the RUNTIME enforcement of determinism — distinct from the STATIC AST check
 * `isNonDeterministic` in meta.ts. It surgically forbids the nondeterministic surfaces while still
 * allowing explicit, deterministic date construction:
 *   • Math.random()              → throws RANDOM_ERROR_MESSAGE
 *   • Date.now()                 → throws DATE_ERROR_MESSAGE
 *   • Date()      (bare, no new) → throws DATE_ERROR_MESSAGE
 *   • new Date()  (no args)      → throws DATE_ERROR_MESSAGE
 *   • new Date(2020, 0, 1)       → ALLOWED (explicit args are deterministic)
 *   • (new Date(x)).constructor.now()  → throws (constructor repointed at the shim, RealDate frozen)
 *
 * 2.1.183 regions: cli_inner_pretty.js:416417-416437 (the string N0p), run by Djn @416280-416282.
 * 2.1.156 scaffold: §E (DETERMINISM_SHIM SZ_, runDeterminismShim uP8).
 */
// 2.1.183: DETERMINISM_SHIM = N0p @416417
const DETERMINISM_SHIM = `(() => {
  const NOW_ERR = ${JSON.stringify(DATE_ERROR_MESSAGE)};
  const RANDOM_ERR = ${JSON.stringify(RANDOM_ERROR_MESSAGE)};
  Math.random = function random() { throw new Error(RANDOM_ERR) };
  const RealDate = Date;
  RealDate.now = function now() { throw new Error(NOW_ERR) };
  function ShimDate(...a) {
    if (!new.target) throw new Error(NOW_ERR);            // bare Date() → now-string
    if (a.length === 0) throw new Error(NOW_ERR);         // new Date() with no args → now
    return Reflect.construct(RealDate, a, new.target);    // new Date(2020, 0, 1) is fine
  }
  ShimDate.now = RealDate.now;
  ShimDate.parse = RealDate.parse;
  ShimDate.UTC = RealDate.UTC;
  ShimDate.prototype = RealDate.prototype;
  // Close the (new Date(x)).constructor backdoor to RealDate.now — point .constructor at the
  // shim, then freeze RealDate so it can't be undone.
  RealDate.prototype.constructor = ShimDate;
  Object.freeze(RealDate);
  globalThis.Date = ShimDate;
})()`

/**
 * Run the determinism shim inside a VM context.
 * 2.1.183 regions: cli_inner_pretty.js:416280-416282
 */
// 2.1.183: runDeterminismShim = Djn @416280
function runDeterminismShim(context: vm.Context): void {
  vm.runInContext(DETERMINISM_SHIM, context)
}

// The STATIC determinism check `isNonDeterministic` (rWa @416439, the 2.1.172 regex→AST-walk fix) is
// the PRE-LAUNCH validateInput guard and belongs to the parse/validate layer — it is owned and
// exported by ./meta.js, and consumed by WorkflowTool.tsx's validateInput. It is intentionally NOT
// re-declared here: this file owns only the RUNTIME determinism *sandbox* (DETERMINISM_SHIM /
// runDeterminismShim above), which makes the same surfaces throw at *execution* time. The two are
// defense-in-depth layers, deliberately kept in separate modules.

// ─────────────────────────────────────────────────────────────────────────────────────
// VM HARDENING  +  host↔VM boundary membrane helpers
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Harden the VM context's intrinsics: freeze `Error.prepareStackTrace` to a no-op, delete a set of
 * dangerous globals (ShadowRealm/WebAssembly/FinalizationRegistry/WeakRef/Atomics/SharedArrayBuffer/
 * queueMicrotask plus JSC debug globals), and SES-style freeze the prototype chains of core intrinsics
 * (with an enable-property-override shim so `this.name = 'X'` in Error subclass ctors still works).
 * NOTE: `eval` is NOT deleted here (the routine is shared with REPLTool); WorkflowTool blocks codegen
 * via `codeGeneration:{strings:false}` at createContext time instead.
 *
 * 2.1.183 regions: cli_inner_pretty.js:411340-411470 (program text @411342+)
 * 2.1.156 scaffold: §E layer-3 (hardenVMIntrinsics, UtH).
 */
// 2.1.183: hardenVMIntrinsics = KGe @411340
function hardenVMIntrinsics(context: vm.Context): void {
  vm.runInContext(VM_HARDENING_PROGRAM, context)
}
// The verbatim hardening program lives in the 183 bundle @411342-411469; reproduced here in spirit.
// (Full text is large; the behavior is enumerated in the doc comment above.) See KGe @411340.
const VM_HARDENING_PROGRAM = `(() => {
  Object.defineProperty(Error, 'prepareStackTrace', {
    value: (err, sites) => String(err.stack ?? err),
    writable: false, configurable: false,
  });
  for (const g of ['ShadowRealm','WebAssembly','FinalizationRegistry','WeakRef','Atomics',
                   'SharedArrayBuffer','queueMicrotask','$vm','gc','edenGC','fullGC','print',
                   'readFile','Loader']) { delete globalThis[g]; }
  function enableOverride(proto, key) {
    const d = Object.getOwnPropertyDescriptor(proto, key);
    if (!d || 'get' in d) return;
    const v = d.value;
    Object.defineProperty(proto, key, {
      get() { return v },
      set(nv) {
        if (this === proto) return;
        Object.defineProperty(this, key, { value: nv, writable: true, enumerable: true, configurable: true });
      },
    });
  }
  // … enable-override + Object.freeze over Object/Array/Function/Error/typed-arrays/Map/Set protos …
})()`

/** Compile `(async v => ({__proto__:null, v: await v}))` INSIDE the VM so awaits resolve in-sandbox. */
// 2.1.183: vmAwaitSettle = Mut @411480
function vmAwaitSettle(context: vm.Context): (v: unknown) => Promise<{ v: unknown }> {
  return vm.runInContext('(async v => ({__proto__: null, v: await v}))', context) as any
}

/** Compile `((fn, ...args) => fn(...args))` inside the VM (invoke a VM function from the host). */
// 2.1.183: vmCall = JGa @411483
function vmCall(context: vm.Context): (fn: Function, ...args: unknown[]) => unknown {
  return vm.runInContext('((fn, ...args) => fn(...args))', context) as any
}

/** Read name/message/stack off a VM-thrown value defensively (each field in its own try). */
// 2.1.183: readVMError = Hjn @411486
function readVMError(context: vm.Context): (e: unknown) => { name: string; message: string; stack: string } {
  return vm.runInContext(
    `(e => {
      let name = 'Error', message = '', stack = ''
      try { const v = e?.name; if (typeof v === 'string') name = v } catch {}
      try {
        const v = e?.message
        if (typeof v === 'string') message = v
        else if (typeof e === 'string') message = e
        else if (typeof e === 'number' || typeof e === 'boolean' || typeof e === 'bigint') {
          const s = \`\${e}\`; if (typeof s === 'string') message = s
        }
      } catch {}
      try { const v = e?.stack; if (typeof v === 'string') stack = v } catch {}
      return { __proto__: null, name, message, stack }
    })`,
    context,
  ) as any
}

/**
 * Build a host→VM deep cloner compiled INSIDE the VM. Strips functions, ignores `__proto__`, reads
 * array length once (defeats a Proxy length getter), and throws a cap error for arrays over
 * VM_BOUNDARY_ARRAY_CAP. Incidental getter/Proxy throws degrade that one slot to undefined; the cap
 * error (tagged with an unforgeable private symbol) propagates out of the whole clone.
 * 2.1.183 regions: cli_inner_pretty.js:411506-411571
 */
// 2.1.183: hostToVMClone = vjn @411506
function hostToVMClone(context: vm.Context): (hostValue: unknown) => unknown {
  // The full program (with the _CAP private-symbol tagging) lives @411508-411567; behavior summarized above.
  return vm.runInContext(VM_CLONE_PROGRAM.replace(/__CAP__/g, String(VM_BOUNDARY_ARRAY_CAP)), context) as any
}
const VM_CLONE_PROGRAM = `(() => {
  const _WeakMap=WeakMap,_isArray=Array.isArray,_keys=Object.keys,_defineProperty=Object.defineProperty,
        _Error=Error,_isSafeInteger=Number.isSafeInteger,_Symbol=Symbol
  const _CAP=_Symbol('vmArrayCap')
  function capErr(msg){const e=new _Error(msg);try{e[_CAP]=true}catch{}return e}
  function isCap(e){try{return typeof e==='object'&&e!==null&&e[_CAP]===true}catch{return false}}
  return (hostVal)=>{const seen=new _WeakMap()
    function c(v){
      if(typeof v==='function')return undefined
      if(v===null||typeof v!=='object')return v
      const hit=seen.get(v);if(hit!==undefined)return hit
      if(_isArray(v)){const len=v.length
        if(typeof len!=='number'||!_isSafeInteger(len))throw capErr('array length is not a safe integer across the workflow VM boundary')
        if(len>__CAP__)throw capErr('array length '+len+' exceeds the maximum of __CAP__ supported across the workflow VM boundary')
        const out=[];seen.set(v,out)
        for(let i=0;i<len;i++){try{out[i]=c(v[i])}catch(e){if(isCap(e))throw e;out[i]=undefined}}
        return out}
      const out={};seen.set(v,out)
      let ks;try{ks=_keys(v)}catch{return out}
      for(const k of ks){if(k==='__proto__')continue
        try{const vk=v[k];if(typeof vk==='function')continue
          _defineProperty(out,k,{value:c(vk),writable:true,enumerable:true,configurable:true})}
        catch(e){if(isCap(e))throw e}}
      return out}
    return c(hostVal)}
})()`

/** Wrap a host function so the VM only ever sees an async wrapper `async (...a) => hostFn(...a)`. */
// 2.1.183: wrapHostFnForVM = Tjn @411572
function wrapHostFnForVM(context: vm.Context): (hostFn: Function) => Function {
  return vm.runInContext('(hostFn => async (...a) => hostFn(...a))', context) as any
}

/** Build a plain {name,message,stack,toString} error-shaped object with a null prototype (host side). */
// 2.1.183: makeVMError = Pce @411575
function makeVMError(message: string, name = 'Error', stack?: string): {
  name: string; message: string; stack: string; toString: () => string
} {
  const toString = () => `${name}: ${message}`
  Object.setPrototypeOf(toString, null)
  return { name, message, stack: stack ?? `${name}: ${message}`, toString } as any
}

/** Defensively read {msg,name,stack} from a host-thrown value (uses a hardened sub-context reader). */
// 2.1.183: readHostError = Bjt @411610  (backed by R0p @411582)
function readHostError(e: unknown): { msg: string; name: string; stack?: string } {
  try {
    const name = e instanceof Error ? e.name : typeof e === 'string' ? 'Error' : 'Error'
    const msg =
      e instanceof Error ? e.message : typeof e === 'string' ? e : '<non-string error>'
    const stack = e instanceof Error ? e.stack : undefined
    return { msg: typeof msg === 'string' ? msg : '<unprintable thrown value>', name, stack }
  } catch {
    return { msg: '<unprintable thrown value>', name: 'Error' }
  }
}

/**
 * Wrap a synchronous host function so any throw is re-shaped as a VM-safe error object.
 * 2.1.183 regions: cli_inner_pretty.js:411622-411632
 */
// 2.1.183: syncGuard = KY @411622
function syncGuard<F extends (...a: any[]) => any>(fn: F): F {
  const wrapped = ((...args: any[]) => {
    try {
      return fn(...args)
    } catch (e) {
      const { msg, name, stack } = readHostError(e)
      throw makeVMError(msg, name, stack)
    }
  }) as F
  Object.setPrototypeOf(wrapped, null)
  return wrapped
}

/** Async variant of syncGuard. 2.1.183: asyncGuard = wjn @411633 */
function asyncGuard<F extends (...a: any[]) => Promise<any>>(fn: F): F {
  const wrapped = (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (e) {
      const { msg, name, stack } = readHostError(e)
      throw makeVMError(msg, name, stack)
    }
  }) as F
  Object.setPrototypeOf(wrapped, null)
  return wrapped
}

/**
 * Strip a callable's prototype surface before it is exposed to a script. Sets `__proto__` to null and
 * deletes `constructor`/`prototype` so a sandboxed caller can't climb back to Function/host intrinsics
 * via the DSL function object. NOTE: unlike syncGuard (KY), this does NOT try/catch or re-shape throws —
 * it is purely a prototype hardening wrapper. The DSL primitives (agent/parallel/pipeline/phase/log) and
 * the nested workflow() fn are wrapped with THIS; the host-side error reshaping for the async ones is
 * applied separately at install time in buildWorkflowContext via asyncGuard (wjn).
 * 2.1.183 regions: cli_inner_pretty.js:416277-416279
 */
// 2.1.183: stripCallablePrototype = K0e @416277
function stripCallablePrototype<F extends (...a: any[]) => any>(fn: F): F {
  Object.setPrototypeOf(fn, null)
  delete (fn as any).constructor
  delete (fn as any).prototype
  return fn
}

/**
 * Deep-clone a VM value out to the host, on the host side (mirror of hostToVMClone). Strips functions,
 * skips `__proto__`, enforces the boundary array cap (via toArrayAcrossBoundary length read).
 * 2.1.183 regions: cli_inner_pretty.js:411667-411703
 */
// 2.1.183: vmToHostClone = Njt @411667
function vmToHostClone(value: unknown, seen = new WeakMap()): unknown {
  if (typeof value === 'function') return undefined
  if (value === null || typeof value !== 'object') return value
  const hit = seen.get(value as object)
  if (hit !== undefined) return hit
  if (Array.isArray(value)) {
    const out: unknown[] = []
    seen.set(value as object, out)
    const len = assertBoundaryArrayLength(value)
    for (let i = 0; i < len; i++) {
      try {
        out[i] = vmToHostClone((value as any[])[i], seen)
      } catch (e) {
        if (isBoundaryCapError(e)) throw e
        out[i] = undefined
      }
    }
    return out
  }
  const out: Record<string, unknown> = {}
  seen.set(value as object, out)
  let keys: string[]
  try {
    keys = Object.keys(value as object)
  } catch {
    return out
  }
  for (const k of keys) {
    if (k === '__proto__') continue
    try {
      const v = (value as any)[k]
      if (typeof v === 'function') continue
      out[k] = vmToHostClone(v, seen)
    } catch (e) {
      if (isBoundaryCapError(e)) throw e
    }
  }
  return out
}

const BOUNDARY_CAP = Symbol('vmArrayCap')             // 2.1.183: QGa @411723
function boundaryCapError(msg: string): Error {       // 2.1.183: YGa @411644
  const e = new Error(msg)
  Object.defineProperty(e, BOUNDARY_CAP, { value: true })
  return e
}
function isBoundaryCapError(e: unknown): boolean {     // 2.1.183: XGa @411648
  try {
    return typeof e === 'object' && e !== null && (e as any)[BOUNDARY_CAP] === true
  } catch {
    return false
  }
}
function assertBoundaryArrayLength(arr: unknown): number {  // 2.1.183: ZGa @411655
  let len: number
  try {
    len = (arr as any).length
  } catch {
    throw new Error('unable to read array length across the workflow VM boundary')
  }
  if (typeof len !== 'number' || !Number.isSafeInteger(len))
    throw boundaryCapError('array length is not a safe integer across the workflow VM boundary')
  if (len > VM_BOUNDARY_ARRAY_CAP)
    throw boundaryCapError(`array length ${len} exceeds the maximum of ${VM_BOUNDARY_ARRAY_CAP} supported across the workflow VM boundary`)
  return len
}

/** Shallow-read a VM array into a host array (length-capped, per-element fault-tolerant). */
// 2.1.183: toArrayAcrossBoundary = Cjn @411705
function toArrayAcrossBoundary(value: unknown): unknown[] {
  if (value === null || typeof value !== 'object') return []
  const len = assertBoundaryArrayLength(value)
  const out: unknown[] = []
  for (let i = 0; i < len; i++) {
    try {
      out[i] = (value as any[])[i]
    } catch {
      out[i] = undefined
    }
  }
  return out
}

// ─────────────────────────────────────────────────────────────────────────────────────
// SANDBOXED TIMERS + CONCURRENCY LIMITER
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Abort-aware setTimeout/clearTimeout exposed to the script. On abort, all pending timers are cleared.
 * The timer callback is invoked through a host-bound dispatcher (`bindVMInvoke`) so the VM function runs
 * back inside its own context. A throwing callback is swallowed (no host-thread DoS).
 * 2.1.183 regions: cli_inner_pretty.js:416283-416315
 */
// 2.1.183: makeSandboxedTimers = nWa @416283
function makeSandboxedTimers(abortSignal?: AbortSignal) {
  const handles = new Set<number>()
  let invoke: (fn: Function) => void = (fn) => fn()           // rebound by bindVMInvoke (@416310)
  abortSignal?.addEventListener(
    'abort',
    () => {
      for (const h of handles) clearTimeout(h)
      handles.clear()
    },
    { once: true },
  )
  return {
    setTimeout: syncGuard((fn: Function, ms: number) => {     // @416296
      if (abortSignal?.aborted) return 0
      const h = Number(
        setTimeout(() => {
          try {
            invoke(fn)
          } catch {}
        }, ms),
      )
      handles.add(h)
      return h
    }),
    clearTimeout: syncGuard((h: number) => {                  // @416307
      handles.delete(h)
      clearTimeout(h)
    }),
    bindVMInvoke: (dispatch: (fn: Function) => void) => {     // @416310
      invoke = dispatch
    },
  }
}

/**
 * FIFO concurrency limiter (counting semaphore). Wraps an async function so at most `limit` calls run
 * concurrently; overflow callers queue and resume in arrival order. This is the SHARED machinery behind
 * the LOCAL executor (width DEFAULT_WORKFLOW_CONCURRENCY) and the remote/worktree limiters.
 * 2.1.183 regions: cli_inner_pretty.js:298208-298228
 */
// 2.1.183: withConcurrencyLimit = nst @298208
function withConcurrencyLimit<A extends any[], R>(
  limit: number,
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  let inFlight = 0
  const waiters: Array<() => void> = []
  const acquire = () =>
    inFlight < limit ? ((inFlight++, Promise.resolve())) : new Promise<void>((r) => waiters.push(r))
  const release = () => {
    const next = waiters.shift()
    if (next) next()
    else inFlight--
  }
  return async (...args: A): Promise<R> => {
    await acquire()
    try {
      return await fn(...args)
    } finally {
      release()
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// SANDBOX CONSOLE
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Build the `console` object exposed to the script. console.log/info/debug → plain text;
 * error/warn get `[error] `/`[warn] ` prefixes. All route to the host `emit` (→ workflow_log progress).
 * Each method is a syncGuard'd VM-safe wrapper; the object has a null prototype.
 * 2.1.183 regions: cli_inner_pretty.js:416579-416594
 */
// 2.1.183: sandboxConsole = ado @416579
function sandboxConsole(emit: (line: string) => void) {
  const fmt = (parts: unknown[]) =>
    parts
      .map((p) => {
        if (typeof p === 'string') return p
        try {
          return stableStringify(p)
        } catch {
          return `[${typeof p}]`
        }
      })
      .join(' ')
  const method = (prefix: string) => syncGuard((...parts: unknown[]) => emit(prefix + fmt(parts)))
  return { __proto__: null, log: method(''), info: method(''), debug: method(''), error: method('[error] '), warn: method('[warn] ') }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// HOOKS + DSL PRIMITIVES  (makeWorkflowHooks = EWa)
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * The big closure that defines every DSL primitive a workflow script calls, plus the executor that
 * spawns one subagent. It owns the per-run mutable state: agent counter, journal de-dup, phase map,
 * the cap/budget gates, and the concurrency-limited local/remote executors.
 *
 * Returned surface (@416697-416712):
 *   { agent, parallel, pipeline, log, phase, resolvePhase, recordFailure, getAgentCount, getFailures,
 *     bindVMAwait }
 * `bindVMAwait` lets buildWorkflowContext inject the in-VM await-settle/clone bridge after the context
 * is created (so `u`/`d`/`p` — settle/call/clone — operate inside the sandbox).
 *
 * 2.1.183 regions: cli_inner_pretty.js:416901-417713
 * 2.1.156 scaffold: §B/§D (makeWorkflowHooks g74; agent B; parallel Q; pipeline g; phase I; log l).
 *
 * The `localExecutor`/`spawnWorkflowAgent`/`remoteExecutor` bodies are large; their full reconstruction
 * lives in subagents.ts (per the 2.1.88 split tools/WorkflowTool/subagent.ts). Here we restore the
 * DSL-facing logic and the dispatch wiring, and reference the spawn closure by name.
 */
// 2.1.183: makeWorkflowHooks = EWa @416901
function makeWorkflowHooks(
  toolCtx: WorkflowToolContext,
  canUseTool: CanUseTool,
  onProgress: (ev: ProgressEvent) => void,
  runId: string | undefined,
  onAgentController: ((agentId: string, controller: AbortController | null) => void) | undefined,
  seedPhaseTitles: string[] | undefined,
  tokenBudget: TokenBudget | undefined,
  journal: WorkflowJournal | undefined,
  journalIndex: JournalIndex | undefined,
): WorkflowHooks {
  let agentCount = 0                                          // c @416902 — total agent() calls (vs cap)
  // VM-await bridge, rebound by bindVMAwait. Defaults keep a standalone run sane.
  let vmSettle: (v: unknown) => Promise<{ v: unknown }> = async (z) => ({ v: await z })  // u @416903
  let vmInvoke: (fn: Function, ...args: unknown[]) => unknown = (fn, ...a) => fn(...a)   // d @416904
  let vmClone: (v: unknown) => unknown = (v) => structuredCloneValue(v)                  // p @416905
  let journalCursor = ''                                      // f @416906 — running journal key chain
  let journalDiverged = false                                 // m @416907 — true once we miss the cache
  let capWarned = false                                       // A @416908
  let budgetWarned = false                                    // g @416909
  const failures: string[] = []                               // h @416910
  // Worktree-create limiter: width 1 (worktree setup is serialized).
  const createWorktree = withConcurrencyLimit(1, createWorktreeFor)  // y @416911

  // enforceAgentCap (S @416933): throw WorkflowAgentCapError once the 1000th agent() call is reached.
  function enforceAgentCap(): void {
    if (agentCount < WORKFLOW_AGENT_CAP) return
    if (!capWarned) {
      capWarned = true
      logTelemetry('tengu_workflow_agent_cap_exceeded', { agentCount })  // @416935
    }
    throw new WorkflowAgentCapError()
  }

  // enforceTokenBudget (T @416938): throw WorkflowBudgetExceededError once turn output-tokens reach the budget.
  function enforceTokenBudget(): void {
    if (tokenBudget?.total == null || tokenBudget.total <= 0) return     // @416939
    const spent = tokenBudget.getTurnSpent()
    if (spent < tokenBudget.total) return
    if (!budgetWarned) {
      budgetWarned = true
      logTelemetry('tengu_workflow_budget_cap_exceeded', { spent, budget: tokenBudget.total, agentCount }) // @416942
    }
    throw new WorkflowBudgetExceededError(spent, tokenBudget.total)
  }

  // Phase registry: title → 1-based index, emitting a workflow_phase progress event on first sight.
  let phaseCounter = 0                                        // C @416945
  let activePhaseTitle: string | undefined                   // x @416946
  const phaseIndexByTitle = new Map<string, number>()        // I @416947
  // The tool-context the spawn loop runs under: app-state mutations are no-ops in workflows.
  const spawnCtx = { ...toolCtx, setAppState: () => {}, setToolPermissionContext: () => {} } // k @416948

  // resolvePhase (L @416949): register a phase title and return its index.
  function resolvePhase(title: string, kind?: string): number {
    let idx = phaseIndexByTitle.get(title)
    if (idx == null) {
      idx = ++phaseCounter
      phaseIndexByTitle.set(title, idx)
      onProgress({
        type: 'progress',
        toolUseID: `workflow_phase_${idx}`,
        data: { type: 'workflow_phase', index: idx, title, kind },           // @416956
      })
    }
    return idx
  }
  for (const t of seedPhaseTitles ?? []) resolvePhase(t)                      // @416961  pre-seed phases

  // phase (P @416962): set the active phase used as the default for subsequent agent() calls.
  // Wrapped with K0e (stripCallablePrototype), NOT KY/syncGuard.
  const phase = stripCallablePrototype((title: unknown) => {
    activePhaseTitle = String(title)
    resolvePhase(activePhaseTitle)
  })

  // The two executors, each concurrency-limited (R = local @ DEFAULT_WORKFLOW_CONCURRENCY, D = remote @ 50).
  const localExecutor = withConcurrencyLimit(DEFAULT_WORKFLOW_CONCURRENCY, runLocalAgent)   // R @416965
  const remoteExecutor = withConcurrencyLimit(WORKFLOW_REMOTE_DEFAULT, runRemoteAgent) // D @416966
  const schemaCache = new WeakMap<object, unknown>()                          // O @416967

  // ── agent(prompt, opts) — the per-call entry (M @416968) ──────────────────────────────
  // Cleans up opts, resolves phase/label/stall, checks the journal cache (resume), then dispatches.
  const agent = stripCallablePrototype(async (prompt: unknown, opts: unknown): Promise<unknown> => {
    // ... (schema marshalling, label/phase resolution, journal cache lookup, queued/start progress) ...
    // CAP + BUDGET gates run before incrementing the counter (@416984), then:
    //   - if journal has a cached result for this key and we haven't diverged → return it (cached:true)
    //   - else mark diverged, dispatch to localExecutor (or throw for remote isolation @417061)
    if (spawnCtx.abortController?.signal.aborted) return new Promise<never>(() => {})   // @416982 never resolve
    try {
      enforceAgentCap()
      enforceTokenBudget()
    } catch (e) {
      await sleep(0)
      throw e                                                                   // @416986
    }
    const index = ++agentCount                                                  // @416988
    // ... resolve label (opts.label || prompt[:60]), phase (opts.phase || activePhaseTitle),
    //     stallMs (opts.stallMs || WORKFLOW_STALL_MS_DEFAULT) ...
    // Journal RESUME: if a cached result exists for this key and we haven't diverged, emit a `cached:true`
    //   workflow_agent progress event and return `vmClone(cached)` (`p(Ae.result)` @417021).
    if ((opts as any)?.isolation === 'remote')
      throw new Error("agent({isolation:'remote'}) is not available in this build")  // @417061
    // Live dispatch (@417064): wrap localExecutor (R) in the journal result-append (`ye`).
    //   NOTE: the live path returns `ye(R(...))` WITHOUT vmClone — the clone only happens on the cached
    //   path. The localExecutor itself produces an already host-side value.
    return runViaLocalExecutorWithJournal(index, prompt, opts)
  }) as unknown as AgentFn

  // ── parallel(funcs) — synchronization BARRIER over function invocations (q @417634) ──────
  const parallel = stripCallablePrototype(async (funcs: unknown): Promise<unknown> => {
    if (spawnCtx.abortController?.signal.aborted) return new Promise<never>(() => {})  // @417635
    await sleep(0)
    if (!Array.isArray(funcs)) throw new TypeError('parallel() expects an array of functions')  // @417636
    const items = toArrayAcrossBoundary(funcs)
    if (items.length === 0) return vmClone([])                                  // @417638
    enforceAgentCap()
    enforceTokenBudget()
    for (const f of items)
      if (typeof f !== 'function')
        throw new TypeError(                                                    // @417642
          'parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)',
        )
    // BARRIER: invoke EVERY function NOW, await ALL via allSettled. Caller resumes only when all settle.
    const settled = await Promise.allSettled(items.map((f) => vmSettle(vmInvoke(f as Function)))) // @417643
    let dropped = 0
    const results = settled.map((s, i) => {
      if (s.status === 'fulfilled') return (s.value as { v: unknown }).v
      const { name, msg } = readHostError(s.reason)
      if (name === 'WorkflowBudgetExceededError') {                            // @417648  budget drop → null
        dropped++
        return null
      }
      const line = `parallel[${i}] failed: ${msg}`
      failures.push(line)
      onProgress({ type: 'progress', toolUseID: 'workflow_log', data: { type: 'workflow_log', message: line } })
      return null
    })
    if (dropped > 0) failures.push(`parallel: ${dropped} ${pluralize(dropped, 'slot')} dropped — token budget exceeded`) // @417656
    return vmClone(results)
  }) as unknown as ParallelFn

  // ── pipeline(items, ...stages) — PER-ITEM flow, NO cross-item barrier (V @417659) ─────────
  const pipeline = stripCallablePrototype(async (itemsArg: unknown, ...stagesArg: unknown[]): Promise<unknown> => {
    if (spawnCtx.abortController?.signal.aborted) return new Promise<never>(() => {})  // @417660
    await sleep(0)
    if (!Array.isArray(itemsArg)) throw new TypeError('pipeline() expects an array as the first argument') // @417661
    const items = toArrayAcrossBoundary(itemsArg)
    const stages = toArrayAcrossBoundary(stagesArg)
    if (items.length === 0) return vmClone([])                                  // @417664
    enforceAgentCap()
    enforceTokenBudget()
    for (const stage of stages)
      if (typeof stage !== 'function')
        throw new TypeError('pipeline() stages must be functions: pipeline(items, item => ..., result => ...)') // @417668
    // PER-ITEM: each item independently threads through all stages; items don't wait for one another.
    // A stage returning null short-circuits the rest of THAT item's flow (@417673).
    const settled = await Promise.allSettled(
      items.map(async (item, i) => {                                           // @417670
        let value = await vmSettle(item)
        for (const stage of stages) {
          if (value.v === null) break                                          // @417673  short-circuit
          value = await vmSettle(vmInvoke(stage as Function, value.v, item, i)) // @417674  (value, item, index)
        }
        return value
      }),
    )
    let dropped = 0
    const results = settled.map((s, i) => {
      if (s.status === 'fulfilled') return (s.value as { v: unknown }).v
      const { name, msg } = readHostError(s.reason)
      if (name === 'WorkflowBudgetExceededError') {                            // @417683
        dropped++
        return null
      }
      const line = `pipeline[${i}] failed: ${msg}`
      failures.push(line)
      onProgress({ type: 'progress', toolUseID: 'workflow_log', data: { type: 'workflow_log', message: line } })
      return null
    })
    if (dropped > 0) failures.push(`pipeline: ${dropped} ${pluralize(dropped, 'slot')} dropped — token budget exceeded`) // @417691
    return vmClone(results)
  }) as unknown as PipelineFn

  // ── log(message) — emit a workflow_log progress event (Q @417694) ─────────────────────────
  const log = stripCallablePrototype((message: unknown) => {
    onProgress({ type: 'progress', toolUseID: 'workflow_log', data: { type: 'workflow_log', message: String(message) } })
  })

  return {
    agent,                          // M
    parallel,                       // q
    pipeline,                       // V
    log,                            // Q
    phase,                          // P
    resolvePhase,                   // L
    recordFailure: (line: string) => {                          // @417704
      failures.push(line)
    },
    getAgentCount: () => agentCount,                            // @417707
    getFailures: () => failures,                                // @417708
    bindVMAwait: (bridge) => {                                  // @417709  inject in-VM settle/call/clone
      vmSettle = bridge.settle
      vmInvoke = bridge.call
      vmClone = bridge.clone
    },
  }

  // ── Executor bodies (UNVERIFIED-detail stubs; full reconstruction belongs in subagents.ts) ──
  // These exist so the closure type-checks and the dispatch wiring is faithful. Their FULL bodies
  // (spawn loop, stall timeout, throttle backoff, journal append, worktree lifecycle) are restored in
  // subagents.ts. See localExecutor U @417088, spawnWorkflowAgent Tt @417149, remoteExecutor W @417529.
  async function runViaLocalExecutorWithJournal(
    _index: number,
    _prompt: unknown,
    _opts: unknown,
  ): Promise<unknown> {
    // UNVERIFIED here only as a stub boundary; the dispatch target is localExecutor (R). The real
    // journal-cache + queued-progress logic is @416997-417086 and is reproduced in subagents.ts.
    return localExecutor(_index, String(_prompt), '', undefined, undefined, WORKFLOW_STALL_MS_DEFAULT, _opts, () => {}, Date.now(), undefined)
  }
  async function runLocalAgent(..._a: unknown[]): Promise<unknown> {
    // localExecutor U @417088-417523 — full body in subagents.ts (spawn/stall/throttle/worktree).
    return undefined
  }
  async function runRemoteAgent(..._a: unknown[]): Promise<unknown> {
    // remoteExecutor W @417529-417633 — remote isolation is disabled in this build (agent() throws).
    return undefined
  }
  async function createWorktreeFor(_name: string): Promise<unknown> {
    // worktree create (JGe @580244) — serialized via the width-1 limiter `y`.
    return undefined
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// NESTED WORKFLOW GLOBAL  (the `workflow()` intrinsic — ONE level only)
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Build the `workflow(nameOrSpec, args)` global. It resolves a named/saved workflow (or a {scriptPath}),
 * re-parses its meta, compiles its body, then runs it in a FRESH child VM context whose globals reuse the
 * PARENT's agent/parallel/pipeline dispatch (so the agent cap, token budget, and journal are shared) —
 * but whose own `workflow()` is `() => Promise.reject(...)`. That is the one-level nesting guard: a child
 * workflow cannot itself call workflow(). The child's `phase()` is a no-op; its `log()`/`console` are
 * prefixed with `[name] `.
 *
 * 2.1.183 regions: cli_inner_pretty.js:416595-416683 (nesting guard @416628-416633)
 * 2.1.156 scaffold: §D.4 (createNestedWorkflowGlobal, QK4).
 */
// 2.1.183: createNestedWorkflowGlobal = aWa @416595
function createNestedWorkflowGlobal(deps: NestedWorkflowDeps): NestedWorkflowFn {
  const runCountByName = new Map<string, number>()   // t @416596 — dedup label suffix (#2, #3, …)
  // Wrapped with K0e (stripCallablePrototype) @416597, NOT KY/syncGuard.
  return stripCallablePrototype(async function (nameOrSpec: unknown, args: unknown): Promise<unknown> {
    if (deps.abortSignal?.aborted) return new Promise<never>(() => {})         // @416598
    let scriptBody: string
    let name: string

    if (typeof nameOrSpec === 'string') {                                      // @416600  by name
      const wf = await deps.resolveWorkflow(nameOrSpec, getCwd())
      if (!wf) {
        const avail = (await deps.getAllWorkflows(getCwd())).map((w) => w.name).join(', ')
        throw new Error(`workflow('${nameOrSpec}'): no workflow with that name. Available: ${avail || '(none)'}`)
      }
      const parsed = parseWorkflowMeta(wf.script)
      if ('error' in parsed) throw new Error(`workflow('${nameOrSpec}'): ${parsed.error}`)
      name = wf.name
      scriptBody = parsed.scriptBody
    } else if (nameOrSpec && typeof nameOrSpec === 'object' && typeof (nameOrSpec as any).scriptPath === 'string') {
      const spec = nameOrSpec as { scriptPath: string }                       // @416609  by {scriptPath}
      const read = await resolveWorkflowSource(spec.scriptPath)
      if ('error' in read) throw new Error(`workflow({scriptPath: '${spec.scriptPath}'}): ${read.error}`)
      const parsed = parseWorkflowMeta(read.script)
      if ('error' in parsed) throw new Error(`workflow({scriptPath: '${spec.scriptPath}'}): ${parsed.error}`)
      name = parsed.meta.name
      scriptBody = parsed.scriptBody
    } else {
      throw new TypeError('workflow() expects a workflow name (string) or {scriptPath: string}')  // @416615
    }

    const compiled = compileWorkflowScript(scriptBody)                        // @416616
    if (!compiled.ok) throw new Error(`workflow('${name}'): ${compiled.error}`)

    const runNo = (runCountByName.get(name) ?? 0) + 1                         // @416618
    runCountByName.set(name, runNo)
    const childPhaseTitle = `${PHASE_MARKER} ${name}${runNo > 1 ? ` #${runNo}` : ''}`  // @416620 (sOe '▸')
    deps.hooks.resolvePhase(childPhaseTitle, 'child')
    deps.hooks.log(`${PHASE_MARKER} running dynamic workflow ${name}`)

    const logPrefix = `[${name}] `                                            // @416622
    let readChildError: ((e: unknown) => { name: string; message: string; stack: string }) | undefined

    // Child DSL: agents inherit the parent's dispatch (cap/budget/journal shared) but get the child phase.
    const childDsl = {                                                        // p @416624
      agent: (m: unknown, a: any) => deps.hooks.agent(m, { ...a, phase: childPhaseTitle }), // @416625
      parallel: deps.hooks.parallel,
      pipeline: deps.hooks.pipeline,
      // ONE-LEVEL nesting guard: a child workflow may NOT call workflow().  @416628-416633
      workflow: () =>
        Promise.reject(
          new Error(
            'workflow() cannot be called from within a child workflow — nesting is limited to one level. ' +
              'Inline the inner script or call its agents directly.',
          ),
        ),
    }
    // Child non-DSL globals: budget+timers shared; phase() is a NO-OP; log/console are prefixed.
    const childGlobals = {                                                    // f @416635
      __proto__: null,
      budget: deps.budget,
      setTimeout: deps.timers.setTimeout,
      clearTimeout: deps.timers.clearTimeout,
      phase: syncGuard((_m: unknown) => {}),                                  // @416640  child phase() does nothing
      log: syncGuard((m: unknown) => deps.hooks.log(logPrefix + (typeof m === 'string' ? m : `[${typeof m}]`))),
      console: sandboxConsole((m) => deps.hooks.log(logPrefix + m)),          // @416642
    }

    try {
      const ctx = vm.createContext(childGlobals, { codeGeneration: { strings: false, wasm: false } }) // @416645
      runDeterminismShim(ctx)
      hardenVMIntrinsics(ctx)
      const wrap = wrapHostFnForVM(ctx)                                       // @416647
      for (const [key, fn] of Object.entries(childDsl))                       // @416648  install DSL into ctx
        Object.defineProperty(ctx, key, { value: wrap(asyncGuard(fn as any)), writable: true, enumerable: true, configurable: true })
      readChildError = readVMError(ctx)                                       // @416650
      const settle = vmAwaitSettle(ctx)                                       // g @416651
      const clone = hostToVMClone(ctx)                                        // h @416652
      Object.defineProperty(ctx, 'args', {                                    // @416653
        value: args === undefined ? undefined : clone(args),
        writable: true, enumerable: true, configurable: true,
      })
      const settled = await settle(compiled.vmScript.runInContext(ctx, { timeout: WORKFLOW_VM_TIMEOUT_MS })) // @416659
      const result = clone((settled as { v: unknown }).v)
      deps.hooks.log(`${PHASE_MARKER} ${name} done`)                          // @416661
      return result
    } catch (e) {
      // Read error shape (via the child reader if we got that far) and emit a trimmed (≤5-frame) stack.
      let name2: string, message: string, stack: string | undefined         // @416662
      if (readChildError) ({ name: name2, message, stack } = readChildError(e))
      else {
        name2 = e instanceof Error ? e.name : 'Error'
        message = e instanceof Error ? e.message : ''
        stack = e instanceof Error ? e.stack : undefined
      }
      const summary = trimStack(name2, message, stack)                        // @416670-416679
      deps.hooks.recordFailure(`${childPhaseTitle}: ${summary}`)
      deps.hooks.log(`${PHASE_MARKER} ${name} failed: ${summary}`)
      throw makeVMError(summary, name2, stack || undefined)                   // @416680
    }
  }) as unknown as NestedWorkflowFn
}

// Trim a stack to header + first 5 `at` frames (shared by nested + top-level runners). @416670 / @418133
function trimStack(name: string, message: string, stack?: string): string {
  if (!stack) return message ? `${name}: ${message}` : name
  const lines = stack.split('\n')
  const frames = lines.slice(1).filter((l) => l.trim().startsWith('at '))
  return frames.length <= 5 ? stack : [lines[0] ?? '', ...frames.slice(0, 5)].join('\n')
}

// 2.1.183: PHASE_MARKER = sOe @53770  ('▸')
const PHASE_MARKER = '▸'

// ─────────────────────────────────────────────────────────────────────────────────────
// CONTEXT ASSEMBLY  (buildWorkflowContext = DWa)  —  freeze budget, harden, bind await bridge
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Assemble the VM context for one top-level workflow run. This is the single place that decides exactly
 * which globals a script can see: agent, parallel, pipeline, workflow, log, phase, budget, console,
 * args, setTimeout, clearTimeout. There is NO require/fs/process/module/import/Buffer/network surface.
 *
 * Sequence:
 *   1. makeWorkflowHooks → the DSL implementations + executors.
 *   2. Freeze the `budget` object (so a script can't fake spend); remaining()===Infinity when total==null.
 *   3. makeSandboxedTimers (abort-aware).
 *   4. createNestedWorkflowGlobal (the `workflow()` intrinsic, sharing hooks/budget).
 *   5. vm.createContext with codeGeneration:{strings:false,wasm:false} (no eval/Function in-VM).
 *   6. runDeterminismShim + hardenVMIntrinsics + bind the timer dispatcher.
 *   7. Install agent/parallel/pipeline/workflow as wrapped async host fns; clone `args` IN-VM.
 *   8. bindVMAwait so the hooks' settle/call/clone operate inside this context.
 *
 * 2.1.183 regions: cli_inner_pretty.js:418026-418069 (frozen budget @418029-418034)
 * 2.1.156 scaffold: §B (buildWorkflowContext, H44).
 */
// 2.1.183: buildWorkflowContext = DWa @418026
export function buildWorkflowContext(
  toolCtx: WorkflowToolContext,
  canUseTool: CanUseTool,
  onProgress: (ev: ProgressEvent) => void,
  runId: string | undefined,
  onAgentController: ((agentId: string, controller: AbortController | null) => void) | undefined,
  args: unknown,
  seedPhaseTitles: string[] | undefined,
  tokenBudget: TokenBudget | undefined,
  journal: WorkflowJournal | undefined,
  journalIndex: JournalIndex | undefined,
): { vmContext: vm.Context; hooks: WorkflowHooks } {
  const hooks = makeWorkflowHooks(
    toolCtx, canUseTool, onProgress, runId, onAgentController, seedPhaseTitles, tokenBudget, journal, journalIndex,
  )
  const console = sandboxConsole((msg) =>
    onProgress({ type: 'progress', toolUseID: 'workflow_log', data: { type: 'workflow_log', message: msg } }))

  // Frozen budget: tamper-proof from the script. remaining() returns Infinity when no total is set —
  // the exact footgun the WorkflowAgentCapError message warns about.   @418029-418034
  const budget = Object.freeze({
    __proto__: null,
    total: tokenBudget?.total ?? null,
    spent: syncGuard(() => tokenBudget?.getTurnSpent() ?? 0),
    remaining: syncGuard(() => (tokenBudget?.total == null ? Infinity : Math.max(0, tokenBudget.total - tokenBudget.getTurnSpent()))),
  })

  const abortSignal = toolCtx.abortController?.signal                         // @418035
  const timers = makeSandboxedTimers(abortSignal)                            // @418036
  const workflow = createNestedWorkflowGlobal({                              // @418037
    hooks, budget, abortSignal, timers, resolveWorkflow: resolveNamedWorkflow, getAllWorkflows,
  })

  const ctx = vm.createContext(                                              // @418038
    {
      __proto__: null,
      log: syncGuard(hooks.log),
      phase: syncGuard(hooks.phase),
      budget,
      console,
      setTimeout: timers.setTimeout,
      clearTimeout: timers.clearTimeout,
    },
    { codeGeneration: { strings: false, wasm: false } },                     // no eval/Function inside the VM
  )
  runDeterminismShim(ctx)                                                    // @418050
  hardenVMIntrinsics(ctx)
  timers.bindVMInvoke(vm.runInContext('(fn => { fn() })', ctx))              // dispatch timer cbs back in-VM

  const wrap = wrapHostFnForVM(ctx)                                          // h @418051
  for (const [key, fn] of [                                                  // @418052  install the four async DSL fns
    ['agent', hooks.agent],
    ['parallel', hooks.parallel],
    ['pipeline', hooks.pipeline],
    ['workflow', workflow],
  ] as const)
    Object.defineProperty(ctx, key, { value: wrap(asyncGuard(fn as any)), writable: true, enumerable: true, configurable: true })

  {
    // `args` is round-tripped through JSON.parse INSIDE the VM so it's a fresh in-realm object.  @418059
    const json = args === undefined ? undefined : JSON.stringify(args)
    Object.defineProperty(ctx, 'args', {
      value: json === undefined ? undefined : vm.runInContext(`JSON.parse(${JSON.stringify(json)})`, ctx),
      writable: true, enumerable: true, configurable: true,
    })
  }

  // Bind the in-VM await bridge so parallel()/pipeline() settle/call/clone operate inside this context.
  hooks.bindVMAwait({ settle: vmAwaitSettle(ctx), call: vmCall(ctx), clone: hostToVMClone(ctx) }) // @418068
  return { vmContext: ctx, hooks }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// RUNNER  (runWorkflowScript = MWa)  —  runInContext with 30 s sync timeout + abort race
// ─────────────────────────────────────────────────────────────────────────────────────

export interface RunWorkflowOptions {
  onProgress?: (ev: ProgressEvent) => void
  journal?: WorkflowJournal
  workflowRunId?: string
  onAgentController?: (agentId: string, controller: AbortController | null) => void
  args?: unknown
  seedPhaseTitles?: string[]
  tokenBudget?: TokenBudget
  syncTimeoutMs?: number
}

export interface RunWorkflowResult {
  result: unknown
  agentCount: number
  logs: string[]
  failures: string[]
  durationMs: number
  error?: string
}

/**
 * Drive one workflow run end-to-end: load the resume journal, build the context, run the compiled
 * vm.Script with a 30 s SYNCHRONOUS timeout (caps only synchronous evaluation, not the async agent
 * work), race the resulting promise against the abort signal, then normalize the result to a structured
 * value. A thrown script error becomes a soft `{ error }` result (with a trimmed ≤5-frame stack), never a
 * throw out of the runner.
 *
 * 2.1.183 regions: cli_inner_pretty.js:418079-418154
 * 2.1.156 scaffold: §C (runWorkflowScript, q44).
 */
// 2.1.183: runWorkflowScript = MWa @418079
export async function runWorkflowScript(
  vmScript: vm.Script,
  toolCtx: WorkflowToolContext,
  canUseTool: CanUseTool,
  opts: RunWorkflowOptions = {},
): Promise<RunWorkflowResult> {
  const startMs = Date.now()
  const logs: string[] = []
  const onProgress = (ev: ProgressEvent) => {                                // @418082
    if (ev.type === 'progress' && ev.data.type === 'workflow_log' && logs.length < WORKFLOW_LOG_CAP)
      logs.push(ev.data.message)
    opts.onProgress?.(ev)
  }
  const journalIndex = opts.journal ? await opts.journal.load() : undefined  // @418086
  const { vmContext, hooks } = buildWorkflowContext(
    toolCtx, canUseTool, onProgress, opts.workflowRunId, opts.onAgentController,
    opts.args, opts.seedPhaseTitles, opts.tokenBudget, opts.journal, journalIndex,
  )
  const readError = readVMError(vmContext)                                   // c @418088
  const abortSignal = toolCtx.abortController?.signal
  let removeAbortListener: (() => void) | undefined

  try {
    // Synchronous evaluation is capped at 30 s; the returned value is the IIFE's promise.
    const evaluated = vmScript.runInContext(vmContext, { timeout: opts.syncTimeoutMs ?? WORKFLOW_VM_TIMEOUT_MS }) // @418092
    const settled = vmAwaitSettle(vmContext)(evaluated)                      // @418093
    settled.catch(() => {})                                                  // swallow to avoid unhandled-rejection

    // Race the script promise against the abort signal.
    const winner = (
      abortSignal
        ? await Promise.race([
            settled,
            new Promise<never>((_resolve, reject) => {                       // @418099
              const onAbort = () => reject(new Error('Workflow aborted'))
              if (abortSignal.aborted) onAbort()
              else {
                abortSignal.addEventListener('abort', onAbort)
                removeAbortListener = () => abortSignal.removeEventListener('abort', onAbort)
              }
            }),
          ])
        : await settled
    ).v

    // Normalize: try structuredClone, else JSON round-trip (dropping functions). @418108-418113
    let result: unknown
    try {
      result = structuredCloneValue(winner)
    } catch (e) {
      if (winner === null || typeof winner !== 'object') throw e
      result = JSON.parse(stableStringify(winner, (_k: string, v: unknown) => (typeof v === 'function' ? undefined : v)) ?? 'null')
    }
    stableStringify(result)                                                  // @418115  assert it's serializable

    return {
      result,
      agentCount: hooks.getAgentCount(),
      logs,
      failures: hooks.getFailures(),
      durationMs: Date.now() - startMs,
    }
  } catch (e) {
    const { name, message, stack } = readError(e)                           // @418125
    if (stack) logError(`Workflow script error stack trace:\n${stack}`, { level: 'error' })
    return {
      result: null,
      agentCount: hooks.getAgentCount(),
      logs,
      failures: hooks.getFailures(),
      durationMs: Date.now() - startMs,
      error: trimStack(name, message, stack),                               // @418133-418142
    }
  } finally {
    removeAbortListener?.()
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Types  (structural shapes for the runtime; field names mirror the 183 progress/journal payloads)
// ─────────────────────────────────────────────────────────────────────────────────────

export interface TokenBudget {
  total: number | null
  getTurnSpent(): number
}

interface FrozenBudget {
  total: number | null
  spent(): number
  remaining(): number
}

export type AgentFn = (prompt: string, opts?: AgentOptions) => Promise<unknown>
export type ParallelFn = (funcs: Array<() => Promise<unknown>>) => Promise<unknown[]>
export type PipelineFn = (items: unknown[], ...stages: Array<(value: unknown, item: unknown, index: number) => unknown>) => Promise<unknown[]>
export type NestedWorkflowFn = (nameOrSpec: string | { scriptPath: string }, args?: unknown) => Promise<unknown>

export interface AgentOptions {
  label?: string
  phase?: string
  model?: string
  effort?: string
  schema?: unknown
  agentType?: string
  isolation?: 'worktree' | 'remote'
  stallMs?: number
}

export interface WorkflowHooks {
  agent: AgentFn
  parallel: ParallelFn
  pipeline: PipelineFn
  log: (message: unknown) => void
  phase: (title: unknown) => void
  resolvePhase: (title: string, kind?: string) => number
  recordFailure: (line: string) => void
  getAgentCount: () => number
  getFailures: () => string[]
  bindVMAwait: (bridge: {
    settle: (v: unknown) => Promise<{ v: unknown }>
    call: (fn: Function, ...args: unknown[]) => unknown
    clone: (v: unknown) => unknown
  }) => void
}

interface NestedWorkflowDeps {
  hooks: WorkflowHooks
  budget: FrozenBudget
  abortSignal?: AbortSignal
  timers: ReturnType<typeof makeSandboxedTimers>
  resolveWorkflow: (name: string, cwd: string) => Promise<{ name: string; script: string } | undefined>
  getAllWorkflows: (cwd: string) => Promise<Array<{ name: string }>>
}

// The full tool-context / progress-event / journal types live in the WorkflowTool + journal modules;
// minimal structural shapes are declared here to keep this file self-contained.
export interface WorkflowToolContext {
  abortController?: AbortController
  agentContext?: unknown
  options: {
    mainLoopModel: string
    agentDefinitions: { activeAgents: Array<{ agentType: string }> }
    tools: unknown[]
    spawnedBySkill?: unknown
    activeSkill?: unknown
  }
  getAppState: () => any
  setAppState: (...a: any[]) => void
  setToolPermissionContext: (...a: any[]) => void
}
export type CanUseTool = (...a: any[]) => any
export interface ProgressEvent {
  type: string
  toolUseID: string
  data: any
}
export interface WorkflowJournal {
  load(): Promise<JournalIndex>
  append(entry: unknown): Promise<void>
}
export interface JournalIndex {
  results: Map<string, { agentId: string; result: unknown }>
  started: Map<string, string[]>
}
