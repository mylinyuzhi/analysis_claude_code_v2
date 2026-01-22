# Agent Loop Analysis - Claude Code v2.1.7

## Overview

The Agent Loop is the core execution engine of Claude Code, managing the iterative process of:
1. Sending messages to the LLM
2. Processing tool calls
3. Collecting tool results
4. Continuing until task completion

The architecture consists of multiple layers:
- **Task Tool Layer** (`xVA`) - Entry point for sub-agent execution
- **Agent Loop Generator** (`$f`) - Sets up agent context and delegates to message loop
- **Core Message Loop** (`aN`) - Handles streaming, tool execution, and recursion
- **Background Task Handlers** - Manage async/background execution

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `runSubagentLoop` ($f) - Main agent loop generator
- `coreMessageLoop` (aN) - Core message processing loop
- `TaskTool` (xVA) - Task tool for sub-agent execution
- `aggregateAsyncAgentExecution` (Im2) - Background agent message aggregation
- `streamShellCommand` (TH1) - Shell command streaming with progress

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Task Tool (xVA)                             │
│  Entry point: validates agent type, resolves model, handles     │
│  foreground/background execution modes                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  runSubagentLoop ($f)                            │
│  Sets up: system prompt, tools, MCP clients, skills,            │
│  hooks, abort controller, message context                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  coreMessageLoop (aN)                            │
│  Core loop: streaming API calls, tool execution,                │
│  auto-compaction, recursion for tool results                    │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│  Streaming Tool       │       │  Sequential Tool      │
│  Execution (_H1)      │       │  Execution (KM0)      │
│  (parallel mode)      │       │  (fallback mode)      │
└───────────────────────┘       └───────────────────────┘
```

---

## 1. Task Tool Entry Point

### TaskTool.call() - chunks.113.mjs:90-357

The Task tool (`xVA`) is the entry point for launching sub-agents.

```javascript
// ============================================
// TaskTool.call - Entry point for sub-agent execution
// Location: chunks.113.mjs:90-357
// ============================================

// ORIGINAL (for source lookup):
async call({
  prompt: A,
  subagent_type: Q,
  description: B,
  model: G,
  resume: Z,
  run_in_background: Y,
  max_turns: J
}, X, I, D, W) {
  let K = Date.now(),
    V = await X.getAppState(),
    F = V.toolPermissionContext.mode,
    H = X.options.agentDefinitions.activeAgents,
    E = mz0(H, V.toolPermissionContext, f3),
    z = E.find((b) => b.agentType === Q);
  if (!z) {
    // ... agent type validation
    throw Error(`Agent type '${Q}' not found. Available agents: ${E.map((S)=>S.agentType).join(", ")}`)
  }
  // ... model resolution, context setup
  let $ = YA1(z.model, X.options.mainLoopModel, G, F);

  // Background execution path
  if (Y === !0 && !nkA) {
    let b = Z || LS();
    // ... async launch with L32 (createFullyBackgroundedAgent)
    return { data: { isAsync: !0, status: "async_launched", ... } }
  }

  // Foreground execution path with background transition support
  else {
    // ... main loop with Promise.race for background signal
  }
}

// READABLE (for understanding):
async call({
  prompt,
  subagent_type,
  description,
  model: modelOverride,
  resume: resumeAgentId,
  run_in_background,
  max_turns
}, toolUseContext, canUseTool, sourceMessage, progressCallback) {

  const startTime = Date.now();
  const appState = await toolUseContext.getAppState();
  const permissionMode = appState.toolPermissionContext.mode;
  const activeAgents = toolUseContext.options.agentDefinitions.activeAgents;

  // Filter agents by permission context
  const availableAgents = filterAgentsByPermission(activeAgents, appState.toolPermissionContext, TASK_TOOL_NAME);
  const selectedAgent = availableAgents.find(a => a.agentType === subagent_type);

  if (!selectedAgent) {
    throw Error(`Agent type '${subagent_type}' not found. Available: ${availableAgents.map(a => a.agentType).join(", ")}`);
  }

  // Resolve model: agent.model → mainLoopModel → override → permissionMode
  const resolvedModel = resolveAgentModel(selectedAgent.model, toolUseContext.options.mainLoopModel, modelOverride, permissionMode);

  // BACKGROUND EXECUTION PATH
  if (run_in_background && !DISABLE_BACKGROUND_TASKS) {
    const agentId = resumeAgentId || generateAgentId();
    const task = createFullyBackgroundedAgent({ agentId, description, prompt, selectedAgent, setAppState });

    // Run in background via XA1 (async context wrapper)
    runInAsyncContext(agentContext, async () => {
      for await (const message of runSubagentLoop({ ...agentConfig, agentId })) {
        messages.push(message);
        updateTaskProgress(agentId, aggregateProgress(messages), setAppState);
      }
      markTaskCompleted(result, setAppState);
    });

    return { data: { isAsync: true, status: "async_launched", agentId, outputFile } };
  }

  // FOREGROUND EXECUTION PATH (with background transition support)
  else {
    const agentId = resumeAgentId || generateAgentId();
    const { taskId, backgroundSignal } = createBackgroundableAgent({ agentId, ... });

    const agentIterator = runSubagentLoop({ ...agentConfig, agentId })[Symbol.asyncIterator]();

    while (true) {
      // Show background hint after threshold (Qf5)
      if (!showedBackgroundHint && elapsed >= BACKGROUND_HINT_THRESHOLD && setToolJSX) {
        setToolJSX({ jsx: BackgroundShortcutHint, ... });
      }

      // Race between message and background signal
      const result = backgroundSignal
        ? await Promise.race([
            agentIterator.next().then(r => ({ type: "message", result: r })),
            backgroundSignal.then(() => ({ type: "background" }))
          ])
        : await agentIterator.next().then(r => ({ type: "message", result: r }));

      // Handle background transition (user pressed Ctrl+B)
      if (result.type === "background" && taskId) {
        const task = (await getAppState()).tasks[taskId];
        if (isLocalAgentTask(task) && task.isBackgrounded) {
          // Continue in background, return async result
          return { data: { isAsync: true, status: "async_launched", ... } };
        }
      }

      if (result.type !== "message") continue;
      if (result.result.done) break;

      // Accumulate messages and report progress
      messages.push(result.result.value);
    }

    return { data: { status: "completed", ...finalResult } };
  }
}

// Mapping: xVA→TaskTool, A→prompt, Q→subagent_type, B→description, G→modelOverride,
//          Z→resumeAgentId, Y→run_in_background, J→max_turns, X→toolUseContext,
//          nkA→DISABLE_BACKGROUND_TASKS, Qf5→BACKGROUND_HINT_THRESHOLD
```

**Key Design Decisions:**

1. **Dual Execution Modes**:
   - Fully background (`run_in_background: true`)
   - Foreground with background transition support (default)

2. **Promise.race Pattern**: Enables seamless transition to background via Ctrl+B
   - Races agent message stream against background signal
   - When background triggered, continues execution in async context

3. **Progress Tracking**: Updates task state with token count, tool use count, recent activities

---

## 2. Agent Loop Generator

### runSubagentLoop ($f) - chunks.112.mjs:2913-3057

The agent loop generator sets up the execution context and delegates to the core message loop.

```javascript
// ============================================
// runSubagentLoop - Main agent loop generator
// Location: chunks.112.mjs:2913-3057
// ============================================

