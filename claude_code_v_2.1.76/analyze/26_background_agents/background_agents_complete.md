# Background Agents Complete Documentation (Claude Code 2.1.76)

> Complete documentation for the background agents system including abort propagation, output capture, progress tracking, kill handlers, and integration with other modules.

---

## Related Symbols

> Symbol mappings:
> - [../08_subagent/cross_validation_unified.md](../08_subagent/cross_validation_unified.md) - Unified symbol verification
> - [../08_subagent/key_algorithms_deep_dive.md](../08_subagent/key_algorithms_deep_dive.md) - Algorithm analysis

Key functions in this document:
- `Qn4` - createBackgroundAgentTask — `chunks.146.mjs:2133`
- `Un4` - createForegroundAgentTask — `chunks.146.mjs:2165`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`
- `d4q` - markTaskNotified — `chunks.146.mjs:2034`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `TV1` - updateTaskProgressPreservingSummary — `chunks.146.mjs:2045`

---

## Overview

Background agents are one of the most architecturally sophisticated systems in Claude Code. They allow any `Task` (subagent) or `Bash` (shell command) tool call to be detached from the main conversation loop, running asynchronously while the lead agent continues other work.

**Key capabilities:**
- **Asynchronous execution** - Run long tasks without blocking the main conversation
- **Output capture** - Persistent file-based output with incremental reads
- **Progress tracking** - Automatic progress updates injected into system reminders
- **Kill handling** - Graceful termination with task-type-specific strategies
- **Tool access control** - Blocklist/allowlist to prevent blocking operations

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Main Agent Loop                                  │
│  (processes user messages, runs tools synchronously)                    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
   ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
   │ AgentTool   │       │ BashTool    │       │ Other Tools │
   │ run_in_bg   │       │ timeout/Ctrl│       │             │
   │ = true      │       │ = background│       │             │
   └──────┬──────┘       └──────┬──────┘       └─────────────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                      Task Creation Layer                             │
   │                                                                      │
   │  createBackgroundAgentTask(Qn4) / createForegroundAgentTask(Un4)   │
   │  - Generate unique task ID (oV)                                     │
   │  - Create AbortController for cancellation                          │
   │  - Initialize output file (.claude/tasks/<id>.output)               │
   │  - Register task in appState.tasks (Zf)                             │
   │  - Spawn detached execution context                                 │
   └────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                       Background Execution                           │
   │                                                                      │
   │  Tool Access Control:                                                │
   │  • BLOCKED (CW6): TaskOutput, ExitPlanMode, EnterPlanMode,          │
   │    Agent, AskUserQuestion, TaskStop                                  │
   │  • ALLOWED (eP1): Read, Write, Edit, Bash, Grep, Glob,              │
   │    WebFetch, WebSearch, TodoWrite, Skill, etc.                       │
   │                                                                      │
   │  Output Capture:                                                     │
   │  • OutputBuffer (Y91) - Buffered writes                              │
   │  • readOutputFileDelta (Z97) - Incremental reads                     │
   │                                                                      │
   │  Progress Tracking:                                                  │
   │  • nl4 - Update progress with telemetry                              │
   │  • TV1 - Update progress preserving summary                           │
   └────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                     Completion & Notification                        │
   │                                                                      │
   │  $m8 (completed) / Hm8 (failed) / x66 (killed)                      │
   │  → System reminder attachment via suY                               │
   │  → UI notification displayed                                         │
   └─────────────────────────────────────────────────────────────────────┘
```

---

## Task Creation

### createBackgroundAgentTask (Qn4)

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask
// Location: chunks.146.mjs:2133-2163
// ============================================

// ORIGINAL (for source lookup):
function Qn4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    parentAbortController: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = _ ? Wm(_) : sK(),
        $ = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            // ... additional fields
        };
    return Zf($, z), $
}

// READABLE (for understanding):
function createBackgroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    parentAbortController,
    toolUseId
}) {
    // Step 1: Initialize output file
    ensureOutputDirectoryExists(getOutputDirectory(agentId));

    // Step 2: Create AbortController
    // If parent exists, create child that inherits abort signal
    // Otherwise, create new independent AbortController
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : new AbortController();

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskEntry(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        abortController: abortController,
        startTime: Date.now(),
        outputOffset: 0,
        progress: {
            tokenCount: 0,
            toolUseCount: 0,
            summary: null
        }
    };

    // Step 4: Register task in state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt, Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId, RG→createTaskEntry, Zf→registerTask, Wm→createChildAbortController, sK→new AbortController
```

### createForegroundAgentTask (Un4)

```javascript
// ============================================
// Un4 - createForegroundAgentTask
// Location: chunks.146.mjs:2165-2195
// ============================================

// READABLE (for understanding):
function createForegroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    abortController,
    toolUseId,
    midRunBackgrounding
}) {
    // Similar to background task, but:
    // 1. Uses provided AbortController (from main loop)
    // 2. Sets up foreground resolve promise
    // 3. Can be backgrounded mid-run via midRunBackgrounding flag

    let taskRecord = {
        ...createTaskEntry(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        abortController: abortController,
        startTime: Date.now(),
        isForeground: true,
        midRunBackgrounding: midRunBackgrounding ?? false
    };

    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Un4→createForegroundAgentTask
```

---

## Abort Propagation

### Abort Signal Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ABORT PROPAGATION FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

User triggers kill (Ctrl+F, TaskStop, or parent abort)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ x66 - triggerAbortSignal(taskId, setAppState)                               │
│                                                                              │
│   1. Check if task is running                                               │
│   2. Call abortController.abort()                                           │
│   3. Run unregisterCleanup()                                                │
│   4. Update state: status = "killed"                                        │
│   5. Flush output buffer                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ├──────────────────────────────────────────────────────────┐
        │                                                          │
        ▼                                                          ▼
┌─────────────────────────┐                      ┌─────────────────────────────┐
│ LLM API Stream          │                      │ Tool Execution              │
│                         │                      │                             │
│ • Stream interrupted    │                      │ • Operation cancelled       │
│ • Partial response      │                      │ • Cleanup handlers run      │
│   captured              │                      │ • Error thrown              │
│ • Error thrown          │                      │                             │
└─────────────────────────┘                      └─────────────────────────────┘
        │                                                          │
        └──────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Cleanup completes:                                                           │
│   • Output buffer flushed (partial results preserved)                       │
│   • State updated to "killed"                                               │
│   • Notification shown to user                                              │
│   • System reminder injected for LLM                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasRunning = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        wasRunning = true;

        // Trigger abort
        task.abortController?.abort();

        // Run cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output if was running
    if (wasRunning) {
        flushOutputBuffer(taskId);
    }

    return wasRunning;
}
```

---

## Output Capture

### Output File System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OUTPUT FILE SYSTEM                                   │
└─────────────────────────────────────────────────────────────────────────────┘

File Location:
  .claude/tasks/<taskId>.output

Example:
  .claude/tasks/a7x9k2m3.output

Content Format:
  - Stream of text output from agent
  - May include tool results, LLM responses, progress messages
  - Written incrementally via OutputBuffer

Read Pattern:
  - Incremental reads via readOutputFileDelta(taskId, offset)
  - Returns { content, newOffset }
  - Delta-based to avoid duplicate content
```

### OutputBuffer Class

```javascript
// ============================================
// Y91 - OutputBuffer
// Location: chunks.41.mjs:2252-2308
// ============================================

class OutputBuffer {
    #filePath;
    #fileHandle = null;
    #pendingWrites = [];
    #flushPromise = null;

    constructor(taskId) {
        this.#filePath = getOutputFilePath(taskId);
    }

    append(content) {
        this.#pendingWrites.push(content);
        if (!this.#flushPromise) {
            this.#startFlush();
        }
    }

    flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    cancel() {
        this.#pendingWrites.length = 0;
    }

    // Internal: Batch writes for efficiency
    #concatToBuffer() {
        let chunks = this.#pendingWrites.splice(0, this.#pendingWrites.length);
        let totalSize = chunks.reduce((sum, c) => sum + Buffer.byteLength(c, "utf8"), 0);
        let buffer = Buffer.allocUnsafe(totalSize);
        let offset = 0;
        for (let chunk of chunks) {
            offset += buffer.write(chunk, offset, "utf8");
        }
        return buffer;
    }
}
```

---

## Progress Tracking

### Progress Update with Telemetry

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059-2097
// ============================================

function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let previousProgress = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        previousProgress = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Send telemetry if enabled
    if (previousProgress && isTelemetryEnabled()) {
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: previousProgress.toolUseId,
            description: summary,
            usage: {
                total_tokens: previousProgress.tokenCount,
                tool_uses: previousProgress.toolUseCount,
                duration_ms: Date.now() - previousProgress.startTime
            },
            summary: summary
        });
    }
}
```

---

## Task Completion

### markTaskCompleted ($m8)

```javascript
// ============================================
// $m8 - markTaskCompleted
// Location: chunks.146.mjs:2100-2115
// ============================================

function markTaskCompleted(result, setAppState) {
    let agentId = result.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output
    flushOutputBuffer(agentId);
}
```

### markTaskFailed (Hm8)

```javascript
// ============================================
// Hm8 - markTaskFailed
// Location: chunks.146.mjs:2117-2131
// ============================================

function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    flushOutputBuffer(taskId);
}
```

---

## Kill Handlers by Task Type

| Task Type | Kill Handler | Behavior |
|-----------|--------------|----------|
| `local_bash` | Lf6 | triggerAbortSignal + process.kill |
| `local_agent` | Fk1 | triggerAbortSignal |
| `remote_agent` | Fn4 | Bridge.kill() (remote) |
| `in_process_teammate` | - | Special teammate cleanup |

---

## Tool Access Control

### Blocked Tools (CW6)

| Tool | Reason |
|------|--------|
| `TaskOutput` | Could create polling loops |
| `ExitPlanMode` | Requires user approval flow |
| `EnterPlanMode` | Requires user approval flow |
| `Agent` | Could spawn nested background agents |
| `AskUserQuestion` | Would block indefinitely |
| `TaskStop` | Background agents shouldn't manage other tasks |

### Allowed Tools (eP1)

| Tool | Why Safe |
|------|----------|
| `Read` | Read-only, no side effects |
| `Write` | File creation - common for background tasks |
| `Edit` | File modification - common for background tasks |
| `Grep` | Content search - non-blocking |
| `Glob` | File search - non-blocking |
| `Bash` | Shell commands - core capability |
| `WebFetch` | Network request - async-safe |
| `WebSearch` | Network request - async-safe |
| `TodoWrite` | Task management - useful for tracking |
| `NotebookEdit` | Jupyter editing - file-like operation |
| `Skill` | Skill invocation - controlled execution |

---

## Task State Machine

```
                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ spawn (Qn4/Un4)
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
       $m8                  Hm8                   x66
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [d4q: mark notified]          │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │
                         │   = true     │
                         └──────┬───────┘
                                │ VR (removeTask)
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         │ (from state) │
                         └──────────────┘
```

---

## Related Documents

- [../08_subagent/key_algorithms_deep_dive.md](../08_subagent/key_algorithms_deep_dive.md) - Algorithm analysis
- [../08_subagent/cross_feature_linkages_complete.md](../08_subagent/cross_feature_linkages_complete.md) - Cross-feature integration
- [../04_system_reminder/types_task_management.md](../04_system_reminder/types_task_management.md) - Task management types

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full background agents documentation with source-level restoration