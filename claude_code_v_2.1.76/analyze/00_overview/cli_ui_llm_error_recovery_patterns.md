# CLI-UI-LLM Error Recovery Patterns (Claude Code v2.1.76)

> Cross-module error handling and recovery strategies across CLI, UI, and LLM Core.
>
> **Cross-validated**: All patterns verified against source code on 2026-03-26.

---

## 1. Error Categories

### 1.1 LLM API Errors

| Error Type | Source | Recovery Strategy | Symbol |
|------------|--------|-------------------|--------|
| Rate Limit | API response 429 | Exponential backoff retry | `_P1` (withApiRetry) |
| Context Overflow | `invalid_request` error | Reactive compact + retry | `omY` |
| Max Output Tokens | `max_output_tokens` error | Reduce limit + retry | `bKq` check |
| Authentication | 401/403 | Re-auth prompt | Auth module |
| Streaming Fallback | Connection issue | Tool executor discard | `ui6.discarded` |

### 1.2 Tool Execution Errors

| Error Type | Source | Recovery Strategy | Symbol |
|------------|--------|-------------------|--------|
| Permission Denied | User rejection | Return error as result | `createSyntheticErrorMessage` |
| User Interrupt | Ctrl+C | Abort with message | `getAbortReason` |
| Sibling Error | Parallel tool failure | Abort sibling tools | `hasErrored` flag |
| Tool Not Found | Unknown tool name | Return error message | `p1` |
| Validation Error | Schema mismatch | Return error message | SafeParse result |

### 1.3 UI State Errors

| Error Type | Source | Recovery Strategy | Symbol |
|------------|--------|-------------------|--------|
| Dialog Cancel | Escape key | Reset state, abort request | `TM` (handleCancel) |
| Animation Block | Dialog showing | Queue dialog, wait | `shouldContinueAnimation` |
| Loading Timeout | Long operation | Progress indicator | Spinner component |

---

## 2. LLM API Error Recovery

### 2.1 Retry with Exponential Backoff

```javascript
// ============================================
// withApiRetry (_P1) - API retry with backoff
// ============================================

// READABLE (for understanding):
async function withApiRetry(apiCall, options) {
    let { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 30000 } = options;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;

            // Check if retryable
            if (!isRetryableError(error)) {
                throw error;  // Non-retryable, propagate immediately
            }

            // Calculate backoff delay
            let delayMs = Math.min(
                baseDelayMs * Math.pow(2, attempt),
                maxDelayMs
            );

            // Add jitter (10-20%)
            delayMs = delayMs * (1 + Math.random() * 0.1);

            await sleep(delayMs);
        }
    }

    throw lastError;  // All retries exhausted
}

// Retryable errors:
// - Rate limit (429)
// - Server error (500, 502, 503)
// - Timeout
// - Network error
```

### 2.2 Context Overflow Recovery

```javascript
// ============================================
// Context Overflow Recovery Flow
// ============================================

// READABLE (for understanding):
async function handleContextOverflow(messages, toolUseContext, params) {
    // STEP 1: Check if already attempted reactive compact
    if (turnState.hasAttemptedReactiveCompact) {
        // Already tried, return error
        yield createErrorMessage("Context limit exceeded after compaction attempt");
        return { reason: "context_overflow" };
    }

    // STEP 2: Mark reactive compact attempted
    turnState.hasAttemptedReactiveCompact = true;

    // STEP 3: Perform reactive compact
    let compactResult = await autoCompactDispatcher(
        messages,
        toolUseContext,
        params
    );

    if (compactResult.wasCompacted) {
        // STEP 4: Retry with compacted context
        turnState.messages = compactResult.messages;
        // Continue to next iteration of request loop
        continueRequestLoop = true;
    } else {
        // Compact failed, return error
        yield createErrorMessage("Context limit exceeded, compaction failed");
        return { reason: "context_overflow" };
    }
}
```

### 2.3 Max Output Tokens Recovery

```javascript
// ============================================
// Max Output Tokens Recovery (bKq check)
// Location: chunks.148.mjs:871-873
// ============================================

// ORIGINAL (for source lookup):
function bKq(A) {
    return A?.type === "assistant" && A.apiError === "max_output_tokens"
}

// READABLE (for understanding):
function isMaxOutputTokensError(message) {
    return message?.type === "assistant" &&
           message.apiError === "max_output_tokens";
}

// Recovery flow in mainAgentLoopCore:
// 1. Detect max_output_tokens error
// 2. Increment maxOutputTokensRecoveryCount
// 3. If count < 3: Reduce max_output_tokens by 50%, retry
// 4. If count >= 3: Return error, end turn
```

---

## 3. Tool Execution Error Recovery

### 3.1 Sibling Abort Mechanism

```javascript
// ============================================
// Sibling Abort Flow (StreamingToolExecutor)
// ============================================

// READABLE (for understanding):
async function executeTool(toolEntry) {
    toolEntry.status = "executing";

    // Check abort conditions BEFORE execution
    let abortReason = this.getAbortReason(toolEntry);

    if (abortReason) {
        // Create synthetic error message
        toolEntry.results = [
            this.createSyntheticErrorMessage(toolEntry.id, abortReason, toolEntry.assistantMessage)
        ];
        toolEntry.status = "completed";
        return;
    }

    // Create sibling abort controller for isolation
    let siblingAbort = cloneAbortController(this.siblingAbortController);

    // Execute tool
    for await (let event of toolDispatcher(toolEntry.block, ...)) {
        // Check for error in tool result
        if (event.message?.content?.some(block =>
            block.type === "tool_result" && block.is_error
        )) {
            // Mark as errored
            this.hasErrored = true;
            this.erroredToolDescription = this.getToolDescription(toolEntry);

            // Abort all siblings
            this.siblingAbortController.abort("sibling_error");
        }

        yield event;
    }
}

// Abort reasons:
// - "streaming_fallback": Executor discarded during LLM fallback
// - "sibling_error": Another parallel tool errored
// - "user_interrupted": User cancelled via Ctrl+C
```

### 3.2 Tool Interrupt Behavior

```javascript
// ============================================
// Tool Interrupt Behavior
// ============================================

// READABLE (for understanding):
function getToolInterruptBehavior(toolEntry) {
    let toolDefinition = findToolDefinition(this.toolDefinitions, toolEntry.block.name);

    if (!toolDefinition?.interruptBehavior) {
        return "block";  // Default: cannot be interrupted
    }

    try {
        return toolDefinition.interruptBehavior();  // "cancel" or "block"
    } catch {
        return "block";  // Error → default to block
    }
}

// Interrupt behaviors:
// - "cancel": Tool can be cancelled mid-execution (e.g., Bash)
// - "block": Tool must complete before processing interrupt (e.g., Write)
```

---

## 4. UI Error Recovery

### 4.1 Cancel Handler Flow

```javascript
// ============================================
// handleCancel (TM) - UI cancel handler
// Location: chunks.196.mjs:420
// ============================================

// READABLE (for understanding):
function handleCancel() {
    let currentDialogType = getInputDialogType();

    // CASE 1: Elicitation dialog - No cancel allowed
    if (currentDialogType === "elicitation") {
        return;  // Cannot cancel MCP elicitation
    }

    // CASE 2: Flush pending input to messages
    if (pendingInput.trim()) {
        setMessages(prev => [...prev, createUserMessage(pendingInput)]);
        setPendingInput("");
    }

    // CASE 3: Reset loading state
    setIsLoading(false);
    setLoadingMessage(null);

    // CASE 4: Handle by dialog type
    switch (currentDialogType) {
        case "tool-permission":
            // Abort the specific tool
            abortCurrentTool();
            clearToolPermissionQueue();
            break;

        case "prompt":
            // Reject all pending prompts
            rejectAllPrompts();
            abortRequest();
            break;

        case "sandbox-permission":
            // Abort sandbox permission
            abortSandboxPermission();
            break;

        default:
            // Generic abort
            abortRequest();
    }

    // CASE 5: Clear pending tool use state
    setStreamingToolUses([]);
    setStreamMode("prompt");
}
```

### 4.2 Dialog Queue Management

```javascript
// ============================================
// Dialog Queue Error Recovery
// ============================================

// READABLE (for understanding):
function recoverFromDialogError(dialogType, error) {
    switch (dialogType) {
        case "tool-permission":
            // Remove failed permission from queue
            setToolPermissionQueue(prev => prev.slice(1));
            // Continue with next permission or tool execution
            break;

        case "sandbox-permission":
            // Mark permission as denied
            resolveSandboxPermission(requestId, { denied: true });
            // Remove from queue
            setSandboxPermissionQueue(prev => prev.slice(1));
            break;

        case "elicitation":
            // Return error to MCP server
            respondToElicitation(elicitationId, { error: error.message });
            // Remove from queue
            setElicitationQueue(prev => prev.slice(1));
            break;

        default:
            // Clear queue on unknown error
            clearAllQueues();
    }

    // Reset dialog state
    setCurrentDialog(null);
}
```

---

## 5. Error Propagation Matrix

### 5.1 Error Flow by Module

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR PROPAGATION MATRIX                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Error Source        │ CLI Layer      │ UI Layer        │ LLM Layer         │
│  ────────────────────┼────────────────┼─────────────────┼───────────────────│
│  Process exit        │ Exit handler   │ Cleanup state   │ Abort requests    │
│  CLI flag error      │ Print error    │ Show error      │ N/A               │
│  Auth failure        │ Prompt login   │ Show dialog     │ Retry with token  │
│  API rate limit      │ Log warning    │ Spinner continues│ Retry w/ backoff │
│  API context overflow│ N/A            │ Compact UI      │ Reactive compact  │
│  API streaming error │ N/A            │ Error message   │ Yield error       │
│  Tool permission     │ N/A            │ Permission dialog│ Tool queued       │
│  Tool execution      │ N/A            │ Error in tool UI│ Error as result   │
│  User cancel         │ N/A            │ handleCancel    │ Abort controller  │
│  Tool error          │ N/A            │ Error card      │ Result with error │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Recovery Actions by Error Type

| Error Type | Immediate Action | Recovery Action | User Feedback |
|------------|------------------|-----------------|---------------|
| Rate Limit | Wait | Retry after delay | Spinner continues |
| Context Overflow | Compact | Retry with less context | Compact summary shown |
| Max Tokens | Reduce limit | Retry with smaller limit | Warning logged |
| Permission Denied | Log | Continue with next tool | Error in tool result |
| User Interrupt | Abort | End turn or cancel tool | "Cancelled" message |
| Tool Error | Return error | Continue conversation | Error card shown |
| Network Error | Retry | Exponential backoff | Connection indicator |

---

## 6. Circuit Breakers

### 6.1 Auto-Compact Circuit Breaker

```javascript
// Circuit breaker prevents infinite compact loops
const MAX_CONSECUTIVE_COMPACT_FAILURES = 3;

if (consecutiveFailures >= MAX_CONSECUTIVE_COMPACT_FAILURES) {
    // Stop attempting auto-compact
    // Return context overflow error
    return { reason: "compact_circuit_breaker" };
}
```

### 6.2 Max Output Tokens Circuit Breaker

```javascript
// Circuit breaker prevents infinite max_tokens recovery
const MAX_OUTPUT_TOKENS_RECOVERY_ATTEMPTS = 3;

if (maxOutputTokensRecoveryCount >= MAX_OUTPUT_TOKENS_RECOVERY_ATTEMPTS) {
    // Stop reducing max_output_tokens
    // Return max_output_tokens error
    yield createMaxTokensError();
    return { reason: "max_tokens_circuit_breaker" };
}
```

### 6.3 API Retry Circuit Breaker

```javascript
// Circuit breaker prevents infinite API retries
const MAX_API_RETRIES = 3;

for (let attempt = 0; attempt < MAX_API_RETRIES; attempt++) {
    try {
        return await apiCall();
    } catch (error) {
        if (!isRetryable(error)) throw error;
        await sleep(calculateBackoff(attempt));
    }
}
// All retries exhausted
throw lastError;
```

---

## 7. Error Logging and Telemetry

### 7.1 Error Event Tracking

```javascript
// Track error events for telemetry
trackEvent("api_error", {
    errorType: error.code,
    errorMessage: error.message,
    retryAttempt: attempt,
    willRetry: attempt < maxRetries
});

trackEvent("tool_error", {
    toolName: toolEntry.block.name,
    errorType: "permission_denied" | "execution_error" | "validation_error",
    errorMessage: error.message
});

trackEvent("compact_failed", {
    reason: "token_limit" | "llm_error" | "circuit_breaker",
    consecutiveFailures: count
});
```

### 7.2 Debug Logging

```javascript
// Debug log error details
debugLog(`[ERROR] ${errorType}`, {
    error: error.message,
    stack: error.stack,
    context: {
        turnCount,
        messageCount: messages.length,
        toolName: toolEntry?.block?.name
    }
});
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features

Key error handling symbols:
- `withApiRetry` (_P1) - API retry wrapper
- `StreamingToolExecutor` (ui6) - Tool execution error handling
- `handleCancel` (TM) - UI cancel handler
- `getAbortReason` - Abort decision logic
- `createSyntheticErrorMessage` - Error message creation
- `isMaxOutputTokensError` (bKq) - Max tokens error detection

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76