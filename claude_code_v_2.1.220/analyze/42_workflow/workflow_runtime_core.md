# The Workflow script runtime — VM sandbox, host objects, and concurrency control

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md) · Ground truth:
> [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md)

This document closes the largest gap named in this module's own
[README §5](README.md): *"The Workflow runtime's script sandbox … was **not** re-analysed."*
It is a **full-chain** write-up of the layer, not a delta list — but every claim is measured against
2.1.193, and each section states explicitly whether the mechanism is **CARRYOVER** (byte-equivalent
behaviour in both bundles) or a **DELTA / NET_NEW** in this window.

Companion documents:
[workflow_lifecycle.md](workflow_lifecycle.md) (create/run/resume/adopt) ·
[workflow_model_resolution.md](workflow_model_resolution.md) (per-agent model + effort) ·
[workflow_state_and_ipc.md](workflow_state_and_ipc.md) (node state + main-agent communication) ·
[workflow_server_authored_launch.md](workflow_server_authored_launch.md) (the new launch channel).

---

## TL;DR

| Question | Answer | Anchor |
|---|---|---|
| What limits concurrency? | One `AB` semaphore per **workflow run**, width `min(16, max(2, cpuCount − 2))` | `zWy` `:387140-387142`; `KWy = zWy(os.cpus().length)` `:388177`; `F = AB(KWy, K)` `:387222` |
| Is the cap per-workflow or global? | **Per run.** `zSd` is invoked once per run, and `F` is a closure inside it. A child `workflow()` reuses the *parent's* `F`. | `zSd` `:387149`; child re-entry `:386901` |
| What else is rate-limited? | Worktree creation is serialised at width **1** (`I = AB(1, MDt)`) | `:387168`, used `:387472` |
| Hard agent cap | `WSd = 1000` `agent()` calls per run → `WorkflowAgentCapError` | `:388110`, `:388182-388187` |
| Token budget | Turn-scoped, **shared** with the main loop; exceeding it throws `WorkflowBudgetExceededError` | `:388188-388195`; wiring `:388628-388629` |
| Sandbox | `node:vm` context, `codeGeneration:{strings:false,wasm:false}`, `Date.now`/`Math.random`/`Date()` shimmed to throw, `import()` blocked, 30 s synchronous-slice timeout | `:388383`, `:386390-386410`, `:386363`, `Bxo = 30000` `:386383` |
| What is dead? | `agent({isolation:'remote'})` throws unconditionally, so the entire remote runner `re` (`:387907-388015`) and its width-50 semaphore `G` (`:387223`) are unreachable — **in both bundles** | `:387393`; `:423617 (193)` |
| Biggest behavioural DELTA in this layer | Auto-permission-mode sessions now run **every** workflow subagent's transcript through the hand-off safety classifier before the result reaches the script | in-executor `agentMessages` **220=7 / 193=0**; call `:387866-387883` |

---

## 1. Where the layer lives

Three functions form the runtime, in call order:

- `createWorkflowHostObjects` (`zSd`) — `:387149-388105`, ~950 lines. Builds the `agent` / `parallel` /
  `pipeline` / `phase` / `log` host callables and owns **all** the counters, semaphores and caps.
- `buildWorkflowVMContext` (`eEd`) — `:388358-388429`. Creates the `node:vm` context, hardens it,
  installs the host callables plus `budget`, `console`, `args`, `setTimeout`/`clearTimeout`, and
  binds the cross-realm marshalling closures back into the host objects.
- `runWorkflowScript` (`rEd`) — `:388439-388529`. Loads the journal, runs the compiled script inside
  the context, races it against the abort signal, and normalises the return value and any thrown error.

`zSd`'s signature gained **two parameters** in this window — 2.1.193's equivalent took nine
(`$ol(e, t, n, r, o, s, i, a, l)` `:423445 (193)`), 2.1.220 takes eleven:

```
zSd(toolUseContext, canUseTool, emitProgress, workflowRunId, onAgentController,
    seedPhaseTitles, tokenBudget, journal, journalSnapshot, workflowName, invokingRequestId)
```

The two additions are `workflowName` (`c`) and `invokingRequestId` (`u`); both are written into every
subagent's agent-context (`:387496-387501`) so that per-agent telemetry can be attributed to the
originating workflow and to the API request that launched it. Verified: `workflowRunId` is
**220=38 / 193=28** and `invokingRequestId` is **220=19 / 193=14**.

### 1.1 A useful measurement before reading further

The executor's *string literals* are the stable anchor across a re-mangling. Diffing the literal sets
of the two executor bodies (`:387149-388105` vs `:423445-424279 (193)`) yields only **five** additions
and **zero** removals of substance:

```
"[Circular]"
"bigint"
"output schema could not be serialized for classification"
"output schema too large to classify safely"
"spawn"                        ← invocationKind: "spawn"
```

So the *prose-visible* surface of this layer barely moved. Everything else in this document that is
labelled DELTA was found by diffing **structure**, not strings — which is why README §5's `grep`-level
spot check concluded "no change" and was wrong in three places (§6.3, §7.2, §1 above).

---

## 2. Concurrency control

### 2.1 The semaphore

**What it does:** bounds how many `agent()` calls are *executing* at once, while letting an unbounded
number be *scheduled*.

```javascript
// ============================================
// createLimiter - Generic width-N async semaphore used for workflow agents and worktrees
// Location: cli_inner_pretty.js:162762-162781
// ============================================

// ORIGINAL (for source lookup):
function AB(e, t) {
  let r = 0, n = [];
  function o() { if (r < e) return (r++, Promise.resolve()); return new Promise((s) => n.push(s)); }
  function i() { let s = n.shift(); if (s) s(); else r--; }
  return async (...s) => { await o(); try { return await t(...s); } finally { i(); } };
}

// READABLE (for understanding):
function createLimiter(width, fn) {
  let inFlight = 0;
  let waiters = [];
  function acquire() {
    if (inFlight < width) { inFlight++; return Promise.resolve(); }
    return new Promise((resolve) => waiters.push(resolve));   // FIFO queue
  }
  function release() {
    let next = waiters.shift();
    if (next) next();            // hand the slot straight to the next waiter
    else inFlight--;             // nobody waiting → give the slot back to the pool
  }
  return async (...args) => {
    await acquire();
    try { return await fn(...args); } finally { release(); }
  };
}

// Mapping: AB→createLimiter, e→width, t→fn, r→inFlight, n→waiters, o→acquire, i→release
```

**Why this approach:** the release path hands the slot *directly* to the head of the queue rather than
decrementing and re-testing. That makes the queue strictly FIFO and removes a race where a newly
arriving call could barge in between a decrement and the next waiter's `acquire()`. The cost is that
`inFlight` is not a truthful gauge while waiters exist — it stays pinned at `width`. Nothing reads it,
so that is fine.

**Key insight:** `AB` is a *generic* helper (`grep -cF 'function AB('` → 1) reused for two very
different jobs in the workflow runtime. It carries no fairness, priority or cancellation; a queued
call that is later aborted still consumes its slot when it eventually gets one, then discovers the
abort and returns immediately (`:387421`).

### 2.2 The width

```javascript
// ============================================
// computeAgentConcurrency - Derive the per-run parallel-agent cap from CPU count
// Location: cli_inner_pretty.js:387140-387142
// ============================================

// ORIGINAL (for source lookup):
function zWy(e) { return Math.min(16, Math.max(2, e - 2)); }

// READABLE (for understanding):
function computeAgentConcurrency(cpuCount) {
  return Math.min(16, Math.max(2, cpuCount - 2));
}

// Mapping: zWy→computeAgentConcurrency, e→cpuCount
```

Bound once at module-init time, not per run:

```javascript
// ============================================
// WORKFLOW_AGENT_CONCURRENCY / WORKFLOW_REMOTE_CONCURRENCY / WORKFLOW_AGENT_CAP
// Location: cli_inner_pretty.js:388108-388110 (decls), :388177 (binding)
// ============================================

// ORIGINAL (for source lookup):
var jSd, GSd, KWy, YWy = 50, WSd = 1000, ...
((jSd = require("os")), (GSd = require("util")));
((KWy = zWy(jSd.cpus().length)), (XWy = `Workflow agent() call cap reached (${WSd}). ...`));

// READABLE (for understanding):
let os, util;
let WORKFLOW_AGENT_CONCURRENCY;           // = computeAgentConcurrency(os.cpus().length)
const WORKFLOW_REMOTE_CONCURRENCY = 50;   // dead — see §5
const WORKFLOW_AGENT_CAP = 1000;

// Mapping: jSd→os, GSd→util, KWy→WORKFLOW_AGENT_CONCURRENCY, YWy→WORKFLOW_REMOTE_CONCURRENCY,
//          WSd→WORKFLOW_AGENT_CAP, XWy→WORKFLOW_AGENT_CAP_MESSAGE
```

**Why `cpuCount − 2`, floored at 2, ceilinged at 16:**

1. **`− 2`** reserves headroom for the two processes that must stay responsive while a fan-out runs:
   the main agent loop (which is still streaming, rendering Ink, and may itself be mid-tool-call) and
   the host OS. Each workflow agent is not merely an HTTP request — it is a full nested query loop
   that runs tools locally (Bash, Grep, Read), so it does consume real CPU.
2. **`max(…, 2)`** guarantees that `parallel()` still *means* something on a 1- or 2-core box. A width
   of 1 would silently turn every `parallel()` into a sequential loop and make the scripts the model
   writes behave qualitatively differently on small machines — a debugging nightmare with no error
   message. Two is the smallest width where "parallel" is not a lie.
3. **`min(16, …)`** is a rate-limit guard, not a CPU guard. Beyond ~16 concurrent agents the binding
   constraint stops being local CPU and becomes the Anthropic API's per-account concurrency and token
   throughput; adding more agents converts throughput into 429s. Note this cap is *lower* than the
   1,000-call lifetime cap by nearly two orders of magnitude — the design deliberately separates
   "how wide" from "how many".

**Verdict: CARRYOVER.** `Math.min(16, Math.max(2, e - 2))` is `:387141` in 2.1.220 and `:423437 (193)`
in the baseline — byte-identical, and `grep -c` finds exactly one occurrence in each bundle.

### 2.3 Wiring, and what is *not* limited

```javascript
// ============================================
// createWorkflowHostObjects (excerpt) - the three limiters
// Location: cli_inner_pretty.js:387168, :387222-387223
// ============================================

// ORIGINAL (for source lookup):
I = AB(1, MDt);            // :387168
let q = Tft((ne) => { (($ = Lxo(ne)), W($)); }),
    F = AB(KWy, K),        // :387222
    G = AB(YWy, re);       // :387223

// READABLE (for understanding):
const acquireWorktree = createLimiter(1, createGitWorktree);                     // serialised
const phase           = nullProto((title) => { currentPhase = toStr(title); resolvePhase(currentPhase); });
const runLocalAgent   = createLimiter(WORKFLOW_AGENT_CONCURRENCY, executeLocalAgent);
const runRemoteAgent  = createLimiter(WORKFLOW_REMOTE_CONCURRENCY, executeRemoteAgent);  // never called

// Mapping: I→acquireWorktree, MDt→createGitWorktree, q→phase, Tft→nullProto, Lxo→toStr,
//          W→resolvePhase, F→runLocalAgent, K→executeLocalAgent, G→runRemoteAgent, re→executeRemoteAgent
```

Three things deserve emphasis:

- **`I = AB(1, MDt)` serialises git-worktree creation.** `git worktree add` mutates
  `.git/worktrees/` and takes a repository lock; N concurrent adds would either fail or corrupt.
  Width 1 means that a `parallel()` of 10 `isolation:'worktree'` agents pays ~10× the setup cost
  *serially* before the agents themselves start overlapping. That is the concrete cost behind the
  tool prose's *"EXPENSIVE (~200-500ms setup + disk per agent)"* warning (`:388988`, carryover).
- **The `agent()` host callable `V` (`:387297-387419`) is NOT inside the semaphore.** Only the
  runner `K` is. Everything before `await F(...)` — the cap checks, the journal cache lookup, the
  safety classification, the label/phase resolution, and the *"queued"* progress emit — happens
  immediately for every call, no matter how deep the queue is. This is deliberate and is what makes
  the `/workflows` view able to show 40 rows in `queued` state while 12 run.
- **The semaphore is per-run, and children share it.** `F` is a closure created inside `zSd`, which
  `eEd` calls exactly once per run (`:388359`). The nested `workflow()` host does not build a new
  limiter — it forwards to `e.hooks.agent` (`:386901`), the parent's `V`, hence the parent's `F`.
  The tool prose states both halves: *"Concurrent agent() calls are capped at min(16, cpu cores - 2)
  **per workflow**"* (`:389021`) and *"The child shares this run's concurrency cap"* (`:388995`).

### 2.4 The queued → running transition, and how it becomes visible

The lifecycle of one `agent()` call, with the exact anchor for each state emission:

| Step | Line | Emits | State seen by UI |
|---|---|---|---|
| clone opts across the VM boundary | `:387305-387310` | — | — |
| abort check | `:387311` | — | — |
| `L()` agent-cap, `P()` budget-cap | `:387313` | — | (throws) |
| `d` (agent index) incremented | `:387317` | — | — |
| journal cache probe | `:387331-387354` | `workflow_agent_<i>_cached`, `state:"done"`, `cached:true` | ✔ instantly done |
| `at()` — pre-queue emit | `:387374-387394` | `workflow_agent_<i>_queued`, `state:"start"`, `queuedAt` set, **no `startedAt`** | ⟳ queued |
| **`await F(...)`** | `:387396` | — | (blocks here) |
| `mt = Date.now()` inside `K` | `:387484` | — | — |
| `ut("start", …)` | `:387560` | `workflow_agent_<i>_<agentId>`, `startedAt` set | ⟳ running |

**Key insight:** the *only* discriminator between "queued" and "running" in the published state is
whether `startedAt` is present. The consumer that formalises this is the stats reducer
`summariseWorkflowAgents` (`Ivn`, `:651292-651309`):

```javascript
// ORIGINAL:  if (((s = !0), c.startedAt !== void 0 || c.queuedAt === void 0)) i++;
// READABLE:  if ((anyRunning = true, node.startedAt !== undefined || node.queuedAt === undefined)) startedCount++;
```

The `|| c.queuedAt === undefined` disjunct is a compatibility clause for progress rows written before
`queuedAt` existed: a row with neither field is *assumed started*. It is a small but real source of
over-counting on resumed/adopted runs whose journal predates the field.

Also note the emitted `toolUseID` changes from `workflow_agent_<i>_queued` to
`workflow_agent_<i>_<agentId>` once the real agent id exists. The reducer keys on
`` `${type}:${index}` `` (`:386531`, `:386545`), **not** on `toolUseID`, so the two frames collapse
onto one node instead of producing a duplicate row. Anyone reading the emit sites in isolation will
expect duplicates; the reducer is where that is resolved. See
[workflow_state_and_ipc.md §2](workflow_state_and_ipc.md).

---

## 3. The two hard caps

### 3.1 `agent()` call cap — 1,000 per run

```javascript
// ============================================
// assertAgentCap - Lifetime cap on agent() invocations in one workflow run
// Location: cli_inner_pretty.js:387190-387194 (check), :388178-388187 (message + error class)
// ============================================

// ORIGINAL (for source lookup):
function L() {
  if (d < WSd) return;
  if (!b) ((b = !0), O("tengu_workflow_agent_cap_exceeded", { agentCount: d }));
  throw new qSd();
}
XWy = `Workflow agent() call cap reached (${WSd}). This usually means a loop using budget.remaining() never terminates because `
    + "no token budget was set — remaining() returns Infinity when budget.total is null. "
    + "Add a hard iteration cap to the loop, or pass a token budget.";
qSd = class qSd extends Error { constructor() { super(XWy); this.name = "WorkflowAgentCapError"; } };

// READABLE (for understanding):
function assertAgentCap() {
  if (agentCount < WORKFLOW_AGENT_CAP) return;
  if (!agentCapTelemetrySent) {
    agentCapTelemetrySent = true;                       // emit the event exactly once per run
    logEvent("tengu_workflow_agent_cap_exceeded", { agentCount });
  }
  throw new WorkflowAgentCapError();
}

// Mapping: L→assertAgentCap, d→agentCount, WSd→WORKFLOW_AGENT_CAP, b→agentCapTelemetrySent,
//          O→logEvent, qSd→WorkflowAgentCapError, XWy→WORKFLOW_AGENT_CAP_MESSAGE
```

**Why the error message names `budget.remaining()`:** this is a *runaway-loop backstop*, and the
authors knew the dominant failure mode. The tool prose teaches a "loop-until-budget" pattern
(`while (budget.total && budget.remaining() > 50_000) { … }`, `:389055-389062`) and separately warns
*"Guard on `budget.total`: with no target set, `remaining()` is Infinity and the loop would run
straight to the 1000-agent cap"* (`:389055`). The exception text is that warning, delivered at the
moment the prediction comes true. Diagnostic messages that name the *specific* mistake that produces
them are rare and worth noting as a design pattern.

**Why the telemetry flag `b` is per-run and one-shot:** `L()` is called from `agent()` (`:387313`),
`parallel()` (`:388021`) and `pipeline()` (`:388055`). Once the cap is hit, a script that swallows
errors will hit it again on every subsequent call — potentially hundreds of times. The latch turns an
unbounded event stream into exactly one event per run.

**Verdict: CARRYOVER.** `Workflow agent() call cap reached` is 220=1 / 193=1;
`tengu_workflow_agent_cap_exceeded` is 220=1 / 193=1; `WorkflowAgentCapError` exists at
`:424358 (193)`.

### 3.2 Token budget — turn-scoped and shared

```javascript
// ============================================
// assertTokenBudget - Stop scheduling when the turn's output-token target is spent
// Location: cli_inner_pretty.js:387195-387201 (check), :388188-388195 (error class)
// ============================================

// ORIGINAL (for source lookup):
function P() {
  if (s?.total == null || s.total <= 0) return;
  let ne = s.getTurnSpent();
  if (ne < s.total) return;
  if (!T) ((T = !0), O("tengu_workflow_budget_cap_exceeded", { spent: ne, budget: s.total, agentCount: d }));
  throw new VSd(ne, s.total);
}

// READABLE (for understanding):
function assertTokenBudget() {
  if (tokenBudget?.total == null || tokenBudget.total <= 0) return;   // no target set → no cap
  const spent = tokenBudget.getTurnSpent();
  if (spent < tokenBudget.total) return;
  if (!budgetCapTelemetrySent) {
    budgetCapTelemetrySent = true;
    logEvent("tengu_workflow_budget_cap_exceeded", { spent, budget: tokenBudget.total, agentCount });
  }
  throw new WorkflowBudgetExceededError(spent, tokenBudget.total);
}

// Mapping: P→assertTokenBudget, s→tokenBudget, ne→spent, T→budgetCapTelemetrySent,
//          d→agentCount, VSd→WorkflowBudgetExceededError
```

The budget object itself is built by the launcher, not the runtime:

```javascript
// ============================================
// Osn (excerpt) - wiring the turn budget into the run
// Location: cli_inner_pretty.js:388628-388629
// ============================================

// ORIGINAL (for source lookup):
b = Uv() - A9t(),
T = { total: w9t(), getTurnSpent: () => Uv() - b },

// READABLE (for understanding):
const turnBaselineOutputTokens = sessionOutputTokens() - turnOutputTokensSpent();  // === the stored baseline
const tokenBudget = {
  total: turnBudgetTarget(),                                   // null unless the user typed "+500k"
  getTurnSpent: () => sessionOutputTokens() - turnBaselineOutputTokens,
};

// Mapping: Uv→sessionOutputTokens (:2885), A9t→turnOutputTokensSpent (:2897),
//          w9t→turnBudgetTarget (:2900), b→turnBaselineOutputTokens, T→tokenBudget
```

`sessionOutputTokens()` sums `outputTokens` across **every** model in `Ot.modelUsage` (`:2885-2887`),
so the meter counts the main loop, background agents, other concurrent workflows and this workflow's
own subagents alike. That matches the tool prose exactly: *"the pool is shared, not per-workflow"*
(`:388994`).

**Two consequences that the prose does not spell out, both readable from these three lines:**

1. **The baseline is a snapshot.** `b` is computed once, at launch. `A9t()` is
   `sessionOutputTokens() − nSi` where `nSi` is re-stamped by `G2m()` (`:2903`) whenever a new budget
   directive is issued. So `b` is whatever `nSi` was *at launch*. If a new turn re-baselines while a
   long workflow is still running, the workflow keeps charging against the stale baseline and will
   over-report `spent()` relative to the main loop's own view.
2. **The check is at *schedule* time only.** `assertTokenBudget` runs in `agent()` (`:387313`),
   `parallel()` (`:388021`), `pipeline()` (`:388055`) and at the top of the local runner (`:387423`).
   Nothing interrupts an in-flight agent. That is the behaviour the error message promises —
   *"In-flight agents will complete; their results are preserved."* (`:388191`) — and it is why the
   cap is a soft ceiling in practice: a `parallel()` of 16 agents launched at 99 % of budget will
   overshoot by up to 16 agents' worth of output.

**How the aggregators absorb it.** `parallel()` and `pipeline()` special-case this one error name
rather than letting it escape:

```javascript
// ORIGINAL (parallel, :388038 / :388046):
if (he === "WorkflowBudgetExceededError") return (de++, null);
...
if (de > 0) C.push(`parallel: ${de} ${Et(de, "slot")} dropped — token budget exceeded`);

// READABLE:
if (errName === "WorkflowBudgetExceededError") { droppedSlots++; return null; }   // silent null, no log spam
...
if (droppedSlots > 0) failures.push(`parallel: ${droppedSlots} ${plural(droppedSlots,"slot")} dropped — token budget exceeded`);
```

**Why special-cased:** every other rejection produces a per-item `workflow_log` line
(`parallel[3] failed: …`). If the budget blows during a 200-item fan-out, that is 200 near-identical
log lines that would immediately trip the progress reducer's log-trim (`kSd = 500`, `:386764`) and
evict genuine diagnostics. Collapsing them to one summary line preserves the log for real failures.
`pipeline()` does the same at `:388073` / `:388081`.

**Verdict: CARRYOVER.** `tengu_workflow_budget_cap_exceeded` 220=1 / 193=1; `getTurnSpent` 220=4 /
193=4; the two `"WorkflowBudgetExceededError"` string comparisons exist at `:424212 (193)` and
`:424247 (193)`.

---

## 4. The VM sandbox

### 4.1 Context construction

`buildWorkflowVMContext` (`eEd`, `:388358-388429`) assembles the context in a fixed order that matters:

1. **Seed globals** (`:388365-388384`) — `log`, `phase`, `console`, `budget`, `setTimeout`,
   `clearTimeout`, created with `__proto__: null` and `codeGeneration: { strings: false, wasm: false }`.
2. **Harden** (`:388385`) — `Fxo(E)` installs the determinism shim, `V$t(E)` deletes dangerous globals.
3. **Marshalling closures** (`:388386-388398`) — compiled *inside* the guest realm so that every
   `String()`, `JSON.stringify()`, `Array.isArray()` used on guest values resolves to the guest's own
   intrinsics, never the host's.
4. **Async host callables** (`:388399-388405`) — `agent`, `parallel`, `pipeline`, `workflow`.
5. **`args`** (`:388406-388414`) — serialised to JSON on the host, then `JSON.parse`d *inside* the
   guest.
6. **Late binding** (`:388419-388426`) — `bindVMAwait` swaps the host objects' six default marshalling
   stubs for the real guest-realm ones.

**Why `args` round-trips through JSON rather than being handed over directly** (`:388407-388409`):

```javascript
// ORIGINAL:
let L = i === void 0 ? void 0 : JSON.stringify(i);
Object.defineProperty(E, "args", {
  value: L === void 0 ? void 0 : Msn.runInContext(`JSON.parse(${JSON.stringify(L)})`, E), ... });

// READABLE:
const argsJson = args === undefined ? undefined : JSON.stringify(args);
Object.defineProperty(context, "args", {
  value: argsJson === undefined ? undefined
       : vm.runInContext(`JSON.parse(${JSON.stringify(argsJson)})`, context), … });
```

Handing a host object across would give guest code a live reference to a host-realm `Object` — and
therefore to `args.constructor.constructor` (`Function` in the *host* realm), the classic `node:vm`
escape. Double-stringifying (`JSON.stringify` of the JSON text) makes the value a source-level string
literal, so nothing but primitives, arrays and plain objects can cross, and every prototype in the
result is a guest prototype. The cost is that `args` must be JSON-serialisable — which is exactly the
constraint the tool prose states (*"Pass arrays/objects as actual JSON values"*, `:389280`).

**Why the six marshalling stubs are late-bound rather than passed in:** `zSd` must be constructible
before a context exists (it is what *supplies* the callables the context needs), so it starts with
identity/no-op defaults (`:387151-387162`) and receives the real ones afterwards
(`bindVMAwait`, `:388099-388101`). The window between construction and binding contains no guest
code, so the defaults are never actually used — they exist only to keep the closure well-typed.

### 4.2 The determinism shim

```javascript
// ============================================
// WORKFLOW_DETERMINISM_SHIM - Make Date.now / Math.random / bare Date() throw inside the guest
// Location: cli_inner_pretty.js:386390-386410 (source), applied via Fxo :386247
// ============================================

// ORIGINAL (for source lookup):
UWy = `(() => {
      const NOW_ERR = ${Ie(FWy)};
      const RANDOM_ERR = ${Ie(BWy)};
      Math.random = function random() { throw new Error(RANDOM_ERR) };
      const RealDate = Date;
      RealDate.now = function now() { throw new Error(NOW_ERR) };
      function ShimDate(...a) {
        if (!new.target) throw new Error(NOW_ERR); // bare Date() → now-string
        if (a.length === 0) throw new Error(NOW_ERR);
        return Reflect.construct(RealDate, a, new.target);
      }
      ShimDate.now = RealDate.now;
      ShimDate.parse = RealDate.parse;
      ShimDate.UTC = RealDate.UTC;
      ShimDate.prototype = RealDate.prototype;
      // Close the (new Date(x)).constructor backdoor to RealDate.now — point
      // .constructor at the shim, then freeze RealDate so it can't be undone.
      RealDate.prototype.constructor = ShimDate;
      Object.freeze(RealDate);
      globalThis.Date = ShimDate;
    })()`;

// READABLE (for understanding): see the annotated walk-through below.

// Mapping: UWy→WORKFLOW_DETERMINISM_SHIM, FWy→DATE_UNAVAILABLE_MESSAGE (:386378-386379),
//          BWy→RANDOM_UNAVAILABLE_MESSAGE (:386380-386381), Fxo→applyDeterminismShim, Ie→JSON.stringify
```

