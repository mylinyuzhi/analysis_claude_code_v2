# Flow-node state and main-agent ↔ workflow communication

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md)

Companion documents: [workflow_runtime_core.md](workflow_runtime_core.md) ·
[workflow_lifecycle.md](workflow_lifecycle.md) ·
[workflow_model_resolution.md](workflow_model_resolution.md) ·
[workflow_server_authored_launch.md](workflow_server_authored_launch.md) ·
[workflow_runtime_and_ui.md](workflow_runtime_and_ui.md) (the `.198`/`.202`/`.208`/`.212` publishing
deltas, which this document treats as background rather than re-deriving)

---

## TL;DR

There is **one** state model — an index-keyed array of three node kinds, held on a task-registry
entry — and **seven** consumers, each reading it through a different projection.

```
                             emitProgress(r)  [from zSd]
                                     │
                        c6y batcher  │  16 ms debounce
                                     ▼
                      ┌──────────────┴──────────────┐
             onBatch  │                             │  onSdkEmit  (SDK / REPL-bridge only)
                      ▼                             ▼
        qPs reducer → taskRegistry              Vpr → stream-json `task_progress`
              │                                      (snapshot, 10 s heartbeat)
              ├──► /workflows terminal view  (RTr → L9o → pya)
              ├──► running-workflow status line + size warning
              ├──► RC state-file `fan` array (bHs.subscribe → Ocd → lol)
              ├──► <runId>.json snapshot        (OSd, at completion)
              ├──► <taskId>.output file         (VPs, at completion)
              └──► task-notification to the main agent (qxo, at completion)
```

Main-agent ↔ workflow communication is **strictly asynchronous and one-shot in each direction**:
the tool call goes out and returns `async_launched` immediately; one task-notification comes back at
the end. There is no polling API for a *running* workflow's node state from the model's side — the
model's only in-flight handles are `TaskStop` (kill) and the human-driven `/workflows` view.

| Delta in this window | 220 | 193 | Verdict |
|---|---|---|---|
| `<diagnostics>` block in the completion message | 1 | **0** | **NET_NEW** |
| `agents_empty_result` census tag | 1 | **0** | **NET_NEW** |
| `Per-agent results: …/journal.jsonl` pointer | 1 | **0** | **NET_NEW** |
| `suppressCompletionNotification` | 3 | **0** | **NET_NEW** |
| snapshot publishing to SDK (`onSdkEmit`) | 2 | 0 | NET_NEW — owned by [runtime_and_ui §3](workflow_runtime_and_ui.md) |
| RC `fan` change-driven publisher (`Ocd`) | — | — | NET_NEW — owned by [runtime_and_ui §4](workflow_runtime_and_ui.md) |
| the reducer `qPs`, node shapes, `progressVersion` | — | — | CARRYOVER (`progressVersion` 4/4, `type === "workflow_log"` 3/3) |

---

## 1. The state container

```javascript
// ============================================
// registerWorkflowTask - Create and register the local_workflow task-registry entry
// Location: cli_inner_pretty.js:386454-386493
// ============================================

// ORIGINAL (for source lookup):
function GPs({ taskId: e, script: t, scriptPath: r, args: n, summary: o, workflowName: i, title: s,
               phases: a, defaultModel: l, workflowRunId: c, ownerAgentId: u, taskRegistry: d,
               toolUseId: p, startTime: f }) {
  BRt(e);
  let m = Mc(0),
    g = { ...kw(e, "local_workflow", o ?? "Dynamic workflow", p),
      ...(f !== void 0 && { startTime: f }),
      type: "local_workflow", status: "running",
      script: t, scriptPath: r, args: n, prompt: t, summary: o,
      workflowName: i, title: s, phases: a, defaultModel: l, workflowRunId: c, ownerAgentId: u,
      workflowProgress: [], progressVersion: 0, agentCount: 0, totalTokens: 0, totalToolCalls: 0,
      logs: [], abortController: m, agentControllers: new Map() };
  return (d.register(g), g);
}

// READABLE (for understanding):
function registerWorkflowTask({ taskId, script, scriptPath, args, summary, workflowName, title,
                                phases, defaultModel, workflowRunId, ownerAgentId, taskRegistry,
                                toolUseId, startTime }) {
  void createOutputFileExclusively(taskId);               // O_CREAT|O_EXCL, tracked promise, NOT awaited
  const abortController = makeAbortController(0);
  const task = {
    ...baseTask(taskId, "local_workflow", summary ?? "Dynamic workflow", toolUseId),
    ...(startTime !== undefined && { startTime }),        // adopt preserves the original start time
    type: "local_workflow", status: "running",
    script, scriptPath, args,
    prompt: script,                                       // ← the script doubles as the task "prompt"
    summary, workflowName, title, phases, defaultModel, workflowRunId, ownerAgentId,
    workflowProgress: [],       // ← THE state array
    progressVersion: 0,         // ← monotonic counter for cheap change detection
    agentCount: 0, totalTokens: 0, totalToolCalls: 0, logs: [],
    abortController,
    agentControllers: new Map(),// agentId → AbortController, for per-agent skip/retry
  };
  taskRegistry.register(task);
  return task;
}

// Mapping: GPs→registerWorkflowTask, BRt→createOutputFileExclusively (:165330-165342), kw→baseTask,
//          Mc→makeAbortController, d→taskRegistry
```

Two details that shape everything downstream:

- **`BRt(e)` opens `<taskId>.output` with `O_WRONLY|O_CREAT|O_EXCL`** (`:165330-165342`). The
  exclusive flag makes task-id collision a hard failure at creation time rather than a silent
  overwrite of another task's output later. The path is `ly(taskId)` (`:165136-165138`), and the same
  path is stored on the task as `outputFile` by `kw`. Note the call is **not awaited** — `BRt` wraps
  the open in `yio(...)`, a tracked-promise registry, so the reservation races the first write rather
  than gating registration; the tracker is what lets shutdown flush it.
