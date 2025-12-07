# Claude Code v2.0.59 - Agent Loop & Execution Engine

## Overview

This document provides in-depth analysis of the agent loop mechanism in Claude Code v2.0.59. The agent loop is the central orchestration component that manages the conversation flow, tool execution, context management, and integration with plan mode and todo tracking.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Main Agent Loop (O$)](#main-agent-loop-o)
3. [Tool Execution Engine](#tool-execution-engine)
4. [Tool Parallel/Serial Control](#tool-parallelserial-control)
5. [Plan Mode Integration](#plan-mode-integration)
6. [Todo List Integration](#todo-list-integration)
7. [Decision Flow Analysis](#decision-flow-analysis)
8. [Deep Dive: Task Categories, Complexity Assessment, and Tool Selection](#deep-dive-task-categories-complexity-assessment-and-tool-selection)
   - [PHASE 1: Task Categories (Prompt-Driven Classification)](#phase-1-task-categories-prompt-driven-classification)
   - [PHASE 2: Complexity Assessment (Prompt-Driven)](#phase-2-complexity-assessment-prompt-driven)
   - [PHASE 3: Tool Selection (Prompt-Driven)](#phase-3-tool-selection-prompt-driven)
9. [Pseudocode & Code Snippets](#pseudocode--code-snippets)

---

## Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLAUDE CODE EXECUTION ENGINE                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐       │
│  │ User Input  │────▶│  O$ (Main    │────▶│  Tool Executor      │       │
│  │             │     │  Agent Loop) │     │  (EV0 Class)        │       │
│  └─────────────┘     └──────────────┘     └─────────────────────┘       │
│                              │                     │                     │
│                              ▼                     ▼                     │
│                     ┌──────────────┐     ┌─────────────────────┐       │
│                     │  API Caller  │     │  Tool Results       │       │
│                     │  (RYA/$E9)   │     │  Processing         │       │
│                     └──────────────┘     └─────────────────────┘       │
│                              │                     │                     │
│                              ▼                     ▼                     │
│                     ┌──────────────────────────────────────────┐       │
│                     │         Context Management               │       │
│                     │  • Auto-compaction (Si, sI2)             │       │
│                     │  • Message normalization                 │       │
│                     │  • Token counting                        │       │
│                     └──────────────────────────────────────────┘       │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      Integration Points                          │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  • Plan Mode (EnterPlanMode/ExitPlanMode tools)                  │   │
│  │  • Todo List (TodoWrite tool, session state)                     │   │
│  │  • Sub-Agents (Task tool, agent spawning)                        │   │
│  │  • Hooks (PreToolUse, PostToolUse, Stop)                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### File Locations

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key files in this document:
- `O$` (mainAgentLoop) - `chunks.146.mjs:1716-1977` - Main recursive agent loop
- `EV0` (ToolExecutor) - `chunks.146.mjs:1335-1449` - Streaming tool execution class
- `RYA` (streamingApiCall) - `chunks.152.mjs:2836-2847` - Streaming API wrapper
- `OY1` (executeSingleTool) - `chunks.146.mjs:2193-2254` - Single tool execution
- `mk3` (groupToolsByConcurrency) - `chunks.146.mjs:2154-2166` - Tool grouping for parallel execution

---

## Main Agent Loop (O$)

### Function Overview

The `O$` function is the **heart of Claude Code's execution engine**. It implements a recursive async generator that:

1. Handles context compaction when messages exceed token limits
2. Calls the Claude API with streaming
3. Processes assistant responses and tool calls
4. Orchestrates tool execution (parallel or serial)
5. Recursively continues the conversation until completion

### Function Signature

```javascript
// ============================================
// mainAgentLoop - Core Recursive Execution Loop
// Location: chunks.146.mjs:1716-1977
// Original function: O$(config)
// ============================================
async function* O$({
  messages,              // A - Conversation history
  systemPrompt,          // Q - System prompts array
  userContext,           // B - User context information
  systemContext,         // G - System context information
  canUseTool,            // Z - Tool permission checker function
  toolUseContext,        // I - Tool execution context object
  autoCompactTracking,   // Y - Compaction state tracker
  fallbackModel,         // J - Fallback model for overload
  stopHookActive,        // W - Whether stop hook is active
  querySource            // X - Query source identifier
})
```

### Core Algorithm

**What it does:** Manages the complete lifecycle of an agent turn, from receiving messages to executing tools and continuing the conversation.

**How it works:**

```javascript
// ============================================
// mainAgentLoop - Detailed Algorithm
// Location: chunks.146.mjs:1716-1977
// ============================================

// ORIGINAL (for source lookup):
async function* O$({messages: A, systemPrompt: Q, userContext: B, systemContext: G, canUseTool: Z, toolUseContext: I, autoCompactTracking: Y, fallbackModel: J, stopHookActive: W, querySource: X}) {
  // ... complex implementation
}

// READABLE (for understanding):
async function* mainAgentLoop({
  messages,
  systemPrompt,
  userContext,
  systemContext,
  canUseTool,
  toolUseContext,
  autoCompactTracking,
  fallbackModel,
  stopHookActive,
  querySource
}) {
  // ========================================
  // PHASE 1: INITIALIZATION
  // ========================================

  let sdkBetas = toolUseContext.options.sdkBetas;

  // Signal that streaming request is starting
  yield { type: "stream_request_start" };

  // Initialize query tracking for analytics
  let queryTracking = toolUseContext.queryTracking ? {
    chainId: toolUseContext.queryTracking.chainId,
    depth: toolUseContext.queryTracking.depth + 1
  } : {
    chainId: generateUUID(),
    depth: 0
  };

  let chainId = queryTracking.chainId;
  toolUseContext = { ...toolUseContext, queryTracking };

  // Get session ID for orphaned message tracking
  let sessionId = getSessionId();
  if (!orphanedMessageMap.has(sessionId)) {
    orphanedMessageMap.set(sessionId, new Set());
  }
  let orphanedMessages = orphanedMessageMap.get(sessionId);

  // ========================================
  // PHASE 2: MESSAGE PREPARATION
  // ========================================

  // Clone messages to avoid mutation
  let messagesForQuery = cloneMessages(messages);
  let compactTracking = autoCompactTracking;

  // Apply first-turn compaction if needed
  let firstTurnCompaction = await applyFirstTurnCompaction(
    messagesForQuery,
    undefined,
    toolUseContext
  );

  messagesForQuery = firstTurnCompaction.messages;

  // Yield compaction info if any
  if (firstTurnCompaction.compactionInfo?.systemMessage) {
    yield firstTurnCompaction.compactionInfo.systemMessage;
  }

  // ========================================
  // PHASE 3: AUTO-COMPACTION CHECK
  // ========================================

  // Check if automatic compaction is needed based on token count
  let { compactionResult } = await autoCompactDispatcher(
    messagesForQuery,
    toolUseContext,
    querySource
  );

  if (compactionResult) {
    let { preCompactTokenCount, postCompactTokenCount, compactionUsage } = compactionResult;

    // Log compaction analytics
    logAnalytics("tengu_auto_compact_succeeded", {
      originalMessageCount: messages.length,
      compactedMessageCount: compactionResult.summaryMessages.length +
                            compactionResult.attachments.length +
                            compactionResult.hookResults.length,
      preCompactTokenCount,
      postCompactTokenCount,
      compactionInputTokens: compactionUsage?.input_tokens,
      compactionOutputTokens: compactionUsage?.output_tokens,
      queryChainId: chainId,
      queryDepth: queryTracking.depth
    });

    // Update compact tracking state
    if (!compactTracking?.compacted) {
      compactTracking = {
        compacted: true,
        turnId: generateUUID(),
        turnCounter: 0
      };
    }

    // Build compacted message array
    let compactedMessages = [
      compactionResult.boundaryMarker,
      ...compactionResult.summaryMessages,
      ...compactionResult.attachments,
      ...compactionResult.hookResults,
      ...(compactionResult.messagesToKeep ?? [])
    ];

    // Yield each compaction message
    for (let message of compactedMessages) {
      yield message;
    }

    messagesForQuery = compactedMessages;
  }

  // Update context with prepared messages
  toolUseContext = { ...toolUseContext, messages: messagesForQuery };

  // ========================================
  // PHASE 4: STREAMING TOOL EXECUTOR SETUP
  // ========================================

  let assistantMessages = [];
  let toolResults = [];

  // Create streaming tool executor if feature is enabled
  let streamingToolExecutor = await isFeatureEnabled("tengu_streaming_tool_execution2")
    ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
    : null;

  // Get current app state and permission mode
  let appState = await toolUseContext.getAppState();
  let permissionMode = appState.toolPermissionContext.mode;

  // Select model based on permission mode
  let modelToUse = selectModelForPermissionMode({
    permissionMode,
    mainLoopModel: toolUseContext.options.mainLoopModel,
    exceeds200kTokens: permissionMode === "plan" && exceeds200kTokens(messagesForQuery)
  });

  // Build combined system prompt
  let combinedSystemPrompt = buildSystemPrompt(systemPrompt, systemContext);

  let continueLoop = true;

  // ========================================
  // PHASE 5: MAIN STREAMING LOOP
  // ========================================

  try {
    while (continueLoop) {
      continueLoop = false;

      try {
        let didFallbackToNonStreaming = false;

        // Filter out orphaned messages from previous failed attempts
        let messagesToSend = messagesForQuery.filter(
          msg => !orphanedMessages.has(msg.uuid)
        );

        // Stream the API response
        for await (let event of streamingApiCall({
          messages: applyUserContext(messagesToSend, userContext),
          systemPrompt: combinedSystemPrompt,
          maxThinkingTokens: toolUseContext.options.maxThinkingTokens,
          tools: toolUseContext.options.tools,
          signal: toolUseContext.abortController.signal,
          options: {
            getToolPermissionContext: async () => {
              return (await toolUseContext.getAppState()).toolPermissionContext;
            },
            model: modelToUse,
            toolChoice: undefined,
            isNonInteractiveSession: toolUseContext.options.isNonInteractiveSession,
            fallbackModel,
            sdkBetas,
            onStreamingFallback: () => { didFallbackToNonStreaming = true; },
            querySource,
            agents: toolUseContext.options.agentDefinitions.activeAgents,
            hasAppendSystemPrompt: toolUseContext.options.hasAppendSystemPrompt,
            fetchOverride: undefined,
            mcpTools: appState.mcp.tools,
            queryTracking,
            taskIntensityOverride: getTaskIntensityOverride(),
            agentIdOrSessionId: toolUseContext.agentId
          }
        })) {

          // Handle streaming fallback - mark previous messages as orphaned
          if (didFallbackToNonStreaming) {
            for (let msg of assistantMessages) {
              orphanedMessages.add(msg.uuid);
            }
            logAnalytics("tengu_orphaned_messages_tracked", {
              orphanedMessageCount: assistantMessages.length,
              queryChainId: chainId,
              queryDepth: queryTracking.depth
            });

            // Generate error results for orphaned tool uses
            yield* generateOrphanedToolResults(
              assistantMessages,
              "Streaming fallback triggered"
            );

            assistantMessages.length = 0;
          }

          // Yield the event to caller
          yield event;

          // ========================================
          // PHASE 5a: PROCESS ASSISTANT MESSAGES
          // ========================================

          if (event.type === "assistant") {
            assistantMessages.push(event);

            // If streaming tool executor is active, queue tool calls
            if (streamingToolExecutor) {
              let toolUseBlocks = event.message.content.filter(
                block => block.type === "tool_use"
              );

              for (let toolBlock of toolUseBlocks) {
                streamingToolExecutor.addTool(toolBlock, event);
              }
            }
          }

          // ========================================
          // PHASE 5b: YIELD COMPLETED TOOL RESULTS
          // ========================================

          if (streamingToolExecutor) {
            for (let result of streamingToolExecutor.getCompletedResults()) {
              if (result.message) {
                yield result.message;
                toolResults.push(
                  ...normalizeMessages([result.message]).filter(m => m.type === "user")
                );
              }
            }
          }
        }

      } catch (apiError) {
        // Handle model fallback on specific errors
        if (apiError instanceof ModelFallbackError && fallbackModel) {
          modelToUse = fallbackModel;
          continueLoop = true;

          yield* generateOrphanedToolResults(
            assistantMessages,
            "Model fallback triggered"
          );
          assistantMessages.length = 0;

          toolUseContext.options.mainLoopModel = fallbackModel;

          logAnalytics("tengu_model_fallback_triggered", {
            original_model: apiError.originalModel,
            fallback_model: fallbackModel,
            entrypoint: "cli",
            queryChainId: chainId,
            queryDepth: queryTracking.depth
          });

          yield createSystemMessage(
            `Model fallback triggered: switching from ${apiError.originalModel} to ${apiError.fallbackModel}`,
            "info"
          );

          continue;
        }

        throw apiError;
      }
    }

  } catch (fatalError) {
    // Log fatal errors and clean up
    logError(fatalError instanceof Error ? fatalError : Error(String(fatalError)));
    let errorMessage = fatalError instanceof Error ? fatalError.message : String(fatalError);

    logAnalytics("tengu_query_error", {
      assistantMessages: assistantMessages.length,
      toolUses: assistantMessages.flatMap(
        m => m.message.content.filter(c => c.type === "tool_use")
      ).length,
      queryChainId: chainId,
      queryDepth: queryTracking.depth
    });

    yield* generateOrphanedToolResults(assistantMessages, errorMessage);
    yield createEndOfTurnMarker({ toolUse: false });
    logError("Query error", fatalError);
    return;
  }

  // ========================================
  // PHASE 6: POST-SAMPLING HOOKS
  // ========================================

  if (assistantMessages.length > 0) {
    runPostSamplingHooks([...messagesForQuery, ...assistantMessages], systemPrompt, userContext, systemContext, toolUseContext, querySource);
  }

  // Check for overly agreeable responses
  if (assistantMessages.some(msg =>
    msg.message.content.some(c =>
      c.type === "text" && containsOverlyAgreeablePatterns(c.text)
    )
  )) {
    logAnalytics("tengu_model_response_keyword_detected", {
      is_overly_agreeable: true,
      queryChainId: chainId,
      queryDepth: queryTracking.depth
    });
  }

  // ========================================
  // PHASE 7: CHECK ABORT STATUS
  // ========================================

  if (toolUseContext.abortController.signal.aborted) {
    yield* generateOrphanedToolResults(assistantMessages, "Interrupted by user");
    yield createEndOfTurnMarker({ toolUse: false });
    return;
  }

  // ========================================
  // PHASE 8: TOOL EXECUTION DECISION
  // ========================================

  let toolUseBlocks = assistantMessages.flatMap(
    msg => msg.message.content.filter(c => c.type === "tool_use")
  );

  // If no tool calls, run stop hooks and potentially continue
  if (!assistantMessages.length || !toolUseBlocks.length) {
    yield* runStopHooks(
      messagesForQuery, assistantMessages, systemPrompt, userContext,
      systemContext, canUseTool, toolUseContext, querySource,
      compactTracking, fallbackModel, stopHookActive
    );

    yield* handleSteeringAttachments(
      messagesForQuery, assistantMessages, systemPrompt, userContext,
      systemContext, canUseTool, toolUseContext, querySource,
      compactTracking, fallbackModel
    );
    return;
  }

  // ========================================
  // PHASE 9: EXECUTE REMAINING TOOLS
  // ========================================

  let hookStoppedContinuation = false;
  let updatedContext = toolUseContext;

  if (streamingToolExecutor) {
    // Use streaming tool executor
    logAnalytics("tengu_streaming_tool_execution_used", {
      tool_count: toolUseBlocks.length,
      queryChainId: chainId,
      queryDepth: queryTracking.depth
    });

    for await (let result of streamingToolExecutor.getRemainingResults()) {
      let message = result.message;
      if (!message) continue;

      yield message;

      if (message.type === "attachment" &&
          message.attachment.type === "hook_stopped_continuation") {
        hookStoppedContinuation = true;
      }

      toolResults.push(
        ...normalizeMessages([message]).filter(m => m.type === "user")
      );
    }

    updatedContext = {
      ...streamingToolExecutor.getUpdatedContext(),
      queryTracking
    };

  } else {
    // Use non-streaming tool executor
    logAnalytics("tengu_streaming_tool_execution_not_used", {
      tool_count: toolUseBlocks.length,
      queryChainId: chainId,
      queryDepth: queryTracking.depth
    });

    for await (let result of executeToolsSequentially(
      toolUseBlocks, assistantMessages, canUseTool, toolUseContext
    )) {
      if (result.message) {
        yield result.message;

        if (result.message.type === "attachment" &&
            result.message.attachment.type === "hook_stopped_continuation") {
          hookStoppedContinuation = true;
        }

        toolResults.push(
          ...normalizeMessages([result.message]).filter(m => m.type === "user")
        );
      }

      if (result.newContext) {
        updatedContext = { ...result.newContext, queryTracking };
      }
    }
  }

  // ========================================
  // PHASE 10: POST-TOOL EXECUTION
  // ========================================

  // Check if user aborted during tool execution
  if (toolUseContext.abortController.signal.aborted) {
    let wasToolRejection = toolUseContext.abortController.signal.reason === "tool-rejection";
    yield createEndOfTurnMarker({ toolUse: true });
    return;
  }

  // If hook stopped continuation, don't recurse
  if (hookStoppedContinuation) {
    return;
  }

  // Track post-compaction turns
  if (compactTracking?.compacted) {
    compactTracking.turnCounter++;
    logAnalytics("tengu_post_autocompact_turn", {
      turnId: compactTracking.turnId,
      turnCounter: compactTracking.turnCounter,
      queryChainId: chainId,
      queryDepth: queryTracking.depth
    });
  }

  // ========================================
  // PHASE 11: PROCESS QUEUED COMMANDS
  // ========================================

  let queuedCommands = [...(await updatedContext.getAppState()).queuedCommands];
  let steeringAttachments = [];

  logAnalytics("tengu_query_before_attachments", {
    messagesForQueryCount: messagesForQuery.length,
    assistantMessagesCount: assistantMessages.length,
    toolResultsCount: toolResults.length,
    queryChainId: chainId,
    queryDepth: queryTracking.depth
  });

  // Process any queued commands (like follow-up prompts)
  for await (let attachment of processQueuedCommands(
    null, updatedContext, null, queuedCommands,
    [...messagesForQuery, ...assistantMessages, ...toolResults],
    querySource
  )) {
    yield attachment;
    toolResults.push(attachment);

    if (isSteeringAttachment(attachment)) {
      steeringAttachments.push(attachment);
    }
  }

  // Track file changes
  let fileChangeCount = toolResults.filter(
    r => r.type === "attachment" && r.attachment.type === "edited_text_file"
  ).length;

  logAnalytics("tengu_query_after_attachments", {
    totalToolResultsCount: toolResults.length,
    fileChangeAttachmentCount: fileChangeCount,
    queryChainId: chainId,
    queryDepth: queryTracking.depth
  });

  // Clear processed commands from state
  clearQueuedCommands(queuedCommands, updatedContext.setAppState);

  // ========================================
  // PHASE 12: RECURSIVE CONTINUATION
  // ========================================

  let nextContext = {
    ...updatedContext,
    pendingSteeringAttachments: steeringAttachments.length > 0 ? steeringAttachments : undefined,
    queryTracking
  };

  // Recursively call the agent loop with updated messages
  yield* mainAgentLoop({
    messages: [...messagesForQuery, ...assistantMessages, ...toolResults],
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext: nextContext,
    autoCompactTracking: compactTracking,
    fallbackModel,
    stopHookActive,
    querySource
  });
}

// Mapping: O$→mainAgentLoop, A→messages, Q→systemPrompt, B→userContext,
//          G→systemContext, Z→canUseTool, I→toolUseContext, Y→autoCompactTracking,
//          J→fallbackModel, W→stopHookActive, X→querySource
```

### Key Design Decisions

**Why recursive async generator?**
- Allows natural composition of tool results with new API calls
- Each recursion represents a "turn" in the conversation
- Enables streaming of intermediate results to UI
- Maintains clean separation between API calls and tool execution

**Why track orphaned messages?**
- When streaming fails and falls back to non-streaming, previous partial responses become "orphaned"
- These need to be excluded from future API calls to avoid context corruption
- Uses a per-session Set to track UUIDs of orphaned messages

**Why separate compaction phase?**
- Context window limits require proactive management
- Compaction is expensive (requires API call to summarize)
- Running it before the main API call prevents mid-conversation failures

---

## Tool Execution Engine

### The EV0 Class (StreamingToolExecutor)

The `EV0` class is the **streaming tool execution engine** that manages parallel and serial tool execution with sophisticated concurrency control.

```javascript
// ============================================
// StreamingToolExecutor - Concurrent Tool Execution Engine
// Location: chunks.146.mjs:1335-1449
// Original class: EV0
// ============================================

// ORIGINAL (for source lookup):
class EV0 {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;
  constructor(A, Q, B) { /* ... */ }
  addTool(A, Q) { /* ... */ }
  canExecuteTool(A) { /* ... */ }
  async processQueue() { /* ... */ }
  // ...
}

// READABLE (for understanding):
class StreamingToolExecutor {
  // Tool definitions from system configuration
  toolDefinitions;

  // Function to check if a tool can be used
  canUseTool;

  // Queue of tools to execute
  tools = [];

  // Context for tool execution (permissions, state, etc.)
  toolUseContext;

  // Flag indicating if any tool has errored (stops further execution)
  hasErrored = false;

  constructor(toolDefinitions, canUseTool, toolUseContext) {
    this.toolDefinitions = toolDefinitions;
    this.canUseTool = canUseTool;
    this.toolUseContext = toolUseContext;
  }

  /**
   * Add a tool to the execution queue
   * @param toolBlock - The tool_use block from assistant message
   * @param assistantMessage - The full assistant message containing the tool call
   */
  addTool(toolBlock, assistantMessage) {
    // Find tool definition
    let toolDef = this.toolDefinitions.find(t => t.name === toolBlock.name);
    if (!toolDef) return;

    // Parse input and check if tool is concurrency-safe
    let parseResult = toolDef.inputSchema.safeParse(toolBlock.input);
    let isConcurrencySafe = parseResult?.success
      ? toolDef.isConcurrencySafe(parseResult.data)
      : false;

    // Add to queue with metadata
    this.tools.push({
      id: toolBlock.id,
      block: toolBlock,
      assistantMessage,
      status: "queued",
      isConcurrencySafe
    });

    // Trigger queue processing
    this.processQueue();
  }

  /**
   * Check if a tool can be executed now
   * - Returns true if no tools are executing
   * - Returns true if tool is concurrency-safe AND all executing tools are too
   */
  canExecuteTool(isConcurrencySafe) {
    let executingTools = this.tools.filter(t => t.status === "executing");

    // If nothing executing, we can execute
    if (executingTools.length === 0) return true;

    // If this tool is concurrency-safe AND all executing are too, we can execute
    return isConcurrencySafe && executingTools.every(t => t.isConcurrencySafe);
  }

  /**
   * Process the tool queue - execute tools that can run
   */
  async processQueue() {
    for (let tool of this.tools) {
      if (tool.status !== "queued") continue;

      if (this.canExecuteTool(tool.isConcurrencySafe)) {
        // Tool can execute - start it
        await this.executeTool(tool);
      } else if (!tool.isConcurrencySafe) {
        // Tool requires serial execution - stop processing
        // (wait for current parallel batch to complete)
        break;
      }
    }
  }

  /**
   * Execute a single tool
   */
  async executeTool(tool) {
    tool.status = "executing";

    // Track in-progress tools for UI
    this.toolUseContext.setInProgressToolUseIDs(
      ids => new Set([...ids, tool.id])
    );

    let results = [];
    let contextModifiers = [];

    // Create execution promise
    let executionPromise = (async () => {
      // Check for abort conditions
      let abortReason = this.getAbortReason();
      if (abortReason) {
        results.push(this.createSyntheticErrorMessage(tool.id, abortReason));
        tool.results = results;
        tool.contextModifiers = contextModifiers;
        tool.status = "completed";
        return;
      }

      // Execute the tool
      let toolExecutor = executeSingleTool(
        tool.block,
        tool.assistantMessage,
        this.canUseTool,
        this.toolUseContext
      );

      for await (let event of toolExecutor) {
        // Check for abort during execution
        let abortReason = this.getAbortReason();
        if (abortReason) {
          results.push(this.createSyntheticErrorMessage(tool.id, abortReason));
          break;
        }

        // Track errors from tool results
        if (event.message?.type === "user" &&
            Array.isArray(event.message.message.content) &&
            event.message.message.content.some(c =>
              c.type === "tool_result" && c.is_error === true
            )) {
          this.hasErrored = true;
          this.toolUseContext.abortController.abort();
        }

        if (event.message) results.push(event.message);
        if (event.contextModifier) contextModifiers.push(event.contextModifier.modifyContext);
      }

      tool.results = results;
      tool.contextModifiers = contextModifiers;
      tool.status = "completed";

      // Apply context modifiers for non-concurrent tools immediately
      if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
        for (let modifier of contextModifiers) {
          this.toolUseContext = modifier(this.toolUseContext);
        }
      }
    })();

    tool.promise = executionPromise;

    // When this tool completes, try to process more from queue
    executionPromise.finally(() => {
      this.processQueue();
    });
  }

  /**
   * Generator that yields completed results in order
   */
  *getCompletedResults() {
    for (let tool of this.tools) {
      if (tool.status === "yielded") continue;

      if (tool.status === "completed" && tool.results) {
        tool.status = "yielded";

        for (let result of tool.results) {
          yield { message: result };
        }

        // Remove from in-progress tracking
        removeFromInProgressSet(this.toolUseContext, tool.id);

      } else if (tool.status === "executing" && !tool.isConcurrencySafe) {
        // Stop here - can't yield results out of order for serial tools
        break;
      }
    }
  }

  /**
   * Async generator that waits for all remaining results
   */
  async *getRemainingResults() {
    while (this.hasUnfinishedTools()) {
      await this.processQueue();

      // Yield any completed results
      for (let result of this.getCompletedResults()) {
        yield result;
      }

      // If tools are executing but none completed, wait for one to finish
      if (this.hasExecutingTools() && !this.hasCompletedResults()) {
        let executingPromises = this.tools
          .filter(t => t.status === "executing" && t.promise)
          .map(t => t.promise);

        if (executingPromises.length > 0) {
          await Promise.race(executingPromises);
        }
      }
    }

    // Final yield of any remaining results
    for (let result of this.getCompletedResults()) {
      yield result;
    }
  }

  // ... helper methods
}

// Mapping: EV0→StreamingToolExecutor, A→toolDefinitions, Q→canUseTool, B→toolUseContext
```

---

## Tool Parallel/Serial Control

### The isConcurrencySafe Mechanism

**What it does:** Determines whether a tool can safely run in parallel with other tools.

**How it works:**

1. Each tool definition includes an `isConcurrencySafe(input)` function
2. When a tool is queued, its concurrency safety is evaluated based on its input
3. The executor groups tools into "batches" - parallel batches of safe tools, followed by serial tools

### Concurrency Decision Algorithm

```javascript
// ============================================
// groupToolsByConcurrency - Group tools for execution
// Location: chunks.146.mjs:2154-2166
// Original function: mk3(A, Q)
// ============================================

// ORIGINAL (for source lookup):
function mk3(A, Q) {
  return A.reduce((B, G) => {
    let Z = Q.options.tools.find((J) => J.name === G.name),
      I = Z?.inputSchema.safeParse(G.input),
      Y = I?.success ? Boolean(Z?.isConcurrencySafe(I.data)) : !1;
    if (Y && B[B.length - 1]?.isConcurrencySafe) B[B.length - 1].blocks.push(G);
    else B.push({ isConcurrencySafe: Y, blocks: [G] });
    return B
  }, [])
}

// READABLE (for understanding):
function groupToolsByConcurrency(toolUseBlocks, toolUseContext) {
  return toolUseBlocks.reduce((groups, toolBlock) => {
    // Find tool definition
    let toolDef = toolUseContext.options.tools.find(t => t.name === toolBlock.name);

    // Parse input and check concurrency safety
    let parseResult = toolDef?.inputSchema.safeParse(toolBlock.input);
    let isConcurrencySafe = parseResult?.success
      ? Boolean(toolDef?.isConcurrencySafe(parseResult.data))
      : false;

    // Group consecutive concurrency-safe tools together
    if (isConcurrencySafe && groups[groups.length - 1]?.isConcurrencySafe) {
      // Add to existing parallel group
      groups[groups.length - 1].blocks.push(toolBlock);
    } else {
      // Create new group
      groups.push({
        isConcurrencySafe,
        blocks: [toolBlock]
      });
    }

    return groups;
  }, []);
}

// Mapping: mk3→groupToolsByConcurrency, A→toolUseBlocks, Q→toolUseContext
```

### Tool Concurrency Definitions by Category

| Tool | isConcurrencySafe | Reason |
|------|-------------------|--------|
| **Read** | `true` | Read-only, no side effects |
| **Glob** | `true` | Read-only file pattern matching |
| **Grep** | `true` | Read-only content search |
| **WebFetch** | `true` | External HTTP requests (no local side effects) |
| **WebSearch** | `true` | External search (no local side effects) |
| **Edit** | `false` | Modifies files - must be serial |
| **Write** | `false` | Creates/overwrites files - must be serial |
| **Bash** | `(input) => false` | Command execution - always serial |
| **TodoWrite** | `false` | Modifies session state |
| **Task** (Agent spawn) | `true` | Spawns independent sub-agent |
| **EnterPlanMode** | `true` | Mode transition - no file changes |
| **ExitPlanMode** | `true` | Mode transition - reads plan file |
| **AskUserQuestion** | `false` | User interaction required |

### Concurrency Example

Given these tool calls from the model:
```
1. Read file A
2. Read file B
3. Grep in directory
4. Edit file A
5. Read file C
6. Bash command
```

The grouping would be:
```
Group 1 (parallel): [Read A, Read B, Grep]  // All concurrency-safe
Group 2 (serial):   [Edit A]                 // Not safe - modifies file
Group 3 (parallel): [Read C]                 // Safe again
Group 4 (serial):   [Bash]                   // Not safe - command execution
```

### Parallel Execution Implementation

```javascript
// ============================================
// executeToolsInParallel - Run concurrency-safe tools together
// Location: chunks.146.mjs:2183-2187
// Original function: ck3(A, Q, B, G)
// ============================================

// ORIGINAL (for source lookup):
async function* ck3(A, Q, B, G) {
  yield* SYA(A.map(async function*(Z) {
    G.setInProgressToolUseIDs((I) => new Set([...I, Z.id]));
    yield* OY1(Z, Q.find((I) => I.message.content.some((Y) => Y.type === "tool_use" && Y.id === Z.id)), B, G);
    pX9(G, Z.id)
  }), hk3())
}

// READABLE (for understanding):
async function* executeToolsInParallel(toolBlocks, assistantMessages, canUseTool, toolUseContext) {
  // Get max concurrency from environment (default: 10)
  let maxConcurrency = getMaxToolConcurrency(); // CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || 10

  // Map each tool to an async generator and run with concurrency limit
  yield* mergeAsyncGenerators(
    toolBlocks.map(async function*(toolBlock) {
      // Track this tool as in-progress
      toolUseContext.setInProgressToolUseIDs(
        ids => new Set([...ids, toolBlock.id])
      );

      // Find the assistant message containing this tool call
      let assistantMessage = assistantMessages.find(msg =>
        msg.message.content.some(c =>
          c.type === "tool_use" && c.id === toolBlock.id
        )
      );

      // Execute the tool
      yield* executeSingleTool(toolBlock, assistantMessage, canUseTool, toolUseContext);

      // Remove from in-progress tracking
      removeFromInProgressSet(toolUseContext, toolBlock.id);
    }),
    maxConcurrency
  );
}

// Mapping: ck3→executeToolsInParallel, A→toolBlocks, Q→assistantMessages, B→canUseTool, G→toolUseContext
```

### Serial Execution Implementation

```javascript
// ============================================
// executeToolsSerially - Run tools one at a time
// Location: chunks.146.mjs:2168-2181
// Original function: dk3(A, Q, B, G)
// ============================================

// ORIGINAL (for source lookup):
async function* dk3(A, Q, B, G) {
  let Z = G;
  for (let I of A) {
    G.setInProgressToolUseIDs((Y) => new Set([...Y, I.id]));
    for await (let Y of OY1(I, Q.find((J) => J.message.content.some((W) => W.type === "tool_use" && W.id === I.id)), B, Z)) {
      if (Y.contextModifier) Z = Y.contextModifier.modifyContext(Z);
      yield { message: Y.message, newContext: Z }
    }
    pX9(G, I.id)
  }
}

// READABLE (for understanding):
async function* executeToolsSerially(toolBlocks, assistantMessages, canUseTool, toolUseContext) {
  let currentContext = toolUseContext;

  for (let toolBlock of toolBlocks) {
    // Track this tool as in-progress
    toolUseContext.setInProgressToolUseIDs(
      ids => new Set([...ids, toolBlock.id])
    );

    // Find the assistant message containing this tool call
    let assistantMessage = assistantMessages.find(msg =>
      msg.message.content.some(c =>
        c.type === "tool_use" && c.id === toolBlock.id
      )
    );

    // Execute the tool
    for await (let event of executeSingleTool(toolBlock, assistantMessage, canUseTool, currentContext)) {
      // Apply context modifiers immediately (serial execution allows this)
      if (event.contextModifier) {
        currentContext = event.contextModifier.modifyContext(currentContext);
      }

      yield {
        message: event.message,
        newContext: currentContext
      };
    }

    // Remove from in-progress tracking
    removeFromInProgressSet(toolUseContext, toolBlock.id);
  }
}

// Mapping: dk3→executeToolsSerially, A→toolBlocks, Q→assistantMessages, B→canUseTool, G→toolUseContext, Z→currentContext
```

---

## Plan Mode Integration

### How Plan Mode Works with the Agent Loop

Plan mode modifies the agent loop behavior through:

1. **Permission Mode**: When `permissionMode === "plan"`, certain behaviors change
2. **Tool Restrictions**: Write/Edit tools are restricted in plan mode
3. **System Prompt Additions**: Plan mode adds specific instructions

### Plan Mode Detection & Model Selection

```javascript
// ============================================
// selectModelForPermissionMode - Select appropriate model
// Location: chunks.146.mjs:1790-1794
// Original function: Pt(config)
// ============================================
function selectModelForPermissionMode({ permissionMode, mainLoopModel, exceeds200kTokens }) {
  // In plan mode with large context, may use different model
  if (permissionMode === "plan" && exceeds200kTokens) {
    // Special handling for large plan mode contexts
  }
  return mainLoopModel;
}
```

### EnterPlanMode Tool

```javascript
// ============================================
// EnterPlanMode Tool Definition
// Location: chunks.130.mjs:2328-2399
// ============================================

const EnterPlanModeTool = {
  name: "EnterPlanMode",

  async description() {
    return "Requests permission to enter plan mode for complex tasks requiring exploration and design";
  },

  async prompt() {
    return `Use EnterPlanMode when ANY of these conditions apply:

1. **Multiple Valid Approaches**: The task can be solved in several different ways
2. **Significant Architectural Decisions**: Requires choosing between patterns
3. **Large-Scale Changes**: Touches many files or systems
4. **Unclear Requirements**: Need to explore before understanding scope
5. **User Input Needed**: Will need clarifying questions

## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use AskUserQuestion if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement`;
  },

  inputSchema: z.strictObject({}),

  isConcurrencySafe() { return true; },
  isReadOnly() { return true; },

  async checkPermissions(input) {
    return {
      behavior: "ask",
      message: "Enter plan mode?",
      updatedInput: input
    };
  },

  async call(input, context) {
    let sessionId = getSessionId();

    // EnterPlanMode cannot be used in sub-agent contexts
    if (context.agentId !== sessionId) {
      throw Error("EnterPlanMode tool cannot be used in agent contexts");
    }

    return {
      data: {
        message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
      }
    };
  },

  mapToolResultToToolResultBlockParam({ message }, toolUseId) {
    return {
      type: "tool_result",
      content: `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
      tool_use_id: toolUseId
    };
  }
};
```

### ExitPlanMode Tool

```javascript
// ============================================
// ExitPlanMode Tool Definition
// Location: chunks.130.mjs:1847-1909
// ============================================

const ExitPlanModeTool = {
  name: "ExitPlanMode",

  async description() {
    return "Prompts the user to exit plan mode and start coding";
  },

  async prompt() {
    return `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the AskUserQuestion tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Edit your plan file to incorporate user feedback
5. Only proceed with ExitPlanMode after resolving ambiguities and updating the plan file`;
  },

  inputSchema: z.strictObject({}).passthrough(),

  outputSchema: z.object({
    plan: z.string().describe("The plan that was presented to the user"),
    isAgent: z.boolean(),
    filePath: z.string().optional().describe("The file path where the plan was saved")
  }),

  isConcurrencySafe() { return true; },
  isReadOnly() { return false; },

  async checkPermissions(input) {
    return {
      behavior: "ask",
      message: "Exit plan mode?",
      updatedInput: input
    };
  },

  async call(input, context) {
    let sessionId = getSessionId();
    let isAgent = context.agentId !== sessionId;
    let planFilePath = getPlanFilePath(context.agentId);
    let planContent = readPlanFile(context.agentId);

    if (!planContent) {
      throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
    }

    return {
      data: {
        plan: planContent,
        isAgent,
        filePath: planFilePath
      }
    };
  }
};
```

### Plan Mode System Prompt Addition

When plan mode is active, the following is added to the system prompt:

```javascript
// ============================================
// Plan Mode System Prompt Addition
// Location: chunks.153.mjs:2894-2960
// ============================================

const PLAN_MODE_SYSTEM_PROMPT = `
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
[A plan file already exists at {planFilePath}. You can read it and make incremental edits using the Edit tool.] / [No plan file exists yet. You should create your plan at {planFilePath} using the Write tool.]
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
`;
```

---

## Todo List Integration

### How Todo Works with the Agent Loop

The TodoWrite tool integrates with the agent loop through:

1. **Session State**: Todos are stored in `appState.todos[agentId]`
2. **System Prompt Reminders**: The system periodically reminds about using todos
3. **Tool Execution**: TodoWrite modifies state, which persists across turns

### TodoWrite Tool Definition

```javascript
// ============================================
// TodoWrite Tool Definition
// Location: chunks.60.mjs:1131-1212
// ============================================

const TodoWriteTool = {
  name: "TodoWrite",
  strict: true,

  input_examples: [{
    todos: [{
      content: "Implement user authentication",
      status: "in_progress",
      activeForm: "Implementing user authentication"
    }, {
      content: "Write unit tests",
      status: "pending",
      activeForm: "Writing unit tests"
    }]
  }],

  async description() {
    return "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks.";
  },

  inputSchema: z.strictObject({
    todos: z.array(z.object({
      content: z.string().min(1, "Content cannot be empty"),
      status: z.enum(["pending", "in_progress", "completed"]),
      activeForm: z.string().min(1, "Active form cannot be empty")
    })).describe("The updated todo list")
  }),

  outputSchema: z.object({
    oldTodos: z.array(/* ... */).describe("The todo list before the update"),
    newTodos: z.array(/* ... */).describe("The todo list after the update")
  }),

  isConcurrencySafe() { return false; },  // Must be serial - modifies state
  isReadOnly() { return false; },

  async checkPermissions(input) {
    return {
      behavior: "allow",  // Always allowed - no user permission needed
      updatedInput: input
    };
  },

  async call({ todos }, context) {
    // Get current todos for this agent
    let oldTodos = (await context.getAppState()).todos[context.agentId] ?? [];

    // If all todos are completed, clear the list
    let newTodos = todos.every(t => t.status === "completed") ? [] : todos;

    // Update state
    context.setAppState(state => ({
      ...state,
      todos: {
        ...state.todos,
        [context.agentId]: newTodos
      }
    }));

    return {
      data: {
        oldTodos,
        newTodos: todos  // Return original todos, not cleared version
      }
    };
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: "tool_result",
      content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
    };
  }
};
```

### Todo Reminder System

```javascript
// ============================================
// Todo Reminder Logic
// Location: chunks.107.mjs:2369-2382, chunks.154.mjs:91
// ============================================

// Tracking logic - count turns since last TodoWrite
function trackTurnsSinceTodoWrite(messages) {
  let lastTodoWriteTurn = -1;

  for (let i = messages.length - 1; i >= 0; i--) {
    let msg = messages[i];

    if (msg.type === "assistant" &&
        Array.isArray(msg.message?.content) &&
        msg.message.content.some(c => c.type === "tool_use" && c.name === "TodoWrite")) {
      lastTodoWriteTurn = i;
      break;
    }
  }

  return {
    turnsSinceLastTodoWrite: lastTodoWriteTurn === -1
      ? messages.length
      : messages.length - lastTodoWriteTurn
  };
}

// Reminder message (injected into tool results)
const TODO_REMINDER = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user`;
```

---

## Decision Flow Analysis

### Complete Decision Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER MESSAGE RECEIVED                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 1: TASK UNDERSTANDING                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  The LLM implicitly classifies the task through prompt understanding:        │
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │ System Prompt   │ Contains guidance on:                                  │
│  │                 │ • When to use TodoWrite (complex multi-step tasks)     │
│  │                 │ • When to use EnterPlanMode (architectural decisions)  │
│  │                 │ • When to use Task (agent spawning for exploration)    │
│  │                 │ • When to use AskUserQuestion (clarification needed)   │
│  └─────────────────┘                                                        │
│                                                                              │
│  Task Categories (inferred from prompt context):                             │
│  • Simple Query → Direct response, no tools                                 │
│  • Code Change → Use Edit/Write, maybe TodoWrite                            │
│  • Exploration → Use Read/Glob/Grep or Task with Explore agent              │
│  • Complex Task → Use TodoWrite for planning, multiple tools                │
│  • Architectural → Use EnterPlanMode                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PHASE 2: COMPLEXITY ASSESSMENT                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  The LLM decides tool strategy based on system prompt guidance:              │
│                                                                              │
│  IF task requires 3+ distinct steps OR is non-trivial:                      │
│    → Use TodoWrite to create task list                                      │
│    → Mark first task as in_progress                                         │
│                                                                              │
│  IF task has multiple valid approaches OR unclear requirements:             │
│    → Consider EnterPlanMode                                                  │
│    → Or use AskUserQuestion for clarification                               │
│                                                                              │
│  IF task is simple/straightforward:                                         │
│    → Execute directly without TodoWrite                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASE 3: TOOL SELECTION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM selects tools based on task type (from system prompt guidance):        │
│                                                                              │
│  Read Code:                                                                  │
│    → Use Read for specific files                                            │
│    → Use Glob for file patterns                                             │
│    → Use Grep for content search                                            │
│    → Use Task(Explore) for open-ended exploration                           │
│                                                                              │
│  Modify Code:                                                                │
│    → Must Read first (enforced by prompt)                                   │
│    → Use Edit for changes                                                   │
│    → Use Write only for new files                                           │
│                                                                              │
│  Execute Commands:                                                           │
│    → Use Bash for terminal operations                                       │
│    → Prefer specialized tools over Bash (Read > cat, Edit > sed)            │
│                                                                              │
│  Planning:                                                                   │
│    → Use EnterPlanMode for architectural decisions                          │
│    → Use ExitPlanMode when plan is ready                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PHASE 4: API CALL & RESPONSE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  O$ calls RYA/$E9 to get LLM response:                                      │
│                                                                              │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐          │
│  │   Messages   │───────▶│   Claude     │───────▶│   Response   │          │
│  │ + System     │        │     API      │        │ • Text       │          │
│  │ + Tools      │        │              │        │ • Tool calls │          │
│  └──────────────┘        └──────────────┘        └──────────────┘          │
│                                                                              │
│  Response may contain:                                                       │
│  • Text content (explanation, reasoning)                                    │
│  • Tool use blocks (tool calls to execute)                                  │
│  • Thinking blocks (extended reasoning, if enabled)                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASE 5: TOOL EXECUTION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool execution uses EV0 (StreamingToolExecutor) or sequential fallback:    │
│                                                                              │
│  Step 1: Group tools by concurrency                                         │
│    [Read A, Read B, Grep] → Parallel Group                                  │
│    [Edit C]               → Serial (alone)                                   │
│    [Read D, WebFetch]     → Parallel Group                                  │
│    [Bash]                 → Serial (alone)                                   │
│                                                                              │
│  Step 2: Execute groups                                                      │
│    Parallel groups: Promise.race with concurrency limit (default: 10)       │
│    Serial groups: Sequential execution with context updates                 │
│                                                                              │
│  Step 3: Collect results                                                     │
│    • Yield results in order (maintain conversation coherence)               │
│    • Apply context modifiers (e.g., Edit changes file state)                │
│    • Track errors (abort remaining if error occurs)                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PHASE 6: RESULT INTEGRATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool results are added to message history:                                  │
│                                                                              │
│  Original messages                                                           │
│       + Assistant message (with tool calls)                                 │
│       + User messages (tool results)                                        │
│       = Updated messages for next turn                                      │
│                                                                              │
│  Context updates applied:                                                    │
│  • File state changes recorded                                              │
│  • Todo list updates persisted                                              │
│  • Permission mode changes applied                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PHASE 7: CONTINUATION DECISION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Should the agent loop continue?                                             │
│                                                                              │
│  STOP if:                                                                    │
│  • No tool calls in response (conversation complete)                        │
│  • User aborted (Ctrl+C)                                                     │
│  • Stop hook prevented continuation                                         │
│  • Fatal error occurred                                                     │
│                                                                              │
│  CONTINUE if:                                                               │
│  • Tool calls were executed and results available                           │
│  • Model needs to see results to continue task                              │
│                                                                              │
│  If continuing:                                                              │
│  • Check for context compaction need                                        │
│  • Update todo status if applicable                                         │
│  • Recurse with updated messages                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ LOOP TO PHASE │
                              │      4        │
                              └───────────────┘
```

---

## Deep Dive: Task Categories, Complexity Assessment, and Tool Selection

### Important Design Insight

**Claude Code does NOT have explicit code for task classification, complexity assessment, or tool selection.** These decisions are made by the LLM itself, guided by detailed system prompts. The system prompt contains rules, examples, and guidance that the model uses to make these decisions implicitly during inference.

This is a **prompt-engineering approach** rather than a **code-driven approach**:
- No `classifyTask()` function exists
- No `assessComplexity()` function exists
- No `selectTools()` function exists

Instead, the system prompt teaches the model HOW to think about tasks.

---

### PHASE 1: Task Categories (Prompt-Driven Classification)

**How it works:** The LLM implicitly classifies tasks by matching user requests against patterns described in the system prompt and tool descriptions.

#### Task Category Decision Matrix

| User Request Pattern | Inferred Category | Primary Tools | Secondary Tools |
|---------------------|-------------------|---------------|-----------------|
| "What is X?" / "Explain Y" | **Informational** | None (direct response) | - |
| "Find files matching..." | **File Search** | Glob, Grep | Read |
| "Where is X defined?" | **Code Search** | Task(Explore) | Grep, Glob |
| "Read file X" | **File Read** | Read | - |
| "Fix bug in X" | **Code Modification** | Read → Edit | Bash (tests) |
| "Add feature X" | **Multi-step Task** | TodoWrite → multiple tools | - |
| "Refactor the auth system" | **Architectural** | EnterPlanMode | Task(Plan) |
| "Run npm install" | **Command Execution** | Bash | - |

#### System Prompt Guidance for Task Understanding

```javascript
// ============================================
// System Prompt - Doing Tasks Section
// Location: chunks.152.mjs:2397-2408
// ============================================

// ORIGINAL (for source lookup):
`# Doing tasks
The user will primarily request you perform software engineering tasks. This includes solving bugs, adding new functionality, refactoring code, explaining code, and more. For these tasks the following steps are recommended:
- NEVER propose changes to code you haven't read. If a user asks about or wants you to modify a file, read it first. Understand existing code before suggesting modifications.
- ${W.has(BY.name)?`Use the ${BY.name} tool to plan the task if required`:""}
- ${W.has(pJ)?`Use the ${pJ} tool to ask questions, clarify and gather information as needed.`:""}
- Be careful not to introduce security vulnerabilities such as command injection, XSS, SQL injection, and other OWASP top 10 vulnerabilities. If you notice that you wrote insecure code, immediately fix it.
- Avoid over-engineering. Only make changes that are directly requested or clearly necessary. Keep solutions simple and focused.`

// READABLE (for understanding):
const DOING_TASKS_GUIDANCE = `
# Doing tasks
The user will primarily request you perform software engineering tasks. This includes:
- Solving bugs
- Adding new functionality
- Refactoring code
- Explaining code

For these tasks the following steps are recommended:
- NEVER propose changes to code you haven't read
- If a user asks about or wants you to modify a file, read it first
- Understand existing code before suggesting modifications
- Use the TodoWrite tool to plan the task if required
- Use the AskUserQuestion tool to ask questions, clarify and gather information as needed
- Be careful not to introduce security vulnerabilities
- Avoid over-engineering - only make changes that are directly requested
`;
```

#### Agent Type Selection (Task → Agent Mapping)

The `Task` tool prompt provides explicit guidance on when to use different agent types:

```javascript
// ============================================
// Task Tool Agent Selection Guidance
// Location: chunks.125.mjs:988-1057
// ============================================

// ORIGINAL (for source lookup):
async function ob2(A) {
  let Q = A.map((B) => {
    let G = "";
    if (B?.forkContext) G = "Properties: " + (B?.forkContext ? "access to current context; " : "");
    let Z = B.tools ? B.tools.join(", ") : "All tools";
    return `- ${B.agentType}: ${B.whenToUse} (${G}Tools: ${Z})`
  }).join(`\n`);
  return `Launch a new agent to handle complex, multi-step tasks autonomously.

The ${A6} tool launches specialized agents (subprocesses) that autonomously handle complex tasks...

When NOT to use the ${A6} tool:
- If you want to read a specific file path, use the Read or Glob tool instead
- If you are searching for a specific class definition like "class Foo", use the Glob tool instead
- If you are searching for code within a specific file or set of 2-3 files, use the Read tool instead
- Other tasks that are not related to the agent descriptions above`
}

// READABLE (for understanding):
function generateTaskToolPrompt(agentDefinitions) {
  // Build agent type list with their use cases
  let agentDescriptions = agentDefinitions.map(agent => {
    let properties = agent.forkContext ? "access to current context; " : "";
    let tools = agent.tools ? agent.tools.join(", ") : "All tools";
    return `- ${agent.agentType}: ${agent.whenToUse} (${properties}Tools: ${tools})`;
  }).join("\n");

  return `
Launch a new agent to handle complex, multi-step tasks autonomously.

The Task tool launches specialized agents (subprocesses) that autonomously handle complex tasks.
Each agent type has specific capabilities and tools available to it.

Available agent types:
${agentDescriptions}

When NOT to use the Task tool:
- If you want to read a specific file path → use Read or Glob instead
- If searching for a specific class definition like "class Foo" → use Glob instead
- If searching within a specific file or 2-3 files → use Read instead
`;
}

// Mapping: ob2→generateTaskToolPrompt, A→agentDefinitions
```

#### Built-in Agent Definitions

```javascript
// ============================================
// Built-in Agent Definitions
// Location: chunks.125.mjs:1243-1493
// ============================================

// general-purpose agent (o51)
const generalPurposeAgent = {
  agentType: "general-purpose",
  whenToUse: "General-purpose agent for researching complex questions, searching for code, " +
             "and executing multi-step tasks. When you are searching for a keyword or file " +
             "and are not confident that you will find the right match in the first few tries " +
             "use this agent to perform the search for you.",
  tools: ["*"],  // All tools
  model: "sonnet"
};

// Explore agent (xq)
const exploreAgent = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to ' +
             'quickly find files by patterns (eg. "src/components/**/*.tsx"), ' +
             'search code for keywords (eg. "API endpoints"), or answer questions about ' +
             'the codebase (eg. "how do API endpoints work?"). ' +
             'When calling this agent, specify the desired thoroughness level: ' +
             '"quick" for basic searches, "medium" for moderate exploration, ' +
             'or "very thorough" for comprehensive analysis.',
  disallowedTools: ["Task", "NotebookEdit", "Edit", "Write"],  // READ-ONLY
  model: "haiku"  // Fast model for quick exploration
};

// Plan agent (kWA)
const planAgent = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans. Use this when " +
             "you need to plan the implementation strategy for a task. Returns step-by-step " +
             "plans, identifies critical files, and considers architectural trade-offs.",
  disallowedTools: ["Task", "NotebookEdit", "Edit", "Write"],  // READ-ONLY
  model: "inherit"  // Uses caller's model
};
```

---

### PHASE 2: Complexity Assessment (Prompt-Driven)

**How it works:** The TodoWrite tool prompt contains detailed rules and examples that teach the model how to assess task complexity.

#### Complexity Assessment Rules (from TodoWrite prompt)

```javascript
// ============================================
// TodoWrite Tool Prompt - Complexity Assessment Rules
// Location: chunks.60.mjs:903-1086
// ============================================

// ORIGINAL (for source lookup):
nCB = `Use this tool to create and manage a structured task list for your current coding session...

## When to Use This Tool
Use this tool proactively in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. After receiving new instructions - Immediately capture user requirements as todos
6. When you start working on a task - Mark it as in_progress BEFORE beginning work
7. After completing a task - Mark it as completed and add any new follow-up tasks

## When NOT to Use This Tool

Skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do.`

// READABLE (Complexity Decision Tree):
const COMPLEXITY_ASSESSMENT_RULES = {
  // COMPLEX (Use TodoWrite):
  useTodoWrite: [
    "Task requires 3+ distinct steps or actions",
    "Task requires careful planning or multiple operations",
    "User explicitly requests todo list",
    "User provides list of things (numbered or comma-separated)",
    "New instructions received - capture requirements",
    "Starting work on a task - mark in_progress",
    "Completing task - mark completed"
  ],

  // SIMPLE (Skip TodoWrite):
  skipTodoWrite: [
    "Single, straightforward task",
    "Trivial task with no tracking benefit",
    "Task completable in < 3 trivial steps",
    "Purely conversational or informational request"
  ]
};
```

#### Complexity Assessment Examples (Teaching by Example)

```javascript
// ============================================
// TodoWrite Prompt - Positive Examples (USE TodoWrite)
// Location: chunks.60.mjs:928-996
// ============================================

// Example 1: Feature Implementation
const EXAMPLE_DARK_MODE = `
User: I want to add a dark mode toggle to the application settings.
      Make sure you run the tests and build when you're done!

Assistant thinking (implicit):
- "Add dark mode toggle" = multi-step feature
- Requires: UI component + state management + styling + updating components
- "Run tests and build" = additional verification steps
- This is clearly 5+ steps → USE TodoWrite

Assistant action:
*Creates todo list with:*
1. Creating dark mode toggle component in Settings page
2. Adding dark mode state management (context/store)
3. Implementing CSS-in-JS styles for dark theme
4. Updating existing components to support theme switching
5. Running tests and build process, addressing any failures
`;

// Example 2: Scope Discovery → Complexity
const EXAMPLE_RENAME_FUNCTION = `
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project

Assistant thinking (implicit):
- Initial scope unclear - need to search first
- After searching: found 15 instances across 8 files
- 8 files to modify = complex, multi-step task
- → USE TodoWrite (after discovering scope)

Assistant action:
1. First searches to understand scope
2. Upon finding multiple occurrences, creates todo list
3. Tracks each file that needs updating
`;

// Example 3: Multiple Features Listed
const EXAMPLE_ECOMMERCE = `
User: I need to implement these features for my e-commerce site:
      user registration, product catalog, shopping cart, and checkout flow.

Assistant thinking (implicit):
- User provided comma-separated list of 4 features
- Each feature is substantial (database, API, frontend)
- Clearly multi-step, complex implementation
- → USE TodoWrite immediately

Assistant action:
*Creates todo list breaking down each feature*
`;
```

```javascript
// ============================================
// TodoWrite Prompt - Negative Examples (SKIP TodoWrite)
// Location: chunks.60.mjs:998-1046
// ============================================

// Example 1: Informational Request
const EXAMPLE_HELLO_WORLD = `
User: How do I print 'Hello World' in Python?

Assistant thinking (implicit):
- Informational request
- No coding task to perform
- Single, trivial answer
- → SKIP TodoWrite

Assistant action:
print("Hello World")
(Direct response, no todo tracking)
`;

// Example 2: Simple Explanation
const EXAMPLE_GIT_STATUS = `
User: What does the git status command do?

Assistant thinking (implicit):
- Informational request
- User asking for explanation
- No actual coding task
- → SKIP TodoWrite
`;

// Example 3: Single Edit
const EXAMPLE_ADD_COMMENT = `
User: Can you add a comment to the calculateTotal function to explain what it does?

Assistant thinking (implicit):
- Single, straightforward task
- One location in code
- One edit operation
- → SKIP TodoWrite

Assistant action:
* Uses Edit tool to add comment *
(No todo tracking needed)
`;

// Example 4: Single Command
const EXAMPLE_NPM_INSTALL = `
User: Run npm install for me and tell me what happens.

Assistant thinking (implicit):
- Single command execution
- Immediate results
- No multi-step process
- → SKIP TodoWrite
`;
```

#### EnterPlanMode Complexity Triggers

```javascript
// ============================================
// EnterPlanMode Tool Prompt - When to Use
// Location: chunks.130.mjs:2199-2272
// ============================================

// ORIGINAL (for source lookup):
Id2 = `Use this tool when you encounter a complex task that requires careful planning and exploration before implementation...

## When to Use This Tool

Use EnterPlanMode when ANY of these conditions apply:

1. **Multiple Valid Approaches**: The task can be solved in several different ways, each with trade-offs
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

2. **Significant Architectural Decisions**: The task requires choosing between architectural patterns
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

3. **Large-Scale Changes**: The task touches many files or systems
   - Example: "Refactor the authentication system"
   - Example: "Migrate from REST to GraphQL"

4. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

5. **User Input Needed**: You'll need to ask clarifying questions before starting
   - If you would use AskUserQuestion to clarify the approach, consider EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Do NOT use EnterPlanMode for:
- Simple, straightforward tasks with obvious implementation
- Small bug fixes where the solution is clear
- Adding a single function or small feature
- Tasks you're already confident how to implement
- Research-only tasks (use the Task tool with explore agent instead)`

// READABLE (Decision Matrix):
const PLAN_MODE_DECISION = {
  // HIGH COMPLEXITY → EnterPlanMode
  usePlanMode: {
    multipleApproaches: [
      "Add caching" /* Redis vs in-memory vs file */,
      "Improve performance" /* many strategies */
    ],
    architecturalDecisions: [
      "Add real-time updates" /* WS vs SSE vs polling */,
      "Implement state management" /* Redux vs Context */
    ],
    largeScaleChanges: [
      "Refactor the authentication system",
      "Migrate from REST to GraphQL"
    ],
    unclearRequirements: [
      "Make the app faster" /* need profiling */,
      "Fix the bug in checkout" /* need investigation */
    ]
  },

  // LOW COMPLEXITY → Skip PlanMode
  skipPlanMode: [
    "Simple, straightforward tasks",
    "Small bug fixes with clear solution",
    "Adding a single function or small feature",
    "Tasks you're confident how to implement",
    "Research-only tasks → use Task(Explore) instead"
  ]
};
```

---

### PHASE 3: Tool Selection (Prompt-Driven)

**How it works:** The system prompt contains detailed guidance on which tools to use for different operations.

#### Tool Usage Policy (Core Selection Rules)

```javascript
// ============================================
// System Prompt - Tool Usage Policy
// Location: chunks.152.mjs:2413-2429
// ============================================

// ORIGINAL (for source lookup):
`# Tool usage policy${W.has(A6)?`
- When doing file search, prefer to use the ${A6} tool in order to reduce context usage.
- You should proactively use the ${A6} tool with specialized agents when the task at hand matches the agent's description.
${F}`:""}${W.has($X)?`
- When ${$X} returns a message about a redirect to a different host, you should immediately make a new ${$X} request with the redirect URL provided in the response.`:""}
- You can call multiple tools in a single response. If you intend to call multiple tools and there are no dependencies between them, make all independent tool calls in parallel.
- Use specialized tools instead of bash commands when possible, as this provides a better user experience. For file operations, use dedicated tools: ${d5} for reading files instead of cat/head/tail, ${$5} for editing instead of sed/awk, and ${wX} for creating files instead of cat with heredoc or echo redirection. Reserve bash tools exclusively for actual system commands and terminal operations that require shell execution.
- VERY IMPORTANT: When exploring the codebase to gather context or to answer a question that is not a needle query for a specific file/class/function, it is CRITICAL that you use the ${A6} tool with subagent_type=${xq.agentType} instead of running search commands directly.`

// READABLE (Tool Selection Rules):
const TOOL_USAGE_POLICY = `
# Tool usage policy

## File Search Preference
- When doing file search, prefer to use the Task tool to reduce context usage
- Proactively use Task tool with specialized agents when task matches agent description
- VERY IMPORTANT: For open-ended codebase exploration, use Task(Explore) instead of
  running Glob or Grep directly

## Parallel Tool Execution
- Call multiple tools in a single response when possible
- If tools have no dependencies, make all independent tool calls in parallel
- If tools depend on previous results, call them sequentially

## Specialized Tools Over Bash
Use dedicated tools instead of bash commands:
- Read for reading files (NOT cat/head/tail)
- Edit for editing files (NOT sed/awk)
- Write for creating files (NOT cat with heredoc or echo redirection)

Reserve Bash tools exclusively for:
- Actual system commands (git, npm, docker)
- Terminal operations that require shell execution
`;
```

#### Bash Tool Restrictions

```javascript
// ============================================
// Bash Tool Prompt - Restrictions
// Location: chunks.71.mjs:737-764
// ============================================

// ORIGINAL (for source lookup):
`Executes a given bash command in a persistent shell session with optional timeout...

IMPORTANT: This tool is for terminal operations like git, npm, docker, etc. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.

...

  - Avoid using Bash with the \`find\`, \`grep\`, \`cat\`, \`head\`, \`tail\`, \`sed\`, \`awk\`, or \`echo\` commands, unless explicitly instructed or when these commands are truly necessary for the task. Instead, always prefer using the dedicated tools for these commands:
    - File search: Use Glob (NOT find or ls)
    - Content search: Use Grep (NOT grep or rg)
    - Read files: Use Read (NOT cat/head/tail)
    - Edit files: Use Edit (NOT sed/awk)
    - Write files: Use Write (NOT echo >/cat <<EOF)
    - Communication: Output text directly (NOT echo/printf)`

// READABLE (Tool Mapping):
const BASH_TO_SPECIALIZED_TOOL_MAP = {
  // File Discovery
  "find": "Glob",      // find . -name "*.js" → Glob pattern="**/*.js"
  "ls": "Glob",        // ls src/ → Glob pattern="src/*"

  // Content Search
  "grep": "Grep",      // grep -r "pattern" → Grep pattern="pattern"
  "rg": "Grep",        // rg "pattern" → Grep pattern="pattern"

  // File Reading
  "cat": "Read",       // cat file.txt → Read file_path="file.txt"
  "head": "Read",      // head -20 file.txt → Read file_path="file.txt" limit=20
  "tail": "Read",      // tail -20 file.txt → Read file_path="file.txt" offset=-20

  // File Editing
  "sed": "Edit",       // sed -i 's/old/new/' → Edit old_string="old" new_string="new"
  "awk": "Edit",       // awk processing → Edit

  // File Creation
  "echo >": "Write",   // echo "content" > file → Write file_path="file" content="content"
  "cat <<EOF": "Write" // heredoc → Write
};

// ALLOWED Bash operations:
const BASH_ALLOWED = [
  "git status", "git add", "git commit", "git push", "git pull",
  "npm install", "npm run", "npm test",
  "docker build", "docker run",
  "mkdir", "rm", "mv", "cp",  // File operations without content
  "python script.py", "node script.js",  // Running scripts
  "curl", "wget"  // Network operations
];
```

#### Explore Agent System Prompt

```javascript
// ============================================
// Explore Agent System Prompt
// Location: chunks.125.mjs:1370-1404
// ============================================

// ORIGINAL (for source lookup):
li5 = `You are a file search specialist for Claude Code...

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
...

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Use ${iK} for broad file pattern matching
- Use ${xY} for searching file contents with regex
- Use ${d5} when you know the specific file path you need to read
- Use ${C9} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use ${C9} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install...

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files`

// READABLE (Explore Agent Tool Selection):
const EXPLORE_AGENT_TOOL_SELECTION = {
  primaryTools: {
    "Glob": "Use for broad file pattern matching (find files by name)",
    "Grep": "Use for searching file contents with regex (find code by content)",
    "Read": "Use when you know the specific file path you need"
  },

  bashAllowed: [
    "ls", "git status", "git log", "git diff", "find", "cat", "head", "tail"
  ],

  bashProhibited: [
    "mkdir", "touch", "rm", "cp", "mv",           // File operations
    "git add", "git commit",                       // Git modifications
    "npm install", "pip install"                   // Package operations
  ],

  parallelExecution: "Spawn multiple parallel tool calls for grepping and reading files"
};
```

#### Tool Selection Decision Tree (Synthesized)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TOOL SELECTION DECISION TREE                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER REQUEST                                                            │
│       │                                                                  │
│       ▼                                                                  │
│  ┌────────────────┐                                                      │
│  │ What type of   │                                                      │
│  │ operation?     │                                                      │
│  └────────────────┘                                                      │
│       │                                                                  │
│       ├──── READ CODE ────────────────────────────────────────────────▶ │
│       │     │                                                            │
│       │     ├─ Specific file path known? ──▶ Read                        │
│       │     ├─ Find files by pattern? ──▶ Glob                           │
│       │     ├─ Search content by regex? ──▶ Grep                         │
│       │     └─ Open-ended exploration? ──▶ Task(Explore)                 │
│       │                                                                  │
│       ├──── MODIFY CODE ──────────────────────────────────────────────▶ │
│       │     │                                                            │
│       │     ├─ Must Read first! (enforced by prompt)                     │
│       │     ├─ Change existing file? ──▶ Edit                            │
│       │     └─ Create new file? ──▶ Write                                │
│       │                                                                  │
│       ├──── EXECUTE COMMAND ──────────────────────────────────────────▶ │
│       │     │                                                            │
│       │     ├─ git/npm/docker operation? ──▶ Bash                        │
│       │     ├─ cat/head/tail? ──▶ Read (NOT Bash)                        │
│       │     ├─ grep/find? ──▶ Grep/Glob (NOT Bash)                       │
│       │     └─ sed/awk? ──▶ Edit (NOT Bash)                              │
│       │                                                                  │
│       ├──── PLANNING ─────────────────────────────────────────────────▶ │
│       │     │                                                            │
│       │     ├─ Architectural decision needed? ──▶ EnterPlanMode          │
│       │     └─ Plan complete, ready to code? ──▶ ExitPlanMode            │
│       │                                                                  │
│       └──── TASK MANAGEMENT ──────────────────────────────────────────▶ │
│             │                                                            │
│             ├─ Complex multi-step task? ──▶ TodoWrite                    │
│             ├─ Need user clarification? ──▶ AskUserQuestion              │
│             └─ Need autonomous research? ──▶ Task(general-purpose)       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Pseudocode & Code Snippets

### Complete Agent Turn Execution (Detailed Implementation)

**CRITICAL INSIGHT**: Claude Code does NOT have explicit "task classification" or "complexity assessment" code.
These decisions are made by the LLM itself during inference, guided by the comprehensive system prompt.

```javascript
// ============================================
// Complete Agent Turn Execution Flow - Detailed Implementation
// Location: synthesized from chunks.146.mjs, chunks.153.mjs, chunks.152.mjs
// ============================================

// ORIGINAL FUNCTION SIGNATURES:
// O$(config) - Main agent loop (chunks.146.mjs:1716)
// $E9(messages, systemPrompt, maxThinking, tools, signal, options) - Streaming API (chunks.153.mjs:3)
// gCB() - Get core system prompt prefix (chunks.60.mjs:474)

async function* executeAgentTurn(userMessage, conversationContext, tools) {

  // ============================================================
  // PHASE 0: MODEL SELECTION (Code-Driven)
  // ============================================================
  // This IS explicitly coded - different scenarios use different models

  let modelToUse = selectModelForContext(conversationContext);

  // ============================================================
  // PHASE 1: TASK UNDERSTANDING (Prompt-Driven, NOT Code-Driven)
  // ============================================================
  //
  // IMPORTANT: There is NO classifyTask() function!
  // Task understanding happens INSIDE the LLM based on system prompt.
  //
  // The system prompt teaches the LLM HOW to think about tasks.
  // The LLM reads the prompt and implicitly categorizes the task.
  //
  // What the code actually does: BUILD the system prompt that guides the LLM

  let systemPrompt = await buildCompleteSystemPrompt(conversationContext, tools);

  // ============================================================
  // PHASE 2: COMPLEXITY ASSESSMENT (Prompt-Driven, NOT Code-Driven)
  // ============================================================
  //
  // IMPORTANT: There is NO assessComplexity() function!
  // Complexity assessment happens INSIDE the LLM based on system prompt.
  //
  // The system prompt contains detailed rules like:
  // - "Use TodoWrite when task requires 3+ steps"
  // - "Use EnterPlanMode when multiple approaches exist"
  // - "Skip TodoWrite for single, trivial tasks"
  //
  // The LLM reads these rules and decides which tools to call.
  //
  // What the code actually does: NOTHING - it just sends the prompt to LLM

  // ============================================================
  // PHASE 3: PREPARE CONTEXT
  // ============================================================

  let messages = prepareMessages(userMessage, conversationContext);

  // Check if auto-compaction needed
  let { compactionResult } = await autoCompactDispatcher(messages, conversationContext);
  if (compactionResult) {
    messages = applyCompaction(messages, compactionResult);
    yield* compactionResult.systemMessages;
  }

  // ============================================================
  // PHASE 4: API CALL (Where Task Understanding Actually Happens)
  // ============================================================
  //
  // This is when the LLM:
  // 1. Reads the system prompt with all the guidance
  // 2. Understands the user's request
  // 3. Implicitly classifies the task
  // 4. Decides which tools to call (if any)
  // 5. Generates response with tool calls

  let apiResponse = yield* streamingApiCall({
    messages: applyUserContext(messages, conversationContext.userContext),
    systemPrompt,
    maxThinkingTokens: conversationContext.options.maxThinkingTokens,
    tools,
    signal: conversationContext.abortController.signal,
    options: {
      model: modelToUse,
      // ... other options
    }
  });

  let assistantMessages = collectAssistantMessages(apiResponse);
  let toolCalls = extractToolCalls(assistantMessages);

  // ============================================================
  // PHASE 5-7: TOOL EXECUTION, RESULT INTEGRATION, CONTINUATION
  // ============================================================
  // (Same as before - see main agent loop documentation)

  if (toolCalls.length > 0) {
    let toolGroups = groupToolsByConcurrency(toolCalls, conversationContext);
    let toolResults = yield* executeToolGroups(toolGroups, conversationContext);

    let updatedMessages = [...messages, ...assistantMessages, ...toolResults];

    yield* executeAgentTurn(null, {
      ...conversationContext,
      messages: updatedMessages
    }, tools);
  } else {
    yield* runStopHooks(conversationContext);
  }
}
```

---

### PHASE 0: Model Selection (Detailed Implementation)

```javascript
// ============================================
// Model Selection Logic
// Location: chunks.59.mjs:2725-2801, chunks.59.mjs:3028-3038
// ============================================

// ORIGINAL (for source lookup):
// MW() - Get small fast model (chunks.59.mjs:2725)
// Pt({permissionMode, mainLoopModel, exceeds200kTokens}) - Select for permission mode (chunks.59.mjs:2792)
// inA(agentModel, mainLoopModel, overrideModel, permissionMode) - Resolve agent model (chunks.59.mjs:3028)
// UD(modelName) - Resolve model ID (chunks.59.mjs:2998)

// READABLE (for understanding):

/**
 * Get the default "small fast model" for quick operations
 * Used for: hooks, quick assessments, background tasks
 */
function getSmallFastModel() {
  // Environment override takes priority
  if (process.env.ANTHROPIC_SMALL_FAST_MODEL) {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL;
  }
  // Default to Haiku (fast, cheap)
  return getDefaultHaikuModel();
}

/**
 * Get default Haiku model ID based on provider
 */
function getDefaultHaikuModel() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  }
  // First-party and Foundry use Haiku 4.5
  if (getProvider() === "firstParty" || getProvider() === "foundry") {
    return MODEL_IDS.haiku45;  // "claude-haiku-4-5-20250929"
  }
  // Others use Haiku 3.5
  return MODEL_IDS.haiku35;  // "claude-3-5-haiku-20241022"
}

/**
 * Get default Sonnet model ID
 */
function getDefaultSonnetModel() {
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  }
  return MODEL_IDS.sonnet45;  // "claude-sonnet-4-5-20250929"
}

/**
 * Get default Opus model ID
 */
function getDefaultOpusModel() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  }
  if (getProvider() === "firstParty") {
    return MODEL_IDS.opus45;  // "claude-opus-4-5-20251101"
  }
  return MODEL_IDS.opus41;  // "claude-opus-4-1-20250414"
}

/**
 * Select model based on permission mode (plan mode vs default)
 * Location: chunks.59.mjs:2792-2801
 */
function selectModelForPermissionMode({ permissionMode, mainLoopModel, exceeds200kTokens = false }) {
  // Special case: "opusplan" setting + plan mode + not too large
  // → Use Opus for planning
  if (getUserModelSetting() === "opusplan" && permissionMode === "plan" && !exceeds200kTokens) {
    return getDefaultOpusModel();
  }

  // Special case: Haiku user in plan mode
  // → Upgrade to Sonnet for planning (Haiku is too weak for planning)
  if (getUserModelSetting() === "haiku" && permissionMode === "plan") {
    return getDefaultSonnetModel();
  }

  // Default: use the main loop model
  return mainLoopModel;
}

/**
 * Resolve model for sub-agent (Task tool)
 * Location: chunks.59.mjs:3028-3038
 */
function resolveAgentModel(agentDefinedModel, mainLoopModel, userOverrideModel, permissionMode) {
  // Priority 1: Environment variable override
  if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) {
    return process.env.CLAUDE_CODE_SUBAGENT_MODEL;
  }

  // Priority 2: User explicitly specified model in Task call
  if (userOverrideModel) {
    return resolveModelId(userOverrideModel);  // "haiku" → full model ID
  }

  // Priority 3: Agent has no model preference → use Sonnet
  if (!agentDefinedModel) {
    return resolveModelId("sonnet");
  }

  // Priority 4: Agent uses "inherit" → use main loop model (with plan mode handling)
  if (agentDefinedModel === "inherit") {
    return selectModelForPermissionMode({
      permissionMode: permissionMode ?? "default",
      mainLoopModel,
      exceeds200kTokens: false
    });
  }

  // Priority 5: Agent has specific model → use it
  return resolveModelId(agentDefinedModel);  // "haiku" → full model ID
}

/**
 * Resolve short model name to full model ID
 * Location: chunks.59.mjs:2998-3014
 */
function resolveModelId(modelName) {
  let normalized = modelName.toLowerCase().trim();
  let has1mSuffix = normalized.endsWith("[1m]");
  let baseName = has1mSuffix ? normalized.replace(/\[1m]$/i, "").trim() : normalized;

  if (isKnownModelAlias(baseName)) {
    switch (baseName) {
      case "opusplan":
      case "sonnet":
        return getDefaultSonnetModel() + (has1mSuffix ? "[1m]" : "");
      case "haiku":
        return getDefaultHaikuModel() + (has1mSuffix ? "[1m]" : "");
      case "opus":
        return getDefaultOpusModel();
      default:
        // Unknown alias
    }
  }

  // Return as-is (already a full model ID)
  return normalized;
}

// Mapping: MW→getSmallFastModel, X7A→getDefaultHaikuModel, XU→getDefaultSonnetModel,
//          wUA→getDefaultOpusModel, Pt→selectModelForPermissionMode, inA→resolveAgentModel,
//          UD→resolveModelId
```

---

### PHASE 1 & 2: System Prompt Building (The Key to Task Understanding)

**This is the REAL implementation of "Task Understanding" and "Complexity Assessment".**
The LLM reads this prompt and learns how to categorize tasks and assess complexity.

```javascript
// ============================================
// System Prompt Building - Complete Implementation
// Location: chunks.152.mjs:2340-2500 (system prompt assembly)
// ============================================

// ORIGINAL (for source lookup):
// gCB() returns "" (empty prefix for Claude Code)
// hCB = "You are Claude Code, Anthropic's official CLI for Claude."
// The full prompt is assembled in $E9() at chunks.153.mjs:20

// READABLE (for understanding):

/**
 * Build the complete system prompt that guides the LLM
 * This is WHERE task understanding and complexity assessment are defined
 */
async function buildCompleteSystemPrompt(conversationContext, tools) {
  let prompts = [];

  // ========================================
  // PART 1: IDENTITY
  // ========================================
  prompts.push("You are Claude Code, Anthropic's official CLI for Claude.");

  // ========================================
  // PART 2: NON-INTERACTIVE SESSION MARKER (if applicable)
  // ========================================
  if (conversationContext.options.isNonInteractiveSession) {
    prompts.push(NON_INTERACTIVE_SESSION_PROMPT);
  }

  // ========================================
  // PART 3: TONE AND STYLE
  // ========================================
  prompts.push(`
# Tone and style
- Only use emojis if the user explicitly requests it.
- Your output will be displayed on a command line interface. Your responses should be short and concise.
- Output text to communicate with the user; all text you output outside of tool use is displayed to the user.
- NEVER create files unless they're absolutely necessary for achieving your goal.
`);

  // ========================================
  // PART 4: TASK MANAGEMENT (Complexity Assessment Guidance)
  // ========================================
  if (tools.includes("TodoWrite")) {
    prompts.push(`
# Task Management
You have access to the TodoWrite tool to help you manage and plan tasks.
Use these tools VERY frequently to ensure that you are tracking your tasks.

It is critical that you mark todos as completed as soon as you are done with a task.
Do not batch up multiple tasks before marking them as completed.
`);
  }

  // ========================================
  // PART 5: DOING TASKS (Task Understanding Guidance)
  // ========================================
  prompts.push(`
# Doing tasks
The user will primarily request you perform software engineering tasks.
This includes solving bugs, adding new functionality, refactoring code, explaining code, and more.

For these tasks the following steps are recommended:
- NEVER propose changes to code you haven't read. If a user asks about or wants you to modify a file, read it first.
- ${tools.includes("TodoWrite") ? "Use the TodoWrite tool to plan the task if required" : ""}
- ${tools.includes("AskUserQuestion") ? "Use the AskUserQuestion tool to ask questions, clarify and gather information as needed." : ""}
- Be careful not to introduce security vulnerabilities.
- Avoid over-engineering. Only make changes that are directly requested or clearly necessary.
`);

  // ========================================
  // PART 6: TOOL USAGE POLICY (Tool Selection Guidance)
  // ========================================
  prompts.push(`
# Tool usage policy
${tools.includes("Task") ? `
- When doing file search, prefer to use the Task tool in order to reduce context usage.
- You should proactively use the Task tool with specialized agents when the task matches the agent's description.
- VERY IMPORTANT: When exploring the codebase to gather context or answer a question that is not a needle query, use the Task tool with subagent_type=Explore instead of running search commands directly.
` : ""}
- You can call multiple tools in a single response. If you intend to call multiple tools and there are no dependencies between them, make all independent tool calls in parallel.
- Use specialized tools instead of bash commands when possible:
  - Read for reading files instead of cat/head/tail
  - Edit for editing instead of sed/awk
  - Write for creating files instead of cat with heredoc
- Reserve bash tools exclusively for actual system commands and terminal operations.
`);

  // ========================================
  // PART 7: PLAN MODE ADDITION (if in plan mode)
  // ========================================
  if (conversationContext.permissionMode === "plan") {
    let planFilePath = getPlanFilePath(conversationContext.agentId);
    let planFileExists = await checkFileExists(planFilePath);

    prompts.push(`
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools, or otherwise make any changes to the system.

## Plan File Info:
${planFileExists
  ? `A plan file already exists at ${planFilePath}. You can read it and make incremental edits using the Edit tool.`
  : `No plan file exists yet. You should create your plan at ${planFilePath} using the Write tool.`
}
You should build your plan incrementally by writing to or editing this file.
NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
`);
  }

  // ========================================
  // PART 8: INDIVIDUAL TOOL PROMPTS
  // ========================================
  // Each tool has its own detailed prompt that teaches the LLM
  // when and how to use it.

  // Example: TodoWrite tool prompt (teaches complexity assessment)
  // This is retrieved via tool.prompt() and included in API call

  // ========================================
  // PART 9: MCP TOOLS (if any)
  // ========================================
  if (conversationContext.mcpTools.length > 0) {
    prompts.push(buildMcpToolsPrompt(conversationContext.mcpTools));
  }

  // ========================================
  // PART 10: ENVIRONMENT INFO
  // ========================================
  prompts.push(`
Here is useful information about the environment you are running in:
<env>
Working directory: ${process.cwd()}
Is directory a git repo: ${await isGitRepo() ? "Yes" : "No"}
Platform: ${process.platform}
Today's date: ${new Date().toISOString().split("T")[0]}
</env>
`);

  return prompts.filter(Boolean);
}

// The actual tool prompts are built separately and sent via the tools parameter:
// Each tool definition includes a prompt() method that returns detailed guidance
// See PHASE 2 and PHASE 3 sections for TodoWrite and EnterPlanMode prompts
```

---

### The Key Insight: No Explicit Decision Code

```javascript
// ============================================
// IMPORTANT: What Claude Code Does NOT Have
// ============================================

// THERE IS NO CODE LIKE THIS:
function classifyTask(userMessage) {
  // Does NOT exist!
  if (userMessage.includes("refactor")) return "architectural";
  if (userMessage.includes("fix bug")) return "code_modification";
  // etc.
}

function assessComplexity(task) {
  // Does NOT exist!
  if (task.stepCount > 3) return "complex";
  return "simple";
}

function selectToolsForTask(taskCategory, complexity) {
  // Does NOT exist!
  if (complexity === "complex") return ["TodoWrite", ...];
  // etc.
}

// INSTEAD, the code does this:
async function* agentLoop(messages, tools, context) {
  // 1. Build comprehensive system prompt with all the guidance
  let systemPrompt = buildCompleteSystemPrompt(context, tools);

  // 2. Send to LLM - LLM makes ALL decisions based on prompt
  let response = await callClaudeAPI({
    messages,
    system: systemPrompt,  // Contains task understanding + complexity rules
    tools  // Each tool has its own prompt with usage guidance
  });

  // 3. Execute whatever tools the LLM decided to call
  // The LLM already did task understanding + complexity assessment
  // by reading the system prompt and deciding which tools to use
  for (let toolCall of response.toolCalls) {
    yield* executeToolCall(toolCall);
  }
}
```

---

### Agent Model Selection for Sub-Agents (Task Tool)

```javascript
// ============================================
// Sub-Agent Model Selection - Task Tool Implementation
// Location: chunks.145.mjs:1824-1846
// ============================================

// ORIGINAL (for source lookup):
// jn.call() in chunks.145.mjs:1824

// READABLE (for understanding):

/**
 * Task tool call implementation - shows how sub-agent models are selected
 */
async function* taskToolCall({
  prompt,
  subagent_type,
  description,
  model: userOverrideModel,  // User can specify "haiku", "sonnet", or "opus"
  resume,
  run_in_background
}, toolUseContext) {

  // Find the agent definition
  let activeAgents = toolUseContext.options.agentDefinitions.activeAgents;
  let agentDef = activeAgents.find(a => a.agentType === subagent_type);

  if (!agentDef) {
    throw Error(`Agent type '${subagent_type}' not found. Available: ${activeAgents.map(a => a.agentType).join(", ")}`);
  }

  // Get current permission mode (default vs plan)
  let appState = await toolUseContext.getAppState();
  let permissionMode = appState.toolPermissionContext.mode;

  // ========================================
  // MODEL SELECTION FOR SUB-AGENT
  // ========================================
  // Priority order:
  // 1. CLAUDE_CODE_SUBAGENT_MODEL env var
  // 2. User override in Task call (model: "haiku")
  // 3. Agent definition's model
  // 4. If agent.model === "inherit" → use main loop model
  // 5. Default to Sonnet

  let resolvedModel = resolveAgentModel(
    agentDef.model,                           // Agent's defined model (e.g., "haiku", "inherit")
    toolUseContext.options.mainLoopModel,     // Current main loop model
    userOverrideModel,                        // User's override (optional)
    permissionMode                            // "default" or "plan"
  );

  // Log analytics
  logAnalytics("tengu_agent_tool_selected", {
    agent_type: agentDef.agentType,
    model: resolvedModel,
    source: agentDef.source,
    is_built_in_agent: isBuiltInAgent(agentDef)
  });

  // ========================================
  // AGENT EXECUTION
  // ========================================

  // Get agent's system prompt
  let agentSystemPrompt = agentDef.getSystemPrompt({ toolUseContext });

  // Build prompt messages
  let promptMessages = agentDef.forkContext
    ? buildForkContextMessages(prompt, toolUseContext)  // Include parent context
    : [createUserMessage(prompt)];                       // Fresh context

  // Spawn sub-agent with resolved model
  let result = yield* spawnSubAgent({
    agentDefinition: agentDef,
    promptMessages,
    toolUseContext,
    model: resolvedModel,  // <-- This is the resolved model
    isAsync: run_in_background === true,
    systemPrompt: agentSystemPrompt
  });

  return result;
}

// Agent Model Configuration Examples:
const AGENT_MODEL_CONFIGS = {
  // Fast exploration - use Haiku for speed
  "Explore": {
    model: "haiku",  // Resolves to claude-haiku-4-5-20250929
    reason: "Fast agent that returns output as quickly as possible"
  },

  // General purpose - use Sonnet for capability
  "general-purpose": {
    model: "sonnet",  // Resolves to claude-sonnet-4-5-20250929
    reason: "Needs full capability for complex research tasks"
  },

  // Planning - inherit from parent
  "Plan": {
    model: "inherit",  // Uses selectModelForPermissionMode()
    reason: "Should use same model as caller for consistency"
  },

  // Status line setup - use Sonnet
  "statusline-setup": {
    model: "sonnet",
    reason: "Needs capability to understand shell configuration"
  },

  // Claude Code guide - use Haiku for quick docs lookup
  "claude-code-guide": {
    model: "haiku",
    reason: "Simple documentation retrieval task"
  }
};
```

---

### Tool Concurrency Decision

```javascript
// ============================================
// Tool Concurrency Decision Logic
// ============================================

function shouldRunToolInParallel(tool, currentlyExecuting, toolDefinitions) {
  // Find tool definition
  let toolDef = toolDefinitions.find(t => t.name === tool.name);
  if (!toolDef) return false;

  // Parse input
  let parseResult = toolDef.inputSchema.safeParse(tool.input);
  if (!parseResult.success) return false;

  // Check concurrency safety
  let isSafe = toolDef.isConcurrencySafe(parseResult.data);

  // Can run in parallel if:
  // 1. Tool is marked as concurrency-safe
  // 2. All currently executing tools are also concurrency-safe
  return isSafe && currentlyExecuting.every(t => t.isConcurrencySafe);
}

// Example tool definitions with concurrency
const toolDefinitions = [
  {
    name: "Read",
    isConcurrencySafe: () => true,  // Always safe - read-only
  },
  {
    name: "Edit",
    isConcurrencySafe: () => false, // Never safe - modifies files
  },
  {
    name: "Bash",
    isConcurrencySafe: (input) => {
      // Could be smart about read-only commands
      // But currently always returns false for safety
      return false;
    }
  },
  {
    name: "Task",
    isConcurrencySafe: () => true,  // Safe - spawns independent agent
  }
];
```

---

## Summary

The Claude Code agent loop is a sophisticated recursive execution engine that:

1. **Manages Context**: Auto-compacts messages when context limits approach
2. **Orchestrates Tools**: Intelligently groups tools for parallel/serial execution
3. **Integrates Planning**: Seamlessly transitions between exploration and implementation modes
4. **Tracks Progress**: Integrates with todo list for complex task management
5. **Handles Errors**: Gracefully recovers from failures with fallback mechanisms

### Key Insights

1. **Concurrency is Input-Dependent**: Tools like `Bash` could theoretically be concurrent for read-only commands, but are conservatively marked as serial for safety.

2. **Context Modifiers are Critical**: Serial execution applies context modifiers immediately, while parallel execution defers them until batch completion.

3. **Plan Mode is Prompt-Driven**: The mode change is primarily enforced through system prompt modifications rather than code logic.

4. **Todo Integration is State-Based**: Todos persist in session state and influence the system prompt through reminder injection.

5. **Orphaned Message Handling**: The system carefully tracks and excludes messages from failed streaming attempts to maintain context integrity.
