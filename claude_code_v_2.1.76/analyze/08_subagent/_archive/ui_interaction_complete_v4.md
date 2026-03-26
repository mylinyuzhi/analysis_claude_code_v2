# Subagent UI Interaction Complete V4 (Claude Code 2.1.76)

> Complete source-level restoration of subagent UI interaction including component hierarchy, keyboard shortcuts, status line integration, and task list modal implementation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `qh` - Agent loop runner — `chunks.133.mjs:1565`
- `TvY` - Is message recordable — `chunks.133.mjs:1561`
- `Bc6` - Derive tool use context — `chunks.148.mjs:1978`
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `x66` - Trigger abort signal — `chunks.146.mjs:2012`
- `d4q` - Mark task killed — `chunks.146.mjs:2034`
- `nl4` - Update task progress with telemetry — `chunks.146.mjs:2059`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUBAGENT UI ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Root (App)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MessageArea                                    │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ AssistantMessage                                                 ││    │
│  │  │  └─ ToolUseContent (type: "tool_use", name: "Agent")            ││    │
│  │  │      └─ AgentStatusComponent (Vc4)                              ││    │
│  │  │          ├─ TreePrefix ("├─" / "└─")                           ││    │
│  │  │          ├─ AgentTypeBadge (color from agentDefinition)         ││    │
│  │  │          ├─ Description (from AgentTool call)                   ││    │
│  │  │          ├─ Stats (toolUseCount, tokens)                        ││    │
│  │  │          └─ StatusIndicator (running/completed/failed)          ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        StatusLine (Footer)                           │    │
│  │                                                                       │    │
│  │  BackgroundAgentIndicator:                                           │    │
│  │  • Running agent count: "2 running"                                  │    │
│  │  • Kill hint: "Ctrl+C to cancel"                                     │    │
│  │  • Interactive: triggers kill confirmation                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TaskListModal (on /tasks)                     │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ Header: "Background Tasks"                                       ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  TaskListRow[]:                                                       │    │
│  │  ├─ StatusIcon (◐ ✓ ✗ ○)                                             │    │
│  │  ├─ Description                                                      │    │
│  │  ├─ Progress summary (if running)                                    │    │
│  │  └─ Actions: [x: stop] [f: foreground]                              │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        NotificationArea                              │    │
│  │                                                                       │    │
│  │  Task completion/failure/kill notifications                         │    │
│  │  Mode: "task-notification"                                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: agentLoopRunner (qh)

**What it does:** The main async generator that orchestrates the entire subagent execution lifecycle, from initialization through cleanup.

**How it works:**

```javascript
// ============================================
// qh - agentLoopRunner - Core async generator for agent execution
// Location: chunks.133.mjs:1565-1786
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
    if (Z) px8(L, Z);
    if (qc()) {
        let $6 = K.agentId ?? R1();
        R01(L, A.agentType, $6)
    }
    let R = [...w ? Fx8(w) : [], ...q],
        u = w !== void 0 ? DI(K.readFileState) : yd(Ed),
        [I, g] = await Promise.all([$?.userContext ?? a2(), $?.systemContext ?? mw()]),
        B = A.permissionMode,
        b = () => {
            let $6 = K.getAppState(),
                n = $6.toolPermissionContext;
            if (B && $6.toolPermissionContext.mode !== "bypassPermissions" &&
                $6.toolPermissionContext.mode !== "acceptEdits" &&
                $6.toolPermissionContext.mode !== "auto") n = {
                ...n,
                mode: B
            };
            let o = _ !== void 0 ? !_ : B === "bubble" ? !1 : z;
            if (o) n = {
                ...n,
                shouldAvoidPermissionPrompts: !0
            };
            if (z && !o) n = {
                ...n,
                awaitAutomatedChecksBeforeDialog: !0
            };
            if (D !== void 0) n = {
                ...n,
                alwaysAllowRules: {
                    cliArg: $6.toolPermissionContext.alwaysAllowRules.cliArg,
                    session: [...D]
                }
            };
            let a = A.effort !== void 0 ? A.effort : $6.effortValue;
            if (n === $6.toolPermissionContext && a === $6.effortValue) return $6;
            return {
                ...$6,
                toolPermissionContext: n,
                effortValue: a
            }
        },
        p = P ? M : _c(A, M, z).resolvedTools,
        Q = Array.from(f.toolPermissionContext.additionalWorkingDirectories.keys()),
        U = $?.systemPrompt ? $.systemPrompt : uq(await vvY(A, K, V, Q)),
        r = $?.abortController ? $.abortController : z ? new AbortController : K.abortController,
        e = [];
    for await (let $6 of Ux8(L, A.agentType, r.signal))
        if ($6.additionalContexts && $6.additionalContexts.length > 0) e.push(...$6.additionalContexts);
    if (e.length > 0) {
        let $6 = f4({
            type: "hook_additional_context",
            content: e,
            hookName: "SubagentStart",
            toolUseID: GvY(),
            hookEvent: "SubagentStart"
        });
        R.push($6)
    }
    if (A.hooks) r24(N, L, A.hooks, `agent '${A.agentType}'`, !0);
    // ... skill loading and main loop
}

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,           // Agent type definition with tools, skills, hooks
    promptMessages,            // Initial messages to process
    toolUseContext,            // Context for tool execution
    canUseTool,                // Function to check if tool can be used
    isAsync,                   // Whether running asynchronously (background agent)
    canShowPermissionPrompts,  // Whether to show permission prompts
    forkContextMessages,       // Messages from parent context
    querySource,               // Source of query (for telemetry)
    override,                  // Override options
    model,                     // Model override
    maxTurns,                  // Maximum turns before stopping
    preserveToolUseResults,    // Keep tool results in context
    availableTools,            // Tools available to this agent
    allowedTools,              // Tools allowed (whitelist)
    onCacheSafeParams,         // Callback for cache-safe parameters
    useExactTools,             // Use exact tools without filtering
    worktreePath,              // Path to worktree for isolation
    transcriptSubdir,          // Subdirectory for transcripts
    onQueryProgress            // Progress callback
}) {
    // PHASE 1: INITIALIZATION
    // Step 1: Get initial state and resolve model
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Step 2: Resolve model selection
    // Priority: agentDefinition.model > model param > mainLoopModel > default
    let resolvedModel = resolveModelSelection(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );

    // Step 3: Generate or use existing agent ID
    let agentId = override?.agentId ? override.agentId : generateAgentId();

    // Step 4: Set up transcript directory if specified
    if (transcriptSubdir) {
        setTranscriptSubdir(agentId, transcriptSubdir);
    }

    // Step 5: Record agent lineage for telemetry
    if (isTelemetryEnabled()) {
        let parentAgentId = toolUseContext.agentId ?? getCurrentAgentId();
        recordAgentLineage(agentId, agentDefinition.agentType, parentAgentId);
    }

    // PHASE 2: MESSAGE PREPARATION
    // Step 6: Merge fork context with prompt messages
    let messages = [
        ...forkContextMessages ? cloneForkContext(forkContextMessages) : [],
        ...promptMessages
    ];

    // Step 7: Clone or create file read state
    let readFileState = forkContextMessages !== undefined
        ? cloneReadFileState(toolUseContext.readFileState)
        : createEmptyReadFileState();

    // Step 8: Load user and system context in parallel
    let [userContext, systemContext] = await Promise.all([
        override?.userContext ?? getUserContext(),
        override?.systemContext ?? getSystemContext()
    ]);

    // Step 9: Build derived app state getter for permission context
    let getDerivedAppState = () => {
        let state = toolUseContext.getAppState();
        let permContext = state.toolPermissionContext;

        // Apply agent's permission mode if specified
        if (agentDefinition.permissionMode &&
            !["bypassPermissions", "acceptEdits", "auto"].includes(state.toolPermissionContext.mode)) {
            permContext = { ...permContext, mode: agentDefinition.permissionMode };
        }

        // Determine if we should avoid permission prompts
        let avoidPrompts = canShowPermissionPrompts !== undefined
            ? !canShowPermissionPrompts
            : agentDefinition.permissionMode === "bubble" ? false : isAsync;

        if (avoidPrompts) {
            permContext = { ...permContext, shouldAvoidPermissionPrompts: true };
        }

        // For async agents that can show prompts, await automated checks first
        if (isAsync && !avoidPrompts) {
            permContext = { ...permContext, awaitAutomatedChecksBeforeDialog: true };
        }

        // Apply tool whitelist if specified
        if (allowedTools !== undefined) {
            permContext = {
                ...permContext,
                alwaysAllowRules: {
                    cliArg: state.toolPermissionContext.alwaysAllowRules.cliArg,
                    session: [...allowedTools]
                }
            };
        }

        return { ...state, toolPermissionContext: permContext };
    };

    // Step 10: Filter tools for subagent
    let resolvedTools = useExactTools
        ? availableTools
        : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;

    // Step 11: Build system prompt
    let systemPrompt = override?.systemPrompt
        ? override.systemPrompt
        : normalizeSystemPrompt(
            await buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, additionalWorkingDirs)
        );

    // Step 12: Set up abort controller
    let abortController = override?.abortController
        ? override.abortController
        : isAsync
            ? new AbortController()
            : toolUseContext.abortController;

    // PHASE 3: HOOK AND SKILL LOADING
    // Step 13: Handle SubagentStart hook additional contexts
    let hookAdditionalContexts = [];
    for await (let event of dispatchSubagentStartHook(agentId, agentDefinition.agentType, abortController.signal)) {
        if (event.additionalContexts?.length > 0) {
            hookAdditionalContexts.push(...event.additionalContexts);
        }
    }

    // Step 14: Add hook contexts as attachment
    if (hookAdditionalContexts.length > 0) {
        messages.push(createAttachment({
            type: "hook_additional_context",
            content: hookAdditionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        }));
    }

    // Step 15: Register hooks if specified
    if (agentDefinition.hooks) {
        registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
    }

    // Step 16: Load skills specified in agent definition
    let skills = agentDefinition.skills ?? [];
    // ... skill loading logic ...

    // PHASE 4: TOOL USE CONTEXT DERIVATION
    // Step 17: Load MCP clients and tools for this agent
    let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } =
        await loadAgentMcpClients(agentDefinition, toolUseContext.options.mcpClients);

    // Step 18: Merge MCP tools with resolved tools
    let allTools = mcpTools.length > 0
        ? dedupeByName([...resolvedTools, ...mcpTools])
        : resolvedTools;

    // Step 19: Build options for subagent context
    let subagentOptions = {
        isNonInteractiveSession: useExactTools
            ? toolUseContext.options.isNonInteractiveSession
            : isAsync ? true : toolUseContext.options.isNonInteractiveSession ?? false,
        tools: allTools,
        mainLoopModel: resolvedModel,
        thinkingConfig: useExactTools ? toolUseContext.options.thinkingConfig : { type: "disabled" },
        mcpClients: mcpClients,
        // ...
    };

    // Step 20: Derive tool use context for subagent
    let subagentContext = deriveToolUseContext(toolUseContext, {
        options: subagentOptions,
        agentId: agentId,
        agentType: agentDefinition.agentType,
        messages: messages,
        readFileState: readFileState,
        abortController: abortController,
        getAppState: getDerivedAppState,
        shareSetAppState: !isAsync,
        shareSetResponseLength: true
    });

    // PHASE 5: MAIN LOOP EXECUTION
    try {
        // Step 21: Run the LLM message loop
        for await (let event of llmMessageLoop({
            messages: messages,
            systemPrompt: systemPrompt,
            userContext: userContext,
            systemContext: systemContext,
            canUseTool: canUseTool,
            toolUseContext: subagentContext,
            querySource: querySource,
            maxTurns: maxTurns ?? agentDefinition.maxTurns
        })) {
            // Handle TTFT metrics
            if (event.type === "stream_event" &&
                event.event.type === "message_start" &&
                event.ttftMs != null) {
                toolUseContext.pushApiMetricsEntry?.(event.ttftMs);
                continue;
            }

            // Handle attachments
            if (event.type === "attachment") {
                if (event.attachment.type === "max_turns_reached") {
                    break;
                }
                yield event;
                continue;
            }

            // Handle recordable messages
            if (isMessageRecordable(event)) {
                yield event;
            }
        }

        // Step 22: Check if aborted
        if (abortController.signal.aborted) {
            throw new AbortError();
        }

    } finally {
        // PHASE 6: CLEANUP
        // Step 23: Cleanup MCP clients
        await mcpCleanup();

        // Step 24: Deregister hooks
        if (agentDefinition.hooks) {
            deregisterAgentHooks(setAppState, agentId);
        }

        // Step 25: Clear state
        subagentContext.readFileState.clear();
        messages.length = 0;

        // Step 26: Kill any remaining bash tasks for this agent
        killBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext,
//          Y→canUseTool, z→isAsync, _→canShowPermissionPrompts, w→forkContextMessages,
//          O→querySource, $→override, H→model, j→maxTurns, J→preserveToolUseResults,
//          M→availableTools, D→allowedTools, X→onCacheSafeParams, P→useExactTools,
//          W→worktreePath, Z→transcriptSubdir, G→onQueryProgress
```

**Why this approach:**
- **Async Generator Pattern**: Enables real-time streaming, memory efficiency, and cancellation
- **Fork Context Filtering**: Prevents orphaned tool_use blocks from confusing the LLM
- **Derived Context Pattern**: Subagent gets isolated but connected state
- **Two-phase Permission Handling**: Background agents avoid prompts, foreground agents can ask

**Key insight:** The `deriveToolUseContext` (Bc6) function creates an isolated context for the subagent while maintaining appropriate connections to the parent session through `shareSetAppState` and `shareSetResponseLength` flags.

---

## Core Function: deriveToolUseContext (Bc6)

**What it does:** Creates an isolated but connected tool use context for subagent execution.

**How it works:**

```javascript
// ============================================
// Bc6 - deriveToolUseContext - Create derived context for subagent
// Location: chunks.148.mjs:1978-2024
// ============================================

// ORIGINAL (for source lookup):
function Bc6(A, q) {
    let K = q?.abortController ?? (q?.shareAbortController ? A.abortController : Wm(A.abortController)),
        Y = q?.getAppState ? q.getAppState : q?.shareAbortController ? A.getAppState : () => {
            let z = A.getAppState();
            if (z.toolPermissionContext.shouldAvoidPermissionPrompts) return z;
            return {
                ...z,
                toolPermissionContext: {
                    ...z.toolPermissionContext,
                    shouldAvoidPermissionPrompts: !0
                }
            }
        };
    return {
        readFileState: DI(q?.readFileState ?? A.readFileState),
        nestedMemoryAttachmentTriggers: new Set,
        dynamicSkillDirTriggers: new Set,
        toolDecisions: void 0,
        abortController: K,
        getAppState: Y,
        setAppState: q?.shareSetAppState ? A.setAppState : () => {},
        setAppStateForTasks: A.setAppStateForTasks ?? A.setAppState,
        localDenialTracking: q?.shareSetAppState ? A.localDenialTracking : Ay1(),
        setInProgressToolUseIDs: () => {},
        setResponseLength: q?.shareSetResponseLength ? A.setResponseLength : () => {},
        pushApiMetricsEntry: q?.shareSetResponseLength ? A.pushApiMetricsEntry : void 0,
        updateFileHistoryState: () => {},
        updateAttributionState: A.updateAttributionState,
        addNotification: void 0,
        setToolJSX: void 0,
        setStreamMode: void 0,
        setSDKStatus: void 0,
        openMessageSelector: void 0,
        options: q?.options ?? A.options,
        messages: q?.messages ?? A.messages,
        agentId: q?.agentId ?? bI(),
        agentType: q?.agentType,
        queryTracking: {
            chainId: emY(),
            depth: (A.queryTracking?.depth ?? -1) + 1
        },
        fileReadingLimits: A.fileReadingLimits,
        userModified: A.userModified,
        criticalSystemReminder_EXPERIMENTAL: q?.criticalSystemReminder_EXPERIMENTAL,
        requireCanUseTool: q?.requireCanUseTool
    }
}

// READABLE (for understanding):
function deriveToolUseContext(parentContext, overrides) {
    // Step 1: Determine abort controller
    // - If overrides provides one, use it
    // - If sharing, use parent's controller
    // - Otherwise, create a child controller
    let abortController = overrides?.abortController
        ?? (overrides?.shareAbortController
            ? parentContext.abortController
            : createChildAbortController(parentContext.abortController));

    // Step 2: Determine getAppState function
    // - If overrides provides one, use it
    // - If sharing, use parent's getter
    // - Otherwise, wrap to avoid permission prompts
    let getAppState = overrides?.getAppState
        ? overrides.getAppState
        : overrides?.shareAbortController
            ? parentContext.getAppState
            : () => {
                let state = parentContext.getAppState();
                if (state.toolPermissionContext.shouldAvoidPermissionPrompts) {
                    return state;
                }
                return {
                    ...state,
                    toolPermissionContext: {
                        ...state.toolPermissionContext,
                        shouldAvoidPermissionPrompts: true
                    }
                };
            };

    // Step 3: Build derived context
    return {
        // Cloned state (isolated)
        readFileState: cloneReadFileState(overrides?.readFileState ?? parentContext.readFileState),
        nestedMemoryAttachmentTriggers: new Set(),
        dynamicSkillDirTriggers: new Set(),
        toolDecisions: undefined,

        // Abort handling
        abortController: abortController,

        // State access
        getAppState: getAppState,
        setAppState: overrides?.shareSetAppState
            ? parentContext.setAppState
            : () => {},  // No-op if not shared
        setAppStateForTasks: parentContext.setAppStateForTasks ?? parentContext.setAppState,

        // Denial tracking
        localDenialTracking: overrides?.shareSetAppState
            ? parentContext.localDenialTracking
            : createDenialTracking(),

        // Response metrics (shared if specified)
        setResponseLength: overrides?.shareSetResponseLength
            ? parentContext.setResponseLength
            : () => {},
        pushApiMetricsEntry: overrides?.shareSetResponseLength
            ? parentContext.pushApiMetricsEntry
            : undefined,

        // Options and messages
        options: overrides?.options ?? parentContext.options,
        messages: overrides?.messages ?? parentContext.messages,

        // Agent identity
        agentId: overrides?.agentId ?? generateAgentId(),
        agentType: overrides?.agentType,

        // Query tracking (chain and depth)
        queryTracking: {
            chainId: generateChainId(),
            depth: (parentContext.queryTracking?.depth ?? -1) + 1
        },

        // File and user state
        fileReadingLimits: parentContext.fileReadingLimits,
        userModified: parentContext.userModified,

        // Experimental features
        criticalSystemReminder_EXPERIMENTAL: overrides?.criticalSystemReminder_EXPERIMENTAL,
        requireCanUseTool: overrides?.requireCanUseTool
    };
}

// Mapping: Bc6→deriveToolUseContext, A→parentContext, q→overrides, K→abortController,
//          Y→getAppState, DI→cloneReadFileState, Wm→createChildAbortController,
//          Ay1→createDenialTracking, bI→generateAgentId, emY→generateChainId
```

