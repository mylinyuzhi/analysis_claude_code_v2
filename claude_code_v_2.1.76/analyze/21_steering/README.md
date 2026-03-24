# Steering Module Analysis

## Overview

The **steering mechanism** in Claude Code v2.1.76 enables users to provide real-time course corrections to the AI agent while it is actively working on a task. This prevents the agent from pursuing incorrect approaches for extended periods and allows for dynamic, interactive guidance during complex multi-turn operations.

**Key Capability**: Users can interrupt the LLM mid-stream by pressing Escape or Ctrl+C, and optionally queue a new message that gets auto-submitted once the interrupt completes.

## Analysis Documents

| Document | Description |
|----------|-------------|
| [implementation.md](./implementation.md) | Core steering logic, cancel handler component, interrupt message generation, queue processor, abort checkpoint analysis |
| [integration.md](./integration.md) | Cross-module integration with keybindings, agent loop, tools, background agents, state management, remote sessions, compact, hooks, and system reminders |
| [ui_interaction.md](./ui_interaction.md) | UI layer analysis including cancel indicator, keybinding context system, spinner integration, vim mode, and state transitions |
| [algorithms.md](./algorithms.md) | Deep algorithmic analysis of double-press kill, abort checkpoints, interrupt message generation, and cancel visibility state machine |
| [constants.md](./constants.md) | All interrupt message constants, timeout values, stream modes, regex patterns, and keybinding identifiers |
| [interrupt_flow.md](./interrupt_flow.md) | Complete interrupt lifecycle from user action to conversation state update |
| [queue_system.md](./queue_system.md) | Legacy queue system detailed analysis with all queue operations |
| [streammode_state_machine.md](./streammode_state_machine.md) | **NEW** StreamMode state machine with all 5 states, transitions, and spinner animations |

## Quick Reference

### Key Functions

| Function | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| `cancelHandlerComponent` | `mt8` | chunks.193.mjs:2586-2661 | React component registering keybindings |
| `handleCancelPress` | `h` | chunks.193.mjs:2606-2621 | Main cancel logic |
| `handleKillAgentsPress` | `r` | chunks.193.mjs:2629-2656 | Double-press Ctrl+F handler |
| `createInterruptToolResults` | `Sp8` | chunks.148.mjs:855-869 | Generate tool_result messages |
| `createUserGuidanceMessage` | `Ug` | chunks.173.mjs:1425-1434 | Create interrupt user message |
| `useKeybindingAction` | `D8` | chunks.65.mjs:905-943 | Keybinding registration hook |
| `isVimMode` | `X16` | chunks.153.mjs:995-997 | Check if vim mode active |
| `hasActiveOverlays` | `Qf4` | chunks.115.mjs:2225-2231 | Check for blocking overlays |
| `isPromptQueueingEnabled` | `d36` | chunks.90.mjs:2812-2814 | Check legacy queue |
| `killAllRunningAgents` | `U4q` | chunks.146.mjs:2029-2032 | Kill all running agents |
| `killLocalAgentInternal` | `x66` | chunks.146.mjs:2012-2027 | Actual kill implementation |
| `markAgentNotified` | `d4q` | chunks.146.mjs:2034-2043 | Mark agent as notified (NOT kill) |

### Key Constants

| Constant | Symbol | Location | Value |
|----------|--------|----------|-------|
| `KILL_AGENTS_CONFIRM_TIMEOUT` | `Buq` | chunks.193.mjs:2665 | 3000ms |
| `INTERRUPTED_BY_USER_TEXT` | `D66` | chunks.174.mjs:984 | `"[Request interrupted by user]"` |
| `INTERRUPTED_FOR_TOOL_USE` | `P0` | chunks.174.mjs:986 | `"[Request interrupted by user for tool use]"` |

### Keybindings

| Keybinding | Default Key | Context | Purpose |
|------------|-------------|---------|---------|
| `chat:cancel` | Escape | Chat | Interrupt current stream |
| `app:interrupt` | Ctrl+C | Global | Hard interrupt anywhere |
| `chat:killAgents` | Ctrl+F | Chat | Kill background agents (double-press) |

### Stream Modes

| Mode | Spinner Text | Meaning |
|------|--------------|---------|
| `requesting` | "Waiting for Claude..." | Waiting for first token |
| `thinking` | "Thinking..." | Extended thinking active |
| `responding` | "Claude is responding..." | Text streaming |
| `tool-input` | "Generating tool args..." | Building tool arguments |
| `tool-use` | "Running [tool]..." | Tool executing |

## Key Corrections (2026-03-24)

### `d36` (isPromptQueueingEnabled)

**Previous incorrect analysis**: Function always returns `false`

**Actual implementation** (chunks.90.mjs:2812-2814):
```javascript
function d36() {
    return xY.length > 0  // Returns true when legacy queue has items
}
```

The queue pop branch in `handleCancelPress` IS reachable when queued commands exist.

### `Qf4` (hasActiveOverlays)

**Previous incorrect mapping**: `Qf4` → `isVimMode`

**Actual implementation** (chunks.115.mjs:2225-2231):
```javascript
function Qf4() {
    return M1(H8Y)  // Uses store selector
}
function H8Y(A) {
    return A.activeOverlays.size > 0  // Checks for overlay modals
}
```

`Qf4` is `hasActiveOverlays`, which blocks cancel when overlay modals are visible.

### `_Y4` (clearAgentNotifications)

**Verified location**: chunks.90.mjs:2885-2888 (not chunks.193.mjs)

### `d4q` (markAgentNotified)

**Previous incorrect mapping**: `d4q` → `killLocalAgent`

**Actual implementation** (chunks.146.mjs:2034-2043):
```javascript
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,  // Only marks as notified for UI
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}
```

`d4q` is `markAgentNotified` - it does NOT kill agents. The actual kill is performed by `x66` (killLocalAgentInternal).

**Kill Flow**: `U4q` (killAllRunningAgents) → `x66` (killLocalAgentInternal) → aborts controller, sets status="killed"
**After Kill**: `d4q` (markAgentNotified) → marks agent as notified=true for UI notification

## Symbol Validation Summary (2026-03-24)

All steering symbols have been cross-validated against source code:

### Core Steering Logic (chunks.193.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| mt8 | cancelHandlerComponent | 2586 | ✅ Verified |
| h | handleCancelPress | 2606 | ✅ Verified |
| r | handleKillAgentsPress | 2629 | ✅ Verified |
| Buq | KILL_AGENTS_CONFIRM_TIMEOUT | 2665 | ✅ Verified (3000ms) |

### Interrupt Message Constants (chunks.174.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| D66 | INTERRUPTED_BY_USER_TEXT | 984 | ✅ Verified |
| P0 | INTERRUPTED_FOR_TOOL_USE | 986 | ✅ Verified |
| R96 | REJECTION_MESSAGE | 988 | ✅ Verified |
| h96 | TOOL_REJECTION_MESSAGE | 990 | ✅ Verified |
| mQ6 | REJECTION_MESSAGE_WITH_USER_INPUT | 992 | ✅ Verified |
| Eb | PERMISSION_DENIED_MESSAGE | 995 | ✅ Verified |
| rc6 | PERMISSION_DENIED_WITH_INPUT | 997 | ✅ Verified |
| N36 | NO_RESPONSE_REQUESTED | 1007 | ✅ Verified |
| TF6 | INTERRUPT_MESSAGES_SET | 1099 | ✅ Verified (Set of D66, P0, R96, h96, N36) |

### Message Generation (chunks.148.mjs, chunks.173.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| Sp8 | createInterruptToolResults | 855 | ✅ Verified (generator function) |
| Ug | createUserGuidanceMessage | 1425 | ✅ Verified |

