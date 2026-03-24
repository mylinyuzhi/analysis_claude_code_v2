# Steering Algorithms - Deep Analysis

## Module Overview

This document provides detailed algorithmic analysis of the steering mechanism in Claude Code v2.1.76, focusing on key decision points, core algorithms, and implementation trade-offs.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)

Key functions in this document:
- `handleKillAgentsPress` (r) - Double-press Ctrl+F kill agents algorithm
- `handleCancelPress` (h) - Main cancel logic
- `createInterruptToolResults` (Sp8) - Interrupt message generation
- `isPromptQueueingEnabled` (d36) - Queue check function

---

## 1. Double-Press Kill Agents Algorithm

### Problem Statement

When background agents are running, the user needs a way to kill them without accidental triggers. A single Ctrl+F could be unintentional (e.g., browser search), so a confirmation mechanism is required.

### Solution: Double-Press with Timeout

```javascript
// ============================================
// handleKillAgentsPress - Double-press detection algorithm
// Location: chunks.193.mjs:2629-2656
// ============================================

// ORIGINAL (for source lookup):
let r = Ra6.useCallback(() => {
    let e = Date.now();
    if (e - v.current <= Buq) {
        v.current = 0, f("kill-agents-confirm");
        let H6 = P.getState().tasks;
        d("tengu_cancel", {
            source: "kill_agents"
        }), U4q(H6, W), _Y4();
        let J6 = [];
        for (let [K6, s] of Object.entries(H6))
            if (s.type === "local_agent" && s.status === "running") d4q(K6, W), J6.push(s.description);
        if (J6.length > 0) {
            let K6 = J6.length === 1 ? `Background agent "${J6[0]}" was stopped by the user.` : `${J6.length} background agents were stopped by the user: ${J6.map((s)=>`"${s}"`).join(", ")}.`;
            w0({
                value: K6,
                mode: "task-notification"
            })
        }
        Y();
        return
    }
    v.current = e, G({
        key: "kill-agents-confirm",
        text: "Press ctrl+f again to stop background agents",
        priority: "immediate",
        timeoutMs: Buq
    })
}, [P, W, G, f, Y]);

// READABLE (for understanding):
const handleKillAgentsPress = useCallback(() => {
    const now = Date.now();

    // Check if second press within timeout window
    if (now - lastKillPressTime.current <= KILL_AGENTS_CONFIRM_TIMEOUT) {
        // SECOND PRESS - Execute kill
        lastKillPressTime.current = 0;
        removeNotification("kill-agents-confirm");

        const tasks = appStore.getState().tasks;
        telemetry("tengu_cancel", { source: "kill_agents" });

        // Kill all running agents (U4q calls x66 internally for each)
        killAllRunningAgents(tasks, setAppState);
        clearAgentNotifications();

        // Mark killed agents as notified for UI display
        const killedAgents = [];
        for (const [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markAgentNotified(taskId, setAppState);  // d4q - marks for UI notification
                killedAgents.push(task.description);
            }
        }

        // Generate notification message
        if (killedAgents.length > 0) {
            const message = killedAgents.length === 1
                ? `Background agent "${killedAgents[0]}" was stopped by the user.`
                : `${killedAgents.length} background agents were stopped by the user: ${
                    killedAgents.map(a => `"${a}"`).join(", ")
                }.`;
            enqueueCommand({ value: message, mode: "task-notification" });
        }

        onAgentsKilled();
        return;
    }

    // FIRST PRESS - Show confirmation
    lastKillPressTime.current = now;
    addNotification({
        key: "kill-agents-confirm",
        text: "Press ctrl+f again to stop background agents",
        priority: "immediate",
        timeoutMs: KILL_AGENTS_CONFIRM_TIMEOUT  // 3000ms
    });
}, [appStore, setAppState, addNotification, removeNotification, onAgentsKilled]);

// Mapping: r→handleKillAgentsPress, v→lastKillPressTime, Buq→KILL_AGENTS_CONFIRM_TIMEOUT,
//   f→removeNotification, P→appStore, d→telemetry, U4q→killAllRunningAgents, W→setAppState,
//   _Y4→clearAgentNotifications, d4q→markAgentNotified, w0→enqueueCommand, G→addNotification, Y→onAgentsKilled
// NOTE: d4q was incorrectly mapped as killLocalAgent. It is actually markAgentNotified.
// The actual kill is performed by x66 (killLocalAgentInternal) which is called by U4q.
```

### Key Design Decisions

**Timeout = 3000ms**:
- **Too short (< 1s)**: User might not have time for second press
- **Too long (> 5s)**: Accidental triggers from unrelated Ctrl+F presses
- **3000ms**: Industry standard for double-click/double-press actions

**Priority = "immediate"**:
- Ensures the notification appears instantly
- Overrides other notifications that might be showing
- Auto-dismisses after timeout (if no second press)

**Why double-press?**:
- Single-press could accidentally kill agents during normal Ctrl+F usage
- User confirmation prevents data loss from unintended kills
- Pattern matches familiar "double-click to confirm" UX

### Algorithm Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│              DOUBLE-PRESS KILL AGENTS ALGORITHM                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  USER PRESSES CTRL+F                                               │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────┐                          │
│  │ now - lastKillPressTime <= 3000ms?  │                          │
│  └─────────────────────────────────────┘                          │
│         │                                                          │
│    ┌────┴────┐                                                     │
│    │         │                                                     │
│   YES        NO                                                    │
│    │         │                                                     │
│    ▼         ▼                                                     │
│  SECOND    FIRST PRESS                                             │
│  PRESS     │                                                       │
│    │       └──► lastKillPressTime = now                            │
│    │            addNotification({                                  │
│    │              text: "Press ctrl+f again...",                   │
│    │              timeoutMs: 3000                                  │
│    │            })                                                 │
│    │                                                               │
│    ▼                                                               │
│  Execute Kill:                                                     │
│  1. removeNotification("kill-agents-confirm")                      │
│  2. telemetry("tengu_cancel", {source: "kill_agents"})            │
│  3. killAllRunningAgents(tasks, setAppState)                       │
│     → calls x66 (killLocalAgentInternal) for each running agent    │
│  4. clearAgentNotifications()                                      │
│  5. For each local_agent task with status="running":              │
│     - markAgentNotified(taskId, setAppState)  // d4q              │
│     - Track description for notification                          │
│  6. enqueueCommand({mode: "task-notification", value: message})   │
│  7. onAgentsKilled() callback                                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Correct Kill Flow**:
- `U4q` (killAllRunningAgents) iterates all tasks and calls `x66` (killLocalAgentInternal)
- `x66` performs the actual kill: aborts controller, sets status="killed"
- `d4q` (markAgentNotified) marks agents for UI notification (does NOT kill)
```

---

## 2. Abort Checkpoint Algorithm

### Query Generator Abort Flow

The query generator checks for abort at strategic points during the LLM streaming lifecycle.

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
        yield Ug({
            toolUse: !1
        });
    return {
        reason: "aborted_streaming"
    }
}

// READABLE (for understanding):
if (toolUseContext.abortController.signal.aborted) {
    // BRANCH 1: Tool executor exists - drain gracefully
    if (toolExecutor) {
        for await (const result of toolExecutor.getRemainingResults()) {
            if (result.message) yield result.message;
        }
    }
    // BRANCH 2: No executor - generate synthetic results
    else {
        yield* createInterruptToolResults(assistantMessages, "Interrupted by user");
    }

    // Add user guidance if not intentional interrupt-on-submit
    if (toolUseContext.abortController.signal.reason !== "interrupt") {
        yield createUserGuidanceMessage({ toolUse: false });
    }

    return { reason: "aborted_streaming" };
}

// Mapping: X→toolUseContext, s→toolExecutor, e→assistantMessages,
//   Sp8→createInterruptToolResults, Ug→createUserGuidanceMessage
```

### Why Two Drainage Paths?

| Path | Condition | Behavior | Use Case |
|------|-----------|----------|----------|
| With executor | Tool in progress | Wait for atomic completion | Tool started, needs graceful finish |
| Without executor | No tools started | Generate synthetic messages | Interrupted before tool execution |

**Trade-off**: Drainage adds 50-500ms latency but prevents data corruption from partial writes.

### Abort Reason Handling

The `signal.reason` determines additional behavior:

| Reason | Value | Behavior |
|--------|-------|----------|
| `"interrupt"` | Intentional | Skip user guidance message |
| `undefined` | Escape pressed | Add user guidance message |
| Other | Other abort | Add user guidance message |

**Why skip guidance for `"interrupt"`?**: When user intentionally interrupts-on-submit (typing new input while tool runs), the guidance message is unnecessary since the user already provided new direction.

---

## 3. Interrupt Message Generation Algorithm

### `createInterruptToolResults` Generator

This generator creates synthetic `tool_result` messages for each interrupted tool:

```javascript
// ============================================
// createInterruptToolResults - Generate interrupt messages
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
                    is_error: true,
                    tool_use_id: toolUse.id
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

### Why is_error: true?

The `is_error: true` flag serves multiple purposes:

1. **Signals failure to Claude**: The tool did NOT complete successfully
2. **Affects compaction**: Error tool results are preserved during auto-compaction
3. **Causal chain**: Maintains conversation causality for Claude's reasoning

### Message Structure

```
BEFORE interrupt:
  [assistant] "I'll write the file..." [tool_use: Write, id: "tool_123"]

AFTER interrupt (Sp8 generates):
  [user] [tool_result: "Interrupted by user", is_error: true, tool_use_id: "tool_123"]

Conversation state:
  [assistant] "I'll write the file..." [tool_use: Write, id: "tool_123"]
  [user] [tool_result: "Interrupted by user", is_error: true, tool_use_id: "tool_123"]
```

---

## 4. Cancel Visibility State Machine

### State Computation Algorithm

```javascript
// ============================================
// Cancel visibility computation
// Location: chunks.193.mjs:2621
// ============================================

// ORIGINAL (for source lookup):
R = Qf4(), u = w !== void 0 && !w.aborted, I = Z > 0, g = M !== void 0 && M !== "prompt" && !D, B = !1, p = _ !== "transcript" && !j && !z && !H && !J && !R && V !== "viewing-agent" && !(X16() && $ === "INSERT") && (u || I || B), Q = p && !g, U = B || p;

// READABLE (for understanding):
const isVimInsertMode = isVimMode() && vimMode === "INSERT";
const isStreaming = abortSignal !== undefined && !abortSignal.aborted;
const hasQueuedCommands = queuedCommandsLength > 0;
const isNonPromptModeWithoutInput = inputMode !== undefined && inputMode !== "prompt" && !inputValue;
const hasRunningAgents = false;  // Always false for cancel visibility computation

// isActive: Show keybinding as active?
const isActive =
    screen !== "transcript" &&          // Not in read-only transcript
    !isSearchingHistory &&              // Escape dismisses history search
    !isMessageSelectorVisible &&        // Escape closes message selector
    !isLocalJSXCommand &&               // JSX component may capture Escape
    !isHelpOpen &&                      // Escape closes help overlay
    !isVimInsertMode &&                 // Escape switches Vim mode
    viewSelectionMode !== "viewing-agent" && // Escape exits agent view
    (isStreaming || hasQueuedCommands || hasRunningAgents);

// showCancelText: Show "Esc to cancel" text?
const showCancelText = isActive && !isNonPromptModeWithoutInput;

// isGloballyActive: Show global interrupt (Ctrl+C) as active?
const isGloballyActive = hasRunningAgents || isActive;

// Mapping: R→isVimInsertMode (computed), u→isStreaming, I→hasQueuedCommands,
//   g→isNonPromptModeWithoutInput, B→hasRunningAgents, p→isActive, Q→showCancelText,
//   U→isGloballyActive, Qf4→isVimMode, X16→isVimMode, $→vimMode
```

### Blocking Conditions Matrix

| Condition | Why it blocks cancel | Escape behavior instead |
|-----------|---------------------|------------------------|
| `screen === "transcript"` | Read-only transcript view | Exit transcript |
| `isSearchingHistory` | History search popup open | Dismiss search |
| `isMessageSelectorVisible` | Message selector open | Close selector |
| `isLocalJSXCommand` | JSX component active | Component handles Escape |
| `isHelpOpen` | Help overlay visible | Close help |
| `vimMode === "INSERT"` | Vim insert mode | Switch to NORMAL mode |
| `viewSelectionMode === "viewing-agent"` | Viewing agent output | Exit agent view |

### State Transition Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│              CANCEL VISIBILITY STATE MACHINE                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  IDLE STATE                                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  isLoading: false                                            │  │
│  │  abortSignal: undefined                                      │  │
│  │  showCancelText: false                                       │  │
│  │  isActive: false (or blocked by UI state)                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ onQuery() called                                         │
│         ▼                                                          │
│  STREAMING STATE                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  isLoading: true                                             │  │
│  │  abortSignal: defined, !aborted                              │  │
│  │  showCancelText: true (if isActive && not blocked)           │  │
│  │  streamMode: "requesting" → "thinking" → "responding"        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ User presses Escape                                      │
│         ▼                                                          │
│  ABORTING STATE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  isLoading: true                                             │  │
│  │  abortSignal: defined, aborted                               │  │
│  │  showCancelText: false                                       │  │
│  │  Tool drainage in progress (50-500ms)                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ Drainage complete                                        │
│         ▼                                                          │
│  COMPLETE STATE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  isLoading: false                                            │  │
│  │  abortSignal: undefined                                      │  │
│  │  showCancelText: false                                       │  │
│  │  "Interrupted by user" in conversation                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ User types new message                                   │
│         ▼                                                          │
│  IDLE STATE (cycle repeats)                                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Queue System Integration

### Queue Check Function `d36` (isPromptQueueingEnabled)

```javascript
// ============================================
// isPromptQueueingEnabled - Check if legacy queue has items
// Location: chunks.90.mjs:2812-2814
// ============================================

// ORIGINAL (for source lookup):
function d36() {
    return xY.length > 0
}

// READABLE (for understanding):
function isPromptQueueingEnabled() {
    return legacyQueueArray.length > 0;
}

// Mapping: d36→isPromptQueueingEnabled, xY→legacyQueueArray
```

### Integration with Cancel Handler

```javascript
// Location: chunks.193.mjs:2614-2618

if (d36()) {  // isPromptQueueingEnabled() - checks xY.length > 0
    if (O) {   // if popCommandFromQueue exists
        O();   // popCommandFromQueue() - merge queue into input box
        return
    }
}
```

**Behavior**: When the legacy queue has items, pressing Escape while NOT streaming will pop the queued command back into the input box instead of triggering a cancel.

---

## 6. Telemetry Events

### Cancel Telemetry Structure

```javascript
// Location: chunks.193.mjs:2607-2608, 2611, 2634-2635

telemetry("tengu_cancel", {
    source: "escape" | "kill_agents" | "interrupt_on_submit",
    streamMode: "requesting" | "thinking" | "responding" | "tool-input" | "tool-use"
});
```

### Event Sources

| Source | Trigger | Description |
|--------|---------|-------------|
| `"escape"` | User presses Escape | Standard cancel during streaming |
| `"kill_agents"` | User confirms kill agents | Double-press Ctrl+F |
| `"interrupt_on_submit"` | User submits while tool running | Auto-abort with new input |

### Stream Mode at Cancel

The `streamMode` value provides insight into what was happening when the user cancelled:

| streamMode | User might be thinking |
|------------|----------------------|
| `"requesting"` | Cancelled before response started |
| `"thinking"` | Cancelled during extended thinking |
| `"responding"` | Cancelled mid-response |
| `"tool-input"` | Cancelled while Claude was building tool args |
| `"tool-use"` | Cancelled during tool execution |

---

## 7. Performance Characteristics

### Timing Guarantees

| Action | Latency | Why |
|--------|---------|-----|
| Escape press → abort signal | ~0ms | JavaScript synchronous |
| Abort signal → fetch cancellation | ~0ms (local) / RTT (remote) | AbortController / WebSocket |
| LLM stream termination | 0-500ms | Depends on in-flight tokens and tool drainage |
| `isLoading=false` | After stream ends | React state update |
| Queued command processed | ~16-32ms | React useEffect scheduling |

### Memory Considerations

- **AbortController**: One per query, cleaned up after completion
- **lastKillPressTime ref**: Persists across renders, minimal memory
- **Queued commands**: Stored in React state, cleared after processing

---

## 8. Interrupt Reason Decision Algorithm

### Problem Statement

When the user interrupts the LLM, the system needs to determine:
1. Whether to add a guidance message to the conversation
2. Whether to silently cancel or generate error messages
3. How to handle tool interruption

### Solution: Reason-Based Decision Tree

The `signal.reason` property encodes the intent of the abort:

```javascript
// ============================================
// Interrupt Reason Decision Algorithm
// Location: chunks.148.mjs:110-114, 1156-1157, 1316-1317
// ============================================

// Pseudocode for the decision tree:
function handleAbort(signal, toolExecutor, assistantMessages) {
    if (!signal.aborted) return null;

    // DECISION 1: Check abort reason
    if (signal.reason === "interrupt") {
        // Intentional interrupt-on-submit
        // User already provided new direction via queued message
        // Skip user guidance message

        if (toolExecutor) {
            // Drain tools silently
            return drainToolsSilently(toolExecutor);
        }
        return { reason: "aborted_streaming", skipGuidance: true };
    }

    if (signal.reason === "sibling_error") {
        // Isolated tool failure, don't propagate
        return { reason: "sibling_error", propagate: false };
    }

    // DECISION 2: Default abort (Escape pressed or other reason)
    // Add user guidance message

    if (toolExecutor) {
        // Drain tools and generate synthetic results
        drainToolsWithMessages(toolExecutor);
    } else {
        // Generate synthetic interrupt messages for pending tools
        yield* createInterruptToolResults(assistantMessages, "Interrupted by user");
    }

    // DECISION 3: Add guidance message based on context
    const toolUse = isInToolExecutionPhase();
    yield createUserGuidanceMessage({ toolUse });

    return { reason: "aborted_streaming", skipGuidance: false };
}
```

### Decision Matrix

| signal.reason | In Tool Execution? | Drain Tools | Add Guidance | Behavior |
|---------------|-------------------|-------------|--------------|----------|
| `"interrupt"` | Yes | Yes | **No** | Silent drain, process queued input |
| `"interrupt"` | No | N/A | **No** | Immediate abort, process queued input |
| `undefined` | Yes | Yes | **Yes** | Drain + "[Request interrupted for tool use]" |
| `undefined` | No | N/A | **Yes** | "[Request interrupted by user]" |
| `"sibling_error"` | Yes | No | No | Isolated failure, don't propagate |

### Why This Design?

**Trade-offs**:
- **Explicit over implicit**: The `"interrupt"` reason explicitly signals intent
- **User experience priority**: Avoid redundant messages when user provides new input
- **Conversation continuity**: Silent interrupts maintain flow when user is steering

### How Abort Reason is Set

The abort reason is set when calling `abortController.abort(reason)`:

```javascript
// ============================================
// Setting abort reason on interrupt-on-submit
// Location: chunks.194.mjs:452
// ============================================

// ORIGINAL (for source lookup):
state.abortController?.abort("interrupt");

// READABLE (for understanding):
if (hasInterruptibleToolInProgress) {
    state.abortController?.abort("interrupt");  // Sets signal.reason = "interrupt"
}

// Mapping: This is called when user submits new input while tool is running
```

**Key insight**: The `"interrupt"` reason is only set when:
1. `hasInterruptibleToolInProgress` is true
2. User submits new input during tool execution
3. The abort is intentional (user wants to steer, not just cancel)

---

## 9. Tool Drainage Strategy Algorithm

### Problem Statement

When aborting during tool execution, the system must decide:
1. Should in-flight tools complete or be cancelled?
2. How to generate messages for incomplete tools?
3. How to maintain conversation causality?

### Solution: Dual-Path Drainage

```javascript
// ============================================
// Tool Drainage Strategy
// Location: chunks.148.mjs:1152-1161
// ============================================

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
}
```

### Path Selection Criteria

| Condition | Path | Why |
|-----------|------|-----|
| `toolExecutor` exists | Graceful drainage | Tools have started, wait for atomic completion |
| No `toolExecutor` | Synthetic messages | Tools not yet started, generate error results |

### Drainage Timing Analysis

```
┌────────────────────────────────────────────────────────────────────┐
│              TOOL DRAINAGE TIMING ANALYSIS                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  WITHOUT DRAINAGE (unsafe):                                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  1. User presses Escape                                       │ │
│  │  2. abort() called immediately                               │ │
│  │  3. Query returns (0ms latency)                              │ │
│  │  4. Tool A: Write file → PARTIAL WRITE (corrupted)           │ │
│  │  5. Tool B: Git commit → DIRTY STATE (half-committed)        │ │
│  │  ❌ Data corruption possible                                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  WITH DRAINAGE (safe):                                            │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  1. User presses Escape                                       │ │
│  │  2. abort() called, flag set                                 │ │
│  │  3. getRemainingResults() called                             │ │
│  │  4. Wait for in-flight tools to complete atomically          │ │
│  │     - Tool A: Write file → COMPLETES (50-200ms)              │ │
│  │     - Tool B: Git commit → SKIPPED (not started)             │ │
│  │  5. Query returns (50-500ms latency)                         │ │
│  │  ✓ Clean state, no corruption                                │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Key Insight

The 50-500ms drainage latency is a **deliberate trade-off** for data safety. Without drainage, partial writes could corrupt files or leave git in dirty states.

---

## 10. Kill Agents Double-Press Algorithm (Detailed)

### Complete Algorithm Flow

```javascript
// ============================================
// handleKillAgentsPress - Complete Algorithm
// Location: chunks.193.mjs:2629-2656
// ============================================

function handleKillAgentsPress() {
    const now = Date.now();

    // STEP 1: Check for double-press within timeout
    if (now - lastKillPressTime.current <= KILL_AGENTS_CONFIRM_TIMEOUT) {
        // ===== DOUBLE PRESS CONFIRMED =====

        // STEP 2: Reset timer
        lastKillPressTime.current = 0;

        // STEP 3: Remove confirmation notification
        removeNotification("kill-agents-confirm");

        // STEP 4: Get current task state
        const tasks = appStore.getState().tasks;

        // STEP 5: Record telemetry
        telemetry("tengu_cancel", { source: "kill_agents" });

        // STEP 6: Kill all running local_agent tasks
        killAllRunningAgents(tasks, setAppState);
        // Note: killAllRunningAgents calls x66 (killLocalAgentInternal) for each running agent

        // STEP 7: Clear agent notification queue
        clearAgentNotifications();

        // STEP 8: Mark killed agents as notified for UI
        const killedAgents = [];
        for (const [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markAgentNotified(taskId, setAppState);  // d4q - marks for UI notification
                killedAgents.push(task.description);
            }
        }

        // STEP 9: Generate user-facing notification
        if (killedAgents.length > 0) {
            const message = killedAgents.length === 1
                ? `Background agent "${killedAgents[0]}" was stopped by the user.`
                : `${killedAgents.length} background agents were stopped by the user: ${
                    killedAgents.map(a => `"${a}"`).join(", ")
                }.`;
            enqueueCommand({ value: message, mode: "task-notification" });
        }

        // STEP 10: Callback for UI update
        onAgentsKilled();
        return;
    }

    // ===== FIRST PRESS =====

    // STEP 11: Record timestamp
    lastKillPressTime.current = now;

    // STEP 12: Show confirmation notification
    addNotification({
        key: "kill-agents-confirm",
        text: "Press ctrl+f again to stop background agents",
        priority: "immediate",  // Shows immediately, overrides others
        timeoutMs: KILL_AGENTS_CONFIRM_TIMEOUT  // Auto-dismiss after 3s
    });
}
```

### Timeout Value Analysis

**Why 3000ms?**

| Timeout | Problem |
|---------|---------|
| < 1000ms | User may not have time for second press |
| 1000-2000ms | Still too short for some users |
| **3000ms** | Industry standard for double-click/double-press |
| > 5000ms | Accidental triggers from unrelated Ctrl+F usage |

### Priority System

```javascript
// Notification priority affects display behavior:
priority: "immediate"  // - Shows immediately
                        // - Overrides other notifications
                        // - Auto-dismisses after timeoutMs

// Other priority values:
priority: "normal"      // - Queued behind immediate
priority: "low"         // - Lowest priority queue
```

---

## 11. Cancel Visibility State Machine (Complete)

### Complete State Computation

```javascript
// ============================================
// Cancel Visibility Computation - Complete
// Location: chunks.193.mjs:2621
// ============================================

// Input state variables:
const isVimModeActive = isVimMode();           // X16()
const vimMode = currentVimMode;                // $ ("INSERT", "NORMAL", "VISUAL")
const abortSignal = currentAbortSignal;        // w
const queuedCommandsLength = queueLength;      // Z
const inputMode = currentInputMode;            // M ("prompt", "tool-permission", etc.)
const inputValue = currentInputValue;          // D
const screen = currentScreen;                  // _ ("chat", "transcript", etc.)
const isSearchingHistory = historySearchOpen;  // j
const isMessageSelectorVisible = msgSelector;  // z
const isLocalJSXCommand = jsxCommandActive;    // H
const isHelpOpen = helpOverlayOpen;            // J
const viewSelectionMode = currentViewMode;     // V

// Computed values:
const isVimInsertMode = isVimModeActive && vimMode === "INSERT";
const isStreaming = abortSignal !== undefined && !abortSignal.aborted;
const hasQueuedCommands = queuedCommandsLength > 0;
const isNonPromptModeWithoutInput = inputMode !== undefined && inputMode !== "prompt" && !inputValue;
const hasRunningAgents = false;  // Always false for cancel visibility

// PRIMARY COMPUTATION: Is cancel keybinding active?
const isActive =
    screen !== "transcript" &&          // Not in read-only transcript
    !isSearchingHistory &&              // Escape dismisses history search
    !isMessageSelectorVisible &&        // Escape closes message selector
    !isLocalJSXCommand &&               // JSX component may capture Escape
    !isHelpOpen &&                      // Escape closes help overlay
    !isVimInsertMode &&                 // Escape switches Vim mode
    viewSelectionMode !== "viewing-agent" && // Escape exits agent view
    (isStreaming || hasQueuedCommands || hasRunningAgents);

// SECONDARY COMPUTATION: Show "Esc to cancel" text?
const showCancelText = isActive && !isNonPromptModeWithoutInput;

// TERTIARY COMPUTATION: Show global interrupt (Ctrl+C) as active?
const isGloballyActive = hasRunningAgents || isActive;
```

### Blocking Conditions Detailed

| Condition | Value | Escape Behavior Instead | Code Reference |
|-----------|-------|------------------------|----------------|
| `screen === "transcript"` | `"transcript"` | Exit transcript view | `_ !== "transcript"` |
| `isSearchingHistory` | `true` | Dismiss history search popup | `!j` |
| `isMessageSelectorVisible` | `true` | Close message selector | `!z` |
| `isLocalJSXCommand` | `true` | JSX component handles Escape | `!H` |
| `isHelpOpen` | `true` | Close help overlay | `!J` |
| `vimMode === "INSERT"` | `"INSERT"` | Switch to NORMAL mode | `!(X16() && $ === "INSERT")` |
| `viewSelectionMode === "viewing-agent"` | `"viewing-agent"` | Exit agent view | `V !== "viewing-agent"` |
| `inputMode !== "prompt" && !inputValue` | Non-prompt | Mode-specific handling | `!g` |

### State Transition Timing

| Transition | Trigger | Duration | Result |
|------------|---------|----------|--------|
| Idle → Active | `onQuery()` called | ~0ms | Cancel indicator appears |
| Active → Inactive | `abort()` called | ~0ms | Cancel indicator disappears |
| Active → Blocked | Modal opens | ~16ms | Escape captured by modal |
| Blocked → Active | Modal closes | ~16ms | Cancel indicator reappears |

---

## 12. Interrupt-on-Submit Algorithm

### Problem Statement

When a user submits new input while a tool is still executing, the system needs to:
1. Gracefully abort the current operation
2. Preserve any partial results
3. Immediately process the new user input
4. Avoid adding redundant guidance messages

### Solution: Dual Abort Reason System

```javascript
// ============================================
// Interrupt-on-Submit trigger
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
    state.abortController?.abort("interrupt");  // Sets signal.reason = "interrupt"
}

// Mapping: A→state, k→log, d→telemetry
```

### Why "interrupt" Reason?

The `"interrupt"` reason signals to the query generator that this was an **intentional** abort by the user:

```javascript
// ============================================
// Abort reason handling in query generator
// Location: chunks.148.mjs:1156-1157
// ============================================

// ORIGINAL (for source lookup):
if (X.abortController.signal.reason !== "interrupt")
    yield Ug({ toolUse: !1 });

// READABLE (for understanding):
if (abortController.signal.reason !== "interrupt") {
    yield createUserGuidanceMessage({ toolUse: false });
}
// Skip guidance for intentional interrupt - user already provided new direction
```

### Interrupt-on-Submit Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│              INTERRUPT-ON-SUBMIT ALGORITHM                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  USER TYPES NEW INPUT WHILE TOOL RUNNING                           │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ hasInterruptibleToolInProgress?                              │  │
│  │ (Uq.current from chunks.196.mjs:1023)                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│    ┌────┴────┐                                                     │
│    │         │                                                     │
│   YES        NO                                                    │
│    │         │                                                     │
│    ▼         ▼                                                     │
│  ABORT WITH  Process normally                                     │
│  REASON        (existing input allowed)                           │
│  "interrupt"                                                       │
│    │                                                               │
│    ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ abortController.abort("interrupt")                           │  │
│  │ signal.aborted = true                                        │  │
│  │ signal.reason = "interrupt"                                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Enqueue new input:                                           │  │
│  │ _0({ value: input, mode, pastedContents, ... })              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Query generator checkpoint (chunks.148.mjs:1152):            │  │
│  │                                                              │  │
│  │ if (signal.reason !== "interrupt") {                         │  │
│  │     yield createUserGuidanceMessage();  // SKIPPED!          │  │
│  │ }                                                            │  │
│  │                                                              │  │
│  │ // Tool drainage happens, but no guidance message            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  Queued command auto-submitted on next turn                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Key Design Insight

**Why skip the guidance message?**

| Scenario | Behavior | Reason |
|----------|----------|--------|
| Escape press | Add guidance "[Request interrupted...]" | User just cancelled, may want to steer |
| Interrupt-on-submit | Skip guidance | User already provided new direction |

The guidance message is redundant when the user has already typed a new message. Adding it would create noise in the conversation.

---

## 12. Abort Checkpoint Analysis (Detailed)

### 12.1 Checkpoint Locations in Query Generator

The query generator (`omY` function in chunks.148.mjs) checks for abort at multiple strategic points:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    QUERY GENERATOR ABORT CHECKPOINTS                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CHECKPOINT 1: Before API Call                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Location: chunks.148.mjs (entry to query generator)                   │  │
│  │ Condition: signal.aborted before streaming starts                     │  │
│  │ Action: Return immediately, no API call made                          │  │
│  │ Use Case: User cancelled during input processing                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  CHECKPOINT 2: During LLM Streaming                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Location: Native fetch API AbortSignal integration                    │  │
│  │ Mechanism: signal passed to fetch() call                              │  │
│  │ Action: API request cancelled, stream terminated                      │  │
│  │ Response Time: 0-500ms depending on in-flight tokens                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  CHECKPOINT 3: After Stream Completion                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Location: chunks.148.mjs:1152-1161                                    │  │
│  │ Condition: if (toolUseContext.abortController.signal.aborted)         │  │
│  │ Action: Drain tools OR generate synthetic interrupt messages          │  │
│  │ Branch: Based on signal.reason ("interrupt" vs undefined)             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  CHECKPOINT 4: During Tool Execution                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Location: Tool executor (getRemainingResults)                         │  │
│  │ Mechanism: Tool-specific abort handling                               │  │
│  │ Action: Complete current atomic operation, return result              │  │
│  │ Duration: 50-500ms for graceful completion                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Checkpoint 3: Detailed Code Analysis

The main abort checkpoint (Checkpoint 3) has multiple decision branches:

```javascript
// ============================================
// Checkpoint 3 - Complete abort handling logic
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
    // ===== DECISION 1: Tool Drainage Strategy =====
    if (toolExecutor) {
        // PATH A: Tool executor exists - drain gracefully
        // Wait for in-flight tools to complete their atomic operations
        for await (const result of toolExecutor.getRemainingResults()) {
            if (result.message) {
                yield result.message;  // Yield actual tool results
            }
        }
        // Benefits:
        // - File writes complete atomically (no partial writes)
        // - Git commits finish cleanly
        // - No data corruption
        // Trade-off: Adds 50-500ms to abort latency
    } else {
        // PATH B: No tool executor - generate synthetic results
        // Create tool_result messages for pending tool_use blocks
        yield* createInterruptToolResults(
            assistantMessages,
            "Interrupted by user"
        );
        // Result: Each tool_use gets a matching tool_result with is_error: true
    }

    // ===== DECISION 2: User Guidance Message =====
    if (toolUseContext.abortController.signal.reason !== "interrupt") {
        // PATH A: User pressed Escape - add guidance message
        yield createUserGuidanceMessage({ toolUse: false });
        // Adds: "[Request interrupted by user]" to conversation
    }
    // PATH B: reason === "interrupt" - skip guidance
    // User already provided new input, guidance would be redundant

    return { reason: "aborted_streaming" };
}

// Mapping: X→toolUseContext, s→toolExecutor, D6→result,
//   Sp8→createInterruptToolResults, e→assistantMessages,
//   Ug→createUserGuidanceMessage
```

### 12.3 Abort Reason Decision Matrix

| `signal.reason` | Drainage Path | Guidance Message | Result |
|-----------------|---------------|------------------|--------|
| `"interrupt"` | Graceful drain | **Skip** | Silent abort, queued input processed |
| `undefined` | Graceful drain | **Add** | "[Request interrupted by user]" added |
| `"sibling_error"` | No drainage | Skip | Isolated failure, don't propagate |

### 12.4 Tool Drainage Behavior by Tool Type

| Tool | Drainage Behavior | Why |
|------|-------------------|-----|
| `Write` | Completes file write | Prevents partial/corrupted files |
| `Edit` | Completes edit operation | Ensures file consistency |
| `Bash` | Waits for command exit | Prevents zombie processes |
| `Read` | Returns partial content | Already-safe read operation |
| `Grep` | Returns matches found so far | Partial results acceptable |
| `Glob` | Returns files found so far | Partial results acceptable |

### 12.5 Interrupt-on-Submit Checkpoint Flow

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

**Key difference from Escape press**:
- `abort("interrupt")` sets `signal.reason = "interrupt"`
- Query generator checks `signal.reason !== "interrupt"` before adding guidance
- Result: Silent abort with queued input immediately processed

---

## 13. Complete Symbol Cross-Reference

### Verified Steering Symbols (2026-03-24)

All symbols have been cross-validated against source code:

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| mt8 | cancelHandlerComponent | chunks.193.mjs:2586 | ✅ Source match |
| h | handleCancelPress | chunks.193.mjs:2605 | ✅ Source match |
| r | handleKillAgentsPress | chunks.193.mjs:2629 | ✅ Source match |
| Buq | KILL_AGENTS_CONFIRM_TIMEOUT | chunks.193.mjs:2665 | ✅ Value: 3000 |
| D66 | INTERRUPTED_BY_USER_TEXT | chunks.174.mjs:984 | ✅ Source match |
| P0 | INTERRUPTED_FOR_TOOL_USE | chunks.174.mjs:986 | ✅ Source match |
| Sp8 | createInterruptToolResults | chunks.148.mjs:855 | ✅ Generator function |
| Ug | createUserGuidanceMessage | chunks.173.mjs:1425 | ✅ Source match |
| D8 | useKeybindingAction | chunks.65.mjs:905 | ✅ Source match |
| X16 | isVimMode | chunks.153.mjs:995 | ✅ Source match |
| Qf4 | hasActiveOverlays | chunks.115.mjs:2225 | ✅ Source match |
| d36 | isPromptQueueingEnabled | chunks.90.mjs:2812 | ✅ Source match |
| U4q | killAllRunningAgents | chunks.146.mjs:2029 | ✅ Source match |
| x66 | killLocalAgentInternal | chunks.146.mjs:2012 | ✅ Source match |
| d4q | markAgentNotified | chunks.146.mjs:2034 | ✅ Source match |
| _Y4 | clearAgentNotifications | chunks.90.mjs:2885 | ✅ Source match |
| w0 | enqueueTaskNotification | chunks.90.mjs:2823 | ✅ Source match |
| hTq | INTERRUPT_MESSAGE_PATTERN | chunks.175.mjs:139 | ✅ Source match |
| TF6 | INTERRUPT_MESSAGES_SET | chunks.174.mjs:1099 | ✅ Source match |
| TM | onCancel | chunks.196.mjs:420 | ✅ Source match |
| d7 | streamMode | chunks.196.mjs:96 | ✅ Source match |
| M5 | abortController | chunks.196.mjs | ✅ Source match |
| x5 | setAbortController | chunks.196.mjs | ✅ Source match |

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76