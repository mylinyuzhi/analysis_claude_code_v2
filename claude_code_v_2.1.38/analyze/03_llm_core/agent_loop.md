# Agent Loop Deep Analysis (Claude Code 2.1.38)

> Complete analysis of the main agent loop (`mainAgentLoop`/`ZR`), the orchestrator that drives the entire conversation lifecycle: LLM requests, tool dispatch, message management, and turn completion.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `mainAgentLoop` (ZR) - Main REPL-facing agent loop entry point
- `llmRequestGenerator` (lOq) - LLM API request and stream processing
- `streamingQuery` (UW1) - Streaming wrapper around llmRequestGenerator
- `toolDispatcher` (bU1) - Routes tool calls to implementations
- `toolExecutionPipeline` (NdY) - Complete tool execution with hooks and permissions
- `assembleAttachments` (phY) - Produces system reminder attachments
- `buildContextMessages` (bG1) - Injects user context into message history

---

## Architecture Overview

The agent loop is the "heart" of Claude Code. It manages the entire conversation lifecycle:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         mainAgentLoop (ZR)                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Turn Loop (while true)                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Micro-compact check (gm)                             │ │  │
│  │  │ 2. Auto-compact check (fs4)                             │ │  │
│  │  │ 3. Context limit validation                             │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 4. streamingQuery (UW1) → llmRequestGenerator (lOq)    │ │  │
│  │  │    - Build tool schemas                                 │ │  │
│  │  │    - Normalize messages                                 │ │  │
│  │  │    - Send API request                                   │ │  │
│  │  │    - Yield streaming events                             │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 5. Accumulate assistant messages (k)                    │ │  │
│  │  │ 6. Collect tool_use blocks (l)                          │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 7. Tool Execution (if tools present)                    │ │  │
│  │  │    - StreamingToolExecutor (uU1) OR                     │ │  │
│  │  │    - Sequential tool dispatcher (tZ6)                   │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 8. Attachments (oP1) → assembleAttachments (phY)        │ │  │
│  │  │ 9. Recursive call with updated messages                 │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Algorithms

### mainAgentLoop - The Central Orchestrator

**What it does:**
The `mainAgentLoop` (ZR) function is the top-level generator that drives the entire Claude Code conversation. It manages turns, handles API requests, dispatches tools, and maintains conversation state across multiple iterations.

**How it works:**

1. **Turn Initialization**: Each iteration starts with a fresh turn counter and query tracking ID. The `queryTracking` object maintains a `chainId` and `depth` for tracing nested queries (e.g., when a subagent is spawned).

2. **Pre-Query Compaction**: Two compaction phases run before the API call:
   - **Micro-compact** (`gm`): Removes consecutive duplicate messages
   - **Auto-compact** (`fs4`): Triggers context compaction when approaching token limits

3. **Context Validation**: Checks if the conversation is at a "blocking limit" (too close to max context). If so, yields an error and returns early.

4. **API Request via streamingQuery**: Calls `UW1` which wraps `lOq` (llmRequestGenerator). Each streamed event is yielded to the caller and accumulated.

5. **Streaming Tool Execution**: If the `tengu_streaming_tool_execution2` feature flag is enabled, a `StreamingToolExecutor` (uU1) collects tool_use blocks as they stream in and begins executing them in parallel with the stream.

6. **Tool Execution Phase**: After the stream completes:
   - If streaming tool executor was used, drain remaining results
   - Otherwise, use sequential dispatcher (`tZ6`)

7. **Attachment Injection**: Calls `oP1` → `phY` to produce system reminders (file changes, diagnostics, etc.). These are appended as user messages.

8. **Recursive Turn Continuation**: The loop continues with updated messages: `[...G, ...k, ...y]` where:
   - `G` = original messages
   - `k` = assistant messages from this turn
   - `y` = tool results + attachments

```javascript
// ============================================
// mainAgentLoop - Central orchestrator for the agent conversation
// Location: chunks.149.mjs:1753-2141
// ============================================

// ORIGINAL (for source lookup):
async function* ZR({
    messages: A,
    systemPrompt: q,
    userContext: K,
    systemContext: Y,
    canUseTool: z,
    toolUseContext: w,
    fallbackModel: H,
    querySource: $,
    maxOutputTokensOverride: O,
    maxTurns: _
}) {
    let J, X, D = 0, j = 1, M;
    while (!0) {
        if (yield { type: "stream_request_start" }, y3("query_fn_entry"), !w.agentId) t51("query_started");
        // ... query tracking, micro-compact, auto-compact ...
        let G = [...EN(A)];
        y3("query_microcompact_start");
        let Z = await gm(G, void 0, w);
        if (G = Z.messages, Z.compactionInfo?.boundaryMessage) yield Z.compactionInfo.boundaryMessage;
        // ... auto-compact check via fs4 ...
        // ... context limit validation ...
        // ... streaming API request via UW1 ...
        for await (let E1 of UW1({...})) {
            if (yield E1, E1.type === "assistant") {
                if (k.push(E1), S && !w.abortController.signal.aborted) {
                    let a = E1.message.content.filter((A1) => A1.type === "tool_use");
                    for (let A1 of a) S.addTool(A1, E1)
                }
            }
        }
        // ... tool execution ...
        // ... attachment injection via oP1 ...
        // ... recursive continuation ...
    }
}

// READABLE (for understanding):
async function* mainAgentLoop({
    messages,
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext,
    fallbackModel,
    querySource,
    maxOutputTokensOverride,
    maxTurns
}) {
    let autoCompactTracking, pendingToolUseSummary, maxOutputTokensRecoveryCount = 0;
    let turnCount = 1, stopHookActive;

    while (true) {
        // 1. Yield stream start event + profiling mark
        yield { type: "stream_request_start" };
        recordMark("query_fn_entry");

        // 2. Setup query tracking for telemetry/telemetry correlation
        let queryTracking = toolUseContext.queryTracking
            ? { chainId: toolUseContext.queryTracking.chainId, depth: toolUseContext.queryTracking.depth + 1 }
            : { chainId: generateChainId(), depth: 0 };
        let chainId = queryTracking.chainId;

        toolUseContext = { ...toolUseContext, queryTracking };

        // 3. Micro-compact: Remove consecutive duplicate messages
        let messagesForQuery = [...getVisibleMessages(messages)];
        recordMark("query_microcompact_start");
        let microCompactResult = await microCompact(messagesForQuery, undefined, toolUseContext);
        messagesForQuery = microCompactResult.messages;
        if (microCompactResult.compactionInfo?.boundaryMessage) {
            yield microCompactResult.compactionInfo.boundaryMessage;
        }
        recordMark("query_microcompact_end");

        // 4. Auto-compact: Trigger if approaching token limit
        recordMark("query_autocompact_start");
        let { compactionResult } = await checkAndTriggerAutoCompact(
            messagesForQuery, toolUseContext,
            { systemPrompt, userContext, systemContext, toolUseContext, forkContextMessages: messagesForQuery },
            querySource
        );
        recordMark("query_autocompact_end");

        if (compactionResult) {
            // Log telemetry and yield compaction messages
            logEvent("tengu_auto_compact_succeeded", {...});
            // Yield summary messages and attachments
            for (let msg of buildCompactionMessages(compactionResult)) {
                yield msg;
            }
            messagesForQuery = buildCompactionMessages(compactionResult);
        }

        // 5. Context limit validation
        let { isAtBlockingLimit } = checkContextLimit(estimateTokens(messagesForQuery), toolUseContext.options.mainLoopModel);
        if (isAtBlockingLimit) {
            yield createErrorMessage({ content: CONTEXT_LIMIT_ERROR, error: "invalid_request" });
            return;
        }

        // 6. Prepare for streaming API request
        let assistantMessages = [];
        let toolResults = [];

        // Streaming tool executor (if feature enabled)
        let streamingToolExecutor = isFeatureEnabled("tengu_streaming_tool_execution2")
            ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
            : null;

        // Get permission mode and model
        let appState = await toolUseContext.getAppState();
        let permissionMode = appState.toolPermissionContext.mode;
        let model = resolveModel({ permissionMode, mainLoopModel: toolUseContext.options.mainLoopModel });

        // 7. Streaming API loop
        let shouldRetry = true;
        try {
            while (shouldRetry) {
                shouldRetry = false;
                try {
                    recordMark("query_api_streaming_start");
                    for await (let event of streamingQuery({
                        messages: buildContextMessages(messagesForQuery, userContext),
                        systemPrompt: combineSystemPrompts(systemPrompt, systemContext),
                        maxThinkingTokens: toolUseContext.options.maxThinkingTokens,
                        tools: toolUseContext.options.tools,
                        signal: toolUseContext.abortController.signal,
                        options: {
                            model,
                            fallbackModel,
                            ... /* other options */
                        }
                    })) {
                        // Yield each event to caller
                        yield event;

                        // Accumulate assistant messages
                        if (event.type === "assistant") {
                            assistantMessages.push(event);

                            // If streaming tool executor active, queue tool calls
                            if (streamingToolExecutor && !toolUseContext.abortController.signal.aborted) {
                                let toolUses = event.message.content.filter(block => block.type === "tool_use");
                                for (let toolUse of toolUses) {
                                    streamingToolExecutor.addTool(toolUse, event);
                                }
                            }
                        }

                        // Collect completed tool results from streaming executor
                        if (streamingToolExecutor && !toolUseContext.abortController.signal.aborted) {
                            for (let result of streamingToolExecutor.getCompletedResults()) {
                                if (result.message) {
                                    yield result.message;
                                    toolResults.push(...normalizeMessages([result.message], toolUseContext.options.tools)
                                        .filter(msg => msg.type === "user"));
                                }
                            }
                        }
                    }
                    recordMark("query_api_streaming_end");
                } catch (error) {
                    // Handle model fallback
                    if (error instanceof ModelFallbackError && fallbackModel) {
                        model = fallbackModel;
                        shouldRetry = true;
                        yield* yieldFallbackTransition(assistantMessages, "Model fallback triggered");
                        assistantMessages = [];
                        toolResults = [];
                        streamingToolExecutor = new StreamingToolExecutor(...);
                        toolUseContext.options.mainLoopModel = fallbackModel;
                        continue;
                    }
                    throw error;
                }
            }
        } catch (error) {
            // Query error handling
            recordError(error);
            if (error instanceof ContextLimitError || error instanceof BudgetExceededError) {
                yield createErrorMessage({ content: error.message });
                return;
            }
            yield* yieldFallbackTransition(assistantMessages, error.message);
            yield createToolUseStatusMessage({ toolUse: false });
            return;
        }

        // 8. Check for abort
        if (toolUseContext.abortController.signal.aborted) {
            if (streamingToolExecutor) {
                for await (let result of streamingToolExecutor.getRemainingResults()) {
                    if (result.message) yield result.message;
                }
            } else {
                yield* yieldFallbackTransition(assistantMessages, "Interrupted by user");
            }
            if (toolUseContext.abortController.signal.reason !== "interrupt") {
                yield createToolUseStatusMessage({ toolUse: false });
            }
            return;
        }

        // 9. Extract tool_use blocks
        let toolUseBlocks = assistantMessages.flatMap(msg =>
            msg.message.content.filter(block => block.type === "tool_use")
        );

        // 10. No tools → check for completion
        if (!assistantMessages.length || !toolUseBlocks.length) {
            // Handle max_tokens recovery
            if (lastMessageHadMaxTokensError && recoveryCount < MAX_RECOVERY_ATTEMPTS) {
                // Recursively continue with recovery message
                let recoveryMessage = createUserMessage({
                    content: "Your response was cut off because it exceeded the output token limit. Please break your work into smaller pieces. Continue from where you left off.",
                    isMeta: true
                });
                // Continue loop with updated state
                messages = [...messagesForQuery, ...assistantMessages, recoveryMessage];
                maxOutputTokensRecoveryCount++;
                continue;
            }

            // Check for stop hooks and blocking errors
            let completion = yield* checkTurnCompletion(messagesForQuery, assistantMessages, ...);
            if (completion.preventContinuation) return;
            if (completion.blockingErrors.length > 0) {
                // Continue with blocking errors as context
                messages = [...messagesForQuery, ...assistantMessages, ...completion.blockingErrors];
                stopHookActive = true;
                continue;
            }
            return; // No tools, no continuation → done
        }

        // 11. Execute tools
        let shouldStopContinuation = false;
        let updatedContext = toolUseContext;

        recordMark("query_tool_execution_start");

        if (streamingToolExecutor) {
            // Drain remaining tool results from streaming executor
            for await (let result of streamingToolExecutor.getRemainingResults()) {
                if (result.message) {
                    yield result.message;
                    if (result.message.type === "attachment" &&
                        result.message.attachment.type === "hook_stopped_continuation") {
                        shouldStopContinuation = true;
                    }
                    toolResults.push(...normalizeMessages([result.message], toolUseContext.options.tools)
                        .filter(msg => msg.type === "user"));
                }
            }
            updatedContext = { ...streamingToolExecutor.getUpdatedContext(), queryTracking };
        } else {
            // Sequential tool execution
            for await (let result of executeToolsSequentially(toolUseBlocks, assistantMessages, canUseTool, toolUseContext)) {
                if (result.message) {
                    yield result.message;
                    if (result.message.type === "attachment" &&
                        result.message.attachment.type === "hook_stopped_continuation") {
                        shouldStopContinuation = true;
                    }
                    toolResults.push(...normalizeMessages([result.message], toolUseContext.options.tools)
                        .filter(msg => msg.type === "user"));
                }
                if (result.newContext) {
                    updatedContext = { ...result.newContext, queryTracking };
                }
            }
        }
        recordMark("query_tool_execution_end");

        // 12. Check for abort after tools
        if (toolUseContext.abortController.signal.aborted) {
            if (toolUseContext.abortController.signal.reason !== "interrupt") {
                yield createToolUseStatusMessage({ toolUse: true });
            }
            if (maxTurns && turnCount + 1 > maxTurns) {
                yield createMaxTurnsMessage(maxTurns, turnCount + 1);
            }
            return;
        }

        // 13. Check hook stop
        if (shouldStopContinuation) return;

        // 14. Attachments injection
        let queuedCommands = (await updatedContext.getAppState()).queuedCommands;
        for await (let attachment of attachmentGenerator(null, updatedContext, null, queuedCommands, [...messagesForQuery, ...assistantMessages, ...toolResults], querySource)) {
            yield attachment;
            toolResults.push(attachment);
        }

        // 15. Check max turns
        let nextTurnCount = turnCount + 1;
        if (maxTurns && nextTurnCount > maxTurns) {
            yield createMaxTurnsMessage(maxTurns, nextTurnCount);
            return;
        }

        // 16. Recursive continuation
        recordMark("query_recursive_call");
        messages = [...messagesForQuery, ...assistantMessages, ...toolResults];
        toolUseContext = { ...updatedContext, queryTracking };
        turnCount = nextTurnCount;
        // Continue while(true) loop
    }
}

// Mapping: ZR→mainAgentLoop, A→messages, q→systemPrompt, K→userContext, Y→systemContext,
//   z→canUseTool, w→toolUseContext, H→fallbackModel, $→querySource, O→maxOutputTokensOverride,
//   _→maxTurns, J→autoCompactTracking, X→stopHookActive, D→maxOutputTokensRecoveryCount,
//   j→turnCount, M→pendingToolUseSummary, G→messagesForQuery, k→assistantMessages, l→toolUseBlocks,
//   y→toolResults, S→streamingToolExecutor, UW1→streamingQuery, fs4→checkAndTriggerAutoCompact,
//   gm→microCompact, bG1→buildContextMessages, uU1→StreamingToolExecutor, tZ6→executeToolsSequentially
```

**Why this approach:**
- **Generator pattern**: `async function*` allows yielding events incrementally. The caller (typically the UI) receives events as they happen rather than waiting for the entire turn to complete.
- **Recursive continuation**: Instead of returning after each turn, the loop continues with updated messages. This maintains conversation context without explicit recursion.
- **Streaming tool execution**: Starting tool execution during the stream (rather than waiting for stream completion) reduces perceived latency. The user sees tool results appearing while the LLM is still generating.
- **Abort handling**: Multiple abort checks ensure the agent stops cleanly when the user cancels, without leaving orphaned tool executions.

**Key insight:** The `while (true)` loop is the fundamental structure of the agent. Each iteration represents one "turn" in the conversation. The loop continues until:
1. No tools are called (LLM finished speaking)
2. Abort signal is triggered
3. A hook stops continuation
4. Max turns limit is reached
5. An unrecoverable error occurs

---

## Tool Dispatch Pipeline

### toolDispatcher - Routes tool calls to implementations

**What it does:**
The `toolDispatcher` (bU1) function takes a `tool_use` block from the LLM response, looks up the corresponding tool implementation, validates input, checks permissions, executes the tool, and returns the result.

**How it works:**

1. **Tool Lookup**: Finds the tool by name in `options.tools`. Also checks aliases for backwards compatibility.

2. **MCP Metadata**: If the tool is an MCP tool (name starts with `mcp__`), extracts server type and base URL for telemetry.

3. **Input Validation**: Parses the input against the tool's Zod schema. If validation fails, returns an error result immediately.

4. **Pre-tool Hooks**: Runs `executePreToolHooksIterator` which invokes any registered `PreToolUse` hooks. Hooks can:
   - Modify the input (`updatedInput`)
   - Approve/deny without user interaction (`hookPermissionResult`)
   - Stop tool execution (`preventContinuation`)

5. **Permission Check**: Calls `canUseTool` to determine if the tool requires user approval. Hook results can bypass this check.

6. **Tool Execution**: Calls `tool.call(input, context, progressCallback)`. The tool returns a result object with `data` and optional `structured_output`.

7. **Post-tool Processing**: Tracks file operations, records telemetry, and yields the tool result message.

```javascript
// ============================================
// toolDispatcher - Routes tool_use blocks to tool implementations
// Location: chunks.149.mjs:343-447
// ============================================

// ORIGINAL (for source lookup):
async function* bU1(A, q, K, Y) {
    let z = A.name, w = Tv(Y.options.tools, z);
    if (!w) {
        let X = Tv(kt(), z);
        if (X && X.aliases?.includes(z)) w = X;
    }
    // ... MCP metadata extraction ...
    if (!w) {
        // Tool not found - return error
        yield { message: c6({
            content: [{ type: "tool_result", content: `<tool_use_error>Error: No such tool available: ${z}</tool_use_error>`, is_error: !0, tool_use_id: A.id }],
            toolUseResult: `Error: No such tool available: ${z}`,
            sourceToolAssistantUUID: q.uuid
        })};
        return;
    }
    let J = A.input;
    try {
        if (Y.abortController.signal.aborted) {
            // Cancelled
            yield { message: c6({ content: [createCancelledToolResult(A.id)], toolUseResult: CANCELLED_MESSAGE, sourceToolAssistantUUID: q.uuid })};
            return;
        }
        for await (let X of toolExecutionOrchestrator(w, A.id, J, Y, K, q, H, $, O, _)) yield X;
    } catch (X) {
        // Error handling
        yield { message: c6({ content: [{ type: "tool_result", content: `<tool_use_error>Error calling tool (${w.name}): ${X.message}</tool_use_error>`, is_error: !0, tool_use_id: A.id }], ...})};
    }
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
    let toolName = toolUseBlock.name;
    let tool = findTool(toolUseContext.options.tools, toolName);

    // Check aliases for backwards compatibility
    if (!tool) {
        let aliasedTool = findTool(getDynamicToolSet(), toolName);
        if (aliasedTool?.aliases?.includes(toolName)) {
            tool = aliasedTool;
        }
    }

    // Tool not found error
    if (!tool) {
        let sanitizedName = sanitizeToolName(toolName);
        log(`Unknown tool ${toolName}: ${toolUseBlock.id}`);
        logEvent("tengu_tool_use_error", { error: `No such tool available: ${sanitizedName}`, ... });
        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                toolUseResult: `Error: No such tool available: ${toolName}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
        return;
    }

    let input = toolUseBlock.input;
    try {
        // Check for abort before execution
        if (toolUseContext.abortController.signal.aborted) {
            logEvent("tengu_tool_use_cancelled", { toolName: sanitizeToolName(tool.name), ... });
            yield {
                message: createUserMessage({
                    content: [createCancelledToolResult(toolUseBlock.id)],
                    toolUseResult: CANCELLED_MESSAGE,
                    sourceToolAssistantUUID: assistantMessage.uuid
                })
            };
            return;
        }

        // Delegate to execution orchestrator
        for await (let result of toolExecutionOrchestrator(
            tool, toolUseBlock.id, input, toolUseContext,
            canUseTool, assistantMessage, assistantMessage.message.id, requestId, mcpServerType, mcpServerUrl
        )) {
            yield result;
        }
    } catch (error) {
        recordError(error instanceof Error ? error : Error(String(error)));
        let errorMessage = error instanceof Error ? error.message : String(error);
        let fullMessage = `Error calling tool (${tool.name}): ${errorMessage}`;
        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${fullMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                toolUseResult: fullMessage,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
    }
}