### Detection & UI (chunks.175.mjs, chunks.115.mjs, chunks.153.mjs, chunks.65.mjs, chunks.196.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| hTq | INTERRUPT_MESSAGE_PATTERN | 139 | ✅ Verified (RegExp) |
| X16 | isVimMode | 995 | ✅ Verified |
| Qf4 | hasActiveOverlays | 2225 | ✅ Verified |
| D8 | useKeybindingAction | 905 | ✅ Verified |
| QV6 | showSpinner | 305 | ✅ Verified (computed visibility) |

### Background Agent Kill (chunks.146.mjs, chunks.90.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| U4q | killAllRunningAgents | 2029 | ✅ Verified |
| d4q | markAgentNotified | 2034 | ✅ Verified (fixed - was killLocalAgent) |
| x66 | killLocalAgentInternal | 2012 | ✅ Verified |
| _Y4 | clearAgentNotifications | 2885 | ✅ Verified |
| d36 | isPromptQueueingEnabled | 2812 | ✅ Verified |

### Hooks & Utilities (chunks.90.mjs, chunks.193.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| w0 | enqueueTaskNotification | 2823 | ✅ Verified |
| _0 | enqueueToLegacyQueue | 2816-2821 | ✅ Verified |
| qY4 | getLegacyQueueLength | 2808-2810 | ✅ Verified |
| o4 | useNotifications | - | ✅ Verified (hook) |

### Queue System (chunks.90.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| xY | legacyQueueArray | 2970 | ✅ Verified (main queue storage) |
| e94 | frozenQueueSnapshot | 2970 | ✅ Verified (immutable copy) |
| VV8 | queueSubscribers | 2970 | ✅ Verified (Set of listeners) |
| RW6 | PRIORITY_VALUES | 2971-2975 | ✅ Verified ({now:0, next:1, later:2}) |
| Qt | notifySubscribers | 2789-2792 | ✅ Verified |
| hW6 | subscribeToQueueChanges | 2794-2798 | ✅ Verified |
| lP1 | dequeueHighestPriority | 2830-2840 | ✅ Verified |
| KY4 | peekHighestPriority | 2842-2851 | ✅ Verified |
| nP1 | popAndMergeQueuedCommands | 2922-2950 | ✅ Verified |

### Stream Mode State (chunks.196.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| d7 | streamMode | 96 | ✅ Verified (state variable) |
| W4 | setStreamMode | 96 | ✅ Verified (state setter) |
| Dz | streamModeRef | 97 | ✅ Verified (ref for callbacks) |
| M5 | abortController | inferred | ✅ Verified |
| x5 | setAbortController | inferred | ✅ Verified |
| TM | onCancel | 420 | ✅ Verified |

### UI Message Filtering (chunks.173.mjs)

| Symbol | Readable | Line | Status |
|--------|----------|------|--------|
| Hz6 | isHiddenSpecialMessage | 1275 | ✅ Verified (uses TF6 Set) |
| p1 | createUserMessage | 1378 | ✅ Verified |

---

## System Reminder Integration

The `hTq` (INTERRUPT_MESSAGE_PATTERN) regex in chunks.175.mjs:139 detects interrupt messages in the conversation stream:

```javascript
// ============================================
// INTERRUPT_MESSAGE_PATTERN - Detects interrupt-related messages
// Location: chunks.175.mjs:139
// ============================================

// ORIGINAL (for source lookup):
hTq = new RegExp(`^(?:<local-command-stdout>|<session-start-hook>|<${vV}>|\\[Request interrupted by user[^\\]]*\\]|\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$)`);

// READABLE (for understanding):
const INTERRUPT_MESSAGE_PATTERN = new RegExp(
    `^(?:` +
    `<local-command-stdout>|` +                    // Local command output
    `<session-start-hook>|` +                      // Session start hook
    `<${IDE_OPENED_FILE_TAG}>|` +                  // IDE opened file tag
    `\\[Request interrupted by user[^\\]]*\\]|` +  // Any interrupt message
    `\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|` +
    `\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$` +
    `)`
);

// Mapping: hTq→INTERRUPT_MESSAGE_PATTERN, vV→IDE_OPENED_FILE_TAG
```

### TF6 Set - Interrupt Message Detection Set

The `TF6` constant in chunks.174.mjs:1099 is a Set containing interrupt message strings used for fast lookup:

```javascript
// ============================================
// TF6 - Set of interrupt message strings
// Location: chunks.174.mjs:1099
// ============================================

// ORIGINAL (for source lookup):
TF6 = new Set([D66, P0, R96, h96, N36]);

// READABLE (for understanding):
const INTERRUPT_MESSAGES_SET = new Set([
    INTERRUPTED_BY_USER_TEXT,      // D66 - "[Request interrupted by user]"
    INTERRUPTED_FOR_TOOL_USE,      // P0  - "[Request interrupted by user for tool use]"
    REJECTION_MESSAGE,             // R96 - "The user doesn't want to take this action..."
    TOOL_REJECTION_MESSAGE,        // h96 - "The user doesn't want to proceed..."
    NO_RESPONSE_REQUESTED          // N36 - "No response requested."
]);

// Mapping: TF6→INTERRUPT_MESSAGES_SET, D66→INTERRUPTED_BY_USER_TEXT, P0→INTERRUPTED_FOR_TOOL_USE
```

**This pattern is used by system_reminder (04_system_reminder) to:**
1. Detect interrupt messages in conversation normalization
2. Handle isMeta filtering for interrupt-related content
3. Integrate with compaction to preserve interrupt context
4. Fast O(1) lookup via TF6 Set for known interrupt strings

### Hz6 (isHiddenSpecialMessage) - UI Filtering

The `Hz6` function uses the TF6 Set to determine if a message should be hidden from the chat UI:

```javascript
// ============================================
// Hz6 - isHiddenSpecialMessage function
// Location: chunks.173.mjs:1275-1277
// ============================================

// ORIGINAL (for source lookup):
function Hz6(A) {
    return A.type !== "progress" && A.type !== "attachment" && A.type !== "system" &&
           Array.isArray(A.message.content) && A.message.content[0]?.type === "text" &&
           TF6.has(A.message.content[0].text)
}

// READABLE (for understanding):
function isHiddenSpecialMessage(message) {
    // Must NOT be progress, attachment, or system type
    if (message.type === "progress" || message.type === "attachment" || message.type === "system") {
        return false;
    }
    // Must have text content
    if (!Array.isArray(message.message.content) || message.message.content[0]?.type !== "text") {
        return false;
    }
    // Check TF6 Set for O(1) lookup
    return TF6.has(message.message.content[0].text);
}

// Mapping: Hz6→isHiddenSpecialMessage, A→message, TF6→INTERRUPT_MESSAGES_SET
```

---

## Abort Reason Flow

When the user interrupts the LLM, the `abort(reason)` can be called with different reasons:

| Reason | Source | Behavior |
|--------|--------|----------|
| `"interrupt"` | chunks.194.mjs:444 | Intentional interrupt-on-submit, skip user guidance |
| `undefined` | Escape press | Standard abort, add user guidance message |
| `"sibling_error"` | Parallel tool error | Isolated failure, don't propagate |

**Code path for `abort("interrupt")` (chunks.194.mjs:444):**
```javascript
// When user submits new input while tool is running:
state.abortController?.abort("interrupt");
```

**Reason handling (chunks.148.mjs:1156-1157):**
```javascript
// Only add user guidance if NOT an intentional interrupt
if (abortController.signal.reason !== "interrupt") {
    yield createUserGuidanceMessage({ toolUse: false });
}
```

---

