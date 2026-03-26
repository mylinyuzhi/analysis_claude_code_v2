# Agent Loop Complete Source V3 (Claude Code 2.1.76)

> Complete source-level restoration of the agent loop system including all initialization, state management, skill loading, MCP integration, and message streaming.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `qh` - Agent loop runner — `chunks.133.mjs:1565`
- `TvY` - Is message recordable — `chunks.133.mjs:1561`
- `Fx8` - Clone fork context — `chunks.133.mjs:1788`
- `vvY` - Build agent system prompt — `chunks.133.mjs:1806`
- `NvY` - Resolve skill by name — `chunks.133.mjs:1817`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP EXECUTION FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

AgentTool.call() or spawnTeammate()
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Initialization                                                      │
│   • Generate agent ID (bI)                                                   │
│   • Resolve model selection (C01)                                            │
│   • Clone fork context (Fx8)                                                 │
│   • Build system prompt (vvY)                                                │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Context Building                                                    │
│   • Load user context (a2)                                                   │
│   • Load system context (mw)                                                 │
│   • Resolve skills (NvY)                                                     │
│   • Filter tools (_c)                                                        │
│   • Register hooks (r24)                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Tool Use Context Derivation                                         │
│   • Create tool use context (Bc6)                                            │
│   • Merge MCP tools                                                          │
│   • Set permission mode                                                      │
│   • Configure thinking mode                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 4: LLM Message Loop (Yh)                                               │
│   • Stream messages from LLM                                                 │
│   • Handle tool calls                                                        │
│   • Process attachments                                                      │
│   • Check max turns                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 5: Cleanup                                                             │
│   • Cleanup MCP clients (K6)                                                 │
│   • Deregister hooks (zZ6)                                                   │
│   • Clear file read state                                                    │
│   • Kill bash tasks (t24)                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: agentLoopRunner (qh)

