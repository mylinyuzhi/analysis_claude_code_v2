# Background Agent Output Capture (Claude Code 2.1.38)

> Analysis of background agent output capture mechanism, output file creation and management,
> how results inject back into the main conversation, UI progress display, and the full
> launch-to-retrieval lifecycle.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getOutputFilePath` (ww) - Constructs the `.output` file path for a given task ID — `chunks.89.mjs:249`
- `writeOutputChunk` (ZK1) - Appends text to a task's output file (async, serialized) — `chunks.89.mjs:253`
- `readFullOutput` (M_6) - Reads full content of a task's output file — `chunks.89.mjs:300`
- `readOutputFileDelta` (WjA) - Reads only new content since a given byte offset — `chunks.89.mjs:276`
- `initOutputFile` (hj1) - Creates an empty output file and returns its path — `chunks.89.mjs:310`
- `symlinkOutputFile` (Ij1) - Creates a symlink from an existing file to the task output path — `chunks.89.mjs:317`
- `cleanupOutputFiles` (Rp7) - Removes all `.output` files from the tasks directory — `chunks.89.mjs:328`
- `notifyTaskCompletion` (vK1) - Sends a task-notification message to the main conversation queue — `chunks.89.mjs:1346`
- `updateTaskProgress` (RjA) - Updates a running task's progress in app state — `chunks.89.mjs:~1453`
- `markTaskFailed` (CjA) - Records an error on a task in app state — `chunks.89.mjs:~1495`
- `markTaskCompleted` (yjA) - Records final result data on a task — `chunks.89.mjs:~1482`
- `createAsyncTask` (zd7) - Creates a background agent task entry with abort controller — `chunks.89.mjs:~1447`
- `createForegroundTask` (wd7) - Creates a task entry for a sync agent (may be backgrounded later) — `chunks.89.mjs:~1477`
- `killTask` (na) - Aborts a running task's controller and marks it "killed" — `chunks.89.mjs:~1375`
- `killAllRunningAgents` (Kd7) - Kills all local_agent tasks with "running" status — `chunks.89.mjs:~1448`
- `createTaskId` (hp) - Generates a unique task ID from a type prefix and random hex — `chunks.89.mjs:522`
- `createTaskRecord` (IZ) - Builds the initial task state object — `chunks.89.mjs:528`
- `BackgroundTaskInputView` (K51) - React component for rendering the `&` background task input UI
- `BackgroundTaskOutputView` (Xx4) - React component for rendering `<background-task-output>` blocks
- `BashOutputView` (q51) - React component for rendering bash tool output including background indicators
- `AgentTool` (rj1) - The Agent/Task tool definition with run_in_background support — `chunks.132.mjs:85`
- `TaskOutputTool` (kW6) - Polls/retrieves background task output — `chunks.139.mjs:~1922`
- `TaskStopTool` (vW6) - Kills a running background task — `chunks.139.mjs:~1537`
- `trackProgressFromMessage` (Qj1) - Accumulates progress metrics from agent messages — `chunks.89.mjs:1307`
- `getProgressSnapshot` (zB1) - Serializes progress state to a snapshot object — `chunks.89.mjs:1327`

---

## Overview

Background agents in Claude Code allow long-running subagent tasks and shell commands to execute
without blocking the main conversation loop. The system provides:

1. **Output file persistence** - Every background task writes incremental output to a file on disk
2. **Progress tracking** - UI components show real-time progress via periodic state updates
3. **Completion notification** - When a task finishes, a `task-notification` message is injected into the conversation queue
4. **Resume capability** - Background agents can be resumed from their transcript via `agentId`

---

## Architecture: Launch to Retrieval Lifecycle

```
User/LLM requests background task
        │
        ▼
┌─────────────────────┐
│ AgentTool.call()     │  run_in_background=true
│ or BashTool.call()   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ createAsyncAgent()   │  Creates task entry + abort controller
│ (zd7)                │  Registers in appState.tasks
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Returns IMMEDIATELY:         │
│  { status: "async_launched", │
│    agentId, outputFile }     │
└────────┬────────────────────┘
         │  (continues in background)
         ▼
┌─────────────────────┐          ┌────────────────────┐
│ p01() wrapper        │────────▶│ dR() agent loop     │
│ (session context)    │          │ (iterates messages) │
└──────────────────────┘          └────────┬───────────┘
                                           │ each message
                                           ▼
                                  ┌────────────────────┐
                                  │ updateTaskProgress()│
                                  │ appendToOutputFile()│
                                  └────────┬───────────┘
                                           │ on completion
                                           ▼
                                  ┌────────────────────┐
                                  │ notifyTaskCompletion│
                                  │ (vK1)              │
                                  └────────┬───────────┘
                                           │
                                           ▼
                                  ┌────────────────────┐
                                  │ Main loop receives  │
                                  │ task-notification    │
                                  │ message from queue   │
                                  └────────────────────┘
```

---

## Deep Analysis: Output File System

### getOutputFilePath (ww)

**What it does:** Constructs a deterministic file path for a task's output file.

**How it works:**
1. Gets the base tasks directory via `eu1()` (resolves to `~/.claude/tasks/` or similar)
2. Appends `{taskId}.output` as the filename
3. Returns the path as `{tasksDir}/{taskId}.output`

```javascript
// ============================================
// getOutputFilePath - Constructs output file path for task
// Location: chunks.89.mjs:249-251
// ============================================

// ORIGINAL (for source lookup):
function ww(A) {
    return MjA(eu1(), `${A}.output`)
}

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return joinPath(getTasksDirectory(), `${taskId}.output`)
}

// Mapping: ww→getOutputFilePath, A→taskId, MjA→joinPath, eu1→getTasksDirectory
```

**Why this approach:**
- File-based output allows the main process and the LLM to read task progress using standard file tools (Read, Bash `tail`)
- The deterministic path from taskId means no lookup table is needed -- the agentId IS the key
- `.output` extension distinguishes these from other files in the tasks directory

**Key insight:** By exposing the output file path directly in the tool result, the LLM can independently check on background tasks using its existing Read/Bash tools, without needing a specialized API. This is an elegant reuse of the filesystem as a communication channel.

### appendToOutputFile (ZK1)

**What it does:** Appends a text chunk to a task's output file in a serialized (non-concurrent) manner.

**How it works:**
1. Ensures the tasks directory exists (`PjA()`)
2. Computes the output file path via `ww(taskId)`
3. Ensures the parent directory of the output file exists
4. Chains the write operation onto a per-task promise stored in `vp7` (a Map)
5. Each write appends via `appendFileAsync` (Vv9)

```javascript
// ============================================
// appendToOutputFile - Serialized append to task output file
// Location: chunks.89.mjs:253-274
// ============================================

// ORIGINAL (for source lookup):
function ZK1(A, q) {
    try {
        PjA();
        let w = ww(A),
            H = Nv9(w);
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
function appendToOutputFile(taskId, content) {
    try {
        ensureTasksDir();
        let outputPath = getOutputFilePath(taskId),
            parentDir = dirname(outputPath);
        if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true });
    } catch (err) { logError(err); return; }
    let filePath = getOutputFilePath(taskId),
        chainedWrite = (pendingWrites.get(taskId) ?? Promise.resolve()).then(async () => {
            try { await appendFileAsync(filePath, content, "utf8") }
            catch (err) { logError(err) }
        });
    pendingWrites.set(taskId, chainedWrite)
}

// Mapping: ZK1→appendToOutputFile, A→taskId, q→content, PjA→ensureTasksDir,
//   ww→getOutputFilePath, Nv9→dirname, GK1→existsSync, Lp7→mkdirSync,
//   Vv9→appendFileAsync, vp7→pendingWrites
```

**Why this approach:**
- **Serialization via promise chaining** prevents concurrent writes from interleaving output
- The `pendingWrites` Map stores a per-task promise chain so multiple tasks do not block each other, only writes to the SAME task are serialized
- Error handling is lenient (logs and continues) so a single failed write does not break the background task

**Key insight:** The promise-chaining pattern `(map.get(key) ?? Promise.resolve()).then(newWrite)` is a lightweight alternative to a write queue or mutex. It guarantees FIFO ordering per task while allowing different tasks to write concurrently.

### readOutputFileDelta (WjA)

**What it does:** Reads only the new content since a given byte offset, enabling incremental progress reading.

**How it works:**
1. Gets the file path from `ww(taskId)`
2. Checks if the file exists and its current size
3. If size has not grown beyond `offset`, returns empty string
4. Otherwise reads the full file and slices from `offset` to end
5. Returns the new content and the new offset (= current file size)

```javascript
// ============================================
// readOutputFileDelta - Read incremental output from task file
// Location: chunks.89.mjs:276-298
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
function readOutputFileDelta(taskId, offset) {
    try {
        let filePath = getOutputFilePath(taskId);
        if (!existsSync(filePath)) return { content: "", newOffset: offset };
        let fileSize = statSync(filePath).size;
        if (fileSize <= offset) return { content: "", newOffset: offset };
        return { content: readFileSync(filePath, "utf8").slice(offset), newOffset: fileSize }
    } catch (err) {
        return logError(err), { content: "", newOffset: offset }
    }
}

// Mapping: WjA→readOutputFileDelta, A→taskId, q→offset, ww→getOutputFilePath,
//   GK1→existsSync, Gv9→statSync, Ep7→readFileSync
```

**Why this approach:**
- Uses byte offset for lightweight incremental reads without maintaining line counters
- The pattern allows the UI to poll for changes at intervals, only receiving new data

**Trade-off:** Reading the full file and slicing is O(n) in file size. For very long-running tasks with large output, a more efficient approach would use `fs.read()` with a file descriptor and position. However, most background tasks produce bounded output, making the simpler approach acceptable.

---

## Deep Analysis: Task Completion Notification

### notifyTaskCompletion (vK1)

**What it does:** When a background agent finishes (completes, fails, or is killed), this function injects a structured notification message into the main conversation's command queue.

**How it works:**
1. Atomically sets `notified: true` on the task entry (prevents duplicate notifications)
2. If the task was already notified, returns immediately (no-op)
3. Constructs a human-readable summary like `Agent "description" completed`
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
        j = `<${NO}>\n<${dP}>${A}</${dP}>\n<${ND}>${K}</${ND}>\n<${TD}>${O}</${TD}>${J}${X}\n</${NO}>${D}`;
    WR({ value: j, mode: "task-notification" })
}

// READABLE (for understanding):
function notifyTaskCompletion(taskId, description, status, errorMsg, setAppState, resultText, usage) {
    let wasNotified = false;
    if (updateTaskState(taskId, setAppState, (task) => {
        if (task.notified) return task;  // Already notified
        return wasNotified = true, { ...task, notified: true };
    }), !wasNotified) return;  // Skip duplicate

    let summary = status === "completed" ? `Agent "${description}" completed`
                : status === "failed" ? `Agent "${description}" failed: ${errorMsg||"Unknown error"}`
                : `Agent "${description}" was stopped`;
    let outputFile = getOutputFilePath(taskId);
    let resultBlock = resultText ? `\n<result>${resultText}</result>` : "";
    let usageBlock = usage ? `\n<usage>...</usage>` : "";
    let transcriptRef = isRemoteSession() ? "" : `\nFull transcript available at: ${outputFile}`;

    let notification = `<task_notification>
<task_id>${taskId}</task_id>
<status>${status}</status>
<summary>${summary}</summary>${resultBlock}${usageBlock}
</task_notification>${transcriptRef}`;

    enqueueCommand({ value: notification, mode: "task-notification" });
}

// Mapping: vK1→notifyTaskCompletion, A→taskId, q→description, K→status, Y→errorMsg,
//   z→setAppState, w→resultText, H→usage, c5→updateTaskState, ww→getOutputFilePath,
//   WR→enqueueCommand, NO→TASK_NOTIFICATION_TAG, dP→TASK_ID_TAG, ND→STATUS_TAG, TD→SUMMARY_TAG
```

**Why this approach:**
- **Atomic notification guard** (`notified: true`) prevents duplicate notifications when both completion and cleanup paths try to notify
- **XML-structured output** allows the LLM to parse task results programmatically
- **Queue injection** (`mode: "task-notification"`) ensures the notification reaches the main conversation even if the user is mid-input; the queue system will deliver it at the next processing opportunity
- **Result text inclusion** means the LLM gets the agent's final output inline, without needing to read the output file for simple results

**Key insight:** The `mode: "task-notification"` on the queue entry causes special handling -- if there are active listeners (via `W_6`), the notification is pushed directly to the command queue and the listeners are poked. This ensures timely delivery even when the main loop is idle waiting for user input.

---

## Deep Analysis: AgentTool Background Mode

### Async Launch Flow (AgentTool)

**What it does:** When `run_in_background=true`, the AgentTool creates a detached execution context and returns immediately with the task metadata.

**How it works (step by step):**

1. **Validation**: Checks if background tasks are disabled via `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` env var
2. **Agent resolution**: Finds the matching agent definition from available agents
3. **Task creation**: Calls `createAsyncAgent` (zd7) which:
   - Generates a unique agent ID (or uses the provided `resume` ID)
   - Creates a new AbortController for the task
   - Registers the task in `appState.tasks` with status "running"
   - Returns `{ agentId, abortController }`
4. **Detached execution**: Wraps the agent loop (`dR()`) in `p01()` (session context wrapper) and starts it WITHOUT awaiting
5. **Immediate return**: Returns `{ status: "async_launched", agentId, outputFile }` to the caller

**During background execution:**
- Each message from the agent loop is pushed to `O1` (messages array)
- Progress is tracked via `Qj1()` (progress tracker) and `RjA()` (updateTaskProgress)
- Output is written to the output file via the progress tracker

**On completion:**
- Success: `vK1(agentId, description, "completed", ...)` with result text and usage stats
- Failure: `CjA(agentId, errorMsg, ...)` records the error, then `vK1(..., "failed", errorMsg, ...)`
- Abort: If the task was killed, `na()` returns true and `vK1(..., "killed", ...)` fires
- The `yjA()` function records the final result data on the task entry

### Sync-to-Background Conversion

**What it does:** Even synchronous agents can be "backgrounded" mid-execution if the user requests it.

**How it works:**
1. A sync agent starts with `wd7()` which creates a task entry with a `backgroundSignal` promise
2. During execution, the code races each agent message against the `backgroundSignal`
3. If the signal fires (user pressed background hotkey), the current agent state is checked:
   - If `isBackgrounded` is true on the task, execution transitions to async mode
   - A new `p01()` wrapper is started with `isAsync: true`
   - The function returns `{ status: "async_launched", ... }` just like the explicit background case
4. The previously accumulated messages (`O1`) are replayed into the new async context

**Key insight:** This dual-mode design (explicit background vs. user-initiated background) shares the same completion/notification infrastructure. The transition point is seamless because the agent loop (`dR()`) is an async iterator -- it can be consumed by either the sync or async handler.

---

## Deep Analysis: Bash Tool Background Mode

### Shell Command Backgrounding

The Bash tool (`qq` / `h4`) also supports `run_in_background`:

```javascript
// ============================================
// runShellCommand - Bash tool execution with background support
// Location: chunks.170.mjs:362-470
// ============================================

// ORIGINAL (for source lookup):
async function* yYz({ input: A, abortController: q, setAppState: K, ... }) {
    let { command: w, run_in_background: _ } = A;
    // ...
    if (_ === !0 && !Id1) {
        let B = await Z();
        return c("tengu_bash_command_explicitly_backgrounded", { command_type: z_q(w) }),
            { stdout: "", stderr: "", code: 0, interrupted: !1, backgroundTaskId: B }
    }
    // ... polling loop with yield for progress ...
}

// READABLE (for understanding):
async function* runShellCommand({ input, abortController, setAppState, ... }) {
    let { command, run_in_background } = input;
    if (run_in_background === true && !BACKGROUND_TASKS_DISABLED) {
        let taskId = await spawnBackgroundShellTask();
        trackEvent("bash_command_explicitly_backgrounded");
        return { stdout: "", stderr: "", code: 0, interrupted: false, backgroundTaskId: taskId };
    }
    // Normal execution with periodic progress yields...
}

// Mapping: yYz→runShellCommand, Id1→BACKGROUND_TASKS_DISABLED, Z→spawnBackgroundShellTask
```

**Three ways a bash command becomes backgrounded:**
1. **Explicit**: `run_in_background=true` -- immediate background, no output captured
2. **Timeout**: After `q_q` ms (2000ms) of no completion, a task entry is created and a UI prompt appears
3. **User interrupt**: User sends Ctrl+C while a command runs; the command is backgrounded rather than killed

---

## UI Progress Display

### Background Task Input View (K51)

Renders the `&` symbol followed by the task description when a background task is launched:

```
& Running tests in background
```

Looks for `<background-task-input>` tags in message text.

### Background Task Output View (Xx4)

Renders the dimmed output from `<background-task-output>` tags -- typically the task completion message:

```
This task is now running in the background.
Monitor it with /tasks or at https://...
```

### Bash Output Background Indicator (q51)

When a bash command has a `backgroundTaskId`, the output view shows:

```
Running in the background (↓ manage)
```

Instead of the normal stdout/stderr display. The `↓` shortcut lets the user access the task management UI.

---

## Task ID Format

```javascript
// ============================================
// createTaskId - Generates unique task identifiers
// Location: chunks.89.mjs:522-526
// ============================================

// ORIGINAL (for source lookup):
function hp(A) {
    let q = Rv9(A),
        K = kv9().replace(/-/g, "").substring(0, 6);
    return `${q}${K}`
}

// READABLE (for understanding):
function createTaskId(typePrefix) {
    let prefix = TYPE_PREFIXES[typePrefix];  // e.g. "b", "a", "r", "t"
    let randomHex = uuid().replace(/-/g, "").substring(0, 6);
    return `${prefix}${randomHex}`;
}

// Mapping: hp→createTaskId, A→typePrefix, Rv9→TYPE_PREFIXES lookup, kv9→uuid
```

Type prefixes (from `Lv9`):
- `b` = `local_bash` (shell commands)
- `a` = `local_agent` (subagent tasks)
- `r` = `remote_agent` (remote session agents)
- `t` = `in_process_teammate` (team member agents)

Example: `a3f4b2` = a local agent task with random suffix `3f4b2`.

---

## Task State Machine

```
    ┌──────────┐
    │ pending   │ ─── createTaskRecord()
    └────┬─────┘
         │ start execution
         ▼
    ┌──────────┐
    │ running   │ ─── updateTaskProgress() / appendToOutputFile()
    └────┬─────┘
         │
    ┌────┴────────────┬──────────────┐
    ▼                 ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ completed │  │ failed   │  │ killed   │
└──────────┘  └──────────┘  └──────────┘
     │              │              │
     └──────────────┴──────────────┘
                    │
              notifyTaskCompletion()
              (injects into queue)
```

Each task record contains:
- `id` - Unique task identifier
- `type` - One of `local_bash`, `local_agent`, `remote_agent`, `in_process_teammate`
- `status` - Current state in the machine above
- `description` - Human-readable description
- `startTime` / `endTime` - Timestamps
- `outputFile` - Path to the `.output` file
- `outputOffset` - Current read position for delta reads
- `notified` - Boolean guard against duplicate notifications
- `abortController` - For killing the task
- `progress` - Optional progress summary object

---

## Remote Session Background Tasks

For remote/cloud sessions, the background task message format uses `<background-task-output>` XML:

```xml
<background-task-output>
This task is now running in the background.
Monitor it with /tasks or at https://app.claude.ai/sessions/{sessionId}

Or, resume it later with: claude --resume {sessionId}
</background-task-output>
```

This is rendered by `Xx4` (BackgroundTaskOutputView) as dimmed text in the UI.

---

## Summary of Design Decisions

| Decision | Rationale |
|----------|-----------|
| File-based output | LLM can read via existing tools; no special API needed |
| Promise-chain serialization | Lightweight, per-task write ordering without global locks |
| Atomic notification guard | Prevents duplicate completion messages |
| Queue injection (not direct insert) | Respects the main loop's message ordering |
| XML-structured notifications | Machine-parseable by the LLM for programmatic handling |
| Type-prefixed IDs | Quick visual identification of task type in logs/UI |
| 2-second background threshold | Balances responsiveness with avoiding unnecessary task creation |