## UI Design Interaction Summary

### Interaction Model

The steering mechanism uses a **keybinding-based interaction model** where user actions are translated through a context-aware keybinding system:

```
User Action (Key Press)
        │
        ▼
┌───────────────────────────────────────────────┐
│ Keybinding Resolution System                   │
│                                               │
│  1. Check active contexts (Chat/Dialog/Global)│
│  2. Resolve key → action mapping              │
│  3. Check isActive condition                  │
│  4. Execute handler if active                 │
└───────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────┐
│ Handler Execution                              │
│                                               │
│  • handleCancelPress (Escape/Ctrl+C)          │
│  • handleKillAgentsPress (Ctrl+F)             │
└───────────────────────────────────────────────┘
```

### Keybinding Resolution Flow (Source-Level)

```javascript
// ============================================
// Keybinding registration - cancelHandlerComponent
// Location: chunks.193.mjs:2622-2628
// ============================================

// ORIGINAL (for source lookup):
D8("chat:cancel", h, {
    context: "Chat",
    isActive: Q
}), D8("app:interrupt", h, {
    context: "Global",
    isActive: U
});

// READABLE (for understanding):
useKeybindingAction("chat:cancel", handleCancelPress, {
    context: "Chat",
    isActive: showCancelText  // Q - computed condition
});
useKeybindingAction("app:interrupt", handleCancelPress, {
    context: "Global",
    isActive: isGloballyActive  // U - computed condition
});

// Mapping: D8→useKeybindingAction, h→handleCancelPress, Q→showCancelText, U→isGloballyActive
```

### isActive Condition Computation (Source-Level)

```javascript
// ============================================
// isActive conditions computation
// Location: chunks.193.mjs:2621
// ============================================

// ORIGINAL (for source lookup):
let R = Qf4(), u = w !== void 0 && !w.aborted, I = Z > 0, g = M !== void 0 && M !== "prompt" && !D, B = !1, p = _ !== "transcript" && !j && !z && !H && !J && !R && V !== "viewing-agent" && !(X16() && $ === "INSERT") && (u || I || B), Q = p && !g, U = B || p;

// READABLE (for understanding):
const hasActiveOverlays = Qf4();                        // R - check overlay modals
const isStreaming = w !== void 0 && !w.aborted;         // u - abortSignal exists and not aborted
const hasQueuedCommands = Z > 0;                         // I - queuedCommands.length > 0
const hasNoInput = M !== void 0 && M !== "prompt" && !D; // g - non-prompt mode with empty input
const hasRunningBackgroundAgents = false;                // B - placeholder (always false here)

// Main cancel visibility condition:
const showCancelIndicator = screen !== "transcript" &&   // _ - not in transcript view
    !isSearchingHistory &&                                // j - not searching history
    !isMessageSelectorVisible &&                          // z - not selecting message
    !isLocalJSXCommand &&                                 // H - not in JSX component
    !isHelpOpen &&                                        // J - help overlay closed
    !hasActiveOverlays &&                                 // R - no overlay modals
    viewSelectionMode !== "viewing-agent" &&              // V - not viewing agent
    !(X16() && vimMode === "INSERT") &&                   // X16() checks vim, $ is vimMode
    (isStreaming || hasQueuedCommands || hasRunningBackgroundAgents);

const showCancelText = showCancelIndicator && !hasNoInput;  // Q - final text visibility
const isGloballyActive = hasRunningBackgroundAgents || showCancelIndicator;  // U - global interrupt

// Mapping: R→hasActiveOverlays, u→isStreaming, I→hasQueuedCommands, Q→showCancelText, U→isGloballyActive
```

### Blocking Conditions Detailed Analysis