### Function Signature

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
    // ... implementation
}

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,           // Agent type definition with tools, skills, hooks
    promptMessages,            // Initial messages to process
    toolUseContext,            // Context for tool execution (getAppState, setAppState, etc.)
    canUseTool,                // Function to check if tool can be used
    isAsync,                   // Whether running asynchronously (background agent)
    canShowPermissionPrompts,  // Whether to show permission prompts
    forkContextMessages,       // Messages from parent context (for subagents)
    querySource,               // Source of the query (for telemetry)
    override,                  // Override options (agentId, systemPrompt, etc.)
    model,                     // Model override
    maxTurns,                  // Maximum turns before stopping
    preserveToolUseResults,    // Keep tool results in context
    availableTools,            // Tools available to this agent
    allowedTools,              // Tools allowed (whitelist)
    onCacheSafeParams,         // Callback for cache-safe parameters
    useExactTools,             // Use exact tools without filtering
    worktreePath,              // Path to worktree for isolation
    transcriptSubdir,          // Subdirectory for transcripts
    onQueryProgress           // Progress callback
}) {
    // ... implementation
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext,
//          Y→canUseTool, z→isAsync, _→canShowPermissionPrompts, w→forkContextMessages,
//          O→querySource, $→override, H→model, j→maxTurns, J→preserveToolUseResults,
//          M→availableTools, D→allowedTools, X→onCacheSafeParams, P→useExactTools,
//          W→worktreePath, Z→transcriptSubdir, G→onQueryProgress
```

### Phase 1: Initialization

```javascript
// ============================================
// Initialization Phase
// Location: chunks.133.mjs:1586-1595
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
// Step 1: Get initial state
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
let agentId = override?.agentId
    ? override.agentId
    : generateAgentId();

// Step 4: Set up transcript directory if specified
if (transcriptSubdir) {
    setTranscriptSubdir(agentId, transcriptSubdir);
}

// Step 5: Record agent lineage for telemetry
if (isTelemetryEnabled()) {
    let parentAgentId = toolUseContext.agentId ?? getCurrentAgentId();
    recordAgentLineage(agentId, agentDefinition.agentType, parentAgentId);
}

// Mapping: f→appState, v→permissionMode, N→setAppState, V→resolvedModel, L→agentId,
//          C01→resolveModelSelection, bI→generateAgentId, px8→setTranscriptSubdir,
//          qc→isTelemetryEnabled, R1→getCurrentAgentId, R01→recordAgentLineage
```

### Phase 2: Message Preparation

```javascript
// ============================================
// Message Preparation Phase
// Location: chunks.133.mjs:1596-1646
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
// Step 1: Merge fork context with prompt messages
let messages = [
    ...forkContextMessages ? cloneForkContext(forkContextMessages) : [],
    ...promptMessages
];

// Step 2: Clone or create file read state
let readFileState = forkContextMessages !== undefined
    ? cloneReadFileState(toolUseContext.readFileState)
    : createEmptyReadFileState();

// Step 3: Load user and system context in parallel
let [userContext, systemContext] = await Promise.all([
    override?.userContext ?? getUserContext(),
    override?.systemContext ?? getSystemContext()
]);

// Step 4: Derive permission context
let permissionMode = agentDefinition.permissionMode;

let getDerivedAppState = () => {
    let state = toolUseContext.getAppState();
    let permContext = state.toolPermissionContext;

    // Apply agent's permission mode if specified
    if (permissionMode &&
        state.toolPermissionContext.mode !== "bypassPermissions" &&
        state.toolPermissionContext.mode !== "acceptEdits" &&
        state.toolPermissionContext.mode !== "auto") {
        permContext = { ...permContext, mode: permissionMode };
    }

    // Determine if we should avoid permission prompts
    let avoidPrompts = canShowPermissionPrompts !== undefined
        ? !canShowPermissionPrompts
        : permissionMode === "bubble" ? false : isAsync;

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

    // Apply effort level
    let effort = agentDefinition.effort !== undefined
        ? agentDefinition.effort
        : state.effortValue;

    // Return unchanged if nothing changed
    if (permContext === state.toolPermissionContext && effort === state.effortValue) {
        return state;
    }

    return {
        ...state,
        toolPermissionContext: permContext,
        effortValue: effort
    };
};

// Step 5: Filter tools for subagent
let resolvedTools = useExactTools
    ? availableTools
    : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;

// Step 6: Build system prompt
let additionalWorkingDirs = Array.from(
    appState.toolPermissionContext.additionalWorkingDirectories.keys()
);
let systemPrompt = override?.systemPrompt
    ? override.systemPrompt
    : normalizeSystemPrompt(
        await buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, additionalWorkingDirs)
    );

// Step 7: Set up abort controller
let abortController = override?.abortController
    ? override.abortController
    : isAsync
        ? new AbortController()
        : toolUseContext.abortController;

// Step 8: Handle SubagentStart hook additional contexts
let hookAdditionalContexts = [];
for await (let event of dispatchSubagentStartHook(agentId, agentDefinition.agentType, abortController.signal)) {
    if (event.additionalContexts && event.additionalContexts.length > 0) {
        hookAdditionalContexts.push(...event.additionalContexts);
    }
}

// Step 9: Add hook contexts as attachment
if (hookAdditionalContexts.length > 0) {
    let attachment = createAttachment({
        type: "hook_additional_context",
        content: hookAdditionalContexts,
        hookName: "SubagentStart",
        toolUseID: generateToolUseId(),
        hookEvent: "SubagentStart"
    });
    messages.push(attachment);
}

