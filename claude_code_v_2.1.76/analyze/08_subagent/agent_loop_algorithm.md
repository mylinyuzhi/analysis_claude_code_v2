# Agent Loop Algorithm Deep Dive (Claude Code 2.1.76)

> Source-level analysis of the `agentLoopRunner` (qh) generator and related algorithms
> that drive subagent execution, including identity propagation, context isolation, and progress reporting.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `agentLoopRunner` (qh) - Core async generator for agent execution — `chunks.133.mjs:1565`
- `isMessageRecordable` (TvY) - Filter for recordable message types — `chunks.133.mjs:1561`
- `cloneForkContext` (Fx8) - Clone and filter context for subagent — `chunks.133.mjs:1788`
- `buildAgentSystemPrompt` (vvY) - Build subagent system prompt — `chunks.133.mjs:1806`
- `resolveSkillByName` (NvY) - Resolve skill reference by name — `chunks.133.mjs:1817`

---

## Core Algorithm: agentLoopRunner (qh)

### What it does

`agentLoopRunner` is the heart of the subagent execution system. It's an **async generator function** that:
1. Sets up an isolated execution context for the subagent
2. Assembles tools, system prompt, and permission context
3. Executes the LLM message loop with streaming
4. Handles progress reporting, hooks, and cleanup

### Why async generator?

**Key Insight:** Using an async generator (`async function*`) instead of a regular async function provides several critical benefits:

1. **Streaming to UI** - Each message is yielded as it arrives, enabling real-time UI updates without waiting for completion
2. **Memory Efficiency** - Messages don't accumulate; they flow through the pipeline
3. **Cancellable** - The generator can be aborted mid-stream via `AbortController`
4. **Composable** - Callers can iterate with `for await...of` or manually step through

---

## Phase-by-Phase Algorithm Analysis

### Phase 1: Identity Binding & Model Resolution

```javascript
// ============================================
// agentLoopRunner - Phase 1: Identity and Model Setup
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
let appState = toolUseContext.getAppState();
let permissionMode = appState.toolPermissionContext.mode;
let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

// Model resolution: agent definition → main loop model → override parameter
let resolvedModel = resolveModel(
    agentDefinition.model,
    toolUseContext.options.mainLoopModel,
    modelOverride,
    permissionMode
);

// Generate unique agent ID or use override
let agentId = override?.agentId ? override.agentId : generateAgentId();

// Register transcript directory if specified
if (transcriptSubdir) {
    setTranscriptDirectory(agentId, transcriptSubdir);
}

// Telemetry registration if enabled
if (isTelemetryEnabled()) {
    let sessionId = toolUseContext.agentId ?? getSessionId();
    registerAgentTelemetry(agentId, agentDefinition.agentType, sessionId);
}

// Mapping: f→appState, v→permissionMode, N→setAppState, V→resolvedModel, L→agentId
```

**Key Decision - Model Priority Chain:**
1. **Agent definition model** (frontmatter `model:`)
2. **Main loop model** (session default)
3. **Override parameter** (per-invocation `model:` parameter)
4. **Permission mode consideration** (some modes restrict model access)

This priority ensures flexibility while respecting permission boundaries.

---

### Phase 2: Fork Context Building

```javascript
// ============================================
// agentLoopRunner - Phase 2: Fork Context
// Location: chunks.133.mjs:1596-1598
// ============================================

// ORIGINAL (for source lookup):
let R = [...w ? Fx8(w) : [], ...q],
    u = w !== void 0 ? DI(K.readFileState) : yd(Ed),
    [I, g] = await Promise.all([$?.userContext ?? a2(), $?.systemContext ?? mw()]);

// READABLE (for understanding):
// Merge fork context (if any) with prompt messages
let messages = [
    ...forkContextMessages ? cloneForkContext(forkContextMessages) : [],
    ...promptMessages
];

// Clone or create read file state for compact
let readFileState = forkContextMessages !== undefined
    ? cloneReadFileState(toolUseContext.readFileState)
    : createEmptyReadFileState();

// Get context providers
let [userContext, systemContext] = await Promise.all([
    override?.userContext ?? getUserContext(),
    override?.systemContext ?? getSystemContext()
]);

// Mapping: R→messages, u→readFileState, I→userContext, g→systemContext, w→forkContextMessages
```

**Key Algorithm: cloneForkContext (Fx8)**

```javascript
// ============================================
// cloneForkContext - Filter orphaned tool results
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
        } return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((w) => w.type === "tool_use" && w.id && !q.has(w.id))
        }
        return !0
    })
}

// READABLE (for understanding):
function cloneForkContext(messages) {
    // Step 1: Collect all tool_use_ids that have corresponding tool_results
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

    // Step 2: Filter out orphaned tool_uses
    // An orphaned tool_use is one that has no corresponding tool_result
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Keep message only if ALL tool_uses have corresponding results
                return !content.some((block) =>
                    block.type === "tool_use" &&
                    block.id &&
                    !validToolUseIds.has(block.id)
                );
            }
        }
        return true; // Keep all non-assistant messages
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→validToolUseIds
```

**Why This Matters:**
1. **API Compatibility** - Claude API rejects messages with tool_uses lacking tool_results
2. **Context Hygiene** - Prevents confusing half-completed operations in subagent context
3. **Memory Efficiency** - Removes unnecessary content from context window

---

### Phase 3: Permission Context Derivation

```javascript
// ============================================
// agentLoopRunner - Phase 3: Permission Context
// Location: chunks.133.mjs:1599-1630
// ============================================

// ORIGINAL (for source lookup):
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
}

// READABLE (for understanding):
let definedPermissionMode = agentDefinition.permissionMode;

let getDerivedAppState = () => {
    let currentAppState = toolUseContext.getAppState();
    let permissionContext = currentAppState.toolPermissionContext;

    // Step 1: Apply agent's permission mode if defined and not in bypass modes
    if (definedPermissionMode &&
        !["bypassPermissions", "acceptEdits", "auto"].includes(currentAppState.toolPermissionContext.mode)) {
        permissionContext = { ...permissionContext, mode: definedPermissionMode };
    }

    // Step 2: Determine if permission prompts should be avoided
    let shouldAvoidPrompts = canShowPermissionPrompts !== undefined
        ? !canShowPermissionPrompts
        : definedPermissionMode === "bubble"
            ? false
            : isAsync;

    if (shouldAvoidPrompts) {
        permissionContext = { ...permissionContext, shouldAvoidPermissionPrompts: true };
    }

    // Step 3: For async agents, enable automated checks before dialogs
    if (isAsync && !shouldAvoidPrompts) {
        permissionContext = { ...permissionContext, awaitAutomatedChecksBeforeDialog: true };
    }

    // Step 4: Apply allowed tools from parameter
    if (allowedTools !== undefined) {
        permissionContext = {
            ...permissionContext,
            alwaysAllowRules: {
                cliArg: currentAppState.toolPermissionContext.alwaysAllowRules.cliArg,
                session: [...allowedTools]
            }
        };
    }

    // Step 5: Apply effort level
    let effort = agentDefinition.effort !== undefined
        ? agentDefinition.effort
        : currentAppState.effortValue;

    // Return unchanged if no modifications
    if (permissionContext === currentAppState.toolPermissionContext &&
        effort === currentAppState.effortValue) {
        return currentAppState;
    }

    return {
        ...currentAppState,
        toolPermissionContext: permissionContext,
        effortValue: effort
    };
};

// Mapping: B→definedPermissionMode, b→getDerivedAppState, o→shouldAvoidPrompts
```

**Permission Mode Priority:**
1. **bypassPermissions** - Skip all permission checks (highest privilege)
2. **acceptEdits** - Auto-accept file edits
3. **auto** - Automated mode
4. **Agent defined mode** - From frontmatter
5. **Inherited mode** - From parent session

---

### Phase 4: Tool Assembly & Filtering

```javascript
// ============================================
// agentLoopRunner - Phase 4: Tool Assembly
// Location: chunks.133.mjs:1631
// ============================================

// ORIGINAL (for source lookup):
p = P ? M : _c(A, M, z).resolvedTools

// READABLE (for understanding):
let resolvedTools = useExactTools
    ? availableTools
    : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;

// Mapping: p→resolvedTools, P→useExactTools, M→availableTools, _c→applyToolFilters
```

**Key Algorithm: applyToolFilters (_c)**

```javascript
// ============================================
// applyToolFilters - Three-layer tool filtering
// Location: chunks.93.mjs:1590-1644
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
    // ... rest of function
}

// READABLE (for understanding):
function applyToolFilters(agentDefinition, allTools, isAsync = false, useExactTools = false) {
    let {
        tools: allowedToolList,
        disallowedTools,
        source,
        permissionMode
    } = agentDefinition;

    // Step 1: Apply context-based filtering
    let contextFilteredTools = useExactTools
        ? allTools
        : filterToolsForSubagent({
            tools: allTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Create set of disallowed tool names
    let disallowedNames = new Set(
        disallowedTools?.map(rule => parseToolRule(rule).toolName) ?? []
    );

    // Step 3: Filter out disallowed tools
    let allowedTools = contextFilteredTools.filter(
        tool => !disallowedNames.has(tool.name)
    );

    // Step 4: Handle wildcard case
    if (allowedToolList === undefined ||
        (allowedToolList.length === 1 && allowedToolList[0] === "*")) {
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: allowedTools
        };
    }

    // Step 5: Match requested tools to available tools
    let toolMap = new Map();
    for (let tool of allowedTools) {
        toolMap.set(tool.name, tool);
    }

    let validTools = [];
    let invalidTools = [];
    let resolvedTools = [];
    let seenTools = new Set();

    for (let requestedTool of allowedToolList) {
        let { toolName, ruleContent } = parseToolRule(requestedTool);

        // Special handling for Agent tool
        if (toolName === "Agent") {
            if (ruleContent) {
                allowedAgentTypes = ruleContent.split(",").map(s => s.trim());
            }
            if (!useExactTools) {
                validTools.push(requestedTool);
                continue;
            }
        }

        let matchedTool = toolMap.get(toolName);
        if (matchedTool) {
            validTools.push(requestedTool);
            if (!seenTools.has(matchedTool)) {
                resolvedTools.push(matchedTool);
                seenTools.add(matchedTool);
            }
        } else {
            invalidTools.push(requestedTool);
        }
    }

    return {
        hasWildcard: false,
        validTools,
        invalidTools,
        resolvedTools,
        allowedAgentTypes
    };
}

// Mapping: _c→applyToolFilters, Xk8→filterToolsForSubagent
```

---

### Phase 5: System Prompt Assembly

```javascript
// ============================================
// buildAgentSystemPrompt - System prompt assembly
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
        // Get the agent's custom system prompt
        let promptParts = [agentDefinition.getSystemPrompt({ toolUseContext })];

        // Combine with working directory context
        return await buildCombinedSystemPrompt(promptParts, model, additionalWorkingDirs);
    } catch (error) {
        // Fallback to default prompt on error
        return await buildCombinedSystemPrompt([DEFAULT_AGENT_PROMPT], model, additionalWorkingDirs);
    }
}

// Mapping: vvY→buildAgentSystemPrompt, mc6→buildCombinedSystemPrompt, Al4→DEFAULT_AGENT_PROMPT
```

---

### Phase 6: Hook Execution - SubagentStart

```javascript
// ============================================
// agentLoopRunner - Phase 6: Hook Execution
// Location: chunks.133.mjs:1635-1646
// ============================================

// ORIGINAL (for source lookup):
let e = [];
for await (let $6 of Ux8(L, A.agentType, r.signal))
    if ($6.additionalContexts && $6.additionalContexts.length > 0)
        e.push(...$6.additionalContexts);
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
let hookAdditionalContexts = [];

// Execute SubagentStart hooks
for await (let hookResult of executeSubagentStartHooks(agentId, agentDefinition.agentType, abortController.signal)) {
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
        hookAdditionalContexts.push(...hookResult.additionalContexts);
    }
}

// Inject hook-provided contexts into messages
if (hookAdditionalContexts.length > 0) {
    let hookMessage = createUserMessage({
        type: "hook_additional_context",
        content: hookAdditionalContexts,
        hookName: "SubagentStart",
        toolUseID: generateToolUseId(),
        hookEvent: "SubagentStart"
    });
    messages.push(hookMessage);
}

// Mapping: e→hookAdditionalContexts, Ux8→executeSubagentStartHooks
```

---

### Phase 7: Skill Preloading

```javascript
// ============================================
// agentLoopRunner - Phase 7: Skill Preloading
// Location: chunks.133.mjs:1648-1697
// ============================================

// ORIGINAL (for source lookup):
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
        // ... skill loading
    }
}

// READABLE (for understanding):
let skills = agentDefinition.skills ?? [];
if (skills.length > 0) {
    let availableSkills = await loadSkillRegistry();
    let loadedSkills = [];

    for (let skillName of skills) {
        // Resolve skill by name with agent context
        let resolvedName = resolveSkillByName(skillName, availableSkills, agentDefinition);
        if (!resolvedName) {
            logger.warn(`[Agent: ${agentDefinition.agentType}] Skill '${skillName}' not found`);
            continue;
        }

        let skill = getSkillDefinition(resolvedName, availableSkills);
        if (skill.type !== "prompt") {
            logger.warn(`[Agent: ${agentDefinition.agentType}] Skill '${skillName}' is not prompt-based`);
            continue;
        }

        loadedSkills.push({ skillName, skill });
    }

    // Load skill prompts
    let { formatSkillLoadingMetadata } = await importSkillFormatters();
    let skillPrompts = await Promise.all(loadedSkills.map(async ({ skillName, skill }) => ({
        skillName,
        skill,
        content: await skill.getPromptForCommand("", toolUseContext)
    })));

    // Inject skill prompts into messages
    for (let { skillName, skill, content } of skillPrompts) {
        logger.info(`[Agent: ${agentDefinition.agentType}] Preloaded skill '${skillName}'`);
        let metadataMessage = formatSkillLoadingMetadata(skillName, skill.progressMessage);
        messages.push(createUserMessage({
            content: [
                { type: "text", text: metadataMessage },
                ...content
            ]
        }));
    }
}

// Mapping: Y6→skills, NvY→resolveSkillByName
```

---

### Phase 8: MCP Client Assembly

```javascript
// ============================================
// agentLoopRunner - Phase 8: MCP Assembly
// Location: chunks.133.mjs:1698-1731
// ============================================

// ORIGINAL (for source lookup):
let {
    clients: H6,
    tools: J6,
    cleanup: K6
} = await fvY(A, K.options.mcpClients),
s = J6.length > 0 ? K0([...p, ...J6], "name") : p;

X6 = {
    isNonInteractiveSession: P ? K.options.isNonInteractiveSession : z ? !0 : K.options.isNonInteractiveSession ?? !1,
    // ... options
};

z6 = Bc6(K, {
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

// READABLE (for understanding):
// Step 1: Get MCP clients and tools
let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } =
    await assembleMcpClients(agentDefinition, toolUseContext.options.mcpClients);

// Step 2: Merge MCP tools with resolved tools
let allTools = mcpTools.length > 0
    ? deduplicateByName([...resolvedTools, ...mcpTools])
    : resolvedTools;

// Step 3: Build derived tool use context
let derivedOptions = {
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
    mcpClients,
    mcpResources: toolUseContext.options.mcpResources,
    agentDefinitions: toolUseContext.options.agentDefinitions,
    ...(useExactTools && { querySource })
};

// Step 4: Create derived context
let derivedContext = deriveToolUseContext(toolUseContext, {
    options: derivedOptions,
    agentId,
    agentType: agentDefinition.agentType,
    messages,
    readFileState,
    abortController,
    getAppState: getDerivedAppState,
    shareSetAppState: !isAsync,
    shareSetResponseLength: true,
    criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL
});

// Mapping: H6→mcpClients, J6→mcpTools, K6→mcpCleanup, s→allTools, z6→derivedContext
```

---

### Phase 9: LLM Message Loop

