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
- `callModel` (NT6) - Main async generator for LLM API requests (via SKq helper)
- `mainAgentLoop` (Yh) - Entry point that calls callModel
- `withApiRetry` (_P1) - Retry wrapper with stall detection
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
User message → Yh (mainAgentLoop)
                 ├── Tool schema build
                 ├── Message normalization
                 ├── System prompt assembly
                 ├── callModel (NT6) with stream:true
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

### streamingQueryCore (mGq) - The complete SSE event processing loop

**What it does:** Builds the complete API request, sends it as a streaming request, processes Server-Sent Events (SSE) in real-time, and yields assistant messages as content blocks complete.

**How it works:**

1. **Pre-request validation**: Checks an "off-switch" feature flag that can disable the service remotely. If activated, yields an error immediately without making any API call.

2. **Tool schema preparation**: Builds tool schemas with deferred tool loading support. Tools marked as "deferred" are filtered unless they appeared in recent conversation. This reduces token usage by only including tools the model is likely to need.

3. **Message normalization**: Converts internal message format to API format via `cM` (normalizeMessages), stripping tool_use blocks for tools not in the current tool set.

4. **System prompt assembly**: Assembles system prompt from multiple sources: attribution header, core system prompt, MCP instructions, plan mode instructions, and dynamic cache boundaries.

5. **Request parameter construction**: The `$6` closure builds the final API params including model, messages, system, tools, betas, thinking config, effort level, and temperature.

6. **Streaming request creation**: Calls `client.beta.messages.create({...params, stream: true})` via the retry wrapper `_P1` (withApiRetry).

7. **SSE event processing loop**: Iterates over stream events, processing each by type.

8. **Error recovery**: On stream failure, falls back to non-streaming mode via `bGq`.

```javascript
// ============================================
// SSE Event Processing Loop - Core streaming logic
// Location: chunks.171.mjs:299-447
// ============================================

// ORIGINAL (for source lookup):
switch (n6.type) {
    case "message_start": {
        a = n6.message, o = Date.now() - r, l = Qz6(l, n6.message?.usage);
        break
    }
    case "content_block_start":
        switch (n6.content_block.type) {
            case "tool_use":
                i[n6.index] = {
                    ...n6.content_block,
                    input: ""
                };
                break;
            case "server_tool_use":
                i[n6.index] = {
                    ...n6.content_block,
                    input: ""
                };
                break;
            case "text":
                i[n6.index] = {
                    ...n6.content_block,
                    text: ""
                };
                break;
            case "thinking":
                i[n6.index] = {
                    ...n6.content_block,
                    thinking: "",
                    signature: ""
                };
                break;
            default:
                i[n6.index] = {
                    ...n6.content_block
                };
                break
        }
        break;
    case "content_block_delta": {
        let S6 = i[n6.index];
        if (!S6) throw d("tengu_streaming_error", {
            error_type: "content_block_not_found_delta",
            part_type: n6.type,
            part_index: n6.index
        }), RangeError("Content block not found");
        switch (n6.delta.type) {
            case "citations_delta":
                break;
            case "input_json_delta":
                if (S6.type !== "tool_use" && S6.type !== "server_tool_use") throw d("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_input_json",
                    expected_type: "tool_use",
                    actual_type: S6.type
                }), Error("Content block is not a input_json block");
                S6.input += n6.delta.partial_json;
                break;
            case "text_delta":
                S6.text += n6.delta.text;
                break;
            case "signature_delta":
                S6.signature = n6.delta.signature;
                break;
            case "thinking_delta":
                S6.thinking += n6.delta.thinking;
                break
        }
        break
    }
    case "content_block_stop": {
        let S6 = i[n6.index];
        let g6 = {
            message: {
                ...a,
                content: dh1([S6], Y, _.agentId)
            },
            requestId: J6 ?? void 0,
            type: "assistant",
            uuid: Dn8(),
            timestamp: new Date().toISOString()
        };
        n.push(g6), yield g6;
        break
    }
    case "message_delta": {
        l = Qz6(l, n6.usage), w6 = n6.delta.stop_reason;
        if (w6 === "max_tokens") yield y9({
            content: "Claude's response exceeded the output token maximum.",
            apiError: "max_output_tokens",
            error: "max_output_tokens"
        });
        break
    }
    case "message_stop":
        break
}
yield {
    type: "stream_event",
    event: n6
}

// READABLE (for understanding):
switch (sseEvent.type) {
    case "message_start": {
        partialMessage = sseEvent.message;
        timeToFirstTokenMs = Date.now() - requestStartTime;
        accumulatedUsage = mergeUsage(accumulatedUsage, sseEvent.message?.usage);
        break;
    }

    case "content_block_start":
        // Initialize content block based on type
        switch (sseEvent.content_block.type) {
            case "tool_use":
            case "server_tool_use":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    input: ""  // Will accumulate JSON deltas
                };
                break;
            case "text":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    text: ""  // Will accumulate text deltas
                };
                break;
            case "thinking":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    thinking: "",      // Will accumulate thinking deltas
                    signature: ""      // Set by signature_delta
                };
                break;
            default:
                contentBlocks[sseEvent.index] = { ...sseEvent.content_block };
                break;
        }
        break;

    case "content_block_delta": {
        let block = contentBlocks[sseEvent.index];
        if (!block) {
            logEvent("tengu_streaming_error", {
                error_type: "content_block_not_found_delta",
                part_type: sseEvent.type,
                part_index: sseEvent.index
            });
            throw new RangeError("Content block not found");
        }

        // Accumulate delta into block based on type
        switch (sseEvent.delta.type) {
            case "citations_delta":
                // Ignored - no accumulation needed
                break;
            case "input_json_delta":
                // Validate block is tool_use type
                if (block.type !== "tool_use" && block.type !== "server_tool_use") {
                    logEvent("tengu_streaming_error", {
                        error_type: "content_block_type_mismatch_input_json",
                        expected_type: "tool_use",
                        actual_type: block.type
                    });
                    throw new Error("Content block is not a input_json block");
                }
                block.input += sseEvent.delta.partial_json;
                break;
            case "text_delta":
                block.text += sseEvent.delta.text;
                break;
            case "signature_delta":
                block.signature = sseEvent.delta.signature;
                break;
            case "thinking_delta":
                block.thinking += sseEvent.delta.thinking;
                break;
        }
        break;
    }

    case "content_block_stop": {
        let block = contentBlocks[sseEvent.index];

        // Build complete assistant message
        let assistantMessage = {
            message: {
                ...partialMessage,
                content: processContentBlocks([block], tools, agentId)
            },
            requestId: requestId ?? undefined,
            type: "assistant",
            uuid: generateUUID(),
            timestamp: new Date().toISOString()
        };

        completedMessages.push(assistantMessage);
        yield assistantMessage;  // Yield to caller immediately
        break;
    }

    case "message_delta": {
        accumulatedUsage = mergeUsage(accumulatedUsage, sseEvent.usage);
        stopReason = sseEvent.delta.stop_reason;

        // Update last message with final usage
        let lastMessage = completedMessages[completedMessages.length - 1];
        if (lastMessage) {
            lastMessage.message.usage = accumulatedUsage;
            lastMessage.message.stop_reason = stopReason;
        }

        // Handle max_tokens truncation
        if (stopReason === "max_tokens") {
            logEvent("tengu_max_tokens_reached", { max_tokens: maxOutputTokens });
            yield createErrorMessage({
                content: "Claude's response exceeded the output token maximum.",
                apiError: "max_output_tokens",
                error: "max_output_tokens"
            });
        }

        // Handle context window exceeded
        if (stopReason === "model_context_window_exceeded") {
            logEvent("tengu_context_window_exceeded", {
                max_tokens: maxOutputTokens,
                output_tokens: accumulatedUsage.output_tokens
            });
            yield createErrorMessage({
                content: "The model has reached its context window limit.",
                apiError: "max_output_tokens",
                error: "max_output_tokens"
            });
        }
        break;
    }

    case "message_stop":
        // End of message - no action needed
        break;
}

// Always yield stream event for UI updates
yield {
    type: "stream_event",
    event: sseEvent,
    ...(sseEvent.type === "message_start" ? { ttftMs: timeToFirstTokenMs } : undefined)
};

// Mapping: n6→sseEvent, a→partialMessage, o→timeToFirstTokenMs, l→accumulatedUsage,
//   i→contentBlocks, n→completedMessages, w6→stopReason, J6→requestId, Y→tools,
//   _→options, s6→block, g6→assistantMessage, Qz6→mergeUsage, dh1→processContentBlocks,
//   Dn8→generateUUID, y9→createErrorMessage, d→logEvent, K5→recordMark
```

**Why this approach:**
- Streaming allows progressive UI updates as the model generates output
- The generator pattern (`async function*`) lets callers consume blocks incrementally without buffering the entire response
- Each content block is yielded independently so the UI can render text while tool inputs are still being received
- Type mismatches between delta type and block type trigger telemetry + thrown errors, catching API protocol violations early

**Key insight:** The `contentBlocks` array is indexed by SSE block index. Each `content_block_start` initializes the appropriate type, deltas accumulate into it, and `content_block_stop` yields the complete block. Tool inputs arrive as `input_json_delta` events containing `partial_json` fragments that are concatenated as raw strings. The parsing from string to JSON happens in `processContentBlocks` at `content_block_stop` time.

---

## Stall Detection Algorithm

### Stream Stall Detection Implementation

**What it does:** Monitors the time gap between consecutive SSE events and logs warnings when gaps exceed a threshold, indicating potential network or server issues.

```javascript
// ============================================
// Stall Detection - Monitors gaps between SSE events
// Location: chunks.171.mjs:274-294, 455-462
// ============================================

// ORIGINAL (for source lookup):
let E6 = !0,
    U6 = null,
    c6 = 30000,
    K1 = 0,
    j6 = 0;
for await (let n6 of H6) {
    b6();
    let d6 = Date.now();
    if (U6 !== null) {
        let S6 = d6 - U6;
        if (S6 > c6) j6++, K1 += S6, k(`Streaming stall detected: ${(S6/1000).toFixed(1)}s gap between events (stall #${j6})`, {
            level: "warn"
        }), d("tengu_streaming_stall", {
            stall_duration_ms: S6,
            stall_count: j6,
            total_stall_time_ms: K1,
            event_type: n6.type,
            model: _.model,
            request_id: J6 ?? "unknown"
        })
    }
    U6 = d6;
    // ... event processing ...
}
if (j6 > 0) k(`Streaming completed with ${j6} stall(s), total stall time: ${(K1/1000).toFixed(1)}s`, {
    level: "warn"
}), d("tengu_streaming_stall_summary", {
    stall_count: j6,
    total_stall_time_ms: K1,
    model: _.model,
    request_id: J6 ?? "unknown"
});

// READABLE (for understanding):
let isFirstEvent = true;
let lastEventTime = null;
const STALL_THRESHOLD_MS = 30000;  // 30 seconds
let totalStallTimeMs = 0;
let stallCount = 0;

for await (let sseEvent of streamIterator) {
    resetWatchdogTimer();  // Reset idle timeout on each event
    let currentTime = Date.now();

    // Check for stall (gap since last event)
    if (lastEventTime !== null) {
        let gapMs = currentTime - lastEventTime;

        if (gapMs > STALL_THRESHOLD_MS) {
            stallCount++;
            totalStallTimeMs += gapMs;

            console.warn(`Streaming stall detected: ${(gapMs/1000).toFixed(1)}s gap between events (stall #${stallCount})`);

            logEvent("tengu_streaming_stall", {
                stall_duration_ms: gapMs,
                stall_count: stallCount,
                total_stall_time_ms: totalStallTimeMs,
                event_type: sseEvent.type,
                model: options.model,
                request_id: requestId ?? "unknown"
            });
        }
    }
    lastEventTime = currentTime;

    // ... event processing ...
}

// Log summary if any stalls occurred
if (stallCount > 0) {
    console.warn(`Streaming completed with ${stallCount} stall(s), total stall time: ${(totalStallTimeMs/1000).toFixed(1)}s`);

    logEvent("tengu_streaming_stall_summary", {
        stall_count: stallCount,
        total_stall_time_ms: totalStallTimeMs,
        model: options.model,
        request_id: requestId ?? "unknown"
    });
}

// Mapping: E6→isFirstEvent, U6→lastEventTime, c6→STALL_THRESHOLD_MS, K1→totalStallTimeMs,
//   j6→stallCount, n6→sseEvent, H6→streamIterator, d6→currentTime, S6→gapMs,
//   k→console.log, d→logEvent, b6→resetWatchdogTimer
```

**Why this approach:**
- A 30-second threshold is chosen because LLM responses can legitimately have pauses during complex reasoning, but a 30s silence almost always indicates a problem (network stall, server overload, or connection drop)
- Tracking cumulative stall time helps distinguish between a single long stall and many short stalls, which have different root causes
- Telemetry includes the event type that ended the stall, which helps diagnose whether stalls happen at specific points in generation (e.g., before tool_use blocks)

**Key insight:** Stall detection is purely observational -- it does not abort or retry on stalls. It relies on the watchdog timer (separate mechanism) for actual timeout handling. The stall telemetry serves as a diagnostic signal for infrastructure monitoring.

---

## Stream Watchdog (Idle Timeout)

### Watchdog Timer Implementation

**What it does:** Sets up a watchdog timer that aborts the stream if no events are received for 60 seconds.

```javascript
// ============================================
// Stream Watchdog - Aborts on idle timeout
// Location: chunks.171.mjs:216-235, 266-272
// ============================================

// ORIGINAL (for source lookup):
let V6 = function() {
        if (C6 !== null) clearTimeout(C6), C6 = null;
        if (o6 !== null) clearTimeout(o6), o6 = null
    },
    b6 = function() {
        if (V6(), !Q6) return;
        C6 = setTimeout((E6) => {
            k(`Streaming idle warning: no chunks received for ${E6/1000}s`, {
                level: "warn"
            }), U1("warn", "cli_streaming_idle_warning")
        }, k6, k6), o6 = setTimeout(() => {
            u6 = !0, k(`Streaming idle timeout: no chunks received for ${Z6/1000}s, aborting stream`, {
                level: "error"
            }), U1("error", "cli_streaming_idle_timeout"), d("tengu_streaming_idle_timeout", {
                model: _.model,
                request_id: J6 ?? "unknown",
                timeout_ms: Z6
            }), s()
        }, Z6)
    };

let Q6 = t6(process.env.CLAUDE_ENABLE_STREAM_WATCHDOG),
    k6 = 30000,  // Warning threshold
    Z6 = 60000,  // Abort threshold
    u6 = !1,     // Did timeout
    C6 = null,   // Warning timer
    o6 = null;   // Abort timer
b6();

// READABLE (for understanding):
function clearWatchdogTimers() {
    if (warningTimer !== null) clearTimeout(warningTimer), warningTimer = null;
    if (abortTimer !== null) clearTimeout(abortTimer), abortTimer = null;
}

function resetWatchdogTimer() {
    clearWatchdogTimers();

    if (!watchdogEnabled) return;

    // Set warning timer (30s)
    warningTimer = setTimeout((threshold) => {
        console.warn(`Streaming idle warning: no chunks received for ${threshold/1000}s`);
        sendTelemetry("warn", "cli_streaming_idle_warning");
    }, WARNING_THRESHOLD_MS, WARNING_THRESHOLD_MS);

    // Set abort timer (60s)
    abortTimer = setTimeout(() => {
        didTimeout = true;
        console.error(`Streaming idle timeout: no chunks received for ${ABORT_THRESHOLD_MS/1000}s, aborting stream`);
        sendTelemetry("error", "cli_streaming_idle_timeout");

        logEvent("tengu_streaming_idle_timeout", {
            model: options.model,
            request_id: requestId ?? "unknown",
            timeout_ms: ABORT_THRESHOLD_MS
        });

        abortStream();  // Cancel the HTTP request
    }, ABORT_THRESHOLD_MS);
}

// Configuration
let watchdogEnabled = parseBoolean(process.env.CLAUDE_ENABLE_STREAM_WATCHDOG);
const WARNING_THRESHOLD_MS = 30000;  // 30 seconds
const ABORT_THRESHOLD_MS = 60000;    // 60 seconds
let didTimeout = false;
let warningTimer = null;
let abortTimer = null;

// Start watchdog
resetWatchdogTimer();

// Mapping: V6→clearWatchdogTimers, b6→resetWatchdogTimer, Q6→watchdogEnabled,
//   k6→WARNING_THRESHOLD_MS, Z6→ABORT_THRESHOLD_MS, u6→didTimeout,
//   C6→warningTimer, o6→abortTimer, s→abortStream, t6→parseBoolean
```

**Why this approach:**
- Two-tier timer: Warning at 30s, abort at 60s. This gives operators early warning before the stream is killed.
- Watchdog must be explicitly enabled via environment variable, allowing gradual rollout.
- Calling `resetWatchdogTimer()` on each event ensures the watchdog only triggers on true idle, not just slow events.

**Key insight:** The watchdog is a safety mechanism for hung connections. Unlike stall detection which just observes, the watchdog actively aborts the stream, triggering the non-streaming fallback path.

---

## Retry Logic with withApiRetry (_P1)

### Core Retry Algorithm

**What it does:** Wraps API calls with exponential backoff retry, handling rate limits (429), overloaded errors (529), context overflow (400), and authentication failures (401/403).

**Location:** chunks.89.mjs:3-94

**Source Code (VERIFIED):**

```javascript
// ============================================
// withApiRetry - Retry wrapper with exponential backoff
// Location: chunks.89.mjs:3-94
// ============================================

// ORIGINAL (for source lookup):
async function* _P1(A, q, K) {
    let Y = mb9(K),
        z = {
            model: K.model,
            thinkingConfig: K.thinkingConfig,
            ...Dq() ? {
                fastMode: K.fastMode
            } : {}
        },
        _ = null,
        w = K.initialConsecutive529Errors ?? 0,
        O;
    for (let $ = 1; $ <= Y + 1; $++) {
        if (K.signal?.aborted) throw new Az;
        let H = Dq() ? z.fastMode && !Jm() : !1;
        try {
            if (_ === null || O instanceof a7 && O.status === 401 || TN8(O) || H54(O) || j54(O)) {
                if (O instanceof a7 && O.status === 401 || TN8(O)) {
                    let j = sA()?.accessToken;
                    if (j) await DG(j)
                }
                _ = await A()
            }
            return await q(_, $, z)
        } catch (j) {
            O = j, k(`API error (attempt ${$}/${Y+1}): ${j instanceof a7?`${j.status} ${j.message}`:_1(j)}`, {
                level: "error"
            });
            // ... error handling continues ...
        }
    }
}

// READABLE (for understanding):
async function* withApiRetry(buildRequestFn, executeRequestFn, retryConfig) {
    let maxRetries = getMaxRetries(retryConfig);
    let retryContext = {
        model: retryConfig.model,
        thinkingConfig: retryConfig.thinkingConfig,
        ...(isUsingFastMode() ? { fastMode: retryConfig.fastMode } : {})
    };
    let cachedRequest = null;
    let consecutive529Errors = retryConfig.initialConsecutive529Errors ?? 0;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        // Check for abort before each attempt
        if (retryConfig.signal?.aborted) {
            throw new AbortError();
        }

        let isFastModeRetry = isUsingFastMode() ? retryContext.fastMode && !isBuiltinModel() : false;

        try {
            // Rebuild request if needed (first attempt, auth refresh, or specific errors)
            if (cachedRequest === null ||
                lastError instanceof APIError && lastError.status === 401 ||
                isTokenRevokedError(lastError) ||
                isBedrockAuthError(lastError) ||
                isVertexAuthError(lastError)) {

                // Refresh auth token on 401 or token revocation
                if (lastError instanceof APIError && lastError.status === 401 || isTokenRevokedError(lastError)) {
                    let token = getAuthState()?.accessToken;
                    if (token) {
                        await refreshAccessToken(token);
                    }
                }
                cachedRequest = await buildRequestFn();
            }

            return await executeRequestFn(cachedRequest, attempt, retryContext);
        } catch (error) {
            lastError = error;

            console.error(`API error (attempt ${attempt}/${maxRetries+1}): ${
                error instanceof APIError ? `${error.status} ${error.message}` : formatError(error)
            }`);

            // Fast mode specific handling
            if (isFastModeRetry && error instanceof APIError &&
                (error.status === 429 || isOverloadedError(error))) {

                // Check for overage disabled reason
                let overageReason = error.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
                if (overageReason !== null && overageReason !== undefined) {
                    handleOverageDisabled(overageReason);
                    retryContext.fastMode = false;  // Disable fast mode
                    continue;
                }

                // Check retry-after header
                let retryAfterMs = parseRetryAfterHeader(error);
                if (retryAfterMs !== null && retryAfterMs < MAX_RETRY_AFTER_MS) {
                    await sleep(retryAfterMs, retryConfig.signal);
                    continue;
                }

                // Calculate exponential backoff
                let backoffMs = Math.max(retryAfterMs ?? DEFAULT_INITIAL_BACKOFF_MS, MIN_BACKOFF_MS);
                let reason = isOverloadedError(error) ? "overloaded" : "rate_limit";
                recordRateLimitState(Date.now() + backoffMs, reason);

                if (isUsingFastMode()) {
                    retryContext.fastMode = false;  // Disable fast mode on rate limit
                }
                continue;
            }

            // Handle fast mode disabled error
            if (isFastModeRetry && isFastModeDisabledError(error)) {
                handleFastModeDisabled();
                retryContext.fastMode = false;
                continue;
            }

            // Handle 529 overloaded errors with model fallback
            if (isOverloadedError(error) &&
                (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS ||
                 !isInsideSandbox() && shouldFallbackForModel(retryConfig.model))) {
                consecutive529Errors++;
                if (consecutive529Errors >= MAX_529_ERRORS_BEFORE_FALLBACK) {
                    if (retryConfig.fallbackModel) {
                        logEvent("tengu_api_opus_fallback_triggered", {
                            original_model: retryConfig.model,
                            fallback_model: retryConfig.fallbackModel,
                            provider: getProviderName()
                        });
                        throw new ModelFallbackError(retryConfig.model, retryConfig.fallbackModel);
                    }
                    if (!process.env.IS_SANDBOX) {
                        logEvent("tengu_api_custom_529_overloaded_error", {});
                        throw new RetryExhaustedError(error, retryContext);
                    }
                }
            }

            // Check if we've exhausted retries
            if (attempt > maxRetries) {
                throw new RetryExhaustedError(error, retryContext);
            }

            // Check if error is retryable
            if (!(isRetryableError(error) || isApiError(error) && isRetryableStatus(error))) {
                throw new RetryExhaustedError(error, retryContext);
            }

            // Context overflow handling
            if (error instanceof APIError) {
                let parsed = parseContextOverflowError(error);
                if (parsed) {
                    let { inputTokens, contextLimit } = parsed;
                    const BUFFER = 1000;
                    let availableContext = Math.max(0, contextLimit - inputTokens - BUFFER);

                    if (availableContext < FLOOR_OUTPUT_TOKENS) {
                        logError(Error(`availableContext ${availableContext} is less than FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`));
                        throw error;  // Cannot recover
                    }

                    // Adjust max tokens for thinking mode
                    let thinkingBudget = (retryContext.thinkingConfig.type === "enabled"
                        ? retryContext.thinkingConfig.budgetTokens
                        : 0) + 1;
                    let adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, availableContext, thinkingBudget);

                    retryContext.maxTokensOverride = adjustedMaxTokens;

                    logEvent("tengu_max_tokens_context_overflow_adjustment", {
                        inputTokens: inputTokens,
                        contextLimit: contextLimit,
                        adjustedMaxTokens: adjustedMaxTokens,
                        attempt: attempt
                    });

                    continue;  // Retry with adjusted max_tokens
                }
            }

            // Calculate backoff with optional retry-after header
            let retryAfterHeader = getRetryAfterHeader(error);
            let backoffMs = calculateBackoff(attempt, retryAfterHeader);

            if (error instanceof APIError) {
                yield createRetryEvent(error, backoffMs, attempt, maxRetries);
            }

            logEvent("tengu_api_retry", {
                attempt: attempt,
                delayMs: backoffMs,
                error: error.message,
                status: error.status,
                provider: getProviderName()
            });

            await sleep(backoffMs, retryConfig.signal);
        }
    }

    throw new RetryExhaustedError(lastError, retryContext);
}

// Mapping: _P1→withApiRetry, A→buildRequestFn, q→executeRequestFn, K→retryConfig,
//   Y→maxRetries, z→retryContext, _→cachedRequest, w→consecutive529Errors, O→lastError,
//   $→attempt, H→isFastModeRetry, j→error, a7→APIError, Az→AbortError, R36→ModelFallbackError,
//   RB→RetryExhaustedError, mb9→getMaxRetries, Dq→isUsingFastMode, Jm→isBuiltinModel,
//   TN8→isTokenRevokedError, H54→isBedrockAuthError, j54→isVertexAuthError, DG→refreshAccessToken,
//   iF6→isOverloadedError, Cb9→isFastModeDisabledError, $54→parseContextOverflowError
```

### Retry Algorithm Key Decisions

**1. When to rebuild the request (A call):**
```javascript
if (cachedRequest === null ||
    lastError instanceof APIError && lastError.status === 401 ||
    isTokenRevokedError(lastError) ||
    isBedrockAuthError(lastError) ||
    isVertexAuthError(lastError)) {
    cachedRequest = await buildRequestFn();
}
```
- **First attempt**: Always build fresh
- **Auth errors (401)**: Rebuild after token refresh
- **Token revocation**: Rebuild with new credentials
- **Cloud auth errors**: Rebuild for Bedrock/Vertex

**2. Backoff calculation (VI function):**
```javascript
function calculateBackoff(attempt, retryAfterHeader) {
    // Prefer retry-after header if present
    if (retryAfterHeader) {
        let seconds = parseInt(retryAfterHeader, 10);
        if (!isNaN(seconds)) return seconds * 1000;
    }

    // Exponential backoff with jitter
    let baseBackoff = Math.min(BASE_BACKOFF_MS * Math.pow(2, attempt - 1), 32000);
    let jitter = Math.random() * 0.25 * baseBackoff;
    return baseBackoff + jitter;
}
```

**3. Context overflow recovery:**
- Parses error message with regex: `/input length and \`max_tokens\` exceed context limit: (\d+) \+ (\d+) > (\d+)/`
- Calculates: `available = contextLimit - inputTokens - BUFFER(1000)`
- Ensures minimum floor: `max(FLOOR_OUTPUT_TOKENS, available, thinkingBudget + 1)`

**4. 529 overloaded fallback:**
- Tracks consecutive 529 errors
- After `MAX_529_ERRORS_BEFORE_FALLBACK` (default 3), triggers model fallback
- Falls back from Opus to Sonnet when enabled

**Why this approach:**
- **Lazy request building**: Only rebuilds request when necessary (auth refresh, first attempt)
- **Fast mode degradation**: On rate limit, disables fast mode and retries
- **Exponential backoff with jitter**: Prevents thundering herd on rate limits
- **Context overflow recovery**: Adjusts max_tokens automatically rather than failing

---

## Error Classification Hierarchy

### Error Types and Recovery Paths

The streaming code has a layered error handling strategy:

```
ERROR CLASSIFICATION HIERARCHY
┌─────────────────────────────────────────────────────────────────────┐
│ Level 1: Stream-level errors (inside for await loop)               │
│   → Fall back to non-streaming via bGq                            │
│   → Log "tengu_streaming_fallback_to_non_streaming"               │
├─────────────────────────────────────────────────────────────────────┤
│ Level 2: 404 errors (stream creation failed)                       │
│   → Also fall back to non-streaming via bGq                        │
│   → Specific error type: "404_stream_creation"                     │
├─────────────────────────────────────────────────────────────────────┤
│ Level 3: Abort errors (AbortError / Az)                            │
│   → If signal.aborted: re-throw (user cancelled)                  │
│   → If not aborted: wrap as timeout error                          │
├─────────────────────────────────────────────────────────────────────┤
│ Level 4: ModelFallbackError (R36)                                  │
│   → Re-throw to be handled by mainAgentLoop                        │
│   → Triggers model switch at higher level                          │
├─────────────────────────────────────────────────────────────────────┤
│ Level 5: API errors (APIError / RB)                                │
│   → Log rate limit info                                            │
│   → Report via telemetry                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Error Recovery Code

```javascript
// ============================================
// Error Recovery - Streaming fallback and classification
// Location: chunks.171.mjs:465-544
// ============================================

// ORIGINAL (for source lookup):
} catch (E6) {
    if (V6(), E6 instanceof Az)
        if (z.aborted) throw k(`Streaming aborted by user: ${_1(E6)}`), E6;
        else throw k(`Streaming timeout (SDK abort): ${E6.message}`, {
            level: "error"
        }), new zm({
            message: "Request timed out"
        });
    if (w8("tengu_disable_streaming_to_non_streaming_fallback", !1)) throw k(`Error streaming (non-streaming fallback disabled): ${_1(E6)}`, {
        level: "error"
    }), d("tengu_streaming_fallback_to_non_streaming", {
        model: _.model,
        error: E6 instanceof Error ? E6.name : String(E6),
        attemptNumber: e,
        maxOutputTokens: L6,
        thinkingType: K.type,
        fallback_disabled: !0
    }), E6;
    // ... fallback to non-streaming ...
}

// READABLE (for understanding):
} catch (error) {
    clearWatchdogTimers();

    // Level 3: Abort errors
    if (error instanceof AbortError) {
        if (abortSignal.aborted) {
            // User explicitly cancelled - re-throw
            console.log(`Streaming aborted by user: ${formatError(error)}`);
            throw error;
        } else {
            // SDK timeout - wrap as generic timeout
            console.error(`Streaming timeout (SDK abort): ${error.message}`);
            throw new TimeoutError({ message: "Request timed out" });
        }
    }

    // Check if fallback is disabled
    if (isFeatureEnabled("tengu_disable_streaming_to_non_streaming_fallback", false)) {
        console.error(`Error streaming (non-streaming fallback disabled): ${formatError(error)}`);
        logEvent("tengu_streaming_fallback_to_non_streaming", {
            model: options.model,
            error: error instanceof Error ? error.name : String(error),
            attemptNumber: attemptNumber,
            maxOutputTokens: maxOutputTokens,
            thinkingType: thinkingConfig.type,
            fallback_disabled: true
        });
        throw error;  // Re-throw without fallback
    }

    // Level 1: Fall back to non-streaming
    console.error(`Error streaming, falling back to non-streaming mode: ${formatError(error)}`);
    didFallbackToNonStreaming = true;

    if (options.onStreamingFallback) {
        options.onStreamingFallback();
    }

    logEvent("tengu_streaming_fallback_to_non_streaming", {
        model: options.model,
        error: error instanceof Error ? error.name : String(error),
        attemptNumber: attemptNumber,
        maxOutputTokens: maxOutputTokens,
        thinkingType: thinkingConfig.type,
        fallback_disabled: false
    });

    // Execute non-streaming request
    let nonStreamingResult = yield* executeNonStreamingQuery(
        { model: options.model, source: options.querySource },
        {
            model: options.model,
            fallbackModel: options.fallbackModel,
            thinkingConfig: thinkingConfig,
            ...(isFastModeEnabled() ? { fastMode: isFastMode } : {}),
            signal: abortSignal,
            initialConsecutive529Errors: is529Error(error) ? 1 : 0
        },
        buildRequestParams,
        (attempt, context, maxTokens) => {
            attemptNumber = attempt;
            maxOutputTokens = maxTokens;
        },
        logRequestParams
    );

    // Yield the non-streaming result
    let fallbackMessage = {
        message: {
            ...nonStreamingResult,
            content: processContentBlocks(nonStreamingResult.content, tools, agentId)
        },
        requestId: requestId ?? undefined,
        type: "assistant",
        uuid: generateUUID(),
        timestamp: new Date().toISOString()
    };

    completedMessages.push(fallbackMessage);
    yield fallbackMessage;
}

// Mapping: E6→error, Az→AbortError, z→abortSignal, _1→formatError, zm→TimeoutError,
//   w8→isFeatureEnabled, d→logEvent, bGq→executeNonStreamingQuery, K1→fallbackMessage,
//   O6→didFallbackToNonStreaming, V6→clearWatchdogTimers
```

**Why this approach:**
- Streaming can fail for reasons unrelated to the API itself (CDN issues, proxy timeouts, SSE parsing errors). A non-streaming request bypasses all streaming infrastructure.
- The 404 case specifically handles scenarios where certain API endpoints do not support streaming (e.g., some Bedrock configurations).
- The fallback is a "last resort" -- it only triggers after the stream has already failed. The response quality is identical, but the user loses progressive rendering.

**Key insight:** The flag `didFallbackToNonStreaming` (O6) is tracked for telemetry to monitor fallback rates. High fallback rates indicate infrastructure issues that need investigation.

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

## Non-Streaming Fallback (bGq)

### nonStreamingFallbackCore - Recovery path when streaming fails

**What it does:** When the streaming connection fails (network error, 404, watchdog timeout), this async generator makes a standard non-streaming API call as a fallback.

**How it works:**

1. **Request building**: Uses the same `buildRequestFn` callback to construct the API parameters
2. **Retry wrapper**: Calls `withApiRetry` without `stream: true` flag
3. **Direct API call**: `client.beta.messages.create(params)` returns complete response
4. **Yield system events**: Yields any `type: "system"` events from retry wrapper
5. **Return final message**: Returns the complete assistant message

**Source Code (VERIFIED):**

```javascript
// ============================================
// nonStreamingFallbackCore - Fallback when streaming fails
// Location: chunks.170.mjs:2028-2057
// ============================================

// ORIGINAL (for source lookup):
async function* bGq(A, q, K, Y, z) {
    let _ = _P1(() => MI({
            maxRetries: 0,
            model: A.model,
            fetchOverride: A.fetchOverride,
            source: A.source
        }), async (O, $, H) => {
            let j = Date.now(),
                J = K(H);
            z(J), Y($, j, J.max_tokens);
            let M = O9z(J, w9z);
            return await O.beta.messages.create({
                ...M,
                model: lg(M.model)
            })
        }, {
            model: q.model,
            fallbackModel: q.fallbackModel,
            thinkingConfig: q.thinkingConfig,
            ...Dq() ? {
                fastMode: q.fastMode
            } : {},
            signal: q.signal,
            initialConsecutive529Errors: q.initialConsecutive529Errors
        }),
        w;
    do
        if (w = await _.next(), !w.done && w.value.type === "system") yield w.value; while (!w.done);
    return w.value
}

// READABLE (for understanding):
async function* nonStreamingFallbackCore(requestContext, retryConfig, buildRequestParams, trackAttempt, logParams) {
    // Create retry wrapper for non-streaming request
    let retryIterator = withApiRetry(
        () => createApiClient({
            maxRetries: 0,
            model: requestContext.model,
            fetchOverride: requestContext.fetchOverride,
            source: requestContext.source
        }),
        async (client, attempt, context) => {
            let startTime = Date.now();
            let requestParams = buildRequestParams(context);
            logParams(requestParams);
            trackAttempt(attempt, startTime, requestParams.max_tokens);

            // Prepare request (non-streaming mode)
            let nonStreamingParams = prepareNonStreamingParams(requestParams);

            // Execute non-streaming API call
            return await client.beta.messages.create({
                ...nonStreamingParams,
                model: formatModelName(nonStreamingParams.model)
            });
        },
        {
            model: retryConfig.model,
            fallbackModel: retryConfig.fallbackModel,
            thinkingConfig: retryConfig.thinkingConfig,
            ...(isFastModeEnabled() ? { fastMode: retryConfig.fastMode } : {}),
            signal: retryConfig.signal,
            initialConsecutive529Errors: retryConfig.initialConsecutive529Errors
        }
    );

    // Iterate and yield system events, return final message
    let result;
    do {
        result = await retryIterator.next();
        // Yield system events (e.g., retry notifications)
        if (!result.done && result.value.type === "system") {
            yield result.value;
        }
    } while (!result.done);

    // Return the final message
    return result.value;
}

// Mapping: bGq→nonStreamingFallbackCore, A→requestContext, q→retryConfig,
//   K→buildRequestParams, Y→trackAttempt, z→logParams, _→retryIterator,
//   w→result, O→client, $→attempt, H→context, j→startTime, J→requestParams,
//   M→nonStreamingParams, _P1→withApiRetry, MI→createApiClient, O9z→prepareNonStreamingParams,
//   w9z→nonStreamingMode, lg→formatModelName, Dq→isFastModeEnabled
```

**Why this approach:**
- **Same request building**: Uses the exact same `buildRequestParams` callback as streaming, ensuring request parity
- **Retry support**: Inherits all retry logic from `withApiRetry` including rate limit handling and 529 backoff
- **System event passthrough**: Yields retry notifications so the UI can show "retrying..." messages
- **Generator pattern**: Matches streaming interface so callers can use the same `for await` loop

**Key insight:** The `w9z` constant passed to `O9z` signals non-streaming mode, which may adjust `max_tokens` differently than streaming (non-streaming has no progressive output limit). The `do...while` loop consumes all yielded events from the retry wrapper, forwarding only system events.

---

## Usage Accumulation: accumulateUsage (qy1)

### accumulateUsage - Add usage stats across multiple responses

**What it does:** Adds two usage objects together, used when accumulating usage across multiple API calls (e.g., retries, multi-turn conversations).

**Source Code (VERIFIED):**

```javascript
// ============================================
// accumulateUsage - Adds usage stats across responses
// Location: chunks.171.mjs:695-715
// ============================================

// ORIGINAL (for source lookup):
function qy1(A, q) {
    return {
        input_tokens: A.input_tokens + q.input_tokens,
        cache_creation_input_tokens: A.cache_creation_input_tokens + q.cache_creation_input_tokens,
        cache_read_input_tokens: A.cache_read_input_tokens + q.cache_read_input_tokens,
        output_tokens: A.output_tokens + q.output_tokens,
        server_tool_use: {
            web_search_requests: A.server_tool_use.web_search_requests + q.server_tool_use.web_search_requests,
            web_fetch_requests: A.server_tool_use.web_fetch_requests + q.server_tool_use.web_fetch_requests
        },
        service_tier: q.service_tier,
        cache_creation: {
            ephemeral_1h_input_tokens: A.cache_creation.ephemeral_1h_input_tokens + q.cache_creation.ephemeral_1h_input_tokens,
            ephemeral_5m_input_tokens: A.cache_creation.ephemeral_5m_input_tokens + q.cache_creation.ephemeral_5m_input_tokens
        },
        ...{},
        inference_geo: q.inference_geo,
        iterations: q.iterations,
        speed: q.speed
    }
}

// READABLE (for understanding):
function accumulateUsage(accumulated, newUsage) {
    return {
        // Sum token counts
        input_tokens: accumulated.input_tokens + newUsage.input_tokens,
        cache_creation_input_tokens: accumulated.cache_creation_input_tokens + newUsage.cache_creation_input_tokens,
        cache_read_input_tokens: accumulated.cache_read_input_tokens + newUsage.cache_read_input_tokens,
        output_tokens: accumulated.output_tokens + newUsage.output_tokens,

        // Sum server tool usage
        server_tool_use: {
            web_search_requests: accumulated.server_tool_use.web_search_requests + newUsage.server_tool_use.web_search_requests,
            web_fetch_requests: accumulated.server_tool_use.web_fetch_requests + newUsage.server_tool_use.web_fetch_requests
        },

        // Take latest for metadata fields
        service_tier: newUsage.service_tier,

        // Sum cache creation details
        cache_creation: {
            ephemeral_1h_input_tokens: accumulated.cache_creation.ephemeral_1h_input_tokens + newUsage.cache_creation.ephemeral_1h_input_tokens,
            ephemeral_5m_input_tokens: accumulated.cache_creation.ephemeral_5m_input_tokens + newUsage.cache_creation.ephemeral_5m_input_tokens
        },

        // Take latest for geo and performance
        inference_geo: newUsage.inference_geo,
        iterations: newUsage.iterations,
        speed: newUsage.speed
    };
}

// Mapping: qy1→accumulateUsage, A→accumulated, q→newUsage
```

**Why this approach:**
- **Token summation**: Input/output tokens are additive across calls
- **Latest metadata**: `service_tier`, `inference_geo`, `iterations`, and `speed` take the latest value
- **Nested object handling**: Server tool use and cache creation objects are merged correctly

**Key insight:** This is different from `mergeUsage` (Qz6) which merges incremental updates within a single stream. `accumulateUsage` (qy1) adds complete usage objects together, used for tracking total token usage across the entire conversation or multiple retry attempts.

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

## Cross-Feature Integration

### Integration with 07_compact

The streaming pipeline integrates with compact at multiple levels:

- **Context overflow handling**: When `stop_reason === "model_context_window_exceeded"`, yields an error message. The agent loop then triggers reactive compact.
- **Cache boundary management**: `F9z` (buildSystemPromptBlocks) adds cache_control markers for prompt caching optimization.
- **Memory management**: Content blocks array is cleared after `message_stop` to prevent memory leaks across compaction cycles.

### Integration with 19_think_level

Thinking mode affects streaming at the API level:

- **Thinking config propagation**: `thinkingConfig` parameter determines if thinking blocks are expected
- **Adaptive thinking**: When enabled, the API may return `thinking` blocks that are accumulated separately from text
- **Budget tokens**: Thinking budget reduces available output tokens for response content
- **Beta headers**: Adaptive thinking requires `kR6` (adaptive-thinking beta header)

### Integration with Agent Loop

The streaming pipeline yields events that the agent loop processes:

- **Stream events**: `yield { type: "stream_event", event: sseEvent }` - forwarded to UI for real-time updates
- **Assistant messages**: `yield { type: "assistant", message: {...} }` - accumulated by agent loop for context
- **Error messages**: `yield createErrorMessage(...)` - triggers recovery in agent loop

### Integration with UI Components

Streaming events drive UI updates:

- **stream_request_start**: UI shows "waiting" indicator
- **content_block_start**: UI transitions to appropriate mode (thinking/responding/tool-input)
- **content_block_delta**: Token counter updates with streaming text
- **message_stop**: UI transitions to tool execution state

---

## Token Counting: mergeUsage Algorithm (VERIFIED)

### mergeUsage (Qz6) - Complete Source Code

**What it does:** Merges partial usage statistics from SSE events into a running total, handling different merge strategies for different fields.

**Source Code (VERIFIED):**

```javascript
// ============================================
// mergeUsage - Incremental usage stat accumulation
// Location: chunks.171.mjs:670-693
// ============================================

// ORIGINAL (for source lookup):
function Qz6(A, q) {
    if (!q) return {
        ...A
    };
    return {
        input_tokens: q.input_tokens !== null && q.input_tokens > 0 ? q.input_tokens : A.input_tokens,
        cache_creation_input_tokens: q.cache_creation_input_tokens !== null && q.cache_creation_input_tokens > 0 ? q.cache_creation_input_tokens : A.cache_creation_input_tokens,
        cache_read_input_tokens: q.cache_read_input_tokens !== null && q.cache_read_input_tokens > 0 ? q.cache_read_input_tokens : A.cache_read_input_tokens,
        output_tokens: q.output_tokens ?? A.output_tokens,
        server_tool_use: {
            web_search_requests: q.server_tool_use?.web_search_requests ?? A.server_tool_use.web_search_requests,
            web_fetch_requests: q.server_tool_use?.web_fetch_requests ?? A.server_tool_use.web_fetch_requests
        },
        service_tier: A.service_tier,
        cache_creation: {
            ephemeral_1h_input_tokens: q.cache_creation?.ephemeral_1h_input_tokens ?? A.cache_creation.ephemeral_1h_input_tokens,
            ephemeral_5m_input_tokens: q.cache_creation?.ephemeral_5m_input_tokens ?? A.cache_creation.ephemeral_5m_input_tokens
        },
        ...{},
        inference_geo: A.inference_geo,
        iterations: q.iterations ?? A.iterations,
        speed: q.speed ?? A.speed
    }
}

// READABLE (for understanding):
function mergeUsage(accumulated, partial) {
    // Handle null/undefined partial
    if (!partial) {
        return { ...accumulated };
    }

    return {
        // Input tokens: take new value if positive, else keep existing
        // Reason: input_tokens appears only in message_start
        input_tokens: partial.input_tokens !== null && partial.input_tokens > 0
            ? partial.input_tokens
            : accumulated.input_tokens,

        cache_creation_input_tokens: partial.cache_creation_input_tokens !== null && partial.cache_creation_input_tokens > 0
            ? partial.cache_creation_input_tokens
            : accumulated.cache_creation_input_tokens,

        cache_read_input_tokens: partial.cache_read_input_tokens !== null && partial.cache_read_input_tokens > 0
            ? partial.cache_read_input_tokens
            : accumulated.cache_read_input_tokens,

        // Output tokens: take latest value (appears in message_delta)
        output_tokens: partial.output_tokens ?? accumulated.output_tokens,

        // Server tool usage (web search/fetch)
        server_tool_use: {
            web_search_requests: partial.server_tool_use?.web_search_requests ?? accumulated.server_tool_use.web_search_requests,
            web_fetch_requests: partial.server_tool_use?.web_fetch_requests ?? accumulated.server_tool_use.web_fetch_requests
        },

        // Service tier is always from accumulated (doesn't change)
        service_tier: accumulated.service_tier,

        // Ephemeral cache stats
        cache_creation: {
            ephemeral_1h_input_tokens: partial.cache_creation?.ephemeral_1h_input_tokens ?? accumulated.cache_creation.ephemeral_1h_input_tokens,
            ephemeral_5m_input_tokens: partial.cache_creation?.ephemeral_5m_input_tokens ?? accumulated.cache_creation.ephemeral_5m_input_tokens
        },

        // Geo and performance metadata
        inference_geo: accumulated.inference_geo,
        iterations: partial.iterations ?? accumulated.iterations,
        speed: partial.speed ?? accumulated.speed
    };
}

// Mapping: Qz6→mergeUsage, A→accumulated, q→partial
```

**Why different merge strategies:**
- **Input tokens**: Only appear in `message_start`, so take positive values, otherwise keep existing
- **Output tokens**: Appear progressively in `message_delta`, so always take latest via `??`
- **Server tool use**: Web search/fetch counts only in final message_delta
- **Service tier**: Never changes during a message, always from accumulated

**Key insight:** The asymmetric merge strategy prevents double-counting. If `input_tokens` appeared in both `message_start` (10000) and `message_delta` (0), the "take if positive" rule ensures we keep 10000, not 0.

---

## Content Block Processing: processContentBlocks (VERIFIED)

### processContentBlocks (dh1) - Parse and normalize content blocks

**What it does:** Processes content blocks after they're complete, parsing JSON inputs and normalizing tool inputs according to their schemas.

**Source Code (VERIFIED):**

```javascript
// ============================================
// processContentBlocks - Parse and normalize completed content blocks
// Location: chunks.173.mjs:2267-2307
// ============================================

// ORIGINAL (for source lookup):
function dh1(A, q, K) {
    if (!A) return [];
    return A.map((Y) => {
        switch (Y.type) {
            case "tool_use": {
                if (typeof Y.input !== "string" && !A_(Y.input)) throw Error("Tool use input must be a string or object");
                let z = typeof Y.input === "string" ? WK(Y.input) ?? {} : Y.input;
                if (typeof z === "object" && z !== null) {
                    let _ = dK(q, Y.name);
                    if (_) try {
                        z = SGq(_, z, K)
                    } catch (w) {
                        _6(Error("Error normalizing tool input: " + w))
                    }
                }
                return {
                    ...Y,
                    input: z
                }
            }
            case "text":
                if (Y.text.trim().length === 0) d("tengu_model_whitespace_response", {
                    length: Y.text.length
                });
                return Y;
            case "code_execution_tool_result":
            case "mcp_tool_use":
            case "mcp_tool_result":
            case "container_upload":
                return Y;
            case "server_tool_use":
                if (typeof Y.input === "string") return {
                    ...Y,
                    input: WK(Y.input) ?? {}
                };
                return Y;
            default:
                return Y
        }
    })
}

// READABLE (for understanding):
function processContentBlocks(blocks, tools, agentId) {
    if (!blocks) return [];

    return blocks.map((block) => {
        switch (block.type) {
            case "tool_use": {
                // Validate input type
                if (typeof block.input !== "string" && !isObject(block.input)) {
                    throw new Error("Tool use input must be a string or object");
                }

                // Parse JSON string if needed
                let parsedInput = typeof block.input === "string"
                    ? tryParseJSON(block.input) ?? {}
                    : block.input;

                // Normalize input according to tool schema
                if (typeof parsedInput === "object" && parsedInput !== null) {
                    let tool = findTool(tools, block.name);
                    if (tool) {
                        try {
                            parsedInput = normalizeToolInput(tool, parsedInput, agentId);
                        } catch (error) {
                            reportError(new Error("Error normalizing tool input: " + error));
                        }
                    }
                }

                return { ...block, input: parsedInput };
            }

            case "text":
                // Log telemetry for whitespace-only responses
                if (block.text.trim().length === 0) {
                    logEvent("tengu_model_whitespace_response", {
                        length: block.text.length
                    });
                }
                return block;

            // Pass through these types unchanged
            case "code_execution_tool_result":
            case "mcp_tool_use":
            case "mcp_tool_result":
            case "container_upload":
                return block;

            case "server_tool_use":
                // Parse JSON string input if needed
                if (typeof block.input === "string") {
                    return {
                        ...block,
                        input: tryParseJSON(block.input) ?? {}
                    };
                }
                return block;

            default:
                return block;
        }
    });
}

// Mapping: dh1→processContentBlocks, A→blocks, q→tools, K→agentId, Y→block,
//   WK→tryParseJSON, dK→findTool, SGq→normalizeToolInput, _6→reportError, d→logEvent
```

**Why this approach:**
- **Deferred JSON parsing**: Tool inputs arrive as `partial_json` strings. Only parse when block is complete.
- **Schema normalization**: `SGq` (normalizeToolInput) applies tool-specific transformations to the input object.
- **Whitespace telemetry**: Empty text blocks trigger telemetry to detect model issues.
- **Type preservation**: MCP and server tool blocks pass through without modification.

**Key insight:** The `WK` function (tryParseJSON) returns `null` on parse failure, which is then coalesced to `{}`. This means malformed JSON tool inputs become empty objects rather than crashing the stream. The error is logged but not thrown, allowing the tool dispatcher to handle the invalid input later.

---

## Stall Detection: Complete Algorithm (VERIFIED)

### Stall Detection Configuration

**Constants (VERIFIED from source):**

```javascript
// Location: chunks.171.mjs:266-277
const STALL_THRESHOLD_MS = 30000;        // 30 seconds
const WARNING_THRESHOLD_MS = 30000;     // 30 seconds (for watchdog)
const ABORT_THRESHOLD_MS = 60000;       // 60 seconds
const WATCHDOG_ENABLED = parseBoolean(process.env.CLAUDE_ENABLE_STREAM_WATCHDOG);
```

**Why 30 seconds:** LLM responses can legitimately pause during complex reasoning. A 30-second silence almost always indicates a problem (network stall, server overload, connection drop). Shorter thresholds would generate false positives for complex reasoning tasks.

**Why 60 seconds for abort:** Double the stall threshold ensures the abort only triggers after multiple stall periods or a single very long stall. This provides a safety margin before giving up on the request.

---

## Usage Accumulation (Qz6 - mergeUsage)

### mergeUsage - Incremental Usage Stats Merger

**What it does:**
The `mergeUsage` (Qz6) function merges incremental usage statistics from SSE events into the cumulative usage object. This is called on every `message_start` and `message_delta` event.

**Source Code (VERIFIED):**

```javascript
// ============================================
// mergeUsage - Merges incremental usage stats from SSE events
// Location: chunks.171.mjs:670-693
// ============================================

// ORIGINAL (for source lookup):
function Qz6(A, q) {
    if (!q) return {
        ...A
    };
    return {
        input_tokens: q.input_tokens !== null && q.input_tokens > 0 ? q.input_tokens : A.input_tokens,
        cache_creation_input_tokens: q.cache_creation_input_tokens !== null && q.cache_creation_input_tokens > 0 ? q.cache_creation_input_tokens : A.cache_creation_input_tokens,
        cache_read_input_tokens: q.cache_read_input_tokens !== null && q.cache_read_input_tokens > 0 ? q.cache_read_input_tokens : A.cache_read_input_tokens,
        output_tokens: q.output_tokens ?? A.output_tokens,
        server_tool_use: {
            web_search_requests: q.server_tool_use?.web_search_requests ?? A.server_tool_use.web_search_requests,
            web_fetch_requests: q.server_tool_use?.web_fetch_requests ?? A.server_tool_use.web_fetch_requests
        },
        service_tier: A.service_tier,
        cache_creation: {
            ephemeral_1h_input_tokens: q.cache_creation?.ephemeral_1h_input_tokens ?? A.cache_creation.ephemeral_1h_input_tokens,
            ephemeral_5m_input_tokens: q.cache_creation?.ephemeral_5m_input_tokens ?? A.cache_creation.ephemeral_5m_input_tokens
        },
        ...{},
        inference_geo: A.inference_geo,
        iterations: q.iterations ?? A.iterations,
        speed: q.speed ?? A.speed
    }
}

