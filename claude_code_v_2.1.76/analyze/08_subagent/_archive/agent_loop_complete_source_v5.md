# Agent Loop Complete Source V5 (Claude Code 2.1.76)

> Complete source-level documentation for the agent loop runner (qh), the core async generator that executes subagent logic.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](./cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `qh` - agentLoopRunner — `chunks.133.mjs:1565`
- `Yh` - llmMessageLoop — `chunks.133.mjs:1747`
- `TvY` - shouldRecordMessage — `chunks.133.mjs:1561`
- `Fx8` - filterOrphanedToolResults — `chunks.133.mjs:1788`
- `vvY` - buildSystemPromptForAgent — `chunks.133.mjs:1806`
- `NvY` - resolveSkillName — `chunks.133.mjs:1817`

---

## Overview

The agent loop runner (`qh`) is the core async generator that orchestrates subagent execution. It handles:

1. **Context initialization** - Agent ID, model, permission context
2. **Message preparation** - Fork context, system prompt, user context
3. **Tool filtering** - Derive tool set based on agent type and mode
4. **Hook registration** - Register lifecycle hooks
5. **Skill loading** - Load and resolve skill references
6. **LLM message loop** - Stream messages from API, handle tool calls

---

## Main Function: agentLoopRunner (qh)

### Complete Source Code

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
            // ... permission context derivation ...
            return $6;
        },
        p = P ? M : _c(A, M, z).resolvedTools,
        Q = Array.from(f.toolPermissionContext.additionalWorkingDirectories.keys()),
        U = $?.systemPrompt ? $.systemPrompt : uq(await vvY(A, K, V, Q)),
        r = $?.abortController ? $.abortController : z ? new AbortController : K.abortController,
        e = [];
    // ... hook event handling ...
    // ... skill loading ...
    // ... LLM message loop ...
}

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,
    promptMessages,
    toolUseContext,
    canUseTool,
    isAsync = false,
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

    // Get current app state and permission mode
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;

    // Determine setAppState function (tasks-aware if available)
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Resolve model (agent definition > override > main loop model)
    let resolvedModel = resolveModel(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );

    // Generate or use existing agent ID
    let agentId = override?.agentId ? override.agentId : generateAgentId();

    // Set transcript subdirectory if provided
    if (transcriptSubdir) {
        setTranscriptDir(agentId, transcriptSubdir);
    }

    // If in teammate context, register agent relationship
    if (isTeammateContext()) {
        let parentAgentId = toolUseContext.agentId ?? getCurrentAgentId();
        registerAgentRelationship(agentId, agentDefinition.agentType, parentAgentId);
    }

    // ========================================
    // PHASE 2: MESSAGE PREPARATION
    // ========================================

    // Build initial messages array
    // Fork context messages are filtered for orphaned tool results
    let messages = [
        ...(forkContextMessages ? filterOrphanedToolResults(forkContextMessages) : []),
        ...promptMessages
    ];

    // Clone or create file read state
    let readFileState = forkContextMessages !== undefined
        ? cloneFileReadState(toolUseContext.readFileState)
        : createFileReadState();

    // Load user and system context in parallel
    let [userContext, systemContext] = await Promise.all([
        override?.userContext ?? getUserContext(),
        override?.systemContext ?? getSystemContext()
    ]);

    // ========================================
    // PHASE 3: PERMISSION CONTEXT DERIVATION
    // ========================================

    let effectivePermissionMode = agentDefinition.permissionMode;

    // Function to derive effective permission context
    let getEffectiveAppState = () => {
        let currentState = toolUseContext.getAppState();
        let permContext = currentState.toolPermissionContext;

        // Apply agent's permission mode if specified
        if (effectivePermissionMode &&
            currentState.toolPermissionContext.mode !== "bypassPermissions" &&
            currentState.toolPermissionContext.mode !== "acceptEdits" &&
            currentState.toolPermissionContext.mode !== "auto") {
            permContext = { ...permContext, mode: effectivePermissionMode };
        }

        // Handle permission prompt visibility
        let shouldAvoidPrompts = canShowPermissionPrompts !== undefined
            ? !canShowPermissionPrompts
            : effectivePermissionMode === "bubble" ? false : isAsync;

        if (shouldAvoidPrompts) {
            permContext = { ...permContext, shouldAvoidPermissionPrompts: true };
        }

        // For async agents, await automated checks before dialog
        if (isAsync && !shouldAvoidPrompts) {
            permContext = { ...permContext, awaitAutomatedChecksBeforeDialog: true };
        }

        // Apply allowed tools whitelist
        if (allowedTools !== undefined) {
            permContext = {
                ...permContext,
                alwaysAllowRules: {
                    cliArg: currentState.toolPermissionContext.alwaysAllowRules.cliArg,
                    session: [...allowedTools]
                }
            };
        }

        // Apply effort value from agent definition
        let effort = agentDefinition.effort !== undefined
            ? agentDefinition.effort
            : currentState.effortValue;

        if (permContext === currentState.toolPermissionContext && effort === currentState.effortValue) {
            return currentState;
        }

        return {
            ...currentState,
            toolPermissionContext: permContext,
            effortValue: effort
        };
    };

    // ========================================
    // PHASE 4: TOOL RESOLUTION
    // ========================================

    // Filter tools for this subagent
    let resolvedTools = useExactTools
        ? availableTools
        : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;

    // Get additional working directories
    let additionalWorkingDirs = Array.from(
        appState.toolPermissionContext.additionalWorkingDirectories.keys()
    );

    // ========================================
    // PHASE 5: SYSTEM PROMPT BUILDING
    // ========================================

    // Build or use provided system prompt
    let systemPrompt = override?.systemPrompt
        ? override.systemPrompt
        : buildSystemPrompt(await buildSystemPromptForAgent(agentDefinition, toolUseContext, resolvedModel, additionalWorkingDirs));

    // ========================================
    // PHASE 6: ABORT CONTROLLER SETUP
    // ========================================

    // Use provided or create new abort controller
    let abortController = override?.abortController
        ? override.abortController
        : isAsync ? new AbortController() : toolUseContext.abortController;

    // ========================================
    // PHASE 7: HOOK EVENT HANDLING
    // ========================================

    let additionalContexts = [];

    // Listen for hook events during agent execution
    for await (let event of hookEventGenerator(agentId, agentDefinition.agentType, abortController.signal)) {
        if (event.additionalContexts && event.additionalContexts.length > 0) {
            additionalContexts.push(...event.additionalContexts);
        }
    }

    // Inject hook-provided contexts as messages
    if (additionalContexts.length > 0) {
        let attachment = createTaskStatusAttachment({
            type: "hook_additional_context",
            content: additionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        });
        messages.push(attachment);
    }

    // ========================================
    // PHASE 8: HOOK REGISTRATION
    // ========================================

    // Register hooks from agent definition
    if (agentDefinition.hooks) {
        registerHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
    }

    // ========================================
    // PHASE 9: SKILL LOADING
    // ========================================

    let skills = agentDefinition.skills ?? [];

    if (skills.length > 0) {
        let skillRegistry = await loadSkillRegistry();
        let loadedSkills = [];

        for (let skillName of skills) {
            let resolvedName = resolveSkillName(skillName, skillRegistry, agentDefinition);

            if (!resolvedName) {
                log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' specified in frontmatter was not found`, {
                    level: "warn"
                });
                continue;
            }

            loadedSkills.push(resolvedName);
        }

        // Store loaded skills in tool use context
        toolUseContext.loadedSkills = loadedSkills;
    }

    // ========================================
    // PHASE 10: LLM MESSAGE LOOP
    // ========================================

    // Create tool use context for the loop
    let loopContext = createToolUseContext(toolUseContext, {
        options: {
            isNonInteractiveSession: override?.isPlanMode
                ? toolUseContext.options.isNonInteractiveSession
                : isAsync ? true : toolUseContext.options.isNonInteractiveSession ?? false,
            appendSystemPrompt: toolUseContext.options.appendSystemPrompt,
            tools: resolvedTools,
            commands: [],
            debug: toolUseContext.options.debug,
            verbose: toolUseContext.options.verbose,
            mainLoopModel: resolvedModel,
            thinkingConfig: override?.isPlanMode ? toolUseContext.options.thinkingConfig : { type: "disabled" },
            mcpClients: mcpClients,
            mcpResources: toolUseContext.options.mcpResources,
            agentDefinitions: toolUseContext.options.agentDefinitions,
            ...(override?.isPlanMode && { querySource })
        },
        agentId,
        agentType: agentDefinition.agentType,
        messages,
        readFileState,
        abortController,
        getAppState: getEffectiveAppState,
        shareSetAppState: !isAsync,
        shareSetResponseLength: true,
        criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL
    });

    // Preserve tool use results if requested
    if (preserveToolUseResults) {
        loopContext.preserveToolUseResults = true;
    }

    // Callback for cache-safe params
    if (onCacheSafeParams) {
        onCacheSafeParams({
            systemPrompt,
            userContext,
            systemContext,
            toolUseContext: loopContext,
            forkContextMessages: messages
        });
    }

    // Record sidechain transcript
    await recordTranscript(messages, agentId).catch(e =>
        log(`Failed to record sidechain transcript: ${e}`)
    );

    // Write agent metadata
    await writeAgentMetadata(agentId, {
        agentType: agentDefinition.agentType,
        ...(worktreePath && { worktreePath })
    }).catch(e => log(`Failed to write agent metadata: ${e}`));

    // Track last message UUID for transcript recording
    let lastUuid = messages.length > 0 ? messages[messages.length - 1].uuid : null;

    // ========================================
    // PHASE 11: EXECUTE LLM MESSAGE LOOP
    // ========================================

    try {
        for await (let event of llmMessageLoop({
            messages,
            systemPrompt,
            userContext,
            systemContext,
            canUseTool,
            toolUseContext: loopContext,
            querySource,
            maxTurns: maxTurns ?? agentDefinition.maxTurns
        })) {
            // Handle query progress callback
            onQueryProgress?.();

            // Handle TTFT (time to first token) metrics
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

            // Record and yield message events
            if (shouldRecordMessage(event)) {
                await recordTranscript([event], agentId, lastUuid).catch(e =>
                    log(`Failed to record sidechain transcript: ${e}`)
                );
                lastUuid = event.uuid;
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
        // CLEANUP
        // ========================================

        // Run MCP cleanup
        await mcpCleanup();

        // Unregister hooks
        if (agentDefinition.hooks) {
            unregisterHooks(setAppState, agentId);
        }

        // Clear file read state
        loopContext.readFileState.clear();

        // Clear messages
        messages.length = 0;

        // Cleanup agent context
        cleanupAgentContext(agentId);
        cleanupForkContext(agentId);

        // Kill bash tasks for this agent
        killBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext, Y→canUseTool, z→isAsync, w→forkContextMessages, H→model, j→maxTurns, M→availableTools, D→allowedTools, W→worktreePath, Z→transcriptSubdir
```

---

## Supporting Functions

### shouldRecordMessage (TvY)

```javascript
// ============================================
// TvY - shouldRecordMessage - Filter messages for recording
// Location: chunks.133.mjs:1561-1563
// ============================================

// ORIGINAL (for source lookup):
function TvY(A) {
    return A.type === "assistant" || A.type === "user" || A.type === "progress" || A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function shouldRecordMessage(message) {
    // Record these message types:
    // - assistant: LLM responses
    // - user: User messages
    // - progress: Progress updates
    // - system with compact_boundary subtype: Compaction markers
    return message.type === "assistant" ||
           message.type === "user" ||
           message.type === "progress" ||
           (message.type === "system" &&
            "subtype" in message &&
            message.subtype === "compact_boundary");
}

// Mapping: TvY→shouldRecordMessage, A→message
```

### filterOrphanedToolResults (Fx8)

```javascript
// ============================================
// Fx8 - filterOrphanedToolResults - Remove orphaned tool results
// Location: chunks.133.mjs:1788-1803
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
function filterOrphanedToolResults(messages) {
    // Step 1: Collect all tool_result IDs from user messages
    let toolResultIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        toolResultIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter out assistant messages with orphaned tool_uses
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Remove if any tool_use doesn't have a corresponding tool_result
                return !content.some(block =>
                    block.type === "tool_use" &&
                    block.id &&
                    !toolResultIds.has(block.id)
                );
            }
        }
        return true; // Keep non-assistant messages
    });
}

// Mapping: Fx8→filterOrphanedToolResults, A→messages, q→toolResultIds, K→message, z→content
```

### buildSystemPromptForAgent (vvY)

```javascript
// ============================================
// vvY - buildSystemPromptForAgent - Build system prompt
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
async function buildSystemPromptForAgent(agentDefinition, toolUseContext, model, additionalWorkingDirs) {
    try {
        // Get agent's system prompt
        let promptParts = [agentDefinition.getSystemPrompt({
            toolUseContext
        })];

        // Build complete prompt with model and working dirs
        return await buildCompleteSystemPrompt(promptParts, model, additionalWorkingDirs);
    } catch (error) {
        // Fallback to default prompt on error
        return await buildCompleteSystemPrompt([DEFAULT_SYSTEM_PROMPT], model, additionalWorkingDirs);
    }
}

// Mapping: vvY→buildSystemPromptForAgent, A→agentDefinition, q→toolUseContext, K→model, Y→additionalWorkingDirs
```

### resolveSkillName (NvY)

```javascript
// ============================================
// NvY - resolveSkillName - Resolve skill name to full identifier
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
function resolveSkillName(skillName, skillRegistry, agentDefinition) {
    // Step 1: Check if skill name already exists exactly
    if (skillExistsInRegistry(skillName, skillRegistry)) {
        return skillName;
    }

    // Step 2: Try prefixing with agent type's namespace
    let agentNamespace = agentDefinition.agentType.split(":")[0];
    if (agentNamespace) {
        let namespacedName = `${agentNamespace}:${skillName}`;
        if (skillExistsInRegistry(namespacedName, skillRegistry)) {
            return namespacedName;
        }
    }

    // Step 3: Try finding by suffix match
    let suffix = `:${skillName}`;
    let matchingSkill = skillRegistry.find(skill => skill.name.endsWith(suffix));
    if (matchingSkill) {
        return matchingSkill.name;
    }

    // Step 4: Not found
    return null;
}

// Mapping: NvY→resolveSkillName, A→skillName, q→skillRegistry, K→agentDefinition, rY6→skillExistsInRegistry
```

---

## Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP RUNNER FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

agentLoopRunner called
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: INITIALIZATION                                                      │
│   • Get app state, permission mode                                           │
│   • Resolve model                                                            │
│   • Generate agent ID                                                        │
│   • Register agent relationship (if teammate)                                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: MESSAGE PREPARATION                                                 │
│   • Filter orphaned tool results from fork context                           │
│   • Merge fork context + prompt messages                                     │
│   • Clone file read state                                                    │
│   • Load user/system context                                                 │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: PERMISSION CONTEXT DERIVATION                                       │
│   • Apply agent permission mode                                              │
│   • Handle permission prompt visibility                                      │
│   • Apply allowed tools whitelist                                            │
│   • Set effort value                                                         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: TOOL RESOLUTION                                                     │
│   • Filter tools for subagent                                                │
│   • Get additional working directories                                       │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5-6: SYSTEM PROMPT & ABORT CONTROLLER                                  │
│   • Build system prompt for agent                                            │
│   • Setup abort controller                                                   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 7-9: HOOKS & SKILLS                                                    │
│   • Listen for hook events                                                   │
│   • Inject hook contexts                                                     │
│   • Register hooks from agent definition                                     │
│   • Load and resolve skills                                                  │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 10: CONTEXT CREATION                                                   │
│   • Create tool use context                                                  │
│   • Setup callbacks                                                          │
│   • Record transcript                                                        │
│   • Write agent metadata                                                     │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 11: LLM MESSAGE LOOP                                                   │
│                                                                              │
│   for await (event of llmMessageLoop(...)) {                                │
│       • Handle TTFT metrics                                                  │
│       • Handle attachments (max_turns_reached)                               │
│       • Record and yield message events                                      │
│   }                                                                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FINALLY: CLEANUP                                                             │
│   • Run MCP cleanup                                                          │
│   • Unregister hooks                                                         │
│   • Clear file read state                                                    │
│   • Clear messages                                                           │
│   • Kill bash tasks for agent                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### Decision 1: Orphaned Tool Result Filtering

**Why**: When forking from a parent context, some tool_uses may not have corresponding tool_results. Including these causes LLM errors.

**Solution**: The `Fx8` function:
1. Collects all tool_result IDs
2. Filters assistant messages with tool_uses that lack matching results

### Decision 2: Permission Context Derivation

**Why**: Subagents may have different permission requirements than the parent.

**Solution**: The `getEffectiveAppState` function:
1. Checks agent's permission mode
2. Applies prompt visibility rules
3. Handles async-specific behavior
4. Merges allowed tools whitelist

### Decision 3: Skill Name Resolution

**Why**: Skills can be referenced by short name, namespaced name, or suffix.

**Solution**: The `NvY` function tries in order:
1. Exact match
2. Agent namespace prefix
3. Suffix match
4. Returns null if not found

---

## Error Handling

| Error Condition | Handling |
|-----------------|----------|
| System prompt build failure | Fallback to default prompt |
| Transcript recording failure | Log and continue |
| Agent metadata write failure | Log and continue |
| Skill not found | Log warning and continue |
| Abort signal | Throw AbortError |
| Max turns reached | Log and exit loop |

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [task_lifecycle_complete_source_v7.md](./task_lifecycle_complete_source_v7.md) - Task lifecycle
- [tool_filtering_complete_source_v2.md](./tool_filtering_complete_source_v2.md) - Tool filtering
- [key_algorithms_deep_dive_v9.md](./key_algorithms_deep_dive_v9.md) - Algorithm analysis

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All key functions documented with source-level restoration