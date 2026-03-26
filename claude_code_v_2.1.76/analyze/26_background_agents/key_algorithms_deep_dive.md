# Key Algorithms Deep Dive (Claude Code 2.1.76)

> Deep analysis of critical algorithms in the subagent and background agent systems.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Algorithm 1: Task ID Generation

### Problem Statement

Need to generate unique identifiers for tasks that:
1. Are unique across distributed execution
2. Allow quick type identification
3. Are compact and URL-safe
4. Support efficient filtering

### Solution: Type-Prefixed Base36 IDs

```javascript
// ============================================
// oV - Task ID generation algorithm
// Location: chunks.41.mjs:2410-2415
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),              // Get prefix for task type
        K = N$3(8),              // Get 8 random bytes
        Y = q;                   // Start with prefix
    for (let z = 0; z < 8; z++)
        Y += G97[K[z] % G97.length];  // Append base36 chars
    return Y
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get prefix (1 character)
    const prefix = TASK_TYPE_PREFIXES[taskType] ?? "x";

    // Step 2: Generate cryptographically secure random bytes
    const randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Build ID by mapping bytes to base36 charset
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }

    return taskId;
}
```

### Algorithm Analysis

**Complexity:**
- Time: O(1) - Fixed 8 iterations
- Space: O(1) - Fixed size output

**Uniqueness Guarantee:**
- 36^8 = 2,821,109,907,456 possible combinations per prefix
- With 1 million tasks per second, collision probability after 1 year: ~10^-12
- Practically impossible to collide

**Type Prefix Mapping:**

| Task Type | Prefix | Example ID |
|-----------|--------|------------|
| `local_agent` | `a` | `a3f4b2c1` |
| `local_bash` | `b` | `b7d8e9f2` |
| `remote_agent` | `r` | `r9d8c7b6` |
| `in_process_teammate` | `t` | `t2a3b4c5` |
| `local_workflow` | `w` | `w1e2r3t4` |

**Key Insight:** The prefix enables O(1) filtering by type without parsing the full task record.

---

## Algorithm 2: Task State Machine

### Problem Statement

Need to manage task lifecycle with:
1. Clear state transitions
2. Prevent invalid transitions
3. Handle concurrent updates
4. Ensure notification delivery

### Solution: Single-Direction State Machine

```javascript
// ============================================
// State machine definition
// ============================================

// Valid states
type TaskStatus = "pending" | "running" | "completed" | "failed" | "killed";

// Terminal states (LJ6)
function isTerminalTaskStatus(status) {
    return status === "completed" ||
           status === "failed" ||
           status === "killed";
}
```

### State Diagram

```
                    ┌─────────────────────────────────────────────┐
                    │           Task State Machine                 │
                    └─────────────────────────────────────────────┘

                                    ┌──────────┐
                                    │ pending  │
                                    │ (initial)│
                                    └────┬─────┘
                                         │
                                         │ spawn()
                                         │ (execution starts)
                                         ▼
                                  ┌─────────────┐
                           ┌──────│   running   │──────┐
                           │      │  (active)   │      │
                           │      └──────┬──────┘      │
                           │             │             │
               backgrounded │             │ completed   │ auto-background
               (mid-run)    │             │ (success)   │ (timeout)
                           ▼             ▼             ▼
                    ┌───────────┐  ┌───────────┐  ┌───────────────┐
                    │background │  │ completed │  │ background    │
                    │(running)  │  │           │  │ (auto-bg)     │
                    └─────┬─────┘  └───────────┘  └───────┬───────┘
                          │                               │
                          │ complete                      │ complete
                          ▼                               ▼
                    ┌───────────┐                  ┌───────────┐
                    │ completed │                  │ completed │
                    │(was bg)   │                  │           │
                    └───────────┘                  └───────────┘

                    From running, also possible:
                    - failed (error occurred)
                    - killed (user terminated)
```

### Transition Validation

```javascript
// ============================================
// Valid state transitions
// ============================================

const VALID_TRANSITIONS = {
    "pending": ["running"],
    "running": ["completed", "failed", "killed"],
    "completed": [],  // Terminal
    "failed": [],     // Terminal
    "killed": []      // Terminal
};

function canTransition(currentStatus, newStatus) {
    return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}
```

### Atomic Update Pattern

```javascript
// ============================================
// i9 - Atomic task update with validation
// Location: chunks.90.mjs:3003-3016
// ============================================

function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task doesn't exist

        let updatedTask = updater(task);

        // If updater returned same object, no change needed
        if (updatedTask === task) return state;

        // Validate state transition if status changed
        if (updatedTask.status !== task.status) {
            if (!canTransition(task.status, updatedTask.status)) {
                console.error(`Invalid transition: ${task.status} -> ${updatedTask.status}`);
                return state;  // Reject invalid transition
            }
        }

        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}
```

**Key Insight:** All state transitions go through `running`. You cannot skip directly from `pending` to terminal states.

---

## Algorithm 3: Progress Throttling

### Problem Statement

Need to report task progress to LLM context without:
1. Overwhelming the context with updates
2. Including stale progress information
3. Creating redundant attachments

### Solution: Turn-Based Throttling

```javascript
// ============================================
// Progress throttling mechanism
// ============================================

// Check if progress update should be sent
function shouldSendProgressUpdate(task, turnsSinceProgress) {
    // Always send for new tasks (turnsSinceProgress = Infinity)
    if (turnsSinceProgress === Infinity) return true;

    // Throttle to every 3+ turns
    if (turnsSinceProgress < 3) return false;

    // Only send if there's new activity
    if (task.progress?.summary !== task.lastReportedSummary) {
        return true;
    }

    return false;
}
```

### Turn Counting

```javascript
// ============================================
// TIY - Count turns since last progress
// Location: chunks.144.mjs:832 (inferred)
// ============================================

function countTurnsSinceLastProgress(appState, taskId) {
    const task = appState.tasks?.[taskId];
    if (!task) return Infinity;

    // Count assistant messages since last progress report
    const messages = appState.messages ?? [];
    let turns = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];

        if (message.type === "assistant") {
            turns++;
        }

        // Stop when we find the last progress attachment
        if (message.content?.some?.(c =>
            c.type === "task_progress" && c.task_id === taskId
        )) {
            return turns;
        }
    }

    // No previous progress found
    return Infinity;
}
```

### Progress Update Flow

```
Before Each LLM Turn:
        │
        ▼
getUnifiedTasksAttachment()
        │
        ├── For each running task:
        │   │
        │   ├── countTurnsSinceLastProgress()
        │   │
        │   └── if (shouldSendProgressUpdate()):
        │       │
        │       └── Build task_progress attachment
        │           <task_progress>
        │             <task_id>a3f4b2</task_id>
        │             <message>Running Grep...</message>
        │           </task_progress>
        │
        └── Return combined attachments
```

**Key Insight:** New tasks always get progress (turnsSinceProgress = Infinity), ensuring visibility of newly spawned agents.

---

## Algorithm 4: Abort Signal Propagation

### Problem Statement

Need to cleanly terminate running tasks:
1. Stop ongoing LLM API calls
2. Kill child processes
3. Clean up resources
4. Update state atomically

### Solution: AbortController Hierarchy

```javascript
// ============================================
// AbortController hierarchy
// ============================================

// Task creation with AbortController
function createBackgroundAgentTask({ agentId, ... }) {
    // Create new AbortController for this task
    const abortController = new AbortController();

    // Register cleanup handler
    const unregisterCleanup = registerCleanupHandler(agentId, () => {
        // Cleanup on abort
        abortController.abort();
    });

    const task = {
        id: agentId,
        abortController: abortController,
        unregisterCleanup: unregisterCleanup,
        // ...
    };

    return task;
}
```

### Abort Signal Flow

```javascript
// ============================================
// x66 - Trigger abort signal
// Location: chunks.146.mjs:2012-2016
// ============================================

function triggerAbortSignal(taskId, setAppState) {
    let wasRunning = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        wasRunning = true;

        // Step 1: Abort the AbortController
        // This signals all ongoing operations to stop
        task.abortController?.abort();

        // Step 2: Run cleanup handler
        // This removes event listeners, closes files, etc.
        task.unregisterCleanup?.();

        return task;  // State update happens in markTaskKilled
    });

    return wasRunning;
}
```

### Kill Flow Diagram

```
User Triggers Kill (Ctrl+F or TaskStop)
        │
        ▼
killAllLocalAgents() / triggerAbortSignal()
        │
        ├── For each running task:
        │   │
        │   ├── abortController.abort()
        │   │   │
        │   │   └── Signals:
        │   │       - LLM API call (if in progress)
        │   │       - Tool execution (if in progress)
        │   │       - Child process (via signal)
        │   │
        │   ├── unregisterCleanup()
        │   │   └── Removes:
        │   │       - Event listeners
        │   │       - File handles
        │   │       - Temporary files
        │   │
        │   └── markTaskKilled()
        │       └── Updates state:
        │           - status: "killed"
        │           - endTime: Date.now()
        │           - notified: true
        │
        └── Show notification to user
```

### LLM API Integration

```javascript
// ============================================
// How abort signal integrates with API calls
// ============================================

async function streamLLMResponse(messages, abortSignal) {
    // Pass abort signal to fetch
    const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({ messages }),
        signal: abortSignal  // Cancels fetch if aborted
    });

    // Stream handling with abort check
    for await (const chunk of response.body) {
        if (abortSignal.aborted) {
            throw new DOMException("Aborted", "AbortError");
        }
        yield parseChunk(chunk);
    }
}
```

**Key Insight:** The AbortController provides a unified cancellation mechanism that works across:
- Network requests (fetch)
- Child processes
- Event listeners
- Custom async operations

---

## Algorithm 5: Notification Queue

### Problem Statement

Need to notify user of task completion without:
1. Creating duplicate notifications
2. Blocking the main thread
3. Losing notifications on crash

### Solution: State-Based Notification Queue

```javascript
// ============================================
// Notification state tracking
// ============================================

function buildTaskNotifications(appState) {
    const notifications = [];
    const tasks = appState.tasks ?? {};

    for (const task of Object.values(tasks)) {
        // Only notify for terminal states not yet notified
        if (isTerminalTaskStatus(task.status) && !task.notified) {
            notifications.push({
                type: "task-notification",
                taskId: task.id,
                message: formatTaskNotification(task),
                status: task.status
            });
        }
    }

    return notifications;
}

function formatTaskNotification(task) {
    switch (task.status) {
        case "completed":
            return `Background agent "${task.description}" completed.`;
        case "failed":
            return `Background agent "${task.description}" failed: ${task.error}`;
        case "killed":
            return `Background agent "${task.description}" was stopped by the user.`;
    }
}
```

### Notification Delivery Flow

```
After Each Turn:
        │
        ▼
buildTaskNotifications()
        │
        ├── Find tasks with:
        │   - Terminal status (completed/failed/killed)
        │   - notified: false
        │
        └── For each:
            ├── Create notification message
            ├── Display in TUI
            └── Set notified: true (via atomicUpdateTask)
```

**Key Insight:** The `notified` flag ensures exactly-once delivery, even if the system restarts.

---

## Performance Analysis

### Time Complexity Summary

| Algorithm | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Task ID Generation | O(1) | O(1) |
| State Transition | O(1) | O(1) |
| Progress Throttle Check | O(n) where n = messages | O(1) |
| Abort Signal | O(1) | O(1) |
| Notification Build | O(t) where t = tasks | O(t) |

### Optimization Strategies

1. **Task ID Generation** - Pre-computed charset lookup
2. **State Transitions** - Direct state machine with no backtracking
3. **Progress Throttle** - Memoized turn counting
4. **Abort Signal** - Native AbortController (C++ implementation)
5. **Notifications** - Lazy evaluation only when needed

---

## Cross-Feature Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Algorithm Integration Map                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌───────────────────┐
                    │ Task ID Gen (oV)  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ State Machine (i9)│
                    │                   │
                    │    pending        │
                    │       ↓           │
                    │    running ←──────┼─── Progress Throttle (TIY)
                    │    ↓ ↓ ↓          │
                    │  completed        │
                    │  failed           │
                    │  killed           │
                    └─────────┬─────────┘
                              │
                              ├─── Abort Signal (x66)
                              │
                              └─── Notification Queue
```

---

## Source Code Verification

| Symbol | Algorithm | Location | Verification |
|--------|-----------|----------|--------------|
| `oV` | Task ID Generation | chunks.41.mjs:2410 | ✓ Verified |
| `LJ6` | Terminal Status Check | chunks.41.mjs:2402 | ✓ Verified |
| `i9` | Atomic State Update | chunks.90.mjs:3003 | ✓ Verified |
| `x66` | Abort Signal Trigger | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | Kill All Local Agents | chunks.146.mjs:2029 | ✓ Verified |
| `TIY` | Turn Count for Throttle | chunks.144.mjs:832 | ✓ Inferred |

---

## Related Documents

- [task_management_source_restored.md](../08_subagent/task_management_source_restored.md) - Task management
- [abort_signal_propagation_source_restored.md](../08_subagent/abort_signal_propagation_source_restored.md) - Abort signals
- [progress_throttling.md](./progress_throttling.md) - Progress throttle details
- [notification_queue_source_restored.md](./notification_queue_source_restored.md) - Notification queue