// ORIGINAL (for source lookup):
async function* $f({
  agentDefinition: A,
  promptMessages: Q,
  toolUseContext: B,
  canUseTool: G,
  isAsync: Z,
  forkContextMessages: Y,
  querySource: J,
  override: X,
  model: I,
  maxTurns: D
}) {
  T9("subagents");
  let W = await B.getAppState(),
    K = W.toolPermissionContext.mode,
    V = YA1(A.model, B.options.mainLoopModel, I, K),
    F = X?.agentId ? X.agentId : LS(),
    E = [...Y ? vz0(Y) : [], ...Q],
    z = Y !== void 0 ? m9A(B.readFileState) : Id(u9A);
  // ... setup user/system context, tools, system prompt

  // Process skills from agent definition
  let AA = A.skills ?? [];
  for (let {skillName, skill} of loadedSkills) {
    let prompt = await skill.getPromptForCommand("", B);
    E.push(H0({ content: [{ type: "text", text: xz0(skillName, skill.progressMessage) }, ...prompt] }));
  }

  // Setup MCP clients and tools
  let { clients: n, tools: y, cleanup: p } = await sb5(A, B.options.mcpClients);
  let GA = [...j, ...y]; // Merge agent tools + MCP tools

  // Create child toolUseContext
  let MA = lkA(B, { options: WA, agentId: F, messages: E, ... });

  // Main loop delegation
  for await (let bA of aN({
    messages: E,
    systemPrompt: b,
    userContext: $,
    systemContext: O,
    canUseTool: G,
    toolUseContext: MA,
    querySource: J,
    maxTurns: D
  })) {
    if (bA.type === "attachment" && bA.attachment.type === "max_turns_reached") {
      break;
    }
    if (tb5(bA)) yield bA;
  }
}

// READABLE (for understanding):
async function* runSubagentLoop({
  agentDefinition,
  promptMessages,
  toolUseContext,
  canUseTool,
  isAsync,
  forkContextMessages,
  querySource,
  override,
  model: modelOverride,
  maxTurns
}) {
  trackFeatureUsage("subagents");

  const appState = await toolUseContext.getAppState();
  const permissionMode = appState.toolPermissionContext.mode;

  // 1. Resolve model with priority chain
  const resolvedModel = resolveAgentModel(
    agentDefinition.model,
    toolUseContext.options.mainLoopModel,
    modelOverride,
    permissionMode
  );

  // 2. Generate or use provided agent ID
  const agentId = override?.agentId || generateAgentId();

  // 3. Build initial messages (fork context + prompt messages)
  const messages = [
    ...(forkContextMessages ? filterOrphanedToolUses(forkContextMessages) : []),
    ...promptMessages
  ];

  // 4. Initialize read file state (shared or fresh)
  const readFileState = forkContextMessages !== undefined
    ? cloneReadFileState(toolUseContext.readFileState)
    : createEmptyState(readFileStateSchema);

  // 5. Get user/system context
  const [userContext, systemContext] = await Promise.all([
    override?.userContext ?? getUserContext(),
    override?.systemContext ?? getSystemContext()
  ]);

  // 6. Apply permission mode override for async agents
  const getAppState = async () => {
    const state = await toolUseContext.getAppState();
    let permContext = state.toolPermissionContext;

    if (agentDefinition.permissionMode && permContext.mode !== "bypassPermissions") {
      permContext = { ...permContext, mode: agentDefinition.permissionMode };
    }
    if (isAsync) {
      permContext = { ...permContext, shouldAvoidPermissionPrompts: true };
    }

    return { ...state, toolPermissionContext: permContext, queuedCommands: [] };
  };

  // 7. Resolve available tools
  const resolvedTools = resolveAgentTools(agentDefinition, toolUseContext.options.tools, isAsync).resolvedTools;

  // 8. Get system prompt
  const systemPrompt = override?.systemPrompt || await getAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, workingDirectories);

  // 9. Process hook contexts
  const hookContexts = [];
  for await (const hookResult of runSubagentStartHooks(agentId, agentDefinition.agentType, abortController.signal)) {
    if (hookResult.additionalContexts?.length > 0) {
      hookContexts.push(...hookResult.additionalContexts);
    }
  }
  if (hookContexts.length > 0) {
    messages.push(createHookContextMessage({ type: "hook_additional_context", content: hookContexts, ... }));
  }

  // 10. Register agent hooks
  if (agentDefinition.hooks) {
    registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
  }

  // 11. Preload skills from agent definition
  const skills = agentDefinition.skills ?? [];
  for (const { skillName, skill } of loadedSkills) {
    const promptContent = await skill.getPromptForCommand("", toolUseContext);
    messages.push(createUserMessage({
      content: [{ type: "text", text: formatSkillPrefix(skillName, skill.progressMessage) }, ...promptContent]
    }));
  }

  // 12. Setup MCP clients and tools
  const { clients: mcpClients, tools: mcpTools, cleanup } = await setupAgentMcpClients(agentDefinition, toolUseContext.options.mcpClients);
  const allTools = [...resolvedTools, ...mcpTools];

  // 13. Create child context
  const childContext = createChildToolUseContext(toolUseContext, {
    options: { ...options, tools: allTools, mcpClients },
    agentId,
    messages,
    readFileState,
    abortController,
    getAppState,
    shareSetAppState: !isAsync,
    shareSetResponseLength: true,
    criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL
  });

  // 14. Record transcript
  await recordSidechainTranscript(messages, agentId);

  // 15. Run core message loop
  try {
    for await (const message of coreMessageLoop({
      messages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool,
      toolUseContext: childContext,
      querySource,
      maxTurns
    })) {
      if (message.type === "attachment" && message.attachment.type === "max_turns_reached") {
        log(`[Agent: ${agentDefinition.agentType}] Reached max turns limit (${message.attachment.maxTurns})`);
        break;
      }
      if (shouldYieldMessage(message)) {
        yield message;
        await recordSidechainTranscript([message], agentId, lastMessageUuid);
      }
    }

    if (abortController.signal.aborted) throw new AbortError();
    if (isBuiltInAgent(agentDefinition) && agentDefinition.callback) {
      agentDefinition.callback();
    }
  } finally {
    await cleanup();
    if (agentDefinition.hooks) {
      unregisterAgentHooks(setAppState, agentId);
    }
  }
}

// Mapping: $f→runSubagentLoop, A→agentDefinition, Q→promptMessages, B→toolUseContext,
//          G→canUseTool, Z→isAsync, Y→forkContextMessages, J→querySource,
//          aN→coreMessageLoop, LS→generateAgentId, YA1→resolveAgentModel
```

**Key Setup Operations:**

1. **Model Resolution**: Priority chain (agent.model → mainLoopModel → override → permissionMode)
2. **Fork Context Handling**: Filters orphaned tool uses from forked conversation
3. **Permission Override**: Async agents get `shouldAvoidPermissionPrompts: true`
4. **Hook Processing**: SubagentStart hooks can inject additional context
5. **Skill Preloading**: Loads prompt-based skills from agent definition
6. **MCP Setup**: Initializes MCP clients specific to the agent

---

## 3. Tool Execution Aggregation

### aggregateToolResults (KM0) - chunks.134.mjs:571-610

The aggregation function manages the execution of multiple tool calls, alternating between parallel and sequential blocks based on concurrency safety.

```javascript
// ============================================
// aggregateToolResults - Main tool execution aggregator
// Location: chunks.134.mjs:571-610
// ============================================

// ORIGINAL (for source lookup):
async function* KM0(A, Q, B, G) {
  let Z = G;
  for (let { isConcurrencySafe: Y, blocks: J } of S77(A, Z))
    if (Y) {
      let X = {};
      for await (let I of y77(J, Q, B, Z)) {
        if (I.contextModifier) {
          let { toolUseID: D, modifyContext: W } = I.contextModifier;
          if (!X[D]) X[D] = [];
          X[D].push(W)
        }
        yield { message: I.message, newContext: Z }
      }
      for (let I of J) {
        let D = X[I.id];
        if (!D) continue;
        for (let W of D) Z = W(Z)
      }
      yield { newContext: Z }
    } else
      for await (let X of x77(J, Q, B, Z)) {
        if (X.newContext) Z = X.newContext;
        yield { message: X.message, newContext: Z }
      }
}

// READABLE (for understanding):
async function* aggregateToolResults(toolCalls, assistantMessages, canUseTool, initialContext) {
  let currentContext = initialContext;

  // Group tools by concurrency safety (S77)
  const groups = groupToolsByConcurrency(toolCalls, currentContext);

  for (const group of groups) {
    if (group.isConcurrencySafe) {
      // PARALLEL EXECUTION BLOCK (y77)
      const toolIdToModifiers = {};

      for await (const result of executeParallelBlock(group.blocks, assistantMessages, canUseTool, currentContext)) {
        if (result.contextModifier) {
          const { toolUseID, modifyContext } = result.contextModifier;
          if (!toolIdToModifiers[toolUseID]) toolIdToModifiers[toolUseID] = [];
          toolIdToModifiers[toolUseID].push(modifyContext);
        }
        // Yield results with the ORIGINAL context of the block
        yield { message: result.message, newContext: currentContext };
      }

      // Context merging logic (Reduction Pattern)
      for (const block of group.blocks) {
        const modifiers = toolIdToModifiers[block.id];
        if (modifiers) {
          for (const modify of modifiers) {
            currentContext = modify(currentContext); // Chain state updates
          }
        }
      }
      // Yield the final context after all parallel tools finished
      yield { newContext: currentContext };

    } else {
      // SEQUENTIAL EXECUTION BLOCK (x77)
      for await (const result of executeSequentialBlock(group.blocks, assistantMessages, canUseTool, currentContext)) {
        if (result.newContext) currentContext = result.newContext;
        yield result;
      }
    }
  }
}

// Mapping: KM0→aggregateToolResults, S77→groupToolsByConcurrency, y77→executeParallelBlock,
//          x77→executeSequentialBlock, G→initialContext, Z→currentContext
```

### Context Merging Strategy (Reduction Pattern)

**What it does:** Safely merges state updates from multiple tools executed in parallel.

**How it works:**
1. Each tool in a parallel block receives the *same* initial context.
2. Tools return `contextModifier` functions rather than full context objects.
3. The loop collects these modifiers without applying them immediately.
4. Once the block completes, the modifiers are applied sequentially to the context: `context = modifier(context)`.

**Why this approach:**
- **Consistency**: Prevents tools from seeing intermediate states of sibling tools in the same block.
- **Composition**: Allows multiple tools to contribute to the state (e.g. updating `readFileState` for different files) without conflicts.
- **Safety**: Non-concurrent tools (which might have overlapping side effects) are guaranteed to run sequentially.

**Key Insight:**
The use of functional reduction for state updates is a robust way to handle concurrency in an asynchronous environment. However, a potential bug was identified in `StreamingToolExecutor` (`_H1`) where it stores modifiers for concurrent tools but fails to apply them, unlike the fallback `KM0` implementation.

---

## 4. Core Message Loop

### coreMessageLoop (aN) - chunks.134.mjs:99-410

The core message loop handles the actual API streaming, tool execution, and recursive continuation.

**Key Message Normalization Logic:**
- `normalizeMessages` (`_x`) slices messages from the last `compact_boundary` system message. This ensures that the LLM only sees messages since the last compaction.
- `addUserContextToMessages` (`_3A`) prepends a `<system-reminder>` user message with the provided user context.
- `mergeSystemPromptWithContext` (`fA9`) appends the system context lines to the system prompt.

**Token Estimation Strategy (`HKA` / `l7` / `It8`):**
- **Text estimation**: `Math.round(text.length / 4)` tokens.
- **Images**: Fixed cost of **1334 tokens** per image.
- **Incremental Estimation**: The loop finds the last assistant message with a real `usage` object and adds the estimated tokens for subsequent messages to get the current total.

```javascript
// ============================================
// coreMessageLoop - Core message processing loop
// Location: chunks.134.mjs:99-410
// ============================================

// ORIGINAL (for source lookup):
async function* aN({
  messages: A,
  systemPrompt: Q,
  userContext: B,
  systemContext: G,
  canUseTool: Z,
  toolUseContext: Y,
  autoCompactTracking: J,
  fallbackModel: X,
  stopHookActive: I,
  querySource: D,
  maxOutputTokensOverride: W,
  maxOutputTokensRecoveryCount: K = 0,
  maxTurns: V,
  turnCount: F = 1
}) {
  yield { type: "stream_request_start" };

  // Query tracking setup
  let H = Y.queryTracking ? { chainId: Y.queryTracking.chainId, depth: Y.queryTracking.depth + 1 }
    : { chainId: X19(), depth: 0 };

  // Micro-compaction (token optimization)
  let O = await lc(z, void 0, Y);

  // Auto-compaction (context window management)
  let { compactionResult: L } = await ys2(z, Y, D);
  if (L) {
    for (let t of FHA(L)) yield t;
    z = s; // Update messages to compacted form
  }

  // Main streaming loop
  let y = !0;
  while (y) {
    y = !1;
    try {
      for await (let wA of oHA({
        messages: _3A(z, B),
        systemPrompt: f,
        maxThinkingTokens: Y.options.maxThinkingTokens,
        tools: Y.options.tools,
        signal: Y.abortController.signal,
        options: { model: u, ... }
      })) {
        yield wA;
        if (wA.type === "assistant") {
          M.push(wA);
          if (x) { // Streaming tool execution
            for (let toolUse of wA.message.content.filter(c => c.type === "tool_use")) {
              x.addTool(toolUse, wA);
            }
          }
        }
        // Yield completed tool results (parallel execution)
        if (x) {
          for (let result of x.getCompletedResults()) {
            if (result.message) yield result.message;
          }
        }
      }
    } catch (zA) {
      // Model fallback on overload
      if (zA instanceof y51 && X) {
        u = X; y = !0;
        yield* DM0(M, "Model fallback triggered");
        continue;
      }
      throw zA;
    }
  }

  // Tool execution (remaining)
  let GA = M.flatMap(zA => zA.message.content.filter(wA => wA.type === "tool_use"));
  if (!GA.length) {
    // No tools - check for max_output_tokens recovery
    if (M[M.length - 1]?.apiError === "max_output_tokens" && K < j77) {
      // Recursive call with recovery message
      yield* aN({ ..., maxOutputTokensRecoveryCount: K + 1, ... });
      return;
    }
    // Handle stop hooks and attachments
    return;
  }

  // Execute remaining tools
  for await (let zA of x.getRemainingResults()) {
    yield zA.message;
    _.push(...FI([zA.message], Y.options.tools).filter(_A => _A.type === "user"));
  }

  // Recursive call for continuation
  let OA = [...z, ...M, ..._];
  let IA = F + 1;
  if (V && IA > V) {
    yield X4({ type: "max_turns_reached", maxTurns: V, turnCount: IA });
    return;
  }

  yield* aN({
    messages: OA,
    systemPrompt: Q,
    userContext: B,
    systemContext: G,
    canUseTool: Z,
    toolUseContext: MA,
    autoCompactTracking: $,
    fallbackModel: X,
    querySource: D,
    maxTurns: V,
    turnCount: IA
  });
}

// READABLE (for understanding):
async function* coreMessageLoop({
  messages,
  systemPrompt,
  userContext,
  systemContext,
  canUseTool,
  toolUseContext,
  autoCompactTracking,
  fallbackModel,
  stopHookActive,
  querySource,
  maxOutputTokensOverride,
  maxOutputTokensRecoveryCount = 0,
  maxTurns,
  turnCount = 1
}) {
  yield { type: "stream_request_start" };

  // 1. Setup query tracking (chain ID + depth)
  const queryTracking = toolUseContext.queryTracking
    ? { chainId: toolUseContext.queryTracking.chainId, depth: toolUseContext.queryTracking.depth + 1 }
    : { chainId: generateUUID(), depth: 0 };

  // 2. Apply message transformations
  let processedMessages = normalizeMessages(messages);

  // 3. Micro-compaction (token optimization for individual messages)
  const microCompactResult = await microCompact(processedMessages, undefined, toolUseContext);
  processedMessages = microCompactResult.messages;
  if (microCompactResult.compactionInfo?.systemMessage) {
    yield microCompactResult.compactionInfo.systemMessage;
  }

  // 4. Auto-compaction (context window management)
  const { compactionResult } = await autoCompact(processedMessages, toolUseContext, querySource);
  if (compactionResult) {
    logTelemetry("tengu_auto_compact_succeeded", {
      originalMessageCount: messages.length,
      compactedMessageCount: compactionResult.summaryMessages.length + compactionResult.attachments.length,
      preCompactTokenCount: compactionResult.preCompactTokenCount,
      postCompactTokenCount: compactionResult.postCompactTokenCount
    });

    const compactedMessages = formatCompactionResult(compactionResult);
    for (const msg of compactedMessages) yield msg;
    processedMessages = compactedMessages;
  }

  // 5. Initialize streaming tool executor (if feature enabled)
  const streamingToolExecutor = isFeatureEnabled("tengu_streaming_tool_execution2")
    ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
    : null;

  // 6. Resolve model with permission mode consideration
  const appState = await toolUseContext.getAppState();
  const permissionMode = appState.toolPermissionContext.mode;
  const model = resolveModelWithPermissions({
    permissionMode,
    mainLoopModel: toolUseContext.options.mainLoopModel,
    exceeds200kTokens: permissionMode === "plan" && exceeds200kTokens(processedMessages)
  });

  // 7. Check blocking token limit
  if (isAtBlockingLimit(countTokens(processedMessages))) {
    yield createErrorAttachment({ content: TOKEN_LIMIT_ERROR, error: "invalid_request" });
    return;
  }

  // 8. Main API streaming loop (with retry support)
  const assistantMessages = [];
  const toolResultMessages = [];
  let shouldRetry = true;

  while (shouldRetry) {
    shouldRetry = false;

    try {
      let streamingFallbackTriggered = false;

      // Stream API response
      for await (const message of streamApiCall({
        messages: addUserContextToMessages(processedMessages, userContext),
        systemPrompt: mergeSystemPromptWithContext(systemPrompt, systemContext),
        maxThinkingTokens: toolUseContext.options.maxThinkingTokens,
        tools: toolUseContext.options.tools,
        signal: toolUseContext.abortController.signal,
        options: {
          model,
          fallbackModel,
          onStreamingFallback: () => { streamingFallbackTriggered = true; },
          querySource,
          mcpTools: appState.mcp.tools,
          queryTracking
        }
      })) {
        // Handle streaming fallback (tombstone previous messages)
        if (streamingFallbackTriggered) {
          for (const msg of assistantMessages) {
            yield { type: "tombstone", message: msg };
          }
          assistantMessages.length = 0;
          toolResultMessages.length = 0;
          if (streamingToolExecutor) {
            streamingToolExecutor.discard();
          }
        }

        yield message;

        // Track assistant messages
        if (message.type === "assistant") {
          assistantMessages.push(message);

          // Feed tool uses to streaming executor
          if (streamingToolExecutor) {
            const toolUses = message.message.content.filter(c => c.type === "tool_use");
            for (const toolUse of toolUses) {
              streamingToolExecutor.addTool(toolUse, message);
            }
          }
        }

        // Yield completed tool results (parallel execution)
        if (streamingToolExecutor) {
          for (const result of streamingToolExecutor.getCompletedResults()) {
            if (result.message) {
              yield result.message;
              toolResultMessages.push(...normalizeToolResults([result.message], toolUseContext.options.tools));
            }
          }
        }
      }

    } catch (error) {
      // Model fallback on overload error
      if (error instanceof OverloadError && fallbackModel) {
        model = fallbackModel;
        shouldRetry = true;
        yield* tombstoneMessages(assistantMessages, "Model fallback triggered");
        assistantMessages.length = 0;
        logTelemetry("tengu_model_fallback_triggered", { original_model: error.originalModel, fallback_model: fallbackModel });
        yield createSystemMessage(`Model fallback triggered: switching from ${error.originalModel} to ${error.fallbackModel}`, "info");
        continue;
      }
      throw error;
    }
  }

  // 9. Handle abort
  if (toolUseContext.abortController.signal.aborted) {
    if (streamingToolExecutor) {
      for await (const result of streamingToolExecutor.getRemainingResults()) {
        if (result.message) yield result.message;
      }
    } else {
      yield* tombstoneMessages(assistantMessages, "Interrupted by user");
    }
    yield createInterruptedAttachment({ toolUse: false });
    return;
  }

  // 10. Check for tool calls
  const toolCalls = assistantMessages.flatMap(m => m.message.content.filter(c => c.type === "tool_use"));

  if (!assistantMessages.length || !toolCalls.length) {
    // No tool calls - check for max_output_tokens recovery
    const lastMessage = assistantMessages[assistantMessages.length - 1];
    if (lastMessage?.apiError === "max_output_tokens" && maxOutputTokensRecoveryCount < MAX_RECOVERY_ATTEMPTS) {
      const recoveryMessage = createUserMessage({
        content: "Your response was cut off because it exceeded the output token limit. Please break your work into smaller pieces. Continue from where you left off.",
        isMeta: true
      });

      // Recursive call with recovery
      yield* coreMessageLoop({
        messages: [...processedMessages, ...assistantMessages, recoveryMessage],
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        toolUseContext,
        autoCompactTracking,
        fallbackModel,
        querySource,
        maxOutputTokensRecoveryCount: maxOutputTokensRecoveryCount + 1,
        maxTurns,
        turnCount
      });
      return;
    }

    // Handle stop hooks and final attachments
    yield* handleStopHooks(...);
    yield* handleFinalAttachments(...);
    return;
  }

  // 11. Execute remaining tools
  let hookStopped = false;
  let updatedContext = toolUseContext;

  if (streamingToolExecutor) {
    for await (const result of streamingToolExecutor.getRemainingResults()) {
      if (result.message) {
        yield result.message;
        if (result.message.type === "attachment" && result.message.attachment.type === "hook_stopped_continuation") {
          hookStopped = true;
        }
        toolResultMessages.push(...normalizeToolResults([result.message], toolUseContext.options.tools));
      }
    }
    updatedContext = { ...streamingToolExecutor.getUpdatedContext(), queryTracking };
  } else {
    // Sequential tool execution (fallback)
    for await (const result of executeToolsSequentially(toolCalls, assistantMessages, canUseTool, toolUseContext)) {
      if (result.message) {
        yield result.message;
        if (result.message.type === "attachment" && result.message.attachment.type === "hook_stopped_continuation") {
          hookStopped = true;
        }
        toolResultMessages.push(...normalizeToolResults([result.message], toolUseContext.options.tools));
      }
      if (result.newContext) {
        updatedContext = { ...result.newContext, queryTracking };
      }
    }
  }

  // 12. Handle abort after tool execution
  if (toolUseContext.abortController.signal.aborted) {
    yield createInterruptedAttachment({ toolUse: true });
    const nextTurn = turnCount + 1;
    if (maxTurns && nextTurn > maxTurns) {
      yield createMaxTurnsAttachment({ maxTurns, turnCount: nextTurn });
    }
    return;
  }

  // 13. Check for hook stop
  if (hookStopped) return;

  // 14. Track auto-compact progress
  if (autoCompactTracking?.compacted) {
    autoCompactTracking.turnCounter++;
    logTelemetry("tengu_post_autocompact_turn", { turnId: autoCompactTracking.turnId, turnCounter: autoCompactTracking.turnCounter });
  }

  // 15. Process queued commands and attachments
  const queuedCommands = [...(await updatedContext.getAppState()).queuedCommands];
  for await (const attachment of processAttachments(null, updatedContext, null, queuedCommands, [...processedMessages, ...assistantMessages, ...toolResultMessages], querySource)) {
    yield attachment;
    toolResultMessages.push(attachment);
  }

  // 16. Check max turns limit
  const nextTurn = turnCount + 1;
  if (maxTurns && nextTurn > maxTurns) {
    yield createMaxTurnsAttachment({ maxTurns, turnCount: nextTurn });
    return;
  }

  // 17. Recursive call for next turn
  yield* coreMessageLoop({
    messages: [...processedMessages, ...assistantMessages, ...toolResultMessages],
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext: updatedContext,
    autoCompactTracking,
    fallbackModel,
    querySource,
    maxTurns,
    turnCount: nextTurn
  });
}

