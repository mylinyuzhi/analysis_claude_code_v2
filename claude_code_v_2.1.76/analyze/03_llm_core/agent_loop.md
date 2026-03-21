# Agent Loop Deep Analysis (Claude Code 2.1.76)

> Complete analysis of the main agent loop (`mainAgentLoop`/`Yh`), the orchestrator that drives the entire conversation lifecycle: LLM requests, tool dispatch, message management, and turn completion.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `mainAgentLoop` (Yh) - Main REPL-facing agent loop entry point
- `mainAgentLoopCore` (omY) - Inner implementation of the agent loop
- `callModel` (NT6) - LLM API request via SKq helper
- `StreamingToolExecutor` (ui6) - Parallel tool execution during streaming
- `toolDispatcher` (Wi6) - Routes tool calls to implementations
- `getSessionGates` (RKq) - Returns feature flags for current session
- `withApiRetry` (_P1) - Retry wrapper with context overflow recovery

---

## Architecture Overview

The agent loop is the "heart" of Claude Code. It manages the entire conversation lifecycle:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         mainAgentLoop (Yh)                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Turn Loop (while true)                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Micro-compact check (pg)                             │ │  │
│  │  │ 2. Auto-compact check (sqq)                             │ │  │
│  │  │ 3. Context limit validation                             │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 4. callModel (NT6) via SKq() helper                    │ │  │
│  │  │    - Build tool schemas                                 │ │  │
│  │  │    - Normalize messages                                 │ │  │
│  │  │    - Send API request                                   │ │  │
│  │  │    - Yield streaming events                             │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 5. Accumulate assistant messages                        │ │  │
│  │  │ 6. Collect tool_use blocks                              │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 7. Tool Execution (if tools present)                    │ │  │
│  │  │    - StreamingToolExecutor (ui6)                       │ │  │
│  │  │    - toolDispatcher (Wi6) for each tool                │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 8. Attachments via assembleAllAttachments               │ │  │
│  │  │ 9. Recursive continuation with updated messages         │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Source Code (Verified)

### mainAgentLoop (Yh) - Entry Point

```javascript
// ============================================
// mainAgentLoop - Central orchestrator for the agent conversation
// Location: chunks.148.mjs:875-880
// ============================================

// ORIGINAL (for source lookup):
async function* Yh(A) {
    let q = [],
        K = yield* omY(A, q);
    for (let Y of q) pb(Y, "completed");
    return K
}

// READABLE (for understanding):
async function* mainAgentLoop(params) {
    let progressMessages = [];

    // Delegate to core implementation
    let result = yield* mainAgentLoopCore(params, progressMessages);

    // Mark all progress messages as completed
    for (let msg of progressMessages) {
        markProgressCompleted(msg);
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, A→params, q→progressMessages, K→result, omY→mainAgentLoopCore
```

### mainAgentLoopCore (omY) - Core Implementation

```javascript
// ============================================
// mainAgentLoopCore - Inner implementation of the agent loop
// Location: chunks.148.mjs:882-900
// ============================================

// ORIGINAL (for source lookup):
async function* omY(A, q) {
    let {
        systemPrompt: K,
        userContext: Y,
        systemContext: z,
        canUseTool: _,
        fallbackModel: w,
        querySource: O,
        maxTurns: $,
        skipCacheWrite: H
    } = A, j = A.deps ?? SKq(), J = {
        messages: A.messages,
        toolUseContext: A.toolUseContext,
        maxOutputTokensOverride: A.maxOutputTokensOverride,
        autoCompactTracking: void 0,
        stopHookActive: void 0,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        transition: void 0
    }, M = null, D = RKq();
    while (!0) {
        // ... turn logic ...
    }
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, progressMessages) {
    let {
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        fallbackModel,
        querySource,
        maxTurns,
        skipCacheWrite
    } = params;

    // Get helper functions (callModel, microcompact, autocompact, uuid)
    let helpers = params.deps ?? getModelCallHelpers();

    // Initialize state
    let state = {
        messages: params.messages,
        toolUseContext: params.toolUseContext,
        maxOutputTokensOverride: params.maxOutputTokensOverride,
        autoCompactTracking: undefined,
        stopHookActive: undefined,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: false,
        transition: undefined
    };

    let gates = getSessionGates();

    while (true) {
        // ... turn logic continues ...
    }
}

// Mapping: omY→mainAgentLoopCore, A→params, q→progressMessages,
//   K→systemPrompt, Y→userContext, z→systemContext, _→canUseTool,
//   w→fallbackModel, O→querySource, $→maxTurns, H→skipCacheWrite,
//   j→helpers, J→state, D→gates, RKq→getSessionGates, SKq→getModelCallHelpers
```

**Why this approach:**
- **Generator pattern**: `async function*` allows yielding events incrementally. The caller (typically the UI) receives events as they happen rather than waiting for the entire turn to complete.
- **Recursive continuation**: Instead of returning after each turn, the loop continues with updated messages. This maintains conversation context without explicit recursion.
- **Streaming tool execution**: Starting tool execution during the stream (rather than waiting for stream completion) reduces perceived latency. The user sees tool results appearing while the LLM is still generating.
- **Abort handling**: Multiple abort checks ensure the agent stops cleanly when the user cancels, without leaving orphaned tool executions.

**Key insight:** The `while (true)` loop is the fundamental structure of the agent. Each iteration represents one "turn" in the conversation. The loop continues until:
1. No tools are called (LLM finished speaking)
2. Abort signal is triggered
3. A hook stops continuation
4. Max turns limit is reached
5. An unrecoverable error occurs

---

## Complete Turn State Machine (VERIFIED)

### Turn State Object

The `state` object (J in obfuscated code) tracks all state across turns:

```javascript
// ============================================
// Turn State Object - Carries state across loop iterations
// Location: chunks.148.mjs:893-903, 1397-1410
// ============================================

let state = {
    messages: [...],                    // Current conversation messages
    toolUseContext: {...},              // Permission context, tools, agents, etc.
    autoCompactTracking: {              // undefined or:
        compacted: true,                //   Whether compaction occurred
        turnId: "uuid",                 //   Unique ID for compaction cycle
        turnCounter: 0,                 //   Turns since compaction
        consecutiveFailures: 0          //   Failed compaction attempts
    },
    maxOutputTokensRecoveryCount: 0,    // Times we've hit max_tokens
    hasAttemptedReactiveCompact: false, // Tried reactive compact this query?
    turnCount: 1,                       // Current turn number
    pendingToolUseSummary: Promise,     // Async tool summary generation
    maxOutputTokensOverride: undefined, // Reduced max_tokens from overflow
    stopHookActive: undefined,          // Is a stop hook blocking?
    transition: {                       // Why we continued (set on each iteration)
        reason: "next_turn" | "reactive_compact_retry" | "max_output_tokens_recovery" | "stop_hook_blocking"
    }
};
```

### Turn Flow State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TURN STATE MACHINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                         TURN START                                   │     │
│  │  1. yield { type: "stream_request_start" }                          │     │
│  │  2. K5("query_fn_entry") - Performance mark                         │     │
│  │  3. Setup query tracking (chainId, depth)                           │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    MICRO-COMPACT PHASE                               │     │
│  │  K5("query_microcompact_start")                                     │     │
│  │  pg(messages, context, querySource) → Remove duplicate messages     │     │
│  │  K5("query_microcompact_end")                                       │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    AUTO-COMPACT PHASE                                │     │
│  │  K5("query_autocompact_start")                                      │     │
│  │  sqq(messages, context, params) → Check threshold & summarize       │     │
│  │  If compacted:                                                      │     │
│  │    - Yield compaction summary messages                              │     │
│  │    - Update autoCompactTracking = { compacted: true, ... }          │     │
│  │  K5("query_autocompact_end")                                        │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    BLOCKING LIMIT CHECK                              │     │
│  │  if isAtBlockingLimit:                                              │     │
│  │    yield error message                                              │     │
│  │    return { reason: "blocking_limit" }                              │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    LLM API CALL PHASE                                │     │
│  │  K5("query_api_streaming_start")                                    │     │
│  │                                                                      │     │
│  │  for await (event of callModel(...)):                               │     │
│  │    if event.type === "assistant":                                   │     │
│  │      yield event                                                    │     │
│  │      accumulate assistant messages                                  │     │
│  │      collect tool_use blocks                                        │     │
│  │      if StreamingToolExecutor: add tools to queue                   │     │
│  │                                                                      │     │
│  │  ON ERROR:                                                          │     │
│  │    if ModelFallbackError: switch to fallback model, retry           │     │
│  │    else: yield error, return { reason: "model_error" }              │     │
│  │                                                                      │     │
│  │  K5("query_api_streaming_end")                                      │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    DECISION: TOOLS CALLED?                           │     │
│  │                                                                      │     │
│  │  if (!toolsCalled):  ──────────────────────────────────────┐        │     │
│  │    goto NO_TOOLS_PATH                                     │        │     │
│  │  else:                                                    │        │     │
│  │    goto TOOL_EXECUTION_PATH                               │        │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                           │   │
│         ┌─────────────────────────────────────────────────────────────────┘   │
│         │                                                                     │
│         │     ┌───────────────────────────────────────────────────────────────┘
│         │     │
│         │     ▼
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    NO TOOLS PATH                                     │     │
│  │                                                                      │     │
│  │  if max_output_tokens hit:                                          │     │
│  │    if recoveryCount < 3:                                            │     │
│  │      yield continuation message                                     │     │
│  │      state.maxOutputTokensRecoveryCount++                           │     │
│  │      continue (transition: "max_output_tokens_recovery")            │     │
│  │    else: yield message                                              │     │
│  │                                                                      │     │
│  │  run stop hooks (VKq)                                               │     │
│  │  if stopHook.preventContinuation:                                   │     │
│  │    return { reason: "stop_hook_prevented" }                         │     │
│  │  if blockingErrors:                                                 │     │
│  │    state.stopHookActive = true                                      │     │
│  │    continue (transition: "stop_hook_blocking")                      │     │
│  │                                                                      │     │
│  │  return { reason: "completed" }                                     │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│         ┌───────────────────────────────────────────────────────────────────┐
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    TOOL EXECUTION PATH                               │     │
│  │  K5("query_tool_execution_start")                                   │     │
│  │                                                                      │     │
│  │  if StreamingToolExecutor:                                          │     │
│  │    getRemainingResults() → yields completed tool results            │     │
│  │  else:                                                              │     │
│  │    GE1(tools, messages, canUseTool, context) → sequential execution │     │
│  │                                                                      │     │
│  │  for each tool result:                                              │     │
│  │    yield result message                                             │     │
│  │    accumulate for next turn                                         │     │
│  │                                                                      │     │
│  │  K5("query_tool_execution_end")                                     │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    ATTACHMENT PRODUCTION                             │     │
│  │  Vf6(null, context, null, queuedCommands, messages, querySource)    │     │
│  │  → assembleAllAttachments → yield system reminders                  │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    MAX TURNS CHECK                                   │     │
│  │  if turnCount > maxTurns:                                           │     │
│  │    yield max_turns_reached attachment                               │     │
│  │    return { reason: "max_turns" }                                   │     │
│  └────────────────────────────┬────────────────────────────────────────┘     │
│                               │                                               │
│                               ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │                    RECURSIVE CONTINUATION                            │     │
│  │  K5("query_recursive_call")                                         │     │
│  │                                                                      │     │
│  │  state = {                                                          │     │
│  │    messages: [...oldMessages, ...assistantMessages, ...toolResults],│     │
│  │    toolUseContext: updatedContext,                                  │     │
│  │    autoCompactTracking: tracking,                                   │     │
│  │    turnCount: turnCount + 1,                                        │     │
│  │    transition: { reason: "next_turn" }                              │     │
│  │  }                                                                   │     │
│  │                                                                      │     │
│  │  continue; // Loop back to TURN START                               │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Loop Exit Reasons

| Reason | Condition | Next Action |
|--------|-----------|-------------|
| `completed` | No tools called, no errors | Return to caller |
| `max_turns` | `turnCount > maxTurns` | Return to caller |
| `aborted_streaming` | `abortController.signal.aborted` during API call | Return to caller |
| `aborted_tools` | `abortController.signal.aborted` during tool execution | Return to caller |
| `hook_stopped` | Hook returned `stop` during tool execution | Return to caller |
| `stop_hook_prevented` | Stop hook prevented continuation | Return to caller |
| `blocking_limit` | Token count exceeds blocking limit | Return to caller |
| `model_error` | Unrecoverable API error | Return to caller |
| `image_error` | Image processing error | Return to caller |
| `prompt_too_long` | Context too long and reactive compact failed | Return to caller |

### Loop Continuation Reasons (transition.reason)

| Reason | When | State Changes |
|--------|------|---------------|
| `next_turn` | Tools executed, continuing | messages updated, turnCount++ |
| `reactive_compact_retry` | Context error, reactive compact succeeded | messages replaced, hasAttemptedReactiveCompact=true |
| `max_output_tokens_recovery` | Hit max_tokens, recoveryCount < 3 | maxOutputTokensRecoveryCount++, continuation message added |
| `stop_hook_blocking` | Stop hook returned blocking errors | stopHookActive=true, blocking errors added |

### Source Code - Recursive Continuation

```javascript
// ============================================
// Recursive continuation - Updates state and continues loop
// Location: chunks.148.mjs:1397-1411
// ============================================

// ORIGINAL (for source lookup):
K5("query_recursive_call"), J = {
    messages: [...I, ...e, ...Y6],
    toolUseContext: G6,
    autoCompactTracking: g,
    turnCount: R6,
    maxOutputTokensRecoveryCount: 0,
    hasAttemptedReactiveCompact: !1,
    pendingToolUseSummary: q6,
    maxOutputTokensOverride: void 0,
    stopHookActive: N,
    transition: {
        reason: "next_turn"
    }
}

// READABLE (for understanding):
recordMark("query_recursive_call");

state = {
    messages: [...previousMessages, ...assistantMessages, ...toolResults],
    toolUseContext: updatedContext,
    autoCompactTracking: compactTracking,
    turnCount: newTurnCount,
    maxOutputTokensRecoveryCount: 0,  // Reset for new turn
    hasAttemptedReactiveCompact: false,  // Reset for new turn
    pendingToolUseSummary: toolSummaryPromise,
    maxOutputTokensOverride: undefined,  // Reset for new turn
    stopHookActive: stopHookWasActive,
    transition: {
        reason: "next_turn"
    }
};

// Loop continues automatically - state is updated, next iteration begins

// Mapping: J→state, I→previousMessages, e→assistantMessages, Y6→toolResults,
//   G6→updatedContext, g→compactTracking, R6→newTurnCount, q6→toolSummaryPromise,
//   N→stopHookWasActive, K5→recordMark
```

**Key insight:** The recursive continuation doesn't use actual recursion - it updates the `state` object and lets the `while(true)` loop continue. This is more memory-efficient than true recursion since it doesn't grow the call stack. The `transition.reason` field is purely for debugging/telemetry to understand why the loop continued.

---

## Tool Dispatch Pipeline

### toolDispatcher - Routes tool calls to implementations

**What it does:**
The `toolDispatcher` (bU1) function takes a `tool_use` block from the LLM response, looks up the corresponding tool implementation, validates input, checks permissions, executes the tool, and returns the result.

**How it works:**

1. **Tool Lookup**: Finds the tool by name in `options.tools`. Also checks aliases for backwards compatibility.

2. **MCP Metadata**: If the tool is an MCP tool (name starts with `mcp__`), extracts server type and base URL for telemetry.

3. **Input Validation**: Parses the input against the tool's Zod schema. If validation fails, returns an error result immediately.

4. **Pre-tool Hooks**: Runs `executePreToolHooksIterator` which invokes any registered `PreToolUse` hooks. Hooks can:
   - Modify the input (`updatedInput`)
   - Approve/deny without user interaction (`hookPermissionResult`)
   - Stop tool execution (`preventContinuation`)

5. **Permission Check**: Calls `canUseTool` to determine if the tool requires user approval. Hook results can bypass this check.

6. **Tool Execution**: Calls `tool.call(input, context, progressCallback)`. The tool returns a result object with `data` and optional `structured_output`.

7. **Post-tool Processing**: Tracks file operations, records telemetry, and yields the tool result message.

---

## Context Building

### buildContextMessages - Injects user context into message history

**What it does:**
The `buildContextMessages` (bG1) function prepends a system-reminder style message containing user context (like current working directory, git branch, etc.) to the message history.

**How it works:**

1. Checks if user context object has any entries
2. If empty, returns messages unchanged
3. If populated, creates a meta-message with `<system-reminder>` tags containing the context as key-value pairs
4. Prepends this message to the message array

**Why this approach:**
- The `<system-reminder>` tag is recognized by the LLM as contextual information that should be considered but not directly referenced unless relevant.
- Prepending (rather than appending) ensures the context is seen early in the conversation, which influences the LLM's behavior throughout.
- The `isMeta: true` flag marks this as a system-generated message for UI display purposes.

---

## State Tracking

### Auto-Compact Tracking

The `autoCompactTracking` object tracks compaction state across turns:

```javascript
{
    compacted: true,          // Whether compaction has occurred
    turnId: "uuid",           // Unique ID for this compaction cycle
    turnCounter: 0            // Turns since compaction
}
```

This allows telemetry to correlate post-compaction turns with the compaction event.

### Turn Counter

The `turnCount` variable increments each time the agent makes a recursive continuation. It's used for:
- Max turns enforcement
- Post-auto-compact turn tracking
- Query depth calculation

### Query Tracking

```javascript
{
    chainId: "uuid",    // Correlation ID for all queries in this chain
    depth: 0            // Nesting depth (0 = main agent, 1+ = subagents)
}
```

This enables tracing nested queries (e.g., when AgentTool spawns a subagent).

---

## Error Recovery Patterns

### Max Tokens Recovery

When the LLM hits `max_tokens`, the agent:
1. Detects `stop_reason === "max_tokens"` in the last message
2. Creates a meta-message asking the LLM to continue
3. Increments `maxOutputTokensRecoveryCount`
4. Retries up to 3 times (`udY = 3`)

### Model Fallback

When the primary model fails with overload:
1. Catches `ModelFallbackError`
2. Switches to `fallbackModel`
3. Yields a transition message
4. Clears accumulated messages and retries

### Streaming Fallback

When streaming fails:
1. Falls back to non-streaming via `nonStreamingFallback` (dOq)
2. Tracks `Z1` (didFallBackToNonStreaming) for telemetry
3. Tombstones orphaned messages from the failed stream

---

## Max Tokens Recovery Algorithm

### isMaxOutputTokens (bKq) - Detection Function

**What it does:**
Determines if an assistant message was truncated due to hitting the `max_output_tokens` limit.

```javascript
// ============================================
// isMaxOutputTokens - Detects if response was truncated
// Location: chunks.148.mjs:871-873
// ============================================

// ORIGINAL (for source lookup):
function bKq(A) {
    return A?.type === "assistant" && A.apiError === "max_output_tokens"
}

// READABLE (for understanding):
function isMaxOutputTokens(message) {
    return message?.type === "assistant" && message.apiError === "max_output_tokens";
}

// Mapping: bKq→isMaxOutputTokens, A→message
```

### Recovery Flow

**What it does:**
When the LLM response is truncated due to `max_output_tokens`, the agent automatically continues the response by injecting a continuation message and re-querying.

**How it works:**

1. **Detection**: After API call completes, check `bKq(lastMessage)` to detect truncation.

2. **Recovery Limit**: Compare `maxOutputTokensRecoveryCount` against `rmY` (constant = 3).

3. **Continuation Message**: Inject a meta-message instructing the LLM to continue:
   ```javascript
   {
       content: "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " +
                "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
       isMeta: true
   }
   ```

4. **State Update**: Increment `maxOutputTokensRecoveryCount`, continue loop with `transition.reason: "max_output_tokens_recovery"`.

5. **Final Yield**: If recovery count exceeds 3, yield the truncated message as-is.

```javascript
// ============================================
// max_output_tokens_recovery - Automatic continuation on truncation
// Location: chunks.148.mjs:1207-1231
// ============================================

// ORIGINAL (for source lookup):
if (bKq(D6)) {
    if (Z < rmY) {
        let Z6 = p1({
            content: "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " + "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
            isMeta: !0
        });
        J = {
            messages: [...I, ...e, Z6],
            toolUseContext: X,
            autoCompactTracking: g,
            maxOutputTokensRecoveryCount: Z + 1,
            hasAttemptedReactiveCompact: G,
            maxOutputTokensOverride: void 0,
            pendingToolUseSummary: void 0,
            stopHookActive: void 0,
            turnCount: V,
            transition: {
                reason: "max_output_tokens_recovery",
                attempt: Z + 1
            }
        };
        continue
    }
    yield D6
}

// READABLE (for understanding):
if (isMaxOutputTokens(lastMessage)) {
    if (recoveryCount < MAX_OUTPUT_TOKENS_RECOVERY) {
        let continuationMessage = createUserMessage({
            content: "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " +
                     "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
            isMeta: true
        });

        state = {
            messages: [...previousMessages, ...assistantMessages, continuationMessage],
            toolUseContext: context,
            autoCompactTracking: compactTracking,
            maxOutputTokensRecoveryCount: recoveryCount + 1,
            hasAttemptedReactiveCompact: hasAttemptedReactive,
            maxOutputTokensOverride: undefined,
            pendingToolUseSummary: undefined,
            stopHookActive: undefined,
            turnCount: currentTurnCount,
            transition: {
                reason: "max_output_tokens_recovery",
                attempt: recoveryCount + 1
            }
        };
        continue; // Loop back for next turn
    }
    yield lastMessage; // Recovery exhausted, yield truncated message
}

// Mapping: bKq→isMaxOutputTokens, D6→lastMessage, Z→recoveryCount, rmY→MAX_OUTPUT_TOKENS_RECOVERY,
//   Z6→continuationMessage, p1→createUserMessage, J→state, I→previousMessages, e→assistantMessages,
//   X→context, g→compactTracking, G→hasAttemptedReactive, V→currentTurnCount
```

**Why this approach:**
- **Three-attempt limit**: Prevents infinite loops if the LLM keeps hitting the limit.
- **Meta-message instruction**: Explicitly tells the LLM to continue without apologies or recaps, preserving the conversational flow.
- **State tracking**: `maxOutputTokensRecoveryCount` is reset to 0 on each successful turn, allowing recovery on subsequent truncations.

**Key insight:** The continuation message is deliberately terse and instructional. It avoids triggering the LLM's tendency to apologize or summarize, instead encouraging it to pick up exactly where it left off.

---

## Model Fallback Flow

### ModelFallbackError (R36) - Error Class

**What it does:**
Special error class that signals the primary model is overloaded and a fallback model should be used.

```javascript
// ============================================
// ModelFallbackError - Signals model overload, triggers fallback
// Location: chunks.89.mjs:260-269
// ============================================

// ORIGINAL (for source lookup):
R36 = class R36 extends Error {
    originalModel;
    fallbackModel;
    constructor(A, q) {
        super(`Model fallback triggered: ${A} -> ${q}`);
        this.originalModel = A;
        this.fallbackModel = q;
        this.name = "FallbackTriggeredError"
    }
}

// READABLE (for understanding):
class ModelFallbackError extends Error {
    originalModel;
    fallbackModel;

    constructor(originalModel, fallbackModel) {
        super(`Model fallback triggered: ${originalModel} -> ${fallbackModel}`);
        this.originalModel = originalModel;
        this.fallbackModel = fallbackModel;
        this.name = "FallbackTriggeredError";
    }
}

// Mapping: R36→ModelFallbackError, A→originalModel, q→fallbackModel
```

### Fallback Recovery Flow

**What it does:**
When the primary model (e.g., claude-opus-4-6) is overloaded, the agent catches `ModelFallbackError` and seamlessly switches to the fallback model (e.g., claude-sonnet-4-6).

**How it works:**

1. **Error Detection**: During API streaming, if `ModelFallbackError` is thrown and `fallbackModel` is available.

2. **State Cleanup**:
   - Clear accumulated messages (`e.length = 0`)
   - Clear tool results (`Y6.length = 0`)
   - Clear tool uses (`H6.length = 0`)
   - Discard streaming tool executor state (`s.discard()`, create new executor)

3. **Model Switch**: Set `options.mainLoopModel = fallbackModel` for subsequent calls.

4. **User Notification**: Yield a transition message: "Switched to [model] due to high demand for [original]".

5. **Telemetry**: Log `tengu_model_fallback_triggered` event with both model names.

6. **Retry**: Continue the loop with the fallback model.

```javascript
// ============================================
// Model Fallback Recovery - Seamless model switching on overload
// Location: chunks.148.mjs:1117-1129
// ============================================

// ORIGINAL (for source lookup):
if (D6 instanceof R36 && w) {
    if (N6 = w, o = !0, yield* Sp8(e, "Model fallback triggered"), e.length = 0, Y6.length = 0, H6.length = 0, J6 = !1, s) s.discard(), s = new ui6(X.options.tools, _, X);
    X.options.mainLoopModel = w, d("tengu_model_fallback_triggered", {
        original_model: D6.originalModel,
        fallback_model: w,
        entrypoint: "cli",
        queryChainId: u,
        queryDepth: R.depth
    }), yield P$(`Switched to ${qJ(D6.fallbackModel)} due to high demand for ${qJ(D6.originalModel)}`, "warning");
    continue
}

// READABLE (for understanding):
if (error instanceof ModelFallbackError && fallbackModel) {
    fallbackModelToUse = fallbackModel;
    didFallback = true;

    // Yield tombstone messages for any partial assistant messages
    yield* tombstoneMessages(assistantMessages, "Model fallback triggered");

    // Clear all accumulated state
    assistantMessages.length = 0;
    toolResults.length = 0;
    toolUses.length = 0;
    hasToolUses = false;

    // Discard old streaming executor, create fresh one
    if (streamingToolExecutor) {
        streamingToolExecutor.discard();
        streamingToolExecutor = new StreamingToolExecutor(options.tools, canUseTool, context);
    }

    // Switch model for subsequent calls
    options.mainLoopModel = fallbackModel;

    // Log telemetry
    logEvent("tengu_model_fallback_triggered", {
        original_model: error.originalModel,
        fallback_model: fallbackModel,
        entrypoint: "cli",
        queryChainId: chainId,
        queryDepth: queryTracking.depth
    });

    // Notify user
    yield showWarning(`Switched to ${formatModelName(error.fallbackModel)} due to high demand for ${formatModelName(error.originalModel)}`);

    continue; // Retry with fallback model
}

// Mapping: D6→error, R36→ModelFallbackError, w→fallbackModel, N6→fallbackModelToUse,
//   o→didFallback, Sp8→tombstoneMessages, e→assistantMessages, Y6→toolResults,
//   H6→toolUses, J6→hasToolUses, s→streamingToolExecutor, ui6→StreamingToolExecutor,
//   X→context, _→canUseTool, d→logEvent, P$→showWarning, qJ→formatModelName
```

**Why this approach:**
- **Clean state reset**: Clearing all accumulated state prevents mixing partial results from different models.
- **StreamingToolExecutor discard**: The executor may have partial tool executions in progress that need to be abandoned.
- **User notification**: Users are informed of the model switch so they understand any quality differences.
- **Telemetry tracking**: Critical for understanding fallback frequency and model reliability.

**Key insight:** The fallback happens per-query, not per-session. After a fallback, all subsequent turns in that conversation use the fallback model. This ensures consistency within a single conversation.

---

## Stop Hook Integration

### executeStopHooks (VKq) - Hook Orchestration

**What it does:**
The stop hooks system runs after each assistant turn to check for blocking conditions, extract memories, and potentially prevent continuation. This is a powerful extension point for customizing agent behavior.

**How it works:**

1. **Hook Context Building**: Assemble the full context (messages, system prompt, user context) for hook execution.

2. **Memory Extraction**: If not in a subagent, run `executeExtractMemories` to process conversation for long-term memory.

3. **Stop Hook Execution**: Run `Lp8` (executeStopHooksCore) which:
   - Executes configured `Stop` hooks
   - Collects progress messages and errors
   - Determines if continuation should be blocked

4. **Result Processing**:
   - `preventContinuation: true` → Agent stops, returns `{ reason: "stop_hook_prevented" }`
   - `blockingErrors: [...]` → Agent continues with errors injected into context
   - Normal completion → Agent continues to next turn

```javascript
// ============================================
// executeStopHooks - Runs hooks after assistant turn
// Location: chunks.148.mjs:621-694
// ============================================

// ORIGINAL (for source lookup):
async function* VKq(A, q, K, Y, z, _, w, O) {
    let $ = Date.now(),
        H = {
            messages: [...A, ...q],
            systemPrompt: K,
            userContext: Y,
            systemContext: z,
            toolUseContext: _,
            querySource: w
        };
    if (process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") {
        if (w === "repl_main_thread" || w === "sdk") EKq(Fb(H));
        yKq(H)
    }
    if (!_.agentId) imY.executeExtractMemories(H, _.addNotification);
    try {
        let j = [],
            M = _.getAppState().toolPermissionContext.mode,
            D = Lp8(M, _.abortController.signal, void 0, O ?? !1, _.agentId, _, [...A, ...q], _.agentType),
            X = "",
            P = 0,
            W = !1,
            Z = "",
            G = !1,
            f = [],
            v = [];
        for await (let N of D) {
            if (N.message) {
                if (yield N.message, N.message.type === "progress" && N.message.toolUseID) {
                    X = N.message.toolUseID, P++;
                    let V = N.message.data;
                    if (V.command) v.push({
                        command: V.command,
                        promptText: V.promptText
                    })
                }
                if (N.message.type === "attachment") {
                    let V = N.message.attachment;
                    if ("hookEvent" in V && (V.hookEvent === "Stop" || V.hookEvent === "SubagentStop")) {
                        if (V.type === "hook_non_blocking_error") f.push(V.stderr || `Exit code ${V.exitCode}`), G = !0;
                        else if (V.type === "hook_error_during_execution") f.push(V.content), G = !0;
                        else if (V.type === "hook_success") {
                            if (V.stdout && V.stdout.trim() || V.stderr && V.stderr.trim()) G = !0
                        }
                        if ("durationMs" in V && "command" in V) {
                            let L = v.find((h) => h.command === V.command && h.durationMs === void 0);
                            if (L) L.durationMs = V.durationMs
                        }
                    }
                }
            }
            if (N.blockingError) {
                let V = p1({
                    content: Ep8(N.blockingError),
                    isMeta: !0
                });
                j.push(V), yield V, G = !0, f.push(N.blockingError.blockingError)
            }
            if (N.preventContinuation) W = !0, Z = N.stopReason || "Stop hook prevented continuation", yield f4({
                type: "hook_stopped_continuation",
                message: Z,
                hookName: "Stop",
                toolUseID: X,
                hookEvent: "Stop"
            });
            if (_.abortController.signal.aborted) return d("tengu_pre_stop_hooks_cancelled", {
                queryChainId: _.queryTracking?.chainId,
                queryDepth: _.queryTracking?.depth
            }), yield Ug({
                toolUse: !1
            }), {
                blockingErrors: [],
                preventContinuation: !0
            }
        }
        // ... continued below
    }
}

// READABLE (for understanding):
async function* executeStopHooks(previousMessages, assistantMessages, systemPrompt, userContext, systemContext, toolUseContext, querySource, stopHookWasActive) {
    let startTime = Date.now();

    let hookContext = {
        messages: [...previousMessages, ...assistantMessages],
        systemPrompt,
        userContext,
        systemContext,
        toolUseContext,
        querySource
    };

    // Prompt suggestion feature (if enabled)
    if (process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") {
        if (querySource === "repl_main_thread" || querySource === "sdk") {
            generatePromptSuggestion(buildPromptSuggestionContext(hookContext));
        }
        enqueuePromptSuggestion(hookContext);
    }

    // Memory extraction (only for main agent, not subagents)
    if (!toolUseContext.agentId) {
        memoryExtractor.executeExtractMemories(hookContext, toolUseContext.addNotification);
    }

    try {
        let blockingErrors = [];
        let permissionMode = toolUseContext.getAppState().toolPermissionContext.mode;

        // Execute stop hooks
        let hookIterator = executeStopHooksCore(
            permissionMode,
            toolUseContext.abortController.signal,
            undefined,
            stopHookWasActive ?? false,
            toolUseContext.agentId,
            toolUseContext,
            [...previousMessages, ...assistantMessages],
            toolUseContext.agentType
        );

        let currentToolUseID = "";
        let hookCount = 0;
        let shouldPreventContinuation = false;
        let stopReason = "";
        let hasHookOutput = false;
        let errorMessages = [];
        let hookCommands = [];

        for await (let hookResult of hookIterator) {
            // Yield progress messages
            if (hookResult.message) {
                yield hookResult.message;

                // Track tool use ID for correlation
                if (hookResult.message.type === "progress" && hookResult.message.toolUseID) {
                    currentToolUseID = hookResult.message.toolUseID;
                    hookCount++;

                    let data = hookResult.message.data;
                    if (data.command) {
                        hookCommands.push({
                            command: data.command,
                            promptText: data.promptText
                        });
                    }
                }

                // Process hook attachments
                if (hookResult.message.type === "attachment") {
                    let attachment = hookResult.message.attachment;

                    // Check for Stop/SubagentStop events
                    if ("hookEvent" in attachment && (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop")) {
                        if (attachment.type === "hook_non_blocking_error") {
                            errorMessages.push(attachment.stderr || `Exit code ${attachment.exitCode}`);
                            hasHookOutput = true;
                        } else if (attachment.type === "hook_error_during_execution") {
                            errorMessages.push(attachment.content);
                            hasHookOutput = true;
                        } else if (attachment.type === "hook_success") {
                            if (attachment.stdout?.trim() || attachment.stderr?.trim()) {
                                hasHookOutput = true;
                            }
                        }

                        // Track duration for command correlation
                        if ("durationMs" in attachment && "command" in attachment) {
                            let command = hookCommands.find(c => c.command === attachment.command && c.durationMs === undefined);
                            if (command) {
                                command.durationMs = attachment.durationMs;
                            }
                        }
                    }
                }
            }

            // Handle blocking errors
            if (hookResult.blockingError) {
                let blockingMessage = createUserMessage({
                    content: formatBlockingError(hookResult.blockingError),
                    isMeta: true
                });
                blockingErrors.push(blockingMessage);
                yield blockingMessage;
                hasHookOutput = true;
                errorMessages.push(hookResult.blockingError.blockingError);
            }

            // Handle preventContinuation
            if (hookResult.preventContinuation) {
                shouldPreventContinuation = true;
                stopReason = hookResult.stopReason || "Stop hook prevented continuation";

                yield createHookStoppedAttachment({
                    type: "hook_stopped_continuation",
                    message: stopReason,
                    hookName: "Stop",
                    toolUseID: currentToolUseID,
                    hookEvent: "Stop"
                });
            }

            // Handle abort during hook execution
            if (toolUseContext.abortController.signal.aborted) {
                logEvent("tengu_pre_stop_hooks_cancelled", {
                    queryChainId: toolUseContext.queryTracking?.chainId,
                    queryDepth: toolUseContext.queryTracking?.depth
                });

                yield createAbortAttachment({ toolUse: false });

                return {
                    blockingErrors: [],
                    preventContinuation: true
                };
            }
        }
        // ... (continuation logic in next section)
    }
}

// Mapping: VKq→executeStopHooks, A→previousMessages, q→assistantMessages, K→systemPrompt,
//   Y→userContext, z→systemContext, _→toolUseContext, w→querySource, O→stopHookWasActive,
//   H→hookContext, j→blockingErrors, M→permissionMode, D→hookIterator, Lp8→executeStopHooksCore,
//   X→currentToolUseID, P→hookCount, W→shouldPreventContinuation, Z→stopReason, G→hasHookOutput,
//   f→errorMessages, v→hookCommands, N→hookResult, p1→createUserMessage, Ep8→formatBlockingError,
//   f4→createHookStoppedAttachment, d→logEvent, Ug→createAbortAttachment
```

