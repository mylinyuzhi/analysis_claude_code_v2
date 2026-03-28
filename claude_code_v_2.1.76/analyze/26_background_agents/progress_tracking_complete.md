# Progress Tracking Complete - Background Agents (Claude Code 2.1.76)

> Complete source-level documentation of the progress tracking system for background agents including telemetry, throttling, and system reminder integration with verified symbol mappings.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `TV1` - updateTaskProgressPreservingSummary — `chunks.146.mjs:2045`
- `TIY` - countUniqueUris — `chunks.144.mjs:832` (Corrected v6: was incorrectly mapped as countTurnsSinceLastProgress; source proof shows it counts unique URIs)
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`

---

## Progress Tracking Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS TRACKING ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │       Background Agent Loop         │
                    │           (qh)                      │
                    └────────────────┬────────────────────┘
                                     │
                                     │ Each turn
                                     ▼
                    ┌─────────────────────────────────────┐
                    │   updateTaskProgressWithTelemetry   │
                    │           (nl4)                     │
                    │                                     │
                    │  • Update toolUseCount              │
                    │  • Update tokenCount                │
                    │  • Set progress.summary             │
                    │  • Send telemetry event             │
                    └────────────────┬────────────────────┘
                                     │
                                     │ Parent session
                                     ▼
                    ┌─────────────────────────────────────┐
                    │  countUniqueUris (TIY)              │
                    │  [Corrected: counts unique URIs,    │
                    │   not turns since last progress]    │
                    │  • Count unique URIs in items       │
                    └────────────────┬────────────────────┘
                                     │
                                     │ Throttling check
                                     ▼
                    ┌─────────────────────────────────────┐
                    │   getUnifiedTasksAttachment (suY)   │
                    │                                     │
                    │  • Poll output files                │
                    │  • Build task_status attachments    │
                    │  • Build task_progress attachments  │
                    └────────────────┬────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────────┐
                    │      System Reminder Injection      │
                    │                                     │
                    │  <task_status>                      │
                    │  <task_progress>                    │
                    │  <task_reminder>                    │
                    └─────────────────────────────────────┘
```

---

## Core Progress Functions

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates task progress with token count, tool use count, and summary, then sends telemetry.

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
    let progressData = null;

    // Atomic update of task progress
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture current progress for telemetry
        progressData = {
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
    if (progressData && isTelemetryEnabled()) {
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: progressData.toolUseId,
            description: summary,
            usage: {
                total_tokens: progressData.tokenCount,
                tool_uses: progressData.toolUseCount,
                duration_ms: Date.now() - progressData.startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
//          i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### updateTaskProgressPreservingSummary (TV1)

**What it does:** Updates progress fields while preserving the existing summary.

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
        if (task.status !== "running") return task;

        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? {
                    ...newProgress,
                    summary: existingSummary  // Preserve summary
                }
                : newProgress
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→newProgress, K→setAppState
```

**Why preserve summary:**
- Summary is user-facing text like "Running Grep for 'taskId'..."
- Should persist across token count updates
- Avoids overwriting meaningful text with stale data

---

## Progress Throttling

### countUniqueUris (TIY)

> **Correction (v6):** TIY was previously mapped as `countTurnsSinceLastProgress`. Source code proof: `function TIY(A) { let q = A.map((K) => K.uri).filter((K) => K); return new Set(q).size }` — it counts unique URIs, not turns since last progress.

**What it does:** Counts the number of unique URIs in an array of objects.

```javascript
// ============================================
// TIY - countUniqueUris - Count unique URIs in array
// Location: chunks.144.mjs:832
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) { let q = A.map((K) => K.uri).filter((K) => K); return new Set(q).size }

// READABLE (for understanding):
function countUniqueUris(items) {
    let uris = items.map((item) => item.uri).filter((uri) => uri);
    return new Set(uris).size;
}

// Mapping: TIY→countUniqueUris, A→items, K→item/uri, q→uris
```

### Throttling Logic

```javascript
// Determine if progress should be included in this turn
// Location: chunks.147.mjs (inferred)

function shouldIncludeProgress(messages, task) {
    // Note: The turn-counting throttle logic is separate from TIY (countUniqueUris).
    // The actual throttle function counts turns since last progress attachment.
    let turnsSinceProgress = countTurnsSinceLastProgressAttachment(messages);

    // Always include for new tasks (no progress yet)
    if (turnsSinceProgress === Infinity || !task.progressNotified) {
        return true;
    }

    // Throttle to every 3 turns
    return turnsSinceProgress >= 3;
}
```

### Why Throttle Progress?

1. **Token efficiency** - Avoids redundant context in every message
2. **Noise reduction** - LLM doesn't need per-turn updates
3. **Focus preservation** - Keeps attention on actual work
4. **Critical updates** - Still get immediate notifications for completion/failure

---

## System Reminder Integration

### Task Attachment Types

```xml
<!-- task_progress: Running task status -->
<system-reminder>
<task_progress>
    <task_id>ab3k7m9p2</task_id>
    <task_type>local_agent</task_type>
    <message>Running Grep for "createTaskId" in 5 files...</message>
</task_progress>
</system-reminder>

<!-- task_status: Terminal task status -->
<system-reminder>
<task_status>
    <task_id>ab3k7m9p2</task_id>
    <task_type>local_agent</task_type>
    <status>completed</status>
    <description>Find createTaskId usages</description>
    <delta_summary>Found 15 usages in 8 files...</delta_summary>
</task_status>
</system-reminder>

<!-- task_reminder: Pending tasks reminder -->
<system-reminder>
<task_reminder>
    <content>
    - Find API usages (running)
    - Write implementation (pending)
    </content>
    <item_count>2</item_count>
</task_reminder>
</system-reminder>
```

### getUnifiedTasksAttachment (suY)

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task attachments
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
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
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext) {
    let appState = toolUseContext.getAppState();

    // Poll all task output files
    let { attachments, updatedTaskOffsets, evictedTaskIds } = await pollTaskOutputs(appState);

    // Update task state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Map to attachment format for LLM context
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, wY4→pollTaskOutputs, OY4→updateTaskState
```

---

## Progress Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS DATA FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Execution
        │
        │ Each turn
        ▼
┌─────────────────────────────────────┐
│ Agent accumulates:                   │
│ • toolUseCount                       │
│ • tokenCount                         │
│ • summary (from tool results)        │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ updateTaskProgressWithTelemetry     │
│ (nl4)                               │
│                                     │
│ 1. Atomic state update              │
│ 2. Capture for telemetry            │
│ 3. Send telemetry event             │
└────────────────┬────────────────────┘
                 │
                 │ State updated
                 ▼
┌─────────────────────────────────────┐
│ Task Record:                         │
│ {                                    │
│   progress: {                        │
│     toolUseCount: 15,                │
│     tokenCount: 23451,               │
│     summary: "Running Grep..."       │
│   }                                  │
│ }                                    │
└────────────────┬────────────────────┘
                 │
                 │ Parent session polls
                 ▼
┌─────────────────────────────────────┐
│ pollTaskOutputs (wY4)               │
│                                     │
│ • Read output file delta            │
│ • Check throttling                  │
│ • Build attachments                 │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Throttle Check:                      │
│ [Note: TIY is countUniqueUris, not │
│  the throttle function itself]       │
│                                     │
│ turnsSinceProgress >= 3?            │
│                                     │
│ If yes: Include in attachments      │
│ If no: Skip (throttled)             │
│                                     │
│ Exception: Always include first     │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ getUnifiedTasksAttachment (suY)     │
│                                     │
│ • Map to attachment format          │
│ • Update state offsets              │
│ • Evict notified terminal tasks     │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ System Reminder Injection           │
│                                     │
│ <task_status> or <task_progress>    │
│                                     │
│ LLM receives context about tasks    │
└─────────────────────────────────────┘
```

---

## Telemetry Events

### Task Progress Telemetry

```javascript
{
    type: "system",
    subtype: "task_progress",
    task_id: "ab3k7m9p2",
    tool_use_id: "toolu_abc123",
    description: "Running Grep for 'createTaskId'...",
    usage: {
        total_tokens: 23451,
        tool_uses: 15,
        duration_ms: 45000
    },
    summary: "Running Grep for 'createTaskId'..."
}
```

### Task Completion Telemetry

```javascript
{
    type: "system",
    subtype: "task_status",
    task_id: "ab3k7m9p2",
    status: "completed",
    description: "Find createTaskId usages",
    usage: {
        total_tokens: 35000,
        tool_uses: 22,
        duration_ms: 65000
    }
}
```

---

## UI Display

### Status Line Indicator

```
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
│ └──────┘   └─────────────────────┘                              │
│   count        interactive hint                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Task List Display

```
┌──────────────────────────────────────────────────────────────────┐
│ Background Tasks                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ◐ Search codebase - Running Grep for "taskId" in 5 files...    │
│     [x: stop]                                                    │
│                                                                   │
│  ◐ Write implementation - Writing src/main.ts                    │
│     [x: stop]                                                    │
│                                                                   │
│  ✓ Find API endpoints - Done                                     │
│                                                                   │
│  ✗ Run tests - Failed: timeout                                   │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│ [x: stop] [f: foreground] [Esc: close]                          │
└──────────────────────────────────────────────────────────────────┘

Icon: ◐ (animated spinner) = running
Icon: ✓ = completed
Icon: ✗ = failed
Icon: ○ = killed/pending
```

---

## Verification Status

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✓ Verified |
| `TIY` | countUniqueUris | chunks.144.mjs:832 | ✓ Corrected (v6: was countTurnsSinceLastProgress, source proof shows URI counting) |
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |

---

## Related Documents

- [README.md](./README.md) - Module overview
- [task_lifecycle_complete_source.md](./task_lifecycle_complete_source.md) - Task lifecycle
- [kill_mechanism_complete.md](./kill_mechanism_complete.md) - Kill handling
- [../04_system_reminder/README.md](../04_system_reminder/README.md) - System reminders