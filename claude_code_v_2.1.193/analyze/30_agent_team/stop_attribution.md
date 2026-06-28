# Stop attribution — *who* stopped the agent, and the "finished"/"stopped" wording

> **Type / version:** NET-NEW capability + FIX (2.1.187) — agent-stop notifications gain a `killedBy` attribution (`"user"` | `"parent"` | `"system"`) and a rewritten message set: completed agents read "finished", stops are attributed ("was stopped by Claude" vs "was stopped by user"), and the old anthropomorphic "came to rest" wording is removed everywhere.
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Lines are **193** unless tagged `(183)` or `(88)`.
> **Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`.

---

## TL;DR

In 183, when an agent/teammate task ended, the notification said the agent **"came to rest"** — a single phrase covering completion, error, and user-stop with no indication of *who* stopped it. 2.1.187 does two things at once: (1) it threads a new `killedBy` value (`"user"` for a human pressing stop, `"parent"` when Claude/the leader programmatically stops a task via the **TaskStop** tool, `"system"` for a system-initiated kill) from the stop entry points all the way into the notification and the task state and telemetry; and (2) it rewrites the notification text so a completed agent reads **"finished"**, a failed agent reads **"failed: \<error\>"**, and a stopped agent is **attributed**: "was stopped by Claude" / "was stopped by user" / a bare "was stopped" fallback. The teammate idle banner is changed in lockstep ("came to rest" → "finished"). This is partly a *revert* of the 88→183 anthropomorphism and partly a genuine *new capability* (attribution that never existed before).

---

## 1. The notification rewrite: `enqueueAgentNotification` (`Eqe`)

**What it does.** `enqueueAgentNotification` (`Eqe`, `cli_inner_pretty.js:453792`) builds the headline string for an agent-stop notification and enqueues it. 2.1.187 adds `killedBy` to its destructured params and replaces the "came to rest" ternary with a five-way `status`/`killedBy` ternary.

**How it works.**

```javascript
// ============================================
// enqueueAgentNotification - stop-notification headline (NEW killedBy param + wording)
// Location: cli_inner_pretty.js:453792-453834
// ============================================

// ORIGINAL (for source lookup):
function Eqe({ taskId: e, description: t, status: n, killedBy: r, error: o, taskRegistry: s, /* ... */ }) {
  /* ...registry.update(e, …) bookkeeping, notify-dedup, keepalive deregister... */
  let b =
      n === "completed"
        ? `Agent "${t}" finished`
        : n === "failed"
          ? `Agent "${t}" failed: ${o || "Unknown error"}`
          : r === "parent"
            ? `Agent "${t}" was stopped by Claude`
            : r === "user"
              ? `Agent "${t}" was stopped by user`
              : `Agent "${t}" was stopped`,
    /* ... build body + enqueue ... */;
}

// READABLE (for understanding):
function enqueueAgentNotification({ taskId, description, status, killedBy, error, taskRegistry, /* ... */ }) {
  // ...dedup via taskRegistry.update(taskId,...): only notify once; deregister keepalive...
  let headline =
      status === "completed" ? `Agent "${description}" finished`
    : status === "failed"    ? `Agent "${description}" failed: ${error || "Unknown error"}`
    : killedBy === "parent"  ? `Agent "${description}" was stopped by Claude`   // Claude/leader issued the stop
    : killedBy === "user"    ? `Agent "${description}" was stopped by user`     // human pressed stop
    :                          `Agent "${description}" was stopped`;           // fallback (e.g. "system")
  // ...build the notification body and enqueue...
}

// Mapping: Eqe→enqueueAgentNotification, e→taskId, t→description, n→status, r→killedBy, o→error, s→taskRegistry
```

**Why split completion ("finished") from stop ("was stopped by …").** The 183 phrasing collapsed three distinct outcomes — the agent finished its work, the agent errored, the agent was stopped — into the single metaphor "came to rest." That reads pleasantly but is *information-lossy*: a user glancing at a notification can't tell whether the agent completed successfully or was killed. 2.1.187 splits the outcome along two axes — `status` (completed/failed/stopped) and, for stops, `killedBy` (parent/user/other) — so the headline always answers "what happened *and* who caused it." The `killedBy` axis only matters in the stopped case, which is why it sits *under* the `status` checks in the ternary.

**Key insight.** The notification builder does **not** decide attribution — it merely *renders* the `killedBy` it is handed. The attribution is established at the stop *entry points* (§2) and plumbed through the task state and the async-completion path. So the wording change at `Eqe` is the visible tip; the load-bearing delta is the `killedBy` plumbing feeding it.

---

## 2. Where `killedBy` originates: the attribution plumbing

`killedBy` is a brand-new field in 193 (`grep -c killedBy` → **183: 0**, **193: 8**). It is set at the stop entry points and forwarded everywhere downstream.

**(a) `stopTask` defaults to `"user"`.** `stopTask` (`kht`, `cli_inner_pretty.js:431759`) is the common stop routine; it destructures `killedBy: s = "user"` from its options, defaulting to a **human-initiated** stop, and forwards that value into `taskImpl.kill(...)` and cascades it to child tasks:

```javascript
// ============================================
// stopTask - common stop entry; killedBy defaults to "user", cascades to children
// Location: cli_inner_pretty.js:431759-431767 (signature + kill)
// ============================================

// ORIGINAL (for source lookup):
async function kht(e, t) {
  let { taskRegistry: n, setAppState: r, callerAgentId: o, killedBy: s = "user" } = t,
    i = n.get(e);
  if (!i) throw new A9e(`No task found with ID: ${e}`, "not_found");
  /* ...ownership + running checks... */
  let a = Evo(i.type);
  if (t.source === "user") Mde(e, n);
  let l = Jqt(i);
  if ((await a.kill(e, n, r, s), l)) { /* ...for each child task: await a.kill(child, n, r, s)... */ }
  /* ... */
}

// READABLE (for understanding):
async function stopTask(taskId, opts) {
  let { taskRegistry, setAppState, callerAgentId, killedBy = "user" } = opts;  // ← default human stop
  let task = taskRegistry.get(taskId);
  // ...not-found / not-running / not-owner guards...
  let impl = getTaskImpl(task.type);
  if (opts.source === "user") markAgentStoppedByUser(taskId, taskRegistry);     // Mde: persist disk stop-marker
  await impl.kill(taskId, taskRegistry, setAppState, killedBy);                 // killedBy threaded into kill
  // ...cascade the SAME killedBy to live child tasks...
}

// Mapping: kht→stopTask, t→opts, s→killedBy, n→taskRegistry, o→callerAgentId, Mde→markAgentStoppedByUser,
//          a.kill→taskImpl.kill, Jqt→hasLiveChildren(ish)
```

**(b) the TaskStop tool stops with `"parent"`.** When *Claude/the leader* stops a task programmatically (the model invokes the **TaskStop** tool), the tool's `call` passes `killedBy: "parent"`:

```javascript
// ============================================
// TaskStop tool call - Claude-initiated stop is attributed "parent"
// Location: cli_inner_pretty.js:431944
// ============================================

// ORIGINAL (for source lookup):
let i = await kht(s, { taskRegistry: r, setAppState: o, callerAgentId: F8n(n), killedBy: "parent" });

// READABLE (for understanding):
let result = await stopTask(taskId, {
  taskRegistry, setAppState, callerAgentId: resolveCallerAgentId(ctx),
  killedBy: "parent",     // ← the leader/Claude issued this stop, not the human
});

// Mapping: kht→stopTask, s→taskId, r→taskRegistry, o→setAppState, F8n→resolveCallerAgentId, n→ctx
```

**(c) `killAndNotifyTask` propagates it into state + notification.** `killAndNotifyTask` (`GSe`, `cli_inner_pretty.js:453871`, signature `GSe(e, t, n = "user")`) writes `{ status: "killed", killedBy: n }` into the task state **and** passes `killedBy: n` into `enqueueAgentNotification`, so the state record and the headline agree.

**(d) the async-completion path reads it back and telemeters all three values.** When an async/background agent completes, the completion handler reads `killedBy` from the task registry and forwards it, and the termination telemetry maps it — confirming the third value `"system"`:

```javascript
// ============================================
// async-completion path - read killedBy from registry; telemeter parent/system/user
// Location: cli_inner_pretty.js:384633 (read), 384650-384658 (telemetry)
// ============================================

// ORIGINAL (for source lookup):
killedBy: Kl(te) ? te.killedBy : void 0,
// ...
(V("tengu_agent_tool_terminated", {
  /* ... */
  reason:
    te === "parent" ? Ve("parent_kill_async")
    : te === "system" ? Ve("system_kill_async")
    : Ve("user_kill_async"),
  /* ... */
}))

// READABLE (for understanding):
killedBy: isLocalAgentTask(task) ? task.killedBy : undefined,   // pull persisted attribution
// telemetry "tengu_agent_tool_terminated":
reason:
    killedBy === "parent" ? "parent_kill_async"
  : killedBy === "system" ? "system_kill_async"
  :                         "user_kill_async";

// Mapping: Kl→isLocalAgentTask, te→killedBy(value), V→emitTelemetry, Ve→telemetryEnum
```

**Why default `"user"` but make `"parent"` explicit at the tool.** The overwhelmingly common stop is a human pressing the stop key, so `stopTask` defaults `killedBy` to `"user"` — most call paths need not pass anything. The *only* path that must override it is the TaskStop tool, because that is Claude acting on its own initiative; it sets `"parent"` explicitly. `"system"` is the residual category (a kill not traceable to user or parent — e.g. a lifecycle/cleanup kill) and shows up in the telemetry enum and as the notification's bare-"was stopped" fallback. This "default to the common case, name the exceptions" design keeps the plumbing minimal: one default, two explicit overrides, three rendered messages.

---

## 3. The idle banner changes in lockstep: `teammateIdleBanner` (`LEo`)

**What it does.** The teammate idle banner (`LEo`, `cli_inner_pretty.js:390965`) is the inline "@teammate Teammate finished" status line. Its `idleReason` → adjective mapping is changed: the success arm is now **"finished"** (was "came to rest"); the failed/interrupted arms are unchanged.

```javascript
// ============================================
// teammateIdleBanner - idleReason adjective; success arm "came to rest" → "finished"
// Location: cli_inner_pretty.js:390965-390969
// ============================================

// ORIGINAL (for source lookup):
function LEo(e) {
  let t = fgt.c(9),
    { displayName: n, inkColor: r, idleReason: o } = e,
    s = o === "failed" ? "error" : o === "interrupted" ? "warning" : "success",
    i = o === "failed" ? "failed" : o === "interrupted" ? "was interrupted" : "finished";
  /* ...renders: <icon> Teammate @<name> <i>... */
}

// READABLE (for understanding):
function teammateIdleBanner({ displayName, inkColor, idleReason }) {
  let tone = idleReason === "failed" ? "error" : idleReason === "interrupted" ? "warning" : "success";
  let verb = idleReason === "failed" ? "failed"
           : idleReason === "interrupted" ? "was interrupted"
           : "finished";   // 183: "came to rest"
  // ...render "<icon> Teammate @<displayName> <verb>"...
}

// Mapping: LEo→teammateIdleBanner, e→props, n→displayName, r→inkColor, o→idleReason
```

**Why change the banner too.** "Came to rest" appeared in two surfaces — the notification (`Eqe`) and the idle banner (`LEo`). Leaving the banner on the old phrase while the notification says "finished" would be jarringly inconsistent (the same teammate, two phrasings). The banner is a *carryover component* (only the body string changed); its failed/"was interrupted" arms are untouched because those were already accurate.

---

## 4. Evidence: NET-NEW + FIX vs CARRYOVER (183 grep-diff)

| Signal | 183 | 193 | Verdict |
|---|---:|---:|---|
| `killedBy` (whole bundle) | 0 | 8 | NET-NEW (stopTask / TaskStop / killAndNotify / async / `Eqe`) |
| `"was stopped by Claude"` | 0 | 1 | NET-NEW |
| `"was stopped by user"` | 0 | 1 | NET-NEW |
| `Agent "…" finished` | 0 | 1 | NET-NEW wording |
| `parent_kill_async` / `system_kill_async` | 0 | 1 each | NET-NEW telemetry (the two new attribution reasons) |
| `user_kill_async` | 1 | 1 | CARRYOVER — pre-existing kill reason (183 `:371804`, 156 `:279437`); the new `killedBy` plumbing now *also* feeds `parent`/`system` into the same enum |
| `came to rest` | 4 | 0 | FIX (removed) |
| `enqueueAgentNotification` / idle banner exist | yes | yes | CARRYOVER component, body edit |

Re-verified in the live 193 bundle: `Eqe`@453792 + wording ternary@453826-453834, `kht`@431759, TaskStop `killedBy:"parent"`@431944, `GSe`@453871, async read `Kl(te) ? te.killedBy`@384633 + telemetry@384650-384658, `LEo`@390965 + "finished"@390969. 183 before-picture confirmed in the 183 bundle: `killedBy`=0; `came to rest`=4 at `(183) :379344` (idle banner) and `(183) :445861-445864` (`enqueueAgentNotification`: "came to rest" / "came to rest with an error" / "came to rest (stopped by user)").

**The 88 → 183 → 193 wording history (be precise):**
- **(88)** `enqueueAgentNotification` (`tasks/LocalAgentTask/LocalAgentTask.tsx:197`) said `Agent "…" completed` / `failed: …` / `was stopped` — **no "came to rest", no `killedBy`**. `(88) stopTask` (`tasks/stopTask.ts:38`) had no `killedBy` param.
- **88 → 183** introduced the anthropomorphic "came to rest" phrasing (still no attribution).
- **183 → 193 (2.1.187)** *replaces* "came to rest" with "finished" **and** *adds* per-actor attribution ("was stopped by Claude/user") that never existed before. So 2.1.187 partially **reverts** the anthropomorphism and **adds** a genuinely new attribution capability — it is both a FIX and a NET-NEW.

---

## Cross-links

- Sibling 193 docs: [`teammate_mode_iterm2.md`](./teammate_mode_iterm2.md), [`effort_inheritance.md`](./effort_inheritance.md), [`README.md`](./README.md).
- The `Mde` (`markAgentStoppedByUser`) disk stop-marker called by `stopTask` is part of the Background-Agents stop lifecycle: [`../00_overview/symbol_additions_v2_1_193_background_agents.md`](../00_overview/symbol_additions_v2_1_193_background_agents.md) and the 193 `36_background_agents` tree.
- v2.1.183 baseline for the teammate "comes to rest" eviction semantics (the lifecycle this wording describes): the background-task survival `<note>` in [`../../../claude_code_v_2.1.183/analyze/30_agent_team/coordinator_and_background_survival.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/coordinator_and_background_survival.md).

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools: the TaskStop tool)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Agent Team** is the home module)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Telemetry)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (UI banner)
> - [../00_overview/symbol_additions_v2_1_193_agent_team.md](../00_overview/symbol_additions_v2_1_193_agent_team.md) — the granular 193 additions for this module

Key functions in this doc:

- `enqueueAgentNotification` (obfuscated: `Eqe`, `cli_inner_pretty.js:453792`) — stop-notification builder; new `killedBy` param + "finished"/"was stopped by Claude|user" wording (ternary @453826-453834). 183 predecessor `@445830` ("came to rest").
- `stopTask` (obfuscated: `kht`, `cli_inner_pretty.js:431759`) — common stop entry; `killedBy = "user"` default; cascades `killedBy` to children. 88 `stopTask` (`tasks/stopTask.ts:38`, no `killedBy`).
- TaskStop tool `call` — `cli_inner_pretty.js:431944`; `stopTask(taskId, {…, killedBy: "parent"})`.
- `killAndNotifyTask` (obfuscated: `GSe`, `cli_inner_pretty.js:453871`) — `GSe(e,t,n="user")`; writes `{status:"killed", killedBy:n}` + forwards into `Eqe`.
- async-completion path — `cli_inner_pretty.js:384633` reads `isLocalAgentTask(t) ? t.killedBy : undefined`; telemetry `tengu_agent_tool_terminated` @384650 maps `parent`/`system`/`user`_`kill_async` @384658.
- `teammateIdleBanner` (obfuscated: `LEo`, `cli_inner_pretty.js:390965`) — idle banner; success arm "finished" @390969. 183 predecessor `Hao` (`(183) :379341`, "came to rest").
- `markAgentStoppedByUser` (obfuscated: `Mde`, `cli_inner_pretty.js:431808`) — persists a disk stop-marker on user-source stops (Background-Agents lifecycle).