| Condition | Variable | Source Location | Why It Blocks |
|-----------|----------|-----------------|---------------|
| `screen === "transcript"` | `_` | props | Escape exits transcript view |
| `isSearchingHistory` | `j` | state | Escape dismisses history popup |
| `isMessageSelectorVisible` | `z` | state | Escape closes message selector |
| `isLocalJSXCommand` | `H` | state | JSX component handles Escape |
| `isHelpOpen` | `J` | state | Escape closes help overlay |
| `hasActiveOverlays()` | `R` | `Qf4()` | Modal overlays block cancel |
| `viewSelectionMode === "viewing-agent"` | `V` | store | Escape exits agent view |
| `isVimMode() && vimMode === "INSERT"` | `X16() && $` | store | Escape switches to NORMAL |

### Visual Feedback Components

| Component | Trigger | Display |
|-----------|---------|---------|
| Cancel indicator | `isStreaming \|\| hasQueuedCommands \|\| hasRunningAgents` | "Press **Esc** to cancel" |
| Kill agents confirmation | First Ctrl+F press | "Press ctrl+f again to stop background agents" |
| Spinner | `isLoading \|\| userInputOnProcessing \|\| runningTasks` | Mode-dependent text |
| Notification toast | Kill confirmation | Immediate priority, 3s timeout |

### State-Driven UI Updates

The UI reacts to state changes through React's reactive model:

| State Change | UI Effect |
|--------------|-----------|
| `abortSignal.aborted = true` | Cancel indicator hides, spinner stops |
| `streamMode = "tool-use"` | Spinner shows "Running [tool]..." |
| `inputDialogMode = "tool-permission"` | Cancel triggers `onAbort()` |
| Background agent killed | Notification enqueued, agent list updates |

### StreamMode → Spinner Mapping

The `streamMode` state variable drives spinner animation:

| StreamMode | Text | Animation |
|------------|------|-----------|
| `requesting` | "Waiting for Claude..." | Bouncing (50ms) |
| `thinking` | "Thinking..." | Color pulse (200ms) |
| `responding` | "Claude is responding..." | Scrolling (200ms) |
| `tool-input` | "Generating tool args..." | Scrolling (200ms) |
| `tool-use` | "Running [tool]..." | Sine pulse (200ms) |

### Accessibility Considerations

1. **Multiple interrupt methods**: Escape (Chat context), Ctrl+C (Global), Ctrl+F (Kill agents)
2. **Confirmation for destructive actions**: Double-press required for kill agents
3. **Visual and text feedback**: Both spinner animation and text status
4. **Context-aware behavior**: Vim INSERT mode blocks cancel, overlays take precedence

### Keybinding Context System

Keybindings are resolved through a priority-based context stack:

```
Priority Order (highest to lowest):
1. Dialog context (when modal is open)
2. Chat context (when input is focused)
3. Global context (always active)

Context Stack = [...activeContexts, currentContext, "Global"]
```

**isActive conditions for steering keybindings**:

| Keybinding | isActive Condition |
|------------|-------------------|
| `chat:cancel` | NOT (transcript \| historySearch \| msgSelector \| localJSX \| helpOpen \| vimInsert \| viewingAgent) AND (isStreaming \| hasQueue \| hasRunningAgents) |
| `app:interrupt` | hasRunningAgents OR isActive |
| `chat:killAgents` | hasRunningLocalAgents |

---

## UI State Machine - Complete Analysis

### Cancel Indicator Visibility State Machine

