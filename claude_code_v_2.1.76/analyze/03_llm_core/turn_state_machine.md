# Turn State Machine (Claude Code 2.1.76)

> Deep analysis of the agent loop turn state management, state transitions, and recovery mechanisms.
>
> **Symbol Validation Status**: ✅ VERIFIED - All symbols cross-validated against source code on 2026-03-25.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `mainAgentLoop` (Yh) - Main agent loop async generator at chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Inner implementation at chunks.148.mjs:882
- `StreamingToolExecutor` (ui6) - Parallel tool execution at chunks.173.mjs:3
- `streamingQueryCore` (mGq) - Full SSE implementation at chunks.171.mjs:3
- `getSessionGates` (RKq) - Feature flags at chunks.148.mjs:816
- `getModelCallHelpers` (SKq) - Helper factory at chunks.148.mjs:834

---

## Overview

The turn state machine is the heart of Claude Code's agent loop. It manages:

1. **Conversation state** across multiple turns
2. **Tool execution** coordination
3. **Compaction** tracking and recovery
4. **Error handling** and retry logic

---

## Turn State Object

### State Structure

```javascript
// ============================================
// Turn State Object - Mutable state across turns
// Location: chunks.148.mjs:892-903
// ============================================

// ORIGINAL (for source lookup):
J = {
    messages: A.messages,
    toolUseContext: A.toolUseContext,
    maxOutputTokensOverride: A.maxOutputTokensOverride,
    autoCompactTracking: void 0,
    stopHookActive: void 0,
    maxOutputTokensRecoveryCount: 0,
    hasAttemptedReactiveCompact: !1,
    turnCount: 1,
    pendingToolUseSummary: void 0,
    transition: void 0
}

// READABLE (for understanding):
let turnState = {
    // Core conversation data
    messages: params.messages,              // Conversation history array
    toolUseContext: params.toolUseContext,  // Permission/session context

    // Token management
    maxOutputTokensOverride: params.maxOutputTokensOverride,  // Token limit override

    // Compaction tracking
    autoCompactTracking: undefined,         // Tracks compaction state
    hasAttemptedReactiveCompact: false,     // Prevents infinite compaction

    // Error recovery
    maxOutputTokensRecoveryCount: 0,        // Retry counter for max_tokens errors

    // Turn management
    turnCount: 1,                           // Current turn number
    pendingToolUseSummary: undefined,       // Tool summary for next turn
    stopHookActive: undefined,              // Hook control flag

    // Mode transition
    transition: undefined                   // Mode transition state
};

// Mapping: J→turnState, A→params
```

### Why This Design?

**Single mutable object rationale:**

1. **State coherence**: All state changes happen through a single reference
2. **Recovery friendly**: State can be rolled back on errors
3. **Compact tracking**: Prevents infinite compaction loops
4. **Turn counting**: Enables turn-based behaviors (e.g., maxTurns)

---

## State Transitions

### Turn Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TURN LIFECYCLE STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TURN START                                    │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  State: { turnCount: N, messages: [...], ... }                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    1. MICRO-COMPACT PHASE                            │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  • Remove consecutive duplicate messages                            │    │
│  │  • Preserve message order                                           │    │
│  │  • Track: query_microcompact_start → query_microcompact_end        │    │
│  │                                                                      │    │
│  │  Decision: Continue to autocompact?                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    2. AUTO-COMPACT PHASE                             │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  • Check: tokenCount >= threshold?                                  │    │
│  │  • Check: consecutiveFailures < 3?                                  │    │
│  │  • Check: !DISABLE_AUTO_COMPACT?                                    │    │
│  │                                                                      │    │
│  │  If triggered:                                                       │    │
│  │    • Create summary of old messages                                 │    │
│  │    • Replace old messages with summary                              │    │
│  │    • Update autoCompactTracking                                     │    │
│  │    • Yield summary message to UI                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    3. CONTEXT LIMIT CHECK                            │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  • Check: isAtBlockingLimit(tokenCount, model)?                     │    │
│  │                                                                      │    │
│  │  If at limit:                                                        │    │
│  │    • Yield error event                                               │    │
│  │    • Return { reason: "blocking_limit" }                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    4. LLM REQUEST PHASE                              │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  • Build tool schemas (with deferred loading)                       │    │
│  │  • Normalize messages (normalizeMessages/cM)                        │    │
│  │  • Build system prompt                                              │    │
│  │  • Call streamingQueryCore (mGq)                                    │    │
│  │                                                                      │    │
│  │  Yield events:                                                       │    │
│  │    • stream_request_start                                           │    │
│  │    • stream_event (SSE events)                                      │    │
│  │    • assistant (completed messages)                                 │    │
│  │    • user (tool results)                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    5. TOOL EXECUTION PHASE                           │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  • Collect tool_use blocks from response                            │    │
│  │  • Create StreamingToolExecutor (ui6)                               │    │
│  │  • Execute tools (parallel for concurrency-safe)                    │    │
│  │  • Collect tool results                                             │    │
│  │                                                                      │    │
│  │  State updates:                                                      │    │
│  │    • messages: [...messages, tool_results]                          │    │
│  │    • turnCount: turnCount + 1                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    6. TURN COMPLETION                                │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  Decision: Continue or stop?                                        │    │
│  │                                                                      │    │
│  │  Continue if:                                                        │    │
│  │    • Tools were called AND no stop reason                           │    │
│  │    • Not at maxTurns limit                                          │    │
│  │    • No stop hook active                                            │    │
│  │                                                                      │    │
│  │  Stop if:                                                            │    │
│  │    • No tools called (end_turn)                                     │    │
│  │    • Max turns reached                                              │    │
│  │    • Error occurred                                                 │    │
│  │    • Stop hook triggered                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Transition Code

```javascript
// ============================================
// Main Turn Loop - State transitions
// Location: chunks.148.mjs:904-1074
// ============================================

// ORIGINAL (for source lookup):
while (!0) {
    let {
        toolUseContext: X
    } = J, {
        messages: P,
        autoCompactTracking: W,
        maxOutputTokensRecoveryCount: Z,
        hasAttemptedReactiveCompact: G,
        maxOutputTokensOverride: f,
        pendingToolUseSummary: v,
        stopHookActive: N,
        turnCount: V
    } = J;
    // ... microcompact, autocompact, LLM request, tool execution
}

// READABLE (for understanding):
while (true) {
    // Extract current state
    const {
        toolUseContext,
        messages,
        autoCompactTracking,
        maxOutputTokensRecoveryCount,
        hasAttemptedReactiveCompact,
        maxOutputTokensOverride,
        pendingToolUseSummary,
        stopHookActive,
        turnCount
    } = turnState;

    // Phase 1: Micro-compact
    messages = await helpers.microcompact(messages, toolUseContext, querySource);

    // Phase 2: Auto-compact
    const { compactionResult, consecutiveFailures } =
        await helpers.autocompact(messages, toolUseContext, ...);

    if (compactionResult) {
        // Update tracking on successful compaction
        autoCompactTracking = {
            compacted: true,
            turnId: helpers.uuid(),
            turnCounter: 0,
            consecutiveFailures: 0
        };
        // Yield summary messages
        yield* compactionResult.summaryMessages;
    }

    // Phase 3: Context limit check
    if (isAtBlockingLimit(tokenCount, model)) {
        yield createErrorEvent(BLOCKING_LIMIT_ERROR);
        return { reason: "blocking_limit" };
    }

    // Phase 4: LLM Request
    for await (const event of helpers.callModel({
        messages,
        systemPrompt,
        tools,
        options: { model, thinkingConfig, ... }
    })) {
        // Process streaming events
        if (event.type === "assistant") {
            // Add to messages
        }
        yield event;
    }

    // Phase 5: Tool Execution
    if (toolUseBlocks.length > 0) {
        const executor = new StreamingToolExecutor(tools, canUseTool, toolUseContext);
        for (const block of toolUseBlocks) {
            executor.addTool(block, assistantMessage);
        }
        for await (const result of executor.getRemainingResults()) {
            yield result;
        }

        // Update state for next turn
        turnState.messages = [...messages, toolResults];
        turnState.turnCount = turnCount + 1;
        continue; // Next turn
    }

    // Phase 6: No tools = end conversation
    break;
}

// Mapping: J→turnState, X→toolUseContext, P→messages, W→autoCompactTracking
```

---

## Auto-Compact Tracking

### Tracking Object Structure

```javascript
// ============================================
// autoCompactTracking - Compaction state tracking
// Location: chunks.148.mjs:896
// ============================================

// READABLE (for understanding):
interface AutoCompactTracking {
    compacted: boolean;        // Was compaction performed?
    turnId: string;            // Turn ID when compacted
    turnCounter: number;       // Turns since compaction
    consecutiveFailures: number; // Circuit breaker counter
}

// Example states:
const noCompaction = {
    compacted: false,
    turnId: "",
    turnCounter: 0
};

const afterCompaction = {
    compacted: true,
    turnId: "uuid-12345",
    turnCounter: 0,
    consecutiveFailures: 0
};

const afterFailure = {
    compacted: false,
    turnId: "",
    turnCounter: 5,
    consecutiveFailures: 2  // Incremented on failure
};
```

### Circuit Breaker Logic

**Why circuit breaker?**

The circuit breaker prevents infinite compaction loops that could occur when:
1. Compaction fails repeatedly
2. Context keeps growing despite compaction
3. API errors during compaction

```javascript
// ============================================
// Circuit Breaker - Prevents infinite compaction
// Location: chunks.148.mjs:980-987
// ============================================

// ORIGINAL (for source lookup):
} else if (r !== void 0) g = {
    ...g ?? {
        compacted: !1,
        turnId: "",
        turnCounter: 0
    },
    consecutiveFailures: r
};

// READABLE (for understanding):
if (compactionFailed) {
    autoCompactTracking = {
        ...autoCompactTracking ?? {
            compacted: false,
            turnId: "",
            turnCounter: 0
        },
        consecutiveFailures: failureCount
    };
}

// Max consecutive failures = 3 (from kv6.maxConsecutiveUnavailable)
// If consecutiveFailures >= 3, auto-compact is disabled for this session
```

**Circuit breaker state machine:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CIRCUIT BREAKER STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐                                                            │
│  │   NORMAL    │ ←──────────────────────────────────┐                      │
│  │   (0-1)     │                                    │                      │
│  │             │                                    │                      │
│  │ Auto-compact│     Compaction succeeds            │                      │
│  │ enabled     │ ──────────────────────────────────►│                      │
│  └──────┬──────┘                                    │                      │
│         │                                           │                      │
│         │ Compaction fails                          │                      │
│         ▼                                           │                      │
│  ┌─────────────┐                                    │                      │
│  │  WARNING    │                                    │                      │
│  │   (2)       │                                    │                      │
│  │             │                                    │                      │
│  │ Still       │     Compaction succeeds            │                      │
│  │ enabled     │ ──────────────────────────────────►│                      │
│  └──────┬──────┘                                    │                      │
│         │                                           │                      │
│         │ Compaction fails                          │                      │
│         ▼                                           │                      │
│  ┌─────────────┐                                    │                      │
│  │   TRIPPED   │                                    │                      │
│  │   (3+)      │                                    │                      │
│  │             │                                    │                      │
│  │ Auto-compact│                                    │                      │
│  │ DISABLED    │ ───────────────────────────────────┘                      │
│  │             │     (Requires session restart to reset)                   │
│  └─────────────┘                                                            │
│                                                                              │
│  States:                                                                     │
│  • NORMAL (0-1 failures): Auto-compact fully enabled                        │
│  • WARNING (2 failures): Auto-compact still enabled, logging warn          │
│  • TRIPPED (3+ failures): Auto-compact disabled, user must intervene       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Error Recovery

### Max Tokens Recovery

When the LLM hits `max_tokens` limit, the agent loop can attempt recovery:

```javascript
// ============================================
// Max Tokens Recovery - Retry with adjusted limits
// Location: chunks.148.mjs (inferred from state)
// ============================================

// State tracking for recovery
let maxOutputTokensRecoveryCount = 0;
const MAX_RECOVERY_ATTEMPTS = 3;

// Recovery logic (pseudo-code based on state)
if (event.stop_reason === "max_tokens") {
    if (maxOutputTokensRecoveryCount < MAX_RECOVERY_ATTEMPTS) {
        // Try again with smaller context
        maxOutputTokensRecoveryCount++;

        // Option 1: Reduce max output tokens
        maxOutputTokensOverride = Math.floor(maxOutputTokensOverride * 0.8);

        // Option 2: Trigger reactive compact
        if (!hasAttemptedReactiveCompact) {
            hasAttemptedReactiveCompact = true;
            // Re-run autocompact with more aggressive settings
        }

        // Retry the turn
        continue;
    } else {
        // Give up and report error
        yield createMaxTokensError(maxOutputTokensOverride);
    }
}
```

### Streaming Fallback

When streaming fails, fallback to non-streaming:

```javascript
// ============================================
// Streaming Fallback - Non-streaming recovery
// Location: chunks.171.mjs:471-493
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
if (isFeatureDisabled("streaming_to_non_streaming_fallback")) {
    // Don't attempt fallback
    logError("Streaming failed, fallback disabled");
    track("streaming_fallback_to_non_streaming", { fallback_disabled: true });
    throw error;
}

// Attempt non-streaming fallback
logError("Streaming failed, falling back to non-streaming mode");
track("streaming_fallback_to_non_streaming", {
    model,
    error: error.name,
    attemptNumber,
    maxOutputTokens,
    thinkingType
});

// Call non-streaming API
yield* nonStreamingFallback(params);
```

---

## Hook Integration

### Stop Hook

The `stopHookActive` flag allows hooks to stop the agent loop:

```javascript
// ============================================
// Stop Hook - Hook can stop the loop
// Location: chunks.148.mjs:897
// ============================================

// State field
stopHookActive: undefined | true

// Check in turn completion
if (stopHookActive) {
    // Hook requested stop
    return { reason: "stop_hook" };
}

// Hook sets this via:
// toolUseContext.setStopHookActive(true)
```

---

## Key Algorithms

### 1. Token Counting Strategy

```javascript
// ============================================
// Token Counting - Pre-compaction check
// Location: chunks.148.mjs:1008-1018
// ============================================

// Calculate current token count
const currentTokens = countTokens(messages) - microcompactSavings;

// Check against model-specific threshold
const threshold = getAutoCompactThreshold(model);

// Trigger conditions
const shouldCompact =
    currentTokens >= threshold &&
    !DISABLE_AUTO_COMPACT &&
    consecutiveFailures < 3;
```

### 2. Message Merging

Messages are merged when consecutive user messages appear:

```javascript
// ============================================
// Message Merging - Combine consecutive user messages
// Location: chunks.173.mjs:2082-2088
// ============================================

// ORIGINAL (for source lookup):
let P = fL(w);
if (P?.type === "user") {
    w[w.length - 1] = an8(P, D);
    return
}
w.push(D);

// READABLE (for understanding):
const lastMessage = messages[messages.length - 1];
if (lastMessage?.type === "user") {
    // Merge new content into existing user message
    messages[messages.length - 1] = mergeUserMessages(lastMessage, newMessage);
    return;
}
// Otherwise, append as new message
messages.push(newMessage);
```

---

## Performance Considerations

### Turn Profiling

Claude Code includes built-in profiling for performance analysis:

```javascript
// ============================================
// Turn Profiling - Performance tracking
// Location: chunks.173.mjs:250-376
// ============================================

// Profile checkpoints
const CHECKPOINTS = [
    "query_fn_entry",
    "query_microcompact_start",
    "query_microcompact_end",
    "query_autocompact_start",
    "query_autocompact_end",
    "query_setup_start",
    "query_setup_end",
    "query_tool_schema_build_start",
    "query_tool_schema_build_end",
    "query_message_normalization_start",
    "query_message_normalization_end",
    "query_client_creation_start",
    "query_client_creation_end",
    "query_api_request_sent",
    "query_first_chunk_received"
];

// Enable with: CLAUDE_CODE_PROFILE_QUERY=1
// Output: Detailed timing report for each phase
```

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Agent Loop | chunks.148.mjs | `mainAgentLoop` (Yh), `mainAgentLoopCore` (omY) |
| Streaming | chunks.171.mjs | `streamingQueryCore` (mGq) |
| Tool Executor | chunks.173.mjs | `StreamingToolExecutor` (ui6) |
| State Store | chunks.85.mjs | `createStateStore` (WX1) |
| Message Normalization | chunks.173.mjs | `normalizeMessages` (cM) |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Turn state machine documented with source verification