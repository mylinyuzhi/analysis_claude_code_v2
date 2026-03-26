# Background Agents Key Algorithms Deep Dive V2 (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in the background agents system including task creation, output capture, kill handling, and progress throttling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `Qn4` - Create background agent task — `chunks.146.mjs:2133`
- `Un4` - Create foreground agent task — `chunks.146.mjs:2165`
- `oV` - Generate task ID — `chunks.41.mjs:2410`
- `g2` - Get output file path — `chunks.41.mjs:2248`
- `Z97` - Read output file delta — `chunks.41.mjs:2325`

---

## Algorithm 1: Task Creation (Qn4, Un4)

### Background Agent Creation (Qn4)

**What it does:** Creates a task that runs in the background immediately.

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask - Create background task
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
    // Step 1: Initialize output directory
    ensureOutputDirectory(agentId);  // Co

    // Step 2: Create abort controller
    // - If parent controller exists, create child (cascading abort)
    // - Otherwise, create independent controller
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)  // Wm
        : new AbortController();  // sK

    // Step 3: Build task record
    let task = {
        // Base record (id, type, status, description, etc.)
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),  // RG

        // Override and extend
        type: "local_agent",
        status: "running",  // Immediately running (not pending)

        // Agent details
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",

        // Execution control
        abortController: abortController,

        // Tracking state
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,

        // Key flag: This is a background task
        isBackgrounded: true,

        // Message queue for mid-run messages
        pendingMessages: []
    };

    // Step 4: Register cleanup handler
    // This ensures task is killed if process exits unexpectedly
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);  // x66
    });  // E4

    task.unregisterCleanup = unregisterCleanup;

    // Step 5: Register in state (sends telemetry)
    registerTask(task, setAppState);  // Zf

    return task;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
//          O→abortController, $→task, H→unregisterCleanup, Co→ensureOutputDirectory,
//          L0→createOutputDirectory, X$→getOutputDirPath, Wm→createChildAbortController,
//          sK→new AbortController, RG→createTaskRecord, E4→registerCleanupHandler,
//          x66→triggerAbortSignal, Zf→registerTask
```

### Foreground Agent Creation (Un4)

**What it does:** Creates a task that may transition to background later.

```javascript
// ============================================
// Un4 - createForegroundAgentTask - Create foreground task
// Location: chunks.146.mjs:2165-2210
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
        // ...
    }
    return { task: H, backgroundSignal: J }
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
    // Step 1: Initialize output directory
    ensureOutputDirectory(agentId);

    // Step 2: Create abort controller (always independent for foreground)
    let abortController = new AbortController();  // sK

    // Step 3: Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
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
        unregisterCleanup: unregisterCleanup,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,

        // Key difference: Not backgrounded initially
        isBackgrounded: false,

        pendingMessages: []
    };

    // Step 5: Create background signal promise
    // This allows the runner to detect when to transition to background
    let backgroundResolve;
    let backgroundSignal = new Promise((resolve) => {
        backgroundResolve = resolve;
    });

    // Store resolver for later use
    backgroundSignalResolvers.set(agentId, backgroundResolve);  // lT6

    // Step 6: Register task
    registerTask(task, setAppState);

    // Step 7: Set up auto-backgrounding timer (if specified)
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timer = setTimeout(() => {
            setAppState((state) => {
                let task = state.tasks[agentId];
                // Check if task is still running and not already backgrounded
                if (!isRunning(task) || task.isBackgrounded) return state;

                // Transition to background
                // ... set isBackgrounded: true, trigger backgroundResolve ...
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [agentId]: { ...task, isBackgrounded: true }
                    }
                };
            });
        }, autoBackgroundMs);

        // Store timer for cleanup
        // ...
    }

    return { task, backgroundSignal };
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→autoBackgroundMs, w→toolUseId,
//          O→abortController, $→unregisterCleanup, H→task, j→backgroundResolve,
//          J→backgroundSignal, lT6→backgroundSignalResolvers, Sf→isRunning
```

**Why two creation functions:**
- **Qn4**: Immediate background execution (no sync-to-async transition)
- **Un4**: Start synchronous, may transition to background
- **autoBackgroundMs**: Enables automatic backgrounding after timeout

---

## Algorithm 2: Task ID Generation (oV)

**What it does:** Generates unique, type-prefixed task IDs.

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
    // Step 1: Get type prefix
    let prefix = getTaskTypePrefix(taskType);  // k$3

    // Step 2: Generate 8 random bytes (cryptographic)
    let randomBytes = crypto.randomBytes(8);  // N$3

    // Step 3: Encode to alphanumeric
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";  // G97
    let taskId = prefix;

    for (let i = 0; i < 8; i++) {
        taskId += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→crypto.randomBytes, G97→ALPHABET
```

### Task Type Prefixes

```javascript
const TASK_TYPE_PREFIXES = {
    local_bash: "b",              // e.g., bx5n8q1w4
    local_agent: "a",             // e.g., ab3k7m9p2
    remote_agent: "r",            // e.g., rp9m2k5r8
    in_process_teammate: "t",     // e.g., tq3w7e5t9
    local_workflow: "w"           // e.g., wv2n5m8k1
};
// Unknown types get "x" prefix
```

---

## Algorithm 3: Output File Management

### getOutputFilePath (g2)

