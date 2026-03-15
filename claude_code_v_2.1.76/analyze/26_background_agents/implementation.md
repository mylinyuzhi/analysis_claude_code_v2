# Background Agents — Deep Implementation Analysis (Claude Code 2.1.76)

## Module Overview

Background agents are one of the most architecturally sophisticated systems in Claude Code. They allow any `Task` (subagent) or `Bash` (shell command) tool call to be detached from the main conversation loop, running asynchronously while the lead agent continues other work. This document provides a complete reverse-engineered analysis of every layer: task identity, file I/O, state machine, notification queue, progress tracking, kill/abort, and the management tools.

**Key source files:**
- `chunks.89.mjs` — All core background machinery (output files, task records, state machine, notifications, progress tracker, command queue)
- `chunks.132.mjs` — `AgentTool` (`rj1`) implementation — the entry point for `run_in_background=true`
- `chunks.170.mjs` — `BashTool` (`h4`) — three separate backgrounding modes
- `chunks.139.mjs` — `TaskOutput` (`kW6`) and `TaskStop` (`vW6`) management tools

---

## What's New in v2.1.76

### `background: true` Task Field

v2.1.76 introduces an explicit `background` boolean field in the task record (in addition to the `run_in_background` input parameter). This field is set to `true` when a task was explicitly requested as background (not converted mid-execution), allowing downstream components to distinguish:

- **Explicitly backgrounded**: `run_in_background=true` in tool call → `task.background = true`
- **Foreground-then-backgrounded**: started sync, user backgrounded → `task.isBackgrounded = true`

### Ctrl+F Kill All

`killAllRunningAgents` (`Kd7`) is now bound to the Ctrl+F key in the TUI. It iterates all tasks in `appState.tasks` where `type === "local_agent"` and `status === "running"`, calling `killTask (na)` for each.

### Partial Results on Kill

Before marking a task "killed", v2.1.76 ensures `readOutputFileDelta` is called to capture any output accumulated since the last progress snapshot. This delta is included in the `task_status` attachment surfaced to the main conversation, preserving partial results from tool calls that completed before the kill.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Subagent Execution module)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols in this document:
- `AgentTool` (rj1) — `chunks.132.mjs:85`
- `createAsyncTask` (zd7) — `chunks.89.mjs:~1447`
- `createForegroundTask` (wd7) — `chunks.89.mjs:~1477`
- `backgroundForegroundTask` (Hd7) — `chunks.89.mjs:~1515`
- `killTask` (na) — `chunks.89.mjs:~1375`
- `killAllRunningAgents` (Kd7) — `chunks.89.mjs`
- `notifyTaskCompletion` (vK1) — `chunks.89.mjs:1346`
- `createTaskRecord` (IZ) — `chunks.89.mjs:~528`
- `createTaskId` (hp) — `chunks.89.mjs:~522`
- `getOutputFilePath` (ww) — `chunks.89.mjs:249`
- `appendToOutputFile` (ZK1) — `chunks.89.mjs:253`
- `readOutputFileDelta` (WjA) — `chunks.89.mjs:276`
- `readFullOutput` (M_6) — `chunks.89.mjs:300`
- `trackProgressFromMessage` (Qj1) — `chunks.89.mjs:1307`
- `getProgressSnapshot` (zB1) — `chunks.89.mjs:1327`
- `enqueueCommand` (WR) — `chunks.89.mjs:~402`
- `TaskOutputTool` (kW6) — `chunks.139.mjs:~1922`
- `TaskStopTool` (vW6) — `chunks.139.mjs:~1537`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Lead Agent Loop                              │
│  (main conversation, waiting for user input or processing queries)  │
└───────────────────┬────────────────────────────┬────────────────────┘
                    │ Task tool call              │ receives notification
                    │ run_in_background=true      │ (via command queue)
                    ▼                             │
