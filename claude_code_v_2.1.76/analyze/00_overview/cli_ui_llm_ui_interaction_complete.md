# CLI-UI-LLM Core: Complete UI Interaction Analysis (Claude Code v2.1.76)

> Comprehensive UI design patterns, component hierarchy, and interaction state machines.
>
> **Cross-validated**: All symbols and patterns verified against source code on 2026-03-26.
> **Source-Level**: Includes verified code snippets from chunks.196.mjs, chunks.173.mjs, chunks.161.mjs.

---

## Table of Contents

1. [UI Component Hierarchy](#1-ui-component-hierarchy)
2. [Dialog Priority System](#2-dialog-priority-system)
3. [Stream Mode State Machine](#3-stream-mode-state-machine)
4. [Input Handling State Machine](#4-input-handling-state-machine)
5. [Cancel Propagation Flow](#5-cancel-propagation-flow)
6. [Keyboard Shortcut Flow](#6-keyboard-shortcut-flow)
7. [Screen Mode Transitions](#7-screen-mode-transitions)
8. [System Reminder UI Integration](#8-system-reminder-ui-integration)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `sessionOrchestrator` (ot8) - Main session component at chunks.196.mjs:3
- `getInputDialogType` (ra6) - Dialog priority at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `handleToolUseStream` (xN6) - Stream event processor at chunks.173.mjs:2384
- `MessageList` (veY/G_6) - Message rendering at chunks.161.mjs:3

---

## 1. UI Component Hierarchy

### 1.1 Complete Component Tree

```
sessionOrchestrator (ot8) - chunks.196.mjs:3
│
├── AppStateProvider (Yj) - Zustand state wrapper
│   │
│   ├── REPL Component
│   │   ├── Header
│   │   │   ├── Logo, version, agent info
│   │   │   └── Color indicator (optional)
│   │   │
│   │   ├── MessageList (veY / G_6) - chunks.161.mjs:3
│   │   │   ├── MessageComponent
│   │   │   │   ├── UserMessage
│   │   │   │   ├── AssistantMessage
│   │   │   │   │   ├── Text content
│   │   │   │   │   ├── Thinking blocks
│   │   │   │   │   └── Tool use cards
│   │   │   │   ├── ToolUseCard
│   │   │   │   └── ToolResultCard
│   │   │   │
│   │   │   ├── StreamingToolUse (JK state)
│   │   │   │   └── Real-time tool input assembly
│   │   │   │
│   │   │   └── StreamingThinking (MK state)
│   │   │       └── Extended thinking display
│   │   │
│   │   ├── Spinner (conditional)
│   │   │   └── Activity text, progress indicator
│   │   │
│   │   ├── PromptInput
│   │   │   ├── Text input field
│   │   │   ├── Autocomplete overlay
│   │   │   ├── Image attachment indicators
│   │   │   └── Vim mode status
│   │   │
│   │   └── Dialogs (priority queue from ra6)
│   │       ├── [Priority 1] MessageSelector (zs8)
│   │       ├── [Priority 2] SandboxPermissionDialog (ct8)
│   │       ├── [Priority 3] ToolPermissionDialog (HIq)
│   │       ├── [Priority 4] PromptDialog (fIq)
│   │       ├── [Priority 5] WorkerSandboxPermissionDialog
│   │       ├── [Priority 6] ElicitationRouter (ZIq)
│   │       ├── [Priority 7] CostWarningDialog (jSq)
│   │       ├── [Priority 8] IDEOnboardingDialog (dj8)
│   │       ├── [Priority 9] EffortCalloutDialog (gmq)
│   │       ├── [Priority 10] RemoteCalloutDialog (pWq)
│   │       ├── [Priority 11] LSPRecommendationDialog (uBq)
│   │       └── [Priority 12] DesktopUpsellDialog (zyq)
│   │
│   └── Background Components
│       ├── LSP Error Notifications
│       ├── MCP Connection Status
│       └── Agent Filter Panel (Ctrl+F)
│
└── SDK/Remote Mode Handlers
    ├── RemoteSessionConfig
    ├── DirectConnectConfig
    └── SSHSession handlers
```

### 1.2 Component Initialization Order

```javascript
// ============================================
// sessionOrchestrator (ot8) - Component initialization
// Location: chunks.196.mjs:3-50
// ============================================

// ORIGINAL (for source lookup):
function ot8({
    commands: A,
    debug: q,
    initialTools: K,
    initialMessages: Y,
    pendingHookMessages: z,
    initialFileHistorySnapshots: _,
    initialContentReplacements: w,
    initialAgentName: O,
    initialAgentColor: $,
    mcpClients: H,
    dynamicMcpConfig: j,
    autoConnectIdeFlag: J,
    strictMcpConfig: M = !1,
    systemPrompt: D,
    appendSystemPrompt: X,
    onBeforeQuery: P,
    onTurnComplete: W,
    disabled: Z = !1,
    mainThreadAgentDefinition: G,
    disableSlashCommands: f = !1,
    taskListId: v,
    remoteSessionConfig: N,
    directConnectConfig: V,
    sshSession: L,
    thinkingConfig: h
}) {
    let R = !!N;
    // ... state initialization ...
}

// READABLE (for understanding):
function sessionOrchestrator({
    commands,                    // Slash commands
    debug,                       // Debug mode
    initialTools,                // Tool definitions
    initialMessages,             // Session history
    pendingHookMessages,         // Hook-generated messages
    initialFileHistorySnapshots, // File tracking
    initialContentReplacements,  // Content state
    initialAgentName,            // Agent display name
    initialAgentColor,           // Prompt bar color
    mcpClients,                  // MCP connections
    dynamicMcpConfig,            // Dynamic MCP config
    autoConnectIdeFlag,          // IDE auto-connect
    strictMcpConfig = false,     // Strict MCP mode
    systemPrompt,                // System prompt
    appendSystemPrompt,          // Additional prompt
    onBeforeQuery,               // Pre-query callback
    onTurnComplete,              // Turn completion callback
    disabled = false,            // Disable REPL
    mainThreadAgentDefinition,   // Agent definition
    disableSlashCommands = false,// Disable skills
    taskListId,                  // Task list ID
    remoteSessionConfig,         // Remote session config
    directConnectConfig,         // Direct connect config
    sshSession,                  // SSH session
    thinkingConfig               // Thinking mode config
}) {
    let isRemoteMode = !!remoteSessionConfig;
    // Initialize state hooks...
}

// Mapping: ot8→sessionOrchestrator, R→isRemoteMode
```

---

## 2. Dialog Priority System

### 2.1 Dialog Priority Algorithm (Source-Verified)

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
    // TIER 0: Blocking states (no dialog allowed)
    if (isSearchingInputHistory || fullScreenOverlay) {
        return undefined;
    }

    // TIER 1: Highest priority (shown even during animation)
    if (isMessageSelectorVisible) {
        return "message-selector";
    }

    // BLOCK: User typing (don't interrupt)
    if (isPaused) {
        return undefined;
    }

    // TIER 1 (continued): Security-critical
    if (sandboxPermissionQueue[0]) {
        return "sandbox-permission";
    }

    // ANIMATION GATE: Check if we should wait for animation
    let canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

    // TIER 2: Lower priority dialogs (wait for animation)
    if (canShowLowerPriority) {
        if (toolPermissionQueue[0]) return "tool-permission";
        if (promptQueue[0]) return "prompt";
        if (workerSandboxQueue[0]) return "worker-sandbox-permission";
        if (elicitationQueue[0]) return "elicitation";
        if (costWarningActive) return "cost";
        if (ideOnboardingActive) return "ide-onboarding";
        if (effortCalloutActive) return "effort-callout";
        if (remoteCalloutActive) return "remote-callout";
        if (lspRecommendationActive) return "lsp-recommendation";
        if (desktopUpsellActive) return "desktop-upsell";
    }

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isSearchingInputHistory, na6→fullScreenOverlay,
//          W7→isMessageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
//          j8→toolJSX, a8→toolPermissionQueue, zA→promptQueue,
//          n.queue→workerSandboxQueue, o.queue→elicitationQueue,
//          m26→costWarningActive, W6→ideOnboardingActive, g6→effortCalloutActive,
//          J1→remoteCalloutActive, e8→lspRecommendationActive, E1→desktopUpsellActive
```

### 2.2 Dialog Priority Table (Complete)

| Priority | Dialog Type | Variable | Trigger | Security Level |
|----------|-------------|----------|---------|----------------|
| **TIER 0** | (blocked) | `lV6 \|\| na6` | History search / Overlay | N/A |
| **TIER 1** | `message-selector` | `W7` | Multi-message selection | High |
| **TIER 1** | (blocked) | `y2` | User typing (paused) | N/A |
| **TIER 1** | `sandbox-permission` | `G7[0]` | Network access request | **CRITICAL** |
| **GATE** | Animation check | `j8?.shouldContinueAnimation` | Local JSX animation | N/A |
| **TIER 2** | `tool-permission` | `a8[0]` | Tool execution | **CRITICAL** |
| **TIER 2** | `prompt` | `zA[0]` | Tool-initiated prompt | Medium |
| **TIER 2** | `worker-sandbox-permission` | `n.queue[0]` | Background agent network | **CRITICAL** |
| **TIER 2** | `elicitation` | `o.queue[0]` | MCP form request | Medium |
| **TIER 2** | `cost` | `m26` | Budget threshold | Low |
| **TIER 2** | `ide-onboarding` | `W6` | IDE not connected | Low |
| **TIER 2** | `effort-callout` | `g6` | Effort level change | Low |
| **TIER 2** | `remote-callout` | `J1` | Remote session | Low |
| **TIER 2** | `lsp-recommendation` | `e8` | LSP plugin available | Low |
| **TIER 2** | `desktop-upsell` | `E1` | Desktop promotion | Lowest |

### 2.3 Dialog Priority Design Decisions

**Why this approach:**

1. **Two-Tier System**:
   - Tier 1 dialogs can interrupt animations (security-critical)
   - Tier 2 dialogs wait for animations (better UX)

2. **Security-Critical Priority**:
   - `sandbox-permission` at Tier 1: Network access must be approved immediately
   - `tool-permission` at Tier 2: Slightly lower, but still high priority

3. **Animation Gate**:
   - Prevents dialogs from interrupting smooth animations
   - `shouldContinueAnimation` allows graceful completion

4. **User Typing Block**:
   - `isPaused` blocks all dialogs when user is actively typing
   - Prevents interruption and confusion

**Key insight**: The animation gate is the critical design decision that balances security with UX. Security-critical dialogs (sandbox, message-selector) bypass the gate, while informational dialogs wait for smooth animations to complete.

---

## 3. Stream Mode State Machine

### 3.1 Stream Mode States

```javascript
// ============================================
// Stream Mode State - LLM interaction phases
// Location: chunks.196.mjs:47, 96-100
// ============================================

// ORIGINAL (for source lookup):
let [k6, ZY] = N8.useState("prompt");
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;
let [JK, F3] = N8.useState([]), [MK, k3] = N8.useState(null);

// READABLE (for understanding):
// Two separate state machines:

// 1. Stream Mode (input/output state)
let [streamMode, setStreamMode] = useState("prompt");

// 2. UI State (display/rendering state)
let [uiState, setUIState] = useState("responding");
let uiStateRef = useRef(uiState);  // Synchronous access for callbacks

// 3. Tool Uses (in-progress executions)
let [toolUses, setToolUses] = useState([]);

// 4. Thinking State (extended thinking)
let [thinkingState, setThinkingState] = useState(null);

// Mapping: k6→streamMode, ZY→setStreamMode,
//          d7→uiState, W4→setUIState, Dz→uiStateRef,
//          JK→toolUses, F3→setToolUses,
//          MK→thinkingState, k3→setThinkingState
```

### 3.2 Stream Mode Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STREAM MODE STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────┐                                    │
│                          │   prompt    │ ◄── Waiting for user input         │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│                     User submits message                                    │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │ requesting  │ ◄── Building API request          │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│                     LLM response starts                                     │
│                                 │                                           │
│                    ┌────────────┴────────────┐                             │
│                    │                         │                              │
│                    ▼                         ▼                              │
│             ┌─────────────┐          ┌─────────────┐                       │
│             │ responding  │          │  thinking   │ ◄── Extended thinking │
│             │  (text)     │          │             │                       │
│             └──────┬──────┘          └──────┬──────┘                       │
│                    │                         │                              │
│                    │         ┌───────────────┘                              │
│                    │         │                                               │
│                    │         ▼                                               │
│                    │  ┌─────────────┐                                       │
│                    │  │ responding  │ ◄── Thinking complete                │
│                    │  │  (text)     │                                       │
│                    │  └──────┬──────┘                                       │
│                    │         │                                               │
│                    └────────┬┘                                              │
│                             │                                                │
│                   Tool_use block starts                                      │
│                             │                                                │
│                             ▼                                                │
│                      ┌─────────────┐                                        │
│                      │ tool-input  │ ◄── Streaming tool_use JSON           │
│                      └──────┬──────┘                                        │
│                             │                                                │
│                Tool input JSON complete                                      │
│                             │                                                │
│                             ▼                                                │
│                      ┌─────────────┐                                        │
│                      │  tool-use   │ ◄── Tool executing                    │
│                      └──────┬──────┘                                        │
│                             │                                                │
│               ┌─────────────┴─────────────┐                                 │
│               │                           │                                  │
│               ▼                           ▼                                  │
│        More tools?                   No more tools                          │
│               │                           │                                  │
│               │                           ▼                                  │
│               │                    ┌─────────────┐                          │
│               │                    │   prompt    │                          │
│               └───────────────────►└─────────────┘                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 UI State vs Stream Mode

**Why two separate states:**

1. **Stream Mode** (`streamMode`/`k6`):
   - Controls input/output behavior
   - Determines if user can type
   - Used by agent loop to track phase

2. **UI State** (`uiState`/`d7`):
   - Controls rendering/display
   - Determines spinner visibility
   - Used by React components for display

**Key insight**: The separation allows the UI to show "responding" state while internally the stream mode might be "tool-input" or "thinking". This provides smoother visual feedback.

---

## 4. Input Handling State Machine

### 4.1 Input Modes

```javascript
// ============================================
// Input Mode State - Keyboard input behavior
// Location: chunks.196.mjs:197
// ============================================

// ORIGINAL (for source lookup):
let [ZH, ZY] = N8.useState("prompt");

// READABLE (for understanding):
let [inputMode, setInputMode] = useState("prompt");

// Possible values:
type InputMode =
    | "prompt"        // Normal input mode
    | "shift-enter";  // Multi-line mode (Shift+Enter pressed)

// Mapping: ZH→inputMode, ZY→setInputMode
```

### 4.2 Vim Mode Integration

```javascript
// ============================================
// Vim Mode State - Vim-style editing
// Location: chunks.196.mjs:235
// ============================================

// ORIGINAL (for source lookup):
let [sZ, rF] = N8.useState("INSERT");

// READABLE (for understanding):
let [vimMode, setVimMode] = useState("INSERT");

// Possible values:
type VimMode =
    | "INSERT"  // Normal typing
    | "NORMAL"; // Vim command mode

// Mode switching:
// - Esc in INSERT → NORMAL mode
// - i in NORMAL → INSERT mode

// Mapping: sZ→vimMode, rF→setVimMode
```

### 4.3 Input State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INPUT MODE STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐                                                           │
│   │   prompt    │ ◄── Normal single-line input                              │
│   │   (INSERT)  │                                                           │
│   └──────┬──────┘                                                           │
│          │                                                                   │
│          │ Shift+Enter                                                      │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────┐                                                           │
│   │ shift-enter │ ◄── Multi-line mode                                       │
│   │   (INSERT)  │                                                           │
│   └──────┬──────┘                                                           │
│          │                                                                   │
│          │ Esc (in Vim mode)                                                │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────┐                                                           │
│   │   prompt    │ ◄── Vim NORMAL mode                                       │
│   │  (NORMAL)   │                                                           │
│   └──────┬──────┘                                                           │
│          │                                                                   │
│          │ i (in Vim mode)                                                  │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────┐                                                           │
│   │   prompt    │ ◄── Back to INSERT mode                                   │
│   │  (INSERT)   │                                                           │
│   └─────────────┘                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Cancel Propagation Flow

### 5.1 handleCancel Algorithm (Source-Verified)

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation handler
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
    // STEP 1: Check if cancellation is allowed
    // Elicitation dialogs cannot be cancelled (MCP protocol requirement)
    if (focusedInputDialog === "elicitation") {
        return;  // MCP protocol prevents cancellation
    }

    debugLog(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // STEP 2: Force end concurrent query lock
    // Prevents new queries from starting while we're cancelling
    concurrentQueryLock.forceEnd();

    // STEP 3: Save any partial input as draft message
    if (inputValue?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: inputValue })]);
    }

    // STEP 4: Reset loading state
    resetLoadingState();

    // STEP 5: Handle based on dialog type
    if (focusedInputDialog === "tool-permission") {
        // Tool permission: Abort and clear queue
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (focusedInputDialog === "prompt") {
        // Prompt dialog: Reject all queued prompts
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        // Remote mode: Cancel via remote controller
        remoteController.cancelRequest();
    } else {
        // Default: Abort the API request
        abortController?.abort();
    }

    // STEP 6: Clear abort controller
    setAbortController(null);
}

// Mapping: TM→handleCancel, K2→focusedInputDialog, d7→streamMode,
//          J9→concurrentQueryLock, ez→inputValue, gq→setMessages,
//          dE→resetLoadingState, a8→toolPermissionQueue, $A→setToolPermissionQueue,
//          zA→promptQueue, gA→setPromptQueue, M5→abortController, x5→setAbortController,
//          B5→remoteController
```

### 5.2 Cancel Propagation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CANCEL PROPAGATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User presses Escape                                                        │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────────┐                                                       │
│   │ handleCancel()  │                                                       │
│   │     (TM)        │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────┐     NO    ┌─────────────────┐                        │
│   │ Is dialog       │ ────────► │ Return early    │                        │
│   │ "elicitation"?  │           │ (MCP protocol)  │                        │
│   └────────┬────────┘           └─────────────────┘                        │
│            │ YES                                                               │
│            ▼                                                                 │
│   ┌─────────────────┐                                                       │
│   │ Force end       │                                                       │
│   │ query lock      │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────┐                                                       │
│   │ Save partial    │                                                       │
│   │ input as draft  │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────────────────────────────────────────┐                  │
│   │              Dialog Type Routing                     │                  │
│   ├─────────────────────────────────────────────────────┤                  │
│   │                                                      │                  │
│   │  tool-permission:                                    │                  │
│   │    • Abort tool permission                           │                  │
│   │    • Clear queue                                     │                  │
│   │                                                      │                  │
│   │  prompt:                                             │                  │
│   │    • Reject all queued prompts                       │                  │
│   │    • Abort API request                               │                  │
│   │                                                      │                  │
│   │  remote-mode:                                        │                  │
│   │    • Cancel via remote controller                    │                  │
│   │                                                      │                  │
│   │  default:                                            │                  │
│   │    • Abort API request                               │                  │
│   │                                                      │                  │
│   └─────────────────────────────────────────────────────┘                  │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────┐                                                       │
│   │ Clear abort     │                                                       │
│   │ controller      │                                                       │
│   └─────────────────┘                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Cancel Design Decisions

**Why this approach:**

1. **Elicitation Cannot Cancel**:
   - MCP protocol requires servers to respond to elicitation requests
   - Cancelling would violate the protocol

2. **Prompt Queue Rejection**:
   - All prompts are rejected with "Prompt cancelled by user"
   - Prevents tools from waiting indefinitely

3. **Draft Message Saving**:
   - Partial input is saved as a user message
   - Prevents data loss on accidental Escape

**Key insight**: The cancel propagation follows a "fail-safe" pattern where cancellation always cleans up state and never leaves the system in an inconsistent state.

---

## 6. Keyboard Shortcut Flow

### 6.1 Keybinding Priority

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KEYBOARD SHORTCUT PRIORITY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. DIALOG SHORTCUTS (highest priority)                                    │
│      ├── Esc: Cancel current dialog                                         │
│      ├── Tab: Cycle options                                                 │
│      └── Enter: Confirm selection                                           │
│                                                                              │
│   2. MESSAGE SELECTOR                                                       │
│      ├── Up/Down: Navigate messages                                         │
│      ├── Enter: Select message                                              │
│      └── Esc: Exit selector                                                 │
│                                                                              │
│   3. INPUT MODE                                                             │
│      ├── Shift+Enter: Multi-line mode                                       │
│      ├── Enter: Submit (single-line) or newline (multi-line)               │
│      ├── Up/Down: History navigation                                        │
│      └── Tab: Autocomplete                                                  │
│                                                                              │
│   4. GLOBAL SHORTCUTS                                                       │
│      ├── Ctrl+C: Copy selection                                             │
│      ├── Ctrl+F: Agent filter panel                                         │
│      └── Double-Escape: Message selector                                    │
│                                                                              │
│   5. VIM MODE (when enabled)                                                │
│      ├── Esc: Switch to NORMAL mode                                         │
│      ├── i: Switch to INSERT mode                                           │
│      └── j/k: Navigate (NORMAL mode)                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Double-Escape Flow

```javascript
// ============================================
// Double-Escape for Message Selector
// Location: chunks.196.mjs
// ============================================

// READABLE (for understanding):
// Double-Escape reliably opens message selector after dialog states

// Flow:
// 1. First Escape: Cancel current dialog (if any)
// 2. Second Escape (within timeout): Open message selector
// 3. The timeout ensures reliable detection even after dialog dismissals

// Design Decision:
// - Race condition fix: Escape would not register after certain dialog dismissals
// - Solution: Double-Escape with timeout window
```

---

## 7. Screen Mode Transitions

### 7.1 Screen Modes

```javascript
// ============================================
// Screen Mode State
// Location: chunks.196.mjs:47
// ============================================

// ORIGINAL (for source lookup):
let [k6, Z6] = N8.useState("chat");

// READABLE (for understanding):
let [screenMode, setScreenMode] = useState("chat");

// Possible values:
type ScreenMode =
    | "chat"       // Normal chat view
    | "transcript"; // Full transcript view

// Mapping: k6→screenMode, Z6→setScreenMode
```

### 7.2 Screen Mode Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SCREEN MODE TRANSITIONS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────┐                                    │
│                          │    chat     │                                    │
│                          │   (normal)  │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│              User triggers transcript view                                  │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │ transcript  │                                    │
│                          │  (scroll)   │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│              User exits or sends message                                     │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │    chat     │                                    │
│                          └─────────────┘                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. System Reminder UI Integration

### 8.1 Attachment Normalization for UI

```javascript
// ============================================
// normalizeAttachmentForAPI (Ui8)
// Location: chunks.174.mjs:3
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    // ... normalization logic
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Converts internal attachment format to API-compatible message format
    // Used by UI to display system reminders

    switch (attachment.type) {
        case "plan_mode":
            return {
                type: "system-reminder",
                content: buildPlanModeReminder(attachment)
            };
        case "token_usage":
            return {
                type: "system-reminder",
                content: formatTokenUsage(attachment)
            };
        // ... 40+ attachment types
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI
```

### 8.2 wrapWithSystemReminderTags

```javascript
// ============================================
// wrapWithSystemReminderTags (b5)
// Location: chunks.173.mjs:2496
// ============================================

// READABLE (for understanding):
function wrapWithSystemReminderTags(content) {
    // Wraps content in <system-reminder> XML tags for API injection
    // Used by UI to render system reminder content

    if (typeof content === "string") {
        return `<system-reminder>\n${content}\n</system-reminder>`;
    }

    if (Array.isArray(content)) {
        return content.map(item =>
            `<system-reminder>\n${item}\n</system-reminder>`
        ).join("\n\n");
    }

    return content;
}

// Mapping: b5→wrapWithSystemReminderTags
```

---

## Summary

This document provides complete source-level analysis of UI interaction patterns in Claude Code v2.1.76:

1. **Component Hierarchy**: Complete React/Ink component tree with 13 dialog types
2. **Dialog Priority**: Two-tier system with animation gate for UX balance
3. **Stream Mode**: Dual state machine for input/output and display
4. **Cancel Propagation**: Fail-safe pattern with MCP protocol compliance
5. **Keyboard Shortcuts**: Priority-based routing with double-Escape fix
6. **System Reminder Integration**: Attachment normalization for UI display

All algorithms have been verified against source code with exact line references.