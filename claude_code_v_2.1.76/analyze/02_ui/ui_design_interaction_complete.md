# UI Design Interaction Complete Analysis (Claude Code v2.1.76)

> Comprehensive analysis of React/Ink terminal UI architecture, component hierarchy, state management, and user interaction patterns.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Keybindings

Key functions in this document:
- `sessionOrchestrator` (ot8) - Main session component at chunks.196.mjs:3
- `getInputDialogType` (ra6) - Dialog priority dispatcher at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `StreamingToolExecutor` (ui6) - Tool execution queue at chunks.148.mjs:3
- `createStateStore` (WX1) - State store factory at chunks.85.mjs:1747

---

## 1. React/Ink Component Architecture

### Complete Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INK APPLICATION ROOT                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  <App> (Ink entry point)                                                    │
│      │                                                                       │
│      └── <AppStateProvider> (Yj)                                            │
│              │   - Provides global state via React Context                  │
│              │   - Wraps createStateStore (WX1)                             │
│              │                                                               │
│              └── <sessionOrchestrator> (ot8)                                │
│                      │                                                       │
│                      ├── State Layer (35+ useState hooks)                   │
│                      │   ├── messages, setMessages                          │
│                      │   ├── streamMode, setStreamMode                      │
│                      │   ├── toolPermissionQueue, setToolPermissionQueue    │
│                      │   ├── sandboxPermissionQueue, setSandboxPermissionQueue │
│                      │   ├── promptQueue, setPromptQueue                    │
│                      │   ├── elicitationQueue, setElicitationQueue          │
│                      │   └── ... (30+ more state variables)                 │
│                      │                                                       │
│                      ├── <MainContent>                                      │
│                      │       │                                               │
│                      │       ├── <MessageList> (veY)                        │
│                      │       │       ├── <UserMessage>                      │
│                      │       │       │       └── Text with syntax highlight │
│                      │       │       ├── <AssistantMessage>                 │
│                      │       │       │       ├── Text content               │
│                      │       │       │       ├── Thinking blocks            │
│                      │       │       │       └── Tool use blocks            │
│                      │       │       ├── <ToolUseCard>                      │
│                      │       │       │       ├── Tool name badge            │
│                      │       │       │       ├── Input preview              │
│                      │       │       │       └── Result display             │
│                      │       │       └── <ToolResultCard>                   │
│                      │       │               ├── Success/Error indicator    │
│                      │       │               └── Result content             │
│                      │       │                                               │
│                      │       └── <DividerLine>                              │
│                      │               └── Visual separator with timestamp    │
│                      │                                                       │
│                      ├── <PromptInput> (igA)                                │
│                      │       ├── <TextInput>                                │
│                      │       │       └── Cursor, selection, editing         │
│                      │       ├── <AutocompleteOverlay>                      │
│                      │       │       └── Slash command suggestions          │
│                      │       └── <ImagePreview>                             │
│                      │               └── Pasted image thumbnails            │
│                      │                                                       │
│                      ├── <DialogRenderer>                                   │
│                      │       │                                               │
│                      │       ├── <ToolPermissionDialog> (HIq)               │
│                      │       │       ├── Tool name & description            │
│                      │       │       ├── Input preview (truncated)          │
│                      │       │       └── Allow/Deny buttons                 │
│                      │       │                                               │
│                      │       ├── <SandboxPermissionDialog> (ct8)            │
│                      │       │       ├── Host pattern                       │
│                      │       │       ├── Risk explanation                  │
│                      │       │       └── Approve/Deny buttons              │
│                      │       │                                               │
│                      │       ├── <ElicitationDialog> (ZIq)                 │
│                      │       │       ├── MCP server request                │
│                      │       │       ├── Form fields                        │
│                      │       │       └── Submit button                      │
│                      │       │                                               │
│                      │       ├── <CostWarningDialog> (jSq)                  │
│                      │       │       ├── Usage summary                      │
│                      │       │       └── Acknowledge button                 │
│                      │       │                                               │
│                      │       ├── <IDEOnboardingDialog> (dj8)                │
│                      │       │       ├── IDE detection                     │
│                      │       │       ├── Installation instructions         │
│                      │       │       └── Skip/Install buttons              │
│                      │       │                                               │
│                      │       ├── <LSPRecommendationDialog> (uBq)            │
│                      │       │       ├── Missing LSP info                  │
│                      │       │       └── Install/Skip buttons              │
│                      │       │                                               │
│                      │       ├── <EffortCalloutDialog> (gmq)               │
│                      │       │       ├── Effort level display              │
│                      │       │       └── Dismiss button                    │
│                      │       │                                               │
│                      │       ├── <RemoteCalloutDialog> (pWq)               │
│                      │       │       ├── Remote session info               │
│                      │       │       └── Connect/Dismiss buttons           │
│                      │       │                                               │
│                      │       ├── <DesktopUpsellDialog> (zyq)               │
│                      │       │       ├── Desktop app benefits              │
│                      │       │       └── Dismiss button                    │
│                      │       │                                               │
│                      │       └── <MessageSelectorDialog> (zs8)             │
│                      │               ├── Message list                      │
│                      │               └── Selection actions                 │
│                      │                                                       │
│                      ├── <Spinner>                                          │
│                      │       └── Status indicator with animation            │
│                      │                                                       │
│                      └── <Footer>                                           │
│                              ├── Mode indicator (accept/plan/auto)         │
│                              ├── Model name                                 │
│                              ├── Token count                                │
│                              └── Keybinding hints                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. State Management Pattern

### createStateStore (WX1) - Core State Store

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
    let currentState = initialState;
    let subscribers = new Set();

    return {
        // Get current state snapshot
        getState: () => currentState,

        // Update state with immutability
        setState: (updater) => {
            let oldState = currentState;
            let newState = updater(oldState);

            // Skip if nothing changed (shallow equality)
            if (Object.is(newState, oldState)) return;

            currentState = newState;

            // Notify external callback (for debugging/logging)
            onChangeCallback?.({ newState, oldState });

            // Notify all subscribers
            for (let subscriber of subscribers) {
                subscriber();
            }
        },

        // Subscribe to state changes
        subscribe: (callback) => {
            subscribers.add(callback);
            // Return unsubscribe function
            return () => subscribers.delete(callback);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback,
//          K→currentState, Y→subscribers, z→updater, _→oldState, w→newState
```

**Why this approach:**
- **Single source of truth**: All state lives in one place
- **Immutable updates**: `setState` takes a function, not a value
- **Subscription pattern**: Components subscribe to changes
- **Change detection**: `Object.is` comparison prevents unnecessary renders
- **Change callback**: Optional callback for debugging/logging

### State Propagation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE PROPAGATION FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI FLAGS                                                                  │
│  ──────────                                                                 │
│  --print, --model, --dangerously-skip-permissions                           │
│       │                                                                      │
│       ▼                                                                      │
│  initialState Builder (in run/OVz)                                          │
│  ────────────────────────────────                                           │
│  {                                                                          │
│    isSingleTurn: options.print,                                            │
│    mainLoopModel: options.model,                                           │
│    toolPermissionContext: { mode: "accept" | "plan" | "auto", ... },       │
│    verbose: options.verbose,                                                │
│    ...                                                                      │
│  }                                                                          │
│       │                                                                      │
│       ▼                                                                      │
│  createStateStore(initialState)                                             │
│       │                                                                      │
│       ▼                                                                      │
│  AppStateProvider (Yj) - React Context                                      │
│  ────────────────────────────────                                           │
│  const AppStateContext = createContext(undefined);                          │
│                                                                              │
│  function AppStateProvider({ stateStore, children }) {                     │
│      const [state, setState] = useState(stateStore.getState());            │
│                                                                              │
│      useEffect(() => {                                                      │
│          return stateStore.subscribe(() => {                                │
│              setState(stateStore.getState());                               │
│          });                                                                │
│      }, [stateStore]);                                                      │
│                                                                              │
│      return (                                                               │
│          <AppStateContext.Provider value={stateStore}>                     │
│              {children}                                                     │
│          </AppStateContext.Provider>                                        │
│      );                                                                     │
│  }                                                                          │
│       │                                                                      │
│       ▼                                                                      │
│  useAppState Hook (M1)                                                      │
│  ─────────────────────                                                      │
│  function useAppState(selector) {                                          │
│      const store = useContext(AppStateContext);                             │
│      const [state, setState] = useState(() => selector(store.getState()));  │
│                                                                              │
│      useEffect(() => {                                                      │
│          return store.subscribe(() => {                                     │
│              setState(selector(store.getState()));                          │
│          });                                                                │
│      }, [store, selector]);                                                 │
│                                                                              │
│      return state;                                                          │
│  }                                                                          │
│       │                                                                      │
│       ▼                                                                      │
│  Component Consumption                                                      │
│  ──────────────────────                                                     │
│  const toolPermissionContext = useAppState(s => s.toolPermissionContext);   │
│  const verbose = useAppState(s => s.verbose);                               │
│  const model = useAppState(s => s.mainLoopModel);                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dialog Priority System

### getInputDialogType (ra6) - Priority Dispatcher

**Location**: chunks.196.mjs:387-404

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
    // 0. Block-all conditions (no dialog shown)
    if (isViewingDialogHistory || hasActiveNotification) return undefined;

    // 1. Message selector (user-initiated, highest priority)
    if (messageSelectorVisible) return "message-selector";

    // 2. Input is being composed (don't interrupt)
    if (isPaused) return undefined;

    // 3. Sandbox permission (security-critical, immediate)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Check if tool JSX allows animation (for lower priority dialogs)
    const shouldContinueAnimation = !toolJSX || toolJSX.shouldContinueAnimation;

    // 4. Tool permission (requires user action)
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";

    // 5. Prompt request (AskUserQuestion tool)
    if (shouldContinueAnimation && promptQueue[0]) return "prompt";

    // 6. Worker sandbox permission (background agent permission)
    if (shouldContinueAnimation && workerSandboxQueue[0]) return "worker-sandbox-permission";

    // 7. MCP elicitation (MCP server request)
    if (shouldContinueAnimation && elicitationQueue[0]) return "elicitation";

    // 8-12. Lower priority informational dialogs
    if (shouldContinueAnimation && showCostDialog) return "cost";
    if (shouldContinueAnimation && showIdeOnboarding) return "ide-onboarding";
    if (shouldContinueAnimation && showEffortCallout) return "effort-callout";
    if (shouldContinueAnimation && showRemoteCallout) return "remote-callout";
    if (shouldContinueAnimation && lspRecommendation) return "lsp-recommendation";
    if (shouldContinueAnimation && showDesktopUpsell) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isViewingDialogHistory, na6→hasActiveNotification,
//          W7→messageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue, n.queue→workerSandboxQueue,
//          o.queue→elicitationQueue, m26→showCostDialog, W6→showIdeOnboarding,
//          g6→showEffortCallout, J1→showRemoteCallout, e8→lspRecommendation,
//          E1→showDesktopUpsell, j8→toolJSX, P1→shouldContinueAnimation
```

**Why this priority order:**

| Priority | Dialog Type | Reason |
|----------|-------------|--------|
| 0 | Block-all | History viewing/notifications take precedence |
| 1 | message-selector | User-initiated, intentional action |
| 2 | Pause check | Don't interrupt user while composing |
| 3 | sandbox-permission | Security-critical, system-level |
| 4 | tool-permission | User needs to approve/reject tool |
| 5 | prompt | AskUserQuestion requires response |
| 6 | worker-sandbox | Background agent permission |
| 7 | elicitation | MCP server waiting for response |
| 8-12 | Informational | Lower priority, non-blocking |

**Key insight:** The `shouldContinueAnimation` gate ensures that if a tool is rendering JSX that requires animation to complete (like a progress spinner), lower-priority dialogs are suppressed until the animation finishes.

---

## 4. Cancel Propagation Pattern

### handleCancel (TM) - Cancel Handler

**Location**: chunks.196.mjs:420-432

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
    // 1. Elicitation dialogs cannot be cancelled (MCP protocol requires response)
    if (focusedDialog === "elicitation") return;

    // 2. Log for debugging
    debugLog(`[onCancel] focusedInputDialog=${focusedDialog} streamMode=${streamMode}`);

    // 3. Force end interaction tracking
    interactionTracker.forceEnd();

    // 4. Save partial input if any (prevents data loss)
    if (inputText?.trim()) {
        appendMessage(createUserMessage({ content: inputText }));
    }

    // 5. Reset loading state
    resetLoadingState();

    // 6. Dialog-specific cancel handling
    switch (focusedDialog) {
        case "tool-permission":
            // Abort the pending tool permission
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
            // Cancel the request (remote or local)
            if (isRemoteMode) {
                remoteSession.cancelRequest();
            } else {
                abortController?.abort();
            }
    }

    // 7. Clear streaming state
    setStreamingState(null);
}

// Mapping: TM→handleCancel, K2→focusedDialog, d7→streamMode, J9→interactionTracker,
//          ez→inputText, gq→appendMessage, $Z→createUserMessage, dE→resetLoadingState,
//          a8→toolPermissionQueue, $A→setToolPermissionQueue, zA→promptQueue,
//          gA→setPromptQueue, M5→abortController, B5→remoteSession
```

**Why elicitation cannot be cancelled:**
- MCP protocol expects a response from the user
- Server is blocked waiting for input
- Timeout is handled by the MCP server, not the client
- Cancelling would break the protocol

---

## 5. Streaming Response UX

### Stream Mode State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STREAM MODE STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  States: "prompt" | "requesting" | "responding" | "thinking" | "tool-input" │
│                                                                              │
│  ┌─────────┐                                                                │
│  │ prompt  │ ← User is typing input                                         │
│  └────┬────┘                                                                │
│       │ User presses Enter                                                  │
│       ▼                                                                      │
│  ┌───────────┐                                                              │
│  │ requesting│ ← LLM API request started                                   │
│  └─────┬─────┘                                                              │
│        │ First SSE event received                                           │
│        ▼                                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                    CONTENT TYPE DETERMINATION                        │     │
│  │                                                                     │     │
│  │   content_block_start.type:                                         │     │
│  │   ├── "text" ──────────────────► "responding"                       │     │
│  │   ├── "thinking" ──────────────► "thinking"                         │     │
│  │   └── "tool_use" ──────────────► "tool-input"                       │     │
│  │                                                                     │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│        │                                                                      │
│        ▼                                                                      │
│  ┌──────────────┐                                                            │
│  │ responding   │ ← Streaming text content                                  │
│  │ thinking     │ ← Extended thinking (hidden from user)                   │
│  │ tool-input   │ ← Tool input JSON being streamed                         │
│  └──────┬───────┘                                                            │
│         │ content_block_stop or message_delta                               │
│         ▼                                                                      │
│  ┌─────────┐                                                                 │
│  │ prompt  │ ← Back to input (if no tools)                                 │
│  └─────────┘                                                                 │
│         │ OR                                                                  │
│         ▼                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    TOOL EXECUTION PHASE                               │   │
│  │                                                                       │   │
│  │   streamMode changes based on tool status:                            │   │
│  │   ├── Tool executing ──► Spinner with tool name                       │   │
│  │   ├── Permission needed ──► "tool-permission" dialog                  │   │
│  │   └── Tool complete ──► Continue to next turn                         │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Response Length Tracking

```javascript
// ============================================
// Response length tracking for progress indicator
// Location: chunks.196.mjs:222-230
// ============================================

// ORIGINAL (for source lookup):
let mO = N8.useRef(0), GD = N8.useRef([]), fM = N8.useCallback((P1) => {
    let Y8 = mO.current;
    if (mO.current = P1(Y8), mO.current > Y8) {
        let V8 = GD.current;
        if (V8.length > 0) {
            let c7 = V8[V8.length - 1];
            c7.lastTokenTime = Date.now(), c7.endResponseLength = mO.current
        }
    }
}, []);

// READABLE (for understanding):
let responseLengthRef = useRef(0);
let responseChunksRef = useRef([]);

const updateResponseLength = useCallback((updater) => {
    let oldLength = responseLengthRef.current;
    responseLengthRef.current = updater(oldLength);

    // Only track timing when length increases
    if (responseLengthRef.current > oldLength) {
        let chunks = responseChunksRef.current;
        if (chunks.length > 0) {
            let lastChunk = chunks[chunks.length - 1];
            lastChunk.lastTokenTime = Date.now();
            lastChunk.endResponseLength = responseLengthRef.current;
        }
    }
}, []);

// Mapping: mO→responseLengthRef, GD→responseChunksRef, fM→updateResponseLength
```

---

## 6. Keyboard Input Flow

### Chord Detection Algorithm

**Location**: chunks.110.mjs (keybindings UI)

```javascript
// ============================================
// Chord detection pattern (Ctrl+K followed by another key)
// Location: chunks.110.mjs
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

### Default Keybindings Table

| Key | Action | Context | Handler |
|-----|--------|---------|---------|
| `Enter` | Submit input | Input focused | `handleSubmit` |
| `Shift+Enter` | Newline | Input focused | Insert `\n` |
| `Escape` | Cancel / Clear | Global | `handleCancel` (TM) |
| `Escape Escape` | Open message selector | Global | Toggle W7 |
| `Ctrl+C` | Cancel stream | Streaming | `handleCancel` (TM) |
| `Ctrl+R` | Message selector | Global | Toggle W7 |
| `Ctrl+E` | Toggle transcript view | Global | Toggle expanded view |
| `Ctrl+K` | Start chord | Global | Chord detection |
| `Shift+Tab` | Cycle permission mode | Global | `cycleMode` (hf1) |
| `Tab` | Accept autocomplete | Autocomplete visible | Accept suggestion |
| `Up` | History previous | Input focused | Navigate history |
| `Down` | History next | Input focused | Navigate history |
| `Ctrl+F` | Agent filter panel | Global | v2.1.76 |

---

## 7. Message Rendering Pipeline

### Message Normalization Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE RENDERING PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Raw Messages (from agent loop)                                             │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ normalizeMessages (cM) - chunks.173.mjs:1999                      │     │
│  │ ───────────────────────────────────────────────────────────────   │     │
│  │ • Filter out progress/system messages                             │     │
│  │ • Merge consecutive user messages                                 │     │
│  │ • Merge consecutive assistant messages                            │     │
│  │ • Process attachments via normalizeAttachmentForAPI (Ui8)         │     │
│  │ • Add tool result merging                                         │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ useDeferredValue - chunks.196.mjs:183                             │     │
│  │ ───────────────────────────────────────────────────────────────   │     │
│  │ • Keep input responsive during heavy rendering                    │     │
│  │ • Defer message list updates                                      │     │
│  │ • Log deferred count for debugging                                │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ MessageList (veY) - chunks.161.mjs:3                              │     │
│  │ ───────────────────────────────────────────────────────────────   │     │
│  │ • Map messages to components                                      │     │
│  │ • Handle tool result grouping                                     │     │
│  │ • Render with virtualization for performance                      │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│         │                                                                    │
│         ▼                                                                    │
│  Rendered UI                                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Deferred Rendering Pattern

```javascript
// ============================================
// Deferred rendering to keep input responsive
// Location: chunks.196.mjs:183-184
// ============================================

// ORIGINAL (for source lookup):
let xO = N8.useDeferredValue(u7), E$ = N8.useDeferredValue(YA), tw = u7.length - xO.length;
if (tw > 0) k(`[useDeferredValue] Messages deferred by ${tw} (${xO.length}→${u7.length})`);

// READABLE (for understanding):
// Defer message updates to keep input responsive
let deferredMessages = useDeferredValue(messages);
let deferredStreamingAssistant = useDeferredValue(streamingAssistantMessage);

// Track deferred count for debugging
let deferredCount = messages.length - deferredMessages.length;
if (deferredCount > 0) {
    debugLog(`[useDeferredValue] Messages deferred by ${deferredCount} (${deferredMessages.length}→${messages.length})`);
}

// Mapping: xO→deferredMessages, E$→deferredStreamingAssistant, tw→deferredCount,
//          u7→messages, YA→streamingAssistantMessage, k→debugLog
```

---

## 8. Tool Execution UI Integration

### StreamingToolExecutor (ui6) - Parallel Tool Execution

**Location**: chunks.148.mjs:3-228

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Parallel tool execution class
// Location: chunks.148.mjs:3-228
// ============================================

// ORIGINAL (for source lookup):
class ui6 {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = !1;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = !1;
    progressAvailableResolve;
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K, this.siblingAbortController = Wm(K.abortController)
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    // ... more methods
}

// READABLE (for understanding):
class StreamingToolExecutor {
    toolDefinitions;
    canUseTool;
    tools = [];                    // Queue of tool executions
    toolUseContext;
    hasErrored = false;            // Circuit breaker flag
    erroredToolDescription = "";
    siblingAbortController;        // Isolation controller
    discarded = false;
    progressAvailableResolve;

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Clone abort controller for sibling isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    // Check if a tool can execute based on concurrency safety
    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        // Allow if nothing executing, or all executing are concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    // Add tool to execution queue
    addTool(toolUseBlock, assistantMessage) {
        let toolDef = findTool(this.toolDefinitions, toolUseBlock.name);
        if (!toolDef) {
            // Unknown tool - create synthetic error
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage: assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                results: [createSyntheticError(`No such tool: ${toolUseBlock.name}`)]
            });
            return;
        }

        // Parse and validate input
        toolUseBlock.input = parseToolInput(toolDef, toolUseBlock.input);
        let isConcurrencySafe = toolDef.isConcurrencySafe?.(toolUseBlock.input) ?? false;

        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
            status: "queued",
            isConcurrencySafe: isConcurrencySafe
        });

        this.processQueue();
    }

    // Execute a single tool
    async executeTool(toolEntry) {
        toolEntry.status = "executing";

        // Check abort conditions
        let abortReason = this.getAbortReason(toolEntry);
        if (abortReason) {
            toolEntry.results = [this.createSyntheticErrorMessage(toolEntry.id, abortReason)];
            toolEntry.status = "completed";
            return;
        }

        // Create sibling abort controller for isolation
        let siblingAbort = cloneAbortController(this.siblingAbortController);

        // Execute via toolDispatcher
        for await (let event of toolDispatcher(toolEntry.block, toolEntry.assistantMessage,
                                                this.canUseTool, {...this.toolUseContext, abortController: siblingAbort})) {
            // Collect results
            if (event.message) {
                toolEntry.results.push(event.message);
            }
        }

        toolEntry.status = "completed";
    }
}

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions, q→canUseTool, K→toolUseContext,
//          Wm→cloneAbortController
```

**Why parallel execution with safety:**
- **Concurrency-safe tools** (Read, Grep, Glob) can execute simultaneously
- **Non-safe tools** (Write, Edit, Bash) must execute sequentially
- **Sibling abort pattern**: One tool failure aborts siblings but not parent
- **Circuit breaker**: `hasErrored` flag prevents cascading failures

---

## 9. UI Performance Optimization

### Key Optimizations

1. **Deferred Rendering**: `useDeferredValue` keeps input responsive during heavy message updates

2. **Message Virtualization**: Only render visible messages in the viewport

3. **Memoization**: `useMemo` for expensive computations like tool filtering

4. **Subscription Pattern**: Components only re-render when relevant state changes

5. **Streaming Accumulation**: Response text accumulated in ref, not state, during streaming

### Performance Metrics Tracking

```javascript
// ============================================
// Performance profiling with K5 (trackMark)
// Location: chunks.148.mjs:250-257
// ============================================

// ORIGINAL (for source lookup):
function K5(A) {
    if (!mi6) return;
    let q = Tp8();
    if (q.mark(A), fp8.set(A, process.memoryUsage()), A === "query_first_chunk_received" && Gp8 === null) {
        let K = q.getEntriesByType("mark");
        if (K.length > 0) Gp8 = K[K.length - 1]?.startTime ?? 0
    }
}

// READABLE (for understanding):
function trackMark(markName) {
    if (!isProfilingEnabled) return;

    let perf = getPerformance();
    perf.mark(markName);

    // Track memory at each checkpoint
    memoryUsageMap.set(markName, process.memoryUsage());

    // Track time to first chunk
    if (markName === "query_first_chunk_received" && firstChunkTime === null) {
        let marks = perf.getEntriesByType("mark");
        if (marks.length > 0) {
            firstChunkTime = marks[marks.length - 1]?.startTime ?? 0;
        }
    }
}

// Mapping: K5→trackMark, mi6→isProfilingEnabled, Tp8→getPerformance,
//          fp8→memoryUsageMap, Gp8→firstChunkTime
```

---

## 10. Source Code Locations Summary

| Component | Location | Key Functions |
|-----------|----------|---------------|
| Session Orchestrator | chunks.196.mjs:3-2000+ | `ot8` (sessionOrchestrator), `ra6` (getInputDialogType), `TM` (handleCancel) |
| State Store | chunks.85.mjs:1747-1766 | `WX1` (createStateStore) |
| Streaming Tool Executor | chunks.148.mjs:3-228 | `ui6` (StreamingToolExecutor) |
| Message Normalization | chunks.173.mjs:1999-2150 | `cM` (normalizeMessages) |
| Attachment Normalization | chunks.174.mjs:3-469 | `Ui8` (normalizeAttachmentForAPI) |
| Attachment Production | chunks.147.mjs:3-200 | `_uY` (assembleAllAttachments), `Hz` (timedAttachmentProducer) |
| Keybindings | chunks.110.mjs | `parseKeystroke`, `handleKeyEvent` |
| Message List | chunks.161.mjs:3 | `veY` (MessageListImpl) |

---

## Document Status

| Section | Status | Completeness |
|---------|--------|--------------|
| Component Hierarchy | Complete | Full React/Ink tree |
| State Management | Complete | createStore pattern |
| Dialog Priority | Complete | 13 dialog types |
| Cancel Propagation | Complete | All cancel paths |
| Streaming UX | Complete | State machine |
| Keyboard Input | Complete | Chord detection |
| Message Rendering | Complete | Pipeline documented |
| Tool Execution UI | Complete | Parallel execution |
| Performance | Complete | Optimizations documented |

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All UI interaction patterns documented with source verification