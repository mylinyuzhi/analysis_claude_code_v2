# MCP tool-call **auto-backgrounding** (`.212`) — `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`

> **Type:** NET-NEW capability on top of a carryover task surface · **Version:** 2.1.212 · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`).
> Every `cli_inner_pretty.js:<line>` below is a **2.1.220** line that I read; baseline lines are tagged `(193)`.

## TL;DR

A single MCP tool call that has not returned after **120 000 ms** is converted into a background
`mcp_task`, and the model gets an immediate text result telling it the work continues and a
notification will arrive later. The threshold is `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`
(**220=3 / 193=0**; accessor `:32120`, read `:288858`) and the feature is behind the remote gate
`tengu_mcp_auto_background` (default **on**, `:288860`). Each promotion emits
`tengu_mcp_tool_auto_backgrounded` (`:288896`).

**What is NOT new:** the `mcp_task` registry entry type, the task watcher, the notification builder and
the `/tasks`-style UI rows are all carryover — `mcp_task` is **220=33 / 193=22**, and 2.1.193 already had
`restoreMcpTasks` and `mcp_task_complete` telemetry (`:679196-679241 (193)`). Those existed to support
*server-declared* async tasks (the MCP `tasks` protocol extension, where the **server** answers "this is
a task, poll me"). The `.212` delta is the **client-initiated** path: the client now unilaterally decides
a still-running synchronous call should become a task. Do not describe the task registry as new.

---

## 1. The threshold and its three kill switches — `getMcpAutoBackgroundMs`

```javascript
// ============================================
// getMcpAutoBackgroundMs - per-call auto-background deadline in ms (0 = disabled)
// Location: cli_inner_pretty.js:288854-288861
// ============================================

// ORIGINAL (for source lookup):
function SEy(e, { isNonInteractiveSession: t = !1 } = {}) {
  if (bEy.has(e?.type ?? "")) return 0;
  if (LE()) return 0;
  if (t && !Z.CLAUDE_AUTO_BACKGROUND_TASKS) return 0;
  let r = Z.CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS;
  if (r !== void 0) return Math.min(Math.max(0, r), _Ey);
  return Ke("tengu_mcp_auto_background", !0) ? yEy : 0;
}

// READABLE (for understanding):
function getMcpAutoBackgroundMs(serverConfig, { isNonInteractiveSession = false } = {}) {
  if (AUTO_BACKGROUND_EXCLUDED_TRANSPORTS.has(serverConfig?.type ?? "")) return 0;  // 1. IDE transports
  if (isBackgroundTasksDisabled()) return 0;                                        // 2. global kill switch
  if (isNonInteractiveSession && !env.CLAUDE_AUTO_BACKGROUND_TASKS) return 0;       // 3. headless opt-in
  let override = env.CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS;
  if (override !== undefined) return Math.min(Math.max(0, override), MAX_INT32);    // 4. env wins, clamped
  return getFeatureValue("tengu_mcp_auto_background", true) ? DEFAULT_AUTO_BACKGROUND_MS : 0;
}

// Mapping: SEy→getMcpAutoBackgroundMs, bEy→AUTO_BACKGROUND_EXCLUDED_TRANSPORTS, LE→isBackgroundTasksDisabled,
//          Z→env, Ke→getFeatureValue, yEy→DEFAULT_AUTO_BACKGROUND_MS (120000), _Ey→MAX_INT32 (2147483647)
```

Constants, read verbatim at `:288970-288972`: `yEy = 120000`, `_Ey = 2147483647`, and
`bEy = new Set(["sse-ide", "ws-ide"])` at `:288986`.
`LE()` is `:230330-230332` → `return Z.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`.

### Decision: the ordering of the four gates

**What it does:** resolves one number — the milliseconds after which this specific call is promoted —
and returns `0` to mean "never promote".

**How it works:**
1. **Transport exclusion first.** `sse-ide` / `ws-ide` are the two IDE-extension transports. They are
   excluded *before* anything else because backgrounding them is meaningless: the IDE call is a local
   round trip to an editor that is already interactive, and its "result" is often a UI side effect. Note
   what is **not** excluded — `stdio`. A local subprocess tool *can* be auto-backgrounded, which is a
   deliberate difference from the idle-timeout resolver (which historically skipped `stdio` entirely; see
   [`oauth_timeouts_and_reconnect.md`](./oauth_timeouts_and_reconnect.md) §2).
2. **Global kill switch.** `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` is the session-wide "no background
   anything" flag shared with the Bash auto-background path — one switch turns off both, so a user who
   disabled background Bash does not get surprised by background MCP.
3. **Headless is opt-**in**, not opt-out.** In a non-interactive session the feature is *off* unless
   `CLAUDE_AUTO_BACKGROUND_TASKS` is set (a **carryover** env var: 220 accessor `:32200`, 193=2 hits).
   Rationale: promotion is only useful if something later consumes the notification. In `claude -p` the
   process may exit before the task finishes, and the tail of the result text says exactly that —
   *"it does not survive exiting this session"* (`:288965`). Fail-closed for headless is the right
   default; the same env var already gates Bash auto-backgrounding at `:398087`
   (`if (Yt(process.env.CLAUDE_AUTO_BACKGROUND_TASKS)) return 120000;` — note the **same 120 s number**).
4. **Env override beats the gate, and is clamped, not validated.** `Math.min(Math.max(0, r), _Ey)`
   means a negative value becomes `0` → *disabled*, and an absurd value is capped at Int32 max
   (`setTimeout`'s practical ceiling; a larger value would overflow the timer and fire immediately).
   There is no "must be ≥ 1000" floor, so `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS=1` really does background
   almost everything — a foot-gun the code accepts on purpose because the knob's main use is `0`.
5. **Gate last.** `tengu_mcp_auto_background` defaults to `!0`, so the feature ships **on**, and the gate
   exists to switch it *off* remotely if it misbehaves. Compare the sibling budgets shipped in the same
   release (`gty = 20`, `yty = 200`, `_ty = 200` at `:231411-231413`), which have **no** gate: Anthropic
   gated the one behaviour change that alters the *shape* of a tool result, not the ones that only refuse.

**Why this approach:** the resolver returns a *number* rather than a boolean plus a number, so the caller
has exactly one test (`if (ve > 0)`, `:295653`). Every disable reason collapses into `0`.

**Key insight:** the 120 000 ms default is not a tuning artefact — it is the *same* constant the Bash
tool uses for its timeout-to-background promotion (`:398087`). MCP was brought into line with an existing
product behaviour rather than given its own timing, which is why there is no separate "MCP" number to
explain.

---

## 2. The race, and the elicitation escape hatch — `callMcpToolWithAutoBackground`

```javascript
// ============================================
// callMcpToolWithAutoBackground - race the tool promise against the deadline; promote on timeout
// Location: cli_inner_pretty.js:288862-288896 (loop at :288882-288892)
// ============================================

