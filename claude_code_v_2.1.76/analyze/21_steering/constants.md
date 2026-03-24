# Steering Module Constants

## Overview

This document catalogs all constants used by the steering module in Claude Code v2.1.76, including interrupt messages, timeout values, and regex patterns.

---

## Interrupt Message Constants

### User Interrupt Messages

| Constant | Symbol | Value | Location | Usage |
|----------|--------|-------|----------|-------|
| INTERRUPTED_BY_USER_TEXT | D66 | `"[Request interrupted by user]"` | chunks.174.mjs:984 | User presses Escape during text response |
| INTERRUPTED_FOR_TOOL_USE | P0 | `"[Request interrupted by user for tool use]"` | chunks.174.mjs:986 | User presses Escape during tool execution |

### Rejection Messages

| Constant | Symbol | Value | Location | Usage |
|----------|--------|-------|----------|-------|
| REJECTION_MESSAGE | R96 | `"The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."` | chunks.174.mjs:988 | User rejected the action via tool permission dialog |
| TOOL_REJECTION_MESSAGE | h96 | `"The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."` | chunks.174.mjs:990 | User rejected a specific tool use |
| REJECTION_MESSAGE_WITH_USER_INPUT | mQ6 | `"The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). To tell you how to proceed, the user said:\n"` | chunks.174.mjs:992 | Rejection with user-provided explanation |
| PERMISSION_DENIED_MESSAGE | Eb | `"Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). Try a different approach or report the limitation to complete your task."` | chunks.174.mjs:995 | Permission denied by policy |
| PERMISSION_DENIED_WITH_INPUT | rc6 | `"Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). The user said:\n"` | chunks.174.mjs:997 | Permission denied with user explanation |
| NO_RESPONSE_REQUESTED | N36 | `"No response requested."` | chunks.174.mjs:1007 | Special message included in TF6 Set |

### Interrupt Messages Set (TF6)

The `TF6` Set provides O(1) lookup for interrupt message strings:

| Constant | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| INTERRUPT_MESSAGES_SET | TF6 | chunks.174.mjs:1099 | Set of special messages hidden from UI |

```javascript
// ============================================
// TF6 - Set of interrupt message strings
// Location: chunks.174.mjs:1099
// ============================================

// ORIGINAL (for source lookup):
TF6 = new Set([D66, P0, R96, h96, N36]);

// READABLE (for understanding):
const INTERRUPT_MESSAGES_SET = new Set([
    INTERRUPTED_BY_USER_TEXT,       // D66 - "[Request interrupted by user]"
    INTERRUPTED_FOR_TOOL_USE,       // P0  - "[Request interrupted by user for tool use]"
    REJECTION_MESSAGE,              // R96 - "The user doesn't want to take this action..."
    TOOL_REJECTION_MESSAGE,         // h96 - "The user doesn't want to proceed..."
    NO_RESPONSE_REQUESTED           // N36 - "No response requested."
]);

// Mapping: TF6→INTERRUPT_MESSAGES_SET, D66→INTERRUPTED_BY_USER_TEXT
```

**Usage**: Messages in this Set are hidden from the chat UI via the `Hz6` (isHiddenSpecialMessage) function.

---

## Timeout Constants

### Kill Agents Confirmation Timeout

| Constant | Symbol | Value | Location | Purpose |
|----------|--------|-------|----------|---------|
| KILL_AGENTS_CONFIRM_TIMEOUT | Buq | `3000` (ms) | chunks.193.mjs:2665 | Double-press timeout for Ctrl+F kill agents confirmation |

**Design Rationale**:
- **Too short (< 1s)**: User may not have time for second press
- **Too long (> 5s)**: Accidental triggers from unrelated Ctrl+F usage
- **3000ms**: Industry standard for double-click/double-press actions

---

## Stream Mode Values

The `streamMode` state can have the following values:

| Value | Meaning | Spinner Text |
|-------|---------|--------------|
| `"requesting"` | Waiting for first token from API | "Waiting for Claude..." |
| `"thinking"` | Extended thinking in progress | "Thinking..." |
| `"responding"` | Text streaming from API | "Claude is responding..." |
| `"tool-input"` | Building tool arguments | "Generating tool arguments..." |
| `"tool-use"` | Tool execution in progress | "Running [tool_name]..." |

---

## Regex Patterns

### Interrupt Message Detection Pattern

| Constant | Symbol | Location |
|----------|--------|----------|
| INTERRUPT_MESSAGE_PATTERN | hTq | chunks.175.mjs:139 |

```javascript
// ============================================
// INTERRUPT_MESSAGE_PATTERN
// Location: chunks.175.mjs:139
// ============================================

// ORIGINAL (for source lookup):
hTq = new RegExp(`^(?:<local-command-stdout>|<session-start-hook>|<${vV}>|\\[Request interrupted by user[^\\]]*\\]|\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$)`);

// READABLE (for understanding):
const INTERRUPT_MESSAGE_PATTERN = new RegExp(
    `^(?:` +
    `<local-command-stdout>|` +                    // Local command output
    `<session-start-hook>|` +                      // Session start hook
    `<ide_opened_file>|` +                         // IDE opened file tag (vV)
    `\\[Request interrupted by user[^\\]]*\\]|` +  // Any interrupt message
    `\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|` +
    `\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$` +
    `)`
);

// Mapping: hTq→INTERRUPT_MESSAGE_PATTERN, vV→IDE_OPENED_FILE_TAG
```

