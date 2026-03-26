# Key Algorithms Deep Dive V5 (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in the subagent system including Task ID generation, Fork Context cloning, Tool Filtering, Abort Signal propagation, Mailbox Polling, and Output File System.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - Generate task ID — `chunks.41.mjs:2410`
- `Fx8` - Clone fork context — `chunks.133.mjs:1788`
- `Xk8` - Filter tools for subagent — `chunks.93.mjs:1568`
- `_c` - Apply tool filters — `chunks.93.mjs:1590`
- `x66` - Trigger abort signal — `chunks.146.mjs:2012`
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `DNY` - Poll for next message — `chunks.134.mjs:1483`
- `Y91` - OutputBuffer class — `chunks.41.mjs:2252`

---

## Algorithm 1: Task ID Generation (oV)

**What it does:** Generates unique, type-prefixed task IDs using cryptographic randomness.

**How it works:**

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
    // Step 1: Get type prefix (single character)
    let prefix = getTaskTypePrefix(taskType);  // k$3

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.randomBytes(8);  // N$3

    // Step 3: Build ID using alphanumeric encoding
    let taskId = prefix;
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";  // G97

    for (let i = 0; i < 8; i++) {
        taskId += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→crypto.randomBytes, G97→ALPHABET
```

**Why this approach:**
- **Type identification**: One character prefix immediately identifies task category
- **Cryptographic randomness**: Prevents ID collision even in parallel execution
- **Alphanumeric encoding**: URL-safe, filesystem-safe IDs
- **Fixed length**: 9 characters (1 prefix + 8 random) for consistent display

**Collision Analysis:**
- Total ID space: 36^8 = 2,821,109,907,456 possible IDs per type
- With 36-character alphabet, birthday paradox suggests ~50% collision at ~1.7M IDs
- In practice, extremely unlikely to collide given typical usage patterns

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
    local_bash: "b",              // Shell commands
    local_agent: "a",             // Local subagents
    remote_agent: "r",            // Remote session agents
    in_process_teammate: "t",     // In-process teammates
    local_workflow: "w"           // Workflow tasks
};
// Unknown types get "x" prefix

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Example IDs

| Task Type | Generated ID | Breakdown |
|-----------|--------------|-----------|
| local_agent | `ab3k7m9p2` | a + b3k7m9p2 |
| local_bash | `bx5n8q1w4` | b + x5n8q1w4 |
| in_process_teammate | `tp9m2k5r8` | t + p9m2k5r8 |
| unknown_type | `xq3w7e5t9` | x + q3w7e5t9 |

---

## Algorithm 2: Tool Filtering (Xk8, _c)

**What it does:** Filters available tools for subagents based on task type, permissions, and exclusion lists.

### Core Filter Function (Xk8)

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on subagent type
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
        // RULE 1: MCP tools are always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // RULE 2: Plan mode uses special tools
        if (hasToolPermission(tool, "plan") && permissionMode === "plan") {
            return true;
        }

        // RULE 3: Always exclude certain tools (kill, todo, etc.)
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // RULE 4: Non-built-in tools have additional restrictions
        if (!isBuiltIn && NON_BUILTIN_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 5: Async/background agents have strict whitelist
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: If async tool override is enabled
            if (isAsyncToolOverrideEnabled() && hasAsyncPermission()) {
                // Allow write-family tools with specific permissions
                if (hasToolPermission(tool, "write")) return true;
                if (ASYNC_WRITE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync,
//          Y→permissionMode, z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS,
//          xV8→NON_BUILTIN_EXCLUDED_TOOLS, eP1→ASYNC_AGENT_ALLOWED_TOOLS
```

**Why this approach:**
- **Layered filtering**: Multiple rules applied in priority order
- **MCP bypass**: External tools managed separately
- **Type-specific restrictions**: Async agents have stricter tool access
- **Permission integration**: Respects plan mode permissions

### Tool Application (_c)

```javascript
// ============================================
// _c - applyToolFilters - Apply user-specified tool restrictions
// Location: chunks.93.mjs:1590-1639
// ============================================

// ORIGINAL (for source lookup):
function _c(A, q, K = !1, Y = !1) {
    let {
        tools: z,
        disallowedTools: _,
        source: w,
        permissionMode: O
    } = A, $ = Y ? q : Xk8({
        tools: q,
        isBuiltIn: w === "built-in",
        isAsync: K,
        permissionMode: O
    }), H = new Set(_?.map((G) => {
        let {
            toolName: f
        } = CH(G);
        return f
    }) ?? []), j = $.filter((G) => !H.has(G.name));
    if (z === void 0 || z.length === 1 && z[0] === "*") return {
        hasWildcard: !0,
        validTools: [],
        invalidTools: [],
        resolvedTools: j
    };
    // ... rest of function handles explicit tool list
}

// READABLE (for understanding):
function applyToolFilters(toolUseContext, allTools, isAsync = false, skipBaseFilter = false) {
    let {
        tools: requestedTools,      // User-specified tool list
        disallowedTools,            // Explicitly forbidden tools
        source,                     // Tool source ("built-in" or other)
        permissionMode
    } = toolUseContext;

    // Step 1: Apply base filter (unless skipped)
    let candidateTools = skipBaseFilter
        ? allTools
        : filterToolsForSubagent({
            tools: allTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Remove explicitly disallowed tools
    let disallowedNames = new Set(
        disallowedTools?.map((toolRef) => parseToolReference(toolRef).toolName) ?? []
    );
    let allowedTools = candidateTools.filter((tool) => !disallowedNames.has(tool.name));

    // Step 3: Handle wildcard case (all allowed tools)
    if (requestedTools === undefined ||
        (requestedTools.length === 1 && requestedTools[0] === "*")) {
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: allowedTools  // All filtered tools
        };
    }

    // Step 4: Match against explicit tool list
    let toolMap = new Map();
    for (let tool of allowedTools) {
        toolMap.set(tool.name, tool);
    }

    let validTools = [];     // Requested and available
    let invalidTools = [];   // Requested but not available
    let resolvedTools = [];  // Actual tool objects
    let seenTools = new Set();
    let writeToolsRule = null;

    for (let toolRef of requestedTools) {
        let { toolName, ruleContent } = parseToolReference(toolRef);

        // Handle special "write" rule for async agents
        if (toolName === "write") {
            if (ruleContent) {
                writeToolsRule = ruleContent.split(",").map((s) => s.trim());
            }
            if (!skipBaseFilter) {
                validTools.push(toolRef);
                continue;
            }
        }

        let tool = toolMap.get(toolName);
        if (tool) {
            validTools.push(toolRef);
            if (!seenTools.has(tool)) {
                resolvedTools.push(tool);
                seenTools.add(tool);
            }
        } else {
            invalidTools.push(toolRef);
        }
    }

    return {
        hasWildcard: false,
        validTools,
        invalidTools,
        resolvedTools
    };
}

// Mapping: _c→applyToolFilters, A→toolUseContext, q→allTools, K→isAsync,
//          Y→skipBaseFilter, z→requestedTools, _→disallowedTools, w→source,
//          O→permissionMode, $→candidateTools, H→disallowedNames, j→allowedTools
```

**Why this approach:**
- **Two-phase filtering**: Base filter + user restrictions
- **Disallowed tools set**: O(1) lookup for removal
- **Wildcard support**: "*" means "all allowed tools"
- **Invalid tracking**: Reports which requested tools weren't available

### Tool Filter Constants

```javascript
// ============================================
// CW6, xV8, eP1 - Tool filter constant sets
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([$C, aJ, dt, r4, Fw, OC]),
xV8 = new Set([...CW6]),
eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1]),
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
// Tools always excluded from background agents
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "Agent",       // Cannot spawn nested agents
    "TodoWrite",   // Cannot manage todos
    "exit_plan_mode",  // Cannot exit plan mode
    "write",       // Cannot use write tool directly
    "TaskOutput",  // Cannot wait for task outputs
    "CronCreate"   // Cannot schedule cron jobs
]);

// Tools excluded for non-built-in sources
const NON_BUILTIN_EXCLUDED_TOOLS = new Set([...BACKGROUND_AGENT_EXCLUDED_TOOLS]);

// Tools allowed for async/background agents
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "Glob", "Grep", "Bash", "NotebookEdit",
    "WebFetch", "WebSearch", "Edit",
    // Plus write-family tools with specific permissions
    "Write", "apply_patch", " NotebookEdit"
    // Plus MCP tools (handled separately)
]);

// Additional write-family tools for async override
const ASYNC_WRITE_TOOLS = new Set([
    "Write", "Edit", "apply_patch",
    "Glob", "Grep", "Bash",
    // Additional tools...
]);
```

---

## Algorithm 3: Fork Context Cloning (Fx8)

**What it does:** Filters orphaned tool_use blocks from messages when forking context to a subagent.

**How it works:**

```javascript
// ============================================
// Fx8 - cloneForkContext - Clone and filter fork context messages
// Location: chunks.133.mjs:1788-1804
// ============================================

// ORIGINAL (for source lookup):
function Fx8(A) {
    let q = new Set;
    for (let K of A)
        if (K?.type === "user") {
            let z = K.message.content;
            if (Array.isArray(z)) {
                for (let _ of z)
                    if (_.type === "tool_result" && _.tool_use_id) q.add(_.tool_use_id)
            }
        }
    return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((w) => w.type === "tool_use" && w.id && !q.has(w.id))
        }
        return !0
    })
}

// READABLE (for understanding):
function cloneForkContext(messages) {
    // PHASE 1: Collect all valid tool_use_ids
    // These are IDs that have corresponding tool_result blocks
    let validToolUseIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        validToolUseIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // PHASE 2: Filter out messages with orphaned tool_use blocks
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Remove if there's any tool_use without a matching result
                return !content.some((block) =>
                    block.type === "tool_use" &&
                    block.id &&
                    !validToolUseIds.has(block.id)
                );
            }
        }
        return true;  // Keep non-assistant messages
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→validToolUseIds, K→message,
//          z→content, _→block, w→tool_use_block
```

**Why this approach:**
- **Two-pass algorithm**: O(n) complexity, single scan for each phase
- **Set-based lookup**: O(1) membership test for tool_use_ids
- **Preserve valid messages**: Only removes messages with orphaned tool calls

**Key insight:** When forking context to a subagent, the LLM would be confused by incomplete tool calls (tool_use without tool_result). This filtering ensures the subagent receives a consistent conversation state.

---

## Algorithm 4: Atomic Task Update (i9)

**What it does:** Updates a single task in the state atomically with reference equality optimization.

**How it works:**

```javascript
// ============================================
// i9 - atomicUpdateTask - Atomically update a single task
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
        // Step 1: Check task exists
        let task = state.tasks?.[taskId];
        if (!task) return state;  // No-op if task doesn't exist

        // Step 2: Apply updater function
        let updatedTask = updater(task);

        // Step 3: Skip update if unchanged (reference equality)
        // This is crucial for React-style state management
        if (updatedTask === task) return state;

        // Step 4: Return new state with updated task
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

**Why this approach:**
- **Concurrency safety**: Multiple updates don't conflict due to immutable state
- **Reference equality optimization**: Skip re-renders if updater returns same object
- **Transactional**: All-or-nothing updates

**Key insight:** The reference equality check (`updatedTask === task`) is critical for React performance. If the updater returns the same object reference, React will skip re-rendering because state hasn't changed.

---

## Algorithm 5: Abort Signal Propagation (x66, U4q)

**What it does:** Propagates kill signals through the task hierarchy with proper cleanup.

### Single Task Abort (x66)

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

        // Step 1: Signal abort to LLM stream and tool executions
        task.abortController?.abort();

        // Step 2: Prevent cleanup handler from running twice
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush any buffered output to preserve partial results
    if (wasAborted) {
        flushOutputBuffer(taskId);  // $O
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted,
//          Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### Kill All Local Agents (U4q)

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
    // Iterate all tasks
    for (let [taskId, task] of Object.entries(tasks)) {
        // Filter: Only local_agent tasks that are running
        if (task.type === "local_agent" && task.status === "running") {
            // Delegate to single abort function
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId,
//          Y→task, x66→triggerAbortSignal
```

**Why this approach:**
- **Composition over duplication**: `U4q` delegates to `x66` rather than duplicating abort logic
- **Type filtering**: Only kills `local_agent` tasks, not bash or teammate tasks
- **Snapshot iteration**: `Object.entries()` creates a snapshot before mutation
- **Partial results preserved**: `flushOutputBuffer` ensures output isn't lost

### Abort Propagation Flow

```
User presses Ctrl+C → Ctrl+F
        │
        ▼
┌───────────────────────────────────────────┐
│ killAllLocalAgents (U4q)                  │
│                                           │
│ for each task:                            │
│   if local_agent && running:              │
│     triggerAbortSignal (x66)              │
└───────────────────┬───────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ triggerAbortSignal (x66)                  │
│                                           │
│ 1. abortController.abort()                │
│    → Cancels LLM stream                   │
│    → Propagates to tool executions        │
│                                           │
│ 2. unregisterCleanup()                    │
│    → Removes process exit handler         │
│                                           │
│ 3. Update state: status = "killed"        │
│                                           │
│ 4. flushOutputBuffer()                    │
│    → Preserve partial results             │
└───────────────────────────────────────────┘
```

---

## Algorithm 6: Mailbox Polling (DNY, wl, x3)

**What it does:** Implements priority-based message polling for in-process teammates with lock-based concurrency.

### Polling Loop (DNY)

```javascript
// ============================================
// DNY - pollForNextMessage - Priority-based message polling for teammates
// Location: chunks.134.mjs:1483-1569
// ============================================

// ORIGINAL (for source lookup):
async function DNY(A, q, K, Y, z, _) {
    k(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let O = 0;
    while (!q.signal.aborted) {
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => {...}), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }
        if (O > 0) await jNY(500);
        if (O++, q.signal.aborted) return {...};
        k(`[inProcessRunner] ${A.agentName} poll #${O}: checking mailbox`);
        try {
            let J = await wl(A.agentName, A.teamName),
                M = -1,
                D = null;
            // Priority 1: Shutdown requests
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read) {
                    let Z = M66(W.text);
                    if (Z) { M = P; D = Z; break }
                }
            }
            if (M !== -1) {
                await Vc6(A.agentName, A.teamName, M);
                return { type: "shutdown_request", request: D, ... };
            }
            // Priority 2: System messages (BY = system sender)
            let X = -1;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read && W.from === BY) { X = P; break }
            }
            // Priority 3: Any unread message
            if (X === -1) X = J.findIndex((P) => !P.read);
            if (X !== -1) {
                let P = J[X];
                await Vc6(A.agentName, A.teamName, X);
                return { type: "new_message", message: P.text, from: P.from, ... };
            }
        } catch (J) {...}
        // Priority 4: Task list claims
        let j = await Ji4(_, A.agentName);
        if (j) return { type: "new_message", message: j, from: "task-list" };
    }
    return { type: "aborted" };
}

// READABLE (for understanding):
async function pollForNextMessage(
    identity,           // Agent identity (agentName, teamName)
    abortController,    // Abort signal for cancellation
    taskId,             // Task ID for state lookups
    getAppState,        // State getter
    setAppState,        // State setter
    claimTask           // Task claiming function
) {
    log(`[inProcessRunner] ${identity.agentName} starting poll loop`);
    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // PRIORITY 0: Check pending user messages from state
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];
            // Remove from pending list
            setAppState((state) => {
                let t = state.tasks[taskId];
                if (!t || t.type !== "in_process_teammate") return state;
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...t,
                            pendingUserMessages: t.pendingUserMessages.slice(1)
                        }
                    }
                };
            });
            return { type: "new_message", message, from: "user" };
        }

        // Throttle polling (skip first iteration)
        if (pollCount > 0) await sleep(500);
        pollCount++;

        if (abortController.signal.aborted) {
            return { type: "aborted" };
        }

        log(`[inProcessRunner] ${identity.agentName} poll #${pollCount}: checking mailbox`);

        try {
            // Read mailbox
            let messages = await readMailbox(identity.agentName, identity.teamName);

            // PRIORITY 1: Shutdown requests (highest priority)
            let shutdownIndex = -1;
            let shutdownRequest = null;

            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let parsed = parseShutdownRequest(msg.text);
                    if (parsed) {
                        shutdownIndex = i;
                        shutdownRequest = parsed;
                        break;
                    }
                }
            }

            if (shutdownIndex !== -1) {
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, shutdownIndex);
                return {
                    type: "shutdown_request",
                    request: shutdownRequest,
                    originalMessage: messages[shutdownIndex].text
                };
            }

            // PRIORITY 2: System messages (from special "system" sender)
            let systemIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read && msg.from === SYSTEM_SENDER) {
                    systemIndex = i;
                    break;
                }
            }

            // PRIORITY 3: First unread message
            let messageIndex = systemIndex;
            if (messageIndex === -1) {
                messageIndex = messages.findIndex((msg) => !msg.read);
            }

            if (messageIndex !== -1) {
                let msg = messages[messageIndex];
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, messageIndex);
                return {
                    type: "new_message",
                    message: msg.text,
                    from: msg.from,
                    color: msg.color,
                    summary: msg.summary
                };
            }

        } catch (error) {
            log(`[inProcessRunner] ${identity.agentName} poll error: ${error}`);
        }

        // PRIORITY 4: Check for claimable tasks
        let claimedTask = await claimUnclaimedTask(claimTask, identity.agentName);
        if (claimedTask) {
            return {
                type: "new_message",
                message: claimedTask,
                from: "task-list"
            };
        }
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→identity, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→claimTask, O→pollCount,
//          wl→readMailbox, Vc6→markMessageAsReadByIndex, Ji4→claimUnclaimedTask
```

**Why this approach:**
- **Priority ordering**: Shutdown > System > Teammate > Task claims
- **Throttled polling**: 500ms delay between polls (not first iteration)
- **State integration**: Checks pending user messages first (no file I/O)
- **Abort-aware**: Returns immediately when abort signal received

### Mailbox Read (wl)

```javascript
// ============================================
// wl - readMailbox - Read all messages from mailbox file
// Location: chunks.132.mjs:3-14
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
    let mailboxPath = getMailboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let content = await fs.readFile(mailboxPath, "utf-8");
        let messages = JSON.parse(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        // Return empty array if mailbox doesn't exist yet
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath,
//          Y→content, z→messages, FY6→getMailboxPath, xd4→fs.readFile,
//          i1→JSON.parse, _6→reportError
```

### Mailbox Write (x3)

```javascript
// ============================================
// x3 - writeToMailbox - Write message with lock-based concurrency
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    try {
        await Pf6(Y, "[]", { encoding: "utf-8", flag: "wx" }),
        k("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (w) {
        if (w.code !== "EEXIST") {...}
    }
    let _;
    try {
        _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 });
        let w = await wl(A, K),
            O = { ...q, read: !1 };
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8"),
        k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {...} finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientAgent, message, teamName) {
    await ensureTeamDirectory(teamName);

    let mailboxPath = getMailboxPath(recipientAgent, teamName);
    let lockPath = `${mailboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientAgent}, from=${message.from}`);

    // Step 1: Create mailbox file if it doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Exclusive create - fails if exists
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
        // File already exists - proceed
    }

    // Step 2: Acquire lock and write
    let releaseLock;
    try {
        releaseLock = await lockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });

        // Read current messages
        let messages = await readMailbox(recipientAgent, teamName);

        // Append new message with read=false
        let newMessage = { ...message, read: false };
        messages.push(newMessage);

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientAgent}'s inbox from ${message.from}`);

    } catch (error) {
        log(`Failed to write to inbox for ${recipientAgent}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientAgent, q→message, K→teamName,
//          Y→mailboxPath, z→lockPath, _→releaseLock, w→messages, O→newMessage,
//          FY6→getMailboxPath, wl→readMailbox, Pf6→fs.writeFile, B6→JSON.stringify,
//          Nc6.lock→lockfile.lock, OTY→ensureTeamDirectory
```

**Why this approach:**
- **File-based communication**: No shared memory required between agents
- **Lock-based concurrency**: Prevents race conditions when multiple agents write
- **Exclusive create pattern**: Atomic mailbox initialization
- **JSON format**: Human-readable for debugging

### Message Priority Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAILBOX POLLING PRIORITY                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐
│ pollForNextMessage    │
│ (DNY)                 │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐     NO    ┌───────────────────────┐
│ Pending user messages │──────────▶│ Sleep 500ms           │
│ in state?             │           │ (skip first poll)     │
└───────────┬───────────┘           └───────────┬───────────┘
            │ YES                               │
            ▼                                   ▼
    Return message               ┌───────────────────────┐
                                  │ Read mailbox (wl)    │
                                  └───────────┬───────────┘
                                              │
                                              ▼
                                  ┌───────────────────────┐
                                  │ Shutdown request?     │
                                  │ (parse from message)  │
                                  └───────────┬───────────┘
                                    YES │           │ NO
                                        ▼           ▼
                            Mark read, return   ┌───────────────────┐
                            shutdown_request    │ System message?   │
                                                │ (from === BY)     │
                                                └─────────┬─────────┘
                                                  YES │         │ NO
                                                      ▼         ▼
                                              Mark read,   ┌───────────────┐
                                              return msg   │ First unread? │
                                                           └───────┬───────┘
                                                             YES │     │ NO
                                                                 ▼     ▼
                                                         Mark read,  ┌──────────────┐
                                                         return msg  │ Claim task?  │
                                                                     │ (Ji4)        │
                                                                     └──────┬───────┘
                                                                       YES │   │ NO
                                                                           ▼   ▼
                                                                   Return     Loop again
                                                                   claimed
```

---

## Algorithm 7: Output File System (Y91, Z97, g2)

**What it does:** Provides buffered, file-based output storage for background tasks with incremental reading.

### OutputBuffer Class (Y91)

```javascript
// ============================================
// Y91 - OutputBuffer - Buffered output writer for background tasks
// Location: chunks.41.mjs:2252-2308
// ============================================

// ORIGINAL (for source lookup):
class Y91 {
    #A;
    #q = null;
    #K = [];
    #z = null;
    #Y = null;
    constructor(A) {
        this.#A = g2(A)
    }
    append(A) {
        if (this.#K.push(A), !this.#z) this.#z = new Promise((q) => {
            this.#Y = q
        }), this.#H()
    }
    flush() {
        return this.#z ?? Promise.resolve()
    }
    cancel() {
        this.#K.length = 0
    }
    async #w() {
        while (!0) {
            try {
                if (!this.#q) await Y38(), this.#q = await M97(this.#A, process.platform === "win32" ? "a" : U46.O_WRONLY | U46.O_APPEND | U46.O_CREAT | X97);
                while (!0)
                    if (await this.#_(), this.#K.length === 0) break
            } finally {
                if (this.#q) {
                    let A = this.#q;
                    this.#q = null, await A.close()
                }
            }
            if (this.#K.length) continue;
            break
        }
    }
    #_() {
        return this.#q.appendFile(this.#$())
    }
    #$() {
        let A = this.#K.splice(0, this.#K.length),
            q = 0;
        for (let z of A) q += Buffer.byteLength(z, "utf8");
        let K = Buffer.allocUnsafe(q),
            Y = 0;
        for (let z of A) Y += K.write(z, Y, "utf8");
        return K
    }
    async #H() {
        try {
            await this.#w()
        } finally {
            let A = this.#Y;
            this.#z = null, this.#Y = null, A()
        }
    }
}

// READABLE (for understanding):
class OutputBuffer {
    #filePath;          // Output file path
    #fileHandle = null; // File handle (null when closed)
    #queue = [];        // Pending chunks to write
    #flushPromise = null;  // Promise resolved when flush completes
    #resolveFlush = null;  // Resolve function for flush promise

    constructor(taskId) {
        this.#filePath = getOutputFilePath(taskId);  // g2
    }

    // Append a string chunk to the buffer
    append(chunk) {
        this.#queue.push(chunk);

        // Start writing if not already writing
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise((resolve) => {
                this.#resolveFlush = resolve;
            });
            this.#startWriteLoop();
        }
    }

    // Wait for all pending writes to complete
    flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    // Cancel pending writes (not written yet)
    cancel() {
        this.#queue.length = 0;
    }

    // Internal: Main write loop
    async #writeLoop() {
        while (true) {
            try {
                // Ensure directory exists and file is open
                if (!this.#fileHandle) {
                    await ensureOutputDirectory();  // Y38
                    let flags = process.platform === "win32"
                        ? "a"  // Append mode for Windows
                        : O_WRONLY | O_APPEND | O_CREAT | O_NOFOLLOW;  // Unix flags
                    this.#fileHandle = await fs.open(this.#filePath, flags);
                }

                // Write until queue is empty
                while (true) {
                    await this.#writeChunk();
                    if (this.#queue.length === 0) break;
                }

            } finally {
                // Close file handle
                if (this.#fileHandle) {
                    let handle = this.#fileHandle;
                    this.#fileHandle = null;
                    await handle.close();
                }
            }

            // Check if more items were added during cleanup
            if (this.#queue.length) continue;
            break;
        }
    }

    // Internal: Write single chunk
    #writeChunk() {
        return this.#fileHandle.appendFile(this.#prepareBuffer());
    }

    // Internal: Combine queue into single buffer
    #prepareBuffer() {
        // Take all chunks from queue
        let chunks = this.#queue.splice(0, this.#queue.length);

        // Calculate total size
        let totalSize = 0;
        for (let chunk of chunks) {
            totalSize += Buffer.byteLength(chunk, "utf8");
        }

        // Allocate buffer and copy chunks
        let buffer = Buffer.allocUnsafe(totalSize);
        let offset = 0;
        for (let chunk of chunks) {
            offset += buffer.write(chunk, offset, "utf8");
        }

        return buffer;
    }

    // Internal: Start write loop with cleanup
    async #startWriteLoop() {
        try {
            await this.#writeLoop();
        } finally {
            let resolve = this.#resolveFlush;
            this.#flushPromise = null;
            this.#resolveFlush = null;
            resolve();  // Signal flush complete
        }
    }
}

