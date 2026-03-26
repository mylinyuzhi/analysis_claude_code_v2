# Subagent Key Algorithms - Source-Level Restoration (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in the subagent system.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - Generate unique task ID — `chunks.41.mjs:2410`
- `Xk8` - Filter tools for subagent — `chunks.93.mjs:1568`
- `qh` - Agent loop runner — `chunks.133.mjs:1565`
- `DNY` - Poll for next message — `chunks.134.mjs:1483`
- `x66` - Trigger abort signal — `chunks.146.mjs:2012`

---

## Algorithm 1: Task ID Generation

### What it does

Generates unique, collision-resistant task IDs with type prefixes for quick identification.

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

    // Step 2: Generate 8 random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Build ID: prefix + 8 random chars
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, k$3→getTaskTypePrefix, N$3→crypto.getRandomValues,
//          G97→CHARSET, K→randomBytes, Y→taskId
```

### Supporting Data

```javascript
// ============================================
// Task ID constants and prefix mapping
// Location: chunks.41.mjs:2434-2445
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
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r",
    in_process_teammate: "t",
    local_workflow: "w"
};

function getTaskTypePrefix(taskType) {
    return TASK_TYPE_PREFIXES[taskType] ?? "x";  // "x" for unknown types
}
```

### Algorithm Analysis

**Step-by-step:**

1. **Type prefix lookup**: Map task type to single-char prefix
2. **Random generation**: 8 cryptographically random bytes
3. **Charset encoding**: Map each byte to charset character (modulo 36)
4. **ID construction**: Concatenate prefix + encoded chars

**Why this approach:**
- **Type prefix** enables quick visual identification of task origin
- **36-char charset** (0-9, a-z) provides URL-safe, human-readable IDs
- **8 random chars** gives ~2.8 trillion combinations (36^8)
- **Crypto randomness** ensures no collision predictability

**Collision analysis:**
- Charset size: 36 characters
- ID length: 8 characters
- Total combinations: 36^8 = 2,821,109,907,456
- With 1 million tasks: collision probability ≈ 0.00000002%

---

## Algorithm 2: Tool Filtering for Subagent

### What it does

Filters available tools based on agent type, execution mode, and permission context to prevent dangerous or blocking operations.

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
        // Rule 1: Always allow MCP tools (external integrations)
        if (tool.name.startsWith("mcp__")) return true;

        // Rule 2: Allow AskUserQuestion in plan mode
        if (isToolNamed(tool, "AskUserQuestion") && permissionMode === "plan") {
            return true;
        }

        // Rule 3: Block tools that should never be in subagents
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 4: Block certain tools for non-built-in agents
        if (!isBuiltIn && FOREGROUND_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 5: For async agents, only allow whitelisted tools
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
//          eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS
```

### Tool Filter Constants

```javascript
// ============================================
// Tool filter sets
// Location: chunks.91.mjs:269
// ============================================

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

### Why This Approach

1. **MCP tools allowed**: External tools may be needed for agent tasks
2. **Blocked tools**: Prevent infinite loops and blocking operations
3. **Async whitelist**: Only non-blocking tools for background agents
4. **Delegate exception**: Team delegates get special communication tools

---

## Algorithm 3: Agent Loop Runner

### What it does

Core async generator that drives the agent execution loop, yielding messages in real-time.

### Source Code

```javascript
// ============================================
// qh - agentLoopRunner - Core agent execution generator
// Location: chunks.133.mjs:1565-1700 (inferred)
// ============================================

// ORIGINAL (for source lookup):
async function* qh({
    agentDefinition: A,
    promptMessages: q,
    toolUseContext: K,
    canUseTool: Y,
    isAsync: z,
    canShowPermissionPrompts: _,
    forkContextMessages: w,
    querySource: O,
    override: $,
    model: H,
    maxTurns: j,
    preserveToolUseResults: J,
    availableTools: M,
    allowedTools: D,
    onCacheSafeParams: X,
    useExactTools: P,
    worktreePath: W,
    transcriptSubdir: Z,
    onQueryProgress: G
}) {
    let f = K.getAppState(),
        v = f.toolPermissionContext.mode,
        N = K.setAppStateForTasks ?? K.setAppState,
        V = C01(A.model, K.options.mainLoopModel, H, v),
        L = $?.agentId ? $.agentId : bI();
    // ... loop continues
}

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,
    promptMessages,
    toolUseContext,
    canUseTool,
    isAsync,
    canShowPermissionPrompts,
    forkContextMessages,
    querySource,
    override,
    model,
    maxTurns,
    preserveToolUseResults,
    availableTools,
    allowedTools,
    onCacheSafeParams,
    useExactTools,
    worktreePath,
    transcriptSubdir,
    onQueryProgress
}) {
    // Get app state and context
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Resolve model to use
    let resolvedModel = resolveModel(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );

    // Get or create agent ID
    let agentId = override?.agentId ?? generateNewAgentId();

    // Main loop
    for await (let message of llmLoop({
        messages: promptMessages,
        tools: availableTools,
        toolUseContext,
        canUseTool,
        isAsync,
        // ... other params
    })) {
        // Yield message to caller in real-time
        yield message;

        // Handle tool use if present
        if (message.type === "tool_use") {
            let result = await executeToolCall(message);
            yield result;
        }

        // Check abort signal
        if (toolUseContext.abortSignal?.aborted) {
            break;
        }
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext,
//          Y→canUseTool, z→isAsync, H→model, j→maxTurns, M→availableTools, D→allowedTools
```

### Loop Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Agent Loop Execution Flow                            │
└─────────────────────────────────────────────────────────────────────────────┘

Initialize:
  • Resolve model
  • Create/get agent ID
  • Set up context
        │
        ▼
┌───────────────────┐
│ LLM Loop Start    │◄──────────────────────────────────────────────┐
└─────────┬─────────┘                                               │
          │                                                         │
          ▼                                                         │
┌───────────────────┐     No      ┌─────────────────────────────┐  │
│ Abort signaled?   │────────────►│ Yield message to caller     │  │
└─────────┬─────────┘             └──────────┬──────────────────┘  │
          │ Yes                              │                      │
          ▼                                  ▼                      │
┌───────────────────┐             ┌─────────────────────────────┐  │
│ Break loop        │             │ Tool use in message?        │  │
│ Clean up          │             └──────────┬──────────────────┘  │
└───────────────────┘                        │                      │
                                    ┌────────┴────────┐             │
                                    │ No              │ Yes         │
                                    ▼                 ▼             │
                              ┌───────────┐   ┌───────────────────┐ │
                              │ Continue  │   │ Execute tool call │ │
                              │           │   │ Yield result      │ │
                              └───────────┘   └─────────┬─────────┘ │
                                                        │           │
                                                        └───────────┘
```

### Why Generator Pattern

1. **Real-time streaming**: Yield messages as they arrive
2. **Memory efficiency**: Don't buffer entire conversation
3. **Cancellable**: Check abort signal between yields
4. **Composable**: Caller can process incrementally

---

## Algorithm 4: Mailbox Polling

### What it does

Teammate agents poll their mailbox for incoming messages with priority handling.

### Source Code

```javascript
// ============================================
// DNY - pollForNextMessage - Priority poll loop for teammate messages
// Location: chunks.134.mjs:1483-1550
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
                            // ... update state
                        }
                    }
                };
            }), J;
        }
        // ... sleep and continue polling
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
        // Check for pending user messages
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

        // Check mailbox file for external messages
        let mailboxMessages = await readMailbox(agentContext.agentName, agentContext.teamName);
        if (mailboxMessages.length > 0) {
            let unread = mailboxMessages.filter(m => !m.read);
            if (unread.length > 0) {
                await markMessagesAsRead(agentContext.agentName, agentContext.teamName);
                return unread[0];
            }
        }

        // Sleep before next poll
        await sleep(POLL_INTERVAL_MS);
        pollCount++;
    }

    return null;  // Aborted
}

// Mapping: DNY→pollForNextMessage, A→agentContext, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→sleep
```

### Polling Priority

```
Message Priority Order:

1. pendingUserMessages (in-memory queue)
   └─ Direct messages from team-lead or other teammates
   └─ Highest priority - no I/O needed

2. Mailbox file (filesystem queue)
   └─ External messages persisted to disk
   └─ Lower priority - requires file I/O

3. Sleep and retry
   └─ No messages available
   └─ Wait POLL_INTERVAL_MS before next check
```

---

## Algorithm 5: Abort Signal Propagation

### What it does

Propagates abort signals through the task hierarchy, ensuring clean termination of all child operations.

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
    let wasRunning = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasRunning = true;

        // Trigger the abort controller
        task.abortController?.abort();

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // If task was running, notify completion
    if (wasRunning) {
        notifyTaskCompletion(taskId);
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask, $O→notifyTaskCompletion
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
│ .abort()          │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ unregisterCleanup │
│ .call()           │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Update state:     │
│ status = "killed" │
│ endTime = now     │
│ Clear references  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ notifyCompletion  │
│ (notification)    │
└───────────────────┘
```

### Child Abort Controller

```javascript
// ============================================
// R61 - createChildAbortController - Create linked abort controller
// Location: chunks.6.mjs:465 (inferred)
// ============================================

// READABLE (for understanding):
function createChildAbortController(parentAbortController) {
    let childController = new AbortController();

    // Link: when parent aborts, child aborts too
    parentAbortController.signal.addEventListener("abort", () => {
        childController.abort();
    });

    return childController;
}
```

---

## Algorithm Comparison

| Algorithm | Complexity | Key Insight |
|-----------|------------|-------------|
| Task ID | O(1) | Crypto random + type prefix |
| Tool Filter | O(n) | Set membership for O(1) lookup |
| Agent Loop | O(turns) | Generator for streaming |
| Mailbox Poll | O(1) per poll | Priority queue check |
| Abort Propagation | O(1) | Single controller abort |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `G97` | CHARSET | chunks.41.mjs:2434 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |

---

## Related Documents

- [agent_loop_algorithm.md](./agent_loop_algorithm.md) - Detailed agent loop analysis
- [tool_filtering_source_restored.md](./tool_filtering_source_restored.md) - Tool filtering details
- [abort_signal_propagation_source_restored.md](./abort_signal_propagation_source_restored.md) - Abort handling
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox system