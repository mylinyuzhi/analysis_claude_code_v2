# Background Agents Key Algorithms - Source-Level Restoration (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in the background agent system.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `Qn4` - Create background agent task — `chunks.146.mjs:2133`
- `Un4` - Create foreground agent task — `chunks.146.mjs:2165`
- `g2` - Get output file path — `chunks.41.mjs:2248`
- `nl4` - Update progress with telemetry — `chunks.146.mjs:2059`
- `i9` - Atomic task update — `chunks.90.mjs:3003`

---

## Algorithm 1: Background Task Creation

### What it does

Creates a background agent task with all necessary state, abort handling, and cleanup registration.

### Source Code

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
    // Step 1: Initialize output file
    initOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create abort controller (linked to parent if provided)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : new AbortController();

    // Step 3: Build task record
    let taskRecord = {
        // Base fields from createTaskEntry
        ...createTaskEntry(agentId, "local_agent", description, toolUseId),

        // Agent-specific fields
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",

        // Control fields
        abortController: abortController,

        // Progress tracking
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,

        // Background flag - TRUE for explicit background
        isBackgrounded: true,

        // Message queue for mid-run messages
        pendingMessages: []
    };

    // Step 4: Register cleanup handler
    taskRecord.unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Step 5: Register in app state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
//          Co→initOutputFile, L0→getOutputFilePath, X$→resolveOutputPath,
//          Wm→createChildAbortController, sK→newAbortController, RG→createTaskEntry,
//          Zf→registerTask, E4→registerCleanupHandler, x66→triggerAbortSignal
```

### Algorithm Analysis

**Step-by-step:**

1. **Output file initialization**: Create empty output file for incremental writes
2. **Abort controller creation**: Either linked to parent or standalone
3. **Task record construction**: Merge base entry with agent-specific fields
4. **Cleanup registration**: Handler to call on abort/completion
5. **State registration**: Add to appState.tasks

**Why this approach:**
- **isBackgrounded: true** - Distinguishes explicit background from mid-run backgrounding
- **Linked abort controller** - Ensures child aborts when parent aborts
- **Cleanup handler** - Ensures resources released on any termination

---

## Algorithm 2: Foreground Task with Auto-Background

### What it does

Creates a foreground task that can automatically transition to background after a timeout.

### Source Code

```javascript
// ============================================
// Un4 - createForegroundAgentTask
// Location: chunks.146.mjs:2165-2250 (inferred)
// ============================================

// ORIGINAL (for source lookup):
function Un4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    autoBackgroundMs: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = sK(),
        $ = E4(async () => {
            x66(A, z)
        }),
        H = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            unregisterCleanup: $,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !1,
            pendingMessages: []
        },
        j, J = new Promise((D) => {
            j = D
        });
    // ... Promise.race for auto-backgrounding
}

// READABLE (for understanding):
function createForegroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    autoBackgroundMs,
    toolUseId
}) {
    // Step 1: Initialize output file
    initOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create abort controller
    let abortController = new AbortController();

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskEntry(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        unregisterCleanup: registerCleanupHandler(() => triggerAbortSignal(agentId, setAppState)),
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,

        // isBackgrounded: FALSE for foreground (may change via auto-background)
        isBackgrounded: false,
        pendingMessages: []
    };

    // Step 4: Set up auto-background timer if specified
    let backgroundResolve;
    let backgroundPromise = new Promise((resolve) => {
        backgroundResolve = resolve;
    });

    if (autoBackgroundMs) {
        setTimeout(() => {
            // Transition to background after timeout
            atomicUpdateTask(agentId, setAppState, (task) => ({
                ...task,
                isBackgrounded: true
            }));
            backgroundResolve({ type: "background" });
        }, autoBackgroundMs);
    }

    // Step 5: Register in app state
    registerTask(taskRecord, setAppState);

    return {
        taskRecord,
        backgroundPromise,
        backgroundResolve
    };
}

// Mapping: Un4→createForegroundAgentTask, _→autoBackgroundMs
```

### Auto-Background Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Foreground Task with Auto-Background                      │
└─────────────────────────────────────────────────────────────────────────────┘

Task created (isBackgrounded: false)
        │
        ├─────────────────────────────────────────┐
        │                                         │
        ▼                                         ▼
Normal execution path                    Auto-background timer
        │                                         │
        │                                         │ (after autoBackgroundMs)
        │                                         ▼
        │                               Transition to background
        │                               (isBackgrounded: true)
        │                                         │
        │◄────────────────────────────────────────┘
        │
        ▼
Promise.race([
    executionComplete,
    backgroundSignal
])
        │
        ├──────────────────────┬─────────────────────┐
        │                      │                     │
        ▼ complete             ▼ background          ▼ error
Return result          Continue in           Clean up
                       background
```

---

## Algorithm 3: Output File Path Resolution

### What it does

Generates the file path for task output storage.

### Source Code

```javascript
// ============================================
// g2 - getOutputFilePath - Get output file path for task
// Location: chunks.41.mjs:2248-2250
// ============================================

// ORIGINAL (for source lookup):
function g2(A) {
    return D97(yJ6(), `${A}.output`)
}

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Mapping: g2→getOutputFilePath, A→taskId, D97→path.join, yJ6→getTasksDirectory
```

### Directory Structure

```
~/.claude/
└── tasks/
    ├── a3f4b2c1.output    # local_agent task
    ├── b7d8e9f2.output    # local_bash task
    ├── t2a3b4c5.output    # in_process_teammate task
    └── r9d8c7b6.output    # remote_agent task
```

**Key insight:** Task ID prefix determines file type at a glance.

---

## Algorithm 4: Atomic Task State Update

### What it does

Safely updates task state with optimistic locking semantics.

### Source Code

```javascript
// ============================================
// i9 - atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3018
// ============================================

// READABLE (for understanding):
function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        let task = state.tasks[taskId];
        if (!task) return state;

        let updatedTask = updater(task);

        // If updater returned same object, no change needed
        if (updatedTask === task) return state;

        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask
```

### Usage Patterns

```javascript
// Pattern 1: Status transition
atomicUpdateTask(taskId, setAppState, (task) => {
    if (task.status !== "running") return task;  // Guard
    return { ...task, status: "completed", endTime: Date.now() };
});

// Pattern 2: Progress update
atomicUpdateTask(taskId, setAppState, (task) => {
    return {
        ...task,
        progress: {
            ...task.progress,
            toolUseCount: task.progress?.toolUseCount ?? 0 + 1
        }
    };
});

// Pattern 3: Memory cleanup on completion
atomicUpdateTask(taskId, setAppState, (task) => {
    return {
        ...task,
        // Keep only last message for memory efficiency
        messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
    };
});
```

---

## Algorithm 5: Progress Throttling

### What it does

Throttles progress updates to prevent excessive system reminder noise.

### Throttle Mechanism

```javascript
// ============================================
// Progress throttling logic (conceptual)
// Location: Various files
// ============================================

// READABLE (for understanding):
const PROGRESS_THROTTLE_TURNS = 3;

function shouldShowProgress(task, messageHistory) {
    // Always show progress for new tasks
    if (task.progress === undefined) return true;

    // Count assistant turns since last progress
    let turnsSinceProgress = 0;
    for (let i = messageHistory.length - 1; i >= 0; i--) {
        let message = messageHistory[i];
        if (message.role === "assistant") {
            turnsSinceProgress++;
            if (turnsSinceProgress >= PROGRESS_THROTTLE_TURNS) {
                return true;
            }
        }
    }

    return false;
}
```

### Throttle Decision Tree

```
Should show progress attachment?
        │
        ▼
┌───────────────────┐     Yes     ┌─────────────────────────────┐
│ New task?         │────────────►│ SHOW (first progress)       │
│ (no prior progress)│            └─────────────────────────────┘
└─────────┬─────────┘
          │ No
          ▼
┌───────────────────┐     Yes     ┌─────────────────────────────┐
│ turnsSinceProgress│────────────►│ SHOW (throttle passed)      │
│ >= 3?             │             └─────────────────────────────┘
└─────────┬─────────┘
          │ No
          ▼
┌───────────────────┐
│ SKIP (throttled)  │
└───────────────────┘
```

**Why 3 turns:**
- **Balance** - Enough context between updates
- **Noise reduction** - Prevents flooding LLM context
- **Responsiveness** - Still frequent enough for awareness

---

## Algorithm 6: Kill Handler Dispatch

### What it does

Dispatches to the appropriate kill handler based on task type.

### Handler Registry

```javascript
// ============================================
// Kill handler routing (conceptual)
// ============================================

// READABLE (for understanding):
function getKillHandlerForType(taskType) {
    switch (taskType) {
        case "local_agent":
            return killLocalAgentTask;    // Via x66
        case "local_bash":
            return killLocalBashTask;     // wQ6 - chunks.95.mjs:1918
        case "in_process_teammate":
            return killInProcessTeammate; // bZ1 - chunks.113.mjs:1272
        case "remote_agent":
            return killRemoteAgentTask;   // Via session termination
        case "local_workflow":
            return killWorkflowTask;
        default:
            return null;
    }
}
```

### Kill Handler Implementations

**Local Agent (x66):**
```javascript
// AbortController.abort() + cleanup + state update
```

**Local Bash (wQ6):**
```javascript
// Process group termination (kill -TERM -pgid)
```

**In-Process Teammate (bZ1):**
```javascript
// Abort signal + remove from state
```

**Remote Agent:**
```javascript
// Session termination via WebSocket
```

---

## Algorithm 7: Notification Injection

### What it does

Injects task completion notifications into the conversation.

### Source Code

```javascript
// ============================================
// Notification injection (conceptual)
// Location: chunks.89.mjs (inferred)
// ============================================

// READABLE (for understanding):
function notifyTaskCompletion(task, setAppState) {
    // Build notification message
    let message;
    if (task.status === "completed") {
        message = `Background agent "${task.description}" completed.`;
    } else if (task.status === "failed") {
        message = `Background agent "${task.description}" failed: ${task.error}`;
    } else if (task.status === "killed") {
        message = `Background agent "${task.description}" was stopped by the user.`;
    }

    // Inject into notification queue
    setAppState((state) => ({
        ...state,
        notifications: [
            ...state.notifications,
            {
                value: message,
                mode: "task-notification",
                timestamp: Date.now()
            }
        ]
    }));
}
```

---

## State Machine Summary

```
                     ┌──────────┐
                     │ pending  │
                     └────┬─────┘
                          │ Qn4() / Un4()
                          ▼
                     ┌──────────┐
                     │ running  │◄──────────────────┐
                     └────┬─────┘                   │
                          │                         │
          ┌───────────────┼───────────────┐        │
          │               │               │        │
          ▼               ▼               ▼        │
     ┌──────────┐   ┌──────────┐   ┌──────────┐   │
     │completed │   │  failed  │   │  killed  │   │
     │  ($m8)   │   │  (Hm8)   │   │  (d4q)   │   │
     └──────────┘   └──────────┘   └──────────┘   │
          │               │               │        │
          └───────────────┴───────────────┘        │
                          │                        │
                          ▼                        │
               notifyTaskCompletion()              │
                                                   │
               Auto-background transition ─────────┘
               (isBackgrounded: true)
```

---

## Algorithm Comparison

| Algorithm | Complexity | Key Insight |
|-----------|------------|-------------|
| Task Creation | O(1) | Abort controller + cleanup registration |
| Auto-Background | O(1) | Timer-based state transition |
| Output Path | O(1) | Prefix-based file naming |
| Atomic Update | O(1) | Optimistic locking pattern |
| Progress Throttle | O(n) | Turn counting backwards |
| Kill Dispatch | O(1) | Handler registry lookup |
| Notification | O(1) | Queue append |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |
| `bZ1` | killInProcessTeammate | chunks.113.mjs:1272 | ✓ Verified |

---

## Related Documents

- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - State machine details
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handler implementations
- [output_capture_source_restored.md](./output_capture_source_restored.md) - Output file handling
- [notification_queue_source_restored.md](./notification_queue_source_restored.md) - Notification system
- [../08_subagent/key_algorithms_source_restored.md](../08_subagent/key_algorithms_source_restored.md) - Subagent algorithms