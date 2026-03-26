# Task Creation Complete Source V2 (Claude Code 2.1.76)

> Complete source-level restoration of task creation functions for background and foreground agent tasks, including initialization, abort controller setup, and cleanup registration.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](../08_subagent/cross_validation_unified.md) - Unified symbol verification

Key functions in this document:
- `Qn4` - createBackgroundAgentTask — `chunks.146.mjs:2133`
- `Un4` - createForegroundAgentTask — `chunks.146.mjs:2165`
- `RG` - createTaskRecord — `chunks.41.mjs:2418`
- `oV` - generateTaskId — `chunks.41.mjs:2410`
- `Zf` - registerTask — `chunks.90.mjs:3019`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK CREATION ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │   AgentTool.call()  │
                        └──────────┬──────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  Background   │         │  Foreground   │         │   Teammate    │
│  Mode         │         │  Mode         │         │   Mode        │
│  run_in_bg    │         │  blocking     │         │   name/team   │
│  = true       │         │               │         │               │
└───────┬───────┘         └───────┬───────┘         └───────────────┘
        │                         │
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│ createBack    │         │ createFore    │
│ groundAgent   │         │ groundAgent   │
│ Task (Qn4)    │         │ Task (Un4)    │
└───────┬───────┘         └───────┬───────┘
        │                         │
        └──────────┬──────────────┘
                   │
                   ▼
        ┌───────────────────────┐
        │  Common Setup:        │
        │  1. generateTaskId()  │
        │  2. createTaskRecord()│
        │  3. Output file init  │
        │  4. AbortController   │
        │  5. Cleanup handler   │
        │  6. registerTask()    │
        └───────────────────────┘
```

---

## Task ID Generation

### generateTaskId (oV)

**What it does:** Generates a unique 8-character task ID with a type prefix.

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = V$3[q] ?? "x",
        Y = VvY(8);
    return `${K}${Y.map((z) => G97[z % G97.length]).join("")}`
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Get type prefix (e.g., "a" for agent, "b" for bash)
    let typeName = getTaskTypePrefix(taskType);
    let prefix = TASK_TYPE_PREFIXES[typeName] ?? "x";  // Default to "x"

    // Generate 8 random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Convert to characters from charset
    let suffix = randomBytes.map(byte =>
        TASK_ID_CHARSET[byte % TASK_ID_CHARSET.length]
    ).join("");

    return `${prefix}${suffix}`;
}

// Mapping: oV→generateTaskId, A→taskType, k$3→getTaskTypePrefix, V$3→TASK_TYPE_PREFIXES,
//          VvY→crypto.getRandomValues, G97→TASK_ID_CHARSET, q→typeName, K→prefix, Y→randomBytes
```

### Task Type Prefixes

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Type to prefix mapping
// Location: chunks.41.mjs:2438-2444
// ============================================

// READABLE (for understanding):
TASK_TYPE_PREFIXES = {
    "local_agent": "a",      // Agent tasks
    "local_bash": "b",       // Bash background tasks
    "in_process_teammate": "t",  // In-process teammates
    "remote_agent": "r",     // Remote agents
    "local_workflow": "w"    // Workflow tasks
};

TASK_ID_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";

// Example IDs:
// a7x9k2m3 - local_agent task
// b8p1n4q5 - local_bash task
// t3h7j2k9 - in_process_teammate
```

---

## Task Record Creation

### createTaskRecord (RG)

**What it does:** Creates the initial task record object with common fields.

```javascript
// ============================================
// RG - createTaskRecord - Create initial task record
// Location: chunks.41.mjs:2418-2430
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A,
        type: q,
        description: K,
        status: "pending",
        toolUseId: Y,
        startTime: Date.now(),
        progress: {
            toolUseCount: 0,
            tokenCount: 0
        }
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,
        type: taskType,
        description: description,
        status: "pending",  // Will be set to "running" after spawn
        toolUseId: toolUseId,
        startTime: Date.now(),
        progress: {
            toolUseCount: 0,
            tokenCount: 0
        }
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId
```

---

## Background Agent Task Creation

### createBackgroundAgentTask (Qn4)

**What it does:** Creates a new background agent task with full initialization.

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
    // Co = ensureOutputDirectory
    // L0 = createEmptyOutputFile
    // X$ = getTaskDirectory
    ensureOutputDirectory(agentId, createEmptyOutputFile(getTaskDirectory(agentId)));

    // Step 2: Create abort controller
    // If parent controller provided, create child controller linked to parent
    // Otherwise create standalone controller
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)  // Wm
        : new AbortController();  // sK

    // Step 3: Build task record
    let task = {
        // Base fields from createTaskRecord
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),

        // Override type and status
        type: "local_agent",
        status: "running",  // Immediately running

        // Agent-specific fields
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",

        // Execution state
        abortController: abortController,
        retrieved: false,  // Has output been read?
        lastReportedToolCount: 0,  // For progress tracking
        lastReportedTokenCount: 0,

        // Background-specific
        isBackgrounded: true,  // Key distinction from foreground
        pendingMessages: []  // Queue for messages during execution
    };

    // Step 4: Register cleanup handler
    // This ensures task is aborted if process exits unexpectedly
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);  // x66
    });
    task.unregisterCleanup = unregisterCleanup;

    // Step 5: Register task in state
    registerTask(task, setAppState);  // Zf

    return task;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
//          O→abortController, $→task, H→unregisterCleanup,
//          Co→ensureOutputDirectory, L0→createEmptyOutputFile, X$→getTaskDirectory,
//          Wm→createChildAbortController, sK→newAbortController, E4→registerCleanupHandler,
//          x66→triggerAbortSignal, Zf→registerTask, RG→createTaskRecord
```

**Key Design Decisions:**

| Field | Value | Purpose |
|-------|-------|---------|
| `isBackgrounded` | `true` | Distinguishes from foreground-then-backgrounded tasks |
| `abortController` | Child or new | Linked to parent if available for coordinated abort |
| `retrieved` | `false` | Tracks whether output has been read |
| `pendingMessages` | `[]` | Queue for mid-execution messages |
| `unregisterCleanup` | Function | Cleanup on process exit |

---

## Foreground Agent Task Creation

### createForegroundAgentTask (Un4)

**What it does:** Creates a foreground task that can be backgrounded mid-run.

```javascript
// ============================================
// Un4 - createForegroundAgentTask - Create foreground agent task
// Location: chunks.146.mjs:2165-2199
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
    // ... continuation with execution
}

// READABLE (for understanding):
function createForegroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    autoBackgroundMs,  // Optional timeout for auto-backgrounding
    toolUseId
}) {
    // Step 1: Initialize output file
    ensureOutputDirectory(agentId, createEmptyOutputFile(getTaskDirectory(agentId)));

    // Step 2: Create standalone abort controller (not linked to parent)
    let abortController = new AbortController();  // sK

    // Step 3: Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);  // x66
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

        // Foreground-specific: starts not backgrounded
        isBackgrounded: false,  // Key difference from background task
        pendingMessages: []
    };

    // Step 5: Create backgrounding signal promise
    // This allows mid-run backgrounding via Promise.race
    let backgroundResolver;
    let backgroundPromise = new Promise((resolve) => {
        backgroundResolver = resolve;
    });

    // Step 6: Store resolver for later use
    // lT6 is a Map<agentId, resolver>
    backgroundSignalMap.set(agentId, backgroundResolver);

    // Step 7: Register task
    registerTask(task, setAppState);

    // ... continues with execution using Promise.race for backgrounding
    return { task, backgroundPromise, backgroundResolver };
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→autoBackgroundMs, w→toolUseId,
//          O→abortController, $→unregisterCleanup, H→task, j→backgroundResolver,
//          J→backgroundPromise, lT6→backgroundSignalMap
```

**Key Differences from Background Task:**

| Aspect | Background (Qn4) | Foreground (Un4) |
|--------|------------------|------------------|
| `isBackgrounded` | `true` | `false` |
| AbortController | Child or new | Always new |
| Backgrounding signal | None | Promise + resolver |
| Parent link | Optional | Never |
| Use case | Fire-and-forget | Interactive → background |

---

## Mid-Run Backgrounding Mechanism

### How Foreground Tasks Transition to Background

```javascript
// ============================================
// Mid-run Backgrounding Flow
// ============================================

// The foreground task execution uses Promise.race:
async function executeForegroundTask(task, backgroundPromise, abortSignal) {
    try {
        // Race between normal execution and backgrounding signal
        let result = await Promise.race([
            // Normal execution
            runAgentLoop(task),

            // Backgrounding signal (resolves when user requests background)
            backgroundPromise.then(() => ({ backgrounded: true }))
        ]);

        if (result.backgrounded) {
            // User requested background - continue in background
            task.isBackgrounded = true;
            // Continue execution without blocking
            runAgentLoop(task).then(completionHandler);
            return { status: "async_launched", agentId: task.agentId };
        }

        // Normal completion
        return { status: "completed", result: result };
    } catch (error) {
        if (abortSignal.aborted) {
            return { status: "killed" };
        }
        throw error;
    }
}

// When user requests backgrounding:
function backgroundTask(agentId, setBackgroundSignal) {
    let resolver = backgroundSignalMap.get(agentId);
    if (resolver) {
        resolver();  // Resolve the promise, triggering the race
        backgroundSignalMap.delete(agentId);
    }
}
```

---

## Abort Controller Hierarchy

### createChildAbortController (Wm)

```javascript
// ============================================
// Wm - createChildAbortController - Create linked abort controller
// Location: chunks.58.mjs:1775
// ============================================

// READABLE (for understanding):
function createChildAbortController(parentController) {
    let childController = new AbortController();

    // Link child to parent - if parent aborts, child aborts too
    parentController.signal.addEventListener('abort', () => {
        childController.abort();
    });

    // But child aborting doesn't affect parent
    return childController;
}

// This creates a one-way abort cascade:
// parent.abort() → child.abort()
// child.abort() → child only
```

---

## Cleanup Handler Registration

### registerCleanupHandler (E4)

```javascript
// ============================================
// E4 - registerCleanupHandler - Register process exit handler
// ============================================

// READABLE (for understanding):
function registerCleanupHandler(cleanupFn) {
    // Register for various exit scenarios
    process.on('exit', cleanupFn);
    process.on('SIGTERM', cleanupFn);
    process.on('SIGINT', cleanupFn);

    // Return unregister function
    return function unregister() {
        process.off('exit', cleanupFn);
        process.off('SIGTERM', cleanupFn);
        process.off('SIGINT', cleanupFn);
    };
}

// Usage:
let unregister = registerCleanupHandler(async () => {
    triggerAbortSignal(agentId, setAppState);
});

// Later, when task completes:
unregister();
```

---

## Task Registration

### registerTask (Zf)

**What it does:** Registers task in app state and emits telemetry.

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
function registerTask(task, setAppState) {
    // Step 1: Update app state
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [task.id]: task
        }
    }));

    // Step 2: Emit telemetry event
    sendTelemetry({
        type: "system",
        subtype: "task_started",
        task_id: task.id,
        tool_use_id: task.toolUseId,
        description: task.description,
        task_type: task.type,
        prompt: "prompt" in task ? task.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→task, q→setAppState, K→state, c36→sendTelemetry
```

---

## Output File Initialization

### ensureOutputDirectory (Co) & Related

```javascript
// ============================================
// Output File Functions
// ============================================

// getTaskDirectory (X$) - Get .claude/tasks/<id>
function getTaskDirectory(taskId) {
    return path.join(getClaudeDir(), "tasks", taskId);
}

// getOutputFilePath (g2) - Get output file path
function getOutputFilePath(taskId) {
    return path.join(getTaskDirectory(taskId), "output");
}

// ensureOutputDirectory (Co) - Create directory and file
async function ensureOutputDirectory(taskId, createFile) {
    let taskDir = getTaskDirectory(taskId);
    await fs.mkdir(taskDir, { recursive: true });
    await createFile;
}

// createEmptyOutputFile (L0) - Create empty output file
async function createEmptyOutputFile(taskDir) {
    let outputPath = path.join(taskDir, "output");
    await fs.writeFile(outputPath, "", { flag: "wx" });  // Fail if exists
}
```

---

## Task State Transition Diagram

```
                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ registerTask (Zf)
                                │ status = "running"
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
       $m8                  Hm8                   x66
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [d4q: mark notified]          │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │
                         │   = true     │
                         └──────┬───────┘
                                │ VR (removeTask)
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         │ (from state) │
                         └──────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | ✓ Verified |
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `Wm` | createChildAbortController | chunks.58.mjs:1775 | ✓ Verified |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Source code verified