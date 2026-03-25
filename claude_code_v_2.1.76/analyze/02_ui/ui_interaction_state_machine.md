# UI Interaction State Machine (Claude Code 2.1.76)

> Complete analysis of user interaction states, transitions, and event handling.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-25.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop

Key functions in this document:
- `sessionOrchestrator` (ot8) - Main session orchestrator at chunks.196.mjs:3
- `getInputDialogType` (ra6) - Dialog priority dispatcher at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `mainAgentLoop` (Yh) - Agent loop at chunks.148.mjs:875

---

## Overview

The UI Interaction State Machine manages all user-facing states and transitions in Claude Code. It coordinates between:

1. **Input modes** - Text input, command composition, history search
2. **Streaming states** - Responding, tool-input, thinking
3. **Dialog overlays** - 12 different dialog types with priority ordering
4. **Message navigation** - Message selector, transcript view

---

## State Architecture

### State Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UI INTERACTION STATE HIERARCHY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Level 1: Session State (Global)                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • screen: "prompt" | "transcript" | "tasks"                         │    │
│  │ • disabled: boolean                                                  │    │
│  │ • isRemoteMode: boolean                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  Level 2: Stream Mode (LLM Output State)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • streamMode: "responding" | "tool-input" | "thinking" | "tool-use" │    │
│  │ • isStreaming: boolean                                               │    │
│  │ • streamingIndicator: object | null                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  Level 3: Input Mode (User Input State)                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • inputMode: "prompt" | "search" | "message-selector"               │    │
│  │ • isInputComposing: boolean                                          │    │
│  │ • isSearchingHistory: boolean                                        │    │
│  │ • vimMode: string                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  Level 4: Dialog State (Overlay State)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • focusedInputDialog: string | undefined                             │    │
│  │ • toolUseConfirmQueue: array                                         │    │
│  │ • sandboxPermissionQueue: array                                      │    │
│  │ • elicitationQueue: array                                            │    │
│  │ • promptQueue: array                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Variables (from chunks.196.mjs)

```javascript
// ============================================
// UI State Variables - Session Orchestrator internal state
// Location: chunks.196.mjs:30-100
// ============================================

// ORIGINAL (for source lookup):
let [k6, Z6] = N8.useState("prompt");  // screen state
let [u6, C6] = N8.useState(!1);        // isInputComposing
let [d7, W4] = N8.useState("responding"); // streamMode
let [JK, F3] = N8.useState([]);        // streamingToolUses
let [MK, k3] = N8.useState(null);      // streamingThinking

// READABLE (for understanding):
let [screen, setScreen] = useState("prompt");
let [isInputComposing, setIsInputComposing] = useState(false);
let [streamMode, setStreamMode] = useState("responding");
let [streamingToolUses, setStreamingToolUses] = useState([]);
let [streamingThinking, setStreamingThinking] = useState(null);

// Dialog queues
let [toolUseConfirmQueue, setToolUseConfirmQueue] = useState([]);
let [sandboxPermissionQueue, setSandboxPermissionQueue] = useState([]);
let [elicitationQueue, setElicitationQueue] = useState([]);
let [promptQueue, setPromptQueue] = useState([]);

// Derived from global state
let toolPermissionContext = useAppState((s) => s.toolPermissionContext);
let mcp = useAppState((s) => s.mcp);
let tasks = useAppState((s) => s.tasks);
let teamContext = useAppState((s) => s.teamContext);
```

---

## Stream Mode State Machine

### Stream Mode States

The `streamMode` tracks what the LLM is currently outputting:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STREAM MODE STATE MACHINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                         ┌─────────────────┐                                 │
│                         │   "requesting"  │ ← stream_request_start          │
│                         └────────┬────────┘                                 │
│                                  │                                          │
│                                  ▼                                          │
│         ┌────────────────────────┼────────────────────────┐                 │
│         │                        │                        │                 │
│         ▼                        ▼                        ▼                 │
│  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐        │
│  │ "responding"│          │ "thinking"  │          │ "tool-input"│        │
│  │             │          │             │          │             │        │
│  │ Text delta  │          │ Thinking    │          │ Tool JSON   │        │
│  │ streaming   │          │ block       │          │ partial     │        │
│  └──────┬──────┘          └──────┬──────┘          └──────┬──────┘        │
│         │                        │                        │                 │
│         └────────────────────────┼────────────────────────┘                 │
│                                  │                                          │
│                                  ▼                                          │
│                         ┌─────────────┐                                     │
│                         │  "tool-use" │ ← message_stop                      │
│                         └─────────────┘                                     │
│                                                                              │
│  Transition Triggers:                                                       │
│  • content_block_start(text) → "responding"                                 │
│  • content_block_start(thinking) → "thinking"                               │
│  • content_block_start(tool_use) → "tool-input"                             │
│  • message_stop → "tool-use"                                                │
│  • message_delta(stop_reason) → varies                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stream Mode Transitions

```javascript
// ============================================
// Stream Mode Transitions - From SSE event handling
// Location: chunks.173.mjs:2384-2488 (handleToolUseStream/xN6)
// ============================================

// READABLE (for understanding):
function handleStreamEvent(event, setStreamMode, setStreamingToolUses, setStreamingThinking) {
    switch (event.type) {
        case "stream_request_start":
            setStreamMode("requesting");
            break;

        case "content_block_start":
            if (event.content_block.type === "text") {
                setStreamMode("responding");
            } else if (event.content_block.type === "thinking") {
                setStreamMode("thinking");
                setStreamingThinking({
                    thinking: "",
                    signature: ""
                });
            } else if (event.content_block.type === "tool_use") {
                setStreamMode("tool-input");
                setStreamingToolUses((prev) => [...prev, {
                    index: event.index,
                    contentBlock: {
                        ...event.content_block,
                        input: {}  // Will be filled via deltas
                    },
                    unparsedToolInput: ""
                }]);
            }
            break;

        case "content_block_delta":
            // Update streaming state based on delta type
            if (event.delta.type === "thinking_delta") {
                setStreamingThinking((prev) => ({
                    ...prev,
                    thinking: prev.thinking + event.delta.thinking
                }));
            } else if (event.delta.type === "input_json_delta") {
                setStreamingToolUses((prev) => {
                    let entry = prev.find(e => e.index === event.index);
                    if (entry) {
                        entry.unparsedToolInput += event.delta.partial_json;
                    }
                    return [...prev];
                });
            }
            break;

        case "message_stop":
            setStreamMode("tool-use");
            break;
    }
}
```

---

## Dialog Priority System

### Priority Dispatcher (ra6)

```javascript
// ============================================
// getInputDialogType (ra6) - Dialog priority dispatcher
// Location: chunks.196.mjs:387-404
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
    let P1 = !j8 || j8.shouldContinueAnimation;
    if (P1 && a8[0]) return "tool-permission";
    if (P1 && zA[0]) return "prompt";
    if (P1 && n.queue[0]) return "worker-sandbox-permission";
    if (P1 && o.queue[0]) return "elicitation";
    if (P1 && m26) return "cost";
    if (P1 && W6) return "ide-onboarding";
    if (P1 && g6) return "effort-callout";
    if (P1 && J1) return "remote-callout";
    if (P1 && e8) return "lsp-recommendation";
    if (P1 && E1) return "desktop-upsell";
    return
}

// READABLE (for understanding):
function getInputDialogType() {
    // Tier 0: Absolute blocks (no dialog shown at all)
    if (isViewingDialogHistory || hasActiveNotification) return;

    // Tier 1: User-initiated (highest priority)
    if (messageSelectorVisible) return "message-selector";

    // Tier 2: Streaming pause (blocks lower priority dialogs)
    if (isPaused) return;

    // Tier 3: Security-critical (always show immediately)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Animation gate: Lower priority dialogs wait for animation
    const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

    // Tier 4+: Lower priority dialogs (gated by animation)
    if (canShowLowerPriority && toolPermissionQueue[0]) return "tool-permission";
    if (canShowLowerPriority && promptQueue[0]) return "prompt";
    if (canShowLowerPriority && workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (canShowLowerPriority && elicitationQueue[0]) return "elicitation";
    if (canShowLowerPriority && showCostWarning) return "cost";
    if (canShowLowerPriority && showIdeOnboarding) return "ide-onboarding";
    if (canShowLowerPriority && showEffortCallout) return "effort-callout";
    if (canShowLowerPriority && showRemoteCallout) return "remote-callout";
    if (canShowLowerPriority && lspRecommendation) return "lsp-recommendation";
    if (canShowLowerPriority && showDesktopUpsell) return "desktop-upsell";

    return; // No dialog
}

// Mapping: ra6→getInputDialogType, lV6→isViewingDialogHistory, na6→hasActiveNotification,
//          W7→messageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
//          j8→toolJSX, a8→toolPermissionQueue, zA→promptQueue, n→workerSandboxPermissions,
//          o→elicitationState, m26→showCostWarning, W6→showIdeOnboarding, g6→showEffortCallout,
//          J1→showRemoteCallout, e8→lspRecommendation, E1→showDesktopUpsell
```

### Dialog Priority Table

| Priority | Dialog Type | Trigger Variable | Rationale |
|----------|-------------|------------------|-----------|
| Block-all | `isViewingDialogHistory` / `lV6` | User searching | Any dialog would disrupt search |
| Block-all | `hasActiveNotification` / `na6` | Full-screen overlay | Exclusive focus required |
| 1 | `message-selector` | `W7` | User explicitly triggered |
| Block-below | `isPaused` / `y2` | Streaming paused | Prevents dialog stacking |
| 2 | `sandbox-permission` | `G7[0]` | Security-critical |
| Gate | animation gate | `!j8 \|\| j8.shouldContinueAnimation` | Ensures smooth UI |
| 3 | `tool-permission` | `a8[0]` | Tool approval required |
| 4 | `prompt` | `zA[0]` | Tool interactive input |
| 5 | `worker-sandbox` | `n.queue[0]` | Worker security |
| 6 | `elicitation` | `o.queue[0]` | MCP input request |
| 7 | `cost` | `m26` | Cost threshold warning |
| 8 | `ide-onboarding` | `W6` | IDE setup |
| 9 | `effort-callout` | `g6` | Effort selection |
| 10 | `remote-callout` | `J1` | Remote session |
| 11 | `lsp-recommendation` | `e8` | LSP suggestion |
| 12 | `desktop-upsell` | `E1` | App promotion |

### Animation Gate Mechanism

The animation gate (`canShowLowerPriority`) is a critical mechanism:

```javascript
const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;
```

**When `canShowLowerPriority` is `false`:**
- A local JSX command is active (`toolJSX` is set) AND
- `toolJSX.shouldContinueAnimation` is `false`

**Effect:** When a user runs `/help`, `/clear`, or other local JSX commands:
- Tool permissions queued during that time will NOT show until command finishes
- Elicitation requests will NOT interrupt the user's reading
- The user sees only the command output until they close it

---

## Cancel Handler (TM)

```javascript
// ============================================
// handleCancel (TM) - Cancel handler with per-dialog behavior
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
function handleCancel() {
    // Elicitation cannot be cancelled
    if (focusedInputDialog === "elicitation") return;

    // Log cancel action
    debugLog(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // Force end any ongoing animation
    animationController.forceEnd();

    // If there's draft input, save it
    if (inputDraft?.trim()) {
        setMessages((prev) => [...prev, createUserMessage({ content: inputDraft })]);
    }

    // Clear input state
    clearInputState();

    // Handle based on current dialog
    if (focusedInputDialog === "tool-permission") {
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (focusedInputDialog === "prompt") {
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        remoteClient.cancelRequest();
    } else {
        abortController?.abort();
    }

    // Clear any pending tool use
    setPendingToolUse(null);
}

// Mapping: TM→handleCancel, K2→focusedInputDialog, d7→streamMode, J9→animationController,
//          ez→inputDraft, gq→setMessages, $Z→createUserMessage, dE→clearInputState,
//          a8→toolPermissionQueue, $A→setToolPermissionQueue, zA→promptQueue, gA→setPromptQueue,
//          M5→abortController, B5→remoteClient, x5→setPendingToolUse
```

### Cancel Behavior Matrix

| Dialog Type | Cancel Action | Side Effects |
|-------------|---------------|--------------|
| `elicitation` | **Blocked** | Cannot cancel MCP elicitation |
| `tool-permission` | `onAbort()` | Tool not executed, abort message returned |
| `prompt` | `reject()` | Prompt promise rejected, abort controller triggered |
| `sandbox-permission` | Abort | Permission denied |
| `worker-sandbox` | Abort | Worker permission denied |
| Streaming | Abort | Stream cancelled, partial results preserved |
| Remote mode | `cancelRequest()` | Remote request cancelled |

---

## Input Mode State Machine

### Input Modes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INPUT MODE STATE MACHINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────────┐                                │
│                          │   "prompt"      │ ← Default state                │
│                          │   (text input)  │                                │
│                          └────────┬────────┘                                │
│                                   │                                          │
│                    ┌──────────────┼──────────────┐                          │
│                    │              │              │                          │
│                    ▼              ▼              ▼                          │
│            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                 │
│            │  "search"   │ │ "history"   │ │ "selector"  │                 │
│            │ (Ctrl+R)    │ │ (Up arrow)  │ │ (Escape×2)  │                 │
│            └──────┬──────┘ └──────┬──────┘ └──────┬──────┘                 │
│                    │              │              │                          │
│                    └──────────────┼──────────────┘                          │
│                                   │                                          │
│                                   ▼                                          │
│                          ┌─────────────────┐                                │
│                          │   "prompt"      │ ← Return to default           │
│                          └─────────────────┘                                │
│                                                                              │
│  Transitions:                                                               │
│  • Ctrl+R → "search" (history search)                                       │
│  • Up arrow (empty input) → "history" (history navigation)                  │
│  • Escape Escape → "selector" (message selector)                            │
│  • Enter (submit) → stay in "prompt"                                        │
│  • Escape → back to "prompt" from any mode                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Vim Mode Integration

```javascript
// ============================================
// Vim Mode States
// Location: chunks.196.mjs
// ============================================

// READABLE (for understanding):
const VIM_MODES = {
    NORMAL: "normal",    // Navigation mode
    INSERT: "insert",    // Text input mode
    VISUAL: "visual",    // Selection mode
    COMMAND: "command"   // Command mode (:)
};

// Vim mode transitions
function handleVimModeChange(newMode) {
    switch (newMode) {
        case "normal":
            // Exit insert mode, enable navigation
            setIsInputComposing(false);
            break;
        case "insert":
            // Enter insert mode for text input
            setIsInputComposing(true);
            break;
        case "command":
            // Command mode for ex commands
            setInputPrefix(":");
            break;
    }
}
```

---

## Complete State Interaction Flow

### User Message Submission Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    USER MESSAGE SUBMISSION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User types message in input field                                          │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ State: inputMode="prompt", isInputComposing=true                    │    │
│  │ UI: Input field focused, cursor visible                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼ (Enter key pressed)                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ handleSubmit() called                                               │    │
│  │ ───────────────────────────────────────────────────────────────    │    │
│  │ 1. Validate input (non-empty)                                       │    │
│  │ 2. Clear input field                                                │    │
│  │ 3. Create user message                                              │    │
│  │ 4. Append to messages array                                         │    │
│  │ 5. Trigger agent loop                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ State: streamMode="requesting", isInputComposing=false              │    │
│  │ UI: Input cleared, spinner visible                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼ (mainAgentLoop yields stream_request_start)                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ State: streamMode="responding"                                      │    │
│  │ UI: Streaming indicator visible, text appearing                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ├───────────────────────────────────────────────────────────────┐   │
│         │                                                               │   │
│         ▼ (text content)           ▼ (tool_use block)            ▼ (thinking)│
│  ┌─────────────┐           ┌─────────────┐               ┌─────────────┐    │
│  │ streamMode: │           │ streamMode: │               │ streamMode: │    │
│  │ "responding"│           │ "tool-input"│               │ "thinking"  │    │
│  └─────────────┘           └─────────────┘               └─────────────┘    │
│         │                                                               │   │
│         └───────────────────────────────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼ (message_stop)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ State: streamMode="tool-use"                                        │    │
│  │ UI: Tool execution indicator, permission dialog if needed           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼ (tool execution complete)                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ State: streamMode="responding" (next turn) or "prompt" (done)       │    │
│  │ UI: Updated message list, input field re-enabled                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Single Dialog Constraint

