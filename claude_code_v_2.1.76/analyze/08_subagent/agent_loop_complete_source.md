# Agent Loop Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level analysis of the `agentLoopRunner` (qh) async generator and all related functions that drive subagent execution.

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

## Overview

The agent loop is the core execution engine for all subagents in Claude Code. It's implemented as an **async generator function** that:

1. Sets up an isolated execution context
2. Assembles tools, system prompt, and permissions
3. Executes the LLM message loop with streaming
4. Handles progress reporting, hooks, and cleanup

---

## Complete Source Code: agentLoopRunner (qh)

### Function Signature

```javascript
// ============================================
// agentLoopRunner - Core async generator for agent execution
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
})

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,           // Agent type definition with model, tools, prompts
    promptMessages,            // Initial messages to send to the agent
    toolUseContext,            // Context for tool execution (app state, etc.)
    canUseTool,                // Function to check if tool can be used
    isAsync,                   // Whether running in background mode
    canShowPermissionPrompts,  // Whether to show permission dialogs
    forkContextMessages,       // Messages from parent context (for teammates)
    querySource,               // Source of the query (for telemetry)
    override,                  // Override options (agentId, systemPrompt, etc.)
    model,                     // Model override parameter
    maxTurns,                  // Maximum turns limit
    preserveToolUseResults,    // Keep tool results in context
    availableTools,            // Pre-filtered tool list
    allowedTools,              // Additional allowed tools
    onCacheSafeParams,         // Callback when cache-safe params are ready
    useExactTools,             // Use exact tool list without filtering
    worktreePath,              // Path for worktree isolation
    transcriptSubdir,          // Directory for transcript storage
    onQueryProgress           // Progress callback
})

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext,
//          Y→canUseTool, z→isAsync, _→canShowPermissionPrompts, w→forkContextMessages,
//          O→querySource, $→override, H→model, j→maxTurns, J→preserveToolUseResults,
//          M→availableTools, D→allowedTools, X→onCacheSafeParams, P→useExactTools,
//          W→worktreePath, Z→transcriptSubdir, G→onQueryProgress
```

---

## Phase 1: Identity Binding & Model Resolution

### Algorithm

**What it does:** Establishes the agent's identity, resolves the model to use, and sets up telemetry tracking.

**How it works:**
1. Gets current app state and permission mode
2. Resolves model using priority chain: agent definition → main loop model → override
3. Generates unique agent ID or uses override
4. Registers transcript directory if specified
5. Registers telemetry if enabled

### Source Code

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

// Mapping: f→appState, v→permissionMode, N→setAppState, V→resolvedModel, L→agentId,
//          C01→resolveModel, bI→generateAgentId, px8→setTranscriptDirectory,
//          qc→isTelemetryEnabled, R1→getSessionId, R01→registerAgentTelemetry
```

**Key Decision - Model Priority Chain:**

The model resolution uses a specific priority order:
1. **Agent definition model** (frontmatter `model:`)
2. **Main loop model** (session default)
3. **Override parameter** (per-invocation `model:` parameter)
4. **Permission mode consideration** (some modes restrict model access)

This ensures flexibility while respecting permission boundaries.

---

## Phase 2: Fork Context Building

### Algorithm

**What it does:** Merges fork context (for teammates) with prompt messages, and clones or creates read file state for compact tracking.

### Source Code

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

// Mapping: R→messages, u→readFileState, I→userContext, g→systemContext,
//          w→forkContextMessages, Fx8→cloneForkContext, DI→cloneReadFileState,
//          yd→createEmptyReadFileState, Ed→emptyReadFileStateTemplate,
//          a2→getUserContext, mw→getSystemContext
```

---

## Phase 3: Permission Context Derivation

### Algorithm

**What it does:** Creates a derived app state function that computes the appropriate permission context for the subagent, considering:
- Agent's defined permission mode
- Whether to avoid permission prompts
- Allowed tools list
- Effort level

