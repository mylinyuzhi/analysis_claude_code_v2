# Subagent & Background Agents Algorithm Deep Dives V2 (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in subagent and background agent systems.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - generateTaskId — `chunks.41.mjs:2410`
- `k$3` - getTaskTypePrefix — `chunks.41.mjs:2406`
- `LJ6` - isTerminalTaskStatus — `chunks.41.mjs:2402`
- `RG` - createTaskEntry — `chunks.41.mjs:2418`
- `Xk8` - filterToolsForSubagent — `chunks.93.mjs:1568`
- `DNY` - pollForNextMessage — `chunks.134.mjs:1483`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`

---

## Algorithm 1: Task ID Generation

### What it does

Generates unique, collision-resistant task IDs with type prefixes for quick visual identification.

### Why this approach

- **Type prefix** enables quick visual identification of task origin
- **36-char charset** (0-9, a-z) provides URL-safe, human-readable IDs
- **8 random chars** gives ~2.8 trillion combinations (36^8)
- **Crypto randomness** ensures no collision predictability

### Source Code

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID with type prefix
// Location: chunks.41.mjs:2410-2415
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
    // Step 1: Get type prefix from lookup table
    let prefix = getTaskTypePrefix(taskType);

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Build ID: prefix + 8 random chars
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, k$3→getTaskTypePrefix, N$3→crypto.getRandomValues,
//          G97→CHARSET, K→randomBytes, Y→taskId, z→i
```

### Supporting Data

```javascript
// ============================================
// Task ID constants and prefix mapping
// Location: chunks.41.mjs:2432-2444
// ============================================

// ORIGINAL (for source lookup):
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"
// ...
V$3 = {
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r",
    in_process_teammate: "t",
    local_workflow: "w"
}

// READABLE (for understanding):
const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";

const TASK_TYPE_PREFIXES = {
    local_bash: "b",              // Shell command tasks
    local_agent: "a",             // Local subagent tasks
    remote_agent: "r",            // Remote session agent tasks
    in_process_teammate: "t",     // In-process teammate tasks
    local_workflow: "w"           // Workflow tasks
};

// Prefix lookup function
function getTaskTypePrefix(taskType) {
    return TASK_TYPE_PREFIXES[taskType] ?? "x";  // "x" for unknown types
}
// Mapping: G97→CHARSET, V$3→TASK_TYPE_PREFIXES, k$3→getTaskTypePrefix
```

### Algorithm Analysis

**Step-by-step:**

1. **Type prefix lookup**: Map task type to single-char prefix
   - `local_agent` → `"a"`
   - `local_bash` → `"b"`
   - `in_process_teammate` → `"t"`
   - Unknown → `"x"`

2. **Random generation**: 8 cryptographically random bytes via `crypto.getRandomValues()`

3. **Charset encoding**: Map each byte to charset character using modulo 36
   - Each byte (0-255) maps to a character in "0123456789abcdefghijklmnopqrstuvwxyz"
   - Slight bias toward lower numbers (0-9 have 7 occurrences, a-z have 7)

4. **ID construction**: Concatenate prefix + encoded chars
   - Example: `"a3f4b2c1"` where `"a"` is prefix for `local_agent`

**Collision Analysis:**

| Metric | Value |
|--------|-------|
| Charset size | 36 characters |
| ID length (after prefix) | 8 characters |
| Total combinations | 36^8 = 2,821,109,907,456 |
| With 1 million tasks | Collision probability ≈ 0.00000002% |

**Why modulo instead of base-36:**

The modulo approach (`byte % 36`) is simpler and avoids bias issues from uneven byte distribution. While there's slight bias (chars 0-9 appear 7.1 times per 256 bytes, chars a-z appear 7.1 times), the collision probability remains negligible.

---

## Algorithm 2: Terminal Status Check

### What it does

Determines if a task status is terminal (no further state transitions possible).

### Source Code

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

### Why this matters

Terminal status check is critical for:

1. **Task eviction** - Only terminal + notified tasks can be removed from state
2. **Guard conditions** - Prevent state transitions on already-terminal tasks
3. **UI updates** - Terminal tasks get final notification

### State Transition Guard

```javascript
// Used in state update functions
if (task.status !== "running") return task;  // Only running tasks can transition

// Used in removal function
if (!isTerminalTaskStatus(task.status)) return state;  // Only terminal can be removed
```

---

## Algorithm 3: Task Entry Creation

### What it does

Creates the initial task record object with all required fields.

### Source Code

```javascript
// ============================================
// RG - createTaskEntry - Create initial task record
// Location: chunks.41.mjs:2418-2429
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
function createTaskEntry(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,                      // Unique task ID with type prefix
        type: taskType,                  // Task type (local_agent, local_bash, etc.)
        status: "pending",               // Initial status
        description: description,        // Human-readable description
        toolUseId: toolUseId,            // Tool use ID that spawned this task
        startTime: Date.now(),           // Creation timestamp
        outputFile: getOutputFilePath(taskId),  // Output file path
        outputOffset: 0,                 // Output read position
        notified: false                  // Has user been notified?
    };
}

// Mapping: RG→createTaskEntry, A→taskId, q→taskType, K→description, Y→toolUseId,
//          g2→getOutputFilePath
```