// Mapping: aN→coreMessageLoop, A→messages, Q→systemPrompt, B→userContext, G→systemContext,
//          Z→canUseTool, Y→toolUseContext, X→fallbackModel, D→querySource, V→maxTurns,
//          F→turnCount, oHA→streamApiCall, _H1→StreamingToolExecutor
```

**Key Algorithm: Recursive Turn-Based Execution**

1. **Pre-processing**: Normalize messages, apply micro/auto-compaction
2. **API Streaming**: Stream LLM response with parallel tool execution
3. **Error Handling**: Model fallback on overload, max_output_tokens recovery
4. **Tool Execution**: Parallel (streaming) or sequential execution
5. **Continuation**: Recursive call with updated messages for next turn
6. **Termination**: Max turns limit, hook stop, abort signal, or no tool calls

---

## 4. Background Agent Aggregation

### aggregateAsyncAgentExecution (Im2) - chunks.121.mjs:486-542

Aggregates messages from background agent execution and updates task state.

```javascript
// ============================================
// aggregateAsyncAgentExecution - Background agent message aggregation
// Location: chunks.121.mjs:486-542
// ============================================

// ORIGINAL (for source lookup):
function Im2(A, Q, B, G, Z = [], Y) {
  (async () => {
    try {
      let J = [...Z],
        X = [],
        I = 0,
        D = 0;
      while (!0) {
        if (Y?.aborted) {
          G(J);
          return
        }
        let { done: W, value: K } = await A.next();
        if (W) break;
        if (K.type === "user" || K.type === "assistant" || K.type === "system") {
          if (J.push(K), K.type === "assistant") {
            for (let V of K.message.content)
              if (V.type === "text") D += Math.round(V.text.length / 4);
              else if (V.type === "tool_use") {
                I++;
                let F = { toolName: V.name, input: V.input };
                if (X.push(F), X.length > wi5) X.shift()
              }
          }
          B((V) => {
            let F = V.tasks[Q];
            if (!F || F.type !== "local_agent") return V;
            return {
              ...V,
              tasks: {
                ...V.tasks,
                [Q]: {
                  ...F,
                  progress: { tokenCount: D, toolUseCount: I, recentActivities: [...X] },
                  messages: J
                }
              }
            }
          })
        }
      }
      G(J), Zm2(Q, !0, B)
    } catch (J) {
      e(J instanceof Error ? J : Error(String(J))), Zm2(Q, !1, B)
    }
  })()
}

// READABLE (for understanding):
function aggregateAsyncAgentExecution(
  messageGenerator,        // Async generator yielding messages
  taskId,                  // Task identifier
  setAppState,            // State updater function
  finalCallback,          // Called with final messages array
  initialMessages = [],   // Initial messages to include
  abortSignal             // Optional abort signal
) {
  (async () => {
    try {
      const allMessages = [...initialMessages];
      const recentToolCalls = [];
      let toolUseCount = 0;
      let estimatedTokens = 0;

      while (true) {
        // Check for abort
        if (abortSignal?.aborted) {
          finalCallback(allMessages);
          return;
        }

        // Get next message from generator
        const { done, value: message } = await messageGenerator.next();
        if (done) break;

        // Only process user/assistant/system messages
        if (message.type === "user" || message.type === "assistant" || message.type === "system") {
          allMessages.push(message);

          // Track progress for assistant messages
          if (message.type === "assistant") {
            for (const block of message.message.content) {
              if (block.type === "text") {
                // Estimate tokens as text.length / 4
                estimatedTokens += Math.round(block.text.length / 4);
              } else if (block.type === "tool_use") {
                toolUseCount++;
                const toolCall = { toolName: block.name, input: block.input };
                recentToolCalls.push(toolCall);
                // Keep only last 5 tool calls
                if (recentToolCalls.length > MAX_RECENT_TOOLS) {
                  recentToolCalls.shift();
                }
              }
            }
          }

          // Update task state with progress
          setAppState((state) => {
            const task = state.tasks[taskId];
            if (!task || task.type !== "local_agent") return state;

            return {
              ...state,
              tasks: {
                ...state.tasks,
                [taskId]: {
                  ...task,
                  progress: {
                    tokenCount: estimatedTokens,
                    toolUseCount: toolUseCount,
                    recentActivities: [...recentToolCalls]
                  },
                  messages: allMessages
                }
              }
            };
          });
        }
      }

      // Success - call completion handler
      finalCallback(allMessages);
      markTaskCompleted(taskId, true, setAppState);

    } catch (error) {
      logError(error instanceof Error ? error : Error(String(error)));
      markTaskCompleted(taskId, false, setAppState);
    }
  })();
}

// Mapping: Im2→aggregateAsyncAgentExecution, A→messageGenerator, Q→taskId,
//          B→setAppState, G→finalCallback, Z→initialMessages, Y→abortSignal,
//          wi5→MAX_RECENT_TOOLS (5), Zm2→markTaskCompleted
```

**Progress Tracking:**
- **Token Count**: Estimated as `text.length / 4` for text blocks
- **Tool Use Count**: Incremented for each `tool_use` block
- **Recent Activities**: Last 5 tool calls with name and input

---

## 5. Streaming Tool Executor

### StreamingToolExecutor (_H1) - chunks.133.mjs:2911-3087

The `StreamingToolExecutor` class enables parallel tool execution while streaming, significantly improving responsiveness for multiple tool calls.

```javascript
// ============================================
// StreamingToolExecutor - Parallel Tool Execution During Streaming
// Location: chunks.133.mjs:2911-3087
// ============================================

// ORIGINAL (for source lookup):
class _H1 {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;
  discarded = !1;
  progressAvailableResolve;

  constructor(A, Q, B) {
    this.toolDefinitions = A;
    this.canUseTool = Q;
    this.toolUseContext = B
  }

  addTool(A, Q) {
    let B = this.toolDefinitions.find((Y) => Y.name === A.name);
    // ... validation and queuing
    this.tools.push({
      id: A.id,
      block: A,
      assistantMessage: Q,
      status: "queued",
      isConcurrencySafe: Z,
      pendingProgress: []
    });
    this.processQueue()
  }

  canExecuteTool(A) {
    let Q = this.tools.filter((B) => B.status === "executing");
    return Q.length === 0 || A && Q.every((B) => B.isConcurrencySafe)
  }

  async processQueue() {
    for (let A of this.tools) {
      if (A.status !== "queued") continue;
      if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
      else if (!A.isConcurrencySafe) break
    }
  }
}

// READABLE (for understanding):
class StreamingToolExecutor {
  toolDefinitions;      // Available tool definitions
  canUseTool;           // Permission checker function
  tools = [];           // Queue of tool executions
  toolUseContext;       // Execution context
  hasErrored = false;   // Error state flag
  discarded = false;    // Streaming fallback flag
  progressAvailableResolve;  // Promise resolver for progress waiting

  constructor(toolDefinitions, canUseTool, toolUseContext) {
    this.toolDefinitions = toolDefinitions;
    this.canUseTool = canUseTool;
    this.toolUseContext = toolUseContext;
  }

  // Called for each tool_use block as it streams in
  addTool(toolUseBlock, assistantMessage) {
    const toolDef = this.toolDefinitions.find(t => t.name === toolUseBlock.name);

    // Unknown tool - immediate error result
    if (!toolDef) {
      this.tools.push({
        id: toolUseBlock.id,
        block: toolUseBlock,
        assistantMessage,
        status: "completed",
        isConcurrencySafe: true,
        pendingProgress: [],
        results: [createUserMessage({
          content: [{
            type: "tool_result",
            content: `<tool_use_error>Error: No such tool available: ${toolUseBlock.name}</tool_use_error>`,
            is_error: true,
            tool_use_id: toolUseBlock.id
          }]
        })]
      });
      return;
    }

    // Validate input and check concurrency safety
    const parsed = toolDef.inputSchema.safeParse(toolUseBlock.input);
    const isConcurrencySafe = parsed?.success ? toolDef.isConcurrencySafe(parsed.data) : false;

    this.tools.push({
      id: toolUseBlock.id,
      block: toolUseBlock,
      assistantMessage,
      status: "queued",
      isConcurrencySafe,
      pendingProgress: []
    });

    // Trigger queue processing (may start execution immediately)
    this.processQueue();
  }

  // Determine if a tool can be executed now
  canExecuteTool(isConcurrencySafe) {
    const executing = this.tools.filter(t => t.status === "executing");

    // Can execute if:
    // 1. Nothing is currently executing, OR
    // 2. New tool is concurrency-safe AND all executing tools are concurrency-safe
    return executing.length === 0 ||
           (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
  }

  // Process queued tools
  async processQueue() {
    for (const tool of this.tools) {
      if (tool.status !== "queued") continue;

      if (this.canExecuteTool(tool.isConcurrencySafe)) {
        // Start execution
        await this.executeTool(tool);
      } else if (!tool.isConcurrencySafe) {
        // Non-concurrent tool blocks further processing
        break;
      }
    }
  }

  // Execute a single tool
  async executeTool(tool) {
    tool.status = "executing";
    this.toolUseContext.setInProgressToolUseIDs(ids => new Set([...ids, tool.id]));

    const results = [];
    const contextModifiers = [];

    const execution = (async () => {
      // Check for abort conditions
      const abortReason = this.getAbortReason();
      if (abortReason) {
        results.push(this.createSyntheticErrorMessage(tool.id, abortReason, tool.assistantMessage));
        tool.results = results;
        tool.status = "completed";
        return;
      }

      // Execute tool via executeSingleToolGenerator
      const generator = executeSingleToolGenerator(tool.block, tool.assistantMessage, this.canUseTool, this.toolUseContext);
      let hasReceivedError = false;

      for await (const item of generator) {
        const abortReason = this.getAbortReason();
        if (abortReason && !hasReceivedError) {
          results.push(this.createSyntheticErrorMessage(tool.id, abortReason, tool.assistantMessage));
          break;
        }

        // Check for error results
        if (item.message.type === "user" &&
            Array.isArray(item.message.message.content) &&
            item.message.message.content.some(c => c.type === "tool_result" && c.is_error === true)) {
          this.hasErrored = true;
          hasReceivedError = true;
        }

        if (item.message) {
          if (item.message.type === "progress") {
            // Progress messages can be yielded immediately
            tool.pendingProgress.push(item.message);
            if (this.progressAvailableResolve) {
              this.progressAvailableResolve();
              this.progressAvailableResolve = undefined;
            }
          } else {
            results.push(item.message);
          }
        }

        if (item.contextModifier) {
          contextModifiers.push(item.contextModifier.modifyContext);
        }
      }

      tool.results = results;
      tool.contextModifiers = contextModifiers;
      tool.status = "completed";

      // Apply context modifiers for non-concurrent tools
      if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
        for (const modifier of contextModifiers) {
          this.toolUseContext = modifier(this.toolUseContext);
        }
      }
    })();

    tool.promise = execution;

    // Chain to process next queued tool when this completes
    execution.finally(() => {
      this.processQueue();
    });
  }

  // Get completed results (non-blocking)
  *getCompletedResults() {
    if (this.discarded) return;

    for (const tool of this.tools) {
      // Yield any pending progress first
      while (tool.pendingProgress.length > 0) {
        yield { message: tool.pendingProgress.shift() };
      }

      if (tool.status === "yielded") continue;

      if (tool.status === "completed" && tool.results) {
        tool.status = "yielded";
        for (const result of tool.results) {
          yield { message: result };
        }
        removeFromInProgressToolUseIDs(this.toolUseContext, tool.id);
      } else if (tool.status === "executing" && !tool.isConcurrencySafe) {
        // Non-concurrent tool blocks further yielding
        break;
      }
    }
  }

  // Get all remaining results (blocking)
  async *getRemainingResults() {
    if (this.discarded) return;

    while (this.hasUnfinishedTools()) {
      await this.processQueue();

      for (const result of this.getCompletedResults()) {
        yield result;
      }

      // Wait for executing tools if no results available
      if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
        const promises = this.tools
          .filter(t => t.status === "executing" && t.promise)
          .map(t => t.promise);

        const progressPromise = new Promise(resolve => {
          this.progressAvailableResolve = resolve;
        });

        if (promises.length > 0) {
          await Promise.race([...promises, progressPromise]);
        }
      }
    }

