# Algorithm Deep Dive Complete v2 (Claude Code 2.1.76)

> Complete algorithm analysis with decision trees and source-level restoration.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Version**: v2 - Complete algorithm analysis with decision trees.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tool Execution Decision Tree](#2-tool-execution-decision-tree)
3. [Auto-Compact Decision Tree](#3-auto-compact-decision-tree)
4. [Attachment Producer Selection](#4-attachment-producer-selection)
5. [SSE Event Processing Decision Tree](#5-sse-event-processing-decision-tree)
6. [Permission Decision Tree](#6-permission-decision-tree)
7. [Error Recovery Decision Tree](#7-error-recovery-decision-tree)
8. [Turn Continuation Decision Tree](#8-turn-continuation-decision-tree)

---

## 1. Overview

This document provides deep analysis of the key algorithms in Claude Code with complete decision trees for understanding the logic flow.

### Key Algorithms Analyzed

| Algorithm | Purpose | Complexity |
|-----------|---------|------------|
| Tool Execution | Parallel vs sequential tool execution | O(n) per tool |
| Auto-Compact | Context window management | O(m) messages |
| Attachment Assembly | System reminder production | O(p) producers |
| SSE Processing | Stream event handling | O(1) per event |
| Permission Check | Access control | O(r) rules |

---

## 2. Tool Execution Decision Tree

### 2.1 canExecuteTool Algorithm

**What it does:** Determines if a tool can be executed given the current execution queue state.

**How it works:**

```
canExecuteTool(isConcurrencySafe)?
│
├── Get all tools with status === "executing"
│
├── executing.length === 0?
│   └── YES → Return true (nothing executing, safe to start)
│
└── executing.length > 0
    │
    ├── isConcurrencySafe === true?
    │   │
    │   └── ALL executing tools areConcurrencySafe?
    │       ├── YES → Return true (parallel execution)
    │       └── NO → Return false (wait for sequential)
    │
    └── isConcurrencySafe === false?
        └── Return false (sequential tools must wait)
```

### 2.2 Source Code Restoration

```javascript
// ============================================
// canExecuteTool - Tool execution decision
// Location: chunks.148.mjs:62-65
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(A) {
    let q = this.tools.filter((K) => K.status === "executing");
    return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
}

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
    let executing = this.tools.filter(tool => tool.status === "executing");

    // Decision tree:
    // 1. Nothing executing? → Execute immediately
    if (executing.length === 0) {
        return true;
    }

    // 2. Something executing - check concurrency
    //    - New tool is concurrency-safe
    //    - AND all executing tools are concurrency-safe
    //    → Can execute in parallel
    return isConcurrencySafe && executing.every(tool => tool.isConcurrencySafe);
}

// Mapping: canExecuteTool→canExecuteTool, A→isConcurrencySafe, q→executing
```

### 2.3 Tool Concurrency Classification

| Tool | Concurrency Safe | Reason |
|------|-----------------|--------|
| Read | ✅ Yes | Read-only, no side effects |
| Grep | ✅ Yes | Read-only, no side effects |
| Glob | ✅ Yes | Read-only, no side effects |
| Write | ❌ No | Modifies filesystem |
| Edit | ❌ No | Modifies filesystem |
| Bash | ❌ No | Can have side effects |
| NotebookEdit | ❌ No | Modifies files |
| TaskCreate | ✅ Yes | Creates independent tasks |
| TodoWrite | ✅ Yes | Updates todo list |

### 2.4 Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TOOL EXECUTION FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool Use Block Received                                                     │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────┐                                                        │
│  │ Find Tool       │                                                        │
│  │ Definition      │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ├─── Not Found ──► Create error message, return                   │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ Validate Input  │                                                        │
│  │ against Schema  │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ├─── Invalid ──► Create error message, return                     │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ Check           │                                                        │
│  │ ConcurrencySafe │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ canExecuteTool? │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│     ┌─────┴─────┐                                                           │
│     │           │                                                            │
│     ▼           ▼                                                            │
│  ┌──────┐   ┌──────┐                                                        │
│  │ YES  │   │  NO  │                                                        │
│  └──┬───┘   └──┬───┘                                                        │
│     │          │                                                             │
│     ▼          ▼                                                             │
│  Execute   Wait in Queue                                                     │
│  Now      (poll until ready)                                                 │
│     │                                                                       │
│     ▼                                                                       │
│  ┌─────────────────┐                                                        │
│  │ getAbortReason? │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│     ┌─────┼─────┬─────────┐                                                │
│     │     │     │         │                                                │
│     ▼     ▼     ▼         ▼                                                │
│  discarded  hasErrored  aborted  null                                      │
│     │       │          │         │                                          │
│     ▼       ▼          ▼         ▼                                          │
│  fallback  sibling   user_int  execute                                     │
│  _error    _error    _err                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Auto-Compact Decision Tree

### 3.1 shouldTriggerAutoCompaction Algorithm

**What it does:** Determines if auto-compact should be triggered based on token count and conditions.

**How it works:**

```
shouldTriggerAutoCompaction(messages, model, querySource)?
│
├── querySource === "session_memory" OR "compact"?
│   └── YES → Return false (don't compact during compaction)
│
├── isAutoCompactEnabled() === false?
│   └── YES → Return false (feature disabled)
│
├── DISABLE_AUTO_COMPACT env var set?
│   └── YES → Return false
│
├── DISABLE_COMPACT env var set?
│   └── YES → Return false
│
└── Calculate tokens and check threshold
    │
    ├── tokenCount = countTokens(messages) - tokensFreed
    ├── threshold = getAutoCompactThreshold(model)
    │
    └── tokenCount >= threshold?
        ├── YES → Return true (trigger compact)
        └── NO → Return false
```

### 3.2 autoCompactDispatcher Decision Tree

```
autoCompactDispatcher(messages, context)?
│
├── DISABLE_COMPACT env var?
│   └── YES → Return { wasCompacted: false }
│
├── consecutiveFailures >= 3 (circuit breaker)?
│   └── YES → Return { wasCompacted: false }
│
├── shouldTriggerAutoCompaction() === false?
│   └── YES → Return { wasCompacted: false }
│
└── Execute compaction
    │
    ├── Try fast compact (session_memory mode)
    │   └── Success? → Return { wasCompacted: true, result }
    │
    └── Run full compaction
        │
        ├── Success?
        │   └── Return { wasCompacted: true, result, failures: 0 }
        │
        └── Error?
            │
            ├── Update failure count
            │
            └── newFailureCount >= 3?
                └── Log circuit breaker warning
                └── Return { wasCompacted: false, failures: count }
```

### 3.3 Source Code Restoration

```javascript
// ============================================
// shouldTriggerAutoCompaction - Trigger check
// Location: chunks.147.mjs:2620-2631
// ============================================

// ORIGINAL (for source lookup):
async function CmY(A, q, K, Y = 0) {
    if (K === "session_memory" || K === "compact") return !1;
    if (!Xh()) return !1;
    let z = eW(A) - Y,
        _ = oc6(q),
        w = OF(q);
    k(`autocompact: tokens=${z} threshold=${_} effectiveWindow=${w}${Y>0?` snipFreed=${Y}`:""}`);
    let {
        isAboveAutoCompactThreshold: O
    } = mz6(z, q);
    return O
}

// READABLE (for understanding):
async function shouldTriggerAutoCompaction(messages, model, querySource, tokensFreed = 0) {
    // Decision 1: Skip for memory/compact sources
    if (querySource === "session_memory" || querySource === "compact") {
        return false;
    }

    // Decision 2: Check if feature is enabled
    if (!isAutoCompactEnabled()) {
        return false;
    }

    // Decision 3: Calculate token metrics
    let tokenCount = countTokens(messages) - tokensFreed;
    let threshold = getAutoCompactThreshold(model);
    let contextWindow = getModelContextWindow(model);

    debugLog(`autocompact: tokens=${tokenCount} threshold=${threshold} window=${contextWindow}`);

    // Decision 4: Check threshold
    let { isAboveAutoCompactThreshold } = checkTokenThresholds(tokenCount, model);

    return isAboveAutoCompactThreshold;
}

// Mapping: CmY→shouldTriggerAutoCompaction, A→messages, q→model, K→querySource, Y→tokensFreed, Xh→isAutoCompactEnabled, eW→countTokens, oc6→getAutoCompactThreshold
```

### 3.4 Threshold Calculation

```javascript
// ============================================
// Token Threshold Constants
// Location: chunks.147.mjs:2676-2686
// ============================================

const AUTO_COMPACT_THRESHOLD_BUFFER = 3000;  // Mp8 - Buffer before blocking
const MAX_CONSECUTIVE_FAILURES = 3;           // aqq - Circuit breaker threshold

// Threshold is typically 80% of context window
function getAutoCompactThreshold(model) {
    let contextWindow = getModelContextWindow(model);
    return Math.floor(contextWindow * 0.8);
}
```

---

## 4. Attachment Producer Selection

### 4.1 Producer Priority Decision Tree

```
assembleAllAttachments(atMentions, context, ideContext)?
│
├── CLAUDE_CODE_DISABLE_ATTACHMENTS?
│   └── YES → Return []
│
├── CLAUDE_CODE_SIMPLE?
│   └── YES → Return []
│
└── Execute producers in parallel (1s timeout)
    │
    ├── Phase 1: @-mention producers (if atMentions exist)
    │   ├── at_mentioned_files
    │   ├── mcp_resources
    │   └── agent_mentions
    │
    ├── Phase 2: Core producers (always)
    │   ├── date_change
    │   ├── ultrathink_effort
    │   ├── deferred_tools_delta
    │   ├── mcp_instructions_delta
    │   ├── changed_files
    │   ├── nested_memory
    │   ├── dynamic_skill
    │   ├── skill_listing
    │   ├── ultra_claude_md
    │   ├── plan_mode
    │   ├── plan_mode_exit
    │   ├── auto_mode
    │   ├── auto_mode_exit
    │   ├── todo_reminders
    │   ├── teammate_mailbox (team mode only)
    │   ├── team_context (team mode only)
    │   ├── agent_pending_messages
    │   └── critical_system_reminder
    │
    └── Phase 3: Main thread producers (if !agentId)
        ├── ide_selection
        ├── ide_opened_file
        ├── output_style
        ├── diagnostics
        ├── lsp_diagnostics
        ├── unified_tasks
        ├── async_hook_responses
        ├── token_usage
        ├── budget_usd
        ├── output_token_usage
        ├── verify_plan_reminder
        └── queued_commands
```

### 4.2 Attachment Normalization Decision Tree

```
normalizeAttachmentForAPI(attachment)?
│
├── isTeamMode()?
│   ├── type === "teammate_mailbox"?
│   │   └── Return formatted teammate messages
│   └── type === "team_context"?
│       └── Return team coordination message
│
└── Main dispatch switch:
    │
    ├── "directory"
    │   └── Create synthetic Bash tool call/result
    │
    ├── "file"
    │   ├── content.type === "image"?
    │   │   └── Create Read tool call/result with image
    │   ├── content.type === "text"?
    │   │   └── Create Read tool call/result + truncation notice
    │   ├── content.type === "notebook"?
    │   │   └── Create Read tool call/result
    │   └── content.type === "pdf"?
    │       └── Create Read tool call/result
    │
    ├── "edited_text_file"
    │   └── Create modification notice message
    │
    ├── "selected_lines_in_ide"
    │   └── Create selection context message
    │
    ├── "plan_mode"
    │   └── Dispatch to plan mode variant selector
    │
    ├── "todo_reminder"
    │   └── Create todo list reminder
    │
    ├── "token_usage"
    │   └── Create token usage message
    │
    └── default (unknown type)
        └── Return [] (silent)
```

---

## 5. SSE Event Processing Decision Tree

### 5.1 Event Type Handling

```
processSSEEvent(event)?
│
├── event.type === "message_start"?
│   ├── Initialize partialMessage = event.message
│   ├── Update usage stats
│   └── Continue
│
├── event.type === "content_block_start"?
│   ├── block.type === "tool_use"?
│   │   └── Create placeholder: { type, id, name, input: "" }
│   ├── block.type === "text"?
│   │   └── Create placeholder: { type, text: "" }
│   ├── block.type === "thinking"?
│   │   └── Create placeholder: { type, thinking: "", signature: "" }
│   └── Continue
│
├── event.type === "content_block_delta"?
│   ├── delta.type === "text_delta"?
│   │   └── block.text += delta.text
│   ├── delta.type === "input_json_delta"?
│   │   └── block.input += delta.partial_json
│   ├── delta.type === "thinking_delta"?
│   │   └── block.thinking += delta.thinking
│   ├── delta.type === "signature_delta"?
│   │   └── block.signature = delta.signature
│   └── Continue
│
├── event.type === "content_block_stop"?
│   ├── Complete the block
│   ├── Create complete message
│   └── Yield to UI
│
├── event.type === "message_delta"?
│   ├── Update usage stats
│   ├── Capture stop_reason
│   ├── stop_reason === "max_tokens"?
│   │   └── Yield max_tokens error
│   ├── stop_reason === "model_context_window_exceeded"?
│   │   └── Yield context overflow error
│   └── Continue
│
└── event.type === "message_stop"?
    └── Complete message processing
```

### 5.2 Source Code Restoration

```javascript
// ============================================
// SSE Event Processing Switch
// Location: chunks.171.mjs:299-439
// ============================================

// READABLE (for understanding):
switch (event.type) {
    case "message_start": {
        partialMessage = event.message;
        usage = mergeUsage(usage, event.message?.usage);
        break;
    }

    case "content_block_start": {
        switch (event.content_block.type) {
            case "tool_use":
                contentBlocks[event.index] = {
                    ...event.content_block,
                    input: ""  // Accumulated via deltas
                };
                break;

            case "text":
                contentBlocks[event.index] = {
                    ...event.content_block,
                    text: ""  // Accumulated via deltas
                };
                break;

            case "thinking":
                contentBlocks[event.index] = {
                    ...event.content_block,
                    thinking: "",
                    signature: ""
                };
                break;
        }
        break;
    }

    case "content_block_delta": {
        let block = contentBlocks[event.index];

        switch (event.delta.type) {
            case "text_delta":
                block.text += event.delta.text;
                break;

            case "input_json_delta":
                block.input += event.delta.partial_json;
                break;

            case "thinking_delta":
                block.thinking += event.delta.thinking;
                break;

            case "signature_delta":
                block.signature = event.delta.signature;
                break;
        }
        break;
    }

    case "content_block_stop": {
        let completedBlock = contentBlocks[event.index];

        // Create and yield complete message
        let completeMessage = {
            message: {
                ...partialMessage,
                content: [completedBlock]
            },
            requestId: requestId,
            type: "assistant",
            uuid: generateUUID(),
            timestamp: new Date().toISOString()
        };

        messages.push(completeMessage);
        yield completeMessage;
        break;
    }

    case "message_delta": {
        usage = mergeUsage(usage, event.usage);
        stopReason = event.delta.stop_reason;

        // Handle special stop reasons
        if (stopReason === "max_tokens") {
            yield createMaxTokensError();
        }

        if (stopReason === "model_context_window_exceeded") {
            yield createContextOverflowError();
        }
        break;
    }
}

// Always yield raw event for UI updates
yield { type: "stream_event", event };
```

---

## 6. Permission Decision Tree

### 6.1 Permission Check Flow

```
checkToolPermission(tool, input, context)?
│
├── Find matching rules
│   ├── Check alwaysAllowRules
│   ├── Check alwaysDenyRules
│   └── Check alwaysAskRules
│
├── Rule Match?
│   ├── Allow rule matches?
│   │   └── Return { allowed: true }
│   │
│   ├── Deny rule matches?
│   │   └── Return { allowed: false, reason: "deny_rule" }
│   │
│   └── Ask rule matches?
│       └── Return { needsPrompt: true }
│
├── Permission Mode?
│   ├── mode === "acceptEdits"?
│   │   └── Return { allowed: true } for Edit tools
│   │
│   ├── mode === "auto"?
│   │   └── Return { allowed: true }
│   │
│   ├── mode === "plan"?
│   │   └── Return { allowed: false } for write tools
│   │
│   └── mode === "default"?
│       └── Return { needsPrompt: true }
│
└── Show permission prompt
    ├── User allows?
    │   ├── "Allow always"?
    │   │   └── Add to alwaysAllowRules
    │   └── Return { allowed: true }
    │
    └── User denies?
        └── Return { allowed: false }
```

### 6.2 Permission Context Reducer

```javascript
// ============================================
// permissionContextReducer - State updates
// Location: chunks.53.mjs:1224-1294
// ============================================

// ORIGINAL (for source lookup):
function Ez(A, q) {
    switch (q.type) {
        case "setMode":
            return {...A, mode: q.mode};
        case "addRules": {
            let K = q.rules.map((z) => L5(z));
            let Y = q.behavior === "allow" ? "alwaysAllowRules" :
                    q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: [...A[Y][q.destination] || [], ...K]
                }
            };
        }
        // ... more cases
    }
}

// READABLE (for understanding):
function permissionContextReducer(state, action) {
    switch (action.type) {
        case "setMode":
            debugLog(`Applying permission update: Setting mode to '${action.mode}'`);
            return { ...state, mode: action.mode };

        case "addRules": {
            let normalizedRules = action.rules.map(normalizeRule);
            debugLog(`Adding ${action.rules.length} ${action.behavior} rules to '${action.destination}'`);

            let rulesKey = action.behavior === "allow" ? "alwaysAllowRules" :
                          action.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";

            return {
                ...state,
                [rulesKey]: {
                    ...state[rulesKey],
                    [action.destination]: [
                        ...(state[rulesKey][action.destination] || []),
                        ...normalizedRules
                    ]
                }
            };
        }

        case "replaceRules": {
            let normalizedRules = action.rules.map(normalizeRule);
            debugLog(`Replacing all ${action.behavior} rules for '${action.destination}'`);

            let rulesKey = action.behavior === "allow" ? "alwaysAllowRules" :
                          action.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";

            return {
                ...state,
                [rulesKey]: {
                    ...state[rulesKey],
                    [action.destination]: normalizedRules
                }
            };
        }

        case "addDirectories": {
            debugLog(`Adding ${action.directories.length} directories to '${action.destination}'`);

            let newDirectories = new Map(state.additionalWorkingDirectories);
            for (let dir of action.directories) {
                newDirectories.set(dir, { path: dir, source: action.destination });
            }

            return {
                ...state,
                additionalWorkingDirectories: newDirectories
            };
        }

        default:
            return state;
    }
}

// Mapping: Ez→permissionContextReducer, L5→normalizeRule
```

---

## 7. Error Recovery Decision Tree

### 7.1 Streaming Error Recovery

```
handleStreamingError(error, context)?
│
├── error instanceof AbortError?
│   ├── signal.aborted && signal.reason === "interrupt"?
│   │   └── Return { type: "cancelled", reason: "user_interrupted" }
│   │
│   └── Throw TimeoutError
│
├── isNetworkError(error)?
│   └── Return { type: "retry", delay: calculateBackoff(retryCount) }
│
├── isContextOverflowError(error)?
│   ├── hasAttemptedReactiveCompact?
│   │   └── Return { type: "error", message: "Context overflow" }
│   │
│   └── Attempt reactive compact
│       ├── Success?
│       │   └── Return { type: "retry_with_compacted", messages }
│       └── Failure?
│           └── Return { type: "error", message: "Context overflow" }
│
├── isNonStreamingFallbackDisabled?
│   └── Return { type: "error", message: error.message }
│
└── Fall back to non-streaming
    └── Return { type: "fallback_to_non_streaming" }
```

### 7.2 Retry Logic

```javascript
// ============================================
// Retry with Exponential Backoff
// Location: chunks.89.mjs:3
// ============================================

// READABLE (for understanding):
async function withApiRetry(requestFn, options) {
    let maxRetries = options.maxRetries ?? 3;
    let baseDelay = 1000;  // 1 second

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            // Don't retry on abort
            if (error.name === "AbortError") {
                throw error;
            }

            // Don't retry on validation errors
            if (error.status === 400) {
                throw error;
            }

            // Last attempt - throw
            if (attempt === maxRetries) {
                throw error;
            }

            // Calculate backoff with jitter
            let delay = baseDelay * Math.pow(2, attempt);
            delay = delay * (0.5 + Math.random());  // Add jitter

            debugLog(`Retry attempt ${attempt + 1} after ${delay}ms`);

            await sleep(delay);
        }
    }
}
```

---

## 8. Turn Continuation Decision Tree

### 8.1 Should Continue Turn?

```
shouldContinueTurn(turnState, lastMessage)?
│
├── lastMessage has tool_use blocks?
│   └── YES → Continue turn (execute tools)
│
├── stop_reason === "end_turn"?
│   └── Return { reason: "complete" }
│
├── stop_reason === "stop_sequence"?
│   └── Return { reason: "complete" }
│
├── maxTurns reached?
│   └── Return { reason: "max_turns" }
│
├── abortController.aborted?
│   └── Return { reason: "aborted" }
│
└── Return { reason: "complete" }
```

### 8.2 Turn State Object

```javascript
// ============================================
// Turn State Object Structure
// Location: chunks.148.mjs:892-902
// ============================================

interface TurnState {
    messages: Message[];
    toolUseContext: ToolUseContext;
    maxOutputTokensOverride?: number;
    autoCompactTracking?: {
        compacted: boolean;
        turnId: string;
        turnCounter: number;
        consecutiveFailures: number;
    };
    stopHookActive?: boolean;
    maxOutputTokensRecoveryCount: number;
    hasAttemptedReactiveCompact: boolean;
    turnCount: number;
    pendingToolUseSummary?: string;
    transition?: ModeTransition;
}
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `canExecuteTool` (ui6.canExecuteTool) - Tool execution decision
- `shouldTriggerAutoCompaction` (CmY) - Auto-compact trigger
- `autoCompactDispatcher` (sqq) - Auto-compact execution
- `assembleAllAttachments` (_uY) - Attachment producer
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalizer
- `permissionContextReducer` (Ez) - Permission state updates

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All key algorithms documented with decision trees