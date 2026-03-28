# Progress Tracking Algorithm (Claude Code 2.1.76)

> Deep analysis of how background agents track and report progress to the main session.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `updateTaskProgressWithTelemetry` (nl4) — chunks.146.mjs:2059 ✓
- `updateTaskProgressPreservingSummary` (TV1) — chunks.146.mjs:2045 ✓
- `atomicUpdateTask` (i9) — chunks.90.mjs:3003 ✓
- `countUniqueUris` (TIY) — chunks.144.mjs:832 (counts unique URIs for LSP, NOT progress throttling)
- The progress throttling turn-counting logic is an unnamed inline algorithm in `getUnifiedTasksAttachment` (vIY) at chunks.142.mjs:2703-2717

---

## Overview

Background agents continuously report their progress back to the main session. This progress is used for:

1. **Status line display** - Show running tasks with current activity
2. **System reminders** - Inject `task_progress` attachments into context
3. **Telemetry** - Track usage patterns and performance
4. **User feedback** - Show activity in task list UI

---

## Progress Data Structure

### Task Progress Object

```typescript
interface TaskProgress {
    toolUseCount: number;      // Total tool invocations
    tokenCount: number;        // Total tokens used
    summary: string;           // Human-readable status
    lastActivity: number;      // Timestamp of last activity
    recentActivities: string[]; // Recent action descriptions
}
```

### Task Record with Progress

```javascript
{
    id: "a3f9c2x7",
    type: "local_agent",
    status: "running",
    progress: {
        toolUseCount: 5,
        tokenCount: 1234,
        summary: "Running Grep for 'createTaskId'...",
        lastActivity: 1711474800000,
        recentActivities: [
            "Read: chunks.41.mjs",
            "Grep: createTaskId",
            "Grep: oV function"
        ]
    },
    lastReportedToolCount: 4,   // For delta detection
    lastReportedTokenCount: 1000
}
```

---

## Core Functions

### updateTaskProgressWithTelemetry (nl4)

**Location:** chunks.146.mjs:2059-2097

**What it does:** Updates task progress state and optionally sends telemetry events.

**How it works:**

```javascript
// ============================================
// updateTaskProgressWithTelemetry - Update progress with telemetry
// Location: chunks.146.mjs:2059-2097
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
function updateTaskProgressWithTelemetry(taskId, summaryText, setAppState) {
    let previousProgress = null;

    // Step 1: Atomically update the task state
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

        // Return updated task
        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summaryText
            }
        };
    });

    // Step 2: Send telemetry if enabled and task was updated
    if (previousProgress && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = previousProgress;

        sendTelemetryEvent({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summaryText,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summaryText
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summaryText, K→setAppState
// i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetryEvent
```

### updateTaskProgressPreservingSummary (TV1)

**Location:** chunks.146.mjs:2045-2057

**What it does:** Updates progress fields while preserving the existing summary text.

**When to use:**
- When tool count/token count changed but summary should not be overwritten
- During streaming updates where only metrics matter
- When summary is set by a different code path

```javascript
// ============================================
// updateTaskProgressPreservingSummary - Update progress preserving summary
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

        // Preserve existing summary if present
        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? { ...newProgress, summary: existingSummary }
                : newProgress
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→newProgress, K→setAppState
```

---

## Progress Update Flow

### In the Agent Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    agentLoopRunner (qh)                                      │
│                    chunks.133.mjs:1565                                       │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ For each yielded message:
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Progress Update (inside async generator)                        │
│                                                                              │
│  for await (let message of llmLoop(...)) {                                  │
│      // Update progress after each message                                   │
│      TV1(agentId, getCurrentProgress(), setAppState);                       │
│      yield message;                                                          │
│  }                                                                           │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ Progress state now updated
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              UI Updates (via React state)                                    │
│                                                                              │
│  • Status line shows task count                                              │
│  • Task list shows progress summary                                          │
│  • Tool use count updates                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Before System Reminder Injection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              Main Agent Loop - Before LLM Call                               │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              getUnifiedTasksAttachment (vIY)                                 │
│                                                                              │
│  1. Get all tasks from appState.tasks                                       │
│  2. For running tasks:                                                      │
│     a. Check throttle (progress turn-counting, inline in vIY)                        │
│     b. If throttle satisfied, build task_progress attachment               │
│  3. For completed/failed/killed:                                            │
│     a. Build task_status attachment if not notified                         │
│  4. Return attachments array                                                 │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Attachment Injection                                            │
│                                                                              │
│  <system-reminder>                                                          │
│  <task_progress>                                                            │
│    <task_id>a3f9c2x7</task_id>                                              │
│    <task_type>local_agent</task_type>                                       │
│    <message>Running Grep for 'createTaskId'...</message>                   │
│  </task_progress>                                                           │
│  </system-reminder>                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Progress Throttling

### Why Throttle?