    // Final yield of any remaining results
    for (const result of this.getCompletedResults()) {
      yield result;
    }
  }

  getUpdatedContext() {
    return this.toolUseContext;
  }
}

// Mapping: _H1→StreamingToolExecutor, jH1→executeSingleToolGenerator, C77→removeFromInProgressToolUseIDs
```

### Tool Execution States

```
Tool Lifecycle:
  queued → executing → completed → yielded

State Transitions:
┌─────────┐  processQueue()  ┌───────────┐  results ready  ┌───────────┐  yielded  ┌─────────┐
│ queued  │ ───────────────▶ │ executing │ ──────────────▶ │ completed │ ────────▶ │ yielded │
└─────────┘                  └───────────┘                 └───────────┘           └─────────┘
                                   │
                                   ▼ error
                             ┌───────────┐
                             │ completed │ (with error result)
                             │ is_error  │
                             └───────────┘
```

### Concurrency Control Algorithm

**What it does:** Determines which tools can run in parallel vs must run sequentially.

**How it works:**

1. **Concurrency-Safe Tools** (can run in parallel):
   - Read-only operations (Read, Glob, Grep)
   - Stateless computations
   - Tools that don't modify context

2. **Non-Concurrent Tools** (must run sequentially):
   - Write operations (Edit, Write)
   - State-modifying operations
   - Tools with side effects

```
Example: Mixed Tool Execution

Tools queued: [Read, Grep, Edit, Glob]

Execution order:
┌─────────────────────────────────────────────────────────────┐
│ t=0:  Read (concurrent) ──┐                                 │
│       Grep (concurrent) ──┼── Both start immediately        │
│                           │                                 │
│ t=1:  Read completes     ──┐                                │
│       Grep completes     ──┼── Both yield results           │
│                           │                                 │
│ t=2:  Edit (non-concurrent) starts                          │
│       Glob waits (queued) ◀── Blocked by non-concurrent    │
│                           │                                 │
│ t=3:  Edit completes ─────── Yields result                  │
│       Glob starts ────────── Now can execute               │
│                           │                                 │
│ t=4:  Glob completes ─────── Final result                   │
└─────────────────────────────────────────────────────────────┘
```

### Abort Handling

The executor handles three abort scenarios:

| Abort Reason | Trigger | Action |
|--------------|---------|--------|
| `streaming_fallback` | `discard()` called | All pending tools get synthetic error |
| `sibling_error` | Another tool returned `is_error: true` | Subsequent tools get synthetic error |
| `user_interrupted` | User pressed Ctrl+C | Tools get "User rejected" error |

### Key Design Decisions

1. **Progress Streaming**: Progress messages are yielded immediately via `pendingProgress` array
2. **Context Modifier Application**: Non-concurrent tools apply context modifiers after completion
3. **Promise.race for Waiting**: Efficiently waits for either tool completion or new progress
4. **Synthetic Error Messages**: Consistent error format for aborted tools

---

## 6. Shell Command Streaming

### streamShellCommand - chunks.124.mjs:1310-1360

Streams shell command output with progress updates and background transition support.

```javascript
// ============================================
// streamShellCommand (TH1 inner loop) - Shell streaming with background support
// Location: chunks.124.mjs:1310-1360
// ============================================

// ORIGINAL (for source lookup):
let M = Date.now(),
  _ = M + Nd2,
  j = void 0;
while (!0) {
  let x = Date.now(),
    b = Math.max(0, _ - x),
    S = await Promise.race([$, new Promise((AA) => setTimeout(() => AA(null), b))]);
  if (S !== null) {
    if (j) Km2(j, B);
    return S
  }
  if (H) return { stdout: "", stderr: "", code: 0, interrupted: !1, backgroundTaskId: H };
  if (j) {
    if (z.status === "backgrounded") return {
      stdout: "", stderr: "", code: 0, interrupted: !1,
      backgroundTaskId: j, backgroundedByUser: !0
    }
  }
  let u = Date.now() - M,
    f = Math.floor(u / 1000);
  if (!ZV1 && H === void 0 && f >= Nd2 / 1000 && G) {
    if (!j) j = Dm2({ command: Y, description: J || Y, shellCommand: z }, B);
    G({ jsx: oq0.createElement(yD1, null), shouldHidePromptInput: !1, shouldContinueAnimation: !0, showSpinner: !0 })
  }
  yield { type: "progress", fullOutput: K, output: V, elapsedTimeSeconds: f, totalLines: F };
  _ = Date.now() + Oa5
}

// READABLE (for understanding):
const startTime = Date.now();
let timeoutExpiry = startTime + BACKGROUND_THRESHOLD_MS;  // 2000ms
let backgroundTaskId = undefined;

while (true) {
  const currentTime = Date.now();
  const remainingTime = Math.max(0, timeoutExpiry - currentTime);

  // Race: command completion vs timeout
  const result = await Promise.race([
    commandPromise,
    new Promise(resolve => setTimeout(() => resolve(null), remainingTime))
  ]);

  // Command completed
  if (result !== null) {
    if (backgroundTaskId) {
      removeBackgroundTask(backgroundTaskId, setAppState);
    }
    return result;
  }

  // Explicit background signal received
  if (explicitBackgroundTaskId) {
    return { stdout: "", stderr: "", code: 0, interrupted: false, backgroundTaskId: explicitBackgroundTaskId };
  }

  // User triggered background (Ctrl+B)
  if (backgroundTaskId && shellCommand.status === "backgrounded") {
    return {
      stdout: "", stderr: "", code: 0, interrupted: false,
      backgroundTaskId, backgroundedByUser: true
    };
  }

  const elapsedMs = Date.now() - startTime;
  const elapsedSecs = Math.floor(elapsedMs / 1000);

  // Show background hint after threshold
  if (!DISABLE_BACKGROUND_TASKS && !explicitBackgroundTaskId && elapsedSecs >= 2 && setToolJSX) {
    if (!backgroundTaskId) {
      backgroundTaskId = createLocalBashTask({
        command: commandString,
        description: description || commandString,
        shellCommand: shellCommand
      }, setAppState);
    }
    setToolJSX({
      jsx: createElement(BackgroundShortcutHint, null),
      shouldHidePromptInput: false,
      shouldContinueAnimation: true,
      showSpinner: true
    });
  }

  // Yield progress update
  yield {
    type: "progress",
    fullOutput: combinedOutput,
    output: currentOutput,
    elapsedTimeSeconds: elapsedSecs,
    totalLines: lineCount
  };

  // Reset timeout for next iteration
  timeoutExpiry = Date.now() + PROGRESS_INTERVAL_MS;  // 1000ms
}

