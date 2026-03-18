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
    // Phase 5: Hook firing - SubagentStart
    for await (let $6 of Ux8(L, A.agentType, r.signal)) {
        if ($6.additionalContexts && $6.additionalContexts.length > 0)
            e.push(...$6.additionalContexts);
    }
    // Phase 6: LLM Query Loop
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
            yield $6;
        }
    } finally {
        // Phase 11: Cleanup
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
// Location: chunks.133.mjs:1590
// ============================================

// Mapping: bI→generateAgentId
```

### cloneMap (DI)

**What it does:** Creates a shallow copy of a Map, used to clone `readFileState` for fork context isolation.

```javascript
// ============================================
// cloneMap - Map cloning utility
// Location: chunks.133.mjs:1597
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
// Location: chunks.133.mjs:1647
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