The cancel indicator follows a complex state machine with multiple blocking conditions:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CANCEL INDICATOR VISIBILITY STATE MACHINE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        BLOCKING CONDITIONS                            │  │
│  │                                                                       │  │
│  │  screen === "transcript"        → Escape exits transcript view       │  │
│  │  isSearchingHistory === true    → Escape dismisses history popup     │  │
│  │  isMessageSelectorVisible === true → Escape closes message selector  │  │
│  │  isLocalJSXCommand === true     → JSX component handles Escape       │  │
│  │  isHelpOpen === true            → Escape closes help overlay         │  │
│  │  hasActiveOverlays() === true   → Modal overlays block cancel        │  │
│  │  viewSelectionMode === "viewing-agent" → Escape exits agent view     │  │
│  │  isVimMode() && vimMode === "INSERT" → Escape switches to NORMAL     │  │
│  │                                                                       │  │
│  │  If ANY blocking condition is TRUE → Cancel indicator HIDDEN         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        ENABLING CONDITIONS                            │  │
│  │                                                                       │  │
│  │  isStreaming === true           → abortSignal exists && !aborted     │  │
│  │  hasQueuedCommands === true     → queuedCommandsLength > 0           │  │
│  │  hasRunningBackgroundAgents === true → Running agents in task store  │  │
│  │                                                                       │  │
│  │  If ANY enabling condition is TRUE (and no blocking) → SHOW indicator│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     TEXT VISIBILITY LOGIC                             │  │
│  │                                                                       │  │
│  │  showCancelIndicator = !blockingConditions && enablingConditions     │  │
│  │  showCancelText = showCancelIndicator && !hasNoInput                 │  │
│  │  isGloballyActive = hasRunningBackgroundAgents || showCancelIndicator │  │
│  │                                                                       │  │
│  │  hasNoInput = inputMode !== "prompt" && !inputValue                  │  │
│  │  (Non-prompt mode with empty input hides "Esc to cancel" text)       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Kill Agents Confirmation State Machine

The double-press Ctrl+F kill agents feature implements a confirmation state machine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KILL AGENTS CONFIRMATION STATE MACHINE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STATE: IDLE                                                                │
│  lastKillPressTime = 0                                                      │
│         │                                                                   │
│         │ User presses Ctrl+F                                               │
│         │ hasRunningLocalAgents === true                                    │
│         ▼                                                                   │
│  STATE: AWAITING_CONFIRMATION                                               │
│  lastKillPressTime = Date.now()                                             │
│  showNotification("Press ctrl+f again to stop background agents")           │
│  timeout = 3000ms                                                           │
│         │                                                                   │
│         ├── User presses Ctrl+F within 3000ms                               │
│         │   │                                                               │
│         │   ▼                                                               │
│         │   STATE: CONFIRMED                                                │
│         │   removeNotification("kill-agents-confirm")                       │
│         │   killAllRunningAgents()                                          │
│         │   clearAgentNotifications()                                       │
│         │   markAgentNotified() for each killed agent                       │
│         │   enqueueTaskNotification("Background agent X was stopped")       │
│         │   │                                                               │
│         │   └──► Return to IDLE                                             │
│         │                                                                   │
│         └── Timeout expires (3000ms)                                        │
│             │                                                               │
│             ▼                                                               │
│         STATE: TIMEOUT                                                       │
│         notification auto-dismissed                                         │
│         lastKillPressTime still set (next press starts new confirmation)    │
│             │                                                               │
│             └──► Return to IDLE                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source-Level Kill Confirmation Implementation

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
        d("tengu_cancel", { source: "kill_agents" }), U4q(H6, W), _Y4();
        let J6 = [];
        for (let [K6, s] of Object.entries(H6))
            if (s.type === "local_agent" && s.status === "running") d4q(K6, W), J6.push(s.description);
        if (J6.length > 0) {
            let K6 = J6.length === 1 ? `Background agent "${J6[0]}" was stopped by the user.` : `${J6.length} background agents were stopped by the user: ${J6.map((s)=>`"${s}"`).join(", ")}.`;
            w0({ value: K6, mode: "task-notification" })
        }
        Y();
        return
    }
    v.current = e, G({ key: "kill-agents-confirm", text: "Press ctrl+f again to stop background agents", priority: "immediate", timeoutMs: Buq })
}, [P, W, G, f, Y]);

// READABLE (for understanding):
const handleKillAgentsPress = useCallback(() => {
    const now = Date.now();

    // Check for double-press within KILL_AGENTS_CONFIRM_TIMEOUT (3000ms)
    if (now - lastKillPressTime.current <= KILL_AGENTS_CONFIRM_TIMEOUT) {
        // Second press confirmed - kill agents
        lastKillPressTime.current = 0;
        removeNotification("kill-agents-confirm");

        const tasks = appStore.getState().tasks;
        telemetry("tengu_cancel", { source: "kill_agents" });

        // Kill all running local_agent tasks
        killAllRunningAgents(tasks, setAppState);
        clearAgentNotifications();

        // Build notification message for killed agents
        const killedAgents = [];
        for (const [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markAgentNotified(taskId, setAppState);
                killedAgents.push(task.description);
            }
        }

        if (killedAgents.length > 0) {
            const message = killedAgents.length === 1
                ? `Background agent "${killedAgents[0]}" was stopped by the user.`
                : `${killedAgents.length} background agents were stopped by the user: ${killedAgents.map(a => `"${a}"`).join(", ")}.`;
            enqueueTaskNotification({ value: message, mode: "task-notification" });
        }

        onAgentsKilled();
        return;
    }

    // First press - show confirmation notification
    lastKillPressTime.current = now;
    addNotification({
        key: "kill-agents-confirm",
        text: "Press ctrl+f again to stop background agents",
        priority: "immediate",
        timeoutMs: KILL_AGENTS_CONFIRM_TIMEOUT
    });
}, [appStore, setAppState, addNotification, removeNotification, onAgentsKilled]);

// Mapping: r→handleKillAgentsPress, v→lastKillPressTime, Buq→KILL_AGENTS_CONFIRM_TIMEOUT,
//   f→removeNotification, P→appStore, d→telemetry, U4q→killAllRunningAgents,
//   _Y4→clearAgentNotifications, d4q→markAgentNotified, w0→enqueueTaskNotification,
//   W→setAppState, Y→onAgentsKilled, G→addNotification
```

### Spinner State Machine Integration

The spinner visibility is computed from multiple state sources:

```javascript
// ============================================
// showSpinner - Computed visibility for spinner
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
QV6 = (!j8 || j8.showSpinner === !0) && a8.length === 0 && zA.length === 0 && (Bq || YA || oi || qY4() > 0) && !X6 && !C2 && (!aZ || Wz)

// READABLE (for understanding):
const showSpinner =
    (!localJSXCommand || localJSXCommand.showSpinner === true) &&  // Not hidden by JSX command
    toolUseConfirmQueue.length === 0 &&                            // No pending tool confirms
    permissionDialogQueue.length === 0 &&                           // No permission dialogs
    (isLoading || hasResponse || isThinking || queueLength > 0) &&  // Active state
    !hasError &&                                                    // No error state
    !isWaitingForBrowserTool &&                                     // Not waiting for browser
    (!isCompactMode || compactComplete);                            // Compact mode check

// Mapping: QV6→showSpinner, j8→localJSXCommand, a8→toolUseConfirmQueue,
//   zA→permissionDialogQueue, Bq→isLoading, YA→hasResponse, oi→isThinking,
//   qY4→getQueueLength, X6→hasError, C2→isWaitingForBrowserTool,
//   aZ→isCompactMode, Wz→compactComplete
```

---

## Related Modules

- **04_system_reminder** - Interrupt message detection (`hTq` regex), isMeta filtering, compaction integration
- **05_tools** - Tool drainage on abort, `getRemainingResults()`
- **08_subagent** - Subagent abort propagation
- **11_hooks** - Hook termination via `combineAbortSignals`
- **15_state_management** - isLoading, queuedCommands, abortController state
- **26_background_agents** - Kill agents via Ctrl+F (`U4q` → `x66`, `d4q` marks for UI)
- **32_keybindings** - Keybinding context system (`D8`)
- **33_remote_sessions** - WebSocket interrupt control channel

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76