### Extended Fields (for specific task types)

The base entry is extended by task-specific creation functions:

```javascript
// For background agents (Qn4):
{
    ...createTaskEntry(...),
    status: "running",           // Immediately running
    agentId: taskId,
    prompt: "...",
    selectedAgent: {...},
    agentType: "general-purpose",
    abortController: new AbortController(),
    isBackgrounded: true,
    retrieved: false,
    pendingMessages: [],
    progress: {
        toolUseCount: 0,
        tokenCount: 0,
        summary: null
    }
}

// For foreground agents (Un4):
{
    ...createTaskEntry(...),
    status: "running",
    // Similar fields but isBackgrounded: false
}
```

---

## Algorithm 4: Tool Filtering for Subagent

### What it does

Filters available tools based on agent type, execution mode, and permission context to prevent dangerous or blocking operations.

### Why this approach

1. **MCP tools allowed**: External tools may be needed for agent tasks
2. **Blocked tools**: Prevent infinite loops and blocking operations
3. **Async whitelist**: Only non-blocking tools for background agents
4. **Delegate exception**: Team delegates get special communication tools

### Source Code

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on agent context
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
        // RULE 1: Always allow MCP tools (external integrations)
        if (tool.name.startsWith("mcp__")) {
            return true;
        }

        // RULE 2: Allow AskUserQuestion in plan mode
        if (isToolNamed(tool, "AskUserQuestion") && permissionMode === "plan") {
            return true;
        }

        // RULE 3: Block tools that should never be in subagents
        // (TaskOutput, ExitPlanMode, EnterPlanMode, Agent, AskUserQuestion, TaskStop)
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 4: Block certain tools for non-built-in agents
        if (!isBuiltIn && FOREGROUND_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 5: For async agents, only allow whitelisted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: In delegate mode with in-process teammate
            if (isAgentTeamsEnabled() && isInProcessTeammate()) {
                // Allow Agent tool for nested delegation
                if (isToolNamed(tool, "Agent")) return true;
                // Allow team/cron tools
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode,
//          CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, xV8→FOREGROUND_EXCLUDED_TOOLS,
//          eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS,
//          z3→isToolNamed, aJ→TOOL_NAME_ASK_USER_QUESTION, r4→TOOL_NAME_AGENT,
//          E7→isAgentTeamsEnabled, eP→isInProcessTeammate
```

### Tool Filter Constants

```javascript
// ============================================
// Tool filter sets
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([$C, aJ, dt, r4, Fw, OC]),
xV8 = new Set([...CW6]),
eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1]),
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
// Tools ALWAYS excluded from background/async agents
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Prevent polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Prevent nested background spawning
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage other tasks
]);

// Tools excluded from non-built-in foreground agents
const FOREGROUND_EXCLUDED_TOOLS = new Set([...BACKGROUND_AGENT_EXCLUDED_TOOLS]);

// Tools allowed for async/background agents
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);

// Tools for team/cron delegate agents
const TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
]);
```

### Decision Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Tool Filtering Decision Tree                         │
└─────────────────────────────────────────────────────────────────────────────┘

Tool passes through filter?
        │
        ▼
┌───────────────────┐     No      ┌─────────────────────────────┐
│ MCP tool?         │────────────►│ ALLOW (external integration)│
│ (mcp__ prefix)    │             └─────────────────────────────┘
└─────────┬─────────┘
          │ Yes
          ▼
┌───────────────────┐     Yes     ┌─────────────────────────────┐
│ In excluded set?  │────────────►│ BLOCK                       │
│ (CW6)             │             └─────────────────────────────┘
└─────────┬─────────┘
          │ No
          ▼
┌───────────────────┐     Yes     ┌─────────────────────────────┐
│ Async agent AND   │────────────►│ In allowed set (eP1)?       │
│ not in allowed?   │             │ Yes → ALLOW                 │
└─────────┬─────────┘             │ No → Check delegate mode    │
          │ No                    └─────────────────────────────┘
          ▼
┌───────────────────┐
│ ALLOW             │
└───────────────────┘
```

---

## Algorithm 5: Mailbox Polling for Teammates

### What it does

Teammate agents poll their mailbox for incoming messages with priority handling.

### Why this approach

1. **Priority queue** - In-memory messages checked first (no I/O)
2. **File-based persistence** - Mailbox files survive crashes
3. **Poll interval** - Balance between responsiveness and resource usage
4. **Abort-aware** - Clean termination when parent signals

### Source Code

