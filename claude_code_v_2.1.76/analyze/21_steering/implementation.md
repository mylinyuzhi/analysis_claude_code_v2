# Steering Implementation - Deep Analysis

## Module Overview

The **steering mechanism** in Claude Code v2.1.76 enables users to provide real-time course corrections to the AI agent while it is actively working on a task. This prevents the agent from pursuing incorrect approaches for extended periods and allows for dynamic, interactive guidance during complex multi-turn operations.

**Key Capability**: Users can interrupt the LLM mid-stream by pressing Escape or Ctrl+C, and optionally queue a new message that gets auto-submitted once the interrupt completes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop and LLM API

Key functions in this document:
- `cancelHandlerComponent` (mt8) - React component that registers keybindings for cancel/interrupt
- `handleCancelPress` (h) - Main cancel logic closure inside mt8
- `handleKillAgentsPress` (r) - Double-press Ctrl+F to kill background agents
- `createInterruptToolResults` (Sp8) - Generates tool_result messages for interrupted tools
- `useQueuedCommandProcessor` (HVq) - Hook that auto-submits queued commands after load completes
- `processNextQueuedCommand` (zVq) - Dequeues and executes next command from React state queue
- `isPromptQueueingEnabled` (d36) - Returns `xY.length > 0` (legacy queue has items)
- `useKeybindingAction` (D8) - Registers keybinding handler with context
- `hasActiveOverlays` (Qf4) - Checks if overlays (modals) are blocking cancel
- `isVimMode` (X16) - Checks if editor is in vim mode
- `clearAgentNotifications` (_Y4) - Clears the legacy queue array

---

## 1. Core Architecture

### 1.1 Steering Modes

Claude Code supports two distinct steering implementations based on execution context:

```
┌────────────────────────────────────────────────────────────┐
│                    STEERING ARCHITECTURE                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐              ┌──────────────────┐  │
│  │  LOCAL MODE      │              │  REMOTE MODE     │  │
│  │  (CLI/Terminal)  │              │  (Web/SSH)       │  │
│  └────────┬─────────┘              └────────┬─────────┘  │
│           │                                  │            │
│           │ Uses:                           │ Uses:      │
│           │ - AbortController API           │ - WebSocket│
│           │ - Escape keybinding             │ - Control  │
│           │ - Ctrl+C global interrupt       │ - Messages │
│           │ - Ctrl+F kill agents            │            │
│           │                                  │            │
│           ▼                                  ▼            │
│  ┌─────────────────┐              ┌──────────────────┐  │
│  │ abort() signal  │              │ {subtype:        │  │
│  │ → LLM API call  │              │  "interrupt"}    │  │
│  └─────────────────┘              └──────────────────┘  │
│                                                            │
│  Both modes converge on:                                  │
│  - Gracefully stop LLM streaming                          │
│  - Drain in-flight tool calls                             │
│  - Add "Interrupted by user" to conversation              │
└────────────────────────────────────────────────────────────┘
```

**Design Rationale**:
- **Local mode** leverages browser/Node.js native `AbortController` for zero-latency interruption
- **Remote mode** requires network round-trip but maintains same UX through WebSocket control channel

---

## 2. UI Layer: Cancel Handler Component

### 2.1 `cancelHandlerComponent` (mt8) - The Keybinding Hub

This component registers three keybindings:
1. `chat:cancel` (Escape in Chat context) - Interrupt current stream
2. `app:interrupt` (Ctrl+C globally) - Hard interrupt anywhere
3. `chat:killAgents` (Ctrl+F in Chat context) - Kill background agents (double-press)

```javascript
// ============================================
// cancelHandlerComponent - Registers cancel/interrupt/kill keybindings
// Location: chunks.193.mjs:2586-2661
// ============================================

// ORIGINAL (for source lookup):
function mt8(A) {
    let {
        setToolUseConfirmQueue: q, onCancel: K, onAgentsKilled: Y,
        isMessageSelectorVisible: z, screen: _, abortSignal: w,
        popCommandFromQueue: O, vimMode: $, isLocalJSXCommand: H,
        isSearchingHistory: j, isHelpOpen: J, inputMode: M,
        inputValue: D, streamMode: X
    } = A, P = S5(), W = xA(), Z = UF().length, {
        addNotification: G, removeNotification: f
    } = o4(), v = Ra6.useRef(0), N = void 0, V = M1((e) => e.viewSelectionMode),
    L = M1((e) => Object.values(e.tasks).some((Y6) => Y6.type === "local_agent" && Y6.status === "running")),
    h = Ra6.useCallback(() => {
        let e = { source: "escape", streamMode: X };
        if (w !== void 0 && !w.aborted) {
            d("tengu_cancel", e), q(() => []), K();
            return
        }
        if (d36()) {
            if (O) { O(); return }
        }
        d("tengu_cancel", e), q(() => []), K()
    }, [P, W, w, O, q, K, X]),
    R = Qf4(), u = w !== void 0 && !w.aborted, I = Z > 0,
    g = M !== void 0 && M !== "prompt" && !D, B = !1,
    p = _ !== "transcript" && !j && !z && !H && !J && !R && V !== "viewing-agent" && !(X16() && $ === "INSERT") && (u || I || B),
    Q = p && !g, U = B || p;
    D8("chat:cancel", h, { context: "Chat", isActive: Q }),
    D8("app:interrupt", h, { context: "Global", isActive: U });
    let r = Ra6.useCallback(() => {
        let e = Date.now();
        if (e - v.current <= Buq) {
            v.current = 0, f("kill-agents-confirm");
            let H6 = P.getState().tasks;
            d("tengu_cancel", { source: "kill_agents" }),
            U4q(H6, W), _Y4();
            let J6 = [];
            for (let [K6, s] of Object.entries(H6))
                if (s.type === "local_agent" && s.status === "running")
                    d4q(K6, W), J6.push(s.description);
            if (J6.length > 0) {
                let K6 = J6.length === 1
                    ? `Background agent "${J6[0]}" was stopped by the user.`
                    : `${J6.length} background agents were stopped by the user: ${J6.map((s)=>`"${s}"`).join(", ")}.`;
                w0({ value: K6, mode: "task-notification" })
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
    return D8("chat:killAgents", r, { context: "Chat", isActive: L }), null
}

// READABLE (for understanding):
function cancelHandlerComponent({
    setToolUseConfirmQueue, onCancel, onAgentsKilled,
    isMessageSelectorVisible, screen, abortSignal,
    popCommandFromQueue, vimMode, isLocalJSXCommand,
    isSearchingHistory, isHelpOpen, inputMode,
    inputValue, streamMode
}) {
    const appStore = useAppStore();
    const setAppState = useSetAppState();
    const queuedCommandsLength = useQueuedCommandsLength();
    const { addNotification, removeNotification } = useNotifications();

    // Track last Ctrl+F press for double-press detection
    const lastKillPressTime = useRef(0);

    // Check for running background agents
    const hasRunningLocalAgents = useStore((s) =>
        Object.values(s.tasks).some(t => t.type === "local_agent" && t.status === "running")
    );

    // ========================================
    // Main Cancel Handler (Escape / Ctrl+C)
    // ========================================
    const handleCancelPress = useCallback(() => {
        const telemetryData = { source: "escape", streamMode };

        // BRANCH 1: Streaming is active (LLM responding)
        if (abortSignal !== undefined && !abortSignal.aborted) {
            telemetry("tengu_cancel", telemetryData);
            setToolUseConfirmQueue(() => []);
            onCancel();  // → triggers abortController.abort()
            return;
        }

        // BRANCH 2: Prompt queueing mode + queue has items
        // NOTE: d36() returns xY.length > 0 (true when legacy queue has items)
        if (isPromptQueueingEnabled()) {
            if (popCommandFromQueue) {
                popCommandFromQueue();  // Merge queue into input box
                return;
            }
        }

        // BRANCH 3: Fallback (no stream, empty queue)
        telemetry("tengu_cancel", telemetryData);
        setToolUseConfirmQueue(() => []);
        onCancel();
    }, [appStore, setAppState, abortSignal, popCommandFromQueue,
        setToolUseConfirmQueue, onCancel, streamMode]);

    // ========================================
    // Visibility Computation for Cancel Indicator
    // ========================================
    const isVimInsertMode = useVimMode() === "INSERT";
    const isViewingAgent = useViewSelectionMode() === "viewing-agent";

    // isActive: Show cancel keybinding?
    const isCancelActive =
        screen !== "transcript" &&          // Not in read-only transcript
        !isSearchingHistory &&              // Escape dismisses history search
        !isMessageSelectorVisible &&        // Escape closes message selector
        !isLocalJSXCommand &&               // JSX component may capture Escape
        !isHelpOpen &&                      // Escape closes help overlay
        !isVimInsertMode &&                 // Escape switches Vim mode
        isViewingAgent === false &&         // Not viewing agent output
        (isStreaming || hasQueuedCommands || hasRunningAgents);

    // showCancelText: Show "Esc to cancel" text?
    const showCancelText = isCancelActive && !isNonPromptModeWithoutInput;

    // isGloballyActive: Show global interrupt?
    const isGloballyActive = hasRunningAgents || isCancelActive;

    // Register keybindings
    useKeybindingAction("chat:cancel", handleCancelPress, {
        context: "Chat",
        isActive: showCancelText
    });
    useKeybindingAction("app:interrupt", handleCancelPress, {
        context: "Global",
        isActive: isGloballyActive
    });

    // ========================================
    // Kill Agents Handler (Ctrl+F Double-Press)
    // ========================================
    const handleKillAgentsPress = useCallback(() => {
        const now = Date.now();

        // Check for double-press within timeout
        if (now - lastKillPressTime.current <= KILL_AGENTS_CONFIRM_TIMEOUT) {
            // Second press - actually kill agents
            lastKillPressTime.current = 0;
            removeNotification("kill-agents-confirm");

            const tasks = appStore.getState().tasks;
            telemetry("tengu_cancel", { source: "kill_agents" });

            killAllRunningAgents(tasks, setAppState);
            clearAgentNotifications();

            // Build notification message
            const killedAgents = [];
            for (const [taskId, task] of Object.entries(tasks)) {
                if (task.type === "local_agent" && task.status === "running") {
                    markAgentNotified(taskId, setAppState);  // Mark for UI notification
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
            timeoutMs: KILL_AGENTS_CONFIRM_TIMEOUT
        });
    }, [appStore, setAppState, addNotification, removeNotification, onAgentsKilled]);

    // Register kill agents keybinding (only when agents are running)
    useKeybindingAction("chat:killAgents", handleKillAgentsPress, {
        context: "Chat",
        isActive: hasRunningLocalAgents
    });

    return null; // Invisible component - keybinding side effects only
}

// Mapping: mt8→cancelHandlerComponent, q→setToolUseConfirmQueue, K→onCancel,
//   Y→onAgentsKilled, w→abortSignal, X→streamMode, h→handleCancelPress,
//   r→handleKillAgentsPress, D8→useKeybindingAction, d36→isPromptQueueingEnabled,
//   U4q→killAllRunningAgents, d4q→markAgentNotified, Buq→KILL_AGENTS_CONFIRM_TIMEOUT
//
// NOTE: d4q was previously incorrectly mapped to "killLocalAgent".
// The ACTUAL kill is performed by x66 (killLocalAgentInternal), called by U4q.
// d4q only marks the agent as notified=true for UI notification purposes.
```

### 2.2 Cancel Button Visibility State Machine

The cancel indicator appears based on a complex state computation:

```
┌──────────────────────────────────────────────────────────────────┐
│              CANCEL INDICATOR VISIBILITY LOGIC                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  isActive = NOT (transcript | historySearch | msgSelector |     │
│                  localJSX | helpOpen | vimInsert | viewingAgent) │
│             AND (isStreaming | hasQueue | hasRunningAgents)      │
│                                                                  │
│  showCancelText = isActive                                       │
│                   AND NOT (non-prompt mode with no input value)  │
│                                                                  │
│  isGloballyActive = hasRunningAgents OR isActive                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**What each condition prevents**:

| Condition | Why it blocks cancel |
|-----------|---------------------|
| `screen === "transcript"` | Read-only transcript view, no active stream |
| `isSearchingHistory` | Escape dismisses history search popup |
| `isMessageSelectorVisible` | Escape closes message selector |
| `isLocalJSXCommand` | JSX component may capture Escape |
| `isHelpOpen` | Escape closes help overlay |
| `vimMode === "INSERT"` | Escape switches to NORMAL mode, not cancel |
| `viewSelectionMode === "viewing-agent"` | Escape exits agent view |
| `inputMode !== "prompt" && !inputValue` | Non-prompt mode (e.g., tool-permission) |

### 2.4 Overlay Blocking - `hasActiveOverlays` (Qf4)

The `Qf4` function checks if any overlay modals are currently blocking the UI:

```javascript
// ============================================
// hasActiveOverlays - Check if overlays are blocking cancel
// Location: chunks.115.mjs:2225-2231
// ============================================

// ORIGINAL (for source lookup):
function Qf4() {
    return M1(H8Y)
}
function H8Y(A) {
    return A.activeOverlays.size > 0
}

// READABLE (for understanding):
function hasActiveOverlays() {
    return useStore(selectActiveOverlays);
}

function selectActiveOverlays(state) {
    return state.activeOverlays.size > 0;
}

// Mapping: Qf4→hasActiveOverlays, M1→useStore, H8Y→selectActiveOverlays
```

**Why this matters**: When overlays (like help modals or dialog overlays) are active, the cancel action should be blocked because Escape is used to dismiss the overlay first.

### 2.5 Vim Mode Check - `isVimMode` (X16)

The `X16` function checks if the editor is currently in vim mode:

```javascript
// ============================================
// isVimMode - Check if vim mode is active
// Location: chunks.153.mjs:995-997
// ============================================

// ORIGINAL (for source lookup):
function X16() {
    return X1().editorMode === "vim"
}

// READABLE (for understanding):
function isVimMode() {
    return getEditorConfig().editorMode === "vim";
}

// Mapping: X16→isVimMode, X1→getEditorConfig
```

**Integration with Cancel Logic**:

In the cancel visibility computation (line 2621 of chunks.193.mjs):
```javascript
// From: !(X16() && $ === "INSERT")
// Meaning: Block cancel if vim mode is active AND currently in INSERT mode
// In INSERT mode, Escape should switch to NORMAL mode, not trigger cancel

const isVimInsertMode = isVimMode() && vimMode === "INSERT";
// Then used in: !isVimInsertMode in the isActive computation
```

**Why this matters**: When the user is in vim INSERT mode, pressing Escape should first switch them to NORMAL mode (standard vim behavior), not interrupt the LLM. Only in NORMAL or VISUAL mode should Escape trigger cancel.

### 2.6 Clear Agent Notifications - `clearAgentNotifications` (_Y4)

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
    notifySubscribers();          // Trigger React re-render
}

// Mapping: _Y4→clearAgentNotifications, xY→legacyQueueArray, Qt→notifySubscribers
```

### 2.7 Kill Local Agent Internal - `killLocalAgentInternal` (x66)

This function is the actual implementation that kills a running local agent task:

```javascript
// ============================================
// killLocalAgentInternal - Kill a running local agent
// Location: chunks.146.mjs:2012-2022
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
            }
        }), !K) throw new Error(`Agent ${A} not found or not running`)
}

// READABLE (for understanding):
function killLocalAgentInternal(taskId, setAppState) {
    let wasKilled = false;

    updateTaskState(taskId, setAppState, (task) => {
        // Only kill if currently running
        if (task.status !== "running") {
            return task;  // No change
        }

        wasKilled = true;

        // Abort the agent's abort controller
        task.abortController?.abort();

        // Unregister cleanup handlers
        task.unregisterCleanup?.();

        // Return updated task state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message to save memory
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
        };
    });

    // Throw if task wasn't running
    if (!wasKilled) {
        throw new Error(`Agent ${taskId} not found or not running`);
    }
}

// Mapping: x66→killLocalAgentInternal, A→taskId, q→setAppState,
//   K→wasKilled, Y→task, i9→updateTaskState
```

**Key Operations**:
1. **Abort Controller**: Calls `abortController.abort()` to stop any in-progress operations
2. **Cleanup Handlers**: Unregisters any cleanup functions registered by the agent
3. **Status Update**: Sets status to "killed" with `endTime` timestamp
4. **Memory Optimization**: Keeps only the last message to reduce memory footprint
5. **Error Handling**: Throws if task not found or not in "running" state

### 2.8 Mark Agent Notified - `markAgentNotified` (d4q)

**IMPORTANT CORRECTION**: This function was previously incorrectly documented as `killLocalAgent`. It does NOT kill the agent - it only marks it as notified for UI purposes.

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
        // Skip if already notified
        if (task.notified) return task;

        return {
            ...task,
            notified: true,  // Mark as notified for UI
            // Keep only last message
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markAgentNotified, A→taskId, q→setAppState, K→task, i9→updateTaskState
```

**Purpose**: After killing agents with `U4q` → `x66`, this function marks each killed agent as `notified: true` so the UI knows to show a notification to the user.

### 2.8 Kill All Running Agents - `killAllRunningAgents` (U4q)

```javascript
// ============================================
// killAllRunningAgents - Iterate and kill all running local_agent tasks
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllRunningAgents(tasks, setAppState) {
    for (const [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            killLocalAgentInternal(taskId, setAppState);  // x66 - the actual kill
        }
    }
}

// Mapping: U4q→killAllRunningAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→killLocalAgentInternal
```

### 2.9 Complete Kill Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│              KILL AGENTS COMPLETE FLOW                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  USER DOUBLE-PRESSES CTRL+F                                        │
│         │                                                          │
│         ▼                                                          │
│  handleKillAgentsPress() (r)                                       │
│         │                                                          │
│         ├──────────────────────────────────────────────┐           │
│         │                                              │           │
│         ▼                                              ▼           │
│  U4q(killAllRunningAgents)                     d4q(markAgentNotified)
│         │                                              │           │
│         │ For each local_agent task                   │ For each killed
│         │ with status="running"                       │ agent      │
│         │                                              │           │
│         ▼                                              ▼           │
│  x66(killLocalAgentInternal)                    Sets notified=true │
│         │                                              │           │
│         │ - abortController.abort()                    │           │
│         │ - unregisterCleanup()                        │           │
│         │ - status = "killed"                          │           │
│         │ - endTime = Date.now()                       │           │
│         │                                              │           │
│         └──────────────────────────────────────────────┘           │
│                              │                                     │
│                              ▼                                     │
│                    _Y4(clearAgentNotifications)                    │
│                              │                                     │
│                              ▼                                     │
│                    w0(enqueueTaskNotification)                     │
│                    "Background agent X was stopped..."             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Key Insight**: `U4q` calls `x66` which does the actual killing. `d4q` is called AFTER to mark agents for UI notification, not to kill them.

### 2.10 Keybinding Registration Table

| Keybinding | Default Key | Context | Rebindable? | Purpose |
|------------|-------------|---------|-------------|---------|
| `chat:cancel` | Escape | Chat | Yes | Interrupt current stream |
| `app:interrupt` | Ctrl+C | Global | **No** (hardcoded) | Hard interrupt anywhere |
| `chat:killAgents` | Ctrl+F | Chat | Yes | Kill background agents (double-press) |

**Why `app:interrupt` is hardcoded**: Ctrl+C has a POSIX standard meaning (interrupt process). Allowing it to be rebound could prevent users from exiting the process, creating a "trap" scenario.

---

## 3. Interrupt Message Generation

### 3.1 `createInterruptToolResults` (Sp8) - Generate Interrupted Tool Messages

When the user interrupts during tool execution, this generator creates synthetic `tool_result` messages for each in-progress tool:

```javascript
// ============================================
// createInterruptToolResults - Generate tool_result messages for interrupted tools
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
        // Find all tool_use blocks in this assistant message
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

### 3.2 Interrupt Message Constants

```javascript
// Location: chunks.174.mjs:984-990

D66 = "[Request interrupted by user]"
P0 = "[Request interrupted by user for tool use]"
R96 = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."
h96 = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."
```

**When each is used**:
- `D66` - User pressed Escape during text response streaming
- `P0` - User pressed Escape during tool execution
- `R96` - User rejected the action via tool permission dialog
- `h96` - User rejected a specific tool use

### 3.3 Interrupt Detection During Compaction

The system detects interruption messages during compaction to track user interventions:

```javascript
// Location: chunks.167.mjs:844-850

if (L.includes("[Request interrupted by user")) {
    interruptCount++;
} else if (Array.isArray(L)) {
    for (let R of L) {
        if (R.type === "text" && "text" in R && R.text.includes("[Request interrupted by user")) {
            interruptCount++;
            break;
        }
    }
}
```

This count is used for telemetry and potentially for adjusting model behavior.

---

## 4. Interrupt on Submit (Steering During Tool Execution)

### 4.1 The `hasInterruptibleToolInProgress` Pattern

When a user submits new input while a tool is being executed, the system can interrupt the current turn:

```javascript
// Location: chunks.194.mjs:439-452

if (queryGuard.isActive || isLoading) {
    // Only interrupt for prompt/bash modes
    if (inputMode !== "prompt" && inputMode !== "bash") return;

    // Check if there's an interruptible tool in progress
    if (state.hasInterruptibleToolInProgress) {
        console.log(`[interrupt] Aborting current turn: streamMode=${state.streamMode}`);
        telemetry("tengu_cancel", {
            source: "interrupt_on_submit",
            streamMode: state.streamMode
        });
        state.abortController?.abort("interrupt");
    }

    // Enqueue the new command
    enqueueCommand({
        value: inputValue.trim(),
        mode: inputMode,
        pastedContents: pastedContents ? clipboardData : undefined,
        skipSlashCommands: skipSlash,
        uuid: messageUuid
    });

    // Clear input and reset state
    setInputValue("");
    setCursorOffset(0);
    setPastedContents({});
    resetHistory();
    onInputChange();
    return;
}
```

**Key insight**: When `hasInterruptibleToolInProgress` is true:
1. The abort is called with reason `"interrupt"`
2. The new input is immediately enqueued
3. The current turn ends gracefully
4. The queued message is processed after cleanup

---

## 5. Queue Processor Hook

### 5.1 `useQueuedCommandProcessor` (HVq)

This React hook automatically processes queued commands when loading completes:

```javascript
// ============================================
// useQueuedCommandProcessor - Process queued commands after loading
// Location: chunks.186.mjs:87-135
// ============================================

// READABLE (for understanding):
function useQueuedCommandProcessor({
    isLoading,
    queuedCommandsLength,
    executeQueuedInput,     // iA callback
    lastQueryCompletionTime
}) {
    const isExecutingRef = useRef(false);

    // Effect 1: Reset execution flag when loading starts
    useEffect(() => {
        if (isLoading) {
            isExecutingRef.current = false;
        }
    }, [isLoading]);

    // Effect 2: Process queue when loading completes
    useEffect(() => {
        if (isLoading) return;
        if (queuedCommandsLength === 0) return;
        if (isExecutingRef.current) return;

        // Fire queue processing
        isExecutingRef.current = true;
        processNextQueuedCommand()
            .finally(() => {
                isExecutingRef.current = false;
            });
    }, [isLoading, queuedCommandsLength, lastQueryCompletionTime]);
}

// Mapping: HVq→useQueuedCommandProcessor, O→isExecutingRef
```

**Why the `lastQueryCompletionTime` dependency?** React's shallow comparison wouldn't trigger the effect if `queuedCommandsLength` stays the same between renders. The timestamp ensures the effect re-fires after every query completion.

---

## 6. Abort Checkpoints in Query Generator

The abort signal is checked at strategic points during the query lifecycle:

### 6.1 Main Checkpoint (chunks.148.mjs:1152-1161)

```javascript
// ============================================
// Abort checkpoint after streaming completes
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
    // Drain remaining tool results if executor exists
    if (toolExecutor) {
        for await (const result of toolExecutor.getRemainingResults()) {
            if (result.message) yield result.message;
        }
    } else {
        // No executor - generate interrupt messages for pending tools
        yield* createInterruptToolResults(assistantMessages, "Interrupted by user");
    }

    // Add user-guidance message if not an intentional interrupt
    if (toolUseContext.abortController.signal.reason !== "interrupt") {
        yield createUserGuidanceMessage({ toolUse: false });
    }

    return { reason: "aborted_streaming" };
}

// Mapping: X→toolUseContext, s→toolExecutor, e→assistantMessages,
//   Sp8→createInterruptToolResults, Ug→createUserGuidanceMessage
```

**Two paths for tool drainage**:
1. **With toolExecutor**: Wait for in-flight tools to complete atomically
2. **Without toolExecutor**: Generate synthetic interrupt messages

---

## 6.2 User Guidance Message Generation

### `createUserGuidanceMessage` (Ug)

This function creates a user message containing the interrupt text:

```javascript
// ============================================
// createUserGuidanceMessage - Generate user guidance message
// Location: chunks.173.mjs:1425-1434
// ============================================

// ORIGINAL (for source lookup):
function Ug({
    toolUse: A = !1
}) {
    return p1({
        content: [{
            type: "text",
            text: A ? P0 : D66
        }]
    })
}

// READABLE (for understanding):
function createUserGuidanceMessage({ toolUse = false }) {
    return createUserMessage({
        content: [{
            type: "text",
            text: toolUse
                ? INTERRUPTED_FOR_TOOL_USE  // "[Request interrupted by user for tool use]"
                : INTERRUPTED_BY_USER_TEXT  // "[Request interrupted by user]"
        }]
    });
}

// Mapping: Ug→createUserGuidanceMessage, A→toolUse, p1→createUserMessage,
//   P0→INTERRUPTED_FOR_TOOL_USE, D66→INTERRUPTED_BY_USER_TEXT
```

**Why two different messages**:
- `D66` (`"[Request interrupted by user]"`) - Used when user presses Escape during text response streaming
- `P0` (`"[Request interrupted by user for tool use]"`) - Used when user presses Escape during tool execution

### Interrupt Message Constants

```javascript
// Location: chunks.174.mjs:984-990

D66 = "[Request interrupted by user]"
P0 = "[Request interrupted by user for tool use]"
R96 = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."
h96 = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."
```

**When each is used**:
- `D66` - User pressed Escape during text response streaming
- `P0` - User pressed Escape during tool execution
- `R96` - User rejected the action via tool permission dialog
- `h96` - User rejected a specific tool use

---

## 6.3 Vim Mode Integration

### `isVimMode` (X16)

This function checks if vim mode is enabled:

```javascript
// ============================================
// isVimMode - Check if vim mode is active
// Location: chunks.153.mjs:995-997
// ============================================

// ORIGINAL (for source lookup):
function X16() {
    return X1().editorMode === "vim"
}

// READABLE (for understanding):
function isVimMode() {
    return getEditorConfig().editorMode === "vim";
}

// Mapping: X16→isVimMode, X1→getEditorConfig
```

**Impact on cancel visibility**: In chunks.193.mjs:2621, the condition `!(X16() && $ === "INSERT")` ensures that when in vim INSERT mode, pressing Escape switches to NORMAL mode instead of triggering cancel.

### Vim Mode Cancel Behavior

| Vim Mode | Escape Key Behavior |
|----------|---------------------|
| `INSERT` | Switches to NORMAL mode (cancel NOT triggered) |
| `NORMAL` | Cancel can be triggered (if streaming) |
| `VISUAL` | Cancel can be triggered (if streaming) |

**Implementation in cancel visibility computation**:
```javascript
// Location: chunks.193.mjs:2621

// The condition blocks cancel when in Vim INSERT mode
p = _ !== "transcript" && !j && !z && !H && !J && !R && V !== "viewing-agent" &&
    !(X16() && $ === "INSERT") &&  // ← Vim INSERT mode blocks cancel
    (u || I || B)
```

---

## 6.4 Spinner Visibility Computation

### `showSpinner` (QV6)

The spinner visibility is computed from multiple state variables:

```javascript
// ============================================
// showSpinner - Compute spinner visibility
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
QV6 = (!j8 || j8.showSpinner === !0)
  && a8.length === 0
  && zA.length === 0
  && (Bq || YA || oi || qY4() > 0)
  && !X6
  && (!C2)
  && (!aZ || Wz);

// READABLE (for understanding):
const showSpinner =
    // Tool JSX allows spinner (default true)
    (toolJSX?.showSpinner !== false)
    // No tool permission dialogs
    && toolPermissionDialogs.length === 0
    // No tool confirmations
    && toolConfirmations.length === 0
    // Loading OR user input OR running tasks OR legacy queue
    && (isLoading || userInputOnProcessing || runningTasks || legacyQueueLength > 0)
    // No worker request pending
    && !workerRequestPending
    // Not waiting for MCP tool only
    && !allMcpToolsOnly
    // Not MCP-only OR has MCP tool results
    && (!allToolsAreMcpOnly || hasMcpToolResults);

// Mapping: QV6→showSpinner, j8→toolJSX, a8→toolPermissionDialogs,
//   zA→toolConfirmations, Bq→isLoading, YA→userInputOnProcessing,
//   oi→runningTasks, qY4→getLegacyQueueLength, X6→workerRequestPending,
//   C2→allMcpToolsOnly, aZ→allToolsAreMcpOnly, Wz→hasMcpToolResults
```

### Spinner Mode Display

The spinner displays different messages based on `streamMode`:

| streamMode | Display Text | Icon |
|------------|--------------|------|
| `"requesting"` | "Waiting for Claude..." | ⏳ |
| `"thinking"` | "Thinking..." | 🧠 |
| `"responding"` | "Claude is responding..." | 💬 |
| `"tool-input"` | "Generating tool arguments..." | ⚙️ |
| `"tool-use"` | "Running [tool_name]..." | 🔧 |

---

## 7. Stream Mode State Machine

The `streamMode` state drives the spinner display and determines cancel visibility:

```
┌──────────────────────────────────────────────────────────────┐
│                    STREAM MODE STATES                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐                                             │
│  │ requesting  │ ← Waiting for first token                  │
│  └──────┬──────┘                                             │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────┐     ┌─────────────┐                        │
│  │  thinking   │ ──→ │ responding  │ ← Text streaming       │
│  └─────────────┘     └──────┬──────┘                        │
│                             │                                │
│                             ▼                                │
│                      ┌─────────────┐                        │
│                      │ tool-input  │ ← Building tool args   │
│                      └──────┬──────┘                        │
│                             │                                │
│                             ▼                                │
│                      ┌─────────────┐                        │
│                      │  tool-use   │ ← Tool executing       │
│                      └──────┬──────┘                        │
│                             │                                │
│                             └──────→ back to "responding"   │
│                                      for multi-tool responses│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**streamMode → Spinner Message Mapping**:

| streamMode | Spinner Displays |
|------------|-----------------|
| `"requesting"` | "Waiting for Claude..." or initial state |
| `"thinking"` | Extended thinking indicator with thinking text |
| `"responding"` | "Claude is responding..." with token counter |
| `"tool-input"` | Tool name being generated |
| `"tool-use"` | "Running [tool name]..." |

---

## 8. Complete Steering Flow

### 8.1 Successful Steering Sequence (Escape During Stream)

```
1. LLM streams response → isLoading=true, abortSignal defined
2. User presses Escape
3. mt8.handleCancelPress() fires:
   a. telemetry("tengu_cancel", {source: "escape", streamMode})
   b. setToolUseConfirmQueue(() => [])
   c. onCancel() → abortController.abort()
4. LLM stream checks signal.aborted at next yield
5. Query generator checkpoint fires:
   a. toolExecutor.getRemainingResults() drains tools
   b. yield* createInterruptToolResults(msgs, "Interrupted by user")
6. isLoading → false
7. Conversation now contains: [user_msg, partial_assistant, tool_results_with_error]
8. User can type new direction
```

### 8.2 Kill Background Agents Sequence (Ctrl+F Double-Press)

```
1. Background agent running → hasRunningLocalAgents=true
2. User presses Ctrl+F (first press)
3. mt8.handleKillAgentsPress():
   a. lastKillPressTime.current = Date.now()
   b. addNotification({text: "Press ctrl+f again to stop background agents"})
4. User presses Ctrl+F within 3000ms (second press)
5. handleKillAgentsPress() detects double-press:
   a. killAllRunningAgents(tasks, setAppState)
   b. For each local_agent task:
      - killLocalAgent(taskId, setAppState)
      - Track description for notification
   c. enqueueCommand({mode: "task-notification", value: stoppedMessage})
   d. onAgentsKilled() callback
```

### 8.3 Timing Guarantees

| Action | Latency | Why |
|--------|---------|-----|
| Escape press → abort signal | ~0ms | JavaScript synchronous |
| Abort signal → fetch cancellation | ~0ms (local) / RTT (remote) | AbortController / WebSocket |
| LLM stream termination | 0-500ms | Depends on in-flight tokens and tool drainage |
| `isLoading=false` | After stream ends | React state update |
| Queued command processed | ~16-32ms | React useEffect scheduling |

---

## 9. Integration with System Reminders

### 9.1 Interrupt Detection in Conversation

The system detects interrupt messages using a regex pattern:

```javascript
// Location: chunks.175.mjs:139

hTq = new RegExp(`^(?:<local-command-stdout>|<session-start-hook>|<${vV}>|\\[Request interrupted by user[^\\]]*\\]|...)`);
```

This pattern matches:
- `<local-command-stdout>` - Local command output
- `<session-start-hook>` - Session start hook
- `<ide_opened_file>` - IDE opened file
- `[Request interrupted by user...]` - Interrupt messages

### 9.2 Impact on Auto-Compaction

During auto-compaction, interrupt messages are preserved:

1. They are tagged with `type: "tool_result"` and `is_error: true`
2. They participate in message retention decisions
3. The `[Request interrupted by user]` text is searchable for compaction analysis

---

## 10. Configuration Options

### 10.1 Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | Disable git guidance in steering context | Not set (git guidance enabled) |

### 10.2 Spinner Configuration

The spinner can be customized via settings:

```javascript
// Location: chunks.40.mjs:1428-1436

spinnerTipsEnabled: C.boolean().optional()
  .describe("Whether to show tips in the spinner"),

spinnerVerbs: C.object({
    mode: C.enum(["append", "replace"]),
    verbs: C.array(C.string())
}).optional()
  .describe('Customize spinner verbs. mode: "append" adds verbs to defaults, "replace" uses only your verbs.'),

spinnerTipsOverride: C.object({
    excludeDefault: C.boolean().optional(),
    tips: C.array(C.string())
}).optional()
  .describe("Override spinner tips")
```

---

## 11. Telemetry Events

| Event | Properties | When Fired |
|-------|------------|------------|
| `tengu_cancel` | `{source: "escape", streamMode}` | User presses Escape during stream |
| `tengu_cancel` | `{source: "kill_agents"}` | User confirms kill background agents |
| `tengu_cancel` | `{source: "interrupt_on_submit", streamMode}` | User submits while tool in progress |

---

## 12. Queue System Analysis

### 12.1 `isPromptQueueingEnabled` Queue Check

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

**Actual Behavior**: This function returns `true` when there are items in the legacy queue array `xY`. The queue pop branch in `handleCancelPress` IS reachable when queued commands exist.

**Related queue functions**:
```javascript
// Location: chunks.90.mjs:2808-2810
function qY4() {
    return xY.length  // getLegacyQueueLength
}

// Location: chunks.90.mjs:2816-2821
function _0(A) {
    xY.push({
        ...A,
        priority: A.priority ?? "next"
    }), Qt(), U36("enqueue", typeof A.value === "string" ? A.value : void 0)
}

// Location: chunks.90.mjs:2823+
function w0(A) {
    xY.push({
        // enqueueTaskNotification with task-notification mode
```

**What this means**:
- The `handleCancelPress` function CAN reach the queue pop branch when `d36()` returns true
- If `popCommandFromQueue` exists, it will be called to merge queue into input box
- This provides a way to recall queued commands without sending them

### 12.2 Legacy Queue System Architecture

The in-memory queue (`xY` array) works alongside React state-based `queuedCommands`:

```
┌────────────────────────────────────────────────────────────────────┐
│                    DUAL QUEUE ARCHITECTURE                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  LEGACY QUEUE (xY array)          REACT QUEUE (queuedCommands)    │
│  ┌──────────────────────┐         ┌──────────────────────┐        │
│  │ chunks.90.mjs        │         │ React State          │        │
│  │ • d36() checks       │         │ • useQueuedCommands  │        │
│  │ • _0() enqueues      │         │ • UF() hook          │        │
│  │ • w0() task notify   │         │ • React re-render    │        │
│  └──────────────────────┘         └──────────────────────┘        │
│           │                                  │                    │
│           └────────────┬─────────────────────┘                    │
│                        │                                          │
│                        ▼                                          │
│              ┌──────────────────────┐                             │
│              │ cancelHandlerComponent│                             │
│              │ checks BOTH systems   │                             │
│              └──────────────────────┘                             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Primary use in v2.1.76**: The React state-based `queuedCommands` is the primary system, while legacy queue (`xY`) provides backward compatibility and is checked by `d36()`.

---

## 13. Complete Abort Checkpoint Analysis

The abort signal (`abortController.signal.aborted`) is checked at **11 strategic points** during the query lifecycle in chunks.148.mjs. Each checkpoint serves a specific purpose in the interrupt flow.

### 13.1 Abort Checkpoint Locations

```javascript
// ============================================
// CHECKPOINT 1: Tool Executor Abort Reason Check
// Location: chunks.148.mjs:110-114
// ============================================

// ORIGINAL (for source lookup):
if (this.toolUseContext.abortController.signal.aborted) {
    if (this.toolUseContext.abortController.signal.reason === "interrupt")
        return this.getToolInterruptBehavior(A) === "cancel" ? "user_interrupted" : null;
    return "user_interrupted"
}

// READABLE (for understanding):
if (abortController.signal.aborted) {
    // If reason is "interrupt", check tool's interrupt behavior
    if (abortController.signal.reason === "interrupt") {
        return tool.interruptBehavior === "cancel" ? "user_interrupted" : null;
    }
    return "user_interrupted";
}

// Mapping: A→tool, this.toolUseContext.abortController→abortController
```

**Key Insight**: This checkpoint allows tools with `interruptBehavior: "cancel"` to be silently cancelled during intentional interrupts (user submitted new input).

```javascript
// ============================================
// CHECKPOINT 2: Sibling Tool Abort Propagation
// Location: chunks.148.mjs:150
// ============================================

// ORIGINAL (for source lookup):
if (w.signal.reason !== "sibling_error" && !this.toolUseContext.abortController.signal.aborted && !this.discarded)
    this.toolUseContext.abortController.abort(w.signal.reason)

// READABLE (for understanding):
// When a sibling tool aborts, propagate the abort reason to parent controller
if (siblingSignal.reason !== "sibling_error" &&
    !parentAbortController.signal.aborted &&
    !this.discarded) {
    parentAbortController.abort(siblingSignal.reason);
}

// Mapping: w→siblingAbortController, this.toolUseContext.abortController→parentAbortController
```

```javascript
// ============================================
// CHECKPOINT 3: Pre-Stop Hooks Cancellation
// Location: chunks.148.mjs:686-694
// ============================================

// ORIGINAL (for source lookup):
if (_.abortController.signal.aborted) return d("tengu_pre_stop_hooks_cancelled", {
    queryChainId: _.queryTracking?.chainId,
    queryDepth: _.queryTracking?.depth
}), yield Ug({ toolUse: !1 }), {
    blockingErrors: [],
    preventContinuation: !0
}

// READABLE (for understanding):
if (abortController.signal.aborted) {
    telemetry("tengu_pre_stop_hooks_cancelled", {
        queryChainId: queryTracking?.chainId,
        queryDepth: queryTracking?.depth
    });
    yield createUserGuidanceMessage({ toolUse: false });
    return { blockingErrors: [], preventContinuation: true };
}

// Mapping: _→toolUseContext, d→telemetry, Ug→createUserGuidanceMessage
```

```javascript
// ============================================
// CHECKPOINT 4: Main Abort Checkpoint (Post-Streaming)
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

**Key Insight**: This is the **primary abort checkpoint**. It handles tool drainage and message generation after streaming stops.

```javascript
// ============================================
// CHECKPOINT 5: Post-Tool Abort Checkpoint
// Location: chunks.148.mjs:1315-1327
// ============================================

// ORIGINAL (for source lookup):
if (X.abortController.signal.aborted) {
    if (X.abortController.signal.reason !== "interrupt")
        yield Ug({ toolUse: !0 });
    let D6 = V + 1;
    if ($ && D6 > $) yield f4({
        type: "max_turns_reached",
        maxTurns: $,
        turnCount: D6
    });
    return { reason: "aborted_tools" }
}

// READABLE (for understanding):
if (abortController.signal.aborted) {
    // Add user guidance if not intentional interrupt
    if (abortController.signal.reason !== "interrupt") {
        yield createUserGuidanceMessage({ toolUse: true });
    }

    // Check for max turns reached
    const nextTurn = currentTurn + 1;
    if (maxTurns && nextTurn > maxTurns) {
        yield createMaxTurnsMessage({
            type: "max_turns_reached",
            maxTurns: maxTurns,
            turnCount: nextTurn
        });
    }

    return { reason: "aborted_tools" };
}

// Mapping: X→toolUseContext, V→currentTurn, $→maxTurns,
//   Ug→createUserGuidanceMessage, f4→createMaxTurnsMessage
```

### 13.2 Abort Checkpoint Summary Table

| Line | Condition | Behavior | Priority |
|------|-----------|----------|----------|
| 110-114 | toolExecutor.signal.aborted | Check abort reason, return "user_interrupted" | High |
| 150 | sibling abort | Propagate abort to tool controller | Medium |
| 686-694 | abortController.signal.aborted | Pre-stop hooks cancellation | High |
| 743-746 | abortController.signal.aborted | Hook processing abort | Medium |
| 769-772 | abortController.signal.aborted | MCP processing abort | Medium |
| 1107-1110 | !signal.aborted | Add tools to executor | Low |
| 1117-1118 | Fallback triggered | yield* Sp8(e, "Model fallback triggered") | Medium |
| **1152-1161** | signal.aborted (main) | Drain tools or yield Sp8(), yield Ug() | **Critical** |
| **1315-1327** | signal.aborted (post-tools) | Yield Ug() with toolUse: true | **Critical** |
| 2201 | signal.aborted | Compaction suggestion abort | Low |
| 2214 | signal.aborted | Compaction suggestion abort | Low |

---

## 14. Interrupt Reason Handling

### 14.1 Signal Reason Values

The `abortController.signal.reason` determines message generation behavior:

| Reason | Value | When Used | Behavior |
|--------|-------|-----------|----------|
| `"interrupt"` | Intentional interrupt | User submits new input while tool running | Skip user guidance message |
| `"sibling_error"` | Sibling tool failed | Parallel tool execution error | Don't propagate to parent |
| `undefined` | Default abort | User presses Escape | Add user guidance message |
| Other | Custom abort | Programmatic abort | Add user guidance message |

### 14.2 Interrupt Reason Decision Tree

```
┌────────────────────────────────────────────────────────────────────┐
│              INTERRUPT REASON DECISION TREE                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  signal.aborted === true                                           │
│         │                                                          │
│         ├─ signal.reason === "interrupt"                           │
│         │      │                                                   │
│         │      ├─ tool.interruptBehavior === "cancel"             │
│         │      │      └─ Return "user_interrupted" (silent cancel)│
│         │      │                                                   │
│         │      └─ tool.interruptBehavior !== "cancel"             │
│         │             └─ Return null (continue tool)              │
│         │                                                          │
│         ├─ signal.reason === "sibling_error"                       │
│         │      └─ Don't propagate abort (isolated failure)        │
│         │                                                          │
│         └─ signal.reason === undefined OR other                    │
│                │                                                   │
│                ├─ toolExecutor exists?                             │
│                │      ├─ YES → drain tools via getRemainingResults│
│                │      └─ NO → yield* Sp8() (synthetic messages)   │
│                │                                                   │
│                └─ Yield Ug({ toolUse: true/false })               │
│                   ("[Request interrupted by user...]")             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 14.3 Why Skip Guidance for "interrupt"?

When the user intentionally interrupts-on-submit (typing new input while a tool runs), the guidance message is unnecessary because:

1. **User already provided new direction**: The queued message is the new guidance
2. **Conversation flows naturally**: The next turn will start with user's new input
3. **Avoids redundant context**: No need for "[Request interrupted by user]" text

```javascript
// Example: Interrupt-on-submit flow
// 1. User sees tool running (e.g., Read file)
// 2. User types new input: "Use OAuth instead"
// 3. System aborts with reason="interrupt"
// 4. Tool drains, but NO "[Request interrupted by user]" message added
// 5. User's "Use OAuth instead" is immediately processed

// Contrast: Escape press flow
// 1. User presses Escape
// 2. System aborts with reason=undefined
// 3. Tool drains, "[Request interrupted by user]" message IS added
// 4. User can then type new input
```

---

## 15. Abort Controller State Management

### 15.1 State Lifecycle

The abort controller follows a specific lifecycle:

```
┌────────────────────────────────────────────────────────────────────┐
│              ABORT CONTROLLER LIFECYCLE                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  IDLE STATE                                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  abortController: undefined                                  │  │
│  │  isLoading: false                                            │  │
│  │  streamMode: undefined                                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ onQuery() called                                         │
│         ▼                                                          │
│  QUERY START                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  abortController = new AbortController()                     │  │
│  │  isLoading: true                                             │  │
│  │  streamMode: "requesting"                                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ LLM streams response                                    │
│         ▼                                                          │
│  STREAMING STATE                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  abortController: defined, !aborted                          │  │
│  │  streamMode: "thinking" → "responding" → "tool-use"          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ User presses Escape OR submits new input               │
│         ▼                                                          │
│  ABORT STATE                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  abortController.abort(reason)                               │  │
│  │  signal.aborted: true                                        │  │
│  │  signal.reason: "interrupt" | undefined                      │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ Query completes with aborted_streaming                  │
│         ▼                                                          │
│  COMPLETE STATE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  isLoading: false                                            │  │
│  │  abortController: undefined (cleaned up)                     │  │
│  │  streamMode: undefined                                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 15.2 State Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `abortController` (O3) | AbortController \| undefined | Controls stream termination |
| `streamMode` (O7) | string \| undefined | Current streaming phase |
| `isLoading` | boolean | UI loading indicator |
| `isQueryRunningRef` (I6) | React Ref<boolean> | Synchronous query state check |

---

## 16. Clear Agent Notifications Function

### `clearAgentNotifications` (_Y4)

This function clears the legacy queue array:

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
    legacyQueueArray.length = 0;  // Clear array
    notifySubscribers();          // Notify React of change
}

// Mapping: _Y4→clearAgentNotifications, xY→legacyQueueArray, Qt→notifySubscribers
```

**When called**: This function is called in `handleKillAgentsPress` after killing all running agents to clear any pending task notifications from the queue.

---

## 17. Enqueue Command Function

### `enqueueCommand` (w0)

This function adds a command to the task notification queue:

```javascript
// ============================================
// enqueueCommand - Add command to task notification queue
// Location: chunks.90.mjs:2816-2821 (called via w0 wrapper)
// ============================================

// ORIGINAL (for source lookup):
function _0(A) {
    xY.push({
        ...A,
        priority: A.priority ?? "next"
    }), Qt(), U36("enqueue", typeof A.value === "string" ? A.value : void 0)
}

// READABLE (for understanding):
function enqueueCommandInternal(command) {
    legacyQueueArray.push({
        ...command,
        priority: command.priority ?? "next"  // Default priority
    });
    notifySubscribers();
    logTelemetry("enqueue", typeof command.value === "string" ? command.value : undefined);
}

// Mapping: _0→enqueueCommandInternal, A→command, xY→legacyQueueArray,
//   Qt→notifySubscribers, U36→logTelemetry
```

**Usage in Steering** (chunks.193.mjs:2642):
```javascript
// After killing agents, notify user
w0({
    value: K6,  // "Background agent X was stopped by the user."
    mode: "task-notification"
})
```

**When called**: Used to add task notification messages that appear in the conversation after killing background agents.

---

## 18. Notifications Hook

### `useNotifications` (o4)

This hook provides access to the notification system for showing/dismissing UI notifications:

```javascript
// ============================================
// useNotifications - Hook for notification management
// Location: chunks.193.mjs (destructured from o4())
// ============================================

// Usage pattern in cancelHandlerComponent:
const { addNotification, removeNotification } = o4();

// addNotification - Show a notification
addNotification({
    key: "kill-agents-confirm",
    text: "Press ctrl+f again to stop background agents",
    priority: "immediate",  // Shows immediately, overrides others
    timeoutMs: 3000         // Auto-dismiss after 3 seconds
});

// removeNotification - Dismiss a notification by key
removeNotification("kill-agents-confirm");

// Mapping: o4→useNotifications, G→addNotification, f→removeNotification
```

**Notification Priorities**:
| Priority | Behavior |
|----------|----------|
| `"immediate"` | Shows immediately, overrides others, auto-dismisses |
| `"normal"` | Queued normally, standard dismissal |
| `"low"` | Lowest priority, may be delayed |

---

## 19. Abort Reason Handling

### The `"interrupt"` Reason

When the user submits new input while a tool is running, the system calls `abort("interrupt")`:

```javascript
// ============================================
// abort("interrupt") - Intentional interrupt-on-submit
// Location: chunks.194.mjs:444
// ============================================

// ORIGINAL (for source lookup):
state.abortController?.abort("interrupt");

// READABLE (for understanding):
// This is called when:
// 1. hasInterruptibleToolInProgress is true
// 2. User submits new input during tool execution
// 3. The abort is intentional (user wants to steer)
abortController.abort("interrupt");  // Sets signal.reason = "interrupt"
```

### Reason-Based Behavior

The `signal.reason` determines post-abort behavior:

```javascript
// Location: chunks.148.mjs:1156-1157

if (abortController.signal.reason !== "interrupt") {
    yield createUserGuidanceMessage({ toolUse: false });
}
```

| Reason | Source | User Guidance Message? | Behavior |
|--------|--------|------------------------|----------|
| `"interrupt"` | chunks.194.mjs:444 | **No** | Silent drain, process queued input |
| `undefined` | Escape press | **Yes** | Add "[Request interrupted by user]" |
| `"sibling_error"` | Parallel tool error | No | Isolated failure, don't propagate |

**Why skip guidance for `"interrupt"`?**: When user intentionally interrupts-on-submit (typing new input while tool runs), the guidance message is unnecessary since the user already provided new direction.

---

## 20. Spinner Visibility Computation

### `showSpinner` (QV6)

The spinner visibility is computed from multiple state variables:

```javascript
// ============================================
// showSpinner - Compute spinner visibility
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
QV6 = (!j8 || j8.showSpinner === !0) && a8.length === 0 && zA.length === 0 && (Bq || YA || oi || qY4() > 0) && !X6 && !C2 && (!aZ || Wz),

// READABLE (for understanding):
const showSpinner =
    (!localCommand || localCommand.showSpinner === true) &&  // Not hidden by local command
    toolConfirmQueue.length === 0 &&                          // No tool confirm dialogs
    promptQueue.length === 0 &&                               // No prompt dialogs
    (isLoading || hasQueuedCommands || hasRunningAgents || getQueuedCount() > 0) &&  // Something active
    !activeToolName &&                                        // No tool in progress display
    !isInCompactMode &&                                       // Not in compact mode
    (!isRemoteMode || isRemoteConnected);                     // Remote mode check

// Mapping: QV6→showSpinner, j8→localCommand, a8→toolConfirmQueue,
//   zA→promptQueue, Bq→isLoading, YA→hasQueuedCommands, oi→hasRunningAgents
```

**Spinner States**:
- Shows when there's active streaming, queued commands, or running agents
- Hidden when tool confirm dialogs or prompts are visible
- Hidden in compact mode
- In remote mode, only shows when connected