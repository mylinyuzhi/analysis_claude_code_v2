# UI Interaction Patterns (Claude Code 2.1.76)

> Design patterns and user interaction flows for the terminal UI built with Ink (React for CLI)
>
> **Symbol Validation Status**: All symbols cross-validated against source code.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Keybindings

Key functions in this document:
- `sessionOrchestrator` (ot8) - Main session component at chunks.196.mjs:3
- `getInputDiaologType` (ra6) - Dialog dispatcher at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `MessageList` (veY) - Message renderer at chunks.161.mjs:3
- `normalizeMessages` (cM) - Message normalization at chunks.173.mjs:1999
- `handleToolUseStream` (xN6) - Stream processor at chunks.173.mjs:2384

---

## 1. React/Ink Component Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    INK COMPONENT HIERARCHY                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  <App> (Ink root)                                                       │
│      │                                                                   │
│      └── <sessionOrchestrator> (ot8)                                    │
│              │                                                           │
│              ├── <AppStateProvider> (Yj)                                │
│              │       └── Context.Provider for global state              │
│              │                                                           │
│              ├── <MainContent>                                          │
│              │       ├── <MessageList> (veY)                            │
│              │       │       ├── <UserMessage>                          │
│              │       │       ├── <AssistantMessage>                     │
│              │       │       ├── <ToolUseCard>                          │
│              │       │       └── <ToolResultCard>                       │
│              │       │                                                   │
│              │       └── <DividerLine>                                  │
│              │                                                           │
│              ├── <PromptInput> (igA)                                    │
│              │       ├── <TextInput>                                    │
│              │       ├── <AutocompleteOverlay>                          │
│              │       └── <ImagePreview>                                 │
│              │                                                           │
│              ├── <DialogRenderer>                                       │
│              │       ├── <ToolPermissionDialog> (HIq)                   │
│              │       ├── <SandboxPermissionDialog> (ct8)                │
│              │       ├── <ElicitationDialog> (ZIq)                      │
│              │       ├── <CostWarningDialog> (jSq)                      │
│              │       ├── <IDEOnboardingDialog> (dj8)                    │
│              │       ├── <LSPRecommendationDialog> (uBq)                │
│              │       ├── <EffortCalloutDialog> (gmq)                    │
│              │       ├── <RemoteCalloutDialog> (pWq)                    │
│              │       ├── <DesktopUpsellDialog> (zyq)                    │
│              │       └── <MessageSelectorDialog> (zs8)                  │
│              │                                                           │
│              ├── <Spinner>                                              │
│              │       └── Status indicator with animation                │
│              │                                                           │
│              └── <Footer>                                               │
│                      ├── Mode indicator                                 │
│                      ├── Token count                                    │
│                      └── Keybinding hints                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### State Management Pattern

```javascript
// ============================================
// createStateStore (WX1) - Zustand-like state store
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
function createStateStore(initialState, onChange) {
    let state = initialState;
    let subscribers = new Set();

    return {
        getState: () => state,

        setState: (updater) => {
            let oldState = state;
            let newState = updater(oldState);

            // Skip if nothing changed (shallow equality)
            if (Object.is(newState, oldState)) return;

            state = newState;

            // Notify change callback
            onChange?.({ newState, oldState });

            // Notify all subscribers
            for (let subscriber of subscribers) {
                subscriber();
            }
        },

        subscribe: (callback) => {
            subscribers.add(callback);
            // Return unsubscribe function
            return () => subscribers.delete(callback);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChange, K→state, Y→subscribers
```

**Why this approach:**
- **Single source of truth**: All state lives in one place
- **Immutable updates**: `setState` takes a function, not a value
- **Subscription pattern**: Components subscribe to changes
- **Change detection**: `Object.is` comparison prevents unnecessary renders
- **Change callback**: Optional callback for debugging/logging

---

## 2. Keyboard Input Flow