Without throttling, every LLM turn would include progress attachments for all running tasks. This would:

1. **Bloat context** - Unnecessary tokens in every request
2. **Create noise** - Same information repeated too frequently
3. **Slow API calls** - More data to process

### Throttle Mechanism

**Threshold:** 3 assistant turns since last progress reminder

```javascript
// ============================================
// Progress turn-counting algorithm (inline in vIY, NOT TIY)
// TIY is countUniqueUris (LSP URI counting), not progress throttling
// Location: chunks.142.mjs:2703-2717
// ============================================

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

    // Tasks not yet seen get Infinity (first progress always shown)
    return turnsSinceProgress;
}
```

### Throttle Decision Logic

```javascript
// In getUnifiedTasksAttachment
let turnsSinceProgress = countTurnsSinceLastProgressInline(messages);

for (let task of runningTasks) {
    let turns = turnsSinceProgress.get(task.id) ?? Infinity;

    // Only include progress if >= 3 turns since last
    if (turns >= 3) {
        attachments.push({
            type: "task_progress",
            taskId: task.id,
            taskType: task.type,
            message: task.progress?.summary ?? "Running..."
        });
    }
}
```

### Throttle Visualization

```
Turn 1: Agent runs, task_progress shown for task A (turnsSince=∞)
Turn 2: Agent runs, task_progress skipped for task A (turnsSince=1)
Turn 3: Agent runs, task_progress skipped for task A (turnsSince=2)
Turn 4: Agent runs, task_progress shown for task A (turnsSince=3)
Turn 5: Agent runs, task_progress skipped for task A (turnsSince=1)
...
```

---

## Telemetry Integration

### Telemetry Event Structure

When telemetry is enabled, progress updates generate events:

```javascript
{
    type: "system",
    subtype: "task_progress",
    task_id: "a3f9c2x7",
    tool_use_id: "toolu_abc123",
    description: "Running Grep for 'createTaskId'...",
    usage: {
        total_tokens: 1234,
        tool_uses: 5,
        duration_ms: 45000
    },
    summary: "Running Grep for 'createTaskId'..."
}
```

### When Telemetry is Sent

Telemetry is sent when:
1. `isTelemetryEnabled()` returns true (user consent)
2. Task was successfully updated (was running)
3. Progress values were captured

### Telemetry Uses

1. **Performance monitoring** - Track agent efficiency
2. **Usage analytics** - Understand how agents are used
3. **Error detection** - Identify stuck or slow tasks
4. **Product improvement** - Guide optimization efforts

---

## State Update Pattern

### atomicUpdateTask (i9)

**Location:** chunks.90.mjs:3003-3017

**What it does:** Safely updates task state using the React state setter pattern.

```javascript
// ============================================
// atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3017
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        return _ === z ? Y : {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: _
            }
        }
    })
}

// READABLE (for understanding):
function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        // Get the task, return unchanged if not found
        let task = state.tasks?.[taskId];
        if (!task) return state;

        // Apply the updater function
        let updatedTask = updater(task);

        // If updater returned same object, no change
        if (updatedTask === task) return state;

        // Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater
```

### Key Insight: Immutable Updates

The pattern uses immutable state updates:

1. **Reference equality check** - `updatedTask === task` prevents unnecessary re-renders
2. **Spread operator** - Creates new objects for React change detection
3. **Single source of truth** - All updates go through `setAppState`

---

## UI Integration

### Status Line Display

```javascript
// In status line component
let runningTasks = Object.values(appState.tasks)
    .filter(t => t.status === "running");

let statusText = runningTasks.length > 0
    ? `${runningTasks.length} running • Ctrl+C to cancel`
    : "Ready";
```

### Task List Row

```javascript
// In task list row component
<TaskRow>
    <StatusIcon status={task.status} />
    <Description>{task.description}</Description>
    <Progress>
        {task.progress?.toolUseCount ?? 0} tool uses •
        {task.progress?.tokenCount ?? 0} tokens
    </Progress>
    <Summary>{task.progress?.summary}</Summary>
</TaskRow>
```

### Progress Badge

```javascript
// Tree-style progress display
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...
└─ Running
```

---

## Design Rationale

### Why Separate Summary from Progress?

1. **Granularity** - Summary can be updated independently
2. **Preservation** - Some updates keep existing summary
3. **Telemetry** - Summary is the human-readable part sent to analytics

### Why Throttle at 3 Turns?

1. **Balance** - Informs without spamming
2. **Context efficiency** - Saves tokens
3. **User patience** - Matches attention span

### Why Backward Iteration for Throttle?

1. **Efficiency** - Stops at first progress found
2. **Accuracy** - Counts actual turns, not estimated
3. **Correctness** - Handles interleaved progress from different tasks

### Why Atomic Updates?

1. **Race conditions** - Multiple updates can happen concurrently
2. **React integration** - Works with state management
3. **Predictability** - Single source of truth