// Mapping: R→messages, u→readFileState, I→userContext, g→systemContext, B→permissionMode,
//          b→getDerivedAppState, p→resolvedTools, Q→additionalWorkingDirs, U→systemPrompt,
//          r→abortController, e→hookAdditionalContexts, Fx8→cloneForkContext, DI→cloneReadFileState,
//          a2→getUserContext, mw→getSystemContext, _c→applyToolFilters, vvY→buildAgentSystemPrompt,
//          uq→normalizeSystemPrompt, Ux8→dispatchSubagentStartHook, f4→createAttachment
```

### Phase 3: Skill Loading

```javascript
// ============================================
// Skill Loading Phase
// Location: chunks.133.mjs:1647-1697
// ============================================

// ORIGINAL (for source lookup):
if (A.hooks) r24(N, L, A.hooks, `agent '${A.agentType}'`, !0);
let Y6 = A.skills ?? [];
if (Y6.length > 0) {
    let $6 = await NR(qY()),
        n = [];
    for (let i of Y6) {
        let l = NvY(i, $6, A);
        if (!l) {
            k(`[Agent: ${A.agentType}] Warning: Skill '${i}' specified in frontmatter was not found`, {
                level: "warn"
            });
            continue
        }
        let q6 = kf6(l, $6);
        if (q6.type !== "prompt") {
            k(`[Agent: ${A.agentType}] Warning: Skill '${i}' is not a prompt-based skill`, {
                level: "warn"
            });
            continue
        }
        n.push({
            skillName: i,
            skill: q6
        })
    }
    let {
        formatSkillLoadingMetadata: o
    } = await Promise.resolve().then(() => (MN1(), JN1)),
        a = await Promise.all(n.map(async ({
            skillName: i,
            skill: l
        }) => ({
            skillName: i,
            skill: l,
            content: await l.getPromptForCommand("", K)
        })));
    for (let {
            skillName: i,
            skill: l,
            content: q6
        }
        of a) {
        k(`[Agent: ${A.agentType}] Preloaded skill '${i}'`);
        let w6 = o(i, l.progressMessage);
        R.push(p1({
            content: [{
                type: "text",
                text: w6
            }, ...q6]
        }))
    }
}

// READABLE (for understanding):
// Step 1: Register hooks if specified
if (agentDefinition.hooks) {
    registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
}

// Step 2: Load skills specified in agent definition
let skills = agentDefinition.skills ?? [];

if (skills.length > 0) {
    // Load skill registry
    let skillRegistry = await loadSkillRegistry(getSkillDirectory());

    // Resolve each skill
    let resolvedSkills = [];
    for (let skillName of skills) {
        // Resolve skill name (may include agent type prefix)
        let resolvedName = resolveSkillByName(skillName, skillRegistry, agentDefinition);
        if (!resolvedName) {
            logWarn(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' specified in frontmatter was not found`);
            continue;
        }

        // Get skill definition
        let skillDef = getSkillDefinition(resolvedName, skillRegistry);
        if (skillDef.type !== "prompt") {
            logWarn(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' is not a prompt-based skill`);
            continue;
        }

        resolvedSkills.push({
            skillName: skillName,
            skill: skillDef
        });
    }

    // Import skill loading formatter
    let { formatSkillLoadingMetadata } = await import("./skill-formatters");

    // Load skill prompts in parallel
    let loadedSkills = await Promise.all(
        resolvedSkills.map(async ({ skillName, skill }) => ({
            skillName,
            skill,
            content: await skill.getPromptForCommand("", toolUseContext)
        }))
    );

    // Add skill content as user messages
    for (let { skillName, skill, content } of loadedSkills) {
        logInfo(`[Agent: ${agentDefinition.agentType}] Preloaded skill '${skillName}'`);

        // Create skill loading metadata header
        let metadata = formatSkillLoadingMetadata(skillName, skill.progressMessage);

        // Push as user message
        messages.push(createUserMessage({
            content: [
                { type: "text", text: metadata },
                ...content
            ]
        }));
    }
}

// Mapping: Y6→skills, r24→registerAgentHooks, NR→loadSkillRegistry, qY→getSkillDirectory,
//          NvY→resolveSkillByName, kf6→getSkillDefinition, k→logWarn/logInfo, o→formatSkillLoadingMetadata,
//          p1→createUserMessage
```

### Phase 4: Tool Use Context Derivation

```javascript
// ============================================
// Tool Use Context Derivation Phase
// Location: chunks.133.mjs:1698-1731
// ============================================

// ORIGINAL (for source lookup):
let {
    clients: H6,
    tools: J6,
    cleanup: K6
} = await fvY(A, K.options.mcpClients), s = J6.length > 0 ? K0([...p, ...J6], "name") : p, X6 = {
    isNonInteractiveSession: P ? K.options.isNonInteractiveSession : z ? !0 : K.options.isNonInteractiveSession ?? !1,
    appendSystemPrompt: K.options.appendSystemPrompt,
    tools: s,
    commands: [],
    debug: K.options.debug,
    verbose: K.options.verbose,
    mainLoopModel: V,
    thinkingConfig: P ? K.options.thinkingConfig : {
        type: "disabled"
    },
    mcpClients: H6,
    mcpResources: K.options.mcpResources,
    agentDefinitions: K.options.agentDefinitions,
    ...P && {
        querySource: O
    }
}, z6 = Bc6(K, {
    options: X6,
    agentId: L,
    agentType: A.agentType,
    messages: R,
    readFileState: u,
    abortController: r,
    getAppState: b,
    shareSetAppState: !z,
    shareSetResponseLength: !0,
    criticalSystemReminder_EXPERIMENTAL: A.criticalSystemReminder_EXPERIMENTAL
});
if (J) z6.preserveToolUseResults = !0;
if (X) X({
    systemPrompt: U,
    userContext: I,
    systemContext: g,
    toolUseContext: z6,
    forkContextMessages: R
});

// READABLE (for understanding):
// Step 1: Load MCP clients and tools for this agent
let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } =
    await loadAgentMcpClients(agentDefinition, toolUseContext.options.mcpClients);

// Step 2: Merge MCP tools with resolved tools
let allTools = mcpTools.length > 0
    ? dedupeByName([...resolvedTools, ...mcpTools])
    : resolvedTools;

// Step 3: Build options for subagent context
let subagentOptions = {
    isNonInteractiveSession: useExactTools
        ? toolUseContext.options.isNonInteractiveSession
        : isAsync
            ? true
            : toolUseContext.options.isNonInteractiveSession ?? false,
    appendSystemPrompt: toolUseContext.options.appendSystemPrompt,
    tools: allTools,
    commands: [],
    debug: toolUseContext.options.debug,
    verbose: toolUseContext.options.verbose,
    mainLoopModel: resolvedModel,
    thinkingConfig: useExactTools
        ? toolUseContext.options.thinkingConfig
        : { type: "disabled" },
    mcpClients: mcpClients,
    mcpResources: toolUseContext.options.mcpResources,
    agentDefinitions: toolUseContext.options.agentDefinitions,
    ...(useExactTools && { querySource: querySource })
};

// Step 4: Derive tool use context for subagent
let subagentContext = deriveToolUseContext(toolUseContext, {
    options: subagentOptions,
    agentId: agentId,
    agentType: agentDefinition.agentType,
    messages: messages,
    readFileState: readFileState,
    abortController: abortController,
    getAppState: getDerivedAppState,
    shareSetAppState: !isAsync,
    shareSetResponseLength: true,
    criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL
});

// Step 5: Set preserveToolUseResults if requested
if (preserveToolUseResults) {
    subagentContext.preserveToolUseResults = true;
}

// Step 6: Call onCacheSafeParams callback if provided
if (onCacheSafeParams) {
    onCacheSafeParams({
        systemPrompt: systemPrompt,
        userContext: userContext,
        systemContext: systemContext,
        toolUseContext: subagentContext,
        forkContextMessages: messages
    });
}

// Mapping: H6→mcpClients, J6→mcpTools, K6→mcpCleanup, s→allTools, X6→subagentOptions,
//          z6→subagentContext, fvY→loadAgentMcpClients, K0→dedupeByName, Bc6→deriveToolUseContext
```

### Phase 5: Main Loop Execution

```javascript
// ============================================
// Main Loop Execution Phase
// Location: chunks.133.mjs:1739-1785
// ============================================

// ORIGINAL (for source lookup):
await dg(R, L).catch(($6) => k(`Failed to record sidechain transcript: ${$6}`));
await gc6(L, {
    agentType: A.agentType,
    ...W && {
        worktreePath: W
    }
}).catch(($6) => k(`Failed to write agent metadata: ${$6}`));
let N6 = R.length > 0 ? R[R.length - 1].uuid : null;
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
        if (G?.(), $6.type === "stream_event" && $6.event.type === "message_start" && $6.ttftMs != null) {
            K.pushApiMetricsEntry?.($6.ttftMs);
            continue
        }
        if ($6.type === "attachment") {
            if ($6.attachment.type === "max_turns_reached") {
                k(`[Agent: ${A.agentDefinition.agentType}] Reached max turns limit (${message.attachment.maxTurns})`);
                break
            }
            yield $6;
            continue
        }
        if (TvY($6)) await dg([$6], L, N6).catch((n) => k(`Failed to record sidechain transcript: ${n}`)), N6 = $6.uuid, yield $6
    }
    if (r.signal.aborted) throw new oY;
    if (Qj(A) && A.callback) A.callback()
} finally {
    if (await K6(), A.hooks) zZ6(N, L);
    z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
}

// READABLE (for understanding):
// Step 1: Record initial messages to sidechain transcript
await recordSidechainTranscript(messages, agentId).catch((err) =>
    logError(`Failed to record sidechain transcript: ${err}`)
);

// Step 2: Write agent metadata
await writeAgentMetadata(agentId, {
    agentType: agentDefinition.agentType,
    ...(worktreePath && { worktreePath: worktreePath })
}).catch((err) =>
    logError(`Failed to write agent metadata: ${err}`)
);

// Step 3: Track last message UUID for transcript linking
let lastUuid = messages.length > 0 ? messages[messages.length - 1].uuid : null;

try {
    // Step 4: Run the LLM message loop
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
        // Call progress callback if provided
        onQueryProgress?.();

        // Handle TTFT (Time to First Token) metrics
        if (event.type === "stream_event" &&
            event.event.type === "message_start" &&
            event.ttftMs != null) {
            toolUseContext.pushApiMetricsEntry?.(event.ttftMs);
            continue;
        }

        // Handle attachments
        if (event.type === "attachment") {
            // Check for max turns reached
            if (event.attachment.type === "max_turns_reached") {
                logInfo(`[Agent: ${agentDefinition.agentType}] Reached max turns limit (${event.attachment.maxTurns})`);
                break;
            }
            yield event;
            continue;
        }

        // Handle recordable messages (assistant, user, progress, compact_boundary)
        if (isMessageRecordable(event)) {
            // Record to sidechain transcript
            await recordSidechainTranscript([event], agentId, lastUuid).catch((err) =>
                logError(`Failed to record sidechain transcript: ${err}`)
            );
            lastUuid = event.uuid;
            yield event;
        }
    }

    // Step 5: Check if aborted
    if (abortController.signal.aborted) {
        throw new AbortError();
    }

    // Step 6: Call callback if defined and agent is callback type
    if (isCallbackAgent(agentDefinition) && agentDefinition.callback) {
        agentDefinition.callback();
    }

} finally {
    // Step 7: Cleanup
    // Cleanup MCP clients
    await mcpCleanup();

    // Deregister hooks
    if (agentDefinition.hooks) {
        deregisterAgentHooks(setAppState, agentId);
    }

    // Clear state
    subagentContext.readFileState.clear();
    messages.length = 0;

    // Cleanup agent resources
    cleanupAgentResources(agentId);

    // Kill any remaining bash tasks for this agent
    killBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
}

