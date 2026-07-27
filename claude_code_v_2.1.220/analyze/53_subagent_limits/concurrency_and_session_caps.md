# The three budget caps: concurrency, per-session spawns, per-session web searches

**Bundle:** `cli_inner_pretty.js` = `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
Baseline citations are tagged `(193)`.

Three bullets, two releases, one design:

| Version | Bullet |
|---|---|
| `.212` | *"Added a session-wide limit on WebSearch tool calls (default 200, tunable via `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) to stop runaway search loops"* |
| `.212` | *"Added a per-session cap on subagent spawns (default 200, override with `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`) to stop runaway delegation loops; `/clear` resets the budget"* |
| `.217` | *"Added a cap on concurrently-running subagents (default 20, override with `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) so one message can't fan out unbounded background agents"* |

All three are **genuinely net-new** — the env-var literals are `220>0 / 193=0` in every case, and so is the
whole counter surface they read (`runningSubagents`, `takeConcurrencySlot`, `resetTotalAgentSpawns`,
`resetWebSearchCalls`: combined `grep -c` is **193=0**).

---

## 1. The complete site inventory (this is the whole feature)

Each of the four subagent-limit env vars occurs a countable number of times, and every occurrence is
accounted for. Nothing else in the bundle touches them.

| Env var | accessor | settings-`env` allow-list | reader | model-facing refusal | total |
|---|---|---|---|---|---|
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | `:32125` | — | `:231400` | `:398411` | 3 |
| `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | `:32123` | — | `:230897` | `:398328` | 3 |
| `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` | `:32124` | **`:58164`** | `:231403` | `:398397` | 4 |
| `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` | `:32122` | **`:58166`** | `:231406` | `:403669` | 4 |

### The asymmetry nobody documents: only two of the four are settable from `settings.json`

`:58164` and `:58166` are members of the set built at `:57993-58175`, consulted by:

```javascript
// ============================================
// isSettingsEnvVarAllowed - decides whether a settings.json `env` entry may be written into process.env
// Location: cli_inner_pretty.js:57846-57849
// ============================================

// ORIGINAL (for source lookup):
function n7t(e, t) {
  let r = e.toUpperCase();
  return nHh.has(r) || (oHh.has(r) && Yt(t));
}

// READABLE (for understanding):
function isSettingsEnvVarAllowed(name, value) {
  let upper = name.toUpperCase();
  return SETTINGS_ENV_ALLOWLIST.has(upper)                            // unconditionally allowed
      || (SETTINGS_ENV_OPT_OUT_ONLY.has(upper) && parseBoolean(value)); // telemetry kill switches
}

// Mapping: n7t→isSettingsEnvVarAllowed, nHh→SETTINGS_ENV_ALLOWLIST (:57993),
//          oHh→SETTINGS_ENV_OPT_OUT_ONLY (:58176), Yt→parseBoolean
```

Its consumer at `:267847` is the settings-`env` merge:
`for (let { key: r, value: n } of e.values()) if (n7t(r, n)) process.env[r] = n;`

**Consequence:** `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` and `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` can be
committed into a repo's `.claude/settings.json` `env` block and will take effect. The **concurrency** and
**spawn-depth** caps cannot — they are process-environment-only.

**Why:** the two session budgets are *policy* ("this repo's agents shouldn't issue more than N searches"),
which a project or an enterprise wants to pin. Concurrency is a *resource* setting that depends on the
machine, and depth is the safety cap the depth doc shows is remotely tunable via
`tengu_hazel_trellis` — putting either in a repo file would let a checkout raise a machine-level or
safety-level limit. This is the same reasoning that keeps them out of the `--dangerously-*` surface.
It is invisible in the changelog, which presents all four as symmetric env overrides.

---

## 2. The readers: three plain constants, no gate, no validation

```javascript
// ============================================
// getMaxConcurrentSubagents / getMaxSubagentsPerSession / getMaxWebSearchesPerSession
// Location: cli_inner_pretty.js:231399-231413
// ============================================

// ORIGINAL (for source lookup):
function gPu() {
  return Z.CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS ?? gty;
}
function Q7r() {
  return Z.CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION ?? yty;
}
function yPu() {
  return Z.CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION ?? _ty;
}
var WVe, jpo, kir, gty = 20, yty = 200, _ty = 200, _Pu, Gpo;

// READABLE (for understanding):
function getMaxConcurrentSubagents()  { return env.CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS   ?? DEFAULT_MAX_CONCURRENT_SUBAGENTS; }
function getMaxSubagentsPerSession()  { return env.CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION  ?? DEFAULT_MAX_SUBAGENTS_PER_SESSION; }
function getMaxWebSearchesPerSession(){ return env.CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION ?? DEFAULT_MAX_WEB_SEARCHES_PER_SESSION; }
var DEFAULT_MAX_CONCURRENT_SUBAGENTS = 20,
    DEFAULT_MAX_SUBAGENTS_PER_SESSION = 200,
    DEFAULT_MAX_WEB_SEARCHES_PER_SESSION = 200;

// Mapping: gPu→getMaxConcurrentSubagents, Q7r→getMaxSubagentsPerSession, yPu→getMaxWebSearchesPerSession,
//          gty/yty/_ty→the three defaults, Z→typed env facade
```

### Decision: plain constants here, a gate for depth

**What it does:** resolves each budget from `env ?? const`, with no remote lever and no re-validation.

**How it works:** the env accessors are declared `De.int({ min: 1, digitsOnly: !0 })` at `:32639`, `:32640`,
`:32642` — the same shape as the depth var at `:32641`. So all four share one validation contract: an
integer `>= 1`, digits only, otherwise `undefined`. A malformed value silently yields the default; a value of
`0` is impossible.

**Why this approach:**

- Compare with `getMaxSubagentSpawnDepth` (`:230896`), which is gate-backed *and* re-validates. That
  asymmetry is deliberate and it maps onto the changelog: the depth default was expected to move without a
  release, and it did (`.217`→`.219`). The three budgets have not moved and, having no gate, **cannot** be
  moved without a release.
- Trade-off accepted: if 20 turns out to be wrong for some fleet, Anthropic must ship a build. They chose
  that over the extra complexity of four memoised gate lookups, presumably because a *concurrency* limit is a
  local-machine property that a global gate is a poor tool for anyway.

**Why 20 / 200 / 200?**

- `20` concurrent: each in-flight subagent is a live API stream plus an entry in `runningSubagents`. The
  refusal text (`:398411`) frames it as "one message can't fan out unbounded background agents" — the failure
  mode being prevented is a single model turn emitting 50 parallel `Agent` calls.
- `200` per session for spawns *and* searches: identical numbers for two unrelated resources is the signature
  of a number chosen as "an order of magnitude above any legitimate session", not as a tuned resource budget.
  Its job is loop-breaking, and the refusal texts say so — "to stop runaway delegation loops",
  "to stop runaway search loops".
- The ratio 200/20 = 10 means a session can cycle its full concurrency window ten times before hitting the
  session budget.

**Key insight:** the two session caps are **monotone counters that only `/clear` resets**, while concurrency is
a **live gauge**. That difference dictates everything about how they are enforced — see §3 and §4.

---

## 3. The counters live on the task registry

```javascript
// ============================================
// taskRegistry counter surface - two monotone counters plus a leased concurrency gauge
// Location: cli_inner_pretty.js:341728-341761
// ============================================

// ORIGINAL (for source lookup):
    incrementTotalAgentSpawns() { r++; },
    getTotalAgentSpawns() { return r; },
    resetTotalAgentSpawns() { r = 0; },
    incrementWebSearchCalls() { n++; },
    getWebSearchCalls() { return n; },
    resetWebSearchCalls() { n = 0; },
    takeConcurrencySlot() {
      t((i) => ({ ...i, runningSubagents: i.runningSubagents + 1 }));
      let o = !1;
      return () => {
        if (o) return;
        ((o = !0),
          t((i) => {
            let s = Math.max(0, i.runningSubagents - 1);
            if (s === i.runningSubagents) return i;
            return { ...i, runningSubagents: s };
          }));
      };
    },
    getConcurrentSubagents() { return e().runningSubagents; },

// READABLE (for understanding):
    incrementTotalAgentSpawns() { totalAgentSpawns++; },      // closure-local, NOT in app state
    getTotalAgentSpawns()       { return totalAgentSpawns; },
    resetTotalAgentSpawns()     { totalAgentSpawns = 0; },
    incrementWebSearchCalls()   { webSearchCalls++; },
    getWebSearchCalls()         { return webSearchCalls; },
    resetWebSearchCalls()       { webSearchCalls = 0; },
    takeConcurrencySlot() {                                    // returns an idempotent release lease
      setAppState((s) => ({ ...s, runningSubagents: s.runningSubagents + 1 }));
      let released = false;
      return () => {
        if (released) return;                                  // double-release is a no-op
        released = true;
        setAppState((s) => {
          let next = Math.max(0, s.runningSubagents - 1);       // never goes negative
          if (next === s.runningSubagents) return s;            // identity return => no re-render
          return { ...s, runningSubagents: next };
        });
      };
    },
    getConcurrentSubagents()    { return getAppState().runningSubagents; },

// Mapping: r→totalAgentSpawns, n→webSearchCalls, t→setAppState, e→getAppState
```

### Decision: monotone counters in a closure, the gauge in app state

**What it does:** stores the two session budgets as plain closure variables and the concurrency count as a
field of the React-visible app state.

**How it works:**

1. `totalAgentSpawns` / `webSearchCalls` are ordinary `let`s inside the registry factory (`:341728`). They
   are never rendered, never persisted, never diffed.
2. `runningSubagents` goes through `setAppState` and is initialised to `0` at `:565590` and `:868077`.
3. The release lease is idempotent (`o` flag) and floor-clamped (`Math.max(0, …)`), and returns the *same
   object* when the value would not change — the standard React bail-out.

**Why this approach:**

- The gauge must be **observable** — the concurrency check runs on the model's behalf, but the number is also
  the thing the agent panel renders and the thing `/clear` has to zero (`:449497`). Anything in app state gets
  those for free.
- The monotone counters must **not** be in app state, because every `setAppState` on a hot path is a re-render;
  incrementing a counter that nothing displays 200 times per session would be pure waste. Keeping them in a
  closure also means they cannot be accidentally rolled back by a state reducer that reconstructs app state
  from a snapshot — a *monotone* budget must not be rewound by a UI operation.
- The double-release guard is not paranoia: the release is called both from the success path and from the
  error wrapper (`He` at `:398800-398806`, which invokes `Ze()` and rethrows), so double invocation is
  reachable on some interleavings. Without the flag, a slot would be returned twice and the gauge would drift
  below the true count — silently *raising* the effective concurrency limit.

**Failure mode:** there is a **null-object registry** at `:284586-284620` (`nBe`) whose counters are hardcoded
`return 0` and whose `takeConcurrencySlot()` returns `() => {}`. It is installed in non-REPL contexts —
`:567161`, `:865105`, `:866417`. In those contexts **all three caps are inert**: `getTotalAgentSpawns()` is
always 0, so the comparison `0 >= 200` never fires. This is a fail-open by construction. `:295649` and
`:301191` even branch on `j.taskRegistry !== nBe` to detect "am I in a real session", which confirms the stub
is a recognised sentinel rather than an accident.

---

## 4. Enforcement inside the Agent tool: ordering is the design

The three gates are closures declared together at `:398378-398419`, then invoked at `:398537` and `:398540`
and again at `:398799`.

```javascript
// ============================================
// Agent tool spawn gates - budget + per-session counter ($) and concurrency ceiling (D/U)
// Location: cli_inner_pretty.js:398378-398419
// ============================================

// ORIGINAL (for source lookup):
        let $ = (lt = !1) => {
            if (l.abortController.signal.aborted) {
              let At = My(l.abortController.signal.reason);
              if (!(lt && At === "interrupt")) throw new tl();
            }
            let { maxBudgetUsd: et } = l.options;
            if (zcr(et))
              throw (
                pe("subagent_launch", "subagent_budget_exhausted"),
                new wIe(
                  `Budget limit reached ($${vS().toFixed(2)} spent of the $${et} maximum). New agents cannot be started. Complete the remaining work directly with your tools, or wrap up with the results you already have.`,
                )
              );
            let gt = Q7r(),
              Rt = l.taskRegistry.getTotalAgentSpawns();
            if (Rt >= gt)
              throw (
                pe("subagent_launch", "subagent_count_cap"),
                new wIe(
                  `Subagent spawn limit reached (${Rt} of ${gt} agents spawned). Complete the remaining work directly with your tools instead of spawning more agents. If more agents are genuinely needed, ask the user to raise CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION.`,
                )
              );
            l.taskRegistry.incrementTotalAgentSpawns();
          },
          D = () => {
            let lt = gPu();
            if (l.taskRegistry.getConcurrentSubagents() < lt) return;
            if (Ke("tengu_amber_kestrel", !1)) return;
            let gt = l.getAppState();
            if (bY(l.rootToolSurface.mainLoopModel, gt.effortValue, gt.ultracode)) return;
            return (
              pe("subagent_launch", "subagent_concurrency_cap"),
              new wIe(
                `Concurrent subagent limit reached. You can run ${lt} subagents at once. Do not retry. If the user wants more concurrent subagents, ask them to increase CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS.`,
              )
            );
          },
          U = async () => {
            let lt = D();
            if (lt) throw (await at(), lt);
            return l.taskRegistry.takeConcurrencySlot();
          };

// READABLE (for understanding):
        let chargeSessionBudget = (allowInterruptAbort = false) => {
            if (ctx.abortController.signal.aborted) {
              let reason = getAbortReason(ctx.abortController.signal.reason);
              if (!(allowInterruptAbort && reason === "interrupt")) throw new AbortError();
            }
            let { maxBudgetUsd } = ctx.options;
            if (isBudgetExhausted(maxBudgetUsd))                       // :308540
              throw (logFeatureBad("subagent_launch", "subagent_budget_exhausted"),
                     new AgentRefusalError(`Budget limit reached ($${getTotalCostUsd().toFixed(2)} spent of
                        the $${maxBudgetUsd} maximum). New agents cannot be started. …`));
            let sessionLimit = getMaxSubagentsPerSession(),
              spawnsSoFar = ctx.taskRegistry.getTotalAgentSpawns();
            if (spawnsSoFar >= sessionLimit)
              throw (logFeatureBad("subagent_launch", "subagent_count_cap"),
                     new AgentRefusalError(`Subagent spawn limit reached (${spawnsSoFar} of ${sessionLimit}
                        agents spawned). … ask the user to raise CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION.`));
            ctx.taskRegistry.incrementTotalAgentSpawns();               // charge AFTER both checks pass
          },
          checkConcurrencyCeiling = () => {                             // returns an error, does NOT throw
            let limit = getMaxConcurrentSubagents();
            if (ctx.taskRegistry.getConcurrentSubagents() < limit) return;   // under the ceiling: allow
            if (getFeatureValue("tengu_amber_kestrel", false)) return;        // remote kill switch
            let appState = ctx.getAppState();
            if (isUltracodeXhighSession(ctx.rootToolSurface.mainLoopModel,
                                        appState.effortValue, appState.ultracode)) return;  // :119417
            return (logFeatureBad("subagent_launch", "subagent_concurrency_cap"),
                    new AgentRefusalError(`Concurrent subagent limit reached. You can run ${limit} subagents
                       at once. Do not retry. …`));
          },
          acquireConcurrencySlot = async () => {
            let refusal = checkConcurrencyCeiling();
            if (refusal) throw (await teardownWorktree(), refusal);      // clean up before the late refusal
            return ctx.taskRegistry.takeConcurrencySlot();
          };

// Mapping: $→chargeSessionBudget, D→checkConcurrencyCeiling, U→acquireConcurrencySlot, l→ctx,
//          zcr→isBudgetExhausted, vS→getTotalCostUsd, Q7r→getMaxSubagentsPerSession,
//          gPu→getMaxConcurrentSubagents, Ke→getFeatureValue, bY→isUltracodeXhighSession,
//          wIe→AgentRefusalError (:398187), tl→AbortError, at→teardownWorktree, pe→logFeatureBad
```

### Decision: concurrency is checked *before* the session budget is charged

The call order in the tool body is:

```
:398324  depth cap                     (throw)
:398338  teammate-spawns-teammate      (throw)
:398345  teammate wants background     (throw)
:398355  agent-type permission deny    (throw)
:398361  agent-type not found / ambiguous
:398509  worktree isolation w/o a git repo
:398520  remote isolation availability fallback
:398532  if (!isRemote) { concurrency check }        <-- D()
:398540  $(willRunInBackground && !isRemote)        <-- budget, then session count, then INCREMENT
:398543  required-MCP-server wait (up to 30s)
:398799  await U()  -> concurrency re-check, then take the slot
```

**Why concurrency first, session budget second:**

`incrementTotalAgentSpawns()` is **irreversible for the life of the session** (only `/clear` resets it,
§6). The concurrency ceiling, by contrast, is transient. If the order were reversed, a model that hit the
concurrency ceiling would burn one of its 200 lifetime spawns per refused attempt; ten refused fan-outs would
cost 5 % of the session budget for zero work. Checking the transient condition before charging the permanent
one keeps a recoverable failure from consuming a non-recoverable resource.

The refusal text hedges the same risk from the other side — *"Do not retry."* — but a prompt instruction is
advisory and the ordering is not.

**Why budget before session count inside `$`:** the budget refusal is terminal for the run (nothing the model
does will lower the spend), so surfacing it first gives the model the more actionable message. Charging a
spawn and *then* discovering the money is gone would waste budget on an agent that will never start.

**Why the concurrency check runs twice:**

Between `:398537` and `:398799` there are real `await`s — the required-MCP-server poll can block for **30
seconds** (`:398549-398553`), and worktree creation runs in between. Other agents can start during that
window. So:

- `:398537` is a **fail-fast**: refuse before paying for MCP waits and worktree setup.
- `:398799` (`await U()`) is the **atomic check-and-take**: re-evaluate, then increment the gauge in the same
  synchronous step, so no two spawns can both observe `count < limit` and both take the last slot.

And the late path calls `await at()` — the worktree teardown — *before* throwing (`:398417`). A refusal that
arrives after a worktree has been created must not leak the worktree. This is a textbook TOCTOU pattern with
a compensating action, and it is the single most careful piece of code in the module.

### The two documented bypasses

`checkConcurrencyCeiling` can be over-ridden twice, and both over-rides are worth naming:

1. **`tengu_amber_kestrel`** (`:398405`, gate is `220=1 / 193=0`, and it is in the 326-new-gate list). A remote
   boolean that disables the concurrency cap entirely. This is the escape hatch the three plain-constant caps
   otherwise lack: Anthropic cannot *retune* 20 from the server, but they can *switch the cap off*. That is a
   revealing choice — it says the risk they were guarding against was "20 is too low and we broke someone",
   not "20 is too high".
2. **`isUltracodeXhighSession`** (`bY`, `:119417`):
   `return r === !0 && M0() && Uoe(e, t) === "xhigh";` — true only when `ultracode` is on, workflows are
   enabled (`M0()`, `:119317`), and the resolved effort level is `xhigh`. The highest-effort mode is the one
   that most wants wide fan-out, so it is exempted from the fan-out ceiling by design.

Additionally, `isolation: "remote"` agents skip the check altogether: the whole block is wrapped in
`if (!z)` where `z = j === "remote"` (`:398530-398539`). A remote agent consumes no local streams, so it does
not belong in a local concurrency gauge. It still pays the session spawn budget, because `$` at `:398540` is
called unconditionally.

---

## 5. The web-search cap refuses *as data*, not as an error

```javascript
// ============================================
// WebSearch session budget guard - a soft refusal delivered as a search result
// Location: cli_inner_pretty.js:403657-403676
// ============================================

// ORIGINAL (for source lookup):
    async call(e, t, r, n, o) {
      let i = performance.now(),
        { query: s } = e,
        a = yPu(),
        l = t.taskRegistry.getWebSearchCalls();
      if (l >= a)
        return (
          pe("tool_web_search", "web_search_session_cap", { max_web_searches_per_session: a }),
          {
            data: {
              query: s,
              results: [
                `Web search was not performed: this session has used its web search budget (${l} of ${a} WebSearch calls). Continue with the information already gathered instead of issuing more searches. If more searches are genuinely needed, ask the user to raise CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION.`,
              ],
              durationSeconds: 0,
              searchCount: 0,
            },
          }
        );
      if ((t.taskRegistry.incrementWebSearchCalls(), wwd())) {

// READABLE (for understanding):
    async call(input, ctx, _c, _d, onProgress) {
      let startedAt = performance.now(),
        { query } = input,
        limit = getMaxWebSearchesPerSession(),
        used = ctx.taskRegistry.getWebSearchCalls();
      if (used >= limit)
        return (
          logFeatureBad("tool_web_search", "web_search_session_cap", { max_web_searches_per_session: limit }),
          {                                  // a SUCCESSFUL tool result whose only "result" is an instruction
            data: { query, results: [ /* budget-exhausted guidance, names the env var */ ],
                    durationSeconds: 0, searchCount: 0 },
          }
        );
      ctx.taskRegistry.incrementWebSearchCalls();   // charge only when a search is actually issued
      …

// Mapping: yPu→getMaxWebSearchesPerSession, t→ctx, pe→logFeatureBad,
//          wwd→shouldUseWebSearchCcrProxy (:403456), l/a→used/limit
```

### Decision: return a fabricated result instead of throwing

**What it does:** when the budget is spent, WebSearch returns a normal, successful tool result whose
`results` array holds one string of prose telling the model to stop searching.

**How it works:** `searchCount: 0` and `durationSeconds: 0` keep downstream cost/latency accounting honest;
the counter is **not** incremented, so `used` freezes at the limit rather than climbing; telemetry rides on
`tengu_feature_bad` with the limit attached as an attribute so the fleet distribution of the cap is
measurable.

**Why this approach:**

- A thrown tool error is a *retryable* signal in most agent loops, and several of them retry automatically.
  A refused search that looks like an error is the fastest possible way to build the very loop the cap
  exists to break.
- Delivering the refusal inside `results` puts it exactly where the model is already looking for search
  output, so it is read in the same attention pass as a real result would be.
- Trade-off: the model is told something false in shape (it looks like a search happened). The text opens with
  *"Web search was not performed:"* to defuse that.
- Contrast with the Agent tool, which **throws** (`wIe`, `:398187`). A refused *spawn* has no result surface
  to hide a message in, and the caller there is the tool-dispatch loop, not a search-consuming reasoning step.

**Key insight:** the same team wrote both refusals within one release and chose opposite mechanisms.
The selector is not severity — it is whether the tool has a data channel the model already trusts.

---

## 6. `/clear` resets the session budgets — conditionally

The changelog says `/clear` resets the subagent budget. The code resets **both** session budgets, and only
when the clear actually removed every agent task.

```javascript
// ============================================
// clearConversation (budget reset section) - resets the session spawn/search budgets only on a full clear
// Location: cli_inner_pretty.js:449492-449516
// ============================================

// ORIGINAL (for source lookup):
      return (
        (_ = pr(Object.values(R), (H) => !g.has(H.type))),
        {
          ...E2s(I),
          tasks: R,
          runningSubagents: _ === 0 ? 0 : I.runningSubagents,
          ...
        }
      );
    });
  if (l && _ === 0) (l.resetTotalAgentSpawns(), l.resetWebSearchCalls());

// READABLE (for understanding):
      return (
        (survivingAgentTaskCount = countWhere(Object.values(keptTasks),
                                             (t) => !SHELL_AND_MONITOR_TASK_TYPES.has(t.type))),
        {
          ...resetBrowserAndTransientState(state),   // E2s, :448564
          tasks: keptTasks,
          runningSubagents: survivingAgentTaskCount === 0 ? 0 : state.runningSubagents,
          ...
        }
      );
    });
  if (taskRegistry && survivingAgentTaskCount === 0)
    (taskRegistry.resetTotalAgentSpawns(), taskRegistry.resetWebSearchCalls());

// Mapping: kcn→clearConversation (:449427, registered at :449426 as `clearConversation`),
//          pr→countWhere (:24548), E2s→resetBrowserAndTransientState (:448564),
//          R→keptTasks, _→survivingAgentTaskCount,
//          g→SHELL_AND_MONITOR_TASK_TYPES (:449447: local_bash, monitor_mcp, monitor_ws, mcp_task),
//          m→isForegroundTask (:449446), l→taskRegistry
```

### Decision: gate the reset on "no agent tasks survived"

**What it does:** zeroes `totalAgentSpawns`, `webSearchCalls` and `runningSubagents` — but only if the clear
left no surviving agent-shaped task.

**How it works:**

1. `m = (I) => "isBackgrounded" in I && I.isBackgrounded === !1` (`:449446`) selects **foreground** tasks.
   Only those are torn down (`:449483-449490` aborts and unregisters them); everything else is *kept*
   in `R`. So background agents deliberately survive `/clear`.
2. `_` counts the survivors excluding four shell/MCP-monitor task types (`:449447`) — i.e. it counts
   *surviving agents*.
3. `runningSubagents` is set to `0` only when `_ === 0`; otherwise the live gauge is preserved (`:449497`).
4. The monotone budgets are reset under the same condition (`:449516`).

**Why this approach:** the concurrency gauge must equal the number of live agents. If a background agent
survives the clear, zeroing the gauge would under-count and let the session exceed 20 concurrent agents.
And a monotone budget that is reset while agents from the previous conversation are still spending it would let
a session loop `spawn 200 → /clear → spawn 200` indefinitely — precisely the runaway the cap exists to break.
Requiring a *clean* clear closes that.

**What the changelog under-reports:** `/clear` also resets the **web-search** budget (`:449516`), which no
bullet mentions. And this is the **only** reset path in the bundle — `grep -n 'resetTotalAgentSpawns'` yields
exactly `:284608` (the null-object stub), `:341734` (the definition) and `:449516`. In particular
**`/compact` does not reset either budget**, so a long compacted session keeps its 200-spawn ceiling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows for this module are staged in
> [symbol_additions_v2_1_220_subagent_limits.md](../00_overview/symbol_additions_v2_1_220_subagent_limits.md).

Key functions in this document:
- `getMaxConcurrentSubagents` (`gPu`, `:231399`) - `env ?? 20`
- `getMaxSubagentsPerSession` (`Q7r`, `:231402`) - `env ?? 200`
- `getMaxWebSearchesPerSession` (`yPu`, `:231405`) - `env ?? 200`
- `DEFAULT_MAX_CONCURRENT_SUBAGENTS` (`gty`, `:231411`) / `DEFAULT_MAX_SUBAGENTS_PER_SESSION` (`yty`, `:231412`) / `DEFAULT_MAX_WEB_SEARCHES_PER_SESSION` (`_ty`, `:231413`)
- `isSettingsEnvVarAllowed` (`n7t`, `:57846`) - which caps may come from `settings.json` `env`
- `SETTINGS_ENV_ALLOWLIST` (`nHh`, `:57993`) - contains only the two session caps (`:58164`, `:58166`)
- `chargeSessionBudget` (`$`, `:398378`) - abort → budget → session count → increment
- `checkConcurrencyCeiling` (`D`, `:398402`) - returns a refusal instead of throwing
- `acquireConcurrencySlot` (`U`, `:398415`) - atomic re-check + take, with worktree teardown on refusal
- `isUltracodeXhighSession` (`bY`, `:119417`) - the xhigh-effort concurrency exemption
- `isBudgetExhausted` (`zcr`, `:308540`) - `maxBudgetUsd !== undefined && totalCost >= it`
- `nullTaskRegistry` (`nBe`, `:284586`) - counters hardcoded to 0; the caps are inert here
- `clearConversation` (`kcn`, `:449427`) - the only budget reset path
- `countWhere` (`pr`, `:24548`) - counts surviving agent tasks
- `AgentRefusalError` (`wIe`, `:398187`) - the class all hard spawn refusals throw
