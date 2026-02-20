# Background Agents — Deep Implementation Analysis (Claude Code 2.1.38)

## Module Overview

Background agents are one of the most architecturally sophisticated systems in Claude Code. They allow any `Task` (subagent) or `Bash` (shell command) tool call to be detached from the main conversation loop, running asynchronously while the lead agent continues other work. This document provides a complete reverse-engineered analysis of every layer: task identity, file I/O, state machine, notification queue, progress tracking, kill/abort, and the management tools.

**Key source files:**
- `chunks.89.mjs` — All core background machinery (output files, task records, state machine, notifications, progress tracker, command queue)
- `chunks.132.mjs` — `AgentTool` (`rj1`) implementation — the entry point for `run_in_background=true`
- `chunks.170.mjs` — `BashTool` (`h4`) — three separate backgrounding modes
- `chunks.139.mjs` — `TaskOutput` (`kW6`) and `TaskStop` (`vW6`) management tools

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Subagent Execution module)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols in this document:
- `rj1` (AgentTool) — `chunks.132.mjs:85`
- `zd7` (createAsyncTask) — `chunks.89.mjs:~1447`
- `wd7` (createForegroundTask) — `chunks.89.mjs:~1477`
- `Hd7` (backgroundForegroundTask) — `chunks.89.mjs:~1515`
- `na` (killTask) — `chunks.89.mjs:~1375`
- `Kd7` (killAllRunningAgents) — `chunks.89.mjs`
- `vK1` (notifyTaskCompletion) — `chunks.89.mjs:1346`
- `IZ` (createTaskRecord) — `chunks.89.mjs:~528`
- `hp` (createTaskId) — `chunks.89.mjs:~522`
- `ww` (getOutputFilePath) — `chunks.89.mjs:249`
- `ZK1` (writeOutputChunk) — `chunks.89.mjs:253`
- `WjA` (readOutputFileDelta) — `chunks.89.mjs:276`
- `M_6` (readFullOutput) — `chunks.89.mjs:300`
- `Qj1` (trackProgressFromMessage) — `chunks.89.mjs:1307`
- `zB1` (getProgressSnapshot) — `chunks.89.mjs:1327`
- `WR` (enqueueCommand) — `chunks.89.mjs:~402`
- `kW6` (TaskOutputTool) — `chunks.139.mjs:~1922`
- `vW6` (TaskStopTool) — `chunks.139.mjs:~1537`

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
- `isBackgrounded` — `true` if created async, initially `false` if foreground
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
        ensureTasksDirExists();  // PjA()
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

**Trade-off:** The chain accumulates in memory until all writes complete. For very long-lived tasks, this is a potential (but bounded) memory concern. In practice, write chains complete almost immediately, so the Map stays small.

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

**Trade-off:** `readFileSync().slice(offset)` reads the entire file on every poll. For large output files, this is O(n) per poll. A proper implementation would use `fs.read()` with a file descriptor and byte position. This is a conscious simplicity trade-off — background tasks typically produce bounded output.

### Additional Output File Utilities

- **`M_6` (readFullOutput):** Reads the complete output file as UTF-8. Used by `TaskOutput`'s `buildTaskSnapshot`.
- **`hj1` (initOutputFile):** Creates an empty `.output` file if it doesn't exist. Called before starting long-running tasks.
- **`Ij1` (symlinkOutputFile):** Creates a symlink from the output path to a human-readable session path. Falls back to `hj1` on error. This means both `~/.claude/tasks/a3f9c2.output` and the session transcript directory point to the same location.
- **`Rp7` (cleanupOutputFiles):** Deletes all `.output` files in the tasks directory. Called at startup to prevent stale output files from previous sessions.

---

## Part 3: Task State Machine

### States and Transitions

```
                      ┌─────────────────────────────────┐
                      │         zd7() / wd7()            │
                      ▼                                   │
                 ┌──────────┐  immediately                │
                 │ pending  │──────────────────────────▶│running│
                 └──────────┘                             │
                                                          │
                      ┌───────────────────────────────────┤
                      │               │               │    │
                      ▼               ▼               ▼    │
               ┌──────────┐  ┌──────────┐  ┌──────────┐  │
               │completed │  │  failed  │  │  killed  │  │
               └──────────┘  └──────────┘  └──────────┘  │
                      │               │               │    │
                      └───────────────┴───────────────┘    │
                                      │                    │
                                      ▼                    │
                              notifyTaskCompletion()        │
                              (vK1, fires once)             │
                                                           │
                      ┌──────────────────────────────────┐ │
                      │ isBackgrounded: false → true      │ │
                      │ (Hd7 — user presses background)  │◀┘
                      │ (continues running)               │
                      └──────────────────────────────────┘
```

### State Transition Functions

#### `zd7` — createAsyncTask (background from the start)

```javascript
// ============================================
// createAsyncTask - Creates a task that starts backgrounded immediately
// Location: chunks.89.mjs:~1447
// ============================================

// ORIGINAL (for source lookup):
function zd7({ agentId: A, description: q, prompt: K, selectedAgent: Y, setAppState: z, parentAbortController: w }) {
    Ij1(A, kh(xZ(A)));
    let H = w ? R61(w) : Aq(),
        $ = {
            ...IZ(A, "local_agent", q),
            type: "local_agent", status: "running",
            agentId: A, prompt: K, selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: H, retrieved: !1,
            lastReportedToolCount: 0, lastReportedTokenCount: 0,
            isBackgrounded: !0
        },
        O = Tq(async () => { na(A, z) });
    $.unregisterCleanup = O;
    bZ($, z);
    return $
}

// READABLE (for understanding):
function createAsyncTask({ agentId, description, prompt, selectedAgent, setAppState, parentAbortController }) {
    symlinkOutputFile(agentId, getHumanReadableSessionPath(prefixAgentId(agentId)));
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)  // R61 — linked to parent
        : new AbortController();
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description),
        type: "local_agent", status: "running",   // skip "pending", start as "running"
        agentId, prompt, selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController,
        retrieved: false,
        lastReportedToolCount: 0, lastReportedTokenCount: 0,
        isBackgrounded: true      // ← always true for background tasks
    };
    taskRecord.unregisterCleanup = registerProcessExitCleanup(async () => killTask(agentId, setAppState));
    registerTask(taskRecord, setAppState);  // bZ — adds to appState.tasks
    return taskRecord;
}

// Mapping: zd7→createAsyncTask, Ij1→symlinkOutputFile, kh→getHumanReadableSessionPath,
//   xZ→prefixAgentId, R61→createChildAbortController, Aq→newAbortController,
//   Tq→registerProcessExitCleanup, bZ→registerTask, ia→isLocalAgentTask
```

**Key design details:**
- Status is set to `"running"` immediately (skips `"pending"`) because there's no waiting period
- `parentAbortController` creates a **child abort controller** via `R61`. This means if the parent agent is killed, all its background children are also aborted automatically — a cascading kill
- `Tq` (registerProcessExitCleanup) ensures that if the Node.js process exits unexpectedly, the task is properly marked as killed — preventing zombie entries in the state on next startup

#### `wd7` — createForegroundTask (with mid-run backgrounding capability)

```javascript
// ============================================
// createForegroundTask - Creates a task with a promise-based background signal
// Location: chunks.89.mjs:~1477
// ============================================

// ORIGINAL (for source lookup):
function wd7({ agentId: A, description: q, prompt: K, selectedAgent: Y, setAppState: z }) {
    Ij1(A, kh(xZ(A)));
    let w = Aq(),
        H = Tq(async () => { na(A, z) }),
        $ = {
            ...IZ(A, "local_agent", q),
            type: "local_agent", status: "running",
            agentId: A, prompt: K, selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: w, unregisterCleanup: H,
            retrieved: !1, lastReportedToolCount: 0, lastReportedTokenCount: 0,
            isBackgrounded: !1
        },
        O, _ = new Promise((J) => { O = J });
    u_6.set(A, O);
    bZ($, z);
    return { taskId: A, backgroundSignal: _ }
}

// READABLE (for understanding):
function createForegroundTask({ agentId, description, prompt, selectedAgent, setAppState }) {
    symlinkOutputFile(agentId, getHumanReadableSessionPath(prefixAgentId(agentId)));
    let abortController = new AbortController();  // no parent — standalone
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description),
        type: "local_agent", status: "running",
        agentId, prompt, selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController,
        unregisterCleanup: registerProcessExitCleanup(async () => killTask(agentId, setAppState)),
        retrieved: false,
        lastReportedToolCount: 0, lastReportedTokenCount: 0,
        isBackgrounded: false     // ← starts as foreground
    };
    let resolveBackground;
    let backgroundSignal = new Promise((resolve) => { resolveBackground = resolve; });
    foregroundResolveMap.set(agentId, resolveBackground);  // u_6 Map
    registerTask(taskRecord, setAppState);
    return { taskId: agentId, backgroundSignal };
}

// Mapping: wd7→createForegroundTask, u_6→foregroundResolveMap, _→backgroundSignal
```

**The `backgroundSignal` promise pattern:**
The caller receives a `backgroundSignal` promise alongside the task ID. Inside the agent loop, each iteration races the next message against `backgroundSignal`. When the user presses the background key, `Hd7` resolves the promise, the race resolves to `{ type: "background" }`, and the sync loop converts to async mode.

#### `Hd7` — backgroundForegroundTask (sync → async conversion)

```javascript
// ============================================
// backgroundForegroundTask - Promotes a running foreground task to background
// Location: chunks.89.mjs:~1515
// ============================================

// ORIGINAL (for source lookup):
function Hd7(A, q, K) {
    let z = q().tasks[A];
    if (!ia(z) || z.isBackgrounded) return !1;
    K((H) => ({ ...H, tasks: { ...H.tasks, [A]: { ...z, isBackgrounded: !0 } } }));
    let w = u_6.get(A);
    if (w) w(), u_6.delete(A);
    return !0
}

// READABLE (for understanding):
function backgroundForegroundTask(agentId, getAppState, setAppState) {
    let task = getAppState().tasks[agentId];
    if (!isLocalAgentTask(task) || task.isBackgrounded) return false;  // no-op guard
    // Update state: set isBackgrounded=true
    setAppState((state) => ({
        ...state,
        tasks: { ...state.tasks, [agentId]: { ...task, isBackgrounded: true } }
    }));
    // Resolve the backgroundSignal promise (unblocks the racing loop in wd7's caller)
    let resolveBackground = foregroundResolveMap.get(agentId);
    if (resolveBackground) { resolveBackground(); foregroundResolveMap.delete(agentId); }
    return true;
}

// Mapping: Hd7→backgroundForegroundTask, ia→isLocalAgentTask, u_6→foregroundResolveMap
```

#### `na` — killTask

```javascript
// ============================================
// killTask - Aborts a running task and marks it killed (atomic)
// Location: chunks.89.mjs:~1375
// ============================================

// ORIGINAL (for source lookup):
function na(A, q) {
    let K = !1;
    return c5(A, q, (Y) => {
        if (Y.status !== "running") return Y;
        return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(),
            { ...Y, status: "killed", endTime: Date.now() }
    }), K
}

// READABLE (for understanding):
function killTask(taskId, setAppState) {
    let didKill = false;
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;  // idempotent — skip if not running
        didKill = true;
        task.abortController?.abort();    // signals AbortError to the agent loop's async generator
        task.unregisterCleanup?.();       // removes process-exit handler (no longer needed)
        return { ...task, status: "killed", endTime: Date.now() };
    });
    return didKill;
}

// Mapping: na→killTask, A→taskId, q→setAppState, c5→atomicUpdateTask
```

**Why atomicUpdateTask (`c5`) matters:**
The `c5` function wraps the state update so it's applied atomically via React's `setAppState` reducer. This prevents a race condition where two concurrent kill attempts both see `status: "running"` and both call `abort()`.

#### `yjA` — markTaskCompleted / `CjA` — markTaskFailed

These are symmetric state transitions that record final result/error data:

```javascript
// READABLE:
function markTaskCompleted(agentResult, setAppState) {
    atomicUpdateTask(agentResult.agentId, setAppState, (task) => ({
        ...task, status: "completed",
        result:  agentResult,
        endTime: Date.now()
    }));
}

function markTaskFailed(taskId, errorMessage, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task, status: "failed",
        error:   errorMessage,
        endTime: Date.now()
    }));
}

// Mapping: yjA→markTaskCompleted, CjA→markTaskFailed
```

#### `Kd7` — killAllRunningAgents

```javascript
// READABLE:
function killAllRunningAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks))
        if (task.type === "local_agent" && task.status === "running")
            killTask(taskId, setAppState);  // na()
}
// Mapping: Kd7→killAllRunningAgents
```

Called during session shutdown to ensure all background agents are cleanly terminated before exit.

---

## Part 4: AgentTool Background Execution

### Explicit Background Mode (`run_in_background=true`)

```javascript
// ============================================
// AgentTool.call() — async launch branch
// Location: chunks.132.mjs:251-314
// ============================================

// READABLE (for understanding):
async function agentToolCall({ prompt, subagent_type, description, run_in_background, resume, ... }, context) {
    // ... agent resolution, model selection, system prompt building ...

    // isAsync = run_in_background=true AND not in non-interactive session (KP6)
    let isAsync = (run_in_background === true) && !BACKGROUND_TASKS_DISABLED;

    if (isAsync) {
        let agentId = resume ? resume : generateUUID();  // z || NR()
        let taskRecord = createAsyncTask({              // zd7()
            agentId, description, prompt,
            selectedAgent, setAppState,
            parentAbortController: context.abortController
        });

        // FIRE AND FORGET — do NOT await this:
        withTelemetrySpan(telemetryCtx, async () => {          // p01()
            let messages = [];
            try {
                for await (let msg of runAgentLoop({ ...launchParams, override: { agentId: prefixAgentId(taskRecord.agentId) } })) {
                    // dR() generator
                    messages.push(msg);
                    trackProgressFromMessage(progressState, msg, ...);  // Qj1()
                    updateTaskProgress(taskRecord.agentId, getProgressSnapshot(progressState), setAppState);  // RjA() + zB1()
                }
                let agentResult = buildAgentResult(messages, taskRecord.agentId, metadata);  // UEA()
                let resultText  = agentResult.content.filter(b => b.type === "text").map(b => b.text).join("\n");
                markTaskCompleted(agentResult, setAppState);            // yjA()
                notifyTaskCompletion(agentId, description, "completed", undefined, setAppState, resultText, usageStats); // vK1()
            } catch (err) {
                if (err instanceof AbortError) {
                    if (killTask(agentId, setAppState))  // na()
                        notifyTaskCompletion(agentId, description, "killed", undefined, setAppState);
                    return;
                }
                let errorMsg = err.message ?? String(err);
                markTaskFailed(agentId, errorMsg, setAppState);         // CjA()
                notifyTaskCompletion(agentId, description, "failed", errorMsg, setAppState);
            }
        });  // ← no await here — function returns BELOW while agent runs above

        // IMMEDIATE RETURN (before agent completes):
        return {
            data: {
                isAsync:     true,
                status:      "async_launched",
                agentId,
                description,
                prompt,
                outputFile:  getOutputFilePath(agentId)  // ww()
            }
        };
    }
}
```

