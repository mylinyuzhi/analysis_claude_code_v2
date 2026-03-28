# Background Agents Feature Integration Complete (Claude Code 2.1.76)

> Comprehensive cross-feature integration analysis with source-level code restoration.
> Documents all integration points with detailed data flows, error handling, and test scenarios.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getUnifiedTasksAttachment` (vIY) - Main attachment producer — `chunks.142.mjs:2719`
- `buildTaskAttachments` (di4) - Builds task attachments — `chunks.142.mjs:1711`
- `createBackgroundAgentTask` (Qn4) — `chunks.146.mjs:2133`
- `createForegroundAgentTask` (Un4) — `chunks.146.mjs:2165`
- `triggerAbortSignal` (x66) — `chunks.146.mjs:2012`
- `killAllLocalAgents` (U4q) — `chunks.146.mjs:2029`
- `getOutputFilePath` (g2) — `chunks.41.mjs:2248`

---

## Integration Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Background Agents Integration Ecosystem                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌───────────────────┐                              │
│                          │ 26_background_    │                              │
│                          │ agents            │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                        │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 04_system_  │            │ 05_tools    │              │ 01_cli      │    │
│ │ reminder    │            │ BashTool    │              │ /tasks      │    │
│ │ (vIY, di4)  │            │ AgentTool   │              │ Ctrl+C/F    │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 07_compact  │            │ 17_hooks    │              │ 15_state    │    │
│ │ Transcript  │            │ Pre/Post    │              │ Management  │    │
│ │ Filtering   │            │ Tool Hooks  │              │ (Zf, i9)    │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 08_subagent │            │ 32_keybinds │              │ 17_telemetry│    │
│ │ Spawn       │            │ Kill Ctrl+F │              │ Progress    │    │
│ │ (Qn4, Un4)  │            │ (U4q)       │              │ (nl4)       │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration 1: System Reminder System (04_system_reminder)

### Purpose
Background task status is communicated to the parent session through system reminder attachments.

### Integration Points

#### 1.1 Main Attachment Producer

```javascript
// ============================================
// vIY - getUnifiedTasksAttachment - Main attachment producer
// Location: chunks.142.mjs:2719-2780
// ============================================

// ORIGINAL (for source lookup):
async function vIY(A, q, K) {
    let Y = Object.values(q.tasks);
    if (Y.length === 0) return [];

    let z = TIY(K),
        _ = [];
    for (let w of Y) {
        if (w.status === "running") {
            let O = z.get(w.id) ?? 1 / 0;
            if (O >= 3 && w.progress?.summary) {
                _.push(buildProgressAttachment(w));
                i9(w.id, A, (H) => ({
                    ...H,
                    progress: {
                        ...H.progress,
                        lastReportedTurn: K.length
                    }
                }));
            }
        } else if (!w.notified && LJ6(w.status)) {
            let O = await wY4(w.id, w.outputOffset);
            _.push(buildStatusAttachment(w, O));
            i9(w.id, A, (H) => ({ ...H, notified: !0 }));
        }
    }
    return _
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(setAppState, appState, messages) {
    let tasks = Object.values(appState.tasks);
    if (tasks.length === 0) return [];

    // Calculate turns since last progress for each task
    // NOTE: TIY is countUniqueUris (LSP), not this turn-counting logic
    let turnsSinceProgress = countTurnsSinceLastProgressInline(messages);
    let attachments = [];

    for (let task of tasks) {
        if (task.status === "running") {
            // RUNNING TASK: Check throttle
            let turns = turnsSinceProgress.get(task.id) ?? Infinity;

            if (turns >= 3 && task.progress?.summary) {
                // Throttle passed, generate progress attachment
                attachments.push(buildProgressAttachment(task));

                // Update last reported turn
                atomicUpdateTask(task.id, setAppState, (t) => ({
                    ...t,
                    progress: {
                        ...t.progress,
                        lastReportedTurn: messages.length
                    }
                }));
            }
        } else if (!task.notified && isTerminalTaskStatus(task.status)) {
            // TERMINAL TASK: Generate status attachment with delta output
            let deltaOutput = await pollTaskOutputs(task.id, task.outputOffset);
            attachments.push(buildStatusAttachment(task, deltaOutput));

            // Mark as notified
            atomicUpdateTask(task.id, setAppState, (t) => ({
                ...t,
                notified: true
            }));
        }
    }

    return attachments;
}

// Mapping: vIY→getUnifiedTasksAttachment, A→setAppState, q→appState, K→messages,
//          NOTE: TIY is countUniqueUris (LSP), not progress throttling.
//          The turn-counting logic is inlined in vIY. LJ6→isTerminalTaskStatus,
//          wY4→pollTaskOutputs, i9→atomicUpdateTask
```

#### 1.2 Progress Throttle Calculation

```javascript
// ============================================
// Progress turn-counting algorithm (inline in vIY, NOT TIY)
// TIY is countUniqueUris (LSP URI counting), not progress throttling
// Location: chunks.142.mjs:2703-2717
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = new Map(),
        K = new Set(),
        Y = 0;
    for (let z = A.length - 1; z >= 0; z--) {
        let _ = A[z];
        if (_?.role === "assistant" && !aY(_)) Y++;
        else if (_?.type === "attachment" && _?.attachment?.type === "task_progress") {
            let w = _?.attachment?.taskId;
            w && !K.has(w) && (q.set(w, Y), K.add(w))
        }
    }
    return q
}

// READABLE (for understanding):
function countTurnsSinceLastProgressInline(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.role === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" &&
                 message.attachment?.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }
    return turnsSinceProgress;
}

// NOTE: TIY is countUniqueUris (LSP), NOT this function. This logic is inlined in vIY.
// Mapping: A→messages, q→turnsSinceProgress, K→seenTasks, Y→turnCount, aY→isWhitespaceOnly
```

#### 1.3 Task Output Polling

```javascript
// ============================================
// wY4 - pollTaskOutputs - Read new output from task output file
// Location: chunks.90.mjs:3058-3080
// ============================================

// ORIGINAL (for source lookup):
async function wY4(A, q) {
    let K = g2(A);
    if (!fs.existsSync(K)) return "";
    let Y = fs.statSync(K).size;
    if (Y <= q) return "";
    let z = fs.createReadStream(K, { start: q, end: Y - 1 });
    return await streamToString(z)
}

// READABLE (for understanding):
async function pollTaskOutputs(taskId, outputOffset) {
    let outputPath = getOutputFilePath(taskId);

    if (!fs.existsSync(outputPath)) {
        return "";
    }

    let fileSize = fs.statSync(outputPath).size;

    // No new output since last check
    if (fileSize <= outputOffset) {
        return "";
    }

    // Read only the delta (new bytes)
    let stream = fs.createReadStream(outputPath, {
        start: outputOffset,
        end: fileSize - 1
    });

    return await streamToString(stream);
}

// Mapping: wY4→pollTaskOutputs, A→taskId, q→outputOffset, K→outputPath,
//          Y→fileSize, z→stream, g2→getOutputFilePath
```

### Attachment Types

#### task_progress Attachment

```xml
<task_progress>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "pattern"...</message>
</task_progress>
```

**Trigger conditions:**
- Task status is "running"
- ≥3 assistant turns since last progress
- Progress summary exists

#### task_status Attachment

```xml
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase</description>
  <delta_summary>Found 15 occurrences in 8 files...</delta_summary>
</task_status>
```

**Trigger conditions:**
- Task status is terminal (completed/failed/killed)
- Not yet notified (`notified: false`)

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    System Reminder Integration Flow                          │
└─────────────────────────────────────────────────────────────────────────────┘

Background Task Execution
        │
        ├── Progress Update (nl4)
        │   │
        │   └── Update task.progress in appState
        │       { toolUseCount, tokenCount, summary }
        │
        └── Completion ($m8/Hm8/d4q)
            │
            └── Update task.status
                Set task.notified = false

Parent Session (before LLM turn)
        │
        ▼
getUnifiedTasksAttachment (vIY)
        │
        ├── For each task in appState.tasks:
        │   │
        │   ├── RUNNING task:
        │   │   ├── Check turnsSinceProgress >= 3
        │   │   ├── If true: generate task_progress
        │   │   └── Update lastReportedTurn
        │   │
        │   └── TERMINAL task:
        │       ├── Check !task.notified
        │       ├── pollTaskOutputs() for delta
        │       ├── Generate task_status
        │       └── Set notified = true
        │
        ▼
Return attachments array
        │
        ▼
Injected into conversation as system-reminder
```

---

## Integration 2: Tools System (05_tools)

### Purpose
Tool execution modes that support background operation.

### Integration Points

#### 2.1 BashTool Background Modes

```javascript
// ============================================
// BashTool - Three backgrounding modes
// Location: chunks.133.mjs (BashTool implementation)
// ============================================

// READABLE (for understanding):
const BashTool = {
    name: "Bash",

    async call({ command, timeout, run_in_background }, context) {
        // MODE 1: Explicit background
        if (run_in_background === true && !BACKGROUND_TASKS_DISABLED) {
            let taskId = createTaskId("local_bash");
            await initOutputFile(taskId);

            let task = {
                ...createTaskEntry(taskId, "local_bash", command),
                status: "running",
                command: command,
                abortController: new AbortController()
            };

            registerTask(task, context.setAppState);

            // Spawn shell process
            let process = spawn(command, { shell: true });
            pipeOutputToFile(process, task.outputFile);

            return {
                stdout: "",
                stderr: "",
                code: 0,
                backgroundTaskId: taskId,
                outputFile: task.outputFile
            };
        }

        // MODE 2: Timeout-based backgrounding
        if (timeout) {
            let deadline = Date.now() + timeout;
            let result = await Promise.race([
                executeCommand(command),
                sleepUntil(deadline)
            ]);

            if (!result) {
                // Timeout exceeded, show background hint
                showBackgroundHint();
            }
        }

        // MODE 3: User interrupt background
        // Handled in abortController.signal.aborted check
    }
};
```

#### 2.2 AgentTool Background Mode

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask - Spawn background agent
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
        ...createTaskEntry(agentId, "local_agent", description, toolUseId),
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
        isBackgrounded: true,  // KEY: Explicit background
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

#### 2.3 Foreground Task with Auto-Background

```javascript
// ============================================
// Un4 - createForegroundAgentTask (may auto-background)
// Location: chunks.146.mjs:2165-2250
// ============================================

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
        abortController: abortController,
        unregisterCleanup: registerCleanupHandler(() => triggerAbortSignal(agentId, setAppState)),
        retrieved: false,
        isBackgrounded: false,  // KEY: Foreground initially
        pendingMessages: []
    };

    // Step 4: Set up auto-background timer if specified
    let backgroundResolve;
    let backgroundPromise = new Promise((resolve) => {
        backgroundResolve = resolve;
    });

    if (autoBackgroundMs) {
        setTimeout(() => {
            atomicUpdateTask(agentId, setAppState, (task) => ({
                ...task,
                isBackgrounded: true
            }));
            backgroundResolve({ type: "background" });
        }, autoBackgroundMs);
    }

    // Step 5: Register in app state
    registerTask(taskRecord, setAppState);

    return { taskRecord, backgroundPromise, backgroundResolve };
}

// Mapping: Un4→createForegroundAgentTask
```

### Tool Access Control

| Tool | Background Access | Reason |
|------|------------------|--------|
| `TaskOutput` | ❌ Blocked | Prevent polling loops |
| `ExitPlanMode` | ❌ Blocked | Requires user approval |
| `EnterPlanMode` | ❌ Blocked | Requires user approval |
| `Agent` | ❌ Blocked | Prevent nested background |
| `AskUserQuestion` | ❌ Blocked | Would block indefinitely |
| `TaskStop` | ❌ Blocked | Background shouldn't manage tasks |
| `Read` | ✅ Allowed | Read-only |
| `Write` | ✅ Allowed | File creation |
| `Edit` | ✅ Allowed | File modification |
| `Bash` | ✅ Allowed | Shell commands |
| `Grep` | ✅ Allowed | Content search |
| `Glob` | ✅ Allowed | File search |
| `WebFetch` | ✅ Allowed | Network fetch |
| `WebSearch` | ✅ Allowed | Web search |
| `TodoWrite` | ✅ Allowed | Task tracking |
| `Skill` | ✅ Allowed | Skill invocation |

---

## Integration 3: CLI System (01_cli)

### Purpose
User interface for task management through slash commands and keyboard shortcuts.

### Integration Points

#### 3.1 Kill All Local Agents

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
// Location: chunks.146.mjs:2029-2050
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    let K = q().tasks,
        Y = [];
    for (let [z, _] of Object.entries(K))
        if (_?.type === "local_agent" && _?.status === "running") {
            let w = x66(z, A);
            w && Y.push(z)
        } return Y
}

// READABLE (for understanding):
function killAllLocalAgents(setAppState, getAppState) {
    let state = getAppState();
    let tasks = state.tasks;
    let killedIds = [];

    for (let [taskId, task] of Object.entries(tasks)) {
        if (task?.type === "local_agent" && task?.status === "running") {
            let wasKilled = triggerAbortSignal(taskId, setAppState);
            if (wasKilled) {
                killedIds.push(taskId);
            }
        }
    }

    return killedIds;
}

// Mapping: U4q→killAllLocalAgents, A→setAppState, q→getAppState, K→tasks,
//          Y→killedIds, z→taskId, _→task, x66→triggerAbortSignal
```

#### 3.2 Trigger Abort Signal

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort for a task
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
    let wasKilled = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // TRIGGER ABORT - Signals agent loop to stop
        task.abortController?.abort();

        // RUN CLEANUP - Remove process handlers
        task.unregisterCleanup?.();

        // UPDATE STATE - Mark as killed
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear control objects
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Remove from active tracking
    if (wasKilled) {
        removeActiveAgent(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasKilled,
//          i9→atomicUpdateTask, Y→task, $O→removeActiveAgent
```

#### 3.3 Mark Task Killed

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed
// Location: chunks.146.mjs:2034-2050
// ============================================

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep last message only
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references for GC
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });
}

// Mapping: d4q→markTaskKilled
```

### Keyboard Shortcuts

| Shortcut | Action | Condition |
|----------|--------|-----------|
| `Ctrl+C` | Show kill confirmation | Agents running |
| `Ctrl+F` | Execute kill all | After Ctrl+C confirmation |
| `x` (in task list) | Kill selected task | Running task |
| `f` (in task list) | Foreground teammate | Teammate task |

### Kill Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Kill Flow Diagram                                    │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+C
        │
        ▼
hasRunningAgents check
        │
        ├── No running agents ──► Normal Ctrl+C (cancel stream)
        │
        └── Has running agents ──► Show confirmation
                │
                ▼
        User presses Ctrl+F (within timeout)
                │
                ▼
        killAllLocalAgents (U4q)
                │
                ├── For each local_agent task:
                │   └── triggerAbortSignal (x66)
                │       ├── abortController.abort()
                │       ├── unregisterCleanup()
                │       ├── Update status: "killed"
                │       └── Clear references
                │
                └── Return killedIds
                        │
                        ▼
                Show notification:
                "Killed N agents"
```

---

## Integration 4: State Management (15_state_management)

### Purpose
Task state registration, updates, and cleanup.

### Integration Points

#### 4.1 Register Task

```javascript
// ============================================
// Zf - registerTask - Register task in app state
// Location: chunks.90.mjs:3019-3025
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
function registerTask(taskRecord, setAppState) {
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [taskRecord.id]: taskRecord
        }
    }));
}

// Mapping: Zf→registerTask, A→taskRecord, q→setAppState
```

