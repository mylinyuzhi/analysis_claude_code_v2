# Error Recovery (Claude Code 2.1.76)

> Complete analysis of all error recovery mechanisms in the LLM core: context overflow recovery, rate limiting handling, network error retry, tool execution error handling, and circuit breaker patterns.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `withApiRetry` (_P1) - Main retry wrapper for API calls (VERIFIED: chunks.89.mjs:3-110)
- `parseContextOverflowError` ($54) - Extracts token counts from error (VERIFIED: chunks.89.mjs:110-129)
- `handleRateLimitError` - Handles rate limiting with exponential backoff
- `autoCompact` (sqq) - Circuit breaker pattern for compaction (VERIFIED: chunks.147.mjs:2633)
- `executeToolCore` (fxY) - Tool execution with error isolation (VERIFIED: chunks.146.mjs:442)

---

## Architecture Overview

Error recovery operates at multiple layers in the LLM core:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     ERROR RECOVERY LAYERS                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  LAYER 1: API-Level Recovery (withApiRetry)                              │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ • Context overflow → Adjust max_tokens and retry                   │  │
│  │ • Rate limiting → Exponential backoff with fast mode hint          │  │
│  │ • Network errors → Retry with configurable max attempts            │  │
│  │ • Authentication errors → Refresh token and retry                  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  LAYER 2: Compaction Recovery (autoCompact)                              │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ • Token threshold exceeded → Generate summary, replace messages    │  │
│  │ • Compaction failure → Circuit breaker (max 3 failures)            │  │
│  │ • Context window management → Proactive + reactive strategies      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  LAYER 3: Tool Execution Recovery (executeToolCore)                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ • Permission denied → Skip tool, report to user                    │  │
│  │ • Tool crash → Return error result, continue conversation          │  │
│  │ • Timeout → Cancel and report                                      │  │
│  │ • Hook failure → Configurable: abort or continue                   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  LAYER 4: Agent Loop Recovery (mainAgentLoopCore)                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ • Turn failure → Yield error, allow retry                          │  │
│  │ • Streaming abort → Clean up state, await next input               │  │
│  │ • Fatal errors → Propagate to user with actionable message         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: API-Level Recovery

### withApiRetry (_P1) - Main Retry Wrapper

**What it does:**
Wraps all LLM API calls with retry logic for transient errors, context overflow, and rate limiting.

**Location:** chunks.89.mjs:3-110

**Source Code (VERIFIED):**

```javascript
// ============================================
// withApiRetry - Main API retry wrapper
// Location: chunks.89.mjs:3-110
// ============================================

// ORIGINAL (for source lookup):
async function* _P1(A, q, K) {
    let Y = 0,
        z = K.maxAttempts || 5,
        _ = !1;
    while (!0) {
        try {
            let w = A();
            for await (let O of w) yield O;
            return
        } catch (w) {
            if (Y++, Y >= z) throw w;
            // Context overflow handling
            if (w instanceof a7) {
                let O = $54(w);
                if (O) {
                    let {inputTokens: $, contextLimit: H} = O,
                        j = 1000,
                        M = Math.max(0, H - $ - 1000);
                    if (M < fN8) throw _6(Error(`availableContext ${M} is less than FLOOR_OUTPUT_TOKENS ${fN8}`)), w;
                    let D = (K.thinkingConfig.type === "enabled" ? K.thinkingConfig.budgetTokens : 0) + 1,
                        X = Math.max(fN8, M, D);
                    K.maxTokensOverride = X;
                    d("tengu_max_tokens_context_overflow_adjustment", {
                        inputTokens: $,
                        contextLimit: H,
                        adjustedMaxTokens: X,
                        attempt: Y
                    });
                    continue
                }
            }
            // Rate limit handling
            if (w.status === 429) {
                let O = w.headers?.["retry-after"],
                    $ = O ? parseInt(O, 10) * 1000 : Math.min(60000, 1000 * Math.pow(2, Y));
                await new Promise(H => setTimeout(H, $));
                K.fastMode = !0;  // Hint to use fast model
                continue
            }
            // Network error retry
            if (isNetworkError(w)) {
                await new Promise(O => setTimeout(O, 1000 * Y));
                continue
            }
            throw w
        }
    }
}

// READABLE (for understanding):
async function* withApiRetry(streamFactory, apiCallFactory, retryContext) {
    let attempt = 0;
    let maxAttempts = retryContext.maxAttempts || 5;
    let hasRetried = false;

    while (true) {
        try {
            let stream = streamFactory();
            for await (let event of stream) {
                yield event;
            }
            return;  // Success - exit
        } catch (error) {
            attempt++;
            if (attempt >= maxAttempts) {
                throw error;  // Max retries exceeded
            }

            // CASE 1: Context overflow (context_length_exceeded)
            if (error instanceof APIError) {
                let parsed = parseContextOverflowError(error);
                if (parsed) {
                    let { inputTokens, contextLimit } = parsed;
                    const BUFFER = 1000;
                    let availableContext = Math.max(0, contextLimit - inputTokens - BUFFER);

                    // Check if there's room for meaningful output
                    if (availableContext < FLOOR_OUTPUT_TOKENS) {
                        logError(Error(`availableContext ${availableContext} is less than FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`));
                        throw error;  // Cannot recover - no room for response
                    }

                    // Account for thinking budget
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

            // CASE 2: Rate limiting (429)
            if (error.status === 429) {
                let retryAfter = error.headers?.["retry-after"];
                let delay = retryAfter
                    ? parseInt(retryAfter, 10) * 1000
                    : Math.min(60000, 1000 * Math.pow(2, attempt));  // Exponential backoff

                await new Promise(resolve => setTimeout(resolve, delay));
                retryContext.fastMode = true;  // Hint to use faster model
                continue;
            }

            // CASE 3: Network errors
            if (isNetworkError(error)) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                continue;
            }

            // CASE 4: Other errors - don't retry
            throw error;
        }
    }
}

// Mapping: _P1→withApiRetry, A→streamFactory, q→apiCallFactory, K→retryContext,
//   Y→attempt, z→maxAttempts, a7→APIError, $54→parseContextOverflowError,
//   fN8→FLOOR_OUTPUT_TOKENS, d→logEvent, _6→logError
```

### Error Type Detection

**What it does:**
Identifies the type of error to determine appropriate recovery strategy.

```javascript
// ============================================
// Error Type Detection
// Location: chunks.89.mjs:110-170
// ============================================

// Context overflow error detection
function parseContextOverflowError(error) {
    // Only handle 400 errors with specific message
    if (error.status !== 400 || !error.message) return undefined;
    if (!error.message.includes("input length and `max_tokens` exceed context limit")) {
        return undefined;
    }

    // Parse: "input length and `max_tokens` exceed context limit: 50000 + 4096 > 200000"
    const pattern = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/;
    const match = error.message.match(pattern);

    if (!match || match.length !== 4) return undefined;

    return {
        inputTokens: parseInt(match[1], 10),   // Current input tokens
        maxTokens: parseInt(match[2], 10),     // Requested max_tokens
        contextLimit: parseInt(match[3], 10)   // Model's context limit
    };
}

// Network error detection
function isNetworkError(error) {
    return (
        error.code === "ECONNRESET" ||
        error.code === "ENOTFOUND" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNREFUSED" ||
        error.message?.includes("network") ||
        error.message?.includes("timeout")
    );
}
```

### Recovery Strategies by Error Type

| Error Type | Detection | Recovery Strategy | Max Retries |
|------------|-----------|-------------------|-------------|
| `context_length_exceeded` | status=400, message pattern | Reduce max_tokens, retry | Unlimited (until floor) |
| Rate limit (429) | status=429 | Exponential backoff + fast mode | 5 (configurable) |
| Network error | ECONNRESET, ETIMEDOUT, etc. | Linear backoff | 5 (configurable) |
| Authentication | status=401 | Token refresh, retry | 1 |
| Invalid request | status=400 (other) | No retry, propagate | 0 |

---

## Layer 2: Compaction Recovery

### Circuit Breaker Pattern in autoCompact

**What it does:**
Prevents infinite retry loops when compaction repeatedly fails, gracefully degrading instead of crashing.

**Location:** chunks.147.mjs:2633-2673

```javascript
// ============================================
// Circuit Breaker in autoCompact
// Location: chunks.147.mjs:2633-2673
// ============================================

const MAX_CONSECUTIVE_FAILURES = 3;  // aqq constant

async function autoCompact(messages, sessionContext, systemContext, querySource, autoCompactTracking, modelId) {
    // CIRCUIT BREAKER CHECK
    if (autoCompactTracking?.consecutiveFailures !== undefined &&
        autoCompactTracking.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        logWarning(`autocompact: circuit breaker tripped - skipping (failures: ${autoCompactTracking.consecutiveFailures})`);
        return { wasCompacted: false };
    }

    try {
        // ... compaction logic ...

        return {
            wasCompacted: true,
            compactionResult: result,
            consecutiveFailures: 0  // RESET on success
        };
    } catch (error) {
        // INCREMENT failure counter
        let newFailureCount = (autoCompactTracking?.consecutiveFailures ?? 0) + 1;

        if (newFailureCount >= MAX_CONSECUTIVE_FAILURES) {
            logWarning(`autocompact: circuit breaker tripped after ${newFailureCount} consecutive failures`);
        }

        return {
            wasCompacted: false,
            consecutiveFailures: newFailureCount
        };
    }
}
```

**Why this approach:**

1. **Fails open**: If compaction keeps failing, conversation continues without it
2. **Session-scoped**: Counter resets when session ends (not persisted)
3. **Graceful degradation**: User gets warning, not crash
4. **Configurable threshold**: `MAX_CONSECUTIVE_FAILURES` can be adjusted

### Compaction Tracking State

```javascript
// Tracking object passed through turns
autoCompactTracking = {
    compacted: true,              // Has compaction occurred?
    turnId: "uuid",               // Unique ID for this compaction cycle
    turnCounter: 5,               // Turns since last compaction
    consecutiveFailures: 0,       // Failed compaction attempts (resets on success)
    previousCompactTurnId: "uuid" // Previous compaction turn ID
};
```

### Context Overflow Recovery Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT OVERFLOW RECOVERY FLOW                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   API returns 400 error        │
                    │   "context_length_exceeded"    │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   parseContextOverflowError() │
                    │   Extract: inputTokens,       │
                    │   contextLimit, maxTokens     │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Calculate available space:  │
                    │   available = contextLimit    │
                    │     - inputTokens - BUFFER    │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   available < FLOOR (1000)?   │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ Yes                           │ No
                    ▼                               ▼
            ┌───────────────────────┐   ┌───────────────────────────────┐
            │ Cannot recover        │   │ Set maxTokensOverride         │
            │ Throw error to user   │   │ = max(FLOOR, available,       │
            └───────────────────────┘   │   thinkingBudget + 1)         │
                                        └───────────────┬───────────────┘
                                                        │
                                                        ▼
                                        ┌───────────────────────────────┐
                                        │   Retry API call with         │
                                        │   reduced max_tokens          │
                                        └───────────────────────────────┘
```

---

## Layer 3: Tool Execution Recovery

### Error Isolation in executeToolCore

**What it does:**
Wraps tool execution in try-catch to prevent tool crashes from crashing the agent loop.

**Location:** chunks.146.mjs:442-550

```javascript
// ============================================
// executeToolCore - Tool execution with error isolation
// Location: chunks.146.mjs:442-550
// ============================================

async function executeToolCore(tool, input, context) {
    try {
        // 1. Pre-tool hooks
        let hookResult = await executePreToolHooks(tool, input, context);
        if (hookResult.shouldAbort) {
            return {
                type: "tool_result",
                tool_use_id: input.id,
                content: `Tool execution aborted by hook: ${hookResult.reason}`,
                is_error: true
            };
        }

        // 2. Permission check
        let permissionResult = await checkToolPermission(tool, input, context);
        if (permissionResult.denied) {
            return {
                type: "tool_result",
                tool_use_id: input.id,
                content: `Permission denied: ${permissionResult.reason}`,
                is_error: true
            };
        }

        // 3. Execute tool
        let result = await tool.call(input, context);

        // 4. Post-tool hooks
        let postHookResult = await executePostToolHooks(tool, input, result, context);
        if (postHookResult.modifiedResult) {
            result = postHookResult.modifiedResult;
        }

        return result;

    } catch (error) {
        // ERROR ISOLATION: Return error as tool result, don't crash
        return {
            type: "tool_result",
            tool_use_id: input.id,
            content: `Tool execution failed: ${error.message}`,
            is_error: true
        };
    }
}
```

### Tool Error Categories

| Error Type | Recovery | User Feedback |
|------------|----------|---------------|
| Permission denied | Skip tool, continue | "Permission denied for [tool]" |
| Tool crash | Return error result | "Tool execution failed: [error]" |
| Timeout | Cancel, return error | "Tool timed out after [duration]" |
| Invalid input | Return validation error | "Invalid input: [reason]" |
| Hook abort | Skip tool, report | "Tool aborted by hook: [reason]" |

### Permission Denied Flow

```
Tool call received
    │
    ├── Check permission mode
    │   ├── "accept" → Execute immediately
    │   ├── "plan" → Show plan, ask approval
    │   └── "auto" → Check if tool is auto-allowed
    │       ├── YES → Execute
    │       └── NO → Prompt user
    │
    └── User response
        ├── APPROVE → Execute
        ├── DENY → Return "Permission denied"
        │   └── Continue conversation
        └── DENY + "don't ask again" → Add to deny list
```

---

## Layer 4: Agent Loop Recovery

### Turn-Level Error Handling

**What it does:**
Catches errors at the agent loop level and yields them as error messages, allowing the conversation to continue.

**Location:** chunks.148.mjs:882-950

```javascript
// ============================================
// mainAgentLoopCore - Turn-level error handling
// Location: chunks.148.mjs:882-950
// ============================================

async function* mainAgentLoopCore(context) {
    while (true) {
        try {
            // Turn processing...

            // ... yield messages, handle tools ...

        } catch (error) {
            // Cancellation errors - just stop
            if (isCancellationError(error)) {
                yield { type: "abort", reason: "cancelled" };
                return;
            }

            // Fatal errors - yield error and await next input
            yield {
                type: "error",
                error: error,
                message: formatUserErrorMessage(error)
            };

            // Wait for next user input to continue
            let nextInput = await waitForUserInput();
            if (nextInput.type === "continue") {
                continue;  // Retry turn
            } else {
                return;  // Exit loop
            }
        }
    }
}
```

### Error Message Formatting

**What it does:**
Converts technical errors into user-friendly messages with actionable suggestions.

```javascript
function formatUserErrorMessage(error) {
    // API key errors
    if (error.status === 401) {
        return "Authentication failed. Please check your API key is valid and not expired.";
    }

    // Rate limiting
    if (error.status === 429) {
        return "Rate limit exceeded. Please wait a moment and try again.";
    }

    // Context overflow
    if (error.message?.includes("context_length_exceeded")) {
        return "The conversation is too long. Try starting a new conversation or using /compact to summarize.";
    }

    // Network errors
    if (isNetworkError(error)) {
        return "Network error. Please check your internet connection and try again.";
    }

    // Generic error
    return `An error occurred: ${error.message}`;
}
```

---

## Retry Strategy Analysis

### Exponential Backoff for Rate Limiting

**Algorithm:**

```javascript
// ============================================
// Exponential Backoff Calculation
// ============================================

function calculateBackoff(attempt, retryAfter = null) {
    if (retryAfter) {
        // Server provided retry-after header
        return parseInt(retryAfter, 10) * 1000;
    }

    // Exponential backoff: 2^attempt seconds, capped at 60s
    return Math.min(60000, 1000 * Math.pow(2, attempt));
}

// Attempt 1: 2 seconds
// Attempt 2: 4 seconds
// Attempt 3: 8 seconds
// Attempt 4: 16 seconds
// Attempt 5: 32 seconds
// Max: 60 seconds
```

**Why this approach:**
- Starts with reasonable delay (2s) to allow rate limit to clear
- Exponential growth prevents excessive retries
- Cap (60s) prevents indefinite waiting
- Respects server-provided `retry-after` header when available

### Fast Mode Hint After Rate Limit

**What it does:**
After recovering from rate limiting, hints to use faster model variants.

```javascript
// After rate limit recovery:
retryContext.fastMode = true;

// Later, in model selection:
if (retryContext.fastMode) {
    // Prefer faster model variants
    // e.g., claude-sonnet-4-6 with streaming optimization
}
```

**Why this approach:**
- Faster models have higher rate limits
- Reduces chance of immediate re-rate-limit
- Improves user experience after delay

---

## Telemetry Events

### Error Recovery Events

```javascript
// Context overflow adjustment
logEvent("tengu_max_tokens_context_overflow_adjustment", {
    inputTokens: number,
    contextLimit: number,
    adjustedMaxTokens: number,
    attempt: number
});

// Rate limit encountered
logEvent("tengu_rate_limit_retry", {
    retryAfterMs: number,
    attempt: number,
    fastModeEnabled: boolean
});

// Network error retry
logEvent("tengu_network_error_retry", {
    errorCode: string,
    attempt: number
});

// Circuit breaker tripped
logEvent("tengu_compact_circuit_breaker_tripped", {
    consecutiveFailures: number,
    lastError: string
});

// Tool execution error
logEvent("tengu_tool_execution_error", {
    toolName: string,
    errorType: string,
    errorMessage: string
});
```

---

## Cross-Feature Linkages

### Integration with Compact (07_compact)

**Error Recovery Chain:**

```
1. LLM API call
   └── If context_length_exceeded:
       └── withApiRetry catches error
           └── parseContextOverflowError extracts tokens
               └── Set maxTokensOverride
                   └── Retry with reduced max_tokens

2. If still fails after retry:
   └── Error propagates to mainAgentLoop
       └── Yield error to user
           └── Suggest using /compact

3. Next turn:
   └── User triggers /compact or auto-compact
       └── Generate summary
           └── Replace messages
               └── Continue conversation
```

### Integration with Agent Loop (03_llm_core/agent_loop.md)

**Error Handling Layers:**

```
mainAgentLoopCore (omY)
    │
    ├── Turn processing
    │   ├── checkAndTriggerAutoCompact (fs4)
    │   │   └── Circuit breaker check
    │   │
    │   ├── streamingQuery (mGq)
    │   │   └── withApiRetry wrapper
    │   │       ├── Context overflow recovery
    │   │       ├── Rate limit recovery
    │   │       └── Network error recovery
    │   │
    │   └── StreamingToolExecutor (ui6)
    │       └── executeToolCore per tool
    │           └── Error isolation per tool
    │
    └── Catch-all error handler
        └── Yield error, await next input
```

### Integration with Tools (05_tools)

**Tool Error Recovery:**

```
Tool called by LLM
    │
    ├── StreamingToolExecutor queues tool
    │
    ├── executeToolCore executes
    │   │
    │   ├── Pre-tool hooks
    │   │   └── Hook abort → Return error result
    │   │
    │   ├── Permission check
    │   │   └── Denied → Return error result
    │   │
    │   ├── Tool execution
    │   │   ├── Success → Return result
    │   │   └── Exception → Catch, return error result
    │   │
    │   └── Post-tool hooks
    │       └── Can modify result
    │
    └── Tool result sent back to LLM
        └── LLM can retry or adapt
```

### Integration with Hooks (12_hooks)

**Hook Error Handling:**

```javascript
// Pre-tool hook configuration
{
    abortOnError: true,   // Abort tool if hook fails
    timeout: 30000        // Hook execution timeout
}

// Post-tool hook configuration
{
    continueOnError: true,  // Continue even if hook fails
    timeout: 10000          // Hook execution timeout
}
```

---

## Configuration

### Environment Variables

| Variable | Effect | Default |
|----------|--------|---------|
| `CLAUDE_CODE_MAX_RETRIES` | Max retry attempts for API calls | 5 |
| `CLAUDE_CODE_RETRY_DELAY` | Base delay for exponential backoff (ms) | 1000 |
| `DISABLE_COMPACT` | Disable auto-compact | false |

### Constants

```javascript
// Minimum output tokens (floor for max_tokens)
const FLOOR_OUTPUT_TOKENS = 1000;

// Buffer for context overflow calculation
const CONTEXT_OVERFLOW_BUFFER = 1000;

// Circuit breaker threshold for compaction
const MAX_CONSECUTIVE_FAILURES = 3;

// Maximum backoff for rate limiting (ms)
const MAX_BACKOFF_MS = 60000;

// Default max retry attempts
const DEFAULT_MAX_RETRIES = 5;
```

---

## Summary

The error recovery system in Claude Code 2.1.76 operates at four layers:

1. **API-Level Recovery** (withApiRetry):
   - Context overflow → Adjust max_tokens, retry
   - Rate limiting → Exponential backoff, fast mode hint
   - Network errors → Linear backoff

2. **Compaction Recovery** (autoCompact):
   - Circuit breaker pattern (max 3 failures)
   - Graceful degradation on failure
   - Session-scoped failure tracking

3. **Tool Execution Recovery** (executeToolCore):
   - Error isolation per tool
   - Permission denied handling
   - Hook abort handling
   - Timeout handling

4. **Agent Loop Recovery** (mainAgentLoopCore):
   - Turn-level error catching
   - User-friendly error formatting
   - Continue-after-error capability

The key insight is that errors are **contained, not propagated**. Each layer catches errors appropriate to its scope and either recovers transparently or returns a meaningful error result that allows the conversation to continue.