```javascript
// ============================================
// DNY - pollForNextMessage - Priority poll loop for teammate messages
// Location: chunks.134.mjs:1483-1550 (inferred)
// ============================================

// ORIGINAL (for source lookup):
async function DNY(A, q, K, Y, z, _) {
    k(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let O = 0;
    while (!q.signal.aborted) {
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => {
                let D = M.tasks[K];
                if (!D || D.type !== "in_process_teammate") return M;
                return {
                    ...M,
                    tasks: {
                        ...M.tasks,
                        [K]: {
                            ...D,
                            pendingUserMessages: D.pendingUserMessages.slice(1)
                        }
                    }
                };
            }), J;
        }
        // ... mailbox file check and sleep
    }
}

// READABLE (for understanding):
async function pollForNextMessage(
    agentContext,
    abortController,
    taskId,
    getAppState,
    setAppState,
    sleep
) {
    log(`[inProcessRunner] ${agentContext.agentName} starting poll loop`);

    let pollCount = 0;
    while (!abortController.signal.aborted) {
        // PRIORITY 1: Check in-memory pending messages (no I/O)
        let task = getAppState().tasks[taskId];

        if (task?.type === "in_process_teammate" &&
            task.pendingUserMessages.length > 0) {

            // Get first message
            let message = task.pendingUserMessages[0];

            // Remove from pending list
            setAppState((state) => {
                let targetTask = state.tasks[taskId];
                if (!targetTask || targetTask.type !== "in_process_teammate") {
                    return state;
                }
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...targetTask,
                            pendingUserMessages: targetTask.pendingUserMessages.slice(1)
                        }
                    }
                };
            });

            return message;
        }

        // PRIORITY 2: Check mailbox file for external messages
        let mailboxMessages = await readMailbox(
            agentContext.agentName,
            agentContext.teamName
        );

        if (mailboxMessages.length > 0) {
            let unread = mailboxMessages.filter(m => !m.read);
            if (unread.length > 0) {
                await markMessagesAsRead(
                    agentContext.agentName,
                    agentContext.teamName
                );
                return unread[0];
            }
        }

        // PRIORITY 3: Sleep before next poll
        await sleep(POLL_INTERVAL_MS);
        pollCount++;
    }

    return null;  // Aborted
}

// Mapping: DNY→pollForNextMessage, A→agentContext, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→sleep, H→task, J→message
```

### Polling Priority

```
Message Priority Order:

1. pendingUserMessages (in-memory queue)
   └─ Direct messages from team-lead or other teammates
   └─ Highest priority - no I/O needed
   └─ Retrieved in O(1) from state

2. Mailbox file (filesystem queue)
   └─ External messages persisted to disk
   └─ Lower priority - requires file I/O
   └─ Uses file locking for safety

3. Sleep and retry
   └─ No messages available
   └─ Wait POLL_INTERVAL_MS before next check
```

---

## Algorithm 6: Abort Signal Propagation

### What it does

Propagates abort signals through the task hierarchy, ensuring clean termination of all child operations.

### Why this approach

1. **Atomic operation** - Abort and state update happen together
2. **Memory efficiency** - Only last message retained
3. **Control cleanup** - Controllers and handlers cleared
4. **Notification guaranteed** - `notified: false` ensures delivery

### Source Code

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

### Abort Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Abort Signal Propagation                             │
└─────────────────────────────────────────────────────────────────────────────┘

User triggers kill (Ctrl+F or TaskStop)
        │
        ▼
┌───────────────────┐
│ triggerAbortSignal│
│ (x66)             │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐     No      ┌─────────────────────────────┐
│ Task running?     │────────────►│ Return false (no-op)        │
└─────────┬─────────┘             └─────────────────────────────┘
          │ Yes
          ▼
┌───────────────────┐
│ abortController   │
│ .abort()          │ ──► Agent loop receives signal between turns
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ unregisterCleanup │ ──► Remove process exit handlers
│ .call()           │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Update state:     │
│ status = "killed" │ ──► UI shows "killed" immediately
│ endTime = now     │
│ Clear references  │
│ notified = false  │ ──► Will trigger notification on next poll
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ removeActiveAgent │ ──► Remove from active tracking set
└───────────────────┘
```

---

## Algorithm Comparison

| Algorithm | Complexity | Key Insight |
|-----------|------------|-------------|
| Task ID | O(1) | Crypto random + type prefix |
| Terminal Status | O(1) | Simple equality check |
| Task Entry | O(1) | Object creation with defaults |
| Tool Filter | O(n*m) | Set membership for O(1) lookup per tool |
| Mailbox Poll | O(1) per poll | Priority queue check |
| Abort Propagation | O(1) | Single controller abort |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `G97` | CHARSET | chunks.41.mjs:2434 | ✓ Verified |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402 | ✓ Verified |
| `RG` | createTaskEntry | chunks.41.mjs:2418 | ✓ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |

---

## Related Documents

- [key_algorithms_source_restored.md](./key_algorithms_source_restored.md) - Original algorithms
- [task_management_source_restored.md](./task_management_source_restored.md) - Task management
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox system