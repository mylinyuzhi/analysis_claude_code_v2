# UI State Machine Complete Analysis (Claude Code v2.1.76)

> Complete analysis of UI state management, state transitions, and React/Ink architecture.
>
> **Cross-validated**: All patterns verified against source code on 2026-03-26.
> **Source-Level**: Includes both original obfuscated and readable pseudocode.

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

The UI supports 13+ different dialog types, each with a specific priority ordering.

```javascript
// ============================================
// getInputDialogType (ra6) - Dialog priority dispatcher
// Location: chunks.196.mjs:387-420
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
    let P1 = !j8 || j8.shouldContinueAnimation;
    if (!P1) return;
    if (a8[0]) return "tool-permission";
    if (zA[0]) return "prompt";
    if (n.queue[0]) return "worker-sandbox-permission";
    if (o.queue[0]) return "elicitation";
    if (m26) return "cost";
    if (W6) return "ide-onboarding";
    if (g6) return "effort-callout";
    if (J1) return "remote-callout";
    if (e8) return "lsp-recommendation";
    if (E1) return "desktop-upsell";
}

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

// Mapping: ra6→getInputDialogType, lV6→isConfirmingAction, na6→hasBlockingDialog,
//          W7→isMessageSelectorVisible, y2→isLoading, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue, n→workerSandboxPermissions,
//          o→elicitation, m26→costWarningActive, W6→ideOnboardingActive,
//          g6→effortCalloutActive, J1→remoteCalloutActive, e8→lspRecommendationActive,
//          E1→desktopUpsellActive
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

**What it does**: Handles Escape key press to cancel current operation.

**How it works**:
1. Check if cancellation is allowed (elicitation cannot be cancelled)
2. Force end concurrent query lock
3. Handle specific dialog type cancellation
4. Reset loading state
5. Clear appropriate queues

**Why this approach**:
- Elicitation cannot be cancelled (MCP protocol requirement)
- Different dialogs have different cancel behaviors
- Cancel propagates through the entire query chain

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation handler
// Location: chunks.196.mjs:420-460
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

    // STEP 3: Handle based on current dialog type
    switch (focusedInputDialog) {
        case "tool-permission":
            // Abort the tool execution
            abortController.abort("interrupt");
            // Clear the permission queue
            setToolPermissionQueue([]);
            break;

        case "prompt":
            // Reject all queued prompts
            promptQueue.forEach(prompt => {
                prompt.reject(new Error("Prompt cancelled by user"));
            });
            setPromptQueue([]);
            // Abort the request
            abortController.abort("interrupt");
            break;

        default:
            // Standard abort
            abortController.abort("interrupt");
    }

    // STEP 4: Reset loading state
    resetLoadingState();

    // STEP 5: Clear pending tool use state
    setPendingToolUseSummary(null);

    // STEP 6: Return to prompt mode
    setStreamMode("prompt");

    debugLog("[onCancel] Cancel complete");
}
```

### 3.2 Cancel Behavior by Dialog Type

| Dialog Type | Cancel Behavior | Side Effects |
|-------------|-----------------|--------------|
| elicitation | No cancel allowed | None (MCP protocol) |
| tool-permission | Abort tool, clear queue | Tool returns error |
| prompt | Reject all prompts, abort | All prompts error |
| sandbox-permission | Abort network request | Request fails |
| default | Abort request | Stream terminates |

---

## 4. Session Orchestrator (ot8)

### 4.1 Component Structure

```javascript
// ============================================
// sessionOrchestrator (ot8) - Main session component
// Location: chunks.196.mjs:3-400
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
    // Component implementation
}

// READABLE (for understanding):
function sessionOrchestrator({
    commands,              // Slash commands
    debug,                 // Debug mode
    initialTools,          // Initial tool set
    initialMessages,       // Conversation history
    pendingHookMessages,   // Messages from hooks
    initialFileHistorySnapshots,
    initialContentReplacements,
    initialAgentName,
    initialAgentColor,
    mcpClients,
    dynamicMcpConfig,
    autoConnectIdeFlag,
    strictMcpConfig = false,
    systemPrompt,
    appendSystemPrompt,
    onBeforeQuery,
    onTurnComplete,
    disabled = false,
    mainThreadAgentDefinition,
    disableSlashCommands = false,
    taskListId,
    remoteSessionConfig,
    directConnectConfig,
    sshSession,
    thinkingConfig
}) {
    // Check if remote session
    let isRemoteSession = !!remoteSessionConfig;

    // Mount/unmount tracking
    React.useEffect(() => {
        debugLog(`[REPL:mount] REPL mounted, disabled=${disabled}`);
        return () => debugLog("[REPL:unmount] REPL unmounting");
    }, [disabled]);

    // State: Main thread agent
    let [mainThreadAgent, setMainThreadAgent] = useState(mainThreadAgentDefinition);

    // State: From global store
    let toolPermissionContext = useAppState(s => s.toolPermissionContext);
    let verbose = useAppState(s => s.verbose);
    let mcp = useAppState(s => s.mcp);
    let plugins = useAppState(s => s.plugins);
    let agentDefinitions = useAppState(s => s.agentDefinitions);
    let fileHistory = useAppState(s => s.fileHistory);
    let initialMessage = useAppState(s => s.initialMessage);

    // State: Stream mode
    let [streamMode, setStreamMode] = useState("prompt");

    // State: UI state
    let [uiState, setUIState] = useState("responding");
    let uiStateRef = useRef(uiState);
    uiStateRef.current = uiState;

    // State: Tool uses in progress
    let [toolUses, setToolUses] = useState([]);
    let [thinkingState, setThinkingState] = useState(null);

    // State: Permission queues
    let [toolPermissionQueue, setToolPermissionQueue] = useState([]);
    let [sandboxPermissionQueue, setSandboxPermissionQueue] = useState([]);

    // State: Input queues
    let [promptQueue, setPromptQueue] = useState([]);
    let [elicitationQueue, setElicitationQueue] = useState([]);

    // ... more state and effects
}

// Mapping: ot8→sessionOrchestrator
```

### 4.2 State Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SESSION ORCHESTRATOR STATE FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Props (Immutable)                                                          │
│  ├─ commands, initialTools, initialMessages                                 │
│  ├─ mcpClients, systemPrompt                                                │
│  └─ remoteSessionConfig, thinkingConfig                                     │
│                                                                              │
│  Global State (useAppState)                                                 │
│  ├─ toolPermissionContext                                                   │
│  ├─ verbose, mcp, plugins                                                   │
│  ├─ agentDefinitions, fileHistory                                           │
│  └─ workerSandboxPermissions, elicitation                                   │
│                                                                              │
│  Local State (useState)                                                     │
│  ├─ streamMode: prompt | requesting | responding | tool-use                 │
│  ├─ uiState: requesting | thinking | responding | tool-input | tool-use    │
│  ├─ toolUses: ToolExecution[]                                               │
│  ├─ thinkingState: ThinkingBlockState | null                                │
│  ├─ toolPermissionQueue: PermissionRequest[]                                │
│  ├─ sandboxPermissionQueue: SandboxRequest[]                                │
│  ├─ promptQueue: PromptRequest[]                                            │
│  └─ elicitationQueue: ElicitationRequest[]                                  │
│                                                                              │
│  Refs (escape React lifecycle)                                              │
│  ├─ uiStateRef: current uiState for non-React callbacks                     │
│  ├─ pendingToolUseSummaryRef: tool summary between turns                    │
│  └─ resetLoadingStateRef: callback to reset loading                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Event Handling

### 5.1 handleStreamedEvent

**What it does**: Processes events from mainAgentLoop and updates UI state.

**How it works**:
1. Route event by type
2. Update appropriate state
3. Trigger re-render

```javascript
// ============================================
// handleStreamedEvent (rV6) - Event processor
// Location: chunks.196.mjs:500-600
// ============================================

// READABLE (for understanding):
function handleStreamedEvent(event) {
    switch (event.type) {
        case "assistant":
            // New assistant message complete
            setMessages(prev => [...prev, event.message]);
            break;

        case "user":
            // Tool result message
            setMessages(prev => [...prev, event.message]);
            break;

        case "stream_event":
            // SSE event from API
            handleStreamEvent(event.event);
            break;

        case "tool_result":
            // Tool execution result
            handleToolResult(event);
            break;

        case "error":
            // Error occurred
            handleError(event.error);
            break;
    }
}

function handleStreamEvent(sseEvent) {
    switch (sseEvent.type) {
        case "content_block_start":
            if (sseEvent.content_block.type === "tool_use") {
                setStreamMode("tool-input");
            } else if (sseEvent.content_block.type === "thinking") {
                setStreamMode("thinking");
                setThinkingState({
                    isStreaming: true,
                    content: ""
                });
            }
            break;

        case "content_block_delta":
            if (sseEvent.delta.type === "input_json_delta") {
                // Accumulate tool input
                setToolUses(prev => {
                    let updated = [...prev];
                    let tool = updated.find(t => t.id === sseEvent.index);
                    if (tool) {
                        tool.inputJson += sseEvent.delta.partial_json;
                    }
                    return updated;
                });
            }
            break;

        case "content_block_stop":
            if (streamMode === "tool-input") {
                setStreamMode("tool-use");
            } else if (streamMode === "thinking") {
                setThinkingState(prev => ({
                    ...prev,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
                setStreamMode("responding");
            }
            break;

        case "message_stop":
            setStreamMode("prompt");
            break;
    }
}
```

---

## 6. Deferred Rendering

### 6.1 Message Update Batching

**Why deferred rendering**:
- Prevents re-renders during fast streaming
- Keeps input responsive
- Batches multiple updates together

```javascript
// ============================================
// Deferred Message Updates
// Location: chunks.196.mjs:200-250
// ============================================

// READABLE (for understanding):
let [deferredMessages, setDeferredMessages] = useState([]);
let [pendingMessages, setPendingMessages] = useState([]);
let flushTimeoutRef = useRef(null);

function queueMessageUpdate(message) {
    // Add to pending queue
    setPendingMessages(prev => [...prev, message]);

    // Schedule flush if not already scheduled
    if (!flushTimeoutRef.current) {
        flushTimeoutRef.current = setTimeout(() => {
            // Flush all pending messages
            setDeferredMessages(prev => [...prev, ...pendingMessages]);
            setPendingMessages([]);
            flushTimeoutRef.current = null;
        }, 16); // ~60fps
    }
}

// Cancel pending flush on unmount
useEffect(() => {
    return () => {
        if (flushTimeoutRef.current) {
            clearTimeout(flushTimeoutRef.current);
        }
    };
}, []);
```

---

## 7. Key Insights

### 7.1 Design Decisions

**Why separate streamMode and uiState?**
- `streamMode` tracks LLM interaction phase
- `uiState` tracks display/rendering state
- They can diverge (e.g., streaming thinking but showing tool-use)

**Why dialog priority system?**
- Security-critical dialogs must show before informational
- User-initiated dialogs (message selector) have highest priority
- Elicitation cannot be cancelled (MCP protocol)

**Why deferred rendering?**
- Input responsiveness during streaming
- Batching reduces re-renders
- 16ms delay is imperceptible

### 7.2 Common Patterns

**Pattern: Queue-based dialogs**
```javascript
// Add to queue
setToolPermissionQueue(prev => [...prev, request]);

// Process queue
let current = toolPermissionQueue[0];
if (current) {
    // Show dialog for current
    // On response: remove from queue, process next
    setToolPermissionQueue(prev => prev.slice(1));
}
```

**Pattern: Ref for non-React callbacks**
```javascript
// Keep ref in sync with state
let stateRef = useRef(state);
stateRef.current = state;

// Use ref in callbacks outside React lifecycle
function someCallback() {
    console.log(stateRef.current); // Always current
}
```

---

## Related Documents

> UI Module:
> - [dialog_system.md](../02_ui/dialog_system.md) - Dialog system details
> - [rendering_pipeline.md](../02_ui/rendering_pipeline.md) - Rendering pipeline
> - [streaming_ui.md](../02_ui/streaming_ui.md) - Streaming UI

> Joint Analysis:
> - [cli_ui_llm_joint_complete_v4.md](../00_overview/cli_ui_llm_joint_complete_v4.md) - Complete joint analysis

> Symbol Index:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI symbols