// Mapping: bU1→toolDispatcher, A→toolUseBlock, q→assistantMessage, K→canUseTool, Y→toolUseContext,
//   z→toolName, w→tool, Tv→findTool, kt→getDynamicToolSet, VdY→toolExecutionOrchestrator,
//   c6→createUserMessage, KhA→createCancelledToolResult, _M1→CANCELLED_MESSAGE
```

---

### toolExecutionPipeline - Complete execution with hooks and permissions

**What it does:**
The `toolExecutionPipeline` (NdY) is the complete tool execution path including schema validation, pre-tool hooks, permission checking, and post-tool hooks.

**How it works:**

1. **Schema Validation**: The input is parsed against the tool's Zod schema. Errors are returned immediately with detailed validation messages.

2. **Custom Input Validation**: Some tools implement `validateInput()` for additional checks beyond the schema.

3. **Pre-tool Hooks**: Runs all registered `PreToolUse` hooks via `B1q`. Hooks can:
   - Return `message` → yield to the stream
   - Return `hookPermissionResult` → bypass or modify permission check
   - Return `hookUpdatedInput` → modify tool input
   - Return `preventContinuation` → stop after this tool
   - Return `stop` → immediately return without executing

4. **Permission Decision**: Based on hook results and tool requirements:
   - If hook approved and tool doesn't require user interaction → skip permission check
   - If hook denied → return error immediately
   - Otherwise → call `canUseTool` to prompt user

5. **Tool Execution**: Calls `tool.call(input, context, progressCallback)`:
   - The progress callback allows tools to emit intermediate progress
   - Returns `{ data, structured_output? }`

6. **Post-tool Hooks**: Runs `executePostToolHooksIterator` to notify hooks of completion.

7. **Result Construction**: Wraps the result in a `tool_result` message with the tool_use_id for correlation.

```javascript
// ============================================
// toolExecutionPipeline - Complete execution with validation, hooks, and permissions
// Location: chunks.149.mjs:490-604
// ============================================

