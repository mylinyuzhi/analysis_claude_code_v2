# Execution Flow Deep Dive - Subagent System (Claude Code 2.1.76)

## Overview

This document provides an in-depth analysis of the subagent execution flow, covering the `agentLoopRunner` (qh) generator, task state machine, abort signal propagation, and identity propagation via AsyncLocalStorage.

**v2.1.76 additions:**
- `isolation: worktree` declarative support for git worktree-based subagent isolation
- Subagent completion notifications now include the result file path

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `agentLoopRunner` (qh) - Core async generator for agent execution - chunks.133.mjs:1565
- `llmMessageLoop` (Yh) - LLM message processing loop - chunks.148.mjs:875
- `executeSubagentStartHooks` (Ux8) - Hook execution for SubagentStart - chunks.175.mjs:2666
- `RjA` - reportToolProgress - Update progress preserving summary - chunks.89.mjs:1393
- `Yd7` - updateTaskProgress - Update summary text - chunks.89.mjs:1407
- `c5` - atomicUpdateTask - Generic task state updater - chunks.142.mjs:1662

---

## agentLoopRunner (qh) - 11-Phase Execution

### What it does

`agentLoopRunner` (qh) is the core async generator that drives the subagent's execution loop. It coordinates tool assembly, identity binding, LLM queries, tool dispatching, and progress reporting in a sequential pipeline.

### How it works

The function executes in 11 distinct phases:

**Phase 1: Tool Assembly**
Builds the complete tool set for this subagent by calling `assembleSessionToolSet` (YP6). The tool set includes both built-in tools and any tools specified in the agent definition's `tools` list.

**Phase 2: Identity Binding**
Wraps the entire execution in `runWithAgentIdentity` (X66) via `AsyncLocalStorage`. This allows any code in the call stack to call `getCurrentAgentIdentity()` (Tf6) without needing explicit parameter passing.

**Phase 3: System Prompt Construction**
Calls the agent definition's `getSystemPrompt()` method to build the system prompt. For subagents, this includes any `criticalSystemReminder_EXPERIMENTAL` content from the agent definition.

**Phase 4: Context Building**
Merges parent context with subagent-specific context via `deriveToolUseContext` (Bc6). Some fields are cloned (readFileState), others are shared (appState getter).

**Phase 5: Hook Firing - SubagentStart**
Fires the `SubagentStart` hook event, giving hook handlers an opportunity to run setup logic before the first LLM call.

**Phase 6: LLM Query Loop**
Enters the inner LLM loop, making API calls and streaming responses via the generator pattern. Each response chunk is yielded back to the caller for real-time UI updates.

**Phase 7: Tool Dispatch**
When the LLM produces a `tool_use` content block, routes the tool call to the appropriate tool handler. Permission checks are applied before execution.

**Phase 8: Progress Reporting**
Updates task progress via `reportToolProgress` (RjA) after each tool result. This updates the parent's view of what the subagent is doing.

**Phase 9: Token Tracking**
After each LLM call, updates token usage counters for billing and budget enforcement.

**Phase 10: Compaction Check**
After processing tool results, checks whether the context window is approaching the compaction threshold. If so, triggers auto-compaction.

**Phase 11: Cleanup**
In the `finally` block, fires `SubagentStop` hooks, deregisters any skill hooks, and cleans up abort signal listeners.

```javascript
// ============================================
// agentLoopRunner - Core execution generator with 11 phases
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
        } = await Promise.resolve().then(() => (MN1(), JN1)), a = await Promise.all(n.map(async ({
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
    await dg(R, L).catch(($6) => k(`Failed to record sidechain transcript: ${$6}`)), await gc6(L, {
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
                    k(`[Agent: ${A.agentType}] Reached max turns limit (${$6.attachment.maxTurns})`);
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
    // Phase 1: Context resolution
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Phase 2: Model resolution
    let resolvedModel = resolveModelConfig(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );
    let agentId = override?.agentId ?? generateAgentId();

    // Phase 3: Message assembly
    let messages = [
        ...forkContextMessages ? cloneForkContext(forkContextMessages) : [],
        ...promptMessages
    ];

    // Phase 4: Context derivation
    let derivedContext = deriveToolUseContext(toolUseContext, {
        options: { mainLoopModel: resolvedModel, ... },
        agentId,
        agentType: agentDefinition.agentType,
        messages,
        readFileState: forkContextMessages !== undefined
            ? cloneMap(toolUseContext.readFileState)
            : new Map(),
        abortController: override?.abortController ?? (isAsync ? new AbortController() : toolUseContext.abortController)
    });

    // Phase 5: Hook firing - SubagentStart
    for await (let hookEvent of executeSubagentStartHooks(agentId, agentDefinition.agentType, derivedContext.abortController.signal)) {
        if (hookEvent.additionalContexts?.length > 0) {
            messages.push(...hookEvent.additionalContexts);
        }
    }

    // Phase 6: LLM Query Loop
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
            // Phases 7-10 handled inside llmMessageLoop
            yield event;
        }
    } finally {
        // Phase 11: Cleanup
        await cleanupMcpClients();
        if (agentDefinition.hooks) deregisterSkillHooks(setAppState, agentId);
        derivedContext.readFileState.clear();
        messages.length = 0;
        cleanupAgentState(agentId);
        deregisterSubagentStartHooks(agentId);
        cleanupTaskState(agentId, toolUseContext.getAppState, setAppState);
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext,
// Y→canUseTool, z→isAsync, _→canShowPermissionPrompts, w→forkContextMessages, O→querySource,
// $→override, H→model, j→maxTurns, J→preserveToolUseResults, M→availableTools, D→allowedTools,
// Ux8→executeSubagentStartHooks, Yh→llmMessageLoop, C01→resolveModelConfig, bI→generateAgentId,
// DI→cloneMap, Fx8→cloneForkContext, vvY→buildAgentSystemPrompt, r24→registerAgentHooks
```

---

## Skill Loading in Subagents

### What it does

When an agent definition includes a `skills` array in its frontmatter, the agentLoopRunner loads these skills before starting the LLM loop and injects their prompts as user messages into the conversation.

### How it works

**Phase 5a: Skill Resolution** (lines 1648-1697 in agentLoopRunner)

1. **Get skills list** from `agentDefinition.skills` array
2. **For each skill name** in the list:
   - Resolve the skill using `NvY(skillName, skillIndex, agentDefinition)`
   - If skill not found, log warning and skip
   - If skill is not prompt-based, log warning and skip
3. **Load skill content** by calling `skill.getPromptForCommand("", toolUseContext)`
4. **Format skill metadata** using `formatSkillLoadingMetadata(skillName, progressMessage)`
5. **Inject as user message** containing both the metadata wrapper and skill content

**Why this approach:**
- Skills are loaded once at agent start, not on every turn
- Prompt-based skills provide their content via `getPromptForCommand`
- The skill metadata wrapper helps the LLM understand the skill context

```javascript
// ============================================
// Skill Loading Logic in agentLoopRunner
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
    } = await Promise.resolve().then(() => (MN1(), JN1)), a = await Promise.all(n.map(async ({
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
let skillsList = agentDefinition.skills ?? [];
if (skillsList.length > 0) {
    let skillIndex = await loadSkillIndex();
    let validSkills = [];

    // Phase 1: Resolve and validate each skill
    for (let skillName of skillsList) {
        let skillDef = resolveSkill(skillName, skillIndex, agentDefinition);
        if (!skillDef) {
            log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' not found`, { level: "warn" });
            continue;
        }

        let skill = getSkillHandler(skillDef, skillIndex);
        if (skill.type !== "prompt") {
            log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' is not prompt-based`, { level: "warn" });
            continue;
        }

        validSkills.push({ skillName, skill });
    }

    // Phase 2: Load content for each skill
    let { formatSkillLoadingMetadata } = await importSkillFormatter();
    let loadedSkills = await Promise.all(validSkills.map(async ({ skillName, skill }) => ({
        skillName,
        skill,
        content: await skill.getPromptForCommand("", toolUseContext)
    })));

    // Phase 3: Inject as user messages
    for (let { skillName, skill, content } of loadedSkills) {
        log(`[Agent: ${agentDefinition.agentType}] Preloaded skill '${skillName}'`);
        let metadataWrapper = formatSkillLoadingMetadata(skillName, skill.progressMessage);
        messages.push(createUserMessage({
            content: [
                { type: "text", text: metadataWrapper },
                ...content
            ]
        }));
    }
}

// Mapping: Y6→skillsList, A→agentDefinition, NR→loadSkillIndex, NvY→resolveSkill,
// kf6→getSkillHandler, p1→createUserMessage, R→messages
```

**Key insight:** Skills are injected as user messages rather than system messages because:
1. Skills may contain dynamic content (e.g., current file state)
2. User messages can reference tool results that were collected earlier
3. The skill metadata wrapper provides context that distinguishes skill content from regular user input

---

## Worktree Isolation (v2.1.76)

### What it does

In v2.1.76, agent definitions support a new `isolation: "worktree"` field that requests git worktree-based filesystem isolation for the subagent.

### How it works

1. When `agentLoopRunner` sees `agentDefinition.isolation === "worktree"`, it allocates a new git worktree before starting the execution loop
2. The subagent's working directory is set to the worktree path
3. All file operations (Read, Write, Edit, Bash) in the subagent scope against the worktree, not the main working tree
4. On completion or error, the worktree is cleaned up in the `finally` block

**Why this approach:**
- **True filesystem isolation** prevents parallel agents from conflicting on file writes
- **Declarative specification** - the agent definition states its needs; the runner satisfies them
- **Automatic cleanup** - worktrees are ephemeral and do not require manual teardown

**Key insight:** Without worktree isolation, two parallel subagents editing the same file produce merge conflicts or data corruption. With `isolation: worktree`, each subagent writes to its own branch/worktree copy, and results can be merged after completion.

```javascript
// ============================================
// Worktree isolation setup (v2.1.76 addition)
// Location: chunks.130.mjs (added in 2.1.76)
// ============================================

// READABLE (for understanding):
async function* agentLoopRunner({ agentDefinition, ... }) {
    let worktreePath = null;

    if (agentDefinition.isolation === "worktree") {
        // Allocate a new git worktree for this subagent
        worktreePath = await allocateWorktree(agentDefinition.agentId);
    }

    try {
        // ... main execution loop using worktreePath as cwd if set ...
    } finally {
        if (worktreePath) {
            await cleanupWorktree(worktreePath);
        }
    }
}

// Mapping: isolation→agentDefinition.isolation, allocateWorktree→worktree allocator,
// cleanupWorktree→worktree cleanup
```

---

## llmMessageLoop (Yh) - Turn Processing Engine

### What it does

`llmMessageLoop` (Yh) is the inner loop that processes individual LLM turns within the agent loop. It handles microcompaction, autocompaction, API calls, and tool execution coordination.

### How it works

The loop runs continuously until completion or error, processing each turn:

1. **Yield stream event** - Signal start of new request
2. **Microcompaction** - Apply small context optimizations
3. **Autocompaction** - Check if full compaction needed
4. **API Call** - Stream response from LLM
5. **Tool Execution** - Dispatch and execute any tool calls
6. **Progress Update** - Report turn completion
7. **Loop Check** - Continue if more turns allowed

```javascript
// ============================================
// llmMessageLoop - Turn processing engine
// Location: chunks.148.mjs:875-880 (wrapper) and 882+ (omY inner generator)
// ============================================

// ORIGINAL (for source lookup):
async function* Yh(A) {
    let q = [],
        K = yield* omY(A, q);
    for (let Y of q) pb(Y, "completed");
    return K
}

// READABLE (for understanding):
async function* llmMessageLoop(config) {
    let pendingToolResults = [];

    // Delegate to inner loop with tracking
    let result = yield* processTurnLoop(config, pendingToolResults);

    // Mark all pending tool results as completed
    for (let toolResult of pendingToolResults) {
        markToolResultCompleted(toolResult, "completed");
    }

    return result;
}

// The inner loop (omY) handles:
// - Microcompaction: Small context optimizations (remove duplicates, trim whitespace)
// - Autocompaction: Full context compaction when threshold exceeded
// - API streaming: Yield events as they arrive from LLM
// - Tool dispatch: Execute tools and collect results
// - Turn counting: Enforce maxTurns limit

// Mapping: Yh→llmMessageLoop, omY→processTurnLoop, q→pendingToolResults, pb→markToolResultCompleted
```

**Key insight:** The llmMessageLoop separates the outer agent lifecycle (agentLoopRunner) from the inner turn processing. This allows the outer loop to handle identity, hooks, and cleanup while the inner loop focuses on LLM interaction efficiency.

---

## processTurnLoop (omY) - Inner Turn Processing

### What it does

`processTurnLoop` (omY) is the inner generator that handles individual LLM turns within the llmMessageLoop. It manages the complete turn lifecycle: pre-processing, API streaming, tool execution, and post-processing.

### How it works

The loop executes a continuous cycle until the conversation ends:

**Phase 1: Pre-Processing (lines 904-951)**
- Clone messages for this turn
- Apply microcompaction (small optimizations like duplicate removal)
- Check for autocompaction trigger and execute if needed
- Track compaction state for telemetry

**Phase 2: API Setup (lines 996-1007)**
- Initialize streaming tool executor if enabled
- Resolve model configuration
- Check blocking limits (context window threshold)

**Phase 3: API Streaming (lines 1021-1130)**
- Stream responses from the LLM
- Handle tool_use blocks
- Execute streaming tools concurrently
- Handle model fallback on overload

**Phase 4: Post-Processing (lines 1151-1169)**
- Cache completed turns
- Handle abort signals
- Collect remaining tool results
- Check if conversation should continue

```javascript
// ============================================
// processTurnLoop - Inner turn processing generator
// Location: chunks.148.mjs:882-1169
// ============================================

// ORIGINAL (for source lookup):
async function* omY(A, q) {
    let {
        systemPrompt: K,
        userContext: Y,
        systemContext: z,
        canUseTool: _,
        fallbackModel: w,
        querySource: O,
        maxTurns: $,
        skipCacheWrite: H
    } = A, j = A.deps ?? SKq(), J = {
        messages: A.messages,
        toolUseContext: A.toolUseContext,
        maxOutputTokensOverride: A.maxOutputTokensOverride,
        autoCompactTracking: void 0,
        stopHookActive: void 0,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        turnCount: 1,
        pendingToolUseSummary: void 0,
        transition: void 0
    }, M = null, D = RKq();
    while (!0) {
        // Phase 1: Pre-processing
        let { toolUseContext: X } = J, { messages: P, ... } = J;
        yield { type: "stream_request_start" };

        // Phase 1a: Microcompaction
        I = (await j.microcompact(I, X, O)).messages;

        // Phase 1b: Autocompaction
        let { compactionResult: U, consecutiveFailures: r } =
            await j.autocompact(I, X, { systemPrompt: K, ... }, O, g, B);

        // Phase 2: API Setup
        let s = D.gates.streamingToolExecution ? new ui6(X.options.tools, _, X) : null;
        let N6 = II({ permissionMode: z6, mainLoopModel: X.options.mainLoopModel, ... });

        // Phase 3: API Streaming
        for await (let Q6 of j.callModel({ messages: I, systemPrompt: Q, ... })) {
            if (Q6.type === "assistant") {
                e.push(Q6);
                let toolUses = Q6.message.content.filter((block) => block.type === "tool_use");
                if (toolUses.length > 0) H6.push(...toolUses), J6 = !0;
            }
            yield Q6;
        }

        // Phase 4: Post-processing
        if (X.abortController.signal.aborted) {
            return { reason: "aborted_streaming" };
        }
        if (!J6) {
            // No tool uses - check for completion or error
            return { reason: "completed" };
        }
    }
}

// READABLE (for understanding):
async function* processTurnLoop(config, pendingToolResults) {
    let {
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        fallbackModel,
        querySource,
        maxTurns,
        skipCacheWrite
    } = config;
    let deps = config.deps ?? getDefaultDeps();

    // Turn state tracking
    let turnState = {
        messages: config.messages,
        toolUseContext: config.toolUseContext,
        maxOutputTokensOverride: config.maxOutputTokensOverride,
        autoCompactTracking: undefined,
        stopHookActive: undefined,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: false,
        turnCount: 1,
        pendingToolUseSummary: undefined,
        transition: undefined
    };

    while (true) {
        // Phase 1: Pre-processing
        yield { type: "stream_request_start" };

        // Clone messages for this turn
        let turnMessages = [...turnState.messages];

        // Apply microcompaction (small context optimizations)
        turnMessages = (await deps.microcompact(turnMessages, toolUseContext, querySource)).messages;

        // Check and apply autocompaction if needed
        let { compactionResult, consecutiveFailures } = await deps.autocompact(
            turnMessages, toolUseContext, { systemPrompt, userContext, systemContext }, querySource
        );

        if (compactionResult) {
            // Yield compaction summary messages
            for (let summaryMsg of compactionResult.summaryMessages) {
                yield summaryMsg;
            }
            turnMessages = compactionResult.compactedMessages;
        }

        // Phase 2: API Setup
        let streamingToolExecutor = gates.streamingToolExecution
            ? new StreamingToolExecutor(tools, canUseTool, toolUseContext)
            : null;
        let resolvedModel = resolveModelForTurn(toolUseContext);

        // Check blocking limit (context window threshold)
        let { isAtBlockingLimit } = checkContextLimit(turnMessages, resolvedModel);
        if (isAtBlockingLimit) {
            return { reason: "blocking_limit" };
        }

        // Phase 3: API Streaming
        let assistantMessages = [];
        let toolResults = [];
        let hasToolUses = false;

        try {
            for await (let streamEvent of deps.callModel({
                messages: turnMessages,
                systemPrompt,
                tools: toolUseContext.options.tools,
                signal: toolUseContext.abortController.signal,
                options: { model: resolvedModel, ... }
            })) {
                // Handle streaming fallback (model overload)
                if (streamEvent.type === "streaming_fallback") {
                    // Yield tombstones for orphaned messages
                    for (let msg of assistantMessages) {
                        yield { type: "tombstone", message: msg };
                    }
                    // Reset state and retry with fallback model
                    assistantMessages = [];
                    toolResults = [];
                    hasToolUses = false;
                    continue;
                }

                yield streamEvent;

                if (streamEvent.type === "assistant") {
                    assistantMessages.push(streamEvent);
                    let toolUses = streamEvent.message.content.filter(b => b.type === "tool_use");
                    if (toolUses.length > 0) {
                        hasToolUses = true;
                        // Add to streaming executor for parallel execution
                        if (streamingToolExecutor) {
                            for (let toolUse of toolUses) {
                                streamingToolExecutor.addTool(toolUse, streamEvent);
                            }
                        }
                    }
                }

                // Yield streaming tool results as they complete
                if (streamingToolExecutor) {
                    for (let result of streamingToolExecutor.getCompletedResults()) {
                        if (result.message) {
                            yield result.message;
                            toolResults.push(result.message);
                        }
                    }
                }
            }
        } catch (err) {
            if (err instanceof ModelOverloadError && fallbackModel) {
                // Switch to fallback model and retry
                resolvedModel = fallbackModel;
                yield { type: "model_fallback", message: `Switched to ${fallbackModel}` };
                continue;
            }
            throw err;
        }

        // Phase 4: Post-processing
        if (toolUseContext.abortController.signal.aborted) {
            // Collect remaining streaming results before abort
            if (streamingToolExecutor) {
                for await (let result of streamingToolExecutor.getRemainingResults()) {
                    if (result.message) yield result.message;
                }
            }
            return { reason: "aborted_streaming" };
        }

        if (!hasToolUses) {
            // No tool uses means conversation should end
            return { reason: "completed" };
        }

        // Collect all remaining tool results
        if (streamingToolExecutor) {
            for await (let result of streamingToolExecutor.getRemainingResults()) {
                if (result.message) {
                    yield result.message;
                    toolResults.push(result.message);
                }
            }
        }

        // Update messages for next turn
        turnState.messages = [...turnMessages, ...assistantMessages, ...toolResults];
        turnState.turnCount++;

        // Check max turns
        if (maxTurns && turnState.turnCount > maxTurns) {
            yield { type: "attachment", attachment: { type: "max_turns_reached", maxTurns } };
            return { reason: "max_turns_reached" };
        }
    }
}

// Mapping: omY→processTurnLoop, A→config, q→pendingToolResults, K→systemPrompt,
// Y→userContext, z→systemContext, _→canUseTool, w→fallbackModel, O→querySource,
// $→maxTurns, H→skipCacheWrite, j→deps, J→turnState, X→toolUseContext,
// ui6→StreamingToolExecutor, II→resolveModelForTurn, SKq→getDefaultDeps
```

**Why this approach:**

1. **Streaming tool execution** allows tools to run in parallel with LLM streaming, reducing latency for multi-tool workflows
2. **Microcompaction before each turn** keeps context lean without the overhead of full compaction
3. **Autocompaction trigger** prevents context overflow by proactively compacting when thresholds are reached
4. **Model fallback** handles API overload gracefully by switching to a backup model mid-stream
5. **Tombstone messages** mark orphaned content when model fallback occurs, preserving conversation integrity

**Key insight:** The streaming tool executor (`ui6`) is the key performance optimization. Instead of waiting for all tool calls to complete before yielding results, it executes tools in parallel and yields results as they arrive. This dramatically reduces latency for workflows that use multiple tools per turn.

---

## Helper Functions in agentLoopRunner

### resolveModelConfig (C01)

**What it does:** Resolves the model to use for this subagent by checking the cascade: per-invocation override → agent definition model → session model → default.

**How it works:**
1. If `perInvocationModel` is provided (from AgentTool call), use it
2. Else if `agentDefinitionModel` is set, use that
3. Else fall back to `sessionModel`

```javascript
// ============================================
// resolveModelConfig - Model resolution cascade
// Location: chunks.133.mjs:1589
// ============================================

// READABLE (for understanding):
function resolveModelConfig(agentDefinitionModel, sessionModel, perInvocationModel, permissionMode) {
    // Priority: per-invocation > agent definition > session
    if (perInvocationModel) return resolveModelId(perInvocationModel);
    if (agentDefinitionModel && agentDefinitionModel !== "inherit") {
        return resolveModelId(agentDefinitionModel);
    }
    return sessionModel;
}

// Mapping: C01→resolveModelConfig
```

### generateAgentId (bI)

**What it does:** Generates a unique identifier for this subagent instance.

**How it works:** Creates a UUID with a prefix to distinguish subagent IDs from session IDs.

```javascript
// ============================================
// generateAgentId - Unique agent ID generator
// Location: chunks.93.mjs:1557
// ============================================

// Mapping: bI→generateAgentId
```

### cloneMap (DI)

**What it does:** Creates a shallow copy of a Map, used to clone `readFileState` for fork context isolation.

```javascript
// ============================================
// cloneMap - Map cloning utility
// Location: chunks.84.mjs:65
// ============================================

// READABLE (for understanding):
function cloneMap(originalMap) {
    return new Map(originalMap);
}

// Mapping: DI→cloneMap
```

### cloneForkContext (Fx8)

**What it does:** Deep clones fork context messages while preserving tool result references. Filters out orphaned tool uses (where the corresponding tool result was removed).

**Why this is needed:** When forking a subagent, the messages may have had some content compacted away. This function ensures that tool uses without corresponding tool results are removed to prevent the LLM from waiting for a result that will never come.

```javascript
// ============================================
// cloneForkContext - Fork context message cloning
// Location: chunks.133.mjs:1787-1804
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
function cloneForkContext(forkMessages) {
    // Collect all tool_use_ids from tool_result blocks
    let referencedToolUseIds = new Set();
    for (let message of forkMessages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        referencedToolUseIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Filter out assistant messages with orphaned tool_uses
    return forkMessages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Remove if any tool_use doesn't have a corresponding tool_result
                return !content.some((block) =>
                    block.type === "tool_use" && block.id && !referencedToolUseIds.has(block.id)
                );
            }
        }
        return true;
    });
}

// Mapping: Fx8→cloneForkContext, A→forkMessages, q→referencedToolUseIds
```

### buildAgentSystemPrompt (vvY)

**What it does:** Builds the complete system prompt for the agent by calling the agent definition's `getSystemPrompt()` method.

```javascript
// ============================================
// buildAgentSystemPrompt - System prompt builder
// Location: chunks.133.mjs:1806
// ============================================

// READABLE (for understanding):
async function buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, workingDirectories) {
    try {
        let promptParts = [agentDefinition.getSystemPrompt({ toolUseContext })];
        // ... add additional prompt parts ...
        return promptParts.join("\n");
    } catch (err) {
        // Handle prompt building errors
    }
}

// Mapping: vvY→buildAgentSystemPrompt
```

### registerAgentHooks (r24)

**What it does:** Registers skill hooks from the agent definition for the duration of this agent's execution.

**How it works:**
1. Iterate through `agentDefinition.hooks`
2. Register each hook with the global hook registry
3. Hooks are automatically deregistered in the finally block via `zZ6`

```javascript
// ============================================
// registerAgentHooks - Hook registration for agent
// Location: chunks.95.mjs:1842
// ============================================

// READABLE (for understanding):
function registerAgentHooks(setAppState, agentId, hooks, agentName, isSubagent) {
    for (let [eventName, handlers] of Object.entries(hooks)) {
        for (let handler of handlers) {
            registerHook(eventName, agentId, handler, agentName);
        }
    }
}

// Mapping: r24→registerAgentHooks
```

### resolveSkillByName (NvY)

**What it does:** Resolves a skill name to its fully qualified skill ID by checking multiple resolution strategies.

**How it works:**
1. First, try the skill name exactly as provided
2. If not found, try prefixing with the agent type (e.g., `explore:skillName`)
3. If still not found, search for skills ending with `:skillName`
4. Return `null` if no match found

```javascript
// ============================================
// resolveSkillByName - Skill name resolution
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
function resolveSkillByName(skillName, skillIndex, agentDefinition) {
    // Strategy 1: Try exact match
    if (skillExistsInIndex(skillName, skillIndex)) {
        return skillName;
    }

    // Strategy 2: Try prefixing with agent type (before colon)
    let agentPrefix = agentDefinition.agentType.split(":")[0];
    if (agentPrefix) {
        let prefixedName = `${agentPrefix}:${skillName}`;
        if (skillExistsInIndex(prefixedName, skillIndex)) {
            return prefixedName;
        }
    }

    // Strategy 3: Search for skill ending with :skillName
    let suffix = `:${skillName}`;
    let matchingSkill = skillIndex.find(skill => skill.name.endsWith(suffix));
    if (matchingSkill) {
        return matchingSkill.name;
    }

    // Not found
    return null;
}

// Mapping: NvY→resolveSkillByName, A→skillName, q→skillIndex, K→agentDefinition,
// rY6→skillExistsInIndex
```

**Why multiple strategies:** Skills can be defined at different scopes:
- **Global skills:** `skillName` (available to all agents)
- **Agent-specific skills:** `agentType:skillName` (only for that agent type)
- **Namespace skills:** `namespace:skillName` (shared across related agents)

The resolution order ensures agent-specific skills take precedence over global ones.

---

## onCacheSafeParams Callback

**What it does:** The `onCacheSafeParams` parameter in agentLoopRunner allows the caller to receive a callback after all expensive initialization is complete but before the first LLM call.

**Why this is useful:**
- The caller may want to cache the `systemPrompt`, `userContext`, `systemContext`, etc.
- These values are computed after MCP client initialization, skill loading, and hook firing
- The callback provides a consistent snapshot of all computed parameters

**Callback signature:**
```javascript
onCacheSafeParams({
    systemPrompt,      // Fully built system prompt
    userContext,       // Resolved user context
    systemContext,     // Resolved system context
    toolUseContext,    // Derived tool use context
    forkContextMessages // Complete message list
})
```

---

## executeSubagentStartHooks (Ux8) - Hook Event Generator

### What it does

Fires the `SubagentStart` hook event before the first LLM call, allowing hook handlers to inject additional context into the subagent's conversation.

### How it works

1. Iterate through registered SubagentStart hooks
2. Execute each hook handler
3. Yield events with `additionalContexts` to inject
4. Handle hook errors gracefully (don't fail agent start)

```javascript
// ============================================
// executeSubagentStartHooks - Hook execution for SubagentStart
// Location: chunks.175.mjs:2666
// ============================================

// ORIGINAL (for source lookup):
async function* Ux8(A, q, K, Y = T$) {
    // Hook iteration and execution
}

// READABLE (for understanding):
async function* executeSubagentStartHooks(agentId, agentType, abortSignal, hookContext = defaultContext) {
    // Get registered hooks for SubagentStart event
    let hooks = getHooksForEvent("SubagentStart");

    for (let hook of hooks) {
        if (abortSignal.aborted) break;

        try {
            let result = await hook.handler({
                agentId,
                agentType,
                ...hookContext
            });

            // Yield additional contexts to inject into conversation
            if (result?.additionalContexts) {
                yield {
                    additionalContexts: result.additionalContexts
                };
            }
        } catch (err) {
            // Log error but don't fail the agent start
            log(`SubagentStart hook ${hook.name} failed: ${err}`);
        }
    }
}

// Mapping: Ux8→executeSubagentStartHooks, A→agentId, q→agentType, K→abortSignal, Y→hookContext
```

---

## AsyncLocalStorage Identity Propagation

### What it does

Uses Node.js `AsyncLocalStorage` to propagate agent identity through the async call stack without explicit parameter passing. This allows any code in the agent's execution context to retrieve the current agent identity.

### How it works

```javascript
// ============================================
// Agent Identity Storage - AsyncLocalStorage pattern
// Location: chunks.133.mjs:835-843
// ============================================

// ORIGINAL (for source lookup):
function Tf6() {
    return mc4.getStore()
}
function X66(A, q) {
    return mc4.run(A, q)
}
mc4 = new OvY  // AsyncLocalStorage instance

// READABLE (for understanding):
// Global AsyncLocalStorage instance for agent identity
let agentIdentityStorage = new AsyncLocalStorage();

// Get current agent identity from async context
function getCurrentAgentIdentity() {
    return agentIdentityStorage.getStore();
}

// Run a function with a specific agent identity bound to async context
function runWithAgentIdentity(identity, callback) {
    return agentIdentityStorage.run(identity, callback);
}

// Mapping: mc4→agentIdentityStorage, Tf6→getCurrentAgentIdentity,
// X66→runWithAgentIdentity, OvY→AsyncLocalStorage
```

### Usage Pattern

```javascript
// In agentLoopRunner, wrap execution with identity:
async function* agentLoopRunner({ agentId, ... }) {
    // Bind identity for entire agent execution
    yield* runWithAgentIdentity({ agentId, agentType, ... }, async function* () {
        // Any code here can call getCurrentAgentIdentity()
        // without needing agentId passed as parameter

        for await (let event of llmMessageLoop(...)) {
            // Inside llmMessageLoop, getCurrentAgentIdentity() returns
            // the identity bound by the outer runWithAgentIdentity()
            yield event;
        }
    });
}

// In deeply nested code (e.g., tool execution):
function recordTelemetry() {
    let identity = getCurrentAgentIdentity();
    if (identity) {
        // We're inside an agent execution context
        console.log(`Agent ${identity.agentId} sent telemetry`);
    } else {
        // Not in an agent context (e.g., main session)
        console.log("Main session sent telemetry");
    }
}
```

### Why AsyncLocalStorage

**Key insight:** AsyncLocalStorage provides transparent context propagation without coupling. Code that needs agent identity doesn't need to know where it came from - it just calls `getCurrentAgentIdentity()`.

**Benefits:**
1. **Decoupling** - Deeply nested code doesn't need identity parameters threaded through
2. **Transparency** - Existing code can gain identity awareness without signature changes
3. **Async-safe** - Context is preserved across async boundaries (Promises, callbacks)
4. **Isolation** - Each agent execution has its own isolated identity scope

**Important:** The identity is only available within the callback passed to `runWithAgentIdentity`. Once execution exits that callback, `getCurrentAgentIdentity()` returns `undefined` (or the outer scope's identity if nested).

---

## Task State Machine

### States and Transitions

```
Created (foreground or background)
       │
       ├── [User requests backgrounding]
       │         ↓
       │    Backgrounded (mid-run)
       │         ↓
       ├── [Task finishes]
       ↓
   Completed / Failed / Killed
```

### createForegroundTask (wd7)

**What it does:** Creates a foreground task that can be backgrounded mid-run via `Promise.race`.

**How it works:**
1. Allocates a task ID and creates an entry in the global task map
2. Starts the agent loop in a Promise
3. Wraps it in `Promise.race` with a backgrounding signal
4. If backgrounding signal fires first, transitions to `createAsyncTask` path
5. Otherwise, waits for the agent loop to complete

```javascript
// ============================================
// createForegroundTask - Foreground task with backgrounding support
// Location: chunks.89.mjs:1477
// ============================================

// READABLE (for understanding):
async function createForegroundTask(agentDef, toolUseContext, ...) {
    let taskId = generateTaskId();

    let agentLoopPromise = (async () => {
        for await (let event of agentLoopRunner({ agentDefinition: agentDef, ... })) {
            reportProgress(event);
        }
    })();

    // Promise.race enables mid-run backgrounding
    let result = await Promise.race([
        agentLoopPromise,
        backgroundingSignal(taskId)
    ]);

    if (result?.type === "background") {
        // Transition to background task
        return createAsyncTask(taskId, agentLoopPromise, ...);
    }

    return { status: "completed", ... };
}

// Mapping: wd7→createForegroundTask, zd7→createAsyncTask
```

---

## Abort Signal Propagation

### Hierarchy

Abort signals flow from outermost to innermost scope:

```
Session AbortController
    │
    └── Task AbortController
            │
            └── LLM Request AbortController
                        │
                        └── Tool Execution AbortController
```

**Key behaviors:**
- Parent abort propagates down: aborting the task aborts any in-flight LLM request
- Child completion does NOT propagate up: a tool finishing does not affect the task signal
- Each level creates a `derived` signal chained to its parent

**Why this design:**
- **Clean teardown** - killing a task stops everything in one operation
- **Isolation** - individual tool timeouts don't kill the whole task
- **Composable** - signals can be combined with `AbortSignal.any()`

---

## Identity Propagation via AsyncLocalStorage

### Agent Identity Storage (mc4)

**What it is:** An `AsyncLocalStorage` instance that holds the current agent's identity context, making it available throughout the call stack without explicit parameter passing.

### runWithAgentIdentity (X66)

**What it does:** Establishes an `AsyncLocalStorage` context that makes the subagent's identity available to any code in the call stack without explicit parameter passing.

**How it works:**
1. Creates an identity object with `agentId`, `parentAgentId`, `sessionId`
2. Calls `AsyncLocalStorage.run(identity, fn)` which makes `identity` available via `store.getStore()`
3. Any code called from within `fn` (including tools, hooks, compaction) can retrieve the current agent identity via `getCurrentAgentIdentity()` (Tf6)

**Why this approach:**
- **Zero coupling** - tools don't need an `agentId` parameter
- **Async-safe** - the `AsyncLocalStorage` propagates through `await` chains automatically
- **Transparent** - callers don't need to know about identity; it's always available

**Key insight:** This pattern is similar to React's Context API but for Node.js async functions. It enables telemetry, logging, and coordination to be agent-aware without polluting every function signature.

```javascript
// ============================================
// runWithAgentIdentity - AsyncLocalStorage identity binding
// Location: chunks.133.mjs:841-843
// ============================================

