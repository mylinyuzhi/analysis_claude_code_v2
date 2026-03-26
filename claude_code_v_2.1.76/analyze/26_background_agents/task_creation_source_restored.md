# Task Creation — Source-Level Analysis (Claude Code 2.1.76)

> Complete source-level restoration of task creation functions for subagents and background agents.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `createTaskId` (oV) - Generate unique task ID with type prefix — `chunks.41.mjs:2410`
- `createTaskRecord` (RG) - Create base task record object — `chunks.41.mjs:2418`
- `createBackgroundAgentTask` (Qn4) - Create background agent task — `chunks.146.mjs:2133`
- `createForegroundAgentTask` (Un4) - Create foreground agent task — `chunks.146.mjs:2165`
- `getOutputFilePath` (g2) - Get output file path for task — `chunks.41.mjs:2248`
- `registerTask` (Zf) - Register task in state — `chunks.90.mjs:3019`

---

## Task ID Generation Algorithm

### What it does

Generates unique task IDs with type-specific prefixes for different task categories.

### How it works

```javascript
// ============================================
// oV - createTaskId - Generate unique task ID with type prefix
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
function createTaskId(taskType) {
    // Get prefix for task type
    let prefix = getPrefixForTaskType(taskType);

    // Generate 8 random bytes
    let randomBytes = cryptoRandomBytes(8);

    // Build ID: prefix + 8 random alphanumeric characters
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += ALPHANUMERIC[randomBytes[i] % ALPHANUMERIC.length];
    }
    return taskId;
}

// Mapping: oV→createTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId
```

### Task Type Prefixes

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task type to prefix mapping
// Location: chunks.41.mjs:2438-2444
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
    local_bash: "b",           // Shell commands
    local_agent: "a",          // Background/sync agents
    remote_agent: "r",         // Remote session agents
    in_process_teammate: "t",  // Teammate agents
    local_workflow: "w"        // Workflow tasks
};

// Example IDs:
// - "a3f8b2c1" = local_agent
// - "b7e4d9f2" = local_bash
// - "t1a3c5e7" = in_process_teammate
```

**Why this approach:**
- **Visual identification** - Users can instantly identify task type from ID
- **Collision avoidance** - Different prefixes prevent ID collisions across types
- **Debugging aid** - Logs show task type in ID

---

## Task Record Creation

### What it does

Creates the base task record object with all required fields for state management.

### How it works

```javascript
// ============================================
// RG - createTaskRecord - Create base task record object
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
        id: taskId,
        type: taskType,
        status: "pending",           // Initial status
        description: description,
        toolUseId: toolUseId,
        startTime: Date.now(),
        outputFile: getOutputFilePath(taskId),  // ~/.claude/tasks/{id}.output
        outputOffset: 0,             // Current read position
        notified: false              // Has user been notified?
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId
```

**Key insight:** All tasks share this base structure regardless of type. Type-specific fields are added during the specialized creation functions.

---

## Output File Path Generation

### What it does

Generates the file path for task output storage.

### How it works

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
    // yJ6() returns ~/.claude/tasks/
    // D97 is path.join
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Example: /home/user/.claude/tasks/a3f8b2c1.output
```

---

## Background Agent Task Creation

### What it does

Creates a task record for an agent that runs in the background from the start.

### How it works

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
    // Initialize output file
    initOutputFile(agentId);

    // Create abort controller - child of parent or new
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : createAbortController();

    // Build complete task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",               // Immediately running
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,            // Key: always backgrounded
        pendingMessages: []
    };

    // Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    taskRecord.unregisterCleanup = unregisterCleanup;

    // Register in app state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId
```

**Why this approach:**
- **Immediate running state** - Background tasks start running immediately
- **Abort controller** - Allows graceful termination
- **Cleanup registration** - Ensures resources are freed on completion/failure
- **isBackgrounded flag** - Distinguishes explicit background from foreground-then-backgrounded

---

## Foreground Agent Task Creation

### What it does

Creates a task record for an agent that starts in the foreground but can be backgrounded mid-execution.

### How it works

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
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    autoBackgroundMs,
    toolUseId
}) {
    // Initialize output file
    initOutputFile(agentId);

    // Create abort controller
    let abortController = createAbortController();

    // Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Build task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        unregisterCleanup: unregisterCleanup,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: false,           // Key: NOT initially backgrounded
        pendingMessages: []
    };

    // Create background signal promise for mid-run backgrounding
    let resolveBackgroundSignal;
    let backgroundSignal = new Promise((resolve) => {
        resolveBackgroundSignal = resolve;
    });

    // Store resolver for later use
    backgroundSignalResolvers.set(agentId, resolveBackgroundSignal);

    // Register task in state
    registerTask(taskRecord, setAppState);

    // Set up auto-background timer if specified
    let cancelAutoBackground;
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timeoutId = setTimeout((setAppState, taskId) => {
            // Update task to backgrounded state
            setAppState((state) => {
                let task = state.tasks[taskId];
                if (!isRunning(task) || task.isBackgrounded) return state;
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

            // Resolve background signal
            let resolver = backgroundSignalResolvers.get(taskId);
            if (resolver) resolver();
            backgroundSignalResolvers.delete(taskId);
        }, autoBackgroundMs, setAppState, agentId);

        cancelAutoBackground = () => clearTimeout(timeoutId);
    }

    return {
        taskId: agentId,
        backgroundSignal: backgroundSignal,
        cancelAutoBackground: cancelAutoBackground
    };
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→autoBackgroundMs, w→toolUseId
```

**Key insight:** The foreground task creation returns a `backgroundSignal` promise that resolves when the task transitions to background. The agent loop uses `Promise.race()` to detect this transition.

---

## Mid-Run Backgrounding Mechanism

### Algorithm Explanation

The `autoBackgroundMs` parameter enables automatic backgrounding after a timeout:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Foreground Task Creation                                   │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Create task with isBackgrounded: false                                      │
│  Create backgroundSignal Promise                                              │
│  Set up autoBackground timer (if autoBackgroundMs specified)                │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Agent Loop Execution                                       │
│                                                                              │
│  while (running) {                                                          │
│      let result = await Promise.race([                                      │
│          nextMessage(),           // Normal message processing              │
│          backgroundSignal         // Transition to background               │
│      ]);                                                                     │
│                                                                              │
│      if (result === backgroundSignal) {                                     │
│          // Transition to background mode                                   │
│          isBackgrounded = true;                                             │
│          yield { type: "async_launched", ... };                             │
│      }                                                                       │
│  }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why this approach:**
- **Non-blocking transition** - No restart required
- **User control** - Timeout can be adjusted per task
- **State consistency** - Promise ensures atomic transition

---

## Comparison: Background vs Foreground Task Creation

| Aspect | Background (Qn4) | Foreground (Un4) |
|--------|------------------|------------------|
| `isBackgrounded` | `true` immediately | `false` initially |
| `autoBackgroundMs` | Not applicable | Supported |
| `backgroundSignal` | Not returned | Returned for Promise.race |
| Parent abort controller | Can inherit | Always independent |
| Use case | Explicit backgrounding | Sync→Async transition |

---

## Task Record Complete Structure

```typescript
interface TaskRecord {
    // Base fields (from createTaskRecord)
    id: string;                    // Task ID with type prefix
    type: TaskType;               // "local_agent" | "local_bash" | etc.
    status: TaskStatus;           // "pending" | "running" | "completed" | "failed" | "killed"
    description: string;          // User-visible description
    toolUseId: string;            // ID of the tool call that created this task
    startTime: number;            // Creation timestamp
    outputFile: string;           // Path to output file
    outputOffset: number;         // Current read position
    notified: boolean;            // Has user been notified of completion?

    // Agent-specific fields
    agentId?: string;             // ID of the agent (same as id for agents)
    prompt?: string;              // The prompt given to the agent
    selectedAgent?: AgentDefinition;  // The resolved agent definition
    agentType?: string;           // "general-purpose" | "Explore" | "Plan" | etc.
    abortController?: AbortController;  // For cancellation
    unregisterCleanup?: () => void;     // Cleanup handler
    retrieved?: boolean;          // Has output been retrieved?
    lastReportedToolCount?: number;     // For progress tracking
    lastReportedTokenCount?: number;    // For progress tracking
    isBackgrounded?: boolean;     // Is this task running in background?
    pendingMessages?: any[];      // Messages waiting to be processed
    result?: any;                 // Final result (when completed)
    error?: string;               // Error message (when failed)
    endTime?: number;             // Completion timestamp
    messages?: any[];             // Truncated message history
    progress?: {
        toolUseCount: number;
        tokenCount: number;
        summary?: string;
    };
}
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | createTaskId | chunks.41.mjs:2410 | ✅ Verified |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | ✅ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✅ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✅ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✅ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✅ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✅ Verified |
| `G97` | ALPHANUMERIC | chunks.41.mjs:2434 | ✅ Verified |