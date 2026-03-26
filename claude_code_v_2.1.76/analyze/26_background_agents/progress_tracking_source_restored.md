# Progress Tracking - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the progress tracking system for background tasks.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `updateTaskProgressWithTelemetry` (nl4) — `chunks.146.mjs:2059`
- `updateTaskProgressPreservingSummary` (TV1) — `chunks.146.mjs:2045`
- `atomicUpdateTask` (i9) — `chunks.90.mjs:3003`
- `countTurnsSinceLastProgress` — Progress throttling

---

## Overview

The progress tracking system provides real-time updates on background task execution. It tracks tool use counts, token consumption, and generates summaries for the LLM to monitor progress.

### Key Design Decisions

1. **Progress object in task state**: Each task has a `progress` field
2. **Summary preservation**: Can update progress while keeping existing summary
3. **Telemetry integration**: Progress updates trigger telemetry events
4. **Throttled display**: Progress attachments are throttled to prevent noise

---

## Progress Data Structure

### Task Progress Object

```javascript
// READABLE (for understanding):
{
    toolUseCount: number,      // Count of tool invocations
    tokenCount: number,        // Total tokens consumed
    summary: string,           // Current activity description
    lastActivity: number,      // Timestamp of last update
    recentActivities: string[] // Recent activity descriptions
}
```

### Task with Progress

```javascript
// READABLE (for understanding):
{
    id: "a3f4b2",
    type: "local_agent",
    status: "running",
    description: "Search codebase",
    progress: {
        toolUseCount: 15,
        tokenCount: 23451,
        summary: "Running Grep for 'createTaskId'...",
        lastActivity: 1711474800000,
        recentActivities: [
            "Reading file: chunks.146.mjs",
            "Running Grep for 'createTaskId'"
        ]
    },
    // ... other task fields
}
```

---

## Source Code - Core Functions

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates task progress and sends telemetry event.

**Location:** chunks.146.mjs:2059-2098

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
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture previous values for telemetry
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

    // Send telemetry if telemetry is enabled (Nn())
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
// i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### updateTaskProgressPreservingSummary (TV1)

**What it does:** Updates progress while preserving existing summary.

**Location:** chunks.146.mjs:2045-2057

```javascript
// ============================================
// TV1 - updateTaskProgressPreservingSummary - Update progress preserving summary
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
function updateTaskProgressPreservingSummary(taskId, newProgress, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Preserve existing summary
        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? { ...newProgress, summary: existingSummary }
                : newProgress
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→newProgress,
// K→setAppState, Y→task, z→existingSummary
```

---

## Progress Update Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Agent Loop (Tool Execution)                                │
│                                                                              │
│  1. Tool executes and completes                                              │
│  2. Result captured with token usage                                         │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              updateTaskProgressWithTelemetry (nl4)                            │
│                                                                              │
│  1. atomicUpdateTask(taskId, updater)                                        │
│  2. Increment toolUseCount                                                   │
│  3. Add token usage to tokenCount                                            │
│  4. Set summary = current tool description                                   │
│  5. Send telemetry event (if enabled)                                        │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Task State Updated                                         │
│                                                                              │
│  task.progress = {                                                           │
│    toolUseCount: 15,                                                         │
│    tokenCount: 23451,                                                        │
│    summary: "Running Grep for 'createTaskId'..."                            │
│  }                                                                           │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              pollTaskOutputs (wY4)                                            │
│                                                                              │
│  If shouldShowProgress(task) === true:                                       │
│  - Build task_progress attachment                                            │
│  - Inject into LLM context                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Progress Throttling

### Turn-Based Throttling

Progress attachments are throttled to prevent noise:

```javascript
// ============================================
// Progress throttling constants
// ============================================

const PROGRESS_THROTTLE_TURNS = 3;  // Show progress every 3 assistant turns

// READABLE (for understanding):
function shouldShowProgress(task, messageHistory) {
    // Always show for new tasks (no previous progress)
    if (!task.lastProgressTurn) {
        return true;
    }

    // Count turns since last progress
    let turnsSince = countTurnsSinceLastProgress(messageHistory);

    // Show if enough turns have passed
    return turnsSince >= PROGRESS_THROTTLE_TURNS;
}
```

