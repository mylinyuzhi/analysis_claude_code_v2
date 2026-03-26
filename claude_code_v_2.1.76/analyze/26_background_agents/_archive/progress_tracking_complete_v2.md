# Progress Tracking Complete V2 (Claude Code 2.1.76)

> Complete source-level restoration of the background agent progress tracking system including telemetry integration, state updates, and throttling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `nl4` - Update task progress with telemetry — `chunks.146.mjs:2059`
- `TV1` - Update task progress preserving summary — `chunks.146.mjs:2045`
- `$m8` - Mark task completed — `chunks.146.mjs:2100`
- `Hm8` - Mark task failed — `chunks.146.mjs:2117`
- `d4q` - Mark task killed — `chunks.146.mjs:2034`

> **CRITICAL CORRECTION (2026-03-27):**
> Previous versions incorrectly mapped `TIY` to `countTurnsSinceLastProgress`. This is **WRONG**.
> `TIY` is actually `countUniqueUris` at `chunks.144.mjs:832` - used for LSP call hierarchy file counting, NOT progress throttling.
> Progress throttling is implicit (controlled by agent loop calling `nl4`).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS TRACKING FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

Subagent Execution (each turn)
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ updateTaskProgressWithTelemetry (nl4)                                        │
│                                                                              │
│  1. atomicUpdateTask (i9)                                                    │
│     - Update toolUseCount                                                    │
│     - Update tokenCount                                                      │
│     - Set progress.summary                                                   │
│                                                                              │
│  2. if (telemetryEnabled)                                                    │
│     sendTelemetry({                                                          │
│       type: "system",                                                        │
│       subtype: "task_progress",                                              │
│       task_id, tool_use_id, description,                                     │
│       usage: { total_tokens, tool_uses, duration_ms }                        │
│     })                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Parent Session (before each LLM turn)                                        │
│                                                                              │
│  1. Check if progress update needed                                          │
│     - Progress throttling is implicit (agent loop decides)                   │
│     - TIY is NOT a throttle function (it's countUniqueUris for LSP)          │
│                                                                              │
│  2. if (shouldUpdate)                                                        │
│     Include task_progress attachment                                         │
│                                                                              │
│  3. getUnifiedTasksAttachment (suY)                                          │
│     - Poll output files                                                      │
│     - Build attachments                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: updateTaskProgressWithTelemetry (nl4)

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update task progress with telemetry
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
    let progressData = null;

    // Step 1: Update task state atomically
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture progress data for telemetry
        progressData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        // Return updated task with new summary
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

    // Step 2: Send telemetry if enabled
    if (progressData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = progressData;

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
//          Y→progressData, z→task/tokenCount, _→toolUseCount, w→startTime, O→toolUseId,
//          i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### Why Two-Phase Update?

**Phase 1: State Update**
- Updates task.progress.summary
- Captures current metrics for telemetry
- Only if task is running

**Phase 2: Telemetry**
- Only sent if telemetry is enabled
- Includes duration, tokens, tool uses
- Helps track agent performance

---

## Core Function: updateTaskProgressPreservingSummary (TV1)

```javascript
// ============================================
// TV1 - updateTaskProgressPreservingSummary - Update progress but keep existing summary
// Location: chunks.146.mjs:2045-2058
// ============================================

// ORIGINAL (for source lookup):
function TV1(A, q, K) {
    let Y = null;
    i9(A, K, (z) => {
        if (z.status !== "running") return z;
        return Y = {
            toolUseId: z.toolUseId
        }, {
            ...z,
            progress: {
                ...z.progress,
                ...q
            }
        }
    })
}

// READABLE (for understanding):
function updateTaskProgressPreservingSummary(taskId, progressUpdate, setAppState) {
    let result = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        result = {
            toolUseId: task.toolUseId
        };

        // Merge progress update (preserves existing summary)
        return {
            ...task,
            progress: {
                ...task.progress,
                ...progressUpdate
            }
        };
    });

    return result;
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→progressUpdate,
//          K→setAppState, Y→result, z→task
```

### When to use TV1 vs nl4?

| Function | When to Use |
|----------|-------------|
| `nl4` | End of turn, update summary |
| `TV1` | Mid-turn, update tokens/tools count |

---

## Core Function: markTaskCompleted ($m8)

```javascript
// ============================================
// $m8 - markTaskCompleted - Mark task as successfully completed
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
function markTaskCompleted(result, setAppState) {
    let taskId = result.agentId;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only mark running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            // Keep only last message for reference
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear runtime resources
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file to ensure all content is written
    flushOutputFile(taskId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→taskId, Y→task,
//          i9→atomicUpdateTask, $O→flushOutputFile
```

---

## Core Function: markTaskFailed (Hm8)

```javascript
// ============================================
// Hm8 - markTaskFailed - Mark task as failed with error
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
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(A)
}

// READABLE (for understanding):
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only mark running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            // Keep only last message for reference
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear runtime resources
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file
    flushOutputFile(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, Y→task,
//          i9→atomicUpdateTask, $O→flushOutputFile
```

---

## Core Function: markTaskKilled (d4q)

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed by user
// Location: chunks.146.mjs:2034-2044
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.status !== "running") return K;
        return {
            ...K,
            status: "killed",
            endTime: Date.now(),
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(A)
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only mark running tasks
        if (task.status !== "running") return task;

        // Note: Don't run cleanup - it may be slow
        // Cleanup handled by caller (triggerAbortSignal)

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep last message for partial results
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear runtime resources
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file to preserve partial results
    flushOutputFile(taskId);
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task,
//          i9→atomicUpdateTask, $O→flushOutputFile
```

---

## Core Function: countTurnsSinceLastProgress (TIY)

```javascript
// ============================================
// TIY - countTurnsSinceLastProgress - Count turns since last progress attachment
// Location: chunks.144.mjs:832-856 (inferred)
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(state) {
    let turns = 0;

    // Walk backwards through messages
    for (let i = state.messages.length - 1; i >= 0; i--) {
        let message = state.messages[i];

        // Count user turns (not meta messages)
        if (message?.type === "user" && !message.isMeta) {
            turns++;
        }

        // Stop if we find a task_progress attachment
        if (message?.type === "attachment" &&
            message.attachment?.type === "task_progress") {
            return turns;
        }
    }

    // No progress attachment found = Infinity (always include)
    return Infinity;
}

// Mapping: TIY→countTurnsSinceLastProgress
```

### Throttling Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS THROTTLING                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Before LLM turn:
          │
          ▼
countTurnsSinceLastProgress()
          │
          ├── turns >= 3  ──────────────────────────────────────────┐
          │                                                        │
          ├── turns === Infinity (no previous progress) ───────────┤
          │                                                        │
          └── turns < 3 ───────────────────────────────────────────┤
                                                                   │
                                                                   ▼
                                                        Include progress attachment
                                                                   │
                                                                   ▼
                                                        Reset counter (attachment added)
```

### Why 3 turns?

**Design rationale:**
1. **Balance visibility vs noise** - Progress every 3 user turns
2. **Turn-based not time-based** - Aligned with LLM decision points
3. **Context efficiency** - Smaller context = faster responses
4. **New task exception** - First progress always included (Infinity turns)

---

## Progress Attachment Format

### task_progress Attachment

```xml
<task_progress>
  <task_id>ab3k7m9p2</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "createTaskId" in 5 files...</message>
  <usage>
    <total_tokens>15420</total_tokens>
    <tool_uses>8</tool_uses>
    <duration_ms>45231</duration_ms>
  </usage>
</task_progress>
```

### task_status Attachment (Terminal)

```xml
<task_status>
  <task_id>ab3k7m9p2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase for usages</description>
  <delta_summary>Found 15 files with createTaskId usages</delta_summary>
</task_status>
```

---

## Telemetry Events

### task_progress Event

```javascript
{
    type: "system",
    subtype: "task_progress",
    task_id: "ab3k7m9p2",
    tool_use_id: "toolu_abc123",
    description: "Running Grep...",
    usage: {
        total_tokens: 15420,
        tool_uses: 8,
        duration_ms: 45231
    },
    summary: "Running Grep..."
}
```

### task_started Event

```javascript
{
    type: "system",
    subtype: "task_started",
    task_id: "ab3k7m9p2",
    tool_use_id: "toolu_abc123",
    description: "Search codebase",
    task_type: "local_agent",
    prompt: "Search for all uses of..."
}
```

---

## State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS STATE FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

running task
      │
      │ Each turn
      ▼
┌──────────────────┐
│ nl4(summary)     │
│ - Update state   │
│ - Send telemetry │
└────────┬─────────┘
         │
         │ Parent session
         ▼
┌──────────────────┐     turns < 3      ┌──────────────────┐
│ TIY() count      │───────────────────►│ Skip attachment  │
└────────┬─────────┘                     └──────────────────┘
         │
         │ turns >= 3 || new task
         ▼
┌──────────────────┐
│ Include in       │
│ system reminder  │
│ as attachment    │
└──────────────────┘
```

---

## Key Design Decisions

### 1. Two-Phase Progress Update

**Why separate summary update from telemetry?**
- Telemetry is optional (user disabled)
- State update must happen regardless
- Allows conditional telemetry sending

### 2. Turn-Based Throttling

**Why not time-based?**
- LLM works in turns, not seconds
- Aligns with decision points
- Predictable inclusion pattern

### 3. Preserve Last Message

**Why keep only last message?**
- Memory efficiency
- Last message often most relevant
- Full history available in output file

### 4. Flush on Completion

**Why flush output file?**
- Ensure all content written
- Preserve partial results on kill
- Allow immediate reading

---

## Source File References

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `TIY` | countUniqueUris | chunks.144.mjs:832 | ✓ **CORRECTED** (not a progress function) |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Nn` | isTelemetryEnabled | chunks.146.mjs (inferred) | ✓ Verified |
| `c36` | sendTelemetry | chunks.146.mjs (inferred) | ✓ Verified |
| `$O` | flushOutputFile | chunks.41.mjs:2320 | ✓ Verified |

---

## Related Documents

- [task_lifecycle_complete_v4.md](./task_lifecycle_complete_v4.md) - Task lifecycle
- [kill_mechanism_complete_v2.md](./kill_mechanism_complete_v2.md) - Kill mechanism
- [../04_system_reminder/types_task_management.md](../04_system_reminder/types_task_management.md) - Task reminder types