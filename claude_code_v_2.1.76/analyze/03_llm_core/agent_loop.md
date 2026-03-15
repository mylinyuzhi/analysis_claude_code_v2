# Agent Loop Deep Analysis (Claude Code 2.1.76)

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
