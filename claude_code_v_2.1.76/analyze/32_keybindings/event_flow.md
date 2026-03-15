# Keybinding Event Flow - Complete Keystroke Lifecycle

This document traces the complete journey of a keystroke from terminal input through ANSI parsing, event conversion, dispatching, focus routing, keybinding matching, to final action execution.

---

## Overview

The keybinding event flow is a sophisticated multi-stage pipeline that transforms raw terminal input into meaningful actions:

1. **Terminal Input Capture**: Raw mode stdin reads bytes
2. **ANSI Escape Sequence Parsing**: Tokenizes input into sequences
3. **Key Event Conversion**: Maps sequences to keyboard events
4. **Event Dispatching**: Creates React-compatible events
5. **Focus Routing**: Routes to active UI component
6. **Keybinding Matching**: Resolves keystroke to action (with chord support)
7. **Action Execution**: Invokes registered handlers

**Key Design Principles:**

- **Stateful parsing**: Tokenizer maintains state for incomplete sequences
- **Paste detection**: Bracket paste mode prevents individual key processing
- **Chord support**: Multi-keystroke sequences with 1000ms timeout mechanism
- **Context filtering**: Keybindings only active in appropriate UI contexts
- **Platform normalization**: Cross-platform key name and modifier handling

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - TUI

Key functions in this document:
- `InternalApp` (v26) - Main TUI component managing input lifecycle
- `handleReadable` (method) - Stdin read event handler
- `processInput` (method) - Main input processing dispatcher
- `resolveKeystroke` (tK6) - Keybinding matcher
- `eventToKeystroke` (sN5) - Converts DOM event to keystroke
- `extractKeyName` (v77) - Key name normalization
- `KeybindingHandler` (x6Y) - Event listener component

---

## Stage 1: Terminal Input Capture

**Location**: InternalApp.handleReadable() (chunks.73.mjs)

**How it works:**
1. Claude Code enables raw mode on stdin (disables line buffering and echo)
2. The app registers a `'readable'` event listener on stdin
3. On readable, `stdin.read()` returns raw byte buffer
4. Raw bytes are passed to the ANSI tokenizer

**Key detail**: In raw mode, `Ctrl+C` does NOT send SIGINT — it sends byte `0x03`. This is what allows `Ctrl+C` to be intercepted as an application shortcut rather than killing the process.

**Reference counting**: The system maintains a reference count for raw mode to support nested calls (e.g., spawning subprocesses that also need raw mode).

---

## Stage 2: ANSI Escape Sequence Parsing

**Location**: AJ1() tokenizer state machine (chunks.50.mjs:925-1062)

**Why needed**: Terminal keys send multi-byte ANSI escape sequences. For example:
- Arrow Up: `\x1b[A`
- Function key F1: `\x1bOP`
- Alt+A: `\x1ba` (on some terminals)

**State machine states:**
```
ground → escape → csi → ...
                → ss3
       → osc
       → dcs
       → apc
```

**Incomplete sequence handling**: If a sequence starts but no continuation arrives within 50ms, the tokenizer treats it as a standalone escape key press. This handles the ambiguity between Alt+Key (which sends `\x1b` + key) and a raw Escape press.

**Bracket paste mode**: Some terminals send `\x1b[200~` at the start of a paste and `\x1b[201~` at the end. The tokenizer detects this and sends the entire paste as a single string event rather than individual key events — preventing accidental action triggers during paste.

---

## Stage 3: Key Event Conversion

**Location**: P77() dispatcher → j77() converter (chunks.53.mjs)

**What it does**: Converts parsed ANSI sequences into structured keyboard event objects.

**Key normalization (v77 / extractKeyName)**:

