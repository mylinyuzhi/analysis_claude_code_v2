# Claude Code v2.0.59 - LLM API Calling Mechanism

## Overview

This document provides a comprehensive analysis of the LLM API calling mechanism in Claude Code v2.0.59. The core functionality is implemented through the `streamApiCall` ($E9) async generator function in `chunks.153.mjs`, which handles streaming API requests to the Claude API with sophisticated retry logic, error handling, and response processing.

## Related Symbols

> Complete symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `streamApiCall` ($E9) - Main streaming API request handler
- `withRetry` (t61) - Retry wrapper with exponential backoff
- `createApiClient` (Kq) - Client initialization for providers
- `buildRequestPayload` (U) - Request payload builder
- `processStreamEvent` - Handlers for streaming events
- `applySystemCacheBreakpoints` - Cache control application
- `normalizeMessages` - Message format conversion

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [The streamApiCall Async Generator](#the-streamapicall-async-generator)
3. [Request Payload Structure](#request-payload-structure)
4. [Streaming Response Handling](#streaming-response-handling)
5. [Retry Logic and Error Handling](#retry-logic-and-error-handling)
6. [Event Types and Processing](#event-types-and-processing)
7. [Flow Diagrams](#flow-diagrams)

---

## Core Architecture

### Main Components

The API calling mechanism consists of several interconnected components:

1. **$E9 Function** - Main async generator orchestrating the API call lifecycle
2. **t61 Function** - Retry wrapper with exponential backoff
3. **Kq Function** - Client initialization for different providers
4. **U Function** - Request payload builder
5. **Stream Event Processors** - Handlers for different streaming events

### File Locations

- **Primary API Logic**: `chunks.153.mjs` (lines 3-361)
- **Retry Logic**: `chunks.121.mjs` (lines 1988-2046)
- **Client Creation**: `chunks.88.mjs` (lines 3-105)
- **System Prompts**: `chunks.60.mjs` (lines 465-476)

---

## The streamApiCall Async Generator

```javascript
// ============================================
// streamApiCall - Main streaming LLM API request handler
// Location: chunks.153.mjs:3-361
// ============================================

// ORIGINAL (for source lookup):
async function* $E9(A, Q, B, G, Z, I) {
  // A=messages, Q=systemPrompts, B=maxThinkingTokens, G=tools, Z=abortSignal, I=options
  // ... 358 lines of complex API call logic
}

// READABLE (for understanding):
async function* streamApiCall(
  messages,           // A: Conversation history array
  systemPrompts,      // Q: System prompts array
  maxThinkingTokens,  // B: Extended thinking token budget
  tools,              // G: Available tool definitions
  abortSignal,        // Z: AbortSignal for cancellation
  options             // I: Configuration object
) {
  // 5-phase execution flow (see diagram below)
}

// Mapping: $E9→streamApiCall, A→messages, Q→systemPrompts, B→maxThinkingTokens,
//          G→tools, Z→abortSignal, I→options
```

### Parameters

| Parameter | Obfuscated | Description |
|-----------|------------|-------------|
| `messages` | A | Conversation history array |
| `systemPrompts` | Q | System prompts array |
| `maxThinkingTokens` | B | Budget for extended thinking |
| `tools` | G | Available tool definitions |
| `abortSignal` | Z | AbortSignal for cancellation |
| `options` | I | Configuration object |

### Options Object Structure

```javascript
{
  model: string,                        // Model identifier (e.g., "claude-sonnet-4-5-20250929")
  fallbackModel: string | undefined,    // Fallback model for overload scenarios
  sdkBetas: string[],                   // Beta features to enable
  getToolPermissionContext: () => Promise,
  agents: Agent[],                      // Agent configurations
  mcpTools: Tool[],                     // MCP tool definitions
  isNonInteractiveSession: boolean,
  hasAppendSystemPrompt: boolean,
  enablePromptCaching: boolean,
  temperatureOverride: number,
  maxTokensOverride: number,
  maxOutputTokensOverride: number,
  toolChoice: object,
  extraToolSchemas: object[],
  querySource: string,
  queryTracking: object,
  taskIntensityOverride: string,
  onStreamingFallback: () => void,
  fetchOverride: function,
  agentIdOrSessionId: string
}
```

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Pre-processing                                           │
│    - Check tengu off-switch                                 │
│    - Build tool schemas                                     │
│    - Construct system prompts                               │
│    - Normalize messages                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Client Creation & Request Execution                      │
│    - Create API client (via Kq)                             │
│    - Build request payload (via U)                          │
│    - Execute with retry logic (via t61)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Streaming Response Processing                            │
│    - Process stream events                                  │
│    - Accumulate content blocks                              │
│    - Yield partial results                                  │
│    - Handle stop reasons                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Error Handling & Fallback                                │
│    - Streaming errors → Non-streaming fallback              │
│    - Network errors → Retry with backoff                    │
│    - Overload errors → Fallback model                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Analytics & Cleanup                                      │
│    - Record usage metrics                                   │
│    - Track token consumption                                │
│    - Calculate costs                                        │
└─────────────────────────────────────────────────────────────┘
```

### Pseudocode (Extracted from Source)

Below is a readable transformation of the actual `$E9` function from `chunks.153.mjs`, with descriptive variable names and detailed comments:

```javascript
// ============================================
// streamApiCall - Main Streaming LLM API Request Handler
// Location: chunks.153.mjs:3-361
// Original function: $E9(A, Q, B, G, Z, I)
// ============================================
async function* streamApiCall(
  messages,              // A - Conversation history array
  systemPrompts,         // Q - System prompts array
  maxThinkingTokens,     // B - Extended thinking token budget
  tools,                 // G - Available tool definitions
  abortSignal,           // Z - AbortSignal for cancellation
  options                // I - Configuration object
) {
  // ========================================
  // PHASE 1: PRE-FLIGHT CHECKS
  // ========================================

  // Check tengu off-switch (Opus overload protection)
  if (!isBackstage() &&
      (await getFeatureFlag("tengu-off-switch", { activated: false })).activated &&
      isOpusModel(options.model)) {
    logAnalytics("tengu_off_switch_query", {});
    yield createErrorEvent(
      Error("Opus is experiencing high load, please use /model to switch to Sonnet"),
      options.model
    );
    return;
  }

  // ========================================
  // PHASE 2: MODEL & TOOL PREPARATION
  // ========================================

  // Resolve Bedrock inference profile ARNs to actual model names
  let resolvedModel = (
    getProvider() === "bedrock" && options.model.includes("application-inference-profile")
      ? await resolveBedrockInferenceProfile(options.model) ?? options.model
      : options.model
  );

  logPerformance("query_tool_schema_build_start");

  // Get SDK beta features (e.g., "prompt-caching-2024-07-31")
  let sdkBetas = getBetaFeatures(options.model, options.sdkBetas);

  // Build tool schemas in parallel with permission context
  let toolSchemas = await Promise.all(
    tools.map(tool => buildToolSchema(tool, {
      getToolPermissionContext: options.getToolPermissionContext,
      tools: tools,
      agents: options.agents,
      model: options.model,
      betas: sdkBetas
    }))
  );

  logPerformance("query_tool_schema_build_end");

  // ========================================
  // PHASE 3: SYSTEM PROMPT CONSTRUCTION
  // ========================================

  // Assemble system prompts in order:
  // 1. Core identity (gCB returns "" - identity is in rnA)
  // 2. Session type identity (interactive/SDK/agent)
  // 3. User-provided system prompts
  // 4. MCP tools prompt (if MCP servers configured)
  systemPrompts = [
    getCoreSystemPrompt(),                        // "" (placeholder)
    getSessionTypeIdentity({                      // rnA function
      isNonInteractive: options.isNonInteractiveSession,
      hasAppendSystemPrompt: options.hasAppendSystemPrompt
    }),
    ...systemPrompts,                             // User prompts
    getMCPToolsPrompt(options.mcpTools)           // HE9 function
  ].filter(Boolean);

  // Validate system prompts structure
  validateSystemPrompts(systemPrompts);

  // ========================================
  // PHASE 4: CACHING & MESSAGE NORMALIZATION
  // ========================================

  // Determine if prompt caching should be enabled
  let enableCaching = options.enablePromptCaching ?? shouldEnablePromptCaching(options.model);

  // Apply cache breakpoints to system prompts (all get ephemeral cache_control)
  let systemPromptsWithCache = applySystemCacheBreakpoints(systemPrompts, enableCaching);

  // Check if SDK betas are needed
  let hasBetas = sdkBetas.length > 0;

  // Log pre-normalization state
  logAnalytics("tengu_api_before_normalize", {
    preNormalizedMessageCount: messages.length
  });

  logPerformance("query_message_normalization_start");

  // Normalize messages: convert internal format to API format
  let normalizedMessages = normalizeMessages(messages, tools);

  logPerformance("query_message_normalization_end");

  // Log post-normalization state
  logAnalytics("tengu_api_after_normalize", {
    postNormalizedMessageCount: normalizedMessages.length
  });

  // Track model usage
  trackModelUsage(options.model);

  // ========================================
  // PHASE 5: REQUEST PAYLOAD BUILDER
  // ========================================

  // Pre-calculate metrics for analytics
  let totalPayloadSize = JSON.stringify([
    ...systemPromptsWithCache,
    ...normalizedMessages,
    ...toolSchemas,
    ...(options.extraToolSchemas ?? [])
  ]).length;

  // Send analytics about request (async, non-blocking)
  options.getToolPermissionContext().then(permContext => {
    logQueryAnalytics({
      model: options.model,
      messagesLength: totalPayloadSize,
      temperature: options.temperatureOverride ?? 1,
      betas: hasBetas ? sdkBetas : [],
      permissionMode: permContext.mode,
      querySource: options.querySource,
      queryTracking: options.queryTracking
    });
  });

  // Initialize timing trackers
  let startTimeWithRetries = Date.now();
  let startTime = Date.now();
  let attemptNumber = 0;
  let stream = undefined;

  // Define request payload builder (called on each retry)
  let buildRequestPayload = (retryContext) => {
    // Calculate thinking budget (capped by maxTokensOverride if set)
    let thinkingBudget = retryContext.maxTokensOverride
      ? Math.min(maxThinkingTokens, retryContext.maxTokensOverride - 1)
      : maxThinkingTokens;

    // Get additional headers (for Bedrock)
    let additionalHeaders = getAdditionalHeaders(
      getProvider() === "bedrock" ? getBedrockHeaders(retryContext.model) : []
    );

    // Apply task intensity settings (modifies additionalHeaders in place)
    applyTaskIntensitySettings(
      options.taskIntensityOverride,
      additionalHeaders,
      sdkBetas
    );

    // Configure extended thinking
    let thinkingConfig = maxThinkingTokens > 0 ? {
      budget_tokens: thinkingBudget,
      type: "enabled"
    } : undefined;

    let hasThinking = maxThinkingTokens > 0;

    // Get context management config (automatic context pruning)
    let contextManagement = getContextManagementConfig({ hasThinking });

    // Calculate max output tokens
    let maxOutputTokens = (
      retryContext.maxTokensOverride ||
      options.maxOutputTokensOverride ||
      Math.max(maxThinkingTokens + 1, getDefaultMaxTokens(options.model))
    );

    // Check if caching should be enabled for this specific request
    let enableCachingForRequest = options.enablePromptCaching ?? shouldEnablePromptCaching(retryContext.model);

    return {
      model: normalizeModelName(options.model),
      messages: applyMessageCacheBreakpoints(normalizedMessages, enableCachingForRequest),
      system: systemPromptsWithCache,
      tools: [...toolSchemas, ...(options.extraToolSchemas ?? [])],
      tool_choice: options.toolChoice,
      ...(hasBetas ? { betas: sdkBetas } : {}),
      metadata: getRequestMetadata(),
      max_tokens: maxOutputTokens,
      thinking: thinkingConfig,
      ...(contextManagement && hasBetas && sdkBetas.includes("context-management-beta")
        ? { context_management: contextManagement }
        : {}),
      ...additionalHeaders
    };
  };

  // ========================================
  // PHASE 6: CLIENT CREATION & RETRY WRAPPER
  // ========================================

  // Initialize accumulation arrays for streaming content
  let accumulatedMessages = [];
  let timeToFirstToken = 0;
  let partialMessage = undefined;
  let contentBlocks = [];
  let usage = createEmptyUsage();
  let totalCostUSD = 0;
  let responseHeaders = null;
  let didFallbackToNonStreaming = false;
  let maxTokensUsed = 0;
  let errorOccurred = undefined;
  let stopReason = undefined;

  try {
    logPerformance("query_client_creation_start");

    // Create retry wrapper with exponential backoff
    let retryIterator = createRetryWrapper(
      // Client factory
      () => createApiClient({
        maxRetries: 0,  // Retries handled by wrapper
        model: options.model,
        fetchOverride: options.fetchOverride
      }),
      // Request executor (called on each attempt)
      async (client, attempt, retryContext) => {
        attemptNumber = attempt;
        startTime = Date.now();

        // Build request payload
        let payload = buildRequestPayload(retryContext);

        // Log request being sent (for debugging)
        logRequestPayload(payload, options.querySource);

        // Store max_tokens for analytics
        maxTokensUsed = payload.max_tokens;

        // Execute streaming request
        return client.beta.messages.stream(payload, {
          signal: abortSignal
        });
      },
      // Retry options
      {
        model: options.model,
        fallbackModel: options.fallbackModel,
        maxThinkingTokens: maxThinkingTokens,
        signal: abortSignal
      }
    );

    // Execute retry iterator until we get the stream
    let iteratorResult;
    do {
      iteratorResult = await retryIterator.next();

      // Yield any system messages from retry logic
      if (!(iteratorResult.value instanceof StreamWrapper)) {
        yield iteratorResult.value;
      }
    } while (!iteratorResult.done);

    stream = iteratorResult.value;

    logPerformance("query_client_creation_end");

    // Reset accumulation state
    accumulatedMessages.length = 0;
    timeToFirstToken = 0;
    partialMessage = undefined;
    contentBlocks.length = 0;
    usage = createEmptyUsage();

    logPerformance("query_api_request_sent");

    // ========================================
    // PHASE 7: STREAMING RESPONSE PROCESSING
    // ========================================

    try {
      let firstChunk = true;

      for await (let event of stream) {
        // Handle first chunk
        if (firstChunk) {
          log("Stream started - received first chunk");
          logPerformance("query_first_chunk_received");
          clearStreamingTimeout();
          firstChunk = false;
        }

        switch (event.type) {
          case "message_start": {
            // Store partial message and initial usage
            partialMessage = event.message;
            timeToFirstToken = Date.now() - startTime;
            usage = mergeUsage(usage, event.message.usage);
            break;
          }

          case "content_block_start": {
            // Initialize content block based on type
            switch (event.content_block.type) {
              case "tool_use":
                contentBlocks[event.index] = {
                  ...event.content_block,
                  input: ""  // Will accumulate JSON string
                };
                break;

              case "server_tool_use":
                contentBlocks[event.index] = {
                  ...event.content_block,
                  input: ""
                };
                break;

              case "text":
                contentBlocks[event.index] = {
                  ...event.content_block,
                  text: ""  // Will accumulate text
                };
                break;

              case "thinking":
                contentBlocks[event.index] = {
                  ...event.content_block,
                  thinking: ""  // Will accumulate thinking content
                };
                break;

              default:
                contentBlocks[event.index] = {
                  ...event.content_block
                };
                break;
            }
            break;
          }

          case "content_block_delta": {
            // Get content block at index
            let block = contentBlocks[event.index];

            if (!block) {
              logAnalytics("tengu_streaming_error", {
                error_type: "content_block_not_found_delta",
                part_type: event.type,
                part_index: event.index
              });
              throw RangeError("Content block not found");
            }

            // Accumulate delta based on type
            switch (event.delta.type) {
              case "citations_delta":
                // Currently not processed
                break;

              case "input_json_delta":
                // Accumulate tool input JSON
                if (block.type !== "tool_use" && block.type !== "server_tool_use") {
                  logAnalytics("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_input_json",
                    expected_type: "tool_use",
                    actual_type: block.type
                  });
                  throw Error("Content block is not a input_json block");
                }
                if (typeof block.input !== "string") {
                  logAnalytics("tengu_streaming_error", {
                    error_type: "content_block_input_not_string",
                    input_type: typeof block.input
                  });
                  throw Error("Content block input is not a string");
                }
                block.input += event.delta.partial_json;
                break;

              case "text_delta":
                // Accumulate text
                if (block.type !== "text") {
                  logAnalytics("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_text",
                    expected_type: "text",
                    actual_type: block.type
                  });
                  throw Error("Content block is not a text block");
                }
                block.text += event.delta.text;
                break;

              case "signature_delta":
                // Store thinking signature
                if (block.type !== "thinking") {
                  logAnalytics("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_thinking_signature",
                    expected_type: "thinking",
                    actual_type: block.type
                  });
                  throw Error("Content block is not a thinking block");
                }
                block.signature = event.delta.signature;
                break;

              case "thinking_delta":
                // Accumulate thinking content
                if (block.type !== "thinking") {
                  logAnalytics("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_thinking_delta",
                    expected_type: "thinking",
                    actual_type: block.type
                  });
                  throw Error("Content block is not a thinking block");
                }
                block.thinking += event.delta.thinking;
                break;
            }
            break;
          }

          case "content_block_stop": {
            // Get completed block
            let block = contentBlocks[event.index];

            if (!block) {
              logAnalytics("tengu_streaming_error", {
                error_type: "content_block_not_found_stop",
                part_type: event.type,
                part_index: event.index
              });
              throw RangeError("Content block not found");
            }

            if (!partialMessage) {
              logAnalytics("tengu_streaming_error", {
                error_type: "partial_message_not_found",
                part_type: event.type
              });
              throw Error("Message not found");
            }

            // Create complete assistant message
            let assistantMessage = {
              message: {
                ...partialMessage,
                content: transformContentBlocks([block], tools, options.agentIdOrSessionId)
              },
              requestId: stream.request_id ?? undefined,
              type: "assistant",
              uuid: generateUUID(),
              timestamp: new Date().toISOString()
            };

            accumulatedMessages.push(assistantMessage);
            yield assistantMessage;
            break;
          }

          case "message_delta": {
            // Merge usage statistics
            usage = mergeUsage(usage, event.usage);
            stopReason = event.delta.stop_reason;

            // Calculate cost
            let costForThisModel = calculateCost(resolvedModel, usage);
            trackCostMetrics(costForThisModel, usage, options.model);
            totalCostUSD += costForThisModel;

            // Check for stop reason warnings
            let stopReasonWarning = getStopReasonWarning(event.delta.stop_reason, options.model);
            if (stopReasonWarning) {
              yield stopReasonWarning;
            }

            // Handle max_tokens
            if (stopReason === "max_tokens") {
              logAnalytics("tengu_max_tokens_reached", {
                max_tokens: maxTokensUsed
              });
              yield createSystemMessage({
                content: `API Error: Claude's response exceeded the ${maxTokensUsed} output token maximum. ` +
                         `To configure this behavior, set the CLAUDE_CODE_MAX_OUTPUT_TOKENS environment variable.`
              });
            }

            // Handle context window exceeded
            if (stopReason === "model_context_window_exceeded") {
              logAnalytics("tengu_context_window_exceeded", {
                max_tokens: maxTokensUsed,
                output_tokens: usage.output_tokens
              });
              yield createSystemMessage({
                content: "API Error: The model has reached its context window limit."
              });
            }
            break;
          }

          case "message_stop":
            // Stream completed successfully
            break;
        }

        // Always yield raw stream event for monitoring
        yield {
          type: "stream_event",
          event: event
        };
      }

      // Extract response headers
      let responseWithHeaders = await stream.withResponse();
      processRateLimitHeaders(responseWithHeaders.response.headers);
      responseHeaders = responseWithHeaders.response.headers;

    } catch (streamingError) {
      // ========================================
      // PHASE 8: NON-STREAMING FALLBACK
      // ========================================

      // If user aborted, don't fallback
      if (streamingError instanceof AbortError) {
        if (abortSignal.aborted) {
          log(`Streaming aborted by user: ${
            streamingError instanceof Error ? streamingError.message : String(streamingError)
          }`);
          throw streamingError;
        } else {
          log(`Streaming timeout (SDK abort): ${streamingError.message}`, { level: "error" });
          throw new TimeoutError({ message: "Request timed out" });
        }
      }

      // Log fallback
      log(`Error streaming, falling back to non-streaming mode: ${
        streamingError instanceof Error ? streamingError.message : String(streamingError)
      }`, { level: "error" });

      didFallbackToNonStreaming = true;

      if (options.onStreamingFallback) {
        options.onStreamingFallback();
      }

      logAnalytics("tengu_streaming_fallback_to_non_streaming", {
        model: options.model,
        error: streamingError instanceof Error ? streamingError.name : String(streamingError),
        attemptNumber: attemptNumber,
        maxOutputTokens: maxTokensUsed,
        maxThinkingTokens: maxThinkingTokens
      });

      // Create new retry iterator for non-streaming
      let nonStreamingRetryIterator = createRetryWrapper(
        () => createApiClient({
          maxRetries: 0,
          model: options.model
        }),
        async (client, attempt, retryContext) => {
          attemptNumber = attempt;

          let payload = buildRequestPayload(retryContext);
          logRequestPayload(payload, options.querySource);
          maxTokensUsed = payload.max_tokens;

          // Limit max_tokens for non-streaming (21333 token limit)
          let limitedPayload = limitMaxTokensForNonStreaming(payload, 21333);

          // Execute non-streaming request
          return await client.beta.messages.create({
            ...limitedPayload,
            model: normalizeModelName(limitedPayload.model),
            temperature: options.temperatureOverride ?? 1
          });
        },
        {
          model: options.model,
          maxThinkingTokens: maxThinkingTokens,
          signal: abortSignal
        }
      );

      // Execute non-streaming retry iterator
      let nonStreamingResult;
      do {
        nonStreamingResult = await nonStreamingRetryIterator.next();
        if (nonStreamingResult.value.type === "system") {
          yield nonStreamingResult.value;
        }
      } while (!nonStreamingResult.done);

      // Transform non-streaming response to assistant message
      let assistantMessage = {
        message: {
          ...nonStreamingResult.value,
          content: transformContentBlocks(
            nonStreamingResult.value.content,
            tools,
            options.agentIdOrSessionId
          )
        },
        requestId: stream?.request_id ?? undefined,
        type: "assistant",
        uuid: generateUUID(),
        timestamp: new Date().toISOString()
      };

      accumulatedMessages.push(assistantMessage);
      yield assistantMessage;
    }

  } catch (fatalError) {
    // ========================================
    // PHASE 9: ERROR HANDLING
    // ========================================

    log(`Error in non-streaming fallback: ${
      fatalError instanceof Error ? fatalError.message : String(fatalError)
    }`, { level: "error" });

    let actualError = fatalError;
    let modelWithError = options.model;

    // Unwrap retry errors
    if (fatalError instanceof RetryError) {
      actualError = fatalError.originalError;
      modelWithError = fatalError.retryContext.model;
    }

    // Process API errors
    if (actualError instanceof APIError) {
      processApiError(actualError);
    }

    // Extract request ID
    let requestId = (
      stream?.request_id ||
      (actualError instanceof APIError ? actualError.requestID : undefined) ||
      (actualError instanceof APIError ? actualError.error?.request_id : undefined)
    );

    // Log error metrics
    logErrorMetrics({
      error: actualError,
      model: modelWithError,
      messageCount: normalizedMessages.length,
      messageTokens: countTokens(normalizedMessages),
      durationMs: Date.now() - startTime,
      durationMsIncludingRetries: Date.now() - startTimeWithRetries,
      attempt: attemptNumber,
      requestId: requestId,
      didFallBackToNonStreaming: didFallbackToNonStreaming,
      queryTracking: options.queryTracking
    });

    // If user aborted, clean up and return
    if (actualError instanceof AbortError) {
      cleanupStream(stream);
      return;
    }

    // Yield error message to user
    yield createErrorSystemMessage(actualError, modelWithError, {
      messages: messages,
      messagesForAPI: normalizedMessages
    });

    cleanupStream(stream);
    return;
  }

  // ========================================
  // PHASE 10: SUCCESS METRICS & CLEANUP
  // ========================================

  options.getToolPermissionContext().then(permContext => {
    logSuccessMetrics({
      model: accumulatedMessages[0]?.message.model ?? partialMessage?.model ?? options.model,
      preNormalizedModel: options.model,
      usage: usage,
      start: startTime,
      startIncludingRetries: startTimeWithRetries,
      attempt: attemptNumber,
      messageCount: normalizedMessages.length,
      messageTokens: countTokens(normalizedMessages),
      requestId: stream?.request_id ?? null,
      stopReason: stopReason,
      ttftMs: timeToFirstToken,
      didFallBackToNonStreaming: didFallbackToNonStreaming,
      querySource: options.querySource,
      headers: responseHeaders,
      costUSD: totalCostUSD,
      queryTracking: options.queryTracking,
      permissionMode: permContext.mode
    });
  });

  cleanupStream(stream);
}

// ============================================
// cleanupStream - Abort stream if still active
// Location: chunks.153.mjs:363-368
// Original function: UK0(A)
// ============================================
function cleanupStream(stream) {
  if (!stream) return;

  try {
    if (!stream.ended && !stream.aborted) {
      stream.abort();
    }
  } catch {}
}

// ============================================
// mergeUsage - Merge usage statistics from streaming events
// Location: chunks.153.mjs:370-386
// Original function: ljA(A, Q)
// ============================================
function mergeUsage(accumulated, newUsage) {
  return {
    input_tokens: (
      newUsage.input_tokens !== null && newUsage.input_tokens > 0
        ? newUsage.input_tokens
        : accumulated.input_tokens
    ),
    cache_creation_input_tokens: (
      newUsage.cache_creation_input_tokens !== null && newUsage.cache_creation_input_tokens > 0
        ? newUsage.cache_creation_input_tokens
        : accumulated.cache_creation_input_tokens
    ),
    cache_read_input_tokens: (
      newUsage.cache_read_input_tokens !== null && newUsage.cache_read_input_tokens > 0
        ? newUsage.cache_read_input_tokens
        : accumulated.cache_read_input_tokens
    ),
    output_tokens: newUsage.output_tokens ?? accumulated.output_tokens,
    server_tool_use: {
      web_search_requests: (
        newUsage.server_tool_use?.web_search_requests ??
        accumulated.server_tool_use.web_search_requests
      ),
      web_fetch_requests: (
        newUsage.server_tool_use?.web_fetch_requests ??
        accumulated.server_tool_use.web_fetch_requests
      )
    },
    service_tier: accumulated.service_tier,
    cache_creation: {
      ephemeral_1h_input_tokens: (
        newUsage.cache_creation?.ephemeral_1h_input_tokens ??
        accumulated.cache_creation.ephemeral_1h_input_tokens
      ),
      ephemeral_5m_input_tokens: (
        newUsage.cache_creation?.ephemeral_5m_input_tokens ??
        accumulated.cache_creation.ephemeral_5m_input_tokens
      )
    }
  };
}

// ============================================
// applyMessageCacheBreakpoints - Add cache control to messages
// Location: chunks.153.mjs:406-413
// Original function: mv3(A, Q)
// ============================================
function applyMessageCacheBreakpoints(messages, enableCaching) {
  logAnalytics("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled: enableCaching
  });

  return messages.map((message, index) => {
    // Only cache messages NOT in the last 3
    let shouldCache = index <= messages.length - 3;

    if (message.type === "user") {
      return applyUserMessageCaching(message, shouldCache, enableCaching);
    } else {
      return applyAssistantMessageCaching(message, shouldCache, enableCaching);
    }
  });
}

// ============================================
// applySystemCacheBreakpoints - Add cache control to system prompts
// Location: chunks.153.mjs:415-423
// Original function: dv3(A, Q)
// ============================================
function applySystemCacheBreakpoints(systemPrompts, enableCaching) {
  return flattenSystemPrompts(systemPrompts).map(text => ({
    type: "text",
    text: text,
    ...(enableCaching ? { cache_control: createEphemeralCacheControl() } : {})
  }));
}

// ============================================
// getDefaultMaxTokens - Calculate default max output tokens
// Location: chunks.153.mjs:478-493
// Original function: UQ0(A)
// ============================================
function getDefaultMaxTokens(model) {
  let modelLower = model.toLowerCase();
  let defaultMax;

  // Model-specific defaults
  if (modelLower.includes("3-5")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-opus")) {
    defaultMax = 4096;
  } else if (modelLower.includes("claude-3-sonnet")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-haiku")) {
    defaultMax = 4096;
  } else if (modelLower.includes("opus-4-5")) {
    defaultMax = 64000;
  } else if (modelLower.includes("opus-4")) {
    defaultMax = 32000;
  } else if (modelLower.includes("sonnet-4") || modelLower.includes("haiku-4")) {
    defaultMax = 64000;
  } else {
    defaultMax = 32000;
  }

  // Check environment variable override
  let envValidation = validateEnvVar(process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS);

  if (envValidation.status === "capped") {
    log(`CLAUDE_CODE_MAX_OUTPUT_TOKENS ${envValidation.message}`);
  } else if (envValidation.status === "invalid") {
    log(`CLAUDE_CODE_MAX_OUTPUT_TOKENS ${envValidation.message}`);
  }

  return Math.min(envValidation.effective, defaultMax);
}
```

---

## Request Payload Structure

### Complete Request Object

```javascript
{
  // Required fields
  model: "claude-sonnet-4-5-20250929",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Hello" }
      ]
    }
  ],
  max_tokens: 64000,

  // System prompts with caching
  system: [
    {
      type: "text",
      text: "You are Claude Code, Anthropic's official CLI for Claude.",
      cache_control: { type: "ephemeral" }
    }
  ],

  // Tools
  tools: [
    {
      name: "Read",
      description: "Reads a file from the local filesystem...",
      input_schema: {
        type: "object",
        properties: {
          file_path: { type: "string", description: "..." }
        },
        required: ["file_path"]
      }
    }
  ],

  // Optional fields
  tool_choice: { type: "auto" },

  // Extended thinking configuration
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },

  // Beta features
  betas: [
    "prompt-caching-2024-07-31",
    "pdfs-2024-09-25",
    "extended-thinking-2025-01-24"
  ],

  // Context management (automatic context pruning)
  context_management: {
    type: "enabled",
    max_context_tokens: 800000
  },

  // Metadata
  metadata: {
    user_id: "..."
  }
}
```

### Key Request Components

#### 1. Model Selection

```javascript
// Model name normalization (removes [1m] suffix)
function normalizeModelName(model) {
  return model.replace(/\[1m\]/gi, "");
}