**How it works, step by step:**

1. `Math.random` is replaced outright. No further defence is needed — `Math` is a plain namespace
   object with no other path to the PRNG.
2. `Date` is harder, because it has *four* distinct now-producing entry points. Each is closed:
   - `Date.now()` → `RealDate.now` is overwritten first, **before** `ShimDate` copies it, so
     `ShimDate.now` inherits the throwing version (`:386397`).
   - `Date()` called without `new` → returns a *now-string* in real JS; guarded by `!new.target`.
   - `new Date()` with zero arguments → guarded by `a.length === 0`.
   - `new Date(x)` with arguments is **allowed** and forwards via
     `Reflect.construct(RealDate, a, new.target)`, which preserves subclassing.
3. `parse` and `UTC` are copied through unchanged — both are pure functions of their input, so they
   cannot leak the clock. (`Date.parse` is what the tool prose means by *"pass timestamps via args"*.)
4. **The backdoor closure is the clever part.** `ShimDate.prototype = RealDate.prototype` is required
   for `instanceof` and method lookup to keep working — but it means any date instance created
   through the allowed path exposes `d.constructor === RealDate`, whose `.now` was already replaced…
   except that an attacker could call `Object.getPrototypeOf(d).constructor` and get `RealDate`
   itself, then read a *fresh* `Date` off `RealDate`'s own `[[Call]]` behaviour. So the shim
   re-points `RealDate.prototype.constructor` at `ShimDate` and then `Object.freeze(RealDate)` to
   make that re-pointing permanent. The in-source comment says exactly this.

**Why determinism at all:** it is a *resume* requirement, not a security requirement. The journal
cache key is a hash of `(previousKey, promptString, canonicalOpts)` (§3 of
[workflow_lifecycle.md](workflow_lifecycle.md)). A prompt containing `Date.now()` or a random sample
would hash differently on every replay, so a resumed run would re-execute every agent and the feature
would silently do nothing. Both error strings say so verbatim — *"(breaks resume)"* (`:386379`,
`:386381` — the two message constants, declared at `:386378` and `:386380`).

**And why there is a *second*, static check.** `hasNondeterministicCall` (`Uxo`, `:386412-386438`)
walks the parsed AST for `Date.now` / `Math.random` member expressions and zero-argument
`new Date()`, and the tool *rejects the input* before launching (`:389414-389420`). Two layers,
different jobs:

| Layer | When | Failure mode | Why both |
|---|---|---|---|
| AST check `Uxo` | `validateInput`, before launch | tool result: `errorCode: 4`, nothing runs | The model gets a *fast, cheap* correction with a fix-it sentence, before any agent is spawned |
| Runtime shim `UWy` | inside the guest, at call time | thrown `Error` mid-run | Catches what the AST cannot: `globalThis["Da"+"te"].now()`, `eval`-free computed access, indirection through a helper |

The AST check is deliberately shallow (it only matches `Identifier.Identifier` member expressions,
`:386426-386430`), because its job is ergonomics; the shim is the actual guarantee. Note the AST
check applies **only** to `e.script`, not to a script loaded via `scriptPath` or `name`
(`if (e.script && Uxo(n.scriptBody))`, `:389414`) — a saved workflow that predates the check can
still be launched and will fail at runtime instead.

### 4.3 Global hardening — `hardenVMIntrinsics`

`V$t` (`:385349-385488`, 140 lines) is one long `runInContext` string executed inside the guest. Its
own in-source comment leaks the intended name — *"hardenVMIntrinsics is shared with REPLTool"*
(`:385364`) — which is also the single most important fact about it: **it is not workflow-specific**.
The Workflow tool and the REPL tool share it, and the divergences are called out in the comments.

It does four things.

**(a) Neutralise `Error.prepareStackTrace`** (`:385352-385355`), pinned non-writable and
non-configurable:

```javascript
// ORIGINAL:
Object.defineProperty(Error, 'prepareStackTrace', {
  value: (err, sites) => String(err.stack ?? err),
  writable: false, configurable: false,
});
```

V8's default `prepareStackTrace` hands the callback an array of `CallSite` objects whose
`getThis()` / `getFunction()` return live references to frames — including host frames if the stack
crosses the boundary. That is a documented realm-escape vector. Replacing it with a plain stringifier
removes the vector while keeping stack strings useful for the error formatter in `rEd`
(`:388499-388517`).

**(b) Delete 14 globals** (`:385361-385373`). The list is broader than the comment above it suggests:

```
ShadowRealm  WebAssembly  FinalizationRegistry  WeakRef  Atomics  SharedArrayBuffer
queueMicrotask   $vm  gc  edenGC  fullGC  print  readFile  Loader
```

Three groups, each with a stated reason:

- **Host-event-loop callbacks outside any `try`/`catch`** — `FinalizationRegistry`, `WeakRef`,
  `queueMicrotask`. The comment names the shape: *"same DoS shape as a throwing setTimeout callback"*.
  This is the same threat the guest timer wrapper (§4.4) defends against, closed here by deletion
  rather than by wrapping.
- **Shared memory and alternate realms** — `Atomics`, `SharedArrayBuffer`, `ShadowRealm`,
  `WebAssembly`. *"no cross-realm use, pure attack-surface reduction."*
- **JavaScriptCore debug/shell globals** — `$vm`, `gc`, `edenGC`, `fullGC`, `print`, `readFile`,
  `Loader`. The comment explains why these appear at all: Claude Code ships on **Bun**, whose engine
  is JSC, not V8, and *"$vm is a full escape (createGlobalObject, addressOf, runScript)"* — present
  only when `JSC_useDollarVM=1` or similar. Defending against a debug global that is normally absent
  is exactly the kind of thing that gets skipped; it is here.

`eval` is deliberately **not** deleted, and the comment says why: `hardenVMIntrinsics` is shared with
the REPL tool, which runs with `codeGeneration: { strings: true }`. The Workflow tool blocks `eval`
the other way, through the context option.

**(c) Work around the TC39 "override mistake" before freezing** (`:385375-385395`). This is the
subtlest part. Freezing `Object.prototype` makes its data properties non-writable; a later
`this.name = 'X'` in, say, an `Error` subclass constructor then throws in strict mode (and silently
no-ops in sloppy mode) because `[[Set]]` walks the prototype chain, finds a non-writable data
property, and refuses. So before freezing, `enableOverride(proto, key)` converts each such data
property into an accessor pair whose setter `defineProperty`s onto the *receiver*:

```javascript
// ORIGINAL:
set(nv) {
  if (this === proto) return;
  Object.defineProperty(this, key, { value: nv, writable: true, enumerable: true, configurable: true });
},

// READABLE: assigning through the prototype writes an own property on the instance,
//           exactly as it would have before the freeze; assigning *to the prototype* is a no-op.
```

This is the standard SES technique, and it is applied to all of `Object.prototype`'s own property
names, plus a curated list on `Function.prototype`, `Array.prototype` and the nine error prototypes
(`Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError, AggregateError,
SuppressedError`, `.filter(Boolean)` for engines lacking the last two).

**(d) Freeze constructors, prototypes and namespaces** (`:385399-385487`) — the error constructors and
their prototypes, generator/async-generator function constructors reached via `f.constructor`, the
`JSON`/`Math`/`Reflect`/`Proxy` namespaces (the comment notes *"Proxy has no .prototype but freeze
closes `Proxy.revocable` tampering"*), and then a final pass that walks the entire prototype chain of
a set of *sample instances* and freezes every link. The sample list includes an `Intl.Segmenter`
segment object and its iterator, with the reason spelled out: freezing the `Intl` namespace does
**not** freeze `Intl.Collator.prototype` et al., and the `Segments` object's chain *"would otherwise
see a writable `.then`"* — i.e. a guest could install a `then` on a prototype in that chain and turn
an innocuous returned object into a thenable that hijacks an `await` on the host side.

**Why this belongs in a workflow document even though it is shared code:** the Workflow tool is the
only place where *model-authored* JavaScript runs with host callables in scope. The REPL tool is
user-driven; a workflow script is written by the model from a prompt that may itself contain
injected instructions. Every item in this list is a defence against the script the model was talked
into writing.

`codeGeneration: { strings: false, wasm: false }` (`:388383`, and again for child contexts at
`:386880`) disables `eval` and `new Function` inside the guest — `grep -cF 'codeGeneration: { strings: !1, wasm: !1 }'`
→ **220=3 / 193=3**.

Dynamic `import()` is blocked at compile time rather than context time, via the `Script` option
(`:386362-386364`):

```javascript
// ORIGINAL:  importModuleDynamically: () => { throw w2e("import() is not available in workflow scripts."); }
// READABLE:  importModuleDynamically: () => { throw makeGuestError("import() is not available in workflow scripts."); }
```

### 4.4 Timers

`createGuestTimers` (`xSd`, `:386250-386286`) gives the guest `setTimeout`/`clearTimeout` with three
properties the host versions lack:

- **Every handle is tracked** in a `Set`, and an `abort` listener (`{ once: true }`) clears all of
  them. A workflow killed mid-sleep leaves no dangling host timers.
- **After abort, `setTimeout` returns `0` without scheduling** (`:386266`). Guest code in a
  `finally` block cannot resurrect the run.
- **The callback is invoked through `bindVMInvoke`** — a guest-realm
  `(fn => { fn() })` compiled at `:388387` — wrapped in `try {} catch {}`. A throwing guest timer
  callback therefore cannot propagate onto the host event loop, where it would be an unhandled
  exception with no owning workflow. (The default `r = (n) => n()` at `:386252` is the pre-binding
  stub; it is replaced before any guest code runs.)

`clearTimeout` only clears handles that are in the tracked `Set` (`:386279`), so the guest cannot
cancel an unrelated host timer by guessing its numeric id.

### 4.5 Two timeouts, two very different meanings

| Constant | Value | Applies to | Anchor |
|---|---|---|---|
| `Bxo` (`WORKFLOW_SYNC_SLICE_TIMEOUT_MS`) | 30,000 | one **synchronous** slice of guest execution | `:386383`; used `:388465`, `:386921` |
| `r6y` (`DEFAULT_AGENT_STALL_MS`) | 180,000 | no-progress window for one **agent** | `:388131`; read `:387325` |

`wft(Bxo, n.syncTimeoutMs)` (`:385345-385348`, `:388465`) is `node:vm`'s `timeout` option, which only
counts synchronous CPU time. A script that `await`s for an hour never trips it; a script with
`while(true){}` trips it in 30 s. This is the anti-hang guard for the *script*, and it is why the
runtime can afford to let workflows run for hours.

`stallMs` is per-agent and overridable per call (`opts.stallMs`, `:387325`) — note it is documented
nowhere in the tool prose, making it an **undocumented public option** of `agent()`.

**Verdict for §4 as a whole: CARRYOVER.** Every literal measured is 1/1 or 3/3
(`import() is not available in workflow scripts`, `Iterator.next is not a function`,
`codeGeneration: { strings: !1, wasm: !1 }`). The sandbox did not change in this window.

---

## 5. The remote-agent path is dead code — in both bundles

`agent({isolation:'remote'})` is documented in neither the tool prose nor the changelog, but the
runtime contains a complete ~110-line implementation of it (`re`, `:387907-388015`): it creates a CCR
cloud session via `Nse` (`:387948`), polls it with `lCs` (`:387973`), attributes per-model cost back
into the local usage ledger (`:387974-387986`), and handles `{schema}` with three distinct
diagnostic strings for "no structured output".

It is unreachable:

```javascript
// ORIGINAL (:387393):
if (ae?.isolation === "remote") throw Error("agent({isolation:'remote'}) is not available in this build");

// READABLE:
if (opts?.isolation === "remote")
  throw new Error("agent({isolation:'remote'}) is not available in this build");
```

The throw sits at `:387393`, **before** `at()` and before `await F(...)`, so no code path reaches
`re`. Confirming this independently: the limiter that would call it, `G = AB(YWy, re)` (`:387223`),
is referenced **exactly once in the entire 950-line function** — its own declaration. A scan of
`:387149-388105` for the standalone token `G` returns only line 387223.

**Verdict: CARRYOVER (dead in both).** The identical throw is at `:423617 (193)`. This is *not* a
2.1.220 regression and not a `.219` removal; the remote runner has been shipped-but-fenced across at
least this 27-release window. It is a textbook instance of the tree's *"shipped ≠ reachable"* pattern
(see [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md)) — and a warning
for anyone reading `progress` payloads: the `isolation: "remote"` and `remoteSessionId` fields exist
in the emitted node shape (`:387930-387931`) and can never be populated.

One live trace of the feature remains: the branch-freshness helper `H()` (`:387170-387189`) exists
solely to warn remote agents that the local branch is unpushed, and it is memoised into `R`. Because
`re` is dead, `H()` is only reachable from `re` (`:387953`) — so that warning can never fire either.

---

## 6. The three collection primitives

### 6.1 `parallel()` — a real barrier

```javascript
// ============================================
// parallelHost - Run an array of thunks concurrently, never reject
// Location: cli_inner_pretty.js:388016-388048
// ============================================

// ORIGINAL (for source lookup):
let oe = Tft(async (ne) => {
  if (U.abortController?.signal.aborted) return new Promise(() => {});
  if ((await vr(0), !Array.isArray(ne))) throw TypeError("parallel() expects an array of functions");
  let ee = Pxo(y(ne));
  if (ee.length === 0) return m([]);
  (L(), P());
  for (let Te of ee)
    if (typeof Te !== "function")
      throw TypeError("parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)");
  let te = await Promise.allSettled(ee.map((Te) => { try { return p(f(Te)); } catch (ve) { return Promise.reject(ve); } })),
  ...

// READABLE (for understanding):
const parallelHost = nullProto(async (rawThunks) => {
  if (ctx.abortController?.signal.aborted) return new Promise(() => {});   // hang forever, never settle
  await yieldToEventLoop(0);
  if (!Array.isArray(rawThunks)) throw new TypeError("parallel() expects an array of functions");
  const thunks = readGuestArray(snapshot(rawThunks));      // bounded copy across the VM boundary
  if (thunks.length === 0) return cloneIntoGuest([]);
  assertAgentCap(); assertTokenBudget();
  for (const t of thunks)
    if (typeof t !== "function")
      throw new TypeError("parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)");
  const settled = await Promise.allSettled(
    thunks.map((t) => { try { return settleInGuest(callInGuest(t)); } catch (e) { return Promise.reject(e); } }));
  …
});

// Mapping: oe→parallelHost, Tft→nullProto, ne→rawThunks, ee→thunks, Pxo→readGuestArray,
//          y→snapshot, m→cloneIntoGuest, p→settleInGuest, f→callInGuest, vr→yieldToEventLoop
```

Four details worth reading closely:

- **`return new Promise(() => {})` on abort** (`:388017`, and identically at `:387311`, `:388050`,
  `:386832`). Returning a permanently-pending promise instead of throwing means an aborted script
  simply *stops* at its next host call — no `catch` block in the guest can observe the abort, log
  about it, or start compensating work. The abort is instead raced at the top level in `rEd`
  (`:388468-388478`). This is the cleanest way to guarantee that "killed" means killed.
- **`await vr(0)` before the type check.** A macrotask yield, so that a synchronous script calling
  `parallel()` in a tight loop cannot starve the event loop before the cap check runs.
- **`Promise.allSettled`, never `Promise.all`.** One failing thunk must not cancel its siblings —
  the tool prose promises *"A thunk that throws … resolves to `null` in the result array — the call
  itself never rejects"* (`:388990`).
- **The error message for "array of promises"** is unusually specific. Passing
  `parallel([agent(a), agent(b)])` instead of `parallel([() => agent(a), () => agent(b)])` is a
  natural mistake that would otherwise *appear to work* (the agents run — just eagerly, outside the
  limiter, before `parallel` is even called), producing a silent concurrency-cap bypass. Rejecting it
  loudly is the only way to keep the cap honest.

### 6.2 `pipeline()` — no barrier between stages

```javascript
// ORIGINAL (:388059-388068):
let ae = await Promise.allSettled(
  te.map(async (he, Le) => {
    let Ae = await p(he);
    for (let Ce of de) { if (Ae.v === null) break; Ae = await p(f(Ce, Ae.v, he, Le)); }
    return Ae;
  }),
),

// READABLE:
const settled = await Promise.allSettled(
  items.map(async (item, index) => {
    let carry = await settleInGuest(item);
    for (const stage of stages) {
      if (carry.v === null) break;                                  // a null short-circuits the rest
      carry = await settleInGuest(callInGuest(stage, carry.v, item, index));
    }
    return carry;
  }),
);
```

**Key insight:** the stage loop is *inside* the per-item `map` callback. Item *i* advances through
all stages independently of item *j*. There is no `await` that synchronises the set between stages,
which is precisely what the tool prose means by *"NO barrier between stages… Wall-clock = slowest
single-item chain, not sum-of-slowest-per-stage"* (`:388989`).

Two behaviours the prose states and the code confirms:

- **Every stage receives `(prevResult, originalItem, index)`** — `f(Ce, Ae.v, he, Le)` — so late
  stages can label their work without stage 1 having to thread context through its return value
  (`:388989`).
- **`if (Ae.v === null) break`** is what implements *"A stage that throws drops that item to `null`
  and skips its remaining stages"* (`:388985`) — but note the check is on the *value*, not on a
  rejection. A stage that legitimately returns `null` (e.g. an `agent()` whose subagent was skipped
  by the user, `:387839`) also short-circuits the remaining stages for that item. That conflation is
  invisible in the prose and is a real trap for scripts that use `null` as a sentinel.

### 6.3 `phase()` and the phase registry

```javascript
// ============================================
// resolvePhase - Intern a phase title, assign it an index, publish a workflow_phase node
// Location: cli_inner_pretty.js:387206-387218
// ============================================

// ORIGINAL (for source lookup):
function W(ne, ee) {
  let te = D.get(ne);
  if (te == null)
    ((te = ++M), D.set(ne, te),
      r({ type: "progress", toolUseID: `workflow_phase_${te}`,
          data: { type: "workflow_phase", index: te, title: ne, kind: ee } }));
  return te;
}
for (let ne of i ?? []) W(ne);

// READABLE (for understanding):
function resolvePhase(title, kind) {
  let index = phaseIndexByTitle.get(title);
  if (index == null) {
    index = ++phaseCounter;                       // 1-based; 0 is reserved for the synthetic "Agents" group
    phaseIndexByTitle.set(title, index);
    emitProgress({ type: "progress", toolUseID: `workflow_phase_${index}`,
                   data: { type: "workflow_phase", index, title, kind } });
  }
  return index;
}
for (const title of seedPhaseTitles ?? []) resolvePhase(title);   // pre-register meta.phases

// Mapping: W→resolvePhase, ne→title, ee→kind, D→phaseIndexByTitle, M→phaseCounter,
//          i→seedPhaseTitles, r→emitProgress
```

**Why titles are interned by string rather than by call order:** phases are declared twice —
once declaratively in `meta.phases` (pre-registered by the seed loop at `:387218`) and again
imperatively by `phase('Scan')` calls in the script body, *plus* a third time by `opts.phase` on
individual `agent()` calls (`:387323-387324`). Interning by title is what makes all three converge
on one group. The tool prose states the contract — *"Use the SAME phase titles in `meta.phases` as
in `phase()` calls — titles are matched exactly"* (`:388985`) — and `Map.get` on the raw
string is what "exactly" means: no trimming, no case folding.

**Two orderings the seed loop guarantees:** (a) declared phases get indices 1..N *before* any agent
runs, so the `/workflows` progress tree renders the full skeleton immediately rather than growing it;
(b) an undeclared `phase()` title lands after them, which is why the renderer's fallback group is
`phaseIndex: 0` / `"Agents"` (`:651233`) — index 0 can never collide with a real phase.

The `kind` argument is only ever `"child"`, passed by the nested-workflow host (`:386863`); top-level
`phase()` leaves it `undefined`.

### 6.4 `workflow()` — one level of nesting

`createNestedWorkflowHost` (`DSd`, `:386829-386945`) builds a **second, sibling VM context** for the
child (`:386880`) but deliberately does **not** build a second host-object set. Instead it forwards:

| Child global | Bound to | Anchor |
|---|---|---|
| `agent` | parent's `hooks.agent`, with `phase` forced to the child's group label | `:386893-386902` |
| `parallel`, `pipeline` | parent's, unchanged | `:386903-386904` |
| `workflow` | a rejecting stub | `:386905-386910` |
| `budget` | the parent's frozen budget object | `:386872` |
| `log`, `console` | parent's `hooks.log`, prefixed `` `[${name}] ` `` (`d`, `:386864`) | `:386876-386877` |
| `phase` | **a no-op** (`eve((g) => {})`) | `:386875` |
| `setTimeout` / `clearTimeout` | the parent's tracked timers | `:386873-386874` |

**Why `phase` is a no-op in a child:** the child's agents are *already* pinned to one group — the
label `` `${Txt} ${a}${c > 1 ? ` #${c}` : ""}` `` (i.e. `▸ name`, `▸ name #2`, …, `:386862`) —
and `agent()` overrides `phase: u` unconditionally (`:386901`). Letting a child call `phase()` would
either create sibling top-level groups (breaking the "child runs under one ▸ box" contract the tool
prose promises at `:388995`) or silently do nothing. Making it an explicit no-op is the honest
version of "silently do nothing", and it means a script written to run standalone *or* nested behaves
identically either way.

**Why nesting stops at one level:** the rejecting stub's message says it — *"nesting is limited to one
level. Inline the inner script or call its agents directly."* The reason is that the *concurrency cap
and the agent counter live in the parent*, so arbitrary nesting would produce a tree whose total width
is bounded but whose *scheduling* is not observable at any single point; and the phase model has no
representation for a group inside a group. The counter `t` (`:386860-386861`) that produces `#2`, `#3` suffixes
is per-name, so the same child workflow invoked twice gets two distinct groups.

**Verdict: CARRYOVER.** `nesting is limited to one level` and
`workflow() cannot be called from within a child workflow` are both 220=1 / 193=1.

---

## 7. Per-agent execution

### 7.1 The retry ladder

An `agent()` call can run its subagent up to **seven** times. The ladder, in order:

| Rung | Trigger | Count | Anchor |
|---|---|---|---|
| 1 | first attempt | 1 | `:387777` |
| 2 | **throttle retry** — response with no `stop_reason`, `<50` output tokens, and `durationMs > stallMs × 0.5` | 1, after a 45 s sleep | `:387778-387812` |
| 3–7 | **stall retry** — `USd = 5` attempts | 5 | `:387815-387838`, `USd` `:388132` |

The throttle detector is the interesting one:

```javascript
// ============================================
// isThrottledResponse - Heuristic for a server-side throttle that looks like a normal completion
// Location: cli_inner_pretty.js:387778-387784
// ============================================

// ORIGINAL (for source lookup):
fr = (_r) =>
  !_r.stalled && !_r.skipped && _r.stopReason == null && _r.structured === void 0 &&
  (_r.outputTokens ?? 1 / 0) < 50 && _r.durationMs > Te * 0.5,

// READABLE (for understanding):
const isThrottledResponse = (result) =>
  !result.stalled &&                       // it did not time out …
  !result.skipped &&                       // … and the user did not skip it …
  result.stopReason == null &&             // … but the API never told us why it stopped …
  result.structured === undefined &&       // … and no StructuredOutput came back …
  (result.outputTokens ?? Infinity) < 50 &&// … and it produced almost nothing …
  result.durationMs > stallMs * 0.5;       // … after burning >half the stall window.

// Mapping: fr→isThrottledResponse, _r→result, Te→stallMs
```

**Why these six conjuncts:** a throttled turn is *indistinguishable from a fast empty answer* on any
single signal. `stopReason == null` alone also matches a clean abort; `outputTokens < 50` alone also
matches a legitimately terse agent; `durationMs > stallMs/2` alone also matches a slow but productive
agent. The conjunction — *took a long time, produced nothing, and never said why it stopped* — has no
benign explanation. The `?? Infinity` default is the safe direction: if the usage block is missing
entirely, the predicate is false and no 45 s sleep is imposed.

**Why 45 seconds and why exactly one retry:** the sleep is longer than any per-request backoff the
HTTP layer would apply (it is waiting out a *server-side* rate window, not a transient), and it is
abort-aware (`await vr(45000, U.abortController?.signal, { throwOnAbort: !0 })`, `:387798`). Only one
throttle retry is attempted because a second failure means the account is rate-limited, not that this
request was unlucky — the code says so in the log (`"throttle-retry also degraded — giving up on
throttle backoff"`, `:387810`). Crucially, `Lt` (the *first* attempt's throttle verdict) is captured
before the retry and then used to **suppress the stall ladder** (`It.stalled && !Lt`, `:387815`), so a
throttled agent gets 2 attempts, not 7.

Token/tool-call/duration counters are accumulated *across* rungs (`At += It.tokens`, `:387799`,
`:387834`) so the progress row shows cumulative cost, while `durationMs` in the returned object is
per-attempt. Two different meanings for two different consumers.

**Verdict: CARRYOVER.** `throttled response` 220=1 / 193=1; `stallMs` 220=1 / 193=1; `USd = 5` has an
equivalent in 193.

### 7.2 `{schema}` — the structured-output contract

When `opts.schema` is present, four things change:

1. The schema is compiled to a `StructuredOutput` tool via `wir` (`:387454`); an invalid schema throws
   `TypeError("agent({schema}) received an invalid JSON Schema: …")` (`:387455`). The validator itself
   is documented in [workflow_runtime_and_ui.md §8](workflow_runtime_and_ui.md).
2. The agent definition switches from `eMs` (`workflow-subagent`) to `t6y`, whose system prompt is
   `e6y` — a MUST-call-StructuredOutput variant (`:388201-388207`, `:388217`).
3. The tool list has any pre-existing `StructuredOutput` filtered out and the compiled one appended
   (`:387466`), so the guest's schema always wins.
4. A retry cap is enforced *inside the stream loop*: `On = Z.MAX_STRUCTURED_OUTPUT_RETRIES ?? n6y`
   (`:387570`, `n6y = 5` at `:388133`) counts **failed** `StructuredOutput` tool results and throws
   once `Xr >= On` with no valid output yet (`:387611-387616`).

There is also a **success short-circuit** that is easy to miss (`:387630-387633`):

```javascript
// ORIGINAL:  if ((rt++, (Or = Ji.input), Qn.add(Ji.id), yr !== void 0 && rt > 2)) { Xe.abort("stalled"); break; }
// READABLE:  structuredAttempts++; lastStructuredInput = block.input; pendingStructuredIds.add(block.id);
//            if (structuredOutput !== undefined && structuredAttempts > 2) { abort("stalled"); break; }
```

If a valid structured output has already been captured and the agent calls `StructuredOutput` a
third time, the agent is aborted with reason `"stalled"` — and the `"stalled"` handler has a special
case (`:387645-387663`) that **returns the captured output as a success**, with `stalled: false`.
This is a graceful stop for the common failure of a model that keeps "improving" its answer: the
first valid result is kept, the tokens are not.

**Why `> 2` rather than `> 1`:** one retry after a success is tolerated (a model that re-emits an
identical payload is harmless and abundant); the third is treated as a loop.

### 7.3 `{agentType}` — resolution and permission gating

```javascript
// ============================================
// resolveWorkflowAgentType (excerpt) - Look up a custom agent type, honour Agent-tool permission rules
// Location: cli_inner_pretty.js:387428-387451
// ============================================

// ORIGINAL (for source lookup):
if (ve?.agentType != null) {
  let It = String(ve.agentType),
    fr = U.options.agentDefinitions.activeAgents,
    Lt = En(U), Tr = Rft(fr, Lt, qo),
    _r = Tr.find((Nn) => Nn.agentType === It);
  if (!_r) {
    if (fr.some((Nn) => Nn.agentType === It)) {
      let Nn = Rze(Lt, qo, It);
      throw Error(`agent({agentType}): '${It}' is denied by permission rule '${qo}(${It})' from ${Nn?.source ?? "settings"}.`);
    }
    throw Error(`agent({agentType}): agent type '${It}' not found. Available agents: ${Tr.map((Nn) => Nn.agentType).join(", ")}`);
  }
  let Wr = [...(_r.disallowedTools ?? []), ...(eMs.disallowedTools ?? [])],
    rn = ve.schema ? ZWy : QWy,
    $n = ve.schema && !YIs(_r.tools) ? [...(_r.tools ?? []), Eg] : _r.tools;
  Ce = ME(_r)
    ? { ..._r, disallowedTools: Wr, tools: $n, getSystemPrompt: (Nn) => _r.getSystemPrompt(Nn) + rn }
    : { ..._r, disallowedTools: Wr, tools: $n, getSystemPrompt: () => _r.getSystemPrompt() + rn };
}

// READABLE (for understanding):
if (opts?.agentType != null) {
  const wanted = String(opts.agentType);
  const allAgents = ctx.options.agentDefinitions.activeAgents;
  const permCtx  = getPermissionContext(ctx);
  const permitted = filterAgentsByPermission(allAgents, permCtx, AGENT_TOOL_NAME);
  const found = permitted.find((a) => a.agentType === wanted);
  if (!found) {
    if (allAgents.some((a) => a.agentType === wanted)) {           // exists, but denied
      const rule = findDenyRule(permCtx, AGENT_TOOL_NAME, wanted);
      throw new Error(`agent({agentType}): '${wanted}' is denied by permission rule `
                    + `'${AGENT_TOOL_NAME}(${wanted})' from ${rule?.source ?? "settings"}.`);
    }
    throw new Error(`agent({agentType}): agent type '${wanted}' not found. `
                  + `Available agents: ${permitted.map((a) => a.agentType).join(", ")}`);
  }
  const disallowed = [...(found.disallowedTools ?? []), ...WORKFLOW_SUBAGENT_DEF.disallowedTools];
  const suffix     = opts.schema ? STRUCTURED_OUTPUT_NOTE : WORKFLOW_RETURN_VALUE_NOTE;
  const tools      = opts.schema && !isWildcardTools(found.tools)
                   ? [...(found.tools ?? []), STRUCTURED_OUTPUT_TOOL] : found.tools;
  agentDef = isBuiltIn(found)
    ? { ...found, disallowedTools: disallowed, tools, getSystemPrompt: (x) => found.getSystemPrompt(x) + suffix }
    : { ...found, disallowedTools: disallowed, tools, getSystemPrompt: ()  => found.getSystemPrompt()  + suffix };
}

// Mapping: ve→opts, It→wanted, fr→allAgents, Lt→permCtx, Rft→filterAgentsByPermission,
//          qo→AGENT_TOOL_NAME (:162358), Tr→permitted, _r→found, Rze→findDenyRule,
//          Wr→disallowed, rn→suffix, ZWy→STRUCTURED_OUTPUT_NOTE (:388196), QWy→WORKFLOW_RETURN_VALUE_NOTE (:388122),
//          $n→tools, Eg→STRUCTURED_OUTPUT_TOOL, ME→isBuiltIn, YIs→isWildcardTools, Ce→agentDef
```

Four design points:

- **`agent({agentType})` inherits the Agent tool's permission rules verbatim.** The registry is
  filtered by `Rft(fr, Lt, qo)` where `qo` is the *Agent* tool's name — so a
  `deny: ["Agent(deploy-bot)"]` rule blocks `agent({agentType:'deploy-bot'})` inside a workflow too.
  This closes what would otherwise be a trivial policy bypass: a workflow script is *code*, and the
  Workflow tool is approved once, so per-agent-type rules would be unenforceable if the runtime
  looked at the unfiltered registry.
- **Denied and missing are distinguished** — a denied type reports the exact rule and its source
  file, a missing type lists the *permitted* alternatives (never the denied ones, which would leak
  the existence of restricted agents).
- **`disallowedTools` is the union, never the override.** A custom agent cannot re-enable the three
  tools the workflow subagent forbids: `eMs.disallowedTools = [SB, qo, dk]` (`:388212`) — Task,
  Agent, and `Workflow` itself. Blocking `dk` (`"Workflow"`, `:231211`) is the recursion guard: a
  workflow agent cannot launch another workflow, which is a stronger constraint than the one-level
  nesting limit on `workflow()`.
- **The return-value note is appended, not substituted.** The custom agent keeps its own system
  prompt and gains a suffix explaining that its final text is a return value (`QWy`, `:388122-388126`)
  or that it must call `StructuredOutput` (`ZWy`, `:388196-388200`). This is why an agent authored for
  interactive use behaves correctly under `agent()` without modification.

**Verdict: CARRYOVER** for the mechanism (`agent({agentType})` 220=2 / 193=2,
`denied by permission rule` 220=4 / 193=4).

### 7.4 DELTA — the auto-mode hand-off classifier

This is the one behavioural change of substance in the executor, and it is **not in the changelog**.

Measured: inside the executor body, `agentMessages` appears **220=7 / 193=0**
(`awk 'NR>=387149 && NR<=388105' | grep -cF agentMessages` → 7;
`awk 'NR>=423445 && NR<=424279' | grep -cF agentMessages` → 0 in the baseline).

Three cooperating lines:

```javascript
// ============================================
// Auto-mode handoff review for workflow subagents
// Location: cli_inner_pretty.js:387468 (flag), :387562 (buffer), :387865-387883 (review)
// ============================================

// ORIGINAL (for source lookup):
lt = ze.mode === "auto",                                        // :387468
dn = lt ? [] : void 0,                                          // :387562
...
if (lt && It.agentMessages) {                                   // :387865
  let _r = await tin({ agentMessages: It.agentMessages, tools: He, toolPermissionContext: ze,
                       abortSignal: U.abortController.signal, subagentType: Ue.agentType,
                       totalToolUseCount: Nt + It.toolCalls });
  if (_r)
    if (Ne) {                                                   // schema mode
      let Wr = `[${te}] ${_r}`;
      (C.push(Wr), r({ type: "progress", toolUseID: "workflow_log",
                       data: { type: "workflow_log", message: Wr } }));
    } else It.text = `${_r}\n\n${It.text}`;                     // text mode
}

// READABLE (for understanding):
const isAutoMode = permCtx.mode === "auto";
let agentMessages = isAutoMode ? [] : undefined;    // only buffer the transcript when it will be reviewed
…
if (isAutoMode && result.agentMessages) {
  const warning = await reviewSubagentHandoff({
    agentMessages: result.agentMessages, tools: availableTools, toolPermissionContext: permCtx,
    abortSignal: ctx.abortController.signal, subagentType: agentDef.agentType,
    totalToolUseCount: toolCallsSoFar + result.toolCalls,
  });
  if (warning) {
    if (structuredOutputTool) {                     // {schema}: the text channel is not the return value
      const line = `[${label}] ${warning}`;
      failures.push(line);
      emitProgress({ type: "progress", toolUseID: "workflow_log",
                     data: { type: "workflow_log", message: line } });
    } else {
      result.text = `${warning}\n\n${result.text}`; // prepend, so the script sees it first
    }
  }
}

// Mapping: lt→isAutoMode, ze→permCtx, dn→agentMessages, tin→reviewSubagentHandoff (:345816),
//          It→result, He→availableTools, Ue→agentDef, Ne→structuredOutputTool, C→failures,
//          te→label, Nt→toolCallsSoFar
```

**What `reviewSubagentHandoff` does** (`tin`, `:345816-345875`): if the permission mode is `auto`
and the transcript touched anything the block rules care about (`Cpd`), it runs the transcript plus a
synthetic reviewer turn through the two-stage auto-mode classifier, emits
`tengu_auto_mode_decision` with `isHandoff: true`, and returns either `null` (clean) or a
`SECURITY WARNING: …` string. If the classifier is unavailable it fails **open** with a warning
(`:345866-345871`).

**Why this had to be added to the workflow path specifically:** in auto mode the main agent's own
tool calls are pre-screened, but a workflow subagent's are screened only against *its* context. The
subagent then hands back a string that the script may interpolate into another agent's prompt or
return to the main agent as the workflow result — laundering unreviewed output through a trusted
channel. Reviewing at the hand-off boundary closes that path. It is the same boundary the Task tool
already guarded (`isHandoff` was in the event schema at `:431163 (193)` for that path), now extended
to workflow agents.

**Why the `{schema}` branch diverges — and why it is the right call.** When `Ne` is set, the return
value is `It.structured`, not `It.text` (`:387889`). Prepending a warning to `text` would be
invisible; injecting it into the structured payload would violate the schema the script is about to
consume. So the warning is routed to two out-of-band channels instead: `failures` (which reaches the
main agent inside `<failures>` in the completion notification, `:386730-386736`) and a
`workflow_log` line (which reaches `/workflows` and the log tail). The result is that the *script*
never sees the warning but the *human and the main agent* both do — deliberately, since a script
cannot be trusted to act on a security warning about its own agent.

**Cost note:** `dn = lt ? [] : void 0` means the full message array is retained in memory for the
whole agent run *only* in auto mode. Outside auto mode the buffer is `undefined` and every
`dn?.push(...)` (`:387604`, `:387621`) is a no-op — a deliberate memory optimisation, since a
50-agent fan-out retaining every transcript would be substantial.

---

## 8. Cross-realm value marshalling

Every value that crosses the host↔guest boundary passes through one of six closures, all installed by
`bindVMAwait` (`:388099-388101`) and all **compiled inside the guest realm**:

- `settle` (`Wfr`, `:385489`) — `(async v => ({__proto__: null, v: await v}))`. Awaits a guest
  thenable *in the guest*, so a malicious `then` runs under guest intrinsics.
- `call` (`ASd`, `:385492`) — `((fn, ...args) => fn(...args))`. Invokes a guest function without the
  host's `Function.prototype.apply` ever touching it.
- `clone` (`Ixo`, `:385515`) — a deep copy built from captured guest intrinsics
  (`_WeakMap`, `_isArray`, `_keys`, `_defineProperty`, …), so re-defining `Array.isArray` in the
  guest after the closure is compiled cannot subvert it.
- `sanitize` / `snapshot` / `getProp` (`Oxo`, `:385751`).

Plus, on the host side:

- `readGuestArray` (`Pxo`, `:385726-385737`) — reads `length` via `assertSafeArrayLength` (`TSd`,
  `:385676-385687`) which rejects a non-safe-integer length and caps it at `Aft = 4096` (`:385841`),
  then indexes with a per-element `try`. A hostile `length` getter or throwing index accessor
  degrades to `undefined`, never to an unbounded loop.
- `describeGuestValue` (`Lxo`, `:385643-385646`) — `String(e)` for primitives, `` `[${typeof e}]` ``
  for objects/functions. Used for prompts and log messages so that a guest object with a hostile
  `toString` cannot execute during logging.
- `readGuestError` (`Rsn`, `:385631-385642`) + `makeGuestError` (`w2e`, `:385595-385602`) — extract
  `name`/`message`/`stack` through **independent** `try` blocks (the in-source comment: *"a throwing
  `.name` getter must not discard an already-validated `.message`"*), then rebuild a frozen,
  null-prototype error object to throw back into the guest.
- `eve` / `Dxo` (`:385647`, `:385658`) wrap every host callable so that any host exception is
  re-thrown as a guest-shaped frozen error — the guest can never catch a host `Error` instance and
  walk `err.constructor.constructor` out of the sandbox.

**Key insight:** the whole marshalling layer is built on one rule — *never let a host intrinsic
touch a guest value, and never let a guest object reach the host with its prototype intact*. Every
one of the six closures is a `runInContext` string precisely so the operation happens on the guest
side of the boundary. The `Isn`/`TSd` pair is the sole exception (host code walking a guest object),
and it is hardened with an explicit length cap and per-property `try` for that reason.

**Verdict: CARRYOVER.** All measured literals are 1/1 across the two bundles.

---

## 9. What a reader should take away

1. **Concurrency is one FIFO semaphore per run at `min(16, cpus−2)`, and nothing else.** No priority,
   no per-phase width, no global cross-workflow limit. Two workflows launched together get
   `2 × min(16, cpus−2)` concurrent agents; the *only* global brake is the shared token budget.
2. **The caps are asymmetric on purpose**: width 2–16 (throughput), lifetime 1,000 (runaway), budget
   turn-scoped (cost). Each guards a different failure and each has its own telemetry event with a
   one-shot latch.
3. **Determinism is a resume requirement, enforced twice** — an AST pre-check for ergonomics and a
   frozen `Date`/`Math.random` shim for correctness. The shim's `RealDate.prototype.constructor`
   re-point plus `Object.freeze` is the non-obvious part.
4. **The sandbox is built inside-out.** Six marshalling closures are compiled in the guest realm and
   late-bound into the host objects; `args` crosses only as a JSON source literal.
5. **`isolation: 'remote'` is complete, wired, and unreachable in both 2.1.193 and 2.1.220** — with a
   50-wide semaphore and a branch-freshness warning that can never fire.
6. **The one real behavioural DELTA in this layer is the auto-mode hand-off classifier**, absent from
   the changelog and from the tool prose, which reviews every workflow subagent's transcript before
   its result reaches the script — and routes the verdict differently for `{schema}` agents because
   their text channel is not their return channel.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_workflow.md](../00_overview/symbol_additions_v2_1_220_workflow.md).

Key functions in this document:
- `createWorkflowHostObjects` (zSd) - `:387149-388105` — the runtime; owns every counter, semaphore and cap
- `buildWorkflowVMContext` (eEd) - `:388358-388429` — VM context assembly and late binding
- `runWorkflowScript` (rEd) - `:388439-388529` — run, race against abort, normalise result/error
- `createLimiter` (AB) - `:162762-162781` — the generic FIFO semaphore
- `computeAgentConcurrency` (zWy) - `:387140-387142` — `min(16, max(2, cpus−2))`
- `assertAgentCap` (L, inner) - `:387190-387194` — the 1,000-call backstop
- `assertTokenBudget` (P, inner) - `:387195-387201` — turn-scoped shared budget
- `WorkflowAgentCapError` (qSd) - `:388182-388187`
- `WorkflowBudgetExceededError` (VSd) - `:388188-388195`
- `executeLocalAgent` (K, inner) - `:387420-387901` — agent-type resolution, model, worktree, retry ladder
- `executeRemoteAgent` (re, inner) - `:387907-388015` — **dead code** (see §5)
- `resolvePhase` (W, inner) - `:387206-387218` — title interning and `workflow_phase` emission
- `createNestedWorkflowHost` (DSd) - `:386829-386945` — the one-level `workflow()` child
- `compileWorkflowScript` (Cft) - `:386354-386376` — await-transform + `vm.Script`
- `rewriteAwaitsForVM` (jWy) - `:386287-386353` — the `__wRg$` await wrapper pass
- `hasNondeterministicCall` (Uxo) - `:386412-386438` — the AST pre-check
- `createGuestTimers` (xSd) - `:386250-386286` — abort-aware, leak-free `setTimeout`
- `hardenVMIntrinsics` (V$t) - `:385349-385488` — name leaked in its own comment at `:385364`; shared with the REPL tool
- `readGuestArray` (Pxo) - `:385726-385737` and `assertSafeArrayLength` (TSd) - `:385676-385687`
- `deepCloneAcrossVM` (Isn) - `:385688-385725` — host-side bounded deep copy
- `reviewSubagentHandoff` (tin) - `:345816-345875` — the auto-mode hand-off classifier (§7.4)
- `summariseWorkflowAgents` (Ivn) - `:651292-651309` — queued-vs-started discrimination