// ORIGINAL (for source lookup):
function X66(A, q) {
    return mc4.run(A, q)
}

// READABLE (for understanding):
function runWithAgentIdentity(agentIdentity, generatorFn) {
    // mc4 is the AsyncLocalStorage instance for agent identity
    return agentIdentityStorage.run(agentIdentity, generatorFn);
}

// Mapping: X66→runWithAgentIdentity, mc4→agentIdentityStorage, A→agentIdentity, q→generatorFn
```

### getCurrentAgentIdentity (Tf6)

**What it does:** Retrieves the current agent identity from the AsyncLocalStorage context.

```javascript
// ============================================
// getCurrentAgentIdentity - Get current agent identity from context
// Location: chunks.133.mjs:837-839
// ============================================

// ORIGINAL (for source lookup):
function Tf6() {
    return mc4.getStore()
}

// READABLE (for understanding):
function getCurrentAgentIdentity() {
    return agentIdentityStorage.getStore();
}

// Mapping: Tf6→getCurrentAgentIdentity, mc4→agentIdentityStorage
```

### Teammate Context Storage (ef8)

Similar to agent identity, teammate context uses its own AsyncLocalStorage instance for team-specific context.

```javascript
// ============================================
// Teammate Context Functions
// Location: chunks.84.mjs:1403-1425
// ============================================

// ORIGINAL (for source lookup):
function iM() {
    return ef8.getStore()
}

function UD1(A, q) {
    return ef8.run(A, q)
}

// READABLE (for understanding):
function getTeammateContext() {
    return teammateContextStorage.getStore();
}

function runWithTeammateContext(teammateContext, fn) {
    return teammateContextStorage.run(teammateContext, fn);
}

// Mapping: iM→getTeammateContext, UD1→runWithTeammateContext, ef8→teammateContextStorage
```

> **CORRECTION:** Previous documentation incorrectly mapped `p01` as `runWithAgentIdentity`.
> The actual `p01` (chunks.94.mjs:295) is `isSkillMdFile` - a helper that checks if a filename is "skill.md".

---

## Dual Progress Reporting

### Why Two Progress Functions?

The subagent system has two distinct progress update mechanisms that serve different purposes:

**`reportToolProgress` (RjA):** Updates the progress message shown to the user while PRESERVING the summary. Used during tool execution to show "running git status..." without overwriting the existing summary of what the agent has accomplished.

**`updateTaskProgress` (Yd7):** REPLACES the summary text entirely. Used when the agent has finished a major phase and wants to set a new summary like "Analyzed 23 files, found 3 issues".

```javascript
// ============================================
// reportToolProgress - Update progress preserving existing summary
// Location: chunks.89.mjs:1393
// ============================================

// READABLE (for understanding):
function reportToolProgress(taskId, progressMessage) {
    atomicUpdateTask(taskId, (task) => ({
        ...task,
        progressMessage: progressMessage
        // summary is NOT overwritten
    }));
}

// ============================================
// updateTaskProgress - Replace summary text
// Location: chunks.89.mjs:1407
// ============================================

// READABLE (for understanding):
function updateTaskProgress(taskId, summaryText) {
    atomicUpdateTask(taskId, (task) => ({
        ...task,
        summary: summaryText,  // Replaces previous summary
        progressMessage: undefined  // Clear in-progress indicator
    }));
}

// Mapping: RjA→reportToolProgress, Yd7→updateTaskProgress, c5→atomicUpdateTask
```

**Why this design:** Users need to see both what the agent is currently doing (tool-level progress) and what it has accomplished (phase-level summary). Conflating these would cause the summary to flicker on every tool invocation.

---

## Completion Notification with Result File Path (v2.1.76)

In v2.1.76, when a background subagent completes, the completion notification now includes the path to the output file containing the agent's result. This allows the parent agent or user to directly access the result without needing to infer the file path from the agent ID.

**Before v2.1.76:**
```javascript
// Completion notification
{ type: "agent_completed", agentId: "agent-123" }
```

**In v2.1.76:**
```javascript
// Completion notification now includes outputFilePath
{ type: "agent_completed", agentId: "agent-123", outputFilePath: "/tmp/claude/agents/agent-123/output.jsonl" }
```

This change reduces the need for callers to construct file paths manually and makes the completion event self-contained.

---

## Design Rationale

### Why Generator-Based Streaming?

**Alternatives considered:**
1. **Callback-based** - Pass a callback for each event → Rejected because it makes composition harder
2. **Promise-based** - Return a Promise that resolves when done → Rejected because it loses streaming
3. **EventEmitter** - Emit events → Rejected because it doesn't integrate with async/await

**The chosen approach** (async generator) provides:
- **Composable** - Callers can `yield*` into the generator, passing events up the call stack
- **Backpressure** - Natural backpressure via generator protocol
- **Cancellable** - `return()` on the generator propagates cancellation
- **Memory efficient** - Messages are processed one at a time, not accumulated

### Why AsyncLocalStorage for Identity?

**Alternatives considered:**
1. **Thread-local** - Not available in Node.js single-threaded model
2. **Parameter passing** - Every function needs `agentId` parameter → Massive coupling
3. **Global variable** - Not safe when multiple agents run concurrently

**The chosen approach** (`AsyncLocalStorage`) is the correct Node.js idiom for this pattern - it's designed exactly for this use case of propagating context across async call chains.

---

## Cleanup Sequence (Phase 11)

### What it does

The cleanup sequence in the `finally` block of `agentLoopRunner` ensures all resources are properly released when the agent completes (successfully or due to error/abort).

### Cleanup Functions

The cleanup sequence calls these functions in order:

```javascript
// ============================================
// Cleanup sequence in agentLoopRunner finally block
// Location: chunks.133.mjs:1782-1785
// ============================================

// ORIGINAL (for source lookup):
} finally {
    if (await K6(), A.hooks) zZ6(N, L);
    z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
}

// READABLE (for understanding):
} finally {
    // 1. Cleanup MCP clients
    await cleanupMcpClients();

    // 2. Deregister agent hooks if any were registered
    if (agentDefinition.hooks) deregisterSkillHooks(setAppState, agentId);

    // 3. Clear readFileState map
    derivedContext.readFileState.clear();

    // 4. Clear messages array (release memory)
    messages.length = 0;

    // 5. Cleanup agent identity from AsyncLocalStorage
    cleanupAgentIdentity(agentId);

    // 6. Cleanup transcript writer
    cleanupTranscriptWriter(agentId);

    // 7. Kill any orphaned bash tasks for this agent
    cleanupTaskState(agentId, getAppState, setAppState);
}

