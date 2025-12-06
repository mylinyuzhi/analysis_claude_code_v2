# Ink Components and UI Architecture

## Overview

Claude Code v2.0.59 uses **Ink** (a React-based terminal UI framework) to build its interactive interface. The main component architecture is defined in `chunks.68.mjs` with the `BsA` class (InternalApp).

## BsA Component (InternalApp)

The `BsA` class is the root application component that extends React's `PureComponent`:

```javascript
BsA = class BsA extends y_.PureComponent {
  static displayName = "InternalApp";

  state = {
    isFocusEnabled: true,
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

  // ... methods
}
```

### State Management

**Component State:**
- `isFocusEnabled` - Whether focus management is active
- `activeFocusId` - ID of currently focused component
- `focusables` - Array of focusable components
- `error` - Error state for error boundary

**Instance Variables:**
- `rawModeEnabledCount` - Reference count for raw mode
- `internal_eventEmitter` - Event emitter for keyboard events
- `keyParseState` - State machine for parsing keyboard input
- `incompleteEscapeTimer` - Timer for handling incomplete escape sequences

### Error Boundary

The component implements React error boundaries:

```javascript
static getDerivedStateFromError(A) {
  return {
    error: A
  };
}

componentDidCatch(A) {
  this.handleExit(A);
}
```

## Provider Chain

The component establishes a comprehensive provider chain for dependency injection:

```javascript
render() {
  return y_.default.createElement(Q$A.Provider, {        // Terminal Provider
    value: {
      columns: this.props.terminalColumns,
      rows: this.props.terminalRows
    }
  }, y_.default.createElement(k_.Provider, {             // Ink2 Provider
    value: this.props.ink2
  }, y_.default.createElement(daA.Provider, {            // Exit Provider
    value: {
      exit: this.handleExit
    }
  }, y_.default.createElement(og1, {                     // Theme Provider (Component)
    initialState: this.props.initialTheme
  }, y_.default.createElement(caA.Provider, {            // Stdin Provider
    value: {
      stdin: this.props.stdin,
      setRawMode: this.handleSetRawMode,
      isRawModeSupported: this.isRawModeSupported(),
      internal_exitOnCtrlC: this.props.exitOnCtrlC,
      internal_eventEmitter: this.internal_eventEmitter
    }
  }, y_.default.createElement(paA.Provider, {            // Focus Provider
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
  }, this.state.error ?
    y_.default.createElement(Qu1, { error: this.state.error }) :  // Error component
    this.props.children))))))
}
```

### 1. Terminal Provider (Q$A)

Provides terminal dimensions information:

```javascript
{
  columns: this.props.terminalColumns,  // Terminal width
  rows: this.props.terminalRows         // Terminal height
}
```

### 2. Ink2 Provider (k_)

Provides Ink version 2 compatibility layer:

```javascript
{
  value: this.props.ink2
}
```

### 3. Exit Provider (daA)

Provides exit handler for the application:

```javascript
{
  exit: this.handleExit
}
```

### 4. Theme Provider (og1)

Manages theme state (not just a context provider, but a component):

```javascript
<og1 initialState={this.props.initialTheme}>
  {/* children */}
</og1>
```

The theme provider is implemented in `chunks.67.mjs`:

```javascript
// Theme context definition
setTheme: (J) => {
  // Update theme
},
setPreviewTheme: (J) => {
  // Update preview theme
},
currentTheme: Z ?? B  // Current active theme
```

### 5. Stdin Provider (caA)

Provides stdin access and raw mode control:

```javascript
{
  stdin: this.props.stdin,
  setRawMode: this.handleSetRawMode,
  isRawModeSupported: this.isRawModeSupported(),
  internal_exitOnCtrlC: this.props.exitOnCtrlC,
  internal_eventEmitter: this.internal_eventEmitter
}
```

### 6. Focus Provider (paA)

Manages focus state and navigation:

```javascript
{
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
```

## Focus Management

### Focus State

The focus system tracks:
- **Active focus ID**: Currently focused component
- **Focusables array**: List of all focusable components
- **Focus enabled flag**: Whether focus navigation is active

### Focus API

**Enable/Disable Focus:**

```javascript
enableFocus = () => {
  this.setState({
    isFocusEnabled: true
  });
};

disableFocus = () => {
  this.setState({
    isFocusEnabled: false
  });
};
```

**Add/Remove Focusables:**

```javascript
addFocusable = (A, { autoFocus, isActive }) => {
  this.setState((Q) => {
    let B = Q.focusables;
    // Add focusable to list
    // ...
  });
};

removeFocusable = (A) => {
  this.setState((Q) => ({
    activeFocusId: this.findNextFocusable(A) ?? Q.activeFocusId,
    focusables: Q.focusables.filter((B) => B.id !== A)
  }));
};
```

**Navigate Focus:**

```javascript
focusNext = () => {
  this.setState((A) => {
    let Q = this.findNextFocusable(A.activeFocusId);
    if (Q !== void 0) return { activeFocusId: Q };
    return null;
  });
};

focusPrevious = () => {
  this.setState((A) => {
    let Q = this.findPreviousFocusable(A.activeFocusId);
    if (Q !== void 0) return { activeFocusId: Q };
    return null;
  });
};
```

### Keyboard Navigation

Focus is controlled by keyboard input:

```javascript
// Handle Tab key navigation
if (A === HF6) this.focusNext();   // Tab key (HF6 = "\t")

// Handle Shift+Tab navigation
if (A === CF6) this.focusPrevious(); // Shift+Tab (CF6 = "\x1B[Z")

// Handle Escape key
if (A === EF6 && this.state.activeFocusId) {  // Escape (EF6 = "\x1B")
  this.setState({
    activeFocusId: void 0
  });
}
```

### Focus Implementation

Focus navigation only works when enabled and focusables exist:

```javascript
if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
  if (A === HF6) this.focusNext();
  if (A === CF6) this.focusPrevious();
}
```

## Terminal Dimensions Handling

### Initial Setup

Terminal dimensions are captured from stdout:

```javascript
this.terminalColumns = this.options.stdout.columns || 80;
this.terminalRows = this.options.stdout.rows || 24;
```

### Resize Handling

The system listens for terminal resize events (implementation not shown in excerpts but typical Ink pattern):

```javascript
// Typical pattern (not from source)
process.stdout.on('resize', () => {
  // Update terminal dimensions
  // Trigger re-render
});
```

## Raw Mode Management

### Raw Mode Support

Check if raw mode is supported:

```javascript
isRawModeSupported() {
  return this.props.stdin.isTTY;
}
```

### Enable/Disable Raw Mode

```javascript
handleSetRawMode = (A) => {
  let { stdin: Q } = this.props;

  if (!this.isRawModeSupported()) {
    if (Q === process.stdin)
      throw Error(`Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
    else
      throw Error(`Raw mode is not supported on the stdin provided to Ink.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
  }

  Q.setEncoding("utf8");

  if (A) {
    // Enable raw mode
    if (this.rawModeEnabledCount === 0) {
      Q.ref();
      Q.setRawMode(true);
      Q.addListener("readable", this.handleReadable);
      this.props.stdout.write("\x1B[?2004h");  // Enable bracketed paste mode
    }
    this.rawModeEnabledCount++;
    return;
  }

  // Disable raw mode (reference counting)
  if (--this.rawModeEnabledCount === 0) {
    Q.setRawMode(false);
    Q.removeListener("readable", this.handleReadable);
    Q.unref();
  }
};
```

**Key Features:**
- Reference counting for raw mode (multiple components can request it)
- Bracketed paste mode enabled (`\x1B[?2004h`)
- Stream reference management
- Encoding set to UTF-8

## Lifecycle Methods

### Component Mount

```javascript
componentDidMount() {
  if (this.props.stdout.isTTY)
    this.props.stdout.write(XM.cursorHide);  // Hide cursor
}
```

### Component Unmount

```javascript
componentWillUnmount() {
  if (this.props.stdout.isTTY)
    this.props.stdout.write(XM.cursorShow);  // Show cursor

  if (this.incompleteEscapeTimer) {
    clearTimeout(this.incompleteEscapeTimer);
    this.incompleteEscapeTimer = null;
  }

  if (this.isRawModeSupported())
    this.handleSetRawMode(false);
}
```

## Keyboard Input Handling

### Key Parser

The component uses a state machine for parsing keyboard input:

```javascript
keyParseState = S$B;
incompleteEscapeTimer = null;
NORMAL_TIMEOUT = 50;     // Normal key press timeout
PASTE_TIMEOUT = 500;     // Paste mode timeout
```

### Readable Handler

```javascript
handleReadable = () => {
  // Read from stdin
  // Parse key sequences
  // Emit events via internal_eventEmitter
  // Handle focus navigation
  // Handle Ctrl+C for exit
};
```

## Context Definitions

From `chunks.67.mjs`, we can see the context structures:

### Internal App Context (J$B)

```javascript
J$B.displayName = "InternalAppContext";
```

### Internal Focus Context (F$B)

```javascript
F$B.displayName = "InternalFocusContext";

// Default values
{
  enableFocus() {},
  disableFocus() {},
  // ... other focus methods
}
```

## Theme System

Theme management from `chunks.67.mjs`:

```javascript
{
  setTheme: (J) => {
    // Update theme
  },
  setPreviewTheme: (J) => {
    // Set preview theme
  },
  currentTheme: Z ?? B  // Active theme
}

// Provider wraps children
return naA.default.createElement(rg1.Provider, {
  value: {
    currentTheme: A,
    setTheme: Q
  }
}, /* children */);
```

### Theme Context Features

- **Current theme**: Active theme configuration
- **Preview theme**: Temporary theme for previewing
- **Set theme**: Persist theme change
- **Set preview theme**: Temporary theme change

## Platform Detection

```javascript
zF6 = process.platform !== "win32";
```

Used for platform-specific behavior (Windows vs Unix).

## Summary

The Ink component architecture provides:

1. **Provider Chain**: Six nested providers for different concerns
2. **Focus Management**: Complete focus navigation system with keyboard support
3. **Raw Mode**: Terminal raw mode with reference counting
4. **Theme System**: Theme management with preview capability
5. **Error Boundaries**: Graceful error handling
6. **Terminal Control**: Cursor management and dimension tracking
7. **Keyboard Input**: State machine for parsing complex key sequences
8. **Event System**: Internal event emitter for component communication
9. **Lifecycle Management**: Proper setup and cleanup

This architecture enables Claude Code to build a rich, interactive terminal UI with React-like component composition.
