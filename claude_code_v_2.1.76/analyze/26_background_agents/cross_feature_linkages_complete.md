# Cross-Feature Linkages Complete (Claude Code 2.1.76)

> Comprehensive documentation of all integration points between the background agents module and other Claude Code modules, with source-level code restoration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Integration Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CROSS-FEATURE INTEGRATION MATRIX                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────┐
                    │        26_background_agents      │
                    │            Core                  │
                    └────────────────┬────────────────┘
                                     │
    ┌────────────────┬───────────────┼───────────────┬────────────────┐
    │                │               │               │                │
    ▼                ▼               ▼               ▼                ▼
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│  04    │     │  05    │     │  17    │     │  32    │     │  08    │
│System  │     │ Tools  │     │ Hooks  │     │Keybinds│     │Subagent│
│Reminder│     │        │     │        │     │        │     │        │
└────────┘     └────────┘     └────────┘     └────────┘     └────────┘
     │              │              │              │              │
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
 Attachments   Tool Filtering  PostToolUse   Kill Handlers  Task Spawning
 Polling       BashTool BG     PreToolUse    Ctrl+C/F       Output Files
 State Updates Auto-BG         Hook Cleanup  Shortcuts      Abort Chain
```

---

## Integration 1: 04_system_reminder

### Attachment Producers

Background agents integrate with the system reminder system via task status attachments that are injected into the LLM context before each turn.

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task attachments
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext) {
    let appState = toolUseContext.getAppState();

    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);

    // Update state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Map to attachment format for LLM context
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState,
//          wY4→pollTaskOutputs, OY4→updateTaskState
```

### Attachment Types

| Type | Producer | Purpose |
|------|----------|---------|
| `task_status` | `suY` | Background task status in conversation context |
| `task_progress` | `nl4` | Progress updates with telemetry |
| `task_reminder` | `getTaskReminderAttachment` | Reminder of pending tasks |

### Output Polling Integration

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll task output files
// Location: chunks.90.mjs:3058-3084
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

---

## Integration 2: 05_tools

### AgentTool Background Spawning

```javascript
// ============================================
// AgentTool Background Execution
// Location: chunks.136.mjs
// ============================================

// When run_in_background is true, the AgentTool creates a background task:

async function spawnBackgroundAgent(input, context) {
    let { prompt, subagent_type, description } = input;

    // Generate task ID
    let agentId = generateTaskId("local_agent");  // oV

    // Create background task record
    let task = createBackgroundAgentTask({  // Qn4
        agentId,
        description,
        prompt,
        selectedAgent,
        setAppState: context.setAppState,
        parentAbortController: context.abortController,
        toolUseId: context.toolUseId
    });

    // Spawn detached execution
    spawnBackgroundAgentExecution(task, context);

    return {
        status: "async_launched",
        agentId,
        outputFile: task.outputFile
    };
}
```

### BashTool Background Modes

```javascript
// ============================================
// BashTool Background Modes
// Location: chunks.172.mjs
// ============================================

// Three ways to background a Bash command:

// 1. Explicit background
if (input.run_in_background) {
    // Always background, returns immediately
}

// 2. Timeout-based background
if (input.timeout && executionTime > AUTO_BACKGROUND_THRESHOLD) {
    // Assistant-mode auto-backgrounding
    // Default threshold: 120 seconds (m9z = 120000)
}

// 3. User interrupt (Ctrl+B)
if (userPressedCtrlB) {
    // Mid-run backgrounding
}
```

### TaskOutputTool

```javascript
// ============================================
// TaskOutputTool - Poll background task output
// Location: chunks.143.mjs
// ============================================

const TaskOutputTool = {
    name: "TaskOutput",
    inputSchema: {
        task_id: "string",
        block: "boolean (default: true)",
        timeout: "number (milliseconds)"
    },

    async call(input, context) {
        let { task_id, block, timeout } = input;

        // Get task from state
        let task = context.getAppState().tasks[task_id];
        if (!task) throw new Error(`Task ${task_id} not found`);

        if (block) {
            // Wait for completion
            await waitForTaskCompletion(task_id, timeout);
        }

        // Read output file
        let output = await readFullOutput(task_id);  // z38

        return {
            output,
            status: task.status,
            ...task.result
        };
    }
};
```

### Tool Filtering for Background Agents

```javascript
// ============================================
// Tool Access Control for Background Agents
// Location: chunks.93.mjs:1568
// ============================================

function filterToolsForSubagent({ tools, isBuiltIn, isAsync, permissionMode }) {
    return tools.filter((tool) => {
        // MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // Background agent restrictions
        if (isAsync) {
            // Strict whitelist
            return ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name);
        }

        // Foreground agent restrictions
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        return true;
    });
}

// Blocked tools for background agents:
const BLOCKED_TOOLS = [
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
];
```

---

## Integration 3: 17_hooks

### Hook Cleanup on Task Kill

```javascript
// ============================================
// Hook Cleanup Integration
// ============================================

// When a background agent is killed, hooks must be cleaned up:

async function cleanupBackgroundAgentHooks(agentId, setAppState) {
    // Deregister hooks registered for this agent
    deregisterAgentHooks(setAppState, agentId);
}

// Hooks that may be registered:
// - PreToolUse: Validate tool access
// - PostToolUse: Capture output
// - SubagentStart: Additional context injection
```

### PostToolUse Output Capture

```javascript
// ============================================
// PostToolUse Hook for Background Tasks
// ============================================

// Hooks fire after each tool use in background agent
// Can be used for:
// - Output capture
// - Progress tracking
// - Validation
```

---

## Integration 4: 32_keybindings

### Kill Handlers (Ctrl+C → Ctrl+F)

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort for specific task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = q(),
        Y = K.tasks?.[A];
    if (!Y || Y.status !== "running") return !1;
    let z = Y.abortController;
    return z ? (z.abort(), !0) : !1
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, getAppState) {
    let state = getAppState();
    let task = state.tasks?.[taskId];

    if (!task || task.status !== "running") {
        return false;
    }

    let abortController = task.abortController;
    if (abortController) {
        abortController.abort();
        return true;
    }

    return false;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→getAppState, K→state,
//          Y→task, z→abortController
```

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all local_agent tasks
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    let K = q(),
        Y = Object.values(K.tasks ?? {}).filter((z) => z.status === "running" && z.taskType === "local_agent");
    for (let z of Y) x66(z.id, q);
    return Y.length
}

// READABLE (for understanding):
function killAllLocalAgents(setAppState, getAppState) {
    let state = getAppState();
    let runningLocalAgents = Object.values(state.tasks ?? {})
        .filter((task) => task.status === "running" && task.taskType === "local_agent");

    for (let task of runningLocalAgents) {
        triggerAbortSignal(task.id, getAppState);
    }

    return runningLocalAgents.length;
}

// Mapping: U4q→killAllLocalAgents, A→setAppState, q→getAppState, K→state,
//          Y→runningLocalAgents, z→task, x66→triggerAbortSignal
```

### Keyboard Shortcut Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KILL FLOW DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────┘

User presses Ctrl+C
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Confirmation prompt appears                                         │
│ "Press Ctrl+F to kill all running background agents"               │
└─────────────────────────────────────────────────────────────────────┘
  │
  ├──────────────────────────────────────────────────────────┐
  │ User presses Ctrl+F                                      │ User does nothing
  ▼                                                          ▼
┌───────────────────────────────────┐    ┌───────────────────────────────────┐
│ killAllLocalAgents (U4q)          │    │ Confirmation times out            │
│   Iterate running local_agent     │    │ No agents killed                  │
│   Call triggerAbortSignal         │    │ Continue normal operation         │
│   for each                        │    │                                   │
└───────────────────────────────────┘    └───────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ markTaskKilled (d4q)                                                │
│   Update task status to "killed"                                    │
│   Create notification for UI                                        │
│   Preserve partial output                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Integration 5: 08_subagent

### Task Creation Shared Functions

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = Math.random().toString(16).slice(2, 10),
        K = k$3(A);
    return `${K}_${q}`
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Generate 8 random hex characters
    let randomPart = Math.random().toString(16).slice(2, 10);

    // Get prefix for task type
    let prefix = getTaskTypePrefix(taskType);

    return `${prefix}_${randomPart}`;
}

// Mapping: oV→generateTaskId, A→taskType, q→randomPart, K→prefix, k$3→getTaskTypePrefix
```

### Task Type Prefixes

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task ID prefixes
// Location: chunks.41.mjs:2432-2438
// ============================================

// ORIGINAL (for source lookup):
const V$3 = {
    "local_agent": "agent",
    "local_bash": "bash",
    "in_process_teammate": "teammate",
    "remote_agent": "remote"
};

// READABLE (for understanding):
const TASK_TYPE_PREFIXES = {
    "local_agent": "agent",           // Agent spawned via AgentTool
    "local_bash": "bash",             // Bash command backgrounded
    "in_process_teammate": "teammate", // In-process teammate
    "remote_agent": "remote"          // Remote agent session
};

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Output File System Shared

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

---

## Integration 6: 07_compact

### Transcript Handling for Background Tasks

```javascript
// ============================================
// Compact Integration
// ============================================

// During compaction, background task messages are preserved specially:

function filterMessagesForCompact(messages) {
    return messages.filter((msg) => {
        // Keep tool_use for background agents
        if (msg.type === "tool_use" && msg.name === "Agent") {
            if (msg.input?.run_in_background) {
                return true;  // Keep for task tracking
            }
        }

        // Keep tool_result for background agents
        if (msg.type === "tool_result") {
            if (msg.content?.status === "async_launched") {
                return true;
            }
        }

        // Normal filtering...
        return isMessageRecordable(msg);
    });
}

// Task state is NOT compacted - persists across compactions
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2432 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |

---

## Related Documents

- [task_lifecycle_complete_source.md](./task_lifecycle_complete_source.md) - Task lifecycle analysis
- [kill_mechanism_complete.md](./kill_mechanism_complete.md) - Kill mechanism
- [progress_tracking_complete.md](./progress_tracking_complete.md) - Progress tracking
- [cross_validation_report.md](./cross_validation_report.md) - Symbol verification
- [../08_subagent/cross_feature_linkages_complete.md](../08_subagent/cross_feature_linkages_complete.md) - Subagent linkages