// Mapping: K6→cleanupMcpClients, zZ6→deregisterSkillHooks, a36→cleanupAgentIdentity,
// Qx8→cleanupTranscriptWriter, t24→cleanupTaskState, z6→derivedContext, R→messages
```

### deregisterSkillHooks (zZ6)

**What it does:** Removes all hooks registered for this agent from the session hook registry.

**How it works:**
1. Get the session hooks map from appState
2. Delete the entry for this agentId
3. Log the cleanup

```javascript
// ============================================
// deregisterSkillHooks - Remove agent hooks from session
// Location: chunks.95.mjs:1830-1834
// ============================================

// ORIGINAL (for source lookup):
function zZ6(A, q) {
    A((K) => {
        return K.sessionHooks.delete(q), K
    }), k(`Cleared all session hooks for session ${q}`)
}

// READABLE (for understanding):
function deregisterSkillHooks(setAppState, agentId) {
    setAppState((state) => {
        state.sessionHooks.delete(agentId);
        return state;
    });
    log(`Cleared all session hooks for session ${agentId}`);
}

// Mapping: zZ6→deregisterSkillHooks, A→setAppState, q→agentId
```

### cleanupAgentIdentity (a36)

**What it does:** Removes the agent's identity from the global identity maps.

**How it works:**
1. Check if running in a session context (LR flag)
2. Delete the agentId from the identity map (E01)
3. Delete from the Ok8 map

```javascript
// ============================================
// cleanupAgentIdentity - Remove agent identity from global maps
// Location: chunks.93.mjs:278-281
// ============================================

// ORIGINAL (for source lookup):
function a36(A) {
    if (!LR) return;
    E01.delete(A), Ok8.delete(A)
}

// READABLE (for understanding):
function cleanupAgentIdentity(agentId) {
    if (!isSessionContext) return;
    agentIdentityMap.delete(agentId);
    agentMetadataMap.delete(agentId);
}

// Mapping: a36→cleanupAgentIdentity, A→agentId, LR→isSessionContext, E01→agentIdentityMap, Ok8→agentMetadataMap
```

### cleanupTranscriptWriter (Qx8)

**What it does:** Removes the transcript writer registration for this agent.

**How it works:**
1. Delete the agentId from the transcript writer map (Yr8)

```javascript
// ============================================
// cleanupTranscriptWriter - Remove transcript writer registration
// Location: chunks.174.mjs:1143-1145
// ============================================

// ORIGINAL (for source lookup):
function Qx8(A) {
    Yr8.delete(A)
}

// READABLE (for understanding):
function cleanupTranscriptWriter(agentId) {
    transcriptWriterMap.delete(agentId);
}

// Mapping: Qx8→cleanupTranscriptWriter, A→agentId, Yr8→transcriptWriterMap
```

### cleanupTaskState (t24)

**What it does:** Kills any orphaned bash tasks that were started by this agent but not properly cleaned up.

**How it works:**
1. Get the tasks map from appState
2. Find any running tasks owned by this agent
3. Kill each orphaned task
4. Log the cleanup

```javascript
// ============================================
// cleanupTaskState - Kill orphaned bash tasks for agent
// Location: chunks.95.mjs:1938-1942
// ============================================

// ORIGINAL (for source lookup):
function t24(A, q, K) {
    let Y = q().tasks ?? {};
    for (let [z, _] of Object.entries(Y))
        if (Gf(_) && _.agentId === A && _.status === "running") k(`killBashTasksForAgent: killing orphaned bash task ${z} (agent ${A} exiting)`), wQ6(z, K)
}

// READABLE (for understanding):
function cleanupTaskState(agentId, getAppState, setAppState) {
    let tasks = getAppState().tasks ?? {};
    for (let [taskId, task] of Object.entries(tasks)) {
        if (isBashTask(task) && task.agentId === agentId && task.status === "running") {
            log(`killBashTasksForAgent: killing orphaned bash task ${taskId} (agent ${agentId} exiting)`);
            killTask(taskId, setAppState);
        }
    }
}

// Mapping: t24→cleanupTaskState, A→agentId, q→getAppState, K→setAppState,
// Gf→isBashTask, wQ6→killTask
```

**Why this is critical:** If an agent starts a bash task (e.g., a long-running server process) and then exits abnormally, the bash process would continue running indefinitely. The cleanup ensures all child processes are terminated when the parent agent exits.

### Transcript Recording

During execution, messages are recorded to the transcript for persistence:

```javascript
// ============================================
// writeToTranscript - Record messages to sidechain transcript
// Location: chunks.174.mjs:1671-1673
// ============================================

// ORIGINAL (for source lookup):
async function dg(A, q, K) {
    await Jz().insertMessageChain(mTq(A), !0, q, K)
}

// READABLE (for understanding):
async function writeToTranscript(messages, agentId, parentUuid) {
    await getTranscriptWriter().insertMessageChain(
        convertToSidechainFormat(messages),
        true,  // isSidechain
        agentId,
        parentUuid
    );
}

// Mapping: dg→writeToTranscript, A→messages, q→agentId, K→parentUuid,
// Jz→getTranscriptWriter, mTq→convertToSidechainFormat
```

### Agent Metadata

Agent metadata is written for resume capability:

```javascript
// ============================================
// writeAgentMetadata - Write agent metadata for resume
// Location: chunks.174.mjs:1159-1164
// ============================================

// ORIGINAL (for source lookup):
async function gc6(A, q) {
    let K = STq(A);
    await sr6(zS1(K), {
        recursive: !0
    }), await tr6(K, JSON.stringify(q))
}

// READABLE (for understanding):
async function writeAgentMetadata(agentId, metadata) {
    let metadataPath = getMetadataPath(agentId);
    await fs.mkdir(dirname(metadataPath), { recursive: true });
    await fs.writeFile(metadataPath, JSON.stringify(metadata));
}

// Mapping: gc6→writeAgentMetadata, A→agentId, q→metadata,
// STq→getMetadataPath, sr6→fs.mkdir, tr6→fs.writeFile
```

**Why cleanup matters:** Without proper cleanup:
1. **Memory leaks** - Maps grow unbounded as agents are created and destroyed
2. **Orphan processes** - Child bash processes continue after agent exits
3. **Stale hooks** - Hook handlers fire for non-existent agents
4. **Failed resumes** - Corrupted transcript state prevents agent resume

---

## Tool Filtering Algorithm

### What it does

Determines which tools are available to a subagent based on:
- Agent definition's `tools` list
- Execution mode (async vs sync)
- Tool restrictions (excluded/allowed sets)

### How it works

**Location:** chunks.93.mjs:1568-1620

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on agent type
// Location: chunks.93.mjs:1568
// ============================================

// ORIGINAL (for source lookup):
function Xk8(A, q, K) {
    let Y = _c(A, q, K);
    return Y
}

// READABLE (for understanding):
function filterToolsForSubagent(agentDefinition, allTools, isAsync) {
    let result = resolveToolFilter(agentDefinition, allTools, isAsync);
    return result.resolvedTools;
}

// Mapping: Xk8→filterToolsForSubagent, _c→resolveToolFilter
```