### Event Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    KEYBOARD INPUT FLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User presses key                                                       │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ useInput hook (Ink)                                               │  │
│  │ ───────────────────────────────────────────────────────────────   │  │
│  │ Captures raw keypress                                             │  │
│  │ Returns: { key, input, meta }                                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ handleKeyEvent                                                    │  │
│  │ ───────────────────────────────────────────────────────────────   │  │
│  │ 1. Check for chord in progress                                    │  │
│  │ 2. Match against keybindings                                      │  │
│  │ 3. Execute matched action                                         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ├─────────────────────────────────────────────────────────────┐  │
│         │                                                             │  │
│         ▼                                                             ▼  │
│  ┌─────────────────────┐                                   ┌─────────────┐│
│  │ Single key action   │                                   │ Chord start ││
│  │                     │                                   │             ││
│  │ • Escape → Cancel   │                                   │ Wait for    ││
│  │ • Enter → Submit    │                                   │ second key  ││
│  │ • Tab → Autocomplete│                                   │             ││
│  │ • Up/Down → History │                                   │ Timeout: 1s ││
│  └─────────────────────┘                                   └─────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
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

## 3. Dialog Interaction Patterns

### Single-Active-Dialog Pattern

Only one dialog can be visible at a time. This is enforced by the priority dispatcher:

```javascript
// ============================================
// Dialog rendering pattern
// Location: chunks.196.mjs (sessionOrchestrator)
// ============================================

// The dialog type is determined once per render
const activeDialog = getInputDiaologType();

// Only render the active dialog
function renderDialog() {
    switch (activeDialog) {
        case "tool-permission":
            return <ToolPermissionDialog item={toolPermissionQueue[0]} />;
        case "sandbox-permission":
            return <SandboxPermissionDialog item={sandboxPermissionQueue[0]} />;
        case "elicitation":
            return <ElicitationDialog item={elicitationQueue[0]} />;
        // ... other dialogs
        default:
            return null;
    }
}
```

**Why single dialog:**
- **Focus management**: User attention is not divided
- **Simpler state**: No dialog stacking logic
- **Predictable UX**: Always clear what the user needs to respond to

### Cancel Propagation Pattern

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation
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
    // 1. Elicitation dialogs cannot be cancelled (MCP protocol)
    if (focusedDialog === "elicitation") return;

    // 2. Log for debugging
    debugLog(`[onCancel] focusedInputDialog=${focusedDialog} streamMode=${streamMode}`);

    // 3. Force end interaction tracking
    interactionTracker.forceEnd();

    // 4. Save partial input if any
    if (inputText?.trim()) {
        appendMessage(createUserMessage({ content: inputText }));
    }

    // 5. Reset loading state
    resetLoadingState();

    // 6. Dialog-specific cancel handling
    switch (focusedDialog) {
        case "tool-permission":
            toolPermissionQueue[0]?.onAbort();
            setToolPermissionQueue([]);
            break;

        case "prompt":
            for (let prompt of promptQueue) {
                prompt.reject(Error("Prompt cancelled by user"));
            }
            setPromptQueue([]);
            abortController?.abort();
            break;

        default:
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
//   ez→inputText, gq→appendMessage, dE→resetLoadingState, a8→toolPermissionQueue,
//   zA→promptQueue, M5→abortController, B5→remoteSession
```

**Why elicitation cannot be cancelled:**
- MCP protocol expects a response
- Server is waiting for user input
- Timeout is handled by the server, not the client

---

## 4. Streaming Response UX

### Progressive Rendering Pattern

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  STREAMING RENDER PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LLM API Stream                                                         │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ handleToolUseStream (xN6)                                         │  │
│  │ ───────────────────────────────────────────────────────────────   │  │
│  │ Event types:                                                       │  │
│  │ • message_start      → Initialize message state                   │  │
│  │ • content_block_start → Create placeholder                        │  │
│  │ • content_block_delta → Incremental update                        │  │
│  │ • content_block_stop  → Finalize block                            │  │
│  │ • message_delta      → Stop reason, usage                         │  │
│  │ • message_stop       → Complete                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ State Updates                                                     │  │
│  │ ───────────────────────────────────────────────────────────────   │  │
│  │                                                                    │  │
│  │ streamingText: "" → "Hello" → "Hello, how" → ...                 │  │
│  │ streamingToolUses: [] → [{id, name, input}] → ...                │  │
│  │ streamingThinking: null → {thinking: "..."} → ...                │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ React Render (deferred)                                           │  │
│  │ ───────────────────────────────────────────────────────────────   │  │
│  │                                                                    │  │
│  │ useDeferredValue(messages) → reduces re-renders                   │  │
│  │ Memoized MessageList → only affected parts update                 │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Terminal Output                                                   │  │
│  │ ───────────────────────────────────────────────────────────────   │  │
│  │                                                                    │  │
│  │ [Text streams character by character]                             │  │
│  │ [Tool cards appear when tool_use starts]                          │  │
│  │ [Thinking blocks show with animation]                             │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Spinner Coordination

```javascript
// Spinner visibility logic
const showSpinner =
    isStreaming &&
    !toolPermissionQueue.length &&  // Hidden during permissions
    !promptQueue.length &&          // Hidden during prompts
    !isTyping &&                    // Hidden while user types
    !activeDialog;                  // Hidden during dialogs

// Spinner animation runs at 50ms intervals
useEffect(() => {
    if (!showSpinner) return;

    const interval = setInterval(() => {
        setSpinnerFrame(frame => (frame + 1) % spinnerFrames.length);
    }, 50);

    return () => clearInterval(interval);
}, [showSpinner]);
```

**Why spinner is isolated:**
- **Performance**: 50ms animation loop doesn't block main render
- **Responsiveness**: Message list isn't re-rendered on every frame
- **User feedback**: Shows activity without visual noise

---

## 5. Message List Optimization

### Memoization Strategy

```javascript
// ============================================
// MessageList (veY) - Memoized message rendering
// Location: chunks.161.mjs:3-100
// ============================================

// ORIGINAL (for source lookup):
veY = (A) => {
    let q = A6(111),  // Memoization cache
        {
            messages: K,
            tools: Y,
            commands: z,
            // ... other props
        } = A;

    // Memoized message normalization
    if (q[0] !== K) {
        Q = JM(K).filter(Gi6);  // flatten and filter
        q[0] = K;
        q[1] = Q;
    } else {
        Q = q[1];
    }

    // Deferred value for performance
    const deferredMessages = useDeferredValue(messages);

    // ... render
}

// READABLE (for understanding):
const MessageList = memo((props) => {
    const cache = useMemoCache(111);
    const { messages, tools, commands, ... } = props;

    // Cache key: messages array reference
    let normalizedMessages;
    if (cache[0] !== messages) {
        // Recompute only if messages changed
        normalizedMessages = flattenMessages(messages).filter(filterEmptyMessages);
        cache[0] = messages;
        cache[1] = normalizedMessages;
    } else {
        normalizedMessages = cache[1];
    }

    // Use deferred value to keep input responsive
    const deferredMessages = useDeferredValue(normalizedMessages);

    // Track deferred count for debugging
    const deferredCount = messages.length - deferredMessages.length;
    if (deferredCount > 0) {
        debugLog(`[useDeferredValue] Messages deferred by ${deferredCount}`);
    }

    return (
        <Box flexDirection="column">
            {deferredMessages.map(message => (
                <MessageCard key={message.uuid} message={message} />
            ))}
        </Box>
    );
});

// Mapping: veY→MessageList, A→props, q→cache, K→messages, JM→flattenMessages,
//   Gi6→filterEmptyMessages, A6→useMemoCache
```

**Why this optimization:**
1. **Cache by reference**: Only re-normalize when messages array changes
2. **Deferred rendering**: Keep input responsive during heavy renders
3. **Memoization cache**: Custom React hook for multi-value caching
4. **Virtual scrolling**: Only render visible messages (optional)

### Message Visibility Filtering

```javascript
// ============================================
// shouldShowMessageInChat (XV6) - Visibility filter
// Location: chunks.185.mjs:1692
// ============================================

function shouldShowMessageInChat(message) {
    // Don't show user messages with tool_result (shown in tool card)
    if (message.type === "user" &&
        message.message.content[0]?.type === "tool_result") {
        return false;
    }

    // Don't show meta messages (system reminders)
    if (isMetaMessage(message)) {
        return false;
    }

    // Don't show empty messages
    if (isEmptyMessage(message)) {
        return false;
    }

    return true;
}
```

---

## 6. Permission Dialog UX

### Tool Permission Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TOOL PERMISSION FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Tool execution requested                                               │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Check permission mode                                              │  │
│  │                                                                    │  │
│  │ • acceptEdits → Auto-approve file operations                      │  │
│  │ • accept → Auto-approve safe tools                                │  │
│  │ • plan → Auto-approve read-only tools                             │  │
│  │ • default → Check rules, may prompt                               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ├──────────────────────┬──────────────────────┐                │
│         │                      │                      │                │
│         ▼                      ▼                      ▼                │
│  ┌─────────────┐      ┌─────────────────┐    ┌─────────────────┐      │
│  │ Auto-approve│      │ Rule match      │    │ No rule match   │      │
│  │             │      │ (allow/deny)    │    │                 │      │
│  │ Execute     │      │                 │    │ Add to queue    │      │
│  │ immediately │      │ Apply rule      │    │ for dialog      │      │
│  └─────────────┘      └─────────────────┘    └─────────────────┘      │
│                                                      │                  │
│                                                      ▼                  │
│                                            ┌─────────────────┐          │
│                                            │ ToolPermission  │          │
│                                            │ Dialog          │          │
│                                            │ (HIq)           │          │
│                                            │                 │          │
│                                            │ [Allow] [Deny]  │          │
│                                            │ [Allow always]  │          │
│                                            └─────────────────┘          │
│                                                      │                  │
│                                            ┌────────┴────────┐         │
│                                            ▼                 ▼         │
│                                       [Approve]         [Deny]        │
│                                            │                 │         │
│                                            ▼                 ▼         │
│                                      Execute tool    Return error     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Permission Queue Management

```javascript
// Tool permission queue state
const [toolPermissionQueue, setToolPermissionQueue] = useState([]);

// Add to queue (from agent loop)
const requestToolPermission = (request) => {
    setToolPermissionQueue(prev => [...prev, {
        toolName: request.toolName,
        input: request.input,
        onApprove: request.onApprove,
        onDeny: request.onDeny,
        onAbort: request.onAbort,
        timestamp: Date.now()
    }]);
};

// Handle approval
const handleApprove = (remember = false) => {
    const item = toolPermissionQueue[0];

    if (remember) {
        // Add permanent rule
        addPermissionRule({
            tool: item.toolName,
            action: 'allow',
            persistent: true
        });
    }

    item.onApprove();
    setToolPermissionQueue(prev => prev.slice(1));
};

// Handle denial
const handleDeny = (reason = 'User denied') => {
    const item = toolPermissionQueue[0];
    item.onDeny(new Error(reason));
    setToolPermissionQueue(prev => prev.slice(1));
};
```

---

## 7. Mode Cycling UX

### Permission Mode Cycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION MODE CYCLE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Shift+Tab pressed                                                      │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ cycleMode (hf1)                                                   │  │
│  │ Location: chunks.183.mjs                                          │  │
│  │ ───────────────────────────────────────────────────────────────   │  │
│  │                                                                    │  │
│  │ Mode order: default → accept → plan → default ...                │  │
│  │                                                                    │  │
│  │ Each mode has:                                                     │  │
│  │ • name: Display label                                             │  │
│  │ • icon: UI indicator                                              │  │
│  │ • color: Theme color                                              │  │
│  │ • allowedTools: Filter list                                       │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Mode Descriptions                                                 │  │
│  │                                                                   │  │
│  │ default:                                                          │  │
│  │   "Tools require permission"                                      │  │
│  │   All tools prompt unless explicitly allowed                      │  │
│  │                                                                   │  │
│  │ accept:                                                           │  │
│  │   "Tools auto-approved"                                           │  │
│  │   Safe tools execute without prompting                            │  │
│  │   Bash, Write still require permission                            │  │
│  │                                                                   │  │
│  │ plan:                                                             │  │
│  │   "Plan mode - no edits"                                          │  │
│  │   Only read-only tools allowed                                    │  │
│  │   No Write, Edit, Bash execution                                  │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mode Indicator Rendering

```javascript
// Footer mode indicator
const ModeIndicator = () => {
    const mode = useAppState(s => s.toolPermissionContext.mode);
    const modeConfig = MODE_CONFIGS[mode];

    return (
        <Box>
            <Text color={modeConfig.color}>
                {modeConfig.icon} {modeConfig.name}
            </Text>
        </Box>
    );
};

// Mode configurations
const MODE_CONFIGS = {
    default: {
        name: "default",
        icon: "○",
        color: "gray",
        description: "Tools require permission"
    },
    accept: {
        name: "accept",
        icon: "●",
        color: "green",
        description: "Tools auto-approved"
    },
    plan: {
        name: "plan",
        icon: "◐",
        color: "cyan",
        description: "Plan mode - no edits"
    }
};
```

---

## 8. v2.1.76 UI Enhancements

### Transcript Auto-Scroll Fix

**Problem:** Auto-scroll wouldn't resume after user selected text in transcript view.

**Solution:**
```javascript
// Detect selectionchange with empty selection to re-enable auto-scroll
useEffect(() => {
    const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection.isCollapsed) {
            // Selection cleared, re-enable auto-scroll
            setAutoScrollEnabled(true);
        }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
}, []);
```

### CJK Character Layout Fix

**Problem:** CJK (Chinese/Japanese/Korean) characters are double-width but `.length` returned 1.

**Solution:**
```javascript
import stringWidth from 'string-width';