### Source Code

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
    // Logic: if canShowPermissionPrompts is explicitly set, use its inverse
    // Otherwise: bubble mode → false, async → true
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

    // Step 6: Return derived state (reuse original if unchanged)
    if (permissionContext === currentAppState.toolPermissionContext && effort === currentAppState.effortValue) {
        return currentAppState;
    }
    return {
        ...currentAppState,
        toolPermissionContext: permissionContext,
        effortValue: effort
    };
};

// Mapping: B→definedPermissionMode, b→getDerivedAppState, n→permissionContext,
//          o→shouldAvoidPrompts, D→allowedTools, a→effort
```

**Why This Matters:**

1. **Bypass modes protection** - Even if an agent requests a permission mode, bypass/acceptEdits/auto modes are preserved
2. **Smart prompt avoidance** - Async agents avoid prompts; bubble mode explicitly allows them
3. **Tool allowlist** - Per-invocation allowed tools are merged with CLI rules
4. **Effort propagation** - Agent's effort level affects all tool usage

---

## Phase 4: Tool Assembly

### Algorithm

**What it does:** Assembles the tool set for the subagent, either using exact tools or filtering based on agent type.

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 4: Tool Assembly
// Location: chunks.133.mjs:1631
// ============================================

// ORIGINAL (for source lookup):
p = P ? M : _c(A, M, z).resolvedTools

// READABLE (for understanding):
let tools = useExactTools
    ? availableTools
    : filterToolsForSubagent(agentDefinition, availableTools, isAsync).resolvedTools;

// Mapping: p→tools, P→useExactTools, M→availableTools, _c→filterToolsForSubagent
```

---

## Phase 5: System Prompt Building

### Algorithm

**What it does:** Builds the system prompt for the subagent, using either override or agent definition.

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 5: System Prompt
// Location: chunks.133.mjs:1632-1633
// ============================================

// ORIGINAL (for source lookup):
let Q = Array.from(f.toolPermissionContext.additionalWorkingDirectories.keys()),
    U = $?.systemPrompt ? $.systemPrompt : uq(await vvY(A, K, V, Q));

// READABLE (for understanding):
let additionalWorkingDirs = Array.from(
    appState.toolPermissionContext.additionalWorkingDirectories.keys()
);

let systemPrompt = override?.systemPrompt
    ? override.systemPrompt
    : await buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, additionalWorkingDirs);

// Mapping: Q→additionalWorkingDirs, U→systemPrompt, uq→buildSystemPromptContent,
//          vvY→buildAgentSystemPrompt
```

---

## Phase 6: Abort Controller Setup

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 6: Abort Controller
// Location: chunks.133.mjs:1634
// ============================================

// ORIGINAL (for source lookup):
let r = $?.abortController ? $.abortController : z ? new AbortController : K.abortController

// READABLE (for understanding):
let abortController = override?.abortController
    ? override.abortController
    : isAsync
        ? new AbortController()  // New controller for background agents
        : toolUseContext.abortController;  // Shared with parent for sync

// Mapping: r→abortController
```

**Key Insight:** Background agents get their own AbortController for independent lifecycle, while sync agents share with the parent session.

---

## Phase 7: Hook Registration & Skill Loading

### Algorithm

**What it does:**
1. Collects additional contexts from hook events
2. Registers agent hooks if defined
3. Preloads skills specified in agent definition

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 7: Hooks & Skills
// Location: chunks.133.mjs:1635-1697
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
    // ... skill loading continues
}

// READABLE (for understanding):
// Step 1: Collect additional contexts from SubagentStart hook
let additionalContexts = [];
for await (let event of emitSubagentStartEvents(agentId, agentDefinition.agentType, abortController.signal)) {
    if (event.additionalContexts && event.additionalContexts.length > 0) {
        additionalContexts.push(...event.additionalContexts);
    }
}

// Step 2: Add hook contexts as user message
if (additionalContexts.length > 0) {
    let contextMessage = createAttachmentMessage({
        type: "hook_additional_context",
        content: additionalContexts,
        hookName: "SubagentStart",
        toolUseID: generateToolUseId(),
        hookEvent: "SubagentStart"
    });
    messages.push(contextMessage);
}

// Step 3: Register agent hooks
if (agentDefinition.hooks) {
    registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
}

// Step 4: Load skills from agent definition
let skills = agentDefinition.skills ?? [];
if (skills.length > 0) {
    let skillRegistry = await loadSkillRegistry();
    let loadedSkills = [];

    for (let skillName of skills) {
        // Resolve skill name (may be prefixed with agent type)
        let resolvedName = resolveSkillByName(skillName, skillRegistry, agentDefinition);
        if (!resolvedName) {
            logger.warn(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' not found`);
            continue;
        }

        let skill = getSkill(resolvedName, skillRegistry);
        if (skill.type !== "prompt") {
            logger.warn(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' is not prompt-based`);
            continue;
        }

        loadedSkills.push({ skillName, skill });
    }

    // Load skill prompts into context
    for (let { skillName, skill } of loadedSkills) {
        logger.log(`[Agent: ${agentDefinition.agentType}] Preloaded skill '${skillName}'`);
        let content = await skill.getPromptForCommand("", toolUseContext);
        let metadata = formatSkillLoadingMetadata(skillName, skill.progressMessage);
        messages.push(createUserMessage({
            content: [
                { type: "text", text: metadata },
                ...content
            ]
        }));
    }
}

// Mapping: e→additionalContexts, Ux8→emitSubagentStartEvents, f4→createAttachmentMessage,
//          GvY→generateToolUseId, r24→registerAgentHooks, Y6→skills, NR→loadSkillRegistry,
//          qY→getSkillRegistryPath, NvY→resolveSkillByName, kf6→getSkill
```

---

## Phase 8: MCP Client Assembly

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 8: MCP Clients
// Location: chunks.133.mjs:1698-1702
// ============================================

// ORIGINAL (for source lookup):
let {
    clients: H6,
    tools: J6,
    cleanup: K6
} = await fvY(A, K.options.mcpClients);

let s = J6.length > 0 ? K0([...p, ...J6], "name") : p;

// READABLE (for understanding):
let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } =
    await loadAgentMcpClients(agentDefinition, toolUseContext.options.mcpClients);

let finalTools = mcpTools.length > 0
    ? mergeToolsByName([...tools, ...mcpTools])
    : tools;

// Mapping: H6→mcpClients, J6→mcpTools, K6→mcpCleanup, fvY→loadAgentMcpClients,
//          s→finalTools, K0→mergeToolsByName
```

---

## Phase 9: Tool Use Context Creation

### Algorithm

**What it does:** Creates the complete tool use context for the subagent with all derived settings.

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 9: Tool Use Context
// Location: chunks.133.mjs:1703-1731
// ============================================

// ORIGINAL (for source lookup):
let X6 = {
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
};

let z6 = Bc6(K, {
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

// READABLE (for understanding):
let subagentOptions = {
    isNonInteractiveSession: useExactTools
        ? toolUseContext.options.isNonInteractiveSession
        : isAsync
            ? true  // Background agents are always non-interactive
            : toolUseContext.options.isNonInteractiveSession ?? false,
    appendSystemPrompt: toolUseContext.options.appendSystemPrompt,
    tools: finalTools,
    commands: [],
    debug: toolUseContext.options.debug,
    verbose: toolUseContext.options.verbose,
    mainLoopModel: resolvedModel,
    thinkingConfig: useExactTools
        ? toolUseContext.options.thinkingConfig
        : { type: "disabled" },  // Background agents don't use thinking
    mcpClients: mcpClients,
    mcpResources: toolUseContext.options.mcpResources,
    agentDefinitions: toolUseContext.options.agentDefinitions,
    ...(useExactTools && { querySource: querySource })
};

let subagentToolUseContext = deriveToolUseContext(toolUseContext, {
    options: subagentOptions,
    agentId: agentId,
    agentType: agentDefinition.agentType,
    messages: messages,
    readFileState: readFileState,
    abortController: abortController,
    getAppState: getDerivedAppState,
    shareSetAppState: !isAsync,  // Share state only for sync agents
    shareSetResponseLength: true,
    criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL
});

if (preserveToolUseResults) {
    subagentToolUseContext.preserveToolUseResults = true;
}

// Mapping: X6→subagentOptions, z6→subagentToolUseContext, Bc6→deriveToolUseContext
```

**Key Decision Points:**
1. **Non-interactive for async** - Background agents cannot show interactive prompts
2. **Thinking disabled for async** - Background agents don't use extended thinking
3. **State sharing** - Only sync agents share app state with parent

---

## Phase 10: Main Execution Loop

### Algorithm

**What it does:** Executes the LLM message loop and yields messages to the caller.

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 10: Main Loop
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
                k(`[Agent: ${A.agentType}] Reached max turns limit (${message.attachment.maxTurns})`);
                break
            }
            yield $6;
            continue
        }
        if (TvY($6)) {
            await dg([$6], L, N6).catch((n) => k(`Failed to record sidechain transcript: ${n}`));
            N6 = $6.uuid;
            yield $6
        }
    }
    if (r.signal.aborted) throw new oY;
    if (Qj(A) && A.callback) A.callback()
} finally {
    // Cleanup phase
}

// READABLE (for understanding):
try {
    for await (let message of llmMessageLoop({
        messages: messages,
        systemPrompt: systemPrompt,
        userContext: userContext,
        systemContext: systemContext,
        canUseTool: canUseTool,
        toolUseContext: subagentToolUseContext,
        querySource: querySource,
        maxTurns: maxTurns ?? agentDefinition.maxTurns
    })) {
        // Progress callback
        onQueryProgress?.();

        // Handle TTFT metrics
        if (message.type === "stream_event" &&
            message.event.type === "message_start" &&
            message.ttftMs != null) {
            toolUseContext.pushApiMetricsEntry?.(message.ttftMs);
            continue;
        }

        // Handle attachments (including max_turns_reached)
        if (message.type === "attachment") {
            if (message.attachment.type === "max_turns_reached") {
                logger.log(`[Agent: ${agentDefinition.agentType}] Reached max turns limit (${message.attachment.maxTurns})`);
                break;
            }
            yield message;
            continue;
        }

        // Record and yield recordable messages
        if (isMessageRecordable(message)) {
            await recordSidechainTranscript([message], agentId, lastMessageUuid)
                .catch(err => logger.error(`Failed to record sidechain transcript: ${err}`));
            lastMessageUuid = message.uuid;
            yield message;
        }
    }

    // Check for abort
    if (abortController.signal.aborted) {
        throw new AbortError();
    }

    // Execute callback if defined
    if (isCallbackAgent(agentDefinition) && agentDefinition.callback) {
        agentDefinition.callback();
    }
}

// Mapping: Yh→llmMessageLoop, G→onQueryProgress, TvY→isMessageRecordable,
//          dg→recordSidechainTranscript, N6→lastMessageUuid, oY→AbortError
```

---

## Phase 11: Cleanup

### Source Code

```javascript
// ============================================
// agentLoopRunner - Phase 11: Cleanup
// Location: chunks.133.mjs:1782-1785
// ============================================

// ORIGINAL (for source lookup):
finally {
    if (await K6(), A.hooks) zZ6(N, L);
    z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
}

// READABLE (for understanding):
finally {
    // Cleanup MCP clients
    await mcpCleanup();

    // Deregister agent hooks
    if (agentDefinition.hooks) {
        deregisterAgentHooks(setAppState, agentId);
    }

    // Clear state
    subagentToolUseContext.readFileState.clear();
    messages.length = 0;  // Free memory

    // Cleanup agent tracking
    cleanupAgentTranscript(agentId);
    cleanupAgentMetadata(agentId);
    cleanupBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
}

// Mapping: K6→mcpCleanup, zZ6→deregisterAgentHooks, a36→cleanupAgentTranscript,
//          Qx8→cleanupAgentMetadata, t24→cleanupBashTasksForAgent
```

---

## Helper Functions

### isMessageRecordable (TvY)

```javascript
// ============================================
// isMessageRecordable - Filter for recordable message types
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

### cloneForkContext (Fx8)

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

### buildAgentSystemPrompt (vvY)

```javascript
// ============================================
// buildAgentSystemPrompt - Build system prompt for agent
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
        let promptSections = [agentDefinition.getSystemPrompt({
            toolUseContext: toolUseContext
        })];
        return await assembleSystemPrompt(promptSections, model, additionalWorkingDirs);
    } catch (error) {
        // Fallback to default prompt on error
        return await assembleSystemPrompt([DEFAULT_SYSTEM_PROMPT], model, additionalWorkingDirs);
    }
}

// Mapping: vvY→buildAgentSystemPrompt, A→agentDefinition, q→toolUseContext,
//          K→model, Y→additionalWorkingDirs, mc6→assembleSystemPrompt, Al4→DEFAULT_SYSTEM_PROMPT
```

### resolveSkillByName (NvY)

```javascript
// ============================================
// resolveSkillByName - Resolve skill reference by name
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
    // Step 1: Try exact match
    if (isSkillInRegistry(skillName, skillRegistry)) {
        return skillName;
    }

    // Step 2: Try prefixed match with agent type
    let agentPrefix = agentDefinition.agentType.split(":")[0];
    if (agentPrefix) {
        let prefixedName = `${agentPrefix}:${skillName}`;
        if (isSkillInRegistry(prefixedName, skillRegistry)) {
            return prefixedName;
        }
    }

    // Step 3: Try suffix match (any agent:type:skill pattern)
    let suffix = `:${skillName}`;
    let matchingSkill = skillRegistry.find((skill) => skill.name.endsWith(suffix));
    if (matchingSkill) {
        return matchingSkill.name;
    }

    return null;
}

// Mapping: NvY→resolveSkillByName, A→skillName, q→skillRegistry, K→agentDefinition,
//          rY6→isSkillInRegistry, Y→agentPrefix, w→prefixedName, z→suffix
```

---

## State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Agent Loop State Machine                              │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌──────────────┐
                        │   Created    │
                        │              │
                        └──────┬───────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │ Identity  │  │  Fork     │  │ Permission│
        │ Binding   │  │  Context  │  │  Context  │
        └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ Tool Assembly │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ System Prompt │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ Hooks & Skills│
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │  MCP Clients  │
                     └───────┬───────┘
                             │
                             ▼
                ┌────────────────────────┐
                │   Main Execution Loop   │
                │   (llmMessageLoop)      │
                │   ┌──────────────────┐  │
                │   │ Yield Messages   │◄──┼── Stream to caller
                │   └──────────────────┘  │
                │   ┌──────────────────┐  │
                │   │ Process Tools    │  │
                │   └──────────────────┘  │
                └────────────┬───────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │   Cleanup     │
                     │   - MCP       │
                     │   - Hooks     │
                     │   - State     │
                     └───────────────┘
```

---

## Cross-Feature Integration

### System Reminder Integration
- Progress attachments generated during execution
- Max turns reached attachment
- Hook additional context attachments

### Hooks Integration
- SubagentStart event emits additional contexts
- Agent hooks registered for PreToolUse/PostToolUse
- Cleanup deregisters hooks on completion

### Compact Integration
- Read file state tracks all file reads
- Compact boundary messages recorded
- Fork context filtered for orphaned results

### Telemetry Integration
- Agent registration on start
- TTFT metrics pushed to parent
- Query source tracking

---

## Performance Considerations

### Memory Efficiency
1. Messages cleared after loop completes
2. Read file state cleared in cleanup
3. Generator pattern avoids accumulation

### Concurrency
1. MCP clients loaded in parallel
2. User/system context fetched concurrently
3. Skill prompts loaded in parallel

### Streaming
1. Async generator yields messages immediately
2. No buffering of complete response
3. Real-time UI updates possible