# User Interaction Loop - REPL State Machine

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components, Stream Event Processing
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop, Tools

Key functions in this document:
- `REPL` (`ot8`) - Main React component orchestrating the entire session, chunks.196.mjs:3
- `getInputDialogType` (`ra6`) - Priority dialog dispatcher, chunks.196.mjs:387-404
- `handleCancel` (`TM`) - Escape/cancel handler, chunks.196.mjs:420-432
- `handleToolUseStream` (`xN6`) - Core streaming event processor, chunks.173.mjs:2384-2480
- `ToolPermissionDialog` (`HIq`) - Tool use approval dialog, chunks.190.mjs:899
- `SandboxPermissionDialog` (`ct8`) - Network/sandbox approval dialog, chunks.194.mjs:2899
- `MessageList` (`veY`) - Memoized message list component, chunks.161.mjs:3

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Pre-Session Setup](#2-pre-session-setup)
- [3. REPL Component Structure](#3-repl-component-structure)
  - [3.1 Props Interface](#31-props-interface)
  - [3.2 State Variables Map](#32-state-variables-map)
  - [3.3 Component Render Tree](#33-component-render-tree)
- [4. Streaming State Machine](#4-streaming-state-machine)
  - [4.1 streamMode States](#41-streammode-states)
  - [4.2 handleToolUseStream (xN6)](#42-handletoolusestream-xn6)
- [5. Query Execution Pipeline](#5-query-execution-pipeline)
- [6. Animation and Local JSX Commands](#6-animation-and-local-jsx-commands)
- [7. Loading State and Spinner](#7-loading-state-and-spinner)
- [8. Cancel and Abort Flow](#8-cancel-and-abort-flow)
- [9. Session Resume Flow](#9-session-resume-flow)
- [10. End-to-End UI Lifecycle](#10-end-to-end-ui-lifecycle)

---

## 1. Architecture Overview

The Claude Code UI is a **React application rendered in the terminal using the Ink library**. The central component is `REPL` (`ot8`), which acts as the entire session controller. It:

1. Manages all UI state (messages, loading, streaming, dialogs)
2. Bridges user input to the `AgentLoop` via callbacks
3. Renders the complete component tree
4. Handles all keyboard events and slash commands

```
┌─────────────────────────────────────────────────────────────────────┐
│                      REPL (ot8)                                      │
│                   chunks.196.mjs:3                                   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ State Stores                                                  │   │
│  │ • Local React state  (messages, loading, stream mode, etc.)  │   │
│  │ • Zustand app state  (toolPermissionContext, todos, MCP...)   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Query Pipeline                                                │   │
│  │ handleSubmit → executeQuery → handleQuery → AgentLoop         │   │
│  │                              → handleToolUseStream (xN6)      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Component Tree                                                │   │
│  │ Header + PromptInput + Dialogs + MessageList (veY)           │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

1. **Single large component**: Unlike typical React apps with many small components, `ot8` is a monolithic component that holds all critical state. This avoids prop drilling and context overhead for the terminal environment.

2. **Deferred message rendering**: Messages are displayed with a deferred value to keep the input responsive during heavy streaming.

3. **Ref + state duality**: Immutable-in-render state (like `isLoading`) also has a `.current` ref version so callbacks can read the current value without being recreated on every state change.

---

## 2. Pre-Session Setup

Before `REPL` renders, `showSetupScreens` (`gRq`) runs a sequential wizard. This ensures all prerequisites are met before the interactive session begins.

```javascript
// ============================================
// showSetupScreens - Sequential pre-session checks
// Location: chunks.190.mjs:758
// ============================================

// ORIGINAL (for source lookup):
async function gRq(A, q, K, Y, z) {
    if (!w.hasCompletedOnboarding) {
        await LF(A, (O) => wO.default.createElement($, { ... }));
    }
    if (q !== "bypassPermissions" && !J6(process.env.CLAUBBIT)) {
        let { TrustDialog: $ } = await ...;
        await LF(A, (_) => wO.default.createElement($, { ... }));
    }
    // ... policy check, API key prompt
}

// READABLE (for understanding):
async function showSetupScreens(root, permissionMode, force, commands, chrome) {
    if (isDemo) return false;
    const settings = getSettings();

    // Step 1: Onboarding wizard (first-time setup)
    if (!settings.hasCompletedOnboarding) {
        const { Onboarding } = await import("./onboarding");
        await renderBlockingComponent(root, <Onboarding />);
    }

    // Step 2: Trust dialog (workspace trust verification)
    if (permissionMode !== "bypassPermissions" && !isCI()) {
        const { TrustDialog } = await import("./trust");
        await renderBlockingComponent(root, <TrustDialog commands={commands} />);
    }

    // Step 3: Policy check (org policy updates)
    // Step 4: API key prompt (if missing)
}

// Mapping: gRq→showSetupScreens, LF→renderBlockingComponent, w→settings
```

### Pre-Session Flow Diagram

```
CLI starts
    │
    ↓
showSetupScreens() called
    │
    ├── [hasCompletedOnboarding?]
    │       │ NO → Onboarding wizard → user completes → set hasCompletedOnboarding
    │       │ YES → continue
    │       ↓
    ├── [permissionMode !== "bypassPermissions" && !CI?]
    │       │ YES → Trust dialog → user accepts/rejects
    │       │         ├── Accept → continue
    │       │         └── Reject → exit CLI
    │       │ NO → continue
    │       ↓
    ├── [policy changes?]
    │       │ YES → Policy notification → user acknowledges
    │       │ NO → continue
    │       ↓
    ├── [API key configured?]
    │       │ NO → API key prompt → user enters key
    │       │ YES → continue
    │       ↓
    └── Setup complete → render REPL
```

### Blocking Pattern: renderBlockingComponent

```javascript
// ============================================
// renderBlockingComponent - Renders component and waits for completion
// Location: chunks.190.mjs:~720
// ============================================

// READABLE (for understanding):
async function renderBlockingComponent(root, renderComponent) {
    return new Promise((resolve) => {
        // Render component with resolve callback as onDone prop
        root.render(renderComponent((result) => {
            // Component calls onDone() when complete
            resolve(result);
        }));
    });
}
```

**Key insight:** The `renderBlockingComponent` pattern ensures sequential execution in an async environment. Each setup screen:
1. Renders its UI component
2. Returns a Promise that resolves when the component calls `onDone()`
3. Awaits the Promise before proceeding to the next screen
4. This guarantees the user cannot skip setup steps

---

## 3. REPL Component Structure

### 3.1 Props Interface

```javascript
// ============================================
// REPL Props - Entry configuration
// Location: chunks.196.mjs:3-50
// ============================================

// ORIGINAL (for source lookup):
function ot8({
    commands: A, debug: q, initialTools: K, initialMessages: Y,
    initialFileHistorySnapshots: z, initialAgentName: w, initialAgentColor: H,
    mcpClients: $, dynamicMcpConfig: O, mcpCliEndpoint: _, autoConnectIdeFlag: J,
    strictMcpConfig: X = !1, systemPrompt: D, appendSystemPrompt: j,
    onBeforeQuery: M, onTurnComplete: P, disabled: W = !1,
    mainThreadAgentDefinition: G, disableSlashCommands: f = !1,
    taskListId: Z, remoteSessionConfig: N, directConnectConfig: T
})

// READABLE (for understanding):
function REPL({
    commands,              // Available slash commands (including skills)
    debug,                 // Debug logging flag
    initialTools,          // Pre-loaded tool definitions
    initialMessages,       // Messages to restore (session resume)
    initialFileHistorySnapshots, // File change tracking state
    initialAgentName,      // Agent name for team mode display
    initialAgentColor,     // Agent color for team mode display
    mcpClients,            // MCP server connections
    dynamicMcpConfig,      // Dynamic MCP config (auto-discovered servers)
    mcpCliEndpoint,        // MCP CLI endpoint for local development
    autoConnectIdeFlag,    // Whether to auto-connect to IDE extension
    strictMcpConfig,       // Reject unknown MCP servers
    systemPrompt,          // Custom system prompt override
    appendSystemPrompt,    // Text appended to system prompt
    onBeforeQuery,         // Hook called before each agent turn (returns bool)
    onTurnComplete,        // Callback after each completed turn
    disabled,              // Disable all interaction
    mainThreadAgentDefinition, // Agent type config (for specialized agents)
    disableSlashCommands,  // Hide slash command functionality
    taskListId,            // External task list to display
    remoteSessionConfig,   // Remote session connection config
    directConnectConfig    // Direct WebSocket connection config
})
```

### 3.2 State Variables Map

The REPL component manages an extensive set of state variables, verified against source code (chunks.196.mjs). Organized by function:

**Streaming & Loading State:**

| Obfuscated | Readable | Type | Line | Purpose |
|------------|----------|------|------|---------|
| `d7` | `streamMode` | `string` | 96 | Current streaming mode ("responding"\|"thinking"\|"tool-input"\|...) |
| `JK` | `streamingToolUses` | `array` | 98 | In-flight tool uses being streamed |
| `MK` | `streamingThinking` | `object\|null` | 98 | Active thinking block data |
| `_4` | `isLoading` | `bool` | 237 | Whether agent is responding |
| `YA` | `userInputOnProcessing` | `string\|undefined` | 116 | User input shown during loading |
| `M5` | `abortController` | `AbortController\|null` | 108 | Current in-flight request controller |

**Message History State:**

| Obfuscated | Readable | Type | Line | Purpose |
|------------|----------|------|------|---------|
| `u7` | `messages` | `array` | 173 | Full conversation history (source of truth) |
| `xO` | `deferredMessages` | `array` | 183 | Deferred version for rendering (performance) |
| `YA` | `responseLength` | `Ref<number>` | 116 | Accumulated response character count |

**Input State:**

| Obfuscated | Readable | Type | Line | Purpose |
|------------|----------|------|------|---------|
| `m5` | `inputValue` | `string` | 185 | Current text in input box |
| `ZH` | `inputMode` | `"prompt"\|"shift-enter"` | 197 | Input parsing mode |
| `p3` | `pastedContents` | `object` | 222 | Pasted images/files map `{id: content}` |
| `y2` | `isPaused` | `bool` | 130 | Whether to pause dialog display |
| `sZ` | `vimMode` | `string` | 235 | Vim editing mode ("INSERT"\|"NORMAL") |

**Dialog Queue State:**

| Obfuscated | Readable | Type | Line | Purpose |
|------------|----------|------|------|---------|
| `a8` | `toolUseConfirmQueue` | `array` | 167 | Pending tool permission requests |
| `G7` | `sandboxPermissionQueue` | `array` | 167 | Pending sandbox/network permission requests |
| `o` | `elicitationState` | `{queue:[]}` | 34 | Pending MCP elicitation requests (Zustand) |
| `n` | `workerSandboxPermissions` | `{queue:[]}` | 34 | Worker sandbox permission queue (Zustand) |
| `zA` | `promptQueue` | `array` | 167 | Pending prompt requests from tools |

**UI Mode State:**

| Obfuscated | Readable | Type | Line | Purpose |
|------------|----------|------|------|---------|
| `j8` | `toolJSX` | `object\|null` | 143 | Active local JSX command rendering state |
| `k6` | `screen` | `"prompt"\|"transcript"` | 47 | Current screen mode |
| `W7` | `isMessageSelectorVisible` | `bool` | 235 | Message selector overlay active |
| `lV6` | `isViewingDialogHistory` | `bool` | 385 | History browsing overlay active |
| `na6` | `fullScreenOverlay` | `ReactElement\|null` | 385 | Full-screen overlay (e.g., setup screens) |

**Abort & Concurrency State:**

| Obfuscated | Readable | Type | Line | Purpose |
|------------|----------|------|------|---------|
| `I6` | `isQueryInProgress` | `Ref<bool>` | 120 | Concurrency guard (ref, not state) |
| `tA` | `inFlightMessages` | `Ref<array>` | 112 | Messages being processed (ref) |
| `n4` | `inProgressToolUseIDs` | `Set` | 200 | Set of tool use IDs currently executing |

**Ref-based Timing State:**

| Obfuscated | Readable | Type | Line | Purpose |
|------------|----------|------|------|---------|
| `u9` | `queryStartTime` | `Ref<number>` | 117 | When current query started (ms) |
| `u5` | `totalPausedMs` | `Ref<number>` | 118 | Accumulated tool-permission wait time |
| `KK` | `toolPermissionStartTime` | `Ref<number\|null>` | 119 | When current permission dialog opened |
| `mO` | `responseLength` | `Ref<number>` | 222 | Accumulated response character count |

**Derived State (computed each render):**

| Obfuscated | Readable | Calculation | Line | Purpose |
|------------|----------|-------------|------|---------|
| `K2` | `focusedInputDialog` | `ra6()` | 405 | Current dialog type from priority dispatcher |
| `Cb1` | `hasBlockedDialogs` | Paused + pending dialogs | 406 | Dialog waiting for user attention |
| `QV6` | `showSpinner` | Complex calculation | 305 | Spinner visibility calculation |
| `UV6` | `hasActiveDialogs` | Any queue has items | 306 | Any dialog queue has pending items |

### 3.3 Component Render Tree

The REPL renders two distinct layouts based on `screen` state:

**Transcript Mode Layout** (`y1 === "transcript"`):
```
dX (Box)
  lgA (Header)     ← shows transcript header
  igA (Input)      ← text input (active if not local JSX)
  ngA (Dialogs)    ← keyboard shortcut overlays
  g91 (MessageList) ← verbose=true, shows ALL messages
  [vK.jsx]         ← local JSX command (if active)
  HLq              ← notification bar
  QWz              ← transcript "show all" toggle
```

**Normal Mode Layout**:
```
dX (Box)
  lgA (Header)           ← shows version, model, directory
  igA (Input)            ← text input
  ngA (Dialogs)          ← keyboard overlays
  yV6 (MCP Provider)     ← wraps content with MCP context
    GVq (Background)     ← background task indicator
    g91 (MessageList)    ← conversation messages
    [$51]                ← userInputOnProcessing display (while loading)
    [vK.jsx]             ← local JSX command
    GR4 (Spinner)        ← loading spinner (when PG=true)
    [fj6/gs]             ← tasks or todos (expanded view)
    [wUA]                ← sandbox permission dialog
    [_Wq]                ← tool permission dialog
    [nQA]                ← pending worker request display
    [wUA]                ← worker sandbox permission dialog
    [WWq]                ← elicitation router
    [dMq]                ← cost threshold warning
    [Nx7]                ← IDE onboarding dialog
    [kLq]                ← LSP recommendation dialog
    [JRq/Input]          ← prompt input (when not in dialog mode)
    [fMq]                ← message selector
```

**Key insight:** The `PG` (showSpinner) calculation determines when to show the spinner vs. the prompt input:
```javascript
// ORIGINAL:
PG = (!vK || vK.showSpinner === !0) && F7.length === 0 && (_4 || Wz || L9 || xp7() > 0) && !q1 && !MG

// READABLE:
showSpinner = (
    (!toolJSX || toolJSX.showSpinner === true) &&  // No local JSX blocking spinner
    toolUseConfirmQueue.length === 0 &&             // No pending permissions
    (isLoading || userInputOnProcessing || hasRunningTasks || hasQueuedCommands()) &&
    !pendingWorkerRequest &&                        // Not waiting for worker
    !isOnlyToolRunning(dBA)                        // Not in "tool-only" mode
)
```

When `showSpinner` is true and there's no local JSX command active, the `GR4` spinner component renders instead of the input box.

---

## 4. Streaming State Machine

### 4.1 streamMode States

The `streamMode` (`O7`) state is a string enum controlling the spinner/loading display:

```
┌───────────────────────────────────────────────────────────────────┐
│                    streamMode State Machine                        │
│                                                                    │
│  Initial: "responding"                                            │
│                                                                    │
│  Stream Events → State Transitions:                               │
│                                                                    │
│  content_block_start.type === "thinking"     → "thinking"         │
│  content_block_start.type === "text"         → "responding"       │
│  content_block_start.type === "tool_use"     → "tool-input"       │
│  message_delta                               → "responding"       │
│                                                                    │
│  External Transitions:                                            │
│  Tool use approved + executing               → "tool-use"         │
│  Stream ends                                 → [reset via YK]     │
└───────────────────────────────────────────────────────────────────┘
```

Each state drives a different spinner animation in `GR4`:
- `"responding"` → "Claude is thinking..." spinner
- `"thinking"` → "Claude is thinking deeply..." (extended thinking indicator)
- `"tool-input"` → Shows which tool input is being generated
- `"tool-use"` → Shows active tool execution

### 4.2 handleToolUseStream (`xN6`)

The core streaming event processor. Routes LLM streaming events to React state callbacks:

```javascript
// ============================================
// handleToolUseStream - Routes streaming events to React state
// Location: chunks.173.mjs:2384-2480
// ============================================

// ORIGINAL (for source lookup):
function xN6(A, q, K, Y, z, _, w, O, $) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") { _?.(A.message); return }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let H = A.message.content.find((j) => j.type === "thinking");
            if (H && H.type === "thinking") w?.(() => ({...}))
        }
        $?.(() => null), q(A); return
    }
    // ... handle stream_event types
}

// READABLE (for understanding):
function handleToolUseStream(
    event,
    onAddMessage,          // (msg) → add to messages array
    onTextDelta,           // (delta) → accumulate response length
    setStreamMode,         // (mode) → update streamMode
    setStreamingToolUses,  // (updater) → track in-flight tool uses
    onTombstone,           // (msg) → remove message from history
    setStreamingThinking   // (updater) → update thinking block state
) {
    // Non-stream events: handle directly
    if (event.type !== "stream_event") {
        if (event.type === "tombstone") {
            // Message deletion: remove from messages array
            onTombstone?.(event.message);
            return;
        }
        if (event.type === "tool_use_summary") return; // Metadata, ignore
        if (event.type === "assistant") {
            // Extract thinking block for 30-second display timer
            const thinkingBlock = event.message.content.find(b => b.type === "thinking");
            if (thinkingBlock) {
                setStreamingThinking?.(() => ({
                    thinking: thinkingBlock.thinking,
                    isStreaming: false,
                    streamingEndedAt: Date.now() // Triggers 30-second display timer
                }));
            }
        }
        onAddMessage(event);
        return;
    }

    // Streaming events: update transient state
    const evt = event.event;
    switch (evt.type) {
        case "content_block_start":
            switch (evt.content_block.type) {
                case "thinking":
                    setStreamMode("thinking");
                    // Also start accumulating thinking text
                    setStreamingThinking?.(() => ({
                        thinking: "",
                        isStreaming: true,
                        streamingEndedAt: null
                    }));
                    break;
                case "text":
                    setStreamMode("responding");
                    break;
                case "tool_use":
                    setStreamMode("tool-input");
                    // Add new entry to streaming tool uses array
                    setStreamingToolUses(prev => [...prev, {
                        index: evt.index,
                        contentBlock: evt.content_block,
                        unparsedToolInput: ""
                    }]);
                    break;
            }
            break;

        case "content_block_delta":
            switch (evt.delta.type) {
                case "text_delta":
                    onTextDelta(evt.delta.text); // Accumulate for response length
                    break;
                case "input_json_delta":
                    onTextDelta(evt.delta.partial_json);
                    // Append to the correct streaming tool use entry
                    setStreamingToolUses(prev => prev.map(t =>
                        t.index === evt.index
                            ? { ...t, unparsedToolInput: t.unparsedToolInput + evt.delta.partial_json }
                            : t
                    ));
                    break;
                case "thinking_delta":
                    // Accumulate thinking text for display
                    setStreamingThinking?.(prev => ({
                        ...prev,
                        thinking: (prev?.thinking ?? "") + evt.delta.thinking
                    }));
                    break;
            }
            break;

        case "message_delta":
            setStreamMode("responding");
            break;
    }
}

// Mapping: xN6→handleToolUseStream, A→event, q→onAddMessage, K→onTextDelta,
// Y→setStreamMode, z→setStreamingToolUses, _→onTombstone, w→setStreamingThinking
```

**Why each callback is separate:**
The function takes 9 callbacks instead of a single state updater object. This allows:
1. Each callback to be individually memoized (won't trigger unnecessary re-renders)
2. The function to be unit-tested with mock callbacks
3. Different components to subscribe to only the events they care about

**Thinking block lifecycle:**
- `content_block_start.thinking` → set `isStreaming: true`, start accumulating
- `thinking_delta` → append to `thinking` text
- `assistant` message (non-stream) → set `isStreaming: false, streamingEndedAt: now`
- Effect in REPL: after 30 seconds from `streamingEndedAt`, clear the thinking state

> **v2.1.76 change:** Streaming buffers are now released on early generator termination to fix a memory leak. When the `for await` loop exits before the generator is fully exhausted (e.g., due to abort), accumulated streaming buffers are explicitly freed rather than waiting for garbage collection.

### 4.3 handleToolUseStreamCallback (T11)

The adapter between `handleToolUseStream` and the REPL's actual state:

```javascript
// ============================================
// handleToolUseStreamCallback - Binds stream handler to REPL state
// Location: chunks.188.mjs:542-549
// ============================================

// ORIGINAL (for source lookup):
T11 = dA.useCallback((k6) => {
    iW1(k6, (q8) => {
        if (cR(q8)) X6(() => [q8]);     // compact_boundary: reset to single msg
        else X6((FA) => [...FA, q8])     // normal: append
    }, (q8) => p2((FA) => FA + q8.length), // accumulate response length
    tK, xq,                              // setStreamMode, setStreamingToolUses
    (q8) => {                            // onTombstone
        X6((FA) => FA.filter((Yq) => Yq !== q8)),
        rmA(q8.uuid)
    }, R4)
}, [X6, p2, tK, xq, R4])

// READABLE (for understanding):
const handleToolUseStreamCallback = useCallback((streamEvent) => {
    handleToolUseStream(
        streamEvent,
        // onAddMessage: compact_boundary resets history, others append
        (msg) => {
            if (isCompactBoundary(msg)) {
                setMessages(() => [msg]); // RESET - compact happened
            } else {
                setMessages(prev => [...prev, msg]);
            }
        },
        // onTextDelta: accumulate response length for spinner display
        (delta) => updateResponseLength(prev => prev + delta.length),
        setStreamMode,         // tK
        setStreamingToolUses,  // xq
        // onTombstone: remove deleted message from history
        (tombstone) => {
            setMessages(prev => prev.filter(m => m !== tombstone));
            removeMessageFromHistory(tombstone.uuid);
        },
        setStreamingThinking   // R4
    );
}, [setMessages, updateResponseLength, setStreamMode, setStreamingToolUses, setStreamingThinking]);

// Mapping: T11→handleToolUseStreamCallback, iW1→handleToolUseStream,
// cR→isCompactBoundary, X6→setMessages, p2→updateResponseLength,
// tK→setStreamMode, xq→setStreamingToolUses, rmA→removeMessageFromHistory, R4→setStreamingThinking
```

**Key insight: compact_boundary reset**: When a `compact_boundary` message arrives, `setMessages(() => [msg])` is called instead of appending. This **resets the messages array** to contain only the compact boundary marker, effectively clearing the displayed conversation to its post-compaction state. This is how UI shows "fresh start" after compaction.

---

## 5. Query Execution Pipeline

### 5.1 handleSubmit (Z$) - Input Entry Point

The user's enter key triggers `handleSubmit`, which is the entry point for all user input:

```javascript
// ============================================
// handleSubmit - User input handler and slash command router
// Location: chunks.188.mjs:686-827
// ============================================

// ORIGINAL (for source lookup - condensed):
Z$ = dA.useCallback(async (k6, q8, FA, Yq) => {
    if (!FA && k6.trim().startsWith("/")) {
        let k7 = k6.trim(), X4 = k7.indexOf(" "),
            p7 = X4 === -1 ? k7.slice(1) : k7.slice(1, X4),
            V3 = X4 === -1 ? "" : k7.slice(X4 + 1).trim(),
            sq = RA.find((pK) => pK.isEnabled() && (pK.name === p7 || ...)),
            J3 = sq?.immediate || Yq?.fromKeybinding;
        if (sq && J3 && sq.type === "local-jsx") {
            // Execute immediate local JSX command
            let f$ = await (await sq.load()).call(_Y, Uj, V3);
            if (f$) TA({ jsx: f$, shouldHidePromptInput: !0, isLocalJSXCommand: !0 })
            return
        }
    }
    if (!Yq?.fromKeybinding) _q1({ display: FA ? k6 : qk7(k6, e4), ... });
    if (F5 !== void 0) $8(F5.text), ...  // restore queued input
    else if (!_4 || FA) { $8(""), Rq("prompt"), ... }
    if (FA) { /* message restore flow */ return }
    if ($O.isRemoteMode) { /* remote session flow */ return }
    await PE6({ input: k6, ..., streamMode: O7, ... })
}, [...])

// READABLE (for understanding):
const handleSubmit = useCallback(async (inputText, helpers, restoreState, options) => {
    // === Path 1: Immediate slash command ===
    if (!restoreState && inputText.trim().startsWith("/")) {
        const trimmed = inputText.trim();
        const spaceIdx = trimmed.indexOf(" ");
        const commandName = spaceIdx === -1 ? trimmed.slice(1) : trimmed.slice(1, spaceIdx);
        const commandArg = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1).trim();
        const command = commands.find(c => c.isEnabled() && c.name === commandName);
        const isImmediate = command?.immediate || options?.fromKeybinding;

        if (command && isImmediate && command.type === "local-jsx") {
            // Load and render local JSX command (e.g., /help)
            const toolContext = buildToolUseContext(messages, [], newAbortController(), [], undefined, model);
            const jsx = await (await command.load()).call(onDone, toolContext, commandArg);
            if (jsx) setToolJSX({ jsx, shouldHidePromptInput: true, isLocalJSXCommand: true });
            return;
        }
    }

    // === Common: Add to history ===
    if (!options?.fromKeybinding) {
        addToInputHistory({
            display: restoreState ? inputText : formatForHistory(inputText, inputMode),
            pastedContents: restoreState ? {} : pastedContents
        });
    }

    // === Common: Clear input state ===
    if (pendingInput !== undefined) {
        setInputValue(pendingInput.text);
        helpers.setCursorOffset(pendingInput.cursorOffset);
        setPastedContents(pendingInput.pastedContents);
        clearPendingInput();
    } else if (!isLoading || restoreState) {
        if (!options?.fromKeybinding) { setInputValue(""); helpers.setCursorOffset(0); }
        setPastedContents({});
    }

    // === Path 2: Message restore ===
    if (restoreState) {
        const { queryRequired } = await applyMessageRestore(restoreState, speculationTimeSaved, setAppState, inputText, {
            setMessages, readFileState, cwd: getCwd()
        });
        if (queryRequired) {
            const ac = newAbortController();
            setAbortController(ac);
            executeQuery([], ac, true, [], model, undefined);
        }
        return;
    }

    // === Path 3: Remote session ===
    if (remoteSession.isRemoteMode) {
        const userMsg = createUserMessage({ content: buildContent(inputText, pastedContents), imagePasteIds });
        setMessages(prev => [...prev, userMsg]);
        await remoteSession.sendMessage(content);
        return;
    }

    // === Path 4: Normal local execution ===
    await executePrompt({
        input: inputText,
        helpers,
        isLoading,
        mode: inputMode,
        commands,
        onInputChange: setInputValue,
        setPastedContents,
        setIsLoading,
        setToolJSX,
        getToolUseContext,
        messages,
        mainLoopModel: model,
        pastedContents,
        ideSelection,
        setUserInputOnProcessing,
        setAbortController,
        abortController,
        onQuery: executeQuery,
        resetLoadingState,
        thinkingEnabled,
        setAppState,
        querySource: getQuerySource(),
        onBeforeQuery,
        canUseTool,
        addNotification,
        streamMode,
        queueOnly: options?.queueOnly
    });
}, [dependencies]);

// Mapping: Z$→handleSubmit, k6→inputText, q8→helpers, FA→restoreState, Yq→options,
// RA→commands, TA→setToolJSX, _q1→addToInputHistory, F5→pendingInput, e4→inputMode,
// _4→isLoading, Rq→setInputMode, PE6→executePrompt, O7→streamMode
```

**Four execution paths:**

| Path | Condition | Flow |
|------|-----------|------|
| **Immediate slash command** | Input starts with `/` AND command is `immediate` AND type is `local-jsx` | Load command JSX, render inline via `setToolJSX` |
| **Message restore** | `restoreState` parameter is provided | Apply restoration, optionally trigger re-query |
| **Remote session** | `remoteSession.isRemoteMode` | Send to remote session handler |
| **Normal execution** | Default | Call `executePrompt` which calls `executeQuery` |

### 5.2 executeQuery (ff) - Concurrency Guard

```javascript
// ============================================
// executeQuery - Concurrency guard + query dispatch
// Location: chunks.188.mjs:589-625
// ============================================

// ORIGINAL (for source lookup):
ff = dA.useCallback(async (k6, q8, FA, Yq, k7, X4, p7, V3) => {
    if (I6.current) {
        // Queue the input for later
        c("tengu_concurrent_onquery_detected", {})
        k6.filter((sq) => sq.type === "user").map((sq) => J51(sq.message.content))
          .filter(Boolean).forEach((sq, J3) => { lB({ value: sq, mode: "prompt" }, A1) })
        C3(!1); return
    }
    I6.current = !0; tA.current = k6;
    try {
        C3(!0); X6((J3) => [...J3, ...k6]); ZY(void 0); Qj.current = 0; xq([]);
        let sq = await new Promise((J3) => { X6((pK) => { return J3(pK), pK }) });
        if (p7 && V3) {
            if (!await p7(V3, [...sq, ...k6])) return
        }
        await oc(sq, k6, q8, FA, Yq, k7, X4)
    } finally {
        I6.current = !1; LP(Date.now()); YK();
        let sq = Date.now() - $Y.current - OY.current;
        if (sq > 30000 && !q8.signal.aborted && !G1)
            if (dv(M1.getState().tasks).some((pK) => pK.status === "running")) {
                if (J2.current === null) J2.current = $Y.current
            } else X6((pK) => [...pK, cmA(sq)])
    }
}, [oc, C3, A1, YK])

// READABLE (for understanding):
const executeQuery = useCallback(async (
    newMessages,     // Messages to add
    abortController,
    callOnBeforeQuery,
    inProgressToolUseIDs,
    model,
    preQueryMessages,
    onBeforeQueryFn,
    beforeQueryContext
) => {
    // CONCURRENCY GUARD: If already processing, queue the input
    if (isQueryInProgress.current) {
        trackEvent("tengu_concurrent_onquery_detected", {});
        // Extract text from new messages and queue them
        newMessages
            .filter(m => m.type === "user")
            .map(m => extractTextContent(m.message.content))
            .filter(Boolean)
            .forEach((text, i) => {
                queueMessage({ value: text, mode: "prompt" }, setAppState);
                if (i === 0) trackEvent("tengu_concurrent_onquery_enqueued", {});
            });
        setIsLoading(false);
        return;
    }

    isQueryInProgress.current = true;
    inFlightMessages.current = newMessages;

    try {
        // Setup: start loading, add messages, reset streaming state
        setIsLoading(true);
        setMessages(prev => [...prev, ...newMessages]);
        setUserInputOnProcessing(undefined);
        responseLength.current = 0;
        setStreamingToolUses([]);

        // Wait for messages state to settle
        const currentMessages = await new Promise(resolve => {
            setMessages(prev => { resolve(prev); return prev; });
        });

        // Check onBeforeQuery hook (can cancel the query)
        if (onBeforeQueryFn && beforeQueryContext) {
            if (!await onBeforeQueryFn(beforeQueryContext, [...currentMessages, ...newMessages])) {
                return; // Query cancelled by hook
            }
        }

        // Execute the actual query
        await handleQuery(currentMessages, newMessages, abortController, callOnBeforeQuery, model, inProgressToolUseIDs);

    } finally {
        isQueryInProgress.current = false;
        setLastQueryTime(Date.now());
        resetLoadingState(); // YK

        // Check for long-running queries and show notification
        const queryDuration = Date.now() - queryStartTime.current - totalPausedMs.current;
        if (queryDuration > 30000 && !abortController.signal.aborted && !isProactiveActive) {
            if (getRunningTasks().some(t => t.status === "running")) {
                if (taskCompleteTime.current === null) taskCompleteTime.current = queryStartTime.current;
            } else {
                setMessages(prev => [...prev, createDurationMessage(queryDuration)]);
            }
        }
    }
}, [handleQuery, setIsLoading, setAppState, resetLoadingState]);

// Mapping: ff→executeQuery, I6→isQueryInProgress, tA→inFlightMessages,
// C3→setIsLoading, X6→setMessages, ZY→setUserInputOnProcessing, Qj→responseLength,
// xq→setStreamingToolUses, oc→handleQuery, LP→setLastQueryTime, YK→resetLoadingState,
// $Y→queryStartTime, OY→totalPausedMs, G1→isProactiveActive, cmA→createDurationMessage
```

**Why the concurrency guard exists:**

Without the guard, rapid user submissions could start multiple simultaneous agent loops, causing:
- Race conditions in message history
- Duplicate API calls
- Interleaved streaming responses

When a second submit arrives while the first is in progress:
1. Text is extracted from the new messages
2. Queued into `state.queuedCommands` via `queueMessage`
3. After the first query completes, the queued commands auto-submit

**Duration notification:** If a query takes >30 seconds (excluding time spent waiting for tool permission dialogs), a `duration` message is added to the conversation. This gives users feedback on long-running agent loops.

### 5.3 handleQuery (oc) - Agent Loop Bridge

```javascript
// ============================================
// handleQuery - Orchestrates agent loop execution
// Location: chunks.188.mjs:550-588
// ============================================

// ORIGINAL (for source lookup):
oc = dA.useCallback(async (k6, q8, FA, Yq, k7, X4, p7) => {
    let V3 = q8.filter((f$) => f$.type === "user" || f$.type === "assistant").pop();
    if (Yq) { Fd.handleQueryStart(p1); let f$ = iV(p1); if (f$) mx7(f$) }
    if (yD1(), V3?.type === "user") eL7(V3.message.content);
    if (!Yq) { YK(); HY(null); return }
    let sq = J0(k6, q8, FA, k7, p7, X4);
    y3("query_context_loading_start");
    let [, , J3, pK, _Y] = await Promise.all([zUA(B, A1), void 0, dZ(bA, X4, ...), i$(), l$()]);
    y3("query_context_loading_end");
    let iJ = ot({
        mainThreadAgentDefinition: k, toolUseContext: sq,
        customSystemPrompt: D, defaultSystemPrompt: J3, appendSystemPrompt: j
    });
    y3("query_query_start");
    for await (let f$ of ZR({
        messages: k6, systemPrompt: iJ,
        userContext: Uj, systemContext: _Y,
        canUseTool: Zf, toolUseContext: sq,
        querySource: EQ1()
    })) T11(f$);
    y3("query_end"), YK(), n1q(), P?.()
}, [...])

// READABLE (for understanding):
const handleQuery = useCallback(async (
    allMessages,
    newMessages,
    abortController,
    shouldRunQuery,
    model,
    inProgressToolUseIDs
) => {
    const lastNewMessage = newMessages
        .filter(m => m.type === "user" || m.type === "assistant")
        .pop();

    if (shouldRunQuery) {
        // Notify session manager that query is starting
        sessionManager.handleQueryStart(sessionId);
        // Check for associated task to track
        const taskId = getTaskId(sessionId);
        if (taskId) updateTaskStatus(taskId);
    }

    // Log metrics
    clearMetrics();
    if (lastNewMessage?.type === "user") {
        logUserInput(lastNewMessage.message.content);
    }

    // If onBeforeQuery returned false: abort silently
    if (!shouldRunQuery) {
        resetLoadingState();
        setAbortController(null);
        return;
    }

    // Build tool use context (permissions, tools, abort signal)
    const toolUseContext = buildToolUseContext(allMessages, newMessages, abortController, model, inProgressToolUseIDs);

    // Load tool definitions and context in parallel
    markMetric("query_context_loading_start");
    const [, , toolDefs, userContext, systemContext] = await Promise.all([
        updatePermissionContext(toolPermissionContext, setAppState),
        undefined, // placeholder
        loadToolDefinitions(tools, abortController, additionalWorkingDirs, mcpClients),
        getUserContext(),
        getSystemContext()
    ]);
    markMetric("query_context_loading_end");

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
        mainThreadAgentDefinition: agentDefinition,
        toolUseContext,
        customSystemPrompt,
        defaultSystemPrompt: toolDefs,
        appendSystemPrompt
    });

    // Stream from agent loop
    markMetric("query_query_start");
    for await (const event of AgentLoop({
        messages: allMessages,
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        toolUseContext,
        querySource: getQuerySource()
    })) {
        handleToolUseStreamCallback(event); // T11
    }

    markMetric("query_end");
    resetLoadingState();  // YK
    notifyQueryComplete();
    onTurnComplete?.();
}, [sessionId, resetLoadingState, buildToolUseContext, tools, toolPermissionContext, setAppState]);

// Mapping: oc→handleQuery, k6→allMessages, q8→newMessages, FA→abortController,
// Yq→shouldRunQuery, k7→model, X4→model or inProgressToolUseIDs,
// sq→toolUseContext, J3→toolDefs, pK→userContext, _Y→systemContext,
// iJ→systemPrompt, ZR→AgentLoop, T11→handleToolUseStreamCallback,
// YK→resetLoadingState, n1q→notifyQueryComplete, P→onTurnComplete
```

**Loading parallel context:** Before streaming, 3 things are loaded in parallel:
1. `zUA` - Update permission context state
2. `dZ` - Load tool definitions (calls each tool's `inputSchema` and description builders)
3. `i$()`, `l$()` - User context and system context (for the system prompt)

This parallelization reduces query startup latency from 3 sequential async operations to the duration of the longest one.

---

## 6. Animation and Local JSX Commands

The `toolJSX` state (`vK`) handles two distinct use cases:

**Use case 1: Loading spinner customization**
```javascript
// Simple spinner state (not a local JSX command)
setToolJSX({ showSpinner: true, jsx: <SpinnerContent />, shouldContinueAnimation: true });
```

**Use case 2: Local JSX command rendering**
```javascript
// Full-screen local command (e.g., /help, /clear)
setToolJSX({
    jsx: <HelpComponent />,
    shouldHidePromptInput: true,      // Hide the input box
    isLocalJSXCommand: true,          // Disables some dialogs
    shouldContinueAnimation: false    // Blocks dialog priority queue
});
```

The `setToolJSX` (`TA`) function manages a ref + state duality:

```javascript
// ============================================
// setToolJSX - Manages toolJSX state with ref backing
// Location: chunks.188.mjs:111-134
// ============================================

// ORIGINAL (for source lookup):
TA = dA.useCallback((k6) => {
    if (k6?.isLocalJSXCommand) {
        let { clearLocalJSX: q8, ...FA } = k6;
        _3.current = { ...FA, isLocalJSXCommand: !0 }, l9(FA); return
    }
    if (_3.current) {
        if (k6?.clearLocalJSX) { _3.current = null, l9(null); return }
        return  // Don't override local JSX with normal toolJSX
    }
    if (k6?.clearLocalJSX) { l9(null); return }
    l9(k6)
}, [])

// READABLE (for understanding):
const setToolJSX = useCallback((newJSX) => {
    if (newJSX?.isLocalJSXCommand) {
        // Save to ref AND update state (ref persists across re-renders)
        const { clearLocalJSX, ...jsxData } = newJSX;
        localJSXRef.current = { ...jsxData, isLocalJSXCommand: true };
        setToolJSXState(jsxData);
        return;
    }

    if (localJSXRef.current) {
        // A local JSX command is active - only clear signal is accepted
        if (newJSX?.clearLocalJSX) {
            localJSXRef.current = null;
            setToolJSXState(null);
        }
        // Reject attempts to show non-local JSX while local command is active
        return;
    }

    if (newJSX?.clearLocalJSX) {
        setToolJSXState(null);
        return;
    }

    setToolJSXState(newJSX);
}, []);

// Mapping: TA→setToolJSX, _3→localJSXRef, l9→setToolJSXState
```

**Key protection:** When a local JSX command is active (`localJSXRef.current` is set), normal `setToolJSX` calls are rejected. This prevents background processes from clearing a user-requested `/help` screen while the user is reading it.

**`shouldContinueAnimation` gate:** The dialog priority dispatcher (`f11`) checks `vK.shouldContinueAnimation`:
```javascript
let canShowDialog = !toolJSX || toolJSX.shouldContinueAnimation;
```
If a local JSX command is active with `shouldContinueAnimation: false`, ALL interactive dialogs are suppressed (tool permissions, elicitation, etc.). This prevents dialogs from overlapping with full-screen content.

---

## 7. Loading State and Spinner

The `resetLoadingState` (`YK`) function is called at the end of every query to reset all transient streaming state:

```javascript
// ============================================
// resetLoadingState - Post-query cleanup
// Location: chunks.188.mjs:218-220
// ============================================

// ORIGINAL (for source lookup):
YK = dA.useCallback(() => {
    C3(!1), ZY(void 0), Qj.current = 0, xq([]), S3(null), OO(null), xH(null), l7(), PB1()
}, [C3, l7])

// READABLE (for understanding):
const resetLoadingState = useCallback(() => {
    setIsLoading(false);               // C3 - Clear loading flag
    setUserInputOnProcessing(undefined); // ZY - Clear queued input display
    responseLength.current = 0;         // Qj - Reset response length
    setStreamingToolUses([]);           // xq - Clear in-flight tools
    setSpinnerOverrideMessage(null);    // S3
    setSpinnerOverrideColor(null);      // OO
    setSpinnerShimmerColor(null);       // xH
    reloadSpinnerTip();                 // l7 - Load new tip for next query
    clearBackgroundCount();             // PB1
}, [setIsLoading, reloadSpinnerTip]);

// Mapping: YK→resetLoadingState, C3→setIsLoading, ZY→setUserInputOnProcessing,
// Qj→responseLength, xq→setStreamingToolUses, S3→setSpinnerOverrideMessage,
// OO→setSpinnerOverrideColor, xH→setSpinnerShimmerColor, l7→reloadSpinnerTip, PB1→clearBackgroundCount
```

---

## 8. Cancel and Abort Flow

```javascript
// ============================================
// handleCancel - Escape/cancel handler
// Location: chunks.188.mjs:328-340
// ============================================

// ORIGINAL (for source lookup):
function N11() {
    if (XO === "elicitation") return;
    if (h(`[onCancel] focusedInputDialog=${XO} streamMode=${O7}`), I6.current = !1, YK(), XO === "tool-permission")
        F7[0]?.onAbort(), f8([]);
    else if ($O.isRemoteMode) $O.cancelRequest();
    else O3?.abort();
    if (KY()) Kd7(D1, A1), GjA(), A1((k6) => {
        if (k6.queuedCommands.length === 0) return k6;
        return { ...k6, queuedCommands: [] }
    })
}

// READABLE (for understanding):
function handleCancel() {
    // Exception: can't cancel during elicitation dialog
    if (focusedInputDialog === "elicitation") return;

    logDebug(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // Reset concurrency guard and loading state
    isQueryInProgress.current = false;
    resetLoadingState();

    if (focusedInputDialog === "tool-permission") {
        // Abort the specific tool use that's waiting for permission
        toolUseConfirmQueue[0]?.onAbort();
        setToolUseConfirmQueue([]);
    } else if (remoteSession.isRemoteMode) {
        remoteSession.cancelRequest();
    } else {
        abortController?.abort(); // Cancel the in-flight API request
    }

    // Clear any queued commands
    if (hasQueuedCommands()) {
        cancelQueuedTasksInAgentLoop(tasks, setAppState);
        clearQueuedTaskAnimation();
        setAppState(state => ({
            ...state,
            queuedCommands: state.queuedCommands.length === 0 ? state.queuedCommands : []
        }));
    }
}

// Mapping: N11→handleCancel, XO→focusedInputDialog, O7→streamMode,
// I6→isQueryInProgress, YK→resetLoadingState, F7→toolUseConfirmQueue,
// f8→setToolUseConfirmQueue, $O→remoteSession, O3→abortController,
// KY→hasQueuedCommands, Kd7→cancelQueuedTasksInAgentLoop
```

**Cancel behavior by dialog state:**

| `focusedInputDialog` value | Cancel behavior |
|---------------------------|-----------------|
| `"elicitation"` | **NO-OP**: elicitation has its own Escape handling |
| `"tool-permission"` | Abort the waiting tool use, clear the queue |
| `undefined` + remote mode | Cancel remote session request |
| `undefined` + local | Abort the AbortController (cancels API streaming) |

---

## 9. Session Resume Flow

When `initialMessages` is provided (session resume), the REPL initializes with existing history:

```javascript
// ============================================
// Session Resume - Initial message restoration
// Location: chunks.196.mjs:379-381
// ============================================

// ORIGINAL (for source lookup):
N8.useEffect(() => {
    if (Y && Y.length > 0) dV6(Y, AA())
}, []);

// READABLE (for understanding):
useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
        updateHistory(initialMessages, getCwd()); // Pre-populate normalizedHistory
    }
}, []);

// Mapping: Y→initialMessages, dV6→updateHistory, AA→getCwd
```

### Full Session Resume (aN callback)

When a full session is resumed via the session manager, the `aN` callback handles complete restoration:

```javascript
// ============================================
// restoreSession - Full session restoration handler
// Location: chunks.196.mjs:332-372
// ============================================

// ORIGINAL (for source lookup):
let aN = N8.useCallback(async (P1, Y8, V8) => {
    let c7 = performance.now();
    try {
        let FA = zV1(Y8.messages),
            v7 = await C0("resume", { sessionId: P1, agentType: u?.agentType, model: w6 });
        if (FA.push(...v7), V8 === "fork") q94(Y8, eJ(P1));
        else EP1(Y8, eJ(P1));
        if (co6(Y8, i), Y8.fileHistorySnapshots) KV1(Y8);
        let { agentDefinition: N7 } = K26(Y8.agentSetting, G, Q);
        I(N7), i((nK) => ({ ...nK, agent: N7?.agentType }));
        i((nK) => ({ ...nK, standaloneAgentContext: lo6(Y8.agentName, Y8.agentColor) }));
        dV6(FA, Y8.projectPath ?? AA()), dE(), x5(null), S2(P1);
        let cA = NO8(P1);
        o21(), uw6(), _P(eJ(P1), Y8.fullPath ? Lvz(Y8.fullPath) : null);
        // ... prompt cache and recording restoration
        gq(() => FA), o8(null), P5("");
    } catch (FA) { throw ... }
}, [dE, i])

// READABLE (for understanding):
const restoreSession = useCallback(async (sessionId, sessionData, entrypoint) => {
    const startTime = performance.now();
    try {
        // Step 1: Load session messages
        let messages = reconstructMessages(sessionData.messages);
        const resumePrompt = await getCachedPrompt("resume", {
            sessionId,
            agentType: agentDefinition?.agentType,
            model
        });
        messages.push(...resumePrompt);

        // Step 2: Update session file (fork vs continue)
        if (entrypoint === "fork") {
            forkSessionFile(sessionData, getSessionPath(sessionId));
        } else {
            updateSessionFile(sessionData, getSessionPath(sessionId));
        }

        // Step 3: Restore session state
        updateSessionState(sessionData, setAppState);
        if (sessionData.fileHistorySnapshots) {
            restoreFileHistorySnapshots(sessionData);
        }

        // Step 4: Restore agent settings
        const { agentDefinition: restoredAgent } = resolveAgentDefinition(
            sessionData.agentSetting,
            mainThreadAgentDefinition,
            agentDefinitions
        );
        setAgentDefinition(restoredAgent);
        setAppState(state => ({ ...state, agent: restoredAgent?.agentType }));
        setAppState(state => ({
            ...state,
            standaloneAgentContext: buildAgentContext(sessionData.agentName, sessionData.agentColor)
        }));

        // Step 5: Update history and reset UI state
        updateHistory(messages, sessionData.projectPath ?? getCwd());
        resetLoadingState();
        setAbortController(null);
        setCurrentSessionId(sessionId);

        // Step 6: Handle any pending prompt cache
        const promptCache = loadPromptCache(sessionId);
        if (promptCache) {
            applyPromptCache(promptCache);
        }

        // Step 7: Restore messages to UI
        setMessages(() => messages);
        setToolJSX(null);
        setInputValue("");

        trackEvent("tengu_session_resumed", {
            entrypoint,
            success: true,
            resume_duration_ms: Math.round(performance.now() - startTime)
        });
    } catch (error) {
        trackEvent("tengu_session_resumed", { entrypoint, success: false });
        throw error;
    }
}, [resetLoadingState, setAppState]);
```

### Session Resume Flow Diagram

```
User runs: claude --resume [sessionId]
         │
         ↓
CLI loads session file from ~/.claude/projects/<project>/sessions/
         │
         ↓
parseSessionData() → { messages, agentSetting, fileHistorySnapshots, ... }
         │
         ↓
REPL receives initialMessages prop
         │
         ↓
useEffect(() => updateHistory(initialMessages, getCwd()), [])
         │
         ↓
[If --continue/--resume flag]
         │
         ↓
restoreSession callback (aN)
  ├── 1. Reconstruct messages (zV1)
  ├── 2. Load cached resume prompt (C0)
  ├── 3. Fork or continue session file
  ├── 4. Restore agent settings
  ├── 5. Restore file history snapshots
  ├── 6. Reset loading state
  ├── 7. Update messages in UI (gq)
  └── 8. Clear input and toolJSX
         │
         ↓
Session ready for user input
```

### Entry Point Types

| Entrypoint | Behavior |
|------------|----------|
| `--resume` | Load session, append to session file on changes |
| `--continue` | Same as resume, continues last session |
| `--fork` | Load session, create new session file (branch) |

---

## 10. End-to-End UI Lifecycle

Complete flow from user typing to response display:

```
User types in terminal
         │
         ↓ (key press)
InputBox (igA) captures input
         │
         ↓ (Enter pressed)
handleSubmit (Z$)
  ├── [slash command?] → setToolJSX (TA) for local JSX
  └── [normal input?] → executePrompt (PE6)
                              │
                              ↓
                        executeQuery (ff)
                          ├── [already loading?] → queue input
                          └── [available?] →
                                setIsLoading(true)
                                append messages
                                wait for state settle
                                handleQuery (oc)
                                  │
                                  ├── buildToolUseContext
                                  ├── loadToolDefinitions [parallel]
                                  ├── buildSystemPrompt
                                  └── AgentLoop (ZR) stream
                                          │
                                          ↓ (each event)
                                   T11 callback
                                          │
                                   handleToolUseStream (iW1)
                                    ├── content_block_start
                                    │     ├── "thinking" → setStreamMode("thinking")
                                    │     ├── "text" → setStreamMode("responding")
                                    │     └── "tool_use" → setStreamingToolUses(add)
                                    ├── content_block_delta
                                    │     ├── text_delta → updateResponseLength
                                    │     └── input_json_delta → setStreamingToolUses(update)
                                    └── message/assistant type
                                          └── setMessages(append)
                                                   │
                                                   ↓ (React re-render)
                                          MessageList (g91/P8z)
                                            ├── normalizeDisplayMessages (t9q)
                                            │     (groups toolUse+hooks+result)
                                            ├── groupToolResults (q9q)
                                            │     (groups repeated tool uses)
                                            └── render MessageComponent (n9q)
                                                  for each message
                                                         │
                                                         ↓
                                              Terminal Output
         │
         ↓ (stream ends)
resetLoadingState (YK)
  setIsLoading(false)
  setStreamingToolUses([])
  clear override states
```