// ORIGINAL (for source lookup):
async function EEy({ run: e, serverName: t, toolName: r, toolUseId: n, parentAbortController: o,
                     taskRegistry: i, autoBackgroundMs: s, hasPendingElicitation: a, onBackgrounded: l }) {
  let c = new AbortController(), u = v9r(o, c), d = Date.now(), p = e(c.signal),
    f = p.then(() => "settled", () => "settled"),
    m = new AbortController();
  try {
    while (!0) {
      if ((await Promise.race([f, vr(s, m.signal).then(() => "timeout")])) === "settled" || o.signal.aborted)
        return (u(), await p);
      if (a?.()) continue;
      break;
    }
  } finally { m.abort(); }
  u();
  let g = G9u({ serverName: t, toolName: r, toolUseId: n, abortController: c }), y = g.id, _ = g.description;
  (i.register(g), l?.(), O("tengu_mcp_tool_auto_backgrounded", {}));
  ...

// READABLE (for understanding):
async function callMcpToolWithAutoBackground({ run, serverName, toolName, toolUseId,
        parentAbortController, taskRegistry, autoBackgroundMs, hasPendingElicitation, onBackgrounded }) {
  let callAbort = new AbortController(),                      // the task's OWN controller, outlives the turn
    unlinkParent = linkAbortSignal(parentAbortController, callAbort),
    startedAt = Date.now(),
    callPromise = run(callAbort.signal),
    settled = callPromise.then(() => "settled", () => "settled"),   // never rejects: pure race token
    deadlineAbort = new AbortController();
  try {
    while (true) {
      let winner = await Promise.race([settled, sleep(autoBackgroundMs, deadlineAbort.signal).then(() => "timeout")]);
      if (winner === "settled" || parentAbortController.signal.aborted) {
        unlinkParent();
        return await callPromise;                             // normal (or aborted) completion path
      }
      if (hasPendingElicitation?.()) continue;                // user is being asked something -> re-arm
      break;                                                  // deadline hit with nobody waiting -> promote
    }
  } finally { deadlineAbort.abort(); }                        // always release the timer
  unlinkParent();                                            // task no longer dies with the turn
  let task = createMcpTaskDescriptor({ serverName, toolName, toolUseId, abortController: callAbort });
  taskRegistry.register(task);
  onBackgrounded?.();
  logEvent("tengu_mcp_tool_auto_backgrounded", {});
  ...

// Mapping: EEy→callMcpToolWithAutoBackground, v9r→linkAbortSignal (:165505), vr→sleep (:20457),
//          G9u→createMcpTaskDescriptor (:288810), O→logEvent, i→taskRegistry
```

### Algorithm: promote-on-deadline without leaking the call

**What it does:** runs the tool once, and either returns its real result or — if the deadline wins —
detaches the in-flight promise into a registry entry and returns a *synthetic* success to the model.

**How it works:**
1. **A private `AbortController` (`:288873`).** The call is started with `callAbort.signal`, **not** the
   turn's signal. `linkAbortSignal(parent, child)` (`:165505-165509`) forwards a parent abort to the child
   and returns an un-subscriber. This is the whole trick: while the call is still synchronous, aborting
   the turn must abort the tool; the moment it is promoted, `unlinkParent()` is called (`:288892`) and the
   task survives the end of the turn. Cancellation then only happens through the registry, which is why
   `abortController: callAbort` is stored on the descriptor (`:288821`) and why `TaskStop` can kill it
   (`:399530`: `if (r?.type === "mcp_task") r.abortController?.abort();`).
2. **`settled` is a rejection-proof race token (`:288877-288880`).** `p.then(() => "settled", () =>
   "settled")` converts *both* outcomes into the same string, so `Promise.race` can never reject and the
   real error is re-thrown later by `await p` (`:288885`). Without this, a fast-failing tool would throw
   out of the race and skip the `finally` teardown.
3. **The abortable sleep (`:288884`).** `vr(ms, signal)` (`:20457`) resolves on timeout *or* on abort. The
   `finally { m.abort(); }` guarantees the timer is cleared on every exit path — including the promotion
   path, where the loop `break`s out. Otherwise every long tool call would leak a live `setTimeout`.
4. **The elicitation guard — `if (a?.()) continue;` (`:288886`).** The call site supplies
   `hasPendingElicitation: () => ee || (ne.transportErrorState?.pendingElicitations ?? 0) > 0`
   (`:295662`). If the server has asked the *user* a question (MCP elicitation, e.g. a consent or
   URL-approval prompt), the deadline is **re-armed** instead of promoting. Backgrounding here would be
   actively wrong: the tool is not slow, the human is. Note it re-arms for the *full* window rather than
   the remaining time — a call that spends 3 minutes in an elicitation and then goes quiet still gets a
   fresh 120 s of grace.
5. **`onBackgrounded` (`:288871`, `:288896`).** The call site sets a local flag (`oe = !0`, `:295664`) so
   the surrounding MCP wrapper knows the result it is about to see is synthetic.

**Why a `while(true)` + `continue` rather than a timer reset:** the loop *is* the reset. Re-entering
`Promise.race` with the still-pending `settled` token and a brand-new `sleep` is the cheapest way to
extend a deadline without tracking "time already elapsed", and it keeps a single exit point for
teardown.

**Failure modes:** if `run()` rejects *after* promotion, the rejection lands in the detached handler at
`:288956-288958` and becomes a `failed` notification — it can never surface as an unhandled rejection
because both branches of `p.then(...)` at `:288952` are supplied. If the *parent* aborts exactly while
the deadline fires, the `|| o.signal.aborted` disjunct at `:288884` short-circuits to the normal path so
an interrupted turn does not spawn a stray task.

**Key insight:** the elicitation guard is the design's real content. Auto-backgrounding is trivially
implementable with a `Promise.race`; what makes this production code is that it distinguishes *"the
server is slow"* from *"the server is blocked on the user"*, and only the first is a reason to give up
waiting. The idle-timeout watchdog in 2.1.193 made the same distinction with the same state
(`pendingElicitations`, `lastElicitationClosedAt`) — this is that pattern reused.

---

## 3. Who may be promoted — the four-part call-site guard

```javascript
// ============================================
// MCP tool wrapper - the auto-background decision inside tool.call()
// Location: cli_inner_pretty.js:295649-295667 (v2 tree) · twin at :301191-301196 (v1 tree, DEFAULT)
// ============================================

// ORIGINAL (for source lookup):
if (Avs && !j.agentId && j.taskRegistry !== nBe && q.name !== yue()) {
  let ve = Avs.getMcpAutoBackgroundMs(e.config, { isNonInteractiveSession: j.options.isNonInteractiveSession });
  if (ve > 0)
    return Avs.callMcpToolWithAutoBackground({
      run: Te, serverName: e.name, toolName: L.name, toolUseId: Y,
      parentAbortController: j.abortController, taskRegistry: j.taskRegistry, autoBackgroundMs: ve,
      hasPendingElicitation: () => ee || (ne.transportErrorState?.pendingElicitations ?? 0) > 0,
      onBackgrounded: () => { oe = !0; },
    });
}
return Te(j.abortController.signal);

// READABLE (for understanding):
if (autoBackgroundModule && !ctx.agentId && ctx.taskRegistry !== NULL_TASK_REGISTRY
    && tool.name !== getPermissionPromptToolName()) {
  let deadlineMs = autoBackgroundModule.getMcpAutoBackgroundMs(server.config,
        { isNonInteractiveSession: ctx.options.isNonInteractiveSession });
  if (deadlineMs > 0) return autoBackgroundModule.callMcpToolWithAutoBackground({ /* … */ });
}
return runTool(ctx.abortController.signal);   // unpromotable: plain call

// Mapping: Avs→autoBackgroundModule (loaded at :294625), nBe→NULL_TASK_REGISTRY (:284586),
//          yue→getPermissionPromptToolName (:3307), Te→runTool, j→toolUseContext, oe→wasBackgrounded
```

The four conjuncts, and why each is required:

| Guard | Meaning | Why |
|---|---|---|
| `Avs` | the auto-background module resolved | lazy `require` at `:294625`; a build that trimmed it degrades to plain calls instead of crashing |
| `!j.agentId` | **not a subagent** | a subagent's turn ends when it returns; a task registered from inside it would have no live consumer for the notification, and its parent already has its own `TaskStop` bookkeeping |
| `j.taskRegistry !== nBe` | a *real* registry | `nBe` (`:284586-284600`) is an all-no-op registry (`register(){}`, `update(){}`, …) installed in contexts with no task surface (`:567161`, `:865105`, `:866417`). Registering into it would silently lose the task |
| `q.name !== yue()` | not the **permission-prompt tool** | `yue()` returns `permissionPromptToolName` (`:3307-3309`). Backgrounding the tool that *grants permissions* would deadlock: the turn would keep going while the approval it is waiting on is parked in the background |

**Key insight:** three of the four conjuncts are about *who will consume the notification*. The feature is
not "background slow things", it is "background slow things **whose result still has a reader**".

---

## 4. What the model sees, and what the user sees

On promotion the function returns a normal, non-error tool result (`:288961-288968`) — the model is never
told an error occurred:

> `MCP tool "<server/tool>" is still running after <N>s. It was moved to the background as task <id> and
> keeps running; you'll receive a notification with the result when it completes. You can keep working in
> the meantime. To stop it, use TaskStop with task_id "<id>". Note: it does not survive exiting this
> session.`

(`:288965`; `moved to the background` is **220=4 / 193=0**, the other three hits are the Bash/PowerShell
twins at `:431180`, `:438081` and an unrelated agent-view string at `:807437`.)

Four things are packed into that one string, deliberately: the elapsed time (so the model can judge
whether to wait), the task id, the *exact* recovery verb (`TaskStop with task_id`), and the durability
caveat. The model needs the caveat because it cannot otherwise know that "background" here means
in-process, not daemon-backed.

When the call finally lands, `E(status, …)` (`:288897-288951`) runs:
1. `taskRegistry.update(id, …)` with a **`notified` latch** (`:288902`: `if (L.notified) return L;`) —
   the single most important line in the completion path. Both the success and failure handlers can fire
   on odd orderings, and the latch makes the notification exactly-once. If the latch is already set,
   `H` stays `false` and the function returns before emitting anything (`:288916-288918`).
2. Per-outcome feature-health telemetry: `be("mcp_auto_background")` on success,
   `$e(..., "tool_error")` when `q9u(err)` classifies it as a *tool-level* error, else
   `pe(..., "call_failed")` (`:288919-288921`). `q9u` (`:288827-288835`) treats `DOMException
   TimeoutError`, two known error classes, an `HTTP 40[13]` `errorCode`, and the six names in `gEy`
   (`:288840-288847`) as "the tool failed" rather than "we failed" — so a 401 from a remote MCP server
   does not count against the auto-background feature's own health metric.
3. `dp({ value: buildMcpTaskNotification(...), mode: "task-notification", priority: "next" })`
   (`:288923-288937`) — enqueued as the *next* thing the agent sees, not injected mid-turn.
4. A degraded fallback if rendering the notification throws: a plain
   `MCP task <id> <status>; the result could not be rendered.` (`:288942`), and if even *that* enqueue
   throws, only a log (`:288948`). Two levels of graceful degradation for a notification — because
   losing the enqueue would leave the registry row `running` forever.

---

## 5. Delta evidence

| Anchor | 220 | 193 | Verdict |
|---|---|---|---|
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | 3 (`:32120`, `:58167`, `:288858`) | 0 | **NET-NEW** |
| `tengu_mcp_auto_background` | 1 (`:288860`) | 0 | **NET-NEW** |
| `tengu_mcp_tool_auto_backgrounded` | 1 (`:288896`) | 0 | **NET-NEW** |
| `moved to the background` | 4 | 0 | **NET-NEW** (MCP + Bash twins) |
| `mcp_task` | 33 | **22** | **CARRYOVER** — task type, watcher, restore, UI rows |
| `CLAUDE_AUTO_BACKGROUND_TASKS` | 3 | **2** | **CARRYOVER** env var, new third reader at `:288857` |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` (`LE`, `:230330`) | — | — | carryover kill switch, reused |

`CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` is also registered in the **settings-`env` allowlist** at `:58167`
(the `nHh` set, consulted by `n7t()` at `:57846-57849` and applied to `process.env` at `:267847`), so it
can be pinned per-project from a settings file's `env` block, not only from the shell. That list is
numeric/operational knobs only — its neighbours are `CLAUDE_CODE_MAX_RETRIES` (`:58163`) and
`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (`:58168`).

**Duplication caveat:** the two call sites (`:295649` and `:301191`) are the two MCP runtime trees, not a
double registration — see [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md). The
auto-background module itself (`:288849-288972`) is emitted **once** and imported by both.

---

## Cross-links

- [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md) — why every client-side line has a twin.
- [`oauth_timeouts_and_reconnect.md`](./oauth_timeouts_and_reconnect.md) — the *other* per-call clocks
  (hard timeout, idle timeout) that run alongside this one.
- 2.1.193 predecessor: [`../../../claude_code_v_2.1.193/analyze/39_mcp/tool_call_idle_timeout.md`](../../../claude_code_v_2.1.193/analyze/39_mcp/tool_call_idle_timeout.md)
  — the watchdog whose elicitation guard this feature reuses.
- [`README.md`](./README.md) — per-bullet ledger for the whole window.

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (**MCP** home)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_220_mcp.md](../00_overview/symbol_additions_v2_1_220_mcp.md) - this window's MCP additions

Key functions/constants in this document:

- `getMcpAutoBackgroundMs` (`SEy`, `cli_inner_pretty.js:288854`) - resolves the promotion deadline; `0` disables.
- `callMcpToolWithAutoBackground` (`EEy`, `cli_inner_pretty.js:288862`) - the race + promotion.
- `DEFAULT_AUTO_BACKGROUND_MS` (`yEy`, `cli_inner_pretty.js:288970`) - `120000`.
- `MAX_AUTO_BACKGROUND_MS` (`_Ey`, `cli_inner_pretty.js:288971`) - `2147483647` clamp.
- `AUTO_BACKGROUND_EXCLUDED_TRANSPORTS` (`bEy`, `cli_inner_pretty.js:288986`) - `Set(["sse-ide","ws-ide"])`.
- `createMcpTaskDescriptor` (`G9u`, `cli_inner_pretty.js:288810`) - builds the `type: "mcp_task"` registry row.
- `isToolLevelError` (`q9u`, `cli_inner_pretty.js:288827`) - splits "tool failed" from "we failed".
- `MCP_ERROR_CLASS_NAMES` (`gEy`, `cli_inner_pretty.js:288840`) - the six error class names.
- `isBackgroundTasksDisabled` (`LE`, `cli_inner_pretty.js:230330`) - `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`.
- `NULL_TASK_REGISTRY` (`nBe`, `cli_inner_pretty.js:284586`) - no-op registry that blocks promotion.
- `getPermissionPromptToolName` (`yue`, `cli_inner_pretty.js:3307`) - the tool that may never be backgrounded.
- `linkAbortSignal` (`v9r`, `cli_inner_pretty.js:165505`) - parent→child abort forwarding + un-subscribe.
- `sleep` (`vr`, `cli_inner_pretty.js:20457`) - abortable delay used as the deadline.
