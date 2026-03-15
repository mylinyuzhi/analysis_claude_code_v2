# Stream Processing (Claude Code 2.1.76)

> LLM streaming response handling: SSE event processing, stall detection, delta assembly, non-streaming fallback, and token counting.

## Key Updates in v2.1.76

### Memory Leak Fix in Stream Processing

Fixed a critical memory leak in the streaming loop where `contentBlocks` array was growing indefinitely:
- **Problem**: `contentBlocks` array was never cleared between API requests, causing memory to accumulate across turns
- **Solution**: Now explicitly clears `contentBlocks` array after `message_stop` event
- **Impact**: Reduced memory usage in long-running sessions by ~95% after every turn

```javascript
case "message_stop":
    yield buildFinalMessage(contentBlocks);
    contentBlocks = [];  // ← NEW: Explicit memory cleanup
    break;
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `llmRequestGenerator` (lOq) - Main async generator that orchestrates streaming LLM requests
- `nonStreamingFallback` (dOq) - Fallback path when streaming fails
- `mergeUsage` (e51) - Merges incremental usage stats from SSE events
- `accumulateUsage` (Af6) - Adds usage stats across multiple responses
- `buildCacheControlMessages` (m9z) - Adds cache_control markers to messages
- `buildSystemPromptBlocks` (F9z) - Converts system prompt strings to API-format blocks
- `completeQuery` (mp) - Non-streaming convenience wrapper
- `streamingQuery` (UW1) - Streaming convenience wrapper
- `abortStream` (yd1) - Safely aborts an active stream controller

---

## Architecture Overview

The streaming pipeline follows this flow:

```
User message → lOq (request generator)
                 ├── Tool schema build
                 ├── Message normalization
                 ├── System prompt assembly
                 ├── API request with stream:true
                 ├── SSE event loop (stall detection)
                 │    ├── message_start → init partial message
                 │    ├── content_block_start → init block
                 │    ├── content_block_delta → accumulate text/json/thinking
                 │    ├── content_block_stop → yield complete block
                 │    └── message_delta → update usage, check stop_reason
                 ├── On stream error → dOq (non-streaming fallback)
                 └── Post-query telemetry
```

---

## Core Streaming Loop

### llmRequestGenerator - The main LLM request generator

**What it does:** Builds the complete API request, sends it as a streaming request, processes Server-Sent Events (SSE) in real-time, and yields assistant messages as content blocks complete.

**How it works:**

1. **Pre-request validation**: Checks an "off-switch" feature flag that can disable the service remotely. If activated, yields an error immediately without making any API call.

2. **Tool schema preparation**: Builds tool schemas with deferred tool loading support. Tools marked as "deferred" are filtered unless they appeared in recent conversation. This reduces token usage by only including tools the model is likely to need.

3. **Message normalization**: Converts internal message format to API format via `WJ` (normalizeMessages), stripping tool_use blocks for tools not in the current tool set.

4. **System prompt assembly**: Assembles system prompt from multiple sources: attribution header, core system prompt, MCP instructions, plan mode instructions, and dynamic cache boundaries.

5. **Request parameter construction**: The `O1` closure builds the final API params including model, messages, system, tools, betas, thinking config, effort level, and temperature.

6. **Streaming request creation**: Calls `client.beta.messages.create({...params, stream: true})` via the retry wrapper `V26` (withApiRetry).

7. **SSE event processing loop**: Iterates over stream events, processing each by type (see Delta Handling below).

8. **Error recovery**: On stream failure, falls back to non-streaming mode via `dOq`.

**Why this approach:**
- Streaming allows progressive UI updates as the model generates output
- The generator pattern (`async function*`) lets callers consume blocks incrementally without buffering the entire response
- The retry wrapper handles transient failures at the network level, while the fallback handles stream-specific failures

**Key insight:** The streaming loop maintains a `q1` array (contentBlocks) indexed by SSE block index. Each content_block_start initializes the appropriate type, deltas accumulate into it, and content_block_stop yields the complete block wrapped as an assistant message. This means each content block becomes its own yielded message, enabling fine-grained UI updates.

---

## Stall Detection Algorithm

### Stream Stall Detection

**What it does:** Monitors the time gap between consecutive SSE events and logs warnings when gaps exceed a threshold, indicating potential network or server issues.

**How it works:**

1. Tracks `$1` (lastEventTime) initialized to `null`
2. The stall threshold `G1` is hardcoded at **30,000ms** (30 seconds)
3. For each received event, computes `y1 = currentTime - lastEventTime`
4. If `y1 > G1`: increments `x1` (stallCount), accumulates `L1` (totalStallTime), logs a warning, and sends telemetry with stall details
5. After the stream completes, if any stalls occurred, logs a summary with total stall count and accumulated stall time

**Why this approach:**
- A 30-second threshold is chosen because LLM responses can legitimately have pauses during complex reasoning, but a 30s silence almost always indicates a problem (network stall, server overload, or connection drop)
- Tracking cumulative stall time helps distinguish between a single long stall and many short stalls, which have different root causes
- Telemetry includes the event type that ended the stall, which helps diagnose whether stalls happen at specific points in generation (e.g., before tool_use blocks)

**Key insight:** Stall detection is purely observational -- it does not abort or retry on stalls. It relies on the SDK's built-in timeout handling for actual recovery. The stall telemetry serves as a diagnostic signal for infrastructure monitoring.

---

## Delta Handling (Content Block Assembly)

### SSE Event Type Processing

**What it does:** Processes each SSE event type to incrementally assemble content blocks (text, tool_use, thinking) from deltas.

**How it works:**

The stream produces these event types in sequence:

1. **`message_start`**: Contains the initial message metadata (id, model, usage). Stored as `j1` (partialMessage). Initial usage stats are merged via `e51`.

2. **`content_block_start`**: Initializes a new content block in the `q1` array at the given index. The block type determines initialization:
   - `tool_use` / `server_tool_use`: `{ ...block, input: "" }` (input starts as empty string for JSON accumulation)
   - `text`: `{ ...block, text: "" }` (text starts empty)
   - `thinking`: `{ ...block, thinking: "", signature: "" }` (both fields start empty)

3. **`content_block_delta`**: Accumulates incremental data into the block:
   - `input_json_delta` on tool_use: appends `partial_json` to `input` string
   - `text_delta` on text: appends `delta.text` to `text`
   - `thinking_delta` on thinking: appends `delta.thinking` to `thinking`
   - `signature_delta` on thinking: sets `signature` field
   - `citations_delta`: silently ignored (no accumulation needed)

4. **`content_block_stop`**: The completed block is wrapped in an assistant message object with UUID, timestamp, and requestId, then yielded to the caller.

5. **`message_delta`**: Contains final usage stats and `stop_reason`. Updates accumulated usage. If `stop_reason === "max_tokens"`, yields an error message about token limits. If `stop_reason === "model_context_window_exceeded"`, yields a context window error.

6. **`message_stop`**: Signals the end of the message. Clears the `contentBlocks` array to prevent memory leaks (NEW in v2.1.76).

**Why this approach:**
- Tool inputs arrive as partial JSON strings. JSON cannot be parsed incrementally, so parsing is deferred until the block is complete.
- Each content block is yielded independently so the UI can render text while tool inputs are still being received in a later block.
- Type mismatches between delta type and block type trigger telemetry + thrown errors, catching API protocol violations early.

**Key insight:** The tool_use input is received as `input_json_delta` events containing `partial_json` fragments. These are concatenated as raw strings into `input`. The parsing from string to JSON happens later in `JT6` (processContentBlocks) at content_block_stop time. This deferred parsing is critical because partial JSON is invalid JSON -- you cannot parse it incrementally.

---

## Non-Streaming Fallback

### nonStreamingFallback - Recovery path when streaming fails

**What it does:** When the streaming connection fails (network error, 404, etc.), this function makes a standard non-streaming API call as a fallback.

**How it works:**

1. Called from two places: the catch block of the streaming loop, and the 404-specific catch block
2. Uses the same retry wrapper `V26` (withApiRetry) but without `stream: true`
3. Calls `client.beta.messages.create(params)` (non-streaming) and receives the complete response
4. The complete response is wrapped as an assistant message and yielded
5. Telemetry event `tengu_streaming_fallback_to_non_streaming` is logged with the error type

**Why this approach:**
- Streaming can fail for reasons unrelated to the API itself (CDN issues, proxy timeouts, SSE parsing errors). A non-streaming request bypasses all streaming infrastructure.
- The 404 case specifically handles scenarios where certain API endpoints do not support streaming (e.g., some Bedrock configurations).
- `g9z` (capMaxTokens) applies `Q9z` as a ceiling for non-streaming mode, since non-streaming responses must fit entirely in memory.

**Key insight:** The fallback is a "last resort" -- it only triggers after the stream has already failed. The response quality is identical, but the user loses progressive rendering. The flag `Z1` (didFallBackToNonStreaming) is tracked in telemetry to monitor fallback rates.

---

## Token Counting During Streaming

### mergeUsage - Incremental usage stat accumulation

**What it does:** Merges usage statistics from SSE events into a running total, handling the fact that message_start and message_delta both provide partial usage data.

**How it works:**

The `e51` function takes the existing accumulated usage `A` and a new partial usage `q` and returns a merged result. The merge strategy is:
- For `input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`: Takes the new value if it is non-null and > 0, otherwise keeps the existing value. This is because input token counts appear only in `message_start`.
- For `output_tokens`: Takes the new value if present (via `??`). Output tokens appear in `message_delta` and increase as the response grows.
- For `server_tool_use`: Uses `??` fallback, since these counts come only in the final message_delta.
- For `cache_creation`: Ephemeral cache stats use `??` fallback.

The initial usage object `LN` has all fields zeroed. Each SSE event provides partial updates that are progressively merged.

**Why this approach:**
- The API sends input token counts in `message_start` and output token counts progressively in `message_delta`. Using "take if positive, else keep" for inputs and "take latest" for outputs matches this protocol.
- This avoids double-counting: if a field appears in both message_start and message_delta, the latest non-zero value wins.

**Key insight:** Cost calculation happens after the stream completes via `bq6` (calculateCost) and `Sq6` (trackCumulativeCost). The cost is computed from the final merged usage and the model's pricing tier. The `J1` variable accumulates cost across retries (important when withApiRetry makes multiple attempts).

---

## Performance Tracking

The streaming pipeline integrates with the profiling system via `y3` (recordMark) at key points:

| Mark | When | Purpose |
|------|------|---------|
| `query_tool_schema_build_start/end` | Before/after tool schema construction | Measures tool schema overhead |
| `query_message_normalization_start/end` | Before/after message normalization | Measures message processing time |
| `query_client_creation_start/end` | Before/after client+retry setup | Measures SDK initialization time |
| `query_api_request_sent` | When the stream request is dispatched | Marks the start of API latency |
| `query_first_chunk_received` | When the first SSE event arrives | Measures Time-To-First-Token (TTFT) |

TTFT is computed as `N1 = Date.now() - U` (time from request sent to first event). This is a critical user experience metric: shorter TTFT means the user sees the response start faster.

---

## Error Handling Hierarchy

The streaming code has a layered error handling strategy:

1. **Stream-level errors** (inside the `for await` loop): Fall back to non-streaming via `dOq`
2. **404 errors** (stream creation failed): Also fall back to non-streaming
3. **Abort errors** (`Oz` / AbortError): If signal is aborted, re-throw (user cancelled). If not, wrap as timeout error.
4. **API errors** (`k4` / APIError): Log rate limit info via `Qz6`, report via telemetry
5. **Retry wrapper errors** (`qB` / RetryError): Unwrap to get the original error, use the retry context's model for reporting

Each error path logs telemetry with: model, message count, token estimate, duration, attempt count, request ID, and whether fallback was used. This comprehensive error reporting enables monitoring of API reliability from the client side.