- **`prompt: t`** — the script text is stored in the generic `prompt` slot. That is what makes a
  workflow render in the generic task list alongside background agents without special-casing, and
  it is also why the script text is in memory for the whole run (which `AZs` then hashes for the
  adopt pin, see [workflow_lifecycle.md §5.1](workflow_lifecycle.md)).

A second, **paused** variant exists for checkpointed runs that have not yet been resumed:

```javascript
// ORIGINAL (:386502-386522):  status: "paused", script: "", prompt: "", notified: !0, …
// READABLE: registerPausedWorkflowPlaceholder — a card in /workflows with no script and no
//           notification pending, so the user can see "this run exists and is stopped".
```

Note `script: ""` — the placeholder deliberately does **not** carry the script, so a paused card
cannot be resumed straight from memory; the resume must go back through `scriptPath` and (for adopt)
the sha256 pin.

---

## 2. The three node kinds and the reducer

### 2.1 Node shapes

All three are emitted through the same channel — `r({ type: "progress", toolUseID, data })` — and
discriminated by `data.type`.

**`workflow_phase`** (emitted by `resolvePhase`, `:387211-387215`):

| Field | Meaning |
|---|---|
| `index` | 1-based, assigned in interning order |
| `title` | the exact string passed to `phase()` / `meta.phases[].title` |
| `kind` | `"child"` for a nested `workflow()` group, otherwise `undefined` |

**`workflow_log`** (emitted from ~10 sites; the canonical one is `log()` at `:388085`): just
`{ type, message }`. Log nodes have **no index** — which is what makes them the only append-only kind
and the only kind subject to trimming.

**`workflow_agent`** — the rich one. Assembled at five distinct emit sites with overlapping field
sets:

| Field | Set at | Notes |
|---|---|---|
| `index` | all | the `agent()` call ordinal `d`; the reducer's key |
| `label`, `phaseIndex`, `phaseTitle` | all | |
| `state` | all | `"start"` \| `"progress"` \| `"done"` \| `"error"` |
| `queuedAt` | pre-semaphore emit `:387388` | present from the very first frame |
| `startedAt` | post-semaphore `:387526` | **absence ⇒ still queued** (see [runtime_core §2.4](workflow_runtime_core.md)) |
| `agentId` | post-semaphore `:387520` | also used as the RC fan node id |
| `agentType` | `:387521` | `Ce?.agentType` — only set for `opts.agentType` calls |
| `isolation` | `:387522`, `:387385` | `"worktree"` \| `"remote"` (the latter unreachable) |
| `model`, `fallbackModel` | `:387523-387524` | see [workflow_model_resolution.md §1](workflow_model_resolution.md) |
| `attempt`, `lastAttemptReason` | `:387528-387529` | the retry ladder's rung and why |
| `lastToolName`, `lastToolSummary` | `:387530-387531` | the *most recent* tool use, overwritten each turn |
| `promptPreview`, `resultPreview` | `:387532`, `:387759` | truncated to `BSd = 400` chars by `Ift` (`:387143-387148`) |
| `tokens`, `toolCalls`, `durationMs` | via `ut(...)` extras | cumulative across retry rungs |
| `cached` | `:387348` | journal replay |
| `blocked`, `error`, `skipped` | `:387286-387287`, `:387693` | |
| `lastProgressAt` | all | wall-clock of the emit |

**Why `promptPreview`/`resultPreview` are truncated at emit rather than at render:** these nodes are
copied into the RC state file, the stream-json frame, the snapshot JSON and the output file. Storing
a full 200 KB agent result in a node that gets serialised five times would be the single largest
memory and I/O cost in the feature. `Ift` also handles the non-string case by `JSON.stringify`-ing
first (`:387145`) and appends `…` on truncation.

### 2.2 The reducer

```javascript
// ============================================
// applyWorkflowProgressEvents - Index-keyed upsert with log trimming and derived totals
// Location: cli_inner_pretty.js:386523-386572
// ============================================

// ORIGINAL (for source lookup):
function qPs(e, t, r) {
  if (t.length === 0) return;
  r.update(e, (n) => {
    if (n.status !== "running") return n;
    let o = [...n.workflowProgress], i = new Map();
    for (let u = 0; u < o.length; u++) { let d = o[u];
      if (d.type === "workflow_agent" || d.type === "workflow_phase") i.set(`${d.type}:${d.index}`, u); }
    let s = n.agentCount, a = !1;
    for (let u of t)
      if (u.type === "workflow_agent" || u.type === "workflow_phase") {
        let d = `${u.type}:${u.index}`, p = i.get(d);
        if (p !== void 0) o[p] = u; else (i.set(d, o.length), o.push(u));
        if (u.type === "workflow_agent" && u.state === "start") s = Math.max(s, u.index);
      } else (o.push(u), (a = !0));
    if (a && o.length > kSd * 2) {
      let u = o.length - kSd, d = [];
      for (let p = 0; p < o.length; p++) { let f = o[p];
        if (u > 0 && f.type === "workflow_log") { u--; continue; }
        d.push(f); }
      o = d;
    }
    let l = 0, c = 0;
    for (let u of o) if (u.type === "workflow_agent") { if (u.tokens) l += u.tokens; if (u.toolCalls) c += u.toolCalls; }
    return { ...n, workflowProgress: o, progressVersion: n.progressVersion + t.length,
             agentCount: s, totalTokens: l, totalToolCalls: c };
  });
}

// READABLE (for understanding):
function applyWorkflowProgressEvents(taskId, batch, registry) {
  if (batch.length === 0) return;
  registry.update(taskId, (task) => {
    if (task.status !== "running") return task;          // late frames after termination are dropped
    const nodes = [...task.workflowProgress];
    const positionByKey = new Map();
    nodes.forEach((n, i) => {
      if (n.type === "workflow_agent" || n.type === "workflow_phase")
        positionByKey.set(`${n.type}:${n.index}`, i);    // rebuilt every batch — O(n) per flush
    });

    let agentCount = task.agentCount;
    let appendedLog = false;
    for (const node of batch) {
      if (node.type === "workflow_agent" || node.type === "workflow_phase") {
        const key = `${node.type}:${node.index}`;
        const at = positionByKey.get(key);
        if (at !== undefined) nodes[at] = node;          // UPSERT — whole-node replacement
        else { positionByKey.set(key, nodes.length); nodes.push(node); }
        if (node.type === "workflow_agent" && node.state === "start")
          agentCount = Math.max(agentCount, node.index); // highest index ever started
      } else { nodes.push(node); appendedLog = true; }   // logs are append-only
    }

    if (appendedLog && nodes.length > MAX_PROGRESS_NODES * 2) {   // 500 * 2
      let toDrop = nodes.length - MAX_PROGRESS_NODES;
      const kept = [];
      for (const n of nodes) {
        if (toDrop > 0 && n.type === "workflow_log") { toDrop--; continue; }  // evict OLDEST logs only
        kept.push(n);
      }
      nodes.length = 0; nodes.push(...kept);
    }

    let totalTokens = 0, totalToolCalls = 0;
    for (const n of nodes) if (n.type === "workflow_agent") {
      if (n.tokens) totalTokens += n.tokens;
      if (n.toolCalls) totalToolCalls += n.toolCalls;
    }
    return { ...task, workflowProgress: nodes,
             progressVersion: task.progressVersion + batch.length,
             agentCount, totalTokens, totalToolCalls };
  });
}

// Mapping: qPs→applyWorkflowProgressEvents, kSd→MAX_PROGRESS_NODES (=500, :386764), r→registry
```