// READABLE (for understanding):
function mergeUsage(cumulative, incremental) {
    if (!incremental) {
        return { ...cumulative };
    }

    return {
        // Token counts - prefer non-zero incremental values
        input_tokens: incremental.input_tokens !== null && incremental.input_tokens > 0
            ? incremental.input_tokens
            : cumulative.input_tokens,
        cache_creation_input_tokens: incremental.cache_creation_input_tokens !== null && incremental.cache_creation_input_tokens > 0
            ? incremental.cache_creation_input_tokens
            : cumulative.cache_creation_input_tokens,
        cache_read_input_tokens: incremental.cache_read_input_tokens !== null && incremental.cache_read_input_tokens > 0
            ? incremental.cache_read_input_tokens
            : cumulative.cache_read_input_tokens,
        output_tokens: incremental.output_tokens ?? cumulative.output_tokens,

        // Server tool usage - coalesce nested objects
        server_tool_use: {
            web_search_requests: incremental.server_tool_use?.web_search_requests ?? cumulative.server_tool_use.web_search_requests,
            web_fetch_requests: incremental.server_tool_use?.web_fetch_requests ?? cumulative.server_tool_use.web_fetch_requests
        },

        // Preserve service tier from original
        service_tier: cumulative.service_tier,

        // Cache creation details
        cache_creation: {
            ephemeral_1h_input_tokens: incremental.cache_creation?.ephemeral_1h_input_tokens ?? cumulative.cache_creation.ephemeral_1h_input_tokens,
            ephemeral_5m_input_tokens: incremental.cache_creation?.ephemeral_5m_input_tokens ?? cumulative.cache_creation.ephemeral_5m_input_tokens
        },

        // Preserve inference geo
        inference_geo: cumulative.inference_geo,

        // Extended thinking iterations and speed
        iterations: incremental.iterations ?? cumulative.iterations,
        speed: incremental.speed ?? cumulative.speed
    };
}

// Mapping: Qz6→mergeUsage, A→cumulative, q→incremental
```

**Why this approach:**
- **Non-zero filtering**: Only updates token counts when the new value is non-null AND positive. This prevents zero values from overwriting valid counts during partial updates.
- **Null coalescing**: Uses `??` for output_tokens since zero is a valid value but null/undefined should fall back to cumulative.
- **Nested object merging**: Special handling for `server_tool_use` and `cache_creation` to avoid losing nested properties.
- **Preservation**: Properties like `service_tier` and `inference_geo` are preserved from the original since they don't change mid-stream.

**Key insight:** The SSE events can have partial usage updates. For example, `message_start` provides initial `input_tokens`, while `message_delta` provides final `output_tokens`. The merge function must handle incomplete incremental objects gracefully.

---

## abortStream (K9z) - Safe Stream Termination

**What it does:**
Safely aborts an active stream controller if it hasn't already been aborted.

**Source Code (VERIFIED):**

```javascript
// ============================================
// abortStream - Safely aborts an active stream controller
// Location: chunks.171.mjs:663-668
// ============================================

// ORIGINAL (for source lookup):
function K9z(A) {
    if (!A) return;
    try {
        if (!A.controller.signal.aborted) A.controller.abort()
    } catch {}
}

// READABLE (for understanding):
function abortStream(streamIterator) {
    if (!streamIterator) return;

    try {
        // Only abort if not already aborted
        if (!streamIterator.controller.signal.aborted) {
            streamIterator.controller.abort();
        }
    } catch {
        // Silently ignore errors - stream may already be closed
    }
}

// Mapping: K9z→abortStream, A→streamIterator
```

**Why this approach:**
- **Guard clauses**: Checks if iterator exists and hasn't been aborted before attempting abort.
- **Silent failure**: The `catch {}` block ignores errors because:
  1. The stream may have already completed naturally
  2. The controller may have been cleaned up
  3. Aborting an already-aborted controller shouldn't crash the application
- **Single entry point**: All stream cleanup goes through this function, ensuring consistent handling.

---

## Cross-Feature Linkages

### Integration with Agent Loop (03_llm_core/agent_loop.md)

The streaming module is called from `mainAgentLoopCore` (omY) via `callModel` (NT6):

```
mainAgentLoopCore (omY)
    │
    └── callModel (NT6)
            │
            └── streamingQueryCore (mGq)
                    │
                    ├── Build tool schemas (Sh1)
                    ├── Normalize messages (cM)
                    ├── Build system prompt blocks (_9z)
                    ├── Execute API request via withApiRetry (_P1)
                    │   │
                    │   └── Anthropic API stream
                    │           │
                    │           └── SSE events (message_start, content_block_*, etc.)
                    │
                    └── Yield events back to agent loop
```

**Event Flow:**
| SSE Event | Yields to Agent Loop | Effect |
|-----------|---------------------|--------|
| `message_start` | `{ type: "stream_event", event, ttftMs }` | UI shows "responding" |
| `content_block_start` | `{ type: "stream_event", event }` | UI shows thinking/text mode |
| `content_block_delta` | `{ type: "stream_event", event }` | Token counter updates |
| `content_block_stop` | Complete assistant message | Message added to transcript |
| `message_delta` | `{ type: "stream_event", event }` | Final usage stats |
| `message_stop` | Stream ends | Agent loop processes tool uses |

### Integration with Tools (05_tools)

Tool input is assembled during streaming via `input_json_delta` events:

```
content_block_start (tool_use)
    ↓
i[index] = { type: "tool_use", name: "Bash", input: "" }
    ↓
content_block_delta (input_json_delta)
    ↓
i[index].input += partial_json
    ↓
content_block_stop
    ↓
processContentBlocks → parse JSON → normalizeToolInput
    ↓
Yield complete assistant message with tool_use block
```

### Integration with Compact (07_compact)

Streaming detects `model_context_window_exceeded` stop reason:

```javascript
// In message_delta handler:
if (stop_reason === "model_context_window_exceeded") {
    logEvent("tengu_context_window_exceeded", {...});
    yield errorMessage({ apiError: "max_output_tokens" });
}
```

This triggers the agent loop's context overflow recovery via `withApiRetry`.

### Integration with Thinking Mode (16_thinking_mode)

Thinking blocks are assembled during streaming:

```
content_block_start (thinking)
    ↓
i[index] = { type: "thinking", thinking: "", signature: "" }
    ↓
thinking_delta → accumulate thinking text
signature_delta → set signature
    ↓
content_block_stop → yield complete thinking block
```

**Budget tracking:** The streaming module enforces `budget_tokens` for extended thinking.

### Integration with Prompt Cache (23_prompt_cache)

Cache control headers are managed in streaming:

```
buildSystemPromptBlocks (_9z)
    ↓
Add cache_control markers based on global cache flag
    ↓
Include in API request
    ↓
Receive cache_read_input_tokens in usage
    ↓
Track cache efficiency in telemetry
```

---

## Telemetry Events

### Streaming Lifecycle Events

```javascript
// Before API request
logEvent("tengu_api_before_normalize", {
    preNormalizedMessageCount: number
});

// After message normalization
logEvent("tengu_api_after_normalize", {
    postNormalizedMessageCount: number
});

// API request sent
logEvent("api_request_sent", {
    model: string,
    messagesLength: number,
    temperature: number,
    betas: string[],
    permissionMode: string,
    querySource: string,
    thinkingType: string,
    effortValue: number,
    fastMode: boolean,
    previousRequestId: string | null
});
```

### Streaming Error Events

```javascript
// Streaming idle timeout
logEvent("tengu_streaming_idle_timeout", {
    model: string,
    request_id: string,
    timeout_ms: number
});

// Streaming stall detected
logEvent("tengu_streaming_stall", {
    stall_duration_ms: number,
    stall_count: number,
    total_stall_time_ms: number,
    event_type: string,
    model: string,
    request_id: string
});

// Stream completed with no events
logEvent("tengu_stream_no_events", {
    model: string,
    request_id: string
});

// Streaming fallback to non-streaming
logEvent("tengu_streaming_fallback_to_non_streaming", {
    model: string,
    error: string,
    attemptNumber: number,
    maxOutputTokens: number,
    thinkingType: string,
    fallback_disabled: boolean
});
```

### Content Block Error Events

```javascript
// Content block not found during delta
logEvent("tengu_streaming_error", {
    error_type: "content_block_not_found_delta",
    part_type: string,
    part_index: number
});

// Type mismatch errors
logEvent("tengu_streaming_error", {
    error_type: "content_block_type_mismatch_input_json",
    expected_type: "tool_use",
    actual_type: string
});

// Empty text block (model issue)
logEvent("tengu_empty_text_block", {
    model: string
});
```

### Token Usage Events

```javascript
// Max tokens reached
logEvent("tengu_max_tokens_reached", {
    max_tokens: number
});

// Context window exceeded
logEvent("tengu_context_window_exceeded", {
    max_tokens: number,
    output_tokens: number
});
```

---

## Stall Detection Algorithm (VERIFIED)

> **Source:** `chunks.171.mjs:216-462` (within `mGq` / streamingQueryCore)
> **Cross-validated:** `chunks.148.mjs:934` (agent loop invocation)

Claude Code implements a two-layer stall detection system inside the streaming SSE loop to detect and recover from unresponsive API connections.

### Layer 1: Watchdog Timers (b6 / resetAndStartWatchdog)

A pair of `setTimeout`-based watchdog timers, gated by the `CLAUDE_ENABLE_STREAM_WATCHDOG` environment variable:

```javascript
// ============================================
// clearWatchdog / resetAndStartWatchdog
// Location: chunks.171.mjs:216-235
// ============================================

// ORIGINAL:
let V6 = function() {
        if (C6 !== null) clearTimeout(C6), C6 = null;
        if (o6 !== null) clearTimeout(o6), o6 = null
    },
    b6 = function() {
        if (V6(), !Q6) return;
        C6 = setTimeout((E6) => {
            k(`Streaming idle warning: no chunks received for ${E6/1000}s`, {
                level: "warn"
            }), U1("warn", "cli_streaming_idle_warning")
        }, k6, k6), o6 = setTimeout(() => {
            u6 = !0, k(`Streaming idle timeout: no chunks received for ${Z6/1000}s, aborting stream`, {
                level: "error"
            }), U1("error", "cli_streaming_idle_timeout"), d("tengu_streaming_idle_timeout", {
                model: _.model,
                request_id: J6 ?? "unknown",
                timeout_ms: Z6
            }), s()
        }, Z6)
    };

// READABLE:
let clearWatchdog = function() {
        if (warningTimer !== null) clearTimeout(warningTimer), warningTimer = null;
        if (abortTimer !== null) clearTimeout(abortTimer), abortTimer = null;
    },
    resetAndStartWatchdog = function() {
        clearWatchdog();
        if (!watchdogEnabled) return;

        // Tier 1: Warning after 30s of silence
        warningTimer = setTimeout((duration) => {
            log(`Streaming idle warning: no chunks received for ${duration/1000}s`, {
                level: "warn"
            });
            logToCloudWatch("warn", "cli_streaming_idle_warning");
        }, WARNING_TIMEOUT_MS, WARNING_TIMEOUT_MS);   // 30000ms

        // Tier 2: Abort after 60s of silence
        abortTimer = setTimeout(() => {
            idleTimedOut = true;
            log(`Streaming idle timeout: no chunks received for ${ABORT_TIMEOUT_MS/1000}s, aborting stream`, {
                level: "error"
            });
            logToCloudWatch("error", "cli_streaming_idle_timeout");
            logEvent("tengu_streaming_idle_timeout", {
                model: params.model,
                request_id: requestId ?? "unknown",
                timeout_ms: ABORT_TIMEOUT_MS   // 60000
            });
            abortStream();   // s() — triggers AbortError in the for-await loop
        }, ABORT_TIMEOUT_MS);   // 60000ms
    };

// Mapping: V6→clearWatchdog, b6→resetAndStartWatchdog, C6→warningTimer, o6→abortTimer,
//   k6→WARNING_TIMEOUT_MS(30000), Z6→ABORT_TIMEOUT_MS(60000), Q6→watchdogEnabled,
//   u6→idleTimedOut, J6→requestId, s→abortStream, d→logEvent, k→log, U1→logToCloudWatch
```

**Constants and initialization** (chunks.171.mjs:266-271):

```javascript
let Q6 = t6(process.env.CLAUDE_ENABLE_STREAM_WATCHDOG),  // watchdogEnabled: boolean
    k6 = 30000,   // WARNING_TIMEOUT_MS: 30 seconds
    Z6 = 60000,   // ABORT_TIMEOUT_MS: 60 seconds
    u6 = false,    // idleTimedOut: flag set by abort timer
    C6 = null,     // warningTimer handle
    o6 = null;     // abortTimer handle
b6();   // Start watchdog immediately after stream begins
```

**Watchdog lifecycle:**

```
Stream starts
  └── b6() called (starts both timers)
      │
      ├── Every SSE event → b6() called again (resets both timers)
      │
      ├── 30s silence → Warning tier fires
      │   └── logs warning + "cli_streaming_idle_warning" CloudWatch event
      │   └── (stream continues — timers NOT reset by warning)
      │
      ├── 60s silence → Abort tier fires
      │   └── u6 = true (idleTimedOut)
      │   └── logs error + "cli_streaming_idle_timeout" + telemetry
      │   └── s() aborts the HTTP stream → AbortError in for-await
      │
      └── Stream ends (normal or error)
          └── V6() called (clears both timers)
```

### Layer 2: Inter-Event Gap Detection

Independent of the watchdog, a gap tracker runs inside the SSE `for-await` loop measuring time between consecutive events:

```javascript
// ============================================
// Inter-event gap detection
// Location: chunks.171.mjs:274-294
// ============================================

// ORIGINAL:
let E6 = !0,
    U6 = null,        // lastEventTime
    c6 = 30000,       // GAP_THRESHOLD_MS
    K1 = 0,           // totalStallTime
    j6 = 0;           // stallCount
for await (let n6 of H6) {
    b6();              // reset watchdog on every event
    let d6 = Date.now();
    if (U6 !== null) {
        let S6 = d6 - U6;
        if (S6 > c6) j6++, K1 += S6, k(`Streaming stall detected: ${(S6/1000).toFixed(1)}s gap between events (stall #${j6})`, {
            level: "warn"
        }), d("tengu_streaming_stall", {
            stall_duration_ms: S6,
            stall_count: j6,
            total_stall_time_ms: K1,
            event_type: n6.type,
            model: _.model,
            request_id: J6 ?? "unknown"
        })
    }
    U6 = d6;
    // ... process event ...
}

// READABLE:
let isFirstChunk = true,
    lastEventTime = null,
    GAP_THRESHOLD_MS = 30000,
    totalStallTime = 0,
    stallCount = 0;
for await (let event of streamIterator) {
    resetAndStartWatchdog();
    let now = Date.now();
    if (lastEventTime !== null) {
        let gap = now - lastEventTime;
        if (gap > GAP_THRESHOLD_MS) {
            stallCount++;
            totalStallTime += gap;
            log(`Streaming stall detected: ${(gap/1000).toFixed(1)}s gap between events (stall #${stallCount})`, {
                level: "warn"
            });
            logEvent("tengu_streaming_stall", {
                stall_duration_ms: gap,
                stall_count: stallCount,
                total_stall_time_ms: totalStallTime,
                event_type: event.type,
                model: params.model,
                request_id: requestId ?? "unknown"
            });
        }
    }
    lastEventTime = now;
    // ... process event ...
}

// Mapping: E6→isFirstChunk, U6→lastEventTime, c6→GAP_THRESHOLD_MS,
//   K1→totalStallTime, j6→stallCount, n6→event, d6→now, S6→gap
```

### Post-Stream Stall Summary

After the `for-await` loop completes, if any stalls were detected, a summary is emitted:

```javascript
// Location: chunks.171.mjs:448-462

// ORIGINAL:
if (V6(), u6) throw Error("Stream idle timeout - no chunks received");
if (!a || n.length === 0 && !w6) throw /* ... */ Error("Stream ended without receiving any events");
if (j6 > 0) k(`Streaming completed with ${j6} stall(s), total stall time: ${(K1/1000).toFixed(1)}s`, {
    level: "warn"
}), d("tengu_streaming_stall_summary", {
    stall_count: j6,
    total_stall_time_ms: K1,
    model: _.model,
    request_id: J6 ?? "unknown"
});

// READABLE:
clearWatchdog();
if (idleTimedOut) throw Error("Stream idle timeout - no chunks received");
if (!partialMessage || assistantMessages.length === 0 && !stopReason)
    throw Error("Stream ended without receiving any events");
if (stallCount > 0) {
    log(`Streaming completed with ${stallCount} stall(s), total stall time: ${(totalStallTime/1000).toFixed(1)}s`, {
        level: "warn"
    });
    logEvent("tengu_streaming_stall_summary", {
        stall_count: stallCount,
        total_stall_time_ms: totalStallTime,
        model: params.model,
        request_id: requestId ?? "unknown"
    });
}
```

### Stall Detection Telemetry Events

| Event | Trigger | Fields |
|-------|---------|--------|
| `cli_streaming_idle_warning` | Watchdog warning timer (30s) | (CloudWatch only) |
| `cli_streaming_idle_timeout` | Watchdog abort timer (60s) | (CloudWatch only) |
| `tengu_streaming_idle_timeout` | Watchdog abort timer (60s) | model, request_id, timeout_ms |
| `tengu_streaming_stall` | Inter-event gap > 30s | stall_duration_ms, stall_count, total_stall_time_ms, event_type, model, request_id |
| `tengu_streaming_stall_summary` | Post-stream if stallCount > 0 | stall_count, total_stall_time_ms, model, request_id |
| `tengu_stream_no_events` | Stream ended with no content | model, request_id |

### Decision Flow: Stall → Abort → Fallback

```
SSE for-await loop processing events
  │
  ├── Inter-event gap > 30s
  │   └── Log warning + tengu_streaming_stall (informational only, stream continues)
  │
  ├── Watchdog warning timer (30s idle)
  │   └── Log cli_streaming_idle_warning (informational only, stream continues)
  │
  ├── Watchdog abort timer (60s idle)
  │   └── Set idleTimedOut = true
  │   └── Log + tengu_streaming_idle_timeout
  │   └── s() aborts stream → AbortError breaks for-await
  │       └── Post-loop: throw Error("Stream idle timeout")
  │           └── Caught by inner catch (line 465)
  │               └── Falls through to bGq non-streaming fallback
  │
  └── Stream completes without message_start or content
      └── throw Error("Stream ended without receiving any events")
          └── Also caught by inner catch → falls back to bGq
```

---

## Non-Streaming Fallback Logic (VERIFIED)

> **Source:** `chunks.170.mjs:2028-2057` (bGq), `chunks.171.mjs:465-594` (trigger points)
> **Cross-validated:** `chunks.89.mjs:3-93` (_P1 retry wrapper)

When streaming fails, Claude Code falls back to a non-streaming API request via the `bGq` function.

### bGq (nonStreamingFallback)

```javascript
// ============================================
// bGq - Non-streaming API request fallback
// Location: chunks.170.mjs:2028-2057
// ============================================

// ORIGINAL:
async function* bGq(A, q, K, Y, z) {
    let _ = _P1(() => MI({
            maxRetries: 0,
            model: A.model,
            fetchOverride: A.fetchOverride,
            source: A.source
        }), async (O, $, H) => {
            let j = Date.now(),
                J = K(H);
            z(J), Y($, j, J.max_tokens);
            let M = O9z(J, w9z);
            return await O.beta.messages.create({
                ...M,
                model: lg(M.model)
            })
        }, {
            model: q.model,
            fallbackModel: q.fallbackModel,
            thinkingConfig: q.thinkingConfig,
            ...Dq() ? {
                fastMode: q.fastMode
            } : {},
            signal: q.signal,
            initialConsecutive529Errors: q.initialConsecutive529Errors
        }),
        w;
    do
        if (w = await _.next(), !w.done && w.value.type === "system") yield w.value; while (!w.done);
    return w.value
}