// Example:
"sonnet[1m]" → "claude-sonnet-4-5-20250929"
```

#### 2. Message Formatting with Cache Breakpoints

```javascript
function applyCacheBreakpoints(messages, enableCaching) {
  return messages.map((message, index) => {
    // Only apply cache control to messages NOT in the last 3
    let shouldCache = index <= messages.length - 3 && enableCaching;

    if (message.role === "user") {
      return {
        ...message,
        content: message.content.map(block => ({
          ...block,
          ...(shouldCache ? { cache_control: { type: "ephemeral" } } : {})
        }))
      };
    }

    return message;
  });
}
```

#### 3. System Prompts Construction

```javascript
// System prompts are built in order:
systemPrompts = [
  getCoreSystemPrompt(),           // "You are Claude Code..."
  getSessionTypePrompt(options),   // Context-specific prompt
  ...userProvidedPrompts,          // From Q parameter
  getMCPToolsPrompt(mcpTools)      // MCP tool descriptions
].filter(Boolean);

// Core system prompts:
// - Interactive: "You are Claude Code, Anthropic's official CLI for Claude."
// - Non-interactive (with append): "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
// - Non-interactive (agent): "You are a Claude agent, built on Anthropic's Claude Agent SDK."
// - Vertex: "You are Claude Code, Anthropic's official CLI for Claude."
```

#### 4. Max Tokens Calculation

```javascript
function getDefaultMaxTokens(model) {
  let modelLower = model.toLowerCase();
  let defaultMax;

  if (modelLower.includes("3-5")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-opus")) {
    defaultMax = 4096;
  } else if (modelLower.includes("claude-3-sonnet")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-haiku")) {
    defaultMax = 4096;
  } else if (modelLower.includes("opus-4-5")) {
    defaultMax = 64000;
  } else if (modelLower.includes("opus-4")) {
    defaultMax = 32000;
  } else if (modelLower.includes("sonnet-4") || modelLower.includes("haiku-4")) {
    defaultMax = 64000;
  } else {
    defaultMax = 32000;
  }

  // Check environment variable override (with validation)
  let envOverride = parseInt(process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS);
  if (envOverride) {
    return Math.min(envOverride, defaultMax);
  }

  return defaultMax;
}
```

#### 5. Thinking Configuration

```javascript
// Extended thinking budget
let thinkingBudget = maxThinkingTokens > 0 ? {
  budget_tokens: Math.min(
    maxThinkingTokens,
    maxOutputTokens - 1  // Reserve 1 token for response
  ),
  type: "enabled"
} : undefined;
```

---

## Streaming Response Handling

### Stream Event Types

Claude Code processes the following streaming event types:

| Event Type | Description | Action |
|------------|-------------|--------|
| `message_start` | Stream begins | Store partial message, update usage |
| `content_block_start` | New content block | Initialize block at index |
| `content_block_delta` | Incremental content | Accumulate text/JSON/thinking |
| `content_block_stop` | Block completed | Yield assistant message |
| `message_delta` | Message metadata update | Update usage, check stop reason |
| `message_stop` | Stream ends | Finalize response |

### Event Processing Flow

```
Stream Start
     ↓
