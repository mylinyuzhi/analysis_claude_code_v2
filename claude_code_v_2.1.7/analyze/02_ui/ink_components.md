# Ink Components and UI Architecture

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `InternalApp` (w21) - Root application component
- `InkRenderer` (Sa) - Custom React reconciler
- `tokenToText` (VE) - Markdown token to styled text converter
- `TableRenderer` (gG2) - Responsive table rendering component
- `BlinkingManager` (zW5) - Blinking animation state manager
- `useBlinkingState` (WZ2) - React hook for blinking animation
- `StatusIndicator` (k4A) - Tool status indicator component
- `ToolUseDisplay` (VZ2) - Tool use message display component

---

## Overview

Claude Code v2.1.7 uses **Ink** (a React-based terminal UI framework) to build its interactive interface. The architecture consists of:

1. **Ink Renderer** - Custom React reconciler with Yoga layout engine
2. **InternalApp** - Root component with 7 nested context providers (NEW: TerminalFocusContext)
3. **Real-time Data Flow** - Streaming responses + file watching subscriptions
4. **Custom Components** - Text input, highlighting, animations, tool renderers
5. **Accessibility Support** - New CLAUDE_CODE_ACCESSIBILITY environment variable

---

## 1. Ink Framework Core

### 1.1 React Reconciler Setup

The Ink framework creates a custom React host configuration that maps React components to terminal output via the Yoga layout engine.

```javascript
// ============================================
// InkRenderer - Custom React reconciler for terminal UI
// Location: chunks.66.mjs:60-252
// ============================================

// ORIGINAL (for source lookup):
Sa = BNB.default({
  getRootHostContext: () => ({
    isInsideText: !1
  }),
  prepareForCommit: () => null,
  preparePortalMount: () => null,
  clearContainer: () => !1,
  resetAfterCommit(A) {
    if (typeof A.onComputeLayout === "function") A.onComputeLayout();
    if (A.isStaticDirty) {
      if (A.isStaticDirty = !1, typeof A.onImmediateRender === "function") A.onImmediateRender();
      return
    }
    A.onRender?.()
  },
  getChildHostContext(A, Q) {
    let B = A.isInsideText,
      G = Q === "ink-text" || Q === "ink-virtual-text" || Q === "ink-link";
    if (B === G) return A;
    return {
      isInsideText: G
    }
  },
  createInstance(A, Q, B, G) {
    if (G.isInsideText && A === "ink-box") throw Error("<Box> can't be nested inside <Text> component");
    let Z = A === "ink-text" && G.isInsideText ? "ink-virtual-text" : A,
      Y = gB1(Z);
    for (let [J, X] of Object.entries(Q)) {
      if (J === "children") continue;
      if (J === "style") {
        if (u00(Y, X), Y.yogaNode) m00(Y.yogaNode, X);
        continue
      }
      if (J === "textStyles") {
        Y.textStyles = X;
        continue
      }
      if (J === "internal_static") {
        Y.internal_static = !0;
        continue
      }
      g00(Y, J, X)
    }
    return Y
  }
})

// READABLE (for understanding):
const InkRenderer = createReconciler({
  // Return root context - tracks if we're inside a Text component
  getRootHostContext: () => ({ isInsideText: false }),

  // Called before React commit phase
  prepareForCommit: () => null,
  preparePortalMount: () => null,
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

// Mapping: Sa→InkRenderer, BNB→ReactReconciler, gB1→createInkNode,
//          u00→applyStyles, m00→applyYogaStyles, g00→setProperty
```

**What it does:** Creates a custom React reconciler that bridges React's component model to terminal output.

**How it works:**
1. `getRootHostContext()` initializes context tracking whether we're inside text
2. `getChildHostContext()` propagates text context to children, distinguishing between layout (Box) and text (Text) elements
3. `createInstance()` creates Ink nodes with Yoga layout integration
4. `resetAfterCommit()` triggers the two-phase render: layout computation then terminal output

**Why this approach:**
- Custom reconciler enables React's declarative model for terminal UIs
- Yoga layout engine provides flexbox-style layout in terminals
- Context tracking prevents invalid nesting (Box inside Text)

**Key insight:** The dual-pass rendering (layout computation → terminal output) mirrors browser DOM rendering but optimized for terminal constraints.

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

## 2. InternalApp Component (w21)

### 2.1 Component Structure

```javascript
// ============================================
// InternalApp - Root application component with provider chain
// Location: chunks.67.mjs:23-280
// ============================================

// ORIGINAL (for source lookup):
w21 = class w21 extends PP.PureComponent {
  static displayName = "InternalApp";
  static getDerivedStateFromError(A) {
    return {
      error: A
    }
  }
  state = {
    isFocusEnabled: !0,
    activeFocusId: void 0,
    focusables: [],
    error: void 0,
    isTerminalFocused: !0
  };
  rawModeEnabledCount = 0;
  internal_eventEmitter = new va;
  keyParseState = qwB;
  incompleteEscapeTimer = null;
  NORMAL_TIMEOUT = 50;
  PASTE_TIMEOUT = 500;
  isRawModeSupported() {
    return this.props.stdin.isTTY
  }
  render() {
    return PP.default.createElement(l_A.Provider, {
      value: {
        columns: this.props.terminalColumns,
        rows: this.props.terminalRows
      }
    }, PP.default.createElement(AN.Provider, {
      value: this.props.ink2
    }, PP.default.createElement(K21.Provider, {
      value: {
        exit: this.handleExit
      }
    }, PP.default.createElement(xQ0, {
      initialState: this.props.initialTheme,
      onThemeChange: this.props.onThemeChange,
      onThemeSave: this.props.onThemeSave
    }, PP.default.createElement(V21.Provider, {
      value: {
        stdin: this.props.stdin,
        setRawMode: this.handleSetRawMode,
        isRawModeSupported: this.isRawModeSupported(),
        internal_exitOnCtrlC: this.props.exitOnCtrlC,
        internal_eventEmitter: this.internal_eventEmitter
      }
    }, PP.default.createElement(F21.Provider, {
      value: {
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
      }
    }, PP.default.createElement(E21.Provider, {
      value: {
        isTerminalFocused: this.state.isTerminalFocused
      }
    }, this.state.error ? PP.default.createElement(kQ0, {
      error: this.state.error
    }) : this.props.children)))))))
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
    error: undefined,           // Captured error for error boundary
    isTerminalFocused: true     // NEW in v2.1.7: Terminal focus state
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
    // 7-level nested context provider chain (was 6 in v2.0.59)
    return (
      <TerminalDimensionsContext.Provider value={{
        columns: this.props.terminalColumns,
        rows: this.props.terminalRows
      }}>
        <InkContext.Provider value={this.props.ink2}>
          <ExitContext.Provider value={{ exit: this.handleExit }}>
            <ThemeProvider
              initialState={this.props.initialTheme}
              onThemeChange={this.props.onThemeChange}
              onThemeSave={this.props.onThemeSave}
            >
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
                  {/* NEW in v2.1.7: Terminal Focus Context */}
                  <TerminalFocusContext.Provider value={{
                    isTerminalFocused: this.state.isTerminalFocused
                  }}>
                    {this.state.error
                      ? <ErrorDisplay error={this.state.error} />
                      : this.props.children}
                  </TerminalFocusContext.Provider>
                </FocusContext.Provider>
              </StdinContext.Provider>
            </ThemeProvider>
          </ExitContext.Provider>
        </InkContext.Provider>
      </TerminalDimensionsContext.Provider>
    );
  }
}

// Mapping: w21→InternalApp, PP→React, l_A→TerminalDimensionsContext,
//          AN→InkContext, K21→ExitContext, xQ0→ThemeProvider,
//          V21→StdinContext, F21→FocusContext, E21→TerminalFocusContext,
//          kQ0→ErrorDisplay, va→EventEmitter
```

### 2.2 Provider Chain Architecture (7-level) [UPDATED in v2.1.7]

```
┌─────────────────────────────────────────────────────────────┐
│            TerminalDimensionsContext (l_A)                  │
│            { columns, rows }                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            InkContext (AN)                            │  │
│  │            { ink instance }                           │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │            ExitContext (K21)                    │  │  │
│  │  │            { exit function }                    │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │        ThemeProvider (xQ0)                │  │  │  │
│  │  │  │        { theme, setTheme }                │  │  │  │
│  │  │  │  ┌─────────────────────────────────────┐  │  │  │  │
│  │  │  │  │      StdinContext (V21)             │  │  │  │  │
│  │  │  │  │      { stdin, setRawMode, ... }     │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │    FocusContext (F21)         │  │  │  │  │  │
│  │  │  │  │  │    { activeId, focusNext }    │  │  │  │  │  │
│  │  │  │  │  │  ┌─────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │ TerminalFocusContext    │  │  │  │  │  │  │
│  │  │  │  │  │  │ (E21) [NEW in v2.1.7]   │  │  │  │  │  │  │
│  │  │  │  │  │  │ { isTerminalFocused }   │  │  │  │  │  │  │
│  │  │  │  │  │  │      [children]         │  │  │  │  │  │  │
│  │  │  │  │  │  └─────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Context Responsibilities:**

| Context | Obfuscated | Purpose |
|---------|------------|---------|
| TerminalDimensionsContext | l_A | Terminal size (columns, rows) |
| InkContext | AN | Core Ink instance reference |
| ExitContext | K21 | Application exit handler |
| ThemeProvider | xQ0 | Theme state and persistence |
| StdinContext | V21 | Input stream, raw mode control |
| FocusContext | F21 | Focus navigation state |
| TerminalFocusContext | E21 | **NEW** Terminal window focus |

### 2.3 State Management

```javascript
state = {
  isFocusEnabled: true,       // Can components receive focus
  activeFocusId: undefined,   // ID of currently focused component
  focusables: [],             // Array of { id, isActive } objects
  error: undefined,           // Error for error boundary
  isTerminalFocused: true     // NEW: Is terminal window focused
};
```

---

## 3. Terminal Focus Detection [NEW in v2.1.7]

### 3.1 ANSI Focus Reporting Sequences

```javascript
// ============================================
// handleTerminalFocus - Terminal focus state handler
// Location: chunks.67.mjs:154-161
// ============================================

// ORIGINAL (for source lookup):
handleTerminalFocus = (A) => {
  PwB(A), this.setState((Q) => {
    if (Q.isTerminalFocused === A) return Q;
    return {
      ...Q,
      isTerminalFocused: A
    }
  })
};

// READABLE (for understanding):
handleTerminalFocus = (isFocused) => {
  // Log focus change for debugging
  logTerminalFocus(isFocused);

  this.setState((prevState) => {
    // Skip update if state unchanged
    if (prevState.isTerminalFocused === isFocused) return prevState;
    return {
      ...prevState,
      isTerminalFocused: isFocused
    };
  });
};

// Mapping: PwB→logTerminalFocus
```

**What it does:** Tracks whether the terminal window has focus, enabling UI to respond to focus changes.

**How it works:**
1. Terminal emulators send ANSI escape sequences when focus changes
2. `handleTerminalFocus` receives parsed focus events
3. State is updated only if focus actually changed
4. Components can subscribe via `TerminalFocusContext`

**Why this approach:**
- Enables pause/resume of animations when terminal loses focus
- Can suppress certain UI updates when not visible
- Battery/CPU optimization for background terminals

**Key insight:** Focus reporting requires terminal emulator support (iTerm, kitty, WezTerm, ghostty).

### 3.2 Focus Reporting Constants

```javascript
// Terminal emulators that support focus reporting
xwB = ["iTerm.app", "kitty", "WezTerm", "ghostty"]

// Enable focus reporting sequence (written on mount)
i_A = "\x1b[?1004h"  // CSI ? 1004 h

// Disable focus reporting sequence (written on unmount)
TP = "\x1b[?1004l"   // CSI ? 1004 l
```

---

## 4. Raw Mode & Keyboard Input

### 4.1 Raw Mode Management (Reference Counting)

```javascript
// ============================================
// handleSetRawMode - Raw mode reference counting
// Location: chunks.67.mjs:102-121
// ============================================

// ORIGINAL (for source lookup):
handleSetRawMode = (A) => {
  let {
    stdin: Q
  } = this.props;
  if (!this.isRawModeSupported())
    if (Q === process.stdin) throw Error(`Raw mode is not supported...`);
    else throw Error(`Raw mode is not supported on the stdin provided...`);
  if (Q.setEncoding("utf8"), A) {
    if (this.rawModeEnabledCount === 0) {
      if (Q.ref(), Q.setRawMode(!0), Q.addListener("readable", this.handleReadable),
          this.props.stdout.write(jwB), this.props.stdout.write(gQ0),
          xwB.includes(l0.terminal ?? "")) this.props.stdout.write(mUB)
    }
    this.rawModeEnabledCount++;
    return
  }
  if (--this.rawModeEnabledCount === 0) {
    if (xwB.includes(l0.terminal ?? "")) this.props.stdout.write(uIA);
    this.props.stdout.write(pBA), this.props.stdout.write(QDA),
    Q.setRawMode(!1), Q.removeListener("readable", this.handleReadable), Q.unref()
  }
};

// READABLE (for understanding):
handleSetRawMode = (enable) => {
  const { stdin } = this.props;

  // Validate raw mode support
  if (!this.isRawModeSupported()) {
    throw Error("Raw mode is not supported...");
  }

  stdin.setEncoding("utf8");

  if (enable) {
    // First enabler: actually enable raw mode
    if (this.rawModeEnabledCount === 0) {
      stdin.ref();
      stdin.setRawMode(true);
      stdin.addListener("readable", this.handleReadable);

      // Enable bracketed paste mode
      this.props.stdout.write(BRACKETED_PASTE_ENABLE);
      // Enable alternative screen
      this.props.stdout.write(ALTERNATIVE_SCREEN_ENABLE);

      // Enable focus reporting for supported terminals
      if (FOCUS_TERMINALS.includes(terminalInfo.terminal ?? "")) {
        this.props.stdout.write(FOCUS_REPORTING_ENABLE);
      }
    }
    this.rawModeEnabledCount++;
    return;
  }

  // Last disabler: actually disable raw mode
  if (--this.rawModeEnabledCount === 0) {
    // Disable focus reporting for supported terminals
    if (FOCUS_TERMINALS.includes(terminalInfo.terminal ?? "")) {
      this.props.stdout.write(FOCUS_REPORTING_DISABLE);
    }

    // Disable bracketed paste and alternative screen
    this.props.stdout.write(BRACKETED_PASTE_DISABLE);
    this.props.stdout.write(ALTERNATIVE_SCREEN_DISABLE);

    stdin.setRawMode(false);
    stdin.removeListener("readable", this.handleReadable);
    stdin.unref();
  }
};

// Mapping: jwB→BRACKETED_PASTE_ENABLE, gQ0→ALTERNATIVE_SCREEN_ENABLE,
//          mUB→FOCUS_REPORTING_ENABLE, uIA→FOCUS_REPORTING_DISABLE,
//          pBA→BRACKETED_PASTE_DISABLE, QDA→ALTERNATIVE_SCREEN_DISABLE
```

**What it does:** Reference-counted raw mode management ensures proper cleanup when multiple components need raw input.

**How it works:**
1. Each `enable` call increments counter, each `disable` decrements
2. Actual raw mode enabled/disabled only at 0→1 and 1→0 transitions
3. Multiple components can request raw mode without conflicts
4. Guarantees cleanup even if some components fail to disable

**Why this approach:**
- Multiple interactive components may need raw input simultaneously
- Reference counting prevents premature mode switches
- Ensures terminal state is properly restored on exit

### 4.2 Keyboard Parsing State Machine

```javascript
// ============================================
// processInput - Keyboard input parser
// Location: chunks.67.mjs:127-133
// ============================================

// ORIGINAL (for source lookup):
processInput = (A) => {
  let [Q, B] = NwB(this.keyParseState, A);
  if (this.keyParseState = B, Q.length > 0)
    Sa.discreteUpdates(BK8, this, Q, void 0, void 0);
  if (this.keyParseState.incomplete) {
    if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer);
    this.incompleteEscapeTimer = setTimeout(this.flushIncomplete,
      this.keyParseState.mode === "IN_PASTE" ? this.PASTE_TIMEOUT : this.NORMAL_TIMEOUT)
  }
};

// READABLE (for understanding):
processInput = (inputChunk) => {
  // Parse input through state machine
  const [parsedKeys, newState] = parseKeySequence(this.keyParseState, inputChunk);
  this.keyParseState = newState;

  // Dispatch parsed keys to React update queue
  if (parsedKeys.length > 0) {
    InkRenderer.discreteUpdates(dispatchKeyEvents, this, parsedKeys);
  }

  // Handle incomplete escape sequences with timeout
  if (this.keyParseState.incomplete) {
    if (this.incompleteEscapeTimer) {
      clearTimeout(this.incompleteEscapeTimer);
    }

    // Paste mode gets longer timeout for large pastes
    const timeout = this.keyParseState.mode === "IN_PASTE"
      ? this.PASTE_TIMEOUT  // 500ms
      : this.NORMAL_TIMEOUT; // 50ms

    this.incompleteEscapeTimer = setTimeout(
      this.flushIncomplete,
      timeout
    );
  }
};

// Mapping: NwB→parseKeySequence, BK8→dispatchKeyEvents
```

**Key insight:** The state machine handles incomplete escape sequences (e.g., multi-byte keys) by buffering and using timeouts to flush when the sequence appears complete.

---

## 5. Focus Management

### 5.1 Focus Navigation Algorithm

```javascript
// ============================================
// findNextFocusable - Find next focusable component
// Location: chunks.67.mjs:260-268
// ============================================

// ORIGINAL (for source lookup):
findNextFocusable = (A) => {
  let Q = A.focusables.findIndex((B) => {
    return B.id === A.activeFocusId
  });
  for (let B = Q + 1; B < A.focusables.length; B++) {
    let G = A.focusables[B];
    if (G?.isActive) return G.id
  }
  return
};

// READABLE (for understanding):
findNextFocusable = (state) => {
  // Find current focus index
  const currentIndex = state.focusables.findIndex(
    (item) => item.id === state.activeFocusId
  );

  // Search forward for next active focusable
  for (let i = currentIndex + 1; i < state.focusables.length; i++) {
    const focusable = state.focusables[i];
    if (focusable?.isActive) {
      return focusable.id;
    }
  }

  // No next focusable found
  return undefined;
};
```

**What it does:** Linear search through focusables array to find next active component.

**How it works:**
1. Find index of currently focused component
2. Search forward from that index
3. Return first component where `isActive === true`
4. Return undefined if no next focusable found (no wrapping)

**Why this approach:**
- Simple linear traversal maintains insertion order
- `isActive` flag allows temporary focus disabling
- No wrap-around prevents focus loops

### 5.2 Key Bindings

```javascript
// Special key constants
tW8 = "\t"          // Tab - focusNext
eW8 = "\x1b[Z"      // Shift+Tab - focusPrevious
AK8 = "\x1b"        // Escape - clear focus

// Input handler dispatches to focus methods
handleInput = (key) => {
  if (key === "\x03" && this.props.exitOnCtrlC) this.handleExit();  // Ctrl+C
  if (key === "\x1A" && isUnix) this.handleSuspend();               // Ctrl+Z
  if (key === ESCAPE && this.state.activeFocusId) {
    this.setState({ activeFocusId: undefined });                     // Clear focus
  }
  if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
    if (key === TAB) this.focusNext();
    if (key === SHIFT_TAB) this.focusPrevious();
  }
};
```

---

## 6. Markdown Rendering

### 6.1 Token-to-Text Converter

```javascript
// ============================================
// tokenToText - Convert markdown tokens to styled terminal text
// Location: chunks.97.mjs:3-113
// ============================================

// ORIGINAL (for source lookup):
function VE(A, Q, B = 0, G = null, Z = null, Y = !1) {
  switch (A.type) {
    case "blockquote":
      return I1.dim.italic((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join(""));
    case "code": {
      if (Y) return A.text + oz;
      let J = "plaintext";
      if (A.lang)
        if (dY1.supportsLanguage(A.lang)) J = A.lang;
        else k(`Language not supported while highlighting code, falling back to plaintext: ${A.lang}`);
      return dY1.highlight(A.text, {
        language: J
      }) + oz
    }
    case "codespan":
      return sQ("permission", Q)(A.text);
    case "em":
      return I1.italic((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join(""));
    case "strong":
      return I1.bold((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join(""));
    case "heading":
      switch (A.depth) {
        case 1:
          return I1.bold.italic.underline((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join("")) + oz + oz;
        case 2:
          return I1.bold((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join("")) + oz + oz;
        default:
          return I1.bold((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join("")) + oz + oz
      }
    // ... more cases
  }
}

// READABLE (for understanding):
function tokenToText(token, theme, depth = 0, listNum = null, parent = null, noHighlight = false) {
  switch (token.type) {
    case "blockquote":
      // Dim italic for blockquotes
      return chalk.dim.italic(
        (token.tokens ?? []).map(t => tokenToText(t, theme, 0, null, null, noHighlight)).join("")
      );

    case "code":
      // Syntax-highlighted code blocks
      if (noHighlight) return token.text + NEWLINE;
      let language = "plaintext";
      if (token.lang) {
        if (hljs.supportsLanguage(token.lang)) {
          language = token.lang;
        } else {
          logWarning(`Language not supported: ${token.lang}`);
        }
      }
      return hljs.highlight(token.text, { language }) + NEWLINE;

    case "codespan":
      // Inline code with permission color
      return getThemeColor("permission", theme)(token.text);

    case "em":
      return chalk.italic(mapChildTokens(token));

    case "strong":
      return chalk.bold(mapChildTokens(token));

    case "heading":
      switch (token.depth) {
        case 1: return chalk.bold.italic.underline(mapChildTokens(token)) + DOUBLE_NEWLINE;
        case 2: return chalk.bold(mapChildTokens(token)) + DOUBLE_NEWLINE;
        default: return chalk.bold(mapChildTokens(token)) + DOUBLE_NEWLINE;
      }

    case "list":
      return token.items.map((item, idx) =>
        tokenToText(item, theme, depth, token.ordered ? token.start + idx : null, token, noHighlight)
      ).join("");

    case "list_item":
      return (token.tokens ?? []).map(t =>
        `${"  ".repeat(depth)}${tokenToText(t, theme, depth+1, listNum, token, noHighlight)}`
      ).join("");

    case "text":
      if (parent?.type === "list_item") {
        const bullet = listNum === null ? "-" : formatListNumber(depth, listNum) + ".";
        return `${bullet} ${token.tokens ? mapChildTokens(token) : token.text}${NEWLINE}`;
      }
      return token.text;

    case "table":
      // Tables handled by dedicated TableRenderer component
      // ... complex table rendering logic
  }
}

// Mapping: VE→tokenToText, I1→chalk, dY1→hljs, oz→NEWLINE, sQ→getThemeColor
```

**What it does:** Recursively converts marked.js AST tokens to styled terminal text with ANSI colors.

**How it works:**
1. Pattern-matches on token type (blockquote, code, em, strong, heading, list, etc.)
2. Applies appropriate ANSI styling via chalk-like library
3. Recursively processes nested tokens
4. Handles code blocks with syntax highlighting via highlight.js

**Why this approach:**
- Single recursive function handles all markdown token types
- Style composition via chalk's fluent API (bold.italic.underline)
- Graceful fallback for unsupported languages
- Depth tracking for nested list indentation

### 6.2 Table Rendering Algorithm

```javascript
// ============================================
// TableRenderer - Responsive markdown table rendering
// Location: chunks.97.mjs:171-307
// ============================================

// READABLE pseudocode:
function TableRenderer({ token, syntaxHighlightingDisabled, forceWidth }) {
  const [theme] = useTheme();
  const { columns } = getTerminalSize();
  const width = forceWidth ?? columns;

  // Calculate minimum column widths (longest word in each column)
  const minWidths = token.header.map((cell, colIdx) => {
    let min = getMinWordWidth(cell.tokens);
    for (const row of token.rows) {
      min = Math.max(min, getMinWordWidth(row[colIdx]?.tokens));
    }
    return min;
  });

  // Calculate preferred column widths (full content width)
  const preferredWidths = token.header.map((cell, colIdx) => {
    let pref = getContentWidth(cell.tokens);
    for (const row of token.rows) {
      pref = Math.max(pref, getContentWidth(row[colIdx]?.tokens));
    }
    return pref;
  });

  // Calculate available space
  const numColumns = token.header.length;
  const overhead = 1 + numColumns * 3;  // Borders and padding
  const availableWidth = Math.max(width - overhead, numColumns * MIN_COL_WIDTH);

  // Determine if table needs overflow handling
  const totalMinWidth = minWidths.reduce((a, b) => a + b, 0);
  const totalPreferredWidth = preferredWidths.reduce((a, b) => a + b, 0);
  const needsOverflow = totalMinWidth + overhead > width;

  // Choose column widths based on available space
  let columnWidths;
  if (needsOverflow) {
    columnWidths = minWidths;  // Minimum widths, will use fallback rendering
  } else if (totalPreferredWidth <= availableWidth) {
    columnWidths = preferredWidths;  // Full widths fit
  } else {
    // Distribute extra space proportionally
    columnWidths = distributeSpace(minWidths, preferredWidths, availableWidth);
  }

  // If overflow, render in mobile-friendly key-value format
  if (needsOverflow) {
    return renderMobileFormat(token, columnWidths);
  }

  // Render bordered table
  return renderBorderedTable(token, columnWidths);
}

// Mapping: gG2→TableRenderer
```

**What it does:** Renders markdown tables with responsive column sizing and fallback for narrow terminals.

**How it works:**
1. Calculate minimum widths (longest word) and preferred widths (full content)
2. Determine available space after accounting for borders/padding
3. If table won't fit, fall back to mobile key-value format
4. Otherwise, distribute space proportionally between columns
5. Render with Unicode box-drawing characters

**Key insight:** The fallback mobile format converts tables to a list of "Header: Value" pairs when the terminal is too narrow, ensuring content remains readable.

---

## 7. Animation Effects

### 7.1 Blinking Animation Manager

```javascript
// ============================================
// BlinkingManager - Singleton blink state manager
// Location: chunks.97.mjs:726-745
// ============================================

// ORIGINAL (for source lookup):
function zW5() {
  let A = new va;
  A.setMaxListeners(100);
  let Q = null,
    B = !0;
  return {
    subscribe(G) {
      if (A.on("blink", G), A.listenerCount("blink") === 1) Q = setInterval(() => {
        B = !B, A.emit("blink")
      }, 600);
      return B
    },
    unsubscribe(G) {
      if (A.off("blink", G), A.listenerCount("blink") === 0 && Q) clearInterval(Q), Q = null
    },
    getCurrentState() {
      return B
    }
  }
}

// READABLE (for understanding):
function createBlinkingManager() {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(100);  // Support many blinking components

  let intervalId = null;
  let isVisible = true;

  return {
    subscribe(callback) {
      emitter.on("blink", callback);

      // Start interval when first subscriber joins
      if (emitter.listenerCount("blink") === 1) {
        intervalId = setInterval(() => {
          isVisible = !isVisible;
          emitter.emit("blink");
        }, 600);  // 600ms blink interval
      }

      return isVisible;  // Return current state for initial render
    },

    unsubscribe(callback) {
      emitter.off("blink", callback);

      // Stop interval when last subscriber leaves
      if (emitter.listenerCount("blink") === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },

    getCurrentState() {
      return isVisible;
    }
  };
}

// Mapping: zW5→createBlinkingManager, va→EventEmitter
```

**What it does:** Provides a singleton manager for coordinating blink animations across multiple components.

**How it works:**
1. Uses EventEmitter for pub/sub pattern
2. Interval starts only when first subscriber joins
3. Interval stops when last subscriber leaves
4. All subscribers receive synchronized blink events
5. 600ms interval provides comfortable blink rate

**Why this approach:**
- Single timer for all blinking components (efficiency)
- Lazy initialization - no timer when nothing is blinking
- Synchronized - all blinking elements flash together
- Memory-safe cleanup when components unmount

### 7.2 useBlinkingState Hook

```javascript
// ============================================
// useBlinkingState - React hook for blinking animation
// Location: chunks.97.mjs:747-759
// ============================================

// ORIGINAL (for source lookup):
function WZ2(A) {
  let Q = DZ2(),
    [B, G] = oY1.useState(Q.getCurrentState());
  return oY1.useEffect(() => {
    if (!A) return;
    let Z = DZ2(),
      Y = () => G(Z.getCurrentState()),
      J = Z.subscribe(Y);
    return G(J), () => {
      Z.unsubscribe(Y)
    }
  }, [A]), A ? B : !0
}

// READABLE (for understanding):
function useBlinkingState(shouldAnimate) {
  const manager = getBlinkingManager();  // Singleton
  const [isVisible, setIsVisible] = useState(manager.getCurrentState());

  useEffect(() => {
    // Skip subscription if not animating
    if (!shouldAnimate) return;

    const currentManager = getBlinkingManager();
    const handleBlink = () => setIsVisible(currentManager.getCurrentState());

    // Subscribe and set initial state
    const initialState = currentManager.subscribe(handleBlink);
    setIsVisible(initialState);

    // Cleanup on unmount
    return () => {
      currentManager.unsubscribe(handleBlink);
    };
  }, [shouldAnimate]);

  // Return true (always visible) if not animating
  return shouldAnimate ? isVisible : true;
}

// Mapping: WZ2→useBlinkingState, DZ2→getBlinkingManager
```

### 7.3 Status Indicator Component

```javascript
// ============================================
// StatusIndicator - Tool status with blinking animation
// Location: chunks.97.mjs:772-784
// ============================================

// ORIGINAL (for source lookup):
function k4A({
  isError: A,
  isUnresolved: Q,
  shouldAnimate: B
}) {
  let G = WZ2(B);
  return tD0.default.createElement(T, {
    minWidth: 2
  }, tD0.default.createElement(C, {
    color: Q ? void 0 : A ? "error" : "success",
    dimColor: Q
  }, !B || G || A || !Q ? xJ : " "))
}

// READABLE (for understanding):
function StatusIndicator({ isError, isUnresolved, shouldAnimate }) {
  const isVisible = useBlinkingState(shouldAnimate);

  return (
    <Box minWidth={2}>
      <Text
        color={isUnresolved ? undefined : isError ? "error" : "success"}
        dimColor={isUnresolved}
      >
        {/* Show dot when: not animating, visible during blink, error, or resolved */}
        {!shouldAnimate || isVisible || isError || !isUnresolved
          ? BULLET_CHAR  // ⏺ on macOS, ● on other platforms
          : " "}
      </Text>
    </Box>
  );
}

// Mapping: k4A→StatusIndicator, xJ→BULLET_CHAR
```

**What it does:** Displays a status indicator dot that blinks during in-progress operations.

**How it works:**
1. Uses `useBlinkingState` to get synchronized blink state
2. Chooses color based on status: error (red), success (green), or dim (unresolved)
3. Shows/hides dot based on blink visibility state
4. Always shows dot for errors (to keep error visible)

**Platform-specific bullets:**
```javascript
xJ = platform === "darwin" ? "⏺" : "●"
```

---

## 8. Tool Use Display

### 8.1 ToolUseDisplay Component

```javascript
// ============================================
// ToolUseDisplay - Renders tool use with status indicator
// Location: chunks.97.mjs:795-865
// ============================================

// READABLE pseudocode:
function ToolUseDisplay({
  param,           // Tool use block from LLM response
  tools,           // Available tool definitions
  erroredToolUseIDs,
  inProgressToolUseIDs,
  resolvedToolUseIDs,
  progressMessagesForMessage,
  shouldAnimate,
  shouldShowDot
}) {
  const terminalSize = getTerminalSize();
  const [theme] = useTheme();
  const pendingWorkerRequest = getPendingWorkerRequest();

  // Find tool definition
  const toolDef = tools.find(t => t.name === param.name);
  if (!toolDef) {
    logError(`Tool ${param.name} not found`);
    return null;
  }

  // Determine status
  const isResolved = resolvedToolUseIDs.has(param.id);
  const isAborted = !inProgressToolUseIDs.has(param.id) && !isResolved;
  const isWaitingPermission = pendingWorkerRequest?.toolUseId === param.id;

  // Parse input and get display name
  const parseResult = toolDef.inputSchema.safeParse(param.input);
  const displayName = toolDef.userFacingName(parseResult.success ? parseResult.data : undefined);
  const backgroundColor = toolDef.userFacingNameBackgroundColor?.(parseResult.data);

  if (displayName === "") return null;

  // Render tool use message
  const message = parseResult.success
    ? renderToolUseMessage(toolDef, parseResult.data, { theme, verbose, commands })
    : null;

  if (message === null) return null;

  return (
    <Box flexDirection="row" justifyContent="space-between" width="100%">
      <Box flexDirection="column">
        <Box flexDirection="row" flexWrap="nowrap">
          {/* Status indicator */}
          {shouldShowDot && (
            isAborted
              ? <Box minWidth={2}><Text dimColor>{BULLET_CHAR}</Text></Box>
              : <StatusIndicator
                  shouldAnimate={shouldAnimate}
                  isUnresolved={!isResolved}
                  isError={erroredToolUseIDs.has(param.id)}
                />
          )}

          {/* Tool name with optional background color */}
          <Box flexShrink={0}>
            <Text bold wrap="truncate-end" backgroundColor={backgroundColor}>
              {displayName}
            </Text>
          </Box>

          {/* Tool parameters */}
          {message !== "" && (
            <Box flexWrap="nowrap">
              <Text>({message})</Text>
            </Box>
          )}

          {/* Optional tag (e.g., permissions badge) */}
          {parseResult.success && toolDef.renderToolUseTag?.(parseResult.data)}
        </Box>

        {/* Progress message or permission waiting indicator */}
        {!isResolved && !isAborted && (
          isWaitingPermission
            ? <Text dimColor>Waiting for permission...</Text>
            : renderProgressMessage(toolDef, progressMessagesForMessage)
        )}

        {/* Aborted indicator */}
        {!isResolved && isAborted && renderAbortedIndicator(toolDef)}
      </Box>
    </Box>
  );
}

// Mapping: VZ2→ToolUseDisplay
```

**What it does:** Renders a single tool use with status indicator, name, parameters, and progress.

**How it works:**
1. Looks up tool definition by name
2. Parses input to validate and get display-friendly format
3. Renders status indicator with appropriate state
4. Shows tool name with optional background highlight
5. Displays progress messages while tool executes
6. Shows "Waiting for permission..." when blocked on user approval

---

## 9. Accessibility Support [NEW in v2.1.7]

### 9.1 CLAUDE_CODE_ACCESSIBILITY Environment Variable

```javascript
// ============================================
// Accessibility check in componentDidMount
// Location: chunks.67.mjs:92
// ============================================

// ORIGINAL (for source lookup):
componentDidMount() {
  if (this.props.stdout.isTTY && !a1(process.env.CLAUDE_CODE_ACCESSIBILITY))
    this.props.stdout.write(i_A)
}

// READABLE (for understanding):
componentDidMount() {
  // Only enable focus reporting if:
  // 1. Output is a TTY (not piped)
  // 2. CLAUDE_CODE_ACCESSIBILITY is not set (accessibility mode disabled)
  if (this.props.stdout.isTTY && !parseBoolean(process.env.CLAUDE_CODE_ACCESSIBILITY)) {
    this.props.stdout.write(FOCUS_REPORTING_ENABLE);
  }
}
```

**What it does:** Disables focus reporting escape sequences when accessibility mode is enabled.

**Why this approach:**
- Screen readers may have issues with focus reporting sequences
- Allows users to opt-out of potentially problematic terminal features
- Graceful degradation - all features work, just without focus detection

**Usage:**
```bash
export CLAUDE_CODE_ACCESSIBILITY=1
claude
```

---

## 10. Custom UI Components (Deep Analysis)

### 10.1 TextInput System

**TextInput** is the primary input component with features like:
- Cursor rendering with positioning
- Paste detection and handling
- Syntax highlighting
- Rainbow/shimmer animations for streaming
- Placeholder display

```javascript
// ============================================
// TextInputComponent - Main input with highlighting
// Location: chunks.135.mjs:2163-2214
// ============================================

// ORIGINAL (for source lookup):
function cH1({
  inputState: A,
  children: Q,
  terminalFocus: B,
  ...G
}) {
  let { onInput: Z, renderedValue: Y } = A,
    { wrappedOnInput: J, isPasting: X } = s19({
      onPaste: G.onPaste,
      onInput: (E, z) => { if (X && z.return) return; Z(E, z) },
      onImagePaste: G.onImagePaste
    }), { onIsPastingChange: I } = G;
  Ye.default.useEffect(() => { if (I) I(X) }, [X, I]);
  let { showPlaceholder: D, renderedPlaceholder: W } = e19({
    placeholder: G.placeholder, value: G.value, showCursor: G.showCursor,
    focus: G.focus, terminalFocus: B
  });
  J0(J, { isActive: G.focus });
  let K = G.value && G.value.trim().indexOf(" ") === -1 || G.value && G.value.endsWith(" "),
    V = Boolean(G.argumentHint && G.value && K && G.value.startsWith("/")),
    F = G.showCursor && G.highlights ? G.highlights.filter((E) => G.cursorOffset < E.start || G.cursorOffset >= E.end) : G.highlights,
    H = F && F.length > 0;
  return Ye.default.createElement(T, null, Ye.default.createElement(C, {
    wrap: "truncate-end", dimColor: G.dimColor
  }, D && G.placeholderElement ? G.placeholderElement : D && W ? Ye.default.createElement(M8, null, W)
    : H ? Ye.default.createElement(dH1, { text: Y, highlights: F }) : Ye.default.createElement(M8, null, Y),
    V && Ye.default.createElement(C, { dimColor: !0 }, G.value?.endsWith(" ") ? "" : " ", G.argumentHint), Q))
}

// READABLE (for understanding):
function TextInputComponent({ inputState, children, terminalFocus, ...props }) {
  const { onInput, renderedValue } = inputState;

  // Hook: Detect paste operations
  const { wrappedOnInput, isPasting } = usePasteDetection({
    onPaste: props.onPaste,
    onInput: (char, key) => {
      // Ignore return key during paste (multi-line paste handling)
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
    props.argumentHint && props.value && hasTrailingSpace && props.value.startsWith("/")
  );

  // Filter highlights that conflict with cursor position
  const filteredHighlights = props.showCursor && props.highlights
    ? props.highlights.filter(h => props.cursorOffset < h.start || props.cursorOffset >= h.end)
    : props.highlights;
  const hasHighlights = filteredHighlights && filteredHighlights.length > 0;

  return (
    <Box>
      <Text wrap="truncate-end" dimColor={props.dimColor}>
        {showPlaceholder && props.placeholderElement
          ? props.placeholderElement
          : showPlaceholder && renderedPlaceholder
            ? <Transform>{renderedPlaceholder}</Transform>
            : hasHighlights
              ? <HighlightedText text={renderedValue} highlights={filteredHighlights} />
              : <Transform>{renderedValue}</Transform>}
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

// Mapping: cH1→TextInputComponent, A→inputState, Q→children, B→terminalFocus,
//          s19→usePasteDetection, e19→usePlaceholder, J0→useInput,
//          dH1→HighlightedText, T→Box, C→Text, M8→Transform, Ye→React
```

### 10.2 Highlighted Text Rendering

**What it does:** Renders text with multiple highlight segments, supporting rainbow and shimmer effects.

```javascript
// ============================================
// HighlightedTextRenderer - Renders text with highlight styles
// Location: chunks.135.mjs:2103-2150
// ============================================

// ORIGINAL (for source lookup):
function d09({ text: A, highlights: Q, glimmerIndex: G }) {
  let Z = V09(A, Q);  // Split text into segments based on highlights
  return Z.map((Y, X) => {
    if (!Y.highlight) return XD.createElement(M8, { key: X }, Y.text);

    let { style: J } = Y.highlight;
    if (J.type === "rainbow") return Y.text.split("").map((X, I) => {
      let D = Y.start + I,
        W = $jA(I, !1),        // Get rainbow base color
        K = $jA(I, !0);         // Get rainbow shimmer color
      return XD.createElement(ws, {
        key: `${X}-${I}`, char: X, index: D,
        glimmerIndex: G, messageColor: W, shimmerColor: K
      })
    });
    else if (J.type === "shimmer") return Y.text.split("").map((X, I) => {
      let D = Y.start + I;
      return XD.createElement(ws, {
        key: `${X}-${I}`, char: X, index: D,
        glimmerIndex: G, messageColor: J.baseColor, shimmerColor: J.shimmerColor
      })
    });
    else if (J.type === "solid") return XD.createElement(C, {
      key: X, color: J.color
    }, XD.createElement(M8, null, Y.text));
    return XD.createElement(C, { key: X }, XD.createElement(M8, null, Y.text))
  })
}

// READABLE (for understanding):
function HighlightedTextRenderer({ text, highlights, glimmerIndex }) {
  // Split text into segments (highlighted and non-highlighted)
  const segments = splitByHighlights(text, highlights);

  return segments.map((segment, idx) => {
    // Non-highlighted segment: render plain
    if (!segment.highlight) {
      return <Transform key={idx}>{segment.text}</Transform>;
    }

    const { style } = segment.highlight;

    // Rainbow style: each character gets cycling rainbow colors
    if (style.type === "rainbow") {
      return segment.text.split("").map((char, charIdx) => {
        const globalIndex = segment.start + charIdx;
        const baseColor = getRainbowColor(charIdx, false);     // Normal rainbow color
        const shimmerColor = getRainbowColor(charIdx, true);   // Bright shimmer variant
        return (
          <AnimatedChar
            key={`${idx}-${charIdx}`}
            char={char}
            index={globalIndex}
            glimmerIndex={glimmerIndex}
            messageColor={baseColor}
            shimmerColor={shimmerColor}
          />
        );
      });
    }

    // Shimmer style: two-color shimmer effect
    if (style.type === "shimmer") {
      return segment.text.split("").map((char, charIdx) => {
        const globalIndex = segment.start + charIdx;
        return (
          <AnimatedChar
            key={`${idx}-${charIdx}`}
            char={char}
            index={globalIndex}
            glimmerIndex={glimmerIndex}
            messageColor={style.baseColor}
            shimmerColor={style.shimmerColor}
          />
        );
      });
    }

    // Solid style: single color for entire segment
    if (style.type === "solid") {
      return <Text key={idx} color={style.color}><Transform>{segment.text}</Transform></Text>;
    }

    // Default: no styling
    return <Text key={idx}><Transform>{segment.text}</Transform></Text>;
  });
}

// Mapping: d09→HighlightedTextRenderer, V09→splitByHighlights, $jA→getRainbowColor,
//          ws→AnimatedChar, C→Text, M8→Transform
```

### 10.3 Shimmer Animation Algorithm (Deep Analysis)

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
// Location: chunks.107.mjs:2155-2176
// ============================================

// ORIGINAL (for source lookup):
function $6A(A, Q, B, G, Z) {
  let Y = rFA.useRef(Date.now()),
    [J, X] = rFA.useState(Z ?? (A === "requesting" ? -1 : 10)),
    I = rFA.useMemo(() => {
      if (A === "requesting") return 50;
      return 200
    }, [A]);
  return XZ(() => {
    if (B === !1 || G) return;
    let D = Date.now() - Y.current,
      W = Math.floor(D / I),
      K = Q.length,
      V = K + 20;
    if (A === "requesting") {
      let F = W % V - 10;
      X(F)
    } else {
      let F = K + 10 - W % V;
      X(F)
    }
  }, I), J
}

// READABLE (for understanding):
function useShimmerAnimation(status, text, enabled, paused, initialIndex) {
  const startTime = useRef(Date.now());
  // Start position: -1 for requesting (shimmer enters), 10 for others
  const [glimmerIndex, setGlimmerIndex] = useState(
    initialIndex ?? (status === "requesting" ? -1 : 10)
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
      // Shimmer moves forward during loading (left → right)
      const newIndex = tickCount % cycleLength - 10;
      setGlimmerIndex(newIndex);
    } else {
      // Shimmer moves backward during response (right → left)
      const newIndex = textLength + 10 - tickCount % cycleLength;
      setGlimmerIndex(newIndex);
    }
  }, interval);

  return glimmerIndex;
}

// Mapping: $6A→useShimmerAnimation, A→status, Q→text, B→enabled, G→paused,
//          Z→initialIndex, XZ→useInterval, rFA→React
```

### 10.4 AnimatedChar Component

**What it does:** Renders a single character with conditional color based on shimmer position.

```javascript
// ============================================
// AnimatedChar - Single character with shimmer effect
// Location: chunks.107.mjs:2023-2035
// ============================================

// ORIGINAL (for source lookup):
function ws({
  char: A,
  index: Q,
  glimmerIndex: B,
  messageColor: G,
  shimmerColor: Z
}) {
  let Y = Q === B,              // Is this the center of shimmer?
    J = Math.abs(Q - B) === 1;  // Is this adjacent to shimmer center?
  return JE0.createElement(C, {
    color: Y || J ? Z : G       // Use shimmer color for 3-char window
  }, A)
}

// READABLE (for understanding):
function AnimatedChar({ char, index, glimmerIndex, messageColor, shimmerColor }) {
  // Check if this character is in the shimmer highlight window
  const isCenter = index === glimmerIndex;
  const isAdjacent = Math.abs(index - glimmerIndex) === 1;

  // Use shimmer color for 3-character-wide glow effect
  const color = (isCenter || isAdjacent) ? shimmerColor : messageColor;

  return <Text color={color}>{char}</Text>;
}

// Mapping: ws→AnimatedChar, A→char, Q→index, B→glimmerIndex,
//          G→messageColor, Z→shimmerColor, C→Text
```

### 10.5 Rainbow Color System

**What it does:** Provides a 7-color rainbow palette with base and shimmer variants.

```javascript
// ============================================
// Rainbow Color Arrays
// Location: chunks.68.mjs:3572
// ============================================

// ORIGINAL (for source lookup):
zz8 = ["rainbow_red", "rainbow_orange", "rainbow_yellow", "rainbow_green",
       "rainbow_blue", "rainbow_indigo", "rainbow_violet"]
$z8 = ["rainbow_red_shimmer", "rainbow_orange_shimmer", "rainbow_yellow_shimmer",
       "rainbow_green_shimmer", "rainbow_blue_shimmer", "rainbow_indigo_shimmer",
       "rainbow_violet_shimmer"]

// READABLE (for understanding):
const RAINBOW_COLORS = [
  "rainbow_red", "rainbow_orange", "rainbow_yellow", "rainbow_green",
  "rainbow_blue", "rainbow_indigo", "rainbow_violet"
];
const RAINBOW_SHIMMER_COLORS = [
  "rainbow_red_shimmer", "rainbow_orange_shimmer", "rainbow_yellow_shimmer",
  "rainbow_green_shimmer", "rainbow_blue_shimmer", "rainbow_indigo_shimmer",
  "rainbow_violet_shimmer"
];

// getRainbowColor function (inferred):
function getRainbowColor(charIndex, isShimmer) {
  const colors = isShimmer ? RAINBOW_SHIMMER_COLORS : RAINBOW_COLORS;
  return colors[charIndex % colors.length];
}

// Mapping: zz8→RAINBOW_COLORS, $z8→RAINBOW_SHIMMER_COLORS, $jA→getRainbowColor
```

**Theme color definitions (dark theme example):**

```javascript
// Location: chunks.66.mjs:467-473
rainbow_red_shimmer: "rgb(250,155,147)",
rainbow_orange_shimmer: "rgb(255,185,137)",
rainbow_yellow_shimmer: "rgb(255,225,155)",
rainbow_green_shimmer: "rgb(185,230,180)",
rainbow_blue_shimmer: "rgb(180,205,240)",
rainbow_indigo_shimmer: "rgb(195,180,230)",
rainbow_violet_shimmer: "rgb(230,180,210)"
```

---

## 11. Stream Event Processing

### 11.1 streamEventProcessor Function

**What it does:** Routes stream events to appropriate state handlers for UI updates.

```javascript
// ============================================
// streamEventProcessor - Stream event to UI state router
// Location: chunks.147.mjs:3115-3209
// ============================================

// ORIGINAL (for source lookup):
function $K1(A, Q, B, G, Z, Y, J) {
  if (A.type !== "stream_event" && A.type !== "stream_request_start") {
    if (A.type === "tombstone") { Y?.(A.message); return }
    if (A.type === "assistant") {
      let X = A.message.content.find((I) => I.type === "thinking");
      if (X && X.type === "thinking") J?.(() => ({
        thinking: X.thinking, isStreaming: !1, streamingEndedAt: Date.now()
      }))
    }
    Q(A); return
  }
  if (A.type === "stream_request_start") { G("requesting"); return }
  if (A.event.type === "message_stop") { G("tool-use"), Z(() => []); return }
  switch (A.event.type) {
    case "content_block_start":
      switch (A.event.content_block.type) {
        case "thinking": case "redacted_thinking": G("thinking"); return;
        case "text": G("responding"); return;
        case "tool_use": {
          G("tool-input");
          let X = A.event.content_block, I = A.event.index;
          Z((D) => [...D, { index: I, contentBlock: X, unparsedToolInput: "" }]); return
        }
        case "server_tool_use": case "web_search_tool_result":
        case "code_execution_tool_result": case "mcp_tool_use":
        case "mcp_tool_result": case "container_upload":
        case "web_fetch_tool_result": case "bash_code_execution_tool_result":
        case "text_editor_code_execution_tool_result":
          G("tool-input"); return
      }
      break;
    case "content_block_delta":
      switch (A.event.delta.type) {
        case "text_delta": B(A.event.delta.text); return;
        case "input_json_delta": {
          let X = A.event.delta.partial_json, I = A.event.index;
          B(X), Z((D) => {
            let W = D.find((K) => K.index === I);
            if (!W) return D;
            return [...D.filter((K) => K !== W), { ...W, unparsedToolInput: W.unparsedToolInput + X }]
          }); return
        }
        case "thinking_delta": B(A.event.delta.thinking); return;
        case "signature_delta": B(A.event.delta.signature); return;
        default: return
      }
    case "content_block_stop": return;
    case "message_delta": G("responding"); return;
    default: G("responding"); return
  }
}

// READABLE (for understanding):
function streamEventProcessor(
  event,           // Incoming stream event
  addMessage,      // Q: Add complete message to state
  updateDelta,     // B: Update streaming text delta
  setStatus,       // G: Set UI status mode
  setToolInputs,   // Z: Update tool input state
  setTombstone,    // Y: Handle tombstone messages
  setThinkingState // J: Update thinking block state
) {
  // Non-stream events: tombstone, assistant message complete
  if (event.type !== "stream_event" && event.type !== "stream_request_start") {
    if (event.type === "tombstone") {
      setTombstone?.(event.message);
      return;
    }
    if (event.type === "assistant") {
      // Extract thinking content from completed message
      const thinkingBlock = event.message.content.find(c => c.type === "thinking");
      if (thinkingBlock?.type === "thinking") {
        setThinkingState?.(() => ({
          thinking: thinkingBlock.thinking,
          isStreaming: false,
          streamingEndedAt: Date.now()
        }));
      }
    }
    addMessage(event);
    return;
  }

  // Stream request starting
  if (event.type === "stream_request_start") {
    setStatus("requesting");
    return;
  }

  // Message complete → switch to tool execution
  if (event.event.type === "message_stop") {
    setStatus("tool-use");
    setToolInputs(() => []);  // Reset tool inputs
    return;
  }

  // Handle stream events
  switch (event.event.type) {
    case "content_block_start":
      switch (event.event.content_block.type) {
        case "thinking":
        case "redacted_thinking":
          setStatus("thinking");
          return;
        case "text":
          setStatus("responding");
          return;
        case "tool_use": {
          setStatus("tool-input");
          const block = event.event.content_block;
          const blockIndex = event.event.index;
          setToolInputs(prev => [...prev, {
            index: blockIndex,
            contentBlock: block,
            unparsedToolInput: ""
          }]);
          return;
        }
        // Server tools, MCP, web search, etc.
        case "server_tool_use":
        case "web_search_tool_result":
        case "code_execution_tool_result":
        case "mcp_tool_use":
        case "mcp_tool_result":
        case "container_upload":
        case "web_fetch_tool_result":
        case "bash_code_execution_tool_result":
        case "text_editor_code_execution_tool_result":
          setStatus("tool-input");
          return;
      }
      break;

    case "content_block_delta":
      switch (event.event.delta.type) {
        case "text_delta":
          updateDelta(event.event.delta.text);
          return;
        case "input_json_delta": {
          // Accumulate partial JSON for tool inputs
          const partialJson = event.event.delta.partial_json;
          const blockIndex = event.event.index;
          updateDelta(partialJson);
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
        case "signature_delta":
          updateDelta(event.event.delta.signature);
          return;
        default:
          return;
      }

    case "content_block_stop":
      return;

    case "message_delta":
      setStatus("responding");
      return;

    default:
      setStatus("responding");
      return;
  }
}

// Mapping: $K1→streamEventProcessor, A→event, Q→addMessage, B→updateDelta,
//          G→setStatus, Z→setToolInputs, Y→setTombstone, J→setThinkingState
```

### 11.2 UI Status States

The UI displays different states based on the `status` value:

| Status | Trigger | UI Display |
|--------|---------|------------|
| `"requesting"` | stream_request_start | Loading spinner |
| `"thinking"` | thinking block start | "Thinking..." indicator |
| `"responding"` | text block start/delta | Streaming text |
| `"tool-input"` | tool_use block start | Tool input preview |
| `"tool-use"` | message_stop | Tool execution |

### 11.3 Data Flow Diagram

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
│                     Agent Loop (aN)                          │
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
                    │ Processor      │ ──▶ $K1()
                    │ ($K1)          │
                    └────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ Messages │      │  Status  │      │  Tools   │
    │  State   │      │  State   │      │  State   │
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

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| InkRenderer | Sa | chunks.66.mjs:60-252 | Custom React reconciler |
| InternalApp | w21 | chunks.67.mjs:23-280 | Root component |
| tokenToText | VE | chunks.97.mjs:3-113 | Markdown to styled text |
| TableRenderer | gG2 | chunks.97.mjs:171-307 | Responsive table rendering |
| createBlinkingManager | zW5 | chunks.97.mjs:726-745 | Blink animation manager |
| useBlinkingState | WZ2 | chunks.97.mjs:747-759 | Blink animation hook |
| TextInputComponent | cH1 | chunks.135.mjs:2163-2214 | Main input with highlighting |
| HighlightedTextRenderer | d09 | chunks.135.mjs:2103-2150 | Text with highlight styles |
| useShimmerAnimation | $6A | chunks.107.mjs:2155-2176 | Shimmer animation hook |
| AnimatedChar | ws | chunks.107.mjs:2023-2035 | Single char with shimmer |
| streamEventProcessor | $K1 | chunks.147.mjs:3115-3209 | Stream event to UI router |
| AnimatedMessage | XE0 | chunks.107.mjs:2044-2092 | Message with shimmer effect |
| StatusIndicator | k4A | chunks.97.mjs:772-784 | Status dot component |
| ToolUseDisplay | VZ2 | chunks.97.mjs:795-865 | Tool use rendering |
| PlanRejectedDisplay | iY1 | chunks.97.mjs:381-395 | Plan rejection UI |
| LoadingSpinner | mG2 | chunks.97.mjs:367-371 | Loading indicator |

---

## Context Providers Summary

| Provider | Obfuscated | Value |
|----------|------------|-------|
| TerminalDimensionsContext | l_A | { columns, rows } |
| InkContext | AN | Ink instance |
| ExitContext | K21 | { exit } |
| ThemeProvider | xQ0 | { theme, setTheme } |
| StdinContext | V21 | { stdin, setRawMode, ... } |
| FocusContext | F21 | { activeId, focusNext, ... } |
| TerminalFocusContext | E21 | { isTerminalFocused } **NEW** |

---

## 12. Individual Key Parsing

### 12.1 Key Object Structure

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

**Key Bindings Reference:**

| Key | Sequence | Parsed Name | Notes |
|-----|----------|-------------|-------|
| Return | `\r` | "return" | Carriage return |
| Enter | `\n` | "enter" | Line feed |
| Tab | `\t` | "tab" | Horizontal tab |
| Escape | `\x1B` | "escape" | Escape key |
| Space | ` ` | "space" | Space bar |
| Ctrl+C | `\x03` | "c" + ctrl:true | Exit signal |
| Ctrl+Z | `\x1A` | "z" + ctrl:true | Suspend |
| Arrow Up | `\x1B[A` | "up" | Navigation |
| Arrow Down | `\x1B[B` | "down" | Navigation |
| Arrow Right | `\x1B[C` | "right" | Navigation |
| Arrow Left | `\x1B[D` | "left" | Navigation |

---

## 13. Theme System

### 13.1 Theme Provider

```javascript
// ============================================
// ThemeProvider - Theme state management component
// Location: chunks.66.mjs (xQ0)
// ============================================

// Context value structure:
{
  currentTheme: Theme,           // Active theme
  setTheme: (theme) => void,     // Persist theme change
  setPreviewTheme: (theme) => void  // Temporary preview
}

// Theme type:
type Theme = "light" | "dark" | "light-daltonized" | "dark-daltonized" |
             "light-high-contrast" | "dark-high-contrast" | "system";
```

### 13.2 Theme-Aware Colors

The theme system supports multiple theme variants including daltonized (color-blind friendly) and high-contrast options.

```javascript
// Location: chunks.66.mjs:417-783

// Dark theme colors (excerpt):
const darkTheme = {
  text: "rgb(255,255,255)",
  textSubtle: "rgb(163,163,163)",
  claude: "rgb(215,119,87)",           // Claude orange
  claudeShimmer: "rgb(245,149,117)",   // Shimmer variant
  permission: "rgb(117,135,255)",       // Permission blue
  success: "rgb(51,170,102)",          // Green for success
  error: "rgb(222,73,79)",             // Red for errors
  warning: "rgb(250,183,69)",          // Yellow warnings
  // Rainbow colors for multi-color effects
  rainbow_red: "rgb(240,115,107)",
  rainbow_orange: "rgb(245,165,117)",
  rainbow_yellow: "rgb(255,215,135)",
  rainbow_green: "rgb(165,220,160)",
  rainbow_blue: "rgb(160,185,230)",
  rainbow_indigo: "rgb(175,160,220)",
  rainbow_violet: "rgb(220,160,200)"
};

// Light theme colors (excerpt):
const lightTheme = {
  text: "rgb(0,0,0)",
  textSubtle: "rgb(89,89,89)",
  claude: "rgb(194,102,76)",
  // ... similar structure
};

// ANSI fallback for non-RGB terminals:
const ansiDarkTheme = {
  text: "ansi:white",
  claude: "ansi:yellowBright",
  success: "ansi:green",
  error: "ansi:red",
  // ...
};
```

**Theme Variants:**

| Theme | Description |
|-------|-------------|
| `light` | Default light theme |
| `dark` | Default dark theme |
| `light-daltonized` | Color-blind friendly light |
| `dark-daltonized` | Color-blind friendly dark |
| `light-high-contrast` | High contrast light |
| `dark-high-contrast` | High contrast dark |
| `system` | Follow system preference |

---

## 14. File Watcher Subscription System

### 14.1 watcherManager Overview

**What it does:** Monitors settings files for external changes and notifies React components.

**How it works:**
1. Chokidar watches settings file paths with debouncing
2. Components subscribe via `fm.subscribe(callback)`
3. On file change, all callbacks are invoked
4. Unsubscribe function returned for cleanup in `useEffect`

```javascript
// ============================================
// watcherManager - File change subscription system
// Location: chunks.11.mjs
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
      pollInterval: 100
    },
    ignored: (path) => path.split(sep).some(p => p === ".git"),
  });

  chokidarInstance.on("change", handleFileChange);
  chokidarInstance.on("unlink", handleFileDelete);
}

const watcherManager = {
  initialize: initializeWatcher,
  dispose: disposeWatcher,
  subscribe: subscribe,
  markInternalWrite: markInternalWrite  // Prevent self-triggered updates
};

// Mapping: fm→watcherManager, y64→subscribe, k64→initializeWatcher,
//          fd0→chokidar, h9A→chokidarInstance
```

**Usage in React Components:**

```javascript
// Example: Watch for settings changes
useEffect(() => {
  const unsubscribe = watcherManager.subscribe(() => {
    // Re-read settings when file changes
    loadSettings();
  });

  return () => {
    unsubscribe();  // Cleanup on unmount
  };
}, []);
```

---

## 15. UI Workflow Summary

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
               └─▶ Start mainAgentLoop (aN)

3. STREAMING RESPONSE
   └─▶ for await (event of aN(...))
       └─▶ $K1 routes event:
           ├─▶ "requesting" → Show spinner
           ├─▶ "thinking" → Show thinking indicator
           ├─▶ "responding" → Stream text to UI
           ├─▶ "tool-input" → Show tool preview
           └─▶ "tool-use" → Execute tool, show result

4. STATE UPDATES
   └─▶ Callbacks update React state:
       ├─▶ addMessage: setMessages([...prev, newMessage])
       ├─▶ updateDelta: setTokenCount(prev + delta.length)
       ├─▶ setStatus: setStatus(newStatus)
       └─▶ setToolInputs: setToolInputs(updatedInputs)

5. RE-RENDER
   └─▶ React reconciles virtual DOM
       └─▶ Ink renderer computes Yoga layout
           └─▶ Terminal output written via ANSI codes
```

### Component Hierarchy

```
<InternalApp>
  ├─ <TerminalDimensionsContext.Provider>
  │   └─ <InkContext.Provider>
  │       └─ <ExitContext.Provider>
  │           └─ <ThemeProvider>
  │               └─ <StdinContext.Provider>
  │                   └─ <FocusContext.Provider>
  │                       └─ <TerminalFocusContext.Provider>  [NEW]
  │                           └─ <App />
  │                               ├─ <MessageList />
  │                               │   ├─ <AssistantMessage />
  │                               │   │   ├─ <MarkdownRenderer />
  │                               │   │   └─ <ToolUseDisplay />
  │                               │   └─ <UserMessage />
  │                               ├─ <StatusLine />
  │                               │   └─ <AnimatedMessage />
  │                               └─ <TextInput />
  │                                   └─ <HighlightedText />
  └─
```

---

## Summary

The Claude Code v2.1.7 UI architecture provides:

1. **Ink Framework** - React-based terminal rendering with Yoga layout
2. **Provider Chain** - **Seven** nested contexts for global state (dimensions, theme, focus, terminal focus, etc.)
3. **Real-time Updates** - Async generators + file watching for live data
4. **Custom Components** - Rich text input, highlighting, animations
5. **Tool Rendering** - Lifecycle-aware tool result display
6. **Focus Management** - Keyboard navigation with Tab/Shift+Tab
7. **Raw Mode** - Character-level input with reference counting
8. **Theme System** - Light/dark/daltonized/high-contrast modes
9. **Shimmer Animation** - Time-based character animation with direction awareness
10. **Stream Event Processing** - Centralized event routing to UI state

**New in v2.1.7:**
- **TerminalFocusContext** - 7th context provider for terminal focus state
- **CLAUDE_CODE_ACCESSIBILITY** - Environment variable to disable focus reporting
- **Collaboration Notifications** - New attachment type for collab features
- **Enhanced Theme Variants** - Daltonized and high-contrast options

**Key insight:** The architecture mirrors modern web frameworks (React + Context) but optimized for terminal constraints, using ANSI escape codes for styling and Yoga for layout computation.
