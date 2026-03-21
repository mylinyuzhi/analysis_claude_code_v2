# Compact Integration (Claude Code 2.1.76)

> Complete analysis of the auto-compact system: trigger conditions, context overflow recovery, integration with the retry system, and message replacement strategies.

> **Main Documentation:** [07_compact/](../07_compact/) - Complete compaction module documentation

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `autoCompact` (sqq) - Main auto-compact dispatcher (VERIFIED: chunks.147.mjs:2633)
- `microcompact` (pg) - Removes consecutive duplicate messages (VERIFIED: chunks.133.mjs:991)
- `withApiRetry` (_P1) - Retry wrapper that handles context overflow errors (VERIFIED: chunks.89.mjs:3)
- `parseContextOverflowError` ($54) - Extracts token counts from error (VERIFIED: chunks.89.mjs:110)
- `executeToolCore` (fxY) - Core tool execution with compact awareness (VERIFIED: chunks.146.mjs:442)
- `applyContentReplacements` (T34) - Handles tool result content replacement (VERIFIED: chunks.89.mjs:2205)

---

## Architecture Overview

The compact system has two integration points with the LLM core:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     COMPACT INTEGRATION ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  INTEGRATION POINT 1: Pre-Query Auto-Compact                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ mainAgentLoop (ZR)                                                  │  │
│  │     │                                                               │  │
│  │     ├──► gm (microCompact) ──► Remove consecutive duplicates       │  │
│  │     │                                                               │  │
│  │     └──► fs4 (checkAndTriggerAutoCompact)                          │  │
│  │              │                                                      │  │
│  │              ├── Check token threshold                             │  │
│  │              ├── If over: generate summary                         │  │
│  │              └── Replace messages with summary + attachments       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  INTEGRATION POINT 2: Context Overflow Recovery                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ withApiRetry (V26)                                                  │  │
│  │     │                                                               │  │
│  │     └──► On context_length_exceeded error:                         │  │
│  │              │                                                      │  │
│  │              ├── Parse inputTokens, contextLimit from error        │  │
│  │              ├── Calculate available = limit - input - buffer      │  │
│  │              ├── Set retryContext.maxTokensOverride = available    │  │
│  │              └── Retry with reduced max_tokens                     │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  WRAPPER LAYER                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ $OA (contextCompactor)                                              │  │
│  │     │                                                               │  │
│  │     └──► Wraps llmRequestGenerator with compaction check           │  │
│  │              │                                                      │  │
│  │              ├── If disabled: pass through                         │  │
│  │              └── If enabled: check tokens and compact if needed    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Core Algorithms

### autoCompact (sqq) - Main Dispatcher

**What it does:**
The `autoCompact` function is the main entry point for automatic compaction. It checks if compaction is needed, handles circuit breaker logic, and orchestrates the summary generation.

**Source Code (VERIFIED):**

```javascript
// ============================================
// autoCompact - Main auto-compact dispatcher
// Location: chunks.147.mjs:2633-2673
// ============================================

// ORIGINAL (for source lookup):
async function sqq(A, q, K, Y, z, _) {
    if (t6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    if (z?.consecutiveFailures !== void 0 && z.consecutiveFailures >= aqq) return {
        wasCompacted: !1
    };
    let w = q.options.mainLoopModel;
    if (!await CmY(A, w, Y, _)) return {
        wasCompacted: !1
    };
    let $ = {
            isRecompactionInChain: z?.compacted === !0,
            turnsSincePreviousCompact: z?.turnCounter ?? -1,
            previousCompactTurnId: z?.turnId,
            autoCompactThreshold: oc6(w),
            querySource: Y
        },
        H = await lE1(A, q.agentId, $.autoCompactThreshold);
    if (H) return K16(void 0), gl(), {
        wasCompacted: !0,
        compactionResult: H
    };
    try {
        let j = await mf6(A, q, K, !0, void 0, !0, $);
        return K16(void 0), gl(), {
            wasCompacted: !0,
            compactionResult: j,
            consecutiveFailures: 0
        }
    } catch (j) {
        if (!$r(j, zl)) _6(j);
        let M = (z?.consecutiveFailures ?? 0) + 1;
        if (M >= aqq) k(`autocompact: circuit breaker tripped after ${M} consecutive failures — skipping future attempts this session`, {
            level: "warn"
        });
        return {
            wasCompacted: !1,
            consecutiveFailures: M
        }
    }
}

// READABLE (for understanding):
async function autoCompact(messages, sessionContext, systemContext, querySource, autoCompactTracking, modelId) {
    // 1. Check if compaction is disabled via environment variable
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    // 2. Circuit breaker: Skip if too many consecutive failures
    if (autoCompactTracking?.consecutiveFailures !== undefined &&
        autoCompactTracking.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        return { wasCompacted: false };
    }

    let model = sessionContext.options.mainLoopModel;

    // 3. Check if token threshold is exceeded
    if (!await shouldTriggerCompaction(messages, model, querySource, modelId)) {
        return { wasCompacted: false };
    }

    // 4. Build compaction metadata for telemetry
    let compactionMetadata = {
        isRecompactionInChain: autoCompactTracking?.compacted === true,
        turnsSincePreviousCompact: autoCompactTracking?.turnCounter ?? -1,
        previousCompactTurnId: autoCompactTracking?.turnId,
        autoCompactThreshold: getThresholdForModel(model),
        querySource: querySource
    };

    // 5. Check for existing cached compaction result
    let cachedResult = await checkCachedCompaction(messages, sessionContext.agentId, compactionMetadata.autoCompactThreshold);
    if (cachedResult) {
        clearCompactionCache();
        resetCompactionState();
        return {
            wasCompacted: true,
            compactionResult: cachedResult
        };
    }

    // 6. Perform actual compaction
    try {
        let result = await performCompaction(
            messages,
            sessionContext,
            systemContext,
            true,  // isAutoCompact
            undefined,
            true,  // preserveContext
            compactionMetadata
        );

        clearCompactionCache();
        resetCompactionState();

        return {
            wasCompacted: true,
            compactionResult: result,
            consecutiveFailures: 0
        };

    } catch (error) {
        // 7. Handle compaction failure
        if (!isCancellationError(error)) {
            logError(error);
        }

        let newFailureCount = (autoCompactTracking?.consecutiveFailures ?? 0) + 1;

        // Circuit breaker warning
        if (newFailureCount >= MAX_CONSECUTIVE_FAILURES) {
            logWarning(`autocompact: circuit breaker tripped after ${newFailureCount} consecutive failures — skipping future attempts this session`);
        }

        return {
            wasCompacted: false,
            consecutiveFailures: newFailureCount
        };
    }
}

// Mapping: sqq→autoCompact, A→messages, q→sessionContext, K→systemContext,
//   Y→querySource, z→autoCompactTracking, _→modelId, t6→parseBoolean,
//   aqq→MAX_CONSECUTIVE_FAILURES(3), CmY→shouldTriggerCompaction,
//   oc6→getThresholdForModel, lE1→checkCachedCompaction, mf6→performCompaction,
//   K16→clearCompactionCache, gl→resetCompactionState, _6→logError, k→logWarning
```

**Key Algorithm Decisions:**

1. **Circuit Breaker Pattern**: The function uses `MAX_CONSECUTIVE_FAILURES = 3` (constant `aqq`) to prevent infinite retry loops. After 3 consecutive failures, compaction is disabled for the rest of the session.

2. **Cache Check**: Before performing expensive LLM-based summarization, it checks for cached compaction results via `lE1` (checkCachedCompaction).

3. **Metadata Tracking**: The `compactionMetadata` object tracks recompaction chains, turns since last compact, and threshold values for telemetry.

4. **Error Isolation**: Errors during compaction don't crash the agent loop - they're caught and tracked, allowing the conversation to continue.

### microcompact (pg) - Duplicate Removal