**Why only one dialog at a time?**
- Prevents UI clutter in terminal environment
- Ensures user focus on the most important interaction
- Simplifies state management

**Implementation:**
- `getInputDialogType` returns only one dialog type
- Dialog queues are processed sequentially
- Animation gate ensures smooth transitions

### 2. Streaming State Separation

**Why is streaming state separate from messages?**
- Partial content should not be in message history
- Enables real-time UI updates without triggering re-renders
- Allows filtering of streaming content from committed messages

**Implementation:**
- `streamingToolUses` array holds partial tool inputs
- `streamingThinking` object holds thinking block state
- Committed messages are separate from streaming state

### 3. Animation Gate

**Why defer dialogs during animations?**
- Prevents jarring interruptions during local command execution
- Allows user to read command output before being prompted
- Maintains smooth visual experience

**Implementation:**
- `toolJSX.shouldContinueAnimation` flag
- All dialogs below "sandbox-permission" check this flag
- Local commands set `shouldContinueAnimation = false`

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Session Orchestrator | chunks.196.mjs:3 | `sessionOrchestrator` (ot8), `getInputDialogType` (ra6), `handleCancel` (TM) |
| Agent Loop | chunks.148.mjs:875 | `mainAgentLoop` (Yh), `mainAgentLoopCore` (omY) |
| Streaming Tool Executor | chunks.148.mjs:3 | `StreamingToolExecutor` (ui6) |
| Message Normalization | chunks.173.mjs:1999 | `normalizeMessages` (cM) |
| User Message Creation | chunks.173.mjs:1378 | `createUserMessage` (p1) |

---

## Keyboard Interaction Flow

### Event Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KEYBOARD INPUT FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User presses key                                                           │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ useInput hook (Ink)                                                  │  │
│  │ ─────────────────────────────────────────────────────────────────    │  │
│  │ Captures raw keypress                                                │  │
│  │ Returns: { key, input, meta }                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ handleKeyEvent                                                       │  │
│  │ ─────────────────────────────────────────────────────────────────    │  │
│  │ 1. Check for chord in progress                                       │  │
│  │ 2. Match against keybindings                                         │  │
│  │ 3. Execute matched action                                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ├────────────────────────────────────────────────────────────────┐  │
│         │                                                                │  │
│         ▼                                                                ▼  │
│  ┌─────────────────────┐                                    ┌─────────────┐ │
│  │ Single key action   │                                    │ Chord start │ │
│  │                     │                                    │             │ │
│  │ • Escape → Cancel   │                                    │ Wait for    │ │
│  │ • Enter → Submit    │                                    │ second key  │ │
│  │ • Tab → Autocomplete│                                    │             │ │
│  │ • Up/Down → History │                                    │ Timeout: 1s │ │
│  └─────────────────────┘                                    └─────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chord Detection Algorithm

