# Streaming UI Rendering

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Overview

Claude Code uses async generators (`async function*`) to implement streaming responses. This pattern enables:
1. **Real-time output** - Display tokens as they arrive
2. **Concurrent tool execution** - Run safe tools in parallel
3. **Interruptible operations** - Cancel mid-stream via AbortController
4. **Memory efficiency** - Process one chunk at a time

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Streaming Pipeline                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Main Streaming Entry (O$)                       │  │
│  │  - Handles compaction before streaming                   │  │
│  │  - Yields stream_request_start                           │  │
│  │  - Processes API stream events                           │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           API Stream Processing (RYA)                     │  │
│  │  - Makes streaming API call                              │  │
│  │  - Yields content blocks as they arrive                  │  │
│  │  - Handles model fallback                                │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│           ┌───────────────────┼───────────────────┐            │
│           ▼                                       ▼            │
│  ┌───────────────────────┐          ┌───────────────────────┐  │
│  │ Concurrent Executor   │          │ Sequential Executor   │  │
│  │      (ck3)           │          │      (dk3)            │  │
│  │  - Parallel async    │          │  - One tool at time   │  │
│  │  - For safe tools    │          │  - For stateful ops   │  │
│  └───────────────────────┘          └───────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Tool Executor (OY1)                             │  │
│  │  - Validates tool input                                  │  │
│  │  - Handles abort signals                                 │  │
│  │  - Yields tool_result messages                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Main Streaming Entry Point

```javascript
// ============================================
// streamingMainLoop - Main streaming entry point
// Location: chunks.146.mjs:1716-1860
// ============================================

// ORIGINAL (for source lookup):
async function* O$({
  messages: A,
  systemPrompt: Q,
  userContext: B,
  systemContext: G,
  canUseTool: Z,
  toolUseContext: I,
  autoCompactTracking: Y,
  fallbackModel: J,
  stopHookActive: W,
  querySource: X
}) {
  let V = I.options.sdkBetas;
  yield { type: "stream_request_start" };

  let F = I.queryTracking ? {
    chainId: I.queryTracking.chainId,
    depth: I.queryTracking.depth + 1
  } : {
    chainId: dX9(),
    depth: 0
  };

  // ... micro-compact and auto-compact
  let C = nk(A);
  let U = await Si(C, void 0, I);  // Micro-compact
  if (C = U.messages, U.compactionInfo?.systemMessage)
    yield U.compactionInfo.systemMessage;

  let { compactionResult: q } = await sI2(C, I, X);  // Auto-compact
  if (q) {
    // Yield compaction results
    let qA = [q.boundaryMarker, ...q.summaryMessages, ...q.attachments, ...q.hookResults];
    for (let KA of qA) yield KA;
    C = qA;
  }

  // Main streaming loop
  let u = !0;
  while (u) {
    u = !1;
    try {
      for await (let wA of RYA({
        messages: gQA(mA, B),  // Inject system context
        systemPrompt: p,
        tools: I.options.tools,
        signal: I.abortController.signal,
        // ...
      })) {
        if (yield wA, wA.type === "assistant") {
          // Track assistant messages and tool uses
          if (T) {
            let qA = wA.message.content.filter((KA) => KA.type === "tool_use");
            for (let KA of qA) T.addTool(KA, wA);
          }
        }
        // Yield completed tool results
        if (T) {
          for (let qA of T.getCompletedResults())
            if (qA.message) yield qA.message;
        }
      }
    } catch (OA) {
      if (OA instanceof o61 && J) {
        // Model fallback
        x = J;
        u = !0;  // Retry with fallback model
        yield $y(`Model fallback triggered...`, "info");
        continue;
      }
      throw OA;
    }
  }
}

// READABLE (for understanding):
async function* streamingMainLoop({
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
  // Signal stream start
  yield { type: "stream_request_start" };

  // Initialize query tracking for telemetry
  let queryTracking = toolUseContext.queryTracking ? {
    chainId: toolUseContext.queryTracking.chainId,
    depth: toolUseContext.queryTracking.depth + 1
  } : {
    chainId: generateUUID(),
    depth: 0
  };

  // Pre-process messages
  let processedMessages = filterMessages(messages);

  // 1. Micro-compaction (fast, local)
  let microResult = await microCompact(processedMessages, undefined, toolUseContext);
  processedMessages = microResult.messages;
  if (microResult.compactionInfo?.systemMessage) {
    yield microResult.compactionInfo.systemMessage;
  }

  // 2. Auto-compaction (LLM-based if needed)
  let { compactionResult } = await autoCompactDispatcher(processedMessages, toolUseContext, querySource);
  if (compactionResult) {
    // Yield all compaction results
    let compactedMessages = [
      compactionResult.boundaryMarker,
      ...compactionResult.summaryMessages,
      ...compactionResult.attachments,
      ...compactionResult.hookResults
    ];
    for (let msg of compactedMessages) yield msg;
    processedMessages = compactedMessages;
  }

  // 3. Main streaming loop with retry
  let shouldRetry = true;
  while (shouldRetry) {
    shouldRetry = false;
    try {
      // Inject user context as system reminder
      let messagesWithContext = injectSystemContext(processedMessages, userContext);

      // Stream API response
      for await (let event of streamAPICall({
        messages: messagesWithContext,
        systemPrompt,
        tools: toolUseContext.options.tools,
        signal: toolUseContext.abortController.signal,
        // ...
      })) {
        yield event;

        // Track assistant messages for tool execution
        if (event.type === "assistant") {
          let toolUses = event.message.content.filter(b => b.type === "tool_use");
          for (let toolUse of toolUses) {
            toolExecutor.addTool(toolUse, event);
          }
        }

        // Yield completed tool results
        for (let result of toolExecutor.getCompletedResults()) {
          if (result.message) yield result.message;
        }
      }
    } catch (error) {
      if (error instanceof ModelOverloadError && fallbackModel) {
        // Switch to fallback model and retry
        currentModel = fallbackModel;
        shouldRetry = true;
        yield createNotification(`Model fallback triggered...`, "info");
        continue;
      }
      throw error;
    }
  }
}

// Mapping: O$→streamingMainLoop, Si→microCompact, sI2→autoCompactDispatcher,
// RYA→streamAPICall, gQA→injectSystemContext, nk→filterMessages
```

---

## 2. Tool Execution Orchestration

### Concurrency-Safe Tool Grouping

```javascript
// ============================================
// groupToolsByConcurrency - Group tools for parallel/sequential execution
// Location: chunks.146.mjs:2154-2166
// ============================================

// ORIGINAL (for source lookup):
function mk3(A, Q) {
  return A.reduce((B, G) => {
    let Z = Q.options.tools.find((J) => J.name === G.name),
      I = Z?.inputSchema.safeParse(G.input),
      Y = I?.success ? Boolean(Z?.isConcurrencySafe(I.data)) : !1;
    if (Y && B[B.length - 1]?.isConcurrencySafe)
      B[B.length - 1].blocks.push(G);
    else
      B.push({
        isConcurrencySafe: Y,
        blocks: [G]
      });
    return B
  }, [])
}

// READABLE (for understanding):
function groupToolsByConcurrency(toolUseBlocks, context) {
  return toolUseBlocks.reduce((groups, toolUse) => {
    // Find tool definition
    let toolDef = context.options.tools.find(t => t.name === toolUse.name);

    // Validate input and check concurrency safety
    let parseResult = toolDef?.inputSchema.safeParse(toolUse.input);
    let isSafe = parseResult?.success
      ? Boolean(toolDef?.isConcurrencySafe(parseResult.data))
      : false;

    // Group consecutive safe tools together
    if (isSafe && groups[groups.length - 1]?.isConcurrencySafe) {
      groups[groups.length - 1].blocks.push(toolUse);
    } else {
      groups.push({
        isConcurrencySafe: isSafe,
        blocks: [toolUse]
      });
    }

    return groups;
  }, []);
}

// Mapping: mk3→groupToolsByConcurrency
```

**Key insight:** Tools marked as `isConcurrencySafe` can be executed in parallel. Consecutive safe tools are grouped together for batch execution, while unsafe tools run sequentially.

### Parallel Tool Executor

```javascript
// ============================================
// executeToolsConcurrently - Run safe tools in parallel
// Location: chunks.146.mjs:2183-2187
// ============================================

// ORIGINAL (for source lookup):
async function* ck3(A, Q, B, G) {
  yield* SYA(A.map(async function*(Z) {
    G.setInProgressToolUseIDs((I) => new Set([...I, Z.id]));
    yield* OY1(Z, Q.find((I) => I.message.content.some((Y) =>
      Y.type === "tool_use" && Y.id === Z.id)), B, G);
    pX9(G, Z.id)
  }), hk3())
}

// READABLE (for understanding):
async function* executeToolsConcurrently(toolUseBlocks, assistantMessages, permissionContext, context) {
  // SYA is a parallel async generator executor
  yield* parallelAsyncGenerator(
    toolUseBlocks.map(async function*(toolUse) {
      // Mark tool as in-progress
      context.setInProgressToolUseIDs(ids => new Set([...ids, toolUse.id]));

      // Find the assistant message that contained this tool_use
      let sourceMessage = assistantMessages.find(msg =>
        msg.message.content.some(block =>
          block.type === "tool_use" && block.id === toolUse.id
        )
      );

      // Execute tool and yield results
      yield* executeSingleTool(toolUse, sourceMessage, permissionContext, context);

      // Mark tool as completed
      removeInProgressToolUseID(context, toolUse.id);
    }),
    getParallelismLimit()
  );
}

// Mapping: ck3→executeToolsConcurrently, SYA→parallelAsyncGenerator,
// OY1→executeSingleTool, hk3→getParallelismLimit
```

### Sequential Tool Executor

```javascript
// ============================================
// executeToolsSequentially - Run tools one at a time
// Location: chunks.146.mjs:2168-2181
// ============================================

// ORIGINAL (for source lookup):
async function* dk3(A, Q, B, G) {
  let Z = G;
  for (let I of A) {
    G.setInProgressToolUseIDs((Y) => new Set([...Y, I.id]));
    for await (let Y of OY1(I, Q.find((J) =>
      J.message.content.some((W) => W.type === "tool_use" && W.id === I.id)), B, Z)) {
      if (Y.contextModifier) Z = Y.contextModifier.modifyContext(Z);
      yield {
        message: Y.message,
        newContext: Z
      }
    }
    pX9(G, I.id)
  }
}

// READABLE (for understanding):
async function* executeToolsSequentially(toolUseBlocks, assistantMessages, permissionContext, context) {
  let currentContext = context;

  for (let toolUse of toolUseBlocks) {
    // Mark as in-progress
    context.setInProgressToolUseIDs(ids => new Set([...ids, toolUse.id]));

    // Find source message
    let sourceMessage = assistantMessages.find(msg =>
      msg.message.content.some(block =>
        block.type === "tool_use" && block.id === toolUse.id
      )
    );

    // Execute tool
    for await (let result of executeSingleTool(toolUse, sourceMessage, permissionContext, currentContext)) {
      // Apply context modifications
      if (result.contextModifier) {
        currentContext = result.contextModifier.modifyContext(currentContext);
      }
      yield {
        message: result.message,
        newContext: currentContext
      };
    }

    // Mark as completed
    removeInProgressToolUseID(context, toolUse.id);
  }
}

// Mapping: dk3→executeToolsSequentially
```

---

## 3. Single Tool Executor

```javascript
// ============================================
// executeSingleTool - Execute one tool and yield results
// Location: chunks.146.mjs:2193-2250
// ============================================

// READABLE pseudocode:
async function* executeSingleTool(toolUse, sourceMessage, permissionContext, context) {
  let toolName = toolUse.name;
  let toolDef = context.options.tools.find(t => t.name === toolName);
  let messageId = sourceMessage.message.id;

  // Tool not found
  if (!toolDef) {
    trackTelemetry("tengu_tool_use_error", {
      error: `No such tool available: ${toolName}`,
      toolName,
      toolUseID: toolUse.id,
      isMcp: toolName.startsWith("mcp__")
    });

    yield {
      message: createUserMessage({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
          is_error: true,
          tool_use_id: toolUse.id
        }],
        toolUseResult: `Error: No such tool available: ${toolName}`
      })
    };
    return;
  }

  let input = toolUse.input;

  try {
    // Check for abort
    if (context.abortController.signal.aborted) {
      trackTelemetry("tengu_tool_use_cancelled", {
        toolName: toolDef.name,
        toolUseID: toolUse.id,
        isMcp: toolDef.isMcp ?? false
      });

      let cancelledResult = createCancelledToolResult(toolUse.id);
      yield {
        message: createUserMessage({
          content: [cancelledResult],
          toolUseResult: CANCELLED_MESSAGE
        })
      };
      return;
    }

    // Execute tool with permission checking
    for await (let result of executeWithPermissions(toolDef, toolUse.id, input, context, permissionContext, sourceMessage, messageId)) {
      yield result;
    }
  } catch (error) {
    logError(error);
    let errorMessage = error instanceof Error ? error.message : String(error);
    let fullError = `Error calling tool${toolDef ? ` (${toolDef.name})` : ""}: ${errorMessage}`;

    yield {
      message: createUserMessage({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>${fullError}</tool_use_error>`,
          is_error: true,
          tool_use_id: toolUse.id
        }],
        toolUseResult: fullError
      })
    };
  }
}

// Mapping: OY1→executeSingleTool, R0→createUserMessage, jV0→createCancelledToolResult
```

---

## 4. Context Modifier Pattern

The streaming system supports runtime context modification through the `contextModifier` pattern:

```javascript
// ============================================
// orchestrateWithContextModification - Apply context changes during execution
// Location: chunks.146.mjs:2113-2152
// ============================================

// READABLE pseudocode:
async function* orchestrateWithContextModification(toolUseBlocks, assistantMessages, permissionContext, context) {
  let currentContext = context;

  for (let { isConcurrencySafe, blocks } of groupToolsByConcurrency(toolUseBlocks, currentContext)) {
    if (isConcurrencySafe) {
      // Parallel execution - collect context modifiers
      let pendingModifiers = {};

      for await (let result of executeToolsConcurrently(blocks, assistantMessages, permissionContext, currentContext)) {
        if (result.contextModifier) {
          let { toolUseID, modifyContext } = result.contextModifier;
          if (!pendingModifiers[toolUseID]) pendingModifiers[toolUseID] = [];
          pendingModifiers[toolUseID].push(modifyContext);
        }
        yield {
          message: result.message,
          newContext: currentContext
        };
      }

      // Apply all context modifiers after parallel batch completes
      for (let block of blocks) {
        let modifiers = pendingModifiers[block.id];
        if (!modifiers) continue;
        for (let modifier of modifiers) {
          currentContext = modifier(currentContext);  // <-- Apply modification
        }
      }

      yield { newContext: currentContext };

    } else {
      // Sequential execution - apply context modifiers immediately
      for await (let result of executeToolsSequentially(blocks, assistantMessages, permissionContext, currentContext)) {
        if (result.newContext) currentContext = result.newContext;
        yield {
          message: result.message,
          newContext: currentContext
        };
      }
    }
  }
}

// Mapping: VX0→orchestrateWithContextModification
```

**Key insight:** Context modifiers allow tools to modify the execution context (e.g., update `readFileState`). For parallel execution, modifiers are collected and applied after the batch completes to avoid race conditions.

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| streamingMainLoop | O$ | chunks.146.mjs:1716-1860 | Main streaming entry |
| groupToolsByConcurrency | mk3 | chunks.146.mjs:2154-2166 | Group tools for parallel/seq |
| executeToolsConcurrently | ck3 | chunks.146.mjs:2183-2187 | Parallel tool execution |
| executeToolsSequentially | dk3 | chunks.146.mjs:2168-2181 | Sequential tool execution |
| executeSingleTool | OY1 | chunks.146.mjs:2193-2250 | Single tool executor |
| orchestrateWithContextModification | VX0 | chunks.146.mjs:2113-2152 | Context modifier orchestration |

---

## Yield Patterns

The streaming pipeline yields different message types:

| Type | Description |
|------|-------------|
| `stream_request_start` | Signals streaming is starting |
| `assistant` | Assistant response content (may be partial) |
| `user` (tool_result) | Tool execution results |
| `notification` | System notifications (fallback, errors) |
| Compaction messages | Boundary markers, summaries, attachments |