#### 4.2 Atomic Task Update

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
        return _ === z ? Y : {
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

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater
```

#### 4.3 Remove Task

```javascript
// ============================================
// VR - removeTask - Remove task from app state
// Location: chunks.90.mjs:3037-3045
// ============================================

// READABLE (for understanding):
function removeTask(taskId, setAppState) {
    setAppState((state) => {
        let { [taskId]: removed, ...remainingTasks } = state.tasks;
        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask
```

### Task Record Fields

```javascript
{
    id: "a3f4b2",                    // Unique task ID with type prefix
    type: "local_agent",             // Task type
    status: "running",               // Status: pending|running|completed|failed|killed
    description: "Search codebase",  // Human-readable description
    prompt: "...",                   // Agent prompt (for agents)
    startTime: 1711459200000,        // Creation timestamp
    endTime: null,                   // Completion timestamp
    outputFile: "~/.claude/tasks/a3f4b2.output",  // Output file path
    outputOffset: 1024,              // Output read position
    notified: false,                 // Has user been notified?
    progress: {
        toolUseCount: 5,
        tokenCount: 1234,
        summary: "Running Grep..."
    },
    abortController: AbortController,  // For cancellation
    isBackgrounded: true,            // Background vs foreground
    pendingMessages: []              // Message queue for teammates
}
```

---

## Integration 5: Hooks System (17_hooks)

### Purpose
Hook execution in background agent context.

### Integration Points

#### 5.1 Register Agent Hooks

```javascript
// ============================================
// r24 - registerAgentHooks - Register hooks for subagent context
// Location: chunks.95.mjs:1842-1890
// ============================================

// READABLE (for understanding):
function registerAgentHooks(context) {
    let agentId = context.agentId;

    // Create isolated hook context
    let hookContext = {
        agentId,
        isSubagent: true,
        isBackground: context.isBackgrounded,
        parentAgentId: context.parentAgentId
    };

    // PreToolUse: Validate tool access for background agents
    onPreToolUse(async (toolName, input) => {
        if (context.isBackgrounded &&
            BACKGROUND_AGENT_EXCLUDED_TOOLS.has(toolName)) {
            return {
                blocked: true,
                reason: `Tool ${toolName} not available in background mode`
            };
        }
        return { continue: true };
    });

    // PostToolUse: Capture output for background agents
    onPostToolUse(async (toolName, input, output) => {
        if (context.isBackgrounded) {
            appendToOutputFile(context.taskId, output);
        }
    });
}

// Mapping: r24→registerAgentHooks
```

#### 5.2 Deregister Agent Hooks

```javascript
// ============================================
// zZ6 - deregisterAgentHooks - Clean up subagent hooks
// Location: chunks.95.mjs:1830-1842
// ============================================

// READABLE (for understanding):
function deregisterAgentHooks(context) {
    // Remove all registered handlers for this subagent
    clearHookHandlers(context.agentId);

    // Clear hook context
    context.hookContext = null;
}

// Mapping: zZ6→deregisterAgentHooks
```

---

## Integration 6: Compact System (07_compact)

### Purpose
Transcript handling and message filtering for background tasks.

### Integration Points

#### 6.1 Message Filtering for Background

```javascript
// ============================================
// Message filtering during compaction
// ============================================

// READABLE (for understanding):
function filterMessagesForCompaction(messages, tasks) {
    return messages.filter((message) => {
        // Keep task_notification messages - they're important state
        if (message.type === "system" && message.subtype === "task_notification") {
            return true;
        }

        // Keep task_status/task_progress attachments
        if (message.type === "attachment" &&
            (message.attachment.type === "task_status" ||
             message.attachment.type === "task_progress")) {
            return true;
        }

        // Normal filtering for other messages
        return shouldKeepMessage(message);
    });
}
```

### State Preservation

Background task state is preserved across compaction:
- Task records in appState.tasks are kept
- Output files persist independently
- Progress tracking continues

---

## Integration 7: Telemetry System (17_telemetry)

### Purpose
Progress and usage telemetry for background tasks.

### Integration Points

#### 7.1 Progress Telemetry

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059-2085
// ============================================

// ORIGINAL (for source lookup):
async function nl4(A, q, K, Y, z) {
    let _ = Y?.usage;
    _ && await iI4(_);
    i9(A, q, (w) => ({
        ...w,
        progress: {
            toolUseCount: K,
            tokenCount: _?.total_tokens ?? w.progress?.tokenCount ?? 0,
            summary: z
        }
    }))
}

// READABLE (for understanding):
async function updateTaskProgressWithTelemetry(
    taskId,
    setAppState,
    toolUseCount,
    usage,
    summary
) {
    // Step 1: Send telemetry if usage data available
    let tokenUsage = usage?.usage;
    if (tokenUsage) {
        await sendTelemetryEvent(tokenUsage);
    }

    // Step 2: Atomically update task progress
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        progress: {
            toolUseCount: toolUseCount,
            tokenCount: tokenUsage?.total_tokens ?? task.progress?.tokenCount ?? 0,
            summary: summary
        }
    }));
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→setAppState,
//          K→toolUseCount, Y→usage, z→summary, _→tokenUsage, iI4→sendTelemetryEvent
```

### Telemetry Events

| Event | Trigger | Data |
|-------|---------|------|
| `task_progress` | Each progress update | taskId, usage, summary |
| `task_completed` | Task finishes successfully | taskId, duration, tokens |
| `task_failed` | Task fails with error | taskId, error |
| `task_killed` | User kills task | taskId, partial results |
| `tengu_cancel` | Kill all triggered | source: "kill_agents" |

---

## Integration 8: Output File System

### Purpose
File-based output storage for background task results.

### Integration Points

#### 8.1 Get Output File Path

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

### Output File Structure

```
~/.claude/
└── tasks/
    ├── a3f4b2c1.output    # local_agent output
    ├── b7d8e9f2.output    # local_bash output
    ├── t2a3b4c5.output    # in_process_teammate output
    └── r9d8c7b6.output    # remote_agent output
```

### File Operations

| Operation | Function | Purpose |
|-----------|----------|---------|
| Get path | `g2` | Resolve task ID to file path |
| Initialize | `initOutputFile` | Create empty output file |
| Append | `appendToOutputFile` | Write incremental output |
| Read delta | `wY4` | Read new bytes since offset |
| Read full | `readFullOutput` | Read complete output file |

---

## Cross-System Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Complete Event Flow                                  │
└─────────────────────────────────────────────────────────────────────────────┘

User: "Run tests in background"
        │
        ▼
┌─────────────────────┐
│ LLM generates:       │
│ BashTool.call({      │
│   command: "npm test",│
│   run_in_background: true│
│ })                   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BashTool checks BACKGROUND_TASKS_DISABLED                                    │
│ └── If disabled: run synchronously (no background)                          │
│ └── If enabled: createAsyncTask                                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task Creation                                                                │
│ • createTaskId("local_bash") → "b7c4e1"                                     │
│ • createTaskRecord()                                                         │
│ • registerTask() in appState.tasks                                          │
│ • initOutputFile()                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LocalBashTaskHandler.spawn()                                                 │
│ • Create shell process                                                       │
│ • Register cleanup handler                                                   │
│ • Return { taskId: "b7c4e1" }                                               │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Tool returns immediately:                                                    │
│ { status: "async_launched", backgroundTaskId: "b7c4e1", outputFile: "..." } │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (background execution continues)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Background Execution Loop                                                    │
│ • Shell writes stdout to output file                                         │
│ • Progress tracked via outputOffset                                          │
│ • Periodic updateTaskProgress() calls                                        │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (each LLM turn)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ System Reminder Integration                                                  │
│ • getUnifiedTasksAttachment() called                                         │
│ • buildTaskAttachments() checks all tasks                                    │
│ • task_progress generated (if throttle satisfied)                           │
│ • Injected into conversation as system-reminder                             │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (task completes)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Completion Handling                                                          │
│ • Shell process exits                                                        │
│ • markTaskCompleted() / markTaskFailed()                                     │
│ • notifyTaskCompletion()                                                     │
│   - Sets notified: true                                                      │
│   - Builds XML notification                                                  │
│   - Enqueues with mode: "task-notification"                                 │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Main Loop Receives Notification                                              │
│ • task_notification message in queue                                         │
│ • Displayed to user                                                          │
│ • LLM can process result                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
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

## Design Decisions Summary

| Integration | Key Decision | Rationale |
|-------------|--------------|-----------|
| System Reminder | Two attachment types | Status needs immediate notification; progress can be throttled |
| Tools | Blocklist + allowlist | Prevent interactive tools from hanging background agents |
| CLI | Ctrl+F kill all | Efficient bulk cleanup without per-task UI |
| State Management | Atomic updates | Consistent state transitions |
| Hooks | Background-compatible execution | Hooks must not block indefinitely |
| Compact | Preserve task state | Output files are independent communication channel |
| Telemetry | Progress events | Usage tracking for background tasks |
| Output Files | Prefix-based naming | Quick visual identification of task type |

---

## Integration Test Checklist

### System Reminder Integration
- [ ] Progress attachment appears in LLM context
- [ ] Status attachment on completion
- [ ] Notification shown to user
- [ ] Throttle prevents flooding

### Tool Integration
- [ ] BashTool backgrounds correctly
- [ ] AgentTool returns immediately for background
- [ ] Disallowed tools blocked in background

### CLI Integration
- [ ] `/tasks` shows task list
- [ ] Ctrl+C shows confirmation
- [ ] Ctrl+F kills all agents
- [ ] Task list keyboard shortcuts work

### State Management
- [ ] Tasks register in state
- [ ] Progress updates correctly
- [ ] Tasks cleanup after completion

### Hooks Integration
- [ ] Hooks execute in background context
- [ ] Output captured to file
- [ ] Hooks deregister on completion

### Telemetry Integration
- [ ] Progress events sent
- [ ] Completion events sent
- [ ] Kill events tracked

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `vIY` | getUnifiedTasksAttachment | chunks.142.mjs:2719 | ✓ Verified |
| `TIY` | countUniqueUris (LSP) | chunks.144.mjs:832 | **CORRECTED** - was incorrectly mapped to countTurnsSinceLastProgress |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `r24` | registerAgentHooks | chunks.95.mjs:1842 | ✓ Verified |
| `zZ6` | deregisterAgentHooks | chunks.95.mjs:1830 | ✓ Verified |

---

## Related Documents

- [feature_integration_matrix.md](./feature_integration_matrix.md) - Summary matrix
- [key_algorithms_source_restored.md](./key_algorithms_source_restored.md) - Algorithm details
- [system_reminder_integration_v2_complete.md](./system_reminder_integration_v2_complete.md) - Reminder system
- [output_file_system_source_restored.md](./output_file_system_source_restored.md) - Output files
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers
- [../08_subagent/feature_integration_complete.md](../08_subagent/feature_integration_complete.md) - Subagent integration