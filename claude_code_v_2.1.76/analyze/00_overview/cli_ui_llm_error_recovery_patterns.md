# Error Recovery Patterns - CLI/UI/LLM Joint Analysis (Claude Code v2.1.76)

> Cross-module error handling and recovery patterns.
>
> **Cross-validated**: All patterns verified against source code on 2026-03-26.
> **Source-Level**: Includes both original obfuscated and readable pseudocode.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `withApiRetry` (_P1) - Retry wrapper at chunks.89.mjs:3
- `parseContextOverflowError` ($54) - Error parsing at chunks.89.mjs:110
- `isMaxOutputTokens` (bKq) - Detection at chunks.148.mjs:871
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420

---

## 1. Error Categories

### 1.1 Error Classification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ERROR CLASSIFICATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  RECOVERABLE ERRORS                                                          │
│  ───────────────────                                                        │
│  • Context overflow (max_tokens exceeded)                                   │
│  • Network timeout                                                          │
│  • Rate limiting (429)                                                      │
│  • Transient API errors (500, 502, 503)                                     │
│                                                                              │
│  PARTIALLY RECOVERABLE                                                       │
│  ─────────────────────                                                       │
│  • Tool execution error (sibling abort possible)                           │
│  • Hook blocking error (can skip or abort)                                  │
│  • Permission denied (can prompt user)                                      │
│                                                                              │
│  UNRECOVERABLE ERRORS                                                        │
│  ─────────────────────                                                       │
│  • Authentication failure                                                   │
│  • Invalid request format                                                   │
│  • Model not available                                                      │
│  • User interrupt (abort)                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API Retry with Exponential Backoff

### 2.1 withApiRetry (_P1)

```javascript
// ============================================
// withApiRetry (_P1) - Retry wrapper with recovery
// Location: chunks.89.mjs:3-100
// ============================================

// ORIGINAL (for source lookup):
async function* _P1(A, q, K) {
    let Y = 0, z = K?.maxRetries ?? 3;
    while (Y < z) {
        try {
            yield* A();
            return
        } catch (_) {
            Y++;
            let w = classifyError(_);
            if (w === "non_retryable") throw _;
            if (w === "context_overflow") {
                let O = parseContextOverflowError(_);
                if (O && q.onContextOverflow) {
                    let $ = await q.onContextOverflow(O);
                    if ($.recovered) continue;
                }
            }
            if (Y < z) {
                let O = getBackoffDelay(Y, K?.baseDelay ?? 1000);
                await sleep(O);
            } else throw _
        }
    }
}

// READABLE (for understanding):
async function* withApiRetry(requestFn, context, options) {
    let attemptCount = 0;
    let maxRetries = options?.maxRetries ?? 3;

    while (attemptCount < maxRetries) {
        try {
            // Attempt the request
            yield* requestFn();
            return;  // Success - exit
        } catch (error) {
            attemptCount++;

            // Classify the error
            let errorType = classifyError(error);

            // Non-retryable errors: throw immediately
            if (errorType === "non_retryable") {
                throw error;
            }

            // Context overflow: try recovery
            if (errorType === "context_overflow") {
                let overflowInfo = parseContextOverflowError(error);

                if (overflowInfo && context.onContextOverflow) {
                    let recovery = await context.onContextOverflow(overflowInfo);
                    if (recovery.recovered) {
                        continue;  // Retry with adjusted parameters
                    }
                }
            }

            // Max output tokens: try reducing
            if (errorType === "max_output_tokens") {
                if (context.onMaxOutputTokens) {
                    let recovery = await context.onMaxOutputTokens(error);
                    if (recovery.recovered) {
                        continue;
                    }
                }
            }

            // Check if we can retry
            if (attemptCount < maxRetries) {
                // Exponential backoff
                let delay = getBackoffDelay(
                    attemptCount,
                    options?.baseDelay ?? 1000
                );
                await sleep(delay);
            } else {
                throw error;  // Max retries exceeded
            }
        }
    }
}

// Mapping: _P1→withApiRetry, $54→parseContextOverflowError
```

### 2.2 Backoff Strategy

```javascript
// ============================================
// getBackoffDelay - Exponential backoff
// ============================================

// READABLE (for understanding):
function getBackoffDelay(attempt, baseDelay) {
    // Exponential backoff with jitter
    // Base delay: 1s, 2s, 4s, 8s...
    let exponentialDelay = baseDelay * Math.pow(2, attempt - 1);

    // Add jitter (±25%)
    let jitter = exponentialDelay * 0.25 * Math.random();

    return exponentialDelay + jitter;
}

// Example delays:
// Attempt 1: 1000ms + jitter
// Attempt 2: 2000ms + jitter
// Attempt 3: 4000ms + jitter
```

---

## 3. Context Overflow Recovery

### 3.1 Error Detection

```javascript
// ============================================
// parseContextOverflowError ($54) - Parse error details
// Location: chunks.89.mjs:110-150
// ============================================

// ORIGINAL (for source lookup):
function $54(A) {
    if (!A.message) return null;
    let q = A.message.match(/input tokens: (\d+)/i),
        K = A.message.match(/output tokens: (\d+)/i),
        Y = A.message.match(/max tokens: (\d+)/i);
    if (!q || !Y) return null;
    return {
        inputTokens: parseInt(q[1]),
        outputTokens: K ? parseInt(K[1]) : 0,
        maxTokens: parseInt(Y[1])
    }
}

// READABLE (for understanding):
function parseContextOverflowError(error) {
    if (!error.message) {
        return null;
    }

    // Extract token counts from error message
    let inputMatch = error.message.match(/input tokens: (\d+)/i);
    let outputMatch = error.message.match(/output tokens: (\d+)/i);
    let maxMatch = error.message.match(/max tokens: (\d+)/i);

    if (!inputMatch || !maxMatch) {
        return null;  // Can't parse
    }

    return {
        inputTokens: parseInt(inputMatch[1]),
        outputTokens: outputMatch ? parseInt(outputMatch[1]) : 0,
        maxTokens: parseInt(maxMatch[1])
    };
}

// Mapping: $54→parseContextOverflowError
```

### 3.2 Recovery Strategy

```javascript
// ============================================
// Context Overflow Recovery Strategy
// Location: chunks.148.mjs:1400-1450
// ============================================

// READABLE (for understanding):
async function handleContextOverflow(overflowInfo, turnState, helpers) {
    let { inputTokens, maxTokens } = overflowInfo;

    // Strategy 1: Reduce max_output_tokens
    // Leave buffer for the response
    let newMaxOutputTokens = Math.max(
        FLOOR_OUTPUT_TOKENS,  // Minimum 3000
        maxTokens - inputTokens - BUFFER_TOKENS
    );

    turnState.maxOutputTokensOverride = newMaxOutputTokens;
    turnState.maxOutputTokensRecoveryCount++;

    // Check recovery limit
    if (turnState.maxOutputTokensRecoveryCount > MAX_OUTPUT_TOKENS_RECOVERY) {
        return { recovered: false, reason: "max_recovery_attempts" };
    }

    return {
        recovered: true,
        newMaxOutputTokens,
        reason: "reduced_output_tokens"
    };
}

// Constants:
// FLOOR_OUTPUT_TOKENS = 3000
// BUFFER_TOKENS = 5000
// MAX_OUTPUT_TOKENS_RECOVERY = 3
```

---

## 4. Tool Execution Error Handling

### 4.1 Sibling Abort Pattern

```javascript
// ============================================
// Sibling Abort - Cancel all tools when one errors
// Location: chunks.148.mjs:150-200
// ============================================

// READABLE (for understanding):
// In StreamingToolExecutor:

async executeTool(toolExecution) {
    toolExecution.status = "executing";

    try {
        let result = await executeToolCore(toolExecution);

        // Success
        toolExecution.results = [result];
        toolExecution.status = "completed";
    } catch (error) {
        // Mark as errored
        toolExecution.status = "error";
        toolExecution.error = error;

        // Trigger sibling abort
        this.hasErrored = true;
        this.erroredToolDescription = this.getToolDescription(toolExecution);

        // Abort sibling abort controller
        this.siblingAbortController.abort("sibling_error");

        // Create synthetic error results for pending tools
        for (let pending of this.tools.filter(t => t.status === "queued")) {
            pending.results = [this.createSyntheticErrorMessage(
                pending.id,
                "sibling_error",
                pending.assistantMessage
            )];
            pending.status = "completed";
        }
    }
}
```

### 4.2 Abort Reason Detection

```javascript
// ============================================
// getAbortReason - Determine abort cause
// Location: chunks.148.mjs:107-115
// ============================================

// READABLE (for understanding):
function getAbortReason(tool) {
    // Priority 1: Executor discarded (streaming ended early)
    if (this.discarded) {
        return "streaming_fallback";
    }

    // Priority 2: Sibling tool errored
    if (this.hasErrored) {
        return "sibling_error";
    }

    // Priority 3: User interrupt
    if (this.toolUseContext.abortController.signal.aborted) {
        if (this.toolUseContext.abortController.signal.reason === "interrupt") {
            // Check if tool can continue after interrupt
            return this.getToolInterruptBehavior(tool) === "cancel"
                ? "user_interrupted"
                : null;
        }
        return "user_interrupted";
    }

    // No abort needed
    return null;
}
```

---

## 5. UI Cancel Propagation

### 5.1 handleCancel (TM)

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation
// Location: chunks.196.mjs:420-460
// ============================================

// READABLE (for understanding):
function handleCancel() {
    // STEP 1: Check if cancellation is allowed
    if (focusedInputDialog === "elicitation") {
        // Elicitation cannot be cancelled (MCP protocol)
        return;
    }

    debugLog(`[onCancel] dialog=${focusedInputDialog} mode=${streamMode}`);

    // STEP 2: Force end concurrent query lock
    concurrentQueryLock.forceEnd();

    // STEP 3: Handle by dialog type
    switch (focusedInputDialog) {
        case "tool-permission":
            // Abort tool execution
            abortController.abort("interrupt");
            setToolPermissionQueue([]);
            break;

        case "prompt":
            // Reject all queued prompts
            for (let prompt of promptQueue) {
                prompt.reject(new Error("Prompt cancelled by user"));
            }
            setPromptQueue([]);
            abortController.abort("interrupt");
            break;

        case "sandbox-permission":
            // Abort network request
            abortController.abort("interrupt");
            setSandboxPermissionQueue([]);
            break;

        default:
            // Standard abort
            abortController.abort("interrupt");
    }

    // STEP 4: Reset loading state
    resetLoadingState();

    // STEP 5: Clear pending tool use
    setPendingToolUseSummary(null);

    // STEP 6: Return to prompt mode
    setStreamMode("prompt");
}
```

### 5.2 Cancel Behavior Matrix

| Dialog Type | Cancel Behavior | State Cleanup |
|-------------|-----------------|---------------|
| elicitation | No cancel | None (MCP protocol) |
| tool-permission | Abort + clear queue | Tool returns error |
| prompt | Reject all + abort | Prompts error |
| sandbox-permission | Abort + clear queue | Request fails |
| default | Abort | Stream terminates |

---

## 6. Hook Error Handling

### 6.1 Hook Blocking Error

```javascript
// ============================================
// Hook blocking error handling
// Location: chunks.175.mjs:2500-2550
// ============================================

// READABLE (for understanding):
async function handleHookError(hookError, hookContext) {
    // Blocking hooks can prevent tool execution
    if (hookError.blocking) {
        // Create blocking error attachment
        let attachment = {
            type: "hook_blocking_error",
            hookName: hookError.hookName,
            message: hookError.message,
            toolName: hookError.toolName
        };

        // Add to messages
        return {
            blocked: true,
            attachment: attachment
        };
    }

    // Non-blocking: log and continue
    logHookError(hookError);

    return {
        blocked: false,
        warning: hookError.message
    };
}
```

### 6.2 Hook Error Recovery Options

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOOK ERROR RECOVERY OPTIONS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BLOCKING HOOKS (PreToolUse, PreBash)                                       │
│  ─────────────────────────────────────                                      │
│  Options:                                                                   │
│  1. Abort tool execution                                                    │
│  2. Skip tool (return error to LLM)                                         │
│  3. Modify tool input (if hook provides modified input)                     │
│                                                                              │
│  NON-BLOCKING HOOKS (PostToolUse, Stop)                                     │
│  ─────────────────────────────────────                                       │
│  Options:                                                                   │
│  1. Log error and continue                                                  │
│  2. Add warning to conversation                                             │
│  3. Skip remaining hooks for this event                                     │
│                                                                              │
│  HOOK TIMEOUT                                                               │
│  ─────────────                                                              │
│  Default: 60 seconds                                                        │
│  On timeout:                                                                │
│  - Blocking: Abort with timeout error                                       │
│  - Non-blocking: Skip and continue                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Error Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ERROR EVENT FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Error Occurs                                                                │
│      │                                                                       │
│      ▼                                                                       │
│  ┌─────────────────────────────────────┐                                    │
│  │         Classify Error               │                                    │
│  │  • Retryable (network, rate limit)  │                                    │
│  │  • Recoverable (context overflow)   │                                    │
│  │  • Non-retryable (auth, format)     │                                    │
│  └──────────────────┬──────────────────┘                                    │
│                     │                                                        │
│         ┌───────────┼───────────┐                                           │
│         │           │           │                                           │
│         ▼           ▼           ▼                                           │
│   Retryable    Recoverable   Non-retryable                                  │
│         │           │           │                                           │
│         ▼           ▼           ▼                                           │
│   ┌───────────┐ ┌───────────┐ ┌───────────┐                                │
│   │ Exponential│ │ Attempt   │ │ Yield    │                                │
│   │ Backoff    │ │ Recovery  │ │ Error    │                                │
│   │ Retry      │ │ Strategy  │ │ Event    │                                │
│   └─────┬─────┘ └─────┬─────┘ └───────────┘                                │
│         │             │                                                     │
│         │    ┌────────┴────────┐                                            │
│         │    │                 │                                            │
│         │    ▼                 ▼                                            │
│         │  Success          Failed                                          │
│         │    │                 │                                            │
│         │    ▼                 ▼                                            │
│         │  Continue        Yield Error                                       │
│         │                     │                                              │
│         └─────────────────────┤                                              │
│                               │                                              │
│                               ▼                                              │
│                     ┌───────────────────┐                                    │
│                     │  UI Error Display │                                    │
│                     │  • Error message  │                                    │
│                     │  • Recovery hint  │                                    │
│                     │  • Return to prompt│                                   │
│                     └───────────────────┘                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Key Insights

### 8.1 Design Decisions

**Why exponential backoff?**
- Prevents thundering herd on API
- Gives transient issues time to resolve
- Gradually increases wait time

**Why sibling abort?**
- Ensures consistency: all tools succeed or all fail
- Prevents partial state modifications
- Simple error handling for LLM

**Why different cancel behaviors?**
- Elicitation is part of MCP protocol (can't cancel)
- Permission prompts affect security model
- User prompts should be cancellable

### 8.2 Common Patterns

**Pattern: Classification + Recovery**
```javascript
let errorType = classifyError(error);
switch (errorType) {
    case "retryable":
        await retry();
        break;
    case "recoverable":
        let recovery = await attemptRecovery(error);
        if (recovery.success) continue;
        // fall through
    case "non_retryable":
        throw error;
}
```

**Pattern: Abort Propagation**
```javascript
// Create sibling controller
let siblingAbort = cloneAbortController(mainAbort);

// On error, abort siblings
siblingAbort.abort("sibling_error");

// Siblings check abort reason
if (abortController.signal.aborted) {
    return createSyntheticError(abortController.signal.reason);
}
```

---

## Related Documents

> LLM Core Module:
> - [error_recovery.md](../03_llm_core/error_recovery.md) - Detailed error handling
> - [stream_processing.md](../03_llm_core/stream_processing.md) - SSE error handling

> UI Module:
> - [dialog_system.md](../02_ui/dialog_system.md) - Dialog cancel behavior

> Joint Analysis:
> - [cli_ui_llm_joint_complete.md](../00_overview/cli_ui_llm_joint_complete.md) - Complete joint analysis

> Symbol Index:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols