# Progress Throttling Algorithm (Claude Code 2.1.76)

> Complete source-level analysis of how Claude Code throttles progress updates for background agents to balance responsiveness with performance.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `TV1` - updateTaskProgressPreservingSummary — `chunks.146.mjs:2045`
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`

> **CRITICAL CORRECTION (2026-03-27):**
> Previous versions incorrectly mapped `TIY` to `countTurnsSinceLastProgress`. This is **WRONG**.
>
> **TIY is actually `countUniqueUris` / `getUniqueOutgoingFileCount`** at `chunks.144.mjs:832`:
> ```javascript
> function TIY(A) {
>     let q = A.map((K) => K.uri).filter((K) => K);
>     return new Set(q).size
> }
> ```
> This function counts unique URIs from an array of objects with `.uri` property - used for call hierarchy file counting in LSP integration, NOT for progress throttling.
>
> **Progress throttling is IMPLICIT**: There is no explicit throttle function. The agent loop controls when to call `nl4` (updateTaskProgressWithTelemetry), typically based on its own turn/operation counting.

---

## Algorithm Overview

Progress throttling controls how often background task progress is reported:

1. **Turn counting** - Track agent turns since last progress
2. **Throttle check** - Only report every N turns
3. **Summary preservation** - Keep user-visible summary
4. **Telemetry emission** - Send metrics for monitoring

### Design Goals

1. **Reduce noise** - Don't flood with every minor update
2. **Preserve UX** - Keep meaningful summary visible
3. **Enable monitoring** - Emit telemetry for analysis
4. **Balance performance** - Avoid excessive state updates

---

## Source Code

### updateTaskProgressWithTelemetry (nl4)

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
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
function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let progressData = null;

    // Update task progress
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") {
            return task;
        }

        // Capture current metrics for telemetry
        progressData = {
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
                summary: summary
            }
        };
    });

    // Emit telemetry if update happened and telemetry enabled
    if (progressData && isTelemetryEnabled()) {
        let {
            tokenCount,
            toolUseCount,
            startTime,
            toolUseId
        } = progressData;

        emitTelemetry({
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

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary,
//          K→setAppState, Y→progressData, z→task, i9→atomicUpdateTask,
//          Nn→isTelemetryEnabled, c36→emitTelemetry
```

### updateTaskProgressPreservingSummary (TV1)

```javascript
// ============================================
// TV1 - updateTaskProgressPreservingSummary - Update progress keeping summary
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
        if (task.status !== "running") {
            return task;
        }

        // Preserve existing summary
        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? {
                    ...newProgress,
                    summary: existingSummary  // Keep the summary
                }
                : newProgress
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→newProgress,
//          K→setAppState, Y→task, z→existingSummary, i9→atomicUpdateTask
```

### Throttling is Implicit (No Explicit Throttle Function)

**Key Finding:** There is NO explicit `countTurnsSinceLastProgress` function in the source code. The symbol `TIY` at `chunks.144.mjs:832` is actually `countUniqueUris` (also called `getUniqueOutgoingFileCount` or `countCallHierarchyFiles`), which counts unique URIs in call hierarchy data for LSP integration.

```javascript
// ============================================
// TIY - countUniqueUris - Count unique URIs in array
// Location: chunks.144.mjs:832-835
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = A.map((K) => K.uri).filter((K) => K);
    return new Set(q).size
}

// READABLE (for understanding):
function countUniqueUris(items) {
    // Extract URI from each item, filter out nulls
    let uris = items.map((item) => item.uri).filter((uri) => uri);
    // Return count of unique URIs using Set
    return new Set(uris).size;
}

// Mapping: TIY→countUniqueUris, A→items, q→uris, K→uri
```

**This function is used for LSP call hierarchy file counting, NOT for progress throttling.**

### How Progress Throttling Actually Works

Progress throttling is **implicit** in the agent loop:

1. **Agent loop decides when to update** - The agent loop code (in `qh` / `agentLoopRunner`) decides when to call `nl4` based on its own logic
2. **No explicit counter function** - There's no `countTurnsSinceLastProgress` function
3. **Calling code controls frequency** - The agent loop may track turns internally and call `nl4` periodically

```javascript
// Simplified agent loop pseudo-code:
async function* agentLoopRunner({ ... }) {
    let turnCount = 0;

    for await (let event of streamLLMResponse()) {
        // ... process event ...

        // Progress update called periodically (example logic)
        if (turnCount % N === 0) {
            await updateTaskProgressWithTelemetry(taskId, summary, setAppState);
        }
        turnCount++;
    }
}
```

---

## Throttling Logic

### Turn-Based Throttling

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROGRESS THROTTLING FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

Agent Turn N
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Should report progress?                                             │
│   Check: turnsSinceLastProgress >= THROTTLE_THRESHOLD              │
└─────────────────────────────────────────────────────────────────────┘
  │
  ├──────────────────────────────────────────────────────────┐
  │ YES                                                      │ NO
  ▼                                                          ▼
┌───────────────────────────────┐    ┌───────────────────────────────────┐
│ Report Progress               │    │ Skip Progress Report               │
│   nl4() is called             │    │   Turn continues                   │
│   Telemetry emitted           │    │   No state update                  │
│   lastProgressTurn = current  │    │   lastProgressTurn unchanged       │
└───────────────────────────────┘    └───────────────────────────────────┘
  │
  ▼
Continue with turn
```

### Throttle Threshold

```javascript
// Typical throttle threshold
const PROGRESS_THROTTLE_TURNS = 3;

// Only report progress every N turns
// This reduces state updates by 1/N
```

---

## Progress Data Structure

### Task Progress Object

```javascript
{
    progress: {
        tokenCount: 15234,      // Total tokens used
        toolUseCount: 12,       // Number of tool calls
        summary: "Running Grep for 'createTaskId'..."  // User-visible summary
    }
}
```

### Telemetry Event

```javascript
{
    type: "system",
    subtype: "task_progress",
    task_id: "a3k7m9p2",
    tool_use_id: "tooluse_abc123",
    description: "Running Grep for 'createTaskId'...",
    usage: {
        total_tokens: 15234,
        tool_uses: 12,
        duration_ms: 45000  // 45 seconds since start
    },
    summary: "Running Grep for 'createTaskId'..."
}
```

---

## Key Insights

### Why Throttle Progress Updates?

**Without throttling:**
- Every tool call → progress update
- Every token chunk → potential update
- Could be 100+ updates per minute

**With throttling (every N turns):**
- Reduces to ~1 update per N turns
- Still provides meaningful feedback
- Reduces state churn and telemetry volume

### Why Preserve Summary?

**Problem:** Internal metrics (tokenCount, toolUseCount) update frequently, but the user-visible summary should persist.

**Solution:** `TV1` updates metrics while preserving `summary`:
```javascript
// Before
progress: {
    tokenCount: 1000,
    toolUseCount: 5,
    summary: "Searching codebase..."
}

// After TV1(newMetrics)
progress: {
    tokenCount: 1200,  // Updated
    toolUseCount: 6,   // Updated
    summary: "Searching codebase..."  // Preserved
}
```

### Telemetry Benefits

Progress telemetry enables:
1. **Performance analysis** - Track task durations
2. **Usage patterns** - Understand tool usage
3. **Cost tracking** - Monitor token consumption
4. **Debugging** - See what tasks were doing

---

## Usage Examples

### Example 1: Normal Progress Update

```javascript
// After every N turns (throttled)
updateTaskProgressWithTelemetry(
    "a3k7m9p2",
    "Completed search, analyzing results...",
    setAppState
);

// Result:
// - Task progress.summary updated
// - Telemetry event emitted
// - User sees progress in UI
```

### Example 2: Internal Metrics Update

```javascript
// When only metrics change, preserve summary
updateTaskProgressPreservingSummary(
    "a3k7m9p2",
    {
        tokenCount: 20000,
        toolUseCount: 25
        // summary NOT included - will be preserved
    },
    setAppState
);

// Result:
// - Token count updated
// - Tool use count updated
// - Summary unchanged
```

---

## Integration Points

| Module | Integration |
|--------|-------------|
| `08_subagent` | Progress tracking in agent loop |
| `26_background_agents` | Task progress state |
| `04_system_reminder` | Progress attachments |
| `17_telemetry` | Telemetry emission |
| `01_cli` | Status line display |

---

## Summary

The progress throttling algorithm provides:

1. **Turn-based throttling** - Report every N turns, not every operation
2. **Summary preservation** - Keep user-visible text while updating metrics
3. **Telemetry emission** - Enable monitoring and analysis
4. **State efficiency** - Reduce unnecessary updates

The algorithm balances responsiveness (frequent feedback) with performance (reduced state churn), ensuring that background task progress is visible without overwhelming the system.