```javascript
// ============================================
// agentLoopRunner - Phase 9: LLM Loop Execution
// Location: chunks.133.mjs:1746-1779
// ============================================

// ORIGINAL (for source lookup):
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
                k(`[Agent: ${A.agentType}] Reached max turns limit`);
                break
            }
            yield $6;
            continue
        }
        if (TvY($6)) await dg([$6], L, N6).catch(...), N6 = $6.uuid, yield $6
    }
    if (r.signal.aborted) throw new oY;
    if (Qj(A) && A.callback) A.callback()
}

// READABLE (for understanding):
try {
    // Enter LLM message loop
    for await (let message of llmMessageLoop({
        messages,
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        toolUseContext: derivedContext,
        querySource,
        maxTurns: maxTurnsOverride ?? agentDefinition.maxTurns
    })) {
        // Progress callback
        onQueryProgress?.();

        // Handle stream events
        if (message.type === "stream_event" &&
            message.event.type === "message_start" &&
            message.ttftMs != null) {
            toolUseContext.pushApiMetricsEntry?.(message.ttftMs);
            continue;
        }

        // Handle attachments (like max_turns_reached)
        if (message.type === "attachment") {
            if (message.attachment.type === "max_turns_reached") {
                logger.info(`[Agent: ${agentDefinition.agentType}] Reached max turns limit`);
                break;
            }
            yield message;
            continue;
        }

        // Record and yield recordable messages
        if (isMessageRecordable(message)) {
            await recordSidechainTranscript([message], agentId, lastMessageUuid)
                .catch(err => logger.error(`Failed to record transcript: ${err}`));
            lastMessageUuid = message.uuid;
            yield message;
        }
    }

    // Check for abort
    if (abortController.signal.aborted) {
        throw new AgentAbortedError();
    }

    // Execute callback if defined
    if (isOneShotAgent(agentDefinition) && agentDefinition.callback) {
        agentDefinition.callback();
    }
}

// Mapping: Yh→llmMessageLoop, G→onQueryProgress, TvY→isMessageRecordable, dg→recordSidechainTranscript
```

**isMessageRecordable (TvY) Logic:**

```javascript
// ============================================
// isMessageRecordable - Filter for recording
// Location: chunks.133.mjs:1561-1563
// ============================================

// ORIGINAL (for source lookup):
function TvY(A) {
    return A.type === "assistant" || A.type === "user" || A.type === "progress" ||
           A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function isMessageRecordable(message) {
    return (
        message.type === "assistant" ||
        message.type === "user" ||
        message.type === "progress" ||
        (message.type === "system" && "subtype" in message && message.subtype === "compact_boundary")
    );
}

// Mapping: TvY→isMessageRecordable, A→message
```

---

### Phase 10: Cleanup

```javascript
// ============================================
// agentLoopRunner - Phase 10: Cleanup
// Location: chunks.133.mjs:1782-1785
// ============================================

// ORIGINAL (for source lookup):
} finally {
    if (await K6(), A.hooks) zZ6(N, L);
    z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
}

// READABLE (for understanding):
} finally {
    // Step 1: Cleanup MCP clients
    await mcpCleanup();

    // Step 2: Deregister agent hooks if registered
    if (agentDefinition.hooks) {
        deregisterAgentHooks(setAppState, agentId);
    }

    // Step 3: Clear state
    derivedContext.readFileState.clear();
    messages.length = 0;

    // Step 4: Clear agent-specific state
    clearAgentTranscriptBuffer(agentId);
    clearAgentHookContext(agentId);

    // Step 5: Kill bash tasks for this agent
    killBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
}

// Mapping: K6→mcpCleanup, zZ6→deregisterAgentHooks, a36→clearAgentTranscriptBuffer, Qx8→clearAgentHookContext, t24→killBashTasksForAgent
```

---

## Skill Resolution Algorithm

### resolveSkillByName (NvY)

```javascript
// ============================================
// resolveSkillByName - Resolve skill reference
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
    let z = `:${A}`,
        _ = q.find((w) => w.name.endsWith(z));
    if (_) return _.name;
    return null
}

// READABLE (for understanding):
function resolveSkillByName(skillName, skillRegistry, agentDefinition) {
    // Step 1: Check exact match
    if (skillExistsInRegistry(skillName, skillRegistry)) {
        return skillName;
    }

    // Step 2: Try agent-type-prefixed name (e.g., "Explore:skillName")
    let agentTypePrefix = agentDefinition.agentType.split(":")[0];
    if (agentTypePrefix) {
        let prefixedName = `${agentTypePrefix}:${skillName}`;
        if (skillExistsInRegistry(prefixedName, skillRegistry)) {
            return prefixedName;
        }
    }

    // Step 3: Try suffix match (e.g., ":skillName")
    let suffixPattern = `:${skillName}`;
    let matchingSkill = skillRegistry.find(skill => skill.name.endsWith(suffixPattern));
    if (matchingSkill) {
        return matchingSkill.name;
    }

    return null;
}

// Mapping: NvY→resolveSkillByName, rY6→skillExistsInRegistry, q→skillRegistry
```

**Resolution Priority:**
1. **Exact match** - `skillName` directly in registry
2. **Agent-prefixed match** - `{agentType}:{skillName}`
3. **Suffix match** - Any skill ending with `:{skillName}`
4. **Not found** - Returns `null`

---

## Abort Signal Architecture

### Multi-Level Abort Handling

The agent loop implements a sophisticated abort signal architecture that propagates cancellation across nested execution boundaries.

```javascript
// ============================================
// agentLoopRunner - Abort Controller Resolution
// Location: chunks.133.mjs:1634
// ============================================

// ORIGINAL (for source lookup):
r = $?.abortController ? $.abortController : z ? new AbortController : K.abortController

// READABLE (for understanding):
let abortController = override?.abortController
    ? override.abortController
    : isAsync
        ? new AbortController()  // Background agents get their own controller
        : toolUseContext.abortController;  // Foreground agents inherit parent

// Mapping: r→abortController, $→override, z→isAsync, K→toolUseContext
```

**Why Different Controllers?**

| Scenario | Controller Source | Rationale |
|----------|-------------------|-----------|
| Override provided | `override.abortController` | Explicit control from caller |
| Background agent (`isAsync=true`) | New `AbortController()` | Independent lifecycle, won't kill parent on abort |
| Foreground agent | `toolUseContext.abortController` | Shared with parent, abort cascades |

### Abort Propagation Flow

```
Parent Session AbortController
    │
    ├─→ Foreground Subagent (inherits parent controller)
    │       └─→ Abort immediately kills subagent
    │
    └─→ Background Subagent (new controller)
            │
            ├─→ Parent abort NOT propagated automatically
            │
            └─→ Task cleanup handles orphaned background agents
```

### Abort Detection in LLM Loop

```javascript
// ============================================
// agentLoopRunner - Abort Detection
// Location: chunks.133.mjs:1780
// ============================================

// ORIGINAL (for source lookup):
if (r.signal.aborted) throw new oY;

// READABLE (for understanding):
if (abortController.signal.aborted) {
    throw new AgentAbortedError();
}

// Mapping: r→abortController, oY→AgentAbortedError
```

**Key Insight:** The abort check happens AFTER the LLM loop completes naturally. This means:
1. An abort during streaming will cause the loop to exit via the `signal.aborted` check in `Yh` (llmMessageLoop)
2. An abort between turns is caught at the top of the next iteration
3. The `finally` block always runs, ensuring cleanup

---

## Progress Update Integration

