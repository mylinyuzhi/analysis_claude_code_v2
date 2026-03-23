# Keybinding Chord Mechanism Analysis

## Module Overview

Claude Code v2.1.76 features a sophisticated keybinding system that supports "Chords" (multi-key sequences like `Ctrl+K, S`). This allows for a much larger set of shortcuts without conflicting with standard terminal or OS keys.

**Version**: Claude Code v2.1.76

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `KeybindingHandler` (N4Y) - React component that manages the keyboard event loop
- `CHORD_TIMEOUT_MS` (G4Y) - The 1000ms window to complete a chord
- `loadKeybindingsAsync` (tu9) - Async function that loads and parses the JSON configuration
- `watchKeybindingsFile` (B34) - Enables hot-reloading of the config
- `isPrefixMatch` (jl3) - Checks if keystroke sequence is a prefix of a registered chord
- `isExactMatch` (Jl3) - Checks if keystroke sequence exactly matches a registered chord
- `resolveKeystroke` (Z$1) - Main keystroke matching orchestrator
- `eventToKeystroke` (Hl3) - Converts raw event to keystroke object
- `keystrokesMatch` (W$1) - Compares two keystroke objects for equality

## Chord State Machine (Algorithm)

**What it does:** Processes incoming key events to determine if they match a single shortcut, start a chord, or cancel an existing sequence.

**How it works:**
1. Maintains a `currentChord` state (array of key strings).
2. On key down:
   - Appends the new key to `currentChord`.
   - Checks if this sequence matches a registered action EXACTLY.
   - Checks if this sequence is a PREFIX of any registered chord.
3. Transitions:
   - **Prefix Match**: Sets state to `chord_started`, starts a 1000ms timer (`C6Y`).
   - **Exact Match**: Executes the action and resets `currentChord`.
   - **No Match**: Resets `currentChord` and sends a `chord_cancelled` event.
   - **Timeout**: If the timer expires before the next key, resets and sends `chord_cancelled`.

```javascript
// ============================================
// resolveKeystroke - Main keystroke matching orchestrator
// Location: chunks.65.mjs:758-795
// ============================================

// ORIGINAL (for source lookup):
function Z$1(A, q, K, Y, z) {
    if (q.escape && z !== null) return {
        type: "chord_cancelled"
    };
    let _ = Hl3(A, q);
    if (!_) {
        if (z !== null) return {
            type: "chord_cancelled"
        };
        return {
            type: "none"
        }
    }
    let w = z ? [...z, _] : [_],
        O = Y.filter((j) => K.includes(j.context));
    if (O.some((j) => j.chord.length > w.length && jl3(w, j))) return {
        type: "chord_started",
        pending: w
    };
    let H;
    for (let j of O)
        if (Jl3(w, j)) H = j;
    if (H) {
        if (H.action === null) return {
            type: "unbound"
        };
        return {
            type: "match",
            action: H.action
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
function resolveKeystroke(inputStr, keyEvent, activeContexts, allBindings, pendingChord) {
    // Escape key cancels any pending chord
    if (keyEvent.escape && pendingChord !== null) {
        return { type: "chord_cancelled" };
    }

    // Convert raw key event to normalized keystroke
    let normalizedKey = eventToKeystroke(inputStr, keyEvent);
    if (!normalizedKey) {
        // Invalid keystroke - cancel if chord in progress
        if (pendingChord !== null) {
            return { type: "chord_cancelled" };
        }
        return { type: "none" };
    }

    // Build the current sequence (append to pending or start new)
    let currentSequence = pendingChord ? [...pendingChord, normalizedKey] : [normalizedKey];

    // Filter bindings to only those matching current context
    let contextualBindings = allBindings.filter(binding =>
        activeContexts.includes(binding.context)
    );

    // Check if this sequence is a PREFIX of any longer chord
    if (contextualBindings.some(binding =>
        binding.chord.length > currentSequence.length &&
        isPrefixMatch(currentSequence, binding)
    )) {
        return {
            type: "chord_started",
            pending: currentSequence
        };
    }

    // Check for EXACT match
    let matchedBinding;
    for (let binding of contextualBindings) {
        if (isExactMatch(currentSequence, binding)) {
            matchedBinding = binding;
        }
    }

    if (matchedBinding) {
        if (matchedBinding.action === null) {
            return { type: "unbound" }; // Explicitly disabled binding
        }
        return {
            type: "match",
            action: matchedBinding.action
        };
    }

    // No prefix or exact match
    if (pendingChord !== null) {
        return { type: "chord_cancelled" }; // Had pending, now invalid
    }

    return { type: "none" }; // Nothing matched
}

// Mapping: Z$1→resolveKeystroke, A→inputStr, q→keyEvent, K→activeContexts, Y→allBindings, z→pendingChord, _→normalizedKey, w→currentSequence, O→contextualBindings, H→matchedBinding, Hl3→eventToKeystroke, jl3→isPrefixMatch, Jl3→isExactMatch
```

