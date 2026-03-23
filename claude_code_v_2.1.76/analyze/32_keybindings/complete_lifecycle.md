# Complete Keystroke Lifecycle Walkthrough

## Overview

This document provides an end-to-end walkthrough of a keystroke traveling through the entire keybinding system, from the moment a key is pressed in the terminal to the final action execution.

We'll trace the example: **User presses `Ctrl+K`, then `Ctrl+C` in the Chat context** to execute the `clear_history` action.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

---

## Example Scenario

**User action:** Press `Ctrl+K` followed by `Ctrl+C` to clear chat history

**Keybinding configuration:**
```json
{
  "context": "Chat",
  "bindings": {
    "ctrl+k ctrl+c": "clear_history"
  }
}
```

**Active contexts:** `["Global", "Chat"]`

**Expected outcome:** Chat history is cleared after the second keystroke

---

## Step-by-Step Trace

### Step 1: Terminal Input Capture (First Keystroke: Ctrl+K)

**Time:** T+0ms

**Location:** InternalApp.handleReadable() (chunks.73.mjs)

**What happens:**
1. Terminal is in raw mode (no line buffering)
2. stdin emits 'readable' event
3. stdin.read() returns raw bytes: `\x0b` (ASCII 11, Ctrl+K)

**State after step:**
```javascript
{
  rawInput: "\x0b",
  keyParseState: "ground", // State machine ready to parse
  incompleteEscapeBuffer: ""
}
```

---

### Step 2: ANSI Escape Sequence Parsing

**Time:** T+1ms

**Location:** AJ1() tokenizer state machine (chunks.73.mjs)

**What happens:**
1. Tokenizer receives `\x0b`
2. State machine recognizes this as a control character (not an escape sequence)
3. No timeout timer needed (complete sequence)

**State after step:**
```javascript
{
  parsedSequence: "\x0b",
  sequenceType: "control_char",
  isComplete: true
}
```

---

### Step 3: Key Event Conversion

**Time:** T+2ms

**Location:** P77() dispatcher → j77() converter (chunks.53.mjs)

**What happens:**
1. `P77()` dispatcher recognizes control character
2. `j77()` converts to KeyboardInputEvent:
   ```javascript
   {
     input: "k",  // Ctrl+K = K character with ctrl modifier
     ctrl: true,
     alt: false,
     shift: false,
     meta: false,
     escape: false,
     return: false,
     tab: false,
     // ... other special keys false
   }
   ```

**State after step:**
```javascript
{
  keyEvent: {
    input: "k",
    ctrl: true,
    alt: false,
    shift: false,
    meta: false
  }
}
```

---

### Step 4: Event Dispatching

**Time:** T+3ms

**Location:** qK9() event dispatcher (chunks.72.mjs)

**What happens:**
1. Creates InputEvent object
2. Wraps in React discreteUpdates() for batching
3. Emits to Ink app event system

**State after step:**
```javascript
{
  event: {
    type: "input",
    input: "k",
    ctrl: true,
    alt: false,
    shift: false,
    meta: false
  },
  dispatched: true
}
```

---

### Step 5: Focus Routing

**Time:** T+4ms

**Location:** handleInput() in InternalApp (chunks.73.mjs)

**What happens:**
1. Event arrives at focused component (ChatInput)
2. ChatInput has focus, so it receives the event
3. Event propagates to keybinding handler

**State after step:**
```javascript
{
  focusedComponent: "ChatInput",
  eventTarget: "KeybindingHandler",
  propagationStopped: false
}
```

---

### Step 6: Keybinding Matching (First Keystroke)

**Time:** T+5ms

**Location:** N4Y() KeybindingHandler → Z$1() resolveKeystroke (chunks.117.mjs, chunks.65.mjs)

**What happens:**

1. **Normalize event to keystroke:**
   ```javascript
   // Hl3(eventToKeystroke)
   const keystroke = {
     key: "k",
     ctrl: true,
     alt: false,
     shift: false,
     meta: false
   };
   ```

2. **Build current sequence:**
   ```javascript
   const pendingChord = null; // No chord in progress yet
   const currentSequence = [keystroke]; // New sequence
   ```

3. **Filter bindings by context:**
   ```javascript
   const activeContexts = ["Global", "Chat"];
   const contextualBindings = allBindings.filter(b =>
     activeContexts.includes(b.context)
   );
   // Result: All Global and Chat bindings
   ```

4. **Check for prefix match:**
   ```javascript
   // jl3(isPrefixMatch)
   const hasPrefix = contextualBindings.some(binding =>
     binding.chord.length > currentSequence.length && // chord length = 2 > 1
     isPrefixMatch(currentSequence, binding) // [ctrl+k] is prefix of [ctrl+k, ctrl+c]
   );
   // hasPrefix = true!
   ```

5. **Return result:**
   ```javascript
   return {
     type: "chord_started",
     pending: [{ key: "k", ctrl: true, alt: false, shift: false, meta: false }]
   };
   ```

**State after step:**
```javascript
{
  matchType: "chord_started",
  pendingChord: [{ key: "k", ctrl: true, ... }],
  chordTimer: setTimeout(() => cancelChord(), 1000), // 1 second timeout
  actionExecuted: false
}
```

---

### Step 7: Chord Timer Started

**Time:** T+6ms

**Location:** setPendingChord() in KeybindingSetup (chunks.110.mjs:956-961)

**What happens:**
1. Timer started: 1000ms countdown
2. Pending chord state updated in React
3. Visual indicator shown to user (optional): "Ctrl+K-"

**State after step:**
```javascript
{
  pendingChordRef.current: [{ key: "k", ctrl: true, ... }],
  pendingChordState: [{ key: "k", ctrl: true, ... }], // React state
  timerRef.current: <setTimeout handle>,
  timerExpiration: T+1006ms
}
```

---

### USER WAITS 300ms, then presses Ctrl+C

---

### Step 8: Terminal Input Capture (Second Keystroke: Ctrl+C)

**Time:** T+306ms (300ms after first key)

**Location:** InternalApp.handleReadable() (chunks.73.mjs)

**What happens:**
1. stdin.read() returns raw bytes: `\x03` (ASCII 3, Ctrl+C)
2. **NOTE:** Normally Ctrl+C sends SIGINT, but in raw mode it's just data

**State after step:**
```javascript
{
  rawInput: "\x03",
  keyParseState: "ground",
  pendingChord: [{ key: "k", ctrl: true, ... }] // Still pending!
}
```

---

### Step 9-11: ANSI Parsing, Conversion, Dispatching (Second Keystroke)

**Time:** T+307-309ms

**Same process as Steps 2-4, result:**
```javascript
{
  keyEvent: {
    input: "c",
    ctrl: true,
    alt: false,
    shift: false,
    meta: false
  }
}
```

---

### Step 12: Keybinding Matching (Second Keystroke - MATCH!)

**Time:** T+310ms

**Location:** x6Y() KeybindingHandler → tK6() resolveKeystroke

**What happens:**

1. **Clear existing chord timer:**
   ```javascript
   clearTimeout(timerRef.current); // Cancel 1000ms timeout
   ```

2. **Normalize event:**
   ```javascript
   const keystroke = {
     key: "c",
     ctrl: true,
     alt: false,
     shift: false,
     meta: false
   };
   ```

3. **Build sequence with pending chord:**
   ```javascript
   const pendingChord = [{ key: "k", ctrl: true, ... }];
   const currentSequence = [...pendingChord, keystroke];
   // currentSequence = [ctrl+k, ctrl+c]
   ```

4. **Filter by context:**
   ```javascript
   const contextualBindings = allBindings.filter(b =>
     ["Global", "Chat"].includes(b.context)
   );
   ```

5. **Check for exact match:**
   ```javascript
   // Jl3(isExactMatch)
   for (let binding of contextualBindings) {
     if (isExactMatch(currentSequence, binding)) {
       matchedBinding = binding;
       // Found: {
       //   chord: [{ key: "k", ctrl: true, ... }, { key: "c", ctrl: true, ... }],
       //   action: "clear_history",
       //   context: "Chat"
       // }
     }
   }
   ```

6. **Return match:**
   ```javascript
   return {
     type: "match",
     action: "clear_history"
   };
   ```

**State after step:**
```javascript
{
  matchType: "match",
  action: "clear_history",
  pendingChord: null, // Cleared after match
  chordTimer: null // Timer cleared
}
```

---

### Step 13: Action Execution

**Time:** T+311ms

**Location:** N4Y() KeybindingHandler, lines 1012-1026 (chunks.117.mjs)

**What happens:**

1. **Reset pending chord:**
   ```javascript
   setPendingChord(null); // Clear visual indicator
   ```

2. **Lookup handler in registry:**
   ```javascript
   const registry = handlerRegistryRef.current; // Map<action → Set<{context, handler}>>
   const handlers = registry.get("clear_history");
   // handlers = Set([
   //   { context: "Chat", handler: clearHistoryFn },
   //   { context: "Global", handler: globalClearFn }
   // ])
   ```

3. **Filter by active contexts:**
   ```javascript
   const activeContexts = new Set(["Global", "Chat"]);
   for (let handlerEntry of handlers) {
     if (activeContexts.has(handlerEntry.context)) {
       // Found Chat context handler
       handlerEntry.handler(); // Execute!
       event.stopImmediatePropagation();
       break; // First match wins
     }
   }
   ```

4. **Handler executes:**
   ```javascript
   function clearHistoryFn() {
     // Clear messages from state
     setMessages([]);
     // Show confirmation toast
     showToast("Chat history cleared");
   }
   ```

**State after step:**
```javascript
{
  messages: [], // Cleared!
  pendingChord: null,
  actionExecuted: true,
  handlerResult: undefined // Fire-and-forget, no return value
}
```

---

## Complete State Timeline

| Time | Step | State | Pending Chord | Match Type |
|------|------|-------|---------------|------------|
| T+0ms | 1 | stdin receives `\x0b` | `null` | - |
| T+1ms | 2 | ANSI parsed | `null` | - |
| T+2ms | 3 | Converted to {ctrl:true, key:"k"} | `null` | - |
| T+5ms | 6 | Keystroke matched | `[ctrl+k]` | `chord_started` |
| T+6ms | 7 | Timer started (1000ms) | `[ctrl+k]` | - |
| T+306ms | 8 | stdin receives `\x03` | `[ctrl+k]` | - |
| T+310ms | 12 | Second keystroke matched | `null` | `match` |
| T+311ms | 13 | Action executed | `null` | - |

**Total latency:** 311ms from first keypress to action execution (including 300ms user delay)

**System latency:** ~11ms (T+311ms - T+300ms user delay)

---

## Alternative Scenarios

### Scenario A: User Waits Too Long (Timeout)

**If user presses Ctrl+K but waits >1000ms before Ctrl+C:**

```
T+0ms:    Press Ctrl+K
T+5ms:    Match type = "chord_started", timer started
T+1006ms: Timer expires → setPendingChord(null)
T+1500ms: Press Ctrl+C
T+1505ms: Match type = "none" (no pending chord, ctrl+c alone doesn't match)
```

**Result:** Nothing happens. User must re-press Ctrl+K.

---

### Scenario B: User Presses Escape (Cancel Chord)

**If user presses Ctrl+K then Escape:**

```
T+0ms:  Press Ctrl+K
T+5ms:  Match type = "chord_started"
T+300ms: Press Escape
T+305ms: Escape detected in resolveKeystroke()
         → if (keyEvent.escape && pendingChord !== null) return {type: "chord_cancelled"}
```

**Result:** Chord cancelled, pending state cleared.

---

### Scenario C: Hot-Reload During Chord

**If keybindings.json is saved while chord is pending:**

```
T+0ms:   Press Ctrl+K
T+5ms:   Match type = "chord_started", pending = [ctrl+k]
T+300ms: User saves keybindings.json, removing "ctrl+k ctrl+c" binding
T+305ms: Nq7() file change handler runs, reloads bindings
T+310ms: cachedBindings updated (no ctrl+k ctrl+c anymore)
T+500ms: User presses Ctrl+C
T+505ms: resolveKeystroke() checks new bindings
         → No exact match found (binding was removed)
         → Returns {type: "chord_cancelled"} because pendingChord !== null
```

**Result:** Chord cancelled due to removed binding. Hot-reload takes effect immediately.

---

## Performance Considerations

**Bottlenecks:**
1. **ANSI parsing:** ~1ms (state machine is fast)
2. **Binding filter:** O(n) where n = number of bindings (~100 default)
3. **Prefix matching:** O(n*m) where n = bindings, m = sequence length (~2-3)
4. **Handler lookup:** O(1) Map access + O(k) Set iteration where k = handlers per action (~1-2)

**Total system overhead:** ~5-10ms per keystroke

**Optimizations:**
- Bindings cached (not re-parsed on every keystroke)
- Context filtering reduces matching set
- Ref-based state (pendingChordRef) avoids React re-renders during typing
- Handler registry uses Map+Set for fast lookup

---

## Debugging This Flow

**To trace a keystroke through the system:**

1. **Enable debug logging:**
   ```javascript
   // In chunks.54.mjs, chunks.110.mjs
   const DEBUG = true;
   ```

2. **Add breakpoints:**
   - `handleReadable()` - Terminal input
   - `resolveKeystroke()` - Matching logic
   - `KeybindingHandler` execution block - Action dispatch

3. **Inspect state:**
   ```javascript
   console.log("Pending chord:", pendingChordRef.current);
   console.log("Active contexts:", [...activeContexts]);
   console.log("Match result:", matchResult);
   ```

4. **Check validation:**
   ```bash
   # In Claude Code CLI
   /doctor
   # Shows keybinding warnings
   ```

---

## Key Takeaways

1. **Chord support adds complexity:** Prefix matching requires maintaining pending state and timers
2. **Context filtering is crucial:** Only active contexts participate in matching
3. **Ref + State pattern:** pendingChordRef (sync access) + pendingChordState (React updates)
4. **Hot-reload is seamless:** Pending chords validated against latest bindings
5. **First-match-wins:** Handler dispatch stops after first active context match
6. **Fire-and-forget handlers:** No async/await, no return values, pure side effects
7. **Low latency:** System overhead is ~5-10ms, most delay is network/render time

This complete lifecycle walkthrough demonstrates how a simple chord input (`Ctrl+K Ctrl+C`) traverses **13 distinct steps** across **7 major subsystems** to execute an action, with careful state management and performance optimizations throughout.