┌─────────────────────────┐                       │
│  AgentTool.call()       │                       │
│  (chunks.132.mjs:85)    │                       │
│  rj1 / AgentTool        │                       │
└────────┬────────────────┘                       │
         │                                        │
         ▼                                        │
┌─────────────────────────┐   ┌───────────────────┴──────┐
│  zd7()                  │   │  vK1()                    │
│  createAsyncTask        │   │  notifyTaskCompletion     │
│  chunks.89.mjs:~1447    │   │  chunks.89.mjs:1346       │
│  ─────────────────────  │   │  ─────────────────────    │
│  • IZ() → task record   │   │  • atomic notified guard  │
│  • Ij1() → symlink file │   │  • XML notification block │
│  • bZ() → register task │   │  • WR() → enqueue         │
│  • Tq() → exit cleanup  │   └────────────┬─────────────┘
└────────┬────────────────┘                │ WR({mode:"task-notification"})
         │ returns {agentId, taskRecord}   │
         │                                 ▼
         ▼                      ┌──────────────────────┐
┌─────────────────────────┐     │  Command Queue       │
│  p01() fire-and-forget  │     │  xj1 (array)         │
│  (withTelemetrySpan)    │     │  W_6 (subscribers)   │
│  ─────────────────────  │     │  G_6() notifies all  │
│  for await dR() loop    │     └──────────────────────┘
│  (agent loop generator) │
│  ─────────────────────  │
│  per message:           │
│   Qj1() progress track  │
│   ZK1() write to file   │
│   RjA() update state    │
└────────────────────────┘

File System:
  ~/.claude/tasks/{taskId}.output    ← output file
  ~/.claude/sessions/{prefixed-id}/  ← symlink target (human-readable path)
```

---

## Part 1: Task Identity System

### Task ID Generation (`hp` / `createTaskId`)

```javascript
// ============================================
// createTaskId - Generates prefixed task identifier
// Location: chunks.89.mjs:522
// ============================================

// ORIGINAL (for source lookup):
function hp(A) {
    let q = Rv9(A),
        K = kv9().replace(/-/g, "").substring(0, 6);
    return `${q}${K}`
}

// READABLE (for understanding):
function createTaskId(taskType) {
    let prefix   = getTypePrefix(taskType);  // "a", "b", "r", "t"
    let shortUuid = generateUUID().replace(/-/g, "").substring(0, 6);
    return `${prefix}${shortUuid}`;          // e.g. "a3f9c2" for a local_agent
}

// Mapping: hp→createTaskId, Rv9→getTypePrefix, kv9→generateUUID, A→taskType
```

**Type prefix map (`Lv9`):**

| taskType | prefix | Example ID |
|----------|--------|-----------|
| `local_agent` | `a` | `a3f9c2` |
| `local_bash` | `b` | `b7c4e1` |
| `remote_agent` | `r` | `r2a8f0` |
| `in_process_teammate` | `t` | `t5d3b9` |

**Why this approach:**
- Single-character prefix enables visual identification in logs and UI without parsing
- 6-char UUID fragment gives 16^6 = ~16 million collision resistance per prefix
- IDs double as filename components: `a3f9c2.output` — no lookup needed to find the file

### Task Record Structure (`IZ` / `createTaskRecord`)

```javascript
// ============================================
// createTaskRecord - Constructs the initial task state object
// Location: chunks.89.mjs:528
// ============================================

