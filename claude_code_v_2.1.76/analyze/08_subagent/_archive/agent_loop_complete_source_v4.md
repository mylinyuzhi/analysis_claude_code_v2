# Agent Loop Complete Source V4 (Claude Code 2.1.76)

> Complete source-level restoration of the agent loop execution including all parameters, message handling, fork context, and yield patterns.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `qh` - Agent loop runner — `chunks.133.mjs:1565`
- `TvY` - Is message recordable — `chunks.133.mjs:1561`
- `Fx8` - Clone fork context — `chunks.133.mjs:1788+`
- `vvY` - Build agent system prompt — `chunks.133.mjs:1806+`
- `NvY` - Resolve skill by name — `chunks.133.mjs:1817+`
- `r24` - Register agent hooks — `chunks.95.mjs:1842`
- `Yh` - LLM message loop — `chunks.148.mjs`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

AgentTool.call()
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. agentLoopRunner (qh)                                                      │
│    - Initialize agent ID, model, permission context                         │
│    - Clone fork context if provided                                         │
│    - Build system prompt                                                    │
│    - Derive tool set                                                        │
│    - Register hooks                                                         │
│    - Load skills                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. llmMessageLoop (Yh)                                                       │
│    - Stream messages from LLM API                                           │
│    - Handle tool calls                                                      │
│    - Manage conversation turns                                              │
│    - Check abort signal                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ├──────────────────────────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────────────┐           ┌───────────────────────┐
│ Yield stream events   │           │ Handle tool results   │
│ - message_start       │           │ - Execute tools       │
│ - content_block_delta │           │ - Send to LLM         │
│ - message_stop        │           │ - Update progress     │
└───────────────────────┘           └───────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Completion & Cleanup                                                      │
│    - Unregister hooks                                                       │
│    - Return final result                                                    │
│    - Flush output files                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: agentLoopRunner (qh)

