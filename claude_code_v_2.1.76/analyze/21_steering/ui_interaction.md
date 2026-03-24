# Steering UI Interaction - Detailed Analysis

## Module Overview

This document provides a detailed analysis of the user interface interactions for the steering mechanism in Claude Code v2.1.76, including keybinding handling, visual feedback, and state transitions.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)

Key functions in this document:
- `cancelHandlerComponent` (mt8) - Main cancel handler React component
- `useKeybindingAction` (D8) - Keybinding registration hook
- `showSpinner` (QV6) - Spinner visibility computation
- `streamMode` (O7) - Stream state machine

---

## 1. Cancel Indicator UI

### 1.1 "Esc to Cancel" Text Display

The cancel indicator is rendered in the footer area when conditions are met:

```javascript
// ============================================
// Cancel indicator rendering - "Esc to cancel" text
// Location: chunks.196.mjs:2361-2370
// ============================================

// ORIGINAL (for source lookup):
if (q[17] !== V) L = QE.default.createElement(m, {
    marginTop: 1
}, QE.default.createElement(T, {
    dimColor: !0
}, "Press ", QE.default.createElement(T, {
    bold: !0
}, "Esc"), " to cancel")), q[18] = L;

// READABLE (for understanding):
if (showCancelIndicator) {
    return (
        <Box marginTop={1}>
            <Text dimColor>
                Press <Text bold>Esc</Text> to cancel
            </Text>
        </Box>
    );
}

// Mapping: V→showCancelIndicator, L→cancelIndicatorElement, T→Text, m→Box, q→memoCache
```

### 1.1.1 Verified "Esc to Cancel" Rendering Patterns (Source Code Cross-Validation)

Multiple UI contexts display "Esc to cancel" with different behaviors. These patterns were verified in source code:

**Pattern 1: Tool Permission Dialog (chunks.180.mjs:770)**
```javascript
// ============================================
// Tool permission dialog cancel indicator
// Location: chunks.180.mjs:770
// ============================================

// ORIGINAL (for source lookup):
J6.pending ? AT.default.createElement(AT.default.Fragment, null, "Press ", J6.keyName, " again to exit") : AT.default.createElement(AT.default.Fragment, null, "Enter to confirm · Esc to cancel")

// READABLE (for understanding):
{keyState.pending ? (
    <>Press {keyState.keyName} again to exit</>
) : (
    <>Enter to confirm · Esc to cancel</>
)}

// Mapping: J6→keyState, AT→React
```

**Pattern 2: Configuration Dialog (chunks.135.mjs:582)**
```javascript
// ============================================
// Configuration dialog with pending state
// Location: chunks.135.mjs:582
// ============================================

// ORIGINAL (for source lookup):
j.pending ? q5.default.createElement(q5.default.Fragment, null, "Press ", j.keyName, " again to exit") : q5.default.createElement(q5.default.Fragment, null, "Esc to cancel")

// READABLE (for understanding):
{pendingState.pending ? (
    <>Press {pendingState.keyName} again to exit</>
) : (
    <>Esc to cancel</>
)}

// Mapping: j→pendingState, q5→React
```

**Pattern 3: Message Selector (chunks.163.mjs:382)**
```javascript
// ============================================
// Message selector with navigation hints
// Location: chunks.163.mjs:382
// ============================================

// ORIGINAL (for source lookup):
U.pending ? uA.createElement(uA.Fragment, null, "Press ", U.keyName, " again to exit") : uA.createElement(uA.Fragment, null, "Press ↑↓ to navigate · Enter to select · Type to search · Esc to cancel")

// READABLE (for understanding):
{keyState.pending ? (
    <>Press {keyState.keyName} again to exit</>
) : (
    <>Press ↑↓ to navigate · Enter to select · Type to search · Esc to cancel</>
)}

// Mapping: U→keyState, uA→React
```

**Pattern 4: Multi-Option Selector (chunks.163.mjs:739)**
```javascript
// ============================================
// Multi-option selector with toggle hint
// Location: chunks.163.mjs:739
// ============================================

// ORIGINAL (for source lookup):
(B) => B.pending ? H3.createElement(T, null, "Press ", B.keyName, " again to exit") : M ? H3.createElement(T, null, "Esc to cancel") : H3.createElement(T, null, "Tab to toggle · Enter to confirm · Esc to cancel")

// READABLE (for understanding):
{(keyState) => keyState.pending ? (
    <Text>Press {keyState.keyName} again to exit</Text>
) : hasSingleOption ? (
    <Text>Esc to cancel</Text>
) : (
    <Text>Tab to toggle · Enter to confirm · Esc to cancel</Text>
)}

// Mapping: B→keyState, H3→React, T→Text, M→hasSingleOption
```

**Pattern 5: Skill Selector (chunks.165.mjs:370)**
```javascript
// ============================================
// Skill selector navigation instructions
// Location: chunks.165.mjs:370
// ============================================

// ORIGINAL (for source lookup):
m4.createElement(GN6, { instructions: "Press ↑↓ to navigate, Enter to select, Esc to cancel" })

// READABLE (for understanding):
<NavigationInstructions instructions="Press ↑↓ to navigate, Enter to select, Esc to cancel" />

// Mapping: m4→React, GN6→NavigationInstructions
```

**Design Pattern**: The UI distinguishes between:
1. **First press pending**: Shows "Press [key] again to exit" (requires confirmation)
2. **Normal cancel**: Shows "Esc to cancel" (single press action)

### 1.2 Cancel Indicator Visibility Conditions

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

// Mapping: R→isVimInsertMode, u→isStreaming, I→hasQueuedCommands, g→isNonPromptModeWithoutInput,
//   B→hasRunningAgents, p→isActive, Q→showCancelText, U→isGloballyActive,
//   Qf4→isVimMode, X16→isVimMode, $→vimMode, w→abortSignal, Z→queuedCommandsLength,
//   M→inputMode, D→inputValue, _→screen, j→isSearchingHistory, z→isMessageSelectorVisible,
//   H→isLocalJSXCommand, J→isHelpOpen, V→viewSelectionMode
```

### 1.3 Visibility State Machine Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│              CANCEL INDICATOR VISIBILITY STATE MACHINE              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  CONDITIONS THAT BLOCK CANCEL:                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  screen === "transcript"        →  Read-only mode          │   │
│  │  isSearchingHistory === true    →  Escape dismisses search │   │
│  │  isMessageSelectorVisible       →  Escape closes selector  │   │
│  │  isLocalJSXCommand              →  JSX captures Escape     │   │
│  │  isHelpOpen                     →  Escape closes help      │   │
│  │  vimMode === "INSERT"           →  Escape switches mode    │   │
│  │  viewSelectionMode === "viewing-agent" → Escape exits view │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  CONDITIONS THAT ENABLE CANCEL:                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  isStreaming === true           →  LLM is responding       │   │
│  │  hasQueuedCommands === true     →  Messages in queue       │   │
│  │  hasRunningAgents === true      →  Background agents       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  FINAL COMPUTATION:                                               │
│  showCancelText = NOT(blockingCondition) AND enablingCondition   │
│                   AND NOT(nonPromptModeWithoutInput)              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Keybinding Context System

### 2.1 Keybinding Contexts

Claude Code uses a context system to determine which keybindings are active:

| Context | Description | Active When |
|---------|-------------|-------------|
| `Global` | Always active | Process is running |
| `Chat` | Chat input focused | User is in the main chat interface |
| `Dialog` | Modal dialog open | Tool permission, help, or other modal |

### 2.2 Keybinding Registration

```javascript
// ============================================
// useKeybindingAction - Register a keybinding handler
// Location: chunks.65.mjs:905-943
// ============================================

// ORIGINAL (for source lookup):
function D8(A, q, K = {}) {
    let {
        context: Y = "Global",
        isActive: z = !0
    } = K, _ = Wv();
    mX6.useEffect(() => {
        if (!_ || !z) return;
        return _.registerHandler({
            action: A,
            context: Y,
            handler: q
        })
    }, [A, Y, q, _, z]);
    let w = mX6.useCallback((O, $, H) => {
        if (!_) return;
        let j = [..._.activeContexts, Y, "Global"],
            J = [...new Set(j)],
            M = _.resolve(O, $, J);
        switch (M.type) {
            case "match":
                if (_.setPendingChord(null), M.action === A) q(), H.stopImmediatePropagation();
                break;
            case "chord_started":
                _.setPendingChord(M.pending), H.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                _.setPendingChord(null);
                break;
            case "unbound":
                _.setPendingChord(null), H.stopImmediatePropagation();
                break;
            case "none":
                break
        }
    }, [A, Y, q, _]);
    jA(w, { isActive: z })
}

// READABLE (for understanding):
function useKeybindingAction(actionId, handler, options = {}) {
    const { context = "Global", isActive = true } = options;
    const keybindingRegistry = useKeybindingRegistry();

    // Effect: Register handler with registry
    useEffect(() => {
        if (!keybindingRegistry || !isActive) return;
        return keybindingRegistry.registerHandler({
            action: actionId,
            context: context,
            handler: handler
        });
    }, [actionId, context, handler, keybindingRegistry, isActive]);

    // Callback: Handle key events
    const handleKeyEvent = useCallback((keyEvent, keyName, nativeEvent) => {
        if (!keybindingRegistry) return;

        // Build context stack: active contexts + this context + Global
        const contextStack = [...keybindingRegistry.activeContexts, context, "Global"];
        const uniqueContexts = [...new Set(contextStack)];

        // Resolve the key event to an action
        const result = keybindingRegistry.resolve(keyEvent, keyName, uniqueContexts);

        switch (result.type) {
            case "match":
                keybindingRegistry.setPendingChord(null);
                if (result.action === actionId) {
                    handler();
                    nativeEvent.stopImmediatePropagation();
                }
                break;
            case "chord_started":
                // User started a chord sequence (e.g., pressed first key of "g g")
                keybindingRegistry.setPendingChord(result.pending);
                nativeEvent.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                // Chord sequence cancelled
                keybindingRegistry.setPendingChord(null);
                break;
            case "unbound":
                // Key not bound to any action
                keybindingRegistry.setPendingChord(null);
                nativeEvent.stopImmediatePropagation();
                break;
            case "none":
                // No action, let event propagate
                break;
        }
    }, [actionId, context, handler, keybindingRegistry]);

    // Register the event listener
    useKeyEvent(handleKeyEvent, { isActive });
}

// Mapping: D8→useKeybindingAction, A→actionId, q→handler, K→options,
//   Y→context, z→isActive, _→keybindingRegistry, Wv→useKeybindingRegistry,
//   mX6→React, jA→useKeyEvent
```

### 2.3 Keybinding Resolution Algorithm

The resolution algorithm determines which action to trigger for a given key event:

```
┌────────────────────────────────────────────────────────────────────┐
│              KEYBINDING RESOLUTION ALGORITHM                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. BUILD CONTEXT STACK                                            │
│     contextStack = [...activeContexts, context, "Global"]          │
│     uniqueContexts = [...new Set(contextStack)]  // Dedupe         │
│                                                                    │
│  2. RESOLVE KEY EVENT                                              │
│     For each context in uniqueContexts (in order):                 │
│       - Check if key matches any binding in this context          │
│       - If match found AND isActive: return "match"               │
│       - If chord started: return "chord_started"                  │
│       - If chord cancelled: return "chord_cancelled"              │
│                                                                    │
│  3. FALLBACK                                                        │
│     If no match in any context: return "unbound"                  │
│                                                                    │
│  Context Priority (highest to lowest):                             │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  1. Dialog (if modal open)                                   │  │
│  │  2. Chat (if input focused)                                  │  │
│  │  3. Global (always)                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 2.4 Keybinding Resolution Order

When a key is pressed:
1. Check if any modal dialog has focus → Dialog context keybindings
2. Check if chat input has focus → Chat context keybindings
3. Fall back to Global context keybindings
4. If action is `isActive: false`, skip to next context

---

## 3. Spinner Integration

### 3.1 Spinner Visibility Computation

```javascript
// ============================================
// showSpinner computation
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
QV6 = (!j8 || j8.showSpinner === true)
  && a8.length === 0
  && zA.length === 0
  && (Bq || YA || oi || qY4() > 0)
  && !X6
  && (!aZ || Wz);

// READABLE (for understanding):
const showSpinner =
    // Tool JSX allows spinner (default true)
    (toolJSX?.showSpinner !== false)
    // No tool permission dialogs
    && toolPermissionDialogs.length === 0
    // No tool confirmation dialogs
    && toolConfirmations.length === 0
    // Loading OR user input OR running tasks OR legacy queue
    && (isLoading || userInputOnProcessing || runningTasks || legacyQueueLength > 0)
    // No worker request pending
    && !workerRequestPending
    // Not MCP-only OR has MCP tool results
    && (!allToolsAreMcpOnly || hasMcpToolResults);

// Mapping: QV6→showSpinner, j8→toolJSX, a8→toolPermissionDialogs,
//   zA→toolConfirmations, Bq→isLoading, YA→userInputOnProcessing
```

### 3.2 Spinner Mode Display

The spinner displays different messages based on `streamMode`:

| streamMode | Display Text | Icon |
|------------|--------------|------|
| `"requesting"` | "Waiting for Claude..." | ⏳ |
| `"thinking"` | "Thinking..." | 🧠 |
| `"responding"` | "Claude is responding..." | 💬 |
| `"tool-input"` | "Generating tool arguments..." | ⚙️ |
| `"tool-use"` | "Running [tool_name]..." | 🔧 |

### 3.3 Spinner Tips System

```javascript
// Location: chunks.40.mjs:1428-1436

spinnerTipsEnabled: boolean  // Show tips in spinner
spinnerVerbs: {
    mode: "append" | "replace",
    verbs: string[]  // e.g., ["Analyzing", "Processing", "Computing"]
}
spinnerTipsOverride: {
    excludeDefault: boolean,  // Only show custom tips
    tips: string[]
}
```

**Example configuration**:
```json
{
    "spinnerTipsEnabled": true,
    "spinnerVerbs": {
        "mode": "append",
        "verbs": ["Compiling", "Building", "Testing"]
    },
    "spinnerTipsOverride": {
        "tips": ["Press Esc to interrupt", "Ctrl+F to stop background agents"]
    }
}
```

---

## 4. Background Agent Kill Confirmation UI

### 4.1 Kill Agents Notification Flow

When user presses Ctrl+F with running background agents:

```
FIRST PRESS (within 3000ms timeout):
┌────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Press ctrl+f again to stop background agents        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  [Background Agent 1: Running...]                         │
│  [Background Agent 2: Running...]                         │
└────────────────────────────────────────────────────────────┘

SECOND PRESS (within 3000ms):
┌────────────────────────────────────────────────────────────┐
│  Background agent "Agent 1" was stopped by the user.       │
│  Background agent "Agent 2" was stopped by the user.       │
│                                                            │
│  [All background agents terminated]                        │
└────────────────────────────────────────────────────────────┘

TIMEOUT (no second press within 3000ms):
┌────────────────────────────────────────────────────────────┐
│  [Notification disappears]                                 │
│  [Agents continue running]                                 │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Notification Implementation

```javascript
// ============================================
// Kill agents notification
// Location: chunks.193.mjs:2650-2656
// ============================================

// ORIGINAL (for source lookup):
v.current = e, G({
    key: "kill-agents-confirm",
    text: "Press ctrl+f again to stop background agents",
    priority: "immediate",
    timeoutMs: Buq
})

// READABLE (for understanding):
lastKillPressTime.current = now;
addNotification({
    key: "kill-agents-confirm",
    text: "Press ctrl+f again to stop background agents",
    priority: "immediate",  // Shows immediately, overrides other notifications
    timeoutMs: 3000         // Disappears after 3 seconds
});

// Mapping: v→lastKillPressTime, G→addNotification, Buq→KILL_AGENTS_CONFIRM_TIMEOUT
```

### 4.3 Kill Confirmation Message

```javascript
// ============================================
// Kill confirmation message generation
// Location: chunks.193.mjs:2640-2646
// ============================================

// READABLE (for understanding):
if (killedAgents.length > 0) {
    const message = killedAgents.length === 1
        ? `Background agent "${killedAgents[0]}" was stopped by the user.`
        : `${killedAgents.length} background agents were stopped by the user: ${
            killedAgents.map(a => `"${a}"`).join(", ")
        }.`;

    enqueueCommand({
        value: message,
        mode: "task-notification"
    });
}
```

---

## 5. Vim Mode Integration

### 5.1 Vim Mode Effect on Cancel

Vim mode affects cancel behavior:

| Vim Mode | Escape Key Behavior |
|----------|---------------------|
| `INSERT` | Triggers cancel (if streaming) |
| `NORMAL` | Does NOT trigger cancel (used for navigation) |
| `VISUAL` | DOES NOT trigger cancel (used for selection) |

### 5.2 Vim Mode Check Implementation

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

### 5.3 Vim INSERT Mode Check in Cancel Visibility

```javascript
// Location: chunks.193.mjs:2621

// The condition in the isActive computation:
!(X16() && $ === "INSERT")  // NOT (in vim mode AND INSERT mode)

// Full condition breakdown:
// If NOT in Vim mode (!X16()): Cancel is available
// If in Vim mode but NOT INSERT: Cancel is blocked
// If in Vim mode AND INSERT: Cancel is available
```

**Logic**:
- If NOT in Vim mode (`!X16()`): Cancel is available
- If in Vim mode but NOT INSERT: Cancel is blocked (Escape used for navigation)
- If in Vim mode AND INSERT: Cancel is available (Escape switches to NORMAL first, then could cancel)

### 5.4 Vim Mode State Flow

```
┌────────────────────────────────────────────────────────────────────┐
│              VIM MODE + CANCEL INTERACTION                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  VIM MODE: OFF                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Escape → Cancel (if streaming)                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  VIM MODE: ON                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  INSERT mode:                                                │ │
│  │    Escape → Switch to NORMAL mode (no cancel)                │ │
│  │    Second Escape → Cancel (if streaming)                     │ │
│  │                                                              │ │
│  │  NORMAL mode:                                                │ │
│  │    Escape → Navigation (no cancel)                           │ │
│  │    Cancel NOT available                                      │ │
│  │                                                              │ │
│  │  VISUAL mode:                                                │ │
│  │    Escape → Exit visual mode (no cancel)                     │ │
│  │    Cancel NOT available                                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 6. Tool Permission Dialog Interaction

### 6.1 Escape During Tool Permission

When a tool permission dialog is visible and user presses Escape:

```
STATE: Tool permission dialog showing
ACTION: User presses Escape
RESULT:
  1. Dialog is dismissed
  2. Tool is denied (rejected)
  3. LLM stream CONTINUES (not aborted)
  4. Claude sees tool denial and responds accordingly
```

### 6.2 Two-Escape Pattern

To fully stop Claude during a tool permission:

```
FIRST ESCAPE: Dismiss tool permission dialog
  → Dialog closes
  → Tool is denied
  → Claude generates response to denial

SECOND ESCAPE: Cancel the stream
  → LLM stream is aborted
  → "Interrupted by user" added
```

---

## 7. Message Selector Interaction

### 7.1 Escape During Message Selector

When the message selector (for selecting/editing previous messages) is visible:

```
STATE: Message selector showing
ACTION: User presses Escape
RESULT:
  1. Message selector closes
  2. No cancel action triggered
  3. User returns to normal chat input
```

