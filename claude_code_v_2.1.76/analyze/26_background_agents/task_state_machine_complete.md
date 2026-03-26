# Task State Machine - Complete Analysis (Claude Code 2.1.76)

> Source-level analysis of the task state machine: all states, transitions, and the functions that drive them.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `createTaskRecord` (RG) - Initialize task state — `chunks.41.mjs:2418`
- `createBackgroundAgentTask` (Qn4) - Create background task — `chunks.146.mjs:2133`
- `createForegroundAgentTask` (Un4) - Create foreground task — `chunks.146.mjs:2165`
- `triggerAbortSignal` (x66) - Abort running task — `chunks.146.mjs:2012`
- `killAllLocalAgents` (U4q) - Kill all local agents — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task killed — `chunks.146.mjs:2034`
- `markTaskCompleted` ($m8) - Mark task completed — `chunks.146.mjs:2100`
- `markTaskFailed` (Hm8) - Mark task failed — `chunks.146.mjs:2117`
- `atomicUpdateTask` (i9) - Generic state updater — `chunks.90.mjs:3003`
- `updateTaskProgressPreservingSummary` (TV1) - Update progress with summary — `chunks.146.mjs:2045`
- `updateTaskProgressWithTelemetry` (nl4) - Update progress with telemetry — `chunks.146.mjs:2059`

---

## State Diagram

```
                         ┌───────────────────────────────────────┐
                         │                                       │
                         ▼                                       │
                    ┌──────────┐                                │
                    │ pending  │ ◀─── createTaskRecord()        │
                    └────┬─────┘                                │
                         │ spawn execution                       │
                         │ (Qn4/Un4)                             │
                         ▼                                       │
                    ┌──────────┐                                │
         ┌─────────│ running  │─────────┐                       │
         │         └────┬─────┘         │                       │
         │              │               │                       │
         │   (x66)      │ ($m8)         │ (Hm8)                 │
         │   abort      │ success       │ error                 │
         │              │               │                       │
         ▼              ▼               ▼                       │
    ┌──────────┐   ┌──────────┐   ┌──────────┐                 │
    │  killed  │   │completed │   │  failed  │                 │
    └──────────┘   └──────────┘   └──────────┘                 │
         │              │               │                       │
         │              │               │                       │
         └──────────────┴───────────────┘                       │
                        │                                       │
                        │ removeTask() / cleanup                 │
                        │                                       │
                        ▼                                       │
                  [Terminal]                                     │
                                                               │
                        ▲                                       │
                        │ resume: NV1()                          │
                        └───────────────────────────────────────┘
```

---

## Task Record Structure

### Initial Record (RG)

**What it does:** Creates the minimal task record with all required fields.

**How it works:**

```javascript
// ============================================
// createTaskRecord - Initialize minimal task state
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
        id:           taskId,              // Unique identifier with type prefix
        type:         taskType,            // "local_agent" | "local_bash" | "remote_agent" | "in_process_teammate" | "local_workflow"
        status:       "pending",           // Initial state
        description:  description,         // Human-readable task description
        toolUseId:    toolUseId,           // Links to tool_use that spawned this task
        startTime:    Date.now(),          // Creation timestamp
        outputFile:   getOutputFilePath(taskId),  // Path: ~/.claude/tasks/{taskId}.output
        outputOffset: 0,                   // Byte cursor for incremental reads
        notified:     false                // Guard: prevents duplicate notifications
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId, g2→getOutputFilePath
```

### Extended Record Fields

When `Qn4` or `Un4` creates an agent task, additional fields are added:

```javascript
{
    // ... base fields from RG ...

    // Agent-specific fields
    agentId:         string,          // Unique agent identifier
    prompt:          string,          // Task prompt for the agent
    selectedAgent:   object,          // Agent definition object
    agentType:       string,          // "general-purpose" | "Explore" | "Plan" | etc.
    abortController: AbortController, // For cancellation
    unregisterCleanup: function,      // Removes process-exit handler

    // State tracking
    retrieved:       boolean,         // Has TaskOutput retrieved this task?
    isBackgrounded:  boolean,         // true if running as background task
    background:      boolean,         // true if explicitly started with run_in_background=true (v2.1.76)

    // Progress tracking
    lastReportedToolCount:  number,
    lastReportedTokenCount: number,
    progress: {
        toolUseCount:   number,
        tokenCount:     number,
        summary:        string,
        lastActivity:   string,
        recentActivities: string[]
    },

    // Message queue for background agents
    pendingMessages: array,

    // Terminal state fields
    result:          object,          // AgentResult (completed only)
    error:           string,          // Error message (failed only)
    endTime:         number,          // Completion timestamp
    messages:        array            // Final message state (truncated to last)
}
```

---

## State Transition Functions

### x66 - triggerAbortSignal

**What it does:** Aborts a running task by triggering its AbortController and updating state.

**Key Decision:** Returns a boolean indicating whether the abort actually happened. This prevents double-abort scenarios.

```javascript
// ============================================
// triggerAbortSignal - Abort a running task
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
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Trigger abort controller (cascades to all async operations)
        task.abortController?.abort();

        // Run cleanup handler (removes process-exit listener)
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Notify completion if we actually aborted
    if (wasAborted) {
        notifyCompletion(taskId);
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask, $O→notifyCompletion
```

**Why return boolean?**
- Caller can distinguish between "task was running and is now killed" vs "task was already terminal"
- Prevents showing misleading notifications for tasks that already completed

---

### U4q - killAllLocalAgents

**What it does:** Iterates all tasks and kills those matching `type === "local_agent" && status === "running"`.

```javascript
// ============================================
// killAllLocalAgents - Kill all running local agents (Ctrl+C handler)
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

**Key Insight:** This function is called when user presses Ctrl+C or Ctrl+F. It's intentionally simple:
1. No batch notification - each task triggers its own notification via `x66`
2. No error handling - `x66` handles already-terminal tasks gracefully
3. No async - state updates are synchronous

---

### d4q - markTaskKilled

**What it does:** Updates task state after kill, setting the `notified` flag to prevent duplicate notifications.

```javascript
// ============================================
// markTaskKilled - Mark task as killed with notification guard
// Location: chunks.146.mjs:2034-2043
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Skip if already notified (prevent double notification)
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

**Why separate from x66?**
- `x66` handles the abort signal and state transition to "killed"
- `d4q` is called separately to set `notified: true` after the notification is shown
- This separation allows for partial results to be captured between abort and notification

---

### $m8 - markTaskCompleted

**What it does:** Transitions a running task to "completed" state with the agent result.

```javascript
// ============================================
// markTaskCompleted - Transition to completed state
// Location: chunks.146.mjs:2100-2115
// ============================================

// ORIGINAL (for source lookup):
function $m8(A, q) {
    let K = A.agentId;
    i9(K, q, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "completed",
            result: A,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(K)
}

// READABLE (for understanding):
function markTaskCompleted(agentResult, setAppState) {
    let agentId = agentResult.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        // Only transition running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: agentResult,           // Contains content, tokens, toolUseCount, etc.
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    notifyCompletion(agentId);
}

// Mapping: $m8→markTaskCompleted, A→agentResult, q→setAppState, i9→atomicUpdateTask, $O→notifyCompletion
```

---

### Hm8 - markTaskFailed

**What it does:** Transitions a running task to "failed" state with an error message.

```javascript
// ============================================
// markTaskFailed - Transition to failed state
// Location: chunks.146.mjs:2117-2131
// ============================================

// ORIGINAL (for source lookup):
function Hm8(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "failed",
            error: q,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0
        }
    })
}

// READABLE (for understanding):
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only transition running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined
        };
    });
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, i9→atomicUpdateTask
```

---

### Qn4 - createBackgroundAgentTask

**What it does:** Creates a fully initialized background agent task with abort handling.

```javascript
// ============================================
// createBackgroundAgentTask - Initialize background agent task
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
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0,
            pendingMessages: []
        },
        H = E4(async () => {
            x66(A, z)
        });
    return $.unregisterCleanup = H, Zf($, z), $
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
    // Initialize output file
    initOutputFile(agentId, getOutputFilePath(agentId));

    // Create abort controller - child of parent if provided
    let abortController = parentAbortController
        ? cloneAbortController(parentAbortController)  // Shares abort signal with parent
        : new AbortController();                         // Independent abort

    // Build task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,
        pendingMessages: []
    };

    // Register process-exit cleanup handler
    let unregisterCleanup = registerProcessExitHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    taskRecord.unregisterCleanup = unregisterCleanup;

    // Register in app state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt, Y→selectedAgent,
// z→setAppState, _→parentAbortController, w→toolUseId, Co→initOutputFile, RG→createTaskRecord,
// Wm→cloneAbortController, sK→newAbortController, E4→registerProcessExitHandler, Zf→registerTask
```

