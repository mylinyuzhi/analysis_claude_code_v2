# Notification Injection — Source-Level Analysis (Claude Code 2.1.76)

> Complete source-level restoration of the notification system for background task completion and status updates.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `markTaskCompleted` ($m8) - Mark task as completed — `chunks.146.mjs:2100`
- `markTaskFailed` (Hm8) - Mark task as failed — `chunks.146.mjs:2117`
- `markTaskKilled` (d4q) - Mark task as killed — `chunks.146.mjs:2034`
- `buildTaskStatusAttachment` - Build task_status attachment — `chunks.147.mjs:1035`
- `updateTaskProgressWithTelemetry` (nl4) - Update progress with telemetry — `chunks.146.mjs:2059`

---

## Overview

Background tasks communicate their status to the main conversation through a notification injection system:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Notification Flow                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Background Task Completes                                                  │
│        │                                                                     │
│        ▼                                                                     │
│   markTaskCompleted / markTaskFailed                                        │
│        │                                                                     │
│        ├──► Update task.status                                               │
│        ├──► Set task.endTime                                                 │
│        ├──► Clean up resources                                               │
│        └──► flushOutputFile(taskId)                                         │
│                                                                              │
│   Next Agent Turn                                                            │
│        │                                                                     │
│        ▼                                                                     │
│   getTaskStatusAttachments()                                                │
│        │                                                                     │
│        ├──► Find tasks with status changed                                  │
│        ├──► Build task_status attachments                                   │
│        └──► Inject as system-reminder                                       │
│                                                                              │
│   LLM receives notification in context                                       │
│        │                                                                     │
│        ▼                                                                     │
│   LLM can process results or notify user                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task Status Transition Functions

### markTaskCompleted ($m8)

**What it does:** Marks a task as successfully completed and triggers notification.

```javascript
// ============================================
// $m8 - markTaskCompleted - Mark task as completed
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
        // Only update running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: agentResult,
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file
    flushOutputFile(agentId);
}

// Mapping: $m8→markTaskCompleted, A→agentResult, q→setAppState, K→agentId,
//          i9→atomicUpdateTask, Y→task, $O→flushOutputFile
```

---

### markTaskFailed (Hm8)

**What it does:** Marks a task as failed with error information.

```javascript
// ============================================
// Hm8 - markTaskFailed - Mark task as failed
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
    }), $O(A)
}

// READABLE (for understanding):
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined
        };
    });

    // Flush output file (preserve partial results)
    flushOutputFile(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState,
//          i9→atomicUpdateTask, Y→task, $O→flushOutputFile
```

---

### markTaskKilled (d4q)

**What it does:** Marks a task as killed by user or system.

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed with notification
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
        // Skip if already notified (prevent duplicate notifications)
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
        };
    });
}

// Note: Status is already set to "killed" by triggerAbortSignal (x66)
// This function just ensures the notification flag is set

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task
```

---

## Progress Tracking with Telemetry

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates task progress and optionally logs telemetry.

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
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
    let previousProgress = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture previous progress for telemetry
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

    // Send telemetry if progress was captured and telemetry is enabled
    if (previousProgress && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = previousProgress;

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
//          i9→atomicUpdateTask, z→task, Y→previousProgress, Nn→isTelemetryEnabled,
//          c36→sendTelemetry
```

---

## Task Status Attachment Builder

### buildTaskStatusAttachment

**What it does:** Builds a task_status attachment for system reminder injection.

```javascript
// ============================================
// buildTaskStatusAttachment - Build task_status attachment
// Location: chunks.147.mjs:1035-1048
// ============================================

// ORIGINAL (for source lookup):
{
    attachments: K,
    updatedTaskOffsets: Y,
    evictedTaskIds: z
} = await wY4(q);
return OY4(A.setAppState, Y, z), K.map((_) => ({
    type: "task_status",
    taskId: _.taskId,
    taskType: _.taskType,
    status: _.status,
    description: _.description,
    deltaSummary: _.deltaSummary
}))

// READABLE (for understanding):
async function buildTaskStatusAttachment(appState) {
    let { attachments, updatedTaskOffsets, evictedTaskIds } = await pollTaskOutputs(appState);

    // Update task offsets in state
    updateTaskOffsets(appState.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Build attachment objects
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}
```

---

## Attachment Types

### task_status Attachment

Generated when a task transitions to a terminal state (completed, failed, killed).

```xml
<system-reminder>
<task_status>
  <task_id>a3f8b2c1</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase for API usage</description>
  <delta_summary>Found 15 occurrences in 8 files...</delta_summary>
</task_status>
</system-reminder>
```

### task_progress Attachment

Generated periodically while a task is running (throttled to every 3 turns).

```xml
<system-reminder>
<task_progress>
  <task_id>a3f8b2c1</task_id>
  <task_type>local_agent</task_type>
  <message>Running npm install...</message>
</task_progress>
</system-reminder>
```

---

## Notification Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Complete Notification Flow                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Background Task Execution
        │
        │ (each turn)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  updateTaskProgressWithTelemetry(taskId, summary, setAppState)              │
│                                                                              │
│  • Update progress.toolUseCount, progress.tokenCount                       │
│  • Set progress.summary                                                      │
│  • Send telemetry if enabled                                                │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        │ (completion)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  markTaskCompleted / markTaskFailed                                         │
│                                                                              │
│  • Set status: "completed" / "failed"                                       │
│  • Set endTime                                                               │
│  • Clean up resources                                                        │
│  • flushOutputFile(taskId)                                                  │
│  • Set notified: false (not yet notified)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        │ (next agent turn, before LLM call)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  getTaskStatusAttachments()                                                 │
│                                                                              │
│  1. pollTaskOutputs() - Read new output from files                         │
│  2. Find tasks with status !== "running" && !notified                       │
│  3. Build task_status attachments with deltaSummary                         │
│  4. Update task.notified = true                                             │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Attachment Injection                                                        │
│                                                                              │
│  { type: "attachment", attachment: { type: "task_status", ... } }           │
│                                                                              │
│  Injected into conversation context as system-reminder message              │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LLM Processing                                                              │
│                                                                              │
│  LLM sees: "Background agent 'Search codebase' completed. Found 15..."     │
│  LLM can use results or inform user                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Progress Throttling

### Why Throttle?

Progress attachments can be noisy. To prevent context pollution:
- **3-turn threshold** - Only show progress every 3 assistant turns
- **First progress always shown** - New tasks get immediate progress
- **Backwards iteration** - Efficiently find last progress in message history

### Implementation

```javascript
// ============================================
// countTurnsSinceLastProgressInline - Progress frequency calculator
// ============================================

// > **CORRECTION:** `TIY` is actually `countUniqueUris` (counts unique URIs for LSP). The function below describes an INLINE progress throttling mechanism, NOT the TIY function. See `key_algorithms_deep_dive.md` Algorithm 10.

// READABLE (for understanding):
function countTurnsSinceLastProgressInline(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }
    return turnsSinceProgress;
}

// Usage: Only generate progress if turnsSinceProgress.get(taskId) >= 3
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✅ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✅ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✅ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✅ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✅ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✅ Verified |
| `$O` | flushOutputFile | chunks.41.mjs:2320 | ✅ Verified |