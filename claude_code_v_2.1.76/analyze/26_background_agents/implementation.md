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
- `createBackgroundAgentTask` (Qn4) — `chunks.146.mjs:2133` ✓
- `createForegroundAgentTask` (Un4) — `chunks.146.mjs:2165` ✓
- `triggerAbortSignal` (x66) — `chunks.146.mjs:2012` ✓
- `killAllLocalAgents` (U4q) — `chunks.146.mjs:2029` ✓
- `notifyTaskCompletion` (vK1) — `chunks.89.mjs:1346`
- `createTaskRecord` (RG) — `chunks.41.mjs:2418` ✓
- `createTaskId` (oV) — `chunks.41.mjs:2410` ✓
- `registerTask` (Zf) — `chunks.90.mjs:3019` ✓
- `atomicUpdateTask` (i9) — `chunks.90.mjs:3003` ✓
- `markTaskCompleted` ($m8) — `chunks.146.mjs:2100` ✓
- `markTaskFailed` (Hm8) — `chunks.146.mjs:2117` ✓
- `markTaskKilled` (d4q) — `chunks.146.mjs:2034` ✓
- `getOutputFilePath` (g2) — `chunks.41.mjs:2248`
- `appendToOutputFile` (ZK1) — `chunks.89.mjs:253`
- `readOutputFileDelta` (WjA) — `chunks.89.mjs:276`
- `readFullOutput` (M_6) — `chunks.89.mjs:300`
- `enqueueCommand` (WR) — `chunks.89.mjs:~402`
- `TaskOutputTool` (kW6) — `chunks.139.mjs:~1922`
- `TaskStopTool` (vW6) — `chunks.139.mjs:~1537`

> **CORRECTIONS:**
> - `zd7` and `wd7` were incorrectly documented as `createAsyncTask` and `createForegroundTask`.
>   They are actually crypto module exports (chunks.72.mjs).
>   The correct symbols are `Qn4` (background) and `Un4` (foreground) at chunks.146.mjs.
> - `Hd7` was incorrectly documented as `backgroundForegroundTask`. It is a JWT parsing function (chunks.72.mjs:2775).
> - `na` was incorrectly documented as `killTask`. It is actually a diff function (`wf7.diff`) at chunks.56.mjs:2072.
>   Correct kill functions are `x66` (triggerAbortSignal) and `U4q` (killAllLocalAgents).
> - `Kd7` was incorrectly documented as `killAllRunningAgents`. It is a crypto module export (chunks.72.mjs:2707).
>   Correct symbol is `U4q` at chunks.146.mjs:2029.
> - `IZ` was incorrectly documented as `createTaskRecord`. Correct symbol is `RG` at chunks.41.mjs:2418.
> - `hp` was incorrectly documented as `createTaskId`. Correct symbol is `oV` at chunks.41.mjs:2410.
> - `ww` was incorrectly documented as `getOutputFilePath`. Correct symbol is `g2` at chunks.41.mjs:2248.
> - `bZ` was incorrectly documented as `registerTask`. Correct symbol is `Zf` at chunks.90.mjs:3019.

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
│  Qn4()                  │   │  vK1()                    │
│  createBackgroundAgent  │   │  notifyTaskCompletion     │
│  Task                   │   │  chunks.89.mjs:1346       │
│  chunks.146.mjs:2133    │   │  ─────────────────────    │
│  ─────────────────────  │   │  • atomic notified guard  │
│  • RG() → task record   │   │  • XML notification block │
│  • Co() → init output   │   │  • WR() → enqueue         │
│  • Zf() → register task │   └────────────┬─────────────┘
│  • E4() → cleanup reg   │                │ WR({mode:"task-notification"})
└────────┬────────────────┘                │
         │ returns taskRecord              │
         │                                 ▼
         ▼                      ┌──────────────────────┐
┌─────────────────────────┐     │  Command Queue       │
│  fire-and-forget        │     │  xj1 (array)         │
│  (withTelemetrySpan)    │     │  W_6 (subscribers)   │
│  ─────────────────────  │     │  G_6() notifies all  │
│  for await qh() loop    │     └──────────────────────┘
│  (agent loop generator) │
│  ─────────────────────  │
│  per message:           │
│   nl4() progress track  │
│   ZK1() write to file   │
│   i9() update state     │
└────────────────────────┘

File System:
  ~/.claude/tasks/{taskId}.output    ← output file
  ~/.claude/sessions/{prefixed-id}/  ← symlink target (human-readable path)
```

---

## Part 1: Task Identity System

### Task ID Generation Algorithm

**What it does:** Creates unique, type-prefixed identifiers for all background tasks.

**How it works:**
1. `getTypePrefix(taskType)` looks up the prefix from `TASK_TYPE_PREFIXES` map (`V$3`)
2. `generateRandomBytes(8)` creates 8 cryptographically random bytes (`N$3`)
3. For each byte, select a character from the charset `G97` ("0123456789abcdefghijklmnopqrstuvwxyz")
4. Combine: `{prefix}{8-random-chars}` (e.g., "a3f4b2x9")

```javascript
// ============================================
// createTaskId - Generates prefixed task identifier
// Location: chunks.41.mjs:2410-2415
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = q;
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// READABLE (for understanding):
function createTaskId(taskType) {
    let prefix = getTypePrefix(taskType);  // "a", "b", "r", "t", "w"
    let randomBytes = generateRandomBytes(8);
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }
    return taskId;  // e.g. "a3f9c2x7" for a local_agent
}

// Mapping: oV→createTaskId, k$3→getTypePrefix, N$3→generateRandomBytes, G97→CHARSET
```

**Type prefix map (`V$3` / `TASK_TYPE_PREFIXES`):**

| taskType | prefix | Example ID |
|----------|--------|-----------|
| `local_agent` | `a` | `a3f9c2x7` |
| `local_bash` | `b` | `b7c4e1m2` |
| `remote_agent` | `r` | `r2a8f0k5` |
| `in_process_teammate` | `t` | `t5d3b9n4` |
| `local_workflow` | `w` | `w1x2y3z4` |

**Why this approach:**
- **Visual identification:** Single-character prefix enables quick identification in logs and UI without parsing
- **Collision resistance:** 36^8 = ~2.8 trillion combinations per prefix (36-char alphabet × 8 positions)
- **File-friendly:** Alphanumeric IDs work as filename components: `a3f9c2x7.output`
- **Cryptographic randomness:** Uses crypto-secure random bytes, not Math.random()

### Task Record Structure (`RG` / `createTaskRecord`)

**What it does:** Constructs the initial task state object with all required fields.

```javascript
// ============================================
// createTaskRecord - Constructs the initial task state object
// Location: chunks.41.mjs:2418-2429
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A, type: q, status: "pending", description: K,
        toolUseId: Y, startTime: Date.now(),
        outputFile: g2(A), outputOffset: 0, notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id:           taskId,
        type:         taskType,
        status:       "pending",          // initial state
        description:  description,
        toolUseId:    toolUseId,          // links to tool use that spawned this
        startTime:    Date.now(),
        outputFile:   getOutputFilePath(taskId),  // g2(taskId) → {tasksDir}/{taskId}.output
        outputOffset: 0,                  // byte cursor for incremental reads (TaskOutput)
        notified:     false               // guard: ensures notification fires only once
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId, g2→getOutputFilePath
```

**Additional fields added by spawn handlers:**
- `agentId` — Unique agent identifier for local agents
- `prompt` — The task prompt for agents
- `selectedAgent` — Agent type name (e.g., "Explore", "general-purpose")
- `model` — Model selection override
- `abortController` — AbortController for kill/abort
- `unregisterCleanup` — Removes the process-exit handler when done
- `isBackgrounded` — `true` if running as background task
- `background` — `true` if explicitly started with `run_in_background=true` (new in v2.1.76)
- `retrieved` — Whether TaskOutput has retrieved this task
- `lastReportedToolCount`, `lastReportedTokenCount` — Progress tracking
- `progress` — `{ toolUseCount, tokenCount, lastActivity, recentActivities }`
- `result`, `error`, `endTime` — Set on completion/failure
- `pendingMessages` — Messages queued for background agents

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

### getOutputFilePath (`g2`)

```javascript
// ============================================
// getOutputFilePath - Deterministic output file path from task ID
// Location: chunks.41.mjs:2248-2250
// ============================================

// ORIGINAL (for source lookup):
function g2(A) {
    return D97(yJ6(), `${A}.output`)
}

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return joinPath(getTasksDir(), `${taskId}.output`);
}

// Mapping: g2→getOutputFilePath, A→taskId, D97→joinPath, yJ6→getTasksDir
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

## Part 6: Agent Teams Integration

### In-Process Teammate Tasks

**What they are:** Teammate agents spawned within the same process (not separate terminal windows). They use the `in_process_teammate` task type with prefix `t`.

### spawnTeammate Integration

When a teammate is spawned via `spawnTeammateDispatcher` (`iVY`):

1. **Task Creation:** Creates a task record with type `in_process_teammate`
2. **Mailbox Setup:** Initializes inbox directory for inter-agent messaging
3. **Agent Execution:** Spawns a subagent loop with team context
4. **Background Mode:** Teammates run in background by default

```javascript
// Teammate task uses same infrastructure as local_agent
let taskId = createTaskId("in_process_teammate");  // Returns "t..." prefixed ID
```

### Mailbox Communication

Teammates communicate via file-based mailboxes:
- **Inbox Path:** `~/.claude/teams/{teamName}/inbox/{agentName}/`
- **Messages:** Written as JSON files, polled by the teammate agent
- **Plan Approvals:** Sent via `writeToMailbox` (`f9`), received via `readMailbox` (`Ld`)

### Key Integration Points

| Integration | Description |
|------------|-------------|
| `hasTeamContext` (`l8`) | Checks if agent is part of a team |
| `isTeamLeader` (`PM`) | Checks if agent is the team leader |
| `SendMessageTool` (`YhY`) | Sends messages between teammates |
| `planApprovalRequest` | Sent to leader via mailbox for approval |

---

## Part 7: Cron/Loop Integration

### Background Task Scheduling

The `/loop` command and CronCreateTool create background tasks that run on recurring schedules.

### CronCreateTool Integration

```javascript
// CronCreateTool creates scheduled background tasks
CronCreateTool.call({
    cron: "*/5 * * * *",  // Every 5 minutes
    prompt: "Check the deploy status",
    recurring: true
});
```

### How Cron Tasks Create Background Agents

1. **Schedule Registration:** Job registered in `cronJobRegistry` (in-memory Map)
2. **Fire Time:** When cron fires, creates a background task via `createAsyncTask`
3. **Task Execution:** Runs as `local_agent` with the scheduled prompt
4. **Notification:** Results sent via `notifyTaskCompletion`

### Session-Only Lifetime

- Cron jobs live only in the current Claude session
- Jobs are lost when session ends (not persisted to disk)
- Maximum lifetime: 7 days for recurring jobs

---

## Part 8: Plan Mode Restrictions

### Why Background Agents Can't Use EnterPlanMode

**Reason:** Plan mode requires interactive user approval flow. Background agents run unattended, so they cannot participate in interactive dialogs.

### Tool Blocking

```javascript
const BACKGROUND_AGENT_BLOCKED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Task",            // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
]);
```

### Permission Mode Inheritance

Background agents inherit the permission mode from their parent:
- If parent is in `plan` mode, background agent starts in `plan` mode
- Background agent cannot change permission modes via tools
- Plan mode exit requires explicit user action in main conversation

---

## Part 9: Auto-Background Threshold

### Automatic Backgrounding

When `CLAUDE_AUTO_BACKGROUND_TASKS` env var is set or `tengu_auto_background_agents` feature flag is enabled:

```javascript
function getAutoBackgroundThreshold() {
    if (parseBoolean(process.env.CLAUDE_AUTO_BACKGROUND_TASKS) ||
        isFeatureEnabled("tengu_auto_background_agents", false)) {
        return 120000;  // 2 minutes
    }
    return 0;  // Disabled
}
```

### How It Works

1. **Threshold Check:** Tasks running longer than threshold are candidates
2. **User Prompt:** TUI shows option to background the task
3. **Conversion:** Calls `backgroundForegroundTask` (`Hd7`) to convert
4. **Continuation:** Task continues in background, main conversation freed

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

---

## Source Code Verification

### Verified Symbol Locations (2026-03-26)

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `RG` | createTaskEntry | chunks.41.mjs:2418 | ✓ Verified |
| `Hd7` | backgroundForegroundTask | chunks.89.mjs:~1515 | ✓ Verified |

### Incorrect Mappings Corrected

| Symbol | Wrong Mapping | Correct Mapping |
|--------|---------------|-----------------|
| `Kd7` | killAllRunningAgents | Crypto module export (chunks.72.mjs:2707) - Use `U4q` instead |
| `yjA` | markTaskCompleted | Constant 67108864 (chunks.15.mjs:212) - Use `$m8` instead |
| `CjA` | markTaskFailed | Constant 5242880 (chunks.15.mjs:214) - Use `Hm8` instead |
| `wd7` | createForegroundTask | Crypto module export (chunks.72.mjs) |
| `zd7` | createAsyncTask | Crypto module export (chunks.72.mjs) |
| `na` | killTask | No single symbol - use `wQ6`, `U4q` |
