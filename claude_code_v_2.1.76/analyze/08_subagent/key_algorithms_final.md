# Key Algorithms Deep Dive - Final (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in the subagent and background agents systems, including task ID generation, tool filtering, abort signal propagation, and mailbox communication.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_final.md](./cross_validation_final.md) - Verified symbols

---

## Algorithm 1: Task ID Generation

### generateTaskId (oV)

**What it does:** Generates unique 8-character task IDs with type prefixes for tracking background tasks.

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A);
    return q + EvY()
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Get type-specific prefix
    let prefix = getTaskTypePrefix(taskType);  // k$3

    // Generate 8 random characters
    let randomPart = generateRandomString(8);  // EvY

    return prefix + randomPart;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, k$3→getTaskTypePrefix, EvY→generateRandomString
```

### getTaskTypePrefix (k$3)

```javascript
// ============================================
// k$3 - getTaskTypePrefix - Get prefix for task type
// Location: chunks.41.mjs:2406-2408
// ============================================

// ORIGINAL (for source lookup):
function k$3(A) {
    return V$3.get(A) ?? "x"
}

// READABLE (for understanding):
function getTaskTypePrefix(taskType) {
    // Return prefix from map, or "x" for unknown types
    return TASK_TYPE_PREFIXES.get(taskType) ?? "x";
}

// Mapping: k$3→getTaskTypePrefix, A→taskType, V$3→TASK_TYPE_PREFIXES
```

### TASK_TYPE_PREFIXES (V$3)

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Map of task types to ID prefixes
// Location: chunks.41.mjs:2438-2444
// ============================================

// ORIGINAL (for source lookup):
V$3 = new Map([
    ["local_agent", "a"],
    ["local_bash", "b"],
    ["remote_agent", "r"],
    ["in_process_teammate", "t"],
    ["local_workflow", "w"]
])

// READABLE (for understanding):
const TASK_TYPE_PREFIXES = new Map([
    ["local_agent", "a"],        // Agent tasks
    ["local_bash", "b"],         // Shell command tasks
    ["remote_agent", "r"],       // Remote session tasks
    ["in_process_teammate", "t"], // Teammate tasks
    ["local_workflow", "w"]      // Workflow tasks
]);
```

### Why This Design?

1. **Type Identification**: First character immediately identifies task type
2. **Collision Avoidance**: 8 random characters (36^8 = 2.8 trillion combinations)
3. **Human Readable**: Easy to parse visually
4. **Sortability**: IDs can be sorted by type

---

## Algorithm 2: Tool Filtering

### filterToolsForSubagent (Xk8)

**What it does:** Filters the available tool set for subagents based on agent type, permission mode, and execution context.

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools for subagent
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // Rule 1: Always allow MCP tools (external integrations)
        if (tool.name.startsWith("mcp__")) return true;

        // Rule 2: Allow ExitPlanMode in plan mode
        if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Rule 3: Always exclude background-blocked tools
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 4: Exclude built-in blocked tools for non-built-in agents
        if (!isBuiltIn && BUILTIN_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 5: For async agents, only allow explicitly allowed tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: Team mode allows Agent and Team tools
            if (isTeamMode() && isTeamEnabled()) {
                if (isToolNamed(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        // Default: allow
        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode,
//          z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, xV8→BUILTIN_EXCLUDED_TOOLS,
//          eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS, z3→isToolNamed
```

### Tool Set Contents

```javascript
// From chunks.91.mjs:269

// CW6 - Always excluded from background agents
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
])

// eP1 - Allowed for async/background agents
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])

// WY4 - Team delegate tools (allowed in team mode)
TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
])
```

### Why This Design?

1. **Safety First**: Prevent blocking operations in async contexts
2. **User Interaction**: Exclude tools that require user input
3. **Resource Management**: Prevent infinite loops and resource exhaustion
4. **Team Exceptions**: Allow inter-agent communication tools in team mode

---

## Algorithm 3: Abort Signal Propagation

### triggerAbortSignal (x66)

**What it does:** Aborts a running task by triggering its abort controller and performing cleanup.

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort a specific task
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
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 1: Abort the controller (cancels LLM stream)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler (prevent double cleanup)
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]  // Keep last message
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer if aborted
    if (wasAborted) {
        flushOutputBuffer(taskId);  // $O
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted,
//          Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### killAllLocalAgents (U4q)

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
    // Iterate all tasks - Object.entries creates snapshot
    for (let [taskId, task] of Object.entries(tasks)) {
        // Filter conditions:
        // 1. Must be local_agent type (not local_bash, in_process_teammate, etc.)
        // 2. Must be in running state
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task
```

### Why This Design?

1. **Atomic Updates**: State changes are atomic, preventing race conditions
2. **Cleanup Chain**: Each step properly cleans up resources
3. **Partial Results**: Output buffer is flushed before kill, preserving work
4. **Type Safety**: Only `local_agent` tasks are killed, not bash or teammates

---

## Algorithm 4: Mailbox Communication

### readMailbox (wl)

**What it does:** Reads all messages from a mailbox file.

```javascript
// ============================================
// wl - readMailbox - Read messages from mailbox
// Location: chunks.132.mjs:3-14
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = g2(A);
    try {
        let Y = await M97(K, "r");
        return await Y.readFile("utf8")
    } catch (Y) {
        if (Y.code === "ENOENT") return "[]";
        throw Y
    }
}

// READABLE (for understanding):
async function readMailbox(agentId, setAppState) {
    let mailboxPath = getOutputFilePath(agentId) + ".mailbox";  // g2 returns base path

    try {
        let fileHandle = await fs.open(mailboxPath, "r");
        let content = await fileHandle.readFile("utf8");
        await fileHandle.close();
        return content;
    } catch (error) {
        // File doesn't exist - return empty array
        if (error.code === "ENOENT") return "[]";
        throw error;
    }
}

// Mapping: wl→readMailbox, A→agentId, q→setAppState, K→mailboxPath, Y→error/result, M97→fs.open
```

### writeToMailbox (x3)

```javascript
// ============================================
// x3 - writeToMailbox - Write message to mailbox
// Location: chunks.132.mjs:22-55
// ============================================

// READABLE (for understanding):
async function writeToMailbox(agentId, message, setAppState) {
    let mailboxPath = getOutputFilePath(agentId) + ".mailbox";

    // Read existing messages
    let existing = "[]";
    try {
        let fileHandle = await fs.open(mailboxPath, "r");
        existing = await fileHandle.readFile("utf8");
        await fileHandle.close();
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }

    // Parse and append
    let messages = JSON.parse(existing);
    messages.push({
        ...message,
        id: generateMessageId(),
        timestamp: Date.now(),
        read: false
    });

    // Write back with file locking
    await writeFileWithLock(mailboxPath, JSON.stringify(messages, null, 2));
}
```

### markMessagesAsRead (kc6)

```javascript
// ============================================
// kc6 - markMessagesAsRead - Mark all messages as read
// Location: chunks.132.mjs:92-126
// ============================================

// READABLE (for understanding):
async function markMessagesAsRead(agentId, setAppState) {
    let mailboxPath = getOutputFilePath(agentId) + ".mailbox";

    // Read existing
    let content = await readMailbox(agentId, setAppState);
    let messages = JSON.parse(content);

    // Mark all as read
    for (let message of messages) {
        message.read = true;
    }

    // Write back
    await writeFileWithLock(mailboxPath, JSON.stringify(messages, null, 2));
}
```

### Why This Design?

1. **File-Based**: Simple persistence without database
2. **JSON Format**: Human readable and easy to parse
3. **File Locking**: Prevent concurrent write corruption
4. **Read Tracking**: Messages track whether they've been consumed

---

## Algorithm 5: Task State Machine

### atomicUpdateTask (i9)

**What it does:** Atomically updates a single task within the app state.

```javascript
// ============================================
// i9 - atomicUpdateTask - Update single task atomically
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
        // Get existing task
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task doesn't exist

        // Apply updater function
        let updatedTask = updater(task);

        // No change - return original state
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

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater,
//          Y→state, z→task, _→updatedTask
```

### isTerminalTaskStatus (LJ6)

```javascript
// ============================================
// LJ6 - isTerminalTaskStatus - Check if status is terminal
// Location: chunks.41.mjs:2402-2404
// ============================================

// ORIGINAL (for source lookup):
function LJ6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}

// READABLE (for understanding):
function isTerminalTaskStatus(status) {
    return status === "completed" ||
           status === "failed" ||
           status === "killed";
}

// Mapping: LJ6→isTerminalTaskStatus, A→status
```

### State Transition Diagram

```
                         ┌──────────────┐
                         │   pending    │
                         └──────┬───────┘
                                │ spawn
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## Performance Considerations

### Task ID Generation
- **O(1)** complexity - simple string concatenation
- **Collision probability**: 1 in 2.8 trillion (36^8)
- **No coordination needed** between agents

### Tool Filtering
- **O(n)** where n = number of tools
- **Set lookups** are O(1)
- **Cached sets** - created once at startup

### Abort Signal
- **O(1)** for single task abort
- **O(n)** for kill all where n = number of running tasks
- **Atomic updates** prevent race conditions

### Mailbox
- **O(n)** read/write where n = number of messages
- **File locking** prevents corruption
- **Simple append** would be more efficient but current design allows message editing

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402 | ✓ Verified |

---

## Related Documents

- [cross_validation_final.md](./cross_validation_final.md) - Verified symbols
- [system_reminder_integration_final.md](./system_reminder_integration_final.md) - System reminder integration
- [ui_design_complete_final.md](./ui_design_complete_final.md) - UI design
- [../00_overview/algorithm_deep_dives_subagent_background.md](../00_overview/algorithm_deep_dives_subagent_background.md) - Overview algorithms

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete