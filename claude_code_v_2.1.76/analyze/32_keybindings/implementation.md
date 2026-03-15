# Keybindings Implementation

## Overview

Claude Code v2.1.76 provides a customizable keybinding system that supports multi-key "chords", hot-reloading from a configuration file, and context-sensitive actions. Users can define their own shortcuts in `~/.claude/keybindings.json` to override or extend the default CLI behavior.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key functions in this document:
- `KeybindingSetup` (dX) - React component providing keybinding context
- `KeybindingHandler` (x6Y) - Core event handler component
- `loadKeybindingsAsync` (Mk5) - Async file loader with validation
- `loadKeybindingsSync` (YS1) - Sync loader with caching
- `watchKeybindingsFile` (Lq7) - Chokidar-based file watcher
- `resolveKeystroke` (tK6) - Main matching orchestrator
- `CHORD_TIMEOUT_MS` (C6Y) - 1000ms chord timeout constant

---

## Key Components

### 1. Keybinding Configuration

- **File**: `~/.claude/keybindings.json`
- **Loading**: `loadKeybindingsSync` (YS1) reads the file, parses the JSON schema, and merges with defaults. `loadKeybindingsAsync` (Mk5) is the async variant used at startup.
- **Hot-Reloading**: `watchKeybindingsFile` (Lq7) uses `chokidar` to monitor the configuration file and re-initialize the system without restarting the CLI.

### 2. Event Handling

- **KeybindingSetup** (dX): A React component that wraps the UI, providing the keybinding context and managing the "chord" state. Owns the `pendingChord` state and `timerRef`.
- **KeybindingHandler** (x6Y): The core logic that receives raw keyboard events from Ink's `useInput` hook and matches them against the registered bindings.

### 3. Chord Management

The system supports multi-step sequences like `Ctrl+K, Ctrl+C`.
- **Timeout**: Hardcoded to 1000ms (`C6Y`). If the second key isn't pressed within 1 second, the chord is cancelled.
- **State**: Tracked via `pendingChord` React state and `pendingChordRef` ref (for sync access within event handlers).

---

## Key Decisions and Algorithms

### Key Matching with Chords

**What it does:** Matches incoming keystrokes against registered bindings, handling both single-key and multi-key chord sequences.

**How it works:**
1. When a key is pressed, the handler calls `resolveKeystroke` (tK6).
2. It checks the current "active contexts" (e.g., "Global", "Chat").
3. If no chord is pending:
   - It normalizes the event to a keystroke object.
   - It checks if the keystroke starts a chord sequence (prefix match). If yes, it sets the pending chord state and starts a 1000ms timer.
   - It checks if the keystroke is a complete single-key shortcut (exact match).
4. If a chord is pending:
   - It checks if the new keystroke completes the sequence (exact match with accumulated sequence).
   - If not, it cancels the chord and returns `chord_cancelled`.
5. Escape always cancels any in-progress chord.

**Why this approach:** The VS Code-style chord system allows a vast expansion of available keyboard real estate without relying on complex modifier combinations like `Ctrl+Alt+Shift+...`. Two-key chords with a common prefix (e.g., `ctrl+k ctrl+c`, `ctrl+k ctrl+s`) share the first keystroke, making them intuitive to group conceptually.

**Key insight:** The `pendingChordRef` pattern (ref + state) is critical: the ref provides synchronous access during the event handler (no stale closure), while the React state drives UI updates like the chord indicator display.

### Code Snippet: KeybindingHandler

```javascript
// ============================================
// KeybindingHandler - Core event dispatcher for keybindings
// Location: chunks.110.mjs:988-1041
// ============================================

// ORIGINAL (for source lookup):
function x6Y(A) {
    let q = e(6),
        {
            bindings: K,
            pendingChordRef: Y,
            setPendingChord: z,
            activeContexts: w,
            handlerRegistryRef: H
        } = A,
        $;
    if (q[0] !== w || q[1] !== K || q[2] !== H || q[3] !== Y || q[4] !== z) $ = (_, J, X) => {
        // ... resolve and dispatch
    }, q[0] = w, q[1] = K, q[2] = H, q[3] = Y, q[4] = z, q[5] = $;
    else $ = q[5];
    return D8($), null
}

// READABLE (for understanding):
function KeybindingHandler(props) {
    let memoSlot = useMemoSlot(6);
    let {
        bindings,
        pendingChordRef,
        setPendingChord,
        activeContexts,
        handlerRegistryRef
    } = props;

    let inputHandler;
    if (dependenciesChanged) {
        inputHandler = (inputString, keyEvent, domEvent) => {
            // Collect contexts from registered handlers
            let contextSet = new Set();
            let registry = handlerRegistryRef.current;
            if (registry) {
                for (let handlers of registry.values()) {
                    for (let h of handlers) contextSet.add(h.context);
                }
            }
            let allContexts = [...contextSet, ...activeContexts, "Global"];
            let isPendingChord = pendingChordRef.current !== null;

            // Resolve keystroke
            let result = resolveKeystroke(inputString, keyEvent, allContexts, bindings, pendingChordRef.current);

            switch (result.type) {
                case "chord_started":
                    setPendingChord(result.pending);
                    domEvent.stopImmediatePropagation();
                    break;
                case "match":
                    setPendingChord(null);
                    if (isPendingChord) {
                        // Execute first matching context handler
                        let handlers = registry?.get(result.action);
                        if (handlers) {
                            let ctxSet = new Set(allContexts);
                            for (let h of handlers) {
                                if (ctxSet.has(h.context)) {
                                    h.handler();
                                    domEvent.stopImmediatePropagation();
                                    break;
                                }
                            }
                        }
                    }
                    break;
                case "chord_cancelled":
                case "unbound":
                    setPendingChord(null);
                    break;
            }
        };
        // Cache computed inputHandler...
    } else {
        inputHandler = memoSlot[5];
    }

    useInput(inputHandler); // Register with Ink
    return null;
}

// Mapping: x6Y→KeybindingHandler, A→props, K→bindings, Y→pendingChordRef, z→setPendingChord, w→activeContexts, H→handlerRegistryRef, $→inputHandler, _→inputString, J→keyEvent, X→domEvent, tK6→resolveKeystroke, D8→useInput
```

### Hot-Reloading for Improved UX

**Why this approach:** CLI users often want to tweak their shortcuts while working. By using a file watcher, Claude Code allows users to edit `keybindings.json` and see the changes reflected immediately in the active terminal session.

**How it works:**
1. `watchKeybindingsFile` (Lq7) starts a chokidar watcher on `~/.claude/keybindings.json`.
2. Write stabilization (`awaitWriteFinish: {stabilityThreshold: 500ms, pollInterval: 200ms}`) prevents reload flicker during multi-write editor saves.
3. On file change, `onFileChange` (Nq7) calls `loadKeybindingsAsync`, updates the cached bindings, and notifies all subscribers.
4. React state update triggers re-render of `KeybindingSetup`, propagating new bindings to all child components via context.

**Edge case — chord in progress during hot-reload:** If the user is mid-chord when `keybindings.json` is saved, the pending chord state is preserved. However, if the second keystroke no longer matches any binding in the new config (because the chord was removed), the keystroke returns `chord_cancelled` and the chord is aborted cleanly.

---

## Configuration Format

```json
{
    "bindings": [
        {
            "context": "Chat",
            "bindings": {
                "ctrl+k ctrl+c": "clear_history",
                "ctrl+g": "chat:externalEditor",
                "meta+p": "chat:modelPicker",
                "/my-command": "command:my-command"
            }
        },
        {
            "context": "Global",
            "bindings": {
                "ctrl+l": null
            }
        }
    ]
}
```

**Key format rules:**
- Modifiers: `ctrl`, `alt`, `meta` (or `cmd`), `shift`
- Multi-key chords: separated by spaces (`ctrl+k ctrl+c`)
- Null action: explicitly unbinds a shortcut
- `command:` prefix: triggers a slash command from the Chat context

---

## Data Flow

```
~/.claude/keybindings.json
         |
         v
loadKeybindingsAsync (Mk5)
  → validate & merge with defaults (tqA)
  → return { bindings, warnings }
         |
         v
KeybindingSetup (dX)
  → holds bindings state
  → provides KeybindingContext (A36)
  → renders KeybindingHandler (x6Y)
         |
         v
Terminal keystroke (via Ink useInput)
         |
         v
KeybindingHandler (x6Y)
  → resolveKeystroke (tK6)
    → isPrefixMatch (tN5) / isExactMatch (eN5)
    → returns MatchResult
  → lookup handler in registry
  → execute handler (fire-and-forget)
```

---

## Key Takeaways

1. **Chord state machine**: Two-phase matching (prefix → exact) with 1000ms timeout and escape cancellation
2. **Context filtering**: 18 named contexts filter which bindings are eligible per UI state
3. **First-match-wins dispatch**: Set iteration order determines priority when multiple handlers match
4. **Hot-reload via chokidar**: File changes reload bindings without process restart
5. **Graceful degradation**: Broken config falls back to defaults, preserving usability
6. **Fire-and-forget handlers**: `() => void` signature, no async awaiting in dispatch

**Last Updated**: 2026-03-15 (Claude Code v2.1.76)
