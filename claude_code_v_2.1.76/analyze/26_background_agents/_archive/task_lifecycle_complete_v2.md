# Background Agents Task Lifecycle Complete (Claude Code 2.1.76)

> Complete source-level documentation of background agent task lifecycle including creation, state management, and completion handling.

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
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKGROUND AGENTS ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │  AgentTool /    │
                          │  BashTool       │
                          └────────┬────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ Background  │          │ Foreground  │          │ Auto-       │
   │ (explicit)  │          │ (blocking)  │          │ Background  │
   └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          │                        │ timeout/               │
          │                        │ Ctrl+C                 │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ createBack  │          │ createFore  │          │ Promise.race│
   │ AgentTask   │          │ AgentTask   │          │ mid-run bg  │
   │ (Qn4)       │          │ (Un4)       │          │             │
   └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ registerTask    │
                          │ (Zf)            │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Task Record    │
                          │  in appState    │
                          └────────┬────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ Running     │          │ Completed   │          │ Failed /    │
   │ (polling)   │          │ ($m8)       │          │ Killed      │
   └─────────────┘          └─────────────┘          │ (Hm8/d4q)   │
                                                      └─────────────┘
```

---

## Task ID Generation (oV)

### Complete Source Code

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
    let prefix = getTaskTypePrefix(taskType);  // k$3

    // Step 2: Generate 8 random bytes
    let randomBytes = cryptoRandomBytes(8);  // N$3

    // Step 3: Build ID: prefix + 8 random alphanumeric characters
    let taskId = prefix;
    const ALPHANUMERIC = "0123456789abcdefghijklmnopqrstuvwxyz";  // G97

    for (let i = 0; i < 8; i++) {
        taskId += ALPHANUMERIC[randomBytes[i] % ALPHANUMERIC.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→cryptoRandomBytes, G97→ALPHANUMERIC
```

### Task Type Prefixes (V$3)

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Mapping of task types to ID prefixes
// Location: chunks.41.mjs:2432-2444
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
    local_bash: "b",            // Shell commands (background)
    local_agent: "a",           // Local subagents
    remote_agent: "r",          // Remote session agents
    in_process_teammate: "t",   // In-process teammates
    local_workflow: "w"         // Workflow tasks
};

// Example IDs:
// - "ab3k7m9p2" - local_agent task
// - "bx8n4q1z" - local_bash task
// - "tq5w2e8r" - in_process_teammate task
```

### Key Algorithm: Collision-Resistant ID Generation

**What it does:** Generates unique identifiers for tasks with embedded type information.

**How it works:**
1. **Type prefix** - Single character identifies task type (`a`, `b`, `r`, `t`, `w`)
2. **Cryptographic randomness** - Uses `cryptoRandomBytes` for unpredictability
3. **Alphabet encoding** - Maps bytes to alphanumeric characters (36-character alphabet)
4. **Fixed length** - Always prefix + 8 characters = 9 total

**Why this approach:**
- **Type identification** - Can determine task type from ID alone
- **Uniqueness** - 36^8 ≈ 2.8 trillion possible combinations per type
- **Human-readable** - Alphanumeric, easy to copy/paste
- **No coordination needed** - Cryptographic randomness ensures uniqueness without central registry

**Collision probability:** For a single type with 1 million tasks, probability of collision is approximately:
- `P(collision) ≈ n²/(2 * 36^8) ≈ 10^12 / (2 * 2.8 * 10^12) ≈ 0.18`

With 10 million tasks: `P(collision) ≈ 18%` - acceptable for the use case.

---

## Task Record Creation (RG)

### Complete Source Code

```javascript
// ============================================
// RG - createTaskRecord - Create task entry object
// Location: chunks.41.mjs:2418-2430
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A,
        type: q,
        status: "pending",
        description: K,
        toolUseId: Y,
        startTime: Date.now(),
        outputFile: g2(A),
        outputOffset: 0,
        notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,                    // Unique task identifier (e.g., "ab3k7m9p2")
        type: taskType,                // Task type (e.g., "local_agent")
        status: "pending",             // Initial status
        description: description,      // Human-readable description
        toolUseId: toolUseId,          // Tool use ID for correlation
        startTime: Date.now(),         // Creation timestamp
        outputFile: getOutputFilePath(taskId),  // Path to output file
        outputOffset: 0,               // Current read position in output file
        notified: false                // Whether user has been notified of completion
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId,
//          g2→getOutputFilePath
```

### Task Record Schema

```typescript
interface TaskRecord {
    // Core fields (always present)
    id: string;                    // Unique task ID with type prefix
    type: TaskType;                // "local_agent" | "local_bash" | etc.
    status: TaskStatus;            // "pending" | "running" | "completed" | "failed" | "killed"
    description: string;           // Human-readable description
    toolUseId: string;             // Tool use ID for correlation
    startTime: number;             // Creation timestamp (ms)
    outputFile: string;            // Path to output file
    outputOffset: number;          // Current read position in output
    notified: boolean;             // Whether user notified of terminal state

    // Optional fields (added during execution)
    agentId?: string;              // For local_agent: agent ID
    prompt?: string;               // For local_agent: original prompt
    selectedAgent?: AgentDefinition; // For local_agent: resolved agent definition
    agentType?: string;            // For local_agent: agent type (e.g., "general-purpose")
    model?: string;                // Model override
    abortController?: AbortController; // For cancellation
    unregisterCleanup?: () => void; // Cleanup function to call on termination
    retrieved?: boolean;           // Whether output has been retrieved
    isBackgrounded?: boolean;      // Whether task is running in background
    pendingMessages?: string[];    // Queued messages for this task
    lastReportedToolCount?: number; // Last reported tool use count
    lastReportedTokenCount?: number; // Last reported token count
    progress?: TaskProgress;       // Progress information
    result?: AgentResult;          // For completed: result data
    error?: string;                // For failed: error message
    endTime?: number;              // Completion timestamp
    messages?: Message[];          // Message history (trimmed on completion)
}

interface TaskProgress {
    toolUseCount: number;          // Total tool calls made
    tokenCount: number;            // Total tokens used
    summary?: string;              // Current progress summary
}
```

---

## Background Agent Task Creation (Qn4)

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
    agentId,              // Pre-generated agent ID
    description,          // Short task description
    prompt,               // Full prompt for the agent
    selectedAgent,        // Resolved agent definition
    setAppState,          // State update function
    parentAbortController, // Parent's abort controller (for propagation)
    toolUseId             // Tool use ID for correlation
}) {
    // Step 1: Initialize output file
    initOutputFile(agentId, getAgentDirectory(agentId));  // Co

    // Step 2: Create abort controller (linked to parent if provided)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)  // Wm - linked abort
        : new AbortController();  // sK - standalone

    // Step 3: Build task record with all fields
    let taskRecord = {
        // Base fields from createTaskRecord
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),

        // Override status to running
        type: "local_agent",
        status: "running",

        // Agent-specific fields
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",

        // Execution control
        abortController: abortController,
        retrieved: false,

        // Progress tracking
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,

        // Background-specific
        isBackgrounded: true,
        pendingMessages: []
    };

    // Step 4: Register cleanup handler (called on kill/abort)
    let cleanupHandler = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);  // x66
    });
    taskRecord.unregisterCleanup = cleanupHandler;

    // Step 5: Register task in state
    registerTask(taskRecord, setAppState);  // Zf

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
//          Co→initOutputFile, RG→createTaskRecord, Wm→createChildAbortController,
//          sK→newAbortController, E4→registerCleanupHandler, x66→triggerAbortSignal,
//          Zf→registerTask
```

### Key Algorithm: Abort Controller Linking

**What it does:** Links child abort controller to parent so killing parent kills child.

**How it works:**
```javascript
function createChildAbortController(parentController) {
    let childController = new AbortController();

    // If parent is already aborted, abort child immediately
    if (parentController.signal.aborted) {
        childController.abort();
        return childController;
    }

    // Listen for parent abort and propagate to child
    parentController.signal.addEventListener("abort", () => {
        childController.abort();
    });

    return childController;
}
```

**Why this approach:**
- **Cascade termination** - Killing parent session kills all background tasks
- **No race conditions** - Child abort happens synchronously with parent
- **Memory efficient** - Event listener is cleaned up when child aborts

---

## Foreground Agent Task Creation (Un4)

### Complete Source Code

```javascript
// ============================================
// Un4 - createForegroundAgentTask - Create foreground agent task
// Location: chunks.146.mjs:2165-2226
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
                return {
                    ...Z,
                    tasks: {
                        ...Z.tasks,
                        [P]: {
                            ...G,
                            isBackgrounded: !0
                        }
                    }
                }
            });
            let W = lT6.get(P);
            if (W) W(), lT6.delete(P)
        }, _, z, A);
        M = () => clearTimeout(D)
    }
    return {
        taskId: A,
        backgroundSignal: J,
        cancelAutoBackground: M
    }
}

// READABLE (for understanding):
function createForegroundAgentTask({
    agentId,              // Pre-generated agent ID
    description,          // Short task description
    prompt,               // Full prompt for the agent
    selectedAgent,        // Resolved agent definition
    setAppState,          // State update function
    autoBackgroundMs,     // Optional: auto-background after this many ms
    toolUseId             // Tool use ID for correlation
}) {
    // Step 1: Initialize output file
    initOutputFile(agentId, getAgentDirectory(agentId));

    // Step 2: Create abort controller (standalone for foreground)
    let abortController = new AbortController();

    // Step 3: Register cleanup handler
    let cleanupHandler = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Step 4: Build task record
    let taskRecord = {
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
        isBackgrounded: false,    // Foreground initially
        pendingMessages: []
    };

    // Step 5: Create background signal promise
    // This promise resolves when the task should transition to background
    let resolveBackgroundSignal;
    let backgroundSignal = new Promise((resolve) => {
        resolveBackgroundSignal = resolve;
    });

    // Store resolver in global map for mid-run backgrounding
    backgroundSignalResolvers.set(agentId, resolveBackgroundSignal);

    // Step 6: Register task in state
    registerTask(taskRecord, setAppState);

    // Step 7: Setup auto-background timer if specified
    let cancelAutoBackground;
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timer = setTimeout((setAppState, taskId) => {
            // Update task state to backgrounded
            setAppState((state) => {
                let task = state.tasks[taskId];
                if (!isForegroundTask(task) || task.isBackgrounded) {
                    return state;
                }
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...task,
                            isBackgrounded: true
                        }
                    }
                };
            });

            // Trigger background signal
            let resolver = backgroundSignalResolvers.get(taskId);
            if (resolver) {
                resolver();
                backgroundSignalResolvers.delete(taskId);
            }
        }, autoBackgroundMs, setAppState, agentId);

        cancelAutoBackground = () => clearTimeout(timer);
    }

    return {
        taskId: agentId,
        backgroundSignal: backgroundSignal,
        cancelAutoBackground: cancelAutoBackground
    };
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→autoBackgroundMs, w→toolUseId,
//          Co→initOutputFile, RG→createTaskRecord, sK→newAbortController,
//          E4→registerCleanupHandler, x66→triggerAbortSignal, Zf→registerTask,
//          lT6→backgroundSignalResolvers, Sf→isForegroundTask
```

### Key Algorithm: Mid-Run Backgrounding

**What it does:** Allows seamless transition from foreground (blocking) to background (async) execution.

**How it works:**
1. **Background signal promise** - Created alongside task
2. **Promise.race** - Agent loop races between next message and background signal
3. **Resolver callback** - Stored in global map for triggering from UI
4. **State update** - `isBackgrounded: true` signals the transition

**Why this approach:**
- **Zero-loss transition** - No context lost during backgrounding
- **User control** - Can background at any time via UI
- **Auto-background** - Timer can auto-background after N ms
- **Clean handoff** - Agent loop continues, just yields to different consumer

---

## Task State Management

### atomicUpdateTask (i9)

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
function atomicUpdateTask(taskId, setAppState, updateFn) {
    setAppState((state) => {
        // Get current task
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task doesn't exist, no change

        // Apply update
        let updatedTask = updateFn(task);

        // If update returned same object, no change needed
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
    })), c36({
        type: "system",
        subtype: "task_started",
        task_id: A.id,
        tool_use_id: A.toolUseId,
        description: A.description,
        task_type: A.type,
        prompt: "prompt" in A ? A.prompt : void 0
    })
}

// READABLE (for understanding):
function registerTask(taskRecord, setAppState) {
    // Step 1: Add task to state
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [taskRecord.id]: taskRecord
        }
    }));

    // Step 2: Emit task_started event for telemetry/notifications
    emitSystemEvent({
        type: "system",
        subtype: "task_started",
        task_id: taskRecord.id,
        tool_use_id: taskRecord.toolUseId,
        description: taskRecord.description,
        task_type: taskRecord.type,
        prompt: "prompt" in taskRecord ? taskRecord.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→taskRecord, q→setAppState, c36→emitSystemEvent
```

### removeTask (VR)

```javascript
// ============================================
// VR - removeTask - Remove completed task
// Location: chunks.90.mjs:3037-3051
// ============================================

// ORIGINAL (for source lookup):
function VR(A, q) {
    q((K) => {
        let Y = K.tasks?.[A];
        if (!Y) return K;
        if (!LJ6(Y.status)) return K;
        if (!Y.notified) return K;
        let {
            [A]: z, ..._
        } = K.tasks;
        return {
            ...K,
            tasks: _
        }
    })
}

// READABLE (for understanding):
function removeTask(taskId, setAppState) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;               // Task doesn't exist
        if (!isTerminalTaskStatus(task.status)) return state;  // Not terminal
        if (!task.notified) return state;      // User not yet notified

        // Remove task from state using destructuring
        let { [taskId]: removed, ...remainingTasks } = state.tasks;

        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask, A→taskId, q→setAppState, LJ6→isTerminalTaskStatus
```

---

## Kill/Abort Mechanism

### triggerAbortSignal (x66)

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

        // Trigger abort
        task.abortController?.abort();

        // Run cleanup handler
        task.unregisterCleanup?.();

        // Update task record
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message to save memory
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file if task was killed
    if (wasRunning) {
        flushOutputFile(taskId);  // $O
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask,
//          $O→flushOutputFile
```

### killAllLocalAgents (U4q)

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local_agent tasks
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
        // Only kill local_agent tasks that are running
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
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
        // Don't re-notify
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only last message
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

---

## Completion Handlers

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
        // Only complete running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            // Keep only last message
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file
    flushOutputFile(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→agentId, i9→atomicUpdateTask,
//          $O→flushOutputFile
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
        // Only fail running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            // Keep only last message
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output file
    flushOutputFile(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, i9→atomicUpdateTask,
//          $O→flushOutputFile
```

---

## Progress Tracking

### updateTaskProgressWithTelemetry (nl4)

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
    let telemetryData = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture telemetry data
        telemetryData = {
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

    // Emit telemetry event if update happened
    if (telemetryData && shouldSendTelemetry()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = telemetryData;
        emitSystemEvent({
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
//          i9→atomicUpdateTask, Nn→shouldSendTelemetry, c36→emitSystemEvent
```

---

## Kill Handlers

### LocalAgentTaskHandler (Fk1)

```javascript
// ============================================
// Fk1 - LocalAgentTaskHandler - Kill handler for local agents
// Location: chunks.146.mjs:2292-2352
// ============================================

// ORIGINAL (for source lookup):
Fk1 = {
    name: "LocalAgentTask",
    type: "local_agent",
    async spawn(A, q) {
        let {
            prompt: K,
            description: Y,
            agentType: z,
            model: _,
            selectedAgent: w,
            agentId: O,
            toolUseId: $
        } = A, {
            setAppState: H
        } = q, j = O ?? oV("local_agent");
        Co(j, L0(X$(j)));
        let J = sK(),
            M = {
                ...RG(j, "local_agent", Y, $),
                type: "local_agent",
                status: "running",
                agentId: j,
                prompt: K,
                selectedAgent: w,
                agentType: z,
                model: _,
                abortController: J,
                retrieved: !1,
                lastReportedToolCount: 0,
                lastReportedTokenCount: 0,
                isBackgrounded: !0,
                pendingMessages: []
            },
            D = E4(async () => {
                x66(j, H)
            });
        return M.unregisterCleanup = D, Zf(M, H), {
            taskId: j,
            cleanup: () => {
                D(), J.abort()
            }
        }
    },
    async kill(A, q) {
        x66(A, q.setAppState)
    },
    renderStatus(A) {
        let q = A,
            K = q.status,
            Y = q.description,
            z = q.progress,
            _ = K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive",
            w = z ? ` (${z.toolUseCount} tools, ${z.tokenCount} tokens)` : "";
        return ml.createElement(m, null, ml.createElement(T, {
            color: _
        }, "[", K, "] ", Y, w))
    },
    renderOutput(A) {
        return ml.createElement(m, null, ml.createElement(T, null, A))
    }
};

// READABLE (for understanding):
const LocalAgentTaskHandler = {
    name: "LocalAgentTask",
    type: "local_agent",

    async spawn(config, context) {
        let {
            prompt,
            description,
            agentType,
            model,
            selectedAgent,
            agentId,
            toolUseId
        } = config;
        let { setAppState } = context;

        // Generate or use provided agent ID
        let taskId = agentId ?? generateTaskId("local_agent");

        // Initialize output file
        initOutputFile(taskId, getAgentDirectory(taskId));

        // Create abort controller
        let abortController = new AbortController();

        // Build task record
        let taskRecord = {
            ...createTaskRecord(taskId, "local_agent", description, toolUseId),
            type: "local_agent",
            status: "running",
            agentId: taskId,
            prompt: prompt,
            selectedAgent: selectedAgent,
            agentType: agentType,
            model: model,
            abortController: abortController,
            retrieved: false,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: true,
            pendingMessages: []
        };

        // Register cleanup handler
        let cleanupHandler = registerCleanupHandler(async () => {
            triggerAbortSignal(taskId, setAppState);
        });
        taskRecord.unregisterCleanup = cleanupHandler;

        // Register task
        registerTask(taskRecord, setAppState);

        return {
            taskId: taskId,
            cleanup: () => {
                cleanupHandler();
                abortController.abort();
            }
        };
    },

    async kill(taskId, context) {
        triggerAbortSignal(taskId, context.setAppState);
    },

    renderStatus(task) {
        let { status, description, progress } = task;
        let color = status === "running" ? "warning"
                  : status === "completed" ? "success"
                  : status === "failed" ? "error"
                  : "inactive";
        let stats = progress ? ` (${progress.toolUseCount} tools, ${progress.tokenCount} tokens)` : "";
        return `[${status}] ${description}${stats}`;
    },

    renderOutput(output) {
        return output;
    }
};

// Mapping: Fk1→LocalAgentTaskHandler, oV→generateTaskId, Co→initOutputFile,
//          RG→createTaskRecord, sK→newAbortController, E4→registerCleanupHandler,
//          x66→triggerAbortSignal, Zf→registerTask
```

---

## Related Documents

- [README.md](./README.md) - Module overview
- [task_state_machine_complete.md](./task_state_machine_complete.md) - State machine details
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers
- [progress_tracking_source_restored.md](./progress_tracking_source_restored.md) - Progress tracking
- [../08_subagent/agent_loop_complete_source.md](../08_subagent/agent_loop_complete_source.md) - Agent loop