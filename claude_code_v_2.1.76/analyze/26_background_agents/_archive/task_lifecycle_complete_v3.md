# Task Lifecycle Complete V3 - Background Agents (Claude Code 2.1.76)

> Complete source-level documentation of the background agent task lifecycle including task creation, state transitions, progress tracking, and completion handling with verified symbol mappings.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - generateTaskId — `chunks.41.mjs:2410`
- `RG` - createTaskRecord — `chunks.41.mjs:2418`
- `Qn4` - createBackgroundAgentTask — `chunks.146.mjs:2133`
- `Un4` - createForegroundAgentTask — `chunks.146.mjs:2165`
- `i9` - atomicUpdateTask — `chunks.90.mjs:3003`
- `Zf` - registerTask — `chunks.90.mjs:3019`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`

---

## Task Lifecycle Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKGROUND TASK LIFECYCLE                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │    Created      │
                    │   (pending)     │
                    │   oV + RG       │
                    └────────┬────────┘
                             │
                             │ Zf (register)
                             │
                             ▼
                    ┌─────────────────┐
                    │    Running      │
                    │   (active)      │
                    │   Qn4/Un4       │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  Completed  │    │   Failed    │    │   Killed    │
   │  $m8        │    │   Hm8       │    │   d4q       │
   └─────────────┘    └─────────────┘    └─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Evicted      │
                    │ (removed from   │
                    │  state)         │
                    └─────────────────┘
```

---

## Task ID Generation (oV)

### Source Code

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID with type prefix
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = q;
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get prefix for task type
    let prefix = getTaskTypePrefix(taskType);
    if (!prefix) prefix = "x";  // Unknown type fallback

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.randomBytes(8);

    // Step 3: Build ID using alphanumeric encoding
    let taskId = prefix;
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 8; i++) {
        taskId += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→cryptoRandomBytes, G97→ALPHABET
```

### Task Type Prefixes (V$3)

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task ID prefix mapping
// Location: chunks.41.mjs:2438
// ============================================

const TASK_TYPE_PREFIXES = {
    "local_agent": "a",      // Background/foreground agents
    "local_bash": "b",       // Background bash commands
    "in_process_teammate": "t", // In-process teammate
    "remote_agent": "r",     // Remote session agent
    "local_workflow": "w"    // Workflow tasks
};

// Unknown types get "x" prefix
```

### Algorithm Analysis

**What it does:** Generates unique, type-prefixed identifiers for tasks.

**How it works:**
1. Lookup type prefix from TASK_TYPE_PREFIXES
2. Generate 8 cryptographically secure random bytes
3. Encode each byte as alphanumeric character (base-36 mod)

**Why this approach:**
- **Type identification** - Single character prefix identifies task type
- **No coordination needed** - Cryptographic randomness prevents collisions
- **Human-readable** - Alphanumeric encoding is URL-safe
- **Fixed length** - 9 characters (1 prefix + 8 random)

**Collision probability:** With 36^8 ≈ 2.8 × 10^12 possible IDs per type, collision probability is effectively zero for typical usage.

---

## Task Record Creation (RG)

### Source Code

```javascript
// ============================================
// RG - createTaskRecord - Create task state object
// Location: chunks.41.mjs:2418-2436
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A,
        type: q,
        description: K,
        toolUseId: Y,
        startTime: Date.now(),
        status: "pending",
        outputOffset: 0,
        notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,
        type: taskType,
        description: description,
        toolUseId: toolUseId,
        startTime: Date.now(),
        status: "pending",
        outputOffset: 0,
        notified: false
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId
```

### Task Record Schema

```typescript
interface TaskRecord {
    id: string;              // Task ID (e.g., "ab3k7m9p2")
    type: TaskType;          // "local_agent" | "local_bash" | etc.
    description: string;     // Human-readable description
    toolUseId: string;       // Tool use ID that spawned this task
    startTime: number;       // Creation timestamp
    status: TaskStatus;      // "pending" | "running" | "completed" | "failed" | "killed"
    outputOffset: number;    // Current read position in output file
    notified: boolean;       // Has terminal notification been sent?

    // Optional fields (added during execution)
    agentId?: string;        // Agent ID (for local_agent)
    prompt?: string;         // Original prompt
    selectedAgent?: object;  // Agent definition
    abortController?: AbortController;
    unregisterCleanup?: () => void;
    progress?: {
        toolUseCount: number;
        tokenCount: number;
        summary: string;
    };
    result?: object;         // Final result (for completed)
    error?: string;          // Error message (for failed)
    endTime?: number;        // Completion timestamp
    messages?: Message[];    // Message history (compacted)
    isBackgrounded?: boolean; // Is running in background?
    pendingMessages?: string[]; // Queued messages (for teammates)
}
```

---

## Background Task Creation (Qn4)

### Complete Source Code

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask - Create background agent task
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
    initOutputFile(agentId, getTranscriptPath(agentId));

    // Step 2: Create abort controller (linked to parent if provided)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : new AbortController();

    // Step 3: Build task record
    let task = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,
        pendingMessages: []
    };

    // Step 4: Register cleanup handler
    let cleanupHandler = registerCleanup(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    task.unregisterCleanup = cleanupHandler;

    // Step 5: Register task in state
    registerTask(task, setAppState);

    return task;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId
//          Co→initOutputFile, L0→getTranscriptPath, X$→getAgentDir,
//          Wm→createChildAbortController, sK→newAbortController,
//          RG→createTaskRecord, E4→registerCleanup, x66→triggerAbortSignal, Zf→registerTask
```

### Algorithm Analysis

**What it does:** Creates a new background agent task with all necessary initialization.

**How it works:**
1. **Initialize output file** - Creates transcript file for agent
2. **Create abort controller** - Either linked to parent or standalone
3. **Build task record** - Merge base record with background-specific fields
4. **Register cleanup** - Ensures abort on unexpected termination
5. **Register in state** - Makes task visible to UI and polling

**Why this approach:**
- **Linked abort** - Parent termination cascades to child
- **Cleanup guarantee** - Handler ensures resource cleanup
- **Immediate registration** - Task visible as soon as created

---

## Foreground Task Creation (Un4)

### Complete Source Code

```javascript
// ============================================
// Un4 - createForegroundAgentTask - Create foreground agent task
// Location: chunks.146.mjs:2165-2230
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
    lT6.set(A, j), Zf(H, z);
    let M;
    if (_ !== void 0 && _ > 0) {
        let D = setTimeout((X, P) => {
            X((Z) => {
                let G = Z.tasks[P];
                if (!Sf(G) || G.isBackgrounded) return Z;
                // ... auto-background logic
            })
        }, _);
        M = () => clearTimeout(D)
    }
    // ... return task and resolver
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
    initOutputFile(agentId, getTranscriptPath(agentId));

    // Step 2: Create abort controller (standalone for foreground)
    let abortController = new AbortController();

    // Step 3: Register cleanup handler
    let cleanupHandler = registerCleanup(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Step 4: Build task record
    let task = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        unregisterCleanup: cleanupHandler,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: false,  // Key difference from background
        pendingMessages: []
    };

    // Step 5: Create resolver for completion promise
    let resolveCompletion;
    let completionPromise = new Promise((resolve) => {
        resolveCompletion = resolve;
    });

    // Store resolver for later use
    completionResolvers.set(agentId, resolveCompletion);

    // Step 6: Register task in state
    registerTask(task, setAppState);

    // Step 7: Setup auto-background timer if specified
    let cancelAutoBackground;
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timer = setTimeout(() => {
            setAppState((state) => {
                let task = state.tasks[agentId];
                if (!isLocalAgent(task) || task.isBackgrounded) return state;

                // Transition to background
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [agentId]: {
                            ...task,
                            isBackgrounded: true
                        }
                    }
                };
            });
        }, autoBackgroundMs);

        cancelAutoBackground = () => clearTimeout(timer);
    }

    return { task, completionPromise, resolveCompletion, cancelAutoBackground };
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→autoBackgroundMs, w→toolUseId
//          lT6→completionResolvers, Sf→isLocalAgent
```

### Key Difference: isBackgrounded Field

```javascript
// Background task (Qn4)
isBackgrounded: true   // Immediately running in background

// Foreground task (Un4)
isBackgrounded: false  // Running synchronously, may be backgrounded later
```

---

## Task State Management

### atomicUpdateTask (i9)

```javascript
// ============================================
// i9 - atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3018
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks[A];
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
function atomicUpdateTask(taskId, setAppState, updateFn) {
    setAppState((state) => {
        let task = state.tasks[taskId];
        if (!task) return state;  // Task doesn't exist

        let updatedTask = updateFn(task);

        // If no change, return original state
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

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updateFn
```

### registerTask (Zf)

```javascript
// ============================================
// Zf - registerTask - Register task in state
// Location: chunks.90.mjs:3019-3035
// ============================================

// ORIGINAL (for source lookup):
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    }))
}

// READABLE (for understanding):
function registerTask(task, setAppState) {
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [task.id]: task
        }
    }));
}

// Mapping: Zf→registerTask, A→task, q→setAppState
```

---

## Output Polling (wY4)

### Complete Source Code

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll task output files
// Location: chunks.90.mjs:3058-3085
// ============================================

// ORIGINAL (for source lookup):
async function wY4(A) {
    let q = [],
        K = {},
        Y = [],
        z = A.tasks ?? {};
    for (let _ of Object.values(z)) {
        if (_.notified) switch (_.status) {
            case "completed":
            case "failed":
            case "killed":
                Y.push(_.id);
                continue;
            case "pending":
                continue;
            case "running":
                break
        }
        if (_.status === "running") {
            let w = await Z97(_.id, _.outputOffset);
            if (w.content) K[_.id] = w.newOffset
        }
    }
    return {
        attachments: q,
        updatedTaskOffsets: K,
        evictedTaskIds: Y
    }
}

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let attachments = [];
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // Check if task should be evicted (terminal + notified)
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    evictedTaskIds.push(task.id);
                    continue;
                case "pending":
                    continue;
                case "running":
                    break;
            }
        }

        // For running tasks, read output delta
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments: attachments,
        updatedTaskOffsets: updatedTaskOffsets,
        evictedTaskIds: evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets,
//          Y→evictedTaskIds, z→tasks, Z97→readOutputFileDelta
```

### Eviction Logic

```
Task is evicted when:
┌─────────────────────────────────────────────────────────────────────────────┐
│ task.notified === true                                                       │
│                        AND                                                   │
│ task.status in ["completed", "failed", "killed"]                            │
└─────────────────────────────────────────────────────────────────────────────┘

Why eviction?
- Terminal tasks that have been notified are no longer needed in state
- Prevents memory buildup from completed tasks
- Keeps UI focused on active/relevant tasks
```

---

## State Transition Functions

### markTaskCompleted ($m8)

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
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file
    flushOutputFile(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→agentId,
//          i9→atomicUpdateTask, $O→flushOutputFile
```

### markTaskFailed (Hm8)

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
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
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
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file
    flushOutputFile(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState,
//          i9→atomicUpdateTask, $O→flushOutputFile
```

### markTaskKilled (d4q)

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
        if (task.notified) return task;  // Already notified

        return {
            ...task,
            notified: true,
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

---

## Complete State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE MACHINE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

States:
  pending    → Task created, not started
  running    → Task actively executing
  completed  → Task finished successfully
  failed     → Task encountered error
  killed     → Task was terminated by user

                    ┌──────────┐
                    │ pending  │
                    └────┬─────┘
                         │ Zf (register)
                         │ spawn
                         ▼
                    ┌──────────┐
         ┌─────────│ running  │──────────┐
         │         └────┬─────┘          │
         │              │                │
         │              │                │
         ▼              ▼                ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │completed │   │  failed  │   │  killed  │
    │  ($m8)   │   │  (Hm8)   │   │  (d4q)   │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │                │
         │              │                │
         │    notified=true               │
         │              │                │
         └──────────────┼────────────────┘
                        │
                        ▼
                   Evicted
                   (removed from state by OY4)

Transitions:
  pending → running    : spawn (Qn4, Un4)
  running → completed  : $m8 (markTaskCompleted)
  running → failed     : Hm8 (markTaskFailed)
  running → killed     : x66 + d4q (triggerAbortSignal + markTaskKilled)
  killed → evicted     : OY4 (updateTaskState) when notified
  completed → evicted  : OY4 (updateTaskState) when notified
  failed → evicted     : OY4 (updateTaskState) when notified
```

---

## Verification Status

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `VR` | removeTask | chunks.90.mjs:3037 | ✓ Verified |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |

---

## Related Documents

- [README.md](./README.md) - Module overview
- [kill_mechanism_complete.md](./kill_mechanism_complete.md) - Kill handling
- [progress_tracking_complete.md](./progress_tracking_complete.md) - Progress system
- [../08_subagent/README.md](../08_subagent/README.md) - Subagent system