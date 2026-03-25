# Turn Management Complete Analysis (Claude Code v2.1.76)

> Deep analysis of the agent loop turn state management, transitions, and recovery mechanisms.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Source-Level**: Includes both original obfuscated and readable pseudocode.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `mainAgentLoop` (Yh) - Main agent loop async generator at chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Inner implementation at chunks.148.mjs:882
- `StreamingToolExecutor` (ui6) - Parallel tool execution at chunks.148.mjs:3
- `streamingQueryCore` (mGq) - Full SSE implementation at chunks.171.mjs:3
- `getSessionGates` (RKq) - Feature flags at chunks.148.mjs:816
- `getModelCallHelpers` (SKq) - Helper factory at chunks.148.mjs:834

---

## 1. Turn State Object

### 1.1 State Structure

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

### 1.2 Why This Design?

**Single mutable object rationale:**

1. **State coherence**: All state changes happen through a single reference
2. **Recovery friendly**: State can be rolled back on errors
3. **Compact tracking**: Prevents infinite compaction loops
4. **Turn counting**: Enables turn-based behaviors (e.g., maxTurns)

---

## 2. Turn Lifecycle

### 2.1 Complete Turn Flow

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
│  │                    4. ATTACHMENT ASSEMBLY                            │    │
│  │  ───────────────────────────────────────────────────────────────    │    │
│  │  • assembleAllAttachments(userMessage, context, ...)                │    │
│  │  • Produce 40+ types of system reminders                            │    │
│  │  • Prepend attachments before user message                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    5. LLM REQUEST PHASE                              │    │
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
│  │                    6. TOOL EXECUTION PHASE                           │    │
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
│  │                    7. TURN COMPLETION                                │    │
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

---

## 3. Micro-Compact Phase

### 3.1 Algorithm

**What it does**: Removes consecutive duplicate messages to reduce token usage.

**How it works**:
1. Iterate through messages
2. Compare each message with previous
3. Remove if identical (role + content)
4. Preserve message order

**Why this approach**:
- Simple O(n) algorithm
- Catches common duplication patterns
- No LLM call required (fast)

```javascript
// ============================================
// microcompact - Remove consecutive duplicates
// Location: chunks.133.mjs:991
// ============================================

// ORIGINAL (for source lookup):
function pg(A) {
    let q = [];
    for (let K of A) {
        let Y = q[q.length - 1];
        if (Y && Y.role === K.role && JSON.stringify(Y.content) === JSON.stringify(K.content)) continue;
        q.push(K)
    }
    return q
}

// READABLE (for understanding):
function microcompact(messages) {
    let deduped = [];

    for (let message of messages) {
        let previous = deduped[deduped.length - 1];

        // Skip if consecutive duplicate (same role and content)
        if (previous &&
            previous.role === message.role &&
            JSON.stringify(previous.content) === JSON.stringify(message.content)) {
            continue;
        }

        deduped.push(message);
    }

    return deduped;
}

// Mapping: pg→microcompact, A→messages, q→deduped
```

---

## 4. Auto-Compact Phase

### 4.1 Trigger Conditions

```javascript
// ============================================
// shouldTriggerAutoCompaction - Trigger check
// Location: chunks.147.mjs:2600-2650
// ============================================

// READABLE (for understanding):
function shouldTriggerAutoCompaction(messages, model) {
    // Check 1: Disabled via environment
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return false;
    }

    // Check 2: Get token count
    let tokenCount = estimateTokenCount(messages, model);

    // Check 3: Get threshold for model
    let threshold = getContextThreshold(model);

    // Check 4: Token count exceeds threshold
    return tokenCount >= threshold;
}

// Typical thresholds:
// - claude-sonnet-4: ~160K tokens (80% of 200K)
// - claude-opus-4: ~160K tokens (80% of 200K)
```

### 4.2 Auto-Compact Execution

