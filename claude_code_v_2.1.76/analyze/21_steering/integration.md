# Steering Integration Analysis

## Module Overview

This document analyzes how the steering mechanism integrates with other Claude Code modules, examining cross-module dependencies, data flow patterns, and UI-linkage points.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop integration

Key functions in this document:
- `cancelHandlerComponent` (mt8) - React component registering keybindings
- `handleCancelPress` (h) - Main cancel logic
- `handleKillAgentsPress` (r) - Double-press Ctrl+F handler
- `useKeybindingAction` (D8) - Keybinding registration hook
- `createInterruptToolResults` (Sp8) - Generate tool_result messages
- `killAllRunningAgents` (U4q) - Kill all background agents
- `killLocalAgentInternal` (x66) - Actual kill implementation (abort, set status=killed)
- `markAgentNotified` (d4q) - Mark agent as notified for UI (does NOT kill)

---

## 1. UI Integration - Keybinding System (Module 32)

### 1.1 How Steering Keybindings are Registered

The cancel/interrupt actions are not hardcoded event listeners — they flow through the full keybinding resolution system.

**Default bindings**:
```
Context: Global  →  ctrl+c: "app:interrupt"    (hardcoded, cannot be rebound)
Context: Chat    →  escape: "chat:cancel"      (user-rebindable)
                    ctrl+f: "chat:killAgents"  (user-rebindable)
```

**Registration flow**:
```
cancelHandlerComponent (mt8)
    │
    ├── D8("chat:cancel",   handleCancelPress, { context: "Chat",   isActive: showCancelText })
    │       ↓
    │   KeybindingHandler reads DEFAULT_KEYBINDINGS → escape → "chat:cancel"
    │   When user presses Escape in Chat context → handleCancelPress() fires
    │
    ├── D8("app:interrupt", handleCancelPress, { context: "Global", isActive: isGloballyActive })
    │       ↓
    │   ctrl+c (hardcoded) → "app:interrupt"
    │   When user presses Ctrl+C anywhere → handleCancelPress() fires
    │
    └── D8("chat:killAgents", handleKillAgentsPress, { context: "Chat", isActive: hasRunningLocalAgents })
            ↓
        ctrl+f → "chat:killAgents"
        First press: show notification
        Second press within 3000ms: kill all running background agents
```

**Why `app:interrupt` is hardcoded**: Ctrl+C has a POSIX standard meaning (interrupt process). Allowing it to be rebound could prevent users from exiting the process, creating a "trap" scenario. The system explicitly marks it in `getReservedShortcuts()` with reason: `"Cannot be rebound - used for interrupt/exit (hardcoded)"`.

### 1.2 Cancel Button Visibility State Machine

The cancel button (or "Esc to cancel" indicator) appears based on:

```
cancelHandlerComponent (mt8) evaluates:
┌──────────────────────────────────────────────────────────────┐
│  isActive = NOT (transcript | historySearch | msgSelector |  │
│             localJSX | helpOpen | vimInsert | viewingAgent)  │
│             AND (isStreaming | hasQueue | hasRunningAgents)   │
├──────────────────────────────────────────────────────────────┤
│  showCancelText = isActive                                    │
│    AND NOT (inputMode is non-prompt with no input value)     │
├──────────────────────────────────────────────────────────────┤
│  isGloballyActive = hasRunningAgents OR isActive              │
└──────────────────────────────────────────────────────────────┘
```

**What each condition prevents**:
- `screen !== "transcript"`: Don't show cancel in read-only transcript view
- `!isSearchingHistory`: Escape is used for history dismiss, not cancel
- `!isMessageSelectorVisible`: Escape is used to close selector
- `!isLocalJSXCommand`: Escape may be captured by local JSX component
- `!isHelpOpen`: Help overlay uses Escape to close
- `!isVimInsertMode()`: Escape in Vim INSERT = switch to NORMAL mode, not cancel
- `viewSelectionMode !== "viewing-agent"`: Escape exits agent view

### 1.3 Spinner Integration

The spinner is shown when:

```javascript
// Location: chunks.196.mjs:305

showSpinner = (toolJSX?.showSpinner !== false)
              && toolPermissionDialogs.length === 0
              && (isLoading || userInputOnProcessing || runningTasks || legacyQueueLength > 0)
              && !workerRequestPending
              && !allToolsAreMcpOnly;
```

**streamMode → spinner message mapping**:
| streamMode | Spinner displays |
|------------|-----------------|
| `"requesting"` | "Waiting for Claude..." or initial state |
| `"thinking"` | Extended thinking indicator with thinking text |
| `"responding"` | "Claude is responding..." with token counter |
| `"tool-input"` | Tool name being generated |
| `"tool-use"` | "Running [tool name]..." |

---

## 2. Integration with Agent Loop (Module 03)

### 2.1 Query Generator Interrupt Points

The abort signal is checked at strategic points during the query lifecycle:

```
┌──────────────────────────────────────────────────────────────┐
│              AGENT LOOP WITH STEERING CHECKPOINTS             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐                                        │
│  │ START QUERY     │ ← New AbortController created          │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 1: Before LLM Call   │ ◄─── signal.aborted?   │
│  │ if (signal.aborted) return      │      Early exit before  │
│  └────────┬────────────────────────┘      even hitting API  │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ Stream LLM Response              │ ◄─── AbortSignal in   │
│  │ (signal passed to fetch API)     │      fetch() call     │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 2: After LLM Stream  │ ◄─── signal.aborted?   │
│  │ if (signal.aborted) cleanup()   │      Drain tools,      │
│  └────────┬────────────────────────┘      add interrupt msg │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ Execute Tool Calls               │                        │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 3: After Tool Batch  │ ◄─── signal.aborted?   │
│  │ if (signal.aborted) drain tools │      May catch abort   │
│  └────────┬────────────────────────┘      during tool exec  │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │ NEXT ITERATION  │ ──┐                                    │
│  └─────────────────┘   │                                    │
│           ▲             │                                    │
│           └─────────────┘                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Abort Checkpoint Code

```javascript
// ============================================
// Main abort checkpoint - after streaming completes
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
    if (toolExecutor) {
        // Drain in-flight tools atomically
        for await (const result of toolExecutor.getRemainingResults()) {
            if (result.message) yield result.message;
        }
    } else {
        // No executor - generate synthetic interrupt tool results
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

### 2.3 Message Injection After Steering

When steering aborts the LLM, the conversation history gets modified:

```
BEFORE steering abort:
Message history:
  [user]      "Implement login feature"
  [assistant] "I'll implement login using JWT authentication...
               First, let me create..." [INCOMPLETE]

AFTER steering abort:
Message history:
  [user]      "Implement login feature"
  [assistant] "I'll implement login using JWT authentication...
               First, let me create..." [INCOMPLETE]
  [tool_result] "Interrupted by user" (is_error: true)  ← Sp8 generates this

AFTER user types new direction:
  [user]      "Use OAuth instead"
  [assistant] "I understand. Let me implement OAuth 2.0..." ← new response
```

**Why the interruption message matters**: Claude's next response sees:
1. Original user request
2. Partial assistant response
3. Tool result with "Interrupted by user" error
4. New steering message

This context allows Claude to understand that its previous approach was incomplete AND deliberately stopped, not just truncated.

---

## 3. Integration with Tool Execution (Module 05)

### 3.1 Tool Drainage on Abort

When steering interrupts during tool execution:

```
Tools before abort:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Tool A: Write│  │ Tool B: Bash │  │ Tool C: Read │
│  (Complete)  │  │  (Running)   │  │  (Queued)    │
└──────────────┘  └──────────────┘  └──────────────┘

After abort signal fires:
│ Tool A: Write│  → Output already yielded to conversation
│ Tool B: Bash │  → getRemainingResults() waits for completion
│ Tool C: Read │  → Never starts (query generator returns)
```

The `getRemainingResults()` call ensures Tool B completes its current atomic operation:

| Tool Type | Without Drainage | With Drainage |
|-----------|------------------|---------------|
| `Write` file | File partially written, corrupted | File write completes atomically |
| `Bash` git commit | Commit aborted mid-op, dirty state | Commit finishes, clean state |
| `Read` large file | Partial read, incomplete context | Read completes, full data returned |
| `Grep` search | Stops mid-results | All matching results returned |

**Trade-off**: Drainage adds 50-500ms to abort latency (waiting for tool atomicity), but prevents data corruption.

### 3.2 Tool Permission Interaction

When `onCancel` runs in `"tool-permission"` mode:
- The tool permission dialog is dismissed (tool denied)
- The LLM stream is NOT aborted by this path
- If the user wanted to fully stop Claude, they need to press Escape again

This is intentional — the first Escape cancels the "inner" dialog, second Escape cancels the "outer" stream.

---

## 4. Integration with Background Agents (Module 26)

### 4.1 Kill Background Agents Feature

The `chat:killAgents` keybinding provides a way to stop all running background agents:

```javascript
// ============================================
// handleKillAgentsPress - Double-press to kill background agents
// Location: chunks.193.mjs:2629-2656
// ============================================

// READABLE (for understanding):
function handleKillAgentsPress() {
    const now = Date.now();

    // Check for double-press within 3000ms
    if (now - lastKillPressTime.current <= KILL_AGENTS_CONFIRM_TIMEOUT) {
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
                markAgentNotified(taskId, setAppState);  // d4q - marks for UI, does NOT kill
                killedAgents.push(task.description);
            }
        }

        if (killedAgents.length > 0) {
            const message = killedAgents.length === 1
                ? `Background agent "${killedAgents[0]}" was stopped by the user.`
                : `${killedAgents.length} background agents were stopped by the user: ${killedAgents.map(a => `"${a}"`).join(", ")}.`;
            enqueueCommand({ value: message, mode: "task-notification" });
        }

        onAgentsKilled();
        return;
    }

    // First press - show confirmation prompt
    lastKillPressTime.current = now;
    addNotification({
        key: "kill-agents-confirm",
        text: "Press ctrl+f again to stop background agents",
        priority: "immediate",
        timeoutMs: 3000
    });
}

// Mapping: r→handleKillAgentsPress, U4q→killAllRunningAgents, d4q→markAgentNotified
// NOTE: d4q was incorrectly documented as killLocalAgent. It only marks agent as notified for UI.
// The actual kill is performed by x66 (killLocalAgentInternal) called by U4q.
```

### 4.2 Kill Agent Functions - CORRECTED

```javascript
// ============================================
// killAllRunningAgents - Kill all local_agent tasks
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running")
            x66(K, q)
}

// READABLE (for understanding):
function killAllRunningAgents(tasks, setAppState) {
    for (const [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            killLocalAgentInternal(taskId, setAppState);  // x66 - the actual kill
        }
    }
}

// Mapping: U4q→killAllRunningAgents, x66→killLocalAgentInternal, A→tasks, q→setAppState
```

**Kill Flow**: `U4q` iterates all tasks and calls `x66` (killLocalAgentInternal) which:
1. Aborts the agent's abortController
2. Unregisters cleanup handlers
3. Sets status to "killed"

**Note**: The function previously documented as `na` was incorrect. The actual kill function is `x66`.

---

## 5. Integration with State Management (Module 15)

### 5.1 `resetLoadingState` - What Gets Reset

`resetLoadingState` clears multiple streaming-related state values:
- `isLoading`
- `userInputOnProcessing`
- `responseLengthRef`
- `streamingToolUses`
- `spinnerOverrideMessage`
- `spinnerOverrideColor`
- `spinnerOverrideShimmerColor`

Called at:
1. `onCancel()` → always on cancel
2. `handleQuery()` → end of successful query
3. `onQuery` → finally block (ensures cleanup even on error)
4. `handleSessionResume` → when resuming a session

**Key insight**: `resetLoadingState` is idempotent and comprehensive. It doesn't just clear `isLoading` — it resets ALL streaming-related UI state in one call, preventing orphaned spinners or stale tool indicators.

### 5.2 `lastQueryCompletionTime` - Completion Timestamp

`lastQueryCompletionTime` is used as a dependency in `useQueuedCommandProcessor`'s Effect. If a query completes (`isLoading: true → false`) but `queuedCommandsLength` doesn't change between renders (e.g., stays at 0), React's shallow comparison would prevent the effect from re-firing. By including `lastQueryCompletionTime` (which always changes on completion), the effect reliably re-fires on every query completion.

---

## 5.1 Queue System Integration

### Queue Check Function `d36` (isPromptQueueingEnabled)

**CORRECTION (2026-03-24)**: Previous analysis incorrectly stated this function always returns `false`.

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

**Actual Behavior**: Returns `true` when there are items in the legacy queue. The queue pop branch in `handleCancelPress` IS reachable when queued commands exist.

**Integration with `handleCancelPress`**:
```javascript
// Location: chunks.193.mjs:2614-2618

if (d36()) {  // isPromptQueueingEnabled() - checks xY.length > 0
    if (O) {   // if popCommandFromQueue exists
        O();   // popCommandFromQueue() - merge queue into input box
        return
    }
}
```

---

## 6. Integration with Remote Sessions (Module 33)

### 6.1 Dual Session Manager Architecture

The `remoteSessionManager` reference points to either:
- Remote session manager (Web/SSH mode)
- Local session handler (CLI mode)

Both implement the same interface: `{ isRemoteMode, cancelRequest, sendMessage, ... }`.

When `onCancel` checks `isRemoteMode`:
- `true` → calls `cancelRequest()` → sends WebSocket `{subtype: "interrupt"}`
- `false` → calls `abortController?.abort()` → triggers AbortController

**Interface symmetry**: The remote path sends a control message that causes the remote agent to call its own `abortController.abort()`, creating symmetric behavior on both sides of the connection.

### 6.2 Remote Mode Differences

Remote mode does NOT use the `queuedCommands` system:
- Each Enter press either sends immediately (not loading) or is silently dropped if empty
- Steering relies entirely on the WebSocket interrupt signal path
- No message queueing during streaming

---

## 7. Integration with Compact (Module 07)

### 7.1 Abort During Auto-Compaction

**User intent wins**: If the user aborts during auto-compaction, the compaction is abandoned (doesn't complete). The conversation history is NOT compacted, and any steering message is submitted with the original (uncompacted) history.

### 7.2 Interrupt Messages Preserved During Compaction

The "Interrupted by user" system message is tagged with `is_error: true`. During compaction, error tool results are preserved to maintain conversation causality.

---

## 8. Integration with Hooks (Module 11)

### 8.1 Hook Abort Signal Propagation

Hooks that receive the abort signal respect it via `combineAbortSignals` which creates an AbortController that aborts when EITHER:
- The hook timeout fires, OR
- The steering abort fires

This means:
- If user steers while a hook is executing, the hook's subprocess receives SIGTERM
- The hook is killed, and the abort chain propagates up

### 8.2 Session-Start Hooks Cannot Be Interrupted

Session-start hooks run before the first query. Steering cannot interrupt session-start hooks because `abortController` is not yet created at that point.

---

## 9. Integration with System Reminders (Module 04)

### 9.1 Interrupt Message Detection - Complete Pattern

The system detects interrupt messages using a comprehensive regex pattern that matches multiple message types:

```javascript
// ============================================
// INTERRUPT_MESSAGE_PATTERN - Complete regex for interrupt detection
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
    `\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|` +  // Full IDE opened file block
    `\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$` +       // IDE selection block
    `)`
);

// Mapping: hTq→INTERRUPT_MESSAGE_PATTERN, vV→IDE_OPENED_FILE_TAG
```

**Pattern Breakdown**:

| Pattern Component | Matches | Purpose |
|-------------------|---------|---------|
| `<local-command-stdout>` | Local command output markers | Shell command outputs |
| `<session-start-hook>` | Session start hook messages | Hook execution results |
| `<ide_opened_file>` | IDE file open notifications | VSCode/IDE integration |
| `\[Request interrupted by user[^\]]*\]` | All interrupt variants | D66, P0, and any custom text |
| `<ide_opened_file>...</ide_opened_file>` | Full IDE file block | Multi-line file content |
| `<ide_selection>...</ide_selection>` | IDE selection block | User's selected code |

**Why This Pattern Matters**: This regex is used during message normalization to identify messages that should be treated as meta/system messages rather than regular user input.

### 9.2 Interrupt Count During Compaction - Source Verified

During compaction analysis, the system counts interrupt messages for telemetry and behavior analysis:

```javascript
// ============================================
// Interrupt count during compaction analysis
// Location: chunks.167.mjs:844-850
// ============================================

// ORIGINAL (for source lookup):
if (L.includes("[Request interrupted by user")) {
    O++
} else if (Array.isArray(L)) {
    for (let R of L) {
        if (R.type === "text" && "text" in R && R.text.includes("[Request interrupted by user")) {
            O++;
            break
        }
    }
}

// READABLE (for understanding):
// For string content:
if (content.includes("[Request interrupted by user")) {
    interruptCount++;
}
// For array content (multi-block message):
else if (Array.isArray(content)) {
    for (const block of content) {
        if (block.type === "text" && "text" in block &&
            block.text.includes("[Request interrupted by user")) {
            interruptCount++;
            break;  // Only count once per message
        }
    }
}

// Mapping: L→content, O→interruptCount, R→block
```

**Why Count Interrupts During Compaction?**
1. **Telemetry**: Track user intervention frequency across sessions
2. **Behavior Analysis**: High interrupt count may indicate user dissatisfaction with responses
3. **Model Adjustment**: May inform future response strategies
4. **Compaction Statistics**: Used for session analytics

### 9.3 Interrupt Message Constants - Complete Reference

The steering system uses predefined message constants that integrate with system reminders:

```javascript
// ============================================
// Interrupt message constants - Complete set
// Location: chunks.174.mjs:984-997
// ============================================

// ORIGINAL (for source lookup):
D66 = "[Request interrupted by user]"
P0 = "[Request interrupted by user for tool use]"
R96 = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."
h96 = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."
mQ6 = `The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). To tell you how to proceed, the user said:\n`
Eb = "Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). Try a different approach or report the limitation to complete your task."
rc6 = `Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). The user said:\n`

// Mapping: D66→INTERRUPTED_BY_USER_TEXT, P0→INTERRUPTED_FOR_TOOL_USE,
//   R96→REJECTION_MESSAGE, h96→TOOL_REJECTION_MESSAGE,
//   mQ6→REJECTION_MESSAGE_WITH_USER_INPUT, Eb→PERMISSION_DENIED_MESSAGE,
//   rc6→PERMISSION_DENIED_WITH_USER_INPUT
```

**When Each Constant Is Used**:

| Constant | Usage | Triggered By |
|----------|-------|--------------|
| `D66` | Text response interrupt | User presses Escape during text streaming |
| `P0` | Tool execution interrupt | User presses Escape during tool execution |
| `R96` | Action rejection | User rejects via tool permission dialog |
| `h96` | Tool-specific rejection | User rejects specific tool use |
| `mQ6` | Rejection with explanation | User provides comment when rejecting |
| `Eb` | Policy denial | Permission denied by configuration |
| `rc6` | Policy denial with explanation | User explains why denied |

**Integration with System Reminder Detection**:
```javascript
// Location: chunks.174.mjs:1099
// Set of messages treated as special/system messages
TF6 = new Set([D66, P0, R96, h96, N36]);  // N36 is another special message

// This set is used in Hz6 (chunks.173.mjs:1275) for UI filtering
```

### 9.4 Complete Steering → System Reminder Data Flow

```
┌────────────────────────────────────────────────────────────────────┐
│              STEERING → SYSTEM REMINDER DATA FLOW                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. USER PRESSES ESCAPE                                            │
│     └─► handleCancelPress() called (chunks.193.mjs:2606)          │
│                                                                    │
│  2. ABORT TRIGGERED                                                │
│     └─► abortController.abort()                                    │
│     └─► signal.aborted = true                                      │
│     └─► signal.reason = undefined (Escape) or "interrupt" (submit)│
│                                                                    │
│  3. QUERY GENERATOR CHECKPOINT                                     │
│     └─► chunks.148.mjs:1152 - if (signal.aborted)                 │
│     │                                                              │
│     ├─► if (toolExecutor exists)                                   │
│     │       └─► getRemainingResults() - drain tools gracefully    │
│     │                                                              │
│     └─► else (no executor)                                         │
│             └─► Sp8(assistantMessages, "Interrupted by user")     │
│                 └─► Creates tool_result with is_error: true       │
│                                                                    │
│  4. USER GUIDANCE MESSAGE                                          │
│     └─► Ug({ toolUse: false/true }) (chunks.173.mjs:1425)         │
│     └─► Returns: p1({ content: [{                                  │
│     │       type: "text",                                          │
│     │       text: D66 or P0                                        │
│     │   }]})                                                       │
│     │                                                              │
│     └─► if (signal.reason !== "interrupt")                         │
│             └─► Add guidance message (skip for intentional submit)│
│                                                                    │
│  5. MESSAGE ADDED TO CONVERSATION                                  │
│     └─► [user] "[Request interrupted by user]"                    │
│     └─► or "[Request interrupted by user for tool use]"           │
│                                                                    │
│  6. SYSTEM REMINDER DETECTION (on next turn)                       │
│     └─► hTq pattern matches interrupt message                     │
│     └─► Message treated as meta/system message                    │
│     └─► UI filters via Hz6 (chunks.173.mjs:1275)                  │
│                                                                    │
│  7. COMPACTION ANALYSIS                                            │
│     └─► chunks.167.mjs:844 - interruptCount++                     │
│     └─► Interrupt messages counted for telemetry                  │
│     └─► Used for session analytics                                │
│                                                                    │
│  8. AUTO-COMPACTION PRESERVATION                                   │
│     └─► is_error: true flag preserves interrupt messages          │
│     └─► Maintains conversation causality                          │
│     └─► Claude sees tool was interrupted, not just missing        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 9.5 UI Filtering of Interrupt Messages

The system_reminder module filters interrupt messages from the UI using the `Hz6` function:

```javascript
// ============================================
// Hz6 - Detect special message types hidden from UI
// Location: chunks.173.mjs:1275-1277
// ============================================

// ORIGINAL (for source lookup):
function Hz6(A) {
    return A.type !== "progress" && A.type !== "attachment" && A.type !== "system" &&
           Array.isArray(A.message.content) &&
           A.message.content[0]?.type === "text" &&
           TF6.has(A.message.content[0].text)
}

// READABLE (for understanding):
function isHiddenSpecialMessage(message) {
    // Not progress, attachment, or system type
    if (message.type === "progress" ||
        message.type === "attachment" ||
        message.type === "system") {
        return false;
    }

    // Check if first text block matches special message set
    if (Array.isArray(message.message.content) &&
        message.message.content[0]?.type === "text" &&
        SPECIAL_MESSAGES.has(message.message.content[0].text)) {
        return true;  // Hide from UI
    }

    return false;
}

// Mapping: Hz6→isHiddenSpecialMessage, A→message, TF6→SPECIAL_MESSAGES
```

**Messages Hidden by Hz6**: D66, P0, R96, h96, and N36 are hidden from the chat UI but preserved in the conversation for Claude's context.

When auto-compaction runs:

1. **Interrupt messages are preserved**: Tagged with `is_error: true`, they participate in message retention decisions
2. **Interrupt count affects behavior**: High interrupt count may indicate user dissatisfaction
3. **Text is searchable**: `[Request interrupted by user]` pattern is used for conversation analysis

### 9.5 User Guidance Message Generation Flow

```
┌────────────────────────────────────────────────────────────────────┐
│              INTERRUPT MESSAGE GENERATION FLOW                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  USER PRESSES ESCAPE                                               │
│         │                                                          │
│         ▼                                                          │
│  abortController.abort()                                           │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────┐                  │
│  │ Query Generator Abort Checkpoint             │                  │
│  │ (chunks.148.mjs:1152-1161)                   │                  │
│  └─────────────────────────────────────────────┘                  │
│         │                                                          │
│         ├─ toolExecutor exists?                                   │
│         │      │                                                   │
│         │      ├─ YES → getRemainingResults() (drain tools)       │
│         │      │                                                   │
│         │      └─ NO → Sp8(assistantMessages, "Interrupted...")   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────┐                  │
│  │ Ug({ toolUse: false/true })                  │                  │
│  │ (chunks.173.mjs:1425-1434)                   │                  │
│  │                                              │                  │
│  │ Returns: p1({ content: [{                    │                  │
│  │   type: "text",                              │                  │
│  │   text: D66 or P0                            │                  │
│  │ }]})                                         │                  │
│  └─────────────────────────────────────────────┘                  │
│         │                                                          │
│         ▼                                                          │
│  User message with interrupt text added to conversation           │
│         │                                                          │
│         ▼                                                          │
│  System reminder detection can match pattern                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 10. Cross-Module Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   STEERING CROSS-MODULE FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  USER PRESSES ESCAPE (during stream)                                    │
│  ┌────────────────┐                                                     │
│  │ mt8 (Cancel    │─→ handleCancelPress()                               │
│  │  Handler)      │      ├─ telemetry("tengu_cancel")                   │
│  └────────────────┘      ├─ setToolUseConfirmQueue([])                  │
│                           └─ onCancel() → abortController.abort()       │
│                                    │                                    │
│                                    ▼                                    │
│  LLM STREAM CHECKS ABORT SIGNAL                                        │
│  ┌────────────────┐                                                     │
│  │ Query Generator│─→ signal.aborted?                                   │
│  │ (chunks.148)   │      ├─ YES: drain tools + "Interrupted by user"    │
│  └────────────────┘      └─ NO:  normal completion                      │
│         │                                                               │
│         ▼                                                               │
│  isLoading = false                                                      │
│         │                                                               │
│         ▼                                                               │
│  USER CAN TYPE NEW DIRECTION                                           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  USER PRESSES CTRL+F (with background agents running)                  │
│  ┌────────────────┐                                                     │
│  │ mt8 (Cancel    │─→ handleKillAgentsPress()                           │
│  │  Handler)      │      ├─ First press: show notification              │
│  └────────────────┘      └─ Second press (within 3s): kill all agents  │
│                                    │                                    │
│                                    ▼                                    │
│  killAllRunningAgents(tasks, setAppState)                              │
│         │                                                               │
│         ▼                                                               │
│  enqueueCommand({mode: "task-notification", value: stoppedMessage})    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Summary

Steering integration touches **10 major modules**:

| Module | Integration Point | Mechanism |
|--------|------------------|-----------|
| Keybindings (32) | Cancel keybinding registration | `mt8` registers `chat:cancel`, `app:interrupt`, `chat:killAgents` |
| Agent Loop (03) | Abort checkpoints in query generator | `signal.aborted` checked at 3+ points |
| Tool Execution (05) | Graceful tool drainage | `getRemainingResults()` before exit |
| Background Agents (26) | Kill agents via Ctrl+F | `killAllRunningAgents`, `killLocalAgent` |
| REPL/Input (02) | Interrupt on submit | `hasInterruptibleToolInProgress` check |
| State Management (15) | isLoading + queuedCommands state | React state drives all transitions |
| Remote Sessions (33) | WebSocket control channel | `{subtype: "interrupt"}` message |
| Compact (07) | Abort during compaction | Abort takes priority, compaction abandoned |
| Hooks (11) | Signal forwarded to hook subprocess | `combineAbortSignals` terminates hook |
| System Reminders (04) | Interrupt message detection | Regex matching for conversation analysis |

**The architectural principle**: Steering is implemented as a *unidirectional interrupt* that flows upstream (User → UI → Signal → Network), while steering messages flow downstream through the normal submission path.

**Key v2.1.76 behavioral notes**:
1. `d36()` (isPromptQueueingEnabled) returns `xY.length > 0` - true when legacy queue has items
2. Background agents are NOT killed by Escape — use Ctrl+F double-press instead
3. Remote mode has NO queue system — each Enter either sends or is dropped
4. Interrupt-on-submit (`hasInterruptibleToolInProgress`) allows steering during tool execution

---

## 12. System Reminder Integration (Detailed)

### 12.1 Interrupt Message Detection Pattern

The system_reminder module uses a regex pattern to detect interrupt messages:

```javascript
// ============================================
// INTERRUPT_MESSAGE_PATTERN - Regex for interrupt detection
// Location: chunks.175.mjs:139
// ============================================

// ORIGINAL (for source lookup):
hTq = new RegExp(`^(?:<local-command-stdout>|<session-start-hook>|<${vV}>|\\[Request interrupted by user[^\\]]*\\]|\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$)`);

// READABLE (for understanding):
const INTERRUPT_MESSAGE_PATTERN = new RegExp(
    `^(?:` +
    `<local-command-stdout>|` +           // Local command output
    `<session-start-hook>|` +             // Session start hook
    `<ide_opened_file>|` +                // IDE opened file (vV placeholder)
    `\\[Request interrupted by user[^\\]]*\\]|` +  // Interrupt messages (D66, P0)
    `\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|` +
    `\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$` +
    `)`
);

// Mapping: hTq→INTERRUPT_MESSAGE_PATTERN, vV→IDE_OPENED_FILE_TAG
```

**What this pattern matches**:
- `<local-command-stdout>` - Local command output
- `<session-start-hook>` - Session start hook messages
- `<ide_opened_file>` - IDE opened file notifications
- `[Request interrupted by user]` - D66 constant
- `[Request interrupted by user for tool use]` - P0 constant

### 12.2 Interrupt Count During Compaction

During compaction analysis, the system counts interrupt messages:

```javascript
// ============================================
// Interrupt count during compaction analysis
// Location: chunks.167.mjs:844-850
// ============================================

// ORIGINAL (for source lookup):
if (L.includes("[Request interrupted by user")) {
    O++
} else if (Array.isArray(L)) {
    for (let R of L) {
        if (R.type === "text" && "text" in R && R.text.includes("[Request interrupted by user")) {
            O++;
            break
        }
    }
}

// READABLE (for understanding):
// For string content:
if (content.includes("[Request interrupted by user")) {
    interruptCount++;
}
// For array content (multi-block message):
else if (Array.isArray(content)) {
    for (const block of content) {
        if (block.type === "text" && "text" in block &&
            block.text.includes("[Request interrupted by user")) {
            interruptCount++;
            break;  // Only count once per message
        }
    }
}

// Mapping: L→content, O→interruptCount, R→block
```

**Why count interrupts during compaction?**
1. **Telemetry**: Track user intervention frequency
2. **Behavior analysis**: High interrupt count may indicate user dissatisfaction
3. **Model adjustment**: May affect future response strategies

### 12.3 Data Flow: Steering → System Reminder

```
┌────────────────────────────────────────────────────────────────────┐
│              STEERING → SYSTEM REMINDER DATA FLOW                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. USER PRESSES ESCAPE                                            │
│     └─► handleCancelPress() called                                │
│                                                                    │
│  2. ABORT TRIGGERED                                                │
│     └─► abortController.abort()                                   │
│     └─► signal.aborted = true                                     │
│                                                                    │
│  3. QUERY GENERATOR CHECKPOINT                                     │
│     └─► chunks.148.mjs:1152 - if (signal.aborted)                 │
│     └─► yield* createInterruptToolResults(...)                    │
│     └─► yield createUserGuidanceMessage({toolUse: false/true})    │
│                                                                    │
│  4. MESSAGE ADDED TO CONVERSATION                                  │
│     └─► [user] "[Request interrupted by user]"                    │
│     └─► or "[Request interrupted by user for tool use]"           │
│                                                                    │
│  5. SYSTEM REMINDER DETECTION (on next turn)                       │
│     └─► hTq pattern matches interrupt message                     │
│     └─► Message treated as meta/system message                    │
│                                                                    │
│  6. COMPACTION ANALYSIS                                            │
│     └─► chunks.167.mjs:844 - interruptCount++                     │
│     └─► Interrupt messages counted for telemetry                  │
│                                                                    │
│  7. AUTO-COMPACTION PRESERVATION                                   │
│     └─► is_error: true flag preserves interrupt messages          │
│     └─► Maintains conversation causality                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 12.4 Interrupt Message Constants Reference

| Constant | Symbol | Value | Usage |
|----------|--------|-------|-------|
| INTERRUPTED_BY_USER_TEXT | D66 | `"[Request interrupted by user]"` | Text response interrupt |
| INTERRUPTED_FOR_TOOL_USE | P0 | `"[Request interrupted by user for tool use]"` | Tool execution interrupt |
| REJECTION_MESSAGE | R96 | `"The user doesn't want to take this action right now..."` | Tool permission rejection |
| TOOL_REJECTION_MESSAGE | h96 | `"The user doesn't want to proceed with this tool use..."` | Specific tool rejection |
| REJECTION_MESSAGE_WITH_USER_INPUT | mQ6 | Rejection + user explanation | Rejection with user comment |
| PERMISSION_DENIED_MESSAGE | Eb | `"Permission for this tool use was denied..."` | Permission denied |

### 12.5 Integration with Auto-Compaction

When auto-compaction runs, interrupt messages are handled specially:

```javascript
// Why interrupt messages are preserved during compaction:

// 1. is_error: true flag
//    - Generated by createInterruptToolResults()
//    - Error tool results are preserved during compaction
//    - Maintains conversation causality

// 2. Message importance
//    - "[Request interrupted by user]" signals to Claude that approach was wrong
//    - Prevents Claude from retrying same failed approach
//    - Critical context for conversation continuity

// 3. Compaction statistics
//    - interruptCount tracked for analysis
//    - May affect compaction aggressiveness
//    - Used for user behavior analysis
```

---

## 13. Kill Agents Functions (Detailed)

### 13.1 killAllRunningAgents (U4q)

```javascript
// ============================================
// killAllRunningAgents - Kill all local_agent tasks
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running")
            x66(K, q)
}