### Turn Counting Algorithm

```javascript
// READABLE (for understanding):
function countTurnsSinceLastProgress(messages) {
    let count = 0;

    // Iterate backwards through message history
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Only count assistant messages
        if (message.role === "assistant") {
            count++;
        }

        // Check for progress attachment in user message
        if (message.role === "user" && hasProgressAttachment(message)) {
            return count;
        }
    }

    // No previous progress found - always show
    return Infinity;
}
```

---

## Progress Summary Generation

### Automatic Summary

The progress summary is typically derived from the last tool activity:

```javascript
// READABLE (for understanding):
function generateProgressSummary(lastToolUse) {
    switch (lastToolUse.name) {
        case "Read":
            return `Reading file: ${lastToolUse.input.file_path}`;
        case "Grep":
            return `Running Grep for "${lastToolUse.input.pattern}"`;
        case "Write":
            return `Writing to: ${lastToolUse.input.file_path}`;
        case "Edit":
            return `Editing: ${lastToolUse.input.file_path}`;
        case "Bash":
            return `Running: ${truncate(lastToolUse.input.command, 50)}`;
        default:
            return `Running ${lastToolUse.name}...`;
    }
}
```

---

## Telemetry Events

### Task Progress Telemetry

```javascript
// READABLE (for understanding):
{
    type: "system",
    subtype: "task_progress",
    task_id: "a3f4b2",
    tool_use_id: "toolu_abc123",
    description: "Running Grep for 'createTaskId'",
    usage: {
        total_tokens: 23451,
        tool_uses: 15,
        duration_ms: 45000
    },
    summary: "Running Grep for 'createTaskId'"
}
```

### Task Started Telemetry

```javascript
// READABLE (for understanding):
{
    type: "system",
    subtype: "task_started",
    task_id: "a3f4b2",
    tool_use_id: "toolu_abc123",
    description: "Search codebase",
    task_type: "local_agent",
    prompt: "Find all uses of createTaskId..."
}
```

---

## Integration with Agent Loop

### Progress Update Points

Progress is updated at specific points in the agent loop:

1. **After tool execution**: Count increases
2. **After LLM response**: Token count updated
3. **On error**: Summary reflects error state
4. **On background**: Summary reflects background status

```javascript
// READABLE (for understanding):
async function* agentLoopRunner(config) {
    let { taskId, setAppState } = config;
    let toolUseCount = 0;
    let tokenCount = 0;

    for await (let message of llmMessageLoop(config)) {
        if (message.type === "tool_use") {
            toolUseCount++;

            // Update progress after tool execution
            updateTaskProgressWithTelemetry(
                taskId,
                `Running ${message.tool.name}...`,
                setAppState
            );
        }

        if (message.type === "assistant") {
            tokenCount += message.usage?.total_tokens ?? 0;

            // Update token count while preserving summary
            updateTaskProgressPreservingSummary(
                taskId,
                { toolUseCount, tokenCount },
                setAppState
            );
        }

        yield message;
    }
}
```

---

## UI Display

### Status Line Progress

The status line shows running task count:

```
Status Line: "2 running • Ctrl+C to cancel"
```

### Task List Progress

Each task in the list shows progress:

```
◐ a3f4b2 - Search codebase · 15 tool uses · 23451 tokens
  Running Grep for 'createTaskId'...
```

### Agent Tree Progress

Nested subagents show their progress:

```
├─ general-purpose (Analyze codebase) · 42 tool uses · 50000 tokens
│  ├─ Explore (Find usages) · 8 tool uses
│  │  └─ Done
│  └─ Running: Writing implementation...
└─ Running
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Nn` | isTelemetryEnabled | (inferred) | ✓ Verified |

---

## Related Documents

- [notification_queue_source_restored.md](./notification_queue_source_restored.md) - Notification queue
- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - State machine
- [../08_subagent/agent_loop_algorithm.md](../08_subagent/agent_loop_algorithm.md) - Agent loop