### resolveToolFilter (_c) Algorithm

```javascript
// ============================================
// _c - resolveToolFilter - Resolve tool list with wildcards and restrictions
// Location: chunks.93.mjs:1590-1620
// ============================================

// READABLE (for understanding):
function resolveToolFilter(agentDefinition, allTools, isAsync) {
    let requestedTools = agentDefinition.tools;
    let resolvedTools = [];
    let warnings = [];

    // Step 1: Handle wildcard "*"
    if (requestedTools.includes("*")) {
        // Include all tools
        resolvedTools = [...allTools];
    } else {
        // Step 2: Resolve each requested tool
        for (let toolName of requestedTools) {
            let tool = findToolByName(allTools, toolName);
            if (tool) {
                resolvedTools.push(tool);
            } else {
                warnings.push(`Tool '${toolName}' not found`);
            }
        }
    }

    // Step 3: Apply async restrictions
    if (isAsync) {
        // Remove excluded tools (TaskOutput, ExitPlanMode, etc.)
        resolvedTools = resolvedTools.filter(
            (tool) => !EXCLUDED_TOOLS.has(tool.name)
        );
    }

    // Step 4: Check MCP requirements
    if (agentDefinition.requiredMcpServers?.length) {
        // Verify MCP servers are available
        // ... validation logic
    }

    return { resolvedTools, warnings };
}
```

### Tool Restriction Sets

**EXCLUDED_TOOLS (CW6)** - Tools excluded from background agents:
- `TaskOutput` - Would create polling loops
- `ExitPlanMode` - Requires user approval
- `EnterPlanMode` - Requires user approval
- `Agent` - Could spawn nested background agents
- `AskUserQuestion` - Would block indefinitely
- `TaskStop` - Background agents shouldn't manage tasks

**ASYNC_ALLOWED_TOOLS (eP1)** - Tools explicitly allowed for async:
- `Read`, `Write`, `Edit`, `Bash`
- `Grep`, `Glob`, `WebFetch`, `WebSearch`
- `TodoWrite`, `NotebookEdit`, `Skill`
- `StructuredOutput`, `ToolSearch`

### Why this approach

1. **Prevents hangs** - Background agents can't call blocking tools
2. **Security boundary** - Clear allowlist for unattended execution
3. **Flexibility** - Agent definitions can specify custom tool sets

---

## Fork Context Building

### What it does

When a subagent is spawned via the "Fork" feature (no explicit `subagent_type`), the parent's conversation context is cloned and passed to the child.

### How it works

```javascript
// ============================================
// Fx8 - cloneForkContext - Clone parent messages for fork subagent
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
function cloneForkContext(messages) {
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

    // Step 2: Filter orphaned tool_use blocks from assistant messages
    // Keep only tool_use blocks that have corresponding tool_results
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Reject if any tool_use has no matching tool_result
                return !content.some(
                    (block) => block.type === "tool_use" &&
                               block.id &&
                               !toolResultIds.has(block.id)
                );
            }
        }
        return true;
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→toolResultIds
```

### Why orphan filtering

When cloning context for a fork:
1. **Incomplete tool calls** - Parent may have tool_use without tool_result
2. **API validation** - Anthropic API rejects orphaned tool_use blocks
3. **Context hygiene** - Avoid confusing the child with incomplete operations

---

## Worktree Isolation (v2.1.76)

### What it does

Subagents can declare `isolation: "worktree"` to run in an isolated git worktree, preventing file conflicts with the parent agent.

### How it works

```javascript
// In agentLoopRunner, when isolation === "worktree":
let worktreeName = `agent-${agentId.slice(0, 8)}`;
let worktree = await createWorktree(worktreeName);

// Worktree structure:
// - Creates new branch: agent-{id}
// - Clones working directory to isolated path
// - Sets worktreePath in derived context
// - On completion: merges or keeps based on changes
```

### Creation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Worktree Isolation Flow                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. AgentTool.call() with isolation: "worktree"                             │
│     │                                                                        │
│     ▼                                                                        │
│  2. createWorktree(worktreeName)                                             │
│     • git worktree add .claude/worktrees/agent-{id} -b agent-{id}            │
│     • Returns { worktreePath, worktreeBranch, headCommit, gitRoot }         │
│     │                                                                        │
│     ▼                                                                        │
│  3. agentLoopRunner with worktreePath set                                    │
│     • All file operations relative to worktreePath                          │
│     • Child process cwd = worktreePath                                       │
│     │                                                                        │
│     ▼                                                                        │
│  4. On completion:                                                           │
│     • If no changes: remove worktree and branch                             │
│     • If changes: keep worktree, notify user                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Benefits

1. **True isolation** - Each subagent has own working directory
2. **Safe parallelism** - Multiple agents can edit files simultaneously
3. **Easy cleanup** - Worktrees removed automatically if no changes
4. **Conflict prevention** - No race conditions on file writes

---

## Related Documents

- [tools_integration.md](./tools_integration.md) - Tool assembly details
- [communication_and_coordination.md](./communication_and_coordination.md) - Teammate messaging
- [ui_interaction.md](./ui_interaction.md) - UI components for subagents
- [../26_background_agents/implementation.md](../26_background_agents/implementation.md) - Background task implementation

---

## Source Code Verification

### Verified Symbol Locations (2026-03-26)

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | ✓ Verified |
| `TvY` | isMessageRecordable | chunks.133.mjs:1561 | ✓ Verified |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788 | ✓ Verified |
| `vvY` | buildAgentSystemPrompt | chunks.133.mjs:1806 | ✓ Verified |
| `X66` | runWithAgentIdentity | chunks.133.mjs:841 | ✓ Verified |
| `Tf6` | getCurrentAgentIdentity | chunks.133.mjs:837 | ✓ Verified |
| `mc4` | agentIdentityStorage | chunks.133.mjs:835 | ✓ Verified |
| `Ux8` | executeSubagentStartHooks | chunks.175.mjs:2666 | ✓ Verified |
| `r24` | registerAgentHooks | chunks.95.mjs:1842 | ✓ Verified |
| `zZ6` | deregisterAgentHooks | chunks.95.mjs:1830 | ✓ Verified |
| `_c` | resolveToolFilter | chunks.93.mjs:1590 | ✓ Verified |
| `C01` | resolveModelConfig | chunks.93.mjs:1476 | ✓ Verified |
| `bI` | generateAgentId | chunks.93.mjs:1557 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |

### Incorrect Mappings Corrected

| Symbol | Wrong Mapping | Correct Mapping |
|--------|---------------|-----------------|
| `Kd7` | killAllRunningAgents | Crypto module export (chunks.72.mjs:2707) |
| `yjA` | markTaskCompleted | Constant 67108864 (chunks.15.mjs:212) |
| `CjA` | markTaskFailed | Constant 5242880 (chunks.15.mjs:214) |
| `wd7` | createForegroundTask | Crypto module export (chunks.72.mjs) |
| `zd7` | createAsyncTask | Crypto module export (chunks.72.mjs) |
| `na` | killTask | No single symbol - use `wQ6`, `U4q`, `d4q` |