```javascript
// ============================================
// autoCompact - Execute compaction
// Location: chunks.147.mjs:2633-2700
// ============================================

// ORIGINAL (for source lookup):
async function sqq(A, q, K, Y, z, _) {
    if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
    // ... compaction logic
}

// READABLE (for understanding):
async function autoCompact(messages, toolUseContext, sessionMemoryType, sessionMemoryPath, helpers, abortSignal) {
    // Check disabled
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    // Check consecutive failure limit
    if (consecutiveFailures >= MAX_CONSECUTIVE_COMPACT_FAILURES) {
        logError("Auto-compact disabled: too many consecutive failures");
        return { wasCompacted: false, reason: "circuit_breaker" };
    }

    // Get token count
    let tokenCount = helpers.estimateTokens(messages);

    // Check threshold
    if (tokenCount < threshold) {
        return { wasCompacted: false, reason: "below_threshold" };
    }

    try {
        // Create summary of old messages
        let summaryResult = await createSummary(
            messages.slice(0, -RECENT_MESSAGES_TO_KEEP),
            helpers,
            abortSignal
        );

        if (summaryResult.error) {
            consecutiveFailures++;
            return { wasCompacted: false, error: summaryResult.error };
        }

        // Replace old messages with summary
        let compactedMessages = [
            createUserMessage({
                content: `<conversation_summary>\n${summaryResult.summary}\n</conversation_summary>`,
                isMeta: true
            }),
            ...messages.slice(-RECENT_MESSAGES_TO_KEEP)
        ];

        // Reset failure counter on success
        consecutiveFailures = 0;

        return {
            wasCompacted: true,
            messages: compactedMessages,
            summaryEvents: [createSummaryEvent(summaryResult.summary)]
        };
    } catch (error) {
        consecutiveFailures++;
        return { wasCompacted: false, error };
    }
}

// Mapping: sqq→autoCompact, Y0→parseBoolean
```

### 4.3 Circuit Breaker

**MAX_CONSECUTIVE_COMPACT_FAILURES = 3**

After 3 consecutive failures, auto-compact is disabled to prevent infinite loops. This protects against:
- API errors during summarization
- Context overflow during summarization
- Network failures

---

## 5. Error Recovery

### 5.1 Context Overflow Recovery

```javascript
// ============================================
// Context Overflow Recovery
// Location: chunks.89.mjs:110-150
// ============================================

// READABLE (for understanding):
async function handleContextOverflow(error, turnState, helpers) {
    // Parse error to get token counts
    let { inputTokens, outputTokens, maxTokens } = parseContextOverflowError(error);

    if (!inputTokens) {
        // Can't recover - unknown error
        return { recovered: false };
    }

    // Check if we've already tried recovery
    if (turnState.maxOutputTokensRecoveryCount >= MAX_RECOVERY_ATTEMPTS) {
        return { recovered: false, reason: "max_recovery_attempts" };
    }

    // Strategy: Reduce output tokens
    let newMaxOutputTokens = Math.max(
        FLOOR_OUTPUT_TOKENS,  // Minimum 3000
        maxTokens - inputTokens - BUFFER_TOKENS
    );

    turnState.maxOutputTokensOverride = newMaxOutputTokens;
    turnState.maxOutputTokensRecoveryCount++;

    log(`Context overflow recovery: reducing max_output_tokens to ${newMaxOutputTokens}`);

    return { recovered: true, newMaxOutputTokens };
}
```

### 5.2 Max Output Tokens Detection

```javascript
// ============================================
// isMaxOutputTokens - Detect max_tokens hit
// Location: chunks.148.mjs:871
// ============================================

// ORIGINAL (for source lookup):
function bKq(A) {
    return A?.type === "assistant" && A.apiError === "max_output_tokens"
}

// READABLE (for understanding):
function isMaxOutputTokens(message) {
    return message?.type === "assistant" &&
           message.apiError === "max_output_tokens";
}

// Mapping: bKq→isMaxOutputTokens
```

---

## 6. Turn Completion Logic

### 6.1 Continue vs Stop Decision

```javascript
// ============================================
// Turn Completion Decision
// Location: chunks.148.mjs:1050-1100
// ============================================

// READABLE (for understanding):
function shouldContinueTurn(toolUseBlocks, turnState, params) {
    // Stop if no tools were called
    if (toolUseBlocks.length === 0) {
        return { continue: false, reason: "end_turn" };
    }

    // Stop if max turns reached
    if (params.maxTurns && turnState.turnCount >= params.maxTurns) {
        return { continue: false, reason: "max_turns" };
    }

    // Stop if stop hook is active
    if (turnState.stopHookActive) {
        return { continue: false, reason: "stop_hook" };
    }

    // Stop if abort controller is aborted
    if (turnState.toolUseContext.abortController.signal.aborted) {
        return { continue: false, reason: "aborted" };
    }

    // Continue to next turn
    return { continue: true };
}
```

### 6.2 Turn State Updates

```javascript
// On continue to next turn:
turnState.messages = [...turnState.messages, assistantMessage, toolResultMessage];
turnState.turnCount = turnState.turnCount + 1;
turnState.pendingToolUseSummary = createToolUseSummary(toolUseBlocks);

// On stop:
// Return final result to caller
return {
    reason: stopReason,
    messages: turnState.messages,
    turnCount: turnState.turnCount
};
```

---

## 7. Tool Execution Coordination

### 7.1 StreamingToolExecutor Integration

```javascript
// ============================================
// Tool Execution in Turn Loop
// Location: chunks.148.mjs:950-1000
// ============================================

// READABLE (for understanding):
// After receiving assistant message with tool_use blocks:

if (toolUseBlocks.length > 0) {
    // Create executor
    let executor = new StreamingToolExecutor(
        tools,
        canUseTool,
        turnState.toolUseContext
    );

    // Add all tool_use blocks
    for (let block of toolUseBlocks) {
        executor.addTool(block, assistantMessage);
    }

    // Collect results
    let toolResults = [];
    for await (let result of executor.getRemainingResults()) {
        yield result;  // Stream to UI

        if (result.type === "tool_result") {
            toolResults.push(result.message);
        }
    }

    // Check for sibling abort
    if (executor.hasErrored) {
        // One of the tools failed, all were cancelled
        log("Tool execution cancelled due to sibling error");
    }

    // Update turn state
    turnState.messages = [
        ...turnState.messages,
        assistantMessage,
        createUserMessage({
            content: toolResults,
            role: "user"
        })
    ];

    turnState.turnCount++;

    // Continue to next turn
    continue;
}
```

---

## 8. Key Insights

### 8.1 Design Decisions

**Why mutable turn state?**
- Single reference for all state
- Easy to pass to helpers
- Simple recovery on error

**Why micro-compact before auto-compact?**
- Micro-compact is fast (no LLM call)
- Catches common duplication patterns
- Reduces load on auto-compact

**Why circuit breaker for auto-compact?**
- Prevents infinite retry loops
- Graceful degradation
- Logs failures for debugging

### 8.2 Common Patterns

**Pattern: Generator-based streaming**
```javascript
async function* mainAgentLoop(params) {
    // ...
    for await (let event of helpers.callModel(...)) {
        yield event;  // Stream to caller
    }
    // ...
}
```

**Pattern: State accumulation**
```javascript
let turnState = { ...initialState };

while (true) {
    // Modify turnState in place
    turnState.messages = [...];

    if (shouldStop) break;
}

return turnState;
```

---

## Related Documents

> LLM Core Module:
> - [agent_loop.md](../03_llm_core/agent_loop.md) - Agent loop details
> - [stream_processing.md](../03_llm_core/stream_processing.md) - SSE processing
> - [tool_executor_queue.md](../03_llm_core/tool_executor_queue.md) - Tool executor

> Joint Analysis:
> - [cli_ui_llm_joint_complete_v4.md](../00_overview/cli_ui_llm_joint_complete_v4.md) - Complete joint analysis

> Symbol Index:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols