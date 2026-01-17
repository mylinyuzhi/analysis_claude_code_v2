# Stream Response Aggregation (Claude Code 2.1.7)

## Table of Contents

1. [Overview](#overview)
2. [SSE Event Types](#sse-event-types)
3. [Aggregation State Machine](#aggregation-state-machine)
4. [Content Block Accumulation](#content-block-accumulation)
5. [Message Yield Strategy](#message-yield-strategy)
6. [Stall Detection](#stall-detection)
7. [Error Handling](#error-handling)
8. [Complete Implementation](#complete-implementation)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols

Key functions in this document:
- `BJ9` (queryWithStreaming) - Main streaming query generator
- `v51` (createStreamingClientWithRetry) - Streaming client factory
- `dhA` (updateUsage) - Accumulate usage statistics
- `JP0` (processContent) - Process content blocks
- `eY9` (generateMessageUUID) - Generate message UUID

---

## Overview

Claude Code processes streaming API responses using an **incremental aggregation** approach:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Stream Processing Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

                          Anthropic API
                               │
                               │ SSE Stream
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Stream Event Handler                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  State Variables:                                                      │ │
│  │  - contentBlocks[]     → Accumulates content by index                 │ │
│  │  - partialMessage      → Stores message metadata                      │ │
│  │  - usage              → Accumulates token counts                      │ │
│  │  - lastEventTime      → For stall detection                           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Event Processing Loop:                                                │ │
│  │  for await (event of stream) {                                        │ │
│  │    switch (event.type) {                                              │ │
│  │      message_start    → Store metadata                                │ │
│  │      content_block_start → Initialize block                           │ │
│  │      content_block_delta → Accumulate content                         │ │
│  │      content_block_stop  → Yield complete message                     │ │
│  │      message_delta    → Update usage/stop_reason                      │ │
│  │      message_stop     → Finalize                                      │ │
│  │    }                                                                  │ │
│  │    yield { type: "stream_event", event }  // Raw event                │ │
│  │  }                                                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               │ Yields
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Output Types:                                                               │
│  1. { type: "assistant", message: {...} }  → Complete content block         │
│  2. { type: "stream_event", event }        → Raw SSE event for UI           │
│  3. { type: "api_error", ... }             → Error messages                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SSE Event Types

### Event Type Reference

| Event Type | Payload | When Fired |
|------------|---------|------------|
| `message_start` | `{ message: { id, model, usage, ... } }` | Stream begins |
| `content_block_start` | `{ index, content_block: { type, ... } }` | New block starts |
| `content_block_delta` | `{ index, delta: { type, ... } }` | Incremental content |
| `content_block_stop` | `{ index }` | Block complete |
| `message_delta` | `{ delta: { stop_reason }, usage }` | Message ending |
| `message_stop` | `{}` | Stream complete |

### Delta Types

| Delta Type | Content Block Type | Payload |
|------------|-------------------|---------|
| `text_delta` | `text` | `{ text: "..." }` |
| `input_json_delta` | `tool_use` / `server_tool_use` | `{ partial_json: "..." }` |
| `thinking_delta` | `thinking` | `{ thinking: "..." }` |
| `signature_delta` | `thinking` | `{ signature: "..." }` |
| `citations_delta` | any | Citations metadata |

---

## Aggregation State Machine

### State Variables

```javascript
// ============================================
// Stream aggregation state
// Location: chunks.147.mjs:140-160
// ============================================

// READABLE (for understanding):
let contentBlocks = [];        // n - Array indexed by content block index
let partialMessage = null;     // AA - Message metadata from message_start
let usage = {                  // y - Accumulated token usage
  input_tokens: 0,
  output_tokens: 0,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0
};
let stopReason = null;         // GA - Final stop reason
let yieldedMessages = [];      // u - Messages already yielded

// Timing state
let isFirstChunk = true;       // IA - Track first chunk for TTFB
let lastEventTime = null;      // HA - For stall detection
let stallThreshold = 30000;    // ZA - 30 seconds
let stallCount = 0;            // wA - Number of stalls
let totalStallTime = 0;        // zA - Total stall duration
```

### State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      State Transition Diagram                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   INITIAL STATE  │
                    │ contentBlocks=[] │
                    │ partialMessage=∅ │
                    └────────┬─────────┘
                             │
                             │ message_start
                             ▼
                    ┌──────────────────┐
                    │ MESSAGE_STARTED  │
                    │ partialMessage=✓ │
                    │ usage updated    │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        │ content_block_start│                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐    ┌───────────────┐
│ BLOCK[0] INIT │  │ BLOCK[1] INIT │    │ BLOCK[n] INIT │
│ type="text"   │  │ type="tool_use"│   │ type="..."    │
│ text=""       │  │ input=""       │   │               │
└───────┬───────┘  └───────┬───────┘    └───────┬───────┘
        │                  │                    │
        │ content_block_delta (multiple)        │
        ▼                  ▼                    ▼
┌───────────────┐  ┌───────────────┐    ┌───────────────┐
│ ACCUMULATING  │  │ ACCUMULATING  │    │ ACCUMULATING  │
│ text+="..."   │  │ input+="..."  │    │ ...+="..."    │
└───────┬───────┘  └───────┬───────┘    └───────┬───────┘
        │                  │                    │
        │ content_block_stop                    │
        ▼                  ▼                    ▼
┌───────────────┐  ┌───────────────┐    ┌───────────────┐
│ BLOCK COMPLETE│  │ BLOCK COMPLETE│    │ BLOCK COMPLETE│
│ → YIELD MSG   │  │ → YIELD MSG   │    │ → YIELD MSG   │
└───────────────┘  └───────────────┘    └───────────────┘
                             │
                             │ message_delta
                             ▼
                    ┌──────────────────┐
                    │ MESSAGE_ENDING   │
                    │ stopReason set   │
                    │ final usage      │
                    └────────┬─────────┘
                             │
                             │ message_stop
                             ▼
                    ┌──────────────────┐
                    │    COMPLETE      │
                    └──────────────────┘
```

---

## Content Block Accumulation

### Initialization (content_block_start)

```javascript
// ============================================
// Content block initialization
// Location: chunks.147.mjs:186-217
// ============================================

// ORIGINAL (for source lookup):
case "content_block_start":
  switch (s.content_block.type) {
    case "tool_use":
      n[s.index] = {
        ...s.content_block,
        input: ""             // Initialize empty string for JSON accumulation
      };
      break;
    case "server_tool_use":
      n[s.index] = {
        ...s.content_block,
        input: ""
      };
      break;
    case "text":
      n[s.index] = {
        ...s.content_block,
        text: ""              // Initialize empty string for text accumulation
      };
      break;
    case "thinking":
      n[s.index] = {
        ...s.content_block,
        thinking: ""          // Initialize empty string for thinking accumulation
      };
      break;
    default:
      n[s.index] = {
        ...s.content_block    // Unknown types: copy as-is
      };
      break
  }
  break;

// READABLE (for understanding):
case "content_block_start":
  switch (event.content_block.type) {
    case "tool_use":
    case "server_tool_use":
      contentBlocks[event.index] = {
        ...event.content_block,
        input: ""  // Will accumulate partial_json
      };
      break;
    case "text":
      contentBlocks[event.index] = {
        type: "text",
        text: ""   // Will accumulate text_delta
      };
      break;
    case "thinking":
      contentBlocks[event.index] = {
        type: "thinking",
        thinking: ""  // Will accumulate thinking_delta
      };
      break;
    default:
      contentBlocks[event.index] = { ...event.content_block };
  }
  break;
```

### Accumulation (content_block_delta)

```javascript
// ============================================
// Content block delta accumulation
// Location: chunks.147.mjs:219-265
// ============================================

// ORIGINAL (for source lookup):
case "content_block_delta": {
  let BA = n[s.index];
  if (!BA) throw RangeError("Content block not found");

  switch (s.delta.type) {
    case "citations_delta":
      break;  // Ignored for now

    case "input_json_delta":
      if (BA.type !== "tool_use" && BA.type !== "server_tool_use")
        throw Error("Content block is not a tool_use block");
      if (typeof BA.input !== "string")
        throw Error("Content block input is not a string");
      BA.input += s.delta.partial_json;  // Accumulate JSON string
      break;

    case "text_delta":
      if (BA.type !== "text")
        throw Error("Content block is not a text block");
      BA.text += s.delta.text;           // Accumulate text
      break;

    case "signature_delta":
      if (BA.type !== "thinking")
        throw Error("Content block is not a thinking block");
      BA.signature = s.delta.signature;   // Set signature (not accumulated)
      break;

    case "thinking_delta":
      if (BA.type !== "thinking")
        throw Error("Content block is not a thinking block");
      BA.thinking += s.delta.thinking;    // Accumulate thinking
      break
  }
  break
}

// READABLE (for understanding):
case "content_block_delta": {
  let block = contentBlocks[event.index];
  if (!block) throw RangeError("Content block not found");

  switch (event.delta.type) {
    case "input_json_delta":
      // Tool use: accumulate JSON string
      block.input += event.delta.partial_json;
      break;

    case "text_delta":
      // Text: accumulate text content
      block.text += event.delta.text;
      break;

    case "thinking_delta":
      // Thinking: accumulate thinking content
      block.thinking += event.delta.thinking;
      break;

    case "signature_delta":
      // Thinking signature: set (not accumulate)
      block.signature = event.delta.signature;
      break;
  }
  break;
}
```

### JSON Parsing (on content_block_stop)

```javascript
// ============================================
// JSON input parsing for tool_use blocks
// Location: chunks.147.mjs (JP0 function)
// ============================================

// READABLE (for understanding):
function processContent(contentBlocks) {
  return contentBlocks.map(block => {
    if (block.type === "tool_use" || block.type === "server_tool_use") {
      if (typeof block.input === "string") {
        try {
          // Parse accumulated JSON string
          block.input = JSON.parse(block.input);
        } catch (e) {
          // Keep as string if parse fails (malformed JSON)
          console.warn("Failed to parse tool input JSON:", e);
        }
      }
    }
    return block;
  });
}
```

---

## Message Yield Strategy

### Per-Block Yielding

**Key Design Decision**: Messages are yielded on `content_block_stop`, not `message_stop`.

```javascript
// ============================================
// Message yield on content_block_stop
// Location: chunks.147.mjs:268-291
// ============================================

// ORIGINAL (for source lookup):
case "content_block_stop": {
  let BA = n[s.index];
  if (!BA) throw RangeError("Content block not found");
  if (!AA) throw Error("Message not found");

  let DA = {
    message: {
      ...AA,                                    // Copy message metadata
      content: JP0([BA], G, Y.agentId)         // Process single block
    },
    requestId: b.request_id ?? void 0,
    type: "assistant",
    uuid: eY9(),
    timestamp: new Date().toISOString(),
    ...{}
  };
  u.push(DA);
  yield DA;                                     // Yield immediately
  break
}

// READABLE (for understanding):
case "content_block_stop": {
  let block = contentBlocks[event.index];
  if (!block) throw RangeError("Content block not found");
  if (!partialMessage) throw Error("Message metadata not found");

  // Create complete message for this content block
  let completeMessage = {
    type: "assistant",
    uuid: generateMessageUUID(),
    timestamp: new Date().toISOString(),
    requestId: stream.request_id ?? undefined,
    message: {
      ...partialMessage,                       // id, model, role, etc.
      content: processContent([block])         // Single processed block
    }
  };

  yieldedMessages.push(completeMessage);
  yield completeMessage;                       // Yield to consumer immediately
  break;
}
```

### Why Per-Block Yielding?

| Benefit | Explanation |
|---------|-------------|
| **Lower Latency** | Tool use blocks can be executed as soon as they're complete |
| **Progressive UI** | UI can update as each block finishes |
| **Memory Efficiency** | Don't need to buffer entire response |
| **Parallel Processing** | Multiple tool calls can start executing |

### Dual Output Pattern

```javascript
// Each event produces TWO yields:

// 1. On content_block_stop → Complete message
yield {
  type: "assistant",
  message: { ... },
  uuid: "..."
};

// 2. Always → Raw stream event (for UI real-time updates)
yield {
  type: "stream_event",
  event: originalSSEEvent
};
```

---

## Stall Detection

### Stall Monitoring

```javascript
// ============================================
// Streaming stall detection
// Location: chunks.147.mjs:162-176
// ============================================

// ORIGINAL (for source lookup):
let IA = !0,
  HA = null,
  ZA = 30000,  // 30 second threshold
  zA = 0,
  wA = 0;

for await (let s of b) {
  let t = Date.now();
  if (HA !== null) {
    let BA = t - HA;
    if (BA > ZA) {
      wA++;
      zA += BA;
      k(`Streaming stall detected: ${(BA/1000).toFixed(1)}s gap`, { level: "warn" });
      l("tengu_streaming_stall", {
        stall_duration_ms: BA,
        stall_count: wA,
        total_stall_time_ms: zA,
        event_type: s.type,
        model: Y.model,
        request_id: b.request_id ?? "unknown"
      })
    }
  }
  HA = t;
  // ... process event
}

// READABLE (for understanding):
let isFirstChunk = true;
let lastEventTime = null;
let stallThreshold = 30000;  // 30 seconds
let totalStallTime = 0;
let stallCount = 0;

for await (let event of stream) {
  let now = Date.now();

  // Check for stall (gap > 30s between events)
  if (lastEventTime !== null) {
    let gap = now - lastEventTime;
    if (gap > stallThreshold) {
      stallCount++;
      totalStallTime += gap;
      logWarning(`Streaming stall: ${(gap/1000).toFixed(1)}s gap`);
      analyticsEvent("tengu_streaming_stall", {
        stall_duration_ms: gap,
        stall_count: stallCount,
        total_stall_time_ms: totalStallTime,
        event_type: event.type,
        model: options.model,
        request_id: stream.request_id
      });
    }
  }

  lastEventTime = now;
  // ... process event
}
```

### Stall Summary

```javascript
// ============================================
// Stall summary after stream complete
// Location: chunks.147.mjs:321-330
// ============================================

// READABLE (for understanding):
if (stallCount > 0) {
  logWarning(`Streaming completed with ${stallCount} stall(s), ` +
             `total stall time: ${(totalStallTime/1000).toFixed(1)}s`);
  analyticsEvent("tengu_streaming_stall_summary", {
    stall_count: stallCount,
    total_stall_time_ms: totalStallTime,
    model: options.model
  });
}
```

---

## Error Handling

### Max Tokens Error

```javascript
// ============================================
// Max tokens reached handling
// Location: chunks.147.mjs:299-304
// ============================================

// READABLE (for understanding):
if (stopReason === "max_tokens") {
  analyticsEvent("tengu_max_tokens_reached", { max_tokens: maxOutputTokens });
  yield createErrorMessage({
    content: `Claude's response exceeded the ${maxOutputTokens} output token maximum. ` +
             `To configure this behavior, set CLAUDE_CODE_MAX_OUTPUT_TOKENS.`,
    apiError: "max_output_tokens"
  });
}
```

### Context Window Exceeded

```javascript
// ============================================
// Context window exceeded handling
// Location: chunks.147.mjs:305-310
// ============================================

// READABLE (for understanding):
if (stopReason === "model_context_window_exceeded") {
  analyticsEvent("tengu_context_window_exceeded", {
    max_tokens: maxOutputTokens,
    output_tokens: usage.output_tokens
  });
  yield createErrorMessage({
    content: "The model has reached its context window limit."
  });
}
```

### Stream Error Recovery

```javascript
// ============================================
// Stream error handling
// Location: chunks.147.mjs (try-catch wrapper)
// ============================================

// READABLE (for understanding):
try {
  for await (let event of stream) {
    // Process events...
  }
} catch (error) {
  // Log error
  logError(error);

  // Yield error message
  yield createErrorMessage({
    content: `Streaming error: ${error.message}`,
    apiError: "streaming_error",
    error: error
  });

  // Analytics
  analyticsEvent("tengu_streaming_error", {
    error_type: error.name,
    error_message: error.message
  });
}
```

---

## Complete Implementation

### Full Stream Processing Function

```javascript
// ============================================
// queryWithStreaming - Complete implementation
// Location: chunks.147.mjs:3-350
// ============================================

// READABLE (for understanding):
async function* queryWithStreaming(
  messages,
  systemPrompts,
  thinkingBudget,
  tools,
  abortSignal,
  options
) {
  // === SETUP ===
  let contentBlocks = [];
  let partialMessage = null;
  let usage = { input_tokens: 0, output_tokens: 0, ... };
  let stopReason = null;
  let yieldedMessages = [];

  // Timing
  let isFirstChunk = true;
  let lastEventTime = null;
  let stallCount = 0;
  let totalStallTime = 0;
  const STALL_THRESHOLD = 30000;

  // === CREATE CLIENT ===
  let stream = await createStreamingClientWithRetry(
    () => createApiClient({ maxRetries: 0, model: options.model }),
    async (client, retryCount) => {
      let params = buildRequestParams();
      return client.beta.messages.stream(params, { signal: abortSignal });
    },
    { model: options.model, fallbackModel: options.fallbackModel }
  );

  // === PROCESS STREAM ===
  try {
    for await (let event of stream) {
      let now = Date.now();

      // Stall detection
      if (lastEventTime !== null && now - lastEventTime > STALL_THRESHOLD) {
        stallCount++;
        totalStallTime += now - lastEventTime;
        // Log and analytics...
      }
      lastEventTime = now;

      // First chunk timing
      if (isFirstChunk) {
        recordTiming("first_chunk");
        isFirstChunk = false;
      }

      // Event processing
      switch (event.type) {
        case "message_start":
          partialMessage = event.message;
          usage = updateUsage(usage, event.message.usage);
          break;

        case "content_block_start":
          contentBlocks[event.index] = initializeBlock(event.content_block);
          break;

        case "content_block_delta":
          accumulateDelta(contentBlocks[event.index], event.delta);
          break;

        case "content_block_stop":
          let message = createCompleteMessage(
            partialMessage,
            contentBlocks[event.index],
            stream.request_id
          );
          yieldedMessages.push(message);
          yield message;  // Yield complete message
          break;

        case "message_delta":
          usage = updateUsage(usage, event.usage);
          stopReason = event.delta.stop_reason;
          handleStopReason(stopReason);
          break;

        case "message_stop":
          // Stream complete
          break;
      }

      // Always yield raw event for UI
      yield { type: "stream_event", event: event };
    }
  } catch (error) {
    yield createErrorMessage({ content: error.message, error });
  }

  // === SUMMARY ===
  if (stallCount > 0) {
    logStallSummary(stallCount, totalStallTime);
  }

  // Return final usage for cost calculation
  return { usage, stopReason, messagesYielded: yieldedMessages.length };
}
```

---

## Related Documents

- [response_abstraction.md](./response_abstraction.md) - Message type definitions
- [api_calling.md](./api_calling.md) - API call mechanism
- [agent_loop.md](./agent_loop.md) - How aggregated messages are used
- [../24_auth/model_switching.md](../24_auth/model_switching.md) - Streaming support per provider
