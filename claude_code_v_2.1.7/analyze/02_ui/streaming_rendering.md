# Streaming UI Rendering

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `mainAgentLoop` (aN) - Main streaming entry point
- `streamAPICall` (oHA) - API streaming with fallback
- `timingBreakdown` (R77) - Performance phase breakdown
- `maxToolConcurrency` (_77) - Concurrency limit configuration

---

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
│  │           Main Agent Loop (aN)                           │  │
│  │  - Handles compaction before streaming                   │  │
│  │  - Yields stream_request_start                           │  │
│  │  - Processes API stream events                           │  │
│  │  - Manages tool execution orchestration                  │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Pre-Processing Pipeline                        │  │
│  │  - Micro-compaction (lc) - fast local                   │  │
│  │  - Auto-compaction (ys2) - LLM-based if needed          │  │
│  │  - Query tracking initialization                         │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           API Stream Processing (oHA)                    │  │
│  │  - Makes streaming API call                              │  │
│  │  - Yields content blocks as they arrive                  │  │
│  │  - Handles model fallback                                │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│           ┌───────────────────┼───────────────────┐            │
│           ▼                                       ▼            │
│  ┌───────────────────────┐          ┌───────────────────────┐  │
│  │ Concurrent Executor   │          │ Sequential Executor   │  │
│  │  - Parallel async     │          │  - One tool at time   │  │
│  │  - For safe tools     │          │  - For stateful ops   │  │
│  └───────────────────────┘          └───────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Tool Result Yielding                           │  │
│  │  - Yields tool_result messages                           │  │
│  │  - Updates context state                                 │  │
│  │  - Handles errors and cancellation                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Main Streaming Entry Point

```javascript
// ============================================
// mainAgentLoop - Main streaming entry point
// Location: chunks.134.mjs:99-250
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
  if (yield {
      type: "stream_request_start"
    }, h6("query_fn_entry"), !Y.agentId) j3A("query_started");
  let H = Y.queryTracking ? {
      chainId: Y.queryTracking.chainId,
      depth: Y.queryTracking.depth + 1
    } : {
      chainId: X19(),
      depth: 0
    },
    E = H.chainId;
  Y = {
    ...Y,
    queryTracking: H
  };
  let z = _x(A),
    $ = J;
  h6("query_microcompact_start");
  let O = await lc(z, void 0, Y);
  if (z = O.messages, O.compactionInfo?.systemMessage) yield O.compactionInfo.systemMessage;
  h6("query_microcompact_end"), h6("query_autocompact_start");
  let {
    compactionResult: L
  } = await ys2(z, Y, D);
  // ... continues with API streaming
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
  querySource,
  maxOutputTokensOverride,
  maxOutputTokensRecoveryCount = 0,
  maxTurns,
  turnCount = 1
}) {
  // Signal stream start
  yield { type: "stream_request_start" };

  // Log timing marker
  recordTiming("query_fn_entry");

  // Track query for telemetry (skip for subagents)
  if (!toolUseContext.agentId) {
    trackQueryStarted("query_started");
  }

  // Initialize or increment query tracking
  const queryTracking = toolUseContext.queryTracking ? {
    chainId: toolUseContext.queryTracking.chainId,
    depth: toolUseContext.queryTracking.depth + 1
  } : {
    chainId: generateUUID(),
    depth: 0
  };

  const chainId = queryTracking.chainId;
  toolUseContext = { ...toolUseContext, queryTracking };

  // Filter messages
  let processedMessages = filterMessages(messages);
  let currentCompactTracking = autoCompactTracking;

  // Phase 1: Micro-compaction (fast, local)
  recordTiming("query_microcompact_start");
  const microResult = await microCompact(processedMessages, undefined, toolUseContext);
  processedMessages = microResult.messages;
  if (microResult.compactionInfo?.systemMessage) {
    yield microResult.compactionInfo.systemMessage;
  }
  recordTiming("query_microcompact_end");

  // Phase 2: Auto-compaction (LLM-based if needed)
  recordTiming("query_autocompact_start");
  const { compactionResult } = await autoCompactDispatcher(
    processedMessages,
    toolUseContext,
    querySource
  );
  recordTiming("query_autocompact_end");

  if (compactionResult) {
    // Log telemetry
    logTelemetry("tengu_auto_compact_succeeded", {
      originalMessageCount: messages.length,
      compactedMessageCount: compactionResult.summaryMessages.length +
                            compactionResult.attachments.length +
                            compactionResult.hookResults.length,
      preCompactTokenCount: compactionResult.preCompactTokenCount,
      postCompactTokenCount: compactionResult.postCompactTokenCount,
      // ... usage metrics
    });

    // Update tracking
    if (!currentCompactTracking?.compacted) {
      currentCompactTracking = {
        compacted: true,
        turnId: generateUUID(),
        turnCounter: 0
      };
    }

    // Yield all compaction results
    const compactedMessages = formatCompactionResults(compactionResult);
    for (const msg of compactedMessages) {
      yield msg;
    }
    processedMessages = compactedMessages;
  }

  // Update context with processed messages
  toolUseContext = { ...toolUseContext, messages: processedMessages };

  // Phase 3: Setup and API call
  recordTiming("query_setup_start");

  // Initialize streaming tool executor if feature flag enabled
  const toolExecutor = isFeatureEnabled("tengu_streaming_tool_execution2")
    ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
    : null;

  // Get current app state for permission mode
  const appState = await toolUseContext.getAppState();
  const permissionMode = appState.toolPermissionContext.mode;

  // Select model based on mode and token count
  const model = selectModelForQuery({
    permissionMode,
    mainLoopModel: toolUseContext.options.mainLoopModel,
    exceeds200kTokens: permissionMode === "plan" && exceedsTokenThreshold(processedMessages)
  });

  // Build final system prompt
  const finalSystemPrompt = combineSystemPrompts(systemPrompt, systemContext);
  recordTiming("query_setup_end");

  // Check for blocking token limit
  const { isAtBlockingLimit } = checkTokenLimit(countTokens(processedMessages));
  if (isAtBlockingLimit) {
    yield createNotification({
      content: TOKEN_LIMIT_ERROR,
      error: "invalid_request"
    });
    return;
  }

  // Phase 4: Main API streaming loop with retry
  let shouldRetry = true;
  recordTiming("query_api_loop_start");

  while (shouldRetry) {
    shouldRetry = false;

    try {
      let streamingFallbackTriggered = false;
      recordTiming("query_api_streaming_start");

      // Stream from API
      for await (const event of streamAPICall({
        messages: injectSystemContext(processedMessages, userContext),
        systemPrompt: finalSystemPrompt,
        maxThinkingTokens: toolUseContext.options.maxThinkingTokens,
        tools: toolUseContext.options.tools,
        signal: toolUseContext.abortController.signal,
        options: {
          model,
          fallbackModel,
          onStreamingFallback: () => { streamingFallbackTriggered = true; },
          querySource,
          // ... other options
        }
      })) {
        // Handle streaming fallback (retry with different model)
        if (streamingFallbackTriggered) {
          // Tombstone orphaned messages
          for (const msg of assistantMessages) {
            yield { type: "tombstone", message: msg };
          }
          // Reset state
          assistantMessages.length = 0;
          toolResults.length = 0;
          if (toolExecutor) {
            toolExecutor.discard();
            toolExecutor = new StreamingToolExecutor(...);
          }
        }

        // Yield event to UI
        yield event;

        // Track assistant messages and tool uses
        if (event.type === "assistant") {
          assistantMessages.push(event);
          if (toolExecutor) {
            const toolUses = event.message.content.filter(b => b.type === "tool_use");
            for (const toolUse of toolUses) {
              toolExecutor.addTool(toolUse, event);
            }
          }
        }

        // Yield completed tool results
        if (toolExecutor) {
          for (const result of toolExecutor.getCompletedResults()) {
            if (result.message) {
              yield result.message;
              toolResults.push(...normalizeToolResults([result.message]));
            }
          }
        }
      }
    } catch (error) {
      // Handle errors and retries
      // ...
    }
  }
}

// Mapping: aN→mainAgentLoop, lc→microCompact, ys2→autoCompactDispatcher,
//          oHA→streamAPICall, _x→filterMessages, h6→recordTiming,
//          X19→generateUUID, _H1→StreamingToolExecutor
```

**What it does:** Orchestrates the complete streaming query lifecycle from message preparation through API streaming to tool execution.

**How it works:**
1. **Signal start** - Yields `stream_request_start` event
2. **Initialize tracking** - Sets up query chain ID and depth for telemetry
3. **Pre-process** - Runs micro-compaction (local) then auto-compaction (LLM)
4. **Setup** - Selects model, builds system prompt, initializes tool executor
5. **Stream** - Iterates over API stream, yielding events and tracking tool uses
6. **Execute tools** - Runs tools via streaming executor, yields results
7. **Handle errors** - Retries on model overload, surfaces errors to UI

**Why this approach:**
- Async generators enable true streaming (no buffering full response)
- Query tracking enables telemetry correlation across turns
- Two-phase compaction balances speed (micro) with quality (auto)
- Streaming tool executor enables parallel tool execution during response

**Key insight:** The `onStreamingFallback` callback handles mid-stream model fallback by tombstoning orphaned messages and resetting state.

---

## 2. Pre-Processing Pipeline

### 2.1 Micro-compaction

```javascript
// Called before auto-compaction
recordTiming("query_microcompact_start");
const microResult = await microCompact(processedMessages, undefined, toolUseContext);
processedMessages = microResult.messages;
if (microResult.compactionInfo?.systemMessage) {
  yield microResult.compactionInfo.systemMessage;
}
recordTiming("query_microcompact_end");
```

**What it does:** Fast local compaction that doesn't require LLM calls.

**Operations performed:**
- Removes redundant tool results
- Collapses sequential same-type messages
- Truncates overly long content

### 2.2 Auto-compaction

```javascript
// Called after micro-compaction
recordTiming("query_autocompact_start");
const { compactionResult } = await autoCompactDispatcher(
  processedMessages,
  toolUseContext,
  querySource
);
recordTiming("query_autocompact_end");
```

**What it does:** LLM-based summarization when context is approaching limit.

**Trigger conditions:**
- Token count exceeds threshold (typically 80% of context window)
- Explicit compaction request

**Output structure:**
```javascript
compactionResult = {
  boundaryMarker,      // Marker message for compact boundary
  summaryMessages,     // LLM-generated summary
  attachments,         // Re-injected attachments
  hookResults,         // Hook-generated content
  preCompactTokenCount,
  postCompactTokenCount,
  compactionUsage      // API token usage for compaction
}
```

### 2.3 Query Tracking Chain

```javascript
// Initialize or increment query tracking
const queryTracking = toolUseContext.queryTracking ? {
  chainId: toolUseContext.queryTracking.chainId,
  depth: toolUseContext.queryTracking.depth + 1
} : {
  chainId: generateUUID(),
  depth: 0
};
```

**Purpose:**
- `chainId` - Unique ID for the query chain (correlates related queries)
- `depth` - How many recursive queries deep (0 = initial, 1+ = tool-triggered)

---

## 3. Tool Execution Orchestration

### 3.1 Concurrency Control

```javascript
// ============================================
// maxToolConcurrency - Get concurrency limit
// Location: chunks.134.mjs:79-80
// ============================================

// ORIGINAL (for source lookup):
function _77() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}

// READABLE (for understanding):
function maxToolConcurrency() {
  // Parse from environment variable, default to 10
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10;
}

// Mapping: _77→maxToolConcurrency
```

**Configuration:** Set `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` environment variable to control max parallel tool executions.

### 3.2 Streaming Tool Executor

The streaming tool executor enables parallel tool execution during API response streaming:

```javascript
// Initialize if feature flag enabled
const toolExecutor = isFeatureEnabled("tengu_streaming_tool_execution2")
  ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
  : null;

// During streaming
if (event.type === "assistant") {
  assistantMessages.push(event);
  if (toolExecutor) {
    // Extract tool uses from assistant message
    const toolUses = event.message.content.filter(b => b.type === "tool_use");
    for (const toolUse of toolUses) {
      // Queue tool for execution
      toolExecutor.addTool(toolUse, event);
    }
  }
}

// Yield completed results
if (toolExecutor) {
  for (const result of toolExecutor.getCompletedResults()) {
    if (result.message) {
      yield result.message;
    }
  }
}
```

**Benefits:**
- Tools start executing as soon as they appear in stream
- Multiple tools can run in parallel
- Results yielded immediately when ready

---

## 4. Stream Event Types

The streaming pipeline yields different message types:

| Type | Description | When Yielded |
|------|-------------|--------------|
| `stream_request_start` | Signals streaming is starting | Start of mainAgentLoop |
| `assistant` | Assistant response content (may be partial) | During API streaming |
| `user` (tool_result) | Tool execution results | After tool completes |
| `tombstone` | Marks orphaned message for removal | On streaming fallback |
| `notification` | System notifications (fallback, errors) | On errors/warnings |
| Compaction messages | Boundary markers, summaries, attachments | After auto-compaction |

### 4.1 Assistant Message Structure

```javascript
{
  type: "assistant",
  message: {
    id: "msg_xxx",
    type: "message",
    role: "assistant",
    content: [
      { type: "text", text: "..." },
      { type: "tool_use", id: "tu_xxx", name: "Bash", input: {...} }
    ]
  },
  uuid: "uuid-xxx",
  timestamp: "2024-..."
}
```

### 4.2 Tool Result Message Structure

```javascript
{
  type: "user",
  message: {
    type: "message",
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "tu_xxx",
        content: "...",
        is_error: false
      }
    ],
    toolUseResult: "...",
    sourceToolAssistantUUID: "uuid-xxx"
  }
}
```

---

## 5. Timing & Performance Tracking

### 5.1 Phase Breakdown

```javascript
// ============================================
// timingBreakdown - Format timing breakdown for debugging
// Location: chunks.134.mjs:3-57
// ============================================

// ORIGINAL (for source lookup):
function R77(A, Q) {
  let B = [{
      name: "Context loading",
      start: "query_context_loading_start",
      end: "query_context_loading_end"
    }, {
      name: "Microcompact",
      start: "query_microcompact_start",
      end: "query_microcompact_end"
    }, {
      name: "Autocompact",
      start: "query_autocompact_start",
      end: "query_autocompact_end"
    }, {
      name: "Query setup",
      start: "query_setup_start",
      end: "query_setup_end"
    }, {
      name: "Tool schemas",
      start: "query_tool_schema_build_start",
      end: "query_tool_schema_build_end"
    }, {
      name: "Message normalization",
      start: "query_message_normalization_start",
      end: "query_message_normalization_end"
    }, {
      name: "Client creation",
      start: "query_client_creation_start",
      end: "query_client_creation_end"
    }, {
      name: "Network TTFB",
      start: "query_api_request_sent",
      end: "query_first_chunk_received"
    }, {
      name: "Tool execution",
      start: "query_tool_execution_start",
      end: "query_tool_execution_end"
    }],
    G = new Map(A.map((J) => [J.name, J.startTime - Q])),
    Z = [];
  Z.push(""), Z.push("PHASE BREAKDOWN:");
  for (let J of B) {
    let X = G.get(J.start),
      I = G.get(J.end);
    if (X !== void 0 && I !== void 0) {
      let D = I - X,
        W = "█".repeat(Math.min(Math.ceil(D / 10), 50));
      Z.push(`  ${J.name.padEnd(22)} ${formatNumber(D).padStart(10)}ms ${W}`)
    }
  }
  let Y = G.get("query_api_request_sent");
  if (Y !== void 0) Z.push(""), Z.push(`  ${"Total pre-API overhead".padEnd(22)} ${formatNumber(Y).padStart(10)}ms`);
  return Z.join(`\n`)
}

// READABLE (for understanding):
function timingBreakdown(timingMarks, startTime) {
  const phases = [
    { name: "Context loading", start: "query_context_loading_start", end: "query_context_loading_end" },
    { name: "Microcompact", start: "query_microcompact_start", end: "query_microcompact_end" },
    { name: "Autocompact", start: "query_autocompact_start", end: "query_autocompact_end" },
    { name: "Query setup", start: "query_setup_start", end: "query_setup_end" },
    { name: "Tool schemas", start: "query_tool_schema_build_start", end: "query_tool_schema_build_end" },
    { name: "Message normalization", start: "query_message_normalization_start", end: "query_message_normalization_end" },
    { name: "Client creation", start: "query_client_creation_start", end: "query_client_creation_end" },
    { name: "Network TTFB", start: "query_api_request_sent", end: "query_first_chunk_received" },
    { name: "Tool execution", start: "query_tool_execution_start", end: "query_tool_execution_end" }
  ];

  // Convert timing marks to relative timestamps
  const timings = new Map(timingMarks.map(mark => [mark.name, mark.startTime - startTime]));

  const lines = ["", "PHASE BREAKDOWN:"];

  for (const phase of phases) {
    const start = timings.get(phase.start);
    const end = timings.get(phase.end);

    if (start !== undefined && end !== undefined) {
      const duration = end - start;
      // Visual bar: each █ = 10ms, max 50 blocks
      const bar = "█".repeat(Math.min(Math.ceil(duration / 10), 50));
      lines.push(`  ${phase.name.padEnd(22)} ${formatNumber(duration).padStart(10)}ms ${bar}`);
    }
  }

  // Total pre-API overhead
  const apiSent = timings.get("query_api_request_sent");
  if (apiSent !== undefined) {
    lines.push("");
    lines.push(`  ${"Total pre-API overhead".padEnd(22)} ${formatNumber(apiSent).padStart(10)}ms`);
  }

  return lines.join("\n");
}

// Mapping: R77→timingBreakdown, Ge→formatNumber
```

### 5.2 Tracked Phases

| Phase | Description | Typical Duration |
|-------|-------------|------------------|
| Context loading | Load app state, permissions | ~50-100ms |
| Microcompact | Fast local compaction | ~10-50ms |
| Autocompact | LLM-based compaction | 0 or 500-2000ms |
| Query setup | Model selection, prompt building | ~20-50ms |
| Tool schemas | Build JSON schemas for tools | ~10-30ms |
| Message normalization | Convert messages to API format | ~10-50ms |
| Client creation | Initialize API client | ~10-20ms |
| Network TTFB | Time to first byte from API | ~200-2000ms |
| Tool execution | Execute requested tools | Varies |

### 5.3 Example Output

```
PHASE BREAKDOWN:
  Context loading               45ms ████
  Microcompact                  12ms █
  Autocompact                    0ms
  Query setup                   28ms ██
  Tool schemas                  15ms █
  Message normalization         22ms ██
  Client creation               18ms █
  Network TTFB                 847ms █████████████████████████████████████████████████
  Tool execution              1234ms ██████████████████████████████████████████████████

  Total pre-API overhead       140ms
```

---

## 6. Error Handling & Recovery

### 6.1 Model Overload Fallback

```javascript
try {
  for await (const event of streamAPICall({...})) {
    // ... process events
  }
} catch (error) {
  if (error instanceof ModelOverloadError && fallbackModel) {
    // Switch to fallback model and retry
    currentModel = fallbackModel;
    shouldRetry = true;
    yield createNotification("Model fallback triggered...", "info");
    continue;
  }
  throw error;
}
```

### 6.2 Abort Signal Handling

```javascript
// Abort controller passed to all async operations
signal: toolUseContext.abortController.signal

// Tool execution checks abort before starting
if (context.abortController.signal.aborted) {
  yield {
    message: createCancelledToolResult(toolUse.id)
  };
  return;
}
```

### 6.3 Orphaned Message Cleanup

When streaming fallback triggers, orphaned messages are tombstoned:

```javascript
if (streamingFallbackTriggered) {
  // Mark orphaned messages for removal
  for (const msg of assistantMessages) {
    yield { type: "tombstone", message: msg };
  }

  logTelemetry("tengu_orphaned_messages_tombstoned", {
    orphanedMessageCount: assistantMessages.length,
    queryChainId: chainId,
    queryDepth: queryTracking.depth
  });

  // Reset state for retry
  assistantMessages.length = 0;
  toolResults.length = 0;
  if (toolExecutor) {
    toolExecutor.discard();
  }
}
```

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| mainAgentLoop | aN | chunks.134.mjs:99-250 | Main streaming entry |
| maxToolConcurrency | _77 | chunks.134.mjs:79-80 | Get concurrency limit |
| timingBreakdown | R77 | chunks.134.mjs:3-57 | Format timing report |
| microCompact | lc | chunks.107.mjs | Fast local compaction |
| autoCompactDispatcher | ys2 | chunks.107.mjs | LLM-based compaction |
| streamAPICall | oHA | chunks.147.mjs | API streaming with fallback |
| filterMessages | _x | chunks.147.mjs | Pre-process messages |
| recordTiming | h6 | chunks.134.mjs | Record timing marker |
| generateUUID | X19 | utils | Generate unique ID |
| StreamingToolExecutor | _H1 | chunks.134.mjs | Parallel tool execution |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` | 10 | Max parallel tool executions |
| `DISABLE_COMPACT` | false | Disable auto-compaction |

---

## Performance Optimization Tips

1. **Tool concurrency** - Increase `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` for I/O-bound tools
2. **Micro-compaction** - Happens every request, keep messages clean
3. **Auto-compaction** - Triggers at 80% context, monitor with telemetry
4. **Network TTFB** - Often the bottleneck, use regional API endpoints
5. **Tool execution** - Mark tools as `isConcurrencySafe` when possible