```javascript
// ============================================
// extractKeyName - Map Ink key event flags to canonical key name
// Location: chunks.53.mjs:2875-2891
// ============================================

// ORIGINAL (for source lookup):
function v77(A, q) {
    if (q.escape) return "escape";
    if (q.return) return "enter";
    if (q.tab) return "tab";
    if (q.backspace) return "backspace";
    if (q.delete) return "delete";
    if (q.upArrow) return "up";
    if (q.downArrow) return "down";
    if (q.leftArrow) return "left";
    if (q.rightArrow) return "right";
    if (q.pageUp) return "pageup";
    if (q.pageDown) return "pagedown";
    if (q.home) return "home";
    if (q.end) return "end";
    if (A.length === 1) return A.toLowerCase();
    return null
}

// READABLE (for understanding):
function extractKeyName(inputString, keyEvent) {
    // Special keys from Ink's event flags
    if (keyEvent.escape) return "escape";
    if (keyEvent.return) return "enter";
    if (keyEvent.tab) return "tab";
    if (keyEvent.backspace) return "backspace";
    if (keyEvent.delete) return "delete";
    if (keyEvent.upArrow) return "up";
    if (keyEvent.downArrow) return "down";
    if (keyEvent.leftArrow) return "left";
    if (keyEvent.rightArrow) return "right";
    if (keyEvent.pageUp) return "pageup";
    if (keyEvent.pageDown) return "pagedown";
    if (keyEvent.home) return "home";
    if (keyEvent.end) return "end";
    // Single-character alphanumeric/symbol
    if (inputString.length === 1) return inputString.toLowerCase();
    return null;  // Unrecognized — drop
}

// Mapping: v77→extractKeyName, A→inputString, q→keyEvent
```

**Result**: A structured object like:
```javascript
{
  input: "c",
  ctrl: true,    // Ctrl+C
  alt: false,
  shift: false,
  meta: false
}
```

---

## Stage 4: Event Dispatching

**Location**: qK9() event dispatcher (chunks.72.mjs:2444-2467)

**What it does**: Wraps the parsed key event in a React-compatible event and emits it into the Ink component tree.

**React integration**: Uses `discreteUpdates()` from React's scheduler to batch state updates that result from keystrokes, improving performance by preventing multiple re-renders per keystroke.

**Ctrl+Z handling**: On non-Windows platforms, `Ctrl+Z` (`\x1a`) triggers `process.kill(process.pid, 'SIGTSTP')` to suspend the process to the background (Unix job control). This happens before the event reaches the keybinding system.

---

## Stage 5: Focus Routing

**Location**: handleInput() in InternalApp (chunks.73.mjs:135-144)

**What it does**: The focus system intercepts specific keystrokes before they reach the keybinding handler:

```javascript
// ============================================
// handleInput - Focus-level keystroke interception
// Location: chunks.73.mjs:135-144
// ============================================

// ORIGINAL (for source lookup):
handleInput = (A) => {
    if (A === "\x03" && this.props.exitOnCtrlC) this.handleExit();
    if (A === eq9 && this.state.activeFocusId) this.setState({ activeFocusId: void 0 });
    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (A === sq9) this.focusNext();
        if (A === tq9) this.focusPrevious()
    }
};

// READABLE (for understanding):
handleInput = (rawInput) => {
    if (rawInput === "\x03" && this.props.exitOnCtrlC) this.handleExit();   // Ctrl+C exits
    if (rawInput === ESCAPE_KEY && this.state.activeFocusId) {
        this.setState({ activeFocusId: undefined });  // Escape clears focus
    }
    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (rawInput === TAB_KEY) this.focusNext();           // Tab advances focus
        if (rawInput === SHIFT_TAB_KEY) this.focusPrevious(); // Shift+Tab reverses
    }
};

// Mapping: A→rawInput, eq9→ESCAPE_KEY, sq9→TAB_KEY, tq9→SHIFT_TAB_KEY, void 0→undefined
```

**Critical**: Tab and Shift+Tab are **consumed** by the focus system and never reach the keybinding handler. This is why Tab cannot be rebound via `keybindings.json`.

---

## Stage 6: Keybinding Matching

**Location**: KeybindingHandler (x6Y) → resolveKeystroke (tK6)

**Context building**: Before calling `resolveKeystroke`, the handler collects all active contexts:

```javascript
// Collect contexts from registered handlers
let contextSet = new Set();
let registry = handlerRegistryRef.current;
if (registry) {
    for (let handlers of registry.values()) {
        for (let h of handlers) contextSet.add(h.context);
    }
}
// Merge: handler contexts + active contexts + Global
let allContexts = [...contextSet, ...activeContexts, "Global"];
```

**Matching outcomes**:

| Result type | Meaning | Action taken |
|------------|---------|--------------|
| `chord_started` | First key of multi-key sequence | Save pending chord, start timer |
| `match` | Complete single or chord match | Execute handler |
| `chord_cancelled` | Invalid continuation or timeout | Clear pending chord |
| `unbound` | Explicitly disabled binding | Consume keystroke, no action |
| `none` | No binding found | Pass through to component |

---

## Stage 7: Action Execution

**Location**: KeybindingHandler (x6Y), handler registry lookup

**Dispatch algorithm**:
1. Look up action name in `handlerRegistry.get(actionName)`
2. Iterate Set of `{context, handler}` entries
3. Find first handler whose context is in `activeContextsSet`
4. Execute `handler()` (fire-and-forget, no `await`)
5. Call `event.stopImmediatePropagation()` to prevent further handling

**First-match-wins**: The Set iteration order (registration order) determines which handler executes when multiple components register the same action.

---

## Complete Flow Diagram

```
Terminal Keypress (e.g., Ctrl+K)
         |
         v
[Stage 1: stdin.read()]
  Raw bytes: \x0b (ASCII 11)
         |
         v
[Stage 2: ANSI Tokenizer (AJ1)]
  Control character → passes through directly
         |
         v
[Stage 3: Key Event Converter (P77 → j77)]
  → { input: "k", ctrl: true, ... }
         |
         v
[Stage 4: Event Dispatcher (qK9)]
  → React discreteUpdates → emit to Ink
         |
         v
[Stage 5: Focus Routing (handleInput)]
  Is it Tab/Shift+Tab? → focusNext/Previous
  Is it Escape? → clear focus
  Otherwise → pass to keybinding handler
         |
         v
[Stage 6: Keybinding Matching (x6Y → tK6)]
  activeContexts: ["Chat", "Global"]
  isPrefixMatch([ctrl+k], {chord:[ctrl+k,ctrl+c]}) → true
  → { type: "chord_started", pending: [ctrl+k] }
  setPendingChord([ctrl+k]) → start 1000ms timer
         |
  [User presses Ctrl+C within 1000ms]
         |
         v
[Stage 6 again: Second keystroke]
  chordSequence = [ctrl+k, ctrl+c]
  isExactMatch → true
  → { type: "match", action: "clear_history" }
  setPendingChord(null) → clear timer
         |
         v
[Stage 7: Action Execution]
  registry.get("clear_history") → Set<{context: "Chat", handler: fn}>
  activeContexts.has("Chat") → true
  Execute handler() → clears chat messages
  event.stopImmediatePropagation()
```

---

## Performance Characteristics

| Stage | Typical latency | Notes |
|-------|----------------|-------|
| Terminal capture | <1ms | Raw mode, no buffering |
| ANSI parsing | ~1ms | State machine is fast |
| Key conversion | <1ms | Lookup table |
| Event dispatch | <1ms | React batching |
| Focus routing | <1ms | Simple comparisons |
| Keybinding matching | 1-3ms | O(n) filter + O(n*m) matching |
| Action execution | <1ms | Direct function call |

**Total system overhead**: ~5-10ms per keystroke (user wait for chord: up to 1000ms).

**Optimization**: Binding resolution uses `activeContextsList.filter(...)` to reduce the candidate set before prefix/exact matching. Typical TUI has 2-3 active contexts, reducing the candidate set from ~100 bindings to ~20.

---

## Key Takeaways

1. **7 distinct stages**: Each stage has a single responsibility
2. **Two systems**: Focus (Tab traversal) and keybinding (action dispatch) are separate
3. **Context filtering at Stage 6**: Only active contexts' bindings participate in matching
4. **Chord support**: Prefix detection accumulates keystrokes; exact match executes action
5. **Paste protection**: Bracket paste mode prevents key-by-key processing of pasted text
6. **Tab is reserved**: Focus system consumes Tab/Shift+Tab before keybinding handler

**Last Updated**: 2026-03-15 (Claude Code v2.1.76)