## Hot-Reloading Configuration

The system monitors `~/.claude/keybindings.json` using chokidar (wrapped as `B34`). When the file is saved:
1. `watchKeybindingsFile` triggers.
2. `loadKeybindingsAsync` re-reads the JSON.
3. The new bindings are injected into the React context.
4. The UI immediately reflects the new shortcuts without a restart.

## Configuration Format

Keybindings are stored as an array of context objects:
```json
[
  {
    "context": "Chat",
    "bindings": {
      "ctrl+g": "chat:externalEditor"
    }
  },
  {
    "context": "Global",
    "bindings": {
      "ctrl+k ctrl+c": "app:clearHistory"
    }
  }
]
```

**Key insight:** The use of a prefix-checking state machine allows Claude Code to provide a highly extensible keyboard interface similar to VS Code or Vim, which is essential for a CLI-first tool.

## Timeout Implementation

**What it does:** Provides a time window for completing multi-key chords before automatically cancelling them.

**How it works:**
1. **Timeout Constant**: `G4Y` is set to 1000ms (1 second) - the maximum time between keystrokes in a chord.
2. **Timer Setup**: When a chord sequence starts (prefix match detected), a setTimeout is created.
3. **Timer Cancellation**: The timer is cleared if:
   - The user completes the chord (exact match found)
   - The user presses Escape (explicit cancellation)
   - A new chord sequence starts (replaces the old timer)
4. **Timeout Expiration**: If 1 second passes without completing the chord, the pending state is reset.

```javascript
// ============================================
// setPendingChord - Manages chord timeout lifecycle
// Location: chunks.117.mjs:1904-1909
// ============================================

// ORIGINAL (for source lookup):
P = wM.useCallback((W) => {
    if (X(), W !== null) H.current = setTimeout((Z, G) => {
        k("[keybindings] Chord timeout - cancelling"), Z.current = null, G(null)
    }, G4Y, w, $);
    w.current = W, $(W)
}, [X]);

// READABLE (for understanding):
const setPendingChord = useCallback((newChord) => {
    // Clear any existing timer
    clearChordTimer();

    // If starting a new chord, create timeout
    if (newChord !== null) {
        timerRef.current = setTimeout(() => {
            debug("[keybindings] Chord timeout - cancelling");
            pendingChordRef.current = null;
            setPendingChordState(null);
        }, CHORD_TIMEOUT_MS); // 1000ms
    }

    pendingChordRef.current = newChord;
    setPendingChordState(newChord);
}, [clearChordTimer]);

// Mapping: P→setPendingChord, X→clearChordTimer, W→newChord, H→timerRef, w→pendingChordRef, $→setPendingChordState, G4Y→CHORD_TIMEOUT_MS
```

**Why this approach:**
- **1-second window**: Balances user convenience (enough time to press the next key) with responsiveness (not too long before cancellation).
- **Explicit cleanup**: Prevents timer leaks by clearing old timers before creating new ones.
- **User feedback**: The cancellation resets visual indicators (pending chord display) immediately.

## Prefix Matching Algorithm

**What it does:** Determines whether a keystroke sequence is a prefix of a registered chord, enabling multi-step chord detection.

**How it works:**

### Prefix Check Function (jl3)

The `jl3()` function checks if the current sequence could be the start of a longer chord:

```javascript
// ============================================
// jl3 - Checks if keystroke sequence is a prefix of a registered chord
// Location: chunks.65.mjs:736-745
// ============================================

// ORIGINAL (for source lookup):
function jl3(A, q) {
    if (A.length >= q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (!W$1(Y, z)) return !1
    }
    return !0
}

// READABLE (for understanding):
function isPrefixMatch(currentSequence, keybinding) {
    // Prefix must be shorter than the target chord
    if (currentSequence.length >= keybinding.chord.length) {
        return false;
    }

    // Check each keystroke in the current sequence
    for (let i = 0; i < currentSequence.length; i++) {
        let currentKey = currentSequence[i];
        let targetKey = keybinding.chord[i];

        if (!currentKey || !targetKey) return false;

        // All modifiers and key must match (uses W$1 keystrokesMatch)
        if (!keystrokesMatch(currentKey, targetKey)) return false;
    }

    return true; // All keys match so far
}

// Mapping: jl3→isPrefixMatch, A→currentSequence, q→keybinding, K→i, Y→currentKey, z→targetKey, W$1→keystrokesMatch
```

**Key insight:** The matching delegates to `W$1` (keystrokesMatch) which handles the alt/meta equivalence, allowing cross-platform chord definitions. A chord defined with `alt` will match `meta` key presses, important for macOS users where `meta` (Cmd) is more common than `alt` (Option).

### Exact Match Function (Jl3)

The `Jl3()` function checks if the current sequence exactly matches a registered chord:

```javascript
// ============================================
// Jl3 - Checks if keystroke sequence exactly matches a registered chord
// Location: chunks.65.mjs:747-756
// ============================================

// ORIGINAL (for source lookup):
function Jl3(A, q) {
    if (A.length !== q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (!W$1(Y, z)) return !1
    }
    return !0
}

// READABLE (for understanding):
function isExactMatch(currentSequence, keybinding) {
    // Lengths must be identical for exact match
    if (currentSequence.length !== keybinding.chord.length) {
        return false;
    }

    // Check each keystroke in the sequence
    for (let i = 0; i < currentSequence.length; i++) {
        let currentKey = currentSequence[i];
        let targetKey = keybinding.chord[i];

        if (!currentKey || !targetKey) return false;

        // All modifiers and key must match (uses W$1 keystrokesMatch)
        if (!keystrokesMatch(currentKey, targetKey)) return false;
    }

    return true;
}

// Mapping: Jl3→isExactMatch, A→currentSequence, q→keybinding, K→i, Y→currentKey, z→targetKey, W$1→keystrokesMatch
```

### Keystroke Comparison Function (W$1)

The `W$1()` function compares two keystroke objects for equality:

```javascript
// ============================================
// W$1 - Compares two keystroke objects for equality
// Location: chunks.65.mjs:732-734
// ============================================

// ORIGINAL (for source lookup):
function W$1(A, q) {
    return A.key === q.key && A.ctrl === q.ctrl && A.shift === q.shift && (A.alt || A.meta) === (q.alt || q.meta) && A.super === q.super
}

// READABLE (for understanding):
function keystrokesMatch(keystroke1, keystroke2) {
    return keystroke1.key === keystroke2.key &&
           keystroke1.ctrl === keystroke2.ctrl &&
           keystroke1.shift === keystroke2.shift &&
           // alt and meta are treated as equivalent
           (keystroke1.alt || keystroke1.meta) === (keystroke2.alt || keystroke2.meta) &&
           keystroke1.super === keystroke2.super;
}

// Mapping: W$1→keystrokesMatch, A→keystroke1, q→keystroke2
```

### Keystroke Parsing Function (Qu6)

The `Qu6()` function parses a keystroke string like "ctrl+k" into a structured object:

```javascript
// ============================================
// Qu6 - Parses keystroke string to structured object
// Location: chunks.65.mjs:533-594
// ============================================

// ORIGINAL (for source lookup):
function Qu6(A) {
    let q = A.split("+"),
        K = {
            key: "",
            ctrl: !1,
            alt: !1,
            shift: !1,
            meta: !1,
            super: !1
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
                K.meta = !0;
                break;
            case "cmd":
            case "command":
            case "super":
            case "win":
                K.super = !0;
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
    let parts = keystrokeString.split("+");
    let result = {
        key: "",
        ctrl: false,
        alt: false,
        shift: false,
        meta: false,
        super: false
    };

    for (let part of parts) {
        let lower = part.toLowerCase();
        switch (lower) {
            case "ctrl":
            case "control":
                result.ctrl = true;
                break;
            case "alt":
            case "opt":       // macOS alias
            case "option":
                result.alt = true;
                break;
            case "shift":
                result.shift = true;
                break;
            case "meta":
                result.meta = true;
                break;
            case "cmd":       // macOS Command key
            case "command":
            case "super":     // Linux Super key
            case "win":       // Windows key
                result.super = true;
                break;
            // Key name aliases
            case "esc":
                result.key = "escape";
                break;
            case "return":
                result.key = "enter";
                break;
            case "space":
                result.key = " ";
                break;
            // Unicode arrow support
            case "↑": result.key = "up"; break;
            case "↓": result.key = "down"; break;
            case "←": result.key = "left"; break;
            case "→": result.key = "right"; break;
            default:
                result.key = lower;
                break;
        }
    }

    return result;
}

// Mapping: Qu6→parseKeystroke, A→keystrokeString, q→parts, K→result, Y→part, z→lower
```

**Key insight:** The parser supports multiple modifier aliases (cmd/super/win, alt/opt/option) and Unicode arrow characters, making keybindings cross-platform and user-friendly.

## Edge Cases

### Modifiers Alone

**Issue**: What happens if the user presses just Ctrl, Alt, Shift, or Cmd without a key?

**Solution**: The `Qj8()` key normalization function (chunks.65.mjs:671-689) only recognizes special keys (escape, enter, arrows, etc.) or single characters. Modifier-only presses produce no valid keystroke, triggering a `type: "none"` result.

```javascript
// ============================================
// Qj8 - Extracts key name from raw key event
// Location: chunks.65.mjs:671-689
// ============================================

// ORIGINAL (for source lookup):
function Qj8(A, q) {
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
    if (q.wheelUp) return "wheelup";
    if (q.wheelDown) return "wheeldown";
    if (q.home) return "home";
    if (q.end) return "end";
    if (A.length === 1) return A.toLowerCase();
    return null
}

// READABLE (for understanding):
function getKeyNameFromEvent(inputStr, keyEvent) {
    // Special keys have dedicated boolean properties
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
    if (keyEvent.wheelUp) return "wheelup";
    if (keyEvent.wheelDown) return "wheeldown";
    if (keyEvent.home) return "home";
    if (keyEvent.end) return "end";

    // Single character input (alphanumeric or symbol)
    if (inputStr.length === 1) {
        return inputStr.toLowerCase();
    }

    // Modifier-only or unrecognized input
    return null;
}

// Mapping: Qj8→getKeyNameFromEvent, A→inputStr, q→keyEvent
```

**Result**: Pressing just Ctrl does nothing. The user must press Ctrl+K (for example) to trigger a chord.

### Chord Cancellation on Focus Loss

**Issue**: What happens if the user starts a chord, then switches windows or panes?

**Solution**: The current implementation does NOT automatically cancel chords on focus loss. This is handled at the React component level:
- The `useEffect` cleanup in `dX` (chunks.110.mjs:967-969) clears the timer when the component unmounts.
- However, focus changes within the app (e.g., switching from Chat to Artifacts pane) do not unmount the keybinding provider.

**Trade-off**: This means a chord can persist across pane switches. While potentially surprising, it allows advanced workflows like "press Ctrl+K, switch to a pane, press S" (if such a cross-pane chord existed). In practice, most chords are completed within a single pane.

### Chord State During Hot-Reload

**Issue**: What happens if the user edits keybindings.json while a chord is pending?

**Solution**: The reload listener (`I34` in chunks.90.mjs:14-22) updates the bindings array, but does NOT clear the pending chord state. This can cause inconsistencies:

```javascript
// ============================================
// I34 - File change handler for hot-reload
// Location: chunks.90.mjs:14-22
// ============================================

// ORIGINAL (for source lookup):
async function I34(A) {
    k(`[keybindings] Detected change to ${A}`);
    try {
        let q = await tu9();
        Y0 = q.bindings, _Z = q.warnings, Op6.forEach((K) => K(q))
    } catch (q) {
        k(`[keybindings] Error reloading: ${_1(q)}`)
    }
}

// READABLE (for understanding):
async function handleKeybindingsFileChange(filePath) {
    debug(`[keybindings] Detected change to ${filePath}`);
    try {
        let newConfig = await loadKeybindingsAsync();

        // Update cached bindings and warnings
        cachedBindings = newConfig.bindings;
        cachedWarnings = newConfig.warnings;

        // Notify all subscribers (React components)
        reloadSubscribers.forEach(callback => callback(newConfig));
    } catch (error) {
        debug(`[keybindings] Error reloading: ${formatError(error)}`);
    }
}

// Mapping: I34→handleKeybindingsFileChange, A→filePath, k→debug, tu9→loadKeybindingsAsync, Y0→cachedBindings, _Z→cachedWarnings, Op6→reloadSubscribers, _1→formatError
```

**Example scenario**:
1. User presses Ctrl+K (chord starts, pending = [{ key: "k", ctrl: true }])
2. User saves keybindings.json, removing the Ctrl+K, S binding
3. User presses S
4. The system checks for matches against the NEW bindings (no Ctrl+K, S), finds none, and cancels the chord

**Result**: The pending chord is validated against the latest bindings, automatically "cancelling" if the chord definition was removed. This is the desired behavior - hot-reloads should immediately take effect.

**Key insight:** The separation of pending chord state (in React component) from binding definitions (reloadable cache) enables seamless hot-reload without complex state synchronization.
