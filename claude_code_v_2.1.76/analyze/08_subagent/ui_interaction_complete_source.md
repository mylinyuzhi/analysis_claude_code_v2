# UI Interaction - Complete Source Restoration (Claude Code 2.1.76)

> Source-level analysis of UI components, keyboard interactions, and visual feedback
> for subagent execution. All code snippets verified against source on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `AgentStatusComponent` (Vc4) - Agent status renderer — `chunks.133.mjs:124`
- `killAllLocalAgents` (U4q) - Kill all running agents — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task as killed — `chunks.146.mjs:2034` (via x66)
- `triggerAbortSignal` (x66) - Trigger abort for task — `chunks.146.mjs:2012`
- `markTaskCompleted` ($m8) - Mark task completed — `chunks.146.mjs:2100`
- `markTaskFailed` (Hm8) - Mark task failed — `chunks.146.mjs:2117`

---

## Component Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TUI Root Component                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Message List (Main Area)                         │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ Assistant Message with tool_use                              │   │    │
│  │  │                                                              │   │    │
│  │  │  ├─ AgentTool (Task)                                        │   │    │
│  │  │  │  ├─ AgentStatusComponent (Vc4)                          │   │    │
│  │  │  │  │  ├─ Agent type badge (colored)                       │   │    │
│  │  │  │  │  ├─ Description text                                  │   │    │
│  │  │  │  │  └─ Tool use count / tokens                           │   │    │
│  │  │  │  └─ Progress indicator (when running)                    │   │    │
│  │  │  └──────────────────────────────────────────────────────────┘   │    │
│  │  └──────────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Status Line (Footer)                             │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ BackgroundAgentIndicator                                    │   │    │
│  │  │  • Shows count of running local_agent tasks                 │   │    │
│  │  │  • "X running • Ctrl+F to cancel" hint                      │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context | Implementation |
|----------|--------|---------|----------------|
| `Ctrl+C` | Kill all running agents | When agents running | `U4q` → `x66` |
| `Ctrl+F` | Kill all running agents (confirm) | When agents running | `U4q` → `x66` |

### Task List Shortcuts

| Key | Action | Availability |
|-----|--------|--------------|
| `j` / `↓` | Move selection down | Task list focused |
| `k` / `↑` | Move selection up | Task list focused |
| `x` | Kill selected task | Running task selected |
| `f` | Foreground teammate | in_process_teammate selected |
| `Enter` | View task details | Any task selected |
| `Escape` | Return to list | Detail view |

---

## Agent Status Component (Vc4)

### What it does

Renders the visual representation of a subagent in the message list. Shows agent type, description, progress, and status in a tree-style format.

### Source Code

```javascript
// ============================================
// Vc4 - AgentStatusComponent - Render agent status tree node
// Location: chunks.133.mjs:124-200
// ============================================

// ORIGINAL (for source lookup):
function Vc4(A) {
    let q = A6(33),
        {
            agentType: K,
            description: Y,
            descriptionColor: z,
            taskDescription: _,
            toolUseCount: w,
            tokens: O,
            color: $,
            isLast: H,
            isResolved: j,
            isAsync: J,
            lastToolInfo: M,
            hideType: D
        } = A,
        X = J === void 0 ? !1 : J,
        P = D === void 0 ? !1 : D,
        W = H ? "└─" : "├─",
        Z = X && j,
        G;
    if (q[0] !== Z || q[1] !== j || q[2] !== M || q[3] !== _) G = () => {
        if (!j) return M || "Initializing…";
        if (Z) return _ ?? "Running in the background";
        return "Done"
    }, q[0] = Z, q[1] = j, q[2] = M, q[3] = _, q[4] = G;
    else G = q[4];
    // ... render tree node
}

// READABLE (for understanding):
function AgentStatusComponent(props) {
    // State cache for memoization (33-slot array)
    let cache = useStateCache(33);

    let {
        agentType,           // "general-purpose", "Explore", "Plan", etc.
        description,         // Short description passed to AgentTool
        descriptionColor,    // Optional color for description
        taskDescription,     // Detailed task description
        toolUseCount,        // Number of tool calls made
        tokens,              // Token usage count
        color,               // Agent's custom color
        isLast,              // Whether this is the last sibling
        isResolved,          // Whether agent has completed
        isAsync,             // Whether running asynchronously
        lastToolInfo,        // Most recent tool info string
        hideType             // Hide agent type badge
    } = props;

    // Defaults
    let isAsyncMode = isAsync === undefined ? false : isAsync;
    let shouldHideType = hideType === undefined ? false : hideType;

    // Tree prefix character
    let treePrefix = isLast ? "└─" : "├─";

    // Computed: is running in background after completion?
    let isBackgrounded = isAsyncMode && isResolved;

    // Memoized status text (cached in state to prevent re-renders)
    let statusText;
    if (cache[0] !== isBackgrounded || cache[1] !== isResolved ||
        cache[2] !== lastToolInfo || cache[3] !== taskDescription) {
        statusText = () => {
            if (!isResolved) return lastToolInfo || "Initializing…";
            if (isBackgrounded) return taskDescription ?? "Running in the background";
            return "Done";
        };
        cache[0] = isBackgrounded;
        cache[1] = isResolved;
        cache[2] = lastToolInfo;
        cache[3] = taskDescription;
        cache[4] = statusText;
    } else {
        statusText = cache[4];
    }

    // Render tree node with badge, description, and stats
    // ...
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, w→toolUseCount,
// O→tokens, H→isLast, j→isResolved, J→isAsync, M→lastToolInfo, D→hideType
```

### Why this approach

**Memoization via cache array:**
- Uses a 33-slot array (`A6(33)`) to cache computed values
- Prevents unnecessary re-renders when props haven't changed
- Status text function is cached in `cache[4]`

**Visual tree structure:**
- `├─` indicates more siblings follow
- `└─` indicates last sibling
- Enables hierarchical display of nested agents

### Visual Output

```
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...
└─ Done
```

---

## Ctrl+C Kill All Handler

### What it does

When the user presses Ctrl+C while background agents are running, this handler kills all running agents and shows a notification. In v2.1.76, Ctrl+F is also mapped to this functionality with a confirmation step.

### Source Code

```javascript
// ============================================
// handleCtrlCWithAgents - Kill all running agents on Ctrl+C
// Location: chunks.193.mjs:2630-2649
// ============================================

// ORIGINAL (for source lookup):
// From TUI keyboard handler
// L = hasRunningAgents selector result
// H6 = appState.tasks
// W = setAppState
// w0 = addNotification
}), U4q(H6, W), _Y4();
let J6 = [];
for (let [K6, s] of Object.entries(H6))
    if (s.type === "local_agent" && s.status === "running") d4q(K6, W), J6.push(s.description);
if (J6.length > 0) {
    let K6 = J6.length === 1 ? `Background agent "${J6[0]}" was stopped by the user.` : `${J6.length} background agents were stopped by the user: ${J6.map((s)=>`"${s}"`).join(", ")}.`;
    w0({
        value: K6,
        mode: "task-notification"
    })
}

// READABLE (for understanding):
// After user presses Ctrl+C with running agents:
async function handleKillAllAgents(appState, setAppState, addNotification) {
    // Step 1: Send abort signal to all local_agent tasks
    killAllLocalAgents(appState.tasks, setAppState);
    clearActiveTaskState();

    // Step 2: Mark each as killed and collect descriptions
    let killedDescriptions = [];
    for (let [taskId, task] of Object.entries(appState.tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            // d4q marks the task as killed (via x66 internally)
            // Note: x66 is called by U4q, d4q is for notification marking
            triggerAbortSignal(taskId, setAppState);
            killedDescriptions.push(task.description);
        }
    }

    // Step 3: Show notification with killed agent names
    if (killedDescriptions.length > 0) {
        let message = killedDescriptions.length === 1
            ? `Background agent "${killedDescriptions[0]}" was stopped by the user.`
            : `${killedDescriptions.length} background agents were stopped by the user: ${killedDescriptions.map(d => `"${d}"`).join(", ")}.`;
        addNotification({
            value: message,
            mode: "task-notification"
        });
    }
}

// Mapping: U4q→killAllLocalAgents, H6→tasks, W→setAppState, w0→addNotification
```

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         User Presses Ctrl+C                                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Check: hasRunningAgents?                                  │
│                                                                              │
│  hasRunningAgents = tasks.some(t => t.type === "local_agent" &&             │
│                                     t.status === "running")                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼ false                       ▼ true
┌─────────────────────────┐    ┌─────────────────────────────────────────────┐
│ Normal Ctrl+C behavior  │    │ Kill All Running Agents                     │
│ (cancel current stream) │    │                                             │
└─────────────────────────┘    │  1. telemetry("tengu_cancel")               │
                               │  2. U4q(tasks, setAppState) // abort all    │
                               │     └── x66(taskId) for each task          │
                               │  3. For each running local_agent:           │
                               │     a. trigger abort signal                 │
                               │     b. collect description                  │
                               │  4. Show notification with killed list      │
                               └─────────────────────────────────────────────┘
```

---

## triggerAbortSignal (x66)

### What it does

Triggers the abort signal for a specific task, causing the agent loop to stop gracefully. This is the core kill function that actually aborts execution.

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort signal for task
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
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasRunning = true;

        // Trigger the abort controller
        task.abortController?.abort();

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only the last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // If we actually killed something, remove from active agents
    if (wasRunning) {
        removeActiveAgent(taskId);
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask,
// Y→task, K→wasRunning, $O→removeActiveAgent
```

### Why this approach

**Cooperative cancellation:**
- Calls `abortController.abort()` which signals the agent loop
- Agent loop checks `signal.aborted` between turns
- In-progress tool calls complete gracefully
- Cleanup handlers always run (in finally blocks)

**Memory efficiency:**
- Only keeps last message when killed
- Removes abort controller and cleanup handler references
- Prevents memory leaks from long-running agents

---

## killAllLocalAgents (U4q)

### What it does

Iterates through all tasks and triggers abort signals for any running `local_agent` tasks. Used by Ctrl+C and Ctrl+F handlers.

### Source Code

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
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

### Key Insight

The function is intentionally simple:
- No batching or async coordination needed
- Each `x66` call is synchronous
- State updates happen independently for each task
- No return value - fire and forget

---

## markTaskCompleted ($m8)

### What it does

Updates a running task to "completed" status with the result and cleanup.

### Source Code

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
function markTaskCompleted(result, setAppState) {
    let agentId = result.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Remove from active agents tracking
    removeActiveAgent(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→agentId,
// i9→atomicUpdateTask, Y→task, $O→removeActiveAgent
```

---

## markTaskFailed (Hm8)

### What it does

Updates a running task to "failed" status with the error message.

### Source Code

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
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(A)
}

// READABLE (for understanding):
function markTaskFailed(agentId, error, setAppState) {
    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    removeActiveAgent(agentId);
}

// Mapping: Hm8→markTaskFailed, A→agentId, q→error, K→setAppState
```

---

## atomicUpdateTask (i9)

### What it does

The core function for updating task state. All task modifications go through this function.

### Source Code

```javascript
// ============================================
// i9 - atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3017
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        if (_ === z) return Y;
        return {
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
        // Get current task
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task doesn't exist

        // Apply updater function
        let newTask = updater(task);

        // Optimization: if unchanged, return same state
        if (newTask === task) return state;

        // Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: newTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater,
// Y→state, z→task, _→newTask
```

### Why this approach

**Single source of truth:**
All task modifications use the same code path, ensuring:
1. Consistency across all update types
2. Easy to add logging/telemetry at one place
3. Impossible to forget cleanup or state updates

**Optimization:**
The `if (newTask === task) return state` check avoids unnecessary re-renders when the updater doesn't actually change anything.

---

## TASK_TYPE_PREFIXES (V$3)

### What it does

Maps task types to single-character prefixes for human-readable task IDs.

### Source Code

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task ID prefix mapping
// Location: chunks.41.mjs:2438-2443
// ============================================

// ORIGINAL (for source lookup):
V$3 = {
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r",
    in_process_teammate: "t",
    local_workflow: "w"
}

// READABLE (for understanding):
const TASK_TYPE_PREFIXES = {
    local_bash: "b",              // Shell command tasks
    local_agent: "a",             // Local subagent tasks
    remote_agent: "r",            // Remote session agents
    in_process_teammate: "t",     // In-process teammates
    local_workflow: "w"           // Workflow tasks
};

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Task ID Format

- **Format:** `{prefix}{8-random-alphanumeric}`
- **Example:** `a3f4b2c1` = local_agent with random ID
- **Charset:** `G97 = "0123456789abcdefghijklmnopqrstuvwxyz"`

---

## Status Icons

### Visual Representation

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `pending` | ○ | dim | Task created, not yet started |
| `running` | ◐ | yellow | Currently executing |
| `completed` | ✓ | green | Successfully finished |
| `failed` | ✗ | red | Execution failed with error |
| `killed` | ○ | dim | User terminated |

### Animated Running Indicator

Running tasks use an animated spinner (◐) to indicate active execution:

```
Status Animation Cycle:
◐ → ◑ → ◒ → ◓ → ◐ (loops)
```

---

## Notification System

### Task Notification Types

| Mode | Display | Usage |
|------|---------|-------|
| `task-notification` | Inline message | Kill confirmations, completion notices |
| `error` | Error banner | Task failures |
| `warning` | Warning message | Resource warnings |

### Notification Message Formats

**Completion Notification:**
```
Agent "{description}" completed
```

**Failure Notification:**
```
Agent "{description}" failed: {errorMessage}
```

**Kill Notification (Single):**
```
Background agent "{description}" was stopped by the user.
```

**Kill Notification (Multiple):**
```
{count} background agents were stopped by the user: "{desc1}", "{desc2}", ...
```

---

## v2.1.76 UI Changes

### New Features

1. **Ctrl+F Kill All** - New keyboard shortcut to kill all running agents at once
2. **Partial Results on Kill** - Preserved output when task is killed
3. **Background Field** - New `background: true` field distinguishes explicit vs. converted background tasks

### Kill All Flow with Partial Results

```
User presses Ctrl+F or Ctrl+C with running agents
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. For each running local_agent:                                           │
│     a. readOutputFileDelta(taskId, offset) // Capture partial output       │
│     b. x66(taskId) // Trigger abort signal                                  │
│     c. Mark as killed in state                                              │
│                                                                              │
│  2. Build notification with partial results included                        │
│                                                                              │
│  3. Show user notification: "N background agents were stopped..."           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `Vc4` | AgentStatusComponent | chunks.133.mjs:124 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |

---

## Related Documents

- [task_state_machine_source_restored.md](../26_background_agents/task_state_machine_source_restored.md) - State machine
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox system
- [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - Algorithm analysis
- [../26_background_agents/ui_interaction_complete_source.md](../26_background_agents/ui_interaction_complete_source.md) - Background UI