### 7.2 Queue Pop Behavior

When Escape is pressed with queued commands but no active stream:

```javascript
// Location: chunks.193.mjs:2614-2619

if (d36()) {  // isPromptQueueingEnabled - always false in v2.1.76
    if (popCommandFromQueue) {
        popCommandFromQueue();  // Merge queue into input box
        return;
    }
}
```

**Note**: In v2.1.76, `d36()` always returns `false`, so this branch is never reached. Queued commands cannot be popped back to the input box.

---

## 8. Help Overlay Interaction

### 8.1 Escape During Help

When the help overlay is visible:

```
STATE: Help overlay showing
ACTION: User presses Escape
RESULT:
  1. Help overlay closes
  2. No cancel action triggered
  3. User returns to previous context
```

### 8.2 Help Tip Integration

Steering-related help tips:

```javascript
// Location: chunks.176.mjs:1341, 1333

"enter-to-steer-in-relatime"  // Help tip for steering (note: typo in source)
"prompt-queue"                // Help tip for prompt queue
```

---

## 9. Screen Contexts

### 9.1 Screen Types

| Screen | Cancel Available? | Reason |
|--------|------------------|--------|
| `"chat"` | Yes | Normal chat interface |
| `"transcript"` | No | Read-only view of past conversation |
| `"plan"` | Yes (if streaming) | Plan mode interface |

### 9.2 Screen Transition Effects

```
SCREEN: chat → transcript
  → Cancel indicator disappears
  → All keybindings switch to read-only mode
  → Escape becomes "exit transcript"

SCREEN: transcript → chat
  → Cancel indicator may appear (if streaming)
  → Normal keybindings restored
```

---

## 10. Telemetry Events

### 10.1 Cancel Telemetry

```javascript
// Location: chunks.193.mjs:2607-2608, 2611

telemetry("tengu_cancel", {
    source: "escape",    // | "kill_agents" | "interrupt_on_submit"
    streamMode: "responding"  // Current stream mode
});
```

### 10.2 Telemetry Properties

| Property | Values | Meaning |
|----------|--------|---------|
| `source` | `"escape"` | User pressed Escape |
| `source` | `"kill_agents"` | User confirmed kill background agents |
| `source` | `"interrupt_on_submit"` | User submitted while tool in progress |
| `streamMode` | `"requesting"` | Waiting for first token |
| `streamMode` | `"thinking"` | Extended thinking active |
| `streamMode` | `"responding"` | Text streaming |
| `streamMode` | `"tool-input"` | Building tool args |
| `streamMode` | `"tool-use"` | Tool executing |

---

## 11. UI State Transitions

### 11.1 Complete State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        STEERING UI STATE MACHINE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  IDLE STATE                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  isLoading: false                                                │   │
│  │  abortSignal: undefined                                          │   │
│  │  showSpinner: false                                              │   │
│  │  showCancelText: false                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                               │
│         │ onQuery() called                                              │
│         ▼                                                               │
│  STREAMING STATE                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  isLoading: true                                                 │   │
│  │  abortSignal: defined, !aborted                                  │   │
│  │  showSpinner: true                                               │   │
│  │  showCancelText: true (if isActive)                              │   │
│  │  streamMode: "requesting" → "thinking" → "responding"            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                               │
│         │ User presses Escape                                           │
│         ▼                                                               │
│  ABORTING STATE                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  isLoading: true                                                 │   │
│  │  abortSignal: defined, aborted                                   │   │
│  │  showSpinner: true (draining)                                    │   │
│  │  showCancelText: false                                           │   │
│  │  Tool drainage in progress                                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                               │
│         │ Drainage complete                                             │
│         ▼                                                               │
│  COMPLETE STATE                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  isLoading: false                                                │   │
│  │  abortSignal: undefined                                          │   │
│  │  showSpinner: false                                              │   │
│  │  showCancelText: false                                           │   │
│  │  "Interrupted by user" in conversation                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                               │
│         │ User types new message                                        │
│         ▼                                                               │
│  IDLE STATE (cycle repeats)                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 11.2 State Timing

| Transition | Typical Duration | Reason |
|------------|------------------|--------|
| IDLE → STREAMING | ~50ms | API call initiation |
| STREAMING → ABORTING | ~0ms | Synchronous abort() |
| ABORTING → COMPLETE | 0-500ms | Tool drainage time |
| COMPLETE → IDLE | ~16ms | React re-render |

---

## 12. Accessibility Considerations

### 12.1 Keyboard Shortcuts Summary

| Action | Keybinding | Accessibility Notes |
|--------|------------|---------------------|
| Cancel stream | Escape | Standard cancel key |
| Global interrupt | Ctrl+C | POSIX standard, always available |
| Kill background agents | Ctrl+F (double) | Requires double-press, 3s timeout |

### 12.2 Visual Feedback

- **Cancel indicator**: Dim text with bold "Esc" key name
- **Kill confirmation**: Immediate priority notification
- **Spinner**: Visual animation with mode-specific text
- **Tool drainage**: Spinner continues during drainage

### 12.3 Non-Visual Feedback

Currently no audio feedback for steering events. All feedback is visual through:
- Text indicators
- Spinner animation
- Notification messages

---

## 13. Spinner State Machine (Detailed)

### 13.1 Complete Spinner Visibility Formula

```javascript
// ============================================
// showSpinner - Complete visibility computation
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
QV6 = (!j8 || j8.showSpinner === !0)
  && a8.length === 0
  && zA.length === 0
  && (Bq || YA || oi || qY4() > 0)
  && !X6
  && !C2
  && (!aZ || Wz);

// READABLE (for understanding):
const showSpinner =
    // Condition 1: Tool JSX allows spinner (default true)
    (toolJSX === null || toolJSX === undefined || toolJSX.showSpinner === true)
    // Condition 2: No tool permission dialogs showing
    && toolPermissionDialogs.length === 0
    // Condition 3: No tool confirmation dialogs showing
    && toolConfirmations.length === 0
    // Condition 4: At least one activity indicator
    && (isLoading || userInputOnProcessing || runningTasks || legacyQueueLength > 0)
    // Condition 5: No worker request pending
    && !workerRequestPending
    // Condition 6: Not all MCP tools only mode
    && !allMcpToolsOnly
    // Condition 7: Not MCP-only OR has MCP tool results
    && (!allToolsAreMcpOnly || hasMcpToolResults);

// Mapping: QV6→showSpinner, j8→toolJSX, a8→toolPermissionDialogs,
//   zA→toolConfirmations, Bq→isLoading, YA→userInputOnProcessing,
//   oi→runningTasks, qY4→getLegacyQueueLength, X6→workerRequestPending,
//   C2→allMcpToolsOnly, aZ→allToolsAreMcpOnly, Wz→hasMcpToolResults
```

### 13.2 Spinner Visibility Conditions Table

| Condition | Variable | When True | Effect |
|-----------|----------|-----------|--------|
| Tool JSX allows | `!j8 \|\| j8.showSpinner` | No tool JSX or `showSpinner: true` | Required |
| No permission dialogs | `a8.length === 0` | No tool permission modals | Required |
| No confirmations | `zA.length === 0` | No tool confirmation modals | Required |
| Activity present | `Bq \|\| YA \|\| oi \|\| qY4() > 0` | Loading/Input/Tasks/Queue | Required |
| No worker pending | `!X6` | No worker request | Required |
| Not MCP-only | `!C2` | Not all MCP tools mode | Required |
| MCP results available | `!aZ \|\| Wz` | MCP results or not MCP-only | Required |

### 13.3 Stream Mode Transitions

```
┌────────────────────────────────────────────────────────────────────┐
│              STREAM MODE STATE MACHINE (DETAILED)                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  INITIAL STATE                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: undefined                                       │  │
│  │  No spinner visible                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ onQuery() starts                                         │
│         ▼                                                          │
│  REQUESTING STATE                                                  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: "requesting"                                    │  │
│  │  Spinner: "Waiting for Claude..."                            │  │
│  │  Cancel indicator: Visible (if active)                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ├─ Extended thinking enabled → THINKING                   │
│         └─ First token received → RESPONDING                      │
│                                                                    │
│  THINKING STATE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: "thinking"                                      │  │
│  │  Spinner: "Thinking..." with thinking_blocks                │  │
│  │  Cancel indicator: Visible                                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ Thinking complete → RESPONDING                           │
│         ▼                                                          │
│  RESPONDING STATE                                                  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: "responding"                                    │  │
│  │  Spinner: "Claude is responding..."                          │  │
│  │  Cancel indicator: Visible                                   │  │
│  │  Token counter incrementing                                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ├─ Tool use detected → TOOL-INPUT                         │
│         └─ Stream ends → COMPLETE                                 │
│                                                                    │
│  TOOL-INPUT STATE                                                  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: "tool-input"                                    │  │
│  │  Spinner: "Generating tool arguments..."                     │  │
│  │  Cancel indicator: Visible (can abort tool)                  │  │
│  │  Tool name visible when known                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ Tool arguments complete → TOOL-USE                      │
│         ▼                                                          │
│  TOOL-USE STATE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: "tool-use"                                      │  │
│  │  Spinner: "Running [tool_name]..."                           │  │
│  │  Cancel indicator: Visible (can abort + drainage)            │  │
│  │  Progress indicators may show                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ├─ Tool complete, more tools → back to TOOL-INPUT        │
│         ├─ Tool complete, response done → COMPLETE               │
│         └─ User abort → ABORTING                                  │
│                                                                    │
│  ABORTING STATE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: (previous value)                                │  │
│  │  Spinner: Still visible (draining tools)                     │  │
│  │  Cancel indicator: Hidden                                    │  │
│  │  Tool drainage in progress (50-500ms)                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         │ Drainage complete                                        │
│         ▼                                                          │
│  COMPLETE STATE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  streamMode: undefined                                       │  │
│  │  Spinner: Hidden                                             │  │
│  │  Cancel indicator: Hidden                                    │  │
│  │  "[Request interrupted by user]" in conversation             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 13.4 Spinner Text Configuration

The spinner text can be customized via settings:

```javascript
// ============================================
// Spinner configuration schema
// Location: chunks.40.mjs:1428-1436
// ============================================

// Schema definition:
{
  spinnerTipsEnabled: z.boolean().optional()
    .describe("Whether to show tips in the spinner"),

  spinnerVerbs: z.object({
    mode: z.enum(["append", "replace"]),
    verbs: z.array(z.string())
  }).optional()
    .describe('Customize spinner verbs. mode: "append" adds verbs to defaults, "replace" uses only your verbs.'),

  spinnerTipsOverride: z.object({
    excludeDefault: z.boolean().optional(),
    tips: z.array(z.string())
  }).optional()
    .describe("Override spinner tips")
}

// Example configuration:
{
  "spinnerTipsEnabled": true,
  "spinnerVerbs": {
    "mode": "append",
    "verbs": ["Compiling", "Building", "Testing"]
  },
  "spinnerTipsOverride": {
    "excludeDefault": false,
    "tips": ["Press Esc to interrupt", "Ctrl+F to stop background agents"]
  }
}
```

---

## 14. Notification System Integration

### 14.1 Notification Priority Levels

The notification system supports multiple priority levels that affect display behavior:

| Priority | Behavior | Use Case |
|----------|----------|----------|
| `"immediate"` | Shows immediately, overrides others, auto-dismisses | Kill confirmation, critical alerts |
| `"normal"` | Queued normally, standard dismissal | Task completion, info messages |
| `"low"` | Lowest priority, may be delayed | Background info, tips |

### 14.2 Kill Agents Notification Flow

```javascript
// ============================================
// Kill agents confirmation notification
// Location: chunks.193.mjs:2650-2655
// ============================================

// ORIGINAL (for source lookup):
v.current = e, G({
    key: "kill-agents-confirm",
    text: "Press ctrl+f again to stop background agents",
    priority: "immediate",
    timeoutMs: Buq
})

// READABLE (for understanding):
lastKillPressTime.current = now;
addNotification({
    key: "kill-agents-confirm",       // Unique identifier for removal
    text: "Press ctrl+f again to stop background agents",
    priority: "immediate",            // Shows immediately
    timeoutMs: KILL_AGENTS_CONFIRM_TIMEOUT  // 3000ms auto-dismiss
});

// Mapping: v→lastKillPressTime, G→addNotification, Buq→KILL_AGENTS_CONFIRM_TIMEOUT
```

### 14.3 Notification Removal

```javascript
// Location: chunks.193.mjs:2632

removeNotification("kill-agents-confirm");  // f("kill-agents-confirm")
```

When the second Ctrl+F press is detected, the confirmation notification is immediately removed before killing agents.

---

## 15. Keybinding Context Resolution

### 15.1 Context Resolution Order

When a key is pressed, the keybinding system resolves the active handler:

```
┌────────────────────────────────────────────────────────────────────┐
│              KEYBINDING CONTEXT RESOLUTION                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. Check Dialog context                                          │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │  if (dialogVisible) → Use Dialog context keybindings     │  │
│     │  Examples: Tool permission, help overlay, message select │  │
│     └──────────────────────────────────────────────────────────┘  │
│                                                                    │
│  2. Check Chat context                                            │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │  if (chatInputFocused) → Use Chat context keybindings    │  │
│     │  Examples: Escape for cancel, Ctrl+F for kill agents     │  │
│     └──────────────────────────────────────────────────────────┘  │
│                                                                    │
│  3. Fall back to Global context                                   │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │  Always active → Use Global context keybindings          │  │
│     │  Examples: Ctrl+C for interrupt (hardcoded)              │  │
│     └──────────────────────────────────────────────────────────┘  │
│                                                                    │
│  4. Check isActive flag                                           │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │  if (!isActive) → Skip this binding, try next context    │  │
│     └──────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 15.2 isActive Flag Computation for Each Keybinding

| Keybinding | Context | isActive Computation |
|------------|---------|---------------------|
| `chat:cancel` | Chat | `showCancelText` (see Section 11.1) |
| `app:interrupt` | Global | `isGloballyActive` = `hasRunningAgents \|\| isActive` |
| `chat:killAgents` | Chat | `hasRunningLocalAgents` (running background agents exist) |

---

## 16. Accessibility Enhancements

### 16.1 Keyboard Navigation Support

| Key | Context | Action | Screen Reader |
|-----|---------|--------|---------------|
| Escape | Streaming | Cancel stream | "Stream cancelled" |
| Ctrl+C | Any | Global interrupt | "Interrupted" |
| Ctrl+F (x2) | Background agents | Kill agents | "Background agents stopped" |
| Tab | Input | Navigate to cancel button | "Cancel button, press Enter to activate" |

### 16.2 Focus Management

When cancel is triggered:
1. Focus returns to main input field
2. Any modal dialogs are closed
3. Spinner is hidden
4. Input is ready for new text

### 16.3 ARIA Considerations

- Cancel indicator uses `role="status"` for live updates
- Spinner uses `role="progressbar"` with `aria-busy="true"`
- Kill confirmation uses `role="alert"` for immediate attention

---

## 17. Cancel Handler Props Object

### 17.1 `vD` Props Structure

The cancel handler component receives a comprehensive props object with all necessary state:

```javascript
// ============================================
// vD - Props object for cancelHandlerComponent
// Location: chunks.196.mjs:444-458
// ============================================

// ORIGINAL (for source lookup):
vD = {
    setToolUseConfirmQueue: $A,
    onCancel: TM,
    onAgentsKilled: () => gq((P1) => [...P1, NTq()]),
    isMessageSelectorVisible: W7 || !!oF,
    screen: k6,
    abortSignal: M5?.signal,
    popCommandFromQueue: iV6,
    vimMode: sZ,
    isLocalJSXCommand: j8?.isLocalJSXCommand,
    isSearchingHistory: H4,
    isHelpOpen: fH,
    inputMode: ZH,
    inputValue: m5,
    streamMode: d7
};

// READABLE (for understanding):
const cancelHandlerProps = {
    // Callbacks
    setToolUseConfirmQueue: setToolConfirmQueue,
    onCancel: handleCancel,
    onAgentsKilled: () => appendToHistory(createKilledNotification()),
    popCommandFromQueue: processQueuePop,

    // Visibility state
    isMessageSelectorVisible: isMessageSelectorOpen || hasOverflowMessage,
    screen: currentScreen,
    abortSignal: abortController?.signal,

    // Input state
    vimMode: currentVimMode,
    isLocalJSXCommand: localCommand?.isLocalJSXCommand,
    isSearchingHistory: isHistorySearchActive,
    isHelpOpen: isHelpOverlayOpen,
    inputMode: currentInputMode,
    inputValue: currentInputValue,
    streamMode: streamMode
};

// Mapping: vD→cancelHandlerProps, $A→setToolConfirmQueue, TM→handleCancel,
//   gq→appendToHistory, NTq→createKilledNotification, W7→isMessageSelectorOpen,
//   oF→hasOverflowMessage, k6→currentScreen, M5→abortController,
//   iV6→processQueuePop, sZ→currentVimMode, j8→localCommand,
//   H4→isHistorySearchActive, fH→isHelpOverlayOpen, ZH→currentInputMode,
//   m5→currentInputValue, d7→streamMode
```

### 17.2 Props Source Mapping

| Prop | Source Hook/State | Type | Purpose |
|------|-------------------|------|---------|
| `setToolUseConfirmQueue` | React state setter | Function | Clear tool confirmations on cancel |
| `onCancel` | `TM` callback | Function | Trigger abort |
| `onAgentsKilled` | Inline callback | Function | Add kill notification to history |
| `isMessageSelectorVisible` | `W7 \|\| !!oF` | Boolean | Block cancel when selector open |
| `screen` | `k6` state | String | Block cancel in transcript |
| `abortSignal` | `M5?.signal` | AbortSignal \| undefined | Check streaming state |
| `popCommandFromQueue` | `iV6` callback | Function | Pop queued command to input |
| `vimMode` | `sZ` state | String | Check INSERT mode |
| `isLocalJSXCommand` | `j8?.isLocalJSXCommand` | Boolean | JSX command handling |
| `isSearchingHistory` | `H4` state | Boolean | Block cancel during history search |
| `isHelpOpen` | `fH` state | Boolean | Block cancel when help open |
| `inputMode` | `ZH` state | String | Current input mode |
| `inputValue` | `m5` state | String | Current input value |
| `streamMode` | `d7` state | String | Current streaming phase |

---

## 18. Stream Mode States

### 18.1 Stream Mode State Machine

The `streamMode` state transitions through defined phases:

```
┌────────────────────────────────────────────────────────────────────┐
│              STREAM MODE STATE MACHINE                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  IDLE → REQUESTING                                                 │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Trigger: onQuery() called                                    │ │
│  │  Action: Create AbortController, set isLoading=true           │ │
│  │  Spinner: "Waiting for Claude..."                             │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         ▼                                                          │
│  REQUESTING → THINKING                                             │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Trigger: Extended thinking starts                            │ │
│  │  Action: None (informational)                                 │ │
│  │  Spinner: "Thinking..."                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         ▼                                                          │
│  THINKING → RESPONDING                                             │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Trigger: First text token received                           │ │
│  │  Action: Start rendering text                                 │ │
│  │  Spinner: "Claude is responding..."                           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         ▼                                                          │
│  RESPONDING → TOOL-INPUT                                           │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Trigger: Tool use detected in stream                         │ │
│  │  Action: Parse tool arguments                                 │ │
│  │  Spinner: "Generating tool arguments..."                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         ▼                                                          │
│  TOOL-INPUT → TOOL-USE                                             │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Trigger: Tool arguments complete                             │ │
│  │  Action: Execute tool                                         │ │
│  │  Spinner: "Running [tool_name]..."                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         ▼                                                          │
│  Any → IDLE (completion or abort)                                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 18.2 Stream Mode and Cancel Interaction

| Stream Mode | Cancel Allowed? | Escape Behavior | Cancel Indicator |
|-------------|-----------------|-----------------|------------------|
| `requesting` | Yes | Abort API call | "Esc to cancel" |
| `thinking` | Yes | Abort thinking | "Esc to cancel" |
| `responding` | Yes | Abort streaming | "Esc to cancel" |
| `tool-input` | Yes | Abort before execution | "Esc to cancel" |
| `tool-use` | Yes | Drain tool, then abort | "Esc to cancel" |
| `undefined` (idle) | No | N/A | Hidden |

---

## 19. System Reminder Integration

### 19.1 INTERRUPT_MESSAGE_PATTERN (hTq)

The `hTq` regex pattern detects interrupt-related messages:

```javascript
// ============================================
// INTERRUPT_MESSAGE_PATTERN - Detects interrupt messages
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

### 19.2 UI Visibility Filtering

The system_reminder module uses this pattern to:
1. Filter interrupt messages from UI display
2. Handle isMeta filtering for interrupt content
3. Preserve interrupt context during compaction

**Integration with XV6 visibility filter** (chunks.185.mjs:1692):
```javascript
// Messages matching INTERRUPT_MESSAGE_PATTERN are filtered from display
if (message.isMeta) return false;  // Hide meta messages
if (containsInterruptPattern(message.content)) return false;
```

### 19.3 INTERRUPT_MESSAGES_SET (TF6)

The `TF6` constant provides O(1) lookup for known interrupt message strings:

```javascript
// ============================================
// INTERRUPT_MESSAGES_SET - Fast lookup for interrupt strings
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
    "No response requested."        // N36 - No response needed
]);

// Mapping: TF6→INTERRUPT_MESSAGES_SET, D66→INTERRUPTED_BY_USER_TEXT,
//   P0→INTERRUPTED_FOR_TOOL_USE, R96→REJECTION_MESSAGE, h96→TOOL_REJECTION_MESSAGE
```

**Why use a Set instead of the regex?**
- **Performance**: O(1) lookup vs O(n) regex match
- **Exact match**: For known interrupt strings, exact match is more reliable
- **Dual detection**: Both regex (hTq) and Set (TF6) provide redundant detection paths

### 19.4 isMeta Flag Flow for Interrupt Messages

When an interrupt occurs, the message flow is:

```
┌────────────────────────────────────────────────────────────────────┐
│              INTERRUPT MESSAGE isMeta FLOW                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  User presses Escape                                               │
│         │                                                          │
│         ▼                                                          │
│  abortController.abort()                                           │
│         │                                                          │
│         ▼                                                          │
│  createInterruptToolResults (Sp8) generates:                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  {                                                          │  │
│  │    type: "user",                                            │  │
│  │    message: { role: "user", content: [...] },               │  │
│  │    isMeta: false,  // NOT meta - visible in conversation    │  │
│  │    toolUseResult: "Interrupted by user"                     │  │
│  │  }                                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  createUserGuidanceMessage (Ug) generates:                         │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  {                                                          │  │
│  │    type: "user",                                            │  │
│  │    message: { role: "user", content: "[Request..." },       │  │
│  │    isMeta: false  // Visible to user                        │  │
│  │  }                                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│         ▼                                                          │
│  UI renders message in conversation                                │
│  (Interrupt message IS visible to user, not hidden)               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Key insight**: Interrupt messages are **NOT** marked as `isMeta: true`. They are regular user messages that appear in the conversation so the user can see that their interrupt was processed.

---

## 20. TM() Cancel Handler - Detailed Analysis

### 20.1 Function Definition

The `TM()` function is the core cancel handler in the REPL component, handling all cancel scenarios including tool permissions, prompts, and streaming:

```javascript
// ============================================
// TM - Main cancel handler function
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim()) gq((P1) => [...P1, $Z({
        content: ez
    })]);
    if (dE(), K2 === "tool-permission") a8[0]?.onAbort(), $A([]);
    else if (K2 === "prompt") {
        for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
        gA([]), M5?.abort()
    } else if (B5.isRemoteMode) B5.cancelRequest();
    else M5?.abort();
    x5(null)
}

// READABLE (for understanding):
function onCancel() {
    // STEP 1: Skip if in elicitation mode (user input required)
    if (focusedInputDialog === "elicitation") return;

    // STEP 2: Log cancel event for debugging
    log(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // STEP 3: Force end any in-progress operations
    inputBuffer.forceEnd();

    // STEP 4: If user typed something, add it to history before cancel
    if (userInput?.trim()) {
        appendToHistory((messages) => [...messages, createUserMessage({
            content: userInput
        })]);
    }

    // STEP 5: Reset state
    resetState();

    // STEP 6: Handle based on current dialog mode
    if (focusedInputDialog === "tool-permission") {
        // Tool permission dialog: abort the specific tool
        toolPermissionDialogs[0]?.onAbort();
        setToolConfirmQueue([]);
    } else if (focusedInputDialog === "prompt") {
        // Prompt mode: reject all pending prompts
        for (let prompt of pendingPrompts) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPendingPrompts([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        // Remote mode: cancel via WebSocket
        remoteSession.cancelRequest();
    } else {
        // Local mode: abort the controller
        abortController?.abort();
    }

    // STEP 7: Clear abort controller
    setAbortController(null);
}

// Mapping: TM→onCancel, K2→focusedInputDialog, k→log, d7→streamMode,
//   J9→inputBuffer, ez→userInput, gq→appendToHistory, $Z→createUserMessage,
//   dE→resetState, a8→toolPermissionDialogs, $A→setToolConfirmQueue,
//   zA→pendingPrompts, gA→setPendingPrompts, M5→abortController,
//   B5→remoteSession, x5→setAbortController
```

### 20.2 Cancel Handler Decision Matrix

| `focusedInputDialog` | Action | Abort Method | State Cleanup |
|----------------------|--------|--------------|---------------|
| `"elicitation"` | Return immediately | None | None |
| `"tool-permission"` | Abort tool dialog | `a8[0].onAbort()` | Clear confirm queue |
| `"prompt"` | Reject all prompts | `M5?.abort()` | Clear pending prompts |
| `"remote"` | Cancel remote request | `B5.cancelRequest()` | Reset state |
| Other (streaming) | Abort controller | `M5?.abort()` | Clear controller |

### 20.3 Cancel Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│              TM() CANCEL HANDLER FLOW                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  User triggers cancel (Escape / Ctrl+C / programmatic)            │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ focusedInputDialog === "elicitation"?                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│    ┌────┴────┐                                                     │
│    │         │                                                     │
│   YES        NO                                                    │
│    │         │                                                     │
│    ▼         ▼                                                     │
│  Return    Continue processing                                     │
│            │                                                       │
│            ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Has user input (ez.trim())?                                  │  │
│  │   → Add to history as user message                           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│            │                                                       │
│            ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ focusedInputDialog === "tool-permission"?                     │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         │                                                          │
│    ┌────┴────┐                                                     │
│    │         │                                                     │
│   YES        NO                                                    │
│    │         │                                                     │
│    ▼         ▼                                                     │
│  a8[0]?.onAbort()  focusedInputDialog === "prompt"?              │
│  $A([])            │                                              │
│                     ┌────┴────┐                                    │
│                     │         │                                    │
│                    YES        NO                                   │
│                     │         │                                    │
│                     ▼         ▼                                    │
│                  Reject     isRemoteMode?                          │
│                  prompts    ┌────┴────┐                           │
│                  M5?.abort()│         │                           │
│                            YES        NO                          │
│                             │         │                           │
│                             ▼         ▼                           │
│                       B5.cancelRequest()  M5?.abort()             │
│            │                                                       │
│            ▼                                                       │
│  x5(null)  // Clear abort controller                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 20.4 Integration with cancelHandlerComponent

The `TM()` function is passed to `cancelHandlerComponent` via the `vD` props object:

```javascript
// Props passing (chunks.196.mjs:444-458)
const vD = {
    // ... other props
    onCancel: TM,  // ← Passed here
    // ... other props
};

// cancelHandlerComponent receives and uses it (chunks.193.mjs:2605-2621)
// Inside handleCancelPress:
//   K() is called → which is TM()
```

---

## 21. Abort Controller Lifecycle

### 21.1 Lifecycle Overview

The abort controller manages cancellation of LLM API requests and tool executions:

```
┌────────────────────────────────────────────────────────────────────┐
│              ABORT CONTROLLER LIFECYCLE                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  PHASE 1: CREATION                                                 │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Location: onQuery() callback                                  │ │
│  │ Action: new AbortController()                                 │ │
│  │ Storage: setAbortController(controller) → M5 state            │ │
│  │ Signal: controller.signal available for checking              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         ▼                                                          │
│  PHASE 2: ACTIVE USE                                               │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ M5.signal.aborted === false                                   │ │
│  │ Passed to:                                                     │ │
│  │   - LLM API fetch request                                      │ │
│  │   - Tool execution context                                     │ │
│  │   - Remote session (if applicable)                            │ │
│  │ Visibility: cancelHandlerComponent sees signal as abortSignal │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │ User triggers cancel OR stream completes                 │
│         ▼                                                          │
│  PHASE 3: ABORT SIGNAL                                             │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ M5.abort() called (or M5.abort("interrupt"))                  │ │
│  │ M5.signal.aborted becomes true                                 │ │
│  │ M5.signal.reason = undefined | "interrupt" | "sibling_error"  │ │
│  │                                                                │ │
│  │ API fetch receives abort event → cancels network request      │ │
│  │ Tool executor checks signal → initiates graceful drainage     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│         │                                                          │
│         ▼                                                          │
│  PHASE 4: CLEANUP                                                  │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ x5(null) called in TM()                                        │ │
│  │ M5 state set to null                                           │ │
│  │ abortSignal becomes undefined in cancelHandlerComponent       │ │
│  │ Cancel indicator hidden (no active stream)                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 21.2 Abort Controller State Variables

| Variable | Obfuscated | Type | Purpose |
|----------|------------|------|---------|
| `abortController` | `M5` | AbortController \| null | Current controller instance |
| `setAbortController` | `x5` | Function | State setter |
| `abortSignal` | `M5?.signal` | AbortSignal \| undefined | Signal for cancellation check |
| `signal.aborted` | `M5.signal.aborted` | Boolean | Whether aborted |
| `signal.reason` | `M5.signal.reason` | any | Abort reason ("interrupt", etc.) |

### 21.3 Abort Reason Semantics

```javascript
// ============================================
// Abort reason handling
// Location: chunks.148.mjs:1156-1157, chunks.194.mjs:444
// ============================================

// When abort is called with a reason:
abortController.abort("interrupt");  // Sets signal.reason = "interrupt"

// Reason affects message generation:
if (abortController.signal.reason !== "interrupt") {
    yield createUserGuidanceMessage({ toolUse: false });
}
```

| Reason | Set By | Effect |
|--------|--------|--------|
| `undefined` | `TM()` via Escape press | Add user guidance message |
| `"interrupt"` | `interrupt-on-submit` (chunks.194.mjs:444) | Skip user guidance, process queued input |
| `"sibling_error"` | Parallel tool executor | Isolated failure, don't propagate |

### 21.4 React State Integration

```javascript
// ============================================
// Abort controller state management
// Location: chunks.196.mjs (inferred from context)
// ============================================

// State declaration:
const [M5, x5] = useState(null);  // abortController, setAbortController

// Creation in onQuery:
const controller = new AbortController();
x5(controller);

// Usage in cancel visibility:
const abortSignal = M5?.signal;
const isStreaming = abortSignal !== undefined && !abortSignal.aborted;

// Cleanup in TM():
x5(null);  // Clear after abort
```

---

## 22. Stream Mode State Storage

### 22.1 State Declaration

The stream mode is stored as React state with a ref for callback access:

```javascript
// ============================================
// Stream mode state declaration
// Location: chunks.196.mjs:96-97
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;

// READABLE (for understanding):
const [streamMode, setStreamMode] = useState("responding");
const streamModeRef = useRef(streamMode);
streamModeRef.current = streamMode;  // Keep ref in sync for callbacks

// Mapping: d7→streamMode, W4→setStreamMode, Dz→streamModeRef, N8→React
```

### 22.2 Why Use Both State and Ref?

| Aspect | State (`d7`) | Ref (`Dz.current`) |
|--------|--------------|-------------------|
| **Triggers re-render** | Yes | No |
| **Available in callbacks** | May be stale | Always current |
| **Used in UI** | Yes (spinner, cancel indicator) | No |
| **Used in onCancel** | No | Yes (for logging) |

The ref ensures callbacks like `TM()` always have access to the current stream mode without needing to add it to the dependency array.

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76