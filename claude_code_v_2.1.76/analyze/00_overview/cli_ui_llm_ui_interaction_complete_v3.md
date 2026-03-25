# UI Design Interaction Complete v3 (Claude Code 2.1.76)

> Comprehensive documentation of UI design patterns, interaction flows, and React/Ink architecture.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode.
> **Integration**: Full cross-module interaction with CLI and LLM Core.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Component Hierarchy](#2-component-hierarchy)
3. [Dialog System Complete](#3-dialog-system-complete)
4. [Stream Mode State Machine](#4-stream-mode-state-machine)
5. [Keyboard Interaction Patterns](#5-keyboard-interaction-patterns)
6. [Message Rendering Pipeline](#6-message-rendering-pipeline)
7. [Performance Optimization Patterns](#7-performance-optimization-patterns)

---

## 1. Architecture Overview

### 1.1 React/Ink Architecture

Claude Code uses **Ink** (React for CLI) to provide a responsive, component-based terminal interface.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REACT/INK ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    sessionOrchestrator (ot8)                         │   │
│   │                                                                       │   │
│   │  Responsibilities:                                                   │   │
│   │  • State management (createStateStore)                              │   │
│   │  • Event handling (onQuery, handleCancel)                           │   │
│   │  • Dialog coordination (getInputDialogType)                         │   │
│   │  • Stream mode management                                            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      AppStateProvider (Yj)                           │   │
│   │                                                                       │   │
│   │  Context:                                                            │   │
│   │  • Tool permission context                                          │   │
│   │  • MCP clients                                                      │   │
│   │  • Plugin commands                                                  │   │
│   │  • Agent definitions                                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                            REPL                                      │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │ Header (Logo, Version, Agent Info)                           │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │ MessageList (G_6)                                            │    │   │
│   │  │   ├─ UserMessage                                             │    │   │
│   │  │   ├─ AssistantMessage                                        │    │   │
│   │  │   ├─ ToolUseCard                                             │    │   │
│   │  │   └─ ToolResultCard                                          │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │ Spinner (conditional)                                        │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │ PromptInput                                                  │    │   │
│   │  │   ├─ Autocomplete overlay                                    │    │   │
│   │  │   ├─ Image attachment indicators                             │    │   │
│   │  │   └─ Vim mode status                                         │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │ Dialogs (priority queue from ra6)                            │    │   │
│   │  │   ├─ MessageSelector (zs8)                                   │    │   │
│   │  │   ├─ SandboxPermissionDialog (ct8)                           │    │   │
│   │  │   ├─ ToolPermissionDialog (HIq)                              │    │   │
│   │  │   ├─ PromptDialog (fIq)                                      │    │   │
│   │  │   ├─ ElicitationRouter (ZIq)                                 │    │   │
│   │  │   └─ ... 8 more dialog types                                 │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 State Management

```javascript
// ============================================
// createStateStore (WX1) - Observable state store
// Location: chunks.85.mjs:1747-1766
// ============================================

// ORIGINAL (for source lookup):
function WX1(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let _ = K, w = z(_);
            if (Object.is(w, _)) return;
            K = w, q?.({newState: w, oldState: _});
            for (let $ of Y) $();
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z); }
    };
}

// READABLE (for understanding):
function createStateStore(initialState, onStateChange) {
    let state = initialState;
    let listeners = new Set();

    return {
        getState: () => state,

        setState: (updater) => {
            let oldState = state;
            let newState = updater(oldState);

            // Skip update if state is identical (reference equality)
            if (Object.is(newState, oldState)) return;

            state = newState;

            // Notify state change callback
            onStateChange?.({ newState, oldState });

            // Notify all subscribers
            for (let listener of listeners) {
                listener();
            }
        },

        subscribe: (listener) => {
            listeners.add(listener);
            // Return unsubscribe function
            return () => listeners.delete(listener);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onStateChange, K→state, Y→listeners
```

**Why this approach**:
- Simple observable pattern without Redux complexity
- Reference equality check prevents unnecessary re-renders
- Subscriber pattern enables React-agnostic state updates
- `onStateChange` callback enables logging and debugging

---

## 2. Component Hierarchy

### 2.1 sessionOrchestrator (ot8)

The main orchestrator component that manages the entire session.

```javascript
// ============================================
// sessionOrchestrator - Main session orchestrator
// Location: chunks.196.mjs:3-200
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
    // ... 150+ lines of state initialization ...
    let [k6, Z6] = N8.useState("prompt"), // streamMode
        [u6, C6] = N8.useState(!1),
        // ... more state hooks ...
}

// READABLE (for understanding):
function sessionOrchestrator({
    commands,                  // Slash commands
    debug,                     // Debug mode
    initialTools,              // Initial tool set
    initialMessages,           // Conversation history
    pendingHookMessages,       // Hook results to process
    initialFileHistorySnapshots,
    initialContentReplacements,
    initialAgentName,
    initialAgentColor,
    mcpClients,                // MCP server connections
    dynamicMcpConfig,
    autoConnectIdeFlag,
    strictMcpConfig = false,
    systemPrompt,
    appendSystemPrompt,
    onBeforeQuery,             // Pre-query callback
    onTurnComplete,            // Post-turn callback
    disabled = false,
    mainThreadAgentDefinition,
    disableSlashCommands = false,
    taskListId,
    remoteSessionConfig,       // Remote session settings
    directConnectConfig,
    sshSession,
    thinkingConfig             // Extended thinking config
}) {
    // State hooks
    const [streamMode, setStreamMode] = useState("prompt");
    const [messages, setMessages] = useState(initialMessages);
    const [toolUseConfirmQueue, setToolUseConfirmQueue] = useState([]);
    const [promptQueue, setPromptQueue] = useState([]);
    const [sandboxRequestQueue, setSandboxRequestQueue] = useState([]);

    // Derived state from Zustand store
    const toolPermissionContext = useAppState(state => state.toolPermissionContext);
    const mcp = useAppState(state => state.mcp);
    const plugins = useAppState(state => state.plugins);

    // Dialog type determination
    const currentDialogType = getInputDialogType();

    // Cancel handler
    function handleCancel() { /* ... */ }

    // Query execution
    async function executeQuery(query) { /* ... */ }

    // Render
    return (
        <AppStateProvider>
            <REPL
                messages={messages}
                streamMode={streamMode}
                dialogType={currentDialogType}
                onCancel={handleCancel}
                onQuery={executeQuery}
                // ... more props
            />
        </AppStateProvider>
    );
}

// Mapping: ot8→sessionOrchestrator, k6→streamMode, Z6→setStreamMode
```

### 2.2 Component Tree

```
sessionOrchestrator (ot8)
│
├── AppStateProvider (Yj)
│   │
│   └── REPL
│       │
│       ├── Header
│       │   ├── Logo
│       │   ├── Version display
│       │   └── Agent info
│       │
│       ├── MessageList (G_6)
│       │   │
│       │   ├── MessageComponent (per message)
│       │   │   ├── UserMessage
│       │   │   ├── AssistantMessage
│       │   │   ├── ToolUseCard
│       │   │   └── ToolResultCard
│       │   │
│       │   ├── StreamingToolUse (during tool execution)
│       │   └── StreamingThinking (during extended thinking)
│       │
│       ├── Spinner (conditional)
│       │   └── Activity text, progress indicator
│       │
│       ├── PromptInput
│       │   ├── Input field
│       │   ├── Autocomplete overlay
│       │   ├── Image attachment indicators
│       │   └── Vim mode status
│       │
│       └── Dialogs (only one visible at a time)
│           ├── MessageSelector (zs8)
│           ├── SandboxPermissionDialog (ct8)
│           ├── ToolPermissionDialog (HIq)
│           ├── PromptDialog (fIq)
│           ├── WorkerSandboxPermissionDialog
│           ├── ElicitationRouter (ZIq)
│           ├── CostWarningDialog (jSq)
│           ├── IDEOnboardingDialog (dj8)
│           ├── EffortCalloutDialog (gmq)
│           ├── RemoteCalloutDialog (pWq)
│           ├── LSPRecommendationDialog (uBq)
│           └── DesktopUpsellDialog (zyq)
```

---

## 3. Dialog System Complete

### 3.1 Dialog Priority Algorithm

The dialog system uses a priority-based approach where only one dialog can be active at a time.

```javascript
// ============================================
// getInputDialogType - Priority-based dialog dispatcher
// Location: chunks.196.mjs:387-403
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
    // GUARD: Block all dialogs during cost animation or unconfirmed cost
    if (isCostWarningAnimating || hasUnconfirmedCost) {
        return undefined;  // No dialog
    }

    // PRIORITY 1: Message selector (highest user-facing priority)
    // Allows user to navigate and select previous messages
    if (isMessageSelectorVisible) {
        return "message-selector";
    }

    // GUARD: Block dialogs during active streaming
    if (isStreamActive) {
        return undefined;
    }

    // PRIORITY 2: Sandbox permission (security critical)
    // Network access, file system sandbox permissions
    if (sandboxPermissionQueue[0]) {
        return "sandbox-permission";
    }

    // Animation continuity check for lower priority dialogs
    // If current tool is animating and shouldn't be interrupted, skip
    const shouldContinueAnimation = !toolUseConfirm || toolUseConfirm.shouldContinueAnimation;

    // PRIORITY 3: Tool permission
    // Tool execution approval
    if (shouldContinueAnimation && toolPermissionQueue[0]) {
        return "tool-permission";
    }

    // PRIORITY 4: Tool-initiated prompt
    // Tool needs user input during execution
    if (shouldContinueAnimation && promptQueue[0]) {
        return "prompt";
    }

    // PRIORITY 5: Worker sandbox permission
    // Background worker sandbox requests
    if (shouldContinueAnimation && workerSandboxQueue[0]) {
        return "worker-sandbox-permission";
    }

    // PRIORITY 6: MCP elicitation
    // MCP server needs user input (forms, etc.)
    if (shouldContinueAnimation && elicitationQueue[0]) {
        return "elicitation";
    }

    // PRIORITY 7: Cost warning
    // Cost threshold reached warning
    if (shouldContinueAnimation && hasCostWarning) {
        return "cost";
    }

    // PRIORITY 8: IDE onboarding
    // IDE detected, show onboarding
    if (shouldContinueAnimation && showIdeOnboarding) {
        return "ide-onboarding";
    }

    // PRIORITY 9: Effort callout
    // Extended thinking effort selection
    if (shouldContinueAnimation && showEffortCallout) {
        return "effort-callout";
    }

    // PRIORITY 10: Remote callout
    // Remote session features
    if (shouldContinueAnimation && showRemoteCallout) {
        return "remote-callout";
    }

    // PRIORITY 11: LSP recommendation
    // LSP plugin recommendations
    if (shouldContinueAnimation && lspRecommendation) {
        return "lsp-recommendation";
    }

    // PRIORITY 12: Desktop upsell (lowest priority)
    // Desktop app promotion
    if (shouldContinueAnimation && showDesktopUpsell) {
        return "desktop-upsell";
    }

    return undefined;  // No dialog to show
}
```

### 3.2 Dialog Types and Behaviors

| Dialog Type | Priority | Trigger | Cancel Key | Cancel Behavior |
|-------------|----------|---------|------------|-----------------|
| `message-selector` | 1 | Double-Escape | Escape | Closes selector |
| `sandbox-permission` | 2 | Network/sandbox request | Escape | Rejects permission |
| `tool-permission` | 3 | Tool needs approval | Escape | Aborts tool, clears queue |
| `prompt` | 4 | Tool needs user input | Escape | Rejects ALL queued prompts |
| `worker-sandbox-permission` | 5 | Background worker | Escape | Rejects permission |
| `elicitation` | 6 | MCP form request | N/A | Must respond (no cancel) |
| `cost` | 7 | Cost threshold | Enter | Acknowledges warning |
| `ide-onboarding` | 8 | IDE detected | Escape | Dismisses onboarding |
| `effort-callout` | 9 | Effort selection | Escape | Uses default (medium) |
| `remote-callout` | 10 | Remote session | Escape | Acknowledges |
| `lsp-recommendation` | 11 | LSP plugin available | Escape | Dismisses |
| `desktop-upsell` | 12 | Desktop promotion | Escape | Dismisses |

### 3.3 Cancel Propagation

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation handler
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim())
        gq((P1) => [...P1, $Z({ content: ez })]);
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
    // ELICITATION: Cannot be cancelled - user must respond to MCP form
    if (currentDialogType === "elicitation") {
        return;
    }

    logDebug(`[onCancel] focusedInputDialog=${currentDialogType} streamMode=${streamMode}`);

    // Force end any ongoing animation
    animationManager.forceEnd();

    // Flush pending input text to messages (don't lose user input)
    if (pendingInputText?.trim()) {
        appendToMessages(createUserMessage({ content: pendingInputText }));
    }

    // Reset loading state (clear streaming buffers)
    resetLoadingState();

    // DIALOG-SPECIFIC CANCEL HANDLING

    if (currentDialogType === "tool-permission") {
        // Abort the pending tool permission request
        toolPermissionQueue[0]?.onAbort();
        clearToolPermissionQueue([]);
    }
    else if (currentDialogType === "prompt") {
        // CRITICAL: Reject ALL queued prompts, not just the first
        // This prevents tool execution from hanging on subsequent prompts
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        clearPromptQueue([]);
        // Abort the streaming request entirely
        abortController?.abort();
    }
    else if (remoteSessionManager.isRemoteMode) {
        // Remote session: use remote-specific cancel
        remoteSessionManager.cancelRequest();
    }
    else {
        // Default: abort the current request
        abortController?.abort();
    }

    // Clear pending tool use state
    setPendingToolUse(null);
}
```

---

## 4. Stream Mode State Machine

### 4.1 State Definitions

| State | Description | UI Behavior |
|-------|-------------|-------------|
| `prompt` | Waiting for user input | Input enabled, no spinner |
| `requesting` | Building/sending request | Spinner active, input disabled |
| `responding` | Receiving text response | Streaming display, input disabled |
| `thinking` | Extended thinking active | Thinking block visible, input disabled |
| `tool-input` | Tool needs user input | Prompt dialog visible |
| `tool-use` | Executing tools | Tool cards visible, input disabled |

### 4.2 State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STREAM MODE STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              User submits                                    │
│                                  │                                           │
│                                  ▼                                           │
│   ┌──────────┐            ┌──────────┐                                      │
│   │  PROMPT  │───────────►│REQUESTING│                                      │
│   │          │            │          │                                      │
│   │ Waiting  │            │ Building │                                      │
│   │ for      │            │ request  │                                      │
│   │ input    │            └────┬─────┘                                      │
│   └──────────┘                 │                                            │
│        ▲                       │ API connection established                 │
│        │                       ▼                                            │
│        │                ┌──────────┐                                        │
│        │                │RESPONDING│◄───────────────────┐                   │
│        │                │          │                    │                   │
│        │                │ Text     │                    │                   │
│        │                │ streaming│                    │                   │
│        │                └────┬─────┘                    │                   │
│        │                     │                          │                   │
│        │    ┌────────────────┼────────────────┐        │                   │
│        │    │                │                │        │                   │
│        │    ▼                ▼                ▼        │                   │
│        │ ┌────────┐   ┌──────────┐    ┌──────────┐    │                   │
│        │ │TOOL-USE│   │TOOL-INPUT│    │ THINKING │    │                   │
│        │ │        │   │          │    │          │    │                   │
│        │ │Tool    │   │Waiting   │    │Extended  │    │                   │
│        │ │exec    │   │for input │    │thinking  │    │                   │
│        │ └───┬────┘   └────┬─────┘    └────┬─────┘    │                   │
│        │     │             │               │          │                   │
│        │     │             └───────────────┘          │                   │
│        │     │                    │                   │                   │
│        │     └────────────────────┼───────────────────┘                   │
│        │                          │                                       │
│        │         message_stop, no more tools                             │
│        └──────────────────────────┘                                       │
│                                                                             │
│   Transitions:                                                              │
│   • prompt → requesting: User submits query                                │
│   • requesting → responding: SSE connection established                    │
│   • responding → thinking: content_block_start (thinking)                 │
│   • thinking → responding: content_block_stop (thinking)                  │
│   • responding → tool-use: content_block_start (tool_use)                 │
│   • tool-use → tool-input: Tool needs user input                          │
│   • tool-input → tool-use: Input provided or timeout                      │
│   • tool-use → prompt: message_stop (no more tools)                       │
│   • * → prompt: Error or abort                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Stream Mode Update Logic

```javascript
// ============================================
// handleStreamedEvent - Stream event processor
// Location: chunks.196.mjs (inferred)
// ============================================

// READABLE (for understanding):
function handleStreamedEvent(event) {
    switch (event.type) {
        case "stream_request_start":
            setStreamMode("requesting");
            break;

        case "stream_event":
            handleStreamEvent(event.event);
            break;

        case "assistant":
            // Complete assistant message
            appendToMessages(event.message);
            break;

        case "user":
            // Tool result message
            appendToMessages(event.message);
            break;
    }
}

function handleStreamEvent(streamEvent) {
    switch (streamEvent.type) {
        case "content_block_start":
            if (streamEvent.content_block.type === "thinking") {
                setStreamMode("thinking");
            } else if (streamEvent.content_block.type === "tool_use") {
                setStreamMode("tool-use");
                addStreamingToolUse(streamEvent.content_block);
            }
            break;

        case "content_block_delta":
            // Update streaming content
            updateStreamingContent(streamEvent);
            break;

        case "content_block_stop":
            if (streamMode === "thinking") {
                setStreamMode("responding");
            } else if (streamMode === "tool-use") {
                // Tool execution may transition to tool-input
                // if tool needs user input
            }
            break;

        case "message_stop":
            // Check if tools need execution
            if (hasPendingToolUse()) {
                // Will continue to next turn
            } else {
                setStreamMode("prompt");
            }
            break;
    }
}
```

---

## 5. Keyboard Interaction Patterns

### 5.1 Input Mode State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INPUT MODE STATE MACHINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────┐                                                              │
│   │  NORMAL  │◄────────────────────────────────────────────────────────┐   │
│   │          │                                                          │   │
│   │ Default  │                                                          │   │
│   │ input    │                                                          │   │
│   └────┬─────┘                                                          │   │
│        │                                                                  │   │
│        │ i (in normal mode)                                              │   │
│        ▼                                                                  │   │
│   ┌──────────┐     Escape          ┌──────────┐                         │   │
│   │   VIM    │────────────────────►│  NORMAL  │                         │   │
│   │  INSERT  │                     │          │                         │   │
│   │          │◄────────────────────│          │                         │   │
│   └────┬─────┘     i               └──────────┘                         │   │
│        │                                                                  │   │
│        │ Escape                                                          │   │
│        ▼                                                                  │   │
│   ┌──────────┐                                                           │   │
│   │   VIM    │                                                           │   │
│   │  NORMAL  │──────────────────────────────────────────────────────────┘   │
│   │          │                                                               │
│   │ Vim      │                                                               │
│   │ commands │                                                               │
│   └──────────┘                                                               │
│                                                                              │
│   Vim Commands (in VIM NORMAL mode):                                        │
│   • i - Enter insert mode                                                   │
│   • : - Command mode                                                        │
│   • / - Search mode                                                         │
│   • dd - Delete line                                                        │
│   • yy - Yank line                                                          │
│   • p - Paste                                                               │
│   • u - Undo                                                                │
│   • Ctrl+r - Redo                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Chord Detection

Chord keybindings (e.g., Ctrl+K then Ctrl+S) are detected using a state machine:

```javascript
// ============================================
// Chord detection state machine
// ============================================

// READABLE (for understanding):
class ChordDetector {
    constructor(keybindings) {
        this.keybindings = keybindings;
        this.pendingChord = null;
        this.chordTimeout = null;
    }

    handleKey(key, modifiers) {
        // If we have a pending chord, check for completion
        if (this.pendingChord) {
            clearTimeout(this.chordTimeout);
            const chord = this.pendingChord + " " + key;
            const binding = this.keybindings[chord];

            if (binding) {
                // Chord completed
                this.pendingChord = null;
                return { action: binding.action, complete: true };
            } else {
                // Chord not found, start new
                this.pendingChord = key;
                return { action: null, waiting: true };
            }
        }

        // Check if this key starts a chord
        const potentialChords = this.keybindings.filter(k => k.startsWith(key + " "));
        if (potentialChords.length > 0) {
            // Start chord timeout
            this.pendingChord = key;
            this.chordTimeout = setTimeout(() => {
                // Chord timeout - execute single key action
                this.pendingChord = null;
            }, 500);
            return { action: null, waiting: true };
        }

        // Single key action
        const binding = this.keybindings[key];
        return { action: binding?.action, complete: true };
    }
}
```

### 5.3 Keybinding Priority

```
Key Event Flow:
──────────────

1. Dialog-focused keys (highest priority)
   └─ If dialog visible, handle dialog-specific keys

2. Stream mode keys
   └─ If streaming, handle stream-specific keys (Escape to cancel)

3. Input mode keys
   └─ If in vim mode, handle vim keys
   └─ Otherwise, handle normal input

4. Global keys (lowest priority)
   └─ Ctrl+C: Interrupt
   └─ Ctrl+D: Exit
   └─ Ctrl+L: Clear screen
```

---

## 6. Message Rendering Pipeline

### 6.1 Rendering Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MESSAGE RENDERING PIPELINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Stage 1: Message Collection                                               │
│   ────────────────────────────                                              │
│   • Collect messages from state                                             │
│   • Apply visibility filter (shouldShowMessageInChat)                      │
│   • Truncate if exceeding MAX_RENDER_MESSAGES                              │
│                                                                              │
│                              │                                              │
│                              ▼                                              │
│                                                                              │
│   Stage 2: Normalization                                                    │
│   ────────────────────────────                                              │
│   • normalizeMessages (cM) - Convert to API format                         │
│   • flattenMessages (JM) - Split multi-content messages                    │
│   • filterEmptyMessages (Gi6) - Remove empty content                       │
│   • groupToolsWithHooks (pjq) - Reorder tool results with hooks            │
│                                                                              │
│                              │                                              │
│                              ▼                                              │
│                                                                              │
│   Stage 3: Content Rendering                                                │
│   ────────────────────────────                                              │
│   • UserMessage: Render user text and images                               │
│   • AssistantMessage: Render assistant text and thinking                   │
│   • ToolUseCard: Render tool invocation with parameters                    │
│   • ToolResultCard: Render tool result with status                         │
│                                                                              │
│                              │                                              │
│                              ▼                                              │
│                                                                              │
│   Stage 4: Deferred Rendering                                               │
│   ────────────────────────────                                              │
│   • Batch updates using React.useDeferredValue                             │
│   • Keep input responsive during heavy rendering                           │
│   • Spinner uses separate animation loop (50ms)                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Message Normalization

```javascript
// ============================================
// normalizeMessages (cM) - Message format conversion
// Location: chunks.173.mjs:1999
// ============================================

// READABLE (for understanding):
function normalizeMessages(messages) {
    return messages.map(message => {
        if (message.role === "user") {
            return normalizeUserMessage(message);
        } else if (message.role === "assistant") {
            return normalizeAssistantMessage(message);
        }
        return message;
    });
}

function normalizeUserMessage(message) {
    // Convert content to API format
    if (typeof message.content === "string") {
        return {
            ...message,
            content: [{ type: "text", text: message.content }]
        };
    }

    // Handle images
    const content = [];
    for (const block of message.content) {
        if (block.type === "image") {
            content.push({
                type: "image",
                source: {
                    type: "base64",
                    media_type: block.mediaType,
                    data: block.data
                }
            });
        } else {
            content.push(block);
        }
    }

    return { ...message, content };
}

// Mapping: cM→normalizeMessages
```

---

## 7. Performance Optimization Patterns

### 7.1 Deferred Rendering

```javascript
// ============================================
// Deferred rendering for input responsiveness
// ============================================

// READABLE (for understanding):
function MessageList({ messages, streamMode }) {
    // Defer message rendering to keep input responsive
    const deferredMessages = React.useDeferredValue(messages);

    // Stream mode takes priority
    const showStreaming = streamMode !== "prompt";

    return (
        <Box flexDirection="column">
            {/* Streaming content renders immediately */}
            {showStreaming && <StreamingContent />}

            {/* Message list uses deferred value */}
            {deferredMessages.map(message => (
                <MessageComponent key={message.uuid} message={message} />
            ))}
        </Box>
    );
}
```

### 7.2 Spinner Isolation

```javascript
// ============================================
// Spinner uses dedicated animation loop
// ============================================

// READABLE (for understanding):
function Spinner({ streamMode }) {
    const [frame, setFrame] = useState(0);
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

    useEffect(() => {
        if (streamMode === "prompt") return;

        // 50ms animation loop (separate from React render cycle)
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % frames.length);
        }, 50);

        return () => clearInterval(interval);
    }, [streamMode]);

    if (streamMode === "prompt") return null;

    return (
        <Box>
            <Text color="cyan">{frames[frame]}</Text>
            <Text> {getActivityText(streamMode)}</Text>
        </Box>
    );
}
```

### 7.3 Memory Leak Prevention

```javascript
// ============================================
// resetLoadingState - Clear streaming buffers
// Location: chunks.196.mjs:260
// ============================================

// READABLE (for understanding):
function resetLoadingState() {
    // Clear streaming tool uses
    setStreamingToolUses([]);

    // Clear streaming thinking state
    setStreamingThinking(null);

    // Reset response length tracker
    setResponseLength(0);

    // Clear any pending progress
    pendingProgressRef.current = [];
}

// This is called on:
// - Stream completion
// - Error/abort
// - User cancel
// To prevent memory leaks from retained streaming buffers
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Key components in this document:
- `sessionOrchestrator` (`ot8`) - Main orchestrator at chunks.196.mjs:3
- `getInputDialogType` (`ra6`) - Dialog dispatcher at chunks.196.mjs:387
- `handleCancel` (`TM`) - Cancel handler at chunks.196.mjs:420
- `createStateStore` (`WX1`) - State store at chunks.85.mjs:1747
- `normalizeMessages` (`cM`) - Message normalizer at chunks.173.mjs:1999
- `flattenMessages` (`JM`) - Message flattener at chunks.173.mjs:1516

---

## Related Documents

- [cli_ui_llm_joint_complete_v3.md](./cli_ui_llm_joint_complete_v3.md) - Comprehensive joint analysis
- [cli_ui_llm_feature_interaction_matrix.md](./cli_ui_llm_feature_interaction_matrix.md) - Feature interactions
- [../02_ui/README.md](../02_ui/README.md) - UI module hub
- [../02_ui/dialog_system.md](../02_ui/dialog_system.md) - Dialog system details
- [../02_ui/streaming_ui.md](../02_ui/streaming_ui.md) - Streaming UI details