### Stop Hook Return Values

The stop hook can return different outcomes:

| Outcome | Condition | Agent Behavior |
|---------|-----------|----------------|
| Normal completion | No blocking errors, no prevent | Continue to next turn |
| `preventContinuation: true` | Hook explicitly stopped | Return `{ reason: "stop_hook_prevented" }` |
| `blockingErrors: [...]` | Non-fatal errors occurred | Inject errors into context, continue |
| Both present | Fatal errors + stop | Return `{ reason: "stop_hook_prevented" }` |

### Stop Hook in Main Loop

```javascript
// ============================================
// Stop Hook Integration in mainAgentLoopCore
// Location: chunks.148.mjs:1235-1258
// ============================================

// ORIGINAL (for source lookup):
let k6 = yield* VKq(I, e, K, Y, z, X, O, N);
if (k6.preventContinuation) return {
    reason: "stop_hook_prevented"
};
if (k6.blockingErrors.length > 0) {
    J = {
        messages: [...I, ...e, ...k6.blockingErrors],
        toolUseContext: X,
        autoCompactTracking: g,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: G,
        maxOutputTokensOverride: void 0,
        pendingToolUseSummary: void 0,
        stopHookActive: !0,
        turnCount: V,
        transition: {
            reason: "stop_hook_blocking"
        }
    };
    continue
}
return {
    reason: "completed"
}

// READABLE (for understanding):
let stopHookResult = yield* executeStopHooks(previousMessages, assistantMessages, systemPrompt, userContext, systemContext, context, querySource, stopHookWasActive);

// Case 1: Hook prevented continuation entirely
if (stopHookResult.preventContinuation) {
    return { reason: "stop_hook_prevented" };
}

// Case 2: Hook returned blocking errors - continue with errors in context
if (stopHookResult.blockingErrors.length > 0) {
    state = {
        messages: [...previousMessages, ...assistantMessages, ...stopHookResult.blockingErrors],
        toolUseContext: context,
        autoCompactTracking: compactTracking,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: hasAttemptedReactive,
        maxOutputTokensOverride: undefined,
        pendingToolUseSummary: undefined,
        stopHookActive: true,
        turnCount: currentTurnCount,
        transition: {
            reason: "stop_hook_blocking"
        }
    };
    continue; // Loop back for LLM to address blocking errors
}

// Case 3: Normal completion
return { reason: "completed" };

// Mapping: k6→stopHookResult, VKq→executeStopHooks, I→previousMessages, e→assistantMessages,
//   K→systemPrompt, Y→userContext, z→systemContext, X→context, O→querySource, N→stopHookWasActive,
//   J→state, g→compactTracking, G→hasAttemptedReactive, V→currentTurnCount
```

**Why this approach:**
- **Two-tier blocking**: `preventContinuation` for hard stops, `blockingErrors` for recoverable issues.
- **Blocking error recovery**: Injecting errors into context allows the LLM to address them in the next turn.
- **Stop hook tracking**: `stopHookActive` flag persists across turns, allowing hooks to know if previous execution was blocked.

**Key insight:** The `stop_hook_blocking` transition allows hooks to return errors that the LLM must address before the conversation can complete. This enables quality gates like linting, type checking, or custom validation.

---

## Cross-Feature Integration

### Integration with 04_system_reminder

The agent loop produces system reminders through the attachment pipeline:

- **Producer path**: `Vf6(null, context, null, queuedCommands, messages, querySource)` at line 1347
- **Attachment injection**: Produced attachments are yielded and accumulated in `Y6` (toolResults)
- **Key connection**: `_uY` (assembleAllAttachments) → `Vf6` (attachment producer) → message injection

**When reminders are produced:**
1. After tool execution completes
2. After auto-compact summaries
3. On turn transitions with queued commands
4. From hook execution results

### Integration with 07_compact

The compact system integrates at multiple points:

- **Micro-compact**: Runs on every turn before API call (line ~907)
- **Auto-compact**: Checks threshold and triggers summarization (line ~915)
- **Reactive compact**: Triggered when context is too long for the model (lines 1170-1205)

**Compact state tracking:**
- `autoCompactTracking` tracks compaction status across turns
- `maxOutputTokensRecoveryCount` is reset after successful turns
- `hasAttemptedReactiveCompact` prevents retry loops

### Integration with 11_hooks

Hooks integrate through several functions:

- **Pre-tool hooks**: `y4q` (executePreToolHooksIterator) runs before tool execution
- **Post-tool hooks**: `k4q` (executePostToolHooksIterator) runs after tool completion
- **Stop hooks**: `VKq` (executeStopHooks) runs after assistant turns
- **Permission bypass**: Hooks can bypass permission checks via `hookPermissionResult`

**Hook effects on agent loop:**
- `preventContinuation` stops the agent loop
- `blockingErrors` inject errors into context
- `updatedInput` modifies tool inputs

### Integration with 19_think_level

Thinking mode affects the LLM API call:

- **Config propagation**: `thinkingConfig` passed through `callModel` to API
- **Beta headers**: Adaptive thinking requires specific beta headers
- **Effort levels**: Mapped to `output_config.effort` in API request

**Thinking mode state:**
- Tracked in `options.thinkingConfig`
- Affects `maxTokens` calculation for thinking budget
- Influences cache strategy (adaptive vs enabled)

---

## Performance Marks

The agent loop records timing marks at key points:

| Mark | Purpose |
|------|---------|
| `query_fn_entry` | Turn start |
| `query_microcompact_start/end` | Micro-compact duration |
| `query_autocompact_start/end` | Auto-compact duration |
| `query_api_streaming_start/end` | API call duration |
| `query_tool_execution_start/end` | Tool execution duration |
| `query_recursive_call` | Before recursive continuation |

These marks enable performance profiling via the profiling report feature.

---

## Key Algorithms (Source-Verified)

### Model Fallback Algorithm

**What it does:** When the primary model is overloaded (ModelFallbackError), automatically switches to a fallback model and retries the request.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Model Fallback - Automatic retry with fallback model
// Location: chunks.148.mjs:1116-1129
// ============================================

// ORIGINAL (for source lookup):
} catch (D6) {
    if (D6 instanceof R36 && w) {
        if (N6 = w, o = !0, yield* Sp8(e, "Model fallback triggered"), e.length = 0, Y6.length = 0, H6.length = 0, J6 = !1, s) s.discard(), s = new ui6(X.options.tools, _, X);
        X.options.mainLoopModel = w, d("tengu_model_fallback_triggered", {
            original_model: D6.originalModel,
            fallback_model: w,
            entrypoint: "cli",
            queryChainId: u,
            queryDepth: R.depth
        }), yield P$(`Switched to ${qJ(D6.fallbackModel)} due to high demand for ${qJ(D6.originalModel)}`, "warning");
        continue
    }
    throw D6
}

// READABLE (for understanding):
} catch (error) {
    // Only handle ModelFallbackError (R36) when fallback model is available
    if (error instanceof ModelFallbackError && fallbackModel) {
        // Switch to fallback model
        currentModel = fallbackModel;
        shouldRetry = true;

        // Yield tombstone events for partial messages
        yield* createErrorToolResults(assistantMessages, "Model fallback triggered");

        // Clear all accumulated state
        assistantMessages.length = 0;
        toolResults.length = 0;
        toolUseBlocks.length = 0;
        hasToolUses = false;

        // Discard existing tool executor and create new one
        if (streamingToolExecutor) {
            streamingToolExecutor.discard();
            streamingToolExecutor = new StreamingToolExecutor(tools, canUseTool, context);
        }

        // Update context with fallback model
        context.options.mainLoopModel = fallbackModel;

        // Log telemetry
        logEvent("tengu_model_fallback_triggered", {
            original_model: error.originalModel,
            fallback_model: fallbackModel,
            entrypoint: "cli",
            queryChainId: chainId,
            queryDepth: queryDepth
        });

        // Notify user
        yield createWarningMessage(`Switched to ${formatModelName(error.fallbackModel)} due to high demand for ${formatModelName(error.originalModel)}`);

        continue; // Retry with fallback model
    }
    throw error;
}

// Mapping: D6→error, R36→ModelFallbackError, w→fallbackModel, N6→currentModel, o→shouldRetry,
//   Sp8→createErrorToolResults, e→assistantMessages, Y6→toolResults, H6→toolUseBlocks,
//   J6→hasToolUses, s→streamingToolExecutor, ui6→StreamingToolExecutor, X→context, d→logEvent,
//   u→chainId, R→queryTracking, P$→createWarningMessage, qJ→formatModelName
```

**Why this approach:**
- **Seamless degradation**: User doesn't need to manually retry - system handles it automatically
- **State cleanup**: All partial state is cleared before retry to avoid confusion
- **Telemetry tracking**: Logs which model was fallback from/to for capacity planning
- **User notification**: Shows warning so user knows quality may differ

**Key insight:** The fallback only triggers for `ModelFallbackError` (R36), which indicates server-side capacity issues. Other errors (auth, validation, etc.) are re-thrown. The `continue` statement retries the entire `while (o)` inner loop, not just the API call.

---

### Max Output Tokens Recovery Algorithm

**What it does:** When the LLM response hits `max_tokens` limit, automatically continues the conversation with a meta-prompt to resume generation.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Max Output Tokens Recovery - Continue generation after truncation
// Location: chunks.148.mjs:1207-1231
// ============================================

// ORIGINAL (for source lookup):
if (bKq(D6)) {
    if (Z < rmY) {
        let Z6 = p1({
            content: "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " + "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
            isMeta: !0
        });
        J = {
            messages: [...I, ...e, Z6],
            toolUseContext: X,
            autoCompactTracking: g,
            maxOutputTokensRecoveryCount: Z + 1,
            hasAttemptedReactiveCompact: G,
            maxOutputTokensOverride: void 0,
            pendingToolUseSummary: void 0,
            stopHookActive: void 0,
            turnCount: V,
            transition: {
                reason: "max_output_tokens_recovery",
                attempt: Z + 1
            }
        };
        continue
    }
    yield D6
}

// READABLE (for understanding):
if (isMaxOutputTokensMessage(lastMessage)) {
    // Only retry up to MAX_OUTPUT_TOKENS_RECOVERY times (3)
    if (recoveryCount < MAX_OUTPUT_TOKENS_RECOVERY) {
        // Create meta-prompt for continuation
        let continuationPrompt = createUserMessage({
            content: "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " +
                     "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
            isMeta: true
        });

        // Update state for retry
        state = {
            messages: [...previousMessages, ...assistantMessages, continuationPrompt],
            toolUseContext: context,
            autoCompactTracking: compactTracking,
            maxOutputTokensRecoveryCount: recoveryCount + 1,
            hasAttemptedReactiveCompact: hasAttemptedReactive,
            maxOutputTokensOverride: undefined,
            pendingToolUseSummary: undefined,
            stopHookActive: undefined,
            turnCount: currentTurnCount,
            transition: {
                reason: "max_output_tokens_recovery",
                attempt: recoveryCount + 1
            }
        };

        continue; // Retry with continuation prompt
    }

    // Max retries exceeded - yield the truncated message
    yield lastMessage;
}

// Mapping: bKq→isMaxOutputTokensMessage, D6→lastMessage, Z→recoveryCount, rmY→MAX_OUTPUT_TOKENS_RECOVERY,
//   p1→createUserMessage, J→state, I→previousMessages, e→assistantMessages, X→context, g→compactTracking,
//   G→hasAttemptedReactive, V→currentTurnCount
```

**Why this approach:**
- **Bounded retries**: Maximum 3 recovery attempts prevents infinite loops
- **Natural continuation**: The meta-prompt instructs the LLM to resume naturally without apologizing
- **Attempt tracking**: `transition.attempt` logs which retry attempt this is
- **Mid-thought recovery**: Prompt specifically asks to "pick up mid-thought" for seamless continuation

**Key insight:** The recovery algorithm only triggers when `isMaxOutputTokensMessage` (bKq) returns true. This checks if `message.apiError === "max_output_tokens"`. The constant `rmY = 3` limits recovery attempts. After 3 failed attempts, the truncated message is yielded as-is.

---

### Tool Execution with StreamingToolExecutor

**What it does:** Executes tool calls in parallel during LLM streaming, reducing perceived latency.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Tool Execution Phase - Parallel streaming execution
// Location: chunks.148.mjs:1260-1283
// ============================================

// ORIGINAL (for source lookup):
let a = !1,
    i = X;
if (K5("query_tool_execution_start"), s) d("tengu_streaming_tool_execution_used", {
    tool_count: H6.length,
    queryChainId: u,
    queryDepth: R.depth
});
else d("tengu_streaming_tool_execution_not_used", {
    tool_count: H6.length,
    queryChainId: u,
    queryDepth: R.depth
});
let l = s ? s.getRemainingResults() : GE1(H6, e, _, X);
for await (let D6 of l) {
    if (D6.message) {
        if (yield D6.message, D6.message.type === "attachment" && D6.message.attachment.type === "hook_stopped_continuation") a = !0;
        Y6.push(...cM([D6.message], X.options.tools).filter((Q6) => Q6.type === "user"))
    }
    if (D6.newContext) i = {
        ...D6.newContext,
        queryTracking: R
    }
}
K5("query_tool_execution_end");

// READABLE (for understanding):
let hookStoppedContinuation = false;
let updatedContext = context;

recordMark("query_tool_execution_start");

// Log whether streaming tool execution was used
if (streamingToolExecutor) {
    logEvent("tengu_streaming_tool_execution_used", {
        tool_count: toolUseBlocks.length,
        queryChainId: chainId,
        queryDepth: queryDepth
    });
} else {
    logEvent("tengu_streaming_tool_execution_not_used", {
        tool_count: toolUseBlocks.length,
        queryChainId: chainId,
        queryDepth: queryDepth
    });
}

// Get results: either drain streaming executor or run sequentially
let resultIterator = streamingToolExecutor
    ? streamingToolExecutor.getRemainingResults()
    : executeToolsSequentially(toolUseBlocks, assistantMessages, canUseTool, context);

for await (let result of resultIterator) {
    if (result.message) {
        yield result.message;

        // Check for hook-stopped continuation
        if (result.message.type === "attachment" &&
            result.message.attachment.type === "hook_stopped_continuation") {
            hookStoppedContinuation = true;
        }

        // Normalize and accumulate tool results
        toolResults.push(...normalizeMessages([result.message], context.options.tools)
            .filter((msg) => msg.type === "user"));
    }

    // Handle context updates from tool execution
    if (result.newContext) {
        updatedContext = {
            ...result.newContext,
            queryTracking: queryTracking
        };
    }
}

recordMark("query_tool_execution_end");

// Mapping: a→hookStoppedContinuation, i→updatedContext, K5→recordMark, s→streamingToolExecutor,
//   d→logEvent, H6→toolUseBlocks, u→chainId, R→queryTracking, l→resultIterator,
//   GE1→executeToolsSequentially, Y6→toolResults, cM→normalizeMessages
```

**Why this approach:**
- **Parallel vs sequential**: StreamingToolExecutor runs tools in parallel when possible; sequential fallback when disabled
- **Context propagation**: Tools can modify context via `newContext`, which is passed to subsequent tools
- **Hook integration**: `hook_stopped_continuation` attachment type signals a hook stopped the tool chain
- **Message normalization**: `cM` (normalizeMessages) converts tool results to user messages for context

**Key insight:** The `getRemainingResults()` method drains any tools that were started during streaming but not yet completed. This ensures all tool results are collected before the next turn. The `GE1` (executeToolsSequentially) is the fallback path when streaming tool execution is disabled.

---

### Attachment Production After Tool Execution

**What it does:** After tools complete, produces contextual attachments (changed files, todos, etc.) to inject into the conversation.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Attachment Production - Contextual reminders after tools
// Location: chunks.148.mjs:1345-1367
// ============================================

// ORIGINAL (for source lookup):
let w6 = H6.some((D6) => D6.name === gz6),
    O6 = O.startsWith("repl_main_thread") || O === "sdk" ? rP1(w6 ? "later" : "next") : [];
for await (let D6 of Vf6(null, i, null, O6, [...I, ...e, ...Y6], O)) yield D6, Y6.push(D6);

// READABLE (for understanding):
// Check if any tool was a background agent tool
let hasBackgroundAgentTool = toolUseBlocks.some((block) => block.name === BACKGROUND_AGENT_TOOL_NAME);

// Get queued commands based on execution context
let queuedCommands = (querySource.startsWith("repl_main_thread") || querySource === "sdk")
    ? getQueuedCommands(hasBackgroundAgentTool ? "later" : "next")
    : [];

// Produce all attachments
for await (let attachment of attachmentGenerator(
    null,                           // userMessage (null - not from user input)
    updatedContext,                 // toolUseContext
    null,                           // ideContext
    queuedCommands,                 // queuedCommands
    [...previousMessages, ...assistantMessages, ...toolResults],  // messages
    querySource
)) {
    yield attachment;
    toolResults.push(attachment);
}

// Mapping: w6→hasBackgroundAgentTool, H6→toolUseBlocks, gz6→BACKGROUND_AGENT_TOOL_NAME,
//   O6→queuedCommands, O→querySource, rP1→getQueuedCommands, Vf6→attachmentGenerator,
//   I→previousMessages, e→assistantMessages, Y6→toolResults
```

**Why this approach:**
- **Deferred command scheduling**: Background agent tools trigger "later" scheduling; other tools trigger "next"
- **Comprehensive context**: Attachments include all messages (previous + assistant + tool results)
- **Incremental yielding**: Each attachment is yielded immediately, allowing UI updates

**Key insight:** The attachment production uses `Vf6` (attachmentGenerator) which internally calls `_uY` (assembleAllAttachments). This is the primary integration point with the `04_system_reminder` module. See [04_system_reminder/](../04_system_reminder/) for the complete attachment producer list.

---

## Transition State Machine

The agent loop uses a transition system to track why each turn occurred:

| Transition Reason | When | Next Action |
|-------------------|------|-------------|
| `next_turn` | Normal continuation after tool execution | Continue with updated messages |
| `reactive_compact_retry` | After reactive compact succeeds | Retry LLM call with compacted messages |
| `max_output_tokens_recovery` | After max_tokens hit (under retry limit) | Continue with meta-prompt |
| `stop_hook_blocking` | Stop hook returned blocking errors | Continue with errors in context |
| `model_fallback` | After switching to fallback model | Retry with fallback model |

**State reset on `next_turn`:**
- `maxOutputTokensRecoveryCount` → 0
- `hasAttemptedReactiveCompact` → false
- `pendingToolUseSummary` → Promise (async summary generation)

**State preserved across turns:**
- `autoCompactTracking` (until reset by new compact)

---

## StreamingToolExecutor Class (ui6) - VERIFIED

**What it does:**
The `StreamingToolExecutor` (ui6) is a class that manages parallel tool execution during streaming. When the LLM emits `tool_use` blocks during streaming, this executor can start executing them immediately rather than waiting for the entire response to complete.

**Location:** chunks.148.mjs:3-200

**Key insight:** This class is critical for reducing perceived latency. Users see tool results appearing while the LLM is still generating the response. The executor also manages concurrency safety - tools marked as `isConcurrencySafe` can run in parallel, while non-safe tools must run sequentially.

### Class Implementation

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution during streaming
// Location: chunks.148.mjs:3-200
// ============================================

// ORIGINAL (for source lookup):
class ui6 {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = !1;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = !1;
    progressAvailableResolve;
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K, this.siblingAbortController = Wm(K.abortController)
    }
    discard() {
        this.discarded = !0
    }
    addTool(A, q) {
        let K = dK(this.toolDefinitions, A.name);
        if (!K) {
            this.tools.push({
                id: A.id,
                block: A,
                assistantMessage: q,
                status: "completed",
                isConcurrencySafe: !0,
                pendingProgress: [],
                results: [p1({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${A.name}</tool_use_error>`,
                        is_error: !0,
                        tool_use_id: A.id
                    }],
                    toolUseResult: `Error: No such tool available: ${A.name}`,
                    sourceToolAssistantUUID: q.uuid
                })]
            });
            return
        }
        A.input = PE1(K, A.input);
        let Y = K.inputSchema.safeParse(A.input),
            z = Y?.success ? (() => {
                try {
                    return Boolean(K.isConcurrencySafe(Y.data))
                } catch {
                    return !1
                }
            })() : !1;
        this.tools.push({
            id: A.id,
            block: A,
            assistantMessage: q,
            status: "queued",
            isConcurrencySafe: z,
            pendingProgress: []
        }), this.processQueue()
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    async processQueue() {
        for (let A of this.tools) {
            if (A.status !== "queued") continue;
            if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
            else if (!A.isConcurrencySafe) break
        }
    }
    // ... additional methods ...
}

// READABLE (for understanding):
class StreamingToolExecutor {
    toolDefinitions;           // Array of available tools
    canUseTool;                // Permission checker function
    tools = [];               // Queue of tool executions
    toolUseContext;           // Context for tool execution
    hasErrored = false;       // Did a parallel tool error?
    erroredToolDescription;   // Description of errored tool
    siblingAbortController;   // Abort controller for sibling tools
    discarded = false;        // Has this executor been discarded?
    progressAvailableResolve; // Promise resolver for progress wait

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Create a derived abort controller for sibling cancellation
        this.siblingAbortController = deriveAbortController(toolUseContext.abortController);
    }

    discard() {
        this.discarded = true;  // Signal to stop all execution
    }

    addTool(toolUseBlock, assistantMessage) {
        // Find the tool definition
        let toolDef = findToolByName(this.toolDefinitions, toolUseBlock.name);

        if (!toolDef) {
            // Tool not found - return error immediately
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage: assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                pendingProgress: [],
                results: [createUserMessage({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${toolUseBlock.name}</tool_use_error>`,
                        is_error: true,
                        tool_use_id: toolUseBlock.id
                    }],
                    toolUseResult: `Error: No such tool available: ${toolUseBlock.name}`,
                    sourceToolAssistantUUID: assistantMessage.uuid
                })]
            });
            return;
        }

        // Normalize input using tool's backfill function
        toolUseBlock.input = backfillToolInput(toolDef, toolUseBlock.input);

        // Parse and validate input
        let parseResult = toolDef.inputSchema.safeParse(toolUseBlock.input);

        // Determine if tool is concurrency-safe
        let isConcurrencySafe = parseResult?.success ? (() => {
            try {
                return Boolean(toolDef.isConcurrencySafe(parseResult.data));
            } catch {
                return false;
            }
        })() : false;

        // Add to queue
        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
            status: "queued",
            isConcurrencySafe: isConcurrencySafe,
            pendingProgress: []
        });

        // Start processing queue
        this.processQueue();
    }

    canExecuteTool(isConcurrencySafe) {
        let executingTools = this.tools.filter((t) => t.status === "executing");
        // Can execute if: no tools running, OR all running tools are concurrency-safe AND new tool is safe
        return executingTools.length === 0 ||
               (isConcurrencySafe && executingTools.every((t) => t.isConcurrencySafe));
    }

    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;

            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                // Non-safe tool must wait - break out and let current execution complete
                break;
            }
        }
    }

    *getCompletedResults() {
        if (this.discarded) return;

        for (let tool of this.tools) {
            // Yield any pending progress messages first
            while (tool.pendingProgress.length > 0) {
                yield {
                    message: tool.pendingProgress.shift(),
                    newContext: this.toolUseContext
                };
            }

            // Skip already-yielded tools
            if (tool.status === "yielded") continue;

            // Yield completed tool results
            if (tool.status === "completed" && tool.results) {
                tool.status = "yielded";
                for (let result of tool.results) {
                    yield {
                        message: result,
                        newContext: this.toolUseContext
                    };
                }
                // Clear in-progress tracking
                clearInProgressToolUseID(this.toolUseContext, tool.id);
            } else if (tool.status === "executing" && !tool.isConcurrencySafe) {
                // Non-safe tool still running - stop yielding
                break;
            }
        }
    }
}

// Mapping: ui6→StreamingToolExecutor, dK→findToolByName, PE1→backfillToolInput,
//   p1→createUserMessage, Wm→deriveAbortController
```

### Concurrency Algorithm

**What it does:**
The executor implements a sophisticated concurrency model:

1. **Concurrency-Safe Tools**: Multiple safe tools can execute in parallel
2. **Non-Safe Tools**: Must wait for all running tools to complete before starting
3. **Sibling Cancellation**: If one tool errors, other parallel tools are cancelled

**Concurrency Decision Tree:**

```
addTool(toolUseBlock)
    │
    ├── Find tool definition
    ├── Parse input
    ├── Check isConcurrencySafe()
    │
    └── processQueue()
        │
        ├── For each queued tool:
        │   │
        │   ├── canExecuteTool(isSafe)?
        │   │   │
        │   │   ├── No tools running → YES, execute
        │   │   ├── All running are safe AND new is safe → YES, execute in parallel
        │   │   └── Otherwise → NO, wait
        │   │
        │   └── If NOT safe and can't execute → break (wait)
        │
        └── executeTool() runs async, calls processQueue() on completion
```

### Error Handling and Sibling Cancellation

**What it does:**
When a tool execution fails (especially BashTool), other parallel tools are cancelled to prevent inconsistent state.

```javascript
// ============================================
// Error Handling - Sibling cancellation
// Location: chunks.148.mjs:165-167
// ============================================

// ORIGINAL (for source lookup):
if (H.message.type === "user" && Array.isArray(H.message.message.content) &&
    H.message.message.content.some((M) => M.type === "tool_result" && M.is_error === !0)) {
    if ($ = !0, A.block.name === Q7)
        this.hasErrored = !0,
        this.erroredToolDescription = this.getToolDescription(A),
        this.siblingAbortController.abort("sibling_error")
}

// READABLE (for understanding):
if (result.message.type === "user" &&
    Array.isArray(result.message.message.content) &&
    result.message.message.content.some((block) =>
        block.type === "tool_result" && block.is_error === true
    )) {

    hadError = true;

    // Special handling for Bash tool errors
    if (tool.block.name === TOOL_NAME_BASH) {
        this.hasErrored = true;
        this.erroredToolDescription = this.getToolDescription(tool);
        // Abort all sibling tools
        this.siblingAbortController.abort("sibling_error");
    }
}

// Mapping: H→result, M→block, A→tool, Q7→TOOL_NAME_BASH, $→hadError
```

**Why this approach:**
- **Bash errors are critical**: A failed bash command might have left the filesystem in an unexpected state
- **Sibling cancellation**: Other parallel tools might depend on the failed operation
- **Graceful degradation**: Each sibling tool gets a synthetic error message, not a hard abort

---

## Summary

The agent loop (`mainAgentLoop`/`Yh`) is the core orchestrator that manages the entire conversation lifecycle. Key components verified:

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Entry point | `Yh` | chunks.148.mjs:875 | Wrapper that tracks progress messages |
| Core implementation | `omY` | chunks.148.mjs:882 | Turn loop with compaction, API calls, tool execution |
| Streaming tool executor | `ui6` | chunks.148.mjs:3 | Parallel tool execution during streaming |
| Tool dispatcher | `Wi6` | chunks.146.mjs:285 | Routes tool calls to implementations |
| Tool executor core | `fxY` | chunks.146.mjs:442 | Permission checks, hooks, actual execution |
| Session gates | `RKq` | chunks.148.mjs:816 | Feature flags for current session |
| Model helpers | `SKq` | chunks.148.mjs:834 | Factory for callModel, microcompact, autocompact |

**Cross-feature integrations:**
- **04_system_reminder**: Attachment production via `Vf6`/`_uY`
- **05_tools**: Tool execution via `Wi6`/`fxY`
- **07_compact**: Auto-compact via `sqq`
- **11_hooks**: Stop/pre/post hooks integration
- **12_plan_mode**: Plan mode attachments and transitions
- `stopHookActive` (set by stop hook blocking)

---

## Cross-Feature Linkages

### Integration with 04_system_reminder

The agent loop integrates with the attachment system at multiple points:

**Attachment Production Points:**
1. **After tool execution** - `Vf6` (attachmentGenerator) is called to produce reminders
2. **Plan mode attachments** - Plan file content is injected as attachments
3. **Todo reminders** - Periodic reminders to use TodoWrite tool

**Integration Flow:**
```
Tool Execution Complete
    ↓
assembleAllAttachments (_uY)
    ├── changed_files → git status
    ├── nested_memory → memory file changes
    ├── plan_reminder → plan file content
    └── todo_reminder → pending todos
    ↓
normalizeAttachmentForAPI (Ui8)
    ↓
Yield attachment messages to conversation
```

**Key Function:** `attachmentGenerator` (Vf6) in chunks.147.mjs:822-829

### Integration with 05_tools

Tool execution is coordinated between agent loop and tool module:

**Execution Flow:**
```
LLM yields tool_use block
    ↓
StreamingToolExecutor.addTool()
    ↓
toolDispatcher (Wi6)
    ├── findTool() - Lookup by name
    ├── validateInput() - Zod validation
    ├── checkPermissions() - User approval if needed
    ├── executePreToolHooks() - Hook system
    └── executeToolCore (fxY) - Actual execution
    ↓
Result accumulated for next turn
```

**Concurrency Model:**
- Safe tools (Read, Glob, Grep) can run in parallel
- Non-safe tools (Edit, Write, Bash) wait for all others to complete
- Sibling cancellation on Bash errors

### Integration with 07_compact

Auto-compact is triggered before each API call:

**Trigger Flow:**
```
Turn Start
    ↓
microcompact (pg) - Remove duplicates
    ↓
autoCompact (sqq) - Check threshold
    ├── Check DISABLE_COMPACT env var
    ├── Check circuit breaker (3 failures)
    ├── Check token threshold
    └── If triggered: generate summary
    ↓
Messages replaced with summary + attachments
```

**Circuit Breaker Pattern:**
- Tracks `consecutiveFailures` in `autoCompactTracking`
- After 3 consecutive failures, compaction is disabled for the session
- Prevents infinite retry loops

### Integration with 11_hooks

Hooks integrate at multiple points in the agent loop:

**Hook Integration Points:**
| Hook Event | Location | Purpose |
|------------|----------|---------|
| PreToolUse | Before tool execution | Validate/modify input, auto-approve |
| PostToolUse | After tool execution | Process output, record metrics |
| Stop | After assistant turn | Extract memories, prevent continuation |
| Notification | On events | External notifications |

**Stop Hook Blocking:**
- Stop hooks can return `preventContinuation: true`
- Agent returns `{ reason: "stop_hook_prevented" }`
- Blocking errors are injected into context for retry

### Integration with 12_plan_mode

Plan mode affects the agent loop behavior:

**Plan Mode Attachments:**
- Plan file content injected on session start
- Plan reminder attachments on subsequent turns
- ExitPlanMode tool integration

**Plan Mode State Tracking:**
- `globalState.hasExitedPlanMode` - Prevents re-entering
- `needsPlanModeExitAttachment` - Triggers exit attachment

---

## Telemetry Events

### Query Lifecycle Events

```javascript
// Query started
logEvent("query_started", {
    hasUserMessage: boolean,
    messageCount: number
});

// Query completed
logEvent("query_completed", {
    turnCount: number,
    hadToolUse: boolean,
    exitReason: string
});

// Query error
logEvent("tengu_query_error", {
    assistantMessages: number,
    toolUses: number,
    queryChainId: string,
    queryDepth: number
});
```

### Compaction Events

```javascript
// Auto-compact succeeded
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

### Tool Execution Events

```javascript
// Model fallback triggered
logEvent("tengu_model_fallback_triggered", {
    original_model: string,
    fallback_model: string,
    entrypoint: string,
    queryChainId: string,
    queryDepth: number
});

// Orphaned messages tombstoned
logEvent("tengu_orphaned_messages_tombstoned", {
    orphanedMessageCount: number,
    queryChainId: string,
    queryDepth: number
});
```

### Performance Marks

```javascript
// Performance tracking via K5() function
recordPerformanceMark("query_fn_entry");
recordPerformanceMark("query_microcompact_start");
recordPerformanceMark("query_microcompact_end");
recordPerformanceMark("query_autocompact_start");
recordPerformanceMark("query_autocompact_end");
recordPerformanceMark("query_setup_start");
recordPerformanceMark("query_setup_end");
recordPerformanceMark("query_api_loop_start");
recordPerformanceMark("query_api_streaming_start");
recordPerformanceMark("query_api_streaming_end");
recordPerformanceMark("query_tool_execution_start");
recordPerformanceMark("query_tool_execution_end");
recordPerformanceMark("query_recursive_call");
```

---

## Verified Symbol Reference

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| Yh | mainAgentLoop | chunks.148.mjs:875 | Entry point wrapper |
| omY | mainAgentLoopCore | chunks.148.mjs:882 | Core turn loop implementation |
| ui6 | StreamingToolExecutor | chunks.148.mjs:3 | Parallel tool execution |
| RKq | getSessionGates | chunks.148.mjs:816 | Feature flags for session |
| SKq | getModelCallHelpers | chunks.148.mjs:834 | Factory for helpers |
| bKq | isMaxOutputTokens | chunks.148.mjs:871 | Detect truncated response |
| Sp8 | tombstoneMessages | chunks.148.mjs:855 | Create error tool results |
| VKq | executeStopHooks | chunks.148.mjs:621 | Stop hook orchestration |
| pg | microcompact | chunks.133.mjs:991 | Duplicate removal |
| sqq | autoCompact | chunks.147.mjs:2633 | Auto-summarization |
| NT6 | callModel | chunks.170.mjs:2009 | LLM API wrapper |
| Wi6 | toolDispatcher | chunks.146.mjs:285 | Tool routing |
| fxY | executeToolCore | chunks.146.mjs:442 | Core tool execution |
| R36 | ModelFallbackError | chunks.89.mjs:260-269 | Fallback error class |
| _P1 | withApiRetry | chunks.89.mjs:3 | Retry wrapper |
| rmY | MAX_OUTPUT_TOKENS_RECOVERY | chunks.148.mjs:1418 | Constant (3) |
| aqq | MAX_CONSECUTIVE_COMPACT_FAILURES | chunks.147.mjs:2686 | Constant (3) |
