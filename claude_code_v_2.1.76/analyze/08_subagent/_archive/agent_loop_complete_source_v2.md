# Agent Loop Complete Source (Claude Code 2.1.76)

> Complete source-level documentation for the agent loop runner with dual-version format.
> Cross-validated against source code on 2026-03-27.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `agentLoopRunner` (qh) - Core async generator for agent execution — `chunks.133.mjs:1565`
- `isMessageRecordable` (TvY) - Check if message should be recorded — `chunks.133.mjs:1561`
- `cloneForkContext` (Fx8) - Clone context for subagent isolation — `chunks.133.mjs:1788`
- `buildAgentSystemPrompt` (vvY) - Build system prompt for agent — `chunks.133.mjs:1806`
- `resolveSkillByName` (NvY) - Resolve skill by name — `chunks.133.mjs:1817`

---

## Core Algorithm: Agent Loop Runner (qh)

### What It Does

The agent loop runner (`qh`) is the central execution engine for all subagents. It:
1. Initializes the agent context with forked messages
2. Builds the system prompt with agent-specific instructions
3. Registers hooks and preloads skills
4. Attaches MCP clients and tools
5. Executes the LLM message loop
6. Handles streaming events and attachments
7. Cleans up resources on completion/abort

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Agent Loop Runner (qh)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. INITIALIZATION                                                           │
│     ├─ Get app state and permission context                                  │
│     ├─ Resolve model (agent def → options → override)                       │
│     ├─ Generate unique agent ID                                              │
│     └─ Clone fork context messages (Fx8)                                     │
│                                                                              │
│  2. CONTEXT BUILDING                                                         │
│     ├─ Build permission context function (b)                                │
│     ├─ Filter tools for subagent (_c)                                       │
│     ├─ Build system prompt (vvY)                                            │
│     └─ Create AbortController                                                │
│                                                                              │
│  3. HOOKS & SKILLS                                                           │
│     ├─ Register agent hooks (r24)                                           │
│     ├─ Resolve skills by name (NvY)                                         │
│     └─ Preload skill prompts into messages                                   │
│                                                                              │
│  4. MCP INTEGRATION                                                          │
│     ├─ Get MCP clients and tools (fvY)                                      │
│     ├─ Merge with resolved tools                                            │
│     └─ Build tool use context (Bc6)                                         │
│                                                                              │
│  5. EXECUTION LOOP                                                           │
│     ├─ for await (message of Yh(messages, systemPrompt, ...))               │
│     ├─ Handle stream events (ttft, attachments)                             │
│     ├─ Yield recordable messages (TvY)                                      │
│     └─ Record to sidechain transcript (dg)                                  │
│                                                                              │
│  6. CLEANUP (finally)                                                        │
│     ├─ Cleanup MCP clients (K6)                                             │
│     ├─ Deregister hooks (zZ6)                                               │
│     ├─ Clear read file state                                                │
│     └─ Kill bash tasks for agent (t24)                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

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
            if (B && $6.toolPermissionContext.mode !== "bypassPermissions" && $6.toolPermissionContext.mode !== "acceptEdits" && $6.toolPermissionContext.mode !== "auto") n = {
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
    for await (let $6 of Ux8(L, A.agentType, r.signal)) if ($6.additionalContexts && $6.additionalContexts.length > 0) e.push(...$6.additionalContexts);
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
    // ... skill loading and MCP client setup ...
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
            if (TvY($6)) await dg([$6], L, N6).catch((n) => k(`Failed to record sidechain transcript: ${n}`)), N6 = $6.uuid, yield $6
        }
        if (r.signal.aborted) throw new oY;
        if (Qj(A) && A.callback) A.callback()
    } finally {
        if (await K6(), A.hooks) zZ6(N, L);
        z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
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
    // ========================================
    // PHASE 1: INITIALIZATION
    // ========================================
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Resolve model: agent definition → options → override parameter
    let resolvedModel = resolveModel(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );

    // Generate or use provided agent ID
    let agentId = override?.agentId ? override.agentId : generateAgentId();

    // Set transcript subdirectory if provided
    if (transcriptSubdir) {
        setTranscriptSubdir(agentId, transcriptSubdir);
    }

    // Record telemetry for subagent start (if enabled)
    if (isTelemetryEnabled()) {
        let parentAgentId = toolUseContext.agentId ?? getParentAgentId();
        recordTelemetry(agentId, agentDefinition.agentType, parentAgentId);
    }

    // ========================================
    // PHASE 2: CONTEXT BUILDING
    // ========================================

    // Clone fork context messages (filters orphaned tool results)
    let messages = [
        ...forkContextMessages ? cloneForkContext(forkContextMessages) : [],
        ...promptMessages
    ];

    // Clone or create read file state for tracking already-read files
    let readFileState = forkContextMessages !== undefined
        ? cloneReadFileState(toolUseContext.readFileState)
        : createEmptyReadFileState();

    // Get user and system context
    let [userContext, systemContext] = await Promise.all([
        override?.userContext ?? getUserContext(),
        override?.systemContext ?? getSystemContext()
    ]);

    // Build permission context getter function
    let agentPermissionMode = agentDefinition.permissionMode;
    let getPermissionContext = () => {
        let state = toolUseContext.getAppState();
        let permContext = state.toolPermissionContext;

        // Apply agent-specific permission mode if set
        if (agentPermissionMode &&
            !["bypassPermissions", "acceptEdits", "auto"].includes(state.toolPermissionContext.mode)) {
            permContext = { ...permContext, mode: agentPermissionMode };
        }

        // Determine if permission prompts should be avoided
        let avoidPrompts = canShowPermissionPrompts !== undefined
            ? !canShowPermissionPrompts
            : agentPermissionMode === "bubble" ? false : isAsync;

        if (avoidPrompts) {
            permContext = { ...permContext, shouldAvoidPermissionPrompts: true };
        }

        // For async agents, await automated checks before dialog
        if (isAsync && !avoidPrompts) {
            permContext = { ...permContext, awaitAutomatedChecksBeforeDialog: true };
        }

        // Apply allowed tools whitelist if provided
        if (allowedTools !== undefined) {
            permContext = {
                ...permContext,
                alwaysAllowRules: {
                    cliArg: state.toolPermissionContext.alwaysAllowRules.cliArg,
                    session: [...allowedTools]
                }
            };
        }

        // Apply effort level from agent definition
        let effort = agentDefinition.effort !== undefined
            ? agentDefinition.effort
            : state.effortValue;

        // Return unchanged state if no modifications
        if (permContext === state.toolPermissionContext && effort === state.effortValue) {
            return state;
        }

        return { ...state, toolPermissionContext: permContext, effortValue: effort };
    };

    // Filter tools for subagent context
    let resolvedTools = useExactTools
        ? availableTools
        : filterToolsForSubagent(agentDefinition, availableTools, isAsync).resolvedTools;

    // Get additional working directories
    let additionalWorkingDirs = Array.from(
        appState.toolPermissionContext.additionalWorkingDirectories.keys()
    );

    // Build system prompt
    let systemPrompt = override?.systemPrompt
        ? override.systemPrompt
        : formatSystemPrompt(await buildAgentSystemPrompt(
            agentDefinition,
            toolUseContext,
            resolvedModel,
            additionalWorkingDirs
        ));

    // Create abort controller
    let abortController = override?.abortController
        ? override.abortController
        : isAsync ? new AbortController() : toolUseContext.abortController;

    // ========================================
    // PHASE 3: HOOKS & ADDITIONAL CONTEXT
    // ========================================

    let additionalContexts = [];
    for await (let event of runSubagentStartHooks(agentId, agentDefinition.agentType, abortController.signal)) {
        if (event.additionalContexts && event.additionalContexts.length > 0) {
            additionalContexts.push(...event.additionalContexts);
        }
    }

    // Push hook additional contexts as user message
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

    // Register agent hooks if defined in agent definition
    if (agentDefinition.hooks) {
        registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
    }

    // ========================================
    // PHASE 4: SKILLS PRELOADING
    // ========================================

    let skills = agentDefinition.skills ?? [];
    if (skills.length > 0) {
        let skillsRegistry = await loadSkillsRegistry();
        let validSkills = [];

        for (let skillName of skills) {
            let resolvedName = resolveSkillByName(skillName, skillsRegistry, agentDefinition);
            if (!resolvedName) {
                log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' specified in frontmatter was not found`, { level: "warn" });
                continue;
            }

            let skill = getSkillDefinition(resolvedName, skillsRegistry);
            if (skill.type !== "prompt") {
                log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' is not a prompt-based skill`, { level: "warn" });
                continue;
            }

            validSkills.push({ skillName, skill });
        }

        // Preload skill prompts
        let { formatSkillLoadingMetadata } = await import("./skill-formatter");
        let loadedSkills = await Promise.all(validSkills.map(async ({ skillName, skill }) => ({
            skillName,
            skill,
            content: await skill.getPromptForCommand("", toolUseContext)
        })));

        for (let { skillName, skill, content } of loadedSkills) {
            log(`[Agent: ${agentDefinition.agentType}] Preloaded skill '${skillName}'`);
            let metadata = formatSkillLoadingMetadata(skillName, skill.progressMessage);
            messages.push(createUserMessage({
                content: [
                    { type: "text", text: metadata },
                    ...content
                ]
            }));
        }
    }

    // ========================================
    // PHASE 5: MCP INTEGRATION
    // ========================================

    let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } =
        await getMcpClientsAndTools(agentDefinition, toolUseContext.options.mcpClients);

    // Merge MCP tools with resolved tools
    let allTools = mcpTools.length > 0
        ? mergeToolArrays([...resolvedTools, ...mcpTools], "name")
        : resolvedTools;

    // Build tool use context for subagent
    let subagentToolUseContext = deriveToolUseContext(toolUseContext, {
        options: {
            isNonInteractiveSession: useExactTools
                ? toolUseContext.options.isNonInteractiveSession
                : isAsync ? true : toolUseContext.options.isNonInteractiveSession ?? false,
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
        },
        agentId,
        agentType: agentDefinition.agentType,
        messages,
        readFileState,
        abortController,
        getAppState: getPermissionContext,
        shareSetAppState: !isAsync,
        shareSetResponseLength: true,
        criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL
    });

    // Preserve tool use results if requested
    if (preserveToolUseResults) {
        subagentToolUseContext.preserveToolUseResults = true;
    }

    // Callback for cache-safe params
    if (onCacheSafeParams) {
        onCacheSafeParams({
            systemPrompt,
            userContext,
            systemContext,
            toolUseContext: subagentToolUseContext,
            forkContextMessages: messages
        });
    }

    // Record sidechain transcript
    await recordSidechainTranscript(messages, agentId).catch((err) =>
        log(`Failed to record sidechain transcript: ${err}`)
    );

    // Write agent metadata
    await writeAgentMetadata(agentId, {
        agentType: agentDefinition.agentType,
        ...(worktreePath && { worktreePath })
    }).catch((err) => log(`Failed to write agent metadata: ${err}`));

    // ========================================
    // PHASE 6: EXECUTION LOOP
    // ========================================

    let lastMessageUuid = messages.length > 0 ? messages[messages.length - 1].uuid : null;

    try {
        for await (let event of llmMessageLoop({
            messages,
            systemPrompt,
            userContext,
            systemContext,
            canUseTool,
            toolUseContext: subagentToolUseContext,
            querySource,
            maxTurns: maxTurns ?? agentDefinition.maxTurns
        })) {
            // Call progress callback
            onQueryProgress?.();

            // Handle stream events (TTFT)
            if (event.type === "stream_event" &&
                event.event.type === "message_start" &&
                event.ttftMs != null) {
                toolUseContext.pushApiMetricsEntry?.(event.ttftMs);
                continue;
            }

            // Handle attachments
            if (event.type === "attachment") {
                if (event.attachment.type === "max_turns_reached") {
                    log(`[Agent: ${agentDefinition.agentType}] Reached max turns limit (${event.attachment.maxTurns})`);
                    break;
                }
                yield event;
                continue;
            }

            // Yield recordable messages
            if (isMessageRecordable(event)) {
                await recordSidechainTranscript([event], agentId, lastMessageUuid).catch((err) =>
                    log(`Failed to record sidechain transcript: ${err}`)
                );
                lastMessageUuid = event.uuid;
                yield event;
            }
        }

        // Check for abort
        if (abortController.signal.aborted) {
            throw new AbortError();
        }

        // Call callback if defined
        if (isCallbackAgent(agentDefinition) && agentDefinition.callback) {
            agentDefinition.callback();
        }

    } finally {
        // ========================================
        // PHASE 7: CLEANUP
        // ========================================

        // Cleanup MCP clients
        await mcpCleanup();

        // Deregister agent hooks
        if (agentDefinition.hooks) {
            deregisterAgentHooks(setAppState, agentId);
        }

        // Clear read file state
        subagentToolUseContext.readFileState.clear();

        // Clear messages array
        messages.length = 0;

        // Cleanup agent resources
        cleanupAgentResources(agentId);
        cleanupAgentHooks(agentId);

        // Kill any remaining bash tasks for this agent
        killBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext, Y→canUseTool,
//          z→isAsync, _→canShowPermissionPrompts, w→forkContextMessages, O→querySource, $→override,
//          H→model, j→maxTurns, J→preserveToolUseResults, M→availableTools, D→allowedTools,
//          X→onCacheSafeParams, P→useExactTools, W→worktreePath, Z→transcriptSubdir, G→onQueryProgress
```

---

## Helper Functions

### isMessageRecordable (TvY)

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
    // Recordable message types:
    // - "assistant": Agent responses
    // - "user": User messages
    // - "progress": Progress updates
    // - "system" with subtype "compact_boundary": Compaction markers
    return message.type === "assistant" ||
           message.type === "user" ||
           message.type === "progress" ||
           (message.type === "system" && "subtype" in message && message.subtype === "compact_boundary");
}

// Mapping: TvY→isMessageRecordable, A→message
```

**Why this approach:**
- Filters out internal events that shouldn't be persisted
- Preserves compact boundaries for transcript continuity
- Simple type check for performance

---

### cloneForkContext (Fx8)

```javascript
// ============================================
// Fx8 - cloneForkContext - Clone context for subagent isolation
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
    // Collect all tool_result IDs from user messages
    let toolResultIds = new Set();
    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let item of content) {
                    if (item.type === "tool_result" && item.tool_use_id) {
                        toolResultIds.add(item.tool_use_id);
                    }
                }
            }
        }
    }

    // Filter out orphaned tool_use blocks (tool_use without corresponding tool_result)
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Keep only if no orphaned tool_use exists
                return !content.some((item) =>
                    item.type === "tool_use" && item.id && !toolResultIds.has(item.id)
                );
            }
        }
        return true;  // Keep all non-assistant messages
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→toolResultIds, K→message
```

**Why this approach:**
- Prevents orphaned tool_use blocks that would cause API errors
- Maintains message continuity for context
- Simple Set-based O(n) algorithm

---

### buildAgentSystemPrompt (vvY)

```javascript
// ============================================
// vvY - buildAgentSystemPrompt - Build system prompt for agent
// Location: chunks.133.mjs:1806-1814
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
        // Get agent-specific system prompt
        let systemPromptParts = [
            agentDefinition.getSystemPrompt({
                toolUseContext
            })
        ];

        // Append model-specific and directory-specific context
        return await appendSystemContext(systemPromptParts, model, additionalWorkingDirs);
    } catch (error) {
        // Fallback to default system prompt on error
        return await appendSystemContext([DEFAULT_SYSTEM_PROMPT], model, additionalWorkingDirs);
    }
}

// Mapping: vvY→buildAgentSystemPrompt, A→agentDefinition, q→toolUseContext, K→model, Y→additionalWorkingDirs,
//          mc6→appendSystemContext, Al4→DEFAULT_SYSTEM_PROMPT
```

---

### resolveSkillByName (NvY)

```javascript
// ============================================
// NvY - resolveSkillByName - Resolve skill by name with agent prefix
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
function resolveSkillByName(skillName, skillsRegistry, agentDefinition) {
    // 1. Try exact match
    if (skillExistsInRegistry(skillName, skillsRegistry)) {
        return skillName;
    }

    // 2. Try agent-type prefixed name (e.g., "Plan:search" for Plan agent)
    let agentTypePrefix = agentDefinition.agentType.split(":")[0];
    if (agentTypePrefix) {
        let prefixedName = `${agentTypePrefix}:${skillName}`;
        if (skillExistsInRegistry(prefixedName, skillsRegistry)) {
            return prefixedName;
        }
    }

    // 3. Try suffix match (skill name ends with :{skillName})
    let suffix = `:${skillName}`;
    let matchingSkill = skillsRegistry.find((skill) => skill.name.endsWith(suffix));
    if (matchingSkill) {
        return matchingSkill.name;
    }

    return null;  // Skill not found
}

// Mapping: NvY→resolveSkillByName, A→skillName, q→skillsRegistry, K→agentDefinition, rY6→skillExistsInRegistry
```

**Why this approach:**
- Three-tier resolution: exact → prefixed → suffix
- Allows agent-specific skill overrides
- Fallback to generic skills with same name

---

## Key Design Decisions

### Why Async Generator?

The agent loop uses `async function*` because:
1. **Streaming**: Yields messages as they arrive for real-time UI updates
2. **Memory efficiency**: Doesn't accumulate all messages in memory
3. **Cancellable**: Can be aborted mid-execution via AbortController
4. **Composable**: Parent agents can iterate over child results

### Why Fork Context Cloning?

Cloning the fork context with orphan filtering:
1. **API compliance**: Anthropic API rejects tool_use without tool_result
2. **Context preservation**: Maintains conversation flow
3. **Error prevention**: Avoids "invalid message format" errors

### Why Permission Context Function?

The `getPermissionContext` function (b) is defined inline because:
1. **Dynamic state**: Permission mode can change during execution
2. **Agent isolation**: Each subagent may have different permissions
3. **Deferred evaluation**: Gets fresh state on each tool use

---

## Integration Points

| Module | Symbol | Integration |
|--------|--------|-------------|
| 05_tools | `_c` | Tool filtering for subagent |
| 05_tools | `Bc6` | Derive tool use context |
| 04_system_reminder | `f4` | Create attachment message |
| 17_hooks | `r24`, `zZ6` | Register/deregister hooks |
| 17_hooks | `Ux8` | Run start hooks |
| 07_compact | `TvY` | Recordable message check |
| 15_state | `Zf`, `i9` | Task state management |
| 26_background | `Qn4`, `Un4` | Background task creation |

---

## Verification Status

| Symbol | Location | Verification |
|--------|----------|--------------|
| `qh` | chunks.133.mjs:1565 | ✓ Direct source match |
| `TvY` | chunks.133.mjs:1561 | ✓ Direct source match |
| `Fx8` | chunks.133.mjs:1788 | ✓ Direct source match |
| `vvY` | chunks.133.mjs:1806 | ✓ Direct source match |
| `NvY` | chunks.133.mjs:1817 | ✓ Direct source match |

---

## Related Documents

- [teammate_execution_complete_source.md](./teammate_execution_complete_source.md) - Teammate execution
- [feature_integration_complete.md](./feature_integration_complete.md) - Cross-feature integration
- [agent_loop_algorithm.md](./agent_loop_algorithm.md) - Algorithm analysis