**Design points, each with a non-obvious reason:**

1. **Whole-node replacement, not merge.** `o[p] = u` discards the previous node entirely. This is
   why every emit site re-sends the full field set rather than a delta — `ut(...)` at `:387510-387536`
   rebuilds all 16 fields on every `"progress"` tick. A merge would be cheaper on the wire but would
   make "field disappears" un-expressible; whole-node replacement means the *last* emit is the whole
   truth, which is what lets the SDK publisher (§3.2) send a snapshot and the RC publisher (§3.3)
   diff by value.

2. **`agentCount = max(agentCount, index)` on `state === "start"`, never a count of nodes.**
   The `agent()` counter `d` is incremented for *cached* replays too (`:387317`), and cached nodes
   are emitted with `state: "done"`, not `"start"`. So `agentCount` tracks the highest *scheduled*
   ordinal, and the resume case yields a correct total even though the earlier agents never
   "started". Using `nodes.length` would count phases and logs; using a counter of `"start"` frames
   would under-count a resumed run.

3. **Only logs are trimmed, and only when a log was appended.** Agent and phase nodes are bounded by
   the 1,000-call cap; logs are not (a script can `log()` in a loop). The `appendedLog` guard means a
   pure-agent batch never pays the O(n) trim scan. The hysteresis — trim only above `2 × 500`, down
   to `500` — amortises the cost so a chatty script triggers the scan every ~500 logs rather than on
   every flush.

4. **The trim preserves order and drops the oldest logs.** The loop walks front-to-back skipping the
   first `toDrop` log nodes, so surviving logs are the most recent ones and the agent/phase nodes keep
   their relative positions (which matters because the terminal renderer relies on insertion order for
   the un-grouped fallback view).

5. **`progressVersion += batch.length`, not `+= 1`.** It is a count of *events observed*, not of
   flushes — a cheap monotonic key that a memoised renderer can compare without deep-equality on a
   500-element array.

6. **`status !== "running"` short-circuits.** In-flight agents can emit after the workflow is killed
   (an aborted agent still runs its `finally`). Dropping those frames keeps a terminal task's node
   array — which has already been written to the snapshot and the output file — immutable.

**Verdict: CARRYOVER.** `progressVersion:` is 220=4 / 193=4 and `type === "workflow_log"` is
220=3 / 193=3; the 2.1.193 reducer `hTo` (`:422765-422777 (193)`) is byte-identical. This is the
trap [README §4](README.md) already flags: the `.198` bug looks like it lives here and does not.

---

## 3. The seven exposure surfaces

### 3.1 The batcher

```javascript
// ============================================
// createProgressBatcher - Debounce progress into batches; feed the registry and (maybe) the SDK
// Location: cli_inner_pretty.js:388538-388569; constants :388910-388914
// ============================================

// ORIGINAL (for source lookup):
function c6y(e) {
  let t = [], r, n = 0,
    o = (i) => {
      if (((r = void 0), t.length === 0)) return;
      if (!i && !yn() && Mx()) {
        let a = n + a6y - Date.now();
        if (a > 0) { r = setTimeout(o, a); return; }
        n = Date.now();
      }
      let s = t;
      if (((t = []), e.onBatch(s), !yn() && !Mx())) return;
      e.onSdkEmit(s);
    };
  return {
    onProgress: (i) => { if ((t.push(i), !r)) r = setTimeout(o, s6y); },
    flushNow: () => { if (r) clearTimeout(r); o(!0); },
    cancel: () => { if (r) (clearTimeout(r), (r = void 0)); t = []; },
  };
}
// s6y = 16, a6y = 250, l6y = 1e4, d6y = 200   (:388908-388914)

// READABLE (for understanding):
const PROGRESS_BATCH_WINDOW_MS = 16;      // ~1 frame
const BRIDGE_MIN_INTERVAL_MS = 250;    // extra throttle when a REPL bridge is attached
function createProgressBatcher({ onBatch, onSdkEmit }) {
  let pending = [], timer, lastBridgeFlushAt = 0;
  const flush = (forced) => {
    timer = undefined;
    if (pending.length === 0) return;
    if (!forced && !isNonInteractive() && isReplBridgeActive()) {   // bridge-only extra throttle
      const wait = lastBridgeFlushAt + BRIDGE_MIN_INTERVAL_MS - Date.now();
      if (wait > 0) { timer = setTimeout(flush, wait); return; }
      lastBridgeFlushAt = Date.now();
    }
    const batch = pending;
    pending = [];
    onBatch(batch);                                                  // always → registry
    if (!isNonInteractive() && !isReplBridgeActive()) return;        // terminal-only session: done
    onSdkEmit(batch);                                                // SDK or bridge: also publish
  };
  return {
    onProgress: (node) => { pending.push(node); if (!timer) timer = setTimeout(flush, PROGRESS_BATCH_WINDOW_MS); },
    flushNow:  () => { if (timer) clearTimeout(timer); flush(true); },
    cancel:    () => { if (timer) { clearTimeout(timer); timer = undefined; } pending = []; },
  };
}

// Mapping: c6y→createProgressBatcher, s6y→PROGRESS_BATCH_WINDOW_MS, a6y→BRIDGE_MIN_INTERVAL_MS,
//          yn→isNonInteractive, Mx→isReplBridgeActive, l6y→SNAPSHOT_HEARTBEAT_MS
```

**Why two different intervals.** 16 ms is one animation frame — the terminal renderer can absorb
that, and batching at frame rate turns 16 concurrent agents' chatter into one React update. 250 ms
applies *only* when a REPL bridge is attached (desktop app hosting a terminal session), because every
bridge flush is a serialised IPC frame rather than an in-process array push. The forced flush
(`flushNow`) bypasses the throttle entirely so the final state is never delayed.

**`cancel()` versus `flushNow()`** is the adopted-away distinction: when the run is handed to a
background fork, `Osn` calls `cancel()` (`:388677`) so the *dying* process does not publish a
half-finished snapshot that the *new* process would then contradict.

### 3.2 SDK / stream-json — snapshot with a heartbeat

`onSdkEmit` (`:388636-388657`) is the `.198` fix, documented in
[workflow_runtime_and_ui.md §3](workflow_runtime_and_ui.md). Summarised here for the state model:

```javascript
// READABLE (from :388636-388657):
onSdkEmit: (batch) => {
  const meaningful = batch.filter(isNotWorkflowLog);            // oEd, :388907-388909
  if (meaningful.length === 0) return;
  const task = ctx.getAppState()?.tasks?.[taskId];
  if (task?.type !== "local_workflow" || task.status !== "running") return;

  const lastAgent  = meaningful.findLast((n) => n.type === "workflow_agent");
  const allProgress = meaningful.every((n) => n.type === "workflow_agent" && n.state === "progress");
  const now = Date.now();
  const includeSnapshot = !allProgress || now - lastSnapshotAt >= SNAPSHOT_HEARTBEAT_MS;  // 10_000
  if (includeSnapshot) lastSnapshotAt = now;

  emitTaskProgressFrame({
    taskId, toolUseId,
    description: lastAgent ? (lastAgent.phaseTitle ? `${lastAgent.phaseTitle}: ${lastAgent.label}` : lastAgent.label)
                           : task.description,
    startTime: task.startTime, totalTokens: task.totalTokens, toolUses: task.totalToolCalls,
    lastToolName: lastAgent?.label, summary,
    workflowProgress: includeSnapshot ? task.workflowProgress.filter(isNotWorkflowLog) : undefined,
  });
}
```

**Two economies worth naming:**

- **Log nodes never leave the process** through this channel (`filter(oEd)` on both the trigger test
  and the payload). Logs are a human-debugging surface; an SDK consumer gets structure.
- **The snapshot is attached on every *structural* change but only every 10 s during a pure token
  drip.** `allProgress` is true exactly when the batch is nothing but `state:"progress"` ticks on
  agents that already exist — no new agent, no state transition, no phase. In that case the frame
  still goes out (so token counters advance) but omits the 500-node array. Any structural change
  forces a full snapshot immediately. This is the compromise that fixes the `.198` bug (a mid-run
  joiner needs the whole array) without paying for it 60 times a second.

`Vpr` (`:345314-345327`) is the publisher itself — a `{type:"system", subtype:"task_progress"}`
stream-json frame carrying `workflow_progress` as a top-level field.

### 3.3 Remote Control state file — the `fan` array

`bHs.subscribe(…)` at `:335476` chains a write of `Ocd(sessionId)` (`:335489-335505`) onto the
bridge write chain. `Ocd` builds the current fan with `spr()` (`:334794`) and compares it to what is
already in the state file, writing only on change. The projection that turns workflow nodes into fan
items is `lol` (`:764295-764389`, workflow case at `:764311-764338`):

```javascript
// ============================================
// buildAgentFanItems (workflow case) - project workflow agents into generic RC fan nodes
// Location: cli_inner_pretty.js:764311-764338
// ============================================

// ORIGINAL (for source lookup, abridged):
case "local_workflow": {
  let o = r.workflowProgress.filter(cUS);
  if (o.length === 0) { t.push({ id: r.id, kind: "workflow", label: OZe(r.title ?? r.workflowName ?? r.description),
                                 startedAt: r.startTime, doneAt: r.endTime, failed: n || void 0 }); break; }
  for (let i of o)
    t.push({ id: i.agentId ?? `${r.id}:${i.index}`, kind: "workflow", label: OZe(i.label),
             group: i.phaseTitle, startedAt: i.startedAt ?? i.queuedAt ?? r.startTime,
             doneAt: i.state === "done" || i.state === "error"
                   ? (i.lastProgressAt ?? (i.startedAt !== void 0 && i.durationMs !== void 0
                                           ? i.startedAt + i.durationMs : void 0))
                   : void 0,
             failed: i.state === "error" || void 0 });
  break;
}

// READABLE (for understanding):
case "local_workflow": {
  const agents = task.workflowProgress.filter(isAgentNode);
  if (agents.length === 0) {                              // no agents yet → ONE card for the whole run
    items.push({ id: task.id, kind: "workflow",
                 label: truncate(task.title ?? task.workflowName ?? task.description),
                 startedAt: task.startTime, doneAt: task.endTime, failed: isFailed || undefined });
    break;
  }
  for (const a of agents)                                  // otherwise ONE card per agent
    items.push({
      id: a.agentId ?? `${task.id}:${a.index}`,            // stable before the agent id exists
      kind: "workflow", label: truncate(a.label), group: a.phaseTitle,
      startedAt: a.startedAt ?? a.queuedAt ?? task.startTime,
      doneAt: (a.state === "done" || a.state === "error")
            ? (a.lastProgressAt ?? (a.startedAt !== undefined && a.durationMs !== undefined
                                    ? a.startedAt + a.durationMs : undefined))
            : undefined,
      failed: a.state === "error" || undefined,
    });
  break;
}

// Mapping: lol→buildAgentFanItems, cUS→isAgentNode (:764390-764392), OZe→truncate, r→task, o→agents
```