**Why this approach:**
- **Selective sharing**: `shareSetAppState` and `shareSetResponseLength` flags control isolation
- **Permission isolation**: By default, subagents avoid permission prompts
- **Depth tracking**: `queryTracking.depth` enables visualization of agent nesting
- **Cloned state**: `readFileState` is cloned to prevent parent contamination

**Key insight:** The context derivation pattern allows subagents to run independently while optionally maintaining connections to parent state. This enables both synchronous blocking behavior and asynchronous background execution.

---

## Core Function: isMessageRecordable (TvY)

**What it does:** Determines which message types should be persisted to the sidechain transcript.

```javascript
// ============================================
// TvY - isMessageRecordable - Check if message should be recorded
// Location: chunks.133.mjs:1561-1563
// ============================================

// ORIGINAL (for source lookup):
function TvY(A) {
    return A.type === "assistant" || A.type === "user" || A.type === "progress" ||
           A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function isMessageRecordable(message) {
    // Recordable message types:
    // - assistant: LLM responses (contain tool calls and text)
    // - user: User messages (contain tool results)
    // - progress: Progress updates from tools
    // - system with compact_boundary subtype: Compaction markers for transcript continuity
    return message.type === "assistant" ||
           message.type === "user" ||
           message.type === "progress" ||
           (message.type === "system" && "subtype" in message && message.subtype === "compact_boundary");
}

// Mapping: TvY→isMessageRecordable, A→message
```

**Why this filtering:**
- **Transcript continuity**: Only essential messages are persisted
- **Compact boundaries**: Markers for where compaction occurred
- **No system reminders**: Don't clutter transcript with context injections

---

## Kill Mechanism

### triggerAbortSignal (x66)

**What it does:** Triggers abort for a single task and marks it as killed.

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
//          i9→atomicUpdateTask, Y→task, $O→flushOutputBuffer
```

### killAllLocalAgents (U4q)

**What it does:** Kills all running local_agent tasks.

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
    for (let [taskId, task] of Object.entries(tasks)) {
        // Only kill local_agent tasks that are running
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

**Why type filtering:**
- **local_agent only**: Doesn't kill bash tasks or teammates
- **running only**: Doesn't touch completed/failed tasks
- **Safe iteration**: Object.entries creates snapshot before mutation

### markTaskKilled (d4q)

**What it does:** Marks a task as notified after kill, preparing it for eviction.

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed with notification
// Location: chunks.146.mjs:2034-2043
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Already notified - skip
        if (task.notified) return task;

        return {
            ...task,
            notified: true,  // Mark as notified for eviction
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task, i9→atomicUpdateTask
```

---

## Progress Tracking with Telemetry

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates task progress and sends telemetry event.

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
    let progressData = null;

    // Step 1: Update task progress
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture data for telemetry
        progressData = {
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

    // Step 2: Send telemetry if enabled and task was running
    if (progressData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = progressData;

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

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
//          Y→progressData, z→task, i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

**Why telemetry integration:**
- **Usage tracking**: Monitor agent resource consumption
- **Duration tracking**: Understand task completion times
- **Tool use patterns**: Analyze which tools agents use most

---

## UI Display States

### State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT DISPLAY STATE MACHINE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────┐
                          │  Created    │
                          │  (pending)  │
                          └──────┬──────┘
                                 │ spawn
                                 ▼
                          ┌─────────────┐
                 ┌────────│  Running    │────────┐
                 │        │  (active)   │        │
                 │        └──────┬──────┘        │
                 │               │               │
        mid-run  │               │ complete      │ background
        bg       │               │               │ (run_in_bg)
                 │               ▼               │
                 │        ┌─────────────┐        │
                 │        │ Completed   │        │
                 │        │ (done)      │        │
                 │        └─────────────┘        │
                 │                               │
                 ▼                               ▼
          ┌─────────────┐                 ┌─────────────┐
          │ Backgrounded│                 │ Background  │
          │ (running)   │                 │ Launched    │
          └──────┬──────┘                 └──────┬──────┘
                 │                               │
                 │ complete                      │ complete
                 ▼                               ▼
          ┌─────────────┐                 ┌─────────────┐
          │ Background  │                 │ Background  │
          │ Completed   │                 │ Completed   │
          └─────────────┘                 └─────────────┘
```

### Display State Logic

| isResolved | isAsync | Status | Display Text |
|------------|---------|--------|--------------|
| `false` | `false` | Running | `lastToolInfo \|\| "Initializing…"` |
| `false` | `true` | Background Running | `lastToolInfo \|\| "Running..."` |
| `true` | `false` | Completed | `"Done"` |
| `true` | `true` | Background Completed | `taskDescription \|\| "Running in background"` |

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+C` (once) | Show kill confirmation | Agents running |
| `Ctrl+F` (confirm) | Execute kill all | After Ctrl+C |
| `/tasks` | Open task list modal | Always |

### Task List Modal

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move up | In list |
| `↓` / `j` | Move down | In list |
| `x` | Kill selected | Running task |
| `f` | Foreground | Teammate task |
| `Enter` | View details | Any task |
| `Esc` | Close modal | Modal open |

### Action Availability by Task Type

| Task Type | Kill (`x`) | Foreground (`f`) |
|-----------|------------|------------------|
| `local_agent` | ✓ running | ✗ |
| `local_bash` | ✓ running | ✗ |
| `in_process_teammate` | ✓ running | ✓ running |
| `remote_agent` | ✓ running | ✗ |
| `local_workflow` | ✓ running | ✗ |

---

## Kill Flow Diagram

```
User presses Ctrl+C with running agents
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Check: Any local_agent running?                                            │
└─────────────────────────────┬─────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼ No                        ▼ Yes
    ┌───────────────────┐         ┌─────────────────────────────────────────┐
    │ Cancel stream     │         │ Show confirmation:                      │
    │ (normal Ctrl+C)   │         │ "Press Ctrl+F to stop agents"           │
    └───────────────────┘         └───────────────────┬─────────────────────┘
                                                        │
                                          ┌─────────────┴─────────────┐
                                          │                           │
                                          ▼ Timeout                   ▼ Ctrl+F
                                  ┌───────────────────┐         ┌─────────────────────────┐
                                  │ Revert to         │         │ Execute killAll:        │
                                  │ normal behavior   │         │ 1. U4q(tasks, setState) │
                                  └───────────────────┘         │ 2. For each killed:     │
                                                                │    d4q(taskId, setState)│
                                                                │ 3. Show notification    │
                                                                └─────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | ✓ Verified |
| `TvY` | isMessageRecordable | chunks.133.mjs:1561 | ✓ Verified |
| `Bc6` | deriveToolUseContext | chunks.148.mjs:1978 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |

---

## Related Documents

- [key_algorithms_deep_dive_v4.md](./key_algorithms_deep_dive_v4.md) - Algorithm analysis
- [system_reminder_integration_v6.md](./system_reminder_integration_v6.md) - System reminder integration
- [cross_feature_linkages_complete_v4.md](./cross_feature_linkages_complete_v4.md) - Feature integrations
- [../26_background_agents/ui_interaction_complete_v3.md](../26_background_agents/ui_interaction_complete_v3.md) - Background agents UI