**Matches**:
- `[Request interrupted by user]` (D66)
- `[Request interrupted by user for tool use]` (P0)
- `[Request interrupted by user with custom text]` (any variation)
- `<local-command-stdout>...`
- `<session-start-hook>...`
- `<ide_opened_file>...</ide_opened_file>`
- `<ide_selection>...</ide_selection>`

---

## Abort Signal Reasons

The `abortController.signal.reason` can have these values:

| Reason | Meaning | Effect on Message Generation |
|--------|---------|------------------------------|
| `"interrupt"` | User submitted new input while tool running | Skip user guidance message |
| `"sibling_error"` | Parallel tool execution error | Don't propagate to parent |
| `undefined` | User pressed Escape | Add "[Request interrupted by user]" message |
| Other | Custom programmatic abort | Add user guidance message |

---

## Keybinding Identifiers

| Keybinding | Default Key | Context | Purpose |
|------------|-------------|---------|---------|
| `chat:cancel` | Escape | Chat | Interrupt current stream |
| `app:interrupt` | Ctrl+C | Global | Hard interrupt anywhere |
| `chat:killAgents` | Ctrl+F | Chat | Kill background agents (double-press) |

**Note**: `app:interrupt` is hardcoded and cannot be rebound.

---

## Notification Priority Levels

| Priority | Behavior | Use Case |
|----------|----------|----------|
| `"immediate"` | Shows immediately, overrides others, auto-dismisses | Kill confirmation, critical alerts |
| `"normal"` | Queued normally, standard dismissal | Task completion, info messages |
| `"low"` | Lowest priority, may be delayed | Background info, tips |

---

## Help Tip Identifiers

| Constant | Value | Location |
|----------|-------|----------|
| STEERING_HELP_TIP_ID | `"enter-to-steer-in-relatime"` | chunks.176.mjs:1341 |
| PROMPT_QUEUE_HELP_TIP_ID | `"prompt-queue"` | chunks.176.mjs:1333 |

**Note**: The STEERING_HELP_TIP_ID contains a typo ("relatime" instead of "realtime") in the source code.

---

## Cancel Visibility Conditions

The cancel indicator visibility is determined by these conditions:

### Blocking Conditions

| Condition | Variable | Escape Behavior Instead |
|-----------|----------|------------------------|
| `screen === "transcript"` | `_` | Exit transcript view |
| `isSearchingHistory === true` | `j` | Dismiss history search popup |
| `isMessageSelectorVisible === true` | `z` | Close message selector |
| `isLocalJSXCommand === true` | `H` | JSX component handles Escape |
| `isHelpOpen === true` | `J` | Close help overlay |
| `vimMode === "INSERT"` | `$` | Switch to NORMAL mode |
| `viewSelectionMode === "viewing-agent"` | `V` | Exit agent view |

### Enabling Conditions

| Condition | Variable | Meaning |
|-----------|----------|---------|
| `isStreaming` | `u` | `abortSignal !== undefined && !abortSignal.aborted` |
| `hasQueuedCommands` | `I` | `queuedCommandsLength > 0` |
| `hasRunningAgents` | `B` | Running background agents exist |

---

## Source Code Reference

All constants in this document are verified against source code:

| File | Lines | Content |
|------|-------|---------|
| chunks.174.mjs | 984-997 | Interrupt message constants (D66, P0, R96, h96, mQ6, Eb, rc6) |
| chunks.193.mjs | 2621-2665 | Cancel handler and timeout |
| chunks.175.mjs | 139 | Interrupt detection regex |
| chunks.176.mjs | 1333-1341 | Help tip identifiers |
| chunks.90.mjs | 2812-2888 | Queue functions (d36, _0, _Y4) |
| chunks.146.mjs | 2012-2043 | Agent kill functions (x66, U4q, d4q) |

---

## Queue System Constants

### Legacy Queue Array

| Constant | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| legacyQueueArray | xY | chunks.90.mjs:2970 | Stores queued commands |

### Queue Priority Values

| Priority | Value | Order |
|----------|-------|-------|
| `"next"` | 1 | Process next |
| `"now"` | 0 | Process immediately |
| `"later"` | 2 | Process later |

---

## Agent Kill Constants

### Task Status Values

| Status | Meaning |
|--------|---------|
| `"running"` | Agent is actively executing |
| `"killed"` | Agent was killed by user |
| `"completed"` | Agent finished successfully |
| `"error"` | Agent encountered an error |

### Kill-Related Symbols

| Symbol | Readable | Location | Purpose |
|--------|----------|----------|---------|
| x66 | killLocalAgentInternal | chunks.146.mjs:2012 | Abort agent, set status=killed |
| U4q | killAllRunningAgents | chunks.146.mjs:2029 | Kill all running local_agent tasks |
| d4q | markAgentNotified | chunks.146.mjs:2034 | Mark agent as notified for UI |
| _Y4 | clearAgentNotifications | chunks.90.mjs:2885 | Clear legacy queue array |

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76