message_start → Store message metadata, usage
     ↓
content_block_start[0] → Initialize block { type: "text", text: "" }
     ↓
content_block_delta[0] → Accumulate: text += "Hello"
content_block_delta[0] → Accumulate: text += " world"
     ↓
content_block_stop[0] → Yield complete assistant message
     ↓
content_block_start[1] → Initialize block { type: "tool_use", input: "" }
     ↓
content_block_delta[1] → Accumulate: input += '{"file'
content_block_delta[1] → Accumulate: input += '_path"'
     ↓
content_block_stop[1] → Yield assistant message with tool use
     ↓
message_delta → Update final usage, stop_reason
     ↓
message_stop → Stream complete
```

### Code Example

```javascript
// Content block initialization
case "content_block_start":
  switch (event.content_block.type) {
    case "tool_use":
      contentBlocks[event.index] = {
        ...event.content_block,
        input: ""  // Will accumulate JSON string
      };
      break;

    case "text":
      contentBlocks[event.index] = {
        ...event.content_block,
        text: ""  // Will accumulate text
      };
      break;

    case "thinking":
      contentBlocks[event.index] = {
        ...event.content_block,
        thinking: ""  // Will accumulate thinking content
      };
      break;
  }
  break;

// Content accumulation
case "content_block_delta":
  let block = contentBlocks[event.index];

  switch (event.delta.type) {
    case "text_delta":
      if (block.type !== "text") throw Error("Type mismatch");
      block.text += event.delta.text;
      break;

    case "input_json_delta":
      if (block.type !== "tool_use") throw Error("Type mismatch");
      block.input += event.delta.partial_json;
      break;

    case "thinking_delta":
      if (block.type !== "thinking") throw Error("Type mismatch");
      block.thinking += event.delta.thinking;
      break;

    case "signature_delta":
      if (block.type !== "thinking") throw Error("Type mismatch");
      block.signature = event.delta.signature;
      break;
  }
  break;

// Block completion
case "content_block_stop":
  let completedBlock = contentBlocks[event.index];
  let assistantMessage = {
    message: {
      ...partialMessage,
      content: transformContent([completedBlock], tools, sessionId)
    },
    requestId: stream.request_id,
    type: "assistant",
    uuid: generateUUID(),
    timestamp: new Date().toISOString()
  };

  yield assistantMessage;
  break;
```

### Stop Reasons

```javascript
case "message_delta":
  usage = mergeUsage(usage, event.usage);
  stopReason = event.delta.stop_reason;

  // Handle special cases
  if (stopReason === "max_tokens") {
    yield systemMessage({
      content: `Claude's response exceeded the ${maxTokens} output token maximum.`
    });
  }

  if (stopReason === "model_context_window_exceeded") {
    yield systemMessage({
      content: "The model has reached its context window limit."
    });
  }

  // Possible stop reasons:
  // - "end_turn" - Natural completion
  // - "max_tokens" - Output limit reached
  // - "stop_sequence" - Stop sequence encountered
  // - "tool_use" - Model wants to use a tool
  // - "model_context_window_exceeded" - Context limit reached
  break;
```

---

## Retry Logic and Error Handling

### The t61 Retry Wrapper (Extracted from Source)

Below is the actual retry logic from `chunks.121.mjs:1988-2047`, transformed for readability:

```javascript
// ============================================
// createRetryWrapper - Exponential backoff retry wrapper
// Location: chunks.121.mjs:1988-2047
// Original function: async function* t61(A, Q, B)
// ============================================
async function* createRetryWrapper(
  clientFactory,     // A - Function that creates API client
  executeRequest,    // Q - Function that executes the request
  options            // B - { model, fallbackModel, maxThinkingTokens, signal }
) {
  // Get maximum number of retries (from environment or default)
  let maxRetries = getMaxRetries(options);

  // Initialize retry context
  let retryContext = {
    model: options.model,
    maxThinkingTokens: options.maxThinkingTokens
  };

  let client = null;
  let overloadCount = 0;
  let lastError;

  // Retry loop: attempt 1 through maxRetries+1
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    // Check if user aborted
    if (options.signal?.aborted) {
      throw new AbortError();
    }

    try {
      // ========================================
      // CLIENT CREATION/REFRESH
      // ========================================

      // Create new client if:
      // 1. First attempt (client === null)
      // 2. Previous error was 401 (auth failure)
      // 3. Bedrock credentials need refresh
      if (client === null ||
          (lastError instanceof APIError && lastError.status === 401) ||
          needsBedrockRefresh(lastError)) {
        client = await clientFactory();
      }

      // ========================================
      // EXECUTE REQUEST
      // ========================================

      // Execute request and return result on success
      return await executeRequest(client, attempt, retryContext);

    } catch (error) {
      lastError = error;

      // ========================================
      // OVERLOAD ERROR HANDLING (529)
      // ========================================

      // Check if error is 529 overload or overloaded_error type
      if (isOverloadError(error) &&
          (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !isBackstage() && isOpusModel(options.model))) {

        overloadCount++;

        // After 3 overload errors, trigger fallback
        if (overloadCount >= OVERLOAD_THRESHOLD) {  // OVERLOAD_THRESHOLD = 3
          if (options.fallbackModel) {
            // Log fallback trigger
            logAnalytics("tengu_api_opus_fallback_triggered", {
              original_model: options.model,
              fallback_model: options.fallbackModel,
              provider: getProvider()
            });

            // Throw fallback error (will trigger model switch)
            throw new FallbackToModelError(options.model, options.fallbackModel);
          }

          // In production (not sandbox), show custom overload message
          if (!process.env.IS_SANDBOX) {
            logAnalytics("tengu_api_custom_529_overloaded_error", {});
            throw new RetryError(
              Error("Opus is experiencing high load, please use /model to switch to Sonnet"),
              retryContext
            );
          }
        }
      }

      // ========================================
      // MAX RETRIES CHECK
      // ========================================

      // If we've exhausted all retries, throw error
      if (attempt > maxRetries) {
        throw new RetryError(error, retryContext);
      }

      // ========================================
      // RETRYABILITY CHECK
      // ========================================

      // Check if error is retryable
      // - Must pass needsBedrockRefresh OR be retryable HTTP status
      if (!needsBedrockRefresh(error) &&
          (!(error instanceof APIError) || !shouldRetryOnStatus(error))) {
        throw new RetryError(error, retryContext);
      }

      // ========================================
      // CONTEXT WINDOW OVERFLOW ADJUSTMENT
      // ========================================

      // Special handling for "input length and max_tokens exceed context limit" errors
      if (error instanceof APIError) {
        let contextOverflow = parseContextOverflowError(error);

        if (contextOverflow) {
          let { inputTokens, contextLimit } = contextOverflow;

          // Reserve 1000 tokens as buffer
          let buffer = 1000;
          let availableForOutput = Math.max(0, contextLimit - inputTokens - buffer);

          // Check if we have minimum viable token count
          if (availableForOutput < FLOOR_OUTPUT_TOKENS) {  // FLOOR_OUTPUT_TOKENS = 3000
            logError(Error(
              `availableContext ${availableForOutput} is less than FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`
            ));
            throw error;
          }

          // Calculate required tokens
          let minRequired = (retryContext.maxThinkingTokens || 0) + 1;
          let adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, availableForOutput, minRequired);

          // Set override for next attempt
          retryContext.maxTokensOverride = adjustedMaxTokens;

          // Log adjustment
          logAnalytics("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens: inputTokens,
            contextLimit: contextLimit,
            adjustedMaxTokens: adjustedMaxTokens,
            attempt: attempt
          });

          // Continue to next retry with adjusted tokens
          continue;
        }
      }

      // ========================================
      // EXPONENTIAL BACKOFF CALCULATION
      // ========================================

      // Check for retry-after header
      let retryAfterHeader = getRetryAfterHeader(error);

      // Calculate delay
      let delayMs = calculateBackoffDelay(attempt, retryAfterHeader);

      // ========================================
      // YIELD RETRY MESSAGE
      // ========================================

      // If this is an API error, yield a system message to inform user
      if (error instanceof APIError) {
        yield createRetrySystemMessage(error, delayMs, attempt, maxRetries);
      }

      // Log retry analytics
      logAnalytics("tengu_api_retry", {
        attempt: attempt,
        delayMs: delayMs,
        error: error.message,
        status: error.status,
        provider: getProvider()
      });

      // ========================================
      // SLEEP BEFORE RETRY
      // ========================================

      // Wait before retrying (respects abort signal)
      await sleep(delayMs, options.signal);
    }
  }

  // If we get here, all retries failed
  throw new RetryError(lastError, retryContext);
}

// ============================================
// Helper Functions
// ============================================

// Get retry-after header value
// Location: chunks.121.mjs:2049-2051
// Original function: Ch5(A)
function getRetryAfterHeader(error) {
  return (error.headers?.["retry-after"] || error.headers?.get?.("retry-after")) ?? null;
}

// Calculate exponential backoff delay
// Location: chunks.121.mjs:2053-2061
// Original function: Eh5(A, Q)
function calculateBackoffDelay(attemptNumber, retryAfterHeader) {
  // If server provided retry-after, use it
  if (retryAfterHeader) {
    let seconds = parseInt(retryAfterHeader, 10);
    if (!isNaN(seconds)) {
      return seconds * 1000;  // Convert to milliseconds
    }
  }

  // Otherwise use exponential backoff with jitter
  let baseDelay = 500;  // 500ms initial delay (Hh5 constant)
  let exponentialDelay = Math.min(
    baseDelay * Math.pow(2, attemptNumber - 1),
    32000  // Max 32 seconds
  );

  // Add random jitter (0-25% of delay)
  let jitter = Math.random() * 0.25 * exponentialDelay;

  return exponentialDelay + jitter;
}

// Parse context overflow error message
// Location: chunks.121.mjs:2063-2082
// Original function: Zj2(A)
function parseContextOverflowError(error) {
  // Must be 400 error
  if (error.status !== 400 || !error.message) {
    return;
  }

  // Must match specific error message pattern
  if (!error.message.includes("input length and `max_tokens` exceed context limit")) {
    return;
  }

  // Parse token values from error message
  // Pattern: "input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)"
  let regex = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/;
  let match = error.message.match(regex);

  if (!match || match.length !== 4) {
    return;
  }

  if (!match[1] || !match[2] || !match[3]) {
    logError(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
    return;
  }

  let inputTokens = parseInt(match[1], 10);
  let maxTokens = parseInt(match[2], 10);
  let contextLimit = parseInt(match[3], 10);

  if (isNaN(inputTokens) || isNaN(maxTokens) || isNaN(contextLimit)) {
    return;
  }

  return {
    inputTokens: inputTokens,
    maxTokens: maxTokens,
    contextLimit: contextLimit
  };
}

// Check if error is overload (529 or overloaded_error type)
// Location: chunks.121.mjs:2084-2087
// Original function: zh5(A)
function isOverloadError(error) {
  if (!(error instanceof APIError)) {
    return false;
  }

  return (
    error.status === 529 ||
    (error.message?.includes('"type":"overloaded_error"') ?? false)
  );
}

// Check if Bedrock credentials need refresh
// Location: chunks.121.mjs:2089-2094
// Original function: Ij2(A)
function needsBedrockRefresh(error) {
  // Only applies to Bedrock provider
  if (isUsingBedrock(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    // Check for specific Bedrock auth errors
    if (isBedrockAuthError(error) || (error instanceof APIError && error.status === 403)) {
      return true;
    }
  }

  return false;
}

// Check if error should be handled as Bedrock refresh
// Location: chunks.121.mjs:2096-2099
// Original function: Uh5(A)
function needsBedrockRefresh(error) {
  if (needsBedrockRefresh(error)) {
    refreshBedrockCredentials();
    return true;
  }

  return false;
}

// Check if HTTP status code is retryable
// Location: Inferred from context
// Original function: $h5(A)
function shouldRetryOnStatus(error) {
  // Check x-should-retry header first
  let shouldRetryHeader = error.headers?.get("x-should-retry");
  if (shouldRetryHeader === "true") return true;
  if (shouldRetryHeader === "false") return false;

  // No status = not retryable
  if (!error.status) return false;

  // Retryable status codes:
  // 401 - Unauthorized (refresh auth)
  // 408 - Request timeout
  // 409 - Conflict
  // 429 - Rate limit (if not in sandbox)
  // 5xx - Server errors
  if (error.status === 401) return true;
  if (error.status === 408) return true;
  if (error.status === 409) return true;
  if (error.status === 429) return true;  // Handled separately for sandbox
  if (error.status >= 500) return true;

  return false;
}

// Sleep with abort signal support
// Location: chunks.121.mjs:1964-1982
// Original function: Gj2(A, Q)
async function sleep(durationMs, abortSignal) {
  await new Promise((resolve, reject) => {
    let timeout = setTimeout(resolve, durationMs);

    if (abortSignal) {
      let abortHandler = () => {
        clearTimeout(timeout);
        reject(new AbortError());
      };

      // If already aborted, reject immediately
      if (abortSignal.aborted) {
        abortHandler();
        return;
      }

      // Listen for abort event
      abortSignal.addEventListener("abort", abortHandler, { once: true });

      // Clean up listener after timeout
      setTimeout(() => {
        abortSignal?.removeEventListener("abort", abortHandler);
      }, durationMs);
    }
  });
}
```

### Retry Configuration

```javascript
// Default retry settings
const MAX_RETRIES = 10;                    // From CLAUDE_CODE_MAX_RETRIES or default
const BASE_DELAY_MS = 500;                 // Initial backoff delay
const MAX_DELAY_MS = 32000;                // Maximum backoff delay
const BACKOFF_MULTIPLIER = 2;              // Exponential multiplier
const JITTER_FACTOR = 0.25;                // Random jitter (25%)
const OVERLOAD_THRESHOLD = 3;              // Overload errors before fallback
const MIN_OUTPUT_TOKENS = 3000;            // Minimum viable token count
const CONTEXT_BUFFER = 1000;               // Reserved tokens for safety
```

### Retryable Error Conditions

```javascript
function isRetryable(error) {
  // Bedrock credential refresh needed
  if (needsBedrockRefresh(error)) {
    return true;
  }

  // Overload errors (with special handling)
  if (error.message?.includes('"type":"overloaded_error"')) {
    return true;
  }

  // Context overflow (with token adjustment)
  if (parseContextOverflow(error)) {
    return true;
  }

  // Header-based retry signal
  let shouldRetry = error.headers?.get("x-should-retry");
  if (shouldRetry === "true") return true;
  if (shouldRetry === "false") return false;

  // Connection errors
  if (error instanceof ConnectionError) {
    return true;
  }

  // HTTP status codes
  if (!error.status) return false;

  if (error.status === 401) return true;  // Auth refresh
  if (error.status === 408) return true;  // Request timeout
  if (error.status === 409) return true;  // Conflict
  if (error.status === 429) return true;  // Rate limit (non-sandbox)
  if (error.status >= 500) return true;   // Server errors

  return false;
}
```

### Non-Streaming Fallback

When streaming fails, Claude Code falls back to non-streaming mode:

```javascript
catch (streamError) {
  if (streamError instanceof AbortError && signal.aborted) {
    throw streamError;  // User cancelled - don't fallback
  }

  logError("Streaming error, falling back to non-streaming mode");
  options.onStreamingFallback?.();

  // Create new retry iterator for non-streaming
  let nonStreamingIterator = withRetry(
    () => createClient({ maxRetries: 0, model: options.model }),
    async (client, attempt, retryContext) => {
      let payload = buildRequestPayload(retryContext);

      // Use messages.create instead of messages.stream
      return await client.beta.messages.create({
        ...payload,
        temperature: options.temperatureOverride || 1
      });
    },
    {
      model: options.model,
      maxThinkingTokens: maxThinkingTokens,
      signal: signal
    }
  );

  // Execute non-streaming request
  let result;
  do {
    result = await nonStreamingIterator.next();
    if (result.value.type === "system") {
      yield result.value;
    }
  } while (!result.done);

  let message = result.value;
  yield transformToAssistantMessage(message);
}
```

---

## Event Types and Processing

### Complete Event Type Reference

#### 1. message_start

**Structure:**
```javascript
{
  type: "message_start",
  message: {
    id: "msg_01...",
    type: "message",
    role: "assistant",
    content: [],
    model: "claude-sonnet-4-5-20250929",
    stop_reason: null,
    stop_sequence: null,
    usage: {
      input_tokens: 1523,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
      output_tokens: 0
    }
  }
}
```

**Processing:**
```javascript
case "message_start":
  partialMessage = event.message;
  usage = mergeUsage(usage, event.message.usage);
  timeToFirstToken = Date.now() - requestStartTime;
  break;
```

#### 2. content_block_start

**Structure:**
```javascript
// Text block
{
  type: "content_block_start",
  index: 0,
  content_block: {
    type: "text",
    text: ""
  }
}

// Tool use block
{
  type: "content_block_start",
  index: 1,
  content_block: {
    type: "tool_use",
    id: "toolu_01...",
    name: "Read",
    input: {}
  }
}

// Thinking block
{
  type: "content_block_start",
  index: 0,
  content_block: {
    type: "thinking",
    thinking: ""
  }
}
```

**Processing:**
```javascript
case "content_block_start":
  switch (event.content_block.type) {
    case "tool_use":
    case "server_tool_use":
      contentBlocks[event.index] = {
        ...event.content_block,
        input: ""  // Initialize as empty string for accumulation
      };
      break;

    case "text":
      contentBlocks[event.index] = {
        ...event.content_block,
        text: ""
      };
      break;

    case "thinking":
      contentBlocks[event.index] = {
        ...event.content_block,
        thinking: ""
      };
      break;

    default:
      contentBlocks[event.index] = {
        ...event.content_block
      };
      break;
  }
  break;
```

#### 3. content_block_delta

**Structures:**
```javascript
// Text delta
{
  type: "content_block_delta",
  index: 0,
  delta: {
    type: "text_delta",
    text: "Hello"
  }
}

// Input JSON delta (for tool use)
{
  type: "content_block_delta",
  index: 1,
  delta: {
    type: "input_json_delta",
    partial_json: '{"file_path":'
  }
}

// Thinking delta
{
  type: "content_block_delta",
  index: 0,
  delta: {
    type: "thinking_delta",
    thinking: "Let me think about this..."
  }
}

// Signature delta
{
  type: "content_block_delta",
  index: 0,
  delta: {
    type: "signature_delta",
    signature: "..."
  }
}
```

**Processing:**
```javascript
case "content_block_delta":
  let block = contentBlocks[event.index];

  if (!block) {
    throw RangeError("Content block not found");
  }

  switch (event.delta.type) {
    case "citations_delta":
      // Currently no processing
      break;

    case "input_json_delta":
      if (block.type !== "tool_use" && block.type !== "server_tool_use") {
        throw Error("Content block is not a tool_use block");
      }
      if (typeof block.input !== "string") {
        throw Error("Content block input is not a string");
      }
      block.input += event.delta.partial_json;
      break;

    case "text_delta":
      if (block.type !== "text") {
        throw Error("Content block is not a text block");
      }
      block.text += event.delta.text;
      break;

    case "signature_delta":
      if (block.type !== "thinking") {
        throw Error("Content block is not a thinking block");
      }
      block.signature = event.delta.signature;
      break;

    case "thinking_delta":
      if (block.type !== "thinking") {
        throw Error("Content block is not a thinking block");
      }
      block.thinking += event.delta.thinking;
      break;
  }
  break;
```

#### 4. content_block_stop

**Structure:**
```javascript
{
  type: "content_block_stop",
  index: 0
}
```

**Processing:**
```javascript
case "content_block_stop":
  let block = contentBlocks[event.index];

  if (!block) {
    throw RangeError("Content block not found");
  }

  if (!partialMessage) {
    throw Error("Message not found");
  }

  // Create complete assistant message for this block
  let assistantMessage = {
    message: {
      ...partialMessage,
      content: transformContent([block], tools, agentIdOrSessionId)
    },
    requestId: stream.request_id || undefined,
    type: "assistant",
    uuid: generateUUID(),
    timestamp: new Date().toISOString()
  };

  // Yield to caller
  yield assistantMessage;
  break;
```

#### 5. message_delta

**Structure:**
```javascript
{
  type: "message_delta",
  delta: {
    stop_reason: "end_turn",
    stop_sequence: null
  },
  usage: {
    output_tokens: 523
  }
}
```

**Processing:**
```javascript
case "message_delta":
  usage = mergeUsage(usage, event.usage);
  stopReason = event.delta.stop_reason;

  // Calculate cost
  let costUSD = calculateCost(modelName, usage);
  totalCost += costUSD;

  // Check stop reason and yield warnings if needed
  let warningMessage = getStopReasonWarning(event.delta.stop_reason, options.model);
  if (warningMessage) {
    yield warningMessage;
  }

  // Special handling for max_tokens
  if (stopReason === "max_tokens") {
    yield systemMessage({
      content: `Claude's response exceeded the ${maxTokens} output token maximum.`
    });
  }

  // Special handling for context overflow
  if (stopReason === "model_context_window_exceeded") {
    yield systemMessage({
      content: "The model has reached its context window limit."
    });
  }
  break;
```

#### 6. message_stop

**Structure:**
```javascript
{
  type: "message_stop"
}
```

**Processing:**
```javascript
case "message_stop":
  // Stream has ended - no action needed
  // Final processing happens after the loop
  break;
```

### Usage Tracking

```javascript
// Usage object structure
let usage = {
  input_tokens: 0,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0,
  output_tokens: 0,
  server_tool_use: {
    web_search_requests: 0,
    web_fetch_requests: 0
  },
  service_tier: "default",
  cache_creation: {
    ephemeral_1h_input_tokens: 0,
    ephemeral_5m_input_tokens: 0
  }
};

// Merge usage from events
function mergeUsage(accumulated, newUsage) {
  return {
    input_tokens: newUsage.input_tokens > 0 ?
                  newUsage.input_tokens : accumulated.input_tokens,
    cache_creation_input_tokens: newUsage.cache_creation_input_tokens > 0 ?
                                 newUsage.cache_creation_input_tokens : accumulated.cache_creation_input_tokens,
    cache_read_input_tokens: newUsage.cache_read_input_tokens > 0 ?
                            newUsage.cache_read_input_tokens : accumulated.cache_read_input_tokens,
    output_tokens: newUsage.output_tokens ?? accumulated.output_tokens,
    server_tool_use: {
      web_search_requests: newUsage.server_tool_use?.web_search_requests ??
                          accumulated.server_tool_use.web_search_requests,
      web_fetch_requests: newUsage.server_tool_use?.web_fetch_requests ??
                         accumulated.server_tool_use.web_fetch_requests
    },
    service_tier: accumulated.service_tier,
    cache_creation: {
      ephemeral_1h_input_tokens: newUsage.cache_creation?.ephemeral_1h_input_tokens ??
                                 accumulated.cache_creation.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: newUsage.cache_creation?.ephemeral_5m_input_tokens ??
                                 accumulated.cache_creation.ephemeral_5m_input_tokens
    }
  };
}
```

---

## Flow Diagrams

### Complete API Call Lifecycle

```
┌──────────────────────────────────────────────────────────────────┐
│                        $E9 ENTRY POINT                           │
│  Parameters: messages, systemPrompts, maxThinkingTokens,         │
│              tools, signal, options                              │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    PRE-PROCESSING PHASE                          │
├──────────────────────────────────────────────────────────────────┤
│  1. Check tengu off-switch (Opus overload protection)           │
│  2. Resolve model name (Bedrock inference profiles)             │
│  3. Build tool schemas (with permissions)                       │
│  4. Construct system prompts (core + session type + MCP)        │
│  5. Normalize messages (convert to API format)                  │
│  6. Apply cache breakpoints (last 3 messages excluded)          │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   CLIENT CREATION (Kq)                           │
├──────────────────────────────────────────────────────────────────┤
│  Provider Selection:                                             │
│  • First Party (claude.ai) → Anthropic client                   │
│  • Bedrock → AnthropicBedrock client                            │
│  • Vertex → AnthropicVertex client                              │
│  • Foundry → AnthropicFoundry client                            │
│                                                                  │
│  Configuration:                                                  │
│  • Headers: x-app, User-Agent, auth tokens                      │
│  • Timeout: 600000ms (10 minutes)                               │
│  • Max retries: 0 (handled by t61)                              │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                  RETRY WRAPPER (t61)                             │
├──────────────────────────────────────────────────────────────────┤
│  Attempt 1:                                                      │
│    ├─ Build request payload (U function)                        │
│    ├─ Execute: client.beta.messages.stream(payload)             │
│    └─ Result: Success → Continue to streaming                   │
│                Error → Check if retryable                        │
│                                                                  │
│  If Retryable Error:                                             │
│    ├─ Parse error type (529, 400, 401, 5xx, etc.)               │
│    ├─ Special handling:                                          │
│    │   • 529 (overload): Count, fallback after 3 attempts       │
│    │   • 400 (context): Adjust max_tokens, retry                │
│    │   • 401 (auth): Refresh client, retry                      │
│    ├─ Calculate backoff: min(500 * 2^(attempt-1), 32000) + jitter│
│    ├─ Yield system message: "Retrying in X seconds..."          │
│    ├─ Sleep for backoff duration                                │
│    └─ Attempt 2...N (up to 10 retries)                          │
│                                                                  │
│  After Max Retries:                                              │
│    └─ If fallbackModel: throw FallbackTriggeredError            │
│       Else: throw RetryError                                     │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                  STREAMING RESPONSE LOOP                         │
├──────────────────────────────────────────────────────────────────┤
│  for await (event of stream) {                                  │
│                                                                  │
│    message_start:                                                │
│      ├─ Store partial message                                   │
│      ├─ Record input token usage                                │
│      └─ Calculate time to first token                           │
│                                                                  │
│    content_block_start:                                          │
│      ├─ Identify block type (text/tool_use/thinking)            │
│      └─ Initialize contentBlocks[index]                         │
│                                                                  │
│    content_block_delta:                                          │
│      ├─ Get block at index                                      │
│      ├─ Identify delta type:                                    │
│      │   • text_delta → Accumulate to block.text               │
│      │   • input_json_delta → Accumulate to block.input        │
│      │   • thinking_delta → Accumulate to block.thinking       │
│      │   • signature_delta → Set block.signature               │
│      └─ Validate block type matches delta type                  │
│                                                                  │
│    content_block_stop:                                           │
│      ├─ Get completed block at index                            │
│      ├─ Transform content (parse tool JSON, etc.)               │
│      ├─ Create assistant message object                         │
│      └─ YIELD assistant message to caller                       │
│                                                                  │
│    message_delta:                                                │
│      ├─ Merge output token usage                                │
│      ├─ Store stop_reason                                       │
│      ├─ Calculate cost                                           │
│      └─ Check for special stop reasons:                         │
│          • max_tokens → Yield warning                           │
│          • model_context_window_exceeded → Yield warning        │
│                                                                  │
│    message_stop:                                                 │
│      └─ Stream completed (continue to finalization)             │
│                                                                  │
│    All events:                                                   │
│      └─ YIELD { type: "stream_event", event } for monitoring    │
│  }                                                               │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│              STREAMING ERROR FALLBACK                            │
├──────────────────────────────────────────────────────────────────┤
│  catch (streamError) {                                           │
│                                                                  │
│    If user cancelled (AbortError):                               │
│      └─ Re-throw (don't fallback)                               │
│                                                                  │
│    Else:                                                         │
│      ├─ Log error and trigger fallback callback                 │
│      ├─ Create new retry iterator with:                         │
│      │   client.beta.messages.create (non-streaming)            │
│      ├─ Execute non-streaming request                           │
│      ├─ Transform response to assistant message                 │
│      └─ YIELD assistant message                                 │
│  }                                                               │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│              ANALYTICS & CLEANUP                                 │
├──────────────────────────────────────────────────────────────────┤
│  Success Metrics:                                                │
│    ├─ Record token usage (input, cached, output)                │
│    ├─ Calculate cost in USD                                     │
│    ├─ Record time to first token (TTFT)                         │
│    ├─ Record total duration                                     │
│    ├─ Record attempt count                                      │
│    └─ Record stop reason                                        │
│                                                                  │
│  Cleanup:                                                        │
│    └─ Abort stream if not ended                                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                          RETURN
```

### Retry Logic Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Retry Attempt Loop                       │
│                   (Max 10 attempts)                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
              ┌─────────────────────────┐
              │   Check signal.aborted  │
              │   Yes → Throw AbortError│
              └─────────────────────────┘
                           ↓ No
              ┌─────────────────────────┐
              │  Need client refresh?   │
              │  • First attempt        │
              │  • 401 error            │
              │  • Bedrock cred refresh │
              └─────────────────────────┘
                  ↓ Yes        ↓ No
         ┌────────────────┐     │
         │ Create Client  │     │
         └────────────────┘     │
                  ↓ ←───────────┘
         ┌────────────────────────┐
         │ Execute Request        │
         │ (stream or create)     │
         └────────────────────────┘
                  ↓
         ┌────────────────────────┐
         │      Success?          │
         └────────────────────────┘
               ↓ Yes
         ┌────────────────────────┐
         │ RETURN result          │
         └────────────────────────┘
               ↓ No (Error)
         ┌────────────────────────┐
         │  Is Overload (529)?    │
         └────────────────────────┘
               ↓ Yes
         ┌────────────────────────┐
         │ overloadCount++        │
         │ If count >= 3:         │
         │   Trigger fallback     │
         └────────────────────────┘
               ↓ Continue
         ┌────────────────────────┐
         │ Attempt > Max?         │
         └────────────────────────┘
               ↓ Yes
         ┌────────────────────────┐
         │ THROW RetryError       │
         └────────────────────────┘
               ↓ No
         ┌────────────────────────┐
         │  Is Retryable?         │
         │  • 401, 408, 409, 429  │
         │  • 5xx errors          │
         │  • Connection errors   │
         │  • x-should-retry:true │
         └────────────────────────┘
               ↓ No
         ┌────────────────────────┐
         │ THROW RetryError       │
         └────────────────────────┘
               ↓ Yes
         ┌────────────────────────┐
         │ Context Overflow?      │
         │ (400 + token message)  │
         └────────────────────────┘
               ↓ Yes
         ┌────────────────────────┐
         │ Parse token limits     │
         │ Calculate available    │
         │ Set maxTokensOverride  │
         │ CONTINUE to next try   │
         └────────────────────────┘
               ↓ No
         ┌────────────────────────┐
         │ Get retry-after header │
         │ or calculate backoff:  │
         │ min(500*2^N, 32s)+jitter│
         └────────────────────────┘
               ↓
         ┌────────────────────────┐
         │ Yield retry message    │
         └────────────────────────┘
               ↓
         ┌────────────────────────┐
         │ Sleep(delay)           │
         └────────────────────────┘
               ↓
         ┌────────────────────────┐
         │ LOOP to next attempt   │
         └────────────────────────┘
```

---

## Summary

The Claude Code v2.0.59 API calling mechanism is a sophisticated system with:

1. **Robust Error Handling**: 10 retry attempts with exponential backoff, intelligent error classification, and automatic fallback to non-streaming mode

2. **Advanced Features**:
   - Prompt caching with strategic breakpoints (last 3 messages excluded)
   - Extended thinking with token budgets
   - Context management for large sessions
   - Model fallback for overload scenarios (3 attempts before fallback)
   - Context window overflow auto-adjustment (dynamic max_tokens recalculation)

3. **Multi-Provider Support**: Seamless integration with Anthropic API, AWS Bedrock, Google Vertex AI, and Azure Foundry

4. **Streaming First**: Prioritizes streaming responses for real-time interaction, with graceful degradation to non-streaming

5. **Comprehensive Analytics**: Tracks usage, costs, latency, and provides detailed telemetry

## Key Code Insights

From the source code analysis, we discovered several implementation details not obvious from external documentation:

### 1. System Prompt Assembly
The actual system prompt construction in `$E9` (chunks.153.mjs:20-23):
```javascript
systemPrompts = [
  getCoreSystemPrompt(),    // Returns "" (empty string)
  getSessionTypeIdentity({  // The actual identity prompt
    isNonInteractive: options.isNonInteractiveSession,
    hasAppendSystemPrompt: options.hasAppendSystemPrompt
  }),
  ...systemPrompts,         // User-provided prompts
  getMCPToolsPrompt(options.mcpTools)  // MCP instructions if enabled
].filter(Boolean);
```

### 2. Cache Breakpoint Strategy
Messages are cached with a specific exclusion pattern (chunks.153.mjs:406-413):
- **Only messages NOT in the last 3** get cache_control
- This allows recent context to change without invalidating cache
- Analytics event: `tengu_api_cache_breakpoints`

### 3. Context Overflow Recovery
When hitting context limits, the system automatically recalculates max_tokens (chunks.121.mjs:2022-2031):
```javascript
let buffer = 1000;  // Safety buffer
let availableForOutput = Math.max(0, contextLimit - inputTokens - buffer);
let minRequired = (maxThinkingTokens || 0) + 1;
let adjustedMaxTokens = Math.max(3000, availableForOutput, minRequired);
retryContext.maxTokensOverride = adjustedMaxTokens;
```

### 4. Overload Protection
The "tengu off-switch" provides circuit-breaker functionality:
- Checks feature flag `tengu-off-switch` on every request
- Applies only to Opus models
- Analytics: `tengu_off_switch_query`

### 5. Non-Streaming Fallback Limit
When falling back to non-streaming, max_tokens is capped at **21,333** tokens to prevent timeouts.

### 6. Model-Specific Max Tokens
Default max output tokens by model family (chunks.153.mjs:478-493):
- Claude 3.5: 8,192
- Claude 3 Opus: 4,096
- Claude 3 Sonnet: 8,192
- Claude 3 Haiku: 4,096
- **Opus 4.5: 64,000**
- Opus 4: 32,000
- **Sonnet 4 / Haiku 4: 64,000**
- Default fallback: 32,000

This design ensures reliable, efficient, and user-friendly interactions with Claude models across various deployment scenarios.
