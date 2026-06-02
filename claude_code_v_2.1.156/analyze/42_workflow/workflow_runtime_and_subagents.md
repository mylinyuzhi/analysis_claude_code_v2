# Workflow Runtime — Compile, VM Context, DSL Primitives, Determinism Sandbox & Subagents

> Module: `42_workflow` — Dynamic Workflows (FLAGSHIP, new in 2.1.154)
> Build under analysis: Claude Code **v2.1.156**
> Source: `cli_inner_pretty.js` (single pretty-printed bundle; every line citation is a verified read)
> Third sibling to `workflow_tool_definition.md` (tool object / schema / meta parser) and
> `gate_caps_lifecycle_relations.md` (gate / keyword / consent / caps / journal / lifecycle / ultracode /
> coordinator). Those two docs answer *"what is the tool and when may it run?"* This doc answers the
> question they deliberately defer: **"how does a workflow script actually compile and run, what do the
> DSL primitives do, and what subagents do they spawn?"**

## Related Symbols

> Symbol mappings live in the central index and the per-module additions file (never as tables in this doc):
> - [symbol_additions_v2_1_156_workflow.md](../00_overview/symbol_additions_v2_1_156_workflow.md) — all v2.1.156 workflow symbols (the home for these rows pending consolidation).
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (**Workflows** is the home module).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (the `WS` query loop, agent definitions, tool runtime).
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (sandbox, permissions).

Key symbols in this document (full table in the additions file):

**Compile / VM / runner**
- `compileWorkflowScript` (`BP8`) — wrap body in `(async () => {…})()`, run a `Function()` syntax pre-check, compile to a `vm.Script` (cli_inner_pretty.js:367468-367482)
- `runDeterminismShim` (`uP8`) — `vm.runInContext(SZ_, ctx)`; injects the determinism shim into a VM context (cli_inner_pretty.js:367442-367444)
- `DETERMINISM_SHIM` (`SZ_`) — the shim source that rebinds `Math.random`/`Date.now`/`Date` to throw (cli_inner_pretty.js:367493-367513)
- `hardenVMIntrinsics` (`UtH`) — freezes intrinsics, freezes `Error.prepareStackTrace`, deletes `ShadowRealm`/`WebAssembly` (cli_inner_pretty.js:367515-367582)
- `makeSandboxedTimers` (`xK4`) — abort-aware `setTimeout`/`clearTimeout` for the VM context (cli_inner_pretty.js:367445-367467)
- `vmAwaitBridge` (`uK4`) — compiles `(async v => v)` inside the context so VM `await` resolves in-sandbox (cli_inner_pretty.js:367583-367585)
- `makeWorkflowHooks` (`g74`) — VM-bridge factory: builds `agent/parallel/pipeline/log/phase` closures + caps + local/remote executors (cli_inner_pretty.js:374939-375674)
- `buildWorkflowContext` (`H44`) — freezes `budget`, assembles the exact VM globals, applies shims (cli_inner_pretty.js:375973-375997)
- `runWorkflowScript` (`q44`) — loads journal, `runInContext` with a 30s sync timeout, abort race, return shape (cli_inner_pretty.js:376007-376061)
- `WORKFLOW_SYNC_TIMEOUT_MS` (`mP8`) — `30000` synchronous-execution timeout for the VM script (cli_inner_pretty.js:367489)
- `concurrencyLimiter` (`BiH`) — semaphore factory (`BiH(width, fn)`) used for the local/remote executors (cli_inner_pretty.js:268738-268758)
- `sandboxConsole` (`aB6`) — `console` shim routing `log/info/error/warn` into the workflow `log()` channel (cli_inner_pretty.js:371858-371874)
- `structuredClone` (`AP`) — deep-clones agent results across the VM boundary (cli_inner_pretty.js:9132-9135)

**Nested workflow**
- `createNestedWorkflowGlobal` (`QK4`) — builds the `workflow()` global; one-level nesting only (cli_inner_pretty.js:371875-371934)

**Subagent prompts / defs**
- `WORKFLOW_SUBAGENT_PROMPT` (`iG_`) — plain subagent system-prompt body (cli_inner_pretty.js:375683-375689)
- `WORKFLOW_SUBAGENT_TAIL` (`rG_`) — plain subagent prompt tail appended to a named agent's prompt (cli_inner_pretty.js:375690-375694)
- `WORKFLOW_STRUCTURED_PROMPT` (`aG_`) — StructuredOutput-forcing subagent system-prompt body (cli_inner_pretty.js:375759-375765)
- `WORKFLOW_STRUCTURED_TAIL` (`oG_`) — StructuredOutput-forcing tail appended to a named agent's prompt (cli_inner_pretty.js:375754-375758)
- `WORKFLOW_SUBAGENT_DEF` (`mp6`) — `workflow-subagent` agent def (plain) (cli_inner_pretty.js:375766-375774)
- `WORKFLOW_STRUCTURED_DEF` (`sG_`) — `workflow-subagent` agent def with the StructuredOutput body (cli_inner_pretty.js:375775)
- `STRUCTURED_OUTPUT_TOOL_NAME` (`iY`) — the string `"StructuredOutput"` (cli_inner_pretty.js:212132)
- `compileSchemaTool` (`klH`) — Ajv-validate a JSON Schema and build a StructuredOutput tool from it (cli_inner_pretty.js:212098-212103)
- `MAX_STALL_RETRIES` (`p74`) — `5` per-agent stall retries (cli_inner_pretty.js:375700)

**Coordinator (contrast)**
- `getWorkerSystemPrompt` (`ZD7`) — the coordinator-mode *worker* system prompt (cli_inner_pretty.js:236124-236162)

---

## TL;DR

A workflow script is **plain JavaScript run inside a Node `vm` context** that exposes exactly six globals
(`agent`, `parallel`, `pipeline`, `log`, `phase`, `workflow`) plus `args`, `budget`, `console`, and a pair
of sandboxed timers — and **nothing else** (no `require`, `fs`, `process`, `module`). The path is:

```
  script body  ──BP8──▶  Function() syntax pre-check  +  vm.Script("(async () => {<body>})()")
                              │
  q44 ──H44──▶  vm.createContext({ agent, parallel, pipeline, log, phase, workflow,
                                   args, budget, console, ...sandboxedTimers })
                              │  uP8(ctx): inject SZ_ shim  (Math.random/Date.now/new Date() throw)
                              │  UtH(ctx): freeze intrinsics + Error.prepareStackTrace
                              ▼
  q44: vmScript.runInContext(ctx, { timeout: 30000 })   races the abort signal
                              ▼
  agent(prompt, opts) ─▶ cap+budget gate ─▶ journal cache lookup ─▶ pick subagent def
                       ─▶ dispatch via cG_-bounded local executor C
                       ─▶ stall watchdog + up-to-5 retries + 45s throttle backoff
                       ─▶ append result to journal ─▶ return text | structured
```

Two facts the sibling docs only hint at and this one nails down:

1. **Determinism is enforced at *runtime*, not just by a regex.** `validateInput` rejects literal
   `Date.now()`/`Math.random()`/`new Date()` in the *inline* script (a static guard), but the real
   enforcement is the `SZ_` shim (cli_inner_pretty.js:367493-367513) that `uP8` runs *inside every VM
   context* — it rebinds `Math.random`, `Date.now`, and the global `Date` to throw, and closes the
   `(new Date(x)).constructor.now()` backdoor. A `name`/`scriptPath` workflow that skips the regex still
   hits the shim.
2. **`parallel()` is a barrier; `pipeline()` is per-item flow** — and that distinction lives in the **DSL
   functions** (`Promise.allSettled` shapes), *not* in the concurrency semaphores. Both route every
   `agent()` through the *same* `cG_`-bounded local executor (this corrects a prior mislabeling of
   `lG_ = 50` as a "pipeline" knob — see `gate_caps_lifecycle_relations.md` Part 3.3).