// ORIGINAL (for source lookup):
async function NdY(A, q, K, Y, z, w, H, $, O, _, J) {
    let X = A.inputSchema.safeParse(K);
    if (!X.success) {
        let y = x1q(A.name, X.error);
        return h(`${A.name} tool input error: ${y.slice(0,200)}`), c("tengu_tool_use_error", {...}),
        [{ message: c6({ content: [{ type: "tool_result", content: `<tool_use_error>InputValidationError: ${y}</tool_use_error>`, is_error: !0, tool_use_id: q }], ...}) }];
    }
    let D = await A.validateInput?.(X.data, Y);
    if (D?.result === !1) return h(`${A.name} tool validation error: ${D.message?.slice(0,200)}`), ...;
    // ... pre-tool hooks, permission check, tool execution ...
    let j = [], M = X.data, P = !1, W, G;
    for await (let y of executePreToolHooksIterator(Y, A, M, q, w.message.id, $, O, _)) switch (y.type) {
        case "message": if (y.message.message.type === "progress") J(y.message.message); else j.push(y.message); break;
        case "hookPermissionResult": G = y.hookPermissionResult; break;
        case "hookUpdatedInput": M = y.updatedInput; break;
        case "preventContinuation": P = y.shouldPreventContinuation; break;
        case "stopReason": W = y.stopReason; break;
        case "stop": return j.push({ message: c6({ content: [KhA(q)], ...}) }), j;
    }
    // ... permission decision based on hook result ...
    let Z;
    if (G !== void 0 && G.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool)
        h(`Hook approved tool use for ${A.name}, bypassing permission check`), Z = G;
    else if (G !== void 0 && G.behavior === "deny") h(`Hook denied tool use for ${A.name}`), Z = G;
    else Z = await z(A, M, Y, w, q, ...);
    // ... execute tool.call() if allowed ...
}

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerUrl, progressCallback) {
    // 1. Schema validation
    let parseResult = tool.inputSchema.safeParse(input);
    if (!parseResult.success) {
        let errorMessage = formatValidationError(tool.name, parseResult.error);
        log(`${tool.name} tool input error: ${errorMessage.slice(0, 200)}`);
        logEvent("tengu_tool_use_error", { error: "InputValidationError", ... });
        return [{
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${errorMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                toolUseResult: `InputValidationError: ${parseResult.error.message}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        }];
    }

    // 2. Custom validation
    let customValidation = await tool.validateInput?.(parseResult.data, toolUseContext);
    if (customValidation?.result === false) {
        return [/* error message with customValidation.message */];
    }

    // 3. Pre-tool hooks
    let messages = [];
    let validatedInput = parseResult.data;
    let preventContinuation = false;
    let stopReason;
    let hookPermissionResult;

    for await (let hookEvent of executePreToolHooksIterator(toolUseContext, tool, validatedInput, toolUseId, messageId, requestId, mcpServerType, mcpServerUrl)) {
        switch (hookEvent.type) {
            case "message":
                if (hookEvent.message.message.type === "progress") {
                    progressCallback(hookEvent.message.message);
                } else {
                    messages.push(hookEvent.message);
                }
                break;
            case "hookPermissionResult":
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                validatedInput = hookEvent.updatedInput;
                break;
            case "preventContinuation":
                preventContinuation = hookEvent.shouldPreventContinuation;
                break;
            case "stopReason":
                stopReason = hookEvent.stopReason;
                break;
            case "stop":
                messages.push({ message: createUserMessage({ content: [createCancelledToolResult(toolUseId)], ... }) });
                return messages;
        }
    }

    // 4. Permission decision
    let permissionDecision;
    if (hookPermissionResult?.behavior === "allow" && !tool.requiresUserInteraction?.() && !toolUseContext.requireCanUseTool) {
        log(`Hook approved tool use for ${tool.name}, bypassing permission check`);
        permissionDecision = hookPermissionResult;
    } else if (hookPermissionResult?.behavior === "deny") {
        log(`Hook denied tool use for ${tool.name}`);
        permissionDecision = hookPermissionResult;
    } else {
        permissionDecision = await canUseTool(tool, validatedInput, toolUseContext, assistantMessage, toolUseId);
    }

    if (permissionDecision.behavior !== "allow") {
        // Permission denied
        return [/* error message with denial reason */];
    }

    // 5. Execute tool
    let startTime = Date.now();
    let result = await tool.call(validatedInput, { ...toolUseContext, userModified: permissionDecision.userModified ?? false }, canUseTool, assistantMessage, (progress) => {
        progressCallback({ toolUseID: progress.toolUseID, data: progress.data });
    });
    let duration = Date.now() - startTime;

    logEvent("tengu_tool_use_success", { toolName: sanitizeToolName(tool.name), durationMs: duration, ... });

    // 6. Build result message
    messages.push({
        message: createUserMessage({
            content: [{
                type: "tool_result",
                content: result.data,
                tool_use_id: toolUseId
            }],
            toolUseResult: result.data,
            sourceToolAssistantUUID: assistantMessage.uuid
        })
    });

    return messages;
}

// Mapping: NdY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//   z→canUseTool, w→assistantMessage, H→messageId, $→requestId, O→mcpServerType, _→mcpServerUrl,
//   J→progressCallback, B1q→executePreToolHooksIterator, x1q→formatValidationError
```

**Why this approach:**
- **Hook-first architecture**: Hooks run before the permission check, allowing them to bypass or modify the user approval flow. This enables features like auto-approved tool lists and input sanitization.
- **Progress callback**: The `progressCallback` allows tools to emit intermediate updates (e.g., "Running command...") without blocking the execution.
- **Validation separation**: Schema validation (automatic) is separate from custom validation (tool-specific), allowing tools to implement domain-specific checks.

**Key insight:** The hook system creates an extension point where external code can intercept and modify tool execution. This is how features like "auto-approve tools in sandboxed mode" and "validate bash commands before execution" are implemented without modifying core tool logic.

---

## Context Building

### buildContextMessages - Injects user context into message history

**What it does:**
The `buildContextMessages` (bG1) function prepends a system-reminder style message containing user context (like current working directory, git branch, etc.) to the message history.

**How it works:**

1. Checks if user context object has any entries
2. If empty, returns messages unchanged
3. If populated, creates a meta-message with `<system-reminder>` tags containing the context as key-value pairs
4. Prepends this message to the message array

```javascript
// ============================================
// buildContextMessages - Prepends user context as a system-reminder
// Location: chunks.148.mjs:2414-2428
// ============================================

// ORIGINAL (for source lookup):
function bG1(A, q) {
    if (Object.entries(q).length === 0) return A;
    return [c6({
        content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(q).map(([K,Y])=>`# ${K}
${Y}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
        isMeta: !0
    }), ...A]
}

// READABLE (for understanding):
function buildContextMessages(messages, userContext) {
    // If no context, return messages unchanged
    if (Object.entries(userContext).length === 0) {
        return messages;
    }

    // Build context reminder
    let contextContent = `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(userContext).map(([key, value]) => `# ${key}\n${value}`).join('\n')}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>`;

    return [
        createUserMessage({
            content: contextContent,
            isMeta: true
        }),
        ...messages
    ];
}

// Mapping: bG1→buildContextMessages, A→messages, q→userContext, c6→createUserMessage
```

**Why this approach:**
- The `<system-reminder>` tag is recognized by the LLM as contextual information that should be considered but not directly referenced unless relevant.
- Prepending (rather than appending) ensures the context is seen early in the conversation, which influences the LLM's behavior throughout.
- The `isMeta: true` flag marks this as a system-generated message for UI display purposes.

---

## State Tracking

### Auto-Compact Tracking

The `autoCompactTracking` object tracks compaction state across turns:

```javascript
{
    compacted: true,          // Whether compaction has occurred
    turnId: "uuid",           // Unique ID for this compaction cycle
    turnCounter: 0            // Turns since compaction
}
```

This allows telemetry to correlate post-compaction turns with the compaction event.

### Turn Counter

The `turnCount` variable increments each time the agent makes a recursive continuation. It's used for:
- Max turns enforcement
- Post-auto-compact turn tracking
- Query depth calculation

### Query Tracking

```javascript
{
    chainId: "uuid",    // Correlation ID for all queries in this chain
    depth: 0            // Nesting depth (0 = main agent, 1+ = subagents)
}
```

This enables tracing nested queries (e.g., when AgentTool spawns a subagent).

---

## Error Recovery Patterns

### Max Tokens Recovery

When the LLM hits `max_tokens`, the agent:
1. Detects `stop_reason === "max_tokens"` in the last message
2. Creates a meta-message asking the LLM to continue
3. Increments `maxOutputTokensRecoveryCount`
4. Retries up to 3 times (`udY = 3`)

### Model Fallback

When the primary model fails with overload:
1. Catches `ModelFallbackError`
2. Switches to `fallbackModel`
3. Yields a transition message
4. Clears accumulated messages and retries

### Streaming Fallback

When streaming fails:
1. Falls back to non-streaming via `nonStreamingFallback` (dOq)
2. Tracks `Z1` (didFallBackToNonStreaming) for telemetry
3. Tombstones orphaned messages from the failed stream

---

## Performance Marks

The agent loop records timing marks at key points:

| Mark | Purpose |
|------|---------|
| `query_fn_entry` | Turn start |
| `query_microcompact_start/end` | Micro-compact duration |
| `query_autocompact_start/end` | Auto-compact duration |
| `query_api_streaming_start/end` | API call duration |
| `query_tool_execution_start/end` | Tool execution duration |
| `query_recursive_call` | Before recursive continuation |

These marks enable performance profiling via the profiling report feature.