# Background Agents — System Reminder Integration (Claude Code 2.1.76)

> Analysis of how background tasks integrate with the system reminder system: `task_status` and
> `task_progress` reminder types, frequency throttling, and attachment generation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getTaskStatusAttachments` (suY) - Main producer for task-related system reminders — `chunks.147.mjs:1033`
- `getUnretrievedTaskStatuses` (Nqq) - Gets unnotified terminal task statuses — `chunks.147.mjs:1923`
- `pollTaskOutputs` (wY4) - Polls task output files for attachments — `chunks.90.mjs:3058`
- `wrapAttachment` (f4) - Wraps attachment with metadata — `chunks.147.mjs:942`
- `ghY` (TURNS_BETWEEN_PROGRESS) - Frequency throttle: show progress every 3 turns — `chunks.142.mjs:2863`
- `readOutputFileDelta` (WjA) - Reads new content from output file — `chunks.89.mjs:276`
- `truncateTaskOutput` (Ng1) - Truncates large output for reminders — `chunks.139.mjs:1664`
- `getKillHandlerForType` (Vg1) - Gets progress message generator — `chunks.142.mjs:1652`

> **CORRECTION (2026-03-26):** Previous versions incorrectly mapped `vIY`, `di4`, `TIY` to task attachment functions.
> Correct symbols are `suY`, `Nqq`, `wY4`, `f4`. See symbol_index files for details.

---

## Overview

Background tasks integrate with Claude Code's system reminder system through two specialized reminder types:

1. **`task_status`** - Notifies when a task changes state (completed, failed, killed)
2. **`task_progress`** - Shows incremental progress from running tasks

These reminders appear as attachments in the conversation, keeping the user informed without blocking the main conversation flow.

---

## Deep Analysis: Reminder Types

### task_status Type

**What it does:** Injects a system reminder when a background task completes, fails, or is killed.

**Structure:**
```javascript
{
    type: "task_status",
    taskId: string,      // e.g., "a3f4b2"
    taskType: string,    // "local_agent" | "local_bash" | "remote_agent" | "in_process_teammate"
    status: string,      // "completed" | "failed" | "killed"
    description: string, // Human-readable task description
    deltaSummary: string // New output since last notification
}
```

**When generated:**
- Task status changes from "running" to "completed"
- Task status changes from "running" to "failed"
- Task status changes from "running" to "killed"
- Task was not already notified (`notified: false`)

```javascript
// ============================================
// buildTaskAttachments - Task status generation
// Location: chunks.142.mjs:1738-1758
// ============================================

// ORIGINAL (for source lookup):
if (w.status !== "running" && w.status !== "pending" && !w.notified) {
    let $ = WjA(w.id, w.outputOffset);
    if ($.content) {
        let {
            content: O
        } = Ng1($.content, w.id);
        H = O
    }
    q.push({
        type: "task_status",
        taskId: w.id,
        taskType: w.type,
        status: w.status,
        description: w.description,
        deltaSummary: H
    }), Y[w.id] = {
        ...Y[w.id] ?? w,
        notified: !0,
        outputOffset: $.newOffset
    }
}

// READABLE (for understanding):
if (task.status !== "running" && task.status !== "pending" && !task.notified) {
    let delta = readOutputFileDelta(task.id, task.outputOffset);
    let deltaSummary = null;
    if (delta.content) {
        let { content } = truncateTaskOutput(delta.content, task.id);
        deltaSummary = content;
    }

    statusAttachments.push({
        type: "task_status",
        taskId: task.id,
        taskType: task.type,
        status: task.status,
        description: task.description,
        deltaSummary: deltaSummary
    });

    updatedTasks[task.id] = {
        ...(updatedTasks[task.id] ?? task),
        notified: true,
        outputOffset: delta.newOffset
    };
}

// Mapping: w→task, q→statusAttachments, Y→updatedTasks, WjA→readOutputFileDelta,
//   Ng1→truncateTaskOutput, H→deltaSummary
```

**Why this approach:**
- **Delta-based** summary shows only new content since last notification
- **Atomic notified flag** prevents duplicate status notifications
- **Non-blocking** - status changes are detected during reminder generation, not pushed synchronously

### task_progress Type

**What it does:** Shows real-time progress from running background tasks without interrupting the conversation.

**Structure:**
```javascript
{
    type: "task_progress",
    taskId: string,   // e.g., "a3f4b2"
    taskType: string, // "local_agent" | "local_bash" | "remote_agent"
    message: string   // Progress message from kill handler
}
```

**When generated:**
- Task status is "running"
- Kill handler provides a `getProgressMessage()` method
- Frequency throttle is satisfied (3 turns since last progress)

```javascript
// ============================================
// buildTaskAttachments - Task progress generation
// Location: chunks.142.mjs:1719-1736
// ============================================

// ORIGINAL (for source lookup):
if (w.status === "running") {
    let $ = WjA(w.id, w.outputOffset);
    if ($.content) {
        let {
            content: J
        } = Ng1($.content, w.id);
        H = J, Y[w.id] = {
            ...w,
            outputOffset: $.newOffset
        }
    }
    let _ = Vg1(w.type)?.getProgressMessage(w) ?? null;
    if (_) K.push({
        type: "task_progress",
        taskId: w.id,
        taskType: w.type,
        message: _
    })
}

// READABLE (for understanding):
if (task.status === "running") {
    // Update output offset for next read
    let delta = readOutputFileDelta(task.id, task.outputOffset);
    if (delta.content) {
        let { content } = truncateTaskOutput(delta.content, task.id);
        deltaSummary = content;
        updatedTasks[task.id] = {
            ...task,
            outputOffset: delta.newOffset
        };
    }

    // Get progress message from kill handler
    let progressMessage = getKillHandlerForType(task.type)?.getProgressMessage(task) ?? null;
    if (progressMessage) {
        progressAttachments.push({
            type: "task_progress",
            taskId: task.id,
            taskType: task.type,
            message: progressMessage
        });
    }
}

// Mapping: w→task, K→progressAttachments, Vg1→getKillHandlerForType,
//   WjA→readOutputFileDelta, Ng1→truncateTaskOutput
```

**Key insight:** The `getProgressMessage()` method is defined on each kill handler, allowing task-type-specific progress messages. For example, bash tasks might show "Running npm install...", while agent tasks might show "Exploring codebase...".

---

## Deep Analysis: Frequency Throttling

### TURNS_BETWEEN_PROGRESS Constant

**What it does:** Limits how often `task_progress` reminders appear, preventing noise from long-running tasks.

```javascript
// ============================================
// TURNS_BETWEEN_PROGRESS - Frequency throttle constant
// Location: chunks.142.mjs:2863
// ============================================

// ORIGINAL (for source lookup):
ghY = 3

// READABLE (for understanding):
const TURNS_BETWEEN_PROGRESS = 3;

// Mapping: ghY→TURNS_BETWEEN_PROGRESS
```

**Why 3 turns:** This balances keeping users informed with not overwhelming the conversation. At 3 turns, a user working on other tasks will see progress updates every few interactions.

### Turn Counting Algorithm

**What it does:** Counts how many assistant messages have occurred since the last progress reminder for each task.

```javascript
// ============================================
// countTurnsSinceLastProgress - Progress frequency calculator
// Location: chunks.142.mjs:2703-2717
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = new Map;
    if (!A || A.length === 0) return q;
    let K = new Set,
        Y = 0;
    for (let z = A.length - 1; z >= 0; z--) {
        let w = A[z];
        if (w?.type === "assistant" && !bg1(w)) Y++;
        else if (w?.type === "attachment" && w.attachment.type === "task_progress") {
            let H = w.attachment.taskId;
            if (!K.has(H)) q.set(H, Y), K.add(H)
        }
    }
    return q
}

// READABLE (for understanding):
function countTurnsSinceLastProgress(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    if (!messages || messages.length === 0) return turnsSinceProgress;

    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate backwards from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" && message.attachment.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }
    return turnsSinceProgress;
}

// Mapping: TIY→countTurnsSinceLastProgress, A→messages, q→turnsSinceProgress,
//   K→seenTasks, Y→turnCount, bg1→isWhitespaceOnly
```

**How it works:**
1. Iterate backwards through conversation history
2. Count assistant turns (non-whitespace messages)
3. When a `task_progress` attachment is found, record the turn count
4. First occurrence for each taskId = turns since last progress

**Why iterate backwards:** This finds the most recent progress reminder efficiently without scanning the entire history forward.

### Throttle Application

**What it does:** Filters progress attachments based on turn count threshold.

```javascript
// ============================================
// getUnifiedTasksAttachment - Progress throttle application
// Location: chunks.142.mjs:2719-2756
// ============================================

// ORIGINAL (for source lookup):
async function vIY(A, q) {
    let K = await A.getAppState(),
        {
            attachments: Y,
            progressAttachments: z,
            updatedTasks: w
        } = di4(K),
        H = TIY(q),
        $ = z.filter((J) => {
            return (H.get(J.taskId) ?? 1 / 0) >= ghY
        });
    for (let J of $) {
        let X = w[J.taskId] ?? K.tasks?.[J.taskId];
        if (X) w[J.taskId] = pi4(X)
    }
    // ... state update ...
    let O = Y.map((J) => ({
            type: "task_status",
            taskId: J.taskId,
            taskType: J.taskType,
            status: J.status,
            description: J.description,
            deltaSummary: J.deltaSummary
        })),
        _ = $.map((J) => ({
            type: "task_progress",
            taskId: J.taskId,
            taskType: J.taskType,
            message: J.message
        }));
    return [...O, ..._]
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext, messages) {
    let appState = await toolUseContext.getAppState();

    // Build all task attachments
    let { attachments, progressAttachments, updatedTasks } = buildTaskAttachments(appState);

    // Apply frequency throttle
    let turnsSinceLastProgress = countTurnsSinceLastProgress(messages);

    let throttledProgress = progressAttachments.filter((progress) => {
        let turns = turnsSinceLastProgress.get(progress.taskId) ?? Infinity;
        return turns >= TURNS_BETWEEN_PROGRESS;  // >= 3
    });

    // Update state for tasks with new progress
    for (let progress of throttledProgress) {
        let task = updatedTasks[progress.taskId] ?? appState.tasks?.[progress.taskId];
        if (task) {
            updatedTasks[progress.taskId] = resetProgressState(task);
        }
    }

    // Persist state updates
    if (Object.keys(updatedTasks).length > 0) {
        toolUseContext.setAppState((state) => ({
            ...state,
            tasks: { ...state.tasks, ...updatedTasks }
        }));
    }

    // Map to attachment format
    let statusAttachments = attachments.map((a) => ({
        type: "task_status",
        taskId: a.taskId,
        taskType: a.taskType,
        status: a.status,
        description: a.description,
        deltaSummary: a.deltaSummary
    }));

    let progressAttachmentsFiltered = throttledProgress.map((p) => ({
        type: "task_progress",
        taskId: p.taskId,
        taskType: p.taskType,
        message: p.message
    }));

    return [...statusAttachments, ...progressAttachmentsFiltered];
}

// Mapping: vIY→getUnifiedTasksAttachment, di4→buildTaskAttachments, TIY→countTurnsSinceLastProgress,
//   ghY→TURNS_BETWEEN_PROGRESS, pi4→resetProgressState
```

**Key insight:** Tasks with `Infinity` turns (never seen in history) always get progress shown on first check. This ensures new tasks are immediately visible.

---

## Deep Analysis: buildTaskAttachments Function

**What it does:** Core function that scans all tasks and generates status/progress attachments.

```javascript
// ============================================
// buildTaskAttachments - Core attachment generator
// Location: chunks.142.mjs:1711-1762
// ============================================

// ORIGINAL (for source lookup):
function di4(A) {
    let q = [],
        K = [],
        Y = {},
        z = A.tasks ?? {};
    for (let w of Object.values(z)) {
        if (w.notified && w.status !== "running") continue;
        let H = null;
        if (w.status === "running") {
            let $ = WjA(w.id, w.outputOffset);
            if ($.content) {
                let {
                    content: J
                } = Ng1($.content, w.id);
                H = J, Y[w.id] = {
                    ...w,
                    outputOffset: $.newOffset
                }
            }
            let _ = Vg1(w.type)?.getProgressMessage(w) ?? null;
            if (_) K.push({
                type: "task_progress",
                taskId: w.id,
                taskType: w.type,
                message: _
            })
        }
        if (w.status !== "running" && w.status !== "pending" && !w.notified) {
            let $ = WjA(w.id, w.outputOffset);
            if ($.content) {
                let {
                    content: O
                } = Ng1($.content, w.id);
                H = O
            }
            q.push({
                type: "task_status",
                taskId: w.id,
                taskType: w.type,
                status: w.status,
                description: w.description,
                deltaSummary: H
            }), Y[w.id] = {
                ...Y[w.id] ?? w,
                notified: !0,
                outputOffset: $.newOffset
            }
        }
    }
    return {
        attachments: q,
        progressAttachments: K,
        updatedTasks: Y
    }
}

// READABLE (for understanding):
function buildTaskAttachments(appState) {
    let statusAttachments = [];
    let progressAttachments = [];
    let updatedTasks = {};
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // Skip already-notified completed tasks
        if (task.notified && task.status !== "running") continue;

        let deltaSummary = null;

        // RUNNING TASKS: Generate progress
        if (task.status === "running") {
            let delta = readOutputFileDelta(task.id, task.outputOffset);
            if (delta.content) {
                let { content } = truncateTaskOutput(delta.content, task.id);
                deltaSummary = content;
                updatedTasks[task.id] = {
                    ...task,
                    outputOffset: delta.newOffset
                };
            }

            let progressMessage = getKillHandlerForType(task.type)?.getProgressMessage(task) ?? null;
            if (progressMessage) {
                progressAttachments.push({
                    type: "task_progress",
                    taskId: task.id,
                    taskType: task.type,
                    message: progressMessage
                });
            }
        }

        // COMPLETED/FAILED/KILLED TASKS: Generate status change
        if (task.status !== "running" && task.status !== "pending" && !task.notified) {
            let delta = readOutputFileDelta(task.id, task.outputOffset);
            if (delta.content) {
                let { content } = truncateTaskOutput(delta.content, task.id);
                deltaSummary = content;
            }

            statusAttachments.push({
                type: "task_status",
                taskId: task.id,
                taskType: task.type,
                status: task.status,
                description: task.description,
                deltaSummary: deltaSummary
            });

            updatedTasks[task.id] = {
                ...(updatedTasks[task.id] ?? task),
                notified: true,
                outputOffset: delta.newOffset
            };
        }
    }

    return {
        attachments: statusAttachments,
        progressAttachments,
        updatedTasks
    };
}

// Mapping: di4→buildTaskAttachments, A→appState, q→statusAttachments, K→progressAttachments,
//   Y→updatedTasks, WjA→readOutputFileDelta, Ng1→truncateTaskOutput, Vg1→getKillHandlerForType
```

**Why this approach:**
- **Single pass** over all tasks is efficient
- **Delta-based reads** only fetch new content since last check
- **State coalescing** - multiple updates to the same task are merged
- **Separate collections** - status and progress attachments are returned separately for independent throttling

---

## Progress Message Sources

### Kill Handler getProgressMessage

Each task type's kill handler can optionally provide a `getProgressMessage()` method:

```javascript
// ============================================
// getKillHandlerForType - Kill handler lookup
// Location: chunks.142.mjs:1652
// ============================================

// ORIGINAL (for source lookup):
function Vg1(A) {
    return IhY().get(A)
}

// READABLE (for understanding):
function getKillHandlerForType(taskType) {
    return getAllKillHandlers().get(taskType);
}

// Mapping: Vg1→getKillHandlerForType, IhY→getAllKillHandlers
```

**Example progress messages by task type:**

| Task Type | Handler | Example Progress Message |
|-----------|---------|--------------------------|
| `local_bash` | LocalBashTaskHandler | "Running npm install..." |
| `local_agent` | LocalAgentTaskHandler | "Exploring codebase..." |
| `remote_agent` | RemoteAgentTaskHandler | "Processing on remote..." |
| `in_process_teammate` | TeammateHandler | "Collaborating on task..." |

---

## Integration with Message Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Agent Loop Iteration                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              getUnifiedTasksAttachment (vIY)                    │
│                                                                 │
│  1. Get current appState.tasks                                 │
│  2. Call buildTaskAttachments(di4)                             │
│     - For each task:                                           │
│       - If running: generate task_progress                     │
│       - If completed/failed/killed: generate task_status       │
│  3. Apply frequency throttle (3 turns)                         │
│  4. Update task state (outputOffset, notified)                 │
│  5. Return attachments                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              System Reminder Injection                          │
│                                                                 │
│  Attachments are added as system-reminder messages:            │
│                                                                 │
│  {                                                              │
│    type: "attachment",                                          │
│    attachment: {                                                │
│      type: "task_status" | "task_progress",                    │
│      taskId: "a3f4b2",                                         │
│      ...                                                        │
│    }                                                            │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LLM Processing                               │
│                                                                 │
│  LLM sees task status/progress in conversation context         │
│  and can take appropriate action (check output, stop task)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Two reminder types | Status changes need immediate notification; progress can be throttled |
| Delta-based output | Only show new content, not full output |
| 3-turn throttle | Balance between informative and noisy |
| Backward iteration | Efficient finding of last progress per task |
| Infinity default | New tasks always get initial progress shown |
| Kill handler for progress | Task-type-specific messages without tight coupling |
| Atomic notified flag | Prevent duplicate status notifications |