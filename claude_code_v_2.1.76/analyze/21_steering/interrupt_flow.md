# Interrupt Flow - Complete Lifecycle Analysis

## Overview

This document provides a comprehensive analysis of the interrupt flow in Claude Code v2.1.76, covering the complete lifecycle from user action to conversation state update.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)

Key functions in this document:
- `cancelHandlerComponent` (mt8) - UI layer keybinding handler
- `handleCancelPress` (h) - Main cancel logic
- `createInterruptToolResults` (Sp8) - Generate tool_result messages
- `createUserGuidanceMessage` (Ug) - Create interrupt user message
- `hasInterruptibleToolInProgress` - State check for interrupt-on-submit

---

## 1. Interrupt Trigger Types

### 1.1 User-Initiated Interrupts

| Trigger | Keybinding | Action ID | Context | Behavior |
|---------|------------|-----------|---------|----------|
| Escape key | `escape` | `chat:cancel` | Chat | Standard stream interrupt |
| Ctrl+C | `ctrl+c` | `app:interrupt` | Global | Hard interrupt anywhere |
| Ctrl+F double-press | `ctrl+f` | `chat:killAgents` | Chat | Kill background agents |

### 1.2 Programmatic Interrupts

| Trigger | Code Location | Reason | Behavior |
|---------|---------------|--------|----------|
| Interrupt-on-submit | chunks.194.mjs:444 | `"interrupt"` | Silent abort, process queued input |
| Sibling tool error | Tool executor | `"sibling_error"` | Isolated failure, don't propagate |
| Model fallback | chunks.148.mjs:1118 | - | Generate fallback message, switch model |

---

## 2. Complete Interrupt Lifecycle

### 2.1 Phase 1: User Action Detection

```
┌────────────────────────────────────────────────────────────────────┐
│                    PHASE 1: USER ACTION DETECTION                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  USER PRESSES ESCAPE                                               │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Terminal ANSI Event → KeybindingHandler                      │  │
│  │ (chunks.72.mjs, chunks.65.mjs)                               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Resolve keybinding:                                          │  │
│  │   1. Check active contexts (Chat, Global, etc.)              │  │
│  │   2. Find matching action: "chat:cancel"                     │  │
│  │   3. Check isActive condition                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Execute handler: handleCancelPress()                         │  │
│  │ (chunks.193.mjs:2606-2621)                                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Phase 2: Cancel Handler Execution

```javascript
// ============================================
// handleCancelPress - Main cancel logic
// Location: chunks.193.mjs:2606-2621
// ============================================

// ORIGINAL (for source lookup):
let h = Ra6.useCallback(() => {
    let e = { source: "escape", streamMode: X };
    if (w !== void 0 && !w.aborted) {
        d("tengu_cancel", e), q(() => []), K();
        return
    }
    if (d36()) {
        if (O) {
            O();
            return
        }
    }
    d("tengu_cancel", e), q(() => []), K()
}, [P, W, w, O, q, K, X]);

// READABLE (for understanding):
const handleCancelPress = useCallback(() => {
    const telemetryData = { source: "escape", streamMode };

    // BRANCH 1: Stream is active (isStreaming = abortSignal && !aborted)
    if (abortSignal !== undefined && !abortSignal.aborted) {
        telemetry("tengu_cancel", telemetryData);
        setToolUseConfirmQueue(() => []);  // Clear pending tool confirmations
        onCancel();                         // Trigger abortController.abort()
        return;
    }

    // BRANCH 2: Legacy queue has items - pop instead of cancel
    if (isPromptQueueingEnabled()) {  // d36() returns xY.length > 0
        if (popCommandFromQueue) {
            popCommandFromQueue();  // Merge queue into input box
            return;
        }
    }

    // BRANCH 3: Fallback - just clear and cancel
    telemetry("tengu_cancel", telemetryData);
    setToolUseConfirmQueue(() => []);
    onCancel();
}, [dependencies]);

// Mapping: h→handleCancelPress, e→telemetryData, X→streamMode, w→abortSignal,
//   d→telemetry, q→setToolUseConfirmQueue, K→onCancel, d36→isPromptQueueingEnabled,
//   O→popCommandFromQueue
```

**Key Decision Points**:

1. **isStreaming check** (`w !== void 0 && !w.aborted`):
   - If true: The LLM is actively responding, abort immediately
   - If false: Either idle or already aborted

2. **Queue check** (`d36()`):
   - If true and popCommandFromQueue exists: Pop queue into input (user experience: queued command returns to input box)
   - If false: Proceed to cancel anyway

### 2.3 Phase 3: Abort Signal Propagation

```
┌────────────────────────────────────────────────────────────────────┐
│                    PHASE 3: ABORT SIGNAL PROPAGATION                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  onCancel() called                                                  │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ TM() in chunks.196.mjs:420-432                               │  │
│  │                                                              │  │
│  │ switch (inputDialogMode) {                                   │  │
│  │   case "tool-permission":                                    │  │
│  │     a8[0]?.onAbort()  // Abort tool permission dialog        │  │
│  │     break                                                    │  │
│  │   case "prompt":                                             │  │
│  │     for (let p of pendingPrompts) p.reject(Error("cancel")) │  │
│  │     abortController?.abort()                                 │  │
│  │     break                                                    │  │
│  │   default:                                                   │  │
│  │     if (isRemoteMode) remoteSession.cancelRequest()         │  │
│  │     else abortController?.abort()                            │  │
│  │ }                                                            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ abortController.abort()                                      │  │
│  │ - Sets signal.aborted = true                                 │  │
│  │ - Sets signal.reason = undefined (Escape press)              │  │
│  │ - Or sets signal.reason = "interrupt" (interrupt-on-submit)  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 2.4 Phase 4: Query Generator Abort Checkpoint

```javascript
// ============================================
// Abort checkpoint - After streaming completes
// Location: chunks.148.mjs:1152-1161
// ============================================

// ORIGINAL (for source lookup):
if (X.abortController.signal.aborted) {
    if (s) {
        for await (let D6 of s.getRemainingResults())
            if (D6.message) yield D6.message
    } else yield* Sp8(e, "Interrupted by user");
    if (X.abortController.signal.reason !== "interrupt")
        yield Ug({ toolUse: !1 });
    return { reason: "aborted_streaming" }
}

// READABLE (for understanding):
if (toolUseContext.abortController.signal.aborted) {
    // PATH 1: Tool executor exists - graceful drainage
    if (toolExecutor) {
        for await (const result of toolExecutor.getRemainingResults()) {
            if (result.message) yield result.message;
        }
    }
    // PATH 2: No executor - synthetic interrupt messages
    else {
        yield* createInterruptToolResults(assistantMessages, "Interrupted by user");
    }

    // Add user guidance if NOT intentional interrupt-on-submit
    if (toolUseContext.abortController.signal.reason !== "interrupt") {
        yield createUserGuidanceMessage({ toolUse: false });
    }

    return { reason: "aborted_streaming" };
}

// Mapping: X→toolUseContext, s→toolExecutor, e→assistantMessages,
//   Sp8→createInterruptToolResults, Ug→createUserGuidanceMessage, D6→result
```

### 2.5 Phase 5: Interrupt Message Generation

```javascript
// ============================================
// createInterruptToolResults - Generate tool_result for interrupted tools
// Location: chunks.148.mjs:855-869
// ============================================

// ORIGINAL (for source lookup):
function* Sp8(A, q) {
    for (let K of A) {
        let Y = K.message.content.filter((z) => z.type === "tool_use");
        for (let z of Y) yield p1({
            content: [{
                type: "tool_result",
                content: q,
                is_error: !0,
                tool_use_id: z.id
            }],
            toolUseResult: q,
            sourceToolAssistantUUID: K.uuid
        })
    }
}

// READABLE (for understanding):
function* createInterruptToolResults(assistantMessages, interruptMessage) {
    for (const message of assistantMessages) {
        // Extract all tool_use blocks from this message
        const toolUseBlocks = message.message.content.filter(
            block => block.type === "tool_use"
        );

        // Generate a synthetic tool_result for each
        for (const toolUse of toolUseBlocks) {
            yield createUserMessage({
                content: [{
                    type: "tool_result",
                    content: interruptMessage,  // "Interrupted by user"
                    is_error: true,             // Mark as error
                    tool_use_id: toolUse.id     // Link to original tool_use
                }],
                toolUseResult: interruptMessage,
                sourceToolAssistantUUID: message.uuid
            });
        }
    }
}

// Mapping: Sp8→createInterruptToolResults, A→assistantMessages, q→interruptMessage,
//   p1→createUserMessage, K→message, Y→toolUseBlocks, z→toolUse
```

**Why `is_error: true`?**

| Reason | Effect |
|--------|--------|
| Signals failure to Claude | The tool did NOT complete successfully |
| Affects compaction | Error tool results are preserved during auto-compaction |
| Causal chain | Maintains conversation causality for reasoning |

---

## 3. Interrupt-on-Submit Flow

### 3.1 Trigger Condition

When the user submits new input while a tool is running:

```javascript
// ============================================
// Interrupt-on-submit trigger
// Location: chunks.194.mjs:441-444
// ============================================

// ORIGINAL (for source lookup):
if (A.hasInterruptibleToolInProgress) k(`[interrupt] Aborting current turn: streamMode=${A.streamMode}`), d("tengu_cancel", {
    source: "interrupt_on_submit",
    streamMode: A.streamMode
}), A.abortController?.abort("interrupt");

// READABLE (for understanding):
if (state.hasInterruptibleToolInProgress) {
    log(`[interrupt] Aborting current turn: streamMode=${state.streamMode}`);
    telemetry("tengu_cancel", {
        source: "interrupt_on_submit",
        streamMode: state.streamMode
    });
    state.abortController?.abort("interrupt");  // Sets reason = "interrupt"
}

// Mapping: A→state, k→log, d→telemetry
```

### 3.2 Difference from Escape Press

| Aspect | Escape Press | Interrupt-on-Submit |
|--------|--------------|---------------------|
| `signal.reason` | `undefined` | `"interrupt"` |
| User guidance message | **Generated** | **Skipped** |
| Queued command processing | No | Yes (auto-submitted) |
| Telemetry source | `"escape"` | `"interrupt_on_submit"` |

### 3.3 Why Skip User Guidance for Interrupt-on-Submit?

When the user intentionally interrupts by submitting new input:
1. The user already provided new direction
2. Adding guidance message would be redundant
3. Maintains conversation flow without unnecessary messages

---

## 4. Abort Reason Decision Matrix

### 4.1 Complete Decision Table

| `signal.reason` | In Tool Execution? | Drain Tools | Add Guidance | Result |
|-----------------|-------------------|-------------|--------------|--------|
| `"interrupt"` | Yes | Yes | **No** | Silent drain, process queued input |
| `"interrupt"` | No | N/A | **No** | Immediate abort, process queued input |
| `undefined` | Yes | Yes | **Yes** | Drain + "[Request interrupted for tool use]" |
| `undefined` | No | N/A | **Yes** | "[Request interrupted by user]" |
| `"sibling_error"` | Yes | No | No | Isolated failure, don't propagate |

### 4.2 Decision Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                    ABORT REASON DECISION TREE                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  signal.aborted === true?                                          │
│         │                                                          │
│    ┌────┴────┐                                                     │
│    │         │                                                     │
│   NO        YES                                                    │
│    │         │                                                     │
│    ▼         ▼                                                     │
│ Continue   Check reason:                                           │
│ normally   ┌──────────────────────────────────────────────────┐   │
│            │ reason === "interrupt"?                            │   │
│            │         │                                          │   │
│            │    ┌────┴────┐                                     │   │
│            │    │         │                                     │   │
│            │   YES        NO                                    │   │
│            │    │         │                                     │   │
│            │    ▼         ▼                                     │   │
│            │ Skip        Add user                               │   │
│            │ guidance   guidance message                        │   │
│            │ message    (Ug)                                    │   │
│            └──────────────────────────────────────────────────┘   │
│                    │                                              │
│                    ▼                                              │
│            Check toolExecutor:                                     │
│            ┌──────────────────────────────────────────────────┐   │
│            │ toolExecutor exists?                              │   │
│            │         │                                          │   │
│            │    ┌────┴────┐                                     │   │
│            │    │         │                                     │   │
│            │   YES        NO                                    │   │
│            │    │         │                                     │   │
│            │    ▼         ▼                                     │   │
│            │ Drain      Generate                                │   │
│            │ tools      synthetic                               │   │
│            │ (getRemainResults)  interrupt messages (Sp8)       │   │
│            └──────────────────────────────────────────────────┘   │
│                    │                                              │
│                    ▼                                              │
│            return { reason: "aborted_streaming" }                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Conversation State After Interrupt

### 5.1 Message History Transformation

**BEFORE interrupt:**
```
[user]      "Implement login feature"
[assistant] "I'll implement login using JWT authentication...
             First, let me create the auth module..."
             [tool_use: Write, id: "tool_123"]
```

**AFTER interrupt (Sp8 generates):**
```
[user]      "Implement login feature"
[assistant] "I'll implement login using JWT authentication...
             First, let me create the auth module..."
             [tool_use: Write, id: "tool_123"]
[user]      [tool_result: "Interrupted by user", is_error: true,
             tool_use_id: "tool_123"]
```

**AFTER interrupt-on-submit (user typed new direction):**
```
[user]      "Implement login feature"
[assistant] "I'll implement login using JWT authentication..."
[user]      [tool_result: "Interrupted by user", is_error: true]
[user]      "Use OAuth instead"  ← Queued command auto-submitted
[assistant] "I understand. Let me implement OAuth 2.0..."
```

### 5.2 Why the Interrupt Message Matters

Claude's next response sees:
1. Original user request
2. Partial assistant response (with tool_use)
3. Tool result with "Interrupted by user" error
4. Optional: New steering message

This context allows Claude to understand:
- The previous approach was incomplete AND deliberately stopped
- It was not just truncated due to token limits
- The user may have provided new direction

---

## 6. Performance Characteristics

### 6.1 Timing Analysis

| Action | Latency | Why |
|--------|---------|-----|
| Escape press → abort signal | ~0ms | JavaScript synchronous |
| Abort signal → fetch cancellation | ~0ms (local) / RTT (remote) | AbortController / WebSocket |
| LLM stream termination | 0-500ms | Depends on in-flight tokens |
| Tool drainage | 50-500ms | Wait for atomic completion |
| `isLoading=false` | After stream ends | React state update |
| Queued command processed | ~16-32ms | React useEffect scheduling |

### 6.2 Memory Considerations

| Resource | Lifecycle | Notes |
|----------|-----------|-------|
| AbortController | Per-query | Cleaned up after completion |
| lastKillPressTime ref | Persistent | Minimal memory, persists across renders |
| Queued commands (xY) | Session | Cleared after processing |
| Interrupt messages | Conversation | Persist in message history |

---

## 7. Telemetry Events

### 7.1 Cancel Event Structure

```javascript
// Telemetry event name: "tengu_cancel"
// Locations: chunks.193.mjs:2607-2608, 2611, 2634-2635, chunks.194.mjs:442-443

telemetry("tengu_cancel", {
    source: "escape" | "kill_agents" | "interrupt_on_submit",
    streamMode: "requesting" | "thinking" | "responding" | "tool-input" | "tool-use"
});
```

### 7.2 Source Values

| Source | Trigger | Description |
|--------|---------|-------------|
| `"escape"` | User presses Escape | Standard cancel during streaming |
| `"kill_agents"` | User confirms kill agents | Double-press Ctrl+F |
| `"interrupt_on_submit"` | User submits while tool running | Auto-abort with new input |

### 7.3 Stream Mode Insights

The `streamMode` value provides insight into what was happening when cancelled:

| streamMode | User might be thinking |
|------------|----------------------|
| `"requesting"` | Cancelled before response started - user changed mind quickly |
| `"thinking"` | Cancelled during extended thinking - Claude was "stuck" |
| `"responding"` | Cancelled mid-response - Claude was going wrong direction |
| `"tool-input"` | Cancelled while building tool args - too slow or wrong tool |
| `"tool-use"` | Cancelled during tool execution - tool taking too long |

---

## 8. Related Documentation

- [implementation.md](./implementation.md) - Core steering logic
- [algorithms.md](./algorithms.md) - Algorithm deep analysis
- [integration.md](./integration.md) - Cross-module integration
- [constants.md](./constants.md) - All constants

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76