---

# A. Compile — `BP8`

**What it does:** Takes the script *body* (everything after the `meta` export, produced by `parseWorkflowMeta`/`FZ`), wraps it in an async IIFE, runs a fast syntax pre-check with `Function()`, and — if valid — compiles a `vm.Script` ready to run in a context.

```javascript
// ============================================
// compileWorkflowScript - async-IIFE wrap + Function() syntax pre-check + vm.Script
// Location: cli_inner_pretty.js:367468-367482
// ============================================

// ORIGINAL (for source lookup):
function BP8(H) {
  let $ = `(async () => {
${H}
})()`;
  try {
    return (
      Function(`async function _check() {
${H}
}`),
      { ok: !0, vmScript: new xP8.Script($, { filename: "workflow.js" }) }
    );
  } catch (q) {
    return { ok: !1, error: `SyntaxError: ${q instanceof Error ? q.message : String(q)}` };
  }
}

// READABLE (for understanding):
function compileWorkflowScript(scriptBody) {
  const wrapped = `(async () => {\n${scriptBody}\n})()`;       // top-level await works inside the IIFE
  try {
    // Cheap syntax-only pre-check: never executed, just parsed. Surfaces a clean SyntaxError early.
    Function(`async function _check() {\n${scriptBody}\n}`);
    return { ok: true, vmScript: new vm.Script(wrapped, { filename: "workflow.js" }) };
  } catch (e) {
    return { ok: false, error: `SyntaxError: ${e instanceof Error ? e.message : String(e)}` };
  }
}

// Mapping: BP8→compileWorkflowScript, H→scriptBody, $→wrapped, xP8→vm (require("vm"))
```

**How it works:**

1. **Async-IIFE wrap.** The body is wrapped in `(async () => { … })()`, so the script can use top-level
   `await` (every `agent()`/`parallel()`/`pipeline()` returns a promise) and the whole program evaluates
   to a single promise whose resolution is the workflow's return value.
2. **`Function()` syntax pre-check.** Before building the `vm.Script`, `BP8` constructs (but never calls)
   `async function _check() { <body> }` via the `Function` constructor. This parses the body in an
   *async* context and throws a `SyntaxError` for malformed code with a clean message — caught and
   returned as `{ ok:false, error:"SyntaxError: …" }`. This is why the tool's `call` can return a soft
   `error` result instead of throwing on a bad script (see `workflow_tool_definition.md` §3, §9).
3. **`vm.Script`.** On success it returns `{ ok:true, vmScript }` where `vmScript` is a compiled
   `vm.Script` tagged `filename:"workflow.js"` so stack traces read sensibly. Compilation here does *not*
   run the code — it only parses/compiles; execution happens later in `q44` via `runInContext`.

**Why a separate `Function()` check when `vm.Script` already parses?** The `vm.Script` constructor
*compiles* the wrapped IIFE; a syntax error there would surface, but the `Function()` pre-check parses
the **raw body** in an async function scope, which gives a more direct, less-wrapped error message (no
`(async () => {` line offset) and validates the exact `await`/`return`-outside-function allowances the
parser was told to permit (`FZ` parsed with `allowAwaitOutsideFunction`/`allowReturnOutsideFunction`).
Belt-and-suspenders: catch the author's mistake with the friendliest message possible.

**Cross-validation (2.1.88):** no precursor. `BP8`, the IIFE wrap, and the `vm.Script` compile are new. Confidence high.

---

# B. VM context — `H44` (and the globals it exposes)

**What it does:** Builds the sandboxed `vm` context that the compiled script runs in. It is the single
place that decides exactly which globals a workflow script can see. Everything not listed here is
unreachable from inside the script.

```javascript
// ============================================
// buildWorkflowContext - assemble the VM globals, freeze budget, apply determinism + hardening shims
// Location: cli_inner_pretty.js:375973-375997
// ============================================

// ORIGINAL (for source lookup):
function H44(H, $, q, K, _, z, A, Y, f, O) {
  let M = g74(H, $, q, K, _, A, Y, f, O),
    j = aB6((P) => q({ type: "progress", toolUseID: "workflow_log", data: { type: "workflow_log", message: P } })),
    w = Object.freeze({
      total: Y?.total ?? null,
      spent: xE(() => Y?.getTurnSpent() ?? 0),
      remaining: xE(() => (Y?.total == null ? 1 / 0 : Math.max(0, Y.total - Y.getTurnSpent()))),
    }),
    D = H.abortController?.signal,
    J = xK4(D),
    X = QK4({ hooks: M, budget: w, abortSignal: D, timers: J, resolveWorkflow: AT$, getAllWorkflows: _LH }),
    L = e74.createContext({
      agent: M.agent, parallel: M.parallel, pipeline: M.pipeline, log: M.log, phase: M.phase,
      workflow: X, args: z, budget: w, console: j, ...J,
    });
  return (uP8(L), UtH(L), M.bindVMAwait(uK4(L)), { vmContext: L, hooks: M });
}

// READABLE (for understanding):
function buildWorkflowContext(toolCtx, canUseTool, onProgress, runId, onAgentController,
                              args, seedPhaseTitles, tokenBudget, journal, journalIndex) {
  const hooks = makeWorkflowHooks(toolCtx, canUseTool, onProgress, runId, onAgentController,
                                  args, seedPhaseTitles, tokenBudget, journal, journalIndex);
  const console = sandboxConsole((msg) =>                       // console.* → workflow_log progress
    onProgress({ type: "progress", toolUseID: "workflow_log", data: { type: "workflow_log", message: msg } }));
  const budget = Object.freeze({                                // frozen so a script can't fake spend
    total: tokenBudget?.total ?? null,
    spent: () => tokenBudget?.getTurnSpent() ?? 0,
    remaining: () => (tokenBudget?.total == null ? Infinity : Math.max(0, tokenBudget.total - tokenBudget.getTurnSpent())),
  });
  const abortSignal = toolCtx.abortController?.signal;
  const timers = makeSandboxedTimers(abortSignal);             // abort-aware setTimeout/clearTimeout
  const workflow = createNestedWorkflowGlobal({ hooks, budget, abortSignal, timers,
                                                resolveWorkflow, getAllWorkflows });
  const ctx = vm.createContext({
    agent: hooks.agent, parallel: hooks.parallel, pipeline: hooks.pipeline,
    log: hooks.log, phase: hooks.phase, workflow, args, budget, console, ...timers,
  });
  runDeterminismShim(ctx);                                     // uP8: SZ_ → Math.random/Date.now throw
  hardenVMIntrinsics(ctx);                                     // UtH: freeze intrinsics, prepareStackTrace
  hooks.bindVMAwait(vmAwaitBridge(ctx));                       // uK4: in-sandbox await
  return { vmContext: ctx, hooks };
}

// Mapping: H44→buildWorkflowContext, g74→makeWorkflowHooks, aB6→sandboxConsole, w→budget(frozen),
//          xK4→makeSandboxedTimers, QK4→createNestedWorkflowGlobal, e74→vm, uP8→runDeterminismShim,
//          UtH→hardenVMIntrinsics, uK4→vmAwaitBridge, AT$→resolveWorkflow, _LH→getAllWorkflows
```

**The complete global surface (cli_inner_pretty.js:375985-375995):** `agent`, `parallel`, `pipeline`,
`log`, `phase`, `workflow`, `args`, `budget`, `console`, and `...timers` (the sandboxed `setTimeout`/
`clearTimeout` from `xK4`). That is the *entire* visible surface. There is **no `require`, `fs`,
`process`, `module`, `import`, `Buffer`, or network primitive** — a workflow can orchestrate agents and
do pure computation, but it cannot touch the filesystem, spawn processes, or open sockets directly. All
side effects must go through `agent()` (which runs a sandboxed subagent under the normal tool-permission
system).

**Why `vm.createContext` and not a Worker/child process:** the workflow body is *the model's* code, run
in the user's session with the user's permissions but on a hot path that needs to share the live agent
runtime, journal, and progress stream. A `vm` context gives a cheap, in-process isolated global scope
where the team can hand-pick the exact globals — and then *harden* them (next section) — without the IPC
cost or lifecycle complexity of a worker thread.

**The frozen `budget` global (cli_inner_pretty.js:375976-375980):** `Object.freeze` makes `budget`
tamper-proof from the script. `budget.total` is the run's output-token ceiling (or `null`), `budget.spent()`
reads live turn spend, and `budget.remaining()` returns `Infinity` when `total` is `null`. That `Infinity`
return is the precise footgun the agent-cap diagnostic warns about — see §E.

---

# C. Runner — `q44`

**What it does:** Drives one workflow run end-to-end: load the resume journal, build the context, run the
compiled script with a synchronous timeout, race it against the abort signal, and return a structured
result (or a soft `error`).

```javascript
// ============================================
// runWorkflowScript - load journal, runInContext with 30s timeout, abort race, normalized return
// Location: cli_inner_pretty.js:376007-376061
// ============================================

// ORIGINAL (for source lookup):
async function q44(H, $, q, K = {}) {
  let _ = Date.now(), z = [],
    A = (j) => {
      if (j.type === "progress" && j.data.type === "workflow_log" && z.length < H0_) z.push(j.data.message);
      K.onProgress?.(j);
    },
    Y = K.journal ? await K.journal.load() : void 0,
    f = H44($, q, A, K.workflowRunId, K.onAgentController, K.args, K.seedPhaseTitles, K.tokenBudget, K.journal, Y),
    O = $.abortController?.signal, M;
  try {
    let j = H.runInContext(f.vmContext, { timeout: K.syncTimeoutMs ?? mP8 }), w = Promise.resolve(j);
    w.catch(() => {});
    let D = O
      ? await Promise.race([ w, new Promise((X, L) => {
          let P = () => L(Error("Workflow aborted"));
          if (O.aborted) P(); else (O.addEventListener("abort", P), (M = () => O.removeEventListener("abort", P)));
        }) ])
      : await w,
      J = AP(D);
    return (IH(J), { result: J, agentCount: f.hooks.getAgentCount(), logs: z,
                     failures: f.hooks.getFailures(), durationMs: Date.now() - _ });
  } catch (j) {
    if (j instanceof Error && j.stack) N(`Workflow script error stack trace:\n${j.stack}`, { level: "error" });
    return { result: null, agentCount: f.hooks.getAgentCount(), logs: z,
             failures: f.hooks.getFailures(), durationMs: Date.now() - _, error: wZH(j) };
  } finally { M?.(); }
}

// READABLE (for understanding):
async function runWorkflowScript(vmScript, toolCtx, canUseTool, opts = {}) {
  const startMs = Date.now(), logs = [];
  const onProgress = (ev) => {
    if (ev.type === "progress" && ev.data.type === "workflow_log" && logs.length < WORKFLOW_LOG_CAP) // 1000
      logs.push(ev.data.message);
    opts.onProgress?.(ev);
  };
  const journalIndex = opts.journal ? await opts.journal.load() : undefined;     // resume cache
  const built = buildWorkflowContext(toolCtx, canUseTool, onProgress, opts.workflowRunId,
    opts.onAgentController, opts.args, opts.seedPhaseTitles, opts.tokenBudget, opts.journal, journalIndex);
  const abortSignal = toolCtx.abortController?.signal;
  let removeAbortListener;
  try {
    // The script's TOP-LEVEL (synchronous) execution is bounded to 30s; awaited agent work runs after.
    const scriptPromise = Promise.resolve(vmScript.runInContext(built.vmContext, { timeout: opts.syncTimeoutMs ?? WORKFLOW_SYNC_TIMEOUT_MS }));
    scriptPromise.catch(() => {});
    const raw = abortSignal
      ? await Promise.race([scriptPromise, abortRejection(abortSignal, (off) => { removeAbortListener = off; })])
      : await scriptPromise;
    const result = structuredClone(raw);                       // copy out of the sandbox
    serializeCheck(result);                                     // IH(): ensure JSON-serializable
    return { result, agentCount: built.hooks.getAgentCount(), logs,
             failures: built.hooks.getFailures(), durationMs: Date.now() - startMs };
  } catch (e) {
    if (e instanceof Error && e.stack) logError(`Workflow script error stack trace:\n${e.stack}`);
    return { result: null, agentCount: built.hooks.getAgentCount(), logs,
             failures: built.hooks.getFailures(), durationMs: Date.now() - startMs, error: formatError(e) };
  } finally { removeAbortListener?.(); }
}

// Mapping: q44→runWorkflowScript, H→vmScript, $→toolCtx, q→canUseTool, K→opts, z→logs,
//          mP8→WORKFLOW_SYNC_TIMEOUT_MS (30000), H0_→WORKFLOW_LOG_CAP (1000), AP→structuredClone,
//          IH→serializeCheck/stringify, wZH→formatError, N→logError, H44→buildWorkflowContext
```

**How it works:**

1. **Journal load.** If a `journal` was supplied (resume), `journal.load()` folds the JSONL into the
   `{results, started}` index (`x74`) up front, so the first `agent()` calls can hit the cache (see
   `gate_caps_lifecycle_relations.md` Part 4).
2. **Log capture.** `onProgress` mirrors `workflow_log` messages into a `logs` array capped at
   `H0_ = 1000` lines (declared at cli_inner_pretty.js:376062, enforced by the `logs.length < H0_` guard
   at 376011), then forwards every event to the caller's `onProgress` (the 16ms-batched UI flush).
3. **Run with a 30s sync timeout.** `vmScript.runInContext(ctx, { timeout: mP8 })` (cli_inner_pretty.js:376019,
   `mP8 = 30000` at 367489) bounds the *synchronous* portion of the script. This is important: Node's
   `vm` `timeout` only covers synchronous execution, so it catches a script that spins the CPU at the top
   level (`while(true){}`) but **not** the awaited agent work — that is bounded separately by the agent
   cap, token budget, and per-agent stall timeout (§E and `gate_caps` Part 3).
4. **Abort race.** When there is an abort signal, the script promise is `Promise.race`d against a promise
   that rejects with `Workflow aborted` on abort, so `TaskStop`/cancellation unwinds the run promptly. The
   listener is removed in `finally`.
5. **Copy out of the sandbox.** The resolved value is `structuredClone`d (`AP`, cli_inner_pretty.js:9132)
   so the returned object is a plain host-realm value with no live references into the VM context, then
   `IH(result)` (stringify) acts as a serializability check.
6. **Normalized return.** Success → `{ result, agentCount, logs, failures, durationMs }`. Any throw →
   the *same shape* with `result:null` and `error` set (after logging the stack). This is why the tool is
   fire-and-forget at the result layer: even a runtime crash becomes a structured failure, not an
   exception that escapes the background task.

**Key insight — three timeouts, three scopes.** The 30s `mP8` timeout guards *synchronous CPU spin*;
the per-agent `tG_ = 180000` stall watchdog guards *a single hung subagent*; and the `F74 = 1000` agent
cap + token budget guard *unbounded fan-out*. They are deliberately layered because a `vm` `timeout`
alone is blind to async work — a workflow that `await`s 1000 slow agents is perfectly legitimate and must
not be killed at 30 seconds.

---

# D. DSL primitive semantics (the part the description only *names*)

All six primitives are closures built by `makeWorkflowHooks` (`g74`, cli_inner_pretty.js:374939) and
returned as the object at cli_inner_pretty.js:375658-375673 (`{ agent: B, parallel: Q, pipeline: g,
log: l, phase: I, … }`). Inside `g74`: `O` is the lifetime agent counter, `M` is the VM-await wrapper
(bound late via `bindVMAwait`/`uK4` so awaits resolve *inside* the sandbox realm), `W()`/`G()` are the
cap/budget gates (cli_inner_pretty.js:374969/374974), `h()` is the phase-index allocator (374985), and
two semaphores are created: `C = BiH(cG_, R)` for the **local** agent executor `R` (375001) and
`b = BiH(lG_, U)` for the **remote** executor `U` (375002).

## D.1 `agent(prompt, opts)` — the per-call pipeline (`B`)

`agent()` is the closure `B` (cli_inner_pretty.js:375003-375108). Every call runs this pipeline:

```javascript
// ============================================
// agent (closure B) - one agent() call: cap/budget gate → journal cache → dispatch → journal append
// Location: cli_inner_pretty.js:375003-375108
// ============================================

// ORIGINAL (for source lookup):
B = xE(async (c, r) => {
  if (S.abortController?.signal.aborted) return new Promise(() => {});
  try { (W(), G()); } catch (MH) { throw (await g8(0), MH); }      // cap + budget gate
  let a = ++O,                                                      // mint a lifetime index
    o = String(c),
    $H = r?.label != null ? String(r.label) : o.slice(0, 60)…,      // label (display)
    HH = r?.phase != null ? String(r.phase) : v,                    // phase (current)
    e = HH != null ? h(HH) : void 0,
    DH = r?.stallMs != null ? Number(r.stallMs) : tG_,              // stall timeout (default 180s)
    …;
  if (Y) { /* journal cache lookup → return cached AP(result) with cached:true, or set w=true on first miss */ }
  …
  if (r?.isolation === "remote") throw Error("agent({isolation:'remote'}) is not available in this build");
  JH();                                                             // emit "start" progress
  try { return await qH(await C(a, o, $H, HH, e, DH, r, fH, YH)); } // dispatch via local executor C
  catch (MH) { /* emit "error" progress */ throw MH; }
});

// READABLE (for understanding):
const agent = vmFn(async (prompt, opts) => {
  if (toolCtx.abortController?.signal.aborted) return new Promise(() => {});   // never resolve after abort
  try { enforceAgentCap(); enforceTokenBudget(); } catch (e) { await yieldMicrotask(); throw e; }
  const index = ++agentCount;                                       // lifetime counter feeds the 1000 cap
  const phaseTitle = opts?.phase ?? currentPhase;
  const stallMs = opts?.stallMs != null ? Number(opts.stallMs) : WORKFLOW_STALL_MS_DEFAULT;  // 180000
  if (journalIndex) {
    cacheKey = journalKey(prompt, opts, phaseTitle);
    const cached = passedCachedPrefix ? undefined : journalIndex.results.get(cacheKey);
    if (cached !== undefined) { emitProgress({ cached:true, state:"done", … }); return clone(cached.result); }
    passedCachedPrefix = true;                                       // first miss → everything after runs live
    const priorStarts = journalIndex.started.get(cacheKey);
    if (priorStarts?.length) logEvent("tengu_workflow_journal_started_hit_respawn", { attempts: priorStarts.length });
  }
  if (opts?.isolation === "remote") throw Error("agent({isolation:'remote'}) is not available in this build");
  emitStartProgress();
  try { return await journalAppendResult(await localExecutor(index, prompt, label, phaseTitle, …, stallMs, opts, …)); }
  catch (e) { emitErrorProgress(e); throw e; }
});

// Mapping: B→agent, c→prompt, r→opts, O→agentCount, W→enforceAgentCap, G→enforceTokenBudget,
//          tG_→WORKFLOW_STALL_MS_DEFAULT, Y→journalIndex, w→passedCachedPrefix, C→localExecutor (BiH(cG_,R))
```

The local executor `R` (wrapped as `C = BiH(cG_, R)`, cli_inner_pretty.js:375109-375487) is where the
heavy lifting happens, in this order:

1. **Subagent selection (cli_inner_pretty.js:375113-375146).** If `opts.agentType` is set, it resolves
   that named agent from `activeAgents`, enforcing the `sq` (SpawnAgent) permission rule and appending
   the workflow tail (`oG_` if a schema is present, else `rG_`) to its system prompt. Otherwise it falls
   back to the built-in def: `let AH = KH ?? (_H ? sG_ : mp6)` (cli_inner_pretty.js:375146) — i.e. the
   StructuredOutput def `sG_` when a `schema` was supplied (`_H`), else the plain def `mp6` (see §F).
2. **StructuredOutput tool injection (cli_inner_pretty.js:375141-375152).** If `opts.schema` is set,
   `klH(schema)` (cli_inner_pretty.js:212098) Ajv-validates it and compiles a `StructuredOutput` tool;
   that tool is spliced into the subagent's `availableTools` (`wH`, 375152), and the agent def's tool
   list is widened to include `iY` (375132-375135).
3. **Worktree isolation (cli_inner_pretty.js:375155-375165).** `opts.isolation === "worktree"` allocates
   a git worktree via the width-1 semaphore `L = BiH(1, fSH)` (so worktree creation is serialized,
   cli_inner_pretty.js:374947) and prepends a "you are in an isolated worktree" note to the prompt.
4. **Dispatch + stall watchdog (cli_inner_pretty.js:375203-375276).** It opens an `AbortController`
   chained to the run's signal, arms a watchdog `F$` that calls `signal.abort("stalled")` after `stallMs`
   with no progress (cli_inner_pretty.js:375211-375212), throttles progress-driven watchdog resets to at
   most every `min(stallMs*0.1, 1000)` ms (`v$`, 375210), and streams the subagent's query loop via `WS`
   (cli_inner_pretty.js:375246), counting tokens/tool-calls and tracking StructuredOutput attempts.
5. **Throttle backoff (cli_inner_pretty.js:375390-375427).** After the first attempt, a heuristic `FH`
   detects an apparently *rate-limited* response (no `stop_reason`, `< 50` output tokens, took longer than
   `stallMs*0.5`); if so it logs "sleeping 45s before retry", sleeps 45 000 ms, and retries once.
6. **Stall retries (cli_inner_pretty.js:375429-375469).** While the result is `stalled` and not throttled,
   it retries up to `p74 = 5` times (cli_inner_pretty.js:375700). After exhaustion it throws a precise
   diagnostic — `agent stalled on all N attempts…`, `agent abandoned…`, or `agent abandoned: user
   requested retry on all N attempts` (375463-375468). A user-skip returns `null` (375453).
7. **Result + journal append (cli_inner_pretty.js:375471-375478, 375056-375062).** For schema agents,
   missing structured output after the nudges throws (375472-375475); otherwise it returns the structured
   object (`AP(_$.structured)`) or the joined text (`_$.text`). On the way out, `qH` appends a
   `{type:"result", key, result}` line to the journal so a later resume can replay it as a cache hit.

**`agent({isolation:'remote'})` is disabled in this build.** The remote branch throws
`agent({isolation:'remote'}) is not available in this build` (cli_inner_pretty.js:375083) *before* the
remote executor `U`/`b` is ever reached. The full remote-session machinery (`U`, cli_inner_pretty.js:375493-375597,
using `_l`/`Ip6` to drive a CCR remote session) is present but dead-code-gated in 2.1.156 — which is why
`lG_ = 50`, the *remote* semaphore width, has no observable effect (see the correction in `gate_caps`
Part 3.3).

## D.2 `parallel(funcs)` vs `pipeline(items, …stages)` — the real barrier distinction

This is the heart of the description's "pipeline-vs-parallel" guidance, and the distinction is purely a
matter of **which `Promise.allSettled` shape the DSL function builds** — *not* the concurrency semaphore
(both ultimately dispatch each `agent()` through the same `cG_`-bounded local executor `C`).

```javascript
// ============================================
// parallel (Q) vs pipeline (g) - barrier-over-functions vs per-item stage flow
// Location: cli_inner_pretty.js:375598-375657
// ============================================

// ORIGINAL (for source lookup):
let Q = xE(async (c) => {                                            // parallel(funcs)
  if (S.abortController?.signal.aborted) return new Promise(() => {});
  if ((await g8(0), !Array.isArray(c))) throw TypeError("parallel() expects an array of functions");
  if (c.length === 0) return [];
  (W(), G());
  for (let $H of c)
    if (typeof $H !== "function")
      throw TypeError("parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)");
  let r = await Promise.allSettled(c.map(($H) => M($H()))),          // call ALL funcs now, await all
    a = 0,
    o = r.map(($H, HH) => { if ($H.status === "fulfilled") return $H.value;
      if ($H.reason instanceof fW8) return (a++, null);              // budget-exceeded → null (dropped)
      /* else record failure, return null */ });
  if (a > 0) X.push(`parallel: ${a} ${N8(a, "slot")} dropped — token budget exceeded`);
  return o;
});
g = xE(async (c, ...r) => {                                          // pipeline(items, ...stages)
  if (S.abortController?.signal.aborted) return new Promise(() => {});
  if ((await g8(0), !Array.isArray(c))) throw TypeError("pipeline() expects an array as the first argument");
  if (c.length === 0) return [];
  (W(), G());
  for (let HH of r) if (typeof HH !== "function") throw TypeError("pipeline() stages must be functions: …");
  let a = await Promise.allSettled(
      c.map(async (HH, e) => {                                       // EACH item flows through ALL stages
        let DH = HH;
        for (let zH of r) { if (DH === null) break; DH = await M(zH(DH, HH, e)); }
        return DH;
      }),
    ), …;
  return $H;
});

// READABLE (for understanding):
const parallel = vmFn(async (funcs) => {
  assertArray(funcs, "parallel() expects an array of functions");
  enforceAgentCap(); enforceTokenBudget();
  for (const f of funcs)
    if (typeof f !== "function")
      throw TypeError("parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)");
  // BARRIER: invoke every function immediately, await all of them. Caller resumes only when ALL settle.
  const settled = await Promise.allSettled(funcs.map((f) => vmAwait(f())));
  return settled.map((s) => s.status === "fulfilled" ? s.value
                                                      : (s.reason instanceof BudgetExceeded ? null : recordAndNull(s.reason)));
});
const pipeline = vmFn(async (items, ...stages) => {
  assertArray(items, "pipeline() expects an array as the first argument");
  enforceAgentCap(); enforceTokenBudget();
  for (const stage of stages) if (typeof stage !== "function") throw TypeError("pipeline() stages must be functions: …");
  // PER-ITEM FLOW: each item independently threads through all stages; items do NOT wait for each other.
  const settled = await Promise.allSettled(items.map(async (item, i) => {
    let value = item;
    for (const stage of stages) { if (value === null) break; value = await vmAwait(stage(value, item, i)); }
    return value;
  }));
  return settled.map((s) => s.status === "fulfilled" ? s.value : (s.reason instanceof BudgetExceeded ? null : recordAndNull(s.reason)));
});

// Mapping: Q→parallel, g→pipeline, M→vmAwait, fW8→BudgetExceeded, X→failures, W/G→cap/budget gates
```

**The distinction, precisely:**

- **`parallel(funcs)` is a synchronization barrier (cli_inner_pretty.js:375606).** It calls *every*
  function in the array immediately (`funcs.map(f => M(f()))`) and then a single `Promise.allSettled`
  waits for *all* of them. The caller does not advance until the slowest one finishes. This is exactly
  why the description says to use `parallel()` only when a downstream stage genuinely needs *all* prior
  results. Note the explicit `TypeError` guard at 375604-375605: the argument must be an array of
  **functions** (`() => agent(...)`), not already-started promises — because the barrier is over the
  *function invocations*, and passing promises would start them before the budget/cap gate runs.

- **`pipeline(items, ...stages)` is per-item flow (cli_inner_pretty.js:375630-375638).** Each *item*
  independently runs through every stage (`for (stage of stages) value = await stage(value, item, i)`),
  and `Promise.allSettled` runs all items' flows concurrently. There is **no cross-item barrier**: item 3
  can be on stage 2 while item 7 is still on stage 1. A stage returning `null` short-circuits the rest of
  that item's flow (375634). Stages receive `(value, originalItem, index)`.

- **Both share the same concurrency budget.** Whether an `agent()` call originates from a `parallel()`
  func or a `pipeline()` stage, it goes through the *same* `cG_`-bounded local executor `C` — so total
  in-flight agents are bounded identically. The "barrier vs no-barrier" difference is about *scheduling
  shape* (when the caller resumes), not about parallelism width.

**Budget-drop handling (375610/375619, 375643/375652).** When a func/stage rejects with the budget error
(`fW8`), the result slot becomes `null` and a `parallel: N slots dropped` / `pipeline: N slots dropped`
note is recorded — so a budget overrun degrades gracefully (the array keeps its shape, dropped entries are
`null`) instead of failing the whole call.

## D.3 `phase(title)` and `log(message)` — `I` and `l`

`phase(title)` is the closure `I` (cli_inner_pretty.js:374998-375000): it sets the *current* phase `v`
and calls the phase allocator `h(title)` (374985), which mints a stable index for the title and emits a
`workflow_phase` progress event the first time it sees that title. Subsequent `agent()` calls inherit the
current phase, so the UI can group agents under their phase. Seed phase titles (from `meta.phases`) are
pre-registered in the loop at 374997.

`log(message)` is the closure `l` (cli_inner_pretty.js:375655-375657): it emits a single `workflow_log`
progress event with `String(message)`. The sandboxed `console` (`aB6`, cli_inner_pretty.js:371858) routes
`console.log/info/debug/error/warn` into the same `workflow_log` channel (with `[error]`/`[warn]`
prefixes), so a script's `console.log` and `log()` land in the same place — and both are captured into
the `q44` `logs` array up to the `H0_ = 1000` cap.

## D.4 `workflow(name | {scriptPath})` — nested workflows, one level only (`QK4`)

`createNestedWorkflowGlobal` (`QK4`, cli_inner_pretty.js:371875-371934) builds the `workflow()` global
that the parent context exposes. It runs a *child* workflow by name or by file path, sharing the parent's
agent/parallel/pipeline/budget hooks but giving the child a scoped log prefix and a no-op `phase()`.

```javascript
// ============================================
// createNestedWorkflowGlobal - run a child workflow; hard-reject nesting beyond one level
// Location: cli_inner_pretty.js:371875-371934
// ============================================

// ORIGINAL (for source lookup):
function QK4(H) {
  let $ = new Map(),
    q = { parallel: H.hooks.parallel, pipeline: H.hooks.pipeline, budget: H.budget,
      workflow: xE(() => Promise.reject(Error(
        "workflow() cannot be called from within a child workflow — nesting is limited to one level. Inline the inner script or call its agents directly."))),
      ...H.timers };
  return xE(async function (_, z) {
    if (H.abortSignal?.aborted) return new Promise(() => {});
    let A, Y;
    if (typeof _ === "string") { let D = await H.resolveWorkflow(_, C$()); … let J = FZ(D.script); …(Y=D.name, A=J.scriptBody); }
    else if (_ && typeof _ === "object" && "scriptPath" in _ …) { let D = await Hj$(_.scriptPath); … let J = FZ(D.script); …(Y=J.meta.name, A=J.scriptBody); }
    else throw TypeError("workflow() expects a workflow name (string) or {scriptPath: string}");
    let f = BP8(A);
    if (!f.ok) throw Error(`workflow('${Y}'): ${f.error}`);
    …
    let j = `[${Y}] `,
      w = { ...q, agent: xE((D, J) => H.hooks.agent(D, { ...J, phase: M })),
            phase: xE((D) => {}),                                    // child phase() is a no-op
            log: xE((D) => H.hooks.log(j + String(D))),
            console: aB6((D) => H.hooks.log(j + D)),
            args: z };
    try {
      let D = FK4.createContext(w); (uP8(D), UtH(D));
      let J = await f.vmScript.runInContext(D, { timeout: mP8 }), X = AP(J);
      return (H.hooks.log(`${bGH} ${Y} done`), X);
    } catch (D) { let J = wZH(D); throw (H.hooks.recordFailure(`${M}: ${J}`), …, D); }
  });
}

// READABLE (for understanding):
function createNestedWorkflowGlobal(parent) {
  const runCounts = new Map();
  const childShared = {
    parallel: parent.hooks.parallel, pipeline: parent.hooks.pipeline, budget: parent.budget,
    workflow: () => Promise.reject(Error("workflow() cannot be called from within a child workflow — nesting is limited to one level. …")),
    ...parent.timers,
  };
  return async (nameOrSpec, childArgs) => {
    if (parent.abortSignal?.aborted) return neverResolves();
    let scriptBody, name;
    if (typeof nameOrSpec === "string") { const def = await parent.resolveWorkflow(nameOrSpec, cwd()); … ({name, scriptBody} = parseAndSplit(def.script)); }
    else if (isScriptPathSpec(nameOrSpec)) { const file = await readWorkflowScriptFile(nameOrSpec.scriptPath); … ({name, scriptBody} = parseAndSplit(file.script)); }
    else throw TypeError("workflow() expects a workflow name (string) or {scriptPath: string}");
    const compiled = compileWorkflowScript(scriptBody);
    if (!compiled.ok) throw Error(`workflow('${name}'): ${compiled.error}`);
    const phaseLabel = `${PREFIX} ${name}${dedupeSuffix(runCounts, name)}`;
    const prefix = `[${name}] `;
    const childCtx = vm.createContext({
      ...childShared,
      agent: (p, o) => parent.hooks.agent(p, { ...o, phase: phaseLabel }),   // child agents share parent dispatch + cap
      phase: () => {},                                                       // child phase() does nothing
      log: (m) => parent.hooks.log(prefix + String(m)),
      console: sandboxConsole((m) => parent.hooks.log(prefix + m)),
      args: childArgs,
    });
    runDeterminismShim(childCtx); hardenVMIntrinsics(childCtx);
    try {
      const raw = await compiled.vmScript.runInContext(childCtx, { timeout: WORKFLOW_SYNC_TIMEOUT_MS });
      return structuredClone(raw);
    } catch (e) { parent.hooks.recordFailure(`${phaseLabel}: ${formatError(e)}`); throw e; }
  };
}

// Mapping: QK4→createNestedWorkflowGlobal, FZ→parseWorkflowMeta, Hj$→readWorkflowScriptFile,
//          BP8→compileWorkflowScript, FK4→vm, uP8→runDeterminismShim, UtH→hardenVMIntrinsics, mP8→WORKFLOW_SYNC_TIMEOUT_MS
```

**How it works:**

1. **Resolve.** `workflow("name")` resolves the saved workflow via `resolveWorkflow` (`AT$`,
   cli_inner_pretty.js:371894, listing available names on miss); `workflow({scriptPath})` reads the file
   via `readWorkflowScriptFile` (`Hj$`, cli_inner_pretty.js:371903, with the same UNC/size guards as the
   top-level path). Both then `FZ`-parse + `BP8`-compile the child (371899/371905, 371909).
2. **Fresh sandboxed child context.** A new `vm.createContext` (371925) is hardened with the *same*
   `uP8`/`UtH` shims as the parent — so the child is just as deterministic and isolated.
3. **Shared parent hooks, scoped overrides.** The child's `agent`/`parallel`/`pipeline`/`budget` are the
   *parent's* (so the global agent cap and token budget span parent + children), but the child gets a
   `[name] ` log prefix, a **no-op `phase()`** (371919 — child phases don't fragment the parent's phase
   tree), and its own `args` (the second arg to `workflow()`).
4. **One-level hard limit.** The child context's own `workflow` is a function that *always rejects* with
   "workflow() cannot be called from within a child workflow — nesting is limited to one level. Inline
   the inner script or call its agents directly." (cli_inner_pretty.js:371882-371887). A grandchild call
   is impossible by construction.

**Why one level:** nesting is a real footgun for the agent cap and the journal cache key (a deeply nested
call tree makes the longest-unchanged-prefix replay semantics ambiguous). Capping at one level keeps the
mental model and the resume guarantees simple: a parent may compose saved sub-workflows, but the tree is
always at most two deep.

## D.5 `args` and `budget` globals

