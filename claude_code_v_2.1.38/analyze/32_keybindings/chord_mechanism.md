# Keybinding Chord Mechanism Analysis

## Module Overview

Claude Code v2.1.38 features a sophisticated keybinding system that supports "Chords" (multi-key sequences like `Ctrl+K, S`). This allows for a much larger set of shortcuts without conflicting with standard terminal or OS keys.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `KeybindingHandler` (x6Y) - React component that manages the keyboard event loop
- `CHORD_TIMEOUT_MS` (C6Y) - The 1000ms window to complete a chord
- `loadKeybindings` (YS1) - Function that parses the JSON configuration
- `watchKeybindingsFile` (Lq7) - Enables hot-reloading of the config

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
// handleKeyEvent - Core logic for chord processing
// Location: chunks.110.mjs:988-1040
// ============================================

// ORIGINAL (for source lookup):
function x6Y(A) {
    ...
    case "chord_started": {
        let q = setTimeout(() => {
            dispatch({ type: "chord_cancelled" });
        }, C6Y);
        return () => clearTimeout(q);
    }
    ...
}

// READABLE (for understanding):
function handleKeyEvent(key, state, keybindings) {
    const sequence = [...state.currentSequence, key];
    
    // Check for exact match
    const action = keybindings.find(kb => isDeepEqual(kb.chord, sequence));
    if (action) {
        executeAction(action.name);
        return { currentSequence: [], state: 'idle' };
    }
    
    // Check if this is a prefix of a longer chord
    const isPrefix = keybindings.some(kb => 
        kb.chord.length > sequence.length && 
        isPrefixOf(sequence, kb.chord)
    );
    
    if (isPrefix) {
        // Start/Continue chord sequence
        return { 
            currentSequence: sequence, 
            state: 'chord_started',
            timer: startTimeout(1000, () => cancelChord())
        };
    }
    
    // No match and not a prefix
    return { currentSequence: [], state: 'idle' };
}

// Mapping: x6Y→handleKeyEvent, C6Y→CHORD_TIMEOUT_MS
```

## Hot-Reloading Configuration

The system monitors `~/.claude/keybindings.json` using `fs.watch` (abstracted as `Lq7`). When the file is saved:
1. `watchKeybindingsFile` triggers.
2. `loadKeybindings` re-reads the JSON.
3. The new bindings are injected into the React context.
4. The UI immediately reflects the new shortcuts without a restart.

## Configuration Format

Keybindings are stored as an array of objects:
```json
[
  {
    "name": "external_editor",
    "chord": ["ctrl+g"]
  },
  {
    "name": "save_to_notebook",
    "chord": ["ctrl+k", "n"]
  }
]
```

**Key insight:** The use of a prefix-checking state machine allows Claude Code to provide a highly extensible keyboard interface similar to VS Code or Vim, which is essential for a CLI-first tool.

## Timeout Implementation

**What it does:** Provides a time window for completing multi-key chords before automatically cancelling them.

**How it works:**
1. **Timeout Constant**: `C6Y` is set to 1000ms (1 second) - the maximum time between keystrokes in a chord.
2. **Timer Setup**: When a chord sequence starts (prefix match detected), a setTimeout is created.
3. **Timer Cancellation**: The timer is cleared if:
   - The user completes the chord (exact match found)
   - The user presses Escape (explicit cancellation)
   - A new chord sequence starts (replaces the old timer)
4. **Timeout Expiration**: If 1 second passes without completing the chord, the pending state is reset.

```javascript
// ============================================
// setPendingChord - Manages chord timeout lifecycle
// Location: chunks.110.mjs:956-961
// ============================================

// ORIGINAL (for source lookup):
P = pX.useCallback((W) => {
    if (M(), W !== null) _.current = setTimeout(() => {
        h("[keybindings] Chord timeout - cancelling"), H.current = null, O(null)
    }, C6Y);
    H.current = W, O(W)
}, [M]);

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

// Mapping: P→setPendingChord, M→clearChordTimer, W→newChord, _→timerRef, H→pendingChordRef, O→setPendingChordState, C6Y→CHORD_TIMEOUT_MS
```

**Why this approach:**
- **1-second window**: Balances user convenience (enough time to press the next key) with responsiveness (not too long before cancellation).
- **Explicit cleanup**: Prevents timer leaks by clearing old timers before creating new ones.
- **User feedback**: The cancellation resets visual indicators (pending chord display) immediately.

## Prefix Matching Algorithm

**What it does:** Determines whether a keystroke sequence is a prefix of a registered chord, enabling multi-step chord detection.

**How it works:**

### Prefix Check Function (tN5)

The `tN5()` function checks if the current sequence could be the start of a longer chord:

```javascript
// ============================================
// tN5 - Checks if keystroke sequence is a prefix of a registered chord
// Location: chunks.53.mjs:2914-2926
// ============================================

// ORIGINAL (for source lookup):
function tN5(A, q) {
    if (A.length >= q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (Y.key !== z.key) return !1;
        if (Y.ctrl !== z.ctrl) return !1;
        if ((Y.alt || Y.meta) !== (z.alt || z.meta)) return !1;
        if (Y.shift !== z.shift) return !1
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

        // All modifiers and key must match exactly
        if (currentKey.key !== targetKey.key) return false;
        if (currentKey.ctrl !== targetKey.ctrl) return false;

        // alt and meta are treated as equivalent
        if ((currentKey.alt || currentKey.meta) !== (targetKey.alt || targetKey.meta)) {
            return false;
        }

        if (currentKey.shift !== targetKey.shift) return false;
    }

    return true; // All keys match so far
}

// Mapping: tN5→isPrefixMatch, A→currentSequence, q→keybinding, K→i, Y→currentKey, z→targetKey
```

**Key insight:** The alt/meta equivalence `(Y.alt || Y.meta) !== (z.alt || z.meta)` allows cross-platform chord definitions. A chord defined with `alt` will match `meta` key presses, important for macOS users where `meta` (Cmd) is more common than `alt` (Option).

### Exact Match Function (eN5)

The `eN5()` function checks if the current sequence exactly matches a registered chord:

```javascript
// ============================================
// eN5 - Checks if keystroke sequence exactly matches a registered chord
// Location: chunks.53.mjs:2928-2940
// ============================================

// ORIGINAL (for source lookup):
function eN5(A, q) {
    if (A.length !== q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (Y.key !== z.key) return !1;
        if (Y.ctrl !== z.ctrl) return !1;
        if ((Y.alt || Y.meta) !== (z.alt || z.meta)) return !1;
        if (Y.shift !== z.shift) return !1
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

        // All modifiers and key must match exactly
        if (currentKey.key !== targetKey.key) return false;
        if (currentKey.ctrl !== targetKey.ctrl) return false;
        if ((currentKey.alt || currentKey.meta) !== (targetKey.alt || targetKey.meta)) {
            return false;
        }
        if (currentKey.shift !== targetKey.shift) return false;
    }

    return true;
}

// Mapping: eN5→isExactMatch, A→currentSequence, q→keybinding, K→i, Y→currentKey, z→targetKey
```

### Building the Pending Chord Array

When a key event arrives, the main matching function `tK6()` builds the pending chord array and checks for matches:

```javascript
// ============================================
// tK6 - Main keystroke matching orchestrator
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
function matchKeystroke(inputStr, keyEvent, activeContexts, allBindings, pendingChord) {
    // Escape key cancels any pending chord
    if (keyEvent.escape && pendingChord !== null) {
        return { type: "chord_cancelled" };
    }

    // Convert raw key event to normalized keystroke
    let normalizedKey = normalizeKeystroke(inputStr, keyEvent);
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

// Mapping: tK6→matchKeystroke, A→inputStr, q→keyEvent, K→activeContexts, Y→allBindings, z→pendingChord, w→normalizedKey, H→currentSequence, $→contextualBindings, _→matchedBinding
```

**Why this approach:**
- **Greedy prefix matching**: The system checks for prefix matches first, allowing it to detect when a chord sequence is starting.
- **Context filtering**: Only bindings relevant to the current UI context are considered, preventing conflicts.
- **Unbound slots**: Bindings with `action: null` are explicitly disabled, allowing users to "unbind" default shortcuts.
- **Deterministic matching**: The last-matching binding wins (iteration order matters), giving user config files priority over defaults.

## Edge Cases

### Modifiers Alone

**Issue**: What happens if the user presses just Ctrl, Alt, Shift, or Cmd without a key?

**Solution**: The `v77()` key normalization function (chunks.53.mjs:2875-2891) only recognizes special keys (escape, enter, arrows, etc.) or single characters. Modifier-only presses produce no valid keystroke, triggering a `type: "none"` result.

```javascript
// ============================================
// v77 - Normalizes raw key input to key name
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
function extractKeyName(inputStr, keyEvent) {
    // Special keys have dedicated properties
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

    // Single character input (e.g., "a", "1", "[")
    if (inputStr.length === 1) {
        return inputStr.toLowerCase();
    }

    // Modifier-only or unrecognized input
    return null;
}

// Mapping: v77→extractKeyName, A→inputStr, q→keyEvent
```

**Result**: Pressing just Ctrl does nothing. The user must press Ctrl+K (for example) to trigger a chord.

### Chord Cancellation on Focus Loss

**Issue**: What happens if the user starts a chord, then switches windows or panes?

**Solution**: The current implementation does NOT automatically cancel chords on focus loss. This is handled at the React component level:
- The `useEffect` cleanup in `dX` (chunks.110.mjs:967-969) clears the timer when the component unmounts.
- However, focus changes within the app (e.g., switching from Chat to Artifacts pane) do not unmount the keybinding provider.

```javascript
// ============================================
// dX - KeybindingSetup component with cleanup
// Location: chunks.110.mjs:962-969
// ============================================

// ORIGINAL (for source lookup):
return pX.useEffect(() => {
    Lq7();
    let W = Rq7((G) => {
        w(!0), Y(G), h(`[keybindings] Reloaded: ${G.bindings.length} bindings, ${G.warnings.length} warnings`)
    });
    return () => {
        W(), M()
    }
}, [M])

// READABLE (for understanding):
return useEffect(() => {
    // Start watching keybindings file for changes
    startFileWatcher();

    // Subscribe to reload events
    let unsubscribe = subscribeToReload((newConfig) => {
        setReloaded(true);
        updateBindings(newConfig);
        debug(`[keybindings] Reloaded: ${newConfig.bindings.length} bindings, ${newConfig.warnings.length} warnings`);
    });

    // Cleanup on unmount
    return () => {
        unsubscribe();
        clearChordTimer(); // This clears pending chord state
    };
}, [clearChordTimer]);

// Mapping: Lq7→startFileWatcher, W→unsubscribe, Rq7→subscribeToReload, G→newConfig, w→setReloaded, Y→updateBindings, M→clearChordTimer
```

**Trade-off**: This means a chord can persist across pane switches. While potentially surprising, it allows advanced workflows like "press Ctrl+K, switch to Artifacts pane, press S" (if such a cross-pane chord existed). In practice, most chords are completed within a single pane.

### Chord State During Hot-Reload

**Issue**: What happens if the user edits keybindings.json while a chord is pending?

**Solution**: The reload listener (`Nq7` in chunks.54.mjs:1793-1801) updates the bindings array, but does NOT clear the pending chord state. This can cause inconsistencies:

```javascript
// ============================================
// Nq7 - File change handler for hot-reload
// Location: chunks.54.mjs:1793-1801
// ============================================

// ORIGINAL (for source lookup):
async function Nq7(A) {
    h(`[keybindings] Detected change to ${A}`);
    try {
        let q = await Mk5();
        ZM = q.bindings, GW = q.warnings, KS1.forEach((K) => K(q))
    } catch (q) {
        h(`[keybindings] Error reloading: ${q instanceof Error?q.message:String(q)}`)
    }
}

// READABLE (for understanding):
async function onFileChange(filePath) {
    debug(`[keybindings] Detected change to ${filePath}`);
    try {
        let newConfig = await loadKeybindings();

        // Update cached bindings
        cachedBindings = newConfig.bindings;
        cachedWarnings = newConfig.warnings;

        // Notify all subscribers
        reloadSubscribers.forEach(callback => callback(newConfig));
    } catch (error) {
        debug(`[keybindings] Error reloading: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Mapping: Nq7→onFileChange, A→filePath, q→newConfig, Mk5→loadKeybindings, ZM→cachedBindings, GW→cachedWarnings, KS1→reloadSubscribers
```

**Example scenario**:
1. User presses Ctrl+K (chord starts, pending = [{ key: "k", ctrl: true }])
2. User saves keybindings.json, removing the Ctrl+K, S binding
3. User presses S
4. The system checks for matches against the NEW bindings (no Ctrl+K, S), finds none, and cancels the chord

**Result**: The pending chord is validated against the latest bindings, automatically "cancelling" if the chord definition was removed. This is the desired behavior - hot-reloads should immediately take effect.

**Key insight:** The separation of pending chord state (in React component) from binding definitions (reloadable cache) enables seamless hot-reload without complex state synchronization.