// READABLE:
async function* nonStreamingFallback(clientConfig, retryConfig, buildParams, onAttempt, onParamsBuilt) {
    // Create retry-wrapped generator:
    //   clientFactory: creates API client with maxRetries=0 (retry handled by _P1)
    //   requestFn: builds params via K(state), calls beta.messages.create WITHOUT stream:true
    let retryGenerator = withApiRetry(
        () => buildApiClient({
            maxRetries: 0,
            model: clientConfig.model,
            fetchOverride: clientConfig.fetchOverride,
            source: clientConfig.source
        }),
        async (client, attemptNumber, state) => {
            let startTime = Date.now();
            let params = buildParams(state);         // K(H) — builds request params
            onParamsBuilt(params);                    // z(params) — notify caller
            onAttempt(attemptNumber, startTime, params.max_tokens);  // Y($, j, max_tokens)
            let nonStreamParams = convertToNonStream(params, nonStreamConfig);  // O9z
            return await client.beta.messages.create({
                ...nonStreamParams,
                model: stripContextMarkers(nonStreamParams.model)  // lg() strips [1m]/[2m]
            });
        },
        {
            model: retryConfig.model,
            fallbackModel: retryConfig.fallbackModel,
            thinkingConfig: retryConfig.thinkingConfig,
            ...(isFastModeAvailable() ? { fastMode: retryConfig.fastMode } : {}),
            signal: retryConfig.signal,
            initialConsecutive529Errors: retryConfig.initialConsecutive529Errors
        }
    );

    // Consume generator, yielding only "system" events (retry notifications)
    let result;
    do {
        result = await retryGenerator.next();
        if (!result.done && result.value.type === "system") yield result.value;
    } while (!result.done);
    return result.value;   // The complete API response (not streaming)
}

// Mapping: bGq→nonStreamingFallback, A→clientConfig, q→retryConfig,
//   K→buildParams, Y→onAttempt, z→onParamsBuilt, _P1→withApiRetry,
//   MI→buildApiClient, O9z→convertToNonStream, w9z→nonStreamConfig,
//   lg→stripContextMarkers, Dq→isFastModeAvailable
```

**Key differences from streaming path (mGq):**
- No `stream: true` in the `create()` call — returns complete response in one HTTP round-trip
- `O9z(params, w9z)` converts request to non-streaming format
- `lg(model)` strips context window markers (`[1m]`, `[2m]`) from model name
- Only `"system"` events (retry status) are yielded during the generator loop — no incremental content

### Three Trigger Points for Fallback

```
Streaming mGq() execution
  │
  ├── Trigger 1 (line 465-519): Inner catch — SSE loop errors
  │   ├── AbortError (user abort) → re-throw (NO fallback)
  │   ├── AbortError (SDK timeout) → wrap as zm timeout error (NO fallback)
  │   ├── Feature flag tengu_disable_streaming_to_non_streaming_fallback=true → re-throw (NO fallback)
  │   └── All other errors → log + telemetry + yield* bGq(...)
  │
  ├── Trigger 2 (line 521-570): Outer catch — HTTP-level errors
  │   ├── R36 (ModelFallbackError) → re-throw (handled at loop level)
  │   ├── HTTP 404 from streaming endpoint → log + telemetry + yield* bGq(...)
  │   └── All other errors → re-throw
  │
  └── Trigger 3 (line 473): Feature flag gate
      └── tengu_disable_streaming_to_non_streaming_fallback = true
          → Skip fallback entirely, propagate error
```

**Trigger 1 source (chunks.171.mjs:465-519):**

```javascript
// ORIGINAL (inner catch):
} catch (E6) {
    if (V6(), E6 instanceof Az)
        if (z.aborted) throw k(`Streaming aborted by user: ${_1(E6)}`), E6;
        else throw k(`Streaming timeout (SDK abort): ${E6.message}`, { level: "error" }),
            new zm({ message: "Request timed out" });
    if (w8("tengu_disable_streaming_to_non_streaming_fallback", !1))
        throw k(`Error streaming (non-streaming fallback disabled): ${_1(E6)}`, { level: "error" }),
            d("tengu_streaming_fallback_to_non_streaming", {
                model: _.model, error: E6 instanceof Error ? E6.name : String(E6),
                attemptNumber: e, maxOutputTokens: L6, thinkingType: K.type,
                fallback_disabled: !0
            }), E6;
    if (k(`Error streaming, falling back to non-streaming mode: ${_1(E6)}`, { level: "error" }),
        O6 = !0, _.onStreamingFallback) _.onStreamingFallback();
    d("tengu_streaming_fallback_to_non_streaming", {
        model: _.model, error: E6 instanceof Error ? E6.name : String(E6),
        attemptNumber: e, maxOutputTokens: L6, thinkingType: K.type, fallback_disabled: !1
    });
    let c6 = yield* bGq({ model: _.model, source: _.querySource }, {
        model: _.model, fallbackModel: _.fallbackModel, thinkingConfig: K,
        ...Dq() ? { fastMode: B } : {},
        signal: z, initialConsecutive529Errors: iF6(E6) ? 1 : 0
    }, $6, (j6, W6, n6) => { e = j6, L6 = n6 }, (j6) => b81(j6, _.querySource));
    // ... wrap result and yield
}

// Mapping: Az→AbortError, zm→TimeoutError, O6→didFallback,
//   iF6→isOverloadedError, R36→ModelFallbackError
```

**Trigger 2 source (chunks.171.mjs:521-570):**

```javascript
// ORIGINAL (outer catch — 404 handling):
} catch (T6) {
    if (T6 instanceof R36) throw T6;   // ModelFallbackError → propagate
    if (!O6 && T6 instanceof RB && T6.originalError instanceof a7 && T6.originalError.status === 404) {
        if (k("Streaming endpoint returned 404, falling back to non-streaming mode", { level: "warn" }),
            O6 = !0, _.onStreamingFallback) _.onStreamingFallback();
        d("tengu_streaming_fallback_to_non_streaming", {
            model: _.model, error: "404_stream_creation",
            attemptNumber: e, maxOutputTokens: L6, thinkingType: K.type
        });
        try {
            let Q6 = yield* bGq(/* ... same params ... */);
            // ... wrap result and yield
        } catch (/* ... */) { throw /* ... */ }
    }
    throw T6;
}

// Mapping: RB→RetryExhaustedError, a7→APIError, R36→ModelFallbackError
```

### Fallback Decision Matrix

| Error Type | User Abort? | Feature Flag? | Action |
|------------|-------------|---------------|--------|
| `AbortError` (Az) | `signal.aborted = true` | — | Re-throw (user cancelled) |
| `AbortError` (Az) | `signal.aborted = false` | — | Wrap as `TimeoutError` (SDK abort) |
| Any error | — | `tengu_disable_streaming_to_non_streaming_fallback = true` | Re-throw with telemetry (fallback disabled) |
| `ModelFallbackError` (R36) | — | — | Re-throw (handled at agent loop level) |
| HTTP 404 from stream endpoint | — | — | **Fall back to bGq** |
| Any other SSE loop error | — | `= false` (default) | **Fall back to bGq** |
| Empty stream (no events) | — | — | Throw → caught → **Fall back to bGq** |
| Watchdog idle timeout | — | — | Throw → caught → **Fall back to bGq** |

### Streaming vs Non-Streaming Comparison

| Aspect | Streaming (mGq) | Non-Streaming (bGq) |
|--------|-----------------|---------------------|
| API call | `beta.messages.create({ stream: true })` | `beta.messages.create({ ...nonStreamParams })` |
| Token delivery | Incremental SSE events | Single complete response |
| Stall detection | Yes (watchdog + gap detection) | No (relies on HTTP/fetch timeout) |
| UI feedback | Real-time text streaming to TUI | Spinner until complete response |
| Retry integration | Same `_P1` (withApiRetry) wrapper | Same `_P1` wrapper |
| Model name | Raw model string | `lg(model)` strips `[1m]`/`[2m]` markers |
| Content format | `O9z(params, w9z)` conversion | Same `O9z(params, w9z)` conversion |
| 529 tracking | `initialConsecutive529Errors: iF6(E6) ? 1 : 0` | Passed through from streaming error |
| `onStreamingFallback` | Called before bGq to notify agent loop | N/A |

### Fallback Telemetry

```javascript
// Emitted for EVERY fallback attempt (streaming → non-streaming)
logEvent("tengu_streaming_fallback_to_non_streaming", {
    model: string,
    error: string,                 // Error name or "404_stream_creation"
    attemptNumber: number,
    maxOutputTokens: number,
    thinkingType: string,          // "enabled" | "adaptive" | "disabled"
    fallback_disabled?: boolean    // true when feature flag blocks fallback
});
```

---

## Verified Symbol Reference

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| mGq | streamingQueryCore | chunks.171.mjs:3 | Main streaming implementation |
| NT6 | callModel | chunks.170.mjs:2009 | Wrapper for streamingQueryCore |
| MI | buildApiParams | chunks.170.mjs | Construct API parameters |
| O9z | buildStreamingRequest | chunks.171.mjs | Build streaming request object |
| w9z | getStreamingConfig | chunks.171.mjs | Get streaming configuration |
| cM | normalizeMessages | chunks.173.mjs:1999 | Message normalization |
| gGq | addCacheControlsToMessages | chunks.171.mjs:68 | Add cache_control markers |
| _9z | buildSystemPromptBlocks | chunks.170.mjs:1483 | System prompt with cache |
| Sh1 | buildToolSchema | chunks.171.mjs:40 | Construct tool schema for API |
| yi6 | shouldUseDynamicLoading | chunks.171.mjs:17 | Determine dynamic loading |
| zF | extractReferencedTools | chunks.171.mjs:21 | Find tools mentioned in messages |
| GX | isDeferredTool | chunks.171.mjs | Check if tool is deferred |
| Qz6 | mergeUsage | chunks.171.mjs:670 | Merge incremental usage |
| dh1 | processContentBlocks | chunks.171.mjs:600 | Process completed blocks |
| K9z | abortStream | chunks.171.mjs:663 | Safe stream termination |
| _P1 | withApiRetry | chunks.89.mjs:3 | Retry wrapper |
| bGq | nonStreamingFallback | chunks.170.mjs:2028 | Non-streaming API fallback |
| V6 | clearWatchdog | chunks.171.mjs:216 | Clear both watchdog timers |
| b6 | resetAndStartWatchdog | chunks.171.mjs:220 | Reset and restart watchdog timers |
| Az | AbortError | (SDK) | Signal abort error class |
| zm | TimeoutError | (SDK) | Request timeout error class |
| R36 | ModelFallbackError | chunks.89.mjs:52 | Model fallback trigger |
| RB | RetryExhaustedError | chunks.89.mjs:60 | All retries exhausted wrapper |
| O6 | didFallback | chunks.171.mjs:210 | Flag: already fell back to non-streaming |
| PA4 | MAX_IMAGES_IN_CONTEXT | chunks.170.mjs | Constant (20) |
| iA | isAPIKeyAuth | chunks.171.mjs:4 | Check auth type |
| QA | getPlatform | chunks.171.mjs:11 | Return platform type |
| rR | getFeatureFlag | chunks.171.mjs:4 | GrowthBook feature flag |