`args` is the value passed verbatim into the context as `z` (cli_inner_pretty.js:375991 `args: z`,
sourced from `q44`'s `opts.args`), which traces back to the tool input's `args: z.unknown()` passthrough
(see `workflow_tool_definition.md` §3). It is *not* JSON-re-encoded — exactly why the input-schema
`.describe()` warns against stringifying arrays/objects (a stringified list breaks `args.filter`/`map`).

`budget` is the **frozen** object built in `H44` (cli_inner_pretty.js:375976-375980):
- `budget.total` — the run's output-token ceiling, or `null` (375977).
- `budget.spent` — `tokenBudget.getTurnSpent()` (375978).
- `budget.remaining()` — `Math.max(0, total - spent)`, **but `Infinity` when `total == null`** (375979).

That `remaining() → Infinity` when no budget is set is the precise footgun the agent-cap diagnostic `nG_`
(cli_inner_pretty.js:375736-375739) warns about: a `while (budget.remaining() > 0) { await agent(...) }`
loop with no budget set never terminates on its own — so the `F74 = 1000` agent cap is the backstop that
turns that infinite loop into a clean `WorkflowAgentCapError` with an actionable message. This closes the
loop between the cap (documented in `gate_caps` Part 3.1) and the `budget` global that triggers it.

---

# E. Determinism — defense in depth (the runtime shim, not just the regex)

Determinism is non-negotiable for workflows because **resume replays cached `agent()` results keyed on a
hash of `(phase, prompt, opts)`** — if the script's control flow depended on wall-clock time or
randomness, the replayed run would diverge from the original and the cache would be wrong. The codebase
enforces this in *three* layers; the sibling docs only covered the first.

**Layer 1 — static regex (already documented).** `validateInput` runs
`/\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)/` on the inline script body and
rejects with errorCode 4 (see `workflow_tool_definition.md` §6, `gate_caps` Part 4.1). This is a *static*
guard, and it only runs for `H.script` (inline) — not for `name`/`scriptPath` workflows.

**Layer 2 — runtime shim `SZ_` via `uP8` (the real enforcement, previously undocumented).** Every VM
context — top-level *and* every nested child — has the `SZ_` program run inside it by `uP8`
(`vm.runInContext(SZ_, ctx)`, cli_inner_pretty.js:367442-367444). This is what actually makes a
`name`/`scriptPath` workflow deterministic even though the regex never saw it.

```javascript
// ============================================
// DETERMINISM_SHIM (SZ_) - in-VM program that makes Math.random/Date.now/new Date() throw
// Location: cli_inner_pretty.js:367493-367513 (run by uP8 at 367442)
// ============================================

// ORIGINAL (for source lookup):
SZ_ = `(() => {
  const NOW_ERR = ${IH(yZ_)};
  const RANDOM_ERR = ${IH(hZ_)};
  Math.random = function random() { throw new Error(RANDOM_ERR) };
  const RealDate = Date;
  RealDate.now = function now() { throw new Error(NOW_ERR) };
  function ShimDate(...a) {
    if (!new.target) throw new Error(NOW_ERR);          // bare Date() → now-string
    if (a.length === 0) throw new Error(NOW_ERR);       // new Date() with no args → now
    return Reflect.construct(RealDate, a, new.target);  // new Date(2020, 0, 1) is fine
  }
  ShimDate.now = RealDate.now; ShimDate.parse = RealDate.parse; ShimDate.UTC = RealDate.UTC;
  ShimDate.prototype = RealDate.prototype;
  RealDate.prototype.constructor = ShimDate;            // close (new Date(x)).constructor.now() backdoor
  Object.freeze(RealDate);
  globalThis.Date = ShimDate;
})()`;

// READABLE (for understanding):
// Conceptual — the value IS the program; it runs once inside each fresh VM context.
//  • Math.random()           → throws RANDOM_ERR (hZ_)
//  • Date.now()              → throws NOW_ERR    (yZ_)
//  • Date()      (no `new`)  → throws NOW_ERR
//  • new Date()  (no args)   → throws NOW_ERR
//  • new Date(2020, 0, 1)    → ALLOWED (explicit args are deterministic)
//  • (new Date(x)).constructor.now()  → throws  (constructor repointed at the shim, RealDate frozen)

// Mapping: SZ_→DETERMINISM_SHIM, uP8→runDeterminismShim, yZ_→DATE_ERROR_MESSAGE, hZ_→RANDOM_ERROR_MESSAGE
```

The shim is surgical: it forbids the *nondeterministic* surfaces (`Math.random`, `Date.now`, argless
`new Date()`, bare `Date()`) while still allowing *deterministic* date construction (`new Date(2020,0,1)`,
`new Date(args.timestamp)`). The user-facing error messages `yZ_` (cli_inner_pretty.js:367484) and `hZ_`
(367486) even coach the author toward the deterministic alternative ("Stamp results after the workflow
returns, or pass timestamps via `args`"; "include the index in the agent label or prompt"). The
`RealDate.prototype.constructor = ShimDate` + `Object.freeze(RealDate)` pair (367510-367511) closes the
classic escape hatch where a script grabs `RealDate` back via `(new Date(x)).constructor`.

**Layer 3 — intrinsic hardening + isolation (`UtH`, the no-API context).** `hardenVMIntrinsics` (`UtH`,
cli_inner_pretty.js:367515-367582) runs after the shim and (a) makes `Error.prepareStackTrace` a frozen
no-op accessor (so stack traces can't leak host paths or be hijacked), (b) `delete`s `globalThis.ShadowRealm`
and `globalThis.WebAssembly` (367522-367523), and (c) `Object.freeze`s the prototype chains of the core
intrinsics (Object/Array/Function/Error/typed-arrays/Map/Set/etc., 367553-367566) — using an SES-style
"enable-property-override" trick (367529-367552) so that freezing doesn't break legitimate
`this.name = "X"` writes in `Error` subclass constructors. Combined with the deliberately tiny global
surface from §B (no `require`/`fs`/`process`/`module`), the workflow runs in a context where the *only*
side-effecting capability is `agent()` — which itself runs under the normal tool-permission system.

**Why three layers:** the regex gives the model an *early, friendly* rejection for the common inline
mistake (errorCode 4 with a clear message at submit time); the shim is the *actual* security/correctness
boundary that catches everything the regex can't (named/path workflows, obfuscated `Date["now"]()`,
runtime-computed access); and the intrinsic hardening closes the escape hatches that would let a clever
script reach back to the real `Date`/`Math` or to host capabilities. This is the single biggest depth
gap the earlier docs had — they leaned on the regex alone, which is only the friendly front door.

**Cross-validation (2.1.88):** no precursor. `SZ_`, `uP8`, `UtH`, and the whole VM-sandbox model are new. Confidence high.

---

# F. Workflow subagent system prompts + StructuredOutput forcing

A workflow `agent()` call spawns a **subagent** whose system prompt and agent definition are chosen by
whether the call requested a `schema`. There are two prompt *bodies* (used for the built-in
`workflow-subagent` def) and two prompt *tails* (appended to a *named* agent's own prompt so it still
behaves like a workflow subagent).

## F.1 The four prompt strings

```javascript
// ============================================
// Workflow subagent prompts - plain body/tail + StructuredOutput body/tail
// Location: cli_inner_pretty.js:375683-375694 (plain), 375754-375765 (structured)
// ============================================

// ORIGINAL (for source lookup):
iG_ = `You are a subagent spawned by a workflow orchestration script. Use the tools available to complete the task.

CRITICAL: Your final text response is returned **verbatim** as a string to the calling script — it is your return value, not a message to a human.
- Output the literal result (data, JSON, text). Do NOT output confirmations like "Done." or "Sent."
- If asked for JSON, return ONLY the raw JSON — no code fences, no prose, no markdown.
- Do NOT use SendUserMessage to deliver your answer. Put your answer in your final text response.
- Be concise. The script will parse your output.`;
rG_ = `\n\n---\n\nNOTE: You are running inside a workflow script. Your final text response is returned verbatim as a string to the calling script … Be concise — the script will parse your output.`;
oG_ = `\n\n---\n\nNOTE: You are running inside a workflow script. You MUST return your final answer by calling the ${iY} tool exactly once — the tool's input schema defines the required shape. … (the script reads ONLY the tool call). If validation fails, read the error and call ${iY} again with a corrected shape.`;
aG_ = `You are a subagent spawned by a workflow orchestration script. Use the tools available to complete the task.

CRITICAL: You MUST call the ${iY} tool exactly once to return your final answer. The tool's input schema defines the required shape.
- Do your work (Read files, run commands, etc.), then call ${iY} with your answer.
- Do NOT put your answer in a text response. The script reads ONLY the ${iY} tool call.
- If the schema validation fails, read the error and call ${iY} again with a corrected shape.
- After calling ${iY} successfully, end your turn. No acknowledgment needed.`;

// READABLE (for understanding):
// iG_ = WORKFLOW_SUBAGENT_PROMPT      (plain body:   "final text IS your return value")
// rG_ = WORKFLOW_SUBAGENT_TAIL        (plain tail appended to a named agent's prompt)
// aG_ = WORKFLOW_STRUCTURED_PROMPT    (structured body: "you MUST call StructuredOutput exactly once")
// oG_ = WORKFLOW_STRUCTURED_TAIL      (structured tail appended to a named agent's prompt)
// where iY = "StructuredOutput" (cli_inner_pretty.js:212132)

// Mapping: iG_→WORKFLOW_SUBAGENT_PROMPT, rG_→WORKFLOW_SUBAGENT_TAIL,
//          aG_→WORKFLOW_STRUCTURED_PROMPT, oG_→WORKFLOW_STRUCTURED_TAIL, iY→STRUCTURED_OUTPUT_TOOL_NAME
```

The plain prompt's load-bearing instruction is *"Your final text response is returned **verbatim** as a
string to the calling script — it is your return value, not a message to a human"* — which is what makes
`const x = await agent("...")` behave like a function call. The explicit *"Do NOT use SendUserMessage"*
line is there because in agent-team contexts a subagent might otherwise try to "message" a human; in a
workflow there is no human in the loop, only the script that parses the return value.

The structured prompt swaps that contract: *"You MUST call the StructuredOutput tool exactly once … The
script reads ONLY the StructuredOutput tool call"* — so a `schema`-typed `agent()` returns a
schema-validated object, not free text.

## F.2 Agent-def selection — `mp6` / `sG_`, chosen by `KH ?? (_H ? sG_ : mp6)`

```javascript
// ============================================
// Workflow subagent defs - plain (mp6) and StructuredOutput (sG_) workflow-subagent definitions
// Location: cli_inner_pretty.js:375766-375775; selection at 375146
// ============================================

// ORIGINAL (for source lookup):
mp6 = {
  agentType: "workflow-subagent",
  whenToUse: "Internal subagent for workflow script orchestration.",
  tools: ["*"],
  disallowedTools: [cd, sq],
  source: "built-in", baseDir: "built-in",
  getSystemPrompt: () => iG_,
};
sG_ = { ...mp6, getSystemPrompt: () => aG_ };
// …selection inside the local executor R:
let AH = KH ?? (_H ? sG_ : mp6);          // KH = explicit agentType def, else schema→sG_, else mp6

// READABLE (for understanding):
const WORKFLOW_SUBAGENT_DEF = {
  agentType: "workflow-subagent",
  whenToUse: "Internal subagent for workflow script orchestration.",
  tools: ["*"],                            // every tool…
  disallowedTools: [SEND_USER_MESSAGE, AGENT],  // …except SendUserMessage (cd) and Agent (sq)
  source: "built-in", baseDir: "built-in",
  getSystemPrompt: () => WORKFLOW_SUBAGENT_PROMPT,
};
const WORKFLOW_STRUCTURED_DEF = { ...WORKFLOW_SUBAGENT_DEF, getSystemPrompt: () => WORKFLOW_STRUCTURED_PROMPT };
// selection: const def = namedAgentDef ?? (hasSchema ? WORKFLOW_STRUCTURED_DEF : WORKFLOW_SUBAGENT_DEF);

// Mapping: mp6→WORKFLOW_SUBAGENT_DEF, sG_→WORKFLOW_STRUCTURED_DEF, cd→SEND_USER_MESSAGE ("SendUserMessage", 216142),
//          sq→AGENT ("Agent", 185637), KH→namedAgentDef, _H→hasSchema (compiled StructuredOutput tool)
```

The built-in `workflow-subagent` def grants `tools: ["*"]` (all tools) but `disallowedTools: [cd, sq]` =
`["SendUserMessage", "Agent"]` (cli_inner_pretty.js:375770; `cd` @216142, `sq` @185637) — it cannot
**message a human** (`cd`/SendUserMessage, which is exactly why the prompt body also says "Do NOT use
SendUserMessage") nor **spawn its own subagents** (`sq`/Agent), which keeps fan-out under the script's
control and avoids nested orchestration. Selection (cli_inner_pretty.js:375146):
an explicit `agentType` resolves to a named def (with the plain or structured *tail* appended, 375131/375137);
otherwise a `schema` selects `sG_`, and the default is `mp6`.

## F.3 StructuredOutput forcing — three reinforcing mechanisms

When `agent({schema})` is called, the runtime forces a validated result via *three* mechanisms that back
each other up:

1. **Tool injection.** `klH(schema)` (cli_inner_pretty.js:212098) Ajv-validates the JSON Schema and
   compiles a `StructuredOutput` tool whose `inputJSONSchema` is the user's schema; that tool is added to
   the subagent's `availableTools` (cli_inner_pretty.js:375152) so the model *can* call it.
2. **Prompt forcing.** The subagent runs with the structured body/tail (`aG_`/`oG_`) telling it to call
   `StructuredOutput` exactly once and that "the script reads ONLY the tool call."
3. **`SubagentStop` nudge.** A session hook (registered via `gtH`, cli_inner_pretty.js:375221-375236)
   blocks the subagent from stopping until it has called `StructuredOutput` — allowing the stop only after
   2 nudges (`A8 >= 2`) or once the transcript contains an `iY` call (`OW8(L$, iY)`). If after all that
   the structured output is still missing, the local executor throws *"agent({schema}): subagent completed
   without calling StructuredOutput (after 2 in-conversation nudges)"* (cli_inner_pretty.js:375472-375475).
   (The hook itself is analyzed in `gate_caps_lifecycle_relations.md` Part 4.7.)

The result is consumed at cli_inner_pretty.js:375476 (`return AP(_$.structured)`) — the validated object,
deep-cloned out of the sandbox.

## F.4 Contrast: the coordinator *worker* prompt (`ZD7`)

Claude Code has **two** orchestration models, and contrasting their subagent prompts is instructive. The
*scripted-workflow* model (this module) spawns `workflow-subagent`s whose contract is "your text/structured
output is a return value the script parses." The *interactive coordinator* model (analyzed in
`gate_caps_lifecycle_relations.md` Part 7) instead has Claude direct long-lived **workers** via
`SpawnAgent`/`SendMessage`/`StopAgent`. Its worker system prompt is `getWorkerSystemPrompt` (`ZD7`,
cli_inner_pretty.js:236124, body at 236125):

> *"You are a worker agent executing a task assigned by the coordinator. … If you encounter confusing
> file state … stop and report to the coordinator rather than trying to resolve it yourself … Do not spawn
> sub-agents (SpawnAgent tool) … If you changed any files, commit your changes when done … Report the
> commit hash in your summary."* (cli_inner_pretty.js:236125-236136)

The differences are telling:
- A **coordinator worker** is a *peer that reports back to a human-driven coordinator* — it commits,
  reports a commit hash, and escalates confusing state to the coordinator. It is collaborative and
  branch-aware ("other workers may be making changes on this branch").
- A **workflow subagent** is a *pure function the script calls* — it returns a value verbatim, must not
  message anyone, and is told the script will parse its output. It is stateless from the script's view and
  has no notion of "reporting back."

Both forbid spawning their own sub-agents (`disallowedTools: [cd, sq]` includes `sq`/`Agent` for the
workflow def; the explicit "Do not spawn sub-agents (`${sq}` tool)" line for the worker) — in both models
the *orchestrator* owns fan-out, never the leaf agents.

**Cross-validation (2.1.88):** the worker/coordinator prompts have a readable precursor
(`src/coordinator/coordinatorMode.ts`); the workflow-subagent prompts (`iG_`/`rG_`/`aG_`/`oG_`) and defs
(`mp6`/`sG_`) are new. Confidence high.

---

## NEW-post-2.1.88 verdict (summary)

**Confidence: high.** The compile path (`BP8`), the VM-context builder (`H44`), the runner (`q44`), all
six DSL primitives (`agent`/`parallel`/`pipeline`/`phase`/`log`/`workflow`), the determinism runtime shim
(`SZ_`/`uP8`) and intrinsic hardening (`UtH`), the nested-workflow primitive (`QK4`), and the
workflow-subagent prompts/defs (`iG_`/`rG_`/`aG_`/`oG_`/`mp6`/`sG_`) have **no precursor** in the readable
v2.1.88 tree — they are the GA implementation of the internal-only `WORKFLOW_SCRIPTS`-gated prototype.
Only the *coordinator worker* prompt (`ZD7`) has a readable precursor; its Workflow-tool recommendation is
new (see `gate_caps` Part 7).

---

## Pre-Completion Checklist

- [x] No mapping tables in this module doc — list-format symbol refs only; full tables in the additions file.
- [x] New symbols (`BP8`, `uP8`, `SZ_`, `UtH`, `xK4`, `uK4`, `g74`, `H44`, `q44`, `mP8`, `BiH`, `aB6`, `AP`, `QK4`, `iG_`, `rG_`, `aG_`, `oG_`, `mp6`, `sG_`, `iY`, `klH`, `p74`, `ZD7`) returned via StructuredOutput for `symbol_additions_v2_1_156_workflow.md` / the central index.
- [x] Dual-version snippets: ONE `====` header (ReadableName + desc + Location) → ORIGINAL → READABLE → Mapping.
- [x] Every cited `cli_inner_pretty.js:<line>` was read directly during this pass.
- [x] Cross-validated against v2.1.88; NEW-vs-precursor stated explicitly with confidence.