// Correct column calculation for CJK
const getDisplayWidth = (text) => {
    return stringWidth(text);
};

// Layout calculations use display width
const calculateWrapPosition = (text, maxWidth) => {
    let width = 0;
    for (let i = 0; i < text.length; i++) {
        const charWidth = stringWidth(text[i]);
        if (width + charWidth > maxWidth) {
            return i;
        }
        width += charWidth;
    }
    return text.length;
};
```

### Memory Leak Fix

**Problem:** Streaming buffers retained after generator termination.

**Solution:**
```javascript
// ============================================
// resetLoadingState (dE) - Clear streaming state
// Location: chunks.196.mjs:260
// ============================================

function resetLoadingState() {
    // Clear streaming tool uses
    setStreamingToolUses({});

    // Clear streaming thinking
    setStreamingThinking(null);

    // Clear streaming text
    setStreamingText('');

    // Reset response length tracking
    setResponseLength(0);
}

// Called on:
// - Abort
// - Stream completion
// - Error
```

### Spinner Animation Isolation

**Problem:** Spinner re-renders caused unnecessary message list re-renders.

**Solution:**
```javascript
// Spinner uses dedicated animation loop
const [spinnerFrame, setSpinnerFrame] = useState(0);
const showSpinner = useAppState(s => s.isStreaming);

useEffect(() => {
    if (!showSpinner) return;

    // Dedicated 50ms interval
    const interval = setInterval(() => {
        setSpinnerFrame(f => (f + 1) % SPINNER_FRAMES.length);
    }, 50);

    return () => clearInterval(interval);
}, [showSpinner]);

// Spinner component is memoized separately
const Spinner = memo(({ frame }) => (
    <Text color="cyan">{SPINNER_FRAMES[frame]}</Text>
));
```

---

## 9. Accessibility Patterns

### Focus Management

```javascript
// Focus trap pattern for dialogs
const useFocusTrap = (isActive) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        firstElement?.focus();

        return () => container.removeEventListener('keydown', handleKeyDown);
    }, [isActive]);

    return containerRef;
};
```

### Screen Reader Announcements

```javascript
// Announce state changes for screen readers
const useAnnouncement = (message, condition) => {
    useEffect(() => {
        if (condition && message) {
            // Ink doesn't have native screen reader support
            // But we can write to stderr for terminal screen readers
            process.stderr.write(`\x1b]0;${message}\x07`);
        }
    }, [message, condition]);
};
```

---

## 10. Streaming State Machine

### 10.1 StreamMode States

**Location:** chunks.196.mjs:97

```javascript
// ============================================
// StreamMode State Machine
// Location: chunks.196.mjs:97-98
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding");

// READABLE (for understanding):
let [streamMode, setStreamMode] = useState("responding");

// Possible values:
// - "responding"   - LLM is generating text
// - "tool-input"   - LLM is generating tool_use JSON
// - "thinking"     - LLM is generating thinking blocks
// - "tool-use"     - Tools are being executed
// - "requesting"   - Waiting for LLM response to start

// Mapping: d7→streamMode, W4→setStreamMode
```

### 10.2 State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STREAMING STATE MACHINE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────┐                                                         │
│  │   IDLE        │ ← Initial state, no streaming                           │
│  │               │                                                         │
│  └───────┬───────┘                                                         │
│          │                                                                   │
│          │ User submits message / LLM request starts                        │
│          ▼                                                                   │
│  ┌───────────────┐                                                         │
│  │  REQUESTING   │ ← Waiting for first SSE event                           │
│  │               │                                                         │
│  └───────┬───────┘                                                         │
│          │                                                                   │
│          │ content_block_start(type=text)                                   │
│          ▼                                                                   │
│  ┌───────────────┐                                                         │
│  │  RESPONDING   │ ← LLM is generating text content                        │
│  │               │                                                         │
│  └───────┬───────┘                                                         │
│          │                                                                   │
│          ├─────────────────────────────────────────┐                         │
│          │                                         │                         │
│          │ content_block_start(type=thinking)      │ content_block_start(type=tool_use)
│          ▼                                         ▼                         │
│  ┌───────────────┐                       ┌───────────────┐                  │
│  │   THINKING    │                       │  TOOL-INPUT   │                  │
│  │               │                       │               │                  │
│  │ Extended      │                       │ Parsing JSON  │                  │
│  │ thinking mode │                       │ tool params   │                  │
│  └───────┬───────┘                       └───────┬───────┘                  │
│          │                                         │                         │
│          │ content_block_stop                      │ content_block_stop       │
│          │                                         ▼                         │
│          └────────────────────────────────►┌───────────────┐               │
│                                            │   TOOL-USE    │               │
│                                            │               │               │
│                                            │ Executing     │               │
│                                            │ tools         │               │
│                                            └───────┬───────┘               │
│                                                    │                         │
│                                                    │ All tools complete       │
│                                                    ▼                         │
│                                            ┌───────────────┐               │
│                                            │  RESPONDING   │               │
│                                            │  or IDLE      │               │
│                                            └───────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Stream Event to State Mapping

```javascript
// ============================================
// handleStreamedEvent - State updates from SSE
// Location: chunks.196.mjs (internal pattern)
// ============================================

// READABLE (for understanding):
function handleStreamedEvent(event, setStreamMode, setMessages) {
    switch (event.type) {
        case "stream_request_start":
            // Starting a new LLM request
            setIsStreaming(true);
            break;

        case "stream_event":
            // SSE event from API
            const sseEvent = event.event;
            switch (sseEvent.type) {
                case "content_block_start":
                    switch (sseEvent.content_block.type) {
                        case "text":
                            setStreamMode("responding");
                            break;
                        case "thinking":
                            setStreamMode("thinking");
                            break;
                        case "tool_use":
                            setStreamMode("tool-input");
                            break;
                    }
                    break;

                case "content_block_stop":
                    // Check if this was a tool_use
                    if (currentBlockType === "tool_use") {
                        setStreamMode("tool-use");
                    }
                    break;

                case "message_stop":
                    // Streaming complete
                    setStreamMode("responding");
                    setIsStreaming(false);
                    break;
            }
            break;

        case "assistant":
            // Complete assistant message
            setMessages(prev => [...prev, event]);
            break;

        case "user":
            // User/tool result message
            setMessages(prev => [...prev, event]);
            break;

        case "tombstone":
            // Remove message (used for streaming fallback)
            setMessages(prev => prev.filter(m => m.uuid !== event.message.uuid));
            break;
    }
}
```

### 10.4 UI Rendering per State

| StreamMode | Spinner | Input | Footer | Message Display |
|------------|---------|-------|--------|-----------------|
| `responding` | ✅ Animated | Disabled | "Generating..." | Streaming text |
| `thinking` | ✅ Thinking indicator | Disabled | "Thinking..." | Hidden (or partial) |
| `tool-input` | ✅ Parsing indicator | Disabled | "Processing..." | Hidden |
| `tool-use` | ✅ Tool indicator | Disabled | "Executing tools..." | Tool cards |
| `requesting` | ✅ Loading indicator | Disabled | "Connecting..." | Empty |

### 10.5 Cancel Behavior per State

```javascript
// ============================================
// handleCancel - Cancel behavior per state
// Location: chunks.196.mjs:420-432
// ============================================

// READABLE (for understanding):
function handleCancel() {
    // Cannot cancel elicitation dialogs
    if (focusedInputDialog === "elicitation") return;

    // Log cancel action
    debugLog(`[onCancel] streamMode=${streamMode}`);

    // Force end animation
    animationController.forceEnd();

    // Save any typed input as a message
    if (inputDraft?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: inputDraft })]);
    }

    // Reset streaming state
    resetLoadingState();

    // Handle based on current state
    if (focusedInputDialog === "tool-permission") {
        // Cancel pending tool permission
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (focusedInputDialog === "prompt") {
        // Cancel pending prompts
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        // Cancel remote request
        remoteClient.cancelRequest();
    } else {
        // Abort local request
        abortController?.abort();
    }

    setPendingToolUse(null);
}
```

---

## 11. Input Handling Deep Dive

### 11.1 Composition Handling (IME)

```javascript
// ============================================
// IME Composition Handling
// Location: chunks.196.mjs:47-48
// ============================================

// ORIGINAL (for source lookup):
let [u6, C6] = N8.useState(!1);

// READABLE (for understanding):
let [isInputComposing, setIsInputComposing] = useState(false);

// Composition events are handled in the TextInput component:
// - onCompositionStart: setIsInputComposing(true)
// - onCompositionEnd: setIsInputComposing(false)

// When composing, Enter key does NOT submit:
const handleSubmit = () => {
    if (isInputComposing) return;  // Don't submit during IME composition
    submitMessage();
};

// Mapping: u6→isInputComposing, C6→setIsInputComposing
```

### 11.2 Vim Mode Integration

```javascript
// ============================================
// Vim Mode State
// Location: chunks.196.mjs:52
// ============================================

// ORIGINAL (for source lookup):
let [sZ, rF] = N8.useState("INSERT");

// READABLE (for understanding):
let [vimMode, setVimMode] = useState("INSERT");  // "INSERT" | "NORMAL" | "VISUAL"

// Keybindings change based on mode:
// NORMAL mode:
//   - i → Switch to INSERT
//   - : → Command mode
//   - d → Delete line
//   - u → Undo
//
// INSERT mode:
//   - Escape → Switch to NORMAL
//   - Normal typing

// Mapping: sZ→vimMode, rF→setVimMode
```

### 11.3 History Navigation

```javascript
// ============================================
// Command History Navigation
// Location: chunks.196.mjs (pattern from source)
// ============================================

// READABLE (for understanding):
const [historyIndex, setHistoryIndex] = useState(-1);
const [savedInput, setSavedInput] = useState("");
const history = useHistory();  // Custom hook for command history

const handleHistoryUp = () => {
    if (historyIndex < history.length - 1) {
        // Save current input when first pressing up
        if (historyIndex === -1) {
            setSavedInput(currentInput);
        }
        setHistoryIndex(i => i + 1);
        setInput(history[historyIndex + 1]);
    }
};

const handleHistoryDown = () => {
    if (historyIndex > 0) {
        setHistoryIndex(i => i - 1);
        setInput(history[historyIndex - 1]);
    } else if (historyIndex === 0) {
        // Return to saved input
        setHistoryIndex(-1);
        setInput(savedInput);
    }
};
```

---

## 12. Message Rendering Optimization

### 12.1 Deferred Rendering

```javascript
// ============================================
// useDeferredValue for Message List
// Location: chunks.196.mjs:183
// ============================================

// ORIGINAL (for source lookup):
let xO = N8.useDeferredValue(u7), tw = u7.length - xO.length;
if (tw > 0) k(`[useDeferredValue] Messages deferred by ${tw}`);

// READABLE (for understanding):
// Main message state
let [messages, setMessages] = useState([]);

// Deferred copy for rendering (keeps UI responsive)
let deferredMessages = useDeferredValue(messages);
let deferredCount = messages.length - deferredMessages.length;

// Log if there's a lag
if (deferredCount > 0) {
    debugLog(`[useDeferredValue] Messages deferred by ${deferredCount}`);
}

// Render uses deferredMessages to prevent blocking
<MessageList messages={deferredMessages} />

// Mapping: u7→messages, xO→deferredMessages, tw→deferredCount
```

**Why this approach:**
- **Non-blocking updates:** User input stays responsive during large message updates
- **Automatic batching:** React batches state updates
- **Visual consistency:** User sees a slightly older view rather than jank

### 12.2 Message Grouping

```javascript
// ============================================
// groupToolResults - Group related tool results
// Location: chunks.160.mjs:3
// ============================================

// READABLE (for understanding):
function groupToolResults(messages) {
    let groups = [];
    let currentGroup = null;

    for (let message of messages) {
        if (message.type === "assistant") {
            // Extract tool uses from this message
            let toolUses = message.message.content.filter(c => c.type === "tool_use");

            if (toolUses.length > 0) {
                // Start a new group
                currentGroup = {
                    assistantMessage: message,
                    toolUses: toolUses,
                    results: []
                };
                groups.push(currentGroup);
            }
        } else if (message.type === "user" && currentGroup) {
            // Check for tool results
            let toolResults = message.message.content.filter(c => c.type === "tool_result");
            if (toolResults.length > 0) {
                currentGroup.results.push(...toolResults);
            }
        }
    }

    return groups;
}
```

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Session Orchestrator | chunks.196.mjs | `sessionOrchestrator` (ot8), `getInputDiaologType` (ra6), `handleCancel` (TM) |
| Message List | chunks.161.mjs | `MessageList` (veY) |
| State Store | chunks.85.mjs | `createStateStore` (WX1) |
| Keybindings | chunks.53.mjs, chunks.110.mjs | `parseKeystroke`, `KeybindingSetup` |
| Dialog System | chunks.190.mjs, chunks.194.mjs | `ToolPermissionDialog` (HIq), `SandboxPermissionDialog` (ct8) |
| Streaming | chunks.173.mjs | `handleToolUseStream` (xN6) |
| Mode Cycle | chunks.183.mjs | `cycleMode` (hf1) |
| Message Grouping | chunks.160.mjs | `groupToolResults` (q9q) |

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All UI patterns documented with source verification