// ORIGINAL (for source lookup):
function IZ(A, q, K) {
    return {
        id: A, type: q, status: "pending", description: K,
        startTime: Date.now(), outputFile: ww(A), outputOffset: 0, notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description) {
    return {
        id:           taskId,
        type:         taskType,
        status:       "pending",          // initial state
        description:  description,
        startTime:    Date.now(),
        outputFile:   getOutputFilePath(taskId),  // ww(taskId) → {tasksDir}/{taskId}.output
        outputOffset: 0,                  // byte cursor for incremental reads (TaskOutput)
        notified:     false               // guard: ensures vK1 fires only once
    };
}

// Mapping: IZ→createTaskRecord, A→taskId, q→taskType, K→description
```

Additional fields added by `zd7`/`wd7` at runtime:
- `agentId`, `prompt`, `selectedAgent`, `agentType`
- `abortController` — for kill/abort
- `unregisterCleanup` — removes the process-exit handler when done
- `isBackgrounded` — `true` if converted from foreground mid-execution
- `background` — `true` if explicitly started with `run_in_background=true` (new in v2.1.76)
- `retrieved`, `lastReportedToolCount`, `lastReportedTokenCount`
- `progress` — `{ toolUseCount, tokenCount, lastActivity, recentActivities }`
- `result`, `error`, `endTime` — set on completion/failure

---

## Part 2: Output File System

The output file system is the communication backbone between background agents and their callers. Every background task writes its output incrementally to a file that can be polled, streamed, or read in full.

### Directory Layout

```
~/.claude/                     (or project data dir)
└── tasks/
    ├── a3f9c2.output          local_agent task output
    ├── b7c4e1.output          local_bash task output
    └── ...
~/.claude/sessions/
    └── agent-a3f9c2/          session transcript dir (symlink target)
```

`eu1()` → `getTasksDir()` computes the tasks dir as `join(getProjectDataDir(), "tasks")`.

### getOutputFilePath (`ww`)

```javascript
// ============================================
// getOutputFilePath - Deterministic output file path from task ID
// Location: chunks.89.mjs:249
// ============================================

// ORIGINAL (for source lookup):
function ww(A) {
    return MjA(eu1(), `${A}.output`)
}

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return joinPath(getTasksDir(), `${taskId}.output`);
}

// Mapping: ww→getOutputFilePath, A→taskId, MjA→joinPath, eu1→getTasksDir
```

**Key insight:** By exposing `outputFile` in the immediate return value of the tool, the LLM can use its existing `Read` or `Bash(tail)` tools to check background task progress without any new API. The file IS the channel.

### writeOutputChunk (`ZK1`)

```javascript
// ============================================
// writeOutputChunk - Async serialized append to task output file
// Location: chunks.89.mjs:253
// ============================================

// ORIGINAL (for source lookup):
function ZK1(A, q) {
    try {
        PjA();
        let w = ww(A), H = Nv9(w);
        if (!GK1(H)) Lp7(H, { recursive: !0 })
    } catch (w) { K1(w instanceof Error ? w : Error(String(w))); return }
    let K = ww(A),
        z = (vp7.get(A) ?? Promise.resolve()).then(async () => {
            try { await Vv9(K, q, "utf8") }
            catch (w) { K1(w instanceof Error ? w : Error(String(w))) }
        });
    vp7.set(A, z)
}

// READABLE (for understanding):
function writeOutputChunk(taskId, text) {
    try {
        ensureTasksDirExists();
        let outputPath = getOutputFilePath(taskId);
        let parentDir  = dirname(outputPath);
        if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true });
    } catch (err) { logError(err); return; }

    let filePath = getOutputFilePath(taskId);
    let chainedWrite = (pendingWrites.get(taskId) ?? Promise.resolve())
        .then(async () => {
            try { await appendFileAsync(filePath, text, "utf8"); }
            catch (err) { logError(err); }
        });
    pendingWrites.set(taskId, chainedWrite);  // serialize per-task
}

// Mapping: ZK1→writeOutputChunk, A→taskId, q→text, PjA→ensureTasksDirExists,
//   Nv9→dirname, GK1→existsSync, Lp7→mkdirSync, Vv9→appendFileAsync,
//   vp7→pendingWrites (Map<taskId, Promise>)
```

**Serialization mechanism — why promise chaining:**

```
write("chunk1") → Promise_A
write("chunk2") → (Promise_A).then(write_chunk2) = Promise_B
write("chunk3") → (Promise_B).then(write_chunk3) = Promise_C
```

Each new write chains onto the previous one. This guarantees FIFO ordering without any mutex or lock. Different tasks have independent chains — they don't block each other.

### readOutputFileDelta (`WjA`)

```javascript
// ============================================
// readOutputFileDelta - Incremental output read from byte offset
// Location: chunks.89.mjs:276
// ============================================

// ORIGINAL (for source lookup):
function WjA(A, q) {
    try {
        let K = ww(A);
        if (!GK1(K)) return { content: "", newOffset: q };
        let z = Gv9(K).size;
        if (z <= q) return { content: "", newOffset: q };
        return { content: Ep7(K, "utf8").slice(q), newOffset: z }
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))),
            { content: "", newOffset: q }
    }
}

// READABLE (for understanding):
function readOutputFileDelta(taskId, currentOffset) {
    try {
        let filePath = getOutputFilePath(taskId);
        if (!existsSync(filePath)) return { content: "", newOffset: currentOffset };
        let fileSize = statSync(filePath).size;
        if (fileSize <= currentOffset) return { content: "", newOffset: currentOffset };
        return {
            content:   readFileSync(filePath, "utf8").slice(currentOffset),
            newOffset: fileSize
        };
    } catch (err) {
        return logError(err), { content: "", newOffset: currentOffset };
    }
}

// Mapping: WjA→readOutputFileDelta, A→taskId, q→currentOffset, Gv9→statSync, Ep7→readFileSync
```

**How the offset pattern enables streaming without state:**
- Caller passes in the last known `newOffset` on each poll
- Returns only bytes written since that offset (the "delta")
- `newOffset` becomes the next call's input — it's a pure cursor pattern
- No server-side streaming, no WebSocket — just file position arithmetic

---

## Part 3: Task State Machine

### States and Transitions

```
                 ┌──────────┐
                 │ pending  │ ─── createTaskRecord()
                 └────┬─────┘
                      │ start execution
                      ▼
                 ┌──────────┐
                 │ running  │ ─── updateTaskProgress() / appendToOutputFile()
                 └────┬─────┘
                      │
         ┌────────────┼────────────────┐
         ▼            ▼                ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ completed│  │ failed   │  │ killed   │
  └──────────┘  └──────────┘  └──────────┘
       │              │              │
       └──────────────┴──────────────┘
                      │
                notifyTaskCompletion()
                (injects into queue)
```

Each task record contains:
- `id` — Unique task identifier
- `type` — One of `local_bash`, `local_agent`, `remote_agent`, `in_process_teammate`
- `status` — Current state in the machine above
- `description` — Human-readable description
- `startTime` / `endTime` — Timestamps
- `outputFile` — Path to the `.output` file
- `outputOffset` — Current read position for delta reads
- `notified` — Boolean guard against duplicate notifications
- `abortController` — For killing the task
- `background` — True if explicitly started as background (v2.1.76)
- `progress` — Optional progress summary object

---

## Part 4: Notification Queue

### notifyTaskCompletion (`vK1`)

**What it does:** When a background agent finishes (completes, fails, or is killed), injects a structured notification into the main conversation's command queue.

**How it works:**
1. Atomically sets `notified: true` on the task entry (prevents duplicate notifications)
2. If already notified, returns immediately (no-op)
3. Constructs a human-readable summary
4. Builds an XML-structured notification including: taskId, status, summary, result text, usage stats, output file path
5. Pushes the notification into the command queue via `WR()` with `mode: "task-notification"`

```javascript
// ============================================
// notifyTaskCompletion - Injects task completion into conversation
// Location: chunks.89.mjs:1346-1374
// ============================================

// ORIGINAL (for source lookup):
function vK1(A, q, K, Y, z, w, H) {
    let $ = !1;
    if (c5(A, z, (M) => {
        if (M.notified) return M;
        return $ = !0, { ...M, notified: !0 }
    }), !$) return;
    let O = K === "completed" ? `Agent "${q}" completed`
          : K === "failed" ? `Agent "${q}" failed: ${Y||"Unknown error"}`
          : `Agent "${q}" was stopped`,
        _ = ww(A),
        J = w ? `\n<result>${w}</result>` : "",
        X = H ? `\n<usage>total_tokens: ${H.totalTokens}\ntool_uses: ${H.toolUses}\nduration_ms: ${H.durationMs}</usage>` : "",
        D = KY() ? "" : `\nFull transcript available at: ${_}`,
        j = `<task_notification>\n<task_id>${A}</task_id>\n<status>${K}</status>\n<summary>${O}</summary>${J}${X}\n</task_notification>${D}`;
    WR({ value: j, mode: "task-notification" })
}

// READABLE (for understanding):
function notifyTaskCompletion(taskId, description, status, errorMsg, setAppState, resultText, usage) {
    let wasNotified = false;
    updateTaskState(taskId, setAppState, (task) => {
        if (task.notified) return task;
        return wasNotified = true, { ...task, notified: true };
    });
    if (!wasNotified) return;  // Already notified, skip

    let summary = status === "completed" ? `Agent "${description}" completed`
                : status === "failed" ? `Agent "${description}" failed: ${errorMsg||"Unknown error"}`
                : `Agent "${description}" was stopped`;
    let outputFile = getOutputFilePath(taskId);
    let resultBlock = resultText ? `\n<result>${resultText}</result>` : "";
    let usageBlock  = usage ? `\n<usage>total_tokens: ${usage.totalTokens}...</usage>` : "";
    let transcriptRef = isRemoteSession() ? "" : `\nFull transcript available at: ${outputFile}`;
    let notification = `<task_notification>\n<task_id>${taskId}</task_id>\n<status>${status}</status>\n<summary>${summary}</summary>${resultBlock}${usageBlock}\n</task_notification>${transcriptRef}`;
    enqueueCommand({ value: notification, mode: "task-notification" });
}

// Mapping: vK1→notifyTaskCompletion, A→taskId, q→description, K→status, Y→errorMsg,
//   z→setAppState, w→resultText, H→usage, c5→updateTaskState, ww→getOutputFilePath,
//   WR→enqueueCommand, KY→isRemoteSession
```

**Key insight:** The `mode: "task-notification"` on the queue entry causes special handling — if there are active listeners (via `W_6`), the notification is pushed directly and listeners are poked. This ensures timely delivery even when the main loop is idle.

---

## Part 5: Sync-to-Background Conversion

**What it does:** Even synchronous agents can be "backgrounded" mid-execution if the user requests it.

**How it works:**
1. A sync agent starts with `wd7()` which creates a task entry with a `backgroundSignal` promise
2. During execution, the code races each agent message against the `backgroundSignal`
3. If the signal fires (user pressed background hotkey), and `isBackgrounded` is true on the task:
   - A new `p01()` wrapper is started with `isAsync: true`
   - The function returns `{ status: "async_launched", ... }` just like the explicit background case
4. The previously accumulated messages are replayed into the new async context

**Key insight:** This dual-mode design (explicit background vs. user-initiated background) shares the same completion/notification infrastructure. The transition point is seamless because the agent loop (`dR()`) is an async iterator — it can be consumed by either the sync or async handler.

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| File-based output | LLM can read via existing tools; no special API needed |
| Promise-chain serialization | Lightweight, per-task write ordering without global locks |
| Atomic notification guard | Prevents duplicate completion messages |
| Queue injection (not direct insert) | Respects the main loop's message ordering |
| XML-structured notifications | Machine-parseable by the LLM for programmatic handling |
| Type-prefixed IDs | Quick visual identification of task type in logs/UI |
| `background` field (v2.1.76) | Distinguishes explicit vs. user-converted background tasks |
| Ctrl+F kill all (v2.1.76) | Efficient bulk cleanup without per-task UI interaction |
| Partial results on kill (v2.1.76) | Preserves useful work from partially-completed agents |
