# Ink Components and UI Architecture

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `InternalApp` (BsA) - Root application component
- `InkRenderer` (Ap) - Custom React reconciler
- `streamEventProcessor` (fQA) - Real-time stream event handler
- `TextInputComponent` (DrA) - Interactive input with highlighting
- `useTerminalFocus` (HrA) - Terminal focus detection hook
- `watcherManager` (fm) - File change subscription system

---

## Overview

Claude Code v2.0.59 uses **Ink** (a React-based terminal UI framework) to build its interactive interface. The architecture consists of:

1. **Ink Renderer** - Custom React reconciler with Yoga layout engine
2. **InternalApp** - Root component with 6 nested context providers
3. **Real-time Data Flow** - Streaming responses + file watching subscriptions
4. **Custom Components** - Text input, highlighting, animations, tool renderers

---

## 1. Ink Framework Core

### 1.1 React Reconciler Setup

The Ink framework creates a custom React host configuration that maps React components to terminal output via the Yoga layout engine.

```javascript
// ============================================
// InkRenderer - Custom React reconciler for terminal UI
// Location: chunks.67.mjs:42-191
// ============================================

// ORIGINAL (for source lookup):
Ap = KUB.default({
  getRootHostContext: () => ({ isInsideText: !1 }),
  prepareForCommit: () => null,
  clearContainer: () => !1,
  resetAfterCommit(A) {
    if (typeof A.onComputeLayout === "function") A.onComputeLayout();
    if (A.isStaticDirty) {
      A.isStaticDirty = !1;
      if (typeof A.onImmediateRender === "function") A.onImmediateRender();
      return
    }
    A.onRender?.()
  },
  getChildHostContext(A, Q) {
    let B = A.isInsideText,
      G = Q === "ink-text" || Q === "ink-virtual-text" || Q === "ink-link";
    if (B === G) return A;
    return { isInsideText: G }
  },
  createInstance(A, Q, B, G) {
    if (G.isInsideText && A === "ink-box")
      throw Error("<Box> can't be nested inside <Text> component");
    let Z = A === "ink-text" && G.isInsideText ? "ink-virtual-text" : A,
      I = DaA(Z);
    for (let [Y, J] of Object.entries(Q)) {
      if (Y === "children") continue;
      if (Y === "style") { Bg1(I, J); if (I.yogaNode) Gg1(I.yogaNode, J); continue }
      if (Y === "textStyles") { I.textStyles = J; continue }
      if (Y === "internal_static") { I.internal_static = !0; continue }
      Qg1(I, Y, J)
    }
    return I
  }
})

// READABLE (for understanding):
const InkRenderer = createReconciler({
  // Return root context - tracks if we're inside a Text component
  getRootHostContext: () => ({ isInsideText: false }),

  // Called before React commit phase
  prepareForCommit: () => null,
  clearContainer: () => false,

  // Called after commit - triggers layout computation and rendering
  resetAfterCommit(rootNode) {
    if (typeof rootNode.onComputeLayout === "function") {
      rootNode.onComputeLayout();  // Recalculate Yoga layout
    }
    if (rootNode.isStaticDirty) {
      rootNode.isStaticDirty = false;
      if (typeof rootNode.onImmediateRender === "function") {
        rootNode.onImmediateRender();  // Render static content immediately
      }
      return;
    }
    rootNode.onRender?.();  // Normal render cycle
  },

  // Determine context for child elements (text vs box context)
  getChildHostContext(parentContext, elementType) {
    const wasInsideText = parentContext.isInsideText;
    const isTextElement = elementType === "ink-text" ||
                          elementType === "ink-virtual-text" ||
                          elementType === "ink-link";
    if (wasInsideText === isTextElement) return parentContext;
    return { isInsideText: isTextElement };
  },

  // Create DOM-like nodes for terminal rendering
  createInstance(type, props, rootContainer, hostContext) {
    // Validation: Box cannot be inside Text
    if (hostContext.isInsideText && type === "ink-box") {
      throw Error("<Box> can't be nested inside <Text> component");
    }

    // Convert nested text to virtual-text for optimization
    const actualType = type === "ink-text" && hostContext.isInsideText
      ? "ink-virtual-text"
      : type;

    const element = createInkNode(actualType);

    // Apply props to element
    for (const [key, value] of Object.entries(props)) {
      if (key === "children") continue;
      if (key === "style") {
        applyStyles(element, value);
        if (element.yogaNode) applyYogaStyles(element.yogaNode, value);
        continue;
      }
      if (key === "textStyles") { element.textStyles = value; continue; }
      if (key === "internal_static") { element.internal_static = true; continue; }
      setProperty(element, key, value);
    }
    return element;
  }
});

// Mapping: Ap→InkRenderer, KUB→ReactReconciler, DaA→createInkNode,
//          Bg1→applyStyles, Gg1→applyYogaStyles, Qg1→setProperty
```

### 1.2 Element Types

**Core Ink Element Types:**

| Element Type | Purpose | Constraints |
|-------------|---------|-------------|
| `ink-box` | Layout container (flexbox) | Cannot nest inside `ink-text` |
| `ink-text` | Text rendering | Can contain other text elements |
| `ink-virtual-text` | Optimized nested text | Auto-converted from nested `ink-text` |
| `ink-link` | Clickable terminal links | Text-context element |

### 1.3 Yoga Layout Integration

**How it works:**
1. Each `ink-box` element creates a Yoga node for flexbox layout
2. Style props are translated to Yoga layout properties
3. On commit, `onComputeLayout()` triggers Yoga to calculate positions
4. Terminal output is generated based on computed layout

**Key insight:** The dual-pass rendering (layout computation → terminal output) mirrors browser DOM rendering but optimized for terminal constraints.

---

## 2. InternalApp Component (BsA)

### 2.1 Component Structure

```javascript
// ============================================
// InternalApp - Root application component with provider chain
// Location: chunks.68.mjs:16-254
// ============================================

// ORIGINAL (for source lookup):
BsA = class BsA extends y_.PureComponent {
  static displayName = "InternalApp";
  static getDerivedStateFromError(A) { return { error: A } }

  state = {
    isFocusEnabled: !0,
    activeFocusId: void 0,
    focusables: [],
    error: void 0
  };

  rawModeEnabledCount = 0;
  internal_eventEmitter = new Bp;
  keyParseState = S$B;
  incompleteEscapeTimer = null;
  NORMAL_TIMEOUT = 50;
  PASTE_TIMEOUT = 500;

  isRawModeSupported() { return this.props.stdin.isTTY }

  render() {
    return y_.default.createElement(Q$A.Provider, {
      value: { columns: this.props.terminalColumns, rows: this.props.terminalRows }
    }, y_.default.createElement(k_.Provider, { value: this.props.ink2
    }, y_.default.createElement(daA.Provider, { value: { exit: this.handleExit }
    }, y_.default.createElement(og1, { initialState: this.props.initialTheme
    }, y_.default.createElement(caA.Provider, {
      value: { stdin: this.props.stdin, setRawMode: this.handleSetRawMode,
               isRawModeSupported: this.isRawModeSupported(),
               internal_exitOnCtrlC: this.props.exitOnCtrlC,
               internal_eventEmitter: this.internal_eventEmitter }
    }, y_.default.createElement(paA.Provider, {
      value: { activeId: this.state.activeFocusId, add: this.addFocusable,
               remove: this.removeFocusable, activate: this.activateFocusable,
               deactivate: this.deactivateFocusable, enableFocus: this.enableFocus,
               disableFocus: this.disableFocus, focusNext: this.focusNext,
               focusPrevious: this.focusPrevious, focus: this.focus }
    }, this.state.error ? y_.default.createElement(Qu1, { error: this.state.error })
                        : this.props.children))))))
  }
}

// READABLE (for understanding):
class InternalApp extends React.PureComponent {
  static displayName = "InternalApp";

  // Error boundary - captures render errors
  static getDerivedStateFromError(error) {
    return { error };
  }

  state = {
    isFocusEnabled: true,       // Focus navigation active
    activeFocusId: undefined,   // Currently focused component ID
    focusables: [],             // Registry of focusable components
    error: undefined            // Captured error for error boundary
  };

  // Instance properties for input handling
  rawModeEnabledCount = 0;              // Reference count for raw mode
  internal_eventEmitter = new EventEmitter();  // Keyboard event bus
  keyParseState = INITIAL_PARSE_STATE;  // State machine for key sequences
  incompleteEscapeTimer = null;         // Timer for incomplete escape sequences
  NORMAL_TIMEOUT = 50;                  // Normal key timeout (ms)
  PASTE_TIMEOUT = 500;                  // Paste mode timeout (ms)

  isRawModeSupported() {
    return this.props.stdin.isTTY;  // Raw mode requires TTY
  }

  render() {
    // 6-level nested context provider chain
    return (
      <TerminalDimensionsContext.Provider value={{
        columns: this.props.terminalColumns,
        rows: this.props.terminalRows
      }}>
        <InkContext.Provider value={this.props.ink2}>
          <ExitContext.Provider value={{ exit: this.handleExit }}>
            <ThemeProvider initialState={this.props.initialTheme}>
              <StdinContext.Provider value={{
                stdin: this.props.stdin,
                setRawMode: this.handleSetRawMode,
                isRawModeSupported: this.isRawModeSupported(),
                internal_exitOnCtrlC: this.props.exitOnCtrlC,
                internal_eventEmitter: this.internal_eventEmitter
              }}>
                <FocusContext.Provider value={{
                  activeId: this.state.activeFocusId,
                  add: this.addFocusable,
                  remove: this.removeFocusable,
                  activate: this.activateFocusable,
                  deactivate: this.deactivateFocusable,
                  enableFocus: this.enableFocus,
                  disableFocus: this.disableFocus,
                  focusNext: this.focusNext,
                  focusPrevious: this.focusPrevious,
                  focus: this.focus
                }}>
                  {this.state.error
                    ? <ErrorDisplay error={this.state.error} />
                    : this.props.children}
                </FocusContext.Provider>
              </StdinContext.Provider>
            </ThemeProvider>
          </ExitContext.Provider>
        </InkContext.Provider>
      </TerminalDimensionsContext.Provider>
    );
  }
}

// Mapping: BsA→InternalApp, y_→React, Q$A→TerminalDimensionsContext,
//          k_→InkContext, daA→ExitContext, og1→ThemeProvider,
//          caA→StdinContext, paA→FocusContext, Qu1→ErrorDisplay
```

### 2.2 Provider Chain Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  TerminalDimensionsContext (Q$A)                            │
│  └─ {columns, rows} - Terminal size                         │
│    ┌─────────────────────────────────────────────────────┐  │
│    │  InkContext (k_)                                    │  │
│    │  └─ ink2 - Ink renderer instance                    │  │
│    │    ┌─────────────────────────────────────────────┐  │  │
│    │    │  ExitContext (daA)                          │  │  │
│    │    │  └─ {exit} - Application exit handler       │  │  │
│    │    │    ┌─────────────────────────────────────┐  │  │  │
│    │    │    │  ThemeProvider (og1)                │  │  │  │
│    │    │    │  └─ currentTheme, setTheme          │  │  │  │
│    │    │    │    ┌─────────────────────────────┐  │  │  │  │
│    │    │    │    │  StdinContext (caA)         │  │  │  │  │
│    │    │    │    │  └─ stdin, setRawMode, etc  │  │  │  │  │
│    │    │    │    │    ┌─────────────────────┐  │  │  │  │  │
│    │    │    │    │    │  FocusContext (paA) │  │  │  │  │  │
│    │    │    │    │    │  └─ Focus navigation│  │  │  │  │  │
│    │    │    │    │    │    ┌─────────────┐  │  │  │  │  │  │
│    │    │    │    │    │    │  Children   │  │  │  │  │  │  │
│    │    │    │    │    │    └─────────────┘  │  │  │  │  │  │
│    │    │    │    │    └─────────────────────┘  │  │  │  │  │
│    │    │    │    └─────────────────────────────┘  │  │  │  │
│    │    │    └─────────────────────────────────────┘  │  │  │
│    │    └─────────────────────────────────────────────┘  │  │
│    └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Context Provider Details

| Context | Symbol | Purpose | Key Values |
|---------|--------|---------|------------|
| TerminalDimensionsContext | Q$A | Terminal size | `{columns, rows}` |
| InkContext | k_ | Renderer access | `ink2` instance |
| ExitContext | daA | App exit | `{exit: fn}` |
| ThemeProvider | og1 | Theme state | `{currentTheme, setTheme, setPreviewTheme}` |
| StdinContext | caA | Input stream | `{stdin, setRawMode, isRawModeSupported, eventEmitter}` |
| FocusContext | paA | Focus nav | `{activeId, add, remove, focusNext, focusPrevious}` |

### 2.4 Lifecycle Methods

```javascript
// ============================================
// Lifecycle - Cursor management and cleanup
// Location: chunks.68.mjs:77-103
// ============================================

// ORIGINAL (for source lookup):
componentDidMount() {
  if (this.props.stdout.isTTY) this.props.stdout.write(XM.cursorHide)
}

componentWillUnmount() {
  if (this.props.stdout.isTTY) this.props.stdout.write(XM.cursorShow);
  if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer),
                                   this.incompleteEscapeTimer = null;
  if (this.isRawModeSupported()) this.handleSetRawMode(!1)
}

componentDidCatch(A) { this.handleExit(A) }

// READABLE (for understanding):
componentDidMount() {
  // Hide cursor when app starts (cleaner UI)
  if (this.props.stdout.isTTY) {
    this.props.stdout.write(ANSI_CODES.cursorHide);
  }
}

componentWillUnmount() {
  // Restore cursor visibility
  if (this.props.stdout.isTTY) {
    this.props.stdout.write(ANSI_CODES.cursorShow);
  }

  // Clean up timers
  if (this.incompleteEscapeTimer) {
    clearTimeout(this.incompleteEscapeTimer);
    this.incompleteEscapeTimer = null;
  }

  // Disable raw mode
  if (this.isRawModeSupported()) {
    this.handleSetRawMode(false);
  }
}

// Error boundary - exit app on unhandled error
componentDidCatch(error) {
  this.handleExit(error);
}

// Mapping: XM→ANSI_CODES
```

---

## 3. Real-Time Data Flow

### 3.1 Architecture Overview

Claude Code uses three primary mechanisms for real-time UI updates:

1. **Async Generator Streaming** - LLM responses flow through `O$` (mainAgentLoop)
2. **File Watcher Subscription** - Settings/config changes via Chokidar
3. **React State Callbacks** - Direct state updates during stream processing

```
┌──────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME DATA FLOW                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    yields     ┌─────────────┐    updates    ┌────┐ │
│  │ mainAgent   │──────────────▶│ streamEvent │──────────────▶│ UI │ │
│  │ Loop (O$)   │   events      │ Processor   │   state       │    │ │
│  │             │               │ (fQA)       │               │    │ │
│  └─────────────┘               └─────────────┘               └────┘ │
│        │                              │                         ▲   │
│        │                              ▼                         │   │
│        │                    ┌─────────────────┐                 │   │
│        │                    │  Callback Set   │                 │   │
│        │                    │ G0: addMessage  │                 │   │
│        │                    │ H7: updateDelta │─────────────────┘   │
│        │                    │ rA: setStatus   │                     │
│        │                    │ J1: toolInputs  │                     │
│        │                    └─────────────────┘                     │
│        │                                                            │
│  ┌─────┴─────────┐                                                  │
│  │ File Watcher  │    subscribe     ┌───────────────┐               │
│  │ (fm)          │◀─────────────────│ React Effect  │               │
│  │ Chokidar      │    unsubscribe   │ useEffect()   │               │
│  └───────────────┘                  └───────────────┘               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 File Watcher Subscription System

**What it does:** Monitors settings files for external changes and notifies React components.

**How it works:**
1. Chokidar watches settings file paths with debouncing
2. Components subscribe via `fm.subscribe(callback)`
3. On file change, all callbacks are invoked
4. Unsubscribe function returned for cleanup in `useEffect`

```javascript
// ============================================
// watcherManager - File change subscription system
// Location: chunks.19.mjs:307-408
// ============================================

// ORIGINAL (for source lookup):
function y64(A) {
  return wKA.add(A), () => { wKA.delete(A) }
}

function k64() {
  if (gd0 || md0) return;
  gd0 = !0;
  let A = v64();
  h9A = fd0.watch(A, {
    persistent: !0,
    ignoreInitial: !0,
    awaitWriteFinish: { stabilityThreshold: j64, pollInterval: S64 },
    ignored: (Q) => Q.split(ud0.sep).some((B) => B === ".git"),
  });
  h9A.on("change", b64);
  h9A.on("unlink", f64);
}

fm = {
  initialize: k64,
  dispose: dd0,
  subscribe: y64,
  markInternalWrite: x64
}

// READABLE (for understanding):
// Subscribe to file changes - returns unsubscribe function
function subscribe(callback) {
  subscriberCallbacks.add(callback);
  return () => {
    subscriberCallbacks.delete(callback);
  };
}

// Initialize the Chokidar file watcher
function initializeWatcher() {
  if (watcherInitialized || watcherDisposed) return;
  watcherInitialized = true;

  const pathsToWatch = getWatchedFilePaths();

  chokidarInstance = chokidar.watch(pathsToWatch, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,  // Wait 500ms for writes to stabilize
      pollInterval: 100         // Check every 100ms
    },
    ignored: (path) => path.split(path.sep).some(segment => segment === ".git"),
  });

  chokidarInstance.on("change", handleFileChange);
  chokidarInstance.on("unlink", handleFileUnlink);
}

// Public interface
const watcherManager = {
  initialize: initializeWatcher,
  dispose: disposeWatcher,
  subscribe: subscribe,
  markInternalWrite: markAsInternalWrite  // Prevent self-triggering
};

// Mapping: y64→subscribe, k64→initializeWatcher, fm→watcherManager,
//          wKA→subscriberCallbacks, h9A→chokidarInstance, gd0→watcherInitialized,
//          md0→watcherDisposed, j64→stabilityThreshold, S64→pollInterval
```

**React Integration Pattern:**

```javascript
// ============================================
// useSettingsSubscription - React hook for file watching
// Location: chunks.70.mjs:2178-2184
// ============================================

// ORIGINAL (for source lookup):
IrA.useEffect(() => fm.subscribe(Q), [Q])

// READABLE (for understanding):
// Inside a custom hook:
useEffect(() => {
  const unsubscribe = watcherManager.subscribe(handleSettingsChange);
  return unsubscribe;  // Cleanup on unmount
}, [handleSettingsChange]);

// Mapping: IrA→React, fm→watcherManager
```

### 3.3 Streaming Response Pipeline

**What it does:** Processes LLM streaming responses and updates UI in real-time.

**How it works:**
1. `O$` (mainAgentLoop) is an async generator yielding stream events
2. `for await...of` loop consumes events as they arrive
3. `fQA` (streamEventProcessor) routes each event to appropriate handlers
4. Handlers update React state via callbacks → triggers re-render

```javascript
// ============================================
// Streaming Loop - Main UI update cycle
// Location: chunks.145.mjs:293-303
// ============================================

// ORIGINAL (for source lookup):
for await (let W8 of O$({
  messages: a0,
  systemPrompt: IF,
  userContext: N3,
  systemContext: KV,
  canUseTool: AW,
  toolUseContext: x9,
  querySource: MjA()
})) fQA(W8, (BG) => {
  G0((tW) => [...tW, BG])
}, (BG) => H7((tW) => tW + BG.length), rA, J1);

// READABLE (for understanding):
// Consume streaming events from the agent loop
for await (const streamEvent of mainAgentLoop({
  messages: conversationMessages,
  systemPrompt: systemPromptString,
  userContext: userContextData,
  systemContext: systemContextData,
  canUseTool: canUseToolCallback,
  toolUseContext: toolUseContextObject,
  querySource: getQuerySource()
})) {
  // Process each event through the stream processor
  streamEventProcessor(
    streamEvent,
    // Callback 1: Add message to conversation
    (message) => {
      setMessages(prev => [...prev, message]);
    },
    // Callback 2: Update token/character count
    (delta) => {
      setTokenCount(prev => prev + delta.length);
    },
    // Callback 3: Update UI status
    setStatus,
    // Callback 4: Update partial tool inputs
    setToolInputs
  );
}

// Mapping: O$→mainAgentLoop, fQA→streamEventProcessor, W8→streamEvent,
//          G0→setMessages, H7→setTokenCount, rA→setStatus, J1→setToolInputs
```

### 3.4 Stream Event Processor

**What it does:** Routes different event types to appropriate UI state updates.

**How it works:**
1. Checks event type (stream_event, stream_request_start, etc.)
2. For content_block_start: Updates status ("thinking", "responding", "tool-input")
3. For content_block_delta: Streams partial content (text, tool input JSON)
4. For message_stop: Signals completion

```javascript
// ============================================
// streamEventProcessor - Routes stream events to UI handlers
// Location: chunks.153.mjs:2767-2847
// ============================================

// ORIGINAL (for source lookup):
function fQA(A, Q, B, G, Z) {
  if (A.type !== "stream_event" && A.type !== "stream_request_start") {
    Q(A);
    return
  }
  if (A.type === "stream_request_start") { G("requesting"); return }
  if (A.event.type === "message_stop") { G("tool-use"), Z(() => []); return }

  switch (A.event.type) {
    case "content_block_start":
      switch (A.event.content_block.type) {
        case "thinking":
        case "redacted_thinking": G("thinking"); return;
        case "text": G("responding"); return;
        case "tool_use": {
          G("tool-input");
          let I = A.event.content_block, Y = A.event.index;
          Z((J) => [...J, { index: Y, contentBlock: I, unparsedToolInput: "" }]);
          return
        }
        // ... other block types
      }
      break;
    case "content_block_delta":
      switch (A.event.delta.type) {
        case "text_delta": B(A.event.delta.text); return;
        case "input_json_delta": {
          let I = A.event.delta.partial_json, Y = A.event.index;
          B(I), Z((J) => {
            let W = J.find((X) => X.index === Y);
            if (!W) return J;
            return [...J.filter((X) => X !== W),
                    { ...W, unparsedToolInput: W.unparsedToolInput + I }]
          });
          return
        }
        case "thinking_delta": B(A.event.delta.thinking); return;
      }
  }
}

// READABLE (for understanding):
function streamEventProcessor(event, addMessage, updateDelta, setStatus, setToolInputs) {
  // Non-stream events go directly to message handler
  if (event.type !== "stream_event" && event.type !== "stream_request_start") {
    addMessage(event);
    return;
  }

  // Request starting - show loading state
  if (event.type === "stream_request_start") {
    setStatus("requesting");
    return;
  }

  // Message complete - prepare for tool execution
  if (event.event.type === "message_stop") {
    setStatus("tool-use");
    setToolInputs(() => []);  // Clear tool inputs
    return;
  }

  switch (event.event.type) {
    case "content_block_start":
      // A new content block is starting
      switch (event.event.content_block.type) {
        case "thinking":
        case "redacted_thinking":
          setStatus("thinking");  // Extended thinking indicator
          return;
        case "text":
          setStatus("responding");  // Normal text response
          return;
        case "tool_use": {
          setStatus("tool-input");  // Tool input streaming
          const contentBlock = event.event.content_block;
          const blockIndex = event.event.index;
          // Add new tool input entry
          setToolInputs(prev => [...prev, {
            index: blockIndex,
            contentBlock: contentBlock,
            unparsedToolInput: ""
          }]);
          return;
        }
        // Handle server tools, MCP, web search, etc.
        case "server_tool_use":
        case "web_search_tool_result":
        case "mcp_tool_use":
          setStatus("tool-input");
          return;
      }
      break;

    case "content_block_delta":
      // Partial content arriving
      switch (event.event.delta.type) {
        case "text_delta":
          // Stream text character by character
          updateDelta(event.event.delta.text);
          return;
        case "input_json_delta": {
          // Stream partial JSON for tool inputs
          const partialJson = event.event.delta.partial_json;
          const blockIndex = event.event.index;
          updateDelta(partialJson);
          // Accumulate partial JSON for the tool
          setToolInputs(prev => {
            const existing = prev.find(t => t.index === blockIndex);
            if (!existing) return prev;
            return [
              ...prev.filter(t => t !== existing),
              { ...existing, unparsedToolInput: existing.unparsedToolInput + partialJson }
            ];
          });
          return;
        }
        case "thinking_delta":
          updateDelta(event.event.delta.thinking);
          return;
      }
  }
}

// Mapping: fQA→streamEventProcessor, A→event, Q→addMessage, B→updateDelta,
//          G→setStatus, Z→setToolInputs
```

### 3.5 UI Status States

The UI displays different states based on the `status` value:

| Status | Trigger | UI Display |
|--------|---------|------------|
| `"requesting"` | stream_request_start | Loading spinner |
| `"thinking"` | thinking block start | "Thinking..." indicator |
| `"responding"` | text block start/delta | Streaming text |
| `"tool-input"` | tool_use block start | Tool input preview |
| `"tool-use"` | message_stop | Tool execution |

### 3.6 Data Flow Diagram

```
User Input
    │
    ▼
┌─────────────┐
│  Raw Mode   │ ──▶ handleReadable() ──▶ processInput()
│  Handler    │              │
└─────────────┘              ▼
                      ┌─────────────┐
                      │   Event     │ ──▶ internal_eventEmitter.emit("input")
                      │  Emitter    │
                      └─────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Input Handler  │ ──▶ onSubmit() / onQuery()
                    │  Component     │
                    └────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                     Agent Loop (O$)                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ API Stream  │───▶│   Tools     │───▶│  Messages   │      │
│  │ (Claude)    │    │ Execution   │    │ Processing  │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
└──────────────────────────────────────────────────────────────┘
                             │
                             │ yield events
                             ▼
                    ┌────────────────┐
                    │ streamEvent    │
                    │ Processor      │ ──▶ fQA()
                    │ (fQA)          │
                    └────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ Messages │      │  Status  │      │  Tools   │
    │  State   │      │  State   │      │  State   │
    │ (G0)     │      │  (rA)    │      │  (J1)    │
    └──────────┘      └──────────┘      └──────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   React Re-   │
                    │    render     │
                    └────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   Terminal    │
                    │    Output     │
                    └────────────────┘
```

---

## 4. Custom UI Components

### 4.1 Text Input System

**TextInput** is the primary input component with features like:
- Cursor rendering with positioning
- Paste detection and handling
- Syntax highlighting
- Rainbow/shimmer animations for streaming
- Placeholder display

```javascript
// ============================================
// TextInputComponent - Main input with highlighting
// Location: chunks.71.mjs:133-184
// ============================================

// ORIGINAL (for source lookup):
function DrA({ inputState: A, children: Q, terminalFocus: B, ...G }) {
  let { onInput: Z, renderedValue: I } = A;
  let { wrappedOnInput: Y, isPasting: J } = ZOB({
    onPaste: G.onPaste, onInput: (C, E) => { if (J && E.return) return; Z(C, E) },
    onImagePaste: G.onImagePaste
  });
  let { onIsPastingChange: W } = G;
  BGA.default.useEffect(() => { if (W) W(J) }, [J, W]);

  let { showPlaceholder: X, renderedPlaceholder: V } = YOB({
    placeholder: G.placeholder, value: G.value, showCursor: G.showCursor,
    focus: G.focus, terminalFocus: B
  });

  f1(Y, { isActive: G.focus });

  let F = G.value && G.value.trim().indexOf(" ") === -1 || G.value && G.value.endsWith(" "),
    K = Boolean(G.argumentHint && G.value && F && G.value.startsWith("/")),
    D = G.showCursor && G.highlights ?
        G.highlights.filter((C) => G.cursorOffset < C.start || G.cursorOffset >= C.end)
        : G.highlights,
    H = D && D.length > 0;

  return BGA.default.createElement(S, null,
    BGA.default.createElement($, { wrap: "truncate-end", dimColor: G.dimColor },
      X ? V : H ? BGA.default.createElement(VOB, { text: I, highlights: D }) : I,
      K && BGA.default.createElement($, { dimColor: !0 },
           G.value?.endsWith(" ") ? "" : " ", G.argumentHint),
      Q
    )
  )
}

// READABLE (for understanding):
function TextInputComponent({ inputState, children, terminalFocus, ...props }) {
  const { onInput, renderedValue } = inputState;

  // Hook: Detect paste operations
  const { wrappedOnInput, isPasting } = usePasteDetection({
    onPaste: props.onPaste,
    onInput: (char, key) => {
      // Ignore return key during paste
      if (isPasting && key.return) return;
      onInput(char, key);
    },
    onImagePaste: props.onImagePaste
  });

  // Notify parent of paste state changes
  const { onIsPastingChange } = props;
  useEffect(() => {
    if (onIsPastingChange) onIsPastingChange(isPasting);
  }, [isPasting, onIsPastingChange]);

  // Hook: Manage placeholder display
  const { showPlaceholder, renderedPlaceholder } = usePlaceholder({
    placeholder: props.placeholder,
    value: props.value,
    showCursor: props.showCursor,
    focus: props.focus,
    terminalFocus: terminalFocus
  });

  // Register input handler
  useInput(wrappedOnInput, { isActive: props.focus });

  // Show argument hint for slash commands (e.g., "/help" → shows available args)
  const hasTrailingSpace = props.value?.trim().indexOf(" ") === -1 ||
                           props.value?.endsWith(" ");
  const shouldShowArgumentHint = Boolean(
    props.argumentHint &&
    props.value &&
    hasTrailingSpace &&
    props.value.startsWith("/")
  );

  // Filter highlights that conflict with cursor position
  const filteredHighlights = props.showCursor && props.highlights
    ? props.highlights.filter(h => props.cursorOffset < h.start || props.cursorOffset >= h.end)
    : props.highlights;
  const hasHighlights = filteredHighlights && filteredHighlights.length > 0;

  return (
    <Box>
      <Text wrap="truncate-end" dimColor={props.dimColor}>
        {showPlaceholder
          ? renderedPlaceholder
          : hasHighlights
            ? <HighlightedText text={renderedValue} highlights={filteredHighlights} />
            : renderedValue}
        {shouldShowArgumentHint && (
          <Text dimColor={true}>
            {props.value?.endsWith(" ") ? "" : " "}
            {props.argumentHint}
          </Text>
        )}
        {children}
      </Text>
    </Box>
  );
}

// Mapping: DrA→TextInputComponent, A→inputState, Q→children, B→terminalFocus,
//          ZOB→usePasteDetection, YOB→usePlaceholder, f1→useInput,
//          VOB→HighlightedText, S→Box, $→Text, BGA→React
```

### 4.2 Terminal Focus Detection

**What it does:** Detects when the terminal window gains/loses focus using ANSI escape sequences.

**How it works:**
1. Sends `\x1B[?1004h` to enable focus reporting
2. Terminal sends `\x1B[I` (focus) or `\x1B[O` (blur) events
3. Hook tracks focus state and filters focus sequences from input

```javascript
// ============================================
// useTerminalFocus - Terminal focus detection hook
// Location: chunks.71.mjs:210-232
// ============================================

// ORIGINAL (for source lookup):
function HrA() {
  let [A, Q] = Vf.useState(Om1), [B, G] = Vf.useState(!1),
    Z = Vf.useCallback((Y) => { Q(Y), G(!1) }, []);

  Vf.useEffect(() => {
    if (!process.stdout.isTTY) return;
    if (Be.add(Z), Be.size === 1)
      process.stdout.write("\x1B[?1004h"), process.stdin.on("data", Rm1);
    return () => {
      if (Be.delete(Z), Be.size === 0)
        process.stdin.off("data", Rm1), process.stdout.write("\x1B[?1004l")
    }
  }, [Z]);

  Vf.useEffect(() => {
    if (!A && B) GA("tengu_typing_without_terminal_focus", {})
  }, [A, B]);

  let I = Vf.useCallback((Y, J) => {
    if (Y === "\x1B[I" || Y === "\x1B[O" || Y === "[I" || Y === "[O") return "";
    if ((Y || J) && !A) G(!0);
    return Y
  }, [A]);

  return { isFocused: A || B, filterFocusSequences: I }
}

// READABLE (for understanding):
function useTerminalFocus() {
  // Track if terminal has focus (default: true)
  const [isFocused, setIsFocused] = useState(true);
  // Track if user typed while unfocused
  const [typedWhileUnfocused, setTypedWhileUnfocused] = useState(false);

  // Callback for focus state changes
  const handleFocusChange = useCallback((focused) => {
    setIsFocused(focused);
    setTypedWhileUnfocused(false);
  }, []);

  useEffect(() => {
    if (!process.stdout.isTTY) return;

    // Register this component's callback
    focusListeners.add(handleFocusChange);

    // First subscriber enables focus reporting
    if (focusListeners.size === 1) {
      process.stdout.write("\x1B[?1004h");  // Enable focus reporting
      process.stdin.on("data", handleFocusData);
    }

    return () => {
      focusListeners.delete(handleFocusChange);
      // Last subscriber disables focus reporting
      if (focusListeners.size === 0) {
        process.stdin.off("data", handleFocusData);
        process.stdout.write("\x1B[?1004l");  // Disable focus reporting
      }
    };
  }, [handleFocusChange]);

  // Track typing while unfocused (for telemetry)
  useEffect(() => {
    if (!isFocused && typedWhileUnfocused) {
      trackEvent("tengu_typing_without_terminal_focus", {});
    }
  }, [isFocused, typedWhileUnfocused]);

  // Filter focus escape sequences from normal input
  const filterFocusSequences = useCallback((char, key) => {
    // Remove focus/blur escape sequences
    if (char === "\x1B[I" || char === "\x1B[O" || char === "[I" || char === "[O") {
      return "";
    }
    // Track if user types while unfocused
    if ((char || key) && !isFocused) {
      setTypedWhileUnfocused(true);
    }
    return char;
  }, [isFocused]);

  return {
    isFocused: isFocused || typedWhileUnfocused,
    filterFocusSequences
  };
}

// Mapping: HrA→useTerminalFocus, Vf→React, Om1→initialFocusState,
//          Be→focusListeners, Rm1→handleFocusData, GA→trackEvent
```

**ANSI Focus Sequences:**

| Sequence | Direction | Meaning |
|----------|-----------|---------|
| `\x1B[?1004h` | Out | Enable focus reporting |
| `\x1B[?1004l` | Out | Disable focus reporting |
| `\x1B[I` | In | Terminal gained focus |
| `\x1B[O` | In | Terminal lost focus |

### 4.3 Shimmer Animation Effects

#### Shimmer Animation Algorithm (Deep Analysis)

**What it does:** Creates an animated "shimmer" or "glimmer" effect that travels across text characters, providing visual feedback during loading and streaming states.

**How it works:**

1. **Initialization Phase:**
   - Records start time using `useRef(Date.now())` to persist across renders
   - Sets initial glimmer position: `-1` for "requesting" (shimmer enters from left), `10` for other states (shimmer starts mid-text)
   - Determines animation interval: `50ms` for fast loading animation, `200ms` for slower streaming animation

2. **Animation Loop (useInterval):**
   - Calculates elapsed milliseconds since start
   - Converts to "tick count" by dividing by interval
   - Defines cycle length as `textLength + 20` (the "+20" creates a smooth wrap-around gap)
   - Updates glimmer index using modulo arithmetic for continuous cycling

3. **Direction Logic:**
   - **"requesting" status**: `tickCount % cycleLength - 10` → shimmer moves LEFT to RIGHT (entering effect)
   - **other status**: `textLength + 10 - tickCount % cycleLength` → shimmer moves RIGHT to LEFT (trailing effect behind new text)

4. **Character Rendering:**
   - Each character compares its index to `glimmerIndex`
   - If `index === glimmerIndex` or `Math.abs(index - glimmerIndex) === 1` → use shimmer color
   - Otherwise → use normal color
   - This creates a 3-character-wide "glow" effect (center + 2 adjacent)

**Why this approach:**

- **Time-based vs frame-based**: Using elapsed time ensures consistent animation speed regardless of render frequency or system load
- **Modulo cycling**: Provides infinite looping without accumulating state
- **Direction reversal**: Visual distinction between "waiting for response" (forward) and "response arriving" (backward)
- **20-character gap**: Prevents jarring jumps when cycle restarts; shimmer smoothly exits before re-entering

**Key insight:** The shimmer effect uses a 3-character highlight window (`index === B` or `Math.abs(index - B) === 1`) rather than a single character, creating a softer, more natural glow effect. The asymmetric animation direction (forward during loading, backward during streaming) provides intuitive visual feedback about the system state.

```javascript
// ============================================
// useShimmerAnimation - Animated text effects
// Location: chunks.71.mjs:3-24
// ============================================

// ORIGINAL (for source lookup):
function T$A(A, Q, B, G) {
  let Z = QGA.useRef(Date.now()),
    [I, Y] = QGA.useState(A === "requesting" ? -1 : 10),
    J = QGA.useMemo(() => {
      if (A === "requesting") return 50;
      return 200
    }, [A]);

  return CI(() => {
    if (B === !1 || G) return;
    let W = Date.now() - Z.current,
      X = Math.floor(W / J),
      V = Q.length,
      F = V + 20;
    if (A === "requesting") {
      let K = X % F - 10;
      Y(K)
    } else {
      let K = V + 10 - X % F;
      Y(K)
    }
  }, J), I
}

// READABLE (for understanding):
function useShimmerAnimation(status, text, enabled, paused) {
  const startTime = useRef(Date.now());
  // Start position: -1 for requesting (shimmer enters), 10 for others
  const [glimmerIndex, setGlimmerIndex] = useState(
    status === "requesting" ? -1 : 10
  );

  // Animation speed: faster (50ms) during requesting, slower (200ms) otherwise
  const interval = useMemo(() => {
    if (status === "requesting") return 50;
    return 200;
  }, [status]);

  // Timer-based animation loop
  useInterval(() => {
    if (enabled === false || paused) return;

    const elapsed = Date.now() - startTime.current;
    const tickCount = Math.floor(elapsed / interval);
    const textLength = text.length;
    const cycleLength = textLength + 20;  // Extra space for smooth wrap

    if (status === "requesting") {
      // Shimmer moves forward during loading
      const newIndex = tickCount % cycleLength - 10;
      setGlimmerIndex(newIndex);
    } else {
      // Shimmer moves backward during response
      const newIndex = textLength + 10 - tickCount % cycleLength;
      setGlimmerIndex(newIndex);
    }
  }, interval);

  return glimmerIndex;
}

// Mapping: T$A→useShimmerAnimation, A→status, Q→text, B→enabled, G→paused,
//          CI→useInterval, QGA→React
```

#### AnimatedChar Component

**What it does:** Renders a single character with conditional color based on shimmer position.

```javascript
// ============================================
// AnimatedChar - Single character with shimmer effect
// Location: chunks.70.mjs:3131-3143
// ============================================

// ORIGINAL (for source lookup):
function AGA({
  char: A,
  index: Q,
  glimmerIndex: B,
  messageColor: G,
  shimmerColor: Z
}) {
  let I = Q === B,              // Is this the center of shimmer?
    Y = Math.abs(Q - B) === 1;  // Is this adjacent to shimmer center?
  return Nm1.createElement($, {
    color: I || Y ? Z : G       // Use shimmer color for 3-char window
  }, A)
}

// READABLE (for understanding):
function AnimatedChar({ char, index, glimmerIndex, messageColor, shimmerColor }) {
  const isCenter = index === glimmerIndex;
  const isAdjacent = Math.abs(index - glimmerIndex) === 1;

  // 3-character glow window: center + left neighbor + right neighbor
  return <Text color={isCenter || isAdjacent ? shimmerColor : messageColor}>
    {char}
  </Text>;
}

// Mapping: AGA→AnimatedChar, A→char, Q→index, B→glimmerIndex,
//          G→messageColor, Z→shimmerColor, Nm1→React
```

#### Rainbow Color Selection

**What it does:** Selects colors from a 7-color rainbow palette for animated text effects.

```javascript
// ============================================
// getRainbowColor - Cyclic rainbow color selection
// Location: chunks.70.mjs:2200-2203
// ============================================

// ORIGINAL (for source lookup):
function O$A(A, Q = !1) {
  let B = Q ? HU6 : DU6;
  return B[A % B.length]
}

// Color arrays (chunks.70.mjs:2329):
DU6 = ["rainbow_red", "rainbow_orange", "rainbow_yellow",
       "rainbow_green", "rainbow_blue", "rainbow_indigo", "rainbow_violet"];
HU6 = ["rainbow_red_shimmer", "rainbow_orange_shimmer", "rainbow_yellow_shimmer",
       "rainbow_green_shimmer", "rainbow_blue_shimmer", "rainbow_indigo_shimmer",
       "rainbow_violet_shimmer"];

// READABLE (for understanding):
function getRainbowColor(charIndex, isShimmer = false) {
  const colorPalette = isShimmer ? RAINBOW_SHIMMER_COLORS : RAINBOW_COLORS;
  return colorPalette[charIndex % colorPalette.length];  // Cycle through 7 colors
}

// Mapping: O$A→getRainbowColor, DU6→RAINBOW_COLORS, HU6→RAINBOW_SHIMMER_COLORS
```

**Key insight:** By using modulo 7, each character position gets a unique color that cycles through the rainbow. When combined with the shimmer animation, individual characters temporarily "brighten" as the shimmer passes over them, creating a wave-like visual effect.

### 4.4 Highlighted Text Rendering

#### splitByHighlights Algorithm (Deep Analysis)

**What it does:** Splits input text into non-overlapping segments, where each segment either has no highlighting or contains a single highlight style. This is the core algorithm enabling multi-region text styling.

**How it works:**

1. **Sort highlights by position and priority:**
   ```
   Sort by: (1) start position ascending, (2) priority descending
   Result: Earlier highlights first; higher-priority highlights win ties
   ```

2. **Filter overlapping highlights:**
   - Iterate through sorted highlights
   - For each highlight, check against all previously accepted regions
   - Reject if overlap exists (any of these conditions):
     - Start inside existing: `start >= existing.start && start < existing.end`
     - End inside existing: `end > existing.start && end <= existing.end`
     - Fully contains existing: `start <= existing.start && end >= existing.end`
   - This greedy approach keeps first highlight in each overlapping group

3. **Split text into segments:**
   - Track current position starting at 0
   - For each accepted highlight:
     - If gap before highlight: create unhighlighted segment
     - Create highlighted segment with highlight reference
     - Update position to highlight end
   - If text remains after last highlight: create final unhighlighted segment

4. **Grapheme-aware slicing:**
   - Uses `cY(text)` for accurate grapheme length (handles emojis, accents)
   - Uses `ct(text, start, end)` for grapheme-aware substring

**Why this approach:**

- **Sort-then-filter pattern**: O(n log n) sorting + O(n²) overlap detection is simpler than interval tree and sufficient for typical highlight counts (usually <10)
- **Priority system**: Allows semantic highlights (syntax) to override decorative ones (shimmer)
- **Grapheme awareness**: Critical for terminal text where multi-byte characters must be handled correctly
- **Non-overlapping guarantee**: Each character belongs to exactly one segment, preventing rendering conflicts

**Key insight:** The algorithm sacrifices theoretical efficiency for practical simplicity. Real-world usage involves few highlights per line (<10), making the O(n²) overlap check acceptable. The priority-based conflict resolution provides a clear, predictable model for style composition.

```javascript
// ============================================
// splitByHighlights - Segment text by highlight regions
// Location: chunks.71.mjs:33-68
// ============================================

// ORIGINAL (for source lookup):
function WOB(A, Q) {
  if (Q.length === 0) return [{ text: A, start: 0 }];
  let B = [...Q].sort((W, X) => {
    if (W.start !== X.start) return W.start - X.start;
    return X.priority - W.priority
  }),
    G = [],    // Accepted (non-overlapping) highlights
    Z = [];    // Occupied regions

  for (let W of B)
    if (!Z.some((V) =>
      W.start >= V.start && W.start < V.end ||
      W.end > V.start && W.end <= V.end ||
      W.start <= V.start && W.end >= V.end
    )) G.push(W), Z.push({ start: W.start, end: W.end });

  let I = [], Y = 0, J = cY(A).length;
  for (let W of G) {
    if (W.start > Y) I.push({ text: ct(A, Y, W.start), start: Y });
    I.push({ text: ct(A, W.start, W.end), start: W.start, highlight: W });
    Y = W.end
  }
  if (Y < J) I.push({ text: ct(A, Y), start: Y });
  return I
}

// READABLE (for understanding):
function splitByHighlights(text, highlights) {
  if (highlights.length === 0) {
    return [{ text, start: 0 }];
  }

  // Sort: position first, then priority (higher wins ties)
  const sorted = [...highlights].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.priority - a.priority;
  });

  const accepted = [];
  const occupied = [];

  // Greedy selection: keep first in each overlap group
  for (const hl of sorted) {
    const overlaps = occupied.some(r =>
      (hl.start >= r.start && hl.start < r.end) ||
      (hl.end > r.start && hl.end <= r.end) ||
      (hl.start <= r.start && hl.end >= r.end)
    );
    if (!overlaps) {
      accepted.push(hl);
      occupied.push({ start: hl.start, end: hl.end });
    }
  }

  const segments = [];
  let pos = 0;
  const len = getGraphemeLength(text);

  for (const hl of accepted) {
    if (hl.start > pos) segments.push({ text: graphemeSlice(text, pos, hl.start), start: pos });
    segments.push({ text: graphemeSlice(text, hl.start, hl.end), start: hl.start, highlight: hl });
    pos = hl.end;
  }
  if (pos < len) segments.push({ text: graphemeSlice(text, pos), start: pos });

  return segments;
}

// Mapping: WOB→splitByHighlights, cY→getGraphemeLength, ct→graphemeSlice
```

#### HighlightedText Component

**What it does:** Renders text with multiple highlight regions, supporting rainbow, shimmer, and solid color styles.

```javascript
// ============================================
// HighlightedText - Text with highlight regions
// Location: chunks.71.mjs:75-119
// ============================================

// ORIGINAL (for source lookup):
function VOB({ text: A, highlights: Q = [] }) {
  let B = WOB(A, Q),
    G = T$A("requesting", A, !0, !1);
  return mH.createElement(mH.Fragment, null, B.map((Z, I) => {
    if (!Z.highlight) return mH.createElement($, { key: I }, Z.text);
    let { style: Y } = Z.highlight;
    if (Y.type === "rainbow") return Z.text.split("").map((J, W) => {
      let X = Z.start + W,
        V = O$A(W, !1),
        F = O$A(W, !0);
      return mH.createElement(AGA, {
        key: `${I}-${W}`, char: J, index: X, glimmerIndex: G,
        messageColor: V, shimmerColor: F
      })
    });
    else if (Y.type === "shimmer") return Z.text.split("").map((J, W) => {
      let X = Z.start + W;
      return mH.createElement(AGA, {
        key: `${I}-${W}`, char: J, index: X, glimmerIndex: G,
        messageColor: Y.baseColor, shimmerColor: Y.shimmerColor
      })
    });
    else if (Y.type === "solid") return mH.createElement($, {
      key: I, color: Y.color
    }, Z.text);
    return mH.createElement($, { key: I }, Z.text)
  }))
}

// READABLE (for understanding):
function HighlightedText({ text, highlights = [] }) {
  // Split text into segments based on highlight regions
  const segments = splitByHighlights(text, highlights);
  // Get current shimmer position
  const glimmerIndex = useShimmerAnimation("requesting", text, true, false);

  return (
    <>
      {segments.map((segment, segmentIndex) => {
        // Non-highlighted text
        if (!segment.highlight) {
          return <Text key={segmentIndex}>{segment.text}</Text>;
        }

        const { style } = segment.highlight;

        // Rainbow effect: each character cycles through colors
        if (style.type === "rainbow") {
          return segment.text.split("").map((char, charIndex) => {
            const absoluteIndex = segment.start + charIndex;
            const normalColor = getRainbowColor(charIndex, false);
            const shimmerColor = getRainbowColor(charIndex, true);
            return (
              <AnimatedChar
                key={`${segmentIndex}-${charIndex}`}
                char={char}
                index={absoluteIndex}
                glimmerIndex={glimmerIndex}
                messageColor={normalColor}
                shimmerColor={shimmerColor}
              />
            );
          });
        }

        // Shimmer effect: single color with traveling highlight
        if (style.type === "shimmer") {
          return segment.text.split("").map((char, charIndex) => {
            const absoluteIndex = segment.start + charIndex;
            return (
              <AnimatedChar
                key={`${segmentIndex}-${charIndex}`}
                char={char}
                index={absoluteIndex}
                glimmerIndex={glimmerIndex}
                messageColor={style.baseColor}
                shimmerColor={style.shimmerColor}
              />
            );
          });
        }

        // Solid color
        if (style.type === "solid") {
          return <Text key={segmentIndex} color={style.color}>{segment.text}</Text>;
        }

        // Default: no styling
        return <Text key={segmentIndex}>{segment.text}</Text>;
      })}
    </>
  );
}

// Mapping: VOB→HighlightedText, WOB→splitByHighlights, T$A→useShimmerAnimation,
//          O$A→getRainbowColor, AGA→AnimatedChar, $→Text
```

---

## 5. Tool Result Rendering

### 5.1 Render Function Interface

Each tool defines render functions for different states:

```typescript
interface ToolRenderFunctions {
  // When tool is first called (shows input preview)
  renderToolUseMessage(
    toolUseBlock: ToolUseBlock,
    options: { verbose: boolean; theme: Theme }
  ): ReactElement;

  // While tool is executing (spinner)
  renderToolUseProgressMessage(
    results: ToolResult[],
    options: { theme: Theme }
  ): ReactElement;

  // When tool is queued for execution
  renderToolUseQueuedMessage(
    toolUseBlock: ToolUseBlock
  ): ReactElement;

  // When tool completes successfully
  renderToolResultMessage(
    result: ToolResult,
    options: { verbose: boolean }
  ): ReactElement;

  // When tool encounters an error
  renderToolUseErrorMessage(
    error: Error,
    toolUseBlock: ToolUseBlock
  ): ReactElement;

  // When tool is rejected by user/permission
  renderToolUseRejectedMessage(
    toolUseBlock: ToolUseBlock,
    reason: string
  ): ReactElement;
}
```

### 5.2 Tool Rendering Flow

```
Tool Call Detected
        │
        ▼
┌───────────────────┐
│ renderToolUse     │──▶ Shows tool name + input preview
│ Message           │
└───────────────────┘
        │
        ▼
┌───────────────────┐     Permission Check
│ renderToolUse     │◀───────────────────┐
│ ProgressMessage   │                    │
└───────────────────┘                    │
        │                                │
   ┌────┴────┐                           │
   │         │                           │
   ▼         ▼                           │
Allowed    Denied                        │
   │         │                           │
   ▼         ▼                           │
Execute   ┌───────────────────┐          │
   │      │ renderToolUse     │          │
   │      │ RejectedMessage   │          │
   │      └───────────────────┘          │
   │                                     │
   ├──────────Success───────────┐        │
   │                            │        │
   ▼                            ▼        │
┌───────────────────┐   ┌───────────────┐│
│ renderToolResult  │   │ renderToolUse ││
│ Message           │   │ ErrorMessage  ││
└───────────────────┘   └───────────────┘│
                                         │
                                         │
        Multiple tools queue here ───────┘
```

### 5.3 Example: LSP Tool Renderer (Actual Code)

```javascript
// ============================================
// LSP Tool Rendering Functions
// Location: chunks.145.mjs:3132-3182
// ============================================

// ORIGINAL (for source lookup):
// renderToolUseMessage - Shows operation, file, and position
function zW9(A, { verbose: Q }) {
  if (!A.operation) return null;
  let B = [];
  if ((A.operation === "goToDefinition" || A.operation === "findReferences" ||
       A.operation === "hover") && A.filePath && A.line !== void 0 &&
       A.character !== void 0) {
    let G = HW9(A.filePath, A.line, A.character),  // Get symbol at position
      Z = Q ? A.filePath : Q5(A.filePath);          // Full path or basename
    if (G) B.push(`operation: "${A.operation}"`), B.push(`symbol: "${G}"`),
           B.push(`in: "${Z}"`);
    else B.push(`operation: "${A.operation}"`), B.push(`file: "${Z}"`),
         B.push(`position: ${A.line}:${A.character}`);
    return B.join(", ")
  }
  if (B.push(`operation: "${A.operation}"`), A.filePath) {
    let G = Q ? A.filePath : Q5(A.filePath);
    B.push(`file: "${G}"`)
  }
  return B.join(", ")
}

// renderToolUseRejectedMessage - Simple rejection indicator
function UW9() {
  return zY.default.createElement(k5, null)  // Rejection component
}

// renderToolUseErrorMessage - Error with optional detail
function $W9(A, { verbose: Q }) {
  if (!Q && typeof A === "string" && B9(A, "tool_use_error"))
    return zY.default.createElement(S0, null,
      zY.default.createElement($, { color: "error" }, "LSP operation failed"));
  return zY.default.createElement(Q6, { result: A, verbose: Q })
}

// renderToolUseProgressMessage - Returns null (no progress indicator)
function wW9() {
  return null
}

// renderToolResultMessage - Shows result count and content
function qW9(A, Q, { verbose: B }) {
  if (A.resultCount !== void 0 && A.fileCount !== void 0)
    return zY.default.createElement(Qk3, {
      operation: A.operation,
      resultCount: A.resultCount,
      fileCount: A.fileCount,
      content: A.result,
      verbose: B
    });
  return zY.default.createElement(S0, null,
    zY.default.createElement($, null, A.result))
}

// READABLE (for understanding):
function renderToolUseMessage(input, { verbose }) {
  if (!input.operation) return null;

  const parts = [];
  const isPositionOperation = ["goToDefinition", "findReferences", "hover"]
    .includes(input.operation);

  if (isPositionOperation && input.filePath &&
      input.line !== undefined && input.character !== undefined) {
    const symbol = getSymbolAtPosition(input.filePath, input.line, input.character);
    const displayPath = verbose ? input.filePath : basename(input.filePath);

    if (symbol) {
      parts.push(`operation: "${input.operation}"`);
      parts.push(`symbol: "${symbol}"`);
      parts.push(`in: "${displayPath}"`);
    } else {
      parts.push(`operation: "${input.operation}"`);
      parts.push(`file: "${displayPath}"`);
      parts.push(`position: ${input.line}:${input.character}`);
    }
    return parts.join(", ");
  }

  parts.push(`operation: "${input.operation}"`);
  if (input.filePath) {
    const displayPath = verbose ? input.filePath : basename(input.filePath);
    parts.push(`file: "${displayPath}"`);
  }
  return parts.join(", ");
}

function renderToolResultMessage(result, toolUse, { verbose }) {
  // Structured result with counts
  if (result.resultCount !== undefined && result.fileCount !== undefined) {
    return <LSPResultSummary
      operation={result.operation}
      resultCount={result.resultCount}
      fileCount={result.fileCount}
      content={result.result}
      verbose={verbose}
    />;
  }
  // Simple text result
  return <Static><Text>{result.result}</Text></Static>;
}

// Mapping: zW9→renderToolUseMessage, UW9→renderToolUseRejectedMessage,
//          $W9→renderToolUseErrorMessage, wW9→renderToolUseProgressMessage,
//          qW9→renderToolResultMessage, Qk3→LSPResultSummary, k5→RejectionComponent,
//          Q6→ErrorResultDisplay, S0→Static, $→Text
```

**Key insight:** Tool rendering is polymorphic - each tool defines its own render functions in the tool definition object. The rendering functions receive the tool's input/output and display options, allowing tool-specific formatting while maintaining a consistent rendering lifecycle.

---

## 6. Focus Management

### 6.1 Focus Navigation Algorithm (Deep Analysis)

**What it does:** Manages keyboard focus between interactive UI elements (buttons, inputs, selectable items), enabling Tab/Shift+Tab navigation similar to web browsers.

**How it works:**

1. **Component Registration:**
   - Focusable components call `addFocusable(id, { autoFocus })` on mount
   - Components call `removeFocusable(id)` on unmount
   - Registry maintains ordered list: `focusables: [{ id, isActive }]`

2. **Focus State:**
   - `activeFocusId`: Currently focused element ID (or undefined)
   - `isFocusEnabled`: Global toggle for focus system
   - `isActive` per component: Whether component can receive focus

3. **Navigation Algorithm (findNextFocusable):**
   ```
   1. Find current index in focusables array
   2. Search forward from (currentIndex + 1) to end
   3. Return first element where isActive === true
   4. If none found, return undefined (no wrap-around)
   ```

4. **Navigation Algorithm (findPreviousFocusable):**
   ```
   1. Find current index in focusables array
   2. Search backward from (currentIndex - 1) to 0
   3. Return first element where isActive === true
   4. If none found, return undefined
   ```

5. **Fallback Behavior:**
   - If `findNextFocusable` returns undefined, keep current focus
   - Uses `focusables.find(f => f.isActive)?.id` as fallback

**Why this approach:**

- **Linear search over complex data structures**: Simple array with O(n) search is sufficient for typical UI element counts (<20)
- **No wrap-around by default**: Prevents confusing circular navigation; focus "stops" at boundaries
- **Separate isActive flag**: Allows temporarily disabling focus without removing from registry (e.g., disabled buttons)
- **Registration order determines tab order**: Components register in render order, matching visual flow

**Key insight:** The focus system deliberately avoids wrap-around navigation. When you Tab past the last focusable element, focus stays on that element rather than jumping to the first. This prevents disorientation in terminal UIs where the screen state isn't always predictable.

```javascript
// ============================================
// Focus Navigation - Tab/Shift+Tab handling
// Location: chunks.68.mjs:125-253
// ============================================

// ORIGINAL (for source lookup):
handleInput = (A) => {
  if (A === "\x03" && this.props.exitOnCtrlC) this.handleExit();
  if (A === "\x1A" && zF6) this.handleSuspend();
  if (A === EF6 && this.state.activeFocusId) this.setState({ activeFocusId: void 0 });
  if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
    if (A === HF6) this.focusNext();
    if (A === CF6) this.focusPrevious()
  }
};

focusNext = () => {
  this.setState((A) => {
    let Q = A.focusables.find((G) => G.isActive)?.id;
    return { activeFocusId: this.findNextFocusable(A) ?? Q }
  })
};

findNextFocusable = (A) => {
  let Q = A.focusables.findIndex((B) => B.id === A.activeFocusId);
  for (let B = Q + 1; B < A.focusables.length; B++) {
    let G = A.focusables[B];
    if (G?.isActive) return G.id
  }
  return
};

findPreviousFocusable = (A) => {
  let Q = A.focusables.findIndex((B) => B.id === A.activeFocusId);
  for (let B = Q - 1; B >= 0; B--) {
    let G = A.focusables[B];
    if (G?.isActive) return G.id
  }
  return
};

addFocusable = (A, { autoFocus: Q }) => {
  this.setState((B) => {
    let G = B.activeFocusId;
    if (!G && Q) G = A;  // Auto-focus first component requesting it
    return {
      activeFocusId: G,
      focusables: [...B.focusables, { id: A, isActive: !0 }]
    }
  })
};

removeFocusable = (A) => {
  this.setState((Q) => ({
    activeFocusId: Q.activeFocusId === A ? void 0 : Q.activeFocusId,
    focusables: Q.focusables.filter((B) => B.id !== A)
  }))
};

// READABLE (for understanding):
handleInput = (keySequence) => {
  if (keySequence === "\x03" && this.props.exitOnCtrlC) this.handleExit();
  if (keySequence === "\x1A" && isUnix) this.handleSuspend();
  if (keySequence === ESCAPE && this.state.activeFocusId) {
    this.setState({ activeFocusId: undefined });
  }
  if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
    if (keySequence === TAB) this.focusNext();
    if (keySequence === SHIFT_TAB) this.focusPrevious();
  }
};

focusNext = () => {
  this.setState((state) => ({
    activeFocusId: this.findNextFocusable(state) ??
                   state.focusables.find(f => f.isActive)?.id
  }));
};

findNextFocusable = (state) => {
  const currentIdx = state.focusables.findIndex(f => f.id === state.activeFocusId);
  for (let i = currentIdx + 1; i < state.focusables.length; i++) {
    if (state.focusables[i]?.isActive) return state.focusables[i].id;
  }
  return undefined;  // No wrap-around
};

findPreviousFocusable = (state) => {
  const currentIdx = state.focusables.findIndex(f => f.id === state.activeFocusId);
  for (let i = currentIdx - 1; i >= 0; i--) {
    if (state.focusables[i]?.isActive) return state.focusables[i].id;
  }
  return undefined;  // No wrap-around
};

addFocusable = (id, { autoFocus }) => {
  this.setState((state) => ({
    activeFocusId: (!state.activeFocusId && autoFocus) ? id : state.activeFocusId,
    focusables: [...state.focusables, { id, isActive: true }]
  }));
};

removeFocusable = (id) => {
  this.setState((state) => ({
    activeFocusId: state.activeFocusId === id ? undefined : state.activeFocusId,
    focusables: state.focusables.filter(f => f.id !== id)
  }));
};

// Mapping: EF6→ESCAPE, HF6→TAB, CF6→SHIFT_TAB, zF6→isUnix
```

### 6.2 Key Bindings

| Key | Sequence | Action |
|-----|----------|--------|
| Tab | `\t` (HF6) | Focus next element |
| Shift+Tab | `\x1B[Z` (CF6) | Focus previous element |
| Escape | `\x1B` (EF6) | Clear focus |
| Ctrl+C | `\x03` | Exit application |
| Ctrl+Z | `\x1A` | Suspend (Unix) |

---

## 7. Raw Mode & Keyboard Input

### 7.1 Raw Mode Management

**What it does:** Enables character-by-character input instead of line-buffered.

**Why reference counting:** Multiple components may need raw mode; the count ensures it stays enabled until all are done.

```javascript
// ============================================
// handleSetRawMode - Raw mode with reference counting
// Location: chunks.68.mjs:88-103
// ============================================

// ORIGINAL (for source lookup):
handleSetRawMode = (A) => {
  let { stdin: Q } = this.props;
  if (!this.isRawModeSupported())
    if (Q === process.stdin) throw Error(`Raw mode is not supported...`);
    else throw Error(`Raw mode is not supported on the stdin provided to Ink...`);

  if (Q.setEncoding("utf8"), A) {
    if (this.rawModeEnabledCount === 0)
      Q.ref(), Q.setRawMode(!0), Q.addListener("readable", this.handleReadable),
      this.props.stdout.write("\x1B[?2004h");
    this.rawModeEnabledCount++;
    return
  }
  if (--this.rawModeEnabledCount === 0)
    this.props.stdout.write("\x1B[?2004l"), Q.setRawMode(!1),
    Q.removeListener("readable", this.handleReadable), Q.unref()
};

// READABLE (for understanding):
handleSetRawMode = (enable) => {
  const { stdin } = this.props;

  // Validate raw mode support
  if (!this.isRawModeSupported()) {
    throw Error("Raw mode is not supported");
  }

  stdin.setEncoding("utf8");

  if (enable) {
    // First enabler: actually enable raw mode
    if (this.rawModeEnabledCount === 0) {
      stdin.ref();                // Keep process alive
      stdin.setRawMode(true);     // Enable raw mode
      stdin.addListener("readable", this.handleReadable);
      this.props.stdout.write("\x1B[?2004h");  // Enable bracketed paste
    }
    this.rawModeEnabledCount++;
    return;
  }

  // Decrement count; last one disables
  if (--this.rawModeEnabledCount === 0) {
    this.props.stdout.write("\x1B[?2004l");  // Disable bracketed paste
    stdin.setRawMode(false);
    stdin.removeListener("readable", this.handleReadable);
    stdin.unref();  // Allow process to exit
  }
};

// Mapping: A→enable, Q→stdin
```

### 7.2 Bracketed Paste Mode

| Sequence | Direction | Purpose |
|----------|-----------|---------|
| `\x1B[?2004h` | Out | Enable bracketed paste |
| `\x1B[?2004l` | Out | Disable bracketed paste |
| `\x1B[200~` | In | Paste start marker |
| `\x1B[201~` | In | Paste end marker |

**Why it matters:** Allows distinguishing pasted text from typed text, enabling proper handling of multi-line pastes.

### 7.3 Keyboard Parsing State Machine (Deep Analysis)

**What it does:** Parses raw terminal input bytes into structured key events, handling multi-byte escape sequences and bracketed paste mode.

**How it works:**

1. **State Structure:**
   ```javascript
   { mode: "NORMAL" | "IN_PASTE", incomplete: "" }
   ```
   - `mode`: Current parsing mode
   - `incomplete`: Buffered bytes waiting for more input

2. **NORMAL Mode Processing:**
   - Use regex `xV6` to match complete escape sequences
   - If match found: parse key using `j$B`, add to results
   - If `\x1B[200~` matched: transition to IN_PASTE mode
   - If incomplete sequence detected (via `vV6` regex): buffer in `incomplete`

3. **IN_PASTE Mode Processing:**
   - Search for `\x1B[201~` (paste end marker)
   - If found: emit pasted content as single key event, transition to NORMAL
   - If not found and not flushing: buffer entire input
   - Content between markers is marked with `isPasted: true`

4. **Timeout Handling (InternalApp):**
   - `NORMAL_TIMEOUT`: 50ms for incomplete escape sequences
   - `PASTE_TIMEOUT`: 500ms for paste content
   - Timer calls `flushIncomplete` which parses with `null` input (force-flush)

**State Machine Diagram:**

```
          ┌──────────────────────────────────────────────────┐
          │                                                  │
          ▼                                                  │
    ┌──────────┐    \x1B[200~ (paste start)    ┌──────────┐  │
    │  NORMAL  │ ─────────────────────────────▶│ IN_PASTE │  │
    │          │                               │          │  │
    └──────────┘                               └──────────┘  │
          │                                          │       │
          │ parse key via j$B                        │       │
          │ emit structured KeyEvent                 │       │
          │                                          │       │
          │                      \x1B[201~ (paste end)│       │
          │                      emit pasted content │       │
          │                                          │       │
          └──────────────────────────────────────────┴───────┘
```

**Why this approach:**

- **Two-mode state machine**: Cleanly separates normal typing from paste content
- **Regex-based tokenization**: Handles the complex zoo of ANSI escape sequences efficiently
- **Buffering incomplete sequences**: Allows terminals with delayed transmission to work correctly
- **Timeout-based flushing**: Prevents indefinite waiting; 50ms is fast enough for interactive use

**Key insight:** The parser distinguishes between incomplete escape sequences (user mid-keystroke) and truly isolated ESC presses using a timeout. If no more bytes arrive within 50ms, the incomplete sequence is flushed and interpreted. This balance prevents both blocking on expected input and misinterpreting standalone ESC.

```javascript
// ============================================
// parseKeySequences - Keyboard input state machine
// Location: chunks.67.mjs:2895-2941
// ============================================

// ORIGINAL (for source lookup):
function _$B(A, Q = "") {
  let B = Q === null,
    G = B ? "" : bV6(Q);
  if (A.mode === "IN_PASTE") {
    if ((A.incomplete.slice(-oaA.length + 1) + G).indexOf(oaA) === -1) return [
      [], { ...A, incomplete: A.incomplete + G }
    ]
  }
  let Z = A.incomplete + G,
    I = { ...A, incomplete: "" },
    Y = [],
    J = {
      NORMAL: () => {
        let W = xV6.exec(Z);
        Z = Z.substring(W[0].length);
        let X = W[1];
        if (!W[2] && !B) {
          let V = vV6.exec(X);
          I.incomplete = V[2], X = V[1]
        }
        if (X) Y.push(j$B(X));
        if (W[2] === kV6) I.mode = "IN_PASTE";
        else if (W[2]) Y.push(j$B(W[2]))
      },
      IN_PASTE: () => {
        let W = Z.indexOf(oaA);
        if (W === -1) {
          if (!B) { I.incomplete = Z, Z = ""; return }
          W = Z.length
        }
        let X = Z.substring(0, W);
        if (X) Y.push(yV6(X));
        Z = Z.substring(W + oaA.length), I.mode = "NORMAL"
      }
    };
  while (Z) J[I.mode]();
  return [Y, I]
}

// Constants:
S$B = { mode: "NORMAL", incomplete: "" };  // Initial state
kV6 = "\x1B[200~";                         // Paste start
oaA = "\x1B[201~";                         // Paste end

// READABLE (for understanding):
function parseKeySequences(state, input = "") {
  const isFlushing = input === null;
  const rawInput = isFlushing ? "" : normalizeInput(input);

  // Fast path: In paste mode, just buffer until we see paste end
  if (state.mode === "IN_PASTE") {
    const combined = state.incomplete.slice(-PASTE_END.length + 1) + rawInput;
    if (!combined.includes(PASTE_END)) {
      return [[], { ...state, incomplete: state.incomplete + rawInput }];
    }
  }

  let remaining = state.incomplete + rawInput;
  let newState = { ...state, incomplete: "" };
  const keys = [];

  const handlers = {
    NORMAL: () => {
      // Match complete sequence or buffer partial
      const match = COMPLETE_SEQ_REGEX.exec(remaining);
      remaining = remaining.substring(match[0].length);
      let content = match[1];

      // Check for incomplete sequence (unless flushing)
      if (!match[2] && !isFlushing) {
        const partial = INCOMPLETE_SEQ_REGEX.exec(content);
        newState.incomplete = partial[2];
        content = partial[1];
      }

      if (content) keys.push(parseKey(content));

      // Check for paste start
      if (match[2] === PASTE_START) {
        newState.mode = "IN_PASTE";
      } else if (match[2]) {
        keys.push(parseKey(match[2]));
      }
    },

    IN_PASTE: () => {
      const endPos = remaining.indexOf(PASTE_END);
      if (endPos === -1) {
        if (!isFlushing) {
          newState.incomplete = remaining;
          remaining = "";
          return;
        }
        // Force flush: treat all remaining as pasted
        const content = remaining;
        if (content) keys.push(createPastedKey(content));
        remaining = "";
        newState.mode = "NORMAL";
        return;
      }
      // Found paste end
      const content = remaining.substring(0, endPos);
      if (content) keys.push(createPastedKey(content));
      remaining = remaining.substring(endPos + PASTE_END.length);
      newState.mode = "NORMAL";
    }
  };

  while (remaining) handlers[newState.mode]();
  return [keys, newState];
}

// Mapping: _$B→parseKeySequences, A→state, Q→input, S$B→initialState,
//          kV6→PASTE_START, oaA→PASTE_END, j$B→parseKey, yV6→createPastedKey,
//          xV6→COMPLETE_SEQ_REGEX, vV6→INCOMPLETE_SEQ_REGEX
```

### 7.4 Individual Key Parsing

**What it does:** Converts a single escape sequence into a structured key object with name, modifiers, and raw data.

```javascript
// ============================================
// parseKey - Parse single key sequence
// Location: chunks.67.mjs:2969-3039
// ============================================

// Key object structure:
{
  name: "return" | "tab" | "escape" | "a" | "left" | ...,
  ctrl: boolean,
  meta: boolean,     // Alt key
  shift: boolean,
  option: boolean,   // macOS Option key
  fn: boolean,       // Function key flag
  sequence: string,  // Original escape sequence
  raw: string,       // Raw bytes
  isPasted: boolean  // True if from paste
}

// ORIGINAL (for source lookup):
j$B = (A = "") => {
  let B = { name: "", fn: !1, ctrl: !1, meta: !1, shift: !1, option: !1,
            sequence: A, raw: A, isPasted: !1 };

  // Simple single-character handling
  if (A === "\r") B.name = "return";
  else if (A === "\n") B.name = "enter";
  else if (A === "\t") B.name = "tab";
  else if (A === "\x1B") B.name = "escape";
  else if (A === " ") B.name = "space";
  else if (A <= "\x1A" && A.length === 1) {
    // Ctrl+letter: ASCII 1-26 → a-z
    B.name = String.fromCharCode(A.charCodeAt(0) + 96);
    B.ctrl = true;
  }
  else if (A.length === 1 && A >= "a" && A <= "z") B.name = A;
  else if (A.length === 1 && A >= "A" && A <= "Z") {
    B.name = A.toLowerCase();
    B.shift = true;
  }
  // Escape sequence patterns...
  return B;
}

// READABLE (for understanding):
function parseKey(sequence = "") {
  const key = {
    name: "", fn: false, ctrl: false, meta: false,
    shift: false, option: false, sequence, raw: sequence, isPasted: false
  };

  // Simple keys
  if (sequence === "\r") key.name = "return";
  else if (sequence === "\n") key.name = "enter";
  else if (sequence === "\t") key.name = "tab";
  else if (sequence === "\x1B") key.name = "escape";
  else if (sequence === " ") key.name = "space";

  // Ctrl+letter: ASCII 1-26 maps to 'a'-'z'
  else if (sequence <= "\x1A" && sequence.length === 1) {
    key.name = String.fromCharCode(sequence.charCodeAt(0) + 96);
    key.ctrl = true;
  }

  // Lowercase letters
  else if (sequence.length === 1 && sequence >= "a" && sequence <= "z") {
    key.name = sequence;
  }

  // Uppercase letters (shift detected)
  else if (sequence.length === 1 && sequence >= "A" && sequence <= "Z") {
    key.name = sequence.toLowerCase();
    key.shift = true;
  }

  // Complex escape sequences parsed via regex...
  return key;
}

// Mapping: j$B→parseKey, k$B→KEY_CODE_MAP (F1-F12, arrows, etc.)
```

---

## 8. Theme System

### 8.1 Theme Provider

```javascript
// ============================================
// ThemeProvider - Theme state management component
// Location: chunks.67.mjs (og1)
// ============================================

// Context value structure:
{
  currentTheme: Theme,           // Active theme
  setTheme: (theme) => void,     // Persist theme change
  setPreviewTheme: (theme) => void  // Temporary preview
}

// Theme type:
type Theme = "light" | "dark" | "system";
```

### 8.2 Theme-Aware Colors

Components use theme-aware color tokens:

```javascript
// Color tokens resolve differently per theme
const themeColors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    claude: "#6366f1",
    success: "#22c55e",
    error: "#ef4444",
  },
  dark: {
    text: "#ffffff",
    background: "#0f172a",
    claude: "#818cf8",
    success: "#4ade80",
    error: "#f87171",
  }
};
```

---

## 9. UI Workflow Summary

### Complete Request-Response Cycle

```
1. USER INPUT
   └─▶ Raw mode stdin ──▶ handleReadable() ──▶ processInput()
       └─▶ Parse key sequences ──▶ emit("input", keyEvent)
           └─▶ TextInput receives input ──▶ onChange callback
               └─▶ onSubmit triggers query

2. QUERY PROCESSING
   └─▶ onQuery() called with messages
       └─▶ Build system prompt (Tn)
           └─▶ Create tool context (u6)
               └─▶ Start mainAgentLoop (O$)

3. STREAMING RESPONSE
   └─▶ for await (event of O$(...))
       └─▶ fQA routes event:
           ├─▶ "requesting" → Show spinner
           ├─▶ "thinking" → Show thinking indicator
           ├─▶ "responding" → Stream text to UI
           ├─▶ "tool-input" → Show tool preview
           └─▶ "tool-use" → Execute tool, show result

4. STATE UPDATES
   └─▶ Callbacks update React state:
       ├─▶ G0: setMessages([...prev, newMessage])
       ├─▶ H7: setTokenCount(prev + delta.length)
       ├─▶ rA: setStatus(newStatus)
       └─▶ J1: setToolInputs(updatedInputs)

5. RE-RENDER
   └─▶ React reconciles virtual DOM
       └─▶ Ink renderer computes Yoga layout
           └─▶ Terminal output written via ANSI codes
```

---

## Summary

The Claude Code UI architecture provides:

1. **Ink Framework** - React-based terminal rendering with Yoga layout
2. **Provider Chain** - Six nested contexts for global state (dimensions, theme, focus, etc.)
3. **Real-time Updates** - Async generators + file watching for live data
4. **Custom Components** - Rich text input, highlighting, animations
5. **Tool Rendering** - Lifecycle-aware tool result display
6. **Focus Management** - Keyboard navigation with Tab/Shift+Tab
7. **Raw Mode** - Character-level input with reference counting
8. **Theme System** - Light/dark mode with preview capability

**Key insight:** The architecture mirrors modern web frameworks (React + Context) but optimized for terminal constraints, using ANSI escape codes for styling and Yoga for layout computation.