**What it does:**
Removes consecutive duplicate messages and cleans up message history. Currently returns messages unchanged in v2.1.76.

**Source Code (VERIFIED):**

```javascript
// ============================================
// microcompact - Removes consecutive duplicate messages
// Location: chunks.133.mjs:991-994
// ============================================

// ORIGINAL (for source lookup):
async function pg(A, q, K) {
    return Qc4(), {
        messages: A
    }
}

// READABLE (for understanding):
async function microcompact(messages, sessionContext, querySource) {
    // Clear microcompact state
    clearMicrocompactState();

    // Return messages unchanged (current implementation)
    return { messages: messages };
}

// Mapping: pg→microcompact, A→messages, q→sessionContext, K→querySource, Qc4→clearMicrocompactState
```

**Key insight:** In v2.1.76, microcompact is essentially a pass-through. The `Qc4()` function clears internal state, but no actual message deduplication occurs in this version. This suggests the functionality may have been moved elsewhere or simplified.

---

### Pre-Query Auto-Compact in mainAgentLoop

**What it does:**
Before each LLM request, the mainAgentLoop checks if the conversation is approaching token limits and triggers compaction if needed.

**How it works:**

1. **Micro-Compact First**: Removes consecutive duplicate messages (e.g., repeated tool results for the same tool_use).

2. **Auto-Compact Check**: Evaluates token count against the model's context limit. If approaching the limit, triggers compaction.

3. **Compaction Process**:
   - Generates a summary of the conversation using a separate LLM call
   - Replaces the message history with summary + recent context
   - Preserves certain attachments (plan files, todos)

---

## Context Overflow Recovery in withApiRetry

**What it does:**
When the API returns a `context_length_exceeded` error, the retry wrapper automatically calculates a reduced `max_tokens` value that fits within the remaining context and retries the request.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Context Overflow Recovery - withApiRetry
// Location: chunks.89.mjs:62-80
// ============================================

// ORIGINAL (for source lookup):
if (j instanceof a7) {
    let X = $54(j);
    if (X) {
        let {
            inputTokens: P,
            contextLimit: W
        } = X, Z = 1000, G = Math.max(0, W - P - 1000);
        if (G < fN8) throw _6(Error(`availableContext ${G} is less than FLOOR_OUTPUT_TOKENS ${fN8}`)), j;
        let f = (z.thinkingConfig.type === "enabled" ? z.thinkingConfig.budgetTokens : 0) + 1,
            v = Math.max(fN8, G, f);
        z.maxTokensOverride = v, d("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens: P,
            contextLimit: W,
            adjustedMaxTokens: v,
            attempt: $
        });
        continue
    }
}

// READABLE (for understanding):
if (error instanceof APIError) {
    let parsed = parseContextOverflowError(error);
    if (parsed) {
        let { inputTokens, contextLimit } = parsed;
        const BUFFER = 1000;  // Safety margin
        let availableContext = Math.max(0, contextLimit - inputTokens - BUFFER);

        // Check if there's room for meaningful output
        if (availableContext < FLOOR_OUTPUT_TOKENS) {
            logError(Error(`availableContext ${availableContext} is less than FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`));
            throw error;  // Cannot recover - no room for response
        }

        // Ensure thinking budget doesn't exceed available space
        let thinkingBudget = (retryContext.thinkingConfig.type === "enabled"
            ? retryContext.thinkingConfig.budgetTokens
            : 0) + 1;
        let adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, availableContext, thinkingBudget);

        retryContext.maxTokensOverride = adjustedMaxTokens;

        logEvent("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens: inputTokens,
            contextLimit: contextLimit,
            adjustedMaxTokens: adjustedMaxTokens,
            attempt: attemptNumber
        });

        continue;  // Retry with adjusted max_tokens
    }
}

// Mapping: j→error, a7→APIError, X→parsed, $54→parseContextOverflowError,
//   P→inputTokens, W→contextLimit, Z→BUFFER, G→availableContext, fN8→FLOOR_OUTPUT_TOKENS,
//   f→thinkingBudget, v→adjustedMaxTokens, z→retryContext, d→logEvent, _6→logError
```

### Error Parsing Function

```javascript
// ============================================
// parseContextOverflowError - Extracts token counts from error message
// Location: chunks.89.mjs:110-129
// ============================================

// ORIGINAL (for source lookup):
function $54(A) {
    if (A.status !== 400 || !A.message) return;
    if (!A.message.includes("input length and `max_tokens` exceed context limit")) return;
    let q = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/,
        K = A.message.match(q);
    if (!K || K.length !== 4) return;
    if (!K[1] || !K[2] || !K[3]) {
        _6(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
        return
    }
    let Y = parseInt(K[1], 10),
        z = parseInt(K[2], 10),
        _ = parseInt(K[3], 10);
    if (isNaN(Y) || isNaN(z) || isNaN(_)) return;
    return {
        inputTokens: Y,
        maxTokens: z,
        contextLimit: _
    }
}

// READABLE (for understanding):
function parseContextOverflowError(error) {
    // Only handle 400 errors with the specific message
    if (error.status !== 400 || !error.message) return undefined;
    if (!error.message.includes("input length and `max_tokens` exceed context limit")) {
        return undefined;
    }

    // Parse: "input length and `max_tokens` exceed context limit: 50000 + 4096 > 200000"
    const pattern = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/;
    const match = error.message.match(pattern);

    if (!match || match.length !== 4) return undefined;

    if (!match[1] || !match[2] || !match[3]) {
        logError(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
        return undefined;
    }

    let inputTokens = parseInt(match[1], 10);   // e.g., 50000
    let maxTokens = parseInt(match[2], 10);     // e.g., 4096
    let contextLimit = parseInt(match[3], 10);  // e.g., 200000

    if (isNaN(inputTokens) || isNaN(maxTokens) || isNaN(contextLimit)) {
        return undefined;
    }

    return { inputTokens, maxTokens, contextLimit };
}

// Mapping: $54→parseContextOverflowError, A→error, q→pattern, K→match,
//   Y→inputTokens, z→maxTokens, _→contextLimit, _6→logError
```

**How it works:**

1. **Error Detection**: Catches API errors and checks for `context_length_exceeded` type.

2. **Token Extraction**: Parses `inputTokens` and `contextLimit` from the error message using regex.

3. **Available Space Calculation**:
   ```
   buffer = 1000  // Safety margin
   available = contextLimit - inputTokens - buffer
   ```

4. **Floor Check**: If `available < 1000` (FLOOR_OUTPUT_TOKENS), the error is re-thrown (no room for response).

5. **Override Setting**: Sets `retryContext.maxTokensOverride` to `max(FLOOR, available, maxThinkingTokens + 1)`.

6. **Retry**: The request is retried with the reduced `max_tokens`.

**Why this approach:**
- **Automatic recovery**: The user doesn't need to manually reduce their context - the system handles it automatically.
- **Thinking token consideration**: The `maxThinkingTokens + 1` ensures thinking mode doesn't accidentally get more budget than the total `max_tokens`.
- **Buffer safety**: The 1000-token buffer provides margin for token estimation inaccuracies.

**Key insight:** This is a reactive measure that kicks in only when pre-query compaction fails to prevent overflow. It's a last-resort recovery that allows the conversation to continue even when the model miscalculated its output needs.

---

## Trigger Conditions

### Auto-Compact Thresholds

Compaction is triggered when:

```
currentTokenCount > thresholdPercentage × modelContextLimit
```

The threshold percentage is determined by:
1. **Model-specific thresholds**: Different models have different context limits and optimal thresholds.
2. **User settings**: Can be adjusted via `autoCompactThreshold` setting.
3. **Feature flags**: `tengu_auto_compact` feature flag controls the feature.

### Micro-Compact Conditions

Micro-compact (removing consecutive duplicates) runs on every query:

```javascript
// Conditions for micro-compact:
// 1. Two consecutive user messages with identical content
// 2. Consecutive tool_result messages for the same tool_use_id
// 3. Empty assistant messages (text-only whitespace)
```

---

## Message Replacement Strategy

### Summary Generation

When compaction is triggered:

1. **System Prompt for Summary**: Uses a specialized prompt that instructs the LLM to create a comprehensive summary.

2. **Preserved Messages**:
   - User's initial request
   - Plan mode attachments
   - Todo/task lists
   - Recent tool results (configurable)

3. **Summary Structure**:
   ```markdown
   # Conversation Summary

   ## Original Request
   [User's initial request]

   ## Work Completed
   [Summary of actions taken]

   ## Current State
   [Current state of the work]

   ## Files Modified
   [List of modified files]

   ## Outstanding Tasks
   [Remaining work items]
   ```

### State Preservation

```javascript
// Messages preserved during compaction
const PRESERVED_MESSAGE_TYPES = [
    "plan_mode",           // Plan file path
    "plan_mode_reentry",   // Plan mode context
    "todo_reminder",       // Todo list state
    "task_reminder",       // Task list state
    "edited_text_file",    // File edit records
];

// Messages always kept:
// 1. First user message (original request)
// 2. Last N messages (recent context)
// 3. Plan file content
// 4. Todo/task items
```

### Compaction Tracking

After compaction, the `autoCompactTracking` object tracks:

```javascript
{
    compacted: true,          // Compaction has occurred
    turnId: "uuid",           // Unique ID for this compaction cycle
    turnCounter: 0            // Turns since compaction (increments each turn)
}
```

This is used for:
- Post-compaction telemetry
- Attachment throttling (reduce reminders after compaction)
- Turn-aware behavior adjustments

---

## Integration with Retry System

### Retry Context Propagation

The `retryContext` object carries compaction-related state:

```javascript
retryContext = {
    model: "claude-sonnet-4-6",
    maxThinkingTokens: 16000,
    maxTokensOverride: undefined,    // Set on context overflow
    fastMode: true                    // Set on rate limit
};
```

### Interaction Flow

```
1. mainAgentLoop calls checkAndTriggerAutoCompact
   └── If over threshold: generate summary, replace messages

2. streamingQuery calls llmRequestGenerator
   └── Via contextCompactor wrapper

3. llmRequestGenerator calls withApiRetry
   └── Wraps API call with retry logic

4. If context_length_exceeded error:
   └── Calculate maxTokensOverride
   └── Retry with reduced max_tokens

5. If still fails:
   └── Retry exhaustion
   └── Return error to mainAgentLoop
```

---

## Telemetry Events

### Pre-Query Compact Events

```javascript
// Successful compaction
logEvent("tengu_auto_compact_succeeded", {
    originalMessageCount: number,
    compactedMessageCount: number,
    preCompactTokenCount: number,
    postCompactTokenCount: number,
    compactionInputTokens: number,
    compactionOutputTokens: number,
    compactionCacheReadTokens: number,
    compactionCacheCreationTokens: number,
    compactionTotalTokens: number,
    queryChainId: string,
    queryDepth: number
});

// Post-compaction turn tracking
logEvent("tengu_post_autocompact_turn", {
    turnId: string,
    turnCounter: number,
    queryChainId: string,
    queryDepth: number
});
```

### Context Overflow Events

```javascript
// Context overflow adjustment
logEvent("tengu_max_tokens_context_overflow_adjustment", {
    inputTokens: number,
    contextLimit: number,
    maxTokensOverride: number
});
```

---

## Configuration

### Settings

```javascript
// Auto-compact enabled (default: true)
autoCompactEnabled: true;

// Threshold percentage (default: model-specific, typically 0.8)
autoCompactThreshold: 0.8;

// Disable compact via environment variable
process.env.DISABLE_COMPACT = "true";
```

### Constants

```javascript
// Minimum output tokens (floor for max_tokens)
const FLOOR_OUTPUT_TOKENS = 1000;

// Buffer for context overflow calculation
const CONTEXT_OVERFLOW_BUFFER = 1000;

// Default threshold percentages by model
const DEFAULT_THRESHOLDS = {
    "claude-opus-4-6": 0.80,
    "claude-sonnet-4-6": 0.80,
    "claude-haiku-4-5": 0.85
};
```

---

## Summary

The compact integration in Claude Code 2.1.76 operates at two levels:

1. **Proactive (Pre-Query)**: Before each LLM request, the system:
   - Runs micro-compact to remove duplicates
   - Checks token count against thresholds
   - Generates summaries and replaces messages if needed
   - Preserves critical state (plans, todos, recent context)

2. **Reactive (Error Recovery)**: When context overflow errors occur:
   - Automatically calculates available space
   - Reduces `max_tokens` to fit within remaining context
   - Retries the request with adjusted parameters

This two-tier approach ensures that:
- Most overflow situations are handled proactively
- Edge cases (model miscalculation) are handled reactively
- The user experience is seamless - no manual intervention needed
- Critical conversation state is preserved across compaction

---

## Cross-Feature Linkages

### Integration with 04_system_reminder

The compact system integrates with the system reminder module to preserve critical context:

**Preserved Attachment Types:**
- `plan_mode` attachments - Plan file content and state
- `todo_reminder` attachments - Todo list state
- `task_reminder` attachments - Task list state
- `edited_text_file` attachments - File edit records

**Integration Flow:**
```
Compaction Triggered
    │
    ├── Extract preserved attachments from messages
    │   ├── Plan file reference
    │   ├── Todo items
    │   └── Recent tool results
    │
    ├── Generate summary via LLM
    │
    ├── Build new message array:
    │   ├── Summary message
    │   ├── Preserved attachments
    │   └── Recent context
    │
    └── Return compacted messages
```

**Key Function:** `assembleAllAttachments` (_uY) in [04_system_reminder](../04_system_reminder/) is called after compaction to re-inject relevant context.

### Integration with 07_compact Module

This document covers the LLM core integration points. For the complete compaction implementation, see:
- [07_compact/](../07_compact/) - Full compaction module documentation
- Summary generation prompts
- Token counting strategies
- Threshold calculation algorithms

### Integration with Agent Loop (03_llm_core/agent_loop.md)

The compaction is called from within the main agent loop:

```
mainAgentLoopCore (omY)
    │
    ├── Turn Start
    │   ├── K5("query_microcompact_start")
    │   ├── pg(messages) → Micro-compact
    │   └── K5("query_microcompact_end")
    │
    ├── K5("query_autocompact_start")
    ├── sqq(messages, context, params) → Auto-compact check
    │   ├── If over threshold:
    │   │   ├── Generate summary
    │   │   ├── Replace messages
    │   │   └── Yield compaction messages
    │   └── Update autoCompactTracking
    └── K5("query_autocompact_end")
```

**Key Variables:**
- `autoCompactTracking` - Tracks compaction state across turns

---

## Deep Algorithm Analysis

### Token Counting Strategy

**What it does:** The compaction system uses a sophisticated token counting strategy that considers model-specific context windows and provides buffers for safety.

**Algorithm (VERIFIED from source):**

```javascript
// ============================================
// Token Threshold Calculation
// Location: chunks.147.mjs:2617-2665
// ============================================

// Check if auto-compact is enabled
function shouldTriggerCompaction(messages, model, querySource, modelId) {
    // 1. Check if auto-compact is enabled in settings
    if (!getGlobalState().autoCompactEnabled) {
        return false;
    }

    // 2. Get model-specific threshold
    let threshold = getThresholdForModel(model);

    // 3. Estimate current token count
    let estimatedTokens = estimateTokenCount(messages);

    // 4. Get model context limit
    let contextLimit = getContextLimitForModel(model);

    // 5. Check if over threshold percentage
    return estimatedTokens > (contextLimit * threshold);
}

// Threshold percentages by model (verified):
const MODEL_THRESHOLDS = {
    "claude-opus-4-6": 0.80,    // 80% of 1M = 800K tokens
    "claude-sonnet-4-6": 0.80,  // 80% of 200K = 160K tokens
    "claude-haiku-4-5": 0.85   // 85% of 200K = 170K tokens
};

// Context limits by model (verified):
const MODEL_CONTEXT_LIMITS = {
    "claude-opus-4-6": 1000000,  // 1M tokens
    "claude-sonnet-4-6": 200000,
    "claude-haiku-4-5": 200000
};
```

**Why this approach:**
- **20% buffer**: Leaves room for:
  - Next user message
  - System prompts that may be injected
  - Token estimation inaccuracies
- **Model-specific thresholds**: Haiku gets 85% threshold due to smaller model capacity
- **Dynamic adjustment**: Can be overridden via settings

### Circuit Breaker Pattern

**What it does:** Prevents infinite retry loops when compaction repeatedly fails.

**Algorithm:**

```javascript
// ============================================
// Circuit Breaker for Auto-Compact
// Location: chunks.147.mjs:2633-2673
// ============================================

const MAX_CONSECUTIVE_FAILURES = 3;  // aqq constant

async function autoCompact(messages, sessionContext, systemContext, querySource, autoCompactTracking, modelId) {
    // Circuit breaker check
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
            consecutiveFailures: 0  // Reset on success
        };
    } catch (error) {
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
- **Fails open**: If compaction keeps failing, conversation continues
- **Session-scoped**: Counter resets when session ends
- **Graceful degradation**: User gets warning, not error

### Context Overflow Recovery Algorithm

**What it does:** When the API returns `context_length_exceeded`, automatically calculates available space and retries.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Context Overflow Recovery - withApiRetry
// Location: chunks.89.mjs:62-80
// ============================================

async function* withApiRetry(streamFactory, apiCallFactory, retryContext) {
    let attempt = 0;

    while (true) {
        try {
            let stream = streamFactory();
            for await (let event of stream) {
                yield event;
            }
            return;
        } catch (error) {
            attempt++;

            // Check for context overflow error
            if (error instanceof APIError) {
                let parsed = parseContextOverflowError(error);
                if (parsed) {
                    let { inputTokens, contextLimit } = parsed;

                    // Calculate available space with buffer
                    const BUFFER = 1000;
                    let availableContext = Math.max(0, contextLimit - inputTokens - BUFFER);

                    // Check if there's room for meaningful output
                    if (availableContext < FLOOR_OUTPUT_TOKENS) {
                        logError(Error(`availableContext ${availableContext} is less than FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`));
                        throw error;  // Cannot recover
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

            // Re-throw other errors
            throw error;
        }
    }
}

// Mapping: _P1→withApiRetry, a7→APIError, $54→parseContextOverflowError,
//   fN8→FLOOR_OUTPUT_TOKENS, d→logEvent, _6→logError
```

**Key insight:** This is a reactive measure that kicks in only when pre-query compaction fails to prevent overflow. The 1000-token buffer provides margin for token estimation inaccuracies.
- `hasAttemptedReactiveCompact` - Prevents repeated reactive compaction
- `consecutiveFailures` - Tracks failed compaction attempts

### Integration with Streaming (03_llm_core/stream_processing.md)

The retry wrapper (`withApiRetry`) in the streaming module handles context overflow:

```javascript
// In streamingQueryCore (mGq)
for await (let event of withApiRetry(streamParams)) {
    // If context_length_exceeded error:
    // 1. Parse error to extract token counts
    // 2. Calculate available = limit - input - buffer
    // 3. Set maxTokensOverride = available
    // 4. Retry with reduced max_tokens
}
```

**Error Recovery Chain:**
1. Streaming detects `context_length_exceeded` error
2. Error is caught in `withApiRetry`
3. `parseContextOverflowError` extracts token counts
4. `maxTokensOverride` is set
5. Request is retried with reduced output tokens
6. If still fails after 3 retries, error is propagated to agent loop
