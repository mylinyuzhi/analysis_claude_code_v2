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
- **Chord support**: Multi-keystroke sequences with timeout mechanism
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
- `P77` - ANSI tokenizer and paste mode detector
- `j77` - Key sequence parser (ANSI to key object)
- `dN5` - Key object to React event converter
- `pC1` (InputEvent class) - Keyboard input event type
- `resolveKeystroke` (tK6) - Main keybinding matching function
- `parseKeystroke` (iC1) - Converts keystroke string to object
- `eventToKeystroke` (sN5) - Converts DOM event to keystroke object
- `KeybindingHandler` (x6Y) - React component for keybinding dispatch
- `M77` - Initial parser state constant

---

## 1. Terminal Input Capture

When the TUI starts, `InternalApp` enables raw mode on stdin to receive individual keystrokes without line buffering.

### Raw Mode Initialization

```javascript
// ============================================
// handleSetRawMode - Manages terminal raw mode state
// Location: chunks.73.mjs:98-118
// ============================================

// ORIGINAL (for source lookup):
handleSetRawMode = (A) => {
    let {stdin: q} = this.props;
    if (!this.isRawModeSupported()) throw Error(...);
    if (q.setEncoding("utf8"), A) {
        if (this.rawModeEnabledCount === 0) {
            if (yr(), q.ref(), q.setRawMode(!0), q.addListener("readable", this.handleReadable), this.props.stdout.write(N77), this.props.stdout.write(hqA), Wv7.includes(xA.terminal ?? "")) this.props.stdout.write(GA7)
        }
        this.rawModeEnabledCount++;
        return
    }
    if (--this.rawModeEnabledCount === 0) {
        if (Wv7.includes(xA.terminal ?? "")) this.props.stdout.write(e_1);
        this.props.stdout.write(T71), this.props.stdout.write(VJ1), q.setRawMode(!1), q.removeListener("readable", this.handleReadable), q.unref()
    }
};

// READABLE (for understanding):
handleSetRawMode = (enableRawMode) => {
    let {stdin} = this.props;
    if (!this.isRawModeSupported()) throw Error("Raw mode not supported");

    stdin.setEncoding("utf8");

    if (enableRawMode) {
        if (this.rawModeEnabledCount === 0) {
            initYoga();
            stdin.ref();
            stdin.setRawMode(true);
            stdin.addListener("readable", this.handleReadable);

            // Send terminal control sequences
            this.props.stdout.write(CURSOR_HIDE);
            this.props.stdout.write(ALTERNATE_SCREEN_ENTER);
            if (KITTY_TERMINALS.includes(env.terminal ?? "")) {
                this.props.stdout.write(KITTY_GRAPHICS_MODE);
            }
        }
        this.rawModeEnabledCount++;
    } else {
        if (--this.rawModeEnabledCount === 0) {
            if (KITTY_TERMINALS.includes(env.terminal ?? "")) {
                this.props.stdout.write(KITTY_GRAPHICS_EXIT);
            }
            this.props.stdout.write(SHOW_CURSOR);
            this.props.stdout.write(SCREEN_RESTORE);
            stdin.setRawMode(false);
            stdin.removeListener("readable", this.handleReadable);
            stdin.unref();
        }
    }
};

// Mapping: A→enableRawMode, q→stdin, N77→CURSOR_HIDE, hqA→ALTERNATE_SCREEN_ENTER, GA7→KITTY_GRAPHICS_MODE, e_1→KITTY_GRAPHICS_EXIT, T71→SHOW_CURSOR, VJ1→SCREEN_RESTORE
```

**What it does:** Manages terminal raw mode state with reference counting to handle nested enable/disable calls.

**How it works:**
1. Validates raw mode support on stdin (must be a TTY)
2. Sets UTF-8 encoding to properly handle Unicode input
3. On first enable: refs stdin, enables raw mode, attaches readable listener, sends terminal setup sequences
4. Uses reference counting to support nested raw mode requests (multiple components can request raw mode)
5. On final disable: cleans up listeners, disables raw mode, unrefs stdin
6. Sends platform-specific sequences for Kitty terminals

**Why this approach:**
- **Reference counting**: Allows multiple UI components to independently request raw mode without conflicts
- **Platform detection**: Kitty terminals need special graphics mode sequences
- **Defensive cleanup**: Always pairs setup with teardown to avoid leaving terminal in broken state
- **UTF-8 encoding**: Critical for international keyboard input and emoji support

**Key insight:** The reference counting pattern prevents race conditions when multiple React components mount/unmount and need raw mode. Without this, a component unmounting could disable raw mode while another component still needs it.

---

### Stdin Read Loop

```javascript
// ============================================
// handleReadable - Stdin readable event handler
// Location: chunks.73.mjs:131-134
// ============================================

// ORIGINAL (for source lookup):
handleReadable = () => {
    let A;
    while ((A = this.props.stdin.read()) !== null) this.processInput(A)
};

// READABLE (for understanding):
handleReadable = () => {
    let chunk;
    while ((chunk = this.props.stdin.read()) !== null) {
        this.processInput(chunk);
    }
};

// Mapping: A→chunk
```

**What it does:** Drains all available data from stdin when readable event fires.

**How it works:**
1. Called by Node.js when stdin has data available
2. Reads chunks in a loop until stdin.read() returns null
3. Passes each chunk to processInput for ANSI parsing

**Why this approach:**
- **Loop until null**: Ensures all buffered data is consumed in one event loop tick
- **Non-blocking reads**: read() returns null when buffer is empty, preventing blocking
- **Efficient batch processing**: Multiple keystrokes in paste or rapid typing are processed together

**Key insight:** The while loop is critical for performance during paste operations. Without it, each keystroke would require a separate event loop iteration, causing lag during bulk input.

---

## 2. ANSI Escape Sequence Parsing

Raw terminal input contains ANSI escape sequences (e.g., `\x1b[A` for up arrow). The parser tokenizes these into structured events.

### Parser State Machine

```javascript
// ============================================
// M77 - Initial parser state
// Location: chunks.53.mjs:2481-2485
// ============================================

// ORIGINAL (for source lookup):
M77 = {
    mode: "NORMAL",
    incomplete: "",
    pasteBuffer: ""
};

// READABLE (for understanding):
INITIAL_PARSER_STATE = {
    mode: "NORMAL",          // or "IN_PASTE"
    incomplete: "",          // Buffered incomplete escape sequence
    pasteBuffer: ""          // Accumulated paste content
};

// Mapping: M77→INITIAL_PARSER_STATE
```

**What it does:** Defines the initial state for the keystroke parser.

**How it works:**
- **mode**: Tracks whether we're in normal mode or paste mode (bracket paste)
- **incomplete**: Holds partial escape sequences that arrived at chunk boundary
- **pasteBuffer**: Accumulates characters between paste start/end markers

**Why this approach:**
- **Stateful parsing**: ANSI sequences can span multiple stdin chunks
- **Paste mode tracking**: Prevents processing individual keys during paste
- **Clean initialization**: Provides well-defined starting state

**Key insight:** The state machine approach allows graceful handling of incomplete sequences at chunk boundaries, which is common with slow SSH connections or large pastes.

---

### Main Parsing Dispatcher

```javascript
// ============================================
// processInput - Main input processing dispatcher
// Location: chunks.73.mjs:123-130
// ============================================

// ORIGINAL (for source lookup):
processInput = (A) => {
    let [q, K] = P77(this.keyParseState, A);
    if (this.keyParseState = K, q.length > 0) ag.discreteUpdates(qK9, this, q, void 0, void 0);
    if (this.keyParseState.incomplete) {
        if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer);
        this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.keyParseState.mode === "IN_PASTE" ? this.PASTE_TIMEOUT : this.NORMAL_TIMEOUT)
    }
};

// READABLE (for understanding):
processInput = (chunk) => {
    let [events, newState] = parseKeystrokesWithState(this.keyParseState, chunk);
    this.keyParseState = newState;

    if (events.length > 0) {
        React.discreteUpdates(dispatchInputEvents, this, events, undefined, undefined);
    }

    if (this.keyParseState.incomplete) {
        if (this.incompleteEscapeTimer) {
            clearTimeout(this.incompleteEscapeTimer);
        }

        const timeout = this.keyParseState.mode === "IN_PASTE"
            ? this.PASTE_TIMEOUT     // 500ms
            : this.NORMAL_TIMEOUT;    // 50ms

        this.incompleteEscapeTimer = setTimeout(
            this.flushIncomplete,
            timeout
        );
    }
};

// Mapping: A→chunk, q→events, K→newState, ag.discreteUpdates→React.discreteUpdates, qK9→dispatchInputEvents, P77→parseKeystrokesWithState
```

**What it does:** Orchestrates ANSI parsing and event dispatching with incomplete sequence handling.

**How it works:**
1. Calls parser with current state + new chunk
2. Parser returns array of keyboard events + new state
3. Updates state for next call
4. Dispatches events to React using discreteUpdates (batches updates)
5. If sequence incomplete, sets timeout to flush later

**Why this approach:**
- **State preservation**: Parser state persists across chunks to handle split sequences
- **Timeout-based flushing**: If sequence never completes (corrupt data), timer forces flush
- **Separate paste timeout**: Paste operations get longer timeout (500ms vs 50ms) to handle bulk data
- **React batching**: discreteUpdates ensures all events processed in one React update cycle

**Key insight:** The dual timeout strategy is critical: 50ms for normal keystrokes allows quick recovery from malformed sequences, while 500ms for paste prevents truncating large clipboard operations. This balances responsiveness with data integrity.

---

### Tokenizer and Paste Detection

```javascript
// ============================================
// P77 - ANSI tokenizer and paste mode detector
// Location: chunks.53.mjs:2287-2312
// ============================================

// ORIGINAL (for source lookup):
function P77(A, q = "") {
    let K = q === null,
        Y = K ? "" : FN5(q),
        z = A._tokenizer ?? AJ1(),
        w = K ? z.flush() : z.feed(Y),
        H = [],
        $ = A.mode === "IN_PASTE",
        O = A.pasteBuffer;
    for (let J of w)
        if (J.type === "sequence")
            if (J.value === jA7) $ = !0, O = "";
            else if (J.value === MA7) H.push(D77(O)), $ = !1, O = "";
    else if ($) O += J.value;
    else H.push(j77(J.value));
    else if (J.type === "text")
        if ($) O += J.value;
        else H.push(j77(J.value));
    if (K && $ && O) H.push(D77(O)), $ = !1, O = "";
    let _ = {
        mode: $ ? "IN_PASTE" : "NORMAL",
        incomplete: z.buffer(),
        pasteBuffer: O,
        _tokenizer: z
    };
    return [H, _]
}

// READABLE (for understanding):
function parseKeystrokesWithState(parserState, chunk = "") {
    const isFlushing = chunk === null;
    const normalizedChunk = isFlushing ? "" : normalizeBuffer(chunk);

    const tokenizer = parserState._tokenizer ?? createANSITokenizer();
    const tokens = isFlushing
        ? tokenizer.flush()
        : tokenizer.feed(normalizedChunk);

    const events = [];
    let inPasteMode = parserState.mode === "IN_PASTE";
    let pasteBuffer = parserState.pasteBuffer;

    for (let token of tokens) {
        if (token.type === "sequence") {
            if (token.value === PASTE_START_SEQUENCE) {
                // \x1b[200~ - Bracket paste start
                inPasteMode = true;
                pasteBuffer = "";
            } else if (token.value === PASTE_END_SEQUENCE) {
                // \x1b[201~ - Bracket paste end
                events.push(createPasteEvent(pasteBuffer));
                inPasteMode = false;
                pasteBuffer = "";
            } else if (inPasteMode) {
                pasteBuffer += token.value;
            } else {
                events.push(parseKeySequence(token.value));
            }
        } else if (token.type === "text") {
            if (inPasteMode) {
                pasteBuffer += token.value;
            } else {
                events.push(parseKeySequence(token.value));
            }
        }
    }

    // Force flush incomplete paste on explicit flush
    if (isFlushing && inPasteMode && pasteBuffer) {
        events.push(createPasteEvent(pasteBuffer));
        inPasteMode = false;
        pasteBuffer = "";
    }

    const newState = {
        mode: inPasteMode ? "IN_PASTE" : "NORMAL",
        incomplete: tokenizer.buffer(),
        pasteBuffer: pasteBuffer,
        _tokenizer: tokenizer
    };

    return [events, newState];
}

// Mapping: P77→parseKeystrokesWithState, A→parserState, q→chunk, K→isFlushing, Y→normalizedChunk, z→tokenizer, w→tokens, H→events, $→inPasteMode, O→pasteBuffer, J→token, FN5→normalizeBuffer, AJ1→createANSITokenizer, jA7→PASTE_START_SEQUENCE, MA7→PASTE_END_SEQUENCE, D77→createPasteEvent, j77→parseKeySequence
```

**What it does:** Tokenizes ANSI input and detects bracket paste mode to handle bulk text separately.

**How it works:**
1. Normalizes input buffer to string
2. Feeds chunk to stateful ANSI tokenizer (or flushes if chunk is null)
3. Processes tokens in sequence:
   - `\x1b[200~`: Enters paste mode, starts buffering
   - `\x1b[201~`: Exits paste mode, emits paste event
   - Regular keys: Parsed individually (unless in paste mode)
4. Returns events array + new state with tokenizer for next call

**Why this approach:**
- **Bracket paste protocol**: Terminals send special sequences around pasted content
- **Bulk handling**: Paste events contain entire clipboard, not individual keystrokes
- **State preservation**: Tokenizer persists to handle split sequences
- **Explicit flush**: Passing null forces incomplete data to be processed
- **Mode tracking**: Prevents processing individual keys during paste

**Key insight:** Bracket paste mode is essential for performance and correctness. Without it, pasting 1000 characters would trigger 1000 individual keyboard events, causing massive lag and potentially triggering keybindings unintentionally (e.g., pasted code containing "ctrl+k" patterns).

---

## 3. Key Event Conversion

ANSI sequences are converted to structured key events with normalized names and modifiers.

### Sequence to Key Object Parser

```javascript
// ============================================
// j77 - Key sequence parser (ANSI to key object)
// Location: chunks.53.mjs:2375-2455
// ============================================

// ORIGINAL (for source lookup):
function j77(A = "") {
    let q, K = {
        name: "", fn: !1, ctrl: !1, meta: !1, shift: !1, option: !1,
        sequence: A, raw: A, isPasted: !1
    };
    K.sequence = K.sequence || A || K.name;
    let Y;
    if (Y = mN5.exec(A)) {
        let z = parseInt(Y[1], 10),
            w = Y[2] ? parseInt(Y[2], 10) : 1,
            H = UN5(w);
        return {
            name: pN5(z), fn: !1, ctrl: H.ctrl, meta: H.meta, shift: H.shift,
            option: !1, sequence: A, raw: A, isPasted: !1
        }
    }
    if (A === "\r") K.raw = void 0, K.name = "return";
    else if (A === "\n") K.name = "enter";
    else if (A === "\t") K.name = "tab";
    else if (A === "\b" || A === "\x1B\b") K.name = "backspace", K.meta = A.charAt(0) === "\x1B";
    else if (A === "\x7F" || A === "\x1B\x7F") K.name = "backspace", K.meta = A.charAt(0) === "\x1B";
    else if (A === "\x1B" || A === "\x1B\x1B") K.name = "escape", K.meta = A.length === 2;
    else if (A === " " || A === "\x1B ") K.name = "space", K.meta = A.length === 2;
    else if (A === "\x1F") K.name = "_", K.ctrl = !0;
    else if (A <= "\x1A" && A.length === 1) K.name = String.fromCharCode(A.charCodeAt(0) + 97 - 1), K.ctrl = !0;
    else if (A.length === 1 && A >= "0" && A <= "9") K.name = "number";
    else if (A.length === 1 && A >= "a" && A <= "z") K.name = A;
    else if (A.length === 1 && A >= "A" && A <= "Z") K.name = A.toLowerCase(), K.shift = !0;
    else if (q = uN5.exec(A)) K.meta = !0, K.shift = /^[A-Z]$/.test(q[1]);
    else if (q = BN5.exec(A)) {
        let z = [...A];
        if (z[0] === "\x1B" && z[1] === "\x1B") K.option = !0;
        let w = [q[1], q[2], q[4], q[6]].filter(Boolean).join(""),
            H = (q[3] || q[5] || 1) - 1;
        K.ctrl = !!(H & 4), K.meta = !!(H & 10), K.shift = !!(H & 1),
        K.code = w, K.name = W77[w],
        K.shift = QN5(w) || K.shift, K.ctrl = gN5(w) || K.ctrl
    }
    if (K.raw === "\x1Bb") K.meta = !0, K.name = "left";
    else if (K.raw === "\x1Bf") K.meta = !0, K.name = "right";
    // ... switch for special sequences ...
    return K
}

// READABLE (for understanding):
function parseKeySequence(sequence = "") {
    let match, keyEvent = {
        name: "",
        fn: false,
        ctrl: false,
        meta: false,
        shift: false,
        option: false,
        sequence: sequence,
        raw: sequence,
        isPasted: false
    };

    keyEvent.sequence = keyEvent.sequence || sequence || keyEvent.name;

    // Match CSI u protocol (modern kitty/wezterm)
    // \x1b[{code};{modifiers}u
    if (match = CSI_U_REGEX.exec(sequence)) {
        const keyCode = parseInt(match[1], 10);
        const modifierBits = match[2] ? parseInt(match[2], 10) : 1;
        const modifiers = parseModifierBits(modifierBits);

        return {
            name: keyCodeToName(keyCode),
            fn: false,
            ctrl: modifiers.ctrl,
            meta: modifiers.meta,
            shift: modifiers.shift,
            option: false,
            sequence: sequence,
            raw: sequence,
            isPasted: false
        };
    }

    // Simple character mappings
    if (sequence === "\r") {
        keyEvent.raw = undefined;
        keyEvent.name = "return";
    } else if (sequence === "\n") {
        keyEvent.name = "enter";
    } else if (sequence === "\t") {
        keyEvent.name = "tab";
    } else if (sequence === "\b" || sequence === "\x1B\b") {
        keyEvent.name = "backspace";
        keyEvent.meta = sequence.charAt(0) === "\x1B";
    } else if (sequence === "\x7F" || sequence === "\x1B\x7F") {
        keyEvent.name = "backspace";
        keyEvent.meta = sequence.charAt(0) === "\x1B";
    } else if (sequence === "\x1B" || sequence === "\x1B\x1B") {
        keyEvent.name = "escape";
        keyEvent.meta = sequence.length === 2;
    } else if (sequence === " " || sequence === "\x1B ") {
        keyEvent.name = "space";
        keyEvent.meta = sequence.length === 2;
    } else if (sequence === "\x1F") {
        keyEvent.name = "_";
        keyEvent.ctrl = true;
    }
    // Ctrl+A through Ctrl+Z (\x01 - \x1A)
    else if (sequence <= "\x1A" && sequence.length === 1) {
        keyEvent.name = String.fromCharCode(sequence.charCodeAt(0) + 97 - 1);
        keyEvent.ctrl = true;
    }
    // Single digit
    else if (sequence.length === 1 && sequence >= "0" && sequence <= "9") {
        keyEvent.name = "number";
    }
    // Lowercase letter
    else if (sequence.length === 1 && sequence >= "a" && sequence <= "z") {
        keyEvent.name = sequence;
    }
    // Uppercase letter
    else if (sequence.length === 1 && sequence >= "A" && sequence <= "Z") {
        keyEvent.name = sequence.toLowerCase();
        keyEvent.shift = true;
    }
    // Alt+key (\x1b{key})
    else if (match = ALT_KEY_REGEX.exec(sequence)) {
        keyEvent.meta = true;
        keyEvent.shift = /^[A-Z]$/.test(match[1]);
    }
    // Complex ANSI sequence (arrows, function keys, etc.)
    else if (match = ANSI_SEQ_REGEX.exec(sequence)) {
        const chars = [...sequence];
        if (chars[0] === "\x1B" && chars[1] === "\x1B") {
            keyEvent.option = true;
        }

        const code = [match[1], match[2], match[4], match[6]]
            .filter(Boolean)
            .join("");
        const modifierBits = (match[3] || match[5] || 1) - 1;

        keyEvent.ctrl = !!(modifierBits & 4);
        keyEvent.meta = !!(modifierBits & 10);
        keyEvent.shift = !!(modifierBits & 1);
        keyEvent.code = code;
        keyEvent.name = ANSI_CODE_TO_KEY_NAME[code];

        // Platform-specific overrides
        keyEvent.shift = requiresShift(code) || keyEvent.shift;
        keyEvent.ctrl = requiresCtrl(code) || keyEvent.ctrl;
    }

    // Platform-specific alt+arrow mappings
    if (keyEvent.raw === "\x1Bb") {
        keyEvent.meta = true;
        keyEvent.name = "left";
    } else if (keyEvent.raw === "\x1Bf") {
        keyEvent.meta = true;
        keyEvent.name = "right";
    }

    return keyEvent;
}

// Mapping: j77→parseKeySequence, A→sequence, q→match, K→keyEvent, Y→match, mN5→CSI_U_REGEX, UN5→parseModifierBits, pN5→keyCodeToName, uN5→ALT_KEY_REGEX, BN5→ANSI_SEQ_REGEX, W77→ANSI_CODE_TO_KEY_NAME, QN5→requiresShift, gN5→requiresCtrl
```

**What it does:** Converts ANSI escape sequences to structured key events with normalized names and modifiers.

**How it works:**
1. **CSI u protocol**: Modern terminals send `\x1b[{code};{modifiers}u` (parsed first for speed)
2. **Simple mappings**: Direct character matches (return, enter, tab, etc.)
3. **Control characters**: \x01-\x1A map to Ctrl+A through Ctrl+Z
4. **Digits/letters**: Normalized to lowercase with shift flag
5. **Alt+key**: Escape prefix (\x1b) indicates meta/alt modifier
6. **ANSI sequences**: Complex regex parses arrow keys, function keys, home/end, etc.
7. **Modifier bits**: Encoded in sequence, extracted via bitwise operations
8. **Platform quirks**: Special handling for macOS alt+arrow (different sequences)

**Why this approach:**
- **CSI u priority**: Modern protocol is fastest to parse, checked first
- **Normalization**: Always lowercase names with shift flag for consistency
- **Modifier extraction**: Bitwise operations decode compact modifier encoding
- **Fallback chain**: Handles both modern and legacy terminal protocols
- **Platform detection**: macOS sends different sequences for alt+arrow

**Key insight:** The parser handles 3 generations of terminal protocols: legacy ANSI (1980s), XTerm extensions (1990s), and modern CSI u (2020s). This ensures compatibility across all terminals while optimizing for modern ones.

---

### Event Object Conversion

```javascript
// ============================================
// dN5 - Key object to React event converter
// Location: chunks.53.mjs:2558-2585
// ============================================

// ORIGINAL (for source lookup):
function dN5(A) {
    let q = {
            upArrow: A.name === "up",
            downArrow: A.name === "down",
            leftArrow: A.name === "left",
            rightArrow: A.name === "right",
            pageDown: A.name === "pagedown",
            pageUp: A.name === "pageup",
            home: A.name === "home",
            end: A.name === "end",
            return: A.name === "return",
            escape: A.name === "escape",
            fn: A.fn,
            ctrl: A.ctrl,
            shift: A.shift,
            tab: A.name === "tab",
            backspace: A.name === "backspace",
            delete: A.name === "delete",
            meta: A.meta || A.name === "escape" || A.option
        },
        K = A.ctrl ? A.name : A.sequence;
    if (K === void 0) K = "";
    if (A.name && G77.includes(A.name)) K = "";
    if (K.startsWith("\x1B")) K = K.slice(1);
    if (K.startsWith("[") && K.endsWith("u") && A.name) K = A.name === "space" ? " " : A.name;
    if (K.length === 1 && typeof K[0] === "string" && K[0] >= "A" && K[0] <= "Z") q.shift = !0;
    return [q, K]
}

// READABLE (for understanding):
function convertKeyObjectToEvent(keyObject) {
    // Create React-compatible event object with boolean flags
    const eventFlags = {
        upArrow: keyObject.name === "up",
        downArrow: keyObject.name === "down",
        leftArrow: keyObject.name === "left",
        rightArrow: keyObject.name === "right",
        pageDown: keyObject.name === "pagedown",
        pageUp: keyObject.name === "pageup",
        home: keyObject.name === "home",
        end: keyObject.name === "end",
        return: keyObject.name === "return",
        escape: keyObject.name === "escape",
        fn: keyObject.fn,
        ctrl: keyObject.ctrl,
        shift: keyObject.shift,
        tab: keyObject.name === "tab",
        backspace: keyObject.name === "backspace",
        delete: keyObject.name === "delete",
        meta: keyObject.meta || keyObject.name === "escape" || keyObject.option
    };

    // Determine input string
    // For Ctrl+key, use key name; otherwise use sequence
    let inputString = keyObject.ctrl ? keyObject.name : keyObject.sequence;

    if (inputString === undefined) {
        inputString = "";
    }

    // Special keys don't produce input
    if (keyObject.name && SPECIAL_KEY_NAMES.includes(keyObject.name)) {
        inputString = "";
    }

    // Strip escape prefix for meta keys
    if (inputString.startsWith("\x1B")) {
        inputString = inputString.slice(1);
    }

    // CSI u protocol cleanup
    if (inputString.startsWith("[") && inputString.endsWith("u") && keyObject.name) {
        inputString = keyObject.name === "space" ? " " : keyObject.name;
    }

    // Detect uppercase for shift flag
    if (inputString.length === 1 &&
        typeof inputString[0] === "string" &&
        inputString[0] >= "A" && inputString[0] <= "Z") {
        eventFlags.shift = true;
    }

    return [eventFlags, inputString];
}

// Mapping: dN5→convertKeyObjectToEvent, A→keyObject, q→eventFlags, K→inputString, G77→SPECIAL_KEY_NAMES
```

**What it does:** Converts parsed key object to React event format with boolean flags and input string.

**How it works:**
1. Creates object with boolean flags for each special key and modifier
2. Determines input string: use key name for Ctrl+key, sequence otherwise
3. Clears input for special keys (arrows, function keys, etc.)
4. Strips escape prefix from meta keys
5. Normalizes CSI u protocol input strings
6. Detects uppercase letters to set shift flag

**Why this approach:**
- **Boolean flags**: React components can easily check `event.upArrow` instead of parsing
- **Input string separation**: Distinguishes "what was pressed" from "what text to insert"
- **Ctrl+key normalization**: "Ctrl+A" produces input "a", not "\x01"
- **Meta key cleanup**: Strips escape prefix so alt+a produces "a" not "\x1ba"
- **Shift detection**: Uppercase letters automatically set shift flag

**Key insight:** The dual-return format (flags + string) enables both behavior handling (arrows, shortcuts) and text input (typing) from the same event. This is why React components can check `if (event.ctrl && input === 'c')` for copy operations.

---

## 4. Event Dispatching

Parsed key events are wrapped in custom Event classes and dispatched through React.

### Event Class Creation

```javascript
// ============================================
// pC1 - InputEvent class (keyboard events)
// Location: chunks.53.mjs:2591-2600
// ============================================

// ORIGINAL (for source lookup):
pC1 = class pC1 extends tg {
    keypress;
    key;
    input;
    constructor(A) {
        super();
        let [q, K] = dN5(A);
        this.keypress = A, this.key = q, this.input = K
    }
}

// READABLE (for understanding):
class InputEvent extends EventBase {
    keypress;  // Original key object from parser
    key;       // Boolean flags object
    input;     // Input string

    constructor(keyObject) {
        super();
        const [eventFlags, inputString] = convertKeyObjectToEvent(keyObject);
        this.keypress = keyObject;
        this.key = eventFlags;
        this.input = inputString;
    }
}

// Mapping: pC1→InputEvent, tg→EventBase, A→keyObject, q→eventFlags, K→inputString, dN5→convertKeyObjectToEvent
```

**What it does:** Wraps parsed key data in a React-compatible Event object.

**How it works:**
1. Extends EventBase (provides stopPropagation, etc.)
2. Stores original key object for debugging
3. Stores processed flags and input string
4. Used by React components to handle keyboard input

**Why this approach:**
- **Event interface**: Compatible with React's synthetic event system
- **Three representations**: Raw (keypress), structured (key), text (input)
- **Debugging aid**: Original keypress preserved for troubleshooting
- **Type safety**: Class structure enables TypeScript checking

**Key insight:** Keeping all three representations (raw, flags, input) enables different use cases: UI components use flags for navigation, text inputs use input string, debugging uses raw keypress.

---

### React Integration

The processInput function uses `React.discreteUpdates` to batch event processing:

```javascript
if (events.length > 0) {
    React.discreteUpdates(dispatchInputEvents, this, events, undefined, undefined);
}
```

**What it does:** Ensures all keyboard events in a batch are processed in a single React render cycle.

**Why this matters:**
- **Performance**: Multiple keystrokes (e.g., from paste) don't trigger multiple re-renders
- **Consistency**: State updates from all events are applied atomically
- **Priority**: discreteUpdates gives keyboard input high priority in React's scheduler

---

## 5. Focus Routing

Events are routed to the currently focused UI component.

### Focus Management

```javascript
// ============================================
// handleInput - Focus system dispatcher
// Location: chunks.73.mjs:135-143
// ============================================

// ORIGINAL (for source lookup):
handleInput = (A) => {
    if (A === "\x03" && this.props.exitOnCtrlC) this.handleExit();
    if (A === eq9 && this.state.activeFocusId) this.setState({
        activeFocusId: void 0
    });
    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (A === sq9) this.focusNext();
        if (A === tq9) this.focusPrevious()
    }
};

// READABLE (for understanding):
handleInput = (input) => {
    // Ctrl+C: Exit if enabled
    if (input === "\x03" && this.props.exitOnCtrlC) {
        this.handleExit();
    }

    // Escape: Clear focus
    if (input === ESCAPE_KEY && this.state.activeFocusId) {
        this.setState({
            activeFocusId: undefined
        });
    }

    // Tab navigation (if focus enabled and focusables exist)
    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (input === TAB_KEY) {
            this.focusNext();
        }
        if (input === SHIFT_TAB_KEY) {
            this.focusPrevious();
        }
    }
};

// Mapping: A→input, eq9→ESCAPE_KEY, sq9→TAB_KEY, tq9→SHIFT_TAB_KEY
```

**What it does:** Handles global keyboard shortcuts and focus navigation before component-specific events.

**How it works:**
1. **Ctrl+C**: Always intercepted for graceful exit
2. **Escape**: Clears active focus, returning to global context
3. **Tab**: Moves focus to next focusable component
4. **Shift+Tab**: Moves focus to previous focusable component

**Why this approach:**
- **Global shortcuts first**: Ensures Ctrl+C always works, even if component handlers fail
- **Escape as focus reset**: Provides universal "cancel" key
- **Tab navigation**: Standard UI pattern for keyboard accessibility
- **Conditional focus**: Only enables tab navigation when focusable components exist

**Key insight:** The focus system provides a stack-like navigation model: components can request focus and become the input target, but Escape always allows "popping" back to global context. This prevents users from getting trapped in focused components.

---

## 6. Keybinding Matching

The keybinding system resolves keystrokes to actions, supporting multi-key chords with context filtering.

### Keystroke Object Format

```javascript
// ============================================
// parseKeystroke - Converts keystroke string to object
// Location: chunks.53.mjs:2752-2808
// ============================================

// ORIGINAL (for source lookup):
function iC1(A) {
    let q = A.split("+"),
        K = {
            key: "",
            ctrl: !1,
            alt: !1,
            shift: !1,
            meta: !1
        };
    for (let Y of q) {
        let z = Y.toLowerCase();
        switch (z) {
            case "ctrl":
            case "control":
                K.ctrl = !0;
                break;
            case "alt":
            case "opt":
            case "option":
                K.alt = !0;
                break;
            case "shift":
                K.shift = !0;
                break;
            case "meta":
            case "cmd":
            case "command":
                K.meta = !0;
                break;
            case "esc":
                K.key = "escape";
                break;
            case "return":
                K.key = "enter";
                break;
            case "space":
                K.key = " ";
                break;
            case "↑":
                K.key = "up";
                break;
            case "↓":
                K.key = "down";
                break;
            case "←":
                K.key = "left";
                break;
            case "→":
                K.key = "right";
                break;
            default:
                K.key = z;
                break
        }
    }
    return K
}

// READABLE (for understanding):
function parseKeystroke(keystrokeString) {
    const parts = keystrokeString.split("+");
    const keystroke = {
        key: "",
        ctrl: false,
        alt: false,
        shift: false,
        meta: false
    };

    for (let part of parts) {
        const normalized = part.toLowerCase();
        switch (normalized) {
            case "ctrl":
            case "control":
                keystroke.ctrl = true;
                break;
            case "alt":
            case "opt":
            case "option":
                keystroke.alt = true;
                break;
            case "shift":
                keystroke.shift = true;
                break;
            case "meta":
            case "cmd":
            case "command":
                keystroke.meta = true;
                break;
            case "esc":
                keystroke.key = "escape";
                break;
            case "return":
                keystroke.key = "enter";
                break;
            case "space":
                keystroke.key = " ";
                break;
            case "↑":
                keystroke.key = "up";
                break;
            case "↓":
                keystroke.key = "down";
                break;
            case "←":
                keystroke.key = "left";
                break;
            case "→":
                keystroke.key = "right";
                break;
            default:
                keystroke.key = normalized;
                break;
        }
    }

    return keystroke;
}

// Mapping: iC1→parseKeystroke, A→keystrokeString, q→parts, K→keystroke, Y→part, z→normalized
```

**What it does:** Converts user-friendly keystroke strings (like "ctrl+k") to structured objects for matching.

**How it works:**
1. Splits string on "+" delimiter
2. Processes each part as either modifier or key
3. Normalizes aliases (ctrl/control, alt/opt/option, cmd/meta)
4. Handles special key names (esc, return, arrows)
5. Lowercases key names for case-insensitive matching

**Why this approach:**
- **User-friendly format**: "ctrl+k" is more readable than `{ctrl: true, key: "k"}`
- **Alias support**: Users can write "cmd" or "meta", "opt" or "alt"
- **Arrow symbols**: Supports both "up" and "↑" for readability
- **Case insensitive**: "Ctrl+K" and "ctrl+k" are equivalent

**Key insight:** The string format makes keybinding files human-editable. Users don't need to know object syntax; they just write "ctrl+shift+p" like they would describe it verbally.

---

### Event to Keystroke Conversion

```javascript
// ============================================
// eventToKeystroke - Converts DOM event to keystroke object
// Location: chunks.53.mjs:2901-2912
// ============================================

// ORIGINAL (for source lookup):
function sN5(A, q) {
    let K = v77(A, q);
    if (!K) return null;
    let Y = q.escape ? !1 : q.meta;
    return {
        key: K,
        ctrl: q.ctrl,
        alt: Y,
        shift: q.shift,
        meta: Y
    }
}

// READABLE (for understanding):
function eventToKeystroke(inputString, eventFlags) {
    const keyName = getKeyNameFromEvent(inputString, eventFlags);
    if (!keyName) return null;

    // Escape key blocks meta/alt
    const hasMetaModifier = eventFlags.escape ? false : eventFlags.meta;

    return {
        key: keyName,
        ctrl: eventFlags.ctrl,
        alt: hasMetaModifier,
        shift: eventFlags.shift,
        meta: hasMetaModifier
    };
}

// Mapping: sN5→eventToKeystroke, A→inputString, q→eventFlags, K→keyName, Y→hasMetaModifier, v77→getKeyNameFromEvent
```

**What it does:** Converts React keyboard event to normalized keystroke object for matching.

**How it works:**
1. Extracts key name from event using helper function
2. Returns null if key is unmatchable (e.g., bare modifiers)
3. Sets meta/alt to false if escape key is pressed
4. Creates keystroke object matching format from parseKeystroke

**Why this approach:**
- **Null for unmatchable**: Prevents matching on lone Shift/Ctrl presses
- **Escape special case**: Escape key itself shouldn't have meta modifier
- **Format consistency**: Output matches parseKeystroke format for easy comparison
- **Both alt and meta**: Some platforms use alt, some use meta (macOS)

**Key insight:** The escape key special case prevents "meta+escape" from existing, which would be impossible to type (pressing escape exits meta mode). This makes the key binding space more intuitive.

---

### Main Matching Algorithm

```javascript
// ============================================
// resolveKeystroke - Main keybinding matching function
// Location: chunks.53.mjs:2942-2979
// ============================================

// ORIGINAL (for source lookup):
function tK6(A, q, K, Y, z) {
    if (q.escape && z !== null) return {
        type: "chord_cancelled"
    };
    let w = sN5(A, q);
    if (!w) {
        if (z !== null) return {
            type: "chord_cancelled"
        };
        return {
            type: "none"
        }
    }
    let H = z ? [...z, w] : [w],
        $ = Y.filter((J) => K.includes(J.context));
    if ($.some((J) => J.chord.length > H.length && tN5(H, J))) return {
        type: "chord_started",
        pending: H
    };
    let _;
    for (let J of $)
        if (eN5(H, J)) _ = J;
    if (_) {
        if (_.action === null) return {
            type: "unbound"
        };
        return {
            type: "match",
            action: _.action
        }
    }
    if (z !== null) return {
        type: "chord_cancelled"
    };
    return {
        type: "none"
    }
}

// READABLE (for understanding):
function resolveKeystroke(inputString, eventFlags, activeContexts, keybindings, pendingChord) {
    // Escape always cancels chords
    if (eventFlags.escape && pendingChord !== null) {
        return {
            type: "chord_cancelled"
        };
    }

    // Convert event to keystroke object
    const currentKeystroke = eventToKeystroke(inputString, eventFlags);
    if (!currentKeystroke) {
        // Unmatchable key (e.g., bare modifier)
        if (pendingChord !== null) {
            return {type: "chord_cancelled"};
        }
        return {type: "none"};
    }

    // Build chord sequence (pending + current)
    const chordSequence = pendingChord
        ? [...pendingChord, currentKeystroke]
        : [currentKeystroke];

    // Filter keybindings by active contexts
    const contextFilteredBindings = keybindings.filter(
        binding => activeContexts.includes(binding.context)
    );

    // Check if this is a chord prefix
    // (some binding starts with this sequence but is longer)
    const hasLongerMatch = contextFilteredBindings.some(
        binding =>
            binding.chord.length > chordSequence.length &&
            isPrefixMatch(chordSequence, binding)
    );

    if (hasLongerMatch) {
        return {
            type: "chord_started",
            pending: chordSequence
        };
    }

    // Check for exact matches
    let matchedBinding;
    for (let binding of contextFilteredBindings) {
        if (isExactMatch(chordSequence, binding)) {
            matchedBinding = binding;
        }
    }

    if (matchedBinding) {
        if (matchedBinding.action === null) {
            // Explicitly unbound
            return {type: "unbound"};
        }
        return {
            type: "match",
            action: matchedBinding.action
        };
    }

    // No match found
    if (pendingChord !== null) {
        // Had pending chord, cancel it
        return {type: "chord_cancelled"};
    }

    return {type: "none"};
}

// Mapping: tK6→resolveKeystroke, A→inputString, q→eventFlags, K→activeContexts, Y→keybindings, z→pendingChord, w→currentKeystroke, H→chordSequence, $→contextFilteredBindings, _→matchedBinding, sN5→eventToKeystroke, tN5→isPrefixMatch, eN5→isExactMatch, J→binding
```

**What it does:** Determines if a keystroke matches a keybinding, starts a chord, or should be ignored.

**How it works:**
1. **Escape check**: Always cancels pending chords immediately
2. **Event conversion**: Converts to keystroke object, returns "none" if unmatchable
3. **Chord building**: Combines pending chord (if any) with current keystroke
4. **Context filtering**: Only considers bindings active in current contexts
5. **Prefix matching**: Checks if sequence is start of longer chord (e.g., "ctrl+k" is prefix of "ctrl+k ctrl+c")
6. **Exact matching**: Searches for binding matching complete sequence
7. **Result types**:
   - `chord_started`: Sequence is prefix, wait for more keys
   - `match`: Found binding, execute action
   - `unbound`: Explicitly disabled binding (action = null)
   - `chord_cancelled`: Had pending chord, no match, cancel it
   - `none`: No match, no pending chord

**Why this approach:**
- **Escape escape hatch**: Always provides way out of chord mode
- **Prefix-first design**: Allows hierarchical keybinding space (ctrl+k can be both action and prefix)
- **Context awareness**: Same key can mean different things in different UI contexts
- **Explicit unbinding**: Setting action to null removes default binding
- **Chord cancellation**: Unmatched sequences don't consume first keystroke
- **Last-match-wins**: Later bindings override earlier ones (supports user overrides)

**Key insight:** The prefix matching algorithm enables a hierarchical keybinding space similar to Emacs or VS Code. "ctrl+k" can delete to end of line, while "ctrl+k ctrl+c" can comment code, without conflicts. The 1000ms timeout (from KeybindingSetup) gives users time to type the second key while still feeling responsive.

---

### Chord State Management

```javascript
// ============================================
// KeybindingSetup - React component managing chord state
// Location: chunks.110.mjs:931-986
// ============================================

// ORIGINAL (for source lookup):
function dX({children: A}) {
    let [{bindings: q, warnings: K}, Y] = pX.useState(() => {
        let W = YS1();
        return h(`[keybindings] KeybindingSetup initialized with ${W.bindings.length} bindings, ${W.warnings.length} warnings`), W
    }), [z, w] = pX.useState(!1);
    S6Y(K, z);
    let H = pX.useRef(null),
        [$, O] = pX.useState(null),
        _ = pX.useRef(null),
        J = pX.useRef(new Map),
        X = pX.useRef(new Set),
        D = pX.useCallback((W) => {
            X.current.add(W)
        }, []),
        j = pX.useCallback((W) => {
            X.current.delete(W)
        }, []),
        M = pX.useCallback(() => {
            if (_.current) clearTimeout(_.current), _.current = null
        }, []),
        P = pX.useCallback((W) => {
            if (M(), W !== null) _.current = setTimeout(() => {
                h("[keybindings] Chord timeout - cancelling"), H.current = null, O(null)
            }, C6Y);
            H.current = W, O(W)
        }, [M]);
    return pX.useEffect(() => {
        Lq7();
        let W = Rq7((G) => {
            w(!0), Y(G), h(`[keybindings] Reloaded: ${G.bindings.length} bindings, ${G.warnings.length} warnings`)
        });
        return () => {
            W(), M()
        }
    }, [M]), pX.default.createElement(A36, {
        bindings: q,
        pendingChordRef: H,
        pendingChord: $,
        setPendingChord: P,
        activeContexts: X.current,
        registerActiveContext: D,
        unregisterActiveContext: j,
        handlerRegistryRef: J
    }, pX.default.createElement(x6Y, {
        bindings: q,
        pendingChordRef: H,
        setPendingChord: P,
        activeContexts: X.current,
        handlerRegistryRef: J
    }), A)
}

// READABLE (for understanding):
function KeybindingSetup({children}) {
    // Load keybindings on mount
    const [{bindings, warnings}, setKeybindings] = React.useState(() => {
        const loaded = loadKeybindingsSync();
        log(`[keybindings] Initialized with ${loaded.bindings.length} bindings, ${loaded.warnings.length} warnings`);
        return loaded;
    });

    const [hasReloaded, setHasReloaded] = React.useState(false);
    logKeybindingWarnings(warnings, hasReloaded);

    // Chord state
    const pendingChordRef = React.useRef(null);
    const [pendingChord, setPendingChordState] = React.useState(null);
    const chordTimerRef = React.useRef(null);

    // Handler registry
    const handlerRegistryRef = React.useRef(new Map());

    // Active contexts
    const activeContextsRef = React.useRef(new Set());

    const registerActiveContext = React.useCallback((context) => {
        activeContextsRef.current.add(context);
    }, []);

    const unregisterActiveContext = React.useCallback((context) => {
        activeContextsRef.current.delete(context);
    }, []);

    const clearChordTimer = React.useCallback(() => {
        if (chordTimerRef.current) {
            clearTimeout(chordTimerRef.current);
            chordTimerRef.current = null;
        }
    }, []);

    const setPendingChord = React.useCallback((newChord) => {
        clearChordTimer();

        if (newChord !== null) {
            // Start timeout to cancel chord if user doesn't type next key
            chordTimerRef.current = setTimeout(() => {
                log("[keybindings] Chord timeout - cancelling");
                pendingChordRef.current = null;
                setPendingChordState(null);
            }, CHORD_TIMEOUT_MS);  // 1000ms
        }

        pendingChordRef.current = newChord;
        setPendingChordState(newChord);
    }, [clearChordTimer]);

    // Watch keybindings file for hot reload
    React.useEffect(() => {
        watchKeybindingsFile();

        const unsubscribe = subscribeToKeybindingsChanges((newBindings) => {
            setHasReloaded(true);
            setKeybindings(newBindings);
            log(`[keybindings] Reloaded: ${newBindings.bindings.length} bindings, ${newBindings.warnings.length} warnings`);
        });

        return () => {
            unsubscribe();
            clearChordTimer();
        };
    }, [clearChordTimer]);

    return (
        <KeybindingContext.Provider value={{
            bindings,
            pendingChordRef,
            pendingChord,
            setPendingChord,
            activeContexts: activeContextsRef.current,
            registerActiveContext,
            unregisterActiveContext,
            handlerRegistryRef
        }}>
            <KeybindingHandler
                bindings={bindings}
                pendingChordRef={pendingChordRef}
                setPendingChord={setPendingChord}
                activeContexts={activeContextsRef.current}
                handlerRegistryRef={handlerRegistryRef}
            />
            {children}
        </KeybindingContext.Provider>
    );
}

// Mapping: dX→KeybindingSetup, A→children, pX→React, q→bindings, K→warnings, Y→setKeybindings, z→hasReloaded, w→setHasReloaded, H→pendingChordRef, $→pendingChord, O→setPendingChordState, _→chordTimerRef, J→handlerRegistryRef, X→activeContextsRef, D→registerActiveContext, j→unregisterActiveContext, M→clearChordTimer, P→setPendingChord, C6Y→CHORD_TIMEOUT_MS, YS1→loadKeybindingsSync, S6Y→logKeybindingWarnings, Lq7→watchKeybindingsFile, Rq7→subscribeToKeybindingsChanges, h→log
```

**What it does:** Top-level React component managing chord state, context registry, and keybinding hot-reload.

**How it works:**
1. **Initial load**: Synchronously loads keybindings on mount
2. **Chord state**: Maintains both ref (for immediate access) and state (for React updates)
3. **Timeout management**: Sets 1000ms timer when chord starts, cancels if complete or timeout
4. **Context tracking**: Registry of active UI contexts (Global, Chat, CommandPalette, etc.)
5. **Handler registry**: Maps action names to handler functions
6. **Hot reload**: Watches keybindings file, reloads on change
7. **Cleanup**: Clears timers on unmount

**Why this approach:**
- **Sync load**: Blocks render until keybindings ready, prevents flashing default state
- **Ref + state combo**: Ref for synchronous access in event handlers, state for UI updates
- **1000ms timeout**: Long enough for deliberate typing, short enough to feel responsive
- **Context registry**: Allows dynamic context activation as UI components mount/unmount
- **Hot reload**: Developers can edit keybindings without restart
- **Cleanup**: Prevents memory leaks from timers

**Key insight:** The ref+state pattern is critical for chords: the handler needs synchronous access to pending chord (can't wait for React render), but UI needs to show chord state (requires state update). Using both solves the dual requirement.

---

## 7. Action Execution

When a keybinding matches, the registered handler is invoked.

### Handler Dispatch

```javascript
// ============================================
// KeybindingHandler - React component for keybinding dispatch
// Location: chunks.110.mjs:988-1041
// ============================================

// ORIGINAL (for source lookup):
function x6Y(A) {
    let q = e(6),
        {bindings: K, pendingChordRef: Y, setPendingChord: z, activeContexts: w, handlerRegistryRef: H} = A,
        $;
    if (q[0] !== w || q[1] !== K || q[2] !== H || q[3] !== Y || q[4] !== z) $ = (_, J, X) => {
        let D = H.current,
            j = new Set;
        if (D)
            for (let G of D.values())
                for (let f of G) j.add(f.context);
        let M = [...j, ...w, "Global"],
            P = Y.current !== null,
            W = tK6(_, J, M, K, Y.current);
        A: switch (W.type) {
            case "chord_started": {
                z(W.pending), X.stopImmediatePropagation();
                break A
            }
            case "match": {
                if (z(null), P) {
                    let G = new Set(M);
                    if (D) {
                        let f = D.get(W.action);
                        if (f && f.size > 0) {
                            for (let Z of f)
                                if (G.has(Z.context)) {
                                    Z.handler(), X.stopImmediatePropagation();
                                    break
                                }
                        }
                    }
                }
                break A
            }
            case "chord_cancelled": {
                z(null);
                break A
            }
            case "unbound": {
                z(null);
                break A
            }
            case "none":
        }
    }, q[0] = w, q[1] = K, q[2] = H, q[3] = Y, q[4] = z, q[5] = $;
    else $ = q[5];
    return D8($), null
}

// READABLE (for understanding):
function KeybindingHandler(props) {
    const {
        bindings,
        pendingChordRef,
        setPendingChord,
        activeContexts,
        handlerRegistryRef
    } = props;

    const handleKeystroke = React.useMemo(() => {
        return (inputString, eventFlags, event) => {
            const registry = handlerRegistryRef.current;

            // Collect contexts from registered handlers
            const handlerContexts = new Set();
            if (registry) {
                for (let handlers of registry.values()) {
                    for (let handler of handlers) {
                        handlerContexts.add(handler.context);
                    }
                }
            }

            // Merge handler contexts + active contexts + Global
            const allContexts = [
                ...handlerContexts,
                ...activeContexts,
                "Global"
            ];

            const hadPendingChord = pendingChordRef.current !== null;

            // Resolve keystroke against bindings
            const result = resolveKeystroke(
                inputString,
                eventFlags,
                allContexts,
                bindings,
                pendingChordRef.current
            );

            switch (result.type) {
                case "chord_started": {
                    // Start chord, prevent propagation
                    setPendingChord(result.pending);
                    event.stopImmediatePropagation();
                    break;
                }

                case "match": {
                    // Clear chord state
                    setPendingChord(null);

                    // Only invoke handler if we had pending chord
                    // (prevents double-execution for single-key bindings)
                    if (hadPendingChord) {
                        const contextsSet = new Set(allContexts);

                        if (registry) {
                            const actionHandlers = registry.get(result.action);
                            if (actionHandlers && actionHandlers.size > 0) {
                                // Find first handler in active context
                                for (let handlerInfo of actionHandlers) {
                                    if (contextsSet.has(handlerInfo.context)) {
                                        handlerInfo.handler();
                                        event.stopImmediatePropagation();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    break;
                }

                case "chord_cancelled":
                case "unbound": {
                    setPendingChord(null);
                    break;
                }

                case "none":
                    // No action
                    break;
            }
        };
    }, [activeContexts, bindings, handlerRegistryRef, pendingChordRef, setPendingChord]);

    // Register global keystroke handler
    useKeystrokeHandler(handleKeystroke);

    return null;
}

// Mapping: x6Y→KeybindingHandler, A→props, K→bindings, Y→pendingChordRef, z→setPendingChord, w→activeContexts, H→handlerRegistryRef, $→handleKeystroke, _→inputString, J→eventFlags, X→event, D→registry, j→handlerContexts, M→allContexts, P→hadPendingChord, W→result, G→contextsSet, f→actionHandlers, Z→handlerInfo, tK6→resolveKeystroke, D8→useKeystrokeHandler
```

**What it does:** Central dispatcher that resolves keystrokes and invokes matching action handlers.

**How it works:**
1. **Context merging**: Combines registered handler contexts + active contexts + Global
2. **Keystroke resolution**: Calls resolveKeystroke with merged contexts
3. **Chord start**: Updates state, prevents event propagation
4. **Match handling**:
   - Clears chord state
   - Only invokes if had pending chord (prevents double-execution)
   - Finds first handler in active context
   - Stops propagation to prevent default behavior
5. **Cancellation**: Clears chord state
6. **Memoization**: Recreates handler only when deps change

**Why this approach:**
- **Context auto-discovery**: Handlers automatically add their context to active list
- **Global always active**: Ensures global bindings work everywhere
- **Pending chord check**: Prevents executing action twice (once for first key, once for complete chord)
- **Context priority**: First matching handler wins (allows context override)
- **Propagation stop**: Prevents browser/terminal default behavior
- **Memoization**: Avoids recreating handler on every render

**Key insight:** The "hadPendingChord" check is subtle but critical. Without it, pressing "ctrl+k" for a two-key chord would execute both the "ctrl+k" action (if bound) AND start the chord. The check ensures only the complete chord executes, or if no chord, just the single-key action.

---

### Handler Registration

Components register action handlers using a custom hook:

```javascript
const unregister = keybindingContext.registerHandler({
    action: "toggleSidebar",
    context: "Global",
    handler: () => {
        setSidebarOpen(!sidebarOpen);
    }
});

// Cleanup on unmount
return () => unregister();
```

**How it works:**
1. Component calls registerHandler with action name, context, and callback
2. Handler added to registry Map (action → Set of handlers)
3. When keystroke matches action, dispatcher finds handlers and invokes first matching context
4. Unregister on unmount to prevent memory leaks

---

## Summary: Complete Flow

Let's trace a complete example: User presses `Ctrl+K Ctrl+C` to comment code.

1. **Terminal Input**: User presses Ctrl+K
   - Raw mode stdin receives "\x0B" (Ctrl+K)
   - handleReadable reads chunk

2. **ANSI Parsing**:
   - processInput calls P77 tokenizer
   - Single character, no escape sequence
   - Returns key object: `{name: "k", ctrl: true, ...}`

3. **Event Conversion**:
   - dN5 converts to event format
   - InputEvent created with flags `{ctrl: true}` and input `"k"`

4. **Event Dispatch**:
   - React.discreteUpdates calls dispatcher
   - Events routed through focus system

5. **Keybinding Match**:
   - eventToKeystroke: `{key: "k", ctrl: true, alt: false, shift: false}`
   - resolveKeystroke checks bindings
   - Finds prefix match: "ctrl+k ctrl+c" starts with "ctrl+k"
   - Returns `{type: "chord_started", pending: [{key: "k", ctrl: true}]}`

6. **Chord State Update**:
   - setPendingChord([{key: "k", ctrl: true}])
   - 1000ms timer starts
   - UI shows chord indicator "Ctrl+K ..."

7. **Second Key**: User presses Ctrl+C within 1000ms
   - Same parsing flow
   - resolveKeystroke called with pendingChord = [{key: "k", ctrl: true}]
   - Builds sequence: [{key: "k", ctrl: true}, {key: "c", ctrl: true}]
   - Finds exact match: "ctrl+k ctrl+c" → action "toggleComment"
   - Returns `{type: "match", action: "toggleComment"}`

8. **Action Execution**:
   - setPendingChord(null) clears chord
   - Looks up "toggleComment" in handler registry
   - Finds handler in "Editor" context
   - Invokes handler: `toggleComment()`
   - Stops event propagation

9. **Result**: Code is commented, chord state cleared, ready for next input.

---

## Performance Considerations

### Paste Mode Optimization

Large pastes (1000+ characters) are handled efficiently:
- Bracket paste mode bundles into single event
- Prevents 1000 individual keyboard events
- No keybinding matching during paste
- Single text insertion operation

### Parser State Reuse

The tokenizer maintains state across chunks:
- Incomplete ANSI sequences buffered
- No need to re-parse previous data
- Handles slow network connections gracefully

### React Batching

discreteUpdates ensures efficient rendering:
- Multiple keystrokes batched into single render
- Prevents layout thrashing
- High priority for input responsiveness

### Chord Timeout

1000ms timeout balances UX and performance:
- Long enough for deliberate multi-key sequences
- Short enough to feel responsive
- Automatically clears incomplete chords
- Prevents memory leaks from abandoned chords

---

## Error Handling

### Malformed Sequences

- Timeout flushes incomplete sequences (50ms normal, 500ms paste)
- Parser returns best-effort key object
- Unmatchable keys return null, skip matching

### Invalid Keybindings

- Validation at load time with warnings
- Invalid bindings skipped, not loaded
- Hot reload shows validation errors
- Fallback to defaults on parse failure

### Handler Failures

- Exceptions in handlers caught by React error boundary
- Does not crash entire app
- Logs error for debugging
- Allows continued input

---

## Platform Differences

### macOS vs Linux/Windows

- **Meta vs Alt**: macOS uses cmd (meta), Linux/Windows use alt
- **Alt+Arrow**: macOS sends "\x1Bb"/"\x1Bf", others send ANSI sequences
- **Option key**: macOS has separate option modifier

### Terminal Variations

- **Kitty/WezTerm**: Support modern CSI u protocol
- **iTerm2**: Bracket paste, hyperlinks, but legacy key encoding
- **Legacy terminals**: ANSI sequences only, no bracket paste
- **Windows Terminal**: Full ANSI support, no Kitty features

The parser handles all these variations transparently through regex fallback chains.

---

## Conclusion

The keybinding event flow is a sophisticated pipeline converting raw terminal bytes into high-level actions. Key design decisions:

1. **Stateful parsing** handles incomplete sequences gracefully
2. **Bracket paste mode** enables efficient bulk text input
3. **Chord mechanism** expands keybinding space hierarchically
4. **Context filtering** provides semantic action scoping
5. **Platform normalization** ensures cross-platform consistency

This architecture provides a robust, performant, and extensible foundation for keyboard interaction in the TUI.