### The nl4 Function - Progress with Telemetry

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
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
function updateTaskProgressWithTelemetry(taskId, summary, appState) {
    let previousProgress = null;

    // Atomically update task state
    atomicUpdateTask(taskId, appState, (task) => {
        if (task.status !== "running") return task;

        // Capture previous progress for telemetry
        previousProgress = {
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

    // Emit telemetry if update succeeded and telemetry is enabled
    if (previousProgress && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = previousProgress;

        emitTelemetryEvent({
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

// Mapping: nl4→updateTaskProgressWithTelemetry, i9→atomicUpdateTask,
//          Nn→isTelemetryEnabled, c36→emitTelemetryEvent
```

**When nl4 is Called:**

The `nl4` function is called from the agent summarization system in `chunks.134.mjs:891`:

```javascript
// ============================================
// Agent Summary Integration
// Location: chunks.134.mjs:886-893
// ============================================

// ORIGINAL (for source lookup):
let f = G.message.content.find((v) => v.type === "text");
if (f?.type === "text" && f.text.trim()) {
    let v = f.text.trim();
    k(`[AgentSummary] Summary result for ${A}: ${v}`), H = v, nl4(A, v, Y);
    break
}

// READABLE (for understanding):
let textBlock = message.message.content.find((block) => block.type === "text");
if (textBlock?.type === "text" && textBlock.text.trim()) {
    let summary = textBlock.text.trim();
    logger.info(`[AgentSummary] Summary result for ${taskId}: ${summary}`);
    finalSummary = summary;
    updateTaskProgressWithTelemetry(taskId, summary, appState);
    break;
}

// Mapping: f→textBlock, v→summary, A→taskId, H→finalSummary, Y→appState
```

### Summarization Trigger Mechanism

The summarization system runs on a 30-second interval (`tvY = 30000`) and generates progress summaries for running background agents:

```javascript
// ============================================
// Summarization Timer Constant
// Location: chunks.134.mjs:916
// ============================================

// ORIGINAL (for source lookup):
tvY = 30000

// READABLE (for understanding):
const SUMMARIZATION_INTERVAL_MS = 30000; // 30 seconds

// Mapping: tvY→SUMMARIZATION_INTERVAL_MS
```

---

## Token Counting Flow

### Multi-Agent Token Aggregation

For swarm/teammate scenarios, tokens are aggregated across all running agents:

```javascript
// ============================================
// Token Aggregation for Swarm View
// Location: chunks.113.mjs:1918
// ============================================

// ORIGINAL (for source lookup):
if (O6.progress?.tokenCount) K6 += O6.progress.tokenCount

// READABLE (for understanding):
if (agent.progress?.tokenCount) {
    totalTokenCount += agent.progress.tokenCount;
}

// Mapping: O6→agent, K6→totalTokenCount
```

### Per-Turn Token Extraction

```javascript
// ============================================
// Token Extraction from API Response
// Location: chunks.134.mjs:287-290
// ============================================

// ORIGINAL (for source lookup):
outputTokens: A.usage.output_tokens,
cacheReadInputTokens: A.usage.cache_read_input_tokens ?? 0,
cacheCreationInputTokens: A.usage.cache_creation_input_tokens ?? 0

// READABLE (for understanding):
let usage = {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cacheReadInputTokens: response.usage.cache_read_input_tokens ?? 0,
    cacheCreationInputTokens: response.usage.cache_creation_input_tokens ?? 0
};

// Mapping: A→response
```

### Token Accumulation Strategy

```javascript
// ============================================
// Token Accumulation Across Turns
// Location: chunks.134.mjs:297-304
// ============================================

// ORIGINAL (for source lookup):
function lvY(A, q) {
    return {
        inputTokens: A.inputTokens + q.inputTokens,
        outputTokens: A.outputTokens + q.outputTokens,
        cacheReadInputTokens: A.cacheReadInputTokens + q.cacheReadInputTokens,
        cacheCreationInputTokens: A.cacheCreationInputTokens + q.cacheCreationInputTokens
    }
}

// READABLE (for understanding):
function accumulateTokenUsage(accumulated, newUsage) {
    return {
        inputTokens: accumulated.inputTokens + newUsage.inputTokens,
        outputTokens: accumulated.outputTokens + newUsage.outputTokens,
        cacheReadInputTokens: accumulated.cacheReadInputTokens + newUsage.cacheReadInputTokens,
        cacheCreationInputTokens: accumulated.cacheCreationInputTokens + newUsage.cacheCreationInputTokens
    };
}

// Mapping: lvY→accumulateTokenUsage, A→accumulated, q→newUsage
```

**Key Insight:** Token counts are tracked separately for:
- **Input tokens** - Prompts and context
- **Output tokens** - Generated responses
- **Cache read tokens** - Tokens served from prompt cache (discounted cost)
- **Cache creation tokens** - Tokens written to prompt cache (one-time cost)

This separation enables accurate cost tracking and cache efficiency analysis.

---

## Turn-by-Turn Execution Flow

### Complete LLM Loop Iteration

```javascript
// ============================================
// Yh - LLM Message Loop (Conceptual)
// Location: chunks.133.mjs:1747-1779
// ============================================

// READABLE (for understanding):
async function* llmMessageLoop({
    messages,
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext,
    querySource,
    maxTurns
}) {
    let turnCount = 0;

    while (turnCount < maxTurns) {
        // Step 1: Build API request
        let apiRequest = buildApiRequest({
            messages,
            systemPrompt,
            userContext,
            systemContext,
            tools: toolUseContext.options.tools
        });

        // Step 2: Stream API response
        for await (let event of streamApiCompletion(apiRequest)) {
            // Handle different event types
            if (event.type === "message_start") {
                yield {
                    type: "stream_event",
                    event,
                    ttftMs: event.message.usage?.total_tokens
                };
            }
            else if (event.type === "content_block_delta") {
                // Stream text to UI
                yield { type: "text_delta", delta: event.delta };
            }
            else if (event.type === "message_stop") {
                // Complete message received
                let message = assembleMessage(event);
                messages.push(message);
                turnCount++;

                // Check for tool uses
                let toolUses = message.content.filter(b => b.type === "tool_use");

                if (toolUses.length > 0) {
                    // Execute tools and yield results
                    for (let toolUse of toolUses) {
                        let result = await canUseTool(toolUse, toolUseContext);
                        yield result;
                    }
                } else {
                    // No tools - end turn
                    yield { type: "assistant", message };
                }
            }
        }

        // Check for max turns
        if (turnCount >= maxTurns) {
            yield {
                type: "attachment",
                attachment: { type: "max_turns_reached", maxTurns }
            };
            break;
        }
    }
}
```

### Message Recording Flow

```javascript
// ============================================
// Message Recording During Loop
// Location: chunks.133.mjs:1778
// ============================================

// ORIGINAL (for source lookup):
if (TvY($6)) await dg([$6], L, N6).catch((n) => k(`Failed to record sidechain transcript: ${n}`)), N6 = $6.uuid, yield $6

// READABLE (for understanding):
if (isMessageRecordable(message)) {
    // Record to sidechain transcript (for debugging/resume)
    await recordSidechainTranscript([message], agentId, lastMessageUuid)
        .catch(err => logger.error(`Failed to record transcript: ${err}`));

    lastMessageUuid = message.uuid;
    yield message;
}

// Mapping: TvY→isMessageRecordable, $6→message, dg→recordSidechainTranscript,
//          L→agentId, N6→lastMessageUuid
```

### isMessageRecordable Filter Logic

```javascript
// ============================================
// TvY - isMessageRecordable
// Location: chunks.133.mjs:1561-1563
// ============================================

// ORIGINAL (for source lookup):
function TvY(A) {
    return A.type === "assistant" || A.type === "user" || A.type === "progress" ||
           A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function isMessageRecordable(message) {
    return (
        message.type === "assistant" ||      // LLM responses
        message.type === "user" ||           // User messages
        message.type === "progress" ||       // Progress updates
        (message.type === "system" &&        // Compact boundaries
         "subtype" in message &&
         message.subtype === "compact_boundary")
    );
}

// Mapping: TvY→isMessageRecordable, A→message
```

**Why These Types?**

| Message Type | Why Recorded | Use Case |
|--------------|--------------|----------|
| `assistant` | LLM responses | Conversation history, resume |
| `user` | User inputs | Conversation history |
| `progress` | Tool execution progress | Debugging, status tracking |
| `system:compact_boundary` | Compaction markers | State transitions |

**Not Recorded:**
- `attachment` - Meta-messages for LLM context, not persistent
- `stream_event` - Transient streaming data
- Tool results (embedded in next user message)

---

## Error Handling & Recovery

### Abort Handling

The agent loop uses `AbortController` for cancellation:

1. **Parent abort** - Propagates from parent session
2. **Background abort** - New controller for background agents
3. **Cleanup on abort** - Triggers finally block

### Transcript Recording Errors

Transcript recording errors are caught and logged but don't fail the agent:

```javascript
await recordSidechainTranscript([message], agentId, lastMessageUuid)
    .catch(err => logger.error(`Failed to record transcript: ${err}`));
```

---

## Summary: Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Async Generator | Streaming, cancellable, memory-efficient |
| Fork Context Filtering | API compatibility, context hygiene |
| Permission Context Derivation | Flexible inheritance with agent overrides |
| Three-Layer Tool Filtering | Security + flexibility + composition |
| Hook Execution | Extensibility without code modification |
| AbortController Propagation | Clean cancellation across async boundaries |
| Transcript Sidechain | Debugging + resume capability |
| MCP Tool Merging | Consistent tool interface across contexts |
| Separate Abort Controllers | Background agent independence |
| Progress Telemetry Integration | Visibility into background tasks |
| Token Aggregation | Swarm-wide resource tracking |

---

## Related Documents

- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Detailed execution flow
- [tools_integration.md](./tools_integration.md) - Tool filtering details
- [feature_interconnections.md](./feature_interconnections.md) - Cross-module integration
- [../26_background_agents/progress_tracking_source_restored.md](../26_background_agents/progress_tracking_source_restored.md) - Progress tracking details