**Three details:**

- **The id falls back to `${taskId}:${index}`** while the agent is still queued and has no `agentId`.
  Without it, every queued agent would collide on `undefined` and the fan would show one row.
- **`startedAt` falls back through `queuedAt` to the task's start.** The RC UI sorts by start time; a
  queued agent with no timestamp would sort to the epoch.
- **`doneAt` is reconstructed** from `lastProgressAt`, or arithmetically from `startedAt + durationMs`.
  The node model has no explicit end timestamp — a small piece of denormalisation avoided at the
  source and paid for at every consumer.

`failed: … || undefined` rather than `|| false` throughout: the RC state file is diffed by value
(`Bpt(o) === Bpt(r.fan)`, `:335497`), so emitting `false` instead of omitting the key would change
the serialisation and cause a spurious write on every tick.

### 3.4 Terminal `/workflows` view

Three pure functions turn the flat array into the grouped tree:

```javascript
// ============================================
// partitionWorkflowProgress / groupAgentsByPhase / buildPhaseGroups
// Location: cli_inner_pretty.js:650495-650518, :651229-651235
// ============================================

// ORIGINAL (for source lookup):
function RTr(e) {
  let t = new Map(), r = [], n = new Map();
  for (let o of e)
    if (o.type === "workflow_agent") t.set(o.index, o);
    else if (o.type === "workflow_log") r.push(o.message);
    else if (o.type === "workflow_phase") n.set(o.index, { title: o.title, kind: o.kind });
  return { agents: [...t.values()].sort((o, i) => o.index - i.index), logs: r, phaseTitles: n };
}
function L9o(e, t) {
  if (!e.some((n) => n.phaseIndex != null)) return null;
  let r = new Map();
  for (let n of e) {
    let o = n.phaseIndex ?? 0, i = r.get(o);
    if (!i) { let s = t.get(o); ((i = { phaseIndex: o, title: s?.title ?? `Phase ${o}`, kind: s?.kind, agents: [] }), r.set(o, i)); }
    i.agents.push(n);
  }
  return [...r.values()].sort((n, o) => n.phaseIndex - o.phaseIndex);
}
function pya(e) {
  let t = RTr(e.workflowProgress), r = L9o(t.agents, t.phaseTitles) ?? [], n = h0b(e.phases, r);
  if (n.length === 0 && t.agents.length > 0) return [dya({ phaseIndex: 0, title: "Agents", agents: t.agents })];
  return n;
}

// READABLE (for understanding):
function partitionWorkflowProgress(nodes) {
  const agentsByIndex = new Map(), logs = [], phaseMeta = new Map();
  for (const n of nodes) {
    if (n.type === "workflow_agent")      agentsByIndex.set(n.index, n);      // last write wins (defensive)
    else if (n.type === "workflow_log")   logs.push(n.message);
    else if (n.type === "workflow_phase") phaseMeta.set(n.index, { title: n.title, kind: n.kind });
  }
  return { agents: [...agentsByIndex.values()].sort((a, b) => a.index - b.index), logs, phaseTitles: phaseMeta };
}

function groupAgentsByPhase(agents, phaseMeta) {
  if (!agents.some((a) => a.phaseIndex != null)) return null;   // no phases used → caller falls back
  const byPhase = new Map();
  for (const a of agents) {
    const idx = a.phaseIndex ?? 0;                              // un-phased agents land in group 0
    let group = byPhase.get(idx);
    if (!group) {
      const meta = phaseMeta.get(idx);
      group = { phaseIndex: idx, title: meta?.title ?? `Phase ${idx}`, kind: meta?.kind, agents: [] };
      byPhase.set(idx, group);
    }
    group.agents.push(a);
  }
  return [...byPhase.values()].sort((a, b) => a.phaseIndex - b.phaseIndex);
}

function buildPhaseGroups(task) {
  const { agents, phaseTitles } = partitionWorkflowProgress(task.workflowProgress);
  const observed = groupAgentsByPhase(agents, phaseTitles) ?? [];
  const merged = mergeDeclaredAndObservedPhases(task.phases, observed);
  if (merged.length === 0 && agents.length > 0)
    return [makePhaseGroup({ phaseIndex: 0, title: "Agents", agents })];   // ungrouped fallback
  return merged;
}

// Mapping: RTr→partitionWorkflowProgress, L9o→groupAgentsByPhase, pya→buildPhaseGroups,
//          h0b→mergeDeclaredAndObservedPhases, dya→makePhaseGroup
```

**Why `partitionWorkflowProgress` re-indexes into a `Map` even though the reducer already
de-duplicates.** The renderer also runs against arrays that did *not* come through `qPs` — the
snapshot hydration path (`:735185`) and the persisted `<runId>.json`. Those can legitimately contain
duplicate indices if written by a different build. Making the projection idempotent means the view
never renders a doubled row regardless of provenance.

**Why `title: meta?.title ?? \`Phase ${idx}\``:** an agent can carry a `phaseIndex` whose
`workflow_phase` node was trimmed or never observed (e.g. a snapshot that stored only agents, as
`VPs` does at `:386604` — it filters out logs but keeps phases, whereas `M` at `:388682` also keeps
phases; a *third-party* consumer might not). The synthetic title keeps the tree renderable.

