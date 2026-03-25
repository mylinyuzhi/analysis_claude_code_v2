# UI Interaction State Machine & Design Patterns (Claude Code v2.1.76)

> Complete UI state management, interaction patterns, and React/Ink architecture analysis.
>
> **Cross-validated**: All patterns verified against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `sessionOrchestrator` (ot8) - Main session component at chunks.196.mjs:3
- `getInputDialogType` (ra6) - Dialog priority at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `handleStreamedEvent` (rV6) - Event processor
- `createStateStore` (WX1) - State store at chunks.85.mjs:1747

---

## 1. UI State Machine Architecture

### 1.1 Stream Mode States

The UI maintains a `streamMode` state that tracks the current phase of LLM interaction.

```javascript
// ============================================
// Stream Mode State - LLM interaction phases
// Location: chunks.196.mjs:47
// ============================================

// ORIGINAL (for source lookup):
let [k6, ZY] = N8.useState("prompt");

// READABLE (for understanding):
let [streamMode, setStreamMode] = useState("prompt");

// Possible values:
type StreamMode =
    | "prompt"       // Waiting for user input
    | "requesting"   // Building request, not yet sent
    | "responding"   // LLM streaming text response
    | "thinking"     // LLM in extended thinking mode
    | "tool-input"   // LLM streaming tool_use input
    | "tool-use";    // Tool executing, waiting for result

// Mapping: k6→streamMode, ZY→setStreamMode, N8→React
```

### 1.2 UI State States

Separate from stream mode, `uiState` tracks the display state for UI rendering.

```javascript
// ============================================
// UI State - Display state for rendering
// Location: chunks.196.mjs:96-100
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;
let [JK, F3] = N8.useState([]), [MK, k3] = N8.useState(null);

// READABLE (for understanding):
let [uiState, setUIState] = useState("responding");
let uiStateRef = useRef(uiState);
uiStateRef.current = uiState;  // Synchronous access for non-React callbacks

let [toolUses, setToolUses] = useState([]);  // In-progress tool executions
let [thinkingState, setThinkingState] = useState(null);  // Thinking block state

// Possible uiState values:
type UIState =
    | "requesting"   // Building request
    | "thinking"     // Extended thinking active
    | "responding"   // Text/Tool response streaming
    | "tool-input"   // Tool input JSON streaming
    | "tool-use";    // Tool executing

// Mapping: d7→uiState, W4→setUIState, Dz→uiStateRef,
//          JK→toolUses, F3→setToolUses, MK→thinkingState, k3→setThinkingState
```

### 1.3 State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STREAM MODE STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────┐                                    │
│                          │   prompt    │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│                     User submits message                                    │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │ requesting  │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│                     LLM response starts                                     │
│                                 │                                           │
│                    ┌────────────┴────────────┐                             │
│                    │                         │                              │
│                    ▼                         ▼                              │
│             ┌─────────────┐          ┌─────────────┐                       │
│             │ responding  │          │  thinking   │                       │
│             └──────┬──────┘          └──────┬──────┘                       │
│                    │                         │                              │
│         Text streaming            Thinking streaming                        │
│                    │                         │                              │
│                    │         ┌───────────────┘                             │
│                    │         │                                               │
│                    │         ▼                                               │
│                    │  ┌─────────────┐                                       │
│                    │  │ responding  │                                       │
│                    │  └──────┬──────┘                                       │
│                    │         │                                               │
│                    └────────┬┘                                              │
│                             │                                                │
│                   Tool_use block starts                                      │
│                             │                                                │
│                             ▼                                                │
│                      ┌─────────────┐                                        │
│                      │ tool-input  │                                        │
│                      └──────┬──────┘                                        │
│                             │                                                │
│                Tool input JSON complete                                      │
│                             │                                                │
│                             ▼                                                │
│                      ┌─────────────┐                                        │
│                      │  tool-use   │                                        │
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

---

## 2. Dialog Priority System

### 2.1 Dialog Types and Priorities

The UI supports 13 different dialog types, each with a specific priority ordering.

```javascript
// ============================================
// getInputDialogType (ra6) - Dialog priority dispatcher
// Location: chunks.196.mjs:387-404
// ============================================

// READABLE (for understanding):
function getInputDialogType() {
    // HIGHEST PRIORITY: Blocking states
    if (isConfirmingAction || hasBlockingDialog) {
        return undefined;  // No dialog allowed
    }

    // PRIORITY 1: Message selector (multi-message selection mode)
    if (isMessageSelectorVisible) {
        return "message-selector";
    }

    // BLOCKING: Loading state
    if (isLoading) {
        return undefined;  // No dialog during loading
    }

    // PRIORITY 2: Sandbox permission (network access - security critical)
    if (sandboxPermissionQueue[0]) {
        return "sandbox-permission";
    }

    // Check animation state for remaining dialogs
    let shouldShowDialog = !localJSXDialog || localJSXDialog.shouldContinueAnimation;
    if (!shouldShowDialog) {
        return undefined;
    }

    // PRIORITY 3: Tool permission (tool execution - security critical)
    if (toolPermissionQueue[0]) {
        return "tool-permission";
    }

    // PRIORITY 4: Prompt request (MCP/user input prompt)
    if (promptQueue[0]) {
        return "prompt";
    }

    // PRIORITY 5: Worker sandbox permission (background agent network)
    if (workerSandboxPermissionQueue[0]) {
        return "worker-sandbox-permission";
    }

    // PRIORITY 6: MCP elicitation (MCP server form request)
    if (elicitationQueue[0]) {
        return "elicitation";
    }

    // PRIORITIES 7-12: Informational dialogs
    if (costWarningActive) return "cost";
    if (ideOnboardingActive) return "ide-onboarding";
    if (effortCalloutActive) return "effort-callout";
    if (remoteCalloutActive) return "remote-callout";
    if (lspRecommendationActive) return "lsp-recommendation";
    if (desktopUpsellActive) return "desktop-upsell";

    return undefined;
}
```

### 2.2 Dialog Priority Table

| Priority | Dialog Type | Queue Variable | Trigger Condition |
|----------|-------------|----------------|-------------------|
| - | (blocked) | `isConfirmingAction` | Action confirmation |
| 1 | message-selector | `W7` | Multi-message selection |
| - | (blocked) | `isLoading` | Loading state |
| 2 | sandbox-permission | `G7[0]` | Network access request |
| 3 | tool-permission | `a8[0]` | Tool execution permission |
| 4 | prompt | `zA[0]` | User input prompt |
| 5 | worker-sandbox-permission | `n.queue[0]` | Background agent network |
| 6 | elicitation | `o.queue[0]` | MCP server form |
| 7 | cost | `m26` | Budget threshold |
| 8 | ide-onboarding | `W6` | IDE not connected |
| 9 | effort-callout | `g6` | Effort level change |
| 10 | remote-callout | `J1` | Remote session active |
| 11 | lsp-recommendation | `e8` | LSP plugin available |
| 12 | desktop-upsell | `E1` | Desktop app promotion |

### 2.3 Dialog State Variables

```javascript
// ============================================
// Dialog Queue State Variables
// Location: chunks.196.mjs:50-100
// ============================================

// Permission queues
let [toolPermissionQueue, setToolPermissionQueue] = useState([]);     // a8, $A
let [sandboxPermissionQueue, setSandboxPermissionQueue] = useState([]); // G7, Q1

// Input queues
let [promptQueue, setPromptQueue] = useState([]);                     // zA, gA
let [elicitationQueue, setElicitationQueue] = useState([]);           // o.queue

// Worker queues (for background agents)
let workerSandboxPermissions = useAppState(s => s.workerSandboxPermissions); // n
let elicitation = useAppState(s => s.elicitation);                     // o

// Message selector
let isMessageSelectorVisible = W7 || !!oF;

// Loading state
let isLoading = y2;

// Animation state
let localJSXDialog = j8;  // Current local JSX dialog
let shouldContinueAnimation = !j8 || j8.shouldContinueAnimation;
```

---

## 3. Cancel Propagation

### 3.1 handleCancel (TM) Algorithm

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation handler
// Location: chunks.196.mjs:420-432
// ============================================

// READABLE (for understanding):
function handleCancel() {
    // STEP 1: Check if cancellation is allowed
    // Elicitation dialogs cannot be cancelled (MCP protocol requirement)
    if (focusedInputDialog === "elicitation") {
        return;
    }

    debugLog(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // STEP 2: Force end concurrent query lock
    // Prevents new queries from starting while we're cancelling
    concurrentQueryLock.forceEnd();

    // STEP 3: Preserve draft content
    // Save any in-progress input to messages
    if (draftContent?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: draftContent })]);
    }

    // STEP 4: Reset streaming state
    resetStreamingState();

    // STEP 5: Handle based on active dialog type
    switch (focusedInputDialog) {
        case "tool-permission":
            // Abort the first pending tool permission
            toolPermissionQueue[0]?.onAbort();
            setToolPermissionQueue([]);
            break;

        case "prompt":
            // Reject all pending prompts
            for (let prompt of promptQueue) {
                prompt.reject(Error("Prompt cancelled by user"));
            }
            setPromptQueue([]);
            abortController?.abort();
            break;

        default:
            // Generic cancellation
            if (isRemoteMode) {
                remoteBridge.cancelRequest();
            } else {
                abortController?.abort();
            }
            break;
    }

    // STEP 6: Clear abort controller
    setAbortController(null);
}
```

### 3.2 Cancel Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CANCEL PROPAGATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User presses Ctrl+C / Escape                                               │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ handleCancel (TM)                                                    │    │
│  │                                                                       │    │
│  │ 1. Check if elicitation (non-cancellable)                           │    │
│  │    └── If elicitation → RETURN (no action)                          │    │
│  │                                                                       │    │
│  │ 2. concurrentQueryLock.forceEnd()                                   │    │
│  │    └── Prevents new queries from starting                           │    │
│  │                                                                       │    │
│  │ 3. Preserve draft content                                            │    │
│  │    └── Append to messages if non-empty                              │    │
│  │                                                                       │    │
│  │ 4. resetStreamingState()                                             │    │
│  │    └── Clear streaming indicators                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Dialog-Specific Handling                                             │    │
│  │                                                                       │    │
│  │ tool-permission:                                                     │    │
│  │   ├── a8[0]?.onAbort()                                              │    │
│  │   └── $A([])  // Clear queue                                        │    │
│  │                                                                       │    │
│  │ prompt:                                                              │    │
│  │   ├── for each prompt: reject(Error("Cancelled"))                   │    │
│  │   ├── gA([])  // Clear queue                                        │    │
│  │   └── M5?.abort()  // Abort controller                              │    │
│  │                                                                       │    │
│  │ default:                                                             │    │
│  │   ├── if remoteMode: B5.cancelRequest()                             │    │
│  │   └── else: M5?.abort()                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Abort Propagation                                                    │    │
│  │                                                                       │    │
│  │ AbortController.abort()                                              │    │
│  │         │                                                             │    │
│  │         ├── mainAgentLoop receives signal                            │    │
│  │         │       │                                                     │    │
│  │         │       └── StreamingToolExecutor.getAbortReason()          │    │
│  │         │               │                                             │    │
│  │         │               └── Returns "user_interrupted"              │    │
│  │         │                                                             │    │
│  │         ├── Tool execution receives abort                            │    │
│  │         │       │                                                     │    │
│  │         │       └── Tools check interruptBehavior()                 │    │
│  │         │               │                                             │    │
│  │         │               ├── "cancel" → Abort immediately             │    │
│  │         │               └── "block" → Continue to completion        │    │
│  │         │                                                             │    │
│  │         └── Streaming stops                                          │    │
│  │                 │                                                     │    │
│  │                 └── Tool results collected with error               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────┐                                                            │
│  │ Return to   │                                                            │
│  │ prompt mode │                                                            │
│  └─────────────┘                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. State Store Pattern

### 4.1 createStateStore (WX1)

**Location**: chunks.85.mjs:1747-1766

```javascript
// ============================================
// createStateStore (WX1) - Observable state store factory
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
function createStateStore(initialState, onChangeCallback) {
    // Current state value
    let currentState = initialState;

    // Subscriber set (React components)
    let subscribers = new Set();

    return {
        // Get current state snapshot (synchronous)
        getState: () => currentState,

        // Update state with immutability
        setState: (updater) => {
            let oldState = currentState;
            let newState = updater(oldState);

            // Skip if nothing changed (shallow equality check)
            if (Object.is(newState, oldState)) {
                return;
            }

            // Update state
            currentState = newState;

            // Notify external callback (for debugging/logging)
            onChangeCallback?.({ newState, oldState });

            // Notify all subscribers
            for (let subscriber of subscribers) {
                subscriber();
            }
        },

        // Subscribe to state changes
        // Returns unsubscribe function
        subscribe: (callback) => {
            subscribers.add(callback);
            return () => subscribers.delete(callback);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback,
//          K→currentState, Y→subscribers, z→updater, _→oldState, w→newState
```

**Why this approach:**
- Minimal API: getState, setState, subscribe
- Immutable updates prevent mutation bugs
- Shallow equality check prevents unnecessary re-renders
- Subscriber pattern enables React integration

### 4.2 useAppState Hook

```javascript
// ============================================
// useAppState - Zustand-like selector hook
// Location: chunks.195.mjs (derived from state store)
// ============================================

// Usage pattern:
function MyComponent() {
    // Select specific state slice
    const verbose = useAppState(state => state.verbose);
    const mcp = useAppState(state => state.mcp);

    // Component only re-renders when selected slice changes
}
```

**Selector pattern benefits:**
- Components only re-render when their selected state changes
- Prevents unnecessary re-renders from unrelated state changes
- Enables fine-grained reactivity

---

## 5. Event Stream Processing

### 5.1 handleStreamedEvent (rV6)

```javascript
// ============================================
// handleStreamedEvent (rV6) - LLM event processor
// Location: chunks.196.mjs (inferred from usage)
// ============================================

// READABLE (for understanding):
function handleStreamedEvent(event) {
    switch (event.type) {
        // Assistant message (complete or partial)
        case "assistant":
            setMessages(prev => [...prev, event.message]);
            break;

        // User message (tool result, etc.)
        case "user":
            setMessages(prev => [...prev, event.message]);
            break;

        // Tombstone (mark message for removal)
        case "tombstone":
            setMessages(prev => prev.filter(msg => msg.uuid !== event.uuid));
            break;

        // SSE stream event (for UI state updates)
        case "stream_event":
            handleSSEEvent(event.event);
            break;

        // Stream request start
        case "stream_request_start":
            setStreamMode("requesting");
            break;

        // Turn complete
        case "turn_complete":
            setStreamMode("prompt");
            break;
    }
}

function handleSSEEvent(sseEvent) {
    switch (sseEvent.type) {
        case "content_block_start":
            if (sseEvent.content_block.type === "tool_use") {
                setStreamMode("tool-input");
                setToolUses(prev => [...prev, {
                    id: sseEvent.content_block.id,
                    name: sseEvent.content_block.name,
                    status: "streaming"
                }]);
            } else if (sseEvent.content_block.type === "thinking") {
                setStreamMode("thinking");
                setThinkingState({
                    isStreaming: true,
                    streamingEndedAt: null
                });
            }
            break;

        case "content_block_stop":
            // Tool input complete, now executing
            if (contentBlocks[sseEvent.index]?.type === "tool_use") {
                setStreamMode("tool-use");
            } else if (contentBlocks[sseEvent.index]?.type === "thinking") {
                setThinkingState(prev => ({
                    ...prev,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
            break;

        case "message_stop":
            setStreamMode("prompt");
            break;
    }
}
```

### 5.2 Event Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVENT STREAM PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  mainAgentLoop yields event                                                 │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ handleStreamedEvent (rV6)                                           │    │
│  │                                                                       │    │
│  │ switch (event.type) {                                                │    │
│  │   case "assistant":                                                  │    │
│  │     setMessages(prev => [...prev, event.message])                   │    │
│  │     break;                                                           │    │
│  │                                                                       │    │
│  │   case "user":                                                       │    │
│  │     setMessages(prev => [...prev, event.message])                   │    │
│  │     break;                                                           │    │
│  │                                                                       │    │
│  │   case "tombstone":                                                  │    │
│  │     setMessages(prev => prev.filter(m => m.uuid !== event.uuid))    │    │
│  │     break;                                                           │    │
│  │                                                                       │    │
│  │   case "stream_event":                                               │    │
│  │     handleSSEEvent(event.event)                                      │    │
│  │     break;                                                           │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ UI State Updates                                                     │    │
│  │                                                                       │    │
│  │ • messages: Append/remove messages                                  │    │
│  │ • streamMode: Update current phase                                  │    │
│  │ • toolUses: Track in-progress tools                                 │    │
│  │ • thinkingState: Track thinking blocks                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ React Re-render                                                      │    │
│  │                                                                       │    │
│  │ • MessageList re-renders with new messages                          │    │
│  │ • Spinner updates with new streamMode                               │    │
│  │ • Tool cards appear/update for toolUses                             │    │
│  │ • Thinking indicator shows/hides                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Component Lifecycle

### 6.1 sessionOrchestrator Mount Sequence

```javascript
// ============================================
// sessionOrchestrator Mount Lifecycle
// Location: chunks.196.mjs:31-60
// ============================================

// Mount effect
useEffect(() => {
    debugLog(`[REPL:mount] REPL mounted, disabled=${disabled}`);
    return () => debugLog("[REPL:unmount] REPL unmounting");
}, [disabled]);

// Proactive mode subscription
useEffect(() => {
    if (!proactiveController) return;
    return proactiveController.subscribeToProactiveChanges(() => {
        setIsProactiveActive(proactiveController.isProactiveActive());
    });
}, []);

// Command queue initialization
useEffect(() => {
    updateCommands(commands);
}, [commands]);

// MCP client initialization
useEffect(() => {
    syncMcpClients(mcpClients);
    connectMcpClients(mcpClients, setIdeSelection);
}, [mcpClients]);
```

### 6.2 Query Execution Lifecycle

```javascript
// ============================================
// Query Execution Lifecycle (tZ callback)
// Location: chunks.196.mjs:776-812
// ============================================

// READABLE (for understanding):
const onQuery = useCallback(async (messages, abortController, isResume, toolResults, fileHistory, onBeforeQuery, initialMessage) => {
    // STEP 1: Check for team mode coordination
    if (isTeamMode() && isCoordinator()) {
        let coordinatorId = getCoordinatorId();
        let agentId = getAgentId();
        if (coordinatorId && agentId) {
            notifyCoordinator(coordinatorId, agentId, true);
        }
    }

    // STEP 2: Try to start concurrent query lock
    let lockToken = concurrentQueryLock.tryStart();
    if (lockToken === null) {
        // Another query is running - enqueue
        trackEvent("tengu_concurrent_onquery_detected", {});
        // Extract text from user messages and enqueue
        messages.filter(m => m.type === "user" && !m.isMeta)
            .forEach((msg, idx) => {
                let text = extractTextContent(msg.message.content);
                if (text) {
                    enqueuePrompt({ value: text, mode: "prompt" });
                    if (idx === 0) trackEvent("tengu_concurrent_onquery_enqueued", {});
                }
            });
        return;
    }

    try {
        // STEP 3: Initialize query state
        queryStartTime.current = Date.now();
        idleTime.current = 0;
        lastTurnStartTime.current = null;
        setMessages(prev => [...prev, ...messages]);
        setError(undefined);
        turnCount.current = 0;
        toolUseSummary.current = [];
        setToolUses([]);
        setDraftContent(null);

        // STEP 4: Run before-query callback
        let currentMessages = messageHistoryRef.current;
        if (onBeforeQuery && initialMessage) {
            if (!await onBeforeQuery(initialMessage, currentMessages)) {
                return;
            }
        }

        // STEP 5: Execute query
        await executeQuery(currentMessages, messages, abortController, toolResults, fileHistory);

    } finally {
        // STEP 6: End concurrent query lock
        if (concurrentQueryLock.end(lockToken)) {
            markSessionActive(Date.now());
            resetStreamingState();

            // Check for idle notification
            let queryDuration = Date.now() - queryStartTime.current - idleTime.current;
            if ((queryDuration > 30000 || lastTurnStartTime.current !== null) &&
                !abortController.signal.aborted && !isProactiveActive) {
                // Long query completed - potentially notify team
                if (getRunningTasks().some(t => t.status === "running")) {
                    if (lastTurnStartTime.current === null) {
                        lastTurnStartTime.current = queryStartTime.current;
                    }
                } else {
                    setMessages(prev => [...prev, createIdleNotification(queryDuration)]);
                }
            }
            setAbortController(null);
        }
    }
}, [executeQuery, messageHistoryRef, resetStreamingState, concurrentQueryLock]);
```

---

## 7. Key Design Patterns

### 7.1 Single Active Dialog Pattern

**Rule:** Only one interactive dialog can be visible at any time.

**Implementation:**
```javascript
// getInputDialogType returns only ONE dialog type
let activeDialog = getInputDialogType();

// Render only the active dialog
switch (activeDialog) {
    case "tool-permission":
        return <ToolPermissionDialog {...toolPermissionQueue[0]} />;
    case "sandbox-permission":
        return <SandboxPermissionDialog {...sandboxPermissionQueue[0]} />;
    // ... etc
}
```

**Why this approach:**
- Prevents user confusion
- Clear focus for keyboard input
- Predictable UI behavior

### 7.2 Deferred Rendering Pattern

**Problem:** Message updates during streaming can cause laggy input.

**Solution:** Use `useDeferredValue` for message rendering.

```javascript
// ============================================
// Deferred Rendering Pattern
// Location: chunks.196.mjs (inferred from React patterns)
// ============================================

// Defer message list rendering to keep input responsive
const deferredMessages = useDeferredValue(messages);

// Input component renders immediately
<PromptInput
    value={inputValue}
    onChange={setInputValue}
    // ... immediate updates
/>

// Message list renders when there's time
<MessageList messages={deferredMessages} />
```

### 7.3 Queue-Based Dialog Management

**Pattern:** Each dialog type has a queue for pending requests.

```javascript
// Queues for different dialog types
let [toolPermissionQueue, setToolPermissionQueue] = useState([]);
let [sandboxPermissionQueue, setSandboxPermissionQueue] = useState([]);
let [promptQueue, setPromptQueue] = useState([]);
let [elicitationQueue, setElicitationQueue] = useState([]);

// Add to queue
setToolPermissionQueue(prev => [...prev, {
    request: toolRequest,
    resolve: resolveCallback,
    reject: rejectCallback
}]);

// Remove from queue on completion
setToolPermissionQueue(prev => prev.slice(1));

// Process queue item
let currentRequest = toolPermissionQueue[0];
// ... show dialog, wait for user input
currentRequest.resolve(userDecision);  // or reject
```

---

## 8. Performance Optimizations

### 8.1 State Update Batching

React automatically batches state updates in event handlers. For multiple updates:

```javascript
// Good: Single re-render
setMessages(prev => [...prev, ...newMessages]);
setStreamMode("responding");
setToolUses([]);

// Avoid: Multiple setMessages calls
// setMessages(prev => [...prev, msg1]);
// setMessages(prev => [...prev, msg2]);  // Causes extra re-render
```

### 8.2 Memoization

```javascript
// Memoize expensive computations
const filteredTools = useMemo(() => {
    return tools.filter(t => t.isEnabled());
}, [tools]);

// Memoize callbacks
const handleToolPermission = useCallback((decision) => {
    // ... handler logic
}, [dependency1, dependency2]);
```

### 8.3 Subscription Cleanup

```javascript
// Always clean up subscriptions
useEffect(() => {
    let subscription = eventBus.subscribe(handler);
    return () => subscription.unsubscribe();
}, [dependency]);
```

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - Full UI state machine and interaction patterns