```javascript
// ============================================
// g2 - getOutputFilePath - Get output file path for task
// Location: chunks.41.mjs:2248-2250
// ============================================

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Example: /path/to/.claude/tasks/ab3k7m9p2.output
```

### readOutputFileDelta (Z97)

**What it does:** Reads incremental output from a task's output file.

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output
// Location: chunks.41.mjs:2325-2346
// ============================================

// READABLE (for understanding):
async function readOutputFileDelta(taskId, currentOffset, options = DEFAULT_OPTIONS) {
    try {
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),
            currentOffset,
            options
        );

        if (!result) {
            return { content: "", newOffset: currentOffset };
        }

        return {
            content: result.content,
            newOffset: currentOffset + result.bytesRead
        };

    } catch (error) {
        if (error.code === "ENOENT") {
            // File doesn't exist yet - task may not have started
            return { content: "", newOffset: currentOffset };
        }

        logError(error);
        return { content: "", newOffset: currentOffset };
    }
}
```

**Why incremental reading:**
- **Memory efficiency**: Don't load entire output file
- **Streaming support**: Output grows during execution
- **Progress tracking**: Know what's new since last read

---

## Algorithm 4: Progress Throttling

### Throttle Mechanism

**What it does:** Limits frequency of progress updates to reduce LLM context pollution.

```javascript
// ============================================
// Progress throttle logic
// ============================================

const PROGRESS_THROTTLE_TURNS = 3;

function shouldSendProgress(taskId, messages, lastProgressTurn) {
    // New tasks always get first progress
    if (lastProgressTurn === undefined) return true;

    // Count assistant turns since last progress
    let turnsSinceProgress = countAssistantTurnsSince(lastProgressTurn, messages);

    return turnsSinceProgress >= PROGRESS_THROTTLE_TURNS;
}

function countAssistantTurnsSince(lastTurnIndex, messages) {
    let count = 0;

    for (let i = messages.length - 1; i > lastTurnIndex; i--) {
        if (messages[i].type === "assistant") {
            count++;
        }
    }

    return count;
}
```

### Progress Update Flow

```
Subagent execution
        │
        ├── Each turn completes
        │   │
        │   └── nl4 (updateTaskProgressWithTelemetry)
        │       • Update task.progress.summary
        │       • Send telemetry event
        │
        ▼
Parent session (before LLM turn)
        │
        ├── Check throttle
        │   • turnsSinceProgress >= 3?
        │   • New task?
        │
        └── If allowed:
            • Generate task_progress attachment
            • Inject into LLM context
```

---

## Algorithm 5: Kill Handler Routing

### Handler Selection by Task Type

```javascript
// ============================================
// Kill handler routing
// ============================================

function getKillHandlerForType(taskType) {
    switch (taskType) {
        case "local_agent":
            return killLocalAgentTask;  // Fk1
        case "local_bash":
            return killLocalBashTask;   // wQ6
        case "in_process_teammate":
            return killInProcessTeammate;  // bZ1
        case "remote_agent":
            return killRemoteAgentTask;
        case "local_workflow":
            return killWorkflowTask;
        default:
            return null;
    }
}

// In kill flow:
function handleTaskKill(task, setAppState) {
    let handler = getKillHandlerForType(task.type);

    if (handler) {
        handler(task.id, setAppState);
    }
}
```

### Handler Implementations

**local_agent (Fk1):** Uses `x66` to abort and mark killed

**local_bash (wQ6):**
```javascript
function killLocalBashTask(taskId, setAppState) {
    // Bash tasks have child processes
    // Need to terminate process group

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Kill process group (negative PID)
        if (task.childProcess?.pid) {
            process.kill(-task.childProcess.pid, 'SIGTERM');
        }

        return {
            ...task,
            status: "killed",
            endTime: Date.now()
        };
    });
}
```

**in_process_teammate (bZ1):**
```javascript
function killInProcessTeammate(taskId, setAppState) {
    // Teammates run in same process
    // Need to abort the agent loop

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Abort the agent's abort controller
        task.abortController?.abort();

        return {
            ...task,
            status: "killed",
            endTime: Date.now()
        };
    });
}
```

---

## Algorithm 6: Task Eviction

### Eviction Conditions

A task is evicted when:
1. **Terminal status**: "completed", "failed", or "killed"
2. **User notified**: `notified` flag is true
3. **Output read**: All output has been consumed

### Eviction Flow

```javascript
// In pollTaskOutputs (wY4):

for (let task of Object.values(tasks)) {
    if (task.notified) {
        switch (task.status) {
            case "completed":
            case "failed":
            case "killed":
                evictedTaskIds.push(task.id);
                continue;
        }
    }
}

// In updateTaskState (OY4):

for (let taskId of evictedTaskIds) {
    if (tasks[taskId]) {
        delete tasks[taskId];
    }
}
```

**Why require notification:**
- **User awareness**: User must see completion/failure message
- **Output preservation**: Allows final output reading
- **Clean state**: Removes only after all processing done

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |

---

## Related Documents

- [ui_interaction_complete_v3.md](./ui_interaction_complete_v3.md) - UI interaction
- [system_reminder_integration_v4.md](./system_reminder_integration_v4.md) - System reminder integration
- [cross_feature_linkages_complete_v2.md](./cross_feature_linkages_complete_v2.md) - Feature integrations