// Mapping: N6→lastUuid, Yh→llmMessageLoop, TvY→isMessageRecordable, dg→recordSidechainTranscript,
//          gc6→writeAgentMetadata, G→onQueryProgress, K6→mcpCleanup, zZ6→deregisterAgentHooks,
//          a36→cleanupAgentResources, Qx8→cleanupAgentState, t24→killBashTasksForAgent, oY→AbortError
```

---

## Helper Function: isMessageRecordable (TvY)

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
    // - assistant: LLM responses
    // - user: User messages
    // - progress: Progress updates
    // - system with compact_boundary subtype: Compaction markers
    return message.type === "assistant" ||
           message.type === "user" ||
           message.type === "progress" ||
           (message.type === "system" && "subtype" in message && message.subtype === "compact_boundary");
}

// Mapping: TvY→isMessageRecordable, A→message
```

---

## Helper Function: cloneForkContext (Fx8)

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
    // Step 1: Collect all tool_use_ids from tool_result messages
    // This identifies which tool calls have responses
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

    // Step 2: Filter out orphaned tool_use blocks
    // Keep only assistant messages where all tool_uses have responses
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
        return true;
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→validToolUseIds
```

### Why this filtering?

**Purpose:** When forking context for a subagent, orphaned tool_use blocks (without corresponding tool_result) would cause the LLM to be confused about incomplete tool calls.

**Algorithm:**
1. First pass: Collect all tool_use_ids from tool_result blocks
2. Second pass: Remove assistant messages containing tool_use blocks without matching results

**Key insight:** This ensures the subagent receives a consistent conversation state without dangling tool calls.

---

## Helper Function: buildAgentSystemPrompt (vvY)

```javascript
// ============================================
// vvY - buildAgentSystemPrompt - Build agent-specific system prompt
// Location: chunks.133.mjs:1806-1815
// ============================================

// ORIGINAL (for source lookup):
async function vvY(A, q, K, Y) {
    try {
        let _ = [A.getSystemPrompt({
            toolUseContext: q
        })];
        return await mc6(_, K, Y)
    } catch (z) {
        return await mc6([Al4], K, Y)
    }
}

// READABLE (for understanding):
async function buildAgentSystemPrompt(agentDefinition, toolUseContext, model, additionalWorkingDirs) {
    try {
        // Step 1: Get agent's custom system prompt
        let promptParts = [
            agentDefinition.getSystemPrompt({
                toolUseContext: toolUseContext
            })
        ];

        // Step 2: Merge with base system prompt and working directories
        return await mergeSystemPrompts(promptParts, model, additionalWorkingDirs);
    } catch (error) {
        // Fallback to default system prompt on error
        return await mergeSystemPrompts([DEFAULT_SYSTEM_PROMPT], model, additionalWorkingDirs);
    }
}

// Mapping: vvY→buildAgentSystemPrompt, A→agentDefinition, q→toolUseContext, K→model,
//          Y→additionalWorkingDirs, _→promptParts, mc6→mergeSystemPrompts, Al4→DEFAULT_SYSTEM_PROMPT
```

---

## Helper Function: resolveSkillByName (NvY)

```javascript
// ============================================
// NvY - resolveSkillByName - Resolve skill name with agent type prefix
// Location: chunks.133.mjs:1817-1828
// ============================================

// ORIGINAL (for source lookup):
function NvY(A, q, K) {
    if (rY6(A, q)) return A;
    let Y = K.agentType.split(":")[0];
    if (Y) {
        let w = `${Y}:${A}`;
        if (rY6(w, q)) return w
    }
}