```javascript
// ============================================
// qh - agentLoopRunner - Core async generator for agent execution
// Location: chunks.133.mjs:1565-1759
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
    // ... (continues with execution)
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
    // Step 1: Get initial state
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Step 2: Resolve model (agent definition > override > main loop > permission mode)
    let resolvedModel = resolveModel(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );

    // Step 3: Generate or use existing agent ID
    let agentId = override?.agentId ?? generateAgentId();

    // Step 4: Clone fork context if provided
    let messages = [
        ...forkContextMessages ? cloneForkContext(forkContextMessages) : [],
        ...promptMessages
    ];

    // Step 5: Initialize read file state
    let readFileState = forkContextMessages !== undefined
        ? cloneReadFileState(toolUseContext.readFileState)
        : createEmptyReadFileState();

    // Step 6: Load user and system context
    let [userContext, systemContext] = await Promise.all([
        override?.userContext ?? loadUserContext(),
        override?.systemContext ?? loadSystemContext()
    ]);

    // Step 7: Build permission context getter
    let getEffectiveAppState = () => {
        let state = toolUseContext.getAppState();
        let context = state.toolPermissionContext;

        // Apply agent permission mode if specified
        if (agentDefinition.permissionMode && context.mode !== "bypassPermissions") {
            context = { ...context, mode: agentDefinition.permissionMode };
        }

        // Handle permission prompt visibility
        let shouldAvoidPrompts = canShowPermissionPrompts !== undefined
            ? !canShowPermissionPrompts
            : agentDefinition.permissionMode === "bubble" ? false : isAsync;

        if (shouldAvoidPrompts) {
            context = { ...context, shouldAvoidPermissionPrompts: true };
        }

        // Handle allowed tools override
        if (allowedTools !== undefined) {
            context = {
                ...context,
                alwaysAllowRules: {
                    cliArg: state.toolPermissionContext.alwaysAllowRules.cliArg,
                    session: [...allowedTools]
                }
            };
        }

        return { ...state, toolPermissionContext: context };
    };

    // Step 8: Derive tool set
    let tools = useExactTools
        ? availableTools
        : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;

    // Step 9: Build system prompt
    let additionalWorkingDirs = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys());
    let systemPrompt = override?.systemPrompt
        ? override.systemPrompt
        : await buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, additionalWorkingDirs);

    // Step 10: Get or create abort controller
    let abortController = override?.abortController
        ? override.abortController
        : isAsync
            ? new AbortController()
            : toolUseContext.abortController;

    // Step 11: Handle hook additional contexts
    let additionalContexts = [];
    for await (let event of dispatchAgentStartHooks(agentId, agentDefinition.agentType, abortController.signal)) {
        if (event.additionalContexts?.length > 0) {
            additionalContexts.push(...event.additionalContexts);
        }
    }

    if (additionalContexts.length > 0) {
        let hookAttachment = createTaskStatusAttachment({
            type: "hook_additional_context",
            content: additionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        });
        messages.push(hookAttachment);
    }

    // Step 12: Register agent hooks
    if (agentDefinition.hooks) {
        registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
    }

    // Step 13: Load skills
    let skills = agentDefinition.skills ?? [];
    if (skills.length > 0) {
        let skillRegistry = await loadSkillRegistry();
        for (let skillName of skills) {
            let skill = resolveSkillByName(skillName, skillRegistry, agentDefinition);
            if (!skill) {
                log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' not found`);
                continue;
            }
            // Preload skill prompt into messages
            let content = await skill.getPromptForCommand("", toolUseContext);
            messages.push(createUserMessage({ content }));
        }
    }

    // Step 14: Setup MCP clients for this agent
    let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } = await setupAgentMcp(agentDefinition, toolUseContext.options.mcpClients);
    let allTools = mcpTools.length > 0 ? mergeTools([...tools, ...mcpTools]) : tools;

    // Step 15: Create derived tool use context
    let derivedContext = deriveToolUseContext(toolUseContext, {
        options: {
            isNonInteractiveSession: useExactTools ? toolUseContext.options.isNonInteractiveSession : isAsync ? true : toolUseContext.options.isNonInteractiveSession,
            tools: allTools,
            mainLoopModel: resolvedModel,
            mcpClients,
            // ... other options
        },
        agentId,
        agentType: agentDefinition.agentType,
        messages,
        readFileState,
        abortController,
        getAppState: getEffectiveAppState
    });

    // Step 16: Record transcript
    await recordTranscript(messages, agentId).catch(err => log(`Failed to record transcript: ${err}`));
    await writeAgentMetadata(agentId, { agentType: agentDefinition.agentType, worktreePath }).catch(err => log(`Failed to write metadata: ${err}`));

    // Step 17: Run LLM message loop
    try {
        for await (let event of llmMessageLoop({
            messages,
            systemPrompt,
            userContext,
            systemContext,
            canUseTool,
            toolUseContext: derivedContext,
            querySource,
            maxTurns: maxTurns ?? agentDefinition.maxTurns
        })) {
            // Handle progress callback
            onQueryProgress?.();

            // Yield events to caller
            if (event.type === "stream_event") {
                // Track TTFT (time to first token)
                if (event.event.type === "message_start" && event.ttftMs != null) {
                    toolUseContext.pushApiMetricsEntry?.(event.ttftMs);
                    continue;
                }
            }

            yield event;
        }
    } finally {
        // Step 18: Cleanup
        if (agentDefinition.hooks) {
            deregisterAgentHooks(setAppState, agentId);
        }
        await mcpCleanup?.();
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext,
//          Y→canUseTool, z→isAsync, w→forkContextMessages, O→querySource, $→override,
//          H→model, j→maxTurns, J→preserveToolUseResults, M→availableTools, D→allowedTools,
//          P→useExactTools, W→worktreePath, Z→transcriptSubdir, G→onQueryProgress,
//          C01→resolveModel, bI→generateAgentId, Fx8→cloneForkContext, vvY→buildAgentSystemPrompt,
//          NvY→resolveSkillByName, r24→registerAgentHooks, Yh→llmMessageLoop
```

---

## Helper Functions

### isMessageRecordable (TvY)

**What it does:** Determines which message types should be recorded in the transcript.

```javascript
// ============================================
// TvY - isMessageRecordable - Check if message should be recorded
// Location: chunks.133.mjs:1561-1563
// ============================================

// ORIGINAL (for source lookup):
function TvY(A) {
    return A.type === "assistant" || A.type === "user" || A.type === "progress" || A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function isMessageRecordable(message) {
    // Record assistant messages (LLM responses)
    if (message.type === "assistant") return true;

    // Record user messages (including tool results)
    if (message.type === "user") return true;

    // Record progress messages
    if (message.type === "progress") return true;

    // Record compact boundary markers
    if (message.type === "system" && message.subtype === "compact_boundary") return true;

    return false;
}

// Mapping: TvY→isMessageRecordable, A→message
```

**Why these types:**
- **assistant** - LLM responses must be preserved for context
- **user** - User messages including tool results
- **progress** - Progress updates for UI display
- **compact_boundary** - Markers for auto-compact boundaries

---

## Execution Modes

### Synchronous Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SYNCHRONOUS EXECUTION                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AgentTool.call({ run_in_background: false })                               │
│          │                                                                   │
│          ▼                                                                   │
│  agentLoopRunner() ─────────────────────────────────────┐                   │
│          │                                               │                   │
│          │  [Yield stream events to caller]              │                   │
│          │                                               │                   │
│          ▼                                               │                   │
│  Tool execution completes                               │                   │
│          │                                               │                   │
│          ▼                                               │                   │
│  Return { status: "completed", content, tokens }        │                   │
│                                                                              │
│  Characteristics:                                                            │
│  - Blocks until completion                                                   │
│  - Real-time progress updates                                                │
│  - Can be backgrounded mid-run via Promise.race()                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Background Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND EXECUTION                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AgentTool.call({ run_in_background: true })                                │
│          │                                                                   │
│          ▼                                                                   │
│  createBackgroundAgentTask()                                                 │
│          │                                                                   │
│          ├─── Return immediately { status: "async_launched", agentId }      │
│          │                                                                   │
│          └─── Spawn detached execution                                       │
│                  │                                                           │
│                  ▼                                                           │
│              agentLoopRunner() in detached context                          │
│                  │                                                           │
│                  ├─── Write progress to output file                         │
│                  │                                                           │
│                  └─── On completion: inject system reminder                 │
│                                                                              │
│  Characteristics:                                                            │
│  - Non-blocking return                                                       │
│  - Output file for progress checking                                        │
│  - System reminder notification on completion                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Teammate Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TEAMMATE EXECUTION                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AgentTool.call({ name: "worker", team_name: "team1" })                     │
│          │                                                                   │
│          ▼                                                                   │
│  spawnTeammate()                                                             │
│          │                                                                   │
│          ├─── Route to backend:                                              │
│          │    ├─ splitpane (iTerm2/tmux)                                    │
│          │    ├─ tmux only                                                   │
│          │    └─ in-process (non-interactive)                               │
│          │                                                                   │
│          ▼                                                                   │
│  inProcessAgentRunner()                                                      │
│          │                                                                   │
│          ├─── Poll for messages via pollForNextMessage()                    │
│          │                                                                   │
│          ├─── Read from mailbox                                              │
│          │                                                                   │
│          └─── Process and respond                                            │
│                                                                              │
│  Characteristics:                                                            │
│  - Mailbox-based communication                                              │
│  - Can receive messages from team members                                    │
│  - Priority message handling                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Message Flow

### Yield Pattern

```javascript
// Events yielded from agentLoopRunner:

// 1. Stream events (real-time output)
{ type: "stream_event", event: { type: "content_block_delta", delta: { text: "..." } } }

// 2. Tool use events
{ type: "tool_use", toolName: "Read", toolUseId: "...", input: {...} }

// 3. Tool result events
{ type: "tool_result", toolUseId: "...", result: {...} }

// 4. Progress events
{ type: "progress", summary: "Processing files...", toolUseCount: 5, tokenCount: 1234 }

// 5. Completion events
{ type: "complete", result: { status: "completed", content: [...], tokens: 5000 } }

// 6. Error events
{ type: "error", error: "API rate limit exceeded" }

// 7. Abort events
{ type: "aborted", reason: "User cancelled" }
```

---

## Key Design Decisions

### Why Async Generator?

1. **Streaming** - Real-time output to UI without buffering
2. **Cancellable** - Check abort signal between yields
3. **Composable** - Can be wrapped, transformed, or race'd
4. **Memory efficient** - Don't hold all events in memory

### Why Derived Tool Use Context?

1. **Isolation** - Subagent has its own state slice
2. **Permission scoping** - Different tools/permissions
3. **Abort handling** - Independent abort controller
4. **MCP isolation** - Separate MCP client connections

### Why Fork Context Cloning?

1. **Context inheritance** - Parent's messages available to child
2. **State isolation** - Child doesn't affect parent's read state
3. **Memory efficiency** - Clone only what's needed

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | ✓ Verified |
| `TvY` | isMessageRecordable | chunks.133.mjs:1561 | ✓ Verified |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788+ | ✓ Verified |
| `vvY` | buildAgentSystemPrompt | chunks.133.mjs:1806+ | ✓ Verified |
| `NvY` | resolveSkillByName | chunks.133.mjs:1817+ | ✓ Verified |
| `r24` | registerAgentHooks | chunks.95.mjs:1842 | ✓ Verified |
| `Yh` | llmMessageLoop | chunks.148.mjs | ✓ Verified |

---

## Related Documents

- [agent_tool_complete_v2.md](./agent_tool_complete_v2.md) - AgentTool entry point
- [teammate_execution_complete_source_v3.md](./teammate_execution_complete_source_v3.md) - Teammate execution
- [mailbox_system_complete_source_v3.md](./mailbox_system_complete_source_v3.md) - Mailbox communication
- [../26_background_agents/task_lifecycle_complete_v5.md](../26_background_agents/task_lifecycle_complete_v5.md) - Task lifecycle