**Key Decision - Abort Controller Hierarchy:**
- If `parentAbortController` is provided, use `Wm` (cloneAbortController) to create a sibling
- This means when the parent is aborted, the child is also aborted
- But the child can be aborted independently without affecting the parent

---

## Progress Update Functions

### TV1 - updateTaskProgressPreservingSummary

**What it does:** Updates progress while preserving the existing summary text.

```javascript
// ============================================
// updateTaskProgressPreservingSummary - Update progress keeping summary
// Location: chunks.146.mjs:2045-2057
// ============================================

// ORIGINAL (for source lookup):
function TV1(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        let z = Y.progress?.summary;
        return {
            ...Y,
            progress: z ? {
                ...q,
                summary: z
            } : q
        }
    })
}

// READABLE (for understanding):
function updateTaskProgressPreservingSummary(taskId, progressUpdate, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? { ...progressUpdate, summary: existingSummary }
                : progressUpdate
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→progressUpdate, K→setAppState
```

### nl4 - updateTaskProgressWithTelemetry

**What it does:** Updates progress and sends telemetry if enabled.

```javascript
// ============================================
// updateTaskProgressWithTelemetry - Update progress with telemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

// ORIGINAL (for source lookup):
function nl4(A, q, K) {
    let Y = null;
    if (i9(A, K, (z) => {
            if (z.status !== "running") return z;
            return Y = {
                tokenCount: z.progress?.tokenCount ?? 0,
                toolUseCount: z.progress?.toolUseCount ?? 0,
                startTime: z.startTime,
                toolUseId: z.toolUseId
            }, {
                ...z,
                progress: {
                    ...z.progress,
                    toolUseCount: z.progress?.toolUseCount ?? 0,
                    tokenCount: z.progress?.tokenCount ?? 0,
                    summary: q
                }
            }
        }), Y && Nn()) {
        let {
            tokenCount: z,
            toolUseCount: _,
            startTime: w,
            toolUseId: O
        } = Y;
        c36({
            type: "system",
            subtype: "task_progress",
            task_id: A,
            tool_use_id: O,
            description: q,
            usage: {
                total_tokens: z,
                tool_uses: _,
                duration_ms: Date.now() - w
            },
            summary: q
        })
    }
}

// READABLE (for understanding):
function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let progressSnapshot = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture current progress for telemetry
        progressSnapshot = {
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
    if (progressSnapshot && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = progressSnapshot;

        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summary,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
// i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

---

## State Transition Summary

| From State | To State | Function | Symbol | Trigger |
|------------|----------|----------|--------|---------|
| (none) | pending | createTaskRecord | RG | Task creation |
| pending | running | createBackgroundAgentTask | Qn4 | Spawn agent |
| pending | running | createForegroundAgentTask | Un4 | Spawn agent |
| running | killed | triggerAbortSignal | x66 | User abort / Ctrl+C |
| running | completed | markTaskCompleted | $m8 | Agent success |
| running | failed | markTaskFailed | Hm8 | Agent error |
| running | running | updateTaskProgressWithTelemetry | nl4 | Progress update |

---

## Guard Conditions

### notified Flag

The `notified` boolean prevents duplicate notifications:

1. **Set to true** by `d4q` after notification is shown
2. **Checked by** `d4q` to skip already-notified tasks
3. **Cleared** when task is removed from state

### status !== "running" Check

All terminal state transitions check `status !== "running"`:

```javascript
if (task.status !== "running") return task;
```

This prevents:
- Transitioning a killed task to completed
- Double-aborting a task
- Marking a failed task as completed

---

## Memory Optimization

All terminal state transitions truncate the `messages` array:

```javascript
messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
```

**Why this matters:**
- Agent messages can grow very large (many KB per message)
- Only the last message is needed for context recovery
- This prevents memory leaks from long-running agents

---

## Integration with System Reminders

Task state changes trigger system reminder attachments:

| State Change | Attachment Type | Content |
|--------------|-----------------|---------|
| running → completed | task_status | result summary, output delta |
| running → failed | task_status | error message |
| running → killed | task_status | partial output delta |
| running (periodic) | task_progress | current activity |

See [system_reminder_producers.md](./system_reminder_producers.md) for details.