// Mapping: Y91→OutputBuffer, #A→#filePath, #q→#fileHandle, #K→#queue,
//          #z→#flushPromise, #Y→#resolveFlush, g2→getOutputFilePath,
//          Y38→ensureOutputDirectory, M97→fs.open
```

**Why this approach:**
- **Batched writes**: Multiple append calls batched into single write
- **Async write loop**: Doesn't block caller while writing
- **Promise-based flush**: Caller can wait for all writes to complete
- **Automatic file management**: Opens on first write, closes when queue empty
- **Platform-specific flags**: Handles Windows vs Unix file flags

### Read Output Delta (Z97)

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read output file from offset with byte limit
// Location: chunks.41.mjs:2325-2348
// ============================================

// ORIGINAL (for source lookup):
async function Z97(A, q, K = P97) {
    try {
        let Y = await dt6(g2(A), q, K);
        if (!Y) return {
            content: "",
            newOffset: q
        };
        return {
            content: Y.content,
            newOffset: q + Y.bytesRead
        }
    } catch (Y) {
        if (Y.code === "ENOENT") return {
            content: "",
            newOffset: q
        };
        throw Y
    }
}

// READABLE (for understanding):
const OUTPUT_READ_BUFFER_SIZE = 8388608;  // P97 = 8MB

async function readOutputFileDelta(taskId, offset, maxBytes = OUTPUT_READ_BUFFER_SIZE) {
    try {
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),  // g2
            offset,
            maxBytes
        );

        if (!result) {
            return {
                content: "",
                newOffset: offset
            };
        }

        return {
            content: result.content,
            newOffset: offset + result.bytesRead
        };

    } catch (error) {
        // Return empty if file doesn't exist yet
        if (error.code === "ENOENT") {
            return {
                content: "",
                newOffset: offset
            };
        }
        throw error;
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→offset, K→maxBytes,
//          P97→OUTPUT_READ_BUFFER_SIZE, dt6→readFileFromOffset, g2→getOutputFilePath,
//          Y→result/error
```

**Why this approach:**
- **Incremental reading**: Only reads new output since last offset
- **8MB limit**: Prevents memory exhaustion from large outputs
- **ENOENT handling**: Returns empty if file doesn't exist
- **Offset tracking**: Returns new offset for next read

### Output File Path (g2)

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
    return path.join(getOutputDirectory(), `${taskId}.output`);
}

// Mapping: g2→getOutputFilePath, A→taskId, D97→path.join, yJ6→getOutputDirectory
```

### Buffer Registry (v$3, W97, $O)

```javascript
// ============================================
// v$3, W97, $O - Output buffer management functions
// Location: chunks.41.mjs:2310-2323
// ============================================

// ORIGINAL (for source lookup):
function v$3(A) {
    let q = K91.get(A);
    if (!q) q = new Y91(A), K91.set(A, q);
    return q
}
function W97(A, q) {
    v$3(A).append(q)
}
async function $O(A) {
    let q = K91.get(A);
    if (q) await q.flush(), K91.delete(A)
}

// READABLE (for understanding):
let outputBufferRegistry = new Map();  // K91

function getOrCreateOutputBuffer(taskId) {
    let buffer = outputBufferRegistry.get(taskId);
    if (!buffer) {
        buffer = new OutputBuffer(taskId);
        outputBufferRegistry.set(taskId, buffer);
    }
    return buffer;
}

function appendToOutputFile(taskId, content) {
    getOrCreateOutputBuffer(taskId).append(content);
}

async function flushOutputBuffer(taskId) {
    let buffer = outputBufferRegistry.get(taskId);
    if (buffer) {
        await buffer.flush();
        outputBufferRegistry.delete(taskId);
    }
}

// Mapping: v$3→getOrCreateOutputBuffer, W97→appendToOutputFile, $O→flushOutputBuffer,
//          A→taskId, q→buffer/content, K91→outputBufferRegistry, Y91→OutputBuffer
```

### Output File Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OUTPUT FILE DATA FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Execution
        │
        │ Stream output (stdout, LLM responses)
        ▼
┌───────────────────────┐
│ appendToOutputFile    │ (W97)
│ (taskId, content)     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ getOrCreateOutputBuffer│ (v$3)
│                       │
│ K91.get(taskId)       │
│ → OutputBuffer        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ OutputBuffer (Y91)    │
│                       │
│ #queue.push(content)  │
│ #startWriteLoop()     │
└───────────┬───────────┘
            │
            │ Async write loop
            ▼
┌───────────────────────┐
│ {taskId}.output file  │
│                       │
│ /output/{taskId}.output
└───────────┬───────────┘
            │
            │ Parent session polling
            ▼
┌───────────────────────┐
│ readOutputFileDelta   │ (Z97)
│ (taskId, offset)      │
│                       │
│ readFileFromOffset()  │
│ → content, newOffset  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Task Progress         │
│ Attachment            │
│                       │
│ type: "task_progress" │
│ message: content      │
└───────────────────────┘
```

---

## Algorithm 8: Task State Machine

**What it does:** Manages the lifecycle of tasks through their states.

### State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE MACHINE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   pending    │ ← Initial state (createTaskRecord)
                         └──────┬───────┘
                                │ spawn (Qn4/Un4)
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success: $m8]      [error: Hm8]        [user kill: x66]
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
                         │   notified   │ ← Ready for eviction
                         │   = true     │
                         └──────┬───────┘
                                │ removeTask (VR)
                                ▼
                         ┌──────────────┐
                         │   removed    │ ← No longer in state
                         └──────────────┘
```

### State Transition Functions

| From | To | Trigger | Function | Symbol |
|------|-----|---------|----------|--------|
| - | pending | createTaskRecord | `RG` | chunks.41.mjs:2418 |
| pending | running | spawn execution | `Qn4` / `Un4` | chunks.146.mjs:2133/2165 |
| running | completed | Success | `markTaskCompleted` | `$m8` @ chunks.146.mjs:2100 |
| running | failed | Error | `markTaskFailed` | `Hm8` @ chunks.146.mjs:2117 |
| running | killed | User kill | `triggerAbortSignal` | `x66` @ chunks.146.mjs:2012 |
| terminal | notified | Notification sent | `markTaskKilled` | `d4q` @ chunks.146.mjs:2034 |
| notified+terminal | removed | After notification | `removeTask` | `VR` @ chunks.90.mjs:3037 |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `G97` | ALPHABET | chunks.41.mjs:2434 | ✓ Verified |
| `P97` | OUTPUT_READ_BUFFER_SIZE | chunks.41.mjs:2387 | ✓ Verified (8MB) |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `_c` | applyToolFilters | chunks.93.mjs:1590 | ✓ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | ✓ Verified |
| `Y91` | OutputBuffer | chunks.41.mjs:2252 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `v$3` | getOrCreateOutputBuffer | chunks.41.mjs:2310 | ✓ Verified |
| `W97` | appendToOutputFile | chunks.41.mjs:2316 | ✓ Verified |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | ✓ Verified |

---

## Related Documents

- [ui_interaction_complete_v4.md](./ui_interaction_complete_v4.md) - UI interaction
- [system_reminder_integration_v6.md](./system_reminder_integration_v6.md) - System reminder integration
- [cross_feature_linkages_complete_v4.md](./cross_feature_linkages_complete_v4.md) - Feature integrations
- [mailbox_system_complete_source_v2.md](./mailbox_system_complete_source_v2.md) - Mailbox system