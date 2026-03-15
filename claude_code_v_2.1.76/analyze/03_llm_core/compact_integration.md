# Compact Integration (Claude Code 2.1.38)

> Complete analysis of the auto-compact system: trigger conditions, context overflow recovery, integration with the retry system, and message replacement strategies.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `contextCompactor` ($OA) - Wrapper that checks if compaction is needed before LLM request
- `checkAndTriggerAutoCompact` (fs4) - Evaluates token thresholds and triggers compaction
- `withApiRetry` (V26) - Retry wrapper that handles context overflow errors
- `microCompact` (gm) - Removes consecutive duplicate messages
- `completeQuery` (mp) - Non-streaming query with compaction check

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

### contextCompactor - Wrapper with compaction check

**What it does:**
The `contextCompactor` ($OA) function wraps the LLM request generator and checks if context compaction should be performed before making the API call. This is the primary integration point for proactive compaction.

**How it works:**

1. **Feature Check**: Checks if compaction is enabled via `HOA()` (isAutoCompactEnabled).

2. **If Disabled**: Passes through directly to the wrapped generator.

3. **If Enabled**:
   - Collects all events from the wrapped generator into an array
   - Checks token count against threshold
   - If over threshold, triggers compaction and retries

```javascript
// ============================================
// contextCompactor - Wraps LLM requests with compaction check
// Location: chunks.75.mjs:1938-1950
// ============================================

// ORIGINAL (for source lookup):
async function* $OA(A, q) {
    if (!HOA()) return yield* q();
    let K = [],
        Y = await Tw6(A, async () => {
            for await (let z of q()) K.push(z);
            return K
        });
    // ... compaction logic if needed ...
}

// READABLE (for understanding):
async function* contextCompactor(messages, requestGenerator) {
    // If auto-compact disabled, pass through
    if (!isAutoCompactEnabled()) {
        return yield* requestGenerator();
    }

    let collectedEvents = [];

    // Execute the request and collect events
    let result = await checkAndCompactIfNeeded(messages, async () => {
        for await (let event of requestGenerator()) {
            collectedEvents.push(event);
        }
        return collectedEvents;
    });

    // Yield all collected events
    for (let event of collectedEvents) {
        yield event;
    }
}

// Mapping: $OA→contextCompactor, A→messages, q→requestGenerator,
//   HOA→isAutoCompactEnabled, Tw6→checkAndCompactIfNeeded, K→collectedEvents
```

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

```javascript
// ============================================
// Pre-Query Auto-Compact in mainAgentLoop
// Location: chunks.149.mjs:1786-1827
// ============================================

// ORIGINAL (for source lookup):
let G = [...EN(A)];
y3("query_microcompact_start");
let Z = await gm(G, void 0, w);
if (G = Z.messages, Z.compactionInfo?.boundaryMessage) yield Z.compactionInfo.boundaryMessage;
y3("query_microcompact_end");
// ...
y3("query_autocompact_start");
let { compactionResult: T } = await fs4(G, w, {
    systemPrompt: q,
    userContext: K,
    systemContext: Y,
    toolUseContext: w,
    forkContextMessages: G
}, $);
if (y3("query_autocompact_end"), T) {
    let { preCompactTokenCount: Z1, postCompactTokenCount: E1, compactionUsage: a } = T;
    if (c("tengu_auto_compact_succeeded", {...}), !f?.compacted) f = {
        compacted: !0,
        turnId: w6q(),
        turnCounter: 0
    };
    let A1 = qt(T);
    for (let M1 of A1) yield M1;
    G = A1, Ms4()
}

// READABLE (for understanding):
let messagesForQuery = [...getVisibleMessages(messages)];

// 1. Micro-compact: Remove consecutive duplicates
recordMark("query_microcompact_start");
let microCompactResult = await microCompact(messagesForQuery, undefined, toolUseContext);
messagesForQuery = microCompactResult.messages;
if (microCompactResult.compactionInfo?.boundaryMessage) {
    yield microCompactResult.compactionInfo.boundaryMessage;
}
recordMark("query_microcompact_end");

// 2. Auto-compact: Check threshold and compact if needed
recordMark("query_autocompact_start");
let { compactionResult } = await checkAndTriggerAutoCompact(
    messagesForQuery,
    toolUseContext,
    {
        systemPrompt,
        userContext,
        systemContext,
        toolUseContext,
        forkContextMessages: messagesForQuery
    },
    querySource
);
recordMark("query_autocompact_end");

if (compactionResult) {
    let { preCompactTokenCount, postCompactTokenCount, compactionUsage } = compactionResult;

    // Log telemetry
    logEvent("tengu_auto_compact_succeeded", {
        originalMessageCount: messages.length,
        compactedMessageCount: compactionResult.summaryMessages.length + compactionResult.attachments.length + compactionResult.hookResults.length,
        preCompactTokenCount,
        postCompactTokenCount,
        compactionInputTokens: compactionUsage?.input_tokens,
        compactionOutputTokens: compactionUsage?.output_tokens,
        compactionCacheReadTokens: compactionUsage?.cache_read_input_tokens ?? 0,
        compactionCacheCreationTokens: compactionUsage?.cache_creation_input_tokens ?? 0,
        compactionTotalTokens: compactionUsage ? compactionUsage.input_tokens + (compactionUsage.cache_creation_input_tokens ?? 0) + (compactionUsage.cache_read_input_tokens ?? 0) + compactionUsage.output_tokens : 0,
        queryChainId,
        queryDepth
    });

    // Initialize tracking if first compaction
    if (!autoCompactTracking?.compacted) {
        autoCompactTracking = {
            compacted: true,
            turnId: generateTurnId(),
            turnCounter: 0
        };
    }

    // Yield compaction messages (summary + attachments)
    let compactionMessages = buildCompactionMessages(compactionResult);
    for (let message of compactionMessages) {
        yield message;
    }

    // Replace message history with compacted version
    messagesForQuery = compactionMessages;
    clearFileState();  // Ms4 - clear readFileState
}

// Mapping: EN→getVisibleMessages, gm→microCompact, fs4→checkAndTriggerAutoCompact,
//   qt→buildCompactionMessages, Ms4→clearFileState, w6q→generateTurnId,
//   y3→recordMark, c→logEvent
```

---

### Context Overflow Recovery in withApiRetry

**What it does:**
When the API returns a `context_length_exceeded` error, the retry wrapper automatically calculates a reduced `max_tokens` value that fits within the remaining context and retries the request.

**How it works:**

1. **Error Detection**: Catches API errors and checks for `context_length_exceeded` type.

2. **Token Extraction**: Parses `inputTokens` and `contextLimit` from the error response.

3. **Available Space Calculation**:
   ```
   buffer = 1000  // Safety margin
   available = contextLimit - inputTokens - buffer
   ```

4. **Floor Check**: If `available < 1000` (FLOOR_OUTPUT_TOKENS), the error is re-thrown (no room for response).

5. **Override Setting**: Sets `retryContext.maxTokensOverride` to `max(FLOOR, available, maxThinkingTokens + 1)`.

6. **Retry**: The request is retried with the reduced `max_tokens`.

```javascript
// ============================================
// Context Overflow Recovery in withApiRetry
// Location: chunks.72.mjs:1861-1951 (extracted from implementation.md)
// ============================================

// Context overflow handling (from withApiRetry):
if (error instanceof ApiError) {
    let contextInfo = parseContextOverflowError(error);
    if (contextInfo) {
        let { inputTokens, contextLimit } = contextInfo;

        // Calculate available space with buffer
        let buffer = 1000;
        let available = Math.max(0, contextLimit - inputTokens - buffer);

        // Check if enough room for minimal response
        if (available < FLOOR_OUTPUT_TOKENS) {
            // No room - this is a fatal error
            recordError(Error(`availableContext ${available} < FLOOR_OUTPUT_TOKENS`));
            throw error;
        }

        // Ensure thinking tokens fit if present
        let thinkingBuffer = (retryContext.maxThinkingTokens || 0) + 1;
        let adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, available, thinkingBuffer);

        // Set override for retry
        retryContext.maxTokensOverride = adjustedMaxTokens;

        logEvent("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens,
            contextLimit,
            maxTokensOverride: retryContext.maxTokensOverride
        });

        continue;  // Retry with reduced max_tokens
    }
}

// Mapping: parseContextOverflowError→zv7, FLOOR_OUTPUT_TOKENS→K$A
```

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

### Threshold Calculation

```javascript
// ============================================
// Threshold Calculation (inferred)
// ============================================

function shouldTriggerCompact(messages, model) {
    let tokenCount = estimateTokenCount(messages);
    let contextLimit = getModelContextLimit(model);
    let thresholdPercentage = getAutoCompactThreshold() ?? getDefaultThreshold(model);

    // Default thresholds (inferred):
    // - Claude Opus/Sonnet: 80% (0.8)
    // - Models with 200k context: 85%

    let thresholdTokens = Math.floor(contextLimit * thresholdPercentage);

    return tokenCount > thresholdTokens;
}
```

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
// ============================================
// Messages preserved during compaction
// ============================================

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

The compact integration in Claude Code 2.1.38 operates at two levels:

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