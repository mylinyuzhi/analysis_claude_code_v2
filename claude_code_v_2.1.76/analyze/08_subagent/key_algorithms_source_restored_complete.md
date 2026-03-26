# Key Algorithms Source Restored - Complete (Claude Code 2.1.76)

> Source-level restoration of 8 key algorithms for subagent and background agent systems.
> All code verified against source chunks.*.mjs files on 2026-03-27.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

---

## Algorithm 1: Task ID Generation (oV)

**What it does:** Generates a unique 8-character task ID with a type-specific prefix.

**Why this approach:**
- Type prefix enables quick visual identification of task types
- 8 random characters provides sufficient uniqueness for concurrent operations
- Charset limited to alphanumeric for filesystem safety

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
    // Step 1: Get prefix for task type
    let prefix = getTaskTypePrefix(taskType);  // k$3

    // Step 2: Generate 8 random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));  // N$3

    // Step 3: Build ID: prefix + 8 random chars from charset
    let taskId = prefix;
    let CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";  // G97
    for (let i = 0; i < 8; i++) {
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }
    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId, k$3→getTaskTypePrefix, N$3→crypto.getRandomValues, G97→CHARSET
```

**Key insight:** The `%` operator ensures uniform distribution even with arbitrary random bytes. The charset is exactly 36 characters (0-9, a-z), so each byte maps cleanly.

---

## Algorithm 2: Abort Signal Propagation (x66)

**What it does:** Atomically aborts a running task, triggering its AbortController and cleaning up state.

**How it works:**
1. Check if task is running (only running tasks can be aborted)
2. Call `abortController.abort()` to cancel any pending LLM streams
3. Unregister cleanup handlers to prevent double-cleanup
4. Preserve the last message for debugging/resume purposes
5. Flush output buffer to preserve partial results

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

    // Atomic update - only modify running tasks
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Guard: Only abort running tasks
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
            // Keep last message for debugging/resume
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
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

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted, i9→atomicUpdateTask, $O→flushOutputBuffer
```

**Key insight:** The atomic update pattern ensures thread-safety. The `wasAborted` flag is used to conditionally flush the output buffer only when the abort actually happened.

---

## Algorithm 3: Task Progress with Telemetry (nl4)

**What it does:** Updates task progress and sends telemetry event, enabling real-time progress tracking and analytics.

**Why this approach:**
- Progress updates are throttled via atomic state checks
- Telemetry is only sent if enabled (performance optimization)
- Captures tool use count, token count, and duration

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

// ORIGINAL (for source lookup):
function nl4(A, q, K) {
    let Y = null;
    if (i9(A, K, (z) => {
            if (z.status !== "running") return z;
            return Y = {
                tokenCount: z.progress?.tokenCount ?? 0,
                toolUseCount: z.progress?.toolUseCount ?? 0,
                startTime: z.startTime,
                toolUseId: z.toolUseId
            }, {
                ...z,
                progress: {
                    ...z.progress,
                    toolUseCount: z.progress?.toolUseCount ?? 0,
                    tokenCount: z.progress?.tokenCount ?? 0,
                    summary: q
                }
            }
        }), Y && Nn()) {
        let {
            tokenCount: z,
            toolUseCount: _,
            startTime: w,
            toolUseId: O
        } = Y;
        c36({
            type: "system",
            subtype: "task_progress",
            task_id: A,
            tool_use_id: O,
            description: q,
            usage: {
                total_tokens: z,
                tool_uses: _,
                duration_ms: Date.now() - w
            },
            summary: q
        })
    }
}

// READABLE (for understanding):
function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let progressSnapshot = null;

    // Atomic update - only update running tasks
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture snapshot before update for telemetry
        progressSnapshot = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Send telemetry if update succeeded and telemetry is enabled
    if (progressSnapshot && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = progressSnapshot;
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summary,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState, Y→progressSnapshot, i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

**Key insight:** The snapshot is captured inside the atomic update to ensure consistency - the telemetry reflects the exact state at the time of the progress update.

---

## Algorithm 4: Tool Filtering for Subagent (Xk8)

**What it does:** Filters the available tools for a subagent based on execution context and permissions.

**Decision Logic:**
1. MCP tools (starting with `mcp__`) are always allowed
2. Plan mode has special tool access rules
3. Background agent excluded tools are blocked
4. Built-in excluded tools are blocked for non-built-in agents
5. Async agents need explicit allowlist membership

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on agent type
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
        // Rule 1: MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // Rule 2: Plan mode allows specific tools
        if (isPlanModeTool(tool) && permissionMode === "plan") return true;

        // Rule 3: Background agent excluded tools blocked
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Rule 4: Built-in excluded tools blocked for non-built-in
        if (!isBuiltIn && BUILTIN_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Rule 5: Async agents need explicit allowlist
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: Team mode with process support
            if (isTeamMode() && isInProcessEnabled()) {
                if (isAgentTool(tool)) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode, z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, xV8→BUILTIN_EXCLUDED_TOOLS, eP1→ASYNC_AGENT_ALLOWED_TOOLS, E7→isTeamMode, eP→isInProcessEnabled, r4→TOOL_NAME_AGENT, WY4→TEAM_DELEGATE_TOOLS
```

**Key insight:** The filtering is a multi-layer sieve - early returns for obvious cases (MCP tools), then progressively restrictive filters. This order matters for performance and correctness.

---

## Algorithm 5: Kill All Local Agents (U4q)

**What it does:** Batch-aborts all running local_agent tasks. Used for Ctrl+F shortcut.

**Why this approach:**
- `Object.entries()` creates a snapshot, preventing concurrent modification issues
- Only targets `local_agent` type (not `local_bash`, `in_process_teammate`, etc.)
- Only targets `running` status (not pending, completed, failed)

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
    // Object.entries creates a snapshot - safe from concurrent modification
    for (let [taskId, task] of Object.entries(tasks)) {
        // Filter conditions:
        // 1. Must be local_agent type (not local_bash, in_process_teammate, etc.)
        // 2. Must be in running state
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

**Key insight:** This function is intentionally simple - it delegates all complexity to `triggerAbortSignal`. The snapshot iteration pattern prevents issues if the abort triggers state changes.

---

## Algorithm 6: Background Task Creation (Qn4)

**What it does:** Creates a background agent task with all necessary state initialization.

**Initialization steps:**
1. Ensure output directory exists
2. Create AbortController (child of parent if provided)
3. Build task record with all required fields
4. Register cleanup handler for process exit
5. Register in global state

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
    // Step 1: Ensure output directory exists
    ensureOutputDirectory(agentId, getTaskDirectory(agentId));  // Co

    // Step 2: Create AbortController (child of parent or new)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)  // Wm
        : new AbortController();  // sK

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),  // RG
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
        isBackgrounded: true,  // Key difference from foreground
        pendingMessages: []
    };

    // Step 4: Register cleanup handler (called on process exit)
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);  // x66
    });  // E4

    taskRecord.unregisterCleanup = unregisterCleanup;

    // Step 5: Register in global state
    registerTask(taskRecord, setAppState);  // Zf

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt, Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId, O→abortController, $→taskRecord, H→unregisterCleanup, Co→ensureOutputDirectory, X$→getTaskDirectory, L0→getTaskDirectoryPath, Wm→createChildAbortController, sK→newAbortController, RG→createTaskRecord, E4→registerCleanupHandler, x66→triggerAbortSignal, Zf→registerTask
```

**Key insight:** `isBackgrounded: true` is the key differentiator from foreground tasks. This flag controls whether the task appears in the status line and how it's handled by the notification system.

---

## Algorithm 7: System Reminder Attachment Building (suY)

**What it does:** Builds task status attachments for injection into LLM context via system reminders.

**Flow:**
1. Poll output files for delta content
2. Update task state with new offsets
3. Evict completed/notified tasks
4. Build attachments array

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task status attachments
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
    // Step 1: Get current app state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll output files and collect updates
    let {
        attachments,           // New attachments to add
        updatedTaskOffsets,    // Task ID → new offset mapping
        evictedTaskIds         // Tasks to remove from state
    } = await pollTaskOutputs(appState);  // wY4

    // Step 3: Apply state updates (offsets and evictions)
    updateTaskState(
        toolUseContext.setAppState,
        updatedTaskOffsets,
        evictedTaskIds
    );  // OY4

    // Step 4: Transform raw attachments to task_status format
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState, K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds, wY4→pollTaskOutputs, OY4→updateTaskState
```

**Key insight:** This function bridges the background agent system with the system reminder system. The delta summary is key for keeping the LLM informed of progress without re-sending entire output files.

---

## Algorithm 8: Output File Delta Read (Z97)

**What it does:** Reads incremental output from a task's output file, supporting efficient progress tracking.

**Why this approach:**
- Tracks offset to only read new content
- Configurable max read size prevents memory issues
- Returns both content and new offset for state updates

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output from task file
// Location: chunks.41.mjs:2325-2346
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
        return _6(Y), {
            content: "",
            newOffset: q
        }
    }
}

// READABLE (for understanding):
const MAX_READ_SIZE = 8 * 1024 * 1024;  // 8MB - P97

async function readOutputFileDelta(taskId, offset, maxReadSize = MAX_READ_SIZE) {
    try {
        // Read from file at offset
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),  // g2
            offset,
            maxReadSize
        );  // dt6

        // No new content
        if (!result) {
            return {
                content: "",
                newOffset: offset
            };
        }

        // Return content and updated offset
        return {
            content: result.content,
            newOffset: offset + result.bytesRead
        };

    } catch (error) {
        // File doesn't exist yet - not an error
        if (error.code === "ENOENT") {
            return {
                content: "",
                newOffset: offset
            };
        }

        // Log other errors and return empty
        logError(error);  // _6
        return {
            content: "",
            newOffset: offset
        };
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→offset, K→maxReadSize, P97→MAX_READ_SIZE, dt6→readFileFromOffset, g2→getOutputFilePath, _6→logError
```

**Key insight:** The offset-based approach means we never re-read content. The 8MB limit prevents a single rogue task from consuming too much memory.

---

## Algorithm 9: Agent Loop Runner (qh) - Core Phase

**What it does:** The core async generator that drives all subagent execution.

**Phases:**
1. Identity binding & model resolution
2. Fork context building
3. Permission context setup
4. Tool filtering
5. System prompt assembly
6. LLM message loop execution
7. Cleanup

```javascript
// ============================================
// qh - agentLoopRunner - Core async generator for agent execution
// Location: chunks.133.mjs:1565-1786
// ============================================

// ORIGINAL (for source lookup) - Key excerpt:
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
    // ... setup continues ...
    let R = [...w ? Fx8(w) : [], ...q],
        u = w !== void 0 ? DI(K.readFileState) : yd(Ed);
    // ... more setup ...
    try {
        for await (let $6 of Yh({
            messages: R,
            systemPrompt: U,
            userContext: I,
            systemContext: g,
            canUseTool: Y,
            toolUseContext: z6,
            querySource: O,
            maxTurns: j ?? A.maxTurns
        })) {
            // Yield messages as they arrive
            if (TvY($6)) {
                await dg([$6], L, N6);
                N6 = $6.uuid;
                yield $6;
            }
        }
    } finally {
        // Cleanup: MCP clients, hooks, state
        if (await K6(), A.hooks) zZ6(N, L);
        z6.readFileState.clear();
        R.length = 0;
        a36(L);
        Qx8(L);
        t24(L, K.getAppState, N);
    }
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
    // Phase 1: Identity Binding & Model Resolution
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Model priority: override > agent definition > main loop
    let resolvedModel = resolveModel(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );

    // Generate unique agent ID
    let agentId = override?.agentId ?? generateAgentId();

    // Phase 2: Fork Context Building
    let messages = [
        ...(forkContextMessages ? cloneForkContext(forkContextMessages) : []),
        ...promptMessages
    ];

    // Clone or create read file state for compact
    let readFileState = forkContextMessages !== undefined
        ? cloneReadFileState(toolUseContext.readFileState)
        : createEmptyReadFileState();

    // Phase 3: Permission Context Setup
    let permissionContextBuilder = () => {
        let state = toolUseContext.getAppState();
        let ctx = { ...state.toolPermissionContext };

        // Apply agent's permission mode if specified
        if (agentDefinition.permissionMode) {
            ctx.mode = agentDefinition.permissionMode;
        }

        // Avoid prompts for background agents
        if (isAsync) {
            ctx.shouldAvoidPermissionPrompts = true;
        }

        return { ...state, toolPermissionContext: ctx };
    };

    // Phase 4: Tool Filtering
    let tools = useExactTools
        ? availableTools
        : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;

    // Phase 5: System Prompt Assembly
    let systemPrompt = override?.systemPrompt
        ?? await buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel);

    // Phase 6: LLM Message Loop Execution
    let abortController = override?.abortController
        ?? (isAsync ? new AbortController() : toolUseContext.abortController);

    let llmContext = createLLMContext({
        options: { ...toolUseContext.options, mainLoopModel: resolvedModel },
        agentId,
        agentType: agentDefinition.agentType,
        messages,
        readFileState,
        abortController,
        getAppState: permissionContextBuilder
    });

    try {
        // Stream messages from LLM
        for await (let event of llmMessageLoop({
            messages,
            systemPrompt,
            userContext,
            systemContext,
            canUseTool,
            toolUseContext: llmContext,
            querySource,
            maxTurns: maxTurns ?? agentDefinition.maxTurns
        })) {
            // Record and yield recordable messages
            if (isMessageRecordable(event)) {
                await recordTranscript([event], agentId);
                yield event;
            }
        }

        // Check for abort after loop
        if (abortController.signal.aborted) {
            throw new AgentAbortedError();
        }

    } finally {
        // Phase 7: Cleanup
        await cleanupMcpClients();
        if (agentDefinition.hooks) {
            unregisterAgentHooks(setAppState, agentId);
        }
        llmContext.readFileState.clear();
        messages.length = 0;
        cleanupAgentState(agentId);
        killBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext, Y→canUseTool, z→isAsync, _→canShowPermissionPrompts, w→forkContextMessages, Fx8→cloneForkContext, Yh→llmMessageLoop, TvY→isMessageRecordable
```

**Key insight:** Using `async function*` (async generator) enables streaming - each message is yielded as it arrives. This is critical for real-time UI updates and progress tracking.

---

## Algorithm 10: Mailbox Read (wl)

**What it does:** Reads messages from a teammate's mailbox file with JSON parsing.

```javascript
// ============================================
// wl - readMailbox - Read messages from mailbox
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
    let mailboxPath = getMailboxPath(agentName, teamName);  // FY6
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let content = await readFile(mailboxPath, "utf-8");  // xd4
        let messages = JSON.parse(content);  // i1
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;

    } catch (error) {
        // File doesn't exist - return empty array
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        // Other errors - log and return empty
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);  // _6
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath, Y→content/error, z→messages, FY6→getMailboxPath, xd4→readFile, i1→JSON.parse, k→log, _6→reportError
```

---

## Algorithm 11: Teammate Message Polling (DNY)

**What it does:** Polls for incoming messages for an in-process teammate, checking mailbox, pending user messages, and task assignments.

**Polling Priority:**
1. Pending user messages (direct messages)
2. Shutdown requests (prioritized over regular messages)
3. Regular mailbox messages
4. Task claims from shared task list

```javascript
// ============================================
// DNY - pollForNextMessage - Poll for teammate messages
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
                }
            }), k(`[inProcessRunner] ${A.agentName} found pending user message (poll #${O})`), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }
        if (O > 0) await jNY(500);
        if (O++, q.signal.aborted) return k(`[inProcessRunner] ${A.agentName} aborted while waiting (poll #${O})`), {
            type: "aborted"
        };
        // ... mailbox polling continues ...
    }
}

// READABLE (for understanding):
async function pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, parentSessionId) {
    log(`[inProcessRunner] ${identity.agentName} starting poll loop`);

    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // Priority 1: Check for pending user messages in task state
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];

            // Remove from pending list atomically
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

            log(`[inProcessRunner] ${identity.agentName} found pending user message (poll #${pollCount})`);
            return {
                type: "new_message",
                message: message,
                from: "user"
            };
        }

        // Throttle polling (500ms delay after first poll)
        if (pollCount > 0) await sleep(500);  // jNY

        pollCount++;

        // Check for abort
        if (abortController.signal.aborted) {
            log(`[inProcessRunner] ${identity.agentName} aborted while waiting (poll #${pollCount})`);
            return { type: "aborted" };
        }

        // Priority 2: Check mailbox for shutdown requests
        log(`[inProcessRunner] ${identity.agentName} poll #${pollCount}: checking mailbox`);
        try {
            let messages = await readMailbox(identity.agentName, identity.teamName);  // wl

            // Look for shutdown requests first
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let shutdownRequest = parseShutdownRequest(msg.text);  // M66
                    if (shutdownRequest) {
                        log(`[inProcessRunner] ${identity.agentName} received shutdown request`);
                        await markMessageAsRead(identity.agentName, identity.teamName, i);  // Vc6
                        return {
                            type: "shutdown_request",
                            request: shutdownRequest,
                            originalMessage: msg.text
                        };
                    }
                }
            }

            // Priority 3: Check for regular messages (team-lead first)
            let msgIndex = messages.findIndex((m) => !m.read && m.from === TEAM_LEAD_ID);  // BY
            if (msgIndex === -1) {
                msgIndex = messages.findIndex((m) => !m.read);
            }

            if (msgIndex !== -1) {
                let msg = messages[msgIndex];
                log(`[inProcessRunner] ${identity.agentName} received new message from ${msg.from}`);
                await markMessageAsRead(identity.agentName, identity.teamName, msgIndex);  // Vc6
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

        // Priority 4: Check for unclaimed tasks
        let taskPrompt = await claimUnclaimedTask(parentSessionId, identity.agentName);  // Ji4
        if (taskPrompt) {
            return {
                type: "new_message",
                message: taskPrompt,
                from: "task-list"
            };
        }
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→identity, q→abortController, K→taskId, Y→getAppState, z→setAppState, _→parentSessionId, O→pollCount, H→task, J→message, jNY→sleep, wl→readMailbox, Vc6→markMessageAsRead, Ji4→claimUnclaimedTask, BY→TEAM_LEAD_ID
```

**Key insight:** The polling loop uses a 500ms throttle to reduce CPU usage while maintaining responsiveness. Shutdown requests are prioritized over regular messages to enable graceful termination.

---

## Algorithm 12: Auto-Background Threshold (oVY)

**What it does:** Determines the timeout threshold for automatically backgrounding a synchronous subagent.

**Why this approach:**
- 120 seconds (2 minutes) is the default threshold
- Can be disabled by environment variable or feature flag
- Returns 0 when disabled, causing immediate synchronous execution

```javascript
// ============================================
// oVY - getAutoBackgroundMs - Get auto-background timeout
// Location: chunks.136.mjs:1234-1237
// ============================================

// ORIGINAL (for source lookup):
function oVY() {
    if (t6(process.env.CLAUDE_AUTO_BACKGROUND_TASKS) || w8("tengu_auto_background_agents", !1)) return 120000;
    return 0
}

// READABLE (for understanding):
function getAutoBackgroundMs() {
    // Check environment variable for explicit enable
    if (parseBoolean(process.env.CLAUDE_AUTO_BACKGROUND_TASKS)) {  // t6
        return 120000;  // 2 minutes
    }

    // Check feature flag (GrowthBook)
    if (getFeatureFlag("tengu_auto_background_agents", false)) {  // w8
        return 120000;  // 2 minutes
    }

    // Disabled - return 0 (no auto-background)
    return 0;
}

// Mapping: oVY→getAutoBackgroundMs, t6→parseBoolean, w8→getFeatureFlag
```

**Key insight:** The auto-background feature allows synchronous subagents to be automatically converted to background agents after 2 minutes of running. This prevents the main conversation from being blocked by long-running tasks while still providing the option for quick synchronous execution.

---

## Algorithm 13: In-Process Agent Runner (XNY)

**What it does:** Runs an in-process teammate agent with mailbox polling loop and context management.

**Phases:**
1. Build agent definition and system prompt
2. Setup context with AsyncLocalStorage
3. Run agent loop with message polling
4. Handle shutdown and cleanup

```javascript
// ============================================
// XNY - inProcessAgentRunner - Run in-process teammate
// Location: chunks.134.mjs:1571-1848
// ============================================

// ORIGINAL (for source lookup) - Key excerpt:
async function XNY(A) {
    let {
        identity: q,
        taskId: K,
        prompt: Y,
        description: z,
        agentDefinition: _,
        teammateContext: w,
        toolUseContext: O,
        abortController: $,
        model: H,
        systemPrompt: j,
        systemPromptMode: J,
        allowedTools: M,
        allowPermissionPrompts: D
    } = A, {
        setAppState: X
    } = O;
    k(`[inProcessRunner] Starting agent loop for ${q.agentId}`);
    let P = {
            agentId: q.agentId,
            parentSessionId: q.parentSessionId,
            agentName: q.agentName,
            teamName: q.teamName,
            agentColor: q.color,
            planModeRequired: q.planModeRequired,
            isTeamLead: !1,
            agentType: "teammate"
        },
        W;
    if (J === "replace" && j) W = j;
    else {
        // Build system prompt with agent definition
        let L = [...await R0(O.options.tools, O.options.mainLoopModel, void 0, O.options.mcpClients), tx8];
        if (_) {
            let h = _.getSystemPrompt();
            if (h) L.push(`
# Custom Agent Instructions
${h}`);
        }
        if (J === "append" && j) L.push(j);
        W = L.join(`
`)
    }
    let Z = {
            agentType: q.agentName,
            whenToUse: `In-process teammate: ${q.agentName}`,
            getSystemPrompt: () => W,
            tools: _?.tools ? [...new Set([..._.tools, hI, SI, l36, TR, lt, it, ck])] : ["*"],
            source: "projectSettings",
            permissionMode: "default",
            ..._?.model ? { model: _.model } : {}
        },
    // ... agent loop execution ...
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,
        taskId,
        prompt,
        description,
        agentDefinition,
        teammateContext,
        toolUseContext,
        abortController,
        model,
        systemPrompt,
        systemPromptMode,
        allowedTools,
        allowPermissionPrompts
    } = config;

    let { setAppState } = toolUseContext;
    log(`[inProcessRunner] Starting agent loop for ${identity.agentId}`);

    // Phase 1: Build teammate identity
    let teammateIdentity = {
        agentId: identity.agentId,
        parentSessionId: identity.parentSessionId,
        agentName: identity.agentName,
        teamName: identity.teamName,
        agentColor: identity.color,
        planModeRequired: identity.planModeRequired,
        isTeamLead: false,
        agentType: "teammate"
    };

    // Phase 2: Build system prompt
    let resolvedSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        resolvedSystemPrompt = systemPrompt;
    } else {
        // Build from base tools + agent definition
        let promptParts = [
            ...await buildBaseSystemPrompt(
                toolUseContext.options.tools,
                toolUseContext.options.mainLoopModel,
                toolUseContext.options.mcpClients
            )
        ];

        if (agentDefinition?.getSystemPrompt) {
            promptParts.push(`
# Custom Agent Instructions
${agentDefinition.getSystemPrompt()}`);
        }

        if (systemPromptMode === "append" && systemPrompt) {
            promptParts.push(systemPrompt);
        }

        resolvedSystemPrompt = promptParts.join("\n");
    }

    // Phase 3: Create agent definition
    let resolvedAgentDefinition = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => resolvedSystemPrompt,
        // Teammate-specific tools: SendMessage, SendMessageInternal, SendIdleNotification, TaskCreate/Get/List/Update
        tools: agentDefinition?.tools
            ? [...new Set([
                ...agentDefinition.tools,
                TOOL_NAME_SEND_MESSAGE,          // hI
                TOOL_NAME_SEND_MESSAGE_INTERNAL, // SI
                TOOL_NAME_SEND_IDLE_NOTIFICATION,// l36
                TOOL_NAME_TASK_CREATE,           // TR
                TOOL_NAME_TASK_GET,              // lt
                TOOL_NAME_TASK_LIST,             // it
                TOOL_NAME_TASK_UPDATE            // ck
            ])]
            : ["*"],  // All tools if not specified
        source: "projectSettings",
        permissionMode: "default",
        ...(agentDefinition?.model ? { model: agentDefinition.model } : {})
    };

    // Phase 4: Run with AsyncLocalStorage context
    await runWithTeammateContext(teammateContext, async () => {
        let messagePoll = async () => {
            return await pollForNextMessage(
                identity,
                abortController,
                taskId,
                toolUseContext.getAppState,
                setAppState,
                identity.parentSessionId
            );  // DNY
        };

        // Run agent loop
        try {
            for await (let event of agentLoopRunner({
                agentDefinition: resolvedAgentDefinition,
                promptMessages: [{ type: "user", content: prompt }],
                toolUseContext: enhancedContext,
                isAsync: true,  // Teammates always run as async
                worktreePath: identity.worktreePath,
                // ... other options
            })) {  // qh
                // Handle messages and events
                if (event.type === "message") {
                    // Send to mailbox or handle locally
                }
            }
        } finally {
            // Cleanup
            await sendIdleNotification(identity, { idleReason: "completed" });  // Ec6
        }
    });
}

// Mapping: XNY→inProcessAgentRunner, A→config, q→identity, K→taskId, Y→prompt, z→description, _→agentDefinition, w→teammateContext, O→toolUseContext, $→abortController, H→model, j→systemPrompt, J→systemPromptMode, M→allowedTools, D→allowPermissionPrompts, P→teammateIdentity, W→resolvedSystemPrompt, Z→resolvedAgentDefinition, hI→TOOL_NAME_SEND_MESSAGE, SI→TOOL_NAME_SEND_MESSAGE_INTERNAL, l36→TOOL_NAME_SEND_IDLE_NOTIFICATION, TR→TOOL_NAME_TASK_CREATE, lt→TOOL_NAME_TASK_GET, it→TOOL_NAME_TASK_LIST, ck→TOOL_NAME_TASK_UPDATE
```

**Key insight:** In-process teammates run within the same Node.js process as the lead agent, using AsyncLocalStorage for identity propagation. They have access to team-specific tools (SendMessage, IdleNotification) and run in an async polling loop.

---

## Summary Table

| Algorithm | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Task ID Generation | `oV` | chunks.41.mjs:2410 | Generate unique task IDs |
| Abort Signal Propagation | `x66` | chunks.146.mjs:2012 | Kill a running task |
| Task Progress with Telemetry | `nl4` | chunks.146.mjs:2059 | Update progress + analytics |
| Tool Filtering | `Xk8` | chunks.93.mjs:1568 | Filter subagent tools |
| Kill All Local Agents | `U4q` | chunks.146.mjs:2029 | Batch kill (Ctrl+F) |
| Background Task Creation | `Qn4` | chunks.146.mjs:2133 | Create background task |
| System Reminder Attachment | `suY` | chunks.147.mjs:1033 | Build LLM context |
| Output Delta Read | `Z97` | chunks.41.mjs:2325 | Read incremental output |
| Agent Loop Runner | `qh` | chunks.133.mjs:1565 | Core execution generator |
| Mailbox Read | `wl` | chunks.132.mjs:3 | Teammate communication |
| Teammate Polling | `DNY` | chunks.134.mjs:1483 | Poll for teammate messages |
| Auto-Background Threshold | `oVY` | chunks.136.mjs:1234 | Get auto-background timeout |
| In-Process Agent Runner | `XNY` | chunks.134.mjs:1571 | Run in-process teammate |

---

**Last Updated**: 2026-03-27 (re-verified)
**Version**: Claude Code 2.1.76
**Status**: Complete - 13 algorithms with full source restoration