```javascript
// ============================================
// Chord detection pattern
// Location: chunks.110.mjs (keybindings UI)
// ============================================

// Chord sequence: Ctrl+K followed by another key
// Example: Ctrl+K D → delete line

function handleKeyEvent(event, chordState, setChordState) {
    const { key, ctrl, meta, shift } = event;

    // 1. If chord in progress, complete it
    if (chordState.inProgress) {
        const chord = `${chordState.prefix} ${key}`;
        const action = keybindings[chord];

        if (action) {
            executeAction(action);
        }
        setChordState({ inProgress: false, prefix: null });
        return;
    }

    // 2. Check if this starts a chord
    const potentialPrefix = formatKey(event);
    const chordStarts = Object.keys(keybindings).filter(k =>
        k.includes(' ') && k.startsWith(potentialPrefix)
    );

    if (chordStarts.length > 0) {
        // Start chord timeout
        setChordState({ inProgress: true, prefix: potentialPrefix });
        setTimeout(() => {
            setChordState({ inProgress: false, prefix: null });
        }, 1000); // 1 second timeout
        return;
    }

    // 3. Single key binding
    const action = keybindings[potentialPrefix];
    if (action) {
        executeAction(action);
    }
}
```

### Default Keybindings

| Key | Action | Context |
|-----|--------|---------|
| `Enter` | Submit input | Input focused |
| `Shift+Enter` | Newline | Input focused |
| `Escape` | Cancel / Clear | Global |
| `Escape Escape` | Open message selector | Global |
| `Ctrl+C` | Cancel stream | Streaming |
| `Ctrl+R` | Message selector | Global |
| `Ctrl+E` | Toggle transcript view | Global |
| `Ctrl+K` | Start chord | Global |
| `Shift+Tab` | Cycle permission mode | Global |
| `Tab` | Accept autocomplete | Autocomplete visible |
| `Up` | History previous / Cursor up | Input focused |
| `Down` | History next / Cursor down | Input focused |
| `Ctrl+F` | Agent filter panel | Global (v2.1.76) |

---

## Streaming UI States

### Content Block Accumulation

```javascript
// ============================================
// handleToolUseStream (xN6) - Streaming tool use handling
// Location: chunks.173.mjs:2384-2488
// ============================================

// READABLE (for understanding):
function handleToolUseStream(event, state) {
    const { streamingToolUses, setStreamingToolUses } = state;

    switch (event.type) {
        case "content_block_start":
            if (event.content_block.type === "tool_use") {
                // Add new tool use to streaming array
                setStreamingToolUses(prev => [...prev, {
                    index: event.index,
                    contentBlock: {
                        ...event.content_block,
                        input: {}  // Will be filled via deltas
                    },
                    unparsedToolInput: ""
                }]);
            }
            break;

        case "content_block_delta":
            if (event.delta.type === "input_json_delta") {
                // Accumulate JSON input
                setStreamingToolUses(prev => {
                    const entry = prev.find(e => e.index === event.index);
                    if (entry) {
                        entry.unparsedToolInput += event.delta.partial_json;
                    }
                    return [...prev];
                });
            }
            break;

        case "content_block_stop":
            // Parse accumulated JSON
            setStreamingToolUses(prev => {
                const entry = prev.find(e => e.index === event.index);
                if (entry && entry.unparsedToolInput) {
                    try {
                        entry.contentBlock.input = JSON.parse(entry.unparsedToolInput);
                    } catch {
                        // Handle parse error
                    }
                }
                return [...prev];
            });
            break;
    }
}

// Mapping: xN6→handleToolUseStream
```

### Progress Indicator Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPINNER STATUS FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Stream Mode              Spinner State               Status Text           │
│  ───────────              ─────────────               ───────────           │
│                                                                              │
│  "requesting"            Animated dots              "Thinking..."           │
│  "responding"            None (text visible)         (streaming text)       │
│  "thinking"              Animated brain              "Thinking..."           │
│  "tool-input"            None (tool JSON visible)    (tool name)            │
│  "tool-use"              Spinner if executing        "Running [tool]..."     │
│                                                                              │
│  Spinner tip rotation:                                                       │
│  ─────────────────────                                                       │
│  Tips rotate every 5 seconds from tip pool:                                 │
│  • "Tip: Use Tab to accept suggestions"                                     │
│  • "Tip: Press Escape to cancel"                                            │
│  • "Tip: Ctrl+R opens message selector"                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - UI Interaction State Machine documented with keyboard flow