**Index 0 is doubly reserved:** `resolvePhase` is 1-based (`++M`, `:387209`), so `phaseIndex: 0`
can only arise from the `?? 0` default here or from the `"Agents"` fallback group — the two can never
collide with a real phase.

**Finding: the size-warning path's phase field is a stub.** `kvn(RTr(te.workflowProgress), te.phases)`
at `:747902` calls a function whose entire body is `return null` (`:651236-651238`):

```javascript
// ORIGINAL:  function kvn(e, t) { return null; }
// READABLE:  function currentPhaseForWarning(_partitioned, _declaredPhases) { return null; }
```

Both arguments are computed — `RTr` walks the whole node array — and discarded. So the over-size
warning built at `:747903-747908` always carries `phase: null`. Whatever the warning UI intended to
show about "which phase is over budget", it does not. This is dead work executed on every render of
the workflow list, and it is *not* mentioned in
[workflow_size_guideline.md §7](workflow_size_guideline.md), which documents the surrounding warning.

### 3.5 Snapshot, output file, and the notification

At completion, three separate serialisations are written, each with a different filter:

| Sink | Filter on `workflowProgress` | Purpose | Anchor |
|---|---|---|---|
| `<runId>.json` snapshot (`OSd`) | `.filter(n => n.type !== "workflow_log")` (via `M`, `:388682`) | `/workflows` history after the task is evicted | `:386969-386978`, `:388755-388775` |
| `<taskId>.output` (`VPs`) | `.filter(a => a.type !== "workflow_log")` | `TaskOutput` retrieval by the model | `:386593-386613` |
| task-notification (`qxo`) | passes `M` (already log-free) and derives a census | the main agent's turn | `:386655-386762` |

**Why logs are stripped from all three.** Logs are the only unbounded, human-oriented kind. The
output file is what the model reads via `TaskOutput`, and 500 lines of `parallel[7] failed: …` would
crowd out the result. The `logs` array is preserved *separately* on the task and written as its own
top-level `logs:` field (`:386602`, `:388762`), capped at `i6y = 1000` entries by `rEd`
(`:388443`) — so the information survives, just not interleaved with the node tree.

---

## 4. Steering: what the human can do to a running workflow

Three controls, all routed through the registry rather than through the script:

| Control | Function | Mechanism | Observable in the script |
|---|---|---|---|
| Kill the run | `tve` (`:386627-386634`) | aborts the task's `AbortController` | every host call returns a forever-pending promise; the script simply stops |
| Skip one agent | `Vfr` → `ISd("user-skip")` (`:386650`, `:386635-386648`) | aborts that agent's controller | `agent()` returns `null` |
| Retry one agent | `zfr` → `ISd("user-retry")` (`:386653`) | same, different reason | transparent — feeds the retry ladder |

```javascript
// ============================================
// abortWorkflowAgent - Abort exactly one in-flight agent by id, with a reason the runner reads back
// Location: cli_inner_pretty.js:386635-386648
// ============================================

// ORIGINAL (for source lookup):
function ISd(e, t, r, n) {
  let o = !1;
  if ((n.update(e, (i) => {
        if (i.status !== "running") return i;
        let s = i.agentControllers?.get(t);
        if (s && !s.signal.aborted) (s.abort(new DOMException(r, "AbortError")), (o = !0));
        return i;
      }), o))
    be(r === "user-skip" ? "task_local_workflow_skip_agent" : "task_local_workflow_retry_agent");
  return o;
}

// READABLE (for understanding):
function abortWorkflowAgent(taskId, agentId, reason, registry) {
  let aborted = false;
  registry.update(taskId, (task) => {
    if (task.status !== "running") return task;
    const controller = task.agentControllers?.get(agentId);
    if (controller && !controller.signal.aborted) {
      controller.abort(new DOMException(reason, "AbortError"));   // reason ∈ {"user-skip","user-retry"}
      aborted = true;
    }
    return task;                                                   // NOTE: returns the same object
  });
  if (aborted) countSuccess(reason === "user-skip" ? "task_local_workflow_skip_agent"
                                                   : "task_local_workflow_retry_agent");
  return aborted;
}

// Mapping: ISd→abortWorkflowAgent, Vfr→skipWorkflowAgent, zfr→retryWorkflowAgent
```

**Why the reason travels as a `DOMException` name.** The runner reads it back with
`My(Xe.signal.reason)` (`:387643`) and branches on the string. Using the abort *reason* rather than a
side-channel flag means the signal is self-describing at every `await` point in the agent's stack, and
it composes with the two other reasons the same slot carries — `"stalled"` (from the stall timer,
`:387547`) and `"workflow-abort"` (from the parent, `:387539`).

**The `agentControllers` map is registered by the executor**, not by the launcher:
`onAgentController(agentId, controller)` (`:387541`, cleared at `:387723`) → `Osn`'s handler
(`:388665-388668`) writes into `E.agentControllers`. The register-then-deregister pairing in a
`finally` is what keeps the map from growing to 1,000 stale entries in a long run.

**`update` returns the same object** (`return i`) — the mutation is the `abort()` side effect, not a
state change. That means no re-render is triggered by the skip itself; the UI updates when the
aborted agent emits its `state: "error"` node a moment later. Deliberate: a state change here would
render a row as "skipped" before the agent had actually unwound.

---

## 5. Main agent ↔ workflow: the completion notification

This is the only channel by which a workflow's *result* reaches the model.

```javascript
// ============================================
// notifyWorkflowCompletion - Build and enqueue the task-notification for the owning agent
// Location: cli_inner_pretty.js:386655-386762
// ============================================

// ORIGINAL (for source lookup, abridged):
function qxo({ taskId: e, summary: t, status: r, result: n, failures: o, error: i, agentCount: s,
               totalTokens: a, totalToolCalls: l, durationMs: c, taskRegistry: u, toolUseId: d,
               transcriptDir: p, scriptPath: f, workflowRunId: m, args: g, workflowProgress: y }) {
  let { claimed: _, task: E } = pBe(e, u),
    A = zPs({ ownerAgentId: E?.ownerAgentId, keepaliveReason: `workflow:${e}`, delivering: _, taskRegistry: u });
  if (!_) return;
  ...
  dp({ value: u6({ taskId: e, toolUseId: d, outputFile: R, status: r, summary: Na(T),
                   body: `${C}${H}${I}${L}${M}` }),
       mode: "task-notification", agentId: A, priority: "next", taskId: e });
}

// READABLE (for understanding):
function notifyWorkflowCompletion({ taskId, summary, status, result, failures, error, agentCount,
                                    totalTokens, totalToolCalls, durationMs, taskRegistry, toolUseId,
                                    transcriptDir, scriptPath, workflowRunId, args, workflowProgress }) {
  const { claimed, task } = claimNotificationOnce(taskId, taskRegistry);      // pBe, :301459
  const deliverTo = releaseKeepaliveAndPickRecipient({                        // zPs, :432715
    ownerAgentId: task?.ownerAgentId, keepaliveReason: `workflow:${taskId}`,
    delivering: claimed, taskRegistry });
  if (!claimed) return;                                     // someone already notified → exactly-once
  …
  enqueuePendingNotification({ value: renderTaskNotification({ taskId, toolUseId, outputFile,
                                                  status, summary: escape(headline),
                                                  body: recovery + resultBlock + diagnostics + failuresBlock + usage }),
                  mode: "task-notification", agentId: deliverTo, priority: "next", taskId });
}

// Mapping: qxo→notifyWorkflowCompletion, pBe→claimNotificationOnce (:301459), zPs→releaseKeepaliveAndPickRecipient (:432715),
//          u6→renderTaskNotification (:301470-301485), dp→enqueuePendingNotification (:217321, name leaked), Na→escapeForXmlish, ly→outputFilePath
```

### 5.1 Exactly-once, and who receives it

```javascript
// ORIGINAL (pBe):
function pBe(e, t) {
  let r = !1, n;
  return (t.update(e, (o) => { if (((n = o), o.notified)) return o; return ((r = !0), { ...o, notified: !0 }); }),
          { claimed: r, task: n });
}

// READABLE: an atomic test-and-set on `notified` inside the registry's update — the claim and the
//           flag flip happen in one reducer call, so two racing completion paths cannot both deliver.
```

The workflow has **three** paths that can call `qxo`: the normal completion (`:388795`), the
`.catch` on the async IIFE (`:388836`), and — indirectly — a `tve` kill that sets `notified: true`
without notifying (`:386619`, `:386628`). The claim latch is what makes those safe.

`zPs` picks the recipient and releases the keepalive in one step: if the owner is a live subagent the
notification goes to *it* (`qc(e)`), otherwise to the main session (`Si()`). It releases the keepalive
**unless** it is both delivering and the owner is alive — i.e. the owner must stay pinned exactly
long enough to receive the message.

### 5.2 The message body — five blocks

```xml
<task-notification>
<task-id>…</task-id>
<tool-use-id>…</tool-use-id>
<output-file>…/<taskId>.output</output-file>
<status>completed|failed|killed</status>
<summary>Dynamic workflow "…" completed</summary>
  <recovery>…</recovery>        ← failed/killed only
  <result>…</result>            ← completed only, ≤8000 chars
  <diagnostics>…</diagnostics>  ← completed only          ★ NET_NEW
  <failures>…</failures>        ← if the script recorded any
  <usage>…</usage>
</task-notification>
```

Tag names come from `:24717-24723`. Each block, with its reason for existing:

**`<recovery>`** (`:386685-386698`) — failed or killed only. Carries the exact
`Workflow({scriptPath, resumeFromRunId, args})` call and the transcript dir. The model is handed a
literal next action rather than being left to reconstruct one from the schema.

**`<result>`** (`:386719-386729`) — `JSON.stringify(result)` truncated at 8,000 chars, with the
overflow noted and the output-file path repeated:

```javascript
// ORIGINAL:
if ($.length > 8000) H = `\n<result>${$.slice(0, 8000)}\n... (truncated ${$.length - 8000} chars, full result in ${R})</result>`;
```

Note `D = 8000` is assigned at `:386721` and then never used — the literal `8000` is written out
three times instead. Harmless, but it is the kind of detail that tells you this block was edited by
hand rather than generated.

**`<diagnostics>`** (`:386699-386716`) — **NET_NEW** (`220=1 / 193=0`). Completed runs only:

> `Per-agent results: <transcriptDir>/journal.jsonl — one {"type":"result",...} line per completed agent with its full return value.`
> `If the result above is empty or unexpected, Read this file BEFORE diagnosing — do not assume agents returned non-empty results.`
> `To re-run with edited post-processing: Workflow({scriptPath: '…', resumeFromRunId: '…'}) — agents whose (prompt, opts) are unchanged replay from cache.`

**Why this was added.** It is the third of three coordinated edits in this window that all address
one failure mode: *a workflow completes, returns `[]` or `{}`, and the model concludes the codebase
has no instances of whatever it was looking for.* The other two are the added sentence in the tool
prose (`:389101`, [README §3](README.md)) and the `<agents_empty_result>` census below. The journal
is the only artefact that can distinguish "the agents found nothing" from "the agents returned
nothing", and before this window nothing pointed the model at it.

**`<usage>` and the agent census** (`:386738-386754`) — the census is **NET_NEW**:

```javascript
// ============================================
// Agent-state census attached to <usage>
// Location: cli_inner_pretty.js:386738-386754; GWy :386780
// ============================================

// ORIGINAL (for source lookup):
if (y) {
  let $ = 0, D = 0, U = 0, W = 0;
  for (let q of y) {
    if (q.type !== "workflow_agent") continue;
    if (q.state === "done") { if (($++, q.resultPreview === void 0 || GWy.test(q.resultPreview))) W++; }
    else if (q.state === "error") if (q.skipped) U++; else D++;
  }
  P = `<agents_done>${$}</agents_done><agents_error>${D}</agents_error><agents_skipped>${U}</agents_skipped><agents_empty_result>${W}</agents_empty_result>`;
}
GWy = /^(\[\s*\]|\{\s*\}|\{\s*"[^"]+"\s*:\s*\[\s*\]\s*\})$/;

// READABLE (for understanding):
const EMPTY_RESULT_RE = /^(\[\s*\]|\{\s*\}|\{\s*"[^"]+"\s*:\s*\[\s*\]\s*\})$/;   // [] · {} · {"k":[]}

if (progressNodes) {
  let done = 0, errored = 0, skipped = 0, empty = 0;
  for (const n of progressNodes) {
    if (n.type !== "workflow_agent") continue;
    if (n.state === "done") {
      done++;
      if (n.resultPreview === undefined || EMPTY_RESULT_RE.test(n.resultPreview)) empty++;
    } else if (n.state === "error") {
      if (n.skipped) skipped++; else errored++;
    }
  }
  census = `<agents_done>${done}</agents_done><agents_error>${errored}</agents_error>`
         + `<agents_skipped>${skipped}</agents_skipped><agents_empty_result>${empty}</agents_empty_result>`;
}

// Mapping: GWy→EMPTY_RESULT_RE, $→done, D→errored, U→skipped, W→empty, P→census
```

**Why the regex has exactly three alternatives.** It is not a general emptiness test — it is tuned to
the three shapes a schema-constrained agent actually returns when it finds nothing:

| Alternative | Matches | Produced by |
|---|---|---|
| `[\s*]` | `[]` | a schema whose root is an array |
| `{\s*}` | `{}` | a schema with all-optional properties |
| `{\s*"key"\s*:\s*\[\s*\]\s*}` | `{"findings": []}` | the dominant pattern in the tool prose's own examples (`{schema: FINDINGS_SCHEMA}` etc.) |

Anything richer — `{"count": 0}`, `{"findings": [], "notes": "…"}` — is *not* counted as empty,
which keeps the signal specific. And `resultPreview === undefined` counts as empty too, covering the
plain-text agent that returned `""`.

**Why a count rather than a flag.** `<agents_done>12</agents_done><agents_empty_result>12</agents_empty_result>`
tells the model something qualitatively different from `12`/`1`: the former means the fan-out found
nothing anywhere (suspect the prompt or the search), the latter means one agent came back empty
(probably genuine). A boolean would collapse the distinction.

Note the census reads `resultPreview` — which is `Ift`-truncated at 400 chars. Truncation only ever
makes a string *longer* than its prefix, so a truncated non-empty result can never accidentally match
the anchored regex. The direction of the error is safe.

### 5.3 What the model does *not* get

- **No in-flight node state.** There is no tool that returns `workflowProgress` for a running task.
  `TaskOutput` reads `<taskId>.output`, which is only written at completion (`:386596`).
- **No phase-level breakdown in the notification.** The per-phase aggregation computed at
  `:388713-388752` goes to *telemetry* only, and only for verbatim built-ins.
- **No token attribution per agent.** `<usage>` has run totals; the per-agent `tokens` field exists
  in the nodes and reaches the output file, but nothing summarises it into the message.

---

## 6. Reading guide

If you are debugging a workflow's observable behaviour, the order of authority is:

1. **`<transcriptDir>/journal.jsonl`** — the only record of what each agent actually returned. Cached
   entries are `{type:"result",key,agentId,result}`; a `{type:"started"}` with no matching result is
   an agent that began and never finished.
2. **`<taskId>.output`** — the completion snapshot the model reads, node array included, logs excluded.
3. **`<runId>.json`** — the `/workflows` history record; survives task eviction.
4. **The `workflow_agent` nodes** — authoritative for state and timing, *display-resolved* for `model`
   (see [workflow_model_resolution.md §1.3](workflow_model_resolution.md)), truncated for previews.
5. **The task-notification** — a lossy summary designed for a model's context budget, not for
   forensics.

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
- `registerWorkflowTask` (GPs) - `:386454-386493` and `registerPausedWorkflowPlaceholder` (WPs) - `:386502-386522`
- `applyWorkflowProgressEvents` (qPs) - `:386523-386572` — the index-keyed upsert reducer
- `MAX_PROGRESS_NODES` (kSd) - `:386764` — 500, log-trim threshold at 2×
- `createProgressBatcher` (c6y) - `:388538-388569`; `PROGRESS_BATCH_WINDOW_MS` (s6y) `:388911`, `BRIDGE_MIN_INTERVAL_MS` (a6y) `:388912`, `SNAPSHOT_HEARTBEAT_MS` (l6y) `:388913`
- `isNotWorkflowLog` (oEd) - `:388907-388909`
- `emitTaskProgressFrame` (Vpr) - `:345314-345327` — the stream-json `task_progress` frame
- `publishAgentFan` (Ocd) - `:335489-335505` and `buildAgentFanItems` (lol) - `:764295-764389`
- `partitionWorkflowProgress` (RTr) - `:650495-650504`, `groupAgentsByPhase` (L9o) - `:650505-650518`, `buildPhaseGroups` (pya) - `:651229-651235`
- `currentPhaseForWarning` (kvn) - `:651236-651238` — **stub, always returns `null`**
- `summariseWorkflowAgents` (Ivn) - `:651292-651309`
- `truncatePreview` (Ift) - `:387143-387148`, `PREVIEW_MAX_CHARS` (BSd) - `:388114`
- `notifyWorkflowCompletion` (qxo) - `:386655-386762`
- `EMPTY_RESULT_RE` (GWy) - `:386780`
- `claimNotificationOnce` (pBe) - `:301459-301469` and `releaseKeepaliveAndPickRecipient` (zPs) - `:432715-432720` — the exactly-once pair
- `abortWorkflowAgent` (ISd) - `:386635-386648`, `skipWorkflowAgent` (Vfr) - `:386649-386651`, `retryWorkflowAgent` (zfr) - `:386652-386654`
- `writeWorkflowSnapshot` (OSd) - `:386969-386978`, `completeWorkflowTask` (VPs) - `:386593-386613`
