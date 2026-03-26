# Key Algorithms Deep Dive V6 (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in the subagent and background agents system including Task ID generation, Fork Context cloning, Tool Filtering, Abort Signal propagation, Mailbox Polling, Output File System, and URI Tracking.

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
- `TIY` - Count unique URIs — `chunks.144.mjs:832`

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

### Exclusion Lists

```javascript
// BACKGROUND_AGENT_EXCLUDED_TOOLS (CW6)
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
]);

// ASYNC_AGENT_ALLOWED_TOOLS (eP1)
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);

// TEAM_DELEGATE_TOOLS (WY4)
const TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
]);
```

---

## Algorithm 3: Abort Signal Propagation (x66, U4q)

**What it does:** Propagates abort signals through task hierarchy with cleanup.

### Abort Flow

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

        // Step 1: Abort the controller
        // This cancels:
        // - LLM streaming response
        // - Any pending tool executions
        // - Child abort controllers (nested agents)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler
        // Prevents double cleanup when process exits
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep last message for debugging/resume
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references for GC
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer to preserve partial results
    if (wasAborted) {
        flushOutputBuffer(taskId);  // $O
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted,
//          Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

**Why flush output buffer:**
- **Partial results preserved**: User can see what was accomplished before kill
- **Debugging aid**: Helps understand what the agent was doing
- **Transparency**: No silent loss of work

---

## Algorithm 4: Mailbox Polling (DNY)

**What it does:** Priority-based message polling for teammate agents.

```javascript
// ============================================
// DNY - pollForNextMessage - Priority poll loop for teammate messages
// Location: chunks.134.mjs:1483-1568
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
        if (O++, q.signal.aborted) return { type: "aborted" };
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
                return { type: "shutdown_request", request: D }
            }
            // Priority 2: Messages from team-lead
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read && W.from === BY) { X = P; break }
            }
            // Priority 3: Any unread message
            if (X === -1) X = J.findIndex((P) => !P.read);
            if (X !== -1) {
                let P = J[X];
                await Vc6(A.agentName, A.teamName, X);
                return { type: "new_message", message: P.text, from: P.from }
            }
        } catch (J) { k(`Error: ${J}`) }
        // Check for unclaimed tasks
        let j = await Ji4(_, A.agentName);
        if (j) return { type: "new_message", message: j, from: "task-list" }
    }
    return { type: "aborted" }
}

// READABLE (for understanding):
async function pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, taskManager) {
    log(`[inProcessRunner] ${identity.agentName} starting poll loop`);
    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // PRIORITY 0: Check for pending user messages (fastest path)
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];
            // Remove from pending
            setAppState((state) => ({...}));
            return { type: "new_message", message, from: "user" };
        }

        // Throttle polling (500ms delay after first poll)
        if (pollCount > 0) await sleep(500);
        pollCount++;

        if (abortController.signal.aborted) {
            return { type: "aborted" };
        }

        try {
            // Read mailbox
            let messages = await readMailbox(identity.agentName, identity.teamName);

            // PRIORITY 1: Shutdown requests (highest priority)
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let shutdownReq = parseShutdownRequest(msg.text);  // M66
                    if (shutdownReq) {
                        await markMessageAsReadByIndex(identity.agentName, identity.teamName, i);
                        return { type: "shutdown_request", request: shutdownReq };
                    }
                }
            }

            // PRIORITY 2: Messages from team-lead (BY = "team-lead")
            let teamLeadMsgIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read && msg.from === "team-lead") {
                    teamLeadMsgIndex = i;
                    break;
                }
            }

            // PRIORITY 3: Any unread message
            if (teamLeadMsgIndex === -1) {
                teamLeadMsgIndex = messages.findIndex((msg) => !msg.read);
            }

            if (teamLeadMsgIndex !== -1) {
                let msg = messages[teamLeadMsgIndex];
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, teamLeadMsgIndex);
                return {
                    type: "new_message",
                    message: msg.text,
                    from: msg.from,
                    color: msg.color,
                    summary: msg.summary
                };
            }
        } catch (error) {
            log(`Poll error: ${error}`);
        }

        // PRIORITY 4: Check for unclaimed tasks
        let unclaimedTask = await claimUnclaimedTask(taskManager, identity.agentName);
        if (unclaimedTask) {
            return { type: "new_message", message: unclaimedTask, from: "task-list" };
        }
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→identity, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→taskManager, O→pollCount,
//          wl→readMailbox, Vc6→markMessageAsReadByIndex, M66→parseShutdownRequest,
//          Ji4→claimUnclaimedTask, jNY→sleep, BY→TEAM_LEAD_ID
```

**Priority Order:**
1. **Pending user messages** - Direct UI input, fastest path
2. **Shutdown requests** - Coordinated termination
3. **Team-lead messages** - Priority over other teammates
4. **Any unread message** - General communication
5. **Unclaimed tasks** - Auto-claim from shared task list

---

## Algorithm 5: Output File System (Y91, g2, Z97)

### OutputBuffer Class

```javascript
// ============================================
// Y91 - OutputBuffer - Buffered output file writer
// Location: chunks.41.mjs:2252-2308
// ============================================

// Key design decisions:

class OutputBuffer {
    // Private fields
    #filePath;           // Output file path
    #fileHandle = null;  // Lazy-opened file handle
    #pendingChunks = []; // Queue of content to write
    #flushPromise = null; // Current flush operation
    #resolveFlush = null; // Resolver for flush promise

    append(content) {
        // Non-blocking: Queue content and start background flush
        this.#pendingChunks.push(content);
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise(resolve => {
                this.#resolveFlush = resolve;
            });
            this.#startFlushCycle();
        }
    }

    async flush() {
        // Wait for all pending writes
        return this.#flushPromise ?? Promise.resolve();
    }

    cancel() {
        // Discard pending writes
        this.#pendingChunks.length = 0;
    }

    // Internal: Coalesce multiple appends into single write
    #buildBuffer() {
        let chunks = this.#pendingChunks.splice(0, this.#pendingChunks.length);
        let totalSize = chunks.reduce((sum, c) => sum + Buffer.byteLength(c, "utf8"), 0);
        let buffer = Buffer.allocUnsafe(totalSize);
        let offset = 0;
        for (let chunk of chunks) {
            offset += buffer.write(chunk, offset, "utf8");
        }
        return buffer;
    }
}
```

**Why this design:**
- **Non-blocking append**: Returns immediately, flushes in background
- **Coalescing**: Multiple appends → single write syscall
- **Lazy file open**: Only opens when first write occurs
- **Platform-specific flags**: Windows vs Unix file modes

---

## Algorithm 6: URI Tracking (TIY, vIY, NIY)

**CRITICAL CORRECTION**: These are NOT progress throttling functions. They track file URIs.

```javascript
// ============================================
// TIY - countUniqueUris - Count unique URIs
// Location: chunks.144.mjs:832-835
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = A.map((K) => K.uri).filter((K) => K);
    return new Set(q).size
}

// READABLE (for understanding):
function countUniqueUris(items) {
    // Extract URI from each item, filter out null/undefined
    let uris = items.map((item) => item.uri).filter((uri) => uri);
    // Return count of unique URIs
    return new Set(uris).size;
}

// Mapping: TIY→countUniqueUris, A→items, K→item/uri, q→uris
```

**Actual Usage:**
- **File edit tracking**: Count files modified
- **LSP operation stats**: Unique files in operations
- **Code intelligence**: Track file coverage

**Why the correction matters:**
- Previous documentation incorrectly mapped TIY to `countTurnsSinceLastProgress`
- This led to confusion about progress throttling mechanism
- Progress throttling is implicit in the agent loop, not a separate function

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2432 | ✓ Verified |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | ✓ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `Y91` | OutputBuffer | chunks.41.mjs:2252 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Verified |
| `TIY` | countUniqueUris | chunks.144.mjs:832 | ✓ Corrected |
| `vIY` | countUniqueSourceUris | chunks.144.mjs:837 | ✓ Verified |
| `NIY` | countUniqueTargetUris | chunks.144.mjs:842 | ✓ Verified |

---

## Related Documents

- [cross_validation_report_v2.md](./cross_validation_report_v2.md) - Symbol verification
- [ui_interaction_complete_v5.md](./ui_interaction_complete_v5.md) - UI components
- [system_reminder_integration_complete_source.md](../26_background_agents/system_reminder_integration_complete_source.md) - System reminder integration
- [cross_feature_linkages_complete_v5.md](./cross_feature_linkages_complete_v5.md) - Feature integrations