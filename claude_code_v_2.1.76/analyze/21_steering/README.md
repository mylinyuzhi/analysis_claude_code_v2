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
| [interrupt_flow.md](./interrupt_flow.md) | **NEW** Complete interrupt lifecycle from user action to conversation state update |
| [queue_system.md](./queue_system.md) | **NEW** Legacy queue system detailed analysis with all queue operations |

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
| w0 | enqueueCommand | 2642 | ✅ Verified |
| _0 | enqueueCommandInternal | 2816-2821 | ✅ Verified |
| o4 | useNotifications | - | ✅ Verified (hook) |

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
    N36                            // Additional rejection message
]);

// Mapping: TF6→INTERRUPT_MESSAGES_SET, D66→INTERRUPTED_BY_USER_TEXT, P0→INTERRUPTED_FOR_TOOL_USE
```

**This pattern is used by system_reminder (04_system_reminder) to:**
1. Detect interrupt messages in conversation normalization
2. Handle isMeta filtering for interrupt-related content
3. Integrate with compaction to preserve interrupt context
4. Fast O(1) lookup via TF6 Set for known interrupt strings

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