// READABLE (for understanding):
function killAllRunningAgents(tasks, setAppState) {
    for (const [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            killLocalAgentInternal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllRunningAgents, A→tasks, q→setAppState,
//   K→taskId, Y→task, x66→killLocalAgentInternal
```

### 13.2 markAgentNotified (d4q) - CORRECTED

**IMPORTANT**: This function was previously incorrectly documented as `killLocalAgent`. It does NOT kill the agent - it only marks it as notified for UI purposes.

```javascript
// ============================================
// markAgentNotified - Mark agent as notified for UI display
// Location: chunks.146.mjs:2034-2043
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}

// READABLE (for understanding):
function markAgentNotified(taskId, setAppState) {
    updateTaskState(taskId, setAppState, (task) => {
        // Already notified - don't double-notify
        if (task.notified) return task;

        // Mark as notified and trim messages to last one
        return {
            ...task,
            notified: true,  // Only marks as notified - does NOT kill
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]  // Keep only last message
                : undefined
        };
    });
}

// Mapping: d4q→markAgentNotified, A→taskId, q→setAppState,
//   i9→updateTaskState, K→task
```

**Correct Kill Flow**:
```
handleKillAgentsPress (r)
    → U4q (killAllRunningAgents)
        → x66 (killLocalAgentInternal) - THE ACTUAL KILL
            → abortController.abort()
            → unregisterCleanup()
            → status = "killed"
    → d4q (markAgentNotified) - JUST MARKS notified=true FOR UI
```

The `d4q` function is called AFTER the kill to mark the agent as notified so the UI can show a notification to the user. The actual kill is performed by `x66` (killLocalAgentInternal).

### 13.3 clearAgentNotifications (_Y4)

```javascript
// ============================================
// clearAgentNotifications - Clear legacy queue
// Location: chunks.90.mjs:2885-2888
// ============================================

// ORIGINAL (for source lookup):
function _Y4() {
    if (xY.length === 0) return;
    xY.length = 0, Qt()
}

// READABLE (for understanding):
function clearAgentNotifications() {
    if (legacyQueueArray.length === 0) return;
    legacyQueueArray.length = 0;  // Clear array in-place
    notifySubscribers();          // Notify React of state change
}

// Mapping: _Y4→clearAgentNotifications, xY→legacyQueueArray, Qt→notifySubscribers
```

---

## 14. Complete Module Integration Summary

| Module | Integration Point | Symbols | Data Flow |
|--------|------------------|---------|-----------|
| **Keybindings (32)** | Cancel keybinding registration | `mt8`, `D8` | UI → Signal |
| **Agent Loop (03)** | Abort checkpoints | `signal.aborted` | Signal → Query Stop |
| **Tool Execution (05)** | Tool drainage | `getRemainingResults()`, `Sp8` | Tool → Message |
| **Background Agents (26)** | Kill agents | `U4q`, `d4q`, `x66` | UI → Task State |
| **REPL/Input (02)** | Interrupt on submit | `hasInterruptibleToolInProgress` | Input → Abort |
| **State Management (15)** | Loading state | `isLoading`, `YK` | Signal → UI |
| **Remote Sessions (33)** | WebSocket interrupt | `cancelSession` | Network → Remote Agent |
| **Compact (07)** | Abort during compaction | `signal.aborted` | Abort → Cleanup |
| **Hooks (11)** | Hook termination | `combineAbortSignals` | Signal → Subprocess |
| **System Reminders (04)** | Interrupt detection | `hTq`, `interruptCount` | Message → Detection |

---

## 15. Integration with System Reminders (Module 04)

### 15.1 INTERRUPT_MESSAGE_PATTERN (hTq)

The system_reminder module uses the `hTq` regex to detect interrupt-related messages:

```javascript
// ============================================
// INTERRUPT_MESSAGE_PATTERN - Detects interrupt messages in conversation
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
    `\\[Request interrupted by user[^\\]]*\\]|` +  // Any interrupt message variant
    `\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|` +
    `\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$` +
    `)`
);

// Mapping: hTq→INTERRUPT_MESSAGE_PATTERN, vV→IDE_OPENED_FILE_TAG
```

### 15.2 Pattern Match Targets

| Pattern | Matches | Source |
|---------|---------|--------|
| `<local-command-stdout>` | Local command output | chunks.175.mjs |
| `<session-start-hook>` | Session start hook messages | chunks.175.mjs |
| `<ide_opened_file>...</ide_opened_file>` | IDE file context | chunks.175.mjs |
| `<ide_selection>...</ide_selection>` | IDE selection context | chunks.175.mjs |
| `[Request interrupted by user...]` | Any interrupt message | D66, P0 variants |

### 15.3 Interrupt Message Detection Flow

```
┌────────────────────────────────────────────────────────────────────┐
│              INTERRUPT MESSAGE DETECTION FLOW                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  USER PRESSES ESCAPE                                               │
│         │                                                          │
│         ▼                                                          │
│  abortController.abort()                                           │
│         │                                                          │
│         ▼                                                          │
│  createUserGuidanceMessage() (Ug)                                  │
│         │                                                          │
│         │ Creates: "[Request interrupted by user]" (D66)          │
│         │        or "[Request interrupted by user for tool use]" (P0)
│         ▼                                                          │
│  Message added to conversation history                             │
│         │                                                          │
│         ▼                                                          │
│  system_reminder module processes message                          │
│         │                                                          │
│         ▼                                                          │
│  INTERRUPT_MESSAGE_PATTERN (hTq) matches?                          │
│         │                                                          │
│    ┌────┴────┐                                                     │
│   YES        NO                                                    │
│    │         │                                                     │
│    ▼         ▼                                                     │
│  Apply special  Normal message                                     │
│  handling:         processing                                      │
│  - isMeta filter                                                   │
│  - Compaction                                                      │
│    preservation                                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 15.4 Integration with Compaction

Interrupt messages are preserved during auto-compaction:

1. **`is_error: true` flag**: Tool results with interrupt messages are marked as errors
2. **Error preservation**: Compaction keeps error tool results to maintain conversation causality
3. **Interrupt count tracking**: The system tracks interrupt count for telemetry

```javascript
// Location: chunks.167.mjs:844-850

if (content.includes("[Request interrupted by user")) {
    interruptCount++;
} else if (Array.isArray(content)) {
    for (const block of content) {
        if (block.type === "text" && block.text.includes("[Request interrupted by user")) {
            interruptCount++;
            break;
        }
    }
}
```

### 15.5 isMeta Filtering

The `isMeta` flag on interrupt messages controls visibility:

```javascript
// Location: chunks.185.mjs:1692-1702 (XV6 function)

// isMeta messages are filtered from UI display
if (message.isMeta) return false;

// Interrupt-related messages with specific XML tags are also filtered
if (containsSystemReminderTags(content)) return false;
```

**Key insight**: The steering module creates messages that are:
1. Visible to the LLM (included in API call)
2. Filtered from UI display (via isMeta or pattern matching)
3. Preserved during compaction (via is_error flag)