// Mapping: Nd2→BACKGROUND_THRESHOLD_MS (2000), Oa5→PROGRESS_INTERVAL_MS (1000),
//          yD1→BackgroundShortcutHint, Dm2→createLocalBashTask, Km2→removeBackgroundTask
```

**Key Timing Constants:**
- `Nd2 = 2000ms` - Initial timeout before showing background hint
- `Oa5 = 1000ms` - Progress yield interval

---

### Recursive Turn-Based Execution Algorithm

**What it does:** Manages the iterative conversation between Claude and the tools, handling state accumulation and termination conditions.

**How it works:**
1.  **Context Preparation**: Normalizes the message history, applies compaction (micro/auto) to stay within token limits, and merges system/user context.
2.  **API Invocation**: Calls `streamApiCall` to get the next assistant response.
3.  **Parallel Tool Feeding**: As tool use blocks arrive in the stream, they are immediately fed to the `StreamingToolExecutor`.
4.  **Yielding Results**: Completed tool results are yielded to the UI as they finish (even before the API stream ends).
5.  **Completion & Cleanup**: Once the API stream ends, it waits for any remaining tools to finish.
6.  **Recursive Step**: If tools were called, it gathers all new messages (assistant response + tool results) and recursively calls itself (`coreMessageLoop`) for the next turn.
7.  **Termination**: The recursion stops if no tools were called, the max turns limit is reached, a stop hook prevents continuation, or the user aborts.

**Why this approach:**
-   **Simplicity**: Recursion naturally models the "next turn" behavior of an agent.
-   **State Isolation**: Each recursive call has its own state (turn count, etc.), making it easier to manage per-turn logic like max thinking tokens.
-   **Stream Compatibility**: By yielding from within the recursive structure, it maintains a continuous stream of events for the consumer.

**Key insight:**
The recursion depth corresponds to the number of tool "rounds". By passing the updated message list into the next call, it accumulates the entire chain of thought and action until the task is complete.

---

### Streaming Parallel Tool Execution Strategy

**What it does:** Allows multiple tools to execute simultaneously while the LLM is still generating its response.

**How it works:**
1.  **Safety Check**: For each `tool_use` block, it checks the tool's `isConcurrencySafe` property.
2.  **Queueing**: Concurrent tools are added to an active execution pool.
3.  **Blocking**: Non-concurrent tools (like `Edit`) act as a barrier; they won't start until all previous tools finish, and subsequent tools won't start until they finish.
4.  **Immediate Yielding**: Progress messages and results from completed tools are yielded to the `coreMessageLoop` immediately.
5.  **Context Reduction**: For non-concurrent tools, state updates (`contextModifiers`) are applied to the local context immediately after execution.

**Why this approach:**
-   **Performance**: Tools like `Read` or `Grep` often take time (I/O). Running them in parallel with the LLM stream significantly reduces overall turn time.
-   **Correctness**: Ensuring non-concurrent tools run sequentially prevents race conditions on file system operations.
-   **Responsiveness**: The user sees tool progress and results in real-time, making the agent feel faster and more transparent.

**Key insight:**
The "barrier" pattern for non-concurrent tools allows the system to maximize parallelism while maintaining strict serial order where side effects are present.

---

## 6. Task State Management

### Task Types and Lifecycle

```
Task Types:
┌─────────────────┬─────────────────────────────────────────┐
│ local_bash      │ Background shell command                │
│ local_agent     │ Background sub-agent                    │
│ remote_agent    │ Remote session agent (cloud execution)  │
└─────────────────┴─────────────────────────────────────────┘

Task States:
  pending → running → completed/failed/killed

State Transitions:
  ┌─────────┐     ┌─────────┐     ┌───────────┐
  │ pending │ ──▶ │ running │ ──▶ │ completed │
  └─────────┘     └────┬────┘     └───────────┘
                       │          ┌───────────┐
                       └────────▶ │  failed   │
                       │          └───────────┘
                       │          ┌───────────┐
                       └────────▶ │  killed   │
                                  └───────────┘
```

### Key Task Management Functions

- `createBaseTask` (KO) - Creates base task structure
- `addTaskToState` (FO) - Adds task to app state
- `updateTask` (oY) - Updates task properties
- `markTaskCompleted` (Zm2) - Marks task as completed/failed
- `createFullyBackgroundedAgent` (L32) - Creates fully async agent task
- `createBackgroundableAgent` (O32) - Creates foreground task with background support
- `backgroundAllTasks` (vD1) - Backgrounds all active tasks (Ctrl+B)
- `hasBackgroundableTasks` (Wm2) - Checks if any tasks can be backgrounded

---

## 7. Flow Diagrams

### Main Execution Flow

```
User Request
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│                    Task Tool (xVA)                            │
│  1. Validate agent type                                       │
│  2. Resolve model                                             │
│  3. Choose execution mode (foreground/background)             │
└──────────────────────────────────────────────────────────────┘
     │
     ├── run_in_background: true ──┐
     │                              ▼
     │               ┌────────────────────────────┐
     │               │ createFullyBackgroundedAgent │
     │               │ Run $f in async context    │
     │               │ Return immediately         │
     │               └────────────────────────────┘
     │
     └── run_in_background: false (default)
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│                 Foreground Loop                               │
│  while (true) {                                               │
│    result = Promise.race([                                    │
│      agentIterator.next(),                                    │
│      backgroundSignal                                         │
│    ])                                                         │
│                                                               │
│    if (result.type === "background") {                        │
│      // Transition to background, return async result         │
│    }                                                          │
│                                                               │
│    if (result.done) break;                                    │
│    messages.push(result.value);                               │
│  }                                                            │
└──────────────────────────────────────────────────────────────┘
     │
     ▼
Return completed result
```

### Core Message Loop (aN) Flow

```
coreMessageLoop(messages, systemPrompt, ...)
     │
     ▼
┌─────────────────────────┐
│ 1. Micro-compaction     │ ◀── Optimize individual messages
└─────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ 2. Auto-compaction      │ ◀── Context window management
└─────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ 3. Stream API call      │
│    - oHA()              │
│    - Yield messages     │
│    - Parallel tool exec │
└─────────────────────────┘
     │
     ├── No tool calls ──▶ Return / Handle stop hooks
     │
     └── Has tool calls
                │
                ▼
┌─────────────────────────┐
│ 4. Execute tools        │
│    - Streaming (_H1)    │
│    - Sequential (KM0)   │
└─────────────────────────┘
     │
     ├── Hook stopped ──▶ Return
     │
     ├── Aborted ──▶ Return
     │
     └── Continue
                │
                ▼
┌─────────────────────────┐
│ 5. Check max turns      │
│    turnCount + 1 > max? │
└─────────────────────────┘
     │
     ├── Yes ──▶ Yield max_turns_reached, Return
     │
     └── No
                │
                ▼
┌─────────────────────────┐
│ 6. Recursive call       │
│    coreMessageLoop(     │
│      [...messages,      │
│       ...assistant,     │
│       ...toolResults],  │
│      turnCount + 1      │
│    )                    │
└─────────────────────────┘
```

---

## 8. Key Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `Qf5` | ~3000ms | Background hint threshold for Task tool |
| `Nd2` | 2000ms | Background threshold for shell commands |
| `Oa5` | 1000ms | Progress yield interval |
| `wi5` | 5 | Max recent activities tracked |
| `j77` | 3 | Max output token recovery attempts |

---

## 9. Telemetry Events

| Event | When |
|-------|------|
| `tengu_agent_tool_selected` | Agent type selected for Task tool |
| `tengu_auto_compact_succeeded` | Auto-compaction completed |
| `tengu_model_fallback_triggered` | Model fallback on overload |
| `tengu_streaming_tool_execution_used` | Parallel tool execution used |
| `tengu_post_autocompact_turn` | Turn after auto-compaction |
| `tengu_query_error` | Error during query execution |
| `tengu_orphaned_messages_tombstoned` | Messages discarded on streaming fallback |