**The fire-and-forget pattern is the core of background execution:**
The `p01()` (withTelemetrySpan) wrapper starts an async chain but is NOT awaited. The function immediately falls through to the `return` statement. The parent agent receives `{ status: "async_launched", ... }` within milliseconds, while the agent loop continues running in the Node.js event loop's microtask queue.

### Sync-to-Background Conversion (mid-run backgrounding)

```javascript
// ============================================
// AgentTool.call() — sync loop with mid-run background detection
// Location: chunks.132.mjs:315-438
// ============================================

// READABLE (for understanding):
async function agentToolCall_syncBranch(...) {
    let agentId = resume ? prefixAgentId(resume) : generateUUID();
    let { taskId, backgroundSignal } = createForegroundTask({ agentId, ... });  // wd7()

    let agentLoopIterator = runAgentLoop({ ...launchParams })[Symbol.asyncIterator]();  // dR()

    while (true) {
        // Race: next message vs. user-initiated background signal
        let raceResult = await Promise.race([
            agentLoopIterator.next(),
            backgroundSignal.then(() => ({ type: "background" }))
        ]);

        if (raceResult.type === "background") {
            // User pressed background key → Hd7() was called → backgroundSignal resolved
            let taskState = getAppState().tasks[taskId];
            if (isLocalAgentTask(taskState) && taskState.isBackgrounded) {
                // Switch to full async mode from current position
                withTelemetrySpan(telemetryCtx, async () => {  // p01() fire-and-forget
                    for await (let msg of runAgentLoop({ isAsync: true, ... })) {
                        messages.push(msg);
                        trackProgressFromMessage(...);
                        updateTaskProgress(...);
                    }
                    // same completion/failure handling as explicit background mode
                });
                return {
                    data: {
                        isAsync: true, status: "async_launched",
                        agentId, description, prompt,
                        outputFile: getOutputFilePath(agentId)
                    }
                };
            }
        }

        // Normal sync message processing
        if (raceResult.done) break;
        messages.push(raceResult.value);
        // ... emit progress to UI, update state ...
    }

    // Sync completion (no backgrounding happened)
    let agentResult = buildAgentResult(messages, agentId, metadata);
    return { data: { status: "completed", prompt, ...agentResult } };
}
```

**Why this design is elegant:**
The sync and async paths share almost all of their completion/notification infrastructure. The only difference is the `Promise.race` in the sync path that can intercept a background request. Once the race resolves as "background", the code spins up the same fire-and-forget pattern as the explicit background path. This is a clean state machine transition with no code duplication.

### Tool Result Rendering (`mapToolResultToToolResultBlockParam`)

The agent tool transforms its result into a human-readable block for the parent conversation:

```javascript
// For async_launched status:
`
The agent is running in the background.
agentId: ${agentId}
  (for resuming to continue this agent's work if needed)
output_file: ${outputFile}
  (Use TaskOutput tool to check progress or wait for completion)
`

// For completed status:
`
Agent completed successfully.
${contentText}
agentId: ${agentId}
<usage>total_tokens: N  tool_uses: N  duration_ms: N</usage>
`
```

---

## Part 5: BashTool — Three Backgrounding Modes

### Constants and Flags

```javascript
// chunks.170.mjs:514
q_q = 2000        // BASH_BACKGROUND_TIMEOUT_MS: auto-background after 2 seconds of no completion
Id1 = parseBoolean(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)  // BACKGROUND_TASKS_DISABLED
```

### Mode 1: Explicit Background (`run_in_background=true`)

```javascript
// ORIGINAL (for source lookup):
if (_ === !0 && !Id1) {
    let B = await Z();  // Z = spawnBackgroundShellTask()
    return c("tengu_bash_command_explicitly_backgrounded", { command_type: z_q(w) }),
        { stdout: "", stderr: "", code: 0, interrupted: false, backgroundTaskId: B }
}

// READABLE:
if (run_in_background === true && !BACKGROUND_TASKS_DISABLED) {
    let taskId = await spawnBackgroundShellTask();
    trackEvent("tengu_bash_command_explicitly_backgrounded");
    return { stdout: "", stderr: "", code: 0, interrupted: false, backgroundTaskId: taskId };
}
```

**Behavior:** Returns immediately with empty stdout/stderr. The command runs in a background shell process tracked by `taskId`. The caller gets a `backgroundTaskId` to pass to `TaskOutput` or `TaskStop`.

### Mode 2: Timeout-Based Background (auto-background after 2 seconds)

```javascript
// READABLE:
// During the polling loop, if command hasn't finished after q_q ms (2000ms):
if (!BACKGROUND_TASKS_DISABLED && backgroundTaskId === undefined
    && elapsedSeconds >= BASH_BACKGROUND_TIMEOUT_MS / 1000 && hasUICallback) {
    // Prompt the user to move it to background
    backgroundTaskId = await createBackgroundTask();
    // UI shows: "Command has been running for Xs. Move to background?"
    trackEvent("tengu_bash_command_timeout_backgrounded");
}
```

**Behavior:** The command was started synchronously but is taking too long. After 2 seconds, a background task entry is created and the UI shows a "move to background" prompt. The command continues executing regardless.

### Mode 3: User Interrupt Background (Ctrl+C → background not kill)

```javascript
// READABLE:
// When user presses Ctrl+C while command is running:
if (userInterrupted) {
    if (!BACKGROUND_TASKS_DISABLED) {
        trackEvent("tengu_bash_command_interrupt_backgrounded");
    }
    // Command is backgrounded instead of killed
    return { stdout: captured, stderr: captured, code: 0,
             interrupted: false, backgroundTaskId, backgroundedByUser: true };
}

// Also: if shell reports status="backgrounded":
if (shellResult.status === "backgrounded") {
    return { ..., backgroundTaskId: shellResult.taskId };
}
```

**Key difference from Mode 2:** The `backgroundedByUser: true` flag in the result indicates the user consciously chose to background the command. The UI can show different messaging for this case.

### Output Message for Backgrounded Bash

```javascript
// chunks.170.mjs:727
// READABLE:
let backgroundMsg = backgroundTaskId
    ? `Command ${backgroundedByUser ? "was manually backgrounded by user" : "running in background"} with ID: ${backgroundTaskId}. Output is being written to: ${getOutputFilePath(backgroundTaskId)}`
    : "";
```

---

## Part 6: Progress Tracking System

### trackProgressFromMessage (`Qj1`)

```javascript
// ============================================
// trackProgressFromMessage - Updates running progress state from each agent message
// Location: chunks.89.mjs:1307
// ============================================

// ORIGINAL (for source lookup):
function Qj1(A, q, K, Y) {
    if (q.type !== "assistant") return;
    let z = q.message.usage;
    A.latestInputTokens = z.input_tokens + (z.cache_creation_input_tokens ?? 0) + (z.cache_read_input_tokens ?? 0);
    A.cumulativeOutputTokens += z.output_tokens;
    for (let w of q.message.content)
        if (w.type === "tool_use") {
            if (A.toolUseCount++, w.name !== cD) {
                let H = w.input, $ = Y ? x_6(w.name, H, Y) : void 0;
                A.recentActivities.push({ toolName: w.name, input: H,
                    activityDescription: K?.(w.name, H), isSearch: $?.isSearch, isRead: $?.isRead })
            }
        }
    while (A.recentActivities.length > cv9) A.recentActivities.shift()
}

// READABLE (for understanding):
function trackProgressFromMessage(progressState, normalizedMessage, getActivityDescription, toolRegistry) {
    if (normalizedMessage.type !== "assistant") return;  // only assistant turns have usage data

    let usage = normalizedMessage.message.usage;
    // Update token counts — input includes all cache variants
    progressState.latestInputTokens = usage.input_tokens
        + (usage.cache_creation_input_tokens ?? 0)
        + (usage.cache_read_input_tokens ?? 0);
    progressState.cumulativeOutputTokens += usage.output_tokens;  // cumulative!

    for (let block of normalizedMessage.message.content) {
        if (block.type !== "tool_use") continue;
        progressState.toolUseCount++;
        if (block.name === THINKING_TOOL_NAME) continue;  // cD — skip thinking blocks

        let toolMeta = toolRegistry ? classifyToolActivity(block.name, block.input, toolRegistry) : undefined;
        progressState.recentActivities.push({
            toolName:            block.name,
            input:               block.input,
            activityDescription: getActivityDescription?.(block.name, block.input),
            isSearch:            toolMeta?.isSearch,
            isRead:              toolMeta?.isRead
        });
    }
    // Ring buffer — cap at MAX_RECENT_ACTIVITIES (cv9)
    while (progressState.recentActivities.length > MAX_RECENT_ACTIVITIES)
        progressState.recentActivities.shift();
}

// Mapping: Qj1→trackProgressFromMessage, A→progressState, cD→THINKING_TOOL_NAME,
//   cv9→MAX_RECENT_ACTIVITIES, x_6→classifyToolActivity
```

**Why `latestInputTokens` is not cumulative but `cumulativeOutputTokens` is:**
- Input tokens reset on each turn because the context window includes all prior messages (the full history is re-sent each time)
- `latestInputTokens` therefore always represents the current context size
- Output tokens accumulate because they measure the agent's total generation across the session

**The ring buffer (`cv9` cap) on `recentActivities`:**
- Prevents unbounded memory growth for long-running tasks
- Keeps only the most recent N activities (exact value of `cv9` requires further analysis)
- The UI only needs recent activities for the "currently doing..." display

### getProgressSnapshot (`zB1`)

```javascript
// READABLE:
function getProgressSnapshot(progressState) {
    return {
        toolUseCount:     progressState.toolUseCount,
        tokenCount:       computeTotalTokens(progressState),  // LjA: latestInput + cumulativeOutput
        lastActivity:     progressState.recentActivities.at(-1) ?? undefined,
        recentActivities: [...progressState.recentActivities]  // copy (not reference)
    };
}
// Mapping: zB1→getProgressSnapshot, LjA→computeTotalTokens
```

The snapshot is a point-in-time copy of progress state, used by `updateTaskProgress` (`RjA`) to update `appState.tasks[agentId].progress`.

---

## Part 7: Notification System and Command Queue

### Command Queue Architecture

```javascript
// Global state in chunks.89.mjs:
xj1  = []          // command queue array — items with {value, mode}
W_6  = new Set()   // subscriber callbacks (React state setters / UI watchers)
Cp7  = 0           // monotonic epoch counter — increments on each change
Tv9  = new Set(["task-notification"])  // "broadcast" modes (bypass buffering)
```

### enqueueCommand (`WR`)

```javascript
// ============================================
// enqueueCommand - Pushes item onto command queue and notifies all subscribers
// Location: chunks.89.mjs:~402
// ============================================

// ORIGINAL (for source lookup):
function WR(A) {
    xj1.push(A);
    G_6();  // notifyQueueSubscribers
    AB1("enqueue", typeof A.value === "string" ? A.value : void 0)
}

// READABLE (for understanding):
function enqueueCommand(item) {
    commandQueue.push(item);
    notifyAllSubscribers();   // G_6(): Cp7++ and call every W_6 listener
    trackTelemetry("enqueue", typeof item.value === "string" ? item.value : undefined);
}
// Mapping: WR→enqueueCommand, G_6→notifyAllSubscribers, xj1→commandQueue, W_6→subscribers
```

### Smart Routing: `lB` (enqueueOrBuffer)

```javascript
// ============================================
// enqueueOrBuffer - Routes task-notifications directly; buffers other commands
// Location: chunks.89.mjs:~407
// ============================================

// ORIGINAL (for source lookup):
function lB(A, q) {
    if (A.mode === "task-notification" && W_6.size > 0)
        WR(A);
    else
        q((K) => ({ ...K, queuedCommands: [...K.queuedCommands, A] }))
}

// READABLE (for understanding):
function enqueueOrBuffer(command, setAppState) {
    if (command.mode === "task-notification" && commandSubscribers.size > 0) {
        enqueueCommand(command);    // Direct broadcast — bypass React state buffering
    } else {
        // Buffer in React app state queuedCommands (processed on next render cycle)
        setAppState((state) => ({
            ...state,
            queuedCommands: [...state.queuedCommands, command]
        }));
    }
}
// Mapping: lB→enqueueOrBuffer, W_6→commandSubscribers
```

**Why task-notifications bypass the buffer:**
Regular commands (like user typing) flow through React state to ensure UI consistency. But task-notifications need immediate delivery — if the main loop is idle, a buffered notification might not be processed until the next user interaction. The direct `WR` path ensures the notification pokes all subscribers immediately, which wakes up any waiting `pollUntilDone` call.

### notifyTaskCompletion (`vK1`)

```javascript
// ============================================
// notifyTaskCompletion - Injects structured XML notification into command queue
// Location: chunks.89.mjs:1346
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
        j = `<${NO}>\n<${dP}>${A}</${dP}>\n<${ND}>${K}</${ND}>\n<${TD}>${O}</${TD}>${J}${X}\n</${NO}>${D}`;
    WR({ value: j, mode: "task-notification" })
}

// READABLE (for understanding):
function notifyTaskCompletion(agentId, agentName, status, errorMsg, setAppState, resultText, usage) {
    // --- Atomic notification guard (prevents double-notify) ---
    let wasNotified = false;
    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.notified) return task;          // already notified — return unchanged
        wasNotified = true;
        return { ...task, notified: true };      // mark BEFORE sending to prevent race
    });
    if (!wasNotified) return;                     // idempotent — skip duplicate calls

    // --- Build human-readable status line ---
    let statusLine = status === "completed" ? `Agent "${agentName}" completed`
                   : status === "failed"    ? `Agent "${agentName}" failed: ${errorMsg || "Unknown error"}`
                   :                          `Agent "${agentName}" was stopped`;

    // --- Build optional blocks ---
    let resultBlock   = resultText ? `\n<result>${resultText}</result>` : "";
    let usageBlock    = usage ? `\n<usage>total_tokens: ${usage.totalTokens}\ntool_uses: ${usage.toolUses}\nduration_ms: ${usage.durationMs}</usage>` : "";
    let transcriptRef = isHeadless() ? "" : `\nFull transcript available at: ${getOutputFilePath(agentId)}`;

    // --- Assemble final XML notification ---
    let notification = `<TASK_NOTIFICATION>
<AGENT_ID>${agentId}</AGENT_ID>
<STATUS>${status}</STATUS>
<MESSAGE>${statusLine}</MESSAGE>${resultBlock}${usageBlock}
</TASK_NOTIFICATION>${transcriptRef}`;

    enqueueCommand({ value: notification, mode: "task-notification" });  // WR()
}

// Mapping: vK1→notifyTaskCompletion, A→agentId, q→agentName, K→status, Y→errorMsg,
//   z→setAppState, w→resultText, H→usage, c5→atomicUpdateTask,
//   KY→isHeadless, WR→enqueueCommand,
//   NO→"TASK_NOTIFICATION", dP→"AGENT_ID", ND→"STATUS", TD→"MESSAGE"
```

**Why the `notified` guard exists:**
There are at least three code paths that can call `vK1`:
1. Normal completion (`yjA` → `vK1`)
2. AbortError catch (`na` → `vK1`)
3. The outer `finally` block in the agent tool

All three might fire in close succession if the task is aborted at completion time. The atomic `notified: true` update ensures only the first caller actually sends the notification.

**XML notification format (complete example):**

```xml
<TASK_NOTIFICATION>
<AGENT_ID>a3f9c2</AGENT_ID>
<STATUS>completed</STATUS>
<MESSAGE>Agent "run the test suite" completed</MESSAGE>
<result>
All 142 tests passed.
Coverage: 87%
</result>
<usage>total_tokens: 84231
tool_uses: 47
duration_ms: 183241</usage>
</TASK_NOTIFICATION>
Full transcript available at: /Users/user/.claude/tasks/a3f9c2.output
```

---

## Part 8: TaskOutput and TaskStop Management Tools

### TaskOutput (`kW6`) — Deep Analysis

**What it does:** Retrieves the current state and output of any background task. Supports both blocking (wait until done) and non-blocking modes.

**Input schema:**
```
task_id:  string    — The task ID from run_in_background result
block:    boolean   — Default: true. If true, waits for task completion (up to timeout)
timeout:  number    — Max wait in ms (default: 30000, max: 600000)
```

**Algorithm:**

```javascript
// ============================================
// TaskOutput.call() — polling and retrieval logic
// Location: chunks.139.mjs:~1922
// ============================================

// READABLE:
async function taskOutputCall({ task_id, block = true, timeout = 30000 }, { getAppState, setAppState, abortController }, _meta, _extra, onProgress) {

    // 1. Validate task exists
    let task = (await getAppState()).tasks?.[task_id];
    if (!task) throw Error(`No task found with ID: ${task_id}`);

    // 2. NON-BLOCKING PATH: return current state immediately
    if (!block) {
        if (task.status !== "running" && task.status !== "pending") {
            markTaskRetrieved(task_id, setAppState);  // set notified=true
            return { data: { retrieval_status: "success", task: buildTaskSnapshot(task) } };
        }
        return { data: { retrieval_status: "not_ready", task: buildTaskSnapshot(task) } };
    }

    // 3. BLOCKING PATH: emit "waiting" progress event, then poll
    onProgress?.({ data: {
        type: "waiting_for_task",
        taskDescription: task.description,
        taskType: task.type
    }});

    // nyY() — polls getAppState().tasks[taskId] every 100ms
    let finalTask = await pollUntilDone(task_id, getAppState, timeout, abortController);
    if (!finalTask) return { data: { retrieval_status: "timeout", task: null } };
    if (finalTask.status === "running" || finalTask.status === "pending")
        return { data: { retrieval_status: "timeout", task: buildTaskSnapshot(finalTask) } };

    // 4. Task is done — mark retrieved and return full snapshot
    markTaskRetrieved(task_id, setAppState);
    return { data: { retrieval_status: "success", task: buildTaskSnapshot(finalTask) } };
}
```

**pollUntilDone (`nyY`) — 100ms polling loop:**

```javascript
// READABLE:
async function pollUntilDone(taskId, getAppState, timeoutMs, abortController) {
    let startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
        if (abortController?.signal.aborted) throw new AbortError();
        let task = (await getAppState()).tasks?.[taskId];
        if (!task) return null;
        if (task.status !== "running" && task.status !== "pending") return task;
        await sleep(100);  // 100ms polling interval
    }
    return (await getAppState()).tasks?.[taskId] ?? null;
}
// Mapping: nyY→pollUntilDone
```

**buildTaskSnapshot (`EW6`) — output reading:**

```javascript
// READABLE:
function buildTaskSnapshot(task) {
    let base = {
        task_id:     task.id,
        task_type:   task.type,
        status:      task.status,
        description: task.description,
        output:      readFullOutput(task.id)   // M_6() — reads entire .output file
    };
    if (task.type === "local_bash")   return { ...base, exitCode: task.result?.code ?? null };
    if (task.type === "local_agent")  return { ...base, prompt: task.prompt, result: base.output, error: task.error };
    if (task.type === "remote_agent") return { ...base, prompt: task.command };
    return base;
}
// Mapping: EW6→buildTaskSnapshot, M_6→readFullOutput
```

**Output truncation (`Ng1`):** If total output exceeds `TASK_MAX_OUTPUT_LENGTH`, the output is truncated to the last N characters with a header: `[Truncated. Full output: {outputFilePath}]`. This prevents overwhelming the LLM's context with gigabytes of build logs.

### TaskStop (`vW6`) — Deep Analysis

**What it does:** Kills a running background task (agent or shell command). Returns confirmation with task metadata.

**Algorithm:**

```javascript
// ============================================
// TaskStop.call() — find and kill a running task
// Location: chunks.139.mjs:~1537
// ============================================

// READABLE:
async function taskStopCall({ task_id, shell_id }, { getAppState, setAppState, abortController }) {
    let resolvedId = task_id ?? shell_id;  // shell_id is deprecated alias
    if (!resolvedId) throw Error("Missing required parameter: task_id");

    let task = (await getAppState()).tasks?.[resolvedId];
    if (!task) throw Error(`No task found with ID: ${resolvedId}`);
    if (task.status !== "running") throw Error(`Task ${resolvedId} is not running (status: ${task.status})`);

    // Dispatch to type-specific kill handler
    let killHandler = getKillHandlerForType(task.type);  // Vg1()
    await killHandler.kill(resolvedId, { abortController, getAppState, setAppState });

    // Mark notified to prevent duplicate notifications from vK1
    atomicUpdateTask(resolvedId, setAppState, (t) => t.notified ? t : { ...t, notified: true });

    let commandDesc = isLocalBashTask(task) ? task.command : task.description;
    return { data: {
        message:   `Successfully stopped task: ${resolvedId} (${commandDesc})`,
        task_id:   resolvedId,
        task_type: task.type,
        command:   commandDesc
    }};
}
// Mapping: vW6→TaskStopToolDef, Vg1→getKillHandlerForType
```

**Why `getKillHandlerForType` exists:**
Different task types need different kill mechanisms:
- `local_agent` → call `killTask(na)` → triggers `AbortController.abort()` which surfaces as `AbortError` inside the agent loop
- `local_bash` → must send SIGTERM/SIGKILL to the shell subprocess
- `remote_agent` → must call the remote session cancellation API

---

## Part 9: Environment Variables and Feature Flags

| Variable | Constant | Chunk | Effect |
|----------|----------|-------|--------|
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | `KP6` (AgentTool) | chunks.132.mjs | Disables `run_in_background` for AgentTool |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | `Id1` (BashTool) | chunks.170.mjs | Disables all three bash backgrounding modes |

Both are parsed via `J6(process.env....)` — the same `parseBoolean` helper. When set to any truthy value, the `run_in_background` parameter is omitted from tool schemas entirely (via `z7(() => Id1 ? K_q.omit({run_in_background: true}) : K_q)`). This means the LLM never sees the option and cannot use it.

**Additionally, in-process teammates cannot spawn background agents:**
```javascript
// chunks.132.mjs:134
if (run_in_background === true && context.backendType === "in-process")
    throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
```
This constraint exists because in-process teammates share the same Node.js process and event loop — they cannot independently manage background task state.

---

## Part 10: Tool-Level Block Set

```javascript
// chunks.89.mjs
Bj1 = new Set([
    "TaskOutput",   // uj1
    "BashOutput",   // bW (alias for TaskOutput in bash context)
    "EnterPlanMode",// N_6
    fK,             // AgentTool name
    "AskUserQuestion", // TH
    "TaskStop"      // bj1
])
```

This set (`Bj1`) is the **allowed tool set for background agents** — background agents are restricted to these tools. They cannot call arbitrary tools that might interact with the UI or require synchronous user confirmation. This is a security/correctness boundary.

---

## Part 11: UI Components

### BackgroundTaskInputView (`K51`)

Renders the launch indicator in the chat:
```
& Running tests in background
```
Parses `<background-task-input>` XML tags from message text.

### BackgroundTaskOutputView (`Xx4`)

Renders the dimmed output for `<background-task-output>` blocks:
```
This task is now running in the background.
Monitor it with /tasks or at https://app.claude.ai/sessions/{sessionId}
Or, resume it later with: claude --resume {sessionId}
```

### BashOutputView (`q51`)

When a bash result has `backgroundTaskId`, shows:
```
Running in the background (↓ manage)
```
The `↓` shortcut opens the task management UI.

---

## Summary: Design Decisions and Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **File-based output** | LLM can read via existing Read/Bash tools; no new API | O(n) read per poll; not suitable for multi-GB output |
| **Promise-chain write serialization** | Lightweight FIFO per-task without global mutex | Memory: chain persists until all writes complete |
| **Atomic `notified` guard** | Prevents duplicate completion notifications | State mutation must go through `atomicUpdateTask` |
| **Direct queue injection for task-notifications** | Bypasses React state cycle for immediate delivery | Different path than regular user commands |
| **XML-structured notifications** | Machine-parseable by LLM for programmatic handling | Verbose; adds XML overhead |
| **Type-prefixed IDs** | Visual identification without parsing (`a`=agent, `b`=bash) | Only works well with ≤26 task types |
| **2-second bash auto-background threshold** | Balances responsiveness vs. unnecessary task creation | May create unwanted tasks for commands that take 2.1s |
| **Child AbortController linkage** | Cascading kill: parent abort kills all background children | Requires explicit handling in each child |
| **100ms TaskOutput polling interval** | Simple, no WebSocket; works across process boundaries | CPU overhead for long waits; not truly event-driven |
| **Restricted tool set for background agents** | Security boundary; prevents UI/permission conflicts | Background agents have limited capability |
| **Sync-to-async conversion via Promise.race** | Seamless mid-run backgrounding with code reuse | Race condition window (small) during transition |