// READABLE (for understanding):
function resolveSkillByName(skillName, skillRegistry, agentDefinition) {
    // Step 1: Check if skill exists with exact name
    if (skillExists(skillName, skillRegistry)) {
        return skillName;
    }

    // Step 2: Try with agent type prefix
    // e.g., "plan" skill for "Plan" agent → "Plan:plan"
    let agentTypePrefix = agentDefinition.agentType.split(":")[0];
    if (agentTypePrefix) {
        let prefixedName = `${agentTypePrefix}:${skillName}`;
        if (skillExists(prefixedName, skillRegistry)) {
            return prefixedName;
        }
    }

    // Skill not found
    return null;
}

// Mapping: NvY→resolveSkillByName, A→skillName, q→skillRegistry, K→agentDefinition,
//          rY6→skillExists, Y→agentTypePrefix, w→prefixedName
```

### Why agent type prefix?

**Design rationale:**
- Different agents may have custom versions of standard skills
- e.g., "Plan:summarize" vs "general-purpose:summarize"
- Allows agent-specific skill overrides
- Falls back to global skill if not found

---

## State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP STATE MACHINE                             │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   Created    │
                         └──────┬───────┘
                                │ spawn
                                ▼
                    ┌───────────────────┐
                    │   Initializing    │
                    │  - Build context  │
                    │  - Load skills    │
                    │  - Filter tools   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
           ┌────────│    Running        │────────┐
           │        │                   │        │
           │        └───────────────────┘        │
           │                │                    │
     max_turns      tool_use / response    abort signal
     reached              │                    │
           │              │                    │
           ▼              ▼                    ▼
    ┌───────────┐  ┌──────────────┐    ┌───────────┐
    │ Completed │  │ Processing   │    │ Aborted   │
    │           │  │ - Tool call  │    │           │
    │ callback? │  │ - LLM resp   │    │ throw     │
    └───────────┘  └──────────────┘    └───────────┘
                          │
                          │ continue
                          └──────────────┐
                                         │
                                         ▼
                                  Back to Running
```

---

## Key Design Decisions

### 1. Async Generator Pattern

**Why async generator?**
- **Streaming:** Real-time message delivery to caller
- **Cancellable:** Can abort mid-execution via AbortController
- **Memory efficient:** Doesn't buffer all messages
- **Composable:** Can be consumed by for-await-of loops

### 2. Fork Context Filtering

**Why filter orphaned tool uses?**
- Prevents LLM confusion from incomplete tool calls
- Ensures consistent conversation state for subagent
- Avoids errors from missing tool_result blocks

### 3. Skill Prefix Resolution

**Why agent type prefix?**
- Allows agent-specific skill overrides
- Enables namespace isolation for skills
- Falls back gracefully to global skills

### 4. MCP Tool Merging

**Why merge MCP tools at runtime?**
- Different agents may have different MCP clients
- Allows per-agent MCP configuration
- Deduplication prevents tool name conflicts

---

## Source File References

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | ✓ Verified |
| `TvY` | isMessageRecordable | chunks.133.mjs:1561 | ✓ Verified |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788 | ✓ Verified |
| `vvY` | buildAgentSystemPrompt | chunks.133.mjs:1806 | ✓ Verified |
| `NvY` | resolveSkillByName | chunks.133.mjs:1817 | ✓ Verified |
| `r24` | registerAgentHooks | chunks.95.mjs:1842 | ✓ Verified |
| `zZ6` | deregisterAgentHooks | chunks.95.mjs:1830 | ✓ Verified |
| `Bc6` | deriveToolUseContext | chunks.148.mjs:1978 | ✓ Verified |

---

## Related Documents

- [teammate_execution_complete_source_v2.md](./teammate_execution_complete_source_v2.md) - Teammate execution
- [mailbox_system_complete_source_v2.md](./mailbox_system_complete_source_v2.md) - Mailbox system
- [key_algorithms_deep_dive_v3.md](./key_algorithms_deep_dive_v3.md) - Algorithm analysis
- [../26_background_agents/task_lifecycle_complete_v4.md](../26_background_agents/task